'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const router = useRouter();

  const isAr = lang === 'ar';

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`
      });
      setLoading(false);
      if (error) return setMsg(isAr ? 'خطأ: ' + error.message : 'Error: ' + error.message);
      return setMsg(isAr ? '✨ تم إرسال رابط السحر! تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور.' : '✨ Magic link sent! Check your email to reset password.');
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setMsg(isAr ? '⚠️ بيانات الاعتماد غير صالحة. يرجى المحاولة مرة أخرى.' : '⚠️ Invalid credentials. Please try again.');
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
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .login-input:focus {
          border-color: #F59E0B !important;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15) !important;
        }
      `}</style>

      {/* Flying Airplanes */}
      <div style={{ ...styles.aircraft, top: '15%', animationDelay: '0s' }}>✈️</div>
      <div style={{ ...styles.aircraft, top: '55%', animationDelay: '-5s', fontSize: '40px' }}>🛫</div>
      <div style={{ ...styles.aircraft, top: '80%', animationDelay: '-10s', fontSize: '35px' }}>🛬</div>

      {/* Background Orbs */}
      <div style={styles.orbTop}></div>
      <div style={styles.orbBottom}></div>

      <div style={styles.loginCard}>
        {/* Language Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            style={{
              padding: '6px 14px',
              background: 'rgba(245, 158, 11, 0.1)',
              color: '#FBBF24',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {isAr ? 'English' : 'العربية'}
          </button>
        </div>

        <div style={styles.logoBox}>
          <div style={styles.logoContainer}>
            <div style={styles.logoMark}>✈️</div>
          </div>
          <h1 style={styles.titleEn}>SUEUD AL TAAYIRA</h1>
          <h2 style={styles.titleAr}>{isAr ? 'صعود الطائرة للسفر و السياحة' : 'Travel & Tourism Agency'}</h2>
          <div style={styles.divider}></div>
        </div>

        <form onSubmit={handleAuth} style={styles.form}>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>📧</span>
            <input
              type="email"
              placeholder={isAr ? 'البريد الإلكتروني / Email' : 'Email / البريد الإلكتروني'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              className="login-input"
            />
          </div>

          {mode === 'login' && (
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type="password"
                placeholder={isAr ? 'كلمة المرور / Password' : 'Password / كلمة المرور'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                className="login-input"
              />
            </div>
          )}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading
              ? (isAr ? '⏳ جارِ تسجيل الدخول...' : '⏳ Authenticating...')
              : (mode === 'login'
                ? (isAr ? '🚀 دخول آمن ←' : '🚀 Secure Login →')
                : (isAr ? '✨ إرسال رابط السحر' : '✨ Send Magic Link'))}
          </button>
        </form>

        {msg && (
          <p style={{
            ...styles.msg,
            color: msg.includes('✨') || msg.includes('✅') ? '#34D399' : '#F87171'
          }}>
            {msg}
          </p>
        )}

        <button
          onClick={() => { setMode(mode === 'login' ? 'forgot' : 'login'); setMsg(''); }}
          style={styles.linkBtn}
        >
          {mode === 'login'
            ? (isAr ? '🔒 نسيت كلمة المرور؟' : '🔒 Forgot Password?')
            : (isAr ? '← رجوع لتسجيل الدخول' : '← Back to Login')}
        </button>

        <div style={styles.footerText}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            🔒 {isAr ? 'محمي بأمان مؤسسي' : 'Protected by Enterprise Security'}
          </p>
          <p>© {new Date().getFullYear()} Sueud Al Taayira ERP. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
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
    fontFamily: "'Inter', 'Poppins', sans-serif"
  },
  aircraft: {
    position: 'absolute',
    fontSize: '50px',
    animation: 'fly 15s linear infinite',
    left: '-200px',
    color: '#F59E0B',
    opacity: 0.6,
    zIndex: 1,
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
  },
  orbTop: {
    position: 'absolute',
    top: '-15%',
    right: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(0,0,0,0) 70%)',
    borderRadius: '50%',
    zIndex: 0
  },
  orbBottom: {
    position: 'absolute',
    bottom: '-15%',
    left: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(30,58,138,0.2) 0%, rgba(0,0,0,0) 70%)',
    borderRadius: '50%',
    zIndex: 0
  },
  loginCard: {
    background: 'rgba(15, 23, 42, 0.92)',
    padding: '50px 40px',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    width: '440px',
    textAlign: 'center',
    backdropFilter: 'blur(20px)',
    zIndex: 10,
    border: '1px solid #334155',
    animation: 'fadeInUp 0.6s ease-out forwards',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  logoBox: {
    marginBottom: '24px'
  },
  logoContainer: {
    width: '100px',
    height: '100px',
    margin: '0 auto 15px',
    borderRadius: '50%',
    padding: '5px',
    background: '#F59E0B',
    animation: 'pulseGlow 4s infinite ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoMark: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '42px',
    boxShadow: '0 8px 24px rgba(245,158,11,0.4)',
    border: '3px solid rgba(255,255,255,0.15)'
  },
  titleEn: {
    margin: 0,
    color: '#FBBF24',
    fontSize: '20px',
    fontWeight: 800,
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  titleAr: {
    margin: '4px 0 0',
    color: '#E2E8F0',
    fontSize: '18px',
    fontWeight: 700,
    fontFamily: "'Cairo', 'Tajawal', sans-serif"
  },
  divider: {
    width: '50px',
    height: '3px',
    background: 'linear-gradient(90deg, #F59E0B, #D97706)',
    margin: '16px auto 0',
    borderRadius: '2px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '28px'
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '18px',
    opacity: 0.6,
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 48px',
    border: '1px solid #334155',
    borderRadius: '12px',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.3s',
    background: '#1E293B',
    fontWeight: 500,
    color: '#F8FAFC'
  },
  btn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
    color: '#0F172A',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '16px',
    marginTop: '8px',
    boxShadow: '0 5px 20px rgba(245, 158, 11, 0.3)',
    transition: 'all 0.3s ease'
  },
  msg: {
    fontSize: '14px',
    marginTop: '16px',
    fontWeight: 600,
    padding: '10px 14px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)'
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#60A5FA',
    cursor: 'pointer',
    marginTop: '14px',
    textDecoration: 'underline',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'color 0.2s'
  },
  footerText: {
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid #334155',
    fontSize: '11px',
    color: '#64748B',
    lineHeight: '1.8'
  }
};
