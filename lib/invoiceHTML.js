'use client';

/* ═══════════════════════════════════════════════════════════════
   AIRLINE CHECK-IN URL MAPPER
   ═══════════════════════════════════════════════════════════════ */
export const getAirlineCheckInURL = (airline, pnr) => {
  if (!airline || !pnr) return null;
  const a = airline.toLowerCase();
  const urls = {
    'saudia': `https://www.saudia.com/check-in?pnr=${pnr}`,
    'sv': `https://www.saudia.com/check-in?pnr=${pnr}`,
    'flynas': `https://www.flynas.com/en/manage-booking?ref=${pnr}`,
    'xy': `https://www.flynas.com/en/manage-booking?ref=${pnr}`,
    'flyadeal': `https://www.flyadeal.com/en/manage-booking?ref=${pnr}`,
    'f3': `https://www.flyadeal.com/en/manage-booking?ref=${pnr}`,
    'gulf air': `https://www.gulfair.com/check-in?pnr=${pnr}`,
    'gf': `https://www.gulfair.com/check-in?pnr=${pnr}`,
    'emirates': `https://www.emirates.com/manage-booking/retrieve-check-in?pnr=${pnr}`,
    'ek': `https://www.emirates.com/manage-booking/retrieve-check-in?pnr=${pnr}`,
    'etihad': `https://www.etihad.com/en-us/manage-booking/check-in?pnr=${pnr}`,
    'ey': `https://www.etihad.com/en-us/manage-booking/check-in?pnr=${pnr}`,
    'qatar': `https://www.qatarairways.com/en/check-in.html?pnr=${pnr}`,
    'qr': `https://www.qatarairways.com/en/check-in.html?pnr=${pnr}`,
    'egyptair': `https://www.egyptair.com/en/Manage-Booking/Check-In?pnr=${pnr}`,
    'ms': `https://www.egyptair.com/en/Manage-Booking/Check-In?pnr=${pnr}`,
    'royal jordanian': `https://www.rj.com/en/manage-booking?pnr=${pnr}`,
    'rj': `https://www.rj.com/en/manage-booking?pnr=${pnr}`,
    'middle east': `https://www.meairlines.com/en/ManageBooking?pnr=${pnr}`,
    'me': `https://www.meairlines.com/en/ManageBooking?pnr=${pnr}`,
    'pakistan': `https://www.piac.com.pk/manage-booking?pnr=${pnr}`,
    'pk': `https://www.piac.com.pk/manage-booking?pnr=${pnr}`,
    'oman air': `https://www.omanair.com/manage-booking?pnr=${pnr}`,
    'wy': `https://www.omanair.com/manage-booking?pnr=${pnr}`,
    'kuwait': `https://www.kuwaitairways.com/en/manage-booking?pnr=${pnr}`,
    'air arabia': `https://www.airarabia.com/manage-booking?pnr=${pnr}`,
    'g9': `https://www.airarabia.com/manage-booking?pnr=${pnr}`,
    'wizz air': `https://wizzair.com/en-gb/manage-booking?pnr=${pnr}`,
    'w6': `https://wizzair.com/en-gb/manage-booking?pnr=${pnr}`,
    'pegasus': `https://www.flypgs.com/en/manage-booking?pnr=${pnr}`,
    'pc': `https://www.flypgs.com/en/manage-booking?pnr=${pnr}`,
    'turkish': `https://www.turkishairlines.com/en-us/check-in?pnr=${pnr}`,
    'tk': `https://www.turkishairlines.com/en-us/check-in?pnr=${pnr}`,
    'indigo': `https://www.goindigo.in/manage-booking?pnr=${pnr}`,
    '6e': `https://www.goindigo.in/manage-booking?pnr=${pnr}`,
    'spicejet': `https://www.spicejet.com/manage-booking?pnr=${pnr}`,
    'sg': `https://www.spicejet.com/manage-booking?pnr=${pnr}`,
    'air india': `https://www.airindia.in/manage-booking?pnr=${pnr}`,
    'ai': `https://www.airindia.in/manage-booking?pnr=${pnr}`,
    'air cairo': `https://www.aircairo.com/en/manage-booking?pnr=${pnr}`,
    'nile air': `https://www.nileair.com/en/manage-booking?pnr=${pnr}`,
    'np': `https://www.nileair.com/en/manage-booking?pnr=${pnr}`,
    'salam air': `https://www.salamair.com/manage-booking?pnr=${pnr}`,
    'ov': `https://www.salamair.com/manage-booking?pnr=${pnr}`,
    'jazeera': `https://www.jazeeraairways.com/en/manage-booking?ref=${pnr}`,
    'j9': `https://www.jazeeraairways.com/en/manage-booking?ref=${pnr}`,
    'flydubai': `https://www.flydubai.com/en/manage-booking?ref=${pnr}`,
    'fz': `https://www.flydubai.com/en/manage-booking?ref=${pnr}`,
    'virgin': `https://www.virginatlantic.com/check-in?pnr=${pnr}`,
    'vs': `https://www.virginatlantic.com/check-in?pnr=${pnr}`
  };
  for (const [key, url] of Object.entries(urls)) {
    if (a.includes(key)) return url;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(airline + ' online check in pnr ' + pnr)}`;
};

/* ═══════════════════════════════════════════════════════════════
   AI FOOTER MESSAGES
   ═══════════════════════════════════════════════════════════════ */
export const getAIMessage = (inv, lang = 'en', type = 'invoice') => {
  const pools = {
    invoice: [
      { en: '✈️ Wishing you a wonderful journey! Safe travels.', ar: '✈️ نتمنى لك رحلة سعيدة! سفر آمن.' },
      { en: '🌟 Your trust means the world to us. Amazing trip!', ar: '🌟 ثقتكم تعني لنا كل شيء. رحلة رائعة!' },
      { en: "🏔️ Explore the world with confidence. We're here!", ar: '🏔️ استكشف العالم بثقة. نحن هنا!' },
      { en: '🕌 Wishing you a blessed and safe journey.', ar: '🕌 نتمنى لك رحلة مباركة وسفر آمن.' },
      { en: '🌴 Whether business or leisure, enjoy your trip!', ar: '🌴 سواء أعمال أو ترفيه، استمتعوا!' },
      { en: '💎 Premium service, unforgettable experiences.', ar: '💎 خدمة مميزة، تجارب لا تُنسى.' },
      { en: '🌏 The world is your destination. Let us help!', ar: '🌏 العالم وجهتكم. دعونا نساعد!' },
      { en: '⭐ Your satisfaction is our mission. Safe travels!', ar: '⭐ رضاكم مهمتنا. سفر آمن!' },
      { en: '🎭 Making travel dreams come true!', ar: '🎭 نحقق أحلام سفركم!' },
      { en: '🌅 New horizons await! Thank you!', ar: '🌅 آفاق جديدة تنتظركم! شكراً!' },
      { en: "🏨 From flights to hotels, we've got you!", ar: '🏨 من الرحلات إلى الفنادق، نحن هنا!' },
      { en: '🎊 Another successful booking. Safe travels!', ar: '🎊 حجز ناجح. سفر آمن!' }
    ],
    refund: [
      { en: '🔄 Your refund has been processed. Thank you for your patience.', ar: '🔄 تمت معالجة استرجاعكم. شكراً لصبركم.' },
      { en: "💳 We hope to serve your travel needs again soon.", ar: '💳 نتطلع لخدمتكم مجدداً قريباً.' },
      { en: "🤝 Your satisfaction matters — we're here for your next trip.", ar: '🤝 رضاكم يهمنا — نحن هنا لرحلتكم القادمة.' }
    ],
    expense: [
      { en: '📊 Recorded for accurate financial tracking.', ar: '📊 مسجل للمتابعة المالية الدقيقة.' },
      { en: '📁 Filed under company operating expenses.', ar: '📁 مصنف ضمن المصروفات التشغيلية.' }
    ],
    salary: [
      { en: '🙏 Thank you for your hard work and dedication this month.', ar: '🙏 شكراً لجهودكم وتفانيكم هذا الشهر.' },
      { en: '⭐ Your contribution to our team is valued.', ar: '⭐ مساهمتكم في فريقنا محل تقدير.' },
      { en: '💼 Wishing you continued success with us.', ar: '💼 نتمنى لكم استمرار النجاح معنا.' }
    ],
    mistake: [
      { en: "📌 Logged for internal quality tracking — let's aim for zero errors going forward.", ar: '📌 مسجل للمتابعة الداخلية — نهدف لعدم تكرار الأخطاء.' },
      { en: '🎯 Every correction helps us serve customers better.', ar: '🎯 كل تصحيح يساعدنا على خدمة عملائنا بشكل أفضل.' }
    ]
  };
  const messages = pools[type] || pools.invoice;
  const idx = (inv.id?.charCodeAt(0) || 0) % messages.length;
  const msg = messages[idx];
  return lang === 'ar' ? msg.ar : msg.en;
};

/* ═══════════════════════════════════════════════════════════════
   INVOICE HTML GENERATOR
   ═══════════════════════════════════════════════════════════════ */
export const getInvoiceHTML = (inv, s, lang = 'en') => {
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
  let pd = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit' && inv.credit_due_date) pd = `Credit (Due: ${inv.credit_due_date})`;
  const isRe = inv.booking_type === 'Reissue' || inv.booking_type === 'Previous Booking';
  const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A';
  const aiMsg = getAIMessage(inv, lang, 'invoice');
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
.rt span{font-family:'Cairo';font-size:8px}
.rg{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.ri{background:#fff;padding:3px 6px;border-radius:4px;border:1px solid #fde68a}
.ri .l{font-size:7px;color:#92400e;font-weight:600;text-transform:uppercase}.ri .v{font-size:8px;color:#78350f;font-weight:700;margin-top:1px}
.rf{background:#dcfce7;border-color:#86efac;grid-column:span 3;display:flex;justify-content:space-between;align-items:center;padding:4px 8px;border-radius:4px}
.rf .l{color:#059669;font-size:8px}.rf .v{color:#047857;font-size:12px;font-weight:800}
table{width:100%;border-collapse:collapse;border-radius:5px;overflow:hidden;border:1px solid #e2e8f0}
thead th{padding:5px 6px;background:#0c1d3a;color:#fbbf24;font-size:7px;text-transform:uppercase;text-align:${isRTL ? 'right' : 'left'};letter-spacing:0.3px;border-bottom:1.5px solid #fbbf24}
thead th span{font-family:'Cairo';font-size:7px;opacity:0.8;display:block}
thead th.r{text-align:${isRTL ? 'left' : 'right'}}thead th.c{text-align:center}
tbody td{padding:4px 6px;border-bottom:1px solid #f1f5f9;font-size:8px}
tbody td.r{text-align:${isRTL ? 'left' : 'right'};font-weight:600}tbody td.c{text-align:center}
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
    ${st.logo_url ? `<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>` : '<div class="logo" style="display:flex;align-items:center;justify-content:center;font-size:20px">✈️</div>'}
    <div class="ct">
      <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
      <h1>${st.company_name_en || 'SUEUD AL TAAYIRA TRAVEL & TOURISM'}</h1>
      <p>${st.address_ar || 'Address'} ${st.phone ? '| ' + st.phone : ''} ${st.website ? '| ' + st.website : ''}</p>
    </div>
  </div>
  <div class="im">
    <h3>TAX INVOICE<span>فاتورة ضريبية</span></h3>
    <div class="mr"><span class="l">Inv No / رقم</span><span class="v">${no}</span></div>
    <div class="mr"><span class="l">Date / التاريخ</span><span class="v">${inv.invoice_date || ''}</span></div>
    <div class="mr"><span class="l">Booking / الحجز</span><span class="v">${inv.booking_date || ''}</span></div>
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
      ${inv.corporates?.vat_no ? `<div class="ir"><span class="l">VAT / ضريبي</span><span class="v">${inv.corporates.vat_no}</span></div>` : ''}
      <div class="ir"><span class="l">Sales Person / موظف</span><span class="v">${inv.employees?.name || 'N/A'}</span></div>
      <div class="ir"><span class="l">Passengers / الركاب</span><span class="v" style="font-size:7px;line-height:1.4">${pax}</span></div>
    </div>
    <div class="ib" style="border-left-color:#f59e0b;${isRTL ? 'border-left:1px solid #e2e8f0;border-right:3px solid #f59e0b' : ''}">
      <div class="sec-title">FLIGHT DETAILS / تفاصيل الرحلة</div>
      <div class="ir"><span class="l">Airline / الخطوط</span><span class="v">${inv.airline || 'N/A'}</span></div>
      <div class="ir"><span class="l">Sector / القطاع</span><span class="v">${inv.flight_sector || 'N/A'}</span></div>
      <div class="ir"><span class="l">Type / النوع</span><span class="v">${inv.flight_type || 'N/A'}</span></div>
      <div class="ir"><span class="l">Journey / الرحلة</span><span class="v">${inv.flight_journey || 'N/A'}</span></div>
      <div class="ir"><span class="l">PNR / رقم الحجز</span><span class="v" style="color:#2563eb;font-weight:700">${inv.pnr || 'N/A'}</span></div>
      <div class="ir"><span class="l">Ticket No / التذكرة</span><span class="v">${inv.ticket_no || 'N/A'}</span></div>
      <div class="ir"><span class="l">Refundable / قابلة للاسترجاع</span><span class="v">${inv.refundable_status || 'N/A'}</span></div>
      <div class="ir"><span class="l">Service / الخدمة</span><span class="v">${inv.service_type || 'N/A'}</span></div>
    </div>
  </div>
  ${isRe ? `<div class="rb"><div class="rt"><span>⚠️ PREVIOUS BOOKING / الحجز السابق</span><span>تفاصيل</span></div><div class="rg">
    <div class="ri"><div class="l">Old Date</div><div class="v">${inv.old_booking_date || 'N/A'}</div></div>
    <div class="ri"><div class="l">Old Airline</div><div class="v">${inv.old_airline || 'N/A'}</div></div>
    <div class="ri"><div class="l">Old Sector</div><div class="v">${inv.old_sector || 'N/A'}</div></div>
    <div class="ri"><div class="l">Old PNR</div><div class="v">${inv.old_pnr || 'N/A'}</div></div>
    <div class="ri"><div class="l">Old Ticket</div><div class="v">${inv.old_ticket_no || 'N/A'}</div></div>
    <div class="ri"><div class="l">Old Type</div><div class="v">${inv.old_flight_type || 'N/A'}</div></div>
    <div class="rf"><div class="l">Original Fare / الأجرة الأصلية</div><div class="v">${parseFloat(inv.old_sell_price || 0).toFixed(2)} SAR</div></div>
  </div></div>` : ''}
  <table>
    <thead><tr>
      <th>Description<span>الوصف</span></th>
      <th class="c">Qty<span>الكمية</span></th>
      <th class="r">Unit Price<span>سعر الوحدة</span></th>
      <th class="r">Total<span>الإجمالي</span></th>
    </tr></thead>
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
      ${uc > 0 ? `<div class="pr" style="color:#7c3aed"><span>Credit Used / رصيد مستخدم</span><span>- ${uc.toFixed(2)} SAR</span></div>` : ''}
      ${cr > 0 ? `<div class="pr" style="color:#ef4444"><span>Cash Returned / مردود</span><span>- ${cr.toFixed(2)} SAR</span></div>` : ''}
      <div class="pr" style="border-top:1.5px solid #cbd5e1;margin-top:3px;padding-top:3px;font-weight:700"><span>Paid (${pd}) / مدفوع</span><span style="color:#059669">${cp.toFixed(2)} SAR</span></div>
      <div class="pr" style="font-weight:700;font-size:10px"><span>Due / المتبقي</span><span style="color:${due > 0 ? '#ef4444' : '#059669'}">${due.toFixed(2)} SAR</span></div>
    </div>
    <div class="tb">
      <div class="tr"><span>Subtotal / المجموع الفرعي</span><span>${sub.toFixed(2)}</span></div>
      ${disc > 0 ? `<div class="tr" style="color:#34d399"><span>Discount / خصم</span><span>- ${disc.toFixed(2)}</span></div>` : ''}
      <div class="tr"><span>VAT (${vr}%) / ضريبة</span><span>${vat.toFixed(2)}</span></div>
      <div class="gt"><span>GRAND TOTAL</span><span class="v">${tot.toFixed(2)} SAR</span></div>
    </div>
  </div>
  <div class="terms">
    <h4>Terms / الشروط</h4>
    <p>1. Bookings subject to airline/hotel terms. الحجوزات تخضع لشروط الخطوط/الفنادق &nbsp; 2. Cancellation policies vary. سياسات الإلغاء تختلف &nbsp; 3. Computer-generated - valid without signature. مستند آلي صالح بدون توقيع &nbsp; 4. Prices in SAR incl. VAT. الأسعار بالريال شاملة الضريبة &nbsp; 5. Electronic invoice under Fatoorah. فاتورة إلكترونية بموجب لوائح فاتورة</p>
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
    <p>${aiMsg}<span>${lang === 'ar' ? '✈️ رحلة سعيدة!' : 'Safe flight!'}</span></p>
  </div>
  <div class="ft-divider"></div>
  <div class="ft-info">
    <p style="font-weight:700;color:#0f172a;font-size:7px">${st.company_name_en || 'SUEUD AL TAAYIRA'}</p>
    <p>${st.phone || ''}</p>
    <p style="font-family:'Cairo';font-size:7px">${st.company_name_ar || ''}</p>
    <p style="color:#cbd5e1;margin-top:2px">${st.vat_no ? 'VAT: ' + st.vat_no : ''}</p>
  </div>
</div></div></body></html>`;
};

