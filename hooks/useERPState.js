// hooks/useERPState.js
'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Import translations separately
import { translations } from '@/utils/translations';

// Import HTML generators separately
import { getInvoiceHTML, getRefundHTML } from '@/utils/htmlGenerators';

// Import utilities
import { filterData, exportToExcel } from '@/utils/dataUtils';

/**
 * Custom hook for ERP state management
 * Manages all application state, initialization, and data fetching
 */
export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const initDone = useRef(false);
  const subscriptionRef = useRef(null);

  // ==================== AUTH STATE ====================
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState('');

  // ==================== UI STATE ====================
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

  // ==================== REPORT STATE ====================
  const [repDate, setRepDate] = useState({ from: '', to: '' });
  const [reportTab, setReportTab] = useState('sales');

  // ==================== DATA STATE ====================
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
    services: [],
    expenses: [],
    investments: [],
    cashbook: [],
    payroll: [],
    empAdvances: [],
    staffMistakes: [],
    attendance: [],
    appUsers: [],
    tenants: [],
    audits: [],
    settings: {}
  });

  // ==================== FORM STATES ====================
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

  const [editInvId, setEditInvId] = useState(null);

  // Generic form states for simple CRUD entities
  const [forms, setForms] = useState({
    expense: { date: today, category: 'General', description: '', payment_mode: 'Cash', portal_id: '', items: [{ name: '', amount: 0, category: 'General' }] },
    customer: { name: '', phone: '', store_credit: 0 },
    corporate: { name: '', vat_no: '', phone: '', address: '' },
    creditor: { name: '', phone: '', address: '' },
    vendor: { name: '', phone: '', balance: 0 },
    package: { name: '', price: '', desc: '', duration: '', inclusions: '' },
    branch: { name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' },
    employee: { name: '', role: 'Sales', salary: 0, phone: '', commission_rate: 0, iqama_no: '', iqama_expiry: '' },
    service: { name: '' },
    investor: { name: '', phone: '', email: '', invested_amount: 0, profit_share_percent: 0 },
    portal: { name: '', portal_type: 'GDS', current_balance: 0, initial_balance: 0, phone: '', contact_person: '', credit_limit: 0 },
    settle: { id: '', date: today, mode: 'Cash' },
    refund: { id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '', creditBalance: 0 },
    transfer: { from: 'Cash', to: 'Bank', amount: 0, date: today, description: '' },
    password: { newPass: '' },
    user: { username: '', email: '', is_admin: false, can_access_hr: false, can_access_bank: false, can_access_invoices: true, can_access_reports: false, can_access_settings: false },
    tenant: { agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' },
    profile: { username: '', avatar_url: '', phone: '', address: '' },
    settings: { company_name_en: '', company_name_ar: '', address_ar: '', phone: '', vat_no: '', cr_no: '', license_no: '', logo_url: '', invoice_footer: '', custom_fields: [] },
    payroll: { employee_id: '', month: today.slice(0, 7), overtime: 0, gift: 0, advance: 0, mistakes_deduction: 0, other_deduction: 0, payment_mode: 'Cash', payment_date: today, notes: '' }
  });

  // Edit IDs for all entities
  const [editIds, setEditIds] = useState({
    expense: null,
    customer: null,
    corporate: null,
    creditor: null,
    vendor: null,
    package: null,
    branch: null,
    employee: null,
    service: null,
    user: null
  });

  // Contract state
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState(0);
  const [contractTerms, setContractTerms] = useState('');

  // ==================== GENERIC FORM HANDLERS ====================
  const updateForm = useCallback((formType, field, value) => {
    setForms(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        [field]: value
      }
    }));
  }, []);

  const resetForm = useCallback((formType, defaultValues = {}) => {
    setForms(prev => ({
      ...prev,
      [formType]: defaultValues
    }));
  }, []);

  const setEditId = useCallback((entityType, id) => {
    setEditIds(prev => ({
      ...prev,
      [entityType]: id
    }));
  }, []);

  // ==================== UTILITY FUNCTIONS ====================
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  const logAction = useCallback(async (action) => {
    try {
      if (userProfile?.tenant_id) {
        await supabase.from('audits').insert([{
          action,
          user_id: userProfile.id,
          tenant_id: userProfile.tenant_id,
          created_at: new Date().toISOString()
        }]);
      }
    } catch (e) {
      console.warn('Audit logging failed:', e.message);
    }
  }, [userProfile]);

  // ==================== MEMOIZED VALUES ====================
  const t = useMemo(() => translations[lang] || translations.en, [lang]);

  // ==================== DATA FETCHING ====================
  const fetchAll = useCallback(async (tenantId) => {
    if (!tenantId) return;

    try {
      const queries = [
        { key: 'invoices', query: supabase.from('invoices').select('*, customers(name,phone), corporates(name), employees(name)').eq('tenant_id', tenantId).order('invoice_date', { ascending: false }) },
        { key: 'customers', query: supabase.from('customers').select('*').eq('tenant_id', tenantId).order('name') },
        { key: 'corporates', query: supabase.from('corporates').select('*').eq('tenant_id', tenantId).order('name') },
        { key: 'creditors', query: supabase.from('creditors').select('*').eq('tenant_id', tenantId).order('name') },
        { key: 'vendors', query: supabase.from('vendors').select('*').eq('tenant_id', tenantId).order('name') },
        { key: 'packages', query: supabase.from('packages').select('*').eq('tenant_id', tenantId).order('name') },
        { key: 'branches', query: supabase.from('branches').select('*').eq('tenant_id', tenantId).order('name') },
        { key: 'portals', query: supabase.from('portals').select('*').eq('tenant_id', tenantId).order('name') },
        { key: 'employees', query: supabase.from('employees').select('*').eq('tenant_id', tenantId).order('name') },
        { key: 'services', query: supabase.from('services').select('*').eq('tenant_id', tenantId).order('name') },
        { key: 'expenses', query: supabase.from('expenses').select('*').eq('tenant_id', tenantId).order('expense_date', { ascending: false }) },
        { key: 'cashbook', query: supabase.from('cashbook').select('*').eq('tenant_id', tenantId).order('trans_date', { ascending: false }).limit(500) },
        { key: 'payroll', query: supabase.from('payroll').select('*, employees(name,role)').eq('tenant_id', tenantId).order('month', { ascending: false }) },
        { key: 'staffMistakes', query: supabase.from('staff_mistakes').select('*, employees(name,role)').eq('tenant_id', tenantId).order('date', { ascending: false }) },
        { key: 'attendance', query: supabase.from('attendance').select('*, employees(name)').eq('tenant_id', tenantId).order('date', { ascending: false }) },
        { key: 'settings', query: supabase.from('settings').select('*').eq('tenant_id', tenantId).maybeSingle() },
        { key: 'empAdvances', query: supabase.from('emp_advances').select('*').eq('tenant_id', tenantId).order('date', { ascending: false }) }
      ];

      const results = await Promise.all(queries.map(q => q.query));
      
      const newData = {};
      queries.forEach((q, index) => {
        newData[q.key] = results[index].data || (q.key === 'settings' ? {} : []);
      });

      setData(prev => ({ ...prev, ...newData }));
    } catch (err) {
      console.error('fetchAll error:', err);
      showToast('Failed to fetch data: ' + err.message);
    }
  }, [showToast]);

  // ==================== REAL-TIME SUBSCRIPTIONS ====================
  const setupRealtimeSubscriptions = useCallback((tenantId) => {
    if (!tenantId) return;

    // Clean up existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Subscribe to important tables
    const channels = ['invoices', 'customers', 'portals', 'cashbook'].map(table => {
      return supabase
        .channel(`${table}-changes`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: table,
          filter: `tenant_id=eq.${tenantId}`
        }, (payload) => {
          console.log(`Realtime ${table} change:`, payload.eventType);
          // Fetch only the changed table instead of all data
          fetchSingleTable(table, tenantId);
        })
        .subscribe();
    });

    subscriptionRef.current = {
      unsubscribe: () => channels.forEach(ch => supabase.removeChannel(ch))
    };
  }, [fetchAll]);

  // Fetch single table for realtime updates
  const fetchSingleTable = useCallback(async (table, tenantId) => {
    try {
      let query;
      switch (table) {
        case 'invoices':
          query = supabase.from('invoices').select('*, customers(name,phone), corporates(name), employees(name)').eq('tenant_id', tenantId).order('invoice_date', { ascending: false });
          break;
        case 'customers':
          query = supabase.from('customers').select('*').eq('tenant_id', tenantId).order('name');
          break;
        case 'portals':
          query = supabase.from('portals').select('*').eq('tenant_id', tenantId).order('name');
          break;
        case 'cashbook':
          query = supabase.from('cashbook').select('*').eq('tenant_id', tenantId).order('trans_date', { ascending: false }).limit(500);
          break;
        default:
          return;
      }

      const { data: tableData } = await query;
      if (tableData) {
        setData(prev => ({
          ...prev,
          [table]: tableData
        }));
      }
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
    }
  }, []);

  // ==================== INITIALIZATION ====================
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const init = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!url || url.includes('dummy')) {
          setInitError('NEXT_PUBLIC_SUPABASE_URL not set in Vercel Environment Variables.');
          setLoading(false);
          return;
        }

        const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
        if (authErr) {
          setInitError('Auth error: ' + authErr.message);
          setLoading(false);
          router.push('/login');
          return;
        }

        if (!authUser) {
          setLoading(false);
          router.push('/login');
          return;
        }

        setUser(authUser);

        const { data: profile, error: pErr } = await supabase
          .from('app_users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (pErr) {
          setInitError('Profile error: ' + pErr.message);
          setLoading(false);
          return;
        }

        if (!profile) {
          setInitError('No profile found for your account. Contact admin.');
          setLoading(false);
          return;
        }

        // Check subscription status
        if (!profile.is_super_admin) {
          const { data: tenant } = await supabase
            .from('tenants')
            .select('is_paid, subscription_end_date')
            .eq('id', profile.tenant_id)
            .maybeSingle();

          if (tenant && !tenant.is_paid && tenant.subscription_end_date && new Date(tenant.subscription_end_date) < new Date()) {
            setInitError('Subscription expired on ' + tenant.subscription_end_date);
            setLoading(false);
            router.push('/subscription');
            return;
          }
        }

        setUserProfile(profile);
        updateForm('profile', 'username', profile.username || '');
        updateForm('profile', 'avatar_url', profile.avatar_url || '');
        updateForm('profile', 'phone', profile.phone || '');
        updateForm('profile', 'address', profile.address || '');

        await fetchAll(profile.tenant_id);
        
        // Setup realtime subscriptions
        setupRealtimeSubscriptions(profile.tenant_id);
        
        setLoading(false);
      } catch (err) {
        console.error('Init error:', err);
        setInitError('Failed: ' + err.message);
        setLoading(false);
      }
    };

    init();

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ==================== RETURN STATE ====================
  return {
    // Auth
    user, setUser, userProfile, setUserProfile, loading, setLoading, initError,
    
    // UI
    lang, setLang, t, page, setPage, modal, setModal, toast, setToast, showToast,
    chatOpen, setChatOpen, chatMessages, setChatMessages, chatInput, setChatInput,
    search, setSearch, tblPage, setTblPage, payFilter, setPayFilter,
    previewHTML, setPreviewHTML, repDate, setRepDate, reportTab, setReportTab,
    
    // Data
    data, setData, fetchAll, fetchSingleTable, logAction,
    
    // Forms (backward compatible)
    invForm, setInvForm, editInvId, setEditInvId,
    expForm: forms.expense, setExpForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, expense: val(prev.expense) })) : setForms(prev => ({ ...prev, expense: val })),
    editExpId: editIds.expense, setEditExpId: (id) => setEditId('expense', id),
    custForm: forms.customer, setCustForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, customer: val(prev.customer) })) : setForms(prev => ({ ...prev, customer: val })),
    editCustId: editIds.customer, setEditCustId: (id) => setEditId('customer', id),
    corpForm: forms.corporate, setCorpForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, corporate: val(prev.corporate) })) : setForms(prev => ({ ...prev, corporate: val })),
    editCorpId: editIds.corporate, setEditCorpId: (id) => setEditId('corporate', id),
    creditorForm: forms.creditor, setCreditorForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, creditor: val(prev.creditor) })) : setForms(prev => ({ ...prev, creditor: val })),
    editCredId: editIds.creditor, setEditCredId: (id) => setEditId('creditor', id),
    vendorForm: forms.vendor, setVendorForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, vendor: val(prev.vendor) })) : setForms(prev => ({ ...prev, vendor: val })),
    editVendId: editIds.vendor, setEditVendId: (id) => setEditId('vendor', id),
    pkgForm: forms.package, setPkgForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, package: val(prev.package) })) : setForms(prev => ({ ...prev, package: val })),
    editPkgId: editIds.package, setEditPkgId: (id) => setEditId('package', id),
    brnForm: forms.branch, setBrnForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, branch: val(prev.branch) })) : setForms(prev => ({ ...prev, branch: val })),
    editBrnId: editIds.branch, setEditBrnId: (id) => setEditId('branch', id),
    empForm: forms.employee, setEmpForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, employee: val(prev.employee) })) : setForms(prev => ({ ...prev, employee: val })),
    editEmpId: editIds.employee, setEditEmpId: (id) => setEditId('employee', id),
    srvForm: forms.service, setSrvForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, service: val(prev.service) })) : setForms(prev => ({ ...prev, service: val })),
    editSrvId: editIds.service, setEditSrvId: (id) => setEditId('service', id),
    investForm: forms.investor, setInvestForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, investor: val(prev.investor) })) : setForms(prev => ({ ...prev, investor: val })),
    portalForm: forms.portal, setPortalForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, portal: val(prev.portal) })) : setForms(prev => ({ ...prev, portal: val })),
    settleForm: forms.settle, setSettleForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, settle: val(prev.settle) })) : setForms(prev => ({ ...prev, settle: val })),
    refundForm: forms.refund, setRefundForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, refund: val(prev.refund) })) : setForms(prev => ({ ...prev, refund: val })),
    transferForm: forms.transfer, setTransferForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, transfer: val(prev.transfer) })) : setForms(prev => ({ ...prev, transfer: val })),
    passForm: forms.password, setPassForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, password: val(prev.password) })) : setForms(prev => ({ ...prev, password: val })),
    userForm: forms.user, setUserForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, user: val(prev.user) })) : setForms(prev => ({ ...prev, user: val })),
    editUserId: editIds.user, setEditUserId: (id) => setEditId('user', id),
    tenantForm: forms.tenant, setTenantForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, tenant: val(prev.tenant) })) : setForms(prev => ({ ...prev, tenant: val })),
    profileForm: forms.profile, setProfileForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, profile: val(prev.profile) })) : setForms(prev => ({ ...prev, profile: val })),
    setForm: forms.settings, setSetForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, settings: val(prev.settings) })) : setForms(prev => ({ ...prev, settings: val })),
    payForm: forms.payroll, setPayForm: (val) => typeof val === 'function' ? setForms(prev => ({ ...prev, payroll: val(prev.payroll) })) : setForms(prev => ({ ...prev, payroll: val })),
    
    // Contract
    contractCorpName, setContractCorpName, contractType, setContractType,
    contractMarkup, setContractMarkup, contractTerms, setContractTerms,
    
    // Utilities
    today, router,
    
    // HTML Generators
    getInvoiceHTML, getRefundHTML,
    
    // Data Utils
    filterData, exportToExcel,
    
    // Generic form handlers (new)
    updateForm, resetForm, setEditId,
    forms, editIds
  };
}
