'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const [portals, setPortals] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState({});
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  const [formData, setFormData] = useState({ customerName: '', customerPhone: '', portal: '', serviceType: 'Flight Ticket', paymentMethod: 'Cash', paidAmount: '' });
  const [items, setItems] = useState([{ item_name: 'تذاكر ذهاب وعودة', description: '', price: 0, qty: 1, vat_percent: 0 }]);
  const [rechargeData, setRechargeData] = useState({ portal: '', amount: '', description: '' });
  const [newPortalName, setNewPortalName] = useState('');
  
  // Accounting States
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', monthly_salary: 0 });
  const [paySalary, setPaySalary] = useState({ employee_id: '', amount: '', month: new Date().toISOString().slice(0, 7) });
  const [newExpense, setNewExpense] = useState({ category: 'Office Rent', amount: '', description: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
      else setUser(session.user);
    });
    fetchAllData();
  }, [router]);

  const fetchAllData = async () => {
    const { data: inv } = await supabase.from('invoices').select(`*, customers(name), portals(name)`).order('created_at', { ascending: false });
    if (inv) setInvoices(inv);

    const { data: por } = await supabase.from('portals').select('*');
    if (por) {
      setPortals(por);
      setFormData(prev => ({ ...prev, portal: prev.portal || por[0]?.name || '' }));
      setRechargeData(prev => ({ ...prev, portal: prev.portal || por[0]?.name || '' }));
    }

    const { data: rec } = await supabase.from('recharges').select(`*, portals(name)`).order('created_at', { ascending: false });
    if (rec) setRecharges(rec);

    const { data: set } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (set) setSettings(set);

    // Fetch Accounting Data
    const { data: emp } = await supabase.from('employees').select('*');
    if (emp) setEmployees(emp);
    const { data: pay } = await supabase.from('payroll').select(`*, employees(name)`).order('paid_date', { ascending: false });
    if (pay) setPayroll(pay);
    const { data: exp } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    if (exp) setExpenses(exp);
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  const handleAddPortal = async (e) => { e.preventDefault(); if(!newPortalName) return; await supabase.from('portals').insert([{ name: newPortalName, current_balance: 0 }]); setNewPortalName(''); fetchAllData(); };
  const handleItemChange = (index, e) => { const n = [...items]; n[index][e.target.name] = e.target.value; setItems(n); };
  const addItem = () => setItems([...items, { item_name: 'تذاكر ذهاب وعودة', description: '', price: 0, qty: 1, vat_percent: 0 }]);
  const removeItem = (i) => setItems(items.filter((_, x) => x !== i));

  const calcTotals = () => {
    let tbv = 0, tv = 0;
    items.forEach(it => { const sub = parseFloat(it.price) * parseInt(it.qty); tbv += sub; tv += sub * (parseFloat(it.vat_percent) / 100); });
    const tav = tbv + tv; const paid = parseFloat(formData.paidAmount) || 0; const due = tav - paid;
    return { totalBeforeVat: tbv, totalVat: tv, totalAfterVat: tav, paid, due };
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const { totalBeforeVat, totalVat, totalAfterVat, paid, due } = calcTotals();
    const invoiceNo = `INV-${Date.now()}`;
    let customerId;
    const { data: exC } = await supabase.from('customers').select('*').eq('phone', formData.customerPhone).single();
    if (exC) customerId = exC.id;
    else { const { data: nC } = await supabase.from('customers').insert([{ name: formData.customerName, phone: formData.customerPhone }]).select().single(); customerId = nC.id; }
    const { data: portal } = await supabase.from('portals').select('*').eq('name', formData.portal).single();
    const { data: invoice } = await supabase.from('invoices').insert([{ invoice_no: invoiceNo, customer_id: customerId, portal_id: portal?.id, service_type: formData.serviceType, sell_price: totalAfterVat, profit: totalBeforeVat * 0.1, vat: totalVat, total: totalAfterVat, payment_method: formData.paymentMethod, status: 'active', total_before_vat: totalBeforeVat, paid_amount: paid, due_amount: due }]).select().single();

    if (invoice) {
      await supabase.from('invoice_items').insert(items.map(it => ({ invoice_id: invoice.id, item_name: it.item_name, description: it.description, price: parseFloat(it.price), qty: parseInt(it.qty), vat_percent: parseFloat(it.vat_percent), total: parseFloat(it.price) * parseInt(it.qty) })));
      await supabase.from('portals').update({ current_balance: (portal.current_balance || 0) - totalBeforeVat }).eq('id', portal.id);
      fetchAllData();
      setItems([{ item_name: 'تذاكر ذهاب وعودة', description: '', price: 0, qty: 1, vat_percent: 0 }]);
      setFormData({ customerName: '', customerPhone: '', portal: portals[0]?.name || '', serviceType: 'Flight Ticket', paymentMethod: 'Cash', paidAmount: '' });
    }
  };

  const handleAddRecharge = async (e) => {
    e.preventDefault(); const amt = parseFloat(rechargeData.amount);
    const { data: portal } = await supabase.from('portals').select('*').eq('name', rechargeData.portal).single();
    if (portal) {
      await supabase.from('portals').update({ current_balance: (portal.current_balance || 0) + amt }).eq('id', portal.id);
      await supabase.from('recharges').insert([{ portal_id: portal.id, amount: amt, description: rechargeData.description }]);
      fetchAllData(); setRechargeData({ portal: portals[0]?.name || '', amount: '', description: '' });
    }
  };

  // Accounting Functions
  const handleAddEmployee = async (e) => { e.preventDefault(); await supabase.from('employees').insert([newEmployee]); setNewEmployee({ name: '', role: '', monthly_salary: 0 }); fetchAllData(); };
  const handlePaySalary = async (e) => { e.preventDefault(); await supabase.from('payroll').insert([{ employee_id: paySalary.employee_id, amount: parseFloat(paySalary.amount), month: paySalary.month }]); fetchAllData(); setPaySalary({ ...paySalary, amount: '' }); };
  const handleAddExpense = async (e) => { e.preventDefault(); await supabase.from('expenses').insert([{ category: newExpense.category, amount: parseFloat(newExpense.amount), description: newExpense.description }]); fetchAllData(); setNewExpense({ category: 'Office Rent', amount: '', description: '' }); };

  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading ERP...</div>;

  // Finance Calculations for Dashboard
  const totalSales = invoices.reduce((s, i) => s + i.sell_price, 0);
  const totalProfit = invoices.reduce((s, i) => s + i.profit, 0);
  const totalSalaries = payroll.reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalProfit - (totalSalaries + totalExpenses);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial' }}>
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: '#fff', display:'flex', flexDirection:'column' }}>
        <div style={{ padding: '20px', textAlign: 'center' }}><h2>Sueud Al Taayira</h2><p style={{fontSize:'12px', color:'#95a5a6'}}>صعود الطائرة</p></div>
        <nav style={{ flex: 1 }}>
          <button onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? activeStyle : inactiveStyle}>📊 Dashboard</button>
          <button onClick={() => setActiveTab('create')} style={activeTab === 'create' ? activeStyle : inactiveStyle}>🎫 Create Invoice</button>
          <button onClick={() => setActiveTab('portals')} style={activeTab === 'portals' ? activeStyle : inactiveStyle}>💰 Portals & Recharge</button>
          <button onClick={() => setActiveTab('accounting')} style={activeTab === 'accounting' ? activeStyle : inactiveStyle}>🧾 Accounting & HR</button>
          <button onClick={() => setActiveTab('reports')} style={activeTab === 'reports' ? activeStyle : inactiveStyle}>📈 Reports</button>
          <button onClick={() => router.push('/settings')} style={inactiveStyle}>⚙️ Settings</button>
        </nav>
        <div style={{ padding: '20px' }}><button onClick={handleLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer' }}>Logout</button></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
        
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <div style={cardStyle}><h4>Total Sales</h4><h2 style={{color:'#2980b9'}}>{totalSales.toFixed(0)} SAR</h2></div>
              <div style={cardStyle}><h4>Gross Profit</h4><h2 style={{color:'#27ae60'}}>{totalProfit.toFixed(0)} SAR</h2></div>
              <div style={cardStyle}><h4>Net Profit</h4><h2 style={{color: netProfit > 0 ? '#27ae60' : '#e74c3c'}}>{netProfit.toFixed(0)} SAR</h2></div>
            </div>
            <h2>Recent Invoices</h2>
            <table style={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px', borderCollapse: 'collapse' }}>
              <thead><tr style={{ backgroundColor: '#f8f9fa' }}><th style={thStyle}>Inv No</th><th style={thStyle}>Customer</th><th style={thStyle}>Total</th><th style={thStyle}>Due</th></tr></thead>
              <tbody>{invoices.slice(0, 5).map(inv => (<tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}><td style={tdStyle}>{inv.invoice_no}</td><td style={tdStyle}>{inv.customers?.name}</td><td style={tdStyle}>{inv.total} SAR</td><td style={tdStyle}>{inv.due_amount} SAR</td></tr>))}</tbody>
            </table>
          </div>
        )}

        {activeTab === 'create' && (
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h2>Create New Invoice</h2>
            <form onSubmit={handleCreateInvoice}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <input name="customerName" placeholder="Customer Name" onChange={(e) => setFormData({...formData, customerName: e.target.value})} required style={inputStyle} />
                <input name="customerPhone" placeholder="Phone Number" onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} required style={inputStyle} />
                <select name="serviceType" onChange={(e) => setFormData({...formData, serviceType: e.target.value})} style={inputStyle}><option>Flight Ticket</option><option>Hotel</option><option>Visa</option><option>Package</option><option>Railway Ticket</option><option>Reissue Ticket</option></select>
                <select name="portal" onChange={(e) => setFormData({...formData, portal: e.target.value})} style={inputStyle} required>{portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select>
                <select name="paymentMethod" onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} style={inputStyle}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option></select>
                <input name="paidAmount" type="number" placeholder="Paid Amount (SAR)" onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} style={inputStyle} />
              </div>
              <h3>Items (Tickets/Services)</h3>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input name="item_name" placeholder="Item Name" value={item.item_name} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="description" placeholder="Description (JED-LKO)" value={item.description} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="price" type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="qty" type="number" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="vat_percent" type="number" placeholder="VAT %" value={item.vat_percent} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <button type="button" onClick={() => removeItem(index)} style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius:'4px' }}>X</button>
                </div>
              ))}
              <button type="button" onClick={addItem} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>+ Add Item</button>
              <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '18px' }}><b>Total: {calcTotals().totalAfterVat.toFixed(2)} SAR | Due (Credit): {calcTotals().due.toFixed(2)} SAR</b></div>
              <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '20px', fontSize: '16px' }}>SAVE & GENERATE INVOICE</button>
            </form>
          </div>
        )}

        {activeTab === 'portals' && (
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                <h3>💰 Add Recharge</h3>
                <form onSubmit={handleAddRecharge} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <select name="portal" onChange={(e) => setRechargeData({...rechargeData, portal: e.target.value})} style={inputStyle}>{portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select>
                  <input name="amount" type="number" placeholder="Amount" onChange={(e) => setRechargeData({...rechargeData, amount: e.target.value})} required style={inputStyle} />
                  <input name="description" placeholder="Description" onChange={(e) => setRechargeData({...rechargeData, description: e.target.value})} style={inputStyle} />
                  <button type="submit" style={{ padding: '10px', backgroundColor: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer' }}>Recharge</button>
                </form>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                <h3>🏢 Add New Portal</h3>
                <form onSubmit={handleAddPortal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" placeholder="Portal Name" value={newPortalName} onChange={(e) => setNewPortalName(e.target.value)} style={inputStyle} required />
                  <button type="submit" style={{ padding: '10px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer' }}>Add Portal</button>
                </form>
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>Current Balances</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {portals.map(p => <div key={p.id} style={{ flex: 1, padding: '15px', backgroundColor: '#f8f9fa', textAlign: 'center', borderRadius: '8px' }}><h4>{p.name}</h4><h3 style={{color: p.current_balance < 0 ? 'red' : 'green'}}>{p.current_balance || 0} SAR</h3></div>)}
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNTING & HR MODULE */}
        {activeTab === 'accounting' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            
            {/* Add Employee */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>👤 Add Employee</h3>
              <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} required style={inputStyle} />
                <input placeholder="Role (e.g. Accountant)" value={newEmployee.role} onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})} style={inputStyle} />
                <input type="number" placeholder="Monthly Salary" value={newEmployee.monthly_salary} onChange={(e) => setNewEmployee({...newEmployee, monthly_salary: e.target.value})} required style={inputStyle} />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer' }}>Add Staff</button>
              </form>
            </div>

            {/* Pay Salary */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>💸 Pay Salary</h3>
              <form onSubmit={handlePaySalary} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select value={paySalary.employee_id} onChange={(e) => setPaySalary({...paySalary, employee_id: e.target.value})} required style={inputStyle}>
                  <option value="">Select Employee</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
                <input type="number" placeholder="Amount Paid" value={paySalary.amount} onChange={(e) => setPaySalary({...paySalary, amount: e.target.value})} required style={inputStyle} />
                <input type="month" value={paySalary.month} onChange={(e) => setPaySalary({...paySalary, month: e.target.value})} required style={inputStyle} />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#8e44ad', color: '#fff', border: 'none', cursor: 'pointer' }}>Record Payment</button>
              </form>
            </div>

            {/* Add Expense */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>🧾 Add Office Expense</h3>
              <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})} style={inputStyle}>
                  <option>Office Rent</option><option>Electricity/Water</option><option>Internet</option><option>Office Supplies</option><option>Miscellaneous</option>
                </select>
                <input type="number" placeholder="Amount" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} required style={inputStyle} />
                <input placeholder="Description" value={newExpense.description} onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} style={inputStyle} />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#c0392b', color: '#fff', border: 'none', cursor: 'pointer' }}>Add Expense</button>
              </form>
            </div>

            {/* Accounting Lists */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', gridColumn: 'span 3' }}>
              <h3>📋 Salary & Expense History</h3>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <h4>Salaries Paid ({totalSalaries} SAR)</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <tbody>
                      {payroll.map(p => (<tr key={p.id} style={{ borderBottom: '1px solid #eee' }}><td style={tdStyle}>{p.employees?.name}</td><td style={tdStyle}>{p.month}</td><td style={{...tdStyle, color:'red'}}>-{p.amount} SAR</td></tr>))}
                    </tbody>
                  </table>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>Office Expenses ({totalExpenses} SAR)</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <tbody>
                      {expenses.map(ex => (<tr key={ex.id} style={{ borderBottom: '1px solid #eee' }}><td style={tdStyle}>{ex.category}</td><td style={tdStyle}>{new Date(ex.expense_date).toLocaleDateString()}</td><td style={{...tdStyle, color:'red'}}>-{ex.amount} SAR</td></tr>))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <div style={cardStyle}><h4>Gross Profit (Sales)</h4><h2 style={{color:'green'}}>{totalProfit.toFixed(0)} SAR</h2></div>
              <div style={cardStyle}><h4>Salaries Paid</h4><h2 style={{color:'red'}}>-{totalSalaries.toFixed(0)} SAR</h2></div>
              <div style={cardStyle}><h4>Office Expenses</h4><h2 style={{color:'red'}}>-{totalExpenses.toFixed(0)} SAR</h2></div>
              <div style={cardStyle}><h4>Net Profit</h4><h2 style={{color: netProfit > 0 ? 'green' : 'red'}}>{netProfit.toFixed(0)} SAR</h2></div>
            </div>
            <h2>All Invoices</h2>
            <table style={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px', borderCollapse: 'collapse' }}>
              <thead><tr style={{ backgroundColor: '#f8f9fa' }}><th style={thStyle}>Inv No</th><th style={thStyle}>Customer</th><th style={thStyle}>Service</th><th style={thStyle}>Portal</th><th style={thStyle}>Total</th><th style={thStyle}>Profit</th></tr></thead>
              <tbody>{invoices.map(inv => (<tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}><td style={tdStyle}>{inv.invoice_no}</td><td style={tdStyle}>{inv.customers?.name}</td><td style={tdStyle}>{inv.service_type}</td><td style={tdStyle}>{inv.portals?.name}</td><td style={tdStyle}>{inv.total} SAR</td><td style={{...tdStyle, color:'green'}}>{inv.profit.toFixed(0)} SAR</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const activeStyle = { display: 'block', width: '100%', textAlign: 'left', padding: '15px 25px', backgroundColor: '#34495e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const inactiveStyle = { display: 'block', width: '100%', textAlign: 'left', padding: '15px 25px', backgroundColor: 'transparent', color: '#ecf0f1', border: 'none', cursor: 'pointer', fontSize: '16px' };
const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', flex: 1 };
const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' };
const thStyle = { padding: '12px 15px', textAlign: 'left', fontSize: '14px' };
const tdStyle = { padding: '12px 15px', fontSize: '14px' };
