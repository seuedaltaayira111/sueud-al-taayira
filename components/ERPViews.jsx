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
    handlePaySalary, handleAddExpense,
    handleAddPortal, portalForm, setPortalForm,
    handleAddInvestment, investForm, setInvestForm,
    handleRecharge, handleTransfer, transferForm, setTransferForm,
    handleAddUser, handleEditUser, handleUpdateUser, userForm, setUserForm, editUserId,
    handleSaveSettings, handleLogoUpload, setForm, setSetForm,
    repDate, setRepDate, reportTab, setReportTab, statementTab, setStatementTab,
    handleDelete, filterData,
    handleEditInvoice, handleDeleteInvoice, openRefundModal, editInvId,
    ledgerCustId, setLedgerCustId
  } = props;

  if (page === 'dashboard') {
    const activeInv = data.invoices.filter(i => !i.invoice_no.startsWith('REF-'));
    const tSales = activeInv.reduce((s,i) => s + (i.total || 0), 0);
    const tProfit = activeInv.reduce((s,i) => s + (i.profit || 0), 0);
    const cashBal = data.cashbook.filter(c => c.type === 'Cash-In').reduce((s,c) => s + (c.amount || 0), 0) - data.cashbook.filter(c => c.type === 'Cash-Out').reduce((s,c) => s + (c.amount || 0), 0);
    const bankBal = data.cashbook.filter(c => c.type === 'Bank-In').reduce((s,c) => s + (c.amount || 0), 0) - data.cashbook.filter(c => c.type === 'Bank-Out').reduce((s,c) => s + (c.amount || 0), 0);
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
            <div>
              <label style={styles.label}>Customer Type</label>
              <select value={invForm.custType} onChange={e => setInvForm({...invForm, custType: e.target.value})} style={styles.input}>
                <option>Individual</option><option>Corporate</option>
              </select>
            </div>
          )}

          {invForm.payment !== 'Credit Balance' && invForm.custType === 'Individual' ? (
            <>
              <div>
                <label style={styles.label}>Select Customer</label>
                <select value={invForm.custId} onChange={e => setInvForm({...invForm, custId: e.target.value})} style={styles.input}>
                  <option value="new">New Customer</option>
                  {data.customers.map(c => <option key={c.id} value={c.id}>{c.name} (Credit: {c.store_credit || 0})</option>)}
                </select>
              </div>
              {invForm.custId === 'new' && (
                <>
                  <div><label style={styles.label}>Customer Name</label><input value={invForm.custName} onChange={e => setInvForm({...invForm, custName: e.target.value})} style={styles.input} required /></div>
                  <div><label style={styles.label}>Customer Phone</label><input value={invForm.custPhone} onChange={e => setInvForm({...invForm, custPhone: e.target.value})} style={styles.input} /></div>
                </>
              )}
            </>
          ) : invForm.payment !== 'Credit Balance' && invForm.custType === 'Corporate' ? (
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
          ) : null}

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={styles.label}>Passengers</label>
            {invForm.passengers.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input value={p} onChange={e => { const arr = [...invForm.passengers]; arr[i] = e.target.value; setInvForm({...invForm, passengers: arr}); }} placeholder={`Passenger ${i + 1}`} style={styles.input} required />
                {invForm.passengers.length > 1 && <button type="button" onClick={() => setInvForm({...invForm, passengers: invForm.passengers.filter((_, idx) => idx !== i)})} style={{...styles.btnDanger, width: 'auto'}}>X</button>}
              </div>
            ))}
            <button type="button" onClick={() => setInvForm({...invForm, passengers: [...invForm.passengers, '']})} style={{...styles.btnWarning, width: 'auto'}}>+ Add Passenger</button>
          </div>

          <div>
            <label style={styles.label}>Portal</label>
            <select value={invForm.portalId} onChange={e => setInvForm({...invForm, portalId: e.target.value})} style={styles.input} required>
              <option value="">Select Portal</option>
              {data.portals.map(p => <option key={p.id} value={p.id}>{p.name} (Bal: {(p.current_balance || 0).toFixed(2)})</option>)}
            </select>
          </div>

          <div>
            <label style={styles.label}>Service</label>
            <select value={invForm.service} onChange={e => setInvForm({...invForm, service: e.target.value})} style={styles.input}>
              <option>Flight Ticket</option>
              <option>Hotel</option>
              <option>Tour Package</option>
              <option>Visit Visa</option>
              <option>Umrah Visa</option>
              <option>New Service</option>
            </select>
          </div>
          
          {invForm.service === 'Flight Ticket' && (
            <>
              <div>
                <label style={styles.label}>Flight Type</label>
                <select value={invForm.flightType} onChange={e => {
                  const ft = e.target.value;
                  setInvForm({...invForm, flightType: ft, taxRate: ft === 'International' ? '0' : '15'});
                }} style={styles.input}>
                  <option>Domestic</option>
                  <option>International</option>
                </select>
              </div>
              <div><label style={styles.label}>Airline</label><input value={invForm.airline} onChange={e => setInvForm({...invForm, airline: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>Sector</label><input value={invForm.flightSector} onChange={e => setInvForm({...invForm, flightSector: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>PNR</label><input value={invForm.pnr} onChange={e => setInvForm({...invForm, pnr: e.target.value})} style={styles.input} /></div>
              <div><label style={styles.label}>Ticket No</label><input value={invForm.ticketNo} onChange={e => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.input} /></div>
            </>
          )}
          {invForm.service === 'Hotel' && (
            <>
              <div><label style={styles.label}>Hotel Name</label><input value={invForm.hotelName} onChange={e => setInvForm({...invForm, hotelName: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>Check In</label><input type="date" value={invForm.checkIn} onChange={e => setInvForm({...invForm, checkIn: e.target.value})} style={styles.input} /></div>
              <div><label style={styles.label}>Check Out</label><input type="date" value={invForm.checkOut} onChange={e => setInvForm({...invForm, checkOut: e.target.value})} style={styles.input} /></div>
            </>
          )}
          {invForm.service === 'New Service' && (
            <div><label style={styles.label}>Service Name</label><input value={invForm.serviceName} onChange={e => setInvForm({...invForm, serviceName: e.target.value})} style={styles.input} required /></div>
          )}

          <div><label style={styles.label}>Qty</label><input type="number" value={invForm.qty} onChange={e => setInvForm({...invForm, qty: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Cost</label><input type="number" step="0.01" value={invForm.cost} onChange={e => setInvForm({...invForm, cost: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Sell</label><input type="number" step="0.01" value={invForm.sell} onChange={e => setInvForm({...invForm, sell: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Discount</label><input type="number" step="0.01" value={invForm.discount} onChange={e => setInvForm({...invForm, discount: e.target.value})} style={styles.input} /></div>
          
          <div>
            <label style={styles.label}>VAT Rate</label>
            <select value={invForm.taxRate} onChange={e => setInvForm({...invForm, taxRate: e.target.value})} style={styles.input}>
              <option value="15">15% VAT</option>
              <option value="0">0% VAT (Exempt)</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Payment Method</label>
            <select value={invForm.payment} onChange={e => setInvForm({...invForm, payment: e.target.value, useCredit: 0, creditCustId: ''})} style={styles.input}>
              <option>Cash</option><option>Bank Transfer</option><option>Credit</option><option>Credit Balance</option><option>Tabby</option><option>Tamara</option>
            </select>
          </div>

          {invForm.payment === 'Credit Balance' && (
            <>
              <div>
                <label style={styles.label}>Select Customer (Credit Available)</label>
                <select 
                  value={invForm.creditCustId} 
                  onChange={e => {
                    const c = data.customers.find(x => x.id === e.target.value);
                    setInvForm({...invForm, creditCustId: e.target.value, useCredit: c?.store_credit || 0});
                  }} 
                  style={styles.input} 
                  required
                >
                  <option value="">Select Customer</option>
                  {data.customers.filter(c => (c.store_credit || 0) > 0).map(c => <option key={c.id} value={c.id}>{c.name} (Avl: {(c.store_credit || 0).toFixed(2)})</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Use Credit Amount</label>
                <input type="number" step="0.01" value={invForm.useCredit} onChange={e => setInvForm({...invForm, useCredit: e.target.value})} style={styles.input} required />
              </div>
            </>
          )}

          <div><label style={styles.label}>Paid Amount (Cash/Bank)</label><input type="number" step="0.01" value={invForm.paid} onChange={e => setInvForm({...invForm, paid: e.target.value})} style={styles.input} required /></div>

          {invForm.payment === 'Credit' && (
            <>
              <div>
                <label style={styles.label}>Select Creditor</label>
                <select value={invForm.creditorId} onChange={e => setInvForm({...invForm, creditorId: e.target.value})} style={styles.input} required>
                  <option value="">Select Creditor</option>
                  {data.creditors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label style={styles.label}>Credit Due Date</label><input type="date" value={invForm.creditDueDate} onChange={e => setInvForm({...invForm, creditDueDate: e.target.value})} style={styles.input} required /></div>
            </>
          )}
          {invForm.payment === 'Tabby' && <div><label style={styles.label}>Tabby Order No</label><input value={invForm.tabbyNo} onChange={e => setInvForm({...invForm, tabbyNo: e.target.value})} style={styles.input} required /></div>}
          {invForm.payment === 'Tamara' && <div><label style={styles.label}>Tamara Order No</label><input value={invForm.tamaraNo} onChange={e => setInvForm({...invForm, tamaraNo: e.target.value})} style={styles.input} required /></div>}
        </div>
        <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>{editInvId ? 'Update Invoice' : 'Generate Invoice'}</button>
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
          <button onClick={() => exportToExcel(filteredData.map(i => ({ Inv: i.invoice_no, Customer: i.customers?.name || i.corporates?.name, Date: i.invoice_date, Total: i.total, Due: i.due_amount, Method: i.payment_method })), isInvoices ? 'Invoices' : 'Refunds')} style={styles.btnSuccess}>{tr.download_excel}</button>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input placeholder={tr.search} value={search} onChange={e => setSearch(e.target.value)} style={styles.input} />
          <select value={payFilter} onChange={e => setPayFilter(e.target.value)} style={{...styles.input, maxWidth: '200px'}}>
            <option>All</option><option>Cash</option><option>Bank Transfer</option><option>Credit</option><option>Credit Balance</option><option>Tabby</option><option>Tamara</option>
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#1E3A8A', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Inv No</th><th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Total</th><th style={{ padding: '12px', textAlign: 'left' }}>Due</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Method</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, 10).map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '12px' }}>{inv.invoice_no}</td>
                <td style={{ padding: '12px' }}>{inv.customers?.name || inv.corporates?.name}</td>
                <td style={{ padding: '12px' }}>{(inv.total || 0).toFixed(2)}</td>
                <td style={{ padding: '12px', color: (inv.due_amount || 0) > 0 ? '#EF4444' : '#059669', fontWeight: 'bold' }}>{(inv.due_amount || 0).toFixed(2)}</td>
                <td style={{ padding: '12px' }}>{inv.payment_method}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <button onClick={() => downloadPDF(inv, 'en')} style={{ ...styles.btnPrimary, padding: '5px 8px', width: 'auto', fontSize: '11px' }}>PDF</button>
                    <button onClick={() => printInvoice(inv, 'ar')} style={{ ...styles.btnWarning, padding: '5px 8px', fontSize: '11px' }}>Print</button>
                    <button onClick={() => handleEditInvoice(inv)} style={{ ...styles.btnWarning, padding: '5px 8px', fontSize: '11px' }}>Edit</button>
                    <button onClick={() => handleDeleteInvoice(inv)} style={{ ...styles.btnDanger, padding: '5px 8px', fontSize: '11px' }}>Delete</button>
                    {isInvoices && (inv.due_amount || 0) > 0 && <button onClick={() => openRefundModal(inv)} style={{ ...styles.btnDanger, padding: '5px 8px', fontSize: '11px' }}>Refund</button>}
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
          <input type="number" step="0.01" value={custForm.store_credit} onChange={e => setCustForm({...custForm, store_credit: e.target.value})} placeholder="Store Credit" style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>{editCustId ? 'Update' : 'Add'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Phone</th><th style={{ padding: '12px' }}>Credit</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
        <tbody>{data.customers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td><td style={{ padding: '12px' }}>{c.store_credit || 0}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditCust(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('customers', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>)}</tbody>
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
          <input value={corpForm.phone} onChange={e => setCorpForm({...corpForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <input value={corpForm.address} onChange={e => setCorpForm({...corpForm, address: e.target.value})} placeholder="Address" style={styles.input} />
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
      <div style={styles.card}><form onSubmit={handleAddEditCred} style={{ display: 'flex', gap: '10px' }}><input value={creditorForm.name} onChange={e => setCreditorForm({...creditorForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><input value={creditorForm.phone} onChange={e => setCreditorForm({...creditorForm, phone: e.target.value})} placeholder="Phone" style={styles.input} /><button type="submit" style={styles.btnPrimary}>{editCredId ? 'Update' : 'Add'}</button></form></div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Actions</th></tr></thead><tbody>{data.creditors.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditCred(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('creditors', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>)}</tbody></table>
    </div>
  );

  if (page === 'portals') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.portals}</h2><button onClick={() => exportToExcel(data.portals.map(p => ({ Name: p.name, Balance: p.current_balance })), 'Portals')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
      
      <div style={styles.card}>
        <h3>Add New Portal</h3>
        <form onSubmit={handleAddPortal} style={{ display: 'flex', gap: '10px' }}>
          <input value={portalForm.name} onChange={e => setPortalForm({...portalForm, name: e.target.value})} placeholder="Portal Name" style={styles.input} required />
          <input type="number" value={portalForm.balance} onChange={e => setPortalForm({...portalForm, balance: e.target.value})} placeholder="Initial Balance" style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>Add</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3>Recharge Portal</h3>
        <form onSubmit={handleRecharge}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px' }}>
            <select name="portal" style={styles.input} required>{data.portals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <input type="number" step="0.01" name="amt" placeholder="Amount" style={styles.input} required />
            <input type="date" name="date" defaultValue={today} style={styles.input} required />
            <input name="desc" placeholder="Desc" style={styles.input} />
            <select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select>
            <button type="submit" style={styles.btnPrimary}>Recharge</button>
          </div>
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Balance</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
        <tbody>{data.portals.map(p => <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{p.name}</td><td style={{ padding: '12px', fontWeight: 'bold', color: (p.current_balance || 0) < 0 ? '#EF4444' : '#059669' }}>{(p.current_balance || 0).toFixed(2)}</td><td style={{ padding: '12px' }}><button onClick={() => handleDelete('portals', p.id)} style={styles.btnDanger}>Delete</button></td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'vendors') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.vendors}</h2><button onClick={() => exportToExcel(data.vendors, 'Vendors')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
      <div style={styles.card}>
        <form onSubmit={handleAddEditVend} style={{ display: 'flex', gap: '10px' }}>
          <input value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={vendorForm.phone} onChange={e => setVendorForm({...vendorForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <input type="number" value={vendorForm.balance} onChange={e => setVendorForm({...vendorForm, balance: e.target.value})} placeholder="Balance" style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>{editVendId ? 'Update' : 'Add'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Phone</th><th style={{ padding: '12px' }}>Balance</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
        <tbody>{data.vendors.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td><td style={{ padding: '12px' }}>{c.balance}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditVend(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('vendors', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'packages') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.packages}</h2><button onClick={() => exportToExcel(data.packages, 'Packages')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
      <div style={styles.card}>
        <form onSubmit={handleAddEditPkg} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input value={pkgForm.name} onChange={e => setPkgForm({...pkgForm, name: e.target.value})} placeholder="Package Name" style={styles.input} required />
          <input type="number" value={pkgForm.price} onChange={e => setPkgForm({...pkgForm, price: e.target.value})} placeholder="Price" style={styles.input} required />
          <input value={pkgForm.duration} onChange={e => setPkgForm({...pkgForm, duration: e.target.value})} placeholder="Duration (e.g. 5 Days / 4 Nights)" style={styles.input} />
          <input value={pkgForm.inclusions} onChange={e => setPkgForm({...pkgForm, inclusions: e.target.value})} placeholder="Inclusions (Hotel, Flights)" style={styles.input} />
          <input value={pkgForm.desc} onChange={e => setPkgForm({...pkgForm, desc: e.target.value})} placeholder="Description" style={{...styles.input, gridColumn: '1 / -1'}} />
          <button type="submit" style={{...styles.btnPrimary, gridColumn: '1 / -1'}}>{editPkgId ? 'Update' : 'Add'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Duration</th><th style={{ padding: '12px' }}>Price</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
        <tbody>{data.packages.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.duration}</td><td style={{ padding: '12px' }}>{c.price}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditPkg(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('packages', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'branches') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.branches}</h2><button onClick={() => exportToExcel(data.branches, 'Branches')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
      <div style={styles.card}>
        <form onSubmit={handleAddEditBrn} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
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
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Location</th><th style={{ padding: '12px' }}>Manager</th><th style={{ padding: '12px' }}>Status</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
        <tbody>{data.branches.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.location}</td><td style={{ padding: '12px' }}>{c.manager}</td><td style={{ padding: '12px' }}>{c.status}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditBrn(c)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('branches', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'bank') return (
    <div>
      <h2>{tr.bank}</h2>
      <div style={styles.card}>
        <h3>Fund Transfer</h3>
        <form onSubmit={handleTransfer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}>
          <div><label style={styles.label}>From</label><select value={transferForm.from} onChange={e => setTransferForm({...transferForm, from: e.target.value})} style={styles.input}><option>Cash</option><option>Bank</option><option>Investor</option></select></div>
          <div><label style={styles.label}>To</label><select value={transferForm.to} onChange={e => setTransferForm({...transferForm, to: e.target.value})} style={styles.input}><option>Bank</option><option>Cash</option><option>Investor</option></select></div>
          <div><label style={styles.label}>Amount</label><input type="number" step="0.01" value={transferForm.amount} onChange={e => setTransferForm({...transferForm, amount: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Date</label><input type="date" value={transferForm.date} onChange={e => setTransferForm({...transferForm, date: e.target.value})} style={styles.input} required /></div>
          <button type="submit" style={styles.btnPrimary}>Transfer</button>
        </form>
      </div>
      <button onClick={() => exportToExcel(data.cashbook, 'Cashbook')} style={styles.btnSuccess}>{tr.download_excel}</button>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Date</th><th style={{ padding: '12px', textAlign: 'left' }}>Type</th><th style={{ padding: '12px', textAlign: 'left' }}>Desc</th><th style={{ padding: '12px', textAlign: 'left' }}>Amount</th><th style={{ padding: '12px', textAlign: 'left' }}>Action</th></tr></thead>
        <tbody>{data.cashbook.slice(0, 20).map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.trans_date}</td><td style={{ padding: '12px' }}>{c.type}</td><td style={{ padding: '12px' }}>{c.description}</td><td style={{ padding: '12px', color: c.type.includes('In') ? '#059669' : '#EF4444', fontWeight: 'bold' }}>{(c.amount || 0).toFixed(2)}</td><td style={{ padding: '12px' }}><button onClick={() => handleDelete('cashbook', c.id)} style={styles.btnDanger}>Delete</button></td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'invest') return (
    <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.invest}</h2><button onClick={() => exportToExcel(data.investments, 'Investments')} style={styles.btnSuccess}>{tr.download_excel}</button></div><div style={styles.card}><form onSubmit={handleAddInvestment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}><div><label style={styles.label}>Name</label><input value={investForm.name} onChange={e => setInvestForm({...investForm, name: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Amount</label><input type="number" step="0.01" value={investForm.amount} onChange={e => setInvestForm({...investForm, amount: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Mode</label><select value={investForm.mode} onChange={e => setInvestForm({...investForm, mode: e.target.value})} style={styles.input}><option>Cash</option><option>Bank Transfer</option></select></div><button type="submit" style={styles.btnPrimary}>Add</button></form></div><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Amount</th><th style={{ padding: '12px' }}>Date</th><th style={{ padding: '12px' }}>Action</th></tr></thead><tbody>{data.investments.map(i => <tr key={i.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{i.investor_name}</td><td style={{ padding: '12px' }}>{(i.amount || 0).toFixed(2)}</td><td style={{ padding: '12px' }}>{i.invest_date}</td><td style={{ padding: '12px' }}><button onClick={() => handleDelete('investments', i.id)} style={styles.btnDanger}>Delete</button></td></tr>)}</tbody></table></div>
  );

  if (page === 'hr') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{tr.hr}</h2><button onClick={() => exportToExcel(data.payroll.map(p => ({ Employee: p.employees?.name, Amount: p.amount })), 'Payroll')} style={styles.btnSuccess}>{tr.download_excel}</button></div>
      
      <div style={styles.card}><h3>Add Employee</h3><form onSubmit={handleAddEditEmp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px' }}><input value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} placeholder="Name" style={styles.input} required /><input value={empForm.phone} onChange={e => setEmpForm({...empForm, phone: e.target.value})} placeholder="Phone" style={styles.input} /><input type="number" step="0.01" value={empForm.salary} onChange={e => setEmpForm({...empForm, salary: e.target.value})} placeholder="Salary" style={styles.input} /><select value={empForm.role} onChange={e => setEmpForm({...empForm, role: e.target.value})} style={styles.input}><option>Sales</option><option>Accountant</option><option>Manager</option></select><button type="submit" style={styles.btnPrimary}>{editEmpId ? 'Update' : 'Add'}</button></form></div>
      
      <div style={styles.card}><h3>Add Service</h3><form onSubmit={handleAddEditSrv} style={{ display: 'flex', gap: '10px' }}><input value={srvForm.name} onChange={e => setSrvForm({...srvForm, name: e.target.value})} placeholder="Service Name" style={styles.input} required /><button type="submit" style={styles.btnPrimary}>{editSrvId ? 'Update' : 'Add'}</button></form></div>

      <div style={styles.card}><h3>Pay Salary</h3><form onSubmit={handlePaySalary} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px' }}><select name="emp" style={styles.input} required>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select><input type="number" step="0.01" name="amt" placeholder="Amount" style={styles.input} required /><input type="text" name="month" placeholder="Month (e.g. Oct 2023)" style={styles.input} required /><select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select><button type="submit" style={styles.btnPrimary}>Pay</button></form></div>

      <div style={styles.card}><h3>Add Expense</h3><form onSubmit={handleAddExpense} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px' }}><input name="cat" placeholder="Category" style={styles.input} required /><input type="number" step="0.01" name="amt" placeholder="Amount" style={styles.input} required /><input name="desc" placeholder="Desc" style={styles.input} /><select name="mode" style={styles.input}><option>Cash</option><option>Bank Transfer</option></select><button type="submit" style={styles.btnPrimary}>Add</button></form></div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Role</th><th style={{ padding: '12px' }}>Salary</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
        <tbody>{data.employees.map(e => <tr key={e.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{e.name}</td><td style={{ padding: '12px' }}>{e.role}</td><td style={{ padding: '12px' }}>{e.salary || 0}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditEmp(e)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('employees', e.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'users') return (
    <div>
      <h2>{tr.users}</h2>
      <div style={styles.card}>
        <h3>{editUserId ? 'Edit User' : 'Add User'}</h3>
        <form onSubmit={editUserId ? handleUpdateUser : handleAddUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div><label style={styles.label}>Email</label><input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Username</label><input value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Role</label><select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} style={styles.input}><option>Sales</option><option>Accountant</option><option>Manager</option></select></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
            <label><input type="checkbox" checked={userForm.is_admin} onChange={e => setUserForm({...userForm, is_admin: e.target.checked})} /> Is Admin</label>
            <label><input type="checkbox" checked={userForm.can_access_invoices} onChange={e => setUserForm({...userForm, can_access_invoices: e.target.checked})} /> Access Invoices</label>
            <label><input type="checkbox" checked={userForm.can_access_bank} onChange={e => setUserForm({...userForm, can_access_bank: e.target.checked})} /> Access Bank</label>
            <label><input type="checkbox" checked={userForm.can_access_hr} onChange={e => setUserForm({...userForm, can_access_hr: e.target.checked})} /> Access HR</label>
            <label><input type="checkbox" checked={userForm.can_access_reports} onChange={e => setUserForm({...userForm, can_access_reports: e.target.checked})} /> Access Reports</label>
            <label><input type="checkbox" checked={userForm.can_access_settings} onChange={e => setUserForm({...userForm, can_access_settings: e.target.checked})} /> Access Settings</label>
          </div>
          <button type="submit" style={{...styles.btnPrimary, gridColumn: '1 / -1'}}>{editUserId ? 'Update User' : 'Add User'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Email</th><th style={{ padding: '12px' }}>Role</th><th style={{ padding: '12px' }}>Admin</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
        <tbody>{data.appUsers.map(u => <tr key={u.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{u.email}</td><td style={{ padding: '12px' }}>{u.role}</td><td style={{ padding: '12px' }}>{u.is_admin ? 'Yes' : 'No'}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditUser(u)} style={styles.btnWarning}>Edit</button><button onClick={() => handleDelete('app_users', u.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>Delete</button></td></tr>)}</tbody>
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
      if (activeTab === 'expenses') return filterData(data.expenses, 'created_at');
      if (activeTab === 'recharges') return filterData(data.recharges, 'recharge_date');
      if (activeTab === 'payroll') return filterData(data.payroll, 'created_at');
      return [];
    };
    
    if (activeTab === 'ledger') {
      const custInvs = data.invoices.filter(i => i.customer_id === ledgerCustId).sort((a,b) => new Date(a.invoice_date) - new Date(b.invoice_date));
      let runningBalance = 0;
      const ledgerData = custInvs.map(inv => {
        if (inv.invoice_no.startsWith('REF-')) {
          runningBalance -= inv.refund_customer || 0;
          return { ...inv, type: 'Refund', amount: inv.refund_customer, balance: runningBalance };
        } else {
          runningBalance += inv.due_amount || 0;
          return { ...inv, type: 'Invoice', amount: inv.total, balance: runningBalance };
        }
      });

      return (
        <div>
          <h2>{isReport ? tr.reports : tr.statements}</h2>
          <div style={styles.card}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button onClick={() => setTab('sales')} style={styles.btnWarning}>Sales</button>
              <button onClick={() => setTab('refunds')} style={styles.btnWarning}>Refunds</button>
              <button onClick={() => setTab('cashbook')} style={styles.btnWarning}>Cashbook</button>
              <button onClick={() => setTab('investments')} style={styles.btnWarning}>Investments</button>
              <button onClick={() => setTab('expenses')} style={styles.btnWarning}>Expenses</button>
              <button onClick={() => setTab('recharges')} style={styles.btnWarning}>Recharges</button>
              <button onClick={() => setTab('payroll')} style={styles.btnWarning}>Payroll</button>
              <button onClick={() => setTab('ledger')} style={styles.btnPrimary}>Customer Ledger</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <select value={ledgerCustId} onChange={e => setLedgerCustId(e.target.value)} style={styles.input}>
                <option value="">Select Customer</option>
                {data.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {ledgerCustId && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f1f5f9' }}><th style={{ padding: '10px', textAlign: 'left' }}>Date</th><th style={{ padding: '10px', textAlign: 'left' }}>Inv No</th><th style={{ padding: '10px', textAlign: 'left' }}>Type</th><th style={{ padding: '10px', textAlign: 'left' }}>Amount</th><th style={{ padding: '10px', textAlign: 'left' }}>Balance Due</th></tr></thead>
                <tbody>
                  {ledgerData.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px' }}>{item.invoice_date}</td>
                      <td style={{ padding: '10px' }}>{item.invoice_no}</td>
                      <td style={{ padding: '10px', color: item.type === 'Refund' ? '#EF4444' : '#059669' }}>{item.type}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{(item.amount || 0).toFixed(2)}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: item.balance > 0 ? '#EF4444' : '#333' }}>{(item.balance || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      );
    }

    const repData = getData();
    const totalAmount = repData.reduce((s, i) => s + (i.total || i.amount || 0), 0);

    return (
      <div>
        <h2>{isReport ? tr.reports : tr.statements}</h2>
        <div style={styles.card}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => setTab('sales')} style={activeTab === 'sales' ? styles.btnPrimary : styles.btnWarning}>Sales</button>
            <button onClick={() => setTab('refunds')} style={activeTab === 'refunds' ? styles.btnPrimary : styles.btnWarning}>Refunds</button>
            <button onClick={() => setTab('cashbook')} style={activeTab === 'cashbook' ? styles.btnPrimary : styles.btnWarning}>Cashbook</button>
            <button onClick={() => setTab('investments')} style={activeTab === 'investments' ? styles.btnPrimary : styles.btnWarning}>Investments</button>
            <button onClick={() => setTab('expenses')} style={activeTab === 'expenses' ? styles.btnPrimary : styles.btnWarning}>Expenses</button>
            <button onClick={() => setTab('recharges')} style={activeTab === 'recharges' ? styles.btnPrimary : styles.btnWarning}>Recharges</button>
            <button onClick={() => setTab('payroll')} style={activeTab === 'payroll' ? styles.btnPrimary : styles.btnWarning}>Payroll</button>
            <button onClick={() => setTab('ledger')} style={activeTab === 'ledger' ? styles.btnPrimary : styles.btnWarning}>Customer Ledger</button>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input type="date" value={repDate.from} onChange={e => setRepDate({...repDate, from: e.target.value})} style={styles.input} />
            <input type="date" value={repDate.to} onChange={e => setRepDate({...repDate, to: e.target.value})} style={styles.input} />
            <button onClick={() => exportToExcel(repData, activeTab)} style={styles.btnSuccess}>Export Excel</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f1f5f9' }}><th style={{ padding: '10px', textAlign: 'left' }}>Date</th><th style={{ padding: '10px', textAlign: 'left' }}>Desc/Inv</th><th style={{ padding: '10px', textAlign: 'left' }}>Amount</th></tr></thead>
            <tbody>
              {repData.slice(0, 20).map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px' }}>{item.invoice_date || item.trans_date || item.invest_date || item.created_at?.split('T')[0]}</td>
                  <td style={{ padding: '10px' }}>{item.invoice_no || item.description || item.category}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{(item.total || item.amount || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#1E3A8A', color: 'white' }}>
                <td colSpan="2" style={{ padding: '12px', textAlign: 'right' }}><b>Total:</b></td>
                <td style={{ padding: '12px' }}><b>{totalAmount.toFixed(2)} SAR</b></td>
              </tr>
            </tfoot>
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
