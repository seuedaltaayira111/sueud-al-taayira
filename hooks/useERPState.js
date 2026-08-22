'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [initError, setInitError] = useState(null);
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [data, setData] = useState({
    invoices: [],
    customers: [],
    corporates: [],
    creditors: [],
    vendors: [],
    packages: [],
    branches: [],
    portals: [],
    expenses: [],
    employees: [],
    payroll: [],
    cashbook: [],
    auditLogs: [],
    settings: null,
    tenants: [],
    staffMistakes: [],
    attendance: [],
    empAdvances: [],
    creditLimits: [],
    recurringInvoices: []
  });

  const [modal, setModal] = useState({ type: null, data: null });

  // ═══ INVOICE FORM - Matching invoices table ═══
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

  // ═══ EXPENSE FORM - Matching expenses table ═══
  const [expForm, setExpForm] = useState({
    expense_type: '',
    payment_mode: 'Cash',
    amount: '',
    description: '',
    expense_date: today,
    items: []
  });

  // ═══ CORPORATE FORM - Matching corporates table ═══
  const [corpForm, setCorpForm] = useState({
    name: '',
    vat_no: '',
    phone: '',
    address: ''
  });

  // ═══ CREDITOR FORM - Matching creditors table ═══
  const [creditorForm, setCreditorForm] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // ═══ CUSTOMER FORM - Matching customers table ═══
  const [custForm, setCustForm] = useState({
    name: '',
    phone: '',
    store_credit: 0,
    credit_limit: 0
  });

  // ═══ VENDOR FORM - Matching vendors table ═══
  const [vendorForm, setVendorForm] = useState({
    name: '',
    phone: '',
    balance: 0
  });

  // ═══ PACKAGE FORM - Matching packages table ═══
  const [pkgForm, setPkgForm] = useState({
    name: '',
    price: '',
    desc: '',
    duration: '',
    inclusions: ''
  });

  // ═══ BRANCH FORM - Matching branches table (NO status column) ═══
  const [brnForm, setBrnForm] = useState({
    name: '',
    location: '',
    phone: '',
    manager: '',
    email: '',
    timing: ''
  });

  // ═══ EMPLOYEE FORM - Matching employees table (salary NOT base_salary, NO position/branch_id/is_active) ═══
  const [empForm, setEmpForm] = useState({
    name: '',
    phone: '',
    role: '',
    salary: '',
    commission_rate: '',
    iqama_no: ''
  });

  // ═══ OTHER FORMS ═══
  const [srvForm, setSrvForm] = useState({ name: '', description: '' });
  const [investForm, setInvestForm] = useState({ investor_name: '', amount: '', date: today, notes: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({
    id: '',
    date: today,
    compRefund: 0,
    custRefund: 0,
    mode: 'Cash',
    reason: '',
    portalId: '',
    creditBalance: 0
  });
  const [transferForm, setTransferForm] = useState({ fromPortal: '', toPortal: '', amount: '', date: today, notes: '' });
  const [setForm, setSetForm] = useState({
    company_name_en: '',
    company_name_ar: '',
    address_ar: '',
    phone: '',
    website: '',
    vat_no: '',
    cr_no: '',
    license_no: '',
    tourism_license_no: '',
    logo_url: '',
    custom_fields: []
  });
  const [userForm, setUserForm] = useState({ email: '', role: 'Staff', tenant_id: '', is_admin: false });
  const [portalForm, setPortalForm] = useState({ name: '', current_balance: 0, portal_type: 'Airlines' });
  const [tenantForm, setTenantForm] = useState({
    agency_name: '',
    owner_email: '',
    subscription_end_date: '',
    company_name_ar: '',
    vat_no: '',
    cr_no: '',
    phone: '',
    address_ar: ''
  });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '', phone: '', address: '' });
  const [passForm, setPassForm] = useState({ newPass: '' });
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [previewHTML, setPreviewHTML] = useState('');
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Standard');
  const [contractMarkup, setContractMarkup] = useState('10');
  const [contractTerms, setContractTerms] = useState('');
  const [payForm, setPayForm] = useState({
    employee_id: '',
    month: '',
    salary: 0,
    commission_rate: 0,
    commission_amount: 0,
    overtime: 0,
    advance_deduction: 0,
    mistakes_deduction: 0,
    other_deduction: 0,
    gift: 0,
    payment_mode: 'Cash'
  });

  // ═══ EDIT IDS ═══
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

  // ═══ TOAST ═══
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ═══ AUDIT LOG - Using user_email (matching table) ═══
  const logAction = useCallback(async (action) => {
    if (!userProfile?.tenant_id) return;
    try {
      await supabase.from('audit_logs').insert([{
        user_email: userProfile.email || user?.email || 'unknown',
        action: action,
        tenant_id: userProfile.tenant_id
      }]);
    } catch (e) {
      console.warn('Audit log failed:', e.message);
    }
  }, [userProfile, user]);

  // ═══ SAFE FETCH ═══
  const safeFetch = useCallback(async (table, query, fallback = []) => {
    try {
      const { data, error } = await query;
      if (error) {
        console.warn(`[ERP] ${table}:`, error.message);
        return fallback;
      }
      return data || fallback;
    } catch (err) {
      console.warn(`[ERP] ${table}:`, err.message);
      return fallback;
    }
  }, []);

  // ═══ FETCH ALL DATA ═══
  const fetchAll = useCallback(async () => {
    if (!userProfile?.tenant_id) return;
    const tid = userProfile.tenant_id;

    try {
      const results = await Promise.all([
        safeFetch('invoices', supabase.from('invoices').select('*, customers(name,phone), corporates(name,vat_no), employees(name)').eq('tenant_id', tid).order('created_at', { ascending: false }).limit(500)),
        safeFetch('customers', supabase.from('customers').select('*').eq('tenant_id', tid).order('name')),
        safeFetch('corporates', supabase.from('corporates').select('*').eq('tenant_id', tid).order('name')),
        safeFetch('creditors', supabase.from('creditors').select('*').eq('tenant_id', tid).order('name')),
        safeFetch('vendors', supabase.from('vendors').select('*').eq('tenant_id', tid).order('name')),
        safeFetch('packages', supabase.from('packages').select('*').eq('tenant_id', tid).order('name')),
        safeFetch('branches', supabase.from('branches').select('*').eq('tenant_id', tid).order('name')),
        safeFetch('portals', supabase.from('portals').select('*').eq('tenant_id', tid).order('name')),
        safeFetch('expenses', supabase.from('expenses').select('*').eq('tenant_id', tid).order('expense_date', { ascending: false }).limit(200)),
        safeFetch('employees', supabase.from('employees').select('*').eq('tenant_id', tid).order('name')),
        safeFetch('payroll', supabase.from('payroll').select('*, employees(name,role)').eq('tenant_id', tid).order('month', { ascending: false }).limit(100)),
        safeFetch('cashbook', supabase.from('cashbook').select('*').eq('tenant_id', tid).order('trans_date', { ascending: false }).limit(500)),
        safeFetch('auditLogs', supabase.from('audit_logs').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }).limit(100)),
        safeFetch('settings', supabase.from('settings').select('*').eq('tenant_id', tid).maybeSingle(), null),
        safeFetch('staffMistakes', supabase.from('staff_mistakes').select('*').eq('tenant_id', tid).order('date', { ascending: false }).limit(100)),
        safeFetch('attendance', supabase.from('attendance').select('*, employees(name)').eq('tenant_id', tid).order('date', { ascending: false }).limit(300)),
        safeFetch('empAdvances', supabase.from('employee_advances').select('*, employees(name)').eq('tenant_id', tid).order('date', { ascending: false }).limit(100)),
        safeFetch('creditLimits', supabase.from('customers').select('id, name, credit_limit, store_credit').eq('tenant_id', tid).gt('credit_limit', 0)),
        safeFetch('recurringInvoices', supabase.from('recurring_invoices').select('*').eq('tenant_id', tid))
      ]);

      setData(prev => ({
        ...prev,
        invoices: results[0],
        customers: results[1],
        corporates: results[2],
        creditors: results[3],
        vendors: results[4],
        packages: results[5],
        branches: results[6],
        portals: results[7],
        expenses: results[8],
        employees: results[9],
        payroll: results[10],
        cashbook: results[11],
        auditLogs: results[12],
        settings: results[13],
        staffMistakes: results[14],
        attendance: results[15],
        empAdvances: results[16],
        creditLimits: results[17],
        recurringInvoices: results[18]
      }));

      if (results[13]?.lang) setLang(results[13].lang);
    } catch (err) {
      console.error('[ERP] FetchAll:', err);
    }
  }, [userProfile?.tenant_id, safeFetch]);

  // ═══ INITIALIZE AUTH & PROFILE ═══
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError) {
          console.warn('[ERP] Auth:', authError.message);
          if (mounted) setInitError('Auth failed: ' + authError.message);
          return;
        }

        if (!session?.user) {
          console.log('[ERP] No session');
          if (mounted) router.push('/login');
          return;
        }

        if (mounted) setUser(session.user);

        // Fetch profile from app_users
        const { data: profile, error: profileError } = await supabase
          .from('app_users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.warn('[ERP] Profile:', profileError.message);
        }

        if (profile && mounted) {
          setUserProfile(profile);
          setProfileForm({
            username: profile.username || '',
            avatar_url: profile.avatar_url || '',
            phone: profile.phone || '',
            address: profile.address || ''
          });
        } else if (mounted) {
          // Fallback profile if not found
          setUserProfile({
            id: session.user.id,
            email: session.user.email,
            name: session.user.email?.split('@')[0] || 'User',
            role: 'Staff',
            is_admin: false,
            can_access_invoices: true,
            can_access_bank: false,
            can_access_hr: false,
            can_access_reports: false,
            can_access_settings: false,
            tenant_id: null,
            username: session.user.email?.split('@')[0] || 'User',
            avatar_url: null,
            phone: '',
            address: ''
          });
        }
      } catch (err) {
        console.error('[ERP] Init:', err);
        if (mounted) setInitError('Init error: ' + err.message);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && mounted) {
        router.push('/login');
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  // ═══ FETCH DATA WHEN PROFILE READY ═══
  useEffect(() => {
    if (userProfile?.tenant_id) {
      fetchAll();
    }
  }, [userProfile?.tenant_id, fetchAll]);

  return {
    user, setUser,
    userProfile, setUserProfile,
    initError, setInitError,
    lang, setLang,
    page, setPage,
    toast, setToast, showToast,
    data, setData,
    modal, setModal,
    invForm, setInvForm,
    expForm, setExpForm,
    corpForm, setCorpForm,
    creditorForm, setCreditorForm,
    custForm, setCustForm,
    vendorForm, setVendorForm,
    pkgForm, setPkgForm,
    brnForm, setBrnForm,
    empForm, setEmpForm,
    srvForm, setSrvForm,
    investForm, setInvestForm,
    settleForm, setSettleForm,
    refundForm, setRefundForm,
    transferForm, setTransferForm,
    setForm, setSetForm,
    userForm, setUserForm,
    portalForm, setPortalForm,
    tenantForm, setTenantForm,
    profileForm, setProfileForm,
    passForm, setPassForm,
    chatInput, setChatInput,
    chatMessages, setChatMessages,
    previewHTML, setPreviewHTML,
    contractCorpName, setContractCorpName,
    contractType, setContractType,
    contractMarkup, setContractMarkup,
    contractTerms, setContractTerms,
    payForm, setPayForm,
    editInvId, setEditInvId,
    editExpId, setEditExpId,
    editCorpId, setEditCorpId,
    editCredId, setEditCredId,
    editCustId, setEditCustId,
    editVendId, setEditVendId,
    editPkgId, setEditPkgId,
    editBrnId, setEditBrnId,
    editEmpId, setEditEmpId,
    editSrvId, setEditSrvId,
    editUserId, setEditUserId,
    today, router,
    logAction, fetchAll
  };
}
