'use client';
import React from 'react';
import ERPModals from './ERPModals';

export default function ERPLayout({ children, tr, lang, setLang, page, setPage, modal, setModal, passForm, setPassForm, handleChangePassword, handleLogout, handleSendMessage, chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, userProfile, menu, settleForm, setSettleForm, handleSettlePayment, refundForm, setRefundForm, handleRefund, previewHTML, downloadPDF }) {
  const isAr = lang === 'ar';
  const t = (key, fallback) => tr?.[key] || fallback || key;

  const groupedMenu = menu.reduce((acc, item) => {
    (acc[item.section] = acc[item.section] || []).push(item);
    return acc;
  }, {});

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: isAr ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Poppins', sans-serif", 
      background: '#0A0F1C', 
      direction: isAr ? 'rtl' : 'ltr' 
    }}>
      
      <ERPModals 
        modal={modal} setModal={setModal} passForm={passForm} setPassForm={setPassForm} 
        handleChangePassword={handleChangePassword} settleForm={settleForm} setSettleForm={setSettleForm} 
        handleSettlePayment={handleSettlePayment} refundForm={refundForm} setRefundForm={setRefundForm} 
        handleRefund={handleRefund} previewHTML={previewHTML} downloadPDF={downloadPDF}
      />

      {/* ═══════ SIDEBAR ═══════ */}
      <div style={{ 
        width: '280px', 
        background: 'linear-gradient(180deg, #0F172A 0%, #1a2332 50%, #0F172A 100%)', 
        color: 'white', 
        padding: '20px 12px', 
        display: 'flex', 
        flexDirection: 'column',
        borderInlineEnd: '1px solid rgba(251, 191, 36, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effect */}
        <div style={{ 
          position: 'absolute', 
          top: '-50%', 
          insetInlineStart: '-50%', 
          width: '200%', 
          height: '200%', 
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{ 
          marginBottom: '20px', 
          textAlign: 'center', 
          padding: '20px 10px',
          borderBottom: '1px solid rgba(251, 191, 36, 0.15)',
          position: 'relative'
        }}>
          <div style={{ 
            fontSize: '32px', 
            marginBottom: '8px',
            filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.3))'
          }}>✈️</div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px' 
          }}>SUEUD AL TAAYIRA</h1>
          <p style={{ 
            margin: '5px 0 0', 
            fontSize: '11px', 
            color: '#64748B',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>ERP System</p>
        </div>
        
        {/* Language Toggle */}
        <button 
          onClick={() => setLang(isAr ? 'en' : 'ar')} 
          style={{ 
            padding: '10px 16px', 
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1))',
            color: '#FBBF24', 
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: '700', 
            marginBottom: '20px', 
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            ':hover': {
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(245, 158, 11, 0.2))',
              transform: 'translateY(-1px)'
            }
          }}
        >
          <span style={{ fontSize: '16px' }}>🌐</span>
          {isAr ? 'English' : 'العربية'}
        </button>

        {/* Menu Items */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
          {Object.keys(groupedMenu).map(section => (
            <div key={section} style={{ marginBottom: '8px' }}>
              <h4 style={{ 
                fontSize: '9px', 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                color: '#475569', 
                margin: '12px 12px 6px', 
                fontWeight: '700'
              }}>{section}</h4>
              {groupedMenu[section].map(m => {
                const isActive = page === m.id;
                return (
                  <div 
                    key={m.id} 
                    onClick={() => setPage(m.id)} 
                    style={{ 
                      padding: '10px 14px', 
                      margin: '2px 4px',
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      background: isActive 
                        ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1))' 
                        : 'transparent', 
                      fontWeight: isActive ? '700' : '500', 
                      color: isActive ? '#FBBF24' : '#94A3B8', 
                      borderInlineStart: isActive ? '3px solid #FBBF24' : '3px solid transparent',
                      fontSize: '13px', 
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      ':hover': {
                        background: 'rgba(255, 255, 255, 0.03)',
                        color: '#E2E8F0'
                      }
                    }}
                  >
                    <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{m.icon || '📄'}</span>
                    <span>{m.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.08)', 
          paddingTop: '15px', 
          marginTop: '10px',
          background: 'rgba(0,0,0,0.2)',
          margin: '0 -12px -12px',
          padding: '15px 12px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginBottom: '12px',
            padding: '10px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ 
              width: '38px', 
              height: '38px', 
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold', 
              fontSize: '15px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              {userProfile?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#E2E8F0' }}>{userProfile?.username}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>{userProfile?.role}</div>
            </div>
          </div>
          <div 
            onClick={() => setModal({ type: 'password', data: null })} 
            style={{ 
              padding: '8px 12px', 
              cursor: 'pointer', 
              fontSize: '12px', 
              color: '#94A3B8', 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              ':hover': { background: 'rgba(255,255,255,0.03)', color: '#E2E8F0' }
            }}
          >🔒 {t('changePass', 'Change Password')}</div>
          <div 
            onClick={handleLogout} 
            style={{ 
              padding: '8px 12px', 
              cursor: 'pointer', 
              fontSize: '12px', 
              color: '#EF4444', 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              ':hover': { background: 'rgba(239, 68, 68, 0.1)' }
            }}
          >🚪 {t('logout', 'Logout')}</div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        position: 'relative', 
        background: '#0A0F1C',
        scrollbarWidth: 'thin',
        scrollbarColor: '#1E293B #0A0F1C'
      }}>
        {children}
        
        {/* AI Chat Widget */}
        <div style={{ 
          position: 'fixed', 
          bottom: '24px', 
          [isAr ? 'left' : 'right']: '24px', 
          zIndex: 999 
        }}>
          {chatOpen && (
            <div style={{ 
              width: '360px', 
              height: '450px', 
              background: '#1E293B', 
              borderRadius: '16px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(251, 191, 36, 0.1)', 
              display: 'flex', 
              flexDirection: 'column', 
              marginBottom: '12px', 
              overflow: 'hidden',
              border: '1px solid rgba(251, 191, 36, 0.15)'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #0F172A, #1E293B)', 
                color: '#FBBF24', 
                padding: '16px 20px', 
                fontWeight: '700', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid rgba(251, 191, 36, 0.1)'
              }}>
                <span style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🤖</span>
                  AI Assistant
                </span>
                <span 
                  onClick={() => setChatOpen(false)} 
                  style={{ cursor: 'pointer', opacity: 0.6, fontSize: '18px', padding: '4px' }}
                >✕</span>
              </div>
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#0A0F1C' }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ 
                    margin: '10px 0', 
                    textAlign: m.sender === 'user' ? (isAr ? 'left' : 'right') : (isAr ? 'right' : 'left') 
                  }}>
                    <span style={{ 
                      background: m.sender === 'user' 
                        ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' 
                        : 'linear-gradient(135deg, #1E293B, #334155)', 
                      color: '#fff', 
                      padding: '10px 14px', 
                      borderRadius: '12px 12px 12px 2px', 
                      display: 'inline-block', 
                      fontSize: '13px', 
                      maxWidth: '85%',
                      lineHeight: '1.5',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ 
                display: 'flex', 
                padding: '12px', 
                background: '#1E293B',
                borderTop: '1px solid rgba(255,255,255,0.05)'
              }}>
                <input 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                  placeholder={isAr ? 'اسأل...' : 'Ask...'} 
                  style={{ 
                    flex: 1, 
                    background: '#0F172A', 
                    border: '1px solid #334155', 
                    padding: '10px 14px', 
                    outline: 'none', 
                    borderRadius: '8px', 
                    fontSize: '13px', 
                    color: '#E2E8F0',
                    ':focus': { borderColor: '#FBBF24' }
                  }} 
                />
                <button 
                  onClick={handleSendMessage} 
                  style={{ 
                    background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', 
                    color: '#0F172A', 
                    border: 'none', 
                    padding: '0 18px', 
                    cursor: 'pointer', 
                    borderRadius: '8px', 
                    marginInlineStart: '8px', 
                    fontWeight: '800', 
                    fontSize: '13px'
                  }}>
                  {isAr ? 'إرسال' : 'Send'}
                </button>
              </div>
            </div>
          )}
          <button 
            onClick={() => setChatOpen(!chatOpen)} 
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', 
              color: '#0F172A', 
              border: 'none', 
              fontSize: '26px', 
              cursor: 'pointer', 
              boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)',
              transition: 'transform 0.2s',
              ':hover': { transform: 'scale(1.1)' }
            }}>💬</button>
        </div>
      </div>
    </div>
  );
}
