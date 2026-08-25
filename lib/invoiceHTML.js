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
    'vs': `https://www.virginatlantic.com/check-in?pnr=${pnr}`,
    'skyteam': `https://www.skyteam.com/en/check-in?pnr=${pnr}`,
    'star alliance': `https://www.staralliance.com/en/check-in?pnr=${pnr}`,
    'ounass': `https://www.google.com/search?q=${encodeURIComponent(airline + ' check in ' + pnr)}`
  };
  for (const [key, url] of Object.entries(urls)) {
    if (a.includes(key)) return url;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(airline + ' online check in pnr ' + pnr)}`;
};

/* ═══════════════════════════════════════════════════════════════
   AI FOOTER MESSAGES
   ═══════════════════════════════════════════════════════════════ */
export const getAIMessage = (inv, lang = 'en') => {
  const messages = [
    { en: '✈️ Wishing you a wonderful journey! Safe travels.', ar: '✈️ نتمنى لك رحلة سعيدة! سفر آمن.' },
    { en: '🌟 Your trust means the world to us. Amazing trip!', ar: '🌟 ثقتكم تعني لنا كل شيء. رحلة رائعة!' },
    { en: '🏔️ Explore the world with confidence. We\'re here!', ar: '🏔️ استكشف العالم بثقة. نحن هنا!' },
    { en: '🕌 Wishing you a blessed and safe journey.', ar: '🕌 نتمنى لك رحلة مباركة وسفر آمن.' },
    { en: '🌴 Whether business or leisure, enjoy your trip!', ar: '🌴 سواء أعمال أو ترفيه، استمتعوا!' },
    { en: '💎 Premium service, unforgettable experiences.', ar: '💎 خدمة مميزة، تجارب لا تُنسى.' },
    { en: '🌏 The world is your destination. Let us help!', ar: '🌏 العالم وجهتكم. دعونا نساعد!' },
    { en: '⭐ Your satisfaction is our mission. Safe travels!', ar: '⭐ رضاكم مهمتنا. سفر آمن!' },
    { en: '🎭 Making travel dreams come true!', ar: '🎭 نحقق أحلام سفركم!' },
    { en: '🌅 New horizons await! Thank you!', ar: '🌅 آفاق جديدة تنتظركم! شكراً!' },
    { en: '🏨 From flights to hotels, we\'ve got you!', ar: '🏨 من الرحلات إلى الفنادق، نحن هنا!' },
    { en: '🎊 Another successful booking. Safe travels!', ar: '🎊 حجز ناجح. سفر آمن!' }
  ];
  const idx = (inv.id?.charCodeAt(0) || 0) % messages.length;
  const msg = messages[idx];
  return lang === 'ar' ? msg.ar : msg.en;
};

/* ═══════════════════════════════════════════════════════════════
   INVOICE HTML GENERATOR - FULL A4 WITH NO PROFIT
   ═══════════════════════════════════════════════════════════════ */
export const getInvoiceHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const checkInURL = getAirlineCheckInURL(inv.airline, inv.pnr);
  const invoicePageURL = `https://sueud-al-taayira.vercel.app/invoice/${no}`;
  const barcodeData = checkInURL || `https://www.google.com/search?q=${encodeURIComponent((inv.airline || '') + ' check in ' + (inv.pnr || ''))}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=2&height=40&barcolor=0c1d3a&backgroundcolor=ffffff&includetext=false`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(invoicePageURL)}&color=0c1d3a`;
  const ts = inv.total_sell || 0, disc = inv.discount || 0, sub = ts + disc;
  const vr = inv.vat > 0 && ts > 0 ? Math.round((inv.vat / ts) * 100) : 15;
  const vat = inv.vat || 0, tot = inv.total || 0, paid = inv.paid_amount || 0;
  const uc = inv.used_credit || 0;
  // FIX: Removed cash_return - use remaining_paid instead
  const cp = paid - uc;
  const due = inv.due_amount || 0;
  const up = (inv.qty || 1) > 0 ? ts / inv.qty : ts;
  const st2 = inv.status || (due > 0 ? 'Unpaid' : 'Paid');
  let pd = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit' && inv.credit_due_date) pd = `Credit (Due: ${inv.credit_due_date})`;
  const isRe = inv.booking_type === 'Reissue' || inv.booking_type === 'Previous Booking';
  const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A';
  const aiMsg = getAIMessage(inv, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';
  const textAlignR = isRTL ? 'left' : 'right';
  
  // Credit balance info
  const creditInfo = inv.credit_balance_after !== undefined 
    ? `<div class="pr" style="color:#7c3aed;font-weight:600"><span>Remaining Credit / الرصيد المتبقي</span><span>${(inv.credit_balance_after || 0).toFixed(2)} SAR</span></div>` 
    : '';

  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Invoice ${no}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px;line-height:1.4}
.inv{width:210mm;min-height:297mm;margin:auto;border:2px solid #0c1d3a;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#0c1d3a,#1a365d,#2563eb,#0c1d3a)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#0c1d3a,#2563eb,#1a365d,#0c1d3a)}
.hdr{display:flex;justify-content:space-between;padding:12px 18px;background:linear-gradient(135deg,#0c1d3a,#1a365d);color:#fff;gap:14px;margin-top:6px}
.cblk{display:flex;gap:12px;flex:1;align-items:center}
.logo{width:55px;height:55px;object-fit:cover;border-radius:8px;background:rgba(255,255,255,0.1);padding:3px;border:2px solid rgba(251,191,36,0.4)}
.ct h2{font-size:15px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}
.ct h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1.5px;margin:3px 0 0}
.ct p{font-size:8px;color:rgba(255,255,255,0.6);line-height:1.7;margin:4px 0 0}
.im{min-width:170px;background:rgba(255,255,255,0.06);padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);text-align:${textAlignR}}
.im h3{font-size:20px;font-weight:800;color:#fbbf24;text-transform:uppercase;line-height:1;margin:0}
.im h3 span{font-size:9px;font-family:'Cairo';display:block;margin:3px 0 0;color:rgba(255,255,255,0.8)}
.mr{display:flex;justify-content:space-between;margin-top:4px;font-size:8px;border-bottom:1px dashed rgba(255,255,255,0.15);padding-bottom:3px}
.mr .l{color:rgba(255,255,255,0.6)}.mr .v{color:#fbbf24;font-weight:700}
.sb{display:inline-block;padding:4px 12px;border-radius:14px;font-size:8px;font-weight:700;margin-top:6px;${st2 === 'Unpaid' ? 'background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)' : 'background:rgba(52,211,153,0.2);color:#34d399;border:1px solid rgba(52,211,153,0.3)'}}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:8px 18px;background:#f0f4ff;border-bottom:2px solid #e2e8f0}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:7px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.3px}
.comp-det .cv{font-size:9px;color:#0f172a;font-weight:600}
.body{padding:10px 18px;flex:1;display:flex;flex-direction:column;gap:8px}
.sec-title{font-size:9px;font-weight:700;text-transform:uppercase;color:#0c1d3a;margin-bottom:5px;border-bottom:2px solid #0c1d3a;padding-bottom:4px;letter-spacing:0.5px}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ib{padding:8px 10px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;border-${textAlign === 'right' ? 'right' : 'left'}:4px solid #1a365d}
.ir{display:flex;justify-content:space-between;font-size:8px;padding:3px 0;border-bottom:1px solid #f1f5f9}
.ir:last-child{border:none}.ir .l{color:#64748b}.ir .v{color:#0f172a;font-weight:600;text-align:${textAlignR};max-width:65%;word-break:break-word}
.rb{padding:8px 10px;background:#fffbeb;border-radius:6px;border:1px solid #fde68a;border-${textAlign === 'right' ? 'right' : 'left'}:4px solid #f59e0b}
.rt{font-size:10px;font-weight:700;color:#d97706;margin-bottom:6px;display:flex;justify-content:space-between;background:#fef3c7;padding:5px 10px;border-radius:5px}
.rt span{font-family:'Cairo';font-size:8px}
.rg{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.ri{background:#fff;padding:4px 8px;border-radius:5px;border:1px solid #fde68a}
.ri .l{font-size:7px;color:#92400e;font-weight:600;text-transform:uppercase}.ri .v{font-size:9px;color:#78350f;font-weight:700;margin-top:2px}
.rf{background:#dcfce7;border-color:#86efac;grid-column:span 3;display:flex;justify-content:space-between;align-items:center;padding:5px 10px;border-radius:5px}
.rf .l{color:#059669;font-size:9px}.rf .v{color:#047857;font-size:14px;font-weight:800}
table{width:100%;border-collapse:collapse;border-radius:6px;overflow:hidden;border:2px solid #e2e8f0}
thead th{padding:7px 8px;background:#0c1d3a;color:#fbbf24;font-size:8px;text-transform:uppercase;text-align:${textAlign};letter-spacing:0.3px;border-bottom:2px solid #fbbf24}
thead th span{font-family:'Cairo';font-size:7px;opacity:0.8;display:block}
thead th.r{text-align:${textAlignR}}thead th.c{text-align:center}
tbody td{padding:6px 8px;border-bottom:1px solid #f1f5f9;font-size:9px}
tbody td.r{text-align:${textAlignR};font-weight:600}tbody td.c{text-align:center}
tbody tr:last-child td{border-bottom:none}
tbody tr:nth-child(even){background:#f8fafc}
.bs{display:grid;grid-template-columns:1.5fr 1fr;gap:8px}
.pb{padding:8px 10px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0}
.pr{display:flex;justify-content:space-between;font-size:9px;padding:3px 0;border-bottom:1px dashed #cbd5e1}
.pr:last-child{border:none}
.tb{background:#0c1d3a;border-radius:8px;padding:10px 14px;color:#fff;align-self:flex-start}
.tr{display:flex;justify-content:space-between;padding:3px 0;font-size:9px;color:rgba(255,255,255,0.8)}
.gt{display:flex;justify-content:space-between;padding:8px 0 0;margin-top:5px;border-top:2px solid rgba(255,255,255,0.15);font-size:16px;font-weight:800;color:#fff}
.gt .v{color:#fbbf24}
.terms{padding:8px 10px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0}
.terms h4{font-size:8px;color:#64748b;margin:0 0 3px;text-transform:uppercase;letter-spacing:0.5px}
.terms p{font-size:7px;color:#94a3b8;line-height:1.6;margin:0}
.ft{padding:10px 18px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);display:flex;justify-content:space-between;align-items:center;border-top:2px solid #e2e8f0;gap:10px;margin-top:auto;min-height:60px}
.code-box{display:flex;align-items:center;gap:8px}
.barcode-img{height:35px;width:auto;min-width:180px;border:2px solid #e2e8f0;padding:2px 5px;background:#fff;border-radius:4px}
.qr-img{height:45px;width:45px;border:2px solid #e2e8f0;padding:2px;background:#fff;border-radius:5px}
.code-label{font-size:7px;font-weight:700;text-transform:uppercase;text-align:center;letter-spacing:0.3px;color:#475569;line-height:1.3}
.code-label span{font-family:'Cairo';display:block;font-size:7px;color:#0c1d3a}
.code-label.checkin{color:#059669}.code-label.checkin span{color:#047857}
.code-label.download{color:#2563eb}.code-label.download span{color:#1d4ed8}
.ft-divider{width:2px;background:linear-gradient(to bottom,#cbd5e1,#e2e8f0,#cbd5e1);align-self:stretch;min-height:50px;border-radius:1px}
.ai-msg{text-align:center;flex:1;padding:6px 14px;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:8px;border:1px solid #93c5fd}
.ai-msg p{font-size:9px;color:#1e3a8a;margin:0;line-height:1.5;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:9px;margin-top:2px}
.ai-label{font-size:7px;color:#3b82f6;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
.ft-info{width:90px;text-align:center}
.ft-info p{font-size:7px;color:#94a3b8;margin:2px 0}
.no-profit-notice{background:linear-gradient(135deg,#dcfce7,#bbf7d0);border:1px solid #86efac;border-radius:6px;padding:6px 10px;margin-top:auto;display:flex;align-items:center;gap:8px}
.no-profit-notice .icon{font-size:16px}
.no-profit-notice .text{font-size:8px;color:#065f46;line-height:1.4}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none;border-radius:0;box-shadow:none}}
</style></head><body>
<div class="inv">
<div class="hdr">
  <div class="cblk">
    ${st.logo_url ? `<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>` : '<div class="logo" style="display:flex;align-items:center;justify-content:center;font-size:24px">✈️</div>'}
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
      <div class="ir"><span class="l">Passengers / الركاب</span><span class="v" style="font-size:7px;line-height:1.5">${pax}</span></div>
    </div>
    <div class="ib" style="border-${textAlign === 'right' ? 'right' : 'left'}-color:#f59e0b">
      <div class="sec-title">FLIGHT DETAILS / تفاصيل الرحلة</div>
      <div class="ir"><span class="l">Airline / الخطوط</span><span class="v">${inv.airline || 'N/A'}</span></div>
      <div class="ir"><span class="l">Sector / القطاع</span><span class="v">${inv.flight_sector || 'N/A'}</span></div>
      <div class="ir"><span class="l">Type / النوع</span><span class="v">${inv.flight_type || 'N/A'}</span></div>
      <div class="ir"><span class="l">Journey / الرحلة</span><span class="v">${inv.flight_journey || 'N/A'}</span></div>
      <div class="ir"><span class="l">PNR / رقم الحجز</span><span class="v" style="color:#2563eb;font-weight:700">${inv.pnr || 'N/A'}</span></div>
      <div class="ir"><span class="l">Ticket No / التذكرة</span><span class="v">${inv.ticket_no || 'N/A'}</span></div>
      <div class="ir"><span class="l">Refundable / قابلة للاسترجاع</span><span class="v">${inv.refundable_status || 'N/A'}</span></div>
      <div class="ir"><span class="l">Service / الخدمة</span><span class="v">${inv.service_type || 'N/A'}</span></div>
      ${checkInURL ? `<div style="margin-top:6px"><a href="${checkInURL}" target="_blank" style="display:inline-block;padding:5px 12px;background:linear-gradient(135deg,#059669,#047857);color:#fff;text-decoration:none;border-radius:5px;font-size:8px;font-weight:600">✈️ ${isRTL ? 'تسجيل دخول عبر الإنترنت' : 'Online Check-In'} →</a></div>` : ''}
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
  
  <!-- ITEMS TABLE - NO COST/PROFIT SHOWN -->
  <table>
    <thead><tr>
      <th>Description<span>الوصف</span></th>
      <th class="c">Qty<span>الكمية</span></th>
      <th class="r">Unit Price<span>سعر الوحدة</span></th>
      <th class="r">Total<span>الإجمالي</span></th>
    </tr></thead>
    <tbody>
      <tr><td>${inv.flight_sector || inv.sector || inv.service_type || 'Service'}</td><td class="c">${inv.qty || 1}</td><td class="r">${up.toFixed(2)}</td><td class="r">${ts.toFixed(2)}</td></tr>
      ${disc > 0 ? `<tr style="background:#f0fdf4"><td colspan="3" style="text-align:${textAlignR};color:#059669;font-weight:600">Discount / خصم</td><td class="r" style="color:#059669;font-weight:600">- ${disc.toFixed(2)}</td></tr>` : ''}
    </tbody>
  </table>
  
  <div class="bs">
    <div class="pb">
      <div class="sec-title">PAYMENT BREAKDOWN / تفصيل الدفع</div>
      <div class="pr"><span>Subtotal / المجموع الفرعي</span><span style="font-weight:600">${sub.toFixed(2)} SAR</span></div>
      ${disc > 0 ? `<div class="pr" style="color:#059669"><span>Discount / خصم</span><span style="color:#059669">- ${disc.toFixed(2)} SAR</span></div>` : ''}
      <div class="pr"><span>VAT (${vr}%) / ضريبة</span><span>${vat.toFixed(2)} SAR</span></div>
      ${uc > 0 ? `<div class="pr" style="color:#7c3aed"><span>Credit Used / رصيد مستخدم</span><span style="color:#7c3aed">- ${uc.toFixed(2)} SAR</span></div>` : ''}
      <div class="pr" style="border-top:2px solid #cbd5e1;margin-top:4px;padding-top:4px;font-weight:700"><span>Paid (${pd.toFixed(2)}) / مدفوع</span><span style="color:#059669">${cp.toFixed(2)} SAR</span></div>
      <div class="pr" style="font-weight:700;font-size:11px"><span>Due / المتبقي</span><span style="color:${due > 0 ? '#ef4444' : '#059669'}">${due.toFixed(2)} SAR</span></div>
      ${creditInfo}
    </div>
    <div class="tb">
      <div class="tr"><span>Subtotal / المجموع الفرعي</span><span>${sub.toFixed(2)}</span></div>
      ${disc > 0 ? `<div class="tr" style="color:#34d399"><span>Discount / خصم</span><span>- ${disc.toFixed(2)}</span></div>` : ''}
      <div class="tr"><span>VAT (${vr}%) / ضريبة</span><span>${vat.toFixed(2)}</span></div>
      <div class="gt"><span>GRAND TOTAL</span><span class="v">${tot.toFixed(2)} SAR</span></div>
    </div>
  </div>
  
  <!-- NO PROFIT NOTICE -->
  <div class="no-profit-notice">
    <div class="icon">🔒</div>
    <div class="text"><strong>Confidential:</strong> ${isRTL ? 'هذه الفاتورة لا تعرض تكلفة الشراء أو الربح. هذه معلومات داخلية فقط.' : 'This invoice does not display purchase cost or profit. This is internal information only.'}</div>
  </div>
  
  <div class="terms">
    <h4>Terms & Conditions / الشروط والأحكام</h4>
    <p>1. ${isRTL ? 'الحجوزات تخضع لشروط الخطوط/الفنادق' : 'Bookings subject to airline/hotel terms.'} &nbsp; 2. ${isRTL ? 'سياسات الإلغاء تختلف' : 'Cancellation policies vary.'} &nbsp; 3. ${isRTL ? 'مستند آلي صالح بدون توقيع' : 'Computer-generated - valid without signature.'} &nbsp; 4. ${isRTL ? 'الأسعار بالريال شاملة الضريبة' : 'Prices in SAR incl. VAT.'} &nbsp; 5. ${isRTL ? 'فاتورة إلكترونية بموجب لوائح فاتورة' : 'Electronic invoice under Fatoorah regulations.'}</p>
  </div>
</div>
<div class="ft">
  <div class="code-box">
    <div style="text-align:center">
      <img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/>
      <div class="code-label checkin">CHECK-IN BARCODE<span>باركود تسجيل الدخول</span></div>
    </div>
    <div style="text-align:center">
      <img src="${qr}" alt="QR Code" class="qr-img" crossorigin="anonymous"/>
      <div class="code-label download">DOWNLOAD QR<span>تحميل QR</span></div>
    </div>
  </div>
  <div class="ft-divider"></div>
  <div class="ai-msg">
    <div class="ai-label">🤖 AI MESSAGE</div>
    <p>${aiMsg}<span>${lang === 'ar' ? '✈️ رحلة سعيدة!' : 'Safe flight!'}</span></p>
  </div>
  <div class="ft-divider"></div>
  <div class="ft-info">
    <p style="font-weight:700;color:#0f172a;font-size:8px">${st.company_name_en || 'SUEUD AL TAAYIRA'}</p>
    <p>${st.phone || ''}</p>
    <p style="font-family:'Cairo';font-size:8px">${st.company_name_ar || ''}</p>
    <p style="color:#cbd5e1;margin-top:3px">${st.vat_no ? 'VAT: ' + st.vat_no : ''}</p>
  </div>
</div>
</div></body></html>`;
};

