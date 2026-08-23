'use client';
import React from 'react';

const styles = { 
  input: { width: '100%', padding: '12px 15px', margin: '8px 0', border: '1px solid #334155', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', background: '#0F172A', color: '#fff', fontSize: '14px' }, 
  btnPrimary: { padding: '12px 15px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0F172A', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)' }, 
  btnSuccess: { padding: '10px 15px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }, 
  btnDanger: { padding: '10px 15px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }, 
  btnInfo: { padding: '10px 15px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  card: { background: '#1E293B', padding: '30px', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', marginBottom: '20px', border: '1px solid #334155', color: '#fff', width: '400px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#94A3B8', marginBottom: '0', display: 'block', marginTop: '15px' }
};

export default function ERPModals({ modal, setModal, passForm, setPassForm, handleChangePassword, settleForm, setSettleForm, handleSettlePayment, refundForm, setRefundForm, handleRefund, previewHTML, downloadPDF }) {
  const overlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };

  const handlePrintPreview = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(previewHTML);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  return (
    <>
      {/* CHANGE PASSWORD MODAL */}
      {modal.type === 'password' && (
        <div style={overlay}>
          <div style={styles.card}>
            <h3 style={{ color: '#F59E0B', marginTop: 0, marginBottom: '20px' }}>🔒 Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <label style={styles.label}>New Password</label>
              <input type="password" placeholder="Enter new password" value={passForm.newPass} onChange={e => setPassForm({ newPass: e.target.value })} style={styles.input} required />
              <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>Update Password</button>
              <button type="button" onClick={() => setModal({ type: null, data: null })} style={{ ...styles.btnDanger, width: '100%', marginTop: 10 }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      
      {/* SETTLE PAYMENT MODAL */}
      {modal.type === 'settle' && (
        <div style={overlay}>
          <div style={styles.card}>
            <h3 style={{ color: '#F59E0B', marginTop: 0, marginBottom: '20px' }}>💳 Settle Payment</h3>
            <form onSubmit={handleSettlePayment}>
              <label style={styles.label}>Settlement Date</label>
              <input type="date" value={settleForm.date} onChange={e => setSettleForm({...settleForm, date: e.target.value})} style={styles.input} required />
              <label style={styles.label}>Payment Method</label>
              <select value={settleForm.mode} onChange={e => setSettleForm({...settleForm, mode: e.target.value})} style={styles.input}>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
              <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>Settle Payment</button>
              <button type="button" onClick={() => setModal({ type: null, data: null })} style={{ ...styles.btnDanger, width: '100%', marginTop: 10 }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      
      {/* PROCESS REFUND MODAL */}
      {modal.type === 'refund' && (
        <div style={overlay}>
          <div style={{ ...styles.card, width: '500px' }}>
            <h3 style={{ color: '#EF4444', marginTop: 0, marginBottom: '20px' }}>🔄 Process Refund</h3>
            <form onSubmit={handleRefund}>
              <label style={styles.label}>Refund Date / تاريخ الاسترجاع</label>
              <input type="date" value={refundForm.date} onChange={e => setRefundForm({...refundForm, date: e.target.value})} style={styles.input} required />
              
              <label style={styles.label}>Company Refund (Goes back to Portal) / استرجاع الشركة</label>
              <input type="number" step="0.01" value={refundForm.compRefund} onChange={e => setRefundForm({...refundForm, compRefund: e.target.value})} style={styles.input} required />
              
              <label style={styles.label}>Customer Refund Amount / مبلغ استرجاع العميل</label>
              <input type="number" step="0.01" value={refundForm.custRefund} onChange={e => setRefundForm({...refundForm, custRefund: e.target.value})} style={styles.input} required />
              
              <label style={styles.label}>Customer Refund Method / طريقة الاسترجاع</label>
              <select value={refundForm.mode} onChange={e => setRefundForm({...refundForm, mode: e.target.value})} style={styles.input}>
                <option value="Cash">Cash / نقداً</option>
                <option value="Bank Transfer">Bank Transfer / تحويل بنكي</option>
                <option value="Credit">Credit for New Booking / رصيد لحجز جديد</option>
              </select>

              {refundForm.mode === 'Credit' && (
                <div style={{ background: '#059669', color: 'white', padding: '10px', borderRadius: '8px', marginTop: '10px', fontSize: '13px', fontWeight: 'bold' }}>
                  ✅ Available Credit Balance: {refundForm.creditBalance.toFixed(2)} SAR
                </div>
              )}

              <label style={styles.label}>Refund Reason / سبب الاسترجاع</label>
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
              
              <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>Process Refund</button>
              <button type="button" onClick={() => setModal({ type: null, data: null })} style={{ ...styles.btnDanger, width: '100%', marginTop: 10 }}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW INVOICE MODAL */}
      {modal.type === 'preview' && (
        <div style={{ ...overlay, background: 'rgba(0,0,0,0.9)' }}>
          <div style={{ background: '#1E293B', width: '900px', height: '95vh', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', borderBottom: '1px solid #334155' }}>
              <h3 style={{ margin: 0, color: '#F59E0B' }}>📄 Document Preview</h3>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={handlePrintPreview} style={styles.btnInfo}>🖨️ Print</button>
                <button onClick={() => downloadPDF(previewHTML, 'document.pdf')} style={styles.btnSuccess}>⬇️ Download PDF</button>
                <button onClick={() => setModal({ type: null, data: null })} style={styles.btnDanger}>✖ Close</button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', background: '#f1f5f9', display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <iframe srcDoc={previewHTML} style={{ width: '100%', height: '100%', border: 'none', background: 'white', borderRadius: '8px' }} title="Invoice Preview"></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
