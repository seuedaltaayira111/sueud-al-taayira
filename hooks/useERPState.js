'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const translations = {
  en: { dashboard:'Dashboard', create:'Create Invoice', list:'Invoices', refunds:'Refunds', customers:'Customers', corporates:'Corporates', creditors:'Creditors', credit:'Credit Balances', vendors:'Vendors', packages:'Packages', branches:'Branches', portals:'Portals', bank:'Bank & Cash', invest:'Investors', hr:'Human Resources', users:'Users', settings:'Settings', reports:'Reports', audit:'Audit Logs', statements:'Statements', contract:'Corporate Contract', offer:'Corporate Offer', superadmin:'SuperAdmin', profile:'Profile', profitability:'Profitability', notifications:'Notifications', ai_dashboard:'AI Dashboard', quotations:'Quotations', hr_advanced:'HR & Payroll', ai_pricing:'AI Pricing', my_attendance:'My Attendance', credit_limits:'Credit Limits', customer_statement:'Customer Statement', refund_statement:'Refund Statement', supplier_statement:'Supplier Statement', multi_branch:'Multi-Branch', recurring_invoices:'Recurring Invoices', expense_approval:'Expense Approval', staff_mistakes:'Staff Mistakes', expenses:'Expenses', editInvoice:'Edit Invoice', generateInvoice:'Generate Invoice', updateInvoice:'Update Invoice', custType:'Customer Type', individual:'Individual', corporate:'Corporate', selectCustomer:'Select Customer', customerPhone:'Customer Phone', passengers:'Passengers', addPassenger:'+ Add Passenger', portal:'Portal', service:'Service', flightTicket:'Flight Ticket', hotel:'Hotel Booking', tourPackage:'Tour Package', visitVisa:'Visit Visa', umrahVisa:'Umrah Visa', newService:'New Service', flightType:'Flight Type', domestic:'Domestic', international:'International', airline:'Airline', sector:'Sector', pnr:'PNR', ticketNo:'Ticket No', qty:'Quantity', cost:'Cost', sell:'Sell', discount:'Discount', vatRate:'VAT Rate', invoiceDate:'Invoice Date', bookingType:'Booking Type', newBooking:'New Booking', reissue:'Reissue', extraLuggage:'Extra Luggage', previousBooking:'Previous Booking', salesPerson:'Sales Person', paymentMethod:'Payment Method', cash:'Cash', bankTransfer:'Bank Transfer', card:'Card / Network', credit:'Credit', creditBalance:'Credit Balance', tabby:'Tabby', tamara:'Tamara', paidAmount:'Paid Amount', invNo:'Inv No', total:'Total', due:'Due', method:'Method', actions:'Actions', preview:'Preview', print:'Print', edit:'Edit', delete:'Delete', refund:'Refund', quickSettle:'Settle', download_excel:'Export Excel', save:'Save', add:'Add', search:'Search...', changePass:'Change Password', logout:'Logout', selectEmployee:'Select Employee', attendanceDate:'Date', status:'Status', present:'Present', leave:'Leave', absent:'Absent', checkInTime:'Check-In', checkOutTime:'Check-Out', overtime:'OT', deduction:'Deduction', mark:'Mark', baseSalary:'Base Salary', commission:'Commission %', advDed:'Adv. Deduct', gift:'Gift/Bonus', month:'Month', mode:'Mode', paySalary:'Pay Salary', generateSlip:'Generate Slip', target:'Target (SAR)', achieved:'Achieved', percentage:'%', balance:'Balance' },
  ar: { dashboard:'لوحة التحكم', create:'إنشاء فاتورة', list:'الفواتير', refunds:'الاسترجاعات', customers:'العملاء', corporates:'الشركات', creditors:'الدائنون', credit:'أرصدة مستحقة', vendors:'الموردون', packages:'الباقات', branches:'الفروع', portals:'البوابات', bank:'البنك والصندوق', invest:'المستثمرون', hr:'الموارد البشرية', users:'المستخدمون', settings:'الإعدادات', reports:'التقارير', audit:'سجل التدقيق', statements:'كشوفات', contract:'عقد شركات', offer:'عرض شركات', superadmin:'المدير العام', profile:'الملف الشخصي', profitability:'الربحية', notifications:'الإشعارات', ai_dashboard:'لوحة ذكية', quotations:'عروض أسعار', hr_advanced:'الرواتب', ai_pricing:'تسعير ذكي', my_attendance:'حضوري', credit_limits:'حدود الائتمان', customer_statement:'كشف عميل', refund_statement:'كشف استرجاع', supplier_statement:'كشف مورد', multi_branch:'متعدد الفروع', recurring_invoices:'فواتير متكررة', expense_approval:'اعتماد مصروفات', staff_mistakes:'أخطاء الموظفين', expenses:'المصروفات', editInvoice:'تعديل الفاتورة', generateInvoice:'إنشاء الفاتورة', updateInvoice:'تحديث الفاتورة', custType:'نوع العميل', individual:'فرد', corporate:'شركة', selectCustomer:'اختر العميل', customerPhone:'هاتف العميل', passengers:'الركاب', addPassenger:'+ إضافة راكب', portal:'البوابة', service:'الخدمة', flightTicket:'تذكرة طيران', hotel:'حجز فندق', tourPackage:'باقة سياحية', visitVisa:'تأشيرة زيارة', umrahVisa:'تأشيرة عمرة', newService:'خدمة جديدة', flightType:'نوع الرحلة', domestic:'داخلي', international:'دولي', airline:'خط الطيران', sector:'القطاع', pnr:'رقم الحجز', ticketNo:'رقم التذكرة', qty:'الكمية', cost:'التكلفة', sell:'البيع', discount:'الخصم', vatRate:'نسبة الضريبة', invoiceDate:'تاريخ الفاتورة', bookingType:'نوع الحجز', newBooking:'حجز جديد', reissue:'إعادة إصدار', extraLuggage:'أمتعة إضافية', previousBooking:'حجز سابق', salesPerson:'موظف المبيعات', paymentMethod:'طريقة الدفع', cash:'نقداً', bankTransfer:'تحويل بنكي', card:'بطاقة', credit:'آجل', creditBalance:'رصيد مستحق', tabby:'تابي', tamara:'تمارة', paidAmount:'المبلغ المدفوع', invNo:'رقم الفاتورة', total:'الإجمالي', due:'المتبقي', method:'الطريقة', actions:'إجراءات', preview:'معاينة', print:'طباعة', edit:'تعديل', delete:'حذف', refund:'استرجاع', quickSettle:'تسوية', download_excel:'تصدير', save:'حفظ', add:'إضافة', search:'بحث...', changePass:'تغيير كلمة المرور', logout:'تسجيل خروج', selectEmployee:'اختر الموظف', attendanceDate:'التاريخ', status:'الحالة', present:'حاضر', leave:'إجازة', absent:'غائب', checkInTime:'وقت الحضور', checkOutTime:'وقت الانصراف', overtime:'إضافي', deduction:'خصم', mark:'تسجيل', baseSalary:'الراتب الأساسي', commission:'العمولة %', advDed:'خصم سلفة', gift:'هدية/مكافأة', month:'الشهر', mode:'الطريقة', paySalary:'دفع الراتب', generateSlip:'إنشاء قسيمة', target:'الهدف (ريال)', achieved:'المحقق', percentage:'%', balance:'الرصيد' }
};

