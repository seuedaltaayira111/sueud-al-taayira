'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({ email: 'atallahalanazi@sueudaltaayira.com', username: 'Atallah', role: 'Owner', is_admin: true, can_access_invoices: true, can_access_bank: true, can_access_hr: true, can_access_reports: true, can_access_settings: true });
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });
  const [passForm, setPassForm] = useState({ newPass: '' });

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'مرحباً! أنا مساعدك في نظام ERP. كيف يمكنني مساعدتك اليوم؟' }]);
  const [chatInput, setChatInput] = useState('');

  const [search, setSearch] = useState('');
  const [tblPage, setTblPage] = useState(1);
  const itemsPerPage = 10;

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], recharges: [], settings: {}, employees: [], payroll: [], appUsers: [], expenses: [], services: [], cashbook: [], audits: [], investments: [], vendors: [], customFields: [], packages: [], branches: [] });
  const today = new Date().toISOString().split('T')[0];
  
  // Forms State
  const [invForm, setInvForm] = useState({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', passengerNames: '', employeeId: '', portal: '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', flightSub: 'New Booking', flightJourney: 'Single', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed' });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, desc: '', mode: 'Cash' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', compRefund: 0, custRefund: 0, mode: 'Cash' });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: '', date: today });
  const [repDate, setRepDate] = useState({ from: '', to: '' });
  const [reportTab, setReportTab] = useState('sales');
  const [setForm, setSetForm] = useState({ company_name_en: 'SUEUD AL TAIYYARAH', company_name_ar: 'صعود الطائرة للسفر و السياحة', vat_no: '', cr_no: '', iata_no: '', phone: '', logo_url: '', invoice_footer: 'Thank you for choosing us!' });
  const [userForm, setUserForm] = useState({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false });
  const [empForm, setEmpForm] = useState({ name: '', role: 'Sales' });
  const [srvForm, setSrvForm] = useState({ name: '' });
  const [portalForm, setPortalForm] = useState({ name: '', balance: 0 });
  const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [customFieldForm, setCustomFieldForm] = useState({ name: '' });
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '' });
  const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '' });
  const [payrollForm, setPayrollForm] = useState({ emp: '', amt: '', month: '', mode: 'Cash' });
  const [expenseForm, setExpenseForm] = useState({ cat: '', amt: '', desc: '', mode: 'Cash' });

  const t = {
    en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices List', refunds: 'Refund Invoices', customers: 'Customer List', portals: 'Portals & Recharge', bank: 'Bank & Cash', invest: 'Investments', hr: 'HR & Accounts', users: 'User Management', reports: 'Financial Reports', audit: 'Audit Logs', settings: 'Settings', vendors: 'Vendors (B2B)', packages: 'Tour Packages', branches: 'Branches', logout: 'Logout', search: 'Search...', ownerProfile: 'Owner Profile', changePass: 'Change Password' },
    ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'قائمة الفواتير', refunds: 'فواتير الاسترجاع', customers: 'قائمة العملاء', portals: 'البوابات والرصيد', bank: 'البنك والكاش', invest: 'الاستثمارات', hr: 'الموارد البشرية', users: 'إدارة المستخدمين', reports: 'التقارير المالية', audit: 'سجلات التدقيق', settings: 'الإعدادات', vendors: 'الموردون', packages: 'باقات سياحية', branches: 'الفروع', logout: 'تسجيل الخروج', search: 'بحث...', ownerProfile: 'ملف المالك', changePass: 'تغيير كلمة المرور' }
  };
  const tr = t[lang];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return router.push('/login');
      setUser(session.user);
      const { data: uData } = await supabase.from('app_users').select('*').eq('email', session.user.email).maybeSingle();
      if (uData) setUserProfile(uData);
      fetchAll();
    });
  }, [router]);

  const logAction = async (action) => { if (user) await supabase.from('audit_logs').insert([{ user_email: user.email, action }]); };

  const fetchAll = async () => {
    const inv = await supabase.from('invoices').select(`*, customers(name, type, phone), portals(name), employees(name)`).order('created_at', { ascending: false });
    const por = await supabase.from('portals').select('*');
    const cus = await supabase.from('customers').select('*').order('name', { ascending: true });
    const rec = await supabase.from('recharges').select(`*, portals(name)`).order('recharge_date', { ascending: false });
    const set = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    const emp = await supabase.from('employees').select('*');
    const pay = await supabase.from('payroll').select(`*, employees(name)`);
    const usr = await supabase.from('app_users').select('*');
    const exp = await supabase.from('expenses').select('*');
    const srv = await supabase.from('services').select('*');
    const cbk = await supabase.from('cashbook').select('*').order('trans_date', { ascending: false });
    const aud = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
    const invstmnt = await supabase.from('investments').select('*').order('invest_date', { ascending: false });
    const vnd = await supabase.from('vendors').select('*');
    const cf = await supabase.from('custom_fields').select('*');
    const pkgs = await supabase.from('packages').select('*');
    const brns = await supabase.from('branches').select('*');
    
    const portalsData = por.data || [];
    const servicesData = srv.data || [];
    const settingsData = set.data || {};
    setData({ invoices: inv.data || [], portals: portalsData, customers: cus.data || [], recharges: rec.data || [], settings: settingsData, employees: emp.data || [], payroll: pay.data || [], appUsers: usr.data || [], expenses: exp.data || [], services: servicesData, cashbook: cbk.data || [], audits: aud.data || [], investments: invstmnt.data || [], vendors: vnd.data || [], customFields: cf.data || [], packages: pkgs.data || [], branches: brns.data || [] });
    
    if (portalsData.length > 0) setInvForm(f => ({ ...f, portal: f.portal || portalsData[0].name }));
    if (servicesData.length > 0) setInvForm(f => ({ ...f, service: f.service || servicesData[0].name }));
    if (settingsData) setSetForm(settingsData);
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: passForm.newPass });
    if (error) return showToast('Error: ' + error.message);
    showToast('Password Updated Successfully!');
    setModal({ type: null, data: null });
    setPassForm({ newPass: '' });
  };

  const handleUpdateOwnerProfile = async (e) => {
    e.preventDefault();
    try {
      if (userProfile.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({ email: userProfile.email });
        if (authError) throw authError;
      }
      const { error: dbError } = await supabase.from('app_users').update({ email: userProfile.email, username: userProfile.username }).eq('id', userProfile.id);
      if (dbError) throw dbError;
      showToast('Profile Updated! Email change may require confirmation.');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const text = chatInput.toLowerCase();
    let botReply = "I can help with Invoices, Reports, or Users. (يمكنني المساعدة في الفواتير، التقارير، أو المستخدمين)";
    if (text.includes('invoice') || text.includes('فاتورة')) botReply = "Go to 'Create Invoice' to add Flight/Hotel details. It auto-calculates VAT!";
    else if (text.includes('report') || text.includes('تقرير')) botReply = "Download Excel reports from 'Financial Reports'. Select a date range!";
    else if (text.includes('refund') || text.includes('استرجاع')) botReply = "To refund, go to 'Invoices List' and click 'Refund'. Cash/Bank will auto-adjust.";
    setTimeout(() => setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]), 600);
    setChatInput('');
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const qty = parseInt(invForm.qty) || 1;
      const cost = (parseFloat(invForm.cost) || 0) * qty;
      let sell = (parseFloat(invForm.sell) || 0) * qty - (parseFloat(invForm.discount) || 0);
      const vat = sell * ((parseFloat(invForm.taxRate) || 0) / 100);
      const total = sell + vat;
      const paid = parseFloat(invForm.paid) || 0;
      const due = total - paid;
      let cid = invForm.custId;
      if (invForm.custId === 'new') { const { data: nC } = await supabase.from('customers').insert([{ name: invForm.custName, phone: invForm.custPhone, type: invForm.custType }]).select().single(); cid = nC.id; }
      const portal = data.portals.find(p => p.name === invForm.portal); if (!portal) throw new Error("Select Portal");
      
      let desc = invForm.service === 'Flight' ? `${invForm.airline} - ${invForm.flightSector}` : invForm.service;
      const payload = { customer_id: cid, portal_id: portal.id, service_type: invForm.service, pnr: invForm.pnr, sector: desc, total_cost: cost, total_sell: sell, profit: sell - cost, vat, total, paid_amount: paid, due_amount: due, payment_method: invForm.payment, invoice_date: invForm.invoiceDate };
      
      if (editingId) {
        const { data: upInv } = await supabase.from('invoices').update(payload).eq('id', editingId).select(`*, customers(name), portals(name)`).single();
        setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === editingId ? upInv : i) }));
        setEditingId(null);
        showToast('Invoice Updated!');
      } else {
        const invNo = `INV-${Date.now()}`;
        const { data: newInv } = await supabase.from('invoices').insert([{ invoice_no: invNo, ...payload }]).select(`*, customers(name), portals(name)`).single();
        const newPortalBal = (portal.current_balance || 0) - cost;
        await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', portal.id);
        if (paid > 0) { const cbType = invForm.payment === 'Cash' ? 'Cash-In' : 'Bank-In'; await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Payment for ${invNo}`, amount: paid }]); }
        setData(prev => ({ ...prev, invoices: [newInv, ...prev.invoices], portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: newPortalBal } : p) }));
        showToast('Invoice Generated!');
      }
      setPage('list');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleEditClick = (inv) => {
    setEditingId(inv.id);
    setInvForm({ custId: inv.customer_id, custName: '', custPhone: '', portal: inv.portals?.name, service: inv.service_type, flightSector: inv.sector, pnr: inv.pnr, cost: inv.total_cost, sell: inv.total_sell, paid: inv.paid_amount });
    setPage('create');
  };

  const handleSettlePayment = async (e) => {
    e.preventDefault();
    const inv = data.invoices.find(i => i.id === settleForm.id);
    if (!inv) return showToast('Not found');
    const newPaid = inv.paid_amount + inv.due_amount;
    const { data: upInv } = await supabase.from('invoices').update({ paid_amount: newPaid, due_amount: 0, settlement_date: settleForm.date, payment_method: settleForm.mode }).eq('id', inv.id).select(`*, customers(name), portals(name)`).single();
    const cbType = settleForm.mode === 'Cash' ? 'Cash-In' : 'Bank-In';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: settleForm.date, type: cbType, description: `Settlement for ${inv.invoice_no}`, amount: inv.due_amount }]).select().single();
    setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i), cashbook: [nC, ...prev.cashbook] }));
    showToast('Payment Settled!');
    setModal({ type: null, data: null });
  };

  const handleRefund = async (e) => {
    e.preventDefault();
    const inv = data.invoices.find(i => i.id === refundForm.id);
    if (!inv) return showToast('Not found');
    const compRef = parseFloat(refundForm.compRefund) || 0;
    const custRef = parseFloat(refundForm.custRefund) || 0;
    const { data: upInv } = await supabase.from('invoices').update({ status: 'refunded', refund_company: compRef, refund_customer: custRef }).eq('id', inv.id).select(`*, customers(name), portals(name)`).single();
    const refNo = `REF-${Date.now()}`;
    const { data: newRefInv } = await supabase.from('invoices').insert([{ invoice_no: refNo, customer_id: inv.customer_id, portal_id: inv.portal_id, service_type: `Refund for ${inv.invoice_no}`, total_sell: -custRef, total: -custRef, paid_amount: -custRef, status: 'refunded', refund_company: compRef, refund_customer: custRef }]).select(`*, customers(name), portals(name)`).single();
    let newPortalBal = inv.portals?.current_balance || 0;
    if (inv.portal_id) { newPortalBal += compRef; await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', inv.portal_id); }
    let newCashEntry = null;
    if (custRef > 0) { const cbType = refundForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out'; const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Refund to customer for ${inv.invoice_no}`, amount: custRef }]).select().single(); newCashEntry = nC; }
    setData(prev => ({ ...prev, invoices: [newRefInv, prev.invoices.map(i => i.id === inv.id ? upInv : i)].flat(), portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: newPortalBal } : p), cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook }));
    showToast('Refund Processed!');
    setModal({ type: null, data: null });
  };

  const handleAddEntity = async (table, payload, formSetter, msg) => {
    const { data: newItem, error } = await supabase.from(table).insert([payload]).select().single();
    if (error) return showToast('Error: ' + error.message);
    setData(prev => ({ ...prev, [table]: [newItem, ...prev[table]] }));
    showToast(msg);
    if (formSetter) formSetter({});
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    const p = data.portals.find(p => p.name === e.target.portal.value);
    const amount = parseFloat(e.target.amt.value);
    const mode = e.target.mode.value;
    const { data: newRec } = await supabase.from('recharges').insert([{ portal_id: p.id, amount, recharge_date: e.target.date.value, description: e.target.desc.value, payment_mode: mode }]).select('*, portals(name)').single();
    const newBal = (p.current_balance || 0) + amount;
    await supabase.from('portals').update({ current_balance: newBal }).eq('id', p.id);
    const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: e.target.date.value, type: cbType, description: `Recharge for ${p.name}`, amount }]).select().single();
    setData(prev => ({ ...prev, recharges: [newRec, ...prev.recharges], portals: prev.portals.map(por => por.id === p.id ? { ...por, current_balance: newBal } : por), cashbook: [nC, ...prev.cashbook] }));
    showToast('Recharged!');
    e.target.reset();
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const amt = parseFloat(transferForm.amount);
    if (amt <= 0 || transferForm.from === transferForm.to) return showToast("Invalid transfer");
    const entries = [];
    if (transferForm.from === 'Cash') entries.push({ trans_date: transferForm.date, type: 'Cash-Out', description: `Transfer to ${transferForm.to}`, amount: amt });
    if (transferForm.from === 'Bank') entries.push({ trans_date: transferForm.date, type: 'Bank-Out', description: `Transfer to ${transferForm.to}`, amount: amt });
    if (transferForm.to === 'Cash') entries.push({ trans_date: transferForm.date, type: 'Cash-In', description: `Transfer from ${transferForm.from}`, amount: amt });
    if (transferForm.to === 'Bank') entries.push({ trans_date: transferForm.date, type: 'Bank-In', description: `Transfer from ${transferForm.from}`, amount: amt });
    await Promise.all(entries.map(en => supabase.from('cashbook').insert([en])));
    await fetchAll();
    showToast('Fund Transferred!');
    setTransferForm({ from: 'Cash', to: 'Bank', amount: '', date: today });
  };

  const handlePaySalary = async (e) => {
    e.preventDefault();
    const emp = data.employees.find(em => em.id === payrollForm.emp);
    if (!emp) return showToast('Select Employee');
    const { data: newPay } = await supabase.from('payroll').insert([{ employee_id: payrollForm.emp, amount: parseFloat(payrollForm.amt), month: payrollForm.month, payment_mode: payrollForm.mode }]).select('*, employees(name)').single();
    const cbType = payrollForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Salary to ${emp.name}`, amount: parseFloat(payrollForm.amt) }]).select().single();
    setData(prev => ({ ...prev, payroll: [newPay, ...prev.payroll], cashbook: [nC, ...prev.cashbook] }));
    showToast('Salary Paid!');
    setPayrollForm({ emp: '', amt: '', month: '', mode: 'Cash' });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const { data: newExp } = await supabase.from('expenses').insert([{ category: expenseForm.cat, amount: parseFloat(expenseForm.amt), description: expenseForm.desc, payment_mode: expenseForm.mode }]).select().single();
    const cbType = expenseForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Expense: ${expenseForm.cat}`, amount: parseFloat(expenseForm.amt) }]).select().single();
    setData(prev => ({ ...prev, expenses: [newExp, ...prev.expenses], cashbook: [nC, ...prev.cashbook] }));
    showToast('Expense Added!');
    setExpenseForm({ cat: '', amt: '', desc: '', mode: 'Cash' });
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    const { data: newInv } = await supabase.from('investments').insert([{ investor_name: investForm.name, amount: parseFloat(investForm.amount), invest_date: investForm.date, description: investForm.desc, payment_mode: investForm.mode }]).select().single();
    const cbType = investForm.mode === 'Cash' ? 'Cash-In' : 'Bank-In';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: investForm.date, type: cbType, description: `Investment by ${investForm.name}`, amount: parseFloat(investForm.amount) }]).select().single();
    setData(prev => ({ ...prev, investments: [newInv, ...prev.investments], cashbook: [nC, ...prev.cashbook] }));
    showToast('Investment Added!');
    setInvestForm({ name: '', amount: '', date: today, desc: '', mode: 'Cash' });
  };

  const handleDelete = async (table, id) => { if (!confirm('Delete permanently?')) return; await supabase.from(table).delete().eq('id', id); setData(prev => ({ ...prev, [table]: prev[table].filter(item => item.id !== id) })); showToast('Deleted!'); };

  const filterData = (arr, dateKey) => {
    if (!repDate.from || !repDate.to) return arr;
    return arr.filter(i => (i[dateKey] || i.created_at?.split('T')[0]) >= repDate.from && (i[dateKey] || i.created_at?.split('T')[0]) <= repDate.to);
  };

  const exportCSV = (csvData, filename) => {
    if (!csvData || csvData.length === 0) return showToast('No data to export in selected range');
    const headers = Object.keys(csvData[0]);
    const csvRows = [headers.join(',')];
    for (const row of csvData) { csvRows.push(headers.map(h => `"${row[h] || ''}"`).join(',')); }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    showToast('Exported Successfully!');
  };

  const getInvoiceHTML = (inv, s) => {
    const isExempt = inv.vat === 0;
    const taxLabel = isExempt ? 'Exempt (معافاة)' : 'VAT 15% (ضريبة 15%)';
    return `
      <div style="width:800px;padding:40px;font-family:'Segoe UI',Tahoma,Arial;background:#fff;color:#333;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1E3A8A;padding-bottom:20px;margin-bottom:30px;">
          <div style="display:flex;align-items:center;gap:20px;">
            ${s.logo_url ? `<img src="${s.logo_url}" crossorigin="anonymous" style="height:140px;width:auto;object-fit:contain;" />` : ''}
            <div>
              <h1 style="margin:0;color:#1E3A8A;font-size:32px;font-weight:bold;">${s.company_name_en || 'SUEUD AL TAIYYARAH'}</h1>
              <h2 style="margin:0;color:#D97706;font-size:24px;">${s.company_name_ar || 'صعود الطائرة للسفر و السياحة'}</h2>
              <p style="font-size:12px;margin-top:10px;line-height:1.6;color:#555;">VAT: ${s.vat_no || ''} | CR: ${s.cr_no || ''}<br/>IATA: ${s.iata_no || ''} | Ph: ${s.phone || ''}</p>
            </div>
          </div>
          <div style="text-align:right;background:#1E3A8A;color:#fff;padding:15px 20px;border-radius:8px;">
            <h1 style="margin:0;font-size:24px;">TAX INVOICE</h1>
            <h2 style="margin:0;color:#FBBF24;font-size:18px;">فاتورة ضريبية</h2>
            <p style="font-size:13px;margin-top:10px;color:#eee;">Inv No: <b>${inv.invoice_no}</b><br/>Date: ${inv.invoice_date}</p>
          </div>
        </div>
        <div style="margin-bottom:30px;display:flex;justify-content:space-between;background:#f8fafc;padding:15px;border-radius:8px;border-left:5px solid #FBBF24;">
          <div><h3 style="margin:0 0 5px;color:#1E3A8A;font-size:14px;">BILL TO:</h3><p style="margin:0;font-size:16px;font-weight:bold;">${inv.customers?.name || ''}</p><p style="margin:0;font-size:12px;color:#666;">${inv.customers?.phone || ''}</p></div>
          <div style="text-align:right;"><p style="margin:0;font-size:12px;"><b>Sales Rep:</b> ${inv.employees?.name || 'N/A'}</p><p style="margin:0;font-size:12px;"><b>Status:</b> <span style="color:${inv.due_amount>0?'#EF4444':'#059669'};font-weight:bold;">${inv.due_amount>0?'UNPAID':'PAID'}</span></p></div>
        </div>
        <table style="width:100%;border-collapse:collapse;text-align:center;margin-bottom:30px;">
          <thead><tr style="background:#1E3A8A;color:#fff;"><th style="padding:12px;border:1px solid #1e3a8a;width:40%;">Service / Sector</th><th style="padding:12px;border:1px solid #1e3a8a;">PNR</th><th style="padding:12px;border:1px solid #1e3a8a;">Qty</th><th style="padding:12px;border:1px solid #1e3a8a;">Total</th></tr></thead>
          <tbody><tr style="background:#fff;"><td style="padding:12px;border:1px solid #ddd;text-align:left;font-size:13px;"><b>${inv.service_type}</b><br/><span style="font-size:11px;color:#666;">${inv.sector || ''}</span></td><td style="padding:12px;border:1px solid #ddd;font-size:12px;">${inv.pnr || 'N/A'}</td><td style="padding:12px;border:1px solid #ddd;font-size:12px;">${inv.qty || 1}</td><td style="padding:12px;border:1px solid #ddd;font-size:14px;font-weight:bold;">${inv.total_sell.toFixed(2)} SAR</td></tr></tbody>
        </table>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="text-align:center;background:#f8fafc;padding:10px;border-radius:8px;border:1px solid #eee;"><p style="margin:0 0 5px;font-size:10px;color:#666;">Scan for ZATCA Verification</p><img src="${inv.qrCode || ''}" width="120" height="120" /></div>
          <div style="width:320px;font-size:14px;">
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;"><span>Before VAT:</span><b>${inv.total_sell.toFixed(2)} SAR</b></div>
            ${inv.discount > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;color:#EF4444;"><span>Discount:</span><b>- ${inv.discount.toFixed(2)} SAR</b></div>` : ''}
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;"><span>${taxLabel}:</span><b>${inv.vat.toFixed(2)} SAR</b></div>
            <div style="display:flex;justify-content:space-between;background:#1E3A8A;color:#FBBF24;padding:12px;font-weight:bold;font-size:18px;border-radius:4px;margin-top:5px;"><span>TOTAL:</span><b>${inv.total.toFixed(2)} SAR</b></div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;color:#059669;margin-top:10px;"><span>Paid (${inv.payment_method}):</span><b>${inv.paid_amount.toFixed(2)} SAR</b></div>
            <div style="display:flex;justify-content:space-between;padding:12px 0;color:#EF4444;font-weight:bold;font-size:16px;"><span>BALANCE DUE:</span><b>${inv.due_amount.toFixed(2)} SAR</b></div>
          </div>
        </div>
        <div style="margin-top:50px;border-top:2px solid #FBBF24;padding-top:15px;text-align:center;"><p style="margin:0;font-size:12px;color:#666;">${s.invoice_footer || 'Thank you for choosing us!'}</p></div>
      </div>
    `;
  };

  const downloadPDF = async (inv) => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const { default: QRCode } = await import('qrcode');
      const s = data.settings;
      const enc = (tag, v) => String.fromCharCode(tag) + String.fromCharCode(v.length) + v;
      const tlv = enc(1, s.company_name_en||"S") + enc(2, s.vat_no||"V") + enc(3, new Date(inv.created_at).toISOString()) + enc(4, inv.total.toFixed(2)) + enc(5, inv.vat.toFixed(2));
      const qr = await QRCode.toDataURL(btoa(tlv));
      const html = document.createElement('div');
      html.innerHTML = getInvoiceHTML({...inv, qrCode: qr}, s);
      document.body.appendChild(html);
      const canvas = await html2canvas(html, { useCORS: true, allowTaint: true, scale: 2 });
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
      doc.save(`${inv.invoice_no}.pdf`);
      document.body.removeChild(html);
      showToast('PDF Downloaded!');
    } catch (err) { showToast('PDF Error: ' + err.message); }
  };

  if (!user) return <div style={{ padding: 50, textAlign: 'center' }}>Loading ERP...</div>;

  const activeInv = data.invoices.filter(i => !i.invoice_no.startsWith('REF-'));
  const refundInv = data.invoices.filter(i => i.invoice_no.startsWith('REF-'));
  const cashBalance = data.cashbook.filter(c => c.type === 'Cash-In').reduce((s,c) => s + c.amount, 0) - data.cashbook.filter(c => c.type === 'Cash-Out').reduce((s,c) => s + c.amount, 0);
  const bankBalance = data.cashbook.filter(c => c.type === 'Bank-In').reduce((s,c) => s + c.amount, 0) - data.cashbook.filter(c => c.type === 'Bank-Out').reduce((s,c) => s + c.amount, 0);
  const tSales = activeInv.reduce((s,i) => s + i.total, 0);
  const tProfit = activeInv.reduce((s,i) => s + i.profit, 0);
  const totalOutstanding = activeInv.filter(i=>i.due_amount>0).reduce((s,i)=>s+i.due_amount,0);

  const filteredInvoices = activeInv.filter(inv => inv.invoice_no.toLowerCase().includes(search.toLowerCase()) || inv.customers?.name.toLowerCase().includes(search.toLowerCase()));
  const paginatedInv = filteredInvoices.slice((tblPage - 1) * itemsPerPage, tblPage * itemsPerPage);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const menu = [
    { id: 'dashboard', label: tr.dash, show: true },
    { id: 'create', label: tr.create, show: userProfile.is_admin || userProfile.can_access_invoices },
    { id: 'list', label: tr.list, show: userProfile.is_admin || userProfile.can_access_invoices },
    { id: 'refunds', label: tr.refunds, show: userProfile.is_admin || userProfile.can_access_invoices },
    { id: 'customers', label: tr.customers, show: userProfile.is_admin || userProfile.can_access_invoices },
    { id: 'portals', label: tr.portals, show: userProfile.is_admin || userProfile.can_access_invoices },
    { id: 'vendors', label: tr.vendors, show: userProfile.is_admin || userProfile.can_access_invoices },
    { id: 'packages', label: tr.packages, show: userProfile.is_admin || userProfile.can_access_invoices },
    { id: 'branches', label: tr.branches, show: userProfile.is_admin || userProfile.can_access_settings },
    { id: 'bank', label: tr.bank, show: userProfile.is_admin || userProfile.can_access_bank },
    { id: 'invest', label: tr.invest, show: userProfile.is_admin || userProfile.can_access_bank },
    { id: 'hr', label: tr.hr, show: userProfile.is_admin || userProfile.can_access_hr },
    { id: 'users', label: tr.users, show: userProfile.is_admin },
    { id: 'reports', label: tr.reports, show: userProfile.is_admin || userProfile.can_access_reports },
    { id: 'audit', label: tr.audit, show: userProfile.is_admin },
    { id: 'settings', label: tr.settings, show: userProfile.is_admin || userProfile.can_access_settings },
  ].filter(m => m.show);

  const currentReportData = () => {
    if (reportTab === 'sales') return filterData(activeInv, 'invoice_date');
    if (reportTab === 'refunds') return filterData(refundInv, 'invoice_date');
    if (reportTab === 'recharges') return filterData(data.recharges, 'recharge_date');
    if (reportTab === 'cashbook') return filterData(data.cashbook, 'trans_date');
    if (reportTab === 'investments') return filterData(data.investments, 'invest_date');
    if (reportTab === 'payroll') return filterData(data.payroll, 'paid_date');
    if (reportTab === 'expenses') return filterData(data.expenses, 'expense_date');
    return [];
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Poppins', sans-serif", background: '#F1F5F9', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      
      {toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: '#FBBF24', padding: '15px 25px', borderRadius: '12px', zIndex: 9999, boxShadow: '0 5px 15px rgba(0,0,0,0.2)', fontWeight: '600' }}>{toast}</div>}

      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>
        {chatOpen && (
          <div style={{ width: '380px', height: '500px', background: 'white', borderRadius: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ background: 'linear-gradient(90deg, #1E3A8A, #2563EB)', color: 'white', padding: '20px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              ERP AI Assistant (مساعد)
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>✖</button>
            </div>
            <div style={{ flex: 1, padding: '20px', fontSize: '14px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? '#2563EB' : 'white', color: msg.sender === 'user' ? 'white' : '#1E293B', padding: '12px 18px', borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0', maxWidth: '80%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>{msg.text}</div>
              ))}
            </div>
            <div style={{ padding: '15px', borderTop: '1px solid #e2e8f0', display: 'flex', background: 'white' }}>
              <input placeholder="Type message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '25px', padding: '12px 20px', outline: 'none' }} />
              <button onClick={handleSendMessage} style={{ background: '#FBBF24', color: '#1E3A8A', border: 'none', padding: '0 25px', cursor: 'pointer', marginLeft: '10px', borderRadius: '25px', fontWeight: 'bold' }}>Send</button>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} style={{ width: '65px', height: '65px', borderRadius: '50%', background: 'linear-gradient(135deg, #FBBF24, #D97706)', color: '#1E3A8A', border: 'none', fontSize: '30px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(251, 191, 36, 0.4)' }}>💬</button>
      </div>

      {modal.type && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setModal({type: null, data: null})}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '850px', maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '2px solid #FBBF24', paddingBottom: '10px' }}>
              <h2 style={{ color: '#1E3A8A', margin: 0 }}>
                {modal.type === 'settle' && 'Settle Credit Payment'}
                {modal.type === 'refund' && 'Process Refund'}
                {modal.type === 'preview' && 'Invoice Preview'}
                {modal.type === 'ledger' && 'Customer Ledger'}
                {modal.type === 'password' && tr.changePass}
              </h2>
              <button onClick={() => setModal({type: null, data: null})} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#EF4444' }}>✖</button>
            </div>

            {modal.type === 'password' && (
              <form onSubmit={handleChangePassword}>
                <p style={{color: '#555', marginBottom: '15px'}}>Enter a new password for your account.</p>
                <input type="password" placeholder="New Password" value={passForm.newPass} onChange={(e) => setPassForm({ newPass: e.target.value })} required style={styles.input} />
                <button type="submit" style={{...styles.btnPrimary, marginTop: '15px'}}>Update Password</button>
              </form>
            )}

            {modal.type === 'settle' && (
              <form onSubmit={handleSettlePayment}>
                <p><b>Invoice:</b> {modal.data.invoice_no} | <b>Due:</b> {modal.data.due_amount} SAR</p>
                <input type="hidden" value={modal.data.id} onChange={(e) => setSettleForm({...settleForm, id: e.target.value})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <input type="date" value={settleForm.date} onChange={(e) => setSettleForm({...settleForm, date: e.target.value})} required style={styles.input} />
                  <select value={settleForm.mode} onChange={(e) => setSettleForm({...settleForm, mode: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option></select>
                </div>
                <button type="submit" style={{...styles.btnPrimary, background: 'linear-gradient(90deg, #059669, #10B981)'}}>Confirm Settlement</button>
              </form>
            )}

            {modal.type === 'refund' && (
              <form onSubmit={handleRefund}>
                <p style={{fontSize:'12px', color:'#666', marginBottom: '15px'}}>Company refund auto-adds to Portal. Customer refund deducts from Cash/Bank.</p>
                <input type="hidden" value={modal.data.id} onChange={(e) => setRefundForm({...refundForm, id: e.target.value})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <input type="number" placeholder="Company Refund Amount" onChange={(e) => setRefundForm({...refundForm, compRefund: e.target.value})} required style={styles.input} />
                  <input type="number" placeholder="Customer Refund Amount" onChange={(e) => setRefundForm({...refundForm, custRefund: e.target.value})} required style={styles.input} />
                  <select value={refundForm.mode} onChange={(e) => setRefundForm({...refundForm, mode: e.target.value})} style={styles.input}><option value="Cash">Pay Cust via Cash</option><option value="Bank Transfer">Pay Cust via Bank</option></select>
                </div>
                <button type="submit" style={{...styles.btnPrimary, background: 'linear-gradient(90deg, #D97706, #FBBF24)'}}>Confirm Refund</button>
              </form>
            )}

            {modal.type === 'preview' && (
              <div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' }} dangerouslySetInnerHTML={{ __html: getInvoiceHTML(modal.data, data.settings) }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => downloadPDF(modal.data)} style={{ flex: 1, background: 'linear-gradient(90deg, #1E3A8A, #2563EB)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Download PDF</button>
                  <a href={`https://wa.me/${modal.data.customers?.phone || ''}?text=Dear%20${modal.data.customers?.name || ''},%20your%20invoice%20${modal.data.invoice_no}%20of%20${modal.data.total}%20SAR%20is%20ready.`} target="_blank" style={{ flex: 1, background: '#25D366', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold' }}>Send WhatsApp</a>
                </div>
              </div>
            )}

            {modal.type === 'ledger' && (
              <div>
                <h3>{modal.data.name} - {modal.data.phone}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                  <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.td}>Date</th><th style={styles.td}>Inv No</th><th style={styles.td}>Total</th><th style={styles.td}>Paid</th><th style={styles.td}>Due</th></tr></thead>
                  <tbody>
                    {data.invoices.filter(inv => inv.customer_id === modal.data.id).map(inv => (
                      <tr key={inv.id}><td style={styles.td}>{inv.invoice_date}</td><td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.total}</td><td style={{...styles.td, color:'#059669'}}>{inv.paid_amount}</td><td style={{...styles.td, color:'#EF4444'}}>{inv.due_amount}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <aside style={{ width: '280px', background: 'linear-gradient(180deg, #0F172A 0%, #1E3A8A 100%)', color: '#FBBF24', display: 'flex', flexDirection: 'column', boxShadow: '5px 0 15px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid rgba(251, 191, 36, 0.3)' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', fontFamily: "'Tajawal', sans-serif" }}>صعود الطائرة للسفر و السياحة</h2>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
          {menu.map(m => (
            <button key={m.id} onClick={() => { setPage(m.id); setEditingId(null); }} style={{ width: '100%', textAlign: 'left', padding: '15px 30px', background: page === m.id ? 'linear-gradient(90deg, #FBBF24, #D97706)' : 'transparent', border: 'none', color: page === m.id ? '#0F172A' : '#FBBF24', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>{m.label}</button>
          ))}
        </nav>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#FBBF24', border: '1px solid #FBBF24', cursor: 'pointer', marginBottom: '10px', borderRadius: '8px', fontWeight: '600' }}>{lang === 'en' ? 'العربية' : 'English'}</button>
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #991B1B, #EF4444)', color: '#FFF', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>{tr.logout}</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ background: 'white', padding: '20px 40px', borderBottom: '1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <h2 style={{ margin: 0, color: '#0F172A', fontSize: '24px', fontWeight: '700' }}>{menu.find(m=>m.id===page)?.label}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => setModal({ type: 'password' })} style={{ background: '#f1f5f9', color: '#1E293B', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>🔑 {tr.changePass}</button>
            <div style={{ fontSize: '14px', color: '#64748B', textAlign: 'right', fontWeight: '500' }}>
              <b style={{color: '#0F172A'}}>{userProfile.username || user.email}</b><br/><span style={{color: '#FBBF24', background: '#1E3A8A', padding: '2px 8px', borderRadius: '4px', fontSize: '12px'}}>{userProfile.role}</span>
            </div>
          </div>
        </header>

        <div style={{ padding: '40px' }}>
          
          {page === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                <div style={{...styles.card, background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white'}}><h3 style={{margin:0, opacity:0.8, fontSize:'16px'}}>Total Sales</h3><h1 style={{margin:'10px 0 0', fontSize:'32px', fontWeight:'800'}}>{tSales.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, background: 'linear-gradient(135deg, #059669, #10B981)', color: 'white'}}><h3 style={{margin:0, opacity:0.8, fontSize:'16px'}}>Gross Profit</h3><h1 style={{margin:'10px 0 0', fontSize:'32px', fontWeight:'800'}}>{tProfit.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, background: 'linear-gradient(135deg, #D97706, #FBBF24)', color: 'white'}}><h3 style={{margin:0, opacity:0.8, fontSize:'16px'}}>Cash Balance</h3><h1 style={{margin:'10px 0 0', fontSize:'32px', fontWeight:'800'}}>{cashBalance.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', color: 'white'}}><h3 style={{margin:0, opacity:0.8, fontSize:'16px'}}>Bank Balance</h3><h1 style={{margin:'10px 0 0', fontSize:'32px', fontWeight:'800'}}>{bankBalance.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, background: 'linear-gradient(135deg, #EF4444, #F87171)', color: 'white'}}><h3 style={{margin:0, opacity:0.8, fontSize:'16px'}}>Outstanding</h3><h1 style={{margin:'10px 0 0', fontSize:'32px', fontWeight:'800'}}>{totalOutstanding.toFixed(0)} SAR</h1></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
                <div style={styles.card}>
                  <h3 style={{color:'#0F172A', marginBottom:'20px', fontSize:'18px'}}>Recent Invoices</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#f8fafc', color: '#1E3A8A' }}><th style={styles.td}>Invoice No</th><th style={styles.td}>Customer</th><th style={styles.td}>Total</th></tr></thead>
                    <tbody>{activeInv.slice(0, 5).map(inv => <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.customers?.name || 'N/A'}</td><td style={styles.td}><b>{inv.total} SAR</b></td></tr>)}</tbody>
                  </table>
                </div>
                <div style={styles.card}>
                  <h3 style={{color:'#0F172A', marginBottom:'20px', fontSize:'18px'}}>Portal Balances</h3>
                  {data.portals.map(p => (
                    <div key={p.id} style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#1E293B' }}>{p.name}</span>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: p.current_balance < 0 ? '#EF4444' : '#1E3A8A' }}>{p.current_balance || 0} SAR</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {page === 'create' && (
            <div style={styles.card}>
              <form onSubmit={handleCreateInvoice}>
                <h3 style={{color: '#1E3A8A', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Customer Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div><label style={styles.label}>Select Customer</label><select value={invForm.custId} onChange={(e) => setInvForm({...invForm, custId: e.target.value})} style={styles.input} disabled={editingId}><option value="new">+ New Customer</option>{data.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}</select></div>
                  {invForm.custId === 'new' && <>
                    <div><label style={styles.label}>Name</label><input placeholder="Enter Name" value={invForm.custName} onChange={(e) => setInvForm({...invForm, custName: e.target.value})} required style={styles.input} /></div>
                    <div><label style={styles.label}>Phone</label><input placeholder="Enter Phone" value={invForm.custPhone} onChange={(e) => setInvForm({...invForm, custPhone: e.target.value})} required style={styles.input} /></div>
                  </>}
                </div>
                <h3 style={{color: '#1E3A8A', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Service Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div><label style={styles.label}>Service</label><select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.input}>{data.services.map(s => <option key={s.id}>{s.name}</option>)}</select></div>
                  {invForm.service === 'Flight' && <>
                    <div><label style={styles.label}>Flight Type</label><select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.input}><option>Domestic</option><option>International</option></select></div>
                    <div><label style={styles.label}>Airline</label><input placeholder="Flynas" value={invForm.airline} onChange={(e) => setInvForm({...invForm, airline: e.target.value})} style={styles.input} required /></div>
                    <div><label style={styles.label}>Sector</label><input placeholder="JED - RUH" value={invForm.flightSector} onChange={(e) => setInvForm({...invForm, flightSector: e.target.value})} style={styles.input} required /></div>
                    <div><label style={styles.label}>PNR</label><input placeholder="PNR" value={invForm.pnr} onChange={(e) => setInvForm({...invForm, pnr: e.target.value})} style={styles.input} required /></div>
                  </>}
                  {invForm.service === 'Hotel' && <>
                    <div><label style={styles.label}>Hotel Name</label><input placeholder="Hotel Name" value={invForm.hotelName} onChange={(e) => setInvForm({...invForm, hotelName: e.target.value})} style={styles.input} required /></div>
                    <div><label style={styles.label}>Destination</label><input placeholder="Dubai" value={invForm.destination} onChange={(e) => setInvForm({...invForm, destination: e.target.value})} style={styles.input} required /></div>
                  </>}
                  {data.customFields.map(f => (
                    <div key={f.id}><label style={styles.label}>{f.name}</label><input placeholder={f.name} style={styles.input} /></div>
                  ))}
                </div>
                <h3 style={{color: '#1E3A8A', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Pricing & Payment</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div><label style={styles.label}>Portal</label><select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.input} required><option value="">Select</option>{data.portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                  <div><label style={styles.label}>Cost Price</label><input type="number" value={invForm.cost} onChange={(e) => setInvForm({...invForm, cost: e.target.value})} style={styles.input} required /></div>
                  <div><label style={styles.label}>Sell Price</label><input type="number" value={invForm.sell} onChange={(e) => setInvForm({...invForm, sell: e.target.value})} style={styles.input} required /></div>
                  <div><label style={styles.label}>Paid Amount</label><input type="number" value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.input} required /></div>
                </div>
                <button type="submit" style={{ background: 'linear-gradient(90deg, #1E3A8A, #2563EB)', color: '#FBBF24', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', padding: '15px', width: '100%', borderRadius: '8px' }}>{editingId ? 'Update Invoice' : 'Generate Invoice'}</button>
              </form>
            </div>
          )}

          {page === 'list' && (
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input placeholder={tr.search} value={search} onChange={(e) => { setSearch(e.target.value); setTblPage(1); }} style={{...styles.input, padding: '12px', width: '70%'}} />
                <button onClick={() => exportCSV(activeInv, 'Sales_Invoices.csv')} style={{...styles.btnPrimary, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.th}>Inv No</th><th style={styles.th}>Customer</th><th style={styles.th}>Total</th><th style={styles.th}>Actions</th></tr></thead>
                <tbody>
                  {paginatedInv.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: inv.due_amount > 0 ? '#fff3cd' : 'transparent' }}>
                      <td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.customers?.name || 'N/A'}</td><td style={styles.td}>{inv.total} SAR</td>
                      <td style={styles.td}>
                        <button onClick={() => setModal({type: 'preview', data: inv})} style={styles.btnSm}>Preview</button>
                        <button onClick={() => handleEditClick(inv)} style={{...styles.btnSm, background:'#2563EB'}}>Edit</button>
                        {inv.due_amount > 0 && <button onClick={() => { setSettleForm({id: inv.id, date: today, mode: 'Cash'}); setModal({type:'settle', data: inv}); }} style={{...styles.btnSm, background:'#059669'}}>Settle</button>}
                        <button onClick={() => { setRefundForm({id: inv.id, compRefund: 0, custRefund: 0, mode: 'Cash'}); setModal({type:'refund', data: inv}); }} style={{...styles.btnSm, background:'#D97706'}}>Refund</button>
                        <button onClick={() => handleDelete('invoices', inv.id)} style={{...styles.btnSm, background:'#EF4444'}}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page === 'refunds' && (
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{margin: 0}}>All Refunds</h3>
                <button onClick={() => exportCSV(refundInv, 'Refunds.csv')} style={{...styles.btnPrimary, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#EF4444', color: 'white' }}><th style={styles.th}>Refund No</th><th style={styles.th}>Original Inv</th><th style={styles.th}>Cust Refund</th><th style={styles.th}>Comp Refund</th></tr></thead>
                <tbody>{refundInv.map(inv => <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.service_type}</td><td style={{...styles.td, color:'red'}}>{inv.refund_customer} SAR</td><td style={{...styles.td, color:'green'}}>{inv.refund_company} SAR</td></tr>)}</tbody>
              </table>
            </div>
          )}

          {page === 'customers' && (
            <div style={styles.card}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <h3 style={{margin: 0}}>Customer List (CRM)</h3>
                <button onClick={() => exportCSV(data.customers, 'Customers.csv')} style={{...styles.btnPrimary, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.th}>Name</th><th style={styles.th}>Phone</th><th style={styles.th}>Action</th></tr></thead>
                <tbody>{data.customers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{c.name}</td><td style={styles.td}>{c.phone}</td><td style={styles.td}><button onClick={() => setModal({type: 'ledger', data: c})} style={{...styles.btnSm, background:'#2563EB'}}>Ledger</button><button onClick={() => handleDelete('customers', c.id)} style={{...styles.btnSm, background:'#EF4444'}}>Del</button></td></tr>)}</tbody>
              </table>
            </div>
          )}

          {page === 'portals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.card}>
                  <h3 style={{color:'#1E3A8A'}}>Add Portal</h3>
                  <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('portals', { name: portalForm.name, current_balance: parseFloat(portalForm.balance) || 0 }, setPortalForm, 'Portal Added!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input placeholder="Portal Name" value={portalForm.name} onChange={(e) => setPortalForm({...portalForm, name: e.target.value})} style={styles.input} required />
                    <input type="number" placeholder="Balance" value={portalForm.balance} onChange={(e) => setPortalForm({...portalForm, balance: e.target.value})} style={styles.input} required />
                    <button type="submit" style={styles.btnPrimary}>Add Portal</button>
                  </form>
                </div>
                <div style={styles.card}>
                  <h3 style={{color:'#1E3A8A'}}>Recharge</h3>
                  <form onSubmit={handleRecharge} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select name="portal" style={styles.input} required><option value="">Select Portal</option>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                    <input type="number" name="amt" placeholder="Amount" style={styles.input} required />
                    <input type="date" name="date" defaultValue={today} style={styles.input} required />
                    <select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select>
                    <button type="submit" style={styles.btnPrimary}>Recharge</button>
                  </form>
                </div>
              </div>
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3>Portal Balances</h3>
                  <button onClick={() => exportCSV(data.recharges, 'Portals_Recharges.csv')} style={{...styles.btnPrimary, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)', width: 'auto', padding: '10px 20px'}}>Excel</button>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {data.portals.map(p => <div key={p.id} style={{ flex: 1, minWidth: '120px', background: '#f8fafc', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}><h4>{p.name}</h4><h2 style={{color: p.current_balance < 0 ? 'red' : '#1E3A8A'}}>{p.current_balance || 0}</h2></div>)}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.td}>Date</th><th style={styles.td}>Amount</th><th style={styles.td}>Action</th></tr></thead>
                  <tbody>{data.recharges.map(r => <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{r.recharge_date}</td><td style={styles.td}>{r.amount} SAR</td><td style={styles.td}><button onClick={() => handleDelete('recharges', r.id)} style={{...styles.btnSm, background:'#EF4444'}}>Del</button></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'vendors' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
              <div style={styles.card}>
                <h3 style={{color:'#1E3A8A'}}>Add Vendor</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('vendors', { name: vendorForm.name, phone: vendorForm.phone, balance: parseFloat(vendorForm.balance) || 0 }, setVendorForm, 'Vendor Added!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input placeholder="Name" value={vendorForm.name} onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})} style={styles.input} required />
                  <input placeholder="Phone" value={vendorForm.phone} onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})} style={styles.input} />
                  <button type="submit" style={styles.btnPrimary}>Add Vendor</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3 style={{color:'#1E3A8A', marginBottom:'20px'}}>Vendors List</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.th}>Name</th><th style={styles.th}>Phone</th><th style={styles.th}>Action</th></tr></thead>
                  <tbody>{data.vendors.map(v => <tr key={v.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{v.name}</td><td style={styles.td}>{v.phone}</td><td style={styles.td}><button onClick={() => handleDelete('vendors', v.id)} style={{...styles.btnSm, background:'#EF4444'}}>Del</button></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'packages' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
              <div style={styles.card}>
                <h3 style={{color:'#1E3A8A'}}>Add Package</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('packages', { name: pkgForm.name, price: parseFloat(pkgForm.price), description: pkgForm.desc }, setPkgForm, 'Package Added!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input placeholder="Name" value={pkgForm.name} onChange={(e) => setPkgForm({...pkgForm, name: e.target.value})} style={styles.input} required />
                  <input type="number" placeholder="Price" value={pkgForm.price} onChange={(e) => setPkgForm({...pkgForm, price: e.target.value})} style={styles.input} required />
                  <button type="submit" style={styles.btnPrimary}>Add Package</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3 style={{color:'#1E3A8A', marginBottom:'20px'}}>Packages</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  {data.packages.map(p => <div key={p.id} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}><h4 style={{ margin: '0 0 10px', color: '#1E3A8A' }}>{p.name}</h4><h3 style={{ margin: '10px 0', color: '#059669' }}>{p.price} SAR</h3><button onClick={() => handleDelete('packages', p.id)} style={{...styles.btnSm, background:'#EF4444'}}>Delete</button></div>)}
                </div>
              </div>
            </div>
          )}

          {page === 'branches' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
              <div style={styles.card}>
                <h3 style={{color:'#1E3A8A'}}>Add Branch</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('branches', { name: brnForm.name, location: brnForm.location, phone: brnForm.phone }, setBrnForm, 'Branch Added!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input placeholder="Name" value={brnForm.name} onChange={(e) => setBrnForm({...brnForm, name: e.target.value})} style={styles.input} required />
                  <input placeholder="Location" value={brnForm.location} onChange={(e) => setBrnForm({...brnForm, location: e.target.value})} style={styles.input} required />
                  <button type="submit" style={styles.btnPrimary}>Add Branch</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3 style={{color:'#1E3A8A', marginBottom:'20px'}}>Branches</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.th}>Name</th><th style={styles.th}>Location</th><th style={styles.th}>Action</th></tr></thead>
                  <tbody>{data.branches.map(b => <tr key={b.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{b.name}</td><td style={styles.td}>{b.location}</td><td style={styles.td}><button onClick={() => handleDelete('branches', b.id)} style={{...styles.btnSm, background:'#EF4444'}}>Del</button></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'bank' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.card}>
                  <h3 style={{color:'#1E3A8A'}}>Balances</h3>
                  <p>Cash: <b style={{color:'#D97706'}}>{cashBalance.toFixed(0)} SAR</b></p>
                  <p>Bank: <b style={{color:'#7C3AED'}}>{bankBalance.toFixed(0)} SAR</b></p>
                </div>
                <div style={styles.card}>
                  <h3 style={{color:'#1E3A8A'}}>Fund Transfer</h3>
                  <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select value={transferForm.from} onChange={(e) => setTransferForm({...transferForm, from: e.target.value})} style={styles.input}><option>Cash</option><option>Bank</option><option>Investor</option></select>
                    <select value={transferForm.to} onChange={(e) => setTransferForm({...transferForm, to: e.target.value})} style={styles.input}><option>Bank</option><option>Cash</option><option>Investor</option></select>
                    <input type="number" placeholder="Amount" value={transferForm.amount} onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})} style={styles.input} required />
                    <button type="submit" style={styles.btnPrimary}>Transfer</button>
                  </form>
                </div>
              </div>
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3>Transactions</h3>
                  <button onClick={() => exportCSV(data.cashbook, 'Cashbook.csv')} style={{...styles.btnPrimary, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)', width: 'auto', padding: '10px 20px'}}>Excel</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.td}>Date</th><th style={styles.td}>Type</th><th style={styles.td}>Amount</th><th style={styles.td}>Action</th></tr></thead>
                  <tbody>{data.cashbook.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{c.trans_date}</td><td style={styles.td}>{c.type}</td><td style={styles.td}>{c.amount} SAR</td><td style={styles.td}><button onClick={() => handleDelete('cashbook', c.id)} style={{...styles.btnSm, background:'#EF4444'}}>Del</button></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'invest' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
              <div style={styles.card}>
                <h3 style={{color:'#1E3A8A'}}>Add Investment</h3>
                <form onSubmit={handleAddInvestment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input placeholder="Investor Name" value={investForm.name} onChange={(e) => setInvestForm({...investForm, name: e.target.value})} style={styles.input} required />
                  <input type="number" placeholder="Amount" value={investForm.amount} onChange={(e) => setInvestForm({...investForm, amount: e.target.value})} style={styles.input} required />
                  <button type="submit" style={styles.btnPrimary}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3>History</h3>
                  <button onClick={() => exportCSV(data.investments, 'Investments.csv')} style={{...styles.btnPrimary, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)', width: 'auto', padding: '10px 20px'}}>Excel</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.td}>Date</th><th style={styles.td}>Investor</th><th style={styles.td}>Amount</th><th style={styles.td}>Action</th></tr></thead>
                  <tbody>{data.investments.map(i => <tr key={i.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{i.invest_date}</td><td style={styles.td}>{i.investor_name}</td><td style={styles.td}>{i.amount} SAR</td><td style={styles.td}><button onClick={() => handleDelete('investments', i.id)} style={{...styles.btnSm, background:'#EF4444'}}>Del</button></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'hr' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.card}>
                  <h3 style={{color:'#1E3A8A'}}>Pay Salary</h3>
                  <form onSubmit={handlePaySalary} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select value={payrollForm.emp} onChange={(e) => setPayrollForm({...payrollForm, emp: e.target.value})} style={styles.input} required><option value="">Select Employee</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                    <input type="number" placeholder="Amount" value={payrollForm.amt} onChange={(e) => setPayrollForm({...payrollForm, amt: e.target.value})} style={styles.input} required />
                    <input type="month" value={payrollForm.month} onChange={(e) => setPayrollForm({...payrollForm, month: e.target.value})} style={styles.input} required />
                    <select value={payrollForm.mode} onChange={(e) => setPayrollForm({...payrollForm, mode: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option></select>
                    <button type="submit" style={styles.btnPrimary}>Pay Salary</button>
                  </form>
                </div>
                <div style={styles.card}>
                  <h3 style={{color:'#1E3A8A'}}>Add Employee</h3>
                  <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('employees', { name: empForm.name, role: empForm.role }, setEmpForm, 'Employee Added!'); }} style={{ display: 'flex', gap: '10px' }}>
                    <input placeholder="Name" value={empForm.name} onChange={(e) => setEmpForm({...empForm, name: e.target.value})} style={styles.input} required />
                    <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '0 20px'}}>Add</button>
                  </form>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>Payroll History</h3>
                    <button onClick={() => exportCSV(data.payroll, 'Payroll.csv')} style={{...styles.btnPrimary, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)', width: 'auto', padding: '10px 20px'}}>Excel</button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.td}>Employee</th><th style={styles.td}>Amount</th><th style={styles.td}>Action</th></tr></thead>
                    <tbody>{data.payroll.map(p => <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{p.employees?.name}</td><td style={styles.td}>{p.amount} SAR</td><td style={styles.td}><button onClick={() => handleDelete('payroll', p.id)} style={{...styles.btnSm, background:'#EF4444'}}>Del</button></td></tr>)}</tbody>
                  </table>
                </div>
                <div style={styles.card}>
                  <h3 style={{color:'#1E3A8A'}}>Add Expense</h3>
                  <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input placeholder="Category" value={expenseForm.cat} onChange={(e) => setExpenseForm({...expenseForm, cat: e.target.value})} style={styles.input} required />
                    <input type="number" placeholder="Amount" value={expenseForm.amt} onChange={(e) => setExpenseForm({...expenseForm, amt: e.target.value})} style={styles.input} required />
                    <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '10px 20px'}}>Add</button>
                  </form>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>{data.expenses.map(ex => <tr key={ex.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{ex.category}</td><td style={styles.td}>{ex.amount} SAR</td><td style={styles.td}><button onClick={() => handleDelete('expenses', ex.id)} style={{...styles.btnSm, background:'#EF4444'}}>Del</button></td></tr>)}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {page === 'users' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div style={styles.card}>
                <h3 style={{color: '#1E3A8A', marginBottom:'20px'}}>{tr.ownerProfile}</h3>
                <form onSubmit={handleUpdateOwnerProfile}>
                  <input value={userProfile.username || ''} onChange={(e) => setUserProfile({...userProfile, username: e.target.value})} style={styles.input} placeholder="Username" />
                  <input value={userProfile.email || ''} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} style={styles.input} placeholder="Email" />
                  <button type="submit" style={styles.btnPrimary}>Update Profile</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3 style={{color: '#1E3A8A', marginBottom:'20px'}}>Add System User</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('app_users', userForm, setUserForm, 'User Added!'); }}>
                  <input value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} style={styles.input} placeholder="Username" required />
                  <input type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} style={styles.input} placeholder="Email" required />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <label style={{fontSize:'14px', display:'flex', alignItems:'center', gap:'5px'}}><input type="checkbox" checked={userForm.can_access_invoices} onChange={(e) => setUserForm({...userForm, can_access_invoices: e.target.checked})} /> Invoices</label>
                    <label style={{fontSize:'14px', display:'flex', alignItems:'center', gap:'5px'}}><input type="checkbox" checked={userForm.can_access_bank} onChange={(e) => setUserForm({...userForm, can_access_bank: e.target.checked})} /> Bank</label>
                    <label style={{fontSize:'14px', display:'flex', alignItems:'center', gap:'5px'}}><input type="checkbox" checked={userForm.is_admin} onChange={(e) => setUserForm({...userForm, is_admin: e.target.checked})} /> Admin</label>
                  </div>
                  <button type="submit" style={styles.btnPrimary}>Add User</button>
                </form>
              </div>
              <div style={{...styles.card, gridColumn: 'span 2'}}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.th}>Username</th><th style={styles.th}>Email</th><th style={styles.th}>Action</th></tr></thead>
                  <tbody>{data.appUsers.map(u => <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={styles.td}>{u.username}</td><td style={styles.td}>{u.email}</td><td style={styles.td}><button onClick={() => handleDelete('app_users', u.id)} style={{...styles.btnSm, background:'#EF4444'}}>Delete</button></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'reports' && (
            <div style={styles.card}>
              <h3 style={{color: '#1E3A8A', marginBottom:'20px'}}>Financial Reports</h3>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <input type="date" value={repDate.from} onChange={(e) => setRepDate({...repDate, from: e.target.value})} style={styles.input} />
                <input type="date" value={repDate.to} onChange={(e) => setRepDate({...repDate, to: e.target.value})} style={styles.input} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['sales', 'refunds', 'cashbook', 'investments', 'payroll', 'expenses'].map(tab => (
                  <button key={tab} onClick={() => setReportTab(tab)} style={{...styles.btnPrimary, width:'auto', padding:'8px 15px', background: reportTab === tab ? 'linear-gradient(90deg, #1E3A8A, #2563EB)' : '#ccc', color: reportTab === tab ? '#FBBF24' : '#333'}}>{tab}</button>
                ))}
                <button onClick={() => exportCSV(currentReportData(), `${reportTab}_report.csv`)} style={{...styles.btnPrimary, width:'auto', padding:'8px 15px', background: 'linear-gradient(90deg, #7C3AED, #A78BFA)'}}>Export Excel</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}>{currentReportData().length > 0 && Object.keys(currentReportData()[0]).filter(k => k !== 'id').map(k => <th key={k} style={styles.td}>{k}</th>)}</tr></thead>
                <tbody>
                  {currentReportData().map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      {Object.entries(row).filter(([k]) => k !== 'id').map(([k, val]) => <td key={k} style={styles.td}>{typeof val === 'object' ? val?.name || '' : String(val)}</td>)}
                    </tr>
                  ))}
                  {currentReportData().length === 0 && <tr><td style={styles.td} colSpan="10">No data in selected range.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {page === 'audit' && (
            <div style={styles.card}>
              <h3 style={{color: '#1E3A8A'}}>Audit Logs</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#1E3A8A', color: '#FBBF24' }}><th style={styles.th}>Date</th><th style={styles.th}>User</th><th style={styles.th}>Action</th><th style={styles.th}>Delete</th></tr></thead>
                <tbody>
                  {data.audits.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={styles.td}>{new Date(a.created_at).toLocaleString()}</td><td style={styles.td}>{a.user_email}</td><td style={styles.td}>{a.action}</td>
                      <td style={styles.td}><button onClick={() => handleDelete('audit_logs', a.id)} style={{...styles.btnSm, background:'#EF4444'}}>Del</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div style={styles.card}>
                <h3 style={{color: '#1E3A8A', marginBottom:'20px'}}>Company Settings</h3>
                <form onSubmit={async (e) => { e.preventDefault(); await supabase.from('settings').upsert([{ id: 1, ...setForm }]); showToast('Settings Saved!'); }}>
                  <label style={styles.label}>Upload Logo</label>
                  <input type="file" accept="image/*" onChange={async (e) => { const file = e.target.files[0]; if (!file) return; const fn = `logo-${Date.now()}.${file.name.split('.').pop()}`; await supabase.storage.from('logos').upload(fn, file); const { data: url } = supabase.storage.from('logos').getPublicUrl(fn); setSetForm(p => ({...p, logo_url: url.publicUrl})); }} style={{...styles.input, padding:'5px', marginBottom:'10px'}} />
                  {setForm.logo_url && <img src={setForm.logo_url} style={{height: '80px', marginBottom:'10px'}} />}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input value={setForm.company_name_en || ''} onChange={(e) => setSetForm({...setForm, company_name_en: e.target.value})} style={styles.input} placeholder="Name (EN) for Invoice" />
                    <input value={setForm.company_name_ar || ''} onChange={(e) => setSetForm({...setForm, company_name_ar: e.target.value})} style={styles.input} placeholder="Name (AR) for Invoice" />
                  </div>
                  <button type="submit" style={styles.btnPrimary}>Save Settings</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3 style={{color: '#1E3A8A'}}>Add Service</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('services', { name: srvForm.name }, setSrvForm, 'Service Added!'); }} style={{ display: 'flex', gap: '10px' }}>
                  <input placeholder="Service Name" value={srvForm.name} onChange={(e) => setSrvForm({...srvForm, name: e.target.value})} style={styles.input} required />
                  <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '0 20px'}}>Add</button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

const styles = {
  card: { background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '20px' },
  th: { padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' },
  td: { padding: '15px', fontSize: '14px' },
  label: { fontSize: '12px', color: '#555', marginBottom: '5px', display: 'block' },
  input: { width: '100%', padding: '14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', marginBottom: '15px' },
  btnPrimary: { width: '100%', padding: '15px', background: 'linear-gradient(90deg, #1E3A8A, #2563EB)', color: '#FBBF24', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' },
  btnSm: { color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }
};
