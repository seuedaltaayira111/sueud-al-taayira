'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const translations = {
  en: { dashboard:'Dashboard', create:'Create Invoice', list:'Invoices', refunds:'Refunds', customers:'Customers', corporates:'Corporates', creditors:'Creditors', credit:'Credit Balances', vendors:'Vendors', packages:'Packages', branches:'Branches', portals:'Portals', bank:'Bank & Cash', invest:'Investors', hr:'Human Resources', users:'Users', settings:'Settings', reports:'Reports', audit:'Audit Logs', statements:'Statements', contract:'Corporate Contract', offer:'Corporate Offer', superadmin:'SuperAdmin', profile:'Profile', profitability:'Profitability', notifications:'Notifications', ai_dashboard:'AI Dashboard', quotations:'Quotations', hr_advanced:'HR & Payroll', ai_pricing:'AI Pricing', my_attendance:'My Attendance', credit_limits:'Credit Limits', customer_statement:'Customer Statement', refund_statement:'Refund Statement', supplier_statement:'Supplier Statement', multi_branch:'Multi-Branch', recurring_invoices:'Recurring Invoices', expense_approval:'Expense Approval', staff_mistakes:'Staff Mistakes', expenses:'Expenses', editInvoice:'Edit Invoice', generateInvoice:'Generate Invoice', updateInvoice:'Update Invoice', custType:'Customer Type', individual:'Individual', corporate:'Corporate', selectCustomer:'Select Customer', customerPhone:'Customer Phone', passengers:'Passengers', addPassenger:'+ Add Passenger', portal:'Portal', service:'Service', flightTicket:'Flight Ticket', hotel:'Hotel Booking', tourPackage:'Tour Package', visitVisa:'Visit Visa', umrahVisa:'Umrah Visa', newService:'New Service', flightType:'Flight Type', domestic:'Domestic', international:'International', airline:'Airline', sector:'Sector', pnr:'PNR', ticketNo:'Ticket No', qty:'Quantity', cost:'Cost', sell:'Sell', discount:'Discount', vatRate:'VAT Rate', invoiceDate:'Invoice Date', bookingType:'Booking Type', newBooking:'New Booking', reissue:'Reissue', extraLuggage:'Extra Luggage', previousBooking:'Previous Booking', salesPerson:'Sales Person', paymentMethod:'Payment Method', cash:'Cash', bankTransfer:'Bank Transfer', card:'Card / Network', credit:'Credit', creditBalance:'Credit Balance', tabby:'Tabby', tamara:'Tamara', paidAmount:'Paid Amount', invNo:'Inv No', total:'Total', due:'Due', method:'Method', actions:'Actions', preview:'Preview', print:'Print', edit:'Edit', delete:'Delete', refund:'Refund', quickSettle:'Settle', download_excel:'Export Excel', save:'Save', add:'Add', search:'Search...', changePass:'Change Password', logout:'Logout', selectEmployee:'Select Employee', attendanceDate:'Date', status:'Status', present:'Present', leave:'Leave', absent:'Absent', checkInTime:'Check-In', checkOutTime:'Check-Out', overtime:'OT', deduction:'Deduction', mark:'Mark', baseSalary:'Base Salary', commission:'Commission %', advDed:'Adv. Deduct', gift:'Gift/Bonus', month:'Month', mode:'Mode', paySalary:'Pay Salary', generateSlip:'Generate Slip', target:'Target (SAR)', achieved:'Achieved', percentage:'%', balance:'Balance' },
  ar: { dashboard:'لوحة التحكم', create:'إنشاء فاتورة', list:'الفواتير', refunds:'الاسترجاعات', customers:'العملاء', corporates:'الشركات', creditors:'الدائنون', credit:'أرصدة مستحقة', vendors:'الموردون', packages:'الباقات', branches:'الفروع', portals:'البوابات', bank:'البنك والصندوق', invest:'المستثمرون', hr:'الموارد البشرية', users:'المستخدمون', settings:'الإعدادات', reports:'التقارير', audit:'سجل التدقيق', statements:'كشوفات', contract:'عقد شركات', offer:'عرض شركات', superadmin:'المدير العام', profile:'الملف الشخصي', profitability:'الربحية', notifications:'الإشعارات', ai_dashboard:'لوحة ذكية', quotations:'عروض أسعار', hr_advanced:'الرواتب', ai_pricing:'تسعير ذكي', my_attendance:'حضوري', credit_limits:'حدود الائتمان', customer_statement:'كشف عميل', refund_statement:'كشف استرجاع', supplier_statement:'كشف مورد', multi_branch:'متعدد الفروع', recurring_invoices:'فواتير متكررة', expense_approval:'اعتماد مصروفات', staff_mistakes:'أخطاء الموظفين', expenses:'المصروفات', editInvoice:'تعديل الفاتورة', generateInvoice:'إنشاء الفاتورة', updateInvoice:'تحديث الفاتورة', custType:'نوع العميل', individual:'فرد', corporate:'شركة', selectCustomer:'اختر العميل', customerPhone:'هاتف العميل', passengers:'الركاب', addPassenger:'+ إضافة راكب', portal:'البوابة', service:'الخدمة', flightTicket:'تذكرة طيران', hotel:'حجز فندق', tourPackage:'باقة سياحية', visitVisa:'تأشيرة زيارة', umrahVisa:'تأشيرة عمرة', newService:'خدمة جديدة', flightType:'نوع الرحلة', domestic:'داخلي', international:'دولي', airline:'خط الطيران', sector:'القطاع', pnr:'رقم الحجز', ticketNo:'رقم التذكرة', qty:'الكمية', cost:'التكلفة', sell:'البيع', discount:'الخصم', vatRate:'نسبة الضريبة', invoiceDate:'تاريخ الفاتورة', bookingType:'نوع الحجز', newBooking:'حجز جديد', reissue:'إعادة إصدار', extraLuggage:'أمتعة إضافية', previousBooking:'حجز سابق', salesPerson:'موظف المبيعات', paymentMethod:'طريقة الدفع', cash:'نقداً', bankTransfer:'تحويل بنكي', card:'بطاقة', credit:'آجل', creditBalance:'رصيد مستحق', tabby:'تابي', tamara:'تمارة', paidAmount:'المبلغ المدفوع', invNo:'رقم الفاتورة', total:'الإجمالي', due:'المتبقي', method:'الطريقة', actions:'إجراءات', preview:'معاينة', print:'طباعة', edit:'تعديل', delete:'حذف', refund:'استرجاع', quickSettle:'تسوية', download_excel:'تصدير', save:'حفظظ', add:'إضافة', search:'بحث...', changePass:'تغيير كلمة المرور', logout:'تسجيل خروج', selectEmployee:'اختر الموظف', attendanceDate:'التاريخ', status:'الحالة', present:'حاضر', leave:'إجازة', absent:'غائب', checkInTime:'وقت الحضور', checkOutTime:'وقت الانصراف', overtime:'إضافي', deduction:'خصم', mark:'تسجيل', baseSalary:'الراتب الأساسي', commission:'العمولة %', advDed:'خصم سلفة', gift:'هدية/مكافأة', month:'الشهر', mode:'الطريقة', paySalary:'دفع الراتب', generateSlip:'إنشاء قسيمة', target:'الهدف (ريال)', achieved:'المحقق', percentage:'%', balance:'الرصيد' },
  ar: { dashboard:'لوحة التحكم', create:'إنشاء فاتورة', list:'الفواتير', refunds:'الاسترجاعات', customers:'العملاء', corporates:'الشركات', creditors:'الدائنون', credit:'أرصدة مستحقة', vendors:'الموردون', packages:'الباقات', branches:'الفروع', portals:'البوابات', bank:'البنك والصندوق', invest:'المستثمرون', hr:'الموارد البشرية', users:'المستخدمون', settings:'الإعدادات', reports:'التقارير', audit:'سجل التدقيق', statements:'كشوفات', contract:'عقد شركات', offer:'عرض شركات', superadmin:'المدير العام', profile:'الملف الشخصي', profitability:'الربحية', notifications:'الإشعارات', ai_dashboard:'لوحة ذكية', quotations:'عروض أسعار', hr_advanced:'الرواتب', ai_pricing:'تسعير ذكي', my_attendance:'حضوري', credit_limits:'حدود الائتمان', customer_statement:'كشف عميل', refund_statement:'كشف استرجاع', supplier_statement:'كشف مورد', multi_branch:'متعدد الفروع', recurring_invoices:'فواتير متكررة', expense_approval:'اعتماد مصروفات', staff_mistakes:'أخطاء الموظفين', expenses:'المصروفات', editInvoice:'تعديل الفاتورة', generateInvoice:'إنشاء الفاتورة', updateInvoice:'تحديث الفاتورة', custType:'نوع العميل', individual:'فرد', corporate:'شركة', selectCustomer:'اختر العميل', customerPhone:'هاتف العميل', passengers:'الركاب', addPassenger:'+ إضافة راكب', portal:'البوابة', service:'الخدمة', flightTicket:'تذكرة طيران', hotel:'حجز فندق', tourPackage:'باقة سياحية', visitVisa:'تأشيرة زيارة', umrahVisa:'تأشيرة عمرة', newService:'خدمة جديدة', flightType:'نوع الرحلة', domestic:'داخلي', international:'دولي', airline:'خط الطيران', sector:'القطاع', pnr:'رقم الحجز', ticketNo:'رقم التذكرة', qty:'الكمية', cost:'التكلفة', sell:'البيع', discount:'الخصم', vatRate:'نسبة الضريبة', invoiceDate:'تاريخ الفاتورة', bookingType:'نوع الحجز', newBooking:'حجز جديد', reissue:'إعادة إصدار', extraLuggage:'أمتعة إضافية', previousBooking:'حجز سابق', salesPerson:'موظف المبيعات', paymentMethod:'طريقة الدفع', cash:'نقداً', bankTransfer:'تحويل بنكي', card:'بطاقة', credit:'آجل', creditBalance:'رصيد مستحق', tabby:'تابي', tamara:'تمارة', paidAmount:'المبلغ المدفوع', invNo:'رقم الفاتورة', total:'الإجمالي', due:'المتبقي', method:'الطريقة', actions:'إجراءات', preview:'معاينة', print:'طباعة', edit:'تعديل', delete:'حذف', refund:'استرجاع', quickSettle:'تسوية', download_excel:'تصدير', save:'حفظظ', add:'إضافة', search:'بحث...', changePass:'تغيير كلمة المرور', logout:'تسجيل خروج', selectEmployee:'اختر الموظف', attendanceDate:'التاريخ', status:'الحالة', present:'حاضر', leave:'إجازة', absent:'غائب', checkInTime:'وقت الحضور', checkOutTime:'وقت الانصراف', overtime:'إضافي', deduction:'خصم', mark:'تسجيل', baseSalary:'الراتب الأساسي', commission:'العمولة %', advDed:'خصم سلفة', gift:'هدية/مكافأة', month:'الشهر', mode:'الطريقة', paySalary:'دفع الراتب', generateSlip:'إنشاء قسيمة', target:'الهدف (ريال)', achieved:'المحقق', percentage:'%', balance:'الرصيد' },
};

