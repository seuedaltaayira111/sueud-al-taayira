'use client';
import useERP from '@/hooks/useERP';
import ERPLayout from '@/components/ERPLayout';
import ERPViews from '@/components/ERPViews';

export default function Home() {
  const erp = useERP();

  if (!erp.user) return <div style={{ padding: 50, textAlign: 'center' }}>Loading ERP...</div>;

  const menu = [
    { id: 'dashboard', label: erp.tr.dash, show: true },
    { id: 'create', label: erp.tr.create, show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'list', label: erp.tr.list, show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'refunds', label: erp.tr.refunds, show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'customers', label: erp.tr.customers, show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'corporates', label: erp.tr.corporates, show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'creditors', label: erp.tr.creditors, show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'portals', label: erp.tr.portals, show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'vendors', label: erp.tr.vendors, show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'packages', label: erp.tr.packages, show: erp.userProfile.is_admin || erp.userProfile.can_access_invoices },
    { id: 'branches', label: erp.tr.branches, show: erp.userProfile.is_admin || erp.userProfile.can_access_settings },
    { id: 'bank', label: erp.tr.bank, show: erp.userProfile.is_admin || erp.userProfile.can_access_bank },
    { id: 'invest', label: erp.tr.invest, show: erp.userProfile.is_admin || erp.userProfile.can_access_bank },
    { id: 'hr', label: erp.tr.hr, show: erp.userProfile.is_admin || erp.userProfile.can_access_hr },
    { id: 'settings', label: erp.tr.settings, show: erp.userProfile.is_admin || erp.userProfile.can_access_settings },
  ].filter(m => m.show);

  return (
    <>
      {erp.toast && <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: '#FBBF24', padding: '15px 25px', borderRadius: '12px', zIndex: 9999, boxShadow: '0 5px 15px rgba(0,0,0,0.2)', fontWeight: '600' }}>{erp.toast}</div>}
      
      <ERPLayout 
        tr={erp.tr} lang={erp.lang} setLang={erp.setLang} page={erp.page} setPage={erp.setPage} 
        modal={erp.modal} setModal={erp.setModal} passForm={erp.passForm} setPassForm={erp.setPassForm} 
        handleChangePassword={erp.handleChangePassword} handleLogout={erp.handleLogout} 
        handleSendMessage={erp.handleSendMessage} chatOpen={erp.chatOpen} setChatOpen={erp.setChatOpen} 
        chatMessages={erp.chatMessages} chatInput={erp.chatInput} setChatInput={erp.setChatInput} 
        userProfile={erp.userProfile} menu={menu}
        settleForm={erp.settleForm} setSettleForm={erp.setSettleForm} handleSettlePayment={erp.handleSettlePayment}
        refundForm={erp.refundForm} setRefundForm={erp.setRefundForm} handleRefund={erp.handleRefund}
      >
        <ERPViews 
          page={erp.page} data={erp.data} tr={erp.tr} invForm={erp.invForm} setInvForm={erp.setInvForm} 
          handleCreateInvoice={erp.handleCreateInvoice} downloadPDF={erp.downloadPDF} printInvoice={erp.printInvoice} 
          exportToExcel={erp.exportToExcel} 
          handleAddEditCust={erp.handleAddEditCust} custForm={erp.custForm} setCustForm={erp.setCustForm} handleEditCust={erp.handleEditCust}
          handleAddEditCorp={erp.handleAddEditCorp} corpForm={erp.corpForm} setCorpForm={erp.setCorpForm} handleEditCorp={erp.handleEditCorp}
          handleAddEditCred={erp.handleAddEditCred} creditorForm={erp.creditorForm} setCreditorForm={erp.setCreditorForm} handleEditCred={erp.handleEditCred}
          handleAddEditVend={erp.handleAddEditVend} vendorForm={erp.vendorForm} setVendorForm={erp.setVendorForm} handleEditVend={erp.handleEditVend}
          handleAddEditPkg={erp.handleAddEditPkg} pkgForm={erp.pkgForm} setPkgForm={erp.setPkgForm} handleEditPkg={erp.handleEditPkg}
          handleAddEditBrn={erp.handleAddEditBrn} brnForm={erp.brnForm} setBrnForm={erp.setBrnForm} handleEditBrn={erp.handleEditBrn}
          handleAddEditEmp={erp.handleAddEditEmp} empForm={erp.empForm} setEmpForm={erp.setEmpForm} handleEditEmp={erp.handleEditEmp}
          handleAddPortal={erp.handleAddPortal} portalForm={erp.portalForm} setPortalForm={erp.setPortalForm}
          handleAddInvestment={erp.handleAddInvestment} investForm={erp.investForm} setInvestForm={erp.setInvestForm}
          handleDelete={erp.handleDelete} handleRecharge={erp.handleRecharge} handleTransfer={erp.handleTransfer} 
          handleSaveSettings={erp.handleSaveSettings} handleLogoUpload={erp.handleLogoUpload} 
          setForm={erp.setForm} setSetForm={erp.setSetForm} today={erp.today}
          transferForm={erp.transferForm} setTransferForm={erp.setTransferForm}
        />
      </ERPLayout>
    </>
  );
}