/* ═══════════ AIRLINE CHECK-IN URL MAPPER ═══════════ */
const getAirlineCheckInURL = (airline, pnr) => {
  if (!airline || !pnr) return null;
  const a = airline.toLowerCase();
  const urls = {
    'saudia':`https://www.saudia.com/check-in?pnr=${pnr}`,'sv':`https://www.saudia.com/check-in?pnr=${pnr}`,
    'flynas':`https://www.flynas.com/en/manage-booking?ref=${pnr}`,'xy':`https://www.flynas.com/en/manage-booking?ref=${pnr}`,
    'flyadeal':`https://www.flyadeal.com/en/manage-booking?ref=${pnr}`,'f3':`https://www.flyadeal.com/en/manage-booking?ref=${pnr}`,
    'gulf air':`https://www.gulfair.com/check-in?pnr=${pnr}`,'gf':`https://www.gulfair.com/check-in?pnr=${pnr}`,
    'emirates':`https://www.emirates.com/manage-booking/retrieve-check-in?pnr=${pnr}`,'ek':`https://www.emirates.com/manage-booking/retrieve-check-in?pnr=${pnr}`,
    'etihad':`https://www.etihad.com/en-us/manage-booking/check-in?pnr=${pnr}`,'ey':`https://www.etihad.com/en-us/manage-booking/check-in?pnr=${pnr}`,
    'qatar':`https://www.qatarairways.com/en/check-in.html?pnr=${pnr}`,'qr':`https://www.qatarairways.com/en/check-in.html?pnr=${pnr}`,
    'egyptair':`https://www.egyptair.com/en/Manage-Booking/Check-In?pnr=${pnr}`,'ms':`https://www.egyptair.com/en/Manage-Booking/Check-In?pnr=${pnr}`,
    'royal jordanian':`https://www.rj.com/en/manage-booking?pnr=${pnr}`,'rj':`https://www.rj.com/en/manage-booking?pnr=${pnr}`,
    'middle east':`https://www.meairlines.com/en/ManageBooking?pnr=${pnr}`,'me':`https://www.meairlines.com/en/ManageBooking?pnr=${pnr}`,
    'pakistan':`https://www.piac.com.pk/manage-booking?pnr=${pnr}`,'pk':`https://www.piac.com.pk/manage-booking?pnr=${pnr}`,
    'oman air':`https://www.omanair.com/manage-booking?pnr=${pnr}`,'wy':`https://www.omanair.com/manage-booking?pnr=${pnr}`,
    'kuwait':`https://www.kuwaitairways.com/en/manage-booking?pnr=${pnr}`,
    'air arabia':`https://www.airarabia.com/manage-booking?pnr=${pnr}`,'g9':`https://www.airarabia.com/manage-booking?pnr=${pnr}`,
    'wizz air':`https://wizzair.com/en-gb/manage-booking?pnr=${pnr}`,'w6':`https://wizzair.com/en-gb/manage-booking?pnr=${pnr}`,
    'pegasus':`https://www.flypgs.com/en/manage-booking?pnr=${pnr}`,'pc':`https://www.flypgs.com/en/manage-booking?pnr=${pnr}`,
    'turkish':`https://www.turkishairlines.com/en-us/check-in?pnr=${pnr}`,'tk':`https://www.turkishairlines.com/en-us/check-in?pnr=${pnr}`,
    'indigo':`https://www.goindigo.in/manage-booking?pnr=${pnr}`,'6e':`https://www.goindigo.in/manage-booking?pnr=${pnr}`,
    'spicejet':`https://www.spicejet.com/manage-booking?pnr=${pnr}`,'sg':`https://www.spicejet.com/manage-booking?pnr=${pnr}`,
    'air india':`https://www.airindia.in/manage-booking?pnr=${pnr}`,'ai':`https://www.airindia.in/manage-booking?pnr=${pnr}`,
    'air cairo':`https://www.aircairo.com/en/manage-booking?pnr=${pnr}`,
    'nile air':`https://www.nileair.com/en/manage-booking?pnr=${pnr}`,'np':`https://www.nileair.com/en/manage-booking?pnr=${pnr}`,
    'salam air':`https://www.salamair.com/manage-booking?pnr=${pnr}`,'ov':`https://www.salamair.com/manage-booking?pnr=${pnr}`,
    'jazeera':`https://www.jazeeraairways.com/en/manage-booking?ref=${pnr}`,'j9':`https://www.jazeeraairways.com/en/manage-booking?ref=${pnr}`,
    'flydubai':`https://www.flydubai.com/en/manage-booking?ref=${pnr}`,'fz':`https://www.flydubai.com/en/manage-booking?ref=${pnr}`,
    'virgin':`https://www.virginatlantic.com/check-in?pnr=${pnr}`,'vs':`https://www.virginatlantic.com/check-in?pnr=${pnr}`,
  };
  for (const [key, url] of Object.entries(urls)) {
    if (a.includes(key)) return url;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(airline + ' online check in pnr ' + pnr)}`;
};

/* ═══════════ AI FOOTER MESSAGES ═══════════ */
const getAIMessage = (inv, lang = 'en') => {
  const messages = [
    { en: "✈️ Wishing you a wonderful journey! Safe travels.", ar: "✈️ نتمنى لك رحلة سعيدة! سفر آمن." },
    { en: "🌟 Your trust means the world to us. Amazing trip!", ar: "🌟 ثقتكم تعني لنا كل شيء. رحلة رائعة!" },
    { en: "🏔️ Explore the world with confidence. We're here!", ar: "🏔️ استكشف العالم بثقة. نحن هنا!" },
    { en: "🕌 Wishing you a blessed and safe journey.", ar: "🕌 نتمنى لك رحلة مباركة وسفر آمن." },
    { en: "🌴 Whether business or leisure, enjoy your trip!", ar: "🌴 سواء أعمال أو ترفيه، استمتعوا!" },
    { en: "💎 Premium service, unforgettable experiences.", ar: "💎 خدمة مميزة، تجارب لا تُنسى." },
    { en: "🌏 The world is your destination. Let us help!", ar: "🌏 العالم وجهتكم. دعونا نساعد!" },
    { en: "⭐ Your satisfaction is our mission. Safe travels!", ar: "⭐ رضاكم مهمتنا. سفر آمن!" },
    { en: "🎭 Making travel dreams come true!", ar: "🎭 نحقق أحلام سفركم!" },
    { en: "🌅 New horizons await! Thank you!", ar: "🌅 آفاق جديدة تنتظركم! شكراً!" },
    { en: "🏨 From flights to hotels, we've got you!", ar: "🏨 من الرحلات إلى الفنادق، نحن هنا!" },
    { en: "🎊 Another successful booking. Safe travels!", ar: "🎊 حجز ناجح. سفر آمن!" },
  ];
  const idx = (inv.id?.charCodeAt(0) || 0) % messages.length;
  const msg = messages[idx];
  return lang === 'ar' ? msg.ar : msg.en;
};

/* ═══════════════════════════════════════════════════════════════════════════
   INVOICE HTML — SINGLE PAGE (A4: 210mm × 297mm)
   ═══════════════════════════════════════════════════════════════════════════ */
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const checkInURL = getAirlineCheckInURL(inv.airline, inv.pnr);
  const invoicePageURL = `https://sueud-al-taayira.vercel.app/invoice/${no}`;
  const barcodeData = checkInURL || `https://www.google.com/search?q=${encodeURIComponent((inv.airline||'')+' check in '+(inv.pnr||''))}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=2&height=35&barcolor=0c1d3a&backgroundcolor=ffffff&includetext=false`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(invoicePageURL)}`;
  const ts = inv.total_sell || 0, disc = inv.discount || 0, sub = ts + disc;
  const vr = inv.vat > 0 && ts > 0 ? Math.round((inv.vat / ts) * 100) : 0;
  const vat = inv.vat || 0, tot = inv.total || 0, paid = inv.paid_amount || 0;
  const uc = inv.used_credit || 0, cr = inv.cash_return || 0;
  const cp = paid - uc - cr, due = inv.due_amount || 0;
  const up = (inv.qty || 1) > 0 ? ts / inv.qty : ts;
  const st2 = inv.status || (due > 0 ? 'Unpaid' : 'Paid');
  let pd = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit' && inv.credit_due_date) pd = `Credit (Due: ${inv.credit_due_date})`;
  const isRe = inv.booking_type === 'Reissue' || inv.booking_type === 'Previous Booking';
  const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A';
  const aiMsg = getAIMessage(inv, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Invoice ${no}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
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
.im{min-width:160px;background:rgba(255,255,255,0.06);padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);text-align:${isRTL?'left':'right'}}
.im h3{font-size:18px;font-weight:800;color:#fbbf24;text-transform:uppercase;line-height:1;margin:0}
.im h3 span{font-size:9px;font-family:'Cairo';display:block;margin:2px 0 0;color:rgba(255,255,255,0.8)}
.mr{display:flex;justify-content:space-between;margin-top:3px;font-size:8px;border-bottom:1px dashed rgba(255,255,255,0.15);padding-bottom:2px}
.mr .l{color:rgba(255,255,255,0.6)}.mr .v{color:#fbbf24;font-weight:700}
.sb{display:inline-block;padding:3px 10px;border-radius:12px;font-size:8px;font-weight:700;margin-top:5px;${st2==='Unpaid'?'background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)':'background:rgba(52,211,153,0.2);color:#34d399;border:1px solid rgba(52,211,153,0.3)'}}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 16px;background:#f0f4ff;border-bottom:1px solid #e2e8f0}
.comp-det .ci{display:flex;flex-direction:column;gap:0}
.comp-det .cl{font-size:7px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.3px}
.comp-det .cv{font-size:8px;color:#0f172a;font-weight:600}
.body{padding:8px 16px;flex:1;display:flex;flex-direction:column;gap:6px}
.sec-title{font-size:8px;font-weight:700;text-transform:uppercase;color:#0c1d3a;margin-bottom:4px;border-bottom:1.5px solid #0c1d3a;padding-bottom:3px;display:flex;justify-content:space-between;align-items:center}
.sec-title span{font-family:'Cairo';font-size:8px;color:#1a365d}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.ib{padding:6px 8px;background:#f8fafc;border-radius:5px;border:1px solid #e2e8f0;border-left:3px solid #1a365d}
.ir{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #f1f5f9}
.ir:last-child{border:none}.ir .l{color:#64748b}.ir .v{color:#0f172a;font-weight:600;text-align:${isRTL?'left':'right'};max-width:65%;word-break:break-word}
.rb{padding:6px 8px;background:#fffbeb;border-radius:5px;border:1px solid #fde68a}
.rt{font-size:9px;font-weight:700;color:#d97706;margin-bottom:5px;display:flex;justify-content:space-between;background:#fef3c7;padding:4px 8px;border-radius:4px}
.rt span{font-family:'Cairo';font-size:8px}
.rg{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.ri{background:#fff;padding:3px 6px;border-radius:4px;border:1px solid #fde68a}
.ri .l{font-size:7px;color:#92400e;font-weight:600;text-transform:uppercase}.ri .v{font-size:8px;color:#78350f;font-weight:700;margin-top:1px}
.rf{background:#dcfce7;border-color:#86efac;grid-column:span 3;display:flex;justify-content:space-between;align-items:center;padding:4px 8px;border-radius:4px}
.rf .l{color:#059669;font-size:8px}.rf .v{color:#047857;font-size:12px;font-weight:800}
table{width:100%;border-collapse:collapse;border-radius:5px;overflow:hidden;border:1px solid #e2e8f0}
thead th{padding:5px 6px;background:#0c1d3a;color:#fbbf24;font-size:7px;text-transform:uppercase;text-align:${isRTL?'right':'left'};letter-spacing:0.3px;border-bottom:1.5px solid #fbbf24}
thead th span{font-family:'Cairo';font-size:7px;opacity:0.8;display:block}
thead th.r{text-align:${isRTL?'left':'right'}}thead th.c{text-align:center}
tbody td{padding:4px 6px;border-bottom:1px solid #f1f5f9;font-size:8px}
tbody td.r{text-align:${isRTL?'left':'right'};font-weight:600}tbody td.c{text-align:center}
tbody tr:last-child td{border-bottom:none}
.bs{display:grid;grid-template-columns:1.5fr 1fr;gap:6px}
.pb{padding:6px 8px;background:#f8fafc;border-radius:5px;border:1px solid #e2e8f0}
.pr{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px dashed #cbd5e1}
.pr:last-child{border:none}
.tb{background:#0c1d3a;border-radius:5px;padding:8px 10px;color:#fff;align-self:flex-start}
.tr{display:flex;justify-content:space-between;padding:2px 0;font-size:8px;color:rgba(255,255,255,0.8)}
.gt{display:flex;justify-content:space-between;padding:6px 0 0;margin-top:4px;border-top:1.5px solid rgba(255,255,255,0.15);font-size:13px;font-weight:800;color:#fff}
.gt .v{color:#fbbf24}
.terms{padding:5px 8px;background:#f8fafc;border-radius:4px;border:1px solid #e2e8f0}
.terms h4{font-size:7px;color:#64748b;margin:0 0 2px;text-transform:uppercase;letter-spacing:0.5px}
.terms p{font-size:7px;color:#94a3b8;line-height:1.5;margin:0}
.ft{padding:6px 16px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #e2e8f0;gap:8px;margin-top:auto}
.code-box{display:flex;align-items:center;gap:6px}
.barcode-img{height:28px;width:auto;min-width:160px;border:1px solid #e2e8f0;padding:1px 4px;background:#fff;border-radius:2px}
.qr-img{height:36px;width:36px;border:1px solid #e2e8f0;padding:1px;background:#fff;border-radius:3px}
.code-label{font-size:6px;font-weight:700;text-transform:uppercase;text-align:center;letter-spacing:0.2px;color:#475569;line-height:1.2}
.code-label span{font-family:'Cairo';display:block;font-size:6px;color:#0c1d3a}
.code-label.checkin{color:#059669}.code-label.checkin span{color:#047857}
.code-label.download{color:#2563eb}.code-label.download span{color:#1d4ed8}
.ft-divider{width:1px;background:#cbd5e1;align-self:stretch;min-height:40px}
.ai-msg{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:6px;border:1px solid #93c5fd}
.ai-msg p{font-size:8px;color:#1e3a8a;margin:0;line-height:1.4;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:8px;margin-top:1px}
.ai-label{font-size:6px;color:#3b82f6;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px}
.ft-info{width:70px;text-align:center}
.ft-info p{font-size:6px;color:#94a3b8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none;border-radius:0;box-shadow:none}}
</style></head><body>
<div class="inv">
<div class="hdr">
  <div class="cblk">
    ${st.logo_url?`<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>`:'<div class="logo" style="display:flex;align-items:center;justify-content:center;font-size:20px">✈️</div>'}
    <div class="ct">
      <h2>${st.company_name_ar||'صعود الطائرة للسفر والسياحة'}</h2>
      <h1>${st.company_name_en||'SUEUD AL TAAYIRA TRAVEL & TOURISM'}</h1>
      <p>${st.address_ar||'Address'} ${st.phone?'| '+st.phone:''} ${st.website?'| '+st.website:''}</p>
    </div>
  </div>
  <div class="im">
    <h3>TAX INVOICE<span>فاتورة ضريبية</span></h3>
    <div class="mr"><span class="l">Inv No / رقم</span><span class="v">${no}</span></div>
    <div class="mr"><span class="l">Date / التاريخ</span><span class="v">${inv.invoice_date||''}</span></div>
    <div class="mr"><span class="l">Booking / الحجز</span><span class="v">${inv.booking_date||''}</span></div>
    <div class="sb">${st2==='Unpaid'?'UNPAID / غير مدفوعة':'PAID / مدفوعة'}</div>
  </div>
</div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${st.license_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic. / ترخيص سياحة</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div>
</div>
<div class="body">
  <div class="dg">
    <div class="ib">
      <div class="sec-title">BILL TO / فاتورة إلى<span></span></div>
      <div class="ir"><span class="l">Name / الاسم</span><span class="v">${inv.customers?.name||inv.corporates?.name||'N/A'}</span></div>
      <div class="ir"><span class="l">Phone / الهاتف</span><span class="v">${inv.customers?.phone||'N/A'}</span></div>
      ${inv.corporates?.vat_no?`<div class="ir"><span class="l">VAT / ضريبي</span><span class="v">${inv.corporates.vat_no}</span></div>`:''}
      <div class="ir"><span class="l">Sales Person / موظف</span><span class="v">${inv.employees?.name||'N/A'}</span></div>
      <div class="ir"><span class="l">Passengers / الركاب</span><span class="v" style="font-size:7px;line-height:1.4">${pax}</span></div>
    </div>
    <div class="ib" style="border-left-color:#f59e0b;${isRTL?'border-left:1px solid #e2e8f0;border-right:3px solid #f59e0b':''}">
      <div class="sec-title">FLIGHT DETAILS / تفاصيل الرحلة<span></span></div>
      <div class="ir"><span class="l">Airline / الخطوط</span><span class="v">${inv.airline||'N/A'}</span></div>
      <div class="ir"><span class="l">Sector / القطاع</span><span class="v">${inv.flight_sector||'N/A'}</span></div>
      <div class="ir"><span class="l">Type / النوع</span><span class="v">${inv.flight_type||'N/A'}</span></div>
      <div class="ir"><span class="l">Journey / الرحلة</span><span class="v">${inv.flight_journey||'N/A'}</span></div>
      <div class="ir"><span class="l">PNR / رقم الحجز</span><span class="v" style="color:#2563eb;font-weight:700">${inv.pnr||'N/A'}</span></div>
      <div class="ir"><span class="l">Ticket No / التذكرة</span><span class="v">${inv.ticket_no||'N/A'}</span></div>
      <div class="ir"><span class="l">Refundable / قابلة للاسترجاع</span><span class="v">${inv.refundable_status||'N/A'}</span></div>
      <div class="ir"><span class="l">Service / الخدمة</span><span class="v">${inv.service_type||'N/A'}</span></div>
    </div>
  </div>
  ${isRe?`<div class="rb"><div class="rt"><span>⚠️ PREVIOUS BOOKING / الحجز السابق</span><span>تفاصيل</span></div><div class="rg">
    <div class="ri"><div class="l">Old Date</div><div class="v">${inv.old_booking_date||'N/A'}</div></div>
    <div class="ri"><div class="l">Old Airline</div><div class="v">${inv.old_airline||'N/A'}</div></div>
    <div class="ri"><div class="l">Old Sector</div><div class="v">${inv.old_sector||'N/A'}</div></div>
    <div class="ri"><div class="l">Old PNR</div><div class="v">${inv.old_pnr||'N/A'}</div></div>
    <div class="ri"><div class="l">Old Ticket</div><div class="v">${inv.old_ticket_no||'N/A'}</div></div>
    <div class="ri"><div class="l">Old Type</div><div class="v">${inv.old_flight_type||'N/A'}</div></div>
    <div class="rf"><div class="l">Original Fare / الأجرة الأصلية</div><div class="v">${parseFloat(inv.old_sell_price||0).toFixed(2)} SAR</div></div>
  </div></div>`:''}
  <table>
    <thead><tr>
      <th>Description<span>الوصف</span></th>
      <th class="c">Qty<span>الكمية</span></th>
      <th class="r">Unit Price<span>سعر الوحدة</span></th>
      <th class="r">Total<span>الإجمالي</span></th>
    </tr></thead>
    <tbody>
      <tr><td>${inv.sector||inv.service_type||'Service'}</td><td class="c">${inv.qty||1}</td><td class="r">${up.toFixed(2)}</td><td class="r">${ts.toFixed(2)}</td></tr>
      ${disc>0?`<tr style="background:#f0fdf4"><td colspan="3" style="text-align:${isRTL?'left':'right'};color:#059669">Discount / خصم</td><td class="r" style="color:#059669">- ${disc.toFixed(2)}</td></tr>`:''}
    </tbody>
  </table>
  <div class="bs">
    <div class="pb">
      <div class="sec-title">PAYMENT BREAKDOWN / تفصيل الدفع<span></span></div>
      <div class="pr"><span>Subtotal / المجموع الفرعي</span><span style="font-weight:600">${sub.toFixed(2)} SAR</span></div>
      ${disc>0?`<div class="pr" style="color:#059669"><span>Discount / خصم</span><span>- ${disc.toFixed(2)} SAR</span></div>`:''}
      <div class="pr"><span>VAT (${vr}%) / ضريبة</span><span>${vat.toFixed(2)} SAR</span></div>
      ${uc>0?`<div class="pr" style="color:#7c3aed"><span>Credit Used / رصيد مستخدم</span><span>- ${uc.toFixed(2)} SAR</span></div>`:''}
      ${cr>0?`<div class="pr" style="color:#ef4444"><span>Cash Returned / مردود</span><span>- ${cr.toFixed(2)} SAR</span></div>`:''}
      <div class="pr" style="border-top:1.5px solid #cbd5e1;margin-top:3px;padding-top:3px;font-weight:700"><span>Paid (${pd}) / مدفوع</span><span style="color:#059669">${cp.toFixed(2)} SAR</span></div>
      <div class="pr" style="font-weight:700;font-size:10px"><span>Due / المتبقي</span><span style="color:${due>0?'#ef4444':'#059669'}">${due.toFixed(2)} SAR</span></div>
    </div>
    <div class="tb">
      <div class="tr"><span>Subtotal / المجموع الفرعي</span><span>${sub.toFixed(2)}</span></div>
      ${disc>0?`<div class="tr" style="color:#34d399"><span>Discount / خصم</span><span>- ${disc.toFixed(2)}</span></div>`:''}
      <div class="tr"><span>VAT (${vr}%) / ضريبة</span><span>${vat.toFixed(2)}</span></div>
      <div class="gt"><span>GRAND TOTAL</span><span class="v">${tot.toFixed(2)} SAR</span></div>
    </div>
  </div>
  <div class="terms">
    <h4>Terms / الشروط</h4>
    <p>1. Bookings subject to airline/hotel terms. الحجوزات تخضع لشروط الخطوط/الفنادق &nbsp; 2. Cancellation policies vary. سياسات الإلغاء تختلف &nbsp; 3. Computer-generated - valid without signature. مستند آلي صالح بدون توقيع &nbsp; 4. Prices in SAR incl. VAT. الأسعار بالريال شاملة الضريبة &nbsp; 5. Electronic invoice under Fatoorah regulations. فاتورة إلكترونية بموجب لوائح فاتورة</p>
  </div>
</div>
<div class="ft">
  <div class="code-box">
    <img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/>
    <div class="code-label checkin">CHECK-IN<span>تسجيل</span></div>
    <img src="${qr}" alt="QR" class="qr-img" crossorigin="anonymous"/>
    <div class="code-label download">INVOICE<span>فاتورة</span></div>
  </div>
  <div class="ft-divider"></div>
  <div class="ai-msg">
    <div class="ai-label">🤖 AI</div>
    <p>${aiMsg}<span>${lang==='ar'?'✈️ رحلة سعيدة!':'Safe flight!'}</span></p>
  </div>
  <div class="ft-divider"></div>
  <div class="ft-info">
    <p style="font-weight:700;color:#0f172a;font-size:7px">${st.company_name_en||'SUEUD AL TAAYIRA'}</p>
    <p>${st.phone||''}</p>
    <p style="font-family:'Cairo';font-size:7px">${st.company_name_ar||''}</p>
    <p style="color:#cbd5e1;margin-top:2px">${st.vat_no?'VAT: '+st.vat_no:''}</p>
  </div>
</div>
</div></body></html>`;
};

