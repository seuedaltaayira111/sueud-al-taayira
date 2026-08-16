'use client';

import React from 'react';
import ERPViewsCore from './ERPViewsCore';
import ERPViewsAdmin from './views/ERPViewsAdmin';
import ERPViewsSystem from './views/ERPViewsSystem';
import ERPViewsAdvanced from './views/ERPViewsAdvanced';
import ERPViewsEnterprise from './views/ERPViewsEnterprise';
import ERPViewsPro from './views/ERPViewsPro';

export default function ERPViews(props) {
  const { page } = props;

  // Page routing arrays
  const isCorePage = ['dashboard', 'create', 'list', 'refunds', 'customers', 'corporates', 'creditors', 'credit', 'ai_pricing'].includes(page);
  const isAdminPage = ['vendors', 'packages', 'branches', 'portals', 'bank', 'invest', 'hr'].includes(page);
  const isSystemPage = ['users', 'settings', 'reports', 'audit', 'statements', 'contract', 'offer', 'superadmin', 'profile', 'profitability'].includes(page);
  const isAdvancedPage = ['quotations', 'ai_dashboard', 'hr_advanced'].includes(page);
  const isEnterprisePage = ['credit_limits', 'supplier_statement', 'multi_branch'].includes(page);
  const isProPage = ['customer_statement', 'recurring_invoices', 'expense_approval', 'notifications', 'staff_mistakes', 'refund_statement'].includes(page);

  const hasMatch = isCorePage || isAdminPage || isSystemPage || isAdvancedPage || isEnterprisePage || isProPage;

  return (
    <>
      {isCorePage && <ERPViewsCore {...props} />}
      {isAdminPage && <ERPViewsAdmin {...props} />}
      {isSystemPage && <ERPViewsSystem {...props} />}
      {isAdvancedPage && <ERPViewsAdvanced {...props} />}
      {isEnterprisePage && <ERPViewsEnterprise {...props} />}
      {isProPage && <ERPViewsPro {...props} />}
      
      {/* Fallback UI */}
      {!hasMatch && (
        <div style={{ padding: '50px', textAlign: 'center', color: '#94A3B8', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>404 - Page Not Found</h2>
          <p>The page "<strong>{page}</strong>" is either under construction or does not exist.</p>
        </div>
      )}
    </>
  );
}
