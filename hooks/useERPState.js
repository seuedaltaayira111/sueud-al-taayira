'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

/* ═══ TRANSLATIONS ═══ */
const translations = {
  en: { dashboard:'Dashboard', create:'Create Invoice', list:'Invoices', refunds:'Refunds', customers:'Customers', corporates:'Corporates', creditors:'Creditors', credit:'Credit Balances', vendors:'Vendors', packages:'Packages', branches:'Branches', portals:'Portals', bank:'Bank & Cash', invest:'Investors', hr:'Human Resources', users:'Users', settings:'Settings', reports:'Reports', audit:'Audit Logs', statements:'Statements', contract:'Corporate Contract', offer:'Corporate Offer', superadmin:'SuperAdmin', profile:'Profile', profitability:'Profitability', notifications:'Notifications', ai_dashboard:'AI Dashboard', quotations:'Quotations', hr_advanced:'HR & Payroll', ai_pricing:'AI Pricing', my_attendance:'My Attendance', credit_limits:'Credit Limits', customer_statement:'Customer Statement', refund_statement:'Refund Statement', supplier_statement:'Supplier Statement', multi_branch:'Multi-Branch', recurring_invoices:'Recurring Invoices', expense_approval:'Expense Approval', staff_mistakes:'Staff Mistakes', expenses:'Expenses', editInvoice:'Edit Invoice', generateInvoice:'Generate Invoice', updateInvoice:'Update Invoice', custType:'Customer Type', individual:'Individual', corporate:'Corporate', selectCustomer:'Select Customer', customerPhone:'Customer Phone', passengers:'Passengers', addPassenger:'+ Add Passenger', portal:'Portal', service:'Service', flightTicket:'Flight Ticket', hotel:'Hotel Booking', tourPackage:'Tour Package', visitVisa:'Visit Visa', umrahVisa:'Umrah Visa', newService:'New Service', flightType:'Flight Type', domestic:'Domestic', international:'International', airline:'Airline', sector:'Sector', pnr:'PNR', ticketNo:'Ticket No', qty:'Quantity', cost:'Cost', sell:'Sell', discount:'Discount', vatRate:'VAT Rate', invoiceDate:'Invoice Date', bookingType:'Booking Type', newBooking:'New Booking', reissue:'Reissue', extraLuggage:'Extra Luggage', previousBooking:'Previous Booking', salesPerson:'Sales Person', paymentMethod:'Payment Method', cash:'Cash', bankTransfer:'Bank Transfer', card:'Card / Network', credit:'Credit', creditBalance:'Credit Balance', tabby:'Tabby', tamara:'Tamara', paidAmount:'Paid Amount', invNo:'Inv No', total:'Total', due:'Due', method:'Method', actions:'Actions', preview:'Preview', print:'Print', edit:'Edit', delete:'Delete', refund:'Refund', quickSettle:'Settle', download_excel:'Export Excel', save:'Save', add:'Add', search:'Search...', changePass:'Change Password', logout:'Logout', selectEmployee:'Select Employee', attendanceDate:'Date', status:'Status', present:'Present', leave:'Leave', absent:'Absent', checkInTime:'Check-In', checkOutTime:'Check-Out', overtime:'OT', deduction:'Deduction', mark:'Mark', baseSalary:'Base Salary', commission:'Commission %', advDed:'Adv. Deduct', gift:'Gift/Bonus', month:'Month', mode:'Mode', paySalary:'Pay Salary', generateSlip:'Generate Slip', target:'Target (SAR)', achieved:'Achieved', percentage:'%', balance:'Balance' },
  ar: { dashboard:'لوحة التحكم', create:'إنشاء فاتورة', list:'الفواتير', refunds:'الاسترجاعات', customers:'العملاء', corporates:'الشركات', creditors:'الدائنون', credit:'أرصدة مستحقة', vendors:'الموردون', packages:'الباقات', branches:'الفروع', portals:'البوابات', bank:'البنك والصندوق', invest:'المستثمرون', hr:'الموارد البشرية', users:'المستخدمون', settings:'الإعدادات', reports:'التقارير', audit:'سجل التدقيق', statements:'كشوفات', contract:'عقد شركات', offer:'عرض شركات', superadmin:'المدير العام', profile:'الملف الشخصي', profitability:'الربحية', notifications:'الإشعارات', ai_dashboard:'لوحة ذكية', quotations:'عروض أسعار', hr_advanced:'الرواتب', ai_pricing:'تسعير ذكي', my_attendance:'حضوري', credit_limits:'حدود الائتمان', customer_statement:'كشف عميل', refund_statement:'كشف استرجاع', supplier_statement:'كشف مورد', multi_branch:'متعدد الفروع', recurring_invoices:'فواتير متكررة', expense_approval:'اعتماد مصروفات', staff_mistakes:'أخطاء الموظفين', expenses:'المصروفات', editInvoice:'تعديل الفاتورة', generateInvoice:'إنشاء الفاتورة', updateInvoice:'تحديث الفاتورة', custType:'نوع العميل', individual:'فرد', corporate:'شركة', selectCustomer:'اختر العميل', customerPhone:'هاتف العميل', passengers:'الركاب', addPassenger:'+ إضافة راكب', portal:'البوابة', service:'الخدمة', flightTicket:'تذكرة طيران', hotel:'حجز فندق', tourPackage:'باقة سياحية', visitVisa:'تأشيرة زيارة', umrahVisa:'تأشيرة عمرة', newService:'خدمة جديدة', flightType:'نوع الرحلة', domestic:'داخلي', international:'دولي', airline:'خط الطيران', sector:'القطاع', pnr:'رقم الحجز', ticketNo:'رقم التذكرة', qty:'الكمية', cost:'التكلفة', sell:'البيع', discount:'الخصم', vatRate:'نسبة الضريبة', invoiceDate:'تاريخ الفاتورة', bookingType:'نوع الحجز', newBooking:'حجز جديد', reissue:'إعادة إصدار', extraLuggage:'أمتعة إضافية', previousBooking:'حجز سابق', salesPerson:'موظف المبيعات', paymentMethod:'طريقة الدفع', cash:'نقداً', bankTransfer:'تحويل بنكي', card:'بطاقة', credit:'آجل', creditBalance:'رصيد مستحق', tabby:'تابي', tamara:'تمارة', paidAmount:'المبلغ المدفوع', invNo:'رقم الفاتورة', total:'الإجمالي', due:'المتبقي', method:'الطريقة', actions:'إجراءات', preview:'معاينة', print:'طباعة', edit:'تعديل', delete:'حذف', refund:'استرجاع', quickSettle:'تسوية', download_excel:'تصدير', save:'حفظ', add:'إضافة', search:'بحث...', changePass:'تغيير كلمة المرور', logout:'تسجيل خروج', selectEmployee:'اختر الموظف', attendanceDate:'التاريخ', status:'الحالة', present:'حاضر', leave:'إجازة', absent:'غائب', checkInTime:'وقت الحضور', checkOutTime:'وقت الانصراف', overtime:'إضافي', deduction:'خصم', mark:'تسجيل', baseSalary:'الراتب الأساسي', commission:'العمولة %', advDed:'خصم سلفة', gift:'هدية/مكافأة', month:'الشهر', mode:'الطريقة', paySalary:'دفع الراتب', generateSlip:'إنشاء قسيمة', target:'الهدف (ريال)', achieved:'المحقق', percentage:'%', balance:'الرصيد' }
};

