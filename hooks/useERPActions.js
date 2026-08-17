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
    portalForm, setPortalForm, editInvId, setEditInvId, editExpId, setEditExpId, editCorpId, setEditCorpId, 
    editCredId, setEditCredId, editCustId, setEditCustId, editVendId, setEditVendId, editPkgId, setEditPkgId, 
    editBrnId, setEditBrnId, editEmpId, setEditEmpId, editSrvId, setEditSrvId, editUserId, setEditUserId, 
    modal, setModal, passForm, setPassForm, chatInput, setChatInput, chatMessages, setChatMessages, 
    previewHTML, setPreviewHTML, getInvoiceHTML, getRefundHTML, getExpenseHTML, getSalarySlipHTML, getContractHTML, 
    today, router, contractCorpName, contractType, contractMarkup, contractTerms, tenantForm, setTenantForm, 
    profileForm, setProfileForm, ledgerEmpId 
  } = state;

  // ===================== AUTH =====================
  const handleLogout = () => { supabase.auth.signOut(); router.push('/login'); };
  
  const handleChangePassword = async (e) => { 
    e.preventDefault(); 
    if (!passForm.newPass) return showToast('Please enter a new password!');
    const { error } = await supabase.auth.updateUser({ password: passForm.newPass }); 
    if (error) return showToast('Error: ' + error.message); 
    showToast('Password Updated Successfully!'); 
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
      let reply = "I can help with Invoices, Customers, Reports. Try asking about them!";
      if (input.includes('invoice') || input.includes('فاتورة')) reply = "📄 Go to 'Create Invoice' to make one, or 'Invoices' to view all.";
      else if (input.includes('customer') || input.includes('عميل')) reply = "👤 Manage customers from the Customers page.";
      else if (input.includes('refund') || input.includes('استرجاع')) reply = "🔄 Click Refund button on any invoice to process it.";
      else if (input.includes('report') || input.includes('تقرير')) reply = "📊 Visit Reports for sales, expenses, P&L analysis.";
      else if (input.includes('profit') || input.includes('ربح')) reply = "💰 Check Profitability page for airline-wise profit analysis.";
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]); 
    }, 500); 
  };

  // ===================== CUSTOM FIELDS =====================
  const handleAddCustomField = () => setSetForm(prev => ({ ...prev, custom_fields: [...(prev.custom_fields || []), { key: '', value: '' }] }));
  const handleRemoveCustomField = (index) => setSetForm(prev => ({ ...prev, custom_fields: prev.custom_fields.filter((_, i) => i !== index) }));
  const handleCustomFieldChange = (index, type, value) => setSetForm(prev => {
    const cf = [...prev.custom_fields]; cf[index][type] = value; return { ...prev, custom_fields: cf };
  });

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
      showToast('Profile Updated Successfully!');
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
      if (error) throw error; showToast('Subscription Updated!'); fetchAll();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleDeleteTenant = async (id) => {
    if (!confirm('Delete this Agency permanently?')) return;
    try { await supabase.from('tenants').delete().eq('id', id); showToast('Agency Deleted!'); fetchAll(); } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== PDF & PRINT (QR CODE BASE64 FIX) =====================
  const downloadPDF = async (htmlContent, filename = 'document.pdf') => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      // 1. Create a temporary div
      const div = document.createElement('div');
      div.style.position = 'absolute'; div.style.left = '-9999px'; div.style.top = '0';
      
      // 2. Convert QR Code Images to Base64 before rendering to prevent CORS/Taint issues in PDF
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const qrImages = doc.querySelectorAll('img[src*="api.qrserver.com"]');
      
      await Promise.all(Array.from(qrImages).map(async (img) => {
        try {
          const response = await fetch(img.src);
          const blob = await response.blob();
          const reader = new FileReader();
          const base64 = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          img.src = base64; // Replace external URL with Base64 data
        } catch (e) { console.error("QR Fetch Error:", e); }
      }));

      div.innerHTML = doc.body.innerHTML;
      document.body.appendChild(div);

      // 3. Wait for all images (including base64) to load
      const images = div.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = img.onerror = res; })));

      // 4. Generate Canvas & PDF
      const canvas = await html2canvas(div, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight; let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) { position = heightLeft - imgHeight; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); heightLeft -= pageHeight; }
      pdf.save(filename); document.body.removeChild(div); showToast('PDF Downloaded!');
    } catch (err) { showToast('PDF Error: ' + err.message); }
  };

  const handleDownloadPDF = async (inv) => {
    const s = data.settings;
    const html = inv.invoice_no.startsWith('REF-') ? getRefundHTML(inv, s, lang) : getInvoiceHTML(inv, s, lang);
    await downloadPDF(html, `${inv.invoice_no}.pdf`);
  };

  const printInvoice = (inv) => {
    const s = data.settings;
    const html = inv.invoice_no.startsWith('REF-') ? getRefundHTML(inv, s, lang) : getInvoiceHTML(inv, s, lang);
    const w = window.open('', '_blank'); w.document.write(html); w.document.close(); w.print();
  };

  // ===================== SHARE =====================
  const shareWhatsApp = (inv) => {
    if (inv.invoice_no.startsWith('REF-')) return showToast('Refund invoices cannot be shared via WhatsApp!');
    handleShareWhatsApp(inv, data.settings);
  };
  const shareEmail = (inv) => {
    if (inv.invoice_no.startsWith('REF-')) return showToast('Refund invoices cannot be shared via Email!');
    handleShareEmail(inv, data.settings);
  };

  // ===================== CONTRACT / OFFER =====================
  const handleGenerateContract = (e) => {
    e.preventDefault(); if (!contractCorpName) return showToast('Enter Corporate Name');
    const html = getContractHTML(data.settings, contractCorpName, today, false, contractType, contractMarkup, contractTerms);
    setPreviewHTML(html); setModal({ type: 'preview', data: null });
  };
  const handleGenerateOffer = (e) => {
    e.preventDefault(); if (!contractCorpName) return showToast('Enter Corporate Name');
    const html = getContractHTML(data.settings, contractCorpName, today, true, contractType, contractMarkup, contractTerms);
    setPreviewHTML(html); setModal({ type: 'preview', data: null });
  };

  // ===================== PREVIEW (NO PAGE BREAK - ONE PAGE FIX) =====================
  const openPreview = (inv) => {
    const s = data.settings;
    let html = inv.invoice_no.startsWith('REF-') ? getRefundHTML(inv, s, lang) : getInvoiceHTML(inv, s, lang);
    
    // If Re-issue, append the original Refund Invoice directly below to fit on ONE page
    if (!inv.invoice_no.startsWith('REF-') && inv.linked_inv_id && (inv.booking_type === 'Previous Booking' || inv.booking_type === 'Reissue')) {
      const linkedRefundInv = data.invoices.find(i => i.invoice_no === inv.linked_inv_id);
      if (linkedRefundInv) {
        html += `<div style="margin-top: 30px; border-top: 2px dashed #cbd5e1; padding-top: 20px;"><h1 style="color:#7f1d1d; text-align:center; font-size: 18px; margin-bottom: 15px;">Linked Refund Invoice / فاتورة الاسترجاع المرتبطة</h1>`;
        html += getRefundHTML(linkedRefundInv, s, lang);
        html += `</div>`;
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

  const handleQuickSettle = (inv) => { openSettleModal(inv); };

  const handleSettlePayment = async (e) => {
    e.preventDefault();
    try {
      const inv = modal.data || data.invoices.find(i => i.id === settleForm.id);
      if (!inv) throw new Error('Invoice not found');
      const settleAmount = inv.due_amount || 0;
      const newPaid = (inv.paid_amount || 0) + settleAmount;
      const { data: upInv, error } = await supabase.from('invoices').update({ 
        paid_amount: newPaid, due_amount: 0, status: 'Paid' 
      }).eq('id', inv.id).select(`*, customers(name), corporates(name), employees(name)`).single();
      if (error) throw error;
      const cbType = settleForm.mode === 'Cash' ? 'Cash-In' : 'Bank-In';
      const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ 
        trans_date: settleForm.date, type: cbType, description: `Settlement for ${inv.invoice_no}`, 
        amount: settleAmount, tenant_id: userProfile.tenant_id, reference_id: inv.id
      }]).select().single();
      if (cbErr) console.error('Cashbook error:', cbErr.message);
      setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i), cashbook: nC ? [nC, ...prev.cashbook] : prev.cashbook }));
      await logAction(`Settled payment for ${inv.invoice_no}`);
      showToast('Payment Settled!'); setModal({ type: null, data: null });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleRefund = async (e) => {
    e.preventDefault();
    try {
      const origInv = modal.data;
      if (!origInv) throw new Error('Original invoice not found');
      const compRefund = parseFloat(refundForm.compRefund) || 0;
      const custRefund = parseFloat(refundForm.custRefund) || 0;
      const refundNo = `REF-${Date.now()}`;
      
      if (refundForm.mode === 'Credit' && custRefund > 0 && origInv.customer_id) {
        const cust = data.customers.find(c => c.id === origInv.customer_id);
        if (cust) {
          const newCredit = (cust.store_credit || 0) + custRefund;
          await supabase.from('customers').update({ store_credit: newCredit }).eq('id', cust.id);
          setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: newCredit } : c) }));
        }
      }
      if (compRefund > 0 && refundForm.portalId) {
        const portal = data.portals.find(p => p.id === refundForm.portalId);
        if (portal) {
          const newBal = (portal.current_balance || 0) + compRefund;
          await supabase.from('portals').update({ current_balance: newBal }).eq('id', portal.id);
          setData(prev => ({ ...prev, portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: newBal } : p) }));
        }
      }
      
      // SAVING DEEP DETAILS IN REFUND INVOICE FROM ORIGINAL INVOICE
      const refundPayload = {
        invoice_no: refundNo, customer_id: origInv.customer_id, corporate_id: origInv.corporate_id,
        old_customer_name: origInv.customers?.name || 'N/A',
        old_customer_phone: origInv.customers?.phone || 'N/A',
        portal_id: refundForm.portalId || origInv.portal_id, employee_id: origInv.employee_id || null,
        invoice_date: refundForm.date, refund_date: refundForm.date,
        service_type: origInv.service_type, sector: origInv.sector, flight_sector: origInv.flight_sector,
        airline: origInv.airline, ticket_no: origInv.ticket_no, pnr: origInv.pnr,
        passenger_names: origInv.passenger_names, flight_type: origInv.flight_type, flight_journey: origInv.flight_journey,
        total_cost: 0, total_sell: 0, profit: compRefund - custRefund,
        vat: 0, total: 0, paid_amount: 0, due_amount: 0,
        payment_method: refundForm.mode, refund_company: compRefund, refund_customer: custRefund,
        refund_reason: refundForm.reason, linked_inv_id: origInv.invoice_no,
        old_airline: origInv.airline,
        old_sector: origInv.flight_sector || origInv.sector,
        old_pnr: origInv.pnr,
        old_ticket_no: origInv.ticket_no,
        old_flight_type: origInv.flight_type,
        old_payment_method: origInv.payment_method,
        old_passengers: origInv.passenger_names,
        old_sell_price: origInv.total_sell || 0,
        old_booking_date: origInv.invoice_date,
        status: 'refunded', tenant_id: userProfile.tenant_id
      };
      const { data: newRefund, error: refErr } = await supabase.from('invoices').insert([refundPayload]).select(`*, customers(name), corporates(name), employees(name)`).single();
      if (refErr) throw new Error('Refund creation failed: ' + refErr.message);
      
      let newCashEntry = null;
      if (custRefund > 0 && refundForm.mode !== 'Credit') {
        const cbType = refundForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
        const { data: nC } = await supabase.from('cashbook').insert([{ 
          trans_date: refundForm.date, type: cbType, description: `Refund to customer for ${refundNo}`,
          amount: custRefund, tenant_id: userProfile.tenant_id, reference_id: newRefund.id
        }]).select().single();
        newCashEntry = nC;
      }
      await supabase.from('invoices').update({ status: 'refunded' }).eq('id', origInv.id);
      setData(prev => ({
        ...prev,
        invoices: [newRefund, ...prev.invoices.map(i => i.id === origInv.id ? { ...i, status: 'refunded' } : i)],
        cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook
      }));
      await logAction(`Processed refund ${refundNo} for ${origInv.invoice_no}`);
      showToast('Refund Processed!'); setModal({ type: null, data: null });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== MISTAKES & SALARY SLIP =====================
  const handleAddMistake = async (e) => {
    e.preventDefault();
    try {
      const empId = e.target.emp.value;
      const oldTkt = e.target.old_tkt.value;
      const newTkt = e.target.new_tkt.value;
      const lossAmt = parseFloat(e.target.loss_amt.value) || 0;
      const paidByEmp = e.target.paid_by_emp?.checked || false;
      const { data: newMistake, error } = await supabase.from('staff_mistakes').insert([{
        employee_id: empId, old_ticket_no: oldTkt, new_ticket_no: newTkt,
        loss_amount: lossAmt, paid_by_employee: paidByEmp, date: today, tenant_id: userProfile.tenant_id
      }]).select('*, employees(name)').single();
      if (error) throw error;
      setData(prev => ({ ...prev, staffMistakes: [newMistake, ...(prev.staffMistakes || [])] }));
      showToast('Mistake Logged!'); e.target.reset();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleGenerateSlip = (pay) => {
    const html = getSalarySlipHTML(pay, data.settings, lang);
    downloadPDF(html, `SalarySlip_${pay.employees?.name || 'Employee'}_${pay.month}.pdf`);
  };

  // ===================== EDIT INVOICE (FETCH DEEP DETAILS) =====================
  const handleEditInvoice = (inv) => {
    if (inv.invoice_no.startsWith('REF-')) {
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
      linkedInvId: inv.linked_inv_id || '', 
      oldTicketNo: inv.old_ticket_no || '', oldPnr: inv.old_pnr || '', oldAirline: inv.old_airline || '', oldSector: inv.old_sector || '',
      oldSellPrice: inv.old_sell_price || 0, oldBookingDate: inv.old_booking_date || '', 
      oldPassengers: inv.old_passengers || '', oldFlightType: inv.old_flight_type || '', oldPaymentMethod: inv.old_payment_method || '',
      refundReason: inv.refund_reason || '',
      flightSector: inv.flight_sector || '', airline: inv.airline || '', pnr: inv.pnr || '',
      ticketNo: inv.ticket_no || '', qty: inv.qty || 1,
      cost: (inv.total_cost || 0) / (inv.qty || 1),
      sell: ((inv.total_sell || 0) + (inv.discount || 0)) / (inv.qty || 1),
      discount: inv.discount || 0, taxRate: inv.vat > 0 ? '15' : '0',
      payment: inv.payment_method, paid: (inv.paid_amount || 0) - (inv.used_credit || 0),
      useCredit: inv.used_credit || 0, invoiceDate: inv.invoice_date || today,
      employeeId: inv.employee_id || '', passengers: inv.passenger_names ? inv.passenger_names.split('\n') : [''],
      status: inv.status || 'Unpaid', creditDueDate: inv.credit_due_date || '',
      creditorId: inv.creditor_id || '', tabbyNo: inv.tabby_order_no || '',
      tamaraNo: inv.tamara_order_no || '', ticketStatus: inv.ticket_status || 'Confirmed',
      bookingDate: inv.booking_date || today, destination: '', hotelName: '',
      checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', creditCustId: ''
    });
    state.setPage('create');
  };

  // ===================== CREATE INVOICE (SAVE DEEP DETAILS) =====================
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
      const cashPaid = parseFloat(invForm.paid) || 0;
      const usedCredit = parseFloat(invForm.useCredit) || 0;
      const totalPaid = cashPaid + usedCredit;
      const due = total - totalPaid;
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
          const newCredit = (cust.store_credit || 0) - usedCredit;
          if (newCredit < 0) throw new Error('Insufficient credit balance!');
          const { error: credErr } = await supabase.from('customers').update({ store_credit: newCredit }).eq('id', cust.id);
          if (credErr) throw new Error('Credit update failed: ' + credErr.message);
          setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: newCredit } : c) }));
        }
      }
      const portal = data.portals.find(p => p.id === invForm.portalId);
      if (!portal) throw new Error("Please select a Portal");
      let desc = invForm.service === 'Flight Ticket' ? `${invForm.airline} - ${invForm.flightSector}` : invForm.service;
      const passengerNames = invForm.passengers.filter(p => p).join('\n');
      const payload = {
        customer_id: cid, corporate_id: corpId, portal_id: portal.id,
        employee_id: invForm.employeeId || null, booking_date: invForm.bookingDate,
        invoice_date: invForm.invoiceDate, service_type: invForm.service,
        flight_type: invForm.flightType, flight_journey: invForm.flightJourney,
        refundable_status: invForm.refundable, booking_type: invForm.bookingType,
        linked_inv_id: invForm.linkedInvId || null,
        old_ticket_no: invForm.oldTicketNo || null, old_pnr: invForm.oldPnr || null,
        old_airline: invForm.oldAirline || null, old_sector: invForm.oldSector || null,
        old_sell_price: parseFloat(invForm.oldSellPrice) || 0, old_booking_date: invForm.oldBookingDate || null,
        old_passengers: invForm.oldPassengers || null, old_flight_type: invForm.oldFlightType || null, old_payment_method: invForm.oldPaymentMethod || null,
        refund_reason: invForm.refundReason || null,
        pnr: invForm.pnr, ticket_no: invForm.ticketNo, sector: desc, qty, discount,
        passenger_names: passengerNames || null, airline: invForm.airline || null,
        flight_sector: invForm.flightSector || null, total_cost: cost, total_sell: sell,
        profit, vat, total, paid_amount: totalPaid, used_credit: usedCredit, due_amount: due,
        payment_method: invForm.payment,
        credit_due_date: due > 0 && invForm.payment === 'Credit' ? invForm.creditDueDate : null,
        creditor_id: invForm.payment === 'Credit' ? (invForm.creditorId || null) : null,
        tabby_order_no: invForm.payment === 'Tabby' ? invForm.tabbyNo : null,
        tamara_order_no: invForm.payment === 'Tamara' ? invForm.tamaraNo : null,
        ticket_status: invForm.ticketStatus,
        status: invForm.status || 'Unpaid', // FIX: Status strictly follows dropdown selection
        tenant_id: userProfile.tenant_id
      };
      if (editInvId) {
        const { data: upInv, error: upErr } = await supabase.from('invoices').update(payload).eq('id', editInvId).select(`*, customers(name), corporates(name), employees(name)`).single();
        if (upErr) throw new Error('Invoice update failed: ' + upErr.message);
        setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === editInvId ? upInv : i) }));
        showToast('Invoice Updated!'); setEditInvId(null);
      } else {
        const invNo = `INV-${Date.now()}`;
        const { data: newInv, error: invErr } = await supabase.from('invoices').insert([{ invoice_no: invNo, ...payload }]).select(`*, customers(name), corporates(name), employees(name)`).single();
        if (invErr) throw new Error('Invoice creation failed: ' + invErr.message);
        const newPortalBal = (portal.current_balance || 0) - cost;
        await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', portal.id);
        await logAction(`Created Invoice ${invNo}`);
        let newCashEntry = null;
        if (cashPaid > 0 && invForm.payment !== 'Credit' && invForm.payment !== 'Credit Balance') {
          const cbType = invForm.payment === 'Cash' ? 'Cash-In' : (invForm.payment === 'Bank Transfer' || invForm.payment === 'Card / Network' ? 'Bank-In' : null);
          if (cbType) {
            const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: invForm.invoiceDate, type: cbType, description: `Payment for ${invNo}`, amount: cashPaid, tenant_id: userProfile.tenant_id, reference_id: newInv.id }]).select().single();
            if (cbErr) console.error("Cashbook error:", cbErr.message);
            newCashEntry = nC;
          }
        }
        setData(prev => ({ ...prev, invoices: [newInv, ...prev.invoices], portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: newPortalBal } : p), cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook }));
        showToast('Invoice Generated!');
      }
      setInvForm({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: data.portals[0]?.id || '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', oldTicketNo: '', oldPnr: '', oldAirline: '', oldSector: '', oldSellPrice: 0, oldBookingDate: '', oldPassengers: '', oldFlightType: '', oldPaymentMethod: '', refundReason: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '', status: 'Unpaid' });
      state.setPage('list');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== DELETE INVOICE =====================
  const handleDeleteInvoice = async (inv) => {
    if (!confirm('Delete permanently? All accounting entries will be reversed.')) return;
    try {
      if (inv.invoice_no.startsWith('REF-')) {
        if (inv.payment_method === 'Credit' && inv.refund_customer > 0 && inv.customer_id) {
          const cust = data.customers.find(c => c.id === inv.customer_id);
          if (cust) { const nc = (cust.store_credit || 0) - (inv.refund_customer || 0); await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id); }
        }
        const cbEntries = data.cashbook.filter(c => c.reference_id === inv.id || c.description.includes(inv.invoice_no));
        for (const cb of cbEntries) await supabase.from('cashbook').delete().eq('id', cb.id);
        if (inv.portal_id && inv.refund_company > 0) {
          const portal = data.portals.find(p => p.id === inv.portal_id);
          if (portal) { const nb = (portal.current_balance || 0) - (inv.refund_company || 0); await supabase.from('portals').update({ current_balance: nb }).eq('id', inv.portal_id); }
        }
        if (inv.linked_inv_id) {
          const { data: origInv } = await supabase.from('invoices').select('id, due_amount').eq('invoice_no', inv.linked_inv_id).single();
          if (origInv) await supabase.from('invoices').update({ status: origInv.due_amount > 0 ? 'Unpaid' : 'Paid' }).eq('id', origInv.id);
        }
        await supabase.from('invoices').delete().eq('id', inv.id);
        setData(prev => ({ ...prev, invoices: prev.invoices.filter(i => i.id !== inv.id), cashbook: prev.cashbook.filter(c => !cbEntries.find(cb => cb.id === c.id)), customers: prev.customers.map(c => c.id === inv.customer_id ? { ...c, store_credit: (c.store_credit || 0) - (inv.refund_customer || 0) } : c), portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: (p.current_balance || 0) - (inv.refund_company || 0) } : p) }));
        showToast('Refund Deleted & Original Restored!'); return;
      }
      if (inv.used_credit > 0 && inv.customer_id) {
        const cust = data.customers.find(c => c.id === inv.customer_id);
        if (cust) { const nc = (cust.store_credit || 0) + (inv.used_credit || 0); await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id); }
      }
      const portal = data.portals.find(p => p.id === inv.portal_id);
      if (portal) { const nb = (portal.current_balance || 0) + (inv.total_cost || 0); await supabase.from('portals').update({ current_balance: nb }).eq('id', portal.id); }
      const cbEntries = data.cashbook.filter(c => c.reference_id === inv.id || c.description.includes('Payment for ' + inv.invoice_no));
      for (const cb of cbEntries) await supabase.from('cashbook').delete().eq('id', cb.id);
      await supabase.from('invoices').delete().eq('id', inv.id);
      setData(prev => ({ ...prev, invoices: prev.invoices.filter(i => i.id !== inv.id), portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: (p.current_balance || 0) + (inv.total_cost || 0) } : p), cashbook: prev.cashbook.filter(c => !cbEntries.find(cb => cb.id === c.id)), customers: prev.customers.map(c => c.id === inv.customer_id ? { ...c, store_credit: (c.store_credit || 0) + (inv.used_credit || 0) } : c) }));
      showToast('Invoice Deleted & Balances Reversed!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== EDIT HANDLERS =====================
  const handleEditCust = (c) => { setEditCustId(c.id); setCustForm({ name: c.name, phone: c.phone || '', store_credit: c.store_credit || 0 }); };
  const handleEditCorp = (c) => { setEditCorpId(c.id); setCorpForm({ name: c.name, vat_no: c.vat_no || '', phone: c.phone || '', address: c.address || '' }); };
  const handleEditCred = (c) => { setEditCredId(c.id); setCreditorForm({ name: c.name, phone: c.phone || '', address: c.address || '' }); };
  const handleEditVend = (c) => { setEditVendId(c.id); setVendorForm({ name: c.name, phone: c.phone || '', balance: c.balance || 0 }); };
  const handleEditPkg = (c) => { setEditPkgId(c.id); setPkgForm({ name: c.name, price: c.price, desc: c.description || '', duration: c.duration || '', inclusions: c.inclusions || '' }); };
  const handleEditBrn = (c) => { setEditBrnId(c.id); setBrnForm({ name: c.name, location: c.location || '', phone: c.phone || '', manager: c.manager || '', email: c.email || '', timing: c.timing || '', status: c.status || 'Active' }); };
  const handleEditEmp = (c) => { setEditEmpId(c.id); setEmpForm({ name: c.name, role: c.role, salary: c.salary || 0, phone: c.phone || '', commission_rate: c.commission_rate || 0, iqama_no: c.iqama_no || '', iqama_expiry: c.iqama_expiry || '' }); };
  const handleEditSrv = (c) => { setEditSrvId(c.id); setSrvForm({ name: c.name }); };

  // ===================== EXPENSE ITEMS =====================
  const handleAddExpItem = () => setExpForm(prev => ({ ...prev, items: [...prev.items, { name: '', qty: 1, price: 0 }] }));
  const handleRemoveExpItem = (index) => setExpForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  const handleExpItemChange = (index, field, value) => {
    setExpForm(prev => { const items = [...prev.items]; items[index] = { ...items[index], [field]: value }; return { ...prev, items }; });
  };

  const handleEditExpense = (exp) => {
    setEditExpId(exp.id); setExpForm({ vendor_name: exp.vendor_name, vendor_vat: exp.vendor_vat || '', expense_date: exp.expense_date, expense_type: exp.expense_type, payment_mode: exp.payment_mode, items: exp.items || [{ name: exp.item_name, qty: 1, price: exp.amount }], taxRate: exp.vat > 0 ? '15' : '0', desc: exp.description || '' });
  };

  const handleDeleteExpense = async (exp) => {
    if (!confirm('Delete this expense?')) return;
    try {
      const cbEntries = data.cashbook.filter(c => c.reference_id === exp.id || c.description.includes(exp.invoice_no));
      for (const cb of cbEntries) await supabase.from('cashbook').delete().eq('id', cb.id);
      await supabase.from('expenses').delete().eq('id', exp.id);
      setData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== exp.id), cashbook: prev.cashbook.filter(c => !cbEntries.find(cb => cb.id === c.id)) }));
      showToast('Expense Deleted!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handlePreviewExpense = (exp) => { setPreviewHTML(getExpenseHTML(exp, data.settings, lang)); setModal({ type: 'preview', data: exp }); };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const subTotal = expForm.items.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);
      const vat = subTotal * ((parseFloat(expForm.taxRate) || 0) / 100);
      const totalAmount = subTotal + vat;
      if (editExpId) {
        const oldExp = data.expenses.find(ex => ex.id === editExpId);
        const oldCbs = data.cashbook.filter(c => c.reference_id === editExpId || c.description.includes(oldExp.invoice_no));
        for (const cb of oldCbs) await supabase.from('cashbook').delete().eq('id', cb.id);
        const { data: upExp, error: expErr } = await supabase.from('expenses').update({ vendor_name: expForm.vendor_name, vendor_vat: expForm.vendor_vat, expense_date: expForm.expense_date, expense_type: expForm.expense_type, item_name: expForm.items.map(i => i.name).join(', '), items: expForm.items, amount: totalAmount, description: expForm.desc, payment_mode: expForm.payment_mode }).eq('id', editExpId).select().single();
        if (expErr) throw expErr;
        const cbType = expForm.payment_mode === 'Cash' ? 'Cash-Out' : (expForm.payment_mode === 'Bank Transfer' || expForm.payment_mode === 'Card / Network' ? 'Bank-Out' : 'Investor-Out');
        const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: expForm.expense_date || today, type: cbType, description: `Expense: ${expForm.vendor_name} (${oldExp.invoice_no})`, amount: totalAmount, tenant_id: userProfile.tenant_id, reference_id: editExpId }]).select().single();
        if (cbErr) throw cbErr;
        setData(prev => ({ ...prev, expenses: prev.expenses.map(ex => ex.id === editExpId ? upExp : ex), cashbook: nC ? [nC, ...prev.cashbook.filter(c => !oldCbs.find(ob => ob.id === c.id))] : prev.cashbook }));
        showToast('Expense Updated!'); setEditExpId(null);
      } else {
        const expNo = `EXP-${Date.now()}`;
        const { data: newExp, error: expErr } = await supabase.from('expenses').insert([{ invoice_no: expNo, vendor_name: expForm.vendor_name, vendor_vat: expForm.vendor_vat, expense_date: expForm.expense_date, expense_type: expForm.expense_type, item_name: expForm.items.map(i => i.name).join(', '), items: expForm.items, amount: totalAmount, description: expForm.desc, payment_mode: expForm.payment_mode, approval_status: userProfile.is_admin ? 'Approved' : 'Pending', tenant_id: userProfile.tenant_id }]).select().single();
        if (expErr) throw expErr;
        let newCashEntry = null;
        if (userProfile.is_admin) {
          const cbType = expForm.payment_mode === 'Cash' ? 'Cash-Out' : (expForm.payment_mode === 'Bank Transfer' || expForm.payment_mode === 'Card / Network' ? 'Bank-Out' : 'Investor-Out');
          const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: expForm.expense_date || today, type: cbType, description: `Expense: ${expForm.vendor_name} (${expNo})`, amount: totalAmount, tenant_id: userProfile.tenant_id, reference_id: newExp.id }]).select().single();
          if (cbErr) throw cbErr; newCashEntry = nC;
        }
        setData(prev => ({ ...prev, expenses: [newExp, ...prev.expenses], cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook }));
        showToast(userProfile.is_admin ? 'Expense Added!' : 'Expense Submitted for Approval!');
      }
      setExpForm({ vendor_name: '', vendor_vat: '', expense_date: today, expense_type: 'Office Supplies', payment_mode: 'Cash', items: [{ name: '', qty: 1, price: 0 }], taxRate: '15', desc: '' });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== CUSTOMERS =====================
  const handleAddEditCust = async (e) => { 
    e.preventDefault(); 
    const pl = { name: custForm.name, phone: custForm.phone, store_credit: parseFloat(custForm.store_credit) || 0, tenant_id: userProfile.tenant_id }; 
    try { 
      if (editCustId) { const { data: up, error } = await supabase.from('customers').update(pl).eq('id', editCustId).select().single(); if (error) throw error; setData(prev => ({...prev, customers: prev.customers.map(c => c.id === editCustId ? up : c)})); showToast('Updated!'); setEditCustId(null); }
      else { const exists = data.customers.find(c => c.name.toLowerCase() === pl.name.toLowerCase() && c.phone === pl.phone); if (exists) throw new Error('Customer already exists!'); const { data: nItem, error } = await supabase.from('customers').insert([{...pl, type: 'Individual'}]).select().single(); if (error) throw error; setData(prev => ({...prev, customers: [...prev.customers, nItem]})); showToast('Added!'); }
      setCustForm({ name: '', phone: '', store_credit: 0 }); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== CORPORATES =====================
  const handleAddEditCorp = async (e) => { 
    e.preventDefault(); const pl = { ...corpForm, tenant_id: userProfile.tenant_id }; 
    try { 
      if (editCorpId) { const { data: up, error } = await supabase.from('corporates').update(pl).eq('id', editCorpId).select().single(); if (error) throw error; setData(prev => ({...prev, corporates: prev.corporates.map(c => c.id === editCorpId ? up : c)})); showToast('Updated!'); setEditCorpId(null); }
      else { const { data: nItem, error } = await supabase.from('corporates').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, corporates: [...prev.corporates, nItem]})); showToast('Added!'); }
      setCorpForm({ name: '', vat_no: '', phone: '', address: '' }); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== CREDITORS =====================
  const handleAddEditCred = async (e) => { 
    e.preventDefault(); const pl = { ...creditorForm, tenant_id: userProfile.tenant_id }; 
    try { 
      if (editCredId) { const { data: up, error } = await supabase.from('creditors').update(pl).eq('id', editCredId).select().single(); if (error) throw error; setData(prev => ({...prev, creditors: prev.creditors.map(c => c.id === editCredId ? up : c)})); showToast('Updated!'); setEditCredId(null); }
      else { const { data: nItem, error } = await supabase.from('creditors').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, creditors: [...prev.creditors, nItem]})); showToast('Added!'); }
      setCreditorForm({ name: '', phone: '', address: '' }); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== VENDORS =====================
  const handleAddEditVend = async (e) => { 
    e.preventDefault(); const pl = { ...vendorForm, balance: parseFloat(vendorForm.balance) || 0, tenant_id: userProfile.tenant_id }; 
    try { 
      if (editVendId) { const { data: up, error } = await supabase.from('vendors').update(pl).eq('id', editVendId).select().single(); if (error) throw error; setData(prev => ({...prev, vendors: prev.vendors.map(c => c.id === editVendId ? up : c)})); showToast('Updated!'); setEditVendId(null); }
      else { const { data: nItem, error } = await supabase.from('vendors').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, vendors: [...prev.vendors, nItem]})); showToast('Added!'); }
      setVendorForm({ name: '', phone: '', balance: 0 }); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== PACKAGES =====================
  const handleAddEditPkg = async (e) => { 
    e.preventDefault(); const pl = { name: pkgForm.name, price: parseFloat(pkgForm.price) || 0, description: pkgForm.desc, duration: pkgForm.duration, inclusions: pkgForm.inclusions, tenant_id: userProfile.tenant_id }; 
    try { 
      if (editPkgId) { const { data: up, error } = await supabase.from('packages').update(pl).eq('id', editPkgId).select().single(); if (error) throw error; setData(prev => ({...prev, packages: prev.packages.map(c => c.id === editPkgId ? up : c)})); showToast('Updated!'); setEditPkgId(null); }
      else { const { data: nItem, error } = await supabase.from('packages').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, packages: [...prev.packages, nItem]})); showToast('Added!'); }
      setPkgForm({ name: '', price: '', desc: '', duration: '', inclusions: '' }); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== BRANCHES =====================
  const handleAddEditBrn = async (e) => { 
    e.preventDefault(); const pl = { ...brnForm, tenant_id: userProfile.tenant_id }; 
    try { 
      if (editBrnId) { const { data: up, error } = await supabase.from('branches').update(pl).eq('id', editBrnId).select().single(); if (error) throw error; setData(prev => ({...prev, branches: prev.branches.map(c => c.id === editBrnId ? up : c)})); showToast('Updated!'); setEditBrnId(null); }
      else { const { data: nItem, error } = await supabase.from('branches').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, branches: [...prev.branches, nItem]})); showToast('Added!'); }
      setBrnForm({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' }); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== EMPLOYEES =====================
  const handleAddEditEmp = async (e) => { 
    e.preventDefault(); 
    const pl = { name: empForm.name, role: empForm.role, salary: parseFloat(empForm.salary) || 0, phone: empForm.phone, commission_rate: parseFloat(empForm.commission_rate) || 0, iqama_no: empForm.iqama_no || null, iqama_expiry: empForm.iqama_expiry || null, tenant_id: userProfile.tenant_id }; 
    try { 
      if (editEmpId) { const { data: up, error } = await supabase.from('employees').update(pl).eq('id', editEmpId).select().single(); if (error) throw error; setData(prev => ({...prev, employees: prev.employees.map(c => c.id === editEmpId ? up : c)})); showToast('Updated!'); setEditEmpId(null); }
      else { const { data: nItem, error } = await supabase.from('employees').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, employees: [nItem, ...prev.employees]})); showToast('Added!'); }
      setEmpForm({ name: '', role: 'Sales', salary: 0, phone: '', commission_rate: 0, iqama_no: '', iqama_expiry: '' }); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== SERVICES =====================
  const handleAddEditSrv = async (e) => { 
    e.preventDefault(); const pl = { ...srvForm, tenant_id: userProfile.tenant_id }; 
    try { 
      if (editSrvId) { const { data: up, error } = await supabase.from('services').update(pl).eq('id', editSrvId).select().single(); if (error) throw error; setData(prev => ({...prev, services: prev.services.map(c => c.id === editSrvId ? up : c)})); showToast('Updated!'); setEditSrvId(null); }
      else { const { data: nItem, error } = await supabase.from('services').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, services: [...prev.services, nItem]})); showToast('Added!'); }
      setSrvForm({ name: '' }); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== PORTAL =====================
  const handleAddPortal = async (e) => { 
    e.preventDefault(); 
    try { 
      const { data: newItem, error } = await supabase.from('portals').insert([{ name: portalForm.name, current_balance: parseFloat(portalForm.balance) || 0, tenant_id: userProfile.tenant_id }]).select().single(); 
      if (error) throw error; setData(prev => ({ ...prev, portals: [...prev.portals, newItem] })); showToast('Portal Added!'); setPortalForm({ name: '', balance: 0 }); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== INVESTMENT =====================
  const handleAddInvestment = async (e) => { 
    e.preventDefault(); 
    try { 
      const mode = investForm.mode; const finalReason = investForm.reason === 'Other' ? investForm.otherReason : investForm.reason; 
      const { data: newInv, error: invErr } = await supabase.from('investments').insert([{ investor_name: investForm.name, amount: parseFloat(investForm.amount), invest_date: investForm.date, description: investForm.desc, payment_mode: mode, reason: finalReason, tenant_id: userProfile.tenant_id }]).select().single(); 
      if (invErr) throw invErr; 
      const cbType = mode === 'Cash' ? 'Cash-In' : 'Bank-In'; 
      const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: investForm.date, type: cbType, description: `Investment by ${investForm.name} (${finalReason})`, amount: parseFloat(investForm.amount), tenant_id: userProfile.tenant_id }]).select().single(); 
      if (cbErr) throw cbErr; 
      setData(prev => ({ ...prev, investments: [newInv, ...prev.investments], cashbook: [nC, ...prev.cashbook] })); showToast('Investor Added!'); 
      setInvestForm({ name: '', amount: '', date: today, desc: '', mode: 'Cash', reason: 'Other', otherReason: '' }); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== GENERIC DELETE =====================
  const handleDelete = async (table, id) => { 
    if (!confirm('Delete permanently?')) return; 
    try { const { error } = await supabase.from(table).delete().eq('id', id); if (error) throw error; setData(prev => ({ ...prev, [table]: prev[table].filter(item => item.id !== id) })); showToast('Deleted!'); } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== EXPORT EXCEL =====================
  const exportToExcel = (data, filename) => {
    try {
      if (!data || data.length === 0) return showToast('No data to export');
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
          let val = row[header];
          if (typeof val === 'string' && val.includes(',')) val = `"${val}"`;
          return val;
        }).join(','))
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Exported Successfully!');
    } catch (err) { showToast('Export Error: ' + err.message); }
  };

  // ===================== RECHARGE =====================
  const handleRecharge = async (e) => { 
    e.preventDefault(); 
    try { 
      const p = data.portals.find(pp => pp.id === e.target.portal.value); 
      const amount = parseFloat(e.target.amt.value); const mode = e.target.mode.value; 
      const { data: newRec, error: recErr } = await supabase.from('recharges').insert([{ portal_id: p.id, amount, recharge_date: e.target.date.value, description: e.target.desc.value, payment_mode: mode, tenant_id: userProfile.tenant_id }]).select('*, portals(name)').single(); 
      if (recErr) throw recErr; 
      const newBal = (p.current_balance || 0) + amount; 
      const { error: pErr } = await supabase.from('portals').update({ current_balance: newBal }).eq('id', p.id); 
      if (pErr) throw pErr; 
      const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out'; 
      const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ 
        trans_date: e.target.date.value, 
        type: cbType, 
        description: `Portal Recharge: ${p.name}`, 
        amount: amount, 
        tenant_id: userProfile.tenant_id, 
        reference_id: newRec.id 
      }]).select().single();
      if (cbErr) throw cbErr;
      setData(prev => ({ ...prev, recharges: [newRec, ...(prev.recharges || [])], portals: prev.portals.map(pp => pp.id === p.id ? { ...pp, current_balance: newBal } : pp), cashbook: [nC, ...prev.cashbook] }));
      showToast('Portal Recharged!'); 
    } catch (err) { showToast('Error: ' + err.message); } 
  };

  // ===================== TRANSFER =====================
  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const { from, to, amount, date } = transferForm;
      const amt = parseFloat(amount);
      if (!amt || amt <= 0) throw new Error('Invalid amount');
      
      const cbOut = { trans_date: date, type: `${from}-Out`, description: `Transfer to ${to}`, amount: amt, tenant_id: userProfile.tenant_id };
      const cbIn = { trans_date: date, type: `${to}-In`, description: `Transfer from ${from}`, amount: amt, tenant_id: userProfile.tenant_id };
      
      const { data: outRec, error: outErr } = await supabase.from('cashbook').insert([cbOut]).select().single();
      if (outErr) throw outErr;
      const { data: inRec, error: inErr } = await supabase.from('cashbook').insert([cbIn]).select().single();
      if (inErr) throw inErr;
      
      setData(prev => ({ ...prev, cashbook: [outRec, inRec, ...prev.cashbook] }));
      showToast('Transfer Successful!');
      setTransferForm({ from: 'Cash', to: 'Bank', amount: 0, date: today });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== EMPLOYEE ADVANCE =====================
  const handleAddAdvance = async (e) => {
    e.preventDefault();
    try {
      const empId = e.target.emp.value;
      const amount = parseFloat(e.target.amt.value);
      const date = e.target.date.value;
      const { data: newAdv, error } = await supabase.from('emp_advances').insert([{ 
        employee_id: empId, amount, date, status: 'Pending', tenant_id: userProfile.tenant_id 
      }]).select('*, employees(name)').single();
      if (error) throw error;
      
      const cbType = 'Cash-Out';
      const { data: nC } = await supabase.from('cashbook').insert([{ 
        trans_date: date, type: cbType, description: `Advance given to ${newAdv.employees?.name || 'Employee'}`, amount, tenant_id: userProfile.tenant_id 
      }]).select().single();
      
      setData(prev => ({ ...prev, empAdvances: [newAdv, ...(prev.empAdvances || [])], cashbook: nC ? [nC, ...prev.cashbook] : prev.cashbook }));
      showToast('Advance Given!');
      e.target.reset();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleReturnAdvance = async (adv) => {
    try {
      const { error } = await supabase.from('emp_advances').update({ status: 'Returned' }).eq('id', adv.id);
      if (error) throw error;
      
      const cbType = 'Cash-In';
      const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ 
        trans_date: today, 
        type: cbType, 
        description: `Advance Returned by ${adv.employees?.name || 'Employee'}`, 
        amount: adv.amount, 
        tenant_id: userProfile.tenant_id 
      }]).select().single();
      if (cbErr) throw cbErr;
      
      setData(prev => ({ 
        ...prev, 
        empAdvances: prev.empAdvances.map(a => a.id === adv.id ? { ...a, status: 'Returned' } : a), 
        cashbook: [nC, ...prev.cashbook] 
      }));
      showToast('Advance Returned!');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== PAY SALARY =====================
  const handlePaySalary = async (e) => {
    e.preventDefault();
    try {
      const empId = e.target.emp.value;
      const base = parseFloat(e.target.base.value) || 0;
      const comm = parseFloat(e.target.comm.value) || 0;
      const advDed = parseFloat(e.target.adv_ded.value) || 0;
      const gift = parseFloat(e.target.gift.value) || 0;
      const month = e.target.month.value;
      const mode = e.target.mode.value;
      const netPay = (base + comm + gift) - advDed;
      
      const { data: newPay, error } = await supabase.from('payroll').insert([{ 
        employee_id: empId, 
        base_salary: base, 
        commission: comm, 
        advance_deduction: advDed, 
        gift: gift, 
        amount: netPay, 
        month, 
        payment_mode: mode, 
        payment_date: today, 
        tenant_id: userProfile.tenant_id 
      }]).select('*, employees(name)').single();
      if (error) throw error;
      
      const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
      const { data: nC } = await supabase.from('cashbook').insert([{ 
        trans_date: today, 
        type: cbType, 
        description: `Salary Paid to ${newPay.employees?.name || 'Employee'} for ${month}`, 
        amount: netPay, 
        tenant_id: userProfile.tenant_id 
      }]).select().single();
      
      // Mark pending advances as deducted/settled
      const pendingAdvs = data.empAdvances.filter(a => a.employee_id === empId && a.status === 'Pending');
      let deductedAmount = 0;
      for (const adv of pendingAdvs) {
        if (deductedAmount + adv.amount <= advDed) {
          await supabase.from('emp_advances').update({ status: 'Deducted' }).eq('id', adv.id);
          deductedAmount += adv.amount;
        }
      }
      
      setData(prev => ({ 
        ...prev, 
        payroll: [newPay, ...(prev.payroll || [])], 
        cashbook: nC ? [nC, ...prev.cashbook] : prev.cashbook,
        empAdvances: prev.empAdvances.map(a => a.status === 'Deducted' ? { ...a, status: 'Deducted' } : a)
      }));
      showToast('Salary Paid!');
      e.target.reset();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  // ===================== USER MANAGEMENT =====================
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userForm, tenant_id: userProfile.tenant_id })
      });
      const resData = await res.json();
      if (resData.error) throw new Error(resData.error);
      fetchAll(); 
      showToast('User Added!');
      setUserForm({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleEditUser = (u) => {
    setEditUserId(u.id);
    setUserForm({ email: u.email, username: u.username, role: u.role, is_admin: u.is_admin, can_access_invoices: u.can_access_invoices, can_access_bank: u.can_access_bank, can_access_hr: u.can_access_hr, can_access_reports: u.can_access_reports, can_access_settings: u.can_access_settings });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('app_users').update({
        username: userForm.username, role: userForm.role, is_admin: userForm.is_admin, 
        can_access_invoices: userForm.can_access_invoices, can_access_bank: userForm.can_access_bank, 
        can_access_hr: userForm.can_access_hr, can_access_reports: userForm.can_access_reports, 
        can_access_settings: userForm.can_access_settings
      }).eq('id', editUserId);
      if (error) throw error;
      fetchAll();
      showToast('User Updated!');
      setEditUserId(null);
      setUserForm({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false });
    } catch (err) { showToast('Error: ' + err.message); }
  };

  return {
    handleLogout, handleChangePassword, handleSendMessage, handleAddCustomField, handleRemoveCustomField, handleCustomFieldChange,
    handleProfilePicUpload, handleSaveProfile, handleLogoUpload, handleSaveSettings, handleAddTenant, handleToggleSubscription, handleDeleteTenant,
    downloadPDF, handleDownloadPDF, printInvoice, shareWhatsApp, shareEmail, handleGenerateContract, handleGenerateOffer,
    openPreview, openRefundModal, openSettleModal, handleQuickSettle, handleSettlePayment, handleRefund, handleAddMistake, handleGenerateSlip,
    handleEditInvoice, handleCreateInvoice, handleDeleteInvoice, handleEditCust, handleEditCorp, handleEditCred, handleEditVend, handleEditPkg, handleEditBrn, handleEditEmp, handleEditSrv,
    handleAddExpItem, handleRemoveExpItem, handleExpItemChange, handleEditExpense, handleDeleteExpense, handlePreviewExpense, handleAddExpense,
    handleAddEditCust, handleAddEditCorp, handleAddEditCred, handleAddEditVend, handleAddEditPkg, handleAddEditBrn, handleAddEditEmp, handleAddEditSrv,
    handleAddPortal, handleAddInvestment, handleDelete, exportToExcel, handleRecharge, handleTransfer, handleAddAdvance, handleReturnAdvance, handlePaySalary,
    handleAddUser, handleEditUser, handleUpdateUser
  };
}
