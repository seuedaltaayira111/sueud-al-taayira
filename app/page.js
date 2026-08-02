'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [previewInv, setPreviewInv] = useState(null);
  const router = useRouter();

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], recharges: [], settings: {}, employees: [], payroll: [], expenses: [] });
  const today = new Date().toISOString().split('T')[0];
  
  const [invForm, setInvForm] = useState({ custId: 'new', custName: '', custPhone: '', portal: '', bookingDate: today, service: 'Flight', flightType: 'Domestic', flightSub: 'New Booking', destination: '', hotelName: '', visaType: 'Tourist', pnr: '', ticketNo: '', airline: '', cost: 0, sell: 0, payment: 'Cash', paid: '' });
  const [rechargeForm, setRechargeForm] = useState({ portal: '', amount: '', date: today, desc: '' });

  const t = {
    en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices List', portals: 'Portals & Recharge', hr: 'HR & Accounting', reports: 'P&L Reports', settings: 'Settings', logout: 'Logout', newCust: '+ New Customer', custName: 'Customer Name', phone: 'Phone', service: 'Service', portal: 'Portal', payment: 'Payment', paid: 'Paid Amount', gen: 'Generate Invoice', totalSales: 'Total Sales', netProfit: 'Net Profit', addPortal: 'Add Portal', del: 'Delete', recharge: 'Recharge Portal', addEmp: 'Add Employee', addExp: 'Add Expense' },
    ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'قائمة الفواتير', portals: 'البوابات والرصيد', hr: 'الموارد البشرية والحسابات', reports: 'التقارير', settings: 'الإعدادات', logout: 'تسجيل الخروج', newCust: '+ عميل جديد', custName: 'اسم العميل', phone: 'الهاتف', service: 'الخدمة', portal: 'البوابة', payment: 'الدفع', paid: 'المدفوع', gen: 'إنشاء الفاتورة', totalSales: 'إجمالي المبيعات', netProfit: 'صافي الربح', addPortal: 'إضافة بوابة', del: 'حذف', recharge: 'شحن البوابة', addEmp: 'إضافة موظف', addExp: 'إضافة مصروف' }
  };
  const tr = t[lang];

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
    const cus = await supabase.from('customers').select('*').order('name', { ascending: true });
    const rec = await supabase.from('recharges').select(`*, portals(name)`).order('recharge_date', { ascending: false });
    const set = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    const emp = await supabase.from('employees').select('*');
    const pay = await supabase.from('payroll').select(`*, employees(name)`);
    const exp = await supabase.from('expenses').select('*');
    
    const portalsData = por.data || [];
    setData({ invoices: inv.data || [], portals: portalsData, customers: cus.data || [], recharges: rec.data || [], settings: set.data || {}, employees: emp.data || [], payroll: pay.data || [], expenses: exp.data || [] });
    if (portalsData.length > 0) {
      setInvForm(f => ({ ...f, portal: f.portal || portalsData[0].name }));
      setRechargeForm(f => ({ ...f, portal: f.portal || portalsData[0].name }));
    }
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const cost = parseFloat(invForm.cost) || 0;
      const sell = parseFloat(invForm.sell) || 0;
      const vat = invForm.flightType === 'Domestic' && invForm.service === 'Flight' ? sell * 0.15 : 0;
      const total = sell + vat;
      const paid = parseFloat(invForm.paid) || 0;
      const due = total - paid;
      const profit = sell - cost;

      let cid;
      if (invForm.custId === 'new') {
        const { data: nC } = await supabase.from('customers').insert([{ name: invForm.custName, phone: invForm.custPhone }]).select().single();
        cid = nC.id;
      } else { cid = invForm.custId; }

      const { data: pArr } = await supabase.from('portals').select('*').eq('name', invForm.portal).limit(1);
      const portal = pArr[0];

      // Dynamic Description based on Service
      let desc = '';
      if (invForm.service === 'Flight') desc = `${invForm.flightSub} (${invForm.flightType}) - ${invForm.airline}`;
      else if (invForm.service === 'Hotel') desc = `${invForm.hotelName} - ${invForm.destination}`;
      else if (invForm.service.includes('Visa')) desc = `${invForm.visaType} Visa`;
      else desc = invForm.service;

      const invNo = `INV-${Date.now()}`;
      const { data: inv, error: invErr } = await supabase.from('invoices').insert([{
        invoice_no: invNo, customer_id: cid, portal_id: portal.id, booking_date: invForm.bookingDate, invoice_date: today,
        service_type: invForm.service, flight_type: invForm.flightType, pnr: invForm.pnr, sector: desc, ticket_no: invForm.ticketNo,
        total_cost: cost, total_sell: sell, profit, vat, total, paid_amount: paid, due_amount: due, payment_method: invForm.payment
      }]).select().single();
      if (invErr) throw invErr;

      await supabase.from('portals').update({ current_balance: (portal.current_balance || 0) - cost }).eq('id', portal.id);
      alert('Invoice Generated!');
      fetchAll();
      setPage('list');
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Delete this record permanently?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchAll();
  };

  const handleAddEntity = async (table, payload, msg) => {
    const { error } = await supabase.from(table).insert([payload]);
    if (error) return alert('Error: ' + error.message);
    alert(msg + ' Added!');
    fetchAll();
  };

  const handleRecharge = async (e) => {
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

  const downloadPDF = async (inv) => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const { default: QRCode } = await import('qrcode');
      const s = data.settings;
      const tlv = String.fromCharCode(1) + String.fromCharCode((s.company_name_en||"S").length) + (s.company_name_en||"S") + String.fromCharCode(2) + String.fromCharCode((s.vat_no||"V").length) + (s.vat_no||"V") + String.fromCharCode(3) + String.fromCharCode(new Date(inv.created_at).toISOString().length) + new Date(inv.created_at).toISOString() + String.fromCharCode(4) + String.fromCharCode(inv.total.toFixed(2).length) + inv.total.toFixed(2) + String.fromCharCode(5) + String.fromCharCode(inv.vat.toFixed(2).length) + inv.vat.toFixed(2);
      const qr = await QRCode.toDataURL(btoa(tlv));

      const html = document.createElement('div');
      html.style.cssText = 'width:800px;padding:40px;font-family:Arial;direction:rtl;position:absolute;left:-9999px;background:#fff;';
      html.innerHTML = `
        <div style="text-align:center;border-bottom:3px solid #D4AF37;padding-bottom:20px;margin-bottom:20px;">
          ${s.logo_url ? `<img src="${s.logo_url}" style="height:80px;margin-bottom:10px;"/>` : ''}
          <h1 style="margin:0;color:#0F3D2E;">${s.company_name_ar || 'صعود الطائرة'}</h1>
          <p>${s.company_name_en || 'Sueud Al Taiyyarah'}</p>
          <p>VAT: ${s.vat_no||''} | CR: ${s.cr_no||''}</p>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
          <div><b>Invoice No:</b> ${inv.invoice_no}<br/><b>Date:</b> ${inv.invoice_date}</div>
          <div><b>Client:</b> ${inv.customers?.name||''}<br/><b>Phone:</b> ${inv.customers?.phone||''}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;text-align:center;font-size:14px;">
          <tr style="background:#0F3D2E;color:#D4AF37;"><th style="padding:10px;border:1px solid #ccc;">Service</th><th style="border:1px solid #ccc;">Ticket No</th><th style="border:1px solid #ccc;">PNR</th><th style="border:1px solid #ccc;">Details</th><th style="border:1px solid #ccc;">Total</th></tr>
          <tr><td style="padding:10px;border:1px solid #ccc;">${inv.service_type}</td><td style="padding:10px;border:1px solid #ccc;">${inv.ticket_no||''}</td><td style="padding:10px;border:1px solid #ccc;">${inv.pnr||''}</td><td style="padding:10px;border:1px solid #ccc;">${inv.sector||''}</td><td style="padding:10px;border:1px solid #ccc;">${inv.total.toFixed(2)}</td></tr>
        </table>
        <div style="margin-top:20px;display:flex;justify-content:space-between;">
          <img src="${qr}" width="120" height="120" />
          <div style="text-align:left;direction:ltr;"><p>Total: ${inv.total.toFixed(2)} SAR</p><p>Paid: ${inv.paid_amount.toFixed(2)} SAR</p></div>
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

  const tSales = data.invoices.filter(i => !i.invoice_no.startsWith('REF-')).reduce((s,i) => s + i.total, 0);
  const tProfit = data.invoices.filter(i => !i.invoice_no.startsWith('REF-')).reduce((s,i) => s + i.profit, 0);
  const tExp = data.expenses.reduce((s,e) => s + e.amount, 0);
  const tSal = data.payroll.reduce((s,p) => s + p.amount, 0);
  const netProfit = tProfit - tExp - tSal;

  const menu = [
    { id: 'dashboard', label: tr.dash },
    { id: 'create', label: tr.create },
    { id: 'list', label: tr.list },
    { id: 'portals', label: tr.portals },
    { id: 'hr', label: tr.hr },
    { id: 'settings', label: tr.settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#F5F7F2', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Premium Golden/Green Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#0F3D2E', color: '#D4AF37', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '2px solid #D4AF37' }}>
          {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'40px', marginBottom:'10px'}} />}
          <h2 style={{ margin: 0 }}>{lang === 'en' ? 'Sueud Al Taiyyarah' : 'صعود الطائرة'}</h2>
        </div>
        <nav style={{ flex: 1 }}>
          {menu.map(m => (
            <button key={m.id} onClick={() => setPage(m.id)} style={{ width: '100%', textAlign: 'left', padding: '15px 20px', background: page === m.id ? '#D4AF37' : 'none', border: 'none', color: page === m.id ? '#0F3D2E' : '#D4AF37', cursor: 'pointer', fontWeight: 'bold' }}>
              {m.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ width: '100%', padding: '10px', background: '#145A38', color: '#D4AF37', border: '1px solid #D4AF37', cursor: 'pointer', marginBottom: '10px' }}>{lang === 'en' ? 'العربية' : 'English'}</button>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#8B0000', color: '#FFF', border: 'none', cursor: 'pointer' }}>{tr.logout}</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ background: 'white', padding: '15px 30px', borderBottom: '2px solid #D4AF37' }}>
          <h2 style={{ margin: 0, color: '#0F3D2E' }}>{menu.find(m=>m.id===page)?.label}</h2>
        </header>

        <div style={{ padding: '30px' }}>
          
          {/* STYLISH DASHBOARD WITH BAR CHARTS */}
          {page === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <div style={{...styles.card, borderTop: '4px solid #D4AF37'}}><h3>{tr.totalSales}</h3><h1 style={{color:'#0F3D2E'}}>{tSales.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #27ae60'}}><h3>Gross Profit</h3><h1 style={{color:'#27ae60'}}>{tProfit.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #8e44ad'}}><h3>Expenses & Salary</h3><h1 style={{color:'#8e44ad'}}>{(tExp+tSal).toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #e74c3c'}}><h3>{tr.netProfit}</h3><h1 style={{color: netProfit>0?'#27ae60':'#e74c3c'}}>{netProfit.toFixed(0)} SAR</h1></div>
              </div>
              
              <div style={styles.card}>
                <h3>Last 5 Invoices (Bar Graph)</h3>
                <div style={{ display: 'flex', gap: '15px', height: '200px', alignItems: 'flex-end', paddingTop: '20px' }}>
                  {data.invoices.slice(0, 5).map(inv => (
                    <div key={inv.id} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ background: 'linear-gradient(to top, #0F3D2E, #D4AF37)', height: `${(inv.total / Math.max(...data.invoices.map(i=>i.total), 1)) * 150}px`, borderRadius: '5px 5px 0 0' }}></div>
                      <p style={{ fontSize: '10px', margin: '5px 0' }}>{inv.total.toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC INVOICE FORM */}
          {page === 'create' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <form onSubmit={handleCreateInvoice}>
                <h3 style={{color: '#0F3D2E'}}>Customer Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <select value={invForm.custId} onChange={(e) => setInvForm({...invForm, custId: e.target.value})} style={styles.i}>
                    <option value="new">{tr.newCust}</option>
                    {data.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                  {invForm.custId === 'new' && <>
                    <input placeholder={tr.custName} value={invForm.custName} onChange={(e) => setInvForm({...invForm, custName: e.target.value})} required style={styles.i} />
                    <input placeholder={tr.phone} value={invForm.custPhone} onChange={(e) => setInvForm({...invForm, custPhone: e.target.value})} required style={styles.i} />
                  </>}
                </div>

                <h3 style={{color: '#0F3D2E'}}>Service Details (Dynamic Form)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.i}>
                    <option>Flight</option><option>Hotel</option><option>Holiday Package</option>
                    <option>Driving License</option><option>Visit Visa</option><option>Umrah Visa</option>
                  </select>
                  
                  {/* FLIGHT DYNAMIC FIELDS */}
                  {invForm.service === 'Flight' && <>
                    <select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.i}>
                      <option value="Domestic">Domestic (15% VAT)</option>
                      <option value="International">International (0% VAT)</option>
                    </select>
                    <select value={invForm.flightSub} onChange={(e) => setInvForm({...invForm, flightSub: e.target.value})} style={styles.i}>
                      <option>New Booking</option><option>Reissue</option><option>Extra Baggage</option>
                    </select>
                    <input placeholder="Airline (e.g. Flynas)" value={invForm.airline} onChange={(e) => setInvForm({...invForm, airline: e.target.value})} style={styles.i} required />
                    <input placeholder="PNR" value={invForm.pnr} onChange={(e) => setInvForm({...invForm, pnr: e.target.value})} style={styles.i} required />
                    <input placeholder="Ticket Number" value={invForm.ticketNo} onChange={(e) => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.i} />
                  </>}

                  {/* HOTEL DYNAMIC FIELDS */}
                  {invForm.service === 'Hotel' && <>
                    <input placeholder="Destination (City)" value={invForm.destination} onChange={(e) => setInvForm({...invForm, destination: e.target.value})} style={styles.i} required />
                    <input placeholder="Hotel Name" value={invForm.hotelName} onChange={(e) => setInvForm({...invForm, hotelName: e.target.value})} style={styles.i} required />
                  </>}

                  {/* VISA DYNAMIC FIELDS */}
                  {invForm.service.includes('Visa') && <>
                    <select value={invForm.visaType} onChange={(e) => setInvForm({...invForm, visaType: e.target.value})} style={styles.i}>
                      <option>Tourist</option><option>Business</option><option>Work</option><option>Family</option>
                    </select>
                  </>}
                </div>

                <h3 style={{color: '#0F3D2E'}}>Pricing & Payment</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.i}>
                    {data.portals.map(p => <option key={p.id}>{p.name}</option>)}
                  </select>
                  <input type="number" placeholder="Cost Price" value={invForm.cost} onChange={(e) => setInvForm({...invForm, cost: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder="Sell Price" value={invForm.sell} onChange={(e) => setInvForm({...invForm, sell: e.target.value})} style={styles.i} required />
                  <select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.i}>
                    <option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option>
                  </select>
                  <input type="date" value={invForm.bookingDate} onChange={(e) => setInvForm({...invForm, bookingDate: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder="Paid Amount" value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.i} required />
                  <button type="submit" style={{ background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>{tr.gen}</button>
                </div>
              </form>
            </div>
          )}

          {/* INVOICE LIST WITH DELETE */}
          {page === 'list' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}>
                  <th style={styles.th}>Invoice No</th><th style={styles.th}>Customer</th><th style={styles.th}>Details</th><th style={styles.th}>Total</th><th style={styles.th}>Actions</th>
                </tr></thead>
                <tbody>
                  {data.invoices.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{inv.invoice_no}</td>
                      <td style={styles.td}>{inv.customers?.name || 'N/A'}</td>
                      <td style={styles.td}>{inv.sector || inv.service_type}</td>
                      <td style={styles.td}>{inv.total} SAR</td>
                      <td style={styles.td}>
                        <button onClick={() => downloadPDF(inv)} style={styles.btnSm}>PDF</button>
                        <button onClick={() => handleDelete('invoices', inv.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PORTAL MANAGEMENT WITH DELETE & DATE */}
          {page === 'portals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>{tr.addPortal}</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('portals', { name: e.target.name.value, current_balance: 0 }, 'Portal'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder="Portal Name (e.g. Amadeus)" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>{tr.recharge}</h3>
                <form onSubmit={handleRecharge} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select value={rechargeForm.portal} onChange={(e) => setRechargeForm({...rechargeForm, portal: e.target.value})} style={styles.i}>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <input type="date" value={rechargeForm.date} onChange={(e) => setRechargeForm({...rechargeForm, date: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder="Amount" value={rechargeForm.amount} onChange={(e) => setRechargeForm({...rechargeForm, amount: e.target.value})} style={styles.i} required />
                  <input placeholder="Description" value={rechargeForm.desc} onChange={(e) => setRechargeForm({...rechargeForm, desc: e.target.value})} style={styles.i} />
                  <button type="submit" style={styles.btn}>Recharge</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Balances & Delete</h3>
                {data.portals.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0', alignItems: 'center' }}>
                    <span>{p.name}<br/><b>{p.current_balance} SAR</b></span>
                    <button onClick={() => handleDelete('portals', p.id)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer'}}>X</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HR & ACCOUNTING */}
          {page === 'hr' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>{tr.addEmp}</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('employees', { name: e.target.name.value, role: e.target.role.value, monthly_salary: e.target.sal.value }, 'Employee'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder="Emp Name" style={styles.i} required />
                  <input name="role" placeholder="Role" style={styles.i} required />
                  <input name="sal" type="number" placeholder="Salary" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>{tr.addExp}</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('expenses', { category: e.target.cat.value, amount: parseFloat(e.target.amt.value), description: e.target.desc.value }, 'Expense'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select name="cat" style={styles.i}><option>Rent</option><option>Electricity</option><option>Internet</option><option>Misc</option></select>
                  <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                  <input name="desc" placeholder="Desc" style={styles.i} />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Recent Expenses/Salaries</h3>
                {data.expenses.map(e => <div key={e.id} style={{borderBottom:'1px solid #eee', padding:'5px 0'}}>{e.category} - {e.amount} SAR <button onClick={() => handleDelete('expenses', e.id)} style={{float:'right', color:'red', border:'none', cursor:'pointer'}}>X</button></div>)}
              </div>
            </div>
          )}

          {page === 'settings' && <SettingsPage data={data.settings} fetchAll={fetchAll} />}
        </div>
      </main>
    </div>
  );
}

function SettingsPage({ data, fetchAll }) {
  const [form, setForm] = useState(data);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await supabase.from('settings').update(form).eq('id', 1);
    alert('Settings Saved!');
    fetchAll();
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `logo_${Date.now()}.png`;
    const { error } = await supabase.storage.from('logos').upload(fileName, file);
    if (error) { alert('Error: ' + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
    setForm({ ...form, logo_url: urlData.publicUrl });
    setUploading(false);
  };

  return (
    <form onSubmit={handleSave} style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <input placeholder="Company Name (EN)" value={form.company_name_en || ''} onChange={(e) => setForm({...form, company_name_en: e.target.value})} style={styles.i} />
      <input placeholder="Company Name (AR)" value={form.company_name_ar || ''} onChange={(e) => setForm({...form, company_name_ar: e.target.value})} style={styles.i} />
      <input placeholder="VAT Number" value={form.vat_no || ''} onChange={(e) => setForm({...form, vat_no: e.target.value})} style={styles.i} />
      <input placeholder="CR Number" value={form.cr_no || ''} onChange={(e) => setForm({...form, cr_no: e.target.value})} style={styles.i} />
      <div style={{ gridColumn: 'span 2', border: '1px solid #D4AF37', padding: '15px', borderRadius: '8px' }}>
        <label><b>Upload Logo:</b></label><br/>
        {form.logo_url && <img src={form.logo_url} style={{height:'60px', marginTop:'10px', marginBottom:'10px'}} />}
        <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ marginTop: '10px' }} />
        {uploading && <p>Uploading...</p>}
      </div>
      <button type="submit" style={{ gridColumn: 'span 2', padding: '15px', background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>SAVE SETTINGS</button>
    </form>
  );
}

const styles = {
  card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  i: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#0F3D2E', color: '#D4AF37', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' },
  btnSm: { background: '#0F3D2E', color: '#D4AF37', border: 'none', padding: '5px 10px', cursor: 'pointer', marginRight: '5px' },
  th: { padding: '10px', textAlign: 'left', fontSize: '14px' },
  td: { padding: '10px', fontSize: '14px' }
};