/* ═════════════════════════════════════════════════════════════
   REFUND HTML GENERATOR
   ═════════════════════════════════════════════════════════════ */
export const getRefundHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app/invoice/' + no)}`;
  const airlineInfoTarget = inv.old_airline
    ? `https://www.google.com/search?q=${encodeURIComponent(inv.old_airline + ' airline customer service')}`
    : `https://sueud-al-taayira.vercel.app/invoice/${no}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(airlineInfoTarget)}&scale=2&height=35&barcolor=7c2d12&backgroundcolor=ffffff&includetext=false`;
  const of2 = inv.old_sell_price || inv.total_sell || 0;
  const cRef = inv.refund_customer || 0;
  const compRef = inv.refund_company || 0;
  const airlineFees = of2 - compRef;
  const cn = inv.customers?.name || inv.old_customer_name || 'N/A';
  const cp = inv.customers?.phone || inv.old_customer_phone || 'N/A';
  const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : (inv.old_passengers || 'N/A');
  let rm = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit') rm = 'Credit for New Booking / رصيد لحجز جديد';
  const aiMsg = getAIMessage(inv, lang, 'refund');
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Refund ${no}</title>
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
.ct p{font-size:8px;color:rgba(255,255,255,0.6);line-height:1.5;margin:3px 0 0}
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
.barcode-img{height:28px;width:auto;min-width:150px;border:1px solid #fecaca;padding:1px 4px;background:#fff;border-radius:2px}
.code-box{display:flex;align-items:center;gap:6px}
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
    ${st.logo_url ? `<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>` : '<div class="logo" style="display:flex;align-items:center;justify-content:center;font-size:20px">✈️</div>'}
    <div class="ct"><h2>${st.company_name_ar || 'صعود الطائرة'}</h2><h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1><p>${st.address_ar || ''} ${st.phone ? '| ' + st.phone : ''}</p></div>
  </div>
  <div class="im"><h3>REFUND<span>استرجاع</span></h3><div class="ino">No / رقم: <span>${no}</span></div><div class="ino">Date / التاريخ: <span>${inv.refund_date || inv.invoice_date || ''}</span></div><div class="sb">PROCESSED / تم</div></div>
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
  <div class="pi"><span style="font-weight:600;color:#334155">Refund Method / طريقة الاسترجاع</span><span style="font-weight:600;color:#2563eb">${rm}</span></div>
</div>
<div class="ft">
  <div class="code-box"><img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/><div class="code-label">AIRLINE INFO<span>معلومات الخطوط</span></div><img src="${qr}" alt="QR" class="qr-img" crossorigin="anonymous"/><div class="code-label">DOWNLOAD<span>تحميل</span></div></div>
  <div class="ft-divider"></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI</div><p>${aiMsg}<span>${lang === 'ar' ? '🔄 تم الاسترجاع' : 'Refund processed!'}</span></p></div>
  <div class="ft-divider"></div>
  <div class="ft-info"><p style="font-weight:700;color:#7f1d1d">${st.company_name_en || ''}</p><p>${st.phone || ''}</p><p style="font-family:'Cairo'">${st.company_name_ar || ''}</p></div>
</div></div></body></html>`;
};

/* ═════════════════════════════════════════════════════════════
   EXPENSE HTML GENERATOR
   ═══════════════════════════════════════════════════════════ */
export const getExpenseHTML = (exp, s, lang = 'en') => {
  const st = s || {};
  const eno = `EXP-${exp.id ? exp.id.substring(0, 8) : 'N/A'}`;
  const items = exp.items && exp.items.length > 0 ? exp.items : [{ name: exp.item_name || 'Item', qty: 1, price: exp.amount || 0 }];
  const aiMsg = getAIMessage(exp, lang, 'expense');
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(eno)}&scale=2&height=35&barcolor=7c2d12&backgroundcolor=ffffff&includetext=false`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(eno + ' - ' + (exp.category || exp.description || ''))}`;
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Expense ${eno}</title>
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
thead th{padding:5px 6px;background:#7c2d12;color:#fbbf24;font-size:7px;text-transform:uppercase;text-align:${isRTL ? 'right' : 'left'};letter-spacing:0.5px}
thead th span{font-family:'Cairo';font-size:7px;opacity:0.8;display:block}
thead th.r{text-align:${isRTL ? 'left' : 'right'}}
tbody td{padding:4px 6px;border-bottom:1px solid #f1f5f9;font-size:8px}
tbody td.r{text-align:${isRTL ? 'left' : 'right'};font-weight:600}
.totals{background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;padding:12px 16px;border-radius:6px;display:flex;justify-content:space-between;align-items:center}
.totals h3{margin:0;text-transform:uppercase;font-size:10px}.totals .amt{font-size:20px;font-weight:800;margin:0;color:#fbbf24}
.ft{padding:8px 16px;background:linear-gradient(135deg,#fff7ed,#ffedd5);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #fed7aa;gap:8px;margin-top:auto}
.ai-msg{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#fff7ed,#fed7aa);border-radius:6px;border:1px solid #fdba74}
.ai-msg p{font-size:8px;color:#7c2d12;margin:0;line-height:1.4;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:8px;margin-top:1px}
.ai-label{font-size:6px;color:#9a3412;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.ft-info{width:70px;text-align:center}
.ft-info p{font-size:6px;color:#94a3b8;margin:1px 0}
.code-box{display:flex;align-items:center;gap:6px}
.barcode-img{height:26px;width:auto;min-width:140px;border:1px solid #fed7aa;padding:1px 4px;background:#fff;border-radius:2px}
.qr-img{height:32px;width:32px;border:1px solid #fed7aa;padding:1px;background:#fff;border-radius:3px}
.code-label{font-size:6px;font-weight:700;text-transform:uppercase;text-align:center;color:#7c2d12;line-height:1.2}
.code-label span{font-family:'Cairo';display:block;font-size:6px;color:#9a3412}
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
    <thead><tr><th>Item / البند<span>الوصف</span></th><th class="r">Qty<span>الكمية</span></th><th class="r">Price<span>السعر</span></th><th class="r">Total<span>المجموع</span></th></tr></thead>
    <tbody>${items.map(function(it) { return '<tr><td>' + (it.name || 'Item') + '</td><td class="r">' + (it.qty || 1) + '</td><td class="r">' + parseFloat(it.price || 0).toFixed(2) + '</td><td class="r">' + ((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)).toFixed(2) + '</td></tr>'; }).join('')}</tbody>
  </table>
  <div class="totals"><h3>TOTAL / الإجمالي</h3><p class="amt">${(exp.amount || 0).toFixed(2)} SAR</p></div>
</div>
<div class="ft">
  <div class="code-box"><img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/><div class="code-label">EXPENSE REF<span>مرجع المصروف</span></div><img src="${qr}" alt="QR" class="qr-img" crossorigin="anonymous"/><div class="code-label">VERIFY<span>تحقق</span></div></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI</div><p>${aiMsg}<span>${lang === 'ar' ? '📝 سند مصروفات' : 'Expense voucher'}</span></p></div>
  <div class="ft-info"><p style="font-weight:700;color:#7c2d12">${st.company_name_en || ''}</p><p>${st.phone || ''}</p></div>
</div>
</div></body></html>`;
};

