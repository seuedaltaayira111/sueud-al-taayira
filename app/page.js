'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('sales'); // owner, sales, accountant
  const [activePage, setActivePage] = useState('dashboard');
  const router = useRouter();

  // Data States
  const [invoices, setInvoices] = useState([]);
  const [portals, setPortals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payroll, setPayroll] = useState([]);

  // Form States
  const [invForm, setInvForm] = useState({ customerName: '', customerPhone: '', portal: '', serviceType: 'Flight Ticket', paymentMethod: 'Cash', paidAmount: '' });
  const [items, setItems] = useState([{ item_name: 'تذاكر', description: 'JED-LKO', price: 1000, qty: 1, vat_percent: 15 }]);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        const email = session.user.email;
        setUser(session.user);
        // Role detection based on email
        if (email === 'atallah@sueud.com') setUserRole('owner');
        else if (email === 'finance@sueud.com') setUserRole('accountant');
        else setUserRole('sales');
        fetchData();
      }
    });
  }, [router]);

  const fetchData = async () => {
    const { data: inv } = await supabase.from('invoices').select(`*, customers(name), portals(name)`).order('created_at', { ascending: false });
    if (inv) setInvoices(inv);
    
    const { data: p } = await supabase.from('portals').select('*');
    if (p) { setPortals(p); setInvForm(f => ({...f, portal: p[0]?.name || ''})); }
    
    const { data: e } = await supabase.from('employees').select('*');
    if (e) setEmployees(e);
    
    const { data: ex } = await supabase.from('expenses').select('*');
    if (ex) setExpenses(ex);
    
    const { data: pr } = await supabase.from('payroll').select(`*, employees(name)`);
    if (pr) setPayroll(pr);
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  // --- LOGIC: Create Invoice ---
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    let tbv = 0, tv = 0;
    items.forEach(it => { const sub = parseFloat(it.price) * parseInt(it.qty); tbv += sub; tv += sub * (parseFloat(it.vat_percent) / 100); });
    const tav = tbv + tv; const paid = parseFloat(invForm.paidAmount) || 0; const due = tav - paid;
    
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
      alert('Success: Invoice Generated & Saved!');
      fetchData();
      setInvForm({ customerName: '', customerPhone: '', portal: portals[0]?.name || '', serviceType: 'Flight Ticket', paymentMethod: 'Cash', paidAmount: '' });
      setActivePage('list_invoices');
    }
  };

  // --- LOGIC: HR & Accounting ---
  const handleAddEmployee = async (e) => { e.preventDefault(); const f = new FormData(e.target); await supabase.from('employees').insert([{ name: f.get('name'), role: f.get('role'), monthly_salary: f.get('salary') }]); alert('Employee Added!'); fetchData(); };
  const handlePaySalary = async (e) => { e.preventDefault(); const f = new FormData(e.target); await supabase.from('payroll').insert([{ employee_id: f.get('emp_id'), amount: f.get('amount'), month: f.get('month') }]); alert('Salary Paid!'); fetchData(); };
  const handleAddExpense = async (e) => { e.preventDefault(); const f = new FormData(e.target); await supabase.from('expenses').insert([{ category: f.get('category'), amount: f.get('amount'), description: f.get('desc') }]); alert('Expense Recorded!'); fetchData(); };
  const handleRecharge = async (e) => { e.preventDefault(); const f = new FormData(e.target); const amt = parseFloat(f.get('amount')); const pName = f.get('portal'); const { data: p } = await supabase.from('portals').select('*').eq('name', pName).single(); if(p){ await supabase.from('portals').update({ current_balance: (p.current_balance||0) + amt }).eq('id', p.id); await supabase.from('recharges').insert([{ portal_id: p.id, amount: amt, description: f.get('desc') }]); alert('Portal Recharged!'); fetchData(); } };

  if (!user) return <div style={{ padding: 50, textAlign: 'center' }}>Loading Enterprise System...</div>;

  // --- MENU BASED ON ROLE ---
  const menu = [
    { id: 'dashboard', label: '📊 Dashboard', roles: ['owner', 'sales', 'accountant'] },
    { id: 'create_invoice', label: '🎫 Sales: Create Invoice', roles: ['owner', 'sales'] },
    { id: 'list_invoices', label: '📋 Sales: View Invoices', roles: ['owner', 'sales', 'accountant'] },
    { id: 'portals', label: '💰 Admin: Portals & Recharge', roles: ['owner', 'sales'] },
    { id: 'hr_employees', label: '👥 HR: Add Employee', roles: ['owner'] },
    { id: 'hr_payroll', label: '💸 HR: Pay Salary', roles: ['owner', 'accountant'] },
    { id: 'acc_expenses', label: '🧾 Acc: Add Expense', roles: ['owner', 'accountant'] },
    { id: 'acc_reports', label: '📈 Acc: P&L Reports', roles: ['owner', 'accountant'] },
  ];

  const totalSales = invoices.reduce((s, i) => s + i.total, 0);
  const grossProfit = invoices.reduce((s, i) => s + i.profit, 0);
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const totalSalaries = payroll.reduce((s, p) => s + p.amount, 0);
  const netProfit = grossProfit - (totalSalaries + totalExp);

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h1 style={styles.logo}>Sueud Al Taayira</h1>
        <p style={styles.subLogo}>صعود الطائرة للسفر السياحة</p>
        <div style={{padding: '10px 20px', fontSize: '12px', color: '#888', textTransform: 'uppercase'}}>Role: {userRole}</div>
        <nav style={styles.nav}>
          {menu.filter(m => m.roles.includes(userRole)).map(m => (
            <button key={m.id} style={activePage === m.id ? styles.navActive : styles.navLink} onClick={() => setActivePage(m.id)}>{m.label}</button>
          ))}
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>🚪 Logout ({user.email.split('@')[0]})</button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        {/* TOPBAR HEADING */}
        <header style={styles.topbar}>
          <h2 style={{ margin: 0 }}>
            {menu.find(m => m.id === activePage)?.label || 'Dashboard'}
          </h2>
          <span>{new Date().toLocaleDateString()}</span>
        </header>

        <div style={styles.content}>
          
          {/* DASHBOARD */}
          {activePage === 'dashboard' && (
            <div>
              <div style={styles.cardGrid}>
                <div style={styles.kpiCard}><h3>Total Sales</h3><h1 style={{color:'#2980b9'}}>{totalSales.toFixed(0)} SAR</h1></div>
                <div style={styles.kpiCard}><h3>Gross Profit</h3><h1 style={{color:'#27ae60'}}>{grossProfit.toFixed(0)} SAR</h1></div>
                <div style={styles.kpiCard}><h3>Net Profit</h3><h1 style={{color: netProfit>0?'#27ae60':'#e74c3c'}}>{netProfit.toFixed(0)} SAR</h1></div>
              </div>
            </div>
          )}

          {/* SALES: CREATE INVOICE */}
          {activePage === 'create_invoice' && (
            <div style={styles.formCard}>
              <h3 style={styles.formHeading}>Create New Tax Invoice</h3>
              <form onSubmit={handleCreateInvoice}>
                <h4 style={styles.subHeading}>Customer Details</h4>
                <div style={styles.formGrid}>
                  <input placeholder="Customer Full Name" onChange={(e) => setInvForm({...invForm, customerName: e.target.value})} required style={styles.input} />
                  <input placeholder="Contact Number" onChange={(e) => setInvForm({...invForm, customerPhone: e.target.value})} required style={styles.input} />
                </div>
                
                <h4 style={styles.subHeading}>Service & Payment Details</h4>
                <div style={styles.formGrid}>
                  <select onChange={(e) => setInvForm({...invForm, serviceType: e.target.value})} style={styles.input}>
                    <option>Flight Ticket</option><option>Hotel Booking</option><option>Tourist Visa</option><option>Holiday Package</option><option>Railway Ticket</option><option>Reissue Ticket</option>
                  </select>
                  <select onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.input}>
                    {portals.map(p => <option key={p.id}>{p.name}</option>)}
                  </select>
                  <select onChange={(e) => setInvForm({...invForm, paymentMethod: e.target.value})} style={styles.input}>
                    <option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit (Due)</option>
                  </select>
                  <input type="number" placeholder="Paid Amount (SAR)" onChange={(e) => setInvForm({...invForm, paidAmount: e.target.value})} style={styles.input} />
                </div>

                <h4 style={styles.subHeading}>Ticket Items (Add Multiple)</h4>
                {items.map((item, i) => (
                  <div key={i} style={{display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr 0.5fr', gap:'10px', marginBottom:'10px'}}>
                    <input placeholder="Item Name" value={item.item_name} onChange={(e) => { const n=[...items]; n[i].item_name=e.target.value; setItems(n); }} required style={styles.input} />
                    <input placeholder="Description (Sector)" value={item.description} onChange={(e) => { const n=[...items]; n[i].description=e.target.value; setItems(n); }} required style={styles.input} />
                    <input type="number" placeholder="Price" value={item.price} onChange={(e) => { const n=[...items]; n[i].price=e.target.value; setItems(n); }} required style={styles.input} />
                    <input type="number" placeholder="Qty" value={item.qty} onChange={(e) => { const n=[...items]; n[i].qty=e.target.value; setItems(n); }} required style={styles.input} />
                    <input type="number" placeholder="VAT %" value={item.vat_percent} onChange={(e) => { const n=[...items]; n[i].vat_percent=e.target.value; setItems(n); }} required style={styles.input} />
                    <button type="button" onClick={() => setItems(items.filter((_, x) => x !== i))} style={styles.dangerBtn}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => setItems([...items, { item_name: '', description: '', price: 0, qty: 1, vat_percent: 15 }])} style={styles.secondaryBtn}>+ Add Another Ticket/Item</button>
                
                <button type="submit" style={styles.primaryBtn}>Generate & Save Invoice</button>
              </form>
            </div>
          )}

          {/* SALES: LIST INVOICES */}
          {activePage === 'list_invoices' && (
            <div style={styles.tableCard}>
              <h3 style={styles.formHeading}>All Invoices & Sales Record</h3>
              <table style={styles.table}>
                <thead><tr><th>Invoice No</th><th>Customer</th><th>Service</th><th>Total</th><th>Due</th></tr></thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td>{inv.invoice_no}</td><td>{inv.customers?.name || 'N/A'}</td><td>{inv.service_type}</td><td>{inv.total} SAR</td><td style={{color:'red'}}>{inv.due_amount} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PORTALS & RECHARGE */}
          {activePage === 'portals' && (
            <div style={styles.moduleGrid}>
              <div style={styles.formCard}>
                <h3 style={styles.formHeading}>Recharge Portal Balance</h3>
                <form onSubmit={handleRecharge} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                  <select name="portal" style={styles.input}>{portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <input name="amount" type="number" placeholder="Amount (SAR)" required style={styles.input} />
                  <input name="desc" placeholder="Description (e.g. Bank Deposit)" style={styles.input} />
                  <button type="submit" style={styles.successBtn}>Add Recharge</button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3 style={styles.formHeading}>Current Portal Balances</h3>
                <div style={{display:'flex', gap:'15px', flexWrap:'wrap'}}>
                  {portals.map(p => <div key={p.id} style={styles.balanceCard}><h4>{p.name}</h4><h3 style={{color: p.current_balance < 0 ? 'red' : 'green'}}>{p.current_balance || 0} SAR</h3></div>)}
                </div>
              </div>
            </div>
          )}

          {/* HR: ADD EMPLOYEE */}
          {activePage === 'hr_employees' && (
            <div style={styles.moduleGrid}>
              <div style={styles.formCard}>
                <h3 style={styles.formHeading}>Add New Employee</h3>
                <form onSubmit={handleAddEmployee} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                  <input name="name" placeholder="Employee Name" required style={styles.input} />
                  <input name="role" placeholder="Designation (e.g. Accountant)" required style={styles.input} />
                  <input name="salary" type="number" placeholder="Monthly Salary (SAR)" required style={styles.input} />
                  <button type="submit" style={styles.primaryBtn}>Add to HR</button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3 style={styles.formHeading}>Employee List</h3>
                <table style={styles.table}><thead><tr><th>Name</th><th>Role</th><th>Salary</th></tr></thead><tbody>{employees.map(e => <tr key={e.id}><td>{e.name}</td><td>{e.role}</td><td>{e.monthly_salary}</td></tr>)}</tbody></table>
              </div>
            </div>
          )}

          {/* HR: PAY SALARY */}
          {activePage === 'hr_payroll' && (
            <div style={styles.moduleGrid}>
              <div style={styles.formCard}>
                <h3 style={styles.formHeading}>Process Salary Payment</h3>
                <form onSubmit={handlePaySalary} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                  <select name="emp_id" required style={styles.input}><option value="">Select Employee</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                  <input name="amount" type="number" placeholder="Amount Paid (SAR)" required style={styles.input} />
                  <input name="month" type="month" required style={styles.input} />
                  <button type="submit" style={styles.warningBtn}>Record Salary</button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3 style={styles.formHeading}>Payroll History</h3>
                <table style={styles.table}><thead><tr><th>Employee</th><th>Month</th><th>Paid</th></tr></thead><tbody>{payroll.map(p => <tr key={p.id}><td>{p.employees?.name}</td><td>{p.month}</td><td>{p.amount} SAR</td></tr>)}</tbody></table>
              </div>
            </div>
          )}

          {/* ACC: ADD EXPENSE */}
          {activePage === 'acc_expenses' && (
            <div style={styles.moduleGrid}>
              <div style={styles.formCard}>
                <h3 style={styles.formHeading}>Record Office Expense</h3>
                <form onSubmit={handleAddExpense} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                  <select name="category" style={styles.input}><option>Office Rent</option><option>Electricity</option><option>Internet</option><option>Stationery</option><option>Misc</option></select>
                  <input name="amount" type="number" placeholder="Amount (SAR)" required style={styles.input} />
                  <input name="desc" placeholder="Description" style={styles.input} />
                  <button type="submit" style={styles.dangerBtn}>Save Expense</button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3 style={styles.formHeading}>Expense Log</h3>
                <table style={styles.table}><thead><tr><th>Category</th><th>Date</th><th>Amount</th></tr></thead><tbody>{expenses.map(e => <tr key={e.id}><td>{e.category}</td><td>{new Date(e.expense_date).toLocaleDateString()}</td><td>{e.amount} SAR</td></tr>)}</tbody></table>
              </div>
            </div>
          )}

          {/* ACC: REPORTS */}
          {activePage === 'acc_reports' && (
            <div style={styles.formCard}>
              <h3 style={styles.formHeading}>Profit & Loss Statement (P&L)</h3>
              <div style={{padding:'20px', fontSize:'18px', lineHeight: '2'}}>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #eee'}}><span>Total Sales:</span> <b>{totalSales.toFixed(0)} SAR</b></div>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #eee'}}><span>Gross Profit (From Tickets):</span> <b style={{color:'green'}}>{grossProfit.toFixed(0)} SAR</b></div>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #eee'}}><span>Less: Salaries Paid:</span> <b style={{color:'red'}}>-{totalSalaries.toFixed(0)} SAR</b></div>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom:'2px solid #000'}}><span>Less: Office Expenses:</span> <b style={{color:'red'}}>-{totalExp.toFixed(0)} SAR</b></div>
                <div style={{display:'flex', justifyContent:'space-between', marginTop:'10px', fontSize:'22px'}}><span>NET PROFIT:</span> <b style={{color: netProfit>0?'green':'red'}}>{netProfit.toFixed(0)} SAR</b></div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- PROFESSIONAL ORACLE/SAP STYLE UI ---
const styles = {
  layout: { display: 'flex', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Segoe UI, Arial, sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#1a1a24', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  logo: { fontSize: '22px', textAlign: 'center', margin: '20px 0 0', padding: '0 20px' },
  subLogo: { fontSize: '14px', textAlign: 'center', color: '#888', marginTop: '5px', marginBottom: '20px' },
  nav: { flex: 1, overflowY: 'auto' },
  navLink: { background: 'none', border: 'none', color: '#bdc3c7', textAlign: 'left', padding: '15px 25px', fontSize: '15px', cursor: 'pointer', width: '100%', display: 'block', transition: '0.2s' },
  navActive: { background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '15px 25px', fontSize: '15px', cursor: 'pointer', width: '100%', backgroundColor: '#2c3e50', borderLeft: '5px solid #3498db', fontWeight: 'bold' },
  logoutBtn: { margin: '20px', padding: '12px', backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar: { backgroundColor: '#fff', padding: '15px 30px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 10 },
  content: { padding: '30px', overflowY: 'auto', flex: 1 },
  cardGrid: { display: 'flex', gap: '20px', marginBottom: '30px' },
  kpiCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: 1, borderLeft: '5px solid #3498db' },
  formCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' },
  tableCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' },
  moduleGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' },
  formHeading: { marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#2c3e50' },
  subHeading: { marginBottom: '10px', color: '#7f8c8d', fontSize: '14px', textTransform: 'uppercase' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' },
  input: { padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  primaryBtn: { padding: '12px', backgroundColor: '#2980b9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '20px', width: '100%' },
  successBtn: { padding: '12px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  warningBtn: { padding: '12px', backgroundColor: '#d35400', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  dangerBtn: { padding: '12px', backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  secondaryBtn: { padding: '10px 15px', backgroundColor: '#ecf0f1', color: '#2c3e50', border: '1px solid #bdc3c7', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px' },
  balanceCard: { flex: 1, padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center', minWidth: '150px', border: '1px solid #e0e0e0' }
};
