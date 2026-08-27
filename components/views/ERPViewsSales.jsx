'use client';

import { useState, useMemo } from 'react';

export default function ERPViewsSales(props) {
  // --- DESTRUCTURE ALL PROPS ---
  const {
    page, data, lang, tr, modal, setModal, setPage,
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
    theme
  } = props;

  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const t = (key, fallback) => tr?.[key] || fallback || key;
  const isAr = lang === 'ar';
  const isDark = theme === 'dark';

  // --- STYLES ---
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
    }
  };

  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';

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

  // ===== FILTERED REFUNDS =====
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

  // ===== PAGINATION =====
  const paginate = (list) => {
    const start = (currentPage - 1) * rowsPerPage;
    return list.slice(start, start + rowsPerPage);
  };

  const totalPages = (list) => Math.ceil((list?.length || 0) / rowsPerPage);

  // ===== BEAUTIFUL ICON HELPERS =====
  const getStatusIcon = (status) => {
    if (status === 'Paid') return '✅';
    if (status === 'Unpaid') return '⏳';
    if (status === 'refunded') return '🔄';
    return '📄';
  };

  // ============================================================
  // INVOICES LIST - WITH WORKING PREVIEW/DOWNLOAD/PRINT
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

        {/* Stats Cards */}
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

        {/* Table */}
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
                    // DEBUG: Check if functions exist
                    console.log('Invoice actions:', {
                      openPreview: typeof openPreview,
                      handleDownloadPDF: typeof handleDownloadPDF,
                      printInvoice: typeof printInvoice
                    });
                    return (
                      <tr key={inv.id} style={{
                        background: inv.status === 'Unpaid' ? 'rgba(245, 158, 11, 0.03)' : 'transparent'
                      }}>
                        <td style={{ ...styles.td, fontWeight: 700, color: '#3B82F6' }}>{inv.invoice_no}</td>
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
                            ...(inv.status === 'Paid' ? styles.badgePaid : inv.status === 'refunded' ? styles.badgeRefunded : styles.badgeUnpaid)
                          }}>
                            {getStatusIcon(inv.status)} {inv.status}
                          </span>
                        </td>
                        <td style={styles.tdCenter}>
                          <div style={styles.actionsCell}>
                            {/* PREVIEW BUTTON - FIXED */}
                            <button
                              style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }}
                              onClick={() => {
                                console.log('Preview clicked for:', inv.invoice_no);
                                if (typeof openPreview === 'function') {
                                  openPreview(inv);
                                } else {
                                  alert('Preview function not available!');
                                }
                              }}
                              title={isAr ? 'معاينة' : 'Preview'}
                            >
                              👁️
                            </button>
                            {/* EDIT BUTTON */}
                            <button
                              style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }}
                              onClick={() => handleEditInvoice(inv)}
                              title={isAr ? 'تعديل' : 'Edit'}
                            >
                              ✏️
                            </button>
                            {/* REFUND BUTTON */}
                            <button
                              style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }}
                              onClick={() => openRefundModal(inv)}
                              title={isAr ? 'استرجاع' : 'Refund'}
                            >
                              🔄
                            </button>
                            {/* SETTLE BUTTON */}
                            {inv.due_amount > 0 && (
                              <button
                                style={{ ...styles.actionBtn, background: '#FEF3C7', color: '#92400E' }}
                                onClick={() => handleQuickSettle(inv)}
                                title={isAr ? 'تسوية' : 'Settle'}
                              >
                                💰
                              </button>
                            )}
                            {/* PRINT BUTTON - FIXED */}
                            <button
                              style={{ ...styles.actionBtn, background: '#EDE9FE', color: '#5B21B6' }}
                              onClick={() => {
                                console.log('Print clicked for:', inv.invoice_no);
                                if (typeof printInvoice === 'function') {
                                  printInvoice(inv);
                                } else {
                                  alert('Print function not available!');
                                }
                              }}
                              title={isAr ? 'طباعة' : 'Print'}
                            >
                              🖨️
                            </button>
                            {/* DOWNLOAD BUTTON - FIXED */}
                            <button
                              style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }}
                              onClick={() => {
                                console.log('Download clicked for:', inv.invoice_no);
                                if (typeof handleDownloadPDF === 'function') {
                                  handleDownloadPDF(inv);
                                } else {
                                  alert('Download function not available!');
                                }
                              }}
                              title={isAr ? 'تحميل' : 'Download'}
                            >
                              ⬇️
                            </button>
                            {/* DELETE BUTTON */}
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

        {/* Pagination */}
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
  // EXPENSES
  // ============================================================
  if (page === 'expenses') {
    const filtered = (data.expenses || []).filter(e =>
      !searchTerm ||
      e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.expense_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalExp = filtered.reduce((s, e) => s + (e.amount || 0), 0);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>💸 {t('expenses', 'Expenses')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث عن مصروف...' : '🔍 Search expenses...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <input
              type="date"
              style={styles.input}
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            />
            <button style={{ ...styles.btn, ...styles.btnSuccess }} onClick={() => setPage('create')}>
              ➕ {isAr ? 'مصروف جديد' : 'New Expense'}
            </button>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>💸 {isAr ? 'إجمالي المصروفات' : 'Total Expenses'}</div>
            <div style={{ ...styles.statValue, color: '#EF4444' }}>{fmt(totalExp)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>📄 {isAr ? 'العدد' : 'Count'}</div>
            <div style={styles.statValue}>{filtered.length}</div>
          </div>
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
                {filtered.filter(e => !dateFilter || e.expense_date === dateFilter).map(e => (
                  <tr key={e.id}>
                    <td style={styles.td}>{e.expense_date || '-'}</td>
                    <td style={styles.td}>{e.expense_type || '-'}</td>
                    <td style={styles.td}>{e.vendor_name || '-'}</td>
                    <td style={styles.td}>{e.description || '-'}</td>
                    <td style={styles.td}>{e.payment_mode || 'Cash'}</td>
                    <td style={{ ...styles.tdRight, color: '#EF4444' }}>{fmt(e.amount)}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditExp(e)}>✏️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('expenses', e.id)}>🗑️</button>
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
    const totalLoss = (data.staffMistakes || []).reduce((s, m) => s + (m.loss_amount || 0), 0);
    const paidByEmp = (data.staffMistakes || []).filter(m => m.paid_by_employee).reduce((s, m) => s + (m.loss_amount || 0), 0);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚠️ {t('staff_mistakes', 'Staff Mistakes')}</h1>
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder={isAr ? '🔍 بحث...' : '🔍 Search...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>⚠️ {isAr ? 'إجمالي الأخطاء' : 'Total Mistakes'}</div>
            <div style={styles.statValue}>{data.staffMistakes?.length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>💰 {isAr ? 'إجمالي الخسارة' : 'Total Loss'}</div>
            <div style={{ ...styles.statValue, color: '#EF4444' }}>{fmt(totalLoss)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>✅ {isAr ? 'مدفوع من الموظف' : 'Paid by Employee'}</div>
            <div style={{ ...styles.statValue, color: '#059669' }}>{fmt(paidByEmp)}</div>
          </div>
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
                {(data.staffMistakes || []).filter(m => !searchTerm || m.employees?.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                  <tr key={m.id}>
                    <td style={styles.td}>{m.date || '-'}</td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{m.employees?.name || 'N/A'}</td>
                    <td style={styles.td}>{m.old_ticket_no || '-'}</td>
                    <td style={styles.td}>{m.new_ticket_no || '-'}</td>
                    <td style={{ ...styles.tdRight, color: '#EF4444' }}>{fmt(m.loss_amount)}</td>
                    <td style={styles.tdCenter}>
                      <span style={{ ...styles.badge, background: m.paid_by_employee ? '#D1FAE5' : '#FEE2E2', color: m.paid_by_employee ? '#065F46' : '#991B1B' }}>
                        {m.paid_by_employee ? '✅ Yes' : '❌ No'}
                      </span>
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }} onClick={() => handlePreviewMistake(m)}>👁️</button>
                        <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteMistake(m)}>🗑️</button>
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

  return null;
}
