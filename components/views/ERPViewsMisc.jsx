'use client';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

export default function ERPViewsMisc(props) {
  const {
    page, data, tr, setPage, showToast, today, userProfile,
    invForm, setInvForm, editInvId, setEditInvId, handleCreateInvoice,
  } = props;

  const t = (key, fallback) => tr?.[key] || fallback || key;
  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';

  const s = {
    container: { padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' },
    card: { background: '#1E293B', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #334155' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 },
    input: { padding: '10px 15px', background: '#0F172A', border: '1px solid #475569', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
    select: { padding: '10px 15px', background: '#0F172A', border: '1px solid #475569', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
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
    badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-block' },
    badgePaid: { background: '#065F46', color: '#34D399' },
    badgeUnpaid: { background: '#78350F', color: '#FBBF24' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '20px' },
    statCard: { background: 'linear-gradient(135deg, #1E293B, #0F172A)', padding: '18px', borderRadius: '12px', border: '1px solid #334155' },
    statLabel: { fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statValue: { fontSize: '22px', fontWeight: '700', color: '#FBBF24', marginTop: '5px' },
    emptyState: { textAlign: 'center', padding: '60px 20px', color: '#64748B' },
    emptyIcon: { fontSize: '60px', marginBottom: '15px' },
    formGroup: { marginBottom: '15px' },
    formLabel: { display: 'block', marginBottom: '5px', color: '#94A3B8', fontSize: '13px', fontWeight: '600' },
    formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' },
    sectionTitle: { color: '#FBBF24', fontSize: '15px', fontWeight: '700', margin: '0 0 15px', paddingBottom: '10px', borderBottom: '1px solid #334155' },
  };

  const set = (patch) => setInvForm(prev => ({ ...prev, ...patch }));

  // ═══════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════
  if (page === 'dashboard') {
    const invoices = (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-'));
    const totalRevenue = invoices.reduce((sum, i) => sum + (i.total_sell || i.total || 0), 0);
    const totalPaid = invoices.reduce((sum, i) => sum + (i.paid_amount || 0), 0);
    const totalDue = invoices.reduce((sum, i) => sum + (i.due_amount || 0), 0);
    const totalExpenses = (data.expenses || []).reduce((sum, e) => sum + (e.amount || parseFloat(e.total) || 0), 0);
    const unpaidCount = invoices.filter(i => i.status === 'Unpaid').length;
    const portalBalance = (data.portals || []).reduce((sum, p) => sum + (p.current_balance || p.balance || 0), 0);

    return (
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>📊 {t('dashboard', 'Dashboard')}</h1>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div style={s.statsGrid}>
          <div style={s.statCard}><div style={s.statLabel}>Total Revenue</div><div style={{ ...s.statValue, color: '#34D399' }}>{fmt(totalRevenue)}</div></div>
          <div style={s.statCard}><div style={s.statLabel}>Total Paid</div><div style={{ ...s.statValue, color: '#34D399' }}>{fmt(totalPaid)}</div></div>
          <div style={s.statCard}><div style={s.statLabel}>Outstanding</div><div style={{ ...s.statValue, color: totalDue > 0 ? '#FCA5A5' : '#34D399' }}>{fmt(totalDue)}</div></div>
          <div style={s.statCard}><div style={s.statLabel}>Unpaid Invoices</div><div style={{ ...s.statValue, color: unpaidCount > 0 ? '#FBBF24' : '#34D399' }}>{unpaidCount}</div></div>
          <div style={s.statCard}><div style={s.statLabel}>Total Expenses</div><div style={{ ...s.statValue, color: '#FCA5A5' }}>{fmt(totalExpenses)}</div></div>
          <div style={s.statCard}><div style={s.statLabel}>Net Position</div><div style={{ ...s.statValue, color: (totalRevenue - totalExpenses) >= 0 ? '#34D399' : '#FCA5A5' }}>{fmt(totalRevenue - totalExpenses)}</div></div>
          <div style={s.statCard}><div style={s.statLabel}>Portal Balance</div><div style={{ ...s.statValue, color: portalBalance >= 0 ? '#60A5FA' : '#FCA5A5' }}>{fmt(portalBalance)}</div></div>
          <div style={s.statCard}><div style={s.statLabel}>Total Customers</div><div style={{ ...s.statValue, color: '#A78BFA' }}>{(data.customers || []).length}</div></div>
        </div>

        <div style={s.card}>
          <h3 style={{ color: '#FBBF24', marginBottom: '15px', marginTop: 0 }}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ ...s.btn, ...s.btnPrimary }} onClick={() => setPage('create')}>+ {t('create', 'Create Invoice')}</button>
            <button style={{ ...s.btn, ...s.btnSuccess }} onClick={() => setPage('list')}>📋 {t('list', 'View Invoices')}</button>
            <button style={{ ...s.btn, ...s.btnWarning }} onClick={() => setPage('refunds')}>🔄 {t('refunds', 'Refunds')}</button>
            <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => setPage('customers')}>👥 {t('customers', 'Customers')}</button>
            <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => setPage('reports')}>📊 Reports</button>
            <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => setPage('my_attendance')}>⏰ Attendance</button>
          </div>
        </div>

        <div style={s.card}>
          <h3 style={{ color: '#FBBF24', marginBottom: '15px', marginTop: 0 }}>📄 Recent Invoices</h3>
          {invoices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}><p>No invoices yet. Create your first invoice!</p></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead><tr>
                  <th style={s.th}>Inv No</th><th style={s.th}>Date</th><th style={s.th}>Customer</th>
                  <th style={s.th}>Airline</th><th style={{ ...s.th, textAlign: 'right' }}>Total</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Due</th><th style={{ ...s.th, textAlign: 'center' }}>Status</th>
                </tr></thead>
                <tbody>
                  {invoices.slice(0, 10).map(inv => (
                    <tr key={inv.id}>
                      <td style={{ ...s.td, fontWeight: '700', color: '#60A5FA' }}>{inv.invoice_no}</td>
                      <td style={s.td}>{inv.invoice_date}</td>
                      <td style={s.td}>{inv.customers?.name || inv.corporates?.name || 'N/A'}</td>
                      <td style={s.td}>{inv.airline || '-'}</td>
                      <td style={s.tdRight}>{fmt(inv.total_sell)}</td>
                      <td style={{ ...s.tdRight, color: inv.due_amount > 0 ? '#FCA5A5' : '#34D399' }}>{fmt(inv.due_amount)}</td>
                      <td style={s.tdCenter}><span style={{ ...s.badge, ...(inv.status === 'Paid' ? s.badgePaid : s.badgeUnpaid) }}>{inv.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={s.card}>
          <h3 style={{ color: '#FBBF24', marginBottom: '15px', marginTop: 0 }}>🛫 Portal Balances</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {(data.portals || []).map(p => (
              <div key={p.id} style={{ background: '#0F172A', padding: '15px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#CBD5E1', fontSize: '13px' }}>{p.name}</span>
                <span style={{ color: (p.current_balance || p.balance || 0) < 1000 ? '#FCA5A5' : '#34D399', fontWeight: '700', fontSize: '14px' }}>{fmt(p.current_balance || p.balance)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // CREATE / EDIT INVOICE — full working form wired to handleCreateInvoice
  // ═══════════════════════════════════════════════════════════════
  if (page === 'create') {
    const f = invForm || {};
    const passengers = f.passengers?.length ? f.passengers : [''];

    const addPassenger = () => set({ passengers: [...passengers, ''] });
    const removePassenger = (idx) => set({ passengers: passengers.filter((_, i) => i !== idx) });
    const changePassenger = (idx, val) => set({ passengers: passengers.map((p, i) => i === idx ? val : p) });

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
            <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => { setEditInvId?.(null); setPage('list'); }}>✕ {t('cancel', 'Cancel Edit')}</button>
          )}
        </div>

        <form onSubmit={handleCreateInvoice}>
          {/* CUSTOMER */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>👤 {t('custType', 'Customer Type')}</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button type="button" onClick={() => set({ custType: 'Individual' })} style={{ ...s.btn, ...(f.custType === 'Individual' ? s.btnPrimary : s.btnGhost) }}>Individual</button>
              <button type="button" onClick={() => set({ custType: 'Corporate' })} style={{ ...s.btn, ...(f.custType === 'Corporate' ? s.btnPrimary : s.btnGhost) }}>Corporate</button>
            </div>

            {f.custType === 'Individual' ? (
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Existing Customer</label>
                  <select style={s.select} value={f.custId} onChange={e => {
                    const c = data.customers?.find(x => x.id === e.target.value);
                    set({ custId: e.target.value, custName: c?.name || '', custPhone: c?.phone || '' });
                  }}>
                    <option value="new">+ New Customer</option>
                    {(data.customers || []).map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
                  </select>
                </div>
                {f.custId === 'new' && (<>
                  <div style={s.formGroup}><label style={s.formLabel}>Customer Name</label><input style={s.input} value={f.custName} onChange={e => set({ custName: e.target.value })} required /></div>
                  <div style={s.formGroup}><label style={s.formLabel}>Phone</label><input style={s.input} value={f.custPhone} onChange={e => set({ custPhone: e.target.value })} /></div>
                </>)}
              </div>
            ) : (
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Existing Corporate</label>
                  <select style={s.select} value={f.corpId} onChange={e => {
                    const c = data.corporates?.find(x => x.id === e.target.value);
                    set({ corpId: e.target.value, corpName: c?.name || '', corpVat: c?.vat_no || '', corpPhone: c?.phone || '', corpAddress: c?.address || '' });
                  }}>
                    <option value="new">+ New Corporate</option>
                    {(data.corporates || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                {f.corpId === 'new' && (<>
                  <div style={s.formGroup}><label style={s.formLabel}>Company Name</label><input style={s.input} value={f.corpName} onChange={e => set({ corpName: e.target.value })} required /></div>
                  <div style={s.formGroup}><label style={s.formLabel}>VAT No.</label><input style={s.input} value={f.corpVat} onChange={e => set({ corpVat: e.target.value })} /></div>
                  <div style={s.formGroup}><label style={s.formLabel}>Phone</label><input style={s.input} value={f.corpPhone} onChange={e => set({ corpPhone: e.target.value })} /></div>
                  <div style={s.formGroup}><label style={s.formLabel}>Address</label><input style={s.input} value={f.corpAddress} onChange={e => set({ corpAddress: e.target.value })} /></div>
                </>)}
              </div>
            )}
          </div>

          {/* BOOKING */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>📅 Booking Info</h3>
            <div style={s.formRow}>
              <div style={s.formGroup}><label style={s.formLabel}>{t('invoiceDate', 'Invoice Date')}</label><input type="date" style={s.input} value={f.invoiceDate} onChange={e => set({ invoiceDate: e.target.value })} /></div>
              <div style={s.formGroup}><label style={s.formLabel}>Booking Date</label><input type="date" style={s.input} value={f.bookingDate} onChange={e => set({ bookingDate: e.target.value })} /></div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>{t('bookingType', 'Booking Type')}</label>
                <select style={s.select} value={f.bookingType} onChange={e => set({ bookingType: e.target.value })}>
                  <option>New Booking</option><option>Reissue</option><option>Date Change</option><option>Void</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Employee</label>
                <select style={s.select} value={f.employeeId} onChange={e => set({ employeeId: e.target.value })}>
                  <option value="">— Select —</option>
                  {(data.employees || []).map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Portal / Supplier</label>
                <select style={s.select} value={f.portalId} onChange={e => set({ portalId: e.target.value })}>
                  <option value="">— Select —</option>
                  {(data.portals || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* SERVICE */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>🛫 Service Details</h3>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Service</label>
                <select style={s.select} value={f.service} onChange={e => set({ service: e.target.value })}>
                  <option>Flight Ticket</option><option>Hotel</option><option>Visa</option><option>Package</option><option>Other</option>
                </select>
              </div>
            </div>

            {f.service === 'Flight Ticket' && (
              <div style={s.formRow}>
                <div style={s.formGroup}><label style={s.formLabel}>Flight Type</label>
                  <select style={s.select} value={f.flightType} onChange={e => set({ flightType: e.target.value })}><option>Domestic</option><option>International</option></select>
                </div>
                <div style={s.formGroup}><label style={s.formLabel}>Journey</label>
                  <select style={s.select} value={f.flightJourney} onChange={e => set({ flightJourney: e.target.value })}><option>Single</option><option>Return</option><option>Multi-City</option></select>
                </div>
                <div style={s.formGroup}><label style={s.formLabel}>Airline</label><input style={s.input} value={f.airline} onChange={e => set({ airline: e.target.value })} /></div>
                <div style={s.formGroup}><label style={s.formLabel}>Sector (e.g. RUH-JED)</label><input style={s.input} value={f.flightSector} onChange={e => set({ flightSector: e.target.value })} /></div>
                <div style={s.formGroup}><label style={s.formLabel}>PNR</label><input style={s.input} value={f.pnr} onChange={e => set({ pnr: e.target.value })} /></div>
                <div style={s.formGroup}><label style={s.formLabel}>Ticket No.</label><input style={s.input} value={f.ticketNo} onChange={e => set({ ticketNo: e.target.value })} /></div>
                <div style={s.formGroup}><label style={s.formLabel}>Refundable</label>
                  <select style={s.select} value={f.refundable} onChange={e => set({ refundable: e.target.value })}><option>Refundable</option><option>Non-Refundable</option></select>
                </div>
                <div style={s.formGroup}><label style={s.formLabel}>Ticket Status</label>
                  <select style={s.select} value={f.ticketStatus} onChange={e => set({ ticketStatus: e.target.value })}><option>Confirmed</option><option>On Hold</option><option>Cancelled</option></select>
                </div>
              </div>
            )}

            {f.service === 'Hotel' && (
              <div style={s.formRow}>
                <div style={s.formGroup}><label style={s.formLabel}>Hotel Name</label><input style={s.input} value={f.hotelName} onChange={e => set({ hotelName: e.target.value })} /></div>
                <div style={s.formGroup}><label style={s.formLabel}>Check-In</label><input type="date" style={s.input} value={f.checkIn} onChange={e => set({ checkIn: e.target.value })} /></div>
                <div style={s.formGroup}><label style={s.formLabel}>Check-Out</label><input type="date" style={s.input} value={f.checkOut} onChange={e => set({ checkOut: e.target.value })} /></div>
                <div style={s.formGroup}><label style={s.formLabel}>Destination</label><input style={s.input} value={f.destination} onChange={e => set({ destination: e.target.value })} /></div>
              </div>
            )}

            {f.service === 'Visa' && (
              <div style={s.formRow}>
                <div style={s.formGroup}><label style={s.formLabel}>Visa Type</label>
                  <select style={s.select} value={f.visaType} onChange={e => set({ visaType: e.target.value })}><option>Tourist</option><option>Business</option><option>Work</option><option>Transit</option></select>
                </div>
                <div style={s.formGroup}><label style={s.formLabel}>Destination</label><input style={s.input} value={f.destination} onChange={e => set({ destination: e.target.value })} /></div>
              </div>
            )}

            {(f.service === 'Package' || f.service === 'Other') && (
              <div style={s.formRow}>
                <div style={s.formGroup}><label style={s.formLabel}>Service Name</label><input style={s.input} value={f.serviceName} onChange={e => set({ serviceName: e.target.value })} /></div>
              </div>
            )}

            <div style={{ marginTop: '10px' }}>
              <label style={s.formLabel}>Passengers</label>
              {passengers.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <input style={s.input} placeholder={`Passenger ${idx + 1} name`} value={p} onChange={e => changePassenger(idx, e.target.value)} />
                  {passengers.length > 1 && <button type="button" style={{ ...s.btn, ...s.btnDanger }} onClick={() => removePassenger(idx)}>✕</button>}
                </div>
              ))}
              <button type="button" style={{ ...s.btn, ...s.btnGhost }} onClick={addPassenger}>+ Add Passenger</button>
            </div>
          </div>

          {/* PRICING */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>💰 Pricing</h3>
            <div style={s.formRow}>
              <div style={s.formGroup}><label style={s.formLabel}>Qty</label><input type="number" min="1" style={s.input} value={f.qty} onChange={e => set({ qty: e.target.value })} /></div>
              <div style={s.formGroup}><label style={s.formLabel}>Cost / unit (SAR)</label><input type="number" step="0.01" style={s.input} value={f.cost} onChange={e => set({ cost: e.target.value })} /></div>
              <div style={s.formGroup}><label style={s.formLabel}>Sell / unit (SAR)</label><input type="number" step="0.01" style={s.input} value={f.sell} onChange={e => set({ sell: e.target.value })} /></div>
              <div style={s.formGroup}><label style={s.formLabel}>Discount (SAR)</label><input type="number" step="0.01" style={s.input} value={f.discount} onChange={e => set({ discount: e.target.value })} /></div>
              <div style={s.formGroup}><label style={s.formLabel}>{t('vatRate', 'VAT Rate')} %</label><input type="number" step="1" style={s.input} value={f.taxRate} onChange={e => set({ taxRate: e.target.value })} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '15px', marginTop: '15px', background: '#0F172A', padding: '15px', borderRadius: '8px' }}>
              <div><div style={s.statLabel}>Cost</div><div style={{ color: '#94A3B8', fontWeight: '700' }}>{fmt(cost)}</div></div>
              <div><div style={s.statLabel}>Sell (after disc.)</div><div style={{ color: '#60A5FA', fontWeight: '700' }}>{fmt(sellAfterDiscount)}</div></div>
              <div><div style={s.statLabel}>VAT</div><div style={{ color: '#FBBF24', fontWeight: '700' }}>{fmt(vat)}</div></div>
              <div><div style={s.statLabel}>Grand Total</div><div style={{ color: '#34D399', fontWeight: '700', fontSize: '16px' }}>{fmt(grandTotal)}</div></div>
              <div><div style={s.statLabel}>Profit</div><div style={{ color: profit >= 0 ? '#34D399' : '#FCA5A5', fontWeight: '700' }}>{fmt(profit)}</div></div>
              <div><div style={s.statLabel}>Due After Paid</div><div style={{ color: dueAmount > 0 ? '#FCA5A5' : '#34D399', fontWeight: '700' }}>{fmt(dueAmount)}</div></div>
            </div>
          </div>

          {/* PAYMENT */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>💳 Payment</h3>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Payment Method</label>
                <select style={s.select} value={f.payment} onChange={e => set({ payment: e.target.value })}>
                  <option>Cash</option><option>Card / Network</option><option>Bank Transfer</option>
                  <option>Credit</option><option>Credit Balance</option><option>Tabby</option><option>Tamara</option>
                </select>
              </div>
              <div style={s.formGroup}><label style={s.formLabel}>Amount Paid Now (SAR)</label><input type="number" step="0.01" style={s.input} value={f.paid} onChange={e => set({ paid: e.target.value })} /></div>

              {f.payment === 'Credit' && (<>
                <div style={s.formGroup}><label style={s.formLabel}>Credit Due Date</label><input type="date" style={s.input} value={f.creditDueDate} onChange={e => set({ creditDueDate: e.target.value })} /></div>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Creditor</label>
                  <select style={s.select} value={f.creditorId} onChange={e => set({ creditorId: e.target.value })}>
                    <option value="">— Select —</option>
                    {(data.creditors || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </>)}

              {f.payment === 'Credit Balance' && (
                <div style={s.formGroup}><label style={s.formLabel}>Use Credit (SAR)</label><input type="number" step="0.01" style={s.input} value={f.useCredit} onChange={e => set({ useCredit: e.target.value })} /></div>
              )}
              {f.payment === 'Tabby' && (
                <div style={s.formGroup}><label style={s.formLabel}>Tabby Order No.</label><input style={s.input} value={f.tabbyNo} onChange={e => set({ tabbyNo: e.target.value })} /></div>
              )}
              {f.payment === 'Tamara' && (
                <div style={s.formGroup}><label style={s.formLabel}>Tamara Order No.</label><input style={s.input} value={f.tamaraNo} onChange={e => set({ tamaraNo: e.target.value })} /></div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ ...s.btn, ...s.btnSuccess, padding: '14px 30px', fontSize: '15px' }}>
              {editInvId ? '💾 ' + t('updateInvoice', 'Update Invoice') : '✅ ' + t('generateInvoice', 'Generate Invoice')}
            </button>
            <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '14px 30px' }} onClick={() => setPage('list')}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MY ATTENDANCE — real feature: check-in/out, history, leave request
  // Requires app_users.employee_id (see migration note shipped with this fix)
  // to link the logged-in user to their employees record.
  // ═══════════════════════════════════════════════════════════════
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

    useEffect(() => { load(); /* eslint-disable-next-line */ }, [employeeId]);

    const todayRow = rows.find(r => r.date === today);

    const checkIn = async () => {
      const time = new Date().toTimeString().slice(0, 8);
      try {
        if (todayRow) {
          await supabase.from('attendance').update({ check_in: time, status: 'Present' }).eq('id', todayRow.id);
        } else {
          await supabase.from('attendance').insert([{ employee_id: employeeId, tenant_id: userProfile.tenant_id, date: today, check_in: time, status: 'Present' }]);
        }
        showToast?.('✅ Checked in at ' + time);
        load();
      } catch (err) { showToast?.('Error: ' + err.message); }
    };

    const checkOut = async () => {
      const time = new Date().toTimeString().slice(0, 8);
      try {
        if (todayRow) await supabase.from('attendance').update({ check_out: time }).eq('id', todayRow.id);
        showToast?.('✅ Checked out at ' + time);
        load();
      } catch (err) { showToast?.('Error: ' + err.message); }
    };

    const requestLeave = async (e) => {
      e.preventDefault();
      try {
        await supabase.from('attendance').insert([{
          employee_id: employeeId, tenant_id: userProfile.tenant_id, date: leaveStart,
          status: 'Leave', leave_type: leaveType, leave_start: leaveStart, leave_end: leaveEnd
        }]);
        showToast?.('📝 Leave request submitted');
        load();
      } catch (err) { showToast?.('Error: ' + err.message); }
    };

    return (
      <div style={s.container}>
        <div style={s.header}><h1 style={s.title}>⏰ {t('my_attendance', 'My Attendance')}</h1></div>

        {!employeeId ? (
          <div style={s.card}>
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>🔗</div>
              <h2 style={{ color: '#FBBF24', marginBottom: '10px' }}>Account Not Linked</h2>
              <p style={{ color: '#94A3B8', maxWidth: '480px', margin: '0 auto' }}>
                Your login isn't linked to an employee record yet. Ask an admin to set your <code>employee_id</code> in
                Users / Settings (requires the <code>app_users.employee_id</code> column — see migration notes) before
                attendance can be tracked for you.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div style={s.card}>
              <h3 style={{ ...s.sectionTitle, border: 'none', margin: 0, marginBottom: '15px' }}>Today — {today}</h3>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>Check-In: <b style={{ color: '#34D399' }}>{todayRow?.check_in || '—'}</b></div>
                <div>Check-Out: <b style={{ color: '#FBBF24' }}>{todayRow?.check_out || '—'}</b></div>
                <div>Status: <b>{todayRow?.status || 'Not marked'}</b></div>
                <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                  <button style={{ ...s.btn, ...s.btnSuccess }} onClick={checkIn} disabled={!!todayRow?.check_in}>🟢 Check In</button>
                  <button style={{ ...s.btn, ...s.btnWarning }} onClick={checkOut} disabled={!todayRow?.check_in || !!todayRow?.check_out}>🔴 Check Out</button>
                </div>
              </div>
            </div>

            <div style={s.card}>
              <h3 style={{ ...s.sectionTitle, border: 'none', margin: 0, marginBottom: '15px' }}>Request Leave</h3>
              <form onSubmit={requestLeave} style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Leave Type</label>
                  <select style={s.select} value={leaveType} onChange={e => setLeaveType(e.target.value)}>
                    <option>Annual</option><option>Sick</option><option>Emergency</option><option>Unpaid</option>
                  </select>
                </div>
                <div style={s.formGroup}><label style={s.formLabel}>From</label><input type="date" style={s.input} value={leaveStart} onChange={e => setLeaveStart(e.target.value)} /></div>
                <div style={s.formGroup}><label style={s.formLabel}>To</label><input type="date" style={s.input} value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} /></div>
                <div style={{ ...s.formGroup, display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" style={{ ...s.btn, ...s.btnPrimary, width: '100%' }}>Submit Request</button>
                </div>
              </form>
            </div>

            <div style={s.card}>
              <h3 style={{ ...s.sectionTitle, border: 'none', margin: 0, marginBottom: '15px' }}>History (last 60)</h3>
              {loading ? <p style={{ color: '#94A3B8' }}>Loading…</p> : rows.length === 0 ? (
                <p style={{ color: '#94A3B8' }}>No attendance records yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={s.table}>
                    <thead><tr><th style={s.th}>Date</th><th style={s.th}>Status</th><th style={s.th}>Check-In</th><th style={s.th}>Check-Out</th><th style={s.th}>Leave</th><th style={{ ...s.th, textAlign: 'right' }}>OT</th></tr></thead>
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

  return null;
}
