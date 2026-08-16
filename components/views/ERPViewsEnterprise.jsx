'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const styles = { 
  input: { width: '100%', padding: '12px 15px', margin: '6px 0', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }, 
  btnPrimary: { padding: '12px 15px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  card: { background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', marginTop: '12px' },
  tableHeader: { background: '#0F172A', color: 'white', padding: '15px', textAlign: 'start', fontSize: '13px' },
  tableCell: { padding: '15px', borderBottom: '1px solid #F1F5F9', fontSize: '14px' }
};

export default function ERPViewsEnterprise(props) {
  const { page, data, tr, today, userProfile, showToast, setData } = props;
  const [editLimitId, setEditLimitId] = useState(null);
  const [limitVal, setLimitVal] = useState(0);

  // 1. CUSTOMER CREDIT LIMITS
  if (page === 'credit_limits') {
    const saveLimit = async (custId) => {
      try {
        const { data: upCust, error } = await supabase.from('customers').update({ credit_limit: parseFloat(limitVal) || 0 }).eq('id', custId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === custId ? upCust : c) }));
        showToast('Credit Limit Updated!');
        setEditLimitId(null);
      } catch (err) { showToast('Error: ' + err.message); }
    };

    return (
      <div>
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>💳 Customer Credit Limits</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Set maximum credit limit for each customer. System will warn if outstanding exceeds this limit.</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead><tr><th style={styles.tableHeader}>Customer</th><th style={styles.tableHeader}>Current Outstanding</th><th style={styles.tableHeader}>Credit Limit</th><th style={styles.tableHeader}>Action</th></tr></thead>
              <tbody>
                {data.customers.map(c => {
                  const custInvs = data.invoices.filter(i => i.customer_id === c.id && !i.invoice_no.startsWith('REF-'));
                  const outstanding = custInvs.reduce((s, i) => s + (i.due_amount || 0), 0);
                  const limit = c.credit_limit || 0;
                  const isOverLimit = outstanding > limit && limit > 0;
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9', background: isOverLimit ? '#FEF2F2' : 'white' }}>
                      <td style={{...styles.tableCell, fontWeight: 'bold'}}>{c.name}</td>
                      <td style={{...styles.tableCell, color: outstanding > 0 ? '#EF4444' : '#059669'}}>
                        {outstanding.toFixed(2)} SAR 
                        {isOverLimit && <span style={{ marginLeft: '10px', padding: '2px 8px', background: '#EF4444', color: 'white', borderRadius: '12px', fontSize: '11px' }}>OVER LIMIT</span>}
                      </td>
                      <td style={styles.tableCell}>
                        {editLimitId === c.id ? <input type="number" value={limitVal} onChange={e => setLimitVal(e.target.value)} style={{...styles.input, width: '100px', margin: 0}} /> : <span>{limit.toFixed(2)} SAR</span>}
                      </td>
                      <td style={styles.tableCell}>
                        {editLimitId === c.id ? <button onClick={() => saveLimit(c.id)} style={styles.btnSuccess}>Save</button> : <button onClick={() => { setEditLimitId(c.id); setLimitVal(limit); }} style={{...styles.btnPrimary, padding: '8px 12px', width: 'auto'}}>Edit Limit</button>}
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

  // 2. SUPPLIER STATEMENT (Vendors)
  if (page === 'supplier_statement') {
    return (
      <div>
        <h2 style={{ color: '#0F172A', marginBottom: '20px' }}>📦 Supplier Statements</h2>
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={styles.tableHeader}>Vendor Name</th><th style={styles.tableHeader}>Phone</th><th style={styles.tableHeader}>Balance Due</th></tr></thead>
            <tbody>
              {data.vendors.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{...styles.tableCell, fontWeight: 'bold'}}>{v.name}</td>
                  <td style={styles.tableCell}>{v.phone || 'N/A'}</td>
                  <td style={{...styles.tableCell, color: '#EF4444', fontWeight: 'bold'}}>{(v.balance || 0).toFixed(2)} SAR</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. MULTI-BRANCH SUPPORT
  if (page === 'multi_branch') {
    return (
      <div>
        <h2 style={{ color: '#0F172A', marginBottom: '20px' }}>🏢 Multi-Branch Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {data.branches.map(br => {
            const brInv = data.invoices.filter(i => i.branch_id === br.id);
            const sales = brInv.reduce((s, i) => s + (i.total || 0), 0);
            return (
              <div key={br.id} style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '5px solid #2563EB' }}>
                <h3 style={{ color: '#0F172A', marginTop: 0, fontSize: '20px' }}>{br.name}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', margin: '5px 0' }}>Manager: {br.manager || 'N/A'}</p>
                <p style={{ fontSize: '14px', color: '#64748B', margin: '5px 0 15px' }}>Status: <span style={{ color: br.status === 'Active' ? '#059669' : '#EF4444', fontWeight: 'bold' }}>{br.status}</span></p>
                <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                  <h4 style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Total Sales</h4>
                  <p style={{ margin: '5px 0 0', color: '#059669', fontSize: '24px', fontWeight: 'bold' }}>{sales.toFixed(2)} SAR</p>
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
