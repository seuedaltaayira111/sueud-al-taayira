'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getMistakeHTML, getContractHTML } from '@/utils/htmlGenerators';
import { filterData, exportToExcel } from '@/utils/dataUtils';

const translations = {
  en: { dashboard:'Dashboard', create:'Create Invoice', list:'Invoices', refunds:'Refunds', customers:'Customers', corporates:'Corporates', creditors:'Creditors', credit:'Credit Balances', vendors:'Vendors', packages:'Packages', branches:'Branches', portals:'Portals', bank:'Bank & Cash', invest:'Investors', hr:'Human Resources', users:'Users', settings:'Settings', reports:'Reports', audit:'Audit Logs', statements:'Statements', contract:'Corporate Contract', offer:'Corporate Offer', superadmin:'SuperAdmin', profile:'Profile', profitability:'Profitability', notifications:'Notifications', ai_dashboard:'AI Dashboard', quotations:'Quotations', hr_advanced:'HR & Payroll', ai_pricing:'AI Pricing', my_attendance:'My Attendance', credit_limits:'Credit Limits', customer_statement:'Customer Statement', refund_statement:'Refund Statement', supplier_statement:'Supplier Statement', multi_branch:'Multi-Branch', recurring_invoices:'Recurring Invoices', expense_approval:'Expense Approval', staff_mistakes:'Staff Mistakes', expenses:'Expenses', editInvoice:'Edit Invoice', generateInvoice:'Generate Invoice', updateInvoice:'Update Invoice', custType:'Customer Type', individual:'Individual', corporate:'Corporate', selectCustomer:'Select Customer', customerPhone:'Customer Phone', passengers:'Passengers', addPassenger:'+ Add Passenger', portal:'Portal', service:'Service', flightTicket:'Flight Ticket', hotel:'Hotel Booking', tourPackage:'Tour Package', visitVisa:'Visit Visa', umrahVisa:'Umrah Visa', newService:'New Service', flightType:'Flight Type', domestic:'Domestic', international:'International', airline:'Airline', sector:'Sector', pnr:'PNR', ticketNo:'Ticket No', qty:'Quantity', cost:'Cost', sell:'Sell', discount:'Discount', vatRate:'VAT Rate', invoiceDate:'Invoice Date', bookingType:'Booking Type', newBooking:'New Booking', reissue:'Reissue', extraLuggage:'Extra Luggage', previousBooking:'Previous Booking', salesPerson:'Sales Person', paymentMethod:'Payment Method', cash:'Cash', bankTransfer:'Bank Transfer', card:'Card / Network', credit:'Credit', creditBalance:'Credit Balance', tabby:'Tabby', tamara:'Tamara', paidAmount:'Paid Amount', invNo:'Inv No', total:'Total', due:'Due', method:'Method', actions:'Actions', preview:'Preview', print:'Print', edit:'Edit', delete:'Delete', refund:'Refund', quickSettle:'Settle', download_excel:'Export Excel', save:'Save', add:'Add', search:'Search...', changePass:'Change Password', logout:'Logout', selectEmployee:'Select Employee', attendanceDate:'Date', status:'Status', present:'Present', leave:'Leave', absent:'Absent', checkInTime:'Check-In', checkOutTime:'Check-Out', overtime:'OT', deduction:'Deduction', mark:'Mark', baseSalary:'Base Salary', commission:'Commission %', advDed:'Adv. Deduct', gift:'Gift/Bonus', month:'Month', mode:'Mode', paySalary:'Pay Salary', generateSlip:'Generate Slip', target:'Target (SAR)', achieved:'Achieved', percentage:'%', balance:'Balance' },
  ar: { dashboard:'لوحة التحكم', create:'إنشاء فاتورة', list:'الفواتير', refunds:'الاسترجاعات', customers:'العملاء', corporates:'الشركات', creditors:'الدائنون', credit:'أرصدة مستحقة', vendors:'الموردون', packages:'الباقات', branches:'الفروع', portals:'البوابات', bank:'البنك والصندوق', invest:'المستثمرون', hr:'الموارد البشرية', users:'المستخدمون', settings:'الإعدادات', reports:'التقارير', audit:'سجل التدقيق', statements:'كشوفات', contract:'عقد شركات', offer:'عرض شركات', superadmin:'المدير العام', profile:'الملف الشخصي', profitability:'الربحية', notifications:'الإشعارات', ai_dashboard:'لوحة ذكية', quotations:'عروض أسعار', hr_advanced:'الرواتب', ai_pricing:'تسعير ذكي', my_attendance:'حضوري', credit_limits:'حدود الائتمان', customer_statement:'كشف عميل', refund_statement:'كشف استرجاع', supplier_statement:'كشف مورد', multi_branch:'متعدد الفروع', recurring_invoices:'فواتير متكررة', expense_approval:'اعتماد مصروفات', staff_mistakes:'أخطاء الموظفين', expenses:'المصروفات', editInvoice:'تعديل الفاتورة', generateInvoice:'إنشاء الفاتورة', updateInvoice:'تحديث الفاتورة', custType:'نوع العميل', individual:'فرد', corporate:'شركة', selectCustomer:'اختر العميل', customerPhone:'هاتف العميل', passengers:'الركاب', addPassenger:'+ إضافة راكب', portal:'البوابة', service:'الخدمة', flightTicket:'تذكرة طيران', hotel:'حجز فندق', tourPackage:'باقة سياحية', visitVisa:'تأشيرة زيارة', umrahVisa:'تأشيرة عمرة', newService:'خدمة جديدة', flightType:'نوع الرحلة', domestic:'داخلي', international:'دولي', airline:'خط الطيران', sector:'القطاع', pnr:'رقم الحجز', ticketNo:'رقم التذكرة', qty:'الكمية', cost:'التكلفة', sell:'البيع', discount:'الخصم', vatRate:'نسبة الضريبة', invoiceDate:'تاريخ الفاتورة', bookingType:'نوع الحجز', newBooking:'حجز جديد', reissue:'إعادة إصدار', extraLuggage:'أمتعة إضافية', previousBooking:'حجز سابق', salesPerson:'موظف المبيعات', paymentMethod:'طريقة الدفع', cash:'نقداً', bankTransfer:'تحويل بنكي', card:'بطاقة', credit:'آجل', creditBalance:'رصيد مستحق', tabby:'تابي', tamara:'تمارة', paidAmount:'المبلغ المدفوع', invNo:'رقم الفاتورة', total:'الإجمالي', due:'المتبقي', method:'الطريقة', actions:'إجراءات', preview:'معاينة', print:'طباعة', edit:'تعديل', delete:'حذف', refund:'استرجاع', quickSettle:'تسوية', download_excel:'تصدير', save:'حفظ', add:'إضافة', search:'بحث...', changePass:'تغيير كلمة المرور', logout:'تسجيل خروج', selectEmployee:'اختر الموظف', attendanceDate:'التاريخ', status:'الحالة', present:'حاضر', leave:'إجازة', absent:'غائب', checkInTime:'وقت الحضور', checkOutTime:'وقت الانصراف', overtime:'إضافي', deduction:'خصم', mark:'تسجيل', baseSalary:'الراتب الأساسي', commission:'العمولة %', advDed:'خصم سلفة', gift:'هدية/مكافأة', month:'الشهر', mode:'الطريقة', paySalary:'دفع الراتب', generateSlip:'إنشاء قسيمة', target:'الهدف (ريال)', achieved:'المحقق', percentage:'%', balance:'الرصيد' }
};

