'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

const styles = {
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' },
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' },
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block', marginTop: '10px' }
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({ email: '', username: '', role: 'Owner', is_admin: true, can_access_invoices: true, can_access_bank: true, can_access_hr: true, can_access_reports: true, can_access_settings: true });
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });
  const [passForm, setPassForm] = useState({ newPass: '' });

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'مرحباً! أنا مساعدك في نظام ERP. كيف يمكنني مساعدتك اليوم؟' }]);
  const [chatInput, setChatInput] = useState('');

  const [search, setSearch] = useState('');
  const [tblPage, setTblPage] = useState(1);
  const itemsPerPage = 10;
  const [statementTab, setStatementTab] = useState('sales');

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], recharges: [], settings: {}, employees: [], payroll: [], appUsers: [], expenses: [], services: [], cashbook: [], audits: [], investments: [], vendors: [], customFields: [], packages: [], branches: [] });
  const today = new Date().toISOString().split('T')[0];
  
  const [invForm, setInvForm] = useState({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', passengerNames: '', employeeId: '', portal: '', bookingDate: today, invoiceDate: today, service: 'Flight Ticket', flightType: 'Domestic', flightSub: 'New Booking', flightJourney: 'Single', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed' });
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
  const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '' });

  // COMPLETE TRANSLATIONS
  const t = {
    en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices List', refunds: 'Refund Invoices', customers: 'Customer List', portals: 'Portals & Recharge', bank: 'Bank & Cash', invest: 'Investors', hr: 'HR & Accounts', users: 'User Management', reports: 'Financial Reports', audit: 'Audit Logs', settings: 'Settings', vendors: 'Vendors (B2B)', packages: 'Tour Packages', branches: 'Branches', logout: 'Logout', search: 'Search...', ownerProfile: 'Owner Profile', changePass: 'Change Password', statements: 'Statements',
          cust_name: 'Customer Name', cust_phone: 'Customer Phone', cust_type: 'Customer Type', individual: 'Individual', corporate: 'Corporate', passenger_names: 'Passenger Names', portal: 'Portal', sales_rep: 'Sales Representative', service: 'Service', booking_date: 'Booking Date', invoice_date: 'Invoice Date', payment_date: 'Payment Date', flight_type: 'Flight Type', flight_sub: 'Flight Sub-Type', airline: 'Airline', sector: 'Sector (e.g. DEL-RUH)', pnr: 'PNR', ticket_no: 'Ticket Number', qty: 'Quantity', cost: 'Cost', sell: 'Selling Price', discount: 'Discount', tax_rate: 'Tax Rate', payment_method: 'Payment Method', paid_amount: 'Paid Amount', credit_due_date: 'Credit Due Date', add_new_customer: '+ Add New Customer', add_new_service: '+ Add New Service Here',
          from_acc: 'From Account', to_acc: 'To Account', amount: 'Amount', date: 'Date', desc: 'Description', mode: 'Mode', name: 'Name', role: 'Role', phone: 'Phone', location: 'Location', manager: 'Manager', email: 'Email', timing: 'Opening Time', price: 'Price', balance: 'Balance', category: 'Category', month: 'Month', investor_name: 'Investor Name', new_service_name: 'New Service Name',
          sales_stmt: 'Sales Statement', portals_stmt: 'Portals Statement', salary_stmt: 'Salary Statement', daily_trans_stmt: 'Daily Transactions', fund_trans_stmt: 'Fund Transfers', export_csv: 'Export CSV'
        },
    ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'قائمة الفواتير', refunds: 'فواتير الاسترجاع', customers: 'قائمة العملاء', portals: 'البوابات والرصيد', bank: 'البنك والكاش', invest: 'المستثمرون', hr: 'الموارد البشرية', users: 'إدارة المستخدمين', reports: 'التقارير المالية', audit: 'سجلات التدقيق', settings: 'الإعدادات', vendors: 'الموردون', packages: 'باقات سياحية', branches: 'الفروع', logout: 'تسجيل الخروج', search: 'بحث...', ownerProfile: 'ملف المالك', changePass: 'تغيير كلمة المرور', statements: 'كشوف الحسابات',
          cust_name: 'اسم العميل', cust_phone: 'هاتف العميل', cust_type: 'نوع العميل', individual: 'فرد', corporate: 'شركة', passenger_names: 'أسماء الركاب', portal: 'البوابة', sales_rep: 'مندوب المبيعات', service: 'الخدمة', booking_date: 'تاريخ الحجز', invoice_date: 'تاريخ الفاتورة', payment_date: 'تاريخ الدفع', flight_type: 'نوع الرحلة', flight_sub: 'نوع الرحلة الفرعي', airline: 'خطوط الطيران', sector: 'القطاع (مثال: DEL-RUH)', pnr: 'رقم الحجز', ticket_no: 'رقم التذكرة', qty: 'الكمية', cost: 'التكلفة', sell: 'سعر البيع', discount: 'الخصم', tax_rate: 'معدل الضريبة', payment_method: 'طريقة الدفع', paid_amount: 'المبلغ المدفوع', credit_due_date: 'تاريخ استحقاق الائتمان', add_new_customer: '+ إضافة عميل جديد', add_new_service: '+ أضف خدمة جديدة هنا',
          from_acc: 'من حساب', to_acc: 'إلى حساب', amount: 'المبلغ', date: 'التاريخ', desc: 'الوصف', mode: 'الوضع', name: 'الاسم', role: 'الدور', phone: 'الهاتف', location: 'الموقع', manager: 'المدير', email: 'البريد الإلكتروني', timing: 'وقت العمل', price: 'السعر', balance: 'الرصيد', category: 'الفئة', month: 'الشهر', investor_name: 'اسم المستثمر', new_service_name: 'اسم الخدمة الجديدة',
          sales_stmt: 'كشف حساب المبيعات', portals_stmt: 'كشف حساب البوابات', salary_stmt: 'كشف حساب الرواتب', daily_trans_stmt: 'المعاملات اليومية', fund_trans_stmt: 'تحويلات الأموال', export_csv: 'تصدير CSV'
        }
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
        setUser({ ...user, email: userProfile.email });
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
    let botReply = "I am sorry, I didn't understand that. I can help with Invoices, Reports, or Users. (عذراً، لم أفهم ذلك. يمكنني المساعدة في الفواتير، التقارير، أو المستخدمين)";
    if (text.includes('invoice') || text.includes('فاتورة') || text.includes('create')) {
      botReply = "To create an invoice, go to 'Create Invoice'. You can add Flight, Hotel, or Visa details. The system will automatically calculate VAT and update your portal balance! (لإنشاء فاتورة، انتقل إلى 'إنشاء فاتورة'. يمكنك إضافة رحلة طيران أو فندق أو تأشيرة. سيقوم النظام تلقائياً بحساب ضريبة القيمة المضافة وتحديث رصيد البوابة الخاص بك!)";
    } else if (text.includes('report') || text.includes('تقرير') || text.includes('excel')) {
      botReply = "You can download Excel reports for Sales, Refunds, and Cashbook from the 'Financial Reports' section. Just select a date range! (يمكنك تنزيل تقارير Excel للمبيعات والاسترداد والدفع النقدي من قسم 'التقارير المالية'. ما عليك سوى تحديد نطاق التاريخ!)";
    }
    setTimeout(() => { setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]); }, 600);
    setChatInput('');
  };

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
      if (invForm.service === 'Flight Ticket') desc = `${invForm.flightSub} (${invForm.flightType}) - ${invForm.airline} - ${invForm.flightJourney} - ${invForm.flightSector}`;
      else if (invForm.service === 'Hotel') desc = `${invForm.hotelName} - ${invForm.destination} (${invForm.checkIn} to ${invForm.checkOut})`;
      else if (invForm.service === 'Umrah Visa' || invForm.service === 'Visit Visa') desc = `${invForm.service} - ${invForm.destination}`;
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
      setInvForm({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', passengerNames: '', employeeId: '', portal: data.portals[0]?.name || '', bookingDate: today, invoiceDate: today, service: 'Flight Ticket', flightType: 'Domestic', flightSub: 'New Booking', flightJourney: 'Single', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed' });
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
    const { data: upInv } = await supabase.from('invoices').update({ paid_amount: newPaid, due_amount: 0, settlement_date: settleForm.date, payment_method: settleForm.mode }).eq('id', inv.id).select(`*, customers(name, type, phone), portals(name), employees(name)`).single();
    let newCashEntry = null;
    const cbType = settleForm.mode === 'Cash' ? 'Cash-In' : (settleForm.mode === 'Bank Transfer' ? 'Bank-In' : null);
    if (cbType) {
      const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: settleForm.date, type: cbType, description: `Settlement for ${inv.invoice_no}`, amount: inv.due_amount }]).select().single();
      newCashEntry = nC;
    }
    await logAction(`Settled payment for ${inv.invoice_no}`);
    setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i), cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook }));
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
    const { data: newRefInv } = await supabase.from('invoices').insert([{ invoice_no: refNo, customer_id: inv.customer_id, portal_id: inv.portal_id, booking_date: today, invoice_date: today, service_type: `Refund for ${inv.invoice_no}`, total_sell: -custRef, total: -custRef, paid_amount: -custRef, status: 'refunded', refund_company: compRef, refund_customer: custRef }]).select(`*, customers(name, type, phone), portals(name), employees(name)`).single();
    let newPortalBal = inv.portals?.current_balance || 0;
    if (inv.portal_id) { newPortalBal += compRef; await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', inv.portal_id); }
    let newCashEntry = null;
    if (custRef > 0) {
      const cbType = refundForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
      const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Refund to customer for ${inv.invoice_no}`, amount: custRef }]).select().single();
      newCashEntry = nC;
    }
    await logAction(`Processed refund ${refNo}`);
    setData(prev => ({ ...prev, invoices: [newRefInv, prev.invoices.map(i => i.id === inv.id ? upInv : i)].flat(), portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: newPortalBal } : p), cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook }));
    showToast('Refund Processed! Portal balance updated.');
    setModal({ type: null, data: null });
  };

  const handleAddPortal = async (e) => { e.preventDefault(); const { data: newItem } = await supabase.from('portals').insert([{ name: portalForm.name, current_balance: parseFloat(portalForm.balance) || 0 }]).select().single(); setData(prev => ({ ...prev, portals: [...prev.portals, newItem] })); showToast('Portal Added!'); setPortalForm({ name: '', balance: 0 }); };
  const handleAddVendor = async (e) => { e.preventDefault(); const { data: newItem } = await supabase.from('vendors').insert([{ name: vendorForm.name, phone: vendorForm.phone, balance: parseFloat(vendorForm.balance) || 0 }]).select().single(); setData(prev => ({ ...prev, vendors: [...prev.vendors, newItem] })); showToast('Vendor Added!'); setVendorForm({ name: '', phone: '', balance: 0 }); };
  const handleAddPackage = async (e) => { e.preventDefault(); const { data: newItem } = await supabase.from('packages').insert([{ name: pkgForm.name, price: parseFloat(pkgForm.price), description: pkgForm.desc }]).select().single(); setData(prev => ({ ...prev, packages: [...prev.packages, newItem] })); showToast('Package Added!'); setPkgForm({ name: '', price: '', desc: '' }); };
  
  const handleAddBranch = async (e) => { 
    e.preventDefault(); 
    const { data: newItem } = await supabase.from('branches').insert([{ name: brnForm.name, location: brnForm.location, phone: brnForm.phone, manager: brnForm.manager, email: brnForm.email, timing: brnForm.timing }]).select().single(); 
    setData(prev => ({ ...prev, branches: [...prev.branches, newItem] })); 
    showToast('Branch Added!'); 
    setBrnForm({ name: '', location: '', phone: '', manager: '', email: '', timing: '' }); 
  };
  
  const handleAddEmployee = async (e) => { e.preventDefault(); const { data: newItem } = await supabase.from('employees').insert([{ name: empForm.name, role: empForm.role }]).select().single(); setData(prev => ({ ...prev, employees: [newItem, ...prev.employees] })); showToast('Employee Added!'); setEmpForm({ name: '', role: 'Sales' }); };
  
  const handleAddService = async (e) => { 
    e.preventDefault(); 
    const { data: newItem } = await supabase.from('services').insert([{ name: srvForm.name }]).select().single(); 
    setData(prev => ({ ...prev, services: [newItem, ...prev.services] })); 
    showToast('Service Added!'); 
    setSrvForm({ name: '' }); 
  };

  const handleAddCustomField = async (e) => { e.preventDefault(); const { data: newItem } = await supabase.from('custom_fields').insert([{ name: customFieldForm.name }]).select().single(); setData(prev => ({ ...prev, customFields: [...prev.customFields, newItem] })); showToast('Custom Field Added!'); setCustomFieldForm({ name: '' }); };

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

  const handleTransfer = async (e) => {
    e.preventDefault();
    const amt = parseFloat(transferForm.amount);
    if (amt <= 0 || transferForm.from === transferForm.to) return showToast("Invalid transfer");
    const entries = [];
    if (transferForm.from === 'Cash') entries.push({ trans_date: transferForm.date, type: 'Cash-Out', description: `Transfer to ${transferForm.to}`, amount: amt });
    if (transferForm.from === 'Bank') entries.push({ trans_date: transferForm.date, type: 'Bank-Out', description: `Transfer to ${transferForm.to}`, amount: amt });
    if (transferForm.from === 'Investor') entries.push({ trans_date: transferForm.date, type: 'Investor-Out', description: `Transfer to ${transferForm.to}`, amount: amt });
    
    if (transferForm.to === 'Cash') entries.push({ trans_date: transferForm.date, type: 'Cash-In', description: `Transfer from ${transferForm.from}`, amount: amt });
    if (transferForm.to === 'Bank') entries.push({ trans_date: transferForm.date, type: 'Bank-In', description: `Transfer from ${transferForm.from}`, amount: amt });
    if (transferForm.to === 'Investor') entries.push({ trans_date: transferForm.date, type: 'Investor-In', description: `Transfer from ${transferForm.from}`, amount: amt });
    
    await Promise.all(entries.map(en => supabase.from('cashbook').insert([en])));
    await fetchAll();
    showToast('Fund Transferred Successfully!');
    setTransferForm({ from: 'Cash', to: 'Bank', amount: '', date: today });
  };

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
    showToast('Investor Added!');
    setInvestForm({ name: '', amount: '', date: today, desc: '', mode: 'Cash' });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const { data: newUser } = await supabase.from('app_users').insert([{ email: userForm.email, username: userForm.username, role: userForm.role, ...userForm }]).select().single();
    setData(prev => ({ ...prev, appUsers: [newUser, ...prev.appUsers] }));
    showToast('User Added with Custom Permissions!');
    setUserForm({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('logos').upload(fileName, file);
    if (error) return showToast('Upload Error: Check Storage Bucket');
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
    setSetForm(prev => ({ ...prev, logo_url: urlData.publicUrl }));
    showToast('Logo Uploaded!');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('settings').upsert([{ id: 1, ...setForm }]).eq('id', 1);
    if (error) return showToast('Error saving settings');
    setData(prev => ({ ...prev, settings: setForm }));
    showToast('Settings Saved Successfully!');
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Delete permanently?')) return;
    await supabase.from(table).delete().eq('id', id);
    setData(prev => ({ ...prev, [table]: prev[table].filter(item => item.id !== id) }));
    showToast('Deleted Successfully!');
  };

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
        ${inv.passenger_names ? `<div style="margin-bottom:20px;padding:10px;background:#fff;border:1px dashed #ddd;"><b style="font-size:12px;">Passengers:</b><br/><span style="font-size:12px;white-space:pre-wrap;">${inv.passenger_names}</span></div>` : ''}
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
  const outstandingInv = activeInv.filter(i => i.due_amount > 0);
  
  const cashBalance = data.cashbook.filter(c => c.type === 'Cash-In').reduce((s,c) => s + c.amount, 0) - data.cashbook.filter(c => c.type === 'Cash-Out').reduce((s,c) => s + c.amount, 0);
  const bankBalance = data.cashbook.filter(c => c.type === 'Bank-In').reduce((s,c) => s + c.amount, 0) - data.cashbook.filter(c => c.type === 'Bank-Out').reduce((s,c) => s + c.amount, 0);
  const investorBalance = data.cashbook.filter(c => c.type === 'Investor-In').reduce((s,c) => s + c.amount, 0) - data.cashbook.filter(c => c.type === 'Investor-Out').reduce((s,c) => s + c.amount, 0);

  const tSales = activeInv.reduce((s,i) => s + i.total, 0);
  const tProfit = activeInv.reduce((s,i) => s + i.profit, 0);
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
    { id: 'packages', label: tr.packages, show: userProfile.is_admin || userProfile.can_access_invoices },
    { id: 'branches', label: tr.branches, show: userProfile.is_admin || userProfile.can_access_settings },
    { id: 'bank', label: tr.bank, show: userProfile.is_admin || userProfile.can_access_bank },
    { id: 'invest', label: tr.invest, show: userProfile.is_admin || userProfile.can_access_bank },
    { id: 'hr', label: tr.hr, show: userProfile.is_admin || userProfile.can_access_hr },
    { id: 'statements', label: tr.statements, show: userProfile.is_admin || userProfile.can_access_reports },
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

  const getStatementData = () => {
    if (statementTab === 'sales') return data.invoices.map(i => ({ date: i.invoice_date, invoice_no: i.invoice_no, customer: i.customers?.name, total: i.total, paid: i.paid_amount, due: i.due_amount }));
    if (statementTab === 'portals') return data.portals.map(p => ({ name: p.name, balance: p.current_balance }));
    if (statementTab === 'salaries') return data.payroll.map(p => ({ date: p.paid_date, employee: p.employees?.name, month: p.month, amount: p.amount, mode: p.payment_mode }));
    if (statementTab === 'daily_trans') return data.cashbook.map(c => ({ date: c.trans_date, type: c.type, desc: c.description, amount: c.amount }));
    if (statementTab === 'fund_trans') return data.cashbook.filter(c => c.description.includes('Transfer')).map(c => ({ date: c.trans_date, type: c.type, desc: c.description, amount: c.amount }));
    return [];
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Poppins', sans-serif", background: '#F1F5F9', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: '#FBBF24', padding: '15px 25px', borderRadius: '12px', zIndex: 9999, boxShadow: '0 5px 15px rgba(0,0,0,0.2)', fontWeight: '600' }}>{toast}</div>
      )}

      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>
        {chatOpen && (
          <div style={{ width: '380px', height: '500px', background: 'white', borderRadius: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ background: 'linear-gradient(90deg, #1E3A8A, #2563EB)', color: 'white', padding: '20px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              ERP AI Assistant (مساعد)
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>✖</button>
            </div>
            <div style={{ flex: 1, padding: '20px', fontSize: '14px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? '#2563EB' : 'white', color: msg.sender === 'user' ? 'white' : '#1E293B', padding: '12px 18px', borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0', maxWidth: '80%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div style={{ padding: '15px', borderTop: '1px solid #e2e8f0', display: 'flex', background: 'white' }}>
              <input placeholder="Type your message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '25px', padding: '12px 20px', outline: 'none' }} />
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
                  <thead>
                    <tr style={{ background: '#1E3A8A', color: '#FBBF24' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Invoice No</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Paid</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.invoices.filter(inv => inv.customer_id === modal.data.id).map(inv => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{inv.invoice_date}</td>
                        <td style={{ padding: '10px' }}>{inv.invoice_no}</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>{inv.total.toFixed(2)}</td>
                        <td style={{ padding: '10px', textAlign: 'right', color: '#059669' }}>{inv.paid_amount.toFixed(2)}</td>
                        <td style={{ padding: '10px', textAlign: 'right', color: inv.due_amount > 0 ? '#EF4444' : '#059669' }}>{inv.due_amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width: '260px', background: '#1E3A8A', color: 'white', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h1 style={{ fontSize: '20px', margin: 0, fontWeight: 'bold' }}>SUEUD AL TAIYYARAH</h1>
          <p style={{ fontSize: '12px', color: '#FBBF24', marginTop: '5px' }}>ERP System</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '15px 0' }}>
          {menu.map(m => (
            <div key={m.id} onClick={() => setPage(m.id)} style={{ padding: '15px 25px', cursor: 'pointer', background: page === m.id ? 'rgba(255,255,255,0.1)' : 'transparent', borderLeft: page === m.id ? '4px solid #FBBF24' : '4px solid transparent', transition: 'all 0.2s', fontWeight: page === m.id ? 'bold' : 'normal' }}>
              {m.label}
            </div>
          ))}
        </div>
        <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => setModal({ type: 'password', data: null })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px' }}>{tr.changePass}</button>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{tr.logout}</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: 0, color: '#1E3A8A' }}>{menu.find(m => m.id === page)?.label}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input type="text" placeholder={tr.search} value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }} />
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer' }}>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#1E3A8A' }}>{userProfile.username || userProfile.email}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{userProfile.role}</p>
            </div>
          </div>
        </div>

        {/* DASHBOARD */}
        {page === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={styles.card}><h3 style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>Total Sales</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E3A8A', margin: 0 }}>{tSales.toFixed(2)} SAR</p></div>
              <div style={styles.card}><h3 style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>Total Profit</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: 0 }}>{tProfit.toFixed(2)} SAR</p></div>
              <div style={styles.card}><h3 style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>Outstanding</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#EF4444', margin: 0 }}>{totalOutstanding.toFixed(2)} SAR</p></div>
              <div style={styles.card}><h3 style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>Cash / Bank Balance</h3><p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E3A8A', margin: 0 }}>Cash: {cashBalance.toFixed(2)}</p><p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E3A8A', margin: '5px 0 0 0' }}>Bank: {bankBalance.toFixed(2)}</p></div>
            </div>
            <div style={styles.card}>
              <h3 style={{ color: '#1E3A8A', marginTop: 0 }}>Recent Invoices</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}><th style={{padding: '10px'}}>Invoice No</th><th style={{padding: '10px'}}>Customer</th><th style={{padding: '10px'}}>Date</th><th style={{padding: '10px', textAlign: 'right'}}>Total</th></tr></thead>
                <tbody>
                  {data.invoices.slice(0, 5).map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{padding: '10px', fontWeight: 'bold', color: '#1E3A8A'}}>{inv.invoice_no}</td>
                      <td style={{padding: '10px'}}>{inv.customers?.name || 'N/A'}</td>
                      <td style={{padding: '10px'}}>{inv.invoice_date}</td>
                      <td style={{padding: '10px', textAlign: 'right', fontWeight: 'bold'}}>{inv.total.toFixed(2)} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CREATE INVOICE WITH LABELS & NEW FEATURES */}
        {page === 'create' && (
          <div style={styles.card}>
            <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>{editingId ? 'Edit Invoice' : 'Create New Invoice'}</h3>
            <form onSubmit={handleCreateInvoice} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={styles.label}>{tr.cust_type}</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select value={invForm.custType} onChange={(e) => setInvForm({...invForm, custType: e.target.value})} style={styles.input}>
                    <option>Individual</option><option>Corporate</option>
                  </select>
                  <button type="button" onClick={() => setInvForm({...invForm, custId: 'new'})} style={{...styles.btnSuccess, width: 'auto', whiteSpace: 'nowrap'}}>+</button>
                </div>
                
                <label style={styles.label}>Customer</label>
                <select value={invForm.custId} onChange={(e) => setInvForm({...invForm, custId: e.target.value})} style={styles.input}>
                  <option value="new">New Customer</option>
                  {data.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                </select>
                
                {invForm.custId === 'new' && (
                  <>
                    <label style={styles.label}>{tr.cust_name}</label>
                    <input type="text" value={invForm.custName} onChange={(e) => setInvForm({...invForm, custName: e.target.value})} required style={styles.input} />
                    <label style={styles.label}>{tr.cust_phone}</label>
                    <input type="text" value={invForm.custPhone} onChange={(e) => setInvForm({...invForm, custPhone: e.target.value})} required style={styles.input} />
                  </>
                )}
                
                <label style={styles.label}>{tr.passenger_names}</label>
                <input type="text" value={invForm.passengerNames} onChange={(e) => setInvForm({...invForm, passengerNames: e.target.value})} style={styles.input} />
                
                <label style={styles.label}>{tr.portal}</label>
                <select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.input}>
                  {data.portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                
                <label style={styles.label}>{tr.sales_rep}</label>
                <select value={invForm.employeeId} onChange={(e) => setInvForm({...invForm, employeeId: e.target.value})} style={styles.input}>
                  <option value="">Select Employee</option>
                  {data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                
                <label style={styles.label}>{tr.service}</label>
                <select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.input}>
                  <option>Flight Ticket</option><option>Hotel</option><option>Packages</option><option>Umrah Visa</option><option>Visit Visa</option>
                  {data.services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                
                <label style={styles.label}>{tr.add_new_service}</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder={tr.new_service_name} value={srvForm.name} onChange={(e) => setSrvForm({name: e.target.value})} style={styles.input} />
                  <button type="button" onClick={handleAddService} style={{...styles.btnPrimary, width: 'auto'}}>+</button>
                </div>
              </div>

              <div>
                <label style={styles.label}>{tr.booking_date}</label>
                <input type="date" value={invForm.bookingDate} onChange={(e) => setInvForm({...invForm, bookingDate: e.target.value})} style={styles.input} />
                <label style={styles.label}>{tr.invoice_date}</label>
                <input type="date" value={invForm.invoiceDate} onChange={(e) => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.input} />
                
                <label style={styles.label}>{tr.flight_type} (If Flight)</label>
                <select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.input}><option>Domestic</option><option>International</option></select>
                <label style={styles.label}>{tr.flight_sub}</label>
                <select value={invForm.flightSub} onChange={(e) => setInvForm({...invForm, flightSub: e.target.value})} style={styles.input}><option>New Booking</option><option>Reissue</option><option>Refund</option></select>
                <label style={styles.label}>{tr.airline}</label>
                <input type="text" value={invForm.airline} onChange={(e) => setInvForm({...invForm, airline: e.target.value})} style={styles.input} />
                <label style={styles.label}>{tr.sector}</label>
                <input type="text" value={invForm.flightSector} onChange={(e) => setInvForm({...invForm, flightSector: e.target.value})} style={styles.input} />
                <label style={styles.label}>{tr.pnr}</label>
                <input type="text" value={invForm.pnr} onChange={(e) => setInvForm({...invForm, pnr: e.target.value})} style={styles.input} />
                <label style={styles.label}>{tr.ticket_no}</label>
                <input type="text" value={invForm.ticketNo} onChange={(e) => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.input} />

                <label style={styles.label}>{tr.qty}</label>
                <input type="number" value={invForm.qty} onChange={(e) => setInvForm({...invForm, qty: e.target.value})} style={styles.input} />
                <label style={styles.label}>{tr.cost}</label>
                <input type="number" value={invForm.cost} onChange={(e) => setInvForm({...invForm, cost: e.target.value})} style={styles.input} />
                <label style={styles.label}>{tr.sell}</label>
                <input type="number" value={invForm.sell} onChange={(e) => setInvForm({...invForm, sell: e.target.value})} style={styles.input} />
                <label style={styles.label}>{tr.discount}</label>
                <input type="number" value={invForm.discount} onChange={(e) => setInvForm({...invForm, discount: e.target.value})} style={styles.input} />
                <label style={styles.label}>{tr.tax_rate}</label>
                <select value={invForm.taxRate} onChange={(e) => setInvForm({...invForm, taxRate: e.target.value})} style={styles.input}><option value="15">VAT 15%</option><option value="0">Exempt</option></select>
                
                <label style={styles.label}>{tr.payment_method}</label>
                <select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option></select>
                <label style={styles.label}>{tr.paid_amount}</label>
                <input type="number" value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.input} />
                <label style={styles.label}>{tr.credit_due_date}</label>
                <input type="date" value={invForm.creditDueDate} onChange={(e) => setInvForm({...invForm, creditDueDate: e.target.value})} style={styles.input} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '10px 30px'}}>{editingId ? 'Update Invoice' : 'Generate Invoice'}</button>
              </div>
            </form>
          </div>
        )}

        {/* INVOICE LIST */}
        {page === 'list' && (
          <div style={styles.card}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                <th style={{padding: '10px'}}>Inv No</th><th style={{padding: '10px'}}>Customer</th><th style={{padding: '10px'}}>Date</th><th style={{padding: '10px'}}>Total</th><th style={{padding: '10px'}}>Due</th><th style={{padding: '10px'}}>Actions</th>
              </tr></thead>
              <tbody>
                {paginatedInv.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{padding: '10px', fontWeight: 'bold', color: '#1E3A8A'}}>{inv.invoice_no}</td>
                    <td style={{padding: '10px'}}>{inv.customers?.name}</td>
                    <td style={{padding: '10px'}}>{inv.invoice_date}</td>
                    <td style={{padding: '10px'}}>{inv.total.toFixed(2)}</td>
                    <td style={{padding: '10px', color: inv.due_amount > 0 ? '#EF4444' : '#059669'}}>{inv.due_amount.toFixed(2)}</td>
                    <td style={{padding: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                      <button onClick={() => setModal({type: 'preview', data: inv})} style={styles.btnWarning}>View</button>
                      <button onClick={() => handleEditClick(inv)} style={styles.btnPrimary}>Edit</button>
                      {inv.due_amount > 0 && <button onClick={() => { setSettleForm({...settleForm, id: inv.id}); setModal({type: 'settle', data: inv}); }} style={styles.btnSuccess}>Settle</button>}
                      <button onClick={() => { setRefundForm({...refundForm, id: inv.id}); setModal({type: 'refund', data: inv}); }} style={styles.btnDanger}>Refund</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
              <button disabled={tblPage === 1} onClick={() => setTblPage(p => p - 1)} style={styles.btnPrimary}>Prev</button>
              <span style={{ padding: '10px' }}>Page {tblPage} of {totalPages}</span>
              <button disabled={tblPage === totalPages} onClick={() => setTblPage(p => p + 1)} style={styles.btnPrimary}>Next</button>
            </div>
          </div>
        )}

        {/* STATEMENTS SECTION (NEW) */}
        {page === 'statements' && (
          <div style={styles.card}>
            <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Financial Statements</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button onClick={() => setStatementTab('sales')} style={statementTab === 'sales' ? styles.btnPrimary : styles.btnSuccess}>{tr.sales_stmt}</button>
              <button onClick={() => setStatementTab('portals')} style={statementTab === 'portals' ? styles.btnPrimary : styles.btnSuccess}>{tr.portals_stmt}</button>
              <button onClick={() => setStatementTab('salaries')} style={statementTab === 'salaries' ? styles.btnPrimary : styles.btnSuccess}>{tr.salary_stmt}</button>
              <button onClick={() => setStatementTab('daily_trans')} style={statementTab === 'daily_trans' ? styles.btnPrimary : styles.btnSuccess}>{tr.daily_trans_stmt}</button>
              <button onClick={() => setStatementTab('fund_trans')} style={statementTab === 'fund_trans' ? styles.btnPrimary : styles.btnSuccess}>{tr.fund_trans_stmt}</button>
              <button onClick={() => exportCSV(getStatementData(), `${statementTab}_statement.csv`)} style={{...styles.btnWarning, marginLeft: 'auto'}}>{tr.export_csv}</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                {getStatementData().length > 0 && Object.keys(getStatementData()[0]).map(k => <th key={k} style={{padding: '10px', textTransform: 'capitalize'}}>{k.replace(/_/g, ' ')}</th>)}
              </tr></thead>
              <tbody>
                {getStatementData().map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    {Object.values(row).map((val, j) => <td key={j} style={{padding: '10px'}}>{typeof val === 'object' ? val?.name || 'N/A' : val !== null ? val.toString() : ''}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REFUNDS */}
        {page === 'refunds' && (
          <div style={styles.card}>
            <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Refunded Invoices</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                <th style={{padding: '10px'}}>Ref No</th><th style={{padding: '10px'}}>Customer</th><th style={{padding: '10px'}}>Date</th><th style={{padding: '10px'}}>Refund Amount</th>
              </tr></thead>
              <tbody>
                {refundInv.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{padding: '10px', fontWeight: 'bold', color: '#EF4444'}}>{inv.invoice_no}</td>
                    <td style={{padding: '10px'}}>{inv.customers?.name}</td>
                    <td style={{padding: '10px'}}>{inv.invoice_date}</td>
                    <td style={{padding: '10px'}}>{inv.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CUSTOMERS */}
        {page === 'customers' && (
          <div style={styles.card}>
            <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Customers</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                <th style={{padding: '10px'}}>Name</th><th style={{padding: '10px'}}>Phone</th><th style={{padding: '10px'}}>Type</th><th style={{padding: '10px'}}>Actions</th>
              </tr></thead>
              <tbody>
                {data.customers.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{padding: '10px', fontWeight: 'bold'}}>{c.name}</td>
                    <td style={{padding: '10px'}}>{c.phone}</td>
                    <td style={{padding: '10px'}}>{c.type}</td>
                    <td style={{padding: '10px'}}>
                      <button onClick={() => setModal({type: 'ledger', data: c})} style={styles.btnPrimary}>View Ledger</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PORTALS */}
        {page === 'portals' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Add Portal</h3>
              <form onSubmit={handleAddPortal}>
                <input type="text" placeholder="Portal Name" value={portalForm.name} onChange={(e) => setPortalForm({...portalForm, name: e.target.value})} required style={styles.input} />
                <input type="number" placeholder="Initial Balance" value={portalForm.balance} onChange={(e) => setPortalForm({...portalForm, balance: e.target.value})} style={styles.input} />
                <button type="submit" style={styles.btnPrimary}>Add</button>
              </form>
              <h3 style={{ color: '#1E3A8A', marginTop: '20px' }}>Recharge Portal</h3>
              <form onSubmit={handleRecharge}>
                <select name="portal" style={styles.input}>{data.portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select>
                <input type="number" name="amt" placeholder="Amount" required style={styles.input} />
                <input type="date" name="date" defaultValue={today} required style={styles.input} />
                <input type="text" name="desc" placeholder="Description" style={styles.input} />
                <select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select>
                <button type="submit" style={styles.btnSuccess}>Recharge</button>
              </form>
            </div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Portals List</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}><th style={{padding: '10px'}}>Name</th><th style={{padding: '10px'}}>Balance</th><th style={{padding: '10px'}}>Actions</th></tr></thead>
                <tbody>
                  {data.portals.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{padding: '10px', fontWeight: 'bold'}}>{p.name}</td>
                      <td style={{padding: '10px', color: p.current_balance < 0 ? '#EF4444' : '#059669'}}>{p.current_balance?.toFixed(2)}</td>
                      <td style={{padding: '10px'}}><button onClick={() => handleDelete('portals', p.id)} style={styles.btnDanger}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VENDORS */}
        {page === 'vendors' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Add Vendor</h3>
              <form onSubmit={handleAddVendor}>
                <input type="text" placeholder="Name" value={vendorForm.name} onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})} required style={styles.input} />
                <input type="text" placeholder="Phone" value={vendorForm.phone} onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})} style={styles.input} />
                <input type="number" placeholder="Balance" value={vendorForm.balance} onChange={(e) => setVendorForm({...vendorForm, balance: e.target.value})} style={styles.input} />
                <button type="submit" style={styles.btnPrimary}>Add</button>
              </form>
            </div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Vendors List</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}><th style={{padding: '10px'}}>Name</th><th style={{padding: '10px'}}>Phone</th><th style={{padding: '10px'}}>Balance</th></tr></thead>
                <tbody>
                  {data.vendors.map(v => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{padding: '10px', fontWeight: 'bold'}}>{v.name}</td>
                      <td style={{padding: '10px'}}>{v.phone}</td>
                      <td style={{padding: '10px'}}>{v.balance?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PACKAGES */}
        {page === 'packages' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Add Package</h3>
              <form onSubmit={handleAddPackage}>
                <input type="text" placeholder="Package Name" value={pkgForm.name} onChange={(e) => setPkgForm({...pkgForm, name: e.target.value})} required style={styles.input} />
                <input type="number" placeholder="Price" value={pkgForm.price} onChange={(e) => setPkgForm({...pkgForm, price: e.target.value})} required style={styles.input} />
                <input type="text" placeholder="Description" value={pkgForm.desc} onChange={(e) => setPkgForm({...pkgForm, desc: e.target.value})} style={styles.input} />
                <button type="submit" style={styles.btnPrimary}>Add</button>
              </form>
            </div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Packages List</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}><th style={{padding: '10px'}}>Name</th><th style={{padding: '10px'}}>Price</th><th style={{padding: '10px'}}>Desc</th></tr></thead>
                <tbody>
                  {data.packages.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{padding: '10px', fontWeight: 'bold'}}>{p.name}</td>
                      <td style={{padding: '10px'}}>{p.price?.toFixed(2)}</td>
                      <td style={{padding: '10px'}}>{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BRANCHES (ENHANCED) */}
        {page === 'branches' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Add Branch</h3>
              <form onSubmit={handleAddBranch}>
                <input type="text" placeholder={tr.name} value={brnForm.name} onChange={(e) => setBrnForm({...brnForm, name: e.target.value})} required style={styles.input} />
                <input type="text" placeholder={tr.location} value={brnForm.location} onChange={(e) => setBrnForm({...brnForm, location: e.target.value})} style={styles.input} />
                <input type="text" placeholder={tr.phone} value={brnForm.phone} onChange={(e) => setBrnForm({...brnForm, phone: e.target.value})} style={styles.input} />
                <input type="text" placeholder={tr.manager} value={brnForm.manager} onChange={(e) => setBrnForm({...brnForm, manager: e.target.value})} style={styles.input} />
                <input type="email" placeholder={tr.email} value={brnForm.email} onChange={(e) => setBrnForm({...brnForm, email: e.target.value})} style={styles.input} />
                <input type="text" placeholder={tr.timing} value={brnForm.timing} onChange={(e) => setBrnForm({...brnForm, timing: e.target.value})} style={styles.input} />
                <button type="submit" style={styles.btnPrimary}>Add</button>
              </form>
            </div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Branches List</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                  <th style={{padding: '10px'}}>{tr.name}</th><th style={{padding: '10px'}}>{tr.location}</th><th style={{padding: '10px'}}>{tr.manager}</th><th style={{padding: '10px'}}>{tr.email}</th>
                </tr></thead>
                <tbody>
                  {data.branches.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{padding: '10px', fontWeight: 'bold'}}>{b.name}</td>
                      <td style={{padding: '10px'}}>{b.location}</td>
                      <td style={{padding: '10px'}}>{b.manager || 'N/A'}</td>
                      <td style={{padding: '10px'}}>{b.email || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BANK & CASH (WITH INVESTOR TRANSFER) */}
        {page === 'bank' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={styles.card}><h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Cash Balance</h3><h2 style={{ color: cashBalance < 0 ? '#EF4444' : '#059669' }}>{cashBalance.toFixed(2)} SAR</h2></div>
              <div style={styles.card}><h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Bank Balance</h3><h2 style={{ color: bankBalance < 0 ? '#EF4444' : '#059669' }}>{bankBalance.toFixed(2)} SAR</h2></div>
              <div style={styles.card}><h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Investor Balance</h3><h2 style={{ color: investorBalance < 0 ? '#EF4444' : '#059669' }}>{investorBalance.toFixed(2)} SAR</h2></div>
            </div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Fund Transfer</h3>
              <form onSubmit={handleTransfer} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <select value={transferForm.from} onChange={(e) => setTransferForm({...transferForm, from: e.target.value})} style={styles.input}><option>Cash</option><option>Bank</option><option>Investor</option></select>
                <select value={transferForm.to} onChange={(e) => setTransferForm({...transferForm, to: e.target.value})} style={styles.input}><option>Bank</option><option>Cash</option><option>Investor</option></select>
                <input type="number" placeholder={tr.amount} value={transferForm.amount} onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})} required style={styles.input} />
                <input type="date" value={transferForm.date} onChange={(e) => setTransferForm({...transferForm, date: e.target.value})} style={styles.input} />
                <button type="submit" style={{...styles.btnPrimary, width: 'auto'}}>Transfer</button>
              </form>
            </div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Cashbook Entries</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}><th style={{padding: '10px'}}>Date</th><th style={{padding: '10px'}}>Type</th><th style={{padding: '10px'}}>Desc</th><th style={{padding: '10px'}}>Amount</th></tr></thead>
                <tbody>
                  {data.cashbook.slice(0, 20).map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{padding: '10px'}}>{c.trans_date}</td>
                      <td style={{padding: '10px', color: c.type.includes('In') ? '#059669' : '#EF4444'}}>{c.type}</td>
                      <td style={{padding: '10px'}}>{c.description}</td>
                      <td style={{padding: '10px', fontWeight: 'bold'}}>{c.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVESTORS (INVEST) */}
        {page === 'invest' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Add New Investor</h3>
              <form onSubmit={handleAddInvestment}>
                <input type="text" placeholder={tr.investor_name} value={investForm.name} onChange={(e) => setInvestForm({...investForm, name: e.target.value})} required style={styles.input} />
                <input type="number" placeholder={tr.amount} value={investForm.amount} onChange={(e) => setInvestForm({...investForm, amount: e.target.value})} required style={styles.input} />
                <input type="date" value={investForm.date} onChange={(e) => setInvestForm({...investForm, date: e.target.value})} style={styles.input} />
                <input type="text" placeholder={tr.desc} value={investForm.desc} onChange={(e) => setInvestForm({...investForm, desc: e.target.value})} style={styles.input} />
                <select value={investForm.mode} onChange={(e) => setInvestForm({...investForm, mode: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option></select>
                <button type="submit" style={styles.btnPrimary}>Add Investor</button>
              </form>
            </div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Investors List</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}><th style={{padding: '10px'}}>Date</th><th style={{padding: '10px'}}>Name</th><th style={{padding: '10px'}}>Amount</th><th style={{padding: '10px'}}>Mode</th></tr></thead>
                <tbody>
                  {data.investments.map(i => (
                    <tr key={i.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{padding: '10px'}}>{i.invest_date}</td>
                      <td style={{padding: '10px', fontWeight: 'bold'}}>{i.investor_name}</td>
                      <td style={{padding: '10px', color: '#059669'}}>{i.amount?.toFixed(2)}</td>
                      <td style={{padding: '10px'}}>{i.payment_mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HR & ACCOUNTS */}
        {page === 'hr' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Add Employee</h3>
                <form onSubmit={handleAddEmployee}>
                  <input type="text" placeholder={tr.name} value={empForm.name} onChange={(e) => setEmpForm({...empForm, name: e.target.value})} required style={styles.input} />
                  <select value={empForm.role} onChange={(e) => setEmpForm({...empForm, role: e.target.value})} style={styles.input}><option>Sales</option><option>Manager</option><option>Accountant</option></select>
                  <button type="submit" style={styles.btnPrimary}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Pay Salary</h3>
                <form onSubmit={handlePaySalary}>
                  <select name="emp" style={styles.input}>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                  <input type="number" name="amt" placeholder={tr.amount} required style={styles.input} />
                  <input type="text" name="month" placeholder={tr.month} required style={styles.input} />
                  <select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select>
                  <button type="submit" style={styles.btnSuccess}>Pay</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Add Expense</h3>
                <form onSubmit={handleAddExpense}>
                  <input type="text" name="cat" placeholder={tr.category} required style={styles.input} />
                  <input type="number" name="amt" placeholder={tr.amount} required style={styles.input} />
                  <input type="text" name="desc" placeholder={tr.desc} style={styles.input} />
                  <select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select>
                  <button type="submit" style={styles.btnDanger}>Add Expense</button>
                </form>
              </div>
            </div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Recent Salaries & Expenses</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}><th style={{padding: '10px'}}>Type</th><th style={{padding: '10px'}}>Desc</th><th style={{padding: '10px'}}>Amount</th></tr></thead>
                <tbody>
                  {data.payroll.map(p => (<tr key={p.id} style={{ borderBottom: '1px solid #eee' }}><td style={{padding: '10px'}}>Salary</td><td style={{padding: '10px'}}>{p.employees?.name} - {p.month}</td><td style={{padding: '10px'}}>{p.amount.toFixed(2)}</td></tr>))}
                  {data.expenses.map(e => (<tr key={e.id} style={{ borderBottom: '1px solid #eee' }}><td style={{padding: '10px'}}>Expense</td><td style={{padding: '10px'}}>{e.category} - {e.description}</td><td style={{padding: '10px'}}>{e.amount.toFixed(2)}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USER MANAGEMENT */}
        {page === 'users' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Add New User</h3>
              <form onSubmit={handleAddUser}>
                <input type="email" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} required style={styles.input} />
                <input type="text" placeholder="Username" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} required style={styles.input} />
                <select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})} style={styles.input}>
                  <option>Admin</option><option>Owner</option><option>Sales</option><option>Accountant</option><option>HR</option>
                </select>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <input type="checkbox" checked={userForm.is_admin} onChange={(e) => setUserForm({...userForm, is_admin: e.target.checked})} id="is_admin" />
                  <label htmlFor="is_admin" style={{ fontSize: '14px' }}>Is Admin (Full Access)</label>
                </div>
                <button type="submit" style={styles.btnPrimary}>Add User</button>
              </form>
            </div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>System Users</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                  <th style={{padding: '10px'}}>Username</th><th style={{padding: '10px'}}>Email</th><th style={{padding: '10px'}}>Role</th><th style={{padding: '10px'}}>Actions</th>
                </tr></thead>
                <tbody>
                  {data.appUsers.map(usr => (
                    <tr key={usr.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{padding: '10px', fontWeight: 'bold'}}>{usr.username}</td>
                      <td style={{padding: '10px'}}>{usr.email}</td>
                      <td style={{padding: '10px'}}><span style={{ background: '#e0e7ff', color: '#1E3A8A', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>{usr.role}</span></td>
                      <td style={{padding: '10px'}}>
                        <button onClick={() => handleDelete('app_users', usr.id)} style={styles.btnDanger}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {page === 'reports' && (
          <div style={styles.card}>
            <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Financial Reports</h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input type="date" value={repDate.from} onChange={(e) => setRepDate({...repDate, from: e.target.value})} style={styles.input} />
              <input type="date" value={repDate.to} onChange={(e) => setRepDate({...repDate, to: e.target.value})} style={styles.input} />
              <select value={reportTab} onChange={(e) => setReportTab(e.target.value)} style={styles.input}>
                <option value="sales">Sales</option><option value="refunds">Refunds</option><option value="recharges">Recharges</option><option value="cashbook">Cashbook</option><option value="investments">Investments</option><option value="payroll">Payroll</option><option value="expenses">Expenses</option>
              </select>
              <button onClick={() => exportCSV(currentReportData(), `${reportTab}_report.csv`)} style={{...styles.btnSuccess, width: 'auto'}}>Export CSV</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                {currentReportData().length > 0 && Object.keys(currentReportData()[0]).map(k => <th key={k} style={{padding: '10px'}}>{k}</th>)}
              </tr></thead>
              <tbody>
                {currentReportData().slice(0, 20).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    {Object.values(row).map((val, j) => <td key={j} style={{padding: '10px'}}>{typeof val === 'object' ? val?.name || JSON.stringify(val) : val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AUDIT LOGS */}
        {page === 'audit' && (
          <div style={styles.card}>
            <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Audit Logs</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}><th style={{padding: '10px'}}>Date</th><th style={{padding: '10px'}}>User</th><th style={{padding: '10px'}}>Action</th></tr></thead>
              <tbody>
                {data.audits.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{padding: '10px'}}>{new Date(a.created_at).toLocaleString()}</td>
                    <td style={{padding: '10px', fontWeight: 'bold'}}>{a.user_email}</td>
                    <td style={{padding: '10px'}}>{a.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SETTINGS */}
        {page === 'settings' && (
          <div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Owner Profile & Settings</h3>
              <form onSubmit={handleUpdateOwnerProfile}>
                <label style={styles.label}>Update Email (Requires Auth Confirmation)</label>
                <input type="email" value={userProfile.email || ''} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} style={styles.input} />
                <label style={styles.label}>Update Username</label>
                <input type="text" value={userProfile.username || ''} onChange={(e) => setUserProfile({...userProfile, username: e.target.value})} style={styles.input} />
                <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '10px 30px'}}>Save Profile</button>
              </form>
            </div>
            
            <div style={styles.card}>
              <h3 style={{ color: '#1E3A8A' }}>Company Settings</h3>
              <form onSubmit={handleSaveSettings}>
                <input type="text" placeholder="Company Name (EN)" value={setForm.company_name_en || ''} onChange={(e) => setSetForm({...setForm, company_name_en: e.target.value})} style={styles.input} />
                <input type="text" placeholder="Company Name (AR)" value={setForm.company_name_ar || ''} onChange={(e) => setSetForm({...setForm, company_name_ar: e.target.value})} style={styles.input} />
                <input type="text" placeholder="VAT No" value={setForm.vat_no || ''} onChange={(e) => setSetForm({...setForm, vat_no: e.target.value})} style={styles.input} />
                <input type="text" placeholder="CR No" value={setForm.cr_no || ''} onChange={(e) => setSetForm({...setForm, cr_no: e.target.value})} style={styles.input} />
                <input type="text" placeholder="IATA No" value={setForm.iata_no || ''} onChange={(e) => setSetForm({...setForm, iata_no: e.target.value})} style={styles.input} />
                <input type="text" placeholder="Phone" value={setForm.phone || ''} onChange={(e) => setSetForm({...setForm, phone: e.target.value})} style={styles.input} />
                <input type="text" placeholder="Invoice Footer" value={setForm.invoice_footer || ''} onChange={(e) => setSetForm({...setForm, invoice_footer: e.target.value})} style={styles.input} />
                <label style={styles.label}>Upload Logo</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ marginBottom: '10px' }} />
                {setForm.logo_url && <img src={setForm.logo_url} alt="Logo" style={{ height: '80px', marginBottom: '10px' }} />}
                <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '10px 30px'}}>Save Settings</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
