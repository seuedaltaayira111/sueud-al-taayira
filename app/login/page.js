'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setMsg('Error: ' + error.message);
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
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.2), 0 0 40px rgba(37, 99, 235, 0.1); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.4), 0 0 80px rgba(37, 99, 235, 0.2); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .erp-input:focus {
          border-color: #2563EB !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
          background: #fff !important;
        }
        .erp-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(30, 58, 138, 0.4) !important;
        }
      `}</style>

      <div style={styles.aircraft}>✈️</div>
      <div style={styles.orbTop}></div>
      <div style={styles.orbBottom}></div>

      <div style={styles.loginCard}>
        <div style={styles.logoBox}>
          <div style={styles.logoContainer}>
            {/* Fixed Working Logo Link */}
            <img src="https://uat.saudia.com/etc.clientlibs/saudia/clientlibs/clientlib-air-mfe/resources/assets/images/logo.svg" alt="Company Logo" style={styles.logo} onError={(e) => e.target.style.display='none'} />
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
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={styles.input} 
              className="erp-input"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>🔒</span>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={styles.input} 
              className="erp-input"
            />
          </div>

          <button 
            type="submit" 
            style={styles.btn} 
            className="erp-btn"
            disabled={loading}
          >
            {loading ? '⏳ Please wait...' : 'Secure Login →'}
          </button>
        </form>

        {msg && <p style={{...styles.msg, color: '#ef4444'}}>{msg}</p>}
        
        <div style={styles.footerText}>
          <p>Protected by Enterprise Security</p>
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
    background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)', 
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
    color: '#FBBF24', 
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
    background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(0,0,0,0) 70%)', 
    borderRadius: '50%',
    zIndex: 0
  },
  orbBottom: {
    position: 'absolute', 
    bottom: '-15%', 
    left: '-10%', 
    width: '600px', 
    height: '600px', 
    background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(0,0,0,0) 70%)', 
    borderRadius: '50%',
    zIndex: 0
  },
  loginCard: { 
    background: 'rgba(255, 255, 255, 0.95)', 
    padding: '50px 40px', 
    borderRadius: '24px', 
    boxShadow: '0 20px 50px rgba(0,0,0,0.4)', 
    width: '450px', 
    textAlign: 'center', 
    backdropFilter: 'blur(20px)', 
    zIndex: 10, 
    border: '1px solid rgba(255, 255, 255, 0.2)',
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
    background: 'linear-gradient(135deg, #1E3A8A, #FBBF24)',
    animation: 'pulseGlow 4s infinite ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: { 
    width: '100px', 
    height: '100px', 
    objectFit: 'contain',
    borderRadius: '50%', 
    display: 'block', 
    background: 'white',
    padding: '10px'
  },
  titleEn: { 
    margin: 0, 
    color: '#0F172A', 
    fontSize: '22px', 
    fontWeight: '800', 
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  titleAr: { 
    margin: '5px 0 0', 
    color: '#D97706', 
    fontSize: '20px', 
    fontWeight: '700', 
    fontFamily: "'Tajawal', sans-serif" 
  },
  divider: {
    width: '50px',
    height: '3px',
    background: 'linear-gradient(90deg, #1E3A8A, #FBBF24)',
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
    border: '1px solid #cbd5e1', 
    borderRadius: '12px', 
    fontSize: '15px', 
    boxSizing: 'border-box', 
    outline: 'none', 
    transition: 'all 0.3s', 
    background: '#F8FAFC',
    fontWeight: '500',
    color: '#0F172A'
  },
  btn: { 
    width: '100%', 
    padding: '16px', 
    background: 'linear-gradient(90deg, #1E3A8A 0%, #2563EB 100%)', 
    color: '#FBBF24', 
    border: 'none', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: '16px', 
    marginTop: '10px', 
    boxShadow: '0 5px 15px rgba(30, 58, 138, 0.3)', 
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  msg: { 
    fontSize: '14px', 
    marginTop: '15px', 
    fontWeight: '600',
    padding: '10px',
    borderRadius: '8px',
    background: 'rgba(239, 68, 68, 0.05)'
  },
  footerText: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
    fontSize: '11px',
    color: '#94a3b8',
    lineHeight: '1.6'
  }
};
