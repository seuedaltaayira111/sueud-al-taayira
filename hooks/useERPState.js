'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const translations = {
  en: { dashboard:'Dashboard', create:'Create Invoice', list:'Invoices', refunds:'Refunds', customers:'Customers', corporates:'Corporates', creditors:'Creditors', credit:'Credit Balances', vendors:'Vendors', packages:'Packages', branches:'Branches', portals:'Portals', bank:'Bank & Cash', invest:'Investors', hr:'Human Resources', users:'Users', settings:'Settings', reports:'Reports', audit:'Audit Logs', statements:'Statements', contract:'Corporate Contract', offer:'Corporate Offer', superadmin:'SuperAdmin', profile:'Profile', profitability:'Profitability', notifications:'Notifications', ai_dashboard:'AI Dashboard', quotations:'Quotations', hr_advanced:'HR & Payroll', ai_pricing:'AI Pricing', my_attendance:'My Attendance', credit_limits:'Credit Limits', customer_statement:'Customer Statement', refund_statement:'Refund Statement', supplier_statement:'Supplier Statement', multi_branch:'Multi-Branch', recurring_invoices:'Recurring Invoices', expense_approval:'Expense Approval', staff_mistakes:'Staff Mistakes', expenses:'Expenses', editInvoice:'Edit Invoice', generateInvoice:'Generate Invoice', updateInvoice:'Update Invoice', custType:'Customer Type', individual:'Individual', corporate:'Corporate', selectCustomer:'Select Customer', customerPhone:'Customer Phone', passengers:'Passengers', addPassenger:'+ Add Passenger', portal:'Portal', service:'Service', flightTicket:'Flight Ticket', hotel:'Hotel Booking', tourPackage:'Tour Package', visitVisa:'Visit Visa', umrahVisa:'Umrah Visa', newService:'New Service', flightType:'Flight Type', domestic:'Domestic', international:'International', airline:'Airline', sector:'Sector', pnr:'PNR', ticketNo:'Ticket No', qty:'Quantity', cost:'Cost', sell:'Sell', discount:'Discount', vatRate:'VAT Rate', invoiceDate:'Invoice Date', bookingType:'Booking Type', newBooking:'New Booking', reissue:'Reissue', extraLuggage:'Extra Luggage', previousBooking:'Previous Booking', salesPerson:'Sales Person', paymentMethod:'Payment Method', cash:'Cash', bankTransfer:'Bank Transfer', card:'Card / Network', credit:'Credit', creditBalance:'Credit Balance', tabby:'Tabby', tamara:'Tamara', paidAmount:'Paid Amount', invNo:'Inv No', total:'Total', due:'Due', method:'Method', actions:'Actions', preview:'Preview', print:'Print', edit:'Edit', delete:'Delete', refund:'Refund', quickSettle:'Settle', download_excel:'Export Excel', save:'Save', add:'Add', search:'Search...', changePass:'Change Password', logout:'Logout', selectEmployee:'Select Employee', attendanceDate:'Date', status:'Status', present:'Present', leave:'Leave', absent:'Absent', checkInTime:'Check-In', checkOutTime:'Check-Out', overtime:'OT', deduction:'Deduction', mark:'Mark', baseSalary:'Base Salary', commission:'Commission %', advDed:'Adv. Deduct', gift:'Gift/Bonus', month:'Month', mode:'Mode', paySalary:'Pay Salary', generateSlip:'Generate Slip', target:'Target (SAR)', achieved:'Achieved', percentage:'%', balance:'Balance' },
  ar: { dashboard:'لوحة التحكم', create:'إنشاء فاتورة', list:'الفواتير', refunds:'الاسترجاعات', customers:'العملاء', corporates:'الشركات', creditors:'الدائنون', credit:'أرصدة مستحقة', vendors:'الموردون', packages:'الباقات', branches:'الفروع', portals:'البوابات', bank:'البنك والصندوق', invest:'المستثمرون', hr:'الموارد البشرية', users:'المستخدمون', settings:'الإعدادات', reports:'التقارير', audit:'سجل التدقيق', statements:'كشوفات', contract:'عقد شركات', offer:'عرض شركات', superadmin:'المدير العام', profile:'الملف الشخصي', profitability:'الربحية', notifications:'الإشعارات', ai_dashboard:'لوحة ذكية', quotations:'عروض أسعار', hr_advanced:'الرواتب', ai_pricing:'تسعير ذكي', my_attendance:'حضوري', credit_limits:'حدود الائتمان', customer_statement:'كشف عميل', refund_statement:'كشف استرجاع', supplier_statement:'كشف مورد', multi_branch:'متعدد الفروع', recurring_invoices:'فواتير متكررة', expense_approval:'اعتماد مصروفات', staff_mistakes:'أخطاء الموظفين', expenses:'المصروفات', editInvoice:'تعديل الفاتورة', generateInvoice:'إنشاء الفاتورة', updateInvoice:'تحديث الفاتورة', custType:'نوع العميل', individual:'فرد', corporate:'شركة', selectCustomer:'اختر العميل', customerPhone:'هاتف العميل', passengers:'الركاب', addPassenger:'+ إضافة راكب', portal:'البوابة', service:'الخدمة', flightTicket:'تذكرة طيران', hotel:'حجز فندق', tourPackage:'باقة سياحية', visitVisa:'تأشيرة زيارة', umrahVisa:'تأشيرة عمرة', newService:'خدمة جديدة', flightType:'نوع الرحلة', domestic:'داخلي', international:'دولي', airline:'خط الطيران', sector:'القطاع', pnr:'رقم الحجز', ticketNo:'رقم التذكرة', qty:'الكمية', cost:'التكلفة', sell:'البيع', discount:'الخصم', vatRate:'نسبة الضريبة', invoiceDate:'تاريخ الفاتورة', bookingType:'نوع الحجز', newBooking:'حجز جديد', reissue:'إعادة إصدار', extraLuggage:'أمتعة إضافية', previousBooking:'حجز سابق', salesPerson:'موظف المبيعات', paymentMethod:'طريقة الدفع', cash:'نقداً', bankTransfer:'تحويل بنكي', card:'بطاقة', credit:'آجل', creditBalance:'رصيد مستحق', tabby:'تابي', tamara:'تمارة', paidAmount:'المبلغ المدفوع', invNo:'رقم الفاتورة', total:'الإجمالي', due:'المتبقي', method:'الطريقة', actions:'إجراءات', preview:'معاينة', print:'طباعة', edit:'تعديل', delete:'حذف', refund:'استرجاع', quickSettle:'تسوية', download_excel:'تصدير', save:'حفظ', add:'إضافة', search:'بحث...', changePass:'تغيير كلمة المرور', logout:'تسجيل خروج', selectEmployee:'اختر الموظف', attendanceDate:'التاريخ', status:'الحالة', present:'حاضر', leave:'إجازة', absent:'غائب', checkInTime:'وقت الحضور', checkOutTime:'وقت الانصراف', overtime:'إضافي', deduction:'خصم', mark:'تسجيل', baseSalary:'الراتب الأساسي', commission:'العمولة %', advDed:'خصم سلفة', gift:'هدية/مكافأة', month:'الشهر', mode:'الطريقة', paySalary:'دفع الراتب', generateSlip:'إنشاء قسيمة', target:'الهدف (ريال)', achieved:'المحقق', percentage:'%', balance:'الرصيد' }
};

