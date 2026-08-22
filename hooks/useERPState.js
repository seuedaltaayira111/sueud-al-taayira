'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const translations = {
  en: { dashboard:'Dashboard', create:'Create Invoice', list:'Invoices', refunds:'Refunds', customers:'Customers', corporates:'Corporates', creditors:'Creditors', credit:'Credit Balances', vendors:'Vendors', packages:'Packages', branches:'Branches', portals:'Portals', bank:'Bank & Cash', invest:'Investors', hr:'Human Resources', users:'Users', settings:'Settings', reports:'Reports', audit:'Audit Logs', statements:'Statements', contract:'Corporate Contract', offer:'Corporate Offer', superadmin:'SuperAdmin', profile:'Profile', profitability:'Profitability', notifications:'Notifications', ai_dashboard:'AI Dashboard', quotations:'Quotations', hr_advanced:'HR & Payroll', ai_pricing:'AI Pricing', my_attendance:'My Attendance', credit_limits:'Credit Limits', customer_statement:'Customer Statement', refund_statement:'Refund Statement', supplier_statement:'Supplier Statement', multi_branch:'Multi-Branch', recurring_invoices:'Recurring Invoices', expense_approval:'Expense Approval', staff_mistakes:'Staff Mistakes', expenses:'Expenses', editInvoice:'Edit Invoice', generateInvoice:'Generate Invoice', updateInvoice:'Update Invoice', custType:'Customer Type', individual:'Individual', corporate:'Corporate', selectCustomer:'Select Customer', customerPhone:'Customer Phone', passengers:'Passengers', addPassenger:'+ Add Passenger', portal:'Portal', service:'Service', flightTicket:'Flight Ticket', hotel:'Hotel Booking', tourPackage:'Tour Package', visitVisa:'Visit Visa', umrahVisa:'Umrah Visa', newService:'New Service', flightType:'Flight Type', domestic:'Domestic', international:'International', airline:'Airline', sector:'Sector', pnr:'PNR', ticketNo:'Ticket No', qty:'Quantity', cost:'Cost', sell:'Sell', discount:'Discount', vatRate:'VAT Rate', invoiceDate:'Invoice Date', bookingType:'Booking Type', newBooking:'New Booking', reissue:'Reissue', extraLuggage:'Extra Luggage', previousBooking:'Previous Booking', salesPerson:'Sales Person', paymentMethod:'Payment Method', cash:'Cash', bankTransfer:'Bank Transfer', card:'Card / Network', credit:'Credit', creditBalance:'Credit Balance', tabby:'Tabby', tamara:'Tamara', paidAmount:'Paid Amount', invNo:'Inv No', total:'Total', due:'Due', method:'Method', actions:'Actions', preview:'Preview', print:'Print', edit:'Edit', delete:'Delete', refund:'Refund', quickSettle:'Settle', download_excel:'Export Excel', save:'Save', add:'Add', search:'Search...', changePass:'Change Password', logout:'Logout', selectEmployee:'Select Employee', attendanceDate:'Date', status:'Status', present:'Present', leave:'Leave', absent:'Absent', checkInTime:'Check-In', checkOutTime:'Check-Out', overtime:'OT', deduction:'Deduction', mark:'Mark', baseSalary:'Base Salary', commission:'Commission %', advDed:'Adv. Deduct', gift:'Gift/Bonus', month:'Month', mode:'Mode', paySalary:'Pay Salary', generateSlip:'Generate Slip', target:'Target (SAR)', achieved:'Achieved', percentage:'%', balance:'Balance' },
  ar: { dashboard:'لوحة التحكم', create:'إنشاء فاتورة', list:'الفواتير', refunds:'الاسترجاعات', customers:'العملاء', corporates:'الشركات', creditors:'الدائنون', credit:'أرصدة مستحقة', vendors:'الموردون', packages:'الباقات', branches:'الفروع', portals:'البوابات', bank:'البنك والصندوق', invest:'المستثمرون', hr:'الموارد البشرية', users:'المستخدمون', settings:'الإعدادات', reports:'التقارير', audit:'سجل التدقيق', statements:'كشوفات', contract:'عقد شركات', offer:'عرض شركات', superadmin:'المدير العام', profile:'الملف الشخصي', profitability:'الربحية', notifications:'الإشعارات', ai_dashboard:'لوحة ذكية', quotations:'عروض أسعار', hr_advanced:'الرواتب', ai_pricing:'تسعير ذكي', my_attendance:'حضوري', credit_limits:'حدود الائتمان', customer_statement:'كشف عميل', refund_statement:'كشف استرجاع', supplier_statement:'كشف مورد', multi_branch:'متعدد الفروع', recurring_invoices:'فواتير متكررة', expense_approval:'اعتماد مصروفات', staff_mistakes:'أخطاء الموظفين', expenses:'المصروفات', editInvoice:'تعديل الفاتورة', generateInvoice:'إنشاء الفاتورة', updateInvoice:'تحديث الفاتورة', custType:'نوع العميل', individual:'فرد', corporate:'شركة', selectCustomer:'اختر العميل', customerPhone:'هاتف العميل', passengers:'الركاب', addPassenger:'+ إضافة راكب', portal:'البوابة', service:'الخدمة', flightTicket:'تذكرة طيران', hotel:'حجز فندق', tourPackage:'باقة سياحية', visitVisa:'تأشيرة زيارة', umrahVisa:'تأشيرة عمرة', newService:'خدمة جديدة', flightType:'نوع الرحلة', domestic:'داخلي', international:'دولي', airline:'خط الطيران', sector:'القطاع', pnr:'رقم الحجز', ticketNo:'رقم التذكرة', qty:'الكمية', cost:'التكلفة', sell:'البيع', discount:'الخصم', vatRate:'نسبة الضريبة', invoiceDate:'تاريخ الفاتورة', bookingType:'نوع الحجز', newBooking:'حجز جديد', reissue:'إعادة إصدار', extraLuggage:'أمتعة إضافية', previousBooking:'حجز سابق', salesPerson:'موظف المبيعات', paymentMethod:'طريقة الدفع', cash:'نقداً', bankTransfer:'تحويل بنكي', card:'بطاقة', credit:'آجل', creditBalance:'رصيد مستحق', tabby:'تابي', tamara:'تمارة', paidAmount:'المبلغ المدفوع', invNo:'رقم الفاتورة', total:'الإجمالي', due:'المتبقي', method:'الطريقة', actions:'إجراءات', preview:'معاينة', print:'طباعة', edit:'تعديل', delete:'حذف', refund:'استرجاع', quickSettle:'تسوية', download_excel:'تصدير', save:'حفظ', add:'إضافة', search:'بحث...', changePass:'تغيير كلمة المرور', logout:'تسجيل خروج', selectEmployee:'اختر الموظف', attendanceDate:'التاريخ', status:'الحالة', present:'حاضر', leave:'إجازة', absent:'غائب', checkInTime:'وقت الحضور', checkOutTime:'وقت الانصراف', overtime:'إضافي', deduction:'خصم', mark:'تسجيل', baseSalary:'الراتب الأساسي', commission:'العمولة %', advDed:'خصم سلفة', gift:'هدية/مكافأة', month:'الشهر', mode:'الطريقة', paySalary:'دفع الراتب', generateSlip:'إنشاء قسيمة', target:'الهدف (ريال)', achieved:'المحقق', percentage:'%', balance:'الرصيد' }
};

