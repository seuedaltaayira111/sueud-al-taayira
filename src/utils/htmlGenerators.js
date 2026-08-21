// utils/htmlGenerators.js

/**
 * Generate Invoice HTML
 */
export const getInvoiceHTML = (inv, s, lang = 'en') => {
  try {
    if (!inv) throw new Error('Invoice data is required');
    
    const st = s || {};
    const no = inv.invoice_no || 'N/A';
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://sueud-al-taayira.vercel.app/invoice/' + no)}`;
    
    // Calculate values with safety checks
    const ts = parseFloat(inv.total_sell) || 0;
    const disc = parseFloat(inv.discount) || 0;
    const sub = ts + disc;
    const vat = parseFloat(inv.vat) || 0;
    const tot = parseFloat(inv.total) || 0;
    const paid = parseFloat(inv.paid_amount) || 0;
    const uc = parseFloat(inv.used_credit) || 0;
    const cr = parseFloat(inv.cash_return) || 0;
    const cp = paid - uc - cr;
    const due = parseFloat(inv.due_amount) || 0;
    const qty = parseInt(inv.qty) || 1;
    const up = qty > 0 ? ts / qty : ts;
    
    const vr = vat > 0 && ts > 0 ? Math.round((vat / ts) * 100) : 0;
    const st2 = inv.status || (due > 0 ? 'Unpaid' : 'Paid');
    
    let pd = inv.payment_method || 'Cash';
    if (inv.payment_method === 'Credit' && inv.credit_due_date) {
      pd = `Credit (Due: ${inv.credit_due_date})`;
    }
    
    const isRe = inv.booking_type === 'Reissue' || inv.booking_type === 'Previous Booking';
    const pax = inv.passenger_names ? inv.passenger_names.replace(/\n/g, ', ') : 'N/A';

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${no}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Cairo', sans-serif; background: #fff; color: #1e293b; }
    .inv { max-width: 210mm; margin: auto; border: 1px solid #e2e8f0; }
    .hdr { display: flex; justify-content: space-between; padding: 30px; background: linear-gradient(135deg, #0c1d3a, #1a365d); color: #fff; gap: 20px; }
    .cblk { display: flex; gap: 15px; flex: 1; }
    .logo { width: 80px; height: 80px; object-fit: cover; border-radius: 10px; background: rgba(255,255,255,0.1); padding: 3px; }
    .ct h2 { font-size: 18px; font-weight: 800; color: #fbbf24; margin: 0; }
    .ct h1 { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 1.5px; margin: 3px 0 0; }
    .ct p { font-size: 11px; color: rgba(255,255,255,0.7); line-height: 1.8; margin: 6px 0 0; }
    .im { min-width: 220px; background: rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); }
    .im h3 { font-size: 26px; font-weight: 800; color: #fbbf24; text-transform: uppercase; line-height: 1.1; margin: 0; }
    .im h3 span { font-size: 13px; font-family: 'Cairo'; display: block; margin: 2px 0 0; }
    .mr { display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; border-bottom: 1px dashed rgba(255,255,255,0.12); padding-bottom: 3px; }
    .mr .l { color: rgba(255,255,255,0.6); }
    .mr .v { color: #fbbf24; font-weight: 700; }
    .sb { display: inline-block; padding: 5px 12px; border-radius: 14px; font-size: 11px; font-weight: 700; margin-top: 8px; ${st2 === 'Unpaid' ? 'background: rgba(251,191,36,0.2); color: #fbbf24' : 'background: rgba(52,211,153,0.2); color: #34d399'} }
    .body { padding: 25px; }
    .bt { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
    .dg { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 20px; }
    .ib { padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #1a365d; }
    .ir { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #f1f5f9; }
    .ir:last-child { border: none; }
    .ir .l { color: #64748b; }
    .ir .v { color: #0f172a; font-weight: 600; text-align: right; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    thead th { padding: 12px; background: #0c1d3a; color: #fbbf24; font-size: 11px; text-transform: uppercase; text-align: left; letter-spacing: 0.5px; }
    thead th.r { text-align: right; }
    thead th.c { text-align: center; }
    tbody td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
    tbody td.r { text-align: right; font-weight: 600; }
    tbody td.c { text-align: center; }
    .bs { display: grid; grid-template-columns: 1.5fr 1fr; gap: 18px; }
    .pb { padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
    .pr { display: flex; justify-content: space-between; font-size: 12px; padding: 5px 0; border-bottom: 1px dashed #cbd5e1; }
    .pr:last-child { border: none; }
    .tb { background: #0c1d3a; border-radius: 8px; padding: 15px; color: #fff; align-self: flex-start; }
    .tr { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; color: rgba(255,255,255,0.8); }
    .gt { display: flex; justify-content: space-between; padding: 10px 0 0; margin-top: 5px; border-top: 2px solid rgba(255,255,255,0.12); font-size: 18px; font-weight: 800; color: #fff; }
    .gt .v { color: #fbbf24; }
    .ft { padding: 14px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; gap: 14px; margin-top: auto; }
    .qr img { height: 65px; width: 65px; border-radius: 6px; border: 1px solid #e2e8f0; padding: 2px; background: #fff; }
    .fx { text-align: center; flex: 1; }
    @media print { body { background: #fff; padding: 0; margin: 0; } .inv { border: none; max-width: 100%; } }
  </style>
</head>
<body>
  <div class="inv" style="min-height: 1120px; display: flex; flex-direction: column;">
    <div class="hdr">
      <div class="cblk">
        ${st.logo_url ? `<img src="${st.logo_url}" crossorigin="anonymous" class="logo"/>` : ''}
        <div class="ct">
          <h2>${st.company_name_ar || 'صعود الطائرة للسفر والسياحة'}</h2>
          <h1>${st.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <p>${st.address_ar || 'Address'}<br/>VAT: ${st.vat_no || 'N/A'} | CR: ${st.cr_no || 'N/A'}<br/>Phone: ${st.phone || 'N/A'}</p>
        </div>
      </div>
      <div class="im">
        <h3>TAX INVOICE<span>فاتورة ضريبية</span></h3>
        <div class="mr"><span class="l">Inv No</span><span class="v">${no}</span></div>
        <div class="mr"><span class="l">Date</span><span class="v">${inv.invoice_date || ''}</span></div>
        <div class="mr"><span class="l">Booking</span><span class="v">${inv.booking_date || ''}</span></div>
        <div class="sb">${st2 === 'Unpaid' ? 'UNPAID / غير مدفوعة' : 'PAID / مدفوعة'}</div>
      </div>
    </div>
    
    <div class="body">
      <div class="dg">
        <div class="ib">
          <div class="bt">BILL TO / فاتورة إلى</div>
          <div class="ir"><span class="l">Name</span><span class="v">${inv.customers?.name || inv.corporates?.name || 'N/A'}</span></div>
          <div class="ir"><span class="l">Phone</span><span class="v">${inv.customers?.phone || 'N/A'}</span></div>
          <div class="ir"><span class="l">Sales Person</span><span class="v">${inv.employees?.name || 'N/A'}</span></div>
          <div class="ir"><span class="l">Passengers</span><span class="v" style="max-width: 150px; font-size: 11px; line-height: 1.4;">${pax}</span></div>
        </div>
        <div class="ib" style="border-left-color: #f59e0b;">
          <div class="bt">FLIGHT DETAILS</div>
          <div class="ir"><span class="l">Airline</span><span class="v">${inv.airline || 'N/A'}</span></div>
          <div class="ir"><span class="l">Sector</span><span class="v">${inv.flight_sector || 'N/A'}</span></div>
          <div class="ir"><span class="l">Type</span><span class="v">${inv.flight_type || 'N/A'}</span></div>
          <div class="ir"><span class="l">Journey</span><span class="v">${inv.flight_journey || 'N/A'}</span></div>
          <div class="ir"><span class="l">PNR</span><span class="v">${inv.pnr || 'N/A'}</span></div>
          <div class="ir"><span class="l">Ticket No</span><span class="v">${inv.ticket_no || 'N/A'}</span></div>
          <div class="ir"><span class="l">Refundable</span><span class="v">${inv.refundable_status || 'N/A'}</span></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="c">Qty</th>
            <th class="r">Unit Price</th>
            <th class="r">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${inv.sector || inv.service_type || 'Service'}</td>
            <td class="c">${qty}</td>
            <td class="r">${up.toFixed(2)}</td>
            <td class="r">${ts.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div class="bs">
        <div class="pb">
          <div class="bt">PAYMENT BREAKDOWN</div>
          <div class="pr"><span>Price</span><span style="font-weight: 600;">${tot.toFixed(2)} SAR</span></div>
          ${disc > 0 ? `<div class="pr" style="color: #34d399;"><span>Discount</span><span>- ${disc.toFixed(2)} SAR</span></div>` : ''}
          ${uc > 0 ? `<div class="pr" style="color: #7c3aed;"><span>Credit Used</span><span>- ${uc.toFixed(2)} SAR</span></div>` : ''}
          ${cr > 0 ? `<div class="pr" style="color: #ef4444;"><span>Cash Returned</span><span>- ${cr.toFixed(2)} SAR</span></div>` : ''}
          <div class="pr" style="border-top: 2px solid #cbd5e1; margin-top: 6px; padding-top: 6px; font-weight: 700;">
            <span>Paid (${pd})</span>
            <span style="color: #059669;">${cp.toFixed(2)} SAR</span>
          </div>
          <div class="pr" style="font-weight: 700;">
            <span>Due</span>
            <span style="color: ${due > 0 ? '#ef4444' : '#059669'};">${due.toFixed(2)} SAR</span>
          </div>
        </div>
        <div class="tb">
          <div class="tr"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
          ${disc > 0 ? `<div class="tr" style="color: #34d399;"><span>Discount</span><span>- ${disc.toFixed(2)}</span></div>` : ''}
          <div class="tr"><span>VAT (${vr}%)</span><span>${vat.toFixed(2)}</span></div>
          <div class="gt"><span>GRAND TOTAL</span><span class="v">${tot.toFixed(2)} SAR</span></div>
        </div>
      </div>
    </div>

    <div class="ft">
      <div class="qr"><img src="${qr}" alt="QR" crossorigin="anonymous"/></div>
      <div class="fx">
        <p style="font-size: 11px; color: #475569; font-weight: 600; margin: 0 0 2px;">Thank you! Have a safe flight.</p>
        <p style="font-size: 11px; color: #64748b; font-family: 'Cairo'; margin: 0;">شكراً لاختياركم. رحلة سعيدة!</p>
      </div>
      <div style="width: 80px;"></div>
    </div>
  </div>
</body>
</html>`;
  } catch (error) {
    console.error('Error generating invoice HTML:', error);
    return `<html><body><h1>Error generating invoice</h1><p>${error.message}</p></body></html>`;
  }
};

// Similar functions for getRefundHTML, getExpenseHTML, getSalarySlipHTML, getMistakeHTML, getContractHTML
// ... (I'll provide these in the next response if needed)
