'use client';

import React from 'react';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }, 
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnInfo: { padding: '8px 12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block', marginTop: '10px' } 
};

export default function ERPViewsCore(props) {
  const { page, data, tr, today, invForm, setInvForm, handleCreateInvoice, handleDownloadPDF, printInvoice, exportToExcel, search, setSearch, payFilter, setPayFilter, handleEditInvoice, handleDeleteInvoice, openRefundModal, editInvId, openPreview, openSettleModal, handleQuickSettle, handleAddEditCust, custForm, setCustForm, editCustId, handleAddEditCorp, corpForm, setCorpForm, editCorpId, handleAddEditCred, creditorForm, setCreditorForm, editCredId, handleEditCust, handleEditCorp, handleEditCred, handleDelete, shareWhatsApp, shareEmail } = props;

  if (page === 'dashboard') {
    const s = data.settings || {};
    const activeInv = data.invoices.filter(i => !i.invoice_no.startsWith('REF-') && i.status !== 'Draft' && i.status !== 'Recurring');
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
          <div style={{...styles.card, borderLeft: '5px solid #1E3A8A'}}><h3 style={{color: '#555'}}>Total Sales</h3><h2 style={{color: '#059669'}}>{tSales.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #059669'}}><h3 style={{color: '#555'}}>Total Profit</h3><h2 style={{color: '#059669'}}>{tProfit.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #EF4444'}}><h3 style={{color: '#555'}}>Outstanding</h3><h2 style={{color: '#EF4444'}}>{totalOutstanding.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #D97706'}}><h3 style={{color: '#555'}}>Cash Balance</h3><h2 style={{color: '#333'}}>{cashBal.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #2563EB'}}><h3 style={{color: '#555'}}>Bank Balance</h3><h2 style={{color: '#333'}}>{bankBal.toFixed(2)} SAR</h2></div>
          <div style={{...styles.card, borderLeft: '5px solid #dc2626'}}><h3 style={{ color: '#dc2626' }}>Low Portal Alerts</h3>{lowBalPortals.length === 0 ? <p style={{fontSize: '14px', color: '#059669'}}>All portals are healthy.</p> : lowBalPortals.map(p => <p key={p.id} style={{fontSize: '14px', margin: '5px 0', color: '#dc2626'}}>{p.name} - {p.current_balance.toFixed(2)} SAR</p>)}</div>
          <div style={{...styles.card, borderLeft: '5px solid #7c3aed'}}><h3 style={{color: '#555'}}>Total Expenses</h3><h2 style={{color: '#EF4444'}}>{tExpenses.toFixed(2)} SAR</h2></div>
        </div>
      </div>
    );
  }

  if (page === 'credit') {
    const creditCustomers = data.customers.filter(c => (c.store_credit || 0) > 0);
    return (
      <div>
        <h2 style={{ color: '#1E3A8A' }}>{tr.credit}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
          <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Customer</th><th style={{ padding: '12px' }}>Phone</th><th style={{ padding: '12px' }}>Available Credit (SAR)</th></tr></thead>
          <tbody>{creditCustomers.length === 0 ? <tr><td colSpan="3" style={{padding: '20px', textAlign: 'center'}}>No credit balances available.</td></tr> : creditCustomers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td><td style={{ padding: '12px', color: '#059669', fontWeight: 'bold' }}>{(c.store_credit || 0).toFixed(2)}</td></tr>)}</tbody>
        </table>
      </div>
    );
  }

  if (page === 'create') return (
    <div style={styles.card}>
      <h2 style={{ color: '#1E3A8A' }}>{editInvId ? tr.editInvoice || 'Edit Invoice' : tr.create}</h2>
      <form onSubmit={handleCreateInvoice}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {invForm.payment !== 'Credit Balance' && (<div><label style={styles.label}>{tr.custType}</label><select value={invForm.custType} onChange={e => setInvForm({...invForm, custType: e.target.value})} style={styles.input}><option>{tr.individual}</option><option>{tr.corporate}</option></select></div>)}
          {invForm.payment !== 'Credit Balance' && invForm.custType === 'Individual' ? (
            <><div><label style={styles.label}>{tr.selectCustomer}</label><select value={invForm.custId} onChange={e => setInvForm({...invForm, custId: e.target.value})} style={styles.input}><option value="new">{tr.newCustomer}</option>{data.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({tr.credit}: {c.store_credit || 0})</option>)}</select></div>{invForm.custId === 'new' && (<><div><label style={styles.label}>{tr.customerName}</label><input value={invForm.custName} onChange={e => setInvForm({...invForm, custName: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>{tr.customerPhone}</label><input value={invForm.custPhone} onChange={e => setInvForm({...invForm, custPhone: e.target.value})} style={styles.input} /></div></>)}</>
          ) : invForm.payment !== 'Credit Balance' && invForm.custType === 'Corporate' ? (
            <><div><label style={styles.label}>Select Corporate</label><select value={invForm.corpId} onChange={e => setInvForm({...invForm, corpId: e.target.value})} style={styles.input}><option value="new">New Company</option>{data.corporates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>{invForm.corpId === 'new' && (<><div><label style={styles.label}>Company Name</label><input value={invForm.corpName} onChange={e => setInvForm({...invForm, corpName: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>VAT No</label><input value={invForm.corpVat} onChange={e => setInvForm({...invForm, corpVat: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>Phone</label><input value={invForm.corpPhone} onChange={e => setInvForm({...invForm, corpPhone: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>Address</label><input value={invForm.corpAddress} onChange={e => setInvForm({...invForm, corpAddress: e.target.value})} style={styles.input} /></div></>)}</>
          ) : null}
          <div style={{ gridColumn: '1 / -1' }}><label style={styles.label}>{tr.passengers}</label>{invForm.passengers.map((p, i) => (<div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><input value={p} onChange={e => { const arr = [...invForm.passengers]; arr[i] = e.target.value; setInvForm({...invForm, passengers: arr}); }} placeholder={`Passenger ${i + 1}`} style={styles.input} required />{invForm.passengers.length > 1 && <button type="button" onClick={() => setInvForm({...invForm, passengers: invForm.passengers.filter((_, idx) => idx !== i)})} style={{...styles.btnDanger, width: 'auto'}}>X</button>}</div>))}<button type="button" onClick={() => setInvForm({...invForm, passengers: [...invForm.passengers, '']})} style={{...styles.btnWarning, width: 'auto'}}>{tr.addPassenger}</button></div>
          <div><label style={styles.label}>{tr.portal}</label><select value={invForm.portalId} onChange={e => setInvForm({...invForm, portalId: e.target.value})} style={styles.input} required><option value="">Select Portal</option>{data.portals.map(p => <option key={p.id} value={p.id}>{p.name} (Bal: {(p.current_balance || 0).toFixed(2)})</option>)}</select></div>
          <div><label style={styles.label}>{tr.service}</label><select value={invForm.service} onChange={e => setInvForm({...invForm, service: e.target.value})} style={styles.input}><option>{tr.flightTicket}</option><option>{tr.hotel}</option><option>{tr.tourPackage}</option><option>{tr.visitVisa}</option><option>{tr.umrahVisa}</option><option>{tr.newService}</option></select></div>
          {invForm.service === 'Flight Ticket' && (<><div><label style={styles.label}>{tr.flightType}</label><select value={invForm.flightType} onChange={e => { const ft = e.target.value; setInvForm({...invForm, flightType: ft, taxRate: ft === 'International' ? '0' : '15'}); }} style={styles.input}><option>{tr.domestic}</option><option>{tr.international}</option></select></div><div><label style={styles.label}>{tr.airline}</label><input value={invForm.airline} onChange={e => setInvForm({...invForm, airline: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>{tr.sector}</label><input value={invForm.flightSector} onChange={e => setInvForm({...invForm, flightSector: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>{tr.pnr}</label><input value={invForm.pnr} onChange={e => setInvForm({...invForm, pnr: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>{tr.ticketNo}</label><input value={invForm.ticketNo} onChange={e => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.input} /></div></>)}
          {invForm.service === 'Hotel' && (<><div><label style={styles.label}>{tr.hotelName}</label><input value={invForm.hotelName} onChange={e => setInvForm({...invForm, hotelName: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>{tr.checkIn}</label><input type="date" value={invForm.checkIn} onChange={e => setInvForm({...invForm, checkIn: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>{tr.checkOut}</label><input type="date" value={invForm.checkOut} onChange={e => setInvForm({...invForm, checkOut: e.target.value})} style={styles.input} /></div></>)}
          {invForm.service === 'New Service' && (<div><label style={styles.label}>{tr.serviceName}</label><input value={invForm.serviceName} onChange={e => setInvForm({...invForm, serviceName: e.target.value})} style={styles.input} required /></div>)}
          <div><label style={styles.label}>{tr.qty}</label><input type="number" value={invForm.qty} onChange={e => setInvForm({...invForm, qty: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>{tr.cost}</label><input type="number" step="0.01" value={invForm.cost} onChange={e => setInvForm({...invForm, cost: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>{tr.sell}</label><input type="number" step="0.01" value={invForm.sell} onChange={e => setInvForm({...invForm, sell: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>{tr.discount}</label><input type="number" step="0.01" value={invForm.discount} onChange={e => setInvForm({...invForm, discount: e.target.value})} style={styles.input} /></div>
          <div><label style={styles.label}>{tr.vatRate}</label><select value={invForm.taxRate} onChange={e => setInvForm({...invForm, taxRate: e.target.value})} style={styles.input}><option value="15">15% VAT</option><option value="0">0% VAT (Exempt)</option></select></div>
          <div><label style={styles.label}>{tr.invoiceDate}</label><input type="date" value={invForm.invoiceDate} onChange={e => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.input} required /></div>
          <div><label style={styles.label}>{tr.journeyType}</label><select value={invForm.flightJourney} onChange={e => setInvForm({...invForm, flightJourney: e.target.value})} style={styles.input}><option>{tr.single}</option><option>{tr.roundTrip}</option><option>{tr.multiCity}</option></select></div>
          <div><label style={styles.label}>{tr.fareType}</label><select value={invForm.refundable} onChange={e => setInvForm({...invForm, refundable: e.target.value})} style={styles.input}><option>{tr.refundable}</option><option>{tr.nonRefundable}</option></select></div>
          <div><label style={styles.label}>{tr.bookingType}</label><select value={invForm.bookingType} onChange={e => setInvForm({...invForm, bookingType: e.target.value, linkedInvId: '', oldTicketNo: '', oldPnr: ''})} style={styles.input}><option>{tr.newBooking}</option><option>{tr.reissue}</option><option>{tr.extraLuggage}</option><option>{tr.previousBooking}</option></select></div>
          
          {invForm.bookingType === 'Previous Booking' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Select Previous Booking (Refund Credit)</label>
              <select value={invForm.linkedInvId} onChange={e => { 
                const linkedInv = data.invoices.find(i => i.id === e.target.value); 
                setInvForm({
                  ...invForm, 
                  linkedInvId: linkedInv?.invoice_no || '', // Store Invoice No (Text)
                  useCredit: linkedInv?.refund_customer || 0, 
                  creditCustId: linkedInv?.customer_id || '',
                  oldTicketNo: linkedInv?.ticket_no || '', // Store Old Ticket No
                  oldPnr: linkedInv?.pnr || '',            // Store Old PNR
                  // Do NOT overwrite new booking details (pnr, ticketNo, etc.) so user can enter new ones
                }); 
              }} style={styles.input} required>
                <option value="">Select Refund Invoice</option>
                {data.invoices.filter(i => i.invoice_no.startsWith('REF-') && (i.refund_customer > 0)).map(i => 
                  <option key={i.id} value={i.id}>{i.invoice_no} - {i.customers?.name} (Credit: {i.refund_customer || 0})</option>
                )}
              </select>
              {invForm.linkedInvId && (() => {
                const linkedInv = data.invoices.find(i => i.invoice_no === invForm.linkedInvId);
                return (
                  <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '8px', marginTop: '10px', border: '1px solid #cbd5e1' }}>
                    <h4 style={{ margin: '0 0 10px', color: '#1E3A8A' }}>Previous Booking Details (Auto-Filled)</h4>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Original Invoice No:</strong> {invForm.linkedInvId}</p>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Old Ticket No:</strong> {invForm.oldTicketNo || 'N/A'}</p>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Old PNR:</strong> {invForm.oldPnr || 'N/A'}</p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#7c3aed' }}><strong>Credit Auto-Deducted:</strong> {(parseFloat(invForm.useCredit) || 0).toFixed(2)} SAR</p>
                  </div>
                );
              })()}
            </div>
          )}
          
          <div><label style={styles.label}>{tr.salesPerson}</label><select value={invForm.employeeId} onChange={e => setInvForm({...invForm, employeeId: e.target.value})} style={styles.input} required><option value="">Select Sales Person</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
          <div><label style={styles.label}>{tr.paymentMethod}</label><select value={invForm.payment} onChange={e => setInvForm({...invForm, payment: e.target.value, useCredit: 0, creditCustId: ''})} style={styles.input}><option>{tr.cash}</option><option>{tr.bankTransfer}</option><option>{tr.card}</option><option>{tr.credit}</option><option>{tr.creditBalance}</option><option>{tr.tabby}</option><option>{tr.tamara}</option></select></div>
          
          {invForm.payment === 'Credit Balance' && (
            <>
              <div><label style={styles.label}>Select Customer (Credit Available)</label><select value={invForm.creditCustId} onChange={e => { const c = data.customers.find(x => x.id === e.target.value); setInvForm({...invForm, creditCustId: e.target.value, useCredit: c?.store_credit || 0}); }} style={styles.input} required><option value="">Select Customer</option>{data.customers.filter(c => (c.store_credit || 0) > 0).map(c => <option key={c.id} value={c.id}>{c.name} (Avl: {(c.store_credit || 0).toFixed(2)})</option>)}</select></div>
              <div><label style={styles.label}>{tr.useCreditAmount}</label><input type="number" step="0.01" value={invForm.useCredit} onChange={e => setInvForm({...invForm, useCredit: e.target.value})} style={styles.input} required /></div>
              
              {/* LIVE CALCULATION DISPLAY */}
              <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '15px', borderRadius: '8px', marginTop: '10px', border: '1px solid #cbd5e1' }}>
                <h4 style={{ margin: '0 0 10px', color: '#1E3A8A' }}>Live Payment Calculation</h4>
                {(() => {
                  const qty = parseInt(invForm.qty) || 1;
                  const sell = (parseFloat(invForm.sell) || 0) * qty;
                  const discount = parseFloat(invForm.discount) || 0;
                  const taxRate = parseFloat(invForm.taxRate) || 0;
                  const total = (sell - discount) + ((sell - discount) * (taxRate / 100));
                  const creditUsed = parseFloat(invForm.useCredit) || 0;
                  const remaining = total - creditUsed;
                  return (
                    <>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Invoice Total:</strong> {total.toFixed(2)} SAR</p>
                      <p style={{ margin: '5px 0', fontSize: '14px', color: '#7c3aed' }}><strong>Credit Applied:</strong> - {creditUsed.toFixed(2)} SAR</p>
                      <p style={{ margin: '5px 0', fontSize: '16px', color: remaining > 0 ? '#EF4444' : '#059669' }}><strong>Remaining to Pay (Cash/Bank):</strong> {remaining > 0 ? remaining.toFixed(2) : '0.00'} SAR</p>
                    </>
                  );
                })()}
              </div>
            </>
          )}
          
          <div><label style={styles.label}>{tr.paidAmount}</label><input type="number" step="0.01" value={invForm.paid} onChange={e => setInvForm({...invForm, paid: e.target.value})} style={styles.input} required /></div>
          {invForm.payment === 'Credit' && (<><div><label style={styles.label}>Select Creditor</label><select value={invForm.creditorId} onChange={e => setInvForm({...invForm, creditorId: e.target.value})} style={styles.input} required><option value="">Select Creditor</option>{data.creditors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label style={styles.label}>Credit Due Date</label><input type="date" value={invForm.creditDueDate} onChange={e => setInvForm({...invForm, creditDueDate: e.target.value})} style={styles.input} required /></div></>)}
          {invForm.payment === 'Tabby' && <div><label style={styles.label}>Tabby Order No</label><input value={invForm.tabbyNo} onChange={e => setInvForm({...invForm, tabbyNo: e.target.value})} style={styles.input} required /></div>}
          {invForm.payment === 'Tamara' && <div><label style={styles.label}>Tamara Order No</label><input value={invForm.tamaraNo} onChange={e => setInvForm({...invForm, tamaraNo: e.target.value})} style={styles.input} required /></div>}
        </div>
        <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>{editInvId ? tr.updateInvoice : tr.generateInvoice}</button>
      </form>
    </div>
  );

  if (page === 'list' || page === 'refunds') {
    const isInvoices = page === 'list';
    const allData = isInvoices ? data.invoices.filter(i => !i.invoice_no.startsWith('REF-') && i.status !== 'Draft' && i.status !== 'Recurring') : data.invoices.filter(i => i.invoice_no.startsWith('REF-'));
    const filteredData = allData.filter(inv => (payFilter === 'All' || inv.payment_method === payFilter) && (inv.invoice_no.toLowerCase().includes(search.toLowerCase()) || inv.customers?.name.toLowerCase().includes(search.toLowerCase()) || inv.corporates?.name.toLowerCase().includes(search.toLowerCase())));
    
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ color: '#1E3A8A' }}>{isInvoices ? tr.list : tr.refunds}</h2>
          <button onClick={() => exportToExcel(filteredData.map(i => ({ Inv: i.invoice_no, Customer: i.customers?.name || i.corporates?.name, Date: i.invoice_date, Total: i.total, Due: i.due_amount, Method: i.payment_method })), isInvoices ? 'Invoices' : 'Refunds')} style={styles.btnSuccess}>{tr.download_excel}</button>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input placeholder={tr.search} value={search} onChange={e => setSearch(e.target.value)} style={styles.input} />
          <select value={payFilter} onChange={e => setPayFilter(e.target.value)} style={{...styles.input, maxWidth: '200px'}}>
            <option>All</option><option>Cash</option><option>Bank Transfer</option><option>Card / Network</option><option>Credit</option><option>Credit Balance</option><option>Tabby</option><option>Tamara</option>
          </select>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#1E3A8A', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>{tr.invNo}</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>{tr.total}</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>{tr.due}</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>{tr.method}</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>{tr.actions}</th>
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
                    <button onClick={() => openPreview(inv)} style={{ ...styles.btnPrimary, padding: '5px 8px', width: 'auto', fontSize: '11px' }}>{tr.preview}</button>
                    <button onClick={() => handleDownloadPDF(inv)} style={{ ...styles.btnPrimary, padding: '5px 8px', width: 'auto', fontSize: '11px' }}>PDF</button>
                    <button onClick={() => printInvoice(inv)} style={{ ...styles.btnWarning, padding: '5px 8px', fontSize: '11px' }}>{tr.print}</button>
                    {isInvoices && <button onClick={() => shareWhatsApp(inv)} style={{ ...styles.btnSuccess, padding: '5px 8px', fontSize: '11px' }}>🟢 WhatsApp</button>}
                    {isInvoices && <button onClick={() => shareEmail(inv)} style={{ ...styles.btnInfo, padding: '5px 8px', fontSize: '11px' }}>✉️ Email</button>}
                    <button onClick={() => handleEditInvoice(inv)} style={{ ...styles.btnWarning, padding: '5px 8px', fontSize: '11px' }}>{tr.edit}</button>
                    <button onClick={() => handleDeleteInvoice(inv)} style={{ ...styles.btnDanger, padding: '5px 8px', fontSize: '11px' }}>{tr.delete}</button>
                    {isInvoices && (inv.due_amount > 0) && <button onClick={() => handleQuickSettle(inv)} style={{ ...styles.btnSuccess, padding: '5px 8px', fontSize: '11px' }}>{tr.quickSettle}</button>}
                    {isInvoices && <button onClick={() => openRefundModal(inv)} style={{ ...styles.btnDanger, padding: '5px 8px', fontSize: '11px' }}>{tr.refund}</button>}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ color: '#1E3A8A' }}>{tr.customers}</h2>
        <button onClick={() => exportToExcel(data.customers, 'Customers')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={styles.card}>
        <form onSubmit={handleAddEditCust} style={{ display: 'flex', gap: '10px' }}>
          <input value={custForm.name} onChange={e => setCustForm({...custForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={custForm.phone} onChange={e => setCustForm({...custForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <input type="number" step="0.01" value={custForm.store_credit} onChange={e => setCustForm({...custForm, store_credit: e.target.value})} placeholder="Store Credit" style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>{editCustId ? tr.save : 'Add'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>Phone</th><th style={{ padding: '12px' }}>Credit</th><th style={{ padding: '12px' }}>{tr.actions}</th></tr></thead>
        <tbody>{data.customers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.phone}</td><td style={{ padding: '12px' }}>{c.store_credit || 0}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditCust(c)} style={styles.btnWarning}>{tr.edit}</button><button onClick={() => handleDelete('customers', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>{tr.delete}</button></td></tr>)}</tbody>
      </table>
    </div>
  );
  
  if (page === 'corporates') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ color: '#1E3A8A' }}>{tr.corporates}</h2>
        <button onClick={() => exportToExcel(data.corporates, 'Corporates')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={styles.card}>
        <form onSubmit={handleAddEditCorp} style={{ display: 'flex', gap: '10px' }}>
          <input value={corpForm.name} onChange={e => setCorpForm({...corpForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={corpForm.vat_no} onChange={e => setCorpForm({...corpForm, vat_no: e.target.value})} placeholder="VAT" style={styles.input} />
          <input value={corpForm.phone} onChange={e => setCorpForm({...corpForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <input value={corpForm.address} onChange={e => setCorpForm({...corpForm, address: e.target.value})} placeholder="Address" style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>{editCorpId ? tr.save : 'Add'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>VAT</th><th style={{ padding: '12px' }}>{tr.actions}</th></tr></thead>
        <tbody>{data.corporates.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}>{c.vat_no}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditCorp(c)} style={styles.btnWarning}>{tr.edit}</button><button onClick={() => handleDelete('corporates', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>{tr.delete}</button></td></tr>)}</tbody>
      </table>
    </div>
  );

  if (page === 'creditors') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ color: '#1E3A8A' }}>{tr.creditors}</h2>
        <button onClick={() => exportToExcel(data.creditors, 'Creditors')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={styles.card}>
        <form onSubmit={handleAddEditCred} style={{ display: 'flex', gap: '10px' }}>
          <input value={creditorForm.name} onChange={e => setCreditorForm({...creditorForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={creditorForm.phone} onChange={e => setCreditorForm({...creditorForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>{editCredId ? tr.save : 'Add'}</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#1E3A8A', color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px' }}>{tr.actions}</th></tr></thead>
        <tbody>{data.creditors.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '12px' }}>{c.name}</td><td style={{ padding: '12px' }}><button onClick={() => handleEditCred(c)} style={styles.btnWarning}>{tr.edit}</button><button onClick={() => handleDelete('creditors', c.id)} style={{...styles.btnDanger, marginLeft: '5px'}}>{tr.delete}</button></td></tr>)}</tbody>
      </table>
    </div>
  );

  return null;
}
