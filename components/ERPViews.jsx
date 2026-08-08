import React from 'react';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }, 
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }, 
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block', marginTop: '10px' } 
};

export default function ERPViews(props) {
  const { 
    page, data, tr, today, 
    invForm, setInvForm, handleCreateInvoice, downloadPDF, printInvoice, exportToExcel, 
    search, setSearch, payFilter, setPayFilter,
    handleAddEditCust, custForm, setCustForm, handleEditCust, editCustId,
    handleAddEditCorp, corpForm, setCorpForm, handleEditCorp, editCorpId,
    handleAddEditCred, creditorForm, setCreditorForm, handleEditCred, editCredId,
    handleAddEditVend, vendorForm, setVendorForm, handleEditVend, editVendId,
    handleAddEditPkg, pkgForm, setPkgForm, handleEditPkg, editPkgId,
    handleAddEditBrn, brnForm, setBrnForm, handleEditBrn, editBrnId,
    handleAddEditEmp, empForm, setEmpForm, handleEditEmp, editEmpId,
    handleAddEditSrv, srvForm, setSrvForm, handleEditSrv, editSrvId,
    handlePaySalary, 
    expForm, setExpForm, handleAddExpItem, handleRemoveExpItem, handleExpItemChange, handleAddExpense,
    handleAddPortal, portalForm, setPortalForm,
    handleAddInvestment, investForm, setInvestForm,
    handleRecharge, handleTransfer, transferForm, setTransferForm,
    handleAddUser, handleEditUser, handleUpdateUser, userForm, setUserForm, editUserId,
   <parameter name="handleSaveSettings, handleLogoUpload, setForm, setSetForm,">
    repDate, setRepDate, reportTab, setReportTab, statementTab, setStatementTab,
    handleDelete, filterData,
    handleEditInvoice, handleDeleteInvoice, openRefDundModal, editInvId, openPreview,
    ledgerCustId, setLedgerCustId
  } = props;

  const expSubTotal = expForm?.items?.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0) || 0;
  const expVat = expSubTotal * ((parseFloat(expForm?.taxRate) || 0) / 100);
  const expGrandTotal = expSubTotal + expVat;

  if (page === 'dashboard') {
    const s = data.settings || {};
    const activeInv = data.invoices.filter(i => !i.invoice_no.startsWith('REF-'));
    const tSales = activeInv.reduce((s,i) => s + (i.total || 0), 0);
    const tProfit = activeInv.reduce((s,i) => s + (i.profit || 0), 0);
    const cashBal = data.cashbook.filter(c => c.type === 'Cash-In').reduce((s,c) => s + (c.amount || 0), 0) - data.cashbook.filter(c => c.type === 'Cash-Out').reduce((s,c) => s + (c.amount || 0), 0);
    const bankBal = data.cashbook.filter(c => c.type === 'Bank-In').reduce((s,c) => s + (c.amount || 0), 0) - data.cashbook.filter(c => c.type === 'Bank-Out').reduce((s,c) => s + (c.amount || 0), 0);
    const totalOutstanding = activeInv.reduce((s,i) => s + (i.due_amount || 0), 0);
    const tExpenses = data.expenses.reduce((s,e) => s + (e.amount || 0), 0);
    const lowBalPortals = data.portals.filter(p => (p.current_balance || 0) < 1000);

    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#1E3A8A', fontSize: '32px' }}>{s.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <h2 style={{ margin: '5px 0', color: '#D97706', fontSize: '24px' }}>{s.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
          <p style={{ color: '#555', fontSize:614px' }}>{s.address_ar || ''} | {s.phone || ''}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{...styles.card, borderLeft: '5px solid #1E3A8A'}}><h3>Total Sales</h3><h2>{tSales.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #059669'}}><h3>Total Profit</h3><h2>{tProfit.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solidF4444'}}><h3>Outstanding</h3><h2>{totalOutstanding.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #D97706'}}><h3>Cash Balance</h3><h2>{cashAal.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5- solid #2563EB'}}><h3>Bank Balance</h3><h2>{bankBal.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #7c3aed'}}><h3>Total Expenses</h3><h2>{tExpenses.toFixed(2)} SAR</h2></div>
        </div>
      </div>
    );
  }

  if (page === 'credit') {
    const creditCustomers = data.customers.filter(c => (c.store_credit || 0) > 0);
    return (
      <div>
        <h2>{tr.credit}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
          <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Customer</th><th style={{ padding: '12px' }}>Phone</th><th style={{ padding: '12px' }}>Available Credit (SAR)</th></tr></thead>
          <tbody>
            {creditCustomers.length === 0 ? <tr><td colSpan="3" style={{padding: '20px', textAlign: 'center'}}>No credit balances available.</td></tr> : 
              creditCustomers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td><td style={{ padding: '12px', color: '#059669', fontWeight: 'bold' }}>{(c.store_credit || 0).toFixed(2)}</td></tr>)
            }
          </tbody>
        </table>
      </div>
    );
  }

  if (page === 'create') return (
    <div style={styles.card}>
      <h2>{editInvId ? 'Edit Invoice' : tr.create}</h2>
      <form onSubmit={handleCreateInvoice}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {invForm.payment !== 'Credit Balance' && (
            <div><label style={styles.label}>Customer Type</label><select value={invForm.custType} onChange={e => setInvForm({...invForm, custType: e.target.value})} style={styles.input}><option>Individual</option><option>Corporate</option></select></div>
          )}
          {invForm.payment !== 'Credit Balance' && invForm.custType === 'Individual' ? (
            <>
              <div><label style={styles.label}>Select Customer</label><select value={invForm.custId} onChange={e => setInvForm({...invForm, custId: e.target.value})} style={styles.input}><option value="new">New Customer</option>{data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              {invForm.custId === 'new' && (<><div><label style={styles.label}>Customer Name</label><input value={invForm.custName} onChange={e => setInvForm({...invForm, custName: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Phone</label><input value={invForm.custPhone} onChange={e => setInvForm({...invForm, custPhone: e.target.value})} style={styles.input} /></div></>)}
            </>
          ) : invForm.payment !== 'Credit Balance' && invForm.custType === 'Corporate' ? (
            <>
              <div><label style={styles.label}>Select Corporate</label><select value={invForm.corpId} onChange={e => setInvForm({...invForm, corpId: e.target.value})} style={styles.input}><option value="new">New Company</option>{data.corporates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              {invForm.corpId === 'new' && (<><div><label style={styles.label}>Company Name</label><input value={invForm.corpName} onChange={e => setInvForm({...invForm, corpName: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>VAT</label><input value={invForm.corpVat} onChange={e => setInvForm({...invForm, corpVat: e.target.value})} style={styles.input} /></div></>)}
            </>
          ) : null}

          <div style={{ gridColumn: '1 / -1' }}>
            <label style919 style={styles.label}>Passengers</label>
            {invForm.passengers.map((p, i) => (<div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><input value={p} onChange={e => { const arr = [...invForm.passengers]; arr[i] = e.target.value; setInvForm({...invForm, passengers: arr}); }} placeholder={`Passenger ${i + 1}`} style={styles.input} required />{invForm.passengers.length > 1 && <button type="button" onClick={() => setInvForm({...invForm, passengers: invForm.passengers.filter((_, idx) => idx !== i)})} style={{...styles.btnDanger, width: 'auto'}}>X</button>}</div>))}
            <button type="button" onClick={() => setInvForm({...invForm, passengers: [...invForm.passengers, '']})} style={{...styles.btnWarning, width: 'auto'}}>+ Add</button>
          </div>

          <div><label style={styles.label}>Portal</label><select value={invForm.portalId} onChange={e => setInvForm({...invForm, portalId: e.target.value})} style={styles.input} required><option value="">Select</option>{data.portals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label style={styles.label}>Service</label><select value={invForm.service} onChange={e => setInvForm({...invForm, service: e.target.value})} style={styles.input}><option>Flight Ticket</option><option>Hotel</option><option>Tour Package</option><option>Visa</option></select></div>
          
          {invForm.service === 'Flight Ticket' && (<><div><label style={styles.label}>Airline</label><input value={invForm.airline} onChange={e => setInvForm({...invForm, airline: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Sector</label><input value={invForm.flightSector} onChange={e => setInvForm({...invForm, flightSector: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>PNR</label><input value={invForm.pnr} onChange={e => setInvForm({...invForm, pnr: e.target.value})} style={styles.input} /></div></>)}

          <div><label style={styles.label}>Qty</label><input type="number" value={invForm.qty} onChange={e => setInvForm({...invForm, qty: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Cost</label><input type="number" step="0.01" value={invForm.cost} onChange={e => setInvForm({...invForm, cost: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Sell</label><input type="number" step="0.01" value={invForm.sell} onChange={e => setInvForm({...invForm, sell: e.target.value})} style={styles.input} required /></div>
          <div><labelFlabel style={styles.label}>Discount</label><input type="number" step="0.01" value={invForm.discount} onChange={e => setInvForm({...invForm, discount: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>VAT</label><select value={invForm.taxRate} onChange={e => setInvForm({...invForm, taxRate: e.target.value})} style={styles.input}><option value="15">15%</option><option value="0">0%</option></select></div>
          <div><label style={styles.label}>Invoice Date</label><input type="date" value={invForm.invoiceDate} onChange={e => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Sales Person</label><select value={invForm.employeeId} onChange={e => setInvForm({...invForm, employeeId: e.target.value})} style={styles.input} required><option value="">Select</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
          <div><label style={styles.label}>Payment</label><select value={invForm.payment} onChange={e => setInvForm({...invForm, payment: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option><option>Credit</option><option>Credit Balance</option></select></div>
          <div><label style={styles.label}>Paid Amount</label><input type="number" step="0.01" value={invForm.paid} onChange={e => setInvForm({...invForm, paid: e.target.value})} style={styles.input} required /></div>
          {invForm.payment === 'Credit' && <div><label style={styles.label}>Due Date</label><input type="date" value={invForm.creditDueDate} onChange={e => setInvForm({...invForm, creditDueDate: e.target.value})} style={styles.input} required /></div>}
        </div>
        <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>{editInvId ? 'Update Invoice' : 'Generate Invoice'}</button>
      </form>
    </div>
  );

  if (page === 'list' || page === 'refunds') {
    const isInvoices = page === 'list';
    const allData = isInvoices ? data.invoices.filter(i => !i.invoice_no.startsWith('REF-')) : data.invoices.filter(i => i.invoice_no.startsWith('REF-'));
    const filteredData = allData.filter(inv => (payFilter === 'All' || inv.payment_method === payFilter) && (inv.invoice_no.toLowerCase().includes(search.toLowerCase()) || inv.customers?.name.toLowerCase().includes(search.toLowerCase())));
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{isInvoices ? tr.list : tr.refunds}</h2><button onClick={() => exportToExcel(filteredData, isInvoices ? 'Invoices' : 'Refunds')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}><input placeholder={tr.search} value={search} onChange={e => setSearch(e.target.value)} style={styles.input} /><select value={payFilter} onChange={e => setPayFilter(e.target.value)} style={{...styles.input, maxWidth: '200px'}}><option>All</option><option>Cash</option><option>Bank Transfer</option><option>Credit</option></select></div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Inv No</th><th style={{ padding: '12px', textAlign: 'left' }}>Customer</th><th style={{ padding: '12px', textAlign: 'left' }}>Total</th><th style={{ padding: '12px', textAlign: 'left' }}>Due</th><th style={{ padding: '12px', textAlign: 'left' }}>Method</th><th style={{ padding: '12px', textAlign: 'left' }}>Actions</th></tr></thead>
          <tbody>
            {filteredData.slice(0, 20).map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '12px' }}>{inv.invoice_no}</td>
                <td style={{ padding: '12px' }}>{inv.customers?.name || inv.corporates?.name}</td>
                <td style={{ padding: '12px' }}>{(inv.total || 0).toFixed(2)}</td>
                <td style={{ padding: '12px', color: (inv.due_amount || 0) > 0 ? '#EF4444' : '#059669', fontWeight: 'bold' }}>{(inv.due_amount || 0).toFixed(2)}</td>
                <td style={{ padding: '12px'612}</td>
                <td style={{ padding: '12px' }}><div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}><button onClick={() => openPreview(inv)} style={{ ...styles.btnPrimary, padding: '5px 8px', width: 'auto', fontSize: '11px' }}>Preview</button><button onClick={() => downloadPDF(inv, 'en')} style={{ ...styles.btnPrimary, padding: '5px 8px', width: 'auto', fontSize: '11px' }}>PDF</button><button onClick={() => handleEditInvoice(inv)} style={{ ...styles.btnWarning, padding: '5px 8px', fontSize: '11px' }}>Edit</button><button onClick={() => handleDeleteInvoice(inv)} style={{ ...styles.btnDanger, padding: '5px 8px', fontSize: '11px' }}>Delete</button>{isInvoices &&) && <button onClick={() => openRefundModal(inv)} style={{ ...styles.btnDanger, padding: '5px 8px', fontSize: '11px' }}>Refund</button>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (page === 'customers') return (<div><h2>{tr.customers}</h2><div style={styles.card}><form onSubmit={handleAddEditCust} style={{ display: 'flex', gap: '10px' }}><input value={custForm.name} onChange={e => setCustForm({...custForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><input value={custForm.phone} onChange={e => setCustForm({...custForm, phone: e.target.value})} placeholder="Phone" style={styles.input} /><button type="submit" style={styles.btnPrimary}>{editCustId ? 'Update' : 'Add'}</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Phone</th><th style={{ padding: '12px' }}>Actions</th></tr></thead><tbody>{data.customers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditCust(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('customers', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Del</button></td></tr>)}</tbody></table></div>);

  if (page === 'corporates') return (<div><h2>{tr.corporates}</h2><div style={styles.card}><form onSubmit={handleAddEditCorp} style={{ display: 'flex', gap: '10px' }}><input value={corpForm.name} onChange={e => setCorpForm({...corpForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><input value={corpForm.vat_no} onChange={e => setCorpForm({...corpForm, vat_no: e.target.value})} placeholder="VAT" style={styles.input} /><button type="submit" style={styles.btnPrimary}>{editCorpId ? 'Update' : 'Add'}</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>VAT</th><th style={{ padding: '12px' }}>Actions</th></tr></thead><tbody>{data.corporates.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={612 padding: '12px' }}>{c.vat_no}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditCorp(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('corporates', c.idCpId)} style={{...styles.btnDanger, marginLeft: '5px'}}>Del</button></td></tr>)}</tbody></table></div>);

  if (page === 'creditors') return (<div><h2>{tr.creditors}</h2><div style={styles.card}><form onSubmit={handleAddEditCred} style={{ display: 'flex', gap: '10px' }}><input value={creditorForm.name} onChange={e => setCreditorForm({...creditorForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><button type="submit" style={styles.btnPrimary}>{editCredId ? 'Update' : 'Add'}</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Actions</th></tr></thead><tbody>{data.creditors.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}><button onClick={() => handleDelete('creditors', c.id)} style={styles.btnDanger}>Del</button></td></tr>)}</tbody></table></div>);

  if (page === 'vendors') return (<div><h2>{tr.vendors}</h2><div style={styles.card}><form onSubmit={handleAddEditVend} style={{ display: 'flex', gap: '10px' }}><input value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><button type="submit" style={styles.btnPrimary}>{editVendId ? 'Update' : 'Add'}</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Balance</th><th style={{ padding: '12px' }}>Actions</th></tr></thead><tbody>{data.vendors.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.balance}</td><td style={{ padding: '12px' }}><button onClick={() => handleDelete('vendors', c.id)} style={styles.btnDanger}>Del</button></td></tr>)}</tbody></table></div>);

  if (page === 'portals') return (<div><h2>{tr.portals}</h2><div style={styles.card}><form onSubmit={handleAddPortal} style={{ display: 'flex', gap& '10px' }}><input value={portalForm.name} onChange={e => setPortalForm({...portalForm, name: e.target.value})} placeholder="Portal Name" style={styles.input} required /><input type="number" value={portalForm.balance} onChange={e => setPortalForm({...portalForm, balance: e.target.value})} placeholder="Balance" style={styles.input} /><button type="submit" style={styles.btnPrimary}>Add</button></form></div><div style={styles.card}><h3>Recharge Portal</h3><form onSubmit={handleRecharge}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px' }}><select name="portal" style={styles.input} required>{data.portals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><input type="number" step="0.01" name="amt" placeholder="Amount" style={styles.input} required /><input type="date" name="date" defaultValue={today} style={styles.input} required /><select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select><button type="submit" style={styles.btnPrimary}>Recharge</button></div></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Balance</th></tr></thead><tbody>{data.portals.map(p => <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{p.name}</td><td style={{ padding: '12px', fontWeight: 'bold', color: (p.current_balance || 0) < 0 ? '#EF4444' : '#059669' }}>{(p.current_balance || 0).toFixed(2)}</td></tr>)}</tbody></table></div>);

  if (page === 'bank') return (<div><h2>{tr.bank}</h2><div style={styles.card}><h3>Fund Transfer</h3><form onSubmit={handleTransfer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}><div><label style={styles.label}>From</label><select value={transferForm.from} onChange={e => setTransferForm({...transferForm, from: e.target.value})} style={styles.input}><option>Cash</option><option>Bank</option><option>Investor</option></select></div><div><label style={styles.label}>To</label><select value={transferForm.to} onChange={e => setTransferForm({...transferForm, to: e.target.value})} style={styles.input}><option>Bank</option><option>Cash</option><option>Investor</option></select></div><div><label style={styles.label}>Amount</label><input type="number" step="0.01" value={transferForm.amount} onChange={e => setTransferForm({...transferForm, amount: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Date</label><input type="date" value={transferForm.date} onChange={e => setTransferForm({...transferForm, date: e.target.value})} style={styles.input} required /></div><button type="submit" style={styles.btnPrimary}>Transfer</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px', textAlign: 'left' }}>Type</th><th style={{ padding: '12px', textAlign: 'left' }}>Desc</th><th style={{ padding: '12px', textAlign: 'left' }}>Amount</th></tr></thead><tbody>{data.cashbook.slice(0, 20).map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.trans_date}</td><td style={{ padding: '12px' }}>{c.type}</td><td style={{ padding: '12px' }}>{c.description}</td><td style={{ padding: '12px', color: c.type.includes('In') ? '#059669' : '#EF4444', fontWeight: 'bold' }}>{(c.amount || 0).toFixed(2)}</td></tr>)}</tbody></table></div>);

  if (page === 'invest') return (<div><h2>{tr.invest}</h2><div style={styles.card}><form onSubmit={handleAddInvestment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}><div><label style={styles.label}>Investor Name</label><input value={investForm.name} onChange={e => setInvestForm({...investForm, name: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Amount</label><input type="number" step="0.01" value={investForm.amount} onChange={e => setInvestForm({...investForm, amount: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Date</label><input type="date" value={investForm.date} onChange={e => setInvestForm({...investForm, date: e.target.value})} style%: styles.input} required /></div><div><label style={styles.label}>Mode</label><select value={investForm.mode} onChange={e => setInvestForm({...investForm, mode: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option></select></div><button type="submit" style={styles.btnPrimary}>Add</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Amount</th><th style={{ padding: '12px' }}>Date</th></tr></thead><tbody>{data.investments.map(i => <tr key={i.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ paddingA padding: '12px' }}>{i.investor_name}</td><td style={{ padding: '12px' }}>{(i.amount || 0).toFixed(2)}</td><td style={{ padding: '12px' }}>{i.invest_date}</td></tr>)}</tbody></table></div>);

  if (page === 'hr') return (
    <div>
      <h2>{tr.hr}</h2>
      <div style={styles.card}><h3>Add Employee</h3><form onSubmit={handleAddEditEmp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px' }}><input value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><input type="number" step="0.01" value={empForm.salary} onChange={e => setEmpForm({...empForm, salary: e.target.value})} placeholder="Salary" style={styles.input} /><button type="submit" style={styles.btnPrimary}>{editEmpId ? 'Update' : 'Add'}</button></form></div>
      
      <div style={styles.card}><h3>Pay Salary</h3><form onSubmit={handlePaySalary} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px' }}><select name="emp" style={styles.input} required>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select><input type="number" step="0.01" name="amt" placeholder="Amount" style={styles.input} required /><select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select><button type="submit" style={styles.btnPrimary}>Pay</button></form></div>

      {/* DYNAMIC EXPENSE FORM (COMPLETED) */}
      <div style={styles.card}>
        <h3>Add Office Expense</h3>
        <form onSubmit={handleAddExpense} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
          <div><label style={styles.label}>Vendor Name</label><input value={expForm.vendor_name} onChange={e => setExpForm({...expForm, vendor_name: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Vendor VAT</label><input value={expForm.vendor_vat} onChange={e => setExpForm({...expForm, vendor_vat: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Date</label><input type="date" value={expForm.expense_date} onChange={e => setExpForm({...expForm, expense_date: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Payment Mode</label><select value={expForm.payment_mode} onChange={e => setExpForm({...expForm, payment_mode: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option></select></div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={styles.label}>Expense Items</label>
            {expForm.items.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', marginBottom: '10px' }}>
                <input value={item.name} onChange={e => handleExpItemChange(index, 'name', e.target.value)} placeholder="Item Name" style={styles.input} required />
                <input type="number" value={item.qty} onChange={e => handleExpItemChange(index, 'qty', e.target.value)} placeholder="Qty" style={styles.input} required />
                <input type="number" step="0.01" value={item.price} onChange={e => handleExpItemChange(index, 'price', e.target.value)} placeholder="Price" style={styles.input} required />
                <button type="button" onClick={() => handleRemoveExpItem(index)} style={styles.btnDanger}>X</button>
              </div>
            ))}
            <button type="button" onClick={handleAddExpItem} style={{...styles.btnWarning, width: 'auto'}}>+ Add Item</button>
          </div>

          <div><label style={styles.label}>Tax Rate (%)</label><input type="number" value={expForm.taxRate} onChange={e => setExpForm({...expForm, taxRate: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Grand Total</label><input type="text" value={expGrandTotalAxpGrandTotal.toFixed(2)} readOnly style={{...styles.input, background: '#f1f5f9', fontWeight: 'bold'}} /></div>
          <div style={{ gridColumn: '1 / -1' }}><label style={styles.label}>Description</label><input value={expForm.desc} onChange={e => setExpForm({...expForm, desc: e.target.value})} style={styles.input} /></div>
          <button type="submit" style={{...styles.btnPrimary, gridColumn: '1 / -1'}}>Add Expense</button>
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Employee</th><th style={{ padding: '12px' }}>Salary</th><th style={{ padding: '12px' }}>Actions</th></tr></thead><tbody>{data.employees.map(e => <tr key={e.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{e.name}</td><td style={{ padding: '12px' }}>{e.salary}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditEmp(e)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('employees', e.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Del</button></td></tr>)}</tbody></table>
    </div>
  );

  if (page === 'settings') return (
    <div>
      <h2>{tr.settings}</h2>
      <div style={styles.card}>
        <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div><label style={styles.label}>Company Name (EN)</label><input value={setForm.company_name_en} onChange={e => setSetForm({...setForm, company_name_en: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Company Name (AR)</label><input value={setForm.company_name_ar} onChange={e => setSetForm({...setForm, company_name_ar: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>VAT No</label><input value={setForm.vat_no} onChange={e =>+ setSetForm({...setForm, vat_no: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>CR No</label><input value={setForm.cr_no} onChange={e => setSetForm({...setForm, cr_no: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Phone</label><input value={setForm.phone} onChange={e => setSetForm({...setForm, phone: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Address (AR)</label><input value={setForm.address_ar} onChange={e => setSetForm({...setForm, address_ar: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Invoice Footer</label><input value={setForm.invoice_footer} onChange={e => setSetForm({...setForm, invoice_footer: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>Logo</label><input type="file" accept="image/*" onChange={handleLogoUpload} style={styles.input} /></div>
          <button type="submit" style={{...styles.btnPrimary, gridColumn: '1 / -1'}}>Save Settings</button>
        </form>
      </div>
    </div>
  );

  if (page === 'users') return (
    <div>
      <h2>{tr.users}</h2>
      <div style={styles.card}>
        <form onSubmit={editUserId ? handleUpdateUser : handleAddUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px' }}>
          <input value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} placeholder="Email" style={styles.input} required />
          <input value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} placeholder="Username" style={styles.input} required />
          <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} style={styles.input}><option>Sales</option><option>Accountant</option><option>Admin</option></select>
          <button type="submit" style={styles.btnPrimary}>{editUserId ? 'Update' : 'Add'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Email</th><th style={{ padding: '12px' }}>Role</th><th style={{ padding: '12px' }}>Actions</th></tr></thead><tbody>{data.appUsers.map(u => <tr key={u.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{u.email}</td><td style={{ padding: '12px' }}>{u.role}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditUser(u)} style={styles.btnWarning}>Edit</button></td></tr>)}</tbody></table>
    </div>
  );

  return <div>Select a page</div>;
}
