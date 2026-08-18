'use client';

import React, { useState } from 'react';

const styles = { 
  input: { width: '100%', padding: '12px 15px', margin: '6px 0', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }, 
  btnPrimary: { padding: '12px 15px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E293B', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }, 
  btnInfo: { padding: '8px 12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
  card: { background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', marginTop: '12px' },
  tableHeader: { background: '#1E293B', color: 'white', padding: '15px', textAlign: 'start', fontSize: '13px' },
  tableCell: { padding: '15px', borderBottom: '1px solid #F1F5F9', fontSize: '14px' }
};

export default function ERPViewsAdmin(props) {
  const { page, data, tr, today, expForm, setExpForm, editExpId, setEditExpId, handleAddExpItem, handleRemoveExpItem, handleExpItemChange, handleAddExpense, handleEditExpense, handleDeleteExpense, handlePreviewExpense, handleAddEditVend, vendorForm, setVendorForm, editVendId, handleEditVend, handleAddEditPkg, pkgForm, setPkgForm, editPkgId, handleEditPkg, handleAddEditBrn, brnForm, setBrnForm, editBrnId, handleEditBrn, handleAddEditEmp, empForm, setEmpForm, editEmpId, handleEditEmp, handleAddEditSrv, srvForm, setSrvForm, editSrvId, handleEditSrv, handlePaySalary, handleAddPortal, portalForm, setPortalForm, handleRecharge, handleAddInvestment, investForm, setInvestForm, handleTransfer, transferForm, setTransferForm, handleDelete, exportToExcel, handleAddAdvance, handleReturnAdvance, ledgerEmpId, setLedgerEmpId, handleGenerateSlip, handleDeletePayroll, handleAddMistake, handlePreviewMistake, handleDeleteMistake } = props;

  const expSubTotal = expForm?.items?.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0) || 0;
  const expVat = expSubTotal * ((parseFloat(expForm?.taxRate) || 0) / 100);
  const expGrandTotal = expSubTotal + expVat;
  
  const [cashbookFilter, setCashbookFilter] = useState('All');

  // VENDORS
  if (page === 'vendors') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.vendors}</h2>
        <button onClick={() => exportToExcel(data.vendors, 'Vendors')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={{...styles.card, display: 'flex', gap: '15px', alignItems: 'center'}}>
        <form onSubmit={handleAddEditVend} style={{ display: 'flex', gap: '15px', width: '100%' }}>
          <input value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={vendorForm.phone} onChange={e => setVendorForm({...vendorForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <input type="number" value={vendorForm.balance} onChange={e => setVendorForm({...vendorForm, balance: e.target.value})} placeholder="Balance" style={styles.input} />
          <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '12px 25px'}}>{editVendId ? 'Update' : 'Add'}</button>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Phone</th><th style={styles.tableHeader}>Balance</th><th style={styles.tableHeader}>Actions</th></tr></thead>
          <tbody>{data.vendors.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.phone}</td><td style={styles.tableCell}>{c.balance}</td><td style={styles.tableCell}><button onClick={() => handleEditVend(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('vendors', c.id)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>Delete</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  // PACKAGES
  if (page === 'packages') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.packages}</h2>
        <button onClick={() => exportToExcel(data.packages, 'Packages')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={styles.card}>
        <form onSubmit={handleAddEditPkg} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <input value={pkgForm.name} onChange={e => setPkgForm({...pkgForm, name: e.target.value})} placeholder="Package Name" style={styles.input} required />
          <input type="number" value={pkgForm.price} onChange={e => setPkgForm({...pkgForm, price: e.target.value})} placeholder="Price" style={styles.input} required />
          <input value={pkgForm.duration} onChange={e => setPkgForm({...pkgForm, duration: e.target.value})} placeholder="Duration" style={styles.input} />
          <input value={pkgForm.inclusions} onChange={e => setPkgForm({...pkgForm, inclusions: e.target.value})} placeholder="Inclusions" style={styles.input} />
          <input value={pkgForm.desc} onChange={e => setPkgForm({...pkgForm, desc: e.target.value})} placeholder="Description" style={{...styles.input, gridColumn: '1 / -1'}} />
          <button type="submit" style={{...styles.btnPrimary, gridColumn: '1 / -1'}}>{editPkgId ? 'Update' : 'Add'}</button>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Duration</th><th style={styles.tableHeader}>Price</th><th style={styles.tableHeader}>Actions</th></tr></thead>
          <tbody>{data.packages.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.duration}</td><td style={styles.tableCell}>{c.price}</td><td style={styles.tableCell}><button onClick={() => handleEditPkg(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('packages', c.id)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>Delete</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  // BRANCHES
  if (page === 'branches') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.branches}</h2>
        <button onClick={() => exportToExcel(data.branches, 'Branches')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={styles.card}>
        <form onSubmit={handleAddEditBrn} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <input value={brnForm.name} onChange={e => setBrnForm({...brnForm, name: e.target.value})} placeholder="Branch Name" style={styles.input} required />
          <input value={brnForm.location} onChange={e => setBrnForm({...brnForm, location: e.target.value})} placeholder="Location" style={styles.input} />
          <input value={brnForm.phone} onChange={e => setBrnForm({...brnForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <input value={brnForm.manager} onChange={e => setBrnForm({...brnForm, manager: e.target.value})} placeholder="Manager" style={styles.input} />
          <input value={brnForm.email} onChange={e => setBrnForm({...brnForm, email: e.target.value})} placeholder="Email" style={styles.input} />
          <input value={brnForm.timing} onChange={e => setBrnForm({...brnForm, timing: e.target.value})} placeholder="Timing" style={styles.input} />
          <select value={brnForm.status} onChange={e => setBrnForm({...brnForm, status: e.target.value})} style={styles.input}><option>Active</option><option>Inactive</option></select>
          <button type="submit" style={{...styles.btnPrimary, gridColumn: '1 / -1'}}>{editBrnId ? 'Update' : 'Add'}</button>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Location</th><th style={styles.tableHeader}>Manager</th><th style={styles.tableHeader}>Status</th><th style={styles.tableHeader}>Actions</th></tr></thead>
          <tbody>{data.branches.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.location}</td><td style={styles.tableCell}>{c.manager}</td><td style={styles.tableCell}>{c.status}</td><td style={styles.tableCell}><button onClick={() => handleEditBrn(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('branches', c.id)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>Delete</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  // PORTALS
  if (page === 'portals') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.portals}</h2>
        <button onClick={() => exportToExcel(data.portals.map(p => ({ Name: p.name, Balance: p.current_balance })), 'Portals')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={styles.card}>
        <h3 style={{marginTop: 0, color: '#0F172A'}}>Add New Portal</h3>
        <form onSubmit={handleAddPortal} style={{ display: 'flex', gap: '15px' }}>
          <input value={portalForm.name} onChange={e => setPortalForm({...portalForm, name: e.target.value})} placeholder="Portal Name" style={styles.input} required />
          <input type="number" value={portalForm.balance} onChange={e => setPortalForm({...portalForm, balance: e.target.value})} placeholder="Initial Balance" style={styles.input} />
          <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '12px 25px'}}>Add</button>
        </form>
      </div>
      <div style={styles.card}>
        <h3 style={{marginTop: 0, color: '#0F172A'}}>Recharge Portal</h3>
        <form onSubmit={handleRecharge}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr)) auto', gap: '15px' }}>
            <select name="portal" style={styles.input} required>{data.portals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <input type="number" step="0.01" name="amt" placeholder="Amount" style={styles.input} required />
            <input type="date" name="date" defaultValue={today} style={styles.input} required />
            <input name="desc" placeholder="Desc" style={styles.input} />
            <select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select>
            <button type="submit" style={{...styles.btnPrimary, height: '42px'}}>Recharge</button>
          </div>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Balance</th><th style={styles.tableHeader}>Actions</th></tr></thead>
          <tbody>{data.portals.map(p => <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{p.name}</td><td style={{...styles.tableCell, fontWeight: 'bold', color: (p.current_balance || 0) < 0 ? '#EF4444' : '#059669'}}>{(p.current_balance || 0).toFixed(2)}</td><td style={styles.tableCell}><button onClick={() => handleDelete('portals', p.id)} style={styles.btnDanger}>Delete</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  // BANK & CASH
  if (page === 'bank') {
    const filteredCashbook = cashbookFilter === 'All' ? data.cashbook : data.cashbook.filter(c => c.type.toLowerCase().includes(cashbookFilter.toLowerCase()));
    return (
      <div>
        <h2 style={{ color: '#0F172A', marginBottom: '20px' }}>{tr.bank}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)', color: 'white', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 5px', fontSize: '14px', opacity: 0.9 }}>Cash in Hand</h3>
            <h2 style={{ margin: 0, fontSize: '24px' }}>{data.cashbook.filter(c => c.type === 'Cash-In').reduce((s,c) => s + (c.amount || 0), 0) - data.cashbook.filter(c => c.type === 'Cash-Out').reduce((s,c) => s + (c.amount || 0), 0)} SAR</h2>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #2563EB, #1E3A8A)', color: 'white', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 5px', fontSize: '14px', opacity: 0.9 }}>Bank Balance</h3>
            <h2 style={{ margin: 0, fontSize: '24px' }}>{data.cashbook.filter(c => c.type === 'Bank-In').reduce((s,c) => s + (c.amount || 0), 0) - data.cashbook.filter(c => c.type === 'Bank-Out').reduce((s,c) => s + (c.amount || 0), 0)} SAR</h2>
          </div>
        </div>
        <div style={styles.card}>
          <h3 style={{marginTop: 0, color: '#0F172A'}}>Fund Transfer</h3>
          <form onSubmit={handleTransfer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr)) auto', gap: '15px', alignItems: 'flex-end' }}>
            <div><label style={styles.label}>From</label><select value={transferForm.from} onChange={e => setTransferForm({...transferForm, from: e.target.value})} style={styles.input}><option>Cash</option><option>Bank</option><option>Investor</option></select></div>
            <div><label style={styles.label}>To</label><select value={transferForm.to} onChange={e => setTransferForm({...transferForm, to: e.target.value})} style={styles.input}><option>Bank</option><option>Cash</option><option>Investor</option></select></div>
            <div><label style={styles.label}>Amount</label><input type="number" step="0.01" value={transferForm.amount} onChange={e => setTransferForm({...transferForm, amount: e.target.value})} style={styles.input} required /></div>
            <div><label style={styles.label}>Date</label><input type="date" value={transferForm.date} onChange={e => setTransferForm({...transferForm, date: e.target.value})} style={styles.input} required /></div>
            <button type="submit" style={{...styles.btnPrimary, height: '42px'}}>Transfer</button>
          </form>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setCashbookFilter('All')} style={{ padding: '8px 15px', background: cashbookFilter === 'All' ? '#0F172A' : '#E2E8F0', color: cashbookFilter === 'All' ? 'white' : '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>All</button>
            <button onClick={() => setCashbookFilter('Cash')} style={{ padding: '8px 15px', background: cashbookFilter === 'Cash' ? '#D97706' : '#E2E8F0', color: cashbookFilter === 'Cash' ? 'white' : '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cash Only</button>
            <button onClick={() => setCashbookFilter('Bank')} style={{ padding: '8px 15px', background: cashbookFilter === 'Bank' ? '#2563EB' : '#E2E8F0', color: cashbookFilter === 'Bank' ? 'white' : '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Bank Only</button>
          </div>
          <button onClick={() => exportToExcel(data.cashbook, 'Cashbook')} style={styles.btnSuccess}>{tr.download_excel}</button>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Type</th><th style={styles.tableHeader}>Desc</th><th style={styles.tableHeader}>Amount</th><th style={styles.tableHeader}>Action</th></tr></thead>
              <tbody>{filteredCashbook.slice(0, 20).map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.trans_date}</td><td style={styles.tableCell}>{c.type}</td><td style={styles.tableCell}>{c.description}</td><td style={{...styles.tableCell, color: c.type.includes('In') ? '#059669' : '#EF4444', fontWeight: 'bold'}}>{(c.amount || 0).toFixed(2)}</td><td style={styles.tableCell}><button onClick={() => handleDelete('cashbook', c.id)} style={styles.btnDanger}>Delete</button></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // INVESTMENTS
  if (page === 'invest') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.invest}</h2>
        <button onClick={() => exportToExcel(data.investments, 'Investments')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={styles.card}>
        <form onSubmit={handleAddInvestment} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto', gap: '15px', alignItems: 'flex-end' }}>
          <div><label style={styles.label}>Investor Name</label><input value={investForm.name} onChange={e => setInvestForm({...investForm, name: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Amount</label><input type="number" step="0.01" value={investForm.amount} onChange={e => setInvestForm({...investForm, amount: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Date of Investment</label><input type="date" value={investForm.date} onChange={e => setInvestForm({...investForm, date: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Mode</label><select value={investForm.mode} onChange={e => setInvestForm({...investForm, mode: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option></select></div>
          <div><label style={styles.label}>Reason</label><select value={investForm.reason} onChange={e => setInvestForm({...investForm, reason: e.target.value})} style={styles.input}><option>Other</option><option>Recharge for Portal</option><option>Office Expense</option><option>Salary</option></select></div>
          {investForm.reason === 'Other' && <div><label style={styles.label}>Specify Reason</label><input value={investForm.otherReason} onChange={e => setInvestForm({...investForm, otherReason: e.target.value})} style={styles.input} required /></div>}
          <div><label style={styles.label}>Desc</label><input value={investForm.desc} onChange={e => setInvestForm({...investForm, desc: e.target.value})} style={styles.input} /></div>
          <button type="submit" style={{...styles.btnPrimary, height: '42px'}}>Add</button>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Amount</th><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Reason</th><th style={styles.tableHeader}>Action</th></tr></thead>
          <tbody>{data.investments.map(i => <tr key={i.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{i.investor_name}</td><td style={styles.tableCell}>{(i.amount || 0).toFixed(2)}</td><td style={styles.tableCell}>{i.invest_date}</td><td style={styles.tableCell}>{i.reason || 'N/A'}</td><td style={styles.tableCell}><button onClick={() => handleDelete('investments', i.id)} style={styles.btnDanger}>Delete</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  // HR & EMPLOYEES (Advanced Insights & Voucher Actions Added)
  if (page === 'hr') {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const totalSalaryThisMonth = data.payroll.filter(p => p.month === currentMonth).reduce((s, p) => s + (p.amount || 0), 0);
    const expiringIqamas = data.employees.filter(e => e.iqama_expiry && new Date(e.iqama_expiry) < new Date(new Date().setMonth(new Date().getMonth() + 1))).length;

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.hr}</h2>
          <button onClick={() => exportToExcel(data.payroll.map(p => ({ Employee: p.employees?.name, Amount: p.amount })), 'Payroll')} style={styles.btnSuccess}>{tr.download_excel}</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 5px', fontSize: '14px', opacity: 0.9 }}>Total Salary Paid ({currentMonth})</h3>
            <h2 style={{ margin: 0, fontSize: '24px' }}>{totalSalaryThisMonth.toFixed(2)} SAR</h2>
          </div>
          <div style={{ background: expiringIqamas > 0 ? 'linear-gradient(135deg, #B91C1C, #EF4444)' : 'linear-gradient(135deg, #059669, #047857)', color: 'white', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 5px', fontSize: '14px', opacity: 0.9 }}>⚠️ Iqama Expiring (Next 30 Days)</h3>
            <h2 style={{ margin: 0, fontSize: '24px' }}>{expiringIqamas} Employees</h2>
          </div>
        </div>
        
        <div style={styles.card}>
          <h3 style={{marginTop: 0, color: '#0F172A'}}>Add Employee</h3>
          <form onSubmit={handleAddEditEmp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr)) auto', gap: '15px' }}>
            <input value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
            <input value={empForm.phone} onChange={e => setEmpForm({...empForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
            <input value={empForm.iqama_no} onChange={e => setEmpForm({...empForm, iqama_no: e.target.value})} placeholder="Iqama No" style={styles.input} />
            <input type="date" value={empForm.iqama_expiry} onChange={e => setEmpForm({...empForm, iqama_expiry: e.target.value})} style={styles.input} />
            <select value={empForm.role} onChange={e => setEmpForm({...empForm, role: e.target.value})} style={styles.input}>
              <option>Sales</option><option>Accountant</option><option>Manager</option><option>Driver</option><option>Cleaner</option><option>Admin</option>
            </select>
            <input type="number" step="0.01" value={empForm.salary} onChange={e => setEmpForm({...empForm, salary: e.target.value})} placeholder="Base Salary" style={styles.input} />
            <input type="number" step="0.01" value={empForm.commission_rate || 0} onChange={e => setEmpForm({...empForm, commission_rate: e.target.value})} placeholder="Commission %" style={styles.input} />
            <button type="submit" style={{...styles.btnPrimary, height: '42px'}}>{editEmpId ? 'Update' : 'Add'}</button>
          </form>
        </div>
        
        <div style={styles.card}>
          <h3 style={{marginTop: 0, color: '#0F172A'}}>Employees List & Complete Data</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead><tr>
                <th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Phone</th><th style={styles.tableHeader}>Iqama</th><th style={styles.tableHeader}>Expiry</th><th style={styles.tableHeader}>Role</th><th style={styles.tableHeader}>Salary</th><th style={styles.tableHeader}>Actions</th>
              </tr></thead>
              <tbody>
                {data.employees.map(e => {
                  const isExpiringSoon = e.iqama_expiry && new Date(e.iqama_expiry) < new Date(new Date().setMonth(new Date().getMonth() + 1));
                  return (
                    <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={styles.tableCell}>{e.name}</td>
                      <td style={styles.tableCell}>{e.phone}</td>
                      <td style={styles.tableCell}>{e.iqama_no || 'N/A'}</td>
                      <td style={{...styles.tableCell, color: isExpiringSoon ? '#EF4444' : '#334155', fontWeight: isExpiringSoon ? 'bold' : 'normal'}}>
                        {e.iqama_expiry || 'N/A'} {isExpiringSoon && '⚠️'}
                      </td>
                      <td style={styles.tableCell}>{e.role}</td>
                      <td style={styles.tableCell}>{e.salary} + {e.commission_rate || 0}%</td>
                      <td style={styles.tableCell}>
                        <button onClick={() => handleEditEmp(e)} style={styles.btnWarning}>Edit</button>
                        <button onClick={() => handleDelete('employees', e.id)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{marginTop: 0, color: '#0F172A'}}>Add Service</h3>
          <form onSubmit={handleAddEditSrv} style={{ display: 'flex', gap: '15px' }}>
            <input value={srvForm.name} onChange={e => setSrvForm({...srvForm, name: e.target.value})} placeholder="Service Name" style={styles.input} required />
            <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '12px 25px'}}>{editSrvId ? 'Update' : 'Add'}</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={{marginTop: 0, color: '#0F172A'}}>Employee Advance / Loan (Udhaar)</h3>
          <form onSubmit={handleAddAdvance} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '15px' }}>
            <select name="emp" style={styles.input} required><option value="">Select Employee</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
            <input type="number" step="0.01" name="amt" placeholder="Amount" style={styles.input} required />
            <input type="date" name="date" defaultValue={today} style={styles.input} required />
            <button type="submit" style={{...styles.btnPrimary, height: '42px'}}>Give Advance</button>
          </form>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', marginTop: '15px' }}>
              <thead><tr><th style={styles.tableHeader}>Employee</th><th style={styles.tableHeader}>Amount</th><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Status</th><th style={styles.tableHeader}>Action</th></tr></thead>
              <tbody>{(data.empAdvances || []).filter(a => a.status === 'Pending').map(a => (<tr key={a.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{a.employees?.name}</td><td style={styles.tableCell}>{(a.amount||0).toFixed(2)}</td><td style={styles.tableCell}>{a.date}</td><td style={{...styles.tableCell, color: '#EF4444'}}>{a.status}</td><td style={styles.tableCell}><button onClick={() => handleReturnAdvance(a)} style={styles.btnSuccess}>Returned</button></td></tr>))}</tbody>
            </table>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{marginTop: 0, color: '#0F172A'}}>Pay Salary (Auto Deducts Advance)</h3>
          <form onSubmit={handlePaySalary} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr)) auto', gap: '15px' }}>
            <select name="emp" style={styles.input} required><option value="">Select Employee</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
            <input type="number" step="0.01" name="base" placeholder="Base" style={styles.input} required />
            <input type="number" step="0.01" name="comm" placeholder="Commission" style={styles.input} required />
            <input type="number" step="0.01" name="adv_ded" placeholder="Adv. Deduct" style={styles.input} required />
            <input type="text" name="month" placeholder="Month" style={styles.input} required />
            <select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select>
            <button type="submit" style={{...styles.btnPrimary, height: '42px'}}>Pay</button>
          </form>
        </div>

        {/* SALARY SLIP LIST WITH PREVIEW & DELETE */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}><h3 style={{ margin: 0, color: '#0F172A' }}>📋 Generate Salary Slip</h3></div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Employee</th>
                  <th style={styles.tableHeader}>Month</th>
                  <th style={styles.tableHeader}>Net Paid</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.payroll.length === 0 ? <tr><td colSpan="4" style={{padding:'30px', textAlign:'center', color:'#94A3B8'}}>No salary paid yet.</td></tr> : data.payroll.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{...styles.tableCell, fontWeight: 'bold'}}>{p.employees?.name || 'N/A'}</td>
                    <td style={styles.tableCell}>{p.month}</td>
                    <td style={{...styles.tableCell, color: '#059669', fontWeight: 'bold'}}>{(p.amount || 0).toFixed(2)} SAR</td>
                    <td style={styles.tableCell}>
                      <button onClick={() => handleGenerateSlip(p)} style={styles.btnInfo}>Preview Slip</button>
                      <button onClick={() => handleDeletePayroll(p)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* STAFF MISTAKES WITH VOUCHER PREVIEW & DELETE */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}><h3 style={{ margin: 0, color: '#0F172A' }}>⚠️ Staff Mistakes & Loss Tracking</h3></div>
          <div style={{ padding: '20px' }}>
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
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Employee</th><th style={styles.tableHeader}>Old Ticket</th><th style={styles.tableHeader}>New Ticket</th><th style={styles.tableHeader}>Loss Amount</th><th style={styles.tableHeader}>Actions</th></tr></thead>
              <tbody>
                {data.staffMistakes.length === 0 ? <tr><td colSpan="6" style={{padding:'30px', textAlign:'center', color:'#94A3B8'}}>No mistakes logged yet.</td></tr> : data.staffMistakes.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9', background: '#FFFBEB' }}>
                    <td style={styles.tableCell}>{m.date}</td>
                    <td style={styles.tableCell}>{m.employees?.name || 'N/A'}</td>
                    <td style={styles.tableCell}>{m.old_ticket_no}</td>
                    <td style={styles.tableCell}>{m.new_ticket_no}</td>
                    <td style={{...styles.tableCell, fontWeight: 'bold', color: '#EF4444'}}>{(m.loss_amount || 0).toFixed(2)} SAR</td>
                    <td style={styles.tableCell}>
                      <button onClick={() => handlePreviewMistake(m)} style={styles.btnInfo}>Preview Voucher</button>
                      <button onClick={() => handleDeleteMistake(m)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  );

  return null;
}
