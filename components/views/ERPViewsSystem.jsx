'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

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
    handleAddEditUser, handleEditUser, handleDeleteUser,
    today
  } = props;

  const isAr = lang === 'ar';
  const isDark = theme === 'dark';
  const t = (key, fallback) => tr?.[key] || fallback || key;
  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';

  const [reportTab, setReportTab] = useState('sales');
  const [repDate, setRepDate] = useState({ from: '', to: '' });
  const [statementType, setStatementType] = useState('sales');
  const [aiStep, setAiStep] = useState(0);
  const [aiData, setAiData] = useState({
    corporate_name: '',
    service_type: 'Flight Tickets',
    markup: 10,
    validity_days: 30,
    payment_terms: '100% advance payment required',
    special_terms: '',
    language: 'en'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // ===== STYLES =====
  const styles = {
    container: {
      padding: '24px',
      background: isDark ? '#0F172A' : '#F8FAFC',
      minHeight: '100vh',
      color: isDark ? '#E2E8F0' : '#1E293B',
      transition: 'all 0.3s ease'
    },
    card: {
      background: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '20px',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.06)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '12px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#1E3A8A',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: 0
    },
    input: {
      padding: '10px 16px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '10px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.2s'
    },
    select: {
      padding: '10px 16px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '10px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box'
    },
    textarea: {
      padding: '10px 16px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '10px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      minHeight: '80px',
      resize: 'vertical',
      fontFamily: 'inherit'
    },
    btn: {
      padding: '10px 20px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '13px',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
    },
    btnSuccess: {
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)'
    },
    btnDanger: {
      background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
    },
    btnWarning: {
      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
    },
    btnGhost: {
      background: 'transparent',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      color: isDark ? '#94A3B8' : '#64748B'
    },
    btnInfo: {
      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px'
    },
    formLabel: {
      display: 'block',
      marginBottom: '5px',
      color: isDark ? '#94A3B8' : '#64748B',
      fontSize: '13px',
      fontWeight: 600
    },
    sectionTitle: {
      color: '#FBBF24',
      fontSize: '15px',
      fontWeight: 700,
      margin: '0 0 15px',
      paddingBottom: '10px',
      borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      background: isDark ? 'linear-gradient(135deg, #1E293B, #0F172A)' : '#FFFFFF',
      padding: '20px',
      borderRadius: '12px',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.06)'
    },
    statLabel: {
      fontSize: '12px',
      color: '#94A3B8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: 600
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#1E3A8A',
      marginTop: '4px'
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
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px'
    },
    th: {
      padding: '12px 16px',
      background: isDark ? '#0F172A' : '#F8FAFC',
      color: isDark ? '#FBBF24' : '#1E293B',
      textAlign: 'left',
      fontWeight: 600,
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: isDark ? '2px solid #334155' : '2px solid #E2E8F0'
    },
    td: {
      padding: '12px 16px',
      borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      color: isDark ? '#CBD5E1' : '#1E293B'
    },
    tdRight: {
      padding: '12px 16px',
      borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      color: isDark ? '#CBD5E1' : '#1E293B',
      textAlign: 'right',
      fontWeight: 600
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
    aiBadge: {
      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      color: '#fff',
      padding: '2px 10px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: 'bold',
      display: 'inline-block',
      marginLeft: '8px'
    }
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
          <h1 style={styles.title}>👤 {t('profile', 'Profile')}</h1>
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
          <h1 style={styles.title}>⚙️ {t('settings', 'Settings')}</h1>
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
  // AI GENERATED CONTRACT / OFFER
  // ============================================================
  if (page === 'contract' || page === 'offer') {
    const isContract = page === 'contract';
    const aiQuestions = [
      { id: 'corporate_name', question_en: 'What is the corporate/company name?', question_ar: 'ما هو اسم الشركة؟' },
      { id: 'service_type', question_en: 'What type of service will be provided?', question_ar: 'ما نوع الخدمة التي سيتم تقديمها؟' },
      { id: 'markup', question_en: 'What is the markup/service fee (SAR)?', question_ar: 'ما هي رسوم الخدمة (ريال)؟' },
      { id: 'validity_days', question_en: 'How many days is this offer valid for?', question_ar: 'كم يوم تكون صلاحية هذا العرض؟' },
      { id: 'payment_terms', question_en: 'What are the payment terms?', question_ar: 'ما هي شروط الدفع؟' },
      { id: 'special_terms', question_en: 'Any special terms or conditions?', question_ar: 'هل توجد شروط أو أحكام خاصة؟' },
    ];

    const handleAiNext = () => {
      if (aiStep < aiQuestions.length - 1) {
        setAiStep(aiStep + 1);
      } else {
        setIsGenerating(true);
        setTimeout(() => {
          if (isContract) {
            handleGenerateContract({ preventDefault: () => {} });
          } else {
            handleGenerateOffer({ preventDefault: () => {} });
          }
          setIsGenerating(false);
        }, 1500);
      }
    };

    const handleAiPrevious = () => {
      if (aiStep > 0) setAiStep(aiStep - 1);
    };

    const currentQuestion = aiQuestions[aiStep];

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
            {isContract ? '📝 ' + (isAr ? 'منشئ العقود الذكي' : 'AI Contract Generator') : '🎁 ' + (isAr ? 'منشئ العروض الذكي' : 'AI Offer Generator')}
          </h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>
            {isAr ? 'أجب على الأسئلة وسيقوم الذكاء الاصطناعي بإنشاء مستند احترافي.' : 'Answer the questions and AI will generate a professional document.'}
          </p>
        </div>

        {/* AI Generator */}
        <div style={{ ...styles.card, borderLeft: '5px solid #FBBF24' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#FBBF24' }}>
              🤖 {isAr ? 'المساعد الذكي' : 'AI Assistant'}
              <span style={styles.aiBadge}>AI</span>
              <span style={{ fontSize: '12px', color: '#94A3B8', marginLeft: '10px' }}>
                {isAr ? `السؤال ${aiStep + 1} من ${aiQuestions.length}` : `Question ${aiStep + 1} of ${aiQuestions.length}`}
              </span>
            </h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              {aiQuestions.map((_, i) => (
                <div key={i} style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: i <= aiStep ? '#FBBF24' : '#334155',
                  transition: 'all 0.3s'
                }} />
              ))}
            </div>
          </div>

          <div style={{ padding: '20px 0' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, color: isDark ? '#E2E8F0' : '#1E293B', marginBottom: '15px' }}>
              {isAr ? currentQuestion.question_ar : currentQuestion.question_en}
            </p>

            {currentQuestion.id === 'corporate_name' && (
              <input
                style={styles.input}
                value={aiData.corporate_name}
                onChange={e => setAiData({ ...aiData, corporate_name: e.target.value })}
                placeholder={isAr ? 'مثال: أرامكو السعودية' : 'e.g. Saudi Aramco'}
              />
            )}
            {currentQuestion.id === 'service_type' && (
              <select
                style={styles.select}
                value={aiData.service_type}
                onChange={e => setAiData({ ...aiData, service_type: e.target.value })}
              >
                <option>Flight Tickets</option>
                <option>Hotel Booking</option>
                <option>Visa Services</option>
                <option>Hajj/Umrah Packages</option>
                <option>Complete Travel Management</option>
              </select>
            )}
            {currentQuestion.id === 'markup' && (
              <input
                type="number"
                style={styles.input}
                value={aiData.markup}
                onChange={e => setAiData({ ...aiData, markup: parseFloat(e.target.value) || 0 })}
                placeholder="10"
              />
            )}
            {currentQuestion.id === 'validity_days' && (
              <input
                type="number"
                style={styles.input}
                value={aiData.validity_days}
                onChange={e => setAiData({ ...aiData, validity_days: parseInt(e.target.value) || 30 })}
                placeholder="30"
              />
            )}
            {currentQuestion.id === 'payment_terms' && (
              <input
                style={styles.input}
                value={aiData.payment_terms}
                onChange={e => setAiData({ ...aiData, payment_terms: e.target.value })}
                placeholder={isAr ? 'شروط الدفع...' : 'Payment terms...'}
              />
            )}
            {currentQuestion.id === 'special_terms' && (
              <textarea
                style={styles.textarea}
                value={aiData.special_terms}
                onChange={e => setAiData({ ...aiData, special_terms: e.target.value })}
                placeholder={isAr ? 'شروط خاصة...' : 'Special terms...'}
                rows={3}
              />
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleAiPrevious}
                style={{ ...styles.btn, ...styles.btnGhost }}
                disabled={aiStep === 0}
              >
                ← {isAr ? 'السابق' : 'Previous'}
              </button>
              <button
                onClick={handleAiNext}
                style={{ ...styles.btn, ...(aiStep === aiQuestions.length - 1 ? styles.btnSuccess : styles.btnPrimary) }}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  '⏳ ' + (isAr ? 'جاري التوليد...' : 'Generating...')
                ) : (
                  aiStep === aiQuestions.length - 1
                    ? (isAr ? '🚀 إنشاء المستند' : '🚀 Generate Document')
                    : (isAr ? 'التالي →' : 'Next →')
                )}
              </button>
              {aiStep === aiQuestions.length - 1 && (
                <button
                  type="button"
                  style={{ ...styles.btn, ...styles.btnGhost }}
                  onClick={() => {
                    setAiStep(0);
                    setAiData({
                      corporate_name: '',
                      service_type: 'Flight Tickets',
                      markup: 10,
                      validity_days: 30,
                      payment_terms: '100% advance payment required',
                      special_terms: '',
                      language: 'en'
                    });
                  }}
                >
                  🔄 {isAr ? 'إعادة تعيين' : 'Reset'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Manual Contract Form */}
        <div style={{ ...styles.card, borderLeft: '5px solid #64748B' }}>
          <h3 style={styles.sectionTitle}>
            📝 {isAr ? 'أو أدخل التفاصيل يدوياً' : 'Or Enter Details Manually'}
          </h3>
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
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.formLabel}>{isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}</label>
              <textarea
                rows="5"
                value={contractTerms || ''}
                onChange={e => setContractTerms(e.target.value)}
                style={styles.textarea}
                placeholder={isAr ? 'أدخل الشروط هنا...' : 'Enter terms here...'}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', padding: '14px' }}>
                📄 {isContract ? (isAr ? 'إنشاء العقد' : 'Generate Contract') : (isAr ? 'إنشاء العرض' : 'Generate Offer')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
