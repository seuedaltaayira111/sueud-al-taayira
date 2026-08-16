'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ==========================================
// TRANSLATION ENGINE (EN/AR)
// ==========================================
const translations = {
  en: {
    dashboard: 'Dashboard', create: 'Create Invoice', list: 'Invoices', refunds: 'Refunds', customers: 'Customers', corporates: 'Corporates', creditors: 'Creditors', credit: 'Credit Balances', vendors: 'Vendors', packages: 'Packages', branches: 'Branches', portals: 'Portals', bank: 'Bank & Cash', invest: 'Investors', hr: 'Human Resources', users: 'Users', settings: 'Settings', reports: 'Reports', audit: 'Audit Logs', statements: 'Statements', contract: 'Contracts', offer: 'Offers', superadmin: 'SuperAdmin', profile: 'Profile', profitability: 'Profitability', search: 'Search...', download_excel: 'Export Excel', logout: 'Logout', changePass: 'Change Password', quotations: 'Quotations', ai_dashboard: 'AI Dashboard', hr_advanced: 'HR & Payroll', staff_mistakes: 'Staff Mistakes & Loss', custType: 'Customer Type', individual: 'Individual', corporate: 'Corporate', selectCustomer: 'Select Customer', newCustomer: 'New Customer', customerName: 'Customer Name', customerPhone: 'Customer Phone', passengers: 'Passengers', addPassenger: '+ Add Passenger', portal: 'Portal', service: 'Service', flightTicket: 'Flight Ticket', hotel: 'Hotel', tourPackage: 'Tour Package', visitVisa: 'Visit Visa', umrahVisa: 'Umrah Visa', newService: 'New Service', flightType: 'Flight Type', domestic: 'Domestic', international: 'International', airline: 'Airline', sector: 'Sector', pnr: 'PNR', ticketNo: 'Ticket No', hotelName: 'Hotel Name', checkIn: 'Check In', checkOut: 'Check Out', serviceName: 'Service Name', qty: 'Qty', cost: 'Cost', sell: 'Sell', discount: 'Discount', vatRate: 'VAT Rate', invoiceDate: 'Invoice Date', journeyType: 'Journey Type', single: 'Single', roundTrip: 'Round Trip', multiCity: 'Multi-city', fareType: 'Fare Type', refundable: 'Refundable', nonRefundable: 'Non-Refundable', bookingType: 'Booking Type', newBooking: 'New Booking', reissue: 'Reissue', extraLuggage: 'Extra Luggage', previousBooking: 'Previous Booking', salesPerson: 'Sales Person', paymentMethod: 'Payment Method', cash: 'Cash', bankTransfer: 'Bank Transfer', card: 'Card / Network', credit: 'Credit', creditBalance: 'Credit Balance', tabby: 'Tabby', tamara: 'Tamara', paidAmount: 'Paid Amount (Cash/Bank)', useCreditAmount: 'Use Credit Amount', generateInvoice: 'Generate Invoice', updateInvoice: 'Update Invoice', editInvoice: 'Edit Invoice', invNo: 'Inv No', total: 'Total', due: 'Due', method: 'Method', actions: 'Actions', preview: 'Preview', print: 'Print', edit: 'Edit', delete: 'Delete', quickSettle: 'Quick Settle', refund: 'Refund', changePassword: 'Change Password', newPassword: 'New Password', settlePayment: 'Settle Payment', processRefund: 'Process Refund', companyRefund: 'Company Refund (Portal)', customerRefund: 'Customer Refund Amount', customerRefundMethod: 'Customer Refund Method', refundReason: 'Refund Reason', refundDate: 'Refund Date', documentPreview: 'Document Preview', close: 'Close', cancel: 'Cancel', save: 'Save', mark: 'Mark', logLoss: 'Log Loss', notifications: 'Notifications', customer_statement: 'Cust Statement', recurring_invoices: 'Recurring Invoices', expense_approval: 'Expense Approval', refund_statement: 'Refund Statement', credit_limits: 'Credit Limits', supplier_statement: 'Supplier Statement', multi_branch: 'Multi-Branch', selectEmployee: 'Select Employee', target: 'Target', achieved: 'Achieved', percentage: 'Percentage', checkInTime: 'Check-In', checkOutTime: 'Check-Out', overtime: 'Overtime', deduction: 'Deduction', status: 'Status', present: 'Present', leave: 'Leave', absent: 'Absent', paySalary: 'Pay Salary', generateSlip: 'Generate Salary Slip', attendanceDate: 'Date', baseSalary: 'Base Salary', commission: 'Commission', advDed: 'Adv. Deduct', gift: 'Gift', month: 'Month', mode: 'Mode', bookingDate: 'Booking Date', fareBasis: 'Fare Basis', ticketStatus: 'Ticket Status', confirmed: 'Confirmed', unconfirmed: 'Unconfirmed', waitingList: 'Waiting List', creditorSelect: 'Select Creditor', creditDueDate: 'Credit Due Date', tabbyOrderNo: 'Tabby Order No', tamaraOrderNo: 'Tamara Order No', previousBookingRef: 'Previous Booking Ref', oldTicketNo: 'Old Ticket No', oldPnr: 'Old PNR', oldAirline: 'Old Airline', oldSector: 'Old Sector', oldSellPrice: 'Old Sell Price', oldBookingDate: 'Old Booking Date', creditAutoDeducted: 'Credit Auto-Deducted'
  },
  ar: {
    dashboard: 'لوحة التحكم', create: 'إنشاء فاتورة', list: 'الفواتير', refunds: 'الاسترجاعات', customers: 'العملاء', corporates: 'الشركات', creditors: 'الدائنون', credit: 'أرصدة الائتمان', vendors: 'الموردون', packages: 'الباقات', branches: 'الفروع', portals: 'البوابات', bank: 'البنك والصندوق', invest: 'المستثمرون', hr: 'الموارد البشرية', users: 'المستخدمون', settings: 'الإعدادات', reports: 'التقارير', audit: 'سجل التدقيق', statements: 'الكشوف', contract: 'العقود', offer: 'العروض', superadmin: 'المدير العام', profile: 'الملف الشخصي', profitability: 'الربحية', search: 'بحث...', download_excel: 'تصدير إكسل', logout: 'تسجيل الخروج', changePass: 'تغيير كلمة المرور', quotations: 'عروض الأسعار', ai_dashboard: 'لوحة الذكاء الاصطناعي', hr_advanced: 'الموارد البشرية والرواتب', staff_mistakes: 'أخطاء الموظفين والخسائر', custType: 'نوع العميل', individual: 'فرد', corporate: 'شركة', selectCustomer: 'اختر العميل', newCustomer: 'عميل جديد', customerName: 'اسم العميل', customerPhone: 'هاتف العميل', passengers: 'الركاب', addPassenger: '+ إضافة راكب', portal: 'البوابة', service: 'الخدمة', flightTicket: 'تذكرة طيران', hotel: 'فندق', tourPackage: 'باقة سياحية', visitVisa: 'تأشيرة زيارة', umrahVisa: 'تأشيرة عمرة', newService: 'خدمة جديدة', flightType: 'نوع الرحلة', domestic: 'داخلية', international: 'دولية', airline: 'خط الطيران', sector: 'القطاع', pnr: 'رقم الحجز', ticketNo: 'رقم التذكرة', hotelName: 'اسم الفندق', checkIn: 'تاريخ الوصول', checkOut: 'تاريخ المغادرة', serviceName: 'اسم الخدمة', qty: 'الكمية', cost: 'التكلفة', sell: 'البيع', discount: 'الخصم', vatRate: 'نسبة الضريبة', invoiceDate: 'تاريخ الفاتورة', journeyType: 'نوع الرحلة', single: 'ذهاب', roundTrip: 'ذهاب وعودة', multiCity: 'مدن متعددة', fareType: 'نوع الأجرة', refundable: 'قابلة للاسترداد', nonRefundable: 'غير قابلة للاسترداد', bookingType: 'نوع الحجز', newBooking: 'حجز جديد', reissue: 'إعادة إصدار', extraLuggage: 'أمتعة إضافية', previousBooking: 'حجز سابق', salesPerson: 'موظف المبيعات', paymentMethod: 'طريقة الدفع', cash: 'نقداً', bankTransfer: 'تحويل بنكي', card: 'بطاقة / شبكة', credit: 'آجل', creditBalance: 'رصيد ائتماني', tabby: 'تابي', tamara: 'تمارا', paidAmount: 'المبلغ المدفوع', useCreditAmount: 'استخدام مبلغ الرصيد', generateInvoice: 'إنشاء الفاتورة', updateInvoice: 'تحديث الفاتورة', editInvoice: 'تعديل الفاتورة', invNo: 'رقم الفاتورة', total: 'الإجمالي', due: 'المتبقي', method: 'الطريقة', actions: 'إجراءات', preview: 'معاينة', print: 'طباعة', edit: 'تعديل', delete: 'حذف', quickSettle: 'تسوية سريعة', refund: 'استرجاع', changePassword: 'تغيير كلمة المرور', newPassword: 'كلمة المرور الجديدة', settlePayment: 'تسوية الدفعة', processRefund: 'معالجة الاسترجاع', companyRefund: 'استرجاع الشركة', customerRefund: 'مبلغ استرجاع العميل', customerRefundMethod: 'طريقة استرجاع العميل', refundReason: 'سبب الاسترجاع', refundDate: 'تاريخ الاسترجاع', documentPreview: 'معاينة المستند', close: 'إغلاق', cancel: 'إلغاء', save: 'حفظ', mark: 'تسجيل', logLoss: 'تسجيل خسارة', notifications: 'الإشعارات', customer_statement: 'كشف العميل', recurring_invoices: 'الفواتير المتكررة', expense_approval: 'موافقة المصروفات', refund_statement: 'كشف الاسترجاعات', credit_limits: 'حدود الائتمان', supplier_statement: 'كشف الموردين', multi_branch: 'متعدد الفروع', selectEmployee: 'اختر الموظف', target: 'الهدف', achieved: 'المحقق', percentage: 'النسبة', checkInTime: 'الحضور', checkOutTime: 'الانصراف', overtime: 'العمل الإضافي', deduction: 'الخصم', status: 'الحالة', present: 'حاضر', leave: 'إجازة', absent: 'غائب', paySalary: 'صرف الراتب', generateSlip: 'إنشاء قسيمة راتب', attendanceDate: 'التاريخ', baseSalary: 'الراتب الأساسي', commission: 'العمولة', advDed: 'خصم السلفة', gift: 'مكافأة', month: 'الشهر', mode: 'الطريقة', bookingDate: 'تاريخ الحجز', fareBasis: 'أساس الأجرة', ticketStatus: 'حالة التذكرة', confirmed: 'مؤكدة', unconfirmed: 'غير مؤكدة', waitingList: 'قائمة الانتظار', creditorSelect: 'اختر الدائن', creditDueDate: 'تاريخ استحقاق الآجل', tabbyOrderNo: 'رقم طلب تابي', tamaraOrderNo: 'رقم طلب تمارا', previousBookingRef: 'مرجع الحجز السابق', oldTicketNo: 'رقم التذكرة القديم', oldPnr: 'رقم الحجز القديم', oldAirline: 'الخطوط القديمة', oldSector: 'القطاع القديم', oldSellPrice: 'سعر البيع القديم', oldBookingDate: 'تاريخ الحجز القديم', creditAutoDeducted: 'الرصيد المخصم تلقائياً'
  }
};

