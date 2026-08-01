'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const router = useRouter();

  // Data States
  const [invoices, setInvoices] = useState([]);
  const [portals, setPortals] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState({});

  // Form States
  const [invForm, setInvForm] = useState({ customerName: '', customerPhone: '', portal: '', serviceType: 'Flight Ticket', paymentMethod: 'Cash', paidAmount: '' });
  const [items, setItems] = useState([{ item_name: 'تذاكر', description: '', price: 0, qty: 1, vat_percent: 0 }]);
  const [rechargeForm, setRechargeForm] = useState({ portal: '', amount: '', description: '' });
  const [newPortal, setNewPortal] = useState('');
  const [empForm, setEmpForm] = useState({ name: '', role: '', monthly_salary: 0 });
  const [payForm, setPayForm] = useState({ employee_id: '', amount: '', month: new Date().toISOString().slice(0, 7) });
  const [expForm, setExpForm] = useState({ category: 'Office Rent', amount: '', description: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
      else { setUser(session.user); fetchAllData(); }
    });
  }, [router]);

  const fetchAllData = async () => {
    const { data: i } = await supabase.from('invoices').select(`*, customers(name), portals(name)`).order('created_at', { ascending: false });
    if (i) setInvoices(i);
    const { data: p } = await supabase.from('portals').select('*');
    if (p) { setPortals(p); setInvForm(f => ({...f, portal: p[0]?.name || ''})); setRechargeForm(f => ({...f, portal: p[0]?.name || ''})); }
    const { data: r } = await supabase.from('recharges').select(`*, portals(name)`).order('created_at', { ascending: false });
    if (r) setRecharges(r);
    const { data: e } = await supabase.from('employees').select('*');
    if (e) setEmployees(e);
    const { data: pr } = await supabase.from('payroll').select(`*, employees(name)`).order('paid_date', { ascending: false });
    if (pr) setPayroll(pr);
    const { data: ex } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    if (ex) setExpenses(ex);
    const { data: s } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (s) setSettings(s);
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  // --- LOGICS ---
  const calcTotals = () => {
    let tbv = 0, tv = 0;
    items.forEach(it => { const sub = parseFloat(it.price) * parseInt(it.qty); tbv += sub; tv += sub * (parseFloat(it.vat_percent) / 100); });
    const tav = tbv + tv; const paid = parseFloat(invForm.paidAmount) || 0; const due = tav - paid;
    return { tbv, tv, tav, paid, due };
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const { tbv, tv, tav, paid, due } = calcTotals();
    const invoiceNo = `INV-${Date.now()}`;
    let customerId;
    const { data: exC } = await supabase.from('customers').select('*').eq('phone', invForm.customerPhone).single();
    if (exC) customerId = exC.id;
    else { const { data: nC } = await supabase.from('customers').insert([{ name: invForm.customerName, phone: invForm.customerPhone }]).select().single(); customerId = nC.id; }
    
    const { data: portal } = await supabase.from('portals').select('*').eq('name', invForm.portal).single();
    const { data: inv } = await supabase.from('invoices').insert([{ 
      invoice_no: invoiceNo, customer_id: customerId, portal_id: portal?.id, service_type: invForm.serviceType,
      total_before_vat: tbv, vat: tv, total: tav, paid_amount: paid, due_amount: due, profit: tbv * 0.1, 
      payment_method: invForm.paymentMethod, status: 'active' 
    }]).select().single();

    if (inv) {
      await supabase.from('invoice_items').insert(items.map(it => ({ invoice_id: inv.id, item_name: it.item_name, description: it.description, price: parseFloat(it.price), qty: parseInt(it.qty), vat_percent: parseFloat(it.vat_percent), total: parseFloat(it.price) * parseInt(it.qty) })));
      await supabase.from('portals').update({ current_balance: (portal.current_balance || 0) - tbv }).eq('id', portal.id);
      alert('Invoice Created Successfully!');
      fetchAllData();
      setItems([{ item_name: 'تذاكر', description: '', price: 0, qty: 1, vat_percent: 0 }]);
      setInvForm({ customerName: '', customerPhone: '', portal: portals[0]?.name || '', serviceType: 'Flight Ticket', paymentMethod: 'Cash', paidAmount: '' });
    }
  };

  const handleRecharge = async (e) => { e.preventDefault(); const amt = parseFloat(rechargeForm.amount); const { data: p } = await supabase.from('portals').select('*').eq('name', rechargeForm.portal).single(); if(p){ await supabase.from('portals').update({ current_balance: (p.current_balance||0) + amt }).eq('id', p.id); await supabase.from('recharges').insert([{ portal_id: p.id, amount: amt, description: rechargeForm.description }]); fetchAllData(); setRechargeForm({ portal: portals[0]?.name || '', amount: '', description: '' }); } };
  const handleAddPortal = async (e) => { e.preventDefault(); await supabase.from('portals').insert([{ name: newPortal, current_balance: 0 }]); setNewPortal(''); fetchAllData(); };
  const handleAddEmp = async (e) => { e.preventDefault(); await supabase.from('employees').insert([empForm]); setEmpForm({ name: '', role: '', monthly_salary: 0 }); fetchAllData(); };
  const handlePaySalary = async (e) => { e.preventDefault(); await supabase.from('payroll').insert([{ employee_id: payForm.employee_id, amount: parseFloat(payForm.amount), month: payForm.month }]); fetchAllData(); };
  const handleAddExp = async (e) => { e.preventDefault(); await supabase.from('expenses').insert([{ category: expForm.category, amount: parseFloat(expForm.amount), description: expForm.description }]); fetchAllData(); };

  // --- FINANCE CALC ---
  const totalSales = invoices.reduce((s, i) => s + i.total, 0);
  const grossProfit = invoices.reduce((s, i) => s + i.profit, 0);
  const totalSalaries = payroll.reduce((s, p) => s + p.amount, 0);
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = grossProfit - (totalSalaries + totalExp);

  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Enterprise ERP...</div>;

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h1 style={styles.logo}>Sueud Al Taayira</h1>
        <p style={styles.subLogo}>صعود الطائرة</p>
        <nav style={styles.nav}>
          <button style={activeModule === 'dashboard' ? styles.navActive : styles.navLink} onClick={() => setActiveModule('dashboard')}>📊 Dashboard</button>
          <button style={activeModule === 'sales' ? styles.navActive : styles.navLink} onClick={() => setActiveModule('sales')}>🎫 Sales & Invoicing</button>
          <button style={activeModule === 'portals' ? styles.navActive : styles.navLink} onClick={() => setActiveModule('portals')}>💰 Portals & Balance</button>
          <button style={activeModule === 'hr' ? styles.navActive : styles.navLink} onClick={() => setActiveModule('hr')}>👥 HR & Payroll</button>
          <button style={activeModule === 'accounting' ? styles.navActive : styles.navLink} onClick={() => setActiveModule('accounting')}>🧾 Accounting</button>
          <button style={styles.navLink} onClick={() => router.push('/settings')}>⚙️ Settings</button>
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <header style={styles.topbar}>
          <h2 style={{ textTransform: 'capitalize' }}>{activeModule} Module</h2>
          <span style={styles.userInfo}>Welcome, <b>{user.email}</b></span>
        </header>

        <div style={styles.content}>
          
          {/* DASHBOARD MODULE */}
          {activeModule === 'dashboard' && (
            <div>
              <div style={styles.cardGrid}>
                <div style={styles.kpiCard}><h3>Total Sales</h3><h1 style={{color:'#3498db'}}>{totalSales.toFixed(0)} SAR</h1></div>
                <div style={styles.kpiCard}><h3>Gross Profit</h3><h1 style={{color:'#27ae60'}}>{grossProfit.toFixed(0)} SAR</h1></div>
                <div style={styles.kpiCard}><h3>Net Profit</h3><h1 style={{color: netProfit > 0 ? '#27ae60' : '#e74c3c'}}>{netProfit.toFixed(0)} SAR</h1></div>
              </div>
              <div style={styles.tableCard}>
                <h3>Recent Invoices</h3>
                <table style={styles.table}>
                  <thead><tr><th>Invoice No</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>{invoices.slice(0, 5).map(inv => (<tr key={inv.id}><td>{inv.invoice_no}</td><td>{inv.customers?.name}</td><td>{inv.total} SAR</td><td>{inv.due_amount > 0 ? 'Credit' : 'Paid'}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* SALES MODULE */}
          {activeModule === 'sales' && (
            <div style={styles.tableCard}>
              <h3>Create New Invoice</h3>
              <form onSubmit={handleCreateInvoice}>
                <div style={styles.formGrid}>
                  <input placeholder="Customer Name" onChange={(e) => setInvForm({...invForm, customerName: e.target.value})} required style={styles.input} />
                  <input placeholder="Phone" onChange={(e) => setInvForm({...invForm, customerPhone: e.target.value})} required style={styles.input} />
                  <select onChange={(e) => setInvForm({...invForm, serviceType: e.target.value})} style={styles.input}><option>Flight Ticket</option><option>Hotel</option><option>Visa</option><option>Package</option><option>Railway</option><option>Reissue</option></select>
                  <select onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.input}>{portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <select onChange={(e) => setInvForm({...invForm, paymentMethod: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option></select>
                  <input type="number" placeholder="Paid Amount" onChange={(e) => setInvForm({...invForm, paidAmount: e.target.value})} style={styles.input} />
                </div>
                <h4 style={{marginTop:'20px'}}>Items / Tickets</h4>
                {items.map((item, i) => (
                  <div key={i} style={{display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr 0.5fr', gap:'10px', marginBottom:'10px'}}>
                    <input placeholder="Item Name" value={item.item_name} onChange={(e) => { const n=[...items]; n[i].item_name=e.target.value; setItems(n); }} style={styles.input} />
                    <input placeholder="Description" value={item.description} onChange={(e) => { const n=[...items]; n[i].description=e.target.value; setItems(n); }} style={styles.input} />
                    <input type="number" placeholder="Price" value={item.price} onChange={(e) => { const n=[...items]; n[i].price=e.target.value; setItems(n); }} style={styles.input} />
                    <input type="number" placeholder="Qty" value={item.qty} onChange={(e) => { const n=[...items]; n[i].qty=e.target.value; setItems(n); }} style={styles.input} />
                    <input type="number" placeholder="VAT%" value={item.vat_percent} onChange={(e) => { const n=[...items]; n[i].vat_percent=e.target.value; setItems(n); }} style={styles.input} />
                    <button type="button" onClick={() => setItems(items.filter((_, x) => x !== i))} style={styles.dangerBtn}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => setItems([...items, { item_name: '', description: '', price: 0, qty: 1, vat_percent: 0 }])} style={styles.secondaryBtn}>+ Add Item</button>
                <div style={{marginTop:'15px', fontSize:'18px', fontWeight:'bold'}}>Total: {calcTotals().tav.toFixed(2)} SAR | Due: {calcTotals().due.toFixed(2)} SAR</div>
                <button type="submit" style={styles.primaryBtn}>Save Invoice</button>
              </form>
            </div>
          )}

          {/* PORTALS MODULE */}
          {activeModule === 'portals' && (
            <div style={styles.moduleGrid}>
              <div style={styles.tableCard}>
                <h3>Recharge Portal</h3>
                <form onSubmit={handleRecharge} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select onChange={(e) => setRechargeForm({...rechargeForm, portal: e.target.value})} style={styles.input}>{portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <input type="number" placeholder="Amount" onChange={(e) => setRechargeForm({...rechargeForm, amount: e.target.value})} required style={styles.input} />
                  <input placeholder="Description" onChange={(e) => setRechargeForm({...rechargeForm, description: e.target.value})} style={styles.input} />
                  <button type="submit" style={styles.successBtn}>Recharge</button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3>Add New Portal</h3>
                <form onSubmit={handleAddPortal} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input placeholder="Portal Name (e.g. Flyadeal)" value={newPortal} onChange={(e) => setNewPortal(e.target.value)} required style={styles.input} />
                  <button type="submit" style={styles.primaryBtn}>Add Portal</button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3>Balances</h3>
                <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                  {portals.map(p => <div key={p.id} style={styles.balanceCard}><h4>{p.name}</h4><h3 style={{color: p.current_balance < 0 ? 'red' : 'green'}}>{p.current_balance || 0} SAR</h3></div>)}
                </div>
              </div>
              <div style={styles.tableCard}>
                <h3>Recharge History</h3>
                <table style={styles.table}><thead><tr><th>Date</th><th>Portal</th><th>Amount</th></tr></thead><tbody>{recharges.map(r => <tr key={r.id}><td>{new Date(r.created_at).toLocaleDateString()}</td><td>{r.portals?.name}</td><td style={{color:'green'}}>+{r.amount}</td></tr>)}</tbody></table>
              </div>
            </div>
          )}

          {/* HR MODULE */}
          {activeModule === 'hr' && (
            <div style={styles.moduleGrid}>
              <div style={styles.tableCard}>
                <h3>Add Employee</h3>
                <form onSubmit={handleAddEmp} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input placeholder="Name" value={empForm.name} onChange={(e) => setEmpForm({...empForm, name: e.target.value})} required style={styles.input} />
                  <input placeholder="Role" value={empForm.role} onChange={(e) => setEmpForm({...empForm, role: e.target.value})} style={styles.input} />
                  <input type="number" placeholder="Monthly Salary" value={empForm.monthly_salary} onChange={(e) => setEmpForm({...empForm, monthly_salary: e.target.value})} required style={styles.input} />
                  <button type="submit" style={styles.primaryBtn}>Add Staff</button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3>Pay Salary</h3>
                <form onSubmit={handlePaySalary} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select onChange={(e) => setPayForm({...payForm, employee_id: e.target.value})} required style={styles.input}><option value="">Select Employee</option>{employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}</select>
                  <input type="number" placeholder="Amount" value={payForm.amount} onChange={(e) => setPayForm({...payForm, amount: e.target.value})} required style={styles.input} />
                  <input type="month" value={payForm.month} onChange={(e) => setPayForm({...payForm, month: e.target.value})} style={styles.input} />
                  <button type="submit" style={styles.warningBtn}>Record Payment</button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3>Staff List</h3>
                <table style={styles.table}><thead><tr><th>Name</th><th>Role</th><th>Salary</th></tr></thead><tbody>{employees.map(e => <tr key={e.id}><td>{e.name}</td><td>{e.role}</td><td>{e.monthly_salary} SAR</td></tr>)}</tbody></table>
              </div>
              <div style={styles.tableCard}>
                <h3>Payroll History</h3>
                <table style={styles.table}><thead><tr><th>Employee</th><th>Month</th><th>Paid</th></tr></thead><tbody>{payroll.map(p => <tr key={p.id}><td>{p.employees?.name}</td><td>{p.month}</td><td style={{color:'red'}}>-{p.amount}</td></tr>)}</tbody></table>
              </div>
            </div>
          )}

          {/* ACCOUNTING MODULE */}
          {activeModule === 'accounting' && (
            <div style={styles.moduleGrid}>
              <div style={styles.tableCard}>
                <h3>Add Office Expense</h3>
                <form onSubmit={handleAddExp} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select onChange={(e) => setExpForm({...expForm, category: e.target.value})} style={styles.input}><option>Office Rent</option><option>Electricity</option><option>Internet</option><option>Supplies</option><option>Misc</option></select>
                  <input type="number" placeholder="Amount" value={expForm.amount} onChange={(e) => setExpForm({...expForm, amount: e.target.value})} required style={styles.input} />
                  <input placeholder="Description" value={expForm.description} onChange={(e) => setExpForm({...expForm, description: e.target.value})} style={styles.input} />
                  <button type="submit" style={styles.dangerBtn}>Add Expense</button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3>Profit & Loss Statement</h3>
                <div style={{padding:'10px'}}>
                  <p>Gross Profit (Sales): <b style={{color:'green'}}>{grossProfit.toFixed(0)} SAR</b></p>
                  <p>Salaries Paid: <b style={{color:'red'}}>-{totalSalaries.toFixed(0)} SAR</b></p>
                  <p>Office Expenses: <b style={{color:'red'}}>-{totalExp.toFixed(0)} SAR</b></p>
                  <h3 style={{borderTop:'2px solid #000', marginTop:'10px', paddingTop:'10px'}}>Net Profit: {netProfit.toFixed(0)} SAR</h3>
                </div>
              </div>
              <div style={styles.tableCard}>
                <h3>Expense History</h3>
                <table style={styles.table}><thead><tr><th>Category</th><th>Date</th><th>Amount</th></tr></thead><tbody>{expenses.map(e => <tr key={e.id}><td>{e.category}</td><td>{new Date(e.expense_date).toLocaleDateString()}</td><td style={{color:'red'}}>-{e.amount}</td></tr>)}</tbody></table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- PROFESSIONAL UI STYLES ---
const styles = {
  layout: { display: 'flex', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#1e1e2d', color: '#fff', display: 'flex', flexDirection: 'column', padding: '20px 0' },
  logo: { fontSize: '22px', textAlign: 'center', margin: '0', padding: '0 20px' },
  subLogo: { fontSize: '14px', textAlign: 'center', color: '#888', marginTop: '5px', marginBottom: '30px' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column' },
  navLink: { background: 'none', border: 'none', color: '#a2a5b9', textAlign: 'left', padding: '15px 25px', fontSize: '16px', cursor: 'pointer', transition: '0.2s' },
  navActive: { background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '15px 25px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#2d2d44', borderLeft: '4px solid #3498db' },
  logoutBtn: { margin: '20px', padding: '12px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  topbar: { backgroundColor: '#fff', padding: '15px 30px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  userInfo: { fontSize: '14px', color: '#555' },
  content: { padding: '30px', overflowY: 'auto' },
  cardGrid: { display: 'flex', gap: '20px', marginBottom: '30px' },
  kpiCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', flex: 1 },
  tableCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' },
  moduleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' },
  input: { padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', width: '100%' },
  primaryBtn: { padding: '12px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
  successBtn: { padding: '12px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
  warningBtn: { padding: '12px', backgroundColor: '#f39c12', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
  dangerBtn: { padding: '12px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
  secondaryBtn: { padding: '10px 15px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '10px' },
  balanceCard: { flex: 1, padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center', minWidth: '150px' }
};
