'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ==========================================
// MASSIVE TRANSLATION ENGINE (EN/AR)
// ==========================================
const translations = {
  en: {
    dashboard: 'Dashboard', create: 'Create Invoice', list: 'Invoices', refunds: 'Refunds',
    customers: 'Customers', corporates: 'Corporates', creditors: 'Creditors', credit: 'Credit Balances',
    vendors: 'Vendors', packages: 'Packages', branches: 'Branches', portals: 'Portals', bank: 'Bank & Cash',
    invest: 'Investors', hr: 'Human Resources', users: 'Users', settings: 'Settings', reports: 'Reports',
    audit: 'Audit Logs', statements: 'Statements', contract: 'Contracts', offer: 'Offers',
    superadmin: 'SuperAdmin', profile: 'Profile', profitability: 'Profitability',
    search: 'Search...', download_excel: 'Export Excel', logout: 'Logout', changePass: 'Change Password',
    quotations: 'Quotations', ai_dashboard: 'AI Dashboard', hr_advanced: 'HR & Payroll', staff_mistakes: 'Staff Mistakes & Loss',
    custType: 'Customer Type', individual: 'Individual', corporate: 'Corporate', selectCustomer: 'Select Customer', newCustomer: 'New Customer',
    customerName: 'Customer Name', customerPhone: 'Customer Phone', passengers: 'Passengers', addPassenger: '+ Add Passenger',
    portal: 'Portal', service: 'Service', flightTicket: 'Flight Ticket', hotel: 'Hotel', tourPackage: 'Tour Package', visitVisa: 'Visit Visa', umrahVisa: 'Umrah Visa', newService: 'New Service',
    flightType: 'Flight Type', domestic: 'Domestic', international: 'International', airline: 'Airline', sector: 'Sector', pnr: 'PNR', ticketNo: 'Ticket No',
    hotelName: 'Hotel Name', checkIn: 'Check In', checkOut: 'Check Out', serviceName: 'Service Name', qty: 'Qty', cost: 'Cost', sell: 'Sell', discount: 'Discount',
    vatRate: 'VAT Rate', invoiceDate: 'Invoice Date', journeyType: 'Journey Type', single: 'Single', roundTrip: 'Round Trip', multiCity: 'Multi-city',
    fareType: 'Fare Type', refundable: 'Refundable', nonRefundable: 'Non-Refundable', bookingType: 'Booking Type', newBooking: 'New Booking', reissue: 'Reissue', extraLuggage: 'Extra Luggage', previousBooking: 'Previous Booking',
    salesPerson: 'Sales Person', paymentMethod: 'Payment Method', cash: 'Cash', bankTransfer: 'Bank Transfer', card: 'Card / Network', credit: 'Credit', creditBalance: 'Credit Balance', tabby: 'Tabby', tamara: 'Tamara',
    paidAmount: 'Paid Amount (Cash/Bank)', useCreditAmount: 'Use Credit Amount', generateInvoice: 'Generate Invoice', updateInvoice: 'Update Invoice', editInvoice: 'Edit Invoice',
    invNo: 'Inv No', total: 'Total', due: 'Due', method: 'Method', actions: 'Actions', preview: 'Preview', print: 'Print', edit: 'Edit', delete: 'Delete', quickSettle: 'Quick Settle', refund: 'Refund',
    changePassword: 'Change Password', newPassword: 'New Password', settlePayment: 'Settle Payment', processRefund: 'Process Refund',
    companyRefund: 'Company Refund (Portal)', customerRefund: 'Customer Refund Amount', customerRefundMethod: 'Customer Refund Method',
    refundReason: 'Refund Reason', documentPreview: 'Document Preview', close: 'Close', cancel: 'Cancel', save: 'Save', mark: 'Mark', logLoss: 'Log Loss',
    notifications: 'Notifications', customer_statement: 'Cust Statement', recurring_invoices: 'Recurring Invoices', expense_approval: 'Expense Approval', refund_statement: 'Refund Statement', credit_limits: 'Credit Limits', supplier_statement: 'Supplier Statement', multi_branch: 'Multi-Branch'
  },
  ar: {
    dashboard: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'الفواتير', refunds: 'الاسترجاعات',
    customers: 'العملاء', corporates: 'الشركات', creditors: 'الدائنون', credit: 'أرصدة الائتمان',
    vendors: 'الموردون', packages: 'الباقات', branches: 'الفروع', portals: 'البوابات', bank: 'البنك والصندوق',
    invest: 'المستثمرون', hr: 'الموارد البشرية', users: 'المستخدمون', settings: 'الإعدادات', reports: 'التقارير',
    audit: 'سجل التدقيق', statements: 'الكشوف', contract: 'العقود', offer: 'العروض',
    superadmin: 'المدير العام', profile: 'الملف الشخصي', profitability: 'الربحية',
    search: 'بحث...', download_excel: 'تصدير إكسل', logout: 'تسجيل الخروج', changePass: 'تغيير كلمة المرور',
    quotations: 'عروض الأسعار', ai_dashboard: 'لوحة الذكاء الاصطناعي', hr_advanced: 'الموارد البشرية والرواتب', staff_mistakes: 'أخطاء الموظفين والخسائر',
    custType: 'نوع العميل', individual: 'فرد', corporate: 'شركة', selectCustomer: 'اختر العميل', newCustomer: 'عميل جديد',
    customerName: 'اسم العميل', customerPhone: 'هاتف العميل', passengers: 'الركاب', addPassenger: '+ إضافة راكب',
    portal: 'البوابة', service: 'الخدمة', flightTicket: 'تذكرة طيران', hotel: 'فندق', tourPackage: 'باقة سياحية', visitVisa: 'تأشيرة زيارة', umrahVisa: 'تأشيرة عمرة', newService: 'خدمة جديدة',
    flightType: 'نوع الرحلة', domestic: 'داخلية', international: 'دولية', airline: 'خط الطيران', sector: 'القطاع', pnr: 'رقم الحجز', ticketNo: 'رقم التذكرة',
    hotelName: 'اسم الفندق', checkIn: 'تاريخ الوصول', checkOut: 'تاريخ المغادرة', serviceName: 'اسم الخدمة', qty: 'الكمية', cost: 'التكلفة', sell: 'البيع', discount: 'الخصم',
    vatRate: 'نسبة الضريبة', invoiceDate: 'تاريخ الفاتورة', journeyType: 'نوع الرحلة', single: 'ذهاب', roundTrip: 'ذهاب وعودة', multiCity: 'مدن متعددة',
    fareType: 'نوع الأجرة', refundable: 'قابلة للاسترداد', nonRefundable: 'غير قابلة للاسترداد', bookingType: 'نوع الحجز', newBooking: 'حجز جديد', reissue: 'إعادة إصدار', extraLuggage: 'أمتعة إضافية', previousBooking: 'حجز سابق',
    salesPerson: 'موظف المبيعات', paymentMethod: 'طريقة الدفع', cash: 'نقداً', bankTransfer: 'تحويل بنكي', card: 'بطاقة / شبكة', credit: 'آجل', creditBalance: 'رصيد ائتماني', tabby: 'تابي', tamara: 'تمارا',
    paidAmount: 'المبلغ المدفوع (نقداً/بنك)', useCreditAmount: 'استخدام مبلغ الرصيد', generateInvoice: 'إنشاء الفاتورة', updateInvoice: 'تحديث الفاتورة', editInvoice: 'تعديل الفاتورة',
    invNo: 'رقم الفاتورة', total: 'الإجمالي', due: 'المتبقي', method: 'الطريقة', actions: 'إجراءات', preview: 'معاينة', print: 'طباعة', edit: 'تعديل', delete: 'حذف', quickSettle: 'تسوية سريعة', refund: 'استرجاع',
    changePassword: 'تغيير كلمة المرور', newPassword: 'كلمة المرور الجديدة', settlePayment: 'تسوية الدفعة', processRefund: 'معالجة الاسترجاع',
    companyRefund: 'استرجاع الشركة (البوابة)', customerRefund: 'مبلغ استرجاع العميل', customerRefundMethod: 'طريقة استرجاع العميل',
    refundReason: 'سبب الاسترجاع', documentPreview: 'معاينة المستند', close: 'إغلاق', cancel: 'إلغاء', save: 'حفظ', mark: 'تسجيل', logLoss: 'تسجيل خسارة',
    notifications: 'الإشعارات', customer_statement: 'كشف العميل', recurring_invoices: 'الفواتير المتكررة', expense_approval: 'موافقة المصروفات', refund_statement: 'كشف الاسترجاعات', credit_limits: 'حدود الائتمان', supplier_statement: 'كشف الموردين', multi_branch: 'متعدد الفروع'
  }
};

