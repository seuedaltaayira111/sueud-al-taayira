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
    search, setSearch, tblPage, setTblPage, payFilter, setPayFilter,
    handleAddEditCust, custForm, setCustForm, handleEditCust, editCustId,
    handleAddEditCorp, corpForm, setCorpForm, handleEditCorp, editCorpId,
    handleAddEditCred, creditorForm, setCreditorForm, handleEditCred, editCredId,
    handleAddEditVend, vendorForm, setVendorForm, handleEditVend, editVendId,
    handleAddEditPkg, pkgForm, setPkgForm, handleEditPkg, editPkgId,
    handleAddEditBrn, brnForm, setBrnForm, handleEditBrn, editBrnId,
    handleAddEditEmp, empForm, setEmpForm, handleEditEmp, editEmpId,
    handleAddEditSrv, srvForm, setSrvForm, handleEditSrv, editSrvId,
    handlePaySalary, handleAddExpense,
    handleAddPortal, portalForm, setPortalForm,
    handleAddInvestment, investForm, setInvestForm,
    handleRecharge, handleTransfer, transferForm, setTransferForm,
    handleAddUser, userForm, setUserForm,
    handleSaveSettings, handleLogoUpload, setForm, setSetForm,
    repDate, setRepDate, reportTab, setReportTab, statementTab, setStatementTab,
    handleDelete, filterData
  } = props;

  if (page === 'dashboard') {
    const activeInv = data.invoices.filter(i => !i.invoice_no.startsWith('REF-'));
    const tSales = activeInv.reduce((s,i) => s + i.total, 0);
    const tProfit = activeInv.reduce((s,i) => s + i.profit, 0);
    const cashBal = data.cashbook.filter(c => c.type === 'Cash-In').reduce((s,c) => s + c.amount, 0) - data.cashbook.filter(c => c.type === 'Cash-Out').reduce((s,c) => s + c.amount, 0);
    const bankBal = data.cashbook.filter(c => c.type === 'Bank-In').reduce((s,c) => s + c.amount, 0) - data.cashbook.filter(c => c.type === 'Bank-Out').reduce((s,c) => s + c.amount, 0);
    return (
      <div>
        <h2>{tr.dash}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
          <div style={{...styles.card, borderLeft: '5px solid #1E3A8A'}}><h3>Total Sales</h3><h2>{tSales.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #059669'}}><h3>Total Profit</h3><h2>{tProfit.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #D97706'}}><h3>Cash Balance</h3><h2>{cashBal.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #EF4444'}}><h3>Bank Balance</h3><h2>{bankBal.toFixed(2)} SAR</h2></div>
        </div>
      </div>
    );
  }

  if (page === 'create') return (
    <div style={styles.card}>
      <h2>{tr.create}</h2>
      <form onSubmit={handleCreateInvoice}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={styles.label}>Customer Type</label>
            <select value={invForm.custType} onChange={e => setInvForm({...invForm, custType: e.target.value})} style={styles.input}>
              <option>Individual</option><option>Corporate</option>
            </select>
          </div>
          {invForm.custType === 'Individual' ? (
            <>
              <div>
                <label style={styles.label}>Select Customer</label>
                <select value={invForm.custId} onChange={e => setInvForm({...invForm, custId: e.target.value})} style={styles.input}>
                  <option value="new">New Customer</option>
                  {data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {invForm.custId === 'new' && (
                <>
                  <div><label style={styles.label}>Customer Name</label><input value={invForm.custName} onChange={e => setInvForm({...invForm, custName: e.target.value})} style={styles.input} required /></div>
                  <div><label style={styles.label}>Customer Phone</label><input value={invForm.custPhone} onChange={e => setInvForm({...invForm, custPhone: e.target.value})} style={styles.input} /></div>
                </>
              )}
            </>
          ) : (
            <>
              <div>
                <label style={styles.label}>Select Corporate</label>
                <select value={invForm.corpId} onChange={e => setInvForm({...invForm, corpId: e.target.value})} style={styles.input}>
                  <option value="new">New Company</option>
                  {data.corporates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {invForm.corpId === 'new' && (
                <>
                  <div><label style={styles.label}>Company Name</label><input value={invForm.corpName} onChange={e => setInvForm({...invForm, corpName: e.target.value})} style={styles.input} required /></div>
                  <div><label style={styles.label}>VAT No</label><input value={invForm.corpVat} onChange={e => setInvForm({...invForm, corpVat: e.target.value})} style={styles.input} /></div>
                  <div><label style={styles.label}>Phone</label><input value={invForm.corpPhone} onChange={e => setInvForm({...invForm, corpPhone: e.target.value})} style={styles.input} /></div>
                  <div><label style={styles.label}>Address</label><input value={invForm.corpAddress} onChange={e => setInvForm({...invForm, corpAddress: e.target.value})} style={styles.input} /></div>
                </>
              )}
            </>
          )}
          
          <div>
            <label style={styles.label}>Portal</label>
            <select value={invForm.portalId} onChange={e => setInvForm({...invForm, portalId: e.target.value})} style={styles.input} required>
              <option value="">Select Portal</option>
              {data.portals.map(p => <option key={p.id} value={p.id}>{p.name} (Bal: {p.current_balance.toFixed(2)})</option>)}
            </select>
          </div>

          <div><label style={styles.label}>Service</label><select value={invForm.service} onChange={e => setInvForm({...invForm, service: e.target.value})} style={styles.input}><option>Flight Ticket</option><option>Hotel</option><option>Visa</option><option>Tour Package</option></select></div>
          
          {invForm.service === 'Flight Ticket' && (
            <>
              <div><label style={styles.label}>Airline</label><input value={invForm.airline} onChange={e => setInvForm({...invForm, airline: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>Sector</label><input value={invForm.flightSector} onChange={e => setInvForm({...invForm, flightSector: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>PNR</label><input value={invForm.pnr} onChange={e => setInvForm({...invForm, pnr: e.target.value})} style={styles.input} /></div>
              <div><label style={styles.label}>Ticket No</label><input value={invForm.ticketNo} onChange={e => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.input} /></div>
            </>
          )}

          <div><label style={styles.label}>Qty</label><input type="number" value={invForm.qty} onChange={e => setInvForm({...invForm, qty: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Cost</label><input type="number" step="0.01" value={invForm.cost} onChange={e => setInvForm({...invForm, cost: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Sell</label><input type="number" step="0.01" value={invForm.sell} onChange={e => setInvForm({...invForm, sell: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Discount</label><input type="number" step="0.01" value={invForm.discount} onChange={e => setInvForm({...invForm, discount: e.target.value})} style={styles.input} /></div>
          
          <div><label style={styles.label}>Payment Method</label><select value={invForm.payment} onChange={e => setInvForm({...invForm, payment: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option><option>Credit</option><option>Tabby</option><option>Tamara</option></select></div>
          <div><label style={styles.label}>Paid Amount</label><input type="number" step="0.01" value={invForm.paid} onChange={e => setInvForm({...invForm, paid: e.target.value})} style={styles.input} required /></div>
        </div>
        <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>Generate Invoice</button>
      </form>
    </div>
  );

  if (page === 'list' || page === 'refunds') {
    const isInvoices = page === 'list';
    const allData = isInvoices ? data.invoices.filter(i => !i.invoice_no.startsWith('REF-')) : data.invoices.filter(i => i.invoice_no.startsWith('REF-'));
    const filteredData = allData.filter(inv => 
      (payFilter === 'All' || inv.payment_method === payFilter) &&
      (inv.invoice_no.toLowerCase().includes(search.toLowerCase()) || inv.customers?.name.toLowerCase().includes(search.toLowerCase()) || inv.corporates?.name.toLowerCase().includes(search.toLowerCase()))
    );
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>{isInvoices ? tr.list : tr.refunds}</h2>
          <button onClick={() => exportToExcel(filteredData.map(i => ({ Inv: i.invoice_no, Customer: i.customers?.name || i.corporates?.name, Date: i.invoice_date, Total: i.total, Due: i.due_amount })), isInvoices ? 'Invoices' : 'Refunds')} style={styles.btnSuccess}>{tr.download_excel}</button>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input placeholder={tr.search} value={search} onChange={e => setSearch(e.target.value)} style={styles.input} />
          <select value={payFilter} onChange={e => setPayFilter(e.target.value)} style={{...styles.input, maxWidth: '200px'}}>
            <option>All</option><option>Cash</option><option>Bank Transfer</option><option>Credit</option>
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#1E3A8A', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Inv No</th><th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Total</th><th style={{ padding: '12px', textAlign: 'left' }}>Due</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, 10).map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '12px' }}>{inv.invoice_no}</td><td style={{ padding: '12px' }}>{inv.customers?.name || inv.corporates?.name}</td>
                <td style={{ padding: '12px' }}>{inv.total.toFixed(2)}</td>
                <td style={{ padding: '12px', color: inv.due_amount > 0 ? '#EF4444' : '#059669', fontWeight: 'bold' }}>{inv.due_amount.toFixed(2)}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => downloadPDF(inv, 'en')} style={{ ...styles.btnPrimary, padding: '5px 8px', width: 'auto', fontSize: '11px' }}>PDF EN</button>
                    <button onClick={() => downloadPDF(inv, 'ar')} style={{ ...styles.btnPrimary, padding: '5px 8px', width: 'auto', fontSize: '11px' }}>PDF AR</button>
                    <button onClick={() => printInvoice(inv, 'en')} style={{ ...styles.btnWarning, padding: '5px 8px', fontSize: '11px' }}>Print</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (page === 'customers') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.customers}</h2><button onClick={() => exportToExcel(data.customers, 'Customers')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
      <div style={styles.card}>
        <form onSubmit={handleAddEditCust} style={{ display: 'flex', gap: '10px' }}>
          <input value={custForm.name} onChange={e => setCustForm({...custForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={custForm.phone} onChange={e => setCustForm({...custForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>{editCustId ? 'Update' : 'Add'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Phone</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
        <tbody>{data.customers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditCust(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('customers', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'corporates') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.corporates}</h2><button onClick={() => exportToExcel(data.corporates, 'Corporates')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
      <div style={styles.card}>
        <form onSubmit={handleAddEditCorp} style={{ display: 'flex', gap: '10px' }}>
          <input value={corpForm.name} onChange={e => setCorpForm({...corpForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={corpForm.vat_no} onChange={e => setCorpForm({...corpForm, vat_no: e.target.value})} placeholder="VAT" style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>{editCorpId ? 'Update' : 'Add'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>VAT</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
        <tbody>{data.corporates.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.vat_no}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditCorp(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('corporates', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'creditors') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.creditors}</h2><button onClick={() => exportToExcel(data.creditors, 'Creditors')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
      <div style={styles.card}><form onSubmit={handleAddEditCred} style={{ display: 'flex', gap: '10px' }}><input value={creditorForm.name} onChange={e => setCreditorForm({...creditorForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><button type="submit" style={styles.btnPrimary}>Add</button></form></div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Actions</th></tr></thead><tbody>{data.creditors.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}><button onClick={() => handleDelete('creditors', c.id)} style={styles.btnDanger}>Delete</button></td></tr>)}</tbody></table>
    </div>
  );

  if (page === 'portals') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.portals}</h2><button onClick={() => exportToExcel(data.portals.map(p => ({ Name: p.name, Balance: p.current_balance })), 'Portals')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
      <div style={styles.card}><form onSubmit={handleAddPortal} style={{ display: 'flex', gap: '10px' }}><input value={portalForm.name} onChange={e => setPortalForm({...portalForm, name: e.target.value})} placeholder="Portal Name" style={styles.input} required /><input type="number" value={portalForm.balance} onChange={e => setPortalForm({...portalForm, balance: e.target.value})} placeholder="Balance" style={styles.input} /><button type="submit" style={styles.btnPrimary}>Add</button></form></div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Balance</th></tr></thead><tbody>{data.portals.map(p => <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{p.name}</td><td style={{ padding: '12px', fontWeight: 'bold', color: p.current_balance < 0 ? '#EF4444' : '#059669' }}>{p.current_balance.toFixed(2)}</td></tr>)}</tbody></table>
      <div style={styles.card}><h3>Recharge Portal</h3><form onSubmit={handleRecharge}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}><select name="portal" style={styles.input} required>{data.portals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><input type="number" step="0.01" name="amt" placeholder="Amount" style={styles.input} required /><input type="date" name="date" defaultValue={today} style={styles.input} required /><input name="desc" placeholder="Desc" style={styles.input} /><select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select><button type="submit" style={styles.btnPrimary}>Recharge</button></div></form></div>
    </div>
  );

  if (page === 'vendors') return (
    <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.vendors}</h2><button onClick={() => exportToExcel(data.vendors, 'Vendors')} style={styles.btnSuccess}>{tr.download_excel}</button></div><div style={styles.card}><form onSubmit={handleAddEditVend} style={{ display: 'flex', gap: '10px' }}><input value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><button type="submit" style={styles.btnPrimary}>Add</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Phone</th></tr></thead><tbody>{data.vendors.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td></tr>)}</tbody></table></div>
  );

  if (page === 'packages') return (
    <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.packages}</h2><button onClick={() => exportToExcel(data.packages, 'Packages')} style={styles.btnSuccess}>{tr.download_excel}</button></div><div style={styles.card}><form onSubmit={handleAddEditPkg} style={{ display: 'flex', gap: '10px' }}><input value={pkgForm.name} onChange={e => setPkgForm({...pkgForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><input type="number" value={pkgForm.price} onChange={e => setPkgForm({...pkgForm, price: e.target.value})} placeholder="Price" style={styles.input} required /><button type="submit" style={styles.btnPrimary}>Add</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Price</th></tr></thead><tbody>{data.packages.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.price}</td></tr>)}</tbody></table></div>
  );

  if (page === 'branches') return (
    <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.branches}</h2><button onClick={() => exportToExcel(data.branches, 'Branches')} style={styles.btnSuccess}>{tr.download_excel}</button></div><div style={styles.card}><form onSubmit={handleAddEditBrn} style={{ display: 'flex', gap: '10px' }}><input value={brnForm.name} onChange={e => setBrnForm({...brnForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><input value={brnForm.location} onChange={e => setBrnForm({...brnForm, location: e.target.value})} placeholder="Location" style={styles.input} /><button type="submit" style={styles.btnPrimary}>Add</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Location</th></tr></thead><tbody>{data.branches.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.location}</td></tr>)}</tbody></table></div>
  );

  if (page === 'bank') return (
    <div><h2>{tr.bank}</h2><div style={styles.card}><h3>Fund Transfer</h3><form onSubmit={handleTransfer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}><div><label style={styles.label}>From</label><select value={transferForm.from} onChange={e => setTransferForm({...transferForm, from: e.target.value})} style={styles.input}><option>Cash</option><option>Bank</option></select></div><div><label style={styles.label}>To</label><select value={transferForm.to} onChange={e => setTransferForm({...transferForm, to: e.target.value})} style={styles.input}><option>Bank</option><option>Cash</option></select></div><div><label style={styles.label}>Amount</label><input type="number" step="0.01" value={transferForm.amount} onChange={e => setTransferForm({...transferForm, amount: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Date</label><input type="date" value={transferForm.date} onChange={e => setTransferForm({...transferForm, date: e.target.value})} style={styles.input} required /></div><button type="submit" style={styles.btnPrimary}>Transfer</button></form></div><button onClick={() => exportToExcel(data.cashbook, 'Cashbook')} style={styles.btnSuccess}>{tr.download_excel}</button><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px', textAlign: 'left' }}>Type</th><th style={{ padding: '12px', textAlign: 'left' }}>Desc</th><th style={{ padding: '12px', textAlign: 'left' }}>Amount</th></tr></thead><tbody>{data.cashbook.slice(0, 20).map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.trans_date}</td><td style={{ padding: '12px' }}>{c.type}</td><td style={{ padding: '12px' }}>{c.description}</td><td style={{ padding: '12px', color: c.type.includes('In') ? '#059669' : '#EF4444', fontWeight: 'bold' }}>{c.amount.toFixed(2)}</td></tr>)}</tbody></table></div>
  );

  if (page === 'invest') return (
    <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.invest}</h2><button onClick={() => exportToExcel(data.investments, 'Investments')} style={styles.btnSuccess}>{tr.download_excel}</button></div><div style={styles.card}><form onSubmit={handleAddInvestment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}><div><label style={styles.label}>Name</label><input value={investForm.name} onChange={e => setInvestForm({...investForm, name: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Amount</label><input type="number" step="0.01" value={investForm.amount} onChange={e => setInvestForm({...investForm, amount: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Mode</label><select value={investForm.mode} onChange={e => setInvestForm({...investForm, mode: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option></select></div><button type="submit" style={styles.btnPrimary}>Add</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Amount</th><th style={{ padding: '12px' }}>Date</th></tr></thead><tbody>{data.investments.map(i => <tr key={i.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{i.investor_name}</td><td style={{ padding: '12px' }}>{i.amount.toFixed(2)}</td><td style={{ padding: '12px' }}>{i.invest_date}</td></tr>)}</tbody></table></div>
  );

  if (page === 'hr') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.hr}</h2><button onClick={() => exportToExcel(data.payroll.map(p => ({ Employee: p.employees?.name, Amount: p.amount })), 'Payroll')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
      
      <div style={styles.card}><h3>Add Employee</h3><form onSubmit={handleAddEditEmp} style={{ display: 'flex', gap: '10px' }}><input value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><select value={empForm.role} onChange={e => setEmpForm({...empForm, role: e.target.value})} style={styles.input}><option>Sales</option><option>Accountant</option><option>Manager</option></select><button type="submit" style={styles.btnPrimary}>{editEmpId ? 'Update' : 'Add'}</button></form></div>
      
      <div style={styles.card}><h3>Pay Salary</h3><form onSubmit={handlePaySalary} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px' }}><select name="emp" style={styles.input} required>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select><input type="number" step="0.01" name="amt" placeholder="Amount" style={styles.input} required /><input type="text" name="month" placeholder="Month (e.g. Oct 2023)" style={styles.input} required /><select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select><button type="submit" style={styles.btnPrimary}>Pay</button></form></div>

      <div style={styles.card}><h3>Add Expense</h3><form onSubmit={handleAddExpense} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px' }}><input name="cat" placeholder="Category" style={styles.input} required /><input type="number" step="0.01" name="amt" placeholder="Amount" style={styles.input} required /><input name="desc" placeholder="Desc" style={styles.input} /><select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select><button type="submit" style={styles.btnPrimary}>Add</button></form></div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Role</th><th style={{ padding: '12px' }}>Actions</th></tr></thead><tbody>{data.employees.map(e => <tr key={e.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{e.name}</td><td style={{ padding: '12px' }}>{e.role}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditEmp(e)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('employees', e.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>)}</tbody></table>
    </div>
  );

  if (page === 'users') return (
    <div>
      <h2>{tr.users}</h2>
      <div style={styles.card}>
        <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div><label style={styles.label}>Email</label><input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Username</label><input value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Role</label><select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} style={styles.input}><option>Sales</option><option>Accountant</option><option>Manager</option></select></div>
          <div><label style={styles.label}>Is Admin?</label><select value={userForm.is_admin} onChange={e => setUserForm({...userForm, is_admin: e.target.value === 'true'})} style={styles.input}><option value="false">No</option><option value="true">Yes</option></select></div>
          <button type="submit" style={{...styles.btnPrimary, gridColumn: '1 / -1'}}>Add User</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Email</th><th style={{ padding: '12px' }}>Role</th><th style={{ padding: '12px' }}>Admin</th></tr></thead>
        <tbody>{data.appUsers.map(u => <tr key={u.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{u.email}</td><td style={{ padding: '12px' }}>{u.role}</td><td style={{ padding: '12px' }}>{u.is_admin ? 'Yes' : 'No'}</td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'reports' || page === 'statements') {
    const isReport = page === 'reports';
    const activeTab = isReport ? reportTab : statementTab;
    const setTab = isReport ? setReportTab : setStatementTab;
    
    const getData = () => {
      if (activeTab === 'sales') return filterData(data.invoices.filter(i => !i.invoice_no.startsWith('REF-')), 'invoice_date');
      if (activeTab === 'refunds') return filterData(data.invoices.filter(i => i.invoice_no.startsWith('REF-')), 'invoice_date');
      if (activeTab === 'cashbook') return filterData(data.cashbook, 'trans_date');
      if (activeTab === 'investments') return filterData(data.investments, 'invest_date');
      return [];
    };
    const repData = getData();

    return (
      <div>
        <h2>{isReport ? tr.reports : tr.statements}</h2>
        <div style={styles.card}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => setTab('sales')} style={activeTab === 'sales' ? styles.btnPrimary : styles.btnWarning}>Sales</button>
            <button onClick={() => setTab('refunds')} style={activeTab === 'refunds' ? styles.btnPrimary : styles.btnWarning}>Refunds</button>
            <button onClick={() => setTab('cashbook')} style={activeTab === 'cashbook' ? styles.btnPrimary : styles.btnWarning}>Cashbook</button>
            <button onClick={() => setTab('investments')} style={activeTab === 'investments' ? styles.btnPrimary : styles.btnWarning}>Investments</button>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input type="date" value={repDate.from} onChange={e => setRepDate({...repDate, from: e.target.value})} style={styles.input} />
            <input type="date" value={repDate.to} onChange={e => setRepDate({...repDate, to: e.target.value})} style={styles.input} />
            <button onClick={() => exportToExcel(repData, activeTab)} style={styles.btnSuccess}>Export</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f1f5f9' }}><th style={{ padding: '10px', textAlign: 'left' }}>Date</th><th style={{ padding: '10px', textAlign: 'left' }}>Desc/Inv</th><th style={{ padding: '10px', textAlign: 'left' }}>Amount</th></tr></thead>
            <tbody>
              {repData.slice(0, 20).map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px' }}>{item.invoice_date || item.trans_date || item.invest_date}</td>
                  <td style={{ padding: '10px' }}>{item.invoice_no || item.description}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.total?.toFixed(2) || item.amount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (page === 'audit') return (
    <div>
      <h2>{tr.audit}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>User</th><th style={{ padding: '12px' }}>Action</th><th style={{ padding: '12px' }}>Time</th></tr></thead>
        <tbody>{data.audits.map(a => <tr key={a.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{a.user_email}</td><td style={{ padding: '12px' }}>{a.action}</td><td style={{ padding: '12px' }}>{new Date(a.created_at).toLocaleString()}</td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'settings') return (
    <div style={styles.card}><h2>{tr.settings}</h2><form onSubmit={handleSaveSettings}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <div><label style={styles.label}>Company Name (EN)</label><input value={setForm.company_name_en || ''} onChange={e => setSetForm({...setForm, company_name_en: e.target.value})} style={styles.input} /></div>
      <div><label style={styles.label}>Company Name (AR)</label><input value={setForm.company_name_ar || ''} onChange={e => setSetForm({...setForm, company_name_ar: e.target.value})} style={styles.input} /></div>
      <div><label style={styles.label}>Address (AR)</label><input value={setForm.address_ar || ''} onChange={e => setSetForm({...setForm, address_ar: e.target.value})} style={styles.input} /></div>
      <div><label style={styles.label}>CR No</label><input value={setForm.cr_no || ''} onChange={e => setSetForm({...setForm, cr_no: e.target.value})} style={styles.input} /></div>
      <div><label style={styles.label}>Phone</label><input value={setForm.phone || ''} onChange={e => setSetForm({...setForm, phone: e.target.value})} style={styles.input} /></div>
      <div><label style={styles.label}>License No</label><input value={setForm.license_no || ''} onChange={e => setSetForm({...setForm, license_no: e.target.value})} style={styles.input} /></div>
      <div><label style={styles.label}>Tourist License</label><input value={setForm.tourist_license_no || ''} onChange={e => setSetForm({...setForm, tourist_license_no: e.target.value})} style={styles.input} /></div>
      <div><label style={styles.label}>VAT No</label><input value={setForm.vat_no || ''} onChange={e => setSetForm({...setForm, vat_no: e.target.value})} style={styles.input} /></div>
      <div style={{ gridColumn: '1 / -1' }}><label style={styles.label}>Logo</label><input type="file" accept="image/*" onChange={handleLogoUpload} style={styles.input} />{setForm.logo_url && <img src={setForm.logo_url} style={{ height: 100, marginTop: 10, borderRadius: 8 }} />}</div>
    </div><button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>Save</button></form></div>
  );

  return <div><h2>{page}</h2><p>Section under development.</p></div>;
}
