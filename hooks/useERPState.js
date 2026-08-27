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

/* ================================================================
   TRANSLATIONS - COMPLETE BILINGUAL
   ================================================================ */
const translations = {
  en: {
    // Main
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
    // Travel Features
    flight_status: '🛫 Flight Status',
    hotel_booking: '🏨 Hotel Booking',
    visa_processing: '🛂 Visa Processing',
    travel_insurance: '🛡️ Travel Insurance',
    hajj_umrah: '🕋 Hajj/Umrah',
    corporate_travel: '🏢 Corporate Travel',
    frequent_flyer: '🌟 Frequent Flyer',
    // Advanced Features
    expense_voucher: '📄 Expense Voucher',
    staff_mistake_voucher: '⚠️ Staff Mistake Voucher',
    salary_slip: '📄 Salary Slip',
    contract_document: '📄 Contract Document',
    offer_document: '📄 Offer Document',
    // Invoice Types
    sales_invoice: '📄 Sales Invoice',
    refund_invoice: '📄 Refund Invoice',
    proforma_invoice: '📄 Proforma Invoice',
    // Payment Methods
    payment_cash: '💰 Cash',
    payment_bank: '🏦 Bank Transfer',
    payment_card: '💳 Card',
    payment_credit: '📝 Credit',
    payment_tabby: '📱 Tabby',
    payment_tamara: '📱 Tamara',
    payment_credit_balance: '💳 Credit Balance',
    // Status
    status_paid: '✅ Paid',
    status_unpaid: '⏳ Unpaid',
    status_refunded: '🔄 Refunded',
    status_draft: '📄 Draft',
    status_cancelled: '❌ Cancelled',
    // Employee
    employee_sales: 'Sales',
    employee_accountant: 'Accountant',
    employee_manager: 'Manager',
    employee_admin: 'Admin',
    employee_hr: 'HR',
    employee_support: 'Support',
    // Travel Services
    service_flight: '✈️ Flight Ticket',
    service_hotel: '🏨 Hotel',
    service_visa: '🛂 Visa',
    service_package: '📦 Tour Package',
    service_insurance: '🛡️ Insurance',
    service_hajj: '🕋 Hajj',
    service_umrah: '🕋 Umrah',
    service_corporate: '🏢 Corporate Travel',
    // Flight Types
    flight_domestic: 'Domestic',
    flight_international: 'International',
    flight_single: 'Single',
    flight_return: 'Return',
    flight_multi: 'Multi-City',
    // Visa Types
    visa_tourist: 'Tourist',
    visa_business: 'Business',
    visa_work: 'Work',
    visa_transit: 'Transit',
    visa_hajj: 'Hajj',
    visa_umrah: 'Umrah',
    visa_student: 'Student',
    // Insurance Types
    insurance_single: 'Single Trip',
    insurance_annual: 'Annual',
    insurance_family: 'Family',
    insurance_group: 'Group',
    // Coverage Types
    coverage_standard: 'Standard',
    coverage_premium: 'Premium',
    coverage_comprehensive: 'Comprehensive',
    // Hajj/Umrah Types
    hajj_standard: 'Standard Hajj',
    hajj_vip: 'VIP Hajj',
    umrah_standard: 'Standard Umrah',
    umrah_vip: 'VIP Umrah',
    // Package Status
    package_available: 'Available',
    package_filling: 'Filling Fast',
    package_sold: 'Sold Out',
    package_completed: 'Completed',
    // Portal Types
    portal_gds: 'GDS',
    portal_airline: 'Airline Direct',
    portal_consolidator: 'Consolidator',
    portal_hotel: 'Hotel Supplier',
    portal_other: 'Other',
    // Branch Status
    branch_active: 'Active',
    branch_inactive: 'Inactive',
    // Employee Roles
    role_sales: 'Sales',
    role_accountant: 'Accountant',
    role_manager: 'Manager',
    role_admin: 'Admin',
    role_hr: 'HR',
    role_support: 'Support',
    // Expense Types
    expense_office: 'Office Expense',
    expense_travel: 'Travel Expense',
    expense_supplies: 'Supplies',
    expense_utilities: 'Utilities',
    expense_rent: 'Rent',
    expense_salary: 'Salary',
    expense_other: 'Other',
    // Approval Status
    approval_pending: 'Pending',
    approval_approved: 'Approved',
    approval_rejected: 'Rejected',
    // Attendance Status
    attendance_present: 'Present',
    attendance_leave: 'Leave',
    attendance_absent: 'Absent',
    // Leave Types
    leave_annual: 'Annual',
    leave_sick: 'Sick',
    leave_emergency: 'Emergency',
    leave_unpaid: 'Unpaid',
    // Employee Advance Status
    advance_pending: 'Pending',
    advance_repaid: 'Repaid',
    advance_deducted: 'Deducted from Salary',
    // Mistake Status
    mistake_paid: 'Paid by Employee',
    mistake_not_paid: 'Not Paid',
    // Contract Types
    contract_flight: 'Flight Tickets',
    contract_hotel: 'Hotel Booking',
    contract_visa: 'Visa Services',
    contract_hajj: 'Hajj/Umrah Packages',
    contract_complete: 'Complete Travel Management',
    // Recurring Intervals
    interval_monthly: 'Monthly',
    interval_yearly: 'Yearly',
    interval_weekly: 'Weekly',
    interval_quarterly: 'Quarterly',
    // Tier Levels
    tier_blue: 'Blue',
    tier_silver: 'Silver',
    tier_gold: 'Gold',
    tier_platinum: 'Platinum',
    tier_diamond: 'Diamond',
    // Frequent Flyer Status
    ff_active: 'Active',
    ff_inactive: 'Inactive',
    ff_expired: 'Expired',
    // Payment Status
    payment_confirmed: 'Confirmed',
    payment_pending: 'Pending',
    payment_failed: 'Failed',
    payment_refunded: 'Refunded',
    // Ticket Status
    ticket_confirmed: 'Confirmed',
    ticket_on_hold: 'On Hold',
    ticket_cancelled: 'Cancelled',
    // Refund Reasons
    refund_airline: 'Cancel by Airline',
    refund_customer: 'Cancel by Customer',
    refund_date: 'Date Change',
    refund_no_show: 'No Show',
    refund_duplicate: 'Duplicate Booking',
    refund_visa: 'Visa Rejected',
    refund_other: 'Other',
    // Booking Types
    booking_new: 'New Booking',
    booking_reissue: 'Reissue',
    booking_date_change: 'Date Change',
    booking_void: 'Void',
    // Flight Journey
    journey_single: 'Single',
    journey_return: 'Return',
    journey_multi: 'Multi-City',
    // Refundable Status
    refundable_yes: 'Refundable',
    refundable_no: 'Non-Refundable',
  },
  ar: {
    // Main
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
    // Travel Features
    flight_status: '🛫 حالة الرحلة',
    hotel_booking: '🏨 حجز الفنادق',
    visa_processing: '🛂 معالجة التأشيرات',
    travel_insurance: '🛡️ التأمين على السفر',
    hajj_umrah: '🕋 باقات الحج والعمرة',
    corporate_travel: '🏢 السفر المؤسسي',
    frequent_flyer: '🌟 المسافر الدائم',
    // Advanced Features
    expense_voucher: '📄 سند مصروفات',
    staff_mistake_voucher: '⚠️ سند خطأ الموظف',
    salary_slip: '📄 قسيمة راتب',
    contract_document: '📄 وثيقة عقد',
    offer_document: '📄 وثيقة عرض',
    // Invoice Types
    sales_invoice: '📄 فاتورة مبيعات',
    refund_invoice: '📄 فاتورة استرجاع',
    proforma_invoice: '📄 فاتورة أولية',
    // Payment Methods
    payment_cash: '💰 نقداً',
    payment_bank: '🏦 تحويل بنكي',
    payment_card: '💳 بطاقة',
    payment_credit: '📝 آجل',
    payment_tabby: '📱 تابي',
    payment_tamara: '📱 تمارة',
    payment_credit_balance: '💳 رصيد مستحق',
    // Status
    status_paid: '✅ مدفوعة',
    status_unpaid: '⏳ غير مدفوعة',
    status_refunded: '🔄 مسترجعة',
    status_draft: '📄 مسودة',
    status_cancelled: '❌ ملغية',
    // Employee
    employee_sales: 'مبيعات',
    employee_accountant: 'محاسب',
    employee_manager: 'مدير',
    employee_admin: 'مدير نظام',
    employee_hr: 'موارد بشرية',
    employee_support: 'دعم فني',
    // Travel Services
    service_flight: '✈️ تذكرة طيران',
    service_hotel: '🏨 فندق',
    service_visa: '🛂 تأشيرة',
    service_package: '📦 باقة سياحية',
    service_insurance: '🛡️ تأمين',
    service_hajj: '🕋 حج',
    service_umrah: '🕋 عمرة',
    service_corporate: '🏢 سفر مؤسسي',
    // Flight Types
    flight_domestic: 'داخلي',
    flight_international: 'دولي',
    flight_single: 'ذهاب',
    flight_return: 'ذهاب وعودة',
    flight_multi: 'متعدد المدن',
    // Visa Types
    visa_tourist: 'سياحية',
    visa_business: 'أعمال',
    visa_work: 'عمل',
    visa_transit: 'عبور',
    visa_hajj: 'حج',
    visa_umrah: 'عمرة',
    visa_student: 'طالب',
    // Insurance Types
    insurance_single: 'رحلة واحدة',
    insurance_annual: 'سنوي',
    insurance_family: 'عائلي',
    insurance_group: 'مجموعة',
    // Coverage Types
    coverage_standard: 'قياسي',
    coverage_premium: 'مميز',
    coverage_comprehensive: 'شامل',
    // Hajj/Umrah Types
    hajj_standard: 'حج قياسي',
    hajj_vip: 'حج VIP',
    umrah_standard: 'عمرة قياسية',
    umrah_vip: 'عمرة VIP',
    // Package Status
    package_available: 'متاح',
    package_filling: 'يكتمل بسرعة',
    package_sold: 'نفذ',
    package_completed: 'مكتمل',
    // Portal Types
    portal_gds: 'GDS',
    portal_airline: 'مباشر مع الخطوط',
    portal_consolidator: 'تجميعي',
    portal_hotel: 'مورد فنادق',
    portal_other: 'أخرى',
    // Branch Status
    branch_active: 'نشط',
    branch_inactive: 'غير نشط',
    // Employee Roles
    role_sales: 'مبيعات',
    role_accountant: 'محاسب',
    role_manager: 'مدير',
    role_admin: 'مدير نظام',
    role_hr: 'موارد بشرية',
    role_support: 'دعم فني',
    // Expense Types
    expense_office: 'مصروفات مكتبية',
    expense_travel: 'مصروفات سفر',
    expense_supplies: 'مستلزمات',
    expense_utilities: 'فواتير',
    expense_rent: 'إيجار',
    expense_salary: 'رواتب',
    expense_other: 'أخرى',
    // Approval Status
    approval_pending: 'قيد الانتظار',
    approval_approved: 'معتمد',
    approval_rejected: 'مرفوض',
    // Attendance Status
    attendance_present: 'حاضر',
    attendance_leave: 'إجازة',
    attendance_absent: 'غائب',
    // Leave Types
    leave_annual: 'سنوية',
    leave_sick: 'مرضية',
    leave_emergency: 'طارئة',
    leave_unpaid: 'غير مدفوعة',
    // Employee Advance Status
    advance_pending: 'قيد الانتظار',
    advance_repaid: 'تم السداد',
    advance_deducted: 'مخصوم من الراتب',
    // Mistake Status
    mistake_paid: 'مدفوع من الموظف',
    mistake_not_paid: 'غير مدفوع',
    // Contract Types
    contract_flight: 'تذاكر طيران',
    contract_hotel: 'حجز فنادق',
    contract_visa: 'خدمات تأشيرات',
    contract_hajj: 'باقات حج وعمرة',
    contract_complete: 'إدارة سفر متكاملة',
    // Recurring Intervals
    interval_monthly: 'شهري',
    interval_yearly: 'سنوي',
    interval_weekly: 'أسبوعي',
    interval_quarterly: 'ربع سنوي',
    // Tier Levels
    tier_blue: 'أزرق',
    tier_silver: 'فضي',
    tier_gold: 'ذهبي',
    tier_platinum: 'بلاتيني',
    tier_diamond: 'ماسي',
    // Frequent Flyer Status
    ff_active: 'نشط',
    ff_inactive: 'غير نشط',
    ff_expired: 'منتهي',
    // Payment Status
    payment_confirmed: 'مؤكد',
    payment_pending: 'قيد الانتظار',
    payment_failed: 'فشل',
    payment_refunded: 'مسترجعة',
    // Ticket Status
    ticket_confirmed: 'مؤكد',
    ticket_on_hold: 'معلق',
    ticket_cancelled: 'ملغي',
    // Refund Reasons
    refund_airline: 'إلغاء من الخطوط',
    refund_customer: 'إلغاء من العميل',
    refund_date: 'تغيير التاريخ',
    refund_no_show: 'عدم الحضور',
    refund_duplicate: 'حجز مكرر',
    refund_visa: 'رفض التأشيرة',
    refund_other: 'أخرى',
    // Booking Types
    booking_new: 'حجز جديد',
    booking_reissue: 'إعادة إصدار',
    booking_date_change: 'تغيير التاريخ',
    booking_void: 'إلغاء',
    // Flight Journey
    journey_single: 'ذهاب',
    journey_return: 'ذهاب وعودة',
    journey_multi: 'متعدد المدن',
    // Refundable Status
    refundable_yes: 'قابل للاسترجاع',
    refundable_no: 'غير قابل للاسترجاع',
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
  const [theme, setTheme] = useState('light');
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
    flightStatus: [],
    hotelBookings: [],
    contracts: [],
    offers: [],
    recurringInvoices: [],
    expenseApprovals: [],
    quotations: [],
    proformaInvoices: [],
    employeeTargets: [],
    leaveRequests: [],
    payrollHistory: [],
    mistakeVouchers: [],
    expenseVouchers: [],
    salarySlips: [],
    refundRequests: [],
    creditNotes: [],
    debitNotes: [],
    journalEntries: [],
    accountBalances: [],
    taxReports: [],
    salesReports: [],
    purchaseReports: [],
    inventoryItems: [],
    inventoryTransactions: [],
    customerGroups: [],
    supplierGroups: [],
    employeeGroups: [],
    branchTransfers: [],
    portalTransactions: [],
    bankReconciliations: [],
    cashFlows: [],
    profitCenters: [],
    costCenters: [],
    budgets: [],
    forecasts: [],
    kpis: [],
    alerts: [],
    reminders: [],
    userActivities: [],
    systemLogs: [],
    backupLogs: [],
    emailLogs: [],
    smsLogs: [],
    notificationLogs: [],
    paymentGateways: [],
    shippingMethods: [],
    taxRates: [],
    currencies: [],
    exchangeRates: [],
    countries: [],
    cities: [],
    airports: [],
    airlines: [],
    hotels: [],
    tourOperators: [],
    insuranceCompanies: [],
    visaServices: [],
    transportCompanies: [],
    guides: [],
    translators: [],
    eventPlanners: [],
    weddingPlanners: [],
    conferenceOrganizers: [],
    exhibitionOrganizers: [],
    sportsEventOrganizers: [],
    entertainmentOrganizers: [],
    educationConsultants: [],
    medicalTourism: [],
    wellnessCenters: [],
    spaCenters: [],
    adventureTourism: [],
    ecoTourism: [],
    culturalTourism: [],
    religiousTourism: [],
    businessTourism: [],
    leisureTourism: [],
    luxuryTourism: [],
    budgetTourism: [],
    familyTourism: [],
    soloTourism: [],
    groupTourism: [],
    corporateTourism: [],
    incentiveTourism: [],
    meetingTourism: [],
    conventionTourism: [],
    exhibitionTourism: [],
    eventTourism: [],
    sportsTourism: [],
    musicTourism: [],
    filmTourism: [],
    fashionTourism: [],
    foodTourism: [],
    wineTourism: [],
    heritageTourism: [],
    natureTourism: [],
    wildlifeTourism: [],
    beachTourism: [],
    mountainTourism: [],
    desertTourism: [],
    cityTourism: [],
    ruralTourism: [],
    agriculturalTourism: [],
    industrialTourism: [],
    educationalTourism: [],
    volunteerTourism: [],
    healthTourism: [],
    spaTourism: [],
    yogaTourism: [],
    meditationTourism: [],
    retreatTourism: [],
    pilgrimageTourism: [],
    historicalTourism: [],
    archaeologicalTourism: [],
    museumTourism: [],
    galleryTourism: [],
    theatreTourism: [],
    concertTourism: [],
    festivalTourism: [],
    paradeTourism: [],
    carnivalTourism: [],
    fairTourism: [],
    marketTourism: [],
    shoppingTourism: [],
    nightlifeTourism: [],
    diningTourism: [],
    cruiseTourism: [],
    safariTourism: [],
    trekkingTourism: [],
    campingTourism: [],
    fishingTourism: [],
    huntingTourism: [],
    skiingTourism: [],
    snowboardingTourism: [],
    surfingTourism: [],
    divingTourism: [],
    snorkelingTourism: [],
    kayakingTourism: [],
    raftingTourism: [],
    climbingTourism: [],
    bungeeTourism: [],
    skydivingTourism: [],
    paraglidingTourism: [],
    hotAirBalloonTourism: [],
    helicopterTourism: [],
    privateJetTourism: [],
    yachtTourism: [],
    luxuryCruiseTourism: [],
    expeditionTourism: [],
    explorationTourism: [],
    discoveryTourism: [],
    adventureTravel: [],
    luxuryTravel: [],
    businessTravel: [],
    leisureTravel: [],
    groupTravel: [],
    soloTravel: [],
    familyTravel: [],
    couplesTravel: [],
    friendsTravel: [],
    seniorTravel: [],
    studentTravel: [],
    youthTravel: [],
    womenTravel: [],
    menTravel: [],
    lgbtTravel: [],
    accessibleTravel: [],
    petFriendlyTravel: [],
    ecoFriendlyTravel: [],
    sustainableTravel: [],
    responsibleTravel: [],
    ethicalTravel: [],
    culturalTravel: [],
    heritageTravel: [],
    culinaryTravel: [],
    wineTravel: [],
    beerTravel: [],
    coffeeTravel: [],
    teaTravel: [],
    chocolateTravel: [],
    cheeseTravel: [],
    breadTravel: [],
    oliveOilTravel: [],
    honeyTravel: [],
    spiceTravel: [],
    herbTravel: [],
    flowerTravel: [],
    gardenTravel: [],
    parkTravel: [],
    zooTravel: [],
    aquariumTravel: [],
    museumTravel: [],
    galleryTravel: [],
    theatreTravel: [],
    operaTravel: [],
    balletTravel: [],
    symphonyTravel: [],
    jazzTravel: [],
    bluesTravel: [],
    rockTravel: [],
    popTravel: [],
    classicalTravel: [],
    folkTravel: [],
    worldMusicTravel: [],
    danceTravel: [],
    festivalTravel: [],
    paradeTravel: [],
    carnivalTravel: [],
    fairTravel: [],
    marketTravel: [],
    shoppingTravel: [],
    nightlifeTravel: [],
    diningTravel: [],
    cruiseTravel: [],
    safariTravel: [],
    trekkingTravel: [],
    campingTravel: [],
    fishingTravel: [],
    huntingTravel: [],
    skiingTravel: [],
    snowboardingTravel: [],
    surfingTravel: [],
    divingTravel: [],
    snorkelingTravel: [],
    kayakingTravel: [],
    raftingTravel: [],
    climbingTravel: [],
    bungeeTravel: [],
    skydivingTravel: [],
    paraglidingTravel: [],
    hotAirBalloonTravel: [],
    helicopterTravel: [],
    privateJetTravel: [],
    yachtTravel: [],
    luxuryCruiseTravel: [],
    expeditionTravel: [],
    explorationTravel: [],
    discoveryTravel: [],
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
        visaRes, insuranceRes, hajjRes, corpTravelRes, ffRes, hotelRes
      ] = await Promise.all([
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
        supabase.from('visa_applications').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('insurance_policies').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('hajj_umrah_packages').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('corporate_travel').select('*, corporates(name)').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('frequent_flyer').select('*').eq('tenant_id', tid).order('points', { ascending: false }),
        supabase.from('hotel_bookings').select('*').eq('tenant_id', tid).order('created_at', { ascending: false })
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
        frequentFlyer: ffRes.data || [],
        hotelBookings: hotelRes.data || []
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
    mistakeForm, setMistakeForm,
    leaveForm, setLeaveForm,
    contractForm, setContractForm,

    // Chat
    chatInput, setChatInput, chatMessages, setChatMessages,

    // Contract
    contractCorpName, setContractCorpName,
    contractType, setContractType,
    contractMarkup, setContractMarkup,
    contractTerms, setContractTerms,

    // HTML Generators
    getInvoiceHTML, getRefundHTML, getExpenseHTML,
    getSalarySlipHTML, getContractHTML, getMistakeHTML
  };
}
