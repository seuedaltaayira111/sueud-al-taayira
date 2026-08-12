import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function useERPState() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({ email: '', username: '', role: 'AgencyAdmin', is_admin: true, can_access_invoices: true, can_access_bank: true, can_access_hr: true, can_access_reports: true, can_access_settings: true, tenant_id: null, avatar_url: '' });
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [payFilter, setPayFilter] = useState('All');
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });
  const [passForm, setPassForm] = useState({ newPass: '' });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك؟' }]);
  const [chatInput, setChatInput] = useState('');
  const [search, setSearch] = useState('');
  const [tblPage, setTblPage] = useState(1);
  const itemsPerPage = 10;
  const [ledgerCustId, setLedgerCustId] = useState(''); 
  const [previewHTML, setPreviewHTML] = useState(''); 
  
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState('20');
  const [contractTerms, setContractTerms] = useState('Provider guarantees the cheapest fares. A flat service fee will be charged over the base cost price. Invoices will be issued monthly or per booking, inclusive of VAT where applicable.');

  const [tenantForm, setTenantForm] = useState({ agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' });

  const [data, setData] = useState({ tenants: [], invoices: [], portals: [], customers: [], corporates: [], creditors: [], recharges: [], settings: {}, employees: [], payroll: [], appUsers: [], expenses: [], services: [], cashbook: [], audits: [], investments: [], vendors: [], customFields: [], packages: [], branches: [], empAdvances: [] });
  const today = new Date().toISOString().split('T')[0];
  
  const [editInvId, setEditInvId] = useState(null);
  const [invForm, setInvForm] = useState({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '' });
  
  const [expForm, setExpForm] = useState({ vendor_name: '', vendor_vat: '', expense_date: today, expense_type: 'Office Supplies', payment_mode: 'Cash', items: [{ name: '', qty: 1, price: 0 }], taxRate: '15', desc: '' });
  const [editExpId, setEditExpId] = useState(null);

  const [editCorpId, setEditCorpId] = useState(null); const [corpForm, setCorpForm] = useState({ name: '', vat_no: '', phone: '', address: '' });
  const [editCredId, setEditCredId] = useState(null); const [creditorForm, setCreditorForm] = useState({ name: '', phone: '', address: '' });
  const [editCustId, setEditCustId] = useState(null); const [custForm, setCustForm] = useState({ name: '', phone: '', store_credit: 0 });
  const [editVendId, setEditVendId] = useState(null); const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [editPkgId, setEditPkgId] = useState(null); const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '', duration: '', inclusions: '' });
  const [editBrnId, setEditBrnId] = useState(null); const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
  const [editEmpId, setEditEmpId] = useState(null); 
  // Added commission_rate here
  const [empForm, setEmpForm] = useState({ name: '', role: 'Sales', salary: 0, phone: '', commission_rate: 0 });
  const [editSrvId, setEditSrvId] = useState(null); const [srvForm, setSrvForm] = useState({ name: '' });
  const [editUserId, setEditUserId] = useState(null); 
  
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, desc: '', mode: 'Cash', reason: 'Other', otherReason: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '' });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: '', date: today });
  const [repDate, setRepDate] = useState({ from: '', to: '' }); const [reportTab, setReportTab] = useState('sales'); const [statementTab, setStatementTab] = useState('sales');
  const [setForm, setSetForm] = useState({ company_name_en: 'SUEUD AL TAAYIRA', company_name_ar: 'صعود الطائرة للسفر السياحة', vat_no: '', cr_no: '', iata_no: '', phone: '', address_ar: 'طريق ملك عبدالعزيز عرعر', license_no: '', tourist_license_no: '', logo_url: '', invoice_footer: 'Thank you for choosing us!', custom_fields: [] });
  const [userForm, setUserForm] = useState({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false });
  const [portalForm, setPortalForm] = useState({ name: '', balance: 0 });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '' });

  const t = { en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices List', refunds: 'Refund Invoices', customers: 'Customer List', corporates: 'Corporate Accounts', creditors: 'Creditors', portals: 'Portals & Recharge', bank: 'Bank & Cash', invest: 'Investors', hr: 'HR & Accounts', users: 'User Management', reports: 'Financial Reports', audit: 'Audit Logs', settings: 'Settings', vendors: 'Vendors (B2B)', packages: 'Tour Packages', branches: 'Branches', logout: 'Logout', search: 'Search...', changePass: 'Change Password', statements: 'Statements', download_excel: 'Download Excel', credit: 'Credit Balances', profile: 'My Profile' }, ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'قائمة الفواتير', refunds: 'فواتير الاسترجاع', customers: 'قائمة العملاء', corporates: 'حسابات الشركات', creditors: 'الدائنون', portals: 'البوابات والرصيد', bank: 'البنك والكاش', invest: 'المستثمرون', hr: 'الموارد البشرية', users: 'إدارة المستخدمين', reports: 'التقارير المالية', audit: 'سجلات التدقيق', settings: 'الإعدادات', vendors: 'الموردون', packages: 'باقات سياحية', branches: 'الفروع', logout: 'تسجيل الخروج', search: 'بحث...', changePass: 'تغيير كلمة المرور', statements: 'كشوف الحسابات', download_excel: 'تحميل إكسل', credit: 'أرصدة الائتمان', profile: 'حسابي' } };
  const tr = t[lang];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return router.push('/login');
      setUser(session.user);
      const { data: uData } = await supabase.from('app_users').select('*').eq('email', session.user.email).maybeSingle();
      if (uData) {
        setUserProfile(uData);
        setProfileForm({ username: uData.username || '', avatar_url: uData.avatar_url || '' });
        if (uData.role !== 'SuperAdmin') {
          const { data: tenant } = await supabase.from('tenants').select('*').eq('id', uData.tenant_id).single();
          if (!tenant || !tenant.is_paid || new Date(tenant.subscription_end_date) < new Date()) {
            router.push('/subscription');
            return;
          }
        }
      }
      fetchAll();
    });
  }, [router]);

  const logAction = async (action) => { if (user) await supabase.from('audit_logs').insert([{ user_email: user.email, action, tenant_id: userProfile.tenant_id }]); };

  const fetchAll = async () => {
    const tenantId = userProfile.tenant_id;
    
    const [tenantsRes, invRes, porRes, cusRes, corpRes, crdRes, recRes, setRes, empRes, payRes, usrRes, expRes, srvRes, cbkRes, audRes, invstmntRes, vndRes, pkgsRes, brnsRes, advRes] = await Promise.all([
      userProfile.role === 'SuperAdmin' ? supabase.from('tenants').select('*').order('created_at', { ascending: false }) : Promise.resolve({ data: [] }),
      supabase.from('invoices').select(`*, customers(name, type, phone, store_credit), corporates(name, vat_no, phone), portals(name), employees(name, phone), creditors(name)`).eq('tenant_id', tenantId).order('created_at', { ascending: false }),
      supabase.from('portals').select('*').eq('tenant_id', tenantId),
      supabase.from('customers').select('*').eq('tenant_id', tenantId).eq('type', 'Individual').order('name', { ascending: true }),
      supabase.from('corporates').select('*').eq('tenant_id', tenantId).order('name', { ascending: true }),
      supabase.from('creditors').select('*').eq('tenant_id', tenantId).order('name', { ascending: true }),
      supabase.from('recharges').select(`*, portals(name)`).eq('tenant_id', tenantId).order('recharge_date', { ascending: false }),
      supabase.from('settings').select('*').eq('tenant_id', tenantId).maybeSingle(),
      supabase.from('employees').select('*').eq('tenant_id', tenantId),
      supabase.from('payroll').select(`*, employees(name)`).eq('tenant_id', tenantId),
      supabase.from('app_users').select('*').eq('tenant_id', tenantId),
      supabase.from('expenses').select('*').eq('tenant_id', tenantId),
      supabase.from('services').select('*').eq('tenant_id', tenantId),
      supabase.from('cashbook').select('*').eq('tenant_id', tenantId).order('trans_date', { ascending: false }),
      supabase.from('audit_logs').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(50),
      supabase.from('investments').select('*').eq('tenant_id', tenantId).order('invest_date', { ascending: false }),
      supabase.from('vendors').select('*').eq('tenant_id', tenantId),
      supabase.from('packages').select('*').eq('tenant_id', tenantId),
      supabase.from('branches').select('*').eq('tenant_id', tenantId),
      supabase.from('employee_advances').select('*, employees(name)').eq('tenant_id', tenantId).order('date', { ascending: false })
    ]);

    const portalsData = porRes.data || [];
    const settingsData = setRes.data || {};
    setData({ 
      tenants: tenantsRes.data || [], 
      invoices: invRes.data || [], 
      portals: portalsData, 
      customers: cusRes.data || [], 
      corporates: corpRes.data || [], 
      creditors: crdRes.data || [], 
      recharges: recRes.data || [], 
      settings: settingsData, 
      employees: empRes.data || [], 
      payroll: payRes.data || [], 
      appUsers: usrRes.data || [], 
      expenses: expRes.data || [], 
      services: srvRes.data || [], 
      cashbook: cbkRes.data || [], 
      audits: audRes.data || [], 
      investments: invstmntRes.data || [], 
      vendors: vndRes.data || [], 
      customFields: [], 
      packages: pkgsRes.data || [], 
      branches: brnsRes.data || [],
      empAdvances: advRes.data || []
    });
    
    if (portalsData.length > 0) setInvForm(f => ({ ...f, portalId: f.portalId || portalsData[0].id }));
    if (settingsData) setSetForm(prev => ({ ...prev, ...settingsData, custom_fields: settingsData.custom_fields || [] }));
  };

  const exportToExcel = (csvData, filename) => { 
    if (!csvData || csvData.length === 0) return showToast('No data to export'); 
    try {
      const headers = Object.keys(csvData[0]); 
      const csvRows = [headers.join(',')]; 
      for (const row of csvData) { csvRows.push(headers.map(h => `"${row[h] || ''}"`).join(',')); } 
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' }); 
      const link = document.createElement('a'); 
      link.href = URL.createObjectURL(blob); 
      link.download = `${filename}.csv`; 
      link.click(); 
      showToast('Exported as CSV!'); 
    } catch (err) { showToast('Export Error: ' + err.message); }
  };

  const filterData = (arr, dateKey) => { if (!repDate.from || !repDate.to) return arr; return arr.filter(i => (i[dateKey] || i.created_at?.split('T')[0]) >= repDate.from && (i[dateKey] || i.created_at?.split('T')[0]) <= repDate.to); };

  const getContractHTML = (s, corpName, dateStr, isOffer, cType, markup, terms) => {
    const titleEn = isOffer ? "SPECIAL CORPORATE OFFER" : "CORPORATE TRAVEL AGREEMENT";
    const titleAr = isOffer ? "عرض الشركات الخاص" : "اتفاقية السفر للشركات";
    return `
    <div style="width:794px; min-height:1123px; padding:50px; box-sizing:border-box; background:#fff; color:#333; font-family:'Segoe UI', Tahoma, Arial; position: relative;">
      <div style="border: 4px solid #1B5E20; padding: 40px; height: 100%; box-sizing: border-box;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #D4AF37; padding-bottom:20px; margin-bottom:40px;">
          <div style="display:flex; align-items:center; gap:20px;">
            ${s.logo_url ? `<img src="${s.logo_url}" crossorigin="anonymous" style="height:90px;width:auto;object-fit:contain;" />` : '<div style="width:90px;height:90px;"></div>'}
            <div style="text-align: right; direction: rtl;">
              <h1 style="margin:0;color:#1B5E20;font-size:22px;font-weight:bold;">${s.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h1>
              <p style="font-size:12px;margin-top:5px;line-height:1.6;color:#555;">عنوان: ${s.address_ar || ''}<br/>هاتف: ${s.phone || ''}<br/>سجل تجاري: ${s.cr_no || ''}<br/>ضريبة القيمة المضافة: ${s.vat_no || ''}</p>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="margin:0; font-size: 24px; color:#1B5E20;">${titleEn}</h1>
          <h2 style="margin:5px 0 0; font-size: 20px; color:#555; direction: rtl;">${titleAr}</h2>
          <div style="width: 100px; height: 3px; background: #D4AF37; margin: 15px auto;"></div>
        </div>
        <div style="margin-bottom: 40px; background: #f8fafc; padding: 20px; border-left: 4px solid #1B5E20;">
          <p style="font-size: 15px; line-height: 1.8; margin: 0;">This ${isOffer ? 'offer' : 'agreement'} is made on <b>${dateStr}</b> between <b>${s.company_name_en || 'Our Company'}</b> and <b>${corpName}</b>.</p>
          <p style="font-size: 15px; line-height: 1.8; direction: rtl; text-align: right; margin-top: 15px;">تم إبرام هذه ${isOffer ? 'العرض' : 'الاتفاقية'} في <b>${dateStr}</b> بين <b>${s.company_name_ar || 'شركتنا'}</b> و <b>${corpName}</b>.</p>
        </div>
        <h3 style="color:#1B5E20; border-bottom:1px solid #ddd; padding-bottom:10px; font-size:18px;">Service Type / نوع الخدمة</h3>
        <p style="font-size: 16px; font-weight: bold; margin-bottom: 20px;">${cType}</p>
        <h3 style="color:#1B5E20; border-bottom:1px solid #ddd; padding-bottom:10px; font-size:18px;">Terms & Conditions / الشروط والأحكام</h3>
        <ul style="font-size: 14px; line-height: 2; margin-bottom: 20px; padding-right: 20px;">
          <li>Provider agrees to supply ${cType} at competitive rates.</li>
          <li>Service fee of <b>${markup} SAR</b> applies.</li>
          ${terms.split('\n').map(t => `<li>${t}</li>`).join('')}
        </ul>
        <div style="margin-top: 80px; display: flex; justify-content: space-between;">
          <div style="text-align: center;"><div style="border-top: 1px solid #333; width: 250px; margin-bottom: 5px;"></div><b>Authorized Signatory</b><br/><span style="font-size: 12px; color:#666;">${s.company_name_en}</span></div>
          <div style="text-align: center;"><div style="border-top: 1px solid #333; width: 250px; margin-bottom: 5px;"></div><b>Client Signature</b><br/><span style="font-size: 12px; color:#666;">${corpName}</span></div>
        </div>
      </div>
    </div>`;
  };

  const getExpenseHTML = (exp, s) => {
    const subTotal = (exp.items || []).reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);
    const taxRate = subTotal > 0 && exp.amount > subTotal ? 15 : 0;
    const vat = subTotal * (taxRate / 100);
    const total = subTotal + vat;
    const paid = exp.amount || 0;
    const due = total - paid;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app/invoice/' + exp.invoice_no)}`;
    return `
    <div style="width:794px; min-height:1123px; padding:40px; box-sizing:border-box; background:#fff; color:#333; font-family:'Segoe UI', Tahoma, Arial;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #1B5E20; padding-bottom:20px; margin-bottom:30px;">
        <div style="display:flex; align-items:center; gap:20px;">
          ${s.logo_url ? `<img src="${s.logo_url}" crossorigin="anonymous" style="height:90px;width:auto;object-fit:contain;" />` : '<div style="width:90px;height:90px;"></div>'}
          <div>
            <h1 style="margin:0;color:#1B5E20;font-size:24px;font-weight:bold;">${s.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
            <h2 style="margin:5px 0;color:#555;font-size:18px;">${s.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
            <p style="font-size:12px;margin-top:5px;line-height:1.6;color:#555;">${s.address_ar || ''}<br/>Phone: ${s.phone || ''} | VAT: ${s.vat_no || ''}<br/>License: ${s.license_no || ''} | Tourist License: ${s.tourist_license_no || ''}</p>
          </div>
        </div>
        <div style="text-align:right; background:linear-gradient(135deg, #1B5E20, #2E7D32); color:#fff; padding:15px 25px; border-radius:8px; min-width:250px;">
          <h1 style="margin:0;font-size:22px;">PURCHASE BILL</h1>
          <h2 style="margin:5px 0;font-size:18px;color:#D4AF37;">فاتورة مشتريات</h2>
          <p style="font-size:12px;margin-top:10px;color:#eee;">Bill No: <b>${exp.invoice_no}</b><br/>Date: <b>${exp.expense_date}</b><br/>Paid Via: <b>${exp.payment_mode}</b></p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px;">
        <div style="background:#f1f5f9;padding:15px;border-radius:8px;border-left:4px solid #D4AF37;"><h3 style="margin:0 0 5px;color:#1B5E20;font-size:14px;">VENDOR / المورد</h3><p style="margin:0;font-size:16px;font-weight:bold;">${exp.vendor_name || 'N/A'}</p><p style="margin:3px 0 0;font-size:12px;color:#666;">VAT: ${exp.vendor_vat || 'N/A'}</p></div>
        <div style="background:#f1f5f9;padding:15px;border-radius:8px;border-left:4px solid #D4AF37;text-align:right;"><h3 style="margin:0 0 5px;color:#1B5E20;font-size:14px;">BILL TO / الفاتورة إلى</h3><p style="margin:0;font-size:16px;font-weight:bold;">${s.company_name_en || 'Our Company'}</p><p style="margin:3px 0 0;font-size:12px;color:#666;">${s.address_ar || ''}</p></div>
      </div>
      <table style="width:100%;border-collapse:collapse;text-align:center;margin-bottom:30px;">
        <thead><tr style="background:#1B5E20;color:#D4AF37;"><th style="padding:12px;text-align:left;font-size:13px;">Item / الوصف</th><th style="padding:12px;font-size:13px;">Qty</th><th style="padding:12px;font-size:13px;">Price</th><th style="padding:12px;font-size:13px;">Total</th></tr></thead>
        <tbody>${exp.items && exp.items.length > 0 ? exp.items.map(item => `<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:12px;text-align:left;font-size:13px;">${item.name}</td><td style="padding:12px;font-size:13px;">${item.qty}</td><td style="padding:12px;font-size:13px;">${parseFloat(item.price).toFixed(2)}</td><td style="padding:12px;font-size:13px;font-weight:bold;">${(parseFloat(item.qty)*parseFloat(item.price)).toFixed(2)}</td></tr>`).join('') : `<tr><td colspan="4" style="padding:20px;">No Items</td></tr>`}</tbody>
      </table>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="text-align:center;"><img src="${qrUrl}" alt="QR Code" style="height:100px;width:100px;"/><p style="font-size:10px;color:#666;margin:5px 0 0;">${exp.invoice_no}</p></div>
        <div style="text-align:right;min-width:280px;">
          <p style="margin:0;font-size:14px;display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;"><span>Total Before VAT:</span> <b>${subTotal.toFixed(2)} SAR</b></p>
          <p style="margin:0;font-size:14px;display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;"><span>VAT (${taxRate}% ${taxRate === 0 ? 'معفاء' : ''}):</span> <b>${vat.toFixed(2)} SAR</b></p>
          <p style="margin:0;font-size:14px;display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;"><span>Total After VAT:</span> <b>${total.toFixed(2)} SAR</b></p>
          <p style="margin:0;font-size:14px;display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;color:#059669;"><span>Paid / مدفوع:</span> <b>${paid.toFixed(2)} SAR</b></p>
          <p style="margin:0;font-size:14px;display:flex;justify-content:space-between;padding:8px 0;color:#EF4444;"><span>Due Amount / المتبقي:</span> <b>${due.toFixed(2)} SAR</b></p>
        </div>
      </div>
      <div style="margin-top:60px; border-top:1px solid #e2e8f0; padding-top:20px;"><p style="font-size:11px;color:#888;text-align:center;margin:0;">${s.invoice_footer || 'Thank you!'}</p></div>
    </div>`;
  };

  const getInvoiceHTML = (inv, s, invLang = 'en') => {
    const isAr = invLang === 'ar'; 
    const dir = isAr ? 'rtl' : 'ltr'; 
    const textAlign = isAr ? 'right' : 'left'; 
    const textAlignOpp = isAr ? 'left' : 'right';
    const isRefund = inv.invoice_no && inv.invoice_no.startsWith('REF-');
    const isCorporate = !!inv.corporate_id;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app/invoice/' + inv.invoice_no)}`;
    const titleEn = isRefund ? 'CREDIT NOTE' : (isCorporate ? 'TAX INVOICE' : 'SIMPLIFIED TAX INVOICE');
    const titleAr = isRefund ? 'فاتورة إشعار دائن' : (isCorporate ? 'فاتورة ضريبية' : 'فاتورة ضريبية مبسطة');
    const empName = inv.employees?.name || 'N/A';
    const empPhone = inv.employees?.phone || 'N/A';
    const custPhone = inv.customers?.phone || inv.corporates?.phone || 'N/A';
    const paxNames = inv.passenger_names ? inv.passenger_names.split('\n').map(p => `<div style="padding:2px 0;">• ${p}</div>`).join('') : 'N/A';
    const subtotal = (inv.total_sell || 0);
    const vat = (inv.vat || 0);
    const total = (inv.total || 0);
    const paid = (inv.paid_amount || 0);
    const due = (inv.due_amount || 0);
    const taxRate = inv.vat > 0 ? 15 : 0;
    const linkedInv = inv.linked_inv_id ? data.invoices.find(i => i.id === inv.linked_inv_id) : null;
    const customFieldsHtml = s.custom_fields && s.custom_fields.length > 0 ? s.custom_fields.map(cf => `${cf.key}: ${cf.value}<br/>`).join('') : '';
    return `
    <div style="width:794px; min-height:1123px; padding:40px; box-sizing:border-box; background:#fff; color:#333; font-family:'Segoe UI', Tahoma, Arial; direction:${dir}; text-align:${textAlign};">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #D4AF37; padding-bottom:20px; margin-bottom:30px;">
        <div style="display:flex; align-items:center; gap:20px;">
          ${s.logo_url ? `<img src="${s.logo_url}" crossorigin="anonymous" style="height:90px;width:auto;object-fit:contain;" />` : '<div style="width:90px;height:90px;"></div>'}
          <div style="text-align: right; direction: rtl;">
            <h1 style="margin:0;color:#1B5E20;font-size:22px;font-weight:bold;">${s.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h1>
            <p style="font-size:12px;margin-top:5px;line-height:1.6;color:#555;">عنوان: ${s.address_ar || ''}<br/>هاتف: ${s.phone || ''}<br/>سجل تجاري: ${s.cr_no || ''}<br/>ضريبة القيمة المضافة: ${s.vat_no || ''}<br/>ترخيص: ${s.license_no || ''}<br/>ترخيص سياحي: ${s.tourist_license_no || ''} ${customFieldsHtml}</p>
          </div>
        </div>
        <div style="text-align:${textAlignOpp}; background:linear-gradient(135deg, #1B5E20, #2E7D32); color:#fff; padding:15px 25px; border-radius:8px; min-width:250px;">
          <h1 style="margin:0;font-size:22px;">${titleEn}</h1>
          <h2 style="margin:5px 0;font-size:18px;color:#D4AF37;">${titleAr}</h2>
          <p style="font-size:12px;margin-top:10px;color:#eee; text-align:${textAlignOpp};">Inv No: <b>${inv.invoice_no}</b><br/>Date: <b>${inv.invoice_date}</b><br/>Payment: <b>${inv.payment_method}</b></p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px;">
        <div style="background:#f1f5f9;padding:15px;border-radius:8px;border-left:4px solid #1B5E20;"><h3 style="margin:0 0 5px;color:#1B5E20;font-size:14px;">BILL TO / الفاتورة إلى:</h3><p style="margin:0;font-size:16px;font-weight:bold;">${inv.customers?.name || inv.corporates?.name || ''}</p><p style="margin:3px 0 0;font-size:12px;color:#666;">Phone: ${custPhone} ${inv.corporates?.vat_no ? '| VAT: '+inv.corporates.vat_no : ''}</p></div>
        <div style="background:#f1f5f9;padding:15px;border-radius:8px;border-left:4px solid #1B5E20;text-align:${textAlignOpp};"><h3 style="margin:0 0 5px;color:#1B5E20;font-size:14px;">SALES PERSON / الموظف:</h3><p style="margin:0;font-size:16px;font-weight:bold;">${empName}</p><p style="margin:3px 0 0;font-size:12px;color:#666;">Contact: ${empPhone}</p></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin-bottom:20px;border:1px solid #e2e8f0;padding:15px;border-radius:8px;background:#fff;">
        ${inv.service_type ? `<div><b style="color:#1B5E20;font-size:11px;">Service</b><br/><span style="font-size:13px;">${inv.service_type}</span></div>` : ''}
        ${inv.airline ? `<div><b style="color:#1B5E20;font-size:11px;">Airline</b><br/><span style="font-size:13px;">${inv.airline}</span></div>` : ''}
        ${inv.flight_sector ? `<div><b style="color:#1B5E20;font-size:11px;">Sector</b><br/><span style="font-size:13px;">${inv.flight_sector}</span></div>` : ''}
        ${inv.flight_type ? `<div><b style="color:#1B5E20;font-size:11px;">Flight Type</b><br/><span style="font-size:13px;">${inv.flight_type}</span></div>` : ''}
        ${inv.booking_type ? `<div><b style="color:#1B5E20;font-size:11px;">Booking Type</b><br/><span style="font-size:13px;">${inv.booking_type}</span></div>` : ''}
        ${inv.pnr ? `<div><b style="color:#1B5E20;font-size:11px;">PNR</b><br/><span style="font-size:13px;">${inv.pnr}</span></div>` : ''}
        ${inv.ticket_no ? `<div><b style="color:#1B5E20;font-size:11px;">Ticket No</b><br/><span style="font-size:13px;">${inv.ticket_no}</span></div>` : ''}
      </div>
      ${linkedInv ? `<div style="margin-bottom:20px;border:1px dashed #1B5E20;padding:15px;border-radius:8px;background:#EFF6FF;"><h4 style="margin:0 0 5px;color:#1B5E20;font-size:12px;">PREVIOUS BOOKING DETAILS</h4><p style="margin:0;font-size:12px;color:#555;">Old Inv: <b>${linkedInv.invoice_no}</b> | Date: <b>${linkedInv.invoice_date}</b><br/>Passenger: <b>${linkedInv.passenger_names || 'N/A'}</b> | Old Total: <b>${(linkedInv.total || 0).toFixed(2)}</b></p></div>` : ''}
      ${inv.passenger_names ? `<div style="margin-bottom:20px;border:1px solid #e2e8f0;padding:15px;border-radius:8px;"><b style="color:#1B5E20;font-size:14px;">Passengers / المسافرون:</b><div style="font-size:13px;margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:5px;">${paxNames}</div></div>` : ''}
      <table style="width:100%;border-collapse:collapse;text-align:center;margin-bottom:30px;">
        <thead><tr style="background:#1B5E20;color:#D4AF37;"><th style="padding:12px;text-align:left;font-size:13px;">Desc / الوصف</th><th style="padding:12px;font-size:13px;">Qty</th><th style="padding:12px;font-size:13px;">Price</th><th style="padding:12px;font-size:13px;">Total</th></tr></thead>
        <tbody><tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:12px;text-align:left;font-size:13px;">${inv.sector || 'N/A'}</td><td style="padding:12px;font-size:13px;">${inv.qty || 1}</td><td style="padding:12px;font-size:13px;">${((inv.total_sell || 0) / (inv.qty || 1)).toFixed(2)}</td><td style="padding:12px;font-size:13px;font-weight:bold;">${(inv.total_sell || 0).toFixed(2)}</td></tr></tbody>
      </table>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="text-align:center;"><img src="${qrUrl}" alt="QR Code" style="height:100px;width:100px;"/><p style="font-size:10px;color:#666;margin:5px 0 0;">Scan to verify/download</p></div>
        <div style="text-align:${textAlignOpp};min-width:280px;">
          <p style="margin:0;font-size:14px;display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;"><span>Total Before VAT / المجموع قبل الضريبة:</span> <b>${subtotal.toFixed(2)} SAR</b></p>
          <p style="margin:0;font-size:14px;display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;"><span>VAT (${taxRate}% ${taxRate === 0 ? 'معفاء' : ''}) / ضريبة القيمة المضافة:</span> <b>${vat.toFixed(2)} SAR</b></p>
          <p style="margin:0;font-size:14px;display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;"><span>Total After VAT / الإجمالي بعد الضريبة:</span> <b>${total.toFixed(2)} SAR</b></p>
          <p style="margin:0;font-size:14px;display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;color:#059669;"><span>Paid / مدفوع:</span> <b>${paid.toFixed(2)} SAR</b></p>
          <p style="margin:0;font-size:14px;display:flex;justify-content:space-between;padding:8px 0;color:#EF4444;"><span>Due Amount / المتبقي:</span> <b>${due.toFixed(2)} SAR</b></p>
        </div>
      </div>
      <div style="margin-top:60px; border-top:1px solid #e2e8f0; padding-top:20px;"><p style="font-size:11px;color:#888;text-align:center;margin:0 0 5px;">${s.invoice_footer || 'Thank you!'}</p></div>
    </div>`;
  };

  return {
    user, setUser, userProfile, setUserProfile, lang, setLang, page, setPage, payFilter, setPayFilter, router, toast, setToast, modal, setModal, passForm, setPassForm, chatOpen, setChatOpen, chatMessages, setChatMessages, chatInput, setChatInput, search, setSearch, tblPage, setTblPage, itemsPerPage, ledgerCustId, setLedgerCustId, previewHTML, setPreviewHTML, data, setData, today, editInvId, setEditInvId, invForm, setInvForm, expForm, setExpForm, editExpId, setEditExpId, editCorpId, setEditCorpId, corpForm, setCorpForm, editCredId, setEditCredId, creditorForm, setCreditorForm, editCustId, setEditCustId, custForm, setCustForm, editVendId, setEditVendId, vendorForm, setVendorForm, editPkgId, setEditPkgId, pkgForm, setPkgForm, editBrnId, setEditBrnId, brnForm, setBrnForm, editEmpId, setEditEmpId, empForm, setEmpForm, editSrvId, setEditSrvId, srvForm, setSrvForm, editUserId, setEditUserId, investForm, setInvestForm, settleForm, setSettleForm, refundForm, setRefundForm, transferForm, setTransferForm, repDate, setRepDate, reportTab, setReportTab, statementTab, setStatementTab, setForm, setSetForm, userForm, setUserForm, portalForm, setPortalForm, tr, t, showToast, logAction, fetchAll, exportToExcel, filterData, getInvoiceHTML, getExpenseHTML, getContractHTML, tenantForm, setTenantForm, profileForm, setProfileForm,
    contractCorpName, setContractCorpName, contractType, setContractType, contractMarkup, setContractMarkup, contractTerms, setContractTerms
  };
}
