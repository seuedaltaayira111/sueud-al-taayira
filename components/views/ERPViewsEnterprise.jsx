'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const styles = { 
  container: { padding: '24px', background: '#0A0F1C', minHeight: '100vh', color: '#E2E8F0' },
  card: { background: '#1E293B', padding: '24px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #334155' },
  headerGradient: { background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)' },
  input: { width: '100%', padding: '12px 16px', margin: '6px 0', background: '#0F172A', border: '1px solid #475569', borderRadius: '10px', outline: 'none', boxSizing: 'border-box', fontSize: '14px', color: '#E2E8F0', ':focus': { borderColor: '#FBBF24' } }, 
  btnPrimary: { padding: '10px 20px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }, 
  btnSuccess: { padding: '8px 16px', background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }, 
  label: { fontSize: '12px', fontWeight: '700', color: '#94A3B8', marginBottom: '6px', display: 'block', marginTop: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', background: '#0F172A', color: '#FBBF24', textAlign: 'start', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #334155' },
  td: { padding: '14px 16px', borderBottom: '1px solid #1E293B', fontSize: '14px', color: '#CBD5E1' },
  tdRight: { padding: '14px 16px', borderBottom: '1px solid #1E293B', fontSize: '14px', color: '#CBD5E1', textAlign: 'right', fontWeight: '600' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700' }
};

export default function ERPViewsEnterprise(props) {
  const { page, data, tr, lang, today, userProfile, showToast, setData } = props;
  const t = (key, fallback) => tr?.[key] || fallback || key;
  const isAr = lang === 'ar';
  const [editLimitId, setEditLimitId] = useState(null);
  const [limitVal, setLimitVal] = useState(0);

  if (page === 'credit_limits') {
    const saveLimit = async (custId) => {
      try {
        const { data: upCust, error } = await supabase.from('customers').update({ credit_limit: parseFloat(limitVal) || 0 }).eq('id', custId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === custId ? upCust : c) }));
        showToast(t('save', 'Saved') + '!');
        setEditLimitId(null);
      } catch (err) { showToast('Error: ' + err.message); }
    };

    return (
      <div style={styles.container}>
        <div style={styles.headerGradient}>
          <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>💳</span>
            {t('creditLimits', 'Customer Credit Limits')}
          </h2>
          <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>{t('creditLimitsDesc', 'Set maximum credit limit for each customer.')}</p>
        </div>
        <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{t('customer', 'Customer')}</th>
                  <th style={styles.th}>{t('currentOutstanding', 'Current Outstanding')}</th>
                  <th style={styles.th}>{t('creditLimit', 'Credit Limit')}</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>{t('actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {data.customers.map(c => {
                  const custInvs = data.invoices.filter(i => i.customer_id === c.id && !i.invoice_no.startsWith('REF-'));
                  const outstanding = custInvs.reduce((s, i) => s + (i.due_amount || 0), 0);
                  const limit = c.credit_limit || 0;
                  const isOverLimit = outstanding > limit && limit > 0;
                  return (
                    <tr key={c.id} style={{ background: isOverLimit ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                      <td style={{ ...styles.td, fontWeight: '700' }}>{c.name}</td>
                      <td style={{ ...styles.td, color: outstanding > 0 ? '#FCA5A5' : '#34D399', fontWeight: '600' }}>
                        {outstanding.toFixed(2)} SAR 
                        {isOverLimit && <span style={{ ...styles.badge, background: '#EF4444', color: 'white', marginInlineStart: '10px' }}>{t('overLimit', 'OVER LIMIT')}</span>}
                      </td>
                      <td style={styles.td}>
                        {editLimitId === c.id ? 
                          <input type="number" value={limitVal} onChange={e => setLimitVal(e.target.value)} style={{ ...styles.input, width: '120px', margin: 0 }} /> : 
                          <span style={{ fontWeight: '600' }}>{limit.toFixed(2)} SAR</span>
                        }
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        {editLimitId === c.id ? 
                          <button onClick={() => saveLimit(c.id)} style={styles.btnSuccess}>{t('save', 'Save')}</button> : 
                          <button onClick={() => { setEditLimitId(c.id); setLimitVal(limit); }} style={styles.btnPrimary}>{t('editLimit', 'Edit Limit')}</button>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'supplier_statement') {
    return (
      <div style={styles.container}>
        <div style={styles.headerGradient}>
          <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>📦</span>
            {t('supplierStatement', 'Supplier Statements')}
          </h2>
          <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>{t('supplierStatementsDesc', 'Vendor balances and payment history.')}</p>
        </div>
        <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{t('name', 'Name')}</th>
                <th style={styles.th}>{t('phone', 'Phone')}</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>{t('balance', 'Balance Due')}</th>
              </tr>
            </thead>
            <tbody>
              {data.vendors.map(v => (
                <tr key={v.id}>
                  <td style={{ ...styles.td, fontWeight: '700' }}>{v.name}</td>
                  <td style={styles.td}>{v.phone || '-'}</td>
                  <td style={{ ...styles.tdRight, color: '#FCA5A5', fontWeight: '700' }}>{(v.balance || 0).toFixed(2)} SAR</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (page === 'multi_branch') {
    return (
      <div style={styles.container}>
        <div style={styles.headerGradient}>
          <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🏢</span>
            {t('multiBranch', 'Multi-Branch Overview')}
          </h2>
          <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>{t('multiBranchDesc', 'Compare performance across all branches.')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {data.branches.map(br => {
            const brInv = data.invoices.filter(i => i.branch_id === br.id);
            const sales = brInv.reduce((s, i) => s + (i.total || 0), 0);
            return (
              <div key={br.id} style={{ 
                background: '#1E293B', 
                padding: '24px', 
                borderRadius: '16px', 
                border: '1px solid #334155',
                borderInlineStart: '4px solid #2563EB',
                transition: 'transform 0.2s, box-shadow 0.2s',
                ':hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.3)' }
              }}>
                <h3 style={{ color: '#FBBF24', marginTop: 0, fontSize: '18px', marginBottom: '12px' }}>{br.name}</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0' }}>
                  {t('manager', 'Manager')}: <span style={{ color: '#E2E8F0', fontWeight: '600' }}>{br.manager || '-'}</span>
                </p>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 16px' }}>
                  {t('status', 'Status')}: <span style={{ color: br.status === 'Active' ? '#34D399' : '#EF4444', fontWeight: '700' }}>{br.status}</span>
                </p>
                <div style={{ background: '#0F172A', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('totalSales', 'Total Sales')}</div>
                  <div style={{ color: '#34D399', fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{sales.toFixed(2)}</div>
                  <div style={{ color: '#64748B', fontSize: '12px', marginTop: '2px' }}>SAR</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
