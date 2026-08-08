import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function useERP() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({ email: '', username: '', role: 'Owner', is_admin: true, can_access_invoices: true, can_access_bank: true, can_access_hr: true, can_access_reports: true, can_access_settings: true });
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [payFilter, setPayFilter] = useState('All');
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });
  const [passForm, setPassForm] = useState({ newPass: '' });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك؟' }]);
  const [chatInput, setChatInput] = useState('');
  const [search, setSearch] = useState('');
  const [tblPage, setTblPage] = useState(1);
  const itemsPerPage = 10;
  const [ledgerCustId, setLedgerCustId] = useState(''); 
  const [previewHTML, setPreviewHTML] = useState(''); 
  const [data, setData] = useState({ invoices: [], portals: [], customers: [], corporates: [], creditors: [], recharges: [], settings: {}, employees: [], payroll: [], appUsers: [], expenses: [], services: [], cashbook: [], audits: [], investments: [], vendors: [], customFields: [], packages: [], branches: [] });
  const today = new Date().toISOString().split('T')[0];
  
  const [editInvId, setEditInvId] = useState(null);
  const [invForm, setInvForm] = useState({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '' });
  
  const [expForm, setExpForm] = useState({ vendor_name: '', vendor_vat: '', expense_date: today, expense_type: 'Office Supplies', payment_mode: 'Cash', items: [{ name: '', qty: 1, price: 0 }], taxRate: '15', desc: '' });

  const [editCorpId, setEditCorpId] = useState(null); const [corpForm, setCorpForm] = useState({ name: '', vat_no: '', phone: '', address: '' });
  const [editCredId, setEditCredId] = useState(null); const [creditorForm, setCreditorForm] = useState({ name: '', phone: '', address: '' });
  const [editCustId, setEditCustId] = useState(null); const [custForm, setCustForm] = useState({ name: '', phone: '', store_credit: 0 });
  const [editVendId, setEditVendId] = useState(null); const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [editPkgId, setEditPkgId] = useState(null); const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '', duration: '', inclusions: '' });
  const [editBrnId, setEditBrnId] = useState(null); const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
  const [editEmpId, setEditEmpId] = useState(null); const [empForm, setEmpForm] = useState({ name: '', role: 'Sales', salary: 0, phone: '' });
  const [editSrvId, setEditSrvId] = useState(null); const [srvForm, setSrvForm] = useState({ name: '' });
  const [editUserId, setEditUserId] = useState(null); 
  
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, desc: '', mode: 'Cash', reason: 'Other', otherReason: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '' });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: '', date: today });
  const [repDate, setRepDate] = useState({ from: '', to: '' }); const [reportTab, setReportTab] = useState('sales'); const [statementTab, setStatementTab] = useState('sales');
  const [setForm, setSetForm] = useState({ company_name_en: 'SUEUD AL TAAYIRA', company_name_ar: 'صعود الطائرة للسفر السياحة', vat_no: '', cr_no: '', iata_no: '', phone: '', address_ar: 'طريق ملك عبدالعزيز عرعر', license_no: '', tourist_license_no: '', logo_url: '', invoice_footer: 'Thank you for choosing us!' });
  const [userForm, setUserForm] = useState({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false });
  const [portalForm, setPortalForm] = useState({ name: '', balance: 0 });

  const t = { en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices List', refunds: 'Refund Invoices', customers: 'Customer List', corporates: 'Corporate Accounts', creditors: 'Creditors', portals: 'Portals & Recharge', bank: 'Bank & Cash', invest: 'Investors', hr: 'HR & Accounts', users: 'User Management', reports: 'Financial Reports', audit: 'Audit Logs', settings: 'Settings', vendors: 'Vendors (B2B)', packages: 'Tour Packages', branches: 'Branches', logout: 'Logout', search: 'Search...', changePass: 'Change Password', statements: 'Statements', download_excel: 'Download Excel', credit: 'Credit Balances' }, ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'قائمة الفواتير', refunds: 'فواتير الاسترجاع', customers: 'قائمة العملاء', corporates: 'حسابات الشركات', creditors: 'الدائنون', portals: 'البوابات والرصيد', bank: 'البنك والكاش', invest: 'المستثمرون', hr: 'الموارد البشرية', users: 'إدارة المستخدمين', reports: 'التقارير المالية', audit: 'سجلات التدقيق', settings: 'الإعدادات', vendors: 'الموردون', packages: 'باقات سياحية', branches: 'الفروع', logout: 'تسجيل الخروج', search: 'بحث...', changePass: 'تغيير كلمة المرور', statements: 'كشوف الحسابات', download_excel: 'تحميل إكسل', credit: 'أرصدة الائتمان' } };
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
    const inv = await supabase.from('invoices').select(`*, customers(name, type, phone, store_credit), corporates(name, vat_no), portals(name), employees(name), creditors(name)`).order('created_at', { ascending: false });
    const por = await supabase.from('portals').select('*');
    const cus = await supabase.from('customers').select('*').eq('type', 'Individual').order('name', { ascending: true });
    const corp = await supabase.from('corporates').select('*').order('name', { ascending: true });
    const crd = await supabase.from('creditors').select('*').order('name', { ascending: true });
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
    const pkgs = await supabase.from('packages').select('*');
    const brns = await supabase.from('branches').select('*');
    
    const portalsData = por.data || [];
    const settingsData = set.data || {};
    setData({ invoices: inv.data || [], portals: portalsData, customers: cus.data || [], corporates: corp.data || [], creditors: crd.data || [], recharges: rec.data || [], settings: settingsData, employees: emp.data || [], payroll: pay.data || [], appUsers: usr.data || [], expenses: exp.data || [], services: srv.data || [], cashbook: cbk.data || [], audits: aud.data || [], investments: invstmnt.data || [], vendors: vnd.data || [], customFields: [], packages: pkgs.data || [], branches: brns.data || [] });
    
    if (portalsData.length > 0) setInvForm(f => ({ ...f, portalId: f.portalId || portalsData[0].id }));
    if (settingsData) setSetForm(settingsData);
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };
  const handleChangePassword = async (e) => { e.preventDefault(); const { error } = await supabase.auth.updateUser({ password: passForm.newPass }); if (error) return showToast('Error: ' + error.message); showToast('Password Updated!'); setModal({ type: null, data: null }); setPassForm({ newPass: '' }); };
  const handleSendMessage = () => { if (!chatInput.trim()) return; setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]); setChatInput(''); setTimeout(() => { setChatMessages(prev => [...prev, { sender: 'bot', text: "I can help with Invoices. (يمكنني المساعدة في الفواتير)" }]); }, 600); };

  const handleEditInvoice = (inv) => {
    setEditInvId(inv.id);
    setInvForm({
      custType: inv.customer_id ? 'Individual' : 'Corporate',
      custId: inv.customer_id || 'new',
      corpId: inv.corporate_id || 'new',
      portalId: inv.portal_id,
      service: inv.service_type,
      flightType: inv.flight_type || 'Domestic',
      flightJourney: inv.flight_journey || 'Single',
      refundable: inv.refundable_status || 'Refundable',
      bookingType: inv.booking_type || 'New Booking',
      linkedInvId: inv.linked_inv_id || '',
      flightSector: inv.flight_sector || '',
      airline: inv.airline || '',
      pnr: inv.pnr || '',
      ticketNo: inv.ticket_no || '',
      qty: inv.qty || 1,
      cost: (inv.total_cost || 0) / (inv.qty || 1),
      sell: ((inv.total_sell || 0) + (inv.discount || 0)) / (inv.qty || 1),
      discount: inv.discount || 0,
      taxRate: inv.vat > 0 ? '15' : '0',
      payment: inv.payment_method,
      paid: (inv.paid_amount || 0) - (inv.used_credit || 0),
      useCredit: inv.used_credit || 0,
      invoiceDate: inv.invoice_date || today,
      employeeId: inv.employee_id || '',
      passengers: inv.passenger_names ? inv.passenger_names.split('\n') : ['']
    });
    setPage('create');
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
      
      const cashPaid = parseFloat(invForm.paid) || 0;
      const usedCredit = parseFloat(invForm.useCredit) || 0;
      const totalPaid = cashPaid + usedCredit;
      const due = total - totalPaid; 
      const profit = sell - cost; 
      
      let cid = null, corpId = null;
      
      if (invForm.custType === 'Individual') { 
        if (invForm.custId === 'new') { 
          const { data: nC, error: cErr } = await supabase.from('customers').insert([{ name: invForm.custName, phone: invForm.custPhone, type: 'Individual' }]).select().single(); 
          if (cErr) throw new Error('Customer creation failed: ' + cErr.message);
          cid = nC.id; 
        } else { cid = invForm.custId; } 
      } else { 
        if (invForm.corpId === 'new') { 
          const { data: nCorp, error: corpErr } = await supabase.from('corporates').insert([{ name: invForm.corpName, vat_no: invForm.corpVat, phone: invForm.corpPhone, address: invForm.corpAddress }]).select().single(); 
          if (corpErr) throw new Error('Corporate creation failed: ' + corpErr.message);
          corpId = nCorp.id; 
        } else { corpId = invForm.corpId; } 
      }
      
      const portal = data.portals.find(p => p.id === invForm.portalId); 
      if (!portal) throw new Error("Please select a Portal");
      
      let desc = invForm.service === 'Flight Ticket' ? `${invForm.airline} - ${invForm.flightSector}` : invForm.service; 
      const passengerNames = invForm.passengers.filter(p => p).join('\n');
      
      const payload = { 
        customer_id: cid, corporate_id: corpId, portal_id: portal.id, employee_id: invForm.employeeId || null, 
        booking_date: invForm.bookingDate, invoice_date: invForm.invoiceDate, service_type: invForm.service, 
        flight_type: invForm.flightType, flight_journey: invForm.flightJourney, refundable_status: invForm.refundable,
        booking_type: invForm.bookingType, linked_inv_id: invForm.linkedInvId || null,
        pnr: invForm.pnr, ticket_no: invForm.ticketNo, sector: desc, qty: qty, 
        discount: discount, passenger_names: passengerNames || null, airline: invForm.airline || null, 
        flight_sector: invForm.flightSector || null, total_cost: cost, total_sell: sell, profit, vat, total, 
        paid_amount: totalPaid, used_credit: usedCredit, due_amount: due, payment_method: invForm.payment, 
        credit_due_date: due > 0 && invForm.payment === 'Credit' ? invForm.creditDueDate : null, 
        creditor_id: invForm.payment === 'Credit' ? (invForm.creditorId || null) : null
      };
      
      if (editInvId) {
        const { data: upInv, error: upErr } = await supabase.from('invoices').update(payload).eq('id', editInvId).select(`*, customers(name), corporates(name), employees(name)`).single();
        if (upErr) throw new Error('Invoice update failed: ' + upErr.message);
        setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === editInvId ? upInv : i) }));
        showToast('Invoice Updated!'); setEditInvId(null);
      } else {
        const invNo = `INV-${Date.now()}`;
        const { data: newInv, error: invErr } = await supabase.from('invoices').insert([{ invoice_no: invNo, ...payload }]).select(`*, customers(name), corporates(name), employees(name)`).single();
        if (invErr) throw new Error('Invoice creation failed: ' + invErr.message);
        
        const newPortalBal = (portal.current_balance || 0) - cost; 
        await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', portal.id); 
        
        await logAction(`Created Invoice ${invNo}`);
        let newCashEntry = null; 
        if (cashPaid > 0 && invForm.payment !== 'Credit') { 
          const cbType = invForm.payment === 'Cash' ? 'Cash-In' : 'Bank-In'; 
          const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: invForm.invoiceDate, type: cbType, description: `Payment for ${invNo}`, amount: cashPaid }]).select().single(); 
          newCashEntry = nC; 
        }
        setData(prev => ({ ...prev, invoices: [newInv, ...prev.invoices], portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: newPortalBal } : p), cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook }));
        showToast('Invoice Generated!');
      }
      
      setInvForm({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: data.portals[0]?.id || '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '' }); 
      setPage('list');
    } catch (err) { 
      showToast('Error: ' + err.message); 
    }
  };

  const handleDeleteInvoice = async (inv) => {
    if (!confirm('Delete this invoice permanently?')) return;
    const portal = data.portals.find(p => p.id === inv.portal_id);
    if (portal) {
      const newBal = (portal.current_balance || 0) + (inv.total_cost || 0);
      await supabase.from('portals').update({ current_balance: newBal }).eq('id', portal.id);
    }
    await supabase.from('invoices').delete().eq('id', inv.id);
    setData(prev => ({ ...prev, invoices: prev.invoices.filter(i => i.id !== inv.id), portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: (p.current_balance || 0) + (inv.total_cost || 0) } : p) }));
    showToast('Invoice Deleted!');
  };

  const handleAddExpItem = () => setExpForm(prev => ({ ...prev, items: [...prev.items, { name: '', qty: 1, price: 0 }] }));
  const handleRemoveExpItem = (index) => setExpForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  const handleExpItemChange = (index, field, value) => {
    setExpForm(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const subTotal = expForm.items.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);
      const taxRate = parseFloat(expForm.taxRate) || 0;
      const vat = subTotal * (taxRate / 100);
      const totalAmount = subTotal + vat;

      const expNo = `EXP-${Date.now()}`;
      const { data: newExp, error: expErr } = await supabase.from('expenses').insert([{
        invoice_no: expNo, vendor_name: expForm.vendor_name, vendor_vat: expForm.vendor_vat,
        expense_date: expForm.expense_date, expense_type: expForm.expense_type,
        item_name: expForm.items.map(i => i.name).join(', '), items: expForm.items,
        amount: totalAmount, description: expForm.desc, payment_mode: expForm.payment_mode
      }]).select().single();
      if (expErr) throw expErr;

      const cbType = expForm.payment_mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
      const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: expForm.expense_date || today, type: cbType, description: `Expense: ${expForm.vendor_name} (${expNo})`, amount: totalAmount }]).select().single();
      if (cbErr) throw cbErr;

      setData(prev => ({ ...prev, expenses: [newExp, ...prev.expenses], cashbook: [nC, ...prev.cashbook] }));
      showToast('Expense Added!');
      setExpForm({ vendor_name: '', vendor_vat: '', expense_date: today, expense_type: 'Office Supplies', payment_mode: 'Cash', items: [{ name: '', qty: 1, price: 0 }], taxRate: '15', desc: '' });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleAddEditCust = async (e) => { 
    e.preventDefault(); 
    const pl = { name: custForm.name, phone: custForm.phone, store_credit: parseFloat(custForm.store_credit) || 0 }; 
    try {
      if (editCustId) { 
        const { data: up, error } = await supabase.from('customers').update(pl).eq('id', editCustId).select().single(); 
        if (error) throw error;
        setData(prev => ({...prev, customers: prev.customers.map(c => c.id === editCustId ? up : c)})); 
        showToast('Updated!'); setEditCustId(null); 
      } else { 
        const { data: nItem, error } = await supabase.from('customers').insert([{...pl, type: 'Individual'}]).select().single(); 
        if (error) throw error;
        setData(prev => ({...prev, customers: [...prev.customers, nItem]})); 
        showToast('Added!'); 
      } 
      setCustForm({ name: '', phone: '', store_credit: 0 }); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleAddEditCorp = async (e) => { 
    e.preventDefault(); 
    try {
      if (editCorpId) { 
        const { data: up, error } = await supabase.from('corporates').update(corpForm).eq('id', editCorpId).select().single(); 
        if (error) throw error;
        setData(prev => ({...prev, corporates: prev.corporates.map(c => c.id === editCorpId ? up : c)})); 
        showToast('Updated!'); setEditCorpId(null); 
      } else { 
        const { data: nItem, error } = await supabase.from('corporates').insert([corpForm]).select().single(); 
        if (error) throw error;
        setData(prev => ({...prev, corporates: [...prev.corporates, nItem]})); 
        showToast('Added!'); 
      } 
      setCorpForm({ name: '', vat_no: '', phone: '', address: '' }); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleAddEditCred = async (e) => { 
    e.preventDefault(); 
    try {
      if (editCredId) { 
        const { data: up, error } = await supabase.from('creditors').update(creditorForm).eq('id', editCredId).select().single(); 
        if (error) throw error;
        setData(prev => ({...prev, creditors: prev.creditors.map(c => c.id === editCredId ? up : c)})); 
        showToast('Updated!'); setEditCredId(null); 
      } else { 
        const { data: nItem, error } = await supabase.from('creditors').insert([creditorForm]).select().single(); 
        if (error) throw error;
        setData(prev => ({...prev, creditors: [...prev.creditors, nItem]})); 
        showToast('Added!'); 
      } 
      setCreditorForm({ name: '', phone: '', address: '' }); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleAddEditVend = async (e) => { 
    e.preventDefault(); 
    try {
      if (editVendId) { 
        const { data: up, error } = await supabase.from('vendors').update(vendorForm).eq('id', editVendId).select().single(); 
        if (error) throw error;
        setData(prev => ({...prev, vendors: prev.vendors.map(c => c.id === editVendId ? up : c)})); 
        showToast('Updated!'); setEditVendId(null); 
      } else { 
        const { data: nItem, error } = await supabase.from('vendors').insert([vendorForm]).select().single(); 
        if (error) throw error;
        setData(prev => ({...prev, vendors: [...prev.vendors, nItem]})); 
        showToast('Added!'); 
      } 
      setVendorForm({ name: '', phone: '', balance: 0 }); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleAddEditEmp = async (e) => { 
    e.preventDefault(); 
    try {
      if (editEmpId) { 
        const { data: up, error } = await supabase.from('employees').update(empForm).eq('id', editEmpId).select().single(); 
        if (error) throw error;
        setData(prev => ({...prev, employees: prev.employees.map(c => c.id === editEmpId ? up : c)})); 
        showToast('Updated!'); setEditEmpId(null); 
      } else { 
        const { data: nItem, error } = await supabase.from('employees').insert([empForm]).select().single(); 
        if (error) throw error;
        setData(prev => ({...prev, employees: [nItem, ...prev.employees]})); 
        showToast('Added!'); 
      } 
      setEmpForm({ name: '', role: 'Sales', salary: 0, phone: '' }); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleAddPortal = async (e) => { 
    e.preventDefault(); 
    try {
      const { data: newItem, error } = await supabase.from('portals').insert([{ name: portalForm.name, current_balance: parseFloat(portalForm.balance) || 0 }]).select().single(); 
      if (error) throw error;
      setData(prev => ({ ...prev, portals: [...prev.portals, newItem] })); 
      showToast('Portal Added!'); setPortalForm({ name: '', balance: 0 }); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleAddInvestment = async (e) => { 
    e.preventDefault(); 
    try {
      const mode = investForm.mode; 
      const { data: newInv, error: invErr } = await supabase.from('investments').insert([{ investor_name: investForm.name, amount: parseFloat(investForm.amount), invest_date: investForm.date, description: investForm.desc, payment_mode: mode }]).select().single(); 
      if (invErr) throw invErr;
      const cbType = mode === 'Cash' ? 'Cash-In' : 'Bank-In'; 
      const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: investForm.date, type: cbType, description: `Investment by ${investForm.name}`, amount: parseFloat(investForm.amount) }]).select().single(); 
      if (cbErr) throw cbErr;
      setData(prev => ({ ...prev, investments: [newInv, ...prev.investments], cashbook: [nC, ...prev.cashbook] })); 
      showToast('Investor Added!'); 
      setInvestForm({ name: '', amount: '', date: today, desc: '', mode: 'Cash', reason: 'Other', otherReason: '' }); 
    } catch (err) { showToast('Error: ' + err.message); }
  };
  
  const handleDelete = async (table, id) => { 
    if (!confirm('Delete permanently?')) return; 
    try {
      const { error } = await supabase.from(table).delete().eq('id', id); 
      if (error) throw error;
      setData(prev => ({ ...prev, [table]: prev[table].filter(item => item.id !== id) })); 
      showToast('Deleted!'); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleRecharge = async (e) => { 
    e.preventDefault(); 
    try {
      const p = data.portals.find(p => p.id === e.target.portal.value); 
      const amount = parseFloat(e.target.amt.value); 
      const mode = e.target.mode.value; 
      const { data: newRec, error: recErr } = await supabase.from('recharges').insert([{ portal_id: p.id, amount, recharge_date: e.target.date.value, description: e.target.desc.value, payment_mode: mode }]).select('*, portals(name)').single(); 
      if (recErr) throw recErr;
      const newBal = (p.current_balance || 0) + amount; 
      await supabase.from('portals').update({ current_balance: newBal }).eq('id', p.id); 
      const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out'; 
      const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: e.target.date.value, type: cbType, description: `Recharge for ${p.name}`, amount }]).select().single(); 
      if (cbErr) throw cbErr;
      setData(prev => ({ ...prev, recharges: [newRec, ...prev.recharges], portals: prev.portals.map(por => por.id === p.id ? { ...por, current_balance: newBal } : por), cashbook: [nC, ...prev.cashbook] })); 
      showToast('Recharged!'); e.target.reset(); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleTransfer = async (e) => { 
    e.preventDefault(); 
    try {
      const amt = parseFloat(transferForm.amount); 
      if (amt <= 0 || transferForm.from === transferForm.to) return showToast("Invalid transfer"); 
      const entries = []; 
      if (transferForm.from === 'Cash') entries.push({ trans_date: transferForm.date, type: 'Cash-Out', description: `Transfer to ${transferForm.to}`, amount: amt }); 
      if (transferForm.from === 'Bank') entries.push({ trans_date: transferForm.date, type: 'Bank-Out', description: `Transfer to ${transferForm.to}`, amount: amt }); 
      if (transferForm.to === 'Cash') entries.push({ trans_date: transferForm.date, type: 'Cash-In', description: `Transfer from ${transferForm.from}`, amount: amt }); 
      if (transferForm.to === 'Bank') entries.push({ trans_date: transferForm.date, type: 'Bank-In', description: `Transfer from ${transferForm.from}`, amount: amt }); 
      const { error } = await supabase.from('cashbook').insert(entries); 
      if (error) throw error;
      await fetchAll(); 
      showToast('Fund Transferred!'); 
      setTransferForm({ from: 'Cash', to: 'Bank', amount: '', date: today }); 
    } catch (err) { showToast('Error: ' + err.message); }
  };
  
  const handleAddUser = async (e) => { 
    e.preventDefault(); 
    try {
      const { data: newUser, error } = await supabase.from('app_users').insert([{ email: userForm.email, username: userForm.username, role: userForm.role, ...userForm }]).select().single(); 
      if (error) throw error;
      setData(prev => ({ ...prev, appUsers: [newUser, ...prev.appUsers] })); 
      showToast('User Added!'); 
      setUserForm({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false }); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleEditUser = (u) => { setEditUserId(u.id); setUserForm({ email: u.email, username: u.username, role: u.role, is_admin: u.is_admin, can_access_invoices: u.can_access_invoices, can_access_bank: u.can_access_bank, can_access_hr: u.can_access_hr, can_access_reports: u.can_access_reports, can_access_settings: u.can_access_settings }); };

  const handleUpdateUser = async (e) => { 
    e.preventDefault(); 
    try {
      const { data: upUser, error } = await supabase.from('app_users').update(userForm).eq('id', editUserId).select().single(); 
      if (error) throw error;
      setData(prev => ({ ...prev, appUsers: prev.appUsers.map(u => u.id === editUserId ? upUser : u) })); 
      showToast('User Updated!'); 
      setEditUserId(null); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handlePaySalary = async (e) => { 
    e.preventDefault(); 
    try {
      const empId = e.target.emp.value; 
      const amount = parseFloat(e.target.amt.value); 
      const mode = e.target.mode.value; 
      const emp = data.employees.find(em => em.id === empId); 
      const { data: newPay, error: payErr } = await supabase.from('payroll').insert([{ employee_id: empId, amount, month: e.target.month.value, payment_mode: mode }]).select('*, employees(name)').single(); 
      if (payErr) throw payErr;
      const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out'; 
      const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Salary to ${emp.name}`, amount }]).select().single(); 
      if (cbErr) throw cbErr;
      setData(prev => ({ ...prev, payroll: [newPay, ...prev.payroll], cashbook: [nC, ...prev.cashbook] })); 
      showToast('Salary Paid!'); e.target.reset(); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleSettlePayment = async (e) => { 
    e.preventDefault(); 
    try {
      const inv = data.invoices.find(i => i.id === settleForm.id); 
      if (!inv) return; 
      const newPaid = (inv.paid_amount || 0) + (inv.due_amount || 0); 
      const { data: upInv, error: invErr } = await supabase.from('invoices').update({ paid_amount: newPaid, due_amount: 0, payment_method: settleForm.mode }).eq('id', inv.id).select(`*, customers(name)`).single(); 
      if (invErr) throw invErr;
      const cbType = settleForm.mode === 'Cash' ? 'Cash-In' : 'Bank-In'; 
      const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: settleForm.date, type: cbType, description: `Settlement for ${inv.invoice_no}`, amount: inv.due_amount }]).select().single(); 
      if (cbErr) throw cbErr;
      setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i), cashbook: [nC, ...prev.cashbook] })); 
      showToast('Payment Settled!'); setModal({ type: null, data: null }); 
    } catch (err) { showToast('Error: ' + err.message); }
  };
  
  const handleRefund = async (e) => { 
    e.preventDefault(); 
    try {
      const inv = data.invoices.find(i => i.id === refundForm.id); 
      if (!inv) return; 
      const compRef = parseFloat(refundForm.compRefund) || 0; 
      const custRef = parseFloat(refundForm.custRefund) || 0; 
      
      const { data: upInv, error: invErr } = await supabase.from('invoices').update({ status: 'refunded', refund_company: compRef, refund_customer: custRef }).eq('id', inv.id).select(`*, customers(name), employees(name)`).single(); 
      if (invErr) throw invErr;
      
      const refNo = `REF-${Date.now()}`; 
      const { data: newRefInv, error: refErr } = await supabase.from('invoices').insert([{ 
        invoice_no: refNo, customer_id: inv.customer_id, portal_id: inv.portal_id, booking_date: today, 
        invoice_date: refundForm.date, service_type: inv.service_type, employee_id: inv.employee_id, 
        airline: inv.airline, flight_sector: inv.flight_sector, pnr: inv.pnr, ticket_no: inv.ticket_no, passenger_names: inv.passenger_names,
        total_sell: -custRef, total: -custRef, paid_amount: -custRef, status: 'refunded', refund_company: compRef, refund_customer: custRef, refund_reason: refundForm.reason
      }]).select(`*, customers(name), employees(name)`).single(); 
      if (refErr) throw refErr;
      
      if (inv.portal_id && compRef > 0) { 
        const portal = data.portals.find(p => p.id === inv.portal_id);
        const newPortalBal = (portal.current_balance || 0) + compRef; 
        await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', inv.portal_id); 
        setData(prev => ({ ...prev, portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: newPortalBal } : p) }));
      } 
      
      let newCashEntry = null; 
      if (custRef > 0) {
        const cbType = refundForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out'; 
        const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: refundForm.date, type: cbType, description: `Refund for ${inv.invoice_no}`, amount: custRef }]).select().single(); 
        newCashEntry = nC; 
      } 
      
      setData(prev => ({ 
        ...prev, 
        invoices: [newRefInv, prev.invoices.map(i => i.id === inv.id ? upInv : i)].flat(), 
        cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook 
      })); 
      showToast('Refund Processed!'); 
      setModal({ type: null, data: null }); 
    } catch (err) { 
      showToast('Error: ' + err.message); 
    }
  };

  const openRefundModal = (inv) => {
    setRefundForm({ id: inv.id, date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: inv.portal_id });
    setModal({ type: 'refund', data: inv });
  };

  // --- MISSING EDIT HANDLERS (ADDED NOW) ---
  const handleEditCust = (c) => { setEditCustId(c.id); setCustForm({ name: c.name, phone: c.phone, store_credit: c.store_credit || 0 }); };
  const handleEditCorp = (c) => { setEditCorpId(c.id); setCorpForm({ name: c.name, vat_no: c.vat_no, phone: c.phone, address: c.address }); };
  const handleEditCred = (c) => { setEditCredId(c.id); setCreditorForm({ name: c.name, phone: c.phone, address: c.address }); };
  const handleEditVend = (c) => { setEditVendId(c.id); setVendorForm({ name: c.name, phone: c.phone, balance: c.balance || 0 }); };
  const handleEditEmp = (c) => { setEditEmpId(c.id); setEmpForm({ name: c.name, role: c.role, salary: c.salary, phone: c.phone }); };

  const openPreview = (inv) => {
    const s = data.settings;
    const html = getInvoiceHTML(inv, s, 'en');
    setPreviewHTML(html);
    setModal({ type: 'preview', data: inv });
  };

  const handleLogoUpload = async (e) => { 
    try {
      const file = e.target.files[0]; if (!file) return; 
      const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`; 
      const { error } = await supabase.storage.from('logos').upload(fileName, file); 
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName); 
      setSetForm(prev => ({ ...prev, logo_url: urlData.publicUrl })); 
      showToast('Logo Uploaded!'); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleSaveSettings = async (e) => { 
    e.preventDefault(); 
    try {
      const { error } = await supabase.from('settings').upsert([{ id: 1, ...setForm }]).eq('id', 1); 
      if (error) throw error;
      setData(prev => ({ ...prev, settings: setForm })); 
      showToast('Settings Saved!'); 
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const exportToExcel = (csvData, filename) => { 
    if (!csvData || csvData.length === 0) return showToast('No data to export'); 
    try {
      const headers = Object.keys(csvData[0]); 
      const csvRows = [headers.join(',')]; 
      for (const row of csvData) { 
        csvRows.push(headers.map(h => `"${row[h] || ''}"`).join(',')); 
      } 
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' }); 
      const link = document.createElement('a'); 
      link.href = URL.createObjectURL(blob); 
      link.download = `${filename}.csv`; 
      link.click(); 
      showToast('Exported!'); 
    } catch (err) { showToast('Export Error: ' + err.message); }
  };

  const filterData = (arr, dateKey) => { if (!repDate.from || !repDate.to) return arr; return arr.filter(i => (i[dateKey] || i.created_at?.split('T')[0]) >= repDate.from && (i[dateKey] || i.created_at?.split('T')[0]) <= repDate.to); };

  // --- COMPLETED INVOICE HTML TEMPLATE ---
  const getInvoiceHTML = (inv, s, invLang = 'en') => {
    const isAr = invLang === 'ar'; 
    const dir = isAr ? 'rtl' : 'ltr'; 
    const textAlign = isAr ? 'right' : 'left'; 
    const textAlignOpp = isAr ? 'left' : 'right';
    const isRefund = inv.invoice_no.startsWith('REF-');
    const qrData = `Invoice: ${inv.invoice_no} | Total: ${(inv.total||0).toFixed(2)} SAR`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrData)}`;
    
    return `
    <div id="invoice-capture" style="width:794px; height:1123px; padding:40px; box-sizing:border-box; background:#fff; color:#333; font-family:'Segoe UI', Tahoma, Arial; direction:${dir}; text-align:${textAlign}; display:flex; flex-direction:column; justify-content:space-between; border: 8px solid #1E3A8A; border-radius: 15px; box-shadow: inset 0 0 0 2px #FBBF24; overflow: hidden;">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #FBBF24; padding-bottom:15px; margin-bottom:15px;">
          <div style="display:flex; align-items:center; gap:15px;">
            ${s.logo_url ? `<img src="${s.logo_url}" crossorigin="anonymous" style="height:80px;width:auto;object-fit:contain;" />` : ''}
            <div style="text-align: right; direction: rtl;">
              <h1 style="margin:0;color:#1E3A8A;font-size:20px;font-weight:bold;">${s.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h1>
              <p style="font-size:11px;margin-top:5px;line-height:1.6;color:#555;">
                عنوان: ${s.address_ar || ''}<br/>هاتف: ${s.phone || ''}<br/>ضريبة القيمة المضافة: ${s.vat_no || ''}
              </p>
            </div>
          </div>
          <div style="text-align:${textAlignOpp};background:#1E3A8A;color:#fff;padding:15px 20px;border-radius:8px;min-width:220px;">
            <h1 style="margin:0;font-size:18px;">${isRefund ? 'CREDIT NOTE' : 'TAX INVOICE'}<br/><span style="font-size:14px; color:#FBBF24;">${isRefund ? 'فاتورة إشعار دائن' : 'فاتورة ضريبية'}</span></h1>
            <p style="font-size:12px;margin-top:8px;color:#eee; text-align:${textAlignOpp};">
              Inv No: <b>${inv.invoice_no}</b><br/>Date: <b>${inv.invoice_date}</b><br/>Payment: <b>${inv.payment_method}</b>
            </p>
          </div>
        </div>
        
        <div style="display:flex;justify-content:space-between;background:#f8fafc;padding:10px;border-radius:8px; margin-bottom:15px;">
          <div>
            <h3 style="margin:0 0 5px;color:#1E3A8A;font-size:13px;">BILL TO / الفاتورة إلى:</h3>
            <p style="margin:0;font-size:15px;font-weight:bold;">${inv.customers?.name || inv.corporates?.name || ''}</p>
            <p style="margin:3px 0 0;font-size:11px;color:#666;">${inv.customers?.phone || inv.corporates?.phone || ''}</p>
          </div>
          <div style="text-align:${textAlignOpp};">
            <p style="margin:0;font-size:11px;"><b>Sales Person:</b> ${inv.employees?.name || 'N/A'}</p>
            <p style="margin:3px 0 0;font-size:11px;"><b>Trip Type:</b> ${inv.flight_journey || 'Single'}</p>
          </div>
        </div>

        ${inv.passenger_names ? `<div style="margin-bottom:15px;padding:8px;background:#fff;border:1px dashed #ddd;border-radius:6px; max-height: 80px; overflow: hidden;"><b style="font-size:11px;">Passengers:</b><br/><span style="font-size:12px;white-space:pre-wrap;margin-top:3px;display:inline-block;">${inv.passenger_names}</span></div>` : ''}
      </div>

      <div style="flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center;">
        <table style="width:100%;border-collapse:collapse;text-align:center;">
          <thead>
            <tr style="background:#1E3A8A;color:#fff;">
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Service</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Sector / PNR</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Cost</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Sell</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">VAT</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background:#fff;">
              <td style="padding:8px;border:1px solid #ddd;font-size:11px;">${inv.service_type || 'N/A'}</td>
              <td style="padding:8px;border:1px solid #ddd;font-size:11px;">${inv.sector || inv.flight_sector || 'N/A'}<br/><b>${inv.pnr || ''}</b></td>
              <td style="padding:8px;border:1px solid #ddd;font-size:11px;">${(inv.total_cost || 0).toFixed(2)}</td>
              <td style="padding:8px;border:1px solid #ddd;font-size:11px;">${(inv.total_sell || 0).toFixed(2)}</td>
              <td style="padding:8px;border:1px solid #ddd;font-size:11px;">${(inv.vat || 0).toFixed(2)}</td>
              <td style="padding:8px;border:1px solid #ddd;font-size:11px;font-weight:bold;">${(inv.total || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:20px; border-top:2px solid #FBBF24; padding-top:15px;">
        <div style="text-align:center;">
          <img src="${qrUrl}" alt="QR" style="width:80px;height:80px;" />
        </div>
        <div style="text-align:${textAlignOpp};">
          <h2 style="margin:5px 0 0;color:#1E3A8A;font-size:20px;">Total: ${(inv.total || 0).toFixed(2)} SAR</h2>
          <p style="margin:5px 0 0;font-size:12px;color:${(inv.due_amount || 0) > 0 ? '#EF4444' : '#059669'};">Paid: ${(inv.paid_amount || 0).toFixed(2)} | Due: <b>${(inv.due_amount || 0).toFixed(2)}</b></p>
        </div>
      </div>
      <div style="text-align:center; margin-top:20px; font-size:11px; color:#888;">${s.invoice_footer || 'Thank you for choosing us!'}</div>
    </div>`;
  };

  // --- MISSING PDF & PRINT FUNCTIONS (ADDED NOW) ---
  const downloadPDF = (inv, invLang = 'en') => {
    const s = data.settings;
    const html = getInvoiceHTML(inv, s, invLang);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Invoice ${inv.invoice_no}</title></head><body style="margin:0;padding:0;">${html}</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const printInvoice = (inv, invLang = 'en') => {
    const s = data.settings;
    const html = getInvoiceHTML(inv, s, invLang);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Invoice ${inv.invoice_no}</title></head><body style="margin:0;padding:0;">${html}</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  // --- RETURN PROPS ---
  return {
    user, userProfile, lang, setLang, page, setPage, toast,
    modal, setModal, passForm, setPassForm, handleChangePassword, handleLogout,
    chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, handleSendMessage,
    data, today, tr,
    // Invoices
    invForm, setInvForm, handleCreateInvoice, handleEditInvoice, handleDeleteInvoice,
    openRefundModal, openPreview, previewHTML,
    downloadPDF, printInvoice, exportToExcel,
    search, setSearch, tblPage, setTblPage, payFilter, setPayFilter,
    editInvId,
    // Cust, Corp, Cred
    handleAddEditCust, custForm, setCustForm, handleEditCust, editCustId,
    handleAddEditCorp, corpForm, setCorpForm, handleEditCorp, editCorpId,
    handleAddEditCred, creditorForm, setCreditorForm, handleEditCred, editCredId,
    // Vend, Pkg, Brn
    handleAddEditVend, vendorForm, setVendorForm, handleEditVend, editVendId,
    handleAddEditEmp, empForm, setEmpForm, handleEditEmp, editEmpId,
    expForm, setExpForm, handleAddExpItem, handleRemoveExpItem, handleExpItemChange, handleAddExpense,
    // Portals, Invest, Transfer
    handleAddPortal, portalForm, setPortalForm, handleRecharge,
    handleAddInvestment, investForm, setInvestForm,
    handleTransfer, transferForm, setTransferForm,
    // Users & Settings
    handleAddUser, handleEditUser, handleUpdateUser, userForm, setUserForm, editUserId,
    handleSaveSettings, handleLogoUpload, setForm, setSetForm,
    // Modals & Reports
    handleSettlePayment, settleForm, setSettleForm,
    handleRefund, refundForm, setRefundForm,
    handleDelete, filterData, handlePaySalary, ledgerCustId, setLedgerCustId,
    repDate, setRepDate, reportTab, setReportTab, statementTab, setStatementTab
  };
}
