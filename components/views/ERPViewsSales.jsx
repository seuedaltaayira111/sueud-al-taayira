'use client';

import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

export default function ERPViewsSales(props) {
  const {
    page, data, tr, modal, setModal, setPage,
    today,
    lang, theme,
    handleEditInvoice, handleDeleteInvoice, openPreview, openRefundModal,
    handleQuickSettle, handleDownloadPDF, printInvoice, shareWhatsApp, shareEmail,
    handleEditCust, handleDelete, handleEditCorp, handleEditCred, handleEditVend,
    handleEditPkg, handleEditBrn, handleEditEmp, handleEditExp,
    handleDeletePayroll, handleGenerateSlip, handlePreviewMistake, handleDeleteMistake,
    handleAddEditUser, handleEditUser, handleDeleteUser, userForm, setUserForm,
    editUserId, setEditUserId, handleTransfer, transferForm, setTransferForm,
    handleAddEditPortal, portalForm, setPortalForm, handleExportCSV,
    handleAddEditCust, handleAddEditCorp, handleAddEditCred, handleAddEditVend,
    handleAddEditPkg, handleAddEditBrn, handleAddEditEmp,
    custForm, setCustForm, editCustId, setEditCustId,
    corpForm, setCorpForm, editCorpId, setEditCorpId,
    creditorForm, setCreditorForm, editCredId, setEditCredId,
    vendorForm, setVendorForm, editVendId, setEditVendId,
    pkgForm, setPkgForm, editPkgId, setEditPkgId,
    brnForm, setBrnForm, editBrnId, setEditBrnId,
    empForm, setEmpForm, editEmpId, setEditEmpId,
    handleAddMistake, handleGenerateContract, handleGenerateOffer,
    contractCorpName, setContractCorpName, contractType, setContractType,
    contractMarkup, setContractMarkup, contractTerms, setContractTerms,
    downloadPDF, getExpenseHTML, getMistakeHTML, fetchAll, setData, setPreviewHTML
  } = props;

  const isAr = lang === 'ar';
  const isDark = theme === 'dark';

  // ===== STYLES =====
  const styles = {
    container: {
      padding: '24px',
      background: isDark ? '#0F172A' : '#F8FAFC',
      minHeight: '100vh',
      color: isDark ? '#E2E8F0' : '#0F172A',
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
    searchBox: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    input: {
      padding: '10px 16px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '10px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      minWidth: '180px',
      transition: 'all 0.2s'
    },
    select: {
      padding: '10px 16px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '10px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none'
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
    tdCenter: {
      padding: '12px 16px',
      borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
      color: isDark ? '#CBD5E1' : '#1E293B',
      textAlign: 'center'
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      display: 'inline-block'
    },
    badgePaid: {
      background: '#D1FAE5',
      color: '#065F46'
    },
    badgeUnpaid: {
      background: '#FEF3C7',
      color: '#92400E'
    },
    badgeRefunded: {
      background: '#FEE2E2',
      color: '#991B1B'
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
    pagination: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: isDark ? '1px solid #334155' : '1px solid #E2E8F0'
    },
    pageBtn: {
      padding: '8px 16px',
      background: isDark ? '#1E293B' : '#FFFFFF',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '8px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    actionsCell: {
      display: 'flex',
      gap: '4px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    actionBtn: {
      padding: '6px 10px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 600,
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
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
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#64748B'
    },
    emptyIcon: {
      fontSize: '60px',
      marginBottom: '15px'
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
  const t = (key, fallback) => tr?.[key] || fallback || key;

  // ===== FILTERED INVOICES =====
  const filteredInvoices = useMemo(() => {
    let inv = data.invoices?.filter(i => !i.invoice_no?.startsWith('REF-')) || [];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      inv = inv.filter(i =>
        (i.invoice_no || '').toLowerCase().includes(s) ||
        (i.customers?.name || '').toLowerCase().includes(s) ||
        (i.airline || '').toLowerCase().includes(s) ||
        (i.pnr || '').toLowerCase().includes(s)
      );
    }
    if (dateFilter) inv = inv.filter(i => i.invoice_date === dateFilter);
    if (statusFilter) inv = inv.filter(i => i.status === statusFilter);
    return inv;
  }, [data.invoices, searchTerm, dateFilter, statusFilter]);

  const filteredRefunds = useMemo(() => {
    let ref = data.invoices?.filter(i => i.invoice_no?.startsWith('REF-')) || [];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      ref = ref.filter(i =>
        (i.invoice_no || '').toLowerCase().includes(s) ||
        (i.old_customer_name || i.customers?.name || '').toLowerCase().includes(s) ||
        (i.airline || '').toLowerCase().includes(s)
      );
    }
    return ref;
  }, [data.invoices, searchTerm]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [statementType, setStatementType] = useState('sales');

  const paginate = (list) => {
    const start = (currentPage - 1) * rowsPerPage;
    return list.slice(start, start + rowsPerPage);
  };
  const totalPages = (list) => Math.ceil((list?.length || 0) / rowsPerPage);

  const getStatusIcon = (status) => {
    if (status === 'Paid') return '✅';
    if (status === 'Unpaid') return '⏳';
    if (status === 'refunded') return '🔄';
    return '📄';
  };

  // ============================================================
  // INVOICES LIST
  // ============================================================
  if (page === 'list') {
    const totalRevenue = filteredInvoices.reduce((s, i) => s + (i.total || 0), 0);
    const totalPaid = filteredInvoices.reduce((s, i) => s + (i.paid_amount || 0), 0);
    const totalDue = filteredInvoices.reduce((s, i) => s + (i.due_amount || 0), 0);
    const totalProfit = filteredInvoices.reduce((s, i) => s + (i.profit || 0), 0);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📋 {t('list', 'Invoices')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث...' : '🔍 Search...'}
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <input
              type="date"
              style={styles.input}
              value={dateFilter}
              onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }}
            />
            <select
              style={styles.select}
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">📊 {isAr ? 'الكل' : 'All Status'}</option>
              <option value="Paid">✅ {isAr ? 'مدفوعة' : 'Paid'}</option>
              <option value="Unpaid">⏳ {isAr ? 'غير مدفوعة' : 'Unpaid'}</option>
              <option value="refunded">🔄 {isAr ? 'مسترجعة' : 'Refunded'}</option>
            </select>
            <select
              style={styles.select}
              value={rowsPerPage}
              onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value="25">📄 25 rows</option>
              <option value="50">📄 50 rows</option>
              <option value="100">📄 100 rows</option>
            </select>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => setPage('create')}>
              ➕ {t('create', 'Create Invoice')}
            </button>
            <button style={{ ...styles.btn, ...styles.btnInfo }} onClick={() => handleExportCSV?.('invoices')}>
              📥 {isAr ? 'تصدير' : 'Export'}
            </button>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>📄 {isAr ? 'إجمالي الفواتير' : 'Total Invoices'}</div>
            <div style={styles.statValue}>{filteredInvoices.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>💰 {isAr ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
            <div style={{ ...styles.statValue, color: '#059669' }}>{fmt(totalRevenue)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>✅ {isAr ? 'المدفوع' : 'Paid'}</div>
            <div style={{ ...styles.statValue, color: '#059669' }}>{fmt(totalPaid)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>⏳ {isAr ? 'المستحق' : 'Due'}</div>
            <div style={{ ...styles.statValue, color: totalDue > 0 ? '#EF4444' : '#059669' }}>{fmt(totalDue)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>📈 {isAr ? 'الربح' : 'Profit'}</div>
            <div style={{ ...styles.statValue, color: '#8B5CF6' }}>{fmt(totalProfit)}</div>
          </div>
        </div>

        <div style={styles.card}>
          {paginate(filteredInvoices).length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📄</div>
              <h3>{isAr ? 'لا توجد فواتير' : 'No Invoices Found'}</h3>
              <p style={{ marginTop: '8px' }}>{isAr ? 'قم بإنشاء فاتورة جديدة' : 'Create a new invoice to get started'}</p>
              <button style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '16px' }} onClick={() => setPage('create')}>
                ➕ {t('create', 'Create Invoice')}
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>📋 {t('invNo', 'Inv No')}</th>
                    <th style={styles.th}>📅 Date</th>
                    <th style={styles.th}>👤 Customer</th>
                    <th style={styles.th}>✈️ Airline</th>
                    <th style={styles.th}>🔖 PNR</th>
                    <th style={styles.th}>🛫 Service</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>💰 {t('total', 'Total')}</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>⏳ {t('due', 'Due')}</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>📊 Status</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(filteredInvoices).map(inv => {
                    const isRefunded = inv.status === 'refunded';
                    return (
                      <tr key={inv.id} style={{
                        background: isRefunded ? 'rgba(239, 68, 68, 0.03)' : inv.status === 'Unpaid' ? 'rgba(245, 158, 11, 0.03)' : 'transparent'
                      }}>
                        <td style={{ ...styles.td, fontWeight: 700, color: isRefunded ? '#EF4444' : '#3B82F6' }}>
                          {inv.invoice_no}
                          {isRefunded && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#EF4444' }}>(REFUNDED)</span>}
                        </td>
                        <td style={styles.td}>{inv.invoice_date}</td>
                        <td style={{ ...styles.td, fontWeight: 500 }}>{inv.customers?.name || inv.corporates?.name || 'N/A'}</td>
                        <td style={styles.td}>{inv.airline || '-'}</td>
                        <td style={{ ...styles.td, color: '#3B82F6', fontWeight: 600 }}>{inv.pnr || '-'}</td>
                        <td style={styles.td}>{inv.service_type || '-'}</td>
                        <td style={styles.tdRight}>{fmt(inv.total)}</td>
                        <td style={{ ...styles.tdRight, color: inv.due_amount > 0 ? '#EF4444' : '#059669' }}>
                          {fmt(inv.due_amount)}
                        </td>
                        <td style={styles.tdCenter}>
                          <span style={{
                            ...styles.badge,
                            ...(inv.status === 'Paid' ? styles.badgePaid : isRefunded ? styles.badgeRefunded : styles.badgeUnpaid)
                          }}>
                            {getStatusIcon(inv.status)} {inv.status}
                          </span>
                        </td>
                        <td style={styles.tdCenter}>
                          <div style={styles.actionsCell}>
                            <button
                              style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }}
                              onClick={() => openPreview(inv)}
                              title={isAr ? 'معاينة' : 'Preview'}
                            >
                              👁️
                            </button>
                            {!isRefunded && (
                              <>
                                <button
                                  style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }}
                                  onClick={() => handleEditInvoice(inv)}
                                  title={isAr ? 'تعديل' : 'Edit'}
                                >
                                  ✏️
                                </button>
                                <button
                                  style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }}
                                  onClick={() => openRefundModal(inv)}
                                  title={isAr ? 'استرجاع' : 'Refund'}
                                >
                                  🔄
                                </button>
                                {inv.due_amount > 0 && (
                                  <button
                                    style={{ ...styles.actionBtn, background: '#FEF3C7', color: '#92400E' }}
                                    onClick={() => handleQuickSettle(inv)}
                                    title={isAr ? 'تسوية' : 'Settle'}
                                  >
                                    💰
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              style={{ ...styles.actionBtn, background: '#EDE9FE', color: '#5B21B6' }}
                              onClick={() => printInvoice(inv)}
                              title={isAr ? 'طباعة' : 'Print'}
                            >
                              🖨️
                            </button>
                            <button
                              style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }}
                              onClick={() => handleDownloadPDF(inv)}
                              title={isAr ? 'تحميل' : 'Download'}
                            >
                              ⬇️
                            </button>
                            <button
                              style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }}
                              onClick={() => handleDeleteInvoice(inv)}
                              title={isAr ? 'حذف' : 'Delete'}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={styles.pagination}>
          <div style={{ color: '#94A3B8', fontSize: '13px' }}>
            {isAr ? 'عرض' : 'Showing'} {Math.min((currentPage - 1) * rowsPerPage + 1, filteredInvoices.length)} - {Math.min(currentPage * rowsPerPage, filteredInvoices.length)} {isAr ? 'من' : 'of'} {filteredInvoices.length}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              style={{ ...styles.pageBtn }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ← {isAr ? 'السابق' : 'Prev'}
            </button>
            <span style={{
              padding: '8px 16px',
              background: '#2563EB',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 600
            }}>
              {currentPage}
            </span>
            <button
              style={{ ...styles.pageBtn }}
              disabled={currentPage >= totalPages(filteredInvoices)}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              {isAr ? 'التالي' : 'Next'} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // REFUNDS LIST
  // ============================================================
  if (page === 'refunds') {
    const totalRefundAmt = filteredRefunds.reduce((s, r) => s + (r.refund_customer || 0), 0);
    const totalCompRefund = filteredRefunds.reduce((s, r) => s + (r.refund_company || 0), 0);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔄 {t('refunds', 'Refunds')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث في الاسترجاعات...' : '🔍 Search refunds...'}
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <select
              style={styles.select}
              value={rowsPerPage}
              onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value="25">📄 25 rows</option>
              <option value="50">📄 50 rows</option>
              <option value="100">📄 100 rows</option>
            </select>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>🔄 {isAr ? 'إجمالي الاسترجاعات' : 'Total Refunds'}</div>
            <div style={styles.statValue}>{filteredRefunds.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>💰 {isAr ? 'مسترد للعملاء' : 'Refunded to Customers'}</div>
            <div style={{ ...styles.statValue, color: '#EF4444' }}>{fmt(totalRefundAmt)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>🏦 {isAr ? 'مسترد للبوابات' : 'Refunded to Portals'}</div>
            <div style={{ ...styles.statValue, color: '#3B82F6' }}>{fmt(totalCompRefund)}</div>
          </div>
        </div>

        <div style={styles.card}>
          {paginate(filteredRefunds).length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔄</div>
              <h3>{isAr ? 'لا توجد استرجاعات' : 'No Refunds Found'}</h3>
              <p>{isAr ? 'انقر على زر الاسترجاع في أي فاتورة لإنشاء واحدة!' : 'Click the refund button on any invoice to create one!'}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>🔄 Refund No</th>
                    <th style={styles.th}>📅 Date</th>
                    <th style={styles.th}>👤 Customer</th>
                    <th style={styles.th}>✈️ Airline</th>
                    <th style={styles.th}>🔖 PNR</th>
                    <th style={styles.th}>📝 Reason</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>💰 Cust Refund</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>🏦 Portal Refund</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>📄 Original Inv</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(filteredRefunds).map(ref => (
                    <tr key={ref.id}>
                      <td style={{ ...styles.td, fontWeight: 700, color: '#EF4444' }}>{ref.invoice_no}</td>
                      <td style={styles.td}>{ref.refund_date || ref.invoice_date}</td>
                      <td style={styles.td}>{ref.old_customer_name || ref.customers?.name || 'N/A'}</td>
                      <td style={styles.td}>{ref.airline || ref.old_airline || '-'}</td>
                      <td style={{ ...styles.td, color: '#3B82F6' }}>{ref.pnr || ref.old_pnr || '-'}</td>
                      <td style={styles.td}>{ref.refund_reason || '-'}</td>
                      <td style={{ ...styles.tdRight, color: '#EF4444' }}>{fmt(ref.refund_customer)}</td>
                      <td style={{ ...styles.tdRight, color: '#3B82F6' }}>{fmt(ref.refund_company)}</td>
                      <td style={styles.tdRight}>{fmt(ref.old_sell_price)}</td>
                      <td style={styles.tdCenter}>
                        <div style={styles.actionsCell}>
                          <button
                            style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }}
                            onClick={() => openPreview(ref)}
                            title={isAr ? 'معاينة' : 'Preview'}
                          >
                            👁️
                          </button>
                          <button
                            style={{ ...styles.actionBtn, background: '#EDE9FE', color: '#5B21B6' }}
                            onClick={() => printInvoice(ref)}
                            title={isAr ? 'طباعة' : 'Print'}
                          >
                            🖨️
                          </button>
                          <button
                            style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }}
                            onClick={() => handleDownloadPDF(ref)}
                            title={isAr ? 'تحميل' : 'Download'}
                          >
                            ⬇️
                          </button>
                          <button
                            style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }}
                            onClick={() => handleDeleteInvoice(ref)}
                            title={isAr ? 'حذف' : 'Delete'}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
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

  // ============================================================
  // CUSTOMERS
  // ============================================================
  if (page === 'customers') {
    const filtered = (data.customers || []).filter(c =>
      !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm)
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>👥 {t('customers', 'Customers')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث عن عميل...' : '🔍 Search customers...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? '➕ إضافة عميل جديد' : '➕ Add New Customer'}</h3>
          <form onSubmit={handleAddEditCust} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الاسم' : 'Name'}</label>
              <input style={styles.input} value={custForm.name} onChange={e => setCustForm({ ...custForm, name: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الهاتف' : 'Phone'}</label>
              <input style={styles.input} value={custForm.phone} onChange={e => setCustForm({ ...custForm, phone: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الرصيد (ريال)' : 'Store Credit (SAR)'}</label>
              <input type="number" step="0.01" style={styles.input} value={custForm.store_credit} onChange={e => setCustForm({ ...custForm, store_credit: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
                {editCustId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '➕ ' + (isAr ? 'إضافة' : 'Add')}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>👤 Name</th>
                  <th style={styles.th}>📞 Phone</th>
                  <th style={styles.th}>📋 Type</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>💰 Credit Balance</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>💳 Credit Limit</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td>
                    <td style={styles.td}>{c.phone || '-'}</td>
                    <td style={styles.td}>{c.type || 'Individual'}</td>
                    <td style={{ ...styles.tdRight, color: '#8B5CF6' }}>{fmt(c.store_credit)}</td>
                    <td style={{ ...styles.tdRight, color: '#3B82F6' }}>{fmt(c.credit_limit)}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditCust(c)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('customers', c.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // CORPORATES
  // ============================================================
  if (page === 'corporates') {
    const filtered = (data.corporates || []).filter(c =>
      !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏢 {t('corporates', 'Corporates')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث عن شركة...' : '🔍 Search corporates...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? '➕ إضافة شركة جديدة' : '➕ Add New Corporate'}</h3>
          <form onSubmit={handleAddEditCorp} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الاسم' : 'Name'}</label>
              <input style={styles.input} value={corpForm.name} onChange={e => setCorpForm({ ...corpForm, name: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>VAT No</label>
              <input style={styles.input} value={corpForm.vat_no} onChange={e => setCorpForm({ ...corpForm, vat_no: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الهاتف' : 'Phone'}</label>
              <input style={styles.input} value={corpForm.phone} onChange={e => setCorpForm({ ...corpForm, phone: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'العنوان' : 'Address'}</label>
              <input style={styles.input} value={corpForm.address} onChange={e => setCorpForm({ ...corpForm, address: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
                {editCorpId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '➕ ' + (isAr ? 'إضافة' : 'Add')}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>🏢 Name</th>
                  <th style={styles.th}>📋 VAT No</th>
                  <th style={styles.th}>📞 Phone</th>
                  <th style={styles.th}>📍 Address</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td>
                    <td style={styles.td}>{c.vat_no || '-'}</td>
                    <td style={styles.td}>{c.phone || '-'}</td>
                    <td style={styles.td}>{c.address || '-'}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditCorp(c)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('corporates', c.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // CREDITORS
  // ============================================================
  if (page === 'creditors') {
    const filtered = (data.creditors || []).filter(c =>
      !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>💳 {t('creditors', 'Creditors')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث...' : '🔍 Search...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? '➕ إضافة دائن جديد' : '➕ Add New Creditor'}</h3>
          <form onSubmit={handleAddEditCred} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الاسم' : 'Name'}</label>
              <input style={styles.input} value={creditorForm.name} onChange={e => setCreditorForm({ ...creditorForm, name: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الهاتف' : 'Phone'}</label>
              <input style={styles.input} value={creditorForm.phone} onChange={e => setCreditorForm({ ...creditorForm, phone: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'العنوان' : 'Address'}</label>
              <input style={styles.input} value={creditorForm.address} onChange={e => setCreditorForm({ ...creditorForm, address: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
                {editCredId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '➕ ' + (isAr ? 'إضافة' : 'Add')}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>💳 Name</th>
                  <th style={styles.th}>📞 Phone</th>
                  <th style={styles.th}>📍 Address</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td>
                    <td style={styles.td}>{c.phone || '-'}</td>
                    <td style={styles.td}>{c.address || '-'}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditCred(c)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('creditors', c.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // VENDORS
  // ============================================================
  if (page === 'vendors') {
    const filtered = (data.vendors || []).filter(v =>
      !searchTerm || v.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🚚 {t('vendors', 'Vendors')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث عن مورد...' : '🔍 Search vendors...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? '➕ إضافة مورد جديد' : '➕ Add New Vendor'}</h3>
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
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>🚚 Name</th>
                  <th style={styles.th}>📞 Phone</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>💰 Balance</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{v.name}</td>
                    <td style={styles.td}>{v.phone || '-'}</td>
                    <td style={{ ...styles.tdRight, color: '#EF4444' }}>{fmt(v.balance)}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditVend(v)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('vendors', v.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PORTALS
  // ============================================================
  if (page === 'portals') {
    const totalBalance = (data.portals || []).reduce((s, p) => s + (p.current_balance || 0), 0);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛫 {t('portals', 'Portals')}</h1>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>🛫 {isAr ? 'إجمالي البوابات' : 'Total Portals'}</div>
            <div style={styles.statValue}>{data.portals?.length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>💰 {isAr ? 'إجمالي الرصيد' : 'Total Balance'}</div>
            <div style={{ ...styles.statValue, color: '#059669' }}>{fmt(totalBalance)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{modal?.data?.id ? '✏️ ' + (isAr ? 'تعديل بوابة' : 'Edit Portal') : '➕ ' + (isAr ? 'إضافة بوابة جديدة' : 'Add New Portal')}</h3>
          <form onSubmit={handleAddEditPortal} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'اسم البوابة' : 'Portal Name'}</label>
              <input style={styles.input} value={portalForm.name} onChange={e => setPortalForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'النوع' : 'Type'}</label>
              <select style={styles.select} value={portalForm.portal_type} onChange={e => setPortalForm(p => ({ ...p, portal_type: e.target.value }))}>
                <option>GDS</option>
                <option>Airline Direct</option>
                <option>Consolidator</option>
                <option>Hotel Supplier</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الرصيد الافتتاحي' : 'Opening Balance'}</label>
              <input type="number" step="0.01" style={styles.input} value={portalForm.initial_balance} onChange={e => setPortalForm(p => ({ ...p, initial_balance: e.target.value, current_balance: modal?.data?.id ? p.current_balance : e.target.value }))} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'جهة الاتصال' : 'Contact Person'}</label>
              <input style={styles.input} value={portalForm.contact_person} onChange={e => setPortalForm(p => ({ ...p, contact_person: e.target.value }))} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الهاتف' : 'Phone'}</label>
              <input style={styles.input} value={portalForm.phone} onChange={e => setPortalForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'حد الائتمان' : 'Credit Limit'}</label>
              <input type="number" step="0.01" style={styles.input} value={portalForm.credit_limit} onChange={e => setPortalForm(p => ({ ...p, credit_limit: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnSuccess, flex: 1 }}>
                {modal?.data?.id ? '💾 ' + (isAr ? 'حفظ' : 'Save') : '➕ ' + (isAr ? 'إضافة' : 'Add')}
              </button>
              {modal?.data?.id && (
                <button type="button" style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setModal({ type: null, data: null }); setPortalForm({ name: '', portal_type: 'GDS', current_balance: 0, initial_balance: 0, phone: '', contact_person: '', credit_limit: 0 }); }}>
                  ✕ {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>🛫 Name</th>
                  <th style={styles.th}>📋 Type</th>
                  <th style={styles.th}>📞 Contact</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>💰 Balance</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data.portals || []).map(p => (
                  <tr key={p.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{p.name}</td>
                    <td style={styles.td}>{p.portal_type || '-'}</td>
                    <td style={styles.td}>{p.contact_person || '-'} {p.phone ? '/ ' + p.phone : ''}</td>
                    <td style={{ ...styles.tdRight, color: (p.current_balance || 0) < 1000 ? '#EF4444' : '#059669' }}>{fmt(p.current_balance)}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => { setPortalForm({ name: p.name, portal_type: p.portal_type || 'GDS', current_balance: p.current_balance || 0, initial_balance: p.initial_balance || 0, phone: p.phone || '', contact_person: p.contact_person || '', credit_limit: p.credit_limit || 0 }); setModal({ type: 'editPortal', data: p }); }}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('portals', p.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PACKAGES
  // ============================================================
  if (page === 'packages') {
    const filtered = (data.packages || []).filter(p =>
      !searchTerm || p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📦 {t('packages', 'Packages')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث...' : '🔍 Search...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? '➕ إضافة باقة جديدة' : '➕ Add New Package'}</h3>
          <form onSubmit={handleAddEditPkg} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الاسم' : 'Name'}</label>
              <input style={styles.input} value={pkgForm.name} onChange={e => setPkgForm({ ...pkgForm, name: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'السعر' : 'Price'}</label>
              <input type="number" step="0.01" style={styles.input} value={pkgForm.price} onChange={e => setPkgForm({ ...pkgForm, price: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'المدة' : 'Duration'}</label>
              <input style={styles.input} value={pkgForm.duration} onChange={e => setPkgForm({ ...pkgForm, duration: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الوصف' : 'Description'}</label>
              <input style={styles.input} value={pkgForm.desc} onChange={e => setPkgForm({ ...pkgForm, desc: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'المشتملات' : 'Inclusions'}</label>
              <input style={styles.input} value={pkgForm.inclusions} onChange={e => setPkgForm({ ...pkgForm, inclusions: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
                {editPkgId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '➕ ' + (isAr ? 'إضافة' : 'Add')}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>📦 Name</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>💰 Price</th>
                  <th style={styles.th}>📅 Duration</th>
                  <th style={styles.th}>📋 Inclusions</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{p.name}</td>
                    <td style={styles.tdRight}>{fmt(p.price)}</td>
                    <td style={styles.td}>{p.duration || '-'}</td>
                    <td style={styles.td}>{p.inclusions || '-'}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditPkg(p)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('packages', p.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // BRANCHES
  // ============================================================
  if (page === 'branches') {
    const filtered = (data.branches || []).filter(b =>
      !searchTerm || b.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏢 {t('branches', 'Branches')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث...' : '🔍 Search...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? '➕ إضافة فرع جديد' : '➕ Add New Branch'}</h3>
          <form onSubmit={handleAddEditBrn} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الاسم' : 'Name'}</label>
              <input style={styles.input} value={brnForm.name} onChange={e => setBrnForm({ ...brnForm, name: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الموقع' : 'Location'}</label>
              <input style={styles.input} value={brnForm.location} onChange={e => setBrnForm({ ...brnForm, location: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الهاتف' : 'Phone'}</label>
              <input style={styles.input} value={brnForm.phone} onChange={e => setBrnForm({ ...brnForm, phone: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'المدير' : 'Manager'}</label>
              <input style={styles.input} value={brnForm.manager} onChange={e => setBrnForm({ ...brnForm, manager: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>Email</label>
              <input style={styles.input} value={brnForm.email} onChange={e => setBrnForm({ ...brnForm, email: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'التوقيت' : 'Timing'}</label>
              <input style={styles.input} value={brnForm.timing} onChange={e => setBrnForm({ ...brnForm, timing: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الحالة' : 'Status'}</label>
              <select style={styles.select} value={brnForm.status} onChange={e => setBrnForm({ ...brnForm, status: e.target.value })}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
                {editBrnId ? '💾 ' + (isAr ? 'تحديث' : 'Update') : '➕ ' + (isAr ? 'إضافة' : 'Add')}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>🏢 Name</th>
                  <th style={styles.th}>📍 Location</th>
                  <th style={styles.th}>📞 Phone</th>
                  <th style={styles.th}>👤 Manager</th>
                  <th style={styles.th}>📧 Email</th>
                  <th style={styles.th}>⏰ Timing</th>
                  <th style={styles.th}>📊 Status</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{b.name}</td>
                    <td style={styles.td}>{b.location || '-'}</td>
                    <td style={styles.td}>{b.phone || '-'}</td>
                    <td style={styles.td}>{b.manager || '-'}</td>
                    <td style={styles.td}>{b.email || '-'}</td>
                    <td style={styles.td}>{b.timing || '-'}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...(b.status === 'Active' ? styles.badgePaid : styles.badgeRefunded) }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditBrn(b)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('branches', b.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // EXPENSES – COMPLETE FIXED
  // ============================================================
  if (page === 'expenses') {
    const [expFormLocal, setExpFormLocal] = useState({
      expense_type: 'Office Expense',
      payment_mode: 'Cash',
      description: '',
      expense_date: today,
      vendor_name: '',
      items: [{ name: '', qty: 1, price: 0 }],
      approval_status: 'Approved'
    });
    const [editingExpId, setEditingExpId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const handleAddExpItemLocal = () => {
      setExpFormLocal(prev => ({
        ...prev,
        items: [...prev.items, { name: '', qty: 1, price: 0 }]
      }));
    };
    const handleRemoveExpItemLocal = (i) => {
      setExpFormLocal(prev => ({
        ...prev,
        items: prev.items.filter((_, idx) => idx !== i)
      }));
    };
    const handleExpItemChangeLocal = (i, field, val) => {
      setExpFormLocal(prev => {
        const items = [...prev.items];
        items[i] = { ...items[i], [field]: field === 'price' || field === 'qty' ? parseFloat(val) || 0 : val };
        return { ...prev, items };
      });
    };

    const handleExpenseSubmit = async (e) => {
      e.preventDefault();
      const totalAmount = expFormLocal.items.reduce((s, item) => s + ((parseFloat(item.qty) || 1) * (parseFloat(item.price) || 0)), 0);
      if (totalAmount <= 0) {
        showToast?.(isAr ? '⚠️ कम से कम एक आइटम डालें' : '⚠️ Please add at least one item');
        return;
      }

      try {
        const payload = {
          expense_date: expFormLocal.expense_date,
          expense_type: expFormLocal.expense_type,
          description: expFormLocal.description,
          payment_mode: expFormLocal.payment_mode,
          vendor_name: expFormLocal.vendor_name,
          amount: totalAmount,
          total_amount: totalAmount,
          items: expFormLocal.items,
          approval_status: expFormLocal.approval_status,
          tenant_id: userProfile?.tenant_id
        };

        let result;
        if (editingExpId) {
          const { data: up, error } = await supabase
            .from('expenses')
            .update(payload)
            .eq('id', editingExpId)
            .select()
            .single();
          if (error) throw error;
          result = up;
          setData(prev => ({
            ...prev,
            expenses: prev.expenses.map(ex => ex.id === editingExpId ? up : ex)
          }));
          showToast?.(isAr ? '✅ अपडेट हो गया' : '✅ Updated!');
          setEditingExpId(null);
        } else {
          const { data: nExp, error } = await supabase
            .from('expenses')
            .insert([payload])
            .select()
            .single();
          if (error) throw error;
          result = nExp;
          setData(prev => ({
            ...prev,
            expenses: [nExp, ...prev.expenses]
          }));
          showToast?.(isAr ? '✅ खर्चा जोड़ा गया' : '✅ Expense added!');
        }

        setExpFormLocal({
          expense_type: 'Office Expense',
          payment_mode: 'Cash',
          description: '',
          expense_date: today,
          vendor_name: '',
          items: [{ name: '', qty: 1, price: 0 }],
          approval_status: 'Approved'
        });
        fetchAll?.();
      } catch (err) {
        showToast?.(isAr ? '❌ त्रुटि: ' + err.message : '❌ Error: ' + err.message);
      }
    };

    const handleDeleteExpenseLocal = async (exp) => {
      if (!confirm(isAr ? 'क्या आप इस खर्च को हटाना चाहते हैं?' : 'Delete this expense?')) return;
      try {
        await supabase.from('expenses').delete().eq('id', exp.id);
        setData(prev => ({
          ...prev,
          expenses: prev.expenses.filter(ex => ex.id !== exp.id)
        }));
        showToast?.(isAr ? '✅ हटा दिया' : '✅ Deleted');
      } catch (err) {
        showToast?.(isAr ? '❌ त्रुटि: ' + err.message : '❌ Error: ' + err.message);
      }
    };

    const handlePreviewExpense = (exp) => {
      const html = getExpenseHTML?.(exp, data.settings, lang);
      if (!html) return showToast?.(isAr ? '❌ HTML नहीं बना' : '❌ HTML not generated');
      setPreviewHTML?.(html);
      setModal?.({ type: 'preview', data: exp });
    };

    const handleDownloadExpensePDF = async (exp) => {
      const html = getExpenseHTML?.(exp, data.settings, lang);
      if (!html) return showToast?.(isAr ? '❌ HTML नहीं बना' : '❌ HTML not generated');
      await downloadPDF?.(html, `Expense_${exp.id || 'voucher'}.pdf`);
    };

    const handleEditExpense = (exp) => {
      setEditingExpId(exp.id);
      setExpFormLocal({
        expense_type: exp.expense_type || 'Office Expense',
        payment_mode: exp.payment_mode || 'Cash',
        description: exp.description || '',
        expense_date: exp.expense_date || today,
        vendor_name: exp.vendor_name || '',
        items: exp.items || [{ name: '', qty: 1, price: 0 }],
        approval_status: exp.approval_status || 'Approved'
      });
    };

    const filtered = (data.expenses || []).filter(e =>
      !searchTerm ||
      e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.expense_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(e => !dateFilter || e.expense_date === dateFilter);

    const totalExp = filtered.reduce((s, e) => s + (e.amount || 0), 0);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>💸 {t('expenses', 'Expenses')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 खर्चा खोजें...' : '🔍 Search expenses...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <input
              type="date"
              style={styles.input}
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>💸 {isAr ? 'कुल खर्च' : 'Total Expenses'}</div>
            <div style={{ ...styles.statValue, color: '#EF4444' }}>{fmt(totalExp)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>📄 {isAr ? 'संख्या' : 'Count'}</div>
            <div style={styles.statValue}>{filtered.length}</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{editingExpId ? '✏️ ' + (isAr ? 'संपादित करें' : 'Edit') : '📝 ' + (isAr ? 'नया खर्चा' : 'Add New Expense')}</h3>
          <form onSubmit={handleExpenseSubmit} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'तारीख' : 'Date'}</label>
              <input type="date" style={styles.input} value={expFormLocal.expense_date} onChange={e => setExpFormLocal({ ...expFormLocal, expense_date: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'प्रकार' : 'Type'}</label>
              <select style={styles.select} value={expFormLocal.expense_type} onChange={e => setExpFormLocal({ ...expFormLocal, expense_type: e.target.value })}>
                <option>Office Expense</option>
                <option>Travel Expense</option>
                <option>Supplies</option>
                <option>Utilities</option>
                <option>Rent</option>
                <option>Salary</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'विक्रेता' : 'Vendor'}</label>
              <input style={styles.input} value={expFormLocal.vendor_name} onChange={e => setExpFormLocal({ ...expFormLocal, vendor_name: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'भुगतान विधि' : 'Payment'}</label>
              <select style={styles.select} value={expFormLocal.payment_mode} onChange={e => setExpFormLocal({ ...expFormLocal, payment_mode: e.target.value })}>
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Card</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.formLabel}>{isAr ? 'विवरण' : 'Description'}</label>
              <input style={styles.input} value={expFormLocal.description} onChange={e => setExpFormLocal({ ...expFormLocal, description: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.formLabel}>{isAr ? 'आइटम' : 'Items'}</label>
              {expFormLocal.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                  <input style={{ ...styles.input, flex: 2 }} placeholder={isAr ? 'आइटम नाम' : 'Item name'} value={item.name} onChange={e => handleExpItemChangeLocal(idx, 'name', e.target.value)} />
                  <input type="number" style={{ ...styles.input, flex: 1 }} placeholder={isAr ? 'मात्रा' : 'Qty'} value={item.qty} onChange={e => handleExpItemChangeLocal(idx, 'qty', e.target.value)} min="1" />
                  <input type="number" step="0.01" style={{ ...styles.input, flex: 1 }} placeholder={isAr ? 'कीमत' : 'Price'} value={item.price} onChange={e => handleExpItemChangeLocal(idx, 'price', e.target.value)} min="0" />
                  {expFormLocal.items.length > 1 && (
                    <button type="button" style={{ ...styles.btn, ...styles.btnDanger, padding: '6px 12px' }} onClick={() => handleRemoveExpItemLocal(idx)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" style={{ ...styles.btn, ...styles.btnGhost, padding: '6px 12px' }} onClick={handleAddExpItemLocal}>
                ➕ {isAr ? 'आइटम जोड़ें' : 'Add Item'}
              </button>
              <div style={{ marginTop: '10px', padding: '10px', background: isDark ? '#0F172A' : '#F1F5F9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>{isAr ? 'कुल' : 'Total'}</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>
                  {expFormLocal.items.reduce((s, item) => s + ((parseFloat(item.qty) || 1) * (parseFloat(item.price) || 0)), 0).toFixed(2)} SAR
                </span>
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, padding: '12px 30px' }}>
                {editingExpId ? '💾 ' + (isAr ? 'अपडेट करें' : 'Update') : '✅ ' + (isAr ? 'खर्चा जोड़ें' : 'Add Expense')}
              </button>
              {editingExpId && (
                <button type="button" style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setEditingExpId(null); setExpFormLocal({ expense_type: 'Office Expense', payment_mode: 'Cash', description: '', expense_date: today, vendor_name: '', items: [{ name: '', qty: 1, price: 0 }], approval_status: 'Approved' }); }}>
                  ✕ {isAr ? 'रद्द करें' : 'Cancel'}
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>📅 Date</th>
                  <th style={styles.th}>📋 Type</th>
                  <th style={styles.th}>🏢 Vendor</th>
                  <th style={styles.th}>📝 Description</th>
                  <th style={styles.th}>💳 Payment</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>💰 Amount</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td style={styles.td}>{e.expense_date || '-'}</td>
                    <td style={styles.td}>{e.expense_type || '-'}</td>
                    <td style={styles.td}>{e.vendor_name || '-'}</td>
                    <td style={styles.td}>{e.description || '-'}</td>
                    <td style={styles.td}>{e.payment_mode || 'Cash'}</td>
                    <td style={{ ...styles.tdRight, color: '#EF4444' }}>{fmt(e.amount)}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }} onClick={() => handlePreviewExpense(e)} title={isAr ? 'पूर्वावलोकन' : 'Preview'}>👁️</button>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleDownloadExpensePDF(e)} title={isAr ? 'डाउनलोड' : 'Download'}>⬇️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEF3C7', color: '#92400E' }} onClick={() => handleEditExpense(e)} title={isAr ? 'संपादित करें' : 'Edit'}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteExpenseLocal(e)} title={isAr ? 'हटाएं' : 'Delete'}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'कोई खर्चा नहीं' : 'No expenses found'}
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
  // CREDIT
  // ============================================================
  if (page === 'credit') {
    const withCredit = (data.customers || []).filter(c => (c.store_credit || 0) > 0);
    const totalCredit = withCredit.reduce((s, c) => s + (c.store_credit || 0), 0);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>💳 {t('credit', 'Credit Balances')}</h1>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>👤 {isAr ? 'عملاء مع رصيد' : 'Customers with Credit'}</div>
            <div style={styles.statValue}>{withCredit.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>💰 {isAr ? 'إجمالي الرصيد' : 'Total Credit'}</div>
            <div style={{ ...styles.statValue, color: '#8B5CF6' }}>{fmt(totalCredit)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>👤 Customer</th>
                  <th style={styles.th}>📞 Phone</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>💰 Credit Balance</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>💳 Credit Limit</th>
                </tr>
              </thead>
              <tbody>
                {withCredit.map(c => (
                  <tr key={c.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td>
                    <td style={styles.td}>{c.phone || '-'}</td>
                    <td style={{ ...styles.tdRight, color: '#8B5CF6', fontWeight: 700 }}>{fmt(c.store_credit)}</td>
                    <td style={styles.tdRight}>{fmt(c.credit_limit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // STAFF MISTAKES
  // ============================================================
  if (page === 'staff_mistakes') {
    const [mistakeForm, setMistakeForm] = useState({
      employee_id: '',
      old_ticket_no: '',
      new_ticket_no: '',
      loss_amount: 0,
      paid_by_employee: false,
      reason: '',
      date: today
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleMistakeSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          ...mistakeForm,
          tenant_id: userProfile?.tenant_id,
          loss_amount: parseFloat(mistakeForm.loss_amount) || 0
        };

        let result;
        if (editingId) {
          const { data: up, error } = await supabase
            .from('staff_mistakes')
            .update(payload)
            .eq('id', editingId)
            .select('*, employees(name)')
            .single();
          if (error) throw error;
          result = up;
          setData(prev => ({
            ...prev,
            staffMistakes: prev.staffMistakes.map(m => m.id === editingId ? up : m)
          }));
          showToast?.(isAr ? '✅ अपडेट हो गया' : '✅ Updated!');
          setEditingId(null);
        } else {
          const { data: newM, error } = await supabase
            .from('staff_mistakes')
            .insert([payload])
            .select('*, employees(name)')
            .single();
          if (error) throw error;
          result = newM;
          setData(prev => ({
            ...prev,
            staffMistakes: [newM, ...(prev.staffMistakes || [])]
          }));
          showToast?.(isAr ? '✅ मिस्टेक लॉग हो गया' : '✅ Mistake Logged!');
        }

        setMistakeForm({
          employee_id: '',
          old_ticket_no: '',
          new_ticket_no: '',
          loss_amount: 0,
          paid_by_employee: false,
          reason: '',
          date: today
        });
        fetchAll?.();
      } catch (err) {
        showToast?.(isAr ? '❌ त्रुटि: ' + err.message : '❌ Error: ' + err.message);
      }
    };

    const handlePreviewMistakeLocal = (m) => {
      const html = getMistakeHTML?.(m, data.settings, lang);
      if (!html) return showToast?.(isAr ? '❌ HTML नहीं बना' : '❌ HTML not generated');
      setPreviewHTML?.(html);
      setModal?.({ type: 'preview', data: m });
    };

    const handleDownloadMistakePDF = async (m) => {
      const html = getMistakeHTML?.(m, data.settings, lang);
      if (!html) return showToast?.(isAr ? '❌ HTML नहीं बना' : '❌ HTML not generated');
      await downloadPDF?.(html, `Mistake_${m.id || 'voucher'}.pdf`);
    };

    const handleDeleteMistakeLocal = async (m) => {
      if (!confirm(isAr ? 'क्या आप हटाना चाहते हैं?' : 'Delete?')) return;
      try {
        await supabase.from('staff_mistakes').delete().eq('id', m.id);
        setData(prev => ({
          ...prev,
          staffMistakes: prev.staffMistakes.filter(x => x.id !== m.id)
        }));
        showToast?.(isAr ? '✅ हटा दिया' : '✅ Deleted');
      } catch (err) {
        showToast?.(isAr ? '❌ त्रुटि: ' + err.message : '❌ Error: ' + err.message);
      }
    };

    const handleEditMistake = (m) => {
      setEditingId(m.id);
      setMistakeForm({
        employee_id: m.employee_id || '',
        old_ticket_no: m.old_ticket_no || '',
        new_ticket_no: m.new_ticket_no || '',
        loss_amount: m.loss_amount || 0,
        paid_by_employee: m.paid_by_employee || false,
        reason: m.reason || '',
        date: m.date || today
      });
    };

    const totalLoss = (data.staffMistakes || []).reduce((s, m) => s + (m.loss_amount || 0), 0);
    const paidByEmp = (data.staffMistakes || []).filter(m => m.paid_by_employee).reduce((s, m) => s + (m.loss_amount || 0), 0);

    const filteredMistakes = (data.staffMistakes || []).filter(m =>
      !searchTerm ||
      m.employees?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.old_ticket_no?.includes(searchTerm) ||
      m.new_ticket_no?.includes(searchTerm)
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚠️ {t('staff_mistakes', 'Staff Mistakes')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 खोजें...' : '🔍 Search...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>⚠️ {isAr ? 'कुल मिस्टेक' : 'Total Mistakes'}</div>
            <div style={styles.statValue}>{data.staffMistakes?.length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>💰 {isAr ? 'कुल नुकसान' : 'Total Loss'}</div>
            <div style={{ ...styles.statValue, color: '#EF4444' }}>{fmt(totalLoss)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>✅ {isAr ? 'कर्मचारी द्वारा भुगतान' : 'Paid by Employee'}</div>
            <div style={{ ...styles.statValue, color: '#059669' }}>{fmt(paidByEmp)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{editingId ? '✏️ ' + (isAr ? 'संपादित करें' : 'Edit') : '⚠️ ' + (isAr ? 'नई मिस्टेक लॉग करें' : 'Log New Mistake')}</h3>
          <form onSubmit={handleMistakeSubmit} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'कर्मचारी' : 'Employee'}</label>
              <select style={styles.select} value={mistakeForm.employee_id} onChange={e => setMistakeForm({ ...mistakeForm, employee_id: e.target.value })} required>
                <option value="">{isAr ? 'चुनें' : 'Select'}</option>
                {(data.employees || []).map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'पुराना टिकट नं.' : 'Old Ticket No'}</label>
              <input style={styles.input} value={mistakeForm.old_ticket_no} onChange={e => setMistakeForm({ ...mistakeForm, old_ticket_no: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'नया टिकट नं.' : 'New Ticket No'}</label>
              <input style={styles.input} value={mistakeForm.new_ticket_no} onChange={e => setMistakeForm({ ...mistakeForm, new_ticket_no: e.target.value })} />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'नुकसान (SAR)' : 'Loss Amount (SAR)'}</label>
              <input type="number" step="0.01" style={styles.input} value={mistakeForm.loss_amount} onChange={e => setMistakeForm({ ...mistakeForm, loss_amount: e.target.value })} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'कारण' : 'Reason'}</label>
              <input style={styles.input} value={mistakeForm.reason} onChange={e => setMistakeForm({ ...mistakeForm, reason: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#CBD5E1' : '#1E293B', fontSize: '13px' }}>
                <input type="checkbox" checked={mistakeForm.paid_by_employee} onChange={e => setMistakeForm({ ...mistakeForm, paid_by_employee: e.target.checked })} />
                {isAr ? 'वेतन से काटें' : 'Deduct from Salary'}
              </label>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnWarning, padding: '12px 30px' }}>
                {editingId ? '💾 ' + (isAr ? 'अपडेट करें' : 'Update') : '⚠️ ' + (isAr ? 'लॉग करें' : 'Log Mistake')}
              </button>
              {editingId && (
                <button type="button" style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setEditingId(null); setMistakeForm({ employee_id: '', old_ticket_no: '', new_ticket_no: '', loss_amount: 0, paid_by_employee: false, reason: '', date: today }); }}>
                  ✕ {isAr ? 'रद्द करें' : 'Cancel'}
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>📅 Date</th>
                  <th style={styles.th}>👤 Employee</th>
                  <th style={styles.th}>🎫 Old Ticket</th>
                  <th style={styles.th}>🎫 New Ticket</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>💰 Loss</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>✅ Paid by Emp?</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMistakes.map(m => (
                  <tr key={m.id} style={{ background: '#FFFBEB' }}>
                    <td style={styles.td}>{m.date}</td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{m.employees?.name || 'N/A'}</td>
                    <td style={styles.td}>{m.old_ticket_no}</td>
                    <td style={styles.td}>{m.new_ticket_no}</td>
                    <td style={{ ...styles.tdRight, fontWeight: 'bold', color: '#EF4444' }}>{fmt(m.loss_amount)}</td>
                    <td style={styles.tdCenter}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: m.paid_by_employee ? '#34D399' : '#94A3B8',
                        background: m.paid_by_employee ? '#065F46' : '#1E293B'
                      }}>
                        {m.paid_by_employee ? (isAr ? 'हाँ' : 'Yes') : (isAr ? 'नहीं' : 'No')}
                      </span>
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }} onClick={() => handlePreviewMistakeLocal(m)} title={isAr ? 'पूर्वावलोकन' : 'Preview'}>👁️</button>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleDownloadMistakePDF(m)} title={isAr ? 'डाउनलोड' : 'Download'}>⬇️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEF3C7', color: '#92400E' }} onClick={() => handleEditMistake(m)} title={isAr ? 'संपादित करें' : 'Edit'}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteMistakeLocal(m)} title={isAr ? 'हटाएं' : 'Delete'}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMistakes.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'कोई मिस्टेक नहीं' : 'No mistakes logged.'}
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
  // AUDIT LOGS
  // ============================================================
  if (page === 'audit') {
    const filtered = (data.auditLogs || []).filter(l =>
      !searchTerm ||
      l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📜 {t('audit', 'Audit Logs')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث في السجلات...' : '🔍 Search logs...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <input
              type="date"
              style={styles.input}
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date/Time</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.filter(l => !dateFilter || l.created_at?.startsWith(dateFilter)).slice(0, 200).map(l => (
                  <tr key={l.id}>
                    <td style={{ ...styles.td, fontSize: '12px', color: '#94A3B8' }}>{new Date(l.created_at).toLocaleString()}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#60A5FA' }}>{l.user_email || 'Unknown'}</td>
                    <td style={styles.td}>{l.action}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد سجلات تدقيق' : 'No audit logs found'}
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
  // USERS
  // ============================================================
  if (page === 'users') {
    const perms = ['is_admin', 'can_access_invoices', 'can_access_bank', 'can_access_hr', 'can_access_reports', 'can_access_settings'];
    const permLabels = {
      is_admin: 'Admin',
      can_access_invoices: 'Invoices',
      can_access_bank: 'Bank',
      can_access_hr: 'HR',
      can_access_reports: 'Reports',
      can_access_settings: 'Settings'
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>👥 {t('users', 'Users')}</h1>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{editUserId ? '✏️ Edit User' : '➕ Add User'}</h3>
          <form onSubmit={handleAddEditUser} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>Email {editUserId && '(cannot change)'}</label>
              <input type="email" style={styles.input} value={userForm?.email || ''} disabled={!!editUserId} onChange={e => setUserForm(prev => ({ ...prev, email: e.target.value }))} required />
            </div>
            <div>
              <label style={styles.formLabel}>Username</label>
              <input style={styles.input} value={userForm?.username || ''} onChange={e => setUserForm(prev => ({ ...prev, username: e.target.value }))} />
            </div>
            <div>
              <label style={styles.formLabel}>Link to Employee (for attendance)</label>
              <select style={styles.select} value={userForm?.employee_id || ''} onChange={e => setUserForm(prev => ({ ...prev, employee_id: e.target.value }))}>
                <option value="">— None —</option>
                {(data.employees || []).map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {perms.map(p => (
                <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#CBD5E1' : '#1E293B', fontSize: '13px' }}>
                  <input type="checkbox" checked={!!userForm?.[p]} onChange={e => setUserForm(prev => ({ ...prev, [p]: e.target.checked }))} />
                  {permLabels[p]}
                </label>
              ))}
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnSuccess }}>{editUserId ? '💾 Save Changes' : '➕ Create User'}</button>
              {editUserId && (
                <button type="button" style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setEditUserId(null); setUserForm({ email: '', username: '', is_admin: false, can_access_hr: false, can_access_bank: false, can_access_invoices: true, can_access_reports: false, can_access_settings: false, employee_id: '' }); }}>
                  ✕ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Linked Employee</th>
                  <th style={styles.th}>Permissions</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {(data.appUsers || []).map(u => (
                  <tr key={u.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{u.email}</td>
                    <td style={styles.td}>{u.username || '-'}</td>
                    <td style={styles.td}>{data.employees?.find(e => e.id === u.employee_id)?.name || '-'}</td>
                    <td style={styles.td}>{perms.filter(p => u[p]).map(p => permLabels[p]).join(', ') || '-'}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditUser(u)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteUser(u)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(data.appUsers || []).length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا يوجد مستخدمين' : 'No users yet'}
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
  // REPORTS
  // ============================================================
  if (page === 'reports') {
    const totalRev = (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')).reduce((s, i) => s + (i.total || 0), 0);
    const totalExp = (data.expenses || []).reduce((s, e) => s + (e.amount || 0), 0);
    const totalProfit = (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')).reduce((s, i) => s + (i.profit || 0), 0);
    const netProfit = totalProfit - totalExp;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📊 {t('reports', 'Reports')}</h1>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(totalRev)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي المصروفات' : 'Total Expenses'}</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(totalExp)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'ربح الفواتير' : 'Invoice Profit'}</div>
            <div style={{ ...styles.statValue, color: '#FBBF24' }}>{fmt(totalProfit)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'صافي الربح' : 'Net Profit'}</div>
            <div style={{ ...styles.statValue, color: netProfit >= 0 ? '#34D399' : '#FCA5A5' }}>{fmt(netProfit)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'الفواتير' : 'Invoices'}</div>
            <div style={styles.statValue}>{data.invoices?.filter(i => !i.invoice_no?.startsWith('REF-')).length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'الاسترجاعات' : 'Refunds'}</div>
            <div style={styles.statValue}>{data.invoices?.filter(i => i.invoice_no?.startsWith('REF-')).length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'العملاء' : 'Customers'}</div>
            <div style={styles.statValue}>{data.customers?.length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>{isAr ? 'الموظفين' : 'Employees'}</div>
            <div style={styles.statValue}>{data.employees?.length || 0}</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📈 {isAr ? 'الإيرادات حسب نوع الخدمة' : 'Revenue by Service Type'}</h3>
          {(() => {
            const byService = {};
            (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')).forEach(i => {
              const svc = i.service_type || 'Other';
              byService[svc] = (byService[svc] || 0) + (i.total || 0);
            });
            const entries = Object.entries(byService).sort((a, b) => b[1] - a[1]);
            return entries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#94A3B8' }}>
                {isAr ? 'لا توجد بيانات' : 'No data available'}
              </div>
            ) : (
              entries.map(([svc, amt]) => (
                <div key={svc} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9' }}>
                  <span style={{ color: isDark ? '#CBD5E1' : '#1E293B' }}>{svc}</span>
                  <span style={{ color: '#34D399', fontWeight: 600 }}>{fmt(amt)}</span>
                </div>
              ))
            );
          })()}
        </div>
      </div>
    );
  }

  // ============================================================
  // STATEMENTS
  // ============================================================
  if (page === 'statements') {
    const tabs = ['sales', 'portals', 'vendors', 'salary', 'expenses', 'customers', 'creditors', 'credit', 'branches', 'cash', 'bank'];

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📑 {t('statements', 'Statements')}</h1>
        </div>

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
            {statementType === 'sales' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Invoice</th><th style={styles.th}>Customer</th><th style={{ ...styles.th, textAlign: 'right' }}>Total</th><th style={{ ...styles.th, textAlign: 'right' }}>Due</th></tr></thead>
                <tbody>
                  {(data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')).map(i => (
                    <tr key={i.id}><td style={styles.td}>{i.invoice_date}</td><td style={{ ...styles.td, color: '#60A5FA' }}>{i.invoice_no}</td><td style={styles.td}>{i.customers?.name || 'N/A'}</td><td style={styles.tdRight}>{fmt(i.total)}</td><td style={styles.tdRight}>{fmt(i.due_amount)}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
            {statementType === 'portals' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Portal</th><th style={{ ...styles.th, textAlign: 'right' }}>Balance (SAR)</th></tr></thead>
                <tbody>{(data.portals || []).map(p => <tr key={p.id}><td style={{ ...styles.td, fontWeight: 600 }}>{p.name}</td><td style={{ ...styles.tdRight, color: (p.current_balance || 0) < 0 ? '#FCA5A5' : '#34D399' }}>{fmt(p.current_balance)}</td></tr>)}</tbody>
              </table>
            )}
            {statementType === 'vendors' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Vendor</th><th style={styles.th}>Phone</th><th style={{ ...styles.th, textAlign: 'right' }}>Balance</th></tr></thead>
                <tbody>{(data.vendors || []).map(v => <tr key={v.id}><td style={{ ...styles.td, fontWeight: 600 }}>{v.name}</td><td style={styles.td}>{v.phone}</td><td style={{ ...styles.tdRight }}>{fmt(v.balance)}</td></tr>)}</tbody>
              </table>
            )}
            {statementType === 'salary' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Employee</th><th style={styles.th}>Month</th><th style={{ ...styles.th, textAlign: 'right' }}>Amount</th><th style={styles.th}>Mode</th></tr></thead>
                <tbody>{(data.payroll || []).map(p => <tr key={p.id}><td style={{ ...styles.td, fontWeight: 600 }}>{p.employees?.name || 'N/A'}</td><td style={styles.td}>{p.month}</td><td style={{ ...styles.tdRight, color: '#34D399' }}>{fmt(p.amount)}</td><td style={styles.td}>{p.payment_mode || 'Cash'}</td></tr>)}</tbody>
              </table>
            )}
            {statementType === 'expenses' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Description</th><th style={{ ...styles.th, textAlign: 'right' }}>Amount</th></tr></thead>
                <tbody>{(data.expenses || []).map(e => <tr key={e.id}><td style={styles.td}>{e.expense_date}</td><td style={styles.td}>{e.expense_type}</td><td style={styles.td}>{e.description}</td><td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(e.amount)}</td></tr>)}</tbody>
              </table>
            )}
            {statementType === 'customers' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Phone</th><th style={{ ...styles.th, textAlign: 'right' }}>Credit</th></tr></thead>
                <tbody>{(data.customers || []).map(c => <tr key={c.id}><td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td><td style={styles.td}>{c.phone}</td><td style={{ ...styles.tdRight }}>{fmt(c.store_credit)}</td></tr>)}</tbody>
              </table>
            )}
            {statementType === 'creditors' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Phone</th><th style={styles.th}>Address</th></tr></thead>
                <tbody>{(data.creditors || []).map(c => <tr key={c.id}><td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td><td style={styles.td}>{c.phone}</td><td style={styles.td}>{c.address}</td></tr>)}</tbody>
              </table>
            )}
            {statementType === 'credit' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Name</th><th style={{ ...styles.th, textAlign: 'right' }}>Available Credit</th></tr></thead>
                <tbody>{(data.customers || []).filter(c => (c.store_credit || 0) > 0).map(c => <tr key={c.id}><td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td><td style={{ ...styles.tdRight, color: '#34D399', fontWeight: 'bold' }}>{fmt(c.store_credit)}</td></tr>)}</tbody>
              </table>
            )}
            {statementType === 'branches' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Location</th><th style={styles.th}>Manager</th></tr></thead>
                <tbody>{(data.branches || []).map(b => <tr key={b.id}><td style={{ ...styles.td, fontWeight: 600 }}>{b.name}</td><td style={styles.td}>{b.location}</td><td style={styles.td}>{b.manager}</td></tr>)}</tbody>
              </table>
            )}
            {statementType === 'cash' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Description</th><th style={{ ...styles.th, textAlign: 'right' }}>Amount</th></tr></thead>
                <tbody>{(data.cashbook || []).filter(c => c.type?.includes('Cash')).map(c => <tr key={c.id}><td style={styles.td}>{c.trans_date}</td><td style={styles.td}>{c.description}</td><td style={{ ...styles.tdRight, color: c.type?.includes('In') ? '#34D399' : '#FCA5A5' }}>{fmt(c.amount)}</td></tr>)}</tbody>
              </table>
            )}
            {statementType === 'bank' && (
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Description</th><th style={{ ...styles.th, textAlign: 'right' }}>Amount</th></tr></thead>
                <tbody>{(data.cashbook || []).filter(c => c.type?.includes('Bank')).map(c => <tr key={c.id}><td style={styles.td}>{c.trans_date}</td><td style={styles.td}>{c.description}</td><td style={{ ...styles.tdRight, color: c.type?.includes('In') ? '#34D399' : '#FCA5A5' }}>{fmt(c.amount)}</td></tr>)}</tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
