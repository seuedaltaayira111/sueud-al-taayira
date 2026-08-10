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

export default function ERPViewsCore(props) {
  const { page, data, tr, today, invForm, setInvForm, handleCreateInvoice, downloadPDF, printInvoice, exportToExcel, search, setSearch, payFilter, setPayFilter, handleEditInvoice, handleDeleteInvoice, openRefundModal, editInvId, openPreview, openSettleModal, handleQuickSettle, handleAddEditCust, custForm, setCustForm, editCustId, handleAddEditCorp, corpForm, setCorpForm, editCorpId, handleAddEditCred, creditorForm, setCreditorForm, editCredId, handleEditCust, handleEditCorp, handleEditCred, handleDelete } = props;

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
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'fadeIn 1s ease-in-out' }}>
          <h1 style={{ margin: 0, color: '#1E3A8A', fontSize: '32px' }}>{s.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <h2 style={{ margin: '5px 0', color: '#D97706', fontSize: '24px' }}>{s.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
          <p style={{ color: '#555', fontSize: '14px' }}>{s.address_ar || ''} | {s.phone || ''}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{...styles.card, borderLeft: '5px solid #1E3A8A'}}><h3>Total Sales</h3><h2>{tSales.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #059669'}}><h3>Total Profit</h3><h2>{tProfit.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #EF4444'}}><h3>Outstanding</h3><h2>{totalOutstanding.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #D97706'}}><h3>Cash Balance</h3><h2>{cashBal.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #2563EB'}}><h3>Bank Balance</h3><h2>{bankBal.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #dc2626'}}><h3 style={{ color: '#dc2626' }}>Low Portal Alerts</h3>{lowBalPortals.length === 0 ? <p style={{fontSize: '14px', color: '#059669'}}>All portals are healthy.</p> : lowBalPortals.map(p => <p key={p.id} style={{fontSize: '14px', margin: '5px 0', color: '#dc2626'}}>{p.name} - {p.current_balance.toFixed(2)} SAR</p>)}</div>
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
          <tbody>{creditCustomers.length === 0 ? <tr><td colSpan="3" style={{padding: '20px', textAlign: 'center'}}>No credit balances available.</td></tr> : creditCustomers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td><td style={{ padding: '12px', color: '#059669', fontWeight: 'bold' }}>{(c.store_credit || 0).toFixed(2)}</td></tr>)}</tbody>
        </table>
      </div>
    );
  }

  if (page === 'create') return (
    <div style={styles.card}>
      <h2>{editInvId ? 'Edit Invoice' : tr.create}</h2>
      <form onSubmit={handleCreateInvoice}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {invForm.payment !== 'Credit Balance' && (<div><label style={styles.label}>Customer Type</label><select value={invForm.custType} onChange={e => setInvForm({...invForm, custType: e.target.value})} style={styles.input}><option>Individual</option><option>Corporate</option></select></div>)}
          {invForm.payment !== 'Credit Balance' && invForm.custType === 'Individual' ? (
            <><div><label style={styles.label}>Select Customer</label><select value={invForm.custId} onChange={e => setInvForm({...invForm, custId: e.target.value})} style={styles.input}><option value="new">New Customer</option>{data.customers.map(c => <option key={c.id} value={c.id}>{c.name} (Credit: {c.store_credit || 0})</option>)}</select></div>{invForm.custId === 'new' && (<><div><label style={styles.label}>Customer Name</label><input value={invForm.custName} onChange={e => setInvForm({...invForm, custName: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Customer Phone</label><input value={invForm.custPhone} onChange={e => setInvForm({...invForm, custPhone: e.target.value})} style={styles.input} /></div></>)}</>
          ) : invForm.payment !== 'Credit Balance' && invForm.custType === 'Corporate' ? (
            <><div><label style={styles.label}>Select Corporate</label><select value={invForm.corpId} onChange={e => setInvForm({...invForm, corpId: e.target.value})} style={styles.input}><option value="new">New Company</option>{data.corporates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>{invForm.corpId === 'new' && (<><div><label style={styles.label}>Company Name</label><input value={invForm.corpName} onChange={e => setInvForm({...invForm, corpName: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>VAT No</label><input value={invForm.corpVat} onChange={e => setInvForm({...invForm, corpVat: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>Phone</label><input value={invForm.corpPhone} onChange={e => setInvForm({...invForm, corpPhone: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>Address</label><input value={invForm.corpAddress} onChange={e => setInvForm({...invForm, corpAddress: e.target.value})} style={styles.input} /></div></>)}</>
          ) : null}
          <div style={{ gridColumn: '1 / -1' }}><label style={styles.label}>Passengers</label>{invForm.passengers.map((p, i) => (<div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><input value={p} onChange={e => { const arr = [...invForm.passengers]; arr[i] = e.target.value; setInvForm({...invForm, passengers: arr}); }} placeholder={`Passenger ${i + 1}`} style={styles.input} required />{invForm.passengers.length > 1 && <button type="button" onClick={() => setInvForm({...invForm, passengers: invForm.passengers.filter((_, idx) => idx !== i)})} style={{...styles.btnDanger, width: 'auto'}}>X</button>}</div>))}<button type="button" onClick={() => setInvForm({...invForm, passengers: [...invForm.passengers, '']})} style={{...styles.btnWarning, width: 'auto'}}>+ Add Passenger</button></div>
          <div><label style={styles.label}>Portal</label><select value={invForm.portalId} onChange={e => setInvForm({...invForm, portalId: e.target.value})} style={styles.input} required><option value="">Select Portal</option>{data.portals.map(p => <option key={p.id} value={p.id}>{p.name} (Bal: {(p.current_balance || 0).toFixed(2)})</option>)}</select></div>
          <div><label style={styles.label}>Service</label><select value={invForm.service} onChange={e => setInvForm({...invForm, service: e.target.value})} style={styles.input}><option>Flight Ticket</option><option>Hotel</option><option>Tour Package</option><option>Visit Visa</option><option>Umrah Visa</option><option>New Service</option></select></div>
          {invForm.service === 'Flight Ticket' && (<><div><label style={styles.label}>Flight Type</label><select value={invForm.flightType} onChange={e => { const ft = e.target.value; setInvForm({...invForm, flightType: ft, taxRate: ft === 'International' ? '0' : '15'}); }} style={styles.input}><option>Domestic</option><option>International</option></select></div><div><label style={styles.label}>Airline</label><input value={invForm.airline} onChange={e => setInvForm({...invForm, airline: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Sector</label><input value={invForm.flightSector} onChange={e => setInvForm({...invForm, flightSector: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>PNR</label><input value={invForm.pnr} onChange={e => setInvForm({...invForm, pnr: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>Ticket No</label><input value={invForm.ticketNo} onChange={e => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.input} /></div></>)}
          {invForm.service === 'Hotel' && (<><div><label style={styles.label}>Hotel Name</label><input value={invForm.hotelName} onChange={e => setInvForm({...invForm, hotelName: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>Check In</label><input type="date" value={invForm.checkIn} onChange={e => setInvForm({...invForm, checkIn: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>Check Out</label><input type="date" value={invForm.checkOut} onChange={e => setInvForm({...invForm, checkOut: e.target.value})} style={styles.input} /></div></>)}
          {invForm.service === 'New Service' && (<div><label style={styles.label}>Service Name</label><input value={invForm.serviceName} onChange={e => setInvForm({...invForm, serviceName: e.target.value})} style={styles.input} required /></div>)}
          <div><label style={styles.label}>Qty</label><input type="number" value={invForm.qty} onChange={e => setInvForm({...invForm, qty: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Cost</label><input type="number" step="0.01" value={invForm.cost} onChange={e => setInvForm({...invForm, cost: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Sell</label><input type="number" step="0.01" value={invForm.sell} onChange={e => setInvForm({...invForm, sell: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Discount</label><input type="number" step="0.01" value={invForm.discount} onChange={e => setInvForm({...invForm, discount: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>VAT Rate</label><select value={invForm.taxRate} onChange={e => setInvForm({...invForm, taxRate: e.target.value})} style={styles.input}><option value="15">15% VAT</option><option value="0">0% VAT (Exempt)</option></select></div>
          <div><label style={styles.label}>Invoice Date</label><input type="date" value={invForm.invoiceDate} onChange={e => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>Journey Type</label><select value={invForm.flightJourney} onChange={e => setInvForm({...invForm, flightJourney: e.target.value})} style={styles.input}><option>Single</option><option>Round Trip</option><option>Multi-city</option></select></div>
          <div><label style={styles.label}>Fare Type</label><select value={invForm.refundable} onChange={e => setInvForm({...invForm, refundable: e.target.value})} style={styles.input}><option>Refundable</option><option>Non-Refundable</option></select></div>
          <div><label style={styles.label}>Booking Type</label><select value={invForm.bookingType} onChange={e => setInvForm({...invForm, bookingType: e.target.value, linkedInvId: ''})} style={styles.input}><option>New Booking</option><option>Reissue</option><option>Extra Luggage</option><option>Previous Booking</option></select></div>
          {invForm.bookingType === 'Previous Booking' && (<div><label style={styles.label}>Select Previous Booking</label><select value={invForm.linkedInvId} onChange={e => { const linkedInv = data.invoices.find(i => i.id === e.target.value); setInvForm({...invForm, linkedInvId: e.target.value, useCredit: linkedInv?.refund_customer || 0}); }} style={styles.input} required><option value="">Select Old Invoice</option>{data.invoices.filter(i => i.invoice_no.startsWith('REF-') || (i.refund_customer > 0)).map(i => <option key={i.id} value={i.id}>{i.invoice_no} - {i.customers?.name} (Refund: {i.refund_customer || 0})</option>)}</select></div>)}
          <div><label style={styles.label}>Sales Person</label><select value={invForm.employeeId} onChange={e => setInvForm({...invForm, employeeId: e.target.value})} style={styles.input} required><option value="">Select Sales Person</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
          <div><label style={styles.label}>Payment Method</label><select value={invForm.payment} onChange={e => setInvForm({...invForm, payment: e.target.value, useCredit: 0, creditCustId: ''})} style={styles.input}><option>Cash</option><option>Bank Transfer</option><option>Credit</option><option>Credit Balance</option><option>Tabby</option><option>Tamara</option></select></div>
          {invForm.payment === 'Credit Balance' && (<><div><label style={styles.label}>Select Customer (Credit Available)</label><select value={invForm.creditCustId} onChange={e => { const c = data.customers.find(x => x.id === e.target.value); setInvForm({...invForm, creditCustId: e.target.value, useCredit: c?.store_credit || 0}); }} style={styles.input} required><option value="">Select Customer</option>{data.customers.filter(c => (c.store_credit || 0) > 0).map(c => <option key={c.id} value={c.id}>{c.name} (Avl: {(c.store_credit || 0).toFixed(2)})</option>)}</select></div><div><label style={styles.label}>Use Credit Amount</label><input type="number" step="0.01" value={invForm.useCredit} onChange={e => setInvForm({...invForm, useCredit: e.target.value})} style={styles.input} required /></div></>)}
          <div><label style={styles.label}>Paid Amount (Cash/Bank)</label><input type="number" step="0.01" value={invForm.paid} onChange={e => setInvForm({...invForm, paid: e.target.value})} style={styles.input} required /></div>
          {invForm.payment === 'Credit' && (<><div><label style={styles.label}>Select Creditor</label><select value={invForm.creditorId} onChange={e => setInvForm({...invForm, creditorId: e.target.value})} style={styles.input} required><option value="">Select Creditor</option>{data.creditors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label style={styles.label}>Credit Due Date</label><input type="date" value={invForm.creditDueDate} onChange={e => setInvForm({...invForm, creditDueDate: e.target.value})} style={styles.input} required /></div></>)}
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
    const filteredData = allData.filter(inv => (
