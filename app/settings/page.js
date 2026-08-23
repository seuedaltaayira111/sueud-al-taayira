'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Settings() {
  const [settings, setSettings] = useState({});
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
    });
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (data) setSettings(data);
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await supabase.from('settings').update(settings).eq('id', 1);
    alert('Settings Saved Successfully!');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ borderBottom: '2px solid #000', paddingBottom: '10px' }}>Company Settings (إعدادات الشركة)</h2>
      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <input name="company_name_en" placeholder="Company Name (EN)" value={settings.company_name_en || ''} onChange={handleChange} style={inputStyle} />
        <input name="company_name_ar" placeholder="Company Name (AR)" value={settings.company_name_ar || ''} onChange={handleChange} style={inputStyle} />
        <input name="vat_no" placeholder="VAT Number" value={settings.vat_no || ''} onChange={handleChange} style={inputStyle} />
        <input name="cr_no" placeholder="CR Number" value={settings.cr_no || ''} onChange={handleChange} style={inputStyle} />
        <input name="iata_no" placeholder="IATA Number" value={settings.iata_no || ''} onChange={handleChange} style={inputStyle} />
        <input name="tourist_no" placeholder="Tourist Number" value={settings.tourist_no || ''} onChange={handleChange} style={inputStyle} />
        <input name="phone" placeholder="Phone" value={settings.phone || ''} onChange={handleChange} style={inputStyle} />
        <input name="address_en" placeholder="Address (EN)" value={settings.address_en || ''} onChange={handleChange} style={inputStyle} />
        <button type="submit" style={{ gridColumn: 'span 2', padding: '15px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px' }}>SAVE SETTINGS</button>
      </form>
    </div>
  );
}

const inputStyle = { padding: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' };
