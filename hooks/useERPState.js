'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
  en: {
    dashboard: 'Dashboard', create: 'Create Invoice', list: 'Invoices', refunds: 'Refunds',
    customers: 'Customers', corporates: 'Corporates', creditors: 'Creditors', credit: 'Credit Balances',
    vendors: 'Vendors', packages: 'Packages', branches: 'Branches', portals: 'Portals',
    bank: 'Bank & Cash', invest: 'Investors', hr: 'Human Resources', users: 'Users',
    settings: 'Settings', reports: 'Reports', audit: 'Audit Logs', statements: 'Statements',
    contract: 'Corporate Contract', offer: 'Corporate Offer', superadmin: 'SuperAdmin',
    profile: 'Profile', profitability: 'Profitability', notifications: 'Notifications',
    ai_dashboard: 'AI Dashboard', quotations: 'Quotations', hr_advanced: 'HR & Payroll',
    ai_pricing: 'AI Pricing', my_attendance: 'My Attendance', credit_limits: 'Credit Limits',
    customer_statement: 'Customer Statement', refund_statement: 'Refund Statement',
    supplier_statement: 'Supplier Statement', multi_branch: 'Multi-Branch',
    recurring_invoices: 'Recurring Invoices', expense_approval: 'Expense Approval',
    staff_mistakes: 'Staff Mistakes', expenses: 'Expenses',
    editInvoice: 'Edit Invoice', generateInvoice: 'Generate Invoice', updateInvoice: 'Update Invoice',
    custType: 'Customer Type', individual: 'Individual', corporate: 'Corporate',
    selectCustomer: 'Select Customer', customerPhone: 'Customer Phone',
    passengers: 'Passengers', addPassenger: '+ Add Passenger',
    portal: 'Portal', service: 'Service',
    flightTicket: 'Flight Ticket', hotel: 'Hotel Booking', tourPackage: 'Tour Package',
    visitVisa: 'Visit Visa', umrahVisa: 'Umrah Visa', newService: 'New Service',
    flightType: 'Flight Type', domestic: 'Domestic', international: 'International',
    airline: 'Airline', sector: 'Sector',
    pnr: 'PNR', ticketNo: 'Ticket No',
    qty: 'Quantity', cost: 'Cost', sell: 'Sell',
    discount: 'Discount', vatRate: 'VAT Rate',
    invoiceDate: 'Invoice Date',
    bookingType: 'Booking Type', newBooking: 'New Booking', reissue: 'Reissue',
    extraLuggage: 'Extra Luggage', previousBooking: 'Previous Booking',
    salesPerson: 'Sales Person', paymentMethod: 'Payment Method',
    cash: 'Cash', bankTransfer: 'Bank Transfer',
    card: 'Card / Network', credit: 'Credit', creditBalance: 'Credit Balance',
    tabby: 'Tabby', tamara: 'Tamara', paidAmount: 'Paid Amount',
    invNo: 'Inv No', total: 'Total', due: 'Due', method: 'Method', actions: 'Actions',
    preview: 'Preview', print: 'Print', edit: 'Edit', delete: 'Delete',
    refund: 'Refund', quickSettle: 'Settle', download_excel: 'Export Excel',
    save: 'Save', add: 'Add', search: 'Search...', changePass: 'Change Password', logout: 'Logout',
    selectEmployee: 'Select Employee', attendanceDate: 'Date',
    status: 'Status', present: 'Present', leave: 'Leave', absent: 'Absent',
    checkInTime: 'Check-In', checkOutTime: 'Check-Out',
    overtime: 'OT', deduction: 'Deduction', mark: 'Mark',
    baseSalary: 'Base Salary', commission: 'Commission %', advDed: 'Adv. Deduct',
    gift: 'Gift/Bonus', month: 'Month', mode: 'Mode',
    paySalary: 'Pay Salary', generateSlip: 'Generate Slip',
    target: 'Target (SAR)', achieved: 'Achieved', percentage: '%',
    balance: 'Balance'
  },
  ar: {
    dashboard: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'الفواتير', refunds: 'الاسترجاعات',
    customers: 'العملاء', corporates: 'الشركات', creditors: 'الدائنون', credit: 'أرصدة مستحقة',
    vendors: 'الموردون', packages: 'الباقات', branches: 'الفروع', portals: 'البوابات',
    bank: 'البنك والصندوق', invest: 'المستثمرون', hr: 'الموارد البشرية', users: 'المستخدمون',
    settings: 'الإعدادات', reports: 'التقارير', audit: 'سجل التدقيق', statements: 'كشوفات',
    contract: 'عقد شركات', offer: 'عرض شركات', superadmin: 'المدير العام',
    profile: 'الملف الشخصي', profitability: 'الربحية', notifications: 'الإشعارات',
    ai_dashboard: 'لوحة ذكية', quotations: 'عروض أسعار', hr_advanced: 'الرواتب',
    ai_pricing: 'تسعير ذكي', my_attendance: 'حضوري', credit_limits: 'حدود الائتمان',
    customer_statement: 'كشف عميل', refund_statement: 'كشف استرجاع',
    supplier_statement: 'كشف مورد', multi_branch: 'متعدد الفروع',
    recurring_invoices: 'فواتير متكررة', expense_approval: 'اعتماد مصروفات',
    staff_mistakes: 'أخطاء الموظفين', expenses: 'المصروفات',
    editInvoice: 'تعديل الفاتورة', generateInvoice: 'إنشاء الفاتورة', updateInvoice: 'تحديث الفاتورة',
    custType: 'نوع العميل', individual: 'فرد', corporate: 'شركة',
    selectCustomer: 'اختر العميل', customerPhone: 'هاتف العميل',
    passengers: 'الركاب', addPassenger: '+ إضافة راكب',
    portal: 'البوابة', service: 'الخدمة',
    flightTicket: 'تذكرة طيران', hotel: 'حجز فندق', tourPackage: 'باقة سياحية',
    visitVisa: 'تأشيرة زيارة', umrahVisa: 'تأشيرة عمرة', newService: 'خدمة جديدة',
    flightType: 'نوع الرحلة', domestic: 'داخلي', international: 'دولي',
    airline: 'خط الطيران', sector: 'القطاع',
    pnr: 'رقم الحجز', ticketNo: 'رقم التذكرة',
    qty: 'الكمية', cost: 'التكلفة', sell: 'البيع',
    discount: 'الخصم', vatRate: 'نسبة الضريبة',
    invoiceDate: 'تاريخ الفاتورة',
    bookingType: 'نوع الحجز', newBooking: 'حجز جديد', reissue: 'إعادة إصدار',
    extraLuggage: 'أمتعة إضافية', previousBooking: 'حجز سابق',
    salesPerson: 'موظف المبيعات', paymentMethod: 'طريقة الدفع',
    cash: 'نقداً', bankTransfer: 'تحويل بنكي',
    card: 'بطاقة', credit: 'آجل', creditBalance: 'رصيد مستحق',
    tabby: 'تابي', tamara: 'تمارة', paidAmount: 'المبلغ المدفوع',
    invNo: 'رقم الفاتورة', total: 'الإجمالي', due: 'المتبقي', method: 'الطريقة', actions: 'إجراءات',
    preview: 'معاينة', print: 'طباعة', edit: 'تعديل', delete: 'حذف',
    refund: 'استرجاع', quickSettle: 'تسوية', download_excel: 'تصدير',
    save: 'حفظ', add: 'إضافة', search: 'بحث...', changePass: 'تغيير كلمة المرور', logout: 'تسجيل خروج',
    selectEmployee: 'اختر الموظف', attendanceDate: 'التاريخ',
    status: 'الحالة', present: 'حاضر', leave: 'إجازة', absent: 'غائب',
    checkInTime: 'وقت الحضور', checkOutTime: 'وقت الانصراف',
    overtime: 'إضافي', deduction: 'خصم', mark: 'تسجيل',
    baseSalary: 'الراتب الأساسي', commission: 'العمولة %', advDed: 'خصم سلفة',
    gift: 'هدية/مكافأة', month: 'الشهر', mode: 'الطريقة',
    paySalary: 'دفع الراتب', generateSlip: 'إنشاء قسيمة',
    target: 'الهدف (ريال)', achieved: 'المحقق', percentage: '%',
    balance: 'الرصيد'
  }
};