const getAirlineCheckInURL = (airline, pnr) => {
  if (!airline || !pnr) return null;
  const a = airline.toLowerCase();
  const u = { 'saudia':`https://www.saudia.com/check-in?pnr=${pnr}`, 'sv':`https://www.saudia.com/check-in?pnr=${pnr}`, 'flynas':`https://www.flynas.com/en/manage-booking?ref=${pnr}`, 'flyadeal':`https://www.flyadeal.com/en/manage-booking?ref=${pnr}`, 'gulf air':`https://www.gulfair.com/check-in?pnr=${pnr}`, 'emirates':`https://www.emirates.com/manage-booking/retrieve-check-in?pnr=${pnr}`, 'etihad':`https://www.etihad.com/en-us/manage-booking/check-in?pnr=${pnr}`, 'qatar':`https://www.qatarairways.com/en/check-in.html?pnr=${pnr}`, 'egyptair':`https://www.egyptair.com/en/Manage-Booking/Check-In?pnr=${pnr}`, 'turkish':`https://www.turkishairlines.com/en-us/check-in?pnr=${pnr}`, 'flydubai':`https://www.flydubai.com/en/manage-booking?ref=${pnr}`, 'air arabia':`https://www.airarabia.com/manage-booking?pnr=${pnr}`, 'royal jordanian':`https://www.rj.com/en/manage-booking?pnr=${pnr}`, 'oman air':`https://www.omanair.com/manage-booking?pnr=${pnr}`, 'kuwait':`https://www.kuwaitairways.com/en/manage-booking?pnr=${pnr}`, 'pakistan':`https://www.piac.com.pk/manage-booking?pnr=${pnr}`, 'indigo':`https://www.goindigo.in/manage-booking?pnr=${pnr}`, 'virgin':`https://www.virginatlantic.com/check-in?pnr=${pnr}` };
  for (const [k, url] of Object.entries(u)) { if (a.includes(k)) return url; }
  return `https://www.google.com/search?q=${encodeURIComponent(airline + ' check in pnr ' + pnr)}`;
};

const getAIMessage = (inv, lang) => {
  const m = [{ en:"✈️ Wishing you a wonderful journey! Safe travels.", ar:"✈️ نتمنى لك رحلة سعيدة! سفر آمن." },{ en:"🌟 Your trust means the world to us.", ar:"🌟 ثقتكم تعني لنا كل شيء." },{ en:"💎 Premium service, unforgettable experiences.", ar:"💎 خدمة مميزة، تجارب لا تُنسى." },{ en:"🌅 New horizons await! Thank you!", ar:"🌅 آفاق جديدة تنتظركم! شكراً!" }];
  return lang === 'ar' ? m[(inv.id?.charCodeAt(0) || 0) % m.length].ar : m[(inv.id?.charCodeAt(0) || 0) % m.length].en;
};

/* ═══ INVOICE HTML — SINGLE PAGE ═══ */
const getInvoiceHTML = (inv, s, lang = 'en') => {
  const st = s || {}; const no = inv.invoice_no || 'N/A';
  const ciu = getAirlineCheckInURL(inv.airline, inv.pnr);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app/invoice/' + no)}`;
  const bd = ciu || `https://www.google.com/search?q=${encodeURIComponent((inv.airline||'')+' check in '+(inv.pnr||''))}`;
  const bc = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(bd)}&scale=2&height=35&barcolor=0c1d3a&backgroundcolor=ffffff&includetext=false`;
  const ts=inv.total_sell||0, dc=inv.discount||0, sub=ts+dc, vr=inv.vat>0&&ts>0?Math.round(inv.vat/ts*100):0, vat=inv.vat||0, tot=inv.total||0, paid=inv.paid_amount||0, uc=inv.used_credit||0, cr=inv.cash_return||0, cp=paid-uc-cr, due=inv.due_amount||0, up=(inv.qty||1)>0?ts/inv.qty:ts;
  const st2=inv.status||(due>0?'Unpaid':'Paid'), isR=inv.booking_type==='Reissue'||inv.booking_type==='Previous Booking';
  const px=inv.passenger_names?inv.passenger_names.replace(/\n/g,', '):'N/A', ai=getAIMessage(inv,lang), R=lang==='ar';
  return `<!DOCTYPE html><html lang="${lang}" dir="${R?'rtl':'ltr'}"><head><meta charset="UTF-8"><title>Invoice ${no}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet"><style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.i{width:210mm;height:297mm;margin:auto;border:2px solid #0c1d3a;display:flex;flex-direction:column;position:relative;overflow:hidden}