const getAirlineCheckInURL = (airline, pnr) => {
  if (!airline || !pnr) return null;
  const a = airline.toLowerCase();
  const u = { 'saudia':`https://www.saudia.com/check-in?pnr=${pnr}`, 'sv':`https://www.saudia.com/check-in?pnr=${pnr}`, 'flynas':`https://www.flynas.com/en/manage-booking?ref=${pnr}`, 'flyadeal':`https://www.flyadeal.com/en/manage-booking?ref=${pnr}`, 'gulf air':`https://www.gulfair.com/check-in?pnr=${pnr}`, 'emirates':`https://www.emirates.com/manage-booking/retrieve-check-in?pnr=${pnr}`, 'etihad':`https://www.etihad.com/en-us/manage-booking/check-in?pnr=${pnr}`, 'qatar':`https://www.qatarairways.com/en/check-in.html?pnr=${pnr}`, 'egyptair':`https://www.egyptair.com/en/Manage-Booking/Check-In?pnr=${pnr}`, 'royal jordanian':`https://www.rj.com/en/manage-booking?pnr=${pnr}`, 'middle east':`https://www.meairlines.com/en/ManageBooking?pnr=${pnr}`, 'pakistan':`https://www.piac.com.pk/manage-booking?pnr=${pnr}`, 'indigo':`https://www.goindigo.in/manage-booking?pnr=${pnr}`, 'spicejet':`https://www.spicejet.com/manage-booking?pnr=${pnr}`, 'air india':`https://www.airindia.in/manage-booking?pnr=${pnr}`, 'air cairo':`https://www.aircairo.com/en/manage-booking?pnr=${pnr}`, 'nile air':`https://www.nileair.com/en/manage-booking?pnr=${pnr}`, 'salam air':`https://www.salamair.com/manage-booking?pnr=${pnr}`, 'jazeera':`https://www.jazeeraairways.com/en/manage-booking?ref=${pnr}`, 'flydubai':`https://www.flydubai.com/en/manage-booking?ref=${pnr}`, 'virgin':`https://www.virginatlantic.com/check-in?pnr=${pnr}` };
  for (const [k, url] of Object.entries(u)) { if (a.includes(k)) return url; }
  return `https://www.google.com/search?q=${encodeURIComponent(airline + ' check in pnr ' + pnr)}`;
};