/* ═══ AIRLINE CHECK-IN URL MAPPER ═══ */
const getAirlineCheckInURL = (airline, pnr) => {
  if (!airline || !pnr) return null;
  const a = airline.toLowerCase();
  const urls = {
    'saudia': `https://www.saudia.com/check-in?pnr=${pnr}`, 'sv': `https://www.saudia.com/check-in?pnr=${pnr}`,
    'flynas': `https://www.flynas.com/en/manage-booking?ref=${pnr}`, 'flyadeal': `https://www.flyadeal.com/en/manage-booking?ref=${pnr}`,
    'gulf air': `https://www.gulfair.com/check-in?pnr=${pnr}`, 'emirates': `https://www.emirates.com/manage-booking/retrieve-check-in?pnr=${pnr}`,
    'etihad': `https://www.etihad.com/en-us/manage-booking/check-in?pnr=${pnr}`, 'qatar': `https://www.qatarairways.com/en/check-in.html?pnr=${pnr}`,
    'egyptair': `https://www.egyptair.com/en/Manage-Booking/Check-In?pnr=${pnr}`, 'turkish': `https://www.turkishairlines.com/en-us/check-in?pnr=${pnr}`,
    'flydubai': `https://www.flydubai.com/en/manage-booking?ref=${pnr}`, 'air arabia': `https://www.airarabia.com/manage-booking?pnr=${pnr}`,
    'royal jordanian': `https://www.rj.com/en/manage-booking?pnr=${pnr}`, 'oman air': `https://www.omanair.com/manage-booking?pnr=${pnr}`,
    'kuwait': `https://www.kuwaitairways.com/en/manage-booking?pnr=${pnr}`, 'pakistan': `https://www.piac.com.pk/manage-booking?pnr=${pnr}`,
    'indigo': `https://www.goindigo.in/manage-booking?pnr=${pnr}`, 'spicejet': `https://www.spicejet.com/manage-booking?pnr=${pnr}`,
    'air india': `https://www.airindia.in/manage-booking?pnr=${pnr}`, 'virgin': `https://www.virginatlantic.com/check-in?pnr=${pnr}`,
  };
  for (const [key, url] of Object.entries(urls)) { if (a.includes(key)) return url; }
  return `https://www.google.com/search?q=${encodeURIComponent(airline + ' check in pnr ' + pnr)}`;
};

/* ═══ AI MESSAGE ═══ */
const getAIMessage = (inv, lang) => {
  const msgs = [
    { en: "✈️ Wishing you a wonderful journey! Safe travels.", ar: "✈️ نتمنى لك رحلة سعيدة! سفر آمن." },
    { en: "🌟 Your trust means the world to us. Amazing trip!", ar: "🌟 ثقتكم تعني لنا كل شيء. رحلة رائعة!" },
    { en: "💎 Premium service, unforgettable experiences.", ar: "💎 خدمة مميزة، تجارب لا تُنسى." },
    { en: "🌅 New horizons await! Thank you!", ar: "🌅 آفاق جديدة تنتظركم! شكراً!" },
  ];
  const idx = (inv.id?.charCodeAt(0) || 0) % msgs.length;
  return lang === 'ar' ? msgs[idx].ar : msgs[idx].en;
};

