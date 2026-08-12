'use client';

import React from 'react';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #334155', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', background: '#0F172A', color: '#fff' }, 
  btnPrimary: { padding: '10px 15px', background: '#F59E0B', color: '#0F172A', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  card: { background: '#1E293B', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '20px', border: '1px solid #334155', color: '#fff' } 
};

export default function ERPModals({ modal, setModal, passForm, setPassForm, handleChangePassword, settleForm, setSettleForm, handleSettlePayment, refundForm, setRefundForm, handleRefund, previewHTML, downloadPDF }) {
  return (
    <>
      {modal.type === 'password' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.card}>
            <h3 style={{ color: '#F59E0B' }}>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <input type="password" placeholder="New Password" value={passForm.newPass} onChange={e => setPassForm({ newPass: e.target.value })} style={styles.input} required />
              <button type="submit" style={styles.btnPrimary}>Update</button>
              <button type="button" onClick={() => setModal({ type: null, data: null })} style={{ ...styles.btnDanger, width: '100%', marginTop: 10 }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      
      {modal.type === 'settle' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.card}>
            <h3 style={{ color: '#F59E0B' }}>Settle Payment</h3>
            <form onSubmit={handleSettlePayment}>
              <input type="date" value={settleForm.date} onChange={e => setSettleForm({...settleForm, date: e.target.value})} style={styles.input} required />
              <select value={settleForm.mode} onChange={e => setSettleForm({...settleForm, mode: e.target.value})} style={styles.input}>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
              <button type="submit" style={styles.btnPrimary}>Settle</button>
              <button type="button" onClick={() => setModal({ type: null, data: null })} style={{ ...styles.btnDanger, width: '100%', marginTop: 10 }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      
      {modal.type === 'refund' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.card}>
            <h3 style={{ color: '#F59E0B' }}>Process Refund</h3>
            <form onSubmit={handleRefund}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#94A3B8' }}>Company Refund (Goes back to Portal)</label>
              <input type="number" step="0.01" value={refundForm.compRefund} onChange={e => setRefundForm({...refundForm, compRefund: e.target.value})} style={styles.input} required />
              
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#94A3B8' }}>Customer Refund Amount</label>
              <input type="number" step="0.01" value={refundForm.custRefund} onChange={e => setRefundForm({...refundForm, custRefund: e.target.value})} style={styles.input} required />
              
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#94A3B8' }}>Customer Refund Method</label>
              <select value={refundForm.mode} onChange={e => setRefundForm({...refundForm, mode: e.target.value})} style={styles.input}>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit">Credit (Store for next booking)</option>
              </select>

              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#94A3B8' }}>Refund Reason / سبب الاسترجاع</label>
              <select value={refundForm.reason} onChange={e => setRefundForm({...refundForm, reason: e.target.value})} style={styles.input} required>
                <option value="">Select Reason</option>
                <option value="Cancel by Airline">Cancel by Airline / إلغاء من قبل الخطوط الجوية</option>
                <option value="Cancel by Customer">Cancel by Customer / إلغاء من قبل العميل</option>
                <option value="Date Change">Date Change / تغيير التاريخ</option>
                <option value="No Show">No Show / عدم الحضور</option>
                <option value="Duplicate Booking">Duplicate Booking / حجز مكرر</option>
                <option value="Visa Rejected">Visa Rejected / رفض التأشيرة</option>
                <option value="Other">Other / أخرى</option>
              </select>
              
              <button type="submit" style={styles.btnPrimary}>Process Refund</button>
              <button type="button" onClick={() => setModal({ type: null, data: null })} style={{ ...styles.btnDanger, width: '100%', marginTop: 10 }}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {modal.type === 'preview' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1E293B', width: '900px', height: '95vh', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #334155' }}>
              <h3 style={{ margin: 0, color: '#F59E0B' }}>Document Preview</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => downloadPDF(previewHTML, 'document.pdf')} style={{ ...styles.btnSuccess, width: 'auto' }}>Download PDF</button>
                <button onClick={() => setModal({ type: null, data: null })} style={{ ...styles.btnDanger, width: 'auto' }}>Close</button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', background: '#f1f5f9', display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <iframe srcDoc={previewHTML} style={{ width: '100%', height: '100%', border: '1px solid #ccc', background: 'white' }}></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
