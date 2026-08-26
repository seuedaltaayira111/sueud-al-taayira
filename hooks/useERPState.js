'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  getInvoiceHTML,
  getRefundHTML,
  getExpenseHTML,
  getSalarySlipHTML,
  getContractHTML,
  getMistakeHTML
} from '@/lib/invoiceHTML';

const en = {
  dashboard:'Dashboard', create:'Create Invoice', list:'Invoices', refunds:'Refunds',
  customers:'Customers', corporates:'Corporates', creditors:'Creditors', credit:'Credit Balances',
  vendors:'Vendors', packages:'Packages', branches:'Branches', portals:'Portals',
  bank:'Bank & Cash', invest:'Investors', hr:'Human Resources', users:'Users',
  settings:'Settings', reports:'Reports', audit:'Audit Logs', statements:'Statements',
  contract:'Corporate Contract', offer:'Corporate Offer', superadmin:'SuperAdmin',
  profile:'Profile', profitability:'Profitability', notifications:'Notifications',
  ai_dashboard:'AI Dashboard', quotations:'Quotations', hr_advanced:'HR & Payroll',
  ai_pricing:'AI Pricing', my_attendance:'My Attendance', credit_limits:'Credit Limits',
  customer_statement:'Customer Statement', refund_statement:'Refund Statement',
  supplier_statement:'Supplier Statement', multi_branch:'Multi-Branch',
  recurring_invoices:'Recurring Invoices', expense_approval:'Expense Approval',
  staff_mistakes:'Staff Mistakes', expenses:'Expenses', editInvoice:'Edit Invoice',
  generateInvoice:'Generate Invoice', updateInvoice:'Update Invoice', custType:'Customer Type',
  individual:'Individual', corporate:'Corporate', selectCustomer:'Select Customer',
  customerPhone:'Customer Phone', passengers:'Passengers', addPassenger:'+ Add Passenger',
  portal:'Portal', service:'Service', flightTicket:'Flight Ticket', hotel:'Hotel Booking',
  tourPackage:'Tour Package', visitVisa:'Visit Visa', umrahVisa:'Umrah Visa',
  newService:'New Service', flightType:'Flight Type', domestic:'Domestic',
  international:'International', airline:'Airline', sector:'Sector', pnr:'PNR',
  ticketNo:'Ticket No', qty:'Quantity', cost:'Cost', sell:'Sell', discount:'Discount',
  vatRate:'VAT Rate', invoiceDate:'Invoice Date', bookingType:'Booking Type',
  newBooking:'New Booking', reissue:'Reissue', extraLuggage:'Extra Luggage',
  previousBooking:'Previous Booking', salesPerson:'Sales Person', paymentMethod:'Payment Method',
  cash:'Cash', bankTransfer:'Bank Transfer', card:'Card / Network', credit:'Credit',
  creditBalance:'Credit Balance', tabby:'Tabby', tamara:'Tamara', paidAmount:'Paid Amount',
  invNo:'Inv No', total:'Total', due:'Due', method:'Method', actions:'Actions',
  preview:'Preview', print:'Print', edit:'Edit', delete:'Delete', refund:'Refund',
  quickSettle:'Settle', download_excel:'Export Excel', save:'Save', add:'Add',
  search:'Search...', changePass:'Change Password', logout:'Logout',
  selectEmployee:'Select Employee', attendanceDate:'Date', status:'Status',
  present:'Present', leave:'Leave', absent:'Absent', checkInTime:'Check-In',
  checkOutTime:'Check-Out', overtime:'OT', deduction:'Deduction', mark:'Mark',
  baseSalary:'Base Salary', commission:'Commission %', advDed:'Adv. Deduct',
  gift:'Gift/Bonus', month:'Month', mode:'Mode', paySalary:'Pay Salary',
  generateSlip:'Generate Slip', target:'Target (SAR)', achieved:'Achieved',
  percentage:'%', balance:'Balance', noInvoices:'No Invoices Found',
  createFirst:'Create an invoice to get started!', allStatus:'All Status', paid:'Paid',
  unpaid:'Unpaid', totalInvoices:'Total Invoices', totalRevenue:'Total Revenue',
  outstanding:'Outstanding', netPosition:'Net Position', portalBalance:'Portal Balance',
  totalCustomers:'Total Customers', quickActions:'Quick Actions', viewInvoices:'View Invoices',
  attendance:'Attendance', recentInvoices:'Recent Invoices', date:'Date',
  customer:'Customer', name:'Name', phone:'Phone', type:'Type', creditBal:'Credit Balance',
  creditLimit:'Credit Limit', vatNo:'VAT No', address:'Address',
  price:'Price', duration:'Duration', inclusions:'Inclusions', location:'Location',
  manager:'Manager', email:'Email', timing:'Timing', role:'Role', salary:'Salary',
  commissionPct:'Commission %', iqama:'IQAMA', description:'Description',
  payment:'Payment', amount:'Amount', from:'From', to:'To', note:'Note',
  transfer:'Transfer', fundTransfer:'Fund Transfer', dateTime:'Date/Time',
  user:'User', action:'Action', searchLogs:'Search logs...', addUser:'+ Add User',
  editUser:'Edit User', username:'Username', linkEmployee:'Link to Employee',
  permissions:'Permissions', admin:'Admin', invoices:'Invoices', bank:'Bank',
  hr:'HR', reports:'Reports', settings:'Settings', saveChanges:'Save Changes',
  cancel:'Cancel', cancelEdit:'Cancel Edit', none:'— None —',
  newCustomer:'+ New Customer', customerName:'Customer Name',
  existingCustomer:'Existing Customer', newCorporate:'+ New Corporate',
  existingCorporate:'Existing Corporate', companyName:'Company Name',
  bookingInfo:'Booking Info', bookingDate:'Booking Date',
  serviceDetails:'Service Details', journey:'Journey', single:'Single',
  returnFlight:'Return', multiCity:'Multi-City', sectorPlaceholder:'Sector (e.g. RUH-JED)',
  refundable:'Refundable', nonRefundable:'Non-Refundable',
  ticketStatus:'Ticket Status', confirmed:'Confirmed', onHold:'On Hold',
  cancelled:'Cancelled', pricing:'Pricing', qty:'Qty', costUnit:'Cost / unit (SAR)',
  sellUnit:'Sell / unit (SAR)', discountSAR:'Discount (SAR)', vatPct:'VAT Rate %',
  sellAfterDisc:'Sell (after disc.)', vat:'VAT', grandTotal:'Grand Total',
  profit:'Profit', dueAfterPaid:'Due After Paid', paymentMethod:'Payment Method',
  amountPaidNow:'Amount Paid Now (SAR)', creditDueDate:'Credit Due Date',
  creditor:'Creditor', useCredit:'Use Credit (SAR)', available:'available',
  exceedsCredit:'⚠️ Exceeds available credit balance', useMaxAvailable:'Use max available',
  tabbyOrderNo:'Tabby Order No.', tamaraOrderNo:'Tamara Order No.',
  today:'Today', checkIn:'Check-In', checkOut:'Check-Out', notMarked:'Not marked',
  checkInAt:'Checked in at', checkOutAt:'Checked out at', requestLeave:'Request Leave',
  leaveType:'Leave Type', annual:'Annual', sick:'Sick', emergency:'Emergency',
  unpaidLeave:'Unpaid', leaveTo:'To', submitRequest:'Submit Request',
  history:'History', last60:'History (last 60)', loading:'Loading…',
  noAttendance:'No attendance records yet.', accountNotLinked:'Account Not Linked',
  accountNotLinkedMsg:'Your login isn\'t linked to an employee record yet. Ask an admin to set your employee_id in Users.',
  directory:'Directory', advances:'Advances', mistakesDeductions:'Mistakes/Deductions',
  payrollSlips:'Payroll & Slips', addEmployee:'+ Add Employee',
  editEmployee:'Edit Employee', fullName:'Full Name', jobTitle:'Job Title',
  nationality:'Nationality', nationalId:'National ID / Iqama No.',
  iqamaExpiry:'Iqama Expiry', maktabAmal:'Labor Office Renewal Date',
  joinDate:'Join Date', salarySAR:'Salary (SAR)', bankName:'Bank Name',
  bankAccount:'Bank Account / IBAN', newAdvance:'+ New Advance / Loan',
  advanceStatus:'Status', pending:'Pending', repaid:'Repaid',
  deductedFromSalary:'Deducted from Salary', addAdvance:'Add Advance',
  employee:'Employee', overLimit:'OVER LIMIT', currentOutstanding:'Current Outstanding',
  editLimit:'Edit Limit', creditLimits:'Customer Credit Limits',
  creditLimitsDesc:'Set maximum credit limit for each customer. System will warn if outstanding exceeds this limit.',
  supplierStatement:'Supplier Statements', supplierStatementsDesc:'Vendor balances and payment history.',
  multiBranch:'Multi-Branch Overview', multiBranchDesc:'Compare performance across all branches.',
  totalSales:'Total Sales', aiPricing:'AI Pricing Calculator',
  aiPricingDesc:'Enter your cost price and desired margin. The AI will suggest the optimal selling price.',
  costPrice:'Cost Price (SAR)', desiredMargin:'Desired Margin (%)',
  vatRatePct:'VAT Rate (%)', suggestedStrategy:'Suggested Pricing Strategy',
  suggestedSellPrice:'Suggested Sell Price', expectedProfit:'Expected Profit',
  vatAmount:'VAT Amount', finalInvoiceTotal:'Final Invoice Total',
  cashBalance:'Cash Balance', bankBal:'Bank Balance', investorNet:'Investor Net',
  cashIn:'Cash In', cashOut:'Cash Out', allTypes:'All Types',
  cashInType:'Cash-In', cashOutType:'Cash-Out', bankInType:'Bank-In',
  bankOutType:'Bank-Out', investorInType:'Investor-In', investorOutType:'Investor-Out',
  searchTransactions:'Search transactions...', searchRefunds:'Search refunds...',
  searchCustomers:'Search customers...', searchCorporates:'Search corporates...',
  searchVendors:'Search vendors...', searchExpenses:'Search expenses...',
  searchEmployees:'Search employees...', totalExpenses:'Total Expenses',
  count:'Count', totalRefunds:'Total Refunds', refundedToCustomers:'Refunded to Customers',
  refundedToPortals:'Refunded to Portals', totalPortals:'Total Portals',
  depositNote:'e.g. deposited daily cash sales to bank',
  prevBooking:'Previous Booking / Store Credit', availableStoreCredit:'Available Store Credit',
  linkPreviousRefund:'Link a previous refund', noLinkedBooking:'— No linked booking —',
  oldTicket:'Old ticket', originalPrice:'Original price',
  refundedToCustomer:'Refunded to customer', companyKept:'company kept',
  linkedReason:'Reason', invoiceDesign:'Invoice Design',
  refundNo:'Refund No', custRefund:'Cust Refund', portalRefund:'Portal Refund',
  originalInv:'Original Inv', noRefunds:'No Refunds Found',
  clickRefund:'Click the refund button on any invoice to create one!',
  transferNote:'Note', rows:'rows', showing:'Showing', of:'of',
  prev:'Prev', next:'Next', noData:'No data found',
  backToDashboard:'Back to Dashboard', pageUnderDev:'Page Under Development',
  totalPaid:'Total Paid', totalDue:'Total Due', totalProfit:'Total Profit',
  unpaidInvoices:'Unpaid Invoices', netProfit:'Net Profit',
  portalBalances:'Portal Balances', quickActions:'Quick Actions',
  recentInvoices:'Recent Invoices', invDate:'Inv Date', airlineCol:'Airline',
  serviceCol:'Service', statusCol:'Status', actionsCol:'Actions',
  addPassengerBtn:'+ Add Passenger', passengerName:'Passenger name',
  linkedBookingDesc:'Link a previous refund (shows old booking + refund on this invoice)',
  oldPrice:'Original price', refundAmount:'Refunded to customer',
  companyKeptAmount:'company kept', reason:'Reason',
  nameCol:'Name', phoneCol:'Phone', typeCol:'Type',
  creditBalCol:'Credit Balance', creditLimitCol:'Credit Limit',
  vatNoCol:'VAT No', addressCol:'Address',
  priceCol:'Price', durationCol:'Duration', inclusionsCol:'Inclusions',
  locationCol:'Location', managerCol:'Manager', emailCol:'Email',
  timingCol:'Timing', salaryCol:'Salary', commissionCol:'Commission %',
  iqamaCol:'IQAMA', titleCol:'Title', expiryCol:'Expiry',
  maktabCol:'Maktab Amal', dateCol:'Date', typeCol:'Type',
  descCol:'Description', paymentCol:'Payment', amountCol:'Amount',
  fromCol:'From', toCol:'To', noteCol:'Note',
  dateTypeCol:'Date/Time', userCol:'User', actionCol:'Action',
  emailCol:'Email', usernameCol:'Username', linkedEmpCol:'Linked Employee',
  permsCol:'Permissions', balanceCol:'Balance',
  currentOutstandingCol:'Current Outstanding', limitCol:'Credit Limit',
  actionCol:'Action', vendorCol:'Vendor',
  phoneCol:'Phone', balanceDueCol:'Balance Due',
  empCol:'Employee', amountCol:'Amount', statusCol:'Status',
  actionCol:'Actions', branchName:'Branch Name', branchManager:'Manager',
  branchStatus:'Status', branchSales:'Total Sales',
  sar:'SAR', daysLeft:'days left', expired:'EXPIRED',
  noLinkedBookingMsg:'— No linked booking —',
  storeCreditMsg:'available', exceedsMsg:'⚠️ Exceeds available credit balance',
  useMaxBtn:'Use max available', linkedBookingTitle:'🔗 Previous Booking / Store Credit',
  bookingInfoTitle:'📅 Booking Info', serviceDetailsTitle:'🛫 Service Details',
  pricingTitle:'💰 Pricing', paymentTitle:'💳 Payment',
  todayTitle:'Today', leaveReqTitle:'Request Leave',
  historyTitle:'History (last 60)', directoryTitle:'👤 Directory',
  advancesTitle:'💵 Advances', mistakesTitle:'⚠️ Mistakes/Deductions',
  payrollTitle:'🧾 Payroll & Slips', addEmpTitle:'+ Add Employee',
  editEmpTitle:'Edit Employee', newAdvTitle:'+ New Advance / Loan',
  advancesTableTitle:'Pending Advances', mistakesTableTitle:'Mistake History',
  payrollTableTitle:'Salary Slip History',
  invNoShort:'Inv No', pax:'Pax', paidLabel:'Paid',
  dueLabel:'Due', profitLabel:'Profit', profitAmtLabel:'Profit',
  costLabel:'Cost', sellLabel:'Sell', vatLabel:'VAT',
  grandTotalLabel:'Grand Total', dueAfterPaidLabel:'Due After Paid',
  cancelEditBtn:'✕ Cancel Edit', generateInvBtn:'✅ Generate Invoice',
  updateInvBtn:'💾 Update Invoice', checkInBtn:'🟢 Check In',
  checkOutBtn:'🔴 Check Out', submitLeaveBtn:'Submit Request',
  saveChangesBtn:'💾 Save Changes', addEmpBtn:'Add Employee',
  addAdvanceBtn:'Add Advance', settleBtn:'💰 Settle',
  exportBtn:'📥 Export', printBtn:'🖨 Print',
  editBtn:'✏️', deleteBtn:'🗑', refundBtn:'🔄',
  previewBtn:'👁', quickSettleBtn:'💰',
  createRefundBtn:'Create Refund', convertToInvBtn:'Convert to Invoice',
  approveBtn:'Approve', rejectBtn:'Reject', returnedBtn:'Returned',
  deductFromSalary:'Deducted from Salary', suspendBtn:'⏸ Suspend',
  activateBtn:'▶ Activate', deleteBtnShort:'Delete',
  createAgencyBtn:'🚀 Create Agency & Generate Password',
  createQuoteBtn:'Generate Quotation', payBtn:'Pay',
  logLossBtn:'Log Loss', rechargeBtn:'Recharge',
  createRecurringBtn:'Create', downloadSlipBtn:'Download Slip',
  previewSlipBtn:'Preview Slip', editLimitBtn:'Edit Limit',
  saveLimitBtn:'Save', exportBankBtn:'📥 Export Bank Statement',
  exportCashBtn:'📥 Export Cash Statement', exportMistakesBtn:'Export Excel',
  exportRefundBtn:'Export Excel', exportVendorsBtn:'Export Vendors',
  exportPackagesBtn:'Export Packages', exportBranchesBtn:'Export Branches',
  exportPortalsBtn:'Export Portals', exportPayrollBtn:'Export Payroll',
  exportInvestmentsBtn:'Export Investments', exportCashbookBtn:'Export Cashbook',
  searchPlaceholder:'Search...', dateFilterPlaceholder:'Filter by date',
  invNoPlaceholder:'Search by invoice #, customer, airline, PNR...',
  refundPlaceholder:'Search refunds...', customerPlaceholder:'Search customers...',
  corporatePlaceholder:'Search corporates...', vendorPlaceholder:'Search vendors...',
  creditorPlaceholder:'Search...', packagePlaceholder:'Search packages...',
  branchPlaceholder:'Search branches...', employeePlaceholder:'Search employees...',
  expensePlaceholder:'Search expenses...', logPlaceholder:'Search logs...',
  amountPlaceholder:'Amount', descPlaceholder:'Description',
  namePlaceholder:'Name', phonePlaceholder:'Phone',
  emailPlaceholder:'Email', addressPlaceholder:'Address',
  passwordPlaceholder:'Minimum 6 characters',
  confirmPassPlaceholder:'Confirm new password',
  oldPassPlaceholder:'Old Password', newPassPlaceholder:'New Password',
  usernamePlaceholder:'Username', agencyNamePlaceholder:'Agency Name (English) *',
  companyNameArPlaceholder:'Company Name (Arabic)',
  ownerEmailPlaceholder:'Owner Email *',
  subEndDatePlaceholder:'Subscription End Date *', vatNoPlaceholder:'VAT Number',
  crNoPlaceholder:'CR Number', locationPlaceholder:'Location',
  managerPlaceholder:'Manager', timingPlaceholder:'Timing',
  jobTitlePlaceholder:'Job Title', nationalityPlaceholder:'Nationality',
  iqamaNoPlaceholder:'Iqama No', bankNamePlaceholder:'Bank Name',
  bankAccountPlaceholder:'Bank Account / IBAN', salaryPlaceholder:'Base Salary',
  commissionPlaceholder:'Commission %', roleName:'Role',
  customerTypeRole:'Customer Type', individualRole:'Individual',
  corporateRole:'Corporate', serviceRole:'Service',
  flightTicketRole:'Flight Ticket', hotelRole:'Hotel',
  visaRole:'Visa', packageRole:'Package', otherRole:'Other',
  flightTypeRole:'Flight Type', domesticRole:'Domestic',
  internationalRole:'International', journeyRole:'Journey',
  singleRole:'Single', returnRole:'Return', multiCityRole:'Multi-City',
  bookingTypeRole:'Booking Type', newBookingRole:'New Booking',
  reissueRole:'Reissue', dateChangeRole:'Date Change',
  voidRole:'Void', paymentRole:'Payment Method',
  cashRole:'Cash', bankTransferRole:'Bank Transfer', cardRole:'Card',
  creditRole:'Credit', creditBalanceRole:'Credit Balance',
  tabbyRole:'Tabby', tamaraRole:'Tamara',
  ticketStatusRole:'Ticket Status', confirmedRole:'Confirmed',
  onHoldRole:'On Hold', cancelledRole:'Cancelled',
  refundableRole:'Refundable', nonRefundableRole:'Non-Refundable',
  visaTypeRole:'Visa Type', touristRole:'Tourist',
  businessRole:'Business', workRole:'Work', transitRole:'Transit',
  leaveTypeRole:'Leave Type', annualRole:'Annual',
  sickRole:'Sick', emergencyRole:'Emergency', unpaidLeaveRole:'Unpaid',
  advanceStatusRole:'Advance Status', pendingRole:'Pending',
  repaidRole:'Repaid', deductedFromSalaryRole:'Deducted from Salary',
  expenseApprovalRole:'Expense Approval', approvalStatusRole:'Approval Status',
  approvedRole:'Approved', rejectedRole:'Rejected',
  activeRole:'Active', suspendedRole:'Suspended',
  paidRole:'Paid', unpaidRole:'Unpaid',
  draftRole:'Draft', recurringRole:'Recurring',
  recurringIntervalRole:'Interval', monthlyRole:'Monthly',
  yearlyRole:'Yearly', weeklyRole:'Weekly',
  customerRole:'Customer', amountRole:'Amount (SAR)',
  intervalRole:'Interval', profilePicRole:'Update Profile Picture',
  usernameRole:'Username', phoneNumberRole:'Phone Number',
  addressFieldRole:'Address', saveProfileBtn:'💾 Save Profile Changes',
  changePasswordTitle:'🔒 Security', newPasswordRole:'New Password',
  changePassBtn:'🔑 Change Password', logoutBtn:'🚪 Logout',
  superAdminTitle:'👑 SuperAdmin Panel - Manage Agencies',
  superAdminDesc:'Create new travel agencies and manage their subscriptions.',
  addAgencyTitle:'➕ Add New Travel Agency',
  agencyNameLabel:'Agency Name (English) *',
  companyNameArLabel:'Company Name (Arabic)',
  ownerEmailLabel:'Owner Email *',
  subEndDateLabel:'Subscription End Date *', vatNoLabel:'VAT Number',
  crNoLabel:'CR Number', phoneLabel:'Phone', addressLabel:'Address',
  activeStatus:'✅ Active', suspendedStatus:'❌ Suspended',
  profitabilityTitle:'📊 Ticket Profitability Analyzer',
  profitabilityDesc:'Analyze which airlines or services are generating the most profit.',
  airlineServiceCol:'Airline / Service', ticketsSoldCol:'Tickets Sold',
  totalRevCol:'Total Revenue', totalCostCol:'Total Cost',
  netProfitCol:'Net Profit', noInvoiceData:'No invoice data available.',
  refundStatementTitle:'📊 Refund Statement & Earnings',
  refundStatementDesc:'Track refunds from airlines and calculate office profit margins.',
  portalWiseBreakdown:'Portal-wise Refund Breakdown',
  noRefundsRecorded:'No refunds recorded yet.', companyRefund:'Company Refund',
  customerRefundCol:'Customer Refund', officeEarned:'Office Earned',
  customerStatementTitle:'📊 Customer Statement',
  selectCustomerLabel:'Select Customer to View Statement',
  selectCustomerPlaceholder:'Select Customer',
  transactionHistory:'Transaction History', txnDateCol:'Date',
  txnInvNoCol:'Invoice No', txnDebitCol:'Debit (Inv)',
  txnCreditCol:'Credit (Paid)', txnBalanceCol:'Balance',
  downloadStatementBtn:'Download Statement', noTxnFound:'No transactions found.',
  recurringInvoicesTitle:'🔁 Recurring Invoices',
  setupRecurringTitle:'Setup Recurring Profile', customerLabel:'Customer',
  amountLabel:'Amount (SAR)', intervalLabel:'Interval',
  createBtn:'Create', profileIdCol:'Profile ID',
  intervalCol:'Interval', amountCol:'Amount',
  noRecurringProfiles:'No recurring profiles found.',
  expenseApprovalTitle:'🛡️ Expense Approval System',
  expenseApprovalDesc:'Expenses created by staff will appear here for Admin approval.',
  pendingExpenses:'Pending expenses for approval.', vendorCol:'Vendor',
  expenseAmountCol:'Amount', statusCol:'Status',
  approveAction:'Approve', rejectAction:'Reject',
  noPendingExpenses:'No pending expenses for approval.',
  notificationsTitle:'🔔 Notifications & Alerts Center',
  pendingInvoicesAlert:'Pending Invoices',
  pendingInvoicesMsg:'has a due amount of',
  expenseApprovalAlert:'Expense Approvals',
  expenseApprovalMsg:'needs approval.',
  lowPortalBalancesAlert:'Low Portal Balances',
  lowPortalBalancesMsg:'balance is low:',
  noPendingInvoices:'No pending invoices.',
  noExpenseApprovals:'No expenses pending.',
  allPortalsHealthy:'All portals are healthy.',
  staffMistakesTitle:'⚠️ Staff Mistakes & Loss Tracking',
  staffMistakesDesc:'If a ticket is wasted due to an employee\'s mistake, log it here. The loss amount will be automatically deducted from their salary if marked as "Paid by Employee".',
  logNewMistakeTitle:'Log New Mistake / Loss',
  selectEmployeeLabel:'Employee', oldTicketNoLabel:'Old Ticket No',
  newTicketNoLabel:'New Ticket No', lossAmountLabel:'Loss Amount (SAR)',
  deductFromSalaryLabel:'Deduct from Salary', logLossBtn:'Log Loss',
  mistakeHistoryTitle:'Mistake History', dateCol:'Date',
  employeeCol:'Employee', oldTicketCol:'Old Ticket',
  newTicketCol:'New Ticket', lossAmountCol:'Loss Amount',
  salaryDeductedCol:'Salary Deducted', yesLabel:'Yes',
  noLabel:'No', aiDashboardTitle:'🤖 AI ERP Assistant',
  aiDashboardDesc:'Real-time business insights based on your data.',
  monthlySales:'Monthly Sales', netProfit:'Net Profit',
  pendingDues:'Pending Dues', aiInsightsTitle:'🧠 AI Insights & Action Items',
  noAlerts:'No critical alerts. Business is running smoothly!',
  quotationTitle:'📄 Quotation Management',
  quotationDesc:'Create draft quotes and convert them to invoices when confirmed.',
  createQuotationTitle:'Create New Quotation', customerNameLabel:'Customer Name',
  serviceTypeLabel:'Service Type', estimatedPriceLabel:'Estimated Price (SAR)',
  validUntilLabel:'Valid Until', recentQuotationsTitle:'Recent Quotations (Drafts)',
  quoteNoCol:'Quote No', quoteServiceCol:'Service',
  quoteAmountCol:'Amount', quoteActionCol:'Action',
  convertToInvoiceBtn:'Convert to Invoice', noQuotations:'No quotations found.',
  hrAdvancedTitle:'🎯 Employee Targets & Performance',
  targetCol:'Target (SAR)', achievedCol:'Achieved (SAR)',
  percentageCol:'Percentage', saveBtn:'Save',
  editBtn2:'Edit', dailyAttendanceTitle:'📅 Daily Time-Based Attendance & Leave',
  attendanceDesc:'Mark Check-in and Check-out time. System will automatically calculate Overtime (>9 hrs) and Salary Deduction (<8 hrs).',
  markAttendanceTitle:'Mark Attendance', otNote:'Overtime after 9 hours',
  deductionNote:'Deduction if less than 8 hours',
  attendanceHistoryTitle:'Attendance History', checkInCol:'Check-In',
  checkOutCol:'Check-Out', overtimeCol:'Overtime',
  deductionCol:'Deduction', noAttendanceHistory:'No attendance marked yet.',
  paySalaryTitle:'💰 Pay Salary',
  paySalaryDesc:'Select Employee to Auto-Fill Basic Salary & Pending Advances. Commission & Overtime will auto-calculate from Sales & Attendance.',
  baseCol:'Base', advDedCol:'Adv. Deduct',
  giftCol:'Gift', monthCol:'Month', modeCol:'Mode',
  payBtn:'Pay', salarySlipTitle:'📋 Generate Salary Slip',
  employeeCol:'Employee', monthCol:'Month',
  netPaidCol:'Net Paid', actionCol:'Action',
  downloadSlipBtn:'Download Slip', noSalaryPaid:'No salary paid yet.',
  corporateContractTitle:'📄 Corporate Contract Generator',
  corporateOfferTitle:'📋 Corporate Offer Generator',
  settingsTitle:'⚙️ Settings', reportsTitle:'📊 Reports',
  statementsTitle:'📑 Statements', bankTitle:'🏦 Bank & Cash',
  investTitle:'🏦 Investors', usersTitle:'👥 Users',
  auditTitle:'📜 Audit Logs', creditTitle:'💳 Credit Balances',
  profitabilityTitle:'📊 Profitability', profileTitle:'👤 Profile',
  superadminTitle:'👑 SuperAdmin', notificationsTitle:'🔔 Notifications',
  aiDashboardTitle:'🤖 AI Dashboard', quotationsTitle:'📄 Quotations',
  hrAdvancedTitle:'🎯 HR & Payroll', aiPricingTitle:'🤖 AI Pricing',
  myAttendanceTitle:'⏰ My Attendance', creditLimitsTitle:'💳 Credit Limits',
  customerStatementTitle:'📊 Customer Statement',
  refundStatementTitle:'🔄 Refund Statement', supplierStatementTitle:'📦 Supplier Statement',
  multiBranchTitle:'🏢 Multi-Branch',
  recurringInvoicesTitle:'🔁 Recurring Invoices',
  expenseApprovalTitle:'🛡 Expense Approval',
  staffMistakesTitle:'⚠️ Staff Mistakes', expensesTitle:'💸 Expenses',
  reportsTitle:'📊 Reports', aiPricingTitle:'🤖 AI Pricing',
  invoiceNumber:'Invoice Number', customerInfo:'Customer Information',
  supplierInfo:'Supplier Information', ticketDetails:'Ticket Details',
  paymentDetails:'Payment Details', totalDetails:'Total Details',
  vatDetails:'VAT Details', footerDetails:'Footer Details',
  printDate:'Print Date', sar:'SAR',
  thankYou:'Thank you for your business!'
};

