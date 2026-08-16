'use client';

import useERP from '@/hooks/useERP';
import ERPLayout from '@/components/ERPLayout';
import ERPViews from '@/components/ERPViews';
import { useEffect } from 'react';

export default function Home() {
  const erp = useERP();

  const t = (key, fallback) => erp.tr?.[key] || fallback || key;

  // FIX: Keyboard shortcut - stable dependency
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'n') { e.preventDefault(); erp.setPage('create'); }
      if (e.altKey && e.key.toLowerCase() === 'l') { e.preventDefault(); erp.setPage('list'); }
      if (e.altKey && e.key.toLowerCase() === 'd') { e.preventDefault(); erp.setPage('dashboard'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // FIX: Empty dep array - setPage is stable from useState

  if (!erp.user || !erp.userProfile) {
    return (
      <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        height: '100vh', fontFamily: "'Poppins', sans-serif", 
        background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: '#F59E0B' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✈️</div>
          <h2>Loading ERP System...</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  // FIX: Role-based SuperAdmin check (remove hardcoded emails)
  const isSuperAdmin = erp.userProfile?.role === 'SuperAdmin';

  const menu = [
    { id: 'dashboard', label: t('dashboard', 'Dashboard'), show: true },
    { id: 'ai_dashboard', label: t('ai_dashboard', 'AI Dashboard'), show: true },
    { id: 'notifications', label: t('notifications', 'Notifications'), show: true },
    { id: 'superadmin', label: t('superadmin', 'SuperAdmin'), show: isSuperAdmin },
    
    // Invoices & Sales
    { id: 'create', label: t('create', 'Create Invoice'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'list', label: t('list', 'Invoices'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'refunds', label: t('refunds', 'Refunds'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'quotations', label: t('quotations', 'Quotations'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'recurring_invoices', label: t('recurring_invoices', 'Recurring Invoices'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'profitability', label: t('profitability', 'Profitability'), show: true },
    { id: 'ai_pricing', label: '🤖 AI Pricing', show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    
    // Customers & Vendors
    { id: 'customers', label: t('customers', 'Customers'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'corporates', label: t('corporates', 'Corporates'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'creditors', label: t('creditors', 'Creditors'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'credit', label: t('credit', 'Credit Balances'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'credit_limits', label: t('credit_limits', 'Credit Limits'), show: erp.userProfile.is_admin || erp.userProfile.can_access_bank },
    { id: 'customer_statement', label: t('customer_statement', 'Cust Statement'), show: erp.userProfile.is_admin || erp.userProfile.can_access_reports },
    { id: 'portals', label: t('portals', 'Portals'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'vendors', label: t('vendors', 'Vendors'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'supplier_statement', label: t('supplier_statement', 'Supplier Statement'), show: erp.userProfile.is_admin || erp.userProfile.can_access_bank },
    { id: 'packages', label: t('packages', 'Packages'), show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'branches', label: t('branches', 'Branches'), show: erp.userProfile.is_admin || erp.userProfile.can_access_settings },
    { id: 'multi_branch', label: t('multi_branch', 'Multi-Branch'), show: erp.userProfile.is_admin },
    
    // Contracts & Finance
    { id: 'contract', label: 'Corporate Contract', show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'offer', label: 'Corporate Offer', show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'bank', label: t('bank', 'Bank & Cash'), show: erp.userProfile.is_admin || erp.userProfile.can_access_bank },
    { id: 'invest', label: t('invest', 'Investors'), show: erp.userProfile.is_admin || erp.userProfile.can_access_bank },
    { id: 'expense_approval', label: t('expense_approval', 'Expense Approval'), show: erp.userProfile.is_admin },
    
    // HR & Reports
    { id: 'hr', label: t('hr', 'Human Resources'), show: erp.userProfile.is_admin || erp.userProfile.can_access_hr },
    { id: 'hr_advanced', label: t('hr_advanced', 'HR & Payroll'), show: erp.userProfile.is_admin || erp.userProfile.can_access_hr },
    { id: 'staff_mistakes', label: t('staff_mistakes', 'Staff Mistakes'), show: erp.userProfile.is_admin || erp.userProfile.can_access_hr },
    { id: 'statements', label: t('statements', 'Statements'), show: erp.userProfile.is_admin || erp.userProfile.can_access_reports },
    { id: 'refund_statement', label: t('refund_statement', 'Refund Statement'), show: erp.userProfile.is_admin || erp.userProfile.can_access_reports },
    { id: 'users', label: t('users', 'Users'), show: erp.userProfile.is_admin },
    { id: 'reports', label: t('reports', 'Reports'), show: erp.userProfile.is_admin || erp.userProfile.can_access_reports },
    { id: 'audit', label: t('audit', 'Audit Logs'), show: erp.userProfile.is_admin },
    
    // System
    { id: 'settings', label: t('settings', 'Settings'), show: erp.userProfile.is_admin || erp.userProfile.can_access_settings },
    { id: 'profile', label: t('profile', 'Profile'), show: true },
  ].filter(m => m.show);

  return (
    <>
      {/* FIX: Better toast with animation */}
      {erp.toast && (
        <div style={{ 
          position: 'fixed', top: '20px', right: '20px', 
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', 
          color: '#FBBF24', padding: '15px 25px', borderRadius: '12px', 
          zIndex: 9999, boxShadow: '0 5px 15px rgba(0,0,0,0.3)', 
          fontWeight: '600', fontSize: '14px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {erp.toast}
        </div>
      )}
      
      <ERPLayout 
        tr={erp.tr || {}} lang={erp.lang} setLang={erp.setLang} page={erp.page} setPage={erp.setPage} 
        modal={erp.modal} setModal={erp.setModal} passForm={erp.passForm} setPassForm={erp.setPassForm} 
        handleChangePassword={erp.handleChangePassword} handleLogout={erp.handleLogout} 
        handleSendMessage={erp.handleSendMessage} chatOpen={erp.chatOpen} setChatOpen={erp.setChatOpen} 
        chatMessages={erp.chatMessages} chatInput={erp.chatInput} setChatInput={erp.setChatInput} 
        userProfile={erp.userProfile} menu={menu}
        settleForm={erp.settleForm} setSettleForm={erp.setSettleForm} handleSettlePayment={erp.handleSettlePayment}
        refundForm={erp.refundForm || {}} setRefundForm={erp.setRefundForm} handleRefund={erp.handleRefund}
        previewHTML={erp.previewHTML}
        downloadPDF={erp.downloadPDF}
      >
        <ERPViews 
          page={erp.page} data={erp.data} tr={erp.tr || {}} today={erp.today}
          ledgerCustId={erp.ledgerCustId} setLedgerCustId={erp.setLedgerCustId}
          ledgerEmpId={erp.ledgerEmpId} setLedgerEmpId={erp.setLedgerEmpId}
          
          invForm={erp.invForm} setInvForm={erp.setInvForm} 
          handleCreateInvoice={erp.handleCreateInvoice} downloadPDF={erp.handleDownloadPDF || erp.downloadPDF}
          printInvoice={erp.printInvoice} exportToExcel={erp.exportToExcel} 
          search={erp.search} setSearch={erp.setSearch} 
          tblPage={erp.tblPage} setTblPage={erp.setTblPage} 
          payFilter={erp.payFilter} setPayFilter={erp.setPayFilter}
          handleEditInvoice={erp.handleEditInvoice} 
          handleDeleteInvoice={erp.handleDeleteInvoice} 
          openRefundModal={erp.openRefundModal} openPreview={erp.openPreview}
          openSettleModal={erp.openSettleModal} handleQuickSettle={erp.handleQuickSettle}
          editInvId={erp.editInvId}
          
          handleAddEditCust={erp.handleAddEditCust} custForm={erp.custForm} setCustForm={erp.setCustForm} handleEditCust={erp.handleEditCust} editCustId={erp.editCustId}
          handleAddEditCorp={erp.handleAddEditCorp} corpForm={erp.corpForm} setCorpForm={erp.setCorpForm} handleEditCorp={erp.handleEditCorp} editCorpId={erp.editCorpId}
          handleAddEditCred={erp.handleAddEditCred} creditorForm={erp.creditorForm} setCreditorForm={erp.setCreditorForm} handleEditCred={erp.handleEditCred} editCredId={erp.editCredId}
          
          handleAddEditVend={erp.handleAddEditVend} vendorForm={erp.vendorForm} setVendorForm={erp.setVendorForm} handleEditVend={erp.handleEditVend} editVendId={erp.editVendId}
          handleAddEditPkg={erp.handleAddEditPkg} pkgForm={erp.pkgForm} setPkgForm={erp.setPkgForm} handleEditPkg={erp.handleEditPkg} editPkgId={erp.editPkgId}
          handleAddEditBrn={erp.handleAddEditBrn} brnForm={erp.brnForm} setBrnForm={erp.setBrnForm} handleEditBrn={erp.handleEditBrn} editBrnId={erp.editBrnId}
          
          handleAddEditEmp={erp.handleAddEditEmp} empForm={erp.empForm} setEmpForm={erp.setEmpForm} handleEditEmp={erp.handleEditEmp} editEmpId={erp.editEmpId}
          handleAddEditSrv={erp.handleAddEditSrv} srvForm={erp.srvForm} setSrvForm={erp.setSrvForm} handleEditSrv={erp.handleEditSrv} editSrvId={erp.editSrvId}
          handlePaySalary={erp.handlePaySalary} 
          expForm={erp.expForm} setExpForm={erp.setExpForm} 
          editExpId={erp.editExpId} setEditExpId={erp.setEditExpId}
          handleAddExpItem={erp.handleAddExpItem} 
          handleRemoveExpItem={erp.handleRemoveExpItem} 
          handleExpItemChange={erp.handleExpItemChange} 
          handleAddExpense={erp.handleAddExpense}
          handleEditExpense={erp.handleEditExpense} 
          handleDeleteExpense={erp.handleDeleteExpense} 
          handlePreviewExpense={erp.handlePreviewExpense}
          handleAddAdvance={erp.handleAddAdvance} handleReturnAdvance={erp.handleReturnAdvance}
          
          handleAddPortal={erp.handleAddPortal} portalForm={erp.portalForm} setPortalForm={erp.setPortalForm}
          handleAddInvestment={erp.handleAddInvestment} investForm={erp.investForm} setInvestForm={erp.setInvestForm}
          handleRecharge={erp.handleRecharge} handleTransfer={erp.handleTransfer} 
          transferForm={erp.transferForm} setTransferForm={erp.setTransferForm}
          
          handleAddUser={erp.handleAddUser} handleEditUser={erp.handleEditUser} handleUpdateUser={erp.handleUpdateUser} userForm={erp.userForm} setUserForm={erp.setUserForm} editUserId={erp.editUserId}
          handleSaveSettings={erp.handleSaveSettings} handleLogoUpload={erp.handleLogoUpload} 
          setForm={erp.setForm} setSetForm={erp.setSetForm} 
          handleAddCustomField={erp.handleAddCustomField} handleRemoveCustomField={erp.handleRemoveCustomField} handleCustomFieldChange={erp.handleCustomFieldChange}
          
          repDate={erp.repDate} setRepDate={erp.setRepDate} 
          reportTab={erp.reportTab} setReportTab={erp.setReportTab} 
          statementTab={erp.statementTab} setStatementTab={erp.setStatementTab}
          filterData={erp.filterData}
          
          handleDelete={erp.handleDelete}

          contractCorpName={erp.contractCorpName} setContractCorpName={erp.setContractCorpName}
          contractType={erp.contractType} setContractType={erp.setContractType}
          contractMarkup={erp.contractMarkup} setContractMarkup={erp.setContractMarkup}
          contractTerms={erp.contractTerms} setContractTerms={erp.setContractTerms}
          handleGenerateContract={erp.handleGenerateContract} handleGenerateOffer={erp.handleGenerateOffer}
          
          tenantForm={erp.tenantForm} setTenantForm={erp.setTenantForm}
          handleAddTenant={erp.handleAddTenant} handleToggleSubscription={erp.handleToggleSubscription} handleDeleteTenant={erp.handleDeleteTenant}

          profileForm={erp.profileForm} setProfileForm={erp.setProfileForm}
          handleProfilePicUpload={erp.handleProfilePicUpload} handleSaveProfile={erp.handleSaveProfile}
          
          shareWhatsApp={erp.shareWhatsApp}
          shareEmail={erp.shareEmail}
          
          handleAddMistake={erp.handleAddMistake}
          handleGenerateSlip={erp.handleGenerateSlip}
        />
      </ERPLayout>
    </>
  );
}
