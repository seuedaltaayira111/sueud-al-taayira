'use client';

import ERPViewsSales from './views/ERPViewsSales';

const PAGE_COMPONENT = {
  dashboard: ERPViewsSales,
  create: ERPViewsSales,
  my_attendance: ERPViewsSales,
  hr: ERPViewsSales,
  hr_advanced: ERPViewsSales,
  refunds: ERPViewsSales,
  customers: ERPViewsSales,
  corporates: ERPViewsSales,
  creditors: ERPViewsSales,
  credit: ERPViewsSales,
  credit_limits: ERPViewsSales,
  customer_statement: ERPViewsSales,
  supplier_statement: ERPViewsSales,
  multi_branch: ERPViewsSales,
  recurring_invoices: ERPViewsSales,
  expense_approval: ERPViewsSales,
  staff_mistakes: ERPViewsSales,
  expenses: ERPViewsSales,
  reports: ERPViewsSales,
  ai_pricing: ERPViewsSales,
  quotations: ERPViewsSales,
  ai_dashboard: ERPViewsSales,
  profitability: ERPViewsSales,
  superadmin: ERPViewsSales,
  users: ERPViewsSales,
  audit: ERPViewsSales,
  settings: ERPViewsSales,
  profile: ERPViewsSales,
  notifications: ERPViewsSales,
  refund_statement: ERPViewsSales,
  bank: ERPViewsSales,
  invest: ERPViewsSales,
  statements: ERPViewsSales,
};

// ✅ YAHAN GHALTI THI: Tumne object export kar diya tha, ab hum ek proper function bana rahe hain
export default function ERPViews(props) {
  // props mein erp ka saara data aa raha hai (kyunki page.js mein <ERPViews {...erp} /> kiya hai)
  // humein 'page' naam ki key chahiye jo batayegi kaun sa page open hai
  const { page = 'dashboard' } = props;

  // Map se us page ka component dhundho, agar nahi mila toh default dashboard rakh do
  const ActivePageComponent = PAGE_COMPONENT[page] || PAGE_COMPONENT.dashboard;

  // Component ko render karo aur saari props (erp data) usse pass kar do
  return <ActivePageComponent {...props} />;
}