const ar = {
  dashboard:'لوحة التحكم', create:'إنشاء فاتورة', list:'الفواتير', refunds:'الاسترجاعات',
  customers:'العملاء', corporates:'الشركات', creditors:'الدائنون', credit:'أرصدة مستحقة',
  vendors:'الموردون', packages:'الباقات', branches:'الفروع', portals:'البوابات',
  bank:'البنك والصندوق', invest:'المستثمرون', hr:'الموارد البشرية', users:'المستخدمون',
  settings:'الإعدادات', reports:'التقارير', audit:'سجل التدقيق', statements:'كشوفات',
  contract:'عقد شركات', offer:'عرض شركات', superadmin:'المدير العام',
  profile:'الملف الشخصي', profitability:'الربحية', notifications:'الإشعارات',
  ai_dashboard:'لوحة ذكية', quotations:'عروض أسعار', hr_advanced:'الرواتب',
  ai_pricing:'تسعير ذكي', my_attendance:'حضوري', credit_limits:'حدود الائتمان',
  customer_statement:'كشف عميل', refund_statement:'كشف استرجاع',
  supplier_statement:'كشف مورد', multi_branch:'متعدد الفروع',
  recurring_invoices:'فواتير متكررة', expense_approval:'اعتماد مصروفات',
  staff_mistakes:'أخطاء الموظفين', expenses:'المصروفات', editInvoice:'تعديل الفاتورة',
  generateInvoice:'إنشاء الفاتورة', updateInvoice:'تحديث الفاتورة', custType:'نوع العميل',
  individual:'فرد', corporate:'شركة', selectCustomer:'اختر العميل',
  customerPhone:'هاتف العميل', passengers:'الركاب', addPassenger:'+ إضافة راكب',
  portal:'البوابة', service:'الخدمة', flightTicket:'تذكرة طيران', hotel:'حجز فندق',
  tourPackage:'باقة سياحية', visitVisa:'تأشيرة زيارة', umrahVisa:'تأشيرة عمرة',
  newService:'خدمة جديدة', flightType:'نوع الرحلة', domestic:'داخلي',
  international:'دولي', airline:'خط الطيران', sector:'القطاع', pnr:'رقم الحجز',
  ticketNo:'رقم التذكرة', qty:'الكمية', cost:'التكلفة', sell:'البيع', discount:'الخصم',
  vatRate:'نسبة الضريبة', invoiceDate:'تاريخ الفاتورة', bookingType:'نوع الحجز',
  newBooking:'حجز جديد', reissue:'إعادة إصدار', extraLuggage:'أمتعة إضافية',
  previousBooking:'حجز سابق', salesPerson:'موظف المبيعات', paymentMethod:'طريقة الدفع',
  cash:'نقداً', bankTransfer:'تحويل بنكي', card:'بطاقة', credit:'آجل',
  creditBalance:'رصيد مستحق', tabby:'تابي', tamara:'تمارة', paidAmount:'المبلغ المدفوع',
  invNo:'رقم الفاتورة', total:'الإجمالي', due:'المتبقي', method:'الطريقة',
  actions:'إجراءات', preview:'معاينة', print:'طباعة', edit:'تعديل', delete:'حذف',
  refund:'استرجاع', quickSettle:'تسوية', download_excel:'تصدير', save:'حفظ', add:'إضافة',
  search:'بحث...', changePass:'تغيير كلمة المرور', logout:'تسجيل خروج',
  selectEmployee:'اختر الموظف', attendanceDate:'التاريخ', status:'الحالة',
  present:'حاضر', leave:'إجازة', absent:'غائب', checkInTime:'وقت الحضور',
  checkOutTime:'وقت الانصراف', overtime:'إضافي', deduction:'خصم', mark:'تسجيل',
  baseSalary:'الراتب الأساسي', commission:'العمولة %', advDed:'خصم سلفة',
  gift:'هدية/مكافأة', month:'الشهر', mode:'الطريقة', paySalary:'دفع الراتب',
  generateSlip:'إنشاء قسيمة', target:'الهدف (ريال)', achieved:'المحقق',
  percentage:'%', balance:'الرصيد', noInvoices:'لا توجد فواتير',
  createFirst:'أنشئ فاتورة للبدء!', allStatus:'جميع الحالات',
  paid:'مدفوعة', unpaid:'غير مدفوعة', totalInvoices:'إجمالي الفواتير',
  totalRevenue:'إجمالي الإيرادات', outstanding:'المستحق',
  netPosition:'الصافي', portalBalance:'رصيد البوابات',
  totalCustomers:'إجمالي العملاء', quickActions:'إجراءات سريعة',
  viewInvoices:'عرض الفواتير', attendance:'الحضور',
  recentInvoices:'الفواتير الأخيرة', date:'التاريخ',
  customer:'العميل', name:'الاسم', phone:'الهاتف', type:'النوع',
  creditBal:'رصيد مستحق', creditLimit:'حد الائتمان',
  vatNo:'الرقم الضريبي', address:'العنوان',
  price:'السعر', duration:'المدة', inclusions:'يشمل', location:'الموقع',
  manager:'المدير', email:'البريد', timing:'المواعيد',
  role:'الدور', salary:'الراتب', commissionPct:'نسبة العمولة %',
  iqama:'الإقامة', description:'الوصف', payment:'الدفع', amount:'المبلغ',
  from:'من', to:'إلى', note:'ملاحظة', transfer:'تحويل',
  fundTransfer:'تحويل أموال', dateTime:'التاريخ/الوقت',
  user:'المستخدم', action:'الإجراء', searchLogs:'بحث في السجلات...',
  addUser:'+ إضافة مستخدم', editUser:'تعديل المستخدم', username:'اسم المستخدم',
  linkEmployee:'ربط بموظف', permissions:'الصلاحيات',
  admin:'مدير', invoices:'الفواتير', bank:'البنك',
  hr:'الموارد البشرية', reports:'التقارير', settings:'الإعدادات',
  saveChanges:'حفظ التغييرات', cancel:'إلغاء',
  cancelEdit:'إلغاء التعديل', none:'— لا يوجد —',
  newCustomer:'+ عميل جديد', customerName:'اسم العميل',
  existingCustomer:'عميل موجود', newCorporate:'+ شركة جديدة',
  existingCorporate:'شركة موجودة', companyName:'اسم الشركة',
  bookingInfo:'معلومات الحجز', bookingDate:'تاريخ الحجز',
  serviceDetails:'تفاصيل الخدمة', journey:'الرحلة', single:'اتجاه واحد',
  returnFlight:'ذهاب وعودة', multiCity:'مدن متعددة',
  sectorPlaceholder:'القطاع (مثل: الرياض-جدة)', refundable:'قابل للاسترجاع',
  nonRefundable:'غير قابل للاسترجاع',
  ticketStatus:'حالة التذكرة', confirmed:'مؤكد', onHold:'معلق',
  cancelled:'ملغي', pricing:'التسعير', qty:'الكمية',
  costUnit:'التكلفة / وحدة (ريال)', sellUnit:'البيع / وحدة (ريال)',
  discountSAR:'الخصم (ريال)', vatPct:'نسبة الضريبة %',
  sellAfterDisc:'البيع (بعد الخصم)', vat:'الضريبة',
  grandTotal:'الإجمالي', profit:'الربح',
  dueAfterPaid:'المتبقي بعد الدفع', paymentMethod:'طريقة الدفع',
  amountPaidNow:'المبلغ المدفوع الآن (ريال)', creditDueDate:'تاريخ الاستحقاق',
  creditor:'الدائن', useCredit:'استخدام الرصيد (ريال)',
  available:'متاح', exceedsCredit:'⚠️ يتجاوز الرصيد المتاح',
  useMaxAvailable:'استخدم الحد الأقصى المتاح',
  tabbyOrderNo:'رقم طلب تابي', tamaraOrderNo:'رقم طلب تمارة',
  today:'اليوم', checkIn:'تسجيل الحضور', checkOut:'تسجيل الانصراف',
  notMarked:'لم يسجل', checkInAt:'تم تسجيل الحضور في',
  checkOutAt:'تم تسجيل الانصراف في',
  requestLeave:'طلب إجازة', leaveType:'نوع الإجازة',
  annual:'سنوية', sick:'مرضية', emergency:'طوارئ',
  unpaidLeave:'بدون راتب', leaveTo:'إلى',
  submitRequest:'تقديم الطلب', history:'السجل',
  last60:'السجل (آخر 60)', loading:'جاري التحميل…',
  noAttendance:'لا توجد سجلات حضور بعد.',
  accountNotLinked:'الحساب غير مربوط',
  accountNotLinkedMsg:'حسابك غير مربط بسجل موظف بعد. اطلب المدير تعيين employee_id في المستخدمين.',
  directory:'الدليل', advances:'السلف',
  mistakesDeductions:'الأخطاء/الخصومات',
  payrollSlips:'الرواتب وقسائم الدفع', addEmployee:'+ إضافة موظف',
  editEmployee:'تعديل الموظف', fullName:'الاسم الكامل',
  jobTitle:'المسمى الوظيفي', nationality:'الجنسية',
  nationalId:'رقم الهوية / رقم الإقامة',
  iqamaExpiry:'انتهاء الإقامة',
  maktabAmal:'تاريخ تجديد مكتب العمل',
  joinDate:'تاريخ الالتحاق', salarySAR:'الراتب (ريال)',
  bankName:'اسم البنك', bankAccount:'الحساب البنكي / آيبان',
  newAdvance:'+ سلفة / قرض جديد',
  advanceStatus:'الحالة', pending:'معلق',
  repaid:'مسدد', deductedFromSalary:'خصم من الراتب',
  addAdvance:'إضافة سلفة',
  employee:'الموظف', overLimit:'تجاوز الحد',
  currentOutstanding:'المستحق الحالي', editLimit:'تعديل الحد',
  creditLimits:'حدود ائتمان العملاء',
  creditLimitsDesc:'حدد الحد الأقصى للائتمان لكل عميل.',
  supplierStatement:'كشوفات الموردين',
  supplierStatementsDesc:'أرصدة الموردين وسجل المدفوعات.',
  multiBranch:'نظرة متعددة الفروع',
  multiBranchDesc:'مقارنة الأداء عبر جميع الفروع.',
  totalSales:'إجمالي المبيعات', aiPricing:'حاسبة التسعير الذكي',
  aiPricingDesc:'أدخل سعر التكلفة والهامش المطلوب. سيقترح الذكاء الاصطناعي سعر البيع الأمثل.',
  costPrice:'سعر التكلفة (ريال)', desiredMargin:'الهامش المطلوب (%)',
  vatRatePct:'نسبة الضريبة (%)', suggestedStrategy:'استراتيجية التسعير المقترحة',
  suggestedSellPrice:'سعر البيع المقترح', expectedProfit:'الربح المتوقع',
  vatAmount:'مبلغ الضريبة', finalInvoiceTotal:'إجمالي الفاتورة النهائي',
  cashBalance:'رصيد الصندوق', bankBal:'رصيد البنك',
  investorNet:'صافي المستثمرين', cashIn:'وارد صندوق',
  cashOut:'صادر صندوق', allTypes:'جميع الأنواع',
  cashInType:'وارد صندوق', cashOutType:'صادر صندوق',
  bankInType:'وارد بنك', bankOutType:'صادر بنك',
  investorInType:'وارد مستثمر', investorOutType:'صادر مستثمر',
  searchTransactions:'بحث في المعاملات...', searchRefunds:'بحث في الاسترجاعات...',
  searchCustomers:'بحث في العملاء...', searchCorporates:'بحث في الشركات...',
  searchVendors:'بحث في الموردين...', searchExpenses:'بحث في المصروفات...',
  searchEmployees:'بحث في الموظفين...', totalExpenses:'إجمالي المصروفات',
  count:'العدد', totalRefunds:'إجمالي الاسترجاعات',
  refundedToCustomers:'المسترجع للعملاء',
  refundedToPortals:'المسترجع للبوابات', totalPortals:'إجمالي البوابات',
  depositNote:'مثل: إيداع مبيعات الصندوق اليومية في البنك',
  prevBooking:'الحجز السابق / الرصيد المستحق',
  availableStoreCredit:'الرصيد المستحق المتاح',
  linkPreviousRefund:'ربط استرجاع سابق',
  noLinkedBooking:'— لا يوجد حجز مربوط —',
  oldTicket:'التذكرة القديمة', originalPrice:'السعر الأصلي',
  refundedToCustomer:'المسترجع للعميل',
  companyKept:'احتفظت به الشركة', linkedReason:'السبب',
  invoiceDesign:'تصميم الفاتورة', professionalInvoice:'فاتورة احترافية',
  refundNo:'رقم الاسترجاع', custRefund:'استرجاع العميل',
  portalRefund:'استرجاع البوابة', originalInv:'الفاتورة الأصلية',
  noRefunds:'لا توجد استرجاعات',
  clickRefund:'اضغط على زر الاسترجاع في أي فاتورة لإنشاء واحدة!',
  transferNote:'ملاحظة', rows:'صفوف',
  showing:'عرض', of:'من', prev:'السابق',
  next:'التالي', noData:'لا توجد بيانات',
  backToDashboard:'العودة للوحة',
  pageUnderDev:'الصفحة قيد التطوير', totalPaid:'المدفوع',
  totalDue:'المتبقي', totalProfit:'الربح',
  unpaidInvoices:'فواتير غير مدفوعة', netProfit:'صافي الربح',
  portalBalances:'أرصدة البوابات', quickActions:'إجراءات سريعة',
  recentInvoices:'الفواتير الأخيرة',
  invDate:'تاريخ الفاتورة', airlineCol:'خط الطيران',
  serviceCol:'الخدمة', statusCol:'الحالة',
  actionsCol:'إجراءات', addPassengerBtn:'+ إضافة راكب',
  passengerName:'اسم الراكب',
  linkedBookingDesc:'ربط استرجاع سابق (يظهر الحجز القديم + الاسترجاع في هذه الفاتورة)',
  oldPrice:'السعر الأصلي', refundAmount:'المسترجع للعميل',
  companyKeptAmount:'احتفظت به الشركة', reason:'السبب',
  nameCol:'الاسم', phoneCol:'الهاتف', typeCol:'النوع',
  creditBalCol:'رصيد مستحق', creditLimitCol:'حد الائتمان',
  vatNoCol:'الرقم الضريبي', addressCol:'العنوان',
  priceCol:'السعر', durationCol:'المدة', inclusionsCol:'يشمل',
  locationCol:'الموقع', managerCol:'المدير', emailCol:'البريد',
  timingCol:'المواعيد', salaryCol:'الراتب',
  commissionCol:'نسبة العمولة %', iqamaCol:'الإقامة',
  titleCol:'العنوان', expiryCol:'انتهاء الصلاحية',
  maktabCol:'مكتب العمل', dateCol:'التاريخ', typeCol:'النوع',
  descCol:'الوصف', paymentCol:'الدفع',
  amountCol:'المبلغ', fromCol:'من', toCol:'إلى',
  noteCol:'ملاحظة', dateTypeCol:'التاريخ/الوقت',
  userCol:'المستخدم', actionCol:'الإجراء',
  emailCol:'البريد', usernameCol:'اسم المستخدم',
  linkedEmpCol:'الموظف المربوط', permsCol:'الصلاحيات',
  balanceCol:'الرصيد', currentOutstandingCol:'المستحق الحالي',
  limitCol:'حد الائتمان', actionCol:'الإجراء',
  vendorCol:'المورد', phoneCol:'الهاتف',
  balanceDueCol:'رصيد المستحق',
  empCol:'الموظف', amountCol:'المبلغ', statusCol:'الحالة',
  actionCol:'الإجراءات', branchName:'اسم الفرع',
  branchStatus:'الحالة', branchSales:'إجمالي المبيعات',
  sar:'ريال', daysLeft:'أيام متبقية', expired:'منتهية',
  noLinkedBookingMsg:'— لا يوجد حجز مربوط —',
  storeCreditMsg:'متاح', exceedsMsg:'⚠️ يتجاوز الرصيد المتاح',
  useMaxBtn:'استخدم الحد الأقصى المتاح',
  linkedBookingTitle:'🔗 الحجز السابق / الرصيد المستحق',
  bookingInfoTitle:'📅 معلومات الحجز',
  serviceDetailsTitle:'🛫 تفاصيل الخدمة',
  pricingTitle:'💰 التسعير',
  paymentTitle:'💳 الدفع',
  todayTitle:'اليوم', leaveReqTitle:'طلب إجازة',
  historyTitle:'السجل (آخر 60)',
  directoryTitle:'👤 الدليل',
  advancesTitle:'💵 السلف',
  mistakesTitle:'⚠️ الأخطاء/الخصومات',
  payrollTitle:'🧾 الرواتب وقسائم الدفع',
  addEmpTitle:'+ إضافة موظف',
  editEmpTitle:'تعديل الموظف',
  newAdvTitle:'+ سلفة / قرض جديد',
  advancesTableTitle:'السلف المعلقة',
  mistakesTableTitle:'سجل الأخطاء',
  payrollTableTitle:'سجل قسائم الرواتب',
  invNoShort:'رقم الفاتورة', pax:'ركاب',
  paidLabel:'مدفوع', dueLabel:'المتبقي',
  profitLabel:'الربح', profitAmtLabel:'الربح',
  costLabel:'التكلفة', sellLabel:'البيع',
  vatLabel:'الضريبة', grandTotalLabel:'الإجمالي',
  dueAfterPaidLabel:'المتبقي بعد الدفع',
  cancelEditBtn:'✕ إلغاء التعديل',
  generateInvBtn:'✅ إنشاء الفاتورة',
  updateInvBtn:'💾 تحديث الفاتورة',
  checkInBtn:'🟢 تسجيل الحضور',
  checkOutBtn:'🔴 تسجيل الانصراف',
  submitLeaveBtn:'تقديم الطلب',
  saveChangesBtn:'💾 حفظ التغييرات',
  addEmpBtn:'إضافة موظف',
  addAdvanceBtn:'إضافة سلفة',
  settleBtn:'💰 تسوية',
  exportBtn:'📥 تصدير',
  printBtn:'🖨 طباعة',
  editBtn:'✏️', deleteBtn:'🗑',
  refundBtn:'🔄', quickSettleBtn:'💰',
  createRefundBtn:'إنشاء استرجاع',
  convertToInvBtn:'تحويل إلى فاتورة',
  approveBtn:'موافقة', rejectBtn:'رفض',
  returnedBtn:'مسترجع',
  deductFromSalary:'خصم من الراتب',
  suspendBtn:'⏸ تعليق', activateBtn:'▶ تفعيل',
  deleteBtnShort:'حذف', createAgencyBtn:'🚀 إنشاء وكالة وإنشاء كلمة مرور',
  createQuoteBtn:'إنشاء عرض سعر',
  payBtn:'دفع', logLossBtn:'تسجيل الخسارة',
  rechargeBtn:'إعادة الشحن', createRecurringBtn:'إنشاء',
  downloadSlipBtn:'تحميل القسيمة',
  previewSlipBtn:'معاينة القسيمة',
  editLimitBtn:'تعديل الحد', saveLimitBtn:'حفظ',
  exportBankBtn:'📥 تصدير كشف بنكي',
  exportCashBtn:'📥 تصدير كشف صندوق',
  exportMistakesBtn:'تصدير إكسل',
  exportRefundBtn:'تصدير إكسل',
  exportVendorsBtn:'تصدير الموردين',
  exportPackagesBtn:'تصدير الباقات',
  exportBranchesBtn:'تصدير الفروع',
  exportPortalsBtn:'تصدير البوابات',
  exportPayrollBtn:'تصدير الرواتب',
  exportInvestmentsBtn:'تصدير الاستثمارات',
  exportCashbookBtn:'تصدير دفتر الحسابات',
  searchPlaceholder:'بحث...',
  dateFilterPlaceholder:'تصفية بالتاريخ',
  invNoPlaceholder:'بحث برقم الفاتورة، العميل، الخط، PNR...',
  refundPlaceholder:'بحث في الاسترجاعات...',
  customerPlaceholder:'بحث في العملاء...',
  corporatePlaceholder:'بحث في الشركات...',
  vendorPlaceholder:'بحث في الموردين...',
  creditorPlaceholder:'بحث...',
  packagePlaceholder:'بحث في الباقات...',
  branchPlaceholder:'بحث في الفروع...',
  employeePlaceholder:'بحث في الموظفين...',
  expensePlaceholder:'بحث في المصروفات...',
  logPlaceholder:'بحث في السجلات...',
  amountPlaceholder:'المبلغ',
  descPlaceholder:'الوصف',
  namePlaceholder:'الاسم',
  phonePlaceholder:'الهاتف',
  emailPlaceholder:'البريد',
  addressPlaceholder:'العنوان',
  passwordPlaceholder:'6 أحرف على الأقل',
  confirmPassPlaceholder:'تأكيد كلمة المرور الجديدة',
  oldPassPlaceholder:'كلمة المرور القديمة',
  newPassPlaceholder:'كلمة المرور الجديدة',
  usernamePlaceholder:'اسم المستخدم',
  agencyNamePlaceholder:'اسم الوكالة (إنجليزي) *',
  companyNameArPlaceholder:'اسم الشركة (عربي)',
  ownerEmailPlaceholder:'بريد المالك *',
  subEndDatePlaceholder:'تاريخ انتهاء الاشتراك *',
  vatNoPlaceholder:'الرقم الضريبي',
  crNoPlaceholder:'الرقم التجاري',
  locationPlaceholder:'الموقع',
  managerPlaceholder:'المدير',
  timingPlaceholder:'المواعيد',
  jobTitlePlaceholder:'المسمى الوظيفي',
  nationalityPlaceholder:'الجنسية',
  iqamaNoPlaceholder:'رقم الإقامة',
  bankNamePlaceholder:'اسم البنك',
  bankAccountPlaceholder:'الحساب البنكي / آيبان',
  salaryPlaceholder:'الراتب الأساسي',
  commissionPlaceholder:'نسبة العمولة %',
  roleName:'الدور',
  customerTypeRole:'نوع العميل',
  individualRole:'فرد', corporateRole:'شركة',
  serviceRole:'الخدمة', flightTicketRole:'تذكرة طيران',
  hotelRole:'فندق', visaRole:'تأشيرة',
  packageRole:'باقة', otherRole:'أخرى',
  flightTypeRole:'نوع الرحلة', domesticRole:'داخلي',
  internationalRole:'دولي', journeyRole:'الرحلة',
  singleRole:'اتجاه واحد', returnRole:'ذهاب وعودة',
  multiCityRole:'مدن متعددة', bookingTypeRole:'نوع الحجز',
  newBookingRole:'حجز جديد', reissueRole:'إعادة إصدار',
  dateChangeRole:'تغيير التاريخ', voidRole:'إلغاء',
  paymentRole:'طريقة الدفع', cashRole:'نقداً',
  bankTransferRole:'تحويل بنكي', cardRole:'بطاقة',
  creditRole:'آجل', creditBalanceRole:'رصيد مستحق',
  tabbyRole:'تابي', tamaraRole:'تمارة',
  ticketStatusRole:'حالة التذكرة', confirmedRole:'مؤكد',
  onHoldRole:'معلق', cancelledRole:'ملغي',
  refundableRole:'قابل للاسترجاع',
  nonRefundableRole:'غير قابل للاسترجاع',
  visaTypeRole:'نوع التأشيرة', touristRole:'سياحية',
  businessRole:'أعمال', workRole:'عمل',
  transitRole:'عبور', leaveTypeRole:'نوع الإجازة',
  annualRole:'سنوية', sickRole:'مرضية',
  emergencyRole:'طوارئ', unpaidLeaveRole:'بدون راتب',
  advanceStatusRole:'حالة السلفة', pendingRole:'معلق',
  repaidRole:'مسدد', deductedFromSalaryRole:'خصم من الراتب',
  expenseApprovalRole:'اعتماد المصروفات', approvalStatusRole:'حالة الاعتماد',
  approvedRole:'موافق عليه', rejectedRole:'مرفوض',
  activeRole:'نشط', suspendedRole:'معلق',
  paidRole:'مدفوع', unpaidRole:'غير مدفوع',
  draftRole:'مسودة', recurringRole:'متكرر',
  recurringIntervalRole:'الفترة', monthlyRole:'شهرياً',
  yearlyRole:'سنوياً', weeklyRole:'أسبوعياً',
  customerRole:'العميل', amountRole:'المبلغ (ريال)',
  intervalRole:'الفترة', profilePicRole:'تحديث صورة الملف الشخصي',
  usernameRole:'اسم المستخدم', phoneNumberRole:'رقم الهاتف',
  addressFieldRole:'العنوان', saveProfileBtn:'💾 حفظ تغييرات الملف الشخصي',
  changePasswordTitle:'🔒 الأمان', newPasswordRole:'كلمة المرور الجديدة',
  changePassBtn:'🔑 تغيير كلمة المرور',
  logoutBtn:'🚪 تسجيل خروج',
  superAdminTitle:'👑 لوحة المدير العام - إدارة الوكالات',
  superAdminDesc:'إنشاء وكالات سفر جديدة وإدارة اشتراكاتها.',
  addAgencyTitle:'➕ إضافة وكالة جديدة للسفر',
  agencyNameLabel:'اسم الوكالة (إنجليزي) *',
  companyNameArLabel:'اسم الشركة (عربي)',
  ownerEmailLabel:'بريد المالك *',
  subEndDateLabel:'تاريخ انتهاء الاشتراك *',
  vatNoLabel:'الرقم الضريبي',
  crNoLabel:'الرقم التجاري', phoneLabel:'الهاتف',
  addressLabel:'العنوان', activeStatus:'✅ نشط',
  suspendedStatus:'❌ معلق',
  profitabilityTitle:'📊 محلل ربححية التذاكرة',
  profitabilityDesc:'تحليل أي الخطوط أو الخدمات التي تولد أكبر ربح.',
  airlineServiceCol:'الخط / الخدمة', ticketsSoldCol:'التذاكر المباعة',
  totalRevCol:'إجمالي الإيرادات', totalCostCol:'إجمالي التكلفة',
  netProfitCol:'صافي الربح', noInvoiceData:'لا توجد بيانات فواتير.',
  refundStatementTitle:'📊 كشف الاسترجاع والأرباح',
  refundStatementDesc:'تتبع الاسترجاعات من شركات الطيران واحسب هامش المكتب.',
  portalWiseBreakdown:'تفصيل الاسترجاع حسب البوابة',
  noRefundsRecorded:'لا توجد استرجاعات مسجلة بعد.',
  companyRefund:'استرجاع الشركة',
  customerRefundCol:'استرجاع العميل', officeEarned:'ربح المكتب',
  customerStatementTitle:'📊 كشف عميل',
  selectCustomerLabel:'اختر عميل لعرض الكشف',
  selectCustomerPlaceholder:'اختر العميل',
  transactionHistory:'سجل المعاملات', txnDateCol:'التاريخ',
  txnInvNoCol:'رقم الفاتورة', txnDebitCol:'مدين (الفاتورة)',
  txnCreditCol:'ائتمان (مدفوع)', txnBalanceCol:'الرصيد',
  downloadStatementBtn:'تحميل الكشف', noTxnFound:'لا توجد معاملات.',
  recurringInvoicesTitle:'🔁 الفواتير المتكررة',
  setupRecurringTitle:'إعداد ملف متكرر', customerLabel:'العميل',
  amountLabel:'المبلغ (ريال)', intervalLabel:'الفترة',
  createBtn:'إنشاء', profileIdCol:'معرف الملف',
  intervalCol:'الفترة', amountCol:'المبلغ',
  noRecurringProfiles:'لا توجد ملفات متكررة.',
  expenseApprovalTitle:'🛡 نظام اعتماد المصروفات',
  expenseApprovalDesc:'المصروفات التي ينشئها الموظفون ستظهر هنا للموافقة من قبل المدير.',
  pendingExpenses:'مصروفات معلقة للموافقة.',
  vendorCol:'المورد', expenseAmountCol:'المبلغ',
  statusCol:'الحالة',
  approveAction:'موافقة', rejectAction:'رفض',
  noPendingExpenses:'لا توجد مصروفات معلقة للموافقة.',
  notificationsTitle:'🔔 مركز الإشعارات والتنبيهات',
  pendingInvoicesAlert:'فواتير معلقة',
  pendingInvoicesMsg:'لديه مبلغ مستحق',
  expenseApprovalAlert:'اعتماد المصروفات',
  expenseApprovalMsg:'تحتاج موافقة.',
  lowPortalBalancesAlert:'أرصدة البوابات المنخفضة',
  lowPortalBalancesMsg:'رصيد منخفض:',
  noPendingInvoices:'لا توجد فواتير معلقة.',
  noExpenseApprovals:'لا توجد مصروفات معلقة.',
  allPortalsHealthy:'جميع البوابات سليمة.',
  staffMistakesTitle:'⚠️ تتبع أخطاء الموظفين والخسائر',
  staffMistakesDesc:'إذا هدرت تذكرة بسبب خطأ موظف، سجلها هنا. سيتم خصم مبلغ الخسارة من الراتب تلقائياً إذا تم تحديد "خصم من الراتب".',
  logNewMistakeTitle:'تسجيل خطأ / خسارة جديد',
  selectEmployeeLabel:'الموظف', oldTicketNoLabel:'رقم التذكرة القديمة',
  newTicketNoLabel:'رقم التذكرة الجديدة', lossAmountLabel:'مبلغ الخسارة (ريال)',
  deductFromSalaryLabel:'خصم من الراتب', logLossBtn:'تسجيل الخسارة',
  mistakeHistoryTitle:'سجل الأخطاء', dateCol:'التاريخ',
  employeeCol:'الموظف', oldTicketCol:'التذكرة القديمة',
  newTicketCol:'التذكرة الجديدة', lossAmountCol:'مبلغ الخسارة',
  salaryDeductedCol:'خصم من الراتب',
  yesLabel:'نعم', noLabel:'لا',
  aiDashboardTitle:'🤖 مساعد ERP الذكي',
  aiDashboardDesc:'رؤى أعمال فورية فورية بناءً على بياناتك.',
  monthlySales:'المبيعات الشهرية', netProfit:'صافي الربح',
  pendingDues:'المستحقات المعلقة',
  aiInsightsTitle:'🧠 رؤى الذكاء وبنود العمل',
  noAlerts:'لا تنبيهات حرجة. الأعمال تسير بسلاسة!',
  quotationTitle:'📄 إدارة عروض الأسعار',
  quotationDesc:'أنشئ مسودات عروض أسعار وحولها إلى فواتير عند التأكيد.',
  createQuotationTitle:'إنشاء عرض سعر جديد',
  customerNameLabel:'اسم العميل',
  serviceTypeLabel:'نوع الخدمة',
  estimatedPriceLabel:'السعر المقدر (ريال)',
  validUntilLabel:'صالح حتى',
  recentQuotationsTitle:'العروض الأخيرة (مسودات)',
  quoteNoCol:'رقم العرض', quoteServiceCol:'الخدمة',
  quoteAmountCol:'المبلغ', quoteActionCol:'الإجراء',
  convertToInvoiceBtn:'تحويل إلى فاتورة',
  noQuotations:'لا توجد عروض أسعار.',
  hrAdvancedTitle:'🎯 أهداف وأداء الموظفين',
  targetCol:'الهدف (ريال)', achievedCol:'المحقق (ريال)',
  percentageCol:'النسبة', saveBtn:'حفظ',
  editBtn2:'تعديل',
  dailyAttendanceTitle:'📅 الحضور اليومي بالوقت والإجازة',
  attendanceDesc:'سجل وقت الحضور والانصراف. سيحسب النظام تلقائياً الوقت الإضافي (>9 ساعات) وخصم الراتب (<8 ساعات).',
  markAttendanceTitle:'تسجيل الحضور', otNote:'الوقت الإضافي بعد 9 ساعات',
  deductionNote:'خصم الراتب إذا أقل من 8 ساعات',
  attendanceHistoryTitle:'سجل الحضور',
  checkInCol:'تسجيل الحضور', checkOutCol:'تسجيل الانصراف',
  overtimeCol:'إضافي', deductionCol:'خصم',
  noAttendanceHistory:'لم يتم تسجيل حضور بعد.',
  paySalaryTitle:'💰 دفع الراتب',
  paySalaryDesc:'اختر موظف لملء الراتب الأساسي والسلف المعلقة. العمولة والوقت الإضافي ستُحسب تلقائياً من المبيعات والحضور.',
  baseCol:'الأساسي', advDedCol:'خصم سلفة',
  giftCol:'هدية', monthCol:'الشهر',
  modeCol:'الطريقة', payBtn:'دفع',
  salarySlipTitle:'📋 إنشاء قسيمة راتب',
  employeeCol:'الموظف', monthCol:'الشهر',
  netPaidCol:'المدفوع الصافي',
  actionCol:'الإجراء',
  downloadSlipBtn:'تحميل القسيمة',
  noSalaryPaid:'لم يتم دفع رواتب بعد.',
  corporateContractTitle:'📄 مولد عقد شركات',
  corporateOfferTitle:'📋 مولد عرض الشركات',
  settingsTitle:'⚙️ الإعدادات',
  reportsTitle:'📊 التقارير',
  statementsTitle:'📑 الكشوفات',
  bankTitle:'🏦 البنك والصندوق',
  investTitle:'🏦 المستثمرون',
  usersTitle:'👥 المستخدمون',
  auditTitle:'📜 سجل التدقيق',
  creditTitle:'💳 الأرصدة المستحقة',
  profitabilityTitle:'📊 الربحية',
  profileTitle:'👤 الملف الشخصي',
  superadminTitle:'👑 المدير العام',
  notificationsTitle:'🔔 الإشعارات',
  aiDashboardTitle:'🤖 لوحة ذكية',
  quotationsTitle:'📄 عروض أسعار',
  hrAdvancedTitle:'🎯 الرواتب',
  aiPricingTitle:'🤖 التسعير الذكي',
  myAttendanceTitle:'⏰ حضوري',
  creditLimitsTitle:'💳 حدود الائتمان',
  customerStatementTitle:'📊 كشف عميل',
  refundStatementTitle:'🔄 كشف استرجاع',
  supplierStatementTitle:'📦 كشف مورد',
  multiBranchTitle:'🏢 متعدد الفروع',
  recurringInvoicesTitle:'🔁 فواتير متكررة',
  expenseApprovalTitle:'🛡 اعتماد المصروفات',
  staffMistakesTitle:'⚠️ أخطاء الموظفين',
  expensesTitle:'💸 المصروفات',
  reportsTitle:'📊 التقارير',
  aiPricingTitle:'🤖 التسعير الذكي',
  invoiceNumber:'رقم الفاتورة',
  customerInfo:'معلومات العميل',
  supplierInfo:'معلومات المورد',
  ticketDetails:'تفاصيل التذكرة',
  paymentDetails:'تفاصيل الدفع',
  totalDetails:'تفاصيل الإجمالي',
  vatDetails:'تفاصيل الضريبة',
  footerDetails:'تفاصيل التذييل',
  printDate:'تاريخ الطباعة',
  sar:'ريال',
  thankYou:'شكراً لتعاملك معنا!'
};

