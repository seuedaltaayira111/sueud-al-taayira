'use client';

import React, { useState } from 'react';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }, 
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block', marginTop: '10px' } 
};

export default function ERPViewsAdvanced(props) {
  const { page, data, tr, today } = props;

  // 1. AI DASHBOARD LAYER
  if (page === 'ai_dashboard') {
    const activeInvoices = data.invoices.filter(i => !i.invoice_no.startsWith('REF-'));
    const tSales = activeInvoices.reduce((s, i) => s + (i.total || 0), 0);
    const tProfit = activeInvoices.reduce((s, i) => s + (i.profit || 0), 0);
    const pendingPayments = activeInvoices.filter(i => i.due_amount > 0);
    const totalDue = pendingPayments.reduce((s, i) => s + i.due_amount, 0);
    
    // Top Employee
    const empProfits = {};
    activeInvoices.forEach(inv => {
      const empName = inv.employees?.name || 'Unknown';
      if (!empProfits[empName]) empProfits[empName] = 0;
      empProfits[empName] += inv.profit || 0;
    });
    const topEmployee = Object.keys(empProfits).map(k => ({ name: k, profit: empProfits[k] })).sort((a,b) => b.profit - a.profit)[0];

    // AI Insights (Basic Logic)
    const aiInsights = [];
    if (totalDue > 0) aiInsights.push(`⚠️ You have ${totalDue.toFixed(2)} SAR pending from ${pendingPayments.length} customers. Follow up needed.`);
    if (topEmployee) aiInsights.push(`🏆 ${topEmployee.name} is your top performer with ${topEmployee.profit.toFixed(2)} SAR in profit.`);
    if (tProfit < 1000) aiInsights.push("📉 Profits are low this month. Consider pushing tour packages or visa services.");
    if (data.expenses.length > 5) aiInsights.push("💰 Office expenses are high. Review your vendor balances.");

    return (
      <div>
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '28px' }}>🤖 AI ERP Assistant</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '16px' }}>Real-time business insights based on your data.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{...styles.card, borderLeft: '5px solid #059669'}}>
            <h3 style={{color: '#555'}}>Monthly Sales</h3>
            <h2 style={{color: '#1E3A8A'}}>{tSales.toFixed(2)} SAR</h2>
          </div>
          <div style={{...styles.card, borderLeft: '5px solid #1E3A8A'}}>
            <h3 style={{color: '#555'}}>Net Profit</h3>
            <h2 style={{color: '#059669'}}>{tProfit.toFixed(2)} SAR</h2>
          </div>
          <div style={{...styles.card, borderLeft: '5px solid #EF4444'}}>
            <h3 style={{color: '#555'}}>Pending Dues</h3>
            <h2 style={{color: '#EF4444'}}>{totalDue.toFixed(2)} SAR</h2>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ color: '#1E3A8A', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>🧠 AI Insights & Action Items</h3>
          <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
            {aiInsights.length === 0 ? <li>No critical alerts. Business is running smoothly!</li> : aiInsights.map((ins, i) => <li key={i} style={{ marginBottom: '10px', fontSize: '15px', color: '#334155' }}>{ins}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  // 2. QUOTATIONS PANEL
  if (page === 'quotations') {
    return (
      <div>
        <h2 style={{ color: '#1E3A8A' }}>📄 Quotation Management</h2>
        <div style={styles.card}>
          <h3>Create New Quotation</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Quotation logic will be linked to invoice form with status "Draft"'); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div><label style={styles.label}>Customer Name</label><input style={styles.input} required /></div>
            <div><label style={styles.label}>Service Type</label><select style={styles.input}><option>Flight Ticket</option><option>Tour Package</option><option>Visa</option></select></div>
            <div><label style={styles.label}>Estimated Price (SAR)</label><input type="number" style={styles.input} required /></div>
            <div><label style={styles.label}>Valid Until</label><input type="date" style={styles.input} defaultValue={today} required /></div>
            <button type="submit" style={{ ...styles.btnPrimary, gridColumn: '1 / -1' }}>Generate Quotation</button>
          </form>
        </div>
        <div style={styles.card}>
          <h3>Recent Quotations</h3>
          <p style={{ color: '#64748b' }}>Quotations created will appear here. You can convert them to Invoices with one click.</p>
        </div>
      </div>
    );
  }

  // 3. ADVANCED HR & TARGETS
  if (page === 'hr_advanced') {
    return (
      <div>
        <h2 style={{ color: '#1E3A8A' }}>🎯 Employee Targets & Performance</h2>
        <div style={styles.card}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#1E3A8A', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Employee</th>
                <th style={{ padding: '12px' }}>Target (SAR)</th>
                <th style={{ padding: '12px' }}>Achieved (SAR)</th>
                <th style={{ padding: '12px' }}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {data.employees.map(emp => {
                const empInv = data.invoices.filter(i => i.employee_id === emp.id && !i.invoice_no.startsWith('REF-'));
                const achieved = empInv.reduce((s, i) => s + (i.total || 0), 0);
                const target = 10000; // Static for now, can be made dynamic
                const perc = target > 0 ? (achieved / target) * 100 : 0;
                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{emp.name}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{target.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#059669' }}>{achieved.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', width: '100%', height: '20px' }}>
                        <div style={{ width: `${Math.min(perc, 100)}%`, background: perc >= 100 ? '#059669' : '#FBBF24', height: '100%' }}></div>
                      </div>
                      <small style={{ fontWeight: 'bold' }}>{perc.toFixed(0)}%</small>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div style={styles.card}>
          <h3>📅 Attendance & Leaves</h3>
          <p style={{ color: '#64748b' }}>Track employee attendance, leaves, and overtime hours here.</p>
          <button style={{ ...styles.btnSuccess, marginTop: '10px' }}>+ Mark Attendance</button>
        </div>
      </div>
    );
  }

  return null;
}
