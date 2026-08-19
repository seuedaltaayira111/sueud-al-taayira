'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ==========================================
// PREMIUM ONE-PAGE BILINGUAL INVOICE TEMPLATE (A4 FULL PAGE FIX)
// ==========================================
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;
  
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

  const L = (en, ar) => isAr ? ar : en;

  return `
  <!DOCTYPE html>
  <html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8">
    <title>${L('Invoice', 'فاتورة')} ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      html, body { margin: 0; padding: 0; font-family: '${isAr ? 'Cairo' : 'Inter'}', sans-serif; background: #fff; color: #1e293b; }
      .page { width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; display: flex; flex-direction: column; }
      .header { display: flex; justify-content: space-between; align-items: stretch; padding: 18px 22px; background: linear-gradient(135deg, #0c1d3a 0%, #1a365d 100%); color: #fff; gap: 18px; flex-shrink: 0; }
      .company-block { display: flex; gap: 14px; flex: 1; }
      .logo-box { width: 65px; height: 65px; object-fit: cover; border-radius: 8px; background: rgba(255,255,255,0.1); padding: 2px; flex-shrink: 0; }
      .company-text h2 { font-size: 17px; font-weight: 800; color: #fbbf24; margin: 0; }
      .company-text h1 { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 1px; margin: 2px 0 0; }
      .company-text p { font-size: 10px; color: rgba(255,255,255,0.7); line-height: 1.5; margin: 4px 0 0; }
      .invoice-meta { min-width: 200px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; justify-content: center; }
      .invoice-meta h3 { font-size: 22px; font-weight: 800; color: #fbbf24; text-transform: uppercase; line-height: 1.1; margin: 0; }
      .invoice-meta h3 span { font-size: 12px; font-family: 'Cairo'; display: block; margin-top: 1px; }
      .meta-row { display: flex; justify-content: space-between; margin-top: 3px; font-size: 11px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 1px; }
      .meta-row .lbl { color: rgba(255,255,255,0.6); }
      .meta-row .val { color: #fbbf24; font-weight: 700; }
      .status-badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; margin-top: 6px; align-self: flex-start; ${invStatus === 'Unpaid' ? 'background: rgba(251,191,36,0.2); color: #fbbf24;' : 'background: rgba(52,211,153,0.2); color: #34d399;'} }
      .body { padding: 16px 22px; flex: 1; display: flex; flex-direction: column; }
      .bilingual-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px; border-bottom: 2px solid #e2e8f0; padding-bottom: 3px; display: flex; justify-content: space-between; }
      .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
      .info-block { padding: 10px; background: #f8fafc; border-radius: 6px; border-left: 3px solid #1a365d; }
      .info-row { display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0; border-bottom: 1px solid #f1f5f9; }
      .info-row:last-child { border: none; }
      .info-row .label { color: #64748b; }
      .info-row .value { color: #0f172a; font-weight: 600; text-align: ${isAr ? 'left' : 'right'}; max-width: 160px; }
      .reissue-block { padding: 10px; background: #fffbeb; border-radius: 6px; border: 1px solid #fde68a; margin-bottom: 12px; }
      .reissue-title { font-size: 12px; font-weight: 700; color: #d97706; margin-bottom: 6px; display: flex; justify-content: space-between; background: #fef3c7; padding: 5px 8px; border-radius: 5px; }
      .reissue-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
      .reissue-item { background: #fff; padding: 6px; border-radius: 5px; border: 1px solid #fde68a; }
      .reissue-item .lbl { font-size: 9px; color: #92400e; font-weight: 600; text-transform: uppercase; }
      .reissue-item .val { font-size: 11px; color: #78350f; font-weight: 700; margin-top: 1px; }
      .reissue-fare { background: #dcfce7; border-color: #86efac; grid-column: span 3; display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; }
      .reissue-fare .lbl { color: #059669; font-size: 11px; }
      .reissue-fare .val { color: #047857; font-size: 13px; font-weight: 800; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 12px; border-radius: 6px; overflow: hidden; }
      thead th { padding: 7px; background: #0c1d3a; color: #fbbf24; font-size: 10px; text-transform: uppercase; text-align: ${isAr ? 'right' : 'left'}; }
      thead th.right { text-align: right; }
      thead th.center { text-align: center; }
      tbody td { padding: 7px; border-bottom: 1px solid #f1f5f9; font-size: 11px; background: #fff; }
      tbody td.right { text-align: right; font-weight: 600; }
      tbody td.center { text-align: center; }
      .bottom-section { display: grid; grid-template-columns: 1.5fr 1fr; gap: 12px; margin-top: auto; }
      .payment-breakdown { padding: 10px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 6px; border: 1px solid #e2e8f0; }
      .pay-row { display: flex; justify-content: space-between; font-size: 11px; padding: 3px 0; border-bottom: 1px dashed #cbd5e1; }
      .pay-row:last-child { border: none; }
      .totals-box { background: #0c1d3a; border-radius: 6px; padding: 10px; color: #fff; align-self: flex-start; }
      .total-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 11px; color: rgba(255,255,255,0.8); }
      .grand-total { display: flex; justify-content: space-between; padding: 6px 0 0; margin-top: 3px; border-top: 2px solid rgba(255,255,255,0.1); font-size: 15px; font-weight: 800; color: #fff; }
      .grand-total .val { color: #fbbf24; }
      .footer { padding: 10px 22px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; gap: 12px; margin-top: auto; }
      .qr-code img { height: 55px; width: 55px; border-radius: 5px; border: 1px solid #e2e8f0; padding: 1px; background: #fff; }
      .footer-text { text-align: center; flex: 1; }
      .ai-msg { font-size: 10px; color: #475569; font-weight: 600; margin-bottom: 1px; }
      .ai-msg-ar { font-size: 10px; color: #64748b; font-family: 'Cairo'; }
      .spacer { flex: 1; }
      @media print { html, body { width: 210mm; height: 297mm; } .page { width: 210mm; min-height: 297mm; margin: 0; box-shadow: none; border: none; } }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div class="company-block">
          ${setting.logo_url ? `<img src="${setting.logo_url}" crossorigin="anonymous" class="logo-box" />` : ''}
          <div class="company-text">
            <h2>${setting.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
            <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
            <p>${setting.address_ar || ''}<br/>${L('VAT', 'ضريبة')}: ${setting.vat_no || 'N/A'} | ${L('CR', 'سجل')}: ${setting.cr_no || 'N/A'}<br/>${L('Lic', 'ترخيص')}: ${setting.license_no || 'N/A'} | ${L('Phone', 'هاتف')}: ${setting.phone || 'N/A'}</p>
          </div>
        </div>
        <div class="invoice-meta">
          <h3>${L('TAX INVOICE', 'فاتورة ضريبية')}<span>${isAr ? 'فاتورة ضريبية' : 'TAX INVOICE'}</span></h3>
          <div class="meta-row"><span class="lbl">${L('Inv No', 'رقم الفاتورة')}</span><span class="val">${invoiceNo}</span></div>
          <div class="meta-row"><span class="lbl">${L('Date', 'التاريخ')}</span><span class="val">${inv.invoice_date || ''}</span></div>
          <div class="status-badge">${invStatus === 'Unpaid' ? L('UNPAID', 'غير مدفوعة') : L('PAID', 'مدفوعة')}</div>
        </div>
      </div>
      <div class="body">
        <div class="details-grid">
          <div class="info-block">
            <div class="bilingual-title"><span>${L('BILL TO', 'فاتورة إلى')}</span></div>
            <div class="info-row"><span class="label">${L('Name', 'الاسم')}</span><span class="value">${inv.customers?.name || inv.corporates?.name || 'N/A'}</span></div>
            <div class="info-row"><span class="label">${L('Phone', 'الهاتف')}</span><span class="value">${inv.customers?.phone || 'N/A'}</span></div>
            <div class="info-row"><span class="label">${L('Sales Person', 'موظف المبيعات')}</span><span class="value">${inv.employees?.name || 'N/A'}</span></div>
            <div class="info-row"><span class="label">${L('Passengers', 'الركاب')}</span><span class="value">${passengersList}</span></div>
          </div>
          <div class="info-block" style="border-left-color: #f59e0b;">
            <div class="bilingual-title"><span>${L('FLIGHT DETAILS', 'تفاصيل الرحلة')}</span></div>
            <div class="info-row"><span class="label">${L('Airline', 'خط الطيران')}</span><span class="value">${inv.airline || 'N/A'}</span></div>
            <div class="info-row"><span class="label">${L('Sector', 'القطاع')}</span><span class="value">${inv.flight_sector || 'N/A'}</span></div>
            <div class="info-row"><span class="label">${L('Flight Type', 'نوع الرحلة')}</span><span class="value">${inv.flight_type || 'N/A'}</span></div>
            <div class="info-row"><span class="label">${L('PNR', 'رقم الحجز')}</span><span class="value">${inv.pnr || 'N/A'}</span></div>
            <div class="info-row"><span class="label">${L('Ticket No', 'رقم التذكرة')}</span><span class="value">${inv.ticket_no || 'N/A'}</span></div>
          </div>
        </div>
        ${isReissue ? `
        <div class="reissue-block">
          <div class="reissue-title"><span>⚠️ ${L('PREVIOUS BOOKING DETAILS', 'تفاصيل الحجز السابق')}</span></div>
          <div class="reissue-grid">
            <div class="reissue-item"><div class="lbl">${L('Old Date', 'تاريخ القديم')}</div><div class="val">${inv.old_booking_date || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">${L('Old Airline', 'الخطوط القديمة')}</div><div class="val">${inv.old_airline || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">${L('Old Sector', 'القطاع القديم')}</div><div class="val">${inv.old_sector || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">${L('Old PNR', 'رقم الحجز القديم')}</div><div class="val">${inv.old_pnr || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">${L('Old Ticket', 'التذكرة القديمة')}</div><div class="val">${inv.old_ticket_no || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">${L('Old Type', 'النوع القديم')}</div><div class="val">${inv.old_flight_type || 'N/A'}</div></div>
            <div class="reissue-item reissue-fare"><div class="lbl">${L('Original Fare', 'أجرة التذكرة الأصلية')}</div><div class="val">${parseFloat(inv.old_sell_price || 0).toFixed(2)} SAR</div></div>
          </div>
        </div>` : ''}
        <table>
          <thead><tr><th>${L('Description', 'الوصف')}</th><th class="center">${L('Qty', 'الكمية')}</th><th class="right">${L('Unit Price', 'سعر الوحدة')}</th><th class="right">${L('Total', 'الإجمالي')}</th></tr></thead>
          <tbody><tr><td>${inv.sector || inv.service_type || L('Service', 'خدمة')}</td><td class="center">${inv.qty || 1}</td><td class="right">${unitPrice.toFixed(2)}</td><td class="right">${totalSell.toFixed(2)}</td></tr></tbody>
        </table>
        <div class="bottom-section">
          <div class="payment-breakdown">
            <div class="bilingual-title"><span>${L('PAYMENT BREAKDOWN', 'تفاصيل الدفع')}</span></div>
            <div class="pay-row"><span>${L('New Booking Price', 'سعر الحجز الجديد')}</span><span style="font-weight:600;">${total.toFixed(2)} SAR</span></div>
            ${usedCredit > 0 ? `<div class="pay-row" style="color:#7c3aed;"><span>${L('Less: Refund Credit', 'خصم الرصيد')}</span><span style="font-weight:600;">- ${usedCredit.toFixed(2)} SAR</span></div>` : ''}
            ${cashReturn > 0 ? `<div class="pay-row" style="color:#ef4444;"><span>${L('Cash Returned', 'مبلغ مرتجع')}</span><span style="font-weight:600;">- ${cashReturn.toFixed(2)} SAR</span></div>` : ''}
            <div class="pay-row" style="border-top:2px solid #cbd5e1; margin-top:3px; padding-top:3px; font-weight:700;"><span>${L('Balance Paid', 'المدفوع')} (${paymentDisplay})</span><span style="color:#059669;">${cashPaid.toFixed(2)} SAR</span></div>
            <div class="pay-row" style="font-weight:700;"><span>${L('Amount Due', 'المتبقي')}</span><span style="color:${dueAmount > 0 ? '#ef4444' : '#059669'};">${dueAmount.toFixed(2)} SAR</span></div>
          </div>
          <div class="totals-box">
            <div class="total-row"><span>${L('Subtotal', 'المجموع الفرعي')}</span><span>${subTotal.toFixed(2)}</span></div>
            ${discount > 0 ? `<div class="total-row" style="color:#34d399;"><span>${L('Discount', 'الخصم')}</span><span>- ${discount.toFixed(2)}</span></div>` : ''}
            <div class="total-row"><span>${L('VAT', 'الضريبة')} (${vatRate}%)</span><span>${vat.toFixed(2)}</span></div>
            <div class="grand-total"><span>${L('GRAND TOTAL', 'الإجمالي الكلي')}</span><span class="val">${total.toFixed(2)} SAR</span></div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="qr-code"><img src="${qrCodeUrl}" alt="QR" crossorigin="anonymous" /><p style="font-size:8px;text-align:center;color:#94A3B8;margin-top:2px;">${L('Scan', 'امسح')}</p></div>
        <div class="footer-text"><p class="ai-msg">${isAr ? 'شكراً لاختياركم إيانا. رحلة سعيدة!' : 'Thank you for choosing us! Have a safe flight.'}</p></div>
        <div style="width:55px;"></div>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// REFUND INVOICE TEMPLATE (A4 FULL PAGE FIX)
// ==========================================
const getRefundHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const invoiceNo = inv.invoice_no || 'N/A';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app')}`;
  const L = (en, ar) => isAr ? ar : en;
  const originalFare = inv.old_sell_price || inv.total_sell || 0;
  const customerRefund = inv.refund_customer || 0;
  const airlineRefund = inv.refund_company || 0;
  const custName = inv.customers?.name || inv.old_customer_name || 'N/A';
  const custPhone = inv.customers?.phone || inv.old_customer_phone || 'N/A';
  const passengersList = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : (inv.old_passengers || 'N/A');
  let refundMethodDisplay = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit') refundMethodDisplay = isAr ? 'رصيد لحجز جديد' : 'Credit for New Booking';

  return `
  <!DOCTYPE html><html lang="${isAr?'ar':'en'}" dir="${isAr?'rtl':'ltr'}"><head><meta charset="UTF-8"><title>${L('Refund','استرجاع')} ${invoiceNo}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
    html,body{margin:0;padding:0;font-family:'${isAr?'Cairo':'Inter'}',sans-serif;background:#fff;color:#1e293b}
    .page{width:210mm;min-height:297mm;margin:0 auto;background:#fff;display:flex;flex-direction:column}
    .header{display:flex;justify-content:space-between;align-items:stretch;padding:18px 22px;background:linear-gradient(135deg,#7f1d1d,#991b1b);color:#fff;gap:18px;flex-shrink:0}
    .company-block{display:flex;gap:14px;flex:1}.logo-box{width:65px;height:65px;object-fit:cover;border-radius:8px;background:rgba(255,255,255,0.1);padding:2px;flex-shrink:0}
    .company-text h2{font-size:17px;font-weight:800;color:#fbbf24;margin:0}.company-text h1{font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1px;margin:2px 0 0}.company-text p{font-size:10px;color:rgba(255,255,255,0.6);line-height:1.5;margin:4px 0 0}
    .invoice-meta{min-width:200px;text-align:${isAr?'left':'right'};display:flex;flex-direction:column;justify-content:center}
    .invoice-meta h3{font-size:22px;font-weight:800;color:#fbbf24;text-transform:uppercase;line-height:1.1;margin:0}.invoice-meta h3 span{font-size:12px;font-family:'Cairo';display:block;margin-top:1px}
    .inv-no{font-size:11px;color:rgba(255,255,255,0.8);margin-top:4px;border-bottom:1px dashed rgba(255,255,255,0.2);padding-bottom:2px}.inv-no span{color:#fbbf24;font-weight:700}
    .status-badge{display:inline-block;padding:4px 10px;border-radius:12px;font-size:10px;font-weight:700;margin-top:6px;background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3);align-self:flex-end}
    .body{padding:16px 22px;flex:1;display:flex;flex-direction:column}
    .info-block{padding:10px;background:#fff5f5;border-radius:6px;border-left:3px solid #dc2626;margin-bottom:10px}
    .info-block h4{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#dc2626;margin-bottom:6px;font-weight:700}
    .row{display:flex;justify-content:space-between;font-size:11px;padding:2px 0;border-bottom:1px solid #fee2e2}.row:last-child{border:none}
    .row .label{color:#991b1b;font-weight:500}.row .value{color:#7f1d1d;font-weight:600;text-align:${isAr?'left':'right'}}
    .breakdown-block{background:#fff;padding:12px;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:10px}
    .breakdown-title{font-size:10px;text-transform:uppercase;color:#dc2626;margin-bottom:6px;border-bottom:1px solid #fee2e2e;padding-bottom:4px;font-weight:700}
    .calc-row{display:flex;justify-content:space-between;padding:3px 0;font-size:12px;color:#334155}.calc-row.deduct{color:#ef4444}
    .calc-row.total{padding-top:6px;margin-top:4px;border-top:1px solid #e2e8f0;font-size:15px;font-weight:800;color:#059669}
    .payment-info{padding:10px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center}
    .pay-row{font-size:11px;font-weight:600;color:#334155}.footer{padding:10px 22px;background:#f8fafc;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;gap:12px;margin-top:auto}
    .qr-code img{height:55px;width:55px;border-radius:5px;border:1px solid #e2e8f0;padding:1px;background:#fff}
    .spacer{flex:1}
    @media print{html,body{width:210mm;height:297mm}.page{width:210mm;min-height:297mm;margin:0;box-shadow:none;border:none}}
  </style></head><body>
  <div class="page">
    <div class="header">
      <div class="company-block">
        ${setting.logo_url?`<img src="${setting.logo_url}" crossorigin="anonymous" class="logo-box"/>`:''}
        <div class="company-text"><h2>${setting.company_name_ar||'صعود الطائرة'}</h2><h1>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h1><p>${setting.address_ar||''}<br/>${L('VAT','ضريبة')}: ${setting.vat_no||'N/A'} | ${L('CR','سجل')}: ${setting.cr_no||'N/A'}</p></div>
      </div>
      <div class="invoice-meta"><h3>${L('REFUND','استرجاع')}<span>${isAr?'استرجاع':'REFUND'}</span></h3><div class="inv-no">${L('Refund No','رقم الاسترجاع')}: <span>${invoiceNo}</span></div><div class="inv-no">${L('Date','التاريخ')}: <span>${inv.refund_date||inv.invoice_date||''}</span></div><div class="status-badge">${L('PROCESSED','تم الاسترجاع')}</div></div>
    </div>
    <div class="body">
      <div class="info-block">
        <h4>${L('BOOKING DETAILS','تفاصيل الحجز')}</h4>
        <div class="row"><span class="label">${L('Customer Name','اسم العميل')}</span><span class="value">${custName}</span></div>
        <div class="row"><span class="label">${L('Contact','الهاتف')}</span><span class="value">${custPhone}</span></div>
        <div class="row"><span class="label">${L('Passengers','الركاب')}</span><span class="value">${passengersList}</span></div>
        <div class="row"><span class="label">${L('Airline','خط الطيران')}</span><span class="value">${inv.airline||inv.old_airline||'N/A'}</span></div>
        <div class="row"><span class="label">${L('Date of Booking','تاريخ الحجز')}</span><span class="value">${inv.invoice_date||inv.old_booking_date||'N/A'}</span></div>
        <div class="row"><span class="label">${L('PNR','رقم الحجز')}</span><span class="value">${inv.pnr||inv.old_pnr||'N/A'}</span></div>
        <div class="row"><span class="label">${L('Reason','سبب الاسترجاع')}</span><span class="value">${inv.refund_reason||'N/A'}</span></div>
      </div>
      <div class="breakdown-block">
        <div class="breakdown-title">${L('REFUND CALCULATION','حساب الاسترجاع')}</div>
        <div class="calc-row"><span>${L('Original Fare','أجرة التذكرة الأصلية')}</span><span style="font-weight:600;">${originalFare.toFixed(2)} SAR</span></div>
        <div class="calc-row deduct"><span>${L('Airline Cancellation Fees','رسوم إلغاء الخطوط')}</span><span style="font-weight:600;">- ${(originalFare - airlineRefund).toFixed(2)} SAR</span></div>
        <div class="calc-row total"><span>${L('Refund Amount','المبلغ المسترجع')}</span><span>${customerRefund.toFixed(2)} SAR</span></div>
      </div>
      <div class="payment-info"><span class="pay-row">${L('Refund Method','طريقة الاسترجاع')}</span><span style="font-weight:600;color:#2563eb;">${refundMethodDisplay}</span></div>
    </div>
    <div class="footer"><div class="qr-code"><img src="${qrCodeUrl}" alt="QR" crossorigin="anonymous"/></div><div style="text-align:center;flex:1;"><strong>${setting.company_name_en||''}</strong><p style="font-size:9px;color:#94a3b8;">${L('Thank you!','شكراً!'}</p></div><div style="width:55px;"></div></div>
  </div>
  </body></html>`;
};

// ==========================================
// EXPENSE VOUCHER TEMPLATE (A4 FULL PAGE FIX)
// ==========================================
const getExpenseHTML = (exp, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const L = (en, ar) => isAr ? ar : en;
  const expNo = exp.invoice_no || `EXP-${exp.id?.substring(0,8) || 'N/A'}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app')}`;
  const items = exp.items && exp.items.length > 0 ? exp.items : [{ name: exp.item_name || 'Item', qty: 1, price: exp.amount || 0 }];
  const subTotal = items.reduce((sum, it) => sum + ((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)), 0);
  const vat = (exp.amount || 0) - subTotal;
  const vatRate = vat > 0 && subTotal > 0 ? Math.round((vat / subTotal) * 100) : 0;

  return `
  <!DOCTYPE html><html lang="${isAr?'ar':'en'}" dir="${isAr?'rtl':'ltr'}"><head><meta charset="UTF-8"><title>${L('Expense','مصروف')}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
    html,body{margin:0;padding:0;font-family:'${isAr?'Cairo':'Inter'}',sans-serif;background:#fff;color:#1e293b}
    .page{width:210mm;min-height:297mm;margin:0 auto;background:#fff;display:flex;flex-direction:column}
    .header{display:flex;justify-content:space-between;align-items:flex-start;padding:28px 32px;background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;flex-shrink:0}
    .company-info h2{font-size:20px;font-weight:800;color:#fbbf24;margin:0}.company-info h1{font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px;margin-top:3px}
    .invoice-meta{text-align:${isAr?'left':'right'};margin-${isAr?'left':'right'}:0}
    .invoice-meta h3{font-size:26px;font-weight:800;color:#fbbf24;text-transform:uppercase}
    .invoice-meta p{font-size:12px;color:rgba(255,255,255,0.8);margin-top:4px}.invoice-meta p span{color:#fbbf24;font-weight:700}
    .body{padding:28px 32px;flex:1;display:flex;flex-direction:column;gap:20px}
    .info-block{padding:14px;background:#fff7ed;border-radius:8px;border-left:3px solid #ea580c}
    .info-block h4{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#ea580c;margin-bottom:8px;font-weight:700}
    .info-block .row{display:flex;justify-content:space-between;font-size:12px;padding:3px 0}
    .info-block .row .label{color:#9a3412;font-weight:500}.info-block .row .value{color:#7c2d12;font-weight:600}
    table{width:100%;border-collapse:collapse;border-radius:6px;overflow:hidden}
    thead th{text-align:${isAr?'right':'left'};padding:10px;background:#7c2d12;color:#fbbf24;font-size:9px;text-transform:uppercase;letter-spacing:1px}
    thead th.right{text-align:right}tbody td{padding:10px;border-bottom:1px solid #f1f5f9;font-size:12px}
    tbody td.right{text-align:right;font-weight:600}
    .totals{text-align:${isAr?'left':'right'};margin-top:12px}
    .totals p{font-size:12px;margin:4px 0;color:#64748b}.totals h3{font-size:20px;color:#ea580c;font-weight:800;margin-top:8px}
    .footer{padding:20px 32px;background:#f8fafc;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;margin-top:auto}
    .footer-text{text-align:center;flex:1}.footer-text p{font-size:10px;color:#94a3b8}
    .qr-code img{height:70px;width:70px;border-radius:6px;border:1px solid #e2e8f0;padding:2px;background:#fff}
    .spacer{flex:1}
    @media print{html,body{width:210mm;height:297mm}.page{width:210mm;min-height:297mm;margin:0;box-shadow:none;border:none}
  </style></head><body>
  <div class="page">
    <div class="header">
      <div class="company-info"><h2>${setting.company_name_ar||'صعود الطائرة'}</h2><h1>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h1></div>
      <div class="invoice-meta"><h3>${L('EXPENSE VOUCHER','سند مصروف')}</h3><p>${L('No','رقم')}: <span>${expNo}</span></p><p>${L('Date','التاريخ')}: <span>${exp.expense_date||''}</span></p></div>
    </div>
    <div class="body">
      <div class="info-block">
        <h4>${L('VENDOR & EXPENSE DETAILS','بيانات المورد والمصروف')}</h4>
        <div class="row"><span class="label">${L('Vendor','المورد')}</span><span class="value">${exp.vendor_name||'N/A'}</span></div>
        ${exp.vendor_vat?`<div class="row"><span class="label">${L('Vendor VAT','الرقم الضريبي للمورد')}</span><span class="value">${exp.vendor_vat}</span></div>`:''}
        <div class="row"><span class="label">${L('Type','النوع')}</span><span class="value">${exp.expense_type||'N/A'}</span></div>
        <div class="row"><span class="label">${L('Payment Mode','طريقة الدفع')}</span><span class="value">${exp.payment_mode||'Cash'}</span></div>
      </div>
      <table><thead><tr><th>${L('Item','الصنف')}</th><th class="right">${L('Qty','الكمية')}</th><th class="right">${L('Price','السعر')}</th><th class="right">${L('Total','الإجمالي')}</th></tr></thead>
        <tbody>${items.map(it=>`<tr><td>${it.name||'Item'}</td><td class="right">${it.qty||1}</td><td class="right">${parseFloat(it.price||0).toFixed(2)}</td><td class="right">${((parseFloat(it.qty)||0)*(parseFloat(it.price)||0)).toFixed(2)}</td></tr>`).join('')}</tbody>
      </table>
      <div class="totals">
        <p>${L('Subtotal','المجموع الفرعي')}: <strong>${subTotal.toFixed(2)} SAR</strong></p>
        ${vat>0?`<p>${L('VAT','الضريبة')} (${vatRate}%): <strong>${vat.toFixed(2)} SAR</strong></p>`:''}
        <h3>${L('Grand Total','الإجمالي الكلي')}: ${(exp.amount||0).toFixed(2)} SAR</h3>
      </div>
    </div>
    <div class="footer"><div class="qr-code"><img src="${qrCodeUrl}" alt="QR" crossorigin="anonymous"/></div><div class="footer-text"><strong>${setting.company_name_en||''}</strong><p>${setting.invoice_footer||''}</p></div><div style="width:75px;"></div></div>
  </div>
  </body></html>`;
};

// ==========================================
// SALARY SLIP TEMPLATE (A4 FULL PAGE FIX)
// ==========================================
const getSalarySlipHTML = (pay, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const L = (en, ar) => isAr ? ar : en;
  const slipNo = `SLIP-${pay.id?.substring(0,8)||'N/A'}`;
  const grossPay = (pay.base_salary||0)+(pay.commission||0)+(pay.overtime||0)+(pay.gift||0);
  const totalDeductions = (pay.advance_deduction||0)+(pay.mistakes_deduction||0);

  return `
  <!DOCTYPE html><html lang="${isAr?'ar':'en'}" dir="${isAr?'rtl':'ltr'}"><head><meta charset="UTF-8"><title>${L('Salary Slip','قسيمة راتب')}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
    html,body{margin:0;padding:0;font-family:'${isAr?'Cairo':'Inter'}',sans-serif;background:#fff;color:#1e293b}
    .page{width:210mm;min-height:297mm;margin:0 auto;background:#fff;display:flex;flex-direction:column}
    .header{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;padding:25px 30px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
    .header h1{font-size:20px;font-weight:800;color:#FBBF24;margin:0}.header h2{font-size:14px;color:#c7d2fe;margin-top:3px}
    .slip-info{text-align:${isAr?'left':'right'}}
    .slip-info h3{color:#FBBF24;font-size:18px;font-weight:800;text-transform:uppercase;letter-spacing:1px}.slip-info p{font-size:12px;color:#c7d2fe;margin-top:3px}
    .body{padding:25px 30px;flex:1;display:flex;flex-direction:column;gap:18px}
    .emp-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;background:#F8FAFC;padding:16px;border-radius:8px;border:1px solid #E2E8F0}
    .emp-grid p{font-size:13px;margin:4px 0}.emp-grid .label{color:#64748b;font-weight:500}
    table{width:100%;border-collapse:collapse;border-radius:6px;overflow:hidden}
    th,td{padding:12px 14px;border-bottom:1px solid #f1f5f9;font-size:13px}
    th{text-align:${isAr?'right':'left'};background:#1E3A8A;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:1px}
    th.right,td.right{text-align:right;font-weight:600}
    .net-pay-box{background:linear-gradient(135deg,#059669,#047857);color:#fff;padding:16px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 8px 12px rgba(5,150,105,0.2)}
    .net-pay-box h3{font-size:14px;margin:0;text-transform:uppercase;letter-spacing:1px}.net-pay-box .amount{font-size:26px;font-weight:800}
    .footer{text-align:center;padding:16px 30px;background:#F8FAFC;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:auto}
    .spacer{flex:1}
    @media print{html,body{width:210mm;height:297mm}.page{width:210mm;min-height:297mm;margin:0;box-shadow:none;border:none}
  </style></head><body>
  <div class="page">
    <div class="header">
      <div><h1>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h1><h2>${setting.company_name_ar||'صعود الطائرة للسفر السياحة'}</h2></div>
      <div class="slip-info"><h3>${isAr?'قسيمة راتب':'Salary Slip'}</h3><p>${L('Slip No','رقم القسيمة')}: ${slipNo} | ${L('Month','الشهر')}: ${pay.month}</p></div>
    </div>
    <div class="body">
      <div class="emp-grid">
        <div><p><span class="label">${L('Employee Name','اسم الموظف')}:</span> <strong>${pay.employees?.name||'N/A'}</strong></p><p><span class="label">${L('Designation','المسمى الوظيفي')}:</span> ${pay.employees?.role||'N/A'}</p></div>
        <div style="text-align:${isAr?'left':'right'}"><p><span class="label">${L('Payment Date','تاريخ الدفع')}:</span> ${pay.payment_date||'N/A'}</p><p><span class="label">${L('Payment Mode','طريقة الدفع')}:</span> ${pay.payment_mode}</p></div>
      </div>
      <table><thead><tr><th>${L('Earnings','الإيرادات')}</th><th class="right">${L('Amount (SAR)','المبلغ (ريال')}</th></tr></thead>
        <tbody>
          <tr><td>${L('Basic Salary','الراتب الأساسي')}</td><td class="right">${(pay.base_salary||0).toFixed(2)}</td></tr>
          <tr><td style="color:#059669;">+ ${L('Commission','العمولة')}</td><td class="right" style="color:#059669;">+ ${(pay.commission||0).toFixed(2)}</td></tr>
          <tr><td style="color:#059669;">+ ${L('Overtime','العمل الإضافي')}</td><td class="right" style="color:#059669;">+ ${(pay.overtime||0).toFixed(2)}</td></tr>
          <tr><td style="color:#059669;">+ ${L('Gift/Bonus','هدية/مكافآ')}</td><td class="right" style="color:#059669;">+ ${(pay.gift||0).toFixed(2)}</td></tr>
          <tr style="background:#F8FAFC"><td><strong>${L('Gross Pay','الراتب الإجمالي')}</strong></td><td class="right"><strong>${grossPay.toFixed(2)}</strong></td></tr>
        </tbody></table>
      <table><thead><tr><th>${L('Deductions','الخصومات')}</th><th class="right">${L('Amount (SAR)','المبلغ (ريال')}</th></tr></thead>
        <tbody>
          <tr><td style="color:#EF4444;">- ${L('Advance Deduction','خصم السلف')}</td><td class="right" style="color:#EF4444;">- ${(pay.advance_deduction||0).toFixed(2)}</td></tr>
          <tr><td style="color:#EF4444;">- ${L('Mistakes Deduction','خصم الأخطاء')}</td><td class="right" style="color:#EF4444;">- ${(pay.mistakes_deduction||0).toFixed(2)}</td></tr>
          <tr style="background:#F8FAFC"><td><strong>${L('Total Deductions','إجمال الخصومات')}</strong></td><td class="right"><strong>${totalDeductions.toFixed(2)}</strong></td></tr>
        </tbody></table>
      <div class="net-pay-box"><h3>${L('Net Pay','صافي الصاف')}</h3><div class="amount">${(pay.amount||0).toFixed(2)} SAR</div></div>
    </div>
    <div class="footer"><p>${L('Computer-generated salary slip','هذه قسيمة راتب تلقائياً ولا تحتاج إلى توقيع يدوية.'}</p><p>© ${new Date().getFullYear()} ${setting.company_name_en||'SUEUD AL TAAYIRA'}</p></div>
  </div>
  </body></html>`;
};

// ==========================================
// STAFF MISTAKE VOUCHER TEMPLATE (A4 FULL PAGE FIX)
// ==========================================
const getMistakeHTML = (m, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const L = (en, ar) => isAr ? ar : en;
  const vNo = `MST-${m.id?.substring(0,8)||'N/A'}`;
  return `
  <!DOCTYPE html><html lang="${isAr?'ar':'en'}" dir="${isAr?'rtl':'ltr'}"><head><meta charset="UTF-8"><title>${L('Loss Voucher','سند خسارة')}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}
    html,body{margin:0;padding:0;font-family:'${isAr?'Cairo':'Inter'}',sans-serif;background:#fff;color:#1e293b}
    .page{width:210mm;min-height:297mm;margin:0 auto;background:#fff;display:flex;flex-direction:column;border-top:8px solid #B91C1C}
    .header{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;padding:25px 30px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
    .header h1{font-size:20px;font-weight:800;color:#FBBF24;margin:0}.header h2{font-size:14px;color:#c7d2fe;margin-top:3px}
    .v-info{text-align:${isAr?'left':'right'}}.v-info h3{color:#FBBF24;font-size:18px;font-weight:800;text-transform:uppercase;letter-spacing:1px}.v-info p{font-size:12px;color:#c7d2fe;margin-top:3px}
    .body{padding:25px 30px;flex:1;display:flex;flex-direction:column;gap:16px}
    .emp-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;background:#F8FAFC;padding:16px;border-radius:8px;border:1px solid #E2E8F0}
    .emp-grid p{font-size:13px;margin:4px 0}.emp-grid .label{color:#64748b;font-weight:500}
    .loss-box{background:linear-gradient(135deg,#EF4444,#B91C1C);color:#fff;padding:16px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 8px 12px rgba(239,68,68,0.2)}
    .loss-box h3{font-size:14px;margin:0;text-transform:uppercase;letter-spacing:1px}.loss-box .amount{font-size:26px;font-weight:800}
    .footer{text-align:center;padding:16px 30px;background:#F8FAFC;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:auto}
    .spacer{flex:1}
    @media print{html,body{width:210mm;height:297mm}.page{width:210mm;min-height:297mm;margin:0;box-shadow:none;border:none;border-top:8px solid #B91C1C}
  </style></head><body>
  <div class="page">
    <div class="header">
      <div><h1>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h1><h2>${setting.company_name_ar||'صعود الطائرة للسفر السياحة'}</h2></div>
      <div class="v-info"><h3>${isAr?'سند خسارة':'Loss Voucher'}</h3><p>${L('Voucher No','رقم السند')}: ${vNo} | ${L('Date','التاريخ'}: ${m.date}</p></div>
    </div>
    <div class="body">
      <div class="emp-grid">
        <div><p><span class="label">${L('Employee Name','اسم الموظف')}:</span> <strong>${m.employees?.name||'N/A'}</strong></p><p><span class="label">${L('Designation','المسمى الوظيفي')}:</span> ${m.employees?.role||'N/A'}</p></div>
        <div style="text-align:${isAr?'left':'right'}"><p><span class="label">${L('Old Ticket No','رقم التذكرة القديمة')}:</span> ${m.old_ticket_no||'N/A'}</p><p><span class="label">${L('New Ticket No','رقم التذكرة الجديدة')}:</span> ${m.new_ticket_no||'N/A'}</p></div>
      </div>
      <div class="loss-box"><h3>${L('Total Loss Amount','إجمال مبلغ الخسارة')}</h3><div class="amount">${(m.loss_amount||0).toFixed(2)} SAR</div></div>
      <p style="margin-top:12px;font-size:13px;color:#334155;"><strong>${L('Deduction Status','حالة الخصم')}:</strong> ${m.paid_by_employee?isAr?'سيتم خصم المبلغ من راتب الموظف':'Amount absorbed by company.'}</p>
    </div>
    <div class="footer"><p>${L('Computer-generated voucher','هذا سند تلقائياً ولا يحتاج توقيع يدوية.')}</p><p>© ${new Date().getFullYear()} ${setting.company_name_en||'SUEUD AL TAAYIRA'}</p></div>
  </div>
  </body></html>`;
};

// ==========================================
// CONTRACT / OFFER TEMPLATE (WITH WATERMARK + A4 FULL PAGE)
// ==========================================
const getContractHTML = (s, name, date, isOffer, type, markup, terms) => {
  const setting = s || {};
  const isAr = false; // Contracts always in English for legal validity
  const docType = isOffer ? 'OFFER' : 'CONTRACT';
  const title = isOffer ? `Corporate Offer - ${name}` : `Corporate Contract - ${name}`;
  const termsList = terms ? terms.split('\n').filter(t => t.trim()).map(t => `<li style="margin-bottom:8px;font-size:14px;color:#334155;">${t.trim()}</li>`).join('') : '<li style="margin-bottom:8px;font-size:14px;color:#334155;">Standard terms and conditions apply.</li>';

  return `
  <!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=${isAr?'Cairo':'Inter'}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{margin:0;padding:0;font-family:'Inter',sans-serif;background:#f0f4f8;color:#1e293b}
    .doc{width:210mm;min-height:297mm;margin:0 auto;background:#fff;position:relative;overflow:hidden}
    .watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:80px;color:rgba(0,0,0,0.04);font-weight:800;white-space:nowrap;pointer-events:none;z-index:1;font-family:'Cairo',sans-serif}
    .doc-inner{position:relative;z-index:2;padding:50px 55px}
    .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:35px;border-bottom:2px solid #e2e8f0;padding-bottom:18px}
    .header h1{font-size:28px;font-weight:800;color:#0F172A;text-transform:uppercase;letter-spacing:1px;margin:0}
    .header .logo-box{text-align:${isAr?'right':'left'}}
    .header .logo-box h2{font-size:18px;font-weight:800;color:#1E3A8A;margin:0}
    .header .logo-box p{font-size:11px;color:#64748b;margin-top:3px}
    .meta-box{background:#F8FAFC;padding:18px;border-radius:10px;border-left:5px solid #FBBF24;margin-bottom:25px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .meta-item p{font-size:13px;margin:4px 0}.meta-item .label{color:#64748b;font-weight:500;display:block;font-size:11px;text-transform:uppercase}
    .meta-item .value{color:#0F172A;font-weight:700;font-size:15px}
    .section{margin-bottom:35px}.section h2{font-size:20px;font-weight:700;color:#1E3A8A;margin-bottom:12px;border-left:4px solid #1E3A8A;padding-left:10px}
    .terms-box ul{padding-left:20px;list-style-type:square}.terms-box li{margin-bottom:8px;font-size:14px;color:#334155;line-height:1.5}
    .sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:50px}
    .sign-box{text-align:center}.sign-line{border-top:2px solid #0F172A;margin-bottom:8px;width:80%;margin:0 auto}
    .sign-box p{font-size:13px;color:#64748b;font-weight:600}
    .footer{margin-top:40px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:18px}
    @media print{html,body{width:210mm;height:297mm;margin:0;padding:0}.doc{width:210mm;min-height:297mm;margin:0;box-shadow:none;border:none}.watermark{display:block}
  </style></head><body>
  <div class="doc">
    <div class="watermark">صعود الطائرة للسفر والسياحة</div>
    <div class="doc-inner">
      <div class="header">
        <div><h1>${docType}</h1><p style="font-size:14px;color:#64748b;margin-top:5px;">${date}</p></div>
        <div class="logo-box"><h2>${setting.company_name_en||'SUEUD AL TAAYIRA'}</h2><p>${setting.company_name_ar||'صعود الطائرة للسفر والسياحة'}</p></div>
      </div>
      <div class="meta-box">
        <div class="meta-item"><span class="label">Client / ${isAr?'العميل':'Corporate Name'}</span><span class="value">${name}</span></div>
        <div class="meta-item"><span class="label">Service Type / ${isAr?'نوع الخدمة':'Service Type'}</span><span class="value">${type}</span></div>
        <div class="meta-item"><span class="label">Service Fee / Markup (SAR)</span><span class="value">${parseFloat(markup||0).toFixed(2)} SAR</span></div>
        <div class="meta-item"><span class="label">Document Validity / ${isAr?'صلاحية الوثيقة':'صلاحية'}</span><span class="value">${isAr?'30 يوم من تاريخ الإصدار':'30 Days from Issue Date'}</span></div>
      </div>
      <div class="section">
        <h2>Terms & Conditions / ${isAr?'الشروط والأحكام':'الشروط والأحكام'}</h2>
        <div class="terms-box"><ul>${termsList}</ul>
      </div>
      <div class="sign-grid">
        <div class="sign-box"><div class="sign-line"></div><p>Authorized Signatory</p><p style="font-size:11px;color:#94a3b8;">${setting.company_name_en||'SUEUD AL TAAYIRA'}</p></div>
        <div class="sign-box"><div class="sign-line"></div><p>Client Acceptance</p><p style="font-size:11px;color:#94a3b8;">${name}</p></div>
      </div>
      <div class="footer"><p>© ${new Date().getFullYear()} ${setting.company_name_en||'SUEUD AL TAAYIRA'}. All rights reserved.</p></div>
    </div>
  </div>
  </body></html>`;
};

// ==========================================
// COMPLETE ARABIC TRANSLATION OBJECT
// ==========================================
const translations = {
  en: {
    dashboard: 'Dashboard', ai_dashboard: 'AI Dashboard', notifications: 'Notifications', my_attendance: 'My Attendance',
    create: 'Create Invoice', list: 'Invoices', refunds: 'Refunds', quotations: 'Quotations', recurring_invoices: 'Recurring Invoices', profitability: 'Profitability',
    ai_pricing: 'AI Pricing', customers: 'Customers', corporates: 'Corporates', creditors: 'Creditors', credit: 'Credit Balances',
    credit_limits: 'Credit Limits', supplier_statement: 'Supplier Statement', multi_branch: 'Multi-Branch', customer_statement: 'Customer Statement',
    vendors: 'Vendors', packages: 'Packages', branches: 'Branches', portals: 'Portals',
    bank: 'Bank & Cash', invest: 'Investors', expense_approval: 'Expense Approval', refund_statement: 'Refund Statement',
    hr: 'Human Resources', hr_advanced: 'HR & Payroll', staff_mistakes: 'Staff Mistakes',
    contract: 'Corporate Contract', offer: 'Corporate Offer',
    statements: 'Statements', reports: 'Reports', audit: 'Audit Logs',
    superadmin: 'SuperAdmin', users: 'Users', settings: 'Settings', profile: 'Profile',
    changePass: 'Change Password', logout: 'Logout', save: 'Save', edit: 'Edit', delete: 'Delete',
    preview: 'Preview', print: 'Print', search: 'Search...', download_excel: 'Export Excel',
    custType: 'Customer Type', individual: 'Individual', corporate: 'Corporate',
    selectCustomer: 'Select Customer', customerPhone: 'Phone', passengers: 'Passengers', addPassenger: '+ Add Passenger',
    portal: 'Portal', service: 'Service', flightTicket: 'Flight Ticket', hotel: 'Hotel Booking',
    tourPackage: 'Tour Package', visitVisa: 'Visit Visa', umrahVisa: 'Umrah Visa', newService: 'New Service',
    flightType: 'Flight Type', domestic: 'Domestic', international: 'International', airline: 'Airline', sector: 'Sector / القطاع',
    pnr: 'PNR / رقم الحجز', ticketNo: 'Ticket No / رقم التذكرة', qty: 'Qty / الكمية',
    cost: 'Cost / التكلفة', sell: 'Sell / البيع', discount: 'Discount / الخصم',
    vatRate: 'VAT Rate / نسبة الضريبة', invoiceDate: 'Invoice Date / تاريخ الفاتورة',
    salesPerson: 'Sales Person / موظف المبيعات', paymentMethod: 'Payment Method / طريقة الدفع',
    cash: 'Cash / نقداً', bankTransfer: 'Bank Transfer / تحويل بنكي', card: 'Card / بطاقة',
    credit: 'Credit / آجل', creditBalance: 'Credit Balance / رصيد',
    tabby: 'Tabby', tamara: 'Tamara',
    paidAmount: 'Paid Amount / المبلغ المدفوع', invNo: 'Inv No / رقم الفاتورة',
    total: 'Total / الإجمالي', due: 'Due / المتبقي', method: 'Method / الطريقة', actions: 'Actions / إجراءات',
    refund: 'Refund / استرجاع', quickSettle: 'Settle / تسوية فوري',
    updateInvoice: 'Update Invoice', generateInvoice: 'Generate Invoice', editInvoice: 'Edit Invoice',
    target: 'Target / الهدف', achieved: 'Achieved / محقق', percentage: 'Percentage / النسبة',
    attendanceDate: 'Date / التاريخ', selectEmployee: 'Select Employee / اختر الموظف',
    status: 'Status / الحالة', present: 'Present / حاضر', leave: 'Leave / إجازة', absent: 'Absent / غائب',
    checkInTime: 'Check-In / وقت الحضور', checkOutTime: 'Check-Out / وقت الانصراف',
    overtime: 'Overtime / عمل إضافي', deduction: 'Deduction / الخصم', mark: 'Mark / تسجيل',
    baseSalary: 'Base Salary / الراتب الأساسي', commission: 'Commission / عمولة %', advDed: 'Adv. Deduct / خصم السلف',
    gift: 'Gift / هدية', month: 'Month / الشهر', mode: 'Mode / الطريقة',
    paySalary: 'Pay Salary / دفع الراتب', generateSlip: 'Download Slip / تحميل القسيمة',
    creditBalance: 'Credit Balance / رصيد', creditors: 'Creditors / الدائنون',
    ai_dashboard: 'AI Dashboard', quotations: 'Quotations', hr_advanced: 'HR & Payroll',
    ai_pricing: 'AI Pricing', profitability: 'Profitability', recurring_invoices: 'Recurring Invoices',
    expense_approval: 'Expense Approval', credit_limits: 'Credit Limits',
    supplier_statement: 'Supplier Statement', multi_branch: 'Multi-Branch', customer_statement: 'Customer Statement',
    staff_mistakes: 'Staff Mistakes', refund_statement: 'Refund Statement',
    notifications: 'Notifications',
  },
  ar: {
    dashboard: 'لوحة التحكم', ai_dashboard: 'لوحة الذكاء الاصطناعي', notifications: 'الإشعارات', my_attendance: 'حضوري',
    create: 'إنشاء فاتورة', list: 'الفواتير', refunds: 'الاسترجاعات', quotations: 'عروض الأسعار', recurring_invoices: 'الفواتير المتكررة', profitability: 'تحليل الربحية',
    ai_pricing: 'تسعير ذكي', customers: 'العملاء', corporates: 'الشركات', creditors: 'الدائنون', credit: 'أرصدة المتاحة',
    credit_limits: 'حدود الائتمان', supplier_statement: 'كشف الدائن', multi_branch: 'الفروع المتعددة', customer_statement: 'كشف العميل',
    vendors: 'الموردون', packages: 'الباقات', branches: 'الفروع', portals: 'البوابات الإلكترونية',
    bank: 'البنك والنقد', invest: 'المستثمرين', expense_approval: 'اعتماد المصروف', refund_statement: 'كشف الاسترجاعات',
    hr: 'الموارد البشرية', hr_advanced: 'الموارد والرواتب', staff_mistakes: 'أخطاء الموظفين',
    contract: 'عقد شركة', offer: 'عرض شركة',
    statements: 'الكشوفات', reports: 'التقارير', audit: 'سجل التدقيق',
    superadmin: 'المدير العام', users: 'المستخدمين', settings: 'الإعدادات', profile: 'الملف الشخصي',
    changePass: 'تغيير كلمة المرور', logout: 'تسجيل الخروج', save: 'حفظ', edit: 'تعديل', delete: 'حذف',
    preview: 'معاينة', print: 'طباعة', search: 'بحث...', download_excel: 'تصدير اكسل',
    custType: 'نوع العميل', individual: 'فرد', corporate: 'شركة',
    selectCustomer: 'اختر العميل', customerPhone: 'رقم الهاتف', passengers: 'الركاب', addPassenger: '+ إضافة راكب',
    portal: 'البوابة', service: 'الخدمة', flightTicket: 'تذكرة طيران', hotel: 'حجز فندق',
    tourPackage: 'باقة سفر', visitVisa: 'تأشيرة زيارة', umrahVisa 'تأشيرة عمرة',
    newService: 'خدمة جديدة', flightType: 'نوع الرحلة', domestic: 'داخلي', international: 'دولي',
    airline: 'خط الطيران', sector: 'القطاع', pnr: 'رقم الحجز',
    ticketNo: 'رقم التذكرة', qty: 'الكمية', cost: 'التكلفة', sell: 'البيع', discount: 'الخصم',
    vatRate: 'نسبة الضريبة', invoiceDate: 'تاريخ الفاتورة',
    salesPerson: 'موظف المبيعات', paymentMethod: 'طريقة الدفع',
    cash: 'نقداً', bankTransfer: 'تحويل بنكي', card: 'بطاقة',
    credit: 'آجل', creditBalance: 'الرصيد',
    tabby: 'تابي', tamara: 'تمارا',
    paidAmount: 'المبلغ المدفوع', invNo: 'رقم الفاتورة',
    total: 'الإجمالي', due: 'المتبقي', method: 'الطريقة', actions: 'إجراءات',
    refund: 'استرجاع', quickSettle: 'تسوية فوري',
    updateInvoice: 'تحديث الفاتورة', generateInvoice: 'إنشاء فاتورة', editInvoice: 'تعديل الفاتورة',
    target: 'الهدف', achieved: 'تم تحقيقه', percentage: 'النسبة',
    attendanceDate: 'التاريخ', selectEmployee: 'اختر الموظف',
    status: 'الحالة', present: 'حاضر', leave: 'إجازة', absent: 'غائب',
    checkInTime: 'وقت الحضور', checkOutTime: 'وقت الانصراف',
    overtime: 'عمل إضافي', deduction: 'الخصم', mark: 'تسجيل',
    baseSalary: 'الراتب الأساسي', commission: 'العمولة %', advDed: 'خصم السلف',
    gift: 'هدية', month: 'الشهر', mode: 'الطريقة',
    paySalary: 'دفع الراتب', generateSlip: 'تحميل القسيمة',
    creditBalance: 'الرصيد', creditors: 'الدائنون',
    ai_dashboard: 'لوحة الذكاء', quotations: 'عروض الأسعار', hr_advanced: 'الموارد والرواتب',
    ai_pricing: 'تسعير ذكي', profitability: 'تحليل الربحية', recurring_invoices: 'الفواتير المتكررة',
    expense_approval: 'اعتماد المصروف', credit_limits: 'حدود الائتمان',
    supplier_statement: 'كشف الدائن', multi_branch: 'الفروع المتعددة', customer_statement: 'كشف العميل',
    staff_mistakes: 'أخطاء الموظفين', refund_statement: 'كشف الاسترجاعات',
    notifications: 'الإشارات',
  }
};

// ==========================================
// MAIN STATE HOOK
// ==========================================
export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [data, setData] = useState({ invoices: [], customers: [], corporates: [], creditors: [], vendors: [], packages: [], branches: [], portals: [], employees: [], services: [], expenses: [], investments: [], cashbook: [], payroll: [], empAdvances: [], staffMistakes: [], attendance: [], appUsers: [], tenants: [], audits: [], settings: {} });

  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState({ type: null, data: null });
  const [toast, setToast] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hello! How can I assist you today? / مرحباً! كيف يمكنني مساعدتك؟' }]);
  const [chatInput, setChatInput] = useState('');

  const [search, setSearch] = useState('');
  const [tblPage, setTblPage] = useState(1);
  const [payFilter, setPayFilter] = useState('All');
  const [previewHTML, setPreviewHTML] = useState('');

  const [invForm, setInvForm] = useState({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '', oldSellPrice: 0, oldBookingDate: '', oldPassengers: '', oldFlightType: '', oldPaymentMethod: '', refundReason: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '', status: 'Unpaid' });
  const [editInvId, setEditInvId] = useState(null);

  const [expForm, setExpForm] = useState({ vendor_name: '', vendor_vat: '', expense_date: today, expense_type: 'Office Supplies', payment_mode: 'Cash', items: [{ name: '', qty: 1, price: 0 }], taxRate: '15', desc: '' });
  const [editExpId, setEditExpId] = useState(null);

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
  const [empForm, setEmpForm] = useState({ name: '', role: 'Sales', salary: 0, phone: '', commission_rate: 0, iqama_no: '', iqama_expiry: '', passport_no: '', passport_expiry: '', maktaba_amal: '', maktaba_expiry: '', basic_food_allowance: 0, housing_allowance: 0, transport_allowance: 0, other_allowance: 0 });
  const [editEmpId, setEditEmpId] = useState(null);
  const [srvForm, setSrvForm] = useState({ name: '' });
  const [editSrvId, setEditSrvId] = useState(null);
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, mode: 'Cash', reason: 'Other', otherReason: '', desc: '' });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: '', date: today, desc: '' });
  const [portalForm, setPortalForm] = useState({ name: '', balance: '' });
  const [setForm, setSetForm] = useState({});
  const [userForm, setUserForm] = useState({ email: '', username: '', role: 'Sales', is_admin: 'false', can_access_invoices: 'true', can_access_bank: 'false', can_access_hr: 'false', can_access_reports: 'false', can_access_settings: 'false' });
  const [editUserId, setEditUserId] = useState(null);
  const [passForm, setPassForm] = useState({ newPass: '' });
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState('');
  const [contractTerms, setContractTerms] = useState('');
  const [tenantForm, setTenantForm] = useState({ agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '', phone: '', address: '' });
  const [repDate, setRepDate] = useState({ from: '', to: '' });
  const [reportTab, setReportTab] = useState('sales');
  const [statementTab, setStatementTab] = useState('sales');
  const [ledgerEmpId, setLedgerEmpId] = useState('');
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '', creditBalance: 0 });
  const [myAttForm, setMyAttForm] = useState({ date: today, checkIn: '09:00', checkOut: '18:00', status: 'Present', leaveStart: today, leaveEnd: today });

  // Computed translation
  const tr = translations[lang] || translations.en;

  // ===================== EXPORT TO EXCEL =====================
  const exportToExcel = (data, filename) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const csvRows = data.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}`).join(','));
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${filename}.csv`; a.click();
  };

  // ===================== FILTER DATA BY DATE RANGE =====================
  const filterData = (array, dateField) => {
    if (!repDate.from && !repDate.to) return array;
    return array.filter(item => {
      const d = item[dateField];
      if (!d) return true;
      return d >= repDate.from && d <= repDate.to;
    });
  };

  // ===================== GENERIC DELETE HANDLER =====================
  const handleDelete = async (table, id) => {
    if (!confirm('Delete permanently?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      setData(prev => ({ ...prev, [table]: prev[table].filter(i => i.id !== id) }));
      await logAction(`Deleted from ${table}`);
      showToast('Deleted successfully!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== LOG ACTION =====================
  const logAction = async (action) => {
    try {
      await supabase.from('audits').insert([{ user_email: userProfile?.email || 'system', action, tenant_id: userProfile?.tenant_id }]);
    } catch (e) { console.error('Audit log error:', e); }
  };

  // ===================== AUTH CHECK =====================
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: profile } = await supabase.from('app_users').select('*').eq('id', session.user.id).maybeSingle();
      if (!profile) { router.push('/setup'); return; }

      if (profile.role === 'SuperAdmin') {
        setUser(session.user);
        setUserProfile(profile);
        return;
      }

      // Check subscription
      if (profile.tenant_id) {
        const { data: tenant } = await supabase.from('tenants').select('id, is_paid, subscription_end_date').eq('id', profile.tenant_id).maybeSingle();
        if (tenant && !tenant.is_paid) { router.push('/subscription'); return; }
      }

      setUser(session.user);
      setUserProfile(profile);
    };

    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/login');
    });
  }, [router]);

  // ===================== FETCH ALL DATA =====================
  const fetchAll = useCallback(async () => {
    if (!userProfile?.tenant_id) return;
    const tid = userProfile.tenant_id;

    const tables = [
      { key: 'invoices', query: `tenant_id=eq.${tid},invoice_no=not.like.REF-,status=not.in.(Draft,Recurring),is_deleted=is.null`, select: '*,customers(name,phone,store_credit),corporates(name,vat_no,phone,address),employees(name,role,salary,phone,commission_rate,iqama_no,iqama_expiry,passport_no,passport_expiry,maktaba_amal,maktaba_expiry,basic_food_allowance,housing_allowance,transport_allowance,other_allowance),services(name),portals(name,current_balance),expenses(*,expenses(id,vendor_name,vendor_vat,expense_date,expense_type,items,amount,description,payment_mode,approval_status),investments(*),cashbook(*,cashbook(id,trans_date,type,description,amount,reference_id)),payroll(*,payroll(id,month,amount,base_salary,commission,overtime,gift,advance_deduction,mistakes_deduction,payment_mode,payment_date,employees(name,role)),emp_advances(*,emp_advances(id,date,amount,status,employee_id,employees(name))),staff_mistakes(*,staff_mistakes(id,date,old_ticket_no,new_ticket_no,loss_amount,paid_by_employee,employee_id,employees(name))),attendance(*,attendance(id,date,status,check_in,check_out,overtime,deduction,employee_id,employees(name))),app_users(id,email,username,role,is_admin,can_access_invoices,can_access_bank,can_access_hr,can_access_reports,can_access_settings),tenants(*),audits(*,audits(id,created_at,user_email,action,tenant_id)),settings(*,settings(id,tenant_id))` }
    ];

    const results = await Promise.all(tables.map(t => supabase.from(t.key).select(t.query).order('created_at', { ascending: false })));
    const merged = {};
    results.forEach((r, i) => { if (r.data) merged[tables[i].key] = r.data; });

    setData(prev => ({ ...prev, ...merged }));
  }, [userProfile?.tenant_id]);

  // Initial fetch
  useEffect(() => { fetchAll(); }, [userProfile?.tenant_id]);

  // Return everything
  return {
    user, userProfile, data, setData, lang, setLang, page, setPage, modal, setModal, passForm, setPassForm,
    chatOpen, setChatOpen, chatMessages, setChatInput,
    search, setSearch, tblPage, setTblPage, payFilter, setPayFilter, previewHTML, setPreviewHTML,
    getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getMistakeHTML, getContractHTML,
    today, router, tr, contractCorpName, contractType, contractMarkup, contractTerms, setContractTerms, tenantForm, setTenantForm,
    profileForm, setProfileForm, ledgerEmpId, myAttForm, setMyAttForm,
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
    investForm, setInvestForm, transferForm, setTransferForm,
    portalForm, setPortalForm,
    setForm, setSetForm, userForm, setUserForm, editUserId, setEditUserId,
    settleForm, setSettleForm, refundForm, setRefundForm,
    logAction, fetchAll, exportToExcel, filterData, handleDelete, showToast
  };
}
