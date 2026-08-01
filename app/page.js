'use client';
import { useState, useEffect, useRef } from 'react';
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
  const [pdfData, setPdfData] = useState(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', portal: 'Akbar', paymentMethod: 'Cash', paidAmount: ''
  });
  
  const [items, setItems] = useState([
    { item_name: 'تذاكر ذهاب وعودة', description: '', price: 0, qty: 1, vat_percent: 0 }
  ]);
  const [rechargeData, setRechargeData] = useState({ portal: 'Akbar', amount: '', description: '' });

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
    if (por) setPortals(por);

    const { data: rec } = await supabase.from('recharges').select(`*, portals(name)`).order('created_at', { ascending: false });
    if (rec) setRecharges(rec);

    const { data: set } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (set) setSettings(set);
  };

  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  const handleItemChange = (index, e) => {
    const newItems = [...items];
    newItems[index][e.target.name] = e.target.value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { item_name: 'تذاكر ذهاب وعودة', description: '', price: 0, qty: 1, vat_percent: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  // CALCULATIONS
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
    const profit = totalBeforeVat * 0.1; // Dummy 10% profit calculation
    
    let customerId;
    const { data: existingCustomer } = await supabase.from('customers').select('*').eq('phone', formData.customerPhone).single();
    if (existingCustomer) customerId = existingCustomer.id;
    else {
      const { data: newCustomer } = await supabase.from('customers').insert([{ name: formData.customerName, phone: formData.customerPhone }]).select().single();
      customerId = newCustomer.id;
    }

    const { data: portal } = await supabase.from('portals').select('*').eq('name', formData.portal).single();
    const { data: invoice } = await supabase.from('invoices').insert([{
      invoice_no: invoiceNo, customer_id: customerId, portal_id: portal?.id,
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
      
      alert('Invoice Saved!');
      fetchAllData();
      setItems([{ item_name: 'تذاكر ذهاب وعودة', description: '', price: 0, qty: 1, vat_percent: 0 }]);
      setFormData({ customerName: '', customerPhone: '', portal: 'Akbar', paymentMethod: 'Cash', paidAmount: '' });
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
      setRechargeData({ portal: 'Akbar', amount: '', description: '' });
    }
  };

  const generatePDF = async (invoice) => {
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');

    // Create hidden HTML element for PDF
    const pdfHtml = document.createElement('div');
    pdfHtml.style.direction = 'rtl';
    pdfHtml.style.padding = '20px';
    pdfHtml.style.width = '800px';
    pdfHtml.style.fontFamily = 'Arial, sans-serif';
    pdfHtml.style.backgroundColor = '#fff';
    
    pdfHtml.innerHTML = `
      <div style="border: 2px solid #000; padding: 20px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 20px;">
          <div style="text-align: center; width: 60%;">
            <h1>${settings.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h1>
            <h3>${settings.company_name_en || 'Sueud Al Taayira'}</h3>
            <p>الرقم الضريبي: ${settings.vat_no || ''}</p>
            <p>السجل التجاري: ${settings.cr_no || ''}</p>
            <p>رقم الاختصار: ${settings.iata_no || ''}</p>
            <p>رقم اختصار سياحي: ${settings.tourist_no || ''}</p>
            <p>هاتف: ${settings.phone || ''}</p>
          </div>
          <div style="width: 35%; border-right: 1px solid #ccc; padding-right: 10px;">
            <h3>فاتورة ضريبية</h3>
            <p>العميل: ${invoice.customers?.name || ''}</p>
            <p>رقم الفاتورة: ${invoice.invoice_no}</p>
            <p>تاريخ الفاتورة: ${new Date(invoice.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; text-align: center;">
          <thead>
            <tr style="background: #eee;">
              <th style="border: 1px solid #ccc; padding: 5px;">الصنف</th>
              <th style="border: 1px solid #ccc; padding: 5px;">الوصف</th>
              <th style="border: 1px solid #ccc; padding: 5px;">السعر</th>
              <th style="border: 1px solid #ccc; padding: 5px;">الكمية</th>
              <th style="border: 1px solid #ccc; padding: 5px;">المجموع</th>
              <th style="border: 1px solid #ccc; padding: 5px;">نسبة الضريبة</th>
              <th style="border: 1px solid #ccc; padding: 5px;">قيمة الضريبة</th>
              <th style="border: 1px solid #ccc; padding: 5px;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ccc;">تذاكر ذهاب</td>
              <td style="border: 1px solid #ccc;">JED-LKO</td>
              <td style="border: 1px solid #ccc;">2085.00</td>
              <td style="border: 1px solid #ccc;">1</td>
              <td style="border: 1px solid #ccc;">2085.00</td>
              <td style="border: 1px solid #ccc;">0%</td>
              <td style="border: 1px solid #ccc;">0.00</td>
              <td style="border: 1px solid #ccc;">2085.00</td>
            </tr>
          </tbody>
        </table>
        
        <div style="margin-top: 20px; float: left; width: 300px;">
          <p>الإجمالي قبل الضريبة: ${invoice.total_before_vat || 0} SAR</p>
          <p>الإجمالي بعد الضريبة: ${invoice.total || 0} SAR</p>
          <p>مدفوع: ${invoice.paid_amount || 0} SAR</p>
          <p style="font-weight: bold;">المبلغ المستحق: ${invoice.due_amount || 0} SAR</p>
        </div>
      </div>
    `;
    document.body.appendChild(pdfHtml);
    
    const canvas = await html2canvas(pdfHtml);
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
    doc.save(`${invoice.invoice_no}.pdf`);
    
    document.body.removeChild(pdfHtml);
  };

  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading ERP...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial' }}>
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: '#fff' }}>
        <div style={{ padding: '20px', textAlign: 'center' }}><h2>Sueud Al Taayira</h2></div>
        <nav style={{ marginTop: '20px' }}>
          <button onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? activeStyle : inactiveStyle}>📊 Dashboard</button>
          <button onClick={() => setActiveTab('create')} style={activeTab === 'create' ? activeStyle : inactiveStyle}>🎫 Create Invoice</button>
          <button onClick={() => setActiveTab('portals')} style={activeTab === 'portals' ? activeStyle : inactiveStyle}>💰 Portals & Recharge</button>
          <button onClick={() => setActiveTab('reports')} style={activeTab === 'reports' ? activeStyle : inactiveStyle}>📈 Reports</button>
          <button onClick={() => router.push('/settings')} style={inactiveStyle}>⚙️ Settings</button>
        </nav>
        <div style={{ position: 'absolute', bottom: '20px', width: '250px' }}>
          <button onClick={handleLogout} style={{ width: '90%', padding: '10px', margin: '0 5%', backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
        {activeTab === 'create' && (
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h2>Create New Invoice</h2>
            <form onSubmit={handleCreateInvoice}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <input name="customerName" placeholder="Customer Name" onChange={(e) => setFormData({...formData, customerName: e.target.value})} required style={inputStyle} />
                <input name="customerPhone" placeholder="Phone Number" onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} required style={inputStyle} />
                <select name="portal" onChange={(e) => setFormData({...formData, portal: e.target.value})} style={inputStyle}>
                  {portals.map(p => <option key={p.id}>{p.name}</option>)}
                </select>
              </div>
              
              <h3>Items (Tickets)</h3>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input name="item_name" placeholder="Item Name (e.g. تذاكر)" value={item.item_name} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="description" placeholder="Description (JED-LKO)" value={item.description} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="price" type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="qty" type="number" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <input name="vat_percent" type="number" placeholder="VAT %" value={item.vat_percent} onChange={(e) => handleItemChange(index, e)} style={inputStyle} />
                  <button type="button" onClick={() => removeItem(index)} style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer' }}>X</button>
                </div>
              ))}
              <button type="button" onClick={addItem} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>+ Add Item</button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <select name="paymentMethod" onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} style={inputStyle}>
                  <option>Cash</option><option>Bank Transfer</option><option>Tabby</option><option>Tamara</option><option>Credit</option>
                </select>
                <input name="paidAmount" type="number" placeholder="Paid Amount" onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} style={inputStyle} />
                <div style={{ textAlign: 'right', paddingTop: '10px' }}>
                  <b>Total: {calcTotals().totalAfterVat.toFixed(2)} SAR | Due: {calcTotals().due.toFixed(2)} SAR</b>
                </div>
              </div>
              <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '20px', fontSize: '16px' }}>SAVE & GENERATE INVOICE</button>
            </form>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div>
            <h2>Recent Invoices</h2>
            <table style={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px' }}>
              <thead><tr style={{ backgroundColor: '#f8f9fa' }}><th style={thStyle}>Inv No</th><th style={thStyle}>Customer</th><th style={thStyle}>Total</th><th style={thStyle}>Due</th><th style={thStyle}>Action</th></tr></thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>{inv.invoice_no}</td>
                    <td style={tdStyle}>{inv.customers?.name || 'N/A'}</td>
                    <td style={tdStyle}>{inv.total} SAR</td>
                    <td style={tdStyle}>{inv.due_amount} SAR</td>
                    <td style={tdStyle}><button onClick={() => generatePDF(inv)} style={{ backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Download PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'portals' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>Add Recharge</h3>
              <form onSubmit={handleAddRecharge} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select name="portal" onChange={(e) => setRechargeData({...rechargeData, portal: e.target.value})} style={inputStyle}>{portals.map(p => <option key={p.id}>{p.name}</option>)}</select>
                <input name="amount" type="number" placeholder="Amount" onChange={(e) => setRechargeData({...rechargeData, amount: e.target.value})} required style={inputStyle} />
                <input name="description" placeholder="Description" onChange={(e) => setRechargeData({...rechargeData, description: e.target.value})} style={inputStyle} />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer' }}>Recharge</button>
              </form>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>Balances</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                {portals.map(p => <div key={p.id} style={{ flex: 1, padding: '15px', backgroundColor: '#f8f9fa', textAlign: 'center', borderRadius: '8px' }}><h4>{p.name}</h4><h3>{p.current_balance || 0} SAR</h3></div>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const activeStyle = { display: 'block', width: '100%', textAlign: 'left', padding: '15px 25px', backgroundColor: '#34495e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const inactiveStyle = { display: 'block', width: '100%', textAlign: 'left', padding: '15px 25px', backgroundColor: 'transparent', color: '#ecf0f1', border: 'none', cursor: 'pointer', fontSize: '16px' };
const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' };
const thStyle = { padding: '12px 15px', textAlign: 'left' };
const tdStyle = { padding: '12px 15px' };
