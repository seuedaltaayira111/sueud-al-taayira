'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

export default function ERPViewsMisc(props) {
  const {
    page, data, tr, setPage, showToast, today, userProfile,
    invForm, setInvForm, editInvId, setEditInvId, handleCreateInvoice,
    handleAddEditEmp, handleEditEmp, handleDelete,
    empForm, setEmpForm, editEmpId, setEditEmpId,
    advForm, setAdvForm, handleAddAdvance, handleUpdateAdvanceStatus, handleDeleteAdvance,
    handleAddMistake, handlePreviewMistake, handleDeleteMistake,
    payForm, setPayForm, handleProcessPayroll, handleGenerateSlip, handleDeletePayroll,
    lang, theme
  } = props;

  const t = (key, fallback) => tr?.[key] || fallback || key;
  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';
  const isAr = lang === 'ar';
  const isDark = theme === 'dark';

  // ===== STYLES =====
  const s = {
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
    badgePaid: {
      background: '#065F46',
      color: '#34D399'
    },
    badgeUnpaid: {
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
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#64748B'
    },
    emptyIcon: {
      fontSize: '60px',
      marginBottom: '15px'
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
    }
  };

  // ============================================================
  // DASHBOARD
  // ============================================================
  if (page === 'dashboard') {
    const invoices = (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-'));
    const totalRevenue = invoices.reduce((sum, i) => sum + (i.total_sell || i.total || 0), 0);
    const totalPaid = invoices.reduce((sum, i) => sum + (i.paid_amount || 0), 0);
    const totalDue = invoices.reduce((sum, i) => sum + (i.due_amount || 0), 0);
    const totalExpenses = (data.expenses || []).reduce((sum, e) => sum + (e.amount || parseFloat(e.total) || 0), 0);
    const unpaidCount = invoices.filter(i => i.status === 'Unpaid').length;
    const portalBalance = (data.portals || []).reduce((sum, p) => sum + (p.current_balance || p.balance || 0), 0);
    const totalProfit = invoices.reduce((sum, i) => sum + (i.profit || 0), 0);
    const netProfit = totalProfit - totalExpenses;

    const todayStr = today;
    const todayInvoices = invoices.filter(i => i.invoice_date === todayStr);
    const todayRevenue = todayInvoices.reduce((s, i) => s + (i.total || 0), 0);

    return (
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>📊 {t('dashboard', 'Dashboard')}</h1>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>
            {new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <div style={s.statLabel}>📈 Today's Revenue</div>
            <div style={{ ...s.statValue, color: '#34D399' }}>{fmt(todayRevenue)}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>💰 Total Revenue</div>
            <div style={{ ...s.statValue, color: '#34D399' }}>{fmt(totalRevenue)}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>💳 Total Paid</div>
            <div style={{ ...s.statValue, color: '#34D399' }}>{fmt(totalPaid)}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>⚠️ Outstanding</div>
            <div style={{ ...s.statValue, color: totalDue > 0 ? '#FCA5A5' : '#34D399' }}>{fmt(totalDue)}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>📄 Unpaid Invoices</div>
            <div style={{ ...s.statValue, color: unpaidCount > 0 ? '#FBBF24' : '#34D399' }}>{unpaidCount}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>💸 Total Expenses</div>
            <div style={{ ...s.statValue, color: '#FCA5A5' }}>{fmt(totalExpenses)}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>📊 Net Profit</div>
            <div style={{ ...s.statValue, color: netProfit >= 0 ? '#34D399' : '#FCA5A5' }}>{fmt(netProfit)}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>🏦 Portal Balance</div>
            <div style={{ ...s.statValue, color: portalBalance >= 0 ? '#60A5FA' : '#FCA5A5' }}>{fmt(portalBalance)}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>👥 Total Customers</div>
            <div style={{ ...s.statValue, color: '#A78BFA' }}>{(data.customers || []).length}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>✈️ Total Invoices</div>
            <div style={{ ...s.statValue, color: '#60A5FA' }}>{invoices.length}</div>
          </div>
        </div>

        <div style={s.card}>
          <h3 style={s.sectionTitle}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ ...s.btn, ...s.btnPrimary }} onClick={() => setPage('create')}>
              + {t('create', 'Create Invoice')}
            </button>
            <button style={{ ...s.btn, ...s.btnSuccess }} onClick={() => setPage('list')}>
              📋 {t('list', 'View Invoices')}
            </button>
            <button style={{ ...s.btn, ...s.btnWarning }} onClick={() => setPage('refunds')}>
              🔄 {t('refunds', 'Refunds')}
            </button>
            <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => setPage('customers')}>
              👥 {t('customers', 'Customers')}
            </button>
            <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => setPage('reports')}>
              📊 Reports
            </button>
            <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => setPage('my_attendance')}>
              ⏰ Attendance
            </button>
            <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => setPage('flight_status')}>
              🛫 Flight Status
            </button>
          </div>
        </div>

        <div style={s.card}>
          <h3 style={s.sectionTitle}>📄 Recent Invoices</h3>
          {invoices.length === 0 ? (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>📄</div>
              <p>{isAr ? 'لا توجد فواتير بعد. قم بإنشاء فاتورتك الأولى!' : 'No invoices yet. Create your first invoice!'}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>{t('invNo', 'Inv No')}</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Customer</th>
                    <th style={s.th}>Airline</th>
                    <th style={{ ...s.th, textAlign: 'right' }}>Total</th>
                    <th style={{ ...s.th, textAlign: 'right' }}>Due</th>
                    <th style={{ ...s.th, textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 10).map(inv => (
                    <tr key={inv.id}>
                      <td style={{ ...s.td, fontWeight: 700, color: '#60A5FA' }}>{inv.invoice_no}</td>
                      <td style={s.td}>{inv.invoice_date}</td>
                      <td style={s.td}>{inv.customers?.name || inv.corporates?.name || 'N/A'}</td>
                      <td style={s.td}>{inv.airline || '-'}</td>
                      <td style={s.tdRight}>{fmt(inv.total_sell)}</td>
                      <td style={{ ...s.tdRight, color: inv.due_amount > 0 ? '#FCA5A5' : '#34D399' }}>
                        {fmt(inv.due_amount)}
                      </td>
                      <td style={s.tdCenter}>
                        <span style={{ ...s.badge, ...(inv.status === 'Paid' ? s.badgePaid : s.badgeUnpaid) }}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={s.card}>
          <h3 style={s.sectionTitle}>🛫 Portal Balances</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {(data.portals || []).map(p => (
              <div key={p.id} style={{
                background: isDark ? '#0F172A' : '#F8FAFC',
                padding: '15px',
                borderRadius: '8px',
                border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: isDark ? '#CBD5E1' : '#1E293B', fontSize: '13px' }}>{p.name}</span>
                <span style={{
                  color: (p.current_balance || p.balance || 0) < 1000 ? '#FCA5A5' : '#34D399',
                  fontWeight: 700,
                  fontSize: '14px'
                }}>
                  {fmt(p.current_balance || p.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // CREATE / EDIT INVOICE
  // ============================================================
  if (page === 'create') {
    const f = invForm || {};
    const passengers = f.passengers?.length ? f.passengers : [''];

    const addPassenger = () => setInvForm({ ...f, passengers: [...passengers, ''] });
    const removePassenger = (idx) => setInvForm({ ...f, passengers: passengers.filter((_, i) => i !== idx) });
    const changePassenger = (idx, val) => setInvForm({ ...f, passengers: passengers.map((p, i) => i === idx ? val : p) });

    const qty = parseInt(f.qty) || 1;
    const cost = (parseFloat(f.cost) || 0) * qty;
    const sellBeforeDiscount = (parseFloat(f.sell) || 0) * qty;
    const discount = parseFloat(f.discount) || 0;
    const sellAfterDiscount = Math.max(sellBeforeDiscount - discount, 0);
    const taxRate = parseFloat(f.taxRate) || 0;
    const vat = sellAfterDiscount * (taxRate / 100);
    const grandTotal = sellAfterDiscount + vat;
    const profit = sellAfterDiscount - cost;
    const paid = parseFloat(f.paid) || 0;
    const dueAmount = Math.max(grandTotal - paid, 0);

    return (
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>✈️ {editInvId ? t('editInvoice', 'Edit Invoice') : t('create', 'Create Invoice')}</h1>
          {editInvId && (
            <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => { setEditInvId?.(null); setPage('list'); }}>
              ✕ {t('cancel', 'Cancel Edit')}
            </button>
          )}
        </div>

        <form onSubmit={handleCreateInvoice}>
          {/* ===== CUSTOMER ===== */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>👤 {t('custType', 'Customer Type')}</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button
                type="button"
                onClick={() => setInvForm({ ...f, custType: 'Individual' })}
                style={{ ...s.btn, ...(f.custType === 'Individual' ? s.btnPrimary : s.btnGhost) }}
              >
                {t('individual', 'Individual')}
              </button>
              <button
                type="button"
                onClick={() => setInvForm({ ...f, custType: 'Corporate' })}
                style={{ ...s.btn, ...(f.custType === 'Corporate' ? s.btnPrimary : s.btnGhost) }}
              >
                {t('corporate', 'Corporate')}
              </button>
            </div>

            {f.custType === 'Individual' ? (
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>{t('selectCustomer', 'Existing Customer')}</label>
                  <select
                    style={s.select}
                    value={f.custId}
                    onChange={e => {
                      const c = data.customers?.find(x => x.id === e.target.value);
                      setInvForm({
                        ...f,
                        custId: e.target.value,
                        custName: c?.name || '',
                        custPhone: c?.phone || ''
                      });
                    }}
                  >
                    <option value="new">+ {t('new', 'New Customer')}</option>
                    {(data.customers || []).map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.phone}
                        {(c.store_credit || 0) > 0 ? ` (💰 ${(c.store_credit || 0).toFixed(2)} SAR credit)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                {f.custId === 'new' && (
                  <>
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>{t('customers', 'Customer Name')}</label>
                      <input style={s.input} value={f.custName} onChange={e => setInvForm({ ...f, custName: e.target.value })} required />
                    </div>
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>{t('customerPhone', 'Phone')}</label>
                      <input style={s.input} value={f.custPhone} onChange={e => setInvForm({ ...f, custPhone: e.target.value })} />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>{t('selectCustomer', 'Existing Corporate')}</label>
                  <select
                    style={s.select}
                    value={f.corpId}
                    onChange={e => {
                      const c = data.corporates?.find(x => x.id === e.target.value);
                      setInvForm({
                        ...f,
                        corpId: e.target.value,
                        corpName: c?.name || '',
                        corpVat: c?.vat_no || '',
                        corpPhone: c?.phone || '',
                        corpAddress: c?.address || ''
                      });
                    }}
                  >
                    <option value="new">+ {t('new', 'New Corporate')}</option>
                    {(data.corporates || []).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {f.corpId === 'new' && (
                  <>
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>Company Name</label>
                      <input style={s.input} value={f.corpName} onChange={e => setInvForm({ ...f, corpName: e.target.value })} required />
                    </div>
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>VAT No.</label>
                      <input style={s.input} value={f.corpVat} onChange={e => setInvForm({ ...f, corpVat: e.target.value })} />
                    </div>
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>Phone</label>
                      <input style={s.input} value={f.corpPhone} onChange={e => setInvForm({ ...f, corpPhone: e.target.value })} />
                    </div>
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>Address</label>
                      <input style={s.input} value={f.corpAddress} onChange={e => setInvForm({ ...f, corpAddress: e.target.value })} />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ===== PREVIOUS BOOKING / CREDIT CHAIN ===== */}
          {f.custType === 'Individual' && f.custId && f.custId !== 'new' && (() => {
            const cust = data.customers?.find(c => c.id === f.custId);
            const custRefunds = (data.invoices || []).filter(i => i.customer_id === f.custId && i.invoice_no?.startsWith('REF-'));
            return (
              <div style={{ ...s.card, border: '1px solid #F59E0B' }}>
                <h3 style={{ ...s.sectionTitle, color: '#F59E0B' }}>🔗 {isAr ? 'حجز سابق / رصيد مخزن' : 'Previous Booking / Store Credit'}</h3>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '10px 16px', borderRadius: '8px' }}>
                    <div style={s.statLabel}>{isAr ? 'الرصيد المتاح' : 'Available Store Credit'}</div>
                    <div style={{ fontWeight: 700, color: '#34D399', fontSize: '16px' }}>{fmt(cust?.store_credit || 0)}</div>
                  </div>
                </div>

                {custRefunds.length > 0 && (
                  <div style={s.formGroup}>
                    <label style={s.formLabel}>{isAr ? 'ربط استرجاع سابق' : 'Link a previous refund'}</label>
                    <select
                      style={s.select}
                      value={f.linkedInvId}
                      onChange={e => {
                        const r = custRefunds.find(x => x.invoice_no === e.target.value);
                        if (!r) { setInvForm({ ...f, linkedInvId: '' }); return; }
                        setInvForm({
                          ...f,
                          linkedInvId: r.invoice_no,
                          oldTicketNo: r.old_ticket_no || '',
                          oldPnr: r.old_pnr || '',
                          oldAirline: r.old_airline || '',
                          oldSector: r.old_sector || '',
                          oldSellPrice: r.old_sell_price || 0,
                          oldBookingDate: r.old_booking_date || '',
                          oldPassengers: r.old_passengers || '',
                          oldFlightType: r.old_flight_type || '',
                          oldPaymentMethod: r.old_payment_method || '',
                          refundReason: r.refund_reason || '',
                          bookingType: 'Reissue'
                        });
                      }}
                    >
                      <option value="">— {isAr ? 'لا يوجد حجز مرتبط' : 'No linked booking'} —</option>
                      {custRefunds.map(r => (
                        <option key={r.id} value={r.invoice_no}>
                          {r.invoice_no} — refunded {fmt(r.refund_customer)} on {r.refund_date || r.invoice_date}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {f.linkedInvId && (
                  <div style={{ background: isDark ? '#0F172A' : '#F8FAFC', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: '#94A3B8', lineHeight: 1.8 }}>
                    <div>{isAr ? 'التذكرة القديمة' : 'Old ticket'}: <b style={{ color: isDark ? '#CBD5E1' : '#1E293B' }}>{f.oldTicketNo || '-'}</b> ({f.oldAirline || '-'}, {f.oldSector || '-'})</div>
                    <div>{isAr ? 'السعر الأصلي' : 'Original price'}: <b style={{ color: isDark ? '#CBD5E1' : '#1E293B' }}>{fmt(f.oldSellPrice)}</b></div>
                    <div>{isAr ? 'المسترد للعميل' : 'Refunded to customer'}: <b style={{ color: '#FBBF24' }}>{fmt(custRefunds.find(r => r.invoice_no === f.linkedInvId)?.refund_customer || 0)}</b></div>
                    <div>{isAr ? 'السبب' : 'Reason'}: {f.refundReason || '-'}</div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ===== BOOKING INFO ===== */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>📅 {isAr ? 'معلومات الحجز' : 'Booking Info'}</h3>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('invoiceDate', 'Invoice Date')}</label>
                <input type="date" style={s.input} value={f.invoiceDate} onChange={e => setInvForm({ ...f, invoiceDate: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{isAr ? 'تاريخ الحجز' : 'Booking Date'}</label>
                <input type="date" style={s.input} value={f.bookingDate} onChange={e => setInvForm({ ...f, bookingDate: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('bookingType', 'Booking Type')}</label>
                <select style={s.select} value={f.bookingType} onChange={e => setInvForm({ ...f, bookingType: e.target.value })}>
                  <option>{t('newBooking', 'New Booking')}</option>
                  <option>{t('reissue', 'Reissue')}</option>
                  <option>Date Change</option>
                  <option>Void</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('salesPerson', 'Employee')}</label>
                <select style={s.select} value={f.employeeId} onChange={e => setInvForm({ ...f, employeeId: e.target.value })}>
                  <option value="">— {isAr ? 'اختر' : 'Select'} —</option>
                  {(data.employees || []).map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('portal', 'Portal')}</label>
                <select style={s.select} value={f.portalId} onChange={e => setInvForm({ ...f, portalId: e.target.value })}>
                  <option value="">— {isAr ? 'اختر' : 'Select'} —</option>
                  {(data.portals || []).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ===== SERVICE DETAILS ===== */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>🛫 {isAr ? 'تفاصيل الخدمة' : 'Service Details'}</h3>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('service', 'Service')}</label>
                <select style={s.select} value={f.service} onChange={e => setInvForm({ ...f, service: e.target.value })}>
                  <option>{t('flightTicket', 'Flight Ticket')}</option>
                  <option>{t('hotel', 'Hotel')}</option>
                  <option>{t('visitVisa', 'Visa')}</option>
                  <option>{t('tourPackage', 'Package')}</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {f.service === 'Flight Ticket' && (
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>{t('flightType', 'Flight Type')}</label>
                  <select style={s.select} value={f.flightType} onChange={e => setInvForm({ ...f, flightType: e.target.value })}>
                    <option>{t('domestic', 'Domestic')}</option>
                    <option>{t('international', 'International')}</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Journey</label>
                  <select style={s.select} value={f.flightJourney} onChange={e => setInvForm({ ...f, flightJourney: e.target.value })}>
                    <option>Single</option>
                    <option>Return</option>
                    <option>Multi-City</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>{t('airline', 'Airline')}</label>
                  <input style={s.input} value={f.airline} onChange={e => setInvForm({ ...f, airline: e.target.value })} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>{t('sector', 'Sector')}</label>
                  <input style={s.input} value={f.flightSector} onChange={e => setInvForm({ ...f, flightSector: e.target.value })} placeholder="e.g. RUH-JED" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>{t('pnr', 'PNR')}</label>
                  <input style={s.input} value={f.pnr} onChange={e => setInvForm({ ...f, pnr: e.target.value })} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>{t('ticketNo', 'Ticket No')}</label>
                  <input style={s.input} value={f.ticketNo} onChange={e => setInvForm({ ...f, ticketNo: e.target.value })} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Refundable</label>
                  <select style={s.select} value={f.refundable} onChange={e => setInvForm({ ...f, refundable: e.target.value })}>
                    <option>Refundable</option>
                    <option>Non-Refundable</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Ticket Status</label>
                  <select style={s.select} value={f.ticketStatus} onChange={e => setInvForm({ ...f, ticketStatus: e.target.value })}>
                    <option>Confirmed</option>
                    <option>On Hold</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            )}

            {f.service === 'Hotel' && (
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Hotel Name</label>
                  <input style={s.input} value={f.hotelName} onChange={e => setInvForm({ ...f, hotelName: e.target.value })} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Check-In</label>
                  <input type="date" style={s.input} value={f.checkIn} onChange={e => setInvForm({ ...f, checkIn: e.target.value })} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Check-Out</label>
                  <input type="date" style={s.input} value={f.checkOut} onChange={e => setInvForm({ ...f, checkOut: e.target.value })} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Destination</label>
                  <input style={s.input} value={f.destination} onChange={e => setInvForm({ ...f, destination: e.target.value })} />
                </div>
              </div>
            )}

            {f.service === 'Visa' && (
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Visa Type</label>
                  <select style={s.select} value={f.visaType} onChange={e => setInvForm({ ...f, visaType: e.target.value })}>
                    <option>Tourist</option>
                    <option>Business</option>
                    <option>Work</option>
                    <option>Transit</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Destination</label>
                  <input style={s.input} value={f.destination} onChange={e => setInvForm({ ...f, destination: e.target.value })} />
                </div>
              </div>
            )}

            {(f.service === 'Package' || f.service === 'Other') && (
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Service Name</label>
                  <input style={s.input} value={f.serviceName} onChange={e => setInvForm({ ...f, serviceName: e.target.value })} />
                </div>
              </div>
            )}

            <div style={{ marginTop: '10px' }}>
              <label style={s.formLabel}>{t('passengers', 'Passengers')}</label>
              {passengers.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <input style={s.input} placeholder={`Passenger ${idx + 1} name`} value={p} onChange={e => changePassenger(idx, e.target.value)} />
                  {passengers.length > 1 && (
                    <button type="button" style={{ ...s.btn, ...s.btnDanger }} onClick={() => removePassenger(idx)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" style={{ ...s.btn, ...s.btnGhost }} onClick={addPassenger}>
                + {t('addPassenger', 'Add Passenger')}
              </button>
            </div>
          </div>

          {/* ===== PRICING ===== */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>💰 {isAr ? 'التسعير' : 'Pricing'}</h3>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('qty', 'Qty')}</label>
                <input type="number" min="1" style={s.input} value={f.qty} onChange={e => setInvForm({ ...f, qty: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('cost', 'Cost')} / unit (SAR)</label>
                <input type="number" step="0.01" style={s.input} value={f.cost} onChange={e => setInvForm({ ...f, cost: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('sell', 'Sell')} / unit (SAR)</label>
                <input type="number" step="0.01" style={s.input} value={f.sell} onChange={e => setInvForm({ ...f, sell: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('discount', 'Discount')} (SAR)</label>
                <input type="number" step="0.01" style={s.input} value={f.discount} onChange={e => setInvForm({ ...f, discount: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('vatRate', 'VAT Rate')} %</label>
                <input type="number" step="1" style={s.input} value={f.taxRate} onChange={e => setInvForm({ ...f, taxRate: e.target.value })} />
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))',
              gap: '15px',
              marginTop: '15px',
              background: isDark ? '#0F172A' : '#F8FAFC',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <div>
                <div style={s.statLabel}>Cost</div>
                <div style={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 700 }}>{fmt(cost)}</div>
              </div>
              <div>
                <div style={s.statLabel}>Sell (after disc.)</div>
                <div style={{ color: '#60A5FA', fontWeight: 700 }}>{fmt(sellAfterDiscount)}</div>
              </div>
              <div>
                <div style={s.statLabel}>VAT</div>
                <div style={{ color: '#FBBF24', fontWeight: 700 }}>{fmt(vat)}</div>
              </div>
              <div>
                <div style={s.statLabel}>Grand Total</div>
                <div style={{ color: '#34D399', fontWeight: 700, fontSize: '16px' }}>{fmt(grandTotal)}</div>
              </div>
              <div>
                <div style={s.statLabel}>Profit</div>
                <div style={{ color: profit >= 0 ? '#34D399' : '#FCA5A5', fontWeight: 700 }}>{fmt(profit)}</div>
              </div>
              <div>
                <div style={s.statLabel}>Due After Paid</div>
                <div style={{ color: dueAmount > 0 ? '#FCA5A5' : '#34D399', fontWeight: 700 }}>{fmt(dueAmount)}</div>
              </div>
            </div>
          </div>

          {/* ===== PAYMENT ===== */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>💳 {isAr ? 'الدفع' : 'Payment'}</h3>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('paymentMethod', 'Payment Method')}</label>
                <select style={s.select} value={f.payment} onChange={e => setInvForm({ ...f, payment: e.target.value })}>
                  <option>{t('cash', 'Cash')}</option>
                  <option>{t('card', 'Card / Network')}</option>
                  <option>{t('bankTransfer', 'Bank Transfer')}</option>
                  <option>{t('credit', 'Credit')}</option>
                  <option>Credit Balance</option>
                  <option>{t('tabby', 'Tabby')}</option>
                  <option>{t('tamara', 'Tamara')}</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('paidAmount', 'Amount Paid Now')} (SAR)</label>
                <input type="number" step="0.01" style={s.input} value={f.paid} onChange={e => setInvForm({ ...f, paid: e.target.value })} />
              </div>

              {f.payment === 'Credit' && (
                <>
                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Credit Due Date</label>
                    <input type="date" style={s.input} value={f.creditDueDate} onChange={e => setInvForm({ ...f, creditDueDate: e.target.value })} />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Creditor</label>
                    <select style={s.select} value={f.creditorId} onChange={e => setInvForm({ ...f, creditorId: e.target.value })}>
                      <option value="">— {isAr ? 'اختر' : 'Select'} —</option>
                      {(data.creditors || []).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {f.payment === 'Credit Balance' && (() => {
                const cust = data.customers?.find(c => c.id === f.custId);
                const available = cust?.store_credit || 0;
                const over = (parseFloat(f.useCredit) || 0) > available;
                return (
                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Use Credit (SAR) — available {fmt(available)}</label>
                    <input
                      type="number"
                      step="0.01"
                      max={available}
                      style={{ ...s.input, borderColor: over ? '#DC2626' : '#475569' }}
                      value={f.useCredit}
                      onChange={e => setInvForm({ ...f, useCredit: e.target.value })}
                    />
                    {over && <div style={{ color: '#FCA5A5', fontSize: '12px', marginTop: '4px' }}>⚠️ Exceeds available credit balance</div>}
                    <button
                      type="button"
                      style={{ ...s.btn, ...s.btnGhost, marginTop: '6px', fontSize: '11px', padding: '6px 10px' }}
                      onClick={() => setInvForm({ ...f, useCredit: Math.min(available, grandTotal) })}
                    >
                      Use max available
                    </button>
                  </div>
                );
              })()}

              {f.payment === 'Tabby' && (
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Tabby Order No.</label>
                  <input style={s.input} value={f.tabbyNo} onChange={e => setInvForm({ ...f, tabbyNo: e.target.value })} />
                </div>
              )}

              {f.payment === 'Tamara' && (
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Tamara Order No.</label>
                  <input style={s.input} value={f.tamaraNo} onChange={e => setInvForm({ ...f, tamaraNo: e.target.value })} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="submit" style={{ ...s.btn, ...s.btnSuccess, padding: '14px 30px', fontSize: '15px' }}>
              {editInvId ? '💾 ' + t('updateInvoice', 'Update Invoice') : '✅ ' + t('generateInvoice', 'Generate Invoice')}
            </button>
            <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '14px 30px' }} onClick={() => setPage('list')}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ============================================================
  // MY ATTENDANCE
  // ============================================================
  if (page === 'my_attendance') {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [leaveType, setLeaveType] = useState('Annual');
    const [leaveStart, setLeaveStart] = useState(today);
    const [leaveEnd, setLeaveEnd] = useState(today);
    const employeeId = userProfile?.employee_id;

    const load = async () => {
      if (!employeeId) { setLoading(false); return; }
      setLoading(true);
      const { data: rowsData, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('tenant_id', userProfile.tenant_id)
        .order('date', { ascending: false })
        .limit(60);
      if (!error) setRows(rowsData || []);
      setLoading(false);
    };

    useEffect(() => { load(); }, [employeeId]);

    const todayRow = rows.find(r => r.date === today);

    const checkIn = async () => {
      const time = new Date().toTimeString().slice(0, 8);
      try {
        if (todayRow) {
          await supabase.from('attendance').update({ check_in: time, status: 'Present' }).eq('id', todayRow.id);
        } else {
          await supabase.from('attendance').insert([{
            employee_id: employeeId,
            tenant_id: userProfile.tenant_id,
            date: today,
            check_in: time,
            status: 'Present'
          }]);
        }
        showToast?.('✅ Checked in at ' + time);
        load();
      } catch (err) {
        showToast?.('Error: ' + err.message);
      }
    };

    const checkOut = async () => {
      const time = new Date().toTimeString().slice(0, 8);
      try {
        if (todayRow) await supabase.from('attendance').update({ check_out: time }).eq('id', todayRow.id);
        showToast?.('✅ Checked out at ' + time);
        load();
      } catch (err) {
        showToast?.('Error: ' + err.message);
      }
    };

    const requestLeave = async (e) => {
      e.preventDefault();
      try {
        await supabase.from('attendance').insert([{
          employee_id: employeeId,
          tenant_id: userProfile.tenant_id,
          date: leaveStart,
          status: 'Leave',
          leave_type: leaveType,
          leave_start: leaveStart,
          leave_end: leaveEnd
        }]);
        showToast?.('📝 Leave request submitted');
        load();
      } catch (err) {
        showToast?.('Error: ' + err.message);
      }
    };

    return (
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>⏰ {t('my_attendance', 'My Attendance')}</h1>
        </div>

        {!employeeId ? (
          <div style={s.card}>
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>🔗</div>
              <h2 style={{ color: '#FBBF24', marginBottom: '10px' }}>
                {isAr ? 'الحساب غير مرتبط' : 'Account Not Linked'}
              </h2>
              <p style={{ color: '#94A3B8', maxWidth: '480px', margin: '0 auto' }}>
                {isAr
                  ? 'حسابك غير مرتبط بسجل الموظف. اطلب من المدير ربط حسابك.'
                  : 'Your account is not linked to an employee record. Ask admin to link your account.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div style={s.card}>
              <h3 style={{ ...s.sectionTitle, border: 'none', margin: 0, marginBottom: '15px' }}>
                {isAr ? 'اليوم' : 'Today'} — {today}
              </h3>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>Check-In: <b style={{ color: '#34D399' }}>{todayRow?.check_in || '—'}</b></div>
                <div>Check-Out: <b style={{ color: '#FBBF24' }}>{todayRow?.check_out || '—'}</b></div>
                <div>Status: <b>{todayRow?.status || 'Not marked'}</b></div>
                <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                  <button style={{ ...s.btn, ...s.btnSuccess }} onClick={checkIn} disabled={!!todayRow?.check_in}>
                    🟢 {isAr ? 'تسجيل الدخول' : 'Check In'}
                  </button>
                  <button style={{ ...s.btn, ...s.btnWarning }} onClick={checkOut} disabled={!todayRow?.check_in || !!todayRow?.check_out}>
                    🔴 {isAr ? 'تسجيل الخروج' : 'Check Out'}
                  </button>
                </div>
              </div>
            </div>

            <div style={s.card}>
              <h3 style={{ ...s.sectionTitle, border: 'none', margin: 0, marginBottom: '15px' }}>
                {isAr ? 'طلب إجازة' : 'Request Leave'}
              </h3>
              <form onSubmit={requestLeave} style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>{isAr ? 'نوع الإجازة' : 'Leave Type'}</label>
                  <select style={s.select} value={leaveType} onChange={e => setLeaveType(e.target.value)}>
                    <option>Annual</option>
                    <option>Sick</option>
                    <option>Emergency</option>
                    <option>Unpaid</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>{isAr ? 'من' : 'From'}</label>
                  <input type="date" style={s.input} value={leaveStart} onChange={e => setLeaveStart(e.target.value)} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>{isAr ? 'إلى' : 'To'}</label>
                  <input type="date" style={s.input} value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} />
                </div>
                <div style={{ ...s.formGroup, display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" style={{ ...s.btn, ...s.btnPrimary, width: '100%' }}>
                    {isAr ? 'إرسال الطلب' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>

            <div style={s.card}>
              <h3 style={{ ...s.sectionTitle, border: 'none', margin: 0, marginBottom: '15px' }}>
                {isAr ? 'السجل (آخر 60)' : 'History (last 60)'}
              </h3>
              {loading ? (
                <p style={{ color: '#94A3B8' }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
              ) : rows.length === 0 ? (
                <p style={{ color: '#94A3B8' }}>{isAr ? 'لا توجد سجلات حضورية بعد.' : 'No attendance records yet.'}</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Date</th>
                        <th style={s.th}>Status</th>
                        <th style={s.th}>Check-In</th>
                        <th style={s.th}>Check-Out</th>
                        <th style={s.th}>Leave</th>
                        <th style={{ ...s.th, textAlign: 'right' }}>OT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(r => (
                        <tr key={r.id}>
                          <td style={s.td}>{r.date}</td>
                          <td style={s.td}>{r.status || '-'}</td>
                          <td style={s.td}>{r.check_in || '-'}</td>
                          <td style={s.td}>{r.check_out || '-'}</td>
                          <td style={s.td}>{r.leave_type ? `${r.leave_type} (${r.leave_start}→${r.leave_end})` : '-'}</td>
                          <td style={s.tdRight}>{r.overtime || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // ============================================================
  // HR - COMPLETE EMPLOYEE 360
  // ============================================================
  if (page === 'hr' || page === 'hr_advanced') {
    const isBasicHR = page === 'hr';
    const [tab, setTab] = useState('directory');
    const daysLeft = (d) => d ? Math.ceil((new Date(d) - new Date(today)) / 86400000) : null;

    const TabBtn = ({ id, label }) => (
      <button
        style={{ ...s.btn, ...(tab === id ? s.btnPrimary : s.btnGhost) }}
        onClick={() => setTab(id)}
      >
        {label}
      </button>
    );

    return (
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>
            {isBasicHR ? '👤 ' + t('hr', 'HR Directory') : '👨‍💼 ' + t('hr_advanced', 'HR & Payroll')}
          </h1>
        </div>

        {!isBasicHR && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <TabBtn id="directory" label="👤 Directory" />
            <TabBtn id="advances" label="💵 Advances" />
            <TabBtn id="mistakes" label="⚠️ Mistakes" />
            <TabBtn id="payroll" label="🧾 Payroll" />
          </div>
        )}

        {(isBasicHR || tab === 'directory') && (
          <>
            <div style={s.card}>
              <h3 style={s.sectionTitle}>{editEmpId ? '✏️ Edit Employee' : '+ Add Employee'}</h3>
              <form onSubmit={handleAddEditEmp} style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Full Name</label>
                  <input style={s.input} value={empForm.name} onChange={e => setEmpForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Job Title</label>
                  <input style={s.input} value={empForm.job_title} onChange={e => setEmpForm(p => ({ ...p, job_title: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Role</label>
                  <select style={s.select} value={empForm.role} onChange={e => setEmpForm(p => ({ ...p, role: e.target.value }))}>
                    <option>Sales</option>
                    <option>Accountant</option>
                    <option>Manager</option>
                    <option>HR</option>
                    <option>Admin</option>
                    <option>Support</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Phone</label>
                  <input style={s.input} value={empForm.phone} onChange={e => setEmpForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Nationality</label>
                  <input style={s.input} value={empForm.nationality} onChange={e => setEmpForm(p => ({ ...p, nationality: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Iqama No.</label>
                  <input style={s.input} value={empForm.iqama_no} onChange={e => setEmpForm(p => ({ ...p, iqama_no: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Iqama Expiry</label>
                  <input type="date" style={s.input} value={empForm.iqama_expiry} onChange={e => setEmpForm(p => ({ ...p, iqama_expiry: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Labor Office Renewal</label>
                  <input type="date" style={s.input} value={empForm.labor_office_expiry} onChange={e => setEmpForm(p => ({ ...p, labor_office_expiry: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Join Date</label>
                  <input type="date" style={s.input} value={empForm.join_date} onChange={e => setEmpForm(p => ({ ...p, join_date: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Salary (SAR)</label>
                  <input type="number" style={s.input} value={empForm.salary} onChange={e => setEmpForm(p => ({ ...p, salary: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Commission %</label>
                  <input type="number" style={s.input} value={empForm.commission_rate} onChange={e => setEmpForm(p => ({ ...p, commission_rate: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Bank Name</label>
                  <input style={s.input} value={empForm.bank_name} onChange={e => setEmpForm(p => ({ ...p, bank_name: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Bank Account / IBAN</label>
                  <input style={s.input} value={empForm.bank_account} onChange={e => setEmpForm(p => ({ ...p, bank_account: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ ...s.btn, ...s.btnSuccess }}>
                    {editEmpId ? '💾 Save Changes' : '➕ Add Employee'}
                  </button>
                  {editEmpId && (
                    <button type="button" style={{ ...s.btn, ...s.btnGhost }} onClick={() => setEditEmpId(null)}>
                      ✕ Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div style={s.card}>
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Name</th>
                      <th style={s.th}>Title</th>
                      <th style={s.th}>Phone</th>
                      <th style={{ ...s.th, textAlign: 'right' }}>Salary</th>
                      <th style={s.th}>Iqama Expiry</th>
                      <th style={s.th}>Labor Office</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.employees || []).map(emp => {
                      const iqDays = daysLeft(emp.iqama_expiry);
                      const laDays = daysLeft(emp.labor_office_expiry);
                      return (
                        <tr key={emp.id}>
                          <td style={{ ...s.td, fontWeight: 700 }}>{emp.name}</td>
                          <td style={s.td}>{emp.job_title || emp.role || '-'}</td>
                          <td style={s.td}>{emp.phone || '-'}</td>
                          <td style={s.tdRight}>{fmt(emp.salary)}</td>
                          <td style={s.td}>
                            {emp.iqama_expiry || '-'}
                            {iqDays !== null && iqDays <= 30 && (
                              <span style={{ ...s.badge, ...s.badgeUnpaid, marginLeft: 6 }}>
                                {iqDays < 0 ? 'EXPIRED' : iqDays + 'd left'}
                              </span>
                            )}
                          </td>
                          <td style={s.td}>
                            {emp.labor_office_expiry || '-'}
                            {laDays !== null && laDays <= 30 && (
                              <span style={{ ...s.badge, ...s.badgeUnpaid, marginLeft: 6 }}>
                                {laDays < 0 ? 'EXPIRED' : laDays + 'd left'}
                              </span>
                            )}
                          </td>
                          <td style={s.tdCenter}>
                            <button style={{ ...s.btn, ...s.btnGhost, padding: '6px 10px', marginRight: 6 }} onClick={() => handleEditEmp(emp)}>
                              ✏️
                            </button>
                            <button style={{ ...s.btn, ...s.btnDanger, padding: '6px 10px' }} onClick={() => handleDelete('employees', emp.id)}>
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ===== ADVANCES ===== */}
        {tab === 'advances' && (
          <>
            <div style={s.card}>
              <h3 style={s.sectionTitle}>+ New Advance / Loan</h3>
              <form onSubmit={handleAddAdvance} style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Employee</label>
                  <select style={s.select} value={advForm.employee_id} onChange={e => setAdvForm(p => ({ ...p, employee_id: e.target.value }))} required>
                    <option value="">— Select —</option>
                    {(data.employees || []).map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Amount (SAR)</label>
                  <input type="number" step="0.01" style={s.input} value={advForm.amount} onChange={e => setAdvForm(p => ({ ...p, amount: e.target.value }))} required />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Date</label>
                  <input type="date" style={s.input} value={advForm.date} onChange={e => setAdvForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Status</label>
                  <select style={s.select} value={advForm.status} onChange={e => setAdvForm(p => ({ ...p, status: e.target.value }))}>
                    <option>Pending</option>
                    <option>Repaid</option>
                    <option>Deducted from Salary</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" style={{ ...s.btn, ...s.btnSuccess, width: '100%' }}>
                    + Add Advance
                  </button>
                </div>
              </form>
            </div>

            <div style={s.card}>
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Employee</th>
                      <th style={s.th}>Date</th>
                      <th style={{ ...s.th, textAlign: 'right' }}>Amount</th>
                      <th style={s.th}>Status</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.empAdvances || []).map(a => (
                      <tr key={a.id}>
                        <td style={s.td}>{a.employees?.name || '-'}</td>
                        <td style={s.td}>{a.date}</td>
                        <td style={s.tdRight}>{fmt(a.amount)}</td>
                        <td style={s.td}>
                          <select
                            style={{ ...s.select, padding: '4px 8px', fontSize: '12px' }}
                            value={a.status}
                            onChange={e => handleUpdateAdvanceStatus(a, e.target.value)}
                          >
                            <option>Pending</option>
                            <option>Repaid</option>
                            <option>Deducted from Salary</option>
                          </select>
                        </td>
                        <td style={s.tdCenter}>
                          <button style={{ ...s.btn, ...s.btnDanger, padding: '6px 10px' }} onClick={() => handleDeleteAdvance(a)}>
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(data.empAdvances || []).length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ ...s.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                          {isAr ? 'لا توجد سلفات بعد.' : 'No advances yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ===== STAFF MISTAKES ===== */}
        {tab === 'mistakes' && (
          <>
            <div style={s.card}>
              <h3 style={s.sectionTitle}>+ Log a Mistake / Loss</h3>
              <form onSubmit={handleAddMistake} style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Employee</label>
                  <select name="emp" style={s.select} required>
                    <option value="">— Select —</option>
                    {(data.employees || []).map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>What happened (reason)</label>
                  <input name="reason" style={s.input} placeholder="e.g. wrong date entered" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Old Ticket No.</label>
                  <input name="old_tkt" style={s.input} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>New/Corrected Ticket</label>
                  <input name="new_tkt" style={s.input} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Loss Amount (SAR)</label>
                  <input name="loss_amt" type="number" step="0.01" style={s.input} />
                </div>
                <div style={{ ...s.formGroup, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: isDark ? '#CBD5E1' : '#1E293B', fontSize: 13 }}>
                    <input type="checkbox" name="paid_by_emp" /> Deduct from salary
                  </label>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" style={{ ...s.btn, ...s.btnWarning }}>⚠️ Log Mistake</button>
                </div>
              </form>
            </div>

            <div style={s.card}>
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Employee</th>
                      <th style={s.th}>Reason</th>
                      <th style={{ ...s.th, textAlign: 'right' }}>Loss</th>
                      <th style={s.th}>Deducted?</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.staffMistakes || []).map(m => (
                      <tr key={m.id}>
                        <td style={s.td}>{m.employees?.name || '-'}</td>
                        <td style={s.td}>{m.reason || '-'}</td>
                        <td style={s.tdRight}>{fmt(m.loss_amount)}</td>
                        <td style={s.td}>{m.paid_by_employee ? 'Yes' : 'No'}</td>
                        <td style={s.tdCenter}>
                          <button style={{ ...s.btn, ...s.btnGhost, padding: '6px 10px', marginRight: 6 }} onClick={() => handlePreviewMistake(m)}>
                            👁️
                          </button>
                          <button style={{ ...s.btn, ...s.btnDanger, padding: '6px 10px' }} onClick={() => handleDeleteMistake(m)}>
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(data.staffMistakes || []).length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ ...s.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                          {isAr ? 'لا توجد أخطاء مسجلة.' : 'No mistakes logged.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ===== PAYROLL ===== */}
        {tab === 'payroll' && (
          <>
            <div style={s.card}>
              <h3 style={s.sectionTitle}>💰 Process Salary</h3>
              <form onSubmit={handleProcessPayroll} style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Employee</label>
                  <select style={s.select} value={payForm.employee_id} onChange={e => setPayForm(p => ({ ...p, employee_id: e.target.value }))} required>
                    <option value="">— Select —</option>
                    {(data.employees || []).map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Month</label>
                  <input type="month" style={s.input} value={payForm.month} onChange={e => setPayForm(p => ({ ...p, month: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Overtime (SAR)</label>
                  <input type="number" style={s.input} value={payForm.overtime} onChange={e => setPayForm(p => ({ ...p, overtime: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Gift/Bonus (SAR)</label>
                  <input type="number" style={s.input} value={payForm.gift} onChange={e => setPayForm(p => ({ ...p, gift: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Advance Deduction (SAR)</label>
                  <input type="number" style={s.input} value={payForm.advance} onChange={e => setPayForm(p => ({ ...p, advance: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Mistakes Deduction (SAR)</label>
                  <input type="number" style={s.input} value={payForm.mistakes_deduction} onChange={e => setPayForm(p => ({ ...p, mistakes_deduction: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Other Deduction (SAR)</label>
                  <input type="number" style={s.input} value={payForm.other_deduction} onChange={e => setPayForm(p => ({ ...p, other_deduction: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Payment Mode</label>
                  <select style={s.select} value={payForm.payment_mode} onChange={e => setPayForm(p => ({ ...p, payment_mode: e.target.value }))}>
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Payment Date</label>
                  <input type="date" style={s.input} value={payForm.payment_date} onChange={e => setPayForm(p => ({ ...p, payment_date: e.target.value }))} />
                </div>
                <div style={s.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label style={s.formLabel}>Notes</label>
                  <input style={s.input} value={payForm.notes} onChange={e => setPayForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" style={{ ...s.btn, ...s.btnSuccess }}>
                    💰 Process Salary
                  </button>
                </div>
              </form>
              <p style={{ color: '#94A3B8', fontSize: 12, marginTop: 10 }}>
                {isAr ? 'تحتسب العمولة تلقائياً من فواتير الموظف للشهر المحدد.' : 'Commission is calculated automatically from employee invoices for the selected month.'}
              </p>
            </div>

            <div style={s.card}>
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Employee</th>
                      <th style={s.th}>Month</th>
                      <th style={{ ...s.th, textAlign: 'right' }}>Gross</th>
                      <th style={{ ...s.th, textAlign: 'right' }}>Deductions</th>
                      <th style={{ ...s.th, textAlign: 'right' }}>Net Pay</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.payroll || []).map(p => (
                      <tr key={p.id}>
                        <td style={s.td}>{p.employees?.name || '-'}</td>
                        <td style={s.td}>{p.month}</td>
                        <td style={s.tdRight}>{fmt(p.gross_salary)}</td>
                        <td style={s.tdRight}>{fmt(p.total_deductions)}</td>
                        <td style={{ ...s.tdRight, color: '#34D399' }}>{fmt(p.amount)}</td>
                        <td style={s.tdCenter}>
                          <button style={{ ...s.btn, ...s.btnGhost, padding: '6px 10px', marginRight: 6 }} onClick={() => handleGenerateSlip(p)}>
                            🧾
                          </button>
                          <button style={{ ...s.btn, ...s.btnDanger, padding: '6px 10px' }} onClick={() => handleDeletePayroll(p)}>
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(data.payroll || []).length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ ...s.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                          {isAr ? 'لا توجد قسائم رواتب بعد.' : 'No salary slips yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}
