'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ==========================================
// MASSIVE TRANSLATION ENGINE (EN/AR)
// ==========================================
const translations = {
  en: {
    dashboard: 'Dashboard', create: 'Create Invoice', list: 'Invoices', refunds: 'Refunds', customers: 'Customers', corporates: 'Corporates', creditors: 'Creditors', credit: 'Credit Balances', vendors: 'Vendors', packages: 'Packages', branches: 'Branches', portals: 'Portals', bank: 'Bank & Cash', invest: 'Investors', hr: 'Human Resources', users: 'Users', settings: 'Settings', reports: 'Reports', audit: 'Audit Logs', statements: 'Statements', contract: 'Contracts', offer: 'Offers', superadmin: 'SuperAdmin', profile: 'Profile', profitability: 'Profitability', search: 'Search...', download_excel: 'Export Excel', logout: 'Logout', changePass: 'Change Password', quotations: 'Quotations', ai_dashboard: 'AI Dashboard', hr_advanced: 'HR & Payroll', staff_mistakes: 'Staff Mistakes', notifications: 'Notifications', customer_statement: 'Cust Statement', recurring_invoices: 'Recurring Invoices', expense_approval: 'Expense Approval', refund_statement: 'Refund Statement', credit_limits: 'Credit Limits', supplier_statement: 'Supplier Statement', multi_branch: 'Multi-Branch', custType: 'Customer Type', individual: 'Individual', corporate: 'Corporate', selectCustomer: 'Select Customer', newCustomer: 'New Customer', customerName: 'Customer Name', customerPhone: 'Customer Phone', passengers: 'Passengers', addPassenger: '+ Add Passenger', portal: 'Portal', service: 'Service', flightTicket: 'Flight Ticket', hotel: 'Hotel', tourPackage: 'Tour Package', visitVisa: 'Visit Visa', umrahVisa: 'Umrah Visa', newService: 'New Service', flightType: 'Flight Type', domestic: 'Domestic', international: 'International', airline: 'Airline', sector: 'Sector', pnr: 'PNR', ticketNo: 'Ticket No', hotelName: 'Hotel Name', checkIn: 'Check In', checkOut: 'Check Out', serviceName: 'Service Name', qty: 'Qty', cost: 'Cost', sell: 'Sell', discount: 'Discount', vatRate: 'VAT Rate', invoiceDate: 'Invoice Date', journeyType: 'Journey Type', single: 'Single', roundTrip: 'Round Trip', multiCity: 'Multi-city', fareType: 'Fare Type', refundable: 'Refundable', nonRefundable: 'Non-Refundable', bookingType: 'Booking Type', newBooking: 'New Booking', reissue: 'Reissue', extraLuggage: 'Extra Luggage', previousBooking: 'Previous Booking', salesPerson: 'Sales Person', paymentMethod: 'Payment Method', cash: 'Cash', bankTransfer: 'Bank Transfer', card: 'Card / Network', credit: 'Credit', creditBalance: 'Credit Balance', tabby: 'Tabby', tamara: 'Tamara', paidAmount: 'Paid Amount', useCreditAmount: 'Use Credit Amount', generateInvoice: 'Generate Invoice', updateInvoice: 'Update Invoice', editInvoice: 'Edit Invoice', invNo: 'Inv No', total: 'Total', due: 'Due', method: 'Method', actions: 'Actions', preview: 'Preview', print: 'Print', edit: 'Edit', delete: 'Delete', quickSettle: 'Quick Settle', refund: 'Refund', settlePayment: 'Settle Payment', processRefund: 'Process Refund', companyRefund: 'Company Refund', customerRefund: 'Customer Refund', refundReason: 'Refund Reason', refundDate: 'Refund Date', documentPreview: 'Document Preview', close: 'Close', cancel: 'Cancel', save: 'Save', mark: 'Mark', logLoss: 'Log Loss', selectEmployee: 'Select Employee', target: 'Target', achieved: 'Achieved', percentage: 'Percentage', checkInTime: 'Check-In', checkOutTime: 'Check-Out', overtime: 'Overtime', deduction: 'Deduction', status: 'Status', present: 'Present', leave: 'Leave', absent: 'Absent', paySalary: 'Pay Salary', generateSlip: 'Generate Slip', baseSalary: 'Base Salary', commission: 'Commission', advDed: 'Adv. Deduct', gift: 'Gift', month: 'Month', mode: 'Mode', attendanceDate: 'Date' },
  ar: { dashboard: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'الفواتير', refunds: 'الاسترجاعات', customers: 'العملاء', corporates: 'الشركات', creditors: 'الدائنون', credit: 'أرصدة الائتمان', vendors: 'الموردون', packages: 'الباقات', branches: 'الفروع', portals: 'البوابات', bank: 'البنك والصندوق', invest: 'المستثمرون', hr: 'الموارد البشرية', users: 'المستخدمون', settings: 'الإعدادات', reports: 'التقارير', audit: 'سجل التدقيق', statements: 'الكشوف', contract: 'العقود', offer: 'العروض', superadmin: 'المدير العام', profile: 'الملف الشخصي', profitability: 'الربحية', search: 'بحث...', download_excel: 'تصدير إكسل', logout: 'تسجيل الخروج', changePass: 'تغيير كلمة المرور', quotations: 'عروض الأسعار', ai_dashboard: 'لوحة الذكاء الاصطناعي', hr_advanced: 'الموارد البشرية والرواتب', staff_mistakes: 'أخطاء الموظفين', notifications: 'الإشعارات', customer_statement: 'كشف العميل', recurring_invoices: 'الفواتير المتكررة', expense_approval: 'موافقة المصروفات', refund_statement: 'كشف الاسترجاعات', credit_limits: 'حدود الائتمان', supplier_statement: 'كشف الموردين', multi_branch: 'متعدد الفروع', custType: 'نوع العميل', individual: 'فرد', corporate: 'شركة', selectCustomer: 'اختر العميل', newCustomer: 'عميل جديد', customerName: 'اسم العميل', customerPhone: 'هاتف العميل', passengers: 'الركاب', addPassenger: '+ إضافة راكب', portal: 'البوابة', service: 'الخدمة', flightTicket: 'تذكرة طيران', hotel: 'فندق', tourPackage: 'باقة سياحية', visitVisa: 'تأشيرة زيارة', umrahVisa: 'تأشيرة عمرة', newService: 'خدمة جديدة', flightType: 'نوع الرحلة', domestic: 'داخلية', international: 'دولية', airline: 'خط الطيران', sector: 'القطاع', pnr: 'رقم الحجز', ticketNo: 'رقم التذكرة', hotelName: 'اسم الفندق', checkIn: 'تاريخ الوصول', checkOut: 'تاريخ المغادرة', serviceName: 'اسم الخدمة', qty: 'الكمية', cost: 'التكلفة', sell: 'البيع', discount: 'الخصم', vatRate: 'نسبة الضريبة', invoiceDate: 'تاريخ الفاتورة', journeyType: 'نوع الرحلة', single: 'ذهاب', roundTrip: 'ذهاب وعودة', multiCity: 'مدن متعددة', fareType: 'نوع الأجرة', refundable: 'قابلة للاسترداد', nonRefundable: 'غير قابلة للاسترداد', bookingType: 'نوع الحجز', newBooking: 'حجز جديد', reissue: 'إعادة إصدار', extraLuggage: 'أمتعة إضافية', previousBooking: 'حجز سابق', salesPerson: 'موظف المبيعات', paymentMethod: 'طريقة الدفع', cash: 'نقداً', bankTransfer: 'تحويل بنكي', card: 'بطاقة / شبكة', credit: 'آجل', creditBalance: 'رصيد ائتماني', tabby: 'تابي', tamara: 'تمارا', paidAmount: 'المبلغ المدفوع', useCreditAmount: 'استخدام مبلغ الرصيد', generateInvoice: 'إنشاء الفاتورة', updateInvoice: 'تحديث الفاتورة', editInvoice: 'تعديل الفاتورة', invNo: 'رقم الفاتورة', total: 'الإجمالي', due: 'المتبقي', method: 'الطريقة', actions: 'إجراءات', preview: 'معاينة', print: 'طباعة', edit: 'تعديل', delete: 'حذف', quickSettle: 'تسوية سريعة', refund: 'استرجاع', settlePayment: 'تسوية الدفعة', processRefund: 'معالجة الاسترجاع', companyRefund: 'استرجاع الشركة', customerRefund: 'استرجاع العميل', refundReason: 'سبب الاسترجاع', refundDate: 'تاريخ الاسترجاع', documentPreview: 'معاينة المستند', close: 'إغلاق', cancel: 'إلغاء', save: 'حفظ', mark: 'تسجيل', logLoss: 'تسجيل خسارة', selectEmployee: 'اختر الموظف', target: 'الهدف', achieved: 'المحقق', percentage: 'النسبة', checkInTime: 'الحضور', checkOutTime: 'الانصراف', overtime: 'العمل الإضافي', deduction: 'الخصم', status: 'الحالة', present: 'حاضر', leave: 'إجازة', absent: 'غائب', paySalary: 'صرف الراتب', generateSlip: 'إنشاء قسيمة', baseSalary: 'الراتب الأساسي', commission: 'العمولة', advDed: 'خصم السلفة', gift: 'مكافأة', month: 'الشهر', mode: 'الطريقة', attendanceDate: 'التاريخ' }
};

