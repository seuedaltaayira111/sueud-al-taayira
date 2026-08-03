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
  const router = useRouter();

  const [data, setData] = useState({ invoices: [], portals: [], customers: [], recharges: [], settings: {}, employees: [], payroll: [], appUsers: [], expenses: [], services: [], cashbook: [], audits: [], investments: [] });
  const today = new Date().toISOString().split('T')[0];
  
  const [invForm, setInvForm] = useState({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', passengerNames: '', employeeId: '', portal: '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', flightSub: 'New Booking', flightJourney: 'Single', flightSector: '', airline: '', destination: '', hotelName: '', visaType: 'Tourist', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed' });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, desc: '', mode: 'Cash' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash', tabbyNo: '', tamaraNo: '' });
  const [refundForm, setRefundForm] = useState({ id: '', compRefund: 0, custRefund: 0, mode: 'Cash' });
  const [cashForm, setCashForm] = useState({ date: today, type: 'Cash-In', desc: '', amount: '' });
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
        const { data: nC } = await supabase.from('customers').insert([{ name: invForm.custName, phone: invForm.custPhone, type: invForm.custType }]).select().single();
        cid = nC.id;
      } else { cid = invForm.custId; }

      const pArr = data.portals.filter(p => p.name === invForm.portal);
      const portal = pArr[0];
      if (!portal) throw new Error("Select Portal");

      let desc = '';
      if (invForm.service === 'Flight') desc = `${invForm.flightSub} (${invForm.flightType}) - ${invForm.airline} - ${invForm.flightJourney} - ${invForm.flightSector}`;
      else desc = invForm.service;

      const payload = {
        customer_id: cid, portal_id: portal.id, employee_id: invForm.employeeId || null,
        booking_date: invForm.bookingDate, invoice_date: invForm.invoiceDate,
        service_type: invForm.service, flight_type: invForm.flightType, flight_sub: invForm.flightSub, pnr: invForm.pnr, ticket_no: invForm.ticketNo, sector: desc, qty: qty, discount: discount,
        passenger_names: invForm.passengerNames || null, airline: invForm.airline || null, flight_journey: invForm.flightJourney || null, flight_sector: invForm.flightSector || null,
        total_cost: cost, total_sell: sell, profit, vat, total, paid_amount: paid, due_amount: due, payment_method: invForm.payment,
        credit_due_date: due > 0 ? invForm.creditDueDate : null, tabby_order_no: invForm.payment === 'Tabby' ? invForm.tabbyNo : null, tamara_order_no: invForm.payment === 'Tamara' ? invForm.tamaraNo : null, ticket_status: invForm.ticketStatus
      };

      if (editingId) {
        const { data: upInv } = await supabase.from('invoices').update(payload).eq('id', editingId).select(`*, customers(name, type), portals(name), employees(name)`).single();
        setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === editingId ? upInv : i) }));
        await logAction(`Updated Invoice ID ${editingId}`);
        setEditingId(null);
        alert('Invoice Updated!');
      } else {
        const invNo = `INV-${Date.now()}`;
        const { data: newInv } = await supabase.from('invoices').insert([{ invoice_no: invNo, ...payload }]).select(`*, customers(name, type), portals(name), employees(name)`).single();
        
        const newPortalBal = (portal.current_balance || 0) - cost;
        await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', portal.id);
        await logAction(`Created Invoice ${invNo}`);

        let newCashEntry = null;
        if (paid > 0) {
          const cbType = invForm.payment === 'Cash' ? 'Cash-In' : (invForm.payment === 'Bank Transfer' ? 'Bank-In' : null);
          if (cbType) {
            const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: invForm.invoiceDate, type: cbType, description: `Payment for ${invNo}`, amount: paid }]).select().single();
            newCashEntry = nC;
          }
        }

        setData(prev => ({
          ...prev,
          invoices: [newInv, ...prev.invoices],
          portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: newPortalBal } : p),
          cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook
        }));
        alert('Invoice Generated!');
      }
      
      setInvForm({ custId: 'new', custName: '', custPhone: '', custType: 'Individual', passengerNames: '', employeeId: '', portal: data.portals[0]?.name || '', bookingDate: today, invoiceDate: today, service: 'Flight', flightType: 'Domestic', flightSub: 'New Booking', flightJourney: 'Single', flightSector: '', airline: '', destination: '', hotelName: '', visaType: 'Tourist', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed' });
      setPage('list');
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleEditClick = (inv) => {
    setEditingId(inv.id);
    setInvForm({
      custId: inv.customer_id, custName: '', custPhone: '', custType: inv.customers?.type || 'Individual', passengerNames: inv.passenger_names || '',
      employeeId: inv.employee_id || '', portal: inv.portals?.name || '', bookingDate: inv.booking_date || today, invoiceDate: inv.invoice_date || today,
      service: inv.service_type, flightType: inv.flight_type || 'Domestic', flightSub: inv.flight_sub || 'New Booking', flightJourney: inv.flight_journey || 'Single', flightSector: inv.flight_sector || '', airline: inv.airline || '', 
      destination: '', hotelName: '', visaType: 'Tourist', pnr: inv.pnr || '', ticketNo: inv.ticket_no || '', qty: inv.qty || 1, cost: inv.total_cost || 0, sell: inv.total_sell || 0, discount: inv.discount || 0, taxRate: inv.vat > 0 ? '15' : '0', 
      payment: inv.payment_method || 'Cash', paid: inv.paid_amount || 0, creditDueDate: inv.credit_due_date || '', tabbyNo: inv.tabby_order_no || '', tamaraNo: inv.tamara_order_no || '', ticketStatus: inv.ticket_status || 'Confirmed'
    });
    setPage('create');
  };

  const handleSettlePayment = async (e) => {
    e.preventDefault();
    const invArr = data.invoices.filter(i => i.id === settleForm.id);
    if (invArr.length === 0) return alert('Not found');
    const inv = invArr[0];
    const newPaid = inv.paid_amount + inv.due_amount;
    
    const { data: upInv } = await supabase.from('invoices').update({ 
      paid_amount: newPaid, due_amount: 0, settlement_date: settleForm.date, payment_method: settleForm.mode,
      tabby_order_no: settleForm.mode === 'Tabby' ? settleForm.tabbyNo : null, tamara_order_no: settleForm.mode === 'Tamara' ? settleForm.tamaraNo : null
    }).eq('id', inv.id).select(`*, customers(name, type), portals(name), employees(name)`).single();
    
    let newCashEntry = null;
    const cbType = settleForm.mode === 'Cash' ? 'Cash-In' : (settleForm.mode === 'Bank Transfer' ? 'Bank-In' : null);
    if (cbType) {
      const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: settleForm.date, type: cbType, description: `Settlement for ${inv.invoice_no}`, amount: inv.due_amount }]).select().single();
      newCashEntry = nC;
    }
    await logAction(`Settled payment for ${inv.invoice_no}`);

    setData(prev => ({
      ...prev,
      invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i),
      cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook
    }));
    alert('Payment Settled!');
    setSettleForm({ id: '', date: today, mode: 'Cash', tabbyNo: '', tamaraNo: '' });
  };

  // INTERLINKED REFUND: Portal balance auto-add & Cash/Bank deduct
  const handleRefund = async (e) => {
    e.preventDefault();
    const invArr = data.invoices.filter(i => i.id === refundForm.id);
    if (invArr.length === 0) return alert('Not found');
    const inv = invArr[0];
    const compRef = parseFloat(refundForm.compRefund) || 0;
    const custRef = parseFloat(refundForm.custRefund) || 0;

    const { data: upInv } = await supabase.from('invoices').update({ status: 'refunded', refund_company: compRef, refund_customer: custRef }).eq('id', inv.id).select(`*, customers(name, type), portals(name), employees(name)`).single();
    const refNo = `REF-${Date.now()}`;
    const { data: newRefInv } = await supabase.from('invoices').insert([{
      invoice_no: refNo, customer_id: inv.customer_id, portal_id: inv.portal_id, booking_date: today, invoice_date: today,
      service_type: `Refund for ${inv.invoice_no}`, total_sell: -custRef, total: -custRef, paid_amount: -custRef, status: 'refunded', refund_company: compRef, refund_customer: custRef
    }]).select(`*, customers(name, type), portals(name), employees(name)`).single();

    let newPortalBal = inv.portals?.current_balance || 0;
    if (inv.portal_id) {
      newPortalBal += compRef;
      await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', inv.portal_id);
    }

    let newCashEntry = null;
    if (custRef > 0) {
      const cbType = refundForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
      const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Refund to customer for ${inv.invoice_no}`, amount: custRef }]).select().single();
      newCashEntry = nC;
    }
    await logAction(`Processed refund ${refNo}`);

    setData(prev => ({
      ...prev,
      invoices: [newRefInv, prev.invoices.map(i => i.id === inv.id ? upInv : i)].flat(),
      portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: newPortalBal } : p),
      cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook
    }));
    alert('Refund Processed! Portal balance updated.');
    setRefundForm({ id: '', compRefund: 0, custRefund: 0, mode: 'Cash' });
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    const p = data.portals.find(p => p.name === e.target.portal.value);
    const amount = parseFloat(e.target.amt.value);
    const mode = e.target.mode.value;
    
    const { data: newRec } = await supabase.from('recharges').insert([{ portal_id: p.id, amount, recharge_date: e.target.date.value, description: e.target.desc.value, payment_mode: mode }]).select('*, portals(name)').single();
    const newBal = (p.current_balance || 0) + amount;
    await supabase.from('portals').update({ current_balance: newBal }).eq('id', p.id);
    
    const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: e.target.date.value, type: cbType, description: `Recharge for ${p.name}`, amount }]).select().single();
    await logAction(`Recharged ${amount} to ${p.name}`);

    setData(prev => ({
      ...prev,
      recharges: [newRec, ...prev.recharges],
      portals: prev.portals.map(por => por.id === p.id ? { ...por, current_balance: newBal } : por),
      cashbook: [nC, ...prev.cashbook]
    }));
    alert('Recharged! Balance Updated.');
    e.target.reset();
  };

  const handleDeleteRecharge = async (rec) => {
    if (!confirm('Delete recharge? Balance will reduce.')) return;
    await supabase.from('recharges').delete().eq('id', rec.id);
    const p = data.portals.find(p => p.id === rec.portal_id);
    const newBal = (p.current_balance || 0) - rec.amount;
    await supabase.from('portals').update({ current_balance: newBal }).eq('id', p.id);

    const cbEntry = data.cashbook.find(c => c.description === `Recharge for ${p.name}` && c.amount === rec.amount);
    if (cbEntry) await supabase.from('cashbook').delete().eq('id', cbEntry.id);

    setData(prev => ({
      ...prev,
      recharges: prev.recharges.filter(r => r.id !== rec.id),
      portals: prev.portals.map(por => por.id === rec.portal_id ? { ...por, current_balance: newBal } : por),
      cashbook: cbEntry ? prev.cashbook.filter(c => c.id !== cbEntry.id) : prev.cashbook
    }));
    alert('Deleted!');
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    const mode = investForm.mode;
    const { data: newInv } = await supabase.from('investments').insert([{ investor_name: investForm.name, amount: parseFloat(investForm.amount), invest_date: investForm.date, description: investForm.desc, payment_mode: mode }]).select().single();
    const cbType = mode === 'Cash' ? 'Cash-In' : 'Bank-In';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: investForm.date, type: cbType, description: `Investment by ${investForm.name}`, amount: parseFloat(investForm.amount) }]).select().single();
    await logAction(`Added investment from ${investForm.name}`);

    setData(prev => ({
      ...prev,
      investments: [newInv, ...prev.investments],
      cashbook: [nC, ...prev.cashbook]
    }));
    alert('Investment Added!');
    setInvestForm({ name: '', amount: '', date: today, desc: '', mode: 'Cash' });
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Delete permanently?')) return;
    await supabase.from(table).delete().eq('id', id);
    setData(prev => ({ ...prev, [table]: prev[table].filter(item => item.id !== id) })); // INSTANT UI UPDATE
  };

  const handleAddEntity = async (table, payload, msg) => {
    const { data: newItem, error } = await supabase.from(table).insert([payload]).select().single();
    if (error) return alert('Error: ' + error.message);
    setData(prev => ({ ...prev, [table]: [newItem, ...prev[table]] })); // INSTANT UI UPDATE
  };

  const handlePaySalary = async (e) => {
    e.preventDefault();
    const empId = e.target.emp.value;
    const amount = parseFloat(e.target.amt.value);
    const mode = e.target.mode.value;
    const emp = data.employees.find(em => em.id === empId);
    
    const { data: newPay } = await supabase.from('payroll').insert([{ employee_id: empId, amount, month: e.target.month.value, payment_mode: mode }]).select('*, employees(name)').single();
    const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Salary to ${emp.name}`, amount }]).select().single();
    
    setData(prev => ({
      ...prev,
      payroll: [newPay, ...prev.payroll],
      cashbook: [nC, ...prev.cashbook]
    }));
    alert('Salary Paid!');
    e.target.reset();
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const mode = e.target.mode.value;
    const { data: newExp } = await supabase.from('expenses').insert([{ category: e.target.cat.value, amount: parseFloat(e.target.amt.value), description: e.target.desc.value, payment_mode: mode }]).select().single();
    const cbType = mode === 'Cash' ? 'Cash-Out' : (mode === 'Bank Transfer' ? 'Bank-Out' : 'Investment-Out');
    const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Expense: ${e.target.cat.value}`, amount: parseFloat(e.target.amt.value) }]).select().single();
    
    setData(prev => ({
      ...prev,
      expenses: [newExp, ...prev.expenses],
      cashbook: [nC, ...prev.cashbook]
    }));
    alert('Expense Added!');
    e.target.reset();
  };

  const handleAddCash = async (e) => {
    e.preventDefault();
    const { data: newCash } = await supabase.from('cashbook').insert([{ trans_date: cashForm.date, type: cashForm.type, description: cashForm.desc, amount: parseFloat(cashForm.amount) }]).select().single();
    setData(prev => ({ ...prev, cashbook: [newCash, ...prev.cashbook] }));
    alert('Transaction Added!');
    setCashForm({ date: today, type: 'Cash-In', desc: '', amount: '' });
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
            <p style="font-size:12px;margin-top:10px;line-height:1.5;">VAT / الرقم الضريبي: ${s.vat_no || ''}<br/>CR / السجل التجاري: ${s.cr_no || ''}<br/>Phone / هاتف: ${s.phone || ''}</p>
          </div>
          <div style="text-align:right;">
            <h1 style="color:#0F3D2E;margin:0;font-size:28px;">TAX INVOICE</h1>
            <h2 style="color:#D4AF37;margin:0;font-size:22px;">فاتورة ضريبية</h2>
            <p style="font-size:14px;margin-top:10px;">Invoice No: ${inv.invoice_no}<br/>Date: ${inv.invoice_date}</p>
          </div>
        </div>
        <div style="margin-bottom:20px;border:1px solid #eee;padding:15px;background:#f9f9f9;border-radius:8px;">
          <table style="width:100%;font-size:12px;">
            <tr><td><b>Customer:</b> ${inv.customers?.name || ''}</td><td><b>Phone:</b> ${inv.customers?.phone || ''}</td><td><b>Sales Rep:</b> ${inv.employees?.name || 'N/A'}</td></tr>
          </table>
          ${inv.passenger_names ? `<div style="margin-top:10px;font-size:12px;"><b>Passengers:</b><br/><span style="white-space:pre-wrap;">${inv.passenger_names}</span></div>` : ''}
        </div>
        <table style="width:100%;border-collapse:collapse;text-align:center;font-size:12px;margin-bottom:20px;">
          <thead><tr style="background:#0F3D2E;color:#fff;">
            <th style="padding:8px;border:1px solid #ddd;">Service</th><th style="padding:8px;border:1px solid #ddd;">Flight Type</th><th style="padding:8px;border:1px solid #ddd;">Journey</th><th style="padding:8px;border:1px solid #ddd;">Airline</th><th style="padding:8px;border:1px solid #ddd;">Sector</th><th style="padding:8px;border:1px solid #ddd;">PNR</th><th style="padding:8px;border:1px solid #ddd;">Ticket No</th><th style="padding:8px;border:1px solid #ddd;">Qty</th><th style="padding:8px;border:1px solid #ddd;">Amount</th>
          </tr></thead>
          <tbody><tr>
            <td style="padding:8px;border:1px solid #ddd;">${inv.service_type}</td><td style="padding:8px;border:1px solid #ddd;">${inv.flight_type || 'N/A'}</td><td style="padding:8px;border:1px solid #ddd;">${inv.flight_journey || 'N/A'}</td><td style="padding:8px;border:1px solid #ddd;">${inv.airline || 'N/A'}</td><td style="padding:8px;border:1px solid #ddd;">${inv.flight_sector || 'N/A'}</td><td style="padding:8px;border:1px solid #ddd;">${inv.pnr || 'N/A'}</td><td style="padding:8px;border:1px solid #ddd;">${inv.ticket_no || 'N/A'}</td><td style="padding:8px;border:1px solid #ddd;">${inv.qty || 1}</td><td style="padding:8px;border:1px solid #ddd;">${inv.total_sell.toFixed(2)} SAR</td>
          </tr></tbody>
        </table>
        <div style="display:flex;justify-content:space-between;margin-top:30px;">
          <div style="text-align:center;"><img src="${qr}" width="120" height="120" /></div>
          <div style="text-align:right;width:300px;font-size:14px;">
            <p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;"><span>Before VAT:</span><b>${inv.total_sell.toFixed(2)} SAR</b></p>
            ${inv.discount > 0 ? `<p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;color:#e74c3c;"><span>Discount:</span><b>- ${inv.discount.toFixed(2)} SAR</b></p>` : ''}
            <p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;"><span>${taxLabel}:</span><b>${inv.vat.toFixed(2)} SAR</b></p>
            <p style="display:flex;justify-content:space-between;background:#f0f0f0;padding:10px;font-weight:bold;font-size:16px;border:1px solid #ddd;"><span>Total:</span><b>${inv.total.toFixed(2)} SAR</b></p>
            <p style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px 0;color:#27ae60;"><span>Paid (${inv.payment_method}):</span><b>${inv.paid_amount.toFixed(2)} SAR</b></p>
            <p style="display:flex;justify-content:space-between;padding:5px 0;color:#e74c3c;font-weight:bold;font-size:16px;"><span>Due:</span><b>${inv.due_amount.toFixed(2)} SAR</b></p>
          </div>
        </div>
      `;
      document.body.appendChild(html);
      const canvas = await html2canvas(html, { useCORS: true, allowTaint: true });
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
      doc.save(`${inv.invoice_no}.pdf`);
      document.body.removeChild(html);
    } catch (err) { alert('PDF Error: ' + err.message); }
  };

  if (!user) return <div style={{ padding: 50, textAlign: 'center' }}>Loading ERP...</div>;

  const activeInv = data.invoices.filter(i => !i.invoice_no.startsWith('REF-'));
  const refundInv = data.invoices.filter(i => i.invoice_no.startsWith('REF-'));
  const outstandingInv = activeInv.filter(i => i.due_amount > 0);
  
  const cashIn = data.cashbook.filter(c => c.type === 'Cash-In').reduce((s,c) => s + c.amount, 0);
  const cashOut = data.cashbook.filter(c => c.type === 'Cash-Out').reduce((s,c) => s + c.amount, 0);
  const bankIn = data.cashbook.filter(c => c.type === 'Bank-In').reduce((s,c) => s + c.amount, 0);
  const bankOut = data.cashbook.filter(c => c.type === 'Bank-Out').reduce((s,c) => s + c.amount, 0);
  const cashBalance = cashIn - cashOut;
  const bankBalance = bankIn - bankOut;

  const tSales = activeInv.reduce((s,i) => s + i.total, 0);
  const tProfit = activeInv.reduce((s,i) => s + i.profit, 0);
  const tExp = data.expenses.reduce((s,e) => s + e.amount, 0);
  const tSal = data.payroll.reduce((s,p) => s + p.amount, 0);
  const netProfit = tProfit - tExp - tSal;
  const totalOutstanding = outstandingInv.reduce((s,i) => s + i.due_amount, 0);
  const tInvestments = data.investments.reduce((s,i) => s + i.amount, 0);

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

  const menu = [
    { id: 'dashboard', label: tr.dash }, { id: 'create', label: tr.create }, { id: 'list', label: tr.list },
    { id: 'refunds', label: tr.refunds }, { id: 'customers', label: tr.customers }, { id: 'portals', label: tr.portals },
    { id: 'invest', label: tr.invest }, { id: 'hr', label: tr.hr }, { id: 'users', label: tr.users },
    { id: 'reports', label: tr.reports }, { id: 'audit', label: tr.audit }, { id: 'settings', label: tr.settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#F5F7F2', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <aside style={{ width: '260px', backgroundColor: '#0F3D2E', color: '#D4AF37', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '2px solid #D4AF37' }}>
          {data.settings.logo_url && <img src={data.settings.logo_url} style={{height:'40px', marginBottom:'10px'}} />}
          <h2 style={{ margin: 0 }}>{lang === 'en' ? 'Sueud Al Taayira' : 'صعود الطائرة'}</h2>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {menu.map(m => (
            <button key={m.id} onClick={() => setPage(m.id)} style={{ width: '100%', textAlign: 'left', padding: '15px 20px', background: page === m.id ? '#D4AF37' : 'none', border: 'none', color: page === m.id ? '#0F3D2E' : '#D4AF37', cursor: 'pointer', fontWeight: 'bold' }}>{m.label}</button>
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
                  <div><label style={styles.label}>Select Customer</label><select value={invForm.custId} onChange={(e) => setInvForm({...invForm, custId: e.target.value})} style={styles.i} disabled={editingId}><option value="new">+ New Customer</option>{data.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}</select></div>
                  {invForm.custId === 'new' && <>
                    <div><label style={styles.label}>Name</label><input placeholder="Enter Name" value={invForm.custName} onChange={(e) => setInvForm({...invForm, custName: e.target.value})} required style={styles.i} /></div>
                    <div><label style={styles.label}>Phone</label><input placeholder="Enter Phone" value={invForm.custPhone} onChange={(e) => setInvForm({...invForm, custPhone: e.target.value})} required style={styles.i} /></div>
                    <div><label style={styles.label}>Type</label><select value={invForm.custType} onChange={(e) => setInvForm({...invForm, custType: e.target.value})} style={styles.i}><option>Individual</option><option>Group</option><option>Company</option></select></div>
                  </>}
                </div>
                {invForm.custType === 'Group' || invForm.custType === 'Company' ? (
                  <div style={{ marginBottom: '20px' }}><label style={styles.label}>Passenger Names</label><textarea placeholder="One per line" value={invForm.passengerNames} onChange={(e) => setInvForm({...invForm, passengerNames: e.target.value})} style={{...styles.i, height: '80px'}} /></div>
                ) : null}

                <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Service Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div><label style={styles.label}>Service</label><select value={invForm.service} onChange={(e) => setInvForm({...invForm, service: e.target.value})} style={styles.i}>{data.services.map(s => <option key={s.id}>{s.name}</option>)}</select></div>
                  {invForm.service === 'Flight' && <>
                    <div><label style={styles.label}>Flight Type</label><select value={invForm.flightType} onChange={(e) => setInvForm({...invForm, flightType: e.target.value})} style={styles.i}><option>Domestic</option><option>International</option></select></div>
                    <div><label style={styles.label}>Booking Type</label><select value={invForm.flightSub} onChange={(e) => setInvForm({...invForm, flightSub: e.target.value})} style={styles.i}><option>New Booking</option><option>Reissue</option><option>Extra Baggage</option></select></div>
                    <div><label style={styles.label}>Journey</label><select value={invForm.flightJourney} onChange={(e) => setInvForm({...invForm, flightJourney: e.target.value})} style={styles.i}><option>Single</option><option>Roundtrip</option></select></div>
                    <div><label style={styles.label}>Airline</label><input placeholder="Flynas" value={invForm.airline} onChange={(e) => setInvForm({...invForm, airline: e.target.value})} style={styles.i} required /></div>
                    <div><label style={styles.label}>Sector</label><input placeholder="JED - RUH" value={invForm.flightSector} onChange={(e) => setInvForm({...invForm, flightSector: e.target.value})} style={styles.i} required /></div>
                    <div><label style={styles.label}>PNR</label><input placeholder="PNR" value={invForm.pnr} onChange={(e) => setInvForm({...invForm, pnr: e.target.value})} style={styles.i} required /></div>
                    <div><label style={styles.label}>Ticket No</label><input placeholder="Ticket No" value={invForm.ticketNo} onChange={(e) => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.i} /></div>
                  </>}
                </div>

                <h3 style={{color: '#0F3D2E', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Pricing & Payment</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div><label style={styles.label}>Sales Rep</label><select value={invForm.employeeId} onChange={(e) => setInvForm({...invForm, employeeId: e.target.value})} style={styles.i}><option value="">Select</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
                  <div><label style={styles.label}>Portal</label><select value={invForm.portal} onChange={(e) => setInvForm({...invForm, portal: e.target.value})} style={styles.i} required><option value="">Select</option>{data.portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                  <div><label style={styles.label}>Qty</label><input type="number" value={invForm.qty} onChange={(e) => setInvForm({...invForm, qty: e.target.value})} style={styles.i} required /></div>
                  <div><label style={styles.label}>Cost Price</label><input type="number" value={invForm.cost} onChange={(e) => setInvForm({...invForm, cost: e.target.value})} style={styles.i} required /></div>
                  <div><label style={styles.label}>Sell Price</label><input type="number" value={invForm.sell} onChange={(e) => setInvForm({...invForm, sell: e.target.value})} style={styles.i} required /></div>
                  <div><label style={styles.label}>Discount</label><input type="number" value={invForm.discount} onChange={(e) => setInvForm({...invForm, discount: e.target.value})} style={styles.i} /></div>
                  <div><label style={styles.label}>Tax</label><select value={invForm.taxRate} onChange={(e) => setInvForm({...invForm, taxRate: e.target.value})} style={styles.i}><option value="15">15%</option><option value="0">0%</option></select></div>
                  <div><label style={styles.label}>Payment</label><select value={invForm.payment} onChange={(e) => setInvForm({...invForm, payment: e.target.value})} style={styles.i}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option></select></div>
                  <div><label style={styles.label}>Booking Date</label><input type="date" value={invForm.bookingDate} onChange={(e) => setInvForm({...invForm, bookingDate: e.target.value})} style={styles.i} required /></div>
                  <div><label style={styles.label}>Invoice Date</label><input type="date" value={invForm.invoiceDate} onChange={(e) => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.i} required /></div>
                  <div><label style={styles.label}>Paid Amount</label><input type="number" value={invForm.paid} onChange={(e) => setInvForm({...invForm, paid: e.target.value})} style={styles.i} required /></div>
                </div>
                <button type="submit" style={{ background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', padding: '15px', width: '100%' }}>{editingId ? 'Update' : 'Generate'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setPage('list'); }} style={{ background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '15px', width: '100%', marginTop: '10px' }}>Cancel</button>}
              </form>
            </div>
          )}

          {page === 'list' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.th}>Inv No</th><th style={styles.th}>Customer</th><th style={styles.th}>Qty</th><th style={styles.th}>Profit</th><th style={styles.th}>Total</th><th style={styles.th}>Actions</th></tr></thead>
                <tbody>
                  {activeInv.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee', backgroundColor: inv.due_amount > 0 ? '#fff3cd' : 'transparent' }}>
                      <td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.customers?.name || 'N/A'}</td>
                      <td style={styles.td}>{inv.qty || 1}</td><td style={{...styles.td, color:'green'}}>{inv.profit} SAR</td><td style={styles.td}>{inv.total} SAR</td>
                      <td style={styles.td}>
                        <button onClick={() => setPreviewInv(inv)} style={styles.btnSm}>Preview</button>
                        <button onClick={() => handleEditClick(inv)} style={{...styles.btnSm, background:'#2980b9'}}>Edit</button>
                        {inv.due_amount > 0 && <button onClick={() => setSettleForm({id: inv.id, date: today, mode: 'Cash', tabbyNo: '', tamaraNo: ''})} style={{...styles.btnSm, background:'#27ae60'}}>Settle</button>}
                        <button onClick={() => setRefundForm({id: inv.id, compRefund: 0, custRefund: 0, mode: 'Cash'})} style={{...styles.btnSm, background:'#e67e22'}}>Refund</button>
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
                    <select value={settleForm.mode} onChange={(e) => setSettleForm({...settleForm, mode: e.target.value})} style={styles.i}><option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option></select>
                    {settleForm.mode === 'Tabby' && <input placeholder="Tabby Order No." value={settleForm.tabbyNo} onChange={(e) => setSettleForm({...settleForm, tabbyNo: e.target.value})} required style={styles.i} />}
                    {settleForm.mode === 'Tamara' && <input placeholder="Tamara Order No." value={settleForm.tamaraNo} onChange={(e) => setSettleForm({...settleForm, tamaraNo: e.target.value})} required style={styles.i} />}
                    <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer' }}>Confirm Settlement</button>
                  </form>
                </div>
              )}

              {/* INTERLINKED REFUND FORM */}
              {refundForm.id && (
                <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #e67e22', borderRadius: '8px' }}>
                  <h3>Process Partial Refund</h3>
                  <p style={{fontSize:'12px', color:'#666'}}>Company refund will auto-add to Portal balance. Customer refund will deduct from Cash/Bank.</p>
                  <form onSubmit={handleRefund} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
                    <input type="number" placeholder="Refund from Company" value={refundForm.compRefund} onChange={(e) => setRefundForm({...refundForm, compRefund: e.target.value})} required style={styles.i} />
                    <input type="number" placeholder="Refund to Customer" value={refundForm.custRefund} onChange={(e) => setRefundForm({...refundForm, custRefund: e.target.value})} required style={styles.i} />
                    <select value={refundForm.mode} onChange={(e) => setRefundForm({...refundForm, mode: e.target.value})} style={styles.i}><option value="Cash">Pay Cust via Cash</option><option value="Bank Transfer">Pay Cust via Bank</option></select>
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
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #D4AF37' }}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <h3>Customer List (CRM)</h3>
                <button onClick={() => exportCSV(data.customers, 'Customers.csv')} style={{...styles.btn, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0F3D2E', color: '#D4AF37' }}><th style={styles.th}>Name</th><th style={styles.th}>Type</th><th style={styles.th}>Phone</th><th style={styles.th}>Action</th></tr></thead>
                <tbody>
                  {data.customers.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{c.name}</td><td style={styles.td}>{c.type || 'Individual'}</td><td style={styles.td}>{c.phone}</td>
                      <td style={styles.td}><button onClick={() => handleDelete('customers', c.id)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer'}}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* INTERLINKED PORTALS & RECHARGE */}
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
                    <select name="portal" style={styles.i} required>{data.portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select>
                    <input name="date" type="date" defaultValue={today} style={styles.i} required />
                    <select name="mode" style={styles.i} required><option value="Cash">Pay via Cash</option><option value="Bank Transfer">Pay via Bank</option></select>
                    <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                    <input name="desc" placeholder="Desc" style={styles.i} />
                    <button type="submit" style={styles.btn}>Recharge</button>
                  </form>
                </div>
                <div style={styles.card}>
                  <h3>Balances</h3>
                  {data.portals.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                      <span>{p.name}<br/><b>{p.current_balance || 0} SAR</b></span>
                      <button onClick={() => handleDelete('portals', p.id)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer'}}>X</button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.card}>
                <h3>Recharge History</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#2980b9', color: 'white' }}><th style={styles.th}>Date</th><th style={styles.th}>Portal</th><th style={styles.th}>Mode</th><th style={styles.th}>Amount</th><th style={styles.th}>Action</th></tr></thead>
                  <tbody>
                    {data.recharges.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{r.recharge_date}</td><td style={styles.td}>{r.portals?.name}</td>
                        <td style={styles.td}>{r.payment_mode || 'Cash'}</td><td style={{...styles.td, color:'green'}}>{r.amount} SAR</td>
                        <td style={styles.td}><button onClick={() => handleDeleteRecharge(r)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer'}}>Del</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INTERLINKED INVESTMENTS */}
          {page === 'invest' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>Add Investment</h3>
                <form onSubmit={handleAddInvestment} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input placeholder="Sponsor Name" value={investForm.name} onChange={(e) => setInvestForm({...investForm, name: e.target.value})} style={styles.i} required />
                  <input type="number" placeholder="Amount" value={investForm.amount} onChange={(e) => setInvestForm({...investForm, amount: e.target.value})} style={styles.i} required />
                  <input type="date" value={investForm.date} onChange={(e) => setInvestForm({...investForm, date: e.target.value})} style={styles.i} required />
                  <select value={investForm.mode} onChange={(e) => setInvestForm({...investForm, mode: e.target.value})} style={styles.i}><option value="Cash">Received in Cash</option><option value="Bank Transfer">Received in Bank</option></select>
                  <input placeholder="Desc" value={investForm.desc} onChange={(e) => setInvestForm({...investForm, desc: e.target.value})} style={styles.i} />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <h3>Investment History</h3>
                  <button onClick={() => exportCSV(data.investments, 'Investments.csv')} style={{...styles.btn, background: '#8e44ad', width: 'auto', padding: '10px 20px'}}>Export Excel</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Sponsor</th><th style={styles.th}>Mode</th><th style={styles.th}>Amount</th><th style={styles.th}>Action</th></tr></thead>
                  <tbody>
                    {data.investments.map(inv => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{inv.invest_date}</td><td style={styles.td}>{inv.investor_name}</td>
                        <td style={styles.td}>{inv.payment_mode}</td><td style={{...styles.td, color:'green'}}>{inv.amount} SAR</td>
                        <td style={styles.td}><button onClick={() => handleDelete('investments', inv.id)} style={{background:'#e74c3c', color:'white', border:'none', padding:'2px 5px', cursor:'pointer'}}>Del</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INTERLINKED HR & ACCOUNTS */}
          {page === 'hr' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={styles.card}>
                <h3>Add Employee</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('employees', { name: e.target.name.value, role: e.target.role.value, base_salary: parseFloat(e.target.sal.value) }, 'Emp'); e.target.reset(); }} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="name" placeholder="Name" style={styles.i} required />
                  <input name="role" placeholder="Role" style={styles.i} required />
                  <input name="sal" type="number" placeholder="Salary" style={styles.i} required />
                  <button type="submit" style={styles.btn}>Add</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Pay Salary</h3>
                <form onSubmit={handlePaySalary} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select name="emp" style={styles.i} required><option value="">Select</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                  <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                  <input name="month" type="month" style={styles.i} required />
                  <select name="mode" style={styles.i}><option value="Cash">Pay via Cash</option><option value="Bank Transfer">Pay via Bank</option></select>
                  <button type="submit" style={styles.btn}>Pay</button>
                </form>
              </div>
              <div style={styles.card}>
                <h3>Add Expense</h3>
                <form onSubmit={handleAddExpense} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input name="cat" placeholder="Category (Rent)" style={styles.i} required />
                  <input name="amt" type="number" placeholder="Amount" style={styles.i} required />
                  <input name="desc" placeholder="Desc" style={styles.i} />
                  <select name="mode" style={styles.i}><option value="Cash">Pay via Cash</option><option value="Bank Transfer">Pay via Bank</option><option value="Investment Account">From Investment</option></select>
                  <button type="submit" style={styles.btn}>Add</button>
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
                <h3>Users List</h3>
                {data.appUsers.map(u => (
                  <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
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
                <thead><tr style={{ background: '#34495e', color: 'white' }}><th style={styles.th}>Date & Time</th><th style={styles.th}>User Email</th><th style={styles.th}>Activity</th></tr></thead>
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
                <button onClick={() => setReportTab('pnl')} style={reportTab==='pnl'?styles.btnSm:styles.btnSmInactive}>Consolidated P&L</button>
                <button onClick={() => setReportTab('sales')} style={reportTab==='sales'?styles.btnSm:styles.btnSmInactive}>Sales</button>
                <button onClick={() => setReportTab('portals')} style={reportTab==='portals'?styles.btnSm:styles.btnSmInactive}>Portals</button>
                <button onClick={() => setReportTab('salary')} style={reportTab==='salary'?styles.btnSm:styles.btnSmInactive}>Salary & Exp</button>
                <button onClick={() => setReportTab('outstanding')} style={reportTab==='outstanding'?styles.btnSm:styles.btnSmInactive}>Outstanding</button>
                <button onClick={() => setReportTab('vat')} style={reportTab==='vat'?styles.btnSm:styles.btnSmInactive}>VAT</button>
                <button onClick={() => setReportTab('cashbook')} style={reportTab==='cashbook'?styles.btnSm:styles.btnSmInactive}>Cashbook</button>
                <button onClick={() => setReportTab('invest')} style={reportTab==='invest'?styles.btnSm:styles.btnSmInactive}>Investment</button>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
                  <button onClick={() => exportCSV(filteredInvoices.map(i => ({ InvNo: i.invoice_no, Customer: i.customers?.name, Date: i.invoice_date, Service: i.service_type, Total: i.total, Profit: i.profit, Status: i.status })), 'Sales_Report.csv')} style={{...styles.btn, background: '#27ae60', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Invoice</th><th style={styles.th}>Customer</th><th style={styles.th}>Total</th><th style={styles.th}>Profit</th></tr></thead><tbody>{filteredInvoices.map(inv => (<tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}><td style={styles.td}>{inv.invoice_date}</td><td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.customers?.name}</td><td style={styles.td}>{inv.total} SAR</td><td style={{...styles.td, color:'green'}}>{inv.profit} SAR</td></tr>))}</tbody></table>
                </div>
              )}
              {reportTab === 'portals' && (
                <div>
                  <h3>Portals Recharge Report</h3>
                  <button onClick={() => exportCSV(filteredRecharges.map(r => ({ Date: r.recharge_date, Company: r.portals?.name, Amount: r.amount, Desc: r.description })), 'Recharge_Report.csv')} style={{...styles.btn, background: '#2980b9', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Company</th><th style={styles.th}>Amount</th></tr></thead><tbody>{filteredRecharges.map(rec => (<tr key={rec.id} style={{ borderBottom: '1px solid #eee' }}><td style={styles.td}>{rec.recharge_date}</td><td style={styles.td}>{rec.portals?.name}</td><td style={{...styles.td, color:'blue'}}>{rec.amount} SAR</td></tr>))}</tbody></table>
                </div>
              )}
              {reportTab === 'salary' && (
                <div>
                  <h3>Salary & Expense Report</h3>
                  <button onClick={() => exportCSV([...filteredPayroll.map(p => ({ Type: 'Salary', Name: p.employees?.name, Amount: p.amount, Date: p.paid_date })), ...filteredExpenses.map(e => ({ Type: e.category, Name: e.description, Amount: e.amount, Date: e.expense_date }))], 'Salary_Expense_Report.csv')} style={{...styles.btn, background: '#e67e22', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Description</th><th style={styles.th}>Amount</th></tr></thead><tbody>{filteredPayroll.map(p => (<tr key={p.id} style={{ borderBottom: '1px solid #eee' }}><td style={styles.td}>{p.paid_date}</td><td style={styles.td}>Salary</td><td style={styles.td}>{p.employees?.name}</td><td style={{...styles.td, color:'red'}}>-{p.amount} SAR</td></tr>))}{filteredExpenses.map(e => (<tr key={e.id} style={{ borderBottom: '1px solid #eee' }}><td style={styles.td}>{e.expense_date}</td><td style={styles.td}>{e.category}</td><td style={styles.td}>{e.description}</td><td style={{...styles.td, color:'red'}}>-{e.amount} SAR</td></tr>))}</tbody></table>
                </div>
              )}
              {reportTab === 'outstanding' && (
                <div>
                  <h3>Outstanding Credit Report</h3>
                  <button onClick={() => exportCSV(outstandingInv.map(i => ({ InvNo: i.invoice_no, Customer: i.customers?.name, Phone: i.customers?.phone, Total: i.total, Paid: i.paid_amount, Due: i.due_amount, DueDate: i.credit_due_date })), 'Outstanding_Report.csv')} style={{...styles.btn, background: '#e74c3c', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Inv No</th><th style={styles.th}>Customer</th><th style={styles.th}>Due Amount</th><th style={styles.th}>Due Date</th><th style={styles.th}>Status</th></tr></thead><tbody>{outstandingInv.map(inv => (<tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}><td style={styles.td}>{inv.invoice_no}</td><td style={styles.td}>{inv.customers?.name}</td><td style={{...styles.td, color:'red'}}>{inv.due_amount} SAR</td><td style={styles.td}>{inv.credit_due_date || 'N/A'}</td><td style={styles.td}>{inv.credit_due_date && new Date(inv.credit_due_date) < new Date(today) ? 'Overdue' : 'Pending'}</td></tr>))}</tbody></table>
                </div>
              )}
              {reportTab === 'vat' && (
                <div>
                  <h3>ZATCA VAT Return Report</h3>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{flex:1, background:'#e8f8f5', padding:'15px', minWidth:'200px'}}><h4>Output VAT (From Sales)</h4><h2>{filteredInvoices.filter(i=>!i.invoice_no.startsWith('REF-')).reduce((s,i)=>s+i.vat,0).toFixed(2)} SAR</h2></div>
                    <div style={{flex:1, background:'#fdedec', padding:'15px', minWidth:'200px'}}><h4>Input VAT (From Expenses)</h4><h2>0.00 SAR</h2></div>
                    <div style={{flex:1, background:'#0F3D2E', color:'#D4AF37', padding:'15px', minWidth:'200px'}}><h4>Net VAT Payable to Govt</h4><h2>{filteredInvoices.filter(i=>!i.invoice_no.startsWith('REF-')).reduce((s,i)=>s+i.vat,0).toFixed(2)} SAR</h2></div>
                  </div>
                </div>
              )}
              {reportTab === 'cashbook' && (
                <div>
                  <h3>Cash & Bank Ledger</h3>
                  <button onClick={() => exportCSV(filteredCashbook.map(c => ({ Date: c.trans_date, Type: c.type, Desc: c.description, Amount: c.amount })), 'Cashbook_Report.csv')} style={{...styles.btn, background: '#2980b9', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Description</th><th style={styles.th}>Amount</th></tr></thead><tbody>{filteredCashbook.map(c => (<tr key={c.id} style={{ borderBottom: '1px solid #eee' }}><td style={styles.td}>{c.trans_date}</td><td style={styles.td}>{c.type}</td><td style={styles.td}>{c.description}</td><td style={{...styles.td, color: c.type.includes('In') ? 'green' : 'red'}}>{c.type.includes('In') ? '+' : '-'}{c.amount} SAR</td></tr>))}</tbody></table>
                </div>
              )}
              {reportTab === 'invest' && (
                <div>
                  <h3>Sponsor Investment Report</h3>
                  <button onClick={() => exportCSV(filteredInvestments.map(i => ({ Date: i.invest_date, Sponsor: i.investor_name, Amount: i.amount, Desc: i.description })), 'Investment_Report.csv')} style={{...styles.btn, background: '#8e44ad', width: 'auto', padding: '10px 20px', marginBottom: '20px'}}>Export Excel</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#f8f9fa' }}><th style={styles.th}>Date</th><th style={styles.th}>Sponsor Name</th><th style={styles.th}>Amount</th><th style={styles.th}>Description</th></tr></thead><tbody>{filteredInvestments.map(inv => (<tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}><td style={styles.td}>{inv.invest_date}</td><td style={styles.td}>{inv.investor_name}</td><td style={{...styles.td, color:'green'}}>{inv.amount} SAR</td><td style={styles.td}>{inv.description}</td></tr>))}</tbody></table>
                </div>
              )}
            </div>
          )}

          {page === 'settings' && <SettingsPage data={data.settings} fetchAll={fetchAll} services={data.services} handleDelete={handleDelete} handleAddEntity={handleAddEntity} />}
        </div>
      </main>

      {previewInv && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Invoice Preview</h2>
              <button onClick={() => setPreviewInv(null)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>X</button>
            </div>
            <div style={{ border: '1px solid #eee', padding: '20px' }}>
              <h2 style={{margin:0, color:'#0F3D2E'}}>Sueud Al Taayira</h2>
              <p>Inv No: {previewInv.invoice_no} | Date: {previewInv.invoice_date}</p>
              <p>Customer: {previewInv.customers?.name}</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
                <tr style={{ background: '#0F3D2E', color: 'white' }}><th style={styles.th}>Service</th><th style={styles.th}>Airline</th><th style={styles.th}>Sector</th><th style={styles.th}>Amount</th></tr>
                <tr><td style={styles.td}>{previewInv.service_type}</td><td style={styles.td}>{previewInv.airline}</td><td style={styles.td}>{previewInv.flight_sector}</td><td style={styles.td}>{previewInv.total} SAR</td></tr>
              </table>
            </div>
            <button onClick={() => downloadPDF(previewInv)} style={{ width: '100%', padding: '15px', background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '20px', fontWeight:'bold' }}>Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage({ data, fetchAll, services, handleDelete, handleAddEntity }) {
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
        <input placeholder="VAT Number" value={form.vat_no || ''} onChange={(e) => setForm({...form, vat_no: e.target.value})} style={styles.i} />
        <input placeholder="CR Number" value={form.cr_no || ''} onChange={(e) => setForm({...form, cr_no: e.target.value})} style={styles.i} />
        <input placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({...form, phone: e.target.value})} style={styles.i} />
        <input placeholder="Address" value={form.address || ''} onChange={(e) => setForm({...form, address: e.target.value})} style={styles.i} />
        <div style={{ gridColumn: 'span 2', border: '1px solid #D4AF37', padding: '15px', borderRadius: '8px' }}>
          <label><b>Upload Logo:</b></label><br/>
          {form.logo_url && <img src={form.logo_url} style={{height:'60px', marginTop:'10px', marginBottom:'10px'}} />}
          <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ marginTop: '10px' }} />
          {uploading && <p>Uploading...</p>}
        </div>
        <button type="submit" style={{ gridColumn: 'span 2', padding: '15px', background: '#D4AF37', color: '#0F3D2E', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>SAVE SETTINGS</button>
      </form>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid #0F3D2E' }}>
        <h3 style={{color: '#0F3D2E', marginTop: 0}}>Manage Services</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleAddEntity('services', { name: e.target.name.value }, 'Service'); e.target.reset(); }} style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
          <input name="name" placeholder="New Service Name" style={styles.i} required />
          <button type="submit" style={{...styles.btn, width: 'auto', padding: '10px 20px'}}>Add</button>
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
