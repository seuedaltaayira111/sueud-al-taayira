'use client';

import React from 'react';

const styles = { 
  input: { width: '100%', padding: '12px 15px', margin: '6px 0', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s', fontSize: '14px' }, 
  btnPrimary: { padding: '12px 15px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E293B', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }, 
  btnInfo: { padding: '8px 12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
  card: { background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block', marginTop: '12px' },
  tableHeader: { background: '#1E293B', color: 'white', padding: '15px', textAlign: 'start', fontSize: '13px' },
  tableCell: { padding: '15px', borderBottom: '1px solid #F1F5F9', fontSize: '14px' },
  sectionTitle: { fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 15px', paddingBottom: '10px', borderBottom: '2px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }
};

export default function ERPViewsCore(props) {
  const { page, data, tr, today, invForm, setInvForm, handleCreateInvoice, handleDownloadPDF, printInvoice, exportToExcel, search, setSearch, payFilter, setPayFilter, handleEditInvoice, handleDeleteInvoice, openRefundModal, editInvId, openPreview, openSettleModal, handleQuickSettle, handleAddEditCust, custForm, setCustForm, editCustId, handleAddEditCorp, corpForm, setCorpForm, editCorpId, handleAddEditCred, creditorForm, setCreditorForm, editCredId, handleEditCust, handleEditCorp, handleEditCred, handleDelete, shareWhatsApp, shareEmail } = props;

  // ================= DASHBOARD =================
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
          <h1 style={{ margin: 0, color: '#0F172A', fontSize: '28px', fontWeight: '800' }}>{s.company_name_en || 'SUEUD AL TAAYIRA'}</h1>
          <h2 style={{ margin: '5px 0', color: '#D97706', fontSize: '22px' }}>{s.company_name_ar || 'صعود الطائرة للسفر السياحة'}</h2>
          <p style={{ color: '#64748B', fontSize: '14px' }}>{s.address_ar || ''} | {s.phone || ''}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 15px rgba(37, 99, 235, 0.2)' }}><h3 style={{ margin: '0 0 10px', opacity: 0.9, fontSize: '14px' }}>Total Sales</h3><h2 style={{ margin: 0, fontSize: '28px' }}>{tSales.toFixed(2)} <span style={{fontSize:'14px'}}>SAR</span></h2></div>
          <div style={{ background: 'linear-gradient(135deg, #047857, #059669)', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 15px rgba(5, 150, 105, 0.2)' }}><h3 style={{ margin: '0 0 10px', opacity: 0.9, fontSize: '14px' }}>Total Profit</h3><h2 style={{ margin: 0, fontSize: '28px' }}>{tProfit.toFixed(2)} <span style={{fontSize:'14px'}}>SAR</span></h2></div>
          <div style={{ background: 'linear-gradient(135deg, #B91C1C, #EF4444)', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 15px rgba(239, 68, 68, 0.2)' }}><h3 style={{ margin: '0 0 10px', opacity: 0.9, fontSize: '14px' }}>Outstanding</h3><h2 style={{ margin: 0, fontSize: '28px' }}>{totalOutstanding.toFixed(2)} <span style={{fontSize:'14px'}}>SAR</span></h2></div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', borderLeft: '5px solid #D97706', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}><h3 style={{ margin: '0 0 10px', color: '#64748B', fontSize: '14px' }}>Cash Balance</h3><h2 style={{ margin: 0, color: '#334155', fontSize: '24px' }}>{cashBal.toFixed(2)} SAR</h2></div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', borderLeft: '5px solid #2563EB', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}><h3 style={{ margin: '0 0 10px', color: '#64748B', fontSize: '14px' }}>Bank Balance</h3><h2 style={{ margin: 0, color: '#334155', fontSize: '24px' }}>{bankBal.toFixed(2)} SAR</h2></div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', borderLeft: '5px solid #dc2626', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}><h3 style={{ margin: '0 0 10px', color: '#dc2626', fontSize: '14px' }}>⚠️ Low Portal Alerts</h3>{lowBalPortals.length === 0 ? <p style={{fontSize: '14px', color: '#059669', margin:0}}>All portals are healthy.</p> : lowBalPortals.map(p => <p key={p.id} style={{fontSize: '14px', margin: '5px 0', color: '#dc2626'}}>{p.name} - {p.current_balance.toFixed(2)} SAR</p>)}</div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', borderLeft: '5px solid #7c3aed', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}><h3 style={{ margin: '0 0 10px', color: '#64748B', fontSize: '14px' }}>Total Expenses</h3><h2 style={{ margin: 0, color: '#EF4444', fontSize: '24px' }}>{tExpenses.toFixed(2)} SAR</h2></div>
        </div>
      </div>
    );
  }

  // ================= CREDIT BALANCES =================
  if (page === 'credit') {
    const creditCustomers = data.customers.filter(c => (c.store_credit || 0) > 0);
    return (
      <div>
        <h2 style={{ color: '#0F172A', marginBottom: '20px' }}>{tr.credit}</h2>
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={styles.tableHeader}>Customer</th><th style={styles.tableHeader}>Phone</th><th style={styles.tableHeader}>Available Credit (SAR)</th></tr></thead>
            <tbody>{creditCustomers.length === 0 ? <tr><td colSpan="3" style={{padding: '30px', textAlign:'center', color:'#94A3B8'}}>No credit balances available.</td></tr> : creditCustomers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.phone}</td><td style={{...styles.tableCell, color: '#059669', fontWeight: 'bold'}}>{(c.store_credit || 0).toFixed(2)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    );
  }

  // ================= CREATE INVOICE (HIGH-TECH DEEPLY ANALYZED FORM) =================
  if (page === 'create') {
    // Deep Live Calculation Logic
    const qty = parseInt(invForm.qty) || 1;
    const baseSell = (parseFloat(invForm.sell) || 0) * qty;
    const discount = parseFloat(invForm.discount) || 0;
    const sellAfterDiscount = baseSell - discount;
    const taxRate = parseFloat(invForm.taxRate) || 0;
    const vat = sellAfterDiscount * (taxRate / 100);
    const totalNewBooking = sellAfterDiscount + vat;
    const creditUsed = parseFloat(invForm.useCredit) || 0;
    const balanceToPay = totalNewBooking - creditUsed;

    return (
      <div style={styles.card}>
        <h2 style={{ color: '#0F172A', marginBottom: '20px', borderBottom: '2px solid #E2E8F0', paddingBottom: '10px' }}>{editInvId ? tr.editInvoice : tr.create}</h2>
        <form onSubmit={handleCreateInvoice}>
          
          {/* SECTION 1: CUSTOMER & BOOKING TYPE */}
          <div style={{ marginBottom: '30px' }}>
            <div style={styles.sectionTitle}><span>1. Customer Details</span><span>تفاصيل العميل</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {invForm.payment !== 'Credit Balance' && (
                <div>
                  <label style={styles.label}>{tr.custType} / نوع العميل</label>
                  <select value={invForm.custType} onChange={e => setInvForm({...invForm, custType: e.target.value})} style={styles.input}>
                    <option>{tr.individual}</option><option>{tr.corporate}</option>
                  </select>
                </div>
              )}
              
              {invForm.payment !== 'Credit Balance' && invForm.custType === 'Individual' ? (
                <>
                  <div>
                    <label style={styles.label}>{tr.selectCustomer} / اختر العميل</label>
                    <input type="text" list="customers-list" value={invForm.custName} onChange={e => { const val = e.target.value; const cust = data.customers.find(c => c.name.toLowerCase() === val.toLowerCase()); if (cust) { setInvForm({...invForm, custName: cust.name, custId: cust.id, custPhone: cust.phone}); } else { setInvForm({...invForm, custName: val, custId: 'new'}); } }} placeholder="Search or type new name..." style={styles.input} required />
                    <datalist id="customers-list">{data.customers.map(c => <option key={c.id} value={c.name}>{c.name} (Phone: {c.phone})</option>)}</datalist>
                  </div>
                  {invForm.custId !== 'new' && (() => { const cust = data.customers.find(c => c.id === invForm.custId); return cust ? ( <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0', gridColumn: '1 / -1' }}> <strong style={{ color: '#059669' }}>{tr.creditBalance}: </strong> <span style={{ color: '#059669', fontWeight: 'bold' }}>{(cust.store_credit || 0).toFixed(2)} SAR</span> </div> ) : null; })()}
                  {invForm.custId === 'new' && invForm.custName && ( <div><label style={styles.label}>{tr.customerPhone}</label><input value={invForm.custPhone} onChange={e => setInvForm({...invForm, custPhone: e.target.value})} style={styles.input} /></div> )}
                </>
              ) : invForm.payment !== 'Credit Balance' && invForm.custType === 'Corporate' ? (
                <>
                  <div><label style={styles.label}>Select Corporate</label><select value={invForm.corpId} onChange={e => setInvForm({...invForm, corpId: e.target.value})} style={styles.input}><option value="new">New Company</option>{data.corporates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  {invForm.corpId === 'new' && ( <><div><label style={styles.label}>Company Name</label><input value={invForm.corpName} onChange={e => setInvForm({...invForm, corpName: e.target.value})} style={styles.input} required /></div><div><label style={styles.label}>VAT No</label><input value={invForm.corpVat} onChange={e => setInvForm({...invForm, corpVat: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>Phone</label><input value={invForm.corpPhone} onChange={e => setInvForm({...invForm, corpPhone: e.target.value})} style={styles.input} /></div><div><label style={styles.label}>Address</label><input value={invForm.corpAddress} onChange={e => setInvForm({...invForm, corpAddress: e.target.value})} style={styles.input} /></div></> )}
                </>
              ) : null}

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>{tr.passengers} / الركاب</label>
                {invForm.passengers.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input value={p} onChange={e => { const arr = [...invForm.passengers]; arr[i] = e.target.value; setInvForm({...invForm, passengers: arr}); }} placeholder={`Passenger ${i + 1}`} style={styles.input} required />
                    {invForm.passengers.length > 1 && <button type="button" onClick={() => setInvForm({...invForm, passengers: invForm.passengers.filter((_, idx) => idx !== i)})} style={{...styles.btnDanger, width: 'auto'}}>X</button>}
                  </div>
                ))}
                <button type="button" onClick={() => setInvForm({...invForm, passengers: [...invForm.passengers, '']})} style={{...styles.btnWarning, width: 'auto'}}>{tr.addPassenger}</button>
              </div>
            </div>
          </div>

          {/* SECTION 2: FLIGHT & PRICING DETAILS */}
          <div style={{ marginBottom: '30px' }}>
            <div style={styles.sectionTitle}><span>2. Flight & Pricing Details</span><span>تفاصيل الرحلة والأسعار</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div><label style={styles.label}>{tr.portal} / البوابة</label><select value={invForm.portalId} onChange={e => setInvForm({...invForm, portalId: e.target.value})} style={styles.input} required><option value="">Select Portal</option>{data.portals.map(p => <option key={p.id} value={p.id}>{p.name} (Bal: {(p.current_balance || 0).toFixed(2)})</option>)}</select></div>
              <div><label style={styles.label}>{tr.service} / الخدمة</label><select value={invForm.service} onChange={e => setInvForm({...invForm, service: e.target.value})} style={styles.input}><option>{tr.flightTicket}</option><option>{tr.hotel}</option><option>{tr.tourPackage}</option><option>{tr.visitVisa}</option><option>{tr.umrahVisa}</option><option>{tr.newService}</option></select></div>
              
              {invForm.service === 'Flight Ticket' && (
                <>
                  <div><label style={styles.label}>{tr.flightType} / نوع الرحلة</label><select value={invForm.flightType} onChange={e => { const ft = e.target.value; setInvForm({...invForm, flightType: ft, taxRate: ft === 'International' ? '0' : '15'}); }} style={styles.input}><option>{tr.domestic}</option><option>{tr.international}</option></select></div>
                  <div><label style={styles.label}>{tr.airline} / خط الطيران</label><input value={invForm.airline} onChange={e => setInvForm({...invForm, airline: e.target.value})} style={styles.input} required /></div>
                  <div><label style={styles.label}>{tr.sector} / القطاع</label><input value={invForm.flightSector} onChange={e => setInvForm({...invForm, flightSector: e.target.value})} style={styles.input} required /></div>
                  <div><label style={styles.label}>{tr.pnr} / رقم الحجز</label><input value={invForm.pnr} onChange={e => setInvForm({...invForm, pnr: e.target.value})} style={styles.input} /></div>
                  <div><label style={styles.label}>{tr.ticketNo} / رقم التذكرة</label><input value={invForm.ticketNo} onChange={e => setInvForm({...invForm, ticketNo: e.target.value})} style={styles.input} /></div>
                </>
              )}
              
              <div><label style={styles.label}>{tr.qty} / الكمية</label><input type="number" value={invForm.qty} onChange={e => setInvForm({...invForm, qty: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>{tr.cost} / التكلفة</label><input type="number" step="0.01" value={invForm.cost} onChange={e => setInvForm({...invForm, cost: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>{tr.sell} / البيع</label><input type="number" step="0.01" value={invForm.sell} onChange={e => setInvForm({...invForm, sell: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>{tr.discount} / الخصم</label><input type="number" step="0.01" value={invForm.discount} onChange={e => setInvForm({...invForm, discount: e.target.value})} style={styles.input} /></div>
              <div><label style={styles.label}>{tr.vatRate} / نسبة الضريبة</label><select value={invForm.taxRate} onChange={e => setInvForm({...invForm, taxRate: e.target.value})} style={styles.input}><option value="15">15% VAT</option><option value="0">0% VAT (Exempt)</option></select></div>
              <div><label style={styles.label}>{tr.invoiceDate} / تاريخ الفاتورة</label><input type="date" value={invForm.invoiceDate} onChange={e => setInvForm({...invForm, invoiceDate: e.target.value})} style={styles.input} required /></div>
            </div>
          </div>

          {/* SECTION 3: RE-ISSUE & CREDIT AUTOMATION */}
          <div style={{ marginBottom: '30px', background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={styles.sectionTitle}><span>3. Booking Type & Re-issue Automation</span><span>أتمتة إعادة الإصدار</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <div>
                <label style={styles.label}>{tr.bookingType} / نوع الحجز</label>
                <select value={invForm.bookingType} onChange={e => setInvForm({...invForm, bookingType: e.target.value, linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '', oldSellPrice: 0, oldBookingDate: '', useCredit: 0})} style={styles.input}>
                  <option>{tr.newBooking}</option><option>{tr.reissue}</option><option>{tr.extraLuggage}</option><option>{tr.previousBooking}</option>
                </select>
              </div>
              
              {invForm.bookingType === 'Previous Booking' && (
                <div>
                  <label style={styles.label}>Select Previous Refund Invoice (Auto-Fill)</label>
                  <select value={invForm.linkedInvId} onChange={e => { 
                    const linkedInv = data.invoices.find(i => i.invoice_no === e.target.value); 
                    setInvForm({ 
                      ...invForm, 
                      linkedInvId: e.target.value, 
                      useCredit: linkedInv?.refund_customer || 0, 
                      creditCustId: linkedInv?.customer_id || '',
                      oldTicketNo: linkedInv?.ticket_no || '', 
                      oldPnr: linkedInv?.pnr || '',            
                      oldAirline: linkedInv?.airline || '',
                      oldSector: linkedInv?.flight_sector || '',
                      oldSellPrice: linkedInv?.total_sell || 0,
                      oldBookingDate: linkedInv?.invoice_date || ''
                    }); 
                  }} style={styles.input} required>
                    <option value="">Select Refund Invoice</option>
                    {data.invoices.filter(i => i.invoice_no.startsWith('REF-') && (i.refund_customer > 0)).map(i => 
                      <option key={i.id} value={i.invoice_no}>{i.invoice_no} - {i.customers?.name} (Credit: {i.refund_customer || 0})</option>
                    )}
                  </select>
                  
                  {invForm.linkedInvId && (
                    <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                        <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, textTransform: 'uppercase' }}>Original Airline</div>
                        <div style={{ fontSize: '16px', color: '#78350f', fontWeight: 700, marginTop: '5px' }}>{invForm.oldAirline || 'N/A'}</div>
                      </div>
                      <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                        <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, textTransform: 'uppercase' }}>Original Sector</div>
                        <div style={{ fontSize: '16px', color: '#78350f', fontWeight: 700, marginTop: '5px' }}>{invForm.oldSector || 'N/A'}</div>
                      </div>
                      <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                        <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, textTransform: 'uppercase' }}>Original Ticket No</div>
                        <div style={{ fontSize: '16px', color: '#78350f', fontWeight: 700, marginTop: '5px' }}>{invForm.oldTicketNo || 'N/A'}</div>
                      </div>
                      <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                        <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, textTransform: 'uppercase' }}>Original Selling Price</div>
                        <div style={{ fontSize: '18px', color: '#78350f', fontWeight: 800, marginTop: '5px' }}>{parseFloat(invForm.oldSellPrice || 0).toFixed(2)} SAR</div>
                      </div>
                      <div style={{ background: '#dcfce7', padding: '15px', borderRadius: '8px', border: '1px solid #86efac' }}>
                        <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, textTransform: 'uppercase' }}>Customer Refund (Credit)</div>
                        <div style={{ fontSize: '18px', color: '#047857', fontWeight: 800, marginTop: '5px' }}>- {creditUsed.toFixed(2)} SAR</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: PAYMENT & LIVE CALCULATION */}
          <div style={{ marginBottom: '30px' }}>
            <div style={styles.sectionTitle}><span>4. Payment & Calculation</span><span>الدفع والحساب</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div><label style={styles.label}>{tr.salesPerson} / موظف المبيعات</label><select value={invForm.employeeId} onChange={e => setInvForm({...invForm, employeeId: e.target.value})} style={styles.input} required><option value="">Select Sales Person</option>{data.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
              <div><label style={styles.label}>{tr.paymentMethod} / طريقة الدفع</label><select value={invForm.payment} onChange={e => setInvForm({...invForm, payment: e.target.value, useCredit: 0, creditCustId: ''})} style={styles.input}><option>{tr.cash}</option><option>{tr.bankTransfer}</option><option>{tr.card}</option><option>{tr.credit}</option><option>{tr.creditBalance}</option><option>{tr.tabby}</option><option>{tr.tamara}</option></select></div>
              
              {invForm.payment === 'Credit Balance' && invForm.custId !== 'new' && (() => {
                const cust = data.customers.find(c => c.id === invForm.custId);
                const creditAvl = cust?.store_credit || 0;
                return (
                  <div style={{ gridColumn: '1 / -1', background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <h4 style={{ margin: '0 0 15px', color: '#059669' }}>Customer: {cust?.name} | Available Credit: {creditAvl.toFixed(2)} SAR</h4>
                    <label style={styles.label}>Enter Amount to Deduct</label>
                    <input type="number" step="0.01" max={creditAvl} value={invForm.useCredit} onChange={e => setInvForm({...invForm, useCredit: e.target.value})} style={styles.input} required />
                  </div>
                );
              })()}
              
              <div style={{ gridColumn: '1 / -1', background: '#0F172A', color: 'white', padding: '25px', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 20px', color: '#F59E0B', fontSize: '18px' }}>Live Calculation / الحساب المباشر</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', margin: '8px 0', color: '#CBD5E1' }}><span>New Booking Price:</span><span>{totalNewBooking.toFixed(2)} SAR</span></div>
                    {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', margin: '8px 0', color: '#34d399' }}><span>Discount Applied:</span><span>- {discount.toFixed(2)} SAR</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', margin: '8px 0', color: '#CBD5E1' }}><span>VAT ({taxRate}%):</span><span>{vat.toFixed(2)} SAR</span></div>
                  </div>
                  <div style={{ borderLeft: '1px solid #334155', paddingLeft: '20px' }}>
                    {creditUsed > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', margin: '8px 0', color: '#34d399' }}><span>Refund Credit Applied:</span><span>- {creditUsed.toFixed(2)} SAR</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', margin: '15px 0 0', fontWeight: 'bold', borderTop: '2px solid #334155', paddingTop: '15px' }}>
                      <span>Balance to Pay (Cash/Bank):</span>
                      <span style={{ color: balanceToPay > 0 ? '#EF4444' : '#059669' }}>{balanceToPay > 0 ? balanceToPay.toFixed(2) : '0.00'} SAR</span>
                    </div>
                  </div>
                </div>
              </div>

              <div><label style={styles.label}>{tr.paidAmount} (Cash/Bank) / المبلغ المدفوع</label><input type="number" step="0.01" value={invForm.paid} onChange={e => setInvForm({...invForm, paid: e.target.value})} style={styles.input} required /></div>
              <div><label style={styles.label}>Invoice Status / حالة الفاتورة</label><select value={invForm.status || 'Unpaid'} onChange={e => setInvForm({...invForm, status: e.target.value})} style={styles.input}><option value="Unpaid">Unpaid</option><option value="Paid">Paid</option></select></div>
              
              {invForm.payment === 'Credit' && ( <><div><label style={styles.label}>Select Creditor</label><select value={invForm.creditorId} onChange={e => setInvForm({...invForm, creditorId: e.target.value})} style={styles.input} required><option value="">Select Creditor</option>{data.creditors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label style={styles.label}>Credit Due Date</label><input type="date" value={invForm.creditDueDate} onChange={e => setInvForm({...invForm, creditDueDate: e.target.value})} style={styles.input} required /></div></> )}
              {invForm.payment === 'Tabby' && <div><label style={styles.label}>Tabby Order No</label><input value={invForm.tabbyNo} onChange={e => setInvForm({...invForm, tabbyNo: e.target.value})} style={styles.input} required /></div>}
              {invForm.payment === 'Tamara' && <div><label style={styles.label}>Tamara Order No</label><input value={invForm.tamaraNo} onChange={e => setInvForm({...invForm, tamaraNo: e.target.value})} style={styles.input} required /></div>}
            </div>
          </div>

          <button type="submit" style={{ ...styles.btnPrimary, marginTop: '10px', padding: '15px', fontSize: '16px' }}>{editInvId ? tr.updateInvoice : tr.generateInvoice}</button>
        </form>
      </div>
    );
  }

  // ================= LIST INVOICES & REFUNDS =================
  if (page === 'list' || page === 'refunds') {
    const isInvoices = page === 'list';
    const allData = isInvoices ? data.invoices.filter(i => !i.invoice_no.startsWith('REF-') && i.status !== 'Draft' && i.status !== 'Recurring') : data.invoices.filter(i => i.invoice_no.startsWith('REF-'));
    const filteredData = allData.filter(inv => (payFilter === 'All' || inv.payment_method === payFilter) && (inv.invoice_no.toLowerCase().includes(search.toLowerCase()) || inv.customers?.name.toLowerCase().includes(search.toLowerCase()) || inv.corporates?.name.toLowerCase().includes(search.toLowerCase())));
    
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#0F172A', margin: 0 }}>{isInvoices ? tr.list : tr.refunds}</h2>
          <button onClick={() => exportToExcel(filteredData.map(i => ({ Inv: i.invoice_no, Customer: i.customers?.name || i.corporates?.name, Date: i.invoice_date, Total: i.total, Due: i.due_amount, Method: i.payment_method })), isInvoices ? 'Invoices' : 'Refunds')} style={styles.btnSuccess}>{tr.download_excel}</button>
        </div>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <input placeholder={tr.search} value={search} onChange={e => setSearch(e.target.value)} style={styles.input} />
          <select value={payFilter} onChange={e => setPayFilter(e.target.value)} style={{...styles.input, maxWidth: '200px'}}>
            <option>All</option><option>Cash</option><option>Bank Transfer</option><option>Card / Network</option><option>Credit</option><option>Credit Balance</option><option>Tabby</option><option>Tamara</option>
          </select>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0F172A' }}>
                <th style={styles.tableHeader}>{tr.invNo}</th>
                <th style={styles.tableHeader}>Customer</th>
                <th style={styles.tableHeader}>{tr.total}</th>
                <th style={styles.tableHeader}>{tr.due}</th>
                <th style={styles.tableHeader}>{tr.method}</th>
                <th style={styles.tableHeader}>{tr.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 15).map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={styles.tableCell}>{inv.invoice_no}</td>
                  <td style={styles.tableCell}>{inv.customers?.name || inv.corporates?.name}</td>
                  <td style={styles.tableCell}>{(inv.total || 0).toFixed(2)}</td>
                  <td style={{...styles.tableCell, color: (inv.due_amount || 0) > 0 ? '#EF4444' : '#059669', fontWeight: 'bold'}}>{(inv.due_amount || 0).toFixed(2)}</td>
                  <td style={styles.tableCell}>{inv.payment_method}</td>
                  <td style={styles.tableCell}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button onClick={() => openPreview(inv)} style={{ ...styles.btnPrimary, padding: '6px 10px', width: 'auto', fontSize: '12px' }}>{tr.preview}</button>
                      <button onClick={() => handleDownloadPDF(inv)} style={{ ...styles.btnInfo, padding: '6px 10px', fontSize: '12px' }}>PDF</button>
                      <button onClick={() => printInvoice(inv)} style={{ ...styles.btnWarning, padding: '6px 10px', fontSize: '12px' }}>{tr.print}</button>
                      {isInvoices && <button onClick={() => shareWhatsApp(inv)} style={{ ...styles.btnSuccess, padding: '6px 10px', fontSize: '12px' }}>🟢 WhatsApp</button>}
                      {isInvoices && <button onClick={() => shareEmail(inv)} style={{ ...styles.btnInfo, padding: '6px 10px', fontSize: '12px' }}>✉️ Email</button>}
                      <button onClick={() => handleEditInvoice(inv)} style={{ ...styles.btnWarning, padding: '6px 10px', fontSize: '12px' }}>{tr.edit}</button>
                      <button onClick={() => handleDeleteInvoice(inv)} style={{ ...styles.btnDanger, padding: '6px 10px', fontSize: '12px' }}>{tr.delete}</button>
                      {isInvoices && (inv.due_amount > 0) && <button onClick={() => handleQuickSettle(inv)} style={{ ...styles.btnSuccess, padding: '6px 10px', fontSize: '12px' }}>{tr.quickSettle}</button>}
                      {isInvoices && inv.status !== 'refunded' && <button onClick={() => openRefundModal(inv)} style={{ ...styles.btnDanger, padding: '6px 10px', fontSize: '12px' }}>{tr.refund}</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ================= CUSTOMERS, CORPORATES, CREDITORS (Same as before) =================
  if (page === 'customers') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.customers}</h2>
        <button onClick={() => exportToExcel(data.customers, 'Customers')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={{...styles.card, display: 'flex', gap: '15px', alignItems: 'center'}}>
        <form onSubmit={handleAddEditCust} style={{ display: 'flex', gap: '15px', width: '100%' }}>
          <input value={custForm.name} onChange={e => setCustForm({...custForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={custForm.phone} onChange={e => setCustForm({...custForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <input type="number" step="0.01" value={custForm.store_credit} onChange={e => setCustForm({...custForm, store_credit: e.target.value})} placeholder="Store Credit" style={styles.input} />
          <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '12px 25px'}}>{editCustId ? tr.save : 'Add'}</button>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#0F172A' }}><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Phone</th><th style={styles.tableHeader}>Credit</th><th style={styles.tableHeader}>{tr.actions}</th></tr></thead>
          <tbody>{data.customers.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.phone}</td><td style={styles.tableCell}>{c.store_credit || 0}</td><td style={styles.tableCell}><button onClick={() => handleEditCust(c)} style={styles.btnWarning}>{tr.edit}</button><button onClick={() => handleDelete('customers', c.id)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>{tr.delete}</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
  
  if (page === 'corporates') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.corporates}</h2>
        <button onClick={() => exportToExcel(data.corporates, 'Corporates')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={{...styles.card, display: 'flex', gap: '15px', alignItems: 'center'}}>
        <form onSubmit={handleAddEditCorp} style={{ display: 'flex', gap: '15px', width: '100%' }}>
          <input value={corpForm.name} onChange={e => setCorpForm({...corpForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={corpForm.vat_no} onChange={e => setCorpForm({...corpForm, vat_no: e.target.value})} placeholder="VAT" style={styles.input} />
          <input value={corpForm.phone} onChange={e => setCorpForm({...corpForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <input value={corpForm.address} onChange={e => setCorpForm({...corpForm, address: e.target.value})} placeholder="Address" style={styles.input} />
          <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '12px 25px'}}>{editCorpId ? tr.save : 'Add'}</button>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#0F172A' }}><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>VAT</th><th style={styles.tableHeader}>{tr.actions}</th></tr></thead>
          <tbody>{data.corporates.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.vat_no}</td><td style={styles.tableCell}><button onClick={() => handleEditCorp(c)} style={styles.btnWarning}>{tr.edit}</button><button onClick={() => handleDelete('corporates', c.id)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>{tr.delete}</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  if (page === 'creditors') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0F172A', margin: 0 }}>{tr.creditors}</h2>
        <button onClick={() => exportToExcel(data.creditors, 'Creditors')} style={styles.btnSuccess}>{tr.download_excel}</button>
      </div>
      <div style={{...styles.card, display: 'flex', gap: '15px', alignItems: 'center'}}>
        <form onSubmit={handleAddEditCred} style={{ display: 'flex', gap: '15px', width: '100%' }}>
          <input value={creditorForm.name} onChange={e => setCreditorForm({...creditorForm, name: e.target.value})} placeholder="Name" style={styles.input} required />
          <input value={creditorForm.phone} onChange={e => setCreditorForm({...creditorForm, phone: e.target.value})} placeholder="Phone" style={styles.input} />
          <button type="submit" style={{...styles.btnPrimary, width: 'auto', padding: '12px 25px'}}>{editCredId ? tr.save : 'Add'}</button>
        </form>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#0F172A' }}><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>{tr.actions}</th></tr></thead>
          <tbody>{data.creditors.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}><button onClick={() => handleEditCred(c)} style={styles.btnWarning}>{tr.edit}</button><button onClick={() => handleDelete('creditors', c.id)} style={{...styles.btnDanger, marginInlineStart: '5px'}}>{tr.delete}</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  return null;
}