const getAIMessage = (inv, lang) => {
  const m = [{ en:"✈️ Wishing you a wonderful journey! Safe travels.", ar:"✈️ نتمنى لك رحلة سعيدة! سفر آمن." },{ en:"🌟 Your trust means everything to us. Amazing trip!", ar:"🌟 ثقتكم تعني لنا كل شيء. رحلة رائعة!" },{ en:"💎 Premium service, unforgettable experiences.", ar:"💎 خدمة مميزة، تجارب لا تُنسى." },{ en:"🌅 New horizons await! Thank you!", ar:"🌅 آفاق جديدة تنتظركم! شكراً!" },{ en:"⭐ Your satisfaction is our mission. Have a great flight!", ar:"⭐ رضاكم مهمتنا. سفر رائعة!" },{ en:"🎭 Making travel dreams come true!", ar:"🎭 نحقق أحلام سفركم، حجزا تلو آخر!" },{ en:"📋 Summary: ${inv.invoice_no?:'0'} invoices | Total: ${inv.total?:'0'} SAR | Unpaid: ${inv.due_amount?:'0'}`, ar:"📋 ملخص: ${inv.invoice_no?:'0'} فاتورة | ${inv.due_amount?:'0'} غير مدفوعة" },{ en:"Hello! How can I help?", ar:"👋 مرحباً! أنا مساعدك. اكتب "مساعدة" لمعرفة ما يمكنني فعله!" },{ en:"Hi! Try asking about invoices, customers, refunds, reports, profit, expenses, salary, portals, unpaid, summary", ar:"👋 مرحباً! أنا مساعدك. اسأل عن الفواتير، العملاء، الاسترجاع، التقارير، الربح، المصروفات، الرواتب، البوابات، غير مدفوعة، ملخص" }];
  const idx = (inv.id?.charCodeAt(0) || 0) % m.length;
  return lang === 'ar' ? m[idx].ar : m[idx].en;
};

const DRAFT_KEY = 'erp_invoice_draft';
const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) return;
  const h = Object.keys(data[0]);
  const csv = [h.join(','), ...data.map(r => h.map(k => { let val = r[k] ?? ''; if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n')) { val = '"' + val.replace(/"/g, '""') + '"'; } return val; }).join(','))].join('\n')].join('\n');
  const b = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a'); a.href = u; a.download = filename + '.csv'; a.click(); URL.revokeObjectURL(u);
};

