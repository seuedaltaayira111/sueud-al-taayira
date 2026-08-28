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

const translations = {
  en: { /* your existing translations */ },
  ar: { /* your existing translations */ }
};

export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

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

  // --- All form states (keep your existing ones) ---
  const [invForm, setInvForm] = useState({/* your existing */});
  const [expForm, setExpForm] = useState({/* your existing */});
  const [corpForm, setCorpForm] = useState({/* your existing */});
  const [creditorForm, setCreditorForm] = useState({/* your existing */});
  const [custForm, setCustForm] = useState({/* your existing */});
  const [vendorForm, setVendorForm] = useState({/* your existing */});
  const [pkgForm, setPkgForm] = useState({/* your existing */});
  const [brnForm, setBrnForm] = useState({/* your existing */});
  const [empForm, setEmpForm] = useState({/* your existing */});
  const [srvForm, setSrvForm] = useState({/* your existing */});
  const [investForm, setInvestForm] = useState({/* your existing */});
  const [settleForm, setSettleForm] = useState({/* your existing */});
  const [refundForm, setRefundForm] = useState({/* your existing */});
  const [transferForm, setTransferForm] = useState({/* your existing */});
  const [setForm, setSetForm] = useState({/* your existing */});
  const [userForm, setUserForm] = useState({/* your existing */});
  const [portalForm, setPortalForm] = useState({/* your existing */});
  const [tenantForm, setTenantForm] = useState({/* your existing */});
  const [profileForm, setProfileForm] = useState({/* your existing */});
  const [passForm, setPassForm] = useState({/* your existing */});
  const [payForm, setPayForm] = useState({/* your existing */});
  const [advForm, setAdvForm] = useState({/* your existing */});
  const [mistakeForm, setMistakeForm] = useState({/* your existing */});
  const [leaveForm, setLeaveForm] = useState({/* your existing */});
  const [contractForm, setContractForm] = useState({/* your existing */});

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

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: '👋 Hello! I am your AI Travel ERP Assistant. Type "help" to see what I can do.' }
  ]);
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState('10');
  const [contractTerms, setContractTerms] = useState('');

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

  const fetchAll = useCallback(async () => {
    if (!userProfile?.tenant_id) return;
    const tid = userProfile.tenant_id;

    try {
      const [
        invRes, custRes, corpRes, credRes, vendRes, pkgRes, brnRes,
        portRes, empRes, expRes, cashRes, payRes, mistRes, auditRes,
        setRes, srvRes, advRes, investRes, attRes, appUsersRes,
        corpTravelRes, ffRes
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
        corporateTravel: corpTravelRes.data || [],
        frequentFlyer: ffRes.data || []
      });
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [userProfile?.tenant_id]);

  // Auth init (keep as is)
  useEffect(() => {
    // ... your existing auth logic
  }, [router]);

  useEffect(() => {
    if (userProfile?.tenant_id) {
      fetchAll();
    }
  }, [userProfile?.tenant_id, fetchAll]);

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