// ============================================
// HTML TEMPLATES (kept from original - same code)
// ============================================
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trackUrl)}`;
  const totalSell = inv.total_sell || 0;
  const discount = inv.discount || 0;
  const subTotal = totalSell + discount;
  const vatRate = inv.vat > 0 && totalSell > 0 ? Math.round((inv.vat / totalSell) * 100) : 0;
  const vat = inv.vat || 0;
  const total = inv.total || 0;
  const paidAmount = inv.paid_amount || 0;
  const usedCredit = inv.used_credit || 0;
  const cashReturn = inv.cash_return || 0;
  const cashPaid = paidAmount - usedCredit - cashReturn;
  const dueAmount = inv.due_amount || 0;
  const unitPrice = (inv.qty || 1) > 0 ? totalSell / inv.qty : totalSell;
  const invStatus = inv.status || (dueAmount > 0 ? 'Unpaid' : 'Paid');
  let paymentDisplay = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit' && inv.credit_due_date) paymentDisplay = `Credit (Due: ${inv.credit_due_date})`;
  const isReissue = inv.booking_type === 'Reissue' || inv.booking_type === 'Previous Booking';
  const passengersList = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Invoice ${invoiceNo}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;margin:0;padding:0;color:#1e293b}.inv{max-width:210mm;margin:auto;background:#fff;overflow:hidden;border:1px solid #e2e8f0}.hdr{display:flex;justify-content:space-between;align-items:stretch;padding:32px 28px;background:linear-gradient(135deg,#0c1d3a 0%,#1a365d 100%);color:#fff;gap:24px}.cblk{display:flex;gap:18px;flex:1}.logo{width:85px;height:85px;object-fit:cover;border-radius:12px;background:rgba(255,255,255,0.1);padding:4px;flex-shrink:0}.ctxt h2{font-size:20px;font-weight:800;color:#fbbf24;margin:0}.ctxt h1{font-size:14px;font-weight:600;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1.5px;margin:4px 0 0}.ctxt p{font-size:12px;color:rgba(255,255,255,0.7);line-height:1.8;margin:8px 0 0}.imeta{min-width:240px;background:rgba(255,255,255,0.06);padding:16px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;justify-content:center}.imeta h3{font-size:28px;font-weight:800;color:#fbbf24;text-transform:uppercase;line-height:1.1;margin:0}.imeta h3 span{font-size:14px;font-family:'Cairo';display:block;margin:3px 0 0}.mr{display:flex;justify-content:space-between;margin-top:6px;font-size:13px;border-bottom:1px dashed rgba(255,255,255,0.12);padding-bottom:4px}.mr .l{color:rgba(255,255,255,0.6)}.mr .v{color:#fbbf24;font-weight:700}.sbadge{display:inline-block;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:700;margin-top:10px;align-self:flex-start;${invStatus==='Unpaid'?'background:rgba(251,191,36,0.2);color:#fbbf24;':'background:rgba(52,211,153,0.2);color:#34d399;'}}.body{padding:28px}.btitle{font-size:13px;font-weight:700;text-transform:uppercase;color:#94a3b8;margin-bottom:10px;border-bottom:2px solid #e2e8f0;padding-bottom:6px}.dgrid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}.iblk{padding:16px;background:#f8fafc;border-radius:10px;border-left:4px solid #1a365d}.ir{display:flex;justify-content:space-between;font-size:13px;padding:5px 0;border-bottom:1px solid #f1f5f9}.ir:last-child{border:none}.ir .lb{color:#64748b}.ir .vl{color:#0f172a;font-weight:600;text-align:right}.reiblk{padding:16px;background:#fffbeb;border-radius:10px;border:1px solid #fde68a;margin-bottom:24px}.reititle{font-size:14px;font-weight:700;color:#d97706;margin-bottom:10px;display:flex;justify-content:space-between;background:#fef3c7;padding:8px 12px;border-radius:8px}.reigrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.reiitem{background:#fff;padding:10px;border-radius:8px;border:1px solid #fde68a}.reiitem .lb{font-size:11px;color:#92400e;font-weight:600;text-transform:uppercase}.reiitem .vl{font-size:13px;color:#78350f;font-weight:700;margin-top:3px}.reifare{background:#dcfce7;border-color:#86efac;grid-column:span 3;display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:8px}.reifare .lb{color:#059669;font-size:13px}.reifare .vl{color:#047857;font-size:16px;font-weight:800}table{width:100%;border-collapse:collapse;margin-bottom:24px;border-radius:10px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.06)}thead th{padding:14px 12px;background:#0c1d3a;color:#fbbf24;font-size:12px;text-transform:uppercase;text-align:left;letter-spacing:0.5px}thead th.r{text-align:right}thead th.c{text-align:center}tbody td{padding:14px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;background:#fff}tbody td.r{text-align:right;font-weight:600}tbody td.c{text-align:center}.bsec{display:grid;grid-template-columns:1.5fr 1fr;gap:20px}.pbreak{padding:18px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);border-radius:10px;border:1px solid #e2e8f0}.pr{display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px dashed #cbd5e1}.pr:last-child{border:none}.tbox{background:#0c1d3a;border-radius:10px;padding:18px;color:#fff;align-self:flex-start}.trow{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:rgba(255,255,255,0.8)}.gtotal{display:flex;justify-content:space-between;padding:12px 0 0;margin-top:6px;border-top:2px solid rgba(255,255,255,0.12);font-size:20px;font-weight:800;color:#fff}.gtotal .v{color:#fbbf24}.terms{margin-top:24px;padding:18px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0}.terms h4{font-size:12px;color:#64748b;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px}.terms p{font-size:11px;color:#94a3b8;line-height:1.8;margin:0}.ftr{padding:16px 28px;background:#f8fafc;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;gap:16px;margin-top:auto}.qr img{height:70px;width:70px;border-radius:8px;border:1px solid #e2e8f0;padding:3px;background:#fff}.ftxt{text-align:center;flex:1}.amsg{font-size:12px;color:#475569;font-weight:600;margin:0 0 3px}.aar{font-size:12px;color:#64748b;font-family:'Cairo';margin:0}@media print{body{background:#fff;padding:0;margin:0}.inv{border:none;box-shadow:none;max-width:100%;border-radius:0}}</style></head><body>
<div class="inv" style="min-height:1120px;display:flex;flex-direction:column"><div class="hdr"><div class="cblk">${setting.logo_url?`<img src="${setting.logo_url}" crossorigin="anonymous" class="logo"/>`:''}<div class="ctxt"><h2>${setting.company_name_ar||'صعود الطائرة للسفر والسياحة'}</h2><h1>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h1><p>${setting.address_ar||'Address / العنوان'}<br/>VAT / ضريبة: ${setting.vat_no||'N/A'} | CR / سجل: ${setting.cr_no||'N/A'}<br/>Phone / هاتف: ${setting.phone||'N/A'}</p></div></div><div class="imeta"><h3>TAX INVOICE<span>فاتورة ضريبية</span></h3><div class="mr"><span class="l">Inv No / رقم</span><span class="v">${invoiceNo}</span></div><div class="mr"><span class="l">Date / تاريخ</span><span class="v">${inv.invoice_date||''}</span></div><div class="mr"><span class="l">Booking / حجز</span><span class="v">${inv.booking_date||''}</span></div><div class="sbadge">${invStatus==='Unpaid'?'UNPAID / غير مدفوعة':'PAID / مدفوعة'}</div></div></div><div class="body"><div class="dgrid"><div class="iblk"><div class="btitle"><span>BILL TO / فاتورة إلى</span></div><div class="ir"><span class="lb">Name / الاسم</span><span class="vl">${inv.customers?.name||inv.corporates?.name||'N/A'}</span></div><div class="ir"><span class="lb">Phone / الهاتف</span><span class="vl">${inv.customers?.phone||'N/A'}</span></div><div class="ir"><span class="lb">Sales Person / الموظف</span><span class="vl">${inv.employees?.name||'N/A'}</span></div><div class="ir"><span class="lb">Passengers / الركاب</span><span class="vl" style="max-width:160px;font-size:12px;line-height:1.5">${passengersList}</span></div></div><div class="iblk" style="border-left-color:#f59e0b"><div class="btitle"><span>FLIGHT DETAILS / تفاصيل الرحلة</span></div><div class="ir"><span class="lb">Airline / خط الطيران</span><span class="vl">${inv.airline||'N/A'}</span></div><div class="ir"><span class="lb">Sector / القطاع</span><span class="vl">${inv.flight_sector||'N/A'}</span></div><div class="ir"><span class="lb">Flight Type / نوع الرحلة</span><span class="vl">${inv.flight_type||'N/A'}</span></div><div class="ir"><span class="lb">Journey / الرحلة</span><span class="vl">${inv.flight_journey||'N/A'}</span></div><div class="ir"><span class="lb">PNR / رقم الحجز</span><span class="vl">${inv.pnr||'N/A'}</span></div><div class="ir"><span class="lb">Ticket No / التذكرة</span><span class="vl">${inv.ticket_no||'N/A'}</span></div><div class="ir"><span class="lb">Refundable / قابل للاسترجاع</span><span class="vl">${inv.refundable_status||'N/A'}</span></div></div></div>${isReissue?`<div class="reiblk"><div class="reititle"><span>⚠️ PREVIOUS BOOKING DETAILS</span><span>تفاصيل الحجز السابق</span></div><div class="reigrid"><div class="reiitem"><div class="lb">Old Date</div><div class="vl">${inv.old_booking_date||'N/A'}</div></div><div class="reiitem"><div class="lb">Old Airline</div><div class="vl">${inv.old_airline||'N/A'}</div></div><div class="reiitem"><div class="lb">Old Sector</div><div class="vl">${inv.old_sector||'N/A'}</div></div><div class="reiitem"><div class="lb">Old PNR</div><div class="vl">${inv.old_pnr||'N/A'}</div></div><div class="reiitem"><div class="lb">Old Ticket</div><div class="vl">${inv.old_ticket_no||'N/A'}</div></div><div class="reiitem"><div class="lb">Old Type</div><div class="vl">${inv.old_flight_type||'N/A'}</div></div><div class="reifare"><div class="lb">Original Ticket Fare / أجرة التذكرة الأصلية</div><div class="vl">${parseFloat(inv.old_sell_price||0).toFixed(2)} SAR</div></div></div></div>`:''}<table><thead><tr><th>Description / الوصف</th><th class="c">Qty / الكمية</th><th class="r">Unit Price / سعر الوحدة</th><th class="r">Total / الإجمالي</th></tr></thead><tbody><tr><td>${inv.sector||inv.service_type||'Service / خدمة'}</td><td class="c">${inv.qty||1}</td><td class="r">${unitPrice.toFixed(2)}</td><td class="r">${totalSell.toFixed(2)}</td></tr></tbody></table><div class="bsec"><div class="pbreak"><div class="btitle"><span>PAYMENT BREAKDOWN / تفاصيل الدفع</span></div><div class="pr"><span>New Booking Price / سعر الحجز الجديد</span><span style="font-weight:600">${total.toFixed(2)} SAR</span></div>${discount>0?`<div class="pr" style="color:#34d399"><span>Discount / الخصم</span><span style="font-weight:600">- ${discount.toFixed(2)} SAR</span></div>`:''}${usedCredit>0?`<div class="pr" style="color:#7c3aed"><span>Less: Credit Balance / خصم الرصيد</span><span style="font-weight:600">- ${usedCredit.toFixed(2)} SAR</span></div>`:''}${cashReturn>0?`<div class="pr" style="color:#ef4444"><span>Cash Returned / مبلغ مرتجع</span><span style="font-weight:600">- ${cashReturn.toFixed(2)} SAR</span></div>`:''}<div class="pr" style="border-top:2px solid #cbd5e1;margin-top:8px;padding-top:8px;font-weight:700"><span>Balance Paid / المدفوع (${paymentDisplay})</span><span style="color:#059669">${cashPaid.toFixed(2)} SAR</span></div><div class="pr" style="font-weight:700"><span>Amount Due / المتبقي</span><span style="color:${dueAmount>0?'#ef4444':'#059669'}">${dueAmount.toFixed(2)} SAR</span></div></div><div class="tbox"><div class="trow"><span>Subtotal / الإجمالي</span><span>${subTotal.toFixed(2)}</span></div>${discount>0?`<div class="trow" style="color:#34d399"><span>Discount / الخصم</span><span>- ${discount.toFixed(2)}</span></div>`:''}<div class="trow"><span>VAT (${vatRate}%) / الضريبة</span><span>${vat.toFixed(2)}</span></div><div class="gtotal"><span>GRAND TOTAL / الإجمالي</span><span class="v">${total.toFixed(2)} SAR</span></div></div></div></div><div class="terms"><h4>Terms & Conditions / الشروط والأحكام</h4><p>1. All bookings are subject to airline/hotel terms and conditions.<br/>2. Cancellation and refund policies vary by service provider.<br/>3. This invoice is computer-generated and valid without signature.<br/>4. Prices are in Saudi Riyals (SAR) and include applicable VAT.<br/>5. For queries, contact us at ${setting.phone||'our office'}.</p></div></div><div class="ftr"><div class="qr"><img src="${qrCodeUrl}" alt="QR" crossorigin="anonymous"/><p style="font-size:9px;text-align:center;color:#94a3b8;margin:4px 0 0">Scan / امسح</p></div><div class="ftxt"><p class="amsg">Thank you for choosing us! Have a safe flight.</p><p class="aar">شكراً لاختياركم إيانا. رحلة سعيدة!</p></div><div style="width:85px"></div></div></div></body></html>`;
};

const getRefundHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trackUrl)}`;
  const originalFare = inv.old_sell_price || inv.total_sell || 0;
  const customerRefund = inv.refund_customer || 0;
  const airlineRefund = inv.refund_company || 0;
  const airlineFee = originalFare - airlineRefund;
  const custName = inv.customers?.name || inv.old_customer_name || 'N/A';
  const custPhone = inv.customers?.phone || inv.old_customer_phone || 'N/A';
  const passengersList = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : (inv.old_passengers || 'N/A');
  let refundMethod = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit') refundMethod = 'Credit for New Booking / رصيد لحجز جديد';
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Refund ${invoiceNo}</title><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;margin:0;padding:0;color:#1e293b}.inv{max-width:210mm;margin:auto;background:#fff;overflow:hidden;border:1px solid #e2e8f0;min-height:1120px;display:flex;flex-direction:column}.hdr{display:flex;justify-content:space-between;align-items:stretch;padding:32px 28px;background:linear-gradient(135deg,#7f1d1d,#991b1b);color:#fff;gap:24px}.cblk{display:flex;gap:18px;flex:1}.logo{width:85px;height:85px;object-fit:cover;border-radius:12px;background:rgba(255,255,255,0.1);padding:4px;flex-shrink:0}.ctxt h2{font-size:20px;font-weight:800;color:#fbbf24;margin:0}.ctxt h1{font-size:14px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1.5px;margin:4px 0 0}.ctxt p{font-size:12px;color:rgba(255,255,255,0.6);line-height:1.8;margin:8px 0 0}.imeta{min-width:220px;text-align:right;display:flex;flex-direction:column;justify-content:center}.imeta h3{font-size:28px;font-weight:800;color:#fbbf24;text-transform:uppercase;line-height:1.1;margin:0}.imeta h3 span{font-size:14px;font-family:'Cairo';display:block;margin:3px 0 0}.invno{font-size:13px;color:rgba(255,255,255,0.8);margin-top:6px;border-bottom:1px dashed rgba(255,255,255,0.2);padding-bottom:4px}.invno span{color:#fbbf24;font-weight:700}.sbadge{display:inline-block;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:700;margin-top:10px;background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3);align-self:flex-end}.body{padding:28px;flex:1}.iblk{padding:18px;background:#fff5f5;border-radius:10px;border-left:4px solid #dc2626;margin-bottom:20px}.iblk h4{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#dc2626;margin:0 0 10px;font-weight:700}.row{display:flex;justify-content:space-between;font-size:13px;padding:5px 0;border-bottom:1px solid #fee2e2}.row:last-child{border:none}.row .lb{color:#991b1b;font-weight:500}.row .vl{color:#7f1d1d;font-weight:600;text-align:right}.calcblk{background:#fff;padding:20px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:20px}.calctitle{font-size:12px;text-transform:uppercase;color:#dc2626;margin-bottom:10px;border-bottom:1px solid #fee2e2;padding-bottom:6px;font-weight:700}.cr{display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#334155}.cr.deduct{color:#ef4444}.cr.total{padding-top:10px;margin-top:6px;border-top:1px solid #e2e8f0;font-size:18px;font-weight:800;color:#059669}.payinfo{padding:18px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center}.ftr{padding:16px 28px;background:#f8fafc;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;gap:16px;margin-top:auto}.qr img{height:70px;width:70px;border-radius:8px;border:1px solid #e2e8f0;padding:3px;background:#fff}@media print{body{background:#fff;padding:0;margin:0}.inv{border:none;max-width:100%;border-radius:0}}</style></head><body><div class="inv"><div class="hdr"><div class="cblk">${setting.logo_url?`<img src="${setting.logo_url}" crossorigin="anonymous" class="logo"/>`:''}<div class="ctxt"><h2>${setting.company_name_ar||'صعود الطائرة'}</h2><h1>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h1><p>${setting.address_ar||''}<br/>VAT: ${setting.vat_no||'N/A'} | CR: ${setting.cr_no||'N/A'}</p></div></div><div class="imeta"><h3>REFUND<span>استرجاع</span></h3><div class="invno">Refund No / رقم: <span>${invoiceNo}</span></div><div class="invno">Date / تاريخ: <span>${inv.refund_date||inv.invoice_date||''}</span></div><div class="sbadge">PROCESSED / تم الاسترجاع</div></div></div><div class="body"><div class="iblk"><h4>BOOKING DETAILS / تفاصيل الحجز</h4><div class="row"><span class="lb">Customer / العميل</span><span class="vl">${custName}</span></div><div class="row"><span class="lb">Contact / الهاتف</span><span class="vl">${custPhone}</span></div><div class="row"><span class="lb">Passengers / الركاب</span><span class="vl" style="max-width:180px;font-size:12px;line-height:1.5">${passengersList}</span></div><div class="row"><span class="lb">Airline / الخطوط</span><span class="vl">${inv.airline||inv.old_airline||'N/A'}</span></div><div class="row"><span class="lb">Booking Date / تاريخ</span><span class="vl">${inv.invoice_date||inv.old_booking_date||'N/A'}</span></div><div class="row"><span class="lb">PNR / رقم الحجز</span><span class="vl">${inv.pnr||inv.old_pnr||'N/A'}</span></div><div class="row"><span class="lb">Reason / السبب</span><span class="vl">${inv.refund_reason||'N/A'}</span></div></div><div class="calcblk"><div class="calctitle">REFUND CALCULATION / حساب الاسترجاع</div><div class="cr"><span>Original Ticket Fare / أجرة التذكرة الأصلية</span><span style="font-weight:600">${originalFare.toFixed(2)} SAR</span></div><div class="cr deduct"><span>Less: Airline Cancellation Fees / رسوم إلغاء الخطوط</span><span style="font-weight:600">- ${airlineFee.toFixed(2)} SAR</span></div><div class="cr total"><span>Refund to Customer / المسترجع للعميل</span><span>${customerRefund.toFixed(2)} SAR</span></div></div><div class="payinfo"><span style="font-size:13px;font-weight:600;color:#334155">Refund Method / طريقة الاسترجاع</span><span style="font-weight:600;color:#2563eb">${refundMethod}</span></div></div><div class="ftr"><div class="qr"><img src="${qrCodeUrl}" alt="QR" crossorigin="anonymous"/></div><div style="text-align:center;flex:1"><strong>${setting.company_name_en||''}</strong><p style="font-size:11px;color:#94a3b8;margin:4px 0 0">Thank you! / شكراً!</p></div><div style="width:85px"></div></div></div></body></html>`;
};

