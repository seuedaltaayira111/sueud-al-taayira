'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [portals, setPortals] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', serviceType: 'Flight', 
    portal: 'Akbar', costPrice: '', sellPrice: '', paymentMethod: 'Cash'
  });

  const [rechargeData, setRechargeData] = useState({
    portal: 'Akbar', amount: '', description: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
      else setUser(session.user);
    });
    fetchAllData();
  }, [router]);

  const fetchAllData = async () => {
    const { data: inv } = await supabase.from('invoices').select(`*, customers(name), portals(name)`);
    if (inv) setInvoices(inv.reverse());

    const { data: por } = await supabase.from('portals').select('*');
    if (por) setPortals(por);

    const { data: rec } = await supabase.from('recharges').select(`*, portals(name)`).order('created_at', { ascending: false });
    if (rec) setRecharges(rec);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
      alert('OCR Error');
    }
    setIsExtracting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRechargeChange = (e) => {
    setRechargeData({ ...rechargeData, [e.target.name]: e.target.value });
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

  // CREATE INVOICE & DEDUCT PORTAL BALANCE
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const cost = parseFloat(formData.costPrice) || 0;
    const sell = parseFloat(formData.sellPrice) || 0;
    const profit = sell - cost;
    const vat = sell * 0.15;
    const total = sell + vat;
    const invoiceNo = `INV-${Date.now()}`;

    let customerId;
    const { data: existingCustomer } = await supabase.from('customers').select('*').eq('phone', formData.customerPhone).single();
    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer } = await supabase.from('customers').insert([{ name: formData.customerName, phone: formData.customerPhone }]).select().single();
      customerId = newCustomer.id;
    }

    const { data: portal } = await supabase.from('portals').select('*').eq('name', formData.portal).single();

    const { data: invoice } = await supabase.from('invoices').insert([{
      invoice_no: invoiceNo, customer_id: customerId, portal_id: portal?.id,
      service_type: formData.serviceType, cost_price: cost, sell_price: sell,
      profit: profit, vat: vat, total: total, payment_method: formData.paymentMethod, status: 'active'
    }]).select().single();

    if (invoice) {
      // Deduct Cost Price from Portal Balance
      const newBalance = (portal.current_balance || 0) - cost;
      await supabase.from('portals').update({ current_balance: newBalance }).eq('id', portal.id);
      
      alert('Invoice Saved & Portal Balance Deducted!');
      fetchAllData();
      setFormData({ customerName: '', customerPhone: '', serviceType: 'Flight', portal: 'Akbar', costPrice: '', sellPrice: '', paymentMethod: 'Cash' });
    }
  };

  // ADD RECHARGE TO PORTAL
  const handleAddRecharge = async (e) => {
    e.preventDefault();
    const amount = parseFloat(rechargeData.amount);
    const { data: portal } = await supabase.from('portals').select('*').eq('name', rechargeData.portal).single();

    if (portal) {
      const newBalance = (portal.current_balance || 0) + amount;
      await supabase.from('portals').update({ current_balance: newBalance }).eq('id', portal.id);
      await supabase.from('recharges').insert([{ portal_id: portal.id, amount, description: rechargeData.description }]);
      
      alert('Recharge Added Successfully!');
      fetchAllData();
      setRechargeData({ portal: 'Akbar', amount: '', description: '' });
    }
  };

  // SALES RETURN / REFUND
  const handleRefund = async (invoiceId, portalId, costPrice) => {
    if (!confirm('Is this invoice refunded? Portal balance will be restored.')) return;
    
    await supabase.from('invoices').update({ status: 'refunded' }).eq('id', invoiceId);
    const { data: portal } = await supabase.from('portals').select('*').eq('id', portalId).single();
    if (portal) {
      const newBalance = (portal.current_balance || 0) + costPrice;
      await supabase.from('portals').update({ current_balance: newBalance }).eq('id', portalId);
    }
    alert('Invoice Refunded & Balance Restored!');
    fetchAllData();
  };

  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading ERP System...</div>;

  // CALCULATIONS FOR REPORTS
  const activeInvoices = invoices.filter(i => i.status === 'active');
  const totalSales = activeInvoices.reduce((sum, inv) => sum + inv.sell_price, 0);
  const totalProfit = activeInvoices.reduce((sum, inv) => sum + inv.profit, 0);
  const totalRecharges = recharges.reduce((sum, rec) => sum + rec.amount, 0);
  
  const today = new Date().toISOString().split('T')[0];
  const dailySales = activeInvoices.filter(i => new Date(i.created_at).toISOString().split('T')[0] === today);
  const dailySalesAmount = dailySales.reduce((sum, inv) => sum + inv.sell_price, 0);
  const dailyProfit = dailySales.reduce((sum, inv) => sum + inv.profit, 0);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial, sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #34495e', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Sueud Al Taayira</h2>
          <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#95a5a6' }}>صعود الطائرة</p>
        </div>
        <nav style={{ flex: 1, padding: '20px 0' }}>
          <button onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? activeStyle : inactiveStyle}>📊 Dashboard</button>
          <button onClick={() => setActiveTab('create')} style={activeTab === 'create' ? activeStyle : inactiveStyle}>🎫 Create Invoice</button>
          <button onClick={() => setActiveTab('portals')} style={activeTab === 'portals' ? activeStyle : inactiveStyle}>💰 Recharge & Balance</button>
          <button onClick={() => setActiveTab('reports')} style={activeTab === 'reports' ? activeStyle : inactiveStyle}>📈 Financial Reports</button>
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #34495e' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ backgroundColor: '#fff', padding: '15px 30px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{activeTab}</h3>
          <span style={{ fontSize: '14px', color: '#666' }}>Logged in as: <b>{user.email}</b></span>
        </div>

        <div style={{ padding: '30px' }}>
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={cardStyle}><h4>Today Sales</h4><h2 style={{ color: '#2980b9' }}>{dailySalesAmount.toFixed(2)} SAR</h2></div>
                <div style={cardStyle}><h4>Today Profit</h4><h2 style={{ color: '#27ae60' }}>{dailyProfit.toFixed(2)} SAR</h2></div>
                <div style={cardStyle}><h4>Total Active Sales</h4><h2 style={{ color: '#8e44ad' }}>{totalSales.toFixed(2)} SAR</h2></div>
              </div>
              <h4>Recent Invoices</h4>
              <InvoiceTable invoices={invoices.slice(0, 5)} generatePDF={generatePDF} handleRefund={handleRefund} />
            </div>
          )}

          {/* CREATE INVOICE */}
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
                    {portals.map(p => <option key={p.id}>{p.name}</option>)}
                  </select>
                  <input name="costPrice" type="number" placeholder="Cost Price (SAR)" onChange={handleChange} value={formData.costPrice} required style={inputStyle} />
                  <input name="sellPrice" type="number" placeholder="Sell Price (SAR)" onChange={handleChange} value={formData.sellPrice} required style={inputStyle} />
                  <select name="paymentMethod" onChange={handleChange} value={formData.paymentMethod} style={inputStyle}>
                    <option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option>
                  </select>
                  <button type="submit" style={{ padding: '12px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', gridColumn: 'span 2' }}>
                    Generate & Save Invoice
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* PORTALS & RECHARGE */}
          {activeTab === 'portals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              {/* Recharge Form */}
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h4 style={{ marginTop: 0 }}>Add Recharge to Portal</h4>
                <form onSubmit={handleAddRecharge} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <select name="portal" onChange={handleRechargeChange} value={rechargeData.portal} style={inputStyle}>
                    {portals.map(p => <option key={p.id}>{p.name}</option>)}
                  </select>
                  <input name="amount" type="number" placeholder="Amount (SAR)" onChange={handleRechargeChange} value={rechargeData.amount} required style={inputStyle} />
                  <input name="description" placeholder="Description (e.g. Bank Transfer)" onChange={handleRechargeChange} value={rechargeData.description} style={inputStyle} />
                  <button type="submit" style={{ padding: '12px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Recharge</button>
                </form>
              </div>

              {/* Balance & History */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ marginTop: 0 }}>Portal Current Balances</h4>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {portals.map(p => (
                      <div key={p.id} style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                        <h5>{p.name}</h5>
                        <h3 style={{ color: p.current_balance < 0 ? 'red' : 'green' }}>{(p.current_balance || 0).toFixed(2)} SAR</h3>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ marginTop: 0 }}>Recharge History</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ backgroundColor: '#f8f9fa' }}><th style={thStyle}>Date</th><th style={thStyle}>Portal</th><th style={thStyle}>Amount</th></tr></thead>
                    <tbody>
                      {recharges.map(rec => (
                        <tr key={rec.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={tdStyle}>{new Date(rec.recharge_date).toLocaleDateString()}</td>
                          <td style={tdStyle}>{rec.portals?.name}</td>
                          <td style={{ ...tdStyle, color: 'green', fontWeight: 'bold' }}>+{rec.amount} SAR</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* REPORTS */}
          {activeTab === 'reports' && (
            <div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={cardStyle}><h4>Total Sales</h4><h2>{totalSales.toFixed(2)} SAR</h2></div>
                <div style={cardStyle}><h4>Total Profit</h4><h2 style={{ color: 'green' }}>{totalProfit.toFixed(2)} SAR</h2></div>
                <div style={cardStyle}><h4>Total Recharges</h4><h2 style={{ color: 'blue' }}>{totalRecharges.toFixed(2)} SAR</h2></div>
              </div>
              <h4>All Invoices & Sales Return</h4>
              <InvoiceTable invoices={invoices} generatePDF={generatePDF} handleRefund={handleRefund} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Reusable Table Component
function InvoiceTable({ invoices, generatePDF, handleRefund }) {
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
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} style={{ borderBottom: '1px solid #eee', backgroundColor: inv.status === 'refunded' ? '#ffebee' : 'transparent' }}>
              <td style={tdStyle}>{inv.invoice_no}</td>
              <td style={tdStyle}>{inv.customers?.name || 'N/A'}</td>
              <td style={tdStyle}>{inv.portals?.name || 'N/A'}</td>
              <td style={tdStyle}>{inv.sell_price} SAR</td>
              <td style={{ ...tdStyle, color: 'green', fontWeight: 'bold' }}>{inv.profit.toFixed(2)} SAR</td>
              <td style={tdStyle}>{inv.status === 'refunded' ? '❌ Refunded' : '✅ Active'}</td>
              <td style={tdStyle}>
                <button onClick={() => generatePDF(inv)} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '3px', marginRight: '5px' }}>PDF</button>
                {inv.status === 'active' && (
                  <button onClick={() => handleRefund(inv.id, inv.portal_id, inv.cost_price)} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '3px' }}>Refund</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const activeStyle = { display: 'block', width: '100%', textAlign: 'left', padding: '15px 25px', backgroundColor: '#34495e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const inactiveStyle = { display: 'block', width: '100%', textAlign: 'left', padding: '15px 25px', backgroundColor: 'transparent', color: '#ecf0f1', border: 'none', cursor: 'pointer', fontSize: '16px' };
const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', flex: 1 };
const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' };
const thStyle = { padding: '12px 15px', textAlign: 'left', fontSize: '14px', color: '#333' };
const tdStyle = { padding: '12px 15px', fontSize: '14px', color: '#555' };
