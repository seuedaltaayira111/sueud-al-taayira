'use client';

import useERPState from './useERPState';
import useERPActions from './useERPActions';

/**
 * Main ERP Hook - Combines State and Actions
 * This is the single source of truth for the entire ERP system
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
