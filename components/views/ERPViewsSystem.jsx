'use client';
import React, { useState } from 'react';

const styles = { 
  input: { width: '100%', padding: '12px 15px', margin: '6px 0', border: '1px solid #334155', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px', background: '#0F172A', color: '#E2E8F0' }, 
  btnPrimary: { padding: '12px 15px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)' }, 
  btnSuccess: { padding: '8px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  btnDanger: { padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }, 
  btnWarning: { padding: '8px 12px', background: '#FBBF24', color: '#1E293B', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }, 
  card: { background: '#1E293B', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', marginBottom: '20px', border: '1px solid #334155' }, 
  label: { fontSize: '13px', fontWeight: '600', color: '#94A3B8', marginBottom: '6px', display: 'block', marginTop: '12px' },
  tableHeader: { background: '#0F172A', color: '#FBBF24', padding: '15px', textAlign: 'start', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #334155' },
  tableCell: { padding: '15px', borderBottom: '1px solid #1E293B', fontSize: '14px', color: '#CBD5E1' },
  tabBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', background: '#334155', color: '#94A3B8', transition: 'all 0.2s' },
  tabBtnActive: { background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)' }
};

export default function ERPViewsSystem(props) {
  const { 
    page, data, tr, userProfile, user, lang,
    setForm, setSetForm, profileForm, setProfileForm, 
    passForm, setPassForm, userForm, setUserForm,
    tenantForm, setTenantForm,
    contractCorpName, setContractCorpName, 
    contractType, setContractType, 
    contractMarkup, setContractMarkup, 
    contractTerms, setContractTerms,
    handleSaveSettings, handleSaveProfile, handleChangePassword, 
    handleLogout, handleDelete, handleLogoUpload, handleProfilePicUpload,
    handleAddTenant, handleToggleSubscription, handleDeleteTenant,
    handleGenerateContract, handleGenerateOffer,
    handleAddCustomField, handleRemoveCustomField, handleCustomFieldChange,
    setModal, setPage, showToast
  } = props;
  
  const [statementType, setStatementType] = useState('bank');
  const [reportTab, setReportTab] = useState('sales');
  const [repDate, setRepDate] = useState({ from: '', to: '' });

  const filterData = (items, dateField) => {
    if (!items) return [];
    let filtered = items;
    if (repDate.from) filtered = filtered.filter(i => i[dateField] >= repDate.from);
    if (repDate.to) filtered = filtered.filter(i => i[dateField] <= repDate.to);
    return filtered;
  };

  const exportToExcel = (data, filename) => {
    if (!data || data.length === 0) {
      showToast?.('No data to export') || alert('No data to export');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const updateSetForm = (updates) => {
    if (setSetForm) {
      setSetForm(prev => ({ ...(prev || {}), ...updates }));
    }
  };

  const currentSetForm = setForm || {};

  // ═══════════════════════════════════════════════════════════════════════════════
  // 1. PROFITABILITY ANALYZER
  // ═══════════════════════════════════════════════════════════════════════════════
  if (page === 'profitability') {
    const activeInvoices = (data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-'));
    const airlineProfits = {};
    activeInvoices.forEach(inv => {
      const key = inv.airline || inv.service_type || 'Unknown';
      if (!airlineProfits[key]) airlineProfits[key] = { revenue: 0, cost: 0, profit: 0, count: 0 };
      airlineProfits[key].revenue += (inv.total_sell || 0);
      airlineProfits[key].cost += (inv.total_cost || 0);
      airlineProfits[key].profit += (inv.profit || 0);
      airlineProfits[key].count += 1;
    });
    const sortedAirlines = Object.keys(airlineProfits).map(k => ({ name: k, ...airlineProfits[k] })).sort((a, b) => b.profit - a.profit);
    const maxProfit = sortedAirlines.length > 0 ? Math.max(...sortedAirlines.map(a => Math.abs(a.profit)), 1) : 1;

    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#FBBF24' }}>📊 Ticket Profitability Analyzer</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Analyze which airlines or services are generating the most profit.</p>
        </div>
        <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Airline / Service</th>
                  <th style={styles.tableHeader}>Tickets Sold</th>
                  <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Total Revenue</th>
                  <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Total Cost</th>
                  <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {sortedAirlines.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>No invoice data available. Create invoices to see profitability analysis.</td></tr>
                ) : (
                  sortedAirlines.map((a, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1E293B' }}>
                      <td style={{...styles.tableCell, fontWeight: 'bold', color: '#FBBF24'}}>{a.name}</td>
                      <td style={{ ...styles.tableCell, textAlign: 'center' }}>{a.count}</td>
                      <td style={{...styles.tableCell, color: '#34D399', textAlign: 'right'}}>{a.revenue.toFixed(2)} SAR</td>
                      <td style={{...styles.tableCell, color: '#FCA5A5', textAlign: 'right'}}>{a.cost.toFixed(2)} SAR</td>
                      <td style={styles.tableCell}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: 1, background: '#0F172A', borderRadius: '6px', overflow: 'hidden', height: '10px' }}>
                            <div style={{ width: `${(Math.abs(a.profit) / maxProfit) * 100}%`, background: a.profit > 0 ? '#059669' : '#EF4444', height: '100%' }}></div>
                          </div>
                          <span style={{ fontWeight: 'bold', color: a.profit > 0 ? '#34D399' : '#FCA5A5', minWidth: '100px', textAlign: 'right' }}>{a.profit.toFixed(2)}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 2. PROFILE PAGE
  // ═══════════════════════════════════════════════════════════════════════════════
  if (page === 'profile') {
    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <h2 style={{ color: '#FBBF24', marginBottom: '20px' }}>👤 {tr?.profile || 'Profile'}</h2>
        <div style={{...styles.card, maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 15px',
              background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '40px', color: 'white', overflow: 'hidden', border: '3px solid #FBBF24'
            }}>
              {profileForm?.avatar_url ? (
                <img src={profileForm.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (userProfile?.username || userProfile?.name || 'U')?.charAt(0)?.toUpperCase()
              )}
            </div>
            <h3 style={{ marginTop: '0', color: '#FBBF24', marginBottom: '5px' }}>{profileForm?.username || userProfile?.username || 'User'}</h3>
            <p style={{ color: '#94A3B8', margin: 0 }}>{userProfile?.email || user?.email}</p>
            <span style={{ 
              padding: '4px 12px', borderRadius: '12px', background: '#1E3A8A', color: '#60A5FA', 
              fontSize: '11px', fontWeight: '700', display: 'inline-block', marginTop: '8px'
            }}>
              {userProfile?.role || 'Staff'}
            </span>
          </div>
          
          <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={styles.label}>Update Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleProfilePicUpload} style={{ ...styles.input, padding: '10px', border: 'none' }} />
            </div>
            <div>
              <label style={styles.label}>Username</label>
              <input value={profileForm?.username || ''} onChange={e => setProfileForm(prev => ({...prev, username: e.target.value }))} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Phone Number</label>
              <input value={profileForm?.phone || ''} onChange={e => setProfileForm(prev => ({...prev, phone: e.target.value }))} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Address</label>
              <input value={profileForm?.address || ''} onChange={e => setProfileForm(prev => ({...prev, address: e.target.value }))} style={styles.input} />
            </div>
            <button type="submit" style={styles.btnPrimary}>💾 Save Profile Changes</button>
          </form>

          <div style={{ marginTop: '30px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
            <h3 style={{ color: '#FBBF24', marginTop: '0', marginBottom: '15px' }}>🔒 Security</h3>
            <form onSubmit={handleChangePassword}>
              <label style={styles.label}>New Password</label>
              <input 
                type="password" 
                value={passForm?.newPass || ''} 
                onChange={e => setPassForm(prev => ({...prev, newPass: e.target.value}))} 
                style={styles.input} 
                required 
                minLength={6}
                placeholder="Minimum 6 characters"
              />
              <button type="submit" style={{ ...styles.btnWarning, width: '100%', marginTop: '10px', padding: '12px' }}>
                🔑 Change Password
              </button>
            </form>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button onClick={handleLogout} style={{ ...styles.btnDanger, width: '100%', padding: '12px' }}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 3. SUPERADMIN PANEL
  // ═══════════════════════════════════════════════════════════════════════════════
  if (page === 'superadmin') {
    if (userProfile?.role !== 'SuperAdmin') {
      return (
        <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔒</div>
            <h2 style={{ color: '#FCA5A5', marginBottom: '10px' }}>Access Denied</h2>
            <p style={{ color: '#94A3B8' }}>You don't have SuperAdmin permissions.</p>
            <button onClick={() => setPage('dashboard')} style={{ ...styles.btnPrimary, marginTop: '20px', width: 'auto', padding: '12px 30px' }}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>👑 SuperAdmin Panel - Manage Agencies</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Create new travel agencies and manage their subscriptions.</p>
        </div>
        <div style={styles.card}>
          <h3 style={{marginTop: 0, color: '#FBBF24' }}>➕ Add New Travel Agency</h3>
          <form onSubmit={handleAddTenant} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div><label style={styles.label}>Agency Name (English) *</label><input value={tenantForm?.agency_name || ''} onChange={e => setTenantForm(prev => ({...prev, agency_name: e.target.value })) style={styles.input} required /></div>
            <div><label style={styles.label}>Company Name (Arabic)</label><input value={tenantForm?.company_name_ar || ''} onChange={e => setTenantForm(prev => ({...prev, company_name_ar: e.target.value })) style={styles.input} /></div>
            <div><label style={styles.label}>Owner Email *</label><input type="email" value={tenantForm?.owner_email || ''} onChange={e => setTenantForm(prev => ({...prev, owner_email: e.target.value })) style={styles.input} required /></div>
            <div><label style={styles.label}>Subscription End Date *</label><input type="date" value={tenantForm?.subscription_end_date || ''} onChange={e => setTenantForm(prev => ({...prev, subscription_end_date: e.target.value })) style={styles.input} required /></div>
            <div><label style={styles.label}>VAT Number</label><input value={tenantForm?.vat_no || ''} onChange={e => setTenantForm(prev => ({...prev, vat_no: e.target.value })) style={styles.input} /></div>
            <div><label style={styles.label}>CR Number</label><input value={tenantForm?.cr_no || ''} onChange={e => setTenantForm(prev => ({...prev, cr_no: e.target.value })) style={styles.input} /></div>
            <div><label style={styles.label}>Phone</label><input value={tenantForm?.phone || ''} onChange={e => setTenantForm(prev => ({...prev, phone: e.target.value })) style={styles.input} /></div>
            <div><label style={styles.label}>Address</label><input value={tenantForm?.address_ar || ''} onChange={e => setTenantForm(prev => ({...prev, address_ar: e.target.value })) style={styles.input} /></div>
            <button type="submit" style={{ ...styles.btnPrimary, gridColumn: '1 / -1', marginTop: '10px' }}>🚀 Create Agency & Generate Password</button>
          </form>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {(data.tenants || []).map(t => (
            <div key={t.id} style={{ background: '#1E293B', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' }}>
              <div style={{ padding: '20px', background: t.is_paid ? 'rgba(5, 150, 105, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderBottom: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 5px', color: '#FBBF24' }}>{t.agency_name}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8' }}>{t.owner_email}</p>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                  <span style={{ color: '#94A3B8' }}>Sub. End Date:</span>
                  <span style={{ fontWeight: '600', color: '#E2E8F0' }}>{t.subscription_end_date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', marginBottom: '15px' }}>
                  <span style={{ color: '#94A3B8' }}>Status:</span>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', background: t.is_paid ? '#059669' : '#EF4444', color: 'white', fontSize: '11px', fontWeight: '700' }}>{t.is_paid ? '✅ Active' : '❌ Suspended'}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleToggleSubscription(t)} style={{...styles.btnWarning, flex: 1}}>{t.is_paid ? '⏸ Suspend' : '▶ Activate'}</button>
                  <button onClick={() => handleDeleteTenant(t.id)} style={{...styles.btnDanger, flex: 1}}>🗑 Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 4. STATEMENTS PAGE
  // ═══════════════════════════════════════════════════════════════════════════════
  if (page === 'statements') {
    const tabs = ['bank', 'cash', 'credit', 'branches', 'customers'];
    const bankTotal = (data.cashbook || []).filter(c => c.type?.includes('Bank')).reduce((s, c) => s + (c.amount || 0), 0);
    const cashTotal = (data.cashbook || []).filter(c => c.type?.includes('Cash')).reduce((s, c) => s + (c.amount || 0), 0);

    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#FBBF24' }}>📋 Statements & Reports</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>View bank, cash, credit, branches and customer data.</p>
        </div>

        {/* TAB BUTTONS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setStatementType(tab)}
              style={statementType === tab ? { ...styles.tabBtn, ...styles.tabBtnActive } : styles.tabBtn}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.card}>
          {/* BANK TAB */}
          {statementType === 'bank' && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', border: '2px solid #FBBF24', marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 5px', color: '#FBBF24', fontSize: '20px' }}>Bank Summary</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FBBF24', margin: 0 }}>{bankTotal.toFixed(2)} SAR</p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Date</th>
                      <th style={styles.tableHeader}>Description</th>
                      <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.cashbook || []).filter(c => c.type?.includes('Bank')).map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{...styles.tableCell, fontFamily: 'monospace', fontSize: '12px', color: '#94A3B8' }}>{c.trans_date}</td>
                        <td style={{...styles.tableCell, color: c.type?.includes('In') ? '#059669' : '#FCA5A5' }}>{c.description}</td>
                        <td style={{...styles.tableCell, textAlign: 'right', color: c.type?.includes('Out') ? '#FCA5A5' : '#34D399' }}>{(c.amount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                    {(data.cashbook || []).filter(c => c.type?.includes('Bank')).length === 0 && (
                      <tr><td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No bank transactions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '15px' }}>
                <button
                  onClick={() => exportToExcel(
                    (data.cashbook || []).filter(c => c.type?.includes('Bank')).map(c => ({ Date: c.trans_date, Description: c.description, Amount: c.amount, Type: c.type })),
                    'BankStatement'
                  )}
                  style={{ ...styles.btnSuccess, width: 'auto', padding: '8px 12px' }}
                >
                  📥 Export Bank Statement
                </button>
              </div>
            </div>
          )}

          {/* CASH TAB */}
          {statementType === 'cash' && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', border: '2px solid #FBBF24', marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 5px', color: '#FBBF24', fontSize: '20px' }}>Cash Summary</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FBBF24', margin: 0 }}>{cashTotal.toFixed(2)} SAR</p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Date</th>
                      <th style={styles.tableHeader}>Description</th>
                      <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.cashbook || []).filter(c => c.type?.includes('Cash')).map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{...styles.tableCell, fontFamily: 'monospace', fontSize: '12px', color: '#94A3B8' }}>{c.trans_date}</td>
                        <td style={{...styles.tableCell, color: c.type?.includes('In') ? '#059669' : '#FCA5A5' }}>{c.description}</td>
                        <td style={{...styles.tableCell, textAlign: 'right', color: c.type?.includes('Out') ? '#FCA5A5' : '#34D399' }}>{(c.amount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                    {(data.cashbook || []).filter(c => c.type?.includes('Cash')).length === 0 && (
                      <tr><td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No cash transactions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '15px' }}>
                <button
                  onClick={() => exportToExcel(
                    (data.cashbook || []).filter(c => c.type?.includes('Cash')).map(c => ({ Date: c.trans_date, Description: c.description, Amount: c.amount, Type: c.type })),
                    'CashStatement'
                  )}
                  style={{ ...styles.btnSuccess, width: 'auto', padding: '8px 12px' }}
                >
                  📥 Export Cash Statement
                </button>
              </div>
            </div>
          )}

          {/* CREDIT TAB */}
          {statementType === 'credit' && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', border: '2px solid #FBBF24', marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 5px', color: '#FBBF24', fontSize: '20px' }}>Store Credit Summary</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FBBF24', margin: 0 }}>
                  {(data.customers || []).reduce((s, c) => s + (c.store_credit || 0), 0).toFixed(2)} SAR
                </p>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Available Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.customers || []).filter(c => (c.store_credit || 0) > 0).map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #1E293B' }}>
                      <td style={styles.tableCell}>{c.name}</td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: '#34D399', fontWeight: 'bold' }}>{(c.store_credit || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                  {(data.customers || []).filter(c => (c.store_credit || 0) > 0).length === 0 && (
                    <tr><td colSpan="2" style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No customers with store credit.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* BRANCHES TAB */}
          {statementType === 'branches' && (
            <div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Name</th>
                      <th style={styles.tableHeader}>Location</th>
                      <th style={styles.tableHeader}>Manager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.branches || []).map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={styles.tableCell}>{b.name}</td>
                        <td style={styles.tableCell}>{b.location || '-'}</td>
                        <td style={styles.tableCell}>{b.manager || '-'}</td>
                      </tr>
                    ))}
                    {(data.branches || []).length === 0 && (
                      <tr><td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No branches found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {statementType === 'customers' && (
            <div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Name</th>
                      <th style={styles.tableHeader}>Phone</th>
                      <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Store Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.customers || []).map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={styles.tableCell}>{c.name}</td>
                        <td style={styles.tableCell}>{c.phone}</td>
                        <td style={{...styles.tableCell, textAlign: 'right' }}>{(c.store_credit || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                    {(data.customers || []).length === 0 && (
                      <tr><td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No customers found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // DEFAULT: return null for unhandled pages
  // ═══════════════════════════════════════════════════════════════════════════════
  return null;
}
