'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const styles = { 
  input: { width: '100%', padding: '12px 15px', margin: '6px 0', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }, 
  btnPrimary: { padding: '12px 15px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  card: { background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', marginTop: '12px' },
  tableHeader: { background: '#0F172A', color: 'white', padding: '15px', textAlign: 'start', fontSize: '13px' },
  tableCell: { padding: '15px', borderBottom: '1px solid #F1F5F9', fontSize: '14px' }
};

export default function ERPViewsPro(props) {
  const { page, data, tr, today, userProfile, showToast, setData, handleAddMistake, exportToExcel } = props;
  const [stmtCustId, setStmtCustId] = useState('');
  const [recForm, setRecForm] = useState({ customer_id: '', amount: '', interval: 'Monthly' });

  // 1. REFUND STATEMENT & PROFIT PANEL
  if (page === 'refund_statement') {
    const refunds = data.invoices.filter(i => i.invoice_no.startsWith('REF-'));
    const totalCompRefund = refunds.reduce((s, r) => s + (r.refund_company || 0), 0);
    const totalCustRefund = refunds.reduce((s, r) => s + (r.refund_customer || 0), 0);
    const totalOfficeProfit = totalCompRefund - totalCustRefund;

    const portalRefunds = {};
    refunds.forEach(r => {
      const portalName = data.portals.find(p => p.id === r.portal_id)?.name || 'Unknown Portal';
      if (!portalRefunds[portalName]) portalRefunds[portalName] = { comp: 0, cust: 0 };
      portalRefunds[portalName].comp += (r.refund_company || 0);
      portalRefunds[portalName].cust += (r.refund_customer || 0);
    });

    return (
      <div>
        <div style={{ background: 'linear-gradient(135deg, #B91C1C, #EF4444)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>📊 Refund Statement & Earnings</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Track refunds from airlines and calculate office profit margins.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '5px solid #2563EB' }}>
            <h3 style={{ color: '#64748B', margin: '0 0 10px', fontSize: '14px' }}>Refund from Airlines</h3>
            <h2 style={{ color: '#0F172A', margin: 0 }}>{totalCompRefund.toFixed(2)} SAR</h2>
          </div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '5px solid #FBBF24' }}>
            <h3 style={{ color: '#64748B', margin: '0 0 10px', fontSize: '14px' }}>Refund to Customers</h3>
            <h2 style={{ color: '#EF4444', margin: 0 }}>{totalCustRefund.toFixed(2)} SAR</h2>
          </div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '5px solid #059669' }}>
            <h3 style={{ color: '#64748B', margin: '0 0 10px', fontSize: '14px' }}>Office Profit from Refunds</h3>
            <h2 style={{ color: '#059669', margin: 0 }}>{totalOfficeProfit.toFixed(2)} SAR</h2>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}><h3 style={{ margin: 0, color: '#0F172A' }}>Portal-wise Refund Breakdown</h3></div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead><tr>
                <th style={styles.tableHeader}>Portal</th><th style={styles.tableHeader}>Company Refund</th><th style={styles.tableHeader}>Customer Refund</th><th style={styles.tableHeader}>Office Earned</th>
              </tr></thead>
              <tbody>
                {Object.keys(portalRefunds).length === 0 ? <tr><td colSpan="4" style={{padding:'30px', textAlign:'center', color:'#94A3B8'}}>No refunds recorded yet.</td></tr> : 
                  Object.keys(portalRefunds).map(pName => {
                    const p = portalRefunds[pName];
                    const earned = p.comp - p.cust;
                    return (
                      <tr key={pName} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{...styles.tableCell, fontWeight: 'bold'}}>{pName}</td>
                        <td style={{...styles.tableCell, color: '#2563EB'}}>{p.comp.toFixed(2)}</td>
                        <td style={{...styles.tableCell, color: '#EF4444'}}>{p.cust.toFixed(2)}</td>
                        <td style={{...styles.tableCell, color: '#059669', fontWeight: 'bold'}}>{earned.toFixed(2)}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 2. CUSTOMER STATEMENT
  if (page === 'customer_statement') {
    const custInvs = data.invoices.filter(i => i.customer_id === stmtCustId && !i.invoice_no.startsWith('REF-'));
    let runningBalance = 0;
    const cust = data.customers.find(c => c.id === stmtCustId);

    const handleDownloadStmt = () => {
      if (!stmtCustId) return showToast('Please select a customer first');
      let bal = 0;
      const csvData = custInvs.map(inv => {
        bal += (inv.total || 0) - (inv.paid_amount || 0);
        return { Date: inv.invoice_date, InvoiceNo: inv.invoice_no, Debit: inv.total, Credit: inv.paid_amount, Balance: bal.toFixed(2) };
      });
      exportToExcel(csvData, `Statement_${cust?.name || stmtCustId}`);
    };

    return (
      <div>
        <h2 style={{ color: '#0F172A', marginBottom: '20px' }}>📊 Customer Statement</h2>
        <div style={styles.card}>
          <label style={styles.label}>Select Customer</label>
          <select style={styles.input} value={stmtCustId} onChange={e => setStmtCustId(e.target.value)}>
            <option value="">Select Customer to View Statement</option>
            {data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {stmtCustId && (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
              <h3 style={{ margin: 0, color: '#0F172A' }}>Transaction History - {cust?.name}</h3>
              <button onClick={handleDownloadStmt} style={styles.btnSuccess}>Download Statement</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Invoice No</th><th style={styles.tableHeader}>Debit (Inv)</th><th style={styles.tableHeader}>Credit (Paid)</th><th style={styles.tableHeader}>Balance</th></tr></thead>
                <tbody>
                  {custInvs.length === 0 ? <tr><td colSpan="5" style={{padding:'30px', textAlign:'center', color:'#94A3B8'}}>No transactions found.</td></tr> : 
                    custInvs.map(inv => {
                      runningBalance += (inv.total || 0) - (inv.paid_amount || 0);
                      return (
                        <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={styles.tableCell}>{inv.invoice_date}</td>
                          <td style={styles.tableCell}>{inv.invoice_no}</td>
                          <td style={{...styles.tableCell, color: '#EF4444'}}>{(inv.total || 0).toFixed(2)}</td>
                          <td style={{...styles.tableCell, color: '#059669'}}>{(inv.paid_amount || 0).toFixed(2)}</td>
                          <td style={{...styles.tableCell, fontWeight: 'bold'}}>{runningBalance.toFixed(2)} SAR</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. RECURRING INVOICES
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
        <h2 style={{ color: '#0F172A', marginBottom: '20px' }}>🔁 Recurring Invoices</h2>
        <div style={styles.card}>
          <h3 style={{marginTop: 0, color: '#0F172A'}}>Setup Recurring Profile</h3>
          <form onSubmit={handleCreateRecurring} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto', gap: '15px', alignItems: 'flex-end' }}>
            <div><label style={styles.label}>Customer</label><select style={styles.input} value={recForm.customer_id} onChange={e => setRecForm({...recForm, customer_id: e.target.value})} required><option value="">Select</option>{data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label style={styles.label}>Amount (SAR)</label><input type="number" style={styles.input} value={recForm.amount} onChange={e => setRecForm({...recForm, amount: e.target.value})} required /></div>
            <div><label style={styles.label}>Interval</label><select style={styles.input} value={recForm.interval} onChange={e => setRecForm({...recForm, interval: e.target.value})}><option>Monthly</option><option>Yearly</option><option>Weekly</option></select></div>
            <button type="submit" style={{...styles.btnPrimary, height: '42px'}}>Create</button>
          </form>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
              <thead><tr><th style={styles.tableHeader}>Profile ID</th><th style={styles.tableHeader}>Interval</th><th style={styles.tableHeader}>Amount</th></tr></thead>
              <tbody>
                {recurringInvs.length === 0 ? <tr><td colSpan="3" style={{padding:'30px', textAlign:'center', color:'#94A3B8'}}>No recurring profiles found.</td></tr> : recurringInvs.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={styles.tableCell}>{r.invoice_no}</td>
                    <td style={styles.tableCell}>{r.recurring_interval}</td>
                    <td style={styles.tableCell}>{(r.total || 0).toFixed(2)} SAR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 4. EXPENSE APPROVAL SYSTEM
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
        <h2 style={{ color: '#0F172A', marginBottom: '20px' }}>🛡️ Expense Approval System</h2>
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Expenses created by staff will appear here for Admin approval before affecting cash balance.</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Vendor</th><th style={styles.tableHeader}>Amount</th><th style={styles.tableHeader}>Status</th><th style={styles.tableHeader}>Actions</th></tr></thead>
              <tbody>
                {pendingExpenses.length === 0 ? <tr><td colSpan="5" style={{padding:'30px', textAlign:'center', color:'#94A3B8'}}>No pending expenses for approval.</td></tr> : pendingExpenses.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #F1F5F9', background: '#FFFBEB' }}>
                    <td style={styles.tableCell}>{exp.expense_date}</td>
                    <td style={styles.tableCell}>{exp.vendor_name}</td>
                    <td style={{...styles.tableCell, fontWeight: 'bold'}}>{(exp.amount || 0).toFixed(2)} SAR</td>
                    <td style={styles.tableCell}><span style={{ padding: '4px 10px', background: '#FBBF24', color: '#1E293B', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>{exp.approval_status}</span></td>
                    <td style={styles.tableCell}>
                      <button onClick={() => updateApproval(exp.id, 'Approved')} style={styles.btnSuccess}>Approve</button>
                      <button onClick={() => updateApproval(exp.id, 'Rejected')} style={{...styles.btnDanger, marginInlineStart: '5px'}}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 5. NOTIFICATIONS CENTER
  if (page === 'notifications') {
    const pendingInv = data.invoices.filter(i => i.due_amount > 0 && !i.invoice_no.startsWith('REF-'));
    const pendingExp = data.expenses.filter(e => e.approval_status === 'Pending');
    const lowPortals = data.portals.filter(p => (p.current_balance || 0) < 1000);
    
    return (
      <div>
        <h2 style={{ color: '#0F172A', marginBottom: '20px' }}>🔔 Notifications & Alerts Center</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderInlineStart: '4px solid #EF4444' }}>
            <h3 style={{ color: '#EF4444', marginTop: 0 }}>⚠️ Pending Invoices ({pendingInv.length})</h3>
            {pendingInv.length === 0 ? <p style={{color:'#94A3B8'}}>No pending invoices.</p> : pendingInv.slice(0, 5).map(inv => <p key={inv.id} style={{ fontSize: '14px', color: '#475569', margin: '10px 0' }}>Invoice {inv.invoice_no} for {inv.customers?.name} has a due amount of {inv.due_amount.toFixed(2)} SAR.</p>)}
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderInlineStart: '4px solid #FBBF24' }}>
            <h3 style={{ color: '#D97706', marginTop: 0 }}>⏳ Expense Approvals ({pendingExp.length})</h3>
            {pendingExp.length === 0 ? <p style={{color:'#94A3B8'}}>No expenses pending.</p> : pendingExp.slice(0, 5).map(exp => <p key={exp.id} style={{ fontSize: '14px', color: '#475569', margin: '10px 0' }}>Expense from {exp.vendor_name} of {exp.amount.toFixed(2)} SAR needs approval.</p>)}
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderInlineStart: '4px solid #dc2626' }}>
            <h3 style={{ color: '#dc2626', marginTop: 0 }}>📉 Low Portal Balances ({lowPortals.length})</h3>
            {lowPortals.length === 0 ? <p style={{color:'#94A3B8'}}>All portals are healthy.</p> : lowPortals.map(p => <p key={p.id} style={{ fontSize: '14px', color: '#475569', margin: '10px 0' }}>{p.name} balance is low: {p.current_balance.toFixed(2)} SAR.</p>)}
          </div>
        </div>
      </div>
    );
  }

  // 6. STAFF MISTAKES & LOSS PANEL
  if (page === 'staff_mistakes') {
    return (
      <div>
        <div style={{ background: 'linear-gradient(135deg, #B91C1C, #EF4444)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>⚠️ Staff Mistakes & Loss Tracking</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Log mistakes and auto-deduct from salary if required.</p>
        </div>
        <div style={styles.card}>
          <h3 style={{marginTop: 0, color: '#0F172A'}}>Log New Mistake / Loss</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>If a ticket is wasted due to an employee's mistake, log it here. The loss amount will be automatically deducted from their salary if marked as "Paid by Employee".</p>
          <form onSubmit={handleAddMistake} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr)) auto', gap: '15px', alignItems: 'flex-end' }}>
            <div><label style={styles.label}>Employee</label><select name="emp" style={styles.input} required><option value="">Select Employee</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
            <div><label style={styles.label}>Old Ticket No</label><input name="old_tkt" style={styles.input} placeholder="Old Ticket No" required /></div>
            <div><label style={styles.label}>New Ticket No</label><input name="new_tkt" style={styles.input} placeholder="New Ticket No" required /></div>
            <div><label style={styles.label}>Loss Amount (SAR)</label><input name="loss_amt" type="number" step="0.01" style={styles.input} placeholder="Loss Amount" required /></div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '10px' }}>
                <input type="checkbox" name="paid_by_emp" /> Deduct from Salary
              </label>
              <button type="submit" style={{...styles.btnPrimary, height: '42px'}}>Log Loss</button>
            </div>
          </form>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Employee</th><th style={styles.tableHeader}>Old Ticket</th><th style={styles.tableHeader}>New Ticket</th><th style={styles.tableHeader}>Loss Amount</th><th style={styles.tableHeader}>Salary Deducted</th></tr></thead>
              <tbody>
                {data.staffMistakes.length === 0 ? <tr><td colSpan="6" style={{padding:'30px', textAlign:'center', color:'#94A3B8'}}>No mistakes logged yet.</td></tr> : data.staffMistakes.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9', background: '#FFFBEB' }}>
                    <td style={styles.tableCell}>{m.date}</td>
                    <td style={styles.tableCell}>{m.employees?.name || 'N/A'}</td>
                    <td style={styles.tableCell}>{m.old_ticket_no}</td>
                    <td style={styles.tableCell}>{m.new_ticket_no}</td>
                    <td style={{...styles.tableCell, fontWeight: 'bold', color: '#EF4444'}}>{(m.loss_amount || 0).toFixed(2)} SAR</td>
                    <td style={styles.tableCell}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: m.paid_by_employee ? '#059669' : '#64748B', background: m.paid_by_employee ? '#D1FAE5' : '#F1F5F9' }}>
                        {m.paid_by_employee ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