// ==========================================
// PREMIUM SALE INVOICE TEMPLATE (Bilingual & Complete Details)
// ==========================================
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;
  const T = (en, ar) => isAr ? `${ar} / ${en}` : `${en} / ${ar}`;

  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${dir}">
  <head>
    <meta charset="UTF-8">
    <title>Invoice ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { font-family: ${isAr ? "'Cairo', sans-serif" : "'Poppins', sans-serif"}; background: #e2e8f0; margin: 0; padding: 20px; color: #334155; }
      .invoice-box { max-width: 850px; margin: auto; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
      .header { display: flex; justify-content: space-between; padding: 40px; background: #ffffff; border-bottom: 4px solid #f1f5f9; }
      .company-info h2 { margin: 0; font-size: 24px; color: #0f172a; font-weight: 800; direction: rtl; font-family: 'Cairo', sans-serif; }
      .company-info h1 { margin: 5px 0 0; font-size: 16px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
      .company-info p { margin: 15px 0 0; font-size: 12px; color: #64748b; line-height: 1.6; direction: rtl; text-align: right; }
      .invoice-meta { text-align: ${isAr ? 'left' : 'right'}; }
      .invoice-meta h3 { margin: 0 0 10px; font-size: 28px; color: #d97706; text-transform: uppercase; font-weight: 800; letter-spacing: -1px; }
      .invoice-meta p { margin: 4px 0; font-size: 14px; color: #64748b; } .invoice-meta span { color: #0f172a; font-weight: 700; }
      .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 10px; background: ${inv.due_amount > 0 ? '#FEF3C7' : '#D1FAE5'}; color: ${inv.due_amount > 0 ? '#D97706' : '#059669'}; }
      .body { padding: 40px; }
      .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
      .info-block { padding: 20px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #1e293b; }
      .info-block h4 { margin: 0 0 15px; font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; font-weight: 700; }
      .info-block p { margin: 8px 0; font-size: 14px; display: flex; justify-content: space-between; } .info-block p strong { color: #334155; font-weight: 600; }
      .info-block p span { color: #0f172a; font-weight: 500; text-align: ${isAr ? 'left' : 'right'}; }
      .table-wrapper { margin-bottom: 40px; } table { width: 100%; border-collapse: collapse; }
      thead th { text-align: ${isAr ? 'right' : 'left'}; padding: 15px; background: #0f172a; color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
      thead th.center { text-align: center; } thead th.right { text-align: right; }
      tbody td { padding: 20px 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; vertical-align: top; }
      tbody td.center { text-align: center; } tbody td.right { text-align: ${isAr ? 'left' : 'right'}; font-weight: 600; color: #0f172a; }
      .totals-section { display: flex; justify-content: flex-end; margin-bottom: 40px; } .totals-box { width: 300px; }
      .total-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 14px; color: #64748b; } .total-row strong { color: #0f172a; font-weight: 600; }
      .grand-total { display: flex; justify-content: space-between; padding: 20px; background: #0f172a; color: #fff; border-radius: 12px; margin-top: 10px; font-size: 20px; font-weight: 700; }
      .grand-total span { color: #94a3b8; font-size: 14px; font-weight: 400; } .grand-total strong { color: #d97706; }
      .footer { padding: 30px 40px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; }
      .qr-code { text-align: center; } .qr-code img { height: 100px; width: 100px; border-radius: 8px; border: 1px solid #e2e8f0; padding: 5px; background: #fff; }
      .footer-text { text-align: center; } .footer-text p { margin: 5px 0; font-size: 12px; color: #64748b; }
      .footer-text strong { display: block; font-size: 16px; color: #0f172a; margin-bottom: 5px; font-family: 'Cairo', sans-serif; }
      @media print { body { background: #fff; padding: 0; margin: 0; } .invoice-box { box-shadow: none; border-radius: 0; margin: 0; max-width: 100%; } img { max-width: 100% !important; } }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <div class="company-info">
          <h2>${setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <p>${setting.address_ar || 'الرياض, المملكة العربية السعودية'}<br>هاتف: ${setting.phone || '+966 500000000'}<br>ضريبة: ${setting.vat_no || 'N/A'} | سجل تجاري: ${setting.cr_no || 'N/A'}<br>ترخيص: ${setting.license_no || 'N/A'} | ترخيص سياحي: ${setting.tourist_license_no || 'N/A'}</p>
        </div>
        <div class="invoice-meta">
          <h3>${T('Invoice', 'فاتورة')}</h3>
          <p>${T('No', 'رقم')}: <span>${invoiceNo}</span></p>
          <p>${T('Date', 'التاريخ')}: <span>${inv.invoice_date || ''}</span></p>
          <div class="status-badge">${inv.due_amount > 0 ? T('Unpaid', 'غير مدفوعة') : T('Paid', 'مدفوعة')}</div>
        </div>
      </div>
      <div class="body">
        <div class="details-grid">
          <div class="info-block">
            <h4>${T('Bill To', 'الفاتورة إلى')}</h4>
            <p><strong>${T('Name', 'الاسم')}:</strong> <span>${inv.customers?.name || inv.corporates?.name || 'N/A'}</span></p>
            <p><strong>${T('Phone', 'الهاتف')}:</strong> <span>${inv.customers?.phone || 'N/A'}</span></p>
            <p><strong>${T('Sales Person', 'موظف المبيعات')}:</strong> <span>${inv.employees?.name || 'N/A'}</span></p>
          </div>
          <div class="info-block" style="border-left-color: #d97706;">
            <h4>${T('Booking Details', 'تفاصيل الحجز')}</h4>
            <p><strong>${T('Service', 'الخدمة')}:</strong> <span>${inv.service_type || 'N/A'}</span></p>
            <p><strong>${T('Airline', 'خط الطيران')}:</strong> <span>${inv.airline || 'N/A'}</span></p>
            <p><strong>${T('Ticket No', 'رقم التذكرة')}:</strong> <span>${inv.ticket_no || 'N/A'}</span></p>
            <p><strong>${T('PNR', 'رقم الحجز')}:</strong> <span>${inv.pnr || 'N/A'}</span></p>
            <p><strong>${T('Passenger', 'الركاب')}:</strong> <span>${inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A'}</span></p>
          </div>
        </div>
        ${inv.linked_inv_id ? `
        <div class="info-block" style="margin-bottom: 30px; border-left-color: #64748b; background: #f1f5f9;">
          <h4 style="color: #64748b;">${T('Previous Booking', 'الحجز السابق')}</h4>
          <p><strong>${T('Original Invoice', 'الفاتورة الأصلية')}:</strong> <span>${inv.linked_inv_id}</span></p>
          <p><strong>${T('Old Ticket No', 'رقم التذكرة القديم')}:</strong> <span>${inv.old_ticket_no || 'N/A'}</span></p>
          <p><strong>${T('Old PNR', 'رقم الحجز القديم')}:</strong> <span>${inv.old_pnr || 'N/A'}</span></p>
          <p><strong>${T('Credit Used', 'الرصيد المستخدم')}:</strong> <span style="color: #64748b; font-weight: bold;">${(inv.used_credit || 0).toFixed(2)} SAR</span></p>
        </div>` : ''}
        <div class="table-wrapper">
          <table>
            <thead><tr><th>${T('Description', 'الوصف')}</th><th class="center">${T('Qty', 'الكمية')}</th><th class="right">${T('Unit Price', 'سعر الوحدة')}</th><th class="right">${T('Total', 'الإجمالي')}</th></tr></thead>
            <tbody><tr><td><strong>${inv.sector || inv.service_type}</strong></td><td class="center">${inv.qty || 1}</td><td class="right">${((inv.total_sell || 0) / (inv.qty || 1)).toFixed(2)} SAR</td><td class="right">${(inv.total_sell || 0).toFixed(2)} SAR</td></tr></tbody>
          </table>
        </div>
        <div class="totals-section">
          <div class="totals-box">
            <div class="total-row"><span>${T('Subtotal', 'الإجمالي قبل الضريبة')}</span> <strong>${(inv.total_sell || 0).toFixed(2)} SAR</strong></div>
            <div class="total-row"><span>${T('VAT (15%)', 'قيمة الضريبة')}</span> <strong>${(inv.vat || 0).toFixed(2)} SAR</strong></div>
            <div class="grand-total"><span>${T('Grand Total', 'الإجمالي شامل الضريبة')}</span> <strong>${(inv.total || 0).toFixed(2)} SAR</strong></div>
            <div class="total-row" style="margin-top: 15px;"><span>${T('Cash Paid', 'المدفوع نقداً')}</span> <strong style="color: #059669;">${((inv.paid_amount || 0) - (inv.used_credit || 0)).toFixed(2)} SAR</strong></div>
            <div class="total-row"><span>${T('Due Amount', 'المتبقي')}</span> <strong style="color: #EF4444;">${(inv.due_amount || 0).toFixed(2)} SAR</strong></div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="qr-code"><img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous"><p style="margin: 8px 0 0; font-size: 10px; color: #94a3b8;">${T('Scan to View', 'امسح للعرض')}</p></div>
        <div class="footer-text"><strong>${setting.company_name_ar || 'صعود الطائرة'}</strong><p>${setting.invoice_footer || T('Thank you!', 'شكراً!')}</p><p>${T('System Generated', 'صادر من النظام')}</p></div>
        <div style="width: 100px; visibility: hidden;"></div>
      </div>
    </div>
  </body>
  </html>
  `;
};

// ==========================================
// PREMIUM REFUND INVOICE TEMPLATE (Bilingual & Full Ticket Details)
// ==========================================
const getRefundHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;
  const custRefund = inv.refund_customer || 0;
  const payMode = inv.payment_method === 'Credit' ? (isAr ? 'أضيف إلى الرصيد الائتماني' : 'Added to Credit Balance') : (inv.payment_method || (isAr ? 'نقداً/بنك' : 'Cash/Bank'));
  const T = (en, ar) => isAr ? `${ar} / ${en}` : `${en} / ${ar}`;

  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8">
    <title>Refund ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { font-family: ${isAr ? "'Cairo', sans-serif" : "'Poppins', sans-serif"}; background: #e2e8f0; margin: 0; padding: 20px; color: #334155; }
      .invoice-box { max-width: 850px; margin: auto; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
      .header { display: flex; justify-content: space-between; padding: 40px; background: #fff; border-bottom: 4px solid #f1f5f9; }
      .company-info h2 { margin: 0; font-size: 24px; color: #0f172a; font-weight: 800; direction: rtl; font-family: 'Cairo', sans-serif; }
      .company-info h1 { margin: 5px 0 0; font-size: 16px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
      .company-info p { margin: 15px 0 0; font-size: 12px; color: #64748b; line-height: 1.6; direction: rtl; text-align: right; }
      .invoice-meta { text-align: ${isAr ? 'left' : 'right'}; }
      .invoice-meta h3 { margin: 0 0 10px; font-size: 28px; color: #dc2626; text-transform: uppercase; font-weight: 800; letter-spacing: -1px; }
      .invoice-meta p { margin: 4px 0; font-size: 14px; color: #64748b; } .invoice-meta span { color: #0f172a; font-weight: 700; }
      .body { padding: 40px; }
      .info-block { padding: 20px; background: #fff1f2; border-radius: 12px; border-left: 4px solid #dc2626; margin-bottom: 30px; }
      .info-block h4 { margin: 0 0 15px; font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
      .info-block p { margin: 8px 0; font-size: 14px; display: flex; justify-content: space-between; } .info-block p strong { color: #334155; font-weight: 600; }
      .info-block p span { color: #0f172a; font-weight: 500; }
      .grand-total { display: flex; justify-content: space-between; padding: 20px; background: #dc2626; color: #fff; border-radius: 12px; margin-bottom: 15px; font-size: 20px; font-weight: 700; }
      .status-box { display: flex; justify-content: space-between; padding: 15px 20px; background: #f1f5f9; border-radius: 8px; font-size: 14px; color: #334155; }
      .footer { padding: 30px 40px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; }
      .qr-code img { height: 100px; width: 100px; border-radius: 8px; border: 1px solid #e2e8f0; padding: 5px; background: #fff; }
      .footer-text { text-align: center; font-size: 12px; color: #64748b; }
      @media print { body { background: #fff; padding: 0; margin: 0; } .invoice-box { box-shadow: none; border-radius: 0; margin: 0; max-width: 100%; } img { max-width: 100% !important; } }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <div class="company-info">
          <h2>${setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <p>${setting.address_ar || 'الرياض'}<br>${setting.phone || ''}<br>ضريبة: ${setting.vat_no || 'N/A'}</p>
        </div>
        <div class="invoice-meta">
          <h3>${T('Credit Note', 'إشعار دائن')}</h3>
          <p>${T('No', 'رقم')}: <span>${invoiceNo}</span></p>
          <p>${T('Date', 'التاريخ')}: <span>${inv.refund_date || inv.invoice_date || ''}</span></p>
        </div>
      </div>
      <div class="body">
        <div class="info-block">
          <h4>${T('Customer & Ticket Details', 'تفاصيل العميل والتذكرة')}</h4>
          <p><strong>${T('Customer Name', 'اسم العميل')}:</strong> <span>${inv.customers?.name || 'N/A'}</span></p>
          <p><strong>${T('Original Invoice', 'الفاتورة الأصلية')}:</strong> <span>${inv.linked_inv_id || 'N/A'}</span></p>
          <p><strong>${T('Airline', 'خط الطيران')}:</strong> <span>${inv.airline || 'N/A'}</span></p>
          <p><strong>${T('PNR', 'رقم الحجز')}:</strong> <span>${inv.pnr || 'N/A'}</span></p>
          <p><strong>${T('Ticket No', 'رقم التذكرة')}:</strong> <span>${inv.ticket_no || 'N/A'}</span></p>
          <p><strong>${T('Passenger', 'الركاب')}:</strong> <span>${inv.passenger_names || 'N/A'}</span></p>
          <p style="color: #dc2626; font-weight: bold;"><strong>${T('Reason', 'سبب الإلغاء')}:</strong> <span>${inv.refund_reason || 'N/A'}</span></p>
        </div>
        <div class="grand-total"><span>${T('Total Refunded', 'إجمالي الاسترجاع')}</span> <strong>${custRefund.toFixed(2)} SAR</strong></div>
        <div class="status-box"><span>${T('Refund Paid Via', 'طريقة الدفع')}</span> <strong>${payMode}</strong></div>
      </div>
      <div class="footer">
        <div class="qr-code"><img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous"></div>
        <div class="footer-text"><p>${T('System Generated Refund Invoice', 'إشعار دائن صادر من النظام')}</p></div>
        <div style="width: 100px; visibility: hidden;"></div>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// PREMIUM EXPENSE INVOICE TEMPLATE (Bilingual)
// ==========================================
const getExpenseHTML = (exp, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const expNo = exp.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/expense/${expNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;
  const T = (en, ar) => isAr ? `${ar} / ${en}` : `${en} / ${ar}`;
  return `
  <!DOCTYPE html><html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><title>Expense ${expNo}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <style>* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; } body { font-family: ${isAr ? "'Cairo', sans-serif" : "'Poppins', sans-serif"}; padding: 20px; background: #e2e8f0; margin: 0; color: #334155; }
  .invoice-box { max-width: 600px; margin: auto; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
  .header { display: flex; justify-content: space-between; padding: 30px; background: #fff; border-bottom: 4px solid #f1f5f9; }
  .company-info h2 { margin: 0; font-size: 20px; color: #0f172a; font-weight: 800; direction: rtl; } .company-info p { margin: 5px 0 0; font-size: 11px; color: #64748b; direction: rtl; text-align: right; }
  .meta h2 { margin: 0; font-size: 24px; color: #d97706; font-weight: 800; text-transform: uppercase; text-align: right; }
  .body { padding: 40px; } .info-block { margin-bottom: 30px; } .info-block p { margin: 8px 0; font-size: 14px; display: flex; justify-content: space-between; } .info-block p strong { color: #64748b; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  th { background: #d97706; color: #fff; padding: 15px; font-size: 12px; text-transform: uppercase; text-align: left; }
  td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; }
  .grand-total { display: flex; justify-content: space-between; padding: 20px; background: #d97706; color: #fff; border-radius: 12px; font-size: 20px; font-weight: 700; }
  .footer { padding: 30px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; }
  .qr-code img { height: 100px; width: 100px; border-radius: 8px; border: 1px solid #e2e8f0; padding: 5px; background: #fff; }
  @media print { body { background: #fff; padding: 0; margin: 0; } .invoice-box { box-shadow: none; border-radius: 0; max-width: 100%; } img { max-width: 100% !important; } }</style></head>
  <body><div class="invoice-box">
    <div class="header">
      <div class="company-info"><h2>${setting.company_name_ar || 'صعود الطائرة'}</h2><p>${setting.address_ar || ''}<br>${setting.phone || ''}</p></div>
      <div class="meta"><h2>${T('Expense', 'مصروف')}</h2></div>
    </div>
    <div class="body">
      <div class="info-block">
        <p><strong>${T('Voucher No', 'رقم السند')}:</strong> <span>${expNo}</span></p>
        <p><strong>${T('Date', 'التاريخ')}:</strong> <span>${exp.expense_date}</span></p>
        <p><strong>${T('Vendor', 'المورد')}:</strong> <span>${exp.vendor_name}</span></p>
        <p><strong>${T('Type', 'النوع')}:</strong> <span>${exp.expense_type}</span></p>
      </div>
      <table><thead><tr><th>${T('Item', 'الصنف')}</th><th>${T('Qty', 'الكمية')}</th><th>${T('Price', 'السعر')}</th></tr></thead>
      <tbody>${(exp.items && exp.items.length > 0 ? exp.items : [{name: exp.item_name, qty: 1, price: exp.amount}]).map(it => `<tr><td>${it.name}</td><td>${it.qty}</td><td>${parseFloat(it.price).toFixed(2)}</td></tr>`).join('')}</tbody></table>
      <div class="grand-total"><span>${T('Total Amount', 'الإجمالي')}</span> <strong>${(exp.amount || 0).toFixed(2)} SAR</strong></div>
    </div>
    <div class="footer">
      <div class="qr-code"><img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous"></div>
      <div style="text-align: right; color: #64748b; font-size: 14px;"><p>${T('Paid Via', 'طريقة الدفع')}: <strong>${exp.payment_mode}</strong></p></div>
    </div>
  </div></body></html>`;
};

// ==========================================
// PREMIUM SALARY SLIP TEMPLATE (Bilingual & Company Details)
// ==========================================
const getSalarySlipHTML = (pay, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const slipNo = `SLIP-${pay.id.substring(0,8)}`;
  const aiMsg = isAr ? "جزاك الله خيراً على جهودك." : "Thank you for your hard work!";
  const T = (en, ar) => isAr ? `${ar} / ${en}` : `${en} / ${ar}`;
  return `
  <!DOCTYPE html><html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><title>Salary Slip ${slipNo}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; } body { font-family: ${isAr ? "'Cairo', sans-serif" : "'Poppins', sans-serif"}; background: #e2e8f0; margin: 0; padding: 20px; color: #334155; }
  .slip-container { max-width: 800px; margin: auto; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
  .header { background: #4f46e5; color: #fff; padding: 40px; display: flex; justify-content: space-between; align-items: center; }
  .company-info h1 { margin: 0; font-size: 24px; font-weight: 800; } .company-info h2 { margin: 5px 0 0; font-size: 16px; color: #c7d2fe; font-weight: 500; }
  .company-info p { margin: 10px 0 0; font-size: 12px; color: #e0e7ff; }
  .slip-meta { text-align: right; } .slip-meta h1 { margin: 0; font-size: 24px; font-weight: 800; } .slip-meta p { margin: 5px 0; color: #c7d2fe; }
  .body { padding: 40px; } .emp-details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 12px; }
  .emp-details p { margin: 8px 0; font-size: 14px; display: flex; justify-content: space-between; } .emp-details p strong { color: #64748b; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  th { background: #4f46e5; color: #fff; padding: 15px; font-size: 12px; text-transform: uppercase; text-align: left; }
  td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; } .total-row { background: #eef2ff; font-weight: bold; }
  .net-pay { display: flex; justify-content: space-between; padding: 25px; background: #0f172a; color: #fff; border-radius: 12px; margin-bottom: 30px; font-size: 24px; font-weight: 800; }
  .ai-msg { background: #eef2ff; border-left: 4px solid #4f46e5; padding: 20px; border-radius: 12px; font-style: italic; color: #312e81; }
  .footer { text-align: center; padding: 20px; background: #f8fafc; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  @media print { body { background: #fff; padding: 0; margin: 0; } .slip-container { box-shadow: none; border-radius: 0; max-width: 100%; } }</style></head>
  <body><div class="slip-container">
    <div class="header">
      <div class="company-info"><h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1><h2>${setting.company_name_ar || 'صعود الطائرة'}</h2><p>${setting.address_ar || ''} | ${setting.phone || ''}</p></div>
      <div class="slip-meta"><h1>${T('Salary Slip', 'قسيمة راتب')}</h1><p>${T('No', 'رقم')}: ${slipNo} | ${T('Month', 'الشهر')}: ${pay.month}</p></div>
    </div>
    <div class="body">
      <div class="emp-details"><div><p><strong>${T('Employee', 'الموظف')}:</strong> <span>${pay.employees?.name || 'N/A'}</span></p><p><strong>${T('Role', 'المسمى')}:</strong> <span>${pay.employees?.role || 'N/A'}</span></p></div>
      <div style="text-align: right;"><p><strong>${T('Date', 'التاريخ')}:</strong> <span>${pay.payment_date || 'N/A'}</span></p><p><strong>${T('Mode', 'الطريقة')}:</strong> <span>${pay.payment_mode}</span></p></div></div>
      <table><thead><tr><th>${T('Description', 'الوصف')}</th><th style="text-align: right;">${T('Amount', 'المبلغ')}</th></tr></thead>
      <tbody><tr><td>${T('Basic Salary', 'الراتب الأساسي')}</td><td style="text-align: right;">${(pay.base_salary || 0).toFixed(2)}</td></tr>
      <tr><td>${T('Commission', 'العمولة')}</td><td style="text-align: right;">${(pay.commission || 0).toFixed(2)}</td></tr>
      <tr><td>${T('Overtime', 'العمل الإضافي')}</td><td style="text-align: right;">${(pay.overtime || 0).toFixed(2)}</td></tr>
      <tr><td>${T('Advance Deduction', 'خصم السلفة')}</td><td style="text-align: right; color: #dc2626;">- ${(pay.advance_deduction || 0).toFixed(2)}</td></tr>
      <tr class="total-row"><td>${T('Net Pay', 'صافي الراتب')}</td><td style="text-align: right;">${(pay.amount || 0).toFixed(2)}</td></tr></tbody></table>
      <div class="net-pay"><span>${T('Total Net Pay', 'صافي المدفوع')}</span> <strong>${(pay.amount || 0).toFixed(2)} SAR</strong></div>
      <div class="ai-msg"><strong>🤖 ${T('Message', 'رسالة')}:</strong><br>${aiMsg}</div>
    </div>
    <div class="footer"><p>${T('System Generated Salary Slip', 'قسيمة راتب صادرة من النظام')}</p></div>
  </div></body></html>`;
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
  const [lang, setLang] = useState('en');
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
  
  const [invForm, setInvForm] = useState({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '', oldSellPrice: 0, oldBookingDate: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '', status: 'Unpaid' });
  
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
  const [refundForm, setRefundForm] = useState({ id: '', date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: '', creditBalance: 0 });
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

  const tr = translations[lang];

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
        supabase.from('payroll').select('*, employees(name, role)').eq('tenant_id', tId),
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
    const csvContent = [headers.join(','), ...data.map(row => headers.map(header => { let val = row[header]; if (typeof val === 'object' && val !== null) val = val.name || JSON.stringify(val); return `"${val !== undefined && val !== null ? String(val).replace(/"/g, '""') : ''}"`; }).join(','))].join('\n');
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a"); const url = URL.createObjectURL(blob);
    link.setAttribute("href", url); link.setAttribute("download", `${filename}.csv`); link.style.visibility = 'hidden';
    document.body.appendChild(link); link.click(); document.body.removeChild(link); showToast('Exported Successfully!');
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
    lang, setLang, tr, 
    invForm, setInvForm, expForm, setExpForm, corpForm, setCorpForm, creditorForm, setCreditorForm,
    custForm, setCustForm, vendorForm, setVendorForm, pkgForm, setPkgForm, brnForm, setBrnForm,
    empForm, setEmpForm, srvForm, setSrvForm, investForm, setInvestForm, settleForm, setSettleForm,
    refundForm, setRefundForm, transferForm, setTransferForm, setForm, setSetForm, userForm, setUserForm,
    portalForm, setPortalForm, editInvId, setEditInvId, editExpId, setEditExpId, editCorpId, setEditCorpId,
    editCredId, setEditCredId, editCustId, setEditCustId, editVendId, setEditVendId, editPkgId, setEditPkgId,
    editBrnId, setEditBrnId, editEmpId, setEditEmpId, editSrvId, setEditSrvId, editUserId, setEditUserId,
    modal, setModal, passForm, setPassForm, chatInput, setChatInput, chatMessages, setChatMessages,
    previewHTML, setPreviewHTML, getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getContractHTML, today, router, 
    contractCorpName, setContractCorpName, contractType, setContractType, contractMarkup, setContractMarkup,
    contractTerms, setContractTerms, tenantForm, setTenantForm, profileForm, setProfileForm,
    ledgerEmpId, setLedgerEmpId, ledgerCustId, setLedgerCustId, repDate, setRepDate,
    reportTab, setReportTab, statementTab, setStatementTab, page, setPage, 
    chatOpen, setChatOpen, search, setSearch, payFilter, setPayFilter, tblPage, setTblPage, 
    exportToExcel, filterData
  };
}
