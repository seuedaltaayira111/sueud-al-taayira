import React from 'react';
import ERPModals from './ERPModals';

export default function ERPLayout({ children, tr, lang, setLang, page, setPage, modal, setModal, passForm, setPassForm, handleChangePassword, handleLogout, handleSendMessage, chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, userProfile, menu, settleForm, setSettleForm, handleSettlePayment, refundForm, setRefundForm, handleRefund, previewHTML, downloadPDF }) {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Poppins', sans-serif", background: '#F1F5F9', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      
      <ERPModals 
        modal={modal} setModal={setModal} passForm={passForm} setPassForm={setPassForm} 
        handleChangePassword={handleChangePassword} settleForm={settleForm} setSettleForm={setSettleForm} 
        handleSettlePayment={handleSettlePayment} refundForm={refundForm} setRefundForm={setRefundForm} 
        handleRefund={handleRefund} previewHTML={previewHTML} downloadPDF={downloadPDF}
      />

      <div style={{ width: '260px', background: '#0F172A', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '5px 0 15px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F59E0B' }}>SUEUD AL TAAYIRA</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#fff' }}>صعود الطائرة للسفر السياحة</p>
        </div>
        <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ padding: '8px 15px', background: '#F59E0B', color: '#0F172A', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px' }}>{lang === 'en' ? 'العربية' : 'English'}</button>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {menu.map(m => (
            <div key={m.id} onClick={() => setPage(m.id)} style={{ padding: '12px', marginBottom: '5px', borderRadius: '8px', cursor: 'pointer', background: page === m.id ? 'rgba(245, 158, 11, 0.15)' : 'transparent', fontWeight: page === m.id ? 'bold' : 'normal', color: page === m.id ? '#F59E0B' : '#fff', borderLeft: page === m.id ? '3px solid #F59E0B' : '3px solid transparent' }}>{m.label}</div>
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
              <div style={{ background: '#0F172A', color: '#F59E0B', padding: '15px', fontWeight: 'bold' }}>AI Assistant</div>
              <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ margin: '5px 0', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                    <span style={{ background: m.sender === 'user' ? '#E2E8F0' : '#0F172A', color: m.sender === 'user' ? '#333' : '#fff', padding: '8px 12px', borderRadius: '10px', display: 'inline-block' }}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid #E2E8F0' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask..." style={{ flex: 1, border: 'none', padding: '10px', outline: 'none' }} />
                <button onClick={handleSendMessage} style={{ background: '#0F172A', color: '#F59E0B', border: 'none', padding: '10px 15px', cursor: 'pointer' }}>Send</button>
              </div>
            </div>
          )}
          <button onClick={() => setChatOpen(!chatOpen)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: '#F59E0B', border: 'none', fontSize: '28px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>💬</button>
        </div>
      </div>
    </div>
  );
}
