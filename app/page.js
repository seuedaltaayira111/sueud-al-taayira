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

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], recharges: [], settings: {}, employees: [], payroll: [], appUsers: [], expenses: [] });
  const today = new Date().toISOString().split('T')[0];
  
  // Added taxRate field
  const [invForm, setInvForm] = useState({ custId: 'new', custName: '', custPhone: '', portal: '', bookingDate: today, service: 'Flight', flightType: 'Domestic', flightSub: 'New Booking', destination: '', hotelName: '', visaType: 'Tourist', pnr: '', ticketNo: '', airline: '', cost: 0, sell: 0, taxRate: '15', payment: 'Cash', paid: '' });
  const [refundForm, setRefundForm] = useState({ id: '', compRefund: 0, custRefund: 0 });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const t = {
    en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices List', refunds: 'Refund Invoices', customers: 'Customer List', portals: 'Portals & Recharge', hr: 'HR & Expenses', users: 'User Management', reports: 'Financial Reports', settings: 'Settings', logout: 'Logout' },
    ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'قائمة الفواتير', refunds: 'فواتير الاسترجاع', customers: 'قائمة العملاء', portals: 'البوابات والرصيد', hr: 'الموارد البشرية والمصاريف', users: 'إدارة المستخدمين', reports: 'التقارير المالية', settings: 'الإعدادات', logout: 'تسجيل الخروج' }
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
    const usr = await supabase.from('app_users').select('*');
    const exp = await supabase.from('expenses').select('*');
    
    const portalsData = por.data || [];
    setData({ invoices: inv.data || [], portals: portalsData, customers: cus.data || [], recharges: rec.data || [], settings: set.data || {}, employees: emp.data || [], payroll: pay.data || [], appUsers: usr.data || [], expenses: exp.data || [] });
    if (portalsData.length > 0) setInvForm(f => ({ ...f, portal: f.portal || portalsData[0].name }));
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const cost = parseFloat(invForm.cost) || 0;
      const sell = parseFloat(invForm.sell) || 0;
      const taxRate = parseFloat(invForm.taxRate) || 0;
      const vat = sell * (taxRate / 100);
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
      const portal = pArr && pArr.length > 0 ? pArr[0] : null;
      if (!portal) throw new Error("Please select a valid Portal/Company.");

      let desc = '';
      if (invForm.service === 'Flight') desc = `${invForm.flightSub} (${invForm.flightType}) - ${invForm.airline}`;
      else if (invForm.service === 'Hotel') desc = `${invForm.hotelName} - ${invForm.destination}`;
      else if (invForm.service.includes('Visa')) desc = `${invForm.visaType} Visa`;
      else desc = invForm.service;

      const invNo = `INV-${Date.now()}`;
      const { error: invErr } = await supabase.from('invoices').insert([{
        invoice_no: invNo, customer_id: cid, portal_id: portal.id, booking_date: invForm.bookingDate, invoice_date: today,
        service_type: invForm.service, flight_type: invForm.flightType, flight_sub: invForm.flightSub, pnr: invForm.pnr, ticket_no: invForm.ticketNo, sector: desc,
        total_cost: cost, total_sell: sell, profit, vat, total, paid_amount: paid, due_amount: due, payment_method: invForm.payment
      }]);
      if (invErr) throw invErr;

      await supabase.from('portals').update({ current_balance: (portal.current_balance || 0) - cost }).eq('id', portal.id);
      alert('Invoice Generated Successfully!');
      fetchAll();
      setPage('list');
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
    const refNo = `REF-${Date.now()}`;
    await supabase.from('invoices').insert([{
      invoice_no: refNo, customer_id: inv.customer_id, portal_id: inv.portal_id, booking_date: today, invoice_date: today,
      service_type: `Refund for ${inv.invoice_no}`, total_sell: -custRef, total: -custRef, paid_amount: -custRef, status: 'refunded', refund_company: compRef, refund_customer: custRef
    }]);

    if (inv.portals) await supabase.from('portals').update({ current_balance: (inv.portals.current_balance || 0) + compRef }).eq('id', inv.portals.id);
    alert('Refund Processed!');
    setRefundForm({ id: '', compRefund: 0, custRefund: 0 });
    fetchAll();
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Delete permanently?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchAll();
  };

  const handleAddEntity = async (table, payload, msg) => {
    const { error } = await supabase.from(table).insert([payload]);
    if (error) return alert('Error: ' + error.message);
    alert(msg + ' Added!');
    fetchAll();
  };

  const exportCSV = (csvData, filename) => {
    if (!csvData || csvData.length === 0) return alert('No data to export');
    const headers = Object.keys(csvData[0]);
    const csvRows = [headers.join(',')];
    for (const row of csvData) { csvRows.push(headers.map(h => `"${row[h] || ''}"`).join(',')); }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // STYLISH BILINGUAL PDF TEMPLATE
  const downloadPDF = async (inv) => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const { default: QRCode } = await import('qrcode');
      const s = data.settings;
      
      const enc = (tag, v) => String.fromCharCode(tag) + String.fromCharCode(v.length) + v;
      const tlv = enc(1, s.company_name_en||"S") + enc(2, s.vat_no||"V") + enc(3, new Date(inv.created_at).toISOString()) + enc(4, inv.total.toFixed(2)) + enc(5, inv.vat.toFixed(2));
      const qr = await QRCode.toDataURL(btoa(tlv));

      const isExempt = inv.vat === 0;
      const taxLabelEn = isExempt ? 'Exempt (0%)' : 'VAT (15%)';
      const taxLabelAr = isExempt ? 'معافاة (0%)' : 'ضريبة (15%)';

      const html = document.createElement('div');
      html.style.cssText = 'width:800px;padding:40px;font-family:Arial;background:#fff;color:#333;';
      html.innerHTML = `
        <div style="display:flex;justify-content:space-between;border-bottom:4px solid #D4AF37;padding-bottom:20px;margin-bottom:20px;">
          <div style="max-width:350px;">
            ${s.logo_url ? `<img src="${s.logo_url}" style="height:80px;margin-bottom:10px;" />` : ''}
            <h1 style="margin:0;color:#0F3D2E;font-size:24px;">${s.company_name_en || 'Sueud Al Taiyyarah'}</h1>
            <h2 style="margin:0;color:#0F3D2E;font-size:20px;">${s.company_name_ar || 'صعود الطائرة'}</h2>
            <p style="font-size:12px;margin-top:10px;line-height:1.5;">
              VAT: ${s.vat_no || ''} (الرقم الضريبي)<br/>
              CR: ${s.cr_no || ''} (السجل التجاري)<br/>
              ${s.address || ''} (الموقع)<br/>
              ${s.phone || ''} (هاتف)
            </p>
          </div>
          <div style="text-align:right;">
            <h1 style="color:#0F3D2E;margin:0;font-size:28px;">TAX INVOICE</h1>
            <h2 style="color:#D4AF37;margin:0;font-size:22px;">فاتورة ضريبية</h2>
            <p style="font-size:14px;margin-top:10px;line-height:1.5;">
              Invoice No: ${inv.invoice_no}<br/>
              رقم الفاتورة: ${inv.invoice_no}<br/>
              Date: ${inv.invoice_date}<br/>
              التاريخ: ${inv.invoice_date}
            </p>
          </div>
        </div>

        <div style="margin-bottom:20px;border:1px solid #eee;padding:10px;background:#f9f9f9;">
          <b>Customer / العميل:</b> ${inv.customers?.name || ''}<br/>
          <b>Phone / الهاتف:</b> ${inv.customers?.phone || ''}
        </div>

        <table style="width:100%;border-collapse:collapse;text-align:center;font-size:14px;">
          <thead>
            <tr style="background:#0F3D2E;color:#fff;">
              <th style="padding:10px;border:1px solid #ddd;">Service / الخدمة</th>
              <th style="padding:10px;border:1px solid #ddd;">PNR / رقم الحجز</th>
              <th style="padding:10px;border:1px solid #ddd;">Details / التفاصيل</th>
              <th style="padding:10px;border:1px solid #ddd;">Amount / المبلغ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:10px;border:1px solid #ddd;">${inv.service_type}</td>
              <td style="padding:10px;border:1px solid #ddd;">${inv.pnr || ''}</td>
              <td style="padding:10px;border:1px solid #ddd;">${inv.sector || ''}</td>
              <td style="padding:10px;border:1px solid #ddd;">${inv.total_sell.toFixed(2)} SAR</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex;justify-content:space-between;margin-top:30px;">
          <div style="text-align:center;">
            <img src="${qr}" width="120" height="120" />
            <p style="font-size:10px;margin-top:5px;">Scan ZATCA / امسح الرمز</p>
          </div>
          <div style="text-align:right;width:300px;font-size:14px;">
            <p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;">
              <span>Total Before VAT (الإجمالي قبل الضريبة):</span>
              <b>${inv.total_sell.toFixed(2)} SAR</b>
            </p>
            <p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;">
              <span>${taxLabelEn} (${taxLabelAr}):</span>
              <b>${inv.vat.toFixed(2)} SAR</b>
            </p>
            <p style="display:flex;justify-content:space-between;background:#f0f0f0;padding:10px;font-weight:bold;font-size:16px;border:1px solid #ddd;">
              <span>Total After VAT (الإجمالي بعد الضريبة):</span>
              <b>${inv.total.toFixed(2)} SAR</b>
            </p>
            <p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;color:#27ae60;">
              <span>Paid (مدفوع):</span>
              <b>${inv.paid_amount.toFixed(2)} SAR</b>
            </p>
            <p style="display:flex;justify-content:space-between;padding:5px 0;color:#e74c3c;font-weight:bold;font-size:16px;">
              <span>Due Amount (المبلغ المتبقي):</span>
              <b>${inv.due_amount.toFixed(2)} SAR</b>
            </p>
          </div>
        </div>
        
        <div style="margin-top:50px;display:flex;justify-content:space-between;">
          <div style="text-align:center;border-top:1px solid #333;padding-top:5px;width:150px;font-size:12px;">
            Received By / استلم بواسطة
          </div>
          <div style="text-align:center;border-top:1px solid #333;padding-top:5px;width:150px;font-size:12px;">
            Customer Sign / توقيع العميل
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

  const activeInv = data.invoices.filter(i => !i.invoice_no.startsWith('REF-'));
  const refundInv = data.invoices.filter(i => i.invoice_no.startsWith('REF-'));
  const tSales = activeInv.reduce((s,i) => s + i.total, 0);
  const tProfit = activeInv.reduce((s,i) => s + i.profit, 0);
  const tExp = data.expenses.reduce((s,e) => s + e.amount, 0);
  const tSal = data.payroll.reduce((s,p) => s + p.amount, 0);
  const netProfit = tProfit - tExp - tSal;

  const filteredInvoices = data.invoices.filter(inv => {
    if (!fromDate || !toDate) return true;
    const invDate = inv.invoice_date || inv.created_at.split('T')[0];
    return invDate >= fromDate && invDate <= toDate;
  });

  const menu = [
    { id: 'dashboard', label: tr.dash },
    { id: 'create', label: tr.create },
    { id: 'list', label: tr.list },
    { id: 'refunds', label: tr.refunds },
    { id: 'customers', label: tr.customers },
    { id: 'portals', label: tr.portals },
    { id: 'hr', label: tr.hr },
    { id: 'users', label: tr.users },
    { id: 'reports', label: tr.reports },
    { id: 'settings', label: tr.settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#F5F7F2', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <aside style={{ width: '260px', backgroundColor: '#0F3D2E', color: '#D4AF37', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '2px solid #D4AF37' }}>
          {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'40px', marginBottom:'10px'}} />}
          <h2 style={{ margin: 0 }}>{lang === 'en' ? 'Sueud Al Taiyyarah' : 'صعود الطائرة'}</h2>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto' }}>
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
          
          {page === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <div style={styles.card}><h3>Total Sales</h3><h1 style={{color:'#0F3D2E'}}>{tSales.toFixed(0)} SAR</h1></div>
                <div style={styles.card}><h3>Gross Profit</h3><h1 style={{color:'#27ae60'}}>{tProfit.toFixed(0)} SAR</h1></div>
                <div style={styles.card}><h3>Net Profit</h3><h1 style={{color: netProfit>0?'#27ae60':'#e74c3c'}}>{netProfit.toFixed(0)} SAR</h1></div>
              </div>
            </div>
          )}

          {page === 'create' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <form onSubmit={handleCreateInvoice}>
                <h3 style={{color: '#0F3D2E'}}>Customer Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <select value={invForm.custId} onChange={(e) => setInvForm({...invForm, custId: e.target.value})} style={styles.i}>
                    <option value="new">+ New Customer</option>
                    {data.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                  {invForm.custId === 'new' && <>
                    <input placeholder="Customer Name" value={invForm.custName} onChange={(e) => setInvForm({...invForm, custName: e.target.value})} required style={styles.i} />
                    <input placeholder="Phone" value={invForm.custPhone} onChange={(e) => setInvForm({...invForm, custPhone: e.target.value})} required style={styles.i} />
                  </>}
                </div>

                <h3 style={{color: '#0F3D2E'}}>Service Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.i}>
                    <option>Flight</option><option>Hotel</option><option>Holiday Package</option>
                    <option>Driving License</option><option>Visit Visa</option><option>Umrah Visa</option>
                  </select>
                  
                  {invForm.service === 'Flight' && <>
                    <select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.i}>
                      <option value="Domestic">Domestic</option>
                      <option value="International">International</option>
                    </select>
                    <select value={invForm.flightSub} onChange={(e) => setInvForm({...invForm, flightSub: e.target.value})} style={styles.i}>
                      <option>New Booking</option><option>Reissue</option><option>Extra Baggage</option>
                    </select>
                    <input placeholder="Airline" value={invForm.airline} onChange={(e) => setInvForm({...invForm, airline: e.target.value})} style={styles.i} required />
                    <input placeholder="PNR" value={invForm.pnr} onChange={(e) => setInvForm({...invForm, pnr: e.target.value})} style={styles.i} required />
                    <input placeholder="Ticket Number" value={invForm.ticketNo} onChange={(e) => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.i} />
                  </>}
                  {invForm.service === 'Hotel' && <>
                    <input placeholder="Destination" value={invForm.destination} onChange={(e) => setInvForm({...invForm, destination: e.target.value})} style={styles.i} required />
                    <input placeholder="Hotel Name" value={invForm.hotelName} onChange={(e) => setInvForm({...invForm, hotelName: e.target.value})} style={styles.i} required />
                  </>}
                  {invForm.service.includes('Visa') && <>
                    <select value={invForm.visaType} onChange={(e) => setInvForm({...invForm, visaType: e.target.value})} style={styles.i}>
                      <option>Tourist</option><option>Business</option><option>Work</option><option>Family</option>
                    </select>
                  </>}
                </div>

                <h3 style={{color: '#0F3D2E'}}>Pricing & Payment</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.i} required>
                    <option value="">Select Portal</option>
                    {data.portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  <input type="number" placeholder="Cost Price" value={invForm.cost} onChange={(e) => setInvForm({...invForm, cost: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder="Sell Price" value={invForm.sell} onChange={(e) => setInvForm({...invForm, sell: e.target.value})} style={styles.i} required />
                  
                  {/* TAX SELECTION OPTION */}
                  <select value={invForm.taxRate} onChange={(e) => setInvForm({...invForm, taxRate: e.target.value})} style={styles.i}>
                    <option value="15">Tax 15%</option>
                    <option value="0">Tax 0% (Exempt)</option>
                  </select>

                  <select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.i}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option></select>
                  <input type="date" value={invForm.bookingDate} onChange={(e) => setInvForm({...invForm, bookingDate: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder="Paid Amount" value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.i} required />
                  <button type="submit" style={{ background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Generate Invoice</button>
                </div>
              </form>
            </div>
          )}

          {page === 'list' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.th}>Inv No</th><th style={styles.th}>Customer</th><th style={styles.th}>Details</th><th style={styles.th}>Profit</th><th style={styles.th}>Total</th><th style={styles.th}>Actions</th></tr></thead>
                <tbody>
                  {activeInv.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.customers?.name || 'N/A'}</td><td style={styles.td}>{inv.sector || inv.service_type}</td>
                      <td style={{...styles.td, color:'green'}}>{inv.profit} SAR</td><td style={styles.td}>{inv.total} SAR</td>
                      <td style={styles.td}>
                        <button onClick={() => setPreviewInv(inv)} style={styles.btnSm}>Preview</button>
                        <button onClick={() => downloadPDF(inv)} style={{...styles.btnSm, background:'#8e44ad'}}>PDF</button>
                        <button onClick={() => setRefundForm({id: inv.id, compRefund: 0, custRefund: 0})} style={{...styles.btnSm, background:'#e67e22'}}>Refund</button>
                        <button onClick={() => handleDelete('invoices', inv.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {refundForm.id && (
                <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #e67e22', borderRadius: '8px' }}>
                  <h3>Process Partial Refund</h3>
                  <form onSubmit={handleRefund} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <input type="number" placeholder="Refund from Company" value={refundForm.compRefund} onChange={(e) => setRefundForm({...refundForm, compRefund: e.target.value})} required style={styles.i} />
                    <input type="number" placeholder="Refund to Customer" value={refundForm.custRefund} onChange={(e) => setRefundForm({...refundForm, custRefund: e.target.value})} required style={styles.i} />
                    <button type="submit" style={{ background: '#e67e22', color: 'white', border: 'none', cursor: 'pointer' }}>Confirm Refund</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {page === 'refunds' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #e74c3c' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#e74c3c', color: 'white' }}><th style={styles.th}>Refund No</th><th style={styles.th}>Original Inv</th><th style={styles.th}>Cust Refund</th><th style={styles.th}>Comp Refund</th></tr></thead>
                <tbody>
                  {refundInv.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.service_type}</td>
                      <td style={{...styles.td, color:'red'}}>{inv.refund_customer} SAR</td><td style={{...styles.td, color:'green'}}>{inv.refund_company} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page === 'customers' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.th}>Name</th><th style={styles.th}>Phone</th><th style={styles.th}>Type</th><th style={styles.th}>Action</th></tr></thead>
                <tbody>
                  {data.customers.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{c.name}</td><td style={styles.td}>{c.phone}</td><td style={styles.td}>{c.type || 'Individual'}</td>
                      <td style={styles.td}><button onClick={() => handleDelete('customers', c.id)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer'}}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page === 'portals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>Add Portal</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('portals', { name: e.target.name.value, current_balance: 0 }, 'Portal'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder="Portal Name" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Recharge</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('recharges', { portal_id: data.portals.find(p=>p.name===e.target.portal.value)?.id, amount: parseFloat(e.target.amt.value), recharge_date: e.target.date.value, description: e.target.desc.value }, 'Recharge'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select name="portal" style={styles.i}>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <input name="date" type="date" defaultValue={today} style={styles.i} required />
                  <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                  <input name="desc" placeholder="Desc" style={styles.i} />
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

          {page === 'hr' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>Add Employee</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('employees', { name: e.target.name.value, role: e.target.role.value, monthly_salary: e.target.sal.value }, 'Employee'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder="Name" style={styles.i} required />
                  <input name="role" placeholder="Role" style={styles.i} required />
                  <input name="sal" type="number" placeholder="Salary" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Add Expense</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('expenses', { category: e.target.cat.value, amount: parseFloat(e.target.amt.value), description: e.target.desc.value }, 'Expense'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select name="cat" style={styles.i}><option>Rent</option><option>Electricity</option><option>Internet</option><option>Misc</option></select>
                  <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                  <input name="desc" placeholder="Desc" style={styles.i} />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Pay Salary</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('payroll', { employee_id: e.target.emp.value, amount: e.target.amt.value, month: e.target.month.value }, 'Salary'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select name="emp" style={styles.i} required><option value="">Select</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                  <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                  <input name="month" type="month" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Pay</button>
                </form>
              </div>
            </div>
          )}

          {page === 'users' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>Add System User</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('app_users', { name: e.target.name.value, email: e.target.email.value, role: e.target.role.value }, 'User'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder="Name" style={styles.i} required />
                  <input name="email" type="email" placeholder="Email" style={styles.i} required />
                  <select name="role" style={styles.i}><option value="sales">Sales</option><option value="acc">Accountant</option><option value="owner">Owner</option></select>
                  <button type="submit" style={styles.btn}>Add User</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Users List & Permissions</h3>
                {data.appUsers.map(u => (
                  <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0', alignItems: 'center' }}>
                    <span>{u.name}<br/><b>{u.email}</b> ({u.role})</span>
                    <button onClick={() => handleDelete('app_users', u.id)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer'}}>X</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'reports' && (
            <div style={styles.card}>
              <h3>Financial Statement (Daily/Weekly/Monthly/Yearly)</h3>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <label>From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={styles.i} /></label>
                <label>To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={styles.i} /></label>
                <button onClick={() => exportCSV(filteredInvoices.map(i => ({ InvNo: i.invoice_no, Customer: i.customers?.name, Date: i.invoice_date, Service: i.service_type, Total: i.total, Profit: i.profit, Status: i.status })), 'Sales_Report.csv')} style={{...styles.btn, background: '#27ae60', width: 'auto', padding: '10px 20px'}}>Export Sales Excel</button>
                <button onClick={() => exportCSV(data.recharges.map(r => ({ Date: r.recharge_date, Company: r.portals?.name, Amount: r.amount, Desc: r.description })), 'Recharge_Report.csv')} style={{...styles.btn, background: '#2980b9', width: 'auto', padding: '10px 20px'}}>Export Recharge Excel</button>
              </div>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'150px'}}><h4>Sales</h4><h2>{filteredInvoices.filter(i=>!i.invoice_no.startsWith('REF-')).reduce((s,i)=>s+i.total,0).toFixed(0)}</h2></div>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'150px'}}><h4>Profit</h4><h2>{filteredInvoices.filter(i=>!i.invoice_no.startsWith('REF-')).reduce((s,i)=>s+i.profit,0).toFixed(0)}</h2></div>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'150px'}}><h4>Refunds</h4><h2>{filteredInvoices.filter(i=>i.invoice_no.startsWith('REF-')).reduce((s,i)=>s+i.refund_customer,0).toFixed(0)}</h2></div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Invoice</th><th style={styles.th}>Customer</th><th style={styles.th}>Total</th><th style={styles.th}>Profit</th></tr></thead>
                <tbody>
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{inv.invoice_date}</td><td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.customers?.name}</td>
                      <td style={styles.td}>{inv.total} SAR</td><td style={{...styles.td, color:'green'}}>{inv.profit} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page === 'settings' && <SettingsPage data={data.settings} fetchAll={fetchAll} />}
        </div>
      </main>

      {/* INVOICE PREVIEW MODAL (Bilingual & Stylish) */}
      {previewInv && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Invoice Preview</h2>
              <button onClick={() => setPreviewInv(null)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>X</button>
            </div>
            <div style={{ border: '1px solid #eee', padding: '20px' }}>
              <div style={{display:'flex', justifyContent:'space-between', borderBottom:'2px solid #D4AF37', paddingBottom:'10px'}}>
                <div>
                  {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'60px'}} />}
                  <h2 style={{margin:0, color:'#0F3D2E'}}>{data.settings.company_name_en}</h2>
                  <h3 style={{margin:0, color:'#0F3D2E'}}>{data.settings.company_name_ar}</h3>
                </div>
                <div style={{textAlign:'right'}}>
                  <h2 style={{margin:0, color:'#0F3D2E'}}>TAX INVOICE</h2>
                  <h3 style={{margin:0, color:'#D4AF37'}}>فاتورة ضريبية</h3>
                  <p>Inv No: {previewInv.invoice_no}<br/>Date: {previewInv.invoice_date}</p>
                </div>
              </div>
              <p><b>Customer / العميل:</b> {previewInv.customers?.name}</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
                <tr style={{ background: '#0F3D2E', color: 'white' }}>
                  <th style={styles.th}>Service / الخدمة</th><th style={styles.th}>PNR / رقم الحجز</th><th style={styles.th}>Details / التفاصيل</th><th style={styles.th}>Amount / المبلغ</th>
                </tr>
                <tr>
                  <td style={styles.td}>{previewInv.service_type}</td><td style={styles.td}>{previewInv.pnr}</td><td style={styles.td}>{previewInv.sector}</td><td style={styles.td}>{previewInv.total_sell} SAR</td>
                </tr>
              </table>
              <div style={{marginTop:'20px', textAlign:'right'}}>
                <p>Total Before VAT (الإجمالي قبل الضريبة): {previewInv.total_sell} SAR</p>
                <p>VAT (الضريبة): {previewInv.vat} SAR</p>
                <h3>Total After VAT (الإجمالي بعد الضريبة): {previewInv.total} SAR</h3>
                <p style={{color:'green'}}>Paid (مدفوع): {previewInv.paid_amount} SAR</p>
                <p style={{color:'red'}}>Due Amount (المبلغ المتبقي): {previewInv.due_amount} SAR</p>
              </div>
            </div>
            <button onClick={() => downloadPDF(previewInv)} style={{ width: '100%', padding: '15px', background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '20px', fontWeight:'bold' }}>Download PDF</button>
          </div>
        </div>
      )}
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
      <input placeholder="VAT Number (الرقم الضريبي)" value={form.vat_no || ''} onChange={(e) => setForm({...form, vat_no: e.target.value})} style={styles.i} />
      <input placeholder="CR Number (السجل التجاري)" value={form.cr_no || ''} onChange={(e) => setForm({...form, cr_no: e.target.value})} style={styles.i} />
      <input placeholder="License No (رقم الترخيص)" value={form.license_no || ''} onChange={(e) => setForm({...form, license_no: e.target.value})} style={styles.i} />
      <input placeholder="Tourist License No (رقم ترخيص السياحي)" value={form.tourist_license_no || ''} onChange={(e) => setForm({...form, tourist_license_no: e.target.value})} style={styles.i} />
      <input placeholder="Phone (هاتف)" value={form.phone || ''} onChange={(e) => setForm({...form, phone: e.target.value})} style={styles.i} />
      <input placeholder="Address (موقع)" value={form.address || ''} onChange={(e) => setForm({...form, address: e.target.value})} style={styles.i} />
      
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
  th: { padding: '10px', textAlign: 'left', fontSize: '14px', border: '1px solid #ccc' },
  td: { padding: '10px', fontSize: '14px', border: '1px solid #ccc' }
};
