'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ERPViewsPro(props) {
  const {
    page, data, tr, today, userProfile, showToast, setData, lang, theme,
    handleAddMistake, handlePreviewMistake, handleDeleteMistake,
    handleExportCSV
  } = props;

  const isAr = lang === 'ar';
  const isDark = theme === 'dark';

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
    badgeInfo: {
      background: '#1E3A8A',
      color: '#93C5FD'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    statCard: {
      background: isDark ? 'linear-gradient(135deg, #1E293B, #0F172A)' : 'linear-gradient(135deg, #FFFFFF, #F8FAFC)',
      padding: '20px',
      borderRadius: '12px',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      borderTop: '4px solid #2563EB'
    },
    statLabel: {
      fontSize: '12px',
      color: '#94A3B8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    statValue: {
      fontSize: '24px',
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
  // REFUND STATEMENT & PROFIT PANEL
  // ============================================================
  if (page === 'refund_statement') {
    const refunds = (data.invoices || []).filter(i => i.invoice_no?.startsWith('REF-'));
    const totalCompRefund = refunds.reduce((s, r) => s + (r.refund_company || 0), 0);
    const totalCustRefund = refunds.reduce((s, r) => s + (r.refund_customer || 0), 0);
    const totalOfficeProfit = totalCompRefund - totalCustRefund;

    const portalRefunds = {};
    refunds.forEach(r => {
      const portalName = data.portals?.find(p => p.id === r.portal_id)?.name || 'Unknown Portal';
      if (!portalRefunds[portalName]) portalRefunds[portalName] = { comp: 0, cust: 0 };
      portalRefunds[portalName].comp += (r.refund_company || 0);
      portalRefunds[portalName].cust += (r.refund_customer || 0);
    });

    return (
      <div style={styles.container}>
        <div style={{
          background: 'linear-gradient(135deg, #7F1D1D, #DC2626)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>📊 {isAr ? 'كشف الاسترجاع والأرباح' : 'Refund Statement & Earnings'}</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>
            {isAr ? 'تتبع استرجاعات شركات الطيران وحساب هوامش الربح للمكتب.' : 'Track refunds from airlines and calculate office profit margins.'}
          </p>
        </div>

        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderTop: '4px solid #2563EB' }}>
            <div style={styles.statLabel}>{isAr ? 'استرجاع من شركات الطيران' : 'Refund from Airlines'}</div>
            <div style={{ ...styles.statValue, color: '#60A5FA' }}>{fmt(totalCompRefund)}</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #FBBF24' }}>
            <div style={styles.statLabel}>{isAr ? 'استرجاع للعملاء' : 'Refund to Customers'}</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(totalCustRefund)}</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #34D399' }}>
            <div style={styles.statLabel}>{isAr ? 'ربح المكتب من الاسترجاعات' : 'Office Profit from Refunds'}</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(totalOfficeProfit)}</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #A78BFA' }}>
            <div style={styles.statLabel}>{isAr ? 'عدد الاسترجاعات' : 'Total Refunds'}</div>
            <div style={styles.statValue}>{refunds.length}</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#FBBF24' }}>{isAr ? 'تفصيل الاسترجاعات حسب البوابة' : 'Portal-wise Refund Breakdown'}</h3>
            <button onClick={() => handleExportCSV?.('refund_statement') || showToast('Export not configured')} style={{ ...styles.btn, ...styles.btnSuccess }}>
              📥 {isAr ? 'تصدير' : 'Export'}
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'البوابة' : 'Portal'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'استرجاع الشركة' : 'Company Refund'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'استرجاع العميل' : 'Customer Refund'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'ربح المكتب' : 'Office Earned'}</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(portalRefunds).length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد استرجاعات مسجلة.' : 'No refunds recorded yet.'}
                    </td>
                  </tr>
                ) : (
                  Object.keys(portalRefunds).map(pName => {
                    const p = portalRefunds[pName];
                    const earned = p.comp - p.cust;
                    return (
                      <tr key={pName}>
                        <td style={{ ...styles.td, fontWeight: 600 }}>{pName}</td>
                        <td style={{ ...styles.tdRight, color: '#60A5FA' }}>{fmt(p.comp)}</td>
                        <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(p.cust)}</td>
                        <td style={{ ...styles.tdRight, color: earned >= 0 ? '#34D399' : '#FCA5A5', fontWeight: 'bold' }}>
                          {fmt(earned)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {refunds.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>{isAr ? 'قائمة الاسترجاعات' : 'Refund List'}</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>{isAr ? 'رقم الاسترجاع' : 'Refund No'}</th>
                    <th style={styles.th}>{isAr ? 'العميل' : 'Customer'}</th>
                    <th style={styles.th}>{isAr ? 'التاريخ' : 'Date'}</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'استرجاع الشركة' : 'Company'}</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'استرجاع العميل' : 'Customer'}</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'الربح' : 'Profit'}</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.slice(0, 20).map(r => (
                    <tr key={r.id}>
                      <td style={{ ...styles.td, color: '#FCA5A5', fontWeight: 600 }}>{r.invoice_no}</td>
                      <td style={styles.td}>{r.customers?.name || r.old_customer_name || 'N/A'}</td>
                      <td style={styles.td}>{r.refund_date || r.invoice_date}</td>
                      <td style={{ ...styles.tdRight, color: '#60A5FA' }}>{fmt(r.refund_company)}</td>
                      <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(r.refund_customer)}</td>
                      <td style={{ ...styles.tdRight, color: ((r.refund_company || 0) - (r.refund_customer || 0)) >= 0 ? '#34D399' : '#FCA5A5', fontWeight: 'bold' }}>
                        {fmt((r.refund_company || 0) - (r.refund_customer || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // CUSTOMER STATEMENT
  // ============================================================
  if (page === 'customer_statement') return <CustomerStatementView {...props} />;

  // ============================================================
  // SUPPLIER STATEMENT
  // ============================================================
  if (page === 'supplier_statement') {
    const [stmtVendorId, setStmtVendorId] = useState('');
    const [vendorStatement, setVendorStatement] = useState([]);

    const loadVendorStatement = async () => {
      if (!stmtVendorId) return showToast(isAr ? 'اختر مورداً أولاً' : 'Select a vendor first');
      try {
        const { data: exps, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('vendor_id', stmtVendorId)
          .eq('tenant_id', userProfile.tenant_id)
          .order('expense_date', { ascending: true });

        if (error) throw error;

        let runningBalance = 0;
        const stmtData = (exps || []).map(e => {
          const amount = e.amount || 0;
          runningBalance += amount;
          return {
            date: e.expense_date,
            description: e.description || e.expense_type || 'Expense',
            amount: amount,
            balance: runningBalance,
            payment_mode: e.payment_mode || 'Cash'
          };
        });
        setVendorStatement(stmtData);
        showToast(`✅ ${stmtData.length} ${isAr ? 'معاملة تم العثور عليها' : 'transactions found'}`);
      } catch (err) {
        showToast('Error: ' + err.message);
      }
    };

    const vendor = data.vendors?.find(v => v.id === stmtVendorId);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📦 {isAr ? 'كشف حساب المورد' : 'Supplier Statement'}</h1>
        </div>

        <div style={styles.card}>
          <div style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'اختر المورد' : 'Select Supplier'}</label>
              <select style={styles.select} value={stmtVendorId} onChange={e => setStmtVendorId(e.target.value)}>
                <option value="">{isAr ? 'اختر المورد لعرض الكشف' : 'Select Supplier to View Statement'}</option>
                {(data.vendors || []).map(v => (
                  <option key={v.id} value={v.id}>{v.name} {v.phone ? `— ${v.phone}` : ''}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <button onClick={loadVendorStatement} style={{ ...styles.btn, ...styles.btnPrimary, padding: '12px 30px' }}>
                {isAr ? '🔍 عرض الكشف' : '🔍 View Statement'}
              </button>
            </div>
          </div>
        </div>

        {stmtVendorId && vendorStatement.length > 0 && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#FBBF24' }}>
                {isAr ? 'سجل المعاملات -' : 'Transaction History -'} {vendor?.name || 'Supplier'}
              </h3>
              <div style={{ background: isDark ? '#0F172A' : '#F1F5F9', padding: '8px 16px', borderRadius: '8px' }}>
                <span style={{ color: '#94A3B8', fontSize: '12px' }}>{isAr ? 'إجمالي المبلغ' : 'Total Amount'}:</span>
                <span style={{ fontWeight: 700, color: '#FCA5A5', marginLeft: '8px' }}>
                  {fmt(vendorStatement.reduce((s, r) => s + r.amount, 0))}
                </span>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>{isAr ? 'التاريخ' : 'Date'}</th>
                    <th style={styles.th}>{isAr ? 'الوصف' : 'Description'}</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'الرصيد التراكمي' : 'Running Balance'}</th>
                    <th style={styles.th}>{isAr ? 'طريقة الدفع' : 'Payment Mode'}</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorStatement.map((s, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{s.date}</td>
                      <td style={styles.td}>{s.description}</td>
                      <td style={{ ...styles.tdRight, color: '#FCA5A5' }}>{fmt(s.amount)}</td>
                      <td style={{ ...styles.tdRight, color: '#FBBF24', fontWeight: 'bold' }}>{fmt(s.balance)}</td>
                      <td style={styles.td}>{s.payment_mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {stmtVendorId && vendorStatement.length === 0 && (
          <div style={styles.card}>
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📄</div>
              <p style={{ color: '#94A3B8' }}>{isAr ? 'لا توجد معاملات لهذا المورد.' : 'No transactions for this supplier.'}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // RECURRING INVOICES
  // ============================================================
  if (page === 'recurring_invoices') return <RecurringInvoicesView {...props} />;

  // ============================================================
  // EXPENSE APPROVAL SYSTEM
  // ============================================================
  if (page === 'expense_approval') {
    const pendingExpenses = (data.expenses || []).filter(e => e.approval_status === 'Pending');

    const updateApproval = async (expId, status) => {
      try {
        const { data: upExp, error } = await supabase
          .from('expenses')
          .update({ approval_status: status })
          .eq('id', expId)
          .select()
          .single();

        if (error) throw error;
        setData(prev => ({
          ...prev,
          expenses: prev.expenses.map(e => e.id === expId ? upExp : e)
        }));
        showToast(isAr ? `✅ تم ${status === 'Approved' ? 'الموافقة' : 'الرفض'} على المصروف!` : `Expense ${status}!`);
      } catch (err) {
        showToast('Error: ' + err.message);
      }
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛡️ {isAr ? 'نظام اعتماد المصروفات' : 'Expense Approval System'}</h1>
        </div>

        <div style={styles.card}>
          <p style={{ color: '#94A3B8', marginBottom: '15px', fontSize: '14px' }}>
            {isAr
              ? 'ستظهر المصروفات التي أنشأها الموظفون هنا لموافقة المدير قبل التأثير على الرصيد النقدي.'
              : 'Expenses created by staff will appear here for Admin approval before affecting cash balance.'}
          </p>

          {pendingExpenses.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>✅</div>
              <p style={{ color: '#94A3B8' }}>{isAr ? 'لا توجد مصروفات معلقة للموافقة.' : 'No pending expenses for approval.'}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>{isAr ? 'التاريخ' : 'Date'}</th>
                    <th style={styles.th}>{isAr ? 'المورد' : 'Vendor'}</th>
                    <th style={styles.th}>{isAr ? 'الوصف' : 'Description'}</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                    <th style={styles.th}>{isAr ? 'الحالة' : 'Status'}</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingExpenses.map(exp => (
                    <tr key={exp.id} style={{ background: '#FFFBEB' }}>
                      <td style={styles.td}>{exp.expense_date}</td>
                      <td style={styles.td}>{exp.vendor_name || 'N/A'}</td>
                      <td style={styles.td}>{exp.description || '-'}</td>
                      <td style={{ ...styles.tdRight, fontWeight: 'bold' }}>{fmt(exp.amount)}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgeWarning }}>{exp.approval_status}</span>
                      </td>
                      <td style={styles.tdCenter}>
                        <div style={styles.actionsCell}>
                          <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => updateApproval(exp.id, 'Approved')}>
                            ✅ {isAr ? 'موافقة' : 'Approve'}
                          </button>
                          <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => updateApproval(exp.id, 'Rejected')}>
                            ❌ {isAr ? 'رفض' : 'Reject'}
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
  // NOTIFICATIONS CENTER
  // ============================================================
  if (page === 'notifications') {
    const pendingInv = (data.invoices || []).filter(i => i.due_amount > 0 && !i.invoice_no?.startsWith('REF-'));
    const pendingExp = (data.expenses || []).filter(e => e.approval_status === 'Pending');
    const lowPortals = (data.portals || []).filter(p => (p.current_balance || 0) < 1000);
    const expiringIqamas = (data.employees || []).filter(e =>
      e.iqama_expiry && new Date(e.iqama_expiry) < new Date(new Date().setMonth(new Date().getMonth() + 1))
    );
    const expiringLabor = (data.employees || []).filter(e =>
      e.labor_office_expiry && new Date(e.labor_office_expiry) < new Date(new Date().setMonth(new Date().getMonth() + 1))
    );

    const totalNotifications = pendingInv.length + pendingExp.length + lowPortals.length + expiringIqamas.length + expiringLabor.length;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔔 {isAr ? 'مركز الإشعارات والتنبيهات' : 'Notifications & Alerts Center'}</h1>
          <span style={{ ...styles.badge, background: '#1E3A8A', color: '#93C5FD', fontSize: '14px', padding: '4px 16px' }}>
            {totalNotifications} {isAr ? 'إشعار' : 'Notifications'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {/* Pending Invoices */}
          <div style={{ ...styles.card, borderLeft: pendingInv.length > 0 ? '4px solid #EF4444' : '4px solid #34D399' }}>
            <h3 style={{ color: pendingInv.length > 0 ? '#EF4444' : '#34D399', marginTop: 0 }}>
              ⚠️ {isAr ? 'فواتير غير مدفوعة' : 'Pending Invoices'} ({pendingInv.length})
            </h3>
            {pendingInv.length === 0 ? (
              <p style={{ color: '#94A3B8' }}>✅ {isAr ? 'جميع الفواتير مدفوعة' : 'All invoices are paid'}</p>
            ) : (
              pendingInv.slice(0, 5).map(inv => (
                <div key={inv.id} style={{
                  padding: '8px 0',
                  borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px'
                }}>
                  <span>{inv.invoice_no} - {inv.customers?.name || 'N/A'}</span>
                  <span style={{ color: '#FCA5A5', fontWeight: 'bold' }}>{fmt(inv.due_amount)}</span>
                </div>
              ))
            )}
            {pendingInv.length > 5 && (
              <p style={{ color: '#94A3B8', fontSize: '12px', marginTop: '5px' }}>
                {isAr ? `و ${pendingInv.length - 5} فواتير أخرى` : `and ${pendingInv.length - 5} more invoices`}
              </p>
            )}
          </div>

          {/* Expense Approvals */}
          <div style={{ ...styles.card, borderLeft: pendingExp.length > 0 ? '4px solid #FBBF24' : '4px solid #34D399' }}>
            <h3 style={{ color: pendingExp.length > 0 ? '#D97706' : '#34D399', marginTop: 0 }}>
              ⏳ {isAr ? 'اعتماد المصروفات' : 'Expense Approvals'} ({pendingExp.length})
            </h3>
            {pendingExp.length === 0 ? (
              <p style={{ color: '#94A3B8' }}>✅ {isAr ? 'لا توجد مصروفات معلقة' : 'No pending expenses'}</p>
            ) : (
              pendingExp.slice(0, 5).map(exp => (
                <div key={exp.id} style={{
                  padding: '8px 0',
                  borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px'
                }}>
                  <span>{exp.vendor_name || 'N/A'} - {exp.description || 'Expense'}</span>
                  <span style={{ color: '#FBBF24', fontWeight: 'bold' }}>{fmt(exp.amount)}</span>
                </div>
              ))
            )}
          </div>

          {/* Low Portal Balances */}
          <div style={{ ...styles.card, borderLeft: lowPortals.length > 0 ? '4px solid #DC2626' : '4px solid #34D399' }}>
            <h3 style={{ color: lowPortals.length > 0 ? '#DC2626' : '#34D399', marginTop: 0 }}>
              📉 {isAr ? 'أرصدة البوابات المنخفضة' : 'Low Portal Balances'} ({lowPortals.length})
            </h3>
            {lowPortals.length === 0 ? (
              <p style={{ color: '#94A3B8' }}>✅ {isAr ? 'جميع البوابات بصحة جيدة' : 'All portals are healthy'}</p>
            ) : (
              lowPortals.map(p => (
                <div key={p.id} style={{
                  padding: '8px 0',
                  borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px'
                }}>
                  <span>{p.name}</span>
                  <span style={{ color: '#FCA5A5', fontWeight: 'bold' }}>{fmt(p.current_balance)}</span>
                </div>
              ))
            )}
          </div>

          {/* Expiring Iqamas */}
          <div style={{ ...styles.card, borderLeft: expiringIqamas.length > 0 ? '4px solid #EF4444' : '4px solid #34D399' }}>
            <h3 style={{ color: expiringIqamas.length > 0 ? '#EF4444' : '#34D399', marginTop: 0 }}>
              🆔 {isAr ? 'الإقامات المنتهية قريباً' : 'Expiring Iqamas'} ({expiringIqamas.length})
            </h3>
            {expiringIqamas.length === 0 ? (
              <p style={{ color: '#94A3B8' }}>✅ {isAr ? 'جميع الإقامات سليمة' : 'All Iqamas are valid'}</p>
            ) : (
              expiringIqamas.map(e => (
                <div key={e.id} style={{
                  padding: '8px 0',
                  borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px'
                }}>
                  <span>{e.name}</span>
                  <span style={{ color: '#FCA5A5', fontWeight: 'bold' }}>{e.iqama_expiry}</span>
                </div>
              ))
            )}
          </div>

          {/* Expiring Labor Office */}
          <div style={{ ...styles.card, borderLeft: expiringLabor.length > 0 ? '4px solid #F59E0B' : '4px solid #34D399' }}>
            <h3 style={{ color: expiringLabor.length > 0 ? '#F59E0B' : '#34D399', marginTop: 0 }}>
              📋 {isAr ? 'انتهاء مكتب العمل' : 'Labor Office Expiry'} ({expiringLabor.length})
            </h3>
            {expiringLabor.length === 0 ? (
              <p style={{ color: '#94A3B8' }}>✅ {isAr ? 'جميع تجديدات مكتب العمل سليمة' : 'All labor office renewals are valid'}</p>
            ) : (
              expiringLabor.map(e => (
                <div key={e.id} style={{
                  padding: '8px 0',
                  borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px'
                }}>
                  <span>{e.name}</span>
                  <span style={{ color: '#FBBF24', fontWeight: 'bold' }}>{e.labor_office_expiry}</span>
                </div>
              ))
            )}
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
        <div style={{
          background: 'linear-gradient(135deg, #7F1D1D, #DC2626)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>⚠️ {isAr ? 'أخطاء الموظفين وتتبع الخسائر' : 'Staff Mistakes & Loss Tracking'}</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>
            {isAr ? 'تسجيل الأخطاء والخصم التلقائي من الراتب إذا لزم الأمر.' : 'Log mistakes and auto-deduct from salary if required.'}
          </p>
        </div>

        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderTop: '4px solid #2563EB' }}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي الأخطاء' : 'Total Mistakes'}</div>
            <div style={styles.statValue}>{data.staffMistakes?.length || 0}</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #FCA5A5' }}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي الخسارة' : 'Total Loss'}</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(totalLoss)}</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #FBBF24' }}>
            <div style={styles.statLabel}>{isAr ? 'مدفوع من الموظف' : 'Paid by Employee'}</div>
            <div style={{ ...styles.statValue, color: '#FBBF24' }}>{fmt(paidByEmp)}</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{isAr ? 'تسجيل خطأ / خسارة جديدة' : 'Log New Mistake / Loss'}</h3>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '15px' }}>
            {isAr
              ? 'إذا تم إهدار تذكرة بسبب خطأ الموظف، قم بتسجيلها هنا. سيتم خصم مبلغ الخسارة تلقائياً من راتبه إذا تم وضع علامة "مدفوع من قبل الموظف".'
              : 'If a ticket is wasted due to an employee\'s mistake, log it here. The loss amount will be automatically deducted from their salary if marked as "Paid by Employee".'}
          </p>
          <form onSubmit={handleAddMistake} style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الموظف' : 'Employee'}</label>
              <select name="emp" style={styles.select} required>
                <option value="">{isAr ? 'اختر الموظف' : 'Select Employee'}</option>
                {(data.employees || []).map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'رقم التذكرة القديمة' : 'Old Ticket No'}</label>
              <input name="old_tkt" style={styles.input} placeholder={isAr ? 'رقم التذكرة القديمة' : 'Old Ticket No'} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'رقم التذكرة الجديدة' : 'New Ticket No'}</label>
              <input name="new_tkt" style={styles.input} placeholder={isAr ? 'رقم التذكرة الجديدة' : 'New Ticket No'} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'مبلغ الخسارة (ريال)' : 'Loss Amount (SAR)'}</label>
              <input name="loss_amt" type="number" step="0.01" style={styles.input} placeholder={isAr ? 'مبلغ الخسارة' : 'Loss Amount'} required />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'السبب' : 'Reason'}</label>
              <input name="reason" style={styles.input} placeholder={isAr ? 'سبب الخطأ' : 'Reason for mistake'} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '10px', color: isDark ? '#CBD5E1' : '#1E293B' }}>
                <input type="checkbox" name="paid_by_emp" /> {isAr ? 'خصم من الراتب' : 'Deduct from Salary'}
              </label>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, height: '42px' }}>
                ⚠️ {isAr ? 'تسجيل الخسارة' : 'Log Loss'}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#FBBF24' }}>{isAr ? 'سجل الأخطاء' : 'Mistake History'}</h3>
            <button onClick={() => handleExportCSV?.(data.staffMistakes?.map(m => ({
              Date: m.date,
              Employee: m.employees?.name,
              OldTicket: m.old_ticket_no,
              NewTicket: m.new_ticket_no,
              LossAmount: m.loss_amount,
              SalaryDeducted: m.paid_by_employee ? 'Yes' : 'No'
            })), 'StaffMistakes')} style={{ ...styles.btn, ...styles.btnSuccess }}>
              📥 {isAr ? 'تصدير' : 'Export'}
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'التاريخ' : 'Date'}</th>
                  <th style={styles.th}>{isAr ? 'الموظف' : 'Employee'}</th>
                  <th style={styles.th}>{isAr ? 'التذكرة القديمة' : 'Old Ticket'}</th>
                  <th style={styles.th}>{isAr ? 'التذكرة الجديدة' : 'New Ticket'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'مبلغ الخسارة' : 'Loss Amount'}</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'مخصوم من الراتب' : 'Salary Deducted'}</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {(data.staffMistakes || []).length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا توجد أخطاء مسجلة.' : 'No mistakes logged yet.'}
                    </td>
                  </tr>
                ) : (
                  (data.staffMistakes || []).map(m => (
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
                          {m.paid_by_employee ? (isAr ? 'نعم' : 'Yes') : (isAr ? 'لا' : 'No')}
                        </span>
                      </td>
                      <td style={styles.tdCenter}>
                        <div style={styles.actionsCell}>
                          <button style={{ ...styles.actionBtn, background: '#1E3A8A', color: '#93C5FD' }} onClick={() => handlePreviewMistake(m)}>
                            👁️
                          </button>
                          <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDeleteMistake(m)}>
                            🗑️
                          </button>
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

  return null;
}

// Customer Statement and Recurring Invoices were `if (page === 'X')`
// blocks calling different numbers of hooks (3 and 4) while sharing
// one component instance with Notifications, Refund Statement, and
// Expense Approval (0 hooks each). Switching pages via the sidebar
// didn't remount the component, so React expected the same hooks
// every render — a Rules-of-Hooks violation. Extracted both into
// their own components.
function useProHelpers(props) {
  const { lang, theme } = props;
  const isAr = lang === 'ar';
  const isDark = theme === 'dark';

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
    badgeInfo: {
      background: '#1E3A8A',
      color: '#93C5FD'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    statCard: {
      background: isDark ? 'linear-gradient(135deg, #1E293B, #0F172A)' : 'linear-gradient(135deg, #FFFFFF, #F8FAFC)',
      padding: '20px',
      borderRadius: '12px',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      borderTop: '4px solid #2563EB'
    },
    statLabel: {
      fontSize: '12px',
      color: '#94A3B8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    statValue: {
      fontSize: '24px',
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

  return { styles, fmt };
}

function CustomerStatementView(props) {
  const { page, data, tr, today, userProfile, showToast, setData, handleExportCSV, lang, theme } = props;
  const isAr = lang === 'ar';
  const isDark = theme === 'dark';
  const { styles, fmt } = useProHelpers(props);
  const [stmtCustId, setStmtCustId] = useState('');
  const [statement, setStatement] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStatement = async () => {
    if (!stmtCustId) return showToast(isAr ? 'اختر عميلاً أولاً' : 'Select a customer first');
    setLoading(true);
    try {
      const { data: invs, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', stmtCustId)
        .eq('tenant_id', userProfile.tenant_id)
        .order('invoice_date', { ascending: true });

      if (error) throw error;

      let runningBalance = 0;
      const stmtData = (invs || []).map(inv => {
        const debit = inv.total || 0;
        const credit = inv.paid_amount || 0;
        runningBalance += (debit - credit);
        return {
          date: inv.invoice_date,
          invoice_no: inv.invoice_no,
          description: inv.service_type || inv.sector || 'Invoice',
          debit: debit,
          credit: credit,
          balance: runningBalance
        };
      });
      setStatement(stmtData);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
    setLoading(false);
  };

  const handleExportStatement = () => {
    if (statement.length === 0) return showToast(isAr ? 'لا توجد بيانات للتصدير' : 'No data to export');
    const cust = data.customers?.find(c => c.id === stmtCustId);
    handleExportCSV?.(statement.map(s => ({
      Date: s.date,
      Invoice: s.invoice_no,
      Description: s.description,
      Debit: s.debit,
      Credit: s.credit,
      Balance: s.balance
    })), `Statement_${cust?.name || stmtCustId}`);
  };

  const cust = data.customers?.find(c => c.id === stmtCustId);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 {isAr ? 'كشف حساب العميل' : 'Customer Statement'}</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.formRow}>
          <div>
            <label style={styles.formLabel}>{isAr ? 'اختر العميل' : 'Select Customer'}</label>
            <select style={styles.select} value={stmtCustId} onChange={e => setStmtCustId(e.target.value)}>
              <option value="">{isAr ? 'اختر العميل لعرض الكشف' : 'Select Customer to View Statement'}</option>
              {(data.customers || []).map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.phone ? `— ${c.phone}` : ''}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <button onClick={loadStatement} style={{ ...styles.btn, ...styles.btnPrimary, padding: '12px 30px' }} disabled={loading}>
              {loading ? (isAr ? 'جاري التحميل...' : 'Loading...') : (isAr ? '🔍 عرض الكشف' : '🔍 View Statement')}
            </button>
            {statement.length > 0 && (
              <button onClick={handleExportStatement} style={{ ...styles.btn, ...styles.btnSuccess, padding: '12px 20px' }}>
                📥 {isAr ? 'تحميل' : 'Download'}
              </button>
            )}
          </div>
        </div>
      </div>

      {stmtCustId && statement.length > 0 && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#FBBF24' }}>
              {isAr ? 'سجل المعاملات -' : 'Transaction History -'} {cust?.name || 'Customer'}
            </h3>
            <div style={{ background: isDark ? '#0F172A' : '#F1F5F9', padding: '8px 16px', borderRadius: '8px' }}>
              <span style={{ color: '#94A3B8', fontSize: '12px' }}>{isAr ? 'الرصيد النهائي' : 'Final Balance'}:</span>
              <span style={{ fontWeight: 700, color: statement[statement.length - 1]?.balance >= 0 ? '#34D399' : '#FCA5A5', marginLeft: '8px' }}>
                {fmt(statement[statement.length - 1]?.balance || 0)}
              </span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'التاريخ' : 'Date'}</th>
                  <th style={styles.th}>{isAr ? 'الفاتورة' : 'Invoice'}</th>
                  <th style={styles.th}>{isAr ? 'الوصف' : 'Description'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'مدين (فاتورة)' : 'Debit (Inv)'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'دائن (مدفوع)' : 'Credit (Paid)'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'الرصيد' : 'Balance'}</th>
                </tr>
              </thead>
              <tbody>
                {statement.map((s, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{s.date}</td>
                    <td style={{ ...styles.td, color: '#60A5FA' }}>{s.invoice_no}</td>
                    <td style={styles.td}>{s.description}</td>
                    <td style={{ ...styles.tdRight, color: '#EF4444' }}>{fmt(s.debit)}</td>
                    <td style={{ ...styles.tdRight, color: '#34D399' }}>{fmt(s.credit)}</td>
                    <td style={{ ...styles.tdRight, color: s.balance >= 0 ? '#34D399' : '#FCA5A5', fontWeight: 'bold' }}>
                      {fmt(s.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stmtCustId && statement.length === 0 && !loading && (
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📄</div>
            <p style={{ color: '#94A3B8' }}>{isAr ? 'لا توجد معاملات لهذا العميل.' : 'No transactions for this customer.'}</p>
          </div>
        </div>
      )}
    </div>
  );}

function RecurringInvoicesView(props) {
  const { page, data, tr, today, userProfile, showToast, setData, lang, theme } = props;
  const isAr = lang === 'ar';
  const { styles, fmt } = useProHelpers(props);
  const [recForm, setRecForm] = useState({
    customer_id: '',
    amount: '',
    interval: 'Monthly',
    description: '',
    start_date: today,
    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });
  const [recurringInvs, setRecurringInvs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRecurring = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, customers(name)')
        .eq('is_recurring', true)
        .eq('tenant_id', userProfile.tenant_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecurringInvs(data || []);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
    setLoading(false);
  };

  const handleCreateRecurring = async (e) => {
    e.preventDefault();
    try {
      if (!recForm.customer_id) throw new Error(isAr ? 'اختر العميل' : 'Select a customer');
      const amount = parseFloat(recForm.amount) || 0;
      if (amount <= 0) throw new Error(isAr ? 'أدخل مبلغاً صالحاً' : 'Enter a valid amount');

      const invNo = `REC-${Date.now()}`;
      const payload = {
        invoice_no: invNo,
        customer_id: recForm.customer_id,
        total_sell: amount,
        total: amount,
        paid_amount: 0,
        due_amount: amount,
        invoice_date: recForm.start_date,
        is_recurring: true,
        recurring_interval: recForm.interval,
        recurring_end_date: recForm.end_date,
        status: 'Recurring',
        sector: recForm.description || 'Recurring Invoice',
        tenant_id: userProfile.tenant_id
      };

      const { data: newInv, error } = await supabase
        .from('invoices')
        .insert([payload])
        .select('*, customers(name)')
        .single();

      if (error) throw error;
      setRecurringInvs(prev => [newInv, ...prev]);
      showToast(isAr ? '✅ تم إنشاء الفاتورة المتكررة!' : '✅ Recurring Profile Created!');
      setRecForm({
        customer_id: '',
        amount: '',
        interval: 'Monthly',
        description: '',
        start_date: today,
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleDeleteRecurring = async (id) => {
    if (!confirm(isAr ? 'حذف هذه الفاتورة المتكررة؟' : 'Delete this recurring invoice?')) return;
    try {
      { const { error: _delErr1 } = await supabase.from('invoices').delete().eq('id', id); if (_delErr1) throw new Error(_delErr1.message); }
      setRecurringInvs(prev => prev.filter(r => r.id !== id));
      showToast(isAr ? '🗑️ تم الحذف!' : '🗑️ Deleted!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  useEffect(() => {
    if (page === 'recurring_invoices') {
      loadRecurring();
    }
  }, [page]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔁 {isAr ? 'الفواتير المتكررة' : 'Recurring Invoices'}</h1>
        <button style={{ ...styles.btn, ...styles.btnInfo }} onClick={loadRecurring}>
          🔄 {isAr ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>{isAr ? 'إعداد فاتورة متكررة' : 'Setup Recurring Profile'}</h3>
        <form onSubmit={handleCreateRecurring} style={styles.formRow}>
          <div>
            <label style={styles.formLabel}>{isAr ? 'العميل' : 'Customer'}</label>
            <select style={styles.select} value={recForm.customer_id} onChange={e => setRecForm({ ...recForm, customer_id: e.target.value })} required>
              <option value="">{isAr ? 'اختر العميل' : 'Select Customer'}</option>
              {(data.customers || []).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'المبلغ (ريال)' : 'Amount (SAR)'}</label>
            <input type="number" step="0.01" style={styles.input} value={recForm.amount} onChange={e => setRecForm({ ...recForm, amount: e.target.value })} required />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'الفترة' : 'Interval'}</label>
            <select style={styles.select} value={recForm.interval} onChange={e => setRecForm({ ...recForm, interval: e.target.value })}>
              <option>Monthly</option>
              <option>Yearly</option>
              <option>Weekly</option>
              <option>Quarterly</option>
            </select>
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'الوصف' : 'Description'}</label>
            <input style={styles.input} value={recForm.description} onChange={e => setRecForm({ ...recForm, description: e.target.value })} placeholder={isAr ? 'وصف الفاتورة' : 'Invoice description'} />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'تاريخ البدء' : 'Start Date'}</label>
            <input type="date" style={styles.input} value={recForm.start_date} onChange={e => setRecForm({ ...recForm, start_date: e.target.value })} />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'تاريخ الانتهاء' : 'End Date'}</label>
            <input type="date" style={styles.input} value={recForm.end_date} onChange={e => setRecForm({ ...recForm, end_date: e.target.value })} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
              ✅ {isAr ? 'إنشاء' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>{isAr ? 'الفواتير المتكررة الحالية' : 'Current Recurring Invoices'}</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#94A3B8' }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : recurringInvs.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔁</div>
            <p style={{ color: '#94A3B8' }}>{isAr ? 'لا توجد فواتير متكررة.' : 'No recurring invoices found.'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'الرقم' : 'Profile ID'}</th>
                  <th style={styles.th}>{isAr ? 'العميل' : 'Customer'}</th>
                  <th style={styles.th}>{isAr ? 'الفترة' : 'Interval'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {recurringInvs.map(r => (
                  <tr key={r.id}>
                    <td style={{ ...styles.td, color: '#60A5FA', fontWeight: 600 }}>{r.invoice_no}</td>
                    <td style={styles.td}>{r.customers?.name || 'N/A'}</td>
                    <td style={styles.td}>{r.recurring_interval}</td>
                    <td style={{ ...styles.tdRight, color: '#34D399', fontWeight: 'bold' }}>{fmt(r.total)}</td>
                    <td style={styles.tdCenter}>
                      <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDeleteRecurring(r.id)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );}
