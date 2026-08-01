'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('sales');
  const [page, setPage] = useState('dashboard');
  const router = useRouter();

  const [data, setData] = useState({ invoices: [], portals: [], employees: [], appUsers: [] });
  const [invForm, setInvForm] = useState({ customerName: '', phone: '', portal: '', flightType: 'Domestic', service: 'Flight Ticket', payment: 'Cash', paid: '' });
  const [items, setItems] = useState([{ name: '', desc: '', qty: 1, price: 0 }]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      setUser(session.user);
      
      if (session.user.email === 'atallah@sueud.com') {
        setUserRole('owner');
      } else {
        const { data: uData } = await supabase.from('app_users').select('*').eq('email', session.user.email).maybeSingle();
        setUserRole(uData?.role || 'sales');
      }
      fetchAll();
    };
    checkUser();
  }, [router]);

  const fetchAll = async () => {
    const inv = await supabase.from('invoices').select(`*, customers(name), portals(name)`).order('created_at', { ascending: false });
    const por = await supabase.from('portals').select('*');
    const emp = await supabase.from('employees').select('*');
    const usr = await supabase.from('app_users').select('*');
    
    const portalsData = por.data || [];
    setData({ invoices: inv.data || [], portals: portalsData, employees: emp.data || [], appUsers: usr.data || [] });
    
    if (portalsData.length > 0 && !invForm.portal) {
      setInvForm(prev => ({ ...prev, portal: portalsData[0].name }));
    }
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    
    try {
      const isDomestic = invForm.flightType === 'Domestic';
      let tbv = 0;
      items.forEach(it => { tbv += parseFloat(it.price) * parseInt(it.qty); });
      const vat = isDomestic ? tbv * 0.15 : 0;
      const total = tbv + vat;
      const paid = parseFloat(invForm.paid) || 0;
      const due = total - paid;

      // 1. Save or Get Customer (FIXED: .maybeSingle() use kiya hai)
      let cid;
      const { data: exC } = await supabase.from('customers').select('*').eq('phone', invForm.phone).maybeSingle();
      if (exC) {
        cid = exC.id;
      } else {
        const { data: nC, error: custErr } = await supabase.from('customers').insert([{ name: invForm.customerName, phone: invForm.phone }]).select().single();
        if (custErr) throw custErr;
        cid = nC.id;
      }

      // 2. Get Portal ID
      const { data: portal, error: portalErr } = await supabase.from('portals').select('*').eq('name', invForm.portal).maybeSingle();
      if (portalErr) throw portalErr;

      // 3. Save Invoice
      const invNo = `INV-${Date.now()}`;
      const { data: inv, error: invErr } = await supabase.from('invoices').insert([{
        invoice_no: invNo, customer_id: cid, portal_id: portal.id, flight_type: invForm.flightType, service_type: invForm.service,
        total_before_vat: tbv, vat, total, paid_amount: paid, due_amount: due, payment_method: invForm.payment
      }]).select().single();
      if (invErr) throw invErr;

      // 4. Save Invoice Items
      const itemsToInsert = items.map(it => ({ 
        invoice_id: inv.id, item_name: it.name, description: it.desc, 
        qty: parseInt(it.qty), price: parseFloat(it.price), total: parseFloat(it.price) * parseInt(it.qty) 
      }));
      const { error: itemErr } = await supabase.from('invoice_items').insert(itemsToInsert);
      if (itemErr) throw itemErr;

      // 5. Deduct Portal Balance
      const { error: balErr } = await supabase.from('portals').update({ current_balance: (portal.current_balance || 0) - tbv }).eq('id', portal.id);
      if (balErr) throw balErr;

      alert('Success: Invoice Generated & Saved!');
      fetchAll();
      setItems([{ name: '', desc: '', qty: 1, price: 0 }]);
      setInvForm({ customerName: '', phone: '', portal: data.portals[0]?.name || '', flightType: 'Domestic', service: 'Flight Ticket', payment: 'Cash', paid: '' });
      setPage('list_inv');
    } catch (err) {
      alert('Error Saving Invoice: ' + err.message);
    }
  };

  const handleAddEntity = async (table, payload, msg) => {
    const { error } = await supabase.from(table).insert([payload]);
    if (error) return alert('Error: ' + error.message);
    alert(msg + ' Added Successfully!');
    fetchAll();
  };

  const downloadPDF = async (inv) => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const { default: QRCode } = await import('qrcode');

      const seller = "Sueud Al Taayira";
      const vatNo = "312345678900003";
      const ts = new Date(inv.created_at).toISOString();
      const enc = (t, v) => String.fromCharCode(t) + String.fromCharCode(v.length) + v;
      const tlv = enc(1, seller) + enc(2, vatNo) + enc(3, ts) + enc(4, inv.total.toFixed(2)) + enc(5, inv.vat.toFixed(2));
      const qrDataUrl = await QRCode.toDataURL(btoa(tlv));

      const html = document.createElement('div');
      html.style.width = '800px';
      html.style.padding = '40px';
      html.style.fontFamily = 'Arial';
      html.style.direction = 'rtl';
      html.style.position = 'absolute';
      html.style.left = '-9999px';
      html.style.backgroundColor = 'white';
      html.innerHTML = `
        <div style="text-align:center; border-bottom:3px solid #003366; padding-bottom:20px; margin-bottom:20px;">
          <h1 style="margin:0; color:#003366;">Sueud Al Taayira</h1>
          <p>صعود الطائرة للسفر السياحة</p>
          <p>VAT: ${vatNo} | CR: 1010123456</p>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
          <div><b>Invoice No:</b> ${inv.invoice_no}</div>
          <div><b>Date:</b> ${new Date(inv.created_at).toLocaleDateString()}</div>
          <div><b>Customer:</b> ${inv.customers?.name || ''}</div>
          <div><b>Phone:</b> ${inv.customers?.phone || ''}</div>
        </div>
        <table style="width:100%; border-collapse:collapse; text-align:center;">
          <tr style="background:#003366; color:white;">
            <th style="padding:10px; border:1px solid #ccc;">Item</th><th style="border:1px solid #ccc;">Desc</th><th style="border:1px solid #ccc;">Qty</th><th style="border:1px solid #ccc;">Price</th>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #ccc;">${inv.service_type}</td>
            <td style="padding:10px; border:1px solid #ccc;">${inv.flight_type}</td>
            <td style="padding:10px; border:1px solid #ccc;">1</td>
            <td style="padding:10px; border:1px solid #ccc;">${inv.total_before_vat} SAR</td>
          </tr>
        </table>
        <div style="margin-top:20px; display:flex; justify-content:space-between;">
          <img src="${qrDataUrl}" width="120" height="120" />
          <div style="text-align:left;">
            <p>Total Before VAT: ${inv.total_before_vat} SAR</p>
            <p>VAT (15%): ${inv.vat} SAR</p>
            <h3>Total: ${inv.total} SAR</h3>
            <p>Paid: ${inv.paid_amount} SAR | Due: ${inv.due_amount} SAR</p>
          </div>
        </div>
      `;
      document.body.appendChild(html);
      const canvas = await html2canvas(html);
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
      doc.save(`${inv.invoice_no}.pdf`);
      document.body.removeChild(html);
    } catch (err) {
      alert('PDF Error: ' + err.message);
    }
  };

  if (!user) return <div style={{ padding: 50, textAlign: 'center' }}>Loading ERP...</div>;

  const menu = [
    { id: 'dashboard', label: '📊 Dashboard', roles: ['owner', 'sales', 'acc'] },
    { id: 'create_inv', label: '🎫 Create Invoice', roles: ['owner', 'sales'] },
    { id: 'list_inv', label: '📋 Invoices List', roles: ['owner', 'sales', 'acc'] },
    { id: 'portals', label: '💰 Portals & Users', roles: ['owner'] },
    { id: 'hr', label: '👥 HR Management', roles: ['owner'] },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#f4f6f9' }}>
      <aside style={{ width: '260px', backgroundColor: '#1a1a24', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
          <h2 style={{ margin: 0 }}>✈️ Sueud Al Taayira</h2>
          <p style={{ fontSize: '12px', color: '#888' }}>Enterprise ERP</p>
        </div>
        <nav style={{ flex: 1 }}>
          {menu.filter(m => m.roles.includes(userRole)).map(m => (
            <button key={m.id} onClick={() => setPage(m.id)} style={{ width: '100%', textAlign: 'left', padding: '15px 20px', background: page === m.id ? '#2c3e50' : 'none', border: 'none', color: page === m.id ? '#fff' : '#aaa', cursor: 'pointer', borderLeft: page === m.id ? '4px solid #3498db' : 'none' }}>
              {m.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ background: 'white', padding: '15px 30px', borderBottom: '2px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{menu.find(m=>m.id===page)?.label || 'Dashboard'}</h2>
          <div>Welcome, <b>{user.email}</b> ({userRole})</div>
        </header>

        <div style={{ padding: '30px' }}>
          
          {page === 'dashboard' && (
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '200px' }}>
                <h3>Total Sales</h3>
                <h1 style={{ color: '#2980b9' }}>{data.invoices.reduce((s,i) => s + i.total, 0)} SAR</h1>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '200px' }}>
                <h3>Total Invoices</h3>
                <h1 style={{ color: '#27ae60' }}>{data.invoices.length}</h1>
              </div>
            </div>
          )}

          {page === 'create_inv' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <form onSubmit={handleCreateInvoice}>
                <h3>Customer & Flight Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <input placeholder="Customer Name" value={invForm.customerName} onChange={(e) => setInvForm({...invForm, customerName: e.target.value})} required style={styles.i} />
                  <input placeholder="Contact Number" value={invForm.phone} onChange={(e) => setInvForm({...invForm, phone: e.target.value})} required style={styles.i} />
                  <select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.i} required>
                    <option value="">Select Portal</option>
                    {data.portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  <select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.i}>
                    <option>Flight Ticket</option><option>Hotel</option><option>Visa</option><option>Package</option>
                  </select>
                  <select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.i}>
                    <option value="Domestic">Domestic Flight (15% VAT)</option>
                    <option value="International">International Flight (0% VAT)</option>
                  </select>
                  <select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.i}>
                    <option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option>
                  </select>
                </div>

                <h3>Items / Tickets</h3>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 0.5fr', gap: '10px', marginBottom: '10px' }}>
                    <input placeholder="Service Name" value={it.name} onChange={(e) => { const n=[...items]; n[idx].name=e.target.value; setItems(n); }} style={styles.i} required />
                    <input placeholder="Description" value={it.desc} onChange={(e) => { const n=[...items]; n[idx].desc=e.target.value; setItems(n); }} style={styles.i} required />
                    <input type="number" placeholder="Qty" value={it.qty} onChange={(e) => { const n=[...items]; n[idx].qty=e.target.value; setItems(n); }} style={styles.i} required />
                    <input type="number" placeholder="Price" value={it.price} onChange={(e) => { const n=[...items]; n[idx].price=e.target.value; setItems(n); }} style={styles.i} required />
                    <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} style={{ background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => setItems([...items, { name: '', desc: '', qty: 1, price: 0 }])} style={{ background: '#3498db', color: 'white', padding: '10px', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>+ Add Item</button>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <input placeholder="Paid Amount (SAR)" type="number" value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.i} required />
                  <button type="submit" style={{ background: '#27ae60', color: 'white', padding: '12px 30px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Generate & Save</button>
                </div>
              </form>
            </div>
          )}

          {page === 'list_inv' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Invoice No</th><th style={styles.th}>Customer</th><th style={styles.th}>Type</th><th style={styles.th}>Total</th><th style={styles.th}>Due</th><th style={styles.th}>PDF</th></tr></thead>
                <tbody>
                  {data.invoices.length === 0 ? (
                    <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No Invoices Found. Create one from 'Create Invoice' tab.</td></tr>
                  ) : (
                    data.invoices.map(inv => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{inv.invoice_no}</td>
                        <td style={styles.td}>{inv.customers?.name || 'N/A'}</td>
                        <td style={styles.td}>{inv.flight_type}</td>
                        <td style={styles.td}>{inv.total} SAR</td>
                        <td style={styles.td}>{inv.due_amount} SAR</td>
                        <td style={styles.td}><button onClick={() => downloadPDF(inv)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Download</button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {page === 'portals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Add New Airline/Portal</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('portals', { name: e.target.name.value, current_balance: 0 }, 'Portal'); e.target.reset(); }}>
                  <input name="name" placeholder="e.g. Saudi Airlines" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Add System User</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('app_users', { email: e.target.email.value, name: e.target.name.value, role: e.target.role.value }, 'User'); e.target.reset(); }}>
                  <input name="name" placeholder="User Name" style={styles.i} required />
                  <input name="email" type="email" placeholder="Email" style={styles.i} required />
                  <select name="role" style={styles.i}><option value="sales">Sales</option><option value="acc">Accountant</option><option value="owner">Owner</option></select>
                  <button type="submit" style={styles.btn}>Add User</button>
                </form>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Current Balances</h3>
                {data.portals.length === 0 ? <p>No portals added yet.</p> : data.portals.map(p => <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}><span>{p.name}</span><b>{p.current_balance} SAR</b></div>)}
              </div>
            </div>
          )}

          {page === 'hr' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Add New Employee</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('employees', { name: e.target.name.value, role: e.target.role.value, monthly_salary: e.target.sal.value }, 'Employee'); e.target.reset(); }}>
                  <input name="name" placeholder="Employee Name" style={styles.i} required />
                  <input name="role" placeholder="Designation" style={styles.i} required />
                  <input name="sal" type="number" placeholder="Monthly Salary" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add Employee</button>
                </form>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Employees List</h3>
                {data.employees.length === 0 ? <p>No employees added yet.</p> : data.employees.map(emp => <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}><span>{emp.name} ({emp.role})</span><b>{emp.monthly_salary} SAR</b></div>)}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  i: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#003366', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' },
  th: { padding: '10px', textAlign: 'left', fontSize: '14px' },
  td: { padding: '10px', fontSize: '14px' }
};
