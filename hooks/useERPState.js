'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Basic HTML generators
const getInvoiceHTML = (inv, s, lang) => `<div style="font-family:sans-serif;padding:20px;"><h1>Invoice ${inv.invoice_no}</h1><p>Customer: ${inv.customers?.name || 'N/A'}</p><p>Total: ${inv.total} SAR</p></div>`;
const getExpenseHTML = (exp, s) => `<div style="font-family:sans-serif;padding:20px;"><h1>Expense ${exp.invoice_no}</h1><p>Vendor: ${exp.vendor_name}</p><p>Total: ${exp.amount} SAR</p></div>`;
const getContractHTML = (s, name, date, isOffer, type, markup, terms) => `<div style="font-family:sans-serif;padding:20px;"><h1>Contract for ${name}</h1><p>Type: ${type}</p><p>Markup: ${markup}</p></div>`;

export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [toast, setToast] = useState(null);
  const [data, setData] = useState({
    invoices: [], customers: [], corporates: [], creditors: [], portals: [],
    cashbook: [], expenses: [], investments: [], employees: [], payroll: [],
    appUsers: [], branches: [], packages: [], vendors: [], services: [],
    recharges: [], audits: [], empAdvances: [], tenants: [], settings: {}
  });

  const [page, setPage] = useState('dashboard');
  const [tblPage, setTblPage] = useState(1);
  const [lang, setLang] = useState('en');
  const [modal, setModal] = useState({ type: null, data: null });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hello! How can I help you?' }]);
  const [chatInput, setChatInput] = useState('');
  const [previewHTML, setPreviewHTML] = useState('');
  const [search, setSearch] = useState('');
  const [payFilter, setPayFilter] = useState('All');
  const [repDate, setRepDate] = useState({ from: today, to: today });
  const [reportTab, setReportTab] = useState('sales');
  const [statementTab, setStatementTab] = useState('sales');
  const [ledgerEmpId, setLedgerEmpId] = useState('');
  const [ledgerCustId, setLedgerCustId] = useState('');
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState(0);
  const [contractTerms, setContractTerms] = useState('');

  // Forms
  const [invForm, setInvForm] = useState({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '' });
  const [expForm, setExpForm] = useState({ vendor_name: '', vendor_vat: '', expense_date: today, expense_type: 'Office Supplies', payment_mode: 'Cash', items: [{ name: '', qty: 1, price: 0 }], taxRate: '15', desc: '' });
  const [custForm, setCustForm] = useState({ name: '', phone: '', store_credit: 0 });
  const [corpForm, setCorpForm] = useState({ name: '', vat_no: '', phone: '', address: '' });
  const [creditorForm, setCreditorForm] = useState({ name: '', phone: '', address: '' });
  const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '', duration: '', inclusions: '' });
  const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
  const [empForm, setEmpForm] = useState({ name: '', role: 'Sales', salary: 0, phone: '', commission_rate: 0, iqama_no: '', iqama_expiry: '' });
  const [srvForm, setSrvForm] = useState({ name: '' });
  const [portalForm, setPortalForm] = useState({ name: '', balance: 0 });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, desc: '', mode: 'Cash', reason: 'Other', otherReason: '' });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: '', date: today });
  const [setForm, setSetForm] = useState({ company_name_en: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '', license_no: '', tourist_license_no: '', invoice_footer: '', logo_url: '', custom_fields: [] });
  const [userForm, setUserForm] = useState({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false });
  const [passForm, setPassForm] = useState({ newPass: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '' });
  const [tenantForm, setTenantForm] = useState({ agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '', phone: '', address: '' });

  // Edit IDs
  const [editInvId, setEditInvId] = useState(null);
  const [editExpId, setEditExpId] = useState(null);
  const [editCustId, setEditCustId] = useState(null);
  const [editCorpId, setEditCorpId] = useState(null);
  const [editCredId, setEditCredId] = useState(null);
  const [editVendId, setEditVendId] = useState(null);
  const [editPkgId, setEditPkgId] = useState(null);
  const [editBrnId, setEditBrnId] = useState(null);
  const [editEmpId, setEditEmpId] = useState(null);
  const [editSrvId, setEditSrvId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  const tr = {
    dashboard: 'Dashboard', create: 'Create Invoice', list: 'Invoices', refunds: 'Refunds',
    customers: 'Customers', corporates: 'Corporates', creditors: 'Creditors', credit: 'Credit Balances',
    vendors: 'Vendors', packages: 'Packages', branches: 'Branches', portals: 'Portals', bank: 'Bank & Cash',
    invest: 'Investors', hr: 'Human Resources', users: 'Users', settings: 'Settings', reports: 'Reports',
    audit: 'Audit Logs', statements: 'Statements', contract: 'Contracts', offer: 'Offers',
    superadmin: 'SuperAdmin', profile: 'Profile', profitability: 'Profitability',
    search: 'Search...', download_excel: 'Export Excel', logout: 'Logout', changePass: 'Change Password',
    dash: 'Dashboard'
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const logAction = async (action) => {
    if (!userProfile?.id) return;
    try {
      await supabase.from('audits').insert([{ user_email: userProfile.email, action, tenant_id: userProfile.tenant_id }]);
    } catch (e) { console.error("Audit Error:", e) }
  };

  // REAL DATA FETCHING FROM SUPABASE
  const fetchAll = useCallback(async () => {
    if (!userProfile?.tenant_id) return;
    const tId = userProfile.tenant_id;
    
    try {
      const [inv, cust, corp, cred, por, cash, exp, emp, appU, set, ten, pay, adv] = await Promise.all([
        supabase.from('invoices').select(`*, customers(name), corporates(name), employees(name)`).eq('tenant_id', tId),
        supabase.from('customers').select('*').eq('tenant_id', tId),
        supabase.from('corporates').select('*').eq('tenant_id', tId),
        supabase.from('creditors').select('*').eq('tenant_id', tId),
        supabase.from('portals').select('*').eq('tenant_id', tId),
        supabase.from('cashbook').select('*').eq('tenant_id', tId),
        supabase.from('expenses').select('*').eq('tenant_id', tId),
        supabase.from('employees').select('*').eq('tenant_id', tId),
        supabase.from('app_users').select('*').eq('tenant_id', tId),
        supabase.from('settings').select('*').eq('tenant_id', tId).maybeSingle(),
        supabase.from('tenants').select('*'),
        supabase.from('payroll').select('*, employees(name)').eq('tenant_id', tId),
        supabase.from('employee_advances').select('*, employees(name)').eq('tenant_id', tId)
      ]);

      setData({
        invoices: inv.data || [],
        customers: cust.data || [],
        corporates: corp.data || [],
        creditors: cred.data || [],
        portals: por.data || [],
        cashbook: cash.data || [],
        expenses: exp.data || [],
        employees: emp.data || [],
        appUsers: appU.data || [],
        settings: set.data || {},
        tenants: ten.data || [],
        payroll: pay.data || [],
        empAdvances: adv.data || [],
        investments: [], branches: [], packages: [], vendors: [], services: [], recharges: [], audits: [] // Fetch these if needed
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, [userProfile]);

  const exportToExcel = (data, filename) => {
    console.log("Exporting to Excel:", filename, data);
    alert("Excel export function needs to be implemented.");
  };

  const filterData = (arr, dateField) => {
    return arr.filter(item => {
      const d = item[dateField];
      if (!d) return true;
      return d >= repDate.from && d <= repDate.to;
    });
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        
        // REAL PROFILE FETCH FROM SUPABASE
        const { data: profileData } = await supabase
          .from('app_users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (profileData) {
          setUserProfile(profileData);
        } else {
          // Agar user app_users table mein nahi hai, toh SuperAdmin maan lo
          setUserProfile({ 
            id: session.user.id, 
            email: session.user.email, 
            username: session.user.email, 
            role: 'SuperAdmin', 
            is_admin: true, 
            can_access_invoices: true, 
            can_access_bank: true, 
            can_access_hr: true, 
            can_access_reports: true, 
            can_access_settings: true, 
            tenant_id: '00000000-0000-0000-0000-000000000000' // Default SuperAdmin Tenant
          });
        }
      } else {
        router.push('/login');
      }
    };
    getSession();
  }, [router]);

  // Jab userProfile load ho jaye, tabhi data fetch karo
  useEffect(() => {
    if (userProfile) {
      fetchAll();
    }
  }, [userProfile, fetchAll]);

  return {
    user, data, setData, userProfile, setUserProfile, toast, showToast, logAction, fetchAll,
    invForm, setInvForm, expForm, setExpForm, corpForm, setCorpForm, creditorForm, setCreditorForm,
    custForm, setCustForm, vendorForm, setVendorForm, pkgForm, setPkgForm, brnForm, setBrnForm,
    empForm, setEmpForm, srvForm, setSrvForm, investForm, setInvestForm, settleForm, setSettleForm,
    refundForm, setRefundForm, transferForm, setTransferForm, setForm, setSetForm, userForm, setUserForm,
    portalForm, setPortalForm, editInvId, setEditInvId, editExpId, setEditExpId, editCorpId, setEditCorpId,
    editCredId, setEditCredId, editCustId, setEditCustId, editVendId, setEditVendId, editPkgId, setEditPkgId,
    editBrnId, setEditBrnId, editEmpId, setEditEmpId, editSrvId, setEditSrvId, editUserId, setEditUserId,
    modal, setModal, passForm, setPassForm, chatInput, setChatInput, chatMessages, setChatMessages,
    previewHTML, setPreviewHTML, getInvoiceHTML, getExpenseHTML, getContractHTML, today, router,
    contractCorpName, setContractCorpName, contractType, setContractType, contractMarkup, setContractMarkup,
    contractTerms, setContractTerms, tenantForm, setTenantForm, profileForm, setProfileForm,
    ledgerEmpId, setLedgerEmpId, ledgerCustId, setLedgerCustId, repDate, setRepDate,
    reportTab, setReportTab, statementTab, setStatementTab, page, setPage, lang, setLang,
    chatOpen, setChatOpen, search, setSearch, payFilter, setPayFilter, tblPage, setTblPage, 
    exportToExcel, filterData, tr
  };
}
