'use client';

import React, { useState, useEffect } from 'react';

export default function ERPModals({
  modal, setModal, passForm, setPassForm, handleChangePassword,
  settleForm, setSettleForm, handleSettlePayment,
  refundForm, setRefundForm, handleRefund,
  previewHTML, downloadPDF, lang, theme, data, showToast,
  // Portal Edit props
  portalForm, setPortalForm, handleAddEditPortal,
  // Cashbook Edit props
  cashbookEditForm, setCashbookEditForm, setData, userProfile,
  // Additional
  setForm, setSetForm, handleSaveSettings,
}) {
  const isAr = lang === 'ar';
  const isDark = theme === 'dark';

  // AI suggestion for refund amount (auto-calculate based on original invoice)
  useEffect(() => {
    if (modal.type === 'refund' && modal.data) {
      const inv = modal.data;
      const suggested = inv.due_amount || inv.total || 0;
      setRefundForm(prev => ({
        ...prev,
        custRefund: suggested,
        compRefund: 0
      }));
    }
  }, [modal.type, modal.data]);

  // AI suggestion for settle amount (auto-fill due amount)
  useEffect(() => {
    if (modal.type === 'settle' && modal.data) {
      const inv = modal.data;
      setSettleForm(prev => ({
        ...prev,
        amount: inv.due_amount || 0
      }));
    }
  }, [modal.type, modal.data]);

  // ===== STYLES =====
  const styles = {
    input: {
      width: '100%',
      padding: '12px 15px',
      margin: '8px 0',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      borderRadius: '8px',
      outline: 'none',
      boxSizing: 'border-box',
      background: isDark ? '#0F172A' : '#F8FAFC',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      transition: 'all 0.2s'
    },
    select: {
      width: '100%',
      padding: '12px 15px',
      margin: '8px 0',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      borderRadius: '8px',
      outline: 'none',
      boxSizing: 'border-box',
      background: isDark ? '#0F172A' : '#F8FAFC',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      transition: 'all 0.2s'
    },
    textarea: {
      width: '100%',
      padding: '12px 15px',
      margin: '8px 0',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      borderRadius: '8px',
      outline: 'none',
      boxSizing: 'border-box',
      background: isDark ? '#0F172A' : '#F8FAFC',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'all 0.2s'
    },
    btnPrimary: {
      padding: '12px 15px',
      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
      color: '#0F172A',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      width: '100%',
      boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)',
      transition: 'all 0.2s'
    },
    btnSuccess: {
      padding: '10px 15px',
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    btnDanger: {
      padding: '10px 15px',
      background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    btnInfo: {
      padding: '10px 15px',
      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    btnWarning: {
      padding: '10px 15px',
      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
      color: '#0F172A',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    card: {
      background: isDark ? '#1E293B' : '#FFFFFF',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      marginBottom: '20px',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      color: isDark ? '#E2E8F0' : '#1E293B',
      width: '450px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: '0',
      display: 'block',
      marginTop: '15px'
    },
    aiBadge: {
      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      color: '#fff',
      padding: '2px 10px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: 'bold',
      display: 'inline-block',
      marginLeft: '8px',
      letterSpacing: '0.5px'
    }
  };

  const overlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  // ===== HANDLE PRINT FROM PREVIEW =====
  const handlePrintPreview = () => {
    if (!previewHTML) {
      showToast?.(isAr ? 'لا يوجد مستند للطباعة' : 'No document to print');
      return;
    }
    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        showToast?.(isAr ? 'الرجاء السماح بالنوافذ المنبثقة' : 'Please allow popups');
        return;
      }
      printWindow.document.write(previewHTML);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    } catch (e) {
      console.error('Print error:', e);
      showToast?.(isAr ? 'خطأ في الطباعة' : 'Print error');
    }
  };

  // ===== HANDLE DOWNLOAD FROM PREVIEW =====
  const handleDownloadPDF = async () => {
    if (!previewHTML) {
      showToast?.(isAr ? 'لا يوجد مستند للتحميل' : 'No document to download');
      return;
    }
    try {
      await downloadPDF(previewHTML, 'document.pdf');
    } catch (e) {
      console.error('Download error:', e);
      showToast?.(isAr ? 'خطأ في التحميل' : 'Download error');
    }
  };

  // ===== CASHBOOK EDIT HANDLER =====
  const handleCashbookEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: up, error } = await supabase
        .from('cashbook')
        .update(cashbookEditForm)
        .eq('id', modal.data.id)
        .select()
        .single();
      if (error) throw error;
      setData(prev => ({
        ...prev,
        cashbook: prev.cashbook.map(c => c.id === modal.data.id ? up : c)
      }));
      showToast(isAr ? '✅ تم تحديث قيد الدفتر' : '✅ Cashbook entry updated');
      setModal({ type: null, data: null });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  return (
    <>
      {/* ============================================================
          CHANGE PASSWORD MODAL
          ============================================================ */}
      {modal.type === 'password' && (
        <div style={overlay}>
          <div style={styles.card}>
            <h3 style={{ color: '#FBBF24', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
              🔒 {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
            </h3>
            <form onSubmit={handleChangePassword}>
              <label style={styles.label}>
                {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <input
                type="password"
                placeholder={isAr ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                value={passForm?.newPass || ''}
                onChange={e => setPassForm({ newPass: e.target.value })}
                style={styles.input}
                required
                minLength={6}
              />
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                {isAr ? 'يجب أن تكون 6 أحرف على الأقل' : 'Minimum 6 characters'}
              </p>
              <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>
                {isAr ? 'تحديث كلمة المرور' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={() => setModal({ type: null, data: null })}
                style={{ ...styles.btnDanger, width: '100%', marginTop: '10px' }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          SETTLE PAYMENT MODAL – with AI Suggestion
          ============================================================ */}
      {modal.type === 'settle' && (
        <div style={overlay}>
          <div style={styles.card}>
            <h3 style={{ color: '#FBBF24', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
              💳 {isAr ? 'تسوية الدفع' : 'Settle Payment'}
              <span style={styles.aiBadge}>AI</span>
            </h3>
            <form onSubmit={handleSettlePayment}>
              <label style={styles.label}>
                {isAr ? 'تاريخ التسوية' : 'Settlement Date'}
              </label>
              <input
                type="date"
                value={settleForm?.date || ''}
                onChange={e => setSettleForm({ ...settleForm, date: e.target.value })}
                style={styles.input}
                required
              />

              <label style={styles.label}>
                {isAr ? 'طريقة الدفع' : 'Payment Method'}
              </label>
              <select
                value={settleForm?.mode || 'Cash'}
                onChange={e => setSettleForm({ ...settleForm, mode: e.target.value })}
                style={styles.select}
              >
                <option value="Cash">💰 {isAr ? 'نقداً' : 'Cash'}</option>
                <option value="Bank Transfer">🏦 {isAr ? 'تحويل بنكي' : 'Bank Transfer'}</option>
                <option value="Card">💳 {isAr ? 'بطاقة' : 'Card'}</option>
              </select>

              <div style={{
                background: isDark ? '#0F172A' : '#F1F5F9',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'المبلغ المستحق' : 'Due Amount'}</span>
                <span style={{ color: '#FBBF24', fontWeight: 700 }}>
                  {modal.data?.due_amount?.toFixed(2) || '0.00'} SAR
                </span>
              </div>

              <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>
                {isAr ? 'تسوية الدفع' : 'Settle Payment'}
              </button>
              <button
                type="button"
                onClick={() => setModal({ type: null, data: null })}
                style={{ ...styles.btnDanger, width: '100%', marginTop: '10px' }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          PROCESS REFUND MODAL – with AI Suggestion
          ============================================================ */}
      {modal.type === 'refund' && (
        <div style={overlay}>
          <div style={{ ...styles.card, width: '550px' }}>
            <h3 style={{ color: '#EF4444', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
              🔄 {isAr ? 'معالجة الاسترجاع' : 'Process Refund'}
              <span style={styles.aiBadge}>AI</span>
            </h3>
            <form onSubmit={handleRefund}>
              <label style={styles.label}>
                {isAr ? 'تاريخ الاسترجاع' : 'Refund Date'}
              </label>
              <input
                type="date"
                value={refundForm?.date || ''}
                onChange={e => setRefundForm({ ...refundForm, date: e.target.value })}
                style={styles.input}
                required
              />

              <label style={styles.label}>
                {isAr ? 'استرجاع الشركة (يرجع إلى البوابة)' : 'Company Refund (Goes back to Portal)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={refundForm?.compRefund || ''}
                onChange={e => setRefundForm({ ...refundForm, compRefund: e.target.value })}
                style={styles.input}
                required
              />

              <label style={styles.label}>
                {isAr ? 'مبلغ استرجاع العميل' : 'Customer Refund Amount'}
                <span style={styles.aiBadge}>AI Suggested</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={refundForm?.custRefund || ''}
                onChange={e => setRefundForm({ ...refundForm, custRefund: e.target.value })}
                style={styles.input}
                required
              />
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                {isAr ? 'القيمة المقترحة' : 'AI suggested'}: {refundForm?.custRefund || '0.00'} SAR
              </p>

              <label style={styles.label}>
                {isAr ? 'طريقة استرجاع العميل' : 'Customer Refund Method'}
              </label>
              <select
                value={refundForm?.mode || 'Cash'}
                onChange={e => setRefundForm({ ...refundForm, mode: e.target.value })}
                style={styles.select}
                required
              >
                <option value="Cash">💰 {isAr ? 'نقداً' : 'Cash'}</option>
                <option value="Bank Transfer">🏦 {isAr ? 'تحويل بنكي' : 'Bank Transfer'}</option>
                <option value="Credit">💳 {isAr ? 'رصيد لحجز جديد' : 'Credit for New Booking'}</option>
              </select>

              {refundForm?.mode === 'Credit' && (
                <div style={{
                  background: '#065F46',
                  color: '#34D399',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '10px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  ✅ {isAr ? 'الرصيد المتاح' : 'Available Credit Balance'}: {refundForm?.creditBalance?.toFixed(2) || '0.00'} SAR
                </div>
              )}

              <label style={styles.label}>
                {isAr ? 'سبب الاسترجاع' : 'Refund Reason'}
              </label>
              <select
                value={refundForm?.reason || ''}
                onChange={e => setRefundForm({ ...refundForm, reason: e.target.value })}
                style={styles.select}
                required
              >
                <option value="">{isAr ? 'اختر السبب' : 'Select Reason'}</option>
                <option value="Cancel by Airline">✈️ {isAr ? 'إلغاء من قبل الخطوط الجوية' : 'Cancel by Airline'}</option>
                <option value="Cancel by Customer">👤 {isAr ? 'إلغاء من قبل العميل' : 'Cancel by Customer'}</option>
                <option value="Date Change">📅 {isAr ? 'تغيير التاريخ' : 'Date Change'}</option>
                <option value="No Show">🚫 {isAr ? 'عدم الحضور' : 'No Show'}</option>
                <option value="Duplicate Booking">🔄 {isAr ? 'حجز مكرر' : 'Duplicate Booking'}</option>
                <option value="Visa Rejected">🛂 {isAr ? 'رفض التأشيرة' : 'Visa Rejected'}</option>
                <option value="Other">📌 {isAr ? 'أخرى' : 'Other'}</option>
              </select>

              <div style={{
                background: isDark ? '#0F172A' : '#F1F5F9',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'الفاتورة الأصلية' : 'Original Invoice'}</span>
                <span style={{ color: '#60A5FA', fontWeight: 700 }}>{modal.data?.invoice_no || 'N/A'}</span>
              </div>

              <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>
                {isAr ? 'معالجة الاسترجاع' : 'Process Refund'}
              </button>
              <button
                type="button"
                onClick={() => setModal({ type: null, data: null })}
                style={{ ...styles.btnDanger, width: '100%', marginTop: '10px' }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          PREVIEW INVOICE MODAL
          ============================================================ */}
      {modal.type === 'preview' && previewHTML && (
        <div style={{ ...overlay, background: 'rgba(0,0,0,0.95)' }}>
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            width: '95vw',
            maxWidth: '1000px',
            height: '95vh',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
              flexWrap: 'wrap',
              gap: '10px',
              background: isDark ? '#0F172A' : '#F8FAFC'
            }}>
              <h3 style={{ margin: 0, color: '#FBBF24', fontSize: '18px' }}>
                📄 {isAr ? 'معاينة المستند' : 'Document Preview'}
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handlePrintPreview}
                  style={{ ...styles.btnInfo, width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  🖨️ {isAr ? 'طباعة' : 'Print'}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  style={{ ...styles.btnSuccess, width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ⬇️ {isAr ? 'تحميل PDF' : 'Download PDF'}
                </button>
                <button
                  onClick={() => setModal({ type: null, data: null })}
                  style={{ ...styles.btnDanger, width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ✖ {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>

            <div style={{
              flex: 1,
              overflow: 'auto',
              background: '#F1F5F9',
              display: 'flex',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <iframe
                srcDoc={previewHTML}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
                title="Document Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          PORTAL EDIT MODAL
          ============================================================ */}
      {modal.type === 'portalEdit' && (
        <div style={overlay}>
          <div style={styles.card}>
            <h3 style={{ color: '#FBBF24', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
              ✏️ {isAr ? 'تعديل البوابة' : 'Edit Portal'}
            </h3>
            <form onSubmit={handleAddEditPortal}>
              <label style={styles.label}>{isAr ? 'اسم البوابة' : 'Portal Name'}</label>
              <input style={styles.input} value={portalForm.name} onChange={e => setPortalForm({ ...portalForm, name: e.target.value })} required />

              <label style={styles.label}>{isAr ? 'النوع' : 'Type'}</label>
              <select style={styles.select} value={portalForm.portal_type} onChange={e => setPortalForm({ ...portalForm, portal_type: e.target.value })}>
                <option>GDS</option>
                <option>Airline Direct</option>
                <option>Consolidator</option>
                <option>Hotel Supplier</option>
                <option>Other</option>
              </select>

              <label style={styles.label}>{isAr ? 'الرصيد الافتتاحي' : 'Opening Balance'}</label>
              <input type="number" step="0.01" style={styles.input} value={portalForm.initial_balance} onChange={e => setPortalForm({ ...portalForm, initial_balance: e.target.value })} />

              <label style={styles.label}>{isAr ? 'الرصيد الحالي' : 'Current Balance'}</label>
              <input type="number" step="0.01" style={styles.input} value={portalForm.current_balance} onChange={e => setPortalForm({ ...portalForm, current_balance: e.target.value })} />

              <label style={styles.label}>{isAr ? 'جهة الاتصال' : 'Contact Person'}</label>
              <input style={styles.input} value={portalForm.contact_person} onChange={e => setPortalForm({ ...portalForm, contact_person: e.target.value })} />

              <label style={styles.label}>{isAr ? 'الهاتف' : 'Phone'}</label>
              <input style={styles.input} value={portalForm.phone} onChange={e => setPortalForm({ ...portalForm, phone: e.target.value })} />

              <label style={styles.label}>{isAr ? 'حد الائتمان' : 'Credit Limit'}</label>
              <input type="number" step="0.01" style={styles.input} value={portalForm.credit_limit} onChange={e => setPortalForm({ ...portalForm, credit_limit: e.target.value })} />

              <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>
                {isAr ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setModal({ type: null, data: null });
                  setPortalForm({ name: '', portal_type: 'GDS', current_balance: 0, initial_balance: 0, phone: '', contact_person: '', credit_limit: 0 });
                }}
                style={{ ...styles.btnDanger, width: '100%', marginTop: '10px' }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          CASHBOOK EDIT MODAL
          ============================================================ */}
      {modal.type === 'cashbookEdit' && (
        <div style={overlay}>
          <div style={styles.card}>
            <h3 style={{ color: '#FBBF24', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
              ✏️ {isAr ? 'تعديل قيد الدفتر' : 'Edit Cashbook Entry'}
            </h3>
            <form onSubmit={handleCashbookEditSubmit}>
              <label style={styles.label}>{isAr ? 'التاريخ' : 'Date'}</label>
              <input
                type="date"
                style={styles.input}
                value={cashbookEditForm?.trans_date || ''}
                onChange={e => setCashbookEditForm({ ...cashbookEditForm, trans_date: e.target.value })}
                required
              />

              <label style={styles.label}>{isAr ? 'النوع' : 'Type'}</label>
              <select
                style={styles.select}
                value={cashbookEditForm?.type || ''}
                onChange={e => setCashbookEditForm({ ...cashbookEditForm, type: e.target.value })}
                required
              >
                <option value="Cash-In">💰 Cash-In</option>
                <option value="Cash-Out">💰 Cash-Out</option>
                <option value="Bank-In">🏦 Bank-In</option>
                <option value="Bank-Out">🏦 Bank-Out</option>
                <option value="Investor-In">📈 Investor-In</option>
                <option value="Investor-Out">📈 Investor-Out</option>
              </select>

              <label style={styles.label}>{isAr ? 'الوصف' : 'Description'}</label>
              <input
                style={styles.input}
                value={cashbookEditForm?.description || ''}
                onChange={e => setCashbookEditForm({ ...cashbookEditForm, description: e.target.value })}
                required
              />

              <label style={styles.label}>{isAr ? 'المبلغ' : 'Amount'}</label>
              <input
                type="number"
                step="0.01"
                style={styles.input}
                value={cashbookEditForm?.amount || 0}
                onChange={e => setCashbookEditForm({ ...cashbookEditForm, amount: e.target.value })}
                required
              />

              <button type="submit" style={{ ...styles.btnPrimary, marginTop: '20px' }}>
                {isAr ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setModal({ type: null, data: null });
                  setCashbookEditForm({});
                }}
                style={{ ...styles.btnDanger, width: '100%', marginTop: '10px' }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          CUSTOM MODAL (Generic)
          ============================================================ */}
      {modal.type === 'custom' && modal.content && (
        <div style={overlay}>
          <div style={styles.card}>
            {modal.content}
          </div>
        </div>
      )}
    </>
  );
}
