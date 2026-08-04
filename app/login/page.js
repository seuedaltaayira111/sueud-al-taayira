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
    <div style={styles.loginBody}>
      {/* Animated Aircraft */}
      <div style={styles.aircraft}>✈️</div>

      <div style={styles.loginCard}>
        <div style={styles.logoBox}>
          <img src="https://supabase.co/storage/v1/object/public/logos/plane-logo.png" alt="Logo" style={styles.logo} onError={(e) => e.target.style.display='none'} />
          <h1 style={styles.titleEn}>SUEUD AL TAIYYARAH</h1>
          <h2 style={styles.titleAr}>صعود الطائرة للسفر والسياحة</h2>
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
  loginBody: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F3D2E 0%, #145A38 100%)', position: 'relative', overflow: 'hidden', fontFamily: 'Segoe UI, sans-serif' },
  aircraft: { position: 'absolute', fontSize: '50px', animation: 'fly 10s linear infinite', top: '20%', left: '-10%', color: '#D4AF37', opacity: 0.8 },
  loginCard: { background: 'rgba(255, 255, 255, 0.95)', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', width: '450px', textAlign: 'center', backdropFilter: 'blur(10px)', zIndex: 10, borderTop: '6px solid #D4AF37' },
  logoBox: { marginBottom: '20px' },
  logo: { width: '80px', height: '80px', margin: '0 auto 10px', display: 'block' },
  titleEn: { margin: 0, color: '#0F3D2E', fontSize: '28px', fontWeight: 'bold', letterSpacing: '1px' },
  titleAr: { margin: '5px 0 0', color: '#D4AF37', fontSize: '22px', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' },
  input: { width: '100%', padding: '14px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '14px', background: '#0F3D2E', color: '#D4AF37', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.3s' },
  msg: { color: '#e74c3c', fontSize: '14px', marginTop: '15px' },
  linkBtn: { background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', marginTop: '15px', textDecoration: 'underline', fontSize: '14px' },
  styleTag: `@keyframes fly { 0% { transform: translateX(-100px) rotate(15deg); } 100% { transform: translateX(120vw) rotate(15deg); } }`
};

// Add this style tag to your layout or inject it if required. For Next.js, you can use <style jsx> or global CSS.
// Since it's inline, I'm providing the keyframes via a style tag injection in the component if needed, 
// But for simplicity, add this to your global.css: @keyframes fly { 0% { left: -10%; } 100% { left: 110%; } }
