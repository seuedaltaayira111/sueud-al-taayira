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

export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) return;
  try {
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(row => headers.map(h => { let val = row[h] ?? ''; if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) { val = `"${val.replace(/"/g, '""')}"`; } return val; }).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
  }
};

export const formatCurrency = (amount, currency = 'SAR') => {
  const num = parseFloat(amount) || 0;
  return `${num.toFixed(2)} ${currency}`;
};

export const formatDate = (dateStr, format = 'short') => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    switch (format) {
      case 'long': return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      case 'time': return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      default: return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  } catch (e) { return dateStr; }
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const calculatePagination = (totalItems, currentPage = 1, itemsPerPage = 10) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return { totalPages, startIndex, endIndex, hasNext: currentPage < totalPages, hasPrev: currentPage > 1 };
};

export const searchArray = (data, searchTerm, searchFields = []) => {
  if (!searchTerm || !data || !Array.isArray(data)) return data || [];
  const term = searchTerm.toLowerCase().trim();
  return data.filter(item => {
    if (searchFields.length === 0) {
      return Object.values(item).some(val => typeof val === 'string' && val.toLowerCase().includes(term));
    }
    return searchFields.some(field => {
      const value = item[field];
      if (!value) return false;
      if (typeof value === 'string') return value.toLowerCase().includes(term);
      if (typeof value === 'number') return value.toString().includes(term);
      return false;
    });
  });
};
