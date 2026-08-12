'use client';

import useERPState from './useERPState';
import useERPActions from './useERPActions';

export default function useERP() {
  const state = useERPState();
  const actions = useERPActions(state);

  return {
    ...state,
    ...actions
  };
}
