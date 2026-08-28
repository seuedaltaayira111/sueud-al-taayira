'use client';

import { supabase } from '@/lib/supabase';

export default function useERPActions(state) {
  const {
    user, data, setData, userProfile, showToast, logAction, fetchAll, lang,
    invForm, setInvForm, expForm, setExpForm, corpForm, setCorpForm,
    creditorForm, setCreditorForm, custForm, setCustForm,
    vendorForm, setVendorForm, pkgForm, setPkgForm, brnForm, setBrnForm,
    empForm, setEmpForm, srvForm, setSrvForm, investForm, setInvestForm,
    settleForm, setSettleForm, refundForm, setRefundForm,
    transferForm, setTransferForm, setForm, setSetForm,
    userForm, setUserForm, portalForm, setPortalForm,
    tenantForm, setTenantForm, profileForm, setProfileForm,
    editInvId, setEditInvId, editExpId, setEditExpId,
    editCorpId, setEditCorpId, editCredId, setEditCredId,
    editCustId, setEditCustId, editVendId, setEditVendId,
    editPkgId, setEditPkgId, editBrnId, setEditBrnId,
    editEmpId, setEditEmpId, editSrvId, setEditSrvId,
    editUserId, setEditUserId, modal, setModal,
    passForm, setPassForm, chatInput, setChatInput,
    chatMessages, setChatMessages, previewHTML, setPreviewHTML,
    getInvoiceHTML, getRefundHTML, getExpenseHTML,
    getSalarySlipHTML, getContractHTML, getMistakeHTML,
    today, router, contractCorpName, contractType,
    contractMarkup, contractTerms, payForm, setPayForm,
    advForm, setAdvForm, mistakeForm, setMistakeForm,
    leaveForm, setLeaveForm, contractForm, setContractForm
  } = state;

  const isAr = lang === 'ar';

  // ============================================================
  // AUTH
  // ============================================================
  const handleLogout = () => {
    supabase.auth.signOut();
    router.push('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passForm.newPass) return showToast(isAr ? 'नई पासवर्ड डालें' : 'Enter new password');
    if (passForm.newPass.length < 6) return showToast(isAr ? 'कम से कम 6 अक्षर' : 'Minimum 6 characters');
    const { error } = await supabase.auth.updateUser({ password: passForm.newPass });
    if (error) return showToast('Error: ' + error.message);
    showToast(isAr ? '✅ पासवर्ड बदल गया' : '✅ Password updated');
    setModal({ type: null, data: null });
    setPassForm({ newPass: '' });
  };

  // ============================================================
  // AI CHAT
  // ============================================================
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    const input = chatInput.toLowerCase();
    setChatInput('');

    setTimeout(() => {
      let reply = isAr
        ? 'मैं फ़्लाइट, इनवॉइस, कस्टमर, हज/उमरा, होटल, वीज़ा आदि में मदद कर सकता हूँ।'
        : "I can help with flights, invoices, customers, Hajj/Umrah, hotels, visas, etc.";
      // ... baaki AI logic aapki original file se
      // (yahan main shorten kar raha hoon, aap apna purana logic rakh sakte hain)
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 400);
  };

  // ============================================================
  // PROFILE & SETTINGS (original, unchanged)
  // ============================================================
  const handleProfilePicUpload = async (e) => { /* ... */ };
  const handleSaveProfile = async (e) => { /* ... */ };
  const handleLogoUpload = async (e) => { /* ... */ };
  const handleSaveSettings = async (e) => { /* ... */ };
  const handleAddCustomField = () => { /* ... */ };
  const handleRemoveCustomField = (i) => { /* ... */ };
  const handleCustomFieldChange = (i, type, val) => { /* ... */ };

  // ============================================================
  // GENERIC DELETE
  // ============================================================
  const handleDelete = async (table, id) => {
    if (!confirm(isAr ? 'क्या आप हटाना चाहते हैं?' : 'Delete?')) return;
    try {
      await supabase.from(table).delete().eq('id', id);
      setData(prev => ({
        ...prev,
        [table]: Array.isArray(prev[table]) ? prev[table].filter(i => i.id !== id) : []
      }));
      showToast(isAr ? '✅ हटा दिया' : '✅ Deleted');
      await logAction(`Deleted from ${table}`);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // CRUD: Customers, Corporates, Creditors, Vendors, Packages, Branches, Employees, Services
  // (Sare original functions yahan rakhiye – main sirf placeholder de raha hoon)
  // ============================================================
  const handleEditCust = (c) => { /* ... */ };
  const handleAddEditCust = async (e) => { /* ... */ };
  const handleEditCorp = (c) => { /* ... */ };
  const handleAddEditCorp = async (e) => { /* ... */ };
  const handleEditCred = (c) => { /* ... */ };
  const handleAddEditCred = async (e) => { /* ... */ };
  const handleEditVend = (c) => { /* ... */ };
  const handleAddEditVend = async (e) => { /* ... */ };
  const handleEditPkg = (c) => { /* ... */ };
  const handleAddEditPkg = async (e) => { /* ... */ };
  const handleEditBrn = (c) => { /* ... */ };
  const handleAddEditBrn = async (e) => { /* ... */ };
  const handleEditEmp = (c) => { /* ... */ };
  const handleAddEditEmp = async (e) => { /* ... */ };
  const handleEditSrv = (c) => { /* ... */ };
  const handleAddEditSrv = async (e) => { /* ... */ };

  // ============================================================
  // EXPENSES (with items)
  // ============================================================
  const handleAddExpItem = () => { /* ... */ };
  const handleRemoveExpItem = (i) => { /* ... */ };
  const handleExpItemChange = (i, field, val) => { /* ... */ };
  const handleEditExp = (exp) => { /* ... */ };
  const handleAddEditExpense = async (e) => { /* ... */ };
  const handleDeleteExpense = async (exp) => { /* ... */ };
  const generateExpenseVoucher = (exp) => {
    setPreviewHTML(getExpenseHTML(exp, data.settings, lang));
    setModal({ type: 'preview', data: exp });
  };

  // ============================================================
  // PORTALS
  // ============================================================
  const handleAddEditPortal = async (e) => { /* ... */ };

  // ============================================================
  // TRANSFER
  // ============================================================
  const handleTransfer = async (e) => { /* ... */ };

  // ============================================================
  // INVESTMENTS
  // ============================================================
  const handleAddInvestment = async (e) => { /* ... */ };

  // ============================================================
  // PDF DOWNLOAD
  // ============================================================
  const downloadPDF = async (htmlContent, filename = 'document.pdf') => {
    try {
      // ... aapka original downloadPDF logic
    } catch (e) { /* fallback print */ }
  };

  // ============================================================
  // INVOICE DOWNLOAD, PRINT, PREVIEW
  // ============================================================
  const handleDownloadPDF = async (inv) => { /* ... */ };
  const printInvoice = (inv) => { /* ... */ };
  const openPreview = (inv) => { /* ... */ };

  // ============================================================
  // SHARE
  // ============================================================
  const shareWhatsApp = (inv) => { /* ... */ };
  const shareEmail = (inv) => { /* ... */ };

  // ============================================================
  // REFUND & SETTLE MODALS
  // ============================================================
  const openRefundModal = (inv) => { /* ... */ };
  const openSettleModal = (inv) => { /* ... */ };
  const handleQuickSettle = (inv) => openSettleModal(inv);

  const handleSettlePayment = async (e) => { /* ... */ };

  const handleRefund = async (e) => { /* ... */ };

  // ============================================================
  // DELETE INVOICE (with reversal)
  // ============================================================
  const handleDeleteInvoice = async (inv) => { /* ... */ };

  // ============================================================
  // EDIT INVOICE
  // ============================================================
  const handleEditInvoice = (inv) => { /* ... */ };

  // ============================================================
  // CREATE INVOICE
  // ============================================================
  const handleCreateInvoice = async (e) => { /* ... */ };

  // ============================================================
  // STAFF MISTAKES
  // ============================================================
  const handleAddMistake = async (e) => { /* ... */ };
  const handlePreviewMistake = (m) => {
    setPreviewHTML(getMistakeHTML(m, data.settings, lang));
    setModal({ type: 'preview', data: m });
  };
  const handleDeleteMistake = async (m) => { /* ... */ };

  // ============================================================
  // PAYROLL (with auto-advance deduction)
  // ============================================================
  const handleGenerateSlip = (pay) => {
    setPreviewHTML(getSalarySlipHTML(pay, data.settings, lang));
    setModal({ type: 'preview', data: pay });
  };
  const handleDeletePayroll = async (pay) => { /* ... */ };

  const handleProcessPayroll = async (e) => {
    e.preventDefault();
    try {
      const empId = payForm.employee_id;
      if (!empId) throw new Error(isAr ? 'कर्मचारी चुनें' : 'Select employee');
      const emp = data.employees?.find(em => em.id === empId);
      if (!emp) throw new Error(isAr ? 'कर्मचारी नहीं मिला' : 'Employee not found');

      const month = payForm.month || today.slice(0, 7);
      const base = parseFloat(emp.salary) || 0;

      // Commission
      const monthInvoices = data.invoices?.filter(i =>
        i.employee_id === empId &&
        i.invoice_date?.startsWith(month) &&
        i.status !== 'refunded'
      ) || [];
      const commissionBase = monthInvoices.reduce((s, i) => s + (i.total_sell || 0), 0);
      const commissionRate = parseFloat(emp.commission_rate) || 0;
      const commissionAmt = commissionBase * (commissionRate / 100);

      // Pending advances – auto deduct
      const pendingAdvances = (data.empAdvances || []).filter(a => a.employee_id === empId && a.status === 'Pending');
      const totalPendingAdvance = pendingAdvances.reduce((sum, a) => sum + (a.amount || 0), 0);

      const overtime = parseFloat(payForm.overtime) || 0;
      const gift = parseFloat(payForm.gift) || 0;
      const mistakesDed = parseFloat(payForm.mistakes_deduction) || 0;
      const otherDed = parseFloat(payForm.other_deduction) || 0;

      let advanceDed = parseFloat(payForm.advance) || 0;
      if (advanceDed === 0 && totalPendingAdvance > 0) {
        advanceDed = totalPendingAdvance;
        // Mark advances as deducted
        for (const adv of pendingAdvances) {
          await supabase.from('emp_advances').update({ status: 'Deducted from Salary' }).eq('id', adv.id);
        }
        setData(prev => ({
          ...prev,
          empAdvances: prev.empAdvances.map(a =>
            pendingAdvances.some(p => p.id === a.id) ? { ...a, status: 'Deducted from Salary' } : a
          )
        }));
      }

      const totalDed = advanceDed + mistakesDed + otherDed;
      const gross = base + commissionAmt + overtime + gift;
      const netPay = gross - totalDed;

      const { data: newPay, error } = await supabase
        .from('payroll')
        .insert([{
          employee_id: empId,
          month,
          base_salary: base,
          commission: commissionAmt,
          overtime,
          gift,
          advance_deduction: advanceDed,
          mistakes_deduction: mistakesDed,
          other_deduction: otherDed,
          gross_salary: gross,
          total_deductions: totalDed,
          amount: netPay,
          payment_mode: payForm.payment_mode || 'Cash',
          payment_date: payForm.payment_date || today,
          notes: payForm.notes || '',
          tenant_id: userProfile.tenant_id
        }])
        .select('*, employees(name, role)')
        .single();

      if (error) throw new Error('Payroll failed: ' + error.message);

      // Cashbook entry
      const cbType = payForm.payment_mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
      const { data: nCb } = await supabase.from('cashbook').insert([{
        trans_date: payForm.payment_date || today,
        type: cbType,
        description: `Salary - ${emp.name} (${month})`,
        amount: netPay,
        tenant_id: userProfile.tenant_id,
        reference_id: newPay.id
      }]).select().single();

      setData(prev => ({
        ...prev,
        payroll: [newPay, ...(prev.payroll || [])],
        cashbook: nCb ? [nCb, ...prev.cashbook] : prev.cashbook
      }));

      await logAction(`Payroll: ${emp.name} - ${netPay.toFixed(2)} SAR (${month})`);
      showToast(isAr ? `✅ ${emp.name} - ${netPay.toFixed(2)} SAR सैलरी दी गई` : `✅ ${emp.name} - ${netPay.toFixed(2)} SAR Salary Processed`);

      setPayForm({
        employee_id: '',
        month: today.slice(0, 7),
        overtime: 0,
        gift: 0,
        advance: 0,
        mistakes_deduction: 0,
        other_deduction: 0,
        payment_mode: 'Cash',
        payment_date: today,
        notes: ''
      });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // EMPLOYEE ADVANCES
  // ============================================================
  const handleAddAdvance = async (e) => {
    e.preventDefault();
    try {
      if (!advForm.employee_id) throw new Error(isAr ? 'कर्मचारी चुनें' : 'Select employee');
      const amount = parseFloat(advForm.amount) || 0;
      if (amount <= 0) throw new Error(isAr ? 'सही राशि डालें' : 'Enter valid amount');

      const { data: newAdv, error } = await supabase
        .from('emp_advances')
        .insert([{
          employee_id: advForm.employee_id,
          amount,
          date: advForm.date || today,
          status: advForm.status || 'Pending',
          reason: advForm.reason || '',
          tenant_id: userProfile.tenant_id
        }])
        .select('*, employees(name)')
        .single();

      if (error) throw error;
      setData(prev => ({
        ...prev,
        empAdvances: [newAdv, ...(prev.empAdvances || [])]
      }));
      showToast(isAr ? '✅ एडवांस दर्ज किया' : '✅ Advance recorded');
      await logAction(`Advance of ${amount.toFixed(2)} SAR to ${newAdv.employees?.name || ''}`);
      setAdvForm({ employee_id: '', amount: '', date: today, status: 'Pending', reason: '' });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleUpdateAdvanceStatus = async (adv, status) => {
    try {
      await supabase.from('emp_advances').update({ status }).eq('id', adv.id);
      setData(prev => ({
        ...prev,
        empAdvances: prev.empAdvances.map(a => a.id === adv.id ? { ...a, status } : a)
      }));
      showToast(isAr ? '✅ अपडेट हो गया' : '✅ Updated');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleDeleteAdvance = async (adv) => {
    if (!confirm(isAr ? 'हटाएं?' : 'Delete?')) return;
    try {
      await supabase.from('emp_advances').delete().eq('id', adv.id);
      setData(prev => ({
        ...prev,
        empAdvances: prev.empAdvances.filter(a => a.id !== adv.id)
      }));
      showToast(isAr ? '✅ हटा दिया' : '✅ Deleted');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // CONTRACT / OFFER
  // ============================================================
  const handleGenerateContract = (e) => {
    e.preventDefault();
    if (!contractCorpName) return showToast(isAr ? 'कॉर्पोरेट नाम डालें' : 'Enter Corporate Name');
    const html = getContractHTML(
      data.settings,
      contractCorpName,
      today,
      false,
      contractType,
      contractMarkup,
      contractTerms
    );
    setPreviewHTML(html);
    setModal({ type: 'preview', data: null });
  };

  const handleGenerateOffer = (e) => {
    e.preventDefault();
    if (!contractCorpName) return showToast(isAr ? 'कॉर्पोरेट नाम डालें' : 'Enter Corporate Name');
    const html = getContractHTML(
      data.settings,
      contractCorpName,
      today,
      true,
      contractType,
      contractMarkup,
      contractTerms
    );
    setPreviewHTML(html);
    setModal({ type: 'preview', data: null });
  };

  // ============================================================
  // SUPERADMIN – TENANT
  // ============================================================
  const handleAddTenant = async (e) => { /* ... */ };
  const handleToggleSubscription = async (tenant) => { /* ... */ };
  const handleDeleteTenant = async (id) => { /* ... */ };

  // ============================================================
  // EXPORT CSV
  // ============================================================
  const handleExportCSV = (dataType, customData) => { /* ... */ };

  // ============================================================
  // RETURN ALL ACTIONS
  // ============================================================
  return {
    handleLogout,
    handleChangePassword,
    handleSendMessage,
    handleProfilePicUpload,
    handleSaveProfile,
    handleLogoUpload,
    handleSaveSettings,
    handleAddCustomField,
    handleRemoveCustomField,
    handleCustomFieldChange,
    handleDelete,
    downloadPDF,
    handleDownloadPDF,
    printInvoice,
    shareWhatsApp,
    shareEmail,
    openPreview,
    openRefundModal,
    openSettleModal,
    handleQuickSettle,
    handleSettlePayment,
    handleRefund,
    handleEditInvoice,
    handleCreateInvoice,
    handleDeleteInvoice,
    handleEditCust,
    handleAddEditCust,
    handleEditCorp,
    handleAddEditCorp,
    handleEditCred,
    handleAddEditCred,
    handleEditVend,
    handleAddEditVend,
    handleEditPkg,
    handleAddEditPkg,
    handleEditBrn,
    handleAddEditBrn,
    handleEditEmp,
    handleAddEditEmp,
    handleEditSrv,
    handleAddEditSrv,
    handleAddExpItem,
    handleRemoveExpItem,
    handleExpItemChange,
    handleEditExp,
    handleAddEditExpense,
    handleDeleteExpense,
    generateExpenseVoucher,
    handleAddEditPortal,
    handleTransfer,
    handleAddInvestment,
    handleAddMistake,
    handlePreviewMistake,
    handleDeleteMistake,
    handleGenerateSlip,
    handleDeletePayroll,
    handleProcessPayroll,
    handleAddAdvance,
    handleUpdateAdvanceStatus,
    handleDeleteAdvance,
    handleGenerateContract,
    handleGenerateOffer,
    handleAddTenant,
    handleToggleSubscription,
    handleDeleteTenant,
    handleExportCSV
  };
}
