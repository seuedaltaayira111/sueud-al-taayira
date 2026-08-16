'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Bilingual Invoice HTML Generator (Same as State Hook)
const getInvoiceHTML = (inv, s) => {
  const setting = s || {};
  const invoiceNo = inv.invoice_no || 'N/A';
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${invoiceNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trackUrl)}`;
  
  const aiMessages = [
    "Thank you for choosing us! We look forward to serving you again. / شكراً لاختياركم إيانا. نتطلع لخدمتكم مرة أخرى.",
    "Your satisfaction is our priority. Have a safe flight! / رضاكم هو أولويتنا. رحلة سعيدة!",
    "Experience seamless travel with us. Welcome back anytime! / اختبروا السفر السلس معنا. مرحباً بكم في أي وقت.",
    "We appreciate your business. See you on your next journey! / نحن نقدر تعاملكم معنا. نراكم في رحلتكم القادمة!"
  ];
  const aiFooterMsg = aiMessages[Math.floor(Math.random() * aiMessages.length)];
  
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
  
  let paymentDisplay = inv.payment_method || 'Cash';
  if (inv.payment_method === 'Credit' && inv.credit_due_date) paymentDisplay = `Credit (Due: ${inv.credit_due_date})`;

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
      body { font-family: 'Inter', 'Cairo', sans-serif; background: #fff; margin: 0; padding: 0; color: #1e293b; }
      .invoice-box { max-width: 900px; margin: auto; background: #fff; overflow: hidden; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; padding: 40px; background: linear-gradient(135deg, #0c1d3a 0%, #1a365d 100%); color: #fff; }
      .company-info { flex: 1; display: flex; flex-direction: column; gap: 15px; }
      .company-info .logo { max-height: 100px; max-width: 220px; border-radius: 8px; background: rgba(255,255,255,0.1); padding: 8px; }
      .company-text h2 { font-size: 24px; font-weight: 800; color: #fbbf24; }
      .company-text h1 { font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
      .company-text p { font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-top: 8px; }
      .invoice-meta { text-align: right; min-width: 250px; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
      .invoice-meta h3 { font-size: 36px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; }
      .meta-row { display: flex; justify-content: space-between; margin-top: 10px; font-size: 14px; }
      .meta-row .lbl { color: rgba(255,255,255,0.6); }
      .meta-row .val { color: #fbbf24; font-weight: 700; }
      .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 15px; ${dueAmount > 0 ? 'background: rgba(251,191,36,0.2); color: #fbbf24;' : 'background: rgba(52,211,153,0.2); color: #34d399;'} }
      .body { padding: 40px; }
      .bilingual-title { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
      .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
      .info-block { padding: 20px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #1a365d; }
      .info-row { display: flex; justify-content: space-between; font-size: 14px; padding: 4px 0; }
      .info-row .label { color: #64748b; }
      .info-row .value { color: #0f172a; font-weight: 600; text-align: right; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
      thead th { padding: 15px; background: #0c1d3a; color: #fbbf24; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-align: left; }
      thead th.ar { text-align: right; color: rgba(255,255,255,0.8); font-family: 'Cairo'; font-size: 14px; }
      tbody td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
      tbody td.ar { text-align: right; font-family: 'Cairo'; color: #64748b; }
      .bottom-section { display: flex; justify-content: space-between; gap: 40px; }
      .payment-breakdown { flex: 1; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
      .pay-row { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; }
      .totals-box { width: 320px; }
      .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; color: #64748b; }
      .grand-total { display: flex; justify-content: space-between; padding: 20px; background: #0c1d3a; color: #fff; border-radius: 12px; margin-top: 10px; font-size: 20px; font-weight: 800; }
      .grand-total .val { color: #fbbf24; }
      .footer { padding: 30px 40px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; }
      .qr-code img { height: 100px; width: 100px; border-radius: 8px; border: 1px solid #e2e8f0; padding: 5px; background: #fff; }
      .footer-text { text-align: center; flex: 1; padding: 0 30px; }
      .ai-msg { font-size: 13px; color: #475569; font-weight: 600; margin-bottom: 5px; }
      .ai-msg-ar { font-size: 13px; color: #64748b; font-family: 'Cairo'; }
      @media print { body { background: #fff; padding: 0; } .invoice-box { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; } }
    </style>
  </head>
  <body>
    <div class="invoice-box" id="printable-invoice">
      <div class="header">
        <div class="company-info">
          ${setting.logo_url ? `<img src="${setting.logo_url}" crossorigin="anonymous" class="logo" />` : ''}
          <div class="company-text">
            <h2>${setting.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
            <h1>${setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
            <p>${setting.address_ar || ''}<br/>VAT: ${setting.vat_no || 'N/A'} | CR: ${setting.cr_no || 'N/A'}</p>
          </div>
        </div>
        <div class="invoice-meta">
          <h3>TAX INVOICE<br/><span style="font-size:16px; font-family:'Cairo';">فاتورة ضريبية</span></h3>
          <div class="meta-row"><span class="lbl">Invoice No / رقم الفاتورة</span><span class="val">${invoiceNo}</span></div>
          <div class="meta-row"><span class="lbl">Date / التاريخ</span><span class="val">${inv.invoice_date || ''}</span></div>
          <div class="status-badge">${dueAmount > 0 ? 'UNPAID / غير مدفوعة' : 'PAID / مدفوعة'}</div>
        </div>
      </div>
      <div class="body">
        <div class="details-grid">
          <div class="info-block">
            <div class="bilingual-title"><span>BILL TO</span><span>فاتورة إلى</span></div>
            <div class="info-row"><span class="label">Name / الاسم</span><span class="value">${inv.customers?.name || inv.corporates?.name || 'N/A'}</span></div>
            <div class="info-row"><span class="label">Phone / الهاتف</span><span class="value">${inv.customers?.phone || 'N/A'}</span></div>
            <div class="info-row"><span class="label">Sales Person / الموظف</span><span class="value">${inv.employees?.name || 'N/A'}</span></div>
          </div>
          <div class="info-block" style="border-left-color: #f59e0b;">
            <div class="bilingual-title"><span>FLIGHT DETAILS</span><span>تفاصيل الرحلة</span></div>
            <div class="info-row"><span class="label">Airline / خط الطيران</span><span class="value">${inv.airline || 'N/A'}</span></div>
            <div class="info-row"><span class="label">Sector / القطاع</span><span class="value">${inv.flight_sector || 'N/A'}</span></div>
            <div class="info-row"><span class="label">PNR / رقم الحجز</span><span class="value">${inv.pnr || 'N/A'}</span></div>
            <div class="info-row"><span class="label">Ticket No / التذكرة</span><span class="value">${inv.ticket_no || 'N/A'}</span></div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>DESCRIPTION</th><th class="ar">الوصف</th>
              <th style="text-align:center;">QTY</th><th class="ar" style="text-align:center;">الكمية</th>
              <th style="text-align:right;">UNIT PRICE</th><th class="ar" style="text-align:right;">سعر الوحدة</th>
              <th style="text-align:right;">TOTAL</th><th class="ar" style="text-align:right;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${inv.sector || inv.service_type || 'Service'}</td><td class="ar">${inv.sector || inv.service_type || 'خدمة'}</td>
              <td style="text-align:center;">${inv.qty || 1}</td><td class="ar" style="text-align:center;">${inv.qty || 1}</td>
              <td style="text-align:right;">${unitPrice.toFixed(2)}</td><td class="ar" style="text-align:right;">${unitPrice.toFixed(2)}</td>
              <td style="text-align:right; font-weight:700;">${totalSell.toFixed(2)}</td><td class="ar" style="text-align:right; font-weight:700;">${totalSell.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div class="bottom-section">
          <div class="payment-breakdown">
            <div class="bilingual-title"><span>PAYMENT BREAKDOWN</span><span>تفاصيل الدفع</span></div>
            <div class="pay-row"><span>Payment Method / طريقة الدفع</span><span style="font-weight:600; color:#2563eb;">${paymentDisplay}</span></div>
            ${usedCredit > 0 ? `<div class="pay-row"><span>Credit Balance Used / رصيد مستخدم</span><span style="font-weight:600; color:#7c3aed;">- ${usedCredit.toFixed(2)} SAR</span></div>` : ''}
            ${cashPaid > 0 ? `<div class="pay-row"><span>Cash/Bank Paid / المدفوع</span><span style="font-weight:600; color:#059669;">${cashPaid.toFixed(2)} SAR</span></div>` : ''}
            <div class="pay-row" style="border-top:1px solid #e2e8f0; margin-top:5px; padding-top:10px;"><span style="font-weight:700;">Total Paid / إجمالي المدفوع</span><span style="font-weight:700; color:#059669; font-size:16px;">${paidAmount.toFixed(2)} SAR</span></div>
            <div class="pay-row"><span style="font-weight:700;">Amount Due / المتبقي</span><span style="font-weight:700; color:${dueAmount > 0 ? '#ef4444' : '#059669'}; font-size:16px;">${dueAmount.toFixed(2)} SAR</span></div>
          </div>
          <div class="totals-box">
            <div class="total-row"><span>Subtotal / الإجمالي قبل الخصم</span><span>${subTotal.toFixed(2)} SAR</span></div>
            ${discount > 0 ? `<div class="total-row" style="color:#059669;"><span>Discount / الخصم</span><span>- ${discount.toFixed(2)} SAR</span></div>` : ''}
            <div class="total-row"><span>VAT (${vatRate}%) / الضريبة</span><span>${vat.toFixed(2)} SAR</span></div>
            <div class="grand-total"><span>GRAND TOTAL / الإجمالي</span><span class="val">${total.toFixed(2)} SAR</span></div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="qr-code">
          <img src="${qrCodeUrl}" alt="Scan to Download" crossorigin="anonymous" />
          <p style="font-size: 10px; text-align: center; color: #94A3B8; margin-top: 5px;">Scan / امسح</p>
        </div>
        <div class="footer-text">
          <p class="ai-msg">${aiFooterMsg.split(' / ')[0]}</p>
          <p class="ai-msg-ar">${aiFooterMsg.split(' / ')[1]}</p>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 10px;">${setting.company_name_en || ''} | ${setting.phone || ''}</p>
        </div>
        <div style="width: 110px;"></div>
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
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
