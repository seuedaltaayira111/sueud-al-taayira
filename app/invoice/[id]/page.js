'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PublicInvoicePage({ params }) {
  const { id } = params;
  const [inv, setInv] = useState(null);
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInv = async () => {
      try {
        const { data: invData, error: invErr } = await supabase
          .from('invoices')
          .select(`*, customers(name, phone), corporates(name), employees(name)`)
          .eq('invoice_no', id)
          .single();
          
        if (invErr || !invData) {
          setLoading(false);
          return;
        }
        
        setInv(invData);
        
        const { data: setData } = await supabase.from('settings').select('*').eq('tenant_id', invData.tenant_id).maybeSingle();
        setSetting(setData || {});
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchInv();
  }, [id]);

  if (loading) return <div style={{ padding: 50, textAlign: 'center', fontFamily: 'sans-serif' }}>Loading Invoice...</div>;
  if (!inv) return <div style={{ padding: 50, textAlign: 'center', fontFamily: 'sans-serif', color: 'red' }}>Invoice not found or has been deleted.</div>;

  const isAr = false; // Default to English for public, or detect from browser
  const trackUrl = `https://sueud-al-taayira.vercel.app/invoice/${id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(trackUrl)}`;
  const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(trackUrl)}&code=Code128&translate-esc=on`;

  return (
    <div style={{ background: '#e2e8f0', padding: '20px', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ maxWidth: '850px', margin: 'auto', background: '#ffffff', borderRadius: '16px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <div style={{ background: '#064e3b', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '5px solid #10b981' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#10b981', fontWeight: 800 }}>{setting.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
            <h1 style={{ margin: '3px 0 0', fontSize: '16px', color: '#f1f5f9', textTransform: 'uppercase' }}>{setting.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
            <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#94a3b8' }}>{setting.address_ar || 'Riyadh'} | {setting.phone || ''}</p>
          </div>
          <div style={{ textAlign: 'right', background: '#10b981', padding: '15px 25px', borderRadius: '10px', color: '#064e3b' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>Tax Invoice</h3>
            <p style={{ margin: '3px 0', fontSize: '13px' }}>No: <span style={{ color: '#fff' }}>{inv.invoice_no}</span></p>
            <p style={{ margin: '3px 0', fontSize: '13px' }}>Date: <span style={{ color: '#fff' }}>{inv.invoice_date}</span></p>
            <p style={{ margin: '3px 0', fontSize: '13px' }}>Status: <span style={{ color: '#fff' }}>{inv.due_amount > 0 ? 'Unpaid' : 'Paid'}</span></p>
          </div>
        </div>
        
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #064e3b' }}>
              <h4 style={{ margin: '0 0 15px', color: '#064e3b' }}>Customer Info</h4>
              <p style={{ margin: '8px 0' }}><strong>Name:</strong> {inv.customers?.name || inv.corporates?.name || 'N/A'}</p>
              <p style={{ margin: '8px 0' }}><strong>Phone:</strong> {inv.customers?.phone || 'N/A'}</p>
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #064e3b' }}>
              <h4 style={{ margin: '0 0 15px', color: '#064e3b' }}>Booking Details</h4>
              <p style={{ margin: '8px 0' }}><strong>Service:</strong> {inv.service_type}</p>
              <p style={{ margin: '8px 0' }}><strong>Airline:</strong> {inv.airline || 'N/A'}</p>
              <p style={{ margin: '8px 0' }}><strong>Ticket No:</strong> {inv.ticket_no || 'N/A'}</p>
              <p style={{ margin: '8px 0' }}><strong>PNR:</strong> {inv.pnr || 'N/A'}</p>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead><tr style={{ background: '#064e3b', color: '#10b981' }}><th style={{ padding: '15px', textAlign: 'left' }}>Description</th><th style={{ padding: '15px', textAlign: 'center' }}>Qty</th><th style={{ padding: '15px', textAlign: 'right' }}>Total</th></tr></thead>
            <tbody><tr><td style={{ padding: '15px', borderBottom: '1px solid #f1f5f9' }}>{inv.sector || inv.service_type}</td><td style={{ padding: '15px', textAlign: 'center' }}>{inv.qty}</td><td style={{ padding: '15px', textAlign: 'right' }}>{(inv.total_sell || 0).toFixed(2)}</td></tr></tbody>
          </table>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}><span>Total Before Tax</span> <strong>{(inv.total_sell || 0).toFixed(2)} SAR</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}><span>VAT (15%)</span> <strong>{(inv.vat || 0).toFixed(2)} SAR</strong></div>
              <div style={{ background: '#064e3b', color: '#10b981', padding: '15px', borderRadius: '8px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>Grand Total</span> <span>{(inv.total || 0).toFixed(2)} SAR</span></div>
            </div>
          </div>
        </div>
        
        <div style={{ background: '#f8fafc', padding: '20px 30px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}><img src={barcodeUrl} alt="Barcode" style={{ height: '60px' }} /></div>
          <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}><strong>Thank you for choosing us!</strong></div>
          <div style={{ textAlign: 'center' }}><img src={qrCodeUrl} alt="QR Code" style={{ height: '60px' }} /></div>
        </div>
      </div>
    </div>
  );
}
