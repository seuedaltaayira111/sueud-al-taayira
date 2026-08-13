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

  const isCorePage = ['dashboard', 'create', 'list', 'refunds', 'customers', 'corporates', 'creditors', 'credit'].includes(page);
  const isAdminPage = ['vendors', 'packages', 'branches', 'portals', 'bank', 'invest', 'hr'].includes(page);
  const isSystemPage = ['users', 'settings', 'reports', 'audit', 'statements', 'contract', 'offer', 'superadmin', 'profile', 'profitability'].includes(page);
  const isAdvancedPage = ['quotations', 'ai_dashboard', 'hr_advanced'].includes(page);
  const isEnterprisePage = ['credit_limits', 'supplier_statement', 'multi_branch'].includes(page);
  const isProPage = ['customer_statement', 'recurring_invoices', 'expense_approval', 'notifications'].includes(page);

  return (
    <>
      {isCorePage && <ERPViewsCore {...props} />}
      {isAdminPage && <ERPViewsAdmin {...props} />}
      {isSystemPage && <ERPViewsSystem {...props} />}
      {isAdvancedPage && <ERPViewsAdvanced {...props} />}
      {isEnterprisePage && <ERPViewsEnterprise {...props} />}
      {isProPage && <ERPViewsPro {...props} />}
    </>
  );
}
