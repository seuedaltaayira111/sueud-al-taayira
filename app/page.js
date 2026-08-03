'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [previewInv, setPreviewInv] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showOverduePopup, setShowOverduePopup] = useState(false);
  const router = useRouter();

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], recharges: [], settings: {}, employees: [], payroll: [], appUsers: [], expenses: [], services: [], cashbook: [], audits: [], investments: [] });
  const today = new Date().toISOString().split('T')[0];
  
  const [invForm, setInvForm] = useState({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', passengerNames: '', employeeId: '', portal: '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', flightSub: 'New Booking', flightJourney: 'Single', flightSector: '', airline: '', destination: '', hotelName: '', visaType: 'Tourist', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed' });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, desc: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash', tabbyNo: '', tamaraNo: '' });
  const [refundForm, setRefundForm] = useState({ id: '', compRefund: 0, custRefund: 0 });
  const [cashForm, setCashForm] = useState({ date: today, type: 'Cash-In', desc: '', amount: '' });
  const [walletForm, setWalletForm] = useState({ custId: '', amount: 0, type: 'Add' });
  const [reportTab, setReportTab] = useState('pnl');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const t = {
    en: { dash: 'Dashboard', create: 'Create Invoice', list: 'Invoices List', refunds: 'Refund Invoices', customers: 'Customer List', portals: 'Portals & Recharge', hr: 'HR & Accounts', invest: 'Investments', users: 'User Management', reports: 'Financial Reports', audit: 'Audit Logs', settings: 'Settings', logout: 'Logout' },
    ar: { dash: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'قائمة الفواتير', refunds: 'فواتير الاسترجاع', customers: 'قائمة العملاء', portals: 'البوابات والرصيد', hr: 'الموارد البشرية والحسابات', invest: 'الاستثمارات', users: 'إدارة المستخدمين', reports: 'التقارير المالية', audit: 'سجلات التدقيق', settings: 'الإعدادات', logout: 'تسجيل الخروج' }
  };
  const tr = t[lang];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return router.push('/login');
      setUser(session.user);
      fetchAll();
    });
  }, [router]);

  const logAction = async (action) => {
    if (user) await supabase.from('audit_logs').insert([{ user_email: user.email, action }]);
  };

  // SPEED FIX: Added .limit(50) to large tables
  const fetchAll = async () => {
    const inv = await supabase.from('invoices').select(`*, customers(name, type), portals(name), employees(name)`).order('created_at', { ascending: false }).limit(50);
    const por = await supabase.from('portals').select('*');
    const cus = await supabase.from('customers').select('*').order('name', { ascending: true }).limit(100);
    const rec = await supabase.from('recharges').select(`*, portals(name)`).order('recharge_date', { ascending: false }).limit(50);
    const set = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    const emp = await supabase.from('employees').select('*');
    const pay = await supabase.from('payroll').select(`*, employees(name)`).limit(50);
    const usr = await supabase.from('app_users').select('*');
    const exp = await supabase.from('expenses').select('*').limit(50);
    const srv = await supabase.from('services').select('*');
    const cbk = await supabase.from('cashbook').select('*').order('trans_date', { ascending: false }).limit(50);
    const aud = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
    const invstmnt = await supabase.from('investments').select('*').order('invest_date', { ascending: false }).limit(50);
    
    const portalsData = por.data || [];
    const servicesData = srv.data || [];
    setData({ invoices: inv.data || [], portals: portalsData, customers: cus.data || [], recharges: rec.data || [], settings: set.data || {}, employees: emp.data || [], payroll: pay.data || [], appUsers: usr.data || [], expenses: exp.data || [], services: servicesData, cashbook: cbk.data || [], audits: aud.data || [], investments: invstmnt.data || [] });
    
    if (portalsData.length > 0) setInvForm(f => ({ ...f, portal: f.portal || portalsData[0].name }));
    if (servicesData.length > 0 && !servicesData.find(s => s.name === invForm.service)) setInvForm(f => ({ ...f, service: servicesData[0].name }));

    const overdue = (inv.data || []).filter(i => i.due_amount > 0 && i.credit_due_date && new Date(i.credit_due_date) < new Date(today));
    if (overdue.length > 0) setShowOverduePopup(true);
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const qty = parseInt(invForm.qty) || 1;
      const cost = (parseFloat(invForm.cost) || 0) * qty;
      let sell = (parseFloat(invForm.sell) || 0) * qty;
      const discount = parseFloat(invForm.discount) || 0;
      sell = sell - discount;
      const taxRate = parseFloat(invForm.taxRate) || 0;
      const vat = sell * (taxRate / 100);
      const total = sell + vat;
      const paid = parseFloat(invForm.paid) || 0;
      const due = total - paid;
      const profit = sell - cost;

      let cid;
      if (invForm.custId === 'new') {
        const exists = data.customers.find(c => c.name.toLowerCase() === invForm.custName.toLowerCase() || (c.phone && c.phone === invForm.custPhone));
        if (exists) {
          alert("Customer already exists! Selecting existing customer.");
          cid = exists.id;
        } else {
          const { data: nC, error: custErr } = await supabase.from('customers').insert([{ name: invForm.custName, phone: invForm.custPhone, type: invForm.custType }]).select().single();
          if (custErr) throw custErr;
          cid = nC.id;
        }
      } else { cid = invForm.custId; }

      const { data: pArr } = await supabase.from('portals').select('*').eq('name', invForm.portal).limit(1);
      const portal = pArr && pArr.length > 0 ? pArr[0] : null;
      if (!portal) throw new Error("Please select a valid Portal/Company.");

      let desc = '';
      if (invForm.service === 'Flight') desc = `${invForm.flightSub} (${invForm.flightType}) - ${invForm.airline} - ${invForm.flightJourney} - ${invForm.flightSector}`;
      else if (invForm.service === 'Hotel') desc = `${invForm.hotelName} - ${invForm.destination}`;
      else if (invForm.service.includes('Visa')) desc = `${invForm.visaType} Visa`;
      else desc = invForm.service;

      const payload = {
        customer_id: cid, portal_id: portal.id, employee_id: invForm.employeeId || null,
        booking_date: invForm.bookingDate, invoice_date: invForm.invoiceDate,
        service_type: invForm.service, flight_type: invForm.flightType, flight_sub: invForm.flightSub, pnr: invForm.pnr, ticket_no: invForm.ticketNo, sector: desc, qty: qty, discount: discount,
        passenger_names: invForm.passengerNames || null,
        airline: invForm.airline || null, flight_journey: invForm.flightJourney || null, flight_sector: invForm.flightSector || null, // EDIT FIX
        total_cost: cost, total_sell: sell, profit, vat, total, paid_amount: paid, due_amount: due, payment_method: invForm.payment,
        credit_due_date: due > 0 ? invForm.creditDueDate : null,
        tabby_order_no: invForm.payment === 'Tabby' ? invForm.tabbyNo : null,
        tamara_order_no: invForm.payment === 'Tamara' ? invForm.tamaraNo : null,
        ticket_status: invForm.ticketStatus
      };

      if (editingId) {
        const { error: editErr } = await supabase.from('invoices').update(payload).eq('id', editingId);
        if (editErr) throw editErr;
        await logAction(`Updated Invoice ID ${editingId}`);
        alert('Invoice Updated Successfully!');
        setEditingId(null);
      } else {
        const invNo = `INV-${Date.now()}`;
        const { error: invErr } = await supabase.from('invoices').insert([{ invoice_no: invNo, ...payload }]);
        if (invErr) throw invErr;
        
        await supabase.from('portals').update({ current_balance: (portal.current_balance || 0) - cost }).eq('id', portal.id);
        if (paid > 0) {
          const cbType = invForm.payment === 'Cash' ? 'Cash-In' : (invForm.payment === 'Bank Transfer' ? 'Bank-In' : null);
          if (cbType) await supabase.from('cashbook').insert([{ trans_date: invForm.invoiceDate, type: cbType, description: `Payment for ${invNo}`, amount: paid }]);
        }
        await logAction(`Created Invoice ${invNo}`);
        alert('Invoice Generated Successfully!');
      }
      
      fetchAll();
      setInvForm({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', passengerNames: '', employeeId: '', portal: data.portals[0]?.name || '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', flightSub: 'New Booking', flightJourney: 'Single', flightSector: '', airline: '', destination: '', hotelName: '', visaType: 'Tourist', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed' });
      setPage('list');
    } catch (err) { alert('Error: ' + err.message); }
  };

  // EDIT FIX: Properly mapping all fields
  const handleEditClick = (inv) => {
    setEditingId(inv.id);
    setInvForm({
      custId: inv.customer_id, custName: '', custPhone: '', custType: inv.customers?.type || 'Individual', passengerNames: inv.passenger_names || '',
      employeeId: inv.employee_id || '', portal: inv.portals?.name || '', bookingDate: inv.booking_date || today, invoiceDate: inv.invoice_date || today,
      service: inv.service_type, flightType: inv.flight_type || 'Domestic', flightSub: inv.flight_sub || 'New Booking', 
      flightJourney: inv.flight_journey || 'Single', flightSector: inv.flight_sector || '', airline: inv.airline || '', 
      destination: '', hotelName: '', visaType: 'Tourist', pnr: inv.pnr || '', ticketNo: inv.ticket_no || '', 
      qty: inv.qty || 1, cost: inv.total_cost || 0, sell: inv.total_sell || 0, discount: inv.discount || 0, taxRate: inv.vat > 0 ? '15' : '0', 
      payment: inv.payment_method || 'Cash', paid: inv.paid_amount || 0, creditDueDate: inv.credit_due_date || '', 
      tabbyNo: inv.tabby_order_no || '', tamaraNo: inv.tamara_order_no || '', ticketStatus: inv.ticket_status || 'Confirmed'
    });
    setPage('create');
  };

  const handleSettlePayment = async (e) => {
    e.preventDefault();
    const { data: invArr } = await supabase.from('invoices').select('*').eq('id', settleForm.id).limit(1);
    if (!invArr || invArr.length === 0) return alert('Invoice not found');
    const inv = invArr[0];
    
    const newPaid = inv.paid_amount + inv.due_amount;
    await supabase.from('invoices').update({ 
      paid_amount: newPaid, due_amount: 0, settlement_date: settleForm.date, payment_method: settleForm.mode,
      tabby_order_no: settleForm.mode === 'Tabby' ? settleForm.tabbyNo : null, tamara_order_no: settleForm.mode === 'Tamara' ? settleForm.tamaraNo : null
    }).eq('id', inv.id);
    
    const cbType = settleForm.mode === 'Cash' ? 'Cash-In' : (settleForm.mode === 'Bank Transfer' ? 'Bank-In' : null);
    if (cbType) await supabase.from('cashbook').insert([{ trans_date: settleForm.date, type: cbType, description: `Settlement for ${inv.invoice_no}`, amount: inv.due_amount }]);
    await logAction(`Settled payment for ${inv.invoice_no}`);

    alert('Payment Settled Successfully!');
    setSettleForm({ id: '', date: today, mode: 'Cash', tabbyNo: '', tamaraNo: '' });
    fetchAll();
  };

  const handleRefund = async (e) => {
    e.preventDefault();
    const { data: invArr } = await supabase.from('invoices').select('*, portals(*)').eq('id', refundForm.id).limit(1);
    if (!invArr || invArr.length === 0) return alert('Invoice not found');
    const inv = invArr[0];
    const compRef = parseFloat(refundForm.compRefund) || 0;
    const custRef = parseFloat(refundForm.custRefund) || 0;

    await supabase.from('invoices').update({ status: 'refunded', refund_company: compRef, refund_customer: custRef }).eq('id', inv.id);
    const refNo = `REF-${Date.now()}`;
    await supabase.from('invoices').insert([{
      invoice_no: refNo, customer_id: inv.customer_id, portal_id: inv.portal_id, booking_date: today, invoice_date: today,
      service_type: `Refund for ${inv.invoice_no}`, total_sell: -custRef, total: -custRef, paid_amount: -custRef, status: 'refunded', refund_company: compRef, refund_customer: custRef
    }]);
    if (inv.portals) await supabase.from('portals').update({ current_balance: (inv.portals.current_balance || 0) + compRef }).eq('id', inv.portals.id);
    if (custRef > 0) await supabase.from('cashbook').insert([{ trans_date: today, type: 'Cash-Out', description: `Refund for ${inv.invoice_no}`, amount: custRef }]);
    await logAction(`Processed refund ${refNo}`);

    alert('Refund Processed!');
    setRefundForm({ id: '', compRefund: 0, custRefund: 0 });
    fetchAll();
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    const portalName = e.target.portal.value;
    const amount = parseFloat(e.target.amt.value);
    const date = e.target.date.value;
    const desc = e.target.desc.value;
    
    const p = data.portals.find(p => p.name === portalName);
    if (!p) return alert("Select a valid portal");
    
    const { error: recErr } = await supabase.from('recharges').insert([{ portal_id: p.id, amount: amount, recharge_date: date, description: desc }]);
    if (recErr) return alert("Error saving recharge: " + recErr.message);
    
    const newBalance = (p.current_balance || 0) + amount;
    const { error: balErr } = await supabase.from('portals').update({ current_balance: newBalance }).eq('id', p.id);
    if (balErr) return alert("Error updating balance: " + balErr.message);
    
    await logAction(`Recharged ${amount} to ${portalName}`);
    alert('Recharge Added Successfully!');
    fetchAll();
    e.target.reset();
  };

  // RECHARGE DELETE & DEDUCT FIX
  const handleDeleteRecharge = async (rec) => {
    if (!confirm('Delete this recharge? Portal balance will be reduced.')) return;
    await supabase.from('recharges').delete().eq('id', rec.id);
    const p = data.portals.find(p => p.id === rec.portal_id);
    if (p) {
      const newBalance = (p.current_balance || 0) - rec.amount;
      await supabase.from('portals').update({ current_balance: newBalance }).eq('id', p.id);
    }
    await logAction(`Deleted recharge of ${rec.amount} for ${p?.name}`);
    alert('Recharge Deleted & Balance Updated!');
    fetchAll();
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    await supabase.from('investments').insert([{ investor_name: investForm.name, amount: parseFloat(investForm.amount), invest_date: investForm.date, description: investForm.desc }]);
    await logAction(`Added investment from ${investForm.name}`);
    alert('Investment Added!');
    setInvestForm({ name: '', amount: '', date: today, desc: '' });
    fetchAll();
  };

  const handleAddCash = async (e) => {
    e.preventDefault();
    await supabase.from('cashbook').insert([{ trans_date: cashForm.date, type: cashForm.type, description: cashForm.desc, amount: parseFloat(cashForm.amount) }]);
    await logAction(`Added cashbook entry: ${cashForm.desc}`);
    alert('Transaction Added!');
    setCashForm({ date: today, type: 'Cash-In', desc: '', amount: '' });
    fetchAll();
  };

  const handleWalletAdjust = async (e) => {
    e.preventDefault();
    const cust = data.customers.find(c => c.id === walletForm.custId);
    if(!cust) return alert("Select Customer");
    const amt = parseFloat(walletForm.amount) || 0;
    const newBal = (cust.wallet_balance || 0) + (walletForm.type === 'Add' ? amt : -amt);
    await supabase.from('customers').update({ wallet_balance: newBal }).eq('id', walletForm.custId);
    await supabase.from('cashbook').insert([{ trans_date: today, type: walletForm.type === 'Add' ? 'Cash-In' : 'Cash-Out', description: `Wallet adjustment for ${cust.name}`, amount: amt }]);
    await logAction(`Adjusted wallet for ${cust.name}`);
    alert('Wallet Updated!');
    setWalletForm({ custId: '', amount: 0, type: 'Add' });
    fetchAll();
  };

  const handleDocUpload = async (custId, file, docType) => {
    if (!file) return;
    const fileName = `doc_${Date.now()}.png`;
    const { error } = await supabase.storage.from('documents').upload(fileName, file);
    if (error) return alert('Error: ' + error.message);
    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);
    await supabase.from('customers').update({ [docType]: urlData.publicUrl }).eq('id', custId);
    alert('Document Uploaded!');
    fetchAll();
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Delete permanently?')) return;
    await supabase.from(table).delete().eq('id', id);
    await logAction(`Deleted record ${id} from ${table}`);
    fetchAll();
  };

  const handleAddEntity = async (table, payload, msg) => {
    const { error } = await supabase.from(table).insert([payload]);
    if (error) return alert('Error: ' + error.message);
    await logAction(`Added new ${msg} in ${table}`);
    alert(msg + ' Added!');
    fetchAll();
  };

  const exportCSV = (csvData, filename) => {
    if (!csvData || csvData.length === 0) return alert('No data to export');
    const headers = Object.keys(csvData[0]);
    const csvRows = [headers.join(',')];
    for (const row of csvData) { csvRows.push(headers.map(h => `"${row[h] || ''}"`).join(',')); }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // PDF FIX: Larger Logo & Detailed Table
  const downloadPDF = async (inv) => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const { default: QRCode } = await import('qrcode');
      const s = data.settings;
      const enc = (tag, v) => String.fromCharCode(tag) + String.fromCharCode(v.length) + v;
      const tlv = enc(1, s.company_name_en||"S") + enc(2, s.vat_no||"V") + enc(3, new Date(inv.created_at).toISOString()) + enc(4, inv.total.toFixed(2)) + enc(5, inv.vat.toFixed(2));
      const qr = await QRCode.toDataURL(btoa(tlv));
      const isExempt = inv.vat === 0;
      const taxLabel = isExempt ? 'Exempt (معافاة)' : 'VAT 15% (ضريبة 15%)';

      const html = document.createElement('div');
      html.style.cssText = 'width:800px;padding:40px;font-family:Arial;background:#fff;color:#333;';
      html.innerHTML = `
        <div style="display:flex;justify-content:space-between;border-bottom:4px solid #D4AF37;padding-bottom:20px;margin-bottom:20px;">
          <div style="max-width:350px;">
            ${s.logo_url ? `<img src="${s.logo_url}" crossorigin="anonymous" style="height:120px;margin-bottom:10px;" />` : ''}
            <h1 style="margin:0;color:#0F3D2E;font-size:24px;">Sueud Al Taayira</h1>
            <h2 style="margin:0;color:#0F3D2E;font-size:20px;">صعود الطائرة للسفر والسياحة</h2>
            <p style="font-size:12px;margin-top:10px;line-height:1.5;">VAT / الرقم الضريبي: ${s.vat_no || ''}<br/>CR / السجل التجاري: ${s.cr_no || ''}<br/>Address / الموقع: ${s.address || ''}<br/>Phone / هاتف: ${s.phone || ''}</p>
          </div>
          <div style="text-align:right;">
            <h1 style="color:#0F3D2E;margin:0;font-size:28px;">TAX INVOICE</h1>
            <h2 style="color:#D4AF37;margin:0;font-size:22px;">فاتورة ضريبية</h2>
            <p style="font-size:14px;margin-top:10px;line-height:1.5;">Invoice No / رقم الفاتورة: ${inv.invoice_no}<br/>Date / التاريخ: ${inv.invoice_date}</p>
          </div>
        </div>
        <div style="margin-bottom:20px;border:1px solid #eee;padding:15px;background:#f9f9f9;border-radius:8px;">
          <table style="width:100%;font-size:12px;">
            <tr>
              <td><b>Customer / العميل:</b> ${inv.customers?.name || ''} (${inv.customers?.type || 'Individual'})</td>
              <td><b>Phone / الهاتف:</b> ${inv.customers?.phone || ''}</td>
              <td><b>Sales Rep / موظف المبيعات:</b> ${inv.employees?.name || 'N/A'}</td>
            </tr>
          </table>
          ${inv.passenger_names ? `<div style="margin-top:10px;font-size:12px;"><b>Passengers / المسافرون:</b><br/><span style="white-space:pre-wrap;">${inv.passenger_names}</span></div>` : ''}
        </div>
        
        <table style="width:100%;border-collapse:collapse;text-align:center;font-size:12px;margin-bottom:20px;">
          <thead><tr style="background:#0F3D2E;color:#fff;">
            <th style="padding:8px;border:1px solid #ddd;">Service / الخدمة</th>
            <th style="padding:8px;border:1px solid #ddd;">Flight Type / نوع الرحلة</th>
            <th style="padding:8px;border:1px solid #ddd;">Journey / الرحلة</th>
            <th style="padding:8px;border:1px solid #ddd;">Airline / شركة الطيران</th>
            <th style="padding:8px;border:1px solid #ddd;">Sector / القطاع</th>
            <th style="padding:8px;border:1px solid #ddd;">PNR / رقم الحجز</th>
            <th style="padding:8px;border:1px solid #ddd;">Ticket No / رقم التذكرة</th>
            <th style="padding:8px;border:1px solid #ddd;">Qty / الكمية</th>
            <th style="padding:8px;border:1px solid #ddd;">Amount / المبلغ</th>
          </tr></thead>
          <tbody><tr>
            <td style="padding:8px;border:1px solid #ddd;">${inv.service_type}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.flight_type || 'N/A'}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.flight_journey || 'N/A'}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.airline || 'N/A'}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.flight_sector || 'N/A'}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.pnr || 'N/A'}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.ticket_no || 'N/A'}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.qty || 1}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.total_sell.toFixed(2)} SAR</td>
          </tr></tbody>
        </table>

        <div style="display:flex;justify-content:space-between;margin-top:30px;">
          <div style="text-align:center;"><img src="${qr}" width="120" height="120" /><p style="font-size:10px;margin-top:5px;">Scan ZATCA / امسح الرمز</p></div>
          <div style="text-align:right;width:300px;font-size:14px;">
            <p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;"><span>Total Before VAT / الإجمالي قبل الضريبة:</span><b>${inv.total_sell.toFixed(2)} SAR</b></p>
            ${inv.discount > 0 ? `<p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;color:#e74c3c;"><span>Discount / خصم:</span><b>- ${inv.discount.toFixed(2)} SAR</b></p>` : ''}
            <p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;"><span>${taxLabel}:</span><b>${inv.vat.toFixed(2)} SAR</b></p>
            <p style="display:flex;justify-content:space-between;background:#f0f0f0;padding:10px;font-weight:bold;font-size:16px;border:1px solid #ddd;"><span>Total After VAT / الإجمالي بعد الضريبة:</span><b>${inv.total.toFixed(2)} SAR</b></p>
            <p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;color:#27ae60;"><span>Paid / مدفوع (${inv.payment_method || 'N/A'}):</span><b>${inv.paid_amount.toFixed(2)} SAR</b></p>
            <p style="display:flex;justify-content:space-between;padding:5px 0;color:#e74c3c;font-weight:bold;font-size:16px;"><span>Due Amount / المبلغ المتبقي:</span><b>${inv.due_amount.toFixed(2)} SAR</b></p>
          </div>
        </div>
        <div style="margin-top:50px;display:flex;justify-content:space-between;"><div style="text-align:center;border-top:1px solid #333;padding-top:5px;width:150px;font-size:12px;">Received By / استلم بواسطة</div><div style="text-align:center;border-top:1px solid #333;padding-top:5px;width:150px;font-size:12px;">Customer Sign / توقيع العميل</div></div>
      `;
      document.body.appendChild(html);
      const canvas = await html2canvas(html, { useCORS: true, allowTaint: true });
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
      doc.save(`${inv.invoice_no}.pdf`);
      document.body.removeChild(html);
    } catch (err) { alert('PDF Error: ' + err.message); }
  };

  const shareWhatsApp = (inv) => {
    const phone = inv.customers?.phone ? inv.customers.phone.replace(/\D/g, '') : '';
    const msg = `Dear ${inv.customers?.name || 'Customer'},%0a%0aYour Invoice *${inv.invoice_no}* from *Sueud Al Taayira*.%0aTotal: *${inv.total.toFixed(2)} SAR*%0aPaid: *${inv.paid_amount.toFixed(2)} SAR*%0aDue: *${inv.due_amount.toFixed(2)} SAR*%0a%0aThank you for choosing us!`;
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  if (!user) return <div style={{ padding: 50, textAlign: 'center' }}>Loading ERP...</div>;

  const activeInv = data.invoices.filter(i => !i.invoice_no.startsWith('REF-'));
  const refundInv = data.invoices.filter(i => i.invoice_no.startsWith('REF-'));
  const outstandingInv = activeInv.filter(i => i.due_amount > 0);
  const overdueInv = outstandingInv.filter(i => i.credit_due_date && new Date(i.credit_due_date) < new Date(today));
  const pendingTickets = activeInv.filter(i => i.ticket_status !== 'Confirmed');
  const todaysBookings = activeInv.filter(i => i.booking_date === today);
  
  const tSales = activeInv.reduce((s,i) => s + i.total, 0);
  const tProfit = activeInv.reduce((s,i) => s + i.profit, 0);
  const tExp = data.expenses.reduce((s,e) => s + e.amount, 0);
  const tSal = data.payroll.reduce((s,p) => s + p.amount, 0);
  const netProfit = tProfit - tExp - tSal;
  const totalOutstanding = outstandingInv.reduce((s,i) => s + i.due_amount, 0);
  const tRecharges = data.recharges.reduce((s,r) => s + r.amount, 0);
  const tInvestments = data.investments.reduce((s,i) => s + i.amount, 0);
  
  const cashIn = data.cashbook.filter(c => c.type === 'Cash-In').reduce((s,c) => s + c.amount, 0);
  const cashOut = data.cashbook.filter(c => c.type === 'Cash-Out').reduce((s,c) => s + c.amount, 0);
  const bankIn = data.cashbook.filter(c => c.type === 'Bank-In').reduce((s,c) => s + c.amount, 0);
  const bankOut = data.cashbook.filter(c => c.type === 'Bank-Out').reduce((s,c) => s + c.amount, 0);
  const cashBalance = cashIn - cashOut;
  const bankBalance = bankIn - bankOut;

  const serviceSales = {};
  activeInv.forEach(inv => { serviceSales[inv.service_type] = (serviceSales[inv.service_type] || 0) + inv.total; });
  const totalServiceSales = Object.values(serviceSales).reduce((s, v) => s + v, 0);
  const pieColors = ['#0F3D2E', '#D4AF37', '#2980b9', '#e74c3c', '#8e44ad', '#e67e22'];
  let pieGradient = 'conic-gradient(';
  let accum = 0;
  Object.entries(serviceSales).forEach(([service, amount], i) => {
    const percent = (amount / totalServiceSales) * 100;
    pieGradient += `${pieColors[i % pieColors.length]} ${accum}% ${accum + percent}%, `;
    accum += percent;
  });
  pieGradient = pieGradient.slice(0, -2) + ')';

  const todayDate = new Date();
  const futureDate = new Date(); futureDate.setDate(todayDate.getDate() + 15);
  const expiringIqama = data.employees.filter(e => e.iqama_expiry && new Date(e.iqama_expiry) <= futureDate && new Date(e.iqama_expiry) >= todayDate);
  const currentDay = todayDate.getDate();
  const salaryDueToday = data.employees.filter(e => e.salary_day && parseInt(e.salary_day) === currentDay);

  const filterByDate = (item, dateField) => {
    if (!fromDate || !toDate) return true;
    const itemDate = item[dateField] || item.created_at.split('T')[0];
    return itemDate >= fromDate && itemDate <= toDate;
  };

  const filteredInvoices = data.invoices.filter(inv => filterByDate(inv, 'invoice_date'));
  const filteredRecharges = data.recharges.filter(rec => filterByDate(rec, 'recharge_date'));
  const filteredPayroll = data.payroll.filter(p => filterByDate(p, 'paid_date'));
  const filteredExpenses = data.expenses.filter(e => filterByDate(e, 'expense_date'));
  const filteredCashbook = data.cashbook.filter(c => filterByDate(c, 'trans_date'));
  const filteredInvestments = data.investments.filter(i => filterByDate(i, 'invest_date'));

  const customerReport = {};
  activeInv.forEach(inv => {
    const cName = inv.customers?.name || 'N/A';
    const cType = inv.customers?.type || 'Individual';
    if(!customerReport[cName]) customerReport[cName] = { type: cType, count: 0, total: 0, profit: 0 };
    customerReport[cName].count++;
    customerReport[cName].total += inv.total;
    customerReport[cName].profit += inv.profit;
  });

  const menu = [
    { id: 'dashboard', label: tr.dash },
    { id: 'create', label: tr.create },
    { id: 'list', label: tr.list },
    { id: 'refunds', label: tr.refunds },
    { id: 'customers', label: tr.customers },
    { id: 'portals', label: tr.portals },
    { id: 'invest', label: tr.invest },
    { id: 'hr', label: tr.hr },
    { id: 'users', label: tr.users },
    { id: 'reports', label: tr.reports },
    { id: 'audit', label: tr.audit },
    { id: 'settings', label: tr.settings },
  ];

  const selectedCust = data.customers.find(c => c.id === invForm.custId);
  const currentCustType = invForm.custId === 'new' ? invForm.custType : selectedCust?.type;
  const showPassengerBox = currentCustType === 'Group' || currentCustType === 'Company' || currentCustType === 'Corporate';
  
  const isDuplicate = invForm.custId === 'new' && invForm.custName && data.customers.find(c => c.name.toLowerCase() === invForm.custName.toLowerCase() || (c.phone && c.phone === invForm.custPhone));

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#F5F7F2', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <aside style={{ width: '260px', backgroundColor: '#0F3D2E', color: '#D4AF37', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '2px solid #D4AF37' }}>
          {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'40px', marginBottom:'10px'}} />}
          <h2 style={{ margin: 0 }}>{lang === 'en' ? 'Sueud Al Taayira' : 'صعود الطائرة'}</h2>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {menu.map(m => (
            <button key={m.id} onClick={() => setPage(m.id)} style={{ width: '100%', textAlign: 'left', padding: '15px 20px', background: page === m.id ? '#D4AF37' : 'none', border: 'none', color: page === m.id ? '#0F3D2E' : '#D4AF37', cursor: 'pointer', fontWeight: 'bold' }}>
              {m.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ width: '100%', padding: '10px', background: '#145A38', color: '#D4AF37', border: '1px solid #D4AF37', cursor: 'pointer', marginBottom: '10px' }}>{lang === 'en' ? 'العربية' : 'English'}</button>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#8B0000', color: '#FFF', border: 'none', cursor: 'pointer' }}>{tr.logout}</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ background: 'white', padding: '15px 30px', borderBottom: '2px solid #D4AF37' }}>
          <h2 style={{ margin: 0, color: '#0F3D2E' }}>{editingId && page === 'create' ? 'Edit Invoice' : menu.find(m=>m.id===page)?.label}</h2>
        </header>

        <div style={{ padding: '30px' }}>
          
          {page === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div style={{...styles.card, borderTop: '4px solid #0F3D2E'}}><h3>Total Sales</h3><h1 style={{color:'#0F3D2E'}}>{tSales.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #27ae60'}}><h3>Gross Profit</h3><h1 style={{color:'#27ae60'}}>{tProfit.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #f39c12'}}><h3>Cash Balance</h3><h1 style={{color:'#f39c12'}}>{cashBalance.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #2980b9'}}><h3>Bank Balance</h3><h1 style={{color:'#2980b9'}}>{bankBalance.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #e74c3c'}}><h3>Outstanding</h3><h1 style={{color:'#e74c3c'}}>{totalOutstanding.toFixed(0)} SAR</h1></div>
                <div style={{...styles.card, borderTop: '4px solid #8e44ad'}}><h3>Investments</h3><h1 style={{color:'#8e44ad'}}>{tInvestments.toFixed(0)} SAR</h1></div>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{...styles.card, flex: 1, minWidth: '300px'}}>
                  <h3 style={{color:'#0F3D2E'}}>Sales by Service</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: pieGradient }}></div>
                    <div>
                      {Object.entries(serviceSales).map(([service, amount], i) => (
                        <div key={service} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                          <div style={{ width: '12px', height: '12px', background: pieColors[i % pieColors.length] }}></div>
                          {service}: {amount.toFixed(0)} SAR
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div style={{...styles.card, flex: 1, minWidth: '300px', borderLeft: '4px solid #e67e22'}}>
                  <h3 style={{color:'#e67e22'}}>⚠️ Alerts</h3>
                  <p>📂 Pending Tickets: <b>{pendingTickets.length}</b></p>
                  <p>⚠️ Iqama Expiring: <b>{expiringIqama.length}</b></p>
                  <p>💰 Salary Due Today: <b>{salaryDueToday.length}</b></p>
                </div>
              </div>

              <div style={{...styles.card, marginBottom: '20px'}}>
                <h3 style={{color:'#0F3D2E'}}>Portal Current Balances</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {data.portals.map(p => (
                    <div key={p.id} style={{ flex: 1, minWidth: '150px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                      <h4 style={{margin:'0 0 5px'}}>{p.name}</h4>
                      <h2 style={{margin:0, color: p.current_balance < 0 ? '#e74c3c' : '#0F3D2E'}}>{p.current_balance || 0} SAR</h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {page === 'create' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <form onSubmit={handleCreateInvoice}>
                <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Customer Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={styles.label}>Select Customer</label>
                    <select value={invForm.custId} onChange={(e) => setInvForm({...invForm, custId: e.target.value})} style={styles.i} disabled={editingId}>
                      <option value="new">+ New Customer</option>
                      {data.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                    </select>
                  </div>
                  {invForm.custId === 'new' && <>
                    <div>
                      <label style={styles.label}>Customer / Company Name</label>
                      <input placeholder="Enter Name" value={invForm.custName} onChange={(e) => setInvForm({...invForm, custName: e.target.value})} required style={styles.i} />
                    </div>
                    <div>
                      <label style={styles.label}>Phone Number</label>
                      <input placeholder="Enter Phone" value={invForm.custPhone} onChange={(e) => setInvForm({...invForm, custPhone: e.target.value})} required style={styles.i} />
                    </div>
                    <div>
                      <label style={styles.label}>Customer Type</label>
                      <select value={invForm.custType} onChange={(e) => setInvForm({...invForm, custType: e.target.value})} style={styles.i}>
                        <option>Individual</option><option>Group</option><option>Company</option>
                      </select>
                    </div>
                  </>}
                </div>

                {isDuplicate && (
                  <div style={{ background: '#ffebee', color: '#c0392b', padding: '10px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #e74c3c' }}>
                    ⚠️ <b>Customer already exists!</b> Please select "{isDuplicate.name}" from the dropdown instead of creating a new one.
                  </div>
                )}

                {showPassengerBox && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={styles.label}>Passenger Names (One per line)</label>
                    <textarea placeholder="John Doe\nJane Smith\nAli Ahmed" value={invForm.passengerNames} onChange={(e) => setInvForm({...invForm, passengerNames: e.target.value})} style={{...styles.i, height: '100px'}} />
                  </div>
                )}

                <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Service Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={styles.label}>Service Type</label>
                    <select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.i}>
                      {data.services.map(s => <option key={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  
                  {invForm.service === 'Flight' && <>
                    <div>
                      <label style={styles.label}>Flight Type</label>
                      <select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.i}>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                      </select>
                    </div>
                    <div>
                      <label style={styles.label}>Booking Type</label>
                      <select value={invForm.flightSub} onChange={(e) => setInvForm({...invForm, flightSub: e.target.value})} style={styles.i}>
                        <option>New Booking</option><option>Reissue</option><option>Extra Baggage</option>
                      </select>
                    </div>
                    <div>
                      <label style={styles.label}>Journey Type</label>
                      <select value={invForm.flightJourney} onChange={(e) => setInvForm({...invForm, flightJourney: e.target.value})} style={styles.i}>
                        <option>Single</option><option>Roundtrip</option>
                      </select>
                    </div>
                    <div>
                      <label style={styles.label}>Airline</label>
                      <input placeholder="e.g. Flynas" value={invForm.airline} onChange={(e) => setInvForm({...invForm, airline: e.target.value})} style={styles.i} required />
                    </div>
                    <div>
                      <label style={styles.label}>Sector (From - To)</label>
                      <input placeholder="e.g. JED - RUH" value={invForm.flightSector} onChange={(e) => setInvForm({...invForm, flightSector: e.target.value})} style={styles.i} required />
                    </div>
                    <div>
                      <label style={styles.label}>PNR</label>
                      <input placeholder="Booking Ref" value={invForm.pnr} onChange={(e) => setInvForm({...invForm, pnr: e.target.value})} style={styles.i} required />
                    </div>
                    <div>
                      <label style={styles.label}>Ticket Number</label>
                      <input placeholder="Ticket No" value={invForm.ticketNo} onChange={(e) => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.i} />
                    </div>
                  </>}
                  {invForm.service === 'Hotel' && <>
                    <div>
                      <label style={styles.label}>Destination City</label>
                      <input placeholder="e.g. Dubai" value={invForm.destination} onChange={(e) => setInvForm({...invForm, destination: e.target.value})} style={styles.i} required />
                    </div>
                    <div>
                      <label style={styles.label}>Hotel Name</label>
                      <input placeholder="e.g. Atlantis" value={invForm.hotelName} onChange={(e) => setInvForm({...invForm, hotelName: e.target.value})} style={styles.i} required />
                    </div>
                  </>}
                  {invForm.service.includes('Visa') && <>
                    <div>
                      <label style={styles.label}>Visa Type</label>
                      <select value={invForm.visaType} onChange={(e) => setInvForm({...invForm, visaType: e.target.value})} style={styles.i}>
                        <option>Tourist</option><option>Business</option><option>Work</option><option>Family</option>
                      </select>
                    </div>
                  </>}
                </div>

                <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Pricing & Payment</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={styles.label}>Sales Representative</label>
                    <select value={invForm.employeeId} onChange={(e) => setInvForm({...invForm, employeeId: e.target.value})} style={styles.i}>
                      <option value="">Select Rep</option>
                      {data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Portal / Supplier</label>
                    <select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.i} required>
                      <option value="">Select Portal</option>
                      {data.portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Quantity</label>
                    <input type="number" placeholder="1" value={invForm.qty} onChange={(e) => setInvForm({...invForm, qty: e.target.value})} style={styles.i} required />
                  </div>
                  <div>
                    <label style={styles.label}>Cost Price (Per Unit)</label>
                    <input type="number" placeholder="0.00" value={invForm.cost} onChange={(e) => setInvForm({...invForm, cost: e.target.value})} style={styles.i} required />
                  </div>
                  <div>
                    <label style={styles.label}>Sell Price (Per Unit)</label>
                    <input type="number" placeholder="0.00" value={invForm.sell} onChange={(e) => setInvForm({...invForm, sell: e.target.value})} style={styles.i} required />
                  </div>
                  <div>
                    <label style={styles.label}>Discount (SAR)</label>
                    <input type="number" placeholder="0.00" value={invForm.discount} onChange={(e) => setInvForm({...invForm, discount: e.target.value})} style={styles.i} />
                  </div>
                  <div>
                    <label style={styles.label}>Tax Rate</label>
                    <select value={invForm.taxRate} onChange={(e) => setInvForm({...invForm, taxRate: e.target.value})} style={styles.i}>
                      <option value="15">Tax 15%</option>
                      <option value="0">Tax 0% (Exempt)</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Payment Method</label>
                    <select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.i}>
                      <option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Booking Date</label>
                    <input type="date" value={invForm.bookingDate} onChange={(e) => setInvForm({...invForm, bookingDate: e.target.value})} style={styles.i} required />
                  </div>
                  <div>
                    <label style={styles.label}>Invoice Date (Backdate Allowed)</label>
                    <input type="date" value={invForm.invoiceDate} onChange={(e) => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.i} required />
                  </div>
                  <div>
                    <label style={styles.label}>Paid Amount</label>
                    <input type="number" placeholder="0.00" value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.i} required />
                  </div>
                  
                  {invForm.payment === 'Tabby' && <div><label style={styles.label}>Tabby Order No.</label><input placeholder="Order ID" value={invForm.tabbyNo} onChange={(e) => setInvForm({...invForm, tabbyNo: e.target.value})} style={styles.i} required /></div>}
                  {invForm.payment === 'Tamara' && <div><label style={styles.label}>Tamara Order No.</label><input placeholder="Order ID" value={invForm.tamaraNo} onChange={(e) => setInvForm({...invForm, tamaraNo: e.target.value})} style={styles.i} required /></div>}
                  {invForm.payment === 'Credit' && <div><label style={styles.label}>Credit Due Date</label><input type="date" value={invForm.creditDueDate} onChange={(e) => setInvForm({...invForm, creditDueDate: e.target.value})} style={styles.i} required /></div>}
                </div>
                <button type="submit" style={{ background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', padding: '15px', width: '100%' }}>{editingId ? 'Update Invoice' : 'Generate Invoice'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setInvForm({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', passengerNames: '', portal: data.portals[0]?.name || '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', flightSub: 'New Booking', flightJourney: 'Single', flightSector: '', airline: '', destination: '', hotelName: '', visaType: 'Tourist', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed' }); setPage('list'); }} style={{ background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '15px', width: '100%', marginTop: '10px' }}>Cancel Edit</button>}
              </form>
            </div>
          )}

          {page === 'list' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.th}>Inv No</th><th style={styles.th}>Customer</th><th style={styles.th}>Type</th><th style={styles.th}>Qty</th><th style={styles.th}>Profit</th><th style={styles.th}>Total</th><th style={styles.th}>Actions</th></tr></thead>
                <tbody>
                  {activeInv.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee', backgroundColor: inv.due_amount > 0 ? '#fff3cd' : 'transparent' }}>
                      <td style={styles.td}>{inv.invoice_no}<br/><small>{inv.invoice_date}</small></td><td style={styles.td}>{inv.customers?.name || 'N/A'}</td>
                      <td style={styles.td}>{inv.customers?.type || 'N/A'}</td>
                      <td style={styles.td}>{inv.qty || 1}</td>
                      <td style={{...styles.td, color:'green'}}>{inv.profit} SAR</td><td style={styles.td}>{inv.total} SAR</td>
                      <td style={styles.td}>
                        <button onClick={() => setPreviewInv(inv)} style={styles.btnSm}>Preview</button>
                        <button onClick={() => handleEditClick(inv)} style={{...styles.btnSm, background:'#2980b9'}}>Edit</button>
                        {inv.due_amount > 0 && <button onClick={() => setSettleForm({id: inv.id, date: today, mode: 'Cash', tabbyNo: '', tamaraNo: ''})} style={{...styles.btnSm, background:'#27ae60'}}>Settle</button>}
                        <button onClick={() => setRefundForm({id: inv.id, compRefund: 0, custRefund: 0})} style={{...styles.btnSm, background:'#e67e22'}}>Refund</button>
                        <button onClick={() => handleDelete('invoices', inv.id)} style={{...styles.btnSm, background:'#e74c3c'}}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {settleForm.id && (
                <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #27ae60', borderRadius: '8px' }}>
                  <h3>Settle Credit Payment</h3>
                  <form onSubmit={handleSettlePayment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
                    <input type="date" value={settleForm.date} onChange={(e) => setSettleForm({...settleForm, date: e.target.value})} required style={styles.i} />
                    <select value={settleForm.mode} onChange={(e) => setSettleForm({...settleForm, mode: e.target.value})} style={styles.i}>
                      <option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option>
                    </select>
                    {settleForm.mode === 'Tabby' && <input placeholder="Tabby Order No." value={settleForm.tabbyNo} onChange={(e) => setSettleForm({...settleForm, tabbyNo: e.target.value})} required style={styles.i} />}
                    {settleForm.mode === 'Tamara' && <input placeholder="Tamara Order No." value={settleForm.tamaraNo} onChange={(e) => setSettleForm({...settleForm, tamaraNo: e.target.value})} required style={styles.i} />}
                    <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer' }}>Confirm Settlement</button>
                  </form>
                </div>
              )}

              {refundForm.id && (
                <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #e67e22', borderRadius: '8px' }}>
                  <h3>Process Partial Refund</h3>
                  <form onSubmit={handleRefund} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <input type="number" placeholder="Refund from Company" value={refundForm.compRefund} onChange={(e) => setRefundForm({...refundForm, compRefund: e.target.value})} required style={styles.i} />
                    <input type="number" placeholder="Refund to Customer" value={refundForm.custRefund} onChange={(e) => setRefundForm({...refundForm, custRefund: e.target.value})} required style={styles.i} />
                    <button type="submit" style={{ background: '#e67e22', color: 'white', border: 'none', cursor: 'pointer' }}>Confirm Refund</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {page === 'refunds' && (
             <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #e74c3c' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead><tr style={{ background: '#e74c3c', color: 'white' }}><th style={styles.th}>Refund No</th><th style={styles.th}>Original Inv</th><th style={styles.th}>Cust Refund</th><th style={styles.th}>Comp Refund</th></tr></thead>
                 <tbody>
                   {refundInv.map(inv => (
                     <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                       <td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.service_type}</td>
                       <td style={{...styles.td, color:'red'}}>{inv.refund_customer} SAR</td><td style={{...styles.td, color:'green'}}>{inv.refund_company} SAR</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}

          {page === 'customers' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={styles.card}>
                <h3>Customer Wallet & Documents</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <select value={walletForm.custId} onChange={(e) => setWalletForm({...walletForm, custId: e.target.value})} style={styles.i} required>
                    <option value="">Select Customer</option>
                    {data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select value={walletForm.type} onChange={(e) => setWalletForm({...walletForm, type: e.target.value})} style={styles.i}>
                    <option value="Add">Add to Wallet (Advance)</option>
                    <option value="Deduct">Deduct from Wallet</option>
                  </select>
                  <input type="number" placeholder="Amount" value={walletForm.amount} onChange={(e) => setWalletForm({...walletForm, amount: e.target.value})} style={styles.i} required />
                </div>
                <button onClick={handleWalletAdjust} style={{...styles.btn, width: 'auto', padding: '10px 20px', marginTop: '10px'}}>Update Wallet</button>
              </div>

              <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <h3>Customer List (CRM)</h3>
                  <button onClick={() => exportCSV(data.customers, 'Customers.csv')} style={{...styles.btn, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}>
                    <th style={styles.th}>Name</th><th style={styles.th}>Type</th><th style={styles.th}>Phone</th><th style={styles.th}>Wallet</th><th style={styles.th}>Docs</th><th style={styles.th}>Action</th>
                  </tr></thead>
                  <tbody>
                    {data.customers.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{c.name}</td><td style={styles.td}>{c.type || 'Individual'}</td><td style={styles.td}>{c.phone}</td>
                        <td style={{...styles.td, color: c.wallet_balance > 0 ? 'green' : '#333'}}>{c.wallet_balance || 0} SAR</td>
                        <td style={styles.td}>
                          {c.doc_passport ? <a href={c.doc_passport} target="_blank" style={{color:'#2980b9', marginRight:'5px'}}>Passport</a> : null}
                          {c.doc_visa ? <a href={c.doc_visa} target="_blank" style={{color:'#2980b9'}}>Visa</a> : null}
                        </td>
                        <td style={styles.td}>
                          <input type="file" accept="image/*" onChange={(e) => handleDocUpload(c.id, e.target.files[0], 'doc_passport')} style={{fontSize:'10px', marginBottom:'5px'}} />
                          <input type="file" accept="image/*" onChange={(e) => handleDocUpload(c.id, e.target.files[0], 'doc_visa')} style={{fontSize:'10px'}} />
                          <button onClick={() => handleDelete('customers', c.id)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer', marginTop:'5px'}}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PORTAL & RECHARGE WITH DELETE */}
          {page === 'portals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div style={styles.card}>
                  <h3>Add Portal</h3>
                  <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('portals', { name: e.target.name.value, current_balance: 0 }, 'Portal'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                    <input name="name" placeholder="Portal Name" style={styles.i} required />
                    <button type="submit" style={styles.btn}>Add</button>
                  </form>
                </div>
                <div style={styles.card}>
                  <h3>Recharge Portal</h3>
                  <form onSubmit={handleRecharge} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                    <select name="portal" style={styles.i} required>
                      {data.portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                    <input name="date" type="date" defaultValue={today} style={styles.i} required />
                    <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                    <input name="desc" placeholder="Description" style={styles.i} />
                    <button type="submit" style={styles.btn}>Recharge</button>
                  </form>
                </div>
                <div style={styles.card}>
                  <h3>Balances & Delete</h3>
                  {data.portals.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0', alignItems: 'center' }}>
                      <span>{p.name}<br/><b>{p.current_balance || 0} SAR</b></span>
                      <button onClick={() => handleDelete('portals', p.id)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer'}}>X</button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <h3 style={{color:'#0F3D2E'}}>Recharge History (All Portals)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#2980b9', color: 'white' }}>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Portal / Company</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Description</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recharges.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No recharges yet.</td></tr>
                    ) : (
                      data.recharges.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={styles.td}>{r.recharge_date}</td>
                          <td style={styles.td}>{r.portals?.name || 'N/A'}</td>
                          <td style={{ ...styles.td, color: 'green', fontWeight: 'bold' }}>+{r.amount} SAR</td>
                          <td style={styles.td}>{r.description || 'N/A'}</td>
                          <td style={styles.td}><button onClick={() => handleDeleteRecharge(r)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer'}}>Delete</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVESTMENTS MODULE */}
          {page === 'invest' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>Add Investment (Sponsor)</h3>
                <form onSubmit={handleAddInvestment} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input placeholder="Sponsor Name" value={investForm.name} onChange={(e) => setInvestForm({...investForm, name: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder="Amount Invested" value={investForm.amount} onChange={(e) => setInvestForm({...investForm, amount: e.target.value})} style={styles.i} required />
                  <input type="date" value={investForm.date} onChange={(e) => setInvestForm({...investForm, date: e.target.value})} style={styles.i} required />
                  <input placeholder="Description" value={investForm.desc} onChange={(e) => setInvestForm({...investForm, desc: e.target.value})} style={styles.i} />
                  <button type="submit" style={styles.btn}>Add Investment</button>
                </form>
              </div>
              <div style={styles.card}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <h3>Investment History</h3>
                  <button onClick={() => exportCSV(data.investments, 'Investments.csv')} style={{...styles.btn, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Sponsor</th><th style={styles.th}>Amount</th><th style={styles.th}>Desc</th></tr></thead>
                  <tbody>
                    {data.investments.map(inv => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{inv.invest_date}</td><td style={styles.td}>{inv.investor_name}</td>
                        <td style={{...styles.td, color:'green', fontWeight:'bold'}}>{inv.amount} SAR</td>
                        <td style={styles.td}>{inv.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'hr' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>Add Employee</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('employees', { name: e.target.name.value, role: e.target.role.value, join_date: e.target.join_date.value, iqama_no: e.target.iqama_no.value, iqama_expiry: e.target.iqama_expiry.value, base_salary: parseFloat(e.target.base_sal.value), commission_pct: parseFloat(e.target.comm_pct.value), salary_day: parseInt(e.target.sal_day.value) }, 'Employee'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder="Name" style={styles.i} required />
                  <input name="role" placeholder="Role" style={styles.i} required />
                  <input name="join_date" type="date" style={styles.i} required />
                  <input name="iqama_no" placeholder="Iqama Number" style={styles.i} required />
                  <input name="iqama_expiry" type="date" style={styles.i} required />
                  <input name="base_sal" type="number" placeholder="Base Salary" style={styles.i} required />
                  <input name="comm_pct" type="number" placeholder="Commission %" style={styles.i} required />
                  <input name="sal_day" type="number" min="1" max="31" placeholder="Salary Day (1-31)" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Add Expense</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('expenses', { category: e.target.cat.value, amount: parseFloat(e.target.amt.value), description: e.target.desc.value }, 'Expense'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="cat" placeholder="Category (Rent, Net, etc)" style={styles.i} required />
                  <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                  <input name="desc" placeholder="Desc" style={styles.i} />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Cashbook Entry</h3>
                <form onSubmit={handleAddCash} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input type="date" value={cashForm.date} onChange={(e) => setCashForm({...cashForm, date: e.target.value})} style={styles.i} required />
                  <select value={cashForm.type} onChange={(e) => setCashForm({...cashForm, type: e.target.value})} style={styles.i}>
                    <option>Cash-In</option><option>Cash-Out</option><option>Bank-In</option><option>Bank-Out</option>
                  </select>
                  <input placeholder="Description" value={cashForm.desc} onChange={(e) => setCashForm({...cashForm, desc: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder="Amount" value={cashForm.amount} onChange={(e) => setCashForm({...cashForm, amount: e.target.value})} style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add Entry</button>
                </form>
              </div>
            </div>
          )}

          {page === 'users' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>Add System User</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('app_users', { name: e.target.name.value, email: e.target.email.value, role: e.target.role.value }, 'User'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder="Name" style={styles.i} required />
                  <input name="email" type="email" placeholder="Email" style={styles.i} required />
                  <select name="role" style={styles.i}><option value="sales">Sales</option><option value="acc">Accountant</option><option value="owner">Owner</option></select>
                  <button type="submit" style={styles.btn}>Add User</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Users List & Permissions</h3>
                {data.appUsers.map(u => (
                  <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0', alignItems: 'center' }}>
                    <span>{u.name}<br/><b>{u.email}</b> ({u.role})</span>
                    <button onClick={() => handleDelete('app_users', u.id)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer'}}>X</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'audit' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #34495e' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#34495e', color: 'white' }}><th style={styles.th}>Date & Time</th><th style={styles.th}>User Email</th><th style={styles.th}>Activity / Action</th></tr></thead>
                <tbody>
                  {data.audits.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{new Date(a.created_at).toLocaleString()}</td><td style={styles.td}>{a.user_email}</td><td style={styles.td}>{a.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page === 'reports' && (
            <div style={styles.card}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px', flexWrap:'wrap' }}>
                <button onClick={() => setReportTab('pnl')} style={reportTab==='pnl'?styles.btnSm:styles.btnSmInactive}>P&L Statement</button>
                <button onClick={() => setReportTab('sales')} style={reportTab==='sales'?styles.btnSm:styles.btnSmInactive}>Sales Report</button>
                <button onClick={() => setReportTab('portals')} style={reportTab==='portals'?styles.btnSm:styles.btnSmInactive}>Portals Report</button>
                <button onClick={() => setReportTab('salary')} style={reportTab==='salary'?styles.btnSm:styles.btnSmInactive}>Salary & Exp Report</button>
                <button onClick={() => setReportTab('outstanding')} style={reportTab==='outstanding'?styles.btnSm:styles.btnSmInactive}>Outstanding Report</button>
                <button onClick={() => setReportTab('vat')} style={reportTab==='vat'?styles.btnSm:styles.btnSmInactive}>ZATCA VAT Report</button>
                <button onClick={() => setReportTab('cashbook')} style={reportTab==='cashbook'?styles.btnSm:styles.btnSmInactive}>Cashbook Report</button>
                <button onClick={() => setReportTab('commission')} style={reportTab==='commission'?styles.btnSm:styles.btnSmInactive}>Commission Report</button>
                <button onClick={() => setReportTab('customer')} style={reportTab==='customer'?styles.btnSm:styles.btnSmInactive}>Customer Report</button>
                <button onClick={() => setReportTab('invest')} style={reportTab==='invest'?styles.btnSm:styles.btnSmInactive}>Investment Report</button>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <label>From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={styles.i} /></label>
                <label>To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={styles.i} /></label>
              </div>

              {reportTab === 'pnl' && (
                <div>
                  <h3>Complete P&L Statement (Profit & Loss)</h3>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{flex:1, background:'#e8f8f5', padding:'15px', minWidth:'200px'}}><h4>Total Sales</h4><h2>{filteredInvoices.filter(i=>!i.invoice_no.startsWith('REF-')).reduce((s,i)=>s+i.total,0).toFixed(0)} SAR</h2></div>
                    <div style={{flex:1, background:'#e8f8f5', padding:'15px', minWidth:'200px'}}><h4>Gross Profit</h4><h2>{filteredInvoices.filter(i=>!i.invoice_no.startsWith('REF-')).reduce((s,i)=>s+i.profit,0).toFixed(0)} SAR</h2></div>
                    <div style={{flex:1, background:'#fdedec', padding:'15px', minWidth:'200px'}}><h4>Salaries Paid</h4><h2>-{filteredPayroll.reduce((s,p)=>s+p.amount,0).toFixed(0)} SAR</h2></div>
                    <div style={{flex:1, background:'#fdedec', padding:'15px', minWidth:'200px'}}><h4>Office Expenses</h4><h2>-{filteredExpenses.reduce((s,e)=>s+e.amount,0).toFixed(0)} SAR</h2></div>
                    <div style={{flex:1, background:'#0F3D2E', color:'#D4AF37', padding:'15px', minWidth:'200px'}}><h4>Net Profit</h4><h2>{(filteredInvoices.filter(i=>!i.invoice_no.startsWith('REF-')).reduce((s,i)=>s+i.profit,0) - filteredPayroll.reduce((s,p)=>s+p.amount,0) - filteredExpenses.reduce((s,e)=>s+e.amount,0)).toFixed(0)} SAR</h2></div>
                  </div>
                </div>
              )}

              {reportTab === 'sales' && (
                <div>
                  <h3>Sales Report</h3>
                  <button onClick={() => exportCSV(filteredInvoices.map(i => ({ InvNo: i.invoice_no, Customer: i.customers?.name, Date: i.invoice_date, Service: i.service_type, Total: i.total, Profit: i.profit, Status: i.status })), 'Sales_Report.csv')} style={{...styles.btn, background: '#27ae60', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Sales Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Invoice</th><th style={styles.th}>Customer</th><th style={styles.th}>Total</th><th style={styles.th}>Profit</th></tr></thead>
                    <tbody>
                      {filteredInvoices.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={styles.td}>{inv.invoice_date}</td><td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.customers?.name}</td>
                          <td style={styles.td}>{inv.total} SAR</td><td style={{...styles.td, color:'green'}}>{inv.profit} SAR</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reportTab === 'portals' && (
                <div>
                  <h3>Portals Recharge Report</h3>
                  <button onClick={() => exportCSV(filteredRecharges.map(r => ({ Date: r.recharge_date, Company: r.portals?.name, Amount: r.amount, Desc: r.description })), 'Recharge_Report.csv')} style={{...styles.btn, background: '#2980b9', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Recharge Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Company</th><th style={styles.th}>Amount</th></tr></thead>
                    <tbody>
                      {filteredRecharges.length === 0 ? (
                        <tr><td colSpan="3" style={{textAlign:'center', padding:'20px'}}>No recharges in this date range.</td></tr>
                      ) : (
                        filteredRecharges.map(rec => (
                          <tr key={rec.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={styles.td}>{rec.recharge_date}</td><td style={styles.td}>{rec.portals?.name}</td><td style={{...styles.td, color:'blue'}}>{rec.amount} SAR</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {reportTab === 'salary' && (
                <div>
                  <h3>Salary & Expense Report</h3>
                  <button onClick={() => exportCSV([...filteredPayroll.map(p => ({ Type: 'Salary', Name: p.employees?.name, Amount: p.amount, Date: p.paid_date })), ...filteredExpenses.map(e => ({ Type: e.category, Name: e.description, Amount: e.amount, Date: e.expense_date }))], 'Salary_Expense_Report.csv')} style={{...styles.btn, background: '#e67e22', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Salary & Exp Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Description</th><th style={styles.th}>Amount</th></tr></thead>
                    <tbody>
                      {filteredPayroll.map(p => (<tr key={p.id} style={{ borderBottom: '1px solid #eee' }}><td style={styles.td}>{p.paid_date}</td><td style={styles.td}>Salary</td><td style={styles.td}>{p.employees?.name}</td><td style={{...styles.td, color:'red'}}>-{p.amount} SAR</td></tr>))}
                      {filteredExpenses.map(e => (<tr key={e.id} style={{ borderBottom: '1px solid #eee' }}><td style={styles.td}>{e.expense_date}</td><td style={styles.td}>{e.category}</td><td style={styles.td}>{e.description}</td><td style={{...styles.td, color:'red'}}>-{e.amount} SAR</td></tr>))}
                    </tbody>
                  </table>
                </div>
              )}

              {reportTab === 'outstanding' && (
                <div>
                  <h3>Outstanding Credit Report</h3>
                  <button onClick={() => exportCSV(outstandingInv.map(i => ({ InvNo: i.invoice_no, Customer: i.customers?.name, Phone: i.customers?.phone, Total: i.total, Paid: i.paid_amount, Due: i.due_amount, DueDate: i.credit_due_date })), 'Outstanding_Report.csv')} style={{...styles.btn, background: '#e74c3c', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Outstanding Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Inv No</th><th style={styles.th}>Customer</th><th style={styles.th}>Phone</th><th style={styles.th}>Due Amount</th><th style={styles.th}>Due Date</th><th style={styles.th}>Status</th></tr></thead>
                    <tbody>
                      {outstandingInv.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid #eee', backgroundColor: inv.credit_due_date && new Date(inv.credit_due_date) < new Date(today) ? '#ffebee' : 'transparent' }}>
                          <td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.customers?.name}</td><td style={styles.td}>{inv.customers?.phone}</td>
                          <td style={{...styles.td, color:'red'}}>{inv.due_amount} SAR</td>
                          <td style={styles.td}>{inv.credit_due_date || 'N/A'}</td>
                          <td style={styles.td}>{inv.credit_due_date && new Date(inv.credit_due_date) < new Date(today) ? 'Overdue' : 'Pending'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reportTab === 'vat' && (
                <div>
                  <h3>ZATCA VAT Return Report</h3>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{flex:1, background:'#e8f8f5', padding:'15px', minWidth:'200px'}}><h4>Output VAT (From Sales)</h4><h2>{filteredInvoices.filter(i=>!i.invoice_no.startsWith('REF-')).reduce((s,i)=>s+i.vat,0).toFixed(2)} SAR</h2></div>
                    <div style={{flex:1, background:'#fdedec', padding:'15px', minWidth:'200px'}}><h4>Input VAT (From Expenses)</h4><h2>0.00 SAR</h2> <p style={{fontSize:'12px', color:'#888'}}>(Assuming 0 VAT on expenses)</p></div>
                    <div style={{flex:1, background:'#0F3D2E', color:'#D4AF37', padding:'15px', minWidth:'200px'}}><h4>Net VAT Payable to Govt</h4><h2>{filteredInvoices.filter(i=>!i.invoice_no.startsWith('REF-')).reduce((s,i)=>s+i.vat,0).toFixed(2)} SAR</h2></div>
                  </div>
                </div>
              )}

              {reportTab === 'cashbook' && (
                <div>
                  <h3>Cash & Bank Ledger</h3>
                  <button onClick={() => exportCSV(filteredCashbook.map(c => ({ Date: c.trans_date, Type: c.type, Desc: c.description, Amount: c.amount })), 'Cashbook_Report.csv')} style={{...styles.btn, background: '#2980b9', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Cashbook Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Description</th><th style={styles.th}>Amount</th></tr></thead>
                    <tbody>
                      {filteredCashbook.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={styles.td}>{c.trans_date}</td><td style={styles.td}>{c.type}</td><td style={styles.td}>{c.description}</td>
                          <td style={{...styles.td, color: c.type.includes('In') ? 'green' : 'red'}}>{c.type.includes('In') ? '+' : '-'}{c.amount} SAR</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reportTab === 'commission' && (
                <div>
                  <h3>Employee Commission Report</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Employee</th><th style={styles.th}>Sales Count</th><th style={styles.th}>Total Profit</th><th style={styles.th}>Commission %</th><th style={styles.th}>Commission Earned</th></tr></thead>
                    <tbody>
                      {data.employees.map(e => {
                        const empSales = activeInv.filter(i => i.employee_id === e.id);
                        const empProfit = empSales.reduce((s,i) => s + i.profit, 0);
                        const comm = (empProfit * (e.commission_pct || 0)) / 100;
                        return (
                          <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={styles.td}>{e.name}</td><td style={styles.td}>{empSales.length}</td>
                            <td style={{...styles.td, color:'green'}}>{empProfit.toFixed(0)} SAR</td>
                            <td style={styles.td}>{e.commission_pct || 0}%</td>
                            <td style={{...styles.td, color:'#8e44ad', fontWeight:'bold'}}>{comm.toFixed(0)} SAR</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {reportTab === 'customer' && (
                <div>
                  <h3>Customer & Company Report</h3>
                  <button onClick={() => exportCSV(Object.entries(customerReport).map(([name, val]) => ({ Name: name, Type: val.type, Tickets: val.count, TotalSales: val.total, Profit: val.profit })), 'Customer_Report.csv')} style={{...styles.btn, background: '#8e44ad', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Customer Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Customer Name</th><th style={styles.th}>Type</th><th style={styles.th}>Tickets Count</th><th style={styles.th}>Total Sales</th><th style={styles.th}>Profit Generated</th></tr></thead>
                    <tbody>
                      {Object.entries(customerReport).map(([name, val]) => (
                        <tr key={name} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={styles.td}>{name}</td><td style={styles.td}>{val.type}</td>
                          <td style={styles.td}>{val.count}</td>
                          <td style={{...styles.td, color:'blue'}}>{val.total.toFixed(0)} SAR</td>
                          <td style={{...styles.td, color:'green'}}>{val.profit.toFixed(0)} SAR</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reportTab === 'invest' && (
                <div>
                  <h3>Sponsor Investment Report</h3>
                  <button onClick={() => exportCSV(filteredInvestments.map(i => ({ Date: i.invest_date, Sponsor: i.investor_name, Amount: i.amount, Desc: i.description })), 'Investment_Report.csv')} style={{...styles.btn, background: '#8e44ad', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Investment Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Sponsor Name</th><th style={styles.th}>Amount</th><th style={styles.th}>Description</th></tr></thead>
                    <tbody>
                      {filteredInvestments.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={styles.td}>{inv.invest_date}</td><td style={styles.td}>{inv.investor_name}</td>
                          <td style={{...styles.td, color:'green'}}>{inv.amount} SAR</td>
                          <td style={styles.td}>{inv.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {page === 'settings' && <SettingsPage data={data.settings} fetchAll={fetchAll} services={data.services} handleDelete={handleDelete} handleAddEntity={handleAddEntity} exportCSV={exportCSV} />}
        </div>
      </main>

      {showOverduePopup && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#e74c3c', color: 'white', padding: '20px 30px', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', zIndex: 2000, display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <h3 style={{margin:0}}>⚠️ Overdue Payments Alert!</h3>
            <p style={{margin:'5px 0 0'}}>You have {overdueInv.length} overdue credit invoices. Total Due: {overdueInv.reduce((s,i)=>s+i.due_amount,0).toFixed(0)} SAR.</p>
          </div>
          <button onClick={() => setShowOverduePopup(false)} style={{ background: 'white', color: '#e74c3c', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Dismiss</button>
        </div>
      )}

      {previewInv && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Invoice Preview</h2>
              <button onClick={() => setPreviewInv(null)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>X</button>
            </div>
            <div style={{ border: '1px solid #eee', padding: '20px' }}>
              <div style={{display:'flex', justifyContent:'space-between', borderBottom:'2px solid #D4AF37', paddingBottom:'10px'}}>
                <div>
                  {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'60px'}} />}
                  <h2 style={{margin:0, color:'#0F3D2E'}}>Sueud Al Taayira</h2>
                  <h3 style={{margin:0, color:'#0F3D2E'}}>صعود الطائرة للسفر والسياحة</h3>
                </div>
                <div style={{textAlign:'right'}}>
                  <h2 style={{margin:0, color:'#0F3D2E'}}>TAX INVOICE</h2>
                  <h3 style={{margin:0, color:'#D4AF37'}}>فاتورة ضريبية</h3>
                  <p>Invoice No / رقم الفاتورة: {previewInv.invoice_no}<br/>Date / التاريخ: {previewInv.invoice_date}</p>
                </div>
              </div>
              <p><b>Customer / العميل:</b> {previewInv.customers?.name} ({previewInv.customers?.type})</p>
              {previewInv.passenger_names && <p style={{whiteSpace: 'pre-wrap'}}><b>Passengers / المسافرون:</b><br/>{previewInv.passenger_names}</p>}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
                <tr style={{ background: '#0F3D2E', color: 'white' }}>
                  <th style={styles.th}>Service / الخدمة</th><th style={styles.th}>Flight Type / نوع الرحلة</th><th style={styles.th}>Journey / الرحلة</th><th style={styles.th}>Airline / شركة الطيران</th><th style={styles.th}>Sector / القطاع</th><th style={styles.th}>Qty / الكمية</th><th style={styles.th}>Amount / المبلغ</th>
                </tr>
                <tr>
                  <td style={styles.td}>{previewInv.service_type}</td><td style={styles.td}>{previewInv.flight_type || 'N/A'}</td><td style={styles.td}>{previewInv.flight_journey || 'N/A'}</td><td style={styles.td}>{previewInv.airline || 'N/A'}</td><td style={styles.td}>{previewInv.flight_sector || 'N/A'}</td><td style={styles.td}>{previewInv.qty || 1}</td><td style={styles.td}>{previewInv.total_sell} SAR</td>
                </tr>
              </table>
              <div style={{marginTop:'20px', textAlign:'right'}}>
                <p>Total Before VAT / الإجمالي قبل الضريبة: {previewInv.total_sell} SAR</p>
                {previewInv.discount > 0 && <p style={{color:'#e74c3c'}}>Discount / خصم: - {previewInv.discount} SAR</p>}
                <p>VAT / الضريبة: {previewInv.vat} SAR</p>
                <h3>Total After VAT / الإجمالي بعد الضريبة: {previewInv.total} SAR</h3>
                <p style={{color:'green'}}>Paid / مدفوع: {previewInv.paid_amount} SAR</p>
                <p style={{color:'red'}}>Due Amount / المبلغ المتبقي: {previewInv.due_amount} SAR</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => downloadPDF(previewInv)} style={{ padding: '15px', background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight:'bold' }}>Download PDF</button>
              <button onClick={() => shareWhatsApp(previewInv)} style={{ padding: '15px', background: '#25D366', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight:'bold' }}>WhatsApp</button>
              <button onClick={() => setPreviewInv(null)} style={{ padding: '15px', background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight:'bold' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage({ data, fetchAll, services, handleDelete, handleAddEntity, exportCSV }) {
  const [form, setForm] = useState(data);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await supabase.from('settings').update(form).eq('id', 1);
    alert('Settings Saved!');
    fetchAll();
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `logo_${Date.now()}.png`;
    const { error } = await supabase.storage.from('logos').upload(fileName, file);
    if (error) { alert('Error: ' + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
    setForm({ ...form, logo_url: urlData.publicUrl });
    setUploading(false);
  };

  return (
    <div style={{ display: 'grid', gap: '30px' }}>
      <form onSubmit={handleSave} style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <input placeholder="Company Name (EN)" value="Sueud Al Taayira" readOnly style={styles.i} />
        <input placeholder="Company Name (AR)" value="صعود الطائرة للسفر والسياحة" readOnly style={styles.i} />
        <input placeholder="VAT Number (الرقم الضريبي)" value={form.vat_no || ''} onChange={(e) => setForm({...form, vat_no: e.target.value})} style={styles.i} />
        <input placeholder="CR Number (السجل التجاري)" value={form.cr_no || ''} onChange={(e) => setForm({...form, cr_no: e.target.value})} style={styles.i} />
        <input placeholder="License No (رقم الترخيص)" value={form.license_no || ''} onChange={(e) => setForm({...form, license_no: e.target.value})} style={styles.i} />
        <input placeholder="Tourist License No (رقم ترخيص السياحي)" value={form.tourist_license_no || ''} onChange={(e) => setForm({...form, tourist_license_no: e.target.value})} style={styles.i} />
        <input placeholder="Phone (هاتف)" value={form.phone || ''} onChange={(e) => setForm({...form, phone: e.target.value})} style={styles.i} />
        <input placeholder="Address (موقع)" value={form.address || ''} onChange={(e) => setForm({...form, address: e.target.value})} style={styles.i} />
        
        <div style={{ gridColumn: 'span 2', border: '1px solid #D4AF37', padding: '15px', borderRadius: '8px' }}>
          <label><b>Upload Logo:</b></label><br/>
          {form.logo_url && <img src={form.logo_url} style={{height:'60px', marginTop:'10px', marginBottom:'10px'}} />}
          <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ marginTop: '10px' }} />
          {uploading && <p>Uploading...</p>}
        </div>
        <button type="submit" style={{ gridColumn: 'span 2', padding: '15px', background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>SAVE SETTINGS</button>
      </form>

      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #0F3D2E' }}>
        <h3 style={{color: '#0F3D2E', marginTop: 0}}>Manage Services (Add/Delete)</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('services', { name: e.target.name.value }, 'Service'); e.target.reset(); }} style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
          <input name="name" placeholder="New Service Name (e.g. Railway Ticket, Insurance)" style={styles.i} required />
          <button type="submit" style={{...styles.btn, width: 'auto', padding: '10px 20px'}}>Add Service</button>
        </form>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {services.map(s => (
            <div key={s.id} style={{ background: '#f8f9fa', padding: '5px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {s.name}
              <button onClick={() => handleDelete('services', s.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#0F3D2E', marginBottom: '5px', display: 'block' },
  i: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#0F3D2E', color: '#D4AF37', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' },
  btnSm: { background: '#0F3D2E', color: '#D4AF37', border: 'none', padding: '8px 15px', cursor: 'pointer', marginRight: '5px', borderRadius: '4px' },
  btnSmInactive: { background: '#eee', color: '#333', border: 'none', padding: '8px 15px', cursor: 'pointer', marginRight: '5px', borderRadius: '4px' },
  th: { padding: '10px', textAlign: 'left', fontSize: '14px', border: '1px solid #ccc' },
  td: { padding: '10px', fontSize: '14px', border: '1px solid #ccc' }
};
