'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }, 
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block', marginTop: '10px' } 
};

export default function ERPViewsPro(props) {
  const { page, data, tr, today, userProfile, showToast, setData } = props;
  const [stmtCustId, setStmtCustId] = useState('');
  const [recForm, setRecForm] = useState({ customer_id: '', amount: '', interval: 'Monthly' });

  // 1. CUSTOMER STATEMENT (Running Balance)
  if (page === 'customer_statement') {
    const custInvs = data.invoices.filter(i => i.customer_id === stmtCustId && !i.invoice_no.startsWith('REF-'));
    const custPay = data.cashbook.filter(c => c.description.includes('Settlement') || c.description.includes('Payment'));
    let runningBalance = 0;

    return (
      <div>
        <h2 style={{ color: '#1E3A8A' }}>📊 Customer Statement</h2>
        <div style={styles.card}>
          <label style={styles.label}>Select Customer</label>
          <select style={styles.input} value={stmtCustId} onChange={e => setStmtCustId(e.target.value)}>
            <option value="">Select Customer to View Statement</option>
            {data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {stmtCustId && (
          <div style={styles.card}>
            <h3>Transaction History</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{padding:'10px', textAlign:'left'}}>Date</th><th style={{padding:'10px'}}>Invoice No</th><th style={{padding:'10px'}}>Debit (Inv)</th><th style={{padding:'10px'}}>Credit (Paid)</th><th style={{padding:'10px'}}>Balance</th></tr></thead>
              <tbody>
                {custInvs.length === 0 ? <tr><td colSpan="5" style={{padding:'15px', textAlign:'center'}}>No transactions found.</td></tr> : 
                  custInvs.map(inv => {
                    runningBalance += (inv.total || 0) - (inv.paid_amount || 0);
                    return (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{padding:'10px'}}>{inv.invoice_date}</td>
                        <td style={{padding:'10px', textAlign:'center'}}>{inv.invoice_no}</td>
                        <td style={{padding:'10px', textAlign:'center', color: '#EF4444'}}>{(inv.total || 0).toFixed(2)}</td>
                        <td style={{padding:'10px', textAlign:'center', color: '#059669'}}>{(inv.paid_amount || 0).toFixed(2)}</td>
                        <td style={{padding:'10px', textAlign:'center', fontWeight: 'bold'}}>{runningBalance.toFixed(2)} SAR</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // 2. RECURRING INVOICES
  if (page === 'recurring_invoices') {
    const recurringInvs = data.invoices.filter(i => i.is_recurring);

    const handleCreateRecurring = async (e) => {
      e.preventDefault();
      try {
        const invNo = `REC-${Date.now()}`;
        const payload = {
          invoice_no: invNo,
          customer_id: recForm.customer_id,
          total: parseFloat(recForm.amount) || 0,
          total_sell: parseFloat(recForm.amount) || 0,
          paid_amount: 0,
          due_amount: parseFloat(recForm.amount) || 0,
          invoice_date: today,
          is_recurring: true,
          recurring_interval: recForm.interval,
          status: 'Recurring',
          tenant_id: userProfile.tenant_id
        };
        const { data: newInv, error } = await supabase.from('invoices').insert([payload]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, invoices: [newInv, ...prev.invoices] }));
        showToast('Recurring Profile Created!');
        setRecForm({ customer_id: '', amount: '', interval: 'Monthly' });
      } catch (err) { showToast('Error: ' + err.message); }
    };

    return (
      <div>
        <h2 style={{ color: '#1E3A8A' }}>🔁 Recurring Invoices</h2>
        <div style={styles.card}>
          <h3>Setup Recurring Profile</h3>
          <form onSubmit={handleCreateRecurring} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'flex-end' }}>
            <div><label style={styles.label}>Customer</label><select style={styles.input} value={recForm.customer_id} onChange={e => setRecForm({...recForm, customer_id: e.target.value})} required><option value="">Select</option>{data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label style={styles.label}>Amount (SAR)</label><input type="number" style={styles.input} value={recForm.amount} onChange={e => setRecForm({...recForm, amount: e.target.value})} required /></div>
            <div><label style={styles.label}>Interval</label><select style={styles.input} value={recForm.interval} onChange={e => setRecForm({...recForm, interval: e.target.value})}><option>Monthly</option><option>Yearly</option><option>Weekly</option></select></div>
            <button type="submit" style={{...styles.btnPrimary, height: '42px'}}>Create</button>
          </form>
        </div>
        <div style={styles.card}>
          <h3>Active Recurring Profiles</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{padding:'10px', textAlign:'left'}}>Profile ID</th><th style={{padding:'10px'}}>Interval</th><th style={{padding:'10px'}}>Amount</th></tr></thead>
            <tbody>
              {recurringInvs.length === 0 ? <tr><td colSpan="3" style={{padding:'15px', textAlign:'center'}}>No recurring profiles found.</td></tr> : recurringInvs.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{padding:'10px'}}>{r.invoice_no}</td>
                  <td style={{padding:'10px', textAlign:'center'}}>{r.recurring_interval}</td>
                  <td style={{padding:'10px', textAlign:'center'}}>{(r.total || 0).toFixed(2)} SAR</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. EXPENSE APPROVAL SYSTEM
  if (page === 'expense_approval') {
    const pendingExpenses = data.expenses.filter(e => e.approval_status === 'Pending');
    const updateApproval = async (expId, status) => {
      try {
        const { data: upExp, error } = await supabase.from('expenses').update({ approval_status: status }).eq('id', expId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, expenses: prev.expenses.map(e => e.id === expId ? upExp : e) }));
        showToast(`Expense ${status}!`);
      } catch (err) { showToast('Error: ' + err.message); }
    };

    return (
      <div>
        <h2 style={{ color: '#1E3A8A' }}>🛡️ Expense Approval System</h2>
        <div style={styles.card}>
          <p style={{ color: '#64748b', marginBottom: '15px' }}>Expenses created by staff will appear here for Admin approval before affecting cash balance.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{padding:'10px', textAlign:'left'}}>Date</th><th style={{padding:'10px'}}>Vendor</th><th style={{padding:'10px'}}>Amount</th><th style={{padding:'10px'}}>Status</th><th style={{padding:'10px'}}>Actions</th></tr></thead>
            <tbody>
              {pendingExpenses.length === 0 ? <tr><td colSpan="5" style={{padding:'15px', textAlign:'center'}}>No pending expenses for approval.</td></tr> : pendingExpenses.map(exp => (
                <tr key={exp.id} style={{ borderBottom: '1px solid #e2e8f0', background: '#fffbeb' }}>
                  <td style={{padding:'10px'}}>{exp.expense_date}</td>
                  <td style={{padding:'10px', textAlign:'center'}}>{exp.vendor_name}</td>
                  <td style={{padding:'10px', textAlign:'center', fontWeight: 'bold'}}>{(exp.amount || 0).toFixed(2)} SAR</td>
                  <td style={{padding:'10px', textAlign:'center', color: '#D97706', fontWeight: 'bold'}}>{exp.approval_status}</td>
                  <td style={{padding:'10px', textAlign:'center'}}>
                    <button onClick={() => updateApproval(exp.id, 'Approved')} style={styles.btnSuccess}>Approve</button>
                    <button onClick={() => updateApproval(exp.id, 'Rejected')} style={{...styles.btnDanger, marginLeft: '5px'}}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 4. NOTIFICATIONS CENTER
  if (page === 'notifications') {
    const pendingInv = data.invoices.filter(i => i.due_amount > 0 && !i.invoice_no.startsWith('REF-'));
    const pendingExp = data.expenses.filter(e => e.approval_status === 'Pending');
    const lowPortals = data.portals.filter(p => (p.current_balance || 0) < 1000);
    
    return (
      <div>
        <h2 style={{ color: '#1E3A8A' }}>🔔 Notifications & Alerts Center</h2>
        <div style={styles.card}>
          <h3 style={{ color: '#EF4444' }}>⚠️ Pending Invoices ({pendingInv.length})</h3>
          {pendingInv.slice(0, 5).map(inv => <p key={inv.id} style={{ fontSize: '14px' }}>Invoice {inv.invoice_no} for {inv.customers?.name} has a due amount of {inv.due_amount.toFixed(2)} SAR.</p>)}
        </div>
        <div style={styles.card}>
          <h3 style={{ color: '#D97706' }}>⏳ Expense Approvals ({pendingExp.length})</h3>
          {pendingExp.length === 0 ? <p>No expenses pending.</p> : pendingExp.slice(0, 5).map(exp => <p key={exp.id} style={{ fontSize: '14px' }}>Expense from {exp.vendor_name} of {exp.amount.toFixed(2)} SAR needs approval.</p>)}
        </div>
        <div style={styles.card}>
          <h3 style={{ color: '#dc2626' }}>📉 Low Portal Balances ({lowPortals.length})</h3>
          {lowPortals.length === 0 ? <p>All portals are healthy.</p> : lowPortals.map(p => <p key={p.id} style={{ fontSize: '14px' }}>{p.name} balance is low: {p.current_balance.toFixed(2)} SAR.</p>)}
        </div>
      </div>
    );
  }

  return null;
}
