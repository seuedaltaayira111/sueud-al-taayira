'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

/* ================================================================
   TRANSLATIONS - COMPLETE BILINGUAL
   ================================================================ */
const translations = {
  en: {
    // Main
    dashboard: 'Dashboard',
    create: 'Create Invoice',
    list: 'Invoices',
    refunds: 'Refunds',
    customers: 'Customers',
    corporates: 'Corporates',
    creditors: 'Creditors',
    credit: 'Credit Balances',
    vendors: 'Vendors',
    packages: 'Packages',
    branches: 'Branches',
    portals: 'Portals',
    bank: 'Bank & Cash',
    invest: 'Investors',
    hr: 'Human Resources',
    users: 'Users',
    settings: 'Settings',
    reports: 'Reports',
    audit: 'Audit Logs',
    statements: 'Statements',
    contract: 'Corporate Contract',
    offer: 'Corporate Offer',
    superadmin: 'SuperAdmin',
    profile: 'Profile',
    profitability: 'Profitability',
    notifications: 'Notifications',
    ai_dashboard: 'AI Dashboard',
    quotations: 'Quotations',
    hr_advanced: 'HR & Payroll',
    ai_pricing: 'AI Pricing',
    my_attendance: 'My Attendance',
    credit_limits: 'Credit Limits',
    customer_statement: 'Customer Statement',
    refund_statement: 'Refund Statement',
    supplier_statement: 'Supplier Statement',
    multi_branch: 'Multi-Branch',
    recurring_invoices: 'Recurring Invoices',
    expense_approval: 'Expense Approval',
    staff_mistakes: 'Staff Mistakes',
    expenses: 'Expenses',
    editInvoice: 'Edit Invoice',
    generateInvoice: 'Generate Invoice',
    updateInvoice: 'Update Invoice',
    custType: 'Customer Type',
    individual: 'Individual',
    corporate: 'Corporate',
    selectCustomer: 'Select Customer',
    customerPhone: 'Customer Phone',
    passengers: 'Passengers',
    addPassenger: '+ Add Passenger',
    portal: 'Portal',
    service: 'Service',
    flightTicket: 'Flight Ticket',
    hotel: 'Hotel Booking',
    tourPackage: 'Tour Package',
    visitVisa: 'Visit Visa',
    umrahVisa: 'Umrah Visa',
    newService: 'New Service',
    flightType: 'Flight Type',
    domestic: 'Domestic',
    international: 'International',
    airline: 'Airline',
    sector: 'Sector',
    pnr: 'PNR',
    ticketNo: 'Ticket No',
    qty: 'Quantity',
    cost: 'Cost',
    sell: 'Sell',
    discount: 'Discount',
    vatRate: 'VAT Rate',
    invoiceDate: 'Invoice Date',
    bookingType: 'Booking Type',
    newBooking: 'New Booking',
    reissue: 'Reissue',
    extraLuggage: 'Extra Luggage',
    previousBooking: 'Previous Booking',
    salesPerson: 'Sales Person',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    bankTransfer: 'Bank Transfer',
    card: 'Card / Network',
    credit: 'Credit',
    creditBalance: 'Credit Balance',
    tabby: 'Tabby',
    tamara: 'Tamara',
    paidAmount: 'Paid Amount',
    invNo: 'Inv No',
    total: 'Total',
    due: 'Due',
    method: 'Method',
    actions: 'Actions',
    preview: 'Preview',
    print: 'Print',
    edit: 'Edit',
    delete: 'Delete',
    refund: 'Refund',
    quickSettle: 'Settle',
    download_excel: 'Export Excel',
    save: 'Save',
    add: 'Add',
    search: 'Search...',
    changePass: 'Change Password',
    logout: 'Logout',
    selectEmployee: 'Select Employee',
    attendanceDate: 'Date',
    status: 'Status',
    present: 'Present',
    leave: 'Leave',
    absent: 'Absent',
    checkInTime: 'Check-In',
    checkOutTime: 'Check-Out',
    overtime: 'OT',
    deduction: 'Deduction',
    mark: 'Mark',
    baseSalary: 'Base Salary',
    commission: 'Commission %',
    advDed: 'Adv. Deduct',
    gift: 'Gift/Bonus',
    month: 'Month',
    mode: 'Mode',
    paySalary: 'Pay Salary',
    generateSlip: 'Generate Slip',
    target: 'Target (SAR)',
    achieved: 'Achieved',
    percentage: '%',
    balance: 'Balance'
  },
  ar: {
    // Main
    dashboard: 'لوحة التحكم',
    create: 'إنشاء فاتورة',
    list: 'الفواتير',
    refunds: 'الاسترجاعات',
    customers: 'العملاء',
    corporates: 'الشركات',
    creditors: 'الدائنون',
    credit: 'أرصدة مستحقة',
    vendors: 'الموردون',
    packages: 'الباقات',
    branches: 'الفروع',
    portals: 'البوابات',
    bank: 'البنك والصندوق',
    invest: 'المستثمرون',
    hr: 'الموارد البشرية',
    users: 'المستخدمون',
    settings: 'الإعدادات',
    reports: 'التقارير',
    audit: 'سجل التدقيق',
    statements: 'كشوفات',
    contract: 'عقد شركات',
    offer: 'عرض شركات',
    superadmin: 'المدير العام',
    profile: 'الملف الشخصي',
    profitability: 'الربحية',
    notifications: 'الإشعارات',
    ai_dashboard: 'لوحة ذكية',
    quotations: 'عروض أسعار',
    hr_advanced: 'الرواتب',
    ai_pricing: 'تسعير ذكي',
    my_attendance: 'حضوري',
    credit_limits: 'حدود الائتمان',
    customer_statement: 'كشف عميل',
    refund_statement: 'كشف استرجاع',
    supplier_statement: 'كشف مورد',
    multi_branch: 'متعدد الفروع',
    recurring_invoices: 'فواتير متكررة',
    expense_approval: 'اعتماد مصروفات',
    staff_mistakes: 'أخطاء الموظفين',
    expenses: 'المصروفات',
    editInvoice: 'تعديل الفاتورة',
    generateInvoice: 'إنشاء الفاتورة',
    updateInvoice: 'تحديث الفاتورة',
    custType: 'نوع العميل',
    individual: 'فرد',
    corporate: 'شركة',
    selectCustomer: 'اختر العميل',
    customerPhone: 'هاتف العميل',
    passengers: 'الركاب',
    addPassenger: '+ إضافة راكب',
    portal: 'البوابة',
    service: 'الخدمة',
    flightTicket: 'تذكرة طيران',
    hotel: 'حجز فندق',
    tourPackage: 'باقة سياحية',
    visitVisa: 'تأشيرة زيارة',
    umrahVisa: 'تأشيرة عمرة',
    newService: 'خدمة جديدة',
    flightType: 'نوع الرحلة',
    domestic: 'داخلي',
    international: 'دولي',
    airline: 'خط الطيران',
    sector: 'القطاع',
    pnr: 'رقم الحجز',
    ticketNo: 'رقم التذكرة',
    qty: 'الكمية',
    cost: 'التكلفة',
    sell: 'البيع',
    discount: 'الخصم',
    vatRate: 'نسبة الضريبة',
    invoiceDate: 'تاريخ الفاتورة',
    bookingType: 'نوع الحجز',
    newBooking: 'حجز جديد',
    reissue: 'إعادة إصدار',
    extraLuggage: 'أمتعة إضافية',
    previousBooking: 'حجز سابق',
    salesPerson: 'موظف المبيعات',
    paymentMethod: 'طريقة الدفع',
    cash: 'نقداً',
    bankTransfer: 'تحويل بنكي',
    card: 'بطاقة',
    credit: 'آجل',
    creditBalance: 'رصيد مستحق',
    tabby: 'تابي',
    tamara: 'تمارة',
    paidAmount: 'المبلغ المدفوع',
    invNo: 'رقم الفاتورة',
    total: 'الإجمالي',
    due: 'المتبقي',
    method: 'الطريقة',
    actions: 'إجراءات',
    preview: 'معاينة',
    print: 'طباعة',
    edit: 'تعديل',
    delete: 'حذف',
    refund: 'استرجاع',
    quickSettle: 'تسوية',
    download_excel: 'تصدير',
    save: 'حفظ',
    add: 'إضافة',
    search: 'بحث...',
    changePass: 'تغيير كلمة المرور',
    logout: 'تسجيل خروج',
    selectEmployee: 'اختر الموظف',
    attendanceDate: 'التاريخ',
    status: 'الحالة',
    present: 'حاضر',
    leave: 'إجازة',
    absent: 'غائب',
    checkInTime: 'وقت الحضور',
    checkOutTime: 'وقت الانصراف',
    overtime: 'إضافي',
    deduction: 'خصم',
    mark: 'تسجيل',
    baseSalary: 'الراتب الأساسي',
    commission: 'العمولة %',
    advDed: 'خصم سلفة',
    gift: 'هدية/مكافأة',
    month: 'الشهر',
    mode: 'الطريقة',
    paySalary: 'دفع الراتب',
    generateSlip: 'إنشاء قسيمة',
    target: 'الهدف (ريال)',
    achieved: 'المحقق',
    percentage: '%',
    balance: 'الرصيد'
  }
};

