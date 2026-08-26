'use client';
import { useState, useMemo } from 'react';

export default function ERPViewsSales(props) {
  const {
    page, data, lang, tr, modal, setModal, setPage,
    handleEditInvoice, handleDeleteInvoice, openPreview, openRefundModal,
    handleQuickSettle, handleDownloadPDF, printInvoice, shareWhatsApp, shareEmail,
    handleEditCust, handleDelete, handleEditCorp, handleEditCred, handleEditVend,
    handleEditPkg, handleEditBrn, handleEditEmp, handleEditExp,
    handleDeletePayroll, handleGenerateSlip, handlePreviewMistake, handleDeleteMistake,
    handleAddEditUser, handleEditUser, handleDeleteUser, userForm, setUserForm,
    editUserId, setEditUserId, handleTransfer, transferForm, setTransferForm
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const t = (key, fallback) => tr?.[key] || fallback || key;

  // ═══ FILTERED INVOICES (Non-Refund) ═══
  const filteredInvoices = useMemo(() => {
    let inv = data.invoices?.filter(i => !i.invoice_no?.startsWith('REF-')) || [];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      inv = inv.filter(i =>
        (i.invoice_no || '').toLowerCase().includes(s) ||
        (i.customers?.name || '').toLowerCase().includes(s) ||
        (i.airline || '').toLowerCase().includes(s) ||
        (i.pnr || '').toLowerCase().includes(s) ||
        (i.ticket_no || '').toLowerCase().includes(s)
      );
    }
    if (dateFilter) inv = inv.filter(i => i.invoice_date === dateFilter);
    if (statusFilter) inv = inv.filter(i => i.status === statusFilter);
    return inv;
  }, [data.invoices, searchTerm, dateFilter, statusFilter]);

  // ═══ FILTERED REFUNDS ═══
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

  // ═══ PAGINATION ═══
  const paginate = (list) => {
    const start = (currentPage - 1) * rowsPerPage;
    return list.slice(start, start + rowsPerPage);
  };

  const totalPages = (list) => Math.ceil((list?.length || 0) / rowsPerPage);

  // ═══ STYLES (COLORFUL & MODERN) ═══
  const styles = {
    container: { padding: '24px', background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 50%, #FFFBEB 100%)', minHeight: '100vh' },
    card: { background: '#FFFFFF', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #F3F4F6' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    title: { fontSize: '26px', fontWeight: '800', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '12px' },
    searchBox: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
    input: { padding: '10px 16px', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '10px', color: '#111827', fontSize: '14px', outline: 'none', minWidth: '200px', transition: 'all 0.2s', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    select: { padding: '10px 16px', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '10px', color: '#111827', fontSize: '14px', outline: 'none' },
    formLabel: { display: 'block', marginBottom: '6px', color: '#374151', fontSize: '13px', fontWeight: '600' },
    btn: { padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    btnPrimary: { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff' },
    btnSuccess: { background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' },
    btnDanger: { background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' },
    btnWarning: { background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' },
    btnGhost: { background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#4B5563', boxShadow: 'none' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' },
    th: { padding: '14px 16px', background: '#F9FAFB', color: '#6B7280', textAlign: 'left', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E5E7EB' },
    td: { padding: '14px 16px', borderBottom: '1px solid #F3F4F6', color: '#374151' },
    tdRight: { padding: '14px 16px', borderBottom: '1px solid #F3F4F6', color: '#374151', textAlign: 'right', fontWeight: '600' },
    tdCenter: { padding: '14px 16px', borderBottom: '1px solid #F3F4F6', color: '#374151', textAlign: 'center' },
    badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
    badgePaid: { background: '#D1FAE5', color: '#065F46' },
    badgeUnpaid: { background: '#FEF3C7', color: '#92400E' },
    badgeRefunded: { background: '#FEE2E2', color: '#991B1B' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
    statCard: { background: '#FFFFFF', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #F3F4F6' },
    statLabel: { fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' },
    statValue: { fontSize: '24px', fontWeight: '800', color: '#111827', marginTop: '5px' },
    pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '10px 0' },
    pageBtn: { padding: '8px 16px', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '8px', color: '#374151', cursor: 'pointer', fontWeight: '600', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    emptyState: { textAlign: 'center', padding: '60px 20px', color: '#6B7280' },
    emptyIcon: { fontSize: '60px', marginBottom: '15px' },
    actionsCell: { display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' },
    actionBtn: { padding: '6px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
  };

  // ═══ FORMAT CURRENCY ═══
  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';

  // ═══ INVOICES LIST ═══
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
            <input style={styles.input} placeholder={t('search', 'Search...')} value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            <input type="date" style={styles.input} value={dateFilter} onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }} />
            <select style={styles.select} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            <select style={styles.select} value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value="25">25 rows</option>
              <option value="50">50 rows</option>
              <option value="100">100 rows</option>
            </select>
            <button style={{ ...styles.btn, ...styles.btnSuccess }} onClick={() => setPage('create')}>+ {t('create', 'Create Invoice')}</button>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #3B82F6' }}>
            <div style={styles.statLabel}>Total Invoices</div>
            <div style={styles.statValue}>{filteredInvoices.length}</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #10B981' }}>
            <div style={styles.statLabel}>Total Revenue</div>
            <div style={{ ...styles.statValue, color: '#059669' }}>{fmt(totalRevenue)}</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #10B981' }}>
            <div style={styles.statLabel}>Paid</div>
            <div style={{ ...styles.statValue, color: '#059669' }}>{fmt(totalPaid)}</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: totalDue > 0 ? '4px solid #EF4444' : '4px solid #10B981' }}>
            <div style={styles.statLabel}>Due</div>
            <div style={{ ...styles.statValue, color: totalDue > 0 ? '#EF4444' : '#059669' }}>{fmt(totalDue)}</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #F59E0B' }}>
            <div style={styles.statLabel}>Profit</div>
            <div style={{ ...styles.statValue, color: '#D97706' }}>{fmt(totalProfit)}</div>
          </div>
        </div>

        <div style={styles.card}>
          {paginate(filteredInvoices).length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📄</div>
              <h3 style={{color:'#374151'}}>No Invoices Found</h3>
              <p>Create an invoice to get started!</p>
              <button style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '15px' }} onClick={() => setPage('create')}>+ Create Invoice</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>{t('invNo', 'Inv No')}</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Airline</th>
                    <th style={styles.th}>PNR</th>
                    <th style={styles.th}>Service</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{t('total', 'Total')}</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{t('due', 'Due')}</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Status</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(filteredInvoices).map(inv => (
                    <tr key={inv.id} style={{ background: inv.status === 'Unpaid' ? '#FFFBEB' : 'transparent' }}>
                      <td style={{ ...styles.td, fontWeight: '700', color: '#2563EB' }}>{inv.invoice_no}</td>
                      <td style={styles.td}>{inv.invoice_date}</td>
                      <td style={styles.td}>{inv.customers?.name || inv.corporates?.name || 'N/A'}</td>
                      <td style={styles.td}>{inv.airline || '-'}</td>
                      <td style={{ ...styles.td, color: '#2563EB', fontWeight: '600' }}>{inv.pnr || '-'}</td>
                      <td style={styles.td}>{inv.service_type || '-'}</td>
                      <td style={styles.tdRight}>{fmt(inv.total)}</td>
                      <td style={{ ...styles.tdRight, color: inv.due_amount > 0 ? '#EF4444' : '#059669' }}>{fmt(inv.due_amount)}</td>
                      <td style={styles.tdCenter}>
                        <span style={{ ...styles.badge, ...(inv.status === 'Paid' ? styles.badgePaid : styles.badgeUnpaid) }}>
                          {inv.status}
                        </span>
                      </td>
                      <td style={styles.tdCenter}>
                        <div style={styles.actionsCell}>
                          <button style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }} onClick={() => openPreview(inv)} title="Preview">👁</button>
                          <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditInvoice(inv)} title="Edit">✏️</button>
                          <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => openRefundModal(inv)} title="Refund">🔄</button>
                          {inv.due_amount > 0 && (
                            <button style={{ ...styles.actionBtn, background: '#FEF3C7', color: '#92400E' }} onClick={() => handleQuickSettle(inv)} title="Settle">💰</button>
                          )}
                          <button style={{ ...styles.actionBtn, background: '#EDE9FE', color: '#5B21B6' }} onClick={() => printInvoice(inv)} title="Print">🖨</button>
                          <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteInvoice(inv)} title="Delete">🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={styles.pagination}>
          <div style={{ color: '#6B7280', fontSize: '13px', fontWeight: '500' }}>
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredInvoices.length)} - {Math.min(currentPage * rowsPerPage, filteredInvoices.length)} of {filteredInvoices.length}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.5 : 1 }} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</button>
            <span style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', borderRadius: '8px', color: '#fff', fontWeight: '700', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' }}>{currentPage}</span>
            <button style={{ ...styles.pageBtn, opacity: currentPage >= totalPages(filteredInvoices) ? 0.5 : 1 }} disabled={currentPage >= totalPages(filteredInvoices)} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ REFUNDS LIST ═══
  if (page === 'refunds') {
    const totalRefundAmt = filteredRefunds.reduce((s, r) => s + (r.refund_customer || 0), 0);
    const totalCompRefund = filteredRefunds.reduce((s, r) => s + (r.refund_company || 0), 0);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#DC2626' }}>🔄 {t('refunds', 'Refunds')}</h1>
          <div style={styles.searchBox}>
            <input style={styles.input} placeholder="Search refunds..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            <select style={styles.select} value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value="25">25 rows</option>
              <option value="50">50 rows</option>
              <option value="100">100 rows</option>
            </select>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #6B7280' }}>
            <div style={styles.statLabel}>Total Refunds</div>
            <div style={styles.statValue}>{filteredRefunds.length}</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #EF4444' }}>
            <div style={styles.statLabel}>Refunded to Customers</div>
            <div style={{ ...styles.statValue, color: '#DC2626' }}>{fmt(totalRefundAmt)}</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #3B82F6' }}>
            <div style={styles.statLabel}>Refunded to Portals</div>
            <div style={{ ...styles.statValue, color: '#2563EB' }}>{fmt(totalCompRefund)}</div>
          </div>
        </div>

        <div style={styles.card}>
          {paginate(filteredRefunds).length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔄</div>
              <h3 style={{color:'#374151'}}>No Refunds Found</h3>
              <p>Click the refund button on any invoice to create one!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Refund No</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Airline</th>
                    <th style={styles.th}>PNR</th>
                    <th style={styles.th}>Reason</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Cust Refund</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Portal Refund</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Original Inv</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(filteredRefunds).map(ref => (
                    <tr key={ref.id}>
                      <td style={{ ...styles.td, fontWeight: '700', color: '#DC2626' }}>{ref.invoice_no}</td>
                      <td style={styles.td}>{ref.refund_date || ref.invoice_date}</td>
                      <td style={styles.td}>{ref.old_customer_name || ref.customers?.name || 'N/A'}</td>
                      <td style={styles.td}>{ref.airline || ref.old_airline || '-'}</td>
                      <td style={{ ...styles.td, color: '#2563EB', fontWeight: '600' }}>{ref.pnr || ref.old_pnr || '-'}</td>
                      <td style={styles.td}>{ref.refund_reason || '-'}</td>
                      <td style={{ ...styles.tdRight, color: '#DC2626' }}>{fmt(ref.refund_customer)}</td>
                      <td style={{ ...styles.tdRight, color: '#2563EB' }}>{fmt(ref.refund_company)}</td>
                      <td style={styles.tdRight}>{fmt(ref.old_sell_price)}</td>
                      <td style={styles.tdCenter}>
                        <div style={styles.actionsCell}>
                          <button style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }} onClick={() => openPreview(ref)}>👁</button>
                          <button style={{ ...styles.actionBtn, background: '#EDE9FE', color: '#5B21B6' }} onClick={() => printInvoice(ref)}>🖨</button>
                          <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteInvoice(ref)}>🗑</button>
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

  // ═══ CUSTOMERS ═══
  if (page === 'customers') {
    const filtered = (data.customers || []).filter(c => 
      !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm)
    );
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#7C3AED' }}>👥 {t('customers', 'Customers')}</h1>
          <input style={{ ...styles.input, maxWidth: '300px' }} placeholder="Search customers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Name</th><th style={styles.th}>Phone</th><th style={styles.th}>Type</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Credit Balance</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Credit Limit</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{c.name}</td>
                  <td style={styles.td}>{c.phone || '-'}</td>
                  <td style={styles.td}>{c.type || 'Individual'}</td>
                  <td style={{ ...styles.tdRight, color: '#7C3AED' }}>{fmt(c.store_credit)}</td>
                  <td style={{ ...styles.tdRight, color: '#2563EB' }}>{fmt(c.credit_limit)}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditCust(c)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('customers', c.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ CORPORATES ═══
  if (page === 'corporates') {
    const filtered = (data.corporates || []).filter(c => !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#0891B2' }}>🏢 {t('corporates', 'Corporates')}</h1>
          <input style={{ ...styles.input, maxWidth: '300px' }} placeholder="Search corporates..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Name</th><th style={styles.th}>VAT No</th><th style={styles.th}>Phone</th><th style={styles.th}>Address</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{c.name}</td>
                  <td style={styles.td}>{c.vat_no || '-'}</td>
                  <td style={styles.td}>{c.phone || '-'}</td>
                  <td style={styles.td}>{c.address || '-'}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditCorp(c)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('corporates', c.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ VENDORS ═══
  if (page === 'vendors') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#D97706' }}>🚚 {t('vendors', 'Vendors')}</h1>
          <input style={{ ...styles.input, maxWidth: '300px' }} placeholder="Search vendors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Name</th><th style={styles.th}>Phone</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Balance</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr></thead>
            <tbody>
              {(data.vendors || []).filter(v => !searchTerm || v.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(v => (
                <tr key={v.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{v.name}</td>
                  <td style={styles.td}>{v.phone || '-'}</td>
                  <td style={styles.tdRight}>{fmt(v.balance)}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditVend(v)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('vendors', v.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ CREDITORS ═══
  if (page === 'creditors') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#6B7280' }}>💳 {t('creditors', 'Creditors')}</h1>
          <input style={{ ...styles.input, maxWidth: '300px' }} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Name</th><th style={styles.th}>Phone</th><th style={styles.th}>Address</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr></thead>
            <tbody>
              {(data.creditors || []).filter(c => !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                <tr key={c.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{c.name}</td>
                  <td style={styles.td}>{c.phone || '-'}</td>
                  <td style={styles.td}>{c.address || '-'}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditCred(c)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('creditors', c.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ PORTALS ═══
  if (page === 'portals') {
    const totalBalance = (data.portals || []).reduce((s, p) => s + (p.current_balance || 0), 0);
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#2563EB' }}>🛫 {t('portals', 'Portals')}</h1>
        </div>
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #3B82F6' }}>
            <div style={styles.statLabel}>Total Portals</div>
            <div style={styles.statValue}>{data.portals?.length || 0}</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #10B981' }}>
            <div style={styles.statLabel}>Total Balance</div>
            <div style={{ ...styles.statValue, color: '#059669' }}>{fmt(totalBalance)}</div>
          </div>
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Name</th><th style={styles.th}>Type</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Balance</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr></thead>
            <tbody>
              {(data.portals || []).map(p => (
                <tr key={p.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{p.name}</td>
                  <td style={styles.td}>{p.portal_type || '-'}</td>
                  <td style={{ ...styles.tdRight, color: (p.current_balance || 0) < 1000 ? '#EF4444' : '#059669' }}>{fmt(p.current_balance)}</td>
                  <td style={styles.tdCenter}>
                    <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('portals', p.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ PACKAGES ═══
  if (page === 'packages') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#059669' }}>📦 {t('packages', 'Packages')}</h1>
          <input style={{ ...styles.input, maxWidth: '300px' }} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Name</th><th style={{ ...styles.th, textAlign: 'right' }}>Price</th><th style={styles.th}>Duration</th><th style={styles.th}>Inclusions</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr></thead>
            <tbody>
              {(data.packages || []).filter(p => !searchTerm || p.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                <tr key={p.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{p.name}</td>
                  <td style={styles.tdRight}>{fmt(p.price)}</td>
                  <td style={styles.td}>{p.duration || '-'}</td>
                  <td style={styles.td}>{p.inclusions || '-'}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditPkg(p)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('packages', p.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ BRANCHES ═══
  if (page === 'branches') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#7C3AED' }}>🏢 {t('branches', 'Branches')}</h1>
          <input style={{ ...styles.input, maxWidth: '300px' }} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Name</th><th style={styles.th}>Location</th><th style={styles.th}>Phone</th><th style={styles.th}>Manager</th><th style={styles.th}>Email</th><th style={styles.th}>Timing</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr></thead>
            <tbody>
              {(data.branches || []).filter(b => !searchTerm || b.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(b => (
                <tr key={b.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{b.name}</td>
                  <td style={styles.td}>{b.location || '-'}</td>
                  <td style={styles.td}>{b.phone || '-'}</td>
                  <td style={styles.td}>{b.manager || '-'}</td>
                  <td style={styles.td}>{b.email || '-'}</td>
                  <td style={styles.td}>{b.timing || '-'}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditBrn(b)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('branches', b.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ EMPLOYEES ═══
  if (page === 'hr' || page === 'hr_advanced') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#0369A1' }}>👨‍💼 {page === 'hr_advanced' ? t('hr_advanced', 'HR & Payroll') : t('hr', 'Human Resources')}</h1>
          <input style={{ ...styles.input, maxWidth: '300px' }} placeholder="Search employees..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Name</th><th style={styles.th}>Role</th><th style={styles.th}>Phone</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Salary</th><th style={{ ...styles.th, textAlign: 'right' }}>Commission %</th><th style={styles.th}>IQAMA</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr></thead>
            <tbody>
              {(data.employees || []).filter(e => !searchTerm || e.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(e => (
                <tr key={e.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{e.name}</td>
                  <td style={styles.td}>{e.role || '-'}</td>
                  <td style={styles.td}>{e.phone || '-'}</td>
                  <td style={styles.tdRight}>{fmt(e.salary)}</td>
                  <td style={styles.tdRight}>{e.commission_rate || 0}%</td>
                  <td style={styles.td}>{e.iqama_no || '-'}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditEmp(e)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('employees', e.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ EXPENSES ═══
  if (page === 'expenses') {
    const totalExp = (data.expenses || []).reduce((s, e) => s + (e.amount || 0), 0);
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#DC2626' }}>💸 {t('expenses', 'Expenses')}</h1>
          <div style={styles.searchBox}>
            <input style={styles.input} placeholder="Search expenses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <input type="date" style={styles.input} value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
        </div>
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #DC2626' }}>
            <div style={styles.statLabel}>Total Expenses</div>
            <div style={{ ...styles.statValue, color: '#DC2626' }}>{fmt(totalExp)}</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #6B7280' }}>
            <div style={styles.statLabel}>Count</div>
            <div style={styles.statValue}>{data.expenses?.length || 0}</div>
          </div>
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Description</th><th style={styles.th}>Payment</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr></thead>
            <tbody>
              {(data.expenses || [])
                .filter(e => !searchTerm || e.description?.toLowerCase().includes(searchTerm.toLowerCase()) || e.expense_type?.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter(e => !dateFilter || e.expense_date === dateFilter)
                .map(e => (
                <tr key={e.id}>
                  <td style={styles.td}>{e.expense_date || '-'}</td>
                  <td style={styles.td}>{e.expense_type || '-'}</td>
                  <td style={styles.td}>{e.description || '-'}</td>
                  <td style={styles.td}>{e.payment_mode || 'Cash'}</td>
                  <td style={{ ...styles.tdRight, color: '#DC2626' }}>{fmt(e.amount)}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#D1FAE5', color: '#065F46' }} onClick={() => handleEditExp(e)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDelete('expenses', e.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ BANK / CASHBOOK ═══
  if (page === 'bank') {
    const cashIn = (data.cashbook || []).filter(c => c.type === 'Cash-In').reduce((s, c) => s + (c.amount || 0), 0);
    const cashOut = (data.cashbook || []).filter(c => c.type === 'Cash-Out').reduce((s, c) => s + (c.amount || 0), 0);
    const bankIn = (data.cashbook || []).filter(c => c.type === 'Bank-In').reduce((s, c) => s + (c.amount || 0), 0);
    const bankOut = (data.cashbook || []).filter(c => c.type === 'Bank-Out').reduce((s, c) => s + (c.amount || 0), 0);
    const investIn = (data.cashbook || []).filter(c => c.type === 'Investor-In').reduce((s, c) => s + (c.amount || 0), 0);
    const investOut = (data.cashbook || []).filter(c => c.type === 'Investor-Out').reduce((s, c) => s + (c.amount || 0), 0);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#059669' }}>🏦 {t('bank', 'Bank & Cash')}</h1>
          <div style={styles.searchBox}>
            <input style={styles.input} placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <input type="date" style={styles.input} value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
            <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="Cash-In">Cash-In</option><option value="Cash-Out">Cash-Out</option>
              <option value="Bank-In">Bank-In</option><option value="Bank-Out">Bank-Out</option>
              <option value="Investor-In">Investor-In</option><option value="Investor-Out">Investor-Out</option>
            </select>
          </div>
        </div>
        
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #059669' }}><div style={styles.statLabel}>Cash Balance</div><div style={{ ...styles.statValue, color: '#059669' }}>{fmt(cashIn - cashOut)}</div></div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #2563EB' }}><div style={styles.statLabel}>Bank Balance</div><div style={{ ...styles.statValue, color: '#2563EB' }}>{fmt(bankIn - bankOut)}</div></div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #7C3AED' }}><div style={styles.statLabel}>Investor Net</div><div style={{ ...styles.statValue, color: '#7C3AED' }}>{fmt(investIn - investOut)}</div></div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #10B981' }}><div style={styles.statLabel}>Cash In</div><div style={{ ...styles.statValue, color: '#10B981' }}>{fmt(cashIn)}</div></div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #EF4444' }}><div style={styles.statLabel}>Cash Out</div><div style={{ ...styles.statValue, color: '#EF4444' }}>{fmt(cashOut)}</div></div>
        </div>

        <div style={styles.card}>
          <h3 style={{ margin: '0 0 16px 0', color: '#374151', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>🔁 Fund Transfer</h3>
          <form onSubmit={handleTransfer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
            <div><label style={styles.formLabel}>From</label><select style={styles.select} value={transferForm.from} onChange={e => setTransferForm(p => ({ ...p, from: e.target.value }))}><option>Cash</option><option>Bank</option><option>Investor</option></select></div>
            <div><label style={styles.formLabel}>To</label><select style={styles.select} value={transferForm.to} onChange={e => setTransferForm(p => ({ ...p, to: e.target.value }))}><option>Cash</option><option>Bank</option><option>Investor</option></select></div>
            <div><label style={styles.formLabel}>Amount (SAR)</label><input type="number" step="0.01" style={styles.input} value={transferForm.amount} onChange={e => setTransferForm(p => ({ ...p, amount: e.target.value }))} required /></div>
            <div><label style={styles.formLabel}>Date</label><input type="date" style={styles.input} value={transferForm.date} onChange={e => setTransferForm(p => ({ ...p, date: e.target.value }))} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={styles.formLabel}>Note</label><input style={styles.input} value={transferForm.description || ''} onChange={e => setTransferForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. deposited daily cash sales to bank" /></div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}><button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>Transfer</button></div>
          </form>
        </div>

        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Description</th><th style={{ ...styles.th, textAlign: 'right' }}>Amount</th></tr></thead>
            <tbody>
              {(data.cashbook || [])
                .filter(c => !searchTerm || c.description?.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter(c => !dateFilter || c.trans_date === dateFilter)
                .filter(c => !statusFilter || c.type === statusFilter)
                .slice(0, 100)
                .map(c => (
                <tr key={c.id}>
                  <td style={styles.td}>{c.trans_date}</td>
                  <td style={styles.tdCenter}>
                    <span style={{ ...styles.badge, background: c.type?.includes('In') ? '#D1FAE5' : '#FEE2E2', color: c.type?.includes('In') ? '#065F46' : '#991B1B' }}>{c.type}</span>
                  </td>
                  <td style={styles.td}>{c.description}</td>
                  <td style={{ ...styles.tdRight, color: c.type?.includes('In') ? '#059669' : '#DC2626', fontWeight: '600' }}>
                    {c.type?.includes('In') ? '+' : '-'}{fmt(c.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ AUDIT LOGS ═══
  if (page === 'audit') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#6B7280' }}>📜 {t('audit', 'Audit Logs')}</h1>
          <div style={styles.searchBox}>
            <input style={styles.input} placeholder="Search logs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <input type="date" style={styles.input} value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>Date/Time</th><th style={styles.th}>User</th><th style={styles.th}>Action</th></tr></thead>
            <tbody>
              {(data.auditLogs || [])
                .filter(l => !searchTerm || l.action?.toLowerCase().includes(searchTerm.toLowerCase()) || l.user_email?.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter(l => !dateFilter || l.created_at?.startsWith(dateFilter))
                .slice(0, 200)
                .map(l => (
                <tr key={l.id}>
                  <td style={{ ...styles.td, fontSize: '12px', color: '#6B7280' }}>{new Date(l.created_at).toLocaleString()}</td>
                  <td style={{ ...styles.td, fontWeight: '600', color: '#2563EB' }}>{l.user_email || 'Unknown'}</td>
                  <td style={styles.td}>{l.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ USERS ═══
  if (page === 'users') {
    const perms = ['is_admin', 'can_access_invoices', 'can_access_bank', 'can_access_hr', 'can_access_reports', 'can_access_settings'];
    const permLabels = { is_admin: 'Admin', can_access_invoices: 'Invoices', can_access_bank: 'Bank', can_access_hr: 'HR', can_access_reports: 'Reports', can_access_settings: 'Settings' };
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#4B5563' }}>👥 {t('users', 'Users')}</h1>
        </div>

        <div style={styles.card}>
          <h3 style={{ margin: '0 0 16px 0', color: '#374151', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>{editUserId ? 'Edit User' : '+ Add User'}</h3>
          <form onSubmit={handleAddEditUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
            <div>
              <label style={styles.formLabel}>Email {editUserId && '(cannot change)'}</label>
              <input type="email" style={{ ...styles.input, background: editUserId ? '#F3F4F6' : '#FFFFFF' }} value={userForm?.email || ''} disabled={!!editUserId}
                onChange={e => setUserForm(prev => ({ ...prev, email: e.target.value }))} required />
            </div>
            <div>
              <label style={styles.formLabel}>Username</label>
              <input style={styles.input} value={userForm?.username || ''}
                onChange={e => setUserForm(prev => ({ ...prev, username: e.target.value }))} />
            </div>
            <div>
              <label style={styles.formLabel}>Link to Employee (for attendance)</label>
              <select style={styles.select} value={userForm?.employee_id || ''}
                onChange={e => setUserForm(prev => ({ ...prev, employee_id: e.target.value }))}>
                <option value="">— None —</option>
                {(data.employees || []).map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', padding: '10px 0', background: '#F9FAFB', borderRadius: '10px', border: '1px dashed #D1D5DB' }}>
              {perms.map(p => (
                <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '14px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#3B82F6' }} checked={!!userForm?.[p]} onChange={e => setUserForm(prev => ({ ...prev, [p]: e.target.checked }))} />
                  {permLabels[p]}
                </label>
              ))}
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>{editUserId ? 'Save Changes' : 'Create User'}</button>
              {editUserId && <button type="button" style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setEditUserId(null); setUserForm({ email: '', username: '', is_admin: false, can_access_hr: false, can_access_bank: false, can_access_invoices: true, can_access_reports: false, can_access_settings: false, employee_id: '' }); }}>Cancel</button>}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Email</th><th style={styles.th}>Username</th><th style={styles.th}>Linked Employee</th>
              <th style={styles.th}>Permissions</th><th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr></thead>
            <tbody>
              {(data.appUsers || []).map(u => (
                <tr key={u.id}>
                  <td style={{ ...styles.td, fontWeight: '600', color: '#2563EB' }}>{u.email}</td>
                  <td style={styles.td}>{u.username || '-'}</td>
                  <td style={styles.td}>{u.employee_id ? (data.employees?.find(e => e.id === u.employee_id)?.name || 'Linked') : '-'}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {u.is_admin && <span style={{ ...styles.badge, background: '#DBEAFE', color: '#1D4ED8' }}>Admin</span>}
                      {u.can_access_invoices && <span style={{ ...styles.badge, background: '#D1FAE5', color: '#065F46' }}>Inv</span>}
                      {u.can_access_bank && <span style={{ ...styles.badge, background: '#EDE9FE', color: '#5B21B6' }}>Bank</span>}
                      {u.can_access_hr && <span style={{ ...styles.badge, background: '#FEF3C7', color: '#92400E' }}>HR</span>}
                      {u.can_access_reports && <span style={{ ...styles.badge, background: '#FEE2E2', color: '#991B1B' }}>Reports</span>}
                      {u.can_access_settings && <span style={{ ...styles.badge, background: '#FCE7F3', color: '#9D174D' }}>Settings</span>}
                    </div>
                  </td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#DBEAFE', color: '#1D4ED8' }} onClick={() => handleEditUser(u)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteUser(u)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ CREDIT BALANCES LIST ═══
  if (page === 'credit') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...styles.title, color: '#7C3AED' }}>💳 {t('credit', 'Credit Balances')}</h1>
          <input style={{ ...styles.input, maxWidth: '300px' }} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Customer</th><th style={styles.th}>Phone</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Used Credit</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Store Credit</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Credit Limit</th>
            </tr></thead>
            <tbody>
              {(data.customers || [])
                .filter(c => (c.store_credit > 0 || c.credit_limit > 0) && (!searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(c => (
                <tr key={c.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{c.name}</td>
                  <td style={styles.td}>{c.phone || '-'}</td>
                  <td style={{ ...styles.tdRight, color: '#EF4444' }}>{fmt(c.store_credit)}</td>
                  <td style={{ ...styles.tdRight, color: '#7C3AED' }}>{fmt(c.store_credit)}</td>
                  <td style={{ ...styles.tdRight, color: '#2563EB' }}>{fmt(c.credit_limit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ DEFAULT FALLBACK ═══
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🚧</div>
          <h3 style={{color:'#374151', fontSize:'18px'}}>View Implementation Pending</h3>
          <p style={{color:'#6B7280'}}>The UI for "{page}" is located in another file. Routing handled by ERPViews.jsx.</p>
        </div>
      </div>
    </div>
  );
}
