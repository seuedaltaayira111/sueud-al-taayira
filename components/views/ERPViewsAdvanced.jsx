'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ERPViewsAdvanced(props) {
  const {
    page, data, tr, today, userProfile, showToast, setData, lang, theme,
    handleProcessPayroll, handleGenerateSlip, handleDeletePayroll,
    handleAddMistake, handlePreviewMistake, handleDeleteMistake,
    handleAddAdvance, handleUpdateAdvanceStatus, handleDeleteAdvance,
    employees, payForm, setPayForm,
    advForm, setAdvForm,
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
  // AI DASHBOARD
  // ============================================================
  if (page === 'ai_dashboard') {
    const activeInvoices = (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-') && i.status !== 'Draft');
    const tSales = activeInvoices.reduce((s, i) => s + (i.total || 0), 0);
    const tProfit = activeInvoices.reduce((s, i) => s + (i.profit || 0), 0);
    const pendingPayments = activeInvoices.filter(i => i.due_amount > 0);
    const totalDue = pendingPayments.reduce((s, i) => s + i.due_amount, 0);

    // Employee performance
    const empProfits = {};
    activeInvoices.forEach(inv => {
      const empName = inv.employees?.name || 'Unknown';
      if (!empProfits[empName]) empProfits[empName] = 0;
      empProfits[empName] += inv.profit || 0;
    });
    const topEmployee = Object.keys(empProfits).map(k => ({ name: k, profit: empProfits[k] })).sort((a, b) => b.profit - a.profit)[0];

    // Airline performance
    const airlineData = {};
    activeInvoices.forEach(inv => {
      const airline = inv.airline || 'Unknown';
      if (!airlineData[airline]) airlineData[airline] = { revenue: 0, profit: 0, count: 0 };
      airlineData[airline].revenue += inv.total || 0;
      airlineData[airline].profit += inv.profit || 0;
      airlineData[airline].count += 1;
    });
    const topAirlines = Object.keys(airlineData).map(k => ({ name: k, ...airlineData[k] })).sort((a, b) => b.profit - a.profit).slice(0, 5);

    // AI Insights
    const aiInsights = [];
    if (totalDue > 0) {
      aiInsights.push({
        icon: '⚠️',
        text: isAr ? `لديك ${totalDue.toFixed(2)} ريال مستحقة من ${pendingPayments.length} عميل. متابعة مطلوبة.` : `You have ${totalDue.toFixed(2)} SAR pending from ${pendingPayments.length} customers. Follow up needed.`
      });
    }
    if (topEmployee) {
      aiInsights.push({
        icon: '🏆',
        text: isAr ? `${topEmployee.name} هو أفضل موظف لديك بربح ${topEmployee.profit.toFixed(2)} ريال.` : `${topEmployee.name} is your top performer with ${topEmployee.profit.toFixed(2)} SAR in profit.`
      });
    }
    if (tProfit < 1000 && tSales > 0) {
      aiInsights.push({
        icon: '📉',
        text: isAr ? 'الأرباح منخفضة هذا الشهر. فكر في دفع باقات السياحة أو خدمات التأشيرات.' : 'Profits are low this month. Consider pushing tour packages or visa services.'
      });
    }
    if (topAirlines.length > 0) {
      aiInsights.push({
        icon: '✈️',
        text: isAr ? `أفضل خطوط الطيران من حيث الربح: ${topAirlines[0].name} (${topAirlines[0].profit.toFixed(2)} ريال)` : `Top airline by profit: ${topAirlines[0].name} (${topAirlines[0].profit.toFixed(2)} SAR)`
      });
    }
    if (aiInsights.length === 0) {
      aiInsights.push({
        icon: '✅',
        text: isAr ? 'لا توجد تنبيهات حرجة. الأعمال تسير بسلاسة!' : 'No critical alerts. Business is running smoothly!'
      });
    }

    return (
      <div style={styles.container}>
        <div style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '20px',
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
          border: '1px solid #334155'
        }}>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#FBBF24' }}>
            🤖 {isAr ? 'لوحة التحكم الذكية' : 'AI Dashboard'}
          </h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '16px' }}>
            {isAr ? 'رؤى الأعمال في الوقت الفعلي بناءً على بياناتك.' : 'Real-time business insights based on your data.'}
          </p>
        </div>

        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderTop: '4px solid #34D399' }}>
            <div style={styles.statLabel}>{isAr ? 'المبيعات الشهرية' : 'Monthly Sales'}</div>
            <div style={{ ...styles.statValue, color: '#34D399' }}>{fmt(tSales)}</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #FBBF24' }}>
            <div style={styles.statLabel}>{isAr ? 'صافي الربح' : 'Net Profit'}</div>
            <div style={{ ...styles.statValue, color: '#FBBF24' }}>{fmt(tProfit)}</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #FCA5A5' }}>
            <div style={styles.statLabel}>{isAr ? 'المستحقات المتأخرة' : 'Pending Dues'}</div>
            <div style={{ ...styles.statValue, color: '#FCA5A5' }}>{fmt(totalDue)}</div>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #60A5FA' }}>
            <div style={styles.statLabel}>{isAr ? 'إجمالي الفواتير' : 'Total Invoices'}</div>
            <div style={styles.statValue}>{activeInvoices.length}</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🧠 {isAr ? 'رؤى الذكاء الاصطناعي والإجراءات' : 'AI Insights & Action Items'}</h3>
          {aiInsights.map((ins, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 0',
              borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9'
            }}>
              <span style={{ fontSize: '24px' }}>{ins.icon}</span>
              <span style={{ fontSize: '14px', color: isDark ? '#CBD5E1' : '#1E293B', lineHeight: '1.5' }}>{ins.text}</span>
            </div>
          ))}
        </div>

        {topAirlines.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>✈️ {isAr ? 'أفضل خطوط الطيران' : 'Top Airlines'}</h3>
            {topAirlines.map((a, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9'
              }}>
                <span style={{ fontWeight: 600, color: isDark ? '#CBD5E1' : '#1E293B' }}>
                  {i + 1}. {a.name}
                </span>
                <span style={{ color: '#34D399', fontWeight: 700 }}>
                  {a.profit.toFixed(2)} SAR ({a.count} {isAr ? 'فواتير' : 'invoices'})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // QUOTATIONS
  // ============================================================
  if (page === 'quotations') return <QuotationsView {...props} />;

  // ============================================================
  // HR ADVANCED - COMPLETE
  // ============================================================
  if (page === 'hr_advanced') return <HRAdvancedView {...props} />;

  return null;
}

// Quotations and HR Advanced were `if (page === 'X')` blocks calling
// different numbers of hooks (1 and 6) while sharing one component
// instance with AI Dashboard (0 hooks). Switching between them via
// the sidebar didn't remount the component, so React expected the
// same hooks every render — a Rules-of-Hooks violation. Extracted
// both into their own components.
function useAdvancedHelpers(props) {
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

  return { styles, fmt };
}

function QuotationsView(props) {
  const { page, data, tr, today, userProfile, showToast, setData, lang, theme } = props;
  const isAr = lang === 'ar';
  const { styles, fmt } = useAdvancedHelpers(props);
  const [quoteForm, setQuoteForm] = useState({
    customer_name: '',
    service_type: 'Flight Ticket',
    price: '',
    valid_until: today,
    description: ''
  });
  const quotations = (data.invoices || []).filter(i => i.status === 'Draft');

  const handleCreateQuote = async (e) => {
    e.preventDefault();
    try {
      const quoteNo = `QUO-${Date.now()}`;
      const payload = {
        invoice_no: quoteNo,
        sector: quoteForm.service_type,
        total_sell: parseFloat(quoteForm.price) || 0,
        total: parseFloat(quoteForm.price) || 0,
        invoice_date: today,
        status: 'Draft',
        tenant_id: userProfile.tenant_id,
        customers: { name: quoteForm.customer_name }
      };
      const { data: newQuote, error } = await supabase.from('invoices').insert([payload]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, invoices: [newQuote, ...prev.invoices] }));
      showToast(isAr ? '✅ تم إنشاء عرض السعر!' : '✅ Quotation Created!');
      setQuoteForm({ customer_name: '', service_type: 'Flight Ticket', price: '', valid_until: today, description: '' });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const convertToInvoice = async (quote) => {
    try {
      const { error } = await supabase.from('invoices').update({ status: 'Confirmed' }).eq('id', quote.id);
      if (error) throw error;
      setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === quote.id ? { ...i, status: 'Confirmed' } : i) }));
      showToast(isAr ? '✅ تم التحويل إلى فاتورة!' : '✅ Converted to Invoice!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const deleteQuote = async (quote) => {
    if (!confirm(isAr ? 'حذف عرض السعر هذا؟' : 'Delete this quotation?')) return;
    try {
      { const { error: _delErr1 } = await supabase.from('invoices').delete().eq('id', quote.id); if (_delErr1) throw new Error(_delErr1.message); }
      setData(prev => ({ ...prev, invoices: prev.invoices.filter(i => i.id !== quote.id) }));
      showToast(isAr ? '🗑️ تم حذف عرض السعر!' : '🗑️ Quotation deleted!');
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
        <h2 style={{ margin: 0, fontSize: '24px' }}>📄 {isAr ? 'إدارة عروض الأسعار' : 'Quotation Management'}</h2>
        <p style={{ margin: '5px 0 0', opacity: 0.9 }}>
          {isAr ? 'إنشاء عروض أسعار مسودة وتحويلها إلى فواتير عند التأكيد.' : 'Create draft quotes and convert them to invoices when confirmed.'}
        </p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>{isAr ? 'إنشاء عرض سعر جديد' : 'Create New Quotation'}</h3>
        <form onSubmit={handleCreateQuote} style={styles.formRow}>
          <div>
            <label style={styles.formLabel}>{isAr ? 'اسم العميل' : 'Customer Name'}</label>
            <input style={styles.input} value={quoteForm.customer_name} onChange={e => setQuoteForm({ ...quoteForm, customer_name: e.target.value })} required />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'نوع الخدمة' : 'Service Type'}</label>
            <select style={styles.select} value={quoteForm.service_type} onChange={e => setQuoteForm({ ...quoteForm, service_type: e.target.value })}>
              <option>Flight Ticket</option>
              <option>Hotel Booking</option>
              <option>Tour Package</option>
              <option>Visa Services</option>
              <option>Hajj/Umrah</option>
            </select>
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'السعر المقدر (ريال)' : 'Estimated Price (SAR)'}</label>
            <input type="number" step="0.01" style={styles.input} value={quoteForm.price} onChange={e => setQuoteForm({ ...quoteForm, price: e.target.value })} required />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'صالح حتى' : 'Valid Until'}</label>
            <input type="date" style={styles.input} value={quoteForm.valid_until} onChange={e => setQuoteForm({ ...quoteForm, valid_until: e.target.value })} required />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'الوصف' : 'Description'}</label>
            <input style={styles.input} value={quoteForm.description} onChange={e => setQuoteForm({ ...quoteForm, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', padding: '12px' }}>
              📄 {isAr ? 'إنشاء عرض سعر' : 'Generate Quotation'}
            </button>
          </div>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>{isAr ? 'عروض الأسعار الحديثة (مسودة)' : 'Recent Quotations (Drafts)'}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{isAr ? 'رقم العرض' : 'Quote No'}</th>
                <th style={styles.th}>{isAr ? 'الخدمة' : 'Service'}</th>
                <th style={styles.th}>{isAr ? 'العميل' : 'Customer'}</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {quotations.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                    {isAr ? 'لا توجد عروض أسعار.' : 'No quotations found.'}
                  </td>
                </tr>
              ) : (
                quotations.map(q => (
                  <tr key={q.id}>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#60A5FA' }}>{q.invoice_no}</td>
                    <td style={styles.td}>{q.sector}</td>
                    <td style={styles.td}>{q.customers?.name || 'N/A'}</td>
                    <td style={styles.tdRight}>{fmt(q.total)}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#065F46', color: '#34D399' }} onClick={() => convertToInvoice(q)}>
                          {isAr ? 'تحويل' : 'Convert'}
                        </button>
                        <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => deleteQuote(q)}>
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
  );}

function HRAdvancedView(props) {
  const {
    page, data, tr, today, userProfile, showToast, setData,
    lang, theme,
    handleProcessPayroll, handleGenerateSlip, handleDeletePayroll,
    employees, payForm, setPayForm, handleExportCSV
  } = props;
  const isAr = lang === 'ar';
  const isDark = theme === 'dark';
  const { styles, fmt } = useAdvancedHelpers(props);
  const [editTargetId, setEditTargetId] = useState(null);
  const [targetVal, setTargetVal] = useState(0);
  const [attForm, setAttForm] = useState({
    empId: '',
    date: today,
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'Present',
    leaveStart: today,
    leaveEnd: today
  });
  const [attendance, setAttendance] = useState([]);
  const [payFormLocal, setPayFormLocal] = useState({
    empId: '',
    base: 0,
    comm: 0,
    adv_ded: 0,
    gift: 0,
    month: today.substring(0, 7),
    mode: 'Cash'
  });

  // Fetch attendance
  useEffect(() => {
    if (page === 'hr_advanced' && userProfile?.tenant_id) {
      supabase.from('attendance')
        .select('*, employees(name)')
        .eq('tenant_id', userProfile.tenant_id)
        .order('date', { ascending: false })
        .then(({ data: att }) => {
          setAttendance(att || []);
        });
    }
  }, [page, userProfile]);

  const saveTarget = async (empId) => {
    try {
      const { data: upEmp, error } = await supabase
        .from('employees')
        .update({ target: parseFloat(targetVal) || 0 })
        .eq('id', empId)
        .select()
        .single();
      if (error) throw error;
      setData(prev => ({ ...prev, employees: prev.employees.map(e => e.id === empId ? upEmp : e) }));
      showToast(isAr ? '✅ تم تحديث الهدف!' : '✅ Target Updated!');
      setEditTargetId(null);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const calcAttendance = (checkIn, checkOut) => {
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    let totalMins = (outH * 60 + outM) - (inH * 60 + inM);
    if (totalMins < 0) totalMins += 24 * 60;
    const workedHrs = totalMins / 60;
    let ot = 0,
      deduction = 0;
    if (workedHrs > 9) ot = workedHrs - 9;
    if (workedHrs < 8 && workedHrs >= 0) deduction = 8 - workedHrs;
    return { ot: ot.toFixed(1), deduction: deduction.toFixed(1) };
  };

  const markAttendance = async (e) => {
    e.preventDefault();
    if (!attForm.empId) return showToast(isAr ? 'اختر موظفاً!' : 'Select an employee!');
    try {
      let payload = {
        employee_id: attForm.empId,
        date: attForm.date,
        status: attForm.status,
        tenant_id: userProfile.tenant_id
      };

      if (attForm.status === 'Present') {
        const { ot, deduction } = calcAttendance(attForm.checkIn, attForm.checkOut);
        payload.check_in = attForm.checkIn;
        payload.check_out = attForm.checkOut;
        payload.overtime = parseFloat(ot);
        payload.deduction = parseFloat(deduction);
      } else if (attForm.status === 'Leave') {
        payload.leave_start = attForm.leaveStart;
        payload.leave_end = attForm.leaveEnd;
      }

      const { data: newAtt, error } = await supabase
        .from('attendance')
        .insert([payload])
        .select('*, employees(name)')
        .single();

      if (error) throw error;
      setAttendance(prev => [newAtt, ...prev]);

      let msg = isAr ? '✅ تم تسجيل الحضور!' : '✅ Attendance Marked!';
      if (payload.overtime > 0) msg += ` ${isAr ? 'إضافي' : 'OT'}: ${payload.overtime} ${isAr ? 'ساعات' : 'hrs'}.`;
      if (payload.deduction > 0) msg += ` ${isAr ? 'خصم' : 'Deduction'}: ${payload.deduction} ${isAr ? 'ساعات' : 'hrs'}.`;
      showToast(msg);

      setAttForm({
        empId: '',
        date: today,
        checkIn: '09:00',
        checkOut: '18:00',
        status: 'Present',
        leaveStart: today,
        leaveEnd: today
      });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handlePayEmpChange = (empId) => {
    const emp = data.employees.find(e => e.id === empId);
    const pendingAdv = (data.empAdvances || []).filter(a => a.employee_id === empId && a.status === 'Pending').reduce((sum, a) => sum + a.amount, 0);
    setPayFormLocal({ ...payFormLocal, empId, base: emp?.salary || 0, adv_ded: pendingAdv });
  };

  const handlePaySalarySubmit = async (e) => {
    e.preventDefault();
    const syntheticEvent = {
      preventDefault: () => {},
      target: {
        emp: { value: payFormLocal.empId },
        base: { value: payFormLocal.base },
        comm: { value: payFormLocal.comm },
        adv_ded: { value: payFormLocal.adv_ded },
        gift: { value: payFormLocal.gift },
        month: { value: payFormLocal.month },
        mode: { value: payFormLocal.mode }
      }
    };
    await handleProcessPayroll(syntheticEvent);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎯 {isAr ? 'أهداف الموظفين والأداء' : 'Employee Targets & Performance'}</h1>
        <button style={{ ...styles.btn, ...styles.btnInfo }} onClick={() => handleExportCSV?.('employees')}>
          📥 {isAr ? 'تصدير' : 'Export'}
        </button>
      </div>

      {/* Targets Table */}
      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{isAr ? 'الموظف' : 'Employee'}</th>
                <th style={styles.th}>{isAr ? 'الهدف (ريال)' : 'Target (SAR)'}</th>
                <th style={styles.th}>{isAr ? 'المحقق (ريال)' : 'Achieved (SAR)'}</th>
                <th style={styles.th}>{isAr ? 'النسبة المئوية' : 'Percentage'}</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {(data.employees || []).map(emp => {
                const empInv = (data.invoices || []).filter(i =>
                  i.employee_id === emp.id &&
                  !i.invoice_no?.startsWith('REF-') &&
                  i.status !== 'Draft'
                );
                const achieved = empInv.reduce((s, i) => s + (i.total || 0), 0);
                const target = emp.target || 0;
                const perc = target > 0 ? (achieved / target) * 100 : 0;

                return (
                  <tr key={emp.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{emp.name}</td>
                    <td style={styles.td}>
                      {editTargetId === emp.id ? (
                        <input
                          type="number"
                          value={targetVal}
                          onChange={e => setTargetVal(e.target.value)}
                          style={{ ...styles.input, width: '100px', margin: 0 }}
                        />
                      ) : (
                        <span style={{ cursor: 'pointer', textDecoration: 'underline', color: '#60A5FA' }}
                          onClick={() => { setEditTargetId(emp.id); setTargetVal(target); }}>
                          {target.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td style={{ ...styles.td, color: '#34D399' }}>{achieved.toFixed(2)}</td>
                    <td style={styles.td}>
                      <div style={{
                        background: isDark ? '#0F172A' : '#F1F5F9',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        width: '100%',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: `${Math.min(perc, 100)}%`,
                          background: perc >= 100 ? '#059669' : '#FBBF24',
                          height: '100%',
                          transition: 'width 0.5s',
                          borderRadius: '10px'
                        }} />
                        <span style={{
                          position: 'absolute',
                          right: '8px',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          color: isDark ? '#CBD5E1' : '#1E293B'
                        }}>
                          {perc.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td style={styles.tdCenter}>
                      {editTargetId === emp.id ? (
                        <button onClick={() => saveTarget(emp.id)} style={{ ...styles.btn, ...styles.btnSuccess, padding: '6px 12px' }}>
                          {isAr ? 'حفظ' : 'Save'}
                        </button>
                      ) : (
                        <button onClick={() => { setEditTargetId(emp.id); setTargetVal(target); }}
                          style={{ ...styles.btn, ...styles.btnWarning, padding: '6px 12px' }}>
                          ✏️ {isAr ? 'تعديل' : 'Edit'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(data.employees || []).length === 0 && (
                <tr>
                  <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                    {isAr ? 'لا يوجد موظفين' : 'No employees found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>📅 {isAr ? 'الحضور اليومي القائم على الوقت' : 'Daily Time-Based Attendance'}</h3>
        <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '15px' }}>
          {isAr
            ? 'سجل وقت الحضور والانصراف. سيقوم النظام بحساب العمل الإضافي (>9 ساعات) وخصم الراتب (<8 ساعات) تلقائياً.'
            : 'Mark Check-in and Check-out time. System will automatically calculate Overtime (>9 hrs) and Salary Deduction (<8 hrs).'}
        </p>

        <form onSubmit={markAttendance} style={styles.formRow}>
          <div>
            <label style={styles.formLabel}>{isAr ? 'التاريخ' : 'Date'}</label>
            <input type="date" style={styles.input} value={attForm.date} onChange={e => setAttForm({ ...attForm, date: e.target.value })} required />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'الموظف' : 'Employee'}</label>
            <select style={styles.select} value={attForm.empId} onChange={e => setAttForm({ ...attForm, empId: e.target.value })} required>
              <option value="">{isAr ? 'اختر الموظف' : 'Select Employee'}</option>
              {(data.employees || []).map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'الحالة' : 'Status'}</label>
            <select style={styles.select} value={attForm.status} onChange={e => setAttForm({ ...attForm, status: e.target.value })}>
              <option>{isAr ? 'حاضر' : 'Present'}</option>
              <option>{isAr ? 'إجازة' : 'Leave'}</option>
              <option>{isAr ? 'غائب' : 'Absent'}</option>
            </select>
          </div>

          {attForm.status === 'Present' ? (
            <>
              <div>
                <label style={styles.formLabel}>{isAr ? 'وقت الحضور' : 'Check-In'}</label>
                <input type="time" style={styles.input} value={attForm.checkIn} onChange={e => setAttForm({ ...attForm, checkIn: e.target.value })} required />
              </div>
              <div>
                <label style={styles.formLabel}>{isAr ? 'وقت الانصراف' : 'Check-Out'}</label>
                <input type="time" style={styles.input} value={attForm.checkOut} onChange={e => setAttForm({ ...attForm, checkOut: e.target.value })} required />
              </div>
            </>
          ) : attForm.status === 'Leave' ? (
            <>
              <div>
                <label style={styles.formLabel}>{isAr ? 'بداية الإجازة' : 'Leave Start'}</label>
                <input type="date" style={styles.input} value={attForm.leaveStart} onChange={e => setAttForm({ ...attForm, leaveStart: e.target.value })} required />
              </div>
              <div>
                <label style={styles.formLabel}>{isAr ? 'نهاية الإجازة' : 'Leave End'}</label>
                <input type="date" style={styles.input} value={attForm.leaveEnd} onChange={e => setAttForm({ ...attForm, leaveEnd: e.target.value })} required />
              </div>
            </>
          ) : null}

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
              ✅ {isAr ? 'تسجيل' : 'Mark'}
            </button>
          </div>
        </form>

        {/* Attendance History */}
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{isAr ? 'التاريخ' : 'Date'}</th>
                <th style={styles.th}>{isAr ? 'الموظف' : 'Employee'}</th>
                <th style={styles.th}>{isAr ? 'وقت الحضور' : 'Check-In'}</th>
                <th style={styles.th}>{isAr ? 'وقت الانصراف' : 'Check-Out'}</th>
                <th style={styles.th}>{isAr ? 'إضافي' : 'Overtime'}</th>
                <th style={styles.th}>{isAr ? 'خصم' : 'Deduction'}</th>
                <th style={styles.th}>{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                    {isAr ? 'لم يتم تسجيل أي حضور بعد.' : 'No attendance marked yet.'}
                  </td>
                </tr>
              ) : (
                attendance.slice(0, 15).map(a => (
                  <tr key={a.id}>
                    <td style={styles.td}>{a.date}</td>
                    <td style={styles.td}>{a.employees?.name || 'N/A'}</td>
                    <td style={styles.td}>{a.check_in || '-'}</td>
                    <td style={styles.td}>{a.check_out || '-'}</td>
                    <td style={{ ...styles.td, color: '#34D399', fontWeight: 'bold' }}>{a.overtime ? `${a.overtime} hrs` : '0'}</td>
                    <td style={{ ...styles.td, color: '#FCA5A5', fontWeight: 'bold' }}>{a.deduction ? `${a.deduction} hrs` : '0'}</td>
                    <td style={{ ...styles.td, color: a.status === 'Present' ? '#34D399' : '#FBBF24', fontWeight: 'bold' }}>
                      {a.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Salary */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>💰 {isAr ? 'دفع الراتب' : 'Pay Salary'}</h3>
        <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '15px' }}>
          {isAr
            ? 'اختر الموظف لملء الراتب الأساسي والسلف المستحقة تلقائياً. سيتم حساب العمولة والعمل الإضافي تلقائياً من المبيعات والحضور.'
            : 'Select Employee to Auto-Fill Basic Salary & Pending Advances. Commission & Overtime will auto-calculate from Sales & Attendance.'}
        </p>

        <form onSubmit={handlePaySalarySubmit} style={styles.formRow}>
          <div>
            <label style={styles.formLabel}>{isAr ? 'الموظف' : 'Employee'}</label>
            <select style={styles.select} value={payFormLocal.empId} onChange={e => handlePayEmpChange(e.target.value)} required>
              <option value="">{isAr ? 'اختر الموظف' : 'Select Employee'}</option>
              {(data.employees || []).map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'الراتب الأساسي' : 'Base Salary'}</label>
            <input type="number" style={styles.input} value={payFormLocal.base} onChange={e => setPayFormLocal({ ...payFormLocal, base: e.target.value })} required />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'العمولة %' : 'Commission %'}</label>
            <input type="number" style={styles.input} value={payFormLocal.comm} onChange={e => setPayFormLocal({ ...payFormLocal, comm: e.target.value })} required />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'خصم السلفة' : 'Adv. Deduct'}</label>
            <input type="number" style={styles.input} value={payFormLocal.adv_ded} onChange={e => setPayFormLocal({ ...payFormLocal, adv_ded: e.target.value })} required />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'هدية/مكافأة' : 'Gift/Bonus'}</label>
            <input type="number" style={styles.input} value={payFormLocal.gift} onChange={e => setPayFormLocal({ ...payFormLocal, gift: e.target.value })} required />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'الشهر' : 'Month'}</label>
            <input type="month" style={styles.input} value={payFormLocal.month} onChange={e => setPayFormLocal({ ...payFormLocal, month: e.target.value })} required />
          </div>
          <div>
            <label style={styles.formLabel}>{isAr ? 'الطريقة' : 'Mode'}</label>
            <select style={styles.select} value={payFormLocal.mode} onChange={e => setPayFormLocal({ ...payFormLocal, mode: e.target.value })}>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{ ...styles.btn, ...styles.btnSuccess, width: '100%' }}>
              💰 {isAr ? 'دفع الراتب' : 'Pay Salary'}
            </button>
          </div>
        </form>
      </div>

      {/* Salary Slips */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>📋 {isAr ? 'قسائم الرواتب' : 'Salary Slips'}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{isAr ? 'الموظف' : 'Employee'}</th>
                <th style={styles.th}>{isAr ? 'الشهر' : 'Month'}</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>{isAr ? 'صافي المدفوع' : 'Net Paid'}</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {(data.payroll || []).length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ ...styles.td, textAlign: 'center', padding: 30, color: '#94A3B8' }}>
                    {isAr ? 'لم يتم دفع أي راتب بعد.' : 'No salary paid yet.'}
                  </td>
                </tr>
              ) : (
                (data.payroll || []).map(p => (
                  <tr key={p.id}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{p.employees?.name || 'N/A'}</td>
                    <td style={styles.td}>{p.month}</td>
                    <td style={{ ...styles.tdRight, color: '#34D399', fontWeight: 'bold' }}>{fmt(p.amount)}</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionsCell}>
                        <button style={{ ...styles.actionBtn, background: '#1E3A8A', color: '#93C5FD' }} onClick={() => handleGenerateSlip(p)}>
                          🧾 {isAr ? 'معاينة' : 'Preview'}
                        </button>
                        <button style={{ ...styles.actionBtn, background: '#991B1B', color: '#FECACA' }} onClick={() => handleDeletePayroll(p)}>
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
  );}