const getExpenseHTML = (exp, s) => {
  const setting = s || {};
  const expNo = exp.invoice_no || `EXP-${exp.id?.substring(0,8)||'N/A'}`;
  const items = exp.items?.length > 0 ? exp.items : [{ name: exp.item_name||'Item', qty: 1, price: exp.amount||0 }];
  const subTotal = items.reduce((s,it) => s + ((parseFloat(it.qty)||0) * (parseFloat(it.price)||0)), 0);
  const vat = (exp.amount||0) - subTotal;
  const vatRate = vat > 0 && subTotal > 0 ? Math.round((vat/subTotal)*100) : 0;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Expense ${expNo}</title><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;margin:0;padding:0;color:#1e293b}.inv{max-width:210mm;margin:auto;background:#fff;overflow:hidden;border:1px solid #e2e8f0;min-height:1120px;display:flex;flex-direction:column}.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding:35px 40px;background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff}.ci h2{font-size:22px;font-weight:800;color:#fbbf24;margin:0}.ci h1{font-size:14px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px;margin:4px 0 0}.im{text-align:right}.im h3{font-size:28px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin:0}.im p{font-size:13px;color:rgba(255,255,255,0.8);margin:6px 0 0}.im p span{color:#fbbf24;font-weight:700}.body{padding:35px 40px;flex:1}.iblk{padding:20px;background:#fff7ed;border-radius:10px;border-left:4px solid #ea580c;margin-bottom:28px}.iblk h4{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#ea580c;margin:0 0 12px;font-weight:700}.row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0}.row .lb{color:#9a3412;font-weight:500}.row .vl{color:#7c2d12;font-weight:600}table{width:100%;border-collapse:collapse;margin-bottom:28px}thead th{text-align:left;padding:14px;background:#7c2d12;color:#fbbf24;font-size:11px;text-transform:uppercase;letter-spacing:1px}thead th.r{text-align:right}tbody td{padding:14px;border-bottom:1px solid #f1f5f9;font-size:13px}tbody td.r{text-align:right;font-weight:600}.totals{text-align:right;margin-top:20px}.totals p{font-size:13px;margin:6px 0;color:#64748b}.totals h3{font-size:24px;color:#ea580c;font-weight:800;margin:12px 0 0}.ftr{padding:25px 40px;background:#f8fafc;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;margin-top:auto}.qr img{height:80px;width:80px;border-radius:8px;border:1px solid #e2e8f0;padding:3px;background:#fff}@media print{body{background:#fff;padding:0;margin:0}.inv{border:none;max-width:100%;border-radius:0}}</style></head><body><div class="inv"><div class="hdr"><div class="ci"><h2>${setting.company_name_ar||'صعود الطائرة'}</h2><h1>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h1></div><div class="im"><h3>EXPENSE VOUCHER</h3><p>No: <span>${expNo}</span></p><p>Date: <span>${exp.expense_date||''}</span></p></div></div><div class="body"><div class="iblk"><h4>VENDOR & EXPENSE DETAILS</h4><div class="row"><span class="lb">Vendor</span><span class="vl">${exp.vendor_name||'N/A'}</span></div>${exp.vendor_vat?`<div class="row"><span class="lb">Vendor VAT</span><span class="vl">${exp.vendor_vat}</span></div>`:''}<div class="row"><span class="lb">Type</span><span class="vl">${exp.expense_type||'N/A'}</span></div><div class="row"><span class="lb">Payment Mode</span><span class="vl">${exp.payment_mode||'Cash'}</span></div></div><table><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Total</th></tr></thead><tbody>${items.map(it=>`<tr><td>${it.name||'Item'}</td><td class="r">${it.qty||1}</td><td class="r">${parseFloat(it.price||0).toFixed(2)}</td><td class="r">${((parseFloat(it.qty)||0)*(parseFloat(it.price)||0)).toFixed(2)}</td></tr>`).join('')}</tbody></table><div class="totals"><p>Subtotal: <strong>${subTotal.toFixed(2)} SAR</strong></p>${vat>0?`<p>VAT (${vatRate}%): <strong>${vat.toFixed(2)} SAR</strong></p>`:''}<h3>Grand Total: ${(exp.amount||0).toFixed(2)} SAR</h3></div></div><div class="ftr"><div class="qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app')}" alt="QR" crossorigin="anonymous"/></div><div style="text-align:center;flex:1"><strong>${setting.company_name_en||''}</strong><p style="font-size:11px;color:#94a3b8;margin:4px 0 0">${setting.invoice_footer||''}</p></div><div style="width:90px"></div></div></div></body></html>`;
};

