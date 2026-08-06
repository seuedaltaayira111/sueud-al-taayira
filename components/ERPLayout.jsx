import React from 'react';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }, 
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }, 
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' } 
};

export default function ERPLayout({ children, tr, lang, setLang, page, setPage, modal, setModal, passForm, setPassForm, handleChangePassword, handleLogout, handleSendMessage, chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, userProfile, menu, settleForm, setSettleForm, handleSettlePayment, refundForm, setRefundForm, handleRefund }) {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Poppins', sans-serif", background: '#F1F5F9', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      
      {modal.type === 'password' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.card}>
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <input type="password" placeholder="New Password" value={passForm.newPass} onChange={e => setPassForm({ newPass: e.target.value })} style={styles.input} required />
              <button type="submit" style={styles.btnPrimary}>Update</button>
              <button type="button" onClick={() => setModal({ type: null, data: null })} style={{ ...styles.btnDanger, width: '100%', marginTop: 10 }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      
      {modal.type === 'settle' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.card}>
            <h3>Settle Payment</h3>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.card}>
            <h3>Process Refund</h3>
            <form onSubmit={handleRefund}>
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Company Refund (Goes back to Portal)</label>
              <input type="number" step="0.01" value={refundForm.compRefund} onChange={e => setRefundForm({...refundForm, compRefund: e.target.value})} style={styles.input} required />
              
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Customer Refund Amount</label>
              <input type="number" step="0.01" value={refundForm.custRefund} onChange={e => setRefundForm({...refundForm, custRefund: e.target.value})} style={styles.input} required />
              
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Customer Refund Method</label>
              <select value={refundForm.mode} onChange={e => setRefundForm({...refundForm, mode: e.target.value})} style={styles.input}>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit">Credit (Store for next booking)</option>
              </select>

              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Reason</label>
              <input type="text" value={refundForm.reason} onChange={e => setRefundForm({...refundForm, reason: e.target.value})} style={styles.input} required />
              
              <button type="submit" style={styles.btnPrimary}>Process Refund</button>
              <button type="button" onClick={() => setModal({ type: null, data: null })} style={{ ...styles.btnDanger, width: '100%', marginTop: 10 }}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <div style={{ width: '260px', background: '#1E3A8A', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '5px 0 15px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>SUEUD AL TAAYIRA</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#FBBF24' }}>صعود الطائرة للسفر السياحة</p>
        </div>
        <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ padding: '8px 15px', background: '#FBBF24', color: '#1E3A8A', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px' }}>{lang === 'en' ? 'العربية' : 'English'}</button>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {menu.map(m => (
            <div key={m.id} onClick={() => setPage(m.id)} style={{ padding: '12px', marginBottom: '5px', borderRadius: '8px', cursor: 'pointer', background: page === m.id ? 'rgba(255,255,255,0.2)' : 'transparent', fontWeight: page === m.id ? 'bold' : 'normal' }}>{m.label}</div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px', marginTop: '15px' }}>
          <div onClick={() => setModal({ type: 'password', data: null })} style={{ padding: '10px', cursor: 'pointer', fontSize: '14px' }}>🔒 {tr.changePass}</div>
          <div onClick={handleLogout} style={{ padding: '10px', cursor: 'pointer', fontSize: '14px', color: '#EF4444' }}>🚪 {tr.logout}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '30px', position: 'relative' }}>
        {children}
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>
          {chatOpen && (
            <div style={{ width: '350px', height: '450px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', marginBottom: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#1E3A8A', color: 'white', padding: '15px', fontWeight: 'bold' }}>AI Assistant</div>
              <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ margin: '5px 0', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                    <span style={{ background: m.sender === 'user' ? '#E2E8F0' : '#1E3A8A', color: m.sender === 'user' ? '#333' : 'white', padding: '8px 12px', borderRadius: '10px', display: 'inline-block' }}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid #E2E8F0' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask..." style={{ flex: 1, border: 'none', padding: '10px', outline: 'none' }} />
                <button onClick={handleSendMessage} style={{ background: '#1E3A8A', color: 'white', border: 'none', padding: '10px 15px', cursor: 'pointer' }}>Send</button>
              </div>
            </div>
          )}
          <button onClick={() => setChatOpen(!chatOpen)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', border: 'none', fontSize: '28px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>💬</button>
        </div>
      </div>
    </div>
  );
}
