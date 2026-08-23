'use client';

import React from 'react';
import ERPModals from './ERPModals';

export default function ERPLayout({ children, tr, lang, setLang, page, setPage, modal, setModal, passForm, setPassForm, handleChangePassword, handleLogout, handleSendMessage, chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, userProfile, menu, settleForm, setSettleForm, handleSettlePayment, refundForm, setRefundForm, handleRefund, previewHTML, downloadPDF }) {
  const isAr = lang === 'ar';
  const alignSide = isAr ? 'right' : 'left';

  // Group menu by sections
  const groupedMenu = menu.reduce((acc, item) => {
    (acc[item.section] = acc[item.section] || []).push(item);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Poppins', sans-serif", background: '#F1F5F9', direction: isAr ? 'rtl' : 'ltr' }}>
      
      <ERPModals 
        modal={modal} setModal={setModal} passForm={passForm} setPassForm={setPassForm} 
        handleChangePassword={handleChangePassword} settleForm={settleForm} setSettleForm={setSettleForm} 
        handleSettlePayment={handleSettlePayment} refundForm={refundForm} setRefundForm={setRefundForm} 
        handleRefund={handleRefund} previewHTML={previewHTML} downloadPDF={downloadPDF}
      />

      <div style={{ width: '270px', background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)', color: 'white', padding: '25px 15px', display: 'flex', flexDirection: 'column', boxShadow: isAr ? '-5px 0 15px rgba(0,0,0,0.1)' : '5px 0 15px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#F59E0B', letterSpacing: '1px' }}>SUEUD AL TAAYIRA</h1>
          <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#94A3B8' }}>ERP System</p>
        </div>
        
        <button 
          onClick={() => setLang(isAr ? 'en' : 'ar')} 
          style={{ padding: '8px 15px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0F172A', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px', fontSize: '13px' }}
        >
          🌐 {isAr ? 'English' : 'العربية'}
        </button>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
          {Object.keys(groupedMenu).map(section => (
            <div key={section} style={{ marginBottom: '15px' }}>
              <h4 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748B', margin: '10px 5px', fontWeight: '700' }}>{section}</h4>
              {groupedMenu[section].map(m => (
                <div 
                  key={m.id} 
                  onClick={() => setPage(m.id)} 
                  style={{ 
                    padding: '10px 12px', marginBottom: '3px', borderRadius: '6px', cursor: 'pointer', 
                    background: page === m.id ? 'rgba(245, 158, 11, 0.15)' : 'transparent', 
                    fontWeight: page === m.id ? 'bold' : '500', 
                    color: page === m.id ? '#F59E0B' : '#CBD5E1', 
                    borderInlineStart: page === m.id ? '3px solid #F59E0B' : '3px solid transparent',
                    fontSize: '13px', transition: 'all 0.2s ease'
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', marginTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
            <div style={{ width: '32px', height: '32px', background: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
              {userProfile?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{userProfile?.username}</div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>{userProfile?.role}</div>
            </div>
          </div>
          <div onClick={() => setModal({ type: 'password', data: null })} style={{ padding: '8px', cursor: 'pointer', fontSize: '13px', color: '#94A3B8', borderRadius: '4px' }}>🔒 {tr.changePass}</div>
          <div onClick={handleLogout} style={{ padding: '8px', cursor: 'pointer', fontSize: '13px', color: '#EF4444', borderRadius: '4px' }}>🚪 {tr.logout}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '30px', position: 'relative', background: '#F8FAFC' }}>
        {children}
        
        <div style={{ position: 'fixed', bottom: '20px', right: isAr ? 'auto' : '20px', left: isAr ? '20px' : 'auto', zIndex: 999 }}>
          {chatOpen && (
            <div style={{ width: '320px', height: '400px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', marginBottom: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: '#F59E0B', padding: '12px 15px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>🤖 AI Assistant</span>
                <span onClick={() => setChatOpen(false)} style={{ cursor: 'pointer', opacity: 0.7 }}>✖</span>
              </div>
              <div style={{ flex: 1, padding: '10px', overflowY: 'auto', background: '#F8FAFC' }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ margin: '8px 0', textAlign: m.sender === 'user' ? (isAr ? 'left' : 'right') : (isAr ? 'right' : 'left') }}>
                    <span style={{ background: m.sender === 'user' ? '#E2E8F0' : '#1E3A8A', color: m.sender === 'user' ? '#333' : '#fff', padding: '8px 12px', borderRadius: '10px', display: 'inline-block', fontSize: '13px', maxWidth: '80%' }}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid #E2E8F0', padding: '8px', background: 'white' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask..." style={{ flex: 1, border: '1px solid #E2E8F0', padding: '8px 12px', outline: 'none', borderRadius: '6px', fontSize: '13px' }} />
                <button onClick={handleSendMessage} style={{ background: '#F59E0B', color: '#0F172A', border: 'none', padding: '0 15px', cursor: 'pointer', borderRadius: '6px', marginLeft: isAr ? '0' : '8px', marginRight: isAr ? '8px' : '0', fontWeight: 'bold', fontSize: '13px' }}>Send</button>
              </div>
            </div>
          )}
          <button onClick={() => setChatOpen(!chatOpen)} style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: '#F59E0B', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>💬</button>
        </div>
      </div>
    </div>
  );
}
