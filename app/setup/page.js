'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AgencySetup() {
  const router = useRouter();
  const [tenantId, setTenantId] = useState(null);
  const [form, setForm] = useState({ company_name_en: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '', invoice_footer: 'Thank you for choosing us!' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return router.push('/login');
      const { data: uData } = await supabase.from('app_users').select('tenant_id, role').eq('email', session.user.email).maybeSingle();
      if (uData) {
        if (uData.role === 'SuperAdmin') return router.push('/'); // SuperAdmin ko setup nahi karna
        setTenantId(uData.tenant_id);
      } else {
        router.push('/login');
      }
    });
  }, [router]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('logos').upload(fileName, file);
    if (error) return alert('Error uploading logo');
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
    setForm(prev => ({ ...prev, logo_url: urlData.publicUrl }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Insert settings without forcing ID
      const { error } = await supabase.from('settings').insert([{ 
        tenant_id: tenantId, 
        ...form 
      }]);
      
      if (error) throw error;
      
      alert('Agency Setup Complete! Redirecting to Dashboard...');
      router.push('/');
      router.refresh();
    } catch (err) {
      alert('Error: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1E3A8A', margin: 0, fontSize: '28px' }}>Welcome to Sueud Al Taayira ERP!</h1>
          <p style={{ color: '#555', marginTop: '10px' }}>Let's set up your agency profile. This information will appear on your invoices.</p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={styles.label}>Company Name (English)</label>
              <input required value={form.company_name_en} onChange={e => setForm({...form, company_name_en: e.target.value})} style={styles.input} placeholder="e.g. Fly High Travel" />
            </div>
            <div>
              <label style={styles.label}>Company Name (Arabic)</label>
              <input required value={form.company_name_ar} onChange={e => setForm({...form, company_name_ar: e.target.value})} style={styles.input} placeholder="مثال: طيران عالٍ للسفر" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={styles.label}>VAT Number</label>
              <input value={form.vat_no} onChange={e => setForm({...form, vat_no: e.target.value})} style={styles.input} placeholder="300000000000003" />
            </div>
            <div>
              <label style={styles.label}>CR Number</label>
              <input value={form.cr_no} onChange={e => setForm({...form, cr_no: e.target.value})} style={styles.input} placeholder="1010000000" />
            </div>
          </div>

          <div>
            <label style={styles.label}>Phone Number</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={styles.input} placeholder="+966 5X XXX XXXX" />
          </div>

          <div>
            <label style={styles.label}>Address (Arabic)</label>
            <input value={form.address_ar} onChange={e => setForm({...form, address_ar: e.target.value})} style={styles.input} placeholder="الرياض، المملكة العربية السعودية" />
          </div>

          <div>
            <label style={styles.label}>Upload Company Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ ...styles.input, padding: '10px', border: 'none' }} />
            {form.logo_url && <img src={form.logo_url} alt="Logo Preview" style={{ height: '80px', marginTop: '10px', borderRadius: '8px' }} />}
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            {loading ? 'Saving...' : 'Complete Setup & Go to Dashboard 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  label: { display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px' },
  input: { width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }
};