/* ═══════════════════════════════════════════════════════════════════════════
   AIRLINE CHECK-IN URL MAPPER — 35+ airlines supported
   ═══════════════════════════════════════════════════════════════════════════ */
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
    '处女星':`https://www.virginatlantic.com/check-in?pnr=${pnr}`,'vs':`https://www.virginatlantic.com/check-in?pnr=${pnr}`,
  };
  for (const [key, url] of Object.entries(urls)) {
    if (a.includes(key)) return url;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(airline + ' online check in pnr ' + pnr)}`;
};

/* ═══════════════════════════════════════════════════════════════════════════
   AI-GENERATED FOOTER MESSAGES — 12 unique per invoice
   ═══════════════════════════════════════════════════════════════════════════ */
const getAIMessage = (inv, lang = 'en') => {
  const messages = [
    { en: "✈️ Wishing you a wonderful journey! Safe travels and thank you for choosing us.", ar: "✈️ نتمنى لك رحلة سعيدة! سفر آمن وشكراً لاختياركم." },
    { en: "🌟 Your trust means the world to us. Have an amazing trip!", ar: "🌟 ثقتكم تعني لنا كل شيء. رحلة رائعة لكم!" },
    { en: "🏔️ Explore the world with confidence. We are here for you every step of the way!", ar: "🏔️ استكشف العالم بثقة. نحن هنا من أجلكم في كل خطوة!" },
    { en: "🕌 Wishing you a blessed journey. May your travels be safe and joyful.", ar: "🕌 نتمنى لك رحلة مباركة. سفر آمن ومفرح." },
    { en: "🌴 Whether for business or leisure, we ensure your comfort. Enjoy your trip!", ar: "🌴 سواء للأعمال أو الترفيه، نضمن راحتكم. استمتعوا برحلتكم!" },
    { en: "💎 Premium service, unforgettable experiences. Thank you for flying with us!", ar: "💎 خدمة مميزة، تجارب لا تُنسى. شكراً لطيرانكم معنا!" },
    { en: "🌏 The world is your destination. Let us take you there in style!", ar: "🌏 العالم هو وجهتكم. دعونا نأخذكم إليه بأناقة!" },
    { en: "⭐ Your satisfaction is our mission. Have a fantastic journey ahead!", ar: "⭐ رضاكم هو مهمتنا. رحلة رائعة تنتظركم!" },
    { en: "🎭 Making your travel dreams come true, one booking at a time!", ar: "🎭 نحقق أحلام سفركم، حجزاً تلو الآخر!" },
    { en: "🌅 New horizons await! Thank you for being a valued customer.", ar: "🌅 آفاق جديدة تنتظركم! شكراً لكونكم عميلاً ثميناً." },
    { en: "🏨 From flights to hotels, we have got you covered. Enjoy your stay!", ar: "🏨 من الرحلات إلى الفنادق، نحن نهتم بكل شيء. استمتعوا بإقامتكم!" },
    { en: "🎊 Celebrating another successful booking. Safe travels!", ar: "🎊 نحتفل بحجز ناجح آخر. سفر آمن!" },
  ];
  const idx = (inv.id?.charCodeAt(0) || 0) % messages.length;
  const msg = messages[idx];
  return lang === 'ar' ? msg.ar : msg.en;
};

/* ═══════════════════════════════════════════════════════════════════════════
   INVOICE HTML — BARCODE(scan=check-in page) + QR(scan=invoice download page)
   ═══════════════════════════════════════════════════════════════════════════ */
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const checkInURL = getAirlineCheckInURL(inv.airline, inv.pnr);
  const invoicePageURL = `https://sueud-al-taayira.vercel.app/invoice/${no}`;

  // BARCODE = check-in URL directly → scanning opens airline check-in page
  const barcodeData = checkInURL || `https://www.google.com/search?q=${encodeURIComponent((inv.airline||'')+' check in '+(inv.pnr||''))}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=2.5&height=50&barcolor=0c1d3a&backgroundcolor=ffffff&includetext=false`;

  // QR = invoice page URL → scanning opens invoice page for download
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(invoicePageURL)}`;

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
  const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, '<br/>') : 'N/A';
  const aiMsg = getAIMessage(inv, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Invoice ${no}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:12px}
.inv{width:210mm;min-height:297mm;margin:auto;border:3px solid #0c1d3a;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#0c1d3a,#1a365d,#2563eb,#0c1d3a)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#0c1d3a,#2563eb,#1a365d,#0c1d3a)}
.hdr{display:flex;justify-content:space-between;padding:25px 30px;background:linear-gradient(135deg,#0c1d3a,#1a365d);color:#fff;gap:20px;margin-top:8px}
.cblk{display:flex;gap:15px;flex:1;align-items:center}
.logo{width:75px;height:75px;object-fit:cover;border-radius:10px;background:rgba(255,255,255,0.1);padding:3px;border:2px solid rgba(251,191,36,0.3)}
.ct h2{font-size:20px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo',sans-serif}
.ct h1{font-size:12px;font-weight:600;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:2px;margin:4px 0 0}
.ct p{font-size:10px;color:rgba(255,255,255,0.7);line-height:1.9;margin:6px 0 0}
.im{min-width:200px;background:rgba(255,255,255,0.06);padding:15px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);text-align:${isRTL?'left':'right'}}
.im h3{font-size:24px;font-weight:800;color:#fbbf24;text-transform:uppercase;line-height:1.1;margin:0}
.im h3 span{font-size:12px;font-family:'Cairo',sans-serif;display:block;margin:3px 0 0;color:rgba(255,255,255,0.8)}
.mr{display:flex;justify-content:space-between;margin-top:6px;font-size:11px;border-bottom:1px dashed rgba(255,255,255,0.15);padding-bottom:4px}
.mr .l{color:rgba(255,255,255,0.6)}.mr .v{color:#fbbf24;font-weight:700}
.sb{display:inline-block;padding:5px 14px;border-radius:20px;font-size:11px;font-weight:700;margin-top:10px;${st2==='Unpaid'?'background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)':'background:rgba(52,211,153,0.2);color:#34d399;border:1px solid rgba(52,211,153,0.3)'}}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px 30px;background:#f0f4ff;border-bottom:2px solid #e2e8f0}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:9px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.comp-det .cv{font-size:10px;color:#0f172a;font-weight:600}
.body{padding:20px 30px;flex:1;display:flex;flex-direction:column;gap:18px}
.sec-title{font-size:11px;font-weight:700;text-transform:uppercase;color:#0c1d3a;margin-bottom:10px;border-bottom:2px solid #0c1d3a;padding-bottom:5px;display:flex;justify-content:space-between;align-items:center}
.sec-title span{font-family:'Cairo';font-size:12px;color:#1a365d}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:15px}
.ib{padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;border-left:4px solid #1a365d}
.ir{display:flex;justify-content:space-between;font-size:11px;padding:4px 0;border-bottom:1px solid #f1f5f9}
.ir:last-child{border:none}.ir .l{color:#64748b}.ir .v{color:#0f172a;font-weight:600;text-align:${isRTL?'left':'right'};max-width:60%;word-break:break-word}
.rb{padding:14px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a}
.rt{font-size:12px;font-weight:700;color:#d97706;margin-bottom:10px;display:flex;justify-content:space-between;background:#fef3c7;padding:8px 12px;border-radius:6px}
.rt span{font-family:'Cairo';font-size:11px}
.rg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ri{background:#fff;padding:8px 10px;border-radius:6px;border:1px solid #fde68a}
.ri .l{font-size:9px;color:#92400e;font-weight:600;text-transform:uppercase}.ri .v{font-size:11px;color:#78350f;font-weight:700;margin-top:2px}
.rf{background:#dcfce7;border-color:#86efac;grid-column:span 3;display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:6px}
.rf .l{color:#059669;font-size:11px}.rf .v{color:#047857;font-size:16px;font-weight:800}
table{width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);border:1px solid #e2e8f0}
thead th{padding:10px 12px;background:#0c1d3a;color:#fbbf24;font-size:10px;text-transform:uppercase;text-align:${isRTL?'right':'left'};letter-spacing:0.5px;border-bottom:2px solid #fbbf24}
thead th span{font-family:'Cairo';font-size:9px;opacity:0.8;display:block}
thead th.r{text-align:${isRTL?'left':'right'}}thead th.c{text-align:center}
tbody td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:11px}
tbody td.r{text-align:${isRTL?'left':'right'};font-weight:600}tbody td.c{text-align:center}
tbody tr:hover{background:#f8fafc}tbody tr:last-child td{border-bottom:none}
.bs{display:grid;grid-template-columns:1.5fr 1fr;gap:15px}
.pb{padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0}
.pr{display:flex;justify-content:space-between;font-size:11px;padding:4px 0;border-bottom:1px dashed #cbd5e1}
.pr:last-child{border:none}
.tb{background:#0c1d3a;border-radius:8px;padding:14px;color:#fff;align-self:flex-start}
.tr{display:flex;justify-content:space-between;padding:4px 0;font-size:11px;color:rgba(255,255,255,0.8)}
.gt{display:flex;justify-content:space-between;padding:10px 0 0;margin-top:6px;border-top:2px solid rgba(255,255,255,0.15);font-size:18px;font-weight:800;color:#fff}
.gt .v{color:#fbbf24}
.terms{padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0}
.terms h4{font-size:10px;color:#64748b;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px}
.terms h4 span{font-family:'Cairo'}
.terms p{font-size:9px;color:#94a3b8;line-height:1.8;margin:0}
.ft{padding:16px 30px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);display:flex;justify-content:space-between;align-items:flex-start;border-top:2px solid #e2e8f0;gap:14px;margin-top:auto}
.code-box{display:flex;flex-direction:column;align-items:center;gap:5px;padding:8px;background:#fff;border:1px solid #e2e8f0;border-radius:8px}
.code-box img{border-radius:4px}
.barcode-img{height:48px;width:auto;min-width:240px;border:1px solid #e2e8f0;padding:2px 6px;background:#fff}
.qr-img{height:60px;width:60px;border:2px solid #e2e8f0;padding:2px;background:#fff}
.code-label{font-size:7px;font-weight:700;text-transform:uppercase;text-align:center;letter-spacing:0.3px;color:#475569;line-height:1.3;max-width:240px}
.code-label span{font-family:'Cairo';display:block;font-size:8px;color:#0c1d3a}
.code-label.checkin{color:#059669}
.code-label.checkin span{color:#047857}
.code-label.download{color:#2563eb}
.code-label.download span{color:#1d4ed8}
.ft-divider{width:1px;background:linear-gradient(to bottom,transparent,#cbd5e1,transparent);margin:0 6px;align-self:stretch;min-height:110px}
.ai-msg{text-align:center;flex:1;padding:10px 16px;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:10px;border:1px solid #93c5fd}
.ai-msg p{font-size:11px;color:#1e3a8a;margin:0;line-height:1.6;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:12px;margin-top:3px}
.ai-label{font-size:8px;color:#3b82f6;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;display:flex;align-items:center;justify-content:center;gap:4px}
.ft-info{width:90px;text-align:center;padding-top:4px}
.ft-info p{font-size:8px;color:#94a3b8;margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none;border-radius:0;box-shadow:none}}
</style></head><body>
<div class="inv">
<div class="hdr">
  <div class="cblk">
    ${st.logo_url?`<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>`:'<div class="logo" style="display:flex;align-items:center;justify-content:center;font-size:28px">✈️</div>'}
    <div class="ct">
      <h2>${st.company_name_ar||'صعود الطائرة للسفر والسياحة'}</h2>
      <h1>${st.company_name_en||'SUEUD AL TAAYIRA TRAVEL & TOURISM'}</h1>
      <p>${st.address_ar||'Address'}<br/>${st.phone||''} ${st.website?'| '+st.website:''}</p>
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
  <div class="ci"><span class="cl">License / رقم ترخيص</span><span class="cv">${st.license_no||'N/A'}</span></div>
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
      <div class="ir"><span class="l">Passengers / الركاب</span><span class="v" style="font-size:10px;line-height:1.5">${pax}</span></div>
    </div>
    <div class="ib" style="border-left-color:#f59e0b;${isRTL?'border-left:1px solid #e2e8f0;border-right:4px solid #f59e0b':''}">
      <div class="sec-title">FLIGHT DETAILS / تفاصيل الرحلة<span></span></div>
      <div class="ir"><span class="l">Airline / الخطوط</span><span class="v">${inv.airline||'N/A'}</span></div>
      <div class="ir"><span class="l">Sector / القطاع</span><span class="v">${inv.flight_sector||'N/A'}</span></div>
      <div class="ir"><span class="l">Type / النوع</span><span class="v">${inv.flight_type||'N/A'}</span></div>
      <div class="ir"><span class="l">Journey / الرحلة</span><span class="v">${inv.flight_journey||'N/A'}</span></div>
      <div class="ir"><span class="l">PNR / رقم الحجز</span><span class="v" style="color:#2563eb;font-weight:700">${inv.pnr||'N/A'}</span></div>
      <div class="ir"><span class="l">Ticket No / رقم التذكرة</span><span class="v">${inv.ticket_no||'N/A'}</span></div>
      <div class="ir"><span class="l">Refundable / قابلة للاسترجاع</span><span class="v">${inv.refundable_status||'N/A'}</span></div>
      <div class="ir"><span class="l">Service / الخدمة</span><span class="v">${inv.service_type||'N/A'}</span></div>
    </div>
  </div>
  ${isRe?`<div class="rb"><div class="rt"><span>⚠️ PREVIOUS BOOKING / الحجز السابق</span><span>تفاصيل</span></div><div class="rg">
    <div class="ri"><div class="l">Old Date / التاريخ</div><div class="v">${inv.old_booking_date||'N/A'}</div></div>
    <div class="ri"><div class="l">Old Airline / الخطوط</div><div class="v">${inv.old_airline||'N/A'}</div></div>
    <div class="ri"><div class="l">Old Sector / القطاع</div><div class="v">${inv.old_sector||'N/A'}</div></div>
    <div class="ri"><div class="l">Old PNR / الحجز</div><div class="v">${inv.old_pnr||'N/A'}</div></div>
    <div class="ri"><div class="l">Old Ticket / التذكرة</div><div class="v">${inv.old_ticket_no||'N/A'}</div></div>
    <div class="ri"><div class="l">Old Type / النوع</div><div class="v">${inv.old_flight_type||'N/A'}</div></div>
    <div class="rf"><div class="l">Original Fare / الأجرة الأصلية</div><div class="v">${parseFloat(inv.old_sell_price||0).toFixed(2)} SAR</div></div>
  </div></div>`:''}
  <table>
    <thead><tr>
      <th>Description<br/><span>الوصف</span></th>
      <th class="c">Qty<br/><span>الكمية</span></th>
      <th class="r">Unit Price<br/><span>سعر الوحدة</span></th>
      <th class="r">Total<br/><span>الإجمالي</span></th>
    </tr></thead>
    <tbody>
      <tr><td>${inv.sector||inv.service_type||'Service'} / خدمة</td><td class="c">${inv.qty||1}</td><td class="r">${up.toFixed(2)}</td><td class="r">${ts.toFixed(2)}</td></tr>
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
      <div class="pr" style="border-top:2px solid #cbd5e1;margin-top:6px;padding-top:6px;font-weight:700"><span>Paid (${pd}) / مدفوع</span><span style="color:#059669">${cp.toFixed(2)} SAR</span></div>
      <div class="pr" style="font-weight:700;font-size:13px"><span>Due / المتبقي</span><span style="color:${due>0?'#ef4444':'#059669'}">${due.toFixed(2)} SAR</span></div>
    </div>
    <div class="tb">
      <div class="tr"><span>Subtotal / المجموع الفرعي</span><span>${sub.toFixed(2)}</span></div>
      ${disc>0?`<div class="tr" style="color:#34d399"><span>Discount / خصم</span><span>- ${disc.toFixed(2)}</span></div>`:''}
      <div class="tr"><span>VAT (${vr}%) / ضريبة</span><span>${vat.toFixed(2)}</span></div>
      <div class="gt"><span>GRAND TOTAL / الإجمالي الكلي</span><span class="v">${tot.toFixed(2)} SAR</span></div>
    </div>
  </div>
  <div class="terms">
    <h4>Terms & Conditions / الشروط والأحكام<span>الشروط</span></h4>
    <p>
      1. All bookings subject to airline/hotel terms. / جميع الحجوزات تخضع لشروط الخطوط/الفنادق.<br/>
      2. Cancellation policies vary by provider. / سياسات الإلغاء تختلف حسب المزود.<br/>
      3. Computer-generated - valid without signature. / مستند آلي - صالح بدون توقيع.<br/>
      4. Prices in SAR including VAT. / الأسعار بالريال شاملة الضريبة.<br/>
      5. For queries: ${st.phone||'contact our office'}. / للاستفسارات: ${st.phone||'تواصل معنا'}.<br/>
      6. This is an electronic invoice under Fatoorah regulations. / هذه فاتورة إلكترونية بموجب لوائح فاتورة.
    </p>
  </div>
</div>
<div class="ft">
  <!-- BARCODE: scan → opens airline check-in page -->
  <div class="code-box">
    <img src="${barcode}" alt="Check-in Barcode" class="barcode-img" crossorigin="anonymous"/>
    <div class="code-label checkin">SCAN → AIRLINE CHECK-IN<span>امسح → تسجيل الخطوط</span></div>
    <img src="${qr}" alt="Invoice QR" class="qr-img" crossorigin="anonymous"/>
    <div class="code-label download">SCAN → DOWNLOAD INVOICE<span>امسح → تحميل الفاتورة</span></div>
  </div>
  <div class="ft-divider"></div>
  <div class="ai-msg">
    <div class="ai-label">🤖 AI Generated Message</div>
    <p>${aiMsg}<span>${lang==='ar'?'✈️ نتمنى لك رحلة سعيدة!':'Have a safe flight!'}</span></p>
  </div>
  <div class="ft-divider"></div>
  <div class="ft-info">
    <p style="font-weight:700;color:#0f172a;font-size:9px">${st.company_name_en||'SUEUD AL TAAYIRA'}</p>
    <p style="font-size:8px">${st.phone||''}</p>
    <p style="font-family:'Cairo';font-size:9px">${st.company_name_ar||''}</p>
    <p style="font-size:7px;color:#cbd5e1;margin-top:4px">${st.vat_no?'VAT: '+st.vat_no:''}</p>
  </div>
</div>
</div></body></html>`;
};