/* ═══ INVOICE HTML — SINGLE PAGE ═══ */
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const checkInURL = getAirlineCheckInURL(inv.airline, inv.pnr);
  const invoicePageURL = `https://sueud-al-taayira.vercel.app/invoice/${no}`;
  const barcodeData = checkInURL || `https://www.google.com/search?q=${encodeURIComponent((inv.airline || '') + ' check in ' + (inv.pnr || ''))}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=2&height=35&barcolor=0c1d3a&backgroundcolor=ffffff&includetext=false`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(invoicePageURL)}`;
  const ts = inv.total_sell || 0, disc = inv.discount || 0, sub = ts + disc;
  const vr = inv.vat > 0 && ts > 0 ? Math.round((inv.vat / ts) * 100) : 0;
  const vat = inv.vat || 0, tot = inv.total || 0, paid = inv.paid_amount || 0;
  const uc = inv.used_credit || 0, cr = inv.cash_return || 0;
  const cp = paid - uc - cr, due = inv.due_amount || 0;
  const up = (inv.qty || 1) > 0 ? ts / inv.qty : ts;
  const st2 = inv.status || (due > 0 ? 'Unpaid' : 'Paid');
  const isRe = inv.booking_type === 'Reissue' || inv.booking_type === 'Previous Booking';
  const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A';
  const aiMsg = getAIMessage(inv, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Invoice ${no}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.inv{width:210mm;height:297mm;margin:auto;border:2px solid #0c1d3a;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0c1d3a,#1a365d,#2563eb,#0c1d3a)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0c1d3a,#2563eb,#1a365d,#0c1d3a)}
.hdr{display:flex;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#0c1d3a,#1a365d);color:#fff;gap:12px;margin-top:5px}
.cblk{display:flex;gap:10px;flex:1;align-items:center}
.logo{width:50px;height:50px;object-fit:cover;border-radius:6px;background:rgba(255,255,255,0.1);padding:2px;border:1px solid rgba(251,191,36,0.3)}
.ct h2{font-size:14px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}
.ct h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1.5px;margin:2px 0 0}
.ct p{font-size:8px;color:rgba(255,255,255,0.6);line-height:1.6;margin:3px 0 0}
.im{min-width:160px;background:rgba(255,255,255,0.06);padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);text-align:${isRTL ? 'left' : 'right'}}
.im h3{font-size:18px;font-weight:800;color:#fbbf24;text-transform:uppercase;line-height:1;margin:0}
.im h3 span{font-size:9px;font-family:'Cairo';display:block;margin:2px 0 0;color:rgba(255,255,255,0.8)}
.mr{display:flex;justify-content:space-between;margin-top:3px;font-size:8px;border-bottom:1px dashed rgba(255,255,255,0.15);padding-bottom:2px}
.mr .l{color:rgba(255,255,255,0.6)}.mr .v{color:#fbbf24;font-weight:700}
.sb{display:inline-block;padding:3px 10px;border-radius:12px;font-size:8px;font-weight:700;margin-top:5px;${st2 === 'Unpaid' ? 'background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)' : 'background:rgba(52,211,153,0.2);color:#34d399;border:1px solid rgba(52,211,153,0.3)'}}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 16px;background:#f0f4ff;border-bottom:1px solid #e2e8f0}
.comp-det .ci{display:flex;flex-direction:column;gap:0}
.comp-det .cl{font-size:7px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.3px}
.comp-det .cv{font-size:8px;color:#0f172a;font-weight:600}
.body{padding:8px 16px;flex:1;display:flex;flex-direction:column;gap:6px}
.sec-title{font-size:8px;font-weight:700;text-transform:uppercase;color:#0c1d3a;margin-bottom:4px;border-bottom:1.5px solid #0c1d3a;padding-bottom:3px}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.ib{padding:6px 8px;background:#f8fafc;border-radius:5px;border:1px solid #e2e8f0;border-left:3px solid #1a365d}
.ir{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #f1f5f9}
.ir:last-child{border:none}.ir .l{color:#64748b}.ir .v{color:#0f172a;font-weight:600;text-align:${isRTL ? 'left' : 'right'};max-width:65%;word-break:break-word}
.rb{padding:6px 8px;background:#fffbeb;border-radius:5px;border:1px solid #fde68a}
.rt{font-size:9px;font-weight:700;color:#d97706;margin-bottom:5px;display:flex;justify-content:space-between;background:#fef3c7;padding:4px 8px;border-radius:4px}
.rg{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.ri{background:#fff;padding:3px 6px;border-radius:4px;border:1px solid #fde68a}
.ri .l{font-size:7px;color:#92400e;font-weight:600;text-transform:uppercase}.ri .v{font-size:8px;color:#78350f;font-weight:700;margin-top:1px}
.rf{background:#dcfce7;border-color:#86efac;grid-column:span 3;display:flex;justify-content:space-between;align-items:center;padding:4px 8px;border-radius:4px}
.rf .l{color:#059669;font-size:8px}.rf .v{color:#047857;font-size:12px;font-weight:800}
table{width:100%;border-collapse:collapse;border-radius:5px;overflow:hidden;border:1px solid #e2e8f0}
thead th{padding:5px 6px;background:#0c1d3a;color:#fbbf24;font-size:7px;text-transform:uppercase;text-align:${isRTL ? 'right' : 'left'};border-bottom:1.5px solid #fbbf24}
thead th.r{text-align:${isRTL ? 'left' : 'right'}}thead th.c{text-align:center}
tbody td{padding:4px 6px;border-bottom:1px solid #f1f5f9;font-size:8px}
tbody td.r{text-align:${isRTL ? 'left' : 'right'};font-weight:600}tbody td.c{text-align:center}
.bs{display:grid;grid-template-columns:1.5fr 1fr;gap:6px}
.pb{padding:6px 8px;background:#f8fafc;border-radius:5px;border:1px solid #e2e8f0}
.pr{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px dashed #cbd5e1}
.pr:last-child{border:none}
.tb{background:#0c1d3a;border-radius:5px;padding:8px 10px;color:#fff;align-self:flex-start}
.tr{display:flex;justify-content:space-between;padding:2px 0;font-size:8px;color:rgba(255,255,255,0.8)}
.gt{display:flex;justify-content:space-between;padding:6px 0 0;margin-top:4px;border-top:1.5px solid rgba(255,255,255,0.15);font-size:13px;font-weight:800;color:#fff}
.gt .v{color:#fbbf24}
.terms{padding:5px 8px;background:#f8fafc;border-radius:4px;border:1px solid #e2e8f0}
.terms p{font-size:7px;color:#94a3b8;line-height:1.5;margin:0}
.ft{padding:6px 16px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #e2e8f0;gap:8px;margin-top:auto}
.code-box{display:flex;align-items:center;gap:6px}
.barcode-img{height:28px;width:auto;min-width:160px;border:1px solid #e2e8f0;padding:1px 4px;background:#fff;border-radius:2px}
.qr-img{height:36px;width:36px;border:1px solid #e2e8f0;padding:1px;background:#fff;border-radius:3px}
.code-label{font-size:6px;font-weight:700;text-transform:uppercase;text-align:center;color:#475569}
.ai-msg{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:6px;border:1px solid #93c5fd}
.ai-msg p{font-size:8px;color:#1e3a8a;margin:0;line-height:1.4;font-weight:500}
.ai-label{font-size:6px;color:#3b82f6;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.ft-info{width:70px;text-align:center}
.ft-info p{font-size:6px;color:#94a3b8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none}}
</style></head><body>
<div class="inv">
<div class="hdr">
  <div class="cblk">
    ${st.logo_url ? `<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>` : '<div class="logo" style="display:flex;align-items:center;justify-content:center;font-size:20px">✈️</div>'}
    <div class="ct">
      <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
      <h1>${st.company_name_en || 'SUEUD AL TAAYIRA TRAVEL & TOURISM'}</h1>
      <p>${st.address_ar || 'Address'} ${st.phone ? '| ' + st.phone : ''}</p>
    </div>
  </div>
  <div class="im">
    <h3>TAX INVOICE<span>فاتورة ضريبية</span></h3>
    <div class="mr"><span class="l">Inv No / رقم</span><span class="v">${no}</span></div>
    <div class="mr"><span class="l">Date / التاريخ</span><span class="v">${inv.invoice_date || ''}</span></div>
    <div class="sb">${st2 === 'Unpaid' ? 'UNPAID / غير مدفوعة' : 'PAID / مدفوعة'}</div>
  </div>
</div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${st.license_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no || 'N/A'}</span></div>
</div>
<div class="body">
  <div class="dg">
    <div class="ib">
      <div class="sec-title">BILL TO / فاتورة إلى</div>
      <div class="ir"><span class="l">Name / الاسم</span><span class="v">${inv.customers?.name || inv.corporates?.name || 'N/A'}</span></div>
      <div class="ir"><span class="l">Phone / الهاتف</span><span class="v">${inv.customers?.phone || 'N/A'}</span></div>
      <div class="ir"><span class="l">Sales Person / موظف</span><span class="v">${inv.employees?.name || 'N/A'}</span></div>
      <div class="ir"><span class="l">Passengers / الركاب</span><span class="v" style="font-size:7px">${pax}</span></div>
    </div>
    <div class="ib" style="border-left-color:#f59e0b;${isRTL ? 'border-left:1px solid #e2e8f0;border-right:3px solid #f59e0b' : ''}">
      <div class="sec-title">FLIGHT DETAILS / تفاصيل الرحلة</div>
      <div class="ir"><span class="l">Airline / الخطوط</span><span class="v">${inv.airline || 'N/A'}</span></div>
      <div class="ir"><span class="l">Sector / القطاع</span><span class="v">${inv.flight_sector || 'N/A'}</span></div>
      <div class="ir"><span class="l">Type / النوع</span><span class="v">${inv.flight_type || 'N/A'}</span></div>
      <div class="ir"><span class="l">PNR / رقم الحجز</span><span class="v" style="color:#2563eb;font-weight:700">${inv.pnr || 'N/A'}</span></div>
      <div class="ir"><span class="l">Ticket No / التذكرة</span><span class="v">${inv.ticket_no || 'N/A'}</span></div>
      <div class="ir"><span class="l">Service / الخدمة</span><span class="v">${inv.service_type || 'N/A'}</span></div>
    </div>
  </div>
  ${isRe ? `<div class="rb"><div class="rt"><span>⚠️ PREVIOUS BOOKING / الحجز السابق</span></div><div class="rg">
    <div class="ri"><div class="l">Old Date</div><div class="v">${inv.old_booking_date || 'N/A'}</div></div>
    <div class="ri"><div class="l">Old Airline</div><div class="v">${inv.old_airline || 'N/A'}</div></div>
    <div class="ri"><div class="l">Old Sector</div><div class="v">${inv.old_sector || 'N/A'}</div></div>
    <div class="ri"><div class="l">Old PNR</div><div class="v">${inv.old_pnr || 'N/A'}</div></div>
    <div class="ri"><div class="l">Old Ticket</div><div class="v">${inv.old_ticket_no || 'N/A'}</div></div>
    <div class="rf"><div class="l">Original Fare / الأجرة الأصلية</div><div class="v">${parseFloat(inv.old_sell_price || 0).toFixed(2)} SAR</div></div>
  </div></div>` : ''}
  <table>
    <thead><tr><th>Description<span>الوصف</span></th><th class="c">Qty<span>الكمية</span></th><th class="r">Unit Price<span>سعر الوحدة</span></th><th class="r">Total<span>الإجمالي</span></th></tr></thead>
    <tbody>
      <tr><td>${inv.sector || inv.service_type || 'Service'}</td><td class="c">${inv.qty || 1}</td><td class="r">${up.toFixed(2)}</td><td class="r">${ts.toFixed(2)}</td></tr>
      ${disc > 0 ? `<tr style="background:#f0fdf4"><td colspan="3" style="text-align:${isRTL ? 'left' : 'right'};color:#059669">Discount / خصم</td><td class="r" style="color:#059669">- ${disc.toFixed(2)}</td></tr>` : ''}
    </tbody>
  </table>
  <div class="bs">
    <div class="pb">
      <div class="sec-title">PAYMENT BREAKDOWN / تفصيل الدفع</div>
      <div class="pr"><span>Subtotal / المجموع الفرعي</span><span style="font-weight:600">${sub.toFixed(2)} SAR</span></div>
      ${disc > 0 ? `<div class="pr" style="color:#059669"><span>Discount / خصم</span><span>- ${disc.toFixed(2)} SAR</span></div>` : ''}
      <div class="pr"><span>VAT (${vr}%) / ضريبة</span><span>${vat.toFixed(2)} SAR</span></div>
      <div class="pr" style="border-top:1.5px solid #cbd5e1;margin-top:3px;padding-top:3px;font-weight:700"><span>Paid / مدفوع</span><span style="color:#059669">${cp.toFixed(2)} SAR</span></div>
      <div class="pr" style="font-weight:700;font-size:10px"><span>Due / المتبقي</span><span style="color:${due > 0 ? '#ef4444' : '#059669'}">${due.toFixed(2)} SAR</span></div>
    </div>
    <div class="tb">
      <div class="tr"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
      <div class="tr"><span>VAT (${vr}%)</span><span>${vat.toFixed(2)}</span></div>
      <div class="gt"><span>GRAND TOTAL</span><span class="v">${tot.toFixed(2)} SAR</span></div>
    </div>
  </div>
  <div class="terms"><p>1. Bookings subject to airline terms. 2. Cancellation policies vary. 3. Computer-generated - valid without signature. 4. Prices in SAR incl. VAT. 5. Electronic invoice under Fatoorah regulations.</p></div>
</div>
<div class="ft">
  <div class="code-box">
    <img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/>
    <div class="code-label">CHECK-IN</div>
    <img src="${qr}" alt="QR" class="qr-img" crossorigin="anonymous"/>
    <div class="code-label">INVOICE</div>
  </div>
  <div class="ft-divider" style="width:1px;background:#cbd5e1;align-self:stretch;min-height:40px"></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI</div><p>${aiMsg}<span>${lang === 'ar' ? '✈️ رحلة سعيدة!' : 'Safe flight!'}</span></p></div>
  <div class="ft-divider" style="width:1px;background:#cbd5e1;align-self:stretch;min-height:40px"></div>
  <div class="ft-info">
    <p style="font-weight:700;color:#0f172a;font-size:7px">${st.company_name_en || 'SUEUD AL TAAYIRA'}</p>
    <p>${st.phone || ''}</p>
    <p style="font-family:'Cairo';font-size:7px">${st.company_name_ar || ''}</p>
  </div>
</div>
</div></body></html>`;
};

