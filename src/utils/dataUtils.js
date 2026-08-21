// utils/dataUtils.js

/**
 * Filter data by date range
 * @param {Array} data - Array of objects to filter
 * @param {string} dateField - Field name containing the date
 * @param {Object} dateRange - { from: string, to: string }
 * @returns {Array} Filtered data
 */
export const filterData = (data, dateField, dateRange) => {
  if (!data || !Array.isArray(data)) return [];
  if (!dateRange || (!dateRange.from && !dateRange.to)) return data;
  
  return data.filter(item => {
    const d = item[dateField];
    if (!d) return true;
    if (dateRange.from && d < dateRange.from) return false;
    if (dateRange.to && d > dateRange.to) return false;
    return true;
  });
};

/**
 * Export data to Excel/CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(h => {
          let val = row[h] ?? '';
          
          // Handle different data types
          if (typeof val === 'object' && val !== null) {
            val = JSON.stringify(val);
          }
          
          if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
            val = `"${val.replace(/"/g, '""')}"`;
          }
          
          return val;
        }).join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export data: ' + error.message);
  }
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: SAR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'SAR') => {
  const num = parseFloat(amount) || 0;
  return `${num.toFixed(2)} ${currency}`;
};

/**
 * Format date
 * @param {string} dateStr - Date string to format
 * @param {string} format - Format type ('short', 'long', 'time')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateStr, format = 'short') => {
  if (!dateStr) return 'N/A';
  
  try {
    const date = new Date(dateStr);
    
    switch (format) {
      case 'long':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'time':
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      case 'short':
      default:
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
    }
  } catch (error) {
    return dateStr;
  }
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
export const generateId = (prefix = 'ID') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate pagination
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination info { totalPages, startIndex, endIndex, hasNext, hasPrev }
 */
export const calculatePagination = (totalItems, currentPage = 1, itemsPerPage = 10) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    totalPages,
    startIndex,
    endIndex,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

/**
 * Search/filter array of objects
 * @param {Array} data - Array to search
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered array
 */
export const searchArray = (data, searchTerm, searchFields = []) => {
  if (!searchTerm || !data || !Array.isArray(data)) return data || [];
  
  const term = searchTerm.toLowerCase().trim();
  
  return data.filter(item => {
    if (searchFields.length === 0) {
      // Search all string fields
      return Object.values(item).some(val => 
        typeof val === 'string' && val.toLowerCase().includes(term)
      );
    }
    
    return searchFields.some(field => {
      const value = item[field];
      if (!value) return false;
      
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      
      if (typeof value === 'number') {
        return value.toString().includes(term);
      }
      
      return false;
    });
  });
};