const getSalarySlipHTML = (pay, s) => {
  const setting = s || {};
  const slipNo = `SLIP-${pay.id?.substring(0,8)||'N/A'}`;
  const gross = (pay.base_salary||0)+(pay.commission||0)+(pay.overtime||0)+(pay.gift||0);
  const totalDed = (pay.advance_deduction||0)+(pay.mistakes_deduction||0)+(pay.other_deduction||0);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Salary Slip ${slipNo}</title><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;margin:0;padding:0;color:#1e293b}.slip{max-width:210mm;margin:auto;background:#fff;overflow:hidden;border:1px solid #e2e8f0;min-height:1120px;display:flex;flex-direction:column}.hdr{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;padding:35px 40px;display:flex;justify-content:space-between;align-items:center}.hdr h1{font-size:22px;font-weight:800;color:#FBBF24;margin:0}.hdr h2{font-size:15px;color:#c7d2fe;margin:4px 0 0}.si{text-align:right}.si h3{color:#FBBF24;font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0}.si p{font-size:13px;color:#c7d2fe;margin:4px 0 0}.body{padding:35px 40px;flex:1}.eg{display:grid;grid-template-columns:1fr 1fr;gap:20px;background:#F8FAFC;padding:24px;border-radius:12px;border:1px solid #E2E8F0;margin-bottom:28px}.eg p{font-size:14px;margin:6px 0}.eg .lb{color:#64748b;font-weight:500}table{width:100%;border-collapse:collapse;margin-bottom:24px;border-radius:10px;overflow:hidden}th,td{padding:16px 15px;border-bottom:1px solid #f1f5f9;font-size:14px}th{text-align:left;background:#1E3A8A;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:1px}th.r,td.r{text-align:right;font-weight:600}.net{background:linear-gradient(135deg,#059669,#047857);color:#fff;padding:24px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;margin-top:20px;box-shadow:0 10px 20px rgba(5,150,105,0.2)}.net h3{margin:0;text-transform:uppercase;letter-spacing:1px;font-size:16px}.net .amt{font-size:30px;font-weight:800;margin:0}.ftr{text-align:center;padding:24px 40px;background:#F8FAFC;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:auto}@media print{body{background:#fff;padding:0;margin:0}.slip{border:none;max-width:100%;border-radius:0}}</style></head><body><div class="slip"><div class="hdr"><div><h1>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h1><h2>${setting.company_name_ar||'صعود الطائرة'}</h2></div><div class="si"><h3>Salary Slip</h3><p>Slip: ${slipNo} | Month: ${pay.month}</p></div></div><div class="body"><div class="eg"><div><p><span class="lb">Employee Name:</span> <strong>${pay.employees?.name||'N/A'}</strong></p><p><span class="lb">Designation:</span> ${pay.employees?.role||'N/A'}</p></div><div style="text-align:right"><p><span class="lb">Payment Date:</span> ${pay.payment_date||'N/A'}</p><p><span class="lb">Payment Mode:</span> ${pay.payment_mode||'N/A'}</p></div></div><table><thead><tr><th>Earnings</th><th class="r">Amount (SAR)</th></tr></thead><tbody><tr><td>Basic Salary</td><td class="r">${(pay.base_salary||0).toFixed(2)}</td></tr><tr><td>Commission</td><td class="r" style="color:#059669">+ ${(pay.commission||0).toFixed(2)}</td></tr><tr><td>Overtime</td><td class="r" style="color:#059669">+ ${(pay.overtime||0).toFixed(2)}</td></tr><tr><td>Gift/Bonus</td><td class="r" style="color:#059669">+ ${(pay.gift||0).toFixed(2)}</td></tr><tr style="background:#F8FAFC"><td><strong>Gross Pay</strong></td><td class="r"><strong>${gross.toFixed(2)}</strong></td></tr></tbody></table><table><thead><tr><th>Deductions</th><th class="r">Amount (SAR)</th></tr></thead><tbody><tr><td>Advance Deduction</td><td class="r" style="color:#EF4444">- ${(pay.advance_deduction||0).toFixed(2)}</td></tr><tr><td>Mistakes Deduction</td><td class="r" style="color:#EF4444">- ${(pay.mistakes_deduction||0).toFixed(2)}</td></tr>${pay.other_deduction>0?`<tr><td>Other Deduction</td><td class="r" style="color:#EF4444">- ${(pay.other_deduction||0).toFixed(2)}</td></tr>`:''}<tr style="background:#F8FAFC"><td><strong>Total Deductions</strong></td><td class="r"><strong>${totalDed.toFixed(2)}</strong></td></tr></tbody></table><div class="net"><h3>Net Pay</h3><p class="amt">${(pay.amount||0).toFixed(2)} SAR</p></div></div><div class="ftr"><p>This is a computer-generated salary slip.</p><p>© ${new Date().getFullYear()} ${setting.company_name_en||'SUEUD AL TAAYIRA'}</p></div></div></body></html>`;
};