.i::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0c1d3a,#1a365d,#2563eb,#0c1d3a)}.i::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0c1d3a,#2563eb,#1a365d,#0c1d3a)}
.hd{display:flex;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#0c1d3a,#1a365d);color:#fff;gap:12px;margin-top:5px}
.cb{display:flex;gap:10px;flex:1;align-items:center}.lo{width:50px;height:50px;object-fit:cover;border-radius:6px;background:rgba(255,255,255,0.1);padding:2px;border:1px solid rgba(251,191,36,0.3)}
.ct h2{font-size:14px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}.ct h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1.5px;margin:2px 0 0}.ct p{font-size:8px;color:rgba(255,255,255,0.6);line-height:1.6;margin:3px 0 0}
.im{min-width:160px;background:rgba(255,255,255,0.06);padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);text-align:${R?'left':'right'}}
.im h3{font-size:18px;font-weight:800;color:#fbbf24;text-transform:uppercase;line-height:1;margin:0}.im h3 span{font-size:9px;font-family:'Cairo';display:block;margin:2px 0 0;color:rgba(255,255,255,0.8)}
.mr{display:flex;justify-content:space-between;margin-top:3px;font-size:8px;border-bottom:1px dashed rgba(255,255,255,0.15);padding-bottom:2px}.mr .l{color:rgba(255,255,255,0.6)}.mr .v{color:#fbbf24;font-weight:700}
.sb{display:inline-block;padding:3px 10px;border-radius:12px;font-size:8px;font-weight:700;margin-top:5px;${st2==='Unpaid'?'background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)':'background:rgba(52,211,153,0.2);color:#34d399;border:1px solid rgba(52,211,153,0.3)'}}
.cd{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 16px;background:#f0f4ff;border-bottom:1px solid #e2e8f0}.cd .ci{display:flex;flex-direction:column;gap:0}.cd .cl{font-size:7px;color:#64748b;font-weight:600;text-transform:uppercase}.cd .cv{font-size:8px;color:#0f172a;font-weight:600}
.bd{padding:8px 16px;flex:1;display:flex;flex-direction:column;gap:6px}.st{font-size:8px;font-weight:700;text-transform:uppercase;color:#0c1d3a;margin-bottom:4px;border-bottom:1.5px solid #0c1d3a;padding-bottom:3px}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:6px}.ib{padding:6px 8px;background:#f8fafc;border-radius:5px;border:1px solid #e2e8f0;border-left:3px solid #1a365d}
.ir{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #f1f5f9}.ir:last-child{border:none}.ir .l{color:#64748b}.ir .v{color:#0f172a;font-weight:600;text-align:${R?'left':'right'};max-width:65%;word-break:break-word}
.rb{padding:6px 8px;background:#fffbeb;border-radius:5px;border:1px solid #fde68a}.rt{font-size:9px;font-weight:700;color:#d97706;margin-bottom:5px;display:flex;justify-content:space-between;background:#fef3c7;padding:4px 8px;border-radius:4px}
.rg{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}.ri{background:#fff;padding:3px 6px;border-radius:4px;border:1px solid #fde68a}.ri .l{font-size:7px;color:#92400e;font-weight:600;text-transform:uppercase}.ri .v{font-size:8px;color:#78350f;font-weight:700;margin-top:1px}
.rf{background:#dcfce7;border-color:#86efac;grid-column:span 3;display:flex;justify-content:space-between;align-items:center;padding:4px 8px;border-radius:4px}.rf .l{color:#059669;font-size:8px}.rf .v{color:#047857;font-size:12px;font-weight:800}
table{width:100%;border-collapse:collapse;border-radius:5px;overflow:hidden;border:1px solid #e2e8f0}
thead th{padding:5px 6px;background:#0c1d3a;color:#fbbf24;font-size:7px;text-transform:uppercase;text-align:${R?'right':'left'};border-bottom:1.5px solid #fbbf24}thead th.r{text-align:${R?'left':'right'}}thead th.c{text-align:center}
tbody td{padding:4px 6px;border-bottom:1px solid #f1f5f9;font-size:8px}tbody td.r{text-align:${R?'left':'right'};font-weight:600}tbody td.c{text-align:center}tbody tr:last-child td{border-bottom:none}
.bs{display:grid;grid-template-columns:1.5fr 1fr;gap:6px}.pb{padding:6px 8px;background:#f8fafc;border-radius:5px;border:1px solid #e2e8f0}
.pr{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px dashed #cbd5e1}.pr:last-child{border:none}
.tb{background:#0c1d3a;border-radius:5px;padding:8px 10px;color:#fff;align-self:flex-start}.tr{display:flex;justify-content:space-between;padding:2px 0;font-size:8px;color:rgba(255,255,255,0.8)}
.gt{display:flex;justify-content:space-between;padding:6px 0 0;margin-top:4px;border-top:1.5px solid rgba(255,255,255,0.15);font-size:13px;font-weight:800;color:#fff}.gt .v{color:#fbbf24}
.tm{padding:5px 8px;background:#f8fafc;border-radius:4px;border:1px solid #e2e8f0}.tm p{font-size:7px;color:#94a3b8;line-height:1.5;margin:0}
.ft{padding:6px 16px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #e2e8f0;gap:8px;margin-top:auto}
.cbx{display:flex;align-items:center;gap:6px}.bi{height:28px;width:auto;min-width:160px;border:1px solid #e2e8f0;padding:1px 4px;background:#fff;border-radius:2px}.qi{height:36px;width:36px;border:1px solid #e2e8f0;padding:1px;background:#fff;border-radius:3px}.cl2{font-size:6px;font-weight:700;text-transform:uppercase;text-align:center;color:#475569}
.am{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:6px;border:1px solid #93c5fd}.am p{font-size:8px;color:#1e3a8a;margin:0;line-height:1.4;font-weight:500}.al{font-size:6px;color:#3b82f6;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.fd{width:1px;background:#cbd5e1;align-self:stretch;min-height:40px}.fi{width:70px;text-align:center}.fi p{font-size:6px;color:#94a3b8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.i{border:none}}
</style></head><body><div class="i"><div class="hd"><div class="cb">
 ${st.logo_url?`<img src="${st.logo_url}" crossorigin="anonymous" class="lo"/>`:'<div class="lo" style="display:flex;align-items:center;justify-content:center;font-size:20px">✈️</div>'}
<div class="ct"><h2>${st.company_name_ar||'صعود الطائرة للسفر والسياحة'}</h2><h1>${st.company_name_en||'SUEUD AL TAAYIRA TRAVEL & TOURISM'}</h1><p>${st.address_ar||'Address'} ${st.phone?'| '+st.phone:''}</p></div></div>
<div class="im"><h3>TAX INVOICE<span>فاتورة ضريبية</span></h3><div class="mr"><span class="l">Inv No / رقم</span><span class="v">${no}</span></div><div class="mr"><span class="l">Date / التاريخ</span><span class="v">${inv.invoice_date||''}</span></div><div class="sb">${st2==='Unpaid'?'UNPAID / غير مدفوعة':'PAID / مدفوعة'}</div></div></div>
<div class="cd"><div class="ci"><span class="cl">VAT No</span><span class="cv">${st.vat_no||'N/A'}</span></div><div class="ci"><span class="cl">CR No</span><span class="cv">${st.cr_no||'N/A'}</span></div><div class="ci"><span class="cl">License</span><span class="cv">${st.license_no||'N/A'}</span></div><div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div></div>
<div class="bd"><div class="dg"><div class="ib"><div class="st">BILL TO / فاتورة إلى</div>
<div class="ir"><span class="l">Name</span><span class="v">${inv.customers?.name||inv.corporates?.name||'N/A'}</span></div>
<div class="ir"><span class="l">Phone</span><span class="v">${inv.customers?.phone||'N/A'}</span></div>
<div class="ir"><span class="l">Sales Person</span><span class="v">${inv.employees?.name||'N/A'}</span></div>
<div class="ir"><span class="l">Passengers</span><span class="v" style="font-size:7px">${px}</span></div></div>
<div class="ib" style="border-left-color:#f59e0b;${R?'border-left:1px solid #e2e8f0;border-right:3px solid #f59e0b':''}"><div class="st">FLIGHT DETAILS / تفاصيل الرحلة</div>
<div class="ir"><span class="l">Airline</span><span class="v">${inv.airline||'N/A'}</span></div>
<div class="ir"><span class="l">Sector</span><span class="v">${inv.flight_sector||'N/A'}</span></div>
<div class="ir"><span class="l">Type</span><span class="v">${inv.flight_type||'N/A'}</span></div>
<div class="ir"><span class="l">PNR</span><span class="v" style="color:#2563eb;font-weight:700">${inv.pnr||'N/A'}</span></div>
<div class="ir"><span class="l">Ticket No</span><span class="v">${inv.ticket_no||'N/A'}</span></div>
<div class="ir"><span class="l">Service</span><span class="v">${inv.service_type||'N/A'}</span></div></div></div>
 ${isR?`<div class="rb"><div class="rt"><span>⚠️ PREVIOUS BOOKING</span></div><div class="rg"><div class="ri"><div class="l">Old Date</div><div class="v">${inv.old_booking_date||'N/A'}</div></div><div class="ri"><div class="l">Old Airline</div><div class="v">${inv.old_airline||'N/A'}</div></div><div class="ri"><div class="l">Old Sector</div><div class="v">${inv.old_sector||'N/A'}</div></div><div class="ri"><div class="l">Old PNR</div><div class="v">${inv.old_pnr||'N/A'}</div></div><div class="ri"><div class="l">Old Ticket</div><div class="v">${inv.old_ticket_no||'N/A'}</div></div><div class="rf"><div class="l">Original Fare</div><div class="v">${parseFloat(inv.old_sell_price||0).toFixed(2)} SAR</div></div></div></div>`:''}
<table><thead><tr><th>Description<span>الوصف</span></th><th class="c">Qty<span>الكمية</span></th><th class="r">Unit Price<span>سعر الوحدة</span></th><th class="r">Total<span>الإجمالي</span></th></tr></thead><tbody>
<tr><td>${inv.sector||inv.service_type||'Service'}</td><td class="c">${inv.qty||1}</td><td class="r">${up.toFixed(2)}</td><td class="r">${ts.toFixed(2)}</td></tr>
 ${dc>0?`<tr style="background:#f0fdf4"><td colspan="3" style="text-align:${R?'left':'right'};color:#059669">Discount / خصم</td><td class="r" style="color:#059669">- ${dc.toFixed(2)}</td></tr>`:''}</tbody></table>
<div class="bs"><div class="pb"><div class="st">PAYMENT BREAKDOWN</div>
<div class="pr"><span>Subtotal</span><span style="font-weight:600">${sub.toFixed(2)} SAR</span></div>
 ${dc>0?`<div class="pr" style="color:#059669"><span>Discount</span><span>- ${dc.toFixed(2)} SAR</span></div>`:''}
<div class="pr"><span>VAT (${vr}%)</span><span>${vat.toFixed(2)} SAR</span></div>
 ${uc>0?`<div class="pr" style="color:#7c3aed"><span>Credit Used</span><span>- ${uc.toFixed(2)} SAR</span></div>`:''}
<div class="pr" style="border-top:1.5px solid #cbd5e1;margin-top:3px;padding-top:3px;font-weight:700"><span>Paid</span><span style="color:#059669">${cp.toFixed(2)} SAR</span></div>
<div class="pr" style="font-weight:700;font-size:10px"><span>Due</span><span style="color:${due>0?'#ef4444':'#059669'}">${due.toFixed(2)} SAR</span></div></div>
<div class="tb"><div class="tr"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div><div class="tr"><span>VAT (${vr}%)</span><span>${vat.toFixed(2)}</span></div>
<div class="gt"><span>GRAND TOTAL</span><span class="v">${tot.toFixed(2)} SAR</span></div></div></div>
<div class="tm"><p>1. Bookings subject to airline/hotel terms. 2. Cancellation policies vary. 3. Computer-generated - valid without signature. 4. Prices in SAR incl. VAT. 5. Electronic invoice under Fatoorah.</p></div>
</div><div class="ft"><div class="cbx"><img src="${bc}" alt="Barcode" class="bi" crossorigin="anonymous"/><div class="cl2">CHECK-IN</div><img src="${qr}" alt="QR" class="qi" crossorigin="anonymous"/><div class="cl2">INVOICE</div></div><div class="fd"></div><div class="am"><div class="al">🤖 AI</div><p>${ai}</p></div><div class="fd"></div><div class="fi"><p style="font-weight:700;color:#0f172a;font-size:7px">${st.company_name_en||'SUEUD AL TAAYIRA'}</p><p>${st.phone||''}</p><p style="font-family:'Cairo';font-size:7px">${st.company_name_ar||''}</p></div></div></div></body></html>`;
};

/* ═══ REFUND HTML ═══ */
const getRefundHTML = (inv, s, lang='en') => {
  const st=s||{}, no=inv.invoice_no||'N/A', qr=`https://api.qrrosver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app/invoice/'+no)}`;
  const of2=inv.old_sell_price||inv.total_sell||0, cR=inv.refund_customer||0, coR=inv.refund_company||0, cn=inv.customers?.name||inv.old_customer_name||'N/A', cp=inv.customers?.phone||inv.old_customer_phone||'N/A';
  const px=inv.passenger_names?inv.passenger_names.replace(/\n/g,', '):(inv.old_passengers||'N/A'), ai=getAIMessage(inv,lang), R=lang==='ar';
  return `<!DOCTYPE html><html lang="${lang}" dir="${R?'rtl':'ltr'}"><head><meta charset="UTF-8"><title>Refund ${no}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet"><style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.i{width:210mm;height:297mm;margin:auto;border:2px solid #7f1d1d;display:flex;flex-direction:column;position:relative;overflow:hidden}.i::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7f1d1d,#991b1b,#dc2626,#7f1d1d)}.i::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7f1d1d,#dc2626,#991b1b,#7f1d1d)}
.hd{display:flex;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#7f1d1d,#991b1b);color:#fff;gap:12px;margin-top:5px}.cb{display:flex;gap:10px;flex:1;align-items:center}.lo{width:50px;height:50px;object-fit:cover;border-radius:6px;background:rgba(255,255,255,0.1);padding:2px}
.ct h2{font-size:14px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}.ct h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1.5px;margin:2px 0 0}.ct p{font-size:8px;color:rgba(255,255,255,0.6);margin:3px 0 0}
.im{min-width:160px;text-align:${R?'left':'right'}}.im h3{font-size:18px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin:0}.im h3 span{font-size:9px;font-family:'Cairo';display:block;margin:2px 0 0;color:rgba(255,255,255,0.8)}
.ino{font-size:8px;color:rgba(255,255,255,0.8);margin-top:3px;border-bottom:1px dashed rgba(255,255,255,0.2);padding-bottom:2px}.ino span{color:#fbbf24;font-weight:700}
.sb{display:inline-block;padding:3px 10px;border-radius:12px;font-size:8px;font-weight:700;margin-top:5px;background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)}
.cd{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 16px;background:#fff5f5;border-bottom:1px solid #fecaca}.cd .ci{display:flex;flex-direction:column;gap:0}.cd .cl{font-size:7px;color:#991b1b;font-weight:600;text-transform:uppercase}.cd .cv{font-size:8px;color:#7f1d1d;font-weight:600}
.bd{padding:10px 16px;flex:1;display:flex;flex-direction:column;gap:8px}.st{font-size:8px;font-weight:700;text-transform:uppercase;color:#7f1d1d;margin-bottom:4px;border-bottom:1.5px solid #7f1d1d;padding-bottom:3px}
.ib{padding:8px;background:#fff5f5;border-radius:5px;border:1px solid #fecaca;border-left:3px solid #dc2626}
.row{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #fee2e2}.row:last-child{border:none}.row .l{color:#991b1b;font-weight:500}.row .v{color:#7f1d1d;font-weight:600;text-align:${R?'left':'right'};max-width:65%}
.cb2{background:#fff;padding:10px;border-radius:5px;border:1px solid #e2e8f0}.ct2{font-size:8px;text-transform:uppercase;color:#dc2626;margin-bottom:5px;border-bottom:1.5px solid #fecaca;padding-bottom:3px;font-weight:700}
.cr{display:flex;justify-content:space-between;padding:4px 0;font-size:9px;color:#334155;border-bottom:1px dashed #e2e8f0}.cr:last-child{border:none}.cr.deduct{color:#ef4444}.cr.total{padding-top:6px;margin-top:5px;border-top:1.5px solid #dc2626;font-size:14px;font-weight:800;color:#059669;border-bottom:none}
.pi{padding:6px 8px;background:#f8fafc;border-radius:5px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;font-size:9px}
.ft{padding:8px 16px;background:linear-gradient(135deg,#fff5f5,#fef2f2);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #fecaca;gap:8px;margin-top:auto}
.qi{height:36px;width:36px;border:1px solid #fecaca;padding:1px;background:#fff;border-radius:3px}.cl2{font-size:6px;font-weight:700;text-transform:uppercase;text-align:center;color:#991b1b}.fd{width:1px;background:#fecaca;align-self:stretch;min-height:40px}
.am{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#fef2f2,#fee2e2);border-radius:6px;border:1px solid #fca5a5}.am p{font-size:8px;color:#7f1d1d;margin:0;line-height:1.4;font-weight:500}.al{font-size:6px;color:#dc2626;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.fi{width:70px;text-align:center}.fi p{font-size:6px;color:#94a3b8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.i{border:none}}
</style></head><body><div class="i"><div class="hd"><div class="cb">
 ${st.logo_url?`<img src="${st.logo_url}" crossorigin="anonymous" class="lo"/>`:'<div class="lo" style="display:flex;align-items:center;justify-content:center;font-size:20px">✈️</div>'}
<div class="ct"><h2>${st.company_name_ar||'صعود الطائرة'}</h2><h1>${st.company_name_en||'SUEUD AL TAAYIRA'}</h1><p>${st.address_ar||''} ${st.phone?'| '+st.phone:''}</p></div></div>
<div class="im"><h3>REFUND<span>استرجاع</span></h3><div class="ino">No: <span>${no}</span></div><div class="ino">Date: <span>${inv.refund_date||inv.invoice_date||''}</span></div><div class="sb">PROCESSED / تم</div></div></div>
<div class="cd"><div class="ci"><span class="cl">VAT No</span><span class="cv">${st.vat_no||'N/A'}</span></div><div class="ci"><span class="cl">CR No</span><span class="cv">${st.cr_no||'N/A'}</span></div><div class="ci"><span class="cl">License</span><span class="cv">${st.license_no||'N/A'}</span></div><div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div></div>
<div class="bd"><div class="ib"><div class="st">BOOKING DETAILS</div>
<div class="row"><span class="l">Customer</span><span class="v">${cn}</span></div><div class="row"><span class="l">Phone</span><span class="v">${cp}</span></div><div class="row"><span class="l">Passengers</span><span class="v" style="font-size:7px">${px}</span></div>
<div class="row"><span class="l">Airline</span><span class="v">${inv.airline||inv.old_airline||'N/A'}</span></div><div class="row"><span class="l">Date</span><span class="v">${inv.invoice_date||'N/A'}</span></div><div class="row"><span class="l">PNR</span><span class="v">${inv.pnr||inv.old_pnr||'N/A'}</span></div><div class="row"><span class="l">Reason</span><span class="v">${inv.refund_reason||'N/A'}</span></div></div>
<div class="cb2"><div class="ct2">REFUND CALCULATION</div>
<div class="cr"><span>Original Fare</span><span style="font-weight:600">${of2.toFixed(2)} SAR</span></div>
<div class="cr deduct"><span>Less: Airline Fees</span><span style="font-weight:600">- ${(of2-coR).toFixed(2)} SAR</span></div>
<div class="cr"><span>Refund to Portal</span><span style="font-weight:600;color:#2563eb">${coR.toFixed(2)} SAR</span></div>
<div class="cr total"><span>Refund to Customer</span><span>${cR.toFixed(2)} SAR</span></div></div>
<div class="pi"><span style="font-weight:600">Refund Method</span><span style="font-weight:600;color:#2563eb">${inv.payment_method||'Cash'}</span></div></div>
<div class="ft"><div style="display:flex;align-items:center;gap:6px"><img src="${qr}" alt="QR" class="qi" crossorigin="anonymous"/><div class="cl2">DOWNLOAD</div></div><div class="fd"></div><div class="am"><div class="al">🤖 AI</div><p>${ai}</p></div><div class="fd"></div><div class="fi"><p style="font-weight:700;color:#7f1d1d">${st.company_name_en||''}</p><p>${st.phone||''}</p><p style="font-family:'Cairo'">${st.company_name_ar||''}</p></div></div></div></body></html>`;
};

/* ═══ EXPENSE HTML ═══ */
const getExpenseHTML = (exp, s, lang='en') => {
  const st=s||{}, eno=`EXP-${exp.id?exp.id.substring(0,8):'N/A'}`;
  const items=exp.items&&exp.items.length>0?exp.items:[{name:exp.item_name||'Item',qty:1,price:exp.amount||0}];
  const ai=getAIMessage(exp,lang), R=lang==='ar';
  return `<!DOCTYPE html><html lang="${lang}" dir="${R?'rtl':'ltr'}"><head><meta charset="UTF-8"><title>Expense ${eno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet"><style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.i{width:210mm;height:297mm;margin:auto;border:2px solid #7c2d12;display:flex;flex-direction:column;position:relative;overflow:hidden}.i::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7c2d12,#9a3412,#ea580c,#7c2d12)}.i::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#7c2d12,#ea580c,#9a3412,#7c2d12)}
.hd{display:flex;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;margin-top:5px;align-items:center}
.ci h2{font-size:14px;font-weight:800;color:#fbbf24;margin:0;font-family:'Cairo'}.ci h1{font-size:9px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1.5px;margin:2px 0 0}
.im{text-align:${R?'left':'right'}}.im h3{font-size:18px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin:0}.im p{font-size:8px;color:rgba(255,255,255,0.8);margin:3px 0 0}.im p span{color:#fbbf24;font-weight:700}
.cd{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 16px;background:#fff7ed;border-bottom:1px solid #fed7aa}.cd .ci{display:flex;flex-direction:column;gap:0}.cd .cl{font-size:7px;color:#9a3412;font-weight:600;text-transform:uppercase}.cd .cv{font-size:8px;color:#7c2d12;font-weight:600}
.bd{padding:10px 16px;flex:1;display:flex;flex-direction:column;gap:8px}.st{font-size:8px;font-weight:700;text-transform:uppercase;color:#7c2d12;margin-bottom:4px;border-bottom:1.5px solid #7c2d12;padding-bottom:3px}
.ib{padding:8px;background:#fff7ed;border-radius:5px;border-left:3px solid #ea580c;border:1px solid #fed7aa}
.row{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #fed7aa}.row:last-child{border:none}.row .l{color:#9a3412;font-weight:500}.row .v{color:#7c2d12;font-weight:600}
table{width:100%;border-collapse:collapse;border-radius:5px;overflow:hidden;border:1px solid #e2e8f0}thead th{padding:5px 6px;background:#7c2d12;color:#fbbf24;font-size:7px;text-transform:uppercase;text-align:${R?'right':'left'}}thead th.r{text-align:${R?'left':'right'}}
tbody td{padding:4px 6px;border-bottom:1px solid #f1f5f9;font-size:8px}tbody td.r{text-align:${R?'left':'right'};font-weight:600}
.totals{background:linear-gradient(135deg,#7c2d12,#9a3412);color:#fff;padding:12px 16px;border-radius:6px;display:flex;justify-content:space-between;align-items:center}.totals h3{margin:0;text-transform:uppercase;font-size:10px}.totals .amt{font-size:20px;font-weight:800;margin:0;color:#fbbf24}
.ft{padding:8px 16px;background:linear-gradient(135deg,#fff7ed,#ffedd5);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #fed7aa;gap:8px;margin-top:auto}
.am{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#fff7ed,#fed7aa);border-radius:6px;border:1px solid #fdba74}.am p{font-size:8px;color:#7c2d12;margin:0;line-height:1.4;font-weight:500}.al{font-size:6px;color:#9a3412;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.fi{width:70px;text-align:center}.fi p{font-size:6px;color:#94a3b8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.i{border:none}}
</style></head><body><div class="i"><div class="hd"><div class="ci"><h2>${st.company_name_ar||'صعود الطائرة'}</h2><h1>${st.company_name_en||'SUEUD AL TAAYIRA'}</h1></div>
<div class="im"><h3>EXPENSE VOUCHER</h3><p>No: <span>${eno}</span></p><p>Date: <span>${exp.expense_date||''}</span></p></div></div>
<div class="cd"><div class="ci"><span class="cl">VAT No</span><span class="cv">${st.vat_no||'N/A'}</span></div><div class="ci"><span class="cl">CR No</span><span class="cv">${st.cr_no||'N/A'}</span></div><div class="ci"><span class="cl">License</span><span class="cv">${st.license_no||'N/A'}</span></div><div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div></div>
<div class="bd"><div class="ib"><div class="st">DETAILS</div>
<div class="row"><span class="l">Type</span><span class="v">${exp.expense_type||'N/A'}</span></div><div class="row"><span class="l">Payment</span><span class="v">${exp.payment_mode||'Cash'}</span></div><div class="row"><span class="l">Description</span><span class="v">${exp.description||'N/A'}</span></div></div>
<table><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Total</th></tr></thead><tbody>${items.map(function(it){return '<tr><td>'+(it.name||'Item')+'</td><td class="r">'+(it.qty||1)+'</td><td class="r">'+parseFloat(it.price||0).toFixed(2)+'</td><td class="r">'+((parseFloat(it.qty)||0)*(parseFloat(it.price)||0)).toFixed(2)+'</td></tr>';}).join('')}</tbody></table>
<div class="totals"><h3>TOTAL</h3><p class="amt">${(exp.amount||0).toFixed(2)} SAR</p></div></div>
<div class="ft"><div class="fi"><p style="font-weight:700;color:#7c2d12">${st.company_name_en||''}</p><p>${st.phone||''}</p><p style="font-family:'Cairo'">${st.company_name_ar||''}</p></div><div class="am"><div class="al">🤖 AI</div><p>${ai}</p></div><div style="width:70px"></div></div></div></body></html>`;
};

/* ═══ SALARY SLIP HTML ═══ */
const getSalarySlipHTML = (pay, s, lang='en') => {
  const st=s||{}, sno=`SLIP-${pay.id?pay.id.substring(0,8):'N/A'}`;
  const gross=(pay.base_salary||0)+(pay.commission_amount||0)+(pay.overtime||0)+(pay.gift||0), tded=(pay.advance_deduction||0)+(pay.mistakes_deduction||0)+(pay.other_deduction||0), net=gross-tded, ai=getAIMessage(pay,lang), R=lang==='ar';
  return `<!DOCTYPE html><html lang="${lang}" dir="${R?'rtl':'ltr'}"><head><meta charset="UTF-8"><title>Slip ${sno}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet"><style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:9px}
.sl{width:210mm;height:297mm;margin:auto;border:2px solid #0F172A;display:flex;flex-direction:column;position:relative;overflow:hidden}.sl::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0F172A,#1E3A8A,#2563EB,#0F172A)}.sl::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0F172A,#2563EB,#1E3A8A,#0F172A)}
.hd{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;margin-top:5px}.hd h1{font-size:14px;font-weight:800;color:#FBBF24;margin:0}
.si{text-align:${R?'left':'right'}}.si h3{color:#FBBF24;font-size:16px;font-weight:800;text-transform:uppercase;margin:0}.si h3 span{font-family:'Cairo';display:block;font-size:8px;color:rgba(255,255,255,0.8);margin:1px 0 0}.si p{font-size:8px;color:rgba(255,255,255,0.8);margin:3px 0 0}.si p span{color:#FBBF24;font-weight:700}
.cd{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 16px;background:#EFF6FF;border-bottom:1px solid #BFDBFE}.cd .ci{display:flex;flex-direction:column;gap:0}.cd .cl{font-size:7px;color:#1E3A8A;font-weight:600;text-transform:uppercase}.cd .cv{font-size:8px;color:#0F172A;font-weight:600}
.bd{padding:10px 16px;flex:1;display:flex;flex-direction:column;gap:8px}.st{font-size:8px;font-weight:700;text-transform:uppercase;margin-bottom:4px;border-bottom:1.5px solid #0F172A;padding-bottom:3px}
.dg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}.ib{padding:6px 8px;background:#F8FAFC;border-radius:5px;border:1px solid #E2E8F0}
.row{display:flex;justify-content:space-between;font-size:8px;padding:2px 0;border-bottom:1px solid #F1F5F9}.row:last-child{border:none}.row .l{color:#64748B}.row .v{color:#0F172A;font-weight:600}
.earn{border-left:3px solid #059669}.earn .st{color:#059669;border-color:#059669}.ded{border-left:3px solid #EF4444}.ded .st{color:#EF4444;border-color:#EF4444}
.totals{background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#fff;padding:12px 16px;border-radius:6px;display:flex;justify-content:space-between;align-items:center}.totals h3{margin:0;text-transform:uppercase;font-size:10px}.totals .amt{font-size:20px;font-weight:800;margin:0;color:#FBBF24}
.ft{padding:8px 16px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #BFDBFE;gap:8px;margin-top:auto}
.am{text-align:center;flex:1;padding:4px 10px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border-radius:6px;border:1px solid #93C5FD}.am p{font-size:8px;color:#1E3A8A;margin:0;line-height:1.4;font-weight:500}.al{font-size:6px;color:#3B82F6;font-weight:700;text-transform:uppercase;margin-bottom:2px}
.fi{width:70px;text-align:center}.fi p{font-size:6px;color:#94A3B8;margin:1px 0}
@media print{body{background:#fff;padding:0;margin:0}.sl{border:none}}
</style></head><body><div class="sl"><div class="hd"><h1>${st.company_name_ar||'صعود الطائرة'}</h1>
<div class="si"><h3>SALARY SLIP<span>قسيمة راتب</span></h3><p>No: <span>${sno}</span></p><p>Month: <span>${pay.month||'N/A'}</span></p><p>Employee: <span>${pay.employees?pay.employees.name:'N/A'}</span></p></div></div>
<div class="cd"><div class="ci"><span class="cl">VAT No</span><span class="cv">${st.vat_no||'N/A'}</span></div><div class="ci"><span class="cl">CR No</span><span class="cv">${st.cr_no||'N/A'}</span></div><div class="ci"><span class="cl">License</span><span class="cv">${st.license_no||'N/A'}</span></div><div class="ci"><span class="cl">Tourism Lic.</span><span class="cv">${st.tourism_license_no||'N/A'}</span></div></div>
<div class="bd"><div class="dg">
<div class="ib earn"><div class="st">EARNINGS</div><div class="row"><span class="l">Base Salary</span><span class="v">${(pay.base_salary||0).toFixed(2)}</span></div><div class="row"><span class="l">Commission</span><span class="v">${(pay.commission_amount||0).toFixed(2)}</span></div><div class="row"><span class="l">Overtime</span><span class="v">${(pay.overtime||0).toFixed(2)}</span></div><div class="row"><span class="l">Gift/Bonus</span><span class="v">${(pay.gift||0).toFixed(2)}</span></div>
<div class="row" style="font-weight:700;border-top:1px solid #059669;margin-top:3px;padding-top:3px"><span class="l">GROSS</span><span class="v" style="color:#059669">${gross.toFixed(2)}</span></div></div>
<div class="ib ded"><div class="st">DEDUCTIONS</div><div class="row"><span class="l">Advance</span><span class="v">${(pay.advance_deduction||0).toFixed(2)}</span></div><div class="row"><span class="l">Mistakes</span><span class="v">${(pay.mistakes_deduction||0).toFixed(2)}</span></div><div class="row"><span class="l">Other</span><span class="v">${(pay.other_deduction||0).toFixed(2)}</span></div>
<div class="row" style="font-weight:700;border-top:1px solid #EF4444;margin-top:3px;padding-top:3px"><span class="l">TOTAL DED.</span><span class="v" style="color:#EF4444">${tded.toFixed(2)}</span></div></div>
<div class="ib" style="border-left:3px solid #2563EB"><div class="st" style="color:#2563EB;border-color:#2563EB">SUMMARY</div>
<div class="row"><span class="l">Mode</span><span class="v">${pay.payment_mode||'Cash'}</span></div><div class="row"><span class="l">Working Days</span><span class="v">${pay.working_days||'N/A'}</span></div><div class="row"><span class="l">Leaves</span><span class="v">${pay.leaves_taken||0}</span></div>
<div class="row" style="font-weight:700;border-top:1px solid #2563EB;margin-top:3px;padding-top:3px"><span class="l">NET PAY</span><span class="v" style="color:#2563EB;font-size:12px">${net.toFixed(2)}</span></div></div></div>
<div class="totals"><h3>NET SALARY</h3><p class="amt">${net.toFixed(2)} SAR</p></div></div>
<div class="ft"><div class="fi"><p style="font-weight:700;color:#0F172A">${st.company_name_en||''}</p><p>${st.phone||''}</p><p style="font-family:'Cairo'">${st.company_name_ar||''}</p></div><div class="am"><div class="al">🤖 AI</div><p>${ai}</p></div><div style="width:70px"></div></div></div></div></body></html>`;
};

/* ═══ CONTRACT HTML ═══ */
const getContractHTML = (settings, corpName, date, isOffer, type, markup, terms) => {
  const st = settings || {};
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${isOffer?'Offer':'Contract'}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet"><style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:11px;padding:40px}
h1{color:#0c1d3a;font-size:24px;margin-bottom:20px;text-align:center}h2{color:#1a365d;font-size:16px;margin:20px 0 10px;border-bottom:2px solid #fbbf24;padding-bottom:5px}
.ig{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}.ii{background:#f8fafc;padding:10px;border-radius:6px;border-left:3px solid #1a365d}.ii .l{font-size:9px;color:#64748b;text-transform:uppercase}.ii .v{font-size:13px;font-weight:600;color:#0f172a;margin-top:2px}
.tm{background:#f8fafc;padding:15px;border-radius:8px;margin:20px 0;line-height:1.8}.sg{display:flex;justify-content:space-between;margin-top:60px}.sb{width:200px;text-align:center}.sl{border-bottom:1px solid #1e293b;margin-bottom:5px;height:60px}
</style></head><body>
<h1>${isOffer?'CORPORATE OFFER':'CORPORATE CONTRACT'}</h1>
<div style="text-align:center;color:#64748b;margin-bottom:30px">Date: ${date}</div>
<div class="ig"><div class="ii"><div class="l">Company</div><div class="v">${st.company_name_en||'SUEUD AL TAAYIRA'}</div></div>
<div class="ii"><div class="l">Corporate</div><div class="v">${corpName||'N/A'}</div></div>
<div class="ii"><div class="l">Type</div><div class="v">${type||'Standard'}</div></div>
<div class="ii"><div class="l">Markup</div><div class="v">${markup||'0'}%</div></div></div>
<h2>Terms & Conditions / الشروط والأحكام</h2>
<div class="tm">${terms||'Standard terms apply. All bookings subject to airline/hotel terms. Prices in SAR including VAT.'}</div>
<div class="sg"><div class="sb"><div class="sl"></div>Authorized Signature</div><div class="sb"><div class="sl"></div>Corporate Signature</div></div>
</body></html>`;
};

/* ═══ MISTAKE HTML ═══ */
const getMistakeHTML = (m, settings, lang) => {
  const st = settings || {};
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Staff Mistake</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet"><style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter','Cairo',sans-serif;background:#fff;color:#1e293b;font-size:11px;padding:40px}
h1{color:#7f1d1d;font-size:20px;margin-bottom:20px;text-align:center}.info{background:#fff5f5;padding:15px;border-radius:8px;border-left:3px solid #dc2626;margin:20px 0}
.row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dashed #fecaca}.row:last-child{border:none}.total{background:#7f1d1d;color:#fff;padding:15px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-top:20px;font-size:16px;font-weight:700}.total span:last-child{color:#fbbf24}
</style></head><body>
<h1>STAFF MISTAKE REPORT</h1>
<div style="text-align:center;color:#64748b;margin-bottom:20px">${st.company_name_en||''} | Date: ${m.date||'N/A'}</div>
<div class="info"><div class="row"><span>Employee</span><span style="font-weight:600">${m.employees?.name||'N/A'}</span></div>
<div class="row"><span>Old Ticket No</span><span style="font-weight:600">${m.old_ticket_no||'N/A'}</span></div>
<div class="row"><span>New Ticket No</span><span style="font-weight:600">${m.new_ticket_no||'N/A'}</span></div>
<div class="row"><span>Paid by Employee</span><span style="font-weight:600">${m.paid_by_employee?'Yes':'No'}</span></div></div>
<div class="total"><span>Loss Amount</span><span>${(m.loss_amount||0).toFixed(2)} SAR</span></div>
</body></html>`;
};

/* ═══ HELPERS ═══ */
const DRAFT_KEY = 'erp_invoice_draft';
const exportToExcel = (data, filename) => { if(!data||!data.length)return; const h=Object.keys(data[0]); const csv=[h.join(','),...data.map(r=>h.map(k=>{let v=r[k]??'';if(typeof v==='string'&&(v.includes(',')||v.includes('"')||v.includes('\n')){v='"'+v.replace(/"/g,'""')+'"';}return v;}).join(','))].join('\n')].join('\n'); const b=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=filename+'.csv'; a.click(); URL.revokeObjectURL(u); };
const loadDrafts = () => { try{return JSON.parse(localStorage.getItem(DRAFT_KEY)||'[]');}catch(e){return[];} };
const saveDraft = (d) => { try{const ds=loadDrafts(); const i=ds.findIndex(x=>x.id===d.id); if(i>=0)ds[i]=d; else ds.unshift(d); localStorage.setItem(DRAFT_KEY,JSON.stringify(ds.slice(0,20)));}catch(e){} };
const deleteDraft = (id) => { try{localStorage.setItem(DRAFT_KEY,JSON.stringify(loadDrafts().filter(d=>d.id!==id)));}catch(e){} };
const generateInvoiceNo = async () => { const n=new Date(); const p='INV-'+n.getFullYear().toString().slice(-2)+(n.getMonth()+1).toString().padStart(2,'0'); try{const{data}=await supabase.from('invoices').select('invoice_no').ilike('invoice_no',p+'%').order('invoice_no',{ascending:false}).limit(1); if(data&&data.length>0){const num=parseInt(data[0].invoice_no.split('-').pop()||'0'); return p+'-'+(num+1).toString().padStart(4,'0');}}catch(e){} return p+'-0001'; };
const generateRefundNo = async () => { const n=new Date(); const p='REF-'+n.getFullYear().toString().slice(-2)+(n.getMonth()+1).toString().padStart(2,'0'); try{const{data}=await supabase.from('invoices').select('invoice_no').ilike('invoice_no',p+'%').order('invoice_no',{ascending:false}).limit(1); if(data&&data.length>0){const num=parseInt(data[0].invoice_no.split('-').pop()||'0'); return p+'-'+(num+1).toString().padStart(4,'0');}}catch(e){} return p+'-0001'; };

/* ═════════════════════════════════════════════════════════════
   MAIN HOOK — EXACT MATCH WITH YOUR SUPABASE SCHEMA
   ═══════════════════════════════════════════════════════════════ */
export default function useERPState() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const t = useMemo(() => translations[lang], [lang]);
  const tr = translations;

  /* ── AUTH — default profile so NEVER null ── */
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({ id:'default', name:'User', role:'Admin', is_admin:true, can_access_hr:true, can_access_bank:true, can_access_invoices:true, can_access_reports:true, can_access_settings:true, tenant_id:'default' });
  const [initError, setInitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); }, []);
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState({ type: null, data: null });
  const [previewHTML, setPreviewHTML] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Standard');
  const [contractMarkup, setContractMarkup] = useState('0');
  const [contractTerms, setContractTerms] = useState('');

  /* ── DATA — all keys that useERPActions uses ── */
  const [data, setData] = useState({
    invoices:[], customers:[], corporates:[], creditors:[], employees:[], expenses:[], vendors:[], packages:[], branches:[],
    portals:[], bankTransactions:[], investors:[], auditLogs:[], settings:{}, notifications:[], attendance:[],
    payroll:[], creditLimits:[], recurringInvoices:[], quotationRequests:[], staffMistakes:[], cashbook:[], tenants:[]
  });

  /* ── FORMS — exact field names from useERPActions ── */
  const [invForm, setInvForm] = useState({ custType:'Individual', custId:'new', custName:'', custPhone:'', corpId:'new', corpName:'', corpVat:'', corpPhone:'', corpAddress:'', passengers:[''], employeeId:'', portalId:'', bookingDate:today, invoiceDate:today, bookingType:'New Booking', linkedInvId:'', oldTicketNo:'', oldPnr:'', oldAirline:'', oldSector:'', oldSellPrice:0, oldBookingDate:'', oldPassengers:'', oldFlightType:'', oldPaymentMethod:'', refundReason:'', service:'Flight Ticket', flightType:'Domestic', flightJourney:'Single', refundable:'Refundable', flightSector:'', airline:'', destination:'', hotelName:'', checkIn:'', checkOut:'', visaType:'Tourist', serviceName:'', pnr:'', ticketNo:'', qty:1, cost:0, sell:0, discount:0, taxRate:'15', payment:'Cash', paid:'', creditDueDate:'', creditorId:'', tabbyNo:'', tamaraNo:'', ticketStatus:'Confirmed', useCredit:0, creditCustId:'', status:'Unpaid' });
  const [expForm, setExpForm] = useState({ expense_type:'', payment_mode:'Cash', description:'', amount:'', expense_date:today, items:[] });
  const [corpForm, setCorpForm] = useState({ name:'', vat_no:'', phone:'', address:'' });
  const [creditorForm, setCreditorForm] = useState({ name:'', phone:'', address:'' });
  const [custForm, setCustForm] = useState({ name:'', phone:'', store_credit:0 });
  const [vendorForm, setVendorForm] = useState({ name:'', phone:'', balance:0 });
  const [pkgForm, setPkgForm] = useState({ name:'', price:'', desc:'', duration:'', inclusions:'' });
  const [brnForm, setBrnForm] = useState({ name:'', location:'', phone:'', manager:'', email:'', timing:'', status:'Active' });
  const [empForm, setEmpForm] = useState({ name:'', phone:'', email:'', role:'', base_salary:'', commission:'' });
  const [srvForm, setSrvForm] = useState({ name:'', type:'', price:'' });
  const [investForm, setInvestForm] = useState({ name:'', amount:'', date:'' });
  const [settleForm, setSettleForm] = useState({ id:'', date:today, mode:'Cash' });
  const [refundForm, setRefundForm] = useState({ id:'', date:today, compRefund:0, custRefund:0, mode:'Cash', reason:'', portalId:'', creditBalance:0 });
  const [transferForm, setTransferForm] = useState({ from:'', to:'', amount:'', date:today, reason:'' });
  const [setForm, setSetForm] = useState({ custom_fields:[] });
  const [userForm, setUserForm] = useState({ name:'', email:'', role:'', password:'' });
  const [portalForm, setPortalForm] = useState({ name:'', current_balance:0 });
  const [tenantForm, setTenantForm] = useState({ agency_name:'', owner_email:'', subscription_end_date:'', company_name_ar:'', vat_no:'', cr_no:'', phone:'', address_ar:'' });
  const [profileForm, setProfileForm] = useState({ username:'', avatar_url:'', phone:'', address:'' });
  const [payForm, setPayForm] = useState({ employee_id:'', month:'', base_salary:0, commission:0, overtime:0, gift:0, advance_deduction:0, mistakes_deduction:0, other_deduction:0, payment_mode:'Cash' });
  const [passForm, setPassForm] = useState({ newPass:'' });

  /* ── EDIT IDs ── */
  const [editInvId, setEditInvId] = useState(null);
  const [editExpId, setEditExpId] = useState(null);
  const [editCorpId, setEditCorpId] = useState(null);
  const [editCredId, setEditCredId] = useState(null);
  const [editCustId, setEditCustId] = useState(null);
  const [editVendId, setEditVendId] = useState(null);
  const [editPkgId, setEditPkgId] = useState(null);
  const [editBrnId, setEditBrnId] = useState(null);
  const [editEmpId, setEditEmpId] = useState(null);
  const [editSrvId, setEditSrvId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  /* ── SAFE TABLE LOADER — 404/timeout se crash nahi hoga ── */
  const safeLoad = useCallback(async (table, key, opts) => {
    opts = opts || {};
    try {
      var q = supabase.from(table).select(opts.select || '*');
      if (opts.order) q = q.order(opts.order.col, { ascending: opts.order.asc !== false });
      if (opts.limit) q = q.limit(opts.limit);
      if (opts.eq) { Object.keys(opts.eq).forEach(function(k) { q = q.eq(k, opts.eq[k]); }); }
      if (opts.ilike) { Object.keys(opts.ilike).forEach(function(k) { q = q.ilike(k, opts.ilike[k]); }); }
      if (opts.single) {
        var r = await q.single();
        if (r.data) setData(function(p) { var n = Object.assign({}, p); n[key] = r.data; return n; });
      } else {
        var r2 = await q;
        if (r2.data) setData(function(p) { var n = Object.assign({}, p); n[key] = r2.data; return n; });
      }
    } catch (e) { console.warn('[ERP] Skip ' + table + ':', e.message); }
  }, []);

  /* ── FETCH ALL — YOUR exact table names ── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        safeLoad('settings', 'settings', { single: true }),
        safeLoad('invoices', 'invoices', { order:{ col:'created_at', asc:false }, select:'*, customers(name), corporates(name), employees(name)' }),
        safeLoad('customers', 'customers', { order:{ col:'name', asc:true } }),
        safeLoad('corporates', 'corporates', { order:{ col:'name', asc:true } }),
        safeLoad('creditors', 'creditors', { order:{ col:'name', asc:true } }),
        safeLoad('employees', 'employees', { order:{ col:'name', asc:true } }),
        safeLoad('expenses', 'expenses', { order:{ col:'created_at', asc:false } }),
        safeLoad('vendors', 'vendors', { order:{ col:'name', asc:true } }),
        safeLoad('packages', 'packages', { order:{ col:'name', asc:true } }),
        safeLoad('branches', 'branches', { order:{ col:'name', asc:true } }),
        safeLoad('portals', 'portals', { order:{ col:'name', asc:true } }),
        safeLoad('bank_transactions', 'bankTransactions', { order:{ col:'created_at', asc:false } }),
        safeLoad('investors', 'investors', { order:{ col:'name', asc:true } }),
        safeLoad('audit_logs', 'auditLogs', { order:{ col:'created_at', asc:false }, limit:500 }),
        safeLoad('notifications', 'notifications', { order:{ col:'created_at', asc:false }, limit:100 }),
        safeLoad('attendance', 'attendance', { order:{ col:'date', asc:false } }),
        safeLoad('payroll', 'payroll', { order:{ col:'created_at', asc:false } }),
        safeLoad('staff_mistakes', 'staffMistakes', { order:{ col:'created_at', asc:false } }),
        safeLoad('cashbook', 'cashbook', { order:{ col:'created_at', asc:false } }),
        safeLoad('tenants', 'tenants', { order:{ col:'created_at', asc:false } }),
        safeLoad('contracts', 'contracts', { order:{ col:'created_at', asc:false } }),
        safeLoad('emp_advances', 'emp_advances', { order:{ col:'created_at', asc:false } }),
        safeLoad('employee_advances', 'employee_advances', { order:{ col:'created_at', asc:false } }),
      ]);
    } catch (e) { console.error('[ERP] fetchAll:', e); }
    finally { setLoading(false); }
  }, [safeLoad]);

  /* ── LOG ACTION — uses user_email per your schema ── */
  const logAction = useCallback(async (details) => {
    try { await supabase.from('audit_logs').insert([{ user_email: user?.email || 'system', action:'user_action', details:details, tenant_id: userProfile?.tenant_id }]); } catch(e) {}
  }, [user, userProfile]);

  /* ── INIT: Auth + Profile ── */
  useEffect(function() {
    var mounted = false;
    const init = async () => {
      if (mounted) return;
      mounted = true;
      try {
        var authResult = await supabase.auth.getSession();
        if (authResult.error || !authResult.data.session) {
          setInitError('Not authenticated. Redirecting to login...');
          router.push('/login');
          return;
        }
        var session = authResult.data.session;
        setUser(session.user);
        /* Load real profile from app_users table — your schema: id = auth user id */
        try {
          var profResult = await supabase.from('app_users').select('*').eq('id', session.user.id).single();
          if (profResult.data) {
            setUserProfile(profResult.data);
          }
        } catch(e) {
          console.warn('[ERP] app_users load failed, using default profile');
        }
        await fetchAll();
      } catch(e) {
        console.error('[ERP] Init error:', e);
        setInitError(e.message || 'Initialization failed. Try clearing browser cache.');
      }
    };
    init();
  }, [router, fetchAll]);

  /* ── Auth listener ── */
  useEffect(function() {
    var sub = supabase.auth.onAuthStateChange(function(event, session) {
      if (event === 'SIGNED_OUT') { setUser(null); setUserProfile({ id:'default', name:'User', role:'Admin', is_admin:true, can_access_hr:true, can_access_bank:true, can_access_invoices:true, can_access_reports:true, can_access_settings:true, tenant_id:'default' }); router.push('/login'); }
      if (event === 'SIGNED_IN' && session) { setUser(session.user); window.location.reload(); }
    });
    return function() { sub.data.subscription.unsubscribe(); };
  }, [router]);

  return {
    t, tr, lang, setLang, translations:tr,
    user, setUser, userProfile, setUserProfile, initError, loading, setLoading,
    data, setData, fetchAll, logAction, showToast, toast, setToast,
    router, page, setPage, today,
    modal, setModal, previewHTML, setPreviewHTML,
    chatInput, setChatInput, chatMessages, setChatMessages,
    contractCorpName, setContractCorpName, contractType, setContractType,
    contractMarkup, setContractMarkup, contractTerms, setContractTerms,
    invForm, setInvForm, expForm, setExpForm, corpForm, setCorpForm,
    creditorForm, setCreditorForm, custForm, setCustForm, vendorForm, setVendorForm,
    pkgForm, setPkgForm, brnForm, setBrnForm, empForm, setEmpForm,
    srvForm, setSrvForm, investForm, setInvestForm, settleForm, setSettleForm,
    refundForm, setRefundForm, transferForm, setTransferForm, setForm, setSetForm,
    userForm, setUserForm, portalForm, setPortalForm, tenantForm, setTenantForm,
    profileForm, setProfileForm, payForm, setPayForm, passForm, setPassForm,
    editInvId, setEditInvId, editExpId, setEditExpId, editCorpId, setEditCorpId,
    editCredId, setEditCredId, editCustId, setEditCustId, editVendId, setEditVendId,
    editPkgId, setEditPkgId, editBrnId, setEditBrnId, editEmpId, setEditEmpId,
    editSrvId, setEditSrvId, editUserId, setEditUserId,
    getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getContractHTML, getMistakeHTML,
    getAirlineCheckInURL, getAIMessage, exportToExcel, loadDrafts, saveDraft, deleteDraft,
    generateInvoiceNo, generateRefundNo,
  };
}
