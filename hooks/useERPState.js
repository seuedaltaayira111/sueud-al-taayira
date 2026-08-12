'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ==========================================
// STYLISH PROFESSIONAL INVOICE TEMPLATE
// ==========================================
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const isAr = lang === 'ar';
  const setting = s || {};
  return `
  <!DOCTYPE html>
  <html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${inv.invoice_no}</title>
    <style>
      body { font-family: 'Poppins', 'Tajawal', sans-serif; background: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
      .invoice-box { max-width: 800px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0; }
      .header { background: #1E3A8A; color: #fff; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
      .header h1 { margin: 0; font-size: 28px; color: #FBBF24; }
      .header p { margin: 5px 0 0; opacity: 0.9; font-size: 14px; }
      .header-right { text-align: ${isAr ? 'left' : 'right'}; }
      .header-right h2 { margin: 0; font-size: 20px; color: #FBBF24; }
      .section { padding: 30px; }
      .flex { display: flex; justify-content: space-between; margin-bottom: 30px; }
      .box { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #1E3A8A; width: 48%; }
      .box h3 { margin: 0 0 10px; font-size: 14px; color: #64748b; text-transform: uppercase; }
      .box p { margin: 3px 0; font-size: 16px; font-weight: 500; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th { background: #1E3A8A; color: #fff; padding: 12px; text-align: ${isAr ? 'right' : 'left'}; font-size: 14px; }
      td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
      .totals { margin-left: auto; width: 300px; }
      .totals div { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
      .totals .grand { font-size: 18px; font-weight: bold; color: #1E3A8A; border-bottom: none; }
      .footer { text-align: center; padding: 20px; background: #f8fafc; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      .status-badge { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; background: ${inv.due_amount > 0 ? '#FEF3C7' : '#D1FAE5'}; color: ${inv.due_amount > 0 ? '#D97706' : '#059669'}; }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <div>
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <p>${setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</p>
          <p>${setting.address_ar || ''} | ${setting.phone || ''}</p>
          <p>VAT: ${setting.vat_no || 'N/A'} | CR: ${setting.cr_no || 'N/A'}</p>
        </div>
        <div class="header-right">
          <h2>INVOICE</h2>
          <p>#${inv.invoice_no}</p>
          <p>${inv.invoice_date || ''}</p>
        </div>
      </div>
      
      <div class="section">
        <div class="flex">
          <div class="box">
            <h3>Bill To</h3>
            <p><strong>${inv.customers?.name || inv.corporates?.name || 'Walk-in Customer'}</strong></p>
            ${inv.customers?.phone ? `<p>Phone: ${inv.customers.phone}</p>` : ''}
            ${inv.corporates?.vat_no ? `<p>VAT: ${inv.corporates.vat_no}</p>` : ''}
          </div>
          <div class="box">
            <h3>Flight Details</h3>
            <p><strong>${inv.airline || 'N/A'} - ${inv.flight_sector || ''}</strong></p>
            <p>PNR: ${inv.pnr || 'N/A'} | Ticket: ${inv.ticket_no || 'N/A'}</p>
            <p>Passenger: ${inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A'}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Type</th>
              <th>Status</th>
              <th style="text-align: right;">Amount (SAR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${inv.sector || inv.service_type}</td>
              <td>${inv.service_type} (${inv.flight_type || 'N/A'})</td>
              <td><span class="status-badge">${inv.due_amount > 0 ? 'UNPAID' : 'PAID'}</span></td>
              <td style="text-align: right;">${(inv.total_sell || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div>
            <span>Subtotal:</span>
            <span>${(inv.total_sell || 0).toFixed(2)}</span>
          </div>
          ${inv.discount > 0 ? `<div><span>Discount:</span><span> - ${(inv.discount || 0).toFixed(2)}</span></div>` : ''}
          <div>
            <span>VAT (15%):</span>
            <span>${(inv.vat || 0).toFixed(2)}</span>
          </div>
          <div class="grand">
            <span>Total:</span>
            <span>${(inv.total || 0).toFixed(2)} SAR</span>
          </div>
          <div>
            <span>Paid Amount:</span>
            <span style="color: #059669;">${(inv.paid_amount || 0).toFixed(2)}</span>
          </div>
          ${inv.due_amount > 0 ? `<div class="grand" style="color:#EF4444;"><span>Due Amount:</span><span>${(inv.due_amount || 0).toFixed(2)}</span></div>` : ''}
        </div>
      </div>
      
      <div class="footer">
        <p>${setting.invoice_footer || 'Thank you for choosing us!'}</p>
        <p>This is a computer generated invoice and does not require physical signature.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

const getExpenseHTML = (exp, s) => {
  return `
  <!DOCTYPE html><html><head><style>
  body { font-family: sans-serif; padding: 20px; }
  .exp-box { max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 8px; }
  h1 { color: #1E3A8A; }
  </style></head><body>
    <div class="exp-box">
      <h1>Expense Voucher: ${exp.invoice_no}</h1>
      <p><strong>Vendor:</strong> ${exp.vendor_name}</p>
      <p><strong>Date:</strong> ${exp.expense_date}</p>
      <p><strong>Type:</strong> ${exp.expense_type}</p>
      <p><strong>Amount:</strong> ${(exp.amount || 0).toFixed(2)} SAR</p>
      <p><strong>Paid Via:</strong> ${exp.payment_mode}</p>
    </div>
  </body></html>`;
};

const getContractHTML = (s, name, date, isOffer, type, markup, terms) => {
  return `
  <!DOCTYPE html><html><head><style>
  body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
  h1 { color: #1E3A8A; text-align: center; }
  </style></head><body>
    <h1>${isOffer ? 'Corporate Offer' : 'Corporate Contract'}</h1>
    <p><strong>Company:</strong> ${name}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Service Type:</strong> ${type}</p>
    <p><strong>Service Fee/Markup:</strong> ${markup} SAR</p>
    <br/>
    <h3>Terms & Conditions</h3>
    <pre>${terms}</pre>
  </body></html>`;
};

// ==========================================
// MAIN HOOK START
// ==========================================
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
    dashboard: 'Dashboard', dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices', refunds: 'Refunds',
    customers: 'Customers', corporates: 'Corporates', creditors: 'Creditors', credit: 'Credit Balances',
    vendors: 'Vendors', packages: 'Packages', branches: 'Branches', portals: 'Portals', bank: 'Bank & Cash',
    invest: 'Investors', hr: 'Human Resources', users: 'Users', settings: 'Settings', reports: 'Reports',
    audit: 'Audit Logs', statements: 'Statements', contract: 'Contracts', offer: 'Offers',
    superadmin: 'SuperAdmin', profile: 'Profile', profitability: 'Profitability',
    search: 'Search...', download_excel: 'Export Excel', logout: 'Logout', changePass: 'Change Password'
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
        investments: [], branches: [], packages: [], vendors: [], services: [], recharges: [], audits: [] 
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
          // Agar user app_users table mein nahi hai, toh SuperAdmin maan lo (Valid UUID format)
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
            tenant_id: '00000000-0000-0000-0000-000000000000' 
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
