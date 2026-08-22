'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

const styles = { 
  input: { width: '100%', padding: '12px 15px', margin: '6px 0', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s', fontSize: '14px' }, 
  btnPrimary: { padding: '12px 15px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E293B', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }, 
  btnInfo: { padding: '8px 12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
  card: { background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', marginTop: '12px' },
  tableHeader: { background: '#1E293B', color: 'white', padding: '15px', textAlign: 'start', fontSize: '13px' },
  tableCell: { padding: '15px', borderBottom: '1px solid #F1F5F9', fontSize: '14px' },
  sectionTitle: { fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 15px', paddingBottom: '10px', borderBottom: '2px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }
};

/* ═══════════════════════════════════════════════════════════════
   COMPACT TABLE HELPERS — Only used by list & refunds pages
   ═══════════════════════════════════════════════════════════════ */

const methodColors = {
  'cash': { bg: '#064E3B', text: '#6EE7B7', dot: '#10B981' },
  'card': { bg: '#1E3A5F', text: '#7DD3FC', dot: '#38BDF8' },
  'card / network': { bg: '#1E3A5F', text: '#7DD3FC', dot: '#38BDF8' },
  'bank transfer': { bg: '#3B0764', text: '#C4B5FD', dot: '#8B5CF6' },
  'credit': { bg: '#4C0519', text: '#FDA4AF', dot: '#F43F5E' },
  'credit balance': { bg: '#78350F', text: '#FDE68A', dot: '#F59E0B' },
  'tabby': { bg: '#134E4A', text: '#5EEAD4', dot: '#14B8A6' },
  'tamara': { bg: '#1E3A5F', text: '#93C5FD', dot: '#3B82F6' },
};

const statusStyles = {
  'paid': { bg: '#064E3B', text: '#6EE7B7', border: '#10B981' },
  'unpaid': { bg: '#7F1D1D', text: '#FCA5A5', border: '#EF4444' },
  'partial': { bg: '#78350F', text: '#FDE68A', border: '#F59E0B' },
  'overdue': { bg: '#4C0519', text: '#FDA4AF', border: '#E11D48' },
  'refunded': { bg: '#312E81', text: '#A5B4FC', border: '#6366F1' },
  'cancelled': { bg: '#1F2937', text: '#9CA3AF', border: '#4B5563' },
};

function getMethodColor(method) {
  if (!method) return methodColors['cash'];
  const key = Object.keys(methodColors).find(k => method.toLowerCase().includes(k));
  return methodColors[key] || { bg: '#1F2937', text: '#9CA3AF', dot: '#6B7280' };
}

function getStatusStyle(status) {
  if (!status) return statusStyles['unpaid'];
  const key = Object.keys(statusStyles).find(k => status.toLowerCase().includes(k));
  return statusStyles[key] || statusStyles['unpaid'];
}

function MethodBadge({ method }) {
  const c = getMethodColor(method);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
      backgroundColor: c.bg, color: c.text, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: c.dot, flexShrink: 0 }} />
      {method || 'N/A'}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = getStatusStyle(status);
  return (
    <span style={{
      display: 'inline-block', padding: '1px 7px', borderRadius: '4px',
      fontSize: '10px', fontWeight: 600, letterSpacing: '0.3px',
      backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}33`,
      whiteSpace: 'nowrap',
    }}>
      {status || 'Unpaid'}
    </span>
  );
}

/* ─── Action Dropdown ─── */
function ActionDropdown({ inv, isInvoices, handlers, tr }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const actions = [];
  actions.push({ key: 'preview', label: tr.preview || 'Preview', color: '#60A5FA', icon: '👁' });
  actions.push({ key: 'pdf', label: 'Download PDF', color: '#34D399', icon: '📄' });
  actions.push({ key: 'print', label: tr.print || 'Print', color: '#A78BFA', icon: '🖨' });
  if (isInvoices) {
    actions.push({ key: 'whatsapp', label: 'WhatsApp', color: '#25D366', icon: '🟢' });
    actions.push({ key: 'email', label: 'Email', color: '#38BDF8', icon: '✉️' });
  }
  actions.push({ key: 'edit', label: tr.edit || 'Edit', color: '#FBBF24', icon: '✏️', divider: true });
  if (isInvoices && inv.due_amount > 0) {
    actions.push({ key: 'settle', label: tr.quickSettle || 'Settle', color: '#10B981', icon: '💰' });
  }
  if (isInvoices && inv.status !== 'refunded') {
    actions.push({ key: 'refund', label: tr.refund || 'Refund', color: '#F87171', icon: '↩️' });
  }
  actions.push({ key: 'delete', label: tr.delete || 'Delete', color: '#EF4444', icon: '🗑', divider: true });

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '6px', border: 'none',
          background: open ? '#E2E8F0' : 'transparent', color: '#64748B',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = '#F1F5F9'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', zIndex: 100,
          background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px',
          padding: '4px', minWidth: '175px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          animation: 'fadeSlideDown 0.12s ease-out',
        }}>
          {actions.map((a) => (
            <React.Fragment key={a.key}>
              {a.divider && <div style={{ height: '1px', background: '#F1F5F9', margin: '3px 6px' }} />}
              <button
                onClick={() => {
                  switch (a.key) {
                    case 'preview': handlers.openPreview(inv); break;
                    case 'pdf': handlers.handleDownloadPDF(inv); break;
                    case 'print': handlers.printInvoice(inv); break;
                    case 'whatsapp': handlers.shareWhatsApp(inv); break;
                    case 'email': handlers.shareEmail(inv); break;
                    case 'edit': handlers.handleEditInvoice(inv); break;
                    case 'settle': handlers.handleQuickSettle(inv); break;
                    case 'refund': handlers.openRefundModal(inv); break;
                    case 'delete': handlers.handleDeleteInvoice(inv); break;
                  }
                  setOpen(false);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                  padding: '6px 10px', border: 'none', borderRadius: '5px',
                  background: 'transparent', color: a.color, fontSize: '12px',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '13px', width: '18px', textAlign: 'center' }}>{a.icon}</span>
                {a.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Toast ─── */
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2200); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      background: '#064E3B', color: '#6EE7B7', padding: '10px 18px',
      borderRadius: '8px', fontSize: '13px', fontWeight: 500,
      border: '1px solid #10B98144', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'center', gap: '8px',
      animation: 'fadeSlideUp 0.2s ease-out',
    }}>
      ✓ {message}
    </div>
  );
}

/* ─── Compact Pagination ─── */
function CompactPagination({ currentPage, totalPages, totalItems, pageSize, onPageChange, onPageSizeChange }) {
  const pages = useMemo(() => {
    const arr = [];
    let s = Math.max(1, currentPage - 2);
    let e = Math.min(totalPages, s + 4);
    if (e - s + 1 < 5) s = Math.max(1, e - 4);
    for (let i = s; i <= e; i++) arr.push(i);
    return arr;
  }, [currentPage, totalPages]);

  const pBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '28px', height: '28px', borderRadius: '6px', border: '1px solid #E2E8F0',
    background: 'transparent', color: '#64748B', fontSize: '12px', cursor: 'pointer',
    padding: '0 6px', transition: 'all 0.1s',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#94A3B8', fontSize: '11px' }}>Rows:</span>
        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} style={{
          background: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0', borderRadius: '5px',
          padding: '2px 6px', fontSize: '11px', cursor: 'pointer',
        }}>
          {[15, 25, 50, 100].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{ color: '#CBD5E1', fontSize: '11px' }}>{totalItems} total</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} style={{ ...pBtn, opacity: currentPage <= 1 ? 0.3 : 1 }}>‹</button>
        {pages.map(p => (
          <button key={p} onClick={() => onPageChange(p)} style={{
            ...pBtn, background: p === currentPage ? '#1E3A8A' : 'transparent',
            color: p === currentPage ? '#fff' : '#64748B', fontWeight: p === currentPage ? 600 : 400,
            border: p === currentPage ? '1px solid #1E3A8A' : '1px solid #E2E8F0',
          }}>{p}</button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} style={{ ...pBtn, opacity: currentPage >= totalPages ? 0.3 : 1 }}>›</button>
      </div>
    </div>
  );
}

/* ─── Batch Action Bar ─── */
function BatchBar({ count, onAction, onClear }) {
  if (count === 0) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', marginBottom: '0',
      background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px',
      animation: 'fadeSlideDown 0.12s ease-out', fontSize: '12px',
    }}>
      <span style={{ color: '#1E3A8A', fontWeight: 600 }}>{count} selected</span>
      {['Export', 'Print', 'Delete'].map(a => (
        <button key={a} onClick={() => onAction(a)} style={{
          padding: '3px 8px', borderRadius: '4px', border: '1px solid #93C5FD',
          background: 'transparent', color: '#2563EB', fontSize: '11px', fontWeight: 500, cursor: 'pointer',
        }}>{a}</button>
      ))}
      <div style={{ flex: 1 }} />
      <button onClick={onClear} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '11px' }}>✕ Clear</button>
    </div>
  );
}

/* ─── Stats Bar ─── */
function ListStatsBar({ items, isInvoices }) {
  const stats = useMemo(() => {
    const totalAmt = items.reduce((s, i) => s + (i.total || 0), 0);
    const paidAmt = items.filter(i => (i.due_amount || 0) <= 0).reduce((s, i) => s + (i.total || 0), 0);
    const outAmt = items.filter(i => (i.due_amount || 0) > 0).reduce((s, i) => s + (i.due_amount || 0), 0);
    return { count: items.length, totalAmt, paidAmt, outAmt };
  }, [items]);

  if (!isInvoices) {
    return (
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ flex: 1, padding: '8px 14px', borderRight: '1px solid #F1F5F9' }}>
          <div style={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Refunds</div>
          <div style={{ color: '#0F172A', fontSize: '15px', fontWeight: 700, fontFamily: 'monospace' }}>{stats.count}</div>
        </div>
        <div style={{ flex: 1, padding: '8px 14px' }}>
          <div style={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Refunded</div>
          <div style={{ color: '#EF4444', fontSize: '15px', fontWeight: 700, fontFamily: 'monospace' }}>{stats.totalAmt.toFixed(2)}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #F1F5F9' }}>
      {[
        { label: 'Invoices', value: stats.count, color: '#0F172A' },
        { label: 'Total', value: stats.totalAmt.toFixed(2), color: '#0F172A' },
        { label: 'Paid', value: stats.paidAmt.toFixed(2), color: '#059669' },
        { label: 'Outstanding', value: stats.outAmt.toFixed(2), color: '#EF4444' },
      ].map((s, i) => (
        <div key={s.label} style={{
          flex: 1, padding: '8px 14px',
          borderRight: i < 3 ? '1px solid #F1F5F9' : 'none',
        }}>
          <div style={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          <div style={{ color: s.color, fontSize: '15px', fontWeight: 700, fontFamily: 'monospace' }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function ERPViewsCore(props) {
  const { page, data, tr, today, invForm, setInvForm, handleCreateInvoice, handleDownloadPDF, printInvoice, exportToExcel, search, setSearch, payFilter, setPayFilter, handleEditInvoice, handleDeleteInvoice, openRefundModal, editInvId, openPreview, openSettleModal, handleQuickSettle, handleAddEditCust, custForm, setCustForm, editCustId, handleAddEditCorp, corpForm, setCorpForm, editCorpId, handleAddEditCred, creditorForm, setCreditorForm, editCredId, handleEditCust, handleEditCorp, handleEditCred, handleDelete, shareWhatsApp, shareEmail } = props;

  // ================= DASHBOARD =================
  if (page === 'dashboard') {
    const s = data.settings || {};
    const activeInv = data.invoices.filter(i => !i.invoice_no.startsWith('REF-') && i.status !== 'Draft' && i.status !== 'Recurring');
    const tSales = activeInv.reduce((s,i) => s + (i.total || 0), 0);
    const tProfit = activeInv.reduce((s,i) => s + (i.profit || 0), 0);
    const cashBal = data.cashbook.filter(c => c.type === 'Cash-In').reduce((s,c) => s + (c.amount || 0), 0) - data.cashbook.filter(c => c.type === 'Cash-Out').reduce((s,c) => s + (c.amount || 0), 0);
    const bankBal = data.cashbook.filter(c => c.type === 'Bank-In').reduce((s,c) => s + (c.amount || 0), 0) - data.cashbook.filter(c => c.type === 'Bank-Out').reduce((s,c) => s + (c.amount || 0), 0);
    const totalOutstanding = activeInv.reduce((s,i) => s + (i.due_amount || 0), 0);
    const tExpenses = data.expenses.reduce((s,e) => s + (e.amount || 0), 0);
    const lowBalPortals = data.portals.filter(p => (p.current_balance || 0) < 1000);

    return (
      <div>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'fadeIn 1s ease-in-out' }}>
          <h1 style={{ margin: 0, color: '#0F172A', fontSize: '28px', fontWeight: '800' }}>{s.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <h2 style={{ margin: '5px 0', color: '#D97706', fontSize: '22px' }}>{s.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
          <p style={{ color: '#64748B', fontSize: '14px' }}>{s.address_ar || ''} | {s.phone || ''}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 15px rgba(37, 99, 235, 0.2)' }}><h3 style={{ margin: '0 0 10px', opacity: 0.9, fontSize: '14px' }}>Total Sales</h3><h2 style={{ margin: 0, fontSize: '28px' }}>{tSales.toFixed(2)} <span style={{fontSize:'14px'}}>SAR</span></h2></div>
          <div style={{ background: 'linear-gradient(135deg, #047857, #059669)', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 15px rgba(5, 150, 105, 0.2)' }}><h3 style={{ margin: '0 0 10px', opacity: 0.9, fontSize: '14px' }}>Total Profit</h3><h2 style={{ margin: 0, fontSize: '28px' }}>{tProfit.toFixed(2)} <span style={{fontSize:'14px'}}>SAR</span></h2></div>
          <div style={{ background: 'linear-gradient(135deg, #B91C1C, #EF4444)', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 15px rgba(239, 68, 68, 0.2)' }}><h3 style={{ margin: '0 0 10px', opacity: 0.9, fontSize: '14px' }}>Outstanding</h3><h2 style={{ margin: 0, fontSize: '28px' }}>{totalOutstanding.toFixed(2)} <span style={{fontSize:'14px'}}>SAR</span></h2></div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', borderLeft: '5px solid #D97706', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}><h3 style={{ margin: '0 0 10px', color: '#64748B', fontSize: '14px' }}>Cash Balance</h3><h2 style={{ margin: 0, color: '#334155', fontSize: '24px' }}>{cashBal.toFixed(2)} SAR</h2></div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', borderLeft: '5px solid #2563EB', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}><h3 style={{ margin: '0 0 10px', color: '#64748B', fontSize: '14px' }}>Bank Balance</h3><h2 style={{ margin: 0, color: '#334155', fontSize: '24px' }}>{bankBal.toFixed(2)} SAR</h2></div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', borderLeft: '5px solid #dc2626', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}><h3 style={{ margin: '0 0 10px', color: '#dc2626', fontSize: '14px' }}>⚠️ Low Portal Alerts</h3>{lowBalPortals.length === 0 ? <p style={{fontSize: '14px', color: '#059669', margin:0}}>All portals are healthy.</p> : lowBalPortals.map(p => <p key={p.id} style={{fontSize: '14px', margin: '5px 0', color: '#dc2626'}}>{p.name} - {p.current_balance.toFixed(2)} SAR</p>)}</div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', borderLeft: '5px solid #7c3aed', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}><h3 style={{ margin: '0 0 10px', color: '#64748B', fontSize: '14px' }}>Total Expenses</h3><h2 style={{ margin: 0, color: '#EF4444', fontSize: '24px' }}>{tExpenses.toFixed(2)} SAR</h2></div>
        </div>
      </div>
    );
  }

  // ================= CREDIT BALANCES =================
  if (page === 'credit') {
    const creditCustomers = data.customers.filter(c => (c.store_credit || 0) > 0);
    return (
      <div>
        <h2 style={{ color: '#0F172A', marginBottom: '20px' }}>{tr.credit}</h2>
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={styles.tableHeader}>Customer</th><th style={styles.tableHeader}>Phone</th><th style={styles.tableHeader}>Available Credit (SAR)</th></tr></thead>
            <tbody>{creditCustomers.length === 0 ? <tr><td colSpan="3" style={{padding: '30px', textAlign:'center', color:'#94A3B8'}}>No credit balances available.</td></tr> : creditCustomers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.phone}</td><td style={{...styles.tableCell, color: '#059669', fontWeight: 'bold'}}>{(c.store_credit || 0).toFixed(2)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    );
  }

  // ================= CREATE INVOICE (HIGH-TECH AUTOMATED FORM) =================
  if (page === 'create') {
    const qty = parseInt(invForm.qty) || 1;
    const baseSell = (parseFloat(invForm.sell) || 0) * qty;
    const discount = parseFloat(invForm.discount) || 0;
    const sellAfterDiscount = baseSell - discount;
    const taxRate = parseFloat(invForm.taxRate) || 0;
    const vat = sellAfterDiscount * (taxRate / 100);
    const totalNewBooking = sellAfterDiscount + vat;
    const creditUsed = parseFloat(invForm.useCredit) || 0;
    const balanceToPay = totalNewBooking - creditUsed;

    const availableCreditInvoices = data.invoices.filter(i => i.invoice_no.startsWith('REF-') && (i.refund_customer || 0) > 0);

    const handleCreditSelect = (invNo) => {
      if (!invNo) {
        setInvForm({ ...invForm, linkedInvId: '', useCredit: 0, oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '', oldSellPrice: 0, creditCustId: '', oldBookingDate: '', oldPassengers: '', oldFlightType: '', oldPaymentMethod: '', refundReason: '' });
        return;
      }
      const linkedInv = data.invoices.find(i => i.invoice_no === invNo);
      if (linkedInv) {
        setInvForm({
          ...invForm,
          linkedInvId: invNo,
          useCredit: linkedInv.refund_customer || 0,
          creditCustId: linkedInv.customer_id || '',
          custId: linkedInv.customer_id || invForm.custId,
          custName: linkedInv.customers?.name || invForm.custName,
          custPhone: linkedInv.customers?.phone || invForm.custPhone,
          oldTicketNo: linkedInv.old_ticket_no || linkedInv.ticket_no || '',
          oldPnr: linkedInv.old_pnr || linkedInv.pnr || '',
          oldAirline: linkedInv.old_airline || linkedInv.airline || '',
          oldSector: linkedInv.old_sector || linkedInv.flight_sector || '',
          oldSellPrice: linkedInv.old_sell_price || linkedInv.total_sell || 0,
          oldBookingDate: linkedInv.old_booking_date || linkedInv.invoice_date || '',
          oldPassengers: linkedInv.old_passengers || linkedInv.passenger_names || '',
          oldFlightType: linkedInv.old_flight_type || linkedInv.flight_type || '',
          oldPaymentMethod: linkedInv.old_payment_method || linkedInv.payment_method || '',
          refundReason: linkedInv.refund_reason || ''
        });
      }
    };

    return (
      <div style={styles.card}>
        <h2 style={{ color: '#0F172A', marginBottom: '20px', borderBottom: '2px solid #E2E8F0', paddingBottom: '10px' }}>{editInvId ? tr.editInvoice : tr.create}</h2>
        <form onSubmit={handleCreateInvoice}>
          
          {/* SECTION 1: CUSTOMER DETAILS */}
          <div style={{ marginBottom: '30px' }}>
            <div style={styles.sectionTitle}><span>1. Customer Details</span><span>تفاصيل العميل</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {invForm.payment !== 'Credit Balance' && (
                <div>
                  <label style={styles.label}>{tr.custType} / نوع العميل</label>
                  <select value={invForm.custType} onChange={e => setInvForm({...invForm, custType: e.target.value})} style={styles.input}>
                    <option>{tr.individual}</option><option>{tr.corporate}</option>
                  </select>
                </div>
              )}
              
              {invForm.payment !== 'Credit Balance' && invForm.custType === 'Individual' ? (
                <>
                  <div>
                    <label style={styles.label}>{tr.selectCustomer} / اختر العميل</label>
                    <input type="text" list="customers-list" value={invForm.custName} onChange={e => { const val = e.target.value; const cust = data.customers.find(c => c.name.toLowerCase() === val.toLowerCase()); if (cust) { setInvForm({...invForm, custName: cust.name, custId: cust.id, custPhone: cust.phone}); } else { setInvForm({...invForm, custName: val, custId: 'new'}); } }} placeholder="Search or type new name..." style={styles.input} required />
                    <datalist id="customers-list">{data.customers.map(c => <option key={c.id} value={c.name}>{c.name} (Phone: {c.phone})</option>)}</datalist>
                  </div>
                  {invForm.custId !== 'new' && (() => { const cust = data.customers.find(c => c.id === invForm.custId); return cust ? ( <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0', gridColumn: '1 / -1' }}> <strong style={{ color: '#059669' }}>{tr.creditBalance}: </strong> <span style={{ color: '#059669', fontWeight: 'bold' }}>{(cust.store_credit || 0).toFixed(2)} SAR</span> </div> ) : null; })()}
                  {invForm.custId === 'new' && invForm.custName && ( <div><label style={styles.label}>{tr.customerPhone}</label><input value={invForm.custPhone} onChange={e => setInvForm({...invForm, custPhone: e.target.value})} style={styles.input} /></div> )}
                </>
              ) : invForm.payment !== 'Credit Balance' && invForm.custType === 'Corporate' ? (
                <>
                  <div><label style={styles.label}>Select Corporate</label><select value={invForm.corpId} onChange={e => setInvForm({...invForm, corpId: e.target.value})} style={styles.input}><option value="new">New Company</option>{data.corporates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  {invForm.corpId === 'new' && ( <><div><label style={styles.label}>Company Name</label><input value={invForm.corpName} onChange={e => setInvForm({...invForm, corpName: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>VAT No</label><input value={invForm.corpVat} onChange={e => setInvForm({...invForm, corpVat: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>Phone</label><input value={invForm.corpPhone} onChange={e => setInvForm({...invForm, corpPhone: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>Address</label><input value={invForm.corpAddress} onChange={e => setInvForm({...invForm, corpAddress: e.target.value})} style={styles.input} /></div></> )}
                </>
              ) : null}

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>{tr.passengers} / الركاب</label>
                {invForm.passengers.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input value={p} onChange={e => { const arr = [...invForm.passengers]; arr[i] = e.target.value; setInvForm({...invForm, passengers: arr}); }} placeholder={`Passenger ${i + 1}`} style={styles.input} required />
                    {invForm.passengers.length > 1 && <button type="button" onClick={() => setInvForm({...invForm, passengers: invForm.passengers.filter((_, idx) => idx !== i)})} style={{...styles.btnDanger, width: 'auto'}}>X</button>}
                  </div>
                ))}
                <button type="button" onClick={() => setInvForm({...invForm, passengers: [...invForm.passengers, '']})} style={{...styles.btnWarning, width: 'auto'}}>{tr.addPassenger}</button>
              </div>
            </div>
          </div>

          {/* SECTION 2: FLIGHT & PRICING DETAILS */}
          <div style={{ marginBottom: '30px' }}>
            <div style={styles.sectionTitle}><span>2. Flight & Pricing Details</span><span>تفاصيل الرحلة والأسعار</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div><label style={styles.label}>{tr.portal} / البوابة</label><select value={invForm.portalId} onChange={e => setInvForm({...invForm, portalId: e.target.value})} style={styles.input} required><option value="">Select Portal</option>{data.portals.map(p => <option key={p.id} value={p.id}>{p.name} (Bal: {(p.current_balance || 0).toFixed(2)})</option>)}</select></div>
              <div><label style={styles.label}>{tr.service} / الخدمة</label><select value={invForm.service} onChange={e => setInvForm({...invForm, service: e.target.value})} style={styles.input}><option>{tr.flightTicket}</option><option>{tr.hotel}</option><option>{tr.tourPackage}</option><option>{tr.visitVisa}</option><option>{tr.umrahVisa}</option><option>{tr.newService}</option></select></div>
              
              {invForm.service === 'Flight Ticket' && (
                <>
                  <div><label style={styles.label}>{tr.flightType} / نوع الرحلة</label><select value={invForm.flightType} onChange={e => { const ft = e.target.value; setInvForm({...invForm, flightType: ft, taxRate: ft === 'International' ? '0' : '15'}); }} style={styles.input}><option>{tr.domestic}</option><option>{tr.international}</option></select></div>
                  <div><label style={styles.label}>{tr.airline} / خط الطيران</label><input value={invForm.airline} onChange={e => setInvForm({...invForm, airline: e.target.value})} style={styles.input} required /></div>
                  <div><label style={styles.label}>{tr.sector} / القطاع</label><input value={invForm.flightSector} onChange={e => setInvForm({...invForm, flightSector: e.target.value})} style={styles.input} required /></div>
                  <div><label style={styles.label}>{tr.pnr} / رقم الحجز</label><input value={invForm.pnr} onChange={e => setInvForm({...invForm, pnr: e.target.value})} style={styles.input} /></div>
                  <div><label style={styles.label}>{tr.ticketNo} / رقم التذكرة</label><input value={invForm.ticketNo} onChange={e => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.input} /></div>
                </>
              )}
              
              <div><label style={styles.label}>{tr.qty} / الكمية</label><input type="number" value={invForm.qty} onChange={e => setInvForm({...invForm, qty: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>{tr.cost} / التكلفة</label><input type="number" step="0.01" value={invForm.cost} onChange={e => setInvForm({...invForm, cost: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>{tr.sell} / البيع</label><input type="number" step="0.01" value={invForm.sell} onChange={e => setInvForm({...invForm, sell: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>{tr.discount} / الخصم</label><input type="number" step="0.01" value={invForm.discount} onChange={e => setInvForm({...invForm, discount: e.target.value})} style={styles.input} /></div>
              <div><label style={styles.label}>{tr.vatRate} / نسبة الضريبة</label><select value={invForm.taxRate} onChange={e => setInvForm({...invForm, taxRate: e.target.value})} style={styles.input}><option value="15">15% VAT</option><option value="0">0% VAT (Exempt)</option></select></div>
              <div><label style={styles.label}>{tr.invoiceDate} / تاريخ الفاتورة</label><input type="date" value={invForm.invoiceDate} onChange={e => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.input} required /></div>
            </div>
          </div>

          {/* SECTION 3: RE-ISSUE & CREDIT AUTOMATION (DEEP FETCH) */}
          <div style={{ marginBottom: '30px', background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={styles.sectionTitle}><span>3. Booking Type & Re-issue Automation</span><span>أتمتة إعادة الإصدار</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <div>
                <label style={styles.label}>{tr.bookingType} / نوع الحجز</label>
                <select value={invForm.bookingType} onChange={e => setInvForm({...invForm, bookingType: e.target.value, linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '', oldSellPrice: 0, oldBookingDate: '', oldPassengers: '', oldFlightType: '', oldPaymentMethod: '', refundReason: '', useCredit: 0})} style={styles.input}>
                  <option>{tr.newBooking}</option><option>{tr.reissue}</option><option>{tr.extraLuggage}</option><option>{tr.previousBooking}</option>
                </select>
              </div>
              
              {(invForm.bookingType === 'Previous Booking' || invForm.payment === 'Credit Balance') && (
                <div>
                  <label style={styles.label}>Select Credit Invoice (Auto-Fill Previous Data) / اختر فاتورة الرصيد</label>
                  <select value={invForm.linkedInvId} onChange={e => handleCreditSelect(e.target.value)} style={styles.input} required>
                    <option value="">Select Refund Invoice (Credit Available)</option>
                    {availableCreditInvoices.map(i => 
                      <option key={i.id} value={i.invoice_no}>{i.invoice_no} - {i.customers?.name || 'N/A'} (Credit: {i.refund_customer || 0} SAR)</option>
                    )}
                  </select>
                  
                  {invForm.linkedInvId && (
                    <div style={{ marginTop: '15px', background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #F59E0B' }}>
                      <h4 style={{ margin: '0 0 15px', color: '#D97706', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>✅ Auto-Filled Previous Booking Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}><div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Old Invoice Date</div><div style={{ fontSize: '16px', color: '#0F172A', fontWeight: 700, marginTop: '5px' }}>{invForm.oldBookingDate || 'N/A'}</div></div>
                        <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}><div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Refund Reason</div><div style={{ fontSize: '16px', color: '#0F172A', fontWeight: 700, marginTop: '5px' }}>{invForm.refundReason || 'N/A'}</div></div>
                        <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}><div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Original Airline</div><div style={{ fontSize: '16px', color: '#0F172A', fontWeight: 700, marginTop: '5px' }}>{invForm.oldAirline || 'N/A'}</div></div>
                        <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}><div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Original Sector</div><div style={{ fontSize: '16px', color: '#0F172A', fontWeight: 700, marginTop: '5px' }}>{invForm.oldSector || 'N/A'}</div></div>
                        <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}><div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Original Ticket No</div><div style={{ fontSize: '16px', color: '#0F172A', fontWeight: 700, marginTop: '5px' }}>{invForm.oldTicketNo || 'N/A'}</div></div>
                        <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}><div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Original PNR</div><div style={{ fontSize: '16px', color: '#0F172A', fontWeight: 700, marginTop: '5px' }}>{invForm.oldPnr || 'N/A'}</div></div>
                        <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}><div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Original Flight Type</div><div style={{ fontSize: '16px', color: '#0F172A', fontWeight: 700, marginTop: '5px' }}>{invForm.oldFlightType || 'N/A'}</div></div>
                        <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}><div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Original Payment</div><div style={{ fontSize: '16px', color: '#0F172A', fontWeight: 700, marginTop: '5px' }}>{invForm.oldPaymentMethod || 'N/A'}</div></div>
                        <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0', gridColumn: '1 / -1' }}><div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Original Passengers</div><div style={{ fontSize: '16px', color: '#0F172A', fontWeight: 700, marginTop: '5px' }}>{invForm.oldPassengers || 'N/A'}</div></div>
                        <div style={{ background: '#FEF3C7', padding: '15px', borderRadius: '8px', border: '1px solid #F59E0B' }}><div style={{ fontSize: '11px', color: '#92400E', fontWeight: 600 }}>Original Ticket Fare</div><div style={{ fontSize: '18px', color: '#78350F', fontWeight: 800, marginTop: '5px' }}>{parseFloat(invForm.oldSellPrice || 0).toFixed(2)} SAR</div></div>
                        <div style={{ background: '#DCFCE7', padding: '15px', borderRadius: '8px', border: '1px solid #86EFAC', gridColumn: '1 / -1' }}><div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>Refund Credit Applied</div><div style={{ fontSize: '20px', color: '#047857', fontWeight: 800, marginTop: '5px' }}>- {creditUsed.toFixed(2)} SAR</div></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: PAYMENT & LIVE CALCULATION */}
          <div style={{ marginBottom: '30px' }}>
            <div style={styles.sectionTitle}><span>4. Payment & Calculation</span><span>الدفع والحساب</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div><label style={styles.label}>{tr.salesPerson} / موظف المبيعات</label><select value={invForm.employeeId} onChange={e => setInvForm({...invForm, employeeId: e.target.value})} style={styles.input} required><option value="">Select Sales Person</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
              <div><label style={styles.label}>{tr.paymentMethod} / طريقة الدفع</label><select value={invForm.payment} onChange={e => setInvForm({...invForm, payment: e.target.value, useCredit: 0, creditCustId: '', linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '', oldSellPrice: 0, oldBookingDate: '', oldPassengers: '', oldFlightType: '', oldPaymentMethod: '', refundReason: '' })} style={styles.input}><option>{tr.cash}</option><option>{tr.bankTransfer}</option><option>{tr.card}</option><option>{tr.credit}</option><option>{tr.creditBalance}</option><option>{tr.tabby}</option><option>{tr.tamara}</option></select></div>
              
              <div style={{ gridColumn: '1 / -1', background: '#0F172A', color: 'white', padding: '25px', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 20px', color: '#F59E0B', fontSize: '18px' }}>Live Calculation / الحساب المباشر</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', margin: '8px 0', color: '#CBD5E1' }}><span>New Booking Price:</span><span>{totalNewBooking.toFixed(2)} SAR</span></div>
                    {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', margin: '8px 0', color: '#34d399' }}><span>Discount Applied:</span><span>- {discount.toFixed(2)} SAR</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', margin: '8px 0', color: '#CBD5E1' }}><span>VAT ({taxRate}%):</span><span>{vat.toFixed(2)} SAR</span></div>
                  </div>
                  <div style={{ borderLeft: '1px solid #334155', paddingLeft: '20px' }}>
                    {creditUsed > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', margin: '8px 0', color: '#34d399' }}><span>Refund Credit Applied:</span><span>- {creditUsed.toFixed(2)} SAR</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', margin: '15px 0 0', fontWeight: 'bold', borderTop: '2px solid #334155', paddingTop: '15px' }}>
                      <span>Balance to Pay (Cash/Bank):</span>
                      <span style={{ color: balanceToPay > 0 ? '#EF4444' : '#059669' }}>{balanceToPay > 0 ? balanceToPay.toFixed(2) : '0.00'} SAR</span>
                    </div>
                  </div>
                </div>
              </div>

              <div><label style={styles.label}>{tr.paidAmount} (Cash/Bank) / المبلغ المدفوع</label><input type="number" step="0.01" value={invForm.paid} onChange={e => setInvForm({...invForm, paid: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>Invoice Status / حالة الفاتورة</label><select value={invForm.status || 'Unpaid'} onChange={e => setInvForm({...invForm, status: e.target.value})} style={styles.input}><option value="Unpaid">Unpaid</option><option value="Paid">Paid</option></select></div>
              
              {invForm.payment === 'Credit' && ( <><div><label style={styles.label}>Select Creditor</label><select value={invForm.creditorId} onChange={e => setInvForm({...invForm, creditorId: e.target.value})} style={styles.input} required><option value="">Select Creditor</option>{data.creditors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label style={styles.label}>Credit Due Date</label><input type="date" value={invForm.creditDueDate} onChange={e => setInvForm({...invForm, creditDueDate: e.target.value})} style={styles.input} required /></div></> )}
              {invForm.payment === 'Tabby' && <div><label style={styles.label}>Tabby Order No</label><input value={invForm.tabbyNo} onChange={e => setInvForm({...invForm, tabbyNo: e.target.value})} style={styles.input} required /></div>}
              {invForm.payment === 'Tamara' && <div><label style={styles.label}>Tamara Order No</label><input value={invForm.tamaraNo} onChange={e => setInvForm({...invForm, tamaraNo: e.target.value})} style={styles.input} required /></div>}
            </div>
          </div>

          <button type="submit" style={{ ...styles.btnPrimary, marginTop: '10px', padding: '15px', fontSize: '16px' }}>{editInvId ? tr.updateInvoice : tr.generateInvoice}</button>
        </form>
      </div>
    );
  }

  // ╔═══════════════════════════════════════════════════════════════╗
  // ║  LIST INVOICES & REFUNDS — COMPACT FIX (MAIN FIX AREA)       ║
  // ╚═══════════════════════════════════════════════════════════════╝
  if (page === 'list' || page === 'refunds') {
    const isInvoices = page === 'list';
    const allData = isInvoices
      ? data.invoices.filter(i => !i.invoice_no.startsWith('REF-') && i.status !== 'Draft' && i.status !== 'Recurring')
      : data.invoices.filter(i => i.invoice_no.startsWith('REF-'));

    // ── Local state for compact table ──
    const [localSearch, setLocalSearch] = useState(search || '');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date_desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [toast, setToast] = useState(null);

    // Sync external search
    React.useEffect(() => { setLocalSearch(search || ''); }, [search]);

    const handleLocalSearch = (val) => {
      setLocalSearch(val);
      setSearch(val);
      setCurrentPage(1);
    };

    const handlePayFilter = (val) => {
      setPayFilter(val);
      setCurrentPage(1);
    };

    // ── Filter + Sort ──
    const filteredData = useMemo(() => {
      let result = allData.filter(inv =>
        (payFilter === 'All' || inv.payment_method === payFilter) &&
        (inv.invoice_no.toLowerCase().includes(localSearch.toLowerCase()) ||
         (inv.customers?.name || '').toLowerCase().includes(localSearch.toLowerCase()) ||
         (inv.corporates?.name || '').toLowerCase().includes(localSearch.toLowerCase()))
      );

      if (statusFilter !== 'all') {
        result = result.filter(inv => {
          const s = inv.status || ((inv.due_amount || 0) <= 0 ? 'Paid' : 'Unpaid');
          return s.toLowerCase() === statusFilter.toLowerCase();
        });
      }

      switch (sortBy) {
        case 'date_desc': result.sort((a, b) => (b.invoice_date || '').localeCompare(a.invoice_date || '')); break;
        case 'date_asc': result.sort((a, b) => (a.invoice_date || '').localeCompare(b.invoice_date || '')); break;
        case 'total_desc': result.sort((a, b) => (b.total || 0) - (a.total || 0)); break;
        case 'total_asc': result.sort((a, b) => (a.total || 0) - (b.total || 0)); break;
        case 'cust_asc': result.sort((a, b) => ((a.customers?.name || '') || (a.corporates?.name || '')).localeCompare((b.customers?.name || '') || (b.corporates?.name || ''))); break;
        default: break;
      }

      return result;
    }, [allData, localSearch, payFilter, statusFilter, sortBy]);

    // ── Pagination ──
    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // ── Select logic ──
    const allSelected = paginatedData.length > 0 && paginatedData.every(i => selectedIds.has(i.id));
    const toggleSelect = (id) => {
      setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
    };
    const selectAll = (checked) => {
      if (checked) setSelectedIds(new Set(paginatedData.map(i => i.id)));
      else setSelectedIds(new Set());
    };

    // ── Batch action handler ──
    const handleBatch = (action) => {
      if (action === 'Export') {
        const selected = filteredData.filter(i => selectedIds.has(i.id));
        exportToExcel(selected.map(i => ({
          Inv: i.invoice_no, Customer: i.customers?.name || i.corporates?.name,
          Date: i.invoice_date, Total: i.total, Due: i.due_amount, Method: i.payment_method
        })), isInvoices ? 'Invoices_Selected' : 'Refunds_Selected');
        setToast(`${selected.length} items exported`);
      } else if (action === 'Delete') {
        setToast(`${selectedIds.size} items selected for deletion`);
      } else {
        setToast(`${action} on ${selectedIds.size} items`);
      }
    };

    // ── Compact styles (only for this section) ──
    const cTH = { background: '#0F172A', color: '#94A3B8', padding: '7px 10px', textAlign: 'start', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', borderBottom: '1px solid #1E293B' };
    const cTD = { padding: '6px 10px', borderBottom: '1px solid #F1F5F9', fontSize: '13px', verticalAlign: 'middle' };

    const selectStyle = {
      background: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0', borderRadius: '6px',
      padding: '0 24px 0 8px', height: '32px', fontSize: '12px', cursor: 'pointer',
      appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <style>{`
          @keyframes fadeSlideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
          input[type="checkbox"] { width: 13px; height: 13px; cursor: 'pointer'; accent-color: '#1E3A8A'; }
          select option { background: #fff; color: #334155; }
        `}</style>

        {/* ── Title + Export ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ color: '#0F172A', margin: 0, fontSize: '18px', fontWeight: 700 }}>{isInvoices ? tr.list : tr.refunds}</h2>
          <button
            onClick={() => exportToExcel(filteredData.map(i => ({ Inv: i.invoice_no, Customer: i.customers?.name || i.corporates?.name, Date: i.invoice_date, Total: i.total, Due: i.due_amount, Method: i.payment_method })), isInvoices ? 'Invoices' : 'Refunds')}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px',
              border: '1px solid #059669', background: '#F0FDF4', color: '#059669',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F0FDF4'; e.currentTarget.style.color = '#059669'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
            {tr.download_excel}
          </button>
        </div>

        {/* ── Search + Filters Row ── */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 240px',
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0 10px', height: '32px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              placeholder={tr.search}
              value={localSearch}
              onChange={(e) => handleLocalSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '12px', color: '#334155', width: '100%', background: 'transparent' }}
            />
            {localSearch && (
              <button onClick={() => handleLocalSearch('')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0', display: 'flex', lineHeight: 1 }}>✕</button>
            )}
          </div>
          <select value={payFilter} onChange={(e) => handlePayFilter(e.target.value)} style={selectStyle}>
            <option>All</option><option>Cash</option><option>Bank Transfer</option><option>Card / Network</option><option>Credit</option><option>Credit Balance</option><option>Tabby</option><option>Tamara</option>
          </select>
          {isInvoices && (
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={selectStyle}>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
            </select>
          )}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="total_desc">Total ↓</option>
            <option value="total_asc">Total ↑</option>
            <option value="cust_asc">Customer A-Z</option>
          </select>
        </div>

        {/* ── Stats Bar ── */}
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '0', overflow: 'hidden' }}>
          <ListStatsBar items={allData} isInvoices={isInvoices} />
        </div>

        {/* ── Batch Bar ── */}
        <div style={{ padding: '6px 0 0' }}>
          <BatchBar count={selectedIds.size} onAction={handleBatch} onClear={() => setSelectedIds(new Set())} />
        </div>

        {/* ── TABLE ── */}
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', marginTop: '6px' }}>
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...cTH, width: '32px' }}>
                    <input type="checkbox" checked={allSelected} onChange={(e) => selectAll(e.target.checked)} />
                  </th>
                  <th style={{ ...cTH, width: '165px' }}>{tr.invNo}</th>
                  <th style={{ ...cTH, width: '170px' }}>Customer</th>
                  <th style={{ ...cTH, textAlign: 'right', width: '95px' }}>{tr.total}</th>
                  <th style={{ ...cTH, textAlign: 'right', width: '85px' }}>{tr.due}</th>
                  <th style={{ ...cTH, width: '115px' }}>{tr.method}</th>
                  {isInvoices && <th style={{ ...cTH, width: '75px', textAlign: 'center' }}>Status</th>}
                  <th style={{ ...cTH, width: '48px', textAlign: 'center', padding: '7px 8px' }}>{tr.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={isInvoices ? 8 : 7} style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8', fontSize: '13px' }}>
                      No {isInvoices ? 'Invoices' : 'Refunds'} Found. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((inv, idx) => {
                    const isSelected = selectedIds.has(inv.id);
                    const status = inv.status || ((inv.due_amount || 0) <= 0 ? 'Paid' : 'Unpaid');
                    return (
                      <tr
                        key={inv.id}
                        style={{
                          background: isSelected ? '#EFF6FF' : (idx % 2 === 0 ? '#fff' : '#F8FAFC'),
                          transition: 'background 0.08s',
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#F1F5F9'; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#F8FAFC'; }}
                      >
                        <td style={{ ...cTD, width: '32px', padding: '6px 8px' }}>
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(inv.id)} />
                        </td>
                        <td style={{ ...cTD, width: '165px' }}>
                          <span style={{ color: '#1E3A8A', fontWeight: 600, fontFamily: 'monospace', fontSize: '12px' }}>{inv.invoice_no}</span>
                        </td>
                        <td style={{ ...cTD, width: '170px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '5px', flexShrink: 0,
                              background: `hsl(${(inv.id * 47) % 360}, 45%, 65%)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: '10px', fontWeight: 700,
                            }}>
                              {(inv.customers?.name || inv.corporates?.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <span style={{ color: '#1E293B', fontWeight: 500, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>
                              {inv.customers?.name || inv.corporates?.name || '—'}
                            </span>
                          </div>
                        </td>
                        <td style={{ ...cTD, textAlign: 'right', width: '95px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace', fontSize: '13px' }}>
                          {(inv.total || 0).toFixed(2)}
                        </td>
                        <td style={{
                          ...cTD, textAlign: 'right', width: '85px',
                          fontWeight: 600, fontFamily: 'monospace', fontSize: '13px',
                          color: (inv.due_amount || 0) > 0 ? '#EF4444' : '#059669',
                        }}>
                          {(inv.due_amount || 0).toFixed(2)}
                        </td>
                        <td style={{ ...cTD, width: '115px' }}>
                          <MethodBadge method={inv.payment_method} />
                        </td>
                        {isInvoices && (
                          <td style={{ ...cTD, width: '75px', textAlign: 'center' }}>
                            <StatusBadge status={status} />
                          </td>
                        )}
                        <td style={{ ...cTD, width: '48px', textAlign: 'center', padding: '6px 8px' }}>
                          <ActionDropdown
                            inv={inv}
                            isInvoices={isInvoices}
                            tr={tr}
                            handlers={{
                              openPreview, handleDownloadPDF, printInvoice,
                              shareWhatsApp, shareEmail, handleEditInvoice,
                              handleQuickSettle, openRefundModal, handleDeleteInvoice,
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div style={{ padding: '0 12px' }}>
            <CompactPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
            />
          </div>
        </div>

        {/* Toast */}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // ================= CUSTOMERS =================
  if (page === 'customers') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.customers}</h2>
        <button onClick={() => exportToExcel(data.customers, 'Customers')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={{...styles.card, display: 'flex', gap: '15px', alignItems: 'center'}}>
        <form onSubmit={handleAddEditCust} style={{ display: 'flex', gap: '15px', width: '100%' }}>
          <input value={custForm.name} onChange={e => setCustForm({...custForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={custForm.phone} onChange={e => setCustForm({...custForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <input type="number" step="0.01" value={custForm.store_credit} onChange={e => setCustForm({...custForm, store_credit: e.target.value})} placeholder="Store Credit" style={styles.input} />
          <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '12px 25px'}}>{editCustId ? tr.save : 'Add'}</button>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#0F172A' }}><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Phone</th><th style={styles.tableHeader}>Credit</th><th style={styles.tableHeader}>{tr.actions}</th></tr></thead>
          <tbody>{data.customers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.phone}</td><td style={styles.tableCell}>{c.store_credit || 0}</td><td style={styles.tableCell}><button onClick={() => handleEditCust(c)} style={styles.btnWarning}>{tr.edit}</button><button onClick={() => handleDelete('customers', c.id)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>{tr.delete}</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
  
  // ================= CORPORATES =================
  if (page === 'corporates') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.corporates}</h2>
        <button onClick={() => exportToExcel(data.corporates, 'Corporates')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={{...styles.card, display: 'flex', gap: '15px', alignItems: 'center'}}>
        <form onSubmit={handleAddEditCorp} style={{ display: 'flex', gap: '15px', width: '100%' }}>
          <input value={corpForm.name} onChange={e => setCorpForm({...corpForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={corpForm.vat_no} onChange={e => setCorpForm({...corpForm, vat_no: e.target.value})} placeholder="VAT" style={styles.input} />
          <input value={corpForm.phone} onChange={e => setCorpForm({...corpForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <input value={corpForm.address} onChange={e => setCorpForm({...corpForm, address: e.target.value})} placeholder="Address" style={styles.input} />
          <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '12px 25px'}}>{editCorpId ? tr.save : 'Add'}</button>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#0F172A' }}><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>VAT</th><th style={styles.tableHeader}>{tr.actions}</th></tr></thead>
          <tbody>{data.corporates.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.vat_no}</td><td style={styles.tableCell}><button onClick={() => handleEditCorp(c)} style={styles.btnWarning}>{tr.edit}</button><button onClick={() => handleDelete('corporates', c.id)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>{tr.delete}</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  // ================= CREDITORS =================
  if (page === 'creditors') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.creditors}</h2>
        <button onClick={() => exportToExcel(data.creditors, 'Creditors')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={{...styles.card, display: 'flex', gap: '15px', alignItems: 'center'}}>
        <form onSubmit={handleAddEditCred} style={{ display: 'flex', gap: '15px', width: '100%' }}>
          <input value={creditorForm.name} onChange={e => setCreditorForm({...creditorForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={creditorForm.phone} onChange={e => setCreditorForm({...creditorForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '12px 25px'}}>{editCredId ? tr.save : 'Add'}</button>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#0F172A' }}><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>{tr.actions}</th></tr></thead>
          <tbody>{data.creditors.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}><button onClick={() => handleEditCred(c)} style={styles.btnWarning}>{tr.edit}</button><button onClick={() => handleDelete('creditors', c.id)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>{tr.delete}</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  return null;
}
