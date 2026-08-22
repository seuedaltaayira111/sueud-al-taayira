'use client';
import { useState, useMemo } from 'react';

export default function ERPViewsSystem(props) {
  const {
    page, data, lang, tr, modal, setModal, setPage,
    userProfile, user, setForm, setSetForm, setProfileForm, profileForm, passForm, setPassForm,
    handleSaveSettings, handleSaveProfile, handleChangePassword, handleLogout,
    handleDelete, setModal: openModal, showToast
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const t = (key, fallback) => tr?.[key] || fallback || key;
  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';

  const styles = {
    container: { padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' },
    card: { background: '#1E293B', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #334155' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '10px' },
    input: { padding: '10px 15px', background: '#0F172A', border: '1px solid #475569', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', outline: 'none', minWidth: '200px' },
    select: { padding: '10px 15px', background: '#0F172A', border: '1px solid #475569', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', outline: 'none' },
    btn: { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    btnPrimary: { background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff' },
    btnSuccess: { background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff' },
    btnDanger: { background: 'linear-gradient(135deg, #DC2626, #B91C1C)', color: '#fff' },
    btnWarning: { background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0F172A' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: { padding: '12px', background: '#0F172A', color: '#FBBF24', textAlign: 'left', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #334155' },
    td: { padding: '12px', borderBottom: '1px solid #1E293B', color: '#CBD5E1' },
    tdRight: { padding: '12px', borderBottom: '1px solid #1E293B', color: '#CBD5E1', textAlign: 'right', fontWeight: '600' },
    tdCenter: { padding: '12px', borderBottom: '1px solid #1E293B', color: '#CBD5E1', textAlign: 'center' },
    badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' },
    statCard: { background: 'linear-gradient(135deg, #1E293B, #0F172A)', padding: '20px', borderRadius: '12px', border: '1px solid #334155' },
    statLabel: { fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statValue: { fontSize: '24px', fontWeight: '700', color: '#FBBF24', marginTop: '5px' },
    emptyState: { textAlign: 'center', padding: '60px 20px', color: '#64748B' },
    emptyIcon: { fontSize: '60px', marginBottom: '15px' },
    formGroup: { marginBottom: '15px' },
    formLabel: { display: 'block', marginBottom: '5px', color: '#94A3B8', fontSize: '13px', fontWeight: '600' },
    formInput: { width: '100%', padding: '10px 15px', background: '#0F172A', border: '1px solid #475569', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    actionBtn: { padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }
  };

  // ═══════════ USERS PAGE ═══════════
  if (page === 'users') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>👥 {t('users', 'Users')}</h1>
        </div>
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <h2 style={{ color: '#FBBF24', marginBottom: '15px' }}>User Management</h2>
            <p style={{ color: '#94A3B8', maxWidth: '500px', margin: '0 auto 20px', lineHeight: '1.6' }}>
              User accounts are created through the SuperAdmin panel. Contact your system administrator to add new users or modify existing accounts.
            </p>
            <button 
              style={{ ...styles.btn, ...styles.btnPrimary, marginRight: '10px' }} 
              onClick={() => setPage('superadmin')}
            >
              Go to SuperAdmin →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ AUDIT LOGS PAGE ═══════════
  if (page === 'audit') {
    const filteredLogs = (data.auditLogs || [])
      .filter(l => !searchTerm || 
        l.action?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(l => !dateFilter || l.created_at?.startsWith(dateFilter))
      .slice(0, 200);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📜 {t('audit', 'Audit Logs')}</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input 
              style={styles.input} 
              placeholder="Search actions, users..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
            <input 
              type="date" 
              style={styles.input} 
              value={dateFilter} 
              onChange={e => setDateFilter(e.target.value)} 
            />
            {dateFilter && (
              <button 
                style={{ ...styles.btn, ...styles.btnWarning }}
                onClick={() => { setDateFilter(''); setSearchTerm(''); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Logs</div>
            <div style={styles.statValue}>{data.auditLogs?.length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Showing</div>
            <div style={{ ...styles.statValue, color: '#60A5FA' }}>{filteredLogs.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Today's Activity</div>
            <div style={styles.statValue}>
              {(data.auditLogs || []).filter(l => l.created_at?.startsWith(new Date().toISOString().split('T')[0])).length}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          {filteredLogs.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📜</div>
              <h3>No Audit Logs Found</h3>
              <p>Logs will appear here as users perform actions in the system.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: '180px' }}>Date/Time</th>
                    <th style={{ ...styles.th, width: '200px' }}>User</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, idx) => (
                    <tr key={log.id || idx} style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ ...styles.td, fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace' }}>
                        {log.created_at ? new Date(log.created_at).toLocaleString() : '-'}
                      </td>
                      <td style={{ ...styles.td, fontWeight: '600', color: '#60A5FA' }}>
                        {log.user_email || 'Unknown'}
                      </td>
                      <td style={styles.td}>{log.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════ REPORTS PAGE ═══════════
  if (page === 'reports') {
    const invoices = (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-'));
    const refunds = (data.invoices || []).filter(i => i.invoice_no?.startsWith('REF-'));
    
    const totalRevenue = invoices.reduce((s, i) => s + (i.total || 0), 0);
    const totalCost = invoices.reduce((s, i) => s + (i.total_cost || 0), 0);
    const totalProfit = invoices.reduce((s, i) => s + (i.profit || 0), 0);
    const totalExpenses = (data.expenses || []).reduce((s, e) => s + (e.amount || 0), 0);
    const totalRefunded = refunds.reduce((s, r) => s + (r.refund_customer || 0), 0);
    const netProfit = totalProfit - totalExpenses;

    // Revenue by service type
    const byService = {};
    invoices.forEach(i => {
      const svc = i.service_type || 'Other';
      byService[svc] = (byService[svc] || 0) + (i.total || 0);
    });

    // Revenue by airline
    const byAirline = {};
    invoices.filter(i => i.airline).forEach(i => {
      const al = i.airline;
      byAirline[al] = (byAirline[al] || 0) + (i.total || 0);
    });

    // Revenue by payment method
    const byPayment = {};
    invoices.forEach(i => {
      const pm = i.payment_method || 'Cash';
      byPayment[pm] = (byPayment[pm] || 0) + (i.total || 0);
    });

    // Monthly revenue (last 6 months)
    const monthlyRev = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      monthlyRev[key] = 0;
    }
    invoices.forEach(i => {
      if (i.invoice_date) {
        const key = i.invoice_date.slice(0, 7);
        if (monthlyRev.hasOwnProperty(key)) {
          monthlyRev[key] += i.total || 0;
        }
      }
    });

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📊 {t('reports', 'Reports')}</h1>
        </div>

        {/* Main Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Revenue</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(totalRevenue)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Cost</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(totalCost)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Invoice Profit</div>
            <div style={{ ...styles.statValue, color: '#FBBF24' }}>{fmt(totalProfit)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Expenses</div>
            <div style={{ ...styles.statValue, color: '#F87171' }}>{fmt(totalExpenses)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Net Profit</div>
            <div style={{ ...styles.statValue, color: netProfit >= 0 ? '#34D399' : '#FCA5A5' }}>{fmt(netProfit)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Refunded</div>
            <div style={{ ...styles.statValue, color: '#FB923C' }}>{fmt(totalRefunded)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Invoices</div>
            <div style={styles.statValue}>{invoices.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Refunds</div>
            <div style={styles.statValue}>{refunds.length}</div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div style={styles.card}>
          <h3 style={{ color: '#FBBF24', marginBottom: '15px', fontSize: '16px' }}>📈 Monthly Revenue (Last 6 Months)</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '150px', padding: '0 10px' }}>
            {Object.entries(monthlyRev).map(([month, amount]) => {
              const maxAmount = Math.max(...Object.values(monthlyRev), 1);
              const height = (amount / maxAmount) * 130;
              return (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '5px' }}>{fmt(amount)}</span>
                  <div style={{ 
                    width: '100%', 
                    height: `${Math.max(height, 5)}px`, 
                    background: 'linear-gradient(180deg, #34D399, #059669)', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s'
                  }}></div>
                  <span style={{ fontSize: '10px', color: '#64748B', marginTop: '5px' }}>{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Revenue by Service */}
          <div style={styles.card}>
            <h3 style={{ color: '#FBBF24', marginBottom: '15px', fontSize: '16px' }}>🎯 Revenue by Service Type</h3>
            {Object.entries(byService).sort((a, b) => b[1] - a[1]).map(([svc, amt]) => {
              const pct = totalRevenue > 0 ? (amt / totalRevenue * 100) : 0;
              return (
                <div key={svc} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#CBD5E1', fontSize: '13px' }}>{svc}</span>
                    <span style={{ color: '#34D399', fontWeight: '600', fontSize: '13px' }}>{fmt(amt)} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div style={{ height: '6px', background: '#0F172A', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #34D399, #059669)', borderRadius: '3px' }}></div>
                  </div>
                </div>
              );
            })}
            {Object.keys(byService).length === 0 && <p style={{ color: '#64748B', textAlign: 'center' }}>No data available</p>}
          </div>

          {/* Revenue by Airline */}
          <div style={styles.card}>
            <h3 style={{ color: '#FBBF24', marginBottom: '15px', fontSize: '16px' }}>✈️ Revenue by Airline</h3>
            {Object.entries(byAirline).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([airline, amt]) => {
              const pct = totalRevenue > 0 ? (amt / totalRevenue * 100) : 0;
              return (
                <div key={airline} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#CBD5E1', fontSize: '13px' }}>{airline}</span>
                    <span style={{ color: '#60A5FA', fontWeight: '600', fontSize: '13px' }}>{fmt(amt)} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div style={{ height: '6px', background: '#0F172A', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #60A5FA, #2563EB)', borderRadius: '3px' }}></div>
                  </div>
                </div>
              );
            })}
            {Object.keys(byAirline).length === 0 && <p style={{ color: '#64748B', textAlign: 'center' }}>No flight data available</p>}
          </div>
        </div>

        {/* Payment Methods */}
        <div style={styles.card}>
          <h3 style={{ color: '#FBBF24', marginBottom: '15px', fontSize: '16px' }}>💳 Revenue by Payment Method</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            {Object.entries(byPayment).sort((a, b) => b[1] - a[1]).map(([method, amt]) => (
              <div key={method} style={{ 
                background: '#0F172A', 
                padding: '15px', 
                borderRadius: '8px', 
                border: '1px solid #334155',
                textAlign: 'center'
              }}>
                <div style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '5px' }}>{method}</div>
                <div style={{ color: '#FBBF24', fontSize: '18px', fontWeight: '700' }}>{fmt(amt)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Table */}
        <div style={styles.card}>
          <h3 style={{ color: '#FBBF24', marginBottom: '15px', fontSize: '16px' }}>📋 P&L Summary</h3>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={{ ...styles.td, fontWeight: '600', width: '300px' }}>Total Revenue</td>
                <td style={{ ...styles.tdRight, color: '#34D399', fontSize: '16px' }}>{fmt(totalRevenue)}</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, fontWeight: '600' }}>Total Cost (Portal)</td>
                <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>- {fmt(totalCost)}</td>
              </tr>
              <tr style={{ background: 'rgba(251,191,36,0.05)' }}>
                <td style={{ ...styles.td, fontWeight: '700', color: '#FBBF24' }}>Gross Profit</td>
                <td style={{ ...styles.tdRight, color: '#FBBF24', fontWeight: '700', fontSize: '16px' }}>{fmt(totalProfit)}</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, fontWeight: '600' }}>Operating Expenses</td>
                <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>- {fmt(totalExpenses)}</td>
              </tr>
              <tr style={{ background: netProfit >= 0 ? 'rgba(52,211,153,0.1)' : 'rgba(252,165,165,0.1)' }}>
                <td style={{ ...styles.td, fontWeight: '700', color: netProfit >= 0 ? '#34D399' : '#FCA5A5', fontSize: '16px' }}>Net Profit</td>
                <td style={{ ...styles.tdRight, color: netProfit >= 0 ? '#34D399' : '#FCA5A5', fontWeight: '700', fontSize: '18px' }}>{fmt(netProfit)}</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, fontWeight: '600' }}>Refunds Issued</td>
                <td style={{ ...styles.tdRight, color: '#FB923C' }}>- {fmt(totalRefunded)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══════════ STATEMENTS PAGE ═══════════
  if (page === 'statements') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📑 {t('statements', 'Statements')}</h1>
        </div>
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📑</div>
            <h2 style={{ color: '#FBBF24', marginBottom: '15px' }}>Statements</h2>
            <p style={{ color: '#94A3B8', maxWidth: '500px', margin: '0 auto 25px', lineHeight: '1.6' }}>
              Generate detailed account statements for customers or suppliers. Use the specific statement pages for more options.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                style={{ ...styles.btn, ...styles.btnPrimary }} 
                onClick={() => setPage('customer_statement')}
              >
                📊 Customer Statement
              </button>
              <button 
                style={{ ...styles.btn, ...styles.btnSuccess }} 
                onClick={() => setPage('supplier_statement')}
              >
                📊 Supplier Statement
              </button>
              <button 
                style={{ ...styles.btn, ...styles.btnWarning }} 
                onClick={() => setPage('refund_statement')}
              >
                🔄 Refund Statement
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ SETTINGS PAGE ═══════════
  if (page === 'settings') {
    const currentSettings = data.settings || {};
    
    // Initialize form if not set
    if (!setForm?.company_name_en && currentSettings.company_name_en) {
      setSetForm({
        company_name_en: currentSettings.company_name_en || '',
        company_name_ar: currentSettings.company_name_ar || '',
        address_ar: currentSettings.address_ar || '',
        phone: currentSettings.phone || '',
        website: currentSettings.website || '',
        vat_no: currentSettings.vat_no || '',
        cr_no: currentSettings.cr_no || '',
        license_no: currentSettings.license_no || '',
        tourism_license_no: currentSettings.tourism_license_no || '',
        logo_url: currentSettings.logo_url || '',
        custom_fields: currentSettings.custom_fields || []
      });
    }

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚙️ {t('settings', 'Settings')}</h1>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ color: '#FBBF24', marginBottom: '20px', fontSize: '18px' }}>🏢 Company Information</h3>
          <form onSubmit={handleSaveSettings}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Company Name (English) *</label>
                <input 
                  style={styles.formInput} 
                  value={setForm?.company_name_en || ''} 
                  onChange={e => setSetForm(prev => ({ ...prev, company_name_en: e.target.value }))}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Company Name (Arabic) *</label>
                <input 
                  style={styles.formInput} 
                  dir="rtl"
                  value={setForm?.company_name_ar || ''} 
                  onChange={e => setSetForm(prev => ({ ...prev, company_name_ar: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Address (Arabic)</label>
                <input 
                  style={styles.formInput} 
                  dir="rtl"
                  value={setForm?.address_ar || ''} 
                  onChange={e => setSetForm(prev => ({ ...prev, address_ar: e.target.value }))}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone</label>
                <input 
                  style={styles.formInput} 
                  value={setForm?.phone || ''} 
                  onChange={e => setSetForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Website</label>
                <input 
                  style={styles.formInput} 
                  value={setForm?.website || ''} 
                  onChange={e => setSetForm(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Logo URL</label>
                <input 
                  style={styles.formInput} 
                  value={setForm?.logo_url || ''} 
                  onChange={e => setSetForm(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
            <h3 style={{ color: '#FBBF24', margin: '25px 0 15px', fontSize: '18px' }}>📄 Legal Information</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>VAT Number</label>
                <input 
                  style={styles.formInput} 
                  value={setForm?.vat_no || ''} 
                  onChange={e => setSetForm(prev => ({ ...prev, vat_no: e.target.value }))}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>CR Number</label>
                <input 
                  style={styles.formInput} 
                  value={setForm?.cr_no || ''} 
                  onChange={e => setSetForm(prev => ({ ...prev, cr_no: e.target.value }))}
                />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>License Number</label>
                <input 
                  style={styles.formInput} 
                  value={setForm?.license_no || ''} 
                  onChange={e => setSetForm(prev => ({ ...prev, license_no: e.target.value }))}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Tourism License Number</label>
                <input 
                  style={styles.formInput} 
                  value={setForm?.tourism_license_no || ''} 
                  onChange={e => setSetForm(prev => ({ ...prev, tourism_license_no: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnSuccess, padding: '12px 30px' }}>
                💾 Save Settings
              </button>
            </div>
          </form>
        </div>

        {setForm?.logo_url && (
          <div style={styles.card}>
            <h3 style={{ color: '#FBBF24', marginBottom: '15px', fontSize: '18px' }}>🖼️ Logo Preview</h3>
            <img 
              src={setForm.logo_url} 
              alt="Company Logo" 
              style={{ maxWidth: '200px', maxHeight: '100px', borderRadius: '8px', border: '1px solid #334155' }}
              onError={e => e.target.style.display = 'none'}
            />
          </div>
        )}
      </div>
    );
  }

  // ═══════════ PROFILE PAGE ═══════════
  if (page === 'profile') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>👤 {t('profile', 'Profile')}</h1>
        </div>

        {/* User Info Card */}
        <div style={styles.card}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '30px',
              color: '#fff',
              overflow: 'hidden'
            }}>
              {profileForm?.avatar_url ? (
                <img src={profileForm.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (userProfile?.username || userProfile?.name || 'U')?.charAt(0)?.toUpperCase()
              )}
            </div>
            <div>
              <h2 style={{ color: '#FBBF24', fontSize: '20px', marginBottom: '5px' }}>
                {userProfile?.name || userProfile?.username || 'User'}
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>{userProfile?.email || user?.email}</p>
              <span style={{ 
                ...styles.badge, 
                background: '#1E3A8A', 
                color: '#60A5FA',
                marginTop: '8px',
                display: 'inline-block'
              }}>
                {userProfile?.role || 'Staff'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div style={styles.card}>
          <h3 style={{ color: '#FBBF24', marginBottom: '20px', fontSize: '18px' }}>✏️ Edit Profile</h3>
          <form onSubmit={handleSaveProfile}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Username</label>
              <input 
                style={styles.formInput} 
                value={profileForm?.username || ''} 
                onChange={e => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone</label>
                <input 
                  style={styles.formInput} 
                  value={profileForm?.phone || ''} 
                  onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Address</label>
                <input 
                  style={styles.formInput} 
                  value={profileForm?.address || ''} 
                  onChange={e => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Avatar URL</label>
              <input 
                style={styles.formInput} 
                value={profileForm?.avatar_url || ''} 
                onChange={e => setProfileForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <button type="submit" style={{ ...styles.btn, ...styles.btnSuccess, marginTop: '10px', padding: '12px 30px' }}>
              💾 Save Profile
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div style={styles.card}>
          <h3 style={{ color: '#FBBF24', marginBottom: '20px', fontSize: '18px' }}>🔒 {t('changePass', 'Change Password')}</h3>
          <form onSubmit={handleChangePassword}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>New Password *</label>
              <input 
                type="password"
                style={styles.formInput} 
                value={passForm?.newPass || ''} 
                onChange={e => setPassForm(prev => ({ ...prev, newPass: e.target.value }))}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
              />
            </div>
            <button type="submit" style={{ ...styles.btn, ...styles.btnWarning, marginTop: '10px', padding: '12px 30px' }}>
              🔑 Update Password
            </button>
          </form>
        </div>

        {/* Logout */}
        <div style={styles.card}>
          <button 
            onClick={handleLogout} 
            style={{ ...styles.btn, ...styles.btnDanger, padding: '12px 30px', width: '100%' }}
          >
            🚪 {t('logout', 'Logout')}
          </button>
        </div>
      </div>
    );
  }

  // ═══════════ CONTRACT PAGE ═══════════
  if (page === 'contract') {
    const { contractCorpName, setContractCorpName, contractType, setContractType, contractMarkup, setContractMarkup, contractTerms, setContractTerms, handleGenerateContract, getContractHTML, setPreviewHTML } = props;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📝 {t('contract', 'Corporate Contract')}</h1>
        </div>
        <div style={styles.card}>
          <form onSubmit={handleGenerateContract}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Corporate Name *</label>
              <input 
                style={styles.formInput} 
                value={contractCorpName || ''} 
                onChange={e => setContractCorpName(e.target.value)}
                required
                placeholder="Enter corporate name"
              />
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Contract Type</label>
                <select 
                  style={styles.select} 
                  value={contractType || 'Standard'} 
                  onChange={e => setContractType(e.target.value)}
                  style={{ ...styles.formInput }}
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Markup %</label>
                <input 
                  type="number"
                  style={styles.formInput} 
                  value={contractMarkup || '10'} 
                  onChange={e => setContractMarkup(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Terms & Conditions</label>
              <textarea 
                style={{ ...styles.formInput, minHeight: '150px', resize: 'vertical' }} 
                value={contractTerms || ''} 
                onChange={e => setContractTerms(e.target.value)}
                placeholder="Enter contract terms..."
              />
            </div>
            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, padding: '12px 30px' }}>
              📄 Generate Contract
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ═══════════ OFFER PAGE ═══════════
  if (page === 'offer') {
    const { contractCorpName, setContractCorpName, contractType, setContractType, contractMarkup, setContractMarkup, contractTerms, setContractTerms, handleGenerateOffer, setPreviewHTML } = props;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎁 {t('offer', 'Corporate Offer')}</h1>
        </div>
        <div style={styles.card}>
          <form onSubmit={handleGenerateOffer}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Corporate Name *</label>
              <input 
                style={styles.formInput} 
                value={contractCorpName || ''} 
                onChange={e => setContractCorpName(e.target.value)}
                required
                placeholder="Enter corporate name"
              />
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Offer Type</label>
                <select 
                  style={styles.formInput}
                  value={contractType || 'Standard'} 
                  onChange={e => setContractType(e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Discount / Markup %</label>
                <input 
                  type="number"
                  style={styles.formInput} 
                  value={contractMarkup || '10'} 
                  onChange={e => setContractMarkup(e.target.value)}
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Offer Details</label>
              <textarea 
                style={{ ...styles.formInput, minHeight: '150px', resize: 'vertical' }} 
                value={contractTerms || ''} 
                onChange={e => setContractTerms(e.target.value)}
                placeholder="Enter offer details, inclusions, pricing..."
              />
            </div>
            <button type="submit" style={{ ...styles.btn, ...styles.btnSuccess, padding: '12px 30px' }}>
              🎁 Generate Offer
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ═══════════ SUPERADMIN PAGE ═══════════
  if (page === 'superadmin') {
    if (userProfile?.role !== 'SuperAdmin') {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔒</div>
              <h2 style={{ color: '#FCA5A5', marginBottom: '10px' }}>Access Denied</h2>
              <p style={{ color: '#94A3B8' }}>You don't have SuperAdmin permissions.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>👑 {t('superadmin', 'SuperAdmin')}</h1>
        </div>
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👑</div>
            <h2 style={{ color: '#FBBF24', marginBottom: '15px' }}>SuperAdmin Panel</h2>
            <p style={{ color: '#94A3B8', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
              SuperAdmin functions are available. Manage tenants, users, and system settings from here.
            </p>
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#0F172A', 
              borderRadius: '8px',
              textAlign: 'left',
              maxWidth: '400px',
              margin: '20px auto 0'
            }}>
              <div style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '8px' }}>Current User</div>
              <div style={{ color: '#E2E8F0', fontWeight: '600' }}>{userProfile?.email}</div>
              <div style={{ color: '#60A5FA', fontSize: '13px', marginTop: '4px' }}>Role: {userProfile?.role}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ PROFITABILITY PAGE ═══════════
  if (page === 'profitability') {
    const invoices = (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-'));
    
    // By Airline
    const airlineProfit = {};
    invoices.forEach(i => {
      if (i.airline) {
        if (!airlineProfit[i.airline]) airlineProfit[i.airline] = { revenue: 0, cost: 0, profit: 0, count: 0 };
        airlineProfit[i.airline].revenue += i.total_sell || 0;
        airlineProfit[i.airline].cost += i.total_cost || 0;
        airlineProfit[i.airline].profit += i.profit || 0;
        airlineProfit[i.airline].count += 1;
      }
    });

    // By Employee
    const empProfit = {};
    invoices.forEach(i => {
      const empName = i.employees?.name || 'Unassigned';
      if (!empProfit[empName]) empProfit[empName] = { revenue: 0, profit: 0, count: 0 };
      empProfit[empName].revenue += i.total || 0;
      empProfit[empName].profit += i.profit || 0;
      empProfit[empName].count += 1;
    });

    const totalProfit = invoices.reduce((s, i) => s + (i.profit || 0), 0);
    const avgMargin = invoices.length > 0 ? (totalProfit / invoices.reduce((s, i) => s + (i.total || 0), 0) * 100) : 0;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>💰 {t('profitability', 'Profitability')}</h1>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Profit</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(totalProfit)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Average Margin</div>
            <div style={{ ...styles.statValue, color: '#FBBF24' }}>{avgMargin.toFixed(2)}%</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Airlines Tracked</div>
            <div style={styles.statValue}>{Object.keys(airlineProfit).length}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* By Airline */}
          <div style={styles.card}>
            <h3 style={{ color: '#FBBF24', marginBottom: '15px', fontSize: '16px' }}>✈️ Profit by Airline</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Airline</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Revenue</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Profit</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Margin</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(airlineProfit)
                    .sort((a, b) => b[1].profit - a[1].profit)
                    .map(([airline, d]) => {
                      const margin = d.revenue > 0 ? (d.profit / d.revenue * 100) : 0;
                      return (
                        <tr key={airline}>
                          <td style={{ ...styles.td, fontWeight: '600' }}>{airline}</td>
                          <td style={styles.tdRight}>{fmt(d.revenue)}</td>
                          <td style={{ ...styles.tdRight, color: d.profit >= 0 ? '#34D399' : '#FCA5A5' }}>{fmt(d.profit)}</td>
                          <td style={{ ...styles.tdRight, color: margin >= 10 ? '#34D399' : '#FBBF24' }}>{margin.toFixed(1)}%</td>
                          <td style={styles.tdCenter}>{d.count}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* By Employee */}
          <div style={styles.card}>
            <h3 style={{ color: '#FBBF24', marginBottom: '15px', fontSize: '16px' }}>👨‍💼 Profit by Employee</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Employee</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Revenue</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Profit</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Invoices</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(empProfit)
                    .sort((a, b) => b[1].profit - a[1].profit)
                    .map(([emp, d]) => (
                      <tr key={emp}>
                        <td style={{ ...styles.td, fontWeight: '600' }}>{emp}</td>
                        <td style={styles.tdRight}>{fmt(d.revenue)}</td>
                        <td style={{ ...styles.tdRight, color: d.profit >= 0 ? '#34D399' : '#FCA5A5' }}>{fmt(d.profit)}</td>
                        <td style={styles.tdCenter}>{d.count}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ FALLBACK ═══════════
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🚧</div>
          <h2 style={{ color: '#FBBF24', marginBottom: '10px' }}>Page Under Development</h2>
          <p style={{ color: '#94A3B8' }}>{page}</p>
          <button 
            style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '20px' }} 
            onClick={() => setPage('dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