export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const initDone = useRef(false);

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState('');
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState({ type: null, data: null });
  const [toast, setToast] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hello! / مرحباً!' }]);
  const [chatInput, setChatInput] = useState('');
  const [search, setSearch] = useState('');
  const [tblPage, setTblPage] = useState(1);
  const [payFilter, setPayFilter] = useState('All');
  const [previewHTML, setPreviewHTML] = useState('');
  const [repDate, setRepDate] = useState({ from: '', to: '' });
  const [reportTab, setReportTab] = useState('sales');
  const [data, setData] = useState({ invoices:[], customers:[], corporates:[], creditors:[], vendors:[], packages:[], branches:[], portals:[], employees:[], services:[], expenses:[], investments:[], cashbook:[], payroll:[], empAdvances:[], staffMistakes:[], attendance:[], appUsers:[], tenants:[], audits:[], settings:{} });
  
  const [invForm, setInvForm] = useState({ custType:'Individual', custId:'new', custName:'', custPhone:'', corpId:'new', corpName:'', corpVat:'', corpPhone:'', corpAddress:'', passengers:[''], employeeId:'', portalId:'', bookingDate:today, invoiceDate:today, bookingType:'New Booking', linkedInvId:'', oldTicketNo:'', oldPnr:'', oldAirline:'', oldSector:'', oldSellPrice:0, oldBookingDate:'', oldPassengers:'', oldFlightType:'', oldPaymentMethod:'', refundReason:'', service:'Flight Ticket', flightType:'Domestic', flightJourney:'Single', refundable:'Refundable', flightSector:'', airline:'', destination:'', hotelName:'', checkIn:'', checkOut:'', visaType:'Tourist', serviceName:'', pnr:'', ticketNo:'', qty:1, cost:0, sell:0, discount:0, taxRate:'15', payment:'Cash', paid:'', creditDueDate:'', creditorId:'', tabbyNo:'', tamaraNo:'', ticketStatus:'Confirmed', useCredit:0, creditCustId:'', status:'Unpaid' });
  const [editInvId, setEditInvId] = useState(null);
  const [expForm, setExpForm] = useState({ date:today, category:'General', description:'', payment_mode:'Cash', portal_id:'', items:[{ name:'', amount:0, category:'General' }] });
  const [editExpId, setEditExpId] = useState(null);
  const [custForm, setCustForm] = useState({ name:'', phone:'', store_credit:0 });
  const [editCustId, setEditCustId] = useState(null);
  const [corpForm, setCorpForm] = useState({ name:'', vat_no:'', phone:'', address:'' });
  const [editCorpId, setEditCorpId] = useState(null);
  const [creditorForm, setCreditorForm] = useState({ name:'', phone:'', address:'' });
  const [editCredId, setEditCredId] = useState(null);
  const [vendorForm, setVendorForm] = useState({ name:'', phone:'', balance:0 });
  const [editVendId, setEditVendId] = useState(null);
  const [pkgForm, setPkgForm] = useState({ name:'', price:'', desc:'', duration:'', inclusions:'' });
  const [editPkgId, setEditPkgId] = useState(null);
  const [brnForm, setBrnForm] = useState({ name:'', location:'', phone:'', manager:'', email:'', timing:'', status:'Active' });
  const [editBrnId, setEditBrnId] = useState(null);
  const [empForm, setEmpForm] = useState({ name:'', role:'Sales', salary:0, phone:'', commission_rate:0, iqama_no:'', iqama_expiry:'' });
  const [editEmpId, setEditEmpId] = useState(null);
  const [srvForm, setSrvForm] = useState({ name:'' });
  const [editSrvId, setEditSrvId] = useState(null);
  const [investForm, setInvestForm] = useState({ name:'', phone:'', email:'', invested_amount:0, profit_share_percent:0, editId:null });
  const [portalForm, setPortalForm] = useState({ name:'', portal_type:'GDS', current_balance:0, initial_balance:0, phone:'', contact_person:'', credit_limit:0 });
  const [settleForm, setSettleForm] = useState({ id:'', date:today, mode:'Cash' });
  const [refundForm, setRefundForm] = useState({ id:'', date:today, compRefund:0, custRefund:0, mode:'Cash', reason:'', portalId:'', creditBalance:0 });
  const [transferForm, setTransferForm] = useState({ from:'Cash', to:'Bank', amount:0, date:today, description:'' });
  const [passForm, setPassForm] = useState({ newPass:'' });
  const [userForm, setUserForm] = useState({ username:'', email:'', is_admin:false, can_access_hr:false, can_access_bank:false, can_access_invoices:true, can_access_reports:false, can_access_settings:false });
  const [editUserId, setEditUserId] = useState(null);
  const [tenantForm, setTenantForm] = useState({ agency_name:'', owner_email:'', subscription_end_date:'', company_name_ar:'', vat_no:'', cr_no:'', phone:'', address_ar:'' });
  const [profileForm, setProfileForm] = useState({ username:'', avatar_url:'', phone:'', address:'' });
  const [setForm, setSetForm] = useState({ company_name_en:'', company_name_ar:'', address_ar:'', phone:'', vat_no:'', cr_no:'', license_no:'', logo_url:'', invoice_footer:'', custom_fields:[] });
  const [payForm, setPayForm] = useState({ employee_id:'', month:today.slice(0,7), overtime:0, gift:0, advance:0, mistakes_deduction:0, other_deduction:0, payment_mode:'Cash', payment_date:today, notes:'' });
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState(0);
  const [contractTerms, setContractTerms] = useState('');

  const t = useMemo(() => translations[lang] || translations.en, [lang]);

  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); }, []);
  const logAction = useCallback(async (action) => { try { if (userProfile?.tenant_id) await supabase.from('audits').insert([{ action, user_id: userProfile.id, tenant_id: userProfile.tenant_id, created_at: new Date().toISOString() }]); } catch (e) { console.warn('Audit:', e.message); } }, [userProfile]);

  const fetchAll = useCallback(async (tenantId) => {
    if (!tenantId) return;
    try {
      const [i,c,co,cr,v,p,b,po,e,s,ex,cb,pa,ms,at,se,ad] = await Promise.all([
        supabase.from('invoices').select('*, customers(name,phone), corporates(name), employees(name)').eq('tenant_id', tenantId).order('invoice_date',{ascending:false}),
        supabase.from('customers').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('corporates').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('creditors').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('vendors').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('packages').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('branches').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('portals').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('employees').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('services').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('expenses').select('*').eq('tenant_id', tenantId).order('expense_date',{ascending:false}),
        supabase.from('cashbook').select('*').eq('tenant_id', tenantId).order('trans_date',{ascending:false}).limit(500),
        supabase.from('payroll').select('*, employees(name,role)').eq('tenant_id', tenantId).order('month',{ascending:false}),
        supabase.from('staff_mistakes').select('*, employees(name,role)').eq('tenant_id', tenantId).order('date',{ascending:false}),
        supabase.from('attendance').select('*, employees(name)').eq('tenant_id', tenantId).order('date',{ascending:false}),
        supabase.from('settings').select('*').eq('tenant_id', tenantId).maybeSingle(),
        supabase.from('emp_advances').select('*').eq('tenant_id', tenantId).order('date',{ascending:false})
      ]);
      setData(prev => ({...prev, invoices:i.data||[], customers:c.data||[], corporates:co.data||[], creditors:cr.data||[], vendors:v.data||[], packages:p.data||[], branches:b.data||[], portals:po.data||[], employees:e.data||[], services:s.data||[], expenses:ex.data||[], cashbook:cb.data||[], payroll:pa.data||[], staffMistakes:ms.data||[], attendance:at.data||[], settings:se.data||{}, empAdvances:ad.data||[]}));
    } catch (err) { console.error('fetchAll:', err); }
  }, []);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    const init = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!url || url.includes('dummy')) { setInitError('NEXT_PUBLIC_SUPABASE_URL not set in Vercel Environment Variables.'); setLoading(false); return; }
        const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
        if (authErr) { setInitError('Auth error: ' + authErr.message); setLoading(false); router.push('/login'); return; }
        if (!authUser) { setLoading(false); router.push('/login'); return; }
        setUser(authUser);
        const { data: profile, error: pErr } = await supabase.from('app_users').select('*').eq('id', authUser.id).maybeSingle();
        if (pErr) { setInitError('Profile error: ' + pErr.message); setLoading(false); return; }
        if (!profile) { setInitError('No profile found for your account. Contact admin.'); setLoading(false); return; }
        if (!profile.is_super_admin) {
          const { data: tenant } = await supabase.from('tenants').select('is_paid, subscription_end_date').eq('id', profile.tenant_id).maybeSingle();
          if (tenant && !tenant.is_paid && tenant.subscription_end_date && new Date(tenant.subscription_end_date) < new Date()) { setInitError('Subscription expired on ' + tenant.subscription_end_date); setLoading(false); router.push('/subscription'); return; }
        }
        setUserProfile(profile);
        setProfileForm({ username: profile.username||'', avatar_url: profile.avatar_url||'', phone: profile.phone||'', address: profile.address||'' });
        await fetchAll(profile.tenant_id);
        setLoading(false);
      } catch (err) { console.error('Init:', err); setInitError('Failed: ' + err.message); setLoading(false); }
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => { if (event === 'SIGNED_OUT') { setUser(null); setUserProfile(null); router.push('/login'); } });
    return () => { subscription.unsubscribe(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    user, setUser, userProfile, setUserProfile, loading, setLoading, initError,
    lang, setLang, t, page, setPage, modal, setModal, toast, setToast, showToast,
    chatOpen, setChatOpen, chatMessages, setChatMessages, chatInput, setChatInput,
    search, setSearch, tblPage, setTblPage, payFilter, setPayFilter,
    previewHTML, setPreviewHTML, repDate, setRepDate, reportTab, setReportTab,
    data, setData, fetchAll, logAction,
    invForm, setInvForm, editInvId, setEditInvId,
    expForm, setExpForm, editExpId, setEditExpId,
    custForm, setCustForm, editCustId, setEditCustId,
    corpForm, setCorpForm, editCorpId, setEditCorpId,
    creditorForm, setCreditorForm, editCredId, setEditCredId,
    vendorForm, setVendorForm, editVendId, setEditVendId,
    pkgForm, setPkgForm, editPkgId, setEditPkgId,
    brnForm, setBrnForm, editBrnId, setEditBrnId,
    empForm, setEmpForm, editEmpId, setEditEmpId,
    srvForm, setSrvForm, editSrvId, setEditSrvId,
    investForm, setInvestForm,
    portalForm, setPortalForm,
    settleForm, setSettleForm,
    refundForm, setRefundForm,
    transferForm, setTransferForm,
    passForm, setPassForm,
    userForm, setUserForm, editUserId, setEditUserId,
    tenantForm, setTenantForm,
    profileForm, setProfileForm,
    setForm, setSetForm,
    payForm, setPayForm,
    contractCorpName, setContractCorpName, contractType, setContractType, contractMarkup, setContractMarkup, contractTerms, setContractTerms,
    today, router,
    getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getMistakeHTML, getContractHTML,
    filterData, exportToExcel
  };
}
