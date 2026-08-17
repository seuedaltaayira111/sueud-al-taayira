'use client';

import React from 'react';
import ERPModals from './ERPModals';

export default function ERPLayout({ children, tr, lang, setLang, page, setPage, modal, setModal, passForm, setPassForm, handleChangePassword, handleLogout, handleSendMessage, chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, userProfile, menu, settleForm, setSettleForm, handleSettlePayment, refundForm, setRefundForm, handleRefund, previewHTML, downloadPDF }) {
  const isAr = lang === 'ar';
  const alignSide = isAr ? 'right' : 'left';

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Poppins', sans-serif", background: '#F1F5F9', direction: isAr ? 'rtl' : 'ltr' }}>
      
      <ERPModals 
        modal={modal} setModal={setModal} passForm={passForm} setPassForm={setPassForm} 
        handleChangePassword={handleChangePassword} settleForm={settleForm} setSettleForm={setSettleForm} 
        handleSettlePayment={handleSettlePayment} refundForm={refundForm} setRefundForm={setRefundForm} 
        handleRefund={handleRefund} previewHTML={previewHTML} downloadPDF={downloadPDF}
      />

      <div style={{ width: '270px', background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)', color: 'white', padding: '25px 15px', display: 'flex', flexDirection: 'column', boxShadow: isAr ? '-5px 0 15px rgba(0,0,0,0.1)' : '5px 0 15px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#F59E0B', letterSpacing: '1px' }}>SUEUD AL TAAYIRA</h1>
          <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#94A3B8' }}>صعود الطائرة للسفر السياحة</p>
        </div>
        
        <button 
          onClick={() => setLang(isAr ? 'en' : 'ar')} 
          style={{ 
            padding: '10px 15px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', 
            color: '#0F172A', border: 'none', borderRadius: '8px', cursor: 'pointer', 
            fontWeight: 'bold', marginBottom: '20px', fontSize: '14px',
            boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)', transition: 'all 0.3s ease'
          }}
        >
          🌐 {isAr ? 'English' : 'العربية'}
        </button>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
          {menu.map(m => (
            <div 
              key={m.id} 
              onClick={() => setPage(m.id)} 
              style={{ 
                padding: '12px 15px', marginBottom: '6px', borderRadius: '8px', cursor: 'pointer', 
                background: page === m.id ? 'rgba(245, 158, 11, 0.15)' : 'transparent', 
                fontWeight: page === m.id ? 'bold' : '500', 
                color: page === m.id ? '#F59E0B' : '#CBD5E1', 
                borderInlineStart: page === m.id ? '3px solid #F59E0B' : '3px solid transparent',
                fontSize: '14px', transition: 'all 0.2s ease'
              }}
            >
              {m.label}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', marginTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div style={{ width: '35px', height: '35px', background: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {userProfile?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{userProfile?.username}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{userProfile?.role}</div>
            </div>
          </div>
          <div onClick={() => setModal({ type: 'password', data: null })} style={{ padding: '10px', cursor: 'pointer', fontSize: '14px', color: '#94A3B8', borderRadius: '6px', transition: 'all 0.2s' }}>🔒 {tr.changePass}</div>
          <div onClick={handleLogout} style={{ padding: '10px', cursor: 'pointer', fontSize: '14px', color: '#EF4444', borderRadius: '6px', transition: 'all 0.2s' }}>🚪 {tr.logout}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '30px', position: 'relative', background: '#F8FAFC' }}>
        {children}
        
        <div style={{ position: 'fixed', bottom: '20px', right: isAr ? 'auto' : '20px', left: isAr ? '20px' : 'auto', zIndex: 999 }}>
          {chatOpen && (
            <div style={{ width: '350px', height: '450px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', marginBottom: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: '#F59E0B', padding: '15px 20px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🤖 AI Assistant</span>
                <span onClick={() => setChatOpen(false)} style={{ cursor: 'pointer', opacity: 0.7 }}>✖</span>
              </div>
              <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#F8FAFC' }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ margin: '10px 0', textAlign: m.sender === 'user' ? (isAr ? 'left' : 'right') : (isAr ? 'right' : 'left') }}>
                    <span style={{ background: m.sender === 'user' ? '#E2E8F0' : '#1E3A8A', color: m.sender === 'user' ? '#333' : '#fff', padding: '10px 15px', borderRadius: '12px', display: 'inline-block', fontSize: '14px', maxWidth: '80%' }}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid #E2E8F0', padding: '10px', background: 'white' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask..." style={{ flex: 1, border: '1px solid #E2E8F0', padding: '10px 15px', outline: 'none', borderRadius: '8px' }} />
                <button onClick={handleSendMessage} style={{ background: '#F59E0B', color: '#0F172A', border: 'none', padding: '0 20px', cursor: 'pointer', borderRadius: '8px', marginLeft: isAr ? '0' : '10px', marginRight: isAr ? '10px' : '0', fontWeight: 'bold' }}>Send</button>
              </div>
            </div>
          )}
          <button onClick={() => setChatOpen(!chatOpen)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: '#F59E0B', border: 'none', fontSize: '28px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', transition: 'transform 0.3s ease' }}>💬</button>
        </div>
      </div>
    </div>
  );
}
