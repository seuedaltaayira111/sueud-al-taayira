'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }, 
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block', marginTop: '10px' } 
};

export default function ERPViewsAdvanced(props) {
  const { page, data, tr, today, userProfile, showToast, setData } = props;
  const [editTargetId, setEditTargetId] = useState(null);
  const [targetVal, setTargetVal] = useState(0);
  const [attForm, setAttForm] = useState({ empId: '', checkIn: '09:00', checkOut: '18:00', status: 'Present', leaveStart: today, leaveEnd: today });
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (page === 'hr_advanced' && userProfile?.tenant_id) {
      supabase.from('attendance').select('*, employees(name)').eq('tenant_id', userProfile.tenant_id).order('date', { ascending: false }).then(({ data: att }) => {
        setAttendance(att || []);
      });
    }
  }, [page, userProfile]);

  const saveTarget = async (empId) => {
    try {
      const { data: upEmp, error } = await supabase.from('employees').update({ target: parseFloat(targetVal) || 0 }).eq('id', empId).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, employees: prev.employees.map(e => e.id === empId ? upEmp : e) }));
      showToast('Target Updated!');
      setEditTargetId(null);
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const calcAttendance = (checkIn, checkOut) => {
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    let totalMins = (outH * 60 + outM) - (inH * 60 + inM);
    if (totalMins < 0) totalMins += 24 * 60; // Overnight shift
    const workedHrs = totalMins / 60;
    
    let ot = 0, deduction = 0;
    if (workedHrs > 9) ot = workedHrs - 9; // Overtime after 9 hours
    if (workedHrs < 8 && workedHrs >= 0) deduction = 8 - workedHrs; // Deduction if less than 8 hours
    
    return { ot: ot.toFixed(1), deduction: deduction.toFixed(1) };
  };

  const markAttendance = async (e) => {
    e.preventDefault();
    if (!attForm.empId) return showToast('Please select an employee');
    try {
      let payload = {
        employee_id: attForm.empId, 
        date: today, 
        status: attForm.status,
        tenant_id: userProfile.tenant_id
      };

      if (attForm.status === 'Present') {
        const { ot, deduction } = calcAttendance(attForm.checkIn, attForm.checkOut);
        payload.check_in = attForm.checkIn;
        payload.check_out = attForm.checkOut;
        payload.overtime = ot;
        payload.deduction = deduction;
      } else if (attForm.status === 'Leave') {
        payload.leave_start = attForm.leaveStart;
        payload.leave_end = attForm.leaveEnd;
        payload.check_in = null;
        payload.check_out = null;
      }

      const { data: newAtt, error } = await supabase.from('attendance').insert([payload]).select('*, employees(name)').single();
      if (error) throw error;
      
      setAttendance(prev => [newAtt, ...prev]);
      
      let msg = `Attendance Marked!`;
      if (payload.overtime > 0) msg += ` OT: ${payload.overtime} hrs.`;
      if (payload.deduction > 0) msg += ` Salary Deducted: ${payload.deduction} hrs.`;
      showToast(msg);
      
      setAttForm({ empId: '', checkIn: '09:00', checkOut: '18:00', status: 'Present', leaveStart: today, leaveEnd: today });
    } catch (err) { 
      showToast('Error: ' + err.message); 
    }
  };

  // 1. AI DASHBOARD LAYER
  if (page === 'ai_dashboard') {
    const activeInvoices = data.invoices.filter(i => !i.invoice_no.startsWith('REF-') && i.status !== 'Draft');
    const tSales = activeInvoices.reduce((s, i) => s + (i.total || 0), 0);
    const tProfit = activeInvoices.reduce((s, i) => s + (i.profit || 0), 0);
    const pendingPayments = activeInvoices.filter(i => i.due_amount > 0);
    const totalDue = pendingPayments.reduce((s, i) => s + i.due_amount, 0);
    
    const empProfits = {};
    activeInvoices.forEach(inv => {
      const empName = inv.employees?.name || 'Unknown';
      if (!empProfits[empName]) empProfits[empName] = 0;
      empProfits[empName] += inv.profit || 0;
    });
    const topEmployee = Object.keys(empProfits).map(k => ({ name: k, profit: empProfits[k] })).sort((a,b) => b.profit - a.profit)[0];

    const aiInsights = [];
    if (totalDue > 0) aiInsights.push(`⚠️ You have ${totalDue.toFixed(2)} SAR pending from ${pendingPayments.length} customers. Follow up needed.`);
    if (topEmployee) aiInsights.push(`🏆 ${topEmployee.name} is your top performer with ${topEmployee.profit.toFixed(2)} SAR in profit.`);
    if (tProfit < 1000) aiInsights.push("📉 Profits are low this month. Consider pushing tour packages or visa services.");

    return (
      <div>
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '28px' }}>🤖 AI ERP Assistant</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '16px' }}>Real-time business insights based on your data.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{...styles.card, borderLeft: '5px solid #059669'}}><h3 style={{color: '#555'}}>Monthly Sales</h3><h2 style={{color: '#1E3A8A'}}>{tSales.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #1E3A8A'}}><h3 style={{color: '#555'}}>Net Profit</h3><h2 style={{color: '#059669'}}>{tProfit.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #EF4444'}}><h3 style={{color: '#555'}}>Pending Dues</h3><h2 style={{color: '#EF4444'}}>{totalDue.toFixed(2)} SAR</h2></div>
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
    const quotations = data.invoices.filter(i => i.status === 'Draft');
    const [quoteForm, setQuoteForm] = useState({ customer_name: '', service_type: 'Flight Ticket', price: '', valid_until: today });

    const handleCreateQuote = async (e) => {
      e.preventDefault();
      try {
        const quoteNo = `QUO-${Date.now()}`;
        const payload = { invoice_no: quoteNo, sector: quoteForm.service_type, total_sell: parseFloat(quoteForm.price) || 0, total: parseFloat(quoteForm.price) || 0, invoice_date: today, status: 'Draft', tenant_id: userProfile.tenant_id };
        const { data: newQuote, error } = await supabase.from('invoices').insert([payload]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, invoices: [newQuote, ...prev.invoices] }));
        showToast('Quotation Created!');
        setQuoteForm({ customer_name: '', service_type: 'Flight Ticket', price: '', valid_until: today });
      } catch (err) { showToast('Error: ' + err.message); }
    };

    const convertToInvoice = async (quote) => {
      try {
        const { error } = await supabase.from('invoices').update({ status: 'Confirmed' }).eq('id', quote.id);
        if (error) throw error;
        setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === quote.id ? { ...i, status: 'Confirmed' } : i) }));
        showToast('Converted to Invoice!');
      } catch (err) { showToast('Error: ' + err.message); }
    };

    return (
      <div>
        <h2 style={{ color: '#1E3A8A' }}>📄 Quotation Management</h2>
        <div style={styles.card}>
          <h3>Create New Quotation</h3>
          <form onSubmit={handleCreateQuote} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div><label style={styles.label}>Customer Name</label><input style={styles.input} value={quoteForm.customer_name} onChange={e => setQuoteForm({...quoteForm, customer_name: e.target.value})} required /></div>
            <div><label style={styles.label}>Service Type</label><select style={styles.input} value={quoteForm.service_type} onChange={e => setQuoteForm({...quoteForm, service_type: e.target.value})}><option>Flight Ticket</option><option>Tour Package</option><option>Visa</option></select></div>
            <div><label style={styles.label}>Estimated Price (SAR)</label><input type="number" style={styles.input} value={quoteForm.price} onChange={e => setQuoteForm({...quoteForm, price: e.target.value})} required /></div>
            <div><label style={styles.label}>Valid Until</label><input type="date" style={styles.input} value={quoteForm.valid_until} onChange={e => setQuoteForm({...quoteForm, valid_until: e.target.value})} required /></div>
            <button type="submit" style={{ ...styles.btnPrimary, gridColumn: '1 / -1' }}>Generate Quotation</button>
          </form>
        </div>
        <div style={styles.card}>
          <h3>Recent Quotations (Drafts)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{padding:'10px', textAlign:'left'}}>Quote No</th><th style={{padding:'10px'}}>Service</th><th style={{padding:'10px'}}>Amount</th><th style={{padding:'10px'}}>Action</th></tr></thead>
            <tbody>
              {quotations.length === 0 ? <tr><td colSpan="4" style={{padding:'15px', textAlign:'center'}}>No quotations found.</td></tr> : quotations.map(q => (
                <tr key={q.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{padding:'10px'}}>{q.invoice_no}</td>
                  <td style={{padding:'10px', textAlign:'center'}}>{q.sector}</td>
                  <td style={{padding:'10px', textAlign:'center'}}>{(q.total || 0).toFixed(2)} SAR</td>
                  <td style={{padding:'10px', textAlign:'center'}}><button onClick={() => convertToInvoice(q)} style={styles.btnSuccess}>Convert to Invoice</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. ADVANCED HR & ATTENDANCE (TIME-BASED WITH LEAVES)
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
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.employees.map(emp => {
                const empInv = data.invoices.filter(i => i.employee_id === emp.id && !i.invoice_no.startsWith('REF-') && i.status !== 'Draft');
                const achieved = empInv.reduce((s, i) => s + (i.total || 0), 0);
                const target = emp.target || 0;
                const perc = target > 0 ? (achieved / target) * 100 : 0;
                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{emp.name}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {editTargetId === emp.id ? (
                        <input type="number" value={targetVal} onChange={e => setTargetVal(e.target.value)} style={{...styles.input, width: '100px', margin: 0}} />
                      ) : (
                        <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setEditTargetId(emp.id); setTargetVal(target); }}>{target.toFixed(2)}</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#059669' }}>{achieved.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', width: '100%', height: '20px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: `${Math.min(perc, 100)}%`, background: perc >= 100 ? '#059669' : '#FBBF24', height: '100%' }}></div>
                      </div>
                      <small style={{ fontWeight: 'bold' }}>{perc.toFixed(0)}%</small>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {editTargetId === emp.id ? <button onClick={() => saveTarget(emp.id)} style={styles.btnSuccess}>Save</button> : <button onClick={() => { setEditTargetId(emp.id); setTargetVal(target); }} style={styles.btnWarning}>Edit</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div style={styles.card}>
          <h3>📅 Daily Time-Based Attendance & Leave</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>Mark Check-in and Check-out time. System will automatically calculate Overtime (>9 hrs) and Salary Deduction (<8 hrs).</p>
          <form onSubmit={markAttendance} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: '15px', alignItems: 'flex-end' }}>
            <div>
              <label style={styles.label}>Employee</label>
              <select style={styles.input} value={attForm.empId} onChange={e => setAttForm({...attForm, empId: e.target.value})} required>
                <option value="">Select Employee</option>
                {data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Status</label>
              <select style={styles.input} value={attForm.status} onChange={e => setAttForm({...attForm, status: e.target.value})}>
                <option>Present</option><option>Leave</option><option>Absent</option>
              </select>
            </div>
            {attForm.status === 'Present' ? (
              <>
                <div>
                  <label style={styles.label}>Check-In</label>
                  <input type="time" style={styles.input} value={attForm.checkIn} onChange={e => setAttForm({...attForm, checkIn: e.target.value})} required />
                </div>
                <div>
                  <label style={styles.label}>Check-Out</label>
                  <input type="time" style={styles.input} value={attForm.checkOut} onChange={e => setAttForm({...attForm, checkOut: e.target.value})} required />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={styles.label}>Leave Start</label>
                  <input type="date" style={styles.input} value={attForm.leaveStart} onChange={e => setAttForm({...attForm, leaveStart: e.target.value})} required />
                </div>
                <div>
                  <label style={styles.label}>Leave End</label>
                  <input type="date" style={styles.input} value={attForm.leaveEnd} onChange={e => setAttForm({...attForm, leaveEnd: e.target.value})} required />
                </div>
              </>
            )}
            <button type="submit" style={{...styles.btnPrimary, height: '42px'}}>Mark</button>
          </form>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead><tr style={{ background: '#f1f5f9' }}>
              <th style={{padding:'10px', textAlign:'left'}}>Date</th>
              <th style={{padding:'10px'}}>Employee</th>
              <th style={{padding:'10px'}}>Check-In</th>
              <th style={{padding:'10px'}}>Check-Out</th>
              <th style={{padding:'10px'}}>Overtime</th>
              <th style={{padding:'10px'}}>Deduction</th>
              <th style={{padding:'10px'}}>Status</th>
            </tr></thead>
            <tbody>
              {attendance.length === 0 ? <tr><td colSpan="7" style={{padding:'10px', textAlign:'center'}}>No attendance marked yet.</td></tr> : attendance.slice(0, 15).map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{padding:'10px'}}>{a.date}</td>
                  <td style={{padding:'10px', textAlign:'center'}}>{a.employees?.name || 'N/A'}</td>
                  <td style={{padding:'10px', textAlign:'center'}}>{a.check_in || '-'}</td>
                  <td style={{padding:'10px', textAlign:'center'}}>{a.check_out || '-'}</td>
                  <td style={{padding:'10px', textAlign:'center', color: '#059669', fontWeight: 'bold'}}>{a.overtime ? `${a.overtime} hrs` : '0'}</td>
                  <td style={{padding:'10px', textAlign:'center', color: '#EF4444', fontWeight: 'bold'}}>{a.deduction ? `${a.deduction} hrs` : '0'}</td>
                  <td style={{padding:'10px', textAlign:'center', color: a.status === 'Present' ? '#059669' : '#D97706'}}>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
