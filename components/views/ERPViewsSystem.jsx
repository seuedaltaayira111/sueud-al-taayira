'use client';

import React, { useState } from 'react';

export default function ERPViewsSystem(props) {
  const {
    page, data, tr, userProfile, user, lang, theme,
    setForm, setSetForm, profileForm, setProfileForm,
    passForm, setPassForm, userForm, setUserForm,
    tenantForm, setTenantForm,
    contractCorpName, setContractCorpName,
    contractType, setContractType,
    contractMarkup, setContractMarkup,
    contractTerms, setContractTerms,
    handleSaveSettings, handleSaveProfile, handleChangePassword,
    handleLogout, handleDelete, handleLogoUpload, handleProfilePicUpload,
    handleAddTenant, handleToggleSubscription, handleDeleteTenant,
    handleGenerateContract, handleGenerateOffer,
    handleAddCustomField, handleRemoveCustomField, handleCustomFieldChange,
    setModal, setPage, showToast, handleExportCSV,
    handleAddEditUser, handleEditUser, handleDeleteUser
  } = props;

  const isAr = lang === 'ar';
  const isDark = theme === 'dark';
  const [reportTab, setReportTab] = useState('sales');
  const [repDate, setRepDate] = useState({ from: '', to: '' });
  const [statementType, setStatementType] = useState('sales');

  // ===== STYLES =====
  const styles = {
    container: {
      padding: '20px',
      background: isDark ? '#0F172A' : '#F8FAFC',
      minHeight: '100vh',
      color: isDark ? '#E2E8F0' : '#1E293B',
      transition: 'all 0.3s ease'
    },
    card: {
      background: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.05)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#FBBF24',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: 0
    },
    input: {
      padding: '10px 15px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '8px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.2s'
    },
    select: {
      padding: '10px 15px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '8px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box'
    },
    btn: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '13px',
      transition: 'all 0.2s'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
      color: '#fff'
    },
    btnSuccess: {
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: '#fff'
    },
    btnDanger: {
      background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
      color: '#fff'
    },
    btnWarning: {
      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
      color: '#0F172A'
    },
    btnGhost: {
      background: 'transparent',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      color: isDark ? '#94A3B8' : '#64748B'
    },
    btnInfo: {
      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
      color: '#fff'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px'
    },
    th: {
      padding: '12px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      color: '#FBBF24',
      textAlign: 'left',
      fontWeight: 600,
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: isDark ? '2px solid #334155' : '2px solid #E2E8F0'
    },
    td: {
      padding: '12px',
      borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      color: isDark ? '#CBD5E1' : '#1E293B'
    },
    tdRight: {
      padding: '12px',
      borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      color: isDark ? '#CBD5E1' : '#1E293B',
      textAlign: 'right',
      fontWeight: 600
    },
    tdCenter: {
      padding: '12px',
      borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      color: isDark ? '#CBD5E1' : '#1E293B',
      textAlign: 'center'
    },
    badge: {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      display: 'inline-block'
    },
    badgeSuccess: {
      background: '#065F46',
      color: '#34D399'
    },
    badgeDanger: {
      background: '#7F1D1D',
      color: '#FCA5A5'
    },
    badgeWarning: {
      background: '#78350F',
      color: '#FBBF24'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    statCard: {
      background: isDark ? 'linear-gradient(135deg, #1E293B, #0F172A)' : 'linear-gradient(135deg, #FFFFFF, #F8FAFC)',
      padding: '18px',
      borderRadius: '12px',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0'
    },
    statLabel: {
      fontSize: '11px',
      color: '#94A3B8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    statValue: {
      fontSize: '22px',
      fontWeight: 700,
      color: '#FBBF24',
      marginTop: '5px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    formLabel: {
      display: 'block',
      marginBottom: '5px',
      color: isDark ? '#94A3B8' : '#64748B',
      fontSize: '13px',
      fontWeight: 600
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px'
    },
    sectionTitle: {
      color: '#FBBF24',
      fontSize: '15px',
      fontWeight: 700,
      margin: '0 0 15px',
      paddingBottom: '10px',
      borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#64748B'
    },
    emptyIcon: {
      fontSize: '60px',
      marginBottom: '15px'
    },
    actionsCell: {
      display: 'flex',
      gap: '5px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    actionBtn: {
      padding: '6px 10px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: 600,
      transition: 'all 0.2s'
    },
    label: {
      fontSize: '13px',
      fontWeight: 600,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: '6px',
      display: 'block',
      marginTop: '12px'
    },
    tabBtn: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 600,
      background: isDark ? '#334155' : '#E2E8F0',
      color: isDark ? '#94A3B8' : '#64748B',
      transition: 'all 0.2s'
    },
    tabBtnActive: {
      background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
      color: 'white',
      boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)'
    }
  };

  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';

  // ===== HELPER: Filter data by date range =====
  const filterData = (items, dateField) => {
    if (!items) return [];
    let filtered = items;
    if (repDate.from) {
      filtered = filtered.filter(i => i[dateField] >= repDate.from);
    }
    if (repDate.to) {
      filtered = filtered.filter(i => i[dateField] <= repDate.to);
    }
    return filtered;
  };

  // ============================================================
  // PROFITABILITY ANALYZER
  // ============================================================
  if (page === 'profitability') {
    const activeInvoices = (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-'));
    const airlineProfits = {};

    activeInvoices.forEach(inv => {
      const key = inv.airline || inv.service_type || 'Unknown';
      if (!airlineProfits[key]) {
        airlineProfits[key] = { revenue: 0, cost: 0, profit: 0, count: 0 };
      }
      airlineProfits[key].revenue += (inv.total_sell || 0);
      airlineProfits[key].cost += (inv.total_cost || 0);
      airlineProfits[key].profit += (inv.profit || 0);
      airlineProfits[key].count += 1;
    });

    const sortedAirlines = Object.keys(airlineProfits).map(k => ({
      name: k,
      ...airlineProfits[k]
    })).sort((a, b) => b.profit - a.profit);

    const maxProfit = sortedAirlines.length > 0 ? Math.max(...sortedAirlines.map(a => Math.abs(a.profit)), 1) : 1;
    const totalRevenue = sortedAirlines.reduce((s, a) => s + a.revenue, 0);
    const totalProfit = sortedAirlines.reduce((s, a) => s + a.profit, 0);

    return (
      <div style={styles.container}>
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#FBBF24' }}>
            📊 {isAr ? 'محلل ربحية التذاكر' : 'Ticket Profitability Analyzer'}
          </h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>
            {isAr ? 'تحليل أي خطوط الطيران أو الخدمات تحقق أكبر ربح.' : 'Analyze which airlines or services are generating the most profit.'}
          </p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(totalRevenue)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي الربح' : 'Total Profit'}</div>
            <div style={{ ...styles.statValue, color: totalProfit >= 0 ? '#34D399' : '#FCA5A5' }}>{fmt(totalProfit)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'عدد الخطوط' : 'Airlines'}</div>
            <div style={styles.statValue}>{sortedAirlines.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي التذاكر' : 'Total Tickets'}</div>
            <div style={styles.statValue}>{activeInvoices.length}</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'الخطوط الجوية / الخدمة' : 'Airline / Service'}</th>
                  <th style={styles.th}>{isAr ? 'التذاكر المباعة' : 'Tickets Sold'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'إجمالي الإيرادات' : 'Total Revenue'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'إجمالي التكلفة' : 'Total Cost'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'صافي الربح' : 'Net Profit'}</th>
                </tr>
              </thead>
              <tbody>
                {sortedAirlines.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: 40, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد بيانات فواتير. قم بإنشاء فواتير لرؤية تحليل الربحية.' : 'No invoice data available. Create invoices to see profitability analysis.'}
                    </td>
                  </tr>
                ) : (
                  sortedAirlines.map((a, i) => (
                    <tr key={i}>
                      <td style={{ ...styles.td, fontWeight: 'bold', color: '#FBBF24' }}>{a.name}</td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>{a.count}</td>
                      <td style={{ ...styles.tdRight, color: '#34D399' }}>{fmt(a.revenue)}</td>
                      <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(a.cost)}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            flex: 1,
                            background: isDark ? '#0F172A' : '#F1F5F9',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            height: '10px'
                          }}>
                            <div style={{
                              width: `${(Math.abs(a.profit) / maxProfit) * 100}%`,
                              background: a.profit > 0 ? '#059669' : '#EF4444',
                              height: '100%'
                            }} />
                          </div>
                          <span style={{
                            fontWeight: 'bold',
                            color: a.profit > 0 ? '#34D399' : '#FCA5A5',
                            minWidth: '100px',
                            textAlign: 'right'
                          }}>
                            {fmt(a.profit)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PROFILE PAGE
  // ============================================================
  if (page === 'profile') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>👤 {tr?.profile || 'Profile'}</h1>
        </div>

        <div style={{ ...styles.card, maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              margin: '0 auto 15px',
              background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              color: 'white',
              overflow: 'hidden',
              border: '3px solid #FBBF24',
              position: 'relative'
            }}>
              {profileForm?.avatar_url ? (
                <img src={profileForm.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (userProfile?.username || userProfile?.name || 'U')?.charAt(0)?.toUpperCase()
              )}
            </div>
            <h3 style={{ marginTop: '0', color: '#FBBF24', marginBottom: '5px' }}>
              {profileForm?.username || userProfile?.username || 'User'}
            </h3>
            <p style={{ color: '#94A3B8', margin: 0 }}>{userProfile?.email || user?.email}</p>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              background: '#1E3A8A',
              color: '#60A5FA',
              fontSize: '11px',
              fontWeight: '700',
              display: 'inline-block',
              marginTop: '8px'
            }}>
              {userProfile?.role || 'Staff'}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'تحديث صورة الملف الشخصي' : 'Update Profile Picture'}</label>
              <input type="file" accept="image/*" onChange={handleProfilePicUpload} style={{ ...styles.input, padding: '10px', border: 'none' }} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'اسم المستخدم' : 'Username'}</label>
              <input value={profileForm?.username || ''} onChange={e => setProfileForm(prev => ({ ...prev, username: e.target.value }))} style={styles.input} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
              <input value={profileForm?.phone || ''} onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'العنوان' : 'Address'}</label>
              <input value={profileForm?.address || ''} onChange={e => setProfileForm(prev => ({ ...prev, address: e.target.value }))} style={styles.input} />
            </div>
            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
              💾 {isAr ? 'حفظ تغييرات الملف الشخصي' : 'Save Profile Changes'}
            </button>
          </form>

          <div style={{ marginTop: '30px', borderTop: isDark ? '1px solid #334155' : '1px solid #E2E8F0', paddingTop: '20px' }}>
            <h3 style={{ color: '#FBBF24', marginTop: 0, marginBottom: '15px' }}>🔒 {isAr ? 'الأمان' : 'Security'}</h3>
            <form onSubmit={handleChangePassword}>
              <label style={styles.formLabel}>{isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
              <input
                type="password"
                value={passForm?.newPass || ''}
                onChange={e => setPassForm(prev => ({ ...prev, newPass: e.target.value }))}
                style={styles.input}
                required
                minLength={6}
                placeholder={isAr ? '6 أحرف على الأقل' : 'Minimum 6 characters'}
              />
              <button type="submit" style={{ ...styles.btn, ...styles.btnWarning, width: '100%', marginTop: '10px', padding: '12px' }}>
                🔑 {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button onClick={handleLogout} style={{ ...styles.btn, ...styles.btnDanger, width: '100%', padding: '12px' }}>
              🚪 {isAr ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // SUPERADMIN PANEL
  // ============================================================
  if (page === 'superadmin') {
    if (userProfile?.role !== 'SuperAdmin') {
      return (
        <div style={styles.container}>
          <div style={{ ...styles.card, textAlign: 'center', padding: '60px' }}>
            <div style={styles.emptyIcon}>🔒</div>
            <h2 style={{ color: '#FCA5A5', marginBottom: '10px' }}>{isAr ? 'تم رفض الوصول' : 'Access Denied'}</h2>
            <p style={{ color: '#94A3B8' }}>{isAr ? 'ليس لديك صلاحيات المدير العام.' : 'You don\'t have SuperAdmin permissions.'}</p>
            <button onClick={() => setPage('dashboard')} style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '20px', padding: '12px 30px' }}>
              ← {isAr ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>👑 {isAr ? 'لوحة المدير العام - إدارة الوكالات' : 'SuperAdmin Panel - Manage Agencies'}</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>
            {isAr ? 'إنشاء وكالات سفر جديدة وإدارة اشتراكاتها.' : 'Create new travel agencies and manage their subscriptions.'}
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>➕ {isAr ? 'إضافة وكالة سفر جديدة' : 'Add New Travel Agency'}</h3>
          <form onSubmit={handleAddTenant} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'اسم الوكالة (إنجليزي)' : 'Agency Name (English)'} *</label>
              <input value={tenantForm?.agency_name || ''} onChange={e => setTenantForm(prev => ({ ...prev, agency_name: e.target.value }))} style={styles.input} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'اسم الشركة (عربي)' : 'Company Name (Arabic)'}</label>
              <input dir="rtl" value={tenantForm?.company_name_ar || ''} onChange={e => setTenantForm(prev => ({ ...prev, company_name_ar: e.target.value }))} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'البريد الإلكتروني للمالك' : 'Owner Email'} *</label>
              <input type="email" value={tenantForm?.owner_email || ''} onChange={e => setTenantForm(prev => ({ ...prev, owner_email: e.target.value }))} style={styles.input} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'تاريخ انتهاء الاشتراك' : 'Subscription End Date'} *</label>
              <input type="date" value={tenantForm?.subscription_end_date || ''} onChange={e => setTenantForm(prev => ({ ...prev, subscription_end_date: e.target.value }))} style={styles.input} required />
            </div>
            <div>
              <label style={styles.formLabel}>VAT Number</label>
              <input value={tenantForm?.vat_no || ''} onChange={e => setTenantForm(prev => ({ ...prev, vat_no: e.target.value }))} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>CR Number</label>
              <input value={tenantForm?.cr_no || ''} onChange={e => setTenantForm(prev => ({ ...prev, cr_no: e.target.value }))} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الهاتف' : 'Phone'}</label>
              <input value={tenantForm?.phone || ''} onChange={e => setTenantForm(prev => ({ ...prev, phone: e.target.value }))} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'العنوان' : 'Address'}</label>
              <input dir="rtl" value={tenantForm?.address_ar || ''} onChange={e => setTenantForm(prev => ({ ...prev, address_ar: e.target.value }))} style={styles.input} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', padding: '14px' }}>
                🚀 {isAr ? 'إنشاء الوكالة وإنشاء كلمة المرور' : 'Create Agency & Generate Password'}
              </button>
            </div>
          </form>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {(data.tenants || []).map(t => (
            <div key={t.id} style={{ ...styles.card, borderLeft: t.is_paid ? '4px solid #059669' : '4px solid #EF4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px', color: '#FBBF24' }}>{t.agency_name}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8' }}>{t.owner_email}</p>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: t.is_paid ? '#059669' : '#EF4444',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {t.is_paid ? '✅ ' + (isAr ? 'نشط' : 'Active') : '❌ ' + (isAr ? 'موقوف' : 'Suspended')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '15px', paddingTop: '15px', borderTop: isDark ? '1px solid #334155' : '1px solid #E2E8F0' }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'تاريخ انتهاء الاشتراك' : 'Sub. End Date'}:</span>
                <span style={{ fontWeight: 600, color: isDark ? '#E2E8F0' : '#1E293B' }}>{t.subscription_end_date}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => handleToggleSubscription(t)} style={{ ...styles.btn, ...(t.is_paid ? styles.btnDanger : styles.btnSuccess), flex: 1 }}>
                  {t.is_paid ? (isAr ? '⏸ إيقاف' : '⏸ Suspend') : (isAr ? '▶ تفعيل' : '▶ Activate')}
                </button>
                <button onClick={() => handleDeleteTenant(t.id)} style={{ ...styles.btn, ...styles.btnDanger, flex: 1 }}>
                  🗑 {isAr ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
          {(data.tenants || []).length === 0 && (
            <div style={{ ...styles.card, textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
              {isAr ? 'لا توجد وكالات مسجلة.' : 'No agencies registered yet.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // SETTINGS
  // ============================================================
  if (page === 'settings') {
    const currentSetForm = setForm || {};

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚙️ {tr?.settings || 'Settings'}</h1>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSaveSettings} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'اسم الشركة (إنجليزي)' : 'Company Name (EN)'} *</label>
              <input value={currentSetForm.company_name_en || ''} onChange={e => setSetForm({ ...currentSetForm, company_name_en: e.target.value })} style={styles.input} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'اسم الشركة (عربي)' : 'Company Name (AR)'}</label>
              <input dir="rtl" value={currentSetForm.company_name_ar || ''} onChange={e => setSetForm({ ...currentSetForm, company_name_ar: e.target.value })} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>VAT No</label>
              <input value={currentSetForm.vat_no || ''} onChange={e => setSetForm({ ...currentSetForm, vat_no: e.target.value })} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>CR No</label>
              <input value={currentSetForm.cr_no || ''} onChange={e => setSetForm({ ...currentSetForm, cr_no: e.target.value })} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الهاتف' : 'Phone'}</label>
              <input value={currentSetForm.phone || ''} onChange={e => setSetForm({ ...currentSetForm, phone: e.target.value })} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>Website</label>
              <input value={currentSetForm.website || ''} onChange={e => setSetForm({ ...currentSetForm, website: e.target.value })} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'العنوان (عربي)' : 'Address (AR)'}</label>
              <input dir="rtl" value={currentSetForm.address_ar || ''} onChange={e => setSetForm({ ...currentSetForm, address_ar: e.target.value })} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>License No</label>
              <input value={currentSetForm.license_no || ''} onChange={e => setSetForm({ ...currentSetForm, license_no: e.target.value })} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>Tourism License No</label>
              <input value={currentSetForm.tourism_license_no || ''} onChange={e => setSetForm({ ...currentSetForm, tourism_license_no: e.target.value })} style={styles.input} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'تحميل الشعار' : 'Logo Upload'}</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={styles.input} />
            </div>
            {currentSetForm.logo_url && (
              <div style={{ gridColumn: '1 / -1' }}>
                <img src={currentSetForm.logo_url} alt="Logo" style={{ height: '80px', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #E2E8F0' }} />
              </div>
            )}

            <div style={{ gridColumn: '1 / -1', borderTop: isDark ? '1px solid #334155' : '1px solid #E2E8F0', marginTop: '10px', paddingTop: '20px' }}>
              <h3 style={{ color: '#FBBF24', margin: '0 0 15px' }}>
                📝 {isAr ? 'حقول مخصصة (تذييل الفاتورة)' : 'Custom Fields (Invoice Footer)'}
              </h3>
              {(currentSetForm.custom_fields || []).map((cf, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <input
                    placeholder={isAr ? 'التسمية (مثال: رقم IATA)' : 'Label (e.g. IATA No)'}
                    value={cf.key || ''}
                    onChange={e => handleCustomFieldChange?.(i, 'key', e.target.value)}
                    style={{ ...styles.input, flex: 1, minWidth: '150px' }}
                  />
                  <input
                    placeholder={isAr ? 'القيمة' : 'Value'}
                    value={cf.value || ''}
                    onChange={e => handleCustomFieldChange?.(i, 'value', e.target.value)}
                    style={{ ...styles.input, flex: 1, minWidth: '150px' }}
                  />
                  <button type="button" onClick={() => handleRemoveCustomField?.(i)} style={{ ...styles.btn, ...styles.btnDanger, padding: '10px 16px' }}>
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddCustomField} style={{ ...styles.btn, ...styles.btnSuccess }}>
                + {isAr ? 'إضافة حقل مخصص' : 'Add Custom Field'}
              </button>
            </div>

            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, gridColumn: '1 / -1', padding: '14px' }}>
              💾 {isAr ? 'حفظ الإعدادات' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================
  // CONTRACT & OFFER
  // ============================================================
  if (page === 'contract' || page === 'offer') {
    const isContract = page === 'contract';

    const aiStandardTerms = [
      "Payment Terms: 100% advance payment required to confirm the booking.",
      "Validity: This document is valid for 30 days from the date of issue.",
      "Refund Policy: All cancellations are subject to airline/hotel cancellation policies.",
      "Prices are subject to change based on availability at the time of final booking.",
      "Passenger names must match exactly as per passport/ID."
    ];

    const handleTermToggle = (term) => {
      const currentTerms = contractTerms ? contractTerms.split('\n').filter(t => t.trim()) : [];
      if (currentTerms.includes(term)) {
        setContractTerms(currentTerms.filter(t => t !== term).join('\n'));
      } else {
        setContractTerms([...currentTerms, term].join('\n'));
      }
    };

    return (
      <div style={styles.container}>
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>
            {isContract ? '📝 ' + (isAr ? 'منشئ العقود للشركات' : 'Corporate Contract Generator') : '🎁 ' + (isAr ? 'منشئ عروض الشركات' : 'Corporate Offer Generator')}
          </h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>
            {isContract
              ? (isAr ? 'إنشاء اتفاقية رسمية ديناميكية.' : 'Generate a formal dynamic agreement.')
              : (isAr ? 'إنشاء خطاب عرض خاص ديناميكي.' : 'Generate a special dynamic offer letter.')}
          </p>
        </div>

        <div style={{ ...styles.card, borderLeft: '5px solid #FBBF24' }}>
          <form onSubmit={isContract ? handleGenerateContract : handleGenerateOffer} style={styles.formRow}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.formLabel}>{isAr ? 'اسم الشركة *' : 'Corporate Company Name *'}</label>
              <input
                type="text"
                value={contractCorpName || ''}
                onChange={e => setContractCorpName(e.target.value)}
                style={{ ...styles.input, padding: '15px', fontSize: '16px' }}
                required
                placeholder={isAr ? 'مثال: أرامكو السعودية' : 'e.g. Saudi Aramco'}
              />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'نوع الخدمة' : 'Service Type'}</label>
              <select value={contractType || 'Flight Tickets'} onChange={e => setContractType(e.target.value)} style={styles.select}>
                <option>Flight Tickets</option>
                <option>Hotel Booking</option>
                <option>Visa Services</option>
                <option>Hajj/Umrah Packages</option>
                <option>Complete Travel Management</option>
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'رسوم الخدمة / الهامش (ريال)' : 'Service Fee / Markup (SAR)'}</label>
              <input type="number" value={contractMarkup || '10'} onChange={e => setContractMarkup(e.target.value)} style={styles.input} required />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <label style={styles.formLabel}>🤖 {isAr ? 'شروط الذكاء الاصطناعي (انقر للإضافة/الحذف)' : 'AI Generated Terms (Click to add/remove)'}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                {aiStandardTerms.map((term, idx) => {
                  const isSelected = contractTerms?.includes(term);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTermToggle(term)}
                      style={{
                        padding: '8px 15px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        background: isSelected ? '#1E3A8A' : isDark ? '#334155' : '#F1F5F9',
                        color: isSelected ? 'white' : isDark ? '#94A3B8' : '#64748B',
                        border: isSelected ? '1px solid #2563EB' : isDark ? '1px solid #475569' : '1px solid #E2E8F0'
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{term.substring(0, 40)}...
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.formLabel}>{isAr ? 'الشروط والأحكام المخصصة (واحد في كل سطر)' : 'Custom Terms & Conditions (One per line)'}</label>
              <textarea
                rows="6"
                value={contractTerms || ''}
                onChange={e => setContractTerms(e.target.value)}
                style={{ ...styles.input, resize: 'vertical', fontFamily: 'sans-serif' }}
              />
            </div>

            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, gridColumn: '1 / -1', padding: '15px', fontSize: '16px' }}>
              📄 {isContract
                ? (isAr ? 'إنشاء العقد' : 'Generate Contract')
                : (isAr ? 'إنشاء العرض' : 'Generate Offer')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================
  // REPORTS
  // ============================================================
  if (page === 'reports') {
    const filteredInvoices = filterData(
      (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')),
      'invoice_date'
    );
    const filteredExpenses = filterData(data.expenses || [], 'expense_date');
    const salesTotal = filteredInvoices.reduce((s, i) => s + (i.total || 0), 0);
    const expTotal = filteredExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    const profitTotal = salesTotal - expTotal;

    const exportData = (type) => {
      switch (type) {
        case 'sales':
          return filteredInvoices.map(i => ({
            Date: i.invoice_date,
            Invoice: i.invoice_no,
            Customer: i.customers?.name || 'N/A',
            Total: i.total,
            Due: i.due_amount
          }));
        case 'expenses':
          return filteredExpenses.map(e => ({
            Date: e.expense_date,
            Type: e.expense_type,
            Description: e.description,
            Amount: e.amount
          }));
        case 'portals':
          return (data.portals || []).map(p => ({
            Name: p.name,
            Balance: p.current_balance
          }));
        case 'outstanding':
          return (data.invoices || [])
            .filter(i => (i.due_amount || 0) > 0)
            .map(i => ({
              Invoice: i.invoice_no,
              Customer: i.customers?.name || 'N/A',
              Due: i.due_amount
            }));
        default:
          return [];
      }
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📊 {tr?.reports || 'Reports'}</h1>
        </div>

        {/* Date Filters */}
        <div style={{ ...styles.card, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <label style={styles.formLabel}>{isAr ? 'من تاريخ' : 'From Date'}</label>
            <input type="date" value={repDate.from} onChange={e => setRepDate({ ...repDate, from: e.target.value })} style={{ ...styles.input, maxWidth: '200px' }} />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'إلى تاريخ' : 'To Date'}</label>
            <input type="date" value={repDate.to} onChange={e => setRepDate({ ...repDate, to: e.target.value })} style={{ ...styles.input, maxWidth: '200px' }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['sales', 'expenses', 'profit', 'portals', 'outstanding'].map(tab => (
            <button
              key={tab}
              onClick={() => setReportTab(tab)}
              style={{ ...styles.tabBtn, ...(reportTab === tab && styles.tabBtnActive) }}
            >
              {tab === 'sales' ? (isAr ? 'المبيعات' : 'Sales') :
               tab === 'expenses' ? (isAr ? 'المصروفات' : 'Expenses') :
               tab === 'profit' ? (isAr ? 'الربح' : 'Profit') :
               tab === 'portals' ? (isAr ? 'البوابات' : 'Portals') :
               (isAr ? 'المستحقات' : 'Outstanding')}
            </button>
          ))}
        </div>

        {/* Sales Tab */}
        {reportTab === 'sales' && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0', marginBottom: '15px' }}>
              <h3 style={{ color: '#FBBF24', margin: 0 }}>
                {isAr ? 'إجمالي المبيعات' : 'Total Sales'}: <span style={{ color: '#34D399' }}>{fmt(salesTotal)}</span>
              </h3>
              <button onClick={() => handleExportCSV?.('sales')} style={{ ...styles.btn, ...styles.btnSuccess }}>
                📥 {isAr ? 'تصدير' : 'Export'}
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Invoice</th>
                    <th style={styles.th}>Customer</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map(i => (
                    <tr key={i.id}>
                      <td style={styles.td}>{i.invoice_date}</td>
                      <td style={{ ...styles.td, color: '#60A5FA' }}>{i.invoice_no}</td>
                      <td style={styles.td}>{i.customers?.name || 'N/A'}</td>
                      <td style={{ ...styles.tdRight, color: '#34D399' }}>{fmt(i.total)}</td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                        {isAr ? 'لا توجد فواتير' : 'No invoices found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {reportTab === 'expenses' && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0', marginBottom: '15px' }}>
              <h3 style={{ color: '#FBBF24', margin: 0 }}>
                {isAr ? 'إجمالي المصروفات' : 'Total Expenses'}: <span style={{ color: '#FCA5A5' }}>{fmt(expTotal)}</span>
              </h3>
              <button onClick={() => handleExportCSV?.('expenses')} style={{ ...styles.btn, ...styles.btnSuccess }}>
                📥 {isAr ? 'تصدير' : 'Export'}
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Description</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(e => (
                    <tr key={e.id}>
                      <td style={styles.td}>{e.expense_date}</td>
                      <td style={styles.td}>{e.expense_type}</td>
                      <td style={styles.td}>{e.description}</td>
                      <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(e.amount)}</td>
                    </tr>
                  ))}
                  {filteredExpenses.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                        {isAr ? 'لا توجد مصروفات' : 'No expenses found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profit Tab */}
        {reportTab === 'profit' && (
          <div style={{ ...styles.card, textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#FBBF24', fontSize: '24px', marginTop: 0 }}>
              {isAr ? 'قائمة الأرباح والخسائر' : 'Profit & Loss Statement'}
            </h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: profitTotal >= 0 ? '#34D399' : '#FCA5A5', margin: '20px 0' }}>
              {fmt(profitTotal)}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '20px', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ color: '#94A3B8', margin: 0 }}>{isAr ? 'إجمالي المبيعات' : 'Total Sales'}</h4>
                <p style={{ fontSize: '20px', color: '#34D399', fontWeight: 'bold' }}>{fmt(salesTotal)}</p>
              </div>
              <div>
                <h4 style={{ color: '#94A3B8', margin: 0 }}>{isAr ? 'إجمالي المصروفات' : 'Total Expenses'}</h4>
                <p style={{ fontSize: '20px', color: '#FCA5A5', fontWeight: 'bold' }}>{fmt(expTotal)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Portals Tab */}
        {reportTab === 'portals' && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0', marginBottom: '15px' }}>
              <h3 style={{ color: '#FBBF24', margin: 0 }}>{isAr ? 'تقرير أرصدة البوابات' : 'Portal Balances Report'}</h3>
              <button onClick={() => handleExportCSV?.('portals')} style={{ ...styles.btn, ...styles.btnSuccess }}>
                📥 {isAr ? 'تصدير' : 'Export'}
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Portal</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'الرصيد' : 'Balance (SAR)'}</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.portals || []).map(p => (
                    <tr key={p.id}>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{p.name}</td>
                      <td style={{ ...styles.tdRight, color: (p.current_balance || 0) < 0 ? '#FCA5A5' : '#34D399' }}>
                        {fmt(p.current_balance)}
                      </td>
                    </tr>
                  ))}
                  {(data.portals || []).length === 0 && (
                    <tr>
                      <td colSpan="2" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                        {isAr ? 'لا توجد بوابات' : 'No portals found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Outstanding Tab */}
        {reportTab === 'outstanding' && (() => {
          const outInvs = (data.invoices || []).filter(i => (i.due_amount || 0) > 0);
          const totalDue = outInvs.reduce((s, i) => s + (i.due_amount || 0), 0);
          return (
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0', marginBottom: '15px' }}>
                <h3 style={{ color: '#FBBF24', margin: 0 }}>
                  {isAr ? 'إجمالي المستحقات' : 'Total Outstanding'}: <span style={{ color: '#FCA5A5' }}>{fmt(totalDue)}</span>
                </h3>
                <button onClick={() => handleExportCSV?.('outstanding')} style={{ ...styles.btn, ...styles.btnSuccess }}>
                  📥 {isAr ? 'تصدير' : 'Export'}
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Invoice</th>
                      <th style={styles.th}>Customer</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outInvs.map(i => (
                      <tr key={i.id}>
                        <td style={{ ...styles.td, color: '#60A5FA' }}>{i.invoice_no}</td>
                        <td style={styles.td}>{i.customers?.name || 'N/A'}</td>
                        <td style={{ ...styles.tdRight, color: '#FCA5A5', fontWeight: 'bold' }}>{fmt(i.due_amount)}</td>
                      </tr>
                    ))}
                    {outInvs.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                          {isAr ? 'لا توجد مستحقات' : 'No outstanding invoices'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // ============================================================
  // STATEMENTS
  // ============================================================
  if (page === 'statements') {
    const tabs = ['sales', 'portals', 'vendors', 'salary', 'expenses', 'customers', 'creditors', 'credit', 'branches', 'cash', 'bank'];

    const getExportData = (type) => {
      switch (type) {
        case 'sales':
          return filterData((data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')), 'invoice_date').map(i => ({
            Date: i.invoice_date,
            Invoice: i.invoice_no,
            Customer: i.customers?.name || i.corporates?.name,
            Total: i.total,
            Due: i.due_amount
          }));
        case 'portals':
          return (data.portals || []).map(p => ({ Portal: p.name, Balance: p.current_balance }));
        case 'vendors':
          return (data.vendors || []).map(v => ({ Vendor: v.name, Phone: v.phone, Balance: v.balance }));
        case 'salary':
          return filterData(data.payroll || [], 'month').map(p => ({
            Employee: p.employees?.name,
            Month: p.month,
            Amount: p.amount,
            Mode: p.payment_mode
          }));
        case 'expenses':
          return filterData(data.expenses || [], 'expense_date').map(e => ({
            Date: e.expense_date,
            Type: e.expense_type,
            Description: e.description,
            Amount: e.amount
          }));
        case 'customers':
          return (data.customers || []).map(c => ({ Name: c.name, Phone: c.phone, Credit: c.store_credit }));
        case 'creditors':
          return (data.creditors || []).map(c => ({ Name: c.name, Phone: c.phone, Address: c.address }));
        case 'credit':
          return (data.customers || []).filter(c => (c.store_credit || 0) > 0).map(c => ({
            Name: c.name,
            AvailableCredit: c.store_credit
          }));
        case 'branches':
          return (data.branches || []).map(b => ({ Name: b.name, Location: b.location, Manager: b.manager }));
        case 'cash':
          return filterData((data.cashbook || []).filter(c => c.type?.includes('Cash')), 'trans_date').map(c => ({
            Date: c.trans_date,
            Description: c.description,
            Amount: c.amount,
            Type: c.type
          }));
        case 'bank':
          return filterData((data.cashbook || []).filter(c => c.type?.includes('Bank')), 'trans_date').map(c => ({
            Date: c.trans_date,
            Description: c.description,
            Amount: c.amount,
            Type: c.type
          }));
        default:
          return [];
      }
    };

    const renderStatementTable = () => {
      switch (statementType) {
        case 'sales': {
          const items = filterData((data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')), 'invoice_date');
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Invoice</th>
                  <th style={styles.th}>Customer</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Total</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Due</th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id}>
                    <td style={styles.td}>{i.invoice_date}</td>
                    <td style={{ ...styles.td, color: '#60A5FA' }}>{i.invoice_no}</td>
                    <td style={styles.td}>{i.customers?.name || i.corporates?.name || 'N/A'}</td>
                    <td style={{ ...styles.tdRight, color: '#34D399' }}>{fmt(i.total)}</td>
                    <td style={{ ...styles.tdRight, color: (i.due_amount || 0) > 0 ? '#FCA5A5' : '#34D399', fontWeight: 'bold' }}>
                      {fmt(i.due_amount)}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد بيانات' : 'No data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        }
        case 'portals':
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Portal</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Balance (SAR)</th>
                </tr>
              </thead>
              <tbody>
                {(data.portals || []).map(p => (
                  <tr key={p.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{p.name}</td>
                    <td style={{ ...styles.tdRight, color: (p.current_balance || 0) < 0 ? '#FCA5A5' : '#34D399' }}>
                      {fmt(p.current_balance)}
                    </td>
                  </tr>
                ))}
                {(data.portals || []).length === 0 && (
                  <tr>
                    <td colSpan="2" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد بوابات' : 'No portals found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        case 'vendors':
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Vendor</th>
                  <th style={styles.th}>Phone</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {(data.vendors || []).map(v => (
                  <tr key={v.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{v.name}</td>
                    <td style={styles.td}>{v.phone}</td>
                    <td style={{ ...styles.tdRight }}>{fmt(v.balance)}</td>
                  </tr>
                ))}
                {(data.vendors || []).length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا يوجد موردين' : 'No vendors found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        case 'salary':
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee</th>
                  <th style={styles.th}>Month</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                  <th style={styles.th}>Mode</th>
                </tr>
              </thead>
              <tbody>
                {(data.payroll || []).map(p => (
                  <tr key={p.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{p.employees?.name || 'N/A'}</td>
                    <td style={styles.td}>{p.month}</td>
                    <td style={{ ...styles.tdRight, color: '#34D399' }}>{fmt(p.amount)}</td>
                    <td style={styles.td}>{p.payment_mode || 'Cash'}</td>
                  </tr>
                ))}
                {(data.payroll || []).length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد رواتب' : 'No salary records'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        case 'expenses':
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Description</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(data.expenses || []).map(e => (
                  <tr key={e.id}>
                    <td style={styles.td}>{e.expense_date}</td>
                    <td style={styles.td}>{e.expense_type}</td>
                    <td style={styles.td}>{e.description}</td>
                    <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(e.amount)}</td>
                  </tr>
                ))}
                {(data.expenses || []).length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد مصروفات' : 'No expenses found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        case 'customers':
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Credit</th>
                </tr>
              </thead>
              <tbody>
                {(data.customers || []).map(c => (
                  <tr key={c.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td>
                    <td style={styles.td}>{c.phone}</td>
                    <td style={{ ...styles.tdRight }}>{fmt(c.store_credit)}</td>
                  </tr>
                ))}
                {(data.customers || []).length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا يوجد عملاء' : 'No customers found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        case 'creditors':
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Address</th>
                </tr>
              </thead>
              <tbody>
                {(data.creditors || []).map(c => (
                  <tr key={c.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td>
                    <td style={styles.td}>{c.phone}</td>
                    <td style={styles.td}>{c.address}</td>
                  </tr>
                ))}
                {(data.creditors || []).length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا يوجد دائنين' : 'No creditors found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        case 'credit':
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Available Credit</th>
                </tr>
              </thead>
              <tbody>
                {(data.customers || []).filter(c => (c.store_credit || 0) > 0).map(c => (
                  <tr key={c.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td>
                    <td style={{ ...styles.tdRight, color: '#34D399', fontWeight: 'bold' }}>{fmt(c.store_credit)}</td>
                  </tr>
                ))}
                {(data.customers || []).filter(c => (c.store_credit || 0) > 0).length === 0 && (
                  <tr>
                    <td colSpan="2" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا يوجد رصيد' : 'No credit balances'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        case 'branches':
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Manager</th>
                </tr>
              </thead>
              <tbody>
                {(data.branches || []).map(b => (
                  <tr key={b.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{b.name}</td>
                    <td style={styles.td}>{b.location}</td>
                    <td style={styles.td}>{b.manager}</td>
                  </tr>
                ))}
                {(data.branches || []).length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد فروع' : 'No branches found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        case 'cash':
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Description</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(data.cashbook || []).filter(c => c.type?.includes('Cash')).map(c => (
                  <tr key={c.id}>
                    <td style={styles.td}>{c.trans_date}</td>
                    <td style={styles.td}>{c.description}</td>
                    <td style={{ ...styles.tdRight, color: c.type?.includes('In') ? '#34D399' : '#FCA5A5' }}>
                      {fmt(c.amount)}
                    </td>
                  </tr>
                ))}
                {(data.cashbook || []).filter(c => c.type?.includes('Cash')).length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد معاملات نقدية' : 'No cash transactions'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        case 'bank':
          return (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Description</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(data.cashbook || []).filter(c => c.type?.includes('Bank')).map(c => (
                  <tr key={c.id}>
                    <td style={styles.td}>{c.trans_date}</td>
                    <td style={styles.td}>{c.description}</td>
                    <td style={{ ...styles.tdRight, color: c.type?.includes('In') ? '#34D399' : '#FCA5A5' }}>
                      {fmt(c.amount)}
                    </td>
                  </tr>
                ))}
                {(data.cashbook || []).filter(c => c.type?.includes('Bank')).length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد معاملات بنكية' : 'No bank transactions'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        default:
          return (
            <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>
              {isAr ? 'اختر نوع كشف الحساب' : 'Select a statement type'}
            </div>
          );
      }
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📑 {tr?.statements || 'Statements'}</h1>
        </div>

        {/* Date Filters */}
        <div style={{ ...styles.card, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <label style={styles.formLabel}>{isAr ? 'من تاريخ' : 'From Date'}</label>
            <input type="date" value={repDate.from} onChange={e => setRepDate({ ...repDate, from: e.target.value })} style={{ ...styles.input, maxWidth: '200px' }} />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'إلى تاريخ' : 'To Date'}</label>
            <input type="date" value={repDate.to} onChange={e => setRepDate({ ...repDate, to: e.target.value })} style={{ ...styles.input, maxWidth: '200px' }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setStatementType(t)}
              style={{ ...styles.tabBtn, ...(statementType === t && styles.tabBtnActive) }}
            >
              {t === 'sales' ? (isAr ? 'المبيعات' : 'Sales') :
               t === 'portals' ? (isAr ? 'البوابات' : 'Portals') :
               t === 'vendors' ? (isAr ? 'الموردين' : 'Vendors') :
               t === 'salary' ? (isAr ? 'الرواتب' : 'Salary') :
               t === 'expenses' ? (isAr ? 'المصروفات' : 'Expenses') :
               t === 'customers' ? (isAr ? 'العملاء' : 'Customers') :
               t === 'creditors' ? (isAr ? 'الدائنين' : 'Creditors') :
               t === 'credit' ? (isAr ? 'الائتمان' : 'Credit') :
               t === 'branches' ? (isAr ? 'الفروع' : 'Branches') :
               t === 'cash' ? (isAr ? 'نقداً' : 'Cash') :
               (isAr ? 'البنك' : 'Bank')}
            </button>
          ))}
        </div>

        {/* Statement Content */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#FBBF24', textTransform: 'capitalize' }}>
              {statementType} {isAr ? 'كشف حساب' : 'Statement'}
            </h3>
            <button onClick={() => handleExportCSV?.(statementType)} style={{ ...styles.btn, ...styles.btnSuccess }}>
              📥 {isAr ? 'تصدير' : 'Export'}
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {renderStatementTable()}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
