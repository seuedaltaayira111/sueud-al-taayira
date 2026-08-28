'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  getInvoiceHTML,
  getRefundHTML,
  getExpenseHTML,
  getSalarySlipHTML,
  getContractHTML,
  getMistakeHTML
} from '@/lib/invoiceHTML';

// ============================================================
// TRANSLATIONS (full)
// ============================================================
const translations = {
  en: {
    dashboard: '📊 Dashboard',
    create: '✈️ Create Invoice',
    list: '📋 Invoices',
    refunds: '🔄 Refunds',
    customers: '👤 Customers',
    corporates: '🏢 Corporates',
    creditors: '💳 Creditors',
    credit: '💰 Credit Balances',
    vendors: '🚚 Vendors',
    packages: '📦 Packages',
    branches: '🏢 Branches',
    portals: '🛫 Portals',
    bank: '🏦 Bank & Cash',
    invest: '📈 Investors',
    hr: '👨‍💼 Human Resources',
    users: '👥 Users',
    settings: '⚙️ Settings',
    reports: '📊 Reports',
    audit: '📜 Audit Logs',
    statements: '📑 Statements',
    contract: '📝 Corporate Contract',
    offer: '🎁 Corporate Offer',
    superadmin: '👑 SuperAdmin',
    profile: '👤 Profile',
    profitability: '📊 Profitability',
    notifications: '🔔 Notifications',
    ai_dashboard: '🤖 AI Dashboard',
    quotations: '📄 Quotations',
    hr_advanced: '👨‍💼 HR & Payroll',
    ai_pricing: '🤖 AI Pricing',
    my_attendance: '⏰ My Attendance',
    credit_limits: '💳 Credit Limits',
    customer_statement: '📊 Customer Statement',
    refund_statement: '📊 Refund Statement',
    supplier_statement: '📦 Supplier Statement',
    multi_branch: '🏢 Multi-Branch',
    recurring_invoices: '🔁 Recurring Invoices',
    expense_approval: '🛡️ Expense Approval',
    staff_mistakes: '⚠️ Staff Mistakes',
    expenses: '💸 Expenses',
    editInvoice: '✏️ Edit Invoice',
    generateInvoice: '✅ Generate Invoice',
    updateInvoice: '💾 Update Invoice',
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
    balance: 'Balance',
    flight_status: '🛫 Flight Status',
    hotel_booking: '🏨 Hotel Booking',
    visa_processing: '🛂 Visa Processing',
    travel_insurance: '🛡️ Travel Insurance',
    hajj_umrah: '🕋 Hajj/Umrah',
    corporate_travel: '🏢 Corporate Travel',
    frequent_flyer: '🌟 Frequent Flyer',
    expense_voucher: '📄 Expense Voucher',
    staff_mistake_voucher: '⚠️ Staff Mistake Voucher',
    salary_slip: '📄 Salary Slip',
    contract_document: '📄 Contract Document',
    offer_document: '📄 Offer Document',
    sales_invoice: '📄 Sales Invoice',
    refund_invoice: '📄 Refund Invoice',
    proforma_invoice: '📄 Proforma Invoice',
    payment_cash: '💰 Cash',
    payment_bank: '🏦 Bank Transfer',
    payment_card: '💳 Card',
    payment_credit: '📝 Credit',
    payment_tabby: '📱 Tabby',
    payment_tamara: '📱 Tamara',
    payment_credit_balance: '💳 Credit Balance',
    status_paid: '✅ Paid',
    status_unpaid: '⏳ Unpaid',
    status_refunded: '🔄 Refunded',
    status_draft: '📄 Draft',
    status_cancelled: '❌ Cancelled',
  },
  ar: {
    dashboard: '📊 لوحة التحكم',
    create: '✈️ إنشاء فاتورة',
    list: '📋 الفواتير',
    refunds: '🔄 الاسترجاعات',
    customers: '👤 العملاء',
    corporates: '🏢 الشركات',
    creditors: '💳 الدائنون',
    credit: '💰 أرصدة مستحقة',
    vendors: '🚚 الموردون',
    packages: '📦 الباقات',
    branches: '🏢 الفروع',
    portals: '🛫 البوابات',
    bank: '🏦 البنك والصندوق',
    invest: '📈 المستثمرون',
    hr: '👨‍💼 الموارد البشرية',
    users: '👥 المستخدمون',
    settings: '⚙️ الإعدادات',
    reports: '📊 التقارير',
    audit: '📜 سجل التدقيق',
    statements: '📑 كشوفات',
    contract: '📝 عقد شركات',
    offer: '🎁 عرض شركات',
    superadmin: '👑 المدير العام',
    profile: '👤 الملف الشخصي',
    profitability: '📊 الربحية',
    notifications: '🔔 الإشعارات',
    ai_dashboard: '🤖 لوحة ذكية',
    quotations: '📄 عروض أسعار',
    hr_advanced: '👨‍💼 الرواتب',
    ai_pricing: '🤖 تسعير ذكي',
    my_attendance: '⏰ حضوري',
    credit_limits: '💳 حدود الائتمان',
    customer_statement: '📊 كشف عميل',
    refund_statement: '📊 كشف استرجاع',
    supplier_statement: '📦 كشف مورد',
    multi_branch: '🏢 متعدد الفروع',
    recurring_invoices: '🔁 فواتير متكررة',
    expense_approval: '🛡️ اعتماد مصروفات',
    staff_mistakes: '⚠️ أخطاء الموظفين',
    expenses: '💸 المصروفات',
    editInvoice: '✏️ تعديل الفاتورة',
    generateInvoice: '✅ إنشاء الفاتورة',
    updateInvoice: '💾 تحديث الفاتورة',
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
    balance: 'الرصيد',
    flight_status: '🛫 حالة الرحلة',
    hotel_booking: '🏨 حجز الفنادق',
    visa_processing: '🛂 معالجة التأشيرات',
    travel_insurance: '🛡️ التأمين على السفر',
    hajj_umrah: '🕋 باقات الحج والعمرة',
    corporate_travel: '🏢 السفر المؤسسي',
    frequent_flyer: '🌟 المسافر الدائم',
    expense_voucher: '📄 سند مصروفات',
    staff_mistake_voucher: '⚠️ سند خطأ الموظف',
    salary_slip: '📄 قسيمة راتب',
    contract_document: '📄 وثيقة عقد',
    offer_document: '📄 وثيقة عرض',
    sales_invoice: '📄 فاتورة مبيعات',
    refund_invoice: '📄 فاتورة استرجاع',
    proforma_invoice: '📄 فاتورة أولية',
    payment_cash: '💰 نقداً',
    payment_bank: '🏦 تحويل بنكي',
    payment_card: '💳 بطاقة',
    payment_credit: '📝 آجل',
    payment_tabby: '📱 تابي',
    payment_tamara: '📱 تمارة',
    payment_credit_balance: '💳 رصيد مستحق',
    status_paid: '✅ مدفوعة',
    status_unpaid: '⏳ غير مدفوعة',
    status_refunded: '🔄 مسترجعة',
    status_draft: '📄 مسودة',
    status_cancelled: '❌ ملغية',
  }
};

