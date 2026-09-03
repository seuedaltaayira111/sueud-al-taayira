'use client';

/* ================================================================
   INVOICE HTML GENERATORS - PROFESSIONAL FULL-PAGE DESIGN
   All generators: Sales, Refund, Expense, Salary, Contract, Mistake, Recharge
   ================================================================ */

// ===== HELPER: Airline Check-in URL =====
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
    'turkish': `https://www.turkishairlines.com/en-us/check-in?pnr=${pnr}`,
    'tk': `https://www.turkishairlines.com/en-us/check-in?pnr=${pnr}`,
    'indigo': `https://www.goindigo.in/manage-booking?pnr=${pnr}`,
    '6e': `https://www.goindigo.in/manage-booking?pnr=${pnr}`,
    'spicejet': `https://www.spicejet.com/manage-booking?pnr=${pnr}`,
    'sg': `https://www.spicejet.com/manage-booking?pnr=${pnr}`,
    'air india': `https://www.airindia.in/manage-booking?pnr=${pnr}`,
    'ai': `https://www.airindia.in/manage-booking?pnr=${pnr}`,
  };
  for (const [key, url] of Object.entries(urls)) {
    if (a.includes(key)) return url;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(airline + ' online check in pnr ' + pnr)}`;
};

// ===== HELPER: AI Message =====
export const getAIMessage = (inv, lang = 'en', type = 'invoice') => {
  const pools = {
    invoice: [
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
    ],
    refund: [
      { en: '🔄 Your refund has been processed. Thank you for your patience.', ar: '🔄 تمت معالجة استرجاعكم. شكراً لصبركم.' },
      { en: '💳 We hope to serve your travel needs again soon.', ar: '💳 نتطلع لخدمتكم مجدداً قريباً.' },
      { en: '🤝 Your satisfaction matters — we\'re here for your next trip.', ar: '🤝 رضاكم يهمنا — نحن هنا لرحلتكم القادمة.' }
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
      { en: '📌 Logged for internal quality tracking — let\'s aim for zero errors going forward.', ar: '📌 مسجل للمتابعة الداخلية — نهدف لعدم تكرار الأخطاء.' },
      { en: '🎯 Every correction helps us serve customers better.', ar: '🎯 كل تصحيح يساعدنا على خدمة عملائنا بشكل أفضل.' }
    ]
  };
  const messages = pools[type] || pools.invoice;
  const idx = (inv.id?.charCodeAt(0) || 0) % messages.length;
  const msg = messages[idx];
  return lang === 'ar' ? msg.ar : msg.en;
};

// ================================================================
// 1. SALES INVOICE
// ================================================================
export const getInvoiceHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const checkInURL = getAirlineCheckInURL(inv.airline, inv.pnr);
  const invoicePageURL = `https://sueud-al-taayira.vercel.app/invoice/${no}`;
  const barcodeData = checkInURL || `https://www.google.com/search?q=${encodeURIComponent((inv.airline || '') + ' check in ' + (inv.pnr || ''))}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=3&height=50&barcolor=1E3A8A&backgroundcolor=ffffff&includetext=false`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(invoicePageURL)}`;

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
  const fontFamily = isRTL ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Poppins', sans-serif";
  const storeCredit = inv.customers?.store_credit || 0;

  const hasPrev = isRe && inv.linked_inv_id;
  const prevDate = inv.old_booking_date || '';
  const prevAirline = inv.old_airline || '';
  const prevSector = inv.old_sector || '';
  const prevPnr = inv.old_pnr || '';
  const prevTicket = inv.old_ticket_no || '';
  const prevType = inv.old_flight_type || '';
  const prevFare = inv.old_sell_price || 0;
  const prevRefundCust = inv.refund_customer || 0;
  const prevRefundReason = inv.refund_reason || '';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${no}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
    html, body { height: 100%; margin: 0; padding: 0; }
    body {
      font-family: ${fontFamily};
      background: #F8FAFC;
      color: #1E293B;
      font-size: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      margin: 0;
    }
    .invoice-container {
      width: 210mm;
      height: 297mm;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #2563EB 100%);
      color: #FFFFFF;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 4px solid #FBBF24;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 2px solid #FBBF24;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    .logo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .logo-wrapper .placeholder { font-size: 36px; }
    .company-info h1 {
      font-size: 22px;
      font-weight: 900;
      color: #FBBF24;
      margin: 0;
      letter-spacing: 1px;
    }
    .company-info h2 {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
      margin: 2px 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .company-info p {
      font-size: 9px;
      color: rgba(255,255,255,0.7);
      margin: 4px 0 0;
      line-height: 1.4;
    }
    .header-right {
      text-align: right;
      background: rgba(255,255,255,0.08);
      padding: 12px 24px;
      border-radius: 12px;
      backdrop-filter: blur(4px);
      min-width: 200px;
    }
    .header-right .doc-title {
      font-size: 20px;
      font-weight: 900;
      color: #FBBF24;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .header-right .doc-title span {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.7;
      display: block;
      font-family: 'Cairo', sans-serif;
    }
    .header-right .meta { font-size: 10px; margin-top: 4px; color: rgba(255,255,255,0.8); }
    .header-right .meta span { color: #FBBF24; font-weight: 700; }
    .status-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 10px;
      margin-top: 6px;
      background: ${st2 === 'Unpaid' ? 'rgba(251,191,36,0.2)' : 'rgba(16,185,129,0.2)'};
      color: ${st2 === 'Unpaid' ? '#FBBF24' : '#34D399'};
      border: 1px solid ${st2 === 'Unpaid' ? 'rgba(251,191,36,0.3)' : 'rgba(16,185,129,0.3)'};
    }
    .company-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 8px 24px;
      background: #F1F5F9;
      border-bottom: 1px solid #E2E8F0;
      flex-shrink: 0;
      font-size: 9px;
    }
    .company-bar .item .label { color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 7px; }
    .company-bar .item .value { color: #0F172A; font-weight: 700; }
    .body {
      padding: 16px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: hidden;
    }
    .section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #1E3A8A;
      border-bottom: 2px solid #1E3A8A;
      padding-bottom: 4px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
    }
    .section-title .ar { font-family: 'Cairo', sans-serif; color: #64748B; font-weight: 600; }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .info-box {
      padding: 8px 12px;
      background: #F8FAFC;
      border-radius: 8px;
      border-left: 4px solid #1E3A8A;
    }
    .info-box.gold { border-left-color: #F59E0B; }
    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 2px 0;
      border-bottom: 1px solid #E2E8F0;
    }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { color: #64748B; }
    .info-row .value { font-weight: 600; color: #0F172A; max-width: 60%; word-break: break-word; text-align: right; }
    .store-credit {
      background: #D1FAE5;
      border: 1px solid #6EE7B7;
      border-radius: 6px;
      padding: 6px 14px;
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 10px;
      color: #065F46;
    }
    .store-credit .value { color: #047857; font-weight: 800; font-size: 13px; }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .invoice-table th {
      background: #1E3A8A;
      color: #FBBF24;
      padding: 6px 10px;
      font-size: 8px;
      text-transform: uppercase;
      text-align: left;
    }
    .invoice-table th.right { text-align: right; }
    .invoice-table th.center { text-align: center; }
    .invoice-table td {
      padding: 6px 10px;
      border-bottom: 1px solid #F1F5F9;
      font-size: 9px;
    }
    .invoice-table td.right { text-align: right; font-weight: 600; }
    .invoice-table td.center { text-align: center; }
    .discount-row { background: #F0FDF4; }
    .discount-row td { color: #059669; }
    .bottom-section {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 12px;
      margin-top: 4px;
    }
    .payment-breakdown {
      padding: 10px 14px;
      background: #F8FAFC;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
    }
    .pay-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 3px 0;
      border-bottom: 1px dashed #E2E8F0;
    }
    .pay-row:last-child { border-bottom: none; }
    .pay-row .label { color: #64748B; }
    .pay-row .value { font-weight: 600; }
    .pay-row .value.green { color: #059669; }
    .pay-row .value.red { color: #EF4444; }
    .totals-box {
      background: linear-gradient(135deg, #0F172A, #1E3A8A);
      color: #FFFFFF;
      padding: 10px 14px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 2px 0;
      color: rgba(255,255,255,0.8);
    }
    .grand-total {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 800;
      border-top: 2px solid rgba(255,255,255,0.2);
      padding-top: 6px;
      margin-top: 4px;
    }
    .grand-total .value { color: #FBBF24; }
    .footer {
      padding: 10px 24px;
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      margin-top: auto;
      gap: 12px;
    }
    .code-section { display: flex; align-items: center; gap: 8px; }
    .code-section img { height: 32px; width: auto; border-radius: 4px; border: 1px solid #E2E8F0; padding: 2px 6px; background: #FFF; }
    .code-label { font-size: 7px; text-align: center; color: #64748B; font-weight: 600; }
    .ai-message {
      flex: 1;
      text-align: center;
      padding: 4px 12px;
      background: #EFF6FF;
      border-radius: 6px;
      border: 1px solid #93C5FD;
    }
    .ai-message .ai-label { font-size: 7px; color: #3B82F6; font-weight: 700; text-transform: uppercase; }
    .ai-message p { font-size: 9px; color: #1E3A8A; margin: 0; }
    .footer-info { text-align: center; min-width: 70px; }
    .footer-info p { font-size: 7px; color: #94A3B8; margin: 1px 0; }
    .footer-info .name { font-weight: 700; color: #0F172A; font-size: 8px; }
    .linked-section {
      margin-top: 4px;
      padding-top: 8px;
      border-top: 2px dashed #CBD5E1;
      flex-shrink: 0;
    }
    .linked-title { text-align: center; font-weight: 800; color: #7F1D1D; font-size: 13px; margin-bottom: 8px; }
    .reissue-block {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 8px;
      padding: 10px 14px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
    }
    .reissue-item { background: #FFF; padding: 4px 8px; border-radius: 4px; border: 1px solid #FDE68A; }
    .reissue-item .label { font-size: 7px; color: #92400E; font-weight: 600; text-transform: uppercase; }
    .reissue-item .value { font-size: 9px; color: #78350F; font-weight: 700; }
    .reissue-fare { grid-column: span 3; background: #D1FAE5; border-color: #6EE7B7; display: flex; justify-content: space-between; padding: 6px 10px; }
    .reissue-fare .label { color: #059669; font-size: 8px; }
    .reissue-fare .value { color: #047857; font-size: 12px; font-weight: 800; }
    .refund-details {
      margin-top: 6px;
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 8px;
      padding: 8px 14px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;
    }
    .refund-item { text-align: center; }
    .refund-item .label { font-size: 7px; color: #991B1B; font-weight: 600; }
    .refund-item .value { font-size: 10px; font-weight: 700; color: #DC2626; }
    @media print {
      body { background: white; padding: 0; margin: 0; }
      .invoice-container { border-radius: 0; box-shadow: none; height: 100%; width: 100%; }
    }
  </style>
</head>
<body>
<div class="invoice-container">
  <div class="header">
    <div class="header-left">
      <div class="logo-wrapper">
        ${st.logo_url ? `<img src="${st.logo_url}" alt="Logo"/>` : `<span class="placeholder">✈️</span>`}
      </div>
      <div class="company-info">
        <h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
        <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
        <p>${st.address_ar || ''} ${st.phone ? '📞 ' + st.phone : ''} ${st.website ? '🌐 ' + st.website : ''}</p>
      </div>
    </div>
    <div class="header-right">
      <div class="doc-title">TAX INVOICE <span>فاتورة ضريبية</span></div>
      <div class="meta">No: <span>${no}</span></div>
      <div class="meta">Date: <span>${inv.invoice_date || ''}</span></div>
      <div class="status-badge">${st2 === 'Unpaid' ? 'UNPAID' : 'PAID'}</div>
    </div>
  </div>
  <div class="company-bar">
    <div class="item"><div class="label">VAT No</div><div class="value">${st.vat_no || 'N/A'}</div></div>
    <div class="item"><div class="label">CR No</div><div class="value">${st.cr_no || 'N/A'}</div></div>
    <div class="item"><div class="label">License</div><div class="value">${st.license_no || 'N/A'}</div></div>
    <div class="item"><div class="label">Tourism Lic.</div><div class="value">${st.tourism_license_no || 'N/A'}</div></div>
  </div>
  <div class="body">
    ${storeCredit > 0 ? `<div class="store-credit"><span>💰 ${isRTL ? 'الرصيد المتاح' : 'Available Store Credit'}</span><span class="value">${storeCredit.toFixed(2)} SAR</span></div>` : ''}
    <div class="info-grid">
      <div class="info-box">
        <div class="section-title">BILL TO / فاتورة إلى</div>
        <div class="info-row"><span class="label">Name</span><span class="value">${inv.customers?.name || inv.corporates?.name || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Phone</span><span class="value">${inv.customers?.phone || 'N/A'}</span></div>
        ${inv.corporates?.vat_no ? `<div class="info-row"><span class="label">VAT</span><span class="value">${inv.corporates.vat_no}</span></div>` : ''}
        <div class="info-row"><span class="label">Sales Person</span><span class="value">${inv.employees?.name || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Passengers</span><span class="value" style="font-size:8px;">${pax}</span></div>
      </div>
      <div class="info-box gold">
        <div class="section-title">FLIGHT DETAILS / تفاصيل الرحلة</div>
        <div class="info-row"><span class="label">Airline</span><span class="value">${inv.airline || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Sector</span><span class="value">${inv.flight_sector || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Type</span><span class="value">${inv.flight_type || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Journey</span><span class="value">${inv.flight_journey || 'N/A'}</span></div>
        <div class="info-row"><span class="label">PNR</span><span class="value" style="color:#2563EB;font-weight:700;">${inv.pnr || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Ticket No</span><span class="value">${inv.ticket_no || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Refundable</span><span class="value">${inv.refundable_status || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Service</span><span class="value">${inv.service_type || 'N/A'}</span></div>
      </div>
    </div>
    <table class="invoice-table">
      <thead><tr><th>Description</th><th class="center">Qty</th><th class="right">Unit Price</th><th class="right">Total</th></tr></thead>
      <tbody>
        <tr><td>${inv.sector || inv.service_type || 'Service'}</td><td class="center">${inv.qty || 1}</td><td class="right">${up.toFixed(2)}</td><td class="right">${ts.toFixed(2)}</td></tr>
        ${disc > 0 ? `<tr class="discount-row"><td colspan="3" style="text-align:right;color:#059669;">Discount / خصم</td><td class="right" style="color:#059669;">- ${disc.toFixed(2)}</td></tr>` : ''}
      </tbody>
    </table>
    <div class="bottom-section">
      <div class="payment-breakdown">
        <div class="section-title">PAYMENT BREAKDOWN / تفصيل الدفع</div>
        <div class="pay-row"><span class="label">Subtotal</span><span class="value">${sub.toFixed(2)} SAR</span></div>
        ${disc > 0 ? `<div class="pay-row" style="color:#059669;"><span class="label">Discount</span><span class="value">- ${disc.toFixed(2)} SAR</span></div>` : ''}
        <div class="pay-row"><span class="label">VAT (${vr}%)</span><span class="value">${vat.toFixed(2)} SAR</span></div>
        ${uc > 0 ? `<div class="pay-row" style="color:#7C3AED;"><span class="label">Credit Used</span><span class="value">- ${uc.toFixed(2)} SAR</span></div>` : ''}
        ${cr > 0 ? `<div class="pay-row" style="color:#EF4444;"><span class="label">Cash Returned</span><span class="value">- ${cr.toFixed(2)} SAR</span></div>` : ''}
        <div class="pay-row" style="border-top:2px solid #CBD5E1;margin-top:4px;padding-top:4px;font-weight:700;">
          <span class="label">Paid (${pd})</span>
          <span class="value green">${cp.toFixed(2)} SAR</span>
        </div>
        <div class="pay-row" style="font-weight:700;font-size:11px;">
          <span class="label">Due</span>
          <span class="value ${due > 0 ? 'red' : 'green'}">${due.toFixed(2)} SAR</span>
        </div>
      </div>
      <div class="totals-box">
        <div class="total-row"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
        ${disc > 0 ? `<div class="total-row" style="color:#34D399;"><span>Discount</span><span>- ${disc.toFixed(2)}</span></div>` : ''}
        <div class="total-row"><span>VAT (${vr}%)</span><span>${vat.toFixed(2)}</span></div>
        <div class="grand-total"><span>GRAND TOTAL</span><span class="value">${tot.toFixed(2)} SAR</span></div>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="code-section">
      <img src="${barcode}" alt="Barcode"/>
      <div class="code-label">CHECK-IN</div>
      <img src="${qr}" alt="QR" style="height:48px;width:48px;"/>
      <div class="code-label">INVOICE</div>
    </div>
    <div class="ai-message">
      <div class="ai-label">🤖 AI</div>
      <p>${aiMsg}</p>
    </div>
    <div class="footer-info">
      <p class="name">${st.company_name_en || 'SUEUD AL TAAYIRA'}</p>
      <p>${st.phone || ''}</p>
      <p style="font-family:'Cairo'">${st.company_name_ar || ''}</p>
    </div>
  </div>
  ${hasPrev ? `
  <div class="linked-section">
    <div class="linked-title">🔄 ${isRTL ? 'الحجز السابق والاسترجاع المرتبط' : 'Previous Booking & Linked Refund'}</div>
    <div class="reissue-block">
      <div class="reissue-item"><div class="label">Old Date</div><div class="value">${prevDate}</div></div>
      <div class="reissue-item"><div class="label">Old Airline</div><div class="value">${prevAirline}</div></div>
      <div class="reissue-item"><div class="label">Old Sector</div><div class="value">${prevSector}</div></div>
      <div class="reissue-item"><div class="label">Old PNR</div><div class="value">${prevPnr}</div></div>
      <div class="reissue-item"><div class="label">Old Ticket</div><div class="value">${prevTicket}</div></div>
      <div class="reissue-item"><div class="label">Old Type</div><div class="value">${prevType}</div></div>
      <div class="reissue-fare"><span class="label">Original Fare</span><span class="value">${prevFare.toFixed(2)} SAR</span></div>
    </div>
    <div class="refund-details">
      <div class="refund-item"><div class="label">Refund Amount</div><div class="value">${prevRefundCust.toFixed(2)} SAR</div></div>
      <div class="refund-item"><div class="label">Refund Date</div><div class="value">${inv.refund_date || inv.invoice_date || 'N/A'}</div></div>
      <div class="refund-item"><div class="label">Reason</div><div class="value">${prevRefundReason || 'N/A'}</div></div>
    </div>
  </div>` : ''}
</div>
</body>
</html>`;
};

