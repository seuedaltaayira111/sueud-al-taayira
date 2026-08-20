'use client';
import { supabase } from '@/lib/supabase';
import { handleShareWhatsApp, handleShareEmail } from '@/lib/invoiceUtils';

export default function useERPActions(state) {
  const {
    user, data, setData, userProfile, showToast, logAction, fetchAll, lang,
    invForm, setInvForm, expForm, setExpForm, corpForm, setCorpForm, creditorForm, setCreditorForm,
    custForm, setCustForm, vendorForm, setVendorForm, pkgForm, setPkgForm, brnForm, setBrnForm,
    empForm, setEmpForm, srvForm, setSrvForm, investForm, setInvestForm, settleForm, setSettleForm,
    refundForm, setRefundForm, transferForm, setTransferForm, setForm, setSetForm, userForm, setUserForm,
    portalForm, setPortalForm, tenantForm, setTenantForm, profileForm, setProfileForm,
    editInvId, setEditInvId, editExpId, setEditExpId, editCorpId, setEditCorpId,
    editCredId, setEditCredId, editCustId, setEditCustId, editVendId, setEditVendId,
    editPkgId, setEditPkgId, editBrnId, setEditBrnId, editEmpId, setEditEmpId,
    editSrvId, setEditSrvId, editUserId, setEditUserId, modal, setModal, passForm, setPassForm,
    chatInput, setChatInput, chatMessages, setChatMessages, previewHTML, setPreviewHTML,
    getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getContractHTML, getMistakeHTML,
    today, router, contractCorpName, contractType, contractMarkup, contractTerms, setContractTerms,
    tenantForm: tForm, setTenantForm: setTForm, payForm, setPayForm
  } = state;

  // ===================== AUTH =====================
  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passForm.newPass) return showToast('Enter a new password!');
    if (passForm.newPass.length < 6) return showToast('Password must be at least 6 characters!');
    const { error } = await supabase.auth.updateUser({ password: passForm.newPass });
    if (error) return showToast('Error: ' + error.message);
    showToast('Password Updated!');
    setModal({ type: null, data: null });
    setPassForm({ newPass: '' });
  };

  // ===================== CHAT =====================
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    const input = chatInput.toLowerCase();
    setChatInput('');
    setTimeout(() => {
      let reply = lang === 'ar' ? 'يمكنني المساعدة في الفواتير والعملاء. جرب السؤال عنهم!' : "I can help with Invoices, Customers, Reports. Try asking about them!";
      if (input.includes('invoice') || input.includes('فاتورة')) reply = lang === 'ar' ? '📄 اذهب إلى "إنشاء فاتورة" أو "الفواتير" لعرضها.' : "📄 Go to 'Create Invoice' to make one, or 'Invoices' to view all.";
      else if (input.includes('customer') || input.includes('عميل')) reply = lang === 'ar' ? '👤 إدارة العملاء من صفحة العملاء.' : "👤 Manage customers from the Customers page.";
      else if (input.includes('refund') || input.includes('استرجاع')) reply = lang === 'ar' ? '🔄 اضغط على زر الاسترجاع على أي فاتورة.' : "🔄 Click Refund button on any invoice.";
      else if (input.includes('report') || input.includes('تقرير')) reply = lang === 'ar' ? '📊 انتقل إلى التقارير للتحليل.' : "📊 Visit Reports for sales, expenses, P&L analysis.";
      else if (input.includes('profit') || input.includes('ربح')) reply = lang === 'ar' ? '💰 انتقل إلى صفحة الربحية.' : "💰 Check Profitability page for airline-wise profit.";
      else if (input.includes('expense') || input.includes('مصروف')) reply = lang === 'ar' ? '💸 المصروفات في قسم المالي والحسابات.' : "💸 Expenses are in Finance & Accounts section.";
      else if (input.includes('salary') || input.includes('راتب')) reply = lang === 'ar' ? '💰 الموارد البشرية > الرواتب.' : "💰 Go to HR & Payroll to pay salary.";
      else if (input.includes('portal') || input.includes('بوابة')) reply = lang === 'ar' ? '🛫 إدارة البوابات من صفحة البوابات.' : "🛫 Manage portals from the Portals page.";
      else if (input.includes('help') || input.includes('مساعدة')) reply = lang === 'ar' ? 'أنا هنا لمساعدتك! اسأل عن الفواتير، العملاء، التقارير، المصروفات، الرواتب، أو أي شيء آخر.' : "I'm here to help! Ask about invoices, customers, reports, expenses, salary, or anything else.";
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 400);
  };

  // ===================== CUSTOM FIELDS =====================
  const handleAddCustomField = () => setSetForm(prev => ({ ...prev, custom_fields: [...(prev.custom_fields || []), { key: '', value: '' }] }));
  const handleRemoveCustomField = (i) => setSetForm(prev => ({ ...prev, custom_fields: prev.custom_fields.filter((_, idx) => idx !== i) }));
  const handleCustomFieldChange = (i, type, val) => setSetForm(prev => { const cf = [...prev.custom_fields]; cf[i] = { ...cf[i], [type]: val }; return { ...prev, custom_fields: cf }; });

  // ===================== PROFILE =====================
  const handleProfilePicUpload = async (e) => {
    try {
      const file = e.target.files[0]; if (!file) return;
      const fileName = `avatar-${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('logos').upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
      setProfileForm(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
      showToast('Profile Picture Uploaded!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('app_users').update({
        username: profileForm.username, avatar_url: profileForm.avatar_url,
        phone: profileForm.phone, address: profileForm.address
      }).eq('id', userProfile.id);
      if (error) throw error;
      setUserProfile(prev => ({ ...prev, ...profileForm }));
      showToast('Profile Updated!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== LOGO & SETTINGS =====================
  const handleLogoUpload = async (e) => {
    try {
      const file = e.target.files[0]; if (!file) return;
      const fileName = `logo-${userProfile.tenant_id}-${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('logos').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
      setSetForm(prev => ({ ...prev, logo_url: urlData.publicUrl }));
      showToast('Logo Uploaded! Click Save to apply.');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const { data: existing } = await supabase.from('settings').select('id').eq('tenant_id', userProfile.tenant_id).maybeSingle();
      if (existing) {
        const { error } = await supabase.from('settings').update(setForm).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('settings').insert([{ tenant_id: userProfile.tenant_id, ...setForm }]);
        if (error) throw error;
      }
      showToast('Settings Saved!'); fetchAll();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== TENANT =====================
  const handleAddTenant = async (e) => {
    e.preventDefault();
    try {
      const tempPass = Math.random().toString(36).slice(-8) + 'A1!';
      const res = await fetch('/api/create-tenant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tForm, temp_password: tempPass })
      });
      const resData = await res.json();
      if (resData.error) throw new Error(resData.error);
      showToast(`Agency Created! Email: ${tForm.owner_email} | Pass: ${tempPass}`);
      setTForm({ agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' });
      fetchAll();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleToggleSubscription = async (tenant) => {
    try {
      const { error } = await supabase.from('tenants').update({ is_paid: !tenant.is_paid }).eq('id', tenant.id);
      if (error) throw error;
      showToast('Subscription Updated!'); fetchAll();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleDeleteTenant = async (id) => {
    if (!confirm('Delete this Agency permanently?')) return;
    try {
      await supabase.from('tenants').delete().eq('id', id);
      showToast('Agency Deleted!'); fetchAll();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== PDF & PRINT (QR BASE64 FIX) =====================
  const downloadPDF = async (htmlContent, filename = 'document.pdf') => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const div = document.createElement('div');
      div.style.cssText = 'position:absolute;left:-9999px;top:0';
      // Convert QR Code Images to Base64
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const imgs = doc.querySelectorAll('img[src*="api.qrserver.com"]');
      await Promise.all(Array.from(imgs).map(async (img) => {
        try {
          const resp = await fetch(img.src); const blob = await resp.blob();
          const b64 = await new Promise(r => { const fr = new FileReader(); fr.onloadend = () => r(fr.result); fr.readAsDataURL(blob); });
          img.src = b64;
        } catch (e) { console.warn("QR fetch skipped:", e.message); }
      }));
      div.innerHTML = doc.body.innerHTML;
      document.body.appendChild(div);
      const allImgs = div.querySelectorAll('img');
      await Promise.all(Array.from(allImgs).map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; })));
      const canvas = await html2canvas(div, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = 210, ph = 297, h = (canvas.height * w) / canvas.width;
      let left = h - ph, pos = 0;
      pdf.addImage(imgData, 'PNG', 0, pos, w, h);
      left -= ph;
      while (left >= 0) { pos = left - h; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, pos, w, h); left -= ph; }
      pdf.save(filename);
      document.body.removeChild(div);
      showToast('PDF Downloaded!');
    } catch (err) { showToast('PDF Error: ' + err.message); }
  };

  const handleDownloadPDF = async (inv) => {
    const s = data.settings;
    const html = inv.invoice_no?.startsWith('REF-') ? getRefundHTML(inv, s, lang) : getInvoiceHTML(inv, s, lang);
    await downloadPDF(html, `${inv.invoice_no}.pdf`);
  };

  const printInvoice = (inv) => {
    const s = data.settings;
    const html = inv.invoice_no?.startsWith('REF-') ? getRefundHTML(inv, s, lang) : getInvoiceHTML(inv, s, lang);
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 500);
  };

  // ===================== SHARE =====================
  const shareWhatsApp = (inv) => {
    if (inv.invoice_no?.startsWith('REF-')) return showToast('Refund invoices cannot be shared via WhatsApp!');
    handleShareWhatsApp(inv, data.settings);
  };
  const shareEmail = (inv) => {
    if (inv.invoice_no?.startsWith('REF-')) return showToast('Refund invoices cannot be shared via Email!');
    handleShareEmail(inv, data.settings);
  };

  // ===================== CONTRACT / OFFER =====================
  const handleGenerateContract = (e) => {
    e.preventDefault();
    if (!contractCorpName) return showToast('Enter Corporate Name');
    const html = getContractHTML(data.settings, contractCorpName, today, false, contractType, contractMarkup, contractTerms);
    setPreviewHTML(html); setModal({ type: 'preview', data: null });
  };
  const handleGenerateOffer = (e) => {
    e.preventDefault();
    if (!contractCorpName) return showToast('Enter Corporate Name');
    const html = getContractHTML(data.settings, contractCorpName, today, true, contractType, contractMarkup, contractTerms);
    setPreviewHTML(html); setModal({ type: 'preview', data: null });
  };

  // ===================== PREVIEW & MODAL OPENERS =====================
  const openPreview = (inv) => {
    const s = data.settings;
    let html = inv.invoice_no?.startsWith('REF-') ? getRefundHTML(inv, s, lang) : getInvoiceHTML(inv, s, lang);
    if (!inv.invoice_no?.startsWith('REF-') && inv.linked_inv_id && (inv.booking_type === 'Previous Booking' || inv.booking_type === 'Reissue')) {
      const linked = data.invoices.find(i => i.invoice_no === inv.linked_inv_id);
      if (linked) {
        html += `<div style="margin-top:30px;border-top:2px dashed #cbd5e1;padding-top:20px;">
          <h1 style="color:#7f1d1d;text-align:center;font-size:18px;margin-bottom:15px;">Linked Refund / فاتورة الاسترجاع المرتبطة</h1>
          ${getRefundHTML(linked, s, lang)}</div>`;
      }
    }
    setPreviewHTML(html); setModal({ type: 'preview', data: inv });
  };

  const openRefundModal = (inv) => {
    const cust = data.customers.find(c => c.id === inv.customer_id);
    setRefundForm({
      id: inv.id, date: today, compRefund: 0, custRefund: inv.due_amount || inv.total || 0,
      mode: 'Cash', reason: '', portalId: inv.portal_id || '', creditBalance: cust?.store_credit || 0
    });
    setModal({ type: 'refund', data: inv });
  };

  const openSettleModal = (inv) => {
    setSettleForm({ id: inv.id, date: today, mode: 'Cash' });
    setModal({ type: 'settle', data: inv });
  };

  const handleQuickSettle = (inv) => openSettleModal(inv);

  // ===================== SETTLE PAYMENT =====================
  const handleSettlePayment = async (e) => {
    e.preventDefault();
    try {
      const inv = modal.data || data.invoices.find(i => i.id === settleForm.id);
      if (!inv) throw new Error('Invoice not found');
      const settleAmt = inv.due_amount || 0;
      const newPaid = (inv.paid_amount || 0) + settleAmt;
      const { data: upInv, error } = await supabase.from('invoices').update({
        paid_amount: newPaid, due_amount: 0, status: 'Paid'
      }).eq('id', inv.id).select('*, customers(name), corporates(name), employees(name)').single();
      if (error) throw error;
      const cbType = settleForm.mode === 'Cash' ? 'Cash-In' : 'Bank-In';
      const { data: nC } = await supabase.from('cashbook').insert([{
        trans_date: settleForm.date, type: cbType,
        description: `Settlement for ${inv.invoice_no}`,
        amount: settleAmt, tenant_id: userProfile.tenant_id, reference_id: inv.id
      }]).select().single();
      setData(prev => ({
        ...prev,
        invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i),
        cashbook: nC ? [nC, ...prev.cashbook] : prev.cashbook
      }));
      await logAction(`Settled ${settleAmt.toFixed(2)} SAR for ${inv.invoice_no}`);
      showToast('Payment Settled!');
      setModal({ type: null, data: null });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== REFUND =====================
  const handleRefund = async (e) => {
    e.preventDefault();
    try {
      const origInv = modal.data;
      if (!origInv) throw new Error('Original invoice not found');
      const compRef = parseFloat(refundForm.compRefund) || 0;
      const custRef = parseFloat(refundForm.custRefund) || 0;
      const refundNo = `REF-${Date.now()}`;
      // Credit balance refund
      if (refundForm.mode === 'Credit' && custRef > 0 && origInv.customer_id) {
        const cust = data.customers.find(c => c.id === origInv.customer_id);
        if (cust) {
          const nc = (cust.store_credit || 0) + custRef;
          await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id);
          setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: nc } : c) }));
        }
      }
      // Portal balance refund
      if (compRef > 0 && refundForm.portalId) {
        const portal = data.portals.find(p => p.id === refundForm.portalId);
        if (portal) {
          const nb = (portal.current_balance || 0) + compRef;
          await supabase.from('portals').update({ current_balance: nb }).eq('id', portal.id);
          setData(prev => ({ ...prev, portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: nb } : p) }));
        }
      }
      // Create refund invoice
      const payload = {
        invoice_no: refundNo, customer_id: origInv.customer_id, corporate_id: origInv.corporate_id,
        old_customer_name: origInv.customers?.name || 'N/A', old_customer_phone: origInv.customers?.phone || 'N/A',
        portal_id: refundForm.portalId || origInv.portal_id, employee_id: origInv.employee_id || null,
        invoice_date: refundForm.date, refund_date: refundForm.date,
        service_type: origInv.service_type, sector: origInv.sector, flight_sector: origInv.flight_sector,
        airline: origInv.airline, ticket_no: origInv.ticket_no, pnr: origInv.pnr,
        passenger_names: origInv.passenger_names, flight_type: origInv.flight_type, flight_journey: origInv.flight_journey,
        total_cost: 0, total_sell: 0, profit: compRef - custRef,
        vat: 0, total: 0, paid_amount: 0, due_amount: 0,
        payment_method: refundForm.mode, refund_company: compRef, refund_customer: custRef,
        refund_reason: refundForm.reason, linked_inv_id: origInv.invoice_no,
        old_airline: origInv.airline, old_sector: origInv.flight_sector || origInv.sector,
        old_pnr: origInv.pnr, old_ticket_no: origInv.ticket_no,
        old_flight_type: origInv.flight_type, old_payment_method: origInv.payment_method,
        old_passengers: origInv.passenger_names, old_sell_price: origInv.total_sell || 0,
        old_booking_date: origInv.invoice_date, status: 'refunded', tenant_id: userProfile.tenant_id
      };
      const { data: newRef, error: refErr } = await supabase.from('invoices').insert([payload]).select('*, customers(name), corporates(name), employees(name)').single();
      if (refErr) throw new Error('Refund failed: ' + refErr.message);
      // Cashbook for customer refund
      let newCb = null;
      if (custRef > 0 && refundForm.mode !== 'Credit') {
        const cbType = refundForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
        const { data: nC } = await supabase.from('cashbook').insert([{
          trans_date: refundForm.date, type: cbType,
          description: `Refund to customer for ${refundNo}`, amount: custRef,
          tenant_id: userProfile.tenant_id, reference_id: newRef.id
        }]).select().single();
        newCb = nC;
      }
      // Mark original as refunded
      await supabase.from('invoices').update({ status: 'refunded' }).eq('id', origInv.id);
      setData(prev => ({
        ...prev,
        invoices: [newRef, ...prev.invoices.map(i => i.id === origInv.id ? { ...i, status: 'refunded' } : i)],
        cashbook: newCb ? [newCb, ...prev.cashbook] : prev.cashbook
      }));
      await logAction(`Refund ${refundNo} for ${origInv.invoice_no} (Comp:${compRef}, Cust:${custRef})`);
      showToast('Refund Processed!');
      setModal({ type: null, data: null });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== STAFF MISTAKES =====================
  const handleAddMistake = async (e) => {
    e.preventDefault();
    try {
      const fd = e.target;
      const { data: newM, error } = await supabase.from('staff_mistakes').insert([{
        employee_id: fd.emp.value, old_ticket_no: fd.old_tkt.value,
        new_ticket_no: fd.new_tkt.value, loss_amount: parseFloat(fd.loss_amt.value) || 0,
        paid_by_employee: fd.paid_by_emp?.checked || false,
        date: today, tenant_id: userProfile.tenant_id
      }]).select('*, employees(name)').single();
      if (error) throw error;
      setData(prev => ({ ...prev, staffMistakes: [newM, ...(prev.staffMistakes || [])] }));
      showToast('Mistake Logged!'); fd.reset();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handlePreviewMistake = (m) => {
    setPreviewHTML(getMistakeHTML(m, data.settings, lang));
    setModal({ type: 'preview', data: m });
  };

  const handleDeleteMistake = async (m) => {
    if (!confirm('Delete this mistake?')) return;
    try {
      await supabase.from('staff_mistakes').delete().eq('id', m.id);
      setData(prev => ({ ...prev, staffMistakes: prev.staffMistakes.filter(x => x.id !== m.id) }));
      showToast('Mistake Deleted!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== SALARY SLIP =====================
  const handleGenerateSlip = (pay) => {
    setPreviewHTML(getSalarySlipHTML(pay, data.settings, lang));
    setModal({ type: 'preview', data: pay });
  };

  const handleDeletePayroll = async (pay) => {
    if (!confirm('Delete this salary slip permanently?')) return;
    try {
      // Reverse cashbook entry
      const cbs = data.cashbook.filter(c => c.reference_id === pay.id);
      for (const cb of cbs) await supabase.from('cashbook').delete().eq('id', cb.id);
      await supabase.from('payroll').delete().eq('id', pay.id);
      setData(prev => ({
        ...prev,
        payroll: prev.payroll.filter(p => p.id !== pay.id),
        cashbook: prev.cashbook.filter(c => !cbs.find(x => x.id === c.id))
      }));
      showToast('Salary Slip Deleted!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== EDIT INVOICE =====================
  const handleEditInvoice = (inv) => {
    if (inv.invoice_no?.startsWith('REF-')) {
      const cust = data.customers.find(c => c.id === inv.customer_id);
      setRefundForm({
        id: inv.id, date: inv.refund_date || inv.invoice_date || today,
        compRefund: inv.refund_company || 0, custRefund: inv.refund_customer || 0,
        mode: inv.payment_method || 'Cash', reason: inv.refund_reason || '',
        portalId: inv.portal_id, creditBalance: cust?.store_credit || 0
      });
      setModal({ type: 'refund', data: inv }); return;
    }
    setEditInvId(inv.id);
    const custObj = inv.customer_id ? data.customers.find(c => c.id === inv.customer_id) : null;
    const corpObj = inv.corporate_id ? data.corporates.find(c => c.id === inv.corporate_id) : null;
    setInvForm({
      custType: inv.customer_id ? 'Individual' : 'Corporate',
      custId: inv.customer_id || 'new', custName: custObj?.name || '', custPhone: custObj?.phone || '',
      corpId: inv.corporate_id || 'new', corpName: corpObj?.name || '', corpVat: corpObj?.vat_no || '',
      corpPhone: corpObj?.phone || '', corpAddress: corpObj?.address || '',
      portalId: inv.portal_id, service: inv.service_type,
      flightType: inv.flight_type || 'Domestic', flightJourney: inv.flight_journey || 'Single',
      refundable: inv.refundable_status || 'Refundable', bookingType: inv.booking_type || 'New Booking',
      linkedInvId: inv.linked_inv_id || '', oldTicketNo: inv.old_ticket_no || '', oldPnr: inv.old_pnr || '',
      oldAirline: inv.old_airline || '', oldSector: inv.old_sector || '',
      oldSellPrice: inv.old_sell_price || 0, oldBookingDate: inv.old_booking_date || '',
      oldPassengers: inv.old_passengers || '', oldFlightType: inv.old_flight_type || '',
      oldPaymentMethod: inv.old_payment_method || '', refundReason: inv.refund_reason || '',
      flightSector: inv.flight_sector || '', airline: inv.airline || '', pnr: inv.pnr || '',
      ticketNo: inv.ticket_no || '', qty: inv.qty || 1,
      cost: (inv.total_cost || 0) / (inv.qty || 1),
      sell: ((inv.total_sell || 0) + (inv.discount || 0)) / (inv.qty || 1),
      discount: inv.discount || 0, taxRate: inv.vat > 0 ? '15' : '0',
      payment: inv.payment_method, paid: (inv.paid_amount || 0) - (inv.used_credit || 0),
      useCredit: inv.used_credit || 0, invoiceDate: inv.invoice_date || today,
      employeeId: inv.employee_id || '', passengers: inv.passenger_names?.split('\n') || [''],
      status: inv.status || 'Unpaid', creditDueDate: inv.credit_due_date || '',
      creditorId: inv.creditor_id || '', tabbyNo: inv.tabby_order_no || '',
      tamaraNo: inv.tamara_order_no || '', ticketStatus: inv.ticket_status || 'Confirmed',
      bookingDate: inv.booking_date || today, destination: '', hotelName: '',
      checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', creditCustId: ''
    });
    state.setPage('create');
  };

  // ===================== CREATE INVOICE (TYPO FIX + OVERPAYMENT FIX) =====================
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      // Duplicate customer check
      if (invForm.custType === 'Individual' && invForm.custId === 'new' && invForm.custName) {
        const exists = data.customers.find(c => c.name.toLowerCase() === invForm.custName.toLowerCase() && c.phone === invForm.custPhone);
        if (exists) throw new Error('Customer already exists! Select from dropdown.');
      }
      const qty = parseInt(invForm.qty) || 1;
      const cost = (parseFloat(invForm.cost) || 0) * qty;
      let sell = (parseFloat(invForm.sell) || 0) * qty;
      const discount = parseFloat(invForm.discount) || 0;
      sell = sell - discount;
      const taxRate = parseFloat(invForm.taxRate) || 0;
      const vat = sell * (taxRate / 100);
      const total = sell + vat;

      // OVERPAYMENT FIX: Correct logic for due amount
      let cashPaid = parseFloat(invForm.paid) || 0;
      let cashReturn = 0;
      let actualCashPaid = cashPaid;

      if (cashPaid > total && (invForm.payment === 'Card / Network' || invForm.payment === 'Bank Transfer')) {
        cashReturn = cashPaid - total;
        actualCashPaid = total; // Only record what's owed
      }

      const usedCredit = parseFloat(invForm.useCredit) || 0;
      const totalPaid = actualCashPaid + usedCredit;
      const invoiceDue = Math.max(0, total - totalPaid);
      const invoiceStatus = invoiceDue <= 0 ? 'Paid' : 'Unpaid';
      const profit = sell - cost;

      let cid = null, corpId = null;

      // Customer/Corporate creation
      if (invForm.custType === 'Individual') {
        if (invForm.custId === 'new') {
          const { data: nC, error: cErr } = await supabase.from('customers').insert([{
            name: invForm.custName, phone: invForm.custPhone, type: 'Individual', tenant_id: userProfile.tenant_id
          }]).select().single();
          if (cErr) throw new Error('Customer creation failed: ' + cErr.message);
          cid = nC.id;
        } else { cid = invForm.custId; }
      } else {
        if (invForm.corpId === 'new') {
          const { data: nCorp, error: corpErr } = await supabase.from('corporates').insert([{
            name: invForm.corpName, vat_no: invForm.corpVat, phone: invForm.corpPhone,
            address: invForm.corpAddress, tenant_id: userProfile.tenant_id
          }]).select().single();
          if (corpErr) throw new Error('Corporate creation failed: ' + corpErr.message);
          corpId = nCorp.id;
        } else { corpId = invForm.corpId; }
      }

      // Credit balance deduction
      if (invForm.payment === 'Credit Balance' && cid && usedCredit > 0) {
        const cust = data.customers.find(c => c.id === cid);
        if (cust) {
          const nc = (cust.store_credit || 0) - usedCredit;
          if (nc < 0) throw new Error('Insufficient credit balance!');
          await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id);
          setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: nc } : c) }));
        }
      }

      // Portal balance check
      const portal = data.portals.find(p => p.id === invForm.portalId);
      if (!portal) throw new Error('Select a Portal');
      if ((portal.current_balance || 0) < cost) {
        showToast(`⚠️ Low portal balance: ${(portal.current_balance || 0).toFixed(2)} SAR (Need: ${cost.toFixed(2)} SAR)`);
      }

      const passengerNames = invForm.passengers.filter(p => p).join('\n');
      const payload = {
        customer_id: cid, corporate_id: corpId, portal_id: portal.id,
        employee_id: invForm.employeeId || null, booking_date: invForm.bookingDate,
        invoice_date: invForm.invoiceDate, service_type: invForm.service,
        flight_type: invForm.flightType, flight_journey: invForm.flightJourney, // TYPO FIX: was inv.flightJourney
        refundable_status: invForm.refundable, booking_type: invForm.bookingType,
        linked_inv_id: invForm.linkedInvId || null,
        old_ticket_no: invForm.oldTicketNo || null, old_pnr: invForm.oldPnr || null,
        old_airline: invForm.oldAirline || null, old_sector: invForm.oldSector || null,
        old_sell_price: parseFloat(invForm.oldSellPrice) || 0, old_booking_date: invForm.oldBookingDate || null,
        old_passengers: invForm.oldPassengers || null, old_flight_type: invForm.oldFlightType || null,
        old_payment_method: invForm.oldPaymentMethod || null, refund_reason: invForm.refundReason || null,
        pnr: invForm.pnr, ticket_no: invForm.ticketNo, sector: invForm.service === 'Flight Ticket'
          ? `${invForm.airline} - ${invForm.flightSector}` : invForm.service,
        qty, discount, passenger_names: passengerNames || null, airline: invForm.airline || null,
        flight_sector: invForm.flightSector || null, total_cost: cost, total_sell: sell,
        profit, vat, total, paid_amount: totalPaid, used_credit: usedCredit,
        due_amount: invoiceDue, cash_return: cashReturn,
        payment_method: invForm.payment,
        credit_due_date: invoiceDue > 0 && invForm.payment === 'Credit' ? invForm.creditDueDate : null,
        creditor_id: invForm.payment === 'Credit' ? (invForm.creditorId || null) : null,
        tabby_order_no: invForm.payment === 'Tabby' ? invForm.tabbyNo : null,
        tamara_order_no: invForm.payment === 'Tamara' ? invForm.tamaraNo : null,
        ticket_status: invForm.ticketStatus, status: invoiceStatus, tenant_id: userProfile.tenant_id
      };

      if (editInvId) {
        const { data: upInv, error: upErr } = await supabase.from('invoices').update(payload).eq('id', editInvId)
          .select('*, customers(name), corporates(name), employees(name)').single();
        if (upErr) throw new Error('Update failed: ' + upErr.message);
        setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === editInvId ? upInv : i) }));
        showToast('Invoice Updated!'); setEditInvId(null);
      } else {
        const invNo = `INV-${Date.now()}`;
        const { data: newInv, error: invErr } = await supabase.from('invoices').insert([{ invoice_no: invNo, ...payload }])
          .select('*, customers(name), corporates(name), employees(name)').single();
        if (invErr) throw new Error('Creation failed: ' + invErr.message);
        // Deduct from portal
        const newBal = (portal.current_balance || 0) - cost;
        await supabase.from('portals').update({ current_balance: newBal }).eq('id', portal.id);
        await logAction(`Created Invoice ${invNo} | Amount: ${total.toFixed(2)} SAR | Profit: ${profit.toFixed(2)} SAR`);

        // Cashbook entries
        let newCbEntries = [];
        // 1. Payment received
        if (cashPaid > 0 && invForm.payment !== 'Credit' && invForm.payment !== 'Credit Balance') {
          const cbType = invForm.payment === 'Cash' ? 'Cash-In' : 'Bank-In';
          const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{
            trans_date: invForm.invoiceDate, type: cbType,
            description: `Payment for ${invNo}`, amount: cashPaid,
            tenant_id: userProfile.tenant_id, reference_id: newInv.id
          }]).select().single();
          if (cbErr) console.error('Cashbook:', cbErr.message);
          if (nC) newCbEntries.push(nC);
        }
        // 2. Cash return (overpayment)
        if (cashReturn > 0) {
          const { data: nCO, error: cbErrO } = await supabase.from('cashbook').insert([{
            trans_date: invForm.invoiceDate, type: 'Cash-Out',
            description: `Cash returned for ${invNo} (Overpayment)`, amount: cashReturn,
            tenant_id: userProfile.tenant_id, reference_id: newInv.id
          }]).select().single();
          if (cbErrO) console.error('Cash Return:', cbErrO.message);
          if (nCO) newCbEntries.push(nCO);
          showToast(`Overpayment: ${cashReturn.toFixed(2)} SAR returned in cash!`);
        }
        // 3. Credit balance used
        if (usedCredit > 0) {
          const { data: nCU, error: cbErrU } = await supabase.from('cashbook').insert([{
            trans_date: invForm.invoiceDate, type: 'Cash-Out',
            description: `Credit Balance used for ${invNo}`, amount: usedCredit,
            tenant_id: userProfile.tenant_id, reference_id: newInv.id
          }]).select().single();
          if (nCU) newCbEntries.push(nCU);
        }

        setData(prev => ({
          ...prev,
          invoices: [newInv, ...prev.invoices],
          portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: newBal } : p),
          cashbook: newCbEntries.length > 0 ? [...newCbEntries, ...prev.cashbook] : prev.cashbook
        }));
        showToast('Invoice Generated!');
      }

      // Reset form
      setInvForm({
        custType: 'Individual', custId: 'new', custName: '', custPhone: '',
        corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '',
        passengers: [''], employeeId: '', portalId: data.portals[0]?.id || '',
        bookingDate: today, invoiceDate: today, bookingType: 'New Booking',
        linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '',
        oldSellPrice: 0, oldBookingDate: '', oldPassengers: '', oldFlightType: '',
        oldPaymentMethod: '', refundReason: '', service: 'Flight Ticket',
        flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable',
        flightSector: '', airline: '', destination: '', hotelName: '',
        checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '',
        pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0,
        taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '',
        tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed',
        useCredit: 0, creditCustId: '', status: 'Unpaid'
      });
      state.setPage('list');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== DELETE INVOICE =====================
  const handleDeleteInvoice = async (inv) => {
    if (!confirm('Delete permanently? All entries will be reversed.')) return;
    try {
      if (inv.invoice_no?.startsWith('REF-')) {
        // Reverse credit refund
        if (inv.payment_method === 'Credit' && inv.refund_customer > 0 && inv.customer_id) {
          const cust = data.customers.find(c => c.id === inv.customer_id);
          if (cust) {
            const nc = (cust.store_credit || 0) - (inv.refund_customer || 0);
            await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id);
          }
        }
        // Reverse portal refund
        if (inv.portal_id && inv.refund_company > 0) {
          const portal = data.portals.find(p => p.id === inv.portal_id);
          if (portal) {
            const nb = (portal.current_balance || 0) - (inv.refund_company || 0);
            await supabase.from('portals').update({ current_balance: nb }).eq('id', inv.portal_id);
          }
        }
        // Restore original invoice
        if (inv.linked_inv_id) {
          const { data: origInv } = await supabase.from('invoices').select('id,due_amount').eq('invoice_no', inv.linked_inv_id).single();
          if (origInv) await supabase.from('invoices').update({ status: origInv.due_amount > 0 ? 'Unpaid' : 'Paid' }).eq('id', origInv.id);
        }
        // Delete cashbook entries
        const cbs = data.cashbook.filter(c => c.reference_id === inv.id || c.description?.includes(inv.invoice_no));
        for (const cb of cbs) await supabase.from('cashbook').delete().eq('id', cb.id);
        await supabase.from('invoices').delete().eq('id', inv.id);
        setData(prev => ({
          ...prev,
          invoices: prev.invoices.filter(i => i.id !== inv.id),
          cashbook: prev.cashbook.filter(c => !cbs.find(x => x.id === c.id)),
          customers: prev.customers.map(c => c.id === inv.customer_id ? { ...c, store_credit: (c.store_credit || 0) - (inv.refund_customer || 0) } : c),
          portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: (p.current_balance || 0) - (inv.refund_company || 0) } : p)
        }));
        showToast('Refund Deleted & Original Restored!'); return;
      }
      // Normal invoice delete
      // Reverse credit usage
      if (inv.used_credit > 0 && inv.customer_id) {
        const cust = data.customers.find(c => c.id === inv.customer_id);
        if (cust) {
          const nc = (cust.store_credit || 0) + (inv.used_credit || 0);
          await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id);
        }
      }
      // Restore portal balance
      const portal = data.portals.find(p => p.id === inv.portal_id);
      if (portal) {
        const nb = (portal.current_balance || 0) + (inv.total_cost || 0);
        await supabase.from('portals').update({ current_balance: nb }).eq('id', portal.id);
      }
      // Delete cashbook entries
      const cbs = data.cashbook.filter(c =>
        c.reference_id === inv.id ||
        c.description?.includes('Payment for ' + inv.invoice_no) ||
        c.description?.includes('Cash returned to customer for ' + inv.invoice_no) ||
        c.description?.includes('Credit Balance used for ' + inv.invoice_no)
      );
      for (const cb of cbs) await supabase.from('cashbook').delete().eq('id', cb.id);
      await supabase.from('invoices').delete().eq('id', inv.id);
      setData(prev => ({
        ...prev,
        invoices: prev.invoices.filter(i => i.id !== inv.id),
        portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: nb } : p),
        cashbook: prev.cashbook.filter(c => !cbs.find(x => x.id === c.id)),
        customers: prev.customers.map(c => c.id === inv.customer_id ? { ...c, store_credit: nc } : c)
      }));
      showToast('Invoice Deleted & Balances Reversed!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== GENERIC DELETE =====================
  const handleDelete = async (table, id) => {
    if (!confirm('Are you sure you want to delete?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      setData(prev => ({ ...prev, [table]: Array.isArray(prev[table]) ? prev[table].filter(i => i.id !== id) : [] }));
      showToast('Deleted!');
      await logAction(`Deleted from ${table}`);
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== CRUD: CUSTOMERS =====================
  const handleEditCust = (c) => { setEditCustId(c.id); setCustForm({ name: c.name, phone: c.phone || '', store_credit: c.store_credit || 0 }); };
  const handleAddEditCust = async (e) => {
    e.preventDefault();
    const pl = { name: custForm.name, phone: custForm.phone, store_credit: parseFloat(custForm.store_credit) || 0, tenant_id: userProfile.tenant_id };
    try {
      if (editCustId) {
        const { data: up, error } = await supabase.from('customers').update(pl).eq('id', editCustId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === editCustId ? up : c) }));
        showToast('Updated!'); setEditCustId(null);
      } else {
        const exists = data.customers.find(c => c.name.toLowerCase() === pl.name.toLowerCase() && c.phone === pl.phone);
        if (exists) throw new Error('Customer already exists!');
        const { data: nItem, error } = await supabase.from('customers').insert([{ ...pl, type: 'Individual' }]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, customers: [...prev.customers, nItem] }));
        showToast('Added!');
      }
      setCustForm({ name: '', phone: '', store_credit: 0 });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== CRUD: CORPORATES =====================
  const handleEditCorp = (c) => { setEditCorpId(c.id); setCorpForm({ name: c.name, vat_no: c.vat_no || '', phone: c.phone || '', address: c.address || '' }); };
  const handleAddEditCorp = async (e) => {
    e.preventDefault();
    const pl = { ...corpForm, tenant_id: userProfile.tenant_id };
    try {
      if (editCorpId) {
        const { data: up, error } = await supabase.from('corporates').update(pl).eq('id', editCorpId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, corporates: prev.corporates.map(c => c.id === editCorpId ? up : c) }));
        showToast('Updated!'); setEditCorpId(null);
      } else {
        const { data: nItem, error } = await supabase.from('corporates').insert([pl]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, corporates: [...prev.corporates, nItem] }));
        showToast('Added!');
      }
      setCorpForm({ name: '', vat_no: '', phone: '', address: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== CRUD: CREDITORS =====================
  const handleEditCred = (c) => { setEditCredId(c.id); setCreditorForm({ name: c.name, phone: c.phone || '', address: c.address || '' }); };
  const handleAddEditCred = async (e) => {
    e.preventDefault();
    const pl = { ...creditorForm, tenant_id: userProfile.tenant_id };
    try {
      if (editCredId) {
        const { data: up, error } = await supabase.from('creditors').update(pl).eq('id', editCredId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, creditors: prev.creditors.map(c => c.id === editCredId ? up : c) }));
        showToast('Updated!'); setEditCredId(null);
      } else {
        const { data: nItem, error } = await supabase.from('creditors').insert([pl]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, creditors: [...prev.creditors, nItem] }));
        showToast('Added!');
      }
      setCreditorForm({ name: '', phone: '', address: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== CRUD: VENDORS =====================
  const handleEditVend = (c) => { setEditVendId(c.id); setVendorForm({ name: c.name, phone: c.phone || '', balance: c.balance || 0 }); };
  const handleAddEditVend = async (e) => {
    e.preventDefault();
    const pl = { name: vendorForm.name, phone: vendorForm.phone, balance: parseFloat(vendorForm.balance) || 0, tenant_id: userProfile.tenant_id };
    try {
      if (editVendId) {
        const { data: up, error } = await supabase.from('vendors').update(pl).eq('id', editVendId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, vendors: prev.vendors.map(c => c.id === editVendId ? up : c) }));
        showToast('Updated!'); setEditVendId(null);
      } else {
        const { data: nItem, error } = await supabase.from('vendors').insert([pl]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, vendors: [...prev.vendors, nItem] }));
        showToast('Added!');
      }
      setVendorForm({ name: '', phone: '', balance: 0 });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== CRUD: PACKAGES =====================
  const handleEditPkg = (c) => { setEditPkgId(c.id); setPkgForm({ name: c.name, price: c.price, desc: c.description || '', duration: c.duration || '', inclusions: c.inclusions || '' }); };
  const handleAddEditPkg = async (e) => {
    e.preventDefault();
    const pl = { name: pkgForm.name, price: parseFloat(pkgForm.price) || 0, description: pkgForm.desc, duration: pkgForm.duration, inclusions: pkgForm.inclusions, tenant_id: userProfile.tenant_id };
    try {
      if (editPkgId) {
        const { data: up, error } = await supabase.from('packages').update(pl).eq('id', editPkgId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, packages: prev.packages.map(c => c.id === editPkgId ? up : c) }));
        showToast('Updated!'); setEditPkgId(null);
      } else {
        const { data: nItem, error } = await supabase.from('packages').insert([pl]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, packages: [...prev.packages, nItem] }));
        showToast('Added!');
      }
      setPkgForm({ name: '', price: '', desc: '', duration: '', inclusions: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== CRUD: BRANCHES =====================
  const handleEditBrn = (c) => { setEditBrnId(c.id); setBrnForm({ name: c.name, location: c.location || '', phone: c.phone || '', manager: c.manager || '', email: c.email || '', timing: c.timing || '', status: c.status || 'Active' }); };
  const handleAddEditBrn = async (e) => {
    e.preventDefault();
    const pl = { ...brnForm, tenant_id: userProfile.tenant_id };
    try {
      if (editBrnId) {
        const { data: up, error } = await supabase.from('branches').update(pl).eq('id', editBrnId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, branches: prev.branches.map(c => c.id === editBrnId ? up : c) }));
        showToast('Updated!'); setEditBrnId(null);
      } else {
        const { data: nItem, error } = await supabase.from('branches').insert([pl]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, branches: [...prev.branches, nItem] }));
        showToast('Added!');
      }
      setBrnForm({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== CRUD: EMPLOYEES =====================
  const handleEditEmp = (c) => { setEditEmpId(c.id); setEmpForm({ name: c.name, role: c.role, salary: c.salary || 0, phone: c.phone || '', commission_rate: c.commission_rate || 0, iqama_no: c.iqama_no || '', iqama_expiry: c.iqama_expiry || '' }); };
  const handleAddEditEmp = async (e) => {
    e.preventDefault();
    const pl = { ...empForm, salary: parseFloat(empForm.salary) || 0, commission_rate: parseFloat(empForm.commission_rate) || 0, tenant_id: userProfile.tenant_id };
    try {
      if (editEmpId) {
        const { data: up, error } = await supabase.from('employees').update(pl).eq('id', editEmpId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, employees: prev.employees.map(c => c.id === editEmpId ? up : c) }));
        showToast('Updated!'); setEditEmpId(null);
      } else {
        const { data: nItem, error } = await supabase.from('employees').insert([pl]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, employees: [...prev.employees, nItem] }));
        showToast('Added!');
      }
      setEmpForm({ name: '', role: 'Sales', salary: 0, phone: '', commission_rate: 0, iqama_no: '', iqama_expiry: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== CRUD: SERVICES =====================
  const handleEditSrv = (c) => { setEditSrvId(c.id); setSrvForm({ name: c.name }); };
  const handleAddEditSrv = async (e) => {
    e.preventDefault();
    const pl = { name: srvForm.name, tenant_id: userProfile.tenant_id };
    try {
      if (editSrvId) {
        const { data: up, error } = await supabase.from('services').update(pl).eq('id', editSrvId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, services: prev.services.map(s => s.id === editSrvId ? up : s) }));
        showToast('Updated!'); setEditSrvId(null);
      } else {
        const { data: nItem, error } = await supabase.from('services').insert([pl]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, services: [...prev.services, nItem] }));
        showToast('Added!');
      }
      setSrvForm({ name: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== EXPENSES (Connected System) =====================
  const handleAddExpItem = () => setExpForm(prev => ({ ...prev, items: [...prev.items, { name: '', qty: 1, price: 0 }] }));
  const handleRemoveExpItem = (i) => setExpForm(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));
  const handleExpItemChange = (i, field, val) => {
    setExpForm(prev => { const items = [...prev.items]; items[i] = { ...items[i], [field]: val }; return { ...prev, items }; });
  };

  const handleEditExpense = (exp) => {
    setEditExpId(exp.id);
    setExpForm({
      vendor_name: exp.vendor_name, vendor_vat: exp.vendor_vat || '', expense_date: exp.expense_date,
      expense_type: exp.expense_type, payment_mode: exp.payment_mode,
      items: exp.items?.length > 0 ? exp.items : [{ name: exp.item_name || 'Item', qty: 1, price: exp.amount || 0 }],
      taxRate: exp.vat > 0 ? '15' : '0', desc: exp.description || ''
    });
  };

  const handleDeleteExpense = async (exp) => {
    if (!confirm('Delete this expense?')) return;
    try {
      // Reverse cashbook if admin approved
      const cbs = data.cashbook.filter(c => c.reference_id === exp.id || c.description?.includes(exp.invoice_no));
      for (const cb of cbs) await supabase.from('cashbook').delete().eq('id', cb.id);
      await supabase.from('expenses').delete().eq('id', exp.id);
      setData(prev => ({
        ...prev,
        expenses: prev.expenses.filter(ex => ex.id !== exp.id),
        cashbook: prev.cashbook.filter(c => !cbs.find(x => x.id === c.id))
      }));
      showToast('Expense Deleted!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handlePreviewExpense = (exp) => {
    setPreviewHTML(getExpenseHTML(exp, data.settings, lang));
    setModal({ type: 'preview', data: exp });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const subTotal = expForm.items.reduce((s, it) => s + ((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)), 0);
      const vat = subTotal * ((parseFloat(expForm.taxRate) || 0) / 100);
      const total = subTotal + vat;

      if (editExpId) {
        // Reverse old cashbook entries
        const oldExp = data.expenses.find(ex => ex.id === editExpId);
        const oldCbs = data.cashbook.filter(c => c.reference_id === editExpId || c.description?.includes(oldExp?.invoice_no));
        for (const cb of oldCbs) await supabase.from('cashbook').delete().eq('id', cb.id);
        // Update expense
        const { data: upExp, error: expErr } = await supabase.from('expenses').update({
          vendor_name: expForm.vendor_name, vendor_vat: expForm.vendor_vat,
          expense_date: expForm.expense_date, expense_type: expForm.expense_type,
          item_name: expForm.items.map(i => i.name).join(', '), items: expForm.items,
          amount: total, description: expForm.desc, payment_mode: expForm.payment_mode
        }).eq('id', editExpId).select().single();
        if (expErr) throw expErr;
        // New cashbook entry
        const cbType = expForm.payment_mode === 'Cash' ? 'Cash-Out' : (expForm.payment_mode === 'Bank Transfer' || expForm.payment_mode === 'Card / Network' ? 'Bank-Out' : 'Investor-Out');
        const { data: nC } = await supabase.from('cashbook').insert([{
          trans_date: expForm.expense_date || today, type: cbType,
          description: `Expense: ${expForm.vendor_name} (${oldExp?.invoice_no || 'N/A'})`,
          amount: total, tenant_id: userProfile.tenant_id, reference_id: editExpId
        }]).select().single();
        setData(prev => ({
          ...prev,
          expenses: prev.expenses.map(ex => ex.id === editExpId ? upExp : ex),
          cashbook: nC ? [nC, ...prev.cashbook.filter(c => !oldCbs.find(x => x.id === c.id))] : prev.cashbook
        }));
        showToast('Expense Updated!'); setEditExpId(null);
      } else {
        const expNo = `EXP-${Date.now()}`;
        const { data: newExp, error: expErr } = await supabase.from('expenses').insert([{
          invoice_no: expNo, vendor_name: expForm.vendor_name, vendor_vat: expForm.vendor_vat,
          expense_date: expForm.expense_date, expense_type: expForm.expense_type,
          item_name: expForm.items.map(i => i.name).join(', '), items: expForm.items,
          amount: total, description: expForm.desc, payment_mode: expForm.payment_mode,
          approval_status: userProfile.is_admin ? 'Approved' : 'Pending',
          tenant_id: userProfile.tenant_id
        }]).select().single();
        if (expErr) throw expErr;
        // Only create cashbook if admin
        if (userProfile.is_admin) {
          const cbType = expForm.payment_mode === 'Cash' ? 'Cash-Out' : (expForm.payment_mode === 'Bank Transfer' || expForm.payment_mode === 'Card / Network' ? 'Bank-Out' : 'Investor-Out');
          const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{
            trans_date: expForm.expense_date || today, type: cbType,
            description: `Expense: ${expForm.vendor_name} (${expNo})`, amount: total,
            tenant_id: userProfile.tenant_id, reference_id: newExp.id
          }]).select().single();
          if (cbErr) throw cbErr;
          setData(prev => ({ ...prev, expenses: [newExp, ...prev.expenses], cashbook: nC ? [nC, ...prev.cashbook] : prev.cashbook }));
        } else {
          setData(prev => ({ ...prev, expenses: [newExp, ...prev.expenses] }));
        }
        showToast(userProfile.is_admin ? 'Expense Added!' : 'Expense Submitted for Approval!');
      }
      setExpForm({ vendor_name: '', vendor_vat: '', expense_date: today, expense_type: 'Office Supplies', payment_mode: 'Cash', items: [{ name: '', qty: 1, price: 0 }], taxRate: '15', desc: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== PORTAL =====================
  const handleAddPortal = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('portals').insert([{
        name: portalForm.name, current_balance: parseFloat(portalForm.balance) || 0,
        tenant_id: userProfile.tenant_id
      }]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, portals: [...prev.portals, data] }));
      showToast('Portal Added!');
      setPortalForm({ name: '', balance: 0 });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    const fd = e.target;
    try {
      const portalId = fd.portal.value;
      const amount = parseFloat(fd.amt.value) || 0;
      const date = fd.date.value || today;
      const desc = fd.desc.value || '';
      const mode = fd.mode.value;
      const portal = data.portals.find(p => p.id === portalId);
      if (!portal) throw new Error('Select a portal');
      const newBal = (portal.current_balance || 0) + amount;
      const { data: upP, error } = await supabase.from('portals').update({ current_balance: newBal }).eq('id', portalId).select().single();
      if (error) throw error;
      const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
      const { data: nC } = await supabase.from('cashbook').insert([{
        trans_date: date, type: cbType,
        description: desc || `Recharge: ${portal.name}`, amount,
        tenant_id: userProfile.tenant_id
      }]).select().single();
      setData(prev => ({
        ...prev,
        portals: prev.portals.map(p => p.id === portalId ? upP : p),
        cashbook: nC ? [nC, ...prev.cashbook] : prev.cashbook
      }));
      showToast(`Recharged ${amount.toFixed(2)} SAR to ${portal.name}`);
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== INVESTMENTS =====================
  const handleAddInvestment = async (e) => {
    e.preventDefault();
    try {
      const reason = investForm.reason === 'Other' ? investForm.otherReason : investForm.reason;
      const cbType = investForm.mode === 'Cash' ? 'Cash-In' : 'Bank-In';
      const { data: nInv, error } = await supabase.from('investments').insert([{
        investor_name: investForm.name, amount: parseFloat(investForm.amount) || 0,
        invest_date: investForm.date || today, reason,
        description: investForm.desc, tenant_id: userProfile.tenant_id
      }]).select().single();
      if (error) throw error;
      const { data: nC } = await supabase.from('cashbook').insert([{
        trans_date: investForm.date || today, type: cbType,
        description: `Investment from ${investForm.name} (${reason})`,
        amount: parseFloat(investForm.amount) || 0,
        tenant_id: userProfile.tenant_id
      }]).select().single();
      setData(prev => ({
        ...prev,
        investments: [nInv, ...prev.investments],
        cashbook: nC ? [nC, ...prev.cashbook] : prev.cashbook
      }));
      showToast('Investment Added!');
      setInvestForm({ name: '', amount: '', date: today, mode: 'Cash', reason: 'Other', otherReason: '', desc: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== FUND TRANSFER =====================
  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const { from, to, amount, date } = transferForm;
      const amt = parseFloat(amount) || 0;
      if (amt <= 0) throw new Error('Enter a valid amount');
      if (from === to) throw new Error('From and To cannot be same');
      const fromType = from === 'Cash' ? 'Cash-Out' : from === 'Bank' ? 'Bank-Out' : 'Investor-Out';
      const toType = to === 'Cash' ? 'Cash-In' : to === 'Bank' ? 'Bank-In' : 'Investor-In';
      const { data: outC } = await supabase.from('cashbook').insert([{
        trans_date: date || today, type: fromType,
        description: `Transfer from ${from} to ${to}`, amount: amt, tenant_id: userProfile.tenant_id
      }]).select().single();
      const { data: inC } = await supabase.from('cashbook').insert([{
        trans_date: date || today, type: toType,
        description: `Transfer from ${from} to ${to}`, amount: amt, tenant_id: userProfile.tenant_id
      }]).select().single();
      setData(prev => ({ ...prev, cashbook: [outC, inC, ...prev.cashbook] }));
      showToast(`Transferred ${amt.toFixed(2)} SAR: ${from} → ${to}`);
      setTransferForm({ from: 'Cash', to: 'Bank', amount: '', date: today });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== SALARY (Smart - Auto Calculates Commission, OT, Mistakes) =====================
  const handlePaySalary = async (e) => {
    e.preventDefault();
    try {
      const fd = e.target;
      const empId = fd.emp?.value || payForm.empId;
      const base = parseFloat(fd.base?.value || payForm.base) || 0;
      const commPct = parseFloat(fd.comm?.value || payForm.comm) || 0;
      const advDed = parseFloat(fd.adv_ded?.value || payForm.adv_ded) || 0;
      const gift = parseFloat(fd.gift?.value || payForm.gift) || 0;
      const month = fd.month?.value || payForm.month;
      const mode = fd.mode?.value || payForm.mode;

      const emp = data.employees.find(em => em.id === empId);
      if (!emp) return showToast('Select an employee!');

      // SMART: Auto-calculate commission from actual sales
      const empInvoices = data.invoices.filter(i => i.employee_id === empId && !i.invoice_no?.startsWith('REF-') && i.status !== 'Draft');
      const empSales = empInvoices.reduce((s, i) => s + (i.profit || 0), 0);
      const commissionAmt = commPct > 0 ? (empSales * commPct / 100) : 0;

      // SMART: Auto-calculate overtime from attendance records
      const empAtt = data.attendance.filter(a => a.employee_id === empId && a.date?.startsWith(month));
      const totalOT = empAtt.reduce((s, a) => s + (a.overtime || 0), 0);
      const hourlyRate = base / 30 / 8;
      const overtimeAmt = totalOT * hourlyRate;

      // SMART: Auto-calculate mistakes deduction from staff_mistakes table
      const empMistakes = data.staffMististakes.filter(m => m.employee_id === empId && m.paid_by_employee);
      const mistakesDed = empMistakes.reduce((s, m) => s + (m.loss_amount || 0), 0);

      const gross = base + commissionAmt + overtimeAmt + gift;
      const totalDed = advDed + mistakesDed;
      const netPay = gross - totalDed;

      // Create payroll record
      const { data: newPay, error } = await supabase from('payroll').insert([{
        employee_id: empId, month, base_salary: base, commission: commissionAmt,
        overtime: overtimeAmt, gift, advance_deduction: advDed,
        mistakes_deduction: mistakesDed, amount: netPay, payment_mode: mode,
        tenant_id: userProfile.tenant_id
      }]).select('*, employees(name,role)').single();
      if (error) throw error;

      // SMART: Auto-mark advances as Returned when salary is paid
      if (advDed > 0) {
        const pendingAdvs = data.empAdvances.filter(a => a.employee_id === empId && a.status === 'Pending');
        let remaining = advDed;
        for (const adv of pendingAdvs) {
          if (remaining <= 0) break;
          const dedAmt = Math.min(adv.amount, remaining);
          await supabase.from('emp_advances').update({ status: 'Returned', amount_deducted: dedAmt }).eq('id', adv.id);
          remaining -= dedAmt;
        }
      }

      // Cashbook entry
      const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
      const { data: nC } = await supabase.from('cashbook').insert([{
        trans_date: today, type: cbType,
        description: `Salary paid to ${emp.name} for ${month} (Base:${base} + Comm:${commissionAmt.toFixed(2)} + OT:${overtimeAmt.toFixed(2)}${mistakesDed > 0 ? ` - Mistakes:${mistakesDed.toFixed(2)}` : ''})`,
        amount: netPay, tenant_id: userProfile.tenant_id, reference_id: newPay.id
      }]).select().single();

      setData(prev => ({
        ...prev,
        payroll: [newPay, ...prev.payroll],
        cashbook: nC ? [nC, ...prev.cashbook] : prev.cashbook,
        empAdvances: prev.empAdvances.map(a => a.employee_id === empId ? { ...a, status: remaining <= 0 ? 'Returned' : a.status } : a)
      }));

      await logAction(`Salary ${netPay.toFixed(2)} SAR to ${emp.name} for ${month}`);
      showToast(`Salary ${netPay.toFixed(2)} SAR → ${emp.name}!`);
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== ADVANCES =====================
  const handleAddAdvance = async (e) => {
    e.preventDefault();
    const fd = e.target;
    try {
      const { data: nAdv, error } = await supabase.from('emp_advances').insert([{
        employee_id: fd.emp.value, amount: parseFloat(fd.amt.value) || 0,
        date: fd.date.value || today, status: 'Pending', tenant_id: userProfile.tenant_id
      }]).select('*, employees(name)').single();
      if (error) throw error;
      setData(prev => ({ ...prev, empAdvances: [nAdv, ...prev.empAdvances] }));
      showToast('Advance Given!');
      fd.reset();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleReturnAdvance = async (adv) => {
    try {
      const { error } = await supabase.from('emp_advances').update({ status: 'Returned' }).eq('id', adv.id);
      if (error) throw error;
      setData(prev => ({ ...prev, empAdvances: prev.empAdvances.map(a => a.id === adv.id ? { ...a, status: 'Returned' } : a) }));
      showToast('Advance Marked as Returned!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== USER MANAGEMENT =====================
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('app_users').insert([{
        email: userForm.email, username: userForm.username, role: userForm.role,
        is_admin: userForm.is_admin, can_access_invoices: userForm.can_access_invoices,
        can_access_bank: userForm.can_access_bank, can_access_hr: userForm.can_access_hr,
        can_access_reports: userForm.can_access_reports, can_access_settings: userForm.can_access_settings,
        tenant_id: userProfile.tenant_id
      }]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, appUsers: [data, ...prev.appUsers] }));
      showToast('User Added! Tell them to set password via login.');
      setUserForm({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: true, can_access_hr: true, can_access_reports: true, can_access_settings: false });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleEditUser = (u) => {
    setEditUserId(u.id);
    setUserForm({
      email: u.email, username: u.username, role: u.role, is_admin: u.is_admin,
      can_access_invoices: u.can_access_invoices, can_access_bank: u.can_access_bank,
      can_access_hr: u.can_access_hr, can_access_reports: u.can_access_reports,
      can_access_settings: u.can_access_settings
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('app_users').update(userForm).eq('id', editUserId).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, appUsers: prev.appUsers.map(u => u.id === editUserId ? data : u) }));
      showToast('User Updated!');
      setEditUserId(null);
      setUserForm({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: true, can_access_hr: true, can_access_reports: true, can_access_settings: false });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  return {
    // Auth
    handleLogout, handleChangePassword,
    // Chat
    handleSendMessage,
    // Custom fields
    handleAddCustomField, handleRemoveCustomField, handleCustomFieldChange,
    // Profile
    handleProfilePicUpload, handleSaveProfile,
    // Settings
    handleLogoUpload, handleSaveSettings,
    // Tenant
    handleAddTenant, handleToggleSubscription, handleDeleteTenant,
    // PDF & Print
    downloadPDF, handleDownloadPDF, printInvoice,
    // Share
    shareWhatsApp, shareEmail,
    // Contract/Offer
    handleGenerateContract, handleGenerateOffer,
    // Preview & Modals
    openPreview, openRefundModal, openSettleModal, handleQuickSettle,
    // Settle & Refund
    handleSettlePayment, handleRefund,
    // Mistakes
    handleAddMistake, handlePreviewMistake, handleDeleteMistake,
    // Salary Slip
    handleGenerateSlip, handleDeletePayroll,
    // Invoices
    handleEditInvoice, handleCreateInvoice, handleDeleteInvoice,
    // Generic delete
    handleDelete,
    // CRUD
    handleAddEditCust, handleEditCust, handleAddEditCorp, handleEditCorp, handleAddEditCred, handleEditCred,
    handleAddEditVend, handleEditVend, handleAddEditPkg, handleEditPkg, handleAddEditBrn, handleEditBrn,
    handleAddEditEmp, handleEditEmp, handleAddEditSrv, handleEditSrv,
    // Expenses
    handleAddExpItem, handleRemoveExpItem, handleExpItemChange, handleEditExpense, handleDeleteExpense, handlePreviewExpense, handleAddExpense,
    // Finance
    handleAddPortal, handleRecharge, handleAddInvestment, handleTransfer,
    // HR
    handlePaySalary, handleAddAdvance, handleReturnAdvance,
    // Users
    handleAddUser, handleEditUser, handleUpdateUser
  };
}
