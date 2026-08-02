'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('sales');
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [previewInv, setPreviewInv] = useState(null);
  const router = useRouter();

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], recharges: [], settings: {}, employees: [], payroll: [], appUsers: [], expenses: [] });
  const today = new Date().toISOString().split('T')[0];
  
  const [invForm, setInvForm] = useState({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', portal: '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', payment: 'Cash', paid: '' });
  const [items, setItems] = useState([{ name: 'Ticket', ticket_no: '', pnr: '', sector: '', qty: 1, cost: 0, sell: 0 }]);
  const [refundForm, setRefundForm] = useState({ id: '', compRefund: 0, custRefund: 0 });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const t = {
    en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices & Refund', portals: 'Companies & Recharge', reports: 'P&L Statement & Export', settings: 'Settings', hr: 'HR & Accounting', users: 'User Management', logout: 'Logout', selectCust: 'Select Customer', newCust: '+ New Customer', comp: 'Company', indiv: 'Individual', custName: 'Customer Name', phone: 'Phone', bDate: 'Booking Date', iDate: 'Invoice Date', service: 'Service', portal: 'Portal', payment: 'Payment Method', paid: 'Paid Amount', items: 'Ticket Details', tNo: 'Ticket No', pnr: 'PNR', sector: 'Sector', qty: 'Qty', cost: 'Cost Price', sell: 'Sell Price', gen: 'Generate & Save', invNo: 'Invoice No', total: 'Total', status: 'Status', actions: 'Actions', preview: 'Preview', refund: 'Refund', del: 'Delete', active: 'Active', refunded: 'Refunded', addEmp: 'Add Employee', paySalary: 'Pay Salary', addExp: 'Add Office Expense', empName: 'Employee Name', role: 'Role', salary: 'Salary', addUser: 'Add System User', userName: 'User Name', email: 'Email', permission: 'Permission', sales: 'Sales', acc: 'Accountant', owner: 'Owner', monthlyProfit: 'Gross Profit', totalSales: 'Total Sales', totalSalary: 'Total Salaries', netProfit: 'Net Profit', todaySales: "Today's Sales", totalBal: 'Portals Balance' },
    ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'الفواتير والاسترجاع', portals: 'الشركات والرصيد', reports: 'كشف الأرباح والتصدير', settings: 'الإعدادات', hr: 'الموارد البشرية والحسابات', users: 'إدارة المستخدمين', logout: 'تسجيل الخروج', selectCust: 'اختر العميل', newCust: '+ عميل جديد', comp: 'شركة', indiv: 'فرد', custName: 'اسم العميل', phone: 'الهاتف', bDate: 'تاريخ الحجز', iDate: 'تاريخ الفاتورة', service: 'الخدمة', portal: 'البوابة', payment: 'طريقة الدفع', paid: 'المبلغ المدفوع', items: 'تفاصيل التذكرة', tNo: 'رقم التذكرة', pnr: 'PNR', sector: 'القطاع', qty: 'الكمية', cost: 'سعر التكلفة', sell: 'سعر البيع', gen: 'حفظ وإنشاء', invNo: 'رقم الفاتورة', total: 'الإجمالي', status: 'الحالة', actions: 'إجراءات', preview: 'معاينة', refund: 'استرجاع', del: 'حذف', active: 'نشط', refunded: 'مسترجع', addEmp: 'إضافة موظف', paySalary: 'دفع الراتب', addExp: 'إضافة مصروف', empName: 'اسم الموظف', role: 'الوظيفة', salary: 'الراتب', addUser: 'إضافة مستخدم', userName: 'اسم المستخدم', email: 'البريد الإلكتروني', permission: 'الصلاحية', sales: 'مبيعات', acc: 'محاسب', owner: 'مالك', monthlyProfit: 'إجمالي الربح', totalSales: 'إجمالي المبيعات', totalSalary: 'إجمالي الرواتب', netProfit: 'صافي الربح', todaySales: 'مبيعات اليوم', totalBal: 'رصيد البوابات' }
  };
  const tr = t[lang];

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return router.push('/login');
      setUser(session.user);
      if (session.user.email === 'atallah@sueud.com') setUserRole('owner');
      else {
        const { data: uData } = await supabase.from('app_users').select('*').eq('email', session.user.email).limit(1);
        setUserRole(uData && uData.length > 0 ? uData[0].role : 'sales');
      }
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
      let tCost = 0, tSell = 0;
      items.forEach(it => { tCost += parseFloat(it.cost) * parseInt(it.qty); tSell += parseFloat(it.sell) * parseInt(it.qty); });
      const vat = invForm.flightType === 'Domestic' ? tSell * 0.15 : 0;
      const total = tSell + vat;
      const paid = parseFloat(invForm.paid) || 0;
      const due = total - paid;
      const profit = tSell - tCost;

      let cid;
      if (invForm.custId === 'new') {
        const { data: nC } = await supabase.from('customers').insert([{ name: invForm.custName, phone: invForm.custPhone, type: invForm.custType }]).select().single();
        cid = nC.id;
      } else { cid = invForm.custId; }

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

  // PARTIAL REFUND LOGIC
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
      service_type: `Refund for ${inv.invoice_no}`, flight_type: inv.flight_type,
      total_sell: -custRef, total: -custRef, paid_amount: -custRef, status: 'refunded', refund_company: compRef, refund_customer: custRef
    }]);

    if (inv.portals) {
      await supabase.from('portals').update({ current_balance: (inv.portals.current_balance || 0) + compRef }).eq('id', inv.portals.id);
    }
    alert('Refund Invoice Generated!');
    setRefundForm({ id: '', compRefund: 0, custRefund: 0 });
    fetchAll();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice permanently?')) return;
    await supabase.from('invoices').delete().eq('id', id);
    alert('Invoice Deleted!');
    fetchAll();
  };

  const handleAddEntity = async (table, payload, msg) => {
    const { error } = await supabase.from(table).insert([payload]);
    if (error) return alert('Error: ' + error.message);
    alert(msg + ' Added!');
    fetchAll();
  };

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
      const tlv = String.fromCharCode(1) + String.fromCharCode((s.company_name_en||"S").length) + (s.company_name_en||"S") + String.fromCharCode(2) + String.fromCharCode((s.vat_no||"V").length) + (s.vat_no||"V") + String.fromCharCode(3) + String.fromCharCode(new Date(inv.created_at).toISOString().length) + new Date(inv.created_at).toISOString() + String.fromCharCode(4) + String.fromCharCode(inv.total.toFixed(2).length) + inv.total.toFixed(2) + String.fromCharCode(5) + String.fromCharCode(inv.vat.toFixed(2).length) + inv.vat.toFixed(2);
      const qrDataUrl = await QRCode.toDataURL(btoa(tlv));

      const html = document.createElement('div');
      html.style.width = '800px'; html.style.padding = '40px'; html.style.fontFamily = 'Arial'; html.style.direction = 'rtl'; html.style.position = 'absolute'; html.style.left = '-9999px'; html.style.backgroundColor = 'white';
      html.innerHTML = `
        <div style="text-align:center; border-bottom:3px solid #003366; padding-bottom:20px; margin-bottom:20px;">
          ${s.logo_url ? `<img src="${s.logo_url}" style="height:80px; margin-bottom:10px;" />` : ''}
          <h1 style="margin:0; color:#003366;">${s.company_name_ar || 'صعود الطائرة'}</h1>
          <p>${s.company_name_en || 'Sueud Al Taayira'}</p>
          <p>VAT: ${s.vat_no || ''} | CR: ${s.cr_no || ''}</p>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
          <div><b>Invoice No:</b> ${inv.invoice_no}<br/><b>Date:</b> ${inv.invoice_date || ''}</div>
          <div><b>Client:</b> ${inv.customers?.name || ''}<br/><b>Phone:</b> ${inv.customers?.phone || ''}</div>
        </div>
        <table style="width:100%; border-collapse:collapse; text-align:center; font-size:12px;">
          <tr style="background:#003366; color:white;"><th style="padding:8px; border:1px solid #ccc;">Service</th><th style="border:1px solid #ccc;">Ticket</th><th style="border:1px solid #ccc;">PNR</th><th style="border:1px solid #ccc;">Sector</th><th style="border:1px solid #ccc;">Total</th></tr>
          ${invItems.map(it => `<tr><td style="padding:8px; border:1px solid #ccc;">${it.item_name||''}</td><td style="padding:8px; border:1px solid #ccc;">${it.ticket_no||''}</td><td style="padding:8px; border:1px solid #ccc;">${it.pnr||''}</td><td style="padding:8px; border:1px solid #ccc;">${it.sector||''}</td><td style="padding:8px; border:1px solid #ccc;">${it.total||0}</td></tr>`).join('')}
        </table>
        <div style="margin-top:20px; display:flex; justify-content:space-between;">
          <img src="${qrDataUrl}" width="120" height="120" />
          <div style="text-align:left; direction:ltr;"><p>Total: ${inv.total.toFixed(2)} SAR</p><p>Paid: ${inv.paid_amount.toFixed(2)} SAR</p></div>
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

  // Calculations
  const tSales = data.invoices.filter(i => !i.invoice_no.startsWith('REF-')).reduce((s,i) => s + i.total, 0);
  const tProfit = data.invoices.filter(i => !i.invoice_no.startsWith('REF-')).reduce((s,i) => s + i.profit, 0);
  const tSalary = data.payroll.reduce((s,p) => s + p.amount, 0);
  const tExp = data.expenses.reduce((s,e) => s + e.amount, 0);
  const netProfit = tProfit - tSalary - tExp;
  const todaySales = data.invoices.filter(i => i.invoice_date === today && !i.invoice_no.startsWith('REF-')).reduce((s,i) => s + i.total, 0);
  const portalBalance = data.portals.reduce((s,p) => s + p.current_balance, 0);

  const filteredInvoices = data.invoices.filter(inv => {
    if (!fromDate || !toDate) return true;
    const invDate = inv.invoice_date || inv.created_at.split('T')[0];
    return invDate >= fromDate && invDate <= toDate;
  });

  const allMenu = [
    { id: 'dashboard', label: tr.dash, roles: ['owner', 'sales', 'acc'] },
    { id: 'create_inv', label: tr.create, roles: ['owner', 'sales'] },
    { id: 'list_inv', label: tr.list, roles: ['owner', 'sales', 'acc'] },
    { id: 'portals', label: tr.portals, roles: ['owner', 'sales'] },
    { id: 'hr', label: tr.hr, roles: ['owner', 'acc'] },
    { id: 'users', label: tr.users, roles: ['owner'] },
    { id: 'reports', label: tr.reports, roles: ['owner', 'acc'] },
    { id: 'settings', label: tr.settings, roles: ['owner'] },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#f4f6f9', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <aside style={{ width: '260px', backgroundColor: '#1a1a24', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
          {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'40px', marginBottom:'10px'}} />}
          <h2 style={{ margin: 0 }}>{lang === 'en' ? 'Sueud Al Taayira' : 'صعود الطائرة'}</h2>
        </div>
        <nav style={{ flex: 1 }}>
          {allMenu.filter(m => m.roles.includes(userRole)).map(m => (
            <button key={m.id} onClick={() => setPage(m.id)} style={{ width: '100%', textAlign: 'left', padding: '15px 20px', background: page === m.id ? '#2c3e50' : 'none', border: 'none', color: page === m.id ? '#fff' : '#aaa', cursor: 'pointer' }}>
              {m.label}
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
          <h2 style={{ margin: 0 }}>{allMenu.find(m=>m.id===page)?.label}</h2>
        </header>

        <div style={{ padding: '30px' }}>
          
          {page === 'dashboard' && (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={styles.card}><h3>{tr.todaySales}</h3><h1 style={{color:'#2980b9'}}>{todaySales.toFixed(0)} SAR</h1></div>
              <div style={styles.card}><h3>{tr.totalSales}</h3><h1 style={{color:'#2980b9'}}>{tSales.toFixed(0)} SAR</h1></div>
              <div style={styles.card}><h3>{tr.monthlyProfit}</h3><h1 style={{color:'#27ae60'}}>{tProfit.toFixed(0)} SAR</h1></div>
              <div style={styles.card}><h3>{tr.netProfit}</h3><h1 style={{color: netProfit>0?'#27ae60':'#e74c3c'}}>{netProfit.toFixed(0)} SAR</h1></div>
              <div style={styles.card}><h3>{tr.totalBal}</h3><h1 style={{color:'#f39c12'}}>{portalBalance.toFixed(0)} SAR</h1></div>
            </div>
          )}

          {page === 'create_inv' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <form onSubmit={handleCreateInvoice}>
                <h3>{tr.selectCust}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <select value={invForm.custId} onChange={(e) => setInvForm({...invForm, custId: e.target.value})} style={styles.i}>
                    <option value="new">{tr.newCust}</option>
                    {data.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                  {invForm.custId === 'new' && <>
                    <input placeholder={tr.custName} value={invForm.custName} onChange={(e) => setInvForm({...invForm, custName: e.target.value})} required style={styles.i} />
                    <input placeholder={tr.phone} value={invForm.custPhone} onChange={(e) => setInvForm({...invForm, custPhone: e.target.value})} required style={styles.i} />
                    <select value={invForm.custType} onChange={(e) => setInvForm({...invForm, custType: e.target.value})} style={styles.i}>
                      <option value="Individual">{tr.indiv}</option><option value="Corporate">{tr.comp}</option>
                    </select>
                  </>}
                </div>

                <h3>{tr.bDate} & {tr.portal}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <input type="date" value={invForm.bookingDate} onChange={(e) => setInvForm({...invForm, bookingDate: e.target.value})} style={styles.i} />
                  <input type="date" value={invForm.invoiceDate} onChange={(e) => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.i} />
                  <select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.i}>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.i}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option></select>
                </div>

                <h3>{tr.items}</h3>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 0.5fr 1fr 1fr 0.5fr', gap: '5px', marginBottom: '10px' }}>
                    <input placeholder="Name" value={it.name} onChange={(e) => { const n=[...items]; n[idx].name=e.target.value; setItems(n); }} style={styles.i} required />
                    <input placeholder={tr.tNo} value={it.ticket_no} onChange={(e) => { const n=[...items]; n[idx].ticket_no=e.target.value; setItems(n); }} style={styles.i} />
                    <input placeholder={tr.pnr} value={it.pnr} onChange={(e) => { const n=[...items]; n[idx].pnr=e.target.value; setItems(n); }} style={styles.i} />
                    <input placeholder={tr.sector} value={it.sector} onChange={(e) => { const n=[...items]; n[idx].sector=e.target.value; setItems(n); }} style={styles.i} />
                    <input type="number" placeholder={tr.qty} value={it.qty} onChange={(e) => { const n=[...items]; n[idx].qty=e.target.value; setItems(n); }} style={styles.i} required />
                    <input type="number" placeholder={tr.cost} value={it.cost} onChange={(e) => { const n=[...items]; n[idx].cost=e.target.value; setItems(n); }} style={styles.i} required />
                    <input type="number" placeholder={tr.sell} value={it.sell} onChange={(e) => { const n=[...items]; n[idx].sell=e.target.value; setItems(n); }} style={styles.i} required />
                    <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} style={{ background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => setItems([...items, { name: '', ticket_no: '', pnr: '', sector: '', qty: 1, cost: 0, sell: 0 }])} style={{ background: '#3498db', color: 'white', padding: '10px', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>+ Add</button>

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
                  {data.invoices.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee', backgroundColor: inv.status === 'refunded' ? '#ffebee' : 'transparent' }}>
                      <td style={styles.td}>{inv.invoice_no}</td>
                      <td style={styles.td}>{inv.customers?.name || 'N/A'}</td>
                      <td style={styles.td}>{inv.total} SAR</td>
                      <td style={styles.td}>{inv.status}</td>
                      <td style={styles.td}>
                        <button onClick={() => handlePreview(inv)} style={styles.btnSm}>Preview</button>
                        <button onClick={() => downloadPDF(inv, previewInv?.items || [])} style={{...styles.btnSm, background:'#8e44ad'}}>PDF</button>
                        {inv.status === 'active' && !inv.invoice_no.startsWith('REF-') && <button onClick={() => setRefundForm({id: inv.id, compRefund: 0, custRefund: 0})} style={{...styles.btnSm, background:'#e67e22'}}>Refund</button>}
                        <button onClick={() => handleDelete(inv.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {refundForm.id && (
                <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #e67e22', borderRadius: '8px' }}>
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
                <h3>Add Recharge</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('recharges', { portal_id: data.portals.find(p=>p.name===e.target.portal.value)?.id, amount: parseFloat(e.target.amt.value), recharge_date: today, description: e.target.desc.value }, 'Recharge'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select name="portal" style={styles.i}>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                  <input name="desc" placeholder="Desc" style={styles.i} />
                  <button type="submit" style={styles.btn}>Recharge</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Balances</h3>
                {data.portals.map(p => <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}><span>{p.name}</span><b>{p.current_balance} SAR</b></div>)}
              </div>
            </div>
          )}

          {page === 'hr' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>{tr.addEmp}</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('employees', { name: e.target.name.value, role: e.target.role.value, monthly_salary: e.target.sal.value }, 'Employee'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder={tr.empName} style={styles.i} required />
                  <input name="role" placeholder={tr.role} style={styles.i} required />
                  <input name="sal" type="number" placeholder={tr.salary} style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>{tr.paySalary}</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('payroll', { employee_id: e.target.emp.value, amount: e.target.amt.value, month: e.target.month.value }, 'Salary'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select name="emp" style={styles.i} required><option value="">Select</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                  <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                  <input name="month" type="month" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Pay</button>
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
            </div>
          )}

          {page === 'users' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>{tr.addUser}</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('app_users', { name: e.target.name.value, email: e.target.email.value, role: e.target.role.value }, 'User'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder={tr.userName} style={styles.i} required />
                  <input name="email" type="email" placeholder={tr.email} style={styles.i} required />
                  <select name="role" style={styles.i}><option value="sales">{tr.sales}</option><option value="acc">{tr.acc}</option></select>
                  <button type="submit" style={styles.btn}>Add User</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>System Users</h3>
                {data.appUsers.map(u => <div key={u.id} style={{borderBottom:'1px solid #eee', padding:'10px 0'}}>{u.name} ({u.email}) - <b>{u.role}</b></div>)}
              </div>
            </div>
          )}

          {page === 'reports' && (
            <div style={styles.card}>
              <h3>P&L Statement & Export</h3>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'200px'}}><h4>{tr.totalSales}</h4><h2>{tSales.toFixed(0)} SAR</h2></div>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'200px'}}><h4>{tr.monthlyProfit}</h4><h2>{tProfit.toFixed(0)} SAR</h2></div>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'200px'}}><h4>{tr.totalSalary}</h4><h2>{tSalary.toFixed(0)} SAR</h2></div>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'200px'}}><h4>Expenses</h4><h2>{tExp.toFixed(0)} SAR</h2></div>
                <div style={{flex:1, background:'#e8f8f5', padding:'15px', minWidth:'200px'}}><h4>{tr.netProfit}</h4><h2>{netProfit.toFixed(0)} SAR</h2></div>
              </div>

              <h3>Date Range Filter & Export</h3>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <label>From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={styles.i} /></label>
                <label>To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={styles.i} /></label>
                <button onClick={() => exportCSV(filteredInvoices.map(i => ({ InvNo: i.invoice_no, Customer: i.customers?.name, Phone: i.customers?.phone, Date: i.invoice_date, Service: i.service_type, Total: i.total, Status: i.status })), 'Sales_Report.csv')} style={{...styles.btn, background: '#27ae60', width: 'auto', padding: '10px 20px'}}>Export Sales CSV</button>
                <button onClick={() => exportCSV(data.recharges.map(r => ({ Date: r.recharge_date, Company: r.portals?.name, Amount: r.amount, Desc: r.description })), 'Recharge_Report.csv')} style={{...styles.btn, background: '#2980b9', width: 'auto', padding: '10px 20px'}}>Export Recharge CSV</button>
                <button onClick={() => exportCSV(data.customers, 'Customers.csv')} style={{...styles.btn, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Customers CSV</button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Invoice</th><th style={styles.th}>Customer</th><th style={styles.th}>Total</th></tr></thead>
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

          {page === 'settings' && <SettingsPage data={data.settings} fetchAll={fetchAll} lang={lang} />}
        </div>
      </main>

      {previewInv && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Invoice Preview</h2>
              <button onClick={() => setPreviewInv(null)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>X</button>
            </div>
            <div style={{ border: '1px solid #eee', padding: '20px' }}>
              <h3>{previewInv.inv.customers?.name}</h3>
              <p>Inv No: {previewInv.inv.invoice_no} | Date: {previewInv.inv.invoice_date}</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
                <tr style={{ background: '#003366', color: 'white' }}>
                  <th style={styles.th}>Service</th><th style={styles.th}>Ticket</th><th style={styles.th}>PNR</th><th style={styles.th}>Sector</th><th style={styles.th}>Total</th>
                </tr>
                {previewInv.items.map(it => (
                  <tr key={it.id}>
                    <td style={styles.td}>{it.item_name}</td><td style={styles.td}>{it.ticket_no}</td><td style={styles.td}>{it.pnr}</td><td style={styles.td}>{it.sector}</td><td style={styles.td}>{it.total}</td>
                  </tr>
                ))}
              </table>
              <h3 style={{textAlign:'right'}}>Total: {previewInv.inv.total} SAR</h3>
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
    if (error) { alert('Error: ' + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
    setForm({ ...form, logo_url: urlData.publicUrl });
    setUploading(false);
    alert(lang === 'en' ? 'Logo Uploaded! Click Save.' : 'تم رفع الشعار! اضغط حفظ.');
  };

  return (
    <form onSubmit={handleSave} style={{ background: 'white', padding: '30px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <input placeholder="Company Name (EN)" value={form.company_name_en || ''} onChange={(e) => setForm({...form, company_name_en: e.target.value})} style={styles.i} />
      <input placeholder="Company Name (AR)" value={form.company_name_ar || ''} onChange={(e) => setForm({...form, company_name_ar: e.target.value})} style={styles.i} />
      <input placeholder="VAT Number" value={form.vat_no || ''} onChange={(e) => setForm({...form, vat_no: e.target.value})} style={styles.i} />
      <input placeholder="CR Number" value={form.cr_no || ''} onChange={(e) => setForm({...form, cr_no: e.target.value})} style={styles.i} />
      <input placeholder="IATA Number" value={form.iata_no || ''} onChange={(e) => setForm({...form, iata_no: e.target.value})} style={styles.i} />
      <input placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({...form, phone: e.target.value})} style={styles.i} />
      
      <div style={{ gridColumn: 'span 2', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <label><b>Upload Logo:</b></label><br/>
        {form.logo_url && <img src={form.logo_url} style={{height:'60px', marginTop:'10px', marginBottom:'10px'}} />}
        <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ marginTop: '10px' }} />
        {uploading && <p>Uploading...</p>}
      </div>

      <button type="submit" style={{ gridColumn: 'span 2', padding: '15px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>SAVE SETTINGS</button>
    </form>
  );
}

const styles = {
  card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  i: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#003366', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' },
  btnSm: { background: '#2c3e50', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', marginRight: '5px' },
  th: { padding: '10px', textAlign: 'left', fontSize: '14px', border: '1px solid #ccc' },
  td: { padding: '10px', fontSize: '14px', border: '1px solid #ccc' }
};
