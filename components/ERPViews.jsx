'use client';

/**
 * Master view router - Routes all pages to their respective components
 * Includes ADVANCE TRAVEL AGENCY features
 */

import ERPViewsMisc from './views/ERPViewsMisc';
import ERPViewsSales from './views/ERPViewsSales';
import ERPViewsAdmin from './views/ERPViewsAdmin';
import ERPViewsAdvanced from './views/ERPViewsAdvanced';
import ERPViewsPro from './views/ERPViewsPro';
import ERPViewsSystem from './views/ERPViewsSystem';
import ERPViewsEnterprise from './views/ERPViewsEnterprise';
import ERPViewsTools from './views/ERPViewsTools';
import ERPViewsTravel from './views/ERPViewsTravel';

const PAGE_COMPONENT = {
  // ===== MAIN =====
  dashboard: ERPViewsMisc,
  create: ERPViewsMisc,
  my_attendance: ERPViewsMisc,
  notifications: ERPViewsPro,

  // ===== TRAVEL AGENCY CORE =====
  list: ERPViewsSales,
  refunds: ERPViewsSales,
  quotations: ERPViewsAdvanced,

  // ===== FLIGHT OPERATIONS =====
  flight_status: ERPViewsTravel,
  hotel_booking: ERPViewsTravel,
  visa_processing: ERPViewsTravel,
  travel_insurance: ERPViewsTravel,
  hajj_umrah: ERPViewsTravel,

  // ===== PACKAGES & TOURS =====
  packages: ERPViewsSales,
  corporate_travel: ERPViewsTravel,
  frequent_flyer: ERPViewsTravel,

  // ===== CRM =====
  customers: ERPViewsSales,
  corporates: ERPViewsSales,
  creditors: ERPViewsSales,
  credit: ERPViewsSales,
  portals: ERPViewsSales,
  vendors: ERPViewsAdmin,

  // ===== FINANCE =====
  bank: ERPViewsAdmin,
  invest: ERPViewsAdmin,
  expenses: ERPViewsSales,
  profitability: ERPViewsSystem,
  refund_statement: ERPViewsPro,

  // ===== HR =====
  hr: ERPViewsMisc,
  hr_advanced: ERPViewsAdvanced,
  staff_mistakes: ERPViewsSales,

  // ===== CONTRACTS =====
  contract: ERPViewsSystem,
  offer: ERPViewsSystem,

  // ===== REPORTS & ADMIN =====
  reports: ERPViewsSystem,
  statements: ERPViewsSystem,
  audit: ERPViewsSales,
  superadmin: ERPViewsSystem,
  users: ERPViewsSales,
  settings: ERPViewsSystem,
  profile: ERPViewsSystem,

  // ===== ENTERPRISE =====
  credit_limits: ERPViewsEnterprise,
  supplier_statement: ERPViewsEnterprise,
  multi_branch: ERPViewsEnterprise,

  // ===== TOOLS =====
  ai_pricing: ERPViewsTools,
  ai_dashboard: ERPViewsAdvanced,
};

export default function ERPViews(props) {
  const { page, setPage } = props;
  const Component = PAGE_COMPONENT[page];

  if (!Component) {
    return (
      <div style={{
        padding: '40px 20px',
        background: 'var(--bg-primary, #0F172A)',
        minHeight: '100vh',
        color: 'var(--text-primary, #E2E8F0)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'var(--bg-secondary, #1E293B)',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid var(--border-color, #334155)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '15px' }}>🚧</div>
          <h2 style={{ color: '#FBBF24', marginBottom: '10px' }}>Page Under Development</h2>
          <p style={{ color: 'var(--text-muted, #94A3B8)' }}>{page}</p>
          <button
            style={{
              marginTop: '20px',
              padding: '10px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#fff'
            }}
            onClick={() => setPage?.('dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <Component {...props} />;
}
