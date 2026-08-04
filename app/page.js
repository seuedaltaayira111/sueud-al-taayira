'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({ email: '', username: '', role: 'Owner', is_admin: true, can_access_invoices: true, can_access_bank: true, can_access_hr: true, can_access_reports: true, can_access_settings: true });
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });
  const [chatOpen, setChatOpen] = useState(false);
  const [passForm, setPassForm] = useState({ newPass: '' });

  const [search, setSearch] = useState('');
  const [tblPage, setTblPage] = useState(1);
  const itemsPerPage = 10;

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], recharges: [], settings: {}, employees: [], payroll: [], appUsers: [], expenses: [], services: [], cashbook: [], audits: [], investments: [], vendors: [], customFields: [] });
  const today = new Date().toISOString().split('T')[0];
  
  // Forms State
  const [invForm, setInvForm] = useState({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', passengerNames: '', employeeId: '', portal: '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', flightSub: 'New Booking', flightJourney: 'Single', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed' });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, desc: '', mode: 'Cash' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash', tabbyNo: '', tamaraNo: '' });
  const [refundForm, setRefundForm] = useState({ id: '', compRefund: 0, custRefund: 0, mode: 'Cash' });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: '', date: today });
  const [repDate, setRepDate] = useState({ from: '', to: '' });
  const [reportTab, setReportTab] = useState('sales');
  const [setForm, setSetForm] = useState({ company_name_en: '', company_name_ar: '', vat_no: '', cr_no: '', iata_no: '', license_no: '', phone: '', logo_url: '', invoice_footer: 'Thank you for your business!' });
  const [userForm, setUserForm] = useState({ email: '', username: '', role: 'Sales' });
  const [empForm, setEmpForm] = useState({ name: '', role: 'Sales' });
  const [srvForm, setSrvForm] = useState({ name: '' });
  const [portalForm, setPortalForm] = useState({ name: '', balance: 0 });
  const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [customFieldForm, setCustomFieldForm] = useState({ name: '' });

  // Translations
  const t = {
    en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices List', refunds: 'Refund Invoices', customers: 'Customer List', portals: 'Portals & Recharge', bank: 'Bank & Cash', invest: 'Investments', hr: 'HR & Accounts', users: 'User Management', reports: 'Financial Reports', audit: 'Audit Logs', settings: 'Settings & Templates', vendors: 'Vendors (B2B)', logout: 'Logout', search: 'Search...', ownerProfile: 'Owner Profile', username: 'Username', role: 'Role', addCustomField: 'Add Custom Invoice Field', changePass: 'Change Password', chatHelp: 'AI Help Assistant' },
    ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'قائمة الفواتير', refunds: 'فواتير الاسترجاع', customers: 'قائمة العملاء', portals: 'البوابات والرصيد', bank: 'البنك والكاش', invest: 'الاستثمارات', hr: 'الموارد البشرية', users: 'إدارة المستخدمين', reports: 'التقارير المالية', audit: 'سجلات التدقيق', settings: 'الإعدادات والقوالب', vendors: 'الموردون', logout: 'تسجيل الخروج', search: 'بحث...', ownerProfile: 'ملف المالك', username: 'اسم المستخدم', role: 'الدور', addCustomField: 'إضافة حقل مخصص للفاتورة', changePass: 'تغيير كلمة المرور', chatHelp: 'مساعد الذكاء الاصطناعي' }
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
    
    const portalsData = por.data || [];
    const servicesData = srv.data || [];
    const settingsData = set.data || {};
    setData({ invoices: inv.data || [], portals: portalsData, customers: cus.data || [], recharges: rec.data || [], settings: settingsData, employees: emp.data || [], payroll: pay.data || [], appUsers: usr.data || [], expenses: exp.data || [], services: servicesData, cashbook: cbk.data || [], audits: aud.data || [], investments: invstmnt.data || [], vendors: vnd.data || [], customFields: cf.data || [] });
    
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
    const { error } = await supabase.from('app_users').update({ email: userProfile.email, username: userProfile.username }).eq('id', userProfile.id);
    if (error) return showToast('Error updating profile');
    showToast('Owner Profile Updated!');
  };

  // --- INVOICE HANDLERS ---
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const qty = parseInt(invForm.qty) || 1;
      const cost = (parseFloat(invForm.cost) || 0) * qty;
      let sell = (parseFloat(invForm.sell) || 0) * qty;
      const discount = parseFloat(invForm.discount) || 0;
      sell = sell - discount;
      const taxRate = parseFloat(invForm.taxRate) || 0;
      const vat = sell * (taxRate / 100);
      const total = sell + vat;
      const paid = parseFloat(invForm.paid) || 0;
      const due = total - paid;
      const profit = sell - cost;

      let cid;
      if (invForm.custId === 'new') {
        const { data: nC } = await supabase.from('customers').insert([{ name: invForm.custName, phone: invForm.custPhone, type: invForm.custType }]).select().single();
        cid = nC.id;
      } else { cid = invForm.custId; }

      const portal = data.portals.find(p => p.name === invForm.portal);
      if (!portal) throw new Error("Select Portal");

      let desc = '';
      if (invForm.service === 'Flight') desc = `${invForm.flightSub} (${invForm.flightType}) - ${invForm.airline} - ${invForm.flightJourney} - ${invForm.flightSector}`;
      else if (invForm.service === 'Hotel') desc = `${invForm.hotelName} - ${invForm.destination} (${invForm.checkIn} to ${invForm.checkOut})`;
      else if (invForm.service === 'Visa') desc = `${invForm.visaType} Visa - ${invForm.destination}`;
      else desc = invForm.service;

      const payload = {
        customer_id: cid, portal_id: portal.id, employee_id: invForm.employeeId || null,
        booking_date: invForm.bookingDate, invoice_date: invForm.invoiceDate,
        service_type: invForm.service, flight_type: invForm.flightType, flight_sub: invForm.flightSub, pnr: invForm.pnr, ticket_no: invForm.ticketNo, sector: desc, qty: qty, discount: discount,
        passenger_names: invForm.passengerNames || null, airline: invForm.airline || null, flight_journey: invForm.flightJourney || null, flight_sector: invForm.flightSector || null,
        total_cost: cost, total_sell: sell, profit, vat, total, paid_amount: paid, due_amount: due, payment_method: invForm.payment,
        credit_due_date: due > 0 ? invForm.creditDueDate : null, tabby_order_no: invForm.payment === 'Tabby' ? invForm.tabbyNo : null, tamara_order_no: invForm.payment === 'Tamara' ? invForm.tamaraNo : null, ticket_status: invForm.ticketStatus
      };

      if (editingId) {
        const { data: upInv } = await supabase.from('invoices').update(payload).eq('id', editingId).select(`*, customers(name, type, phone), portals(name), employees(name)`).single();
        setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === editingId ? upInv : i) }));
        await logAction(`Updated Invoice ID ${editingId}`);
        setEditingId(null);
        showToast('Invoice Updated Successfully!');
      } else {
        const invNo = `INV-${Date.now()}`;
        const { data: newInv } = await supabase.from('invoices').insert([{ invoice_no: invNo, ...payload }]).select(`*, customers(name, type, phone), portals(name), employees(name)`).single();
        
        const newPortalBal = (portal.current_balance || 0) - cost;
        await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', portal.id);
        await logAction(`Created Invoice ${invNo}`);

        let newCashEntry = null;
        if (paid > 0) {
          const cbType = invForm.payment === 'Cash' ? 'Cash-In' : (invForm.payment === 'Bank Transfer' ? 'Bank-In' : null);
          if (cbType) {
            const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: invForm.invoiceDate, type: cbType, description: `Payment for ${invNo}`, amount: paid }]).select().single();
            newCashEntry = nC;
          }
        }

        setData(prev => ({
          ...prev,
          invoices: [newInv, ...prev.invoices],
          portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: newPortalBal } : p),
          cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook
        }));
        showToast('Invoice Generated Successfully!');
      }
      setInvForm({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', passengerNames: '', employeeId: '', portal: data.portals[0]?.name || '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', flightSub: 'New Booking', flightJourney: 'Single', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed' });
      setPage('list');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleEditClick = (inv) => {
    setEditingId(inv.id);
    setInvForm({
      custId: inv.customer_id, custName: '', custPhone: '', custType: inv.customers?.type || 'Individual', passengerNames: inv.passenger_names || '',
      employeeId: inv.employee_id || '', portal: inv.portals?.name || '', bookingDate: inv.booking_date || today, invoiceDate: inv.invoice_date || today,
      service: inv.service_type, flightType: inv.flight_type || 'Domestic', flightSub: inv.flight_sub || 'New Booking', flightJourney: inv.flight_journey || 'Single', flightSector: inv.flight_sector || '', airline: inv.airline || '', 
      destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', pnr: inv.pnr || '', ticketNo: inv.ticket_no || '', qty: inv.qty || 1, cost: inv.total_cost || 0, sell: inv.total_sell || 0, discount: inv.discount || 0, taxRate: inv.vat > 0 ? '15' : '0', 
      payment: inv.payment_method || 'Cash', paid: inv.paid_amount || 0, creditDueDate: inv.credit_due_date || '', tabbyNo: inv.tabby_order_no || '', tamaraNo: inv.tamara_order_no || '', ticketStatus: inv.ticket_status || 'Confirmed'
    });
    setPage('create');
  };

  const handleSettlePayment = async (e) => {
    e.preventDefault();
    const inv = data.invoices.find(i => i.id === settleForm.id);
    if (!inv) return showToast('Not found');
    const newPaid = inv.paid_amount + inv.due_amount;
    
    const { data: upInv } = await supabase.from('invoices').update({ 
      paid_amount: newPaid, due_amount: 0, settlement_date: settleForm.date, payment_method: settleForm.mode,
      tabby_order_no: settleForm.mode === 'Tabby' ? settleForm.tabbyNo : null, tamara_order_no: settleForm.mode === 'Tamara' ? settleForm.tamaraNo : null
    }).eq('id', inv.id).select(`*, customers(name, type, phone), portals(name), employees(name)`).single();
    
    let newCashEntry = null;
    const cbType = settleForm.mode === 'Cash' ? 'Cash-In' : (settleForm.mode === 'Bank Transfer' ? 'Bank-In' : null);
    if (cbType) {
      const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: settleForm.date, type: cbType, description: `Settlement for ${inv.invoice_no}`, amount: inv.due_amount }]).select().single();
      newCashEntry = nC;
    }
    await logAction(`Settled payment for ${inv.invoice_no}`);

    setData(prev => ({
      ...prev,
      invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i),
      cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook
    }));
    showToast('Payment Settled Successfully!');
    setModal({ type: null, data: null });
  };

  const handleRefund = async (e) => {
    e.preventDefault();
    const inv = data.invoices.find(i => i.id === refundForm.id);
    if (!inv) return showToast('Not found');
    const compRef = parseFloat(refundForm.compRefund) || 0;
    const custRef = parseFloat(refundForm.custRefund) || 0;

    const { data: upInv } = await supabase.from('invoices').update({ status: 'refunded', refund_company: compRef, refund_customer: custRef }).eq('id', inv.id).select(`*, customers(name, type, phone), portals(name), employees(name)`).single();
    const refNo = `REF-${Date.now()}`;
    const { data: newRefInv } = await supabase.from('invoices').insert([{
      invoice_no: refNo, customer_id: inv.customer_id, portal_id: inv.portal_id, booking_date: today, invoice_date: today,
      service_type: `Refund for ${inv.invoice_no}`, total_sell: -custRef, total: -custRef, paid_amount: -custRef, status: 'refunded', refund_company: compRef, refund_customer: custRef
    }]).select(`*, customers(name, type, phone), portals(name), employees(name)`).single();

    let newPortalBal = inv.portals?.current_balance || 0;
    if (inv.portal_id) {
      newPortalBal += compRef;
      await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', inv.portal_id);
    }

    let newCashEntry = null;
    if (custRef > 0) {
      const cbType = refundForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
      const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Refund to customer for ${inv.invoice_no}`, amount: custRef }]).select().single();
      newCashEntry = nC;
    }
    await logAction(`Processed refund ${refNo}`);

    setData(prev => ({
      ...prev,
      invoices: [newRefInv, prev.invoices.map(i => i.id === inv.id ? upInv : i)].flat(),
      portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: newPortalBal } : p),
      cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook
    }));
    showToast('Refund Processed! Portal balance updated.');
    setModal({ type: null, data: null });
  };

  // --- PORTALS & VENDORS ---
  const handleAddPortal = async (e) => {
    e.preventDefault();
    const { data: newItem } = await supabase.from('portals').insert([{ name: portalForm.name, current_balance: parseFloat(portalForm.balance) || 0 }]).select().single();
    setData(prev => ({ ...prev, portals: [...prev.portals, newItem] }));
    showToast('Portal Added!');
    setPortalForm({ name: '', balance: 0 });
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    const { data: newItem } = await supabase.from('vendors').insert([{ name: vendorForm.name, phone: vendorForm.phone, balance: parseFloat(vendorForm.balance) || 0 }]).select().single();
    setData(prev => ({ ...prev, vendors: [...prev.vendors, newItem] }));
    showToast('Vendor Added!');
    setVendorForm({ name: '', phone: '', balance: 0 });
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
    await logAction(`Recharged ${amount} to ${p.name}`);
    setData(prev => ({ ...prev, recharges: [newRec, ...prev.recharges], portals: prev.portals.map(por => por.id === p.id ? { ...por, current_balance: newBal } : por), cashbook: [nC, ...prev.cashbook] }));
    showToast('Recharged! Balance Updated.');
    e.target.reset();
  };

  const handleDeleteRecharge = async (rec) => {
    if (!confirm('Delete recharge? Balance will reduce.')) return;
    await supabase.from('recharges').delete().eq('id', rec.id);
    const p = data.portals.find(p => p.id === rec.portal_id);
    const newBal = (p.current_balance || 0) - rec.amount;
    await supabase.from('portals').update({ current_balance: newBal }).eq('id', p.id);
    setData(prev => ({ ...prev, recharges: prev.recharges.filter(r => r.id !== rec.id), portals: prev.portals.map(por => por.id === rec.portal_id ? { ...por, current_balance: newBal } : por) }));
    showToast('Recharge Deleted!');
  };

  // --- BANK & FUND TRANSFER ---
  const handleTransfer = async (e) => {
    e.preventDefault();
    const amt = parseFloat(transferForm.amount);
    if (amt <= 0 || transferForm.from === transferForm.to) return showToast("Invalid transfer");
    
    const entries = [];
    if (transferForm.from === 'Cash') entries.push({ trans_date: transferForm.date, type: 'Cash-Out', description: `Transfer to ${transferForm.to}`, amount: amt });
    if (transferForm.from === 'Bank') entries.push({ trans_date: transferForm.date, type: 'Bank-Out', description: `Transfer to ${transferForm.to}`, amount: amt });
    if (transferForm.from === 'Investor') entries.push({ trans_date: transferForm.date, type: 'Investment-In', description: `Capital from Investor to ${transferForm.to}`, amount: amt });
    
    if (transferForm.to === 'Cash') entries.push({ trans_date: transferForm.date, type: 'Cash-In', description: `Transfer from ${transferForm.from}`, amount: amt });
    if (transferForm.to === 'Bank') entries.push({ trans_date: transferForm.date, type: 'Bank-In', description: `Transfer from ${transferForm.from}`, amount: amt });
    if (transferForm.to === 'Investor') entries.push({ trans_date: transferForm.date, type: 'Investment-Out', description: `Withdrawal to Investor from ${transferForm.from}`, amount: amt });

    const results = await Promise.all(entries.map(en => supabase.from('cashbook').insert([en]).select().single()));
    const newEntries = results.map(r => r.data).filter(Boolean);
    await logAction(`Transferred ${amt} from ${transferForm.from} to ${transferForm.to}`);
    setData(prev => ({ ...prev, cashbook: [...newEntries, ...prev.cashbook] }));
    showToast('Fund Transferred Successfully!');
    setTransferForm({ from: 'Cash', to: 'Bank', amount: '', date: today });
  };

  // --- HR & SETTINGS ---
  const handlePaySalary = async (e) => {
    e.preventDefault();
    const empId = e.target.emp.value;
    const amount = parseFloat(e.target.amt.value);
    const mode = e.target.mode.value;
    const emp = data.employees.find(em => em.id === empId);
    const { data: newPay } = await supabase.from('payroll').insert([{ employee_id: empId, amount, month: e.target.month.value, payment_mode: mode }]).select('*, employees(name)').single();
    const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Salary to ${emp.name}`, amount }]).select().single();
    setData(prev => ({ ...prev, payroll: [newPay, ...prev.payroll], cashbook: [nC, ...prev.cashbook] }));
    showToast('Salary Paid!');
    e.target.reset();
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const mode = e.target.mode.value;
    const { data: newExp } = await supabase.from('expenses').insert([{ category: e.target.cat.value, amount: parseFloat(e.target.amt.value), description: e.target.desc.value, payment_mode: mode }]).select().single();
    const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Expense: ${e.target.cat.value}`, amount: parseFloat(e.target.amt.value) }]).select().single();
    setData(prev => ({ ...prev, expenses: [newExp, ...prev.expenses], cashbook: [nC, ...prev.cashbook] }));
    showToast('Expense Added!');
    e.target.reset();
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    const mode = investForm.mode;
    const { data: newInv } = await supabase.from('investments').insert([{ investor_name: investForm.name, amount: parseFloat(investForm.amount), invest_date: investForm.date, description: investForm.desc, payment_mode: mode }]).select().single();
    const cbType = mode === 'Cash' ? 'Cash-In' : 'Bank-In';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: investForm.date, type: cbType, description: `Investment by ${investForm.name}`, amount: parseFloat(investForm.amount) }]).select().single();
    await logAction(`Added investment from ${investForm.name}`);
    setData(prev => ({ ...prev, investments: [newInv, ...prev.investments], cashbook: [nC, ...prev.cashbook] }));
    showToast('Investment Added!');
    setInvestForm({ name: '', amount: '', date: today, desc: '', mode: 'Cash' });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('logos').upload(fileName, file);
    if (error) return showToast('Upload Error: Check Storage Bucket');
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
    setSetForm(prev => ({ ...prev, logo_url: urlData.publicUrl }));
    showToast('Logo Uploaded! Click Save Settings.');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('settings').upsert([{ id: 1, ...setForm }]).eq('id', 1);
    if (error) return showToast('Error saving settings');
    setData(prev => ({ ...prev, settings: setForm }));
    showToast('Settings Saved Successfully!');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const role = userForm.role;
    const perms = { is_admin: role === 'Owner', can_access_invoices: ['Owner', 'Manager', 'Sales'].includes(role), can_access_bank: ['Owner', 'Accountant'].includes(role), can_access_hr: ['Owner', 'Accountant'].includes(role), can_access_reports: ['Owner', 'Accountant'].includes(role), can_access_settings: role === 'Owner' };
    const { data: newUser } = await supabase.from('app_users').insert([{ email: userForm.email, username: userForm.username, role, ...perms }]).select().single();
    setData(prev => ({ ...prev, appUsers: [newUser, ...prev.appUsers] }));
    showToast('User Added with Permissions!');
    setUserForm({ email: '', username: '', role: 'Sales' });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const { data: newItem } = await supabase.from('employees').insert([{ name: empForm.name, role: empForm.role }]).select().single();
    setData(prev => ({ ...prev, employees: [newItem, ...prev.employees] }));
    showToast('Employee Added!');
    setEmpForm({ name: '', role: 'Sales' });
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    const { data: newItem } = await supabase.from('services').insert([{ name: srvForm.name }]).select().single();
    setData(prev => ({ ...prev, services: [newItem, ...prev.services] }));
    showToast('Service Added!');
    setSrvForm({ name: '' });
  };

  const handleAddCustomField = async (e) => {
    e.preventDefault();
    const { data: newItem } = await supabase.from('custom_fields').insert([{ name: customFieldForm.name }]).select().single();
    setData(prev => ({ ...prev, customFields: [...prev.customFields, newItem] }));
    showToast('Custom Field Added!');
    setCustomFieldForm({ name: '' });
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Delete permanently?')) return;
    await supabase.from(table).delete().eq('id', id);
    setData(prev => ({ ...prev, [table]: prev[table].filter(item => item.id !== id) }));
    showToast('Deleted Successfully!');
  };

  // --- REPORTS & EXPORT ---
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

  // --- BEAUTIFUL INVOICE HTML ---
  const getInvoiceHTML = (inv, s) => {
    const isExempt = inv.vat === 0;
    const taxLabel = isExempt ? 'Exempt (معافاة)' : 'VAT 15% (ضريبة 15%)';
    return `
      <div style="width:800px;padding:40px;font-family:'Segoe UI',Tahoma,Arial;background:#fff;color:#333;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0F3D2E;padding-bottom:20px;margin-bottom:30px;">
          <div style="display:flex;align-items:center;gap:20px;">
            ${s.logo_url ? `<img src="${s.logo_url}" crossorigin="anonymous" style="height:140px;width:auto;object-fit:contain;" />` : ''}
            <div>
              <h1 style="margin:0;color:#0F3D2E;font-size:32px;font-weight:bold;">${s.company_name_en || 'Sueud Al Taayira'}</h1>
              <h2 style="margin:0;color:#D4AF37;font-size:24px;">${s.company_name_ar || 'صعود الطائرة'}</h2>
              <p style="font-size:12px;margin-top:10px;line-height:1.6;color:#555;">VAT: ${s.vat_no || ''} | CR: ${s.cr_no || ''}<br/>IATA: ${s.iata_no || ''} | Ph: ${s.phone || ''}</p>
            </div>
          </div>
          <div style="text-align:right;background:#0F3D2E;color:#fff;padding:15px 20px;border-radius:8px;">
            <h1 style="margin:0;font-size:24px;">TAX INVOICE</h1>
            <h2 style="margin:0;color:#D4AF37;font-size:18px;">فاتورة ضريبية</h2>
            <p style="font-size:13px;margin-top:10px;color:#eee;">Inv No: <b>${inv.invoice_no}</b><br/>Date: ${inv.invoice_date}</p>
          </div>
        </div>
        <div style="margin-bottom:30px;display:flex;justify-content:space-between;background:#f9f9f9;padding:15px;border-radius:8px;border-left:5px solid #D4AF37;">
          <div><h3 style="margin:0 0 5px;color:#0F3D2E;font-size:14px;">BILL TO:</h3><p style="margin:0;font-size:16px;font-weight:bold;">${inv.customers?.name || ''}</p><p style="margin:0;font-size:12px;color:#666;">${inv.customers?.phone || ''}</p></div>
          <div style="text-align:right;"><p style="margin:0;font-size:12px;"><b>Sales Rep:</b> ${inv.employees?.name || 'N/A'}</p><p style="margin:0;font-size:12px;"><b>Status:</b> <span style="color:${inv.due_amount>0?'#e74c3c':'#27ae60'};font-weight:bold;">${inv.due_amount>0?'UNPAID':'PAID'}</span></p></div>
        </div>
        ${inv.passenger_names ? `<div style="margin-bottom:20px;padding:10px;background:#fff;border:1px dashed #ddd;"><b style="font-size:12px;">Passengers:</b><br/><span style="font-size:12px;white-space:pre-wrap;">${inv.passenger_names}</span></div>` : ''}
        <table style="width:100%;border-collapse:collapse;text-align:center;margin-bottom:30px;">
          <thead><tr style="background:#0F3D2E;color:#fff;"><th style="padding:12px;border:1px solid #0a2d21;width:40%;">Service / Sector</th><th style="padding:12px;border:1px solid #0a2d21;">PNR</th><th style="padding:12px;border:1px solid #0a2d21;">Qty</th><th style="padding:12px;border:1px solid #0a2d21;">Total</th></tr></thead>
          <tbody><tr style="background:#fff;"><td style="padding:12px;border:1px solid #ddd;text-align:left;font-size:13px;"><b>${inv.service_type}</b><br/><span style="font-size:11px;color:#666;">${inv.sector || ''}</span></td><td style="padding:12px;border:1px solid #ddd;font-size:12px;">${inv.pnr || 'N/A'}</td><td style="padding:12px;border:1px solid #ddd;font-size:12px;">${inv.qty || 1}</td><td style="padding:12px;border:1px solid #ddd;font-size:14px;font-weight:bold;">${inv.total_sell.toFixed(2)} SAR</td></tr></tbody>
        </table>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="text-align:center;background:#f9f9f9;padding:10px;border-radius:8px;border:1px solid #eee;"><p style="margin:0 0 5px;font-size:10px;color:#666;">Scan for ZATCA Verification</p><img src="${inv.qrCode || ''}" width="120" height="120" /></div>
          <div style="width:320px;font-size:14px;">
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;"><span>Before VAT:</span><b>${inv.total_sell.toFixed(2)} SAR</b></div>
            ${inv.discount > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;color:#e74c3c;"><span>Discount:</span><b>- ${inv.discount.toFixed(2)} SAR</b></div>` : ''}
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;"><span>${taxLabel}:</span><b>${inv.vat.toFixed(2)} SAR</b></div>
            <div style="display:flex;justify-content:space-between;background:#0F3D2E;color:#D4AF37;padding:12px;font-weight:bold;font-size:18px;border-radius:4px;margin-top:5px;"><span>TOTAL:</span><b>${inv.total.toFixed(2)} SAR</b></div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;color:#27ae60;margin-top:10px;"><span>Paid (${inv.payment_method}):</span><b>${inv.paid_amount.toFixed(2)} SAR</b></div>
            <div style="display:flex;justify-content:space-between;padding:12px 0;color:#e74c3c;font-weight:bold;font-size:16px;"><span>BALANCE DUE:</span><b>${inv.due_amount.toFixed(2)} SAR</b></div>
          </div>
        </div>
        <div style="margin-top:50px;border-top:2px solid #D4AF37;padding-top:15px;text-align:center;"><p style="margin:0;font-size:12px;color:#666;">${s.invoice_footer || 'Thank you for your business!'}</p></div>
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
  const outstandingInv = activeInv.filter(i => i.due_amount > 0);
  
  const cashBalance = data.cashbook.filter(c => c.type === 'Cash-In').reduce((s,c) => s + c.amount, 0) - data.cashbook.filter(c => c.type === 'Cash-Out').reduce((s,c) => s + c.amount, 0);
  const bankBalance = data.cashbook.filter(c => c.type === 'Bank-In').reduce((s,c) => s + c.amount, 0) - data.cashbook.filter(c => c.type === 'Bank-Out').reduce((s,c) => s + c.amount, 0);

  const tSales = activeInv.reduce((s,i) => s + i.total, 0);
  const tProfit = activeInv.reduce((s,i) => s + i.profit, 0);
  const tExp = data.expenses.reduce((s,e) => s + e.amount, 0);
  const tSal = data.payroll.reduce((s,p) => s + p.amount, 0);
  const netProfit = tProfit - tExp - tSal;
  const totalOutstanding = outstandingInv.reduce((s,i) => s + i.due_amount, 0);
  const tInvestments = data.investments.reduce((s,i) => s + i.amount, 0);

  const filteredInvoices = activeInv.filter(inv => inv.invoice_no.toLowerCase().includes(search.toLowerCase()) || inv.customers?.name.toLowerCase().includes(search.toLowerCase()) || inv.customers?.phone.includes(search));
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
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#F5F7F2', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#0F3D2E', color: '#D4AF37', padding: '15px 25px', borderRadius: '8px', zIndex: 9999, boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontWeight: 'bold' }}>{toast}</div>
      )}

      {/* Chatbot UI */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>
        {chatOpen && (
          <div style={{ width: '300px', height: '400px', background: 'white', borderRadius: '12px', marginBottom: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ background: '#0F3D2E', color: '#D4AF37', padding: '15px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>{tr.chatHelp}<button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer' }}>✖</button></div>
            <div style={{ flex: 1, padding: '15px', fontSize: '13px', overflowY: 'auto', background: '#f9f9f9' }}>
              <p style={{ background: '#e8e8e8', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>Hello {userProfile.role}! How can I help you today?</p>
            </div>
            <div style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex' }}>
              <input placeholder="Ask anything..." style={{ flex: 1, border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }} />
              <button style={{ background: '#0F3D2E', color: '#D4AF37', border: 'none', padding: '0 15px', cursor: 'pointer', marginLeft: '5px' }}>Send</button>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#D4AF37', color: '#0F3D2E', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>💬</button>
      </div>

      {modal.type && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setModal({type: null, data: null})}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', width: '100%', maxWidth: '850px', maxHeight: '95vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '2px solid #D4AF37', paddingBottom: '10px' }}>
              <h2 style={{ color: '#0F3D2E', margin: 0 }}>
                {modal.type === 'settle' && 'Settle Credit Payment'}
                {modal.type === 'refund' && 'Process Refund'}
                {modal.type === 'preview' && 'Invoice Preview'}
                {modal.type === 'ledger' && 'Customer Ledger'}
                {modal.type === 'password' && tr.changePass}
              </h2>
              <button onClick={() => setModal({type: null, data: null})} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#e74c3c' }}>✖</button>
            </div>

            {modal.type === 'password' && (
              <form onSubmit={handleChangePassword}>
                <p>Enter a new password for your account.</p>
                <input type="password" placeholder="New Password" value={passForm.newPass} onChange={(e) => setPassForm({ newPass: e.target.value })} required style={styles.i} />
                <button type="submit" style={{...styles.btnPrimary, marginTop: '15px'}}>Update Password</button>
              </form>
            )}

            {modal.type === 'settle' && (
              <form onSubmit={handleSettlePayment}>
                <p><b>Invoice:</b> {modal.data.invoice_no} | <b>Due:</b> {modal.data.due_amount} SAR</p>
                <input type="hidden" value={modal.data.id} onChange={(e) => setSettleForm({...settleForm, id: e.target.value})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <input type="date" value={settleForm.date} onChange={(e) => setSettleForm({...settleForm, date: e.target.value})} required style={styles.i} />
                  <select value={settleForm.mode} onChange={(e) => setSettleForm({...settleForm, mode: e.target.value})} style={styles.i}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option></select>
                </div>
                <button type="submit" style={{...styles.btnPrimary, background: '#27ae60'}}>Confirm Settlement</button>
              </form>
            )}

            {modal.type === 'refund' && (
              <form onSubmit={handleRefund}>
                <p style={{fontSize:'12px', color:'#666'}}>Company refund auto-adds to Portal. Customer refund deducts from Cash/Bank.</p>
                <input type="hidden" value={modal.data.id} onChange={(e) => setRefundForm({...refundForm, id: e.target.value})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <input type="number" placeholder="Company Refund Amount" onChange={(e) => setRefundForm({...refundForm, compRefund: e.target.value})} required style={styles.i} />
                  <input type="number" placeholder="Customer Refund Amount" onChange={(e) => setRefundForm({...refundForm, custRefund: e.target.value})} required style={styles.i} />
                  <select value={refundForm.mode} onChange={(e) => setRefundForm({...refundForm, mode: e.target.value})} style={styles.i}><option value="Cash">Pay Cust via Cash</option><option value="Bank Transfer">Pay Cust via Bank</option></select>
                </div>
                <button type="submit" style={{...styles.btnPrimary, background: '#e67e22'}}>Confirm Refund</button>
              </form>
            )}

            {modal.type === 'preview' && (
              <div>
                <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' }} dangerouslySetInnerHTML={{ __html: getInvoiceHTML(modal.data, data.settings) }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => downloadPDF(modal.data)} style={{ flex: 1, background: '#0F3D2E', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Download PDF</button>
                  <a href={`https://wa.me/${modal.data.customers?.phone || ''}?text=Dear%20${modal.data.customers?.name || ''},%20your%20invoice%20${modal.data.invoice_no}%20of%20${modal.data.total}%20SAR%20is%20ready.`} target="_blank" style={{ flex: 1, background: '#25D366', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold' }}>Send WhatsApp</a>
                </div>
              </div>
            )}

            {modal.type === 'ledger' && (
              <div>
                <h3>{modal.data.name} - {modal.data.phone}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                  <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.td}>Date</th><th style={styles.td}>Inv No</th><th style={styles.td}>Total</th><th style={styles.td}>Paid</th><th style={styles.td}>Due</th></tr></thead>
                  <tbody>
                    {data.invoices.filter(inv => inv.customer_id === modal.data.id).map(inv => (
                      <tr key={inv.id}><td style={styles.td}>{inv.invoice_date}</td><td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.total}</td><td style={{...styles.td, color:'#27ae60'}}>{inv.paid_amount}</td><td style={{...styles.td, color:'#e74c3c'}}>{inv.due_amount}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <aside style={{ width: '260px', backgroundColor: '#0F3D2E', color: '#D4AF37', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '2px solid #D4AF37' }}>
          {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'50px', marginBottom:'10px'}} />}
          <h2 style={{ margin: 0 }}>{lang === 'en' ? 'Sueud Al Taayira' : 'صعود الطائرة'}</h2>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {menu.map(m => (
            <button key={m.id} onClick={() => { setPage(m.id); setEditingId(null); }} style={{ width: '100%', textAlign: 'left', padding: '15px 20px', background: page === m.id ? '#D4AF37' : 'none', border: 'none', color: page === m.id ? '#0F3D2E' : '#D4AF37', cursor: 'pointer', fontWeight: 'bold' }}>{m.label}</button>
          ))}
        </nav>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ width: '100%', padding: '10px', background: '#145A38', color: '#D4AF37', border: '1px solid #D4AF37', cursor: 'pointer', marginBottom: '10px' }}>{lang === 'en' ? 'العربية' : 'English'}</button>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#8B0000', color: '#FFF', border: 'none', cursor: 'pointer' }}>{tr.logout}</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ background: 'white', padding: '15px 30px', borderBottom: '2px solid #D4AF37', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ margin: 0, color: '#0F3D2E' }}>{editingId && page === 'create' ? 'Edit Invoice' : menu.find(m=>m.id===page)?.label}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => setModal({type: 'password', data: null})} style={{ background: '#f0f0f0', color: '#333', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🔑 {tr.changePass}</button>
            <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
              <b>{userProfile.username || user.email}</b><br/>{userProfile.role}
            </div>
          </div>
        </header>

        <div style={{ padding: '30px' }}>
          
          {page === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div style={{...styles.card, borderTop: '4px solid #0F3D2E'}}><h3>Total Sales</h3><h1 style={{color:'#0F3D2E'}}>{tSales.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #27ae60'}}><h3>Gross Profit</h3><h1 style={{color:'#27ae60'}}>{tProfit.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #f39c12'}}><h3>Cash Balance</h3><h1 style={{color:'#f39c12'}}>{cashBalance.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #2980b9'}}><h3>Bank Balance</h3><h1 style={{color:'#2980b9'}}>{bankBalance.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #e74c3c'}}><h3>Outstanding</h3><h1 style={{color:'#e74c3c'}}>{totalOutstanding.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #8e44ad'}}><h3>Investments</h3><h1 style={{color:'#8e44ad'}}>{tInvestments.toFixed(0)} SAR</h1></div>
              </div>
              <div style={{...styles.card, marginBottom: '20px'}}>
                <h3 style={{color:'#0F3D2E', marginBottom:'20px'}}>Recent Sales Trend</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '20px', padding: '10px 0' }}>
                  {activeInv.slice(0, 5).reverse().map((inv, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ background: '#0F3D2E', width: '100%', height: `${(inv.total / Math.max(...activeInv.slice(0,5).map(i=>i.total), 1)) * 100}%`, borderRadius: '4px 4px 0 0' }}></div>
                      <small style={{ marginTop: '5px', textAlign: 'center', color: '#666' }}>{inv.invoice_no.split('-')[1]}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{...styles.card, marginBottom: '20px'}}>
                <h3 style={{color:'#0F3D2E'}}>Portal Current Balances</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {data.portals.map(p => (
                    <div key={p.id} style={{ flex: 1, minWidth: '150px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                      <h4 style={{margin:'0 0 5px'}}>{p.name}</h4>
                      <h2 style={{margin:0, color: p.current_balance < 0 ? '#e74c3c' : '#0F3D2E'}}>{p.current_balance || 0} SAR</h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {page === 'create' && (
             <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
               <form onSubmit={handleCreateInvoice}>
                 <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Customer Details</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                   <div><label style={styles.label}>Select Customer</label><select value={invForm.custId} onChange={(e) => setInvForm({...invForm, custId: e.target.value})} style={styles.i} disabled={editingId}><option value="new">+ New Customer</option>{data.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}</select></div>
                   {invForm.custId === 'new' && <>
                     <div><label style={styles.label}>Name</label><input placeholder="Enter Name" value={invForm.custName} onChange={(e) => setInvForm({...invForm, custName: e.target.value})} required style={styles.i} /></div>
                     <div><label style={styles.label}>Phone</label><input placeholder="Enter Phone" value={invForm.custPhone} onChange={(e) => setInvForm({...invForm, custPhone: e.target.value})} required style={styles.i} /></div>
                     <div><label style={styles.label}>Type</label><select value={invForm.custType} onChange={(e) => setInvForm({...invForm, custType: e.target.value})} style={styles.i}><option>Individual</option><option>Group</option><option>Company</option></select></div>
                   </>}
                 </div>
                 {invForm.custType === 'Group' || invForm.custType === 'Company' ? (
                   <div style={{ marginBottom: '20px' }}><label style={styles.label}>Passenger Names</label><textarea placeholder="One per line" value={invForm.passengerNames} onChange={(e) => setInvForm({...invForm, passengerNames: e.target.value})} style={{...styles.i, height: '80px'}} /></div>
                 ) : null}

                 <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Service Details</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                   <div><label style={styles.label}>Service</label><select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.i}>{data.services.map(s => <option key={s.id}>{s.name}</option>)}</select></div>
                   {invForm.service === 'Flight' && <>
                     <div><label style={styles.label}>Flight Type</label><select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.i}><option>Domestic</option><option>International</option></select></div>
                     <div><label style={styles.label}>Booking Type</label><select value={invForm.flightSub} onChange={(e) => setInvForm({...invForm, flightSub: e.target.value})} style={styles.i}><option>New Booking</option><option>Reissue</option><option>Extra Baggage</option></select></div>
                     <div><label style={styles.label}>Journey</label><select value={invForm.flightJourney} onChange={(e) => setInvForm({...invForm, flightJourney: e.target.value})} style={styles.i}><option>Single</option><option>Roundtrip</option></select></div>
                     <div><label style={styles.label}>Airline</label><input placeholder="Flynas" value={invForm.airline} onChange={(e) => setInvForm({...invForm, airline: e.target.value})} style={styles.i} required /></div>
                     <div><label style={styles.label}>Sector</label><input placeholder="JED - RUH" value={invForm.flightSector} onChange={(e) => setInvForm({...invForm, flightSector: e.target.value})} style={styles.i} required /></div>
                     <div><label style={styles.label}>PNR</label><input placeholder="PNR" value={invForm.pnr} onChange={(e) => setInvForm({...invForm, pnr: e.target.value})} style={styles.i} required /></div>
                     <div><label style={styles.label}>Ticket No</label><input placeholder="Ticket No" value={invForm.ticketNo} onChange={(e) => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.i} /></div>
                   </>}
                   {invForm.service === 'Hotel' && <>
                     <div><label style={styles.label}>Hotel Name</label><input placeholder="Hotel Name" value={invForm.hotelName} onChange={(e) => setInvForm({...invForm, hotelName: e.target.value})} style={styles.i} required /></div>
                     <div><label style={styles.label}>Destination</label><input placeholder="Dubai" value={invForm.destination} onChange={(e) => setInvForm({...invForm, destination: e.target.value})} style={styles.i} required /></div>
                     <div><label style={styles.label}>Check-in</label><input type="date" value={invForm.checkIn} onChange={(e) => setInvForm({...invForm, checkIn: e.target.value})} style={styles.i} required /></div>
                     <div><label style={styles.label}>Check-out</label><input type="date" value={invForm.checkOut} onChange={(e) => setInvForm({...invForm, checkOut: e.target.value})} style={styles.i} required /></div>
                   </>}
                   {invForm.service === 'Visa' && <>
                     <div><label style={styles.label}>Visa Type</label><select value={invForm.visaType} onChange={(e) => setInvForm({...invForm, visaType: e.target.value})} style={styles.i}><option>Tourist</option><option>Business</option><option>Visit</option><option>Work</option></select></div>
                     <div><label style={styles.label}>Destination</label><input placeholder="Schengen" value={invForm.destination} onChange={(e) => setInvForm({...invForm, destination: e.target.value})} style={styles.i} required /></div>
                   </>}
                   {/* RENDERING CUSTOM FIELDS DYNAMICALLY */}
                   {data.customFields.map(f => (
                     <div key={f.id}>
                       <label style={styles.label}>{f.name}</label>
                       <input placeholder={f.name} style={styles.i} />
                     </div>
                   ))}
                 </div>

                 <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Pricing & Payment</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                   <div><label style={styles.label}>Sales Rep</label><select value={invForm.employeeId} onChange={(e) => setInvForm({...invForm, employeeId: e.target.value})} style={styles.i}><option value="">Select</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
                   <div><label style={styles.label}>Portal</label><select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.i} required><option value="">Select</option>{data.portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                   <div><label style={styles.label}>Qty</label><input type="number" value={invForm.qty} onChange={(e) => setInvForm({...invForm, qty: e.target.value})} style={styles.i} required /></div>
                   <div><label style={styles.label}>Cost Price</label><input type="number" value={invForm.cost} onChange={(e) => setInvForm({...invForm, cost: e.target.value})} style={styles.i} required /></div>
                   <div><label style={styles.label}>Sell Price</label><input type="number" value={invForm.sell} onChange={(e) => setInvForm({...invForm, sell: e.target.value})} style={styles.i} required /></div>
                   <div><label style={styles.label}>Discount</label><input type="number" value={invForm.discount} onChange={(e) => setInvForm({...invForm, discount: e.target.value})} style={styles.i} /></div>
                   <div><label style={styles.label}>Tax</label><select value={invForm.taxRate} onChange={(e) => setInvForm({...invForm, taxRate: e.target.value})} style={styles.i}><option value="15">15%</option><option value="0">0%</option></select></div>
                   <div><label style={styles.label}>Payment</label><select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.i}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option></select></div>
                   <div><label style={styles.label}>Booking Date</label><input type="date" value={invForm.bookingDate} onChange={(e) => setInvForm({...invForm, bookingDate: e.target.value})} style={styles.i} required /></div>
                   <div><label style={styles.label}>Invoice Date</label><input type="date" value={invForm.invoiceDate} onChange={(e) => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.i} required /></div>
                   <div><label style={styles.label}>Paid Amount</label><input type="number" value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.i} required /></div>
                 </div>
                 <button type="submit" style={{ background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', padding: '15px', width: '100%', borderRadius: '6px' }}>{editingId ? 'Update Invoice' : 'Generate Invoice'}</button>
                 {editingId && <button type="button" onClick={() => { setEditingId(null); setPage('list'); }} style={{ background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '15px', width: '100%', marginTop: '10px', borderRadius: '6px' }}>Cancel</button>}
               </form>
             </div>
          )}

          {page === 'list' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input placeholder={tr.search} value={search} onChange={(e) => { setSearch(e.target.value); setTblPage(1); }} style={{...styles.i, padding: '12px', width: '70%'}} />
                <button onClick={() => exportCSV(activeInv, 'Sales_Invoices.csv')} style={{...styles.btnPrimary, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.th}>Inv No</th><th style={styles.th}>Customer</th><th style={styles.th}>Qty</th><th style={styles.th}>Profit</th><th style={styles.th}>Total</th><th style={styles.th}>Actions</th></tr></thead>
                <tbody>
                  {paginatedInv.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee', backgroundColor: inv.due_amount > 0 ? '#fff3cd' : 'transparent' }}>
                      <td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.customers?.name || 'N/A'}</td>
                      <td style={styles.td}>{inv.qty || 1}</td><td style={{...styles.td, color:'green'}}>{inv.profit} SAR</td><td style={styles.td}>{inv.total} SAR</td>
                      <td style={styles.td}>
                        <button onClick={() => setModal({type: 'preview', data: inv})} style={styles.btnSm}>Preview</button>
                        <button onClick={() => handleEditClick(inv)} style={{...styles.btnSm, background:'#2980b9'}}>Edit</button>
                        {inv.due_amount > 0 && <button onClick={() => { setSettleForm({id: inv.id, date: today, mode: 'Cash', tabbyNo: '', tamaraNo: ''}); setModal({type:'settle', data: inv}); }} style={{...styles.btnSm, background:'#27ae60'}}>Settle</button>}
                        <button onClick={() => { setRefundForm({id: inv.id, compRefund: 0, custRefund: 0, mode: 'Cash'}); setModal({type:'refund', data: inv}); }} style={{...styles.btnSm, background:'#e67e22'}}>Refund</button>
                        <button onClick={() => handleDelete('invoices', inv.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <button onClick={() => setTblPage(p => Math.max(p - 1, 1))} disabled={tblPage === 1} style={{ padding: '8px 16px', cursor: 'pointer', background: tblPage === 1 ? '#ccc' : '#0F3D2E', color: 'white', border: 'none', borderRadius: '4px' }}>Previous</button>
                <span>Page {tblPage} of {totalPages || 1}</span>
                <button onClick={() => setTblPage(p => Math.min(p + 1, totalPages))} disabled={tblPage === totalPages || totalPages === 0} style={{ padding: '8px 16px', cursor: 'pointer', background: tblPage === totalPages ? '#ccc' : '#0F3D2E', color: 'white', border: 'none', borderRadius: '4px' }}>Next</button>
              </div>
            </div>
          )}

          {page === 'refunds' && (
             <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #e74c3c' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                 <h3 style={{margin: 0}}>All Refunds</h3>
                 <button onClick={() => exportCSV(refundInv, 'Refunds.csv')} style={{...styles.btnPrimary, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
               </div>
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
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <h3 style={{margin: 0}}>Customer List (CRM)</h3>
                <button onClick={() => exportCSV(data.customers, 'Customers.csv')} style={{...styles.btnPrimary, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.th}>Name</th><th style={styles.th}>Type</th><th style={styles.th}>Phone</th><th style={styles.th}>Action</th></tr></thead>
                <tbody>
                  {data.customers.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{c.name}</td><td style={styles.td}>{c.type || 'Individual'}</td><td style={styles.td}>{c.phone}</td>
                      <td style={styles.td}>
                        <button onClick={() => setModal({type: 'ledger', data: c})} style={{...styles.btnSm, background:'#2980b9'}}>Ledger</button>
                        <button onClick={() => handleDelete('customers', c.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page === 'portals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #0F3D2E' }}>
                  <h3 style={{color:'#0F3D2E'}}>Add New Portal</h3>
                  <form onSubmit={handleAddPortal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input placeholder="Portal Name (e.g. Flyadeal)" value={portalForm.name} onChange={(e) => setPortalForm({...portalForm, name: e.target.value})} style={styles.i} required />
                    <input type="number" placeholder="Initial Balance" value={portalForm.balance} onChange={(e) => setPortalForm({...portalForm, balance: e.target.value})} style={styles.i} required />
                    <button type="submit" style={styles.btnPrimary}>Add Portal</button>
                  </form>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
                  <h3 style={{color:'#0F3D2E'}}>Add Recharge</h3>
                  <form onSubmit={handleRecharge} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select name="portal" style={styles.i} required><option value="">Select Portal</option>{data.portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                    <input type="number" name="amt" placeholder="Amount" style={styles.i} required />
                    <input type="date" name="date" defaultValue={today} style={styles.i} required />
                    <input name="desc" placeholder="Description" style={styles.i} />
                    <select name="mode" style={styles.i}><option>Cash</option><option>Bank Transfer</option></select>
                    <button type="submit" style={styles.btnPrimary}>Recharge</button>
                  </form>
                </div>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #0F3D2E' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{color:'#0F3D2E', margin: 0}}>Portal Balances & History</h3>
                  <button onClick={() => exportCSV(data.recharges, 'Portals_Recharges.csv')} style={{...styles.btnPrimary, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {data.portals.map(p => (
                    <div key={p.id} style={{ flex: 1, minWidth: '120px', background: '#f8f9fa', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                      <h4>{p.name}</h4><h2 style={{color: p.current_balance < 0 ? 'red' : '#0F3D2E'}}>{p.current_balance || 0}</h2>
                    </div>
                  ))}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.td}>Date</th><th style={styles.td}>Portal</th><th style={styles.td}>Amount</th><th style={styles.td}>Action</th></tr></thead>
                  <tbody>
                    {data.recharges.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{r.recharge_date}</td><td style={styles.td}>{r.portals?.name}</td><td style={styles.td}>{r.amount} SAR</td>
                        <td style={styles.td}><button onClick={() => handleDeleteRecharge(r)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'vendors' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #0F3D2E' }}>
                <h3 style={{color:'#0F3D2E'}}>Add B2B Vendor</h3>
                <form onSubmit={handleAddVendor} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input placeholder="Vendor Name" value={vendorForm.name} onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})} style={styles.i} required />
                  <input placeholder="Phone" value={vendorForm.phone} onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})} style={styles.i} />
                  <input type="number" placeholder="Initial Balance" value={vendorForm.balance} onChange={(e) => setVendorForm({...vendorForm, balance: e.target.value})} style={styles.i} required />
                  <button type="submit" style={styles.btnPrimary}>Add Vendor</button>
                </form>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{color:'#0F3D2E', margin: 0}}>Vendors List</h3>
                  <button onClick={() => exportCSV(data.vendors, 'Vendors.csv')} style={{...styles.btnPrimary, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.td}>Name</th><th style={styles.td}>Phone</th><th style={styles.td}>Balance</th><th style={styles.td}>Action</th></tr></thead>
                  <tbody>
                    {data.vendors.map(v => (
                      <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{v.name}</td><td style={styles.td}>{v.phone}</td><td style={styles.td}>{v.balance} SAR</td>
                        <td style={styles.td}><button onClick={() => handleDelete('vendors', v.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'bank' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #f39c12' }}>
                  <h3 style={{color:'#0F3D2E'}}>Cash/Bank Balances</h3>
                  <div style={{ fontSize: '24px', margin: '20px 0' }}>
                    <p>Cash: <b style={{color:'#f39c12'}}>{cashBalance.toFixed(0)} SAR</b></p>
                    <p>Bank: <b style={{color:'#2980b9'}}>{bankBalance.toFixed(0)} SAR</b></p>
                  </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #2980b9' }}>
                  <h3 style={{color:'#0F3D2E'}}>Fund Transfer</h3>
                  <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={styles.label}>From</label>
                        <select value={transferForm.from} onChange={(e) => setTransferForm({...transferForm, from: e.target.value})} style={styles.i}><option>Cash</option><option>Bank</option><option>Investor</option></select>
                      </div>
                      <div>
                        <label style={styles.label}>To</label>
                        <select value={transferForm.to} onChange={(e) => setTransferForm({...transferForm, to: e.target.value})} style={styles.i}><option>Cash</option><option>Bank</option><option>Investor</option></select>
                      </div>
                    </div>
                    <input type="number" placeholder="Amount" value={transferForm.amount} onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})} style={styles.i} required />
                    <input type="date" value={transferForm.date} onChange={(e) => setTransferForm({...transferForm, date: e.target.value})} style={styles.i} required />
                    <button type="submit" style={styles.btnPrimary}>Transfer</button>
                  </form>
                </div>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #0F3D2E' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{color:'#0F3D2E', margin: 0}}>Recent Transactions</h3>
                  <button onClick={() => exportCSV(data.cashbook, 'Cashbook.csv')} style={{...styles.btnPrimary, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.td}>Date</th><th style={styles.td}>Type</th><th style={styles.td}>Desc</th><th style={styles.td}>Amount</th><th style={styles.td}>Action</th></tr></thead>
                  <tbody>
                    {data.cashbook.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{c.trans_date}</td><td style={styles.td}>{c.type}</td><td style={styles.td}>{c.description}</td><td style={styles.td}>{c.amount} SAR</td>
                        <td style={styles.td}><button onClick={() => handleDelete('cashbook', c.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'invest' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #8e44ad' }}>
                <h3 style={{color:'#0F3D2E'}}>Add Investment</h3>
                <form onSubmit={handleAddInvestment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input placeholder="Investor Name" value={investForm.name} onChange={(e) => setInvestForm({...investForm, name: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder="Amount" value={investForm.amount} onChange={(e) => setInvestForm({...investForm, amount: e.target.value})} style={styles.i} required />
                  <input type="date" value={investForm.date} onChange={(e) => setInvestForm({...investForm, date: e.target.value})} style={styles.i} required />
                  <input placeholder="Description" value={investForm.desc} onChange={(e) => setInvestForm({...investForm, desc: e.target.value})} style={styles.i} />
                  <select value={investForm.mode} onChange={(e) => setInvestForm({...investForm, mode: e.target.value})} style={styles.i}><option>Cash</option><option>Bank Transfer</option></select>
                  <button type="submit" style={styles.btnPrimary}>Add Investment</button>
                </form>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #0F3D2E' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{color:'#0F3D2E', margin: 0}}>Investment History</h3>
                  <button onClick={() => exportCSV(data.investments, 'Investments.csv')} style={{...styles.btnPrimary, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.td}>Date</th><th style={styles.td}>Investor</th><th style={styles.td}>Amount</th><th style={styles.td}>Mode</th><th style={styles.td}>Action</th></tr></thead>
                  <tbody>
                    {data.investments.map(i => (
                      <tr key={i.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{i.invest_date}</td><td style={styles.td}>{i.investor_name}</td><td style={styles.td}>{i.amount} SAR</td><td style={styles.td}>{i.payment_mode}</td>
                        <td style={styles.td}><button onClick={() => handleDelete('investments', i.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'hr' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
                <h3 style={{color:'#0F3D2E'}}>Pay Salary</h3>
                <form onSubmit={handlePaySalary} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <select name="emp" style={styles.i} required><option value="">Select Employee</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                  <input type="number" name="amt" placeholder="Amount" style={styles.i} required />
                  <input type="month" name="month" style={styles.i} required />
                  <select name="mode" style={styles.i}><option>Cash</option><option>Bank Transfer</option></select>
                  <button type="submit" style={styles.btnPrimary}>Pay Salary</button>
                </form>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #0F3D2E' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{color:'#0F3D2E', margin: 0}}>Payroll History</h3>
                  <button onClick={() => exportCSV(data.payroll, 'Payroll.csv')} style={{...styles.btnPrimary, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.td}>Employee</th><th style={styles.td}>Month</th><th style={styles.td}>Amount</th><th style={styles.td}>Mode</th><th style={styles.td}>Action</th></tr></thead>
                  <tbody>
                    {data.payroll.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{p.employees?.name}</td><td style={styles.td}>{p.month}</td><td style={styles.td}>{p.amount} SAR</td><td style={styles.td}>{p.payment_mode}</td>
                        <td style={styles.td}><button onClick={() => handleDelete('payroll', p.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #e74c3c', gridColumn: 'span 2' }}>
                <h3 style={{color:'#0F3D2E'}}>Add Expense</h3>
                <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '10px' }}>
                  <input name="cat" placeholder="Category (Rent, Electricity)" style={styles.i} required />
                  <input name="desc" placeholder="Description" style={styles.i} required />
                  <input type="number" name="amt" placeholder="Amount" style={styles.i} required />
                  <select name="mode" style={styles.i}><option>Cash</option><option>Bank Transfer</option></select>
                  <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '10px 20px'}}>Add Expense</button>
                </form>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginTop: '15px' }}>
                  <tbody>
                    {data.expenses.map(ex => (
                      <tr key={ex.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{ex.category}</td><td style={styles.td}>{ex.description}</td><td style={styles.td}>{ex.amount} SAR</td>
                        <td style={styles.td}><button onClick={() => handleDelete('expenses', ex.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'users' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
                <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>{tr.ownerProfile}</h3>
                <form onSubmit={handleUpdateOwnerProfile}>
                  <label style={styles.label}>{tr.username}</label>
                  <input value={userProfile.username || ''} onChange={(e) => setUserProfile({...userProfile, username: e.target.value})} style={styles.i} />
                  <label style={styles.label}>Email</label>
                  <input value={userProfile.email || ''} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} style={styles.i} />
                  <button type="submit" style={{...styles.btnPrimary, marginTop: '15px'}}>Update Owner Data</button>
                </form>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #0F3D2E' }}>
                <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Add New System User</h3>
                <form onSubmit={handleAddUser}>
                  <label style={styles.label}>{tr.username}</label>
                  <input value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} style={styles.i} required />
                  <label style={styles.label}>Email</label>
                  <input type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} style={styles.i} required />
                  <label style={styles.label}>{tr.role}</label>
                  <select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})} style={styles.i}>
                    <option>Owner</option><option>Manager</option><option>Accountant</option><option>Sales</option>
                  </select>
                  <button type="submit" style={{...styles.btnPrimary, marginTop: '15px'}}>Add User</button>
                </form>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #e74c3c', gridColumn: 'span 2' }}>
                <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>System Users List</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.th}>Username</th><th style={styles.th}>Email</th><th style={styles.th}>Role</th><th style={styles.th}>Action</th></tr></thead>
                  <tbody>
                    {data.appUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{u.username || 'N/A'}</td><td style={styles.td}>{u.email}</td><td style={styles.td}>{u.role}</td>
                        <td style={styles.td}><button onClick={() => handleDelete('app_users', u.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'reports' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <h3 style={{color: '#0F3D2E', marginBottom:'20px'}}>Financial Statements & Reports</h3>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <input type="date" value={repDate.from} onChange={(e) => setRepDate({...repDate, from: e.target.value})} style={styles.i} />
                <input type="date" value={repDate.to} onChange={(e) => setRepDate({...repDate, to: e.target.value})} style={styles.i} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['sales', 'refunds', 'recharges', 'cashbook', 'investments', 'payroll', 'expenses'].map(tab => (
                  <button key={tab} onClick={() => setReportTab(tab)} style={{...styles.btnPrimary, width:'auto', padding:'8px 15px', background: reportTab === tab ? '#0F3D2E' : '#ccc', color: reportTab === tab ? '#D4AF37' : '#333'}}>{tab}</button>
                ))}
                <button onClick={() => exportCSV(currentReportData(), `${reportTab}_report.csv`)} style={{...styles.btnPrimary, width:'auto', padding:'8px 15px', background: '#8e44ad'}}>Export {reportTab} Excel</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}>{currentReportData().length > 0 && Object.keys(currentReportData()[0]).filter(k => k !== 'id').map(k => <th key={k} style={styles.td}>{k}</th>)}</tr></thead>
                <tbody>
                  {currentReportData().map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      {Object.entries(row).filter(([k]) => k !== 'id').map(([k, val]) => <td key={k} style={styles.td}>{typeof val === 'object' ? val?.name || '' : String(val)}</td>)}
                    </tr>
                  ))}
                  {currentReportData().length === 0 && <tr><td style={styles.td} colSpan="10">No data in selected range.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {page === 'audit' && (
             <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #0F3D2E' }}>
               <h3 style={{color: '#0F3D2E'}}>Audit Logs</h3>
               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                 <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.td}>Date</th><th style={styles.td}>User</th><th style={styles.td}>Action</th><th style={styles.td}>Action</th></tr></thead>
                 <tbody>
                   {data.audits.map(a => (
                     <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                       <td style={styles.td}>{new Date(a.created_at).toLocaleString()}</td><td style={styles.td}>{a.user_email}</td><td style={styles.td}>{a.action}</td>
                       <td style={styles.td}><button onClick={() => handleDelete('audit_logs', a.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}

          {page === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
                <h3 style={{color: '#0F3D2E', marginBottom:'20px'}}>Company Settings & Invoice Config</h3>
                <form onSubmit={handleSaveSettings}>
                  <label style={styles.label}>Upload Logo (Will show on Invoice)</label>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{...styles.i, padding:'5px', marginBottom:'10px'}} />
                  {setForm.logo_url && <img src={setForm.logo_url} style={{height: '80px', marginBottom:'10px', background:'#eee', padding:'5px'}} />}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div><label style={styles.label}>Company Name (EN)</label><input value={setForm.company_name_en || ''} onChange={(e) => setSetForm({...setForm, company_name_en: e.target.value})} style={styles.i} /></div>
                    <div><label style={styles.label}>Company Name (AR)</label><input value={setForm.company_name_ar || ''} onChange={(e) => setSetForm({...setForm, company_name_ar: e.target.value})} style={styles.i} /></div>
                    <div><label style={styles.label}>VAT Number</label><input value={setForm.vat_no || ''} onChange={(e) => setSetForm({...setForm, vat_no: e.target.value})} style={styles.i} /></div>
                    <div><label style={styles.label}>CR Number</label><input value={setForm.cr_no || ''} onChange={(e) => setSetForm({...setForm, cr_no: e.target.value})} style={styles.i} /></div>
                    <div><label style={styles.label}>IATA Number</label><input value={setForm.iata_no || ''} onChange={(e) => setSetForm({...setForm, iata_no: e.target.value})} style={styles.i} /></div>
                    <div><label style={styles.label}>Phone Number</label><input value={setForm.phone || ''} onChange={(e) => setSetForm({...setForm, phone: e.target.value})} style={styles.i} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label style={styles.label}>Invoice Footer Text</label><input value={setForm.invoice_footer || ''} onChange={(e) => setSetForm({...setForm, invoice_footer: e.target.value})} style={styles.i} /></div>
                  </div>
                  <button type="submit" style={{...styles.btnPrimary, width:'auto', padding:'12px 30px', marginTop:'20px'}}>Save Settings</button>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #2980b9' }}>
                  <h3 style={{color: '#0F3D2E'}}>Add Employee / Sales Rep</h3>
                  <form onSubmit={handleAddEmployee} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input placeholder="Employee Name" value={empForm.name} onChange={(e) => setEmpForm({...empForm, name: e.target.value})} style={styles.i} required />
                    <select value={empForm.role} onChange={(e) => setEmpForm({...empForm, role: e.target.value})} style={styles.i}><option>Sales</option><option>Manager</option><option>Accountant</option></select>
                    <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '10px 20px'}}>Add</button>
                  </form>
                  <div style={{ marginTop: '10px' }}>
                    {data.employees.map(e => <span key={e.id} style={styles.tag}>{e.name} ({e.role}) <button onClick={() => handleDelete('employees', e.id)} style={styles.tagBtn}>x</button></span>)}
                  </div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #27ae60' }}>
                  <h3 style={{color: '#0F3D2E'}}>Add Service Type</h3>
                  <form onSubmit={handleAddService} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input placeholder="e.g. Flight, Hotel, Visa" value={srvForm.name} onChange={(e) => setSrvForm({...srvForm, name: e.target.value})} style={styles.i} required />
                    <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '10px 20px'}}>Add</button>
                  </form>
                  <div style={{ marginTop: '10px' }}>
                    {data.services.map(s => <span key={s.id} style={styles.tag}>{s.name} <button onClick={() => handleDelete('services', s.id)} style={styles.tagBtn}>x</button></span>)}
                  </div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #8e44ad' }}>
                  <h3 style={{color: '#0F3D2E'}}>{tr.addCustomField}</h3>
                  <p style={{fontSize: '12px', color: '#666'}}>Add new fields to your Invoice Form for future needs.</p>
                  <form onSubmit={handleAddCustomField} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input placeholder="e.g. Insurance No, Baggage Info" value={customFieldForm.name} onChange={(e) => setCustomFieldForm({name: e.target.value})} style={styles.i} required />
                    <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '10px 20px'}}>Add</button>
                  </form>
                  <div style={{ marginTop: '10px' }}>
                    {data.customFields.map(f => <span key={f.id} style={styles.tag}>{f.name} <button onClick={() => handleDelete('custom_fields', f.id)} style={styles.tagBtn}>x</button></span>)}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

const styles = {
  card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  th: { padding: '12px 15px', textAlign: 'left', fontSize: '14px' },
  td: { padding: '12px 15px', fontSize: '14px' },
  label: { display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555' },
  i: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
  btnPrimary: { background: '#0F3D2E', color: '#D4AF37', border: 'none', padding: '12px', width: '100%', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' },
  btnSm: { background: '#0F3D2E', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', marginRight: '5px' },
  tag: { background: '#eee', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', margin: '5px', display: 'inline-block' },
  tagBtn: { background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }
};