/* ═══════════ REFUND HTML — SINGLE PAGE ═══════════ */
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
  let rm = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit') rm = 'Credit for New Booking / رصيد لحجز جديد';
  const aiMsg = getAIMessage(inv, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Refund ${no}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.inv{width:210mm;height:297mm;margin:auto;border:2px solid #7f1d1d;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7f1d1d,#991b1b,#dc2626,#7f1d1d)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7f1d1d,#dc2626,#991b1b,#7f1d1d)}
.hdr{display:flex;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#7f1d1d,#991b1b);color:#fff;gap:12px;margin-top:5px}
.cblk{display:flex;gap:10px;flex:1;align-items:center}
.logo{width:50px;height:50px;object-fit:cover;border-radius:6px;background:rgba(255,255,255,0.1);padding:2px;border:1px solid rgba(251,191,36,0.3)}
.ct h2{font-size:14px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}
.ct h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1.5px;margin:2px 0 0}
.ct p{font-size:8px;color:rgba(255,255,255,0.6);line-height:1.5;margin:3px 0 0}
.im{min-width:160px;text-align:${isRTL?'left':'right'}}
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
.sec-title span{font-family:'Cairo';font-size:8px;color:#991b1b}
.ib{padding:8px;background:#fff5f5;border-radius:5px;border:1px solid #fecaca;border-left:3px solid #dc2626}
.row{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #fee2e2}
.row:last-child{border:none}.row .l{color:#991b1b;font-weight:500}.row .v{color:#7f1d1d;font-weight:600;text-align:${isRTL?'left':'right'};max-width:65%}
.cb{background:#fff;padding:10px;border-radius:5px;border:1px solid #e2e8f0}
.ct2{font-size:8px;text-transform:uppercase;color:#dc2626;margin-bottom:5px;border-bottom:1.5px solid #fecaca;padding-bottom:3px;font-weight:700}
.ct2 span{font-family:'Cairo'}
.cr{display:flex;justify-content:space-between;padding:4px 0;font-size:9px;color:#334155;border-bottom:1px dashed #e2e8f0}
.cr:last-child{border:none}.cr.deduct{color:#ef4444}
.cr.total{padding-top:6px;margin-top:5px;border-top:1.5px solid #dc2626;font-size:14px;font-weight:800;color:#059669;border-bottom:none}
.pi{padding:6px 8px;background:#f8fafc;border-radius:5px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;font-size:9px}
.ft{padding:8px 16px;background:linear-gradient(135deg,#fff5f5,#fef2f2);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #fecaca;gap:8px;margin-top:auto}
.code-box{display:flex;align-items:center;gap:6px}
.qr-img{height:36px;width:36px;border:1px solid #fecaca;padding:1px;background:#fff;border-radius:3px}
.code-label{font-size:6px;font-weight:700;text-transform:uppercase;text-align:center;color:#991b1b}
.code-label span{font-family:'Cairo';display:block;font-size:6px}
.ft-divider{width:1px;background:#fecaca;align-self:stretch;min-height:40px}
.ai-msg{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#fef2f2,#fee2e2);border-radius:6px;border:1px solid #fca5a5}
.ai-msg p{font-size:8px;color:#7f1d1d;margin:0;line-height:1.4;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:8px;margin-top:1px}
.ai-label{font-size:6px;color:#dc2626;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.ft-info{width:70px;text-align:center}
.ft-info p{font-size:6px;color:#94a3b8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none}}
</style></head><body>
<div class="inv">
<div class="hdr">
  <div class="cblk">
    ${st.logo_url?`<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>`:'<div class="logo" style="display:flex;align-items:center;justify-content:center;font-size:20px">✈️</div>'}
    <div class="ct"><h2>${st.company_name_ar||'صعود الطائرة'}</h2><h1>${st.company_name_en||'SUEUD AL TAAYIRA'}</h1><p>${st.address_ar||''} ${st.phone?'| '+st.phone:''}</p></div>
  </div>
  <div class="im"><h3>REFUND<span>استرجاع</span></h3><div class="ino">No / رقم: <span>${no}</span></div><div class="ino">Date / التاريخ: <span>${inv.refund_date||inv.invoice_date||''}</span></div><div class="sb">PROCESSED / تم</div></div>
</div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${st.license_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div>
</div>
<div class="body">
  <div class="ib">
    <div class="sec-title">BOOKING DETAILS / تفاصيل الحجز<span></span></div>
    <div class="row"><span class="l">Customer / العميل</span><span class="v">${cn}</span></div>
    <div class="row"><span class="l">Phone / الهاتف</span><span class="v">${cp}</span></div>
    <div class="row"><span class="l">Passengers / الركاب</span><span class="v" style="font-size:7px">${pax}</span></div>
    <div class="row"><span class="l">Airline / الخطوط</span><span class="v">${inv.airline||inv.old_airline||'N/A'}</span></div>
    <div class="row"><span class="l">Date / التاريخ</span><span class="v">${inv.invoice_date||'N/A'}</span></div>
    <div class="row"><span class="l">PNR / رقم الحجز</span><span class="v">${inv.pnr||inv.old_pnr||'N/A'}</span></div>
    <div class="row"><span class="l">Reason / السبب</span><span class="v">${inv.refund_reason||'N/A'}</span></div>
  </div>
  <div class="cb">
    <div class="ct2">REFUND CALCULATION / حساب الاسترجاع<span></span></div>
    <div class="cr"><span>Original Fare / الأجرة الأصلية</span><span style="font-weight:600">${of2.toFixed(2)} SAR</span></div>
    <div class="cr deduct"><span>Less: Airline Fees / خصم رسوم الخطوط</span><span style="font-weight:600">- ${airlineFees.toFixed(2)} SAR</span></div>
    <div class="cr"><span>Refund to Portal / استرجاع للبوابة</span><span style="font-weight:600;color:#2563eb">${compRef.toFixed(2)} SAR</span></div>
    <div class="cr total"><span>Refund to Customer / استرجاع للعميل</span><span>${cRef.toFixed(2)} SAR</span></div>
  </div>
  <div class="pi"><span style="font-weight:600;color:#334155">Refund Method / طريقة الاسترجاع</span><span style="font-weight:600;color:#2563eb">${rm}</span></div>
</div>
<div class="ft">
  <div class="code-box"><img src="${qr}" alt="QR" class="qr-img" crossorigin="anonymous"/><div class="code-label">DOWNLOAD<span>تحميل</span></div></div>
  <div class="ft-divider"></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI</div><p>${aiMsg}<span>${lang==='ar'?'🔄 تم الاسترجاع':'Refund processed!'}</span></p></div>
  <div class="ft-divider"></div>
  <div class="ft-info"><p style="font-weight:700;color:#7f1d1d">${st.company_name_en||''}</p><p>${st.phone||''}</p><p style="font-family:'Cairo'">${st.company_name_ar||''}</p></div>
</div>
</div></body></html>`;
};

/* ═══════════ EXPENSE VOUCHER HTML — SINGLE PAGE ═══════════ */
const getExpenseHTML = (exp, s, lang = 'en') => {
  const st = s || {};
  const eno = `EXP-${exp.id?.substring(0,8)||'N/A'}`;
  const items = exp.items?.length > 0 ? exp.items : [{ name: exp.item_name||'Item', qty: 1, price: exp.amount||0 }];
  const aiMsg = getAIMessage(exp, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Expense ${eno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.inv{width:210mm;height:297mm;margin:auto;border:2px solid #7c2d12;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7c2d12,#9a3412,#ea580c,#7c2d12)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7c2d12,#ea580c,#9a3412,#7c2d12)}
.hdr{display:flex;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;margin-top:5px;align-items:center}
.ci h2{font-size:14px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}
.ci h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1.5px;margin:2px 0 0}
.im{text-align:${isRTL?'left':'right'}}
.im h3{font-size:18px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin:0}
.im p{font-size:8px;color:rgba(255,255,255,0.8);margin:3px 0 0}.im p span{color:#fbbf24;font-weight:700}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 16px;background:#fff7ed;border-bottom:1px solid #fed7aa}
.comp-det .ci{display:flex;flex-direction:column;gap:0}
.comp-det .cl{font-size:7px;color:#9a3412;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:8px;color:#7c2d12;font-weight:600}
.body{padding:10px 16px;flex:1;display:flex;flex-direction:column;gap:8px}
.sec-title{font-size:8px;font-weight:700;text-transform:uppercase;color:#7c2d12;margin-bottom:4px;border-bottom:1.5px solid #7c2d12;padding-bottom:3px}
.sec-title span{font-family:'Cairo';font-size:8px;color:#9a3412}
.ib{padding:8px;background:#fff7ed;border-radius:5px;border-left:3px solid #ea580c;border:1px solid #fed7aa}
.row{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #fed7aa}
.row:last-child{border:none}.row .l{color:#9a3412;font-weight:500}.row .v{color:#7c2d12;font-weight:600}
table{width:100%;border-collapse:collapse;border-radius:5px;overflow:hidden;border:1px solid #e2e8f0}
thead th{padding:5px 6px;background:#7c2d12;color:#fbbf24;font-size:7px;text-transform:uppercase;text-align:${isRTL?'right':'left'};letter-spacing:0.5px}
thead th span{font-family:'Cairo';font-size:7px;opacity:0.8;display:block}
thead th.r{text-align:${isRTL?'left':'right'}}
tbody td{padding:4px 6px;border-bottom:1px solid #f1f5f9;font-size:8px}
tbody td.r{text-align:${isRTL?'left':'right'};font-weight:600}
.totals{background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;padding:12px 16px;border-radius:6px;display:flex;justify-content:space-between;align-items:center}
.totals h3{margin:0;text-transform:uppercase;font-size:10px}.totals .amt{font-size:20px;font-weight:800;margin:0;color:#fbbf24}
.ft{padding:8px 16px;background:linear-gradient(135deg,#fff7ed,#ffedd5);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #fed7aa;gap:8px;margin-top:auto}
.ai-msg{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#fff7ed,#fed7aa);border-radius:6px;border:1px solid #fdba74}
.ai-msg p{font-size:8px;color:#7c2d12;margin:0;line-height:1.4;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:8px;margin-top:1px}
.ai-label{font-size:6px;color:#9a3412;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.ft-info{width:70px;text-align:center}
.ft-info p{font-size:6px;color:#94a3b8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none}}
</style></head><body>
<div class="inv">
<div class="hdr"><div class="ci"><h2>${st.company_name_ar||'صعود الطائرة'}</h2><h1>${st.company_name_en||'SUEUD AL TAAYIRA'}</h1></div>
<div class="im"><h3>EXPENSE VOUCHER</h3><p>No: <span>${eno}</span></p><p>Date: <span>${exp.expense_date||''}</span></p></div></div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${st.license_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div>
</div>
<div class="body">
  <div class="ib">
    <div class="sec-title">DETAILS / التفاصيل<span></span></div>
    <div class="row"><span class="l">Type / النوع</span><span class="v">${exp.expense_type||'N/A'}</span></div>
    <div class="row"><span class="l">Payment / الدفع</span><span class="v">${exp.payment_mode||'Cash'}</span></div>
    <div class="row"><span class="l">Description / الوصف</span><span class="v">${exp.description||'N/A'}</span></div>
  </div>
  <table>
    <thead><tr><th>Item / البند<span>الوصف</span></th><th class="r">Qty<span>الكمية</span></th><th class="r">Price<span>السعر</span></th><th class="r">Total<span>المجموع</span></th></tr></thead>
    <tbody>${items.map(it=>`<tr><td>${it.name||'Item'}</td><td class="r">${it.qty||1}</td><td class="r">${parseFloat(it.price||0).toFixed(2)}</td><td class="r">${((parseFloat(it.qty)||0)*(parseFloat(it.price)||0)).toFixed(2)}</td></tr>`).join('')}</tbody>
  </table>
  <div class="totals"><h3>TOTAL / الإجمالي</h3><p class="amt">${(exp.amount||0).toFixed(2)} SAR</p></div>
</div>
<div class="ft">
  <div class="ft-info"><p style="font-weight:700;color:#7c2d12">${st.company_name_en||''}</p><p>${st.phone||''}</p><p style="font-family:'Cairo'">${st.company_name_ar||''}</p></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI</div><p>${aiMsg}<span>${lang==='ar'?'📝 سند مصروفات':'Expense voucher'}</span></p></div>
  <div style="width:70px"></div>
</div>
</div></body></html>`;
};

/* ═══════════ SALARY SLIP HTML — SINGLE PAGE ═══════════ */
const getSalarySlipHTML = (pay, s, lang = 'en') => {
  const st = s || {};
  const sno = `SLIP-${pay.id?.substring(0,8)||'N/A'}`;
  const gross = (pay.base_salary||0)+(pay.commission_amount||0)+(pay.overtime||0)+(pay.gift||0);
  const tded = (pay.advance_deduction||0)+(pay.mistakes_deduction||0)+(pay.other_deduction||0);
  const net = gross - tded;
  const aiMsg = getAIMessage(pay, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Slip ${sno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.slip{width:210mm;height:297mm;margin:auto;border:2px solid #0F172A;display:flex;flex-direction:column;position:relative;overflow:hidden}
.slip::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0F172A,#1E3A8A,#2563EB,#0F172A)}
.slip::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0F172A,#2563EB,#1E3A8A,#0F172A)}
.hdr{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;margin-top:5px}
.hdr h1{font-size:14px;font-weight:800;color:#FBBF24;margin:0}
.si{text-align:${isRTL?'left':'right'}}
.si h3{color:#FBBF24;font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;margin:0}
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
.ai-msg p span{font-family:'Cairo';display:block;font-size:8px;margin-top:1px}
.ai-label{font-size:6px;color:#3B82F6;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.ft-info{width:70px;text-align:center}
.ft-info p{font-size:6px;color:#94A3B8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.slip{border:none}}
</style></head><body>
<div class="slip">
<div class="hdr"><h1>${st.company_name_ar||'صعود الطائرة'}</h1>
<div class="si"><h3>SALARY SLIP<span>قسيمة راتب</span></h3><p>No: <span>${sno}</span></p><p>Month: <span>${pay.month||'N/A'}</span></p><p>Employee: <span>${pay.employees?.name||'N/A'}</span></p></div></div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${st.license_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div>
</div>
<div class="body">
  <div class="dg">
    <div class="ib earn">
      <div class="sec-title">EARNINGS / الإيرادات</div>
      <div class="row"><span class="l">Base Salary / أساسي</span><span class="v">${(pay.base_salary||0).toFixed(2)}</span></div>
      <div class="row"><span class="l">Commission / عمولة</span><span class="v">${(pay.commission_amount||0).toFixed(2)}</span></div>
      <div class="row"><span class="l">Overtime / إضافي</span><span class="v">${(pay.overtime||0).toFixed(2)}</span></div>
      <div class="row"><span class="l">Gift/Bonus / مكافأة</span><span class="v">${(pay.gift||0).toFixed(2)}</span></div>
      <div class="row" style="font-weight:700;border-top:1px solid #059669;margin-top:3px;padding-top:3px"><span class="l">GROSS / الإجمالي</span><span class="v" style="color:#059669">${gross.toFixed(2)}</span></div>
    </div>
    <div class="ib ded">
      <div class="sec-title">DEDUCTIONS / الخصومات</div>
      <div class="row"><span class="l">Advance / سلفة</span><span class="v">${(pay.advance_deduction||0).toFixed(2)}</span></div>
      <div class="row"><span class="l">Mistakes / أخطاء</span><span class="v">${(pay.mistakes_deduction||0).toFixed(2)}</span></div>
      <div class="row"><span class="l">Other / أخرى</span><span class="v">${(pay.other_deduction||0).toFixed(2)}</span></div>
      <div class="row" style="font-weight:700;border-top:1px solid #EF4444;margin-top:3px;padding-top:3px"><span class="l">TOTAL DED. / إجمالي الخصم</span><span class="v" style="color:#EF4444">${tded.toFixed(2)}</span></div>
    </div>
    <div class="ib" style="border-left:3px solid #2563EB">
      <div class="sec-title" style="color:#2563EB;border-color:#2563EB">SUMMARY / ملخص</div>
      <div class="row"><span class="l">Mode / الطريقة</span><span class="v">${pay.payment_mode||'Cash'}</span></div>
      <div class="row"><span class="l">Working Days</span><span class="v">${pay.working_days||'N/A'}</span></div>
      <div class="row"><span class="l">Leaves / إجازات</span><span class="v">${pay.leaves_taken||0}</span></div>
      <div class="row" style="font-weight:700;border-top:1px solid #2563EB;margin-top:3px;padding-top:3px"><span class="l">NET PAY / صافي</span><span class="v" style="color:#2563EB;font-size:12px">${net.toFixed(2)}</span></div>
    </div>
  </div>
  <div class="totals"><h3>NET SALARY / الراتب الصافي</h3><p class="amt">${net.toFixed(2)} SAR</p></div>
</div>
<div class="ft">
  <div class="ft-info"><p style="font-weight:700;color:#0F172A">${st.company_name_en||''}</p><p>${st.phone||''}</p><p style="font-family:'Cairo'">${st.company_name_ar||''}</p></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI</div><p>${aiMsg}<span>${lang==='ar'?'💰 راتب تم صرفه':'Salary processed'}</span></p></div>
  <div style="width:70px"></div>
</div>
</div></body></html>`;
};

/* ═══════════ HELPERS ═══════════ */
const DRAFT_KEY = 'erp_invoice_draft';

const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(row => headers.map(h => {
    let val = row[h] ?? '';
    if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
      val = `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  }).join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const loadDrafts = () => {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'); }
  catch (e) { return []; }
};

const saveDraft = (draft) => {
  try {
    const drafts = loadDrafts();
    const idx = drafts.findIndex(d => d.id === draft.id);
    if (idx >= 0) drafts[idx] = draft; else drafts.unshift(draft);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts.slice(0, 20)));
  } catch (e) { /* silent */ }
};

const deleteDraft = (id) => {
  try {
    const drafts = loadDrafts().filter(d => d.id !== id);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
  } catch (e) { /* silent */ }
};

const generateInvoiceNo = async () => {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `INV-${y}${m}`;
  try {
    const { data } = await supabase.from('invoices').select('invoice_no').ilike('invoice_no', `${prefix}%`).order('invoice_no', { ascending: false }).limit(1);
    if (data && data.length > 0) {
      const lastNum = parseInt(data[0].invoice_no.split('-').pop() || '0');
      return `${prefix}-${(lastNum + 1).toString().padStart(4, '0')}`;
    }
  } catch (e) { /* fallback */ }
  return `${prefix}-0001`;
};

const generateRefundNo = async () => {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `REF-${y}${m}`;
  try {
    const { data } = await supabase.from('refunds').select('invoice_no').ilike('invoice_no', `${prefix}%`).order('invoice_no', { ascending: false }).limit(1);
    if (data && data.length > 0) {
      const lastNum = parseInt(data[0].invoice_no.split('-').pop() || '0');
      return `${prefix}-${(lastNum + 1).toString().padStart(4, '0')}`;
    }
  } catch (e) { /* fallback */ }
  return `${prefix}-0001`;
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN HOOK
   ═══════════════════════════════════════════════════════════════════════════ */
export default function useERPState() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const t = useMemo(() => translations[lang], [lang]);

  /* ── Auth ── */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Data ── */
  const [invoices, setInvoices] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [branches, setBranches] = useState([]);
  const [portals, setPortals] = useState([]);
  const [bankTransactions, setBankTransactions] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settings, setSettings] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaryPayments, setSalaryPayments] = useState([]);
  const [creditLimits, setCreditLimits] = useState([]);
  const [recurringInvoices, setRecurringInvoices] = useState([]);
  const [quotationRequests, setQuotationRequests] = useState([]);
  const [staffMistakes, setStaffMistakes] = useState([]);
  const [drafts, setDrafts] = useState([]);

  /* ── UI State ── */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [statusFilter, setStatusFilter] = useState('all');

  const refreshDrafts = useCallback(() => setDrafts(loadDrafts()), []);

  /* ── Load Settings ── */
  const loadSettings = useCallback(async () => {
    try {
      const { data } = await supabase.from('company_settings').select('*').limit(1).single();
      if (data) setSettings(data);
    } catch (e) { /* silent */ }
  }, []);

  /* ── Generic Data Loader ── */
  const loadTable = useCallback(async (table, setter, opts = {}) => {
    try {
      let q = supabase.from(table).select(opts.select || '*');
      if (opts.order) q = q.order(opts.order.col, { ascending: opts.order.asc ?? false });
      if (opts.limit) q = q.limit(opts.limit);
      if (opts.eq) { for (const [k, v] of Object.entries(opts.eq)) q = q.eq(k, v); }
      if (opts.ilike) { for (const [k, v] of Object.entries(opts.ilike)) q = q.ilike(k, v); }
      const { data, error } = await q;
      if (!error && data) setter(data);
    } catch (e) { /* silent */ }
  }, []);

  /* ── Load Invoices with joins ── */
  const loadInvoices = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('invoices').select(`
        *, customers(id,name,phone), corporates(id,name,vat_no), employees(id,name)
      `).order('created_at', { ascending: false });
      if (!error && data) setInvoices(data);
    } catch (e) { /* silent */ }
  }, []);

  /* ── Load Refunds with joins ── */
  const loadRefunds = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('refunds').select(`
        *, customers(id,name,phone), invoices(invoice_no)
      `).order('created_at', { ascending: false });
      if (!error && data) setRefunds(data);
    } catch (e) { /* silent */ }
  }, []);

  /* ── Load All ── */
  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      loadSettings(),
      loadInvoices(),
      loadRefunds(),
      loadTable('customers', setCustomers, { order: { col: 'name', asc: true } }),
      loadTable('corporates', setCorporates, { order: { col: 'name', asc: true } }),
      loadTable('employees', setEmployees, { order: { col: 'name', asc: true } }),
      loadTable('expenses', setExpenses, { order: { col: 'created_at', asc: false } }),
      loadTable('vendors', setVendors, { order: { col: 'name', asc: true } }),
      loadTable('packages', setPackages, { order: { col: 'name', asc: true } }),
      loadTable('branches', setBranches, { order: { col: 'name', asc: true } }),
      loadTable('portals', setPortals, { order: { col: 'name', asc: true } }),
      loadTable('bank_transactions', setBankTransactions, { order: { col: 'created_at', asc: false } }),
      loadTable('investors', setInvestors, { order: { col: 'name', asc: true } }),
      loadTable('audit_logs', setAuditLogs, { order: { col: 'created_at', asc: false }, limit: 500 }),
      loadTable('notifications', setNotifications, { order: { col: 'created_at', asc: false }, limit: 100 }),
      loadTable('attendance', setAttendance, { order: { col: 'date', asc: false } }),
      loadTable('salary_payments', setSalaryPayments, { order: { col: 'created_at', asc: false } }),
      loadTable('credit_limits', setCreditLimits),
      loadTable('recurring_invoices', setRecurringInvoices),
      loadTable('quotation_requests', setQuotationRequests),
      loadTable('staff_mistakes', setStaffMistakes),
    ]);
    refreshDrafts();
    setLoading(false);
  }, [loadSettings, loadInvoices, loadRefunds, loadTable, refreshDrafts]);

  /* ── Create Invoice ── */
  const createInvoice = useCallback(async (invData) => {
    const invoiceNo = await generateInvoiceNo();
    const ts = invData.total_sell || 0;
    const disc = invData.discount || 0;
    const vr = invData.vat_rate || 15;
    const vat = Math.round(ts * vr) / 100;
    const total = ts - disc + vat;
    const paid = invData.paid_amount || 0;
    const due = total - paid - (invData.used_credit || 0) + (invData.cash_return || 0);

    const row = {
      ...invData,
      invoice_no: invoiceNo,
      total_sell: ts,
      vat: vat,
      vat_rate: vr,
      total: total,
      due_amount: due,
      status: due <= 0 ? 'Paid' : 'Unpaid',
    };

    const { data, error } = await supabase.from('invoices').insert([row]).select('*, customers(id,name,phone), corporates(id,name,vat_no), employees(id,name)').single();
    if (!error && data) {
      setInvoices(prev => [data, ...prev]);
      /* Update customer credit balance if credit used */
      if (invData.used_credit > 0 && invData.customer_id) {
        await supabase.rpc('deduct_credit', { cust_id: invData.customer_id, amount: invData.used_credit });
      }
      /* Add to bank if cash/bank */
      if (paid > 0 && (invData.payment_method === 'Cash' || invData.payment_method === 'Bank Transfer')) {
        await supabase.from('bank_transactions').insert([{
          type: 'credit', amount: paid, description: `Invoice ${invoiceNo}`, reference: invoiceNo, payment_method: invData.payment_method
        }]);
      }
      /* Audit log */
      await supabase.from('audit_logs').insert([{ action: 'create_invoice', details: invoiceNo, user_id: user?.id }]);
      return data;
    }
    throw error;
  }, [user]);

  /* ── Update Invoice ── */
  const updateInvoice = useCallback(async (id, updates) => {
    const ts = updates.total_sell ?? 0;
    const disc = updates.discount ?? 0;
    const vr = updates.vat_rate ?? 15;
    const vat = Math.round(ts * vr) / 100;
    const total = ts - disc + vat;
    const paid = updates.paid_amount ?? 0;
    const due = total - paid - (updates.used_credit || 0) + (updates.cash_return || 0);

    const row = { ...updates, vat, total, due_amount: due, status: due <= 0 ? 'Paid' : 'Unpaid' };
    const { data, error } = await supabase.from('invoices').update(row).eq('id', id).select('*, customers(id,name,phone), corporates(id,name,vat_no), employees(id,name)').single();
    if (!error && data) {
      setInvoices(prev => prev.map(i => i.id === id ? data : i));
      await supabase.from('audit_logs').insert([{ action: 'update_invoice', details: data.invoice_no, user_id: user?.id }]);
      return data;
    }
    throw error;
  }, [user]);

  /* ── Delete Invoice ── */
  const deleteInvoice = useCallback(async (id) => {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (!error) {
      setInvoices(prev => prev.filter(i => i.id !== id));
      await supabase.from('audit_logs').insert([{ action: 'delete_invoice', details: id, user_id: user?.id }]);
    }
    return !error;
  }, [user]);

  /* ── Quick Settle Invoice ── */
  const settleInvoice = useCallback(async (id, amount, method = 'Cash') => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    const newPaid = (inv.paid_amount || 0) + amount;
    const newDue = (inv.total || 0) - newPaid - (inv.used_credit || 0) + (inv.cash_return || 0);
    return updateInvoice(id, { paid_amount: newPaid, due_amount: Math.max(0, newDue), payment_method: method, status: newDue <= 0 ? 'Paid' : 'Unpaid' });
  }, [invoices, updateInvoice]);

  /* ── Create Refund ── */
  const createRefund = useCallback(async (refData) => {
    const refundNo = await generateRefundNo();
    const row = { ...refData, invoice_no: refundNo };
    const { data, error } = await supabase.from('refunds').insert([row]).select('*, customers(id,name,phone)').single();
    if (!error && data) {
      setRefunds(prev => [data, ...prev]);
      /* Add bank debit for customer refund */
      if (refData.refund_customer > 0) {
        await supabase.from('bank_transactions').insert([{
          type: 'debit', amount: refData.refund_customer, description: `Refund ${refundNo}`, reference: refundNo, payment_method: refData.payment_method || 'Cash'
        }]);
      }
      await supabase.from('audit_logs').insert([{ action: 'create_refund', details: refundNo, user_id: user?.id }]);
      return data;
    }
    throw error;
  }, [user]);

  /* ── Delete Refund ── */
  const deleteRefund = useCallback(async (id) => {
    const { error } = await supabase.from('refunds').delete().eq('id', id);
    if (!error) {
      setRefunds(prev => prev.filter(r => r.id !== id));
      await supabase.from('audit_logs').insert([{ action: 'delete_refund', details: id, user_id: user?.id }]);
    }
    return !error;
  }, [user]);

  /* ── Create Customer ── */
  const createCustomer = useCallback(async (cData) => {
    const { data, error } = await supabase.from('customers').insert([cData]).select().single();
    if (!error && data) { setCustomers(prev => [...prev, data]); return data; }
    throw error;
  }, []);

  const updateCustomer = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('customers').update(updates).eq('id', id).select().single();
    if (!error && data) { setCustomers(prev => prev.map(c => c.id === id ? data : c)); return data; }
    throw error;
  }, []);

  const deleteCustomer = useCallback(async (id) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (!error) setCustomers(prev => prev.filter(c => c.id !== id));
    return !error;
  }, []);

  /* ── Create Corporate ── */
  const createCorporate = useCallback(async (cData) => {
    const { data, error } = await supabase.from('corporates').insert([cData]).select().single();
    if (!error && data) { setCorporates(prev => [...prev, data]); return data; }
    throw error;
  }, []);

  const updateCorporate = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('corporates').update(updates).eq('id', id).select().single();
    if (!error && data) { setCorporates(prev => prev.map(c => c.id === id ? data : c)); return data; }
    throw error;
  }, []);

  const deleteCorporate = useCallback(async (id) => {
    const { error } = await supabase.from('corporates').delete().eq('id', id);
    if (!error) setCorporates(prev => prev.filter(c => c.id !== id));
    return !error;
  }, []);

  /* ── Employee CRUD ── */
  const createEmployee = useCallback(async (eData) => {
    const { data, error } = await supabase.from('employees').insert([eData]).select().single();
    if (!error && data) { setEmployees(prev => [...prev, data]); return data; }
    throw error;
  }, []);

  const updateEmployee = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('employees').update(updates).eq('id', id).select().single();
    if (!error && data) { setEmployees(prev => prev.map(e => e.id === id ? data : e)); return data; }
    throw error;
  }, []);

  const deleteEmployee = useCallback(async (id) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (!error) setEmployees(prev => prev.filter(e => e.id !== id));
    return !error;
  }, []);

  /* ── Expense CRUD ── */
  const createExpense = useCallback(async (eData) => {
    const { data, error } = await supabase.from('expenses').insert([eData]).select().single();
    if (!error && data) {
      setExpenses(prev => [data, ...prev]);
      if (eData.amount > 0) {
        await supabase.from('bank_transactions').insert([{
          type: 'debit', amount: eData.amount, description: `Expense: ${eData.description || eData.expense_type || ''}`, payment_method: eData.payment_mode || 'Cash'
        }]);
      }
      return data;
    }
    throw error;
  }, []);

  const deleteExpense = useCallback(async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) setExpenses(prev => prev.filter(e => e.id !== id));
    return !error;
  }, []);

  /* ── Attendance ── */
  const markAttendance = useCallback(async (aData) => {
    const { data, error } = await supabase.from('attendance').upsert([aData], { onConflict: 'employee_id,date' }).select().single();
    if (!error && data) { setAttendance(prev => { const idx = prev.findIndex(a => a.employee_id === data.employee_id && a.date === data.date); if (idx >= 0) { const n = [...prev]; n[idx] = data; return n; } return [data, ...prev]; }); return data; }
    throw error;
  }, []);

  /* ── Salary Payment ── */
  const paySalary = useCallback(async (pData) => {
    const { data, error } = await supabase.from('salary_payments').insert([pData]).select().single();
    if (!error && data) {
      setSalaryPayments(prev => [data, ...prev]);
      if (pData.net_salary > 0) {
        await supabase.from('bank_transactions').insert([{
          type: 'debit', amount: pData.net_salary, description: `Salary: ${pData.employees?.name || pData.employee_id}`, payment_method: pData.payment_mode || 'Cash'
        }]);
      }
      return data;
    }
    throw error;
  }, []);

  /* ── Bank Transaction ── */
  const createBankTransaction = useCallback(async (bData) => {
    const { data, error } = await supabase.from('bank_transactions').insert([bData]).select().single();
    if (!error && data) { setBankTransactions(prev => [data, ...prev]); return data; }
    throw error;
  }, []);

  const deleteBankTransaction = useCallback(async (id) => {
    const { error } = await supabase.from('bank_transactions').delete().eq('id', id);
    if (!error) setBankTransactions(prev => prev.filter(b => b.id !== id));
    return !error;
  }, []);

  /* ── Update Settings ── */
  const updateSettings = useCallback(async (updates) => {
    const { data, error } = await supabase.from('company_settings').update(updates).eq('id', settings.id).select().single();
    if (!error && data) { setSettings(data); return data; }
    throw error;
  }, [settings.id]);

  /* ── Vendor CRUD ── */
  const createVendor = useCallback(async (vData) => {
    const { data, error } = await supabase.from('vendors').insert([vData]).select().single();
    if (!error && data) { setVendors(prev => [...prev, data]); return data; }
    throw error;
  }, []);

  /* ── Branch CRUD ── */
  const createBranch = useCallback(async (bData) => {
    const { data, error } = await supabase.from('branches').insert([bData]).select().single();
    if (!error && data) { setBranches(prev => [...prev, data]); return data; }
    throw error;
  }, []);

  /* ── Portal CRUD ── */
  const createPortal = useCallback(async (pData) => {
    const { data, error } = await supabase.from('portals').insert([pData]).select().single();
    if (!error && data) { setPortals(prev => [...prev, data]); return data; }
    throw error;
  }, []);

  /* ── Package CRUD ── */
  const createPackage = useCallback(async (pData) => {
    const { data, error } = await supabase.from('packages').insert([pData]).select().single();
    if (!error && data) { setPackages(prev => [...prev, data]); return data; }
    throw error;
  }, []);

  /* ── Quotation CRUD ── */
  const createQuotation = useCallback(async (qData) => {
    const { data, error } = await supabase.from('quotation_requests').insert([qData]).select().single();
    if (!error && data) { setQuotationRequests(prev => [data, ...prev]); return data; }
    throw error;
  }, []);

  /* ── Staff Mistake ── */
  const createStaffMistake = useCallback(async (mData) => {
    const { data, error } = await supabase.from('staff_mistakes').insert([mData]).select().single();
    if (!error && data) { setStaffMistakes(prev => [data, ...prev]); return data; }
    throw error;
  }, []);

  /* ── Dashboard Stats ── */
  const dashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = today.substring(0, 7);
    const todayInvoices = invoices.filter(i => (i.invoice_date || i.created_at?.split('T')[0]) === today);
    const monthInvoices = invoices.filter(i => (i.invoice_date || i.created_at?.split('T')[0])?.startsWith(thisMonth));
    const totalRevenue = monthInvoices.reduce((s, i) => s + (i.total || 0), 0);
    const totalCost = monthInvoices.reduce((s, i) => s + (i.total_cost || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const unpaidCount = invoices.filter(i => (i.due_amount || 0) > 0).length;
    const unpaidTotal = invoices.filter(i => (i.due_amount || 0) > 0).reduce((s, i) => s + (i.due_amount || 0), 0);
    const refundTotal = refunds.reduce((s, r) => s + (r.refund_customer || 0), 0);
    const expenseTotal = expenses.filter(e => (e.expense_date || e.created_at?.split('T')[0])?.startsWith(thisMonth)).reduce((s, e) => s + (e.amount || 0), 0);
    const bankBalance = bankTransactions.reduce((s, b) => s + (b.type === 'credit' ? (b.amount || 0) : -(b.amount || 0)), 0);
    return { todayCount: todayInvoices.length, monthCount: monthInvoices.length, totalRevenue, totalCost, totalProfit, unpaidCount, unpaidTotal, refundTotal, expenseTotal, bankBalance, customerCount: customers.length, corporateCount: corporates.length, employeeCount: employees.length };
  }, [invoices, refunds, expenses, bankTransactions, customers, corporates, employees]);

  /* ── Filtered Invoices ── */
  const filteredInvoices = useMemo(() => {
    let result = invoices;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        (i.invoice_no || '').toLowerCase().includes(q) ||
        (i.customers?.name || '').toLowerCase().includes(q) ||
        (i.corporates?.name || '').toLowerCase().includes(q) ||
        (i.pnr || '').toLowerCase().includes(q) ||
        (i.airline || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(i => (i.status || (i.due_amount > 0 ? 'Unpaid' : 'Paid')) === statusFilter);
    }
    if (dateFilter.from) result = result.filter(i => (i.invoice_date || '') >= dateFilter.from);
    if (dateFilter.to) result = result.filter(i => (i.invoice_date || '') <= dateFilter.to);
    return result;
  }, [invoices, searchQuery, statusFilter, dateFilter]);

  /* ── Print Helper ── */
  const printHTML = useCallback((html) => {
    const w = window.open('', '_blank', 'width=900,height=700');
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 500); }
  }, []);

  /* ── Initial Load ── */
  useEffect(() => { loadAll(); }, [loadAll]);

  return {
    /* Translations */
    t, lang, setLang, translations,
    /* Auth */
    user, setUser, loading, setLoading,
    /* Data */
    invoices, refunds, customers, corporates, employees, expenses, vendors,
    packages, branches, portals, bankTransactions, investors, auditLogs,
    settings, notifications, attendance, salaryPayments, creditLimits,
    recurringInvoices, quotationRequests, staffMistakes, drafts,
    /* UI */
    sidebarOpen, setSidebarOpen, activePage, setActivePage,
    modalOpen, setModalOpen, modalType, setModalType, modalData, setModalData,
    searchQuery, setSearchQuery, dateFilter, setDateFilter, statusFilter, setStatusFilter,
    /* Actions */
    loadAll, loadInvoices, loadRefunds, refreshDrafts,
    createInvoice, updateInvoice, deleteInvoice, settleInvoice,
    createRefund, deleteRefund,
    createCustomer, updateCustomer, deleteCustomer,
    createCorporate, updateCorporate, deleteCorporate,
    createEmployee, updateEmployee, deleteEmployee,
    createExpense, deleteExpense,
    markAttendance, paySalary,
    createBankTransaction, deleteBankTransaction,
    updateSettings,
    createVendor, createBranch, createPortal, createPackage,
    createQuotation, createStaffMistake,
    /* Computed */
    dashboardStats, filteredInvoices,
    /* Helpers */
    printHTML, exportToExcel, saveDraft, deleteDraft, loadDrafts,
    generateInvoiceNo, generateRefundNo,
    getAirlineCheckInURL, getAIMessage,
    /* HTML Generators */
    getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML,
  };
}
