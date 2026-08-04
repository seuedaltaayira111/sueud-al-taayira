'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg('');
    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/reset` });
      if (error) return setMsg('Error: ' + error.message);
      return setMsg('Password reset link sent! Check your email.');
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg('Error: ' + error.message);
    router.push('/');
  };

  return (
    <div style={styles.body}>
      {/* Flying Aircraft Animation */}
      <div style={styles.aircraft}>✈️</div>

      <div style={styles.loginCard}>
        <div style={styles.logoBox}>
          <div style={styles.logoCircle}>✈️</div>
          <h1 style={styles.titleEn}>SUEUD AL TAIYYARAH</h1>
          <h2 style={styles.titleAr}>صعود الطائرة للسفر و السياحة</h2>
        </div>

        <form onSubmit={handleAuth} style={styles.form}>
          <input type="email" placeholder="Email or Username" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
          {mode === 'login' && <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />}
          <button type="submit" style={styles.btn}>{mode === 'login' ? 'Login' : 'Send Reset Link'}</button>
        </form>

        {msg && <p style={styles.msg}>{msg}</p>}
        
        <button onClick={() => { setMode(mode === 'login' ? 'forgot' : 'login'); setMsg(''); }} style={styles.linkBtn}>
          {mode === 'login' ? 'Forgot Password?' : 'Back to Login'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  body: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F3D2E 0%, #145A38 100%)', position: 'relative', overflow: 'hidden', fontFamily: 'Segoe UI, sans-serif' },
  aircraft: { position: 'absolute', fontSize: '60px', animation: 'fly 10s linear infinite', top: '25%', left: '-150px', color: '#D4AF37', opacity: 0.8, zIndex: 1 },
  loginCard: { background: 'rgba(255, 255, 255, 0.95)', padding: '50px', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', width: '480px', textAlign: 'center', backdropFilter: 'blur(10px)', zIndex: 10, border: '2px solid rgba(212, 175, 55, 0.3)' },
  logoBox: { marginBottom: '30px' },
  logoCircle: { width: '90px', height: '90px', background: '#0F3D2E', color: '#D4AF37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '40px', boxShadow: '0 5px 15px rgba(15, 61, 46, 0.3)' },
  titleEn: { margin: 0, color: '#0F3D2E', fontSize: '26px', fontWeight: 'bold', letterSpacing: '1px' },
  titleAr: { margin: '5px 0 0', color: '#D4AF37', fontSize: '24px', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' },
  input: { width: '100%', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.3s' },
  btn: { width: '100%', padding: '15px', background: 'linear-gradient(90deg, #0F3D2E 0%, #145A38 100%)', color: '#D4AF37', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', boxShadow: '0 4px 10px rgba(15, 61, 46, 0.2)' },
  msg: { color: '#e74c3c', fontSize: '14px', marginTop: '15px' },
  linkBtn: { background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', marginTop: '15px', textDecoration: 'underline', fontSize: '14px' }
};
