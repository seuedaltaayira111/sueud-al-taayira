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
    advForm, setAdvForm
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
    if (!passForm.newPass) return showToast(isAr ? 'أدخل كلمة مرور جديدة!' : 'Enter a new password!');
    if (passForm.newPass.length < 6) return showToast(isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل!' : 'Password must be at least 6 characters!');
    const { error } = await supabase.auth.updateUser({ password: passForm.newPass });
    if (error) return showToast('Error: ' + error.message);
    showToast(isAr ? '✅ تم تحديث كلمة المرور!' : '✅ Password Updated!');
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
        ? 'يمكنني المساعدة في الفواتير والعملاء والرحلات. جرب السؤال عنهم!'
        : "I can help with Invoices, Customers, Flights. Try asking about them!";

      const totalInv = data.invoices?.length || 0;
      const totalRev = data.invoices?.reduce((s, i) => s + (i.total || 0), 0) || 0;
      const unpaidCount = data.invoices?.filter(i => i.status === 'Unpaid').length || 0;
      const totalCustomers = data.customers?.length || 0;
      const totalExpenses = data.expenses?.reduce((s, e) => s + (e.amount || 0), 0) || 0;

      if (input.includes('invoice') || input.includes('فاتورة')) {
        reply = isAr
          ? `📄 لديك ${totalInv} فاتورة بإجمالي ${totalRev.toFixed(2)} ريال. ${unpaidCount} فاتورة غير مدفوعة.`
          : `📄 You have ${totalInv} invoices totaling ${totalRev.toFixed(2)} SAR. ${unpaidCount} unpaid.`;
      } else if (input.includes('customer') || input.includes('عميل')) {
        reply = isAr
          ? `👤 لديك ${totalCustomers} عميل مسجل.`
          : `👤 You have ${totalCustomers} registered customers.`;
      } else if (input.includes('flight') || input.includes('رحلة')) {
        const airlines = [...new Set(data.invoices?.map(i => i.airline).filter(Boolean))];
        reply = isAr
          ? `✈️ لديك رحلات مع: ${airlines.join(', ') || 'لا توجد رحلات'}.`
          : `✈️ You have flights with: ${airlines.join(', ') || 'No flights yet'}.`;
      } else if (input.includes('profit') || input.includes('ربح')) {
        const totalProfit = data.invoices?.reduce((s, i) => s + (i.profit || 0), 0) || 0;
        reply = isAr
          ? `💰 إجمالي الربح: ${totalProfit.toFixed(2)} ريال.`
          : `💰 Total profit: ${totalProfit.toFixed(2)} SAR.`;
      } else if (input.includes('help') || input.includes('مساعدة')) {
        reply = isAr
          ? '🤖 أسألني عن: فواتير, عملاء, رحلات, أرباح, مصروفات, رواتب'
          : '🤖 Ask me about: invoices, customers, flights, profit, expenses, salary';
      } else if (input.includes('hello') || input.includes('hi') || input.includes('مرحبا')) {
        reply = isAr
          ? '👋 مرحباً! أنا مساعد السفر الذكي. كيف يمكنني مساعدتك؟'
          : '👋 Hello! I\'m your Smart Travel Assistant. How can I help?';
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 400);
  };

  // ============================================================
  // PROFILE
  // ============================================================
  const handleProfilePicUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const fileName = `avatar-${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('logos').upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
      setProfileForm(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
      showToast(isAr ? '✅ تم تحميل الصورة!' : '✅ Profile Picture Uploaded!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('app_users')
        .update({
          username: profileForm.username,
          avatar_url: profileForm.avatar_url,
          phone: profileForm.phone,
          address: profileForm.address
        })
        .eq('id', userProfile.id);
      if (error) throw error;
      showToast(isAr ? '✅ تم تحديث الملف!' : '✅ Profile Updated!');
      fetchAll();
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // SETTINGS
  // ============================================================
  const handleLogoUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const fileName = `logo-${userProfile.tenant_id}-${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('logos').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
      setSetForm(prev => ({ ...prev, logo_url: urlData.publicUrl }));
      showToast(isAr ? '✅ تم تحميل الشعار!' : '✅ Logo Uploaded!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('tenant_id', userProfile.tenant_id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('settings')
          .update(setForm)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([{ tenant_id: userProfile.tenant_id, ...setForm }]);
        if (error) throw error;
      }
      showToast(isAr ? '✅ تم حفظ الإعدادات!' : '✅ Settings Saved!');
      fetchAll();
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // CUSTOM FIELDS
  // ============================================================
  const handleAddCustomField = () => {
    setSetForm(prev => ({
      ...prev,
      custom_fields: [...(prev.custom_fields || []), { key: '', value: '' }]
    }));
  };

  const handleRemoveCustomField = (i) => {
    setSetForm(prev => ({
      ...prev,
      custom_fields: prev.custom_fields.filter((_, idx) => idx !== i)
    }));
  };

  const handleCustomFieldChange = (i, type, val) => {
    setSetForm(prev => {
      const cf = [...prev.custom_fields];
      cf[i] = { ...cf[i], [type]: val };
      return { ...prev, custom_fields: cf };
    });
  };

  // ============================================================
  // GENERIC DELETE
  // ============================================================
  const handleDelete = async (table, id) => {
    if (!confirm(isAr ? 'क्या आप सुनिश्चित हैं कि आप हटाना चाहते हैं?' : 'Are you sure you want to delete?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      setData(prev => ({
        ...prev,
        [table]: Array.isArray(prev[table]) ? prev[table].filter(i => i.id !== id) : []
      }));
      showToast(isAr ? '✅ हटा दिया गया!' : '✅ Deleted!');
      await logAction(`Deleted from ${table}`);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // CUSTOMERS CRUD
  // ============================================================
  const handleEditCust = (c) => {
    setEditCustId(c.id);
    setCustForm({ name: c.name, phone: c.phone || '', store_credit: c.store_credit || 0 });
  };

  const handleAddEditCust = async (e) => {
    e.preventDefault();
    const pl = {
      name: custForm.name,
      phone: custForm.phone,
      store_credit: parseFloat(custForm.store_credit) || 0,
      tenant_id: userProfile.tenant_id
    };
    try {
      if (editCustId) {
        const { data: up, error } = await supabase
          .from('customers')
          .update(pl)
          .eq('id', editCustId)
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, customers: prev.customers.map(c => c.id === editCustId ? up : c) }));
        showToast(isAr ? '✅ अपडेट किया गया!' : '✅ Updated!');
        setEditCustId(null);
      } else {
        const { data: nItem, error } = await supabase
          .from('customers')
          .insert([pl])
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, customers: [...prev.customers, nItem] }));
        showToast(isAr ? '✅ जोड़ा गया!' : '✅ Added!');
      }
      setCustForm({ name: '', phone: '', store_credit: 0 });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // CORPORATES CRUD
  // ============================================================
  const handleEditCorp = (c) => {
    setEditCorpId(c.id);
    setCorpForm({ name: c.name, vat_no: c.vat_no || '', phone: c.phone || '', address: c.address || '' });
  };

  const handleAddEditCorp = async (e) => {
    e.preventDefault();
    const pl = { ...corpForm, tenant_id: userProfile.tenant_id };
    try {
      if (editCorpId) {
        const { data: up, error } = await supabase
          .from('corporates')
          .update(pl)
          .eq('id', editCorpId)
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, corporates: prev.corporates.map(c => c.id === editCorpId ? up : c) }));
        showToast(isAr ? '✅ अपडेट किया गया!' : '✅ Updated!');
        setEditCorpId(null);
      } else {
        const { data: nItem, error } = await supabase
          .from('corporates')
          .insert([pl])
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, corporates: [...prev.corporates, nItem] }));
        showToast(isAr ? '✅ जोड़ा गया!' : '✅ Added!');
      }
      setCorpForm({ name: '', vat_no: '', phone: '', address: '' });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // CREDITORS CRUD
  // ============================================================
  const handleEditCred = (c) => {
    setEditCredId(c.id);
    setCreditorForm({ name: c.name, phone: c.phone || '', address: c.address || '' });
  };

  const handleAddEditCred = async (e) => {
    e.preventDefault();
    const pl = { ...creditorForm, tenant_id: userProfile.tenant_id };
    try {
      if (editCredId) {
        const { data: up, error } = await supabase
          .from('creditors')
          .update(pl)
          .eq('id', editCredId)
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, creditors: prev.creditors.map(c => c.id === editCredId ? up : c) }));
        showToast(isAr ? '✅ अपडेट किया गया!' : '✅ Updated!');
        setEditCredId(null);
      } else {
        const { data: nItem, error } = await supabase
          .from('creditors')
          .insert([pl])
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, creditors: [...prev.creditors, nItem] }));
        showToast(isAr ? '✅ जोड़ा गया!' : '✅ Added!');
      }
      setCreditorForm({ name: '', phone: '', address: '' });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // VENDORS CRUD
  // ============================================================
  const handleEditVend = (c) => {
    setEditVendId(c.id);
    setVendorForm({ name: c.name, phone: c.phone || '', balance: c.balance || 0 });
  };

  const handleAddEditVend = async (e) => {
    e.preventDefault();
    const pl = {
      name: vendorForm.name,
      phone: vendorForm.phone,
      balance: parseFloat(vendorForm.balance) || 0,
      tenant_id: userProfile.tenant_id
    };
    try {
      if (editVendId) {
        const { data: up, error } = await supabase
          .from('vendors')
          .update(pl)
          .eq('id', editVendId)
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, vendors: prev.vendors.map(c => c.id === editVendId ? up : c) }));
        showToast(isAr ? '✅ अपडेट किया गया!' : '✅ Updated!');
        setEditVendId(null);
      } else {
        const { data: nItem, error } = await supabase
          .from('vendors')
          .insert([pl])
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, vendors: [...prev.vendors, nItem] }));
        showToast(isAr ? '✅ जोड़ा गया!' : '✅ Added!');
      }
      setVendorForm({ name: '', phone: '', balance: 0 });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // PACKAGES CRUD
  // ============================================================
  const handleEditPkg = (c) => {
    setEditPkgId(c.id);
    setPkgForm({
      name: c.name,
      price: c.price,
      desc: c.description || '',
      duration: c.duration || '',
      inclusions: c.inclusions || ''
    });
  };

  const handleAddEditPkg = async (e) => {
    e.preventDefault();
    const pl = {
      name: pkgForm.name,
      price: parseFloat(pkgForm.price) || 0,
      description: pkgForm.desc,
      duration: pkgForm.duration,
      inclusions: pkgForm.inclusions,
      tenant_id: userProfile.tenant_id
    };
    try {
      if (editPkgId) {
        const { data: up, error } = await supabase
          .from('packages')
          .update(pl)
          .eq('id', editPkgId)
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, packages: prev.packages.map(c => c.id === editPkgId ? up : c) }));
        showToast(isAr ? '✅ अपडेट किया गया!' : '✅ Updated!');
        setEditPkgId(null);
      } else {
        const { data: nItem, error } = await supabase
          .from('packages')
          .insert([pl])
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, packages: [...prev.packages, nItem] }));
        showToast(isAr ? '✅ जोड़ा गया!' : '✅ Added!');
      }
      setPkgForm({ name: '', price: '', desc: '', duration: '', inclusions: '' });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // BRANCHES CRUD
  // ============================================================
  const handleEditBrn = (c) => {
    setEditBrnId(c.id);
    setBrnForm({
      name: c.name,
      location: c.location || '',
      phone: c.phone || '',
      manager: c.manager || '',
      email: c.email || '',
      timing: c.timing || '',
      status: c.status || 'Active'
    });
  };

  const handleAddEditBrn = async (e) => {
    e.preventDefault();
    const pl = { ...brnForm, tenant_id: userProfile.tenant_id };
    try {
      if (editBrnId) {
        const { data: up, error } = await supabase
          .from('branches')
          .update(pl)
          .eq('id', editBrnId)
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, branches: prev.branches.map(c => c.id === editBrnId ? up : c) }));
        showToast(isAr ? '✅ अपडेट किया गया!' : '✅ Updated!');
        setEditBrnId(null);
      } else {
        const { data: nItem, error } = await supabase
          .from('branches')
          .insert([pl])
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, branches: [...prev.branches, nItem] }));
        showToast(isAr ? '✅ जोड़ा गया!' : '✅ Added!');
      }
      setBrnForm({
        name: '', location: '', phone: '', manager: '',
        email: '', timing: '', status: 'Active'
      });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // EMPLOYEES CRUD
  // ============================================================
  const handleEditEmp = (c) => {
    setEditEmpId(c.id);
    setEmpForm({
      name: c.name,
      role: c.role,
      salary: c.salary || 0,
      phone: c.phone || '',
      commission_rate: c.commission_rate || 0,
      iqama_no: c.iqama_no || '',
      iqama_expiry: c.iqama_expiry || '',
      nationality: c.nationality || '',
      job_title: c.job_title || '',
      national_id: c.national_id || '',
      join_date: c.join_date || '',
      bank_name: c.bank_name || '',
      bank_account: c.bank_account || '',
      labor_office_expiry: c.labor_office_expiry || ''
    });
  };

  const handleAddEditEmp = async (e) => {
    e.preventDefault();
    const pl = {
      ...empForm,
      salary: parseFloat(empForm.salary) || 0,
      commission_rate: parseFloat(empForm.commission_rate) || 0,
      tenant_id: userProfile.tenant_id
    };
    try {
      if (editEmpId) {
        const { data: up, error } = await supabase
          .from('employees')
          .update(pl)
          .eq('id', editEmpId)
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, employees: prev.employees.map(c => c.id === editEmpId ? up : c) }));
        showToast(isAr ? '✅ अपडेट किया गया!' : '✅ Updated!');
        setEditEmpId(null);
      } else {
        const { data: nItem, error } = await supabase
          .from('employees')
          .insert([pl])
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, employees: [...prev.employees, nItem] }));
        showToast(isAr ? '✅ जोड़ा गया!' : '✅ Added!');
      }
      setEmpForm({
        name: '', role: 'Sales', salary: 0, phone: '', commission_rate: 0,
        iqama_no: '', iqama_expiry: '', nationality: '', job_title: '',
        national_id: '', join_date: '', bank_name: '', bank_account: '',
        labor_office_expiry: ''
      });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // SERVICES CRUD
  // ============================================================
  const handleEditSrv = (c) => {
    setEditSrvId(c.id);
    setSrvForm({ name: c.name });
  };

  const handleAddEditSrv = async (e) => {
    e.preventDefault();
    const pl = { name: srvForm.name, tenant_id: userProfile.tenant_id };
    try {
      if (editSrvId) {
        const { data: up, error } = await supabase
          .from('services')
          .update(pl)
          .eq('id', editSrvId)
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, services: prev.services.map(s => s.id === editSrvId ? up : s) }));
        showToast(isAr ? '✅ अपडेट किया गया!' : '✅ Updated!');
        setEditSrvId(null);
      } else {
        const { data: nItem, error } = await supabase
          .from('services')
          .insert([pl])
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, services: [...prev.services, nItem] }));
        showToast(isAr ? '✅ जोड़ा गया!' : '✅ Added!');
      }
      setSrvForm({ name: '' });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // EXPENSES CRUD
  // ============================================================
  const handleAddExpItem = () => {
    setExpForm(prev => ({
      ...prev,
      items: [...prev.items, { name: '', qty: 1, price: 0 }]
    }));
  };

  const handleRemoveExpItem = (i) => {
    setExpForm(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== i)
    }));
  };

  const handleExpItemChange = (i, field, val) => {
    setExpForm(prev => {
      const items = [...prev.items];
      items[i] = { ...items[i], [field]: field === 'price' || field === 'qty' ? parseFloat(val) || 0 : val };
      return { ...prev, items };
    });
  };

  const handleEditExp = (exp) => {
    setEditExpId(exp.id);
    setExpForm({
      expense_type: exp.expense_type || '',
      payment_mode: exp.payment_mode || 'Cash',
      description: exp.description || '',
      expense_date: exp.expense_date || today,
      vendor_name: exp.vendor_name || '',
      taxRate: exp.tax_rate || '0',
      items: exp.items || [{ name: '', qty: 1, price: 0 }],
      approval_status: exp.approval_status || 'Approved'
    });
  };

  const handleAddEditExpense = async (e) => {
    e.preventDefault();
    try {
      const totalAmount = expForm.items.reduce((s, item) => s + ((parseFloat(item.qty) || 1) * (parseFloat(item.price) || 0)), 0);
      if (totalAmount <= 0) throw new Error(isAr ? 'कम से कम एक आइटम जोड़ें!' : 'Add at least one expense item!');

      const payload = {
        expense_date: expForm.expense_date,
        expense_type: expForm.expense_type,
        description: expForm.description,
        payment_mode: expForm.payment_mode,
        vendor_name: expForm.vendor_name,
        tax_rate: parseFloat(expForm.taxRate) || 0,
        total_amount: totalAmount,
        amount: totalAmount,
        items: expForm.items,
        approval_status: expForm.approval_status || 'Approved',
        tenant_id: userProfile.tenant_id
      };

      if (editExpId) {
        const { data: up, error } = await supabase
          .from('expenses')
          .update(payload)
          .eq('id', editExpId)
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, expenses: prev.expenses.map(ex => ex.id === editExpId ? up : ex) }));
        showToast(isAr ? '✅ अपडेट किया गया!' : '✅ Updated!');
        setEditExpId(null);
      } else {
        const { data: nExp, error } = await supabase
          .from('expenses')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;

        const cbType = expForm.payment_mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
        await supabase.from('cashbook').insert([{
          trans_date: expForm.expense_date,
          type: cbType,
          description: `Expense: ${expForm.description || expForm.expense_type}`,
          amount: totalAmount,
          tenant_id: userProfile.tenant_id,
          reference_id: nExp.id
        }]);

        setData(prev => ({
          ...prev,
          expenses: [nExp, ...prev.expenses]
        }));
        await logAction(`Expense ${totalAmount.toFixed(2)} SAR - ${expForm.description || expForm.expense_type}`);
        showToast(isAr ? '✅ जोड़ा गया!' : '✅ Added!');
      }

      setExpForm({
        expense_type: '',
        payment_mode: 'Cash',
        description: '',
        expense_date: today,
        vendor_name: '',
        taxRate: '0',
        items: [{ name: '', qty: 1, price: 0 }],
        approval_status: 'Approved'
      });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleDeleteExpense = async (exp) => {
    if (!confirm(isAr ? 'क्या आप इस खर्च को हटाना चाहते हैं?' : 'Delete this expense?')) return;
    try {
      await supabase.from('expenses').delete().eq('id', exp.id);
      setData(prev => ({
        ...prev,
        expenses: prev.expenses.filter(ex => ex.id !== exp.id)
      }));
      showToast(isAr ? '✅ हटा दिया गया!' : '✅ Deleted!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // PORTALS CRUD
  // ============================================================
  const handleAddEditPortal = async (e) => {
    e.preventDefault();
    try {
      const pl = {
        name: portalForm.name,
        portal_type: portalForm.portal_type || 'GDS',
        current_balance: parseFloat(portalForm.current_balance) || 0,
        initial_balance: parseFloat(portalForm.initial_balance) || 0,
        phone: portalForm.phone || '',
        contact_person: portalForm.contact_person || '',
        credit_limit: parseFloat(portalForm.credit_limit) || 0,
        tenant_id: userProfile.tenant_id
      };

      if (modal?.data?.id) {
        const { data: up, error } = await supabase
          .from('portals')
          .update(pl)
          .eq('id', modal.data.id)
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, portals: prev.portals.map(p => p.id === modal.data.id ? up : p) }));
        showToast(isAr ? '✅ अपडेट किया गया!' : '✅ Updated!');
      } else {
        const { data: nP, error } = await supabase
          .from('portals')
          .insert([pl])
          .select()
          .single();
        if (error) throw error;
        setData(prev => ({ ...prev, portals: [...prev.portals, nP] }));
        showToast(isAr ? '✅ जोड़ा गया!' : '✅ Added!');
      }
      setModal({ type: null, data: null });
      setPortalForm({
        name: '', portal_type: 'GDS', current_balance: 0, initial_balance: 0,
        phone: '', contact_person: '', credit_limit: 0
      });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // TRANSFER
  // ============================================================
  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const amt = parseFloat(transferForm.amount) || 0;
      if (amt <= 0) throw new Error(isAr ? 'सही राशि डालें!' : 'Enter a valid amount!');
      if (transferForm.from === transferForm.to) throw new Error(isAr ? 'दोनों एक जैसे नहीं होने चाहिए!' : 'From and To must be different!');

      const outType = (acc) => acc === 'Cash' ? 'Cash-Out' : acc === 'Bank' ? 'Bank-Out' : 'Investor-Out';
      const inType = (acc) => acc === 'Cash' ? 'Cash-In' : acc === 'Bank' ? 'Bank-In' : 'Investor-In';

      const { data: cbFrom } = await supabase.from('cashbook').insert([{
        trans_date: transferForm.date || today,
        type: outType(transferForm.from),
        description: `Transfer to ${transferForm.to}: ${transferForm.description || ''}`,
        amount: amt,
        tenant_id: userProfile.tenant_id
      }]).select().single();

      const { data: cbTo } = await supabase.from('cashbook').insert([{
        trans_date: transferForm.date || today,
        type: inType(transferForm.to),
        description: `Transfer from ${transferForm.from}: ${transferForm.description || ''}`,
        amount: amt,
        tenant_id: userProfile.tenant_id
      }]).select().single();

      setData(prev => ({
        ...prev,
        cashbook: [cbFrom, cbTo, ...prev.cashbook]
      }));

      await logAction(`Transfer ${amt.toFixed(2)} SAR: ${transferForm.from} → ${transferForm.to}`);
      showToast(isAr ? `✅ ${amt.toFixed(2)} SAR ट्रांसफर हो गया!` : `✅ Transferred ${amt.toFixed(2)} SAR!`);

      setTransferForm({ from: 'Cash', to: 'Bank', amount: '', date: today, description: '' });
      setModal({ type: null, data: null });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // INVESTMENTS
  // ============================================================
  const handleAddInvestment = async (e) => {
    e.preventDefault();
    try {
      const amount = parseFloat(investForm.amount) || 0;
      if (amount <= 0) throw new Error(isAr ? 'सही राशि डालें!' : 'Enter a valid amount');

      const finalReason = investForm.reason === 'Other' ? (investForm.otherReason || 'Other') : investForm.reason;

      const { data: newInv, error } = await supabase
        .from('investments')
        .insert([{
          investor_name: investForm.name,
          amount,
          invest_date: investForm.date || today,
          mode: investForm.mode || 'Cash',
          reason: finalReason,
          description: investForm.desc || '',
          tenant_id: userProfile.tenant_id
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);

      const cbType = investForm.mode === 'Cash' ? 'Cash-In' : 'Bank-In';
      const { data: newCb } = await supabase.from('cashbook').insert([{
        trans_date: investForm.date || today,
        type: cbType,
        description: `Investment from ${investForm.name} (${finalReason})`,
        amount,
        tenant_id: userProfile.tenant_id,
        reference_id: newInv.id
      }]).select().single();

      setData(prev => ({
        ...prev,
        investments: [newInv, ...(prev.investments || [])],
        cashbook: newCb ? [newCb, ...prev.cashbook] : prev.cashbook
      }));

      await logAction(`Investment of ${amount.toFixed(2)} SAR from ${investForm.name}`);
      showToast(isAr ? '✅ निवेश दर्ज किया गया!' : '✅ Investment recorded!');

      setInvestForm({
        name: '', amount: '', date: today, mode: 'Cash',
        reason: 'Other', otherReason: '', desc: ''
      });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // PDF DOWNLOAD - FIXED
  // ============================================================
  const downloadPDF = async (htmlContent, filename = 'document.pdf') => {
    try {
      console.log('📥 downloadPDF called, filename:', filename);

      let html2canvas, jsPDF;

      try {
        const html2canvasModule = await import('html2canvas');
        html2canvas = html2canvasModule.default || html2canvasModule;
        console.log('✅ html2canvas loaded');
      } catch (e) {
        console.error('❌ html2canvas import error:', e);
        showToast(isAr ? '⚠️ PDF जनरेटर लोड नहीं हुआ' : '⚠️ PDF generator not loaded');
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(htmlContent);
          win.document.close();
          setTimeout(() => { win.focus(); win.print(); }, 500);
        }
        return;
      }

      try {
        const jsPDFModule = await import('jspdf');
        jsPDF = jsPDFModule.default || jsPDFModule.jsPDF || jsPDFModule;
        console.log('✅ jspdf loaded');
      } catch (e) {
        console.error('❌ jspdf import error:', e);
        showToast(isAr ? '⚠️ PDF लाइब्रेरी लोड नहीं हुई' : '⚠️ PDF library not loaded');
        return;
      }

      const div = document.createElement('div');
      const A4_PX_W = 794;
      div.style.cssText = `position:absolute;left:-9999px;top:0;width:${A4_PX_W}px;background:white;padding:20px;`;

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      const imgs = doc.querySelectorAll('img[src*="api.qrserver.com"], img[src*="bwipjs-api"]');
      await Promise.all(Array.from(imgs).map(async (img) => {
        try {
          const resp = await fetch(img.src);
          const blob = await resp.blob();
          const b64 = await new Promise(r => {
            const fr = new FileReader();
            fr.onloadend = () => r(fr.result);
            fr.readAsDataURL(blob);
          });
          img.src = b64;
        } catch (e) {
          console.warn('Image fetch skipped:', e.message);
        }
      }));

      div.innerHTML = doc.body.innerHTML;
      document.body.appendChild(div);

      await new Promise(r => setTimeout(r, 300));

      const canvas = await html2canvas(div, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: A4_PX_W,
        windowHeight: Math.max(1123, div.scrollHeight),
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = 210, ph = 297, h = (canvas.height * w) / canvas.width;

      let left = h - ph, pos = 0;
      pdf.addImage(imgData, 'PNG', 0, pos, w, h);
      left -= ph;
      while (left >= 0) {
        pos = left - h;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, pos, w, h);
        left -= ph;
      }

      pdf.save(filename);
      document.body.removeChild(div);
      showToast(isAr ? '✅ PDF डाउनलोड हो गया!' : '✅ PDF Downloaded!');
    } catch (err) {
      console.error('❌ PDF Error:', err);
      showToast(isAr ? '❌ PDF एरर: ' + err.message : '❌ PDF Error: ' + err.message);
      try {
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(htmlContent);
          win.document.close();
          setTimeout(() => { win.focus(); win.print(); }, 500);
        }
      } catch (e) {
        console.error('Fallback print error:', e);
      }
    }
  };

  // ============================================================
  // INVOICE DOWNLOAD - FIXED
  // ============================================================
  const handleDownloadPDF = async (inv) => {
    try {
      console.log('📥 handleDownloadPDF called for:', inv?.invoice_no);

      const s = data.settings || {};
      let html = '';

      if (inv.invoice_no?.startsWith('REF-')) {
        if (typeof getRefundHTML === 'function') {
          html = getRefundHTML(inv, s, lang);
        } else {
          showToast(isAr ? '❌ रिफंड HTML जनरेटर नहीं मिला' : '❌ Refund HTML generator not found');
          return;
        }
      } else {
        if (typeof getInvoiceHTML === 'function') {
          html = getInvoiceHTML(inv, s, lang);
        } else {
          showToast(isAr ? '❌ इनवॉइस HTML जनरेटर नहीं मिला' : '❌ Invoice HTML generator not found');
          return;
        }
      }

      if (!html) {
        showToast(isAr ? '❌ HTML जेनरेट नहीं हुआ' : '❌ HTML not generated');
        return;
      }

      await downloadPDF(html, `${inv.invoice_no}.pdf`);
    } catch (e) {
      console.error('Download error:', e);
      showToast(isAr ? '❌ डाउनलोड एरर' : '❌ Download error');
    }
  };

  // ============================================================
  // PRINT INVOICE - FIXED
  // ============================================================
  const printInvoice = (inv) => {
    try {
      console.log('🖨️ printInvoice called for:', inv?.invoice_no);

      const s = data.settings || {};
      let html = '';

      if (inv.invoice_no?.startsWith('REF-')) {
        if (typeof getRefundHTML === 'function') {
          html = getRefundHTML(inv, s, lang);
        } else {
          showToast(isAr ? '❌ रिफंड HTML जनरेटर नहीं मिला' : '❌ Refund HTML generator not found');
          return;
        }
      } else {
        if (typeof getInvoiceHTML === 'function') {
          html = getInvoiceHTML(inv, s, lang);
        } else {
          showToast(isAr ? '❌ इनवॉइस HTML जनरेटर नहीं मिला' : '❌ Invoice HTML generator not found');
          return;
        }
      }

      if (!html) {
        showToast(isAr ? '❌ HTML जेनरेट नहीं हुआ' : '❌ HTML not generated');
        return;
      }

      const win = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
      if (!win) {
        showToast(isAr ? '⚠️ पॉपअप ब्लॉक हो गया! कृपया अनुमति दें।' : '⚠️ Popup blocked! Please allow popups.');
        return;
      }

      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
      }, 1000);
    } catch (e) {
      console.error('Print error:', e);
      showToast(isAr ? '❌ प्रिंट एरर' : '❌ Print error');
    }
  };

  // ============================================================
  // OPEN PREVIEW - FIXED
  // ============================================================
  const openPreview = (inv) => {
    try {
      console.log('👁️ openPreview called for:', inv?.invoice_no);
      console.log('📄 getInvoiceHTML type:', typeof getInvoiceHTML);
      console.log('📄 getRefundHTML type:', typeof getRefundHTML);

      if (typeof getInvoiceHTML !== 'function' && typeof getRefundHTML !== 'function') {
        console.error('❌ HTML generator functions not available!');
        showToast(isAr ? '❌ प्रीव्यू फंक्शन उपलब्ध नहीं' : '❌ Preview function not available');
        return;
      }

      const s = data.settings || {};
      let html = '';

      if (inv.invoice_no?.startsWith('REF-')) {
        if (typeof getRefundHTML === 'function') {
          html = getRefundHTML(inv, s, lang);
        } else {
          console.error('❌ getRefundHTML is not a function');
          showToast(isAr ? '❌ रिफंड HTML जनरेटर नहीं मिला' : '❌ Refund HTML generator not found');
          return;
        }
      } else {
        if (typeof getInvoiceHTML === 'function') {
          html = getInvoiceHTML(inv, s, lang);
        } else {
          console.error('❌ getInvoiceHTML is not a function');
          showToast(isAr ? '❌ इनवॉइस HTML जनरेटर नहीं मिला' : '❌ Invoice HTML generator not found');
          return;
        }
      }

      if (!inv.invoice_no?.startsWith('REF-') && inv.linked_inv_id &&
        (inv.booking_type === 'Previous Booking' || inv.booking_type === 'Reissue')) {
        const linked = data.invoices?.find(i => i.invoice_no === inv.linked_inv_id);
        if (linked && typeof getRefundHTML === 'function') {
          html += `<div style="margin-top:30px;border-top:2px dashed #cbd5e1;padding-top:20px;">
            <h1 style="color:#7f1d1d;text-align:center;font-size:18px;margin-bottom:15px;">
              ${isAr ? 'الاسترجاع المرتبط' : 'Linked Refund'}
            </h1>
            ${getRefundHTML(linked, s, lang)}
          </div>`;
        }
      }

      if (!html) {
        showToast(isAr ? '❌ HTML जेनरेट नहीं हुआ' : '❌ HTML not generated');
        return;
      }

      console.log('✅ HTML generated, length:', html.length);
      setPreviewHTML(html);
      setModal({ type: 'preview', data: inv });
    } catch (e) {
      console.error('❌ Preview error:', e);
      showToast(isAr ? '❌ प्रीव्यू एरर: ' + e.message : '❌ Preview error: ' + e.message);
    }
  };

  // ============================================================
  // SHARE - WhatsApp & Email
  // ============================================================
  const shareWhatsApp = (inv) => {
    try {
      if (inv.invoice_no?.startsWith('REF-')) {
        return showToast(isAr ? '⚠️ रिफंड इनवॉइस WhatsApp पर शेयर नहीं हो सकती' : '⚠️ Refund invoices cannot be shared via WhatsApp');
      }
      const phone = inv.customers?.phone || '';
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const msg = `Hello ${inv.customers?.name || ''},%0A
Here is your invoice from ${data.settings?.company_name_en || 'SUEUD AL TAAYIRA'}:%0A
Invoice: ${inv.invoice_no}%0A
Total: ${(inv.total || 0).toFixed(2)} SAR%0A
Due: ${(inv.due_amount || 0).toFixed(2)} SAR`;
      const url = `https://wa.me/${cleanPhone}?text=${msg}`;
      window.open(url, '_blank');
    } catch (e) {
      console.error('WhatsApp error:', e);
      showToast(isAr ? '❌ व्हाट्सएप एरर' : '❌ WhatsApp error');
    }
  };

  const shareEmail = (inv) => {
    try {
      if (inv.invoice_no?.startsWith('REF-')) {
        return showToast(isAr ? '⚠️ रिफंड इनवॉइस Email पर शेयर नहीं हो सकती' : '⚠️ Refund invoices cannot be shared via Email');
      }
      const email = inv.customers?.email || inv.corporates?.email || '';
      const subject = `Invoice ${inv.invoice_no}`;
      const body = `Hello ${inv.customers?.name || inv.corporates?.name || ''},

Please find your invoice details below:

Invoice No: ${inv.invoice_no}
Date: ${inv.invoice_date}
Total: ${(inv.total || 0).toFixed(2)} SAR
Due: ${(inv.due_amount || 0).toFixed(2)} SAR

Thank you for choosing us!`;
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl, '_self');
    } catch (e) {
      console.error('Email error:', e);
      showToast(isAr ? '❌ ईमेल एरर' : '❌ Email error');
    }
  };

  // ============================================================
  // OPEN REFUND MODAL
  // ============================================================
  const openRefundModal = (inv) => {
    const cust = data.customers?.find(c => c.id === inv.customer_id);
    setRefundForm({
      id: inv.id,
      date: today,
      compRefund: 0,
      custRefund: inv.due_amount || inv.total || 0,
      mode: 'Cash',
      reason: '',
      portalId: inv.portal_id || '',
      creditBalance: cust?.store_credit || 0
    });
    setModal({ type: 'refund', data: inv });
  };

  // ============================================================
  // OPEN SETTLE MODAL
  // ============================================================
  const openSettleModal = (inv) => {
    setSettleForm({ id: inv.id, date: today, mode: 'Cash' });
    setModal({ type: 'settle', data: inv });
  };

  const handleQuickSettle = (inv) => openSettleModal(inv);

  // ============================================================
  // SETTLE PAYMENT
  // ============================================================
  const handleSettlePayment = async (e) => {
    e.preventDefault();
    try {
      const inv = modal.data || data.invoices?.find(i => i.id === settleForm.id);
      if (!inv) throw new Error(isAr ? 'इनवॉइस नहीं मिला' : 'Invoice not found');

      const settleAmt = inv.due_amount || 0;
      const newPaid = (inv.paid_amount || 0) + settleAmt;

      const { data: upInv, error } = await supabase
        .from('invoices')
        .update({ paid_amount: newPaid, due_amount: 0, status: 'Paid' })
        .eq('id', inv.id)
        .select('*, customers(name), corporates(name), employees(name)')
        .single();

      if (error) throw error;

      const cbType = settleForm.mode === 'Cash' ? 'Cash-In' : 'Bank-In';
      const { data: nC } = await supabase.from('cashbook').insert([{
        trans_date: settleForm.date,
        type: cbType,
        description: `Settlement for ${inv.invoice_no}`,
        amount: settleAmt,
        tenant_id: userProfile.tenant_id,
        reference_id: inv.id
      }]).select().single();

      setData(prev => ({
        ...prev,
        invoices: prev.invoices.map(i => i.id === inv.id ? upInv : i),
        cashbook: nC ? [nC, ...prev.cashbook] : prev.cashbook
      }));

      await logAction(`Settled ${settleAmt.toFixed(2)} SAR for ${inv.invoice_no}`);
      showToast(isAr ? '✅ भुगतान सेटल हो गया!' : '✅ Payment Settled!');
      setModal({ type: null, data: null });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // PROCESS REFUND
  // ============================================================
  const handleRefund = async (e) => {
    e.preventDefault();
    try {
      const origInv = modal.data;
      if (!origInv) throw new Error(isAr ? 'मूल इनवॉइस नहीं मिली' : 'Original invoice not found');

      const compRef = parseFloat(refundForm.compRefund) || 0;
      const custRef = parseFloat(refundForm.custRefund) || 0;
      const refundNo = `REF-${Date.now()}`;

      if (refundForm.mode === 'Credit' && custRef > 0 && origInv.customer_id) {
        const cust = data.customers?.find(c => c.id === origInv.customer_id);
        if (cust) {
          const nc = (cust.store_credit || 0) + custRef;
          await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id);
          setData(prev => ({
            ...prev,
            customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: nc } : c)
          }));
        }
      }

      if (compRef > 0 && refundForm.portalId) {
        const portal = data.portals?.find(p => p.id === refundForm.portalId);
        if (portal) {
          const nb = (portal.current_balance || 0) + compRef;
          await supabase.from('portals').update({ current_balance: nb }).eq('id', portal.id);
          setData(prev => ({
            ...prev,
            portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: nb } : p)
          }));
        }
      }

      const payload = {
        invoice_no: refundNo,
        customer_id: origInv.customer_id,
        corporate_id: origInv.corporate_id,
        old_customer_name: origInv.customers?.name || 'N/A',
        old_customer_phone: origInv.customers?.phone || 'N/A',
        portal_id: refundForm.portalId || origInv.portal_id,
        employee_id: origInv.employee_id || null,
        invoice_date: refundForm.date,
        refund_date: refundForm.date,
        service_type: origInv.service_type,
        sector: origInv.sector,
        flight_sector: origInv.flight_sector,
        airline: origInv.airline,
        ticket_no: origInv.ticket_no,
        pnr: origInv.pnr,
        passenger_names: origInv.passenger_names,
        flight_type: origInv.flight_type,
        flight_journey: origInv.flight_journey,
        total_cost: 0,
        total_sell: 0,
        profit: compRef - custRef,
        vat: 0,
        total: 0,
        paid_amount: 0,
        due_amount: 0,
        payment_method: refundForm.mode,
        refund_company: compRef,
        refund_customer: custRef,
        refund_reason: refundForm.reason,
        linked_inv_id: origInv.invoice_no,
        old_airline: origInv.airline,
        old_sector: origInv.flight_sector || origInv.sector,
        old_pnr: origInv.pnr,
        old_ticket_no: origInv.ticket_no,
        old_flight_type: origInv.flight_type,
        old_payment_method: origInv.payment_method,
        old_passengers: origInv.passenger_names,
        old_sell_price: origInv.total_sell || 0,
        old_booking_date: origInv.invoice_date,
        status: 'refunded',
        tenant_id: userProfile.tenant_id
      };

      const { data: newRef, error: refErr } = await supabase
        .from('invoices')
        .insert([payload])
        .select('*, customers(name), corporates(name), employees(name)')
        .single();

      if (refErr) throw new Error('Refund failed: ' + refErr.message);

      let newCb = null;
      if (custRef > 0 && refundForm.mode !== 'Credit') {
        const cbType = refundForm.mode === 'Cash' ? 'Cash-Out' : 'Bank-Out';
        const { data: nC } = await supabase.from('cashbook').insert([{
          trans_date: refundForm.date,
          type: cbType,
          description: `Refund to customer for ${refundNo}`,
          amount: custRef,
          tenant_id: userProfile.tenant_id,
          reference_id: newRef.id
        }]).select().single();
        newCb = nC;
      }

      await supabase.from('invoices').update({ status: 'refunded' }).eq('id', origInv.id);

      setData(prev => ({
        ...prev,
        invoices: [newRef, ...prev.invoices.map(i => i.id === origInv.id ? { ...i, status: 'refunded' } : i)],
        cashbook: newCb ? [newCb, ...prev.cashbook] : prev.cashbook
      }));

      await logAction(`Refund ${refundNo} for ${origInv.invoice_no} (Comp:${compRef}, Cust:${custRef})`);
      showToast(isAr ? '✅ रिफंड प्रोसेस हो गया!' : '✅ Refund Processed!');
      setModal({ type: null, data: null });
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // DELETE INVOICE
  // ============================================================
  const handleDeleteInvoice = async (inv) => {
    if (!confirm(isAr ? 'क्या आप सुनिश्चित हैं? सभी एंट्री रिवर्स हो जाएंगी।' : 'Delete permanently? All entries will be reversed.')) return;
    try {
      if (inv.invoice_no?.startsWith('REF-')) {
        if (inv.payment_method === 'Credit' && inv.refund_customer > 0 && inv.customer_id) {
          const cust = data.customers?.find(c => c.id === inv.customer_id);
          if (cust) {
            const nc = (cust.store_credit || 0) - (inv.refund_customer || 0);
            await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id);
          }
        }
        if (inv.portal_id && inv.refund_company > 0) {
          const portal = data.portals?.find(p => p.id === inv.portal_id);
          if (portal) {
            const nb = (portal.current_balance || 0) - (inv.refund_company || 0);
            await supabase.from('portals').update({ current_balance: nb }).eq('id', inv.portal_id);
          }
        }
        if (inv.linked_inv_id) {
          const { data: origInv } = await supabase
            .from('invoices')
            .select('id,due_amount')
            .eq('invoice_no', inv.linked_inv_id)
            .single();
          if (origInv) {
            await supabase.from('invoices')
              .update({ status: origInv.due_amount > 0 ? 'Unpaid' : 'Paid' })
              .eq('id', origInv.id);
          }
        }
        const cbs = data.cashbook?.filter(c => c.reference_id === inv.id || c.description?.includes(inv.invoice_no)) || [];
        for (const cb of cbs) await supabase.from('cashbook').delete().eq('id', cb.id);
        await supabase.from('invoices').delete().eq('id', inv.id);
        setData(prev => ({
          ...prev,
          invoices: prev.invoices.filter(i => i.id !== inv.id),
          cashbook: prev.cashbook.filter(c => !cbs.find(x => x.id === c.id))
        }));
        showToast(isAr ? '✅ रिफंड हटा दिया गया!' : '✅ Refund Deleted!');
        return;
      }

      if (inv.used_credit > 0 && inv.customer_id) {
        const cust = data.customers?.find(c => c.id === inv.customer_id);
        if (cust) {
          const nc = (cust.store_credit || 0) + (inv.used_credit || 0);
          await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id);
          setData(prev => ({
            ...prev,
            customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: nc } : c)
          }));
        }
      }

      const portal = data.portals?.find(p => p.id === inv.portal_id);
      if (portal) {
        const nb = (portal.current_balance || 0) + (inv.total_cost || 0);
        await supabase.from('portals').update({ current_balance: nb }).eq('id', portal.id);
      }

      const cbs = data.cashbook?.filter(c =>
        c.reference_id === inv.id ||
        c.description?.includes('Payment for ' + inv.invoice_no) ||
        c.description?.includes('Cash returned to customer for ' + inv.invoice_no) ||
        c.description?.includes('Credit Balance used for ' + inv.invoice_no)
      ) || [];

      for (const cb of cbs) await supabase.from('cashbook').delete().eq('id', cb.id);
      await supabase.from('invoices').delete().eq('id', inv.id);

      setData(prev => ({
        ...prev,
        invoices: prev.invoices.filter(i => i.id !== inv.id),
        cashbook: prev.cashbook.filter(c => !cbs.find(x => x.id === c.id))
      }));
      showToast(isAr ? '✅ इनवॉइस हटा दी गई!' : '✅ Invoice Deleted!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // EDIT INVOICE
  // ============================================================
  const handleEditInvoice = (inv) => {
    if (inv.invoice_no?.startsWith('REF-')) {
      const cust = data.customers?.find(c => c.id === inv.customer_id);
      setRefundForm({
        id: inv.id,
        date: inv.refund_date || inv.invoice_date || today,
        compRefund: inv.refund_company || 0,
        custRefund: inv.refund_customer || 0,
        mode: inv.payment_method || 'Cash',
        reason: inv.refund_reason || '',
        portalId: inv.portal_id,
        creditBalance: cust?.store_credit || 0
      });
      setModal({ type: 'refund', data: inv });
      return;
    }

    setEditInvId(inv.id);
    const custObj = inv.customer_id ? data.customers?.find(c => c.id === inv.customer_id) : null;
    const corpObj = inv.corporate_id ? data.corporates?.find(c => c.id === inv.corporate_id) : null;

    setInvForm({
      custType: inv.customer_id ? 'Individual' : 'Corporate',
      custId: inv.customer_id || 'new',
      custName: custObj?.name || '',
      custPhone: custObj?.phone || '',
      corpId: inv.corporate_id || 'new',
      corpName: corpObj?.name || '',
      corpVat: corpObj?.vat_no || '',
      corpPhone: corpObj?.phone || '',
      corpAddress: corpObj?.address || '',
      portalId: inv.portal_id,
      service: inv.service_type,
      flightType: inv.flight_type || 'Domestic',
      flightJourney: inv.flight_journey || 'Single',
      refundable: inv.refundable_status || 'Refundable',
      bookingType: inv.booking_type || 'New Booking',
      linkedInvId: inv.linked_inv_id || '',
      oldTicketNo: inv.old_ticket_no || '',
      oldPnr: inv.old_pnr || '',
      oldAirline: inv.old_airline || '',
      oldSector: inv.old_sector || '',
      oldSellPrice: inv.old_sell_price || 0,
      oldBookingDate: inv.old_booking_date || '',
      oldPassengers: inv.old_passengers || '',
      oldFlightType: inv.old_flight_type || '',
      oldPaymentMethod: inv.old_payment_method || '',
      refundReason: inv.refund_reason || '',
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
      passengers: inv.passenger_names?.split('\n') || [''],
      status: inv.status || 'Unpaid',
      creditDueDate: inv.credit_due_date || '',
      creditorId: inv.creditor_id || '',
      tabbyNo: inv.tabby_order_no || '',
      tamaraNo: inv.tamara_order_no || '',
      ticketStatus: inv.ticket_status || 'Confirmed',
      bookingDate: inv.booking_date || today,
      destination: '',
      hotelName: '',
      checkIn: '',
      checkOut: '',
      visaType: 'Tourist',
      serviceName: '',
      creditCustId: ''
    });
    state.setPage('create');
  };

  // ============================================================
  // CREATE INVOICE
  // ============================================================
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      let cid = null, corpId = null;

      if (invForm.custType === 'Individual') {
        if (invForm.custId === 'new') {
          const { data: nC, error: cErr } = await supabase
            .from('customers')
            .insert([{
              name: invForm.custName,
              phone: invForm.custPhone,
              type: 'Individual',
              tenant_id: userProfile.tenant_id
            }])
            .select()
            .single();
          if (cErr) throw new Error(isAr ? 'कस्टमर बनाने में विफल: ' + cErr.message : 'Customer creation failed: ' + cErr.message);
          cid = nC.id;
        } else {
          cid = invForm.custId;
        }
      } else {
        if (invForm.corpId === 'new') {
          const { data: nCorp, error: corpErr } = await supabase
            .from('corporates')
            .insert([{
              name: invForm.corpName,
              vat_no: invForm.corpVat,
              phone: invForm.corpPhone,
              address: invForm.corpAddress,
              tenant_id: userProfile.tenant_id
            }])
            .select()
            .single();
          if (corpErr) throw new Error(isAr ? 'कॉर्पोरेट बनाने में विफल: ' + corpErr.message : 'Corporate creation failed: ' + corpErr.message);
          corpId = nCorp.id;
        } else {
          corpId = invForm.corpId;
        }
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

      const portal = data.portals?.find(p => p.id === invForm.portalId);
      if (!portal) throw new Error(isAr ? 'पोर्टल चुनें!' : 'Select a Portal');
      if ((portal.current_balance || 0) < cost) {
        showToast(isAr ? `⚠️ पोर्टल बैलेंस कम है: ${(portal.current_balance || 0).toFixed(2)} SAR (जरूरत: ${cost.toFixed(2)} SAR)` : `⚠️ Low portal balance: ${(portal.current_balance || 0).toFixed(2)} SAR (Need: ${cost.toFixed(2)} SAR)`);
      }

      if (invForm.payment === 'Credit Balance' && cid && usedCredit > 0) {
        const cust = data.customers?.find(c => c.id === cid);
        if (cust) {
          const nc = (cust.store_credit || 0) - usedCredit;
          if (nc < 0) throw new Error(isAr ? 'पर्याप्त क्रेडिट बैलेंस नहीं!' : 'Insufficient credit balance!');
          await supabase.from('customers').update({ store_credit: nc }).eq('id', cust.id);
          setData(prev => ({
            ...prev,
            customers: prev.customers.map(c => c.id === cust.id ? { ...c, store_credit: nc } : c)
          }));
        }
      }

      const passengerNames = invForm.passengers.filter(p => p).join('\n');

      const payload = {
        customer_id: cid,
        corporate_id: corpId,
        portal_id: portal.id,
        employee_id: invForm.employeeId || null,
        booking_date: invForm.bookingDate,
        invoice_date: invForm.invoiceDate,
        service_type: invForm.service,
        flight_type: invForm.flightType,
        flight_journey: invForm.flightJourney,
        refundable_status: invForm.refundable,
        booking_type: invForm.bookingType,
        linked_inv_id: invForm.linkedInvId || null,
        old_ticket_no: invForm.oldTicketNo || null,
        old_pnr: invForm.oldPnr || null,
        old_airline: invForm.oldAirline || null,
        old_sector: invForm.oldSector || null,
        old_sell_price: parseFloat(invForm.oldSellPrice) || 0,
        old_booking_date: invForm.oldBookingDate || null,
        old_passengers: invForm.oldPassengers || null,
        old_flight_type: invForm.oldFlightType || null,
        old_payment_method: invForm.oldPaymentMethod || null,
        refund_reason: invForm.refundReason || null,
        pnr: invForm.pnr,
        ticket_no: invForm.ticketNo,
        sector: invForm.service === 'Flight Ticket'
          ? `${invForm.airline} - ${invForm.flightSector}`
          : invForm.service,
        qty,
        discount,
        passenger_names: passengerNames || null,
        airline: invForm.airline || null,
        flight_sector: invForm.flightSector || null,
        total_cost: cost,
        total_sell: sell,
        profit,
        vat,
        total,
        paid_amount: totalPaid,
        used_credit: usedCredit,
        due_amount: invoiceDue,
        cash_return: cashReturn,
        payment_method: invForm.payment,
        credit_due_date: invoiceDue > 0 && invForm.payment === 'Credit' ? invForm.creditDueDate : null,
        creditor_id: invForm.payment === 'Credit' ? (invForm.creditorId || null) : null,
        tabby_order_no: invForm.payment === 'Tabby' ? invForm.tabbyNo : null,
        tamara_order_no: invForm.payment === 'Tamara' ? invForm.tamaraNo : null,
        ticket_status: invForm.ticketStatus,
        status: invoiceStatus,
        tenant_id: userProfile.tenant_id
      };

      if (editInvId) {
        const { data: upInv, error: upErr } = await supabase
          .from('invoices')
          .update(payload)
          .eq('id', editInvId)
          .select('*, customers(name), corporates(name), employees(name)')
          .single();
        if (upErr) throw new Error(isAr ? 'अपडेट विफल: ' + upErr.message : 'Update failed: ' + upErr.message);
        setData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === editInvId ? upInv : i) }));
        showToast(isAr ? '✅ इनवॉइस अपडेट हो गई!' : '✅ Invoice Updated!');
        setEditInvId(null);
      } else {
        const invNo = `INV-${Date.now()}`;
        const { data: newInv, error: invErr } = await supabase
          .from('invoices')
          .insert([{ invoice_no: invNo, ...payload }])
          .select('*, customers(name), corporates(name), employees(name)')
          .single();
        if (invErr) throw new Error(isAr ? 'बनाने में विफल: ' + invErr.message : 'Creation failed: ' + invErr.message);

        const newBal = (portal.current_balance || 0) - cost;
        await supabase.from('portals').update({ current_balance: newBal }).eq('id', portal.id);

        await logAction(`Created Invoice ${invNo} | Amount: ${total.toFixed(2)} SAR | Profit: ${profit.toFixed(2)} SAR`);

        let newCbEntries = [];
        if (cashPaid > 0 && invForm.payment !== 'Credit' && invForm.payment !== 'Credit Balance') {
          const cbType = invForm.payment === 'Cash' ? 'Cash-In' : 'Bank-In';
          const { data: nC } = await supabase.from('cashbook').insert([{
            trans_date: invForm.invoiceDate,
            type: cbType,
            description: `Payment for ${invNo}`,
            amount: cashPaid,
            tenant_id: userProfile.tenant_id,
            reference_id: newInv.id
          }]).select().single();
          if (nC) newCbEntries.push(nC);
        }

        if (cashReturn > 0) {
          const { data: nCO } = await supabase.from('cashbook').insert([{
            trans_date: invForm.invoiceDate,
            type: 'Cash-Out',
            description: `Cash returned for ${invNo} (Overpayment)`,
            amount: cashReturn,
            tenant_id: userProfile.tenant_id,
            reference_id: newInv.id
          }]).select().single();
          if (nCO) newCbEntries.push(nCO);
          showToast(isAr ? `✅ ${cashReturn.toFixed(2)} SAR वापस किए गए!` : `✅ ${cashReturn.toFixed(2)} SAR returned!`);
        }

        if (usedCredit > 0) {
          const { data: nCU } = await supabase.from('cashbook').insert([{
            trans_date: invForm.invoiceDate,
            type: 'Cash-Out',
            description: `Credit Balance used for ${invNo}`,
            amount: usedCredit,
            tenant_id: userProfile.tenant_id,
            reference_id: newInv.id
          }]).select().single();
          if (nCU) newCbEntries.push(nCU);
        }

        setData(prev => ({
          ...prev,
          invoices: [newInv, ...prev.invoices],
          portals: prev.portals.map(p => p.id === portal.id ? { ...p, current_balance: newBal } : p),
          cashbook: newCbEntries.length > 0 ? [...newCbEntries, ...prev.cashbook] : prev.cashbook
        }));
        showToast(isAr ? '✅ इनवॉइस बन गई!' : '✅ Invoice Generated!');
      }

      setInvForm({
        custType: 'Individual',
        custId: 'new',
        custName: '',
        custPhone: '',
        corpId: 'new',
        corpName: '',
        corpVat: '',
        corpPhone: '',
        corpAddress: '',
        passengers: [''],
        employeeId: '',
        portalId: data.portals?.[0]?.id || '',
        bookingDate: today,
        invoiceDate: today,
        bookingType: 'New Booking',
        linkedInvId: '',
        oldTicketNo: '',
        oldPnr: '',
        oldAirline: '',
        oldSector: '',
        oldSellPrice: 0,
        oldBookingDate: '',
        oldPassengers: '',
        oldFlightType: '',
        oldPaymentMethod: '',
        refundReason: '',
        service: 'Flight Ticket',
        flightType: 'Domestic',
        flightJourney: 'Single',
        refundable: 'Refundable',
        flightSector: '',
        airline: '',
        destination: '',
        hotelName: '',
        checkIn: '',
        checkOut: '',
        visaType: 'Tourist',
        serviceName: '',
        pnr: '',
        ticketNo: '',
        qty: 1,
        cost: 0,
        sell: 0,
        discount: 0,
        taxRate: '15',
        payment: 'Cash',
        paid: '',
        creditDueDate: '',
        creditorId: '',
        tabbyNo: '',
        tamaraNo: '',
        ticketStatus: 'Confirmed',
        useCredit: 0,
        creditCustId: '',
        status: 'Unpaid'
      });
      state.setPage('list');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // STAFF MISTAKES
  // ============================================================
  const handleAddMistake = async (e) => {
    e.preventDefault();
    try {
      const fd = e.target;
      const { data: newM, error } = await supabase
        .from('staff_mistakes')
        .insert([{
          employee_id: fd.emp.value,
          old_ticket_no: fd.old_tkt.value,
          new_ticket_no: fd.new_tkt.value,
          loss_amount: parseFloat(fd.loss_amt.value) || 0,
          paid_by_employee: fd.paid_by_emp?.checked || false,
          reason: fd.reason?.value || '',
          date: today,
          tenant_id: userProfile.tenant_id
        }])
        .select('*, employees(name)')
        .single();

      if (error) throw error;
      setData(prev => ({ ...prev, staffMistakes: [newM, ...(prev.staffMistakes || [])] }));
      showToast(isAr ? '✅ मिस्टेक लॉग हो गया!' : '✅ Mistake Logged!');
      fd.reset();
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handlePreviewMistake = (m) => {
    setPreviewHTML(getMistakeHTML(m, data.settings, lang));
    setModal({ type: 'preview', data: m });
  };

  const handleDeleteMistake = async (m) => {
    if (!confirm(isAr ? 'क्या आप इस मिस्टेक को हटाना चाहते हैं?' : 'Delete this mistake?')) return;
    try {
      await supabase.from('staff_mistakes').delete().eq('id', m.id);
      setData(prev => ({ ...prev, staffMistakes: prev.staffMistakes.filter(x => x.id !== m.id) }));
      showToast(isAr ? '✅ हटा दिया गया!' : '✅ Deleted!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // PAYROLL
  // ============================================================
  const handleGenerateSlip = (pay) => {
    setPreviewHTML(getSalarySlipHTML(pay, data.settings, lang));
    setModal({ type: 'preview', data: pay });
  };

  const handleDeletePayroll = async (pay) => {
    if (!confirm(isAr ? 'क्या आप इस सैलरी स्लिप को हटाना चाहते हैं?' : 'Delete this salary slip?')) return;
    try {
      const cbs = data.cashbook?.filter(c => c.reference_id === pay.id) || [];
      for (const cb of cbs) await supabase.from('cashbook').delete().eq('id', cb.id);
      await supabase.from('payroll').delete().eq('id', pay.id);
      setData(prev => ({
        ...prev,
        payroll: prev.payroll.filter(p => p.id !== pay.id),
        cashbook: prev.cashbook.filter(c => !cbs.find(x => x.id === c.id))
      }));
      showToast(isAr ? '✅ हटा दिया गया!' : '✅ Deleted!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleProcessPayroll = async (e) => {
    e.preventDefault();
    try {
      const empId = payForm.employee_id;
      if (!empId) throw new Error(isAr ? 'कर्मचारी चुनें!' : 'Select an employee!');
      const emp = data.employees?.find(em => em.id === empId);
      if (!emp) throw new Error(isAr ? 'कर्मचारी नहीं मिला!' : 'Employee not found!');

      const month = payForm.month || today.slice(0, 7);
      const base = parseFloat(emp.salary) || 0;

      const monthInvoices = data.invoices?.filter(i =>
        i.employee_id === empId &&
        i.invoice_date?.startsWith(month) &&
        i.status !== 'refunded'
      ) || [];

      const commissionBase = monthInvoices.reduce((s, i) => s + (i.total_sell || 0), 0);
      const commissionRate = parseFloat(emp.commission_rate) || 0;
      const commissionAmt = commissionBase * (commissionRate / 100);

      const overtime = parseFloat(payForm.overtime) || 0;
      const gift = parseFloat(payForm.gift) || 0;
      const advance = parseFloat(payForm.advance) || 0;
      const mistakesDed = parseFloat(payForm.mistakes_deduction) || 0;
      const otherDed = parseFloat(payForm.other_deduction) || 0;
      const totalDed = advance + mistakesDed + otherDed;
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
          advance_deduction: advance,
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
      showToast(isAr ? `✅ ${emp.name} - ${netPay.toFixed(2)} SAR सैलरी दी गई!` : `✅ ${emp.name} - ${netPay.toFixed(2)} SAR Salary Processed!`);

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
      if (!advForm.employee_id) throw new Error(isAr ? 'कर्मचारी चुनें!' : 'Select an employee!');
      const amount = parseFloat(advForm.amount) || 0;
      if (amount <= 0) throw new Error(isAr ? 'सही राशि डालें!' : 'Enter a valid amount');

      const { data: newAdv, error } = await supabase
        .from('emp_advances')
        .insert([{
          employee_id: advForm.employee_id,
          amount,
          date: advForm.date || today,
          status: advForm.status || 'Pending',
          tenant_id: userProfile.tenant_id
        }])
        .select('*, employees(name)')
        .single();

      if (error) throw new Error(error.message);

      setData(prev => ({
        ...prev,
        empAdvances: [newAdv, ...(prev.empAdvances || [])]
      }));

      const emp = data.employees?.find(em => em.id === advForm.employee_id);
      await logAction(`Advance of ${amount.toFixed(2)} SAR to ${emp?.name || ''}`);
      showToast(isAr ? '✅ एडवांस दर्ज किया गया!' : '✅ Advance recorded!');

      setAdvForm({ employee_id: '', amount: '', date: today, status: 'Pending' });
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
      showToast(isAr ? '✅ अपडेट हो गया!' : '✅ Updated!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleDeleteAdvance = async (adv) => {
    if (!confirm(isAr ? 'क्या आप इस एडवांस को हटाना चाहते हैं?' : 'Delete this advance?')) return;
    try {
      await supabase.from('emp_advances').delete().eq('id', adv.id);
      setData(prev => ({
        ...prev,
        empAdvances: prev.empAdvances.filter(a => a.id !== adv.id)
      }));
      showToast(isAr ? '✅ हटा दिया गया!' : '✅ Deleted!');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // CONTRACT / OFFER
  // ============================================================
  const handleGenerateContract = (e) => {
    e.preventDefault();
    if (!contractCorpName) return showToast(isAr ? 'कॉर्पोरेट नाम डालें!' : 'Enter Corporate Name');
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
    if (!contractCorpName) return showToast(isAr ? 'कॉर्पोरेट नाम डालें!' : 'Enter Corporate Name');
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
  // SUPERADMIN - TENANT
  // ============================================================
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
      showToast(isAr ? `✅ एजेंसी बन गई! Email: ${tenantForm.owner_email} | Pass: ${tempPass}` : `✅ Agency Created! Email: ${tenantForm.owner_email} | Pass: ${tempPass}`);
      setTenantForm({
        agency_name: '',
        owner_email: '',
        subscription_end_date: '',
        company_name_ar: '',
        vat_no: '',
        cr_no: '',
        phone: '',
        address_ar: ''
      });
      fetchAll();
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleToggleSubscription = async (tenant) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ is_paid: !tenant.is_paid })
        .eq('id', tenant.id);
      if (error) throw error;
      showToast(isAr ? '✅ सब्सक्रिप्शन अपडेट हो गया!' : '✅ Subscription Updated!');
      fetchAll();
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleDeleteTenant = async (id) => {
    if (!confirm(isAr ? 'क्या आप इस एजेंसी को हटाना चाहते हैं?' : 'Delete this Agency permanently?')) return;
    try {
      await supabase.from('tenants').delete().eq('id', id);
      showToast(isAr ? '✅ एजेंसी हटा दी गई!' : '✅ Agency Deleted!');
      fetchAll();
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // ============================================================
  // EXPORT DATA (CSV)
  // ============================================================
  const handleExportCSV = (dataType, customData) => {
    try {
      let csvContent = '';
      let filename = '';
      let exportData = [];

      if (customData) {
        exportData = customData;
        filename = typeof dataType === 'string' ? dataType : 'export';
      } else {
        switch (dataType) {
          case 'invoices':
            exportData = data.invoices?.filter(i => !i.invoice_no?.startsWith('REF-')).map(inv => ({
              'Invoice No': inv.invoice_no,
              'Date': inv.invoice_date,
              'Customer': inv.customers?.name || inv.old_customer_name || '',
              'Airline': inv.airline || '',
              'Total': inv.total || 0,
              'Status': inv.status,
              'Payment': inv.payment_method
            })) || [];
            filename = 'invoices';
            break;
          case 'customers':
            exportData = data.customers?.map(c => ({
              'Name': c.name,
              'Phone': c.phone || '',
              'Credit Balance': c.store_credit || 0
            })) || [];
            filename = 'customers';
            break;
          case 'expenses':
            exportData = data.expenses?.map(e => ({
              'Date': e.expense_date,
              'Category': e.expense_type,
              'Description': e.description || '',
              'Amount': e.amount || 0,
              'Payment Mode': e.payment_mode
            })) || [];
            filename = 'expenses';
            break;
          case 'cashbook':
            exportData = data.cashbook?.map(c => ({
              'Date': c.trans_date,
              'Type': c.type,
              'Description': c.description || '',
              'Amount': c.amount || 0
            })) || [];
            filename = 'cashbook';
            break;
          default:
            return showToast(isAr ? '❌ गलत डेटा टाइप!' : '❌ Invalid export type!');
        }
      }

      if (!exportData || exportData.length === 0) {
        return showToast(isAr ? '❌ कोई डेटा नहीं' : '❌ No data to export');
      }

      const headers = Object.keys(exportData[0]);
      csvContent = headers.join(',') + '\n';
      exportData.forEach(row => {
        csvContent += headers.map(h => `"${row[h] || ''}"`).join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      showToast(isAr ? `✅ ${filename}.csv डाउनलोड हो गया!` : `✅ ${filename}.csv exported!`);
    } catch (err) {
      showToast('Export Error: ' + err.message);
    }
  };

  // ============================================================
  // RETURN ALL ACTIONS
  // ============================================================
  return {
    // Auth
    handleLogout,
    handleChangePassword,

    // Chat
    handleSendMessage,

    // Profile & Settings
    handleProfilePicUpload,
    handleSaveProfile,
    handleLogoUpload,
    handleSaveSettings,
    handleAddCustomField,
    handleRemoveCustomField,
    handleCustomFieldChange,

    // Generic Delete
    handleDelete,

    // PDF & Print
    downloadPDF,
    handleDownloadPDF,
    printInvoice,

    // Share
    shareWhatsApp,
    shareEmail,

    // Invoice Actions
    openPreview,
    openRefundModal,
    openSettleModal,
    handleQuickSettle,
    handleSettlePayment,
    handleRefund,
    handleEditInvoice,
    handleCreateInvoice,
    handleDeleteInvoice,

    // CRUD
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

    // Expenses
    handleAddExpItem,
    handleRemoveExpItem,
    handleExpItemChange,
    handleEditExp,
    handleAddEditExpense,
    handleDeleteExpense,

    // Portals
    handleAddEditPortal,

    // Transfer
    handleTransfer,

    // Investments
    handleAddInvestment,

    // Staff Mistakes
    handleAddMistake,
    handlePreviewMistake,
    handleDeleteMistake,

    // Payroll
    handleGenerateSlip,
    handleDeletePayroll,
    handleProcessPayroll,

    // Employee Advances
    handleAddAdvance,
    handleUpdateAdvanceStatus,
    handleDeleteAdvance,

    // Contracts
    handleGenerateContract,
    handleGenerateOffer,

    // SuperAdmin
    handleAddTenant,
    handleToggleSubscription,
    handleDeleteTenant,

    // Export
    handleExportCSV
  };
}
