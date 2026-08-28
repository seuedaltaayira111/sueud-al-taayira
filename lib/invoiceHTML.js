'use client';

/* ================================================================
   COMPLETE INVOICE HTML - FIXED
   - Sales Invoice with Store Credit Display
   - Previous Booking + Refund on same page
   - Full page fill
   - Beautiful design
   ================================================================ */

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
   SALES INVOICE WITH PREVIOUS BOOKING + REFUND + STORE CREDIT
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
  const storeCredit = inv.customers?.store_credit || 0;

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
    
    .invoice-container::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #F59E0B, #3B82F6, #1E3A8A);
    }
    
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
    
    .body {
      padding: 16px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    /* ===== STORE CREDIT DISPLAY ===== */
    .store-credit-box {
      background: linear-gradient(135deg, #ECFDF5, #D1FAE5);
      border: 1px solid #6EE7B7;
      border-radius: 8px;
      padding: 8px 14px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .store-credit-box .label {
      color: #065F46;
      font-weight: 600;
      font-size: 9px;
    }
    
    .store-credit-box .value {
      color: #047857;
      font-weight: 800;
      font-size: 12px;
    }
    
    /* ===== PREVIOUS BOOKING + REFUND SECTION ===== */
    .linked-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px dashed #CBD5E1;
    }
    
    .linked-section .title {
      text-align: center;
      color: #7F1D1D;
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 15px;
    }
    
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
    
    /* ===== REFUND DETAILS ===== */
    .refund-details {
      margin-top: 15px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #FEF2F2, #FEE2E2);
      border-radius: 10px;
      border: 1px solid #FECACA;
    }
    
    .refund-details .refund-title {
      font-size: 10px;
      font-weight: 700;
      color: #DC2626;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }
    
    .refund-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }
    
    .refund-grid .item {
      text-align: center;
    }
    
    .refund-grid .item .label {
      color: #991B1B;
      font-size: 8px;
    }
    
    .refund-grid .item .value {
      font-weight: 700;
      color: #DC2626;
      font-size: 11px;
    }
    
    /* ===== REST OF THE STYLES ===== */
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
      font-size: 9px;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .grand-total {
      display: flex;
      justify-content: space-between;
      padding: 8px 0 0;
      margin-top: 4px;
      border-top: 2px solid rgba(255, 255, 255, 0.1);
      font-size: 14px;
      font-weight: 800;
      color: #FFFFFF;
    }
    
    .grand-total .value {
      color: #FBBF24;
    }
    
    .footer {
      padding: 12px 24px;
      background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    
    .code-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .code-section img {
      height: 30px;
      width: auto;
      border-radius: 4px;
      border: 1px solid #E2E8F0;
      padding: 2px 6px;
      background: #FFFFFF;
    }
    
    .code-label {
      font-size: 6px;
      font-weight: 700;
      text-transform: uppercase;
      text-align: center;
      color: #475569;
      line-height: 1.2;
    }
    
    .code-label span {
      display: block;
      font-family: 'Cairo', sans-serif;
      font-size: 6px;
      color: #1E3A8A;
    }
    
    .ai-message {
      flex: 1;
      text-align: center;
      padding: 6px 14px;
      background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
      border-radius: 8px;
      border: 1px solid #93C5FD;
    }
    
    .ai-message .ai-label {
      font-size: 6px;
      color: #3B82F6;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    
    .ai-message p {
      font-size: 8px;
      color: #1E3A8A;
      margin: 0;
      line-height: 1.4;
      font-weight: 500;
    }
    
    .ai-message p span {
      display: block;
      font-family: 'Cairo', sans-serif;
      font-size: 8px;
      margin-top: 2px;
    }
    
    .footer-info {
      text-align: center;
      min-width: 80px;
    }
    
    .footer-info p {
      font-size: 6px;
      color: #94A3B8;
      margin: 1px 0;
    }
    
    .footer-info .name {
      font-weight: 700;
      color: #0F172A;
      font-size: 7px;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
        margin: 0;
      }
      .invoice-container {
        border-radius: 0;
        box-shadow: none;
        width: 100%;
        min-height: 100vh;
      }
    }
  </style>
</head>
<body>
<div class="invoice-container">
  <!-- ===== PAGE 1: MAIN INVOICE ===== -->
  <div class="header">
    <div class="company-block">
      ${st.logo_url 
        ? `<div class="logo-wrapper"><img src="${st.logo_url}" crossorigin="anonymous" alt="Logo"/></div>` 
        : `<div class="logo-wrapper"><span class="logo-placeholder">✈️</span></div>`}
      <div class="company-text">
        <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
        <h1>${st.company_name_en || 'SUEUD AL TAAYIRA TRAVEL & TOURISM'}</h1>
        <p>${st.address_ar || ''} ${st.phone ? '| ' + st.phone : ''} ${st.website ? '| ' + st.website : ''}</p>
      </div>
    </div>
    <div class="invoice-meta">
      <h3>TAX INVOICE<span>فاتورة ضريبية</span></h3>
      <div class="meta-row"><span class="label">Inv No / رقم</span><span class="value">${no}</span></div>
      <div class="meta-row"><span class="label">Date / التاريخ</span><span class="value">${inv.invoice_date || ''}</span></div>
      <div class="meta-row"><span class="label">Booking / الحجز</span><span class="value">${inv.booking_date || ''}</span></div>
      <div class="status-badge">${st2 === 'Unpaid' ? 'UNPAID / غير مدفوعة' : 'PAID / مدفوعة'}</div>
    </div>
  </div>
  
  <div class="company-details">
    <div class="detail-item"><span class="label">VAT No / رقم ضريبي</span><span class="value">${st.vat_no || 'N/A'}</span></div>
    <div class="detail-item"><span class="label">CR No / رقم سجل</span><span class="value">${st.cr_no || 'N/A'}</span></div>
    <div class="detail-item"><span class="label">License / ترخيص</span><span class="value">${st.license_no || 'N/A'}</span></div>
    <div class="detail-item"><span class="label">Tourism Lic.</span><span class="value">${st.tourism_license_no || 'N/A'}</span></div>
  </div>
  
  <div class="body">
    <!-- ===== STORE CREDIT DISPLAY ===== -->
    ${storeCredit > 0 ? `
    <div class="store-credit-box">
      <span class="label">💰 ${isAr ? 'الرصيد المتاح' : 'Available Store Credit'}</span>
      <span class="value">${storeCredit.toFixed(2)} SAR</span>
    </div>` : ''}
    
    <div class="info-grid">
      <div class="info-block">
        <div class="section-title">BILL TO / فاتورة إلى</div>
        <div class="info-row"><span class="label">Name / الاسم</span><span class="value">${inv.customers?.name || inv.corporates?.name || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Phone / الهاتف</span><span class="value">${inv.customers?.phone || 'N/A'}</span></div>
        ${inv.corporates?.vat_no ? `<div class="info-row"><span class="label">VAT / ضريبي</span><span class="value">${inv.corporates.vat_no}</span></div>` : ''}
        <div class="info-row"><span class="label">Sales Person / موظف</span><span class="value">${inv.employees?.name || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Passengers / الركاب</span><span class="value" style="font-size:7px;line-height:1.4">${pax}</span></div>
      </div>
      <div class="info-block gold">
        <div class="section-title">FLIGHT DETAILS / تفاصيل الرحلة</div>
        <div class="info-row"><span class="label">Airline / الخطوط</span><span class="value">${inv.airline || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Sector / القطاع</span><span class="value">${inv.flight_sector || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Type / النوع</span><span class="value">${inv.flight_type || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Journey / الرحلة</span><span class="value">${inv.flight_journey || 'N/A'}</span></div>
        <div class="info-row"><span class="label">PNR / رقم الحجز</span><span class="value highlight">${inv.pnr || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Ticket No / التذكرة</span><span class="value">${inv.ticket_no || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Refundable / قابلة للاسترجاع</span><span class="value">${inv.refundable_status || 'N/A'}</span></div>
        <div class="info-row"><span class="label">Service / الخدمة</span><span class="value">${inv.service_type || 'N/A'}</span></div>
      </div>
    </div>
    
    <table class="invoice-table">
      <thead>
        <tr>
          <th>Description<span>الوصف</span></th>
          <th class="center">Qty<span>الكمية</span></th>
          <th class="right">Unit Price<span>سعر الوحدة</span></th>
          <th class="right">Total<span>الإجمالي</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${inv.sector || inv.service_type || 'Service'}</td>
          <td class="center">${inv.qty || 1}</td>
          <td class="right">${up.toFixed(2)}</td>
          <td class="right">${ts.toFixed(2)}</td>
        </tr>
        ${disc > 0 ? `<tr class="discount-row"><td colspan="3" style="text-align:${isRTL ? 'left' : 'right'};color:#059669">Discount / خصم</td><td class="right" style="color:#059669">- ${disc.toFixed(2)}</td></tr>` : ''}
      </tbody>
    </table>
    
    <div class="bottom-section">
      <div class="payment-breakdown">
        <div class="section-title">PAYMENT BREAKDOWN / تفصيل الدفع</div>
        <div class="pay-row"><span class="label">Subtotal / المجموع الفرعي</span><span class="value">${sub.toFixed(2)} SAR</span></div>
        ${disc > 0 ? `<div class="pay-row" style="color:#059669"><span class="label">Discount / خصم</span><span class="value">- ${disc.toFixed(2)} SAR</span></div>` : ''}
        <div class="pay-row"><span class="label">VAT (${vr}%) / ضريبة</span><span class="value">${vat.toFixed(2)} SAR</span></div>
        ${uc > 0 ? `<div class="pay-row" style="color:#7C3AED"><span class="label">Credit Used / رصيد مستخدم</span><span class="value">- ${uc.toFixed(2)} SAR</span></div>` : ''}
        ${cr > 0 ? `<div class="pay-row" style="color:#EF4444"><span class="label">Cash Returned / مردود</span><span class="value">- ${cr.toFixed(2)} SAR</span></div>` : ''}
        <div class="pay-row" style="border-top:1.5px solid #CBD5E1;margin-top:4px;padding-top:4px;font-weight:700">
          <span class="label">Paid (${pd}) / مدفوع</span>
          <span class="value green">${cp.toFixed(2)} SAR</span>
        </div>
        <div class="pay-row" style="font-weight:700;font-size:10px">
          <span class="label">Due / المتبقي</span>
          <span class="value ${due > 0 ? 'red' : 'green'}">${due.toFixed(2)} SAR</span>
        </div>
      </div>
      
      <div class="totals-box">
        <div class="total-row"><span>Subtotal / المجموع الفرعي</span><span>${sub.toFixed(2)}</span></div>
        ${disc > 0 ? `<div class="total-row" style="color:#34D399"><span>Discount / خصم</span><span>- ${disc.toFixed(2)}</span></div>` : ''}
        <div class="total-row"><span>VAT (${vr}%) / ضريبة</span><span>${vat.toFixed(2)}</span></div>
        <div class="grand-total"><span>GRAND TOTAL</span><span class="value">${tot.toFixed(2)} SAR</span></div>
      </div>
    </div>
  </div>
  
  <div class="footer">
    <div class="code-section">
      <img src="${barcode}" alt="Barcode" crossorigin="anonymous"/>
      <div class="code-label">CHECK-IN<span>تسجيل</span></div>
      <img src="${qr}" alt="QR" crossorigin="anonymous" style="height:36px;width:36px;padding:2px;"/>
      <div class="code-label">INVOICE<span>فاتورة</span></div>
    </div>
    <div class="ai-message">
      <div class="ai-label">🤖 AI</div>
      <p>${aiMsg}<span>${lang === 'ar' ? '✈️ رحلة سعيدة!' : 'Safe flight!'}</span></p>
    </div>
    <div class="footer-info">
      <p class="name">${st.company_name_en || 'SUEUD AL TAAYIRA'}</p>
      <p>${st.phone || ''}</p>
      <p style="font-family:'Cairo'">${st.company_name_ar || ''}</p>
      <p style="color:#CBD5E1;margin-top:2px">${st.vat_no ? 'VAT: ' + st.vat_no : ''}</p>
    </div>
  </div>

  <!-- ===== PAGE 2: PREVIOUS BOOKING + REFUND (if exists) ===== -->
  ${isRe && inv.linked_inv_id ? `
  <div class="linked-section">
    <div class="title">🔄 ${isAr ? 'الحجز السابق والاسترجاع المرتبط' : 'Previous Booking & Linked Refund'}</div>
    
    <!-- PREVIOUS BOOKING -->
    <div class="reissue-block">
      <div class="reissue-title"><span>⚠️ PREVIOUS BOOKING / الحجز السابق</span><span>تفاصيل</span></div>
      <div class="reissue-grid">
        <div class="reissue-item"><div class="label">Old Date</div><div class="value">${inv.old_booking_date || 'N/A'}</div></div>
        <div class="reissue-item"><div class="label">Old Airline</div><div class="value">${inv.old_airline || 'N/A'}</div></div>
        <div class="reissue-item"><div class="label">Old Sector</div><div class="value">${inv.old_sector || 'N/A'}</div></div>
        <div class="reissue-item"><div class="label">Old PNR</div><div class="value">${inv.old_pnr || 'N/A'}</div></div>
        <div class="reissue-item"><div class="label">Old Ticket</div><div class="value">${inv.old_ticket_no || 'N/A'}</div></div>
        <div class="reissue-item"><div class="label">Old Type</div><div class="value">${inv.old_flight_type || 'N/A'}</div></div>
        <div class="reissue-fare"><div class="label">Original Fare / الأجرة الأصلية</div><div class="value">${parseFloat(inv.old_sell_price || 0).toFixed(2)} SAR</div></div>
      </div>
    </div>
    
    <!-- REFUND DETAILS -->
    <div class="refund-details">
      <div class="refund-title">
        <span>🔄 REFUND DETAILS / تفاصيل الاسترجاع</span>
        <span>REF-${inv.linked_inv_id || 'N/A'}</span>
      </div>
      <div class="refund-grid">
        <div class="item">
          <div class="label">${isAr ? 'المبلغ المسترد' : 'Refund Amount'}</div>
          <div class="value">${(inv.refund_customer || 0).toFixed(2)} SAR</div>
        </div>
        <div class="item">
          <div class="label">${isAr ? 'تاريخ الاسترجاع' : 'Refund Date'}</div>
          <div class="value">${inv.refund_date || inv.invoice_date || 'N/A'}</div>
        </div>
        <div class="item">
          <div class="label">${isAr ? 'السبب' : 'Reason'}</div>
          <div class="value">${inv.refund_reason || 'N/A'}</div>
        </div>
      </div>
    </div>
  </div>` : ''}
  
</div>
</body>
</html>`;
};
