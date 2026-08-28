'use client';

import React, { useState, useEffect } from 'react';

export default function ERPViewsAdmin(props) {
  const {
    page, data, tr, today, userProfile, showToast, setData, logAction,
    expForm, setExpForm, editExpId, setEditExpId,
    handleAddExpItem, handleRemoveExpItem, handleExpItemChange,
    handleAddEditExpense, handleEditExp, handleDeleteExpense,
    handleAddEditVend, vendorForm, setVendorForm, editVendId, handleEditVend,
    handleAddEditPkg, pkgForm, setPkgForm, editPkgId, handleEditPkg,
    handleAddEditBrn, brnForm, setBrnForm, editBrnId, handleEditBrn,
    handleAddEditEmp, empForm, setEmpForm, editEmpId, handleEditEmp,
    handleAddEditSrv, srvForm, setSrvForm, editSrvId, handleEditSrv,
    handleAddInvestment, investForm, setInvestForm,
    handleTransfer, transferForm, setTransferForm,
    handleDelete, handleExportCSV, handleAddEditPortal, portalForm, setPortalForm,
    handleAddAdvance, handleUpdateAdvanceStatus, handleDeleteAdvance,
    handleGenerateSlip, handleDeletePayroll,
    handleAddMistake, handlePreviewMistake, handleDeleteMistake,
    handleProcessPayroll, payForm, setPayForm,
    advForm, setAdvForm, employees, lang, theme
  } = props;

  const [cashbookFilter, setCashbookFilter] = useState('All');
  const isAr = lang === 'ar';
  const isDark = theme === 'dark';

  // AI – Auto-suggest expense category based on description
  const suggestCategory = (desc) => {
    const keywords = {
      'office': 'Office Expense',
      'travel': 'Travel Expense',
      'supply': 'Supplies',
      'utility': 'Utilities',
      'rent': 'Rent',
      'salary': 'Salary',
      'food': 'Meals',
      'transport': 'Transport',
      'maintenance': 'Maintenance',
      'marketing': 'Marketing',
      'software': 'Software',
      'hardware': 'Hardware',
      'training': 'Training',
      'insurance': 'Insurance',
      'tax': 'Tax',
      'legal': 'Legal',
      'medical': 'Medical',
      'stationery': 'Stationery',
      'cleaning': 'Cleaning',
      'security': 'Security',
      'communication': 'Communication',
      'printing': 'Printing',
      'repair': 'Repair'
    };
    if (!desc) return 'Other';
    const lower = desc.toLowerCase();
    for (const [key, cat] of Object.entries(keywords)) {
      if (lower.includes(key)) return cat;
    }
    return 'Other';
  };

  // Auto-update category when description changes in expense form
  useEffect(() => {
    if (expForm.description && expForm.expense_type === 'Other') {
      const suggested = suggestCategory(expForm.description);
      if (suggested !== 'Other') {
        setExpForm(prev => ({ ...prev, expense_type: suggested }));
      }
    }
  }, [expForm.description]);

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
    tableHeader: {
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
    tableCell: {
      padding: '12px',
      borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      color: isDark ? '#CBD5E1' : '#1E293B'
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

  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';

  // ============================================================
  // VENDORS – already in Sales, but we have it here too
  // ============================================================
  if (page === 'vendors') {
    const [searchTerm, setSearchTerm] = useState('');
    const filtered = (data.vendors || []).filter(v =>
      !searchTerm || v.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🚚 {tr?.vendors || 'Vendors'}</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              style={styles.input}
              placeholder={isAr ? 'بحث عن مورد...' : 'Search vendors...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button style={{ ...styles.btn, ...styles.btnInfo }} onClick={() => handleExportCSV?.('vendors')}>
              📥 Export
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? 'إضافة مورد جديد' : 'Add New Vendor'}</h3>
          <form onSubmit={handleAddEditVend} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الاسم' : 'Name'}</label>
              <input style={styles.input} value={vendorForm.name} onChange={e => setVendorForm({ ...vendorForm, name: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الهاتف' : 'Phone'}</label>
              <input style={styles.input} value={vendorForm.phone} onChange={e => setVendorForm({ ...vendorForm, phone: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الرصيد' : 'Balance'}</label>
              <input type="number" step="0.01" style={styles.input} value={vendorForm.balance} onChange={e => setVendorForm({ ...vendorForm, balance: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
                {editVendId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '➕ ' + (isAr ? 'إضافة' : 'Add')}
              </button>
            </div>
          </form>
          {editVendId && (
            <button style={{ ...styles.btn, ...styles.btnGhost, marginTop: '10px' }} onClick={() => { setEditVendId(null); setVendorForm({ name: '', phone: '', balance: 0 }); }}>
              ✕ {isAr ? 'إلغاء التعديل' : 'Cancel Edit'}
            </button>
          )}
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Balance</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{v.name}</td>
                    <td style={styles.td}>{v.phone || '-'}</td>
                    <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(v.balance)}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditVend(v)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('vendors', v.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا يوجد موردين' : 'No vendors found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // BANK & CASH
  // ============================================================
  if (page === 'bank') {
    const [cashFilter, setCashFilter] = useState('All');
    const cashIn = (data.cashbook || []).filter(c => c.type === 'Cash-In').reduce((s, c) => s + (c.amount || 0), 0);
    const cashOut = (data.cashbook || []).filter(c => c.type === 'Cash-Out').reduce((s, c) => s + (c.amount || 0), 0);
    const bankIn = (data.cashbook || []).filter(c => c.type === 'Bank-In').reduce((s, c) => s + (c.amount || 0), 0);
    const bankOut = (data.cashbook || []).filter(c => c.type === 'Bank-Out').reduce((s, c) => s + (c.amount || 0), 0);
    const investIn = (data.cashbook || []).filter(c => c.type === 'Investor-In').reduce((s, c) => s + (c.amount || 0), 0);
    const investOut = (data.cashbook || []).filter(c => c.type === 'Investor-Out').reduce((s, c) => s + (c.amount || 0), 0);

    const filteredCashbook = cashFilter === 'All'
      ? data.cashbook
      : data.cashbook.filter(c => c.type?.toLowerCase().includes(cashFilter.toLowerCase()));

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏦 {tr?.bank || 'Bank & Cash'}</h1>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'الرصيد النقدي' : 'Cash Balance'}</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(cashIn - cashOut)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'الرصيد البنكي' : 'Bank Balance'}</div>
            <div style={{ ...styles.statValue, color: '#60A5FA' }}>{fmt(bankIn - bankOut)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'صافي المستثمرين' : 'Investor Net'}</div>
            <div style={{ ...styles.statValue, color: '#A78BFA' }}>{fmt(investIn - investOut)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي الإيداع النقدي' : 'Total Cash In'}</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(cashIn)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي السحب النقدي' : 'Total Cash Out'}</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(cashOut)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🔁 {isAr ? 'تحويل الأموال' : 'Fund Transfer'}</h3>
          <form onSubmit={handleTransfer} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'من' : 'From'}</label>
              <select style={styles.select} value={transferForm.from} onChange={e => setTransferForm({ ...transferForm, from: e.target.value })}>
                <option>Cash</option>
                <option>Bank</option>
                <option>Investor</option>
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'إلى' : 'To'}</label>
              <select style={styles.select} value={transferForm.to} onChange={e => setTransferForm({ ...transferForm, to: e.target.value })}>
                <option>Cash</option>
                <option>Bank</option>
                <option>Investor</option>
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'المبلغ' : 'Amount'}</label>
              <input type="number" step="0.01" style={styles.input} value={transferForm.amount} onChange={e => setTransferForm({ ...transferForm, amount: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'التاريخ' : 'Date'}</label>
              <input type="date" style={styles.input} value={transferForm.date} onChange={e => setTransferForm({ ...transferForm, date: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'ملاحظة' : 'Note'}</label>
              <input style={styles.input} value={transferForm.description || ''} onChange={e => setTransferForm({ ...transferForm, description: e.target.value })} placeholder="e.g. Daily cash deposit" />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnSuccess, width: '100%' }}>
                🔄 {isAr ? 'تحويل' : 'Transfer'}
              </button>
            </div>
          </form>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setCashFilter('All')} style={{ ...styles.btn, ...(cashFilter === 'All' ? styles.btnPrimary : styles.btnGhost) }}>
              {isAr ? 'الكل' : 'All'}
            </button>
            <button onClick={() => setCashFilter('Cash')} style={{ ...styles.btn, ...(cashFilter === 'Cash' ? styles.btnWarning : styles.btnGhost) }}>
              {isAr ? 'نقداً' : 'Cash'}
            </button>
            <button onClick={() => setCashFilter('Bank')} style={{ ...styles.btn, ...(cashFilter === 'Bank' ? styles.btnInfo : styles.btnGhost) }}>
              {isAr ? 'بنك' : 'Bank'}
            </button>
            <button onClick={() => setCashFilter('Investor')} style={{ ...styles.btn, ...(cashFilter === 'Investor' ? styles.btnSuccess : styles.btnGhost) }}>
              {isAr ? 'مستثمر' : 'Investor'}
            </button>
          </div>
          <button style={{ ...styles.btn, ...styles.btnInfo }} onClick={() => handleExportCSV?.('cashbook')}>
            📥 {isAr ? 'تصدير' : 'Export'}
          </button>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Description</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCashbook.slice(0, 50).map(c => (
                  <tr key={c.id}>
                    <td style={styles.td}>{c.trans_date}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: c.type?.includes('In') ? '#065F46' : '#7F1D1D', color: c.type?.includes('In') ? '#34D399' : '#FCA5A5' }}>
                        {c.type}
                      </span>
                    </td>
                    <td style={styles.td}>{c.description}</td>
                    <td style={{ ...styles.tdRight, color: c.type?.includes('In') ? '#34D399' : '#FCA5A5' }}>{fmt(c.amount)}</td>
                    <td style={styles.tdCenter}>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('cashbook', c.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
                {filteredCashbook.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد معاملات' : 'No transactions found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // INVESTMENTS – with AI suggestion for profit share
  // ============================================================
  if (page === 'invest') {
    const totalInvested = (data.investments || []).reduce((s, i) => s + (i.amount || 0), 0);
    const avgProfit = 0.12; // hypothetical AI suggested return

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📈 {tr?.invest || 'Investors'}</h1>
          <button style={{ ...styles.btn, ...styles.btnInfo }} onClick={() => handleExportCSV?.('investments')}>
            📥 {isAr ? 'تصدير' : 'Export'}
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي المستثمرين' : 'Total Investors'}</div>
            <div style={styles.statValue}>{data.investments?.length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي الاستثمار' : 'Total Investment'}</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(totalInvested)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>🤖 {isAr ? 'العائد المقترح' : 'AI Suggested Return'}</div>
            <div style={{ ...styles.statValue, color: '#A78BFA' }}>{(totalInvested * avgProfit).toFixed(2)} SAR</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>➕ {isAr ? 'إضافة استثمار جديد' : 'Add New Investment'}</h3>
          <form onSubmit={handleAddInvestment} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'اسم المستثمر' : 'Investor Name'}</label>
              <input style={styles.input} value={investForm.name} onChange={e => setInvestForm({ ...investForm, name: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'المبلغ' : 'Amount'}</label>
              <input type="number" step="0.01" style={styles.input} value={investForm.amount} onChange={e => setInvestForm({ ...investForm, amount: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'التاريخ' : 'Date'}</label>
              <input type="date" style={styles.input} value={investForm.date} onChange={e => setInvestForm({ ...investForm, date: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الطريقة' : 'Mode'}</label>
              <select style={styles.select} value={investForm.mode} onChange={e => setInvestForm({ ...investForm, mode: e.target.value })}>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'السبب' : 'Reason'}</label>
              <select style={styles.select} value={investForm.reason} onChange={e => setInvestForm({ ...investForm, reason: e.target.value })}>
                <option>Other</option>
                <option>Recharge for Portal</option>
                <option>Office Expense</option>
                <option>Salary</option>
              </select>
            </div>
            {investForm.reason === 'Other' && (
              <div>
                <label style={styles.formLabel}>{isAr ? 'تحديد السبب' : 'Specify Reason'}</label>
                <input style={styles.input} value={investForm.otherReason} onChange={e => setInvestForm({ ...investForm, otherReason: e.target.value })} required />
              </div>
            )}
            <div>
              <label style={styles.formLabel}>{isAr ? 'الوصف' : 'Description'}</label>
              <input style={styles.input} value={investForm.desc} onChange={e => setInvestForm({ ...investForm, desc: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
                ✅ {isAr ? 'إضافة' : 'Add'}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'المستثمر' : 'Investor'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                  <th style={styles.th}>{isAr ? 'التاريخ' : 'Date'}</th>
                  <th style={styles.th}>{isAr ? 'السبب' : 'Reason'}</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {(data.investments || []).map(i => (
                  <tr key={i.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{i.investor_name}</td>
                    <td style={{ ...styles.tdRight, color: '#34D399' }}>{fmt(i.amount)}</td>
                    <td style={styles.td}>{i.invest_date}</td>
                    <td style={styles.td}>{i.reason || 'N/A'}</td>
                    <td style={styles.tdCenter}>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('investments', i.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
                {(data.investments || []).length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد استثمارات' : 'No investments found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // SERVICES
  // ============================================================
  if (page === 'services') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛠️ {isAr ? 'الخدمات' : 'Services'}</h1>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{editSrvId ? '✏️ ' + (isAr ? 'تعديل الخدمة' : 'Edit Service') : '➕ ' + (isAr ? 'إضافة خدمة جديدة' : 'Add New Service')}</h3>
          <form onSubmit={handleAddEditSrv} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'اسم الخدمة' : 'Service Name'}</label>
              <input style={styles.input} value={srvForm.name} onChange={e => setSrvForm({ ...srvForm, name: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
                {editSrvId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '➕ ' + (isAr ? 'إضافة' : 'Add')}
              </button>
            </div>
          </form>
          {editSrvId && (
            <button style={{ ...styles.btn, ...styles.btnGhost, marginTop: '10px' }} onClick={() => { setEditSrvId(null); setSrvForm({ name: '' }); }}>
              ✕ {isAr ? 'إلغاء التعديل' : 'Cancel Edit'}
            </button>
          )}
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'اسم الخدمة' : 'Service Name'}</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {(data.services || []).map(s => (
                  <tr key={s.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{s.name}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditSrv(s)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('services', s.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(data.services || []).length === 0 && (
                  <tr>
                    <td colSpan="2" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد خدمات' : 'No services found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // If none of the above, return null
  return null;
}
