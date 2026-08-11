import { supabase } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function useERPActions(state) {
  const { user, data, setData, userProfile, showToast, logAction, fetchAll, invForm, setInvForm, expForm, setExpForm, corpForm, setCorpForm, creditorForm, setCreditorForm, custForm, setCustForm, vendorForm, setVendorForm, pkgForm, setPkgForm, brnForm, setBrnForm, empForm, setEmpForm, srvForm, setSrvForm, investForm, setInvestForm, settleForm, setSettleForm, refundForm, setRefundForm, transferForm, setTransferForm, setForm, setSetForm, userForm, setUserForm, portalForm, setPortalForm, editInvId, setEditInvId, editExpId, setEditExpId, editCorpId, setEditCorpId, editCredId, setEditCredId, editCustId, setEditCustId, editVendId, setEditVendId, editPkgId, setEditPkgId, editBrnId, setEditBrnId, editEmpId, setEditEmpId, editSrvId, setEditSrvId, editUserId, setEditUserId, modal, setModal, passForm, setPassForm, chatInput, setChatInput, chatMessages, setChatMessages, previewHTML, setPreviewHTML, getInvoiceHTML, getExpenseHTML, getContractHTML, today, router, contractCorpName, contractType, contractMarkup, contractTerms, tenantForm, setTenantForm } = state;

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
  
  const handleSendMessage = () => { 
    if (!chatInput.trim()) return; 
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]); 
    setChatInput(''); 
    setTimeout(() => { setChatMessages(prev => [...prev, { sender: 'bot', text: "I can help with Invoices. (يمكنني المساعدة في الفواتير)" }]); }, 600); 
  };

  // Custom Field Handlers
  const handleAddCustomField = () => setSetForm(prev => ({ ...prev, custom_fields: [...(prev.custom_fields || []), { key: '', value: '' }] }));
  const handleRemoveCustomField = (index) => setSetForm(prev => ({ ...prev, custom_fields: prev.custom_fields.filter((_, i) => i !== index) }));
  const handleCustomFieldChange = (index, type, value) => setSetForm(prev => {
    const cf = [...prev.custom_fields];
    cf[index][type] = value;
    return { ...prev, custom_fields: cf };
  });

  // SaaS SuperAdmin Actions
  const handleAddTenant = async (e) => {
    e.preventDefault();
    try {
      const tempPass = Math.random().toString(36).slice(-8) + 'A1!';
      const res = await fetch('/api/create-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tenantForm, temp_password: tempPass })
      });
      const resData = await res.json();
      if (resData.error) throw new Error(resData.error);
      showToast(`✅ Agency Created! Email: ${tenantForm.owner_email} | Pass: ${tempPass}`);
      setTenantForm({ agency_name: '', owner_email: '', subscription_end_date: '' });
      fetchAll();
    } catch (err) { 
      showToast('Error: ' + err.message); 
    }
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

  const downloadPDF = async (htmlContent, filename = 'document.pdf') => {
    try {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = '-9999px';
      div.style.top = '0';
      div.innerHTML = htmlContent;
      document.body.appendChild(div);
      
      const images = div.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => img.onload = img.onerror = res);
      }));

      const canvas = await html2canvas(div, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; 
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(filename);
      document.body.removeChild(div);
      showToast('PDF Downloaded!');
    } catch (err) {
      showToast('PDF Error: ' + err.message);
    }
  };

  const handleGenerateContract = (e) => {
    e.preventDefault();
    if (!contractCorpName) return showToast('Enter Corporate Name');
    const s = data.settings;
    const html = getContractHTML(s, contractCorpName, today, false, contractType, contractMarkup, contractTerms);
    setPreviewHTML(html);
    setModal({ type: 'preview', data: null });
  };

  const handleGenerateOffer = (e) => {
    e.preventDefault();
    if (!contractCorpName) return showToast('Enter Corporate Name');
    const s = data.settings;
    const html = getContractHTML(s, contractCorpName, today, true, contractType, contractMarkup, contractTerms);
    setPreviewHTML(html);
    setModal({ type: 'preview', data: null });
  };

  const handleEditInvoice = (inv) => {
    setEditInvId(inv.id);
    setInvForm({
      custType: inv.customer_id ? 'Individual' : 'Corporate',
      custId: inv.customer_id || 'new',
      corpId: inv.corporate_id || 'new',
      portalId: inv.portal_id,
      service: inv.service_type,
      flightType: inv.flight_type || 'Domestic',
      flightJourney: inv.flight_journey || 'Single',
      refundable: inv.refundable_status || 'Refundable',
      bookingType: inv.booking_type || 'New Booking',
      linkedInvId: inv.linked_inv_id || '',
      flightSector: inv.flight_sector || '',
      airline: inv.airline || '',
      pnr: inv.pnr || '',
      ticketNo: inv.ticket_no || '',
      qty: inv.qty || 1,
      cost: (inv.total_cost || 0) / (inv.qty || 1),
      sell: ((inv.total_sell || 0) + (inv.discount || 0)) / (inv.qty || 1),
      discount: inv.discount || 0,
      taxRate: inv.vat > 0 ? '15' : '0',
      payment: inv.payment_method,
      paid: (inv.paid_amount || 0) - (inv.used_credit || 0),
      useCredit: inv.used_credit || 0,
      invoiceDate: inv.invoice_date || today,
      employeeId: inv.employee_id || '',
      passengers: inv.passenger_names ? inv.passenger_names.split('\n') : ['']
    });
    state.setPage('create');
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      if (invForm.custType === 'Individual' && invForm.custId === 'new' && invForm.custName) {
        const exists = data.customers.find(c => c.name.toLowerCase() === invForm.custName.toLowerCase() && c.phone === invForm.custPhone);
        if (exists) throw new Error('Customer already exists! Please select from the dropdown.');
      }
      if (invForm.custType === 'Individual' && invForm.custId !== 'new' && !invForm.custId) throw new Error("Please select a valid Customer.");
      if (invForm.custType === 'Corporate' && invForm.corpId !== 'new' && !invForm.corpId) throw new Error("Please select a valid Corporate.");

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
      
      if (invForm.payment === 'Credit Balance' && invForm.creditCustId) {
        cid = invForm.creditCustId;
        const cust = data.customers.find(c => c.id === cid);
        if (cust) {
          const newCredit = (cust.store_credit || 0) - usedCredit;
          const { error: credErr } = await supabase.from('customers').update({ store_credit: newCredit }).eq('id', cust.id);
          if (credErr) throw new Error('Credit update failed: ' + credErr.message);
          setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: newCredit } : c) }));
        }
      } else {
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
      }
      
      const portal = data.portals.find(p => p.id === invForm.portalId); 
      if (!portal) throw new Error("Please select a Portal");
      
      let desc = invForm.service === 'Flight Ticket' ? `${invForm.airline} - ${invForm.flightSector}` : invForm.service; 
      const passengerNames = invForm.passengers.filter(p => p).join('\n');
      
      const payload = { 
        customer_id: cid, corporate_id: corpId, portal_id: portal.id, employee_id: invForm.employeeId || null, 
        booking_date: invForm.bookingDate, invoice_date: invForm.invoiceDate, service_type: invForm.service, 
        flight_type: invForm.flightType, flight_journey: invForm.flightJourney, refundable_status: invForm.refundable,
        booking_type: invForm.bookingType, linked_inv_id: invForm.linkedInvId || null,
        pnr: invForm.pnr, ticket_no: invForm.ticketNo, sector: desc, qty: qty, 
        discount: discount, passenger_names: passengerNames || null, airline: invForm.airline || null, 
        flight_sector: invForm.flightSector || null, total_cost: cost, total_sell: sell, profit, vat, total, 
        paid_amount: totalPaid, used_credit: usedCredit, due_amount: due, payment_method: invForm.payment, 
        credit_due_date: due > 0 && invForm.payment === 'Credit' ? invForm.creditDueDate : null, 
        creditor_id: invForm.payment === 'Credit' ? (invForm.creditorId || null) : null, 
        tabby_order_no: invForm.payment === 'Tabby' ? invForm.tabbyNo : null, 
        tamara_order_no: invForm.payment === 'Tamara' ? invForm.tamaraNo : null, 
        ticket_status: invForm.ticketStatus,
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
        const { error: pErr } = await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', portal.id); 
        if (pErr) console.error("Portal update failed:", pErr.message);
        
        await logAction(`Created Invoice ${invNo}`);
        let newCashEntry = null; 
        if (cashPaid > 0 && invForm.payment !== 'Credit' && invForm.payment !== 'Credit Balance') { 
          const cbType = invForm.payment === 'Cash' ? 'Cash-In' : (invForm.payment === 'Bank Transfer' ? 'Bank-In' : null); 
          if (cbType) { 
            const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: invForm.invoiceDate, type: cbType, description: `Payment for ${invNo}`, amount: cashPaid, tenant_id: userProfile.tenant_id }]).select().single(); 
            if (cbErr) console.error("Cashbook entry failed:", cbErr.message);
            newCashEntry = nC; 
          } 
        }
        setData(prev => ({ ...prev, invoices: [newInv, ...prev.invoices], portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: newPortalBal } : p), cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook }));
        showToast('Invoice Generated!');
      }
      
      setInvForm({ custType: 'Individual', custId: 'new', custName: '', custPhone: '', corpId: 'new', corpName: '', corpVat: '', corpPhone: '', corpAddress: '', passengers: [''], employeeId: '', portalId: data.portals[0]?.id || '', bookingDate: today, invoiceDate: today, bookingType: 'New Booking', linkedInvId: '', service: 'Flight Ticket', flightType: 'Domestic', flightJourney: 'Single', refundable: 'Refundable', flightSector: '', airline: '', destination: '', hotelName: '', checkIn: '', checkOut: '', visaType: 'Tourist', serviceName: '', pnr: '', ticketNo: '', qty: 1, cost: 0, sell: 0, discount: 0, taxRate: '15', payment: 'Cash', paid: '', creditDueDate: '', creditorId: '', tabbyNo: '', tamaraNo: '', ticketStatus: 'Confirmed', useCredit: 0, creditCustId: '' }); 
      state.setPage('list');
    } catch (err) { 
      showToast('Error: ' + err.message); 
    }
  };

  const handleDeleteInvoice = async (inv) => {
    if (!confirm('Delete this invoice permanently? This will reverse the portal balance.')) return;
    const portal = data.portals.find(p => p.id === inv.portal_id);
    if (portal) {
      const newBal = (portal.current_balance || 0) + (inv.total_cost || 0);
      await supabase.from('portals').update({ current_balance: newBal }).eq('id', portal.id);
    }
    await supabase.from('invoices').delete().eq('id', inv.id);
    setData(prev => ({ ...prev, invoices: prev.invoices.filter(i => i.id !== inv.id), portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: (p.current_balance || 0) + (inv.total_cost || 0) } : p) }));
    showToast('Invoice Deleted & Portal Balance Reversed!');
  };

  const handleAddExpItem = () => setExpForm(prev => ({ ...prev, items: [...prev.items, { name: '', qty: 1, price: 0 }] }));
  const handleRemoveExpItem = (index) => setExpForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  const handleExpItemChange = (index, field, value) => {
    setExpForm(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const handleEditExpense = (exp) => {
    setEditExpId(exp.id);
    setExpForm({
      vendor_name: exp.vendor_name,
      vendor_vat: exp.vendor_vat || '',
      expense_date: exp.expense_date,
      expense_type: exp.expense_type,
      payment_mode: exp.payment_mode,
      items: exp.items || [{ name: exp.item_name, qty: 1, price: exp.amount }],
      taxRate: exp.vat > 0 ? '15' : '0',
      desc: exp.description || ''
    });
  };

  const handleDeleteExpense = async (exp) => {
    if (!confirm('Delete this expense? This will reverse the accounting entry.')) return;
    try {
      const cbEntry = data.cashbook.find(c => c.description.includes(exp.invoice_no));
      if (cbEntry) await supabase.from('cashbook').delete().eq('id', cbEntry.id);
      
      await supabase.from('expenses').delete().eq('id', exp.id);
      setData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== exp.id), cashbook: prev.cashbook.filter(c => c.id !== cbEntry?.id) }));
      showToast('Expense Deleted & Accounts Reversed!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handlePreviewExpense = (exp) => {
    const s = data.settings;
    const html = getExpenseHTML(exp, s);
    setPreviewHTML(html);
    setModal({ type: 'preview', data: exp });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const subTotal = expForm.items.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);
      const taxRate = parseFloat(expForm.taxRate) || 0;
      const vat = subTotal * (taxRate / 100);
      const totalAmount = subTotal + vat;

      if (editExpId) {
        const oldExp = data.expenses.find(e => e.id === editExpId);
        const oldCb = data.cashbook.find(c => c.description.includes(oldExp.invoice_no));
        if (oldCb) await supabase.from('cashbook').delete().eq('id', oldCb.id);

        const { data: upExp, error: expErr } = await supabase.from('expenses').update({
          vendor_name: expForm.vendor_name, vendor_vat: expForm.vendor_vat, expense_date: expForm.expense_date, expense_type: expForm.expense_type,
          item_name: expForm.items.map(i => i.name).join(', '), items: expForm.items, amount: totalAmount, description: expForm.desc, payment_mode: expForm.payment_mode
        }).eq('id', editExpId).select().single();
        if (expErr) throw expErr;

        const cbType = expForm.payment_mode === 'Cash' ? 'Cash-Out' : (expForm.payment_mode === 'Bank Transfer' ? 'Bank-Out' : 'Investor-Out');
        const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: expForm.expense_date || today, type: cbType, description: `Expense: ${expForm.vendor_name} (${oldExp.invoice_no})`, amount: totalAmount, tenant_id: userProfile.tenant_id }]).select().single();
        if (cbErr) throw cbErr;

        setData(prev => ({ ...prev, expenses: prev.expenses.map(e => e.id === editExpId ? upExp : e), cashbook: nC ? [nC, ...prev.cashbook.filter(c => c.id !== oldCb?.id)] : prev.cashbook }));
        showToast('Expense Updated!');
        setEditExpId(null);
      } else {
        const expNo = `EXP-${Date.now()}`;
        const { data: newExp, error: expErr } = await supabase.from('expenses').insert([{
          invoice_no: expNo, vendor_name: expForm.vendor_name, vendor_vat: expForm.vendor_vat, expense_date: expForm.expense_date, expense_type: expForm.expense_type,
          item_name: expForm.items.map(i => i.name).join(', '), items: expForm.items, amount: totalAmount, description: expForm.desc, payment_mode: expForm.payment_mode, tenant_id: userProfile.tenant_id
        }]).select().single();
        if (expErr) throw expErr;

        const cbType = expForm.payment_mode === 'Cash' ? 'Cash-Out' : (expForm.payment_mode === 'Bank Transfer' ? 'Bank-Out' : 'Investor-Out');
        const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: expForm.expense_date || today, type: cbType, description: `Expense: ${expForm.vendor_name} (${expNo})`, amount: totalAmount, tenant_id: userProfile.tenant_id }]).select().single();
        if (cbErr) throw cbErr;

        setData(prev => ({ ...prev, expenses: [newExp, ...prev.expenses], cashbook: [nC, ...prev.cashbook] }));
        showToast('Expense Added & Auto-Deducted!');
      }

      setExpForm({ vendor_name: '', vendor_vat: '', expense_date: today, expense_type: 'Office Supplies', payment_mode: 'Cash', items: [{ name: '', qty: 1, price: 0 }], taxRate: '15', desc: '' });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleAddEditCust = async (e) => { e.preventDefault(); const pl = { name: custForm.name, phone: custForm.phone, store_credit: parseFloat(custForm.store_credit) || 0, tenant_id: userProfile.tenant_id }; try { if (editCustId) { const { data: up, error } = await supabase.from('customers').update(pl).eq('id', editCustId).select().single(); if (error) throw error; setData(prev => ({...prev, customers: prev.customers.map(c => c.id === editCustId ? up : c)})); showToast('Updated!'); setEditCustId(null); } else { const { data: nItem, error } = await supabase.from('customers').insert([{...pl, type: 'Individual'}]).select().single(); if (error) throw error; setData(prev => ({...prev, customers: [...prev.customers, nItem]})); showToast('Added!'); } setCustForm({ name: '', phone: '', store_credit: 0 }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleAddEditCorp = async (e) => { e.preventDefault(); const pl = { ...corpForm, tenant_id: userProfile.tenant_id }; try { if (editCorpId) { const { data: up, error } = await supabase.from('corporates').update(pl).eq('id', editCorpId).select().single(); if (error) throw error; setData(prev => ({...prev, corporates: prev.corporates.map(c => c.id === editCorpId ? up : c)})); showToast('Updated!'); setEditCorpId(null); } else { const { data: nItem, error } = await supabase.from('corporates').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, corporates: [...prev.corporates, nItem]})); showToast('Added!'); } setCorpForm({ name: '', vat_no: '', phone: '', address: '' }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleAddEditCred = async (e) => { e.preventDefault(); const pl = { ...creditorForm, tenant_id: userProfile.tenant_id }; try { if (editCredId) { const { data: up, error } = await supabase.from('creditors').update(pl).eq('id', editCredId).select().single(); if (error) throw error; setData(prev => ({...prev, creditors: prev.creditors.map(c => c.id === editCredId ? up : c)})); showToast('Updated!'); setEditCredId(null); } else { const { data: nItem, error } = await supabase.from('creditors').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, creditors: [...prev.creditors, nItem]})); showToast('Added!'); } setCreditorForm({ name: '', phone: '', address: '' }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleAddEditVend = async (e) => { e.preventDefault(); const pl = { ...vendorForm, tenant_id: userProfile.tenant_id }; try { if (editVendId) { const { data: up, error } = await supabase.from('vendors').update(pl).eq('id', editVendId).select().single(); if (error) throw error; setData(prev => ({...prev, vendors: prev.vendors.map(c => c.id === editVendId ? up : c)})); showToast('Updated!'); setEditVendId(null); } else { const { data: nItem, error } = await supabase.from('vendors').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, vendors: [...prev.vendors, nItem]})); showToast('Added!'); } setVendorForm({ name: '', phone: '', balance: 0 }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleAddEditPkg = async (e) => { e.preventDefault(); const pl = { name: pkgForm.name, price: parseFloat(pkgForm.price), description: pkgForm.desc, duration: pkgForm.duration, inclusions: pkgForm.inclusions, tenant_id: userProfile.tenant_id }; try { if (editPkgId) { const { data: up, error } = await supabase.from('packages').update(pl).eq('id', editPkgId).select().single(); if (error) throw error; setData(prev => ({...prev, packages: prev.packages.map(c => c.id === editPkgId ? up : c)})); showToast('Updated!'); setEditPkgId(null); } else { const { data: nItem, error } = await supabase.from('packages').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, packages: [...prev.packages, nItem]})); showToast('Added!'); } setPkgForm({ name: '', price: '', desc: '', duration: '', inclusions: '' }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleAddEditBrn = async (e) => { e.preventDefault(); const pl = { ...brnForm, tenant_id: userProfile.tenant_id }; try { if (editBrnId) { const { data: up, error } = await supabase.from('branches').update(pl).eq('id', editBrnId).select().single(); if (error) throw error; setData(prev => ({...prev, branches: prev.branches.map(c => c.id === editBrnId ? up : c)})); showToast('Updated!'); setEditBrnId(null); } else { const { data: nItem, error } = await supabase.from('branches').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, branches: [...prev.branches, nItem]})); showToast('Added!'); } setBrnForm({ name: '', location: '', phone: '', manager: '', email: '', timing: '', status: 'Active' }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleAddEditEmp = async (e) => { e.preventDefault(); const pl = { ...empForm, tenant_id: userProfile.tenant_id }; try { if (editEmpId) { const { data: up, error } = await supabase.from('employees').update(pl).eq('id', editEmpId).select().single(); if (error) throw error; setData(prev => ({...prev, employees: prev.employees.map(c => c.id === editEmpId ? up : c)})); showToast('Updated!'); setEditEmpId(null); } else { const { data: nItem, error } = await supabase.from('employees').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, employees: [nItem, ...prev.employees]})); showToast('Added!'); } setEmpForm({ name: '', role: 'Sales', salary: 0, phone: '' }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleAddEditSrv = async (e) => { e.preventDefault(); const pl = { ...srvForm, tenant_id: userProfile.tenant_id }; try { if (editSrvId) { const { data: up, error } = await supabase.from('services').update(pl).eq('id', editSrvId).select().single(); if (error) throw error; setData(prev => ({...prev, services: prev.services.map(c => c.id === editSrvId ? up : c)})); showToast('Updated!'); setEditSrvId(null); } else { const { data: nItem, error } = await supabase.from('services').insert([pl]).select().single(); if (error) throw error; setData(prev => ({...prev, services: [...prev.services, nItem]})); showToast('Added!'); } setSrvForm({ name: '' }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleAddPortal = async (e) => { e.preventDefault(); try { const { data: newItem, error } = await supabase.from('portals').insert([{ name: portalForm.name, current_balance: parseFloat(portalForm.balance) || 0, tenant_id: userProfile.tenant_id }]).select().single(); if (error) throw error; setData(prev => ({ ...prev, portals: [...prev.portals, newItem] })); showToast('Portal Added!'); setPortalForm({ name: '', balance: 0 }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleAddInvestment = async (e) => { e.preventDefault(); try { const mode = investForm.mode; const finalReason = investForm.reason === 'Other' ? investForm.otherReason : investForm.reason; const { data: newInv, error: invErr } = await supabase.from('investments').insert([{ investor_name: investForm.name, amount: parseFloat(investForm.amount), invest_date: investForm.date, description: investForm.desc, payment_mode: mode, reason: finalReason, tenant_id: userProfile.tenant_id }]).select().single(); if (invErr) throw invErr; const cbType = mode === 'Cash' ? 'Cash-In' : 'Bank-In'; const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: investForm.date, type: cbType, description: `Investment by ${investForm.name} (${finalReason})`, amount: parseFloat(investForm.amount), tenant_id: userProfile.tenant_id }]).select().single(); if (cbErr) throw cbErr; setData(prev => ({ ...prev, investments: [newInv, ...prev.investments], cashbook: [nC, ...prev.cashbook] })); showToast('Investor Added!'); setInvestForm({ name: '', amount: '', date: today, desc: '', mode: 'Cash', reason: 'Other', otherReason: '' }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleDelete = async (table, id) => { if (!confirm('Delete permanently?')) return; try { const { error } = await supabase.from(table).delete().eq('id', id); if (error) throw error; setData(prev => ({ ...prev, [table]: prev[table].filter(item => item.id !== id) })); showToast('Deleted!'); } catch (err) { showToast('Error: ' + err.message); } };
  const handleRecharge = async (e) => { e.preventDefault(); try { const p = data.portals.find(p => p.id === e.target.portal.value); const amount = parseFloat(e.target.amt.value); const mode = e.target.mode.value; const { data: newRec, error: recErr } = await supabase.from('recharges').insert([{ portal_id: p.id, amount, recharge_date: e.target.date.value, description: e.target.desc.value, payment_mode: mode, tenant_id: userProfile.tenant_id }]).select('*, portals(name)').single(); if (recErr) throw recErr; const newBal = (p.current_balance || 0) + amount; const { error: pErr } = await supabase.from('portals').update({ current_balance: newBal }).eq('id', p.id); if (pErr) throw pErr; const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out'; const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: e.target.date.value, type: cbType, description: `Recharge for ${p.name}`, amount, tenant_id: userProfile.tenant_id }]).select().single(); if (cbErr) throw cbErr; setData(prev => ({ ...prev, recharges: [newRec, ...prev.recharges], portals: prev.portals.map(por => por.id === p.id ? { ...por, current_balance: newBal } : por), cashbook: [nC, ...prev.cashbook] })); showToast('Recharged!'); e.target.reset(); } catch (err) { showToast('Error: ' + err.message); } };
  const handleTransfer = async (e) => { e.preventDefault(); try { const amt = parseFloat(transferForm.amount); if (amt <= 0 || transferForm.from === transferForm.to) return showToast("Invalid transfer"); const entries = []; if (transferForm.from === 'Cash') entries.push({ trans_date: transferForm.date, type: 'Cash-Out', description: `Transfer to ${transferForm.to}`, amount: amt, tenant_id: userProfile.tenant_id }); if (transferForm.from === 'Bank') entries.push({ trans_date: transferForm.date, type: 'Bank-Out', description: `Transfer to ${transferForm.to}`, amount: amt, tenant_id: userProfile.tenant_id }); if (transferForm.from === 'Investor') entries.push({ trans_date: transferForm.date, type: 'Investor-Out', description: `Transfer to ${transferForm.to}`, amount: amt, tenant_id: userProfile.tenant_id }); if (transferForm.to === 'Cash') entries.push({ trans_date: transferForm.date, type: 'Cash-In', description: `Transfer from ${transferForm.from}`, amount: amt, tenant_id: userProfile.tenant_id }); if (transferForm.to === 'Bank') entries.push({ trans_date: transferForm.date, type: 'Bank-In', description: `Transfer from ${transferForm.from}`, amount: amt, tenant_id: userProfile.tenant_id }); if (transferForm.to === 'Investor') entries.push({ trans_date: transferForm.date, type: 'Investor-In', description: `Transfer from ${transferForm.from}`, amount: amt, tenant_id: userProfile.tenant_id }); const { error } = await supabase.from('cashbook').insert(entries); if (error) throw error; await fetchAll(); showToast('Fund Transferred!'); setTransferForm({ from: 'Cash', to: 'Bank', amount: '', date: today }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleAddUser = async (e) => { e.preventDefault(); try { const { data: newUser, error } = await supabase.from('app_users').insert([{ email: userForm.email, username: userForm.username, role: userForm.role, ...userForm, tenant_id: userProfile.tenant_id }]).select().single(); if (error) throw error; setData(prev => ({ ...prev, appUsers: [newUser, ...prev.appUsers] })); showToast('User Added!'); setUserForm({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleEditUser = (u) => { setEditUserId(u.id); setUserForm({ email: u.email, username: u.username, role: u.role, is_admin: u.is_admin, can_access_invoices: u.can_access_invoices, can_access_bank: u.can_access_bank, can_access_hr: u.can_access_hr, can_access_reports: u.can_access_reports, can_access_settings: u.can_access_settings }); };
  const handleUpdateUser = async (e) => { e.preventDefault(); try { const { data: upUser, error } = await supabase.from('app_users').update(userForm).eq('id', editUserId).select().single(); if (error) throw error; setData(prev => ({ ...prev, appUsers: prev.appUsers.map(u => u.id === editUserId ? upUser : u) })); showToast('User Updated!'); setEditUserId(null); setUserForm({ email: '', username: '', role: 'Sales', is_admin: false, can_access_invoices: true, can_access_bank: false, can_access_hr: false, can_access_reports: false, can_access_settings: false }); } catch (err) { showToast('Error: ' + err.message); } };
  const handlePaySalary = async (e) => { e.preventDefault(); try { const empId = e.target.emp.value; const amount = parseFloat(e.target.amt.value); const mode = e.target.mode.value; const emp = data.employees.find(em => em.id === empId); const { data: newPay, error: payErr } = await supabase.from('payroll').insert([{ employee_id: empId, amount, month: e.target.month.value, payment_mode: mode, tenant_id: userProfile.tenant_id }]).select('*, employees(name)').single(); if (payErr) throw payErr; const cbType = mode === 'Cash' ? 'Cash-Out' : 'Bank-Out'; const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Salary to ${emp.name}`, amount, tenant_id: userProfile.tenant_id }]).select().single(); if (cbErr) throw cbErr; setData(prev => ({ ...prev, payroll: [newPay, ...prev.payroll], cashbook: [nC, ...prev.cashbook] })); showToast('Salary Paid!'); e.target.reset(); } catch (err) { showToast('Error: ' + err.message); } };
  const handleSettlePayment = async (e) => { e.preventDefault(); try { const inv = data.invoices.find(i => i.id === settleForm.id); if (!inv) return; const newPaid = (inv.paid_amount || 0) + (inv.due_amount || 0); const { data: upInv, error: invErr } = await supabase.from('invoices').update({ paid_amount: newPaid, due_amount: 0, settlement_date: settleForm.date, payment_method: settleForm.mode }).eq('id', inv.id).select(`*, customers(name)`).single(); if (invErr) throw invErr; const cbType = settleForm.mode === 'Cash' ? 'Cash-In' : 'Bank-In'; const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: settleForm.date, type: cbType, description: `Settlement for ${inv.invoice_no}`, amount: inv.due_amount, tenant_id: userProfile.tenant_id }]).select().single(); if (cbErr) throw cbErr; setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i), cashbook: [nC, ...prev.cashbook] })); showToast('Payment Settled!'); setModal({ type: null, data: null }); } catch (err) { showToast('Error: ' + err.message); } };
  const handleQuickSettle = async (inv) => {
    if (!confirm(`Settle due amount ${inv.due_amount} for ${inv.invoice_no}?`)) return;
    try {
      const newPaid = (inv.paid_amount || 0) + (inv.due_amount || 0);
      const { data: upInv, error: invErr } = await supabase.from('invoices').update({ paid_amount: newPaid, due_amount: 0, settlement_date: today, payment_method: 'Cash' }).eq('id', inv.id).select(`*, customers(name)`).single();
      if (invErr) throw invErr;
      const cbType = 'Cash-In';
      const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: today, type: cbType, description: `Quick Settlement for ${inv.invoice_no}`, amount: inv.due_amount, tenant_id: userProfile.tenant_id }]).select().single();
      if (cbErr) throw cbErr;
      setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i), cashbook: [nC, ...prev.cashbook] }));
      showToast('Payment Settled Quickly!');
    } catch (err) { showToast('Error: ' + err.message); }
  };
  const handleRefund = async (e) => { e.preventDefault(); try { const inv = data.invoices.find(i => i.id === refundForm.id); if (!inv) return; const compRef = parseFloat(refundForm.compRefund) || 0; const custRef = parseFloat(refundForm.custRefund) || 0; const { data: upInv, error: invErr } = await supabase.from('invoices').update({ status: 'refunded', refund_company: compRef, refund_customer: custRef }).eq('id', inv.id).select(`*, customers(name), employees(name)`).single(); if (invErr) throw invErr; const refNo = `REF-${Date.now()}`; const { data: newRefInv, error: refErr } = await supabase.from('invoices').insert([{ invoice_no: refNo, customer_id: inv.customer_id, portal_id: inv.portal_id, booking_date: today, invoice_date: refundForm.date, service_type: inv.service_type, employee_id: inv.employee_id, airline: inv.airline, flight_sector: inv.flight_sector, pnr: inv.pnr, ticket_no: inv.ticket_no, passenger_names: inv.passenger_names, total_sell: -custRef, total: -custRef, paid_amount: -custRef, status: 'refunded', refund_company: compRef, refund_customer: custRef, refund_reason: refundForm.reason, tenant_id: userProfile.tenant_id }]).select(`*, customers(name), employees(name)`).single(); if (refErr) throw refErr; if (inv.portal_id && compRef > 0) { const portal = data.portals.find(p => p.id === inv.portal_id); const newPortalBal = (portal.current_balance || 0) + compRef; const { error: pErr } = await supabase.from('portals').update({ current_balance: newPortalBal }).eq('id', inv.portal_id); if (pErr) throw pErr; setData(prev => ({ ...prev, portals: prev.portals.map(p => p.id === inv.portal_id ? { ...p, current_balance: newPortalBal } : p) })); } let newCashEntry = null; if (custRef > 0) { if (refundForm.mode === 'Credit') { const cust = data.customers.find(c => c.id === inv.customer_id); if (cust) { const newCredit = (cust.store_credit || 0) + custRef; const { error: cErr } = await supabase.from('customers').update({ store_credit: newCredit }).eq('id', cust.id); if (cErr) throw cErr; setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: newCredit } : c) })); } } else { const cbType = refundForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out'; const { data: nC, error: cbErr } = await supabase.from('cashbook').insert([{ trans_date: refundForm.date, type: cbType, description: `Refund to customer for ${inv.invoice_no}`, amount: custRef, tenant_id: userProfile.tenant_id }]).select().single(); if (cbErr) throw cbErr; newCashEntry = nC; } } setData(prev => ({ ...prev, invoices: [newRefInv, prev.invoices.map(i => i.id === inv.id ? upInv : i)].flat(), cashbook: newCashEntry ? [newCashEntry, ...prev.cashbook] : prev.cashbook })); showToast('Refund Processed!'); setModal({ type: null, data: null }); } catch (err) { showToast('Error: ' + err.message); } };
  const openRefundModal = (inv) => { setRefundForm({ id: inv.id, date: today, compRefund: 0, custRefund: 0, mode: 'Cash', reason: '', portalId: inv.portal_id }); setModal({ type: 'refund', data: inv }); };
  const openSettleModal = (inv) => { setSettleForm({ id: inv.id, date: today, mode: 'Cash' }); setModal({ type: 'settle', data: inv }); };
  const openPreview = (inv) => { const s = data.settings; const html = getInvoiceHTML(inv, s, 'en'); setPreviewHTML(html); setModal({ type: 'preview', data: inv }); };
  const handleLogoUpload = async (e) => { try { const file = e.target.files[0]; if (!file) return; const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`; const { error } = await supabase.storage.from('logos').upload(fileName, file); if (error) throw error; const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName); setSetForm(prev => ({ ...prev, logo_url: urlData.publicUrl })); showToast('Logo Uploaded!'); } catch (err) { showToast('Error: ' + err.message); } };
  
  // FIXED handleSaveSettings using UPSERT
  const handleSaveSettings = async (e) => { 
    e.preventDefault(); 
    try { 
      // Remove id from setForm to prevent primary key conflict, we will rely on tenant_id
      const { id, ...settingsData } = setForm;
      
      const { data: upsertedData, error } = await supabase
        .from('settings')
        .upsert({ 
          ...settingsData, 
          tenant_id: userProfile.tenant_id 
        }, { onConflict: 'tenant_id' })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state with the new/updated data
      setSetForm(prev => ({ ...prev, ...upsertedData }));
      setData(prev => ({ ...prev, settings: upsertedData })); 
      showToast('Settings Saved!'); 
    } catch (err) { 
      showToast('Error: ' + err.message); 
    } 
  };

  return {
    handleLogout, handleChangePassword, handleSendMessage, handleEditInvoice, handleCreateInvoice, handleDeleteInvoice, handleAddExpItem, handleRemoveExpItem, handleExpItemChange, handleAddExpense, handleEditExpense, handleDeleteExpense, handlePreviewExpense, handleAddEditCust, handleAddEditCorp, handleAddEditCred, handleAddEditVend, handleAddEditPkg, handleAddEditBrn, handleAddEditEmp, handleAddEditSrv, handleAddPortal, handleAddInvestment, handleDelete, handleRecharge, handleTransfer, handleAddUser, handleEditUser, handleUpdateUser, handlePaySalary, handleSettlePayment, handleQuickSettle, openSettleModal, handleRefund, openRefundModal, openPreview, handleLogoUpload, handleSaveSettings, downloadPDF, handleGenerateContract, handleGenerateOffer, handleAddCustomField, handleRemoveCustomField, handleCustomFieldChange, 
    // SaaS Actions
    handleAddTenant, handleToggleSubscription, handleDeleteTenant
  };
}
