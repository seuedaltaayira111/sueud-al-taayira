'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ==========================================
// PREMIUM ONE-PAGE BILINGUAL INVOICE TEMPLATE
// ==========================================
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
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
  const cashPaid = paidAmount - usedCredit - cashReturn; // Actual cash kept by agency
  const dueAmount = inv.due_amount || 0;
  const unitPrice = (inv.qty || 1) > 0 ? totalSell / inv.qty : totalSell;
  
  const invStatus = inv.status || (dueAmount > 0 ? 'Unpaid' : 'Paid');

  let paymentDisplay = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit' && inv.credit_due_date) paymentDisplay = `Credit (Due: ${inv.credit_due_date})`;

  const isReissue = inv.booking_type === 'Reissue' || inv.booking_type === 'Previous Booking';
  const passengersList = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      body { font-family: 'Inter', 'Cairo', sans-serif; background: #f0f4f8; margin: 0; padding: 20px; color: #1e293b; }
      .invoice-box { max-width: 800px; margin: auto; background: #fff; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-radius: 12px; page-break-inside: avoid; }
      .header { display: flex; justify-content: space-between; align-items: stretch; padding: 20px; background: linear-gradient(135deg, #0c1d3a 0%, #1a365d 100%); color: #fff; gap: 20px; }
      .company-block { display: flex; gap: 15px; flex: 1; }
      .logo-box { width: 70px; height: 70px; object-fit: cover; border-radius: 10px; background: rgba(255,255,255,0.1); padding: 3px; flex-shrink: 0; }
      .company-text h2 { font-size: 18px; font-weight: 800; color: #fbbf24; }
      .company-text h1 { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
      .company-text p { font-size: 11px; color: rgba(255,255,255,0.7); line-height: 1.5; margin-top: 5px; }
      .invoice-meta { min-width: 220px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; justify-content: center; }
      .invoice-meta h3 { font-size: 24px; font-weight: 800; color: #fbbf24; text-transform: uppercase; line-height: 1.1; }
      .invoice-meta h3 span { font-size: 13px; font-family: 'Cairo'; display: block; margin-top: 2px; }
      .meta-row { display: flex; justify-content: space-between; margin-top: 4px; font-size: 12px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 2px; }
      .meta-row .lbl { color: rgba(255,255,255,0.6); }
      .meta-row .val { color: #fbbf24; font-weight: 700; }
      .status-badge { display: inline-block; padding: 5px 12px; border-radius: 15px; font-size: 11px; font-weight: 700; margin-top: 8px; align-self: flex-start; ${invStatus === 'Unpaid' ? 'background: rgba(251,191,36,0.2); color: #fbbf24;' : 'background: rgba(52,211,153,0.2); color: #34d399;'} }
      .body { padding: 20px; }
      .bilingual-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; display: flex; justify-content: space-between; }
      .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
      .info-block { padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #1a365d; }
      .info-row { display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px solid #f1f5f9; }
      .info-row:last-child { border: none; }
      .info-row .label { color: #64748b; }
      .info-row .value { color: #0f172a; font-weight: 600; text-align: right; }
      .reissue-block { padding: 12px; background: #fffbeb; border-radius: 8px; border: 1px solid #fde68a; margin-bottom: 15px; page-break-inside: avoid; }
      .reissue-title { font-size: 13px; font-weight: 700; color: #d97706; margin-bottom: 8px; display: flex; justify-content: space-between; background: #fef3c7; padding: 6px 10px; border-radius: 6px; }
      .reissue-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .reissue-item { background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #fde68a; }
      .reissue-item .lbl { font-size: 10px; color: #92400e; font-weight: 600; text-transform: uppercase; }
      .reissue-item .val { font-size: 12px; color: #78350f; font-weight: 700; margin-top: 2px; }
      .reissue-fare { background: #dcfce7; border-color: #86efac; grid-column: span 3; display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; }
      .reissue-fare .lbl { color: #059669; font-size: 12px; }
      .reissue-fare .val { color: #047857; font-size: 14px; font-weight: 800; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 15px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
      thead th { padding: 8px; background: #0c1d3a; color: #fbbf24; font-size: 11px; text-transform: uppercase; text-align: left; }
      thead th.right { text-align: right; }
      thead th.center { text-align: center; }
      tbody td { padding: 8px; border-bottom: 1px solid #f1f5f9; font-size: 12px; background: #fff; }
      tbody td.right { text-align: right; font-weight: 600; }
      tbody td.center { text-align: center; }
      .bottom-section { display: grid; grid-template-columns: 1.5fr 1fr; gap: 15px; }
      .payment-breakdown { padding: 12px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 8px; border: 1px solid #e2e8f0; }
      .pay-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px dashed #cbd5e1; }
      .pay-row:last-child { border: none; }
      .totals-box { background: #0c1d3a; border-radius: 8px; padding: 12px; color: #fff; align-self: flex-start; }
      .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: rgba(255,255,255,0.8); }
      .grand-total { display: flex; justify-content: space-between; padding: 8px 0 0; margin-top: 4px; border-top: 2px solid rgba(255,255,255,0.1); font-size: 16px; font-weight: 800; color: #fff; }
      .grand-total .val { color: #fbbf24; }
      .footer { padding: 12px 20px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; gap: 15px; }
      .qr-code img { height: 60px; width: 60px; border-radius: 6px; border: 1px solid #e2e8f0; padding: 2px; background: #fff; }
      .footer-text { text-align: center; flex: 1; }
      .ai-msg { font-size: 11px; color: #475569; font-weight: 600; margin-bottom: 2px; }
      .ai-msg-ar { font-size: 11px; color: #64748b; font-family: 'Cairo'; }
      @media print { body { background: #fff; padding: 0; margin: 0; } .invoice-box { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; } }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <div class="company-block">
          ${setting.logo_url ? `<img src="${setting.logo_url}" crossorigin="anonymous" class="logo-box" />` : ''}
          <div class="company-text">
            <h2>${setting.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
            <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
            <p>
              ${setting.address_ar || 'Address / العنوان'}<br/>
              VAT / ضريبة: ${setting.vat_no || 'N/A'} | CR / سجل: ${setting.cr_no || 'N/A'}<br/>
              Lic / ترخيص: ${setting.license_no || 'N/A'} | Phone / هاتف: ${setting.phone || 'N/A'}
            </p>
          </div>
        </div>
        <div class="invoice-meta">
          <h3>TAX INVOICE<span>فاتورة ضريبية</span></h3>
          <div class="meta-row"><span class="lbl">Inv No / رقم</span><span class="val">${invoiceNo}</span></div>
          <div class="meta-row"><span class="lbl">Date / تاريخ</span><span class="val">${inv.invoice_date || ''}</span></div>
          <div class="status-badge">${invStatus === 'Unpaid' ? 'UNPAID / غير مدفوعة' : 'PAID / مدفوعة'}</div>
        </div>
      </div>
      
      <div class="body">
        <div class="details-grid">
          <div class="info-block">
            <div class="bilingual-title"><span>BILL TO / فاتورة إلى</span></div>
            <div class="info-row"><span class="label">Name / الاسم</span><span class="value">${inv.customers?.name || inv.corporates?.name || 'N/A'}</span></div>
            <div class="info-row"><span class="label">Phone / الهاتف</span><span class="value">${inv.customers?.phone || 'N/A'}</span></div>
            <div class="info-row"><span class="label">Sales Person / الموظف</span><span class="value">${inv.employees?.name || 'N/A'}</span></div>
            <div class="info-row"><span class="label">Passengers / الركاب</span><span class="value" style="max-width:150px; font-size:11px;">${passengersList}</span></div>
          </div>
          <div class="info-block" style="border-left-color: #f59e0b;">
            <div class="bilingual-title"><span>FLIGHT DETAILS / تفاصيل الرحلة</span></div>
            <div class="info-row"><span class="label">Airline / خط الطيران</span><span class="value">${inv.airline || 'N/A'}</span></div>
            <div class="info-row"><span class="label">Sector / القطاع</span><span class="value">${inv.flight_sector || 'N/A'}</span></div>
            <div class="info-row"><span class="label">Flight Type / نوع الرحلة</span><span class="value">${inv.flight_type || 'N/A'}</span></div>
            <div class="info-row"><span class="label">PNR / رقم الحجز</span><span class="value">${inv.pnr || 'N/A'}</span></div>
            <div class="info-row"><span class="label">Ticket No / التذكرة</span><span class="value">${inv.ticket_no || 'N/A'}</span></div>
          </div>
        </div>
        
        ${isReissue ? `
        <div class="reissue-block">
          <div class="reissue-title"><span>⚠️ PREVIOUS BOOKING DETAILS</span><span>تفاصيل الحجز السابق</span></div>
          <div class="reissue-grid">
            <div class="reissue-item"><div class="lbl">Old Date / تاريخ الحجز القديم</div><div class="val">${inv.old_booking_date || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">Old Airline / الخطوط القديمة</div><div class="val">${inv.old_airline || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">Old Sector / القطاع القديم</div><div class="val">${inv.old_sector || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">Old PNR / رقم الحجز القديم</div><div class="val">${inv.old_pnr || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">Old Ticket / التذكرة القديمة</div><div class="val">${inv.old_ticket_no || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">Old Type / نوع الرحلة القديمة</div><div class="val">${inv.old_flight_type || 'N/A'}</div></div>
            <div class="reissue-item reissue-fare">
              <div class="lbl">Original Ticket Fare / أجرة التذكرة الأصلية</div>
              <div class="val">${parseFloat(inv.old_sell_price || 0).toFixed(2)} SAR</div>
            </div>
          </div>
        </div>` : ''}
        
        <table>
          <thead>
            <tr>
              <th>Description / الوصف</th>
              <th class="center">Qty / الكمية</th>
              <th class="right">Unit Price / سعر الوحدة</th>
              <th class="right">Total / الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${inv.sector || inv.service_type || 'Service / خدمة'}</td>
              <td class="center">${inv.qty || 1}</td>
              <td class="right">${unitPrice.toFixed(2)}</td>
              <td class="right">${totalSell.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="bottom-section">
          <div class="payment-breakdown">
            <div class="bilingual-title"><span>PAYMENT BREAKDOWN / تفاصيل الدفع</span></div>
            <div class="pay-row"><span>New Booking Price / سعر الحجز الجديد</span><span style="font-weight:600;">${total.toFixed(2)} SAR</span></div>
            ${usedCredit > 0 ? `<div class="pay-row" style="color:#7c3aed;"><span>Less: Refund Credit / خصم الرصيد</span><span style="font-weight:600;">- ${usedCredit.toFixed(2)} SAR</span></div>` : ''}
            ${cashReturn > 0 ? `<div class="pay-row" style="color:#ef4444;"><span>Cash Returned to Customer / مبلغ مرتجع</span><span style="font-weight:600;">- ${cashReturn.toFixed(2)} SAR</span></div>` : ''}
            <div class="pay-row" style="border-top:2px solid #cbd5e1; margin-top:4px; padding-top:4px; font-weight:700;"><span>Balance Paid / المدفوع (${paymentDisplay})</span><span style="color:#059669;">${cashPaid.toFixed(2)} SAR</span></div>
            <div class="pay-row" style="font-weight:700;"><span>Amount Due / المتبقي</span><span style="color:${dueAmount > 0 ? '#ef4444' : '#059669'};">${dueAmount.toFixed(2)} SAR</span></div>
          </div>
          
          <div class="totals-box">
            <div class="total-row"><span>Subtotal / الإجمالي</span><span>${subTotal.toFixed(2)}</span></div>
            ${discount > 0 ? `<div class="total-row" style="color:#34d399;"><span>Discount / الخصم</span><span>- ${discount.toFixed(2)}</span></div>` : ''}
            <div class="total-row"><span>VAT (${vatRate}%) / الضريبة</span><span>${vat.toFixed(2)}</span></div>
            <div class="grand-total"><span>GRAND TOTAL / الإجمالي</span><span class="val">${total.toFixed(2)} SAR</span></div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <div class="qr-code">
          <img src="${qrCodeUrl}" alt="Scan to Download" crossorigin="anonymous" />
          <p style="font-size: 9px; text-align: center; color: #94A3B8; margin-top: 3px;">Scan / امسح</p>
        </div>
        <div class="footer-text">
          <p class="ai-msg">Thank you for choosing us! Have a safe flight.</p>
          <p class="ai-msg-ar">شكراً لاختياركم إيانا. رحلة سعيدة!</p>
        </div>
        <div style="width: 70px;"></div>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// PREMIUM REFUND INVOICE TEMPLATE (FIXED N/A & ONE PAGE)
// ==========================================
const getRefundHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;
  
  const originalFare = inv.old_sell_price || inv.total_sell || 0;
  const customerRefund = inv.refund_customer || 0;
  const airlineRefund = inv.refund_company || 0; 
  const airlineCancellationFee = originalFare - airlineRefund; 
  
  const custName = inv.customers?.name || inv.old_customer_name || 'N/A';
  const custPhone = inv.customers?.phone || inv.old_customer_phone || 'N/A';
  const passengersList = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : (inv.old_passengers || 'N/A');
  
  let refundMethodDisplay = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit') refundMethodDisplay = 'Credit for New Booking / رصيد لحجز جديد';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Refund ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      body { font-family: 'Inter', 'Cairo', sans-serif; background: #f0f4f8; margin: 0; padding: 20px; color: #1e293b; }
      .invoice-box { max-width: 800px; margin: auto; background: #fff; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-radius: 12px; page-break-inside: avoid; }
      .header { display: flex; justify-content: space-between; align-items: stretch; padding: 20px; background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); color: #fff; gap: 20px; }
      .company-block { display: flex; gap: 15px; flex: 1; }
      .logo-box { width: 70px; height: 70px; object-fit: cover; border-radius: 10px; background: rgba(255,255,255,0.1); padding: 3px; flex-shrink: 0; }
      .company-text h2 { font-size: 18px; font-weight: 800; color: #fbbf24; }
      .company-text h1 { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
      .company-text p { font-size: 11px; color: rgba(255,255,255,0.6); line-height: 1.5; margin-top: 5px; }
      .invoice-meta { min-width: 200px; text-align: right; display: flex; flex-direction: column; justify-content: center; }
      .invoice-meta h3 { font-size: 24px; font-weight: 800; color: #fbbf24; text-transform: uppercase; line-height: 1.1; }
      .invoice-meta h3 span { font-size: 13px; font-family: 'Cairo'; display: block; margin-top: 2px; }
      .inv-no { font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 5px; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 3px; }
      .inv-no span { color: #fbbf24; font-weight: 700; }
      .status-badge { display: inline-block; padding: 5px 12px; border-radius: 15px; font-size: 11px; font-weight: 700; margin-top: 8px; background: rgba(251,191,36,0.2); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); align-self: flex-end; }
      .body { padding: 20px; }
      .info-block { padding: 12px; background: #fff5f5; border-radius: 8px; border-left: 3px solid #dc2626; margin-bottom: 12px; }
      .info-block h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #dc2626; margin-bottom: 8px; font-weight: 700; }
      .row { display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px solid #fee2e2; }
      .row:last-child { border: none; }
      .row .label { color: #991b1b; font-weight: 500; }
      .row .value { color: #7f1d1d; font-weight: 600; text-align: right; }
      
      .breakdown-block { background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 12px; }
      .breakdown-title { font-size: 11px; text-transform: uppercase; color: #dc2626; margin-bottom: 8px; border-bottom: 1px solid #fee2e2; padding-bottom: 5px; font-weight: 700; }
      .calc-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #334155; }
      .calc-row.deduct { color: #ef4444; }
      .calc-row.total { padding-top: 8px; margin-top: 5px; border-top: 1px solid #e2e8f0; font-size: 16px; font-weight: 800; color: #059669; }
      
      .payment-info { padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
      .pay-row { font-size: 12px; font-weight: 600; color: #334155; }
      .footer { padding: 12px 20px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; gap: 15px; }
      .qr-code img { height: 60px; width: 60px; border-radius: 6px; border: 1px solid #e2e8f0; padding: 2px; background: #fff; }
      @media print { body { background: #fff; padding: 0; margin: 0; } .invoice-box { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; } }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <div class="company-block">
          ${setting.logo_url ? `<img src="${setting.logo_url}" crossorigin="anonymous" class="logo-box" />` : ''}
          <div class="company-text">
            <h2>${setting.company_name_ar || 'صعود الطائرة'}</h2>
            <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
            <p>${setting.address_ar || ''}<br/>VAT / ضريبة: ${setting.vat_no || 'N/A'} | CR / سجل: ${setting.cr_no || 'N/A'}</p>
          </div>
        </div>
        <div class="invoice-meta">
          <h3>REFUND<span>استرجاع</span></h3>
          <div class="inv-no">Refund No / رقم: <span>${invoiceNo}</span></div>
          <div class="inv-no">Date / تاريخ: <span>${inv.refund_date || inv.invoice_date || ''}</span></div>
          <div class="status-badge">PROCESSED / تم الاسترجاع</div>
        </div>
      </div>
      <div class="body">
        <div class="info-block">
          <h4>BOOKING DETAILS / تفاصيل الحجز</h4>
          <div class="row"><span class="label">Customer Name / اسم العميل</span><span class="value">${custName}</span></div>
          <div class="row"><span class="label">Contact / الهاتف</span><span class="value">${custPhone}</span></div>
          <div class="row"><span class="label">Passengers / الركاب</span><span class="value" style="max-width:150px; font-size:11px;">${passengersList}</span></div>
          <div class="row"><span class="label">Airline / خط الطيران</span><span class="value">${inv.airline || inv.old_airline || 'N/A'}</span></div>
          <div class="row"><span class="label">Date of Booking / تاريخ الحجز</span><span class="value">${inv.invoice_date || inv.old_booking_date || 'N/A'}</span></div>
          <div class="row"><span class="label">PNR / رقم الحجز</span><span class="value">${inv.pnr || inv.old_pnr || 'N/A'}</span></div>
          <div class="row"><span class="label">Reason / سبب الاسترجاع</span><span class="value">${inv.refund_reason || 'N/A'}</span></div>
        </div>
        
        <div class="breakdown-block">
          <div class="breakdown-title">REFUND CALCULATION / تفاصيل حساب الاسترجاع</div>
          <div class="calc-row"><span>Original Ticket Fare / أجرة التذكرة الأصلية</span><span style="font-weight:600;">${originalFare.toFixed(2)} SAR</span></div>
          <div class="calc-row deduct"><span>Less: Airline Cancellation Fees / رسوم إلغاء الخطوط</span><span style="font-weight:600;">- ${airlineCancellationFee.toFixed(2)} SAR</span></div>
          <div class="calc-row total"><span>Refund Amount to Customer / المبلغ المسترجع للعميل</span><span>${customerRefund.toFixed(2)} SAR</span></div>
        </div>
        
        <div class="payment-info">
          <span class="pay-row">Refund Method / طريقة الاسترجاع</span>
          <span style="font-weight:600; color:#2563eb;">${refundMethodDisplay}</span>
        </div>
      </div>
      <div class="footer">
        <div class="qr-code"><img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous"></div>
        <div style="text-align: center; flex: 1;">
          <strong>${setting.company_name_en || ''}</strong>
          <p style="font-size: 10px; color: #94a3b8;">Thank you! / شكراً!</p>
        </div>
        <div style="width: 70px;"></div>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// PREMIUM EXPENSE VOUCHER TEMPLATE
// ==========================================
const getExpenseHTML = (exp, s, lang = 'en') => {
  const setting = s || {};
  const expNo = exp.invoice_no || `EXP-${exp.id?.substring(0,8) || 'N/A'}`;
  const trackUrl = `https://sueud-al-taayira.vercel.app`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;
  const items = exp.items && exp.items.length > 0 ? exp.items : [{ name: exp.item_name || 'Item', qty: 1, price: exp.amount || 0 }];
  const subTotal = items.reduce((sum, it) => sum + ((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)), 0);
  const vat = (exp.amount || 0) - subTotal;
  const vatRate = vat > 0 && subTotal > 0 ? Math.round((vat / subTotal) * 100) : 0;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Expense ${expNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      body { font-family: 'Inter', 'Cairo', sans-serif; background: #f0f4f8; margin: 0; padding: 30px; color: #1e293b; }
      .invoice-box { max-width: 850px; margin: auto; background: #fff; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-radius: 12px; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; padding: 35px 40px; background: linear-gradient(135deg, #7c2d12 0%, #9a3412 100%); color: #fff; }
      .company-info h2 { font-size: 22px; font-weight: 800; color: #fbbf24; }
      .company-info h1 { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
      .invoice-meta { text-align: right; }
      .invoice-meta h3 { font-size: 28px; font-weight: 800; color: #fbbf24; text-transform: uppercase; }
      .invoice-meta p { font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 5px; }
      .invoice-meta p span { color: #fbbf24; font-weight: 700; }
      .body { padding: 35px 40px; }
      .info-block { padding: 18px; background: #fff7ed; border-radius: 10px; border-left: 3px solid #ea580c; margin-bottom: 25px; }
      .info-block h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #ea580c; margin-bottom: 10px; font-weight: 700; }
      .info-block .row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
      .info-block .row .label { color: #9a3412; font-weight: 500; }
      .info-block .row .value { color: #7c2d12; font-weight: 600; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
      thead th { text-align: left; padding: 12px; background: #7c2d12; color: #fbbf24; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
      thead th.right { text-align: right; }
      tbody td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
      tbody td.right { text-align: right; font-weight: 600; }
      .totals { text-align: right; margin-top: 15px; }
      .totals p { font-size: 13px; margin: 5px 0; color: #64748b; }
      .totals h3 { font-size: 22px; color: #ea580c; font-weight: 800; margin-top: 10px; }
      .footer { padding: 25px 40px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; }
      .footer-text { text-align: center; flex: 1; }
      .footer-text p { font-size: 11px; color: #94a3b8; }
      .qr-code img { height: 80px; width: 80px; border-radius: 6px; border: 1px solid #e2e8f0; padding: 3px; background: #fff; }
      @media print { body { background: #fff; padding: 0; margin: 0; } .invoice-box { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; } }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <div class="company-info">
          <h2>${setting.company_name_ar || 'صعود الطائرة'}</h2>
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
        </div>
        <div class="invoice-meta">
          <h3>EXPENSE VOUCHER</h3>
          <p>No: <span>${expNo}</span></p>
          <p>Date: <span>${exp.expense_date || ''}</span></p>
        </div>
      </div>
      <div class="body">
        <div class="info-block">
          <h4>VENDOR & EXPENSE DETAILS</h4>
          <div class="row"><span class="label">Vendor</span><span class="value">${exp.vendor_name || 'N/A'}</span></div>
          ${exp.vendor_vat ? `<div class="row"><span class="label">Vendor VAT</span><span class="value">${exp.vendor_vat}</span></div>` : ''}
          <div class="row"><span class="label">Type</span><span class="value">${exp.expense_type || 'N/A'}</span></div>
          <div class="row"><span class="label">Payment Mode</span><span class="value">${exp.payment_mode || 'Cash'}</span></div>
        </div>
        <table>
          <thead><tr><th>Item</th><th class="right">Qty</th><th class="right">Price</th><th class="right">Total</th></tr></thead>
          <tbody>
            ${items.map(it => `<tr><td>${it.name || 'Item'}</td><td class="right">${it.qty || 1}</td><td class="right">${parseFloat(it.price || 0).toFixed(2)}</td><td class="right">${((parseFloat(it.qty)||0)*(parseFloat(it.price)||0)).toFixed(2)}</td></tr>`).join('')}
          </tbody>
        </table>
        <div class="totals">
          <p>Subtotal: <strong>${subTotal.toFixed(2)} SAR</strong></p>
          ${vat > 0 ? `<p>VAT (${vatRate}%): <strong>${vat.toFixed(2)} SAR</strong></p>` : ''}
          <h3>Grand Total: ${(exp.amount || 0).toFixed(2)} SAR</h3>
        </div>
      </div>
      <div class="footer">
        <div class="qr-code"><img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous"></div>
        <div class="footer-text"><strong>${setting.company_name_en || ''}</strong><p>${setting.invoice_footer || ''}</p></div>
        <div style="width: 86px;"></div>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// SALARY SLIP TEMPLATE (PREMIUM FIXED)
// ==========================================
const getSalarySlipHTML = (pay, s, lang = 'en') => {
  const setting = s || {};
  const slipNo = `SLIP-${pay.id?.substring(0,8) || 'N/A'}`;
  const grossPay = (pay.base_salary || 0) + (pay.commission || 0) + (pay.overtime || 0) + (pay.gift || 0);
  const totalDeductions = (pay.advance_deduction || 0) + (pay.mistakes_deduction || 0);

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Salary Slip ${slipNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      body { font-family: 'Inter', 'Cairo', sans-serif; background: #f0f4f8; margin: 0; padding: 30px; color: #1e293b; }
      .slip { max-width: 800px; margin: auto; background: #fff; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-radius: 12px; }
      .header { background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%); color: #fff; padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; }
      .header h1 { font-size: 22px; font-weight: 800; color: #FBBF24; }
      .header h2 { font-size: 15px; color: #c7d2fe; margin-top: 4px; }
      .header .slip-info { text-align: right; }
      .header .slip-info h3 { color: #FBBF24; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
      .header .slip-info p { font-size: 13px; color: #c7d2fe; margin-top: 4px; }
      .body { padding: 35px 40px; }
      .emp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #F8FAFC; padding: 20px; border-radius: 10px; border: 1px solid #E2E8F0; margin-bottom: 25px; }
      .emp-grid p { font-size: 14px; margin: 5px 0; }
      .emp-grid .label { color: #64748b; font-weight: 500; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 25px; border-radius: 8px; overflow: hidden; }
      th, td { padding: 14px 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
      th { text-align: left; background: #1E3A8A; color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
      th.right, td.right { text-align: right; font-weight: 600; }
      .net-pay-box { background: linear-gradient(135deg, #059669, #047857); color: #fff; padding: 20px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin-top: 15px; box-shadow: 0 10px 15px rgba(5, 150, 105, 0.2); }
      .net-pay-box h3 { font-size: 16px; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
      .net-pay-box .amount { font-size: 28px; font-weight: 800; }
      .footer { text-align: center; padding: 20px 40px; background: #F8FAFC; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      @media print { body { background: #fff; padding: 0; margin: 0; } .slip { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; } }
    </style>
  </head>
  <body>
    <div class="slip">
      <div class="header">
        <div>
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <h2>${setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
        </div>
        <div class="slip-info">
          <h3>Salary Slip</h3>
          <p>Slip No: ${slipNo} | Month: ${pay.month}</p>
        </div>
      </div>
      <div class="body">
        <div class="emp-grid">
          <div>
            <p><span class="label">Employee Name:</span> <strong>${pay.employees?.name || 'N/A'}</strong></p>
            <p><span class="label">Designation:</span> ${pay.employees?.role || 'N/A'}</p>
          </div>
          <div style="text-align: right;">
            <p><span class="label">Payment Date:</span> ${pay.payment_date || 'N/A'}</p>
            <p><span class="label">Payment Mode:</span> ${pay.payment_mode}</p>
          </div>
        </div>
        <table>
          <thead><tr><th>Earnings</th><th class="right">Amount (SAR)</th></tr></thead>
          <tbody>
            <tr><td>Basic Salary</td><td class="right">${(pay.base_salary || 0).toFixed(2)}</td></tr>
            <tr><td>Commission</td><td class="right" style="color:#059669;">+ ${(pay.commission || 0).toFixed(2)}</td></tr>
            <tr><td>Overtime</td><td class="right" style="color:#059669;">+ ${(pay.overtime || 0).toFixed(2)}</td></tr>
            <tr><td>Gift/Bonus</td><td class="right" style="color:#059669;">+ ${(pay.gift || 0).toFixed(2)}</td></tr>
            <tr style="background:#F8FAFC;"><td><strong>Gross Pay</strong></td><td class="right"><strong>${grossPay.toFixed(2)}</strong></td></tr>
          </tbody>
        </table>
        <table>
          <thead><tr><th>Deductions</th><th class="right">Amount (SAR)</th></tr></thead>
          <tbody>
            <tr><td>Advance Deduction</td><td class="right" style="color:#EF4444;">- ${(pay.advance_deduction || 0).toFixed(2)}</td></tr>
            <tr><td>Mistakes Deduction</td><td class="right" style="color:#EF4444;">- ${(pay.mistakes_deduction || 0).toFixed(2)}</td></tr>
            <tr style="background:#F8FAFC;"><td><strong>Total Deductions</strong></td><td class="right"><strong>${totalDeductions.toFixed(2)}</strong></td></tr>
          </tbody>
        </table>
        <div class="net-pay-box">
          <h3>Net Pay</h3>
          <div class="amount">${(pay.amount || 0).toFixed(2)} SAR</div>
        </div>
      </div>
      <div class="footer">
        <p>This is a computer-generated salary slip and does not require a physical signature.</p>
        <p>© ${new Date().getFullYear()} ${setting.company_name_en || 'SUEUD AL TAAYIRA'}</p>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// STAFF MISTAKE VOUCHER TEMPLATE
// ==========================================
const getMistakeHTML = (m, s, lang = 'en') => {
  const setting = s || {};
  const vNo = `MST-${m.id?.substring(0,8) || 'N/A'}`;
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Mistake Voucher ${vNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      body { font-family: 'Inter', 'Cairo', sans-serif; background: #f0f4f8; margin: 0; padding: 30px; color: #1e293b; }
      .voucher { max-width: 800px; margin: auto; background: #fff; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-radius: 12px; border-top: 10px solid #B91C1C; }
      .header { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: #fff; padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; }
      .header h1 { font-size: 22px; font-weight: 800; color: #FBBF24; }
      .header h2 { font-size: 15px; color: #c7d2fe; margin-top: 4px; }
      .header .v-info { text-align: right; }
      .header .v-info h3 { color: #FBBF24; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
      .header .v-info p { font-size: 13px; color: #c7d2fe; margin-top: 4px; }
      .body { padding: 35px 40px; }
      .emp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #F8FAFC; padding: 20px; border-radius: 10px; border: 1px solid #E2E8F0; margin-bottom: 25px; }
      .emp-grid p { font-size: 14px; margin: 5px 0; }
      .emp-grid .label { color: #64748b; font-weight: 500; }
      .loss-box { background: linear-gradient(135deg, #EF4444, #B91C1C); color: #fff; padding: 20px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin-top: 15px; box-shadow: 0 10px 15px rgba(239, 68, 68, 0.2); }
      .loss-box h3 { font-size: 16px; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
      .loss-box .amount { font-size: 28px; font-weight: 800; }
      .footer { text-align: center; padding: 20px 40px; background: #F8FAFC; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      @media print { body { background: #fff; padding: 0; margin: 0; } .voucher { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; border: none; } }
    </style>
  </head>
  <body>
    <div class="voucher">
      <div class="header">
        <div>
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <h2>${setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
        </div>
        <div class="v-info">
          <h3>Loss Voucher</h3>
          <p>Voucher No: ${vNo} | Date: ${m.date}</p>
        </div>
      </div>
      <div class="body">
        <div class="emp-grid">
          <div>
            <p><span class="label">Employee Name:</span> <strong>${m.employees?.name || 'N/A'}</strong></p>
            <p><span class="label">Designation:</span> ${m.employees?.role || 'N/A'}</p>
          </div>
          <div style="text-align: right;">
            <p><span class="label">Old Ticket No:</span> ${m.old_ticket_no || 'N/A'}</p>
            <p><span class="label">New Ticket No:</span> ${m.new_ticket_no || 'N/A'}</p>
          </div>
        </div>
        <div class="loss-box">
          <h3>Total Loss Amount</h3>
          <div class="amount">${(m.loss_amount || 0).toFixed(2)} SAR</div>
        </div>
        <p style="margin-top: 15px; font-size: 14px; color: #334155;">
          <strong>Deduction Status:</strong> ${m.paid_by_employee ? 'Amount will be deducted from employee salary.' : 'Amount absorbed by company.'}
        </p>
      </div>
      <div class="footer">
        <p>This is a computer-generated voucher and does not require a physical signature.</p>
        <p>© ${new Date().getFullYear()} ${setting.company_name_en || 'SUEUD AL TAAYIRA'}</p>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// CONTRACT / OFFER TEMPLATE (PREMIUM FIXED WITH AI TERMS)
// ==========================================
const getContractHTML = (s, name, date, isOffer, type, markup, terms) => {
  const setting = s || {};
  const docType = isOffer ? 'OFFER' : 'CONTRACT';
  const title = isOffer ? `Corporate Offer - ${name}` : `Corporate Contract - ${name}`;
  const termsList = terms ? terms.split('\n').filter(t => t.trim()).map(t => `<li style="margin-bottom:10px; font-size:15px; color:#334155;">${t.trim()}</li>`).join('') : '<li style="margin-bottom:10px; font-size:15px; color:#334155;">Standard terms and conditions apply.</li>';
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; background: #f0f4f8; padding: 30px; color: #1e293b; }
      .doc { max-width: 850px; margin: auto; background: #fff; box-shadow: 0 20px 60px rgba(0,0,0,0.1); padding: 60px; border-radius: 16px; border-top: 10px solid #1E3A8A; }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
      .header h1 { font-size: 32px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 1px; }
      .header .logo-box { text-align: right; }
      .header .logo-box h2 { font-size: 20px; font-weight: 800; color: #1E3A8A; }
      .header .logo-box p { font-size: 12px; color: #64748b; margin-top: 5px; }
      .meta-box { background: #F8FAFC; padding: 20px; border-radius: 12px; border-left: 5px solid #FBBF24; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
      .meta-item p { font-size: 14px; margin: 5px 0; }
      .meta-item .label { color: #64748b; font-weight: 500; display: block; font-size: 12px; text-transform: uppercase; }
      .meta-item .value { color: #0F172A; font-weight: 700; font-size: 16px; }
      .section { margin-bottom: 40px; }
      .section h2 { font-size: 22px; font-weight: 700; color: #1E3A8A; margin-bottom: 15px; border-left: 4px solid #1E3A8A; padding-left: 10px; }
      .terms-box ul { padding-left: 25px; list-style-type: square; }
      .sign-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 60px; }
      .sign-box { text-align: center; }
      .sign-line { border-top: 2px solid #0F172A; margin-bottom: 10px; width: 80%; margin-left: auto; margin-right: auto; }
      .sign-box p { font-size: 14px; color: #64748b; font-weight: 600; }
      .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
      @media print { body { background: #fff; padding: 0; } .doc { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; border: none; } }
    </style>
  </head>
  <body>
    <div class="doc">
      <div class="header">
        <div>
          <h1>${docType}</h1>
          <p style="font-size: 14px; color: #64748b; margin-top: 5px;">Date: ${date}</p>
        </div>
        <div class="logo-box">
          <h2>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h2>
          <p>${setting.company_name_ar || 'صعود الطائرة'}</p>
          <p>${setting.phone || ''}</p>
        </div>
      </div>
      <div class="meta-box">
        <div class="meta-item">
          <span class="label">Client / Corporate Name</span>
          <span class="value">${name}</span>
        </div>
        <div class="meta-item">
          <span class="label">Service Type</span>
          <span class="value">${type}</span>
        </div>
        <div class="meta-item">
          <span class="label">Service Fee / Markup</span>
          <span class="value">${parseFloat(markup || 0).toFixed(2)} SAR</span>
        </div>
        <div class="meta-item">
          <span class="label">Document Validity</span>
          <span class="value">30 Days from Issue Date</span>
        </div>
      </div>
      <div class="section">
        <h2>Terms & Conditions</h2>
        <div class="terms-box">
          <ul>${termsList}</ul>
        </div>
      </div>
      <div class="sign-grid">
        <div class="sign-box">
          <div class="sign-line"></div>
          <p>Authorized Signatory</p>
          <p style="font-size: 12px; color: #94a3b8;">${setting.company_name_en || 'SUEUD AL TAAYIRA'}</p>
        </div>
        <div class="sign-box">
          <div class="sign-line"></div>
          <p>Client Acceptance</p>
          <p style="font-size: 12px; color: #94a3b8;">${name}</p>
        </div>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} ${setting.company_name_en || 'SUEUD AL TAAYIRA'}. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;
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
  const [toast, showToast] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hello! How can I assist you today?' }]);
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
  const [empForm, setEmpForm] = useState({ name: '', role: 'Sales', salary: 0, phone: '', commission_rate: 0, iqama_no: '', iqama_expiry: '' });
  const [editEmpId, setEditEmpId] = useState(null);
  const [srvForm, setSrvForm] = useState({ name: '' });
  const [editSrvId, setEditSrvId] = useState(null);
  
  const [portalForm, setPortalForm] = useState({ name: '', balance: 0 });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, desc: '', mode: 'Cash', reason: 'Other', otherReason: '' });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: 0, date: today });
  
  const [setForm, setSetForm] = useState({ company_name_en: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '', license_no: '', tourist_license_no: '', invoice_footer: '', logo_url: '', custom_fields: [] });
  const [userForm, setUserForm] = useState({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false });
  const [editUserId, setEditUserId] = useState(null);
  const [tenantForm, setTenantForm] = useState({ agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '', phone: '', address: '' });
  
  const [passForm, setPassForm] = useState({ newPass: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '', creditBalance: 0 });
  
  const [repDate, setRepDate] = useState({ from: today, to: today });
  const [reportTab, setReportTab] = useState('sales');
  const [statementTab, setStatementTab] = useState('sales');
  const [ledgerCustId, setLedgerCustId] = useState('');
  const [ledgerEmpId, setLedgerEmpId] = useState('');
  
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState(0);
  const [contractTerms, setContractTerms] = useState('');

  const tr = {
    dashboard: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', create: lang === 'ar' ? 'إنشاء فاتورة' : 'Create Invoice', list: lang === 'ar' ? 'الفواتير' : 'Invoices', refunds: lang === 'ar' ? 'الاسترجاعات' : 'Refunds', customers: lang === 'ar' ? 'العملاء' : 'Customers', corporates: lang === 'ar' ? 'الشركات' : 'Corporates', creditors: lang === 'ar' ? 'الدائنون' : 'Creditors', credit: lang === 'ar' ? 'أرصدة الائتمان' : 'Credit Balances', vendors: lang === 'ar' ? 'الموردون' : 'Vendors', packages: lang === 'ar' ? 'الباقات' : 'Packages', branches: lang === 'ar' ? 'الفروع' : 'Branches', portals: lang === 'ar' ? 'البوابات' : 'Portals', bank: lang === 'ar' ? 'البنك والصندوق' : 'Bank & Cash', invest: lang === 'ar' ? 'المستثمرون' : 'Investors', hr: lang === 'ar' ? 'الموارد البشرية' : 'Human Resources', users: lang === 'ar' ? 'المستخدمون' : 'Users', settings: lang === 'ar' ? 'الإعدادات' : 'Settings', reports: lang === 'ar' ? 'التقارير' : 'Reports', audit: lang === 'ar' ? 'سجل التدقيق' : 'Audit Logs', statements: lang === 'ar' ? 'الكشوف' : 'Statements', contract: lang === 'ar' ? 'العقود' : 'Contracts', offer: lang === 'ar' ? 'العروض' : 'Offers', superadmin: lang === 'ar' ? 'المدير العام' : 'SuperAdmin', profile: lang === 'ar' ? 'الملف الشخصي' : 'Profile', profitability: lang === 'ar' ? 'الربحية' : 'Profitability', search: lang === 'ar' ? 'بحث...' : 'Search...', download_excel: lang === 'ar' ? 'تصدير إكسل' : 'Export Excel', logout: lang === 'ar' ? 'تسجيل الخروج' : 'Logout', changePass: lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password', changePassword: lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password', newPassword: lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password', settlePayment: lang === 'ar' ? 'تسوية الدفعة' : 'Settle Payment', processRefund: lang === 'ar' ? 'معالجة الاسترجاع' : 'Process Refund', close: lang === 'ar' ? 'إغلاق' : 'Close', cancel: lang === 'ar' ? 'إلغاء' : 'Cancel', save: lang === 'ar' ? 'حفظ' : 'Save', edit: lang === 'ar' ? 'تعديل' : 'Edit', delete: lang === 'ar' ? 'حذف' : 'Delete', preview: lang === 'ar' ? 'معاينة' : 'Preview', print: lang === 'ar' ? 'طباعة' : 'Print', refund: lang === 'ar' ? 'استرجاع' : 'Refund', quickSettle: lang === 'ar' ? 'تسوية سريعة' : 'Quick Settle', actions: lang === 'ar' ? 'إجراءات' : 'Actions', method: lang === 'ar' ? 'الطريقة' : 'Method', due: lang === 'ar' ? 'المتبقي' : 'Due', total: lang === 'ar' ? 'الإجمالي' : 'Total', invNo: lang === 'ar' ? 'رقم الفاتورة' : 'Inv No', generateInvoice: lang === 'ar' ? 'إنشاء الفاتورة' : 'Generate Invoice', updateInvoice: lang === 'ar' ? 'تحديث الفاتورة' : 'Update Invoice', editInvoice: lang === 'ar' ? 'تعديل الفاتورة' : 'Edit Invoice', custType: lang === 'ar' ? 'نوع العميل' : 'Customer Type', individual: lang === 'ar' ? 'فرد' : 'Individual', corporate: lang === 'ar' ? 'شركة' : 'Corporate', selectCustomer: lang === 'ar' ? 'اختر العميل' : 'Select Customer', newCustomer: lang === 'ar' ? 'عميل جديد' : 'New Customer', customerName: lang === 'ar' ? 'اسم العميل' : 'Customer Name', customerPhone: lang === 'ar' ? 'هاتف العميل' : 'Customer Phone', passengers: lang === 'ar' ? 'الركاب' : 'Passengers', addPassenger: lang === 'ar' ? '+ إضافة راكب' : '+ Add Passenger', portal: lang === 'ar' ? 'البوابة' : 'Portal', service: lang === 'ar' ? 'الخدمة' : 'Service', flightTicket: lang === 'ar' ? 'تذكرة طيران' : 'Flight Ticket', hotel: lang === 'ar' ? 'فندق' : 'Hotel', tourPackage: lang === 'ar' ? 'باقة سياحية' : 'Tour Package', visitVisa: lang === 'ar' ? 'تأشيرة زيارة' : 'Visit Visa', umrahVisa: lang === 'ar' ? 'تأشيرة عمرة' : 'Umrah Visa', newService: lang === 'ar' ? 'خدمة جديدة' : 'New Service', flightType: lang === 'ar' ? 'نوع الرحلة' : 'Flight Type', domestic: lang === 'ar' ? 'داخلية' : 'Domestic', international: lang === 'ar' ? 'دولية' : 'International', airline: lang === 'ar' ? 'خط الطيران' : 'Airline', sector: lang === 'ar' ? 'القطاع' : 'Sector', pnr: lang === 'ar' ? 'رقم الحجز' : 'PNR', ticketNo: lang === 'ar' ? 'رقم التذكرة' : 'Ticket No', qty: lang === 'ar' ? 'الكمية' : 'Qty', cost: lang === 'ar' ? 'التكلفة' : 'Cost', sell: lang === 'ar' ? 'البيع' : 'Sell', discount: lang === 'ar' ? 'الخصم' : 'Discount', vatRate: lang === 'ar' ? 'نسبة الضريبة' : 'VAT Rate', invoiceDate: lang === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date', journeyType: lang === 'ar' ? 'نوع الرحلة' : 'Journey Type', single: lang === 'ar' ? 'ذهاب' : 'Single', roundTrip: lang === 'ar' ? 'ذهاب وعودة' : 'Round Trip', multiCity: lang === 'ar' ? 'مدن متعددة' : 'Multi-city', fareType: lang === 'ar' ? 'نوع الأجرة' : 'Fare Type', refundable: lang === 'ar' ? 'قابلة للاسترداد' : 'Refundable', nonRefundable: lang === 'ar' ? 'غير قابلة للاسترداد' : 'Non-Refundable', bookingType: lang === 'ar' ? 'نوع الحجز' : 'Booking Type', newBooking: lang === 'ar' ? 'حجز جديد' : 'New Booking', reissue: lang === 'ar' ? 'إعادة إصدار' : 'Reissue', extraLuggage: lang === 'ar' ? 'أمتعة إضافية' : 'Extra Luggage', previousBooking: lang === 'ar' ? 'حجز سابق' : 'Previous Booking', salesPerson: lang === 'ar' ? 'موظف المبيعات' : 'Sales Person', paymentMethod: lang === 'ar' ? 'طريقة الدفع' : 'Payment Method', cash: lang === 'ar' ? 'نقداً' : 'Cash', bankTransfer: lang === 'ar' ? 'تحويل بنكي' : 'Bank Transfer', card: lang === 'ar' ? 'بطاقة / شبكة' : 'Card / Network', credit: lang === 'ar' ? 'آجل' : 'Credit', creditBalance: lang === 'ar' ? 'رصيد ائتماني' : 'Credit Balance', tabby: lang === 'ar' ? 'تابي' : 'Tabby', tamara: lang === 'ar' ? 'تمارا' : 'Tamara', paidAmount: lang === 'ar' ? 'المبلغ المدفوع' : 'Paid Amount', useCreditAmount: lang === 'ar' ? 'استخدام مبلغ الرصيد' : 'Use Credit Amount', notifications: lang === 'ar' ? 'الإشعارات' : 'Notifications', ai_dashboard: lang === 'ar' ? 'لوحة الذكاء الاصطناعي' : 'AI Dashboard', hr_advanced: lang === 'ar' ? 'الموارد البشرية والرواتب' : 'HR & Payroll', staff_mistakes: lang === 'ar' ? 'أخطاء الموظفين' : 'Staff Mistakes', customer_statement: lang === 'ar' ? 'كشف العميل' : 'Cust Statement', recurring_invoices: lang === 'ar' ? 'الفواتير المتكررة' : 'Recurring Invoices', expense_approval: lang === 'ar' ? 'موافقة المصروفات' : 'Expense Approval', refund_statement: lang === 'ar' ? 'كشف الاسترجاعات' : 'Refund Statement', credit_limits: lang === 'ar' ? 'حدود الائتمان' : 'Credit Limits', supplier_statement: lang === 'ar' ? 'كشف الموردين' : 'Supplier Statement', multi_branch: lang === 'ar' ? 'متعدد الفروع' : 'Multi-Branch', target: lang === 'ar' ? 'الهدف' : 'Target', achieved: lang === 'ar' ? 'المحقق' : 'Achieved', percentage: lang === 'ar' ? 'النسبة' : 'Percentage', checkInTime: lang === 'ar' ? 'الحضور' : 'Check-In', checkOutTime: lang === 'ar' ? 'الانصراف' : 'Check-Out', overtime: lang === 'ar' ? 'العمل الإضافي' : 'Overtime', deduction: lang === 'ar' ? 'الخصم' : 'Deduction', status: lang === 'ar' ? 'الحالة' : 'Status', present: lang === 'ar' ? 'حاضر' : 'Present', leave: lang === 'ar' ? 'إجازة' : 'Leave', absent: lang === 'ar' ? 'غائب' : 'Absent', paySalary: lang === 'ar' ? 'صرف الراتب' : 'Pay Salary', generateSlip: lang === 'ar' ? 'إنشاء قسيمة راتب' : 'Generate Salary Slip', attendanceDate: lang === 'ar' ? 'التاريخ' : 'Date', baseSalary: lang === 'ar' ? 'الراتب الأساسي' : 'Base Salary', commission: lang === 'ar' ? 'العمولة' : 'Commission', advDed: lang === 'ar' ? 'خصم السلفة' : 'Adv. Deduct', gift: lang === 'ar' ? 'مكافأة' : 'Gift', month: lang === 'ar' ? 'الشهر' : 'Month', mode: lang === 'ar' ? 'الطريقة' : 'Mode', mark: lang === 'ar' ? 'تسجيل' : 'Mark', logLoss: lang === 'ar' ? 'تسجيل خسارة' : 'Log Loss', quotations: lang === 'ar' ? 'عروض الأسعار' : 'Quotations'
  };

  const logAction = async (action) => {
    if (!user) return;
    try { await supabase.from('audits').insert([{ user_email: user.email, action, tenant_id: userProfile?.tenant_id }]); } catch (err) { console.error('Audit log error:', err.message); }
  };

  const fetchAll = useCallback(async () => {
    if (!user) return;
    try {
      const { data: profile } = await supabase.from('app_users').select('*').eq('id', user.id).single();
      setUserProfile(profile);
      if (profile) {
        const tenantId = profile.tenant_id;
        const tables = ['invoices', 'customers', 'corporates', 'creditors', 'vendors', 'packages', 'branches', 'portals', 'employees', 'services', 'expenses', 'investments', 'cashbook', 'payroll', 'emp_advances', 'staff_mistakes', 'attendance', 'app_users', 'audits'];
        const queries = tables.map(t => supabase.from(t).select('*').eq('tenant_id', tenantId));
        const results = await Promise.all(queries);
        const newData = { ...data };
        tables.forEach((t, i) => newData[t] = results[i].data || []);
        
        const { data: tenantsData } = profile.role === 'SuperAdmin' ? await supabase.from('tenants').select('*') : { data: [] };
        newData.tenants = tenantsData || [];
        
        const { data: settingsData } = await supabase.from('settings').select('*').eq('tenant_id', tenantId).maybeSingle();
        newData.settings = settingsData || {};
        
        setData(newData);
      }
    } catch (err) { console.error('Fetch error:', err.message); }
  }, [user]);

  const filterData = (arr, dateKey) => {
    if (!repDate || !repDate.from || !repDate.to) return arr;
    return arr.filter(item => item[dateKey] >= repDate.from && item[dateKey] <= repDate.to);
  };

  useEffect(() => {
    let authListener;
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUser(session.user);
      const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
        setUser(sess?.user || null);
        if (!sess) router.push('/login');
      });
      authListener = listener;
    };
    getSession();
    return () => { if (authListener) authListener.subscription.unsubscribe(); };
  }, [router]);

  useEffect(() => { if (user) fetchAll(); }, [user]);

  return {
    user, userProfile, data, setData, lang, setLang, page, setPage, modal, setModal, toast, showToast, fetchAll, logAction, today, router, tr,
    chatOpen, setChatOpen, chatMessages, setChatMessages, chatInput, setChatInput,
    search, setSearch, tblPage, setTblPage, payFilter, setPayFilter, previewHTML, setPreviewHTML,
    invForm, setInvForm, editInvId, setEditInvId, expForm, setExpForm, editExpId, setEditExpId,
    custForm, setCustForm, editCustId, setEditCustId, corpForm, setCorpForm, editCorpId, setEditCorpId, creditorForm, setCreditorForm, editCredId, setEditCredId,
    vendorForm, setVendorForm, editVendId, setEditVendId, pkgForm, setPkgForm, editPkgId, setEditPkgId, brnForm, setBrnForm, editBrnId, setEditBrnId,
    empForm, setEmpForm, editEmpId, setEditEmpId, srvForm, setSrvForm, editSrvId, setEditSrvId,
    portalForm, setPortalForm, investForm, setInvestForm, transferForm, setTransferForm, setForm, setSetForm, userForm, setUserForm, editUserId, setEditUserId,
    tenantForm, setTenantForm, profileForm, setProfileForm, passForm, setPassForm, settleForm, setSettleForm, refundForm, setRefundForm,
    repDate, setRepDate, reportTab, setReportTab, statementTab, setStatementTab, ledgerCustId, setLedgerCustId, ledgerEmpId, setLedgerEmpId,
    contractCorpName, setContractCorpName, contractType, setContractType, contractMarkup, setContractMarkup, contractTerms, setContractTerms,
    filterData,
    getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getMistakeHTML, getContractHTML
  };
}