// ================================================================
// 2. REFUND INVOICE
// ================================================================
export const getRefundHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app/invoice/' + no)}`;
  const airlineInfoTarget = inv.old_airline
    ? `https://www.google.com/search?q=${encodeURIComponent(inv.old_airline + ' airline customer service')}`
    : `https://sueud-al-taayira.vercel.app/invoice/${no}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(airlineInfoTarget)}&scale=3&height=50&barcolor=7F1D1D&backgroundcolor=ffffff&includetext=false`;
  const of2 = inv.old_sell_price || inv.total_sell || 0;
  const cRef = inv.refund_customer || 0;
  const cn = inv.customers?.name || inv.old_customer_name || 'N/A';
  const cp = inv.customers?.phone || inv.old_customer_phone || 'N/A';
  const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : (inv.old_passengers || 'N/A');
  let rm = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit') rm = 'Credit for New Booking / رصيد لحجز جديد';
  const aiMsg = getAIMessage(inv, lang, 'refund');
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const fontFamily = isRTL ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Poppins', sans-serif";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refund ${no}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
    html, body { height: 100%; margin: 0; padding: 0; }
    body {
      font-family: ${fontFamily};
      background: #F8FAFC;
      color: #1E293B;
      font-size: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      margin: 0;
    }
    .refund-container {
      width: 210mm;
      height: 297mm;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #DC2626 100%);
      color: #FFFFFF;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 4px solid #FBBF24;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 2px solid #FBBF24;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .logo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .logo-wrapper .placeholder { font-size: 36px; }
    .company-info h1 {
      font-size: 22px;
      font-weight: 900;
      color: #FBBF24;
      margin: 0;
    }
    .company-info h2 {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
      margin: 2px 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .company-info p {
      font-size: 9px;
      color: rgba(255,255,255,0.7);
      margin: 4px 0 0;
      line-height: 1.4;
    }
    .header-right {
      text-align: right;
      background: rgba(255,255,255,0.08);
      padding: 12px 24px;
      border-radius: 12px;
      backdrop-filter: blur(4px);
      min-width: 200px;
    }
    .header-right .doc-title {
      font-size: 20px;
      font-weight: 900;
      color: #FBBF24;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .header-right .doc-title span {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.7;
      display: block;
      font-family: 'Cairo', sans-serif;
    }
    .header-right .meta { font-size: 10px; margin-top: 4px; color: rgba(255,255,255,0.8); }
    .header-right .meta span { color: #FBBF24; font-weight: 700; }
    .status-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 10px;
      margin-top: 6px;
      background: rgba(251,191,36,0.2);
      color: #FBBF24;
      border: 1px solid rgba(251,191,36,0.3);
    }
    .company-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 8px 24px;
      background: #FEF2F2;
      border-bottom: 1px solid #FECACA;
      flex-shrink: 0;
      font-size: 9px;
    }
    .company-bar .item .label { color: #991B1B; font-weight: 600; text-transform: uppercase; font-size: 7px; }
    .company-bar .item .value { color: #7F1D1D; font-weight: 700; }
    .body {
      padding: 16px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow: hidden;
    }
    .section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #7F1D1D;
      border-bottom: 2px solid #7F1D1D;
      padding-bottom: 4px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
    }
    .info-box {
      padding: 10px 14px;
      background: #FEF2F2;
      border-radius: 8px;
      border-left: 4px solid #DC2626;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 3px 0;
      border-bottom: 1px solid #FECACA;
    }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { color: #991B1B; }
    .info-row .value { color: #7F1D1D; font-weight: 600; max-width: 60%; word-break: break-word; text-align: right; }
    .refund-summary {
      background: #FFF;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
    }
    .refund-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 4px 0;
      border-bottom: 1px dashed #E2E8F0;
    }
    .refund-row:last-child { border-bottom: none; }
    .refund-row .label { color: #64748B; }
    .refund-row .value { font-weight: 600; }
    .refund-row.total {
      border-top: 2px solid #DC2626;
      font-size: 14px;
      font-weight: 800;
      color: #059669;
    }
    .refund-row.total .label { color: #334155; }
    .refund-row.total .value { color: #059669; }
    .refund-method {
      padding: 10px 14px;
      background: #F8FAFC;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
    }
    .refund-method .label { color: #334155; font-weight: 600; }
    .refund-method .value { color: #2563EB; font-weight: 700; }
    .footer {
      padding: 10px 24px;
      background: #FEF2F2;
      border-top: 1px solid #FECACA;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      margin-top: auto;
      gap: 12px;
    }
    .code-section { display: flex; align-items: center; gap: 8px; }
    .code-section img { height: 32px; width: auto; border-radius: 4px; border: 1px solid #FECACA; padding: 2px 6px; background: #FFF; }
    .code-label { font-size: 7px; text-align: center; color: #991B1B; font-weight: 600; }
    .ai-message {
      flex: 1;
      text-align: center;
      padding: 4px 12px;
      background: #FEF2F2;
      border-radius: 6px;
      border: 1px solid #FCA5A5;
    }
    .ai-message .ai-label { font-size: 7px; color: #DC2626; font-weight: 700; text-transform: uppercase; }
    .ai-message p { font-size: 9px; color: #7F1D1D; margin: 0; }
    .footer-info { text-align: center; min-width: 70px; }
    .footer-info p { font-size: 7px; color: #94A3B8; margin: 1px 0; }
    .footer-info .name { font-weight: 700; color: #7F1D1D; font-size: 8px; }
    @media print {
      body { background: white; padding: 0; margin: 0; }
      .refund-container { border-radius: 0; box-shadow: none; height: 100%; width: 100%; }
    }
  </style>
</head>
<body>
<div class="refund-container">
  <div class="header">
    <div class="header-left">
      <div class="logo-wrapper">
        ${st.logo_url ? `<img src="${st.logo_url}" alt="Logo"/>` : `<span class="placeholder">✈️</span>`}
      </div>
      <div class="company-info">
        <h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
        <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
        <p>${st.address_ar || ''} ${st.phone ? '📞 ' + st.phone : ''}</p>
      </div>
    </div>
    <div class="header-right">
      <div class="doc-title">REFUND <span>استرجاع</span></div>
      <div class="meta">No: <span>${no}</span></div>
      <div class="meta">Date: <span>${inv.refund_date || inv.invoice_date || ''}</span></div>
      <div class="status-badge">PROCESSED</div>
    </div>
  </div>
  <div class="company-bar">
    <div class="item"><div class="label">VAT No</div><div class="value">${st.vat_no || 'N/A'}</div></div>
    <div class="item"><div class="label">CR No</div><div class="value">${st.cr_no || 'N/A'}</div></div>
    <div class="item"><div class="label">License</div><div class="value">${st.license_no || 'N/A'}</div></div>
    <div class="item"><div class="label">Tourism Lic.</div><div class="value">${st.tourism_license_no || 'N/A'}</div></div>
  </div>
  <div class="body">
    <div class="info-box">
      <div class="section-title">BOOKING DETAILS / تفاصيل الحجز</div>
      <div class="info-row"><span class="label">Customer</span><span class="value">${cn}</span></div>
      <div class="info-row"><span class="label">Phone</span><span class="value">${cp}</span></div>
      <div class="info-row"><span class="label">Passengers</span><span class="value" style="font-size:8px;">${pax}</span></div>
      <div class="info-row"><span class="label">Airline</span><span class="value">${inv.airline || inv.old_airline || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Date</span><span class="value">${inv.invoice_date || 'N/A'}</span></div>
      <div class="info-row"><span class="label">PNR</span><span class="value" style="color:#2563EB;font-weight:700;">${inv.pnr || inv.old_pnr || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Reason</span><span class="value">${inv.refund_reason || 'N/A'}</span></div>
    </div>
    <div class="refund-summary">
      <div class="section-title">REFUND SUMMARY / ملخص الاسترجاع</div>
      <div class="refund-row"><span class="label">Original Fare</span><span class="value">${of2.toFixed(2)} SAR</span></div>
      <div class="refund-row total"><span class="label">Refund Amount</span><span class="value">${cRef.toFixed(2)} SAR</span></div>
    </div>
    <div class="refund-method">
      <span class="label">Refund Method</span>
      <span class="value">${rm}</span>
    </div>
  </div>
  <div class="footer">
    <div class="code-section">
      <img src="${barcode}" alt="Barcode"/>
      <div class="code-label">AIRLINE INFO</div>
      <img src="${qr}" alt="QR" style="height:48px;width:48px;"/>
      <div class="code-label">DOWNLOAD</div>
    </div>
    <div class="ai-message">
      <div class="ai-label">🤖 AI</div>
      <p>${aiMsg}</p>
    </div>
    <div class="footer-info">
      <p class="name">${st.company_name_en || 'SUEUD AL TAAYIRA'}</p>
      <p>${st.phone || ''}</p>
      <p style="font-family:'Cairo'">${st.company_name_ar || ''}</p>
    </div>
  </div>
</div>
</body>
</html>`;
};

// ================================================================
// 3. EXPENSE VOUCHER
// ================================================================
export const getExpenseHTML = (exp, s, lang = 'en') => {
  const st = s || {};
  const eno = `EXP-${exp.id ? exp.id.substring(0, 8) : 'N/A'}`;
  const items = exp.items && exp.items.length > 0 ? exp.items : [{ name: exp.item_name || 'Item', qty: 1, price: exp.amount || 0 }];
  const aiMsg = getAIMessage(exp, lang, 'expense');
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(eno)}&scale=3&height=50&barcolor=7C2D12&backgroundcolor=ffffff&includetext=false`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(eno + ' - ' + (exp.category || exp.description || ''))}`;
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const fontFamily = isRTL ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Poppins', sans-serif";
  const totalAmount = items.reduce((s, i) => s + ((parseFloat(i.qty) || 1) * (parseFloat(i.price) || 0)), 0);

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expense ${eno}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
    html, body { height: 100%; margin: 0; padding: 0; }
    body {
      font-family: ${fontFamily};
      background: #F8FAFC;
      color: #1E293B;
      font-size: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      margin: 0;
    }
    .expense-container {
      width: 210mm;
      height: 297mm;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: linear-gradient(135deg, #7C2D12 0%, #9A3412 50%, #EA580C 100%);
      color: #FFFFFF;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 4px solid #FBBF24;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 2px solid #FBBF24;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .logo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .logo-wrapper .placeholder { font-size: 36px; }
    .company-info h1 {
      font-size: 22px;
      font-weight: 900;
      color: #FBBF24;
      margin: 0;
    }
    .company-info h2 {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
      margin: 2px 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .company-info p {
      font-size: 9px;
      color: rgba(255,255,255,0.7);
      margin: 4px 0 0;
      line-height: 1.4;
    }
    .header-right {
      text-align: right;
      background: rgba(255,255,255,0.08);
      padding: 12px 24px;
      border-radius: 12px;
      backdrop-filter: blur(4px);
      min-width: 200px;
    }
    .header-right .doc-title {
      font-size: 20px;
      font-weight: 900;
      color: #FBBF24;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .header-right .doc-title span {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.7;
      display: block;
      font-family: 'Cairo', sans-serif;
    }
    .header-right .meta { font-size: 10px; margin-top: 4px; color: rgba(255,255,255,0.8); }
    .header-right .meta span { color: #FBBF24; font-weight: 700; }
    .company-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 8px 24px;
      background: #FFF7ED;
      border-bottom: 1px solid #FED7AA;
      flex-shrink: 0;
      font-size: 9px;
    }
    .company-bar .item .label { color: #9A3412; font-weight: 600; text-transform: uppercase; font-size: 7px; }
    .company-bar .item .value { color: #7C2D12; font-weight: 700; }
    .body {
      padding: 16px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow: hidden;
    }
    .section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #7C2D12;
      border-bottom: 2px solid #7C2D12;
      padding-bottom: 4px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
    }
    .info-box {
      padding: 10px 14px;
      background: #FFF7ED;
      border-radius: 8px;
      border-left: 4px solid #EA580C;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 3px 0;
      border-bottom: 1px solid #FED7AA;
    }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { color: #9A3412; }
    .info-row .value { color: #7C2D12; font-weight: 600; max-width: 60%; word-break: break-word; text-align: right; }
    .expense-table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .expense-table th {
      background: #7C2D12;
      color: #FBBF24;
      padding: 6px 10px;
      font-size: 8px;
      text-transform: uppercase;
      text-align: left;
    }
    .expense-table th.right { text-align: right; }
    .expense-table td {
      padding: 6px 10px;
      border-bottom: 1px solid #F1F5F9;
      font-size: 9px;
    }
    .expense-table td.right { text-align: right; font-weight: 600; }
    .total-box {
      background: linear-gradient(135deg, #7C2D12, #9A3412);
      color: #FFFFFF;
      padding: 14px 18px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-box .amount { font-size: 20px; font-weight: 900; color: #FBBF24; }
    .footer {
      padding: 10px 24px;
      background: #FFF7ED;
      border-top: 1px solid #FED7AA;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      margin-top: auto;
      gap: 12px;
    }
    .code-section { display: flex; align-items: center; gap: 8px; }
    .code-section img { height: 32px; width: auto; border-radius: 4px; border: 1px solid #FED7AA; padding: 2px 6px; background: #FFF; }
    .code-label { font-size: 7px; text-align: center; color: #7C2D12; font-weight: 600; }
    .ai-message {
      flex: 1;
      text-align: center;
      padding: 4px 12px;
      background: #FFF7ED;
      border-radius: 6px;
      border: 1px solid #FDBA74;
    }
    .ai-message .ai-label { font-size: 7px; color: #9A3412; font-weight: 700; text-transform: uppercase; }
    .ai-message p { font-size: 9px; color: #7C2D12; margin: 0; }
    .footer-info { text-align: center; min-width: 70px; }
    .footer-info p { font-size: 7px; color: #94A3B8; margin: 1px 0; }
    .footer-info .name { font-weight: 700; color: #7C2D12; font-size: 8px; }
    @media print {
      body { background: white; padding: 0; margin: 0; }
      .expense-container { border-radius: 0; box-shadow: none; height: 100%; width: 100%; }
    }
  </style>
</head>
<body>
<div class="expense-container">
  <div class="header">
    <div class="header-left">
      <div class="logo-wrapper">
        ${st.logo_url ? `<img src="${st.logo_url}" alt="Logo"/>` : `<span class="placeholder">✈️</span>`}
      </div>
      <div class="company-info">
        <h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
        <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
        <p>${st.address_ar || ''} ${st.phone ? '📞 ' + st.phone : ''}</p>
      </div>
    </div>
    <div class="header-right">
      <div class="doc-title">EXPENSE VOUCHER</div>
      <div class="meta">No: <span>${eno}</span></div>
      <div class="meta">Date: <span>${exp.expense_date || ''}</span></div>
    </div>
  </div>
  <div class="company-bar">
    <div class="item"><div class="label">VAT No</div><div class="value">${st.vat_no || 'N/A'}</div></div>
    <div class="item"><div class="label">CR No</div><div class="value">${st.cr_no || 'N/A'}</div></div>
    <div class="item"><div class="label">License</div><div class="value">${st.license_no || 'N/A'}</div></div>
    <div class="item"><div class="label">Tourism Lic.</div><div class="value">${st.tourism_license_no || 'N/A'}</div></div>
  </div>
  <div class="body">
    <div class="info-box">
      <div class="section-title">DETAILS / التفاصيل</div>
      <div class="info-row"><span class="label">Type</span><span class="value">${exp.expense_type || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Payment</span><span class="value">${exp.payment_mode || 'Cash'}</span></div>
      <div class="info-row"><span class="label">Description</span><span class="value">${exp.description || 'N/A'}</span></div>
    </div>
    <table class="expense-table">
      <thead><tr><th>Item</th><th class="right">Qty</th><th class="right">Price</th><th class="right">Total</th></tr></thead>
      <tbody>
        ${items.map(function(it) {
          return '<tr><td>' + (it.name || 'Item') + '</td><td class="right">' + (it.qty || 1) + '</td><td class="right">' + parseFloat(it.price || 0).toFixed(2) + '</td><td class="right">' + ((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)).toFixed(2) + '</td></tr>';
        }).join('')}
      </tbody>
    </table>
    <div class="total-box">
      <span>TOTAL / الإجمالي</span>
      <span class="amount">${totalAmount.toFixed(2)} SAR</span>
    </div>
  </div>
  <div class="footer">
    <div class="code-section">
      <img src="${barcode}" alt="Barcode"/>
      <div class="code-label">EXPENSE REF</div>
      <img src="${qr}" alt="QR" style="height:48px;width:48px;"/>
      <div class="code-label">VERIFY</div>
    </div>
    <div class="ai-message">
      <div class="ai-label">🤖 AI</div>
      <p>${aiMsg}</p>
    </div>
    <div class="footer-info">
      <p class="name">${st.company_name_en || 'SUEUD AL TAAYIRA'}</p>
      <p>${st.phone || ''}</p>
    </div>
  </div>
</div>
</body>
</html>`;
};

// ================================================================
// 4. SALARY SLIP
// ================================================================
export const getSalarySlipHTML = (pay, s, lang = 'en') => {
  const st = s || {};
  const sno = `SLIP-${pay.id ? pay.id.substring(0, 8) : 'N/A'}`;
  const gross = (pay.salary || pay.base_salary || 0) + (pay.commission_amount || 0) + (pay.overtime || 0) + (pay.gift || 0);
  const tded = (pay.advance_deduction || 0) + (pay.mistakes_deduction || 0) + (pay.other_deduction || 0);
  const net = gross - tded;
  const aiMsg = getAIMessage(pay, lang, 'salary');
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(sno)}&scale=3&height=50&barcolor=0F172A&backgroundcolor=ffffff&includetext=false`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(sno + ' - ' + (pay.employees?.name || '') + ' - ' + (pay.month || ''))}`;
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const fontFamily = isRTL ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Poppins', sans-serif";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slip ${sno}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
    html, body { height: 100%; margin: 0; padding: 0; }
    body {
      font-family: ${fontFamily};
      background: #F8FAFC;
      color: #1E293B;
      font-size: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      margin: 0;
    }
    .slip-container {
      width: 210mm;
      height: 297mm;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%);
      color: #FFFFFF;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 4px solid #FBBF24;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 2px solid #FBBF24;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .logo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .logo-wrapper .placeholder { font-size: 36px; }
    .company-info h1 {
      font-size: 22px;
      font-weight: 900;
      color: #FBBF24;
      margin: 0;
    }
    .company-info h2 {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
      margin: 2px 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .company-info p {
      font-size: 9px;
      color: rgba(255,255,255,0.7);
      margin: 4px 0 0;
      line-height: 1.4;
    }
    .header-right {
      text-align: right;
      background: rgba(255,255,255,0.08);
      padding: 12px 24px;
      border-radius: 12px;
      backdrop-filter: blur(4px);
      min-width: 200px;
    }
    .header-right .doc-title {
      font-size: 20px;
      font-weight: 900;
      color: #FBBF24;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .header-right .doc-title span {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.7;
      display: block;
      font-family: 'Cairo', sans-serif;
    }
    .header-right .meta { font-size: 10px; margin-top: 4px; color: rgba(255,255,255,0.8); }
    .header-right .meta span { color: #FBBF24; font-weight: 700; }
    .company-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 8px 24px;
      background: #EFF6FF;
      border-bottom: 1px solid #BFDBFE;
      flex-shrink: 0;
      font-size: 9px;
    }
    .company-bar .item .label { color: #1E3A8A; font-weight: 600; text-transform: uppercase; font-size: 7px; }
    .company-bar .item .value { color: #0F172A; font-weight: 700; }
    .body {
      padding: 16px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow: hidden;
    }
    .section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #0F172A;
      border-bottom: 2px solid #0F172A;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .salary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }
    .salary-block {
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
      background: #F8FAFC;
    }
    .salary-block.earnings { border-left: 3px solid #059669; }
    .salary-block.deductions { border-left: 3px solid #EF4444; }
    .salary-block.net { border-left: 3px solid #2563EB; background: #EFF6FF; }
    .salary-block .title { font-size: 8px; font-weight: 700; text-transform: uppercase; color: #0F172A; margin-bottom: 4px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; }
    .salary-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 3px 0;
      border-bottom: 1px solid #F1F5F9;
    }
    .salary-row:last-child { border-bottom: none; }
    .salary-row .label { color: #64748B; }
    .salary-row .value { font-weight: 600; }
    .salary-row .value.green { color: #059669; }
    .salary-row .value.red { color: #EF4444; }
    .net-amount {
      font-size: 18px;
      font-weight: 900;
      color: #059669;
      text-align: center;
      padding: 8px 0;
      border-top: 2px solid #059669;
      margin-top: 6px;
    }
    .footer {
      padding: 10px 24px;
      background: #EFF6FF;
      border-top: 1px solid #BFDBFE;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      margin-top: auto;
      gap: 12px;
    }
    .code-section { display: flex; align-items: center; gap: 8px; }
    .code-section img { height: 32px; width: auto; border-radius: 4px; border: 1px solid #BFDBFE; padding: 2px 6px; background: #FFF; }
    .code-label { font-size: 7px; text-align: center; color: #1E3A8A; font-weight: 600; }
    .ai-message {
      flex: 1;
      text-align: center;
      padding: 4px 12px;
      background: #EFF6FF;
      border-radius: 6px;
      border: 1px solid #93C5FD;
    }
    .ai-message .ai-label { font-size: 7px; color: #3B82F6; font-weight: 700; text-transform: uppercase; }
    .ai-message p { font-size: 9px; color: #1E3A8A; margin: 0; }
    .footer-info { text-align: center; min-width: 70px; }
    .footer-info p { font-size: 7px; color: #94A3B8; margin: 1px 0; }
    .footer-info .name { font-weight: 700; color: #0F172A; font-size: 8px; }
    @media print {
      body { background: white; padding: 0; margin: 0; }
      .slip-container { border-radius: 0; box-shadow: none; height: 100%; width: 100%; }
    }
  </style>
</head>
<body>
<div class="slip-container">
  <div class="header">
    <div class="header-left">
      <div class="logo-wrapper">
        ${st.logo_url ? `<img src="${st.logo_url}" alt="Logo"/>` : `<span class="placeholder">✈️</span>`}
      </div>
      <div class="company-info">
        <h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
        <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
        <p>${st.address_ar || ''} ${st.phone ? '📞 ' + st.phone : ''}</p>
      </div>
    </div>
    <div class="header-right">
      <div class="doc-title">SALARY SLIP <span>قسيمة راتب</span></div>
      <div class="meta">No: <span>${sno}</span></div>
      <div class="meta">Month: <span>${pay.month || 'N/A'}</span></div>
      <div class="meta">Employee: <span>${pay.employees ? pay.employees.name : 'N/A'}</span></div>
    </div>
  </div>
  <div class="company-bar">
    <div class="item"><div class="label">VAT No</div><div class="value">${st.vat_no || 'N/A'}</div></div>
    <div class="item"><div class="label">CR No</div><div class="value">${st.cr_no || 'N/A'}</div></div>
    <div class="item"><div class="label">License</div><div class="value">${st.license_no || 'N/A'}</div></div>
    <div class="item"><div class="label">Tourism Lic.</div><div class="value">${st.tourism_license_no || 'N/A'}</div></div>
  </div>
  <div class="body">
    <div class="salary-grid">
      <div class="salary-block earnings">
        <div class="title">EARNINGS</div>
        <div class="salary-row"><span class="label">Base Salary</span><span class="value">${(pay.salary || pay.base_salary || 0).toFixed(2)} SAR</span></div>
        <div class="salary-row"><span class="label">Commission</span><span class="value">${(pay.commission_amount || pay.commission || 0).toFixed(2)} SAR</span></div>
        <div class="salary-row"><span class="label">Overtime</span><span class="value">${(pay.overtime || 0).toFixed(2)} hrs</span></div>
        <div class="salary-row"><span class="label">Gift/Bonus</span><span class="value">${(pay.gift || 0).toFixed(2)} SAR</span></div>
      </div>
      <div class="salary-block deductions">
        <div class="title">DEDUCTIONS</div>
        <div class="salary-row"><span class="label">Advance Deduct</span><span class="value red">${(pay.advance_deduction || 0).toFixed(2)} SAR</span></div>
        <div class="salary-row"><span class="label">Mistakes Deduct</span><span class="value red">${(pay.mistakes_deduction || 0).toFixed(2)} SAR</span></div>
        <div class="salary-row"><span class="label">Other Deduct</span><span class="value red">${(pay.other_deduction || 0).toFixed(2)} SAR</span></div>
      </div>
      <div class="salary-block net">
        <div class="title">NET PAY</div>
        <div class="net-amount">${net.toFixed(2)} SAR</div>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="code-section">
      <img src="${barcode}" alt="Barcode"/>
      <div class="code-label">SLIP REF</div>
      <img src="${qr}" alt="QR" style="height:48px;width:48px;"/>
      <div class="code-label">VERIFY</div>
    </div>
    <div class="ai-message">
      <div class="ai-label">🤖 AI</div>
      <p>${aiMsg}</p>
    </div>
    <div class="footer-info">
      <p class="name">${st.company_name_en || 'SUEUD AL TAAYIRA'}</p>
      <p>${st.phone || ''}</p>
    </div>
  </div>
</div>
</body>
</html>`;
};

// ================================================================
// 5. CONTRACT
// ================================================================
export const getContractHTML = (settings, corpName, date, isOffer = false, serviceType = 'Flight Tickets', markup = '10', terms = '') => {
  const st = settings || {};
  const docType = isOffer ? 'CORPORATE OFFER' : 'CORPORATE CONTRACT';
  const refNo = `${isOffer ? 'OFR' : 'CTR'}-${Date.now()}`;
  const aiPool = isOffer
    ? ['We look forward to a rewarding partnership.', 'This offer reflects our best rates for you.', 'Thank you for considering us for your travel needs.']
    : ['We value long-term partnerships built on trust.', 'Our team is committed to your service excellence.', 'Looking forward to a successful collaboration.'];
  const aiMsg = aiPool[refNo.length % aiPool.length];
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(refNo)}&scale=3&height=50&barcolor=1E3A8A&backgroundcolor=ffffff&includetext=false`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(refNo + ' - ' + (corpName || ''))}`;
  const effectiveTerms = terms || `1. Payment Terms: 100% advance payment required to confirm the booking.\n2. Validity: This document is valid for 30 days from the date of issue.\n3. Refund Policy: All cancellations are subject to airline/hotel cancellation policies.\n4. Prices are subject to change based on availability at the time of final booking.\n5. Passenger names must match exactly as per passport/ID.`;
  const isRTL = false;
  const dir = 'ltr';

  return `<!DOCTYPE html>
<html lang="en" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docType}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
    html, body { height: 100%; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Poppins', sans-serif;
      background: #F8FAFC;
      color: #1E293B;
      font-size: 11px;
      line-height: 1.5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      margin: 0;
    }
    .contract-container {
      width: 210mm;
      height: 297mm;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%);
      color: #FFFFFF;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 4px solid #FBBF24;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 2px solid #FBBF24;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .logo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .logo-wrapper .placeholder { font-size: 36px; }
    .company-info h1 {
      font-size: 22px;
      font-weight: 900;
      color: #FBBF24;
      margin: 0;
    }
    .company-info h2 {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
      margin: 2px 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .company-info p {
      font-size: 9px;
      color: rgba(255,255,255,0.7);
      margin: 4px 0 0;
      line-height: 1.4;
    }
    .header-right {
      text-align: right;
      background: rgba(255,255,255,0.08);
      padding: 12px 24px;
      border-radius: 12px;
      backdrop-filter: blur(4px);
      min-width: 200px;
    }
    .header-right .doc-title {
      font-size: 20px;
      font-weight: 900;
      color: #FBBF24;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .header-right .doc-title span {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.7;
      display: block;
      font-family: 'Cairo', sans-serif;
    }
    .header-right .meta { font-size: 10px; margin-top: 4px; color: rgba(255,255,255,0.8); }
    .header-right .meta span { color: #FBBF24; font-weight: 700; }
    .body {
      padding: 24px 30px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow: hidden;
    }
    .title { font-size: 22px; font-weight: 800; color: #1E3A8A; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; }
    .section-title { font-size: 14px; font-weight: 700; color: #1E3A8A; border-left: 4px solid #3B82F6; padding-left: 12px; margin-bottom: 8px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-item { background: #F8FAFC; padding: 10px 14px; border-radius: 8px; border: 1px solid #E2E8F0; }
    .info-item .label { font-size: 9px; color: #64748B; font-weight: 600; text-transform: uppercase; }
    .info-item .value { font-size: 13px; color: #0F172A; font-weight: 700; }
    .terms-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px 20px; }
    .terms-box h3 { font-size: 14px; font-weight: 700; color: #1E3A8A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 8px; }
    .term-item { display: flex; gap: 10px; padding: 4px 0; border-bottom: 1px solid #E2E8F0; }
    .term-item:last-child { border-bottom: none; }
    .term-num { color: #3B82F6; font-weight: 700; min-width: 24px; }
    .term-text { color: #475569; }
    .ai-box { background: #EFF6FF; border: 1px solid #93C5FD; border-radius: 8px; padding: 10px 16px; }
    .ai-box .ai-label { font-size: 9px; color: #3B82F6; font-weight: 700; text-transform: uppercase; }
    .ai-box p { color: #1E3A8A; margin: 0; }
    .signature-area { display: flex; justify-content: space-between; margin-top: auto; padding-top: 16px; border-top: 2px solid #E2E8F0; }
    .sig-block { text-align: center; flex: 1; }
    .sig-line { width: 200px; height: 1px; background: #1E3A8A; margin: 0 auto 8px auto; }
    .sig-name { font-weight: 700; color: #1E3A8A; }
    .sig-role { font-size: 11px; color: #64748B; }
    .footer {
      padding: 10px 24px;
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      margin-top: auto;
      gap: 12px;
      font-size: 9px;
      color: #64748B;
    }
    .code-section { display: flex; align-items: center; gap: 8px; }
    .code-section img { height: 32px; width: auto; border-radius: 4px; border: 1px solid #E2E8F0; padding: 2px 6px; background: #FFF; }
    .code-label { font-size: 7px; text-align: center; color: #475569; font-weight: 600; }
    @media print {
      body { background: white; padding: 0; margin: 0; }
      .contract-container { border-radius: 0; box-shadow: none; height: 100%; width: 100%; }
    }
  </style>
</head>
<body>
<div class="contract-container">
  <div class="header">
    <div class="header-left">
      <div class="logo-wrapper">
        ${st.logo_url ? `<img src="${st.logo_url}" alt="Logo"/>` : `<span class="placeholder">✈️</span>`}
      </div>
      <div class="company-info">
        <h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
        <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
        <p>${st.address_ar || ''} ${st.phone ? '📞 ' + st.phone : ''}</p>
      </div>
    </div>
    <div class="header-right">
      <div class="doc-title">${docType}</div>
      <div class="meta">Ref: <span>${refNo}</span></div>
      <div class="meta">Date: <span>${date}</span></div>
    </div>
  </div>
  <div class="body">
    <div class="title">${isOffer ? 'Corporate Offer Letter' : 'Corporate Service Agreement'}</div>
    <div>
      <div class="section-title">Parties Involved</div>
      <div class="info-grid">
        <div class="info-item"><div class="label">Service Provider</div><div class="value">${st.company_name_en || 'Company Name'}</div></div>
        <div class="info-item"><div class="label">Client</div><div class="value">${corpName || 'Client Name'}</div></div>
        <div class="info-item"><div class="label">Date</div><div class="value">${date}</div></div>
        <div class="info-item"><div class="label">Validity</div><div class="value">30 Days from issue date</div></div>
      </div>
    </div>
    <div>
      <div class="section-title">Service Details</div>
      <div class="info-grid">
        <div class="info-item"><div class="label">Service Type</div><div class="value">${serviceType}</div></div>
        <div class="info-item"><div class="label">Service Fee</div><div class="value">${parseFloat(markup || 0).toFixed(2)} SAR</div></div>
        <div class="info-item"><div class="label">Payment Terms</div><div class="value">100% Advance Required</div></div>
      </div>
    </div>
    <div class="terms-box">
      <h3>Terms & Conditions</h3>
      ${effectiveTerms.split('\n').filter(t => t.trim()).map((term, i) => 
        `<div class="term-item"><span class="term-num">${i + 1}.</span><span class="term-text">${term}</span></div>`
      ).join('')}
    </div>
    <div class="ai-box">
      <div class="ai-label">🤖 Note</div>
      <p>${aiMsg}</p>
    </div>
    <div class="signature-area">
      <div class="sig-block"><div class="sig-line"></div><div class="sig-name">Authorized Signatory</div><div class="sig-role">${st.company_name_en || 'Authorized Person'}</div></div>
      <div class="sig-block"><div class="sig-line"></div><div class="sig-name">Client Acceptance</div><div class="sig-role">Name & Signature</div></div>
    </div>
  </div>
  <div class="footer">
    <div class="code-section">
      <img src="${barcode}" alt="Barcode"/>
      <div class="code-label">DOC REF</div>
      <img src="${qr}" alt="QR" style="height:48px;width:48px;"/>
      <div class="code-label">VERIFY</div>
    </div>
    <p>© ${new Date().getFullYear()} ${st.company_name_en || 'SUEUD AL TAAYIRA'}. All rights reserved.</p>
    <p style="font-size:8px;color:#94A3B8">Computer-generated - Valid without physical signature</p>
  </div>
</div>
</body>
</html>`;
};

// ================================================================
// 6. MISTAKE VOUCHER
// ================================================================
export const getMistakeHTML = (m, s, lang = 'en') => {
  const st = s || {};
  const aiMsg = getAIMessage(m, lang, 'mistake');
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const fontFamily = isRTL ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Poppins', sans-serif";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Staff Mistake Voucher</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
    html, body { height: 100%; margin: 0; padding: 0; }
    body {
      font-family: ${fontFamily};
      background: #F8FAFC;
      color: #1E293B;
      font-size: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      margin: 0;
    }
    .mistake-container {
      width: 210mm;
      height: 297mm;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #DC2626 100%);
      color: #FFFFFF;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 4px solid #FBBF24;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 2px solid #FBBF24;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .logo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .logo-wrapper .placeholder { font-size: 36px; }
    .company-info h1 {
      font-size: 22px;
      font-weight: 900;
      color: #FBBF24;
      margin: 0;
    }
    .company-info h2 {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
      margin: 2px 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .company-info p {
      font-size: 9px;
      color: rgba(255,255,255,0.7);
      margin: 4px 0 0;
      line-height: 1.4;
    }
    .header-right {
      text-align: right;
      background: rgba(255,255,255,0.08);
      padding: 12px 24px;
      border-radius: 12px;
      backdrop-filter: blur(4px);
      min-width: 200px;
    }
    .header-right .doc-title {
      font-size: 20px;
      font-weight: 900;
      color: #FBBF24;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .header-right .doc-title span {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.7;
      display: block;
      font-family: 'Cairo', sans-serif;
    }
    .header-right .meta { font-size: 10px; margin-top: 4px; color: rgba(255,255,255,0.8); }
    .header-right .meta span { color: #FBBF24; font-weight: 700; }
    .company-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 8px 24px;
      background: #FEF2F2;
      border-bottom: 1px solid #FECACA;
      flex-shrink: 0;
      font-size: 9px;
    }
    .company-bar .item .label { color: #991B1B; font-weight: 600; text-transform: uppercase; font-size: 7px; }
    .company-bar .item .value { color: #7F1D1D; font-weight: 700; }
    .body {
      padding: 16px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow: hidden;
    }
    .title { font-size: 20px; font-weight: 800; color: #7F1D1D; border-bottom: 2px solid #FECACA; padding-bottom: 6px; }
    .section-title { font-size: 14px; font-weight: 700; color: #7F1D1D; border-left: 4px solid #DC2626; padding-left: 12px; margin-bottom: 8px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .info-item { background: #FFF5F5; padding: 8px 12px; border-radius: 8px; border: 1px solid #FECACA; }
    .info-item .label { font-size: 8px; color: #991B1B; font-weight: 600; text-transform: uppercase; }
    .info-item .value { font-size: 11px; color: #7F1D1D; font-weight: 700; }
    .danger-box { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 12px 16px; }
    .danger-title { font-weight: 700; color: #DC2626; border-bottom: 1px solid #FECACA; padding-bottom: 4px; margin-bottom: 6px; }
    .danger-row { display: flex; justify-content: space-between; font-size: 9px; padding: 3px 0; border-bottom: 1px solid #FECACA; }
    .danger-row:last-child { border-bottom: none; }
    .loss-amount { font-size: 24px; font-weight: 900; color: #DC2626; text-align: center; padding: 8px; background: #FEF2F2; border: 1px dashed #FECACA; border-radius: 8px; }
    .ai-box { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 10px 16px; text-align: center; }
    .ai-box .ai-label { font-size: 7px; color: #991B1B; font-weight: 700; text-transform: uppercase; }
    .ai-box p { font-size: 9px; color: #78350F; margin: 0; }
    .footer {
      padding: 10px 24px;
      background: #FEF2F2;
      border-top: 1px solid #FECACA;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      margin-top: auto;
      gap: 12px;
      font-size: 9px;
      color: #64748B;
    }
    .footer p { margin: 0; }
    @media print {
      body { background: white; padding: 0; margin: 0; }
      .mistake-container { border-radius: 0; box-shadow: none; height: 100%; width: 100%; }
    }
  </style>
</head>
<body>
<div class="mistake-container">
  <div class="header">
    <div class="header-left">
      <div class="logo-wrapper">
        ${st.logo_url ? `<img src="${st.logo_url}" alt="Logo"/>` : `<span class="placeholder">⚠️</span>`}
      </div>
      <div class="company-info">
        <h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
        <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
        <p>${st.address_ar || ''} ${st.phone ? '📞 ' + st.phone : ''}</p>
      </div>
    </div>
    <div class="header-right">
      <div class="doc-title">STAFF MISTAKE <span>VOUCHER</span></div>
      <div class="meta">Date: <span>${m.date || ''}</span></div>
      <div class="meta">Ref: <span>${m.id ? 'MS-' + m.id.substring(0, 8) : 'N/A'}</span></div>
    </div>
  </div>
  <div class="company-bar">
    <div class="item"><div class="label">VAT No</div><div class="value">${st.vat_no || 'N/A'}</div></div>
    <div class="item"><div class="label">CR No</div><div class="value">${st.cr_no || 'N/A'}</div></div>
    <div class="item"><div class="label">License</div><div class="value">${st.license_no || 'N/A'}</div></div>
    <div class="item"><div class="label">Tourism Lic.</div><div class="value">${st.tourism_license_no || 'N/A'}</div></div>
  </div>
  <div class="body">
    <div class="title">⚠️ Staff Mistake / خطأ الموظف</div>
    <div>
      <div class="section-title">Mistake Details</div>
      <div class="info-grid">
        <div class="info-item"><div class="label">Employee</div><div class="value">${m.employees?.name || 'N/A'}</div></div>
        <div class="info-item"><div class="label">Old Ticket</div><div class="value">${m.old_ticket_no || 'N/A'}</div></div>
        <div class="info-item"><div class="label">New Ticket</div><div class="value">${m.new_ticket_no || 'N/A'}</div></div>
        <div class="info-item"><div class="label">Reason</div><div class="value">${m.reason || 'N/A'}</div></div>
      </div>
    </div>
    <div class="danger-box">
      <div class="danger-title">⚠️ FINANCIAL IMPACT</div>
      <div class="danger-row"><span>Ticket Price</span><span>${parseFloat(m.old_sell_price || 0).toFixed(2)} SAR</span></div>
      <div class="danger-row"><span>Airline Fees</span><span>- ${((m.old_sell_price || 0) - (m.refund_company || 0)).toFixed(2)} SAR</span></div>
      <div class="danger-row"><span>Customer Refund</span><span>${(m.refund_customer || 0).toFixed(2)} SAR</span></div>
    </div>
    <div class="loss-amount">LOSS: ${(m.loss_amount || 0).toFixed(2)} SAR</div>
    <div>
      <div class="section-title">Deduction</div>
      <div class="info-grid">
        <div class="info-item"><div class="label">Loss Amount</div><div class="value" style="color:#DC2626;">${(m.loss_amount || 0).toFixed(2)} SAR</div></div>
        <div class="info-item"><div class="label">Deduct from Salary</div><div class="value" style="color:${m.paid_by_employee ? '#059669' : '#64748B'};">${m.paid_by_employee ? 'YES / نعم' : 'NO / لا'}</div></div>
      </div>
    </div>
    <div class="ai-box">
      <div class="ai-label">🤖 AI INSIGHT</div>
      <p>${aiMsg}</p>
    </div>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} ${st.company_name_en || 'SUEUD AL TAAYIRA'}</p>
    <p style="font-size:8px;color:#94A3B8">Computer-generated - Valid without signature</p>
  </div>
</div>
</body>
</html>`;
};

// ================================================================
// 7. RECHARGE VOUCHER
// ================================================================
export const getRechargeHTML = (recharge, portal, settings, lang = 'en') => {
  const st = settings || {};
  const no = recharge.id ? `RCH-${recharge.id.substring(0, 8)}` : 'RCH-000000';
  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const fontFamily = isRTL ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Poppins', sans-serif";
  const amount = recharge.amount || 0;
  const date = recharge.recharge_date || '';
  const source = recharge.source || 'Cash';
  const portalName = portal?.name || 'Unknown Portal';
  const reference = recharge.reference || 'N/A';
  const notes = recharge.notes || 'N/A';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recharge Voucher ${no}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
    html, body { height: 100%; margin: 0; padding: 0; }
    body {
      font-family: ${fontFamily};
      background: #F8FAFC;
      color: #1E293B;
      font-size: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      margin: 0;
    }
    .recharge-container {
      width: 210mm;
      height: 297mm;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%);
      color: #FFFFFF;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 4px solid #FBBF24;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 2px solid #FBBF24;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .logo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .logo-wrapper .placeholder { font-size: 36px; }
    .company-info h1 {
      font-size: 22px;
      font-weight: 900;
      color: #FBBF24;
      margin: 0;
    }
    .company-info h2 {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
      margin: 2px 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .company-info p {
      font-size: 9px;
      color: rgba(255,255,255,0.7);
      margin: 4px 0 0;
      line-height: 1.4;
    }
    .header-right {
      text-align: right;
      background: rgba(255,255,255,0.08);
      padding: 12px 24px;
      border-radius: 12px;
      backdrop-filter: blur(4px);
      min-width: 200px;
    }
    .header-right .doc-title {
      font-size: 20px;
      font-weight: 900;
      color: #FBBF24;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .header-right .doc-title span {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.7;
      display: block;
      font-family: 'Cairo', sans-serif;
    }
    .header-right .meta { font-size: 10px; margin-top: 4px; color: rgba(255,255,255,0.8); }
    .header-right .meta span { color: #FBBF24; font-weight: 700; }
    .company-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 8px 24px;
      background: #F1F5F9;
      border-bottom: 1px solid #E2E8F0;
      flex-shrink: 0;
      font-size: 9px;
    }
    .company-bar .item .label { color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 7px; }
    .company-bar .item .value { color: #0F172A; font-weight: 700; }
    .body {
      padding: 16px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow: hidden;
    }
    .section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #1E3A8A;
      border-bottom: 2px solid #1E3A8A;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .info-box {
      padding: 10px 14px;
      background: #F8FAFC;
      border-radius: 8px;
      border-left: 4px solid #2563EB;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 3px 0;
      border-bottom: 1px solid #E2E8F0;
    }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { color: #64748B; }
    .info-row .value { color: #0F172A; font-weight: 600; }
    .total-box {
      background: linear-gradient(135deg, #0F172A, #1E3A8A);
      color: #FFFFFF;
      padding: 14px 18px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-box .amount { font-size: 20px; font-weight: 900; color: #FBBF24; }
    .footer {
      padding: 10px 24px;
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      margin-top: auto;
      gap: 12px;
      font-size: 9px;
      color: #94A3B8;
    }
    .footer p { margin: 0; }
    @media print {
      body { background: white; padding: 0; margin: 0; }
      .recharge-container { border-radius: 0; box-shadow: none; height: 100%; width: 100%; }
    }
  </style>
</head>
<body>
<div class="recharge-container">
  <div class="header">
    <div class="header-left">
      <div class="logo-wrapper">
        ${st.logo_url ? `<img src="${st.logo_url}" alt="Logo"/>` : `<span class="placeholder">✈️</span>`}
      </div>
      <div class="company-info">
        <h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
        <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
        <p>${st.address_ar || ''} ${st.phone ? '📞 ' + st.phone : ''}</p>
      </div>
    </div>
    <div class="header-right">
      <div class="doc-title">RECHARGE VOUCHER</div>
      <div class="meta">No: <span>${no}</span></div>
      <div class="meta">Date: <span>${date}</span></div>
    </div>
  </div>
  <div class="company-bar">
    <div class="item"><div class="label">VAT No</div><div class="value">${st.vat_no || 'N/A'}</div></div>
    <div class="item"><div class="label">CR No</div><div class="value">${st.cr_no || 'N/A'}</div></div>
    <div class="item"><div class="label">License</div><div class="value">${st.license_no || 'N/A'}</div></div>
    <div class="item"><div class="label">Tourism Lic.</div><div class="value">${st.tourism_license_no || 'N/A'}</div></div>
  </div>
  <div class="body">
    <div class="info-box">
      <div class="section-title">DETAILS / التفاصيل</div>
      <div class="info-row"><span class="label">Portal</span><span class="value">${portalName}</span></div>
      <div class="info-row"><span class="label">Source</span><span class="value">${source}</span></div>
      <div class="info-row"><span class="label">Reference</span><span class="value">${reference}</span></div>
      <div class="info-row"><span class="label">Notes</span><span class="value">${notes}</span></div>
    </div>
    <div class="total-box">
      <span>AMOUNT / المبلغ</span>
      <span class="amount">${amount.toFixed(2)} SAR</span>
    </div>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} ${st.company_name_en || 'SUEUD AL TAAYIRA'}</p>
    <p style="font-size:8px;color:#94A3B8">Computer-generated - Valid without signature</p>
  </div>
</div>
</body>
</html>`;
};