// ==========================================
// PREMIUM BILINGUAL INVOICE TEMPLATE
// ==========================================
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(trackUrl)}`;
  const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(trackUrl)}&code=Code128&translate-esc=on`;

  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${dir}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; }
      body { font-family: ${isAr ? "'Cairo', sans-serif" : "'Poppins', sans-serif"}; background: #e2e8f0; margin: 0; padding: 20px; color: #1e293b; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .invoice-container { max-width: 850px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; border-top: 8px solid #1E3A8A; }
      .header { padding: 25px 30px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
      .company-info h2 { margin: 0; font-size: 28px; color: #1E3A8A; font-weight: 800; direction: rtl; font-family: 'Cairo', sans-serif; }
      .company-info h1 { margin: 3px 0 0; font-size: 18px; color: #D97706; font-weight: 700; text-transform: uppercase; }
      .company-info p { margin: 8px 0 0; font-size: 12px; color: #64748b; line-height: 1.5; }
      .invoice-meta { text-align: ${isAr ? 'left' : 'right'}; background: #1E3A8A; padding: 15px 25px; border-radius: 10px; color: #fff; }
      .invoice-meta h3 { margin: 0 0 8px; font-size: 20px; color: #FBBF24; text-transform: uppercase; letter-spacing: 1px; }
      .invoice-meta p { margin: 3px 0; font-size: 13px; font-weight: 500; }
      .invoice-meta span { color: #FBBF24; font-weight: 700; }
      .body { padding: 25px 30px; }
      .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
      .card { background: #f8fafc; border-radius: 10px; padding: 15px; border-left: 4px solid #1E3A8A; }
      .card h4 { margin: 0 0 10px; font-size: 13px; text-transform: uppercase; color: #1E3A8A; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
      .card p { margin: 5px 0; font-size: 13px; display: flex; justify-content: space-between; }
      .card p strong { color: #334155; }
      .card p span { color: #64748b; font-weight: 600; text-align: ${isAr ? 'left' : 'right'}; max-width: 60%; word-wrap: break-word; }
      .table-wrapper { background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; }
      thead th { background: #1E3A8A; color: #fff; padding: 12px; font-size: 13px; text-align: ${isAr ? 'right' : 'left'}; }
      thead th.center { text-align: center; }
      thead th.right { text-align: right; }
      tbody td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #334155; vertical-align: top; }
      tbody td.center { text-align: center; }
      tbody td.right { text-align: ${isAr ? 'left' : 'right'}; font-weight: 600; }
      .service-badge { display: inline-block; background: #DBEAFE; color: #1E3A8A; padding: 3px 8px; border-radius: 15px; font-size: 11px; font-weight: 600; margin-top: 5px; }
      .totals-section { display: flex; justify-content: flex-end; margin-bottom: 20px; }
      .totals-box { width: 320px; }
      .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
      .total-row span { color: #64748b; }
      .total-row strong { color: #1e293b; font-weight: 600; }
      .grand-total { background: #1E3A8A; color: #fff; padding: 12px 15px; border-radius: 8px; margin-top: 8px; font-size: 16px; display: flex; justify-content: space-between; font-weight: 700; }
      .grand-total strong { color: #FBBF24; }
      .due-amount { color: #EF4444; font-weight: 700; }
      .paid-amount { color: #059669; font-weight: 700; }
      .credit-used { color: #7c3aed; font-weight: 700; }
      .footer { background: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
      .codes img { height: 70px; mix-blend-mode: multiply; }
      .footer-text { text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5; }
      .footer-text strong { color: #64748b; display: block; font-size: 14px; margin-bottom: 4px; }
      @media print {
        body { background: #fff; padding: 0; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .invoice-container { box-shadow: none; border-radius: 0; max-width: 100%; border: none; margin: 0; }
        .header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .footer { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .body { padding-top: 160px; padding-bottom: 120px; }
        img { max-width: 100% !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="header">
        <div class="company-info">
          <h2>${setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <p style="direction: rtl; text-align: right;">
            ${setting.address_ar || 'الرياض, المملكة العربية السعودية'}<br>
            هاتف: ${setting.phone || '+966 500000000'}<br>
            ضريبة: ${setting.vat_no || 'N/A'} | سجل تجاري: ${setting.cr_no || 'N/A'}<br>
            ترخيص: ${setting.license_no || 'N/A'} | ترخيص سياحي: ${setting.tourist_license_no || 'N/A'}
          </p>
        </div>
        <div class="invoice-meta">
          <h3>${isAr ? 'فاتورة ضريبية' : 'Tax Invoice'}</h3>
          <p>${isAr ? 'رقم الفاتورة' : 'Invoice No'}: <span>${invoiceNo}</span></p>
          <p>${isAr ? 'التاريخ' : 'Date'}: <span>${inv.invoice_date || ''}</span></p>
          <p>${isAr ? 'الحالة' : 'Status'}: <span>${inv.due_amount > 0 ? (isAr ? 'غير مدفوعة' : 'Unpaid') : (isAr ? 'مدفوعة' : 'Paid')}</span></p>
        </div>
      </div>
      <div class="body">
        <div class="details-grid">
          <div class="card">
            <h4>${isAr ? 'معلومات العميل' : 'Customer Info'}</h4>
            <p><strong>${isAr ? 'الاسم' : 'Name'}:</strong> <span>${inv.customers?.name || inv.corporates?.name || 'Walk-in'}</span></p>
            <p><strong>${isAr ? 'الجوال' : 'Phone'}:</strong> <span>${inv.customers?.phone || 'N/A'}</span></p>
            <p><strong>${isAr ? 'موظف المبيعات' : 'Sales Person'}:</strong> <span>${inv.employees?.name || 'N/A'}</span></p>
          </div>
          <div class="card" style="border-left-color: #D97706;">
            <h4>${isAr ? 'تفاصيل الحجز الجديد' : 'New Booking Details'}</h4>
            <p><strong>${isAr ? 'الخدمة' : 'Service'}:</strong> <span>${inv.service_type || 'Flight'}</span></p>
            <p><strong>${isAr ? 'خط الطيران' : 'Airline'}:</strong> <span>${inv.airline || 'N/A'}</span></p>
            <p><strong>${isAr ? 'رقم التذكرة' : 'Ticket No'}:</strong> <span>${inv.ticket_no || 'N/A'}</span></p>
            <p><strong>${isAr ? 'رقم الحجز' : 'PNR'}:</strong> <span>${inv.pnr || 'N/A'}</span></p>
            <p><strong>${isAr ? 'الركاب' : 'Passenger'}:</strong> <span>${inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A'}</span></p>
          </div>
        </div>
        ${inv.linked_inv_id ? `
        <div class="card" style="margin-bottom: 20px; border-left-color: #64748b; background: #f1f5f9;">
          <h4>${isAr ? 'تفاصيل الحجز السابق' : 'Previous Booking Details'}</h4>
          <p><strong>${isAr ? 'رقم الفاتورة الأصلية' : 'Original Invoice No'}:</strong> <span>${inv.linked_inv_id}</span></p>
          <p><strong>${isAr ? 'رقم التذكرة القديم' : 'Old Ticket No'}:</strong> <span>${inv.old_ticket_no || 'N/A'}</span></p>
          <p><strong>${isAr ? 'رقم الحجز القديم' : 'Old PNR'}:</strong> <span>${inv.old_pnr || 'N/A'}</span></p>
        </div>` : ''}
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>${isAr ? 'الوصف' : 'Description'}</th>
                <th class="center">${isAr ? 'الكمية' : 'Qty'}</th>
                <th class="right">${isAr ? 'سعر الوحدة' : 'Unit Price'}</th>
                <th class="right">${isAr ? 'الإجمالي' : 'Total'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${inv.sector || inv.service_type}</strong><br>
                  <span class="service-badge">${inv.flight_type || inv.service_type} | ${inv.flight_journey || ''}</span>
                </td>
                <td class="center">${inv.qty || 1}</td>
                <td class="right">${((inv.total_sell || 0) / (inv.qty || 1)).toFixed(2)} SAR</td>
                <td class="right">${(inv.total_sell || 0).toFixed(2)} SAR</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="totals-section">
          <div class="totals-box">
            <div class="total-row"><span>${isAr ? 'الإجمالي قبل الضريبة' : 'Total Before Tax'}</span> <strong>${(inv.total_sell || 0).toFixed(2)} SAR</strong></div>
            <div class="total-row"><span>${isAr ? 'قيمة الضريبة (15%)' : 'VAT (15%)'}</span> <strong>${(inv.vat || 0).toFixed(2)} SAR</strong></div>
            <div class="grand-total"><span>${isAr ? 'الإجمالي شامل الضريبة' : 'Grand Total'}</span> <strong>${(inv.total || 0).toFixed(2)} SAR</strong></div>
            ${inv.used_credit > 0 ? `<div class="total-row" style="margin-top: 10px; border-bottom: none;"><span>${isAr ? 'رصيد مستخدم' : 'Credit Used'}</span> <strong class="credit-used">- ${inv.used_credit.toFixed(2)} SAR</strong></div>` : ''}
            <div class="total-row" style="${inv.used_credit > 0 ? '' : 'margin-top: 10px;'} border-bottom: none;"><span>${isAr ? 'المدفوع نقداً' : 'Cash Paid'}</span> <strong class="paid-amount">${((inv.paid_amount || 0) - (inv.used_credit || 0)).toFixed(2)} SAR</strong></div>
            <div class="total-row"><span>${isAr ? 'المتبقي' : 'Due Amount'}</span> <strong class="due-amount">${(inv.due_amount || 0).toFixed(2)} SAR</strong></div>
            <div class="total-row" style="border-bottom: none;"><span>${isAr ? 'طريقة الدفع' : 'Payment Method'}</span> <strong>${inv.payment_method || 'Cash'}</strong></div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="codes">
          <img src="${barcodeUrl}" alt="Barcode" crossorigin="anonymous"><br>
          <small style="color:#94a3b8; font-size: 10px;">${isAr ? 'امسح الباركود' : 'Scan Barcode'}</small>
        </div>
        <div class="footer-text">
          <strong>${setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</strong>
          <p>${setting.invoice_footer || (isAr ? 'شكراً لاختياركم خدماتنا' : 'Thank you for choosing us!')}</p>
          <p>${isAr ? 'هذه فاتورة صادرة من النظام' : 'THIS IS A SYSTEM GENERATED INVOICE'}</p>
        </div>
        <div class="codes">
          <img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous"><br>
          <small style="color:#94a3b8; font-size: 10px;">${isAr ? 'امسح للإلكتروني' : 'Scan for Online'}</small>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};

// REFUND INVOICE TEMPLATE (BILINGUAL)
const getRefundHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(trackUrl)}&code=Code128&translate-esc=on`;
  const custRefund = inv.refund_customer || 0;
  const payMode = inv.payment_method === 'Credit' ? (isAr ? 'أضيف إلى الرصيد الائتماني' : 'Added to Credit Balance') : (inv.payment_method || (isAr ? 'نقداً/بنك' : 'Cash/Bank'));

  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8">
    <title>Refund Invoice ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; }
      body { font-family: ${isAr ? "'Cairo', sans-serif" : "'Poppins', sans-serif"}; background: #e2e8f0; margin: 0; padding: 20px; color: #1e293b; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .invoice-container { max-width: 850px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; border-top: 8px solid #EF4444; }
      .header { padding: 25px 30px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
      .company-info h2 { margin: 0; font-size: 28px; color: #EF4444; font-weight: 800; direction: rtl; font-family: 'Cairo', sans-serif; }
      .company-info h1 { margin: 3px 0 0; font-size: 18px; color: #1e293b; font-weight: 700; }
      .company-info p { margin: 8px 0 0; font-size: 12px; color: #64748b; line-height: 1.5; }
      .invoice-meta { text-align: ${isAr ? 'left' : 'right'}; background: #EF4444; padding: 15px 25px; border-radius: 10px; color: #fff; }
      .invoice-meta h3 { margin: 0 0 8px; font-size: 20px; color: #fff; text-transform: uppercase; }
      .invoice-meta p { margin: 3px 0; font-size: 13px; }
      .invoice-meta span { color: #fff; font-weight: 700; }
      .body { padding: 30px; }
      .card { background: #fef2f2; border-radius: 10px; padding: 20px; border-left: 4px solid #EF4444; margin-bottom: 20px; }
      .card h4 { margin: 0 0 10px; font-size: 16px; color: #EF4444; border-bottom: 2px solid #fecaca; padding-bottom: 5px; }
      .card p { margin: 8px 0; font-size: 15px; display: flex; justify-content: space-between; }
      .totals-section { display: flex; justify-content: flex-end; margin-bottom: 20px; }
      .totals-box { width: 350px; }
      .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
      .grand-total { background: #EF4444; color: #fff; padding: 12px 15px; border-radius: 8px; margin-top: 8px; font-size: 16px; display: flex; justify-content: space-between; font-weight: 700; }
      .status-box { background: #f1f5f9; padding: 10px 15px; border-radius: 8px; margin-top: 8px; font-size: 14px; display: flex; justify-content: space-between; font-weight: 600; color: #334155; }
      .footer { background: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
      .codes img { height: 70px; mix-blend-mode: multiply; }
      .footer-text { text-align: center; font-size: 12px; color: #94a3b8; }
      @media print {
        body { background: #fff; padding: 0; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .invoice-container { box-shadow: none; border-radius: 0; max-width: 100%; border: none; margin: 0; }
        img { max-width: 100% !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="header">
        <div class="company-info">
          <h2>${setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <p style="direction: rtl; text-align: right;">
            ${setting.address_ar || 'الرياض, المملكة العربية السعودية'}<br>
            هاتف: ${setting.phone || '+966 500000000'}<br>
            ضريبة: ${setting.vat_no || 'N/A'} | سجل تجاري: ${setting.cr_no || 'N/A'}<br>
            ترخيص: ${setting.license_no || 'N/A'} | ترخيص سياحي: ${setting.tourist_license_no || 'N/A'}
          </p>
        </div>
        <div class="invoice-meta">
          <h3>${isAr ? 'إشعار دائن' : 'Credit Note'}</h3>
          <p>${isAr ? 'رقم الاسترجاع' : 'Refund No'}: <span>${invoiceNo}</span></p>
          <p>${isAr ? 'التاريخ' : 'Date'}: <span>${inv.invoice_date || ''}</span></p>
        </div>
      </div>
      <div class="body">
        <div class="card">
          <h4>${isAr ? 'تفاصيل العميل والتذكرة' : 'Customer & Ticket Details'}</h4>
          <p><strong>${isAr ? 'اسم العميل' : 'Customer Name'}:</strong> <span>${inv.customers?.name || 'N/A'}</span></p>
          <p><strong>${isAr ? 'الفاتورة الأصلية' : 'Original Invoice'}:</strong> <span>${inv.linked_inv_id || 'N/A'}</span></p>
          <p><strong>${isAr ? 'خط الطيران' : 'Airline'}:</strong> <span>${inv.airline || 'N/A'}</span></p>
          <p><strong>${isAr ? 'رقم الحجز' : 'PNR'}:</strong> <span>${inv.pnr || 'N/A'}</span></p>
          <p><strong>${isAr ? 'رقم التذكرة' : 'Ticket No'}:</strong> <span>${inv.ticket_no || 'N/A'}</span></p>
          <p><strong>${isAr ? 'الركاب' : 'Passenger'}:</strong> <span>${inv.passenger_names || 'N/A'}</span></p>
          <p style="color: #EF4444; font-weight: bold;"><strong>${isAr ? 'سبب الإلغاء' : 'Reason'}:</strong> <span>${inv.refund_reason || 'N/A'}</span></p>
        </div>
        <div class="totals-section">
          <div class="totals-box">
            <div class="grand-total"><span>${isAr ? 'المبلغ المسترجع للعميل' : 'Total Refunded to Customer'}</span> <strong>${custRefund.toFixed(2)} SAR</strong></div>
            <div class="status-box"><span>${isAr ? 'طريقة الدفع' : 'Refund Paid Via'}</span> <strong style="color: ${inv.payment_method === 'Credit' ? '#7c3aed' : '#059669'}">${payMode}</strong></div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="codes">
          <img src="${barcodeUrl}" alt="Barcode" crossorigin="anonymous"><br>
          <small style="color:#94a3b8; font-size: 10px;">${isAr ? 'امسح الباركود' : 'Scan Barcode'}</small>
        </div>
        <div class="footer-text">
          <p>${isAr ? 'هذا إشعار دائن صادر من النظام' : 'This is a system generated refund invoice'}</p>
        </div>
        <div class="codes" style="visibility: hidden;"><img src="${barcodeUrl}" alt="QR"></div>
      </div>
    </div>
  </body>
  </html>
  `;
};

// EXPENSE INVOICE TEMPLATE (BILINGUAL)
const getExpenseHTML = (exp, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const expNo = exp.invoice_no || 'N/A';
  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8">
    <title>Expense ${expNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <style>
      body { font-family: ${isAr ? "'Cairo', sans-serif" : "'Poppins', sans-serif"}; padding: 20px; color: #1e293b; }
      .card { max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; }
      h1 { color: #1E3A8A; text-align: center; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 10px; border: 1px solid #e2e8f0; text-align: ${isAr ? 'right' : 'left'}; }
      th { background: #f1f5f9; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${isAr ? 'سند صرف' : 'Expense Voucher'}</h1>
      <p><strong>${isAr ? 'الرقم' : 'No'}:</strong> ${expNo}</p>
      <p><strong>${isAr ? 'التاريخ' : 'Date'}:</strong> ${exp.expense_date}</p>
      <p><strong>${isAr ? 'المورد' : 'Vendor'}:</strong> ${exp.vendor_name}</p>
      <p><strong>${isAr ? 'النوع' : 'Type'}:</strong> ${exp.expense_type}</p>
      <table>
        <thead><tr><th>${isAr ? 'الصنف' : 'Item'}</th><th>${isAr ? 'الكمية' : 'Qty'}</th><th>${isAr ? 'السعر' : 'Price'}</th></tr></thead>
        <tbody>
          ${(exp.items && exp.items.length > 0 ? exp.items : [{name: exp.item_name, qty: 1, price: exp.amount}]).map(it => `
            <tr><td>${it.name}</td><td>${it.qty}</td><td>${parseFloat(it.price).toFixed(2)}</td></tr>
          `).join('')}
        </tbody>
      </table>
      <h3 style="text-align: ${isAr ? 'left' : 'right'}; color: #EF4444;">${isAr ? 'الإجمالي' : 'Total'}: ${(exp.amount || 0).toFixed(2)} SAR</h3>
      <p><strong>${isAr ? 'طريقة الدفع' : 'Paid Via'}:</strong> ${exp.payment_mode}</p>
    </div>
  </body>
  </html>
  `;
};

const getContractHTML = (s, name, date, isOffer, type, markup, terms) => `<div>Contract for ${name}</div>`;

// ==========================================
// MAIN HOOK START
// ==========================================
export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [toast, setToast] = useState(null);
  const [lang, setLang] = useState('en'); // Default English
  const [data, setData] = useState({
    invoices: [], customers: [], corporates: [], creditors: [], portals: [], cashbook: [], expenses: [], investments: [], employees: [], payroll: [], appUsers: [], branches: [], packages: [], vendors: [], services: [], recharges: [], audits: [], empAdvances: [], tenants: [], settings: {}, staffMistakes: []
  });

  const [page, setPage] = useState('dashboard');
  const [tblPage, setTblPage] = useState(1);
  const [modal, setModal] = useState({ type: null, data: null });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hello! How can I help you?' }]);
  const [chatInput, setChatInput] = useState('');
  const [previewHTML, setPreviewHTML] = useState('');
  const [search, setSearch] = useState('');
  const [payFilter, setPayFilter] = useState('All');
  const [repDate, setRepDate] = useState({ from: today, to: today });
  const [reportTab, setReportTab] = useState('sales');
  const [statementTab, setStatementTab] = useState('sales');
  const [ledgerEmpId, setLedgerEmpId] = useState('');
  const [ledgerCustId, setLedgerCustId] = useState('');
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState(0);
  const [contractTerms, setContractTerms] = useState('');
  
  // Added oldTicketNo and oldPnr for Previous Booking feature
  const [invForm, setInvForm] = useState({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', oldTicketNo: '', oldPnr: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '' });
  
  const [expForm, setExpForm] = useState({ vendor_name: '', vendor_vat: '', expense_date: today, expense_type: 'Office Supplies', payment_mode: 'Cash', items: [{ name: '', qty: 1, price: 0 }], taxRate: '15', desc: '' });
  const [custForm, setCustForm] = useState({ name: '', phone: '', store_credit: 0 });
  const [corpForm, setCorpForm] = useState({ name: '', vat_no: '', phone: '', address: '' });
  const [creditorForm, setCreditorForm] = useState({ name: '', phone: '', address: '' });
  const [vendorForm, setVendorForm] = useState({ name: '', phone: '', balance: 0 });
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', desc: '', duration: '', inclusions: '' });
  const [brnForm, setBrnForm] = useState({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
  const [empForm, setEmpForm] = useState({ name: '', role: 'Sales', salary: 0, phone: '', commission_rate: 0, iqama_no: '', iqama_expiry: '' });
  const [srvForm, setSrvForm] = useState({ name: '' });
  const [portalForm, setPortalForm] = useState({ name: '', balance: 0 });
  const [investForm, setInvestForm] = useState({ name: '', amount: '', date: today, desc: '', mode: 'Cash', reason: 'Other', otherReason: '' });
  const [transferForm, setTransferForm] = useState({ from: 'Cash', to: 'Bank', amount: '', date: today });
  const [setForm, setSetForm] = useState({ company_name_en: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '', license_no: '', tourist_license_no: '', invoice_footer: '', logo_url: '', custom_fields: [] });
  const [userForm, setUserForm] = useState({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false });
  const [passForm, setPassForm] = useState({ newPass: '' });
  const [settleForm, setSettleForm] = useState({ id: '', date: today, mode: 'Cash' });
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '' });
  const [tenantForm, setTenantForm] = useState({ agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' });
  const [profileForm, setProfileForm] = useState({ username: '', avatar_url: '', phone: '', address: '' });
  const [editInvId, setEditInvId] = useState(null);
  const [editExpId, setEditExpId] = useState(null);
  const [editCustId, setEditCustId] = useState(null);
  const [editCorpId, setEditCorpId] = useState(null);
  const [editCredId, setEditCredId] = useState(null);
  const [editVendId, setEditVendId] = useState(null);
  const [editPkgId, setEditPkgId] = useState(null);
  const [editBrnId, setEditBrnId] = useState(null);
  const [editEmpId, setEditEmpId] = useState(null);
  const [editSrvId, setEditSrvId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  const tr = translations[lang]; // Active translation dictionary

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const logAction = async (action) => { if (!userProfile?.id) return; try { await supabase.from('audits').insert([{ user_email: userProfile.email, action, tenant_id: userProfile.tenant_id }]); } catch (e) {} };
  const fetchAll = useCallback(async () => {
    if (!userProfile?.tenant_id) return;
    const tId = userProfile.tenant_id;
    try {
      const [inv, cust, corp, cred, por, cash, exp, emp, appU, set, ten, pay, adv, mistakes] = await Promise.all([
        supabase.from('invoices').select(`*, customers(name), corporates(name), employees(name)`).eq('tenant_id', tId),
        supabase.from('customers').select('*').eq('tenant_id', tId),
        supabase.from('corporates').select('*').eq('tenant_id', tId),
        supabase.from('creditors').select('*').eq('tenant_id', tId),
        supabase.from('portals').select('*').eq('tenant_id', tId),
        supabase.from('cashbook').select('*').eq('tenant_id', tId),
        supabase.from('expenses').select('*').eq('tenant_id', tId),
        supabase.from('employees').select('*').eq('tenant_id', tId),
        supabase.from('app_users').select('*').eq('tenant_id', tId),
        supabase.from('settings').select('*').eq('tenant_id', tId).maybeSingle(),
        supabase.from('tenants').select('*'),
        supabase.from('payroll').select('*, employees(name)').eq('tenant_id', tId),
        supabase.from('employee_advances').select('*, employees(name)').eq('tenant_id', tId),
        supabase.from('staff_mistakes').select('*, employees(name)').eq('tenant_id', tId)
      ]);
      setData({ 
        invoices: inv.data || [], customers: cust.data || [], corporates: corp.data || [], creditors: cred.data || [], portals: por.data || [], cashbook: cash.data || [], expenses: exp.data || [], employees: emp.data || [], appUsers: appU.data || [], settings: set.data || {}, tenants: ten.data || [], payroll: pay.data || [], empAdvances: adv.data || [], staffMistakes: mistakes.data || [],
        investments: [], branches: [], packages: [], vendors: [], services: [], recharges: [], audits: [] 
      });
    } catch (err) {}
  }, [userProfile]);

  const exportToExcel = (data, filename) => {
    if (!data || data.length === 0) return showToast('No data to export');
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        let val = row[header];
        if (typeof val === 'object' && val !== null) val = val.name || JSON.stringify(val);
        return `"${val !== undefined && val !== null ? String(val).replace(/"/g, '""') : ''}"`;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Excel/CSV Exported Successfully!');
  };
  const filterData = (arr, dateField) => arr.filter(item => { const d = item[dateField]; return !d || (d >= repDate.from && d <= repDate.to); });

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profileData } = await supabase.from('app_users').select('*').eq('email', session.user.email).single();
        if (profileData) { setUserProfile(profileData); } 
        else { setUserProfile({ id: session.user.id, email: session.user.email, username: session.user.email, role: 'SuperAdmin', is_admin: true, can_access_invoices: true, can_access_bank: true, can_access_hr: true, can_access_reports: true, can_access_settings: true, tenant_id: '00000000-0000-0000-0000-000000000000' }); }
      } else { router.push('/login'); }
    };
    getSession();
  }, [router]);

  useEffect(() => { if (userProfile) { fetchAll(); } }, [userProfile, fetchAll]);

  return {
    user, data, setData, userProfile, setUserProfile, toast, showToast, logAction, fetchAll,
    lang, setLang, tr, // Return translation engine
    invForm, setInvForm, expForm, setExpForm, corpForm, setCorpForm, creditorForm, setCreditorForm,
    custForm, setCustForm, vendorForm, setVendorForm, pkgForm, setPkgForm, brnForm, setBrnForm,
    empForm, setEmpForm, srvForm, setSrvForm, investForm, setInvestForm, settleForm, setSettleForm,
    refundForm, setRefundForm, transferForm, setTransferForm, setForm, setSetForm, userForm, setUserForm,
    portalForm, setPortalForm, editInvId, setEditInvId, editExpId, setEditExpId, editCorpId, setEditCorpId,
    editCredId, setEditCredId, editCustId, setEditCustId, editVendId, setEditVendId, editPkgId, setEditPkgId,
    editBrnId, setEditBrnId, editEmpId, setEditEmpId, editSrvId, setEditSrvId, editUserId, setEditUserId,
    modal, setModal, passForm, setPassForm, chatInput, setChatInput, chatMessages, setChatMessages,
    previewHTML, setPreviewHTML, getInvoiceHTML, getRefundHTML, getExpenseHTML, getContractHTML, today, router,
    contractCorpName, setContractCorpName, contractType, setContractType, contractMarkup, setContractMarkup,
    contractTerms, setContractTerms, tenantForm, setTenantForm, profileForm, setProfileForm,
    ledgerEmpId, setLedgerEmpId, ledgerCustId, setLedgerCustId, repDate, setRepDate,
    reportTab, setReportTab, statementTab, setStatementTab, page, setPage, 
    chatOpen, setChatOpen, search, setSearch, payFilter, setPayFilter, tblPage, setTblPage, 
    exportToExcel, filterData
  };
}
