'use client';

import useERP from '@/hooks/useERP';
import ERPLayout from '@/components/ERPLayout';
import ERPViews from '@/components/ERPViews';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const erp = useERP();
  const [isOnline, setIsOnline] = useState(true);
  const forceOpen = useRef(false);
  const t = (key, fallback) => erp.tr?.[key] || fallback || key;

  // ===== DARK MODE =====
  useEffect(() => {
    if (erp.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.background = '#0F172A';
      document.body.style.color = '#F8FAFC';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.style.background = '#F8FAFC';
      document.body.style.color = '#1E293B';
    }
  }, [erp.theme]);

  // ===== SAFETY TIMEOUT =====
  useEffect(() => {
    const timer = setTimeout(() => {
      forceOpen.current = true;
      console.warn('[ERP] Safety timeout — forcing open');
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'n') { e.preventDefault(); erp.setPage?.('create'); }
      if (e.altKey && e.key.toLowerCase() === 'l') { e.preventDefault(); erp.setPage?.('list'); }
      if (e.altKey && e.key.toLowerCase() === 'd') { e.preventDefault(); erp.setPage?.('dashboard'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [erp.setPage]);

  // ===== ONLINE STATUS =====
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine) erp.showToast?.('⚠️ You are offline.');
      else erp.showToast?.('✅ Back online!');
    };
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [erp.showToast]);

  // ===== ERROR SCREEN =====
  if (erp.initError) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: "'Poppins', sans-serif",
        background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        color: '#fff',
        padding: '40px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#EF4444', marginBottom: '15px' }}>Initialization Error</h2>
          <p style={{
            color: '#CBD5E1',
            fontSize: '14px',
            lineHeight: '1.8',
            background: 'rgba(255,255,255,0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #334155',
            wordBreak: 'break-word'
          }}>
            {erp.initError}
          </p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                padding: '12px 30px',
                background: '#F59E0B',
                color: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px'
              }}
            >
              Go to Login →
            </button>
            <button
              onClick={() => { forceOpen.current = true; window.location.reload(); }}
              style={{
                padding: '12px 30px',
                background: '#2563EB',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px'
              }}
            >
              ⚡ Force Open
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== LOADING =====
  const isLoading = !forceOpen.current && !erp.user && !erp.userProfile;
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: "'Poppins', sans-serif",
        background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        color: '#F59E0B'
      }}>
        <div style={{ textAlign: 'center' }}>
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
          `}</style>
          <div style={{ fontSize: '60px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>✈️</div>
          <h2 style={{ color: '#FBBF24' }}>Loading SUEUD AL TAAYIRA ERP...</h2>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '10px', animation: 'pulse 1.5s ease-in-out infinite' }}>
            Preparing your travel agency workspace
          </p>
          <button
            onClick={() => { forceOpen.current = true; window.location.reload(); }}
            style={{
              marginTop: '25px',
              padding: '10px 24px',
              background: 'rgba(255,255,255,0.1)',
              color: '#94A3B8',
              border: '1px solid #334155',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Skip Loading ⚡
          </button>
        </div>
      </div>
    );
  }

  // ===== PERMISSIONS =====
  const profile = erp.userProfile || {};
  const isSuperAdmin = profile.role === 'SuperAdmin';
  const isAdmin = profile.is_admin || false;
  const canAccessHR = isAdmin || profile.can_access_hr || false;
  const canAccessBank = isAdmin || profile.can_access_bank || false;
  const canAccessInvoices = isAdmin || profile.can_access_invoices || true;
  const canAccessReports = isAdmin || profile.can_access_reports || false;
  const canAccessSettings = isAdmin || profile.can_access_settings || false;

  // ===== MENU – All features intact, unwanted removed =====
  const menu = [
    // Main
    { id: 'dashboard', label: t('dashboard', '📊 Dashboard'), show: true, section: 'Main' },
    { id: 'ai_dashboard', label: t('ai_dashboard', '🤖 AI Dashboard'), show: true, section: 'Main' },
    { id: 'my_attendance', label: '⏰ My Attendance', show: true, section: 'Main' },
    { id: 'notifications', label: t('notifications', '🔔 Notifications'), show: true, section: 'Main' },

    // Travel Sales Core
    { id: 'create', label: t('create', '✈️ Create Invoice'), show: canAccessInvoices, section: 'Travel Sales' },
    { id: 'list', label: t('list', '📋 Invoices'), show: canAccessInvoices, section: 'Travel Sales' },
    { id: 'refunds', label: t('refunds', '🔄 Refunds'), show: canAccessInvoices, section: 'Travel Sales' },
    { id: 'quotations', label: t('quotations', '📄 Quotations'), show: canAccessInvoices, section: 'Travel Sales' },
    
    // Flight Operations – only these (removed Hotel, Visa, Insurance, Hajj/Umrah)
    { id: 'flight_status', label: '🛫 Flight Status', show: canAccessInvoices, section: 'Flight Operations' },
    { id: 'corporate_travel', label: '🏢 Corporate Travel', show: canAccessInvoices, section: 'Flight Operations' },
    { id: 'frequent_flyer', label: '🌟 Frequent Flyer', show: canAccessInvoices, section: 'Flight Operations' },

    // Packages & Tours
    { id: 'packages', label: t('packages', '📦 Tour Packages'), show: canAccessInvoices, section: 'Packages & Tours' },

    // CRM
    { id: 'customers', label: t('customers', '👤 Customers'), show: canAccessInvoices, section: 'CRM' },
    { id: 'corporates', label: t('corporates', '🏢 Corporates'), show: canAccessInvoices, section: 'CRM' },
    { id: 'creditors', label: t('creditors', '💳 Creditors'), show: canAccessInvoices, section: 'CRM' },
    { id: 'credit', label: t('credit', '💰 Credit Balances'), show: canAccessInvoices, section: 'CRM' },
    { id: 'portals', label: t('portals', '🛫 GDS/Portals'), show: canAccessInvoices, section: 'CRM' },
    { id: 'vendors', label: t('vendors', '🚚 Vendors'), show: canAccessInvoices, section: 'CRM' },

    // Finance
    { id: 'bank', label: t('bank', '🏦 Bank & Cash'), show: canAccessBank, section: 'Finance' },
    { id: 'invest', label: t('invest', '📈 Investors'), show: canAccessBank, section: 'Finance' },
    { id: 'expenses', label: t('expenses', '💸 Expenses'), show: canAccessBank, section: 'Finance' },
    { id: 'profitability', label: t('profitability', '📊 Profitability'), show: true, section: 'Finance' },
    { id: 'refund_statement', label: t('refund_statement', '📑 Refund Statement'), show: canAccessReports, section: 'Finance' },

    // HR
    { id: 'hr', label: t('hr', '👨‍💼 HR Directory'), show: canAccessHR, section: 'Human Resources' },
    { id: 'hr_advanced', label: t('hr_advanced', '👨‍💼 HR & Payroll'), show: canAccessHR, section: 'Human Resources' },
    { id: 'staff_mistakes', label: t('staff_mistakes', '⚠️ Staff Mistakes'), show: canAccessHR, section: 'Human Resources' },

    // Contracts
    { id: 'contract', label: '📝 Corporate Contract', show: canAccessInvoices, section: 'Contracts' },
    { id: 'offer', label: '🎁 Corporate Offer', show: canAccessInvoices, section: 'Contracts' },

    // Reports & Admin
    { id: 'reports', label: t('reports', '📊 Reports'), show: canAccessReports, section: 'Reports & Admin' },
    { id: 'statements', label: t('statements', '📑 Statements'), show: canAccessReports, section: 'Reports & Admin' },
    { id: 'audit', label: t('audit', '📜 Audit Logs'), show: isAdmin, section: 'Reports & Admin' },
    { id: 'superadmin', label: t('superadmin', '👑 SuperAdmin'), show: isSuperAdmin, section: 'Reports & Admin' },
    { id: 'users', label: t('users', '👥 Users'), show: isAdmin, section: 'Reports & Admin' },
    { id: 'settings', label: t('settings', '⚙️ Settings'), show: canAccessSettings, section: 'Reports & Admin' },
    { id: 'profile', label: t('profile', '👤 Profile'), show: true, section: 'Reports & Admin' },
  ].filter(m => m.show);

  return (
    <div dir={erp.lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* OFFLINE BANNER */}
      {!isOnline && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: '#EF4444',
          color: 'white',
          textAlign: 'center',
          padding: '10px',
          zIndex: 10000,
          fontWeight: 'bold'
        }}>
          ⚠️ You are offline. Please check your internet connection.
        </div>
      )}

      {/* PROFILE WARNING */}
      {!erp.userProfile && (
        <div style={{
          position: 'fixed',
          top: isOnline ? 0 : 40,
          left: 0,
          right: 0,
          background: '#F59E0B',
          color: '#0F172A',
          textAlign: 'center',
          padding: '8px',
          zIndex: 9999,
          fontWeight: '600',
          fontSize: '13px'
        }}>
          ⚠️ User profile not loaded — some features may be restricted.
          <span
            onClick={() => window.location.reload()}
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
              marginLeft: '10px',
              fontWeight: '700'
            }}
          >
            Retry
          </span>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {erp.toast && (
        <div style={{
          position: 'fixed',
          top: isOnline ? 0 : 40,
          right: '20px',
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
          color: '#FBBF24',
          padding: '15px 25px',
          borderRadius: '12px',
          zIndex: 10001,
          boxShadow: '0 5px 25px rgba(0,0,0,0.4)',
          fontWeight: '600',
          fontSize: '14px',
          animation: 'slideIn 0.5s ease-out'
        }}>
          {erp.toast}
        </div>
      )}

      <ERPLayout {...erp} menu={menu}>
        <ERPViews {...erp} />
      </ERPLayout>
    </div>
  );
}
