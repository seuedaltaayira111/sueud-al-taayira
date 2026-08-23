'use client';

const BASE_URL = 'https://sueud-al-taayira.vercel.app';

export const handleShareWhatsApp = (inv, settings) => {
  const phone = inv.customers?.phone || '';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const msg = `Hello ${inv.customers?.name || ''},%0A
Here is your invoice details from ${settings.company_name_en || 'SUEUD AL TAAYIRA'}:%0A
Invoice No: ${inv.invoice_no}%0A
Date: ${inv.invoice_date}%0A
Total Amount: ${(inv.total || 0).toFixed(2)} SAR%0A
Due Amount: ${(inv.due_amount || 0).toFixed(2)} SAR%0A
%0A
You can view your invoice online here: ${BASE_URL}/invoice/${inv.invoice_no}`;
  const url = `https://wa.me/${cleanPhone}?text=${msg}`;
  window.open(url, '_blank');
};

export const handleShareEmail = (inv, settings) => {
  const email = inv.customers?.email || inv.corporates?.email || '';
  const subject = `Invoice ${inv.invoice_no} from ${settings.company_name_en || 'SUEUD AL TAAYIRA'}`;
  const body = `Hello ${inv.customers?.name || inv.corporates?.name || ''},

Please find your invoice details below:

Invoice No: ${inv.invoice_no}
Date: ${inv.invoice_date}
Total Amount: ${(inv.total || 0).toFixed(2)} SAR
Due Amount: ${(inv.due_amount || 0).toFixed(2)} SAR

You can view your invoice online here: ${BASE_URL}/invoice/${inv.invoice_no}

Thank you for choosing us!
 ${settings.company_name_en || 'SUEUD AL TAAYIRA'}`;
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoUrl, '_self');
};
