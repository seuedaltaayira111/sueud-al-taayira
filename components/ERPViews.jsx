import React from 'react';
import ERPViewsCore from './ERPViewsCore';
import ERPViewsAdmin from './views/ERPViewsAdmin';
import ERPViewsSystem from './views/ERPViewsSystem';

export default function ERPViews(props) {
  const { page } = props;

  const isCorePage = ['dashboard', 'create', 'list', 'refunds', 'customers', 'corporates', 'creditors', 'credit'].includes(page);
  const isAdminPage = ['vendors', 'packages', 'branches', 'portals', 'bank', 'invest', 'hr'].includes(page);
  const isSystemPage = ['users', 'settings', 'reports', 'audit', 'statements', 'contract', 'offer'].includes(page);

  return (
    <>
      {isCorePage && <ERPViewsCore {...props} />}
      {isAdminPage && <ERPViewsAdmin {...props} />}
      {isSystemPage && <ERPViewsSystem {...props} />}
    </>
  );
}
