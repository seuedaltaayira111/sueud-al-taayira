'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function PublicInvoicePage({ params }) {
  const { invNo } = params;
  const [inv, setInv] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInv = async () => {
      const { data } = await supabase.from('invoices').select(`*, customers(name, phone), corporates(name, vat_no, phone), employees(name, phone)`).eq('invoice_no', invNo).single();
      if (data) {
        setInv(data);
        const { data: sData } = await supabase.from('settings').select('*').eq('tenant_id', data.tenant_id).maybeSingle();
        if (sData) setSettings(sData);
      }
    };
    fetchInv();
  }, [invNo]);

  const handleDownload = async () => {
    setLoading(true);
    const div = document.getElementById('printable-invoice');
    if (!div) { setLoading(false); return; }
    
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
    pdf.save(`${invNo}.pdf`);
    setLoading(false);
  };

  if (!inv || !settings) return <div style={{ padding: 50, textAlign: 'center', fontFamily: 'sans-serif' }}>Loading Invoice...</div>;

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <button onClick={handleDownload} disabled={loading} style={{ padding: '15px 30px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', fontSize: '16px' }}>
        {loading ? '⏳ Generating PDF...' : '📄 Download PDF'}
      </button>
      
      {/* Live Preview of Invoice (Ye screen par dikhega aur PDF me bhi yahi aayega) */}
      <div id="printable-invoice" style={{ width: '794px', background: 'white', padding: '40px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', borderBottom:'3px solid #1E3A8A', paddingBottom:'20px', marginBottom:'30px' }}>
          <div>
            {settings.logo_url && <img src={settings.logo_url} crossorigin="anonymous" style={{ height: '80px', marginBottom: '10px' }} />}
            <h1 style={{ margin:0, color:'#1E3A8A' }}>{settings.company_name_en}</h1>
            <h2 style={{ margin:'5px 0', color:'#555' }}>{settings.company_name_ar}</h2>
            <p style={{ fontSize:'12px', color:'#555' }}>{settings.address_ar}<br/>VAT: {settings.vat_no} | CR: {settings.cr_no}<br/>License: {settings.license_no}</p>
          </div>
          <div style={{ textAlign:'right' }}>
            <h2>TAX INVOICE</h2>
            <p>Inv No: <b>{inv.invoice_no}</b><br/>Date: {inv.invoice_date}<br/>Payment: {inv.payment_method}</p>
          </div>
        </div>
        <div style={{ marginBottom:'20px', display:'flex', justifyContent:'space-between' }}>
          <div>
            <p><b>Customer:</b> {inv.customers?.name || inv.corporates?.name}</p>
            <p><b>Phone:</b> {inv.customers?.phone || inv.corporates?.phone}</p>
          </div>
          <div style={{ textAlign:'right' }}>
            <p><b>Sales Person:</b> {inv.employees?.name || 'N/A'}</p>
            <p><b>PNR:</b> {inv.pnr || 'N/A'} | <b>Ticket:</b> {inv.ticket_no || 'N/A'}</p>
          </div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:'20px' }}>
          <thead>
            <tr style={{ background:'#1E3A8A', color:'white' }}>
              <th style={{ padding:'10px', textAlign:'left' }}>Description</th>
              <th style={{ padding:'10px' }}>Qty</th>
              <th style={{ padding:'10px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding:'10px', borderBottom:'1px solid #ccc' }}>{inv.sector || inv.service_type}</td>
              <td style={{ padding:'10px', textAlign:'center', borderBottom:'1px solid #ccc' }}>{inv.qty}</td>
              <td style={{ padding:'10px', textAlign:'center', borderBottom:'1px solid #ccc' }}>{(inv.total_sell || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign:'right' }}>
          <p>Total Before VAT: <b>{(inv.total_sell || 0).toFixed(2)} SAR</b></p>
          <p>VAT: <b>{(inv.vat || 0).toFixed(2)} SAR</b></p>
          <h2 style={{ color:'#1E3A8A' }}>Grand Total: {(inv.total || 0).toFixed(2)} SAR</h2>
          <p>Paid: <b style={{ color:'green' }}>{(inv.paid_amount || 0).toFixed(2)} SAR</b> | Due: <b style={{ color:'red' }}>{(inv.due_amount || 0).toFixed(2)} SAR</b></p>
        </div>
      </div>
    </div>
  );
}
