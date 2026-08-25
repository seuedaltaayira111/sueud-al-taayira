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
    payForm, setPayForm, advForm, setAdvForm, setPage
  } = state;

  // ═══════════════════════════════════════════════════════════════
  // EXPORT TO EXCEL (CSV)
  // ═══════════════════════════════════════════════════════════════
  const exportToExcel = (dataArr, filename) => {
    if (!dataArr || dataArr.length === 0) {
      showToast('No data to export');
      return;
    }
    try {
      const headers = Object.keys(dataArr[0]);
      const csvRows = [
        headers.join(','),
        ...dataArr.map(row => headers.map(h => {
          const val = row[h] ?? '';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        }).join(','))
      ];
      const csv = '\uFEFF' + csvRows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${dataArr.length} rows!`);
    } catch (err) {
      showToast('Export error: ' + err.message);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════════
  const handleLogout = () => {
    supabase.auth.signOut();
    router.push('/login');
  };

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

  // ═══════════════════════════════════════════════════════════════
  // CHAT
  // ═══════════════════════════════════════════════════════════════
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    const input = chatInput.toLowerCase();
    setChatInput('');
    setTimeout(() => {
      let reply = lang === 'ar' ? 'يمكنني المساعدة في الفواتير والعملاء. جرب "مساعدة".' : "I can help with Invoices, Customers, Reports. Try \"help\".";
      const totalInv = data.invoices?.length || 0;
      const totalRev = data.invoices?.reduce((s, i) => s + (i.total || 0), 0) || 0;
      const unpaidCount = data.invoices?.filter(i => i.status === 'Unpaid').length || 0;
      const totalCustomers = data.customers?.length || 0;
      const totalExpenses = data.expenses?.reduce((s, e) => s + (e.amount || e.total_amount || 0), 0) || 0;
      if (input.includes('invoice') || input.includes('فاتورة')) {
        reply = lang === 'ar' ? `📄 لديك ${totalInv} فاتورة بإجمالي ${totalRev.toFixed(2)} ريال. ${unpaidCount} غير مدفوعة.` : `📄 You have ${totalInv} invoices totaling ${totalRev.toFixed(2)} SAR. ${unpaidCount} unpaid.`;
      } else if (input.includes('customer') || input.includes('عميل')) {
        reply = lang === 'ar' ? `👤 لديك ${totalCustomers} عميل مسجل.` : `👤 You have ${totalCustomers} registered customers.`;
      } else if (input.includes('refund') || input.includes('استرجاع')) {
        const rc = data.invoices?.filter(i => i.invoice_no?.startsWith('REF-')).length || 0;
        reply = lang === 'ar' ? `🔄 لديك ${rc} عملية استرجاع.` : `🔄 You have ${rc} refunds.`;
      } else if (input.includes('report') || input.includes('تقرير')) {
        reply = lang === 'ar' ? `📊 إيرادات: ${totalRev.toFixed(2)} | مصروفات: ${totalExpenses.toFixed(2)} | صافي: ${(totalRev - totalExpenses).toFixed(2)}` : `📊 Revenue: ${totalRev.toFixed(2)} | Expenses: ${totalExpenses.toFixed(2)} | Net: ${(totalRev - totalExpenses).toFixed(2)}`;
      } else if (input.includes('profit') || input.includes('ربح')) {
        const tp = data.invoices?.reduce((s, i) => s + (i.profit || 0), 0) || 0;
        reply = lang === 'ar' ? `💰 إجمالي الربح: ${tp.toFixed(2)} ريال` : `💰 Total profit: ${tp.toFixed(2)} SAR`;
      } else if (input.includes('expense') || input.includes('مصروف')) {
        reply = lang === 'ar' ? `💸 إجمالي المصروفات: ${totalExpenses.toFixed(2)} ريال` : `💸 Total expenses: ${totalExpenses.toFixed(2)} SAR`;
      } else if (input.includes('salary') || input.includes('راتب')) {
        reply = lang === 'ar' ? `💰 لديك ${data.employees?.length || 0} موظف. اذهب إلى الرواتب.` : `💰 You have ${data.employees?.length || 0} employees. Go to HR & Payroll.`;
      } else if (input.includes('portal') || input.includes('بوابة')) {
        const tb = data.portals?.reduce((s, p) => s + (p.current_balance || 0), 0) || 0;
        reply = lang === 'ar' ? `🛫 ${data.portals?.length || 0} بوابة، رصيد: ${tb.toFixed(2)} ريال` : `🛫 ${data.portals?.length || 0} portals, balance: ${tb.toFixed(2)} SAR`;
      } else if (input.includes('unpaid') || input.includes('غير مدفوعة') || input.includes('due')) {
        const td = data.invoices?.filter(i => i.status === 'Unpaid').reduce((s, i) => s + (i.due_amount || 0), 0) || 0;
        reply = lang === 'ar' ? `⚠️ ${unpaidCount} فاتورة غير مدفوعة: ${td.toFixed(2)} ريال` : `⚠️ ${unpaidCount} unpaid invoices: ${td.toFixed(2)} SAR`;
      } else if (input.includes('summary') || input.includes('ملخص') || input.includes('status')) {
        reply = lang === 'ar' ? `📋 ${totalInv} فاتورة | ${totalCustomers} عميل | إيرادات ${totalRev.toFixed(2)} | مصروفات ${totalExpenses.toFixed(2)}` : `📋 ${totalInv} invoices | ${totalCustomers} customers | Revenue ${totalRev.toFixed(2)} | Expenses ${totalExpenses.toFixed(2)}`;
      } else if (input.includes('help') || input.includes('مساعدة')) {
        reply = lang === 'ar' ? '🤖 اسألني عن:\n• فواتير / invoices\n• عملاء / customers\n• استرجاع / refunds\n• تقارير / reports\n• ربح / profit\n• مصروفات / expenses\n• رواتب / salary\n• بوابات / portals\n• غير مدفوعة / unpaid\n• ملخص / summary' : '🤖 Ask me about:\n• invoices\n• customers\n• refunds\n• reports\n• profit\n• expenses\n• salary\n• portals\n• unpaid\n• summary';
      } else if (input.includes('hello') || input.includes('hi') || input.includes('مرحبا') || input.includes('السلام')) {
        reply = lang === 'ar' ? '👋 مرحباً! اكتب "مساعدة" لمعرفة ما يمكنني فعله.' : '👋 Hello! Type "help" to see what I can do.';
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 400);
  };

  // ═══════════════════════════════════════════════════════════════
  // CUSTOM FIELDS
  // ═══════════════════════════════════════════════════════════════
  const handleAddCustomField = () => setSetForm(prev => ({ ...prev, custom_fields: [...(prev.custom_fields || []), { key: '', value: '' }] }));
  const handleRemoveCustomField = (i) => setSetForm(prev => ({ ...prev, custom_fields: prev.custom_fields.filter((_, idx) => idx !== i) }));
  const handleCustomFieldChange = (i, type, val) => setSetForm(prev => { const cf = [...prev.custom_fields]; cf[i] = { ...cf[i], [type]: val }; return { ...prev, custom_fields: cf }; });

  // ═══════════════════════════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════════════════════════
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
      showToast('Profile Updated!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // LOGO & SETTINGS
  // ═══════════════════════════════════════════════════════════════
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
      showToast('Settings Saved!');
      fetchAll();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // TENANT
  // ═══════════════════════════════════════════════════════════════
  const handleAddTenant = async (e) => {
    e.preventDefault();
    try {
      const tempPass = Math.random().toString(36).slice(-8) + 'A1!';
      const res = await fetch('/api/create-tenant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tenantForm, temp_password: tempPass })
      });
      const resData = await res.json();
      if (resData.error) throw new Error(resData.error);
      showToast(`Agency Created! Email: ${tenantForm.owner_email} | Pass: ${tempPass}`);
      setTenantForm({ agency_name: '', owner_email: '', subscription_end_date: '', company_name_ar: '', vat_no: '', cr_no: '', phone: '', address_ar: '' });
      fetchAll();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleToggleSubscription = async (tenant) => {
    try {
      const { error } = await supabase.from('tenants').update({ is_paid: !tenant.is_paid }).eq('id', tenant.id);
      if (error) throw error;
      showToast('Subscription Updated!');
      fetchAll();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleDeleteTenant = async (id) => {
    if (!confirm('Delete this Agency permanently?')) return;
    try {
      await supabase.from('tenants').delete().eq('id', id);
      showToast('Agency Deleted!');
      fetchAll();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // PDF & PRINT
  // ═══════════════════════════════════════════════════════════════
  const downloadPDF = async (htmlContent, filename = 'document.pdf') => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const div = document.createElement('div');
      div.style.cssText = 'position:absolute;left:-9999px;top:0;width:800px';
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const imgs = doc.querySelectorAll('img[src*="api.qrserver.com"],img[src*="bwipjs"]');
      await Promise.all(Array.from(imgs).map(async (img) => {
        try {
          const resp = await fetch(img.src);
          const blob = await resp.blob();
          const b64 = await new Promise(r => { const fr = new FileReader(); fr.onloadend = () => r(fr.result); fr.readAsDataURL(blob); });
          img.src = b64;
        } catch (e) { console.warn("QR fetch skipped"); }
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
    w.document.write(html);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 500);
  };

  // ═══════════════════════════════════════════════════════════════
  // SHARE
  // ═══════════════════════════════════════════════════════════════
  const shareWhatsApp = (inv) => {
    if (inv.invoice_no?.startsWith('REF-')) return showToast('Refund invoices cannot be shared via WhatsApp!');
    handleShareWhatsApp(inv, data.settings);
  };
  const shareEmail = (inv) => {
    if (inv.invoice_no?.startsWith('REF-')) return showToast('Refund invoices cannot be shared via Email!');
    handleShareEmail(inv, data.settings);
  };

  // ═══════════════════════════════════════════════════════════════
  // CONTRACT / OFFER
  // ═══════════════════════════════════════════════════════════════
  const handleGenerateContract = (e) => {
    e.preventDefault();
    if (!contractCorpName) return showToast('Enter Corporate Name');
    setPreviewHTML(getContractHTML(data.settings, contractCorpName, today, false, contractType, contractMarkup, contractTerms));
    setModal({ type: 'preview', data: null });
  };
  const handleGenerateOffer = (e) => {
    e.preventDefault();
    if (!contractCorpName) return showToast('Enter Corporate Name');
    setPreviewHTML(getContractHTML(data.settings, contractCorpName, today, true, contractType, contractMarkup, contractTerms));
    setModal({ type: 'preview', data: null });
  };

  // ═══════════════════════════════════════════════════════════════
  // PREVIEW & MODAL OPENERS
  // ═══════════════════════════════════════════════════════════════
  const openPreview = (inv) => {
    const s = data.settings;
    let html = inv.invoice_no?.startsWith('REF-') ? getRefundHTML(inv, s, lang) : getInvoiceHTML(inv, s, lang);
    if (!inv.invoice_no?.startsWith('REF-') && inv.linked_inv_id && (inv.booking_type === 'Previous Booking' || inv.booking_type === 'Reissue')) {
      const linked = data.invoices.find(i => i.invoice_no === inv.linked_inv_id);
      if (linked) html += `<div style="margin-top:30px;border-top:2px dashed #cbd5e1;padding-top:20px"><h1 style="color:#7f1d1d;text-align:center;font-size:18px;margin-bottom:15px">Linked Refund</h1>${getRefundHTML(linked, s, lang)}</div>`;
    }
    setPreviewHTML(html);
    setModal({ type: 'preview', data: inv });
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

  // ═══════════════════════════════════════════════════════════════
  // SETTLE PAYMENT
  // ═══════════════════════════════════════════════════════════════
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
        trans_date: settleForm.date, type: cbType, description: `Settlement for ${inv.invoice_no}`,
        amount: settleAmt, tenant_id: userProfile.tenant_id, reference_id: inv.id
      }]).select().single();
      setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i), cashbook: nC ? [nC, ...prev.cashbook] : prev.cashbook }));
      await logAction(`Settled ${settleAmt.toFixed(2)} SAR for ${inv.invoice_no}`);
      showToast('Payment Settled!');
      setModal({ type: null, data: null });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // REFUND
  // ═══════════════════════════════════════════════════════════════
  const handleRefund = async (e) => {
    e.preventDefault();
    try {
      const origInv = modal.data;
      if (!origInv) throw new Error('Original invoice not found');
      const compRef = parseFloat(refundForm.compRefund) || 0;
      const custRef = parseFloat(refundForm.custRefund) || 0;
      const refundNo = `REF-${Date.now()}`;
      if (refundForm.mode === 'Credit' && custRef > 0 && origInv.customer_id) {
        const cust = data.customers.find(c => c.id === origInv.customer_id);
        if (cust) {
          const nc = (cust.store_credit || 0) + custRef;
          await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id);
          setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: nc } : c) }));
        }
      }
      if (compRef > 0 && refundForm.portalId) {
        const portal = data.portals.find(p => p.id === refundForm.portalId);
        if (portal) {
          const nb = (portal.current_balance || 0) + compRef;
          await supabase.from('portals').update({ current_balance: nb }).eq('id', portal.id);
          setData(prev => ({ ...prev, portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: nb } : p) }));
        }
      }
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
      let newCb = null;
      if (custRef > 0 && refundForm.mode !== 'Credit') {
        const cbType = refundForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
        const { data: nC } = await supabase.from('cashbook').insert([{
          trans_date: refundForm.date, type: cbType, description: `Refund to customer for ${refundNo}`,
          amount: custRef, tenant_id: userProfile.tenant_id, reference_id: newRef.id
        }]).select().single();
        newCb = nC;
      }
      await supabase.from('invoices').update({ status: 'refunded' }).eq('id', origInv.id);
      setData(prev => ({ ...prev, invoices: [newRef, ...prev.invoices.map(i => i.id === origInv.id ? { ...i, status: 'refunded' } : i)], cashbook: newCb ? [newCb, ...prev.cashbook] : prev.cashbook }));
      await logAction(`Refund ${refundNo} for ${origInv.invoice_no} (Comp:${compRef}, Cust:${custRef})`);
      showToast('Refund Processed!');
      setModal({ type: null, data: null });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // STAFF MISTAKES
  // ═══════════════════════════════════════════════════════════════
  const handleAddMistake = async (e) => {
    e.preventDefault();
    try {
      const fd = e.target;
      const { data: newM, error } = await supabase.from('staff_mistakes').insert([{
        employee_id: fd.emp.value, old_ticket_no: fd.old_tkt.value,
        new_ticket_no: fd.new_tkt.value, loss_amount: parseFloat(fd.loss_amt.value) || 0,
        paid_by_employee: fd.paid_by_emp?.checked || false, reason: fd.reason?.value || '',
        date: today, tenant_id: userProfile.tenant_id
      }]).select('*, employees(name)').single();
      if (error) throw error;
      setData(prev => ({ ...prev, staffMistakes: [newM, ...(prev.staffMistakes || [])] }));
      showToast('Mistake Logged!');
      fd.reset();
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

  // ═══════════════════════════════════════════════════════════════
  // SALARY SLIP
  // ═══════════════════════════════════════════════════════════════
  const handleGenerateSlip = (pay) => {
    setPreviewHTML(getSalarySlipHTML(pay, data.settings, lang));
    setModal({ type: 'preview', data: pay });
  };

  const handleDeletePayroll = async (pay) => {
    if (!confirm('Delete this salary slip permanently?')) return;
    try {
      const cbs = data.cashbook.filter(c => c.reference_id === pay.id);
      for (const cb of cbs) await supabase.from('cashbook').delete().eq('id', cb.id);
      await supabase.from('payroll').delete().eq('id', pay.id);
      setData(prev => ({ ...prev, payroll: prev.payroll.filter(p => p.id !== pay.id), cashbook: prev.cashbook.filter(c => !cbs.find(x => x.id === c.id)) }));
      showToast('Salary Slip Deleted!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // EDIT INVOICE
  // ═══════════════════════════════════════════════════════════════
  const handleEditInvoice = (inv) => {
    if (inv.invoice_no?.startsWith('REF-')) {
      const cust = data.customers.find(c => c.id === inv.customer_id);
      setRefundForm({ id: inv.id, date: inv.refund_date || inv.invoice_date || today, compRefund: inv.refund_company || 0, custRefund: inv.refund_customer || 0, mode: inv.payment_method || 'Cash', reason: inv.refund_reason || '', portalId: inv.portal_id, creditBalance: cust?.store_credit || 0 });
      setModal({ type: 'refund', data: inv });
      return;
    }
    setEditInvId(inv.id);
    const custObj = inv.customer_id ? data.customers.find(c => c.id === inv.customer_id) : null;
    const corpObj = inv.corporate_id ? data.corporates.find(c => c.id === inv.corporate_id) : null;
    setInvForm({
      custType: inv.customer_id ? 'Individual' : 'Corporate', custId: inv.customer_id || 'new', custName: custObj?.name || '', custPhone: custObj?.phone || '',
      corpId: inv.corporate_id || 'new', corpName: corpObj?.name || '', corpVat: corpObj?.vat_no || '', corpPhone: corpObj?.phone || '', corpAddress: corpObj?.address || '',
      portalId: inv.portal_id, service: inv.service_type, flightType: inv.flight_type || 'Domestic', flightJourney: inv.flight_journey || 'Single',
      refundable: inv.refundable_status || 'Refundable', bookingType: inv.booking_type || 'New Booking',
      linkedInvId: inv.linked_inv_id || '', oldTicketNo: inv.old_ticket_no || '', oldPnr: inv.old_pnr || '',
      oldAirline: inv.old_airline || '', oldSector: inv.old_sector || '', oldSellPrice: inv.old_sell_price || 0,
      oldBookingDate: inv.old_booking_date || '', oldPassengers: inv.old_passengers || '', oldFlightType: inv.old_flight_type || '',
      oldPaymentMethod: inv.old_payment_method || '', refundReason: inv.refund_reason || '',
      flightSector: inv.flight_sector || '', airline: inv.airline || '', pnr: inv.pnr || '', ticketNo: inv.ticket_no || '',
      qty: inv.qty || 1, cost: (inv.total_cost || 0) / (inv.qty || 1), sell: ((inv.total_sell || 0) + (inv.discount || 0)) / (inv.qty || 1),
      discount: inv.discount || 0, taxRate: inv.vat > 0 ? '15' : '0', payment: inv.payment_method,
      paid: (inv.paid_amount || 0) - (inv.used_credit || 0), useCredit: inv.used_credit || 0, invoiceDate: inv.invoice_date || today,
      employeeId: inv.employee_id || '', passengers: inv.passenger_names?.split('\n') || [''],
      status: inv.status || 'Unpaid', creditDueDate: inv.credit_due_date || '', creditorId: inv.creditor_id || '',
      tabbyNo: inv.tabby_order_no || '', tamaraNo: inv.tamara_order_no || '', ticketStatus: inv.ticket_status || 'Confirmed',
      bookingDate: inv.booking_date || today, destination: '', hotelName: '', checkIn: '', checkOut: '',
      visaType: 'Tourist', serviceName: '', creditCustId: ''
    });
    setPage('create');
  };

  // ═══════════════════════════════════════════════════════════════
  // CREATE INVOICE
  // ═══════════════════════════════════════════════════════════════
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
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
      let cashPaid = parseFloat(invForm.paid) || 0;
      let cashReturn = 0;
      let actualCashPaid = cashPaid;
      if (cashPaid > total && (invForm.payment === 'Card / Network' || invForm.payment === 'Bank Transfer')) {
        cashReturn = cashPaid - total;
        actualCashPaid = total;
      }
      const usedCredit = parseFloat(invForm.useCredit) || 0;
      const totalPaid = actualCashPaid + usedCredit;
      const invoiceDue = Math.max(0, total - totalPaid);
      const invoiceStatus = invoiceDue <= 0 ? 'Paid' : 'Unpaid';
      const profit = sell - cost;
      let cid = null, corpId = null;
      if (invForm.custType === 'Individual') {
        if (invForm.custId === 'new') {
          const { data: nC, error: cErr } = await supabase.from('customers').insert([{ name: invForm.custName, phone: invForm.custPhone, type: 'Individual', tenant_id: userProfile.tenant_id }]).select().single();
          if (cErr) throw new Error('Customer creation failed: ' + cErr.message);
          cid = nC.id;
        } else { cid = invForm.custId; }
      } else {
        if (invForm.corpId === 'new') {
          const { data: nCorp, error: corpErr } = await supabase.from('corporates').insert([{ name: invForm.corpName, vat_no: invForm.corpVat, phone: invForm.corpPhone, address: invForm.corpAddress, tenant_id: userProfile.tenant_id }]).select().single();
          if (corpErr) throw new Error('Corporate creation failed: ' + corpErr.message);
          corpId = nCorp.id;
        } else { corpId = invForm.corpId; }
      }
      if (invForm.payment === 'Credit Balance' && cid && usedCredit > 0) {
        const cust = data.customers.find(c => c.id === cid);
        if (cust) {
          const nc = (cust.store_credit || 0) - usedCredit;
          if (nc < 0) throw new Error('Insufficient credit balance!');
          await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id);
          setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: nc } : c) }));
        }
      }
      const portal = data.portals.find(p => p.id === invForm.portalId);
      if (!portal) throw new Error('Select a Portal');
      if ((portal.current_balance || 0) < cost) showToast(`⚠️ Low portal balance: ${(portal.current_balance || 0).toFixed(2)} SAR (Need: ${cost.toFixed(2)} SAR)`);
      const passengerNames = invForm.passengers.filter(p => p).join('\n');
      const payload = {
        customer_id: cid, corporate_id: corpId, portal_id: portal.id, employee_id: invForm.employeeId || null,
        booking_date: invForm.bookingDate, invoice_date: invForm.invoiceDate, service_type: invForm.service,
        flight_type: invForm.flightType, flight_journey: invForm.flightJourney, refundable: invForm.refundable,
        booking_type: invForm.bookingType, linked_inv_id: invForm.linkedInvId || null,
        old_ticket_no: invForm.oldTicketNo || null, old_pnr: invForm.oldPnr || null,
        old_airline: invForm.oldAirline || null, old_sector: invForm.oldSector || null,
        old_sell_price: parseFloat(invForm.oldSellPrice) || 0, old_booking_date: invForm.oldBookingDate || null,
        old_passengers: invForm.oldPassengers || null, old_flight_type: invForm.oldFlightType || null,
        old_payment_method: invForm.oldPaymentMethod || null, refund_reason: invForm.refundReason || null,
        pnr: invForm.pnr, ticket_no: invForm.ticketNo,
        sector: invForm.service === 'Flight Ticket' ? `${invForm.airline} - ${invForm.flightSector}` : invForm.service,
        qty, discount, passenger_names: passengerNames || null, airline: invForm.airline || null,
        flight_sector: invForm.flightSector || null, total_cost: cost, total_sell: sell, profit, vat, total,
        paid_amount: totalPaid, used_credit: usedCredit, due_amount: invoiceDue, cash_return: cashReturn,
        payment_method: invForm.payment,
        credit_due_date: invoiceDue > 0 && invForm.payment === 'Credit' ? invForm.creditDueDate : null,
        creditor_id: invForm.payment === 'Credit' ? (invForm.creditorId || null) : null,
        tabby_order_no: invForm.payment === 'Tabby' ? invForm.tabbyNo : null,
        tamara_order_no: invForm.payment === 'Tamara' ? invForm.tamaraNo : null,
        ticket_status: invForm.ticketStatus, status: invoiceStatus, tenant_id: userProfile.tenant_id
      };
      if (editInvId) {
        const { data: upInv, error: upErr } = await supabase.from('invoices').update(payload).eq('id', editInvId).select('*, customers(name,phone), corporates(name,vat_no,phone), employees(name,phone)').single();
        if (upErr) throw new Error('Update failed: ' + upErr.message);
        setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === editInvId ? upInv : i) }));
        showToast('Invoice Updated!');
        setEditInvId(null);
      } else {
        const invNo = `INV-${Date.now()}`;
        const { data: newInv, error: invErr } = await supabase.from('invoices').insert([{ invoice_no: invNo, ...payload }]).select('*, customers(name,phone), corporates(name,vat_no,phone), employees(name,phone)').single();
        if (invErr) throw new Error('Creation failed: ' + invErr.message);
        const newBal = (portal.current_balance || 0) - cost;
        await supabase.from('portals').update({ current_balance: newBal }).eq('id', portal.id);
        await logAction(`Created Invoice ${invNo} | Amount: ${total.toFixed(2)} SAR | Profit: ${profit.toFixed(2)} SAR`);
        let newCbEntries = [];
        if (cashPaid > 0 && invForm.payment !== 'Credit' && invForm.payment !== 'Credit Balance') {
          const cbType = invForm.payment === 'Cash' ? 'Cash-In' : 'Bank-In';
          const { data: nC } = await supabase.from('cashbook').insert([{ trans_date: invForm.invoiceDate, type: cbType, description: `Payment for ${invNo}`, amount: cashPaid, tenant_id: userProfile.tenant_id, reference_id: newInv.id }]).select().single();
          if (nC) newCbEntries.push(nC);
        }
        if (cashReturn > 0) {
          const { data: nCO } = await supabase.from('cashbook').insert([{ trans_date: invForm.invoiceDate, type: 'Cash-Out', description: `Cash returned for ${invNo}`, amount: cashReturn, tenant_id: userProfile.tenant_id, reference_id: newInv.id }]).select().single();
          if (nCO) newCbEntries.push(nCO);
          showToast(`Overpayment: ${cashReturn.toFixed(2)} SAR returned!`);
        }
        if (usedCredit > 0) {
          const { data: nCU } = await supabase.from('cashbook').insert([{ trans_date: invForm.invoiceDate, type: 'Cash-Out', description: `Credit used for ${invNo}`, amount: usedCredit, tenant_id: userProfile.tenant_id, reference_id: newInv.id }]).select().single();
          if (nCU) newCbEntries.push(nCU);
        }
        setData(prev => ({ ...prev, invoices: [newInv, ...prev.invoices], portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: newBal } : p), cashbook: newCbEntries.length > 0 ? [...newCbEntries, ...prev.cashbook] : prev.cashbook }));
        showToast('Invoice Generated!');
      }
      setInvForm({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: data.portals[0]?.id || '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '', oldSellPrice: 0, oldBookingDate: '', oldPassengers: '', oldFlightType: '', oldPaymentMethod: '', refundReason: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '', status: 'Unpaid' });
      setPage('list');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // DELETE INVOICE
  // ═══════════════════════════════════════════════════════════════
  const handleDeleteInvoice = async (inv) => {
    if (!confirm('Delete permanently?')) return;
    try {
      if (inv.invoice_no?.startsWith('REF-')) {
        if (inv.payment_method === 'Credit' && inv.refund_customer > 0 && inv.customer_id) {
          const cust = data.customers.find(c => c.id === inv.customer_id);
          if (cust) { const nc = (cust.store_credit || 0) - (inv.refund_customer || 0); await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id); }
        }
        if (inv.portal_id && inv.refund_company > 0) {
          const portal = data.portals.find(p => p.id === inv.portal_id);
          if (portal) { const nb = (portal.current_balance || 0) - (inv.refund_company || 0); await supabase.from('portals').update({ current_balance: nb }).eq('id', inv.portal_id); }
        }
        if (inv.linked_inv_id) {
          const { data: origInv } = await supabase.from('invoices').select('id,due_amount').eq('invoice_no', inv.linked_inv_id).single();
          if (origInv) await supabase.from('invoices').update({ status: origInv.due_amount > 0 ? 'Unpaid' : 'Paid' }).eq('id', origInv.id);
        }
        const cbs = data.cashbook.filter(c => c.reference_id === inv.id || c.description?.includes(inv.invoice_no));
        for (const cb of cbs) await supabase.from('cashbook').delete().eq('id', cb.id);
        await supabase.from('invoices').delete().eq('id', inv.id);
        setData(prev => ({ ...prev, invoices: prev.invoices.filter(i => i.id !== inv.id), cashbook: prev.cashbook.filter(c => !cbs.find(x => x.id === c.id)), customers: prev.customers.map(c => c.id === inv.customer_id ? { ...c, store_credit: (c.store_credit || 0) - (inv.refund_customer || 0) } : c), portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: (p.current_balance || 0) - (inv.refund_company || 0) } : p) }));
        showToast('Refund Deleted & Original Restored!');
        return;
      }
      if (inv.used_credit > 0 && inv.customer_id) {
        const cust = data.customers.find(c => c.id === inv.customer_id);
        if (cust) { const nc = (cust.store_credit || 0) + (inv.used_credit || 0); await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id); setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: nc } : c) })); }
      }
      const portal = data.portals.find(p => p.id === inv.portal_id);
      let nb = 0;
      if (portal) { nb = (portal.current_balance || 0) + (inv.total_cost || 0); await supabase.from('portals').update({ current_balance: nb }).eq('id', portal.id); }
      const cbs = data.cashbook.filter(c => c.reference_id === inv.id || c.description?.includes('Payment for ' + inv.invoice_no) || c.description?.includes('Cash returned to customer for ' + inv.invoice_no) || c.description?.includes('Credit Balance used for ' + inv.invoice_no));
      for (const cb of cbs) await supabase.from('cashbook').delete().eq('id', cb.id);
      await supabase.from('invoices').delete().eq('id', inv.id);
      setData(prev => ({ ...prev, invoices: prev.invoices.filter(i => i.id !== inv.id), portals: prev.portals.map(p => p.id === portal?.id ? { ...p, current_balance: nb } : p), cashbook: prev.cashbook.filter(c => !cbs.find(x => x.id === c.id)) }));
      showToast('Invoice Deleted & Balances Reversed!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // GENERIC DELETE
  // ═══════════════════════════════════════════════════════════════
  const handleDelete = async (table, id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      setData(prev => ({ ...prev, [table]: Array.isArray(prev[table]) ? prev[table].filter(i => i.id !== id) : [] }));
      showToast('Deleted!');
      await logAction(`Deleted from ${table}`);
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // CRUD: CUSTOMERS
  // ═══════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════
  // CRUD: CORPORATES
  // ═══════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════
  // CRUD: CREDITORS
  // ═══════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════
  // CRUD: VENDORS
  // ═══════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════
  // CRUD: PACKAGES
  // ═══════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════
  // CRUD: BRANCHES (COMPLETE)
  // ═══════════════════════════════════════════════════════════════
  const handleEditBrn = (c) => {
    setEditBrnId(c.id);
    setBrnForm({
      name: c.name, location: c.location || '', phone: c.phone || '', manager: c.manager || '',
      email: c.email || '', timing: c.timing || '', status: c.status || 'Active'
    });
  };

  const handleAddEditBrn = async (e) => {
    e.preventDefault();
    const pl = {
      name: brnForm.name, location: brnForm.location, phone: brnForm.phone, manager: brnForm.manager,
      email: brnForm.email, timing: brnForm.timing, status: brnForm.status || 'Active',
      tenant_id: userProfile.tenant_id
    };
    try {
      if (editBrnId) {
        const { data: up, error } = await supabase.from('branches').update(pl).eq('id', editBrnId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, branches: prev.branches.map(c => c.id === editBrnId ? up : c) }));
        showToast('Branch Updated!');
        setEditBrnId(null);
      } else {
        const { data: nItem, error } = await supabase.from('branches').insert([pl]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, branches: [...prev.branches, nItem] }));
        showToast('Branch Added!');
      }
      setBrnForm({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // CRUD: EMPLOYEES (COMPLETE)
  // ═══════════════════════════════════════════════════════════════
  const handleEditEmp = (c) => {
    setEditEmpId(c.id);
    setEmpForm({
      name: c.name, phone: c.phone || '', iqama_no: c.iqama_no || '', iqama_expiry: c.iqama_expiry || '',
      role: c.role || 'Sales', salary: c.salary || 0, commission_rate: c.commission_rate || 0,
      nationality: c.nationality || '', job_title: c.job_title || '', national_id: c.national_id || '',
      join_date: c.join_date || '', bank_name: c.bank_name || '', bank_account: c.bank_account || '',
      labor_office_expiry: c.labor_office_expiry || ''
    });
  };

  const handleAddEditEmp = async (e) => {
    e.preventDefault();
    const pl = {
      name: empForm.name, phone: empForm.phone, iqama_no: empForm.iqama_no, iqama_expiry: empForm.iqama_expiry,
      role: empForm.role, salary: parseFloat(empForm.salary) || 0, commission_rate: parseFloat(empForm.commission_rate) || 0,
      nationality: empForm.nationality, job_title: empForm.job_title, national_id: empForm.national_id,
      join_date: empForm.join_date, bank_name: empForm.bank_name, bank_account: empForm.bank_account,
      labor_office_expiry: empForm.labor_office_expiry,
      tenant_id: userProfile.tenant_id
    };
    try {
      if (editEmpId) {
        const { data: up, error } = await supabase.from('employees').update(pl).eq('id', editEmpId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, employees: prev.employees.map(c => c.id === editEmpId ? up : c) }));
        showToast('Employee Updated!');
        setEditEmpId(null);
      } else {
        const { data: nItem, error } = await supabase.from('employees').insert([pl]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, employees: [...prev.employees, nItem] }));
        showToast('Employee Added!');
      }
      setEmpForm({ name: '', phone: '', iqama_no: '', iqama_expiry: '', role: 'Sales', salary: 0, commission_rate: 0, nationality: '', job_title: '', national_id: '', join_date: '', bank_name: '', bank_account: '', labor_office_expiry: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // CRUD: SERVICES
  // ═══════════════════════════════════════════════════════════════
  const handleEditSrv = (c) => { setEditSrvId(c.id); setSrvForm({ name: c.name }); };

  const handleAddEditSrv = async (e) => {
    e.preventDefault();
    const pl = { name: srvForm.name, tenant_id: userProfile.tenant_id };
    try {
      if (editSrvId) {
        const { data: up, error } = await supabase.from('services').update(pl).eq('id', editSrvId).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, services: prev.services.map(c => c.id === editSrvId ? up : c) }));
        showToast('Service Updated!');
        setEditSrvId(null);
      } else {
        const { data: nItem, error } = await supabase.from('services').insert([pl]).select().single();
        if (error) throw error;
        setData(prev => ({ ...prev, services: [...prev.services, nItem] }));
        showToast('Service Added!');
      }
      setSrvForm({ name: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // PORTALS
  // ═══════════════════════════════════════════════════════════════
  const handleAddPortal = async (e) => {
    e.preventDefault();
    try {
      const pl = {
        name: portalForm.name, current_balance: parseFloat(portalForm.balance) || 0,
        tenant_id: userProfile.tenant_id
      };
      const { data: nItem, error } = await supabase.from('portals').insert([pl]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, portals: [...prev.portals, nItem] }));
      setPortalForm({ name: '', balance: 0 });
      showToast('Portal Added!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleRecharge = async (portalId, amount) => {
    try {
      const portal = data.portals.find(p => p.id === portalId);
      if (!portal) throw new Error('Portal not found');
      const newBal = (portal.current_balance || 0) + (parseFloat(amount) || 0);
      const { error } = await supabase.from('portals').update({ current_balance: newBal }).eq('id', portalId);
      if (error) throw error;
      await supabase.from('cashbook').insert([{
        trans_date: today, type: 'Cash-In', description: `Recharge for ${portal.name || portalId}`,
        amount: parseFloat(amount) || 0, tenant_id: userProfile.tenant_id, reference_id: portalId
      }]).select().single();
      setData(prev => ({ ...prev, portals: prev.portals.map(p => p.id === portalId ? { ...p, current_balance: newBal } : p) }));
      showToast(`Recharged ${(parseFloat(amount) || 0).toFixed(2)} SAR to ${portal.name || portalId}`);
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // INVESTMENTS
  // ═══════════════════════════════════════════════════════════════
  const handleAddInvestment = async (e) => {
    e.preventDefault();
    try {
      const pl = {
        name: investForm.name, amount: parseFloat(investForm.amount) || 0, date: investForm.date || today,
        mode: investForm.mode || 'Cash', reason: investForm.reason || 'Other',
        otherReason: investForm.otherReason || '', description: investForm.desc || '',
        tenant_id: userProfile.tenant_id
      };
      const { data: nItem, error } = await supabase.from('investments').insert([pl]).select().single();
      if (error) throw error;
      if (parseFloat(investForm.amount) > 0) {
        const cbType = investForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
        await supabase.from('cashbook').insert([{
          trans_date: investForm.date || today, type: cbType, description: `Investment: ${investForm.reason}`,
          amount: parseFloat(investForm.amount), tenant_id: userProfile.tenant_id, reference_id: nItem.id
        }]).select().single();
      }
      setData(prev => ({ ...prev, investments: [...prev.investments, nItem] }));
      setInvestForm({ name: '', amount: '', date: today, mode: 'Cash', reason: 'Other', otherReason: '', desc: '' });
      showToast('Investment Added!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // FUND TRANSFER
  // ═══════════════════════════════════════════════════════════════
  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const fromType = transferForm.from;
      const toType = transferForm.to;
      const amount = parseFloat(transferForm.amount) || 0;
      if (amount <= 0) throw new Error('Enter valid amount');
      if (fromType === toType) throw new Error('Cannot transfer to same account');
      
      let fromBal = 0, toBal = 0;
      if (fromType === 'Cash') {
        fromBal = (data.cashbook || []).filter(c => c.type?.includes('Cash')).reduce((s, c) => s + (c.amount || 0), 0);
      } else {
        fromBal = (data.cashbook || []).filter(c => c.type?.includes('Bank')).reduce((s, c) => s + (c.amount || 0), 0);
      }
      if (toType === 'Cash') {
        toBal = (data.cashbook || []).filter(c => c.type?.includes('Cash')).reduce((s, c) => s + (c.amount || 0), 0);
      } else {
        toBal = (data.cashbook || []).filter(c => c.type?.includes('Bank')).reduce((s, c) => s + (c.amount || 0), 0);
      }
      
      if (fromBal < amount) throw new(`Insufficient ${fromType} balance: ${fromBal.toFixed(2)} SAR`);
      
      const cbFrom = fromType === 'Cash' ? 'Cash-Out' : 'Bank-Out';
      const cbTo = toType === 'Cash' ? 'Cash-In' : 'Bank-In';
      
      const { data: cbOut } = await supabase.from('cashbook').insert([{
        trans_date: transferForm.date, type: cbFrom, description: `Transfer to ${toType}`,
        amount, tenant_id: userProfile.tenant_id
      }]).select().single();
      
      const { data: cbIn } = await supabase.from('cashbook').insert([{
        trans_date: transferForm.date, type: cbTo, description: `Transfer from ${fromType}`,
        amount, tenant_id: userProfile.tenant_id
      }]).select().single();
      
      setData(prev => ({ ...prev, cashbook: [cbOut, cbIn, ...prev.cashbook] }));
      showToast(`Transferred ${amount.toFixed(2)} SAR from ${fromType} to ${toType}`);
      setTransferForm({ from: 'Cash', to: 'Bank', amount: '', date: today });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // EXPENSES (COMPLETE)
  // ═══════════════════════════════════════════════════════════════
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const items = expForm.items || [];
      const totalAmt = items.reduce((sum, it) => sum + ((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)), 0);
      const pl = {
        expense_type: expForm.expense_type, payment_mode: expForm.payment_mode, description: expForm.description,
        expense_date: expForm.expense_date, vendor_name: expForm.vendor_name,
        taxRate: parseFloat(expForm.taxRate) || 0, amount: totalAmt,
        items: items.filter(it => it.name), approval_status: expForm.approval_status || 'Approved',
        tenant_id: userProfile.tenant_id
      };
      let newExp;
      if (editExpId) {
        const { data: up, error } = await supabase.from('expenses').update(pl).eq('id', editExpId).select().single();
        if (error) throw error;
        newExp = up;
        setEditExpId(null);
      } else {
        const { data: nItem, error } = await supabase.from('expenses').insert([pl]).select().single();
        if (error) throw error;
        newExp = nItem;
        if (totalAmt > 0) {
          const cbType = expForm.payment_mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
          const { data: nC } = await supabase.from('cashbook').insert([{
            trans_date: expForm.expense_date, type: cbType, description: `Expense: ${expForm.expense_type} - ${expForm.description}`,
            amount: totalAmt, tenant_id: userProfile.tenant_id, reference_id: newExp.id
          }]).select().single();
          if (nC) {
            newExp = { ...newExp, cashbook_id: nC.id };
          }
        }
      }
      setData(prev => ({ ...prev, expenses: editExpId ? prev.expenses.map(ex => ex.id === editExpId ? newExp : ex) : [newExp, ...prev.expenses] }));
      showToast(editExpId ? 'Expense Updated!' : 'Expense Added!');
      setExpForm({ expense_type: '', payment_mode: 'Cash', description: '', expense_date: today, vendor_name: '', taxRate: '0', items: [{ name: '', qty: 1, price: 0 }], approval_status: 'Approved' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleEditExpense = (exp) => {
    setEditExpId(exp.id);
    setExpForm({
      expense_type: exp.expense_type || '', payment_mode: exp.payment_mode || 'Cash', description: exp.description || '',
      expense_date: exp.expense_date || today, vendor_name: exp.vendor_name || '', taxRate: exp.taxRate?.toString() || '0',
      items: (exp.items && exp.items.length > 0) ? exp.items : [{ name: exp.item_name || '', qty: 1, price: exp.amount || 0 }],
      approval_status: exp.approval_status || 'Approved'
    });
  };

  const handleDeleteExpense = async (exp) => {
    if (!confirm('Delete this expense?')) return;
    try {
      if (exp.cashbook_id) await supabase.from('cashbook').delete().eq('id', exp.cashbook_id);
      await supabase.from('expenses').delete().eq('id', exp.id);
      setData(prev => ({ ...prev, expenses: prev.expenses.filter(ex => ex.id !== exp.id), cashbook: prev.cashbook.filter(c => c.id !== exp.cashbook_id) }));
      showToast('Expense Deleted!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handlePreviewExpense = (exp) => {
    setPreviewHTML(getExpenseHTML(exp, data.settings, lang));
    setModal({ type: 'preview', data: exp });
  };

  const handleAddExpItem = () => {
    setExpForm(prev => ({ ...prev, items: [...prev.items, { name: '', qty: 1, price: 0 }] }));
  };

  const handleRemoveExpItem = (index) => {
    setExpForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleExpItemChange = (index, field, value) => {
    setExpForm(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  // ═══════════════════════════════════════════════════════════════
  // PAYROLL & SALARY (COMPLETE)
  // ═════════════════════════════════════════════════════════════
  const handlePaySalary = async (e) => {
    e.preventDefault();
    try {
      const fd = e.target;
      const empId = fd.emp?.value;
      if (!empId) throw new Error('Select Employee');
      
      const emp = data.employees.find(em => em.id === empId);
      if (!emp) throw new Error('Employee not found');
      
      const base = parseFloat(fd.base) || emp.salary || 0;
      const commRate = parseFloat(fd.comm) || emp.commission_rate || 0;
      const overtime = parseFloat(fd.overtime) || 0;
      const gift = parseFloat(fd.gift) || 0;
      const advDed = parseFloat(fd.adv_ded) || 0;
      
      // Calculate commission from sales
      const empSales = (data.invoices || []).filter(i => i.employee_id === empId && !i.invoice_no?.startsWith('REF-'));
      const totalSales = empSales.reduce((s, i) => s + (i.total_sell || 0), 0);
      const commission = totalSales * (commRate / 100);
      
      const gross = base + commission + overtime + gift;
      const net = gross - advDed;
      
      if (net < 0) throw new Error('Net salary cannot be negative!');
      
      const month = fd.month || today.slice(0, 7);
      const mode = fd.mode || 'Cash';
      const paymentDate = fd.payment_date || today;
      
      const { data: newPay, error } = await supabase.from('payroll').insert([{
        employee_id: empId, month, base_salary: base, commission, overtime, gift,
        advance_deduction: advDed, gross, net, amount: net,
        payment_mode: mode, payment_date: paymentDate,
        tenant_id: userProfile.tenant_id
      }]).select('*, employees(name)').single();
      
      if (error) throw error;
      
      // Add cashbook entry
      let newCb = null;
      if (net > 0) {
        const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
        const { data: nC } = await supabase.from('cashbook').insert([{
          trans_date: paymentDate, type: cbType, description: `Salary for ${emp.name} - ${month}`,
          amount: net, tenant_id: userProfile.tenant_id, reference_id: newPay.id
        }]).select().single();
        newCb = nC;
      }
      
      setData(prev => ({ ...prev, payroll: [newPay, ...prev.payroll], cashbook: newCb ? [newCb, ...prev.cashbook] : prev.cashbook }));
      await logAction(`Paid salary ${net.toFixed(2)} SAR to ${emp.name} for ${month}`);
      showToast(`Salary Paid: ${net.toFixed(2)} SAR to ${emp.name}`);
      
      // Reset form
      if (fd.reset) fd.reset();
      setPayForm({ employee_id: '', month: today.slice(0, 7), overtime: 0, gift: 0, advance: 0, mistakes_deduction: 0, other_deduction: 0, payment_mode: 'Cash', payment_date: today, notes: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleProcessPayroll = async (e) => {
    e.preventDefault();
    try {
      const fd = e.target;
      const empId = fd.emp?.value;
      if (!empId) throw new Error('Select Employee');
      
      const emp = data.employees.find(em => em.id === empId);
      if (!emp) throw new Error('Employee not found');
      
      const month = fd.month || today.slice(0, 7);
      
      // Get attendance for the month
      const monthAttendance = (data.attendance || []).filter(a => 
        a.employee_id === empId && a.date?.startsWith(month)
      );
      const presentDays = monthAttendance.filter(a => a.status === 'Present').length;
      const leaveDays = monthAttendance.filter(a => a.status === 'Leave').length;
      const absentDays = monthAttendance.filter(a => a.status === 'Absent').length;
      const overtimeHrs = monthAttendance.reduce((s, a) => s + (a.overtime || 0), 0);
      
      const base = parseFloat(emp.salary) || 0;
      const commRate = parseFloat(emp.commission_rate) || 0;
      const overtime = overtimeHrs * (base / 30); // Assuming 8hr day, so hourly = base/30
      const gift = parseFloat(fd.gift) || 0;
      const advDed = parseFloat(fd.adv_ded) || 0;
      
      const gross = base + overtime + gift;
      const net = gross - advDed;
      
      const { data: newPay, error } = await supabase.from('payroll').insert([{
        employee_id: empId, month, base_salary: base, commission: 0, overtime, gift,
        advance_deduction: advDed, gross, net, amount: net,
        payment_mode: fd.mode || 'Cash', payment_date: fd.date || today,
        tenant_id: userProfile.tenant_id
      }]).select('*, employees(name)').single();
      
      if (error) throw error;
      
      setData(prev => ({ ...prev, payroll: [newPay, ...prev.payroll] }));
      showToast(`Payroll Processed for ${emp.name} for ${month} - Net: ${net.toFixed(2)} SAR`);
      if (fd.reset) fd.reset();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // EMPLOYEE ADVANCES (COMPLETE)
  // ═══════════════════════════════════════════════════════════════
  const handleAddAdvance = async (e) => {
    e.preventDefault();
    try {
      const pl = {
        employee_id: advForm.employee_id, amount: parseFloat(advForm.amount) || 0, date: advForm.date || today,
        status: advForm.status || 'Pending', reason: advForm.reason || '',
        tenant_id: userProfile.tenant_id
      };
      if (!pl.employee_id) throw new Error('Select Employee');
      const { data: nItem, error } = await supabase.from('emp_advances').insert([pl]).select('*, employees(name)').single();
      if (error) throw error;
      
      // If status is 'Paid', add to expense
      if (pl.status === 'Paid') {
        const emp = data.employees.find(em => em.id === pl.employee_id);
        const { data: expItem } = await supabase.from('expenses').insert([{
          expense_type: 'Salary Advance Return', payment_mode: 'Cash', description: `Advance return for ${emp?.name || 'Employee'}`,
          expense_date: pl.date, vendor_name: pl.employee_id, amount: pl.amount, approval_status: 'Approved',
          tenant_id: userProfile.tenant_id
        }]).select().single();
        
        if (expItem) {
          await supabase.from('cashbook').insert([{
            trans_date: pl.date, type: 'Cash-In', description: `Advance return from ${emp?.name || 'Employee'}`,
            amount: pl.amount, tenant_id: userProfile.tenant_id, reference_id: expItem.id
          }]).select().single();
        }
      }
      
      setData(prev => ({ ...prev, empAdvances: [...prev.empAdvances, nItem] }));
      setAdvForm({ employee_id: '', amount: '', date: today, status: 'Pending', reason: '' });
      showToast(`Advance ${pl.status === 'Paid' ? 'Returned & Added to Expense' : 'Advance Added'}: ${pl.amount} SAR`);
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleReturnAdvance = async (id) => {
    if (!confirm('Mark this advance as returned?')) return;
    try {
      const adv = data.empAdvances.find(a => a.id === id);
      if (!adv) throw new Error('Advance not found');
      
      if (adv.status === 'Pending') {
        const { error } = await supabase.from('emp_advances').update({ status: 'Returned', date: today }).eq('id', id);
        if (error) throw error;
        setData(prev => ({ ...prev, empAdvances: prev.empAdvances.map(a => a.id === id ? { ...a, status: 'Returned', date: today } : a) }));
        showToast('Advance Marked as Returned!');
      } else if (adv.status === 'Returned') {
        const { error } = await supabase.from('emp_advances').update({ status: 'Pending' }).eq('id', id);
        if (error) throw error;
        setData(prev => ({ ...prev, empAdvances: prev.empAdvances.map(a => a.id === id ? { ...a, status: 'Pending' } : a) }));
        showToast('Advance Marked as Pending!');
      }
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleUpdateAdvanceStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('emp_advances').update({ status: newStatus, date: today }).eq('id', id);
      if (error) throw error;
      setData(prev => ({ ...prev, empAdvances: prev.empAdvances.map(a => a.id === id ? { ...a, status: newStatus, date: today } : a) }));
      showToast(`Advance status updated to: ${newStatus}`);
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // USERS (COMPLETE)
  // ═══════════════════════════════════════════════════════════════
  const handleAddEditUser = async (e) => {
    e.preventDefault();
    try {
      const pl = {
        email: userForm.email, username: userForm.username, role: userForm.role || 'Staff',
        is_admin: userForm.is_admin || false, can_access_invoices: userForm.can_access_invoices !== false,
        can_access_bank: userForm.can_access_bank || false, can_access_hr: userForm.can_access_hr || false,
        can_access_reports: userForm.can_access_reports || false, can_access_settings: userForm.can_access_settings || false,
        employee_id: userForm.employee_id || null, tenant_id: userProfile.tenant_id
      };
      
      if (!pl.email) throw new Error('Email is required!');
      
      let result;
      if (editUserId) {
        result = await supabase.from('app_users').update(pl).eq('id', editUserId).select().single();
        setEditUserId(null);
      } else {
        // Check if email already exists
        const { data: existing } = await supabase.from('app_users').select('id').eq('email', pl.email).maybeSingle();
        if (existing) throw new Error('User with this email already exists!');
        result = await supabase.from('app_users').insert([pl]).select().single();
      }
      
      if (result.error) throw new Error(result.error.message);
      
      setData(prev => ({ ...prev, appUsers: editUserId ? prev.appUsers.map(u => u.id === editUserId ? result : u) : [...prev.appUsers, result] }));
      showToast(editUserId ? 'User Updated!' : 'User Created!');
      setUserForm({ email: '', username: '', role: 'Staff', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false, employee_id: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleEditUser = (u) => {
    setEditUserId(u.id);
    setUserForm({
      email: u.email, username: u.username || '', role: u.role || 'Staff',
      is_admin: u.is_admin || false, can_access_invoices: u.can_access_invoices !== false,
      can_access_bank: u.can_access_bank || false, can_access_hr: u.can_access_hr || false,
      can_access_reports: u.can_access_reports || false, can_access_settings: u.can_access_settings || false,
      employee_id: u.employee_id || ''
    });
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      // Check if trying to delete yourself
      if (id === userProfile.id) throw new Error('Cannot delete your own account!');
      await supabase.from('app_users').delete().eq('id', id);
      setData(prev => ({ ...prev, appUsers: prev.appUsers.filter(u => u.id !== id) }));
      showToast('User Deleted!');
      await logAction(`Deleted user ${id}`);
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ═══════════════════════════════════════════════════════════════
  // RETURN ALL FUNCTIONS
  // ═════════════════════════════════════════════════════════════
  return {
    // Export
    exportToExcel,

    // Auth
    handleLogout, handleChangePassword,

    // Chat
    handleSendMessage,

    // Custom Fields
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

    // Contract / Offer
    handleGenerateContract, handleGenerateOffer,

    // Preview & Modal
    openPreview, openRefundModal, openSettleModal, handleQuickSettle,

    // Settle Payment
    handleSettlePayment,

    // Refund
    handleRefund,

    // Staff Mistakes
    handleAddMistake, handlePreviewMistake, handleDeleteMistake,

    // Salary Slip
    handleGenerateSlip, handleDeletePayroll,

    // Invoice
    handleEditInvoice, handleCreateInvoice, handleDeleteInvoice,

    // Generic Delete
    handleDelete,

    // CRUD: Customers
    handleEditCust, handleAddEditCust,

    // CRUD: Corporates
    handleEditCorp, handleAddEditCorp,

    // CRUD: Creditors
    handleEditCred, handleAddEditCred,

    // CRUD: Vendors
    handleEditVend, handleAddEditVend,

    // CRUD: Packages
    handleEditPkg, handleAddEditPkg,

    // CRUD: Branches
    handleEditBrn, handleAddEditBrn,

    // CRUD: Employees
    handleEditEmp, handleAddEditEmp,

    // CRUD: Services
    handleEditSrv, handleAddEditSrv,

    // Portals
    handleAddPortal, handleRecharge,

    // Investments
    handleAddInvestment,

    // Fund Transfer
    handleTransfer,

    // Expenses
    handleAddExpense, handleEditExpense, handleDeleteExpense, handlePreviewExpense,
    handleAddExpItem, handleRemoveExpItem, handleExpItemChange,

    // Payroll & Salary
    handlePaySalary, handleProcessPayroll,

    // Employee Advances
    handleAddAdvance, handleReturnAdvance, handleUpdateAdvanceStatus,

    // Users
    handleAddEditUser, handleEditUser, handleDeleteUser
  };
};
