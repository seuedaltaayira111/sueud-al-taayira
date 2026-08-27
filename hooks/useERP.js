'use client';

import useERPState from './useERPState';
import useERPActions from './useERPActions';

/**
 * Main ERP Hook - Combines State and Actions
 * This is the single source of truth for the entire ERP system
 * 
 * Features:
 * - Complete State Management
 * - All CRUD Operations
 * - PDF Generation (Invoice, Refund, Expense, Salary Slip, Contract, Mistake)
 * - Print & Download
 * - Bilingual Support (EN/AR)
 * - Dark/Light Theme
 * - AI Chat Assistant
 * - Multi-Tenant Support
 * - Travel Agency Features (Hotel, Visa, Hajj/Umrah, Frequent Flyer)
 * - HR & Payroll
 * - Finance & Accounting
 * - Reports & Statements
 * - SuperAdmin Panel
 */
export default function useERP() {
  // Initialize state
  const state = useERPState();
  
  // Initialize actions with state reference
  const actions = useERPActions(state);

  // Return everything combined
  return {
    ...state,
    ...actions
  };
}
