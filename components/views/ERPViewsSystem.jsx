import React, { useState } from 'react';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }, 
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' },1 label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block', marginTop: '10px' } 
};

export default function ERPViewsSystem(props) {
  const { page, data, tr, handleAddUser, handleEditUser, handleUpdateUser, userForm, setUserForm, editUserId, handleSaveSettings, handleLogoUpload, setForm, setSetForm, repDate, setRepDate, reportTab, setReportTab, statementTab, setStatementTab, handleDelete, filterData, exportToExcel, ledgerCustId, setLedgerCustId } = props;
  
  const [statementType, setStatementType] = useState('customer'); // 'customer', 'creditor', 'outstanding'

  if (page === 'users') return (
    <div>
      <h2>{tr.users}</h2>
      <div style={styles.card}>
        <form onSubmit={editUserId ? handleUpdateUser : handleAddUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div><label style={styles.label}>Email</label><input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Username</label><input value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Role</label><select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} style={styles.input}><option>Sales</option><option>Accountant</option><option>Manager</option><option>Admin</option></select></div>
          <div><label style={styles.label}>Is Admin?</label><select value={userForm.is_admin} onChange={e => setUserForm({...userForm, is_admin: e.target.value === 'true'})} style={styles.input}><option value="true">Yes</option><option value="false">No</option></select></div>
          <div><label style={styles.label}>Access Invoices</label><select value={userForm.can_access_invoices} onChange={e => setUserForm({...userForm, can_access_invoices: e.target.value === 'true'})} style={styles.input}><option value="true">Yes</option><option value="false">No</option></select></div>
          <div><label style={styles.label}>Access Bank</label><select value={userForm.can_access_bank} onChange={e => setUserForm({...userForm, can_access_bank: e.target.value === 'true'})} style={styles.input}><option value="true">Yes</option><option value="false">No</option></select></div>
          <div><label style={styles.label}>Access HR</label><select value={userForm.can_access_hr} onChange={e => setUserForm({...userForm, can_access_hr: e.target.value === 'true'})} style={styles.input}><option value="true">Yes</option><option value="false">No</option></select></div>
          <div><label style={styles.label}>Access Reports</label><select value={userForm.can_access_reports} onChange={e => setUserForm({...userForm, can_access_reports: e.target.value === 'true'})} style={styles.input}><option value="true">Yes</option><option value="false">No</option></select></div>
          <div><label style={styles.label}>Access Settings</label><select value={userForm.can_access_settings} onChange={e => setUserForm({...userForm, can_access_settings: e.target.value === 'true'})} style={styles.input}><option value="true">Yes</option><option value="false">No</option></select></div>
          <button type="submit" style={{ ...styles.btnPrimary, gridColumn: '1 / -1' }}>{editUserId ? 'Update User' : 'Add User'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#1E3A8A', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px' }}>Role</th>
            <th style={{ padding: '12px' }}>Admin</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.appUsers.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '12px' }}>{u.email}</td>
              <td style={{ padding: '12px' }}>{u.role}</td>
              <td style={{ padding: '12px' }}>{u.is_admin ? '✅' : '❌'}</td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => handleEditUser(u)} style={styles.btnWarning}>Edit</button>
                <button onClick={() => handleDelete('app_users', u.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (page === 'settings') return (
    <div>
      <h2>{tr.settings}</h2>
      <div style={styles.card}>
        <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div><label style={styles.label}>Company Name (EN)</label><input value={setForm.company_name_en} onChange={e => setSetForm({...setForm, company_name_en: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Company Name (AR)</label><input value={setForm.company_name_ar} onChange={e => setSetForm({...setForm, company_name_ar: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>VAT No</label><input value={setForm.vat_no} onChange={e => setSetForm({...setForm, vat_no: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>CR No</label><input value={setForm.cr_no} onChange={e => setSetForm({...setForm, cr_no: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Phone</label><input value={setForm.phone} onChange={e => setSetForm({...setForm, phone: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Address (AR)</label><input value={setForm.address_ar} onChange={e => setSetForm({...setForm, address_ar: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Invoice Footer</label><input value={setForm.invoice_footer} onChange={e => setSetForm({...setForm, invoice_footer: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Logo Upload</label><input type="file" accept="image/*" onChange={handleLogoUpload} style={styles.input} /></div>
          {setForm.logo_url && <div style={{ gridColumn: '1 / -1' }}><img src={setForm.logo_url} alt="Logo" style={{ height: '80px' }} /></div>}
          <button type="submit" style={{ ...styles.btnPrimary, gridColumn: '1 / -1' }}>Save Settings</button>
        </form>
      </div>
    </div>
  );

  if (page === 'reports') {
    const filteredInvoices = filterData(data.invoices.filter(i => !i.invoice_no.startsWith('REF-')), 'invoice_date');
    const filteredExpenses = filterData(data.expenses, 'expense_date');
    const salesTotal = filteredInvoices.reduce((s, i) => s + (i.total || 0), 0);
    const expTotal = filteredExpenses.reduce((s, e) => s + (e.amount || 0), 0);

    return (
      <div>
        <h2>{tr.reports}</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input type="date" value={repDate.from} onChange={e => setRepDate({...repDate, from: e.target.value})} style={styles.input} />
          <input type="date" value={repDate.to} onChange={@repDate, to: e.target.value})} style={styles.input} />
          <button onClick={() => setReportTab('sales')} style={{...styles.btnPrimary, width: 'auto', background: reportTab === 'sales' ? '#1E3A8A' : '#ccc'}}>Sales</button>
          <button onClick={() => setReportTab('expenses')} style={{...styles.btnPrimary, width: 'auto', background: reportTab === 'expenses' ? '#1E3A8A' : '#ccc'}}>Expenses</button>
          <button onClick={() => setReportTab('portals')} style={{...styles.btnPrimary, width: 'auto', background: reportTab === 'portals' ? '#1E3A8A' : '#ccc'}}>Portals</button>
          <button onClick={() => setReportTab('outstanding')} style={{...styles.btnPrimary, width: 'auto', background: reportTab === 'outstanding' ? '#1E3A8A' : '#ccc'}}>Outstanding</button>
        </div>
        
        {reportTab === 'sales' && (
          <div>
            <h3>Total Sales: {salesTotal.toFixed(2)} SAR</h3>
            <button onClick={() => exportToExcel(filteredInvoices.map(i => ({ Inv: i.invoice_no, Customer: i.customers?.name, Total: i.total })), 'SalesReport')} style={styles.btnSuccess}>Export</button>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
              <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Inv</th><th style={{ padding: '12px' }}>Customer</th><th style={{ padding: '12px' }}>Total</th></tr></thead>
              <tbody>{filteredInvoices.map(i => (<tr key={i.id}><td style={{ padding: '12px' }}>{i.invoice_no}</td><td style={{ padding: '12px' }}>{i.customers?.name}</td><td style={{ padding: '12px' }}>{(i.total || 0).toFixed(2)}</td></tr>))}</tbody>
            </table>
          </div>
        )}
        
        {reportTab === 'expenses' && (
          <div>
            <h3>Total Expenses: {expTotal.toFixed(2)} SAR</h3>
            <button onClick={() => exportToExcel(filteredExpenses.map(e => ({ Vendor: e.vendor_name, Total: e.amount })), 'ExpenseReport')} style={styles.btnSuccess}>Export</button>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
              <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Vendor</th><th style={{ padding: '12px' }}>Total</th></tr></thead>
              <tbody>{filteredExpenses.map(e => (<tr key={e.id}><td style={{ padding: '12px' }}>{e.vendor_name}</td><td style={{ padding: '12px' }}>{(e.amount || 0).toFixed(2)}</td></tr>))}</tbody>
            </table>
          </div>
        )}

        {reportTab === 'portals' && (
          <div>
            <h3>Portal Balances Report</h3>
            <button onClick={() => exportToExcel(data.portals.map(p => ({ Name: p.name, Balance: p.current_balance })), 'PortalReport')} style={styles.btnSuccess}>Export</button>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
              <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Portal</th><th style={{ padding: '12px' }}>Balance (SAR)</th></tr></thead>
              <tbody>{data.portals.map(p => (<tr key={p.id}><td style={{ padding: '12px' }}>{p.name}</td><td style={{ padding: '12px', fontWeight: 'bold', color: (p.current_balance || 0) < 0 ? '#EF4444' : '#059669' }}>{(p.current_balance || 0).toFixed(2)}</td></tr>))}</tbody>
            </table>
          </div>
        )}

        {reportTab === 'outstanding' && (
          <div>
            <h3>Outstanding Dues Report</h3>
            {(() => { const outInvs = data.invoices.filter(i => (i.due_amount || 0) > 0); const totalDue = outInvs.reduce((s, i) => s + i.due_amount, 0); return ( <><p>Total Outstanding: <b>{totalDue.toFixed(2)} SAR</b></p><button onClick={() => exportToExcel(outInvs.map(i => ({ Inv: i.invoice_no, Customer: i.customers?.name, Due: i.due_amount })), 'OutstandingReport')} style={styles.btnSuccess}>Export</button><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Inv</th><th style={{ padding: '12px' }}>Customer</th><th style={{ padding: '12px' }}>Due</th></tr></thead><tbody>{outInvs.map(i => (<tr key={i.id}><td style={{ padding: '12px' }}>{i.invoice_no}</td><td style={{ padding: '12px' }}>{i.customers?.name || 'N/A'}</td><td style={{ padding: '12px', color: '#EF4444', fontWeight: 'bold' }}>{(i.due_amount || 0).toFixed(2)}</td></tr>))}</tbody></table></>); })()}
          </div>
        )}
      </div>
    );
  }

  if (page === 'audit') return (
    <div>
      <h2>{tr.audit}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px', textAlign: 'left' }}>User</th><th style={{ padding: '12px', textAlign: 'left' }}>Action</th></tr></thead>
        <tbody>{data.audits.map(a => (<tr key={a.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{a.created_at?.split('T')[0]}</td><td style={{ padding: '12px' }}>{a.user_email}</td><td style={{ padding: '12px' }}>{a.action}</td></tr>))}</tbody>
      </table>
    </div>
  );

  if (page === 'statements') {
    return (
      <div>
        <h2>{tr.statements}</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setStatementType('customer')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'customer' ? '#1E3A8A' : '#ccc'}}>Customer Ledger</button>
          <button onClick={() => setStatementType('creditor')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'creditor' ? '#1E3A8A' : '#ccc'}}>Creditor Ledger</button>
          <button onClick={() => setStatementType('outstanding')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'outstanding' ? '#1E3A8A' : '#ccc'}}>Outstanding Invoices</button>
        </div>

        {statementType === 'customer' && (
          <div>
            <select value={ledgerCustId} onChange={e => setLedgerCustId(e.target.value)} style={styles.input}>
              <option value="">Select Customer</option>
              {data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
              <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px' }}>Inv No</th><th style={{ padding: '12px' }}>Total</th><th style={{ padding: '12px' }}>Paid</th><th style={{ padding: '12px' }}>Due</th></tr></thead>
              <tbody>{data.invoices.filter(i => i.customer_id === ledgerCustId).map(i => (<tr key={i.id}><td style={{ padding: '12px' }}>{i.invoice_date}</td><td style={{ padding: '12px' }}>{i.invoice_no}</td><td style={{ padding: '12px' }}>{(i.total || 0).toFixed(2)}</td><td style={{ padding: '12px' }}>{(i.paid_amount || 0).toFixed(2)}</td><td style={{ padding: '12px', color: (i.due_amount || 0) > 0 ? '#EF4444' : '#059669', fontWeight: 'bold' }}>{(i.due_amount || 0).toFixed(2)}</td></tr>))}</tbody>
            </table>
          </div>
        )}

        {statementType === 'creditor' && (
          <div>
            <select value={ledgerCustId} onChange={e => setLedgerCustId(e.target.value)} style={styles.input}>
              <option value="">Select Creditor</option>
              {data.creditors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
              <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px' }}>Inv No</th><th style={{ padding: '12px' }}>Total</th><th style={{ padding: '12px' }}>Due</th></tr></thead>
              <tbody>{data.invoices.filter(i => i.creditor_id === ledgerCustId && i.payment_method === 'Credit').map(i => (<tr key={i.id}><td style={{ padding: '12px' }}>{i.invoice_date}</td><td style={{ padding: '12px' }}>{i.invoice_no}</td><td style={{ padding: '12px' }}>{(i.total || 0).toFixed(2)}</td><td style={{ padding: '12px', color: '#EF4444', fontWeight: 'bold' }}>{(i.due_amount || 0).toFixed(2)}</td></tr>))}</tbody>
            </table>
          </div>
        )}

        {statementType === 'outstanding' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px' }}>Inv No</th><th style={{ padding: '12px' }}>Customer</th><th style={{ padding: '12px' }}>Due</th></tr></thead>
            <tbody>{data.invoices.filter(i => (i.due_amount || 0) > 0).map(i => (<tr key={i.id}><td style={{ padding: '12px' }}>{i.invoice_date}</td><td style={{ padding: '12px' }}>{i.invoice_no}</td><td style={{ padding: '12px' }}>{i.customers?.name || 'N/A'}</td><td style={{ padding: '12px', color: '#EF4444', fontWeight: 'bold' }}>{(i.due_amount || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        )}
      </div>
    );
  }

  return null;
}