const translations = { en, ar };

// ERROR FIX: Removed the unterminated "/* ═══..." comment from here.

export default function useERPState() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  // --- 🌟 ADVANCED FEATURES ADDED 🌟 ---
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: '', dateTo: '', status: '', airline: '', portal: ''
  });
  const [invoiceDesign, setInvoiceDesign] = useState('modern'); // 'modern', 'classic', 'minimal'
  // --- 🌟 END ADVANCED FEATURES 🌟 ---

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [lang, setLang] = useState('en');
  const [initError, setInitError] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState({ type: null, data: null });
  const [chatOpen, setChatOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState('');

  const [data, setData] = useState({
    invoices: [], customers: [], corporates: [], creditors: [], vendors: [],
    packages: [], branches: [], portals: [], employees: [], expenses: [],
    cashbook: [], payroll: [], staffMistakes: [], auditLogs: [], settings: {},
    tenants: [], investments: [], empAdvances: [], services: [], attendance: [], appUsers: []
  });

  const [invForm, setInvForm] = useState({
    custType:'Individual', custId:'new', custName:'', custPhone:'',
    corpId:'new', corpName:'', corpVat:'', corpPhone:'', corpAddress:'',
    passengers:[''], employeeId:'', portalId:'',
    bookingDate:today, invoiceDate:today, bookingType:'New Booking',
    linkedInvId:'', oldTicketNo:'', oldPnr:'', oldAirline:'', oldSector:'',
    oldSellPrice:0, oldBookingDate:'', oldPassengers:'', oldFlightType:'',
    oldPaymentMethod:'', refundReason:'',
    service:'Flight Ticket', flightType:'Domestic', flightJourney:'Single',
    refundable:'Refundable', flightSector:'', airline:'', destination:'',
    hotelName:'', checkIn:'', checkOut:'', visaType:'Tourist', serviceName:'',
    pnr:'', ticketNo:'', qty:1, cost:0, sell:0, discount:0,
    taxRate:'15', payment:'Cash', paid:'', creditDueDate:'', creditorId:'',
    tabbyNo:'', tamaraNo:'', ticketStatus:'Confirmed',
    useCredit:0, creditCustId:'', status:'Unpaid'
  });

  const [expForm, setExpForm] = useState({
    expense_type:'', payment_mode:'Cash', description:'', expense_date:today,
    vendor_name:'', taxRate:'0', items:[{name:'',qty:1,price:0}], approval_status:'Approved'
  });

  const [corpForm, setCorpForm] = useState({ name:'', vat_no:'', phone:'', address:'' });
  const [creditorForm, setCreditorForm] = useState({ name:'', phone:'', address:'' });
  const [custForm, setCustForm] = useState({ name:'', phone:'', store_credit:0 });
  const [vendorForm, setVendorForm] = useState({ name:'', phone:'', balance:0 });
  const [pkgForm, setPkgForm] = useState({ name:'', price:'', desc:'', duration:'', inclusions:'' });
  const [brnForm, setBrnForm] = useState({ name:'', location:'', phone:'', manager:'', email:'', timing:'', status:'Active' });
  const [empForm, setEmpForm] = useState({
    name:'', phone:'', iqama_no:'', iqama_expiry:'', role:'Sales', salary:0, commission_rate:0,
    nationality:'', job_title:'', national_id:'', join_date:'', bank_name:'', bank_account:'', labor_office_expiry:''
  });
  const [srvForm, setSrvForm] = useState({ name:'' });
  const [investForm, setInvestForm] = useState({ name:'', amount:'', date:today, mode:'Cash', reason:'Other', otherReason:'', desc:'' });
  const [settleForm, setSettleForm] = useState({ id:'', date:today, mode:'Cash' });
  const [refundForm, setRefundForm] = useState({ id:'', date:today, compRefund:0, custRefund:0, mode:'Cash', reason:'', portalId:'', creditBalance:0 });
  const [transferForm, setTransferForm] = useState({ from:'Cash', to:'Bank', amount:'', date:today });
  const [setForm, setSetForm] = useState({});
  const [userForm, setUserForm] = useState({ email:'', username:'', role:'Staff', is_admin:false, can_access_invoices:true, can_access_bank:false, can_access_hr:false, can_access_reports:false, can_access_settings:false, employee_id:'' });
  const [portalForm, setPortalForm] = useState({ name:'', balance:0 });
  const [tenantForm, setTenantForm] = useState({ agency_name:'', owner_email:'', subscription_end_date:'', company_name_ar:'', vat_no:'', cr_no:'', phone:'', address_ar:'' });
  const [profileForm, setProfileForm] = useState({ username:'', avatar_url:'', phone:'', address:'' });
  const [passForm, setPassForm] = useState({ newPass:'' });
  const [payForm, setPayForm] = useState({
    employee_id:'', month: today.slice(0,7), overtime:0, gift:0, advance:0,
    mistakes_deduction:0, other_deduction:0, payment_mode:'Cash', payment_date: today, notes:''
  });

  const [editInvId, setEditInvId] = useState(null);
  const [editExpId, setEditExpId] = useState(null);
  const [editCorpId, setEditCorpId] = useState(null);
  const [editCredId, setEditCredId] = useState(null);
  const [editCustId, setEditCustId] = useState(null);
  const [editVendId, setEditVendId] = useState(null);
  const [editPkgId, setEditPkgId] = useState(null);
  const [editBrnId, setEditBrnId] = useState(null);
  const [editEmpId, setEditEmpId] = useState(null);
  const [advForm, setAdvForm] = useState({ employee_id:'', amount:'', date:today, status:'Pending' });
  const [editSrvId, setEditSrvId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender:'bot', text:'👋 Hello! I am your AI ERP Assistant. Type "help" to see what I can do.' }
  ]);

  const [contractCorpName, setContractCorpName] = useState('');
  const [contractType, setContractType] = useState('Flight Tickets');
  const [contractMarkup, setContractMarkup] = useState('10');
  const [contractTerms, setContractTerms] = useState('');

  const tr = translations[lang] || translations.en;

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const logAction = useCallback(async (action) => {
    try {
      if (userProfile?.tenant_id) {
        await supabase.from('audit_logs').insert([{
          user_email: user?.email || 'Unknown',
          action,
          tenant_id: userProfile.tenant_id
        }]);
      }
    } catch (e) {
      console.error('Audit log error:', e);
    }
  }, [user?.email, userProfile?.tenant_id]);

  const fetchAll = useCallback(async () => {
    if (!userProfile?.tenant_id) return;
    const tid = userProfile.tenant_id;

    try {
      const [
        invRes, custRes, corpRes, credRes, vendRes, pkgRes, brnRes,
        portRes, empRes, expRes, cashRes, payRes, mistRes, auditRes,
        setRes, srvRes, advRes, investRes, attRes, appUsersRes
      ] = await Promise.all([
        supabase.from('invoices').select('*, customers(name,phone), corporates(name,vat_no,phone), employees(name,phone)').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('customers').select('*').eq('tenant_id', tid),
        supabase.from('corporates').select('*').eq('tenant_id', tid),
        supabase.from('creditors').select('*').eq('tenant_id', tid),
        supabase.from('vendors').select('*').eq('tenant_id', tid),
        supabase.from('packages').select('*').eq('tenant_id', tid),
        supabase.from('branches').select('*').eq('tenant_id', tid),
        supabase.from('portals').select('*').eq('tenant_id', tid),
        supabase.from('employees').select('*').eq('tenant_id', tid),
        supabase.from('expenses').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('cashbook').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('payroll').select('*, employees(name)').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('staff_mistakes').select('*, employees(name)').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }).limit(200),
        supabase.from('settings').select('*').eq('tenant_id', tid).maybeSingle(),
        supabase.from('services').select('*').eq('tenant_id', tid),
        supabase.from('emp_advances').select('*, employees(name)').eq('tenant_id', tid),
        supabase.from('investments').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
        supabase.from('attendance').select('*, employees(name)').eq('tenant_id', tid).order('date', { ascending: false }),
        supabase.from('app_users').select('*').eq('tenant_id', tid)
      ]);

      setData({
        invoices: invRes.data || [],
        customers: custRes.data || [],
        corporates: corpRes.data || [],
        creditors: credRes.data || [],
        vendors: vendRes.data || [],
        packages: pkgRes.data || [],
        branches: brnRes.data || [],
        portals: portRes.data || [],
        employees: empRes.data || [],
        expenses: expRes.data || [],
        cashbook: cashRes.data || [],
        payroll: payRes.data || [],
        staffMistakes: mistRes.data || [],
        auditLogs: auditRes.data || [],
        settings: setRes.data || {},
        services: srvRes.data || [],
        empAdvances: advRes.data || [],
        investments: investRes.data || [],
        attendance: attRes.data || [],
        appUsers: appUsersRes.data || []
      });
    } catch (err) {
      console.error('Fetch all error:', err);
    }
  }, [userProfile?.tenant_id]);

  useEffect(() => {
    if (userProfile?.tenant_id) {
      fetchAll();
    }
  }, [userProfile?.tenant_id, fetchAll]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          if (mounted) router.push('/login');
          return;
        }
        if (mounted) setUser(session.user);

        const { data: profile, error: profErr } = await supabase
          .from('app_users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profErr) {
          if (mounted) setInitError('Profile error: ' + profErr.message);
          return;
        }
        if (!profile) {
          if (mounted) setInitError('User profile not found. Contact admin.');
          return;
        }

        if (profile.role !== 'SuperAdmin' && profile.tenant_id) {
          const { data: tenant } = await supabase
            .from('tenants')
            .select('is_paid, subscription_end_date')
            .eq('id', profile.tenant_id)
            .maybeSingle();

          if (tenant && (!tenant.is_paid || new Date(tenant.subscription_end_date) < new Date())) {
            if (mounted) router.push('/subscription');
            return;
          }

          const { data: settings } = await supabase
            .from('settings')
            .select('id')
            .eq('tenant_id', profile.tenant_id)
            .maybeSingle();

          if (!settings) {
            if (mounted) router.push('/setup');
            return;
          }

          const { data: sData } = await supabase
            .from('settings')
            .select('*')
            .eq('tenant_id', profile.tenant_id)
            .maybeSingle();
          if (sData && mounted) setSetForm(sData);
        }

        if (mounted) {
          setUserProfile(profile);
          setProfileForm({
            username: profile.username || '',
            avatar_url: profile.avatar_url || '',
            phone: profile.phone || '',
            address: profile.address || ''
          });
        }
      } catch (err) {
        if (mounted) setInitError('Init failed: ' + err.message);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT') router.push('/login');
      if (session?.user) setUser(session.user);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  return {
    user, setUser, userProfile, initError, lang, setLang,
    toast, page, setPage, modal, setModal, chatOpen, setChatOpen,
    previewHTML, setPreviewHTML, tr, today, router,
    data, setData, showToast, logAction, fetchAll,
    invForm, setInvForm, editInvId, setEditInvId,
    expForm, setExpForm, editExpId, setEditExpId,
    corpForm, setCorpForm, editCorpId, setEditCorpId,
    creditorForm, setCreditorForm, editCredId, setEditCredId,
    custForm, setCustForm, editCustId, setEditCustId,
    vendorForm, setVendorForm, editVendId, setEditVendId,
    pkgForm, setPkgForm, editPkgId, setEditPkgId,
    brnForm, setBrnForm, editBrnId, setEditBrnId,
    empForm, setEmpForm, editEmpId, setEditEmpId,
    srvForm, setSrvForm, editSrvId, setEditSrvId,
    investForm, setInvestForm,
    settleForm, setSettleForm,
    refundForm, setRefundForm,
    transferForm, setTransferForm,
    setForm, setSetForm,
    userForm, setUserForm, editUserId, setEditUserId,
    portalForm, setPortalForm,
    tenantForm, setTenantForm,
    profileForm, setProfileForm,
    passForm, setPassForm,
    payForm, setPayForm,
    advForm, setAdvForm,
    chatInput, setChatInput, chatMessages, setChatMessages,
    contractCorpName, setContractCorpName,
    contractType, setContractType,
    contractMarkup, setContractMarkup,
    contractTerms, setContractTerms,
    getInvoiceHTML, getRefundHTML, getExpenseHTML,
    getSalarySlipHTML, getContractHTML, getMistakeHTML,
    // --- 🌟 ADVANCED FEATURES RETURNED 🌟 ---
    theme, setTheme,
    sidebarCollapsed, setSidebarCollapsed,
    advancedFilters, setAdvancedFilters,
    invoiceDesign, setInvoiceDesign
  };
}