/* ═══ REFUND HTML — SINGLE PAGE ═══ */
const getRefundHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app/invoice/' + no)}`;
  const of2 = inv.old_sell_price || inv.total_sell || 0;
  const cRef = inv.refund_customer || 0;
  const compRef = inv.refund_company || 0;
  const airlineFees = of2 - compRef;
  const cn = inv.customers?.name || inv.old_customer_name || 'N/A';
  const cp = inv.customers?.phone || inv.old_customer_phone || 'N/A';
  const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : (inv.old_passengers || 'N/A');
  const aiMsg = getAIMessage(inv, lang);
  const isRTL = lang === 'ar';
  return `<!DOCTYPE html><html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><title>Refund ${no}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.inv{width:210mm;height:297mm;margin:auto;border:2px solid #7f1d1d;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7f1d1d,#991b1b,#dc2626,#7f1d1d)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7f1d1d,#dc2626,#991b1b,#7f1d1d)}
.hdr{display:flex;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#7f1d1d,#991b1b);color:#fff;gap:12px;margin-top:5px}
.cblk{display:flex;gap:10px;flex:1;align-items:center}
.logo{width:50px;height:50px;object-fit:cover;border-radius:6px;background:rgba(255,255,255,0.1);padding:2px;border:1px solid rgba(251,191,36,0.3)}
.ct h2{font-size:14px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}
.ct h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1.5px;margin:2px 0 0}
.im{min-width:160px;text-align:${isRTL ? 'left' : 'right'}}
.im h3{font-size:18px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin:0}
.im h3 span{font-size:9px;font-family:'Cairo';display:block;margin:2px 0 0;color:rgba(255,255,255,0.8)}
.ino{font-size:8px;color:rgba(255,255,255,0.8);margin-top:3px;border-bottom:1px dashed rgba(255,255,255,0.2);padding-bottom:2px}
.ino span{color:#fbbf24;font-weight:700}
.sb{display:inline-block;padding:3px 10px;border-radius:12px;font-size:8px;font-weight:700;margin-top:5px;background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 16px;background:#fff5f5;border-bottom:1px solid #fecaca}
.comp-det .ci{display:flex;flex-direction:column;gap:0}
.comp-det .cl{font-size:7px;color:#991b1b;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:8px;color:#7f1d1d;font-weight:600}
.body{padding:10px 16px;flex:1;display:flex;flex-direction:column;gap:8px}
.sec-title{font-size:8px;font-weight:700;text-transform:uppercase;color:#7f1d1d;margin-bottom:4px;border-bottom:1.5px solid #7f1d1d;padding-bottom:3px}
.ib{padding:8px;background:#fff5f5;border-radius:5px;border:1px solid #fecaca;border-left:3px solid #dc2626}
.row{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #fee2e2}
.row:last-child{border:none}.row .l{color:#991b1b;font-weight:500}.row .v{color:#7f1d1d;font-weight:600;text-align:${isRTL ? 'left' : 'right'};max-width:65%}
.cb{background:#fff;padding:10px;border-radius:5px;border:1px solid #e2e8f0}
.ct2{font-size:8px;text-transform:uppercase;color:#dc2626;margin-bottom:5px;border-bottom:1.5px solid #fecaca;padding-bottom:3px;font-weight:700}
.cr{display:flex;justify-content:space-between;padding:4px 0;font-size:9px;color:#334155;border-bottom:1px dashed #e2e8f0}
.cr:last-child{border:none}.cr.deduct{color:#ef4444}
.cr.total{padding-top:6px;margin-top:5px;border-top:1.5px solid #dc2626;font-size:14px;font-weight:800;color:#059669;border-bottom:none}
.pi{padding:6px 8px;background:#f8fafc;border-radius:5px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;font-size:9px}
.ft{padding:8px 16px;background:linear-gradient(135deg,#fff5f5,#fef2f2);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #fecaca;gap:8px;margin-top:auto}
.code-box{display:flex;align-items:center;gap:6px}
.qr-img{height:36px;width:36px;border:1px solid #fecaca;padding:1px;background:#fff;border-radius:3px}
.code-label{font-size:6px;font-weight:700;text-transform:uppercase;text-align:center;color:#991b1b}
.ft-divider{width:1px;background:#fecaca;align-self:stretch;min-height:40px}
.ai-msg{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#fef2f2,#fee2e2);border-radius:6px;border:1px solid #fca5a5}
.ai-msg p{font-size:8px;color:#7f1d1d;margin:0;line-height:1.4;font-weight:500}
.ai-label{font-size:6px;color:#dc2626;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.ft-info{width:70px;text-align:center}
.ft-info p{font-size:6px;color:#94a3b8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none}}
</style></head><body>
<div class="inv">
<div class="hdr">
  <div class="cblk">
    ${st.logo_url ? `<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>` : '<div class="logo" style="display:flex;align-items:center;justify-content:center;font-size:20px">✈️</div>'}
    <div class="ct"><h2>${st.company_name_ar || 'صعود الطائرة'}</h2><h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1><p>${st.address_ar || ''} ${st.phone ? '| ' + st.phone : ''}</p></div>
  </div>
  <div class="im"><h3>REFUND<span>استرجاع</span></h3><div class="ino">No: <span>${no}</span></div><div class="ino">Date: <span>${inv.refund_date || inv.invoice_date || ''}</span></div><div class="sb">PROCESSED / تم</div></div>
</div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${st.license_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no || 'N/A'}</span></div>
</div>
<div class="body">
  <div class="ib">
    <div class="sec-title">BOOKING DETAILS / تفاصيل الحجز</div>
    <div class="row"><span class="l">Customer / العميل</span><span class="v">${cn}</span></div>
    <div class="row"><span class="l">Phone / الهاتف</span><span class="v">${cp}</span></div>
    <div class="row"><span class="l">Passengers / الركاب</span><span class="v" style="font-size:7px">${pax}</span></div>
    <div class="row"><span class="l">Airline / الخطوط</span><span class="v">${inv.airline || inv.old_airline || 'N/A'}</span></div>
    <div class="row"><span class="l">Date / التاريخ</span><span class="v">${inv.invoice_date || 'N/A'}</span></div>
    <div class="row"><span class="l">PNR / رقم الحجز</span><span class="v">${inv.pnr || inv.old_pnr || 'N/A'}</span></div>
    <div class="row"><span class="l">Reason / السبب</span><span class="v">${inv.refund_reason || 'N/A'}</span></div>
  </div>
  <div class="cb">
    <div class="ct2">REFUND CALCULATION / حساب الاسترجاع</div>
    <div class="cr"><span>Original Fare / الأجرة الأصلية</span><span style="font-weight:600">${of2.toFixed(2)} SAR</span></div>
    <div class="cr deduct"><span>Less: Airline Fees / خصم رسوم الخطوط</span><span style="font-weight:600">- ${airlineFees.toFixed(2)} SAR</span></div>
    <div class="cr"><span>Refund to Portal / استرجاع للبوابة</span><span style="font-weight:600;color:#2563eb">${compRef.toFixed(2)} SAR</span></div>
    <div class="cr total"><span>Refund to Customer / استرجاع للعميل</span><span>${cRef.toFixed(2)} SAR</span></div>
  </div>
  <div class="pi"><span style="font-weight:600;color:#334155">Refund Method / طريقة الاسترجاع</span><span style="font-weight:600;color:#2563eb">${inv.payment_method || 'Cash'}</span></div>
</div>
<div class="ft">
  <div class="code-box"><img src="${qr}" alt="QR" class="qr-img" crossorigin="anonymous"/><div class="code-label">DOWNLOAD</div></div>
  <div class="ft-divider"></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI</div><p>${aiMsg}<span>${lang === 'ar' ? '🔄 تم الاسترجاع' : 'Refund processed!'}</span></p></div>
  <div class="ft-divider"></div>
  <div class="ft-info"><p style="font-weight:700;color:#7f1d1d">${st.company_name_en || ''}</p><p>${st.phone || ''}</p><p style="font-family:'Cairo'">${st.company_name_ar || ''}</p></div>
</div>
</div></body></html>`;
};

