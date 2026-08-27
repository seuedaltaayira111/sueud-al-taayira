'use client';

/* ================================================================
   INVOICE HTML GENERATORS - COMPLETE REDESIGN
   All invoices: Sales, Refund, Expense, Salary, Contract, Mistake
   Bilingual: English + Arabic
   Beautiful gradients, fonts, and modern design
   ================================================================ */

/**
 * Get Airline Check-in URL
 */
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
  };
  for (const [key, url] of Object.entries(urls)) {
    if (a.includes(key)) return url;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(airline + ' online check in pnr ' + pnr)}`;
};

/**
 * AI Footer Messages - Bilingual
 */
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

/* ================================================================
   SALES INVOICE HTML - COMPLETE REDESIGN
   ================================================================ */
export const getInvoiceHTML = (inv, s, lang = 'en') => {
  const st = s || {};
  const no = inv.invoice_no || 'N/A';
  const checkInURL = getAirlineCheckInURL(inv.airline, inv.pnr);
  const invoicePageURL = `https://sueud-al-taayira.vercel.app/invoice/${no}`;
  const barcodeData = checkInURL || `https://www.google.com/search?q=${encodeURIComponent((inv.airline || '') + ' check in ' + (inv.pnr || ''))}`;
  const barcode = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}&scale=2&height=35&barcolor=1E3A8A&backgroundcolor=ffffff&includetext=false`;
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
  const fontFamily = isRTL ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Poppins', sans-serif";

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
    
    body {
      font-family: ${fontFamily};
      background: #F8FAFC;
      color: #1E293B;
      font-size: 9px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .invoice-container {
      width: 210mm;
      min-height: 297mm;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    
    /* Premium Top Border */
    .invoice-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #1E3A8A, #3B82F6, #F59E0B, #3B82F6, #1E3A8A);
      background-size: 200% 100%;
      animation: shimmerBorder 3s ease-in-out infinite;
    }
    
    @keyframes shimmerBorder {
      0%, 100% { background-position: 0% 0%; }
      50% { background-position: 100% 0%; }
    }
    
    /* Premium Bottom Border */
    .invoice-container::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #F59E0B, #3B82F6, #1E3A8A);
    }
    
    /* ===== HEADER ===== */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      padding: 20px 24px;
      background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%);
      color: #FFFFFF;
      gap: 20px;
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '✈️';
      position: absolute;
      right: -20px;
      bottom: -20px;
      font-size: 120px;
      opacity: 0.05;
      transform: rotate(-15deg);
    }
    
    .company-block {
      display: flex;
      gap: 16px;
      flex: 1;
      align-items: center;
      z-index: 1;
    }
    
    .logo-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.08);
      border: 2px solid rgba(251, 191, 36, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
      backdrop-filter: blur(10px);
    }
    
    .logo-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .logo-wrapper .logo-placeholder {
      font-size: 32px;
    }
    
    .company-text h2 {
      font-size: 16px;
      font-weight: 900;
      color: #FBBF24;
      margin: 0;
      letter-spacing: 0.5px;
    }
    
    .company-text h1 {
      font-size: 10px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 2px 0 4px;
    }
    
    .company-text p {
      font-size: 8px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.6;
      margin: 0;
    }
    
    .invoice-meta {
      min-width: 200px;
      background: rgba(255, 255, 255, 0.06);
      padding: 14px 18px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px);
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .invoice-meta h3 {
      font-size: 20px;
      font-weight: 900;
      color: #FBBF24;
      text-transform: uppercase;
      line-height: 1.1;
      margin: 0;
    }
    
    .invoice-meta h3 span {
      font-size: 10px;
      font-weight: 600;
      opacity: 0.7;
      display: block;
      margin-top: 2px;
    }
    
    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 3px 0;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
    }
    
    .meta-row:last-child {
      border-bottom: none;
    }
    
    .meta-row .label {
      color: rgba(255, 255, 255, 0.6);
    }
    
    .meta-row .value {
      color: #FBBF24;
      font-weight: 700;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 9px;
      font-weight: 700;
      margin-top: 6px;
      align-self: flex-start;
      ${st2 === 'Unpaid' 
        ? 'background: rgba(251, 191, 36, 0.15); color: #FBBF24; border: 1px solid rgba(251, 191, 36, 0.2);' 
        : 'background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.2);'}
    }
    
    /* ===== COMPANY DETAILS BAR ===== */
    .company-details {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 8px 24px;
      background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
      border-bottom: 1px solid #E2E8F0;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    
    .detail-item .label {
      font-size: 7px;
      color: #64748B;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .detail-item .value {
      font-size: 9px;
      color: #0F172A;
      font-weight: 700;
    }
    
    /* ===== BODY ===== */
    .body {
      padding: 16px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .section-title {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #1E3A8A;
      margin-bottom: 6px;
      padding-bottom: 4px;
      border-bottom: 2px solid #1E3A8A;
      display: flex;
      justify-content: space-between;
    }
    
    .section-title .ar {
      font-family: 'Cairo', sans-serif;
      color: #64748B;
      font-weight: 600;
    }
    
    /* ===== INFO GRID ===== */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    .info-block {
      padding: 10px 14px;
      background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
      border-radius: 10px;
      border-left: 3px solid #1E3A8A;
    }
    
    .info-block.gold {
      border-left-color: #F59E0B;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 3px 0;
      border-bottom: 1px solid #E2E8F0;
    }
    
    .info-row:last-child {
      border-bottom: none;
    }
    
    .info-row .label {
      color: #64748B;
    }
    
    .info-row .value {
      color: #0F172A;
      font-weight: 600;
      text-align: ${isRTL ? 'left' : 'right'};
      max-width: 65%;
      word-break: break-word;
    }
    
    .info-row .value.highlight {
      color: #2563EB;
    }
    
    /* ===== REISSUE BLOCK ===== */
    .reissue-block {
      padding: 12px 16px;
      background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
      border-radius: 10px;
      border: 1px solid #FDE68A;
    }
    
    .reissue-title {
      font-size: 10px;
      font-weight: 700;
      color: #D97706;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      background: rgba(251, 191, 36, 0.1);
      padding: 6px 10px;
      border-radius: 6px;
    }
    
    .reissue-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
    
    .reissue-item {
      background: #FFFFFF;
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #FDE68A;
    }
    
    .reissue-item .label {
      font-size: 7px;
      color: #92400E;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .reissue-item .value {
      font-size: 9px;
      color: #78350F;
      font-weight: 700;
      margin-top: 2px;
    }
    
    .reissue-fare {
      background: #D1FAE5;
      border-color: #6EE7B7;
      grid-column: span 3;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
    }
    
    .reissue-fare .label {
      color: #059669;
      font-size: 9px;
    }
    
    .reissue-fare .value {
      color: #047857;
      font-size: 13px;
      font-weight: 800;
    }
    
    /* ===== TABLE ===== */
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    
    .invoice-table thead th {
      padding: 8px 12px;
      background: linear-gradient(135deg, #0F172A, #1E3A8A);
      color: #FBBF24;
      font-size: 8px;
      text-transform: uppercase;
      text-align: ${isRTL ? 'right' : 'left'};
      letter-spacing: 0.5px;
      font-weight: 700;
    }
    
    .invoice-table thead th span {
      font-family: 'Cairo', sans-serif;
      font-size: 8px;
      opacity: 0.7;
      display: block;
      font-weight: 400;
    }
    
    .invoice-table thead th.right {
      text-align: ${isRTL ? 'left' : 'right'};
    }
    
    .invoice-table thead th.center {
      text-align: center;
    }
    
    .invoice-table tbody td {
      padding: 8px 12px;
      border-bottom: 1px solid #F1F5F9;
      font-size: 9px;
      background: #FFFFFF;
    }
    
    .invoice-table tbody tr:last-child td {
      border-bottom: none;
    }
    
    .invoice-table tbody td.right {
      text-align: ${isRTL ? 'left' : 'right'};
      font-weight: 600;
    }
    
    .invoice-table tbody td.center {
      text-align: center;
    }
    
    .invoice-table .discount-row {
      background: #F0FDF4;
    }
    
    .invoice-table .discount-row td {
      color: #059669;
    }
    
    /* ===== BOTTOM SECTION ===== */
    .bottom-section {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 12px;
    }
    
    .payment-breakdown {
      padding: 12px 16px;
      background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
      border-radius: 10px;
      border: 1px solid #E2E8F0;
    }
    
    .pay-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      padding: 4px 0;
      border-bottom: 1px dashed #CBD5E1;
    }
    
    .pay-row:last-child {
      border-bottom: none;
    }
    
    .pay-row .label {
      color: #64748B;
    }
    
    .pay-row .value {
      font-weight: 600;
    }
    
    .pay-row .value.green {
      color: #059669;
    }
    
    .pay-row .value.red {
      color: #EF4444;
    }
    
    .pay-row .value.purple {
      color: #7C3AED;
    }
    
    /* ===== TOTALS BOX ===== */
    .totals-box {
      background: linear-gradient(135deg, #0F172A, #1E3A8A);
      border-radius: 10px;
      padding: 14px 18px;
      color: #FFFFFF;
      align-self: flex-start;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size:
