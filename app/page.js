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

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], employees: [], expenses: [], payroll: [], settings: {} });
  const today = new Date().toISOString().split('T')[0];
  
  const [invForm, setInvForm] = useState({ custId: 'new', custName: '', custPhone: '', portal: '', bookingDate: today, service: 'Flight', flightType: 'Domestic', payment: 'Cash', paid: '', pnr: '', sector: '', cost: 0, sell: 0 });

  const t = {
    en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices List', portals: 'Portals', hr: 'HR & Payroll', reports: 'Reports', settings: 'Settings', logout: 'Logout', newCust: '+ New Customer', custName: 'Customer Name', phone: 'Phone', portal: 'Portal', service: 'Service', payment: 'Payment', paid: 'Paid Amount', pnr: 'PNR', sector: 'Sector', cost: 'Cost Price', sell: 'Sell Price', gen: 'Generate Invoice', totalSales: 'Total Sales', totalProfit: 'Total Profit', netProfit: 'Net Profit', addCust: 'Add Customer', addEmp: 'Add Employee', addExp: 'Add Expense', addPortal: 'Add Portal', recharge: 'Recharge Portal' },
    ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'قائمة الفواتير', portals: 'البوابات', hr: 'الموارد البشرية', reports: 'التقارير', settings: 'الإعدادات', logout: 'تسجيل الخروج', newCust: '+ عميل جديد', custName: 'اسم العميل', phone: 'الهاتف', portal: 'البوابة', service: 'الخدمة', payment: 'الدفع', paid: 'المدفوع', pnr: 'PNR', sector: 'القطاع', cost: 'سعر التكلفة', sell: 'سعر البيع', gen: 'إنشاء الفاتورة', totalSales: 'إجمالي المبيعات', totalProfit: 'إجمالي الربح', netProfit: 'صافي الربح', addCust: 'إضافة عميل', addEmp: 'إضافة موظف', addExp: 'إضافة مصروف', addPortal: 'إضافة بوابة', recharge: 'شحن البوابة' }
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
    const emp = await supabase.from('employees').select('*');
    const exp = await supabase.from('expenses').select('*');
    const pay = await supabase.from('payroll').select(`*, employees(name)`);
    const set = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    
    const portalsData = por.data || [];
    setData({ invoices: inv.data || [], portals: portalsData, customers: cus.data || [], employees: emp.data || [], expenses: exp.data || [], payroll: pay.data || [], settings: set.data || {} });
    if (portalsData.length > 0) setInvForm(f => ({ ...f, portal: f.portal || portalsData[0].name }));
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const cost = parseFloat(invForm.cost) || 0;
      const sell = parseFloat(invForm.sell) || 0;
      const vat = invForm.flightType === 'Domestic' ? sell * 0.15 : 0;
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

      const invNo = `INV-${Date.now()}`;
      const { data: inv, error: invErr } = await supabase.from('invoices').insert([{
        invoice_no: invNo, customer_id: cid, portal_id: portal.id, booking_date: invForm.bookingDate, invoice_date: today,
        service_type: invForm.service, flight_type: invForm.flightType, pnr: invForm.pnr, sector: invForm.sector,
        total_cost: cost, total_sell: sell, profit, vat, total, paid_amount: paid, due_amount: due, payment_method: invForm.payment
      }]).select().single();
      if (invErr) throw invErr;

      await supabase.from('portals').update({ current_balance: (portal.current_balance || 0) - cost }).eq('id', portal.id);
      alert('Invoice Generated!');
      fetchAll();
      setPage('list');
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleAddEntity = async (table, payload, msg) => {
    const { error } = await supabase.from(table).insert([payload]);
    if (error) return alert('Error: ' + error.message);
    alert(msg + ' Added!');
    fetchAll();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return;
    await supabase.from('invoices').delete().eq('id', id);
    fetchAll();
  };

  const downloadPDF = async (inv) => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const { default: QRCode } = await import('qrcode');
      const s = data.settings;
      const enc = (t, v) => String.fromCharCode(t) + String.fromCharCode(v.length) + v;
      const tlv = enc(1, s.company_name_en||"Sueud") + enc(2, s.vat_no||"VAT") + enc(3, new Date(inv.created_at).toISOString()) + enc(4, inv.total.toFixed(2)) + enc(5, inv.vat.toFixed(2));
      const qr = await QRCode.toDataURL(btoa(tlv));

      const html = document.createElement('div');
      html.style.cssText = 'width:800px;padding:40px;font-family:Arial;direction:rtl;position:absolute;left:-9999px;background:#fff;';
      html.innerHTML = `
        <div style="text-align:center;border-bottom:3px solid #003366;padding-bottom:20px;margin-bottom:20px;">
          ${s.logo_url ? `<img src="${s.logo_url}" style="height:80px;margin-bottom:10px;"/>` : ''}
          <h1 style="margin:0;color:#003366;">${s.company_name_ar || 'صعود الطائرة'}</h1>
          <p>${s.company_name_en || 'Sueud Al Taiyyarah'}</p>
          <p>VAT: ${s.vat_no||''} | CR: ${s.cr_no||''}</p>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
          <div><b>Invoice No:</b> ${inv.invoice_no}<br/><b>Date:</b> ${inv.invoice_date}</div>
          <div><b>Client:</b> ${inv.customers?.name||''}<br/><b>Phone:</b> ${inv.customers?.phone||''}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;text-align:center;font-size:12px;">
          <tr style="background:#003366;color:white;"><th style="padding:8px;border:1px solid #ccc;">Service</th><th style="border:1px solid #ccc;">PNR</th><th style="border:1px solid #ccc;">Sector</th><th style="border:1px solid #ccc;">Total</th></tr>
          <tr><td style="padding:8px;border:1px solid #ccc;">${inv.service_type}</td><td style="padding:8px;border:1px solid #ccc;">${inv.pnr||''}</td><td style="padding:8px;border:1px solid #ccc;">${inv.sector||''}</td><td style="padding:8px;border:1px solid #ccc;">${inv.total.toFixed(2)}</td></tr>
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

  if (!user) return <div style={{ padding: 50, textAlign: 'center' }}>Loading Enterprise ERP...</div>;

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
    { id: 'reports', label: tr.reports },
    { id: 'settings', label: tr.settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#f4f6f9', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <aside style={{ width: '260px', backgroundColor: '#1a1a24', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
          {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'40px', marginBottom:'10px'}} />}
          <h2 style={{ margin: 0 }}>{lang === 'en' ? 'Sueud Al Taiyyarah' : 'صعود الطائرة'}</h2>
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
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}>{tr.logout}</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ background: 'white', padding: '15px 30px', borderBottom: '2px solid #eee' }}>
          <h2 style={{ margin: 0 }}>{menu.find(m=>m.id===page)?.label}</h2>
        </header>

        <div style={{ padding: '30px' }}>
          
          {page === 'dashboard' && (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={styles.card}><h3>{tr.totalSales}</h3><h1 style={{color:'#2980b9'}}>{tSales.toFixed(0)} SAR</h1></div>
              <div style={styles.card}><h3>{tr.totalProfit}</h3><h1 style={{color:'#27ae60'}}>{tProfit.toFixed(0)} SAR</h1></div>
              <div style={styles.card}><h3>{tr.netProfit}</h3><h1 style={{color: netProfit>0?'#27ae60':'#e74c3c'}}>{netProfit.toFixed(0)} SAR</h1></div>
              <div style={styles.card}><h3>Total Invoices</h3><h1>{data.invoices.length}</h1></div>
              <div style={styles.card}><h3>Total Customers</h3><h1>{data.customers.length}</h1></div>
            </div>
          )}

          {page === 'create' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <form onSubmit={handleCreateInvoice} style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <select value={invForm.custId} onChange={(e) => setInvForm({...invForm, custId: e.target.value})} style={styles.i}>
                    <option value="new">{tr.newCust}</option>
                    {data.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                  {invForm.custId === 'new' && <>
                    <input placeholder={tr.custName} value={invForm.custName} onChange={(e) => setInvForm({...invForm, custName: e.target.value})} required style={styles.i} />
                    <input placeholder={tr.phone} value={invForm.custPhone} onChange={(e) => setInvForm({...invForm, custPhone: e.target.value})} required style={styles.i} />
                  </>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
                  <input type="date" value={invForm.bookingDate} onChange={(e) => setInvForm({...invForm, bookingDate: e.target.value})} style={styles.i} required />
                  <select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.i}>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                  <select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.i}><option>Flight</option><option>Visa</option><option>Hotel</option><option>Package</option></select>
                  {invForm.service === 'Flight' && <select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.i}><option value="Domestic">Domestic (15% VAT)</option><option value="International">International (0% VAT)</option></select>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
                  <input placeholder={tr.pnr} value={invForm.pnr} onChange={(e) => setInvForm({...invForm, pnr: e.target.value})} style={styles.i} />
                  <input placeholder={tr.sector} value={invForm.sector} onChange={(e) => setInvForm({...invForm, sector: e.target.value})} style={styles.i} />
                  <input type="number" placeholder={tr.cost} value={invForm.cost} onChange={(e) => setInvForm({...invForm, cost: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder={tr.sell} value={invForm.sell} onChange={(e) => setInvForm({...invForm, sell: e.target.value})} style={styles.i} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', alignItems: 'center' }}>
                  <select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.i}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option></select>
                  <input type="number" placeholder={tr.paid} value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.i} required />
                  <button type="submit" style={{ background: '#27ae60', color: 'white', padding: '12px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>{tr.gen}</button>
                </div>
              </form>
            </div>
          )}

          {page === 'list' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Invoice No</th><th style={styles.th}>Customer</th><th style={styles.th}>PNR</th><th style={styles.th}>Total</th><th style={styles.th}>Actions</th></tr></thead>
                <tbody>
                  {data.invoices.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{inv.invoice_no}</td>
                      <td style={styles.td}>{inv.customers?.name || 'N/A'}</td>
                      <td style={styles.td}>{inv.pnr || 'N/A'}</td>
                      <td style={styles.td}>{inv.total} SAR</td>
                      <td style={styles.td}>
                        <button onClick={() => downloadPDF(inv)} style={styles.btnSm}>PDF</button>
                        <button onClick={() => handleDelete(inv.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page === 'portals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>{tr.addPortal}</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('portals', { name: e.target.name.value, current_balance: 0 }, 'Portal'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder="Portal Name" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>{tr.recharge}</h3>
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
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('employees', { name: e.target.name.value, role: e.target.role.value, salary: parseFloat(e.target.sal.value) }, 'Employee'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder="Emp Name" style={styles.i} required />
                  <input name="role" placeholder="Role" style={styles.i} required />
                  <input name="sal" type="number" placeholder="Salary" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Pay Salary</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('payroll', { employee_id: e.target.emp.value, amount: parseFloat(e.target.amt.value), month: e.target.month.value }, 'Salary'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
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

          {page === 'reports' && (
            <div style={styles.card}>
              <h3>P&L Statement</h3>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'200px'}}><h4>{tr.totalSales}</h4><h2>{tSales.toFixed(0)} SAR</h2></div>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'200px'}}><h4>{tr.totalProfit}</h4><h2>{tProfit.toFixed(0)} SAR</h2></div>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'200px'}}><h4>Salaries</h4><h2>{tSal.toFixed(0)} SAR</h2></div>
                <div style={{flex:1, background:'#f8f9fa', padding:'15px', minWidth:'200px'}}><h4>Expenses</h4><h2>{tExp.toFixed(0)} SAR</h2></div>
                <div style={{flex:1, background:'#e8f8f5', padding:'15px', minWidth:'200px'}}><h4>{tr.netProfit}</h4><h2>{netProfit.toFixed(0)} SAR</h2></div>
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
    <form onSubmit={handleSave} style={{ background: 'white', padding: '30px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <input placeholder="Company Name (EN)" value={form.company_name_en || ''} onChange={(e) => setForm({...form, company_name_en: e.target.value})} style={styles.i} />
      <input placeholder="Company Name (AR)" value={form.company_name_ar || ''} onChange={(e) => setForm({...form, company_name_ar: e.target.value})} style={styles.i} />
      <input placeholder="VAT Number" value={form.vat_no || ''} onChange={(e) => setForm({...form, vat_no: e.target.value})} style={styles.i} />
      <input placeholder="CR Number" value={form.cr_no || ''} onChange={(e) => setForm({...form, cr_no: e.target.value})} style={styles.i} />
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
  th: { padding: '10px', textAlign: 'left', fontSize: '14px' },
  td: { padding: '10px', fontSize: '14px' }
};
