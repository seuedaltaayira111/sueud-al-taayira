import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function useERPState() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({ email: '', username: '', role: 'Owner', is_admin: true, can_access_invoices: true, can_access_bank: true, can_access_hr: true, can_access_reports: true, can_access_settings: true });
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
  const [data, setData] = useState({ invoices: [], portals: [], customers: [], corporates: [], creditors: [], recharges: [], settings: {}, employees: [], payroll: [], appUsers: [], expenses: [], services: [], cashbook: [], audits: [], investments: [], vendors: [], customFields: [], packages: [], branches: [] });
  const today = new Date().toISOString().split('T')[0];
  
  const [editInvId, setEditInvId] = useState(null);
  const [invForm, setInvForm] = useState({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '' });
  
  const [expForm, setExpForm] = useState({ vendor_name: '', vendor_vat: '', expense_date: today, expense_type: 'Office Supplies', payment_mode: 'Cash', items: [{ name: '', qty: 1, price: 0 }], taxRate: '15', desc: '' });

  const [editCorpId, setEditCorpId] = useState(null); const [corpForm, setCorpForm] = useState({ name: '', vat_no: '', phone: '', address: '' });
  const [editCredId, setEditCredId] = useState(null); const [creditorForm, setCreditorForm] = useState({ name: '', phone: '', address: '' });
  const [editCustId, setEditCustId] = useState(null); const [custForm, setCustForm] = useState({ name: '', phone: '', store_credit: 0 });
  const [editVendId, setEditVendId] = useState(null); const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [editPkgId, setEditPkgId] = useState(null); const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '', duration: '', inclusions: '' });
  const [editBrnId, setEditBrnId] = useState(null); const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
  const [editEmpId, setEditEmpId] = useState(null); const [empForm, setEmpForm] = useState({ name: '', role: 'Sales', salary: 0, phone: '' });
  const [editSrvId, setEditSrvId] = useState(null); const [srvForm, setSrvForm] = useState({ name: '' });
  const [editUserId, setEditUserId] = useState(null); 
  
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, desc: '', mode: 'Cash', reason: 'Other', otherReason: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '' });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: '', date: today });
  const [repDate, setRepDate] = useState({ from: '', to: '' }); const [reportTab, setReportTab] = useState('sales'); const [statementTab, setStatementTab] = useState('sales');
  const [setForm, setSetForm] = useState({ company_name_en: 'SUEUD AL TAAYIRA', company_name_ar: 'صعود الطائرة للسفر السياحة', vat_no: '', cr_no: '', iata_no: '', phone: '', address_ar: 'طريق ملك عبدالعزيز عرعر', license_no: '', tourist_license_no: '', logo_url: '', invoice_footer: 'Thank you for choosing us!' });
  const [userForm, setUserForm] = useState({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false });
  const [portalForm, setPortalForm] = useState({ name: '', balance: 0 });

  const t = { en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices List', refunds: 'Refund Invoices', customers: 'Customer List', corporates: 'Corporate Accounts', creditors: 'Creditors', portals: 'Portals & Recharge', bank: 'Bank & Cash', invest: 'Investors', hr: 'HR & Accounts', users: 'User Management', reports: 'Financial Reports', audit: 'Audit Logs', settings: 'Settings', vendors: 'Vendors (B2B)', packages: 'Tour Packages', branches: 'Branches', logout: 'Logout', search: 'Search...', changePass: 'Change Password', statements: 'Statements', download_excel: 'Download Excel', credit: 'Credit Balances' }, ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'قائمة الفواتير', refunds: 'فواتير الاسترجاع', customers: 'قائمة العملاء', corporates: 'حسابات الشركات', creditors: 'الدائنون', portals: 'البوابات والرصيد', bank: 'البنك والكاش', invest: 'المستثمرون', hr: 'الموارد البشرية', users: 'إدارة المستخدمين', reports: 'التقارير المالية', audit: 'سجلات التدقيق', settings: 'الإعدادات', vendors: 'الموردون', packages: 'باقات سياحية', branches: 'الفروع', logout: 'تسجيل الخروج', search: 'بحث...', changePass: 'تغيير كلمة المرور', statements: 'كشوف الحسابات', download_excel: 'تحميل إكسل', credit: 'أرصدة الائتمان' } };
  const tr = t[lang];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return router.push('/login');
      setUser(session.user);
      const { data: uData } = await supabase.from('app_users').select('*').eq('email', session.user.email).maybeSingle();
      if (uData) setUserProfile(uData);
      fetchAll();
    });
  }, [router]);

  const logAction = async (action) => { if (user) await supabase.from('audit_logs').insert([{ user_email: user.email, action }]); };

  const fetchAll = async () => {
    const inv = await supabase.from('invoices').select(`*, customers(name, type, phone, store_credit), corporates(name, vat_no), portals(name), employees(name), creditors(name)`).order('created_at', { ascending: false });
    const por = await supabase.from('portals').select('*');
    const cus = await supabase.from('customers').select('*').eq('type', 'Individual').order('name', { ascending: true });
    const corp = await supabase.from('corporates').select('*').order('name', { ascending: true });
    const crd = await supabase.from('creditors').select('*').order('name', { ascending: true });
    const rec = await supabase.from('recharges').select(`*, portals(name)`).order('recharge_date', { ascending: false });
    const set = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    const emp = await supabase.from('employees').select('*');
    const pay = await supabase.from('payroll').select(`*, employees(name)`);
    const usr = await supabase.from('app_users').select('*');
    const exp = await supabase.from('expenses').select('*');
    const srv = await supabase.from('services').select('*');
    const cbk = await supabase.from('cashbook').select('*').order('trans_date', { ascending: false });
    const aud = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
    const invstmnt = await supabase.from('investments').select('*').order('invest_date', { ascending: false });
    const vnd = await supabase.from('vendors').select('*');
    const pkgs = await supabase.from('packages').select('*');
    const brns = await supabase.from('branches').select('*');
    
    const portalsData = por.data || [];
    const settingsData = set.data || {};
    setData({ invoices: inv.data || [], portals: portalsData, customers: cus.data || [], corporates: corp.data || [], creditors: crd.data || [], recharges: rec.data || [], settings: settingsData, employees: emp.data || [], payroll: pay.data || [], appUsers: usr.data || [], expenses: exp.data || [], services: srv.data || [], cashbook: cbk.data || [], audits: aud.data || [], investments: invstmnt.data || [], vendors: vnd.data || [], customFields: [], packages: pkgs.data || [], branches: brns.data || [] });
    
    if (portalsData.length > 0) setInvForm(f => ({ ...f, portalId: f.portalId || portalsData[0].id }));
    if (settingsData) setSetForm(settingsData);
  };

  const exportToExcel = (csvData, filename) => { 
    if (!csvData || csvData.length === 0) return showToast('No data to export'); 
    try {
      const headers = Object.keys(csvData[0]); 
      const csvRows = [headers.join(',')]; 
      for (const row of csvData) { 
        csvRows.push(headers.map(h => `"${row[h] || ''}"`).join(',')); 
      } 
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' }); 
      const link = document.createElement('a'); 
      link.href = URL.createObjectURL(blob); 
      link.download = `${filename}.csv`; 
      link.click(); 
      showToast('Exported as CSV (Opens in Excel)!'); 
    } catch (err) { showToast('Export Error: ' + err.message); }
  };

  const filterData = (arr, dateKey) => { if (!repDate.from || !repDate.to) return arr; return arr.filter(i => (i[dateKey] || i.created_at?.split('T')[0]) >= repDate.from && (i[dateKey] || i.created_at?.split('T')[0]) <= repDate.to); };

  const getInvoiceHTML = (inv, s, invLang = 'en') => {
    const isAr = invLang === 'ar'; 
    const dir = isAr ? 'rtl' : 'ltr'; 
    const textAlign = isAr ? 'right' : 'left'; 
    const textAlignOpp = isAr ? 'left' : 'right';
    const isRefund = inv.invoice_no.startsWith('REF-');
    
    const linkedInv = inv.linked_inv_id ? data.invoices.find(i => i.id === inv.linked_inv_id) : null;
    const qrData = inv.pdf_url || `Invoice: ${inv.invoice_no} | Total: ${(inv.total||0).toFixed(2)} SAR`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    
    return `
    <div id="invoice-capture" style="width:794px; height:1123px; padding:40px; box-sizing:border-box; background:#fff; color:#333; font-family:'Segoe UI', Tahoma, Arial; direction:${dir}; text-align:${textAlign}; display:flex; flex-direction:column; justify-content:space-between; border: 8px solid #1E3A8A; border-radius: 15px; box-shadow: inset 0 0 0 2px #FBBF24; overflow: hidden;">
      
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #FBBF24; padding-bottom:15px; margin-bottom:15px;">
          <div style="display:flex; align-items:center; gap:15px;">
            ${s.logo_url ? `<img src="${s.logo_url}" crossorigin="anonymous" style="height:80px;width:auto;object-fit:contain;" />` : ''}
            <div style="text-align: right; direction: rtl;">
              <h1 style="margin:0;color:#1E3A8A;font-size:20px;font-weight:bold;">${s.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h1>
              <p style="font-size:11px;margin-top:5px;line-height:1.6;color:#555;">
                عنوان: ${s.address_ar || ''}<br/>
                هاتف: ${s.phone || ''}<br/>
                سجل تجاري: ${s.cr_no || ''}<br/>
                ضريبة القيمة المضافة: ${s.vat_no || ''}<br/>
                رقم الترخيص: ${s.license_no || ''}<br/>
                ترخيص سياحي: ${s.tourist_license_no || ''}
              </p>
            </div>
          </div>
          <div style="text-align:${textAlignOpp};background:#1E3A8A;color:#fff;padding:15px 20px;border-radius:8px;min-width:220px;">
            <h1 style="margin:0;font-size:18px;">${isRefund ? 'CREDIT NOTE' : 'TAX INVOICE'}<br/><span style="font-size:14px; color:#FBBF24;">${isRefund ? 'فاتورة إشعار دائن' : 'فاتورة ضريبية'}</span></h1>
            <p style="font-size:12px;margin-top:8px;color:#eee; text-align:${textAlignOpp};">
              Inv No / رقم: <b>${inv.invoice_no}</b><br/>
              Date / التاريخ: <b>${inv.invoice_date}</b><br/>
              Payment / الدفع: <b>${inv.payment_method}</b>
            </p>
          </div>
        </div>
        
        <div style="display:flex;justify-content:space-between;background:#f8fafc;padding:10px;border-radius:8px; margin-bottom:15px;">
          <div>
            <h3 style="margin:0 0 5px;color:#1E3A8A;font-size:13px;">BILL TO / الفاتورة إلى:</h3>
            <p style="margin:0;font-size:15px;font-weight:bold;">${inv.customers?.name || inv.corporates?.name || ''}</p>
            <p style="margin:3px 0 0;font-size:11px;color:#666;">${inv.customers?.phone || inv.corporates?.phone || ''} ${inv.corporates?.vat_no ? '| VAT: '+inv.corporates.vat_no : ''}</p>
          </div>
          <div style="text-align:${textAlignOpp};">
            <p style="margin:0;font-size:11px;"><b>Sales Person / الموظف:</b> ${inv.employees?.name || 'N/A'}</p>
            <p style="margin:3px 0 0;font-size:11px;"><b>Booking Type / نوع الحجز:</b> ${inv.booking_type || 'New Booking'}</p>
            ${!isRefund ? `<p style="margin:3px 0 0;font-size:11px;"><b>Trip Type / نوع الرحلة:</b> ${inv.flight_journey || 'Single'}</p>` : `<p style="margin:3px 0 0;font-size:11px;color:#EF4444;"><b>Reason / السبب:</b> ${inv.refund_reason || 'N/A'}</p>`}
          </div>
        </div>

        ${inv.passenger_names ? `<div style="margin-bottom:15px;padding:8px;background:#fff;border:1px dashed #ddd;border-radius:6px; max-height: 120px; overflow: hidden;"><b style="font-size:11px;">Passengers / الركاب:</b><br/><span style="font-size:12px;white-space:pre-wrap;margin-top:3px;display:inline-block;">${inv.passenger_names}</span></div>` : ''}
      </div>

      <div style="flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center;">
        ${linkedInv ? `
          <h4 style="margin:0 0 8px; color:#1E3A8A; font-size:12px;">Previous Booking Details / تفاصيل الحجز السابق</h4>
          <table style="width:100%;border-collapse:collapse;text-align:center;margin-bottom:15px;font-size:11px;">
            <thead><tr style="background:#f1f5f9;color:#333;"><th style="padding:6px;border:1px solid #ddd;">Old Inv No</th><th style="padding:6px;border:1px solid #ddd;">Old PNR</th><th style="padding:6px;border:1px solid #ddd;">Old Ticket</th><th style="padding:6px;border:1px solid #ddd;">Old Total</th><th style="padding:6px;border:1px solid #ddd;">Refund/Credit Used</th></tr></thead>
            <tbody><tr><td style="padding:6px;border:1px solid #ddd;">${linkedInv.invoice_no}</td><td style="padding:6px;border:1px solid #ddd;">${linkedInv.pnr || 'N/A'}</td><td style="padding:6px;border:1px solid #ddd;">${linkedInv.ticket_no || 'N/A'}</td><td style="padding:6px;border:1px solid #ddd;">${(linkedInv.total || 0).toFixed(2)}</td><td style="padding:6px;border:1px solid #ddd;color:#059669;font-weight:bold;">- ${(inv.used_credit || 0).toFixed(2)}</td></tr></tbody>
          </table>
        ` : ''}

        <h4 style="margin:0 0 8px; color:#1E3A8A; font-size:12px;">Current Booking / الحجز الحالي</h4>
        <table style="width:100%;border-collapse:collapse;text-align:center;">
          <thead>
            <tr style="background:#1E3A8A;color:#fff;">
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Service / الخدمة</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Sector / القطاع</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">PNR</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Ticket #</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Qty</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Cost</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Sell</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">VAT</th>
              <th style="padding:8px;border:1px solid #1e3a8a;font-size:11px;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background:#ffffff;">
              <td style="padding:8px;border:1px solid #ddd;">${inv.service_type}</td>
              <td style="padding:8px;border:1px solid #ddd;">${inv.flight_sector || inv.sector || 'N/A'}</td>
              <td style="padding:8px;border:1px solid #ddd;">${inv.pnr || 'N/A'}</td>
              <td style="padding:8px;border:1px solid #ddd;">${inv.ticket_no || 'N/A'}</td>
              <td style="padding:8px;border:1px solid #ddd;">${inv.qty || 1}</td>
              <td style="padding:8px;border:1px solid #ddd;">${(inv.total_cost || 0).toFixed(2)}</td>
              <td style="padding:8px;border:1px solid #ddd;">${(inv.total_sell || 0).toFixed(2)}</td>
              <td style="padding:8px;border:1px solid #ddd;">${(inv.vat || 0).toFixed(2)}</td>
              <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">${(inv.total || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="border-top:2px solid #FBBF24; padding-top:15px; margin-top:20px; display:flex; justify-content:space-between; align-items:flex-end;">
        <div style="text-align:center;">
          <img src="${qrUrl}" alt="QR" style="width:100px;height:100px;"/>
        </div>
        <div style="text-align:${textAlignOpp};">
          <p style="margin:0;font-size:18px;color:#1E3A8A;font-weight:bold;">Total / الإجمالي: <span style="color:#EF4444;">${(inv.total || 0).toFixed(2)} SAR</span></p>
          <p style="margin:5px 0 0;font-size:12px;color:#555;">Paid / المدفوع: ${(inv.paid_amount || 0).toFixed(2)} | Due / المتبقي: <b style="color:#EF4444;">${(inv.due_amount || 0).toFixed(2)}</b></p>
          <p style="margin:10px 0 0;font-size:11px;color:#888;">${s.invoice_footer || 'Thank you for choosing us!'}</p>
        </div>
      </div>
    </div>`;
  };

  return {
    user, setUser, userProfile, setUserProfile, lang, setLang, page, setPage, payFilter, setPayFilter, router, toast, setToast, modal, setModal, passForm, setPassForm, chatOpen, setChatOpen, chatMessages, setChatMessages, chatInput, setChatInput, search, setSearch, tblPage, setTblPage, itemsPerPage, ledgerCustId, setLedgerCustId, previewHTML, setPreviewHTML, data, setData, today, editInvId, setEditInvId, invForm, setInvForm, expForm, setExpForm, editCorpId, setEditCorpId, corpForm, setCorpForm, editCredId, setEditCredId, creditorForm, setCreditorForm, editCustId, setEditCustId, custForm, setCustForm, editVendId, setEditVendId, vendorForm, setVendorForm, editPkgId, setEditPkgId, pkgForm, setPkgForm, editBrnId, setEditBrnId, brnForm, setBrnForm, editEmpId, setEditEmpId, empForm, setEmpForm, editSrvId, setEditSrvId, srvForm, setSrvForm, editUserId, setEditUserId, investForm, setInvestForm, settleForm, setSettleForm, refundForm, setRefundForm, transferForm, setTransferForm, repDate, setRepDate, reportTab, setReportTab, statementTab, setStatementTab, setForm, setSetForm, userForm, setUserForm, portalForm, setPortalForm, tr, t, showToast, logAction, fetchAll, exportToExcel, filterData, getInvoiceHTML
  };
}
