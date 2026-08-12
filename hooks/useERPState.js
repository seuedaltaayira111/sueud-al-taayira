'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ==========================================
// BREATHTAKING BILINGUAL INVOICE TEMPLATE
// ==========================================
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  
  // Barcode aur QR Code Generate karne ke liye APIs
  const invoiceNo = inv.invoice_no || 'N/A';
  const totalAmount = (inv.total || 0).toFixed(2);
  const vatAmount = (inv.vat || 0).toFixed(2);
  
  // ZATCA Style QR Code Data
  const qrData = encodeURIComponent(`Seller:${setting.company_name_ar || 'Company'},VAT:${setting.vat_no || 'N/A'},Inv:${invoiceNo},Total:${totalAmount},VAT:${vatAmount}`);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${qrData}`;
  
  // Barcode URL
  const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${invoiceNo}&code=Code128&translate-esc=on`;

  return `
  <!DOCTYPE html>
  <html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Poppins', 'Cairo', sans-serif; background: #e2e8f0; margin: 0; padding: 40px; color: #1e293b; -webkit-print-color-adjust: exact; }
      .invoice-container { max-width: 850px; margin: auto; background: #ffffff; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); overflow: hidden; border-top: 8px solid #1E3A8A; }
      
      /* Header Section */
      .header { padding: 40px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
      .company-info h1 { margin: 0; font-size: 28px; color: #1E3A8A; font-weight: 800; letter-spacing: -0.5px; }
      .company-info h2 { margin: 5px 0 0; font-size: 22px; color: #D97706; font-weight: 700; direction: rtl; font-family: 'Cairo', sans-serif; }
      .company-info p { margin: 5px 0; font-size: 13px; color: #64748b; line-height: 1.6; }
      
      .invoice-meta { text-align: ${isAr ? 'left' : 'right'}; background: #1E3A8A; padding: 20px 30px; border-radius: 12px; color: #fff; box-shadow: 0 10px 20px rgba(30, 58, 138, 0.2); }
      .invoice-meta h2 { margin: 0 0 10px; font-size: 24px; color: #FBBF24; text-transform: uppercase; letter-spacing: 1px; }
      .invoice-meta p { margin: 4px 0; font-size: 14px; font-weight: 500; }
      .invoice-meta span { color: #FBBF24; font-weight: 700; }

      /* Body Section */
      .body { padding: 40px; }
      .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
      .card { background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 5px solid #1E3A8A; }
      .card h3 { margin: 0 0 15px; font-size: 14px; text-transform: uppercase; color: #1E3A8A; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
      .card p { margin: 6px 0; font-size: 15px; display: flex; justify-content: space-between; }
      .card p strong { color: #334155; }
      .card p span { color: #64748b; font-weight: 600; }

      /* Table Section */
      .table-wrapper { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; margin-bottom: 30px; }
      table { width: 100%; border-collapse: collapse; }
      thead th { background: #1E3A8A; color: #fff; padding: 15px; font-size: 14px; text-align: ${isAr ? 'right' : 'left'}; font-weight: 600; }
      thead th.center { text-align: center; }
      thead th.right { text-align: right; }
      tbody td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
      tbody td.center { text-align: center; }
      tbody td.right { text-align: right; font-weight: 600; }
      .service-badge { display: inline-block; background: #DBEAFE; color: #1E3A8A; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }

      /* Totals Section */
      .totals-section { display: flex; justify-content: flex-end; margin-bottom: 30px; }
      .totals-box { width: 320px; }
      .total-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 15px; }
      .total-row span { color: #64748b; }
      .total-row strong { color: #1e293b; font-weight: 600; }
      .grand-total { background: #1E3A8A; color: #fff; padding: 15px 20px; border-radius: 8px; margin-top: 10px; font-size: 18px; display: flex; justify-content: space-between; font-weight: 700; }
      .grand-total strong { color: #FBBF24; }
      .due-amount { color: #EF4444; font-weight: 700; }
      .paid-amount { color: #059669; font-weight: 700; }

      /* Footer & Codes */
      .footer { background: #f8fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
      .codes img { height: 70px; mix-blend-mode: multiply; }
      .footer-text { text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.6; }
      .footer-text strong { color: #64748b; display: block; font-size: 14px; margin-bottom: 5px; }
      
      @media print {
        body { background: #fff; padding: 0; }
        .invoice-container { box-shadow: none; border-radius: 0; max-width: 100%; }
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      
      <!-- Header -->
      <div class="header">
        <div class="company-info">
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <h2>${setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
          <p>${setting.address_ar || 'Riyadh, Saudi Arabia'}<br>${setting.phone || '+966 500000000'} | VAT: ${setting.vat_no || 'N/A'} | CR: ${setting.cr_no || 'N/A'}</p>
        </div>
        <div class="invoice-meta">
          <h2>Tax Invoice / فاتورة</h2>
          <p>Invoice No / رقم: <span>${invoiceNo}</span></p>
          <p>Date / التاريخ: <span>${inv.invoice_date || ''}</span></p>
          <p>Status / الحالة: <span>${inv.due_amount > 0 ? 'Unpaid' : 'Paid'}</span></p>
        </div>
      </div>

      <!-- Body -->
      <div class="body">
        
        <!-- Customer & Flight Details -->
        <div class="details-grid">
          <div class="card">
            <h3>Customer Info / معلومات العميل</h3>
            <p><strong>Name / الاسم:</strong> <span>${inv.customers?.name || inv.corporates?.name || 'Walk-in'}</span></p>
            <p><strong>Phone / الجوال:</strong> <span>${inv.customers?.phone || 'N/A'}</span></p>
            <p><strong>ID / الهوية:</strong> <span>${inv.customers?.id_no || 'N/A'}</span></p>
          </div>
          <div class="card" style="border-left-color: #D97706;">
            <h3>Booking Details / تفاصيل الحجز</h3>
            <p><strong>Service / الخدمة:</strong> <span>${inv.service_type || 'Flight'}</span></p>
            <p><strong>Airline / الشركة:</strong> <span>${inv.airline || 'N/A'}</span></p>
            <p><strong>PNR / رقم الحجز:</strong> <span>${inv.pnr || 'N/A'}</span></p>
            <p><strong>Passenger / الركاب:</strong> <span style="text-align:right;">${inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A'}</span></p>
          </div>
        </div>

        <!-- Items Table -->
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Description / الوصف</th>
                <th class="center">Qty / الكمية</th>
                <th class="right">Unit Price / السعر</th>
                <th class="right">Total / الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${inv.sector || inv.service_type}</strong><br>
                  <span class="service-badge">${inv.flight_type || inv.service_type} | ${inv.flight_journey || ''}</span>
                </td>
                <td class="center">${inv.qty || 1}</td>
                <td class="right">${((inv.total_sell || 0) / (inv.qty || 1)).toFixed(2)} SAR</td>
                <td class="right">${(inv.total_sell || 0).toFixed(2)} SAR</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totals & Payment -->
        <div class="totals-section">
          <div class="totals-box">
            <div class="total-row"><span>Total Before Tax / الإجمالي قبل الضريبة</span> <strong>${(inv.total_sell || 0).toFixed(2)} SAR</strong></div>
            <div class="total-row"><span>VAT (15%) / قيمة الضريبة</span> <strong>${(inv.vat || 0).toFixed(2)} SAR</strong></div>
            <div class="grand-total"><span>Grand Total / الإجمالي شامل الضريبة</span> <strong>${(inv.total || 0).toFixed(2)} SAR</strong></div>
            <div class="total-row" style="margin-top: 15px; border-bottom: none;"><span>Paid Amount / المدفوع</span> <strong class="paid-amount">${(inv.paid_amount || 0).toFixed(2)} SAR</strong></div>
            <div class="total-row"><span>Due Amount / المتبقي</span> <strong class="due-amount">${(inv.due_amount || 0).toFixed(2)} SAR</strong></div>
            <div class="total-row" style="border-bottom: none;"><span>Payment Method / طريقة الدفع</span> <strong>${inv.payment_method || 'Cash'}</strong></div>
          </div>
        </div>

      </div>

      <!-- Footer with Codes -->
      <div class="footer">
        <div class="codes">
          <img src="${barcodeUrl}" alt="Barcode" crossorigin="anonymous"><br>
          <small style="color:#94a3b8; font-size: 10px;">Scan Barcode / امسح الباركود</small>
        </div>
        <div class="footer-text">
          <strong>${setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</strong>
          <p>${setting.invoice_footer || 'Thank you for choosing us! / شكراً لاختياركم خدماتنا'}</p>
          <p>THIS IS A SYSTEM GENERATED INVOICE / هذه فاتورة صادرة من النظام</p>
        </div>
        <div class="codes">
          <img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous"><br>
          <small style="color:#94a3b8; font-size: 10px;">ZATCA QR / رمز الاستجابة</small>
        </div>
      </div>

    </div>
  </body>
  </html>
  `;
};

const getExpenseHTML = (exp, s) => {
  return `
  <!DOCTYPE html><html><head><style>
  body { font-family: 'Poppins', sans-serif; padding: 20px; }
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
  body { font-family: 'Poppins', sans-serif; padding: 40px; line-height: 1.6; }
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
