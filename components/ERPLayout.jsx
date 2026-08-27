'use client';

import React, { useState, useEffect } from 'react';
import ERPModals from './ERPModals';

export default function ERPLayout({ 
  children, tr, lang, setLang, theme, setTheme, page, setPage, 
  modal, setModal, passForm, setPassForm, handleChangePassword, 
  handleLogout, handleSendMessage, chatOpen, setChatOpen, 
  chatMessages, chatInput, setChatInput, userProfile, menu, 
  settleForm, setSettleForm, handleSettlePayment, 
  refundForm, setRefundForm, handleRefund, 
  previewHTML, downloadPDF, data 
}) {
  const isAr = lang === 'ar';
  const t = (key, fallback) => tr?.[key] || fallback || key;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group menu by section
  const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  // Get sidebar width based on collapse state
  const sidebarWidth = sidebarCollapsed ? '72px' : '280px';
  const sidebarPadding = sidebarCollapsed ? '12px' : '16px';

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: isAr ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Poppins', sans-serif",
      background: 'var(--bg-primary, #0F172A)',
      direction: isAr ? 'rtl' : 'ltr',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      <ERPModals 
        modal={modal} 
        setModal={setModal} 
        passForm={passForm} 
        setPassForm={setPassForm} 
        handleChangePassword={handleChangePassword} 
        settleForm={settleForm} 
        setSettleForm={setSettleForm} 
        handleSettlePayment={handleSettlePayment} 
        refundForm={refundForm} 
        setRefundForm={setRefundForm} 
        handleRefund={handleRefund} 
        previewHTML={previewHTML} 
        downloadPDF={downloadPDF}
      />

      {/* ===== MOBILE HEADER ===== */}
      <div style={{
        display: 'none',
        '@media (max-width: 768px)': { display: 'flex' },
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'linear-gradient(135deg, #0F172A, #1E3A8A)',
        zIndex: 100,
        padding: '0 16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #334155'
      }}>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{
          background: 'none',
          border: 'none',
          color: '#FBBF24',
          fontSize: '24px',
          cursor: 'pointer'
        }}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        <div style={{ color: '#FBBF24', fontWeight: 700, fontSize: '14px' }}>
          ✈️ SUEUD AL TAAYIRA
        </div>
        <button onClick={() => setChatOpen(!chatOpen)} style={{
          background: 'none',
          border: 'none',
          color: '#FBBF24',
          fontSize: '20px',
          cursor: 'pointer'
        }}>
          💬
        </button>
      </div>

      {/* ===== SIDEBAR ===== */}
      <div style={{
        width: sidebarWidth,
        background: 'var(--bg-secondary, #1E293B)',
        borderRight: '1px solid var(--border-color, #334155)',
        padding: `${sidebarPadding} 10px`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 99,
        transition: 'width 0.3s ease, transform 0.3s ease',
        overflow: 'hidden',
        '@media (max-width: 768px)': {
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          width: '280px',
          boxShadow: '4px 0 30px rgba(0,0,0,0.5)'
        }
      }}>
        {/* ===== LOGO ===== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 8px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border-color, #334155)',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
        }}>
          <div style={{
            width: sidebarCollapsed ? '40px' : '48px',
            height: sidebarCollapsed ? '40px' : '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: sidebarCollapsed ? '18px' : '22px',
            flexShrink: 0,
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
          }}>
            ✈️
          </div>
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#FBBF24',
                lineHeight: 1.2,
                whiteSpace: 'nowrap'
              }}>
                SUEUD AL TAAYIRA
              </div>
              <div style={{
                fontSize: '8px',
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                whiteSpace: 'nowrap'
              }}>
                Travel ERP System
              </div>
            </div>
          )}
        </div>

        {/* ===== COLLAPSE TOGGLE ===== */}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
          background: 'none',
          border: 'none',
          color: '#64748B',
          cursor: 'pointer',
          padding: '6px 12px',
          fontSize: '16px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          gap: '8px',
          borderRadius: '8px',
          transition: 'all 0.2s'
        }}>
          {sidebarCollapsed ? '→' : '←'}
          {!sidebarCollapsed && <span style={{ fontSize: '11px', fontWeight: 600 }}>Collapse</span>}
        </button>

        {/* ===== LANGUAGE TOGGLE ===== */}
        <button onClick={() => setLang(isAr ? 'en' : 'ar')} style={{
          padding: '10px 14px',
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#60A5FA',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 700,
          marginBottom: '12px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          gap: '8px',
          transition: 'all 0.2s'
        }}>
          <span style={{ fontSize: '16px' }}>🌐</span>
          {!sidebarCollapsed && (isAr ? 'English' : 'العربية')}
        </button>

        {/* ===== DARK MODE TOGGLE ===== */}
        <button onClick={() => setTheme?.(theme === 'dark' ? 'light' : 'dark')} style={{
          padding: '10px 14px',
          background: theme === 'dark' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(15, 23, 42, 0.1)',
          color: theme === 'dark' ? '#FBBF24' : '#0F172A',
          border: theme === 'dark' ? '1px solid rgba(251, 191, 36, 0.2)' : '1px solid rgba(15, 23, 42, 0.2)',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 700,
          marginBottom: '16px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          gap: '8px',
          transition: 'all 0.2s'
        }}>
          <span style={{ fontSize: '16px' }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
          {!sidebarCollapsed && (theme === 'dark' ? (isAr ? 'الوضع الفاتح' : 'Light Mode') : (isAr ? 'الوضع الداكن' : 'Dark Mode'))}
        </button>

        {/* ===== MENU ===== */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          padding: '0 4px'
        }}>
          {Object.keys(groupedMenu).map(section => (
            <div key={section} style={{ marginBottom: '8px' }}>
              {!sidebarCollapsed && (
                <h4 style={{
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: '#64748B',
                  margin: '12px 10px 6px',
                  fontWeight: 700
                }}>
                  {section}
                </h4>
              )}
              {groupedMenu[section].map(m => {
                const isActive = page === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setPage(m.id);
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      padding: sidebarCollapsed ? '10px' : '10px 14px',
                      margin: '2px 0',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: isActive
                        ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                        : 'transparent',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      fontSize: '13px',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: isActive ? '0 4px 15px rgba(37, 99, 235, 0.3)' : 'none',
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      position: 'relative'
                    }}
                  >
                    <span style={{
                      fontSize: sidebarCollapsed ? '18px' : '16px',
                      width: sidebarCollapsed ? 'auto' : '20px',
                      textAlign: 'center'
                    }}>
                      {m.icon || '📄'}
                    </span>
                    {!sidebarCollapsed && <span>{m.label}</span>}
                    {isActive && !sidebarCollapsed && (
                      <span style={{
                        position: 'absolute',
                        right: '10px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#FBBF24'
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ===== USER PROFILE ===== */}
        <div style={{
          borderTop: '1px solid var(--border-color, #334155)',
          paddingTop: '16px',
          marginTop: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: sidebarCollapsed ? '8px' : '10px 14px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            border: '1px solid var(--border-color, #334155)',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
          }}>
            <div style={{
              width: sidebarCollapsed ? '36px' : '40px',
              height: sidebarCollapsed ? '36px' : '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: sidebarCollapsed ? '14px' : '16px',
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              {userProfile?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-primary, #F8FAFC)',
                  whiteSpace: 'nowrap'
                }}>
                  {userProfile?.username || 'User'}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#94A3B8',
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}>
                  {userProfile?.role || 'Staff'}
                </div>
              </div>
            )}
          </div>
          
          {!sidebarCollapsed && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div
                onClick={() => setModal({ type: 'password', data: null })}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#94A3B8',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                🔒 {t('changePass', 'Change Password')}
              </div>
              <div
                onClick={handleLogout}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#EF4444',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                🚪 {t('logout', 'Logout')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== SIDEBAR OVERLAY (Mobile) ===== */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 98
          }}
        />
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div style={{
        flex: 1,
        marginLeft: sidebarWidth,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        background: 'var(--bg-primary, #0F172A)',
        height: '100vh',
        paddingTop: '0',
        transition: 'margin-left 0.3s ease',
        '@media (max-width: 768px)': {
          marginLeft: 0,
          paddingTop: '64px'
        }
      }}>
        {children}
        
        {/* ===== AI CHAT WIDGET ===== */}
        <div style={{
          position: 'fixed',
          bottom: '24px',
          [isAr ? 'left' : 'right']: '24px',
          zIndex: 50
        }}>
          {chatOpen && (
            <div style={{
              width: '360px',
              maxHeight: '500px',
              background: 'var(--bg-secondary, #1E293B)',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '12px',
              overflow: 'hidden',
              border: '1px solid var(--border-color, #334155)',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                color: '#FFFFFF',
                padding: '16px 20px',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🤖</span>
                  AI Travel Assistant
                </span>
                <span
                  onClick={() => setChatOpen(false)}
                  style={{ cursor: 'pointer', opacity: 0.8, fontSize: '18px' }}
                >
                  ✕
                </span>
              </div>
              <div style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                background: 'var(--bg-primary, #0F172A)',
                maxHeight: '350px'
              }}>
                {chatMessages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      margin: '10px 0',
                      textAlign: m.sender === 'user' ? (isAr ? 'left' : 'right') : (isAr ? 'right' : 'left')
                    }}
                  >
                    <span style={{
                      background: m.sender === 'user'
                        ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                        : 'var(--bg-secondary, #1E293B)',
                      color: m.sender === 'user' ? '#fff' : 'var(--text-primary, #F8FAFC)',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      display: 'inline-block',
                      fontSize: '13px',
                      maxWidth: '85%',
                      lineHeight: '1.5',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: m.sender === 'bot' ? '1px solid var(--border-color, #334155)' : 'none'
                    }}>
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{
                display: 'flex',
                padding: '12px',
                background: 'var(--bg-secondary, #1E293B)',
                borderTop: '1px solid var(--border-color, #334155)',
                gap: '8px'
              }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isAr ? 'اسأل عن الرحلات...' : 'Ask about flights...'}
                  style={{
                    flex: 1,
                    background: 'var(--bg-primary, #0F172A)',
                    border: '1px solid var(--border-color, #334155)',
                    padding: '10px 14px',
                    outline: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: 'var(--text-primary, #F8FAFC)'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                    color: '#fff',
                    border: 'none',
                    padding: '0 18px',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
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
              background: 'linear-gradient(135deg, #2563EB, #8B5CF6)',
              color: '#fff',
              border: 'none',
              fontSize: '26px',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s'
            }}
          >
            {chatOpen ? '✕' : '💬'}
          </button>
        </div>
      </div>
    </div>
  );
}
