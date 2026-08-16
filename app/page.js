'use client';

import useERP from '@/hooks/useERP';
import ERPLayout from '@/components/ERPLayout';
import ERPViews from '@/components/ERPViews';
import { useEffect } from 'react';

export default function Home() {
  const erp = useERP();

  const t = (key, fallback) => erp.tr?.[key] || fallback || key;

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'n') { e.preventDefault(); erp.setPage('create'); }
      if (e.altKey && e.key.toLowerCase() === 'l') { e.preventDefault(); erp.setPage('list'); }
      if (e.altKey && e.key.toLowerCase() === 'd') { e.preventDefault(); erp.setPage('dashboard'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [erp.setPage]); 

  // Loading State
  if (!erp.user || !erp.userProfile) {
    return (
      <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        height: '100vh', fontFamily: "'Poppins', sans-serif", 
        background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: '#F59E0B' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✈️</div>
          <h2>Loading ERP System...</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  const isSuperAdmin = erp.userProfile?.role === 'SuperAdmin';

  const menu = [
    { id: 'dashboard', label: t('dashboard', 'Dashboard'), show: true },
    { id: 'ai_dashboard', label: t('ai_dashboard', 'AI Dashboard'), show: true },
    { id: 'notifications', label: t('notifications', 'Notifications'), show: true },
    { id: 'superadmin', label: t('superadmin', 'SuperAdmin'), show: isSuperAdmin },
    
    // Invoices & Sales
    { id: 'create', label: t('create', 'Create Invoice'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'list', label: t('list', 'Invoices'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'refunds', label: t('refunds', 'Refunds'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'quotations', label: t('quotations', 'Quotations'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'recurring_invoices', label: t('recurring_invoices', 'Recurring Invoices'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'profitability', label: t('profitability', 'Profitability'), show: true },
    { id: 'ai_pricing', label: '🤖 AI Pricing', show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    
    // Customers & Vendors
    { id: 'customers', label: t('customers', 'Customers'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'corporates', label: t('corporates', 'Corporates'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'creditors', label: t('creditors', 'Creditors'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'credit', label: t('credit', 'Credit Balances'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'credit_limits', label: t('credit_limits', 'Credit Limits'), show: erp.userProfile.is_admin || erp.userProfile.can_access_bank },
    { id: 'customer_statement', label: t('customer_statement', 'Cust Statement'), show: erp.userProfile.is_admin || erp.userProfile.can_access_reports },
    { id: 'portals', label: t('portals', 'Portals'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'vendors', label: t('vendors', 'Vendors'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'supplier_statement', label: t('supplier_statement', 'Supplier Statement'), show: erp.userProfile.is_admin || erp.userProfile.can_access_bank },
    { id: 'packages', label: t('packages', 'Packages'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'branches', label: t('branches', 'Branches'), show: erp.userProfile.is_admin || erp.userProfile.can_access_settings },
    { id: 'multi_branch', label: t('multi_branch', 'Multi-Branch'), show: erp.userProfile.is_admin },
    
    // Contracts & Finance
    { id: 'contract', label: 'Corporate Contract', show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'offer', label: 'Corporate Offer', show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'bank', label: t('bank', 'Bank & Cash'), show: erp.userProfile.is_admin || erp.userProfile.can_access_bank },
    { id: 'invest', label: t('invest', 'Investors'), show: erp.userProfile.is_admin || erp.userProfile.can_access_bank },
    { id: 'expense_approval', label: t('expense_approval', 'Expense Approval'), show: erp.userProfile.is_admin },
    
    // HR & Reports
    { id: 'hr', label: t('hr', 'Human Resources'), show: erp.userProfile.is_admin || erp.userProfile.can_access_hr },
    { id: 'hr_advanced', label: t('hr_advanced', 'HR & Payroll'), show: erp.userProfile.is_admin || erp.userProfile.can_access_hr },
    { id: 'staff_mistakes', label: t('staff_mistakes', 'Staff Mistakes'), show: erp.userProfile.is_admin || erp.userProfile.can_access_hr },
    { id: 'statements', label: t('statements', 'Statements'), show: erp.userProfile.is_admin || erp.userProfile.can_access_reports },
    { id: 'refund_statement', label: t('refund_statement', 'Refund Statement'), show: erp.userProfile.is_admin || erp.userProfile.can_access_reports },
    { id: 'users', label: t('users', 'Users'), show: erp.userProfile.is_admin },
    { id: 'reports', label: t('reports', 'Reports'), show: erp.userProfile.is_admin || erp.userProfile.can_access_reports },
    { id: 'audit', label: t('audit', 'Audit Logs'), show: erp.userProfile.is_admin },
    
    // System
    { id: 'settings', label: t('settings', 'Settings'), show: erp.userProfile.is_admin || erp.userProfile.can_access_settings },
    { id: 'profile', label: t('profile', 'Profile'), show: true },
  ].filter(m => m.show);

  return (
    // FIX: Added dynamic direction (RTL/LTR) for complete Arabic/English language support
    <div dir={erp.lang === 'ar' ? 'rtl' : 'ltr'}>
      {erp.toast && (
        <div style={{ 
          position: 'fixed', top: '20px', right: '20px', 
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', 
          color: '#FBBF24', padding: '15px 25px', borderRadius: '12px', 
          zIndex: 9999, boxShadow: '0 5px 15px rgba(0,0,0,0.3)', 
          fontWeight: '600', fontSize: '14px',
          animation: 'slideIn 0.3s ease-out'
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