const loadDrafts = () => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'); } catch (e) { return []; } };
const saveDraft = (d) => { try { const ds = loadDrafts(); const i = ds.findIndex(x => x.id === d.id); if (i >= 0) ds[i] = d; else ds.unshift(d); localStorage.setItem(DRAFT_KEY, JSON.stringify(ds.slice(0, 20))); } catch (e) { } };
const deleteDraft = (id) => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(loadDrafts().filter(d => d.id !== id))); } catch (e) { } };
const generateInvoiceNo = async () => { const n = new Date(); const p = 'INV-' + n.getFullYear().toString().slice(-2) + (n.getMonth() + 1).toString().padStart(2, '0'); try { const { data } = await supabase.from('invoices').select('invoice_no').ilike('invoice_no', p + '%').order('invoice_no', { ascending: false }).limit(1); if (data && data.length > 0) { const num = parseInt(data[0].invoice_no.split('-').pop() || '0'); return p + '-' + (num + 1).toString().padStart(4, '0'); } } catch (e) { } return p + '-0001'; };
const generateRefundNo = async () => { const n = new Date(); const p = 'REF-' + n.getFullYear().toString().slice(-2) + (n.getMonth() + 1).toString().padStart(2, '0'); try { const { data } = await supabase.from('invoices').select('invoice_no').ilike('invoice_no', p + '%').order('invoice_no', { ascending: false }).limit(1); if (data && data.length > 0) { const num = parseInt(data[0].invoice_no.split('-').pop() || '0'; return p + '-' + (num + 1).toString().padStart(4, '0'); } } catch (e) { } return p + '-0001'; }; 

/* ═════════════════════════════════════════════════════════════════
   MAIN HOOK
   ═════════════════════════════════════════════════════════════════════════════════ */
export default function useERPState() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const t = useMemo(() => translations[lang], [lang]);
  const tr = translations;

  /* Auth — default profile so NEVER null */
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    id: 'default', name: 'User', role: 'Admin', is_admin: true, can_access_hr: true, can_access_bank: true,
    can_access_invoices: true, can_access_reports: true, can_access_settings: true, tenant_id: 'default'
  });
  const [initError, setInitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); }, []);
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState({ type: null, data: null });
  const [previewHTML, setPreviewHTML] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Standard');
  const [contractMarkup, setContractMarkup] = useState('0');
  const [contractTerms, setContractTerms] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* Data — all keys useERPActions uses */
  const [data, setData] = useState({
    invoices: [], customers: [], corporates: [], creditors: [], employees: [], expenses: [], vendors: [], packages: [], branches: [], portals: [],
    bankTransactions: [], investors: [], auditLogs: [], settings: {}, notifications: [], attendance: [], payroll: [],
    creditLimits: [], recurringInvoices: [], quotationRequests: [], staffMistakes: [], cashbook: [], tenants: []
  });

  /* Forms */
  const [invForm, setInvForm] = useState({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '', oldSellPrice: 0, oldBookingDate: '', oldPassengers: '', oldFlightType: '', oldPaymentMethod: '', refundReason: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '', status: 'Unpaid' });
  const [expForm, setExpForm] = useState({ expense_type: '', payment_mode: 'Cash', description: '', amount: '', expense_date: today, items: [] });
  const [corpForm, setCorpForm] = useState({ name: '', vat_no: '', phone: '', address: '' });
  const [creditorForm, setCreditorForm] = useState({ name: '', phone: '', address: '' });
  const [custForm, setCustForm] = useState({ name: '', phone: '', store_credit: 0 });
  const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '', duration: '', inclusions: '' });
  const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
  const [empForm, setEmpForm] = useState({ name: '', phone: '', email: '', role: '', base_salary: '', commission: '' });
  const [srvForm, setSrvForm] = useState({ name: '', type: '', price: '' });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '', creditBalance: 0 });
  const [transferForm, setTransferForm] = useState({ from: '', to: '', amount: '', date: today, reason: '' });
  const [setForm, setSetForm] = useState({ custom_fields: [] });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: '', password: '' });
  const [portalForm, setPortalForm] = useState({ name: '', current_balance: 0 });
  const [tenantForm, setTenantForm] = useState({ agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '', phone: '', address: '' });
  const [payForm, setPayForm] = useState({ employee_id: '', month: '', base_salary: 0, commission: 0, overtime: 0, gift: 0, advance_deduction: 0, mistakes_deduction: 0, other_deduction: 0, payment_mode: 'Cash' });
  const [passForm, setPassForm] = useState({ newPass: '' });

  /* Edit IDs */
  const [editInvId, setEditInvId] = useState(null);
  const [editExpId, setEditExpId] = useState(null);
  const [editCorpId, setEditCorpId] = useState(null);
  const [editCredId, setEditCredId] = useState(null);
  const [editCustId, setEditCustId] = useState(null);
  const [editVendId, setEditVendId] = useState(null);
  const [editPkgId, setEditPkgId] = useState(null);
  const [editBrnId, setEditBrnId] = useState(null);
  const [editEmpId, setEditEmpId] = useState(null);
  const [editSrvId, setEditSrvId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  /* Safe loader — never crashes on 404/timeout */
  const safeLoad = useCallback(async (table, key, opts) => {
    opts = opts || {};
    try {
      var q = supabase.from(table).select(opts.select || '*');
      if (opts.order) q = q.order(opts.order.col, { ascending: opts.order.asc !== false });
      if (opts.limit) q = q.limit(opts.limit);
      if (opts.eq) { Object.keys(opts.eq).forEach(function(k) { q = q.eq(k, opts.eq[k]); });
      if (opts.single) {
        var r = await q.single();
        if (r.data) { setData(function(p) { var n = Object.assign({}, p); n[key] = r.data; return n; }); return true; }
      } else {
        var r2 = await q;
        if (r2.data) { setData(function(p) { var n = Object.assign({}, p); n[key] = r2.data; return n; }); return true; }
      }
    } catch (e) { console.warn('[ERP] Skip ' + table + ':', e.message); }
    return false;
  }, []);

  /* Fetch all data — with settings fallback */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        safeLoad('settings', 'settings', { single: true }),
        safeLoad('invoices', 'invoices', { order: { col: 'created_at', asc: false } }),
        safeLoad('customers', 'customers', { order: { col: 'name', asc: true } }),
        safeLoad('corporates', 'corporates', { order: { col: 'name', asc: true } }),
        safeLoad('creditors', 'creditors', { order: { col: 'name', asc: true } }),
        safeLoad('employees', 'employees', { order: { col: 'name', asc: true } }),
        safeLoad('expenses', 'expenses', { order: { col: 'created_at', asc: false } }),
        safeLoad('vendors', 'vendors', { order: { col: 'name', asc: true } }),
        safeLoad('packages', 'packages', { order: { col: 'name', asc: true } }),
        safeLoad('branches', 'branches', { order: { col: 'name', asc: true } }),
        safeLoad('portals', 'portals', { order: { col: 'name', asc: true } }),
        safeLoad('bank_transactions', 'bankTransactions', { order: { col: 'created_at', asc: false } }),
        safeLoad('investors', 'investors', { order: { col: 'name', asc: true } }),
        safeLoad('audit_logs', 'auditLogs', { order: { col: 'created_at', asc: false }, limit: 500 }),
        safeLoad('notifications', 'notifications', { order: { col: 'created_at', asc: false }, limit: 100 }),
        safeLoad('attendance', 'attendance', { order: { col: 'date', asc: false } }),
        safeLoad('payroll', 'payroll', { order: { col: 'created_at', asc: false } }),
        safeLoad('staff_mistakes', 'staffMistakes', { order: { col: 'created_at', asc: false } }),
        safeLoad('cashbook', 'cashbook', { order: { col: 'created_at', asc: false } }),
        safeLoad('tenants', 'tenants', { order: { col: 'created_at', asc: false } }),
        safeLoad('contracts', 'contracts', { order: { col: 'created_at', asc: false } }),
        safeLoad('emp_advances', 'emp_advances', { order: { col: 'created_at', asc: false } }),
        safeLoad('employee_advances', 'employee_advances', { order: { col: 'created_at', asc: false } }),
      ]);

      /* Settings fallback — try multiple table names */
      if (!data.settings || Object.keys(data.settings).length === 0) {
        console.warn('[ERP] Settings empty, trying alternatives...');
        for (const tn of ['settings', 'company_settings', 'contracts', 'app_settings']) {
          var loaded = await safeLoad(tn, 'settings', { single: true });
          if (loaded) break;
        }
        if (!data.settings || Object.keys(data.settings).length === 0) {
          console.warn('[ERP] No settings table found, using default');
          setData(function(p) { var n = Object.assign({}, p); n.settings = { company_name_en:'SUEUD AL TAAYIRA TRAVEL & TOURISM', company_name_ar:'صعود الطائرة للسفر والسياحة', vat_no:'N/A', cr_no:'N/A', license_no:'N/A', tourism_license_no:'N/A', phone:'', address_ar:'' }}); });
        }
      }
    } catch (e) { console.error('[ERP] fetchAll:', e); }
    finally { setLoading(false); }
  }, [safeLoad]);

  /* Log action — uses user_email per schema */
  const logAction = useCallback(async (details) => {
    try { await supabase.from('audit_logs').insert([{ user_email: user?.email || 'system', action: 'user_action', details: details, tenant_id: userProfile?.tenant_id }]); } catch (e) { /* silent */ }
  }, [user, userProfile]);

  /* Auth init */
  useEffect(() => {
    var mounted = false;
    const init = async () => {
      if (mounted) return;
      mounted = true;
      try {
        var authResult = await supabase.auth.getSession();
        if (authResult.error || !authResult.data.session) {
          setInitError('Not authenticated. Redirecting to login...');
          router.push('/login');
          return;
        }
        var session = authResult.data.session;
        setUser(session.user);
        try {
          var profResult = await supabase.from('app_users').select('*').eq('id', session.user.id).single();
          if (profResult.data) { setUserProfile(profResult.data); }
        } catch (e) {
          console.warn('[ERP] app_users not found, using default profile');
        }
        await fetchAll();
      } catch (e) {
        console.error('[ERP] Init error:', e);
        setInitError(e.message || 'Init failed. Try clearing browser cache and retry.');
      }
    };
    init();
  }, [router, fetchAll]);

  /* Auth listener */
  useEffect(() => {
    var sub = supabase.auth.onAuthStateChange(function(event, session) {
      if (event === 'SIGNED_OUT') { setUser(null); setUserProfile({ id:'default', name:'User', role:'Admin', is_admin:true, can_access_hr:true, can_access_bank:true, can_access_invoices:true, can_access_reports:true, can_access_settings:true, tenant_id:'default' }); router.push('/login'); }
      if (event === 'SIGNED_IN' && session) { setUser(session.user); window.location.reload(); }
    });
    return function() { sub.data.subscription.unsubscribe(); }
  }, [router]);

  /* Return EVERYTHING useERPActions needs */
  return {
    t, tr, lang, setLang, translations: tr,
    user, setUser, userProfile, setUserProfile, initError, loading, setLoading,
    data, setData, fetchAll, logAction, showToast, toast, setToast,
    router, page, setPage, today,
    modal, setModal, previewHTML, setPreviewHTML,
    chatInput, setChatInput, chatMessages, setChatMessages,
    contractCorpName, setContractCorpName, contractType, setContractType,
    contractMarkup, setContractMarkup, contractTerms, setContractTerms,
    invForm, setInvForm, expForm, corpForm, setCorpForm, creditorForm, setCreditorForm, custForm, setCustForm, vendorForm, setVendorForm,
    pkgForm, setPkgForm, brnForm, setBrnForm, empForm, setEmpForm,
    srvForm, setSrvForm, investForm, setInvestForm, settleForm, setSettleForm,
    refundForm, setRefundForm, transferForm, setTransferForm, setForm, setSetForm, userForm, setUserForm, portalForm, setPortalForm, tenantForm, setTenantForm, profileForm, setProfileForm, payForm, setPayForm, passForm, setPassForm,
    editInvId, setEditInvId, editExpId, setEditExpId, editCorpId, setEditCorpId,
    editCredId, setEditCredId, editCustId, setEditCustId, editVendId, setEditVendId,
    editPkgId, setEditPkgId, editBrnId, setEditBrnId, editEmpId, setEditEmpId,
    editSrvId, setEditSrvId, editUserId, setEditUserId,
    getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getContractHTML, getMistakeHTML,
    getAirlineCheckInURL, getAIMessage, exportToExcel, loadDrafts, saveDraft, deleteDraft,
    generateInvoiceNo, generateRefundNo,
    sidebarOpen, setSidebarOpen,
  };
}
