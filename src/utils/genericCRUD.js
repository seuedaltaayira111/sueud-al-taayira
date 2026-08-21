// utils/genericCRUD.js
import { supabase } from '@/lib/supabase';

/**
 * Generic CRUD operations for any entity
 * @param {string} table - Database table name
 * @param {string} tenantId - Tenant ID for filtering
 * @param {Object} formState - React state for the form
 * @param {Function} setFormState - setState function for form
 * @param {string|null} editId - Current edit ID or null
 * @param {Function} setEditId - setState function for edit ID
 * @param {Function} setData - setState function for main data
 * @param {Function} showToast - Toast notification function
 * @param {Object} options - Additional options
 * @returns {Object} CRUD functions
 */
export function createGenericCRUD({
  table,
  tenantId,
  formState,
  setFormState,
  editId,
  setEditId,
  setData,
  showToast,
  options = {}
}) {
  const {
    defaultForm = {},
    beforeInsert = (data) => data,
    beforeUpdate = (data) => data,
    afterSuccess = () => {},
    selectQuery = '*',
    orderBy = 'name',
    customErrorMessage = 'Error'
  } = options;

  // Edit item - populate form with existing data
  const handleEdit = (item) => {
    setEditId(item.id);
    const formData = { ...defaultForm };
    Object.keys(formData).forEach(key => {
      if (item[key] !== undefined) {
        formData[key] = item[key];
      }
    });
    setFormState(formData);
  };

  // Add or Update item
  const handleAddEdit = async (e) => {
    e?.preventDefault();
    try {
      let payload = { ...formState, tenant_id: tenantId };

      // Remove undefined/null values
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === null) {
          delete payload[key];
        }
      });

      if (editId) {
        payload = beforeUpdate(payload);
        const { data: updated, error } = await supabase
          .from(table)
          .update(payload)
          .eq('id', editId)
          .select(selectQuery)
          .single();

        if (error) throw error;
        setData(prev => ({
          ...prev,
          [table]: prev[table]?.map(item => item.id === editId ? updated : item) || []
        }));
        showToast('Updated successfully!');
        setEditId(null);
      } else {
        payload = beforeInsert(payload);
        const { data: newItem, error } = await supabase
          .from(table)
          .insert([payload])
          .select(selectQuery)
          .single();

        if (error) throw error;
        setData(prev => ({
          ...prev,
          [table]: [...(prev[table] || []), newItem]
        }));
        showToast('Added successfully!');
      }

      setFormState({ ...defaultForm });
      afterSuccess();
    } catch (err) {
      showToast(`${customErrorMessage}: ${err.message}`);
    }
  };

  // Delete item
  const handleDelete = async (id, confirmMessage = 'Are you sure you want to delete?') => {
    if (!confirm(confirmMessage)) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      setData(prev => ({
        ...prev,
        [table]: prev[table]?.filter(item => item.id !== id) || []
      }));
      showToast('Deleted successfully!');
    } catch (err) {
      showToast(`${customErrorMessage}: ${err.message}`);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditId(null);
    setFormState({ ...defaultForm });
  };

  return {
    handleEdit,
    handleAddEdit,
    handleDelete,
    handleCancelEdit
  };
}

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @param {Object} rules - Validation rules { fieldName: { required: true, minLength: 3, pattern: /regex/ } }
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateForm(formData, rules) {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];

    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = rule.message || `${field} is required`;
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = rule.message || `${field} must not exceed ${rule.maxLength} characters`;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`;
    }

    if (rule.custom && typeof rule.custom === 'function') {
      const customError = rule.custom(value, formData);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