/* ================================================================
   MAIN HOOK - COMPLETE STATE
   ================================================================ */
export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  /* ===== CORE STATE ===== */
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [initError, setInitError] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState({ type: null, data: null });
  const [chatOpen, setChatOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState('');

  /* ===== DATA STATE ===== */
  const [data, setData] = useState({
    invoices: [],
    customers: [],
    corporates: [],
    creditors: [],
    vendors: [],
    packages: [],
    branches: [],
    portals: [],
    employees: [],
    expenses: [],
    cashbook: [],
    payroll: [],
    staffMistakes: [],
    auditLogs: [],
    settings: {},
    tenants: [],
    investments: [],
    empAdvances: [],
    services: [],
    attendance: [],
    appUsers: [],
    creditLimits: [],
    visaApplications: [],
    insurancePolicies: [],
    hajjUmrahPackages: [],
    corporateTravel: [],
    frequentFlyer: [],
    flightStatus: []
  });

  /* ===== INVOICE FORM ===== */
  const [invForm, setInvForm] = useState({
    custType: 'Individual',
    custId: 'new',
    custName: '',
    custPhone: '',
    corpId: 'new',
    corpName: '',
    corpVat: '',
    corpPhone: '',
    corpAddress: '',
    passengers: [''],
    employeeId: '',
    portalId: '',
    bookingDate: today,
    invoiceDate: today,
    bookingType: 'New Booking',
    linkedInvId: '',
    oldTicketNo: '',
    oldPnr: '',
    oldAirline: '',
    oldSector: '',
    oldSellPrice: 0,
    oldBookingDate: '',
    oldPassengers: '',
    oldFlightType: '',
    oldPaymentMethod: '',
    refundReason: '',
    service: 'Flight Ticket',
    flightType: 'Domestic',
    flightJourney: 'Single',
    refundable: 'Refundable',
    flightSector: '',
    airline: '',
    destination: '',
    hotelName: '',
    checkIn: '',
    checkOut: '',
    visaType: 'Tourist',
    serviceName: '',
    pnr: '',
    ticketNo: '',
    qty: 1,
    cost: 0,
    sell: 0,
    discount: 0,
    taxRate: '15',
    payment: 'Cash',
    paid: '',
    creditDueDate: '',
    creditorId: '',
    tabbyNo: '',
    tamaraNo: '',
    ticketStatus: 'Confirmed',
    useCredit: 0,
    creditCustId: '',
    status: 'Unpaid'
  });

  /* ===== EXPENSE FORM ===== */
  const [expForm, setExpForm] = useState({
    expense_type: '',
    payment_mode: 'Cash',
    description: '',
    expense_date: today,
    vendor_name: '',
    taxRate: '0',
    items: [{ name: '', qty: 1, price: 0 }],
    approval_status: 'Approved'
  });

  /* ===== OTHER FORMS ===== */
  const [corpForm, setCorpForm] = useState({ name: '', vat_no: '', phone: '', address: '' });
  const [creditorForm, setCreditorForm] = useState({ name: '', phone: '', address: '' });
  const [custForm, setCustForm] = useState({ name: '', phone: '', store_credit: 0 });
  const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '', duration: '', inclusions: '' });
  const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
  const [empForm, setEmpForm] = useState({
    name: '', phone: '', iqama_no: '', iqama_expiry: '', role: 'Sales',
    salary: 0, commission_rate: 0, nationality: '', job_title: '',
    national_id: '', join_date: '', bank_name: '', bank_account: '',
    labor_office_expiry: ''
  });
  const [srvForm, setSrvForm] = useState({ name: '' });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, mode: 'Cash', reason: 'Other', otherReason: '', desc: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '', creditBalance: 0 });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: '', date: today, description: '' });
  const [setForm, setSetForm] = useState({});
  const [userForm, setUserForm] = useState({
    email: '', username: '', role: 'Staff', is_admin: false,
    can_access_invoices: true, can_access_bank: false, can_access_hr: false,
    can_access_reports: false, can_access_settings: false, employee_id: ''
  });
  const [portalForm, setPortalForm] = useState({
    name: '', portal_type: 'GDS', current_balance: 0, initial_balance: 0,
    phone: '', contact_person: '', credit_limit: 0
  });
  const [tenantForm, setTenantForm] = useState({
    agency_name: '', owner_email: '', subscription_end_date: '',
    company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: ''
  });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '', phone: '', address: '' });
  const [passForm, setPassForm] = useState({ newPass: '' });
  const [payForm, setPayForm] = useState({
    employee_id: '', month: today.slice(0, 7), overtime: 0, gift: 0,
    advance: 0, mistakes_deduction: 0, other_deduction: 0,
    payment_mode: 'Cash', payment_date: today, notes: ''
  });

  /* ===== EDIT IDS ===== */
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

  /* ===== ADVANCE FORMS ===== */
  const [advForm, setAdvForm] = useState({ employee_id: '', amount: '', date: today, status: 'Pending' });

  /* ===== CHAT STATE ===== */
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: '👋 Hello! I am your AI Travel ERP Assistant. Type "help" to see what I can do.' }
  ]);

  /* ===== CONTRACT STATE ===== */
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState('10');
  const [contractTerms, setContractTerms] = useState('');

  /* ===== TRANSLATIONS ===== */
  const tr = translations[lang] || translations.en;

  /* ===== TOAST ===== */
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* ===== AUDIT LOG ===== */
  const logAction = useCallback(async (action) => {
    try {
      if (userProfile?.tenant_id) {
        await supabase.from('audit_logs').insert([{
          user_email: user?.email || 'Unknown',
          action,
          tenant_id: userProfile.tenant_id
        }]);
      }
    } catch (e) {
      console.error('Audit log error:', e);
    }
  }, [user?.email, userProfile?.tenant_id]);

  /* ===== FETCH ALL DATA ===== */
  const fetchAll = useCallback(async () => {
    if (!userProfile?.tenant_id) return;
    const tid = userProfile.tenant_id;

    try {
      const [
        invRes, custRes, corpRes, credRes, vendRes, pkgRes, brnRes,
        portRes, empRes, expRes, cashRes, payRes, mistRes, auditRes,
        setRes, srvRes, advRes, investRes, attRes, appUsersRes,
        visaRes, insuranceRes, hajjRes, corpTravelRes, ffRes
      ] = await Promise.all([
        supabase.from('invoices').select('*, customers(name,phone), corporates(name,vat_no,phone), employees(name,phone)').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('customers').select('*').eq('tenant_id', tid),
        supabase.from('corporates').select('*').eq('tenant_id', tid),
        supabase.from('creditors').select('*').eq('tenant_id', tid),
        supabase.from('vendors').select('*').eq('tenant_id', tid),
        supabase.from('packages').select('*').eq('tenant_id', tid),
        supabase.from('branches').select('*').eq('tenant_id', tid),
        supabase.from('portals').select('*').eq('tenant_id', tid),
        supabase.from('employees').select('*').eq('tenant_id', tid),
        supabase.from('expenses').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('cashbook').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('payroll').select('*, employees(name)').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('staff_mistakes').select('*, employees(name)').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }).limit(200),
        supabase.from('settings').select('*').eq('tenant_id', tid).maybeSingle(),
        supabase.from('services').select('*').eq('tenant_id', tid),
        supabase.from('emp_advances').select('*, employees(name)').eq('tenant_id', tid),
        supabase.from('investments').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('attendance').select('*, employees(name)').eq('tenant_id', tid).order('date', { ascending: false }),
        supabase.from('app_users').select('*').eq('tenant_id', tid),
        supabase.from('visa_applications').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('insurance_policies').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('hajj_umrah_packages').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('corporate_travel').select('*, corporates(name)').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('frequent_flyer').select('*').eq('tenant_id', tid).order('points', { ascending: false })
      ]);

      setData({
        invoices: invRes.data || [],
        customers: custRes.data || [],
        corporates: corpRes.data || [],
        creditors: credRes.data || [],
        vendors: vendRes.data || [],
        packages: pkgRes.data || [],
        branches: brnRes.data || [],
        portals: portRes.data || [],
        employees: empRes.data || [],
        expenses: expRes.data || [],
        cashbook: cashRes.data || [],
        payroll: payRes.data || [],
        staffMistakes: mistRes.data || [],
        auditLogs: auditRes.data || [],
        settings: setRes.data || {},
        services: srvRes.data || [],
        empAdvances: advRes.data || [],
        investments: investRes.data || [],
        attendance: attRes.data || [],
        appUsers: appUsersRes.data || [],
        visaApplications: visaRes.data || [],
        insurancePolicies: insuranceRes.data || [],
        hajjUmrahPackages: hajjRes.data || [],
        corporateTravel: corpTravelRes.data || [],
        frequentFlyer: ffRes.data || []
      });
    } catch (err) {
      console.error('Fetch all error:', err);
    }
  }, [userProfile?.tenant_id]);

  /* ===== AUTH INIT ===== */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          if (mounted) router.push('/login');
          return;
        }
        if (mounted) setUser(session.user);

        const { data: profile, error: profErr } = await supabase
          .from('app_users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profErr) {
          if (mounted) setInitError('Profile error: ' + profErr.message);
          return;
        }
        if (!profile) {
          if (mounted) setInitError('User profile not found. Contact admin.');
          return;
        }

        // Subscription check
        if (profile.role !== 'SuperAdmin' && profile.tenant_id) {
          const { data: tenant } = await supabase
            .from('tenants')
            .select('is_paid, subscription_end_date')
            .eq('id', profile.tenant_id)
            .maybeSingle();

          if (tenant && (!tenant.is_paid || new Date(tenant.subscription_end_date) < new Date())) {
            if (mounted) router.push('/subscription');
            return;
          }

          const { data: settings } = await supabase
            .from('settings')
            .select('id')
            .eq('tenant_id', profile.tenant_id)
            .maybeSingle();

          if (!settings) {
            if (mounted) router.push('/setup');
            return;
          }

          const { data: sData } = await supabase
            .from('settings')
            .select('*')
            .eq('tenant_id', profile.tenant_id)
            .maybeSingle();
          if (sData && mounted) setSetForm(sData);
        }

        if (mounted) {
          setUserProfile(profile);
          setProfileForm({
            username: profile.username || '',
            avatar_url: profile.avatar_url || '',
            phone: profile.phone || '',
            address: profile.address || ''
          });
        }
      } catch (err) {
        if (mounted) setInitError('Init failed: ' + err.message);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT') router.push('/login');
      if (session?.user) setUser(session.user);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  /* ===== AUTO FETCH ===== */
  useEffect(() => {
    if (userProfile?.tenant_id) {
      fetchAll();
    }
  }, [userProfile?.tenant_id, fetchAll]);

  /* ===== RETURN ===== */
  return {
    // Core
    user, setUser, userProfile, initError, lang, setLang,
    theme, setTheme, toast, page, setPage, modal, setModal,
    chatOpen, setChatOpen, previewHTML, setPreviewHTML,
    tr, today, router,

    // Data
    data, setData, showToast, logAction, fetchAll,

    // Invoice Form
    invForm, setInvForm, editInvId, setEditInvId,

    // Expense Form
    expForm, setExpForm, editExpId, setEditExpId,

    // Other Forms
    corpForm, setCorpForm, editCorpId, setEditCorpId,
    creditorForm, setCreditorForm, editCredId, setEditCredId,
    custForm, setCustForm, editCustId, setEditCustId,
    vendorForm, setVendorForm, editVendId, setEditVendId,
    pkgForm, setPkgForm, editPkgId, setEditPkgId,
    brnForm, setBrnForm, editBrnId, setEditBrnId,
    empForm, setEmpForm, editEmpId, setEditEmpId,
    srvForm, setSrvForm, editSrvId, setEditSrvId,
    investForm, setInvestForm,
    settleForm, setSettleForm,
    refundForm, setRefundForm,
    transferForm, setTransferForm,
    setForm, setSetForm,
    userForm, setUserForm, editUserId, setEditUserId,
    portalForm, setPortalForm,
    tenantForm, setTenantForm,
    profileForm, setProfileForm,
    passForm, setPassForm,
    payForm, setPayForm,
    advForm, setAdvForm,

    // Chat
    chatInput, setChatInput, chatMessages, setChatMessages,

    // Contract
    contractCorpName, setContractCorpName,
    contractType, setContractType,
    contractMarkup, setContractMarkup,
    contractTerms, setContractTerms
  };
}
