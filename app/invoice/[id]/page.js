'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const getInvoiceHTML = (inv, s) => {
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
  const cashPaid = paidAmount - usedCredit;
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
      body { font-family: 'Inter', 'Cairo', sans-serif; background: #fff; margin: 0; padding: 20px; color: #1e293b; }
      .invoice-box { max-width: 800px; margin: auto; background: #fff; overflow: hidden; border-radius: 12px; border: 1px solid #e2e8f0; }
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
      @media print { body { background: #fff; padding: 0; margin: 0; } .invoice-box { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; border: none; } }
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

export default function PublicInvoicePage({ params }) {
  const { id } = params;
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInv = async () => {
      if (!id) return;
      const { data } = await supabase.from('invoices').select(`*, customers(name, phone), corporates(name, vat_no, phone), employees(name, phone)`).eq('invoice_no', id).single();
      if (data) {
        const { data: sData } = await supabase.from('settings').select('*').eq('tenant_id', data.tenant_id).maybeSingle();
        setHtmlContent(getInvoiceHTML(data, sData || {}));
      }
    };
    fetchInv();
  }, [id]);

  const handleDownload = async () => {
    setLoading(true);
    const div = document.getElementById('printable-invoice');
    if (!div) { setLoading(false); return; }
    
    try {
      const canvas = await html2canvas(div, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${id}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!htmlContent) return <div style={{ padding: 50, textAlign: 'center', fontFamily: 'sans-serif' }}>Loading Invoice...</div>;

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Poppins', sans-serif" }}>
      <button onClick={handleDownload} disabled={loading} style={{ padding: '15px 30px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', fontSize: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {loading ? '⏳ Generating PDF...' : '📄 Download PDF'}
      </button>
      <div id="printable-invoice" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
