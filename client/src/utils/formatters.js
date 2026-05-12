import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatCurrency = (amount, currency = 'LKR') => {
  return new Intl.NumberFormat('en-LK', {
    style:    'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
};

export const formatDateInput = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const getMonthName = (month) => {
  return format(new Date(2024, month - 1, 1), 'MMMM');
};

export const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year:  now.getFullYear(),
  };
};