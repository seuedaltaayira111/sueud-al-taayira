'use client';

/**
 * Master view router.
 *
 * IMPORTANT CONTEXT FOR FUTURE DEVELOPERS:
 * This app previously had 7+ "view" files (components/views/ERPViews*.jsx)
 * that implemented real pages (HR advanced, AI dashboard, quotations, refund
 * statement, profitability, settings, superadmin, credit limits, multi-branch,
 * AI pricing, etc.) but NONE of them were ever imported anywhere — only the
 * original ERPViews.jsx (now renamed to ERPViewsSales.jsx) was rendered by
 * app/page.js. That meant ~20 of the ~34 sidebar menu items rendered
 * "Page Under Development" no matter what was built in those files.
 *
 * This file fixes that by routing every `page` id to whichever component
 * actually implements it. Where a page was implemented in more than one
 * file, the more complete/correct implementation was kept (noted inline).
 */

import ERPViewsMisc from './views/ERPViewsMisc';
import ERPViewsSales from './views/ERPViewsSales';
import ERPViewsAdmin from './views/ERPViewsAdmin';
import ERPViewsAdvanced from './views/ERPViewsAdvanced';
import ERPViewsPro from './views/ERPViewsPro';
import ERPViewsSystem from './views/ERPViewsSystem';
import ERPViewsEnterprise from './views/ERPViewsEnterprise';
import ERPViewsTools from './views/ERPViewsTools';

const PAGE_COMPONENT = {
  // Core / dashboard / invoice creation / attendance (new, previously stubs)
  dashboard: ERPViewsMisc,
  create: ERPViewsMisc,
  my_attendance: ERPViewsMisc,
  hr: ERPViewsMisc,
  hr_advanced: ERPViewsMisc,

  // Sales & Invoices, CRM, Finance, HR listing, Reports & Audit, System Admin
  // basics — all already fully implemented, just needed to be reachable.
  list: ERPViewsSales,
  refunds: ERPViewsSales,
  customers: ERPViewsSales,
  corporates: ERPViewsSales,
  vendors: ERPViewsSales,
  creditors: ERPViewsSales,
  portals: ERPViewsSales,
  packages: ERPViewsSales,
  branches: ERPViewsSales,
  expenses: ERPViewsSales,
  bank: ERPViewsSales,
  audit: ERPViewsSales,
  users: ERPViewsSales,
  reports: ERPViewsSales,
  statements: ERPViewsSales,
  staff_mistakes: ERPViewsSales,
  credit: ERPViewsSales,

  // Admin extras
  invest: ERPViewsAdmin,

  // Advanced
  ai_dashboard: ERPViewsAdvanced,
  quotations: ERPViewsAdvanced,

  // Pro
  refund_statement: ERPViewsPro,
  customer_statement: ERPViewsPro,
  recurring_invoices: ERPViewsPro,
  expense_approval: ERPViewsPro,
  notifications: ERPViewsPro,

  // System
  profitability: ERPViewsSystem,
  profile: ERPViewsSystem,
  superadmin: ERPViewsSystem,
  settings: ERPViewsSystem,
  contract: ERPViewsSystem,
  offer: ERPViewsSystem,

  // Enterprise — credit_limits implementation here is the correct one
  // (the copy in ERPViewsSales referenced a `data.creditLimits` array that
  // was never fetched from Supabase and was always empty/broken).
  credit_limits: ERPViewsEnterprise,
  supplier_statement: ERPViewsEnterprise,
  multi_branch: ERPViewsEnterprise,

  // Tools
  ai_pricing: ERPViewsTools,
};

export default function ERPViews(props) {
  const { page, setPage } = props;
  const Component = PAGE_COMPONENT[page];

  if (!Component) {
    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>🚧</div>
            <h2 style={{ color: '#FBBF24', marginBottom: '10px' }}>Page Under Development</h2>
            <p style={{ color: '#94A3B8' }}>{page}</p>
            <button
              style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff' }}
              onClick={() => setPage?.('dashboard')}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Component {...props} />;
}