// ==========================================
// PREMIUM SALE INVOICE TEMPLATE
// ==========================================
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;
  const T = (en, ar) => isAr ? ar : en;
  const align = isAr ? 'right' : 'left';
  const alignOpp = isAr ? 'left' : 'right';
  
  // FIX: Calculate all payment details properly
  const totalSell = inv.total_sell || 0;
  const discount = inv.discount || 0;
  const subTotal = totalSell + discount; // Sell before discount
  const vatRate = inv.vat > 0 && totalSell > 0 ? Math.round((inv.vat / totalSell) * 100) : 0;
  const vat = inv.vat || 0;
  const total = inv.total || 0;
  const paidAmount = inv.paid_amount || 0;
  const usedCredit = inv.used_credit || 0;
  const cashPaid = paidAmount - usedCredit;
  const dueAmount = inv.due_amount || 0;
  const unitPrice = (inv.qty || 1) > 0 ? totalSell / inv.qty : totalSell;
  
  // FIX: Determine payment method display
  let paymentDisplay = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Tabby' && inv.tabby_order_no) paymentDisplay = `Tabby (${inv.tabby_order_no})`;
  if (inv.payment_method === 'Tamara' && inv.tamara_order_no) paymentDisplay = `Tamara (${inv.tamara_order_no})`;
  if (inv.payment_method === 'Credit' && inv.credit_due_date) paymentDisplay = `Credit (Due: ${inv.credit_due_date})`;
  
  // FIX: Booking type display
  const bookingType = inv.booking_type || 'New Booking';
  const isReissue = bookingType === 'Reissue';
  const isExtraLuggage = bookingType === 'Extra Luggage';
  const isPrevBooking = bookingType === 'Previous Booking';

  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${dir}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      body { font-family: ${isAr ? "'Cairo', 'Inter', sans-serif" : "'Inter', 'Cairo', sans-serif"}; background: #f0f4f8; margin: 0; padding: 30px; color: #1e293b; }
      .invoice-box { max-width: 850px; margin: auto; background: #fff; border-radius: 0; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
      
      /* HEADER - Navy gradient with gold accent */
      .header { display: flex; justify-content: space-between; align-items: flex-start; padding: 35px 40px; background: linear-gradient(135deg, #0c1d3a 0%, #1a365d 100%); color: #fff; }
      .company-info { flex: 1; }
      .company-info .logo { height: 65px; margin-bottom: 12px; border-radius: 8px; background: rgba(255,255,255,0.1); padding: 5px; }
      .company-info h2 { font-size: 22px; font-weight: 800; color: #fbbf24; letter-spacing: 0.5px; direction: rtl; }
      .company-info h1 { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
      .company-info p { font-size: 11px; color: rgba(255,255,255,0.5); line-height: 1.7; direction: rtl; text-align: right; margin-top: 10px; }
      .invoice-meta { text-align: ${alignOpp}; min-width: 220px; }
      .invoice-meta h3 { font-size: 32px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; }
      .invoice-meta .inv-no { font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 8px; }
      .invoice-meta .inv-no span { color: #fbbf24; font-weight: 700; }
      .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 12px; letter-spacing: 0.5px; ${dueAmount > 0 ? 'background: rgba(251,191,36,0.2); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3);' : 'background: rgba(52,211,153,0.2); color: #34d399; border: 1px solid rgba(52,211,153,0.3);'} }
      
      /* BODY */
      .body { padding: 35px 40px; }
      .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
      
      /* Details Grid */
      .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 30px; }
      .info-block { padding: 18px; background: #f8fafc; border-radius: 10px; border-${align}: 3px solid #1a365d; }
      .info-block.gold-border { border-${align}-color: #f59e0b; }
      .info-block h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 10px; font-weight: 700; }
      .info-block .row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
      .info-block .row .label { color: #64748b; font-weight: 500; }
      .info-block .row .value { color: #0f172a; font-weight: 600; text-align: ${alignOpp}; }
      
      /* Previous Booking Block */
      .prev-booking { padding: 18px; background: #fffbeb; border-radius: 10px; border-${align}: 3px solid #f59e0b; margin-bottom: 25px; }
      .prev-booking h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #d97706; margin-bottom: 10px; font-weight: 700; }
      .prev-booking .row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
      .prev-booking .row .label { color: #92400e; font-weight: 500; }
      .prev-booking .row .value { color: #78350f; font-weight: 600; text-align: ${alignOpp}; }
      
      /* Table */
      table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
      thead th { text-align: ${align}; padding: 12px 15px; background: #0c1d3a; color: #fbbf24; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
      thead th.right { text-align: ${alignOpp}; }
      thead th.center { text-align: center; }
      tbody td { padding: 14px 15px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #334155; }
      tbody td.right { text-align: ${alignOpp}; font-weight: 600; color: #0f172a; }
      tbody td.center { text-align: center; }
      tbody td strong { color: #0f172a; }
      
      /* Totals */
      .totals-section { display: flex; justify-content: flex-end; margin-bottom: 30px; }
      .totals-box { width: 320px; }
      .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 13px; color: #64748b; }
      .total-row .val { color: #0f172a; font-weight: 600; }
      .total-row.discount .val { color: #059669; }
      .grand-total { display: flex; justify-content: space-between; padding: 18px; background: #0c1d3a; color: #fff; border-radius: 10px; margin-top: 8px; font-size: 18px; font-weight: 800; }
      .grand-total .val { color: #fbbf24; }
      
      /* Payment Breakdown */
      .payment-breakdown { margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; }
      .payment-breakdown h5 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 10px; font-weight: 700; }
      .pay-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
      .pay-row .label { color: #64748b; }
      .pay-row .val { font-weight: 600; }
      .pay-row .val.green { color: #059669; }
      .pay-row .val.red { color: #ef4444; }
      .pay-row .val.purple { color: #7c3aed; }
      .pay-row .val.blue { color: #2563eb; }
      
      /* Footer */
      .footer { padding: 25px 40px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; }
      .footer-text { text-align: center; flex: 1; }
      .footer-text p { font-size: 11px; color: #94a3b8; }
      .footer-text strong { color: #475569; }
      .qr-code img { height: 80px; width: 80px; border-radius: 6px; border: 1px solid #e2e8f0; padding: 3px; background: #fff; }
      
      @media print { body { background: #fff; padding: 0; margin: 0; } .invoice-box { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; } img { max-width: 100% !important; } }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <div class="company-info">
          ${setting.logo_url ? `<img src="${setting.logo_url}" crossorigin="anonymous" class="logo" />` : ''}
          <h2>${setting.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <p>${setting.address_ar || ''}<br/>${T('VAT', 'ضريبة')}: ${setting.vat_no || 'N/A'} | ${T('CR', 'سجل')}: ${setting.cr_no || 'N/A'}${setting.license_no ? ` | ${T('License', 'ترخيص')}: ${setting.license_no}` : ''}</p>
        </div>
        <div class="invoice-meta">
          <h3>${T('TAX INVOICE', 'فاتورة ضريبية')}</h3>
          <div class="inv-no">${T('Invoice No', 'رقم الفاتورة')}: <span>${invoiceNo}</span></div>
          <div class="inv-no">${T('Date', 'التاريخ')}: <span>${inv.invoice_date || ''}</span></div>
          ${inv.booking_date ? `<div class="inv-no">${T('Booking Date', 'تاريخ الحجز')}: <span>${inv.booking_date}</span></div>` : ''}
          <div class="status-badge">${dueAmount > 0 ? T('UNPAID', 'غير مدفوعة') : T('PAID', 'مدفوعة')}</div>
        </div>
      </div>
      
      <div class="body">
        <div class="details-grid">
          <div class="info-block">
            <h4>${T('Bill To', 'فاتورة إلى')}</h4>
            <div class="row"><span class="label">${T('Name', 'الاسم')}</span><span class="value">${inv.customers?.name || inv.corporates?.name || 'N/A'}</span></div>
            ${inv.corporates?.vat_no ? `<div class="row"><span class="label">${T('VAT No', 'الرقم الضريبي')}</span><span class="value">${inv.corporates.vat_no}</span></div>` : ''}
            <div class="row"><span class="label">${T('Phone', 'الهاتف')}</span><span class="value">${inv.customers?.phone || inv.corporates?.phone || 'N/A'}</span></div>
            <div class="row"><span class="label">${T('Sales Person', 'موظف المبيعات')}</span><span class="value">${inv.employees?.name || 'N/A'}</span></div>
          </div>
          <div class="info-block gold-border">
            <h4>${T('Booking Details', 'تفاصيل الحجز')}</h4>
            <div class="row"><span class="label">${T('Service', 'الخدمة')}</span><span class="value">${inv.service_type || 'N/A'}</span></div>
            ${inv.booking_type && inv.booking_type !== 'New Booking' ? `<div class="row"><span class="label">${T('Booking Type', 'نوع الحجز')}</span><span class="value" style="color:#d97706; font-weight:700;">${inv.booking_type}</span></div>` : ''}
            ${inv.airline ? `<div class="row"><span class="label">${T('Airline', 'خط الطيران')}</span><span class="value">${inv.airline}</span></div>` : ''}
            ${inv.flight_sector ? `<div class="row"><span class="label">${T('Sector', 'القطاع')}</span><span class="value">${inv.flight_sector}</span></div>` : ''}
            ${inv.flight_type ? `<div class="row"><span class="label">${T('Flight Type', 'نوع الرحلة')}</span><span class="value">${inv.flight_type}</span></div>` : ''}
            ${inv.flight_journey ? `<div class="row"><span class="label">${T('Journey', 'الرحلة')}</span><span class="value">${inv.flight_journey}</span></div>` : ''}
            <div class="row"><span class="label">${T('Ticket No', 'رقم التذكرة')}</span><span class="value">${inv.ticket_no || 'N/A'}</span></div>
            <div class="row"><span class="label">${T('PNR', 'رقم الحجز')}</span><span class="value">${inv.pnr || 'N/A'}</span></div>
            ${inv.refundable_status ? `<div class="row"><span class="label">${T('Fare Type', 'نوع الأجرة')}</span><span class="value">${inv.refundable_status}</span></div>` : ''}
            ${inv.passenger_names ? `<div class="row"><span class="label">${T('Passenger', 'الركاب')}</span><span class="value" style="font-size:11px; max-width:180px; text-align:${alignOpp};">${inv.passenger_names.replace(/\n/g, ', ')}</span></div>` : ''}
          </div>
        </div>
        
        ${isPrevBooking || isReissue ? `
        <div class="prev-booking">
          <h4>⚠️ ${T('Previous Booking Details', 'تفاصيل الحجز السابق')}</h4>
          ${inv.linked_inv_id ? `<div class="row"><span class="label">${T('Original Invoice', 'الفاتورة الأصلية')}</span><span class="value">${inv.linked_inv_id}</span></div>` : ''}
          ${inv.old_airline ? `<div class="row"><span class="label">${T('Old Airline', 'الخطوط القديمة')}</span><span class="value">${inv.old_airline}</span></div>` : ''}
          ${inv.old_sector ? `<div class="row"><span class="label">${T('Old Sector', 'القطاع القديم')}</span><span class="value">${inv.old_sector}</span></div>` : ''}
          ${inv.old_ticket_no ? `<div class="row"><span class="label">${T('Old Ticket No', 'التذكرة القديمة')}</span><span class="value">${inv.old_ticket_no}</span></div>` : ''}
          ${inv.old_pnr ? `<div class="row"><span class="label">${T('Old PNR', 'الحجز القديم')}</span><span class="value">${inv.old_pnr}</span></div>` : ''}
          ${inv.old_sell_price ? `<div class="row"><span class="label">${T('Old Sell Price', 'سعر البيع القديم')}</span><span class="value">${parseFloat(inv.old_sell_price).toFixed(2)} SAR</span></div>` : ''}
          ${inv.old_booking_date ? `<div class="row"><span class="label">${T('Old Booking Date', 'تاريخ الحجز القديم')}</span><span class="value">${inv.old_booking_date}</span></div>` : ''}
          ${usedCredit > 0 ? `<div class="row"><span class="label">${T('Credit Used', 'الرصيد المستخدم')}</span><span class="value" style="color:#7c3aed; font-weight:700;">${usedCredit.toFixed(2)} SAR</span></div>` : ''}
        </div>` : ''}
        
        <div class="section-title">${T('Invoice Items', 'عناصر الفاتورة')}</div>
        <table>
          <thead>
            <tr>
              <th>${T('Description', 'الوصف')}</th>
              <th class="center">${T('Qty', 'الكمية')}</th>
              <th class="right">${T('Unit Price', 'سعر الوحدة')}</th>
              <th class="right">${T('Total', 'الإجمالي')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${inv.sector || inv.service_type || 'Service'}</strong></td>
              <td class="center">${inv.qty || 1}</td>
              <td class="right">${unitPrice.toFixed(2)}</td>
              <td class="right">${totalSell.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="totals-section">
          <div class="totals-box">
            <div class="total-row"><span>${T('Subtotal', 'الإجمالي قبل الخصم')}</span><span class="val">${subTotal.toFixed(2)} SAR</span></div>
            ${discount > 0 ? `<div class="total-row discount"><span>${T('Discount', 'الخصم')}</span><span class="val">- ${discount.toFixed(2)} SAR</span></div>` : ''}
            <div class="total-row"><span>${T('Taxable Amount', 'المبلغ الخاضع للضريبة')}</span><span class="val">${totalSell.toFixed(2)} SAR</span></div>
            <div class="total-row"><span>${T('VAT', 'ضريبة القيمة المضافة')} (${vatRate}%)</span><span class="val">${vat.toFixed(2)} SAR</span></div>
            <div class="grand-total"><span>${T('Grand Total', 'الإجمالي شامل الضريبة')}</span><span class="val">${total.toFixed(2)} SAR</span></div>
          </div>
        </div>
        
        <div class="payment-breakdown">
          <h5>${T('Payment Breakdown', 'تفاصيل الدفع')}</h5>
          <div class="pay-row"><span class="label">${T('Payment Method', 'طريقة الدفع')}</span><span class="val blue">${paymentDisplay}</span></div>
          ${usedCredit > 0 ? `<div class="pay-row"><span class="label">${T('Credit Balance Used', 'رصيد ائتماني مستخدم')}</span><span class="val purple">- ${usedCredit.toFixed(2)} SAR</span></div>` : ''}
          ${cashPaid > 0 ? `<div class="pay-row"><span class="label">${T('Cash/Bank Paid', 'المدفوع نقداً/بنك')}</span><span class="val green">${cashPaid.toFixed(2)} SAR</span></div>` : ''}
          <div class="pay-row" style="border-top:1px solid #e2e8f0; padding-top:8px; margin-top:4px;"><span class="label" style="font-weight:700;">${T('Total Paid', 'إجمالي المدفوع')}</span><span class="val green" style="font-size:15px;">${paidAmount.toFixed(2)} SAR</span></div>
          <div class="pay-row"><span class="label" style="font-weight:700;">${T('Amount Due', 'المبلغ المتبقي')}</span><span class="val ${dueAmount > 0 ? 'red' : 'green'}" style="font-size:15px;">${dueAmount.toFixed(2)} SAR</span></div>
        </div>
      </div>
      
      <div class="footer">
        <div class="qr-code"><img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous"></div>
        <div class="footer-text">
          <strong>${setting.company_name_en || ''} ${setting.company_name_ar ? '| ' + setting.company_name_ar : ''}</strong>
          <p>${setting.invoice_footer || T('Thank you for your business!', 'شكراً لتعاملكم معنا!')}</p>
          ${setting.phone ? `<p>${setting.phone}</p>` : ''}
        </div>
        <div style="width: 86px;"></div>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// PREMIUM REFUND INVOICE TEMPLATE
// ==========================================
const getRefundHTML = (inv, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;
  const T = (en, ar) => isAr ? ar : en;
  const align = isAr ? 'right' : 'left';
  const alignOpp = isAr ? 'left' : 'right';
  const compRefund = inv.refund_company || 0;
  const custRefund = inv.refund_customer || 0;
  const officeProfit = compRefund - custRefund;
  
  let refundMethodDisplay = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit') refundMethodDisplay = isAr ? 'أضيف إلى الرصيد الائتماني' : 'Added to Credit Balance';

  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${dir}">
  <head>
    <meta charset="UTF-8">
    <title>Refund ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      body { font-family: ${isAr ? "'Cairo', 'Inter', sans-serif" : "'Inter', 'Cairo', sans-serif"}; background: #f0f4f8; margin: 0; padding: 30px; color: #1e293b; }
      .invoice-box { max-width: 850px; margin: auto; background: #fff; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
      .header { display: flex; justify-content: space-between; align-items: flex-start; padding: 35px 40px; background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); color: #fff; }
      .company-info { flex: 1; }
      .company-info .logo { height: 65px; margin-bottom: 12px; border-radius: 8px; background: rgba(255,255,255,0.1); padding: 5px; }
      .company-info h2 { font-size: 22px; font-weight: 800; color: #fbbf24; direction: rtl; }
      .company-info h1 { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
      .company-info p { font-size: 11px; color: rgba(255,255,255,0.5); line-height: 1.7; direction: rtl; text-align: right; margin-top: 10px; }
      .invoice-meta { text-align: ${alignOpp}; min-width: 220px; }
      .invoice-meta h3 { font-size: 32px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; }
      .invoice-meta .inv-no { font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 8px; }
      .invoice-meta .inv-no span { color: #fbbf24; font-weight: 700; }
      .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 12px; background: rgba(251,191,36,0.2); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
      .body { padding: 35px 40px; }
      .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #fecaca; }
      .info-block { padding: 18px; background: #fff5f5; border-radius: 10px; border-${align}: 3px solid #dc2626; margin-bottom: 20px; }
      .info-block h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #dc2626; margin-bottom: 10px; font-weight: 700; }
      .info-block .row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
      .info-block .row .label { color: #991b1b; font-weight: 500; }
      .info-block .row .value { color: #7f1d1d; font-weight: 600; text-align: ${alignOpp}; }
      .refund-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
      .refund-card { padding: 20px; background: #fef2f2; border-radius: 10px; text-align: center; border: 1px solid #fecaca; }
      .refund-card h5 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #dc2626; margin-bottom: 8px; }
      .refund-card .amount { font-size: 28px; font-weight: 800; color: #991b1b; }
      .refund-card.profit { background: #f0fdf4; border-color: #bbf7d0; }
      .refund-card.profit h5 { color: #059669; }
      .refund-card.profit .amount { color: #047857; }
      .payment-info { padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; margin-top: 20px; }
      .payment-info h5 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 10px; font-weight: 700; }
      .pay-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
      .pay-row .label { color: #64748b; }
      .pay-row .val { font-weight: 600; }
      .footer { padding: 25px 40px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; }
      .footer-text { text-align: center; flex: 1; }
      .footer-text p { font-size: 11px; color: #94a3b8; }
      .qr-code img { height: 80px; width: 80px; border-radius: 6px; border: 1px solid #e2e8f0; padding: 3px; background: #fff; }
      @media print { body { background: #fff; padding: 0; margin: 0; } .invoice-box { box-shadow: none; margin: 0; max-width: 100%; } }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <div class="company-info">
          ${setting.logo_url ? `<img src="${setting.logo_url}" crossorigin="anonymous" class="logo" />` : ''}
          <h2>${setting.company_name_ar || 'صعود الطائرة'}</h2>
          <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <p>${setting.address_ar || ''}<br/>${T('VAT', 'ضريبة')}: ${setting.vat_no || 'N/A'}</p>
        </div>
        <div class="invoice-meta">
          <h3>${T('REFUND', 'استرجاع')}</h3>
          <div class="inv-no">${T('Refund No', 'رقم الاسترجاع')}: <span>${invoiceNo}</span></div>
          <div class="inv-no">${T('Date', 'التاريخ')}: <span>${inv.refund_date || inv.invoice_date || ''}</span></div>
          ${inv.linked_inv_id ? `<div class="inv-no">${T('Original Inv', 'الفاتورة الأصلية')}: <span>${inv.linked_inv_id}</span></div>` : ''}
          <div class="status-badge">${T('REFUND PROCESSED', 'تم الاسترجاع')}</div>
        </div>
      </div>
      <div class="body">
        <div class="info-block">
          <h4>${T('Customer & Booking Info', 'معلومات العميل والحجز')}</h4>
          <div class="row"><span class="label">${T('Customer', 'العميل')}</span><span class="value">${inv.customers?.name || 'N/A'}</span></div>
          <div class="row"><span class="label">${T('Phone', 'الهاتف')}</span><span class="value">${inv.customers?.phone || 'N/A'}</span></div>
          <div class="row"><span class="label">${T('Service', 'الخدمة')}</span><span class="value">${inv.service_type || 'N/A'}</span></div>
          <div class="row"><span class="label">${T('Airline', 'خط الطيران')}</span><span class="value">${inv.airline || 'N/A'}</span></div>
          <div class="row"><span class="label">${T('Ticket No', 'التذكرة')}</span><span class="value">${inv.ticket_no || 'N/A'}</span></div>
          ${inv.refund_reason ? `<div class="row"><span class="label">${T('Refund Reason', 'سبب الاسترجاع')}</span><span class="value" style="color:#dc2626;">${inv.refund_reason}</span></div>` : ''}
        </div>
        
        <div class="section-title">${T('Refund Breakdown', 'تفاصيل الاسترجاع')}</div>
        <div class="refund-grid">
          <div class="refund-card">
            <h5>${T('Company Refund (Portal)', 'استرجاع الشركة')}</h5>
            <div class="amount">${compRefund.toFixed(2)} SAR</div>
          </div>
          <div class="refund-card">
            <h5>${T('Customer Refund', 'استرجاع العميل')}</h5>
            <div class="amount">${custRefund.toFixed(2)} SAR</div>
          </div>
        </div>
        <div class="refund-grid">
          <div class="refund-card profit">
            <h5>${T('Office Profit from Refund', 'ربح المكتب من الاسترجاع')}</h5>
            <div class="amount">${officeProfit.toFixed(2)} SAR</div>
          </div>
          <div class="refund-card" style="background:#eff6ff; border-color:#bfdbfe;">
            <h5 style="color:#2563eb;">${T('Original Invoice Total', 'إجمالي الفاتورة الأصلية')}</h5>
            <div class="amount" style="color:#1d4ed8;">${(inv.total || 0).toFixed(2)} SAR</div>
          </div>
        </div>
        
        <div class="payment-info">
          <h5>${T('Refund Payment Details', 'تفاصيل دفع الاسترجاع')}</h5>
          <div class="pay-row"><span class="label">${T('Refund Method', 'طريقة الاسترجاع')}</span><span class="val" style="color:#2563eb;">${refundMethodDisplay}</span></div>
          ${inv.payment_method === 'Credit' ? `<div class="pay-row"><span class="label">${T('Added to Credit Balance', 'أضيف إلى الرصيد الائتماني')}</span><span class="val" style="color:#7c3aed;">${custRefund.toFixed(2)} SAR</span></div>` : ''}
        </div>
      </div>
      <div class="footer">
        <div class="qr-code"><img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous"></div>
        <div class="footer-text">
          <strong>${setting.company_name_en || ''} ${setting.company_name_ar ? '| ' + setting.company_name_ar : ''}</strong>
          <p>${setting.invoice_footer || T('Thank you!', 'شكراً!')}</p>
        </div>
        <div style="width: 86px;"></div>
      </div>
    </div>
  </body>
  </html>`;
};

// ==========================================
// EXPENSE VOUCHER TEMPLATE
// ==========================================
const getExpenseHTML = (exp, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const expNo = exp.invoice_no || `EXP-${exp.id?.substring(0,8) || 'N/A'}`;
  const trackUrl = `https://sueud-al-taayira.vercel.app`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackUrl)}`;
  const T = (en, ar) => isAr ? ar : en;
  const align = isAr ? 'right' : 'left';
  const alignOpp = isAr ? 'left' : 'right';
  const items = exp.items && exp.items.length > 0 ? exp.items : [{ name: exp.item_name || 'Item', qty: 1, price: exp.amount || 0 }];
  const subTotal = items.reduce((sum, it) => sum + ((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)), 0);
  const vat = (exp.amount || 0) - subTotal;
  const vatRate = vat > 0 && subTotal > 0 ? Math.round((vat / subTotal) * 100) : 0;

  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${dir}">
  <head>
    <meta charset="UTF-8">
    <title>Expense ${expNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      body { font-family: ${isAr ? "'Cairo', 'Inter', sans-serif" : "'Inter', 'Cairo', sans-serif"}; background: #f0f4f8; margin: 0; padding: 30px; color: #1e293b; }
      .invoice-box { max-width: 850px; margin: auto; background: #fff; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
      .header { display: flex; justify-content: space-between; align-items: flex-start; padding: 35px 40px; background: linear-gradient(135deg, #7c2d12 0%, #9a3412 100%); color: #fff; }
      .company-info h2 { font-size: 22px; font-weight: 800; color: #fbbf24; direction: rtl; }
      .company-info h1 { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
      .invoice-meta { text-align: ${alignOpp}; }
      .invoice-meta h3 { font-size: 28px; font-weight: 800; color: #fbbf24; text-transform: uppercase; }
      .invoice-meta p { font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 5px; }
      .invoice-meta p span { color: #fbbf24; font-weight: 700; }
      .body { padding: 35px 40px; }
      .info-block { padding: 18px; background: #fff7ed; border-radius: 10px; border-${align}: 3px solid #ea580c; margin-bottom: 25px; }
      .info-block h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #ea580c; margin-bottom: 10px; font-weight: 700; }
      .info-block .row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
      .info-block .row .label { color: #9a3412; font-weight: 500; }
      .info-block .row .value { color: #7c2d12; font-weight: 600; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
      thead th { text-align: ${align}; padding: 12px; background: #7c2d12; color: #fbbf24; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
      thead th.right { text-align: ${alignOpp}; }
      tbody td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
      tbody td.right { text-align: ${alignOpp}; font-weight: 600; }
      .totals { text-align: ${alignOpp}; margin-top: 15px; }
      .totals p { font-size: 13px; margin: 5px 0; color: #64748b; }
      .totals h3 { font-size: 22px; color: #ea580c; font-weight: 800; margin-top: 10px; }
      .footer { padding: 25px 40px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; }
      .footer-text { text-align: center; flex: 1; }
      .footer-text p { font-size: 11px; color: #94a3b8; }
      .qr-code img { height: 80px; width: 80px; border-radius: 6px; border: 1px solid #e2e8f0; padding: 3px; background: #fff; }
      @media print { body { background: #fff; padding: 0; margin: 0; } .invoice-box { box-shadow: none; margin: 0; max-width: 100%; } }
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
          <h3>${T('EXPENSE VOUCHER', 'سند صرف')}</h3>
          <p>${T('No', 'الرقم')}: <span>${expNo}</span></p>
          <p>${T('Date', 'التاريخ')}: <span>${exp.expense_date || ''}</span></p>
        </div>
      </div>
      <div class="body">
        <div class="info-block">
          <h4>${T('Vendor & Expense Details', 'تفاصيل المورد والمصروف')}</h4>
          <div class="row"><span class="label">${T('Vendor', 'المورد')}</span><span class="value">${exp.vendor_name || 'N/A'}</span></div>
          ${exp.vendor_vat ? `<div class="row"><span class="label">${T('Vendor VAT', 'ضريبي المورد')}</span><span class="value">${exp.vendor_vat}</span></div>` : ''}
          <div class="row"><span class="label">${T('Type', 'النوع')}</span><span class="value">${exp.expense_type || 'N/A'}</span></div>
          <div class="row"><span class="label">${T('Payment Mode', 'طريقة الدفع')}</span><span class="value">${exp.payment_mode || 'Cash'}</span></div>
        </div>
        <table>
          <thead><tr><th>${T('Item', 'الصنف')}</th><th class="right">${T('Qty', 'الكمية')}</th><th class="right">${T('Price', 'السعر')}</th><th class="right">${T('Total', 'الإجمالي')}</th></tr></thead>
          <tbody>
            ${items.map(it => `<tr><td>${it.name || 'Item'}</td><td class="right">${it.qty || 1}</td><td class="right">${parseFloat(it.price || 0).toFixed(2)}</td><td class="right">${((parseFloat(it.qty)||0)*(parseFloat(it.price)||0)).toFixed(2)}</td></tr>`).join('')}
          </tbody>
        </table>
        <div class="totals">
          <p>${T('Subtotal', 'الإجمالي')}: <strong>${subTotal.toFixed(2)} SAR</strong></p>
          ${vat > 0 ? `<p>${T('VAT', 'ضريبة')} (${vatRate}%): <strong>${vat.toFixed(2)} SAR</strong></p>` : ''}
          <h3>${T('Grand Total', 'الإجمالي الكلي')}: ${(exp.amount || 0).toFixed(2)} SAR</h3>
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
// SALARY SLIP TEMPLATE
// ==========================================
const getSalarySlipHTML = (pay, s, lang = 'en') => {
  const setting = s || {};
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const slipNo = `SLIP-${pay.id?.substring(0,8) || 'N/A'}`;
  const T = (en, ar) => isAr ? ar : en;
  const align = isAr ? 'right' : 'left';
  const alignOpp = isAr ? 'left' : 'right';

  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${dir}">
  <head>
    <meta charset="UTF-8">
    <title>Salary Slip ${slipNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
      body { font-family: ${isAr ? "'Cairo', 'Inter', sans-serif" : "'Inter', 'Cairo', sans-serif"}; background: #f0f4f8; margin: 0; padding: 30px; color: #1e293b; }
      .slip { max-width: 800px; margin: auto; background: #fff; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-radius: 0; }
      .header { background: linear-gradient(135deg, #312e81 0%, #4338ca 100%); color: #fff; padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; }
      .header h1 { font-size: 22px; font-weight: 800; }
      .header h2 { font-size: 15px; color: #c7d2fe; margin-top: 4px; }
      .header .slip-info { text-align: ${alignOpp}; }
      .header .slip-info h1 { color: #fbbf24; }
      .header .slip-info p { font-size: 13px; color: #c7d2fe; margin-top: 4px; }
      .body { padding: 35px 40px; }
      .emp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f5f3ff; padding: 20px; border-radius: 10px; margin-bottom: 25px; }
      .emp-grid p { font-size: 13px; margin: 3px 0; }
      .emp-grid .label { color: #64748b; font-weight: 500; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
      th, td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
      th { text-align: ${align}; background: #312e81; color: #fbbf24; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
      th.right, td.right { text-align: ${alignOpp}; }
      .net-pay { background: #312e81; color: #fbbf24; padding: 18px; border-radius: 10px; text-align: center; margin-top: 15px; font-size: 22px; font-weight: 800; }
      .footer { text-align: center; padding: 20px 40px; background: #f8fafc; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      @media print { body { background: #fff; padding: 0; margin: 0; } .slip { box-shadow: none; margin: 0; max-width: 100%; } }
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
          <h1>${T('SALARY SLIP', 'قسيمة راتب')}</h1>
          <p>${T('No', 'رقم')}: ${slipNo} | ${T('Month', 'الشهر')}: ${pay.month}</p>
        </div>
      </div>
      <div class="body">
        <div class="emp-grid">
          <div>
            <p><span class="label">${T('Employee', 'الموظف')}:</span> <strong>${pay.employees?.name || 'N/A'}</strong></p>
            <p><span class="label">${T('Role', 'المسمى')}:</span> ${pay.employees?.role || 'N/A'}</p>
          </div>
          <div style="text-align:${alignOpp};">
            <p><span class="label">${T('Payment Date', 'تاريخ الصرف')}:</span> ${pay.payment_date || 'N/A'}</p>
            <p><span class="label">${T('Mode', 'الطريقة')}:</span> ${pay.payment_mode}</p>
          </div>
        </div>
        <table>
          <thead><tr><th>${T('Description', 'الوصف')}</th><th class="right">${T('Amount (SAR)', 'المبلغ (ر.س)')}</th></tr></thead>
          <tbody>
            <tr><td>${T('Basic Salary', 'الراتب الأساسي')}</td><td class="right">${(pay.base_salary || 0).toFixed(2)}</td></tr>
            <tr><td>${T('Commission', 'العمولة')}</td><td class="right" style="color:#059669;">+ ${(pay.commission || 0).toFixed(2)}</td></tr>
            <tr><td>${T('Overtime', 'العمل الإضافي')}</td><td class="right" style="color:#059669;">+ ${(pay.overtime || 0).toFixed(2)}</td></tr>
            <tr><td>${T('Gift/Bonus', 'مكافأة')}</td><td class="right" style="color:#059669;">+ ${(pay.gift || 0).toFixed(2)}</td></tr>
            <tr><td>${T('Advance Deduction', 'خصم السلفة')}</td><td class="right" style="color:#ef4444;">- ${(pay.advance_deduction || 0).toFixed(2)}</td></tr>
            <tr><td>${T('Mistakes Deduction', 'خصم الأخطاء')}</td><td class="right" style="color:#ef4444;">- ${(pay.mistakes_deduction || 0).toFixed(2)}</td></tr>
          </tbody>
        </table>
        <div class="net-pay">${T('NET PAY', 'صافي الراتب')}: ${(pay.amount || 0).toFixed(2)} SAR</div>
      </div>
      <div class="footer">
        <p>${T('System generated salary slip', 'قسيمة راتب إلكترونية من النظام')} — ${setting.company_name_en || ''}</p>
      </div>
    </div>
  </body>
  </html>`;
};

// FIX: Proper contract HTML instead of stub
const getContractHTML = (s, name, date, isOffer, type, markup, terms) => {
  const setting = s || {};
  const docType = isOffer ? 'OFFER' : 'CONTRACT';
  const title = isOffer ? `Corporate Offer - ${name}` : `Corporate Contract - ${name}`;
  const termsList = terms ? terms.split('\n').filter(t => t.trim()).map(t => `<li style="margin-bottom:8px; font-size:14px;">${t.trim()}</li>`).join('') : '<li>Standard terms and conditions apply.</li>';
  
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
      .doc { max-width: 800px; margin: auto; background: #fff; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
      .header { background: linear-gradient(135deg, #0c1d3a, #1a365d); color: #fff; padding: 40px; text-align: center; }
      .header h1 { font-size: 28px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 2px; }
      .header h2 { font-size: 18px; color: rgba(255,255,255,0.8); margin-top: 10px; }
      .body { padding: 40px; }
      .section { margin-bottom: 30px; }
      .section h3 { font-size: 16px; font-weight: 700; color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
      .detail-row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
      .detail-row .label { color: #64748b; font-weight: 500; }
      .detail-row .value { color: #0f172a; font-weight: 600; }
      ol { padding-left: 20px; }
      .footer { padding: 30px 40px; background: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
      .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0; }
      .sig-block { text-align: center; }
      .sig-block .line { border-top: 1px solid #1e293b; margin-top: 60px; padding-top: 8px; font-size: 13px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="doc">
      <div class="header">
        <h1>${docType} AGREEMENT</h1>
        <h2>${setting.company_name_en || 'SUEUD AL TAAYIRA'} — ${setting.company_name_ar || 'صعود الطائرة'}</h2>
      </div>
      <div class="body">
        <div class="section">
          <h3>Agreement Details</h3>
          <div class="detail-row"><span class="label">Corporate Client</span><span class="value">${name}</span></div>
          <div class="detail-row"><span class="label">Service Type</span><span class="value">${type || 'Complete Travel Management'}</span></div>
          <div class="detail-row"><span class="label">Service Fee / Markup</span><span class="value">${parseFloat(markup || 0).toFixed(2)} SAR</span></div>
          <div class="detail-row"><span class="label">Date</span><span class="value">${date}</span></div>
          <div class="detail-row"><span class="label">Validity</span><span class="value">1 Year from date of signing</span></div>
        </div>
        <div class="section">
          <h3>Terms & Conditions</h3>
          <ol>${termsList}</ol>
        </div>
        <div class="signatures">
          <div class="sig-block">
            <p style="font-weight:700;">For ${setting.company_name_en || 'Company'}</p>
            <div class="line">Authorized Signatory</div>
          </div>
          <div class="sig-block">
            <p style="font-weight:700;">For ${name}</p>
            <div class="line">Authorized Signatory</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>${setting.company_name_en || ''} | ${setting.address_ar || ''} | VAT: ${setting.vat_no || ''}</p>
      </div>
    </div>
  </body>
  </html>`;
};

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
  const [data, setData] = useState({ invoices: [], customers: [], corporates: [], creditors: [], portals: [], cashbook: [], expenses: [], investments: [], employees: [], payroll: [], appUsers: [], branches: [], packages: [], vendors: [], services: [], recharges: [], audits: [], empAdvances: [], tenants: [], settings: {}, staffMistakes: [] });

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
  const [editInvId, setEditInvId] = useState(null); const [editExpId, setEditExpId] = useState(null); const [editCustId, setEditCustId] = useState(null); const [editCorpId, setEditCorpId] = useState(null); const [editCredId, setEditCredId] = useState(null);
  const [editVendId, setEditVendId] = useState(null); const [editPkgId, setEditPkgId] = useState(null); const [editBrnId, setEditBrnId] = useState(null); const [editEmpId, setEditEmpId] = useState(null); const [editSrvId, setEditSrvId] = useState(null); const [editUserId, setEditUserId] = useState(null);

  const tr = translations[lang];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const logAction = async (action) => { if (!userProfile?.id) return; try { await supabase.from('audits').insert([{ user_email: userProfile.email, action, tenant_id: userProfile.tenant_id }]); } catch (e) {} };
  
  // FIX: fetchAll now fetches ALL tables
  const fetchAll = useCallback(async () => {
    if (!userProfile?.tenant_id) return;
    const tId = userProfile.tenant_id;
    try {
      const [inv, cust, corp, cred, por, cash, exp, emp, appU, set, ten, pay, adv, mistakes, invest, brn, pkg, vend, srv, rech, aud] = await Promise.all([
        supabase.from('invoices').select(`*, customers(name, phone), corporates(name, vat_no, phone), employees(name, phone)`).eq('tenant_id', tId).order('invoice_date', { ascending: false }),
        supabase.from('customers').select('*').eq('tenant_id', tId),
        supabase.from('corporates').select('*').eq('tenant_id', tId),
        supabase.from('creditors').select('*').eq('tenant_id', tId),
        supabase.from('portals').select('*').eq('tenant_id', tId),
        supabase.from('cashbook').select('*').eq('tenant_id', tId).order('trans_date', { ascending: false }),
        supabase.from('expenses').select('*').eq('tenant_id', tId).order('expense_date', { ascending: false }),
        supabase.from('employees').select('*').eq('tenant_id', tId),
        supabase.from('app_users').select('*').eq('tenant_id', tId),
        supabase.from('settings').select('*').eq('tenant_id', tId).maybeSingle(),
        supabase.from('tenants').select('*'),
        supabase.from('payroll').select('*, employees(name, role)').eq('tenant_id', tId).order('payment_date', { ascending: false }),
        supabase.from('employee_advances').select('*, employees(name)').eq('tenant_id', tId),
        supabase.from('staff_mistakes').select('*, employees(name)').eq('tenant_id', tId),
        supabase.from('investments').select('*').eq('tenant_id', tId).order('invest_date', { ascending: false }),
        supabase.from('branches').select('*').eq('tenant_id', tId),
        supabase.from('packages').select('*').eq('tenant_id', tId),
        supabase.from('vendors').select('*').eq('tenant_id', tId),
        supabase.from('services').select('*').eq('tenant_id', tId),
        supabase.from('recharges').select('*, portals(name)').eq('tenant_id', tId).order('recharge_date', { ascending: false }),
        supabase.from('audits').select('*').eq('tenant_id', tId).order('created_at', { ascending: false }).limit(100)
      ]);
      setData({ 
        invoices: inv.data || [], customers: cust.data || [], corporates: corp.data || [], creditors: cred.data || [], portals: por.data || [], cashbook: cash.data || [], expenses: exp.data || [], employees: emp.data || [], appUsers: appU.data || [], settings: set.data || {}, tenants: ten.data || [], payroll: pay.data || [], empAdvances: adv.data || [], staffMistakes: mistakes.data || [],
        investments: invest.data || [], branches: brn.data || [], packages: pkg.data || [], vendors: vend.data || [], services: srv.data || [], recharges: rech.data || [], audits: aud.data || [] 
      });
      
      // FIX: Populate setForm from settings when data loads
      if (set.data) {
        setSetForm(prev => ({
          ...prev,
          company_name_en: set.data.company_name_en || prev.company_name_en,
          company_name_ar: set.data.company_name_ar || prev.company_name_ar,
          vat_no: set.data.vat_no || prev.vat_no,
          cr_no: set.data.cr_no || prev.cr_no,
          phone: set.data.phone || prev.phone,
          address_ar: set.data.address_ar || prev.address_ar,
          license_no: set.data.license_no || prev.license_no,
          tourist_license_no: set.data.tourist_license_no || prev.tourist_license_no,
          invoice_footer: set.data.invoice_footer || prev.invoice_footer,
          logo_url: set.data.logo_url || prev.logo_url,
          custom_fields: set.data.custom_fields || prev.custom_fields
        }));
      }
    } catch (err) {
      console.error('fetchAll error:', err);
    }
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
        if (profileData) { 
          setUserProfile(profileData);
          // FIX: Populate profileForm from userProfile
          setProfileForm({ username: profileData.username || '', avatar_url: profileData.avatar_url || '', phone: profileData.phone || '', address: profileData.address || '' });
        } 
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
    contractTerms, setContractTerms, tenantForm, setTenantForm, profileForm, setProfileForm, ledgerEmpId, setLedgerEmpId, ledgerCustId, setLedgerCustId, repDate, setRepDate, reportTab, setReportTab, statementTab, setStatementTab, page, setPage, chatOpen, setChatOpen, search, setSearch, payFilter, setPayFilter, tblPage, setTblPage, exportToExcel, filterData
  };
}