/* ═══════════════════════════════════════════════════════════════
   REFUND HTML GENERATOR - FULL A4 WITH AIRLINE SERVICE
   ═══════════════════════════════════════════════════════════════ */
export const getRefundHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const refundPageURL = `https://sueud-al-taayira.vercel.app/invoice/${no}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(refundPageURL)}&color=7f1d1d`;
  const barcodeData = `REFUND-${no}-${inv.refund_date || inv.invoice_date || ''}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=2&height=40&barcolor=7f1d1d&backgroundcolor=ffffff&includetext=false`;
  const of2 = inv.old_sell_price || inv.total_sell || 0;
  const cRef = inv.refund_customer || 0;
  const compRef = inv.refund_company || 0;
  const airlineFees = of2 - compRef;
  const cn = inv.customers?.name || inv.old_customer_name || 'N/A';
  const cp = inv.customers?.phone || inv.old_customer_phone || 'N/A';
  const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : (inv.old_passengers || 'N/A');
  let rm = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit') rm = lang === 'ar' ? 'رصيد لحجز جديد' : 'Credit for New Booking';
  const aiMsg = getAIMessage(inv, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';
  const textAlignR = isRTL ? 'left' : 'right';

  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Refund ${no}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px;line-height:1.4}
.inv{width:210mm;min-height:297mm;margin:auto;border:2px solid #7f1d1d;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#7f1d1d,#991b1b,#dc2626,#7f1d1d)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#7f1d1d,#dc2626,#991b1b,#7f1d1d)}
.hdr{display:flex;justify-content:space-between;padding:12px 18px;background:linear-gradient(135deg,#7f1d1d,#991b1b);color:#fff;gap:14px;margin-top:6px}
.cblk{display:flex;gap:12px;flex:1;align-items:center}
.logo{width:55px;height:55px;object-fit:cover;border-radius:8px;background:rgba(255,255,255,0.1);padding:3px;border:2px solid rgba(251,191,36,0.4)}
.ct h2{font-size:15px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}
.ct h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1.5px;margin:3px 0 0}
.ct p{font-size:8px;color:rgba(255,255,255,0.6);line-height:1.6;margin:4px 0 0}
.im{min-width:170px;text-align:${textAlignR}}
.im h3{font-size:20px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin:0}
.im h3 span{font-size:9px;font-family:'Cairo';display:block;margin:3px 0 0;color:rgba(255,255,255,0.8)}
.ino{font-size:8px;color:rgba(255,255,255,0.8);margin-top:4px;border-bottom:1px dashed rgba(255,255,255,0.2);padding-bottom:3px}
.ino span{color:#fbbf24;font-weight:700}
.sb{display:inline-block;padding:4px 12px;border-radius:14px;font-size:8px;font-weight:700;margin-top:6px;background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:8px 18px;background:#fff5f5;border-bottom:2px solid #fecaca}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:7px;color:#991b1b;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:9px;color:#7f1d1d;font-weight:600}
.body{padding:12px 18px;flex:1;display:flex;flex-direction:column;gap:10px}
.sec-title{font-size:9px;font-weight:700;text-transform:uppercase;color:#7f1d1d;margin-bottom:5px;border-bottom:2px solid #7f1d1d;padding-bottom:4px;letter-spacing:0.5px}
.ib{padding:10px;background:#fff5f5;border-radius:6px;border:1px solid #fecaca;border-${textAlign === 'right' ? 'right' : 'left'}:4px solid #dc2626}
.row{display:flex;justify-content:space-between;font-size:9px;padding:3px 0;border-bottom:1px solid #fee2e2}
.row:last-child{border:none}.row .l{color:#991b1b;font-weight:500}.row .v{color:#7f1d1d;font-weight:600;text-align:${textAlignR};max-width:65%}

/* Airline Service Section */
.airline-service{background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:8px;padding:12px;margin:8px 0}
.airline-service h4{color:#92400e;font-size:10px;margin:0 0 8px;display:flex;align-items:center;gap:8px}
.airline-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.airline-item{background:rgba(255,255,255,0.6);padding:8px;border-radius:6px;border:1px solid #fbbf24}
.airline-item .label{font-size:7px;color:#92400e;font-weight:600;text-transform:uppercase}
.airline-item .value{font-size:10px;color:#78350f;font-weight:700;margin-top:2px}

.cb{background:#fff;padding:12px;border-radius:6px;border:1px solid #e2e8f0}
.ct2{font-size:9px;text-transform:uppercase;color:#dc2626;margin-bottom:6px;border-bottom:2px solid #fecaca;padding-bottom:4px;font-weight:700}
.cr{display:flex;justify-content:space-between;padding:5px 0;font-size:10px;color:#334155;border-bottom:1px dashed #e2e8f0}
.cr:last-child{border:none}.cr.deduct{color:#ef4444}
.cr.total{padding-top:8px;margin-top:6px;border-top:2px solid #dc2626;font-size:16px;font-weight:800;color:#059669;border-bottom:none}
.pi{padding:8px 12px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;font-size:10px}
.ft{padding:10px 18px;background:linear-gradient(135deg,#fff5f5,#fef2f2);display:flex;justify-content:space-between;align-items:center;border-top:2px solid #fecaca;gap:10px;margin-top:auto;min-height:60px}
.code-box{display:flex;align-items:center;gap:10px}
.barcode-img{height:35px;width:auto;min-width:150px;border:2px solid #fecaca;padding:2px 5px;background:#fff;border-radius:4px}
.qr-img{height:45px;width:45px;border:2px solid #fecaca;padding:2px;background:#fff;border-radius:5px}
.code-label{font-size:7px;font-weight:700;text-transform:uppercase;text-align:center;color:#991b1d}
.code-label span{font-family:'Cairo';display:block;font-size:7px}
.ft-divider{width:2px;background:linear-gradient(to bottom,#fecaca,#fee2e2,#fecaca);align-self:stretch;min-height:50px}
.ai-msg{text-align:center;flex:1;padding:6px 14px;background:linear-gradient(135deg,#fef2f2,#fee2e2);border-radius:8px;border:1px solid #fca5a5}
.ai-msg p{font-size:9px;color:#7f1d1d;margin:0;line-height:1.5;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:9px;margin-top:2px}
.ai-label{font-size:7px;color:#dc2626;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
.ft-info{width:90px;text-align:center}
.ft-info p{font-size:7px;color:#94a3b8;margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none}}
</style></head><body>
<div class="inv">
<div class="hdr">
  <div class="cblk">
    ${st.logo_url ? `<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>` : '<div class="logo" style="display:flex;align-items:center;justify-content:center;font-size:24px">✈️</div>'}
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
    <div class="row"><span class="l">Passengers / الركاب</span><span class="v" style="font-size:8px;line-height:1.4">${pax}</span></div>
    <div class="row"><span class="l">Reason / السبب</span><span class="v">${inv.refund_reason || 'N/A'}</span></div>
  </div>
  
  <!-- AIRLINE SERVICE SECTION -->
  <div class="airline-service">
    <h4>✈️ AIRLINE SERVICE DETAILS / تفاصيل خدمة الطيران</h4>
    <div class="airline-grid">
      <div class="airline-item"><div class="label">Airline / الخطوط</div><div class="value">${inv.airline || inv.old_airline || 'N/A'}</div></div>
      <div class="airline-item"><div class="label">PNR / رقم الحجز</div><div class="value">${inv.pnr || inv.old_pnr || 'N/A'}</div></div>
      <div class="airline-item"><div class="label">Ticket No / رقم التذكرة</div><div class="value">${inv.ticket_no || inv.old_ticket_no || 'N/A'}</div></div>
      <div class="airline-item"><div class="label">Original Date / التاريخ الأصلي</div><div class="value">${inv.invoice_date || inv.old_booking_date || 'N/A'}</div></div>
    </div>
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
  <div class="code-box">
    <div style="text-align:center">
      <img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/>
      <div class="code-label">REFUND BARCODE<span>باركود الاسترجاع</span></div>
    </div>
    <div style="text-align:center">
      <img src="${qr}" alt="QR Code" class="qr-img" crossorigin="anonymous"/>
      <div class="code-label">DOWNLOAD QR<span>تحميل QR</span></div>
    </div>
  </div>
  <div class="ft-divider"></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI MESSAGE</div><p>${aiMsg}<span>${lang === 'ar' ? '🔄 تم الاسترجاع بنجاح' : 'Refund processed successfully!'}</span></p></div>
  <div class="ft-divider"></div>
  <div class="ft-info"><p style="font-weight:700;color:#7f1d1d">${st.company_name_en || ''}</p><p>${st.phone || ''}</p><p style="font-family:'Cairo'">${st.company_name_ar || ''}</p></div>
</div>
</div></body></html>`;
};

/* ═══════════════════════════════════════════════════════════════
   EXPENSE HTML GENERATOR - FULL A4
   ═════════════════════════════════════════════════════════════ */
export const getExpenseHTML = (exp, s, lang = 'en') => {
  const st = s || {};
  const eno = `EXP-${exp.id ? exp.id.substring(0, 8).toUpperCase() : 'N/A'}`;
  const items = exp.items && exp.items.length > 0 ? exp.items : [{ name: exp.item_name || 'Item', qty: 1, price: exp.amount || 0 }];
  const expPageURL = `https://sueud-al-taayira.vercel.app/expense/${eno}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(expPageURL)}&color=7c2d12`;
  const barcodeData = `EXPENSE-${eno}-${exp.expense_date || ''}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=2&height=40&barcolor=7c2d12&backgroundcolor=ffffff&includetext=false`;
  const aiMsg = getAIMessage(exp, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';
  const textAlignR = isRTL ? 'left' : 'right';
  const totalAmt = items.reduce((sum, it) => sum + (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0), 0);

  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Expense ${eno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px;line-height:1.4}
.inv{width:210mm;min-height:297mm;margin:auto;border:2px solid #7c2d12;display:flex;flex-direction:column;position:relative;overflow:hidden}
.inv::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#7c2d12,#9a3412,#ea580c,#7c2d12)}
.inv::after{content:'';position:absolute;bottom:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#7c2d12,#ea580c,#9a3412,#7c2d12)}
.hdr{display:flex;justify-content:space-between;padding:12px 18px;background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;margin-top:6px;align-items:center}
.ci{display:flex;gap:12px;align-items:center}
.ci h2{font-size:15px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}
.ci h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1.5px;margin:3px 0 0}
.im{text-align:${textAlignR}}
.im h3{font-size:20px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin:0}
.im p{font-size:9px;color:rgba(255,255,255,0.8);margin:4px 0 0}.im p span{color:#fbbf24;font-weight:700}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:8px 18px;background:#fff7ed;border-bottom:2px solid #fed7aa}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:7px;color:#9a3412;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:9px;color:#7c2d12;font-weight:600}
.body{padding:12px 18px;flex:1;display:flex;flex-direction:column;gap:10px}
.sec-title{font-size:9px;font-weight:700;text-transform:uppercase;color:#7c2d12;margin-bottom:5px;border-bottom:2px solid #7c2d12;padding-bottom:4px;letter-spacing:0.5px}
.ib{padding:10px;background:#fff7ed;border-radius:6px;border:1px solid #fed7aa;border-${textAlign === 'right' ? 'right' : 'left'}:4px solid #ea580c}
.row{display:flex;justify-content:space-between;font-size:9px;padding:3px 0;border-bottom:1px solid #fed7aa}
.row:last-child{border:none}.row .l{color:#9a3412;font-weight:500}.row .v{color:#7c2d12;font-weight:600}
table{width:100%;border-collapse:collapse;border-radius:6px;overflow:hidden;border:2px solid #e2e8f0}
thead th{padding:8px 10px;background:#7c2d12;color:#fbbf24;font-size:8px;text-transform:uppercase;text-align:${textAlign};letter-spacing:0.5px}
thead th span{font-family:'Cairo';font-size:7px;opacity:0.8;display:block}
thead th.r{text-align:${textAlignR}}
tbody td{padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:9px}
tbody td.r{text-align:${textAlignR};font-weight:600}
tbody tr:nth-child(even){background:#fff7ed}
.totals{background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;padding:15px 18px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-top:auto}
.totals h3{margin:0;text-transform:uppercase;font-size:11px}.totals .amt{font-size:24px;font-weight:800;margin:0;color:#fbbf24}
.ft{padding:10px 18px;background:linear-gradient(135deg,#fff7ed,#ffedd5);display:flex;justify-content:space-between;align-items:center;border-top:2px solid #fed7aa;gap:10px;min-height:60px}
.code-box{display:flex;align-items:center;gap:10px}
.barcode-img{height:35px;width:auto;min-width:150px;border:2px solid #fed7aa;padding:2px 5px;background:#fff;border-radius:4px}
.qr-img{height:45px;width:45px;border:2px solid #fed7aa;padding:2px;background:#fff;border-radius:5px}
.code-label{font-size:7px;font-weight:700;text-transform:uppercase;text-align:center;color:#9a3412}
.code-label span{font-family:'Cairo';display:block;font-size:7px}
.ft-divider{width:2px;background:linear-gradient(to bottom,#fed7aa,#ffedd5,#fed7aa);align-self:stretch;min-height:50px}
.ai-msg{text-align:center;flex:1;padding:6px 14px;background:linear-gradient(135deg,#fff7ed,#fed7aa);border-radius:8px;border:1px solid #fdba74}
.ai-msg p{font-size:9px;color:#7c2d12;margin:0;line-height:1.5;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:9px;margin-top:2px}
.ai-label{font-size:7px;color:#9a3412;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
.ft-info{width:90px;text-align:center}
.ft-info p{font-size:7px;color:#94a3b8;margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.inv{border:none}}
</style></head><body>
<div class="inv">
<div class="hdr">
  <div class="ci"><h2>${st.company_name_ar || 'صعود الطائرة'}</h2><h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1></div>
  <div class="im"><h3>EXPENSE VOUCHER</h3><p>No: <span>${eno}</span></p><p>Date: <span>${exp.expense_date || ''}</span></p></div>
</div>
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
    <div class="row"><span class="l">Approval / الاعتماد</span><span class="v">${exp.approval_status || 'Approved'}</span></div>
  </div>
  <table>
    <thead><tr><th>Item / البند<span>الوصف</span></th><th class="r">Qty<span>الكمية</span></th><th class="r">Price<span>السعر</span></th><th class="r">Total<span>المجموع</span></th></tr></thead>
    <tbody>${items.map(function(it) { return '<tr><td>' + (it.name || 'Item') + '</td><td class="r">' + (it.qty || 1) + '</td><td class="r">' + parseFloat(it.price || 0).toFixed(2) + '</td><td class="r">' + ((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)).toFixed(2) + '</td></tr>'; }).join('')}</tbody>
  </table>
</div>
<div class="totals"><h3>TOTAL / الإجمالي</h3><p class="amt">${totalAmt.toFixed(2)} SAR</p></div>
<div class="ft">
  <div class="code-box">
    <div style="text-align:center">
      <img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/>
      <div class="code-label">EXPENSE BARCODE<span>باركود المصروف</span></div>
    </div>
    <div style="text-align:center">
      <img src="${qr}" alt="QR Code" class="qr-img" crossorigin="anonymous"/>
      <div class="code-label">DOWNLOAD QR<span>تحميل QR</span></div>
    </div>
  </div>
  <div class="ft-divider"></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI MESSAGE</div><p>${aiMsg}<span>${lang === 'ar' ? '📝 سند مصروفات معتمد' : 'Approved expense voucher'}</span></p></div>
  <div class="ft-divider"></div>
  <div class="ft-info"><p style="font-weight:700;color:#7c2d12">${st.company_name_en || ''}</p><p>${st.phone || ''}</p><p style="font-family:'Cairo'">${st.company_name_ar || ''}</p></div>
</div>
</div></body></html>`;
};

/* ═════════════════════════════════════════════════════════════════
   SALARY SLIP HTML GENERATOR - FULL A4
   ═══════════════════════════════════════════════════════════════ */
export const getSalarySlipHTML = (pay, s, lang = 'en') => {
  const st = s || {};
  const sno = `SLIP-${pay.id ? pay.id.substring(0, 8).toUpperCase() : 'N/A'}`;
  const slipPageURL = `https://sueud-al-taayira.vercel.app/salary/${sno}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(slipPageURL)}&color=0F172A`;
  const barcodeData = `SALARY-${sno}-${pay.month || ''}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=2&height=40&barcolor=0F172A&backgroundcolor=ffffff&includetext=false`;
  const baseSalary = pay.salary || pay.base_salary || 0;
  const commission = pay.commission_amount || 0;
  const overtime = pay.overtime || 0;
  const gift = pay.gift || 0;
  const gross = baseSalary + commission + overtime + gift;
  const advanceDed = pay.advance_deduction || 0;
  const mistakesDed = pay.mistakes_deduction || 0;
  const otherDed = pay.other_deduction || 0;
  const totalDed = advanceDed + mistakesDed + otherDed;
  const net = gross - totalDed;
  const aiMsg = getAIMessage(pay, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';
  const textAlignR = isRTL ? 'left' : 'right';
  const empName = pay.employees?.name || 'N/A';

  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Salary Slip ${sno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px;line-height:1.4}
.slip{width:210mm;min-height:297mm;margin:auto;border:2px solid #0F172A;display:flex;flex-direction:column;position:relative;overflow:hidden}
.slip::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#0F172A,#1E3A8A,#2563EB,#0F172A)}
.slip::after{content:'';position:absolute;bottom:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#0F172A,#2563EB,#1E3A8A,#0F172A)}
.hdr{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;margin-top:6px}
.hdr h1{font-size:15px;font-weight:800;color:#FBBF24;margin:0;font-family:'Cairo'}
.si{text-align:${textAlignR}}
.si h3{color:#FBBF24;font-size:18px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;margin:0}
.si h3 span{font-family:'Cairo';display:block;font-size:9px;color:rgba(255,255,255,0.8);margin:2px 0 0}
.si p{font-size:9px;color:rgba(255,255,255,0.8);margin:4px 0 0}.si p span{color:#FBBF24;font-weight:700}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:8px 18px;background:#EFF6FF;border-bottom:2px solid #BFDBFE}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:7px;color:#1E3A8A;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:9px;color:#0F172A;font-weight:600}
.body{padding:14px 18px;flex:1;display:flex;flex-direction:column;gap:12px}
.sec-title{font-size:9px;font-weight:700;text-transform:uppercase;color:#0F172A;margin-bottom:6px;border-bottom:2px solid #0F172A;padding-bottom:4px;letter-spacing:0.5px}
.emp-info{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.emp-box{padding:10px;background:#F8FAFC;border-radius:6px;border:1px solid #E2E8F0}
.emp-box .label{font-size:7px;color:#64748B;font-weight:600;text-transform:uppercase}
.emp-box .value{font-size:11px;color:#0F172A;font-weight:700;margin-top:3px}
.pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.earn-section{background:#F0FDF4;border-radius:8px;border:2px solid #86EFAC;padding:12px}
.ded-section{background:#FEF2F2;border-radius:8px;border:2px solid #FECACA;padding:12px}
.row{display:flex;justify-content:space-between;font-size:10px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.05)}
.row:last-child{border:none}.row .l{color:#475569}.row .v{font-weight:600}
.earn-section .row .v{color:#059669}
.ded-section .row .v{color:#DC2626}
.section-header{font-size:10px;font-weight:700;text-transform:uppercase;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid}
.earn-section .section-header{color:#059669;border-color:#059669}
.ded-section .section-header{color:#DC2626;border-color:#DC2626}
.summary{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;border-radius:10px;padding:16px 20px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:auto}
.summary-item{text-align:center}
.summary-item .label{font-size:8px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:0.5px}
.summary-item .value{font-size:20px;font-weight:800;margin-top:4px}
.summary-item .value.green{color:#34D399}
.summary-item .value.red{color:#F87171}
.summary-item .value.gold{color:#FBBF24;font-size:24px}
.ft{padding:10px 18px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);display:flex;justify-content:space-between;align-items:center;border-top:2px solid #BFDBFE;gap:10px;min-height:60px}
.code-box{display:flex;align-items:center;gap:10px}
.barcode-img{height:35px;width:auto;min-width:150px;border:2px solid #BFDBFE;padding:2px 5px;background:#fff;border-radius:4px}
.qr-img{height:45px;width:45px;border:2px solid #BFDBFE;padding:2px;background:#fff;border-radius:5px}
.code-label{font-size:7px;font-weight:700;text-transform:uppercase;text-align:center;color:#1E3A8A}
.code-label span{font-family:'Cairo';display:block;font-size:7px}
.ft-divider{width:2px;background:linear-gradient(to bottom,#BFDBFE,#DBEAFE,#BFDBFE);align-self:stretch;min-height:50px}
.ai-msg{text-align:center;flex:1;padding:6px 14px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border-radius:8px;border:1px solid #93C5FD}
.ai-msg p{font-size:9px;color:#1E3A8A;margin:0;line-height:1.5;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:9px;margin-top:2px}
.ai-label{font-size:7px;color:#3B82F6;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
.ft-info{width:90px;text-align:center}
.ft-info p{font-size:7px;color:#94A3B8;margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.slip{border:none}}
</style></head><body>
<div class="slip">
<div class="hdr">
  <h1>${st.company_name_ar || 'صعود الطائرة'}</h1>
  <div class="si">
    <h3>SALARY SLIP<span>قسيمة راتب</span></h3>
    <p>No: <span>${sno}</span></p>
    <p>Month: <span>${pay.month || 'N/A'}</span></p>
  </div>
</div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${st.license_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no || 'N/A'}</span></div>
</div>
<div class="body">
  <div class="emp-info">
    <div class="emp-box"><div class="label">Employee / الموظف</div><div class="value">${empName}</div></div>
    <div class="emp-box"><div class="label">Employee ID / الرقم الوظيفي</div><div class="value">${pay.employee_id || 'N/A'}</div></div>
    <div class="emp-box"><div class="label">Payment Date / تاريخ الدفع</div><div class="value">${pay.payment_date || 'N/A'}</div></div>
  </div>
  
  <div class="pay-grid">
    <div class="earn-section">
      <div class="section-header">EARNINGS / الإيرادات</div>
      <div class="row"><span class="l">Base Salary / الراتب الأساسي</span><span class="v">${baseSalary.toFixed(2)} SAR</span></div>
      <div class="row"><span class="l">Commission / العمولة</span><span class="v">${commission.toFixed(2)} SAR</span></div>
      <div class="row"><span class="l">Overtime / إضافي</span><span class="v">${overtime.toFixed(2)} SAR</span></div>
      <div class="row"><span class="l">Gift/Bonus / هدية/مكافأة</span><span class="v">${gift.toFixed(2)} SAR</span></div>
    </div>
    <div class="ded-section">
      <div class="section-header">DEDUCTIONS / الخصومات</div>
      <div class="row"><span class="l">Advance Deduct / خصم سلفة</span><span class="v">${advanceDed.toFixed(2)} SAR</span></div>
      <div class="row"><span class="l">Mistakes Deduct / خصم أخطاء</span><span class="v">${mistakesDed.toFixed(2)} SAR</span></div>
      <div class="row"><span class="l">Other Deduct / خصم أخرى</span><span class="v">${otherDed.toFixed(2)} SAR</span></div>
    </div>
  </div>
  
  <div class="summary">
    <div class="summary-item"><div class="label">Gross Salary / الإجمالي</div><div class="value green">${gross.toFixed(2)}</div></div>
    <div class="summary-item"><div class="label">Total Deductions / الخصومات</div><div class="value red">${totalDed.toFixed(2)}</div></div>
    <div class="summary-item"><div class="label">NET PAY / الصافي</div><div class="value gold">${net.toFixed(2)}</div></div>
  </div>
</div>
<div class="ft">
  <div class="code-box">
    <div style="text-align:center">
      <img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/>
      <div class="code-label">SALARY BARCODE<span>باركود الراتب</span></div>
    </div>
    <div style="text-align:center">
      <img src="${qr}" alt="QR Code" class="qr-img" crossorigin="anonymous"/>
      <div class="code-label">DOWNLOAD QR<span>تحميل QR</span></div>
    </div>
  </div>
  <div class="ft-divider"></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI MESSAGE</div><p>${aiMsg}<span>${lang === 'ar' ? '💰 راتب تم تحويل بنجاح' : 'Salary transferred successfully!'}</span></p></div>
  <div class="ft-divider"></div>
  <div class="ft-info"><p style="font-weight:700;color:#0F172A">${st.company_name_en || ''}</p><p>${st.phone || ''}</p><p style="font-family:'Cairo'">${st.company_name_ar || ''}</p></div>
</div>
</div></body></html>`;
};

/* ═════════════════════════════════════════════════════════════════
   CONTRACT HTML GENERATOR - COMPLETE
   ═══════════════════════════════════════════════════════════════ */
export const getContractHTML = (settings, corpName, date, isOffer = false, serviceType = 'Flight Tickets', markup = '10', terms = '') => {
  const s = settings || {};
  const docType = isOffer ? 'CORPORATE OFFER' : 'CORPORATE CONTRACT';
  const docTypeAr = isOffer ? 'عرض شركات' : 'عقد شركات';
  const contractNo = `CON-${Date.now().toString(36).toUpperCase()}`;
  const contractPageURL = `https://sueud-al-taayira.vercel.app/contract/${contractNo}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(contractPageURL)}&color=1e3a8a`;
  const barcodeData = `CONTRACT-${contractNo}-${date || ''}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=2&height=40&barcolor=1e3a8a&backgroundcolor=ffffff&includetext=false`;
  const aiMsg = getAIMessage({ id: contractNo }, 'en');

  const effectiveTerms = terms || `1. Payment Terms: 100% advance payment required to confirm the booking.
2. Validity: This document is valid for 30 days from the date of issue.
3. Refund Policy: All cancellations are subject to airline/hotel cancellation policies.
4. Prices are subject to change based on availability at the time of final booking.
5. Passenger names must match exactly as per passport/ID.
6. This agreement is governed by the laws of the Kingdom of Saudi Arabia.
7. Any disputes shall be resolved through amicable negotiation or referred to competent courts in Riyadh.`;

  return `<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="UTF-8"><title>${docType} - ${corpName}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:10px;line-height:1.6}
.doc{width:210mm;min-height:297mm;margin:auto;border:2px solid #1e3a8a;display:flex;flex-direction:column;position:relative;overflow:hidden}
.doc::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#1e3a8a,#2563eb,#1e3a8a)}
.doc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#1e3a8a,#2563eb,#1e3a8a)}
.header{padding:18px 20px;background:linear-gradient(135deg,#1e3a8a,#0f172a);color:#fff;display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:6px}
.logo-area{display:flex;align-items:center;gap:15px}
.logo-img{width:65px;height:65px;border-radius:10px;object-fit:cover;border:3px solid #fbbf24;background:rgba(255,255,255,0.1);padding:3px}
.company-info h1{margin:0;font-size:18px;font-weight:800;color:#fbbf24;font-family:'Cairo'}
.company-info h2{margin:3px 0 0;font-size:10px;font-weight:600;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:2px}
.company-info p{margin:5px 0 0;font-size:9px;color:rgba(255,255,255,0.7);line-height:1.7}
.doc-badge{background:rgba(251,191,36,0.2);color:#fbbf24;padding:10px 20px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:1px;text-align:center;border:2px solid rgba(251,191,36,0.3)}
.doc-badge span{display:block;font-family:'Cairo';font-size:9px;color:rgba(255,255,255,0.8);margin-top:3px}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:8px 20px;background:#EFF6FF;border-bottom:2px solid #BFDBFE}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:7px;color:#1E3A8A;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:9px;color:#0F172A;font-weight:600}
.content{padding:20px;flex:1;display:flex;flex-direction:column;gap:16px}
.title{font-size:16px;font-weight:700;color:#1e3a8a;margin:0 0 12px;border-bottom:3px solid #e2e8f0;padding-bottom:10px}
.section{margin-bottom:16px}
.section h3{font-size:11px;font-weight:700;color:#1e3a8a;margin:0 0 10px;border-left:4px solid #2563eb;padding-left:12px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0}
.info-box{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:10px}
.info-box .label{font-size:8px;color:#64748B;font-weight:600;text-transform:uppercase}
.info-box .value{font-size:11px;color:#0F172A;font-weight:600;margin-top:3px}
.terms-box{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px;white-space:pre-wrap;font-size:9px;color:#475569;line-height:1.8}
.signature-area{display:flex;justify-content:space-between;margin-top:20px;padding-top:16px;border-top:2px solid #e2e8f0}
.sig-box{width:45%;text-align:center}
.sig-line{border-bottom:2px solid #1e3a8a;height:50px;margin-bottom:8px}
.sig-label{font-size:9px;color:#64748B;font-weight:600}
.ft{padding:10px 20px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);display:flex;justify-content:space-between;align-items:center;border-top:2px solid #BFDBFE;gap:10px;min-height:60px;margin-top:auto}
.code-box{display:flex;align-items:center;gap:10px}
.barcode-img{height:35px;width:auto;min-width:150px;border:2px solid #BFDBFE;padding:2px 5px;background:#fff;border-radius:4px}
.qr-img{height:45px;width:45px;border:2px solid #BFDBFE;padding:2px;background:#fff;border-radius:5px}
.code-label{font-size:7px;font-weight:700;text-transform:uppercase;text-align:center;color:#1E3A8A}
.code-label span{font-family:'Cairo';display:block;font-size:7px}
.ft-divider{width:2px;background:linear-gradient(to bottom,#BFDBFE,#DBEAFE,#BFDBFE);align-self:stretch;min-height:50px}
.ai-msg{text-align:center;flex:1;padding:6px 14px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border-radius:8px;border:1px solid #93C5FD}
.ai-msg p{font-size:9px;color:#1E3A8A;margin:0;line-height:1.5;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:9px;margin-top:2px}
.ai-label{font-size:7px;color:#3B82F6;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
.ft-info{width:90px;text-align:center}
.ft-info p{font-size:7px;color:#94A3B8;margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.doc{border:none}}
</style></head><body>
<div class="doc">
<div class="header">
  <div class="logo-area">
    ${s.logo_url ? `<img src="${s.logo_url}" crossorigin="anonymous" class="logo-img"/>` : '<div class="logo-img" style="display:flex;align-items:center;justify-content:center;font-size:28px">✈️</div>'}
    <div class="company-info">
      <h1>${s.company_name_ar || 'صعود الطائرة'}</h1>
      <h2>${s.company_name_en || 'SUEUD AL TAAYIRA TRAVEL & TOURISM'}</h2>
      <p>${s.address_ar || 'Address'} ${s.phone ? '| ' + s.phone : ''}</p>
    </div>
  </div>
  <div class="doc-badge">${docType}<span>${docTypeAr}</span></div>
</div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${s.vat_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${s.cr_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${s.license_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${s.tourism_license_no || 'N/A'}</span></div>
</div>
<div class="content">
  <h2 class="title">${docType} BETWEEN ${s.company_name_en || 'SUEUD AL TAAYIRA'} AND ${corpName}</h2>
  
  <div class="section">
    <h3>Agreement Details / تفاصيل الاتفاقية</h3>
    <div class="info-grid">
      <div class="info-box"><div class="label">Document No / رقم المستند</div><div class="value">${contractNo}</div></div>
      <div class="info-box"><div class="label">Date / التاريخ</div><div class="value">${date || new Date().toISOString().split('T')[0]}</div></div>
      <div class="info-box"><div class="label">Service Type / نوع الخدمة</div><div class="value">${serviceType}</div></div>
      <div class="info-box"><div class="label">Markup / هامش الربح</div><div class="value">${markup}%</div></div>
    </div>
  </div>
  
  <div class="section">
    <h3>Parties / الأطراف</h3>
    <div class="info-grid">
      <div class="info-box" style="border-left:4px solid #1e3a8a">
        <div class="label">First Party / الطرف الأول</div>
        <div class="value">${s.company_name_en || 'SUEUD AL TAAYIRA'}</div>
        <div style="font-size:9px;color:#64748B;margin-top:4px">${s.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</div>
      </div>
      <div class="info-box" style="border-left:4px solid #f59e0b">
        <div class="label">Second Party / الطرف الثاني</div>
        <div class="value">${corpName}</div>
        <div style="font-size:9px;color:#64748B;margin-top:4px">Corporate Client / عميل مؤسسي</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h3>Terms & Conditions / الشروط والأحكام</h3>
    <div class="terms-box">${effectiveTerms}</div>
  </div>
  
  <div class="signature-area">
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="sig-label">First Party Signature / توقيع الطرف الأول</div>
      <div style="font-size:8px;color:#94a3b8;margin-top:4px">${s.company_name_en || 'SUEUD AL TAAYIRA'}</div>
    </div>
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="sig-label">Second Party Signature / توقيع الطرف الثاني</div>
      <div style="font-size:8px;color:#94a3b8;margin-top:4px">${corpName}</div>
    </div>
  </div>
</div>
<div class="ft">
  <div class="code-box">
    <div style="text-align:center">
      <img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/>
      <div class="code-label">CONTRACT BARCODE<span>باركود العقد</span></div>
    </div>
    <div style="text-align:center">
      <img src="${qr}" alt="QR Code" class="qr-img" crossorigin="anonymous"/>
      <div class="code-label">DOWNLOAD QR<span>تحميل QR</span></div>
    </div>
  </div>
  <div class="ft-divider"></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI MESSAGE</div><p>${aiMsg}<span>📋 Agreement generated successfully</span></p></div>
  <div class="ft-divider"></div>
  <div class="ft-info"><p style="font-weight:700;color:#1E3A8A">${s.company_name_en || ''}</p><p>${s.phone || ''}</p><p style="font-family:'Cairo'">${s.company_name_ar || ''}</p></div>
</div>
</div></body></html>`;
};

/* ═════════════════════════════════════════════════════════════════
   STAFF MISTAKE HTML GENERATOR - NEW
   ═══════════════════════════════════════════════════════════════ */
export const getMistakeHTML = (mistake, s, lang = 'en') => {
  const st = s || {};
  const mno = `MST-${mistake.id ? mistake.id.substring(0, 8).toUpperCase() : 'N/A'}`;
  const mistakePageURL = `https://sueud-al-taayira.vercel.app/mistake/${mno}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mistakePageURL)}&color=991b1b`;
  const barcodeData = `MISTAKE-${mno}-${mistake.created_at || ''}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=2&height=40&barcolor=991b1b&backgroundcolor=ffffff&includetext=false`;
  const aiMsg = getAIMessage(mistake, lang);
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';
  const textAlignR = isRTL ? 'left' : 'right';
  const empName = mistake.employees?.name || 'N/A';

  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"><title>Staff Mistake ${mno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px;line-height:1.4}
.doc{width:210mm;min-height:297mm;margin:auto;border:2px solid #991b1b;display:flex;flex-direction:column;position:relative;overflow:hidden}
.doc::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#991b1b,#dc2626,#991b1b)}
.doc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#991b1b,#dc2626,#991b1b)}
.hdr{padding:14px 18px;background:linear-gradient(135deg,#991b1b,#7f1d1d);color:#fff;display:flex;justify-content:space-between;align-items:center;margin-top:6px}
.hdr h1{font-size:15px;font-weight:800;color:#FBBF24;margin:0;font-family:'Cairo'}
.im{text-align:${textAlignR}}
.im h3{color:#FBBF24;font-size:18px;font-weight:800;text-transform:uppercase;margin:0}
.im p{font-size:9px;color:rgba(255,255,255,0.8);margin:4px 0 0}.im p span{color:#FBBF24;font-weight:700}
.comp-det{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:8px 18px;background:#FEF2F2;border-bottom:2px solid #FECACA}
.comp-det .ci{display:flex;flex-direction:column;gap:1px}
.comp-det .cl{font-size:7px;color:#991B1B;font-weight:600;text-transform:uppercase}
.comp-det .cv{font-size:9px;color:#7F1D1D;font-weight:600}
.body{padding:14px 18px;flex:1;display:flex;flex-direction:column;gap:12px}
.sec-title{font-size:9px;font-weight:700;text-transform:uppercase;color:#991B1B;margin-bottom:6px;border-bottom:2px solid #991B1B;padding-bottom:4px}
.ib{padding:12px;background:#FEF2F2;border-radius:8px;border:1px solid #FECACA;border-${textAlign === 'right' ? 'right' : 'left'}:4px solid #DC2626}
.row{display:flex;justify-content:space-between;font-size:10px;padding:4px 0;border-bottom:1px solid #FEE2E2}
.row:last-child{border:none}.row .l{color:#991B1B;font-weight:500}.row .v{color:#7F1D1D;font-weight:600;text-align:${textAlignR};max-width:60%}
.desc-box{background:#fff;border:2px solid #FECACA;border-radius:8px;padding:14px;min-height:100px}
.desc-box .label{font-size:8px;color:#991B1B;font-weight:600;text-transform:uppercase;margin-bottom:6px}
.desc-box .content{font-size:10px;color:#1E293B;line-height:1.7;white-space:pre-wrap}
.deduction-box{background:linear-gradient(135deg,#991B1B,#7F1D1D);color:#fff;border-radius:10px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;margin-top:auto}
.deduction-box .label{font-size:10px;color:rgba(255,255,255,0.8)}
.deduction-box .value{font-size:28px;font-weight:800;color:#FBBF24}
.ft{padding:10px 18px;background:linear-gradient(135deg,#FEF2F2,#FEE2E2);display:flex;justify-content:space-between;align-items:center;border-top:2px solid #FECACA;gap:10px;min-height:60px}
.code-box{display:flex;align-items:center;gap:10px}
.barcode-img{height:35px;width:auto;min-width:150px;border:2px solid #FECACA;padding:2px 5px;background:#fff;border-radius:4px}
.qr-img{height:45px;width:45px;border:2px solid #FECACA;padding:2px;background:#fff;border-radius:5px}
.code-label{font-size:7px;font-weight:700;text-transform:uppercase;text-align:center;color:#991B1B}
.code-label span{font-family:'Cairo';display:block;font-size:7px}
.ft-divider{width:2px;background:linear-gradient(to bottom,#FECACA,#FEE2E2,#FECACA);align-self:stretch;min-height:50px}
.ai-msg{text-align:center;flex:1;padding:6px 14px;background:linear-gradient(135deg,#FEF2F2,#FEE2E2);border-radius:8px;border:1px solid #FCA5A5}
.ai-msg p{font-size:9px;color:#7F1D1D;margin:0;line-height:1.5;font-weight:500}
.ai-msg p span{font-family:'Cairo';display:block;font-size:9px;margin-top:2px}
.ai-label{font-size:7px;color:#DC2626;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
.ft-info{width:90px;text-align:center}
.ft-info p{font-size:7px;color:#94A3B8;margin:2px 0}
@media print{body{background:#fff;padding:0;margin:0}.doc{border:none}}
</style></head><body>
<div class="doc">
<div class="hdr">
  <h1>${st.company_name_ar || 'صعود الطائرة'}</h1>
  <div class="im">
    <h3>STAFF MISTAKE</h3>
    <p>No: <span>${mno}</span></p>
    <p>Date: <span>${mistake.created_at ? mistake.created_at.split('T')[0] : 'N/A'}</span></p>
  </div>
</div>
<div class="comp-det">
  <div class="ci"><span class="cl">VAT No / رقم ضريبي</span><span class="cv">${st.vat_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">CR No / رقم سجل</span><span class="cv">${st.cr_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">License / ترخيص</span><span class="cv">${st.license_no || 'N/A'}</span></div>
  <div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no || 'N/A'}</span></div>
</div>
<div class="body">
  <div class="ib">
    <div class="sec-title">EMPLOYEE DETAILS / بيانات الموظف</div>
    <div class="row"><span class="l">Employee / الموظف</span><span class="v">${empName}</span></div>
    <div class="row"><span class="l">Invoice Ref / فاتورة</span><span class="v">${mistake.invoice_no || 'N/A'}</span></div>
    <div class="row"><span class="l">Customer / العميل</span><span class="v">${mistake.customer_name || 'N/A'}</span></div>
    <div class="row"><span class="l">Mistake Type / نوع الخطأ</span><span class="v">${mistake.mistake_type || 'N/A'}</span></div>
  </div>
  <div class="desc-box">
    <div class="label">Description / الوصف</div>
    <div class="content">${mistake.description || 'No description provided'}</div>
  </div>
</div>
<div class="deduction-box">
  <div class="label">Deduction Amount / مبلغ الخصم</div>
  <div class="value">${(mistake.deduction_amount || 0).toFixed(2)} SAR</div>
</div>
<div class="ft">
  <div class="code-box">
    <div style="text-align:center">
      <img src="${barcode}" alt="Barcode" class="barcode-img" crossorigin="anonymous"/>
      <div class="code-label">MISTAKE BARCODE<span>باركود الخطأ</span></div>
    </div>
    <div style="text-align:center">
      <img src="${qr}" alt="QR Code" class="qr-img" crossorigin="anonymous"/>
      <div class="code-label">DOWNLOAD QR<span>تحميل QR</span></div>
    </div>
  </div>
  <div class="ft-divider"></div>
  <div class="ai-msg"><div class="ai-label">🤖 AI MESSAGE</div><p>${aiMsg}<span>${lang === 'ar' ? '⚠️ تم تسجيل الخطأ' : 'Mistake recorded'}</span></p></div>
  <div class="ft-divider"></div>
  <div class="ft-info"><p style="font-weight:700;color:#991B1B">${st.company_name_en || ''}</p><p>${st.phone || ''}</p><p style="font-family:'Cairo'">${st.company_name_ar || ''}</p></div>
</div>
</div></body></html>`;
};
