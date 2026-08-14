'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }, 
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block', marginTop: '10px' } 
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
        <h2 style={{ color: '#1E3A8A' }}>💳 Customer Credit Limits</h2>
        <div style={styles.card}>
          <p style={{ color: '#64748b', marginBottom: '15px' }}>Set maximum credit limit for each customer. System will warn if outstanding exceeds this limit.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{padding:'12px', textAlign:'left'}}>Customer</th><th style={{padding:'12px'}}>Current Outstanding</th><th style={{padding:'12px'}}>Credit Limit</th><th style={{padding:'12px'}}>Action</th></tr></thead>
            <tbody>
              {data.customers.map(c => {
                const custInvs = data.invoices.filter(i => i.customer_id === c.id && !i.invoice_no.startsWith('REF-'));
                const outstanding = custInvs.reduce((s, i) => s + (i.due_amount || 0), 0);
                const limit = c.credit_limit || 0;
                const isOverLimit = outstanding > limit && limit > 0;
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0', background: isOverLimit ? '#fef2f2' : 'white' }}>
                    <td style={{padding:'12px', fontWeight: 'bold'}}>{c.name}</td>
                    <td style={{padding:'12px', textAlign: 'center', color: outstanding > 0 ? '#EF4444' : '#059669'}}>{outstanding.toFixed(2)} SAR</td>
                    <td style={{padding:'12px', textAlign: 'center'}}>
                      {editLimitId === c.id ? <input type="number" value={limitVal} onChange={e => setLimitVal(e.target.value)} style={{...styles.input, width: '100px', margin: 0}} /> : <span>{limit.toFixed(2)} SAR</span>}
                    </td>
                    <td style={{padding:'12px', textAlign: 'center'}}>
                      {editLimitId === c.id ? <button onClick={() => saveLimit(c.id)} style={styles.btnSuccess}>Save</button> : <button onClick={() => { setEditLimitId(c.id); setLimitVal(limit); }} style={{...styles.btnPrimary, padding: '5px 10px', width: 'auto'}}>Edit Limit</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. SUPPLIER STATEMENT (Vendors)
  if (page === 'supplier_statement') {
    return (
      <div>
        <h2 style={{ color: '#1E3A8A' }}>📦 Supplier Statements</h2>
        <div style={styles.card}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{padding:'12px', textAlign:'left'}}>Vendor Name</th><th style={{padding:'12px'}}>Phone</th><th style={{padding:'12px'}}>Balance Due</th></tr></thead>
            <tbody>
              {data.vendors.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{padding:'12px', fontWeight: 'bold'}}>{v.name}</td>
                  <td style={{padding:'12px', textAlign: 'center'}}>{v.phone || 'N/A'}</td>
                  <td style={{padding:'12px', textAlign: 'center', color: '#EF4444', fontWeight: 'bold'}}>{(v.balance || 0).toFixed(2)} SAR</td>
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
        <h2 style={{ color: '#1E3A8A' }}>🏢 Multi-Branch Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          {data.branches.map(br => {
            const brInv = data.invoices.filter(i => i.branch_id === br.id);
            const sales = brInv.reduce((s, i) => s + (i.total || 0), 0);
            return (
              <div key={br.id} style={styles.card}>
                <h3 style={{ color: '#1E3A8A', marginTop: 0 }}>{br.name}</h3>
                <p style={{ fontSize: '14px', color: '#555' }}>Manager: {br.manager || 'N/A'}</p>
                <p style={{ fontSize: '14px', color: '#555' }}>Status: <span style={{ color: br.status === 'Active' ? '#059669' : '#EF4444', fontWeight: 'bold' }}>{br.status}</span></p>
                <hr style={{ borderColor: '#e2e8f0', margin: '10px 0' }} />
                <h4 style={{ margin: 0, color: '#059669' }}>Sales: {sales.toFixed(2)} SAR</h4>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