const getMistakeHTML = (m, s) => {
  const setting = s || {};
  const vNo = `MST-${m.id?.substring(0,8)||'N/A'}`;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Mistake ${vNo}</title><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;margin:0;padding:0;color:#1e293b}.v{max-width:210mm;margin:auto;background:#fff;overflow:hidden;border:1px solid #e2e8f0;border-top:10px solid #B91C1C;min-height:1120px;display:flex;flex-direction:column}.hdr{background:linear-gradient(135deg,#0F172A,#1E293B);color:#fff;padding:35px 40px;display:flex;justify-content:space-between;align-items:center}.hdr h1{font-size:22px;font-weight:800;color:#FBBF24;margin:0}.hdr h2{font-size:15px;color:#c7d2fe;margin:4px 0 0}.vi{text-align:right}.vi h3{color:#FBBF24;font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0}.vi p{font-size:13px;color:#c7d2fe;margin:4px 0 0}.body{padding:35px 40px;flex:1}.eg{display:grid;grid-template-columns:1fr 1fr;gap:20px;background:#F8FAFC;padding:24px;border-radius:12px;border:1px solid #E2E8F0;margin-bottom:28px}.eg p{font-size:14px;margin:6px 0}.eg .lb{color:#64748b;font-weight:500}.loss{background:linear-gradient(135deg,#EF4444,#B91C1C);color:#fff;padding:24px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;margin-top:20px;box-shadow:0 10px 20px rgba(239,68,68,0.2)}.loss h3{margin:0;text-transform:uppercase;letter-spacing:1px;font-size:16px}.loss .amt{font-size:30px;font-weight:800;margin:0}.note{margin-top:20px;font-size:14px;color:#334155;padding:20px;background:#FEF2F2;border-radius:10px;border:1px solid #FECACA}.ftr{text-align:center;padding:24px 40px;background:#F8FAFC;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:auto}@media print{body{background:#fff;padding:0;margin:0}.v{border:none;max-width:100%;border-radius:0;border-top:none}}</style></head><body><div class="v"><div class="hdr"><div><h1>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h1><h2>${setting.company_name_ar||'صعود الطائرة'}</h2></div><div class="vi"><h3>Loss Voucher</h3><p>Voucher: ${vNo} | Date: ${m.date}</p></div></div><div class="body"><div class="eg"><div><p><span class="lb">Employee:</span> <strong>${m.employees?.name||'N/A'}</strong></p><p><span class="lb">Designation:</span> ${m.employees?.role||'N/A'}</p></div><div style="text-align:right"><p><span class="lb">Old Ticket:</span> ${m.old_ticket_no||'N/A'}</p><p><span class="lb">New Ticket:</span> ${m.new_ticket_no||'N/A'}</p></div></div><div class="loss"><h3>Total Loss Amount</h3><p class="amt">${(m.loss_amount||0).toFixed(2)} SAR</p></div><div class="note"><strong>Deduction Status:</strong> ${m.paid_by_employee?'Amount will be deducted from employee salary.':'Amount absorbed by company.'}</div></div><div class="ftr"><p>Computer-generated voucher. No signature required.</p><p>© ${new Date().getFullYear()} ${setting.company_name_en||'SUEUD AL TAAYIRA'}</p></div></div></body></html>`;
};

const getContractHTML = (s, name, date, isOffer, type, markup, terms) => {
  const setting = s || {};
  const docType = isOffer ? 'OFFER' : 'CONTRACT';
  const termsList = terms ? terms.split('\n').filter(t=>t.trim()).map(t=>`<li style="margin-bottom:12px;font-size:15px;color:#334155">${t.trim()}</li>`).join('') : '<li style="margin-bottom:12px;font-size:15px;color:#334155">Standard terms apply.</li>';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${docType} - ${name}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;background:#f0f4f8;padding:30px;color:#1e293b}.doc{max-width:210mm;margin:auto;background:#fff;box-shadow:0 20px 60px rgba(0,0,0,0.1);padding:60px;border-radius:16px;border-top:10px solid #1E3A8A}.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;border-bottom:2px solid #e2e8f0;padding-bottom:20px}.hdr h1{font-size:32px;font-weight:800;color:#0F172A;text-transform:uppercase;letter-spacing:1px;margin:0}.hdr .lb{text-align:right}.hdr .lb h2{font-size:20px;font-weight:800;color:#1E3A8A;margin:0}.hdr .lb p{font-size:12px;color:#64748b;margin:5px 0 0}.mb{background:#F8FAFC;padding:24px;border-radius:12px;border-left:5px solid #FBBF24;margin-bottom:30px;display:grid;grid-template-columns:1fr 1fr;gap:20px}.mi p{font-size:14px;margin:6px 0}.mi .lb{color:#64748b;font-weight:500;display:block;font-size:12px;text-transform:uppercase}.mi .vl{color:#0F172A;font-weight:700;font-size:16px}.sec{margin-bottom:40px}.sec h2{font-size:22px;font-weight:700;color:#1E3A8A;margin-bottom:16px;border-left:4px solid #1E3A8A;padding-left:12px}.terms ul{padding-left:25px;list-style-type:square}.sg{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60px}.sb{text-align:center}.sl{border-top:2px solid #0F172A;margin-bottom:12px;width:80%;margin-left:auto;margin-right:auto}.sb p{font-size:14px;color:#64748b;font-weight:600;margin:0}.ftr{margin-top:50px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:20px}@media print{body{background:#fff;padding:0}.doc{box-shadow:none;margin:0;max-width:100%;border-radius:0;border:none}}</style></head><body><div class="doc"><div class="hdr"><div><h1>${docType}</h1><p style="font-size:14px;color:#64748b;margin:6px 0 0">Date: ${date}</p></div><div class="lb"><h2>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h2><p>${setting.company_name_ar||'صعود الطائرة'}</p><p>${setting.phone||''}</p></div></div><div class="mb"><div class="mi"><span class="lb">Client / Corporate Name</span><span class="vl">${name}</span></div><div class="mi"><span class="lb">Service Type</span><span class="vl">${type}</span></div><div class="mi"><span class="lb">Service Fee / Markup</span><span class="vl">${parseFloat(markup||0).toFixed(2)} SAR</span></div><div class="mi"><span class="lb">Validity</span><span class="vl">30 Days from Issue</span></div></div><div class="sec"><h2>Terms & Conditions</h2><div class="terms"><ul>${termsList}</ul></div></div><div class="sg"><div class="sb"><div class="sl"></div><p>Authorized Signatory</p><p style="font-size:12px;color:#94a3b8">${setting.company_name_en||'SUEUD AL TAAYIRA'}</p></div><div class="sb"><div class="sl"></div><p>Client Acceptance</p><p style="font-size:12px;color:#94a3b8">${name}</p></div></div><div class="ftr"><p>© ${new Date().getFullYear()} ${setting.company_name_en||'SUEUD AL TAAYIRA'}. All rights reserved.</p></div></div></body></html>`;
};

