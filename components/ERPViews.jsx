'use client';
import { useState, useMemo } from 'react';

export default function ERPViews(props) {
  const {
    page, data, lang, tr, modal, setModal, setPage,
    handleEditInvoice, handleDeleteInvoice, openPreview, openRefundModal,
    handleQuickSettle, handleDownloadPDF, printInvoice, shareWhatsApp, shareEmail,
    handleEditCust, handleDelete, handleEditCorp, handleEditCred, handleEditVend,
    handleEditPkg, handleEditBrn, handleEditEmp, handleEditExp,
    handleDeletePayroll, handleGenerateSlip, handlePreviewMistake, handleDeleteMistake
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

  // ═══ STYLES ═══
  const styles = {
    container: { padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' },
    card: { background: '#1E293B', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #334155' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '10px' },
    searchBox: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
    input: { padding: '10px 15px', background: '#0F172A', border: '1px solid #475569', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', outline: 'none', minWidth: '200px' },
    select: { padding: '10px 15px', background: '#0F172A', border: '1px solid #475569', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', outline: 'none' },
    btn: { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' },
    btnPrimary: { background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff' },
    btnSuccess: { background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff' },
    btnDanger: { background: 'linear-gradient(135deg, #DC2626, #B91C1C)', color: '#fff' },
    btnWarning: { background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0F172A' },
    btnGhost: { background: 'transparent', border: '1px solid #475569', color: '#94A3B8' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: { padding: '12px', background: '#0F172A', color: '#FBBF24', textAlign: 'left', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #334155' },
    td: { padding: '12px', borderBottom: '1px solid #1E293B', color: '#CBD5E1' },
    tdRight: { padding: '12px', borderBottom: '1px solid #1E293B', color: '#CBD5E1', textAlign: 'right', fontWeight: '600' },
    tdCenter: { padding: '12px', borderBottom: '1px solid #1E293B', color: '#CBD5E1', textAlign: 'center' },
    badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    badgePaid: { background: '#065F46', color: '#34D399' },
    badgeUnpaid: { background: '#78350F', color: '#FBBF24' },
    badgeRefunded: { background: '#7F1D1D', color: '#FCA5A5' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' },
    statCard: { background: 'linear-gradient(135deg, #1E293B, #0F172A)', padding: '20px', borderRadius: '12px', border: '1px solid #334155' },
    statLabel: { fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statValue: { fontSize: '24px', fontWeight: '700', color: '#FBBF24', marginTop: '5px' },
    pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', padding: '10px 0' },
    pageBtn: { padding: '8px 15px', background: '#1E293B', border: '1px solid #475569', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer' },
    emptyState: { textAlign: 'center', padding: '60px 20px', color: '#64748B' },
    emptyIcon: { fontSize: '60px', marginBottom: '15px' },
    actionsCell: { display: 'flex', gap: '5px', flexWrap: 'wrap' },
    actionBtn: { padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }
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
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Invoices</div>
            <div style={styles.statValue}>{filteredInvoices.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Revenue</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(totalRevenue)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Paid</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(totalPaid)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Due</div>
            <div style={{ ...styles.statValue, color: totalDue > 0 ? '#FCA5A5' : '#34D399' }}>{fmt(totalDue)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Profit</div>
            <div style={{ ...styles.statValue, color: '#FBBF24' }}>{fmt(totalProfit)}</div>
          </div>
        </div>

        <div style={styles.card}>
          {paginate(filteredInvoices).length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📄</div>
              <h3>No Invoices Found</h3>
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
                    <tr key={inv.id} style={{ background: inv.status === 'Unpaid' ? 'rgba(251,191,36,0.03)' : 'transparent' }}>
                      <td style={{ ...styles.td, fontWeight: '700', color: '#60A5FA' }}>{inv.invoice_no}</td>
                      <td style={styles.td}>{inv.invoice_date}</td>
                      <td style={styles.td}>{inv.customers?.name || inv.corporates?.name || 'N/A'}</td>
                      <td style={styles.td}>{inv.airline || '-'}</td>
                      <td style={{ ...styles.td, color: '#60A5FA', fontWeight: '600' }}>{inv.pnr || '-'}</td>
                      <td style={styles.td}>{inv.service_type || '-'}</td>
                      <td style={styles.tdRight}>{fmt(inv.total)}</td>
                      <td style={{ ...styles.tdRight, color: inv.due_amount > 0 ? '#FCA5A5' : '#34D399' }}>{fmt(inv.due_amount)}</td>
                      <td style={styles.tdCenter}>
                        <span style={{ ...styles.badge, ...(inv.status === 'Paid' ? styles.badgePaid : styles.badgeUnpaid) }}>
                          {inv.status}
                        </span>
                      </td>
                      <td style={styles.tdCenter}>
                        <div style={styles.actionsCell}>
                          <button style={{ ...styles.actionBtn, background: '#1E3A8A', color: '#93C5FD' }} onClick={() => openPreview(inv)} title="Preview">👁</button>
                          <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditInvoice(inv)} title="Edit">✏️</button>
                          <button style={{ ...styles.actionBtn, background: '#7F1D1D', color: '#FCA5A5' }} onClick={() => openRefundModal(inv)} title="Refund">🔄</button>
                          {inv.due_amount > 0 && (
                            <button style={{ ...styles.actionBtn, background: '#78350F', color: '#FBBF24' }} onClick={() => handleQuickSettle(inv)} title="Settle">💰</button>
                          )}
                          <button style={{ ...styles.actionBtn, background: '#4338CA', color: '#A5B4FC' }} onClick={() => printInvoice(inv)} title="Print">🖨</button>
                          <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDeleteInvoice(inv)} title="Delete">🗑</button>
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
          <div style={{ color: '#94A3B8', fontSize: '13px' }}>
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredInvoices.length)} - {Math.min(currentPage * rowsPerPage, filteredInvoices.length)} of {filteredInvoices.length}
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button style={styles.pageBtn} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</button>
            <span style={{ padding: '8px 15px', background: '#2563EB', borderRadius: '6px', color: '#fff', fontWeight: '600' }}>{currentPage}</span>
            <button style={styles.pageBtn} disabled={currentPage >= totalPages(filteredInvoices)} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
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
          <h1 style={styles.title}>🔄 {t('refunds', 'Refunds')}</h1>
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
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Refunds</div>
            <div style={styles.statValue}>{filteredRefunds.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Refunded to Customers</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(totalRefundAmt)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Refunded to Portals</div>
            <div style={{ ...styles.statValue, color: '#60A5FA' }}>{fmt(totalCompRefund)}</div>
          </div>
        </div>

        <div style={styles.card}>
          {paginate(filteredRefunds).length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔄</div>
              <h3>No Refunds Found</h3>
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
                      <td style={{ ...styles.td, fontWeight: '700', color: '#FCA5A5' }}>{ref.invoice_no}</td>
                      <td style={styles.td}>{ref.refund_date || ref.invoice_date}</td>
                      <td style={styles.td}>{ref.old_customer_name || ref.customers?.name || 'N/A'}</td>
                      <td style={styles.td}>{ref.airline || ref.old_airline || '-'}</td>
                      <td style={{ ...styles.td, color: '#60A5FA' }}>{ref.pnr || ref.old_pnr || '-'}</td>
                      <td style={styles.td}>{ref.refund_reason || '-'}</td>
                      <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(ref.refund_customer)}</td>
                      <td style={{ ...styles.tdRight, color: '#60A5FA' }}>{fmt(ref.refund_company)}</td>
                      <td style={{ ...styles.tdRight }}>{fmt(ref.old_sell_price)}</td>
                      <td style={styles.tdCenter}>
                        <div style={styles.actionsCell}>
                          <button style={{ ...styles.actionBtn, background: '#1E3A8A', color: '#93C5FD' }} onClick={() => openPreview(ref)}>👁</button>
                          <button style={{ ...styles.actionBtn, background: '#4338CA', color: '#A5B4FC' }} onClick={() => printInvoice(ref)}>🖨</button>
                          <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDeleteInvoice(ref)}>🗑</button>
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
          <h1 style={styles.title}>👥 {t('customers', 'Customers')}</h1>
          <div style={styles.searchBox}>
            <input style={styles.input} placeholder="Search customers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Type</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Credit Balance</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Credit Limit</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{c.name}</td>
                  <td style={styles.td}>{c.phone || '-'}</td>
                  <td style={styles.td}>{c.type || 'Individual'}</td>
                  <td style={{ ...styles.tdRight, color: '#A78BFA' }}>{fmt(c.store_credit)}</td>
                  <td style={{ ...styles.tdRight, color: '#60A5FA' }}>{fmt(c.credit_limit)}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditCust(c)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('customers', c.id)}>🗑</button>
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
    const filtered = (data.corporates || []).filter(c => 
      !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏢 {t('corporates', 'Corporates')}</h1>
          <input style={styles.input} placeholder="Search corporates..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>VAT No</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Address</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{c.name}</td>
                  <td style={styles.td}>{c.vat_no || '-'}</td>
                  <td style={styles.td}>{c.phone || '-'}</td>
                  <td style={styles.td}>{c.address || '-'}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditCorp(c)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('corporates', c.id)}>🗑</button>
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
          <h1 style={styles.title}>🚚 {t('vendors', 'Vendors')}</h1>
          <input style={styles.input} placeholder="Search vendors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Balance</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(data.vendors || []).filter(v => !searchTerm || v.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(v => (
                <tr key={v.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{v.name}</td>
                  <td style={styles.td}>{v.phone || '-'}</td>
                  <td style={styles.tdRight}>{fmt(v.balance)}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditVend(v)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('vendors', v.id)}>🗑</button>
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
          <h1 style={styles.title}>💳 {t('creditors', 'Creditors')}</h1>
          <input style={styles.input} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Address</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(data.creditors || []).filter(c => !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                <tr key={c.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{c.name}</td>
                  <td style={styles.td}>{c.phone || '-'}</td>
                  <td style={styles.td}>{c.address || '-'}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditCred(c)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('creditors', c.id)}>🗑</button>
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
          <h1 style={styles.title}>🛫 {t('portals', 'Portals')}</h1>
        </div>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Portals</div>
            <div style={styles.statValue}>{data.portals?.length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Balance</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(totalBalance)}</div>
          </div>
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Type</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Balance</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(data.portals || []).map(p => (
                <tr key={p.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{p.name}</td>
                  <td style={styles.td}>{p.portal_type || '-'}</td>
                  <td style={{ ...styles.tdRight, color: (p.current_balance || 0) < 1000 ? '#FCA5A5' : '#34D399' }}>{fmt(p.current_balance)}</td>
                  <td style={styles.tdCenter}>
                    <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('portals', p.id)}>🗑</button>
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
          <h1 style={styles.title}>📦 {t('packages', 'Packages')}</h1>
          <input style={styles.input} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Price</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Inclusions</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(data.packages || []).filter(p => !searchTerm || p.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                <tr key={p.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{p.name}</td>
                  <td style={styles.tdRight}>{fmt(p.price)}</td>
                  <td style={styles.td}>{p.duration || '-'}</td>
                  <td style={styles.td}>{p.inclusions || '-'}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditPkg(p)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('packages', p.id)}>🗑</button>
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
          <h1 style={styles.title}>🏢 {t('branches', 'Branches')}</h1>
          <input style={styles.input} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Manager</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Timing</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
              </tr>
            </thead>
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
                      <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditBrn(b)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('branches', b.id)}>🗑</button>
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
          <h1 style={styles.title}>👨‍💼 {page === 'hr_advanced' ? t('hr_advanced', 'HR & Payroll') : t('hr', 'Human Resources')}</h1>
          <input style={styles.input} placeholder="Search employees..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Phone</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Salary</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Commission %</th>
                <th style={styles.th}>IQAMA</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
              </tr>
            </thead>
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
                      <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditEmp(e)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('employees', e.id)}>🗑</button>
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
          <h1 style={styles.title}>💸 {t('expenses', 'Expenses')}</h1>
          <div style={styles.searchBox}>
            <input style={styles.input} placeholder="Search expenses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <input type="date" style={styles.input} value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
        </div>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Expenses</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(totalExp)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Count</div>
            <div style={styles.statValue}>{data.expenses?.length || 0}</div>
          </div>
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Payment</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
              </tr>
            </thead>
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
                  <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(e.amount)}</td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => handleEditExp(e)}>✏️</button>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDelete('expenses', e.id)}>🗑</button>
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

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏦 {t('bank', 'Bank & Cash')}</h1>
          <div style={styles.searchBox}>
            <input style={styles.input} placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <input type="date" style={styles.input} value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
            <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="Cash-In">Cash-In</option>
              <option value="Cash-Out">Cash-Out</option>
              <option value="Bank-In">Bank-In</option>
              <option value="Bank-Out">Bank-Out</option>
            </select>
          </div>
        </div>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Cash Balance</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(cashIn - cashOut)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Bank Balance</div>
            <div style={{ ...styles.statValue, color: '#60A5FA' }}>{fmt(bankIn - bankOut)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Cash In</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(cashIn)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Cash Out</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(cashOut)}</div>
          </div>
        </div>
        <div style={styles.card}>
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
              {(data.cashbook || [])
                .filter(c => !searchTerm || c.description?.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter(c => !dateFilter || c.trans_date === dateFilter)
                .filter(c => !statusFilter || c.type === statusFilter)
                .slice(0, 100)
                .map(c => (
                <tr key={c.id}>
                  <td style={styles.td}>{c.trans_date}</td>
                  <td style={styles.tdCenter}>
                    <span style={{ ...styles.badge, background: c.type?.includes('In') ? '#065F46' : '#7F1D1D', color: c.type?.includes('In') ? '#34D399' : '#FCA5A5' }}>
                      {c.type}
                    </span>
                  </td>
                  <td style={styles.td}>{c.description}</td>
                  <td style={{ ...styles.tdRight, color: c.type?.includes('In') ? '#34D399' : '#FCA5A5' }}>
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
          <h1 style={styles.title}>📜 {t('audit', 'Audit Logs')}</h1>
          <div style={styles.searchBox}>
            <input style={styles.input} placeholder="Search logs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <input type="date" style={styles.input} value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date/Time</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {(data.auditLogs || [])
                .filter(l => !searchTerm || l.action?.toLowerCase().includes(searchTerm.toLowerCase()) || l.user_email?.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter(l => !dateFilter || l.created_at?.startsWith(dateFilter))
                .slice(0, 200)
                .map(l => (
                <tr key={l.id}>
                  <td style={{ ...styles.td, fontSize: '12px', color: '#94A3B8' }}>{new Date(l.created_at).toLocaleString()}</td>
                  <td style={{ ...styles.td, fontWeight: '600', color: '#60A5FA' }}>{l.user_email || 'Unknown'}</td>
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
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>👥 {t('users', 'Users')}</h1>
          <input style={styles.input} placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <h3>User Management</h3>
            <p style={{ color: '#94A3B8', maxWidth: '400px', margin: '10px auto', lineHeight: '1.6' }}>
              Users are managed through the SuperAdmin panel. Go to SuperAdmin to create and manage user accounts.
            </p>
            <button style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '15px' }} onClick={() => setPage('superadmin')}>
              Go to SuperAdmin →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ REPORTS ═══
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
            <div style={styles.statLabel}>Total Revenue</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(totalRev)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Expenses</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(totalExp)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Invoice Profit</div>
            <div style={{ ...styles.statValue, color: '#FBBF24' }}>{fmt(totalProfit)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Net Profit</div>
            <div style={{ ...styles.statValue, color: netProfit >= 0 ? '#34D399' : '#FCA5A5' }}>{fmt(netProfit)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Invoices</div>
            <div style={styles.statValue}>{data.invoices?.filter(i => !i.invoice_no?.startsWith('REF-')).length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Refunds</div>
            <div style={styles.statValue}>{data.invoices?.filter(i => i.invoice_no?.startsWith('REF-')).length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Customers</div>
            <div style={styles.statValue}>{data.customers?.length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Employees</div>
            <div style={styles.statValue}>{data.employees?.length || 0}</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ color: '#FBBF24', marginBottom: '15px' }}>📈 Revenue by Service Type</h3>
          {(() => {
            const byService = {};
            (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')).forEach(i => {
              const svc = i.service_type || 'Other';
              byService[svc] = (byService[svc] || 0) + (i.total || 0);
            });
            return Object.entries(byService).sort((a, b) => b[1] - a[1]).map(([svc, amt]) => (
              <div key={svc} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1E293B' }}>
                <span style={{ color: '#CBD5E1' }}>{svc}</span>
                <span style={{ color: '#34D399', fontWeight: '600' }}>{fmt(amt)}</span>
              </div>
            ));
          })()}
        </div>
      </div>
    );
  }

  // ═══ STATEMENTS ═══
  if (page === 'statements') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📑 {t('statements', 'Statements')}</h1>
        </div>
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📑</div>
            <h3>Statements</h3>
            <p style={{ color: '#94A3B8', maxWidth: '400px', margin: '10px auto', lineHeight: '1.6' }}>
              Use Customer Statement or Supplier Statement for detailed account statements.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══ STAFF MISTAKES ═══
  if (page === 'staff_mistakes') {
    const totalLoss = (data.staffMistakes || []).reduce((s, m) => s + (m.loss_amount || 0), 0);
    const paidByEmp = (data.staffMistakes || []).filter(m => m.paid_by_employee).reduce((s, m) => s + (m.loss_amount || 0), 0);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚠️ {t('staff_mistakes', 'Staff Mistakes')}</h1>
          <input style={styles.input} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Mistakes</div>
            <div style={styles.statValue}>{data.staffMistakes?.length || 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Loss</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(totalLoss)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Paid by Employee</div>
            <div style={{ ...styles.statValue, color: '#FBBF24' }}>{fmt(paidByEmp)}</div>
          </div>
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Old Ticket</th>
                <th style={styles.th}>New Ticket</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Loss</th>
                <th style={styles.th}>Paid by Emp?</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(data.staffMistakes || []).filter(m => !searchTerm || m.employees?.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                <tr key={m.id}>
                  <td style={styles.td}>{m.date || '-'}</td>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{m.employees?.name || 'N/A'}</td>
                  <td style={styles.td}>{m.old_ticket_no || '-'}</td>
                  <td style={styles.td}>{m.new_ticket_no || '-'}</td>
                  <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(m.loss_amount)}</td>
                  <td style={styles.tdCenter}>
                    <span style={{ ...styles.badge, background: m.paid_by_employee ? '#065F46' : '#7F1D1D', color: m.paid_by_employee ? '#34D399' : '#FCA5A5' }}>
                      {m.paid_by_employee ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={styles.tdCenter}>
                    <div style={styles.actionsCell}>
                      <button style={{ ...styles.actionBtn, background: '#1E3A8A', color: '#93C5FD' }} onClick={() => handlePreviewMistake(m)}>👁</button>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDeleteMistake(m)}>🗑</button>
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

  // ═══ CREDIT BALANCES ═══
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
            <div style={styles.statLabel}>Customers with Credit</div>
            <div style={styles.statValue}>{withCredit.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Credit</div>
            <div style={{ ...styles.statValue, color: '#A78BFA' }}>{fmt(totalCredit)}</div>
          </div>
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Phone</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Credit Balance</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Credit Limit</th>
              </tr>
            </thead>
            <tbody>
              {withCredit.map(c => (
                <tr key={c.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{c.name}</td>
                  <td style={styles.td}>{c.phone || '-'}</td>
                  <td style={{ ...styles.tdRight, color: '#A78BFA', fontWeight: '700' }}>{fmt(c.store_credit)}</td>
                  <td style={styles.tdRight}>{fmt(c.credit_limit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ CREDIT LIMITS ═══
  if (page === 'credit_limits') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📊 {t('credit_limits', 'Credit Limits')}</h1>
        </div>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Credit Limit</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Used</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Available</th>
              </tr>
            </thead>
            <tbody>
              {(data.creditLimits || []).map(c => {
                const used = c.store_credit || 0;
                const available = (c.credit_limit || 0) - used;
                return (
                  <tr key={c.id}>
                    <td style={{ ...styles.td, fontWeight: '600' }}>{c.name}</td>
                    <td style={styles.tdRight}>{fmt(c.credit_limit)}</td>
                    <td style={{ ...styles.tdRight, color: '#FBBF24' }}>{fmt(used)}</td>
                    <td style={{ ...styles.tdRight, color: available > 0 ? '#34D399' : '#FCA5A5' }}>{fmt(available)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═══ DEFAULT - PAGE NOT FOUND ═══
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🚧</div>
          <h2 style={{ color: '#FBBF24', marginBottom: '10px' }}>Page Under Development</h2>
          <p style={{ color: '#94A3B8' }}>{page}</p>
          <button style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '20px' }} onClick={() => setPage('dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
