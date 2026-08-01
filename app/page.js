'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en'); // Language Toggle
  const [page, setPage] = useState('dashboard');
  const [reportFilter, setReportFilter] = useState('daily');
  const router = useRouter();

  const [data, setData] = useState({ invoices: [], portals: [], settings: {} });
  const [invForm, setInvForm] = useState({ customerName: '', phone: '', portal: '', flightType: 'Domestic', service: 'Flight Ticket', payment: 'Cash', paid: '' });
  const [items, setItems] = useState([{ name: 'Ticket', ticket_no: '', pnr: '', sector: '', qty: 1, cost: 0, sell: 0 }]);

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
    const set = await supabase.from('settings').select('*').eq('id', 1).single();
    setData({ invoices: inv.data || [], portals: por.data || [], settings: set.data || {} });
    if (por.data && por.data.length > 0) setInvForm(f => ({ ...f, portal: por.data[0].name }));
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
        invoice_no: invNo, customer_id: cid, portal_id: portal.id, flight_type: invForm.flightType, service_type: invForm.service,
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
      setItems([{ name: '', ticket_no: '', pnr: '', sector: '', qty: 1, cost: 0, sell: 0 }]);
      setPage('list_inv');
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleRefund = async (inv) => {
    if (!confirm('Mark this invoice as Refunded? Portal balance will be restored.')) return;
    await supabase.from('invoices').update({ status: 'refunded' }).eq('id', inv.id);
    const { data: pArr } = await supabase.from('portals').select('*').eq('id', inv.portal_id).limit(1);
    if (pArr && pArr.length > 0) {
      const p = pArr[0];
      await supabase.from('portals').update({ current_balance: (p.current_balance || 0) + inv.total_cost }).eq('id', p.id);
    }
    alert('Invoice Refunded & Balance Restored!');
    fetchAll();
  };

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
          <p>الرقم الضريبي: ${vatNo} | السجل التجاري: ${s.cr_no || ''}</p>
          <p>هاتف: ${s.phone || ''} | رقم الاختصار: ${s.iata_no || ''}</p>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:20px; border:1px solid #eee; padding:10px;">
          <div><b>فاتورة ضريبية</b><br/>Invoice No: ${inv.invoice_no}</div>
          <div><b>التاريخ:</b> ${new Date(inv.created_at).toLocaleDateString()}</div>
          <div><b>العميل:</b> ${inv.customers?.name || ''}<br/><b>الهاتف:</b> ${inv.customers?.phone || ''}</div>
        </div>
        <table style="width:100%; border-collapse:collapse; text-align:center; font-size:12px;">
          <tr style="background:#003366; color:white;">
            <th style="padding:8px; border:1px solid #ccc;">الصنف (Item)</th>
            <th style="border:1px solid #ccc;">التذكرة (Ticket)</th>
            <th style="border:1px solid #ccc;">PNR</th>
            <th style="border:1px solid #ccc;">القطاع (Sector)</th>
            <th style="border:1px solid #ccc;">السعر (Price)</th>
            <th style="border:1px solid #ccc;">الإجمالي (Total)</th>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ccc;">${inv.service_type}</td>
            <td style="padding:8px; border:1px solid #ccc;">-</td>
            <td style="padding:8px; border:1px solid #ccc;">-</td>
            <td style="padding:8px; border:1px solid #ccc;">${inv.flight_type}</td>
            <td style="padding:8px; border:1px solid #ccc;">${inv.total_sell.toFixed(2)}</td>
            <td style="padding:8px; border:1px solid #ccc;">${inv.total_sell.toFixed(2)}</td>
          </tr>
        </table>
        <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:flex-start;">
          <img src="${qrDataUrl}" width="120" height="120" />
          <div style="text-align:left; direction:ltr; width:300px; font-size:14px;">
            <p>Total Before VAT: ${inv.total_sell.toFixed(2)} SAR</p>
            <p>VAT (15%): ${inv.vat.toFixed(2)} SAR</p>
            <h3>Total: ${inv.total.toFixed(2)} SAR</h3>
            <p>Paid: ${inv.paid_amount.toFixed(2)} SAR | Due: ${inv.due_amount.toFixed(2)} SAR</p>
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

  if (!user) return <div style={{ padding: 50, textAlign: 'center' }}>Loading ERP...</div>;

  // Reports Filtering
  const now = new Date();
  const filteredInvoices = data.invoices.filter(inv => {
    const invDate = new Date(inv.created_at);
    if (reportFilter === 'daily') return invDate.toDateString() === now.toDateString();
    if (reportFilter === 'monthly') return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
    if (reportFilter === 'yearly') return invDate.getFullYear() === now.getFullYear();
    return true;
  });

  const totalSales = filteredInvoices.filter(i=>i.status==='active').reduce((s,i) => s + i.total, 0);
  const totalProfit = filteredInvoices.filter(i=>i.status==='active').reduce((s,i) => s + i.profit, 0);

  const menu = [
    { id: 'dashboard', label: lang === 'en' ? '📊 Dashboard' : '📊 لوحة التحكم' },
    { id: 'create_inv', label: lang === 'en' ? '🎫 Create Invoice' : '🎫 إنشاء فاتورة' },
    { id: 'list_inv', label: lang === 'en' ? '📋 Invoices & Refund' : '📋 الفواتير والاسترجاع' },
    { id: 'reports', label: lang === 'en' ? '📈 Reports' : '📈 التقارير' },
    { id: 'settings', label: lang === 'en' ? '⚙️ Settings' : '⚙️ الإعدادات' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#f4f6f9', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <aside style={{ width: '260px', backgroundColor: '#1a1a24', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
          {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'40px', marginBottom:'10px'}} />}
          <h2 style={{ margin: 0 }}>{lang === 'en' ? 'Sueud Al Taayira' : 'صعود الطائرة'}</h2>
        </div>
        <nav style={{ flex: 1 }}>
          {menu.map(m => (
            <button key={m.id} onClick={() => setPage(m.id)} style={{ width: '100%', textAlign: 'left', padding: '15px 20px', background: page === m.id ? '#2c3e50' : 'none', border: 'none', color: page === m.id ? '#fff' : '#aaa', cursor: 'pointer' }}>
              {m.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ width: '100%', padding: '10px', background: '#2980b9', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '10px' }}>{lang === 'en' ? 'العربية' : 'English'}</button>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ background: 'white', padding: '15px 30px', borderBottom: '2px solid #eee' }}>
          <h2 style={{ margin: 0 }}>{menu.find(m=>m.id===page)?.label}</h2>
        </header>

        <div style={{ padding: '30px' }}>
          
          {/* DASHBOARD */}
          {page === 'dashboard' && (
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '200px' }}>
                <h3>Total Sales (Active)</h3>
                <h1 style={{ color: '#2980b9' }}>{data.invoices.filter(i=>i.status==='active').reduce((s,i) => s + i.total, 0)} SAR</h1>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '200px' }}>
                <h3>Total Profit</h3>
                <h1 style={{ color: '#27ae60' }}>{data.invoices.filter(i=>i.status==='active').reduce((s,i) => s + i.profit, 0)} SAR</h1>
              </div>
            </div>
          )}

          {/* CREATE INVOICE */}
          {page === 'create_inv' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <form onSubmit={handleCreateInvoice}>
                <h3>Customer & Flight Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <input placeholder="Customer Name" value={invForm.customerName} onChange={(e) => setInvForm({...invForm, customerName: e.target.value})} required style={styles.i} />
                  <input placeholder="Contact Number" value={invForm.phone} onChange={(e) => setInvForm({...invForm, phone: e.target.value})} required style={styles.i} />
                  <select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.i}>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.i}><option>Flight Ticket</option><option>Hotel</option><option>Visa</option></select>
                  <select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.i}><option value="Domestic">Domestic (15% VAT)</option><option value="International">International (0% VAT)</option></select>
                  <select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.i}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option></select>
                </div>

                <h3>Ticket Details (Cost Price will be hidden from customer)</h3>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr', gap: '5px', marginBottom: '10px' }}>
                    <input placeholder="Item Name" value={it.name} onChange={(e) => { const n=[...items]; n[idx].name=e.target.value; setItems(n); }} style={styles.i} required />
                    <input placeholder="Ticket No" value={it.ticket_no} onChange={(e) => { const n=[...items]; n[idx].ticket_no=e.target.value; setItems(n); }} style={styles.i} />
                    <input placeholder="PNR" value={it.pnr} onChange={(e) => { const n=[...items]; n[idx].pnr=e.target.value; setItems(n); }} style={styles.i} />
                    <input placeholder="Sector (JED-RUH)" value={it.sector} onChange={(e) => { const n=[...items]; n[idx].sector=e.target.value; setItems(n); }} style={styles.i} />
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

          {/* LIST INVOICES & REFUND */}
          {page === 'list_inv' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8f9fa' }}>
                  <th style={styles.th}>Invoice No</th><th style={styles.th}>Customer</th><th style={styles.th}>Profit</th><th style={styles.th}>Total</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th>
                </tr></thead>
                <tbody>
                  {data.invoices.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee', backgroundColor: inv.status === 'refunded' ? '#ffebee' : 'transparent' }}>
                      <td style={styles.td}>{inv.invoice_no}</td>
                      <td style={styles.td}>{inv.customers?.name || 'N/A'}</td>
                      <td style={{...styles.td, color:'green'}}>{inv.profit} SAR</td>
                      <td style={styles.td}>{inv.total} SAR</td>
                      <td style={styles.td}>{inv.status === 'refunded' ? '❌ Refunded' : '✅ Active'}</td>
                      <td style={styles.td}>
                        <button onClick={() => downloadPDF(inv)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>PDF</button>
                        {inv.status === 'active' && <button onClick={() => handleRefund(inv)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', marginLeft: '5px' }}>Refund</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* REPORTS */}
          {page === 'reports' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setReportFilter('daily')} style={reportFilter==='daily'?styles.activeBtn:styles.normalBtn}>Daily</button>
                <button onClick={() => setReportFilter('monthly')} style={reportFilter==='monthly'?styles.activeBtn:styles.normalBtn}>Monthly</button>
                <button onClick={() => setReportFilter('yearly')} style={reportFilter==='yearly'?styles.activeBtn:styles.normalBtn}>Yearly</button>
              </div>
              <h3>Total Sales: {totalSales} SAR | Total Profit: {totalProfit} SAR</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Invoice</th><th style={styles.th}>Customer</th><th style={styles.th}>Total</th></tr></thead>
                <tbody>
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{new Date(inv.created_at).toLocaleDateString()}</td>
                      <td style={styles.td}>{inv.invoice_no}</td>
                      <td style={styles.td}>{inv.customers?.name}</td>
                      <td style={styles.td}>{inv.total} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SETTINGS */}
          {page === 'settings' && <SettingsPage lang={lang} data={data.settings} fetchAll={fetchAll} />}
        </div>
      </main>
    </div>
  );
}

// SETTINGS COMPONENT
function SettingsPage({ lang, data, fetchAll }) {
  const [form, setForm] = useState(data);

  const handleSave = async (e) => {
    e.preventDefault();
    await supabase.from('settings').update(form).eq('id', 1);
    alert('Settings Saved!');
    fetchAll();
  };

  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
      <h3>Company Settings (إعدادات الشركة)</h3>
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
    </div>
  );
}

const styles = {
  i: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', boxSizing: 'border-box' },
  th: { padding: '10px', textAlign: 'left', fontSize: '14px' },
  td: { padding: '10px', fontSize: '14px' },
  activeBtn: { padding: '10px 20px', background: '#003366', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' },
  normalBtn: { padding: '10px 20px', background: '#eee', color: '#333', border: 'none', cursor: 'pointer', marginRight: '10px' }
};
