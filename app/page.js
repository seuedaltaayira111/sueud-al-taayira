'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [lang, setLang] = useState('en');
  const [isExtracting, setIsExtracting] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', serviceType: 'Flight', 
    portal: 'Akbar', costPrice: '', sellPrice: '', paymentMethod: 'Cash'
  });

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    fetchInvoices();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const fetchInvoices = async () => {
    const { data } = await supabase.from('invoices').select(`*, customers(name), portals(name)`);
    if (data) setInvoices(data.reverse());
  };

  const handleTicketUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsExtracting(true);
    try {
      const Tesseract = await import('tesseract.js');
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const phoneMatch = text.match(/\+?\d[\d -]{8,12}\d/);
      setFormData(prev => ({ ...prev, customerPhone: phoneMatch ? phoneMatch[0] : '' }));
    } catch (error) {
      alert('OCR Error: ' + error.message);
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
    return btoa(tlv);
  };

  const generatePDF = async (invoice) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: QRCode } = await import('qrcode');

    const doc = new jsPDF();
    const zatcaBase64 = generateZatcaQR(invoice);
    const qrDataUrl = await QRCode.toDataURL(zatcaBase64);

    doc.setFontSize(20);
    doc.text("Sueud Al Taayira", 20, 20);
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
      setFormData({ customerName: '', customerPhone: '', serviceType: 'Flight', portal: 'Akbar', costPrice: '', sellPrice: '', paymentMethod: 'Cash' });
    }
  };

  // Agar user login nahi hai, toh blank screen dikhao
  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading ERP System...</div>;

  // Calculate Totals for Dashboard
  const totalSales = invoices.reduce((sum, inv) => sum + inv.sell_price, 0);
  const totalProfit = invoices.reduce((sum, inv) => sum + inv.profit, 0);

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #34495e', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Sueud Al Taayira</h2>
          <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#95a5a6' }}>صعود الطائرة</p>
        </div>
        <nav style={{ flex: 1, padding: '20px 0' }}>
          <button onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? activeStyle : inactiveStyle}>Dashboard</button>
          <button onClick={() => setActiveTab('create')} style={activeTab === 'create' ? activeStyle : inactiveStyle}>Create Invoice</button>
          <button onClick={() => setActiveTab('reports')} style={activeTab === 'reports' ? activeStyle : inactiveStyle}>Reports & Sales</button>
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #34495e' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Topbar */}
        <div style={{ backgroundColor: '#fff', padding: '15px 30px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{activeTab}</h3>
          <div>
            <span style={{ marginRight: '15px', fontSize: '14px', color: '#666' }}>Logged in as: <b>{user.email}</b></span>
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ padding: '5px 15px', cursor: 'pointer', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '5px' }}>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '30px' }}>
          
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={cardStyle}>
                  <h4>Total Invoices</h4>
                  <h2 style={{ color: '#2980b9' }}>{invoices.length}</h2>
                </div>
                <div style={cardStyle}>
                  <h4>Total Sales (SAR)</h4>
                  <h2 style={{ color: '#27ae60' }}>{totalSales.toFixed(2)}</h2>
                </div>
                <div style={cardStyle}>
                  <h4>Total Profit (SAR)</h4>
                  <h2 style={{ color: '#f39c12' }}>{totalProfit.toFixed(2)}</h2>
                </div>
              </div>
              <h4>Recent Invoices</h4>
              <InvoiceTable invoices={invoices.slice(0, 5)} generatePDF={generatePDF} />
            </div>
          )}

          {activeTab === 'create' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h4 style={{ marginTop: 0 }}>Upload Ticket (OCR)</h4>
                <input type="file" accept="image/*" onChange={handleTicketUpload} style={{ marginBottom: '10px', width: '100%' }} />
                {isExtracting && <p>Extracting data...</p>}
              </div>
              
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h4 style={{ marginTop: 0 }}>Invoice Details</h4>
                <form onSubmit={handleCreateInvoice} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <input name="customerName" placeholder="Customer Name" onChange={handleChange} value={formData.customerName} required style={inputStyle} />
                  <input name="customerPhone" placeholder="Phone Number" onChange={handleChange} value={formData.customerPhone} required style={inputStyle} />
                  <select name="serviceType" onChange={handleChange} value={formData.serviceType} style={inputStyle}>
                    <option>Flight</option><option>Hotel</option><option>Visa</option><option>Package</option>
                  </select>
                  <select name="portal" onChange={handleChange} value={formData.portal} style={inputStyle}>
                    <option>Akbar</option><option>Amadeus</option><option>NDC</option>
                  </select>
                  <input name="costPrice" type="number" placeholder="Cost Price (SAR)" onChange={handleChange} value={formData.costPrice} required style={inputStyle} />
                  <input name="sellPrice" type="number" placeholder="Sell Price (SAR)" onChange={handleChange} value={formData.sellPrice} required style={inputStyle} />
                  <select name="paymentMethod" onChange={handleChange} value={formData.paymentMethod} style={inputStyle}>
                    <option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option>
                  </select>
                  <button type="submit" style={{ padding: '12px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', gridColumn: 'span 2' }}>
                    Generate & Save Invoice
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h4>All Sales & Invoices</h4>
              <InvoiceTable invoices={invoices} generatePDF={generatePDF} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Styles Variables
const activeStyle = {
  display: 'block', width: '100%', textAlign: 'left', padding: '15px 25px', 
  backgroundColor: '#34495e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
};
const inactiveStyle = {
  display: 'block', width: '100%', textAlign: 'left', padding: '15px 25px', 
  backgroundColor: 'transparent', color: '#ecf0f1', border: 'none', cursor: 'pointer', fontSize: '16px'
};
const cardStyle = {
  backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', flex: 1
};
const inputStyle = {
  padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px'
};

// Reusable Table Component
function InvoiceTable({ invoices, generatePDF }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={thStyle}>Invoice No</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Portal</th>
            <th style={thStyle}>Sell Price</th>
            <th style={thStyle}>Profit</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{inv.invoice_no}</td>
              <td style={tdStyle}>{inv.customers?.name || 'N/A'}</td>
              <td style={tdStyle}>{inv.portals?.name || 'N/A'}</td>
              <td style={tdStyle}>{inv.sell_price} SAR</td>
              <td style={{ ...tdStyle, color: 'green', fontWeight: 'bold' }}>{inv.profit.toFixed(2)} SAR</td>
              <td style={tdStyle}>
                <button onClick={() => generatePDF(inv)} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '3px' }}>Download PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: '12px 15px', textAlign: 'left', fontSize: '14px', color: '#333' };
const tdStyle = { padding: '12px 15px', fontSize: '14px', color: '#555' };
