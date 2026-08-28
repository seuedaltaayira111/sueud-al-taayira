'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ERPViewsEnterprise(props) {
  const {
    page, data, tr, today, userProfile, showToast, setData, lang, theme,
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
  // CREDIT LIMITS
  // ============================================================
  if (page === 'credit_limits') {
    const [editLimitId, setEditLimitId] = useState(null);
    const [limitVal, setLimitVal] = useState(0);

    const saveLimit = async (custId) => {
      try {
        const { data: upCust, error } = await supabase
          .from('customers')
          .update({ credit_limit: parseFloat(limitVal) || 0 })
          .eq('id', custId)
          .select()
          .single();

        if (error) throw error;
        setData(prev => ({
          ...prev,
          customers: prev.customers.map(c => c.id === custId ? upCust : c)
        }));
        showToast(isAr ? '✅ تم تحديث حد الائتمان!' : '✅ Credit Limit Updated!');
        setEditLimitId(null);
      } catch (err) {
        showToast('Error: ' + err.message);
      }
    };

    return (
      <div style={styles.container}>
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>💳 {isAr ? 'حدود الائتمان للعملاء' : 'Customer Credit Limits'}</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>
            {isAr
              ? 'تحديد الحد الأقصى للائتمان لكل عميل. سيقوم النظام بالتحذير إذا تجاوز المبلغ المستحق هذا الحد.'
              : 'Set maximum credit limit for each customer. System will warn if outstanding exceeds this limit.'}
          </p>
        </div>

        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{isAr ? 'العميل' : 'Customer'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'المستحق الحالي' : 'Current Outstanding'}</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'حد الائتمان' : 'Credit Limit'}</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {(data.customers || []).map(c => {
                  const custInvs = (data.invoices || []).filter(i =>
                    i.customer_id === c.id && !i.invoice_no?.startsWith('REF-')
                  );
                  const outstanding = custInvs.reduce((s, i) => s + (i.due_amount || 0), 0);
                  const limit = c.credit_limit || 0;
                  const isOverLimit = outstanding > limit && limit > 0;

                  return (
                    <tr key={c.id} style={{ background: isOverLimit ? '#FEF2F2' : 'transparent' }}>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{c.name}</td>
                      <td style={{
                        ...styles.tdRight,
                        color: outstanding > 0 ? '#EF4444' : '#34D399'
                      }}>
                        {fmt(outstanding)}
                        {isOverLimit && (
                          <span style={{
                            marginLeft: '10px',
                            padding: '2px 8px',
                            background: '#EF4444',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 700
                          }}>
                            {isAr ? 'تجاوز الحد' : 'OVER LIMIT'}
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {editLimitId === c.id ? (
                          <input
                            type="number"
                            value={limitVal}
                            onChange={e => setLimitVal(e.target.value)}
                            style={{ ...styles.input, width: '120px', margin: 0 }}
                          />
                        ) : (
                          <span style={{ cursor: 'pointer', color: '#60A5FA' }} onClick={() => { setEditLimitId(c.id); setLimitVal(limit); }}>
                            {fmt(limit)}
                          </span>
                        )}
                      </td>
                      <td style={styles.tdCenter}>
                        {editLimitId === c.id ? (
                          <button onClick={() => saveLimit(c.id)} style={{ ...styles.btn, ...styles.btnSuccess, padding: '6px 12px' }}>
                            {isAr ? 'حفظ' : 'Save'}
                          </button>
                        ) : (
                          <button
                            onClick={() => { setEditLimitId(c.id); setLimitVal(limit); }}
                            style={{ ...styles.btn, ...styles.btnWarning, padding: '6px 12px' }}
                          >
                            ✏️ {isAr ? 'تعديل' : 'Edit'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {(data.customers || []).length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                      {isAr ? 'لا يوجد عملاء' : 'No customers found'}
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
  // SUPPLIER STATEMENT (Vendors)
  // ============================================================
  if (page === 'supplier_statement') {
    const [stmtVendorId, setStmtVendorId] = useState('');
    const [vendorStatement, setVendorStatement] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadVendorStatement = async () => {
      if (!stmtVendorId) return showToast(isAr ? 'اختر مورداً أولاً' : 'Select a vendor first');
      setLoading(true);
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
        if (stmtData.length === 0) {
          showToast(isAr ? 'لا توجد معاملات لهذا المورد.' : 'No transactions for this vendor.');
        } else {
          showToast(`✅ ${stmtData.length} ${isAr ? 'معاملة تم العثور عليها' : 'transactions found'}`);
        }
      } catch (err) {
        showToast('Error: ' + err.message);
      }
      setLoading(false);
    };

    const vendor = data.vendors?.find(v => v.id === stmtVendorId);

    const handleExportVendorStmt = () => {
      if (vendorStatement.length === 0) return showToast(isAr ? 'لا توجد بيانات للتصدير' : 'No data to export');
      handleExportCSV?.(vendorStatement.map(s => ({
        Date: s.date,
        Description: s.description,
        Amount: s.amount,
        Balance: s.balance,
        PaymentMode: s.payment_mode
      })), `Supplier_Statement_${vendor?.name || stmtVendorId}`);
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📦 {isAr ? 'كشف حساب الموردين' : 'Supplier Statements'}</h1>
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
              <button onClick={loadVendorStatement} style={{ ...styles.btn, ...styles.btnPrimary, padding: '12px 30px' }} disabled={loading}>
                {loading ? (isAr ? 'جاري التحميل...' : 'Loading...') : (isAr ? '🔍 عرض الكشف' : '🔍 View Statement')}
              </button>
              {vendorStatement.length > 0 && (
                <button onClick={handleExportVendorStmt} style={{ ...styles.btn, ...styles.btnSuccess, padding: '12px 20px' }}>
                  📥 {isAr ? 'تحميل' : 'Download'}
                </button>
              )}
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

        {stmtVendorId && vendorStatement.length === 0 && !loading && (
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
  // MULTI-BRANCH SUPPORT
  // ============================================================
  if (page === 'multi_branch') {
    const [selectedBranch, setSelectedBranch] = useState(null);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏢 {isAr ? 'نظرة عامة على الفروع المتعددة' : 'Multi-Branch Overview'}</h1>
        </div>

        {(data.branches || []).length === 0 ? (
          <div style={styles.card}>
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🏢</div>
              <p style={{ color: '#94A3B8' }}>{isAr ? 'لا توجد فروع مسجلة. أضف فرعاً من صفحة الفروع.' : 'No branches registered. Add a branch from the Branches page.'}</p>
              <button style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '15px' }} onClick={() => props.setPage('branches')}>
                {isAr ? '➕ إضافة فرع' : '➕ Add Branch'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {(data.branches || []).map(br => {
              const brInv = (data.invoices || []).filter(i => i.branch_id === br.id && !i.invoice_no?.startsWith('REF-'));
              const sales = brInv.reduce((s, i) => s + (i.total || 0), 0);
              const count = brInv.length;
              const profit = brInv.reduce((s, i) => s + (i.profit || 0), 0);

              return (
                <div key={br.id} style={{
                  ...styles.card,
                  borderTop: `5px solid ${br.status === 'Active' ? '#059669' : '#EF4444'}`,
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={() => setSelectedBranch(br.id === selectedBranch ? null : br.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ color: '#FBBF24', marginTop: 0, fontSize: '20px' }}>{br.name}</h3>
                      <p style={{ fontSize: '14px', color: '#94A3B8', margin: '5px 0' }}>
                        {isAr ? 'المدير' : 'Manager'}: {br.manager || 'N/A'}
                      </p>
                      <p style={{ fontSize: '14px', color: '#94A3B8', margin: '5px 0' }}>
                        📍 {br.location || 'N/A'}
                      </p>
                      <p style={{ fontSize: '14px', color: '#94A3B8', margin: '5px 0' }}>
                        📞 {br.phone || 'N/A'}
                      </p>
                      <span style={{
                        ...styles.badge,
                        background: br.status === 'Active' ? '#065F46' : '#7F1D1D',
                        color: br.status === 'Active' ? '#34D399' : '#FCA5A5',
                        marginTop: '5px',
                        display: 'inline-block'
                      }}>
                        {br.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '36px' }}>
                      {br.status === 'Active' ? '🟢' : '🔴'}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '10px',
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: isDark ? '1px solid #334155' : '1px solid #E2E8F0'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{isAr ? 'المبيعات' : 'Sales'}</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#34D399' }}>{fmt(sales)}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{isAr ? 'الفواتير' : 'Invoices'}</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#60A5FA' }}>{count}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{isAr ? 'الربح' : 'Profit'}</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: profit >= 0 ? '#34D399' : '#FCA5A5' }}>{fmt(profit)}</div>
                    </div>
                  </div>

                  {selectedBranch === br.id && (
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: isDark ? '1px solid #334155' : '1px solid #E2E8F0' }}>
                      <h4 style={{ color: '#FBBF24', margin: '0 0 10px' }}>{isAr ? 'تفاصيل الفرع' : 'Branch Details'}</h4>
                      <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0' }}>
                        {isAr ? 'البريد الإلكتروني' : 'Email'}: {br.email || 'N/A'}
                      </p>
                      <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0' }}>
                        {isAr ? 'التوقيت' : 'Timing'}: {br.timing || 'N/A'}
                      </p>
                      <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0' }}>
                        {isAr ? 'العنوان' : 'Address'}: {br.address || br.location || 'N/A'}
                      </p>
                      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                        <button
                          style={{ ...styles.btn, ...styles.btnGhost, flex: 1 }}
                          onClick={(e) => { e.stopPropagation(); props.setPage('branches'); }}
                        >
                          {isAr ? '🔍 إدارة الفرع' : '🔍 Manage Branch'}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    style={{ ...styles.btn, ...styles.btnGhost, width: '100%', marginTop: '12px', padding: '8px' }}
                    onClick={() => setSelectedBranch(br.id === selectedBranch ? null : br.id)}
                  >
                    {selectedBranch === br.id
                      ? (isAr ? '🔽 إخفاء التفاصيل' : '🔼 Hide Details')
                      : (isAr ? '🔍 عرض التفاصيل' : '🔍 View Details')}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
}
