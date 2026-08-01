'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const [portals, setPortals] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [settings, setSettings] = useState({});
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', portal: '', serviceType: 'Flight Ticket', paymentMethod: 'Cash', paidAmount: ''
  });
  
  const [items, setItems] = useState([
    { item_name: 'تذاكر ذهاب وعودة', description: '', price: 0, qty: 1, vat_percent: 0 }
  ]);
  
  const [rechargeData, setRechargeData] = useState({ portal: '', amount: '', description: '' });
  const [newPortalName, setNewPortalName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
      else setUser(session.user);
    });
    fetchAllData();
  }, [router]);

  const fetchAllData = async () => {
    const { data: inv } = await supabase.from('invoices').select(`*, customers(name), portals(name)`).order('created_at', { ascending: false });
    if (inv) setInvoices(inv);

    const { data: por } = await supabase.from('portals').select('*');
    if (por) {
      setPortals(por);
      setFormData(prev => ({ ...prev, portal: prev.portal || por[0]?.name || '' }));
      setRechargeData(prev => ({ ...prev, portal: prev.portal || por[0]?.name || '' }));
    }

    const { data: rec } = await supabase.from('recharges').select(`*, portals(name)`).order('created_at', { ascending: false });
    if (rec) setRecharges(rec);

    const { data: set } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (set) setSettings(set);
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  // Add New Portal (Company)
  const handleAddPortal = async (e) => {
    e.preventDefault();
    if (!newPortalName) return;
    await supabase.from('portals').insert([{ name: newPortalName, current_balance: 0 }]);
    setNewPortalName('');
    alert('New Portal/Company Added!');
    fetchAllData();
  };

  const handleItemChange = (index, e) => {
    const newItems = [...items];
    newItems[index][e.target.name] = e.target.value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { item_name: 'تذاكر ذهاب وعودة', description: '', price: 0, qty: 1, vat_percent: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const calcTotals = () => {
    let totalBeforeVat = 0, totalVat = 0;
    items.forEach(it => {
      const subtotal = parseFloat(it.price) * parseInt(it.qty);
      const vat = subtotal * (parseFloat(it.vat_percent) / 100);
      totalBeforeVat += subtotal;
      totalVat += vat;
    });
    const totalAfterVat = totalBeforeVat + totalVat;
    const paid = parseFloat(formData.paidAmount) || 0;
    const due = totalAfterVat - paid;
    return { totalBeforeVat, totalVat, totalAfterVat, paid, due };
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const { totalBeforeVat, totalVat, totalAfterVat, paid, due } = calcTotals();
    const invoiceNo = `INV-${Date.now()}`;
    const profit = totalBeforeVat * 0.1; // Adjust profit logic as needed
    
    let customerId;
    const { data: existingCustomer } = await supabase.from('customers').select('*').eq('phone', formData.customerPhone).single();
    if (existingCustomer) customerId = existingCustomer.id;
    else {
      const { data: newCustomer } = await supabase.from('customers').insert([{ name: formData.customerName, phone: formData.customerPhone }]).select().single();
      customerId = newCustomer.id;
    }

    const { data: portal } = await supabase.from('portals').select('*').eq('name', formData.portal).single();
    const { data: invoice } = await supabase.from('invoices').insert([{
      invoice_no: invoiceNo, customer_id: customerId, portal_id: portal?.id, service_type: formData.serviceType,
      sell_price: totalAfterVat, profit: profit, vat: totalVat, total: totalAfterVat,
      payment_method: formData.paymentMethod, status: 'active', total_before_vat: totalBeforeVat,
      paid_amount: paid, due_amount: due
    }]).select().single();

    if (invoice) {
      const itemsToInsert = items.map(it => ({
        invoice_id: invoice.id, item_name: it.item_name, description: it.description,
        price: parseFloat(it.price), qty: parseInt(it.qty), vat_percent: parseFloat(it.vat_percent),
        total: parseFloat(it.price) * parseInt(it.qty)
      }));
      await supabase.from('invoice_items').insert(itemsToInsert);

      const newBalance = (portal.current_balance || 0) - totalBeforeVat;
      await supabase.from('portals').update({ current_balance: newBalance }).eq('id', portal.id);
      
      alert('Invoice Saved & Portal Balance Deducted!');
      fetchAllData();
      setItems([{ item_name: 'تذاكر ذهاب وعودة', description: '', price: 0, qty: 1, vat_percent: 0 }]);
      setFormData({ customerName: '', customerPhone: '', portal: portals[0]?.name || '', serviceType: 'Flight Ticket', paymentMethod: 'Cash', paidAmount: '' });
    }
  };

  const handleAddRecharge = async (e) => {
    e.preventDefault();
    const amount = parseFloat(rechargeData.amount);
    const { data: portal } = await supabase.from('portals').select('*').eq('name', rechargeData.portal).single();
    if (portal) {
      const newBalance = (portal.current_balance || 0) + amount;
      await supabase.from('portals').update({ current_balance: newBalance }).eq('id', portal.id);
      await supabase.from('recharges').insert([{ portal_id: portal.id, amount, description: rechargeData.description }]);
      alert('Recharge Added!');
      fetchAllData();
      setRechargeData({ portal: portals[0]?.name || '', amount: '', description: '' });
    }
  };

  // ZATCA TLV Base64 QR Generator
  const generateZatcaQR = (invoice) => {
    const sellerName = settings.company_name_en || "Sueud Al Taayira";
    const vatNumber = settings.vat_no || "000000000000003";
    const timestamp = new Date(invoice.created_at).toISOString();
    const total = invoice.total.toFixed(2);
    const vat = invoice.vat.toFixed(2);
    const enc = (tag, val) => String.fromCharCode(tag) + String.fromCharCode(val.length) + val;
    const tlv = enc(1, sellerName) + enc(2, vatNumber) + enc(3, timestamp) + enc(4, total) + enc(5, vat);
    return btoa(tlv);
  };

  const generatePDF = async (invoice) => {
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');
    const { default: QRCode } = await import('qrcode');

    // Generate QR Code Image
    const zatcaBase64 = generateZatcaQR(invoice);
    const qrDataUrl = await QRCode.toDataURL(zatcaBase64);

    const pdfHtml = document.createElement('div');
    pdfHtml.style.direction = 'rtl';
    pdfHtml.style.padding = '20px';
    pdfHtml.style.width = '800px';
    pdfHtml.style.fontFamily = 'Arial, sans-serif';
    pdfHtml.style.backgroundColor = '#fff';
    pdfHtml.style.position = 'absolute';
    pdfHtml.style.left = '-9999px';
    
    pdfHtml.innerHTML = `
      <div style="border: 2px solid #000; padding: 20px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 15px;">
          <div style="text-align: center; width: 60%;">
            <h1 style="margin:0;">${settings.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h1>
            <h3 style="margin:5px 0;">${settings.company_name_en || 'Sueud Al Taayira'}</h3>
            <p style="margin:2px 0;">الرقم الضريبي: ${settings.vat_no || ''}</p>
            <p style="margin:2px 0;">السجل التجاري: ${settings.cr_no || ''}</p>
            <p style="margin:2px 0;">رقم الاختصار: ${settings.iata_no || ''}</p>
            <p style="margin:2px 0;">رقم اختصار سياحي: ${settings.tourist_no || ''}</p>
            <p style="margin:2px 0;">هاتف: ${settings.phone || ''}</p>
          </div>
          <div style="width: 35%; border-right: 1px solid #ccc; padding-right: 15px; text-align: right;">
            <h3 style="margin:0 0 10px 0;">فاتورة ضريبية</h3>
            <p style="margin:2px 0;">العميل: ${invoice.customers?.name || ''}</p>
            <p style="margin:2px 0;">رقم الفاتورة: ${invoice.invoice_no}</p>
            <p style="margin:2px 0;">تاريخ الفاتورة: ${new Date(invoice.created_at).toLocaleDateString()}</p>
            <p style="margin:2px 0;">نوع الخدمة: ${invoice.service_type}</p>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; text-align: center; font-size: 14px;">
          <thead>
            <tr style="background: #eee;">
              <th style="border: 1px solid #ccc; padding: 8px;">الصنف</th>
              <th style="border: 1px solid #ccc; padding: 8px;">الوصف</th>
              <th style="border: 1px solid #ccc; padding: 8px;">السعر</th>
              <th style="border: 1px solid #ccc; padding: 8px;">الكمية</th>
              <th style="border: 1px solid #ccc; padding: 8px;">نسبة الضريبة</th>
              <th style="border: 1px solid #ccc; padding: 8px;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ccc; padding: 5px;">${items[0]?.item_name || 'تذاكر'}</td>
              <td style="border: 1px solid #ccc; padding: 5px;">${items[0]?.description || ''}</td>
              <td style="border: 1px solid #ccc; padding: 5px;">${items[0]?.price || 0}</td>
              <td style="border: 1px solid #ccc; padding: 5px;">${items[0]?.qty || 1}</td>
              <td style="border: 1px solid #ccc; padding: 5px;">${items[0]?.vat_percent || 0}%</td>
              <td style="border: 1px solid #ccc; padding: 5px;">${invoice.total_before_vat || 0}</td>
            </tr>
          </tbody>
        </table>
        
        <div style="display:flex; justify-content:space-between; margin-top: 30px;">
          <div style="text-align: center;">
            <img src="${qrDataUrl}" width="120" height="120" />
            <p style="font-size:10px; margin-top:5px;">ZATCA QR Code</p>
          </div>
          <div style="text-align: left; width: 300px; font-size: 16px;">
            <p style="margin:5px 0;">الإجمالي قبل الضريبة: ${invoice.total_before_vat || 0} SAR</p>
            <p style="margin:5px 0;">الإجمالي بعد الضريبة: ${invoice.total || 0} SAR</p>
            <p style="margin:5px 0;">مدفوع: ${invoice.paid_amount || 0} SAR</p>
            <p style="margin:5px 0; font-weight: bold; font-size: 18px;">المبلغ المستحق (Credit): ${invoice.due_amount || 0} SAR</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(pdfHtml);
    
    const canvas = await html2canvas(pdfHtml, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
    doc.save(`${invoice.invoice_no}.pdf`);
    
    document.body.removeChild(pdfHtml);
  };

  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading ERP...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial' }}>
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: '#fff', display:'flex', flexDirection:'column' }}>
        <div style={{ padding: '20px', textAlign: 'center' }}><h2>Sueud Al Taayira</h2><p style={{fontSize:'12px', color:'#95a5a6'}}>صعود الطائرة</p></div>
        <nav style={{ flex: 1 }}>
          <button onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? activeStyle : inactiveStyle}>📊 Dashboard</button>
          <button onClick={() => setActiveTab('create')} style={activeTab === 'create' ? activeStyle : inactiveStyle}>🎫 Create Invoice</button>
          <button onClick={() => setActiveTab('portals')} style={activeTab === 'portals' ? activeStyle : inactiveStyle}>💰 Portals & Recharge</button>
          <button onClick={() => setActiveTab('reports')} style={activeTab === 'reports' ? activeStyle : inactiveStyle}>📈 Reports</button>
          <button onClick={() => router.push('/settings')} style={inactiveStyle}>⚙️ Settings</button>
        </nav>
        <div style={{ padding: '20px' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
        
        {/* CREATE INVOICE */}
        {activeTab === 'create' && (
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h2>Create New Invoice</h2>
            <form onSubmit={handleCreateInvoice}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <input name="customerName" placeholder="Customer Name" onChange={(e) => setFormData({...formData, customerName: e.target.value})} required style={inputStyle} />
                <input name="customerPhone" placeholder="Phone Number" onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} required style={inputStyle} />
                <select name="serviceType" onChange={(e) => setFormData({...formData, serviceType: e.target.value})} style={inputStyle}>
                  <option>Flight Ticket</option><option>Hotel</option><option>Visa</option>
                  <option>Package</option><option>Railway Ticket</option><option>Reissue Ticket</option>
                </select>
                <select name="portal" onChange={(e) => setFormData({...formData, portal: e.target.value})} style={inputStyle} required>
                  {portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select name="paymentMethod" onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} style={inputStyle}>
                  <option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option>
                </select>
                <input name="paidAmount" type="number" placeholder="Paid Amount (SAR)" onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} style={inputStyle} />
              </div>
              
              <h3>Items (Tickets/Services)</h3>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input name="item_name" placeholder="Item Name (e.g. تذاكر)" value={item.item_name} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="description" placeholder="Description (JED-LKO)" value={item.description} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="price" type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="qty" type="number" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="vat_percent" type="number" placeholder="VAT %" value={item.vat_percent} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <button type="button" onClick={() => removeItem(index)} style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius:'4px' }}>X</button>
                </div>
              ))}
              <button type="button" onClick={addItem} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>+ Add Item</button>

              <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '18px' }}>
                <b>Total: {calcTotals().totalAfterVat.toFixed(2)} SAR | Due (Credit): {calcTotals().due.toFixed(2)} SAR</b>
              </div>
              <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '20px', fontSize: '16px' }}>SAVE & GENERATE INVOICE</button>
            </form>
          </div>
        )}

        {/* PORTALS & RECHARGE */}
        {activeTab === 'portals' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              {/* Add Recharge */}
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                <h3>💰 Add Recharge</h3>
                <form onSubmit={handleAddRecharge} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <select name="portal" onChange={(e) => setRechargeData({...rechargeData, portal: e.target.value})} style={inputStyle}>
                    {portals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  <input name="amount" type="number" placeholder="Amount (SAR)" onChange={(e) => setRechargeData({...rechargeData, amount: e.target.value})} required style={inputStyle} />
                  <input name="description" placeholder="Description (Bank/Cash)" onChange={(e) => setRechargeData({...rechargeData, description: e.target.value})} style={inputStyle} />
                  <button type="submit" style={{ padding: '10px', backgroundColor: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer' }}>Recharge</button>
                </form>
              </div>

              {/* Add New Portal */}
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                <h3>🏢 Add New Company/Portal</h3>
                <form onSubmit={handleAddPortal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" placeholder="e.g. Flyadeal, SVC" value={newPortalName} onChange={(e) => setNewPortalName(e.target.value)} style={inputStyle} required />
                  <button type="submit" style={{ padding: '10px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer' }}>Add Portal</button>
                </form>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>Current Balances & Recharge History</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {portals.map(p => (
                  <div key={p.id} style={{ flex: 1, padding: '15px', backgroundColor: '#f8f9fa', textAlign: 'center', borderRadius: '8px' }}>
                    <h4 style={{margin:'0 0 5px'}}>{p.name}</h4>
                    <h3 style={{ color: p.current_balance < 0 ? 'red' : 'green', margin: 0 }}>{(p.current_balance || 0).toFixed(2)} SAR</h3>
                  </div>
                ))}
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize:'14px' }}>
                <thead><tr style={{ backgroundColor: '#f8f9fa' }}><th style={thStyle}>Date</th><th style={thStyle}>Portal</th><th style={thStyle}>Amount</th></tr></thead>
                <tbody>
                  {recharges.map(rec => (
                    <tr key={rec.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tdStyle}>{new Date(rec.created_at).toLocaleDateString()}</td>
                      <td style={tdStyle}>{rec.portals?.name}</td>
                      <td style={{ ...tdStyle, color: 'green', fontWeight: 'bold' }}>+{rec.amount} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DASHBOARD & REPORTS */}
        {(activeTab === 'dashboard' || activeTab === 'reports') && (
          <div>
            <h2>{activeTab === 'dashboard' ? 'Recent Invoices' : 'All Sales Reports'}</h2>
            <table style={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={thStyle}>Inv No</th><th style={thStyle}>Customer</th><th style={thStyle}>Service</th>
                  <th style={thStyle}>Portal</th><th style={thStyle}>Payment</th><th style={thStyle}>Total</th>
                  <th style={thStyle}>Due (Credit)</th><th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>{inv.invoice_no}</td>
                    <td style={tdStyle}>{inv.customers?.name || 'N/A'}</td>
                    <td style={tdStyle}>{inv.service_type}</td>
                    <td style={tdStyle}>{inv.portals?.name || 'N/A'}</td>
                    <td style={tdStyle}>{inv.payment_method}</td>
                    <td style={tdStyle}>{inv.total} SAR</td>
                    <td style={{ ...tdStyle, color: inv.due_amount > 0 ? 'red' : 'green', fontWeight:'bold' }}>{inv.due_amount} SAR</td>
                    <td style={tdStyle}><button onClick={() => generatePDF(inv)} style={{ backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>PDF + QR</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const activeStyle = { display: 'block', width: '100%', textAlign: 'left', padding: '15px 25px', backgroundColor: '#34495e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const inactiveStyle = { display: 'block', width: '100%', textAlign: 'left', padding: '15px 25px', backgroundColor: 'transparent', color: '#ecf0f1', border: 'none', cursor: 'pointer', fontSize: '16px' };
const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' };
const thStyle = { padding: '12px 15px', textAlign: 'left', fontSize: '14px' };
const tdStyle = { padding: '12px 15px', fontSize: '14px' };