/* ═══ EXPENSE HTML — SINGLE PAGE ═══ */
const getExpenseHTML = (exp, s, lang = 'en') => {
  const st = s || {};
  const eno = `EXP-${exp.id ? exp.id.substring(0, 8) : 'N/A'}`;
  const items = exp.items && exp.items.length > 0 ? exp.items : [{ name: exp.item_name || 'Item', qty: 1, price: exp.amount || 0 }];
  const aiMsg = getAIMessage(exp, lang);
  const isRTL = lang === 'ar';
  return `<!DOCTYPE html><html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><title>Expense ${eno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.inv{width:210mm;height:297mm;margin:auto;border:2px solid #7c2d12;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7c2d12,#9a3412,#ea580c,#7c2d12)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7c2d12,#ea580c,#9a3412,#7c2d12)}
.hdr{display:flex;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;margin-top:5px;align-items:center}
.ci h2{font-size:14px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}
.ci h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1.5px;margin:2px 0 0}
.im{text-align:${isRTL ? 'left' : 'right'}}
.im h3{font-size:18px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin:0}
.im p{font-size:8px;color:rgba(255,255,255,0.8);margin:3px 0 0}.im p span{color:#fbbf24;font-weight:700}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 16px;background:#fff7ed;border-bottom:1px solid #fed7aa}
.comp-det .ci{display:flex;flex-direction:column;gap:0}
.comp-det .cl{font-size:7px;color:#9a3412;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:8px;color:#7c2d12;font-weight:600}
.body{padding:10px 16px;flex:1;display:flex;flex-direction:column;gap:8px}
.sec-title{font-size:8px;font-weight:700;text-transform:uppercase;color:#7c2d12;margin-bottom:4px;border-bottom:1.5px solid #7c2d12;padding-bottom:3px}
.ib{padding:8px;background:#fff7ed;border-radius:5px;border-left:3px solid #ea580c;border:1px solid #fed7aa}
.row{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #fed7aa}
.row:last-child{border:none}.row .l{color:#9a3412;font-weight:500}.row .v{color:#7c2d12;font-weight:600}
table{width:100%;border-collapse:collapse;border-radius:5px;overflow:hidden;border:1px solid #e2e8f0}
thead th{padding:5px 6px;background:#7c2d12;color:#fbbf24;font-size:7px;text-transform:uppercase;text-align:${isRTL ? 'right' : 'left'}}
thead th.r{text-align:${isRTL ? 'left' : 'right'}}
tbody td{padding:4px 6px;border-bottom:1px solid #f1f5f9;font-size:8px}
tbody td.r{text-align:${isRTL ? 'left' : 'right'};font-weight:600}
.totals{background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;padding:12px 16px;border-radius:6px;display:flex;justify-content:space-between;align-items:center}
.totals h3{margin:0;text-transform:uppercase;font-size:10px}.totals .amt{font-size:20px;font-weight:800;margin:0;color:#fbbf24}
.ft{padding:8px 16px;background:linear-gradient(135deg,#fff7ed,#ffedd5);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #fed7aa;gap:8px;margin-top:auto}
.ai-msg{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#fff7ed,#fed7aa);border-radius:6px;border:1px solid #fdba74}
.ai-msg p{font-size:8px;color:#7c2d12;margin:0;line-height:1.4;font-weight:500}
.ai-label{font-size:6px;color:#9a3412;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.ft-info{width:70px;text-align:center}
.ft-info p{font-size:6px;color:#94a3b8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none}}
</style></head><body>
<div class="inv">
<div class="hdr"><div class="ci"><h2>${st.company_name_ar || 'صعود الطائرة'}</h2><h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1></div>
<div class="im"><h3>EXPENSE VOUCHER</h3><p>No: <span>${eno}</span></p><p>Date: <span>${exp.expense_date || ''}</span></p></div></div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${st.license_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no || 'N/A'}</span></div>
</div>
<div class="body">
  <div class="ib">
    <div class="sec-title">DETAILS / التفاصيل</div>
    <div class="row"><span class="l">Type / النوع</span><span class="v">${exp.expense_type || 'N/A'}</span></div>
    <div class="row"><span class="l">Payment / الدفع</span><span class="v">${exp.payment_mode || 'Cash'}</span></div>
    <div class="row"><span class="l">Description / الوصف</span><span class="v">${exp.description || 'N/A'}</span></div>
  </div>
  <table>
    <thead><tr><th>Item / البند</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Total</th></tr></thead>
    <tbody>${items.map(function(it) { return '<tr><td>' + (it.name || 'Item') + '</td><td class="r">' + (it.qty || 1) + '</td><td class="r">' + parseFloat(it.price || 0).toFixed(2) + '</td><td class="r">' + ((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)).toFixed(2) + '</td></tr>'; }).join('')}</tbody>
  </table>
  <div class="totals"><h3>TOTAL / الإجمالي</h3><p class="amt">${(exp.amount || 0).toFixed(2)} SAR</p></div>
</div>
<div class="ft">
  <div class="ft-info"><p style="font-weight:700;color:#7c2d12">${st.company_name_en || ''}</p><p>${st.phone || ''}</p><p style="font-family:'Cairo'">${st.company_name_ar || ''}</p></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI</div><p>${aiMsg}<span>${lang === 'ar' ? '📝 سند مصروفات' : 'Expense voucher'}</span></p></div>
  <div style="width:70px"></div>
</div>
</div></body></html>`;
};

