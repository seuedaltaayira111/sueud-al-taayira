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
      {/* Animated Flying Aircraft */}
      <div style={styles.aircraft}>✈️</div>

      <div style={styles.loginCard}>
        <div style={styles.logoBox}>
          <div style={styles.logoCircle}>
            {/* Logo Placeholder - Change URL to your actual logo if needed */}
            <img src="https://images.vexels.com/media/users/3leer/139/isolated/preview/45e25431de9e5d2e79345651eao78d56-plane-silhouette-flying.png" alt="Logo" style={{ width: '50px', filter: 'invert(1)' }} />
          </div>
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
  body: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F3D2E 0%, #145A38 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Poppins', sans-serif" },
  aircraft: { position: 'absolute', fontSize: '70px', animation: 'fly 12s linear infinite', top: '25%', left: '-150px', color: '#D4AF37', opacity: 0.8, zIndex: 1, filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' },
  loginCard: { background: 'rgba(255, 255, 255, 0.98)', padding: '50px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', width: '480px', textAlign: 'center', backdropFilter: 'blur(15px)', zIndex: 10, border: '1px solid rgba(212, 175, 55, 0.3)' },
  logoBox: { marginBottom: '30px' },
  logoCircle: { width: '100px', height: '100px', background: 'linear-gradient(135deg, #0F3D2E, #145A38)', color: '#D4AF37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '40px', boxShadow: '0 10px 20px rgba(15, 61, 46, 0.3)', border: '3px solid #D4AF37' },
  titleEn: { margin: 0, color: '#0F3D2E', fontSize: '26px', fontWeight: '700', letterSpacing: '1px' },
  titleAr: { margin: '5px 0 0', color: '#D4AF37', fontSize: '24px', fontWeight: '700', fontFamily: "'Tajawal', sans-serif" },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' },
  input: { width: '100%', padding: '16px', border: '1px solid #ccc', borderRadius: '12px', fontSize: '16px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.3s', background: '#f9f9f9' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(90deg, #0F3D2E 0%, #145A38 100%)', color: '#D4AF37', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', boxShadow: '0 5px 15px rgba(15, 61, 46, 0.3)', transition: 'transform 0.2s' },
  msg: { color: '#e74c3c', fontSize: '14px', marginTop: '15px', fontWeight: '500' },
  linkBtn: { background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', marginTop: '15px', textDecoration: 'underline', fontSize: '14px', fontWeight: '500' }
};
