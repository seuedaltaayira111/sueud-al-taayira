'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push('/');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Georgia, serif', backgroundColor: '#0F3D2E' }}>
      <div style={{ flex: 1.2, background: 'linear-gradient(135deg, #0F3D2E 0%, #145A38 100%)', color: '#D4AF37', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', borderRight: '5px solid #D4AF37' }}>
        <div style={{ fontSize: '100px', marginBottom: '20px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}>✈️</div>
        <h1 style={{ fontSize: '48px', margin: 0, textAlign: 'center', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Sueud Al Taayira</h1>
        <h2 style={{ fontSize: '32px', marginTop: '10px', color: '#FFF', fontWeight: 'normal' }}>صعود الطائرة للسفر والسياحة</h2>
        <div style={{ width: '100px', height: '4px', backgroundColor: '#D4AF37', margin: '30px 0' }}></div>
        <p style={{ fontSize: '18px', opacity: 0.9, textAlign: 'center', color: '#E0E0E0' }}>Premium Travel & Tourism ERP System</p>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7F2' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', borderTop: '6px solid #D4AF37' }}>
          <h3 style={{ color: '#0F3D2E', marginBottom: '30px', fontSize: '24px', textAlign: 'center' }}>Sign In to Dashboard</h3>
          <form onSubmit={handleLogin}>
            <label style={{ color: '#0F3D2E', fontWeight: 'bold', fontSize: '14px' }}>User ID (Email)</label>
            <input type="email" placeholder="atallah@sueud.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '15px', marginBottom: '20px', border: '2px solid #E0E0E0', borderRadius: '8px', boxSizing: 'border-box', fontSize: '16px' }} />
            
            <label style={{ color: '#0F3D2E', fontWeight: 'bold', fontSize: '14px' }}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '15px', marginBottom: '30px', border: '2px solid #E0E0E0', borderRadius: '8px', boxSizing: 'border-box', fontSize: '16px' }} />
            
            <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#D4AF37', color: '#0F3D2E', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>LOGIN</button>
          </form>
        </div>
      </div>
    </div>
  );
}
