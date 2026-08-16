'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ==========================================
// PREMIUM HIGH-TECH INVOICE TEMPLATE
// ==========================================
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trackUrl)}`;
  
  const totalSell = inv.total_sell || 0; // New Booking Price
  const discount = inv.discount || 0;
  const subTotal = totalSell + discount;
  const vatRate = inv.vat > 0 && totalSell > 0 ? Math.round((inv.vat / totalSell) * 100) : 0;
  const vat = inv.vat || 0;
  const total = inv.total || 0;
  const paidAmount = inv.paid_amount || 0;
  const usedCredit = inv.used_credit || 0; // Customer Refund used
  const cashPaid = paidAmount - usedCredit;
  const dueAmount = inv.due_amount || 0;
  const unitPrice = (inv.qty || 1) > 0 ? totalSell / inv.qty : totalSell;
  
  let paymentDisplay = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit' && inv.credit_due_date) paymentDisplay = `Credit (Due: ${inv.credit_due_date})`;

  const isReissue = inv.booking_type === 'Reissue' || inv.booking_type === 'Previous Booking';

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
      body { font-family: 'Inter', 'Cairo', sans-serif; background: #f0f4f8; margin: 0; padding: 30px; color: #1e293b; }
      .invoice-box { max-width: 900px; margin: auto; background: #fff; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-radius: 16px; }
      
      /* HEADER FIX: No overlapping, clean spacing */
      .header { display: flex; justify-content: space-between; align-items: stretch; padding: 40px; background: linear-gradient(135deg, #0c1d3a 0%, #1a365d 100%); color: #fff; gap: 40px; }
      .company-block { display: flex; gap: 20px; flex: 1; }
      .logo-box { width: 100px; height: 100px; object-fit: cover; border-radius: 12px; background: rgba(255,255,255,0.1); padding: 5px; flex-shrink: 0; }
      .company-text h2 { font-size: 24px; font-weight: 800; color: #fbbf24; }
      .company-text h1 { font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
      .company-text p { font-size: 12px; color: rgba(255,255,255,0.7); line-height: 1.8; margin-top: 8px; }
      
      .invoice-meta { min-width: 280px; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; justify-content: center; }
      .invoice-meta h3 { font-size: 32px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; line-height: 1.2; }
      .invoice-meta h3 span { font-size: 18px; font-family: 'Cairo'; display: block; margin-top: 5px; }
      .meta-row { display: flex; justify-content: space-between; margin-top: 10px; font-size: 14px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 5px; }
      .meta-row .lbl { color: rgba(255,255,255,0.6); }
      .meta-row .val { color: #fbbf24; font-weight: 700; }
      .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 15px; align-self: flex-start; ${dueAmount > 0 ? 'background: rgba(251,191,36,0.2); color: #fbbf24;' : 'background: rgba(52,211,153,0.2); color: #34d399;'} }
      
      .body { padding: 40px; }
      .bilingual-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; display: flex; justify-content: space-between; }
      
      .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
      .info-block { padding: 20px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #1a365d; }
      .info-row { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
      .info-row:last-child { border: none; }
      .info-row .label { color: #64748b; }
      .info-row .value { color: #0f172a; font-weight: 600; text-align: right; }
      
      /* REISSUE BLOCK HIGH-TECH */
      .reissue-block { padding: 25px; background: #fffbeb; border-radius: 12px; border: 1px solid #fde68a; margin-bottom: 30px; }
      .reissue-title { font-size: 16px; font-weight: 700; color: #d97706; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; background: #fef3c7; padding: 10px 15px; border-radius: 8px; }
      .reissue-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
      .reissue-item { background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #fde68a; text-align: center; }
      .reissue-item .lbl { font-size: 11px; color: #92400e; font-weight: 600; text-transform: uppercase; }
      .reissue-item .val { font-size: 16px; color: #78350f; font-weight: 700; margin-top: 5px; }
      .reissue-credit { background: #dcfce7; border-color: #86efac; grid-column: span 3; display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; }
      .reissue-credit .lbl { color: #059669; font-size: 14px; }
      .reissue-credit .val { color: #047857; font-size: 20px; font-weight: 800; }
      
      table { width: 100%; border-collapse: collapse; margin-bottom: 30px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
      thead th { padding: 15px; background: #0c1d3a; color: #fbbf24; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; text-align: left; }
      thead th.right { text-align: right; }
      thead th.center { text-align: center; }
      tbody td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; background: #fff; }
      tbody td.right { text-align: right; font-weight: 600; }
      tbody td.center { text-align: center; }
      
      .bottom-section { display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; }
      .payment-breakdown { padding: 25px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; border: 1px solid #e2e8f0; }
      .pay-row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; }
      .pay-row:last-child { border: none; }
      .pay-row span { color: #334155; }
      
      .totals-box { background: #0c1d3a; border-radius: 16px; padding: 25px; color: #fff; align-self: flex-start; }
      .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: rgba(255,255,255,0.8); }
      .grand-total { display: flex; justify-content: space-between; padding: 15px 0 0; margin-top: 10px; border-top: 2px solid rgba(255,255,255,0.1); font-size: 22px; font-weight: 800; color: #fff; }
      .grand-total .val { color: #fbbf24; }
      
      .footer { padding: 30px 40px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; gap: 30px; }
      .qr-code img { height: 100px; width: 100px; border-radius: 8px; border: 1px solid #e2e8f0; padding: 5px; background: #fff; }
      .footer-text { text-align: center; flex: 1; }
      .ai-msg { font-size: 14px; color: #475569; font-weight: 600; margin-bottom: 5px; }
      .ai-msg-ar { font-size: 14px; color: #64748b; font-family: 'Cairo'; }
      
      @media print { body { background: #fff; padding: 0; } .invoice-box { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; } }
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
              ${setting.address_ar || 'العنوان / Address'}<br/>
              ضريبة / VAT: ${setting.vat_no || 'N/A'} | سجل / CR: ${setting.cr_no || 'N/A'}<br/>
              ترخيص / Lic: ${setting.license_no || 'N/A'} | سياحي / Tourist: ${setting.tourist_license_no || 'N/A'}<br/>
              هاتف / Phone: ${setting.phone || 'N/A'}
            </p>
          </div>
        </div>
        <div class="invoice-meta">
          <h3>TAX INVOICE<span>فاتورة ضريبية</span></h3>
          <div class="meta-row"><span class="lbl">رقم / Inv No</span><span class="val">${invoiceNo}</span></div>
          <div class="meta-row"><span class="lbl">تاريخ / Date</span><span class="val">${inv.invoice_date || ''}</span></div>
          <div class="status-badge">${dueAmount > 0 ? 'غير مدفوعة / UNPAID' : 'مدفوعة / PAID'}</div>
        </div>
      </div>
      
      <div class="body">
        <div class="details-grid">
          <div class="info-block">
            <div class="bilingual-title"><span>BILL TO / فاتورة إلى</span></div>
            <div class="info-row"><span class="label">الاسم / Name</span><span class="value">${inv.customers?.name || inv.corporates?.name || 'N/A'}</span></div>
            <div class="info-row"><span class="label">الهاتف / Phone</span><span class="value">${inv.customers?.phone || 'N/A'}</span></div>
            <div class="info-row"><span class="label">الموظف / Sales Person</span><span class="value">${inv.employees?.name || 'N/A'}</span></div>
          </div>
          <div class="info-block" style="border-left-color: #f59e0b;">
            <div class="bilingual-title"><span>FLIGHT DETAILS / تفاصيل الرحلة</span></div>
            <div class="info-row"><span class="label">خط الطيران / Airline</span><span class="value">${inv.airline || 'N/A'}</span></div>
            <div class="info-row"><span class="label">القطاع / Sector</span><span class="value">${inv.flight_sector || 'N/A'}</span></div>
            <div class="info-row"><span class="label">رقم الحجز / PNR</span><span class="value">${inv.pnr || 'N/A'}</span></div>
            <div class="info-row"><span class="label">التذكرة / Ticket No</span><span class="value">${inv.ticket_no || 'N/A'}</span></div>
          </div>
        </div>
        
        ${isReissue ? `
        <div class="reissue-block">
          <div class="reissue-title"><span>⚠️ PREVIOUS BOOKING & REFUND DETAILS</span><span>تفاصيل الحجز السابق والاسترجاع</span></div>
          <div class="reissue-grid">
            <div class="reissue-item"><div class="lbl">الخطوط القديمة / Original Airline</div><div class="val">${inv.old_airline || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">القطاع القديم / Original Sector</div><div class="val">${inv.old_sector || 'N/A'}</div></div>
            <div class="reissue-item"><div class="lbl">التذكرة القديمة / Original Ticket No</div><div class="val">${inv.old_ticket_no || 'N/A'}</div></div>
            <div class="reissue-item reissue-credit">
              <div class="lbl">سعر البيع الأصلي / Original Selling Price</div>
              <div class="val">${parseFloat(inv.old_sell_price || 0).toFixed(2)} SAR</div>
            </div>
            <div class="reissue-item reissue-credit" style="background: #fee2e2; border-color: #fecaca; grid-column: span 1;">
              <div class="lbl" style="color: #dc2626;">استرجاع العميل / Customer Refund</div>
              <div class="val" style="color: #b91c1c;">- ${usedCredit.toFixed(2)} SAR</div>
            </div>
            <div class="reissue-item reissue-credit" style="background: #eff6ff; border-color: #bfdbfe; grid-column: span 1;">
              <div class="lbl" style="color: #2563eb;">صافي الخصم / Net Credit Applied</div>
              <div class="val" style="color: #1d4ed8;">- ${usedCredit.toFixed(2)} SAR</div>
            </div>
          </div>
        </div>` : ''}
        
        <table>
          <thead>
            <tr>
              <th>الوصف / Description</th>
              <th class="center">الكمية / Qty</th>
              <th class="right">سعر الوحدة / Unit Price</th>
              <th class="right">الإجمالي / Total</th>
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
            <div class="pay-row"><span>سعر الحجز الجديد / New Booking Price</span><span style="font-weight:600;">${total.toFixed(2)} SAR</span></div>
            ${usedCredit > 0 ? `<div class="pay-row" style="color:#7c3aed;"><span>خصم الرصيد / Less: Refund Credit Applied</span><span style="font-weight:600;">- ${usedCredit.toFixed(2)} SAR</span></div>` : ''}
            <div class="pay-row" style="border-top:2px solid #cbd5e1; margin-top:5px; padding-top:10px; font-weight:700;"><span>المدفوع / Balance Paid (${paymentDisplay})</span><span style="color:#059669;">${cashPaid.toFixed(2)} SAR</span></div>
            <div class="pay-row" style="font-weight:700;"><span>المتبقي / Amount Due</span><span style="color:${dueAmount > 0 ? '#ef4444' : '#059669'};">${dueAmount.toFixed(2)} SAR</span></div>
          </div>
          
          <div class="totals-box">
            <div class="total-row"><span>الإجمالي قبل الخصم / Subtotal</span><span>${subTotal.toFixed(2)}</span></div>
            ${discount > 0 ? `<div class="total-row" style="color:#34d399;"><span>الخصم / Discount</span><span>- ${discount.toFixed(2)}</span></div>` : ''}
            <div class="total-row"><span>الضريبة (${vatRate}%) / VAT</span><span>${vat.toFixed(2)}</span></div>
            <div class="grand-total"><span>الإجمالي / GRAND TOTAL</span><span class="val">${total.toFixed(2)} SAR</span></div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <div class="qr-code">
          <img src="${qrCodeUrl}" alt="Scan to Download" crossorigin="anonymous" />
          <p style="font-size: 10px; text-align: center; color: #94A3B8; margin-top: 5px;">امسح / Scan</p>
        </div>
        <div class="footer-text">
          <p class="ai-msg">Thank you for choosing us! We look forward to serving you again.</p>
          <p class="ai-msg-ar">شكراً لاختياركم إيانا. نتطلع لخدمتكم مرة أخرى.</p>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 10px;">${setting.company_name_en || ''} | ${setting.phone || ''}</p>
        </div>
        <div style="width: 110px;"></div>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// PREMIUM CUSTOMER-FACING REFUND INVOICE TEMPLATE
// ==========================================
const getRefundHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;
  const custRefund = inv.refund_customer || 0;
  
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
      body { font-family: 'Inter', 'Cairo', sans-serif; background: #f0f4f8; margin: 0; padding: 30px; color: #1e293b; }
      .invoice-box { max-width: 850px; margin: auto; background: #fff; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-radius: 16px; }
      .header { display: flex; justify-content: space-between; align-items: stretch; padding: 35px 40px; background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); color: #fff; gap: 30px; }
      .company-block { display: flex; gap: 15px; flex: 1; }
      .logo-box { width: 80px; height: 80px; object-fit: cover; border-radius: 10px; background: rgba(255,255,255,0.1); padding: 5px; flex-shrink: 0; }
      .company-text h2 { font-size: 22px; font-weight: 800; color: #fbbf24; }
      .company-text h1 { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
      .company-text p { font-size: 11px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-top: 10px; }
      .invoice-meta { min-width: 220px; text-align: right; display: flex; flex-direction: column; justify-content: center; }
      .invoice-meta h3 { font-size: 32px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; }
      .invoice-meta h3 span { font-size: 18px; font-family: 'Cairo'; display: block; margin-top: 5px; }
      .inv-no { font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 8px; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 5px; }
      .inv-no span { color: #fbbf24; font-weight: 700; }
      .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 12px; background: rgba(251,191,36,0.2); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); align-self: flex-end; }
      .body { padding: 35px 40px; }
      .info-block { padding: 20px; background: #fff5f5; border-radius: 12px; border-left: 4px solid #dc2626; margin-bottom: 20px; }
      .info-block h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #dc2626; margin-bottom: 15px; font-weight: 700; }
      .row { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; border-bottom: 1px solid #fee2e2; }
      .row:last-child { border: none; }
      .row .label { color: #991b1b; font-weight: 500; }
      .row .value { color: #7f1d1d; font-weight: 600; text-align: right; }
      .refund-card { padding: 40px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 16px; text-align: center; border: 1px solid #bbf7d0; margin-bottom: 20px; box-shadow: 0 10px 15px rgba(5, 150, 105, 0.1); }
      .refund-card h5 { font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: #059669; margin-bottom: 15px; }
      .refund-card .amount { font-size: 42px; font-weight: 800; color: #047857; }
      .payment-info { padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
      .pay-row { font-size: 14px; font-weight: 600; color: #334155; }
      .footer { padding: 25px 40px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; gap: 20px; }
      .qr-code img { height: 80px; width: 80px; border-radius: 6px; border: 1px solid #e2e8f0; padding: 3px; background: #fff; }
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
            <p>${setting.address_ar || ''}<br/>ضريبة / VAT: ${setting.vat_no || 'N/A'} | سجل / CR: ${setting.cr_no || 'N/A'}</p>
          </div>
        </div>
        <div class="invoice-meta">
          <h3>REFUND<span>استرجاع</span></h3>
          <div class="inv-no">رقم / Refund No: <span>${invoiceNo}</span></div>
          <div class="inv-no">تاريخ / Date: <span>${inv.refund_date || inv.invoice_date || ''}</span></div>
          <div class="status-badge">تم الاسترجاع / PROCESSED</div>
        </div>
      </div>
      <div class="body">
        <div class="info-block">
          <h4>BOOKING DETAILS / تفاصيل الحجز</h4>
          <div class="row"><span class="label">اسم العميل / Customer Name</span><span class="value">${inv.customers?.name || 'N/A'}</span></div>
          <div class="row"><span class="label">الهاتف / Contact</span><span class="value">${inv.customers?.phone || 'N/A'}</span></div>
          <div class="row"><span class="label">خط الطيران / Airline</span><span class="value">${inv.airline || 'N/A'}</span></div>
          <div class="row"><span class="label">تاريخ الحجز / Date of Booking</span><span class="value">${inv.invoice_date || 'N/A'}</span></div>
          <div class="row"><span class="label">رقم الحجز / PNR</span><span class="value">${inv.pnr || 'N/A'}</span></div>
        </div>
        
        <div class="refund-card">
          <h5>REFUND AMOUNT TO CUSTOMER / المبلغ المسترجع للعميل</h5>
          <div class="amount">${custRefund.toFixed(2)} SAR</div>
        </div>
        
        <div class="payment-info">
          <span class="pay-row">طريقة الاسترجاع / Refund Method</span>
          <span style="font-weight:600; color:#2563eb;">${refundMethodDisplay}</span>
        </div>
      </div>
      <div class="footer">
        <div class="qr-code"><img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous"></div>
        <div style="text-align: center; flex: 1;">
          <strong>${setting.company_name_en || ''}</strong>
          <p style="font-size: 11px; color: #94a3b8;">Thank you! / شكراً!</p>
        </div>
        <div style="width: 86px;"></div>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// MAIN STATE HOOK (Unchanged Core Logic)
// ==========================================
export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [data, setData] = useState({ invoices: [], customers: [], corporates: [], creditors: [], vendors: [], packages: [], branches: [], portals: [], employees: [], services: [], expenses: [], investments: [], cashbook: [], payroll: [], empAdvances: [], staffMistakes: [], appUsers: [], tenants: [], audits: [], settings: {} });
  
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

  const [invForm, setInvForm] = useState({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '', oldSellPrice: 0, oldBookingDate: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '', status: 'Unpaid' });
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
        const tables = ['invoices', 'customers', 'corporates', 'creditors', 'vendors', 'packages', 'branches', 'portals', 'employees', 'services', 'expenses', 'investments', 'cashbook', 'payroll', 'emp_advances', 'staff_mistakes', 'app_users', 'audits'];
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

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUser(session.user); fetchAll();
    };
    getSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user || null); if (!session) router.push('/login'); });
    return () => authListener.subscription.unsubscribe();
  }, []);

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
    getInvoiceHTML, getRefundHTML
  };
}
