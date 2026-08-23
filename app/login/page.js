'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'forgot'
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/` });
      setLoading(false);
      if (error) return setMsg('Error: ' + error.message);
      return setMsg('✨ Magic link sent! Check your email to reset password.');
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setMsg('⚠️ Invalid credentials. Please try again.');
    router.push('/');
  };

  return (
    <div style={styles.body}>
      <style>{`
        @keyframes fly {
          0% { transform: translateX(-200px) translateY(20px) rotate(-10deg); opacity: 0; }
          20% { opacity: 1; }
          50% { transform: translateX(50vw) translateY(-30px) rotate(5deg); }
          80% { opacity: 1; }
          100% { transform: translateX(120vw) translateY(20px) rotate(-5deg); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(15, 23, 42, 0.5); }
          50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.6), 0 0 80px rgba(15, 23, 42, 0.8); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .erp-input:focus {
          border-color: #F59E0B !important;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1) !important;
        }
      `}</style>

      {/* Flying Airplane Animation */}
      <div style={styles.aircraft}>✈️</div>
      
      {/* Background Orbs */}
      <div style={styles.orbTop}></div>
      <div style={styles.orbBottom}></div>

      <div style={styles.loginCard}>
        <div style={styles.logoBox}>
          <div style={styles.logoContainer}>
            {/* User Provided Logo */}
            <img src="https://z-cdn-media.chatglm.cn/files/9ac36e95-5359-46d9-bdfc-624cf3aac5dd.jpeg" alt="Company Logo" style={styles.logo} onError={(e) => e.target.style.display='none'} />
          </div>
          <h1 style={styles.titleEn}>SUEUD AL TAIYYARAH</h1>
          <h2 style={styles.titleAr}>صعود الطائرة للسفر و السياحة</h2>
          <div style={styles.divider}></div>
        </div>

        <form onSubmit={handleAuth} style={styles.form}>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>📧</span>
            <input 
              type="email" 
              placeholder="Enter your Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={styles.input} 
              className="erp-input"
            />
          </div>
          
          {mode === 'login' && (
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>🔒</span>
              <input 
                type="password" 
                placeholder="Enter your Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={styles.input} 
                className="erp-input"
              />
            </div>
          )}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? '⏳ Authenticating...' : (mode === 'login' ? 'Secure Login →' : 'Send Magic Link ✨')}
          </button>
        </form>

        {msg && <p style={{...styles.msg, color: msg.includes('✨') ? '#059669' : '#EF4444'}}>{msg}</p>}
        
        <button onClick={() => { setMode(mode === 'login' ? 'forgot' : 'login'); setMsg(''); }} style={styles.linkBtn}>
          {mode === 'login' ? '🔒 Forgot Password?' : '← Back to Login'}
        </button>

        <div style={styles.footerText}>
          <p>🔒 Protected by Enterprise Security</p>
          <p>© 2024 Sueud Al Taayira ERP. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  body: { 
    display: 'flex', 
    height: '100vh', 
    alignItems: 'center', 
    justifyContent: 'center', 
    background: '#0F172A', 
    position: 'relative', 
    overflow: 'hidden', 
    fontFamily: "'Poppins', sans-serif" 
  },
  aircraft: { 
    position: 'absolute', 
    fontSize: '60px', 
    animation: 'fly 15s linear infinite', 
    top: '25%', 
    left: '-200px', 
    color: '#F59E0B', 
    opacity: 0.8, 
    zIndex: 1, 
    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' 
  },
  orbTop: {
    position: 'absolute', 
    top: '-15%', 
    right: '-10%', 
    width: '500px', 
    height: '500px', 
    background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(0,0,0,0) 70%)', 
    borderRadius: '50%',
    zIndex: 0
  },
  orbBottom: {
    position: 'absolute', 
    bottom: '-15%', 
    left: '-10%', 
    width: '600px', 
    height: '600px', 
    background: 'radial-gradient(circle, rgba(30,41,59,0.5) 0%, rgba(0,0,0,0) 70%)', 
    borderRadius: '50%',
    zIndex: 0
  },
  loginCard: { 
    background: 'rgba(15, 23, 42, 0.9)', 
    padding: '50px 40px', 
    borderRadius: '24px', 
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
    width: '450px', 
    textAlign: 'center', 
    backdropFilter: 'blur(20px)', 
    zIndex: 10, 
    border: '1px solid #334155',
    animation: 'fadeInUp 0.8s ease-out forwards',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  logoBox: { 
    marginBottom: '20px' 
  },
  logoContainer: {
    width: '110px',
    height: '110px',
    margin: '0 auto 15px',
    borderRadius: '50%',
    padding: '5px',
    background: '#F59E0B',
    animation: 'pulseGlow 4s infinite ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: { 
    width: '100px', 
    height: '100px', 
    objectFit: 'cover',
    borderRadius: '50%', 
    display: 'block', 
    background: 'white'
  },
  titleEn: { 
    margin: 0, 
    color: '#F59E0B', 
    fontSize: '22px', 
    fontWeight: '800', 
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  titleAr: { 
    margin: '5px 0 0', 
    color: '#fff', 
    fontSize: '20px', 
    fontWeight: '700', 
    fontFamily: "'Tajawal', sans-serif" 
  },
  divider: {
    width: '50px',
    height: '3px',
    background: '#F59E0B',
    margin: '20px auto 0',
    borderRadius: '2px'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px', 
    marginTop: '30px' 
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '15px',
    fontSize: '18px',
    opacity: 0.7,
    pointerEvents: 'none'
  },
  input: { 
    width: '100%', 
    padding: '16px 16px 16px 45px', 
    border: '1px solid #334155', 
    borderRadius: '12px', 
    fontSize: '15px', 
    boxSizing: 'border-box', 
    outline: 'none', 
    transition: 'all 0.3s', 
    background: '#1E293B',
    fontWeight: '500',
    color: '#fff'
  },
  btn: { 
    width: '100%', 
    padding: '16px', 
    background: '#F59E0B', 
    color: '#0F172A', 
    border: 'none', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: '16px', 
    marginTop: '10px', 
    boxShadow: '0 5px 15px rgba(245, 158, 11, 0.3)', 
    transition: 'all 0.3s ease' 
  },
  msg: { 
    fontSize: '14px', 
    marginTop: '15px', 
    fontWeight: '600',
    padding: '10px',
    borderRadius: '8px'
  },
  linkBtn: { 
    background: 'none', 
    border: 'none', 
    color: '#F59E0B', 
    cursor: 'pointer', 
    marginTop: '15px', 
    textDecoration: 'underline', 
    fontSize: '14px', 
    fontWeight: '500' 
  },
  footerText: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #334155',
    fontSize: '11px',
    color: '#64748B',
    lineHeight: '1.6'
  }
};
