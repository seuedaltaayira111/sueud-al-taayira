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
  
  // Local state for features not in global state
  const [statementType, setStatementType] = useState('sales');
  const [reportTab, setReportTab] = useState('sales');
  const [repDate, setRepDate] = useState({ from: '', to: '' });
  const [editUserId, setEditUserId] = useState(null);

  // Helper: Filter data by date range
  const filterData = (items, dateField) => {
    if (!items) return [];
    let filtered = items;
    if (repDate.from) {
      filtered = filtered.filter(i => i[dateField] >= repDate.from);
    }
    if (repDate.to) {
      filtered = filtered.filter(i => i[dateField] <= repDate.to);
    }
    return filtered;
  };

  // Helper: Export to Excel (CSV)
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

  // Helper: Safe form update
  const updateSetForm = (updates) => {
    if (setSetForm) {
      setSetForm(prev => ({ ...(prev || {}), ...updates }));
    }
  };

  // Safe access to setForm
  const currentSetForm = setForm || {};

  // ═══════════════════════════════════════════════════════════════
  // 1. PROFITABILITY ANALYZER
  // ═══════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════
  // 2. PROFILE PAGE
  // ═══════════════════════════════════════════════════════════════
  if (page === 'profile') {
    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <h2 style={{ color: '#FBBF24', marginBottom: '20px' }}>👤 {tr?.profile || 'Profile'}</h2>
        <div style={{...styles.card, maxWidth: '600px', margin: '0 auto'}}>
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
              <input value={profileForm?.username || ''} onChange={e => setProfileForm(prev => ({...prev, username: e.target.value}))} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Phone Number</label>
              <input value={profileForm?.phone || ''} onChange={e => setProfileForm(prev => ({...prev, phone: e.target.value}))} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Address</label>
              <input value={profileForm?.address || ''} onChange={e => setProfileForm(prev => ({...prev, address: e.target.value}))} style={styles.input} />
            </div>
            <button type="submit" style={styles.btnPrimary}>💾 Save Profile Changes</button>
          </form>

          <div style={{ marginTop: '30px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
            <h3 style={{ color: '#FBBF24', marginTop: 0, marginBottom: '15px' }}>🔒 Security</h3>
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

  // ═══════════════════════════════════════════════════════════════
  // 3. SUPERADMIN PANEL
  // ═══════════════════════════════════════════════════════════════
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
          <h3 style={{marginTop: 0, color: '#FBBF24'}}>➕ Add New Travel Agency</h3>
          <form onSubmit={handleAddTenant} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div><label style={styles.label}>Agency Name (English) *</label><input value={tenantForm?.agency_name || ''} onChange={e => setTenantForm(prev => ({...prev, agency_name: e.target.value}))} style={styles.input} required /></div>
            <div><label style={styles.label}>Company Name (Arabic)</label><input value={tenantForm?.company_name_ar || ''} onChange={e => setTenantForm(prev => ({...prev, company_name_ar: e.target.value}))} style={styles.input} /></div>
            <div><label style={styles.label}>Owner Email *</label><input type="email" value={tenantForm?.owner_email || ''} onChange={e => setTenantForm(prev => ({...prev, owner_email: e.target.value}))} style={styles.input} required /></div>
            <div><label style={styles.label}>Subscription End Date *</label><input type="date" value={tenantForm?.subscription_end_date || ''} onChange={e => setTenantForm(prev => ({...prev, subscription_end_date: e.target.value}))} style={styles.input} required /></div>
            <div><label style={styles.label}>VAT Number</label><input value={tenantForm?.vat_no || ''} onChange={e => setTenantForm(prev => ({...prev, vat_no: e.target.value}))} style={styles.input} /></div>
            <div><label style={styles.label}>CR Number</label><input value={tenantForm?.cr_no || ''} onChange={e => setTenantForm(prev => ({...prev, cr_no: e.target.value}))} style={styles.input} /></div>
            <div><label style={styles.label}>Phone</label><input value={tenantForm?.phone || ''} onChange={e => setTenantForm(prev => ({...prev, phone: e.target.value}))} style={styles.input} /></div>
            <div><label style={styles.label}>Address</label><input value={tenantForm?.address_ar || ''} onChange={e => setTenantForm(prev => ({...prev, address_ar: e.target.value}))} style={styles.input} /></div>
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

  // ═══════════════════════════════════════════════════════════════
  // 4. USERS PAGE
  // ═══════════════════════════════════════════════════════════════
  if (page === 'users') {
    // Simple user management since app_users might not be loaded
    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <h2 style={{ color: '#FBBF24', marginBottom: '20px' }}>👥 {tr?.users || 'Users'}</h2>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>👥</div>
            <h3 style={{ color: '#FBBF24', marginBottom: '10px' }}>User Management</h3>
            <p style={{ color: '#94A3B8', maxWidth: '500px', margin: '0 auto 20px', lineHeight: '1.6' }}>
              User accounts are managed through the SuperAdmin panel. Contact your system administrator to add new users or modify existing accounts.
            </p>
            <button style={{ ...styles.btnPrimary, width: 'auto', padding: '12px 30px' }} onClick={() => setPage('superadmin')}>
              Go to SuperAdmin →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. SETTINGS PAGE
  // ═══════════════════════════════════════════════════════════════
  if (page === 'settings') {
    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <h2 style={{ color: '#FBBF24', marginBottom: '20px' }}>⚙️ {tr?.settings || 'Settings'}</h2>
        <div style={styles.card}>
          <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div><label style={styles.label}>Company Name (EN) *</label><input value={currentSetForm.company_name_en || ''} onChange={e => updateSetForm({ company_name_en: e.target.value })} style={styles.input} required /></div>
            <div><label style={styles.label}>Company Name (AR)</label><input dir="rtl" value={currentSetForm.company_name_ar || ''} onChange={e => updateSetForm({ company_name_ar: e.target.value })} style={styles.input} /></div>
            <div><label style={styles.label}>VAT No</label><input value={currentSetForm.vat_no || ''} onChange={e => updateSetForm({ vat_no: e.target.value })} style={styles.input} /></div>
            <div><label style={styles.label}>CR No</label><input value={currentSetForm.cr_no || ''} onChange={e => updateSetForm({ cr_no: e.target.value })} style={styles.input} /></div>
            <div><label style={styles.label}>Phone</label><input value={currentSetForm.phone || ''} onChange={e => updateSetForm({ phone: e.target.value })} style={styles.input} /></div>
            <div><label style={styles.label}>Website</label><input value={currentSetForm.website || ''} onChange={e => updateSetForm({ website: e.target.value })} style={styles.input} /></div>
            <div><label style={styles.label}>Address (AR)</label><input dir="rtl" value={currentSetForm.address_ar || ''} onChange={e => updateSetForm({ address_ar: e.target.value })} style={styles.input} /></div>
            <div><label style={styles.label}>License No</label><input value={currentSetForm.license_no || ''} onChange={e => updateSetForm({ license_no: e.target.value })} style={styles.input} /></div>
            <div><label style={styles.label}>Tourism License No</label><input value={currentSetForm.tourism_license_no || ''} onChange={e => updateSetForm({ tourism_license_no: e.target.value })} style={styles.input} /></div>
            <div><label style={styles.label}>Logo Upload</label><input type="file" accept="image/*" onChange={handleLogoUpload} style={styles.input} /></div>
            {currentSetForm.logo_url && (
              <div style={{ gridColumn: '1 / -1' }}>
                <img src={currentSetForm.logo_url} alt="Logo" style={{ height: '80px', borderRadius: '8px', border: '1px solid #334155' }} />
              </div>
            )}
            
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #334155', marginTop: '10px', paddingTop: '20px' }}>
              <h3 style={{ margin: '0 0 15px', color: '#FBBF24' }}>📝 Custom Fields (Invoice Footer)</h3>
              {(currentSetForm.custom_fields || []).map((cf, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <input placeholder="Label (e.g. IATA No)" value={cf.key || ''} onChange={e => handleCustomFieldChange?.(i, 'key', e.target.value)} style={{ ...styles.input, flex: 1 }} />
                  <input placeholder="Value" value={cf.value || ''} onChange={e => handleCustomFieldChange?.(i, 'value', e.target.value)} style={{ ...styles.input, flex: 1 }} />
                  <button type="button" onClick={() => handleRemoveCustomField?.(i)} style={{...styles.btnDanger, width: 'auto', padding: '12px 20px' }}>✕</button>
                </div>
              ))}
              <button type="button" onClick={handleAddCustomField} style={{ ...styles.btnSuccess, width: 'auto', padding: '10px 20px' }}>+ Add Custom Field</button>
            </div>

            <button type="submit" style={{ ...styles.btnPrimary, gridColumn: '1 / -1', padding: '15px' }}>💾 Save Settings</button>
          </form>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. CONTRACT & OFFER PAGE
  // ═══════════════════════════════════════════════════════════════
  if (page === 'contract' || page === 'offer') {
    const isContract = page === 'contract';
    
    const aiStandardTerms = [
      "Payment Terms: 100% advance payment required to confirm the booking.",
      "Validity: This document is valid for 30 days from the date of issue.",
      "Refund Policy: All cancellations are subject to airline/hotel cancellation policies.",
      "Prices are subject to change based on availability at the time of final booking.",
      "Passenger names must match exactly as per passport/ID."
    ];

    const handleTermToggle = (term) => {
      const currentTerms = contractTerms ? contractTerms.split('\n').filter(t => t.trim()) : [];
      if (currentTerms.includes(term)) {
        setContractTerms(currentTerms.filter(t => t !== term).join('\n'));
      } else {
        setContractTerms([...currentTerms, term].join('\n'));
      }
    };

    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>{isContract ? '📝 Corporate Contract Generator' : '🎁 Corporate Offer Generator'}</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>{isContract ? "Generate a formal dynamic agreement." : "Generate a special dynamic offer letter."}</p>
        </div>
        <div style={{...styles.card, borderInlineStart: '5px solid #FBBF24'}}>
          <form onSubmit={isContract ? handleGenerateContract : handleGenerateOffer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Corporate Company Name *</label>
              <input type="text" value={contractCorpName || ''} onChange={e => setContractCorpName(e.target.value)} style={{...styles.input, padding: '15px', fontSize: '16px'}} required placeholder="e.g. Saudi Aramco" />
            </div>
            <div>
              <label style={styles.label}>Service Type</label>
              <select value={contractType || 'Flight Tickets'} onChange={e => setContractType(e.target.value)} style={styles.input}>
                <option>Flight Tickets</option><option>Hotel Booking</option><option>Visa Services</option><option>Hajj/Umrah Packages</option><option>Complete Travel Management</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Service Fee / Markup (SAR)</label>
              <input type="number" value={contractMarkup || '10'} onChange={e => setContractMarkup(e.target.value)} style={styles.input} required />
            </div>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <label style={styles.label}>🤖 AI Generated Terms (Click to add/remove)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                {aiStandardTerms.map((term, idx) => {
                  const isSelected = contractTerms?.includes(term);
                  return (
                    <button 
                      key={idx} 
                      type="button" 
                      onClick={() => handleTermToggle(term)}
                      style={{
                        padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s',
                        background: isSelected ? '#1E3A8A' : '#334155',
                        color: isSelected ? 'white' : '#94A3B8',
                        border: isSelected ? '1px solid #2563EB' : '1px solid #475569'
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{term.substring(0, 40)}...
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Custom Terms & Conditions (One per line)</label>
              <textarea rows="6" value={contractTerms || ''} onChange={e => setContractTerms(e.target.value)} style={{...styles.input, resize: 'vertical', fontFamily: 'sans-serif'}}></textarea>
            </div>
            <button type="submit" style={{ ...styles.btnPrimary, gridColumn: '1 / -1', padding: '15px', fontSize: '16px' }}>
              📄 Generate {isContract ? 'Contract' : 'Offer'} PDF
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. REPORTS PAGE
  // ═══════════════════════════════════════════════════════════════
  if (page === 'reports') {
    const filteredInvoices = filterData((data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')), 'invoice_date');
    const filteredExpenses = filterData(data.expenses || [], 'expense_date');
    const salesTotal = filteredInvoices.reduce((s, i) => s + (i.total || 0), 0);
    const expTotal = filteredExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    const profitTotal = salesTotal - expTotal;

    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <h2 style={{ color: '#FBBF24', marginBottom: '20px' }}>📊 {tr?.reports || 'Reports'}</h2>
        
        {/* Date Filters */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', background: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div>
            <label style={styles.label}>From Date</label>
            <input type="date" value={repDate.from} onChange={e => setRepDate({...repDate, from: e.target.value})} style={{...styles.input, maxWidth: '200px'}} />
          </div>
          <div>
            <label style={styles.label}>To Date</label>
            <input type="date" value={repDate.to} onChange={e => setRepDate({...repDate, to: e.target.value})} style={{...styles.input, maxWidth: '200px'}} />
          </div>
        </div>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['sales', 'expenses', 'profit', 'portals', 'outstanding'].map(tab => (
            <button key={tab} onClick={() => setReportTab(tab)} style={{...styles.tabBtn, ...(reportTab === tab && styles.tabBtnActive)}}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Sales Tab */}
        {reportTab === 'sales' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #334155' }}>
              <h3 style={{ color: '#FBBF24', margin: 0 }}>Total Sales: <span style={{ color: '#34D399' }}>{salesTotal.toFixed(2)} SAR</span></h3>
              <button onClick={() => exportToExcel(filteredInvoices.map(i => ({ Date: i.invoice_date, Inv: i.invoice_no, Customer: i.customers?.name, Total: i.total, Due: i.due_amount })), 'SalesReport')} style={styles.btnSuccess}>📥 Export CSV</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Inv</th><th style={styles.tableHeader}>Customer</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Total</th></tr></thead>
                <tbody>{filteredInvoices.map(i => (<tr key={i.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{i.invoice_date}</td><td style={{...styles.tableCell, color: '#60A5FA'}}>{i.invoice_no}</td><td style={styles.tableCell}>{i.customers?.name || 'N/A'}</td><td style={{...styles.tableCell, textAlign: 'right', color: '#34D399'}}>{(i.total || 0).toFixed(2)}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {reportTab === 'expenses' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #334155' }}>
              <h3 style={{ color: '#FBBF24', margin: 0 }}>Total Expenses: <span style={{ color: '#FCA5A5' }}>{expTotal.toFixed(2)} SAR</span></h3>
              <button onClick={() => exportToExcel(filteredExpenses.map(e => ({ Date: e.expense_date, Type: e.expense_type, Description: e.description, Amount: e.amount })), 'ExpenseReport')} style={styles.btnSuccess}>📥 Export CSV</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Type</th><th style={styles.tableHeader}>Description</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Amount</th></tr></thead>
                <tbody>{filteredExpenses.map(e => (<tr key={e.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{e.expense_date}</td><td style={styles.tableCell}>{e.expense_type}</td><td style={styles.tableCell}>{e.description}</td><td style={{...styles.tableCell, textAlign: 'right', color: '#FCA5A5'}}>{(e.amount || 0).toFixed(2)}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profit Tab */}
        {reportTab === 'profit' && (
          <div style={{ background: '#1E293B', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px solid #334155' }}>
            <h3 style={{ color: '#FBBF24', fontSize: '24px', marginTop: 0 }}>Profit & Loss Statement</h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: profitTotal >= 0 ? '#34D399' : '#FCA5A5', margin: '20px 0' }}>{profitTotal.toFixed(2)} SAR</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '20px', flexWrap: 'wrap' }}>
              <div><h4 style={{ color: '#94A3B8', margin: 0 }}>Total Sales</h4><p style={{ fontSize: '20px', color: '#34D399', fontWeight: 'bold' }}>{salesTotal.toFixed(2)}</p></div>
              <div><h4 style={{ color: '#94A3B8', margin: 0 }}>Total Expenses</h4><p style={{ fontSize: '20px', color: '#FCA5A5', fontWeight: 'bold' }}>{expTotal.toFixed(2)}</p></div>
            </div>
          </div>
        )}

        {/* Portals Tab */}
        {reportTab === 'portals' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #334155' }}>
              <h3 style={{ color: '#FBBF24', margin: 0 }}>Portal Balances Report</h3>
              <button onClick={() => exportToExcel((data.portals || []).map(p => ({ Name: p.name, Balance: p.current_balance })), 'PortalReport')} style={styles.btnSuccess}>📥 Export CSV</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={styles.tableHeader}>Portal</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Balance (SAR)</th></tr></thead>
              <tbody>{(data.portals || []).map(p => (<tr key={p.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{p.name}</td><td style={{...styles.tableCell, textAlign: 'right', fontWeight: 'bold', color: (p.current_balance || 0) < 0 ? '#FCA5A5' : '#34D399'}}>{(p.current_balance || 0).toFixed(2)}</td></tr>))}</tbody>
            </table>
          </div>
        )}

        {/* Outstanding Tab */}
        {reportTab === 'outstanding' && (() => {
          const outInvs = (data.invoices || []).filter(i => (i.due_amount || 0) > 0);
          const totalDue = outInvs.reduce((s, i) => s + (i.due_amount || 0), 0);
          return (
            <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #334155' }}>
                <h3 style={{ color: '#FBBF24', margin: 0 }}>Total Outstanding: <span style={{color: '#FCA5A5'}}>{totalDue.toFixed(2)} SAR</span></h3>
                <button onClick={() => exportToExcel(outInvs.map(i => ({ Inv: i.invoice_no, Customer: i.customers?.name, Due: i.due_amount })), 'OutstandingReport')} style={styles.btnSuccess}>📥 Export CSV</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead><tr><th style={styles.tableHeader}>Inv</th><th style={styles.tableHeader}>Customer</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Due</th></tr></thead>
                  <tbody>{outInvs.map(i => (<tr key={i.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={{...styles.tableCell, color: '#60A5FA'}}>{i.invoice_no}</td><td style={styles.tableCell}>{i.customers?.name || 'N/A'}</td><td style={{...styles.tableCell, textAlign: 'right', color: '#FCA5A5', fontWeight: 'bold'}}>{(i.due_amount || 0).toFixed(2)}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. AUDIT LOGS PAGE
  // ═══════════════════════════════════════════════════════════════
  if (page === 'audit') {
    const auditData = data.auditLogs || data.audits || []; // Support both names
    
    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <h2 style={{ color: '#FBBF24', marginBottom: '20px' }}>📜 {tr?.audit || 'Audit Logs'}</h2>
        <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
          {auditData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <div style={{ fontSize: '60px', marginBottom: '15px' }}>📜</div>
              <h3>No Audit Logs Found</h3>
              <p>Logs will appear here as users perform actions in the system.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>User</th><th style={styles.tableHeader}>Action</th></tr></thead>
                <tbody>{auditData.map(a => (<tr key={a.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={{...styles.tableCell, fontFamily: 'monospace', fontSize: '12px', color: '#94A3B8'}}>{a.created_at?.split('T')[0]} {a.created_at?.split('T')[1]?.split('.')[0]}</td><td style={{...styles.tableCell, color: '#60A5FA', fontWeight: '600'}}>{a.user_email || 'Unknown'}</td><td style={styles.tableCell}>{a.action}</td></tr>))}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. STATEMENTS PAGE
  // ═══════════════════════════════════════════════════════════════
  if (page === 'statements') {
    const tabs = ['sales', 'portals', 'vendors', 'salary', 'expenses', 'customers', 'creditors', 'credit', 'branches', 'cash', 'bank'];
    
    const getExportData = (type) => {
      switch(type) {
        case 'sales': return filterData((data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')), 'invoice_date').map(i => ({ Date: i.invoice_date, InvNo: i.invoice_no, Customer: i.customers?.name || i.corporates?.name, Total: i.total, Due: i.due_amount }));
        case 'portals': return (data.portals || []).map(p => ({ Portal: p.name, Balance: p.current_balance }));
        case 'vendors': return (data.vendors || []).map(v => ({ Vendor: v.name, Phone: v.phone, Balance: v.balance }));
        case 'salary': return filterData(data.payroll || [], 'month').map(p => ({ Employee: p.employees?.name, Month: p.month, Amount: p.salary || p.amount, Mode: p.payment_mode }));
        case 'expenses': return filterData(data.expenses || [], 'expense_date').map(e => ({ Date: e.expense_date, Type: e.expense_type, Description: e.description, Amount: e.amount }));
        case 'customers': return (data.customers || []).map(c => ({ Name: c.name, Phone: c.phone, Credit: c.store_credit }));
        case 'creditors': return (data.creditors || []).map(c => ({ Name: c.name, Phone: c.phone, Address: c.address }));
        case 'credit': return (data.customers || []).filter(c => (c.store_credit || 0) > 0).map(c => ({ Name: c.name, AvailableCredit: c.store_credit }));
        case 'branches': return (data.branches || []).map(b => ({ Name: b.name, Location: b.location, Manager: b.manager }));
        case 'cash': return filterData((data.cashbook || []).filter(c => c.type?.includes('Cash')), 'trans_date').map(c => ({ Date: c.trans_date, Description: c.description, Amount: c.amount, Type: c.type }));
        case 'bank': return filterData((data.cashbook || []).filter(c => c.type?.includes('Bank')), 'trans_date').map(c => ({ Date: c.trans_date, Description: c.description, Amount: c.amount, Type: c.type }));
        default: return [];
      }
    };

    const renderStatementTable = () => {
      switch(statementType) {
        case 'sales': {
          const items = filterData((data.invoices || []).filter(i => !i.invoice_no?.startsWith('REF-')), 'invoice_date');
          return (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Inv No</th><th style={styles.tableHeader}>Customer</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Total</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Due</th></tr></thead>
              <tbody>{items.map(i => (<tr key={i.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{i.invoice_date}</td><td style={{...styles.tableCell, color: '#60A5FA'}}>{i.invoice_no}</td><td style={styles.tableCell}>{i.customers?.name || i.corporates?.name || 'N/A'}</td><td style={{...styles.tableCell, textAlign: 'right', color: '#34D399'}}>{(i.total || 0).toFixed(2)}</td><td style={{...styles.tableCell, textAlign: 'right', color: (i.due_amount || 0) > 0 ? '#FCA5A5' : '#34D399', fontWeight: 'bold'}}>{(i.due_amount || 0).toFixed(2)}</td></tr>))}</tbody>
            </table>
          );
        }
        case 'portals': return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={styles.tableHeader}>Portal</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Balance (SAR)</th></tr></thead>
            <tbody>{(data.portals || []).map(p => (<tr key={p.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{p.name}</td><td style={{...styles.tableCell, textAlign: 'right', fontWeight: 'bold', color: (p.current_balance || 0) < 0 ? '#FCA5A5' : '#34D399'}}>{(p.current_balance || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        );
        case 'vendors': return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={styles.tableHeader}>Vendor</th><th style={styles.tableHeader}>Phone</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Balance</th></tr></thead>
            <tbody>{(data.vendors || []).map(v => (<tr key={v.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{v.name}</td><td style={styles.tableCell}>{v.phone}</td><td style={{...styles.tableCell, textAlign: 'right'}}>{(v.balance || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        );
        case 'salary': return (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead><tr><th style={styles.tableHeader}>Employee</th><th style={styles.tableHeader}>Month</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Amount</th><th style={styles.tableHeader}>Mode</th></tr></thead>
            <tbody>{(data.payroll || []).map(p => (<tr key={p.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{p.employees?.name || 'N/A'}</td><td style={styles.tableCell}>{p.month}</td><td style={{...styles.tableCell, textAlign: 'right', color: '#34D399'}}>{(p.salary || p.amount || 0).toFixed(2)}</td><td style={styles.tableCell}>{p.payment_mode || 'Cash'}</td></tr>))}</tbody>
          </table>
        );
        case 'expenses': return (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Type</th><th style={styles.tableHeader}>Description</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Amount</th></tr></thead>
            <tbody>{(data.expenses || []).map(e => (<tr key={e.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{e.expense_date}</td><td style={styles.tableCell}>{e.expense_type}</td><td style={styles.tableCell}>{e.description}</td><td style={{...styles.tableCell, textAlign: 'right', color: '#FCA5A5'}}>{(e.amount || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        );
        case 'customers': return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Phone</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Credit</th></tr></thead>
            <tbody>{(data.customers || []).map(c => (<tr key={c.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.phone}</td><td style={{...styles.tableCell, textAlign: 'right'}}>{(c.store_credit || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        );
        case 'creditors': return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Phone</th><th style={styles.tableHeader}>Address</th></tr></thead>
            <tbody>{(data.creditors || []).map(c => (<tr key={c.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{c.name}</td><td style={styles.tableCell}>{c.phone}</td><td style={styles.tableCell}>{c.address}</td></tr>))}</tbody>
          </table>
        );
        case 'credit': return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={styles.tableHeader}>Name</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Available Credit</th></tr></thead>
            <tbody>{(data.customers || []).filter(c => (c.store_credit || 0) > 0).map(c => (<tr key={c.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{c.name}</td><td style={{...styles.tableCell, textAlign: 'right', color: '#34D399', fontWeight: 'bold'}}>{(c.store_credit || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        );
        case 'branches': return (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead><tr><th style={styles.tableHeader}>Name</th><th style={styles.tableHeader}>Location</th><th style={styles.tableHeader}>Manager</th></tr></thead>
            <tbody>{(data.branches || []).map(b => (<tr key={b.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{b.name}</td><td style={styles.tableCell}>{b.location}</td><td style={styles.tableCell}>{b.manager}</td></tr>))}</tbody>
          </table>
        );
        case 'cash': return (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Description</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Amount</th></tr></thead>
            <tbody>{(data.cashbook || []).filter(c => c.type?.includes('Cash')).map(c => (<tr key={c.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{c.trans_date}</td><td style={styles.tableCell}>{c.description}</td><td style={{...styles.tableCell, textAlign: 'right', color: c.type?.includes('In') ? '#34D399' : '#FCA5A5'}}>{(c.amount || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        );
        case 'bank': return (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead><tr><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Description</th><th style={{ ...styles.tableHeader, textAlign: 'right' }}>Amount</th></tr></thead>
            <tbody>{(data.cashbook || []).filter(c => c.type?.includes('Bank')).map(c => (<tr key={c.id} style={{ borderBottom: '1px solid #1E293B' }}><td style={styles.tableCell}>{c.trans_date}</td><td style={styles.tableCell}>{c.description}</td><td style={{...styles.tableCell, textAlign: 'right', color: c.type?.includes('In') ? '#34D399' : '#FCA5A5'}}>{(c.amount || 0).toFixed(2)}</td></tr>))}</tbody>
          </table>
        );
        default: return <p style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Select a statement type</p>;
      }
    };

    return (
      <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0' }}>
        <h2 style={{ color: '#FBBF24', marginBottom: '20px' }}>📑 {tr?.statements || 'Statements'}</h2>
        
        {/* Date Filters */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', background: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div>
            <label style={styles.label}>From Date</label>
            <input type="date" value={repDate.from} onChange={e => setRepDate({...repDate, from: e.target.value})} style={{...styles.input, maxWidth: '200px'}} />
          </div>
          <div>
            <label style={styles.label}>To Date</label>
            <input type="date" value={repDate.to} onChange={e => setRepDate({...repDate, to: e.target.value})} style={{...styles.input, maxWidth: '200px'}} />
          </div>
        </div>

        {/* Statement Type Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setStatementType(t)} style={{...styles.tabBtn, ...(statementType === t && styles.tabBtnActive)}}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Statement Content */}
        <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #334155' }}>
            <h3 style={{ margin: 0, color: '#FBBF24', textTransform: 'capitalize' }}>{statementType} Statement</h3>
            <button onClick={() => exportToExcel(getExportData(statementType), `${statementType}Statement`)} style={styles.btnSuccess}>📥 Export CSV</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {renderStatementTable()}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // FALLBACK
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ padding: '20px', background: '#0F172A', minHeight: '100vh', color: '#E2E8F0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🚧</div>
        <h2 style={{ color: '#FBBF24', marginBottom: '10px' }}>Page Under Development</h2>
        <p style={{ color: '#94A3B8', marginBottom: '20px' }}>{page}</p>
        <button onClick={() => setPage('dashboard')} style={{ ...styles.btnPrimary, width: 'auto', padding: '12px 30px' }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