/* ═════════════════════════════════════════════════════════════════
   SALARY SLIP HTML GENERATOR (COMPLETE - Previously Incomplete)
   ═══════════════════════════════════════════════════════════════ */
export const getSalarySlipHTML = (pay, s, lang = 'en') => {
  const st = s || {};
  const sno = `SLIP-${pay.id ? pay.id.substring(0, 8) : 'N/A'}`;
  const gross = (pay.salary || pay.base_salary || 0) + (pay.commission_amount || 0) + (pay.overtime || 0) + (pay.gift || 0);
  const tded = (pay.advance_deduction || 0) + (pay.mistakes_deduction || 0) + (pay.other_deduction || 0);
  const net = gross - tded;
  const aiMsg = getAIMessage(pay, lang, 'salary');
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(sno)}&scale=2&height=35&barcolor=0F172A&backgroundcolor=ffffff&includetext=false`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(sno + ' - ' + (pay.employees?.name || '') + ' - ' + (pay.month || ''))}`;
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Slip ${sno}</title>
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
.code-box{display:flex;align-items:center;gap:6px}
.barcode-img{height:26px;width:auto;min-width:140px;border:1px solid #BFDBFE;padding:1px 4px;background:#fff;border-radius:2px}
.qr-img{height:32px;width:32px;border:1px solid #BFDBFE;padding:1px;background:#fff;border-radius:3px}
.code-label{font-size:6px;font-weight:700;text-transform:uppercase;text-align:center;color:#1E3A8A;line-height:1.2}
.code-label span{font-family:'Cairo';display:block;font-size:6px;color:#3B82F6}
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
    <div class="ib earn"><div class="sec-title">EARNINGS / الإيرادات</div>
      <div class="row"><span class="l">Base Salary / الراتب الأساسي</span><span class="v">${(pay.salary || pay.base_salary || 0).toFixed(2)} SAR</span></div>
      <div class="row"><span class="l">Commission / العمولة</span><span class="v">${(pay.commission_amount || pay.commission || 0).toFixed(2)} SAR</span></div>
      <div class="row"><span class="l">Overtime / إضافي</span><span class="v">${(pay.overtime || 0).toFixed(2)} hrs</span></div>
      <div class="row"><span class="l">Gift/Bonus / هدية</span><span class="v">${(pay.gift || 0).toFixed(2)} SAR</span></div>
    </div>
    <div class="ib ded"><div class="sec-title">DEDUCTIONS / الخصومات</div>
      <div class="row"><span class="l">Advance Deduct / خصم سلفة</span><span class="v">${(pay.advance_deduction || 0).toFixed(2)} SAR</span></div>
      <div class="row"><span class="l">Mistakes Deduct / خصم أخطاء</span><span class="v">${(pay.mistakes_deduction || 0).toFixed(2)} SAR</span></div>
      <div class="row"><span class="l">Other Deduct / خصم أخرى</span><span class="v">${(pay.other_deduction || 0).toFixed(2)} SAR</span></div>
    </div>
    <div class="ib"><div class="sec-title">NET PAY / صافي صافي</div>
      <div class="row" style="border-top:2px solid #059669;margin-top:4px;padding-top:4px"><span class="l">Net Salary / الراتب الصافي</span><span style="color:#059669;font-size:12px;font-weight:800">${net.toFixed(2)} SAR</span></div>
    </div>
  </div>
</div>
<div class="ft">
  <div class="code-box"><img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/><div class="code-label">SLIP REF<span>مرجع القسيمة</span></div><img src="${qr}" alt="QR" class="qr-img" crossorigin="anonymous"/><div class="code-label">VERIFY<span>تحقق</span></div></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI</div><p>${aiMsg}<span>${lang === 'ar' ? '💰 راتب تم تحويل' : 'Salary paid!'}</span></p></div>
  <div class="ft-info"><p style="font-weight:700;color:#0F172A">${st.company_name_en || ''}</p></div>
</div>
</div></body></html>`;
};

/* ═════════════════════════════════════════════════════════════════
   CONTRACT HTML GENERATOR (NEW - Not in original pasted content)
   ═══════════════════════════════════════════════════════════════ */
export const getContractHTML = (settings, corpName, date, isOffer = false, serviceType = 'Flight Tickets', markup = '10', terms = '') => {
  const s = settings || {};
  const docType = isOffer ? 'CORPORATE OFFER' : 'CORPORATE CONTRACT';
  const refNo = `${isOffer ? 'OFR' : 'CTR'}-${Date.now()}`;
  const aiPool = isOffer
    ? ['We look forward to a rewarding partnership.', 'This offer reflects our best rates for you.', 'Thank you for considering us for your travel needs.']
    : ['We value long-term partnerships built on trust.', 'Our team is committed to your service excellence.', 'Looking forward to a successful collaboration.'];
  const aiMsg = aiPool[refNo.length % aiPool.length];
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(refNo)}&scale=2&height=35&barcolor=1e3a8a&backgroundcolor=ffffff&includetext=false`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(refNo + ' - ' + (corpName || ''))}`;
  const isRTL = false;
  const dir = isRTL ? 'rtl' : 'ltr';
  const effectiveTerms = terms || `1. Payment Terms: 100% advance payment required to confirm the booking.\n2. Validity: This document is valid for 30 days from the date of issue.\n3. Refund Policy: All cancellations are subject to airline/hotel cancellation policies.\n4. Prices are subject to change based on availability at the time of final booking.\n5. Passenger names must match exactly as per passport/ID.`;
  return `<!DOCTYPE html><html lang="en" dir="${dir}"><head><meta charset="UTF-8"><title>${docType}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:11px;line-height:1.5}
.doc{width:210mm;height:297mm;margin:auto;background:#fff;border:2px solid #1e3a8a;display:flex;flex-direction:column;position:relative;overflow:hidden}
.doc::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#1e3a8a,#2563eb,#1e3a8a)}
.header{padding:30px;background:linear-gradient(135deg,#1e3a8a,#0f172a);color:#fff;display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:6px}
.logo-area{display:flex;align-items:center;gap:15px}
.logo-img{width:80px;height:80px;border-radius:12px;object-fit:cover;border:3px solid #fbbf24;background:rgba(255,255,255,0.1);padding:3px}
.company-info h1{margin:0;font-size:22px;font-weight:800;color:#fbbf24;font-family:'Cairo'}
.company-info h2{margin:2px 0 0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:2px}
.company-info p{margin:5px 0 0;font-size:10px;color:rgba(255,255,255,0.7);line-height:1.6}
.doc-badge{background:rgba(251,191,36,0.2);color:#fbbf24;padding:8px 20px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-align:center;border:1px solid rgba(251,191,36,0.3)}
.content{padding:30px;flex:1;display:flex;flex-direction:column}
.title{font-size:18px;font-weight:700;color:#1e3a8a;margin:0 0 20px;border-bottom:3px solid #e2e8f0;padding-bottom:10px}
.section{margin-bottom:25px}
.section h3{font-size:14px;font-weight:700;color:#1e3a8a;margin:0 0 12px;border-left:4px solid #2563eb;padding-left:12px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0 20px}
.info-item{background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0}
.info-label{font-size:10px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.info-value{font-size:13px;color:#0f172a;font-weight:600;margin-top:2px}
.terms-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-top:20px}
.terms-box h3{margin:0 0 12px;font-size:14px;font-weight:700;color:#1e3a8a;border-bottom:2px solid #e2e8f0;padding-bottom:8px}
.terms-list{margin:0;padding:0}
.term-item{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #e2e8f0}
.term-num{color:#2563eb;font-weight:700;font-size:14px;min-width:24px}
.term-text{font-size:11px;color:#475569;line-height:1.5}
.ai-box{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #93c5fd;border-radius:8px;padding:12px 16px;margin-top:20px}
.ai-box .ai-label{font-size:9px;color:#3b82f6;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
.ai-box p{font-size:11px;color:#1e3a8a;margin:0}
.signature-area{display:flex;justify-content:space-between;margin-top:auto;padding-top:20px;border-top:2px solid #e2e8f0}
.sig-block{text-align:center;flex:1}
.sig-line{width:200px;height:1px;background:#1e3a8a;margin:0 auto 8px auto}
.sig-name{font-size:13px;font-weight:600;color:#1e3a8a;margin-top:8px}
.sig-role{font-size:11px;color:#64748b}
.footer{padding:14px 30px;background:#f8fafc;border-top:2px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#64748b;gap:10px}
.code-box{display:flex;align-items:center;gap:6px}
.barcode-img{height:26px;width:auto;min-width:150px;border:1px solid #e2e8f0;padding:1px 4px;background:#fff;border-radius:2px}
.qr-img{height:34px;width:34px;border:1px solid #e2e8f0;padding:1px;background:#fff;border-radius:3px}
.code-label{font-size:6px;font-weight:700;text-transform:uppercase;text-align:center;letter-spacing:0.2px;color:#475569;line-height:1.2}
@media print{body{background:#fff;padding:0;margin:0}.doc{border:none;box-shadow:none}}
</style></head><body>
<div class="doc">
<div class="header">
  <div class="logo-area">
    ${s.logo_url ? `<img src="${s.logo_url}" class="logo-img" crossorigin="anonymous"/>` : '<div class="logo-img" style="display:flex;align-items:center;justify-content:center;font-size:30px;background:#fbbf24;border-radius:10px;width:80px;height:80px">✈️</div>'}
    <div class="company-info">
      <h1>${s.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h1>
      <h2>${s.company_name_en || 'SUEUD AL TAAYIRA TRAVEL & TOURISM'}</h2>
      <p>${s.address_ar || 'Address'} ${s.phone ? '| ' + s.phone : ''} ${s.website ? '| ' + s.website : ''}</p>
    </div>
  </div>
  <div class="doc-badge">${docType}<br/><span style="font-size:9px;opacity:0.8">${refNo}</span></div>
</div>
<div class="content">
  <div class="title">${isOffer ? 'Corporate Offer Letter' : 'Corporate Service Agreement'}</div>
  <div class="section">
    <h3>Parties Involved / الأطراف المتعاقدة</h3>
    <div class="info-grid">
      <div class="info-item"><div class="info-label">Service Provider / مزود الخدمة</div><div class="info-value">${s.company_name_en || 'Company Name'}</div></div>
      <div class="info-item"><div class="info-label">Client / العميل</div><div class="info-value">${corpName || 'Client Name'}</div></div>
      <div class="info-item"><div class="info-label">Date / التاريخ</div><div class="info-value">${date}</div></div>
      <div class="info-item"><div class="info-label">Validity / الصلاحية</div><div class="info-value">30 Days from issue date</div></div>
    </div>
  </div>
  <div class="section">
    <h3>Service Details / تفاصيل الخدمة</h3>
    <div class="info-grid">
      <div class="info-item"><div class="info-label">Service Type / نوع الخدمة</div><div class="info-value">${serviceType}</div></div>
      <div class="info-item"><div class="info-label">Service Fee / رسوم الخدمة</div><div class="info-value">${parseFloat(markup || 0).toFixed(2)} SAR</div></div>
      <div class="info-item"><div class="info-label">Payment Terms / شروط الدفع</div><div class="info-value">100% Advance Required</div></div>
    </div>
  </div>
  <div class="terms-box">
    <h3>Terms & Conditions / الشروط والأحكام</h3>
    <div class="terms-list">
      ${effectiveTerms.split('\n').map((term, i) => term.trim() ? `<div class="term-item"><span class="term-num">${i + 1}.</span><span class="term-text">${term}</span></div>` : '').join('')}
    </div>
  </div>
  <div class="ai-box"><div class="ai-label">🤖 Note</div><p>${aiMsg}</p></div>
  <div class="signature-area">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-name">Authorized Signatory</div>
      <div class="sig-role">${s.company_name_en || 'Authorized Person'}</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-name">Client Acceptance</div>
      <div class="sig-role">Name & Signature</div>
    </div>
  </div>
</div>
<div class="footer">
  <div class="code-box">
    <img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/>
    <div class="code-label">DOC REF<span>مرجع المستند</span></div>
    <img src="${qr}" alt="QR" class="qr-img" crossorigin="anonymous"/>
    <div class="code-label">VERIFY<span>تحقق</span></div>
  </div>
  <p>© ${new Date().getFullYear()} ${s.company_name_en || 'SUEUD AL TAAYIRA'}. All rights reserved.</p>
  <p style="font-size:9px;color:#94a3b8">Computer-generated - Valid without physical signature (Fatoorah e-invoicing regulations)</p>
</div>
</div>
</body></html>`;
};

/* ═════════════════════════════════════════════════════════════════════
   STAFF MISTAKE HTML GENERATOR (NEW - Not in original pasted content)
   ═══════════════════════════════════════════════════════════════════════ */
export const getMistakeHTML = (m, s, lang = 'en') => {
  const st = s || {};
  const aiMsg = getAIMessage(m, lang, 'mistake');
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Staff Mistake Voucher</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:10px;line-height:1.5}
.doc{width:210mm;height:297mm;margin:auto;border:2px solid #7f1d1d;display:flex;flex-direction:column;position:relative;overflow:hidden}
.doc::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7f1d1d,#991b1b,#dc2626,#7f1d1d)}
.doc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7f1d1d,#dc2626,#991b1b,#7f1d1d)}
.header{padding:20px;background:linear-gradient(135deg,#7f1d1d,#991b1b);color:#fff;display:flex;justify-content:space-between;align-items:center}
.logo-area{display:flex;align-items:center;gap:12px}
.logo-img{width:60px;height:60px;border-radius:10px;object-fit:cover;border:2px solid #fbbf24;background:rgba(255,255,255,0.1);padding:2px}
.company-info h2{margin:0;font-size:18px;font-weight:800;color:#fbbf24;font-family:'Cairo'}
.company-info h1{margin:2px 0 0;font-size:10px;font-weight:600;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:2px}
.company-info p{margin:5px 0 0;font-size:9px;color:rgba(255,255,255,0.7);line-height:1.5}
.doc-badge{background:rgba(251,191,36,0.2);color:#fbbf24;padding:8px 20px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-align:center;border:1px solid rgba(251,191,36,0.3)}
.content{padding:20px;flex:1;display:flex;flex-direction:column;gap:15px}
.title{font-size:18px;font-weight:700;color:#7f1d1d;margin:0 0 15px;border-bottom:3px solid #fecaca;padding-bottom:10px}
.section{margin-bottom:20px}
.section h3{font-size:14px;font-weight:700;color:#7f1d1d;margin:0 0 12px;border-left:4px solid #dc2626;padding-left:12px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0 20px}
.info-item{background:#fff5f5;padding:12px;border-radius:8px;border:1px solid #fecaca}
.info-label{font-size:10px;color:#991b1b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.info-value{font-size:12px;color:#7f1d1d;font-weight:600;margin-top:2px}
.danger-box{background:#fef2f2;border:2px solid #fecaca;border-radius:8px;padding:15px;margin-bottom:15px}
.danger-title{font-size:14px;font-weight:700;color:#dc2626;margin:0 0 8px;display:flex;justify-content:space-between;align-items:center;background:#fef2f2;padding:8px 12px;border-radius:6px}
.danger-row{display:flex;justify-content:space-between;font-size:11px;color:#7f1d1d;padding:4px 0;border-bottom:1px solid #fecaca}
.danger-row:last-child{border:none}
.loss-amount{font-size:24px;font-weight:800;color:#dc2626;text-align:center;margin:10px 0}
.action-row{display:flex;gap:8px;margin-top:12px;justify-content:center}
.action-btn{padding:8px 20px;border-radius:6px;border:none;cursor:pointer;font-weight:600;font-size:12px}
.btn-danger{background:#dc2626;color:#fff}
.btn-info{background:#2563eb;color:#fff}
.footer{padding:15px 20px;background:linear-gradient(135deg,#fff5f5,#fef2f2);border-top:2px solid #fecaca;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#64748b}
.ai-box{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px;text-align:center}
.ai-box .ai-label{font-size:8px;color:#991b1b;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
.ai-box p{font-size:10px;color:#78350f;margin:0;line-height:1.5}
.ai-box p span{font-family:'Cairo';display:block;font-size:10px;margin-top:2px}
.footer p{margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.doc{border:none;box-shadow:none}}
</style></head><body>
<div class="doc">
<div class="header">
  <div class="logo-area">
    ${st.logo_url ? `<img src="${st.logo_url}" class="logo-img" crossorigin="anonymous"/>` : '<div class="logo-img" style="display:flex;align-items:center;justify-content:center;font-size:24px;background:#fbbf24;border-radius:10px;width:60px;height:60px">⚠️</div>'}
    <div class="company-info"><h2>${st.company_name_ar || 'صعود الطائرة'}</h2><h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1><p>${st.address_ar || ''} ${st.phone ? '| ' + st.phone : ''}</p></div>
  </div>
  <div class="doc-badge">STAFF MISTAKE VOUCHER</div>
</div>
<div class="content">
  <div class="title">Staff Mistake / خطأ الموظف</div>
  <div class="section">
    <h3>Mistake Details / تفاصيل الخطأ</h3>
    <div class="info-grid">
      <div class="info-item"><div class="info-label">Date / التاريخ</div><div class="info-value">${m.date || 'N/A'}</div></div>
      <div class="info-item"><div class="info-label">Employee / الموظف</div><div class="info-value">${m.employees?.name || 'N/A'}</div></div>
      <div class="info-item"><div class="info-label">Old Ticket No / التذكرة القديمة</div><div class="info-value">${m.old_ticket_no || 'N/A'}</div></div>
      <div class="info-item"><div class="info-label">New Ticket No / التذكرة الجديدة</div><div class="info-value">${m.new_ticket_no || 'N/A'}</div></div>
    </div>
  </div>
  <div class="danger-box">
    <div class="danger-title">⚠️ FINANCIAL IMPACT</div>
    <div class="danger-row"><span>Ticket Price / سعر التذكرة</span><span style="font-size:14px">${parseFloat(m.old_sell_price || 0).toFixed(2)} SAR</span></div>
    <div class="danger-row"><span>Airline Fees / رسوم الخطوط</span><span style="font-size:14px">- ${((m.old_sell_price || 0) - (m.refund_company || 0)).toFixed(2)} SAR</span></div>
    <div class="danger-row"><span>Customer Refund / استرجاع العميل</span><span style="font-size:14px">${(m.refund_customer || 0).toFixed(2)} SAR</span></div>
  </div>
  <div class="loss-amount">LOSS: ${(m.loss_amount || 0).toFixed(2)} SAR</div>
  </div>
  <div class="section">
    <h3>Deduction Details / تفاصيل الخصم</h3>
    <div class="info-grid" style="grid-template-columns:1fr 1fr">
      <div class="info-item"><div class="info-label">Loss Amount / مبلغ الخسارة</div><div class="info-value" style="color:#dc2626">${(m.loss_amount || 0).toFixed(2)} SAR</div></div>
      <div class="info-item"><div class="info-label">Deduct from Salary / خصم من الراتب</div><div class="info-value" style="color:${m.paid_by_employee ? '#059669' : '#64748b'}">${m.paid_by_employee ? 'YES' : 'NO'}</div></div>
    </div>
  </div>
  <div class="action-row">
    <button class="action-btn btn-danger" onClick="window.print()">🖨️ Print Voucher</button>
    <button class="action-btn btn-info" onClick="window.print()">📄 Download PDF</button>
  </div>
  <div class="ai-box">
    <div class="ai-label">🤖 AI INSIGHT</div>
    <p>${aiMsg}<span>${lang === 'ar' ? '🔄 تم خصم منظور من الراتب' : 'Deduction applied!'}</span></p>
  </div>
  <div style="width:70px"></div>
</div>
</div>
</div></body></html>`;
};