/* ═══ SALARY SLIP HTML — SINGLE PAGE ═══ */
const getSalarySlipHTML = (pay, s, lang = 'en') => {
  const st = s || {};
  const sno = `SLIP-${pay.id ? pay.id.substring(0, 8) : 'N/A'}`;
  const gross = (pay.base_salary || 0) + (pay.commission_amount || 0) + (pay.overtime || 0) + (pay.gift || 0);
  const tded = (pay.advance_deduction || 0) + (pay.mistakes_deduction || 0) + (pay.other_deduction || 0);
  const net = gross - tded;
  const aiMsg = getAIMessage(pay, lang);
  const isRTL = lang === 'ar';
  return `<!DOCTYPE html><html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><title>Slip ${sno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.slip{width:210mm;height:297mm;margin:auto;border:2px solid #0F172A;display:flex;flex-direction:column;position:relative;overflow:hidden}
.slip::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0F172A,#1E3A8A,#2563EB,#0F172A)}
.slip::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0F172A,#2563EB,#1E3A8A,#0F172A)}
.hdr{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;margin-top:5px}
.hdr h1{font-size:14px;font-weight:800;color:#FBBF24;margin:0}
.si{text-align:${isRTL ? 'left' : 'right'}}
.si h3{color:#FBBF24;font-size:16px;font-weight:800;text-transform:uppercase;margin:0}
.si h3 span{font-family:'Cairo';display:block;font-size:8px;color:rgba(255,255,255,0.8);margin:1px 0 0}
.si p{font-size:8px;color:rgba(255,255,255,0.8);margin:3px 0 0}.si p span{color:#FBBF24;font-weight:700}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 16px;background:#EFF6FF;border-bottom:1px solid #BFDBFE}
.comp-det .ci{display:flex;flex-direction:column;gap:0}
.comp-det .cl{font-size:7px;color:#1E3A8A;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:8px;color:#0F172A;font-weight:600}
.body{padding:10px 16px;flex:1;display:flex;flex-direction:column;gap:8px}
.sec-title{font-size:8px;font-weight:700;text-transform:uppercase;color:#0F172A;margin-bottom:4px;border-bottom:1.5px solid #0F172A;padding-bottom:3px}
.dg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
.ib{padding:6px 8px;background:#F8FAFC;border-radius:5px;border:1px solid #E2E8F0}
.row{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #F1F5F9}
.row:last-child{border:none}.row .l{color:#64748B}.row .v{color:#0F172A;font-weight:600}
.earn{border-left:3px solid #059669}.ded{border-left:3px solid #EF4444}
.earn .sec-title{color:#059669;border-color:#059669}.ded .sec-title{color:#EF4444;border-color:#EF4444}
.totals{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;padding:12px 16px;border-radius:6px;display:flex;justify-content:space-between;align-items:center}
.totals h3{margin:0;text-transform:uppercase;font-size:10px}.totals .amt{font-size:20px;font-weight:800;margin:0;color:#FBBF24}
.ft{padding:8px 16px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #BFDBFE;gap:8px;margin-top:auto}
.ai-msg{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border-radius:6px;border:1px solid #93C5FD}
.ai-msg p{font-size:8px;color:#1E3A8A;margin:0;line-height:1.4;font-weight:500}
.ai-label{font-size:6px;color:#3B82F6;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.ft-info{width:70px;text-align:center}
.ft-info p{font-size:6px;color:#94A3B8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.slip{border:none}}
</style></head><body>
<div class="slip">
<div class="hdr"><h1>${st.company_name_ar || 'صعود الطائرة'}</h1>
<div class="si"><h3>SALARY SLIP<span>قسيمة راتب</span></h3><p>No: <span>${sno}</span></p><p>Month: <span>${pay.month || 'N/A'}</span></p><p>Employee: <span>${pay.employees ? pay.employees.name : 'N/A'}</span></p></div></div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${st.license_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no || 'N/A'}</span></div>
</div>
<div class="body">
  <div class="dg">
    <div class="ib earn">
      <div class="sec-title">EARNINGS / الإيرادات</div>
      <div class="row"><span class="l">Base Salary / أساسي</span><span class="v">${(pay.base_salary || 0).toFixed(2)}</span></div>
      <div class="row"><span class="l">Commission / عمولة</span><span class="v">${(pay.commission_amount || 0).toFixed(2)}</span></div>
      <div class="row"><span class="l">Overtime / إضافي</span><span class="v">${(pay.overtime || 0).toFixed(2)}</span></div>
      <div class="row"><span class="l">Gift/Bonus / مكافأة</span><span class="v">${(pay.gift || 0).toFixed(2)}</span></div>
      <div class="row" style="font-weight:700;border-top:1px solid #059669;margin-top:3px;padding-top:3px"><span class="l">GROSS / الإجمالي</span><span class="v" style="color:#059669">${gross.toFixed(2)}</span></div>
    </div>
    <div class="ib ded">
      <div class="sec-title">DEDUCTIONS / الخصومات</div>
      <div class="row"><span class="l">Advance / سلفة</span><span class="v">${(pay.advance_deduction || 0).toFixed(2)}</span></div>
      <div class="row"><span class="l">Mistakes / أخطاء</span><span class="v">${(pay.mistakes_deduction || 0).toFixed(2)}</span></div>
      <div class="row"><span class="l">Other / أخرى</span><span class="v">${(pay.other_deduction || 0).toFixed(2)}</span></div>
      <div class="row" style="font-weight:700;border-top:1px solid #EF4444;margin-top:3px;padding-top:3px"><span class="l">TOTAL DED. / إجمالي الخصم</span><span class="v" style="color:#EF4444">${tded.toFixed(2)}</span></div>
    </div>
    <div class="ib" style="border-left:3px solid #2563EB">
      <div class="sec-title" style="color:#2563EB;border-color:#2563EB">SUMMARY / ملخص</div>
      <div class="row"><span class="l">Mode / الطريقة</span><span class="v">${pay.payment_mode || 'Cash'}</span></div>
      <div class="row"><span class="l">Working Days</span><span class="v">${pay.working_days || 'N/A'}</span></div>
      <div class="row"><span class="l">Leaves / إجازات</span><span class="v">${pay.leaves_taken || 0}</span></div>
      <div class="row" style="font-weight:700;border-top:1px solid #2563EB;margin-top:3px;padding-top:3px"><span class="l">NET PAY / صافي</span><span class="v" style="color:#2563EB;font-size:12px">${net.toFixed(2)}</span></div>
    </div>
  </div>
  <div class="totals"><h3>NET SALARY / الراتب الصافي</h3><p class="amt">${net.toFixed(2)} SAR</p></div>
</div>
<div class="ft">
  <div class="ft-info"><p style="font-weight:700;color:#0F172A">${st.company_name_en || ''}</p><p>${st.phone || ''}</p><p style="font-family:'Cairo'">${st.company_name_ar || ''}</p></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI</div><p>${aiMsg}<span>${lang === 'ar' ? '💰 راتب تم صرفه' : 'Salary processed'}</span></p></div>
  <div style="width:70px"></div>
</div>
</div></body></html>`;
};

