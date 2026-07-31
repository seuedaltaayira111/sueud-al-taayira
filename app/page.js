'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Tesseract from 'tesseract.js';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export default function Home() {
  const [lang, setLang] = useState('en');
  const [isExtracting, setIsExtracting] = useState(false);
  const [invoices, setInvoices] = useState([]);
  
  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', serviceType: 'Flight', 
    portal: 'Akbar', costPrice: '', sellPrice: '', paymentMethod: 'Cash'
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const { data } = await supabase.from('invoices').select(`*, customers(name), portals(name)`);
    if (data) setInvoices(data.reverse()); // Latest first
  };

  const handleTicketUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsExtracting(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const phoneMatch = text.match(/\+?\d[\d -]{8,12}\d/);
      setFormData(prev => ({ ...prev, customerPhone: phoneMatch ? phoneMatch[0] : '' }));
    } catch (error) {
      alert('OCR Error');
    }
    setIsExtracting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateZatcaQR = (invoice) => {
    const sellerName = "Sueud Al Taayira";
    const vatNumber = process.env.NEXT_PUBLIC_COMPANY_VAT || "123456789";
    const timestamp = new Date(invoice.created_at).toISOString();
    const total = invoice.total.toFixed(2);
    const vat = invoice.vat.toFixed(2);
    const enc = (tag, val) => String.fromCharCode(tag) + String.fromCharCode(val.length) + val;
    const tlv = enc(1, sellerName) + enc(2, vatNumber) + enc(3, timestamp) + enc(4, total) + enc(5, vat);
    return Buffer.from(tlv, 'utf8').toString('base64');
  };

  const generatePDF = async (invoice) => {
    const doc = new jsPDF();
    const zatcaBase64 = generateZatcaQR(invoice);
    const qrDataUrl = await QRCode.toDataURL(zatcaBase64);

    doc.setFontSize(20);
    doc.text(lang === 'en' ? "Sueud Al Taayira" : "Sueud Al Taayira", 20, 20);
    doc.setFontSize(10);
    doc.text(`VAT: ${process.env.NEXT_PUBLIC_COMPANY_VAT || 'N/A'}`, 20, 30);
    doc.text(`CR: ${process.env.NEXT_PUBLIC_COMPANY_CR || 'N/A'}`, 20, 35);
    doc.text(`Invoice No: ${invoice.invoice_no}`, 140, 20);
    doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 140, 25);
    doc.text(`Customer: ${invoice.customers?.name || 'N/A'}`, 20, 50);
    doc.text(`Phone: ${invoice.customers?.phone || 'N/A'}`, 20, 55);
    doc.text(`Service: ${invoice.service_type}`, 20, 60);
    doc.text(`Portal: ${invoice.portals?.name || 'N/A'}`, 20, 65);
    doc.text(`Sell Price: SAR ${invoice.sell_price.toFixed(2)}`, 140, 60);
    doc.text(`VAT (15%): SAR ${invoice.vat.toFixed(2)}`, 140, 65);
    doc.setFontSize(14);
    doc.text(`Total: SAR ${invoice.total.toFixed(2)}`, 140, 72);
    doc.addImage(qrDataUrl, 'PNG', 150, 80, 40, 40);
    doc.save(`${invoice.invoice_no}.pdf`);
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const cost = parseFloat(formData.costPrice) || 0;
    const sell = parseFloat(formData.sellPrice) || 0;
    const profit = sell - cost;
    const vat = sell * 0.15;
    const total = sell + vat;
    const invoiceNo = `INV-${Date.now()}`;

    let customerId;
    const { data: existingCustomer } = await supabase
      .from('customers').select('*').eq('phone', formData.customerPhone).single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer } = await supabase
        .from('customers').insert([{ name: formData.customerName, phone: formData.customerPhone }]).select().single();
      customerId = newCustomer.id;
    }

    const { data: portal } = await supabase.from('portals').select('*').eq('name', formData.portal).single();

    const { data: invoice } = await supabase.from('invoices').insert([{
      invoice_no: invoiceNo,
      customer_id: customerId,
      portal_id: portal?.id,
      service_type: formData.serviceType,
      cost_price: cost,
      sell_price: sell,
      profit: profit,
      vat: vat,
      total: total,
      payment_method: formData.paymentMethod
    }]).select().single();

    if (invoice) {
      alert('Invoice Saved Successfully!');
      fetchInvoices();
      generatePDF(invoice);
    }
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>
        <div>
          <h1>{lang === 'en' ? 'Sueud Al Taayira' : 'صعود الطائرة للسفر السياحة'}</h1>
          <p>Owner: Atallah Alanazi | Manager: Hamdan</p>
        </div>
        <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ padding: '10px', cursor: 'pointer' }}>
          {lang === 'en' ? 'العربية' : 'English'}
        </button>
      </header>

      <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>{lang === 'en' ? 'Upload Ticket for Auto-Extraction' : 'تحميل التذكرة للاستخراج التلقائي'}</h3>
        <input type="file" accept="image/*" onChange={handleTicketUpload} />
        {isExtracting && <p>Extracting data...</p>}
      </section>

      <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>{lang === 'en' ? 'Create Invoice' : 'إنشاء فاتورة'}</h3>
        <form onSubmit={handleCreateInvoice} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input name="customerName" placeholder="Customer Name" onChange={handleChange} value={formData.customerName} required style={{ padding: '10px', border: '1px solid #ccc' }} />
          <input name="customerPhone" placeholder="Phone Number" onChange={handleChange} value={formData.customerPhone} required style={{ padding: '10px', border: '1px solid #ccc' }} />
          <select name="serviceType" onChange={handleChange} value={formData.serviceType} style={{ padding: '10px', border: '1px solid #ccc' }}>
            <option>Flight</option><option>Hotel</option><option>Visa</option><option>Package</option>
          </select>
          <select name="portal" onChange={handleChange} value={formData.portal} style={{ padding: '10px', border: '1px solid #ccc' }}>
            <option>Akbar</option><option>Amadeus</option><option>NDC</option>
          </select>
          <input name="costPrice" type="number" placeholder="Cost Price (SAR)" onChange={handleChange} value={formData.costPrice} required style={{ padding: '10px', border: '1px solid #ccc' }} />
          <input name="sellPrice" type="number" placeholder="Sell Price (SAR)" onChange={handleChange} value={formData.sellPrice} required style={{ padding: '10px', border: '1px solid #ccc' }} />
          <select name="paymentMethod" onChange={handleChange} value={formData.paymentMethod} style={{ padding: '10px', border: '1px solid #ccc' }}>
            <option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option>
          </select>
          <button type="submit" style={{ padding: '12px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            {lang === 'en' ? 'Generate & Save Invoice' : 'حفظ الفاتورة'}
          </button>
        </form>
      </section>

      <section>
        <h3>{lang === 'en' ? 'Daily Sales & Invoices' : 'المبيعات اليومية'}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Invoice No</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Customer</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Portal</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Sell Price</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Profit</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{inv.invoice_no}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{inv.customers?.name || 'N/A'}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{inv.portals?.name || 'N/A'}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{inv.sell_price} SAR</td>
                <td style={{ border: '1px solid #ccc', padding: '10px', color: 'green', fontWeight: 'bold' }}>{inv.profit.toFixed(2)} SAR</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <button onClick={() => generatePDF(inv)} style={{ padding: '5px 10px', cursor: 'pointer' }}>Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