export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  /* ===== CORE STATE ===== */
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('light');
  const [initError, setInitError] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState({ type: null, data: null });
  const [chatOpen, setChatOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState('');

  /* ===== DATA STATE – ONLY EXISTING TABLES ===== */
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
    corporateTravel: [],
    frequentFlyer: []
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
    expense_type: 'Office Expense',
    payment_mode: 'Cash',
    description: '',
    expense_date: today,
    vendor_name: '',
    vendor_id: '',
    taxRate: '0',
    items: [{ name: '', qty: 1, price: 0 }],
    approval_status: 'Approved',
    category: 'General',
    subtotal: 0,
    total: 0,
    notes: '',
    attachment: '',
  });

  /* ===== OTHER FORMS ===== */
  const [corpForm, setCorpForm] = useState({ name: '', vat_no: '', phone: '', address: '', email: '', website: '', industry: '', size: '', credit_limit: 0 });
  const [creditorForm, setCreditorForm] = useState({ name: '', phone: '', address: '', email: '', contact_person: '', balance: 0, credit_limit: 0 });
  const [custForm, setCustForm] = useState({ name: '', phone: '', store_credit: 0, email: '', address: '', nationality: '', passport_no: '', date_of_birth: '', gender: '', occupation: '', company: '', notes: '' });
  const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0, email: '', address: '', contact_person: '', tax_id: '', category: '', rating: 0, notes: '' });
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '', duration: '', inclusions: '', exclusions: '', terms: '', category: '', difficulty: '', min_age: '', max_age: '', group_size: '', start_date: '', end_date: '', status: 'Available' });
  const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active', address: '', latitude: '', longitude: '', timezone: '', currency: '', language: '', notes: '' });
  const [empForm, setEmpForm] = useState({
    name: '', phone: '', iqama_no: '', iqama_expiry: '', role: 'Sales',
    salary: 0, commission_rate: 0, nationality: '', job_title: '',
    national_id: '', join_date: '', bank_name: '', bank_account: '',
    labor_office_expiry: '', email: '', emergency_contact: '', emergency_phone: '',
    address: '', gender: '', date_of_birth: '', marital_status: '', dependents: 0,
    education: '', experience: '', skills: '', languages: '', certifications: '',
    work_email: '', work_phone: '', department: '', manager_id: '', leave_balance: 0,
    target: 0, performance_rating: 0, notes: ''
  });
  const [srvForm, setSrvForm] = useState({ name: '', description: '', price: 0, category: '', duration: '', provider: '', commission: 0, is_active: true });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, mode: 'Cash', reason: 'Other', otherReason: '', desc: '', email: '', phone: '', address: '', profit_share: 0, return_date: '', status: 'Active' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash', amount: '', reference: '', notes: '' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '', creditBalance: 0, notes: '', refund_to: 'customer' });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: '', date: today, description: '', reference: '', category: 'Internal' });
  const [setForm, setSetForm] = useState({});
  const [userForm, setUserForm] = useState({
    email: '', username: '', role: 'Staff', is_admin: false,
    can_access_invoices: true, can_access_bank: false, can_access_hr: false,
    can_access_reports: false, can_access_settings: false, employee_id: '',
    can_access_travel: false, can_access_finance: false, can_access_crm: false,
    can_access_contracts: false, can_access_audit: false, can_access_superadmin: false,
    language: 'en', theme: 'light', notifications_enabled: true
  });
  const [portalForm, setPortalForm] = useState({
    name: '', portal_type: 'GDS', current_balance: 0, initial_balance: 0,
    phone: '', contact_person: '', credit_limit: 0, email: '', address: '',
    api_key: '', api_secret: '', api_url: '', notes: '', status: 'Active'
  });
  const [tenantForm, setTenantForm] = useState({
    agency_name: '', owner_email: '', subscription_end_date: '',
    company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '',
    website: '', license_no: '', tourism_license_no: '', bank_name: '',
    bank_account: '', iban: '', swift_code: '', logo_url: '', favicon_url: '',
    primary_color: '', secondary_color: '', font_family: '', timezone: '',
    currency: 'SAR', language: 'en', country: 'SA', city: 'Riyadh',
    postal_code: '', po_box: '', tax_registration: '', commercial_registration: '',
    municipality_license: '', civil_defense_license: '', tourist_license: '',
    social_media: { facebook: '', instagram: '', twitter: '', youtube: '', linkedin: '' },
    settings: { invoice_prefix: 'INV', quote_prefix: 'QUO', refund_prefix: 'REF', default_tax: 15, default_currency: 'SAR' }
  });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '', phone: '', address: '', email: '', bio: '', website: '', social: { facebook: '', instagram: '', twitter: '', linkedin: '' } });
  const [passForm, setPassForm] = useState({ newPass: '', confirmPass: '' });
  const [payForm, setPayForm] = useState({
    employee_id: '', month: today.slice(0, 7), overtime: 0, gift: 0,
    advance: 0, mistakes_deduction: 0, other_deduction: 0,
    payment_mode: 'Cash', payment_date: today, notes: '',
    commission: 0, bonus: 0, allowance: 0, deductions: 0, net_salary: 0,
    basic_salary: 0, housing_allowance: 0, transport_allowance: 0, food_allowance: 0,
    phone_allowance: 0, internet_allowance: 0, medical_allowance: 0, education_allowance: 0,
    overtime_hours: 0, overtime_rate: 0, leave_days: 0, sick_days: 0, unpaid_days: 0,
    tax: 0, social_security: 0, insurance: 0, loan: 0, other_deductions: 0,
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
  const [advForm, setAdvForm] = useState({ employee_id: '', amount: '', date: today, status: 'Pending', reason: '', approved_by: '', approved_date: '', repayment_date: '', installments: 1, installment_amount: 0, notes: '' });
  const [mistakeForm, setMistakeForm] = useState({ employee_id: '', old_ticket_no: '', new_ticket_no: '', loss_amount: 0, paid_by_employee: false, reason: '', date: today, department: '', severity: 'Medium', notes: '' });
  const [leaveForm, setLeaveForm] = useState({ employee_id: '', type: 'Annual', start_date: today, end_date: today, reason: '', status: 'Pending', approved_by: '', approved_date: '', notes: '' });
  const [contractForm, setContractForm] = useState({ corporate_id: '', type: 'Flight Tickets', start_date: today, end_date: '', terms: '', markup: 10, status: 'Draft', signed_by: '', signed_date: '', notes: '' });

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

  /* ===== TOAST & LOG ===== */
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

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

  /* ===== FETCH ALL – ONLY EXISTING TABLES (Promise.allSettled) ===== */
  const fetchAll = useCallback(async () => {
    if (!userProfile?.tenant_id) return;
    const tid = userProfile.tenant_id;

    const queries = [
      supabase.from('invoices').select('*, customers(name,phone,store_credit), corporates(name,vat_no,phone), employees(name,phone)').eq('tenant_id', tid).order('created_at', { ascending: false }),
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
      supabase.from('corporate_travel').select('*, corporates(name)').eq('tenant_id', tid).order('created_at', { ascending: false }),
      supabase.from('frequent_flyer').select('*').eq('tenant_id', tid).order('points', { ascending: false })
    ];

    const results = await Promise.allSettled(queries);
    const keys = [
      'invoices', 'customers', 'corporates', 'creditors', 'vendors',
      'packages', 'branches', 'portals', 'employees', 'expenses',
      'cashbook', 'payroll', 'staffMistakes', 'auditLogs', 'settings',
      'services', 'empAdvances', 'investments', 'attendance', 'appUsers',
      'corporateTravel', 'frequentFlyer'
    ];

    const newData = {};
    keys.forEach((key, index) => {
      const result = results[index];
      if (result.status === 'fulfilled' && result.value.data) {
        newData[key] = result.value.data;
      } else {
        newData[key] = (key === 'settings') ? {} : [];
        if (result.status === 'rejected') {
          console.warn(`Failed to fetch ${key}:`, result.reason);
        }
      }
    });

    setData(prev => ({ ...prev, ...newData }));
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
            address: profile.address || '',
            email: profile.email || '',
            bio: profile.bio || '',
            website: profile.website || '',
            social: profile.social || { facebook: '', instagram: '', twitter: '', linkedin: '' }
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

  useEffect(() => {
    if (userProfile?.tenant_id) {
      fetchAll();
    }
  }, [userProfile?.tenant_id, fetchAll]);

  /* ===== RETURN ===== */
  return {
    user, setUser, userProfile, initError, lang, setLang,
    theme, setTheme, toast, page, setPage, modal, setModal,
    chatOpen, setChatOpen, previewHTML, setPreviewHTML,
    tr: translations[lang] || translations.en, today, router,
    data, setData, showToast, logAction, fetchAll,
    invForm, setInvForm, editInvId, setEditInvId,
    expForm, setExpForm, editExpId, setEditExpId,
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
    mistakeForm, setMistakeForm,
    leaveForm, setLeaveForm,
    contractForm, setContractForm,
    chatInput, setChatInput, chatMessages, setChatMessages,
    contractCorpName, setContractCorpName,
    contractType, setContractType,
    contractMarkup, setContractMarkup,
    contractTerms, setContractTerms,
    getInvoiceHTML, getRefundHTML, getExpenseHTML,
    getSalarySlipHTML, getContractHTML, getMistakeHTML
  };
}