/* ═══ CONTRACT HTML (stub - expand if needed) ═══ */
const getContractHTML = (settings, corpName, date, isOffer, type, markup, terms) => {
  const st = settings || {};
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${isOffer ? 'Offer' : 'Contract'}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:11px;padding:40px}
h1{color:#0c1d3a;font-size:24px;margin-bottom:20px;text-align:center}
h2{color:#1a365d;font-size:16px;margin:20px 0 10px;border-bottom:2px solid #fbbf24;padding-bottom:5px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}
.info-item{background:#f8fafc;padding:10px;border-radius:6px;border-left:3px solid #1a365d}
.info-item .label{font-size:9px;color:#64748b;text-transform:uppercase}
.info-item .value{font-size:13px;font-weight:600;color:#0f172a;margin-top:2px}
.terms{background:#f8fafc;padding:15px;border-radius:8px;margin:20px 0;line-height:1.8}
.signature{display:flex;justify-content:space-between;margin-top:60px}
.sig-box{width:200px;text-align:center}
.sig-line{border-bottom:1px solid #1e293b;margin-bottom:5px;height:60px}
</style></head><body>
<h1>${isOffer ? 'CORPORATE OFFER' : 'CORPORATE CONTRACT'}</h1>
<div style="text-align:center;color:#64748b;margin-bottom:30px">Date: ${date}</div>
<div class="info-grid">
  <div class="info-item"><div class="label">Company</div><div class="value">${st.company_name_en || 'SUEUD AL TAAYIRA'}</div></div>
  <div class="info-item"><div class="label">Corporate</div><div class="value">${corpName || 'N/A'}</div></div>
  <div class="info-item"><div class="label">Type</div><div class="value">${type || 'Standard'}</div></div>
  <div class="info-item"><div class="label">Markup</div><div class="value">${markup || '0'}%</div></div>
</div>
<h2>Terms & Conditions / الشروط والأحكام</h2>
<div class="terms">${(terms || 'Standard terms apply. All bookings subject to airline/hotel terms and availability. Prices quoted are in SAR including VAT unless stated otherwise. Payment terms as agreed between parties.')}</div>
<div class="signature">
  <div class="sig-box"><div class="sig-line"></div>Authorized Signature / التوقيع</div>
  <div class="sig-box"><div class="sig-line"></div>Corporate Signature / التوقيع</div>
</div>
</body></html>`;
};

/* ═══ MISTAKE HTML (stub) ═══ */
const getMistakeHTML = (m, settings, lang) => {
  const st = settings || {};
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Staff Mistake</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:11px;padding:40px}
h1{color:#7f1d1d;font-size:20px;margin-bottom:20px;text-align:center}
.info{background:#fff5f5;padding:15px;border-radius:8px;border-left:3px solid #dc2626;margin:20px 0}
.row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dashed #fecaca}
.row:last-child{border:none}
.total{background:#7f1d1d;color:#fff;padding:15px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-top:20px;font-size:16px;font-weight:700}
.total span:last-child{color:#fbbf24}
</style></head><body>
<h1>STAFF MISTAKE REPORT</h1>
<div style="text-align:center;color:#64748b;margin-bottom:20px">${st.company_name_en || ''} | Date: ${m.date || 'N/A'}</div>
<div class="info">
  <div class="row"><span>Employee / الموظف</span><span style="font-weight:600">${m.employees?.name || 'N/A'}</span></div>
  <div class="row"><span>Old Ticket No / التذكرة القديمة</span><span style="font-weight:600">${m.old_ticket_no || 'N/A'}</span></div>
  <div class="row"><span>New Ticket No / التذكرة الجديدة</span><span style="font-weight:600">${m.new_ticket_no || 'N/A'}</span></div>
  <div class="row"><span>Paid by Employee / دفع من الموظف</span><span style="font-weight:600">${m.paid_by_employee ? 'Yes' : 'No'}</span></div>
</div>
<div class="total"><span>Loss Amount / مبلغ الخسارة</span><span>${(m.loss_amount || 0).toFixed(2)} SAR</span></div>
</body></html>`;
};

/* ═══ HELPERS ═══ */
const DRAFT_KEY = 'erp_invoice_draft';
const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(row => headers.map(h => {
    let val = row[h] ?? '';
    if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
      val = '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }).join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename + '.csv';
  a.click();
  URL.revokeObjectURL(url);
};
const loadDrafts = () => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'); } catch (e) { return []; } };
const saveDraft = (draft) => { try { const d = loadDrafts(); const i = d.findIndex(x => x.id === draft.id); if (i >= 0) d[i] = draft; else d.unshift(draft); localStorage.setItem(DRAFT_KEY, JSON.stringify(d.slice(0, 20))); } catch (e) { } };
const deleteDraft = (id) => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(loadDrafts().filter(d => d.id !== id))); } catch (e) { } };
const generateInvoiceNo = async () => { const n = new Date(); const p = 'INV-' + n.getFullYear().toString().slice(-2) + (n.getMonth() + 1).toString().padStart(2, '0'); try { const { data } = await supabase.from('invoices').select('invoice_no').ilike('invoice_no', p + '%').order('invoice_no', { ascending: false }).limit(1); if (data && data.length > 0) { const num = parseInt(data[0].invoice_no.split('-').pop() || '0'); return p + '-' + (num + 1).toString().padStart(4, '0'); } } catch (e) { } return p + '-0001'; };
const generateRefundNo = async () => { const n = new Date(); const p = 'REF-' + n.getFullYear().toString().slice(-2) + (n.getMonth() + 1).toString().padStart(2, '0'); try { const { data } = await supabase.from('invoices').select('invoice_no').ilike('invoice_no', p + '%').order('invoice_no', { ascending: false }).limit(1); if (data && data.length > 0) { const num = parseInt(data[0].invoice_no.split('-').pop() || '0'); return p + '-' + (num + 1).toString().padStart(4, '0'); } } catch (e) { } return p + '-0001'; };

/* ═══ MAIN HOOK — Compatible with useERPActions ═══ */
export default function useERPState() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const t = useMemo(() => translations[lang], [lang]);
  const tr = translations;

  /* ── Auth ── */
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [initError, setInitError] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Toast ── */
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* ── Page ── */
  const [page, setPage] = useState('dashboard');

  /* ── Modal ── */
  const [modal, setModal] = useState({ type: null, data: null });

  /* ── Preview ── */
  const [previewHTML, setPreviewHTML] = useState('');

  /* ── Chat ── */
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  /* ── Today ── */
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  /* ── Contract ── */
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Standard');
  const [contractMarkup, setContractMarkup] = useState('0');
  const [contractTerms, setContractTerms] = useState('');

  /* ── Data Object (compatible with useERPActions) ── */
  const [data, setData] = useState({
    invoices: [], refunds: [], customers: [], corporates: [], creditors: [],
    employees: [], expenses: [], vendors: [], packages: [], branches: [],
    portals: [], bankTransactions: [], investors: [], auditLogs: [],
    settings: {}, notifications: [], attendance: [], payroll: [],
    creditLimits: [], recurringInvoices: [], quotationRequests: [],
    staffMistakes: [], cashbook: [], tenants: []
  });

  /* ── Form States ── */
  const [invForm, setInvForm] = useState({
    custType: 'Individual', custId: 'new', custName: '', custPhone: '',
    corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '',
    passengers: [''], employeeId: '', portalId: '',
    bookingDate: today, invoiceDate: today, bookingType: 'New Booking',
    linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '',
    oldSellPrice: 0, oldBookingDate: '', oldPassengers: '', oldFlightType: '',
    oldPaymentMethod: '', refundReason: '', service: 'Flight Ticket',
    flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable',
    flightSector: '', airline: '', destination: '', hotelName: '',
    checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '',
    pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0,
    taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '',
    tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed',
    useCredit: 0, creditCustId: '', status: 'Unpaid'
  });
  const [expForm, setExpForm] = useState({ expense_type: '', payment_mode: 'Cash', description: '', amount: '', expense_date: today, items: [] });
  const [corpForm, setCorpForm] = useState({ name: '', vat_no: '', phone: '', address: '' });
  const [creditorForm, setCreditorForm] = useState({ name: '', phone: '', address: '' });
  const [custForm, setCustForm] = useState({ name: '', phone: '', store_credit: 0 });
  const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '', duration: '', inclusions: '' });
  const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
  const [empForm, setEmpForm] = useState({ name: '', phone: '', email: '', role: '', base_salary: '', commission: '' });
  const [srvForm, setSrvForm] = useState({ name: '', type: '', price: '' });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '', creditBalance: 0 });
  const [transferForm, setTransferForm] = useState({ from: '', to: '', amount: '', date: today, reason: '' });
  const [setForm, setSetForm] = useState({ custom_fields: [] });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: '', password: '' });
  const [portalForm, setPortalForm] = useState({ name: '', current_balance: 0 });
  const [tenantForm, setTenantForm] = useState({ agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '', phone: '', address: '' });
  const [payForm, setPayForm] = useState({ employee_id: '', month: '', base_salary: 0, commission: 0, overtime: 0, gift: 0, advance_deduction: 0, mistakes_deduction: 0, other_deduction: 0, payment_mode: 'Cash' });
  const [passForm, setPassForm] = useState({ newPass: '' });

  /* ── Edit IDs ── */
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

  /* ── Safe Table Loader ── */
  const safeLoad = useCallback(async (table, key, opts) => {
    opts = opts || {};
    try {
      var q = supabase.from(table).select(opts.select || '*');
      if (opts.order) q = q.order(opts.order.col, { ascending: opts.order.asc !== false });
      if (opts.limit) q = q.limit(opts.limit);
      if (opts.eq) { Object.keys(opts.eq).forEach(function (k) { q = q.eq(k, opts.eq[k]); }); }
      if (opts.single) { var r = await q.single(); if (r.data) setData(prev => ({ ...prev, [key]: r.data })); }
      else { var r2 = await q; if (r2.data) setData(prev => ({ ...prev, [key]: r2.data })); }
    } catch (e) { console.warn('[ERP] Skip ' + table + ':', e.message); }
  }, []);

  /* ── Fetch All ── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        safeLoad('company_settings', 'settings', { single: true }),
        safeLoad('invoices', 'invoices', { order: { col: 'created_at', asc: false }, select: '*, customers(name,phone), corporates(name,vat_no), employees(name)' }),
        safeLoad('customers', 'customers', { order: { col: 'name', asc: true } }),
        safeLoad('corporates', 'corporates', { order: { col: 'name', asc: true } }),
        safeLoad('creditors', 'creditors', { order: { col: 'name', asc: true } }),
        safeLoad('employees', 'employees', { order: { col: 'name', asc: true } }),
        safeLoad('expenses', 'expenses', { order: { col: 'created_at', asc: false } }),
        safeLoad('vendors', 'vendors', { order: { col: 'name', asc: true } }),
        safeLoad('packages', 'packages', { order: { col: 'name', asc: true } }),
        safeLoad('branches', 'branches', { order: { col: 'name', asc: true } }),
        safeLoad('portals', 'portals', { order: { col: 'name', asc: true } }),
        safeLoad('bank_transactions', 'bankTransactions', { order: { col: 'created_at', asc: false } }),
        safeLoad('investors', 'investors', { order: { col: 'name', asc: true } }),
        safeLoad('audit_logs', 'auditLogs', { order: { col: 'created_at', asc: false }, limit: 500 }),
        safeLoad('notifications', 'notifications', { order: { col: 'created_at', asc: false }, limit: 100 }),
        safeLoad('attendance', 'attendance', { order: { col: 'date', asc: false } }),
        safeLoad('salary_payments', 'payroll', { order: { col: 'created_at', asc: false } }),
        safeLoad('staff_mistakes', 'staffMistakes', { order: { col: 'created_at', asc: false } }),
        safeLoad('tenants', 'tenants', { order: { col: 'created_at', asc: false } }),
      ]);
    } catch (e) { console.error('[ERP] fetchAll error:', e); }
    finally { setLoading(false); }
  }, [safeLoad]);

  /* ── Log Action ── */
  const logAction = useCallback(async (details) => {
    try {
      await supabase.from('audit_logs').insert([{ action: 'user_action', details: details, user_id: user?.id, tenant_id: userProfile?.tenant_id }]);
    } catch (e) { /* silent */ }
  }, [user, userProfile]);

  /* ── Init: Auth + Profile ── */
  useEffect(function () {
    const init = async () => {
      try {
        /* Get auth session */
        const { data: { session }, error: authErr } = await supabase.auth.getSession();
        if (authErr || !session) {
          setInitError('Not authenticated. Please login.');
          router.push('/login');
          return;
        }
        setUser(session.user);

        /* Try to get user profile — but don't fail if table doesn't exist */
        let profile = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: 'Admin',
          is_admin: true,
          can_access_hr: true,
          can_access_bank: true,
          can_access_invoices: true,
          can_access_reports: true,
          can_access_settings: true,
          tenant_id: session.user.user_metadata?.tenant_id || 'default'
        };
        try {
          const { data: profData } = await supabase.from('app_users').select('*').eq('id', session.user.id).single();
          if (profData) profile = { ...profile, ...profData };
        } catch (e) {
          console.warn('[ERP] app_users table not found, using default profile');
        }
        setUserProfile(profile);

        /* Load all data */
        await fetchAll();
      } catch (e) {
        console.error('[ERP] Init error:', e);
        setInitError(e.message || 'Initialization failed');
      }
    };
    init();
  }, [router, fetchAll]);

  /* ── Listen for auth changes ── */
  useEffect(function () {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(function (event, session) {
      if (event === 'SIGNED_OUT') { setUser(null); setUserProfile(null); router.push('/login'); }
      if (event === 'SIGNED_IN' && session) { setUser(session.user); window.location.reload(); }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return {
    /* Core */
    t, tr, lang, setLang, translations: tr,
    user, setUser, userProfile, setUserProfile, initError, loading, setLoading,
    data, setData, fetchAll, logAction, showToast, toast, setToast,
    router, page, setPage, today,
    modal, setModal, previewHTML, setPreviewHTML,
    chatInput, setChatInput, chatMessages, setChatMessages,
    contractCorpName, setContractCorpName, contractType, setContractType,
    contractMarkup, setContractMarkup, contractTerms, setContractTerms,
    /* Forms */
    invForm, setInvForm, expForm, setExpForm, corpForm, setCorpForm,
    creditorForm, setCreditorForm, custForm, setCustForm, vendorForm, setVendorForm,
    pkgForm, setPkgForm, brnForm, setBrnForm, empForm, setEmpForm,
    srvForm, setSrvForm, investForm, setInvestForm, settleForm, setSettleForm,
    refundForm, setRefundForm, transferForm, setTransferForm, setForm, setSetForm,
    userForm, setUserForm, portalForm, setPortalForm, tenantForm, setTenantForm,
    profileForm, setProfileForm, payForm, setPayForm, passForm, setPassForm,
    /* Edit IDs */
    editInvId, setEditInvId, editExpId, setEditExpId, editCorpId, setEditCorpId,
    editCredId, setEditCredId, editCustId, setEditCustId, editVendId, setEditVendId,
    editPkgId, setEditPkgId, editBrnId, setEditBrnId, editEmpId, setEditEmpId,
    editSrvId, setEditSrvId, editUserId, setEditUserId,
    /* HTML Generators */
    getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getContractHTML, getMistakeHTML,
    /* Helpers */
    getAirlineCheckInURL, getAIMessage, exportToExcel, loadDrafts, saveDraft, deleteDraft,
    generateInvoiceNo, generateRefundNo,
  };
}
