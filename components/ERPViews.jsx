import React from 'react';
import ERPViewsCore from './ERPViewsCore';
import ERPViewsAdmin from './views/ERPViewsAdmin'; // FIX: views folder ka path add kiya
import ERPViewsSystem from './views/ERPViewsSystem'; // FIX: views folder ka path add kiya

export default function ERPViews(props) {
  const { page } = props;

  // Core Pages: Dashboard, Invoices, Customers, Corporates, Creditors, Credit Balances
  const isCorePage = ['dashboard', 'create', 'list', 'refunds', 'customers', 'corporates', 'creditors', 'credit'].includes(page);
  
  // Admin/Finance Pages: Vendors, Packages, Branches, Portals, Bank, Invest, HR
  const isAdminPage = ['vendors', 'packages', 'branches', 'portals', 'bank', 'invest', 'hr'].includes(page);
  
  // System Pages: Users, Settings, Reports, Audit, Statements
  const isSystemPage = ['users', 'settings', 'reports', 'audit', 'statements'].includes(page);

  return (
    <>
      {isCorePage && <ERPViewsCore {...props} />}
      {isAdminPage && <ERPViewsAdmin {...props} />}
      {isSystemPage && <ERPViewsSystem {...props} />}
    </>
  );
}
