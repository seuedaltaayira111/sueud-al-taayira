'use client';
import React from 'react';
import ERPModals from './ERPModals';

export default function ERPLayout({ children, tr, lang, setLang, theme, setTheme, page, setPage, modal, setModal, passForm, setPassForm, handleChangePassword, handleLogout, handleSendMessage, chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, userProfile, menu, settleForm, setSettleForm, handleSettlePayment, refundForm, setRefundForm, handleRefund, previewHTML, downloadPDF }) {
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
      fontFamily: isAr ? "'Tajawal', 'Cairo', sans-serif" : "'Inter', 'Poppins', sans-serif", 
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 50%, #FFF7ED 100%)', 
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
        background: '#FFFFFF',
        boxShadow: '4px 0 25px rgba(0,0,0,0.05)',
        padding: '20px 12px', 
        display: 'flex', 
        flexDirection: 'column',
        borderInlineEnd: '1px solid #E2E8F0',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 10
      }}>
        {/* Logo */}
        <div style={{ 
          marginBottom: '20px', 
          textAlign: 'center', 
          padding: '20px 10px',
          borderBottom: '2px solid #F3F4F6',
          position: 'relative'
        }}>
          <div style={{ 
            width: '60px', height: '60px', margin: '0 auto 10px',
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            borderRadius: '16px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '30px',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
          }}>✈️</div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '15px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #1E40AF, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px' 
          }}>SUEUD AL TAAYIRA</h1>
          <p style={{ 
            margin: '4px 0 0', 
            fontSize: '11px', 
            color: '#6B7280',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>Travel ERP System</p>
        </div>
        
        {/* Language Toggle */}
        <button 
          onClick={() => setLang(isAr ? 'en' : 'ar')} 
          style={{ 
            padding: '10px 16px', 
            background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)',
            color: '#4F46E5', 
            border: '1px solid #C7D2FE',
            borderRadius: '12px', 
            cursor: 'pointer', 
            fontWeight: '700', 
            marginBottom: '20px', 
            fontSize: '13px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '16px' }}>🌐</span>
          {isAr ? 'English' : 'العربية'}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setTheme?.(theme === 'dark' ? 'light' : 'dark')}
          style={{
            padding: '10px 16px',
            background: theme === 'dark' ? 'linear-gradient(135deg, #1E293B, #0F172A)' : 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            color: theme === 'dark' ? '#FBBF24' : '#92400E',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #FDE68A',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            marginBottom: '20px',
            fontSize: '13px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '16px' }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
          {theme === 'dark' ? (isAr ? 'الوضع الفاتح' : 'Light Mode') : (isAr ? 'الوضع الداكن' : 'Dark Mode')}
        </button>

        {/* Menu Items */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
          {Object.keys(groupedMenu).map(section => (
            <div key={section} style={{ marginBottom: '8px' }}>
              <h4 style={{ 
                fontSize: '10px', 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px', 
                color: '#9CA3AF', 
                margin: '16px 12px 6px', 
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
                      borderRadius: '10px', 
                      cursor: 'pointer', 
                      background: isActive 
                        ? 'linear-gradient(135deg, #3B82F6, #6366F1)' 
                        : 'transparent', 
                      fontWeight: isActive ? '700' : '500', 
                      color: isActive ? '#FFFFFF' : '#4B5563', 
                      fontSize: '13px', 
                      transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
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
          borderTop: '1px solid #F3F4F6', 
          paddingTop: '15px', 
          marginTop: '10px'
        }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px',
            padding: '10px',
            background: '#F9FAFB',
            borderRadius: '12px',
            border: '1px solid #F3F4F6'
          }}>
            <div style={{ 
              width: '40px', height: '40px', 
              background: 'linear-gradient(135deg, #10B981, #059669)', 
              borderRadius: '12px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 'bold', fontSize: '16px', color: '#fff',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
            }}>
              {userProfile?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>{userProfile?.username}</div>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500' }}>{userProfile?.role}</div>
            </div>
          </div>
          <div 
            onClick={() => setModal({ type: 'password', data: null })} 
            style={{ 
              padding: '8px 12px', cursor: 'pointer', fontSize: '12px', color: '#4B5563', 
              borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px',
              ':hover': { background: '#F3F4F6' }
            }}
          >🔒 {t('changePass', 'Change Password')}</div>
          <div 
            onClick={handleLogout} 
            style={{ 
              padding: '8px 12px', cursor: 'pointer', fontSize: '12px', color: '#EF4444', 
              borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px',
              ':hover': { background: '#FEF2F2' }
            }}
          >🚪 {t('logout', 'Logout')}</div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        position: 'relative', 
        background: '#0F172A',
        scrollbarWidth: 'thin',
        scrollbarColor: '#334155 #0F172A'
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
              width: '360px', height: '450px', 
              background: '#FFFFFF', 
              borderRadius: '20px', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)', 
              display: 'flex', flexDirection: 'column', 
              marginBottom: '12px', overflow: 'hidden',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', 
                color: '#FFFFFF', padding: '16px 20px', fontWeight: '700', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🤖</span> AI Assistant
                </span>
                <span onClick={() => setChatOpen(false)} style={{ cursor: 'pointer', opacity: 0.8, fontSize: '18px' }}>✕</span>
              </div>
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#F9FAFB' }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ margin: '10px 0', textAlign: m.sender === 'user' ? (isAr ? 'left' : 'right') : (isAr ? 'right' : 'left') }}>
                    <span style={{ 
                      background: m.sender === 'user' ? 'linear-gradient(135deg, #3B82F6, #6366F1)' : '#FFFFFF', 
                      color: m.sender === 'user' ? '#fff' : '#1F2937', 
                      padding: '10px 14px', borderRadius: '12px', display: 'inline-block', fontSize: '13px', 
                      maxWidth: '85%', lineHeight: '1.5',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', padding: '12px', background: '#FFFFFF', borderTop: '1px solid #F3F4F6' }}>
                <input 
                  value={chatInput} onChange={e => setChatInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                  placeholder={isAr ? 'اسأل...' : 'Ask...'} 
                  style={{ 
                    flex: 1, background: '#F3F4F6', border: '1px solid #E5E7EB', 
                    padding: '10px 14px', outline: 'none', borderRadius: '10px', 
                    fontSize: '13px', color: '#1F2937' 
                  }} 
                />
                <button onClick={handleSendMessage} style={{ 
                  background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: '#fff', border: 'none', 
                  padding: '0 18px', cursor: 'pointer', borderRadius: '10px', marginInlineStart: '8px', fontWeight: '700', fontSize: '13px'
                }}>
                  {isAr ? 'إرسال' : 'Send'}
                </button>
              </div>
            </div>
          )}
          <button onClick={() => setChatOpen(!chatOpen)} style={{ 
            width: '56px', height: '56px', borderRadius: '16px', 
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', border: 'none', 
            fontSize: '26px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
          }}>💬</button>
        </div>
      </div>
    </div>
  );
}
