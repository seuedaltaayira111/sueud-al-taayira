import React, { useState } from 'react';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }, 
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }, 
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block', marginTop: '10px' } 
};

export default function ERPViewsSystem(props) {
  const { page, data, tr, handleAddUser, handleEditUser, handleUpdateUser, userForm, setUserForm, editUserId, handleSaveSettings, handleLogoUpload, setForm, setSetForm, repDate, setRepDate, reportTab, setReportTab, statementTab, setStatementTab, handleDelete, filterData, exportToExcel, ledgerCustId, setLedgerCustId, contractCorpName, setContractCorpName, contractType, setContractType, contractMarkup, setContractMarkup, contractTerms, setContractTerms, handleGenerateContract, handleGenerateOffer, handleAddCustomField, handleRemoveCustomField, handleCustomFieldChange } = props;
  
  const [statementType, setStatementType] = useState('sales');

  // 1. USERS PAGE
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
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Email</th><th style={{ padding: '12px' }}>Role</th><th style={{ padding: '12px' }}>Admin</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
        <tbody>{data.appUsers.map(u => (<tr key={u.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{u.email}</td><td style={{ padding: '12px' }}>{u.role}</td><td style={{ padding: '12px' }}>{u.is_admin ? '✅' : '❌'}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditUser(u)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('app_users', u.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>))}</tbody>
      </table>
    </div>
  );

  // 2. SETTINGS PAGE
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
          <div><label style={styles.label}>License No (ترخيص)</label><input value={setForm.license_no} onChange={e => setSetForm({...setForm, license_no: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Tourist License No (ترخيص سياحي)</label><input value={setForm.tourist_license_no} onChange={e => setSetForm({...setForm, tourist_license_no: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Invoice Footer</label><input value={setForm.invoice_footer} onChange={e => setSetForm({...setForm, invoice_footer: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Logo Upload</label><input type="file" accept="image/*" onChange={handleLogoUpload} style={styles.input} /></div>
          {setForm.logo_url && <div style={{ gridColumn: '1 / -1' }}><img src={setForm.logo_url} alt="Logo" style={{ height: '80px' }} /></div>}
          
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '10px' }}>
            <h3 style={{ margin: '0 0 10px', color: '#1E3A8A' }}>Custom Fields (Manual)</h3>
            {setForm.custom_fields && setForm.custom_fields.map((cf, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input placeholder="Label (e.g. IATA No)" value={cf.key} onChange={e => handleCustomFieldChange(i, 'key', e.target.value)} style={styles.input} />
                <input placeholder="Value" value={cf.value} onChange={e => handleCustomFieldChange(i, 'value', e.target.value)} style={styles.input} />
                <button type="button" onClick={() => handleRemoveCustomField(i)} style={{...styles.btnDanger, width: 'auto'}}>X</button>
              </div>
            ))}
            <button type="button" onClick={handleAddCustomField} style={{ ...styles.btnPrimary, width: 'auto', background: '#059669' }}>+ Add Custom Field</button>
          </div>

          <button type="submit" style={{ ...styles.btnPrimary, gridColumn: '1 / -1' }}>Save Settings</button>
        </form>
      </div>
    </div>
  );

  // 3. CONTRACT & OFFER PAGE
  if (page === 'contract' || page === 'offer') {
    const isContract = page === 'contract';
    return (
      <div>
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>{isContract ? 'Corporate Contract Generator' : 'Corporate Offer Generator'}</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>
            {isContract ? "Generate a formal dynamic agreement for corporate clients." : "Generate a special dynamic offer letter for corporate clients."}
          </p>
        </div>
        
        <div style={{...styles.card, borderTop: '4px solid #FBBF24'}}>
          <form onSubmit={isContract ? handleGenerateContract : handleGenerateOffer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Corporate Company Name</label>
              <input type="text" value={contractCorpName} onChange={e => setContractCorpName(e.target.value)} style={{...styles.input, padding: '15px', fontSize: '16px'}} required placeholder="e.g. Saudi Aramco" />
            </div>
            
            <div>
              <label style={styles.label}>Service Type / نوع الخدمة</label>
              <select value={contractType} onChange={e => setContractType(e.target.value)} style={{...styles.input, padding: '15px'}}>
                <option>Flight Tickets</option>
                <option>Hotel Booking</option>
                <option>Visa Services</option>
                <option>Hajj/Umrah Packages</option>
                <option>Complete Travel Management</option>
              </select>
            </div>
            
            <div>
              <label style={styles.label}>Service Fee / Markup (SAR)</label>
              <input type="number" value={contractMarkup} onChange={e => setContractMarkup(e.target.value)} style={{...styles.input, padding: '15px'}} required />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Custom Terms & Conditions (One per line)</label>
              <textarea rows="4" value={contractTerms} onChange={e => setContractTerms(e.target.value)} style={{...styles.input, padding: '15px', resize: 'vertical'}}></textarea>
            </div>
            
            <button type="submit" style={{ ...styles.btnPrimary, gridColumn: '1 / -1', padding: '15px', fontSize: '16px' }}>
              Generate {isContract ? 'Contract' : 'Offer'} PDF
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. REPORTS PAGE
  if (page === 'reports') {
    const filteredInvoices = filterData(data.invoices.filter(i => !i.invoice_no.startsWith('REF-')), 'invoice_date');
    const filteredExpenses = filterData(data.expenses, 'expense_date');
    const salesTotal = filteredInvoices.reduce((s, i) => s + (i.total || 0), 0);
    const expTotal = filteredExpenses.reduce((s, e) => s + (e.amount || 0), 0);

    return (
      <div>
        <h2>{tr.reports}</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input type="date" value={repDate.from} onChange={e => setRepDate({...repDate, from: e.target.value})} style={{...styles.input, maxWidth: '200px'}} />
          <input type="date" value={repDate.to} onChange={e => setRepDate({...repDate, to: e.target.value})} style={{...styles.input, maxWidth: '200px'}} />
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
            {(() => { 
              const outInvs = data.invoices.filter(i => (i.due_amount || 0) > 0); 
              const totalDue = outInvs.reduce((s, i) => s + i.due_amount, 0); 
              return ( 
                <>
                  <p>Total Outstanding: <b>{totalDue.toFixed(2)} SAR</b></p>
                  <button onClick={() => exportToExcel(outInvs.map(i => ({ Inv: i.invoice_no, Customer: i.customers?.name, Due: i.due_amount })), 'OutstandingReport')} style={styles.btnSuccess}>Export</button>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
                    <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Inv</th><th style={{ padding: '12px' }}>Customer</th><th style={{ padding: '12px' }}>Due</th></tr></thead>
                    <tbody>{outInvs.map(i => (<tr key={i.id}><td style={{ padding: '12px' }}>{i.invoice_no}</td><td style={{ padding: '12px' }}>{i.customers?.name || 'N/A'}</td><td style={{ padding: '12px', color: '#EF4444', fontWeight: 'bold' }}>{(i.due_amount || 0).toFixed(2)}</td></tr>))}</tbody>
                  </table>
                </>
              ); 
            })()}
          </div>
        )}
      </div>
    );
  }

  // 5. AUDIT LOGS PAGE
  if (page === 'audit') return (
    <div>
      <h2>{tr.audit}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px', textAlign: 'left' }}>User</th><th style={{ padding: '12px', textAlign: 'left' }}>Action</th></tr></thead>
        <tbody>{data.audits.map(a => (<tr key={a.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{a.created_at?.split('T')[0]}</td><td style={{ padding: '12px' }}>{a.user_email}</td><td style={{ padding: '12px' }}>{a.action}</td></tr>))}</tbody>
      </table>
    </div>
  );

  // 6. STATEMENTS PAGE (ALL TYPES WITH DATE FILTER)
  if (page === 'statements') {
    return (
      <div>
        <h2>{tr.statements}</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input type="date" value={repDate.from} onChange={e => setRepDate({...repDate, from: e.target.value})} style={{...styles.input, maxWidth: '200px'}} />
          <input type="date" value={repDate.to} onChange={e => setRepDate({...repDate, to: e.target.value})} style={{...styles.input, maxWidth: '200px'}} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setStatementType('sales')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'sales' ? '#1E3A8A' : '#ccc'}}>Sales</button>
          <button onClick={() => setStatementType('portals')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'portals' ? '#1E3A8A' : '#ccc'}}>Portals</button>
          <button onClick={() => setStatementType('vendors')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'vendors' ? '#1E3A8A' : '#ccc'}}>Vendors</button>
          <button onClick={() => setStatementType('salary')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'salary' ? '#1E3A8A' : '#ccc'}}>Salary</button>
          <button onClick={() => setStatementType('expenses')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'expenses' ? '#1E3A8A' : '#ccc'}}>Expenses</button>
          <button onClick={() => setStatementType('customers')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'customers' ? '#1E3A8A' : '#ccc'}}>Customers</button>
          <button onClick={() => setStatementType('creditors')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'creditors' ? '#1E3A8A' : '#ccc'}}>Creditors</button>
          <button onClick={() => setStatementType('credit')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'credit' ? '#1E3A8A' : '#ccc'}}>Credit Balances</button>
          <button onClick={() => setStatementType('branches')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'branches' ? '#1E3A8A' : '#ccc'}}>Branches</button>
          <button onClick={() => setStatementType('cash')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'cash' ? '#1E3A8A' : '#ccc'}}>Cash</button>
          <button onClick={() => setStatementType('bank')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'bank' ? '#1E3A8A' : '#ccc'}}>Bank</button>
          <button onClick={() => setStatementType('investor')} style={{...styles.btnPrimary, width: 'auto', background: statementType === 'investor' ? '#1E3A8A' : '#ccc'}}>Investors</button>
        </div>

        {statementType === 'sales' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px' }}>Inv No</th><th style={{ padding: '12px' }}>Customer</th><th style={{ padding: '12px' }}>Total</th><th style={{ padding: '12px' }}>Due</th></tr></thead>
            <tbody>{filterData(data.invoices.filter(i => !i.invoice_no.startsWith('REF-')), 'invoice_date').map(i => (<tr key={i.id}><td style={{ padding: '12px' }}>{i.invoice_date}</td><td style={{ padding: '12px' }}>{i.invoice_no}</td><td style={{ padding: '12px' }}>{i.customers?.name || i.corporates?.name}</td><td style={{ padding: '12px' }}>{(i.total || 0).toFixed(2)}</td><td style={{ padding: '12px', color: (i.due_amount || 0) > 0 ? '#EF4444' : '#059669', fontWeight: 'bold' }}>{(i.due_amount || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'portals' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Portal</th><th style={{ padding: '12px' }}>Balance (SAR)</th></tr></thead>
            <tbody>{data.portals.map(p => (<tr key={p.id}><td style={{ padding: '12px' }}>{p.name}</td><td style={{ padding: '12px', fontWeight: 'bold', color: (p.current_balance || 0) < 0 ? '#EF4444' : '#059669' }}>{(p.current_balance || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'vendors' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Vendor</th><th style={{ padding: '12px' }}>Phone</th><th style={{ padding: '12px' }}>Balance</th></tr></thead>
            <tbody>{data.vendors.map(v => (<tr key={v.id}><td style={{ padding: '12px' }}>{v.name}</td><td style={{ padding: '12px' }}>{v.phone}</td><td style={{ padding: '12px' }}>{v.balance}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'salary' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Employee</th><th style={{ padding: '12px' }}>Month</th><th style={{ padding: '12px' }}>Amount</th><th style={{ padding: '12px' }}>Mode</th></tr></thead>
            <tbody>{filterData(data.payroll, 'month').map(p => (<tr key={p.id}><td style={{ padding: '12px' }}>{p.employees?.name}</td><td style={{ padding: '12px' }}>{p.month}</td><td style={{ padding: '12px' }}>{p.amount}</td><td style={{ padding: '12px' }}>{p.payment_mode}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'expenses' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px' }}>Vendor</th><th style={{ padding: '12px' }}>Type</th><th style={{ padding: '12px' }}>Amount</th></tr></thead>
            <tbody>{filterData(data.expenses, 'expense_date').map(e => (<tr key={e.id}><td style={{ padding: '12px' }}>{e.expense_date}</td><td style={{ padding: '12px' }}>{e.vendor_name}</td><td style={{ padding: '12px' }}>{e.expense_type}</td><td style={{ padding: '12px' }}>{(e.amount || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'customers' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Phone</th><th style={{ padding: '12px' }}>Credit</th></tr></thead>
            <tbody>{data.customers.map(c => (<tr key={c.id}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td><td style={{ padding: '12px' }}>{c.store_credit || 0}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'creditors' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Phone</th></tr></thead>
            <tbody>{data.creditors.map(c => (<tr key={c.id}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'credit' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Available Credit</th></tr></thead>
            <tbody>{data.customers.filter(c => (c.store_credit || 0) > 0).map(c => (<tr key={c.id}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px', color: '#059669', fontWeight: 'bold' }}>{(c.store_credit || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'branches' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Location</th><th style={{ padding: '12px' }}>Manager</th><th style={{ padding: '12px' }}>Status</th></tr></thead>
            <tbody>{data.branches.map(b => (<tr key={b.id}><td style={{ padding: '12px' }}>{b.name}</td><td style={{ padding: '12px' }}>{b.location}</td><td style={{ padding: '12px' }}>{b.manager}</td><td style={{ padding: '12px' }}>{b.status}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'cash' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px' }}>Desc</th><th style={{ padding: '12px' }}>Amount</th></tr></thead>
            <tbody>{filterData(data.cashbook.filter(c => c.type.includes('Cash')), 'trans_date').map(c => (<tr key={c.id}><td style={{ padding: '12px' }}>{c.trans_date}</td><td style={{ padding: '12px' }}>{c.description}</td><td style={{ padding: '12px', color: c.type.includes('In') ? '#059669' : '#EF4444' }}>{(c.amount || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'bank' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px' }}>Desc</th><th style={{ padding: '12px' }}>Amount</th></tr></thead>
            <tbody>{filterData(data.cashbook.filter(c => c.type.includes('Bank')), 'trans_date').map(c => (<tr key={c.id}><td style={{ padding: '12px' }}>{c.trans_date}</td><td style={{ padding: '12px' }}>{c.description}</td><td style={{ padding: '12px', color: c.type.includes('In') ? '#059669' : '#EF4444' }}>{(c.amount || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        )}

        {statementType === 'investor' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px' }}>Investor</th><th style={{ padding: '12px' }}>Amount</th><th style={{ padding: '12px' }}>Reason</th></tr></thead>
            <tbody>{filterData(data.investments, 'invest_date').map(i => (<tr key={i.id}><td style={{ padding: '12px' }}>{i.invest_date}</td><td style={{ padding: '12px' }}>{i.investor_name}</td><td style={{ padding: '12px' }}>{(i.amount || 0).toFixed(2)}</td><td style={{ padding: '12px' }}>{i.reason || 'N/A'}</td></tr>))}</tbody>
          </table>
        )}
      </div>
    );
  }

  return null;
}