/* ═══════════════════════════════════════════════════════════════════════════
   REFUND INVOICE HTML
   ═══════════════════════════════════════════════════════════════════════════ */
const getRefundHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app/invoice/' + no)}`;
  const of2 = inv.old_sell_price || inv.total_sell || 0;
  const cRef = inv.refund_customer || 0;
  const compRef = inv.refund_company || 0;
  const airlineFees = of2 - compRef;
  const cn = inv.customers?.name || inv.old_customer_name || 'N/A';
  const cp = inv.customers?.phone || inv.old_customer_phone || 'N/A';
  const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, '<br/>') : (inv.old_passengers || 'N/A');
  let rm = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit') rm = 'Credit for New Booking / رصيد لحجز جديد';
  const aiMsg = getAIMessage(inv, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Refund ${no}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:12px}
.inv{width:210mm;min-height:297mm;margin:auto;border:3px solid #7f1d1d;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#7f1d1d,#991b1b,#dc2626,#7f1d1d)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#7f1d1d,#dc2626,#991b1b,#7f1d1d)}
.hdr{display:flex;justify-content:space-between;padding:25px 30px;background:linear-gradient(135deg,#7f1d1d,#991b1b);color:#fff;gap:20px;margin-top:8px}
.cblk{display:flex;gap:15px;flex:1;align-items:center}
.logo{width:75px;height:75px;object-fit:cover;border-radius:10px;background:rgba(255,255,255,0.1);padding:3px;border:2px solid rgba(251,191,36,0.3)}
.ct h2{font-size:20px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}
.ct h1{font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px;margin:4px 0 0}
.ct p{font-size:10px;color:rgba(255,255,255,0.6);line-height:1.9;margin:6px 0 0}
.im{min-width:200px;text-align:${isRTL?'left':'right'}}
.im h3{font-size:24px;font-weight:800;color:#fbbf24;text-transform:uppercase;line-height:1.1;margin:0}
.im h3 span{font-size:12px;font-family:'Cairo';display:block;margin:3px 0 0;color:rgba(255,255,255,0.8)}
.ino{font-size:11px;color:rgba(255,255,255,0.8);margin-top:6px;border-bottom:1px dashed rgba(255,255,255,0.2);padding-bottom:4px}
.ino span{color:#fbbf24;font-weight:700}
.sb{display:inline-block;padding:5px 14px;border-radius:20px;font-size:11px;font-weight:700;margin-top:10px;background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px 30px;background:#fff5f5;border-bottom:2px solid #fecaca}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:9px;color:#991b1b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.comp-det .cv{font-size:10px;color:#7f1d1d;font-weight:600}
.body{padding:20px 30px;flex:1;display:flex;flex-direction:column;gap:18px}
.sec-title{font-size:11px;font-weight:700;text-transform:uppercase;color:#7f1d1d;margin-bottom:10px;border-bottom:2px solid #7f1d1d;padding-bottom:5px}
.sec-title span{font-family:'Cairo';font-size:12px;color:#991b1b}
.ib{padding:14px;background:#fff5f5;border-radius:8px;border:1px solid #fecaca;border-left:4px solid #dc2626}
.row{display:flex;justify-content:space-between;font-size:11px;padding:4px 0;border-bottom:1px solid #fee2e2}
.row:last-child{border:none}.row .l{color:#991b1b;font-weight:500}.row .v{color:#7f1d1d;font-weight:600;text-align:${isRTL?'left':'right'};max-width:60%}
.cb{background:#fff;padding:18px;border-radius:8px;border:1px solid #e2e8f0}
.ct2{font-size:11px;text-transform:uppercase;color:#dc2626;margin-bottom:10px;border-bottom:2px solid #fecaca;padding-bottom:5px;font-weight:700}
.ct2 span{font-family:'Cairo'}
.cr{display:flex;justify-content:space-between;padding:6px 0;font-size:12px;color:#334155;border-bottom:1px dashed #e2e8f0}
.cr:last-child{border:none}.cr.deduct{color:#ef4444}
.cr.total{padding-top:10px;margin-top:8px;border-top:2px solid #dc2626;font-size:18px;font-weight:800;color:#059669;border-bottom:none}
.pi{padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center}
.ft{padding:16px 30px;background:linear-gradient(135deg,#fff5f5,#fef2f2);display:flex;justify-content:space-between;align-items:center;border-top:2px solid #fecaca;gap:14px;margin-top:auto}
.code-box{display:flex;flex-direction:column;align-items:center;gap:5px;padding:8px;background:#fff;border:1px solid #fecaca;border-radius:8px}
.qr-img{height:60px;width:60px;border:2px solid #fecaca;padding:2px;background:#fff;border-radius:6px}
.code-label{font-size:7px;font-weight:700;text-transform:uppercase;text-align:center;color:#991b1b;line-height:1.3}
.code-label span{font-family:'Cairo';display:block;font-size:8px}
.ft-divider{width:1px;background:linear-gradient(to bottom,transparent,#fecaca,transparent);margin:0 6px;align-self:stretch;min-height:80px}
.ai-msg{text-align:center;flex:1;padding:10px 16px;background:linear-gradient(135deg,#fef2f2,#fee2e2);border-radius:10px;border:1px solid #fca5a5}
.ai-msg p{font-size:11px;color:#7f1d1d;margin:0;line-height:1.6;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:12px;margin-top:3px}
.ai-label{font-size:8px;color:#dc2626;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;display:flex;align-items:center;justify-content:center;gap:4px}
.ft-info{width:80px;text-align:center}
.ft-info p{font-size:8px;color:#94a3b8;margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none}}
</style></head><body>
<div class="inv">
<div class="hdr">
  <div class="cblk">
    ${st.logo_url?`<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>`:'<div class="logo" style="display:flex;align-items:center;justify-content:center;font-size:28px">✈️</div>'}
    <div class="ct"><h2>${st.company_name_ar||'صعود الطائرة'}</h2><h1>${st.company_name_en||'SUEUD AL TAAYIRA'}</h1><p>${st.address_ar||''}<br/>${st.phone||''}</p></div>
  </div>
  <div class="im"><h3>REFUND<span>استرجاع</span></h3><div class="ino">No / رقم: <span>${no}</span></div><div class="ino">Date / التاريخ: <span>${inv.refund_date||inv.invoice_date||''}</span></div><div class="sb">PROCESSED / تم الاسترجاع</div></div>
</div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">License / رقم ترخيص</span><span class="cv">${st.license_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic. / ترخيص سياحة</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div>
</div>
<div class="body">
  <div class="ib">
    <div class="sec-title">BOOKING DETAILS / تفاصيل الحجز<span>التفاصيل</span></div>
    <div class="row"><span class="l">Customer / العميل</span><span class="v">${cn}</span></div>
    <div class="row"><span class="l">Phone / الهاتف</span><span class="v">${cp}</span></div>
    <div class="row"><span class="l">Passengers / الركاب</span><span class="v" style="font-size:10px;line-height:1.5">${pax}</span></div>
    <div class="row"><span class="l">Airline / الخطوط</span><span class="v">${inv.airline||inv.old_airline||'N/A'}</span></div>
    <div class="row"><span class="l">Date / التاريخ</span><span class="v">${inv.invoice_date||'N/A'}</span></div>
    <div class="row"><span class="l">PNR / رقم الحجز</span><span class="v">${inv.pnr||inv.old_pnr||'N/A'}</span></div>
    <div class="row"><span class="l">Reason / السبب</span><span class="v">${inv.refund_reason||'N/A'}</span></div>
  </div>
  <div class="cb">
    <div class="ct2">REFUND CALCULATION / حساب الاسترجاع<span>الحساب</span></div>
    <div class="cr"><span>Original Fare / الأجرة الأصلية</span><span style="font-weight:600">${of2.toFixed(2)} SAR</span></div>
    <div class="cr deduct"><span>Less: Airline Fees / خصم رسوم الخطوط</span><span style="font-weight:600">- ${airlineFees.toFixed(2)} SAR</span></div>
    <div class="cr"><span>Refund to Portal / استرجاع للبوابة</span><span style="font-weight:600;color:#2563eb">${compRef.toFixed(2)} SAR</span></div>
    <div class="cr total"><span>Refund to Customer / استرجاع للعميل</span><span>${cRef.toFixed(2)} SAR</span></div>
  </div>
  <div class="pi"><span style="font-size:11px;font-weight:600;color:#334155">Refund Method / طريقة الاسترجاع</span><span style="font-weight:600;color:#2563eb">${rm}</span></div>
</div>
<div class="ft">
  <div class="code-box"><img src="${qr}" alt="QR" class="qr-img" crossorigin="anonymous"/><div class="code-label">SCAN → DOWNLOAD<span>امسح → تحميل</span></div></div>
  <div class="ft-divider"></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI Message</div><p>${aiMsg}<span>${lang==='ar'?'🔄 تم معالجة الاسترجاع بنجاح':'Refund processed successfully!'}</span></p></div>
  <div class="ft-divider"></div>
  <div class="ft-info"><p style="font-weight:700;color:#7f1d1d">${st.company_name_en||''}</p><p>${st.phone||''}</p><p style="font-family:'Cairo'">${st.company_name_ar||''}</p></div>
</div>
</div></body></html>`;
};

/* ═══════════════════════════════════════════════════════════════════════════
   EXPENSE VOUCHER HTML
   ═══════════════════════════════════════════════════════════════════════════ */
const getExpenseHTML = (exp, s, lang = 'en') => {
  const st = s || {};
  const eno = `EXP-${exp.id?.substring(0,8)||'N/A'}`;
  const items = exp.items?.length > 0 ? exp.items : [{ name: exp.item_name||'Item / بند', qty: 1, price: exp.amount||0 }];
  const sub = items.reduce((s,it) => s + ((parseFloat(it.qty)||0) * (parseFloat(it.price)||0)), 0);
  const aiMsg = getAIMessage(exp, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Expense ${eno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:12px}
.inv{width:210mm;min-height:297mm;margin:auto;border:3px solid #7c2d12;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#7c2d12,#9a3412,#ea580c,#7c2d12)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#7c2d12,#ea580c,#9a3412,#7c2d12)}
.hdr{display:flex;justify-content:space-between;padding:25px 30px;background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;margin-top:8px}
.ci h2{font-size:20px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}
.ci h1{font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px;margin:4px 0 0}
.im{text-align:${isRTL?'left':'right'}}
.im h3{font-size:24px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin:0}
.im p{font-size:11px;color:rgba(255,255,255,0.8);margin:5px 0 0}.im p span{color:#fbbf24;font-weight:700}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px 30px;background:#fff7ed;border-bottom:2px solid #fed7aa}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:9px;color:#9a3412;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:10px;color:#7c2d12;font-weight:600}
.body{padding:20px 30px;flex:1;display:flex;flex-direction:column;gap:18px}
.sec-title{font-size:11px;font-weight:700;text-transform:uppercase;color:#7c2d12;margin-bottom:10px;border-bottom:2px solid #7c2d12;padding-bottom:5px}
.sec-title span{font-family:'Cairo';font-size:12px;color:#9a3412}
.ib{padding:14px;background:#fff7ed;border-radius:8px;border-left:4px solid #ea580c;border:1px solid #fed7aa}
.row{display:flex;justify-content:space-between;font-size:11px;padding:4px 0;border-bottom:1px solid #fed7aa}
.row:last-child{border:none}.row .l{color:#9a3412;font-weight:500}.row .v{color:#7c2d12;font-weight:600}
table{width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0}
thead th{padding:10px 12px;background:#7c2d12;color:#fbbf24;font-size:10px;text-transform:uppercase;text-align:${isRTL?'right':'left'};letter-spacing:1px}
thead th span{font-family:'Cairo';font-size:9px;opacity:0.8;display:block}
thead th.r{text-align:${isRTL?'left':'right'}}
tbody td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:11px}
tbody td.r{text-align:${isRTL?'left':'right'};font-weight:600}
.totals{background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;padding:20px;border-radius:10px;display:flex;justify-content:space-between;align-items:center}
.totals h3{margin:0;text-transform:uppercase;font-size:14px}.totals .amt{font-size:28px;font-weight:800;margin:0;color:#fbbf24}
.ft{padding:16px 30px;background:linear-gradient(135deg,#fff7ed,#ffedd5);display:flex;justify-content:space-between;align-items:center;border-top:2px solid #fed7aa;gap:14px;margin-top:auto}
.ai-msg{text-align:center;flex:1;padding:10px 20px;background:linear-gradient(135deg,#fff7ed,#fed7aa);border-radius:10px;border:1px solid #fdba74}
.ai-msg p{font-size:11px;color:#7c2d12;margin:0;line-height:1.6;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:12px;margin-top:3px}
.ai-label{font-size:8px;color:#9a3412;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;display:flex;align-items:center;justify-content:center;gap:4px}
.ft-info{width:120px;text-align:center}
.ft-info p{font-size:8px;color:#94a3b8;margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none}}
</style></head><body>
<div class="inv">
<div class="hdr"><div class="ci"><h2>${st.company_name_ar||'صعود الطائرة'}</h2><h1>${st.company_name_en||'SUEUD AL TAAYIRA'}</h1></div>
<div class="im"><h3>EXPENSE VOUCHER</h3><p>No / رقم: <span>${eno}</span></p><p>Date / التاريخ: <span>${exp.expense_date||''}</span></p></div></div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">License / رقم ترخيص</span><span class="cv">${st.license_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic. / ترخيص سياحة</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div>
</div>
<div class="body">
  <div class="ib">
    <div class="sec-title">DETAILS / التفاصيل<span>التفاصيل</span></div>
    <div class="row"><span class="l">Type / النوع</span><span class="v">${exp.expense_type||'N/A'}</span></div>
    <div class="row"><span class="l">Payment / الدفع</span><span class="v">${exp.payment_mode||'Cash / نقداً'}</span></div>
    <div class="row"><span class="l">Description / الوصف</span><span class="v">${exp.description||'N/A'}</span></div>
  </div>
  <table>
    <thead><tr><th>Item / البند<br/><span>الوصف</span></th><th class="r">Qty / الكمية<br/><span>الكمية</span></th><th class="r">Price / السعر<br/><span>السعر</span></th><th class="r">Total / الإجمالي<br/><span>المجموع</span></th></tr></thead>
    <tbody>${items.map(it=>`<tr><td>${it.name||'Item'}</td><td class="r">${it.qty||1}</td><td class="r">${parseFloat(it.price||0).toFixed(2)}</td><td class="r">${((parseFloat(it.qty)||0)*(parseFloat(it.price)||0)).toFixed(2)}</td></tr>`).join('')}</tbody>
  </table>
  <div class="totals"><h3>TOTAL / الإجمالي</h3><p class="amt">${(exp.amount||0).toFixed(2)} SAR</p></div>
</div>
<div class="ft">
  <div class="ft-info"><p style="font-weight:700;color:#7c2d12">${st.company_name_en||''}</p><p>${st.phone||''}</p><p style="font-family:'Cairo'">${st.company_name_ar||''}</p></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI Message</div><p>${aiMsg}<span>${lang==='ar'?'📝 سند مصروفات معتمد':'Expense voucher approved'}</span></p></div>
  <div style="width:120px"></div>
</div>
</div></body></html>`;
};

/* ═══════════════════════════════════════════════════════════════════════════
   SALARY SLIP HTML
   ═══════════════════════════════════════════════════════════════════════════ */
const getSalarySlipHTML = (pay, s, lang = 'en') => {
  const st = s || {};
  const sno = `SLIP-${pay.id?.substring(0,8)||'N/A'}`;
  const gross = (pay.base_salary||0)+(pay.commission||0)+(pay.overtime||0)+(pay.gift||0);
  const tded = (pay.advance_deduction||0)+(pay.mistakes_deduction||0)+(pay.other_deduction||0);
  const aiMsg = getAIMessage(pay, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Slip ${sno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:12px}
.slip{width:210mm;min-height:297mm;margin:auto;border:3px solid #0F172A;display:flex;flex-direction:column;position:relative;overflow:hidden}
.slip::before{content:'';position:absolute;top:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#0F172A,#1E3A8A,#2563EB,#0F172A)}
.slip::after{content:'';position:absolute;bottom:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#0F172A,#2563EB,#1E3A8A,#0F172A)}
.hdr{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;padding:25px 30px;display:flex;justify-content:space-between;align-items:center;margin-top:8px}
.hdr h1{font-size:20px;font-weight:800;color:#FBBF24;margin:0}
.si{text-align:${isRTL?'left':'right'}}
.si h3{color:#FBBF24;font-size:20px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0}
.si h3 span{font-family:'Cairo';display:block;font-size:12px;color:rgba(255,255,255,0.8);margin:2px 0 0}
.si p{font-size:11px;color:#c7d2fe;margin:3px 0 0}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px 30px;background:#eff6ff;border-bottom:2px solid #bfdbfe}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:9px;color:#1e3a8a;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:10px;color:#0f172a;font-weight:600}
.body{padding:20px 30px;flex:1;display:flex;flex-direction:column;gap:18px}
.eg{display:grid;grid-template-columns:1fr 1fr;gap:18px;background:#F8FAFC;padding:20px;border-radius:10px;border:1px solid #E2E8F0}
.eg p{font-size:13px;margin:5px 0}.eg .l{color:#64748b;font-weight:500}
.sec-title{font-size:11px;font-weight:700;text-transform:uppercase;color:#0F172A;margin-bottom:10px;border-bottom:2px solid #0F172A;padding-bottom:5px}
.sec-title span{font-family:'Cairo';font-size:12px;color:#1E3A8A}
table{width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #E2E8F0}
th,td{padding:12px;border-bottom:1px solid #f1f5f9;font-size:12px}
th{text-align:${isRTL?'right':'left'};background:#1E3A8A;color:#fff;font-size:10px;text-transform:uppercase;letter-spacing:1px}
th span{font-family:'Cairo';font-size:9px;opacity:0.8;display:block}
th.r,td.r{text-align:${isRTL?'left':'right'};font-weight:600}
.net{background:linear-gradient(135deg,#059669,#047857);color:#fff;padding:25px;border-radius:12px;display:flex;justify-content:space-between;align-items:center}
.net h3{margin:0;text-transform:uppercase;font-size:16px}
.net h3 span{font-family:'Cairo';display:block;font-size:12px;opacity:0.8;margin:2px 0 0}
.net .amt{font-size:32px;font-weight:800;margin:0;color:#FBBF24}
.ft{padding:16px 30px;background:linear-gradient(135deg,#F8FAFC,#EFF6FF);display:flex;justify-content:space-between;align-items:center;border-top:2px solid #BFDBFE;gap:14px;margin-top:auto}
.ai-msg{text-align:center;flex:1;padding:10px 20px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border-radius:10px;border:1px solid #93C5FD}
.ai-msg p{font-size:11px;color:#1E3A8A;margin:0;line-height:1.6;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:12px;margin-top:3px}
.ai-label{font-size:8px;color:#2563EB;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;display:flex;align-items:center;justify-content:center;gap:4px}
.ft-info{width:120px;text-align:center}
.ft-info p{font-size:8px;color:#94a3b8;margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.slip{border:none}}
</style></head><body>
<div class="slip">
<div class="hdr"><div><h1>${st.company_name_en||'SUEUD AL TAAYIRA'}</h1></div>
<div class="si"><h3>SALARY SLIP<span>قسيمة الراتب</span></h3><p>Slip / رقم: ${sno} | Month / الشهر: ${pay.month}</p></div></div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">License / رقم ترخيص</span><span class="cv">${st.license_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic. / ترخيص سياحة</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div>
</div>
<div class="body">
  <div class="eg">
    <div><p><span class="l">Employee / الموظف:</span> <strong>${pay.employees?.name||'N/A'}</strong></p><p><span class="l">Role / الدور:</span> ${pay.employees?.role||'N/A'}</p></div>
    <div style="text-align:${isRTL?'left':'right'}"><p><span class="l">Pay Date / تاريخ الدفع:</span> ${pay.payment_date||'N/A'}</p><p><span class="l">Mode / الطريقة:</span> ${pay.payment_mode||'N/A'}</p></div>
  </div>
  <table>
    <thead><tr><th>Earnings / الإيرادات<span>الإيرادات</span></th><th class="r">Amount (SAR)<span>المبلغ</span></th></tr></thead>
    <tbody>
      <tr><td>Basic Salary / الراتب الأساسي</td><td class="r">${(pay.base_salary||0).toFixed(2)}</td></tr>
      <tr><td>Commission / العمولة</td><td class="r" style="color:#059669">+ ${(pay.commission||0).toFixed(2)}</td></tr>
      <tr><td>Overtime / إضافي</td><td class="r" style="color:#059669">+ ${(pay.overtime||0).toFixed(2)}</td></tr>
      <tr><td>Gift/Bonus / هدية/مكافأة</td><td class="r" style="color:#059669">+ ${(pay.gift||0).toFixed(2)}</td></tr>
      <tr style="background:#F0FDF4"><td><strong>Gross / الإجمالي</strong></td><td class="r"><strong>${gross.toFixed(2)}</strong></td></tr>
    </tbody>
  </table>
  <table>
    <thead><tr><th>Deductions / الخصومات<span>الخصومات</span></th><th class="r">Amount (SAR)<span>المبلغ</span></th></tr></thead>
    <tbody>
      <tr><td>Advance / سلفة</td><td class="r" style="color:#EF4444">- ${(pay.advance_deduction||0).toFixed(2)}</td></tr>
      <tr><td>Mistakes / أخطاء</td><td class="r" style="color:#EF4444">- ${(pay.mistakes_deduction||0).toFixed(2)}</td></tr>
      ${pay.other_deduction>0?`<tr><td>Other / أخرى</td><td class="r" style="color:#EF4444">- ${(pay.other_deduction||0).toFixed(2)}</td></tr>`:''}
      <tr style="background:#FEF2F2"><td><strong>Total Deductions / إجمالي الخصومات</strong></td><td class="r"><strong>${tded.toFixed(2)}</strong></td></tr>
    </tbody>
  </table>
  <div class="net"><h3>NET PAY<span>صافي الراتب</span></h3><p class="amt">${(pay.amount||0).toFixed(2)} SAR</p></div>
</div>
<div class="ft">
  <div class="ft-info"><p style="font-weight:700;color:#0F172A">${st.company_name_en||''}</p><p>${st.phone||''}</p><p style="font-family:'Cairo'">${st.company_name_ar||''}</p></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI Message</div><p>${aiMsg}<span>${lang==='ar'?'💰 راتبك معالج بنجاح':'Salary processed successfully!'}</span></p></div>
  <div style="width:120px"></div>
</div>
</div></body></html>`;
};

/* ═══════════════════════════════════════════════════════════════════════════
   MISTAKE VOUCHER HTML
   ═══════════════════════════════════════════════════════════════════════════ */
const getMistakeHTML = (m, s, lang = 'en') => {
  const st = s || {};
  const vno = `MST-${m.id?.substring(0,8)||'N/A'}`;
  const aiMsg = getAIMessage(m, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Mistake ${vno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:12px}
.v{width:210mm;min-height:297mm;margin:auto;border:3px solid #B91C1C;display:flex;flex-direction:column;position:relative;overflow:hidden}
.v::before{content:'';position:absolute;top:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#B91C1C,#EF4444,#F87171,#B91C1C)}
.v::after{content:'';position:absolute;bottom:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#B91C1C,#F87171,#EF4444,#B91C1C)}
.hdr{background:linear-gradient(135deg,#0F172A,#1E3A8B);color:#fff;padding:25px 30px;display:flex;justify-content:space-between;align-items:center;margin-top:8px}
.hdr h1{font-size:20px;font-weight:800;color:#FBBF24;margin:0}
.vi{text-align:${isRTL?'left':'right'}}
.vi h3{color:#FBBF24;font-size:20px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0}
.vi h3 span{font-family:'Cairo';display:block;font-size:12px;color:rgba(255,255,255,0.8);margin:2px 0 0}
.vi p{font-size:11px;color:#c7d2fe;margin:3px 0 0}.vi p span{color:#FBBF24;font-weight:700}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px 30px;background:#fef2f2;border-bottom:2px solid #fecaca}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:9px;color:#991b1b;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:10px;color:#7f1d1d;font-weight:600}
.body{padding:20px 30px;flex:1;display:flex;flex-direction:column;gap:18px}
.eg{display:grid;grid-template-columns:1fr 1fr;gap:18px;background:#F8FAFC;padding:20px;border-radius:10px;border:1px solid #E2E8F0}
.eg p{font-size:13px;margin:5px 0}.eg .l{color:#64748b;font-weight:500}
.sec-title{font-size:11px;font-weight:700;text-transform:uppercase;color:#B91C1C;margin-bottom:10px;border-bottom:2px solid #B91C1C;padding-bottom:5px}
.sec-title span{font-family:'Cairo';font-size:12px;color:#991b1b}
.loss{background:linear-gradient(135deg,#EF4444,#B91C1C);color:#fff;padding:25px;border-radius:12px;display:flex;justify-content:space-between;align-items:center}
.loss h3{margin:0;text-transform:uppercase;font-size:16px}
.loss h3 span{font-family:'Cairo';display:block;font-size:12px;opacity:0.8;margin:2px 0 0}
.loss .amt{font-size:32px;font-weight:800;margin:0;color:#FBBF24}
.note{padding:18px;background:#FEF2F2;border-radius:8px;border:1px solid #FECACA;font-size:13px;color:#334155}
.ft{padding:16px 30px;background:linear-gradient(135deg,#FEF2F2,#FEE2E2);display:flex;justify-content:space-between;align-items:center;border-top:2px solid #FECACA;gap:14px;margin-top:auto}
.ai-msg{text-align:center;flex:1;padding:10px 20px;background:linear-gradient(135deg,#FEF2F2,#FEE2E2);border-radius:10px;border:1px solid #FCA5A5}
.ai-msg p{font-size:11px;color:#7f1d1d;margin:0;line-height:1.6;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:12px;margin-top:3px}
.ai-label{font-size:8px;color:#DC2626;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;display:flex;align-items:center;justify-content:center;gap:4px}
.ft-info{width:120px;text-align:center}
.ft-info p{font-size:8px;color:#94a3b8;margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.v{border:none}}
</style></head><body>
<div class="v">
<div class="hdr"><div><h1>${st.company_name_en||'SUEUD AL TAAYIRA'}</h1></div>
<div class="vi"><h3>LOSS VOUCHER<span>سند خسارة</span></h3><p>Voucher / رقم: <span>${vno}</span></p><p>Date / التاريخ: <span>${m.date}</span></p></div></div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">License / رقم ترخيص</span><span class="cv">${st.license_no||'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic. / ترخيص سياحة</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div>
</div>
<div class="body">
  <div class="eg">
    <div><p><span class="l">Employee / الموظف:</span> <strong>${m.employees?.name||'N/A'}</strong></p><p><span class="l">Role / الدور:</span> ${m.employees?.role||'N/A'}</p></div>
    <div style="text-align:${isRTL?'left':'right'}"><p><span class="l">Old Ticket / التذكرة القديمة:</span> ${m.old_ticket_no||'N/A'}</p><p><span class="l">New Ticket / التذكرة الجديدة:</span> ${m.new_ticket_no||'N/A'}</p></div>
  </div>
  <div class="loss"><h3>TOTAL LOSS<span>إجمالي الخسارة</span></h3><p class="amt">${(m.loss_amount||0).toFixed(2)} SAR</p></div>
  <div class="note"><strong>Status / الحالة:</strong> ${m.paid_by_employee?'Will be deducted from salary / سيتم خصمه من الراتب':'Absorbed by company / تتحملها الشركة'}</div>
</div>
<div class="ft">
  <div class="ft-info"><p style="font-weight:700;color:#7f1d1d">${st.company_name_en||''}</p><p>${st.phone||''}</p><p style="font-family:'Cairo'">${st.company_name_ar||''}</p></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI Message</div><p>${aiMsg}<span>${lang==='ar'?'⚠️ تم تسجيل الخسارة':'Loss recorded successfully'}</span></p></div>
  <div style="width:120px"></div>
</div>
</div></body></html>`;
};

/* ═══════════════════════════════════════════════════════════════════════════
   CONTRACT / OFFER HTML
   ═══════════════════════════════════════════════════════════════════════════ */
const getContractHTML = (s, name, date, isOffer, type, markup, terms) => {
  const st = s || {};
  const dt = isOffer ? 'OFFER' : 'CONTRACT';
  const tl = terms ? terms.split('\n').filter(t=>t.trim()).map(t=>`<li style="margin-bottom:10px;font-size:14px;color:#334155">${t.trim()}</li>`).join('') : '<li style="margin-bottom:10px;font-size:14px;color:#334155">Standard terms apply.</li>';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${dt} - ${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;background:#f0f4f8;padding:30px;color:#1e293b}.doc{max-width:210mm;margin:auto;background:#fff;box-shadow:0 20px 60px rgba(0,0,0,0.1);padding:50px;border-radius:14px;border-top:10px solid #1E3A8A}.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:35px;border-bottom:2px solid #e2e8f0;padding-bottom:18px}.hdr h1{font-size:28px;font-weight:800;color:#0F172A;text-transform:uppercase;letter-spacing:1px;margin:0}.hdr .lb{text-align:right}.hdr .lb h2{font-size:18px;font-weight:800;color:#1E3A8A;margin:0}.hdr .lb p{font-size:11px;color:#64748b;margin:4px 0 0}.mb{background:#F8FAFC;padding:20px;border-radius:10px;border-left:5px solid #FBBF24;margin-bottom:25px;display:grid;grid-template-columns:1fr 1fr;gap:18px}.mi p{font-size:13px;margin:5px 0}.mi .l{color:#64748b;font-weight:500;display:block;font-size:11px;text-transform:uppercase}.mi .v{color:#0F172A;font-weight:700;font-size:15px}.sec{margin-bottom:35px}.sec h2{font-size:20px;font-weight:700;color:#1E3A8A;margin-bottom:14px;border-left:4px solid #1E3A8A;padding-left:10px}.terms ul{padding-left:22px;list-style-type:square}.sg{display:grid;grid-template-columns:1fr 1fr;gap:35px;margin-top:50px}.sb{text-align:center}.sl{border-top:2px solid #0F172A;margin-bottom:10px;width:75%;margin-left:auto;margin-right:auto}.sl p{font-size:13px;color:#64748b;font-weight:600;margin:0}.ftr{margin-top:40px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:18px}@media print{body{background:#fff;padding:0}.doc{box-shadow:none;margin:0;max-width:100%;border-radius:0;border:none}}</style></head><body><div class="doc"><div class="hdr"><div><h1>${dt}</h1><p style="font-size:13px;color:#64748b;margin:5px 0 0">Date: ${date}</p></div><div class="lb"><h2>${st.company_name_en||'SUEUD AL TAAYIRA'}</h2><p>${st.company_name_ar||'صعود الطائرة'}</p><p>${st.phone||''}</p></div></div><div class="mb"><div class="mi"><span class="l">Client</span><span class="v">${name}</span></div><div class="mi"><span class="l">Service Type</span><span class="v">${type}</span></div><div class="mi"><span class="l">Fee / Markup</span><span class="v">${parseFloat(markup||0).toFixed(2)} SAR</span></div><div class="mi"><span class="l">Validity</span><span class="v">30 Days</span></div></div><div class="sec"><h2>Terms & Conditions</h2><div class="terms"><ul>${tl}</ul></div></div><div class="sg"><div class="sb"><div class="sl"></div><p>Authorized Signatory</p><p style="font-size:11px;color:#94a3b8">${st.company_name_en||'SUEUD AL TAAYIRA'}</p></div><div class="sb"><div class="sl"></div><p>Client Acceptance</p><p style="font-size:11px;color:#94a3b8">${name}</p></div></div><div class="ftr"><p>© ${new Date().getFullYear()} ${st.company_name_en||'SUEUD AL TAAYIRA'}. All rights reserved.</p></div></div></div></body></html>`;
};

/* ═════════════════════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */
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
  const csv = [headers.join(','), ...data.map(row => headers.map(h => { let val = row[h] ?? ''; if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) { val = `"${val.replace(/"/g, '""')}"`; } return val; }).join(','))].join('\n')].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
};

/* ═════════════════════════════════════════════════════════════════════════════════════
   DRAFT MANAGEMENT — Save/Load invoice drafts to localStorage
   ═════════════════════════════════════════════════════════════════════════════════════ */
const DRAFT_KEY = 'erp_invoice_drafts';

const saveDraft = (invForm) => {
  try {
    const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
    const draft = { ...invForm, savedAt: new Date().toISOString(), id: Date.now() };
    drafts.unshift(draft);
    if (drafts.length > 10) drafts.length = 10;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
    return true;
  } catch (e) { console.warn('Draft save failed:', e); return false; }
};

const loadDrafts = () => {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || []; }
  catch (e) { return []; }
};

const deleteDraft = (id) => {
  try {
    const drafts = loadDrafts().filter(d => d.id !== id);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
  } catch (e) { console.warn('Draft delete failed:', e); }
};

/* ═════════════════════════════════════════════════════════════════════════════════════════════════
   RECENT VIEWS — Track recently viewed invoices
   ═══════════════════════════════════════════════════════════════════════════════════════════ */
const RECENT_KEY = 'erp_recent_views';

const addRecentView = (invoice) => {
  try {
    const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || [];
    const entry = { id: invoice.id || invoice.invoice_no, no: invoice.invoice_no, customer: invoice.customers?.name || invoice.corporates?.name, total: invoice.total, date: invoice.invoice_date, viewedAt: new Date().toISOString() };
    const filtered = recent.filter(r => r.id !== (invoice.id || invoice.invoice_no));
    filtered.unshift(entry);
    if (filtered.length > 20) filtered.length = 20;
    localStorage.setItem(RECENT_KEY, JSON.stringify(filtered));
  } catch (e) { console.warn('Recent view save failed:', e); }
};

const loadRecentViews = () => {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || []; }
  catch (e) { return []; }
};

/* ═════════════════════════════════════════════════════════════════════════════════════════════════════════
   AUTO-GENERATE INVOICE NUMBER — sequential format INV-0001, INV-0002...
   ═════════════════════════════════════════════════════════════════════════════════════════════════ */
const getNextInvoiceNo = (invoices) => {
  const numList = invoices
    .filter(i => !i.invoice_no.startsWith('REF-') && i.status !== 'Draft' && i.status !== 'Recurring')
    .map(i => {
      const num = parseInt(i.invoice_no.replace(/\D/g, ''));
      return isNaN(num) ? 0 : num;
    });
  const maxNum = numList.length > 0 ? Math.max(...numList) : 0;
  const next = maxNum + 1;
  return `INV-${String(next).padStart(5, '0')}`;
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════
   MAIN STATE HOOK — with ALL original states + new features
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const initDone = useRef(false);

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState('');
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState({ type: null, data: null });
  const [toast, setToast] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hello! / مرحباً!' }]);
  const [chatInput, setChatInput] = useState('');
  const [search, setSearch] = useState('');
  const [tblPage, setTblPage] = useState(1);
  const [payFilter, setPayFilter] = useState('All');
  const [previewHTML, setPreviewHTML] = useState('');
  const [repDate, setRepDate] = useState({ from: '', to: '' });
  const [reportTab, setReportTab] = useState('sales');
  const [data, setData] = useState({ invoices:[], customers:[], corporates:[], creditors:[], vendors:[], packages:[], branches:[], portals:[], employees:[], services:[], expenses:[], investments:[], cashbook:[], payroll:[], empAdvances:[], staffMistakes:[], attendance:[], appUsers:[], tenants:[], audits:[], settings:{} });

  const [invForm, setInvForm] = useState({ custType:'Individual', custId:'new', custName:'', custPhone:'', corpId:'new', corpName:'', corpVat:'', corpPhone:'', corpAddress:'', passengers:[''], employeeId:'', portalId:'', bookingDate:today, invoiceDate:today, bookingType:'New Booking', linkedInvId:'', oldTicketNo:'', oldPnr:'', oldAirline:'', oldSector:'', oldSellPrice:0, oldBookingDate:'', oldPassengers:'', oldFlightType:'', oldPaymentMethod:'', refundReason:'', service:'Flight Ticket', flightType:'Domestic', flightJourney:'Single', refundable:'Refundable', flightSector:'', airline:'', destination:'', hotelName:'', checkIn:'', checkOut:'', visaType:'Tourist', serviceName:'', pnr:'', ticketNo:'', qty:1, cost:0, sell:0, discount:0, taxRate:'15', payment:'Cash', paid:'', creditDueDate:'', creditorId:'', tabbyNo:'', tamaraNo:'', ticketStatus:'Confirmed', useCredit:0, creditCustId:'', status:'Unpaid' });
  const [editInvId, setEditInvId] = useState(null);
  const [expForm, setExpForm] = useState({ date:today, category:'General', description:'', payment_mode:'Cash', portal_id:'', items:[{ name:'', amount:0, category:'General' }] });
  const [editExpId, setEditExpId] = useState(null);
  const [custForm, setCustForm] = useState({ name:'', phone:'', store_credit:0 });
  const [editCustId, setEditCustId] = useState(null);
  const [corpForm, setCorpForm] = useState({ name:'', vat_no:'', phone:'', address:'' });
  const [editCorpId, setEditCorpId] = useState(null);
  const [creditorForm, setCreditorForm] = useState({ name:'', phone:'', address:'' });
  const [editCredId, setEditCredId] = useState(null);
  const [vendorForm, setVendorForm] = useState({ name:'', phone:'', balance:0 });
  const [editVendId, setEditVendId] = useState(null);
  const [pkgForm, setPkgForm] = useState({ name:'', price:'', desc:'', duration:'', inclusions:'' });
  const [editPkgId, setEditPkgId] = useState(null);
  const [brnForm, setBrnForm] = useState({ name:'', location:'', phone:'', manager:'', email:'', timing:'', status:'Active' });
  const [editBrnId, setEditBrnId] = useState(null);
  const [empForm, setEmpForm] = useState({ name:'', role:'Sales', salary:0, phone:'', commission_rate:0, iqama_no:'', iqama_expiry:'' });
  const [editEmpId, setEditEmpId] = useState(null);
  const [srvForm, setSrvForm] = useState({ name:'' });
  const [editSrvId, setEditSrvId] = useState(null);
  const [investForm, setInvestForm] = useState({ name:'', phone:'', email:'', invested_amount:0, profit_share_percent:0, editId:null });
  const [portalForm, setPortalForm] = useState({ name:'', portal_type:'GDS', current_balance:0, initial_balance:0, phone:'', contact_person:'', credit_limit:0 });
  const [settleForm, setSettleForm] = useState({ id:'', date:today, mode:'Cash' });
  const [refundForm, setRefundForm] = useState({ id:'', date:today, compRefund:0, custRefund:0, mode:'Cash', reason:'', portalId:'', creditBalance:0 });
  const [transferForm, setTransferForm] = useState({ from:'Cash', to:'Bank', amount:0, date:today, description:'' });
  const [passForm, setPassForm] = useState({ newPass:'' });
  const [userForm, setUserForm] = useState({ username:'', email:'', is_admin:false, can_access_hr:false, can_access_bank:false, can_access_invoices:true, can_access_reports:false, can_access_settings:false });
  const [editUserId, setEditUserId] = useState(null);
  const [tenantForm, setTenantForm] = useState({ agency_name:'', owner_email:'', subscription_end_date:'', company_name_ar:'', vat_no:'', cr_no:'', phone:'', address_ar:'' });
  const [profileForm, setProfileForm] = useState({ username:'', avatar_url:'', phone:'', address:'' });
  const [setForm, setSetForm] = useState({ company_name_en:'', company_name_ar:'', address_ar:'', phone:'', vat_no:'', cr_no:'', license_no:'', logo_url:'', invoice_footer:'', tourism_license_no:'', website:'', custom_fields:[] });
  const [payForm, setPayForm] = useState({ employee_id:'', month:today.slice(0,7), overtime:0, gift:0, advance:0, mistakes_deduction:0, other_deduction:0, payment_mode:'Cash', payment_date:today, notes:'' });
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState(0);
  const [contractTerms, setContractTerms] = useState('');

  // ═══ NEW STATE: Theme, Drafts, Recent Views, Table Settings ═══
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('erp_theme') || 'light';
    return 'light';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('erp_sidebar_collapsed') === 'true';
    return false;
  });
  const [tableDensity, setTableDensity] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('erp_table_density') || 'comfortable';
    return 'comfortable';
  });
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('erp_font_size') || '14';
    return '14';
  });
  const [notifSound, setNotifSound] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('erp_notif_sound') !== 'false';
    return true;
  });

  const t = useMemo(() => translations[lang] || translations.en, [lang]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (notifSound) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const playBeep = () => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency = 800;
          osc.connect(ctx.destination);
          osc.start();
          setTimeout(() => { osc.stop(); }, 120);
        };
        playBeep();
      } catch(e) { /* silent fail */ }
    }
    setTimeout(() => setToast(''), 3000);
  }, [notifSound]);

  const logAction = useCallback(async (action) => {
    try { if (userProfile?.tenant_id) await supabase.from('audits').insert([{ action, user_id: userProfile.id, tenant_id: userProfile.tenant_id, created_at: new Date().toISOString() }]); } catch (e) { console.warn('Audit:', e.message); }
  }, [userProfile]);

  const fetchAll = useCallback(async (tenantId) => {
    if (!tenantId) return;
    try {
      const [i,c,co,cr,v,p,b,po,e,s,ex,cb,pa,ms,at,se,ad] = await Promise.all([
        supabase.from('invoices').select('*, customers(name,phone), corporates(name), employees(name)').eq('tenant_id', tenantId).order('invoice_date',{ascending:false}),
        supabase.from('customers').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('corporates').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('creditors').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('vendors').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('packages').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('branches').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('portals').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('employees').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('services').select('*').eq('tenant_id', tenantId).order('name'),
        supabase.from('expenses').select('*').eq('tenant_id', tenantId).order('expense_date',{ascending:false}),
        supabase.from('cashbook').select('*').eq('tenant_id', tenantId).order('trans_date',{ascending:false}).limit(500),
        supabase.from('payroll').select('*, employees(name,role)').eq('tenant_id', tenantId).order('month',{ascending:false}),
        supabase.from('staff_mistakes').select('*, employees(name,role)').eq('tenant_id', tenantId).order('date',{ascending:false}),
        supabase.from('attendance').select('*, employees(name)').eq('tenant_id', tenantId).order('date',{ascending:false}),
        supabase.from('settings').select('*').eq('tenant_id', tenantId).maybeSingle(),
        supabase.from('emp_advances').select('*').eq('tenant_id', tenantId).order('date',{ascending:false})
      ]);
      setData(prev => ({...prev, invoices:i.data||[], customers:c.data||[], corporates:co.data||[], creditors:cr.data||[], vendors:v.data||[], packages:p.data||[], branches:b.data||[], portals:po.data||[], employees:e.data||[], services:s.data||[], expenses:ex.data||[], cashbook:cb.data||[], payroll:pa.data||[], staffMistakes:ms.data||[], attendance:at.data||[], settings:se.data||{}, empAdvances:ad.data||[]}));
    } catch (err) { console.error('fetchAll:', err); }
  }, []);

  // Persist theme, sidebar, table settings
  useEffect(() => { localStorage.setItem('erp_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('erp_sidebar_collapsed', String(sidebarCollapsed)); }, [sidebarCollapsed]);
  useEffect(() => { localStorage.setItem('erp_table_density', tableDensity); }, [tableDensity]);
  useEffect(() => { localStorage.setItem('erp_font_size', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('erp_notif_sound', String(notifSound)); }, [notifSound]);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    const init = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!url || url.includes('dummy')) { setInitError('NEXT_PUBLIC_SUPABASE_URL not set in Vercel Environment Variables.'); setLoading(false); return; }
        const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
        if (authErr) { setInitError('Auth error: ' + authErr.message); setLoading(false); router.push('/login'); return; }
        if (!authUser) { setLoading(false); router.push('/login'); return; }
        setUser(authUser);
        const { data: profile, error: pErr } = await supabase.from('app_users').select('*').eq('id', authUser.id).maybeSingle();
        if (pErr) { setInitError('Profile error: ' + pErr.message); setLoading(false); return; }
        if (!profile) { setInitError('No profile found for your account. Contact admin.'); setLoading(false); return; }
        if (!profile.is_super_admin) {
          const { data: tenant } = await supabase.from('tenants').select('is_paid, subscription_end_date').eq('id', profile.tenant_id).maybeSingle();
          if (tenant && !tenant.is_paid && tenant.subscription_end_date && new Date(tenant.subscription_end_date) < new Date()) { setInitError('Subscription expired on ' + tenant.subscription_end_date); setLoading(false); router.push('/subscription'); return; }
        }
        setUserProfile(profile);
        setProfileForm({ username: profile.username||'', avatar_url: profile.avatar_url||'', phone: profile.phone||'', address: profile.address||'' });
        await fetchAll(profile.tenant_id);
        setLoading(false);
      } catch (err) { console.error('Init:', err); setInitError('Failed: ' + err.message); setLoading(false); }
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => { if (event === 'SIGNED_OUT') { setUser(null); setUserProfile(null); router.push('/login'); } });
    return () => { subscription.unsubscribe(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    user, setUser, userProfile, setUserProfile, loading, setLoading, initError,
    lang, setLang, t, tr: t, page, setPage, modal, setModal, toast, setToast, showToast,
    chatOpen, setChatOpen, chatMessages, setChatMessages, chatInput, setChatInput,
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
    investForm, setInvestForm,
    portalForm, setPortalForm,
    settleForm, setSettleForm,
    refundForm, setRefundForm,
    transferForm, setTransferForm,
    passForm, setPassForm,
    userForm, setUserForm, editUserId, setEditUserId,
    tenantForm, setTenantForm,
    profileForm, setProfileForm,
    setForm, setSetForm,
    payForm, setPayForm,
    contractCorpName, setContractCorpName, contractType, setContractType, contractMarkup, setContractMarkup, contractTerms, setContractTerms,
    filterData, exportToExcel,
    getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getContractHTML, getMistakeHTML,
    saveDraft, loadDrafts, deleteDraft, addRecentView, loadRecentViews, getNextInvoiceNo,
    theme, setTheme, sidebarCollapsed, setSidebarCollapsed, tableDensity, setTableDensity, fontSize, setFontSize, notifSound, setNotifSound,
    today
  };
}
