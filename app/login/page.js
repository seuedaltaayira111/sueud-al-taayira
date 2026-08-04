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
      {/* Flying Airplane Animation */}
      <div style={styles.aircraft}>✈️</div>
      
      {/* Background Elements for Premium Look */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>

      <div style={styles.loginCard}>
        <div style={styles.logoBox}>
          {/* Company Logo Provided By User */}
          <img src="https://z-cdn-media.chatglm.cn/files/6e1b74e6-faa1-463e-854c-08f2485326b1.jpeg" alt="Company Logo" style={styles.logo} />
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
  body: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Poppins', sans-serif" },
  aircraft: { position: 'absolute', fontSize: '80px', animation: 'fly 12s linear infinite', top: '20%', left: '-200px', color: '#FBBF24', opacity: 0.9, zIndex: 1, filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' },
  loginCard: { background: 'rgba(255, 255, 255, 0.98)', padding: '50px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', width: '500px', textAlign: 'center', backdropFilter: 'blur(15px)', zIndex: 10, border: '1px solid rgba(251, 191, 36, 0.3)' },
  logoBox: { marginBottom: '30px' },
  logo: { width: '180px', height: 'auto', margin: '0 auto 20px', display: 'block', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },
  titleEn: { margin: 0, color: '#0F172A', fontSize: '24px', fontWeight: '700', letterSpacing: '1px' },
  titleAr: { margin: '5px 0 0', color: '#D97706', fontSize: '22px', fontWeight: '700', fontFamily: "'Tajawal', sans-serif" },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' },
  input: { width: '100%', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '16px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.3s', background: '#f8fafc' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(90deg, #1E3A8A 0%, #2563EB 100%)', color: '#FBBF24', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', boxShadow: '0 5px 15px rgba(30, 58, 138, 0.3)', transition: 'transform 0.2s' },
  msg: { color: '#ef4444', fontSize: '14px', marginTop: '15px', fontWeight: '500' },
  linkBtn: { background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', marginTop: '15px', textDecoration: 'underline', fontSize: '14px', fontWeight: '500' }
};
