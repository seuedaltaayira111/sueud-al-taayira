'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // login | forgot
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg('');
    
    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) return setMsg('Error: ' + error.message);
      return setMsg('Password reset link sent to your email! Check your inbox.');
    }

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMsg('Error: ' + error.message);
      router.push('/');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F5F7F2' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '400px', borderTop: '4px solid #D4AF37' }}>
        <h2 style={{ textAlign: 'center', color: '#0F3D2E', marginBottom: '20px' }}>
          {mode === 'login' ? 'ERP Login' : 'Reset Password'}
        </h2>
        
        <form onSubmit={handleAuth}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          {mode === 'login' && (
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          )}
          
          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', background: '#0F3D2E', color: '#D4AF37', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            {mode === 'login' ? 'Login' : 'Send Reset Link'}
          </button>
        </form>

        {msg && <p style={{ textAlign: 'center', color: '#e74c3c', marginTop: '15px', fontSize: '14px' }}>{msg}</p>}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {mode === 'login' ? (
            <button onClick={() => { setMode('forgot'); setMsg(''); }} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', textDecoration: 'underline' }}>
              Forgot Password?
            </button>
          ) : (
            <button onClick={() => { setMode('login'); setMsg(''); }} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', textDecoration: 'underline' }}>
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
