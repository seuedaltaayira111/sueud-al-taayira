'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en'); // Language Toggle
  const [page, setPage] = useState('dashboard');
  const [previewInv, setPreviewInv] = useState(null); // For Invoice Preview Modal
  const router = useRouter();

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], recharges: [], settings: {} });
  const today = new Date().toISOString().split('T')[0];
  
  const [invForm, setInvForm] = useState({ customerName: '', phone: '', portal: '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', payment: 'Cash', paid: '' });
  const [items, setItems] = useState([{ name: 'Ticket', ticket_no: '', pnr: '', sector: '', qty: 1, cost: 0, sell: 0 }]);
  const [rechargeForm, setRechargeForm] = useState({ portal: '', amount: '', date: today, desc: '' });
  const [refundForm, setRefundForm] = useState({ id: '', compRefund: 0, custRefund: 0 });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Translations
  const t = {
    en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices & Refund', portals: 'Companies & Recharge', reports: 'Reports & Export', settings: 'Settings', logout: 'Logout', custName: 'Customer Name', phone: 'Phone', bDate: 'Booking Date', iDate: 'Invoice Date', service: 'Service', portal: 'Portal', payment: 'Payment Method', paid: 'Paid Amount', items: 'Ticket Details', tNo: 'Ticket No', pnr: 'PNR', sector: 'Sector', qty: 'Qty', cost: 'Cost Price', sell: 'Sell Price', gen: 'Generate & Save', invNo: 'Invoice No', total: 'Total', status: 'Status', actions: 'Actions', preview: 'Preview', pdf: 'PDF', refund: 'Refund', addComp: 'Add Company', addRech: 'Add Recharge', balance: 'Balances', fromD: 'From Date', toD: 'To Date', expSales: 'Export Sales', expRech: 'Export Recharge', expCust: 'Export Customers', saveSet: 'Save Settings', logo: 'Upload Logo', compEn: 'Company Name (EN)', compAr: 'Company Name (AR)', vat: 'VAT Number', cr: 'CR Number', iata: 'IATA Number', refInv: 'Refund Statement', active: 'Active', refunded: 'Refunded' },
    ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'الفواتير والاسترجاع', portals: 'الشركات والرصيد', reports: 'التقارير والتصدير', settings: 'الإعدادات', logout: 'تسجيل الخروج', custName: 'اسم العميل', phone: 'الهاتف', bDate: 'تاريخ الحجز', iDate: 'تاريخ الفاتورة', service: 'الخدمة', portal: 'البوابة', payment: 'طريقة الدفع', paid: 'المبلغ المدفوع', items: 'تفاصيل التذكرة', tNo: 'رقم التذكرة', pnr: 'PNR', sector: 'القطاع', qty: 'الكمية', cost: 'سعر التكلفة', sell: 'سعر البيع', gen: 'حفظ وإنشاء', invNo: 'رقم الفاتورة', total: 'الإجمالي', status: 'الحالة', actions: 'إجراءات', preview: 'معاينة', pdf: 'PDF', refund: 'استرجاع', addComp: 'إضافة شركة', addRech: 'إضافة رصيد', balance: 'الأرصدة', fromD: 'من تاريخ', toD: 'إلى تاريخ', expSales: 'تصدير المبيعات', expRech: 'تصدير الرصيد', expCust: 'تصدير العملاء', saveSet: 'حفظ الإعدادات', logo: 'رفع الشعار', compEn: 'اسم الشركة (إنجليزي)', compAr: 'اسم الشركة (عربي)', vat: 'الرقم الضريبي', cr: 'السجل التجاري', iata: 'رقم الإياتا', refInv: 'كشف الاسترجاع', active: 'نشط', refunded: 'مسترجع' }
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
    const cus = await supabase.from('customers').select('*');
    const rec = await supabase.from('recharges').select(`*, portals(name)`).order('recharge_date', { ascending: false });
    const set = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    
    const portalsData = por.data || [];
    setData({ invoices: inv.data || [], portals: portalsData, customers: cus.data || [], recharges: rec.data || [], settings: set.data || {} });
    if (portalsData.length > 0) {
      setInvForm(f => ({ ...f, portal: f.portal || portalsData[0].name }));
      setRechargeForm(f => ({ ...f, portal: f.portal || portalsData[0].name }));
    }
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

      alert(lang === 'en' ? 'Invoice Generated!' : 'تم إنشاء الفاتورة!');
      fetchAll();
      setItems([{ name: 'Ticket', ticket_no: '', pnr: '', sector: '', qty: 1, cost: 0, sell: 0 }]);
      setPage('list_inv');
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleRefund = async (e) => {
    e.preventDefault();
    const { data: invArr } = await supabase.from('invoices').select('*, portals(*), customers(*)').eq('id', refundForm.id).limit(1);
    if (!invArr || invArr.length === 0) return alert('Invoice not found');
    const inv = invArr[0];
    
    const compRef = parseFloat(refundForm.compRefund) || 0;
    const custRef = parseFloat(refundForm.custRefund) || 0;

    await supabase.from('invoices').update({ status: 'refunded', refund_company: compRef, refund_customer: custRef }).eq('id', inv.id);

    const refNo = `REF-${Date.now()}`;
    await supabase.from('invoices').insert([{
      invoice_no: refNo, customer_id: inv.customer_id, portal_id: inv.portal_id, booking_date: today, invoice_date: today,
      service_type: `Refund for ${inv.invoice_no}`, flight_type: inv.flight_type,
      total_sell: -custRef, total: -custRef, paid_amount: -custRef, status: 'refunded', refund_company: compRef, refund_customer: custRef
    }]);

    if (inv.portals) {
      await supabase.from('portals').update({ current_balance: (inv.portals.current_balance || 0) + compRef }).eq('id', inv.portals.id);
    }
    alert(lang === 'en' ? 'Refund Invoice Generated!' : 'تم إنشاء فاتورة الاسترجاع!');
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
      alert(lang === 'en' ? 'Recharge Added!' : 'تم إضافة الرصيد!');
      setRechargeForm({ ...rechargeForm, amount: '', desc: '' });
      fetchAll();
    }
  };

  const handleAddPortal = async (e) => { e.preventDefault(); await supabase.from('portals').insert([{ name: e.target.name.value, current_balance: 0 }]); alert(lang === 'en' ? 'Company Added!' : 'تمت إضافة الشركة!'); e.target.reset(); fetchAll(); };

  // PREVIEW & PDF GENERATION
  const handlePreview = async (inv) => {
    const { data: itemsData } = await supabase.from('invoice_items').select('*').eq('invoice_id', inv.id);
    setPreviewInv({ inv, items: itemsData || [] });
  };

  const downloadPDF = async (inv, invItems) => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const { default: QRCode } = await import('qrcode');

      const s = data.settings;
      const sellerName = s.company_name_en || "Sueud Al Taayira";
      const vatNo = s.vat_no || "300000000000003";
      const ts = new Date(inv.created_at).toISOString();
      const enc = (tag, v) => String.fromCharCode(tag) + String.fromCharCode(v.length) + v;
      const tlv = enc(1, sellerName) + enc(2, vatNo) + enc(3, ts) + enc(4, inv.total.toFixed(2)) + enc(5, inv.vat.toFixed(2));
      const qrDataUrl = await QRCode.toDataURL(btoa(tlv));

      const html = document.createElement('div');
      html.style.width = '800px'; html.style.padding = '40px'; html.style.fontFamily = 'Arial'; html.style.direction = 'rtl'; html.style.position = 'absolute'; html.style.left = '-9999px'; html.style.backgroundColor = 'white';
      const isRefund = inv.invoice_no.startsWith('REF-');
      
      let itemsRows = invItems.map(it => `
        <tr>
          <td style="padding:8px; border:1px solid #ccc;">${it.item_name || ''}</td>
          <td style="padding:8px; border:1px solid #ccc;">${it.ticket_no || ''}</td>
          <td style="padding:8px; border:1px solid #ccc;">${it.pnr || ''}</td>
          <td style="padding:8px; border:1px solid #ccc;">${it.sector || ''}</td>
          <td style="padding:8px; border:1px solid #ccc;">${it.sell_price || 0}</td>
          <td style="padding:8px; border:1px solid #ccc;">${it.total || 0}</td>
        </tr>
      `).join('');

      html.innerHTML = `
        <div style="text-align:center; border-bottom:3px solid #003366; padding-bottom:20px; margin-bottom:20px;">
          ${s.logo_url ? `<img src="${s.logo_url}" style="height:80px; margin-bottom:10px;" />` : ''}
          <h1 style="margin:0; color:#003366;">${s.company_name_ar || 'صعود الطائرة'}</h1>
          <p>${s.company_name_en || 'Sueud Al Taayira'}</p>
          <p>VAT: ${vatNo} | CR: ${s.cr_no || ''} | IATA: ${s.iata_no || ''}</p>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
          <div><b>${isRefund ? 'Refund Invoice' : 'Invoice No'}:</b> ${inv.invoice_no}<br/><b>Booking Date:</b> ${inv.booking_date || 'N/A'}</div>
          <div><b>Invoice Date:</b> ${inv.invoice_date || 'N/A'}</div>
          <div><b>Client:</b> ${inv.customers?.name || ''}<br/><b>Phone:</b> ${inv.customers?.phone || ''}</div>
        </div>
        <table style="width:100%; border-collapse:collapse; text-align:center; font-size:12px;">
          <tr style="background:#003366; color:white;">
            <th style="padding:8px; border:1px solid #ccc;">Service</th>
            <th style="border:1px solid #ccc;">Ticket No</th>
            <th style="border:1px solid #ccc;">PNR</th>
            <th style="border:1px solid #ccc;">Sector</th>
            <th style="border:1px solid #ccc;">Price</th>
            <th style="border:1px solid #ccc;">Total</th>
          </tr>
          ${itemsRows}
        </table>
        <div style="margin-top:20px; display:flex; justify-content:space-between;">
          <img src="${qrDataUrl}" width="120" height="120" />
          <div style="text-align:left; direction:ltr;">
            <p>Total Before VAT: ${inv.total_sell.toFixed(2)} SAR</p>
            <p>VAT: ${inv.vat.toFixed(2)} SAR</p>
            <h3>Total: ${inv.total.toFixed(2)} SAR</h3>
            <p>Paid: ${inv.paid_amount.toFixed(2)} SAR | Due: ${inv.due_amount.toFixed(2)} SAR</p>
            <p>Payment Method: ${inv.payment_method || 'N/A'}</p>
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

  const filteredInvoices = data.invoices.filter(inv => {
    if (!fromDate || !toDate) return true;
    const invDate = inv.invoice_date || inv.created_at.split('T')[0];
    return invDate >= fromDate && invDate <= toDate;
  });
  
  const refundInvoices = data.invoices.filter(inv => inv.invoice_no.startsWith('REF-'));

  const menuIds = ['dashboard', 'create_inv', 'list_inv', 'portals', 'reports', 'settings'];
  const menuLabels = [tr.dash, tr.create, tr.list, tr.portals, tr.reports, tr.settings];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#f4f6f9', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <aside style={{ width: '260px', backgroundColor: '#1a1a24', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
          {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'40px', marginBottom:'10px'}} />}
          <h2 style={{ margin: 0 }}>{lang === 'en' ? 'Sueud Al Taayira' : 'صعود الطائرة'}</h2>
        </div>
        <nav style={{ flex: 1 }}>
          {menuIds.map((m, i) => (
            <button key={m} onClick={() => setPage(m)} style={{ width: '100%', textAlign: 'left', padding: '15px 20px', background: page === m ? '#2c3e50' : 'none', border: 'none', color: page === m ? '#fff' : '#aaa', cursor: 'pointer' }}>
              {menuLabels[i]}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ width: '100%', padding: '10px', background: '#2980b9', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '10px' }}>{lang === 'en' ? 'العربية' : 'English'}</button>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}>{tr.logout}</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ background: 'white', padding: '15px 30px', borderBottom: '2px solid #eee' }}>
          <h2 style={{ margin: 0 }}>{menuLabels[menuIds.indexOf(page)]}</h2>
        </header>

        <div style={{ padding: '30px' }}>
          
          {page === 'dashboard' && (
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '200px' }}>
                <h3>{lang === 'en' ? 'Total Sales' : 'إجمالي المبيعات'}</h3>
                <h1 style={{ color: '#2980b9' }}>{data.invoices.filter(i=>!i.invoice_no.startsWith('REF-')).reduce((s,i) => s + i.total, 0)} SAR</h1>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '200px' }}>
                <h3>{lang === 'en' ? 'Total Refunds' : 'إجمالي الاسترجاع'}</h3>
                <h1 style={{ color: '#e74c3c' }}>{refundInvoices.reduce((s,i) => s + i.total, 0)} SAR</h1>
              </div>
            </div>
          )}

          {page === 'create_inv' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <form onSubmit={handleCreateInvoice}>
                <h3>{lang === 'en' ? 'Customer & Dates' : 'بيانات العميل والتواريخ'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <input placeholder={tr.custName} value={invForm.customerName} onChange={(e) => setInvForm({...invForm, customerName: e.target.value})} required style={styles.i} />
                  <input placeholder={tr.phone} value={invForm.phone} onChange={(e) => setInvForm({...invForm, phone: e.target.value})} required style={styles.i} />
                  <input type="date" value={invForm.bookingDate} onChange={(e) => setInvForm({...invForm, bookingDate: e.target.value})} style={styles.i} />
                  <input type="date" value={invForm.invoiceDate} onChange={(e) => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.i} />
                </div>

                <h3>{lang === 'en' ? 'Service & Portal' : 'الخدمة والبوابة'}</h3>
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

                <h3>{tr.items}</h3>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 0.5fr 1fr 1fr 0.5fr', gap: '5px', marginBottom: '10px' }}>
                    <input placeholder={lang === 'en' ? 'Item Name' : 'اسم الصنف'} value={it.name} onChange={(e) => { const n=[...items]; n[idx].name=e.target.value; setItems(n); }} style={styles.i} required />
                    <input placeholder={tr.tNo} value={it.ticket_no} onChange={(e) => { const n=[...items]; n[idx].ticket_no=e.target.value; setItems(n); }} style={styles.i} />
                    <input placeholder={tr.pnr} value={it.pnr} onChange={(e) => { const n=[...items]; n[idx].pnr=e.target.value; setItems(n); }} style={styles.i} />
                    <input placeholder={tr.sector} value={it.sector} onChange={(e) => { const n=[...items]; n[idx].sector=e.target.value; setItems(n); }} style={styles.i} />
                    <input type="number" placeholder={tr.qty} value={it.qty} onChange={(e) => { const n=[...items]; n[idx].qty=e.target.value; setItems(n); }} style={styles.i} required />
                    <input type="number" placeholder={tr.cost} value={it.cost} onChange={(e) => { const n=[...items]; n[idx].cost=e.target.value; setItems(n); }} style={styles.i} required />
                    <input type="number" placeholder={tr.sell} value={it.sell} onChange={(e) => { const n=[...items]; n[idx].sell=e.target.value; setItems(n); }} style={styles.i} required />
                    <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} style={{ background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => setItems([...items, { name: '', ticket_no: '', pnr: '', sector: '', qty: 1, cost: 0, sell: 0 }])} style={{ background: '#3498db', color: 'white', padding: '10px', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>+ {lang === 'en' ? 'Add Item' : 'إضافة'}</button>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <input placeholder={tr.paid} type="number" value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.i} required />
                  <button type="submit" style={{ background: '#27ae60', color: 'white', padding: '12px 30px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>{tr.gen}</button>
                </div>
              </form>
            </div>
          )}

          {page === 'list_inv' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8f9fa' }}>
                  <th style={styles.th}>{tr.invNo}</th><th style={styles.th}>{tr.custName}</th><th style={styles.th}>{tr.total}</th><th style={styles.th}>{tr.status}</th><th style={styles.th}>{tr.actions}</th>
                </tr></thead>
                <tbody>
                  {data.invoices.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>{lang === 'en' ? 'No Invoices Yet.' : 'لا توجد فواتير.'}</td></tr> : 
                  data.invoices.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee', backgroundColor: inv.status === 'refunded' ? '#ffebee' : 'transparent' }}>
                      <td style={styles.td}>{inv.invoice_no}</td>
                      <td style={styles.td}>{inv.customers?.name || 'N/A'}</td>
                      <td style={styles.td}>{inv.total} SAR</td>
                      <td style={styles.td}>{inv.status === 'refunded' ? tr.refunded : tr.active}</td>
                      <td style={styles.td}>
                        <button onClick={() => handlePreview(inv)} style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>{tr.preview}</button>
                        {inv.status === 'active' && !inv.invoice_no.startsWith('REF-') && <button onClick={() => setRefundForm({id: inv.id, compRefund: 0, custRefund: 0})} style={{ background: '#e67e22', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', marginLeft: '5px' }}>{tr.refund}</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {refundForm.id && (
                <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #e67e22', borderRadius: '8px' }}>
                  <h3>{lang === 'en' ? 'Process Refund' : 'معالجة الاسترجاع'}</h3>
                  <form onSubmit={handleRefund} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <input type="number" placeholder={lang === 'en' ? 'Refund from Company' : 'استرجاع من الشركة'} value={refundForm.compRefund} onChange={(e) => setRefundForm({...refundForm, compRefund: e.target.value})} required style={styles.i} />
                    <input type="number" placeholder={lang === 'en' ? 'Refund to Customer' : 'استرجاع للعميل'} value={refundForm.custRefund} onChange={(e) => setRefundForm({...refundForm, custRefund: e.target.value})} required style={styles.i} />
                    <button type="submit" style={{ background: '#e67e22', color: 'white', border: 'none', cursor: 'pointer' }}>{lang === 'en' ? 'Confirm' : 'تأكيد'}</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {page === 'portals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>{tr.addComp}</h3>
                <form onSubmit={handleAddPortal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input name="name" placeholder={lang === 'en' ? 'e.g. Saudi Airlines' : 'مثال: الخطوط السعودية'} style={styles.i} required />
                  <button type="submit" style={styles.btn}>{tr.addComp}</button>
                </form>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>{tr.addRech}</h3>
                <form onSubmit={handleAddRecharge} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <select value={rechargeForm.portal} onChange={(e) => setRechargeForm({...rechargeForm, portal: e.target.value})} style={styles.i}>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <input type="date" value={rechargeForm.date} onChange={(e) => setRechargeForm({...rechargeForm, date: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder={lang === 'en' ? 'Amount' : 'المبلغ'} value={rechargeForm.amount} onChange={(e) => setRechargeForm({...rechargeForm, amount: e.target.value})} style={styles.i} required />
                  <input placeholder={lang === 'en' ? 'Description' : 'الوصف'} value={rechargeForm.desc} onChange={(e) => setRechargeForm({...rechargeForm, desc: e.target.value})} style={styles.i} />
                  <button type="submit" style={styles.btn}>{tr.addRech}</button>
                </form>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>{tr.balance}</h3>
                {data.portals.length === 0 ? <p>{lang === 'en' ? 'No companies.' : 'لا توجد شركات.'}</p> : data.portals.map(p => <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}><span>{p.name}</span><b>{p.current_balance} SAR</b></div>)}
              </div>
            </div>
          )}

          {page === 'reports' && (
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
              <h3>{lang === 'en' ? 'Date Range Filter' : 'فلتر النطاق الزمني'}</h3>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <label>{tr.fromD}: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={styles.i} /></label>
                <label>{tr.toD}: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={styles.i} /></label>
                <button onClick={() => exportCSV(filteredInvoices.map(i => ({ InvNo: i.invoice_no, Customer: i.customers?.name, Phone: i.customers?.phone, Date: i.invoice_date, Service: i.service_type, Total: i.total, Status: i.status })), 'Sales_Report.csv')} style={{...styles.btn, background: '#27ae60', width: 'auto', padding: '10px 20px'}}>{tr.expSales}</button>
                <button onClick={() => exportCSV(data.recharges.map(r => ({ Date: r.recharge_date, Company: r.portals?.name, Amount: r.amount, Desc: r.description })), 'Recharge_Report.csv')} style={{...styles.btn, background: '#2980b9', width: 'auto', padding: '10px 20px'}}>{tr.expRech}</button>
                <button onClick={() => exportCSV(data.customers, 'Customers.csv')} style={{...styles.btn, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>{tr.expCust}</button>
                <button onClick={() => exportCSV(refundInvoices.map(r => ({ RefNo: r.invoice_no, Customer: r.customers?.name, CompRefund: r.refund_company, CustRefund: r.refund_customer, Date: r.invoice_date })), 'Refund_Report.csv')} style={{...styles.btn, background: '#e67e22', width: 'auto', padding: '10px 20px'}}>{tr.expSales} ({tr.refund})</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>{lang === 'en' ? 'Date' : 'التاريخ'}</th><th style={styles.th}>{tr.invNo}</th><th style={styles.th}>{tr.custName}</th><th style={styles.th}>{tr.total}</th></tr></thead>
                <tbody>
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{inv.invoice_date}</td>
                      <td style={styles.td}>{inv.invoice_no}</td>
                      <td style={styles.td}>{inv.customers?.name}</td>
                      <td style={styles.td}>{inv.total} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page === 'settings' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <SettingsPage data={data.settings} fetchAll={fetchAll} lang={lang} />
            </div>
          )}
        </div>
      </main>

      {/* INVOICE PREVIEW MODAL */}
      {previewInv && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Invoice Preview</h2>
              <button onClick={() => setPreviewInv(null)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>X</button>
            </div>
            <div style={{ border: '1px solid #eee', padding: '20px' }}>
              <div style={{ textAlign: 'center', borderBottom: '3px solid #003366', paddingBottom: '20px' }}>
                {data.settings.logo_url && <img src={data.settings.logo_url} style={{height: '80px'}} />}
                <h1>{data.settings.company_name_ar || 'صعود الطائرة'}</h1>
                <p>{data.settings.company_name_en || 'Sueud Al Taayira'}</p>
                <p>VAT: {data.settings.vat_no} | CR: {data.settings.cr_no}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <div><b>Invoice No:</b> {previewInv.inv.invoice_no}<br/><b>Date:</b> {previewInv.inv.invoice_date}</div>
                <div><b>Client:</b> {previewInv.inv.customers?.name}<br/><b>Phone:</b> {previewInv.inv.customers?.phone}</div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
                <tr style={{ background: '#003366', color: 'white' }}>
                  <th style={styles.th}>Service</th><th style={styles.th}>Ticket No</th><th style={styles.th}>PNR</th><th style={styles.th}>Sector</th><th style={styles.th}>Price</th><th style={styles.th}>Total</th>
                </tr>
                {previewInv.items.map(it => (
                  <tr key={it.id}>
                    <td style={styles.td}>{it.item_name}</td>
                    <td style={styles.td}>{it.ticket_no}</td>
                    <td style={styles.td}>{it.pnr}</td>
                    <td style={styles.td}>{it.sector}</td>
                    <td style={styles.td}>{it.sell_price}</td>
                    <td style={styles.td}>{it.total}</td>
                  </tr>
                ))}
              </table>
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <p>Total Before VAT: {previewInv.inv.total_sell} SAR</p>
                <p>VAT: {previewInv.inv.vat} SAR</p>
                <h3>Total: {previewInv.inv.total} SAR</h3>
                <p>Paid: {previewInv.inv.paid_amount} SAR | Due: {previewInv.inv.due_amount} SAR</p>
                <p>Payment Method: {previewInv.inv.payment_method}</p>
              </div>
            </div>
            <button onClick={() => downloadPDF(previewInv.inv, previewInv.items)} style={{ width: '100%', padding: '15px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '20px' }}>Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage({ data, fetchAll, lang }) {
  const [form, setForm] = useState(data);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await supabase.from('settings').update(form).eq('id', 1);
    alert(lang === 'en' ? 'Settings Saved!' : 'تم حفظ الإعدادات!');
    fetchAll();
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `logo_${Date.now()}.png`;
    const { error } = await supabase.storage.from('logos').upload(fileName, file);
    if (error) { alert('Upload Error: ' + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
    setForm({ ...form, logo_url: urlData.publicUrl });
    setUploading(false);
    alert(lang === 'en' ? 'Logo Uploaded! Click Save.' : 'تم رفع الشعار! اضغط حفظ.');
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <input placeholder={lang === 'en' ? 'Company Name (EN)' : 'اسم الشركة (EN)'} value={form.company_name_en || ''} onChange={(e) => setForm({...form, company_name_en: e.target.value})} style={styles.i} />
      <input placeholder={lang === 'en' ? 'Company Name (AR)' : 'اسم الشركة (AR)'} value={form.company_name_ar || ''} onChange={(e) => setForm({...form, company_name_ar: e.target.value})} style={styles.i} />
      <input placeholder={lang === 'en' ? 'VAT Number' : 'الرقم الضريبي'} value={form.vat_no || ''} onChange={(e) => setForm({...form, vat_no: e.target.value})} style={styles.i} />
      <input placeholder={lang === 'en' ? 'CR Number' : 'السجل التجاري'} value={form.cr_no || ''} onChange={(e) => setForm({...form, cr_no: e.target.value})} style={styles.i} />
      <input placeholder={lang === 'en' ? 'IATA Number' : 'رقم الإياتا'} value={form.iata_no || ''} onChange={(e) => setForm({...form, iata_no: e.target.value})} style={styles.i} />
      <input placeholder={lang === 'en' ? 'Phone' : 'الهاتف'} value={form.phone || ''} onChange={(e) => setForm({...form, phone: e.target.value})} style={styles.i} />
      
      <div style={{ gridColumn: 'span 2', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <label><b>{lang === 'en' ? 'Upload Logo:' : 'رفع الشعار:'}</b></label><br/>
        {form.logo_url && <img src={form.logo_url} style={{height:'60px', marginTop:'10px', marginBottom:'10px'}} />}
        <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ marginTop: '10px' }} />
        {uploading && <p>Uploading...</p>}
      </div>

      <button type="submit" style={{ gridColumn: 'span 2', padding: '15px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>{lang === 'en' ? 'SAVE SETTINGS' : 'حفظ الإعدادات'}</button>
    </form>
  );
}

const styles = {
  i: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#003366', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' },
  th: { padding: '10px', textAlign: 'left', fontSize: '14px', border: '1px solid #ccc' },
  td: { padding: '10px', fontSize: '14px', border: '1px solid #ccc' }
};