// ============================================
// UTILITIES
// ============================================
const filterData = (data, dateField, dateRange) => {
  if (!data || !Array.isArray(data)) return [];
  if (!dateRange || (!dateRange.from && !dateRange.to)) return data;
  return data.filter(item => {
    const d = item[dateField];
    if (!d) return true;
    if (dateRange.from && d < dateRange.from) return false;
    if (dateRange.to && d > dateRange.to) return false;
    return true;
  });
};

const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(row => headers.map(h => { let val = row[h] ?? ''; if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) { val = `"${val.replace(/"/g, '""')}"`; } return val; }).join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
};

// ============================================
// MAIN STATE HOOK (FIXED - AUTH + FETCH)
// ============================================
export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const initDone = useRef(false);

  // Auth
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState('');

  // Language & Navigation
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState({ type: null, data: null });
  const [toast, setToast] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hello! How can I assist you today? / مرحباً! كيف يمكنني مساعدتك؟' }]);
  const [chatInput, setChatInput] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [tblPage, setTblPage] = useState(1);
  const [payFilter, setPayFilter] = useState('All');
  const [previewHTML, setPreviewHTML] = useState('');
  const [repDate, setRepDate] = useState({ from: '', to: '' });
  const [reportTab, setReportTab] = useState('sales');

  // All Data
  const [data, setData] = useState({
    invoices: [], customers: [], corporates: [], creditors: [], vendors: [],
    packages: [], branches: [], portals: [], employees: [], services: [],
    expenses: [], investments: [], cashbook: [], payroll: [], empAdvances: [],
    staffMistakes: [], attendance: [], appUsers: [], tenants: [], audits: [], settings: {}
  });

  // Invoice Form
  const [invForm, setInvForm] = useState({
    custType: 'Individual', custId: 'new', custName: '', custPhone: '',
    corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '',
    passengers: [''], employeeId: '', portalId: '', bookingDate: today, invoiceDate: today,
    bookingType: 'New Booking', linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '',
    oldSector: '', oldSellPrice: 0, oldBookingDate: '', oldPassengers: '', oldFlightType: '',
    oldPaymentMethod: '', refundReason: '', service: 'Flight Ticket', flightType: 'Domestic',
    flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '',
    destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist',
    serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0,
    taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '',
    tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '', status: 'Unpaid'
  });
  const [editInvId, setEditInvId] = useState(null);

  // Expense Form
  const [expForm, setExpForm] = useState({
    date: today, category: 'General', description: '', payment_mode: 'Cash', portal_id: '',
    items: [{ name: '', amount: 0, category: 'General' }]
  });
  const [editExpId, setEditExpId] = useState(null);

  // Other Forms
  const [custForm, setCustForm] = useState({ name: '', phone: '', store_credit: 0 });
  const [editCustId, setEditCustId] = useState(null);
  const [corpForm, setCorpForm] = useState({ name: '', vat_no: '', phone: '', address: '' });
  const [editCorpId, setEditCorpId] = useState(null);
  const [creditorForm, setCreditorForm] = useState({ name: '', phone: '', address: '' });
  const [editCredId, setEditCredId] = useState(null);
  const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [editVendId, setEditVendId] = useState(null);
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '', duration: '', inclusions: '' });
  const [editPkgId, setEditPkgId] = useState(null);
  const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
  const [editBrnId, setEditBrnId] = useState(null);
  const [empForm, setEmpForm] = useState({ name: '', role: 'Sales', salary: 0, phone: '', commission_rate: 0, iqama_no: '', iqama_expiry: '' });
  const [editEmpId, setEditEmpId] = useState(null);
  const [srvForm, setSrvForm] = useState({ name: '' });
  const [editSrvId, setEditSrvId] = useState(null);
  const [investForm, setInvestForm] = useState({ name: '', phone: '', email: '', invested_amount: 0, profit_share_percent: 0, editId: null });
  const [portalForm, setPortalForm] = useState({ name: '', portal_type: 'GDS', current_balance: 0, initial_balance: 0, phone: '', contact_person: '', credit_limit: 0 });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '', creditBalance: 0 });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: 0, date: today, description: '' });
  const [passForm, setPassForm] = useState({ newPass: '' });
  const [userForm, setUserForm] = useState({ username: '', email: '', is_admin: false, can_access_hr: false, can_access_bank: false, can_access_invoices: true, can_access_reports: false, can_access_settings: false });
  const [editUserId, setEditUserId] = useState(null);
  const [tenantForm, setTenantForm] = useState({ agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '', phone: '', address: '' });
  const [setForm, setSetForm] = useState({ company_name_en: '', company_name_ar: '', address_ar: '', phone: '', vat_no: '', cr_no: '', license_no: '', logo_url: '', invoice_footer: '', custom_fields: [] });
  const [payForm, setPayForm] = useState({ employee_id: '', month: today.slice(0, 7), overtime: 0, gift: 0, advance: 0, mistakes_deduction: 0, other_deduction: 0, payment_mode: 'Cash', payment_date: today, notes: '' });
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState(0);
  const [contractTerms, setContractTerms] = useState('');

  // Toast with auto-dismiss
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  // Log action to audit table
  const logAction = useCallback(async (action) => {
    try {
      if (!userProfile?.tenant_id) return;
      await supabase.from('audits').insert([{
        action, user_id: userProfile.id, tenant_id: userProfile.tenant_id, created_at: new Date().toISOString()
      }]);
    } catch (e) { console.warn('Audit log failed:', e.message); }
  }, [userProfile]);

  // ============================================
  // FETCH ALL DATA (FIXED - with proper error handling)
  // ============================================
  const fetchAll = useCallback(async (tenantId) => {
    const tid = tenantId || userProfile?.tenant_id;
    if (!tid) return;
    try {
      const [invRes, custRes, corpRes, credRes, vendRes, pkgRes, brnRes, portRes, empRes, srvRes, expRes, cbRes, payRes, msRes, attRes, setRes, advRes] = await Promise.all([
        supabase.from('invoices').select('*, customers(name,phone), corporates(name), employees(name)').eq('tenant_id', tid).order('invoice_date', { ascending: false }),
        supabase.from('customers').select('*').eq('tenant_id', tid).order('name'),
        supabase.from('corporates').select('*').eq('tenant_id', tid).order('name'),
        supabase.from('creditors').select('*').eq('tenant_id', tid).order('name'),
        supabase.from('vendors').select('*').eq('tenant_id', tid).order('name'),
        supabase.from('packages').select('*').eq('tenant_id', tid).order('name'),
        supabase.from('branches').select('*').eq('tenant_id', tid).order('name'),
        supabase.from('portals').select('*').eq('tenant_id', tid).order('name'),
        supabase.from('employees').select('*').eq('tenant_id', tid).order('name'),
        supabase.from('services').select('*').eq('tenant_id', tid).order('name'),
        supabase.from('expenses').select('*').eq('tenant_id', tid).order('expense_date', { ascending: false }),
        supabase.from('cashbook').select('*').eq('tenant_id', tid).order('trans_date', { ascending: false }).limit(500),
        supabase.from('payroll').select('*, employees(name,role)').eq('tenant_id', tid).order('month', { ascending: false }),
        supabase.from('staff_mistakes').select('*, employees(name,role)').eq('tenant_id', tid).order('date', { ascending: false }),
        supabase.from('attendance').select('*, employees(name)').eq('tenant_id', tid).order('date', { ascending: false }),
        supabase.from('settings').select('*').eq('tenant_id', tid).maybeSingle(),
        supabase.from('emp_advances').select('*').eq('tenant_id', tid).order('date', { ascending: false })
      ]);

      setData(prev => ({
        ...prev,
        invoices: invRes.data || [],
        customers: custRes.data || [],
        corporates: corpRes.data || [],
        creditors: credRes.data || [],
        vendors: vendRes.data || [],
        packages: pkgRes.data || [],
        branches: brnRes.data || [],
        portals: portRes.data || [],
        employees: empRes.data || [],
        services: srvRes.data || [],
        expenses: expRes.data || [],
        cashbook: cbRes.data || [],
        payroll: payRes.data || [],
        staffMistakes: msRes.data || [],
        attendance: attRes.data || [],
        settings: setRes.data || {},
        empAdvances: advRes.data || []
      }));
    } catch (err) {
      console.error('fetchAll error:', err);
    }
  }, [userProfile]);

  // ============================================
  // INIT: Auth Check + Profile Fetch (ROOT CAUSE FIX)
  // ============================================
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const init = async () => {
      try {
        // Step 1: Check Supabase URL is valid
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl || supabaseUrl.includes('dummy')) {
          setInitError('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL in Vercel environment variables.');
          setLoading(false);
          return;
        }

        // Step 2: Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError.message);
          setInitError('Session error: ' + sessionError.message);
          setLoading(false);
          router.push('/login');
          return;
        }

        if (!session) {
          console.log('No session found, redirecting to login...');
          setLoading(false);
          router.push('/login');
          return;
        }

        // Step 3: Set user
        setUser(session.user);

        // Step 4: Fetch user profile from app_users table
        const { data: profile, error: profileError } = await supabase
          .from('app_users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError.message);
          setInitError('Profile error: ' + profileError.message);
          setLoading(false);
          // Don't redirect - let user see the error
          return;
        }

        if (!profile) {
          console.error('No profile found for user:', session.user.id);
          setInitError('No profile found. Contact admin to setup your account.');
          setLoading(false);
          return;
        }

        // Step 5: Check subscription
        if (!profile.is_super_admin) {
          const { data: tenant } = await supabase
            .from('tenants')
            .select('is_paid, subscription_end_date')
            .eq('id', profile.tenant_id)
            .maybeSingle();

          if (tenant && !tenant.is_paid) {
            const endDate = tenant.subscription_end_date;
            if (endDate && new Date(endDate) < new Date()) {
              setInitError('Subscription expired. Please renew to continue.');
              setLoading(false);
              router.push('/subscription');
              return;
            }
          }
        }

        // Step 6: Set profile
        setUserProfile(profile);
        setProfileForm({
          username: profile.username || '',
          avatar_url: profile.avatar_url || '',
          phone: profile.phone || '',
          address: profile.address || ''
        });

        // Step 7: Fetch all data
        await fetchAll(profile.tenant_id);

        // Step 8: Done!
        setLoading(false);

      } catch (err) {
        console.error('Init error:', err);
        setInitError('Initialization failed: ' + err.message);
        setLoading(false);
      }
    };

    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        router.push('/login');
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================
  // RETURN EVERYTHING
  // ============================================
  return {
    user, setUser, userProfile, setUserProfile, loading, setLoading, initError,
    lang, setLang, page, setPage, modal, setModal, toast, setToast, showToast,
    chatOpen, setChatOpen, chatMessages, setChatMessages, chatInput, setChatInput,
    sidebarCollapsed, setSidebarCollapsed, darkMode, setDarkMode,
    globalSearch, setGlobalSearch, showGlobalSearch, setShowGlobalSearch,
    search, setSearch, tblPage, setTblPage, payFilter, setPayFilter,
    previewHTML, setPreviewHTML, repDate, setRepDate, reportTab, setReportTab,
    data, setData, fetchAll, logAction,
    invForm, setInvForm, editInvId, setEditInvId,
    expForm, setExpForm, editExpId, setEditExpId,
    custForm, setCustForm, editCustId, setEditCustId,
    corpForm, setCorpForm, editCorpId, setEditCorpId,
    creditorForm, setCreditorForm, editCredId, setEditCredId,
    vendorForm, setVendorForm, editVendId, setEditVendId,
    pkgForm, setPkgForm, editPkgId, setEditPkgId,
    brnForm, setBrnForm, editBrnId, setEditBrnId,
    empForm, setEmpForm, editEmpId, setEditEmpId,
    srvForm, setSrvForm, editSrvId, setEditSrvId,
    investForm, setInvestForm, portalForm, setPortalForm,
    settleForm, setSettleForm, refundForm, setRefundForm,
    transferForm, setTransferForm, passForm, setPassForm,
    userForm, setUserForm, editUserId, setEditUserId,
    tenantForm, setTenantForm, profileForm, setProfileForm,
    setForm, setSetForm, payForm, setPayForm,
    contractCorpName, setContractCorpName, contractType, setContractType,
    contractMarkup, setContractMarkup, contractTerms, setContractTerms,
    today, router, tr: translations[lang] || translations.en,
    filterData, exportToExcel,
    getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getContractHTML, getMistakeHTML
  };
}
