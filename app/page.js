'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const router = useRouter();

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], recharges: [], settings: {} });
  
  const today = new Date().toISOString().split('T')[0];
  const [invForm, setInvForm] = useState({ customerName: '', phone: '', portal: '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', payment: 'Cash', paid: '' });
  const [items, setItems] = useState([{ name: 'Ticket', ticket_no: '', pnr: '', sector: '', qty: 1, cost: 0, sell: 0 }]);
  const [rechargeForm, setRechargeForm] = useState({ portal: '', amount: '', date: today, desc: '' });
  const [refundForm, setRefundForm] = useState({ id: '', compRefund: 0, custRefund: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return router.push('/login');
      setUser(session.user);
      fetchAll();
    });
  }, [router]);

  const fetchAll = async () => {
    const inv = await supabase.from('invoices').select(`*, customers(name), portals(name)`).order('created_at', { ascending: false });
    const por = await supabase.from('portals').select('*');
    const cus = await supabase.from('customers').select('*');
    const rec = await supabase.from('recharges').select(`*, portals(name)`).order('recharge_date', { ascending: false });
    const set = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    
    const portalsData = por.data || [];
    setData({ invoices: inv.data || [], portals: portalsData, customers: cus.data || [], recharges: rec.data || [], settings: set.data || {} });
    if (portalsData.length > 0 && !invForm.portal) setInvForm(f => ({ ...f, portal: portalsData[0].name }));
    if (portalsData.length > 0 && !rechargeForm.portal) setRechargeForm(f => ({ ...f, portal: portalsData[0].name }));
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      let tCost = 0, tSell = 0;
      items.forEach(it => { tCost += parseFloat(it.cost) * parseInt(it.qty); tSell += parseFloat(it.sell) * parseInt(it.qty); });
      const isDomestic = invForm.flightType === 'Domestic';
      const vat = isDomestic ? tSell * 0.15 : 0;
      const total = tSell + vat;
      const paid = parseFloat(invForm.paid) || 0;
      const due = total - paid;
      const profit = tSell - tCost;

      let cid;
      const { data: exC } = await supabase.from('customers').select('id').eq('phone', invForm.phone).limit(1);
      if (exC && exC.length > 0) cid = exC[0].id;
      else { const { data: nC } = await supabase.from('customers').insert([{ name: invForm.customerName, phone: invForm.phone }]).select().single(); cid = nC.id; }

      const { data: pArr } = await supabase.from('portals').select('*').eq('name', invForm.portal).limit(1);
      const portal = pArr[0];

      const invNo = `INV-${Date.now()}`;
      const { data: inv, error: invErr } = await supabase.from('invoices').insert([{
        invoice_no: invNo, customer_id: cid, portal_id: portal.id, booking_date: invForm.bookingDate, invoice_date: invForm.invoiceDate,
        service_type: invForm.service, flight_type: invForm.flightType,
        total_cost: tCost, total_sell: tSell, profit, vat, total, paid_amount: paid, due_amount: due, payment_method: invForm.payment
      }]).select().single();
      if (invErr) throw invErr;

      await supabase.from('invoice_items').insert(items.map(it => ({ 
        invoice_id: inv.id, item_name: it.name, ticket_no: it.ticket_no, pnr: it.pnr, sector: it.sector, 
        qty: parseInt(it.qty), cost_price: parseFloat(it.cost), sell_price: parseFloat(it.sell), total: parseFloat(it.sell) * parseInt(it.qty) 
      })));
      await supabase.from('portals').update({ current_balance: (portal.current_balance || 0) - tCost }).eq('id', portal.id);

      alert('Invoice Generated!');
      fetchAll();
      setItems([{ name: 'Ticket', ticket_no: '', pnr: '', sector: '', qty: 1, cost: 0, sell: 0 }]);
      setPage('list_inv');
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleRefund = async (e) => {
    e.preventDefault();
    const { data: invArr } = await supabase.from('invoices').select('*, portals(*)').eq('id', refundForm.id).limit(1);
    if (!invArr || invArr.length === 0) return alert('Invoice not found');
    const inv = invArr[0];
    
    const compRef = parseFloat(refundForm.compRefund) || 0;
    const custRef = parseFloat(refundForm.custRefund) || 0;

    await supabase.from('invoices').update({ status: 'refunded', refund_company: compRef, refund_customer: custRef }).eq('id', inv.id);
    if (inv.portals) {
      await supabase.from('portals').update({ current_balance: (inv.portals.current_balance || 0) + compRef }).eq('id', inv.portals.id);
    }
    alert('Refund Processed!');
    setRefundForm({ id: '', compRefund: 0, custRefund: 0 });
    fetchAll();
  };

  const handleAddRecharge = async (e) => {
    e.preventDefault();
    const { data: pArr } = await supabase.from('portals').select('*').eq('name', rechargeForm.portal).limit(1);
    if (pArr && pArr.length > 0) {
      const p = pArr[0];
      await supabase.from('portals').update({ current_balance: (p.current_balance || 0) + parseFloat(rechargeForm.amount) }).eq('id', p.id);
      await supabase.from('recharges').insert([{ portal_id: p.id, amount: parseFloat(rechargeForm.amount), recharge_date: rechargeForm.date, description: rechargeForm.desc }]);
      alert('Recharge Added!');
      setRechargeForm({ ...rechargeForm, amount: '', desc: '' });
      fetchAll();
    }
  };

  const handleAddPortal = async (e) => { e.preventDefault(); await supabase.from('portals').insert([{ name: e.target.name.value, current_balance: 0 }]); alert('Company Added!'); e.target.reset(); fetchAll(); };

  const downloadPDF = async (inv) => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const { default: QRCode } = await import('qrcode');

      const s = data.settings;
      const sellerName = s.company_name_en || "Sueud Al Taayira";
      const vatNo = s.vat_no || "300000000000003";
      const ts = new Date(inv.created_at).toISOString();
      const enc = (t, v) => String.fromCharCode(t) + String.fromCharCode(v.length) + v;
      const tlv = enc(1, sellerName) + enc(2, vatNo) + enc(3, ts) + enc(4, inv.total.toFixed(2)) + enc(5, inv.vat.toFixed(2));
      const qrDataUrl = await QRCode.toDataURL(btoa(tlv));

      const html = document.createElement('div');
      html.style.width = '800px'; html.style.padding = '40px'; html.style.fontFamily = 'Arial'; html.style.direction = 'rtl'; html.style.position = 'absolute'; html.style.left = '-9999px'; html.style.backgroundColor = 'white';
      html.innerHTML = `
        <div style="text-align:center; border-bottom:3px solid #003366; padding-bottom:20px; margin-bottom:20px;">
          ${s.logo_url ? `<img src="${s.logo_url}" style="height:80px; margin-bottom:10px;" />` : ''}
          <h1 style="margin:0; color:#003366;">${s.company_name_ar || 'صعود الطائرة'}</h1>
          <p>${s.company_name_en || 'Sueud Al Taayira'}</p>
          <p>VAT: ${vatNo} | CR: ${s.cr_no || ''} | IATA: ${s.iata_no || ''}</p>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
          <div><b>Invoice No:</b> ${inv.invoice_no}<br/><b>Booking Date:</b> ${inv.booking_date || 'N/A'}</div>
          <div><b>Invoice Date:</b> ${inv.invoice_date || 'N/A'}</div>
          <div><b>Client:</b> ${inv.customers?.name || ''}<br/><b>Phone:</b> ${inv.customers?.phone || ''}</div>
        </div>
        <table style="width:100%; border-collapse:collapse; text-align:center; font-size:12px;">
          <tr style="background:#003366; color:white;">
            <th style="padding:8px; border:1px solid #ccc;">Service</th>
            <th style="border:1px solid #ccc;">Sector</th>
            <th style="border:1px solid #ccc;">Sell Price</th>
            <th style="border:1px solid #ccc;">VAT</th>
            <th style="border:1px solid #ccc;">Total</th>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ccc;">${inv.service_type} (${inv.flight_type})</td>
            <td style="padding:8px; border:1px solid #ccc;">${inv.flight_type}</td>
            <td style="padding:8px; border:1px solid #ccc;">${inv.total_sell.toFixed(2)}</td>
            <td style="padding:8px; border:1px solid #ccc;">${inv.vat.toFixed(2)}</td>
            <td style="padding:8px; border:1px solid #ccc;">${inv.total.toFixed(2)}</td>
          </tr>
        </table>
        <div style="margin-top:20px; display:flex; justify-content:space-between;">
          <img src="${qrDataUrl}" width="120" height="120" />
          <div style="text-align:left; direction:ltr;">
            <p>Paid: ${inv.paid_amount.toFixed(2)} SAR</p>
            <h3>Total: ${inv.total.toFixed(2)} SAR</h3>
          </div>
        </div>
      `;
      document.body.appendChild(html);
      const canvas = await html2canvas(html);
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
      doc.save(`${inv.invoice_no}.pdf`);
      document.body.removeChild(html);
    } catch (err) { alert('PDF Error: ' + err.message); }
  };

  const exportCSV = (csvData, filename) => {
    if (!csvData || csvData.length === 0) return alert('No data to export');
    const headers = Object.keys(csvData[0]);
    const csvRows = [headers.join(',')];
    for (const row of csvData) {
      const values = headers.map(h => `"${row[h] || ''}"`);
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  if (!user) return <div style={{ padding: 50, textAlign: 'center' }}>Loading ERP...</div>;

  const menu = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'create_inv', label: '🎫 Create Invoice' },
    { id: 'list_inv', label: '📋 Invoices & Refund' },
    { id: 'portals', label: '🏢 Companies & Recharge' },
    { id: 'reports', label: '📈 Reports & Export' },
    { id: 'settings', label: '⚙️ Settings' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#f4f6f9' }}>
      <aside style={{ width: '260px', backgroundColor: '#1a1a24', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
          {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'40px', marginBottom:'10px'}} />}
          <h2 style={{ margin: 0 }}>Sueud Al Taayira</h2>
        </div>
        <nav style={{ flex: 1 }}>
          {menu.map(m => (
            <button key={m.id} onClick={() => setPage(m.id)} style={{ width: '100%', textAlign: 'left', padding: '15px 20px', background: page === m.id ? '#2c3e50' : 'none', border: 'none', color: page === m.id ? '#fff' : '#aaa', cursor: 'pointer' }}>
              {m.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ background: 'white', padding: '15px 30px', borderBottom: '2px solid #eee' }}>
          <h2 style={{ margin: 0 }}>{menu.find(m=>m.id===page)?.label}</h2>
        </header>

        <div style={{ padding: '30px' }}>
          
          {/* CREATE INVOICE */}
          {page === 'create_inv' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <form onSubmit={handleCreateInvoice}>
                <h3>Customer & Dates</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <input placeholder="Customer Name" value={invForm.customerName} onChange={(e) => setInvForm({...invForm, customerName: e.target.value})} required style={styles.i} />
                  <input placeholder="Contact Number" value={invForm.phone} onChange={(e) => setInvForm({...invForm, phone: e.target.value})} required style={styles.i} />
                  <input type="date" value={invForm.bookingDate} onChange={(e) => setInvForm({...invForm, bookingDate: e.target.value})} style={styles.i} />
                  <input type="date" value={invForm.invoiceDate} onChange={(e) => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.i} />
                </div>

                <h3>Service & Portal</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.i}>
                    <option>Flight</option><option>Hotel</option><option>Package</option><option>Visa</option><option>Intl Driving License</option>
                  </select>
                  {invForm.service === 'Flight' && (
                    <select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.i}>
                      <option value="Domestic">Domestic (15% VAT)</option>
                      <option value="International">International (0% VAT)</option>
                    </select>
                  )}
                  <select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.i}>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.i}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option></select>
                </div>

                <h3>Ticket Details (Cost Price Hidden from PDF)</h3>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 0.5fr 1fr 1fr 0.5fr', gap: '5px', marginBottom: '10px' }}>
                    <input placeholder="Item Name" value={it.name} onChange={(e) => { const n=[...items]; n[idx].name=e.target.value; setItems(n); }} style={styles.i} required />
                    <input placeholder="Ticket No" value={it.ticket_no} onChange={(e) => { const n=[...items]; n[idx].ticket_no=e.target.value; setItems(n); }} style={styles.i} />
                    <input placeholder="PNR" value={it.pnr} onChange={(e) => { const n=[...items]; n[idx].pnr=e.target.value; setItems(n); }} style={styles.i} />
                    <input placeholder="Sector" value={it.sector} onChange={(e) => { const n=[...items]; n[idx].sector=e.target.value; setItems(n); }} style={styles.i} />
                    <input type="number" placeholder="Qty" value={it.qty} onChange={(e) => { const n=[...items]; n[idx].qty=e.target.value; setItems(n); }} style={styles.i} required />
                    <input type="number" placeholder="Cost Price" value={it.cost} onChange={(e) => { const n=[...items]; n[idx].cost=e.target.value; setItems(n); }} style={styles.i} required />
                    <input type="number" placeholder="Sell Price" value={it.sell} onChange={(e) => { const n=[...items]; n[idx].sell=e.target.value; setItems(n); }} style={styles.i} required />
                    <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} style={{ background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => setItems([...items, { name: '', ticket_no: '', pnr: '', sector: '', qty: 1, cost: 0, sell: 0 }])} style={{ background: '#3498db', color: 'white', padding: '10px', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>+ Add Item</button>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <input placeholder="Paid Amount (SAR)" type="number" value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.i} required />
                  <button type="submit" style={{ background: '#27ae60', color: 'white', padding: '12px 30px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Generate & Save</button>
                </div>
              </form>
            </div>
          )}

          {/* INVOICES & REFUND */}
          {page === 'list_inv' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8f9fa' }}>
                  <th style={styles.th}>Inv No</th><th style={styles.th}>Customer</th><th style={styles.th}>Profit</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th>
                </tr></thead>
                <tbody>
                  {data.invoices.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee', backgroundColor: inv.status === 'refunded' ? '#ffebee' : 'transparent' }}>
                      <td style={styles.td}>{inv.invoice_no}</td>
                      <td style={styles.td}>{inv.customers?.name || 'N/A'}</td>
                      <td style={{...styles.td, color:'green'}}>{inv.profit} SAR</td>
                      <td style={styles.td}>{inv.status}</td>
                      <td style={styles.td}>
                        <button onClick={() => downloadPDF(inv)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>PDF</button>
                        {inv.status === 'active' && <button onClick={() => setRefundForm({id: inv.id, compRefund: 0, custRefund: 0})} style={{ background: '#e67e22', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', marginLeft: '5px' }}>Refund</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {refundForm.id && (
                <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #e67e22', borderRadius: '8px' }}>
                  <h3>Process Partial Refund</h3>
                  <form onSubmit={handleRefund} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <input type="number" placeholder="Refund from Company (Portal)" value={refundForm.compRefund} onChange={(e) => setRefundForm({...refundForm, compRefund: e.target.value})} required style={styles.i} />
                    <input type="number" placeholder="Refund to Customer" value={refundForm.custRefund} onChange={(e) => setRefundForm({...refundForm, custRefund: e.target.value})} required style={styles.i} />
                    <button type="submit" style={{ background: '#e67e22', color: 'white', border: 'none', cursor: 'pointer' }}>Confirm Refund</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* COMPANIES & RECHARGE */}
          {page === 'portals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Add New Company/Portal</h3>
                <form onSubmit={handleAddPortal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input name="name" placeholder="e.g. Saudi Airlines" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add Company</button>
                </form>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Add Recharge</h3>
                <form onSubmit={handleAddRecharge} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <select value={rechargeForm.portal} onChange={(e) => setRechargeForm({...rechargeForm, portal: e.target.value})} style={styles.i}>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <input type="date" value={rechargeForm.date} onChange={(e) => setRechargeForm({...rechargeForm, date: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder="Amount" value={rechargeForm.amount} onChange={(e) => setRechargeForm({...rechargeForm, amount: e.target.value})} style={styles.i} required />
                  <input placeholder="Description" value={rechargeForm.desc} onChange={(e) => setRechargeForm({...rechargeForm, desc: e.target.value})} style={styles.i} />
                  <button type="submit" style={styles.btn}>Recharge</button>
                </form>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Balances</h3>
                {data.portals.map(p => <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}><span>{p.name}</span><b>{p.current_balance} SAR</b></div>)}
              </div>
            </div>
          )}

          {/* REPORTS & EXPORT */}
          {page === 'reports' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Sales Report (Excel)</h3>
                <p>Download all sales with Cost, Sell, Profit, Dates.</p>
                <button onClick={() => exportCSV(data.invoices.map(i => ({ InvNo: i.invoice_no, Customer: i.customers?.name, Phone: i.customers?.phone, BookingDate: i.booking_date, Service: i.service_type, TotalSell: i.total_sell, Profit: i.profit, Status: i.status })), 'Sales_Report.csv')} style={{...styles.btn, background: '#27ae60'}}>Download Sales CSV</button>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Recharge Report (Excel)</h3>
                <p>Download company-wise recharge statements.</p>
                <button onClick={() => exportCSV(data.recharges.map(r => ({ Date: r.recharge_date, Company: r.portals?.name, Amount: r.amount, Desc: r.description })), 'Recharge_Report.csv')} style={{...styles.btn, background: '#2980b9'}}>Download Recharge CSV</button>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>Customers Data (Excel)</h3>
                <p>Download all customer contacts.</p>
                <button onClick={() => exportCSV(data.customers, 'Customers.csv')} style={{...styles.btn, background: '#8e44ad'}}>Download Customers CSV</button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {page === 'settings' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <h3>Company Settings</h3>
              <SettingsPage data={data.settings} fetchAll={fetchAll} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SettingsPage({ data, fetchAll }) {
  const [form, setForm] = useState(data);

  const handleSave = async (e) => {
    e.preventDefault();
    await supabase.from('settings').update(form).eq('id', 1);
    alert('Settings Saved!');
    fetchAll();
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <input placeholder="Company Name (EN)" value={form.company_name_en || ''} onChange={(e) => setForm({...form, company_name_en: e.target.value})} style={styles.i} />
      <input placeholder="Company Name (AR)" value={form.company_name_ar || ''} onChange={(e) => setForm({...form, company_name_ar: e.target.value})} style={styles.i} />
      <input placeholder="VAT Number" value={form.vat_no || ''} onChange={(e) => setForm({...form, vat_no: e.target.value})} style={styles.i} />
      <input placeholder="CR Number" value={form.cr_no || ''} onChange={(e) => setForm({...form, cr_no: e.target.value})} style={styles.i} />
      <input placeholder="IATA Number" value={form.iata_no || ''} onChange={(e) => setForm({...form, iata_no: e.target.value})} style={styles.i} />
      <input placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({...form, phone: e.target.value})} style={styles.i} />
      <input placeholder="Logo Image URL (Link)" value={form.logo_url || ''} onChange={(e) => setForm({...form, logo_url: e.target.value})} style={styles.i} />
      <button type="submit" style={{ gridColumn: 'span 2', padding: '15px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>SAVE SETTINGS</button>
    </form>
  );
}

const styles = {
  i: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#003366', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' },
  th: { padding: '10px', textAlign: 'left', fontSize: '14px' },
  td: { padding: '10px', fontSize: '14px' }
};
