'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push('/');
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#f0f4f8' }}>
      {/* Left Side - Aviation Branding */}
      <div style={{ flex: 1.2, background: 'linear-gradient(135deg, #003366 0%, #0055a4 100%)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>✈️</div>
        <h1 style={{ fontSize: '36px', margin: 0, textAlign: 'center' }}>Sueud Al Taayira</h1>
        <h2 style={{ fontSize: '24px', marginTop: '10px', opacity: 0.9 }}>صعود الطائرة للسفر السياحة</h2>
        <p style={{ marginTop: '20px', opacity: 0.7, textAlign: 'center' }}>Complete Enterprise Travel & Tourism ERP System</p>
      </div>
      
      {/* Right Side - Login Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '350px', padding: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#003366', marginBottom: '20px' }}>Sign In to ERP</h3>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email (e.g. atallah@sueud.com)" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
            <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Verifying...' : 'LOGIN'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  input: { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }
};
