'use client';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Subscription() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', maxWidth: '500px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', color: '#fbbf24', margin: '0 0 15px 0' }}>Subscription Expired</h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '30px' }}>
          Your agency's monthly subscription has expired or is currently inactive. Please contact the SuperAdmin to renew your access.
        </p>
        <button onClick={handleLogout} style={{ padding: '12px 30px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
