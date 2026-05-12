export const API_URL = import.meta.env.VITE_API_URL;

export const MONTHS = [
  { value: 1,  label: 'January'   },
  { value: 2,  label: 'February'  },
  { value: 3,  label: 'March'     },
  { value: 4,  label: 'April'     },
  { value: 5,  label: 'May'       },
  { value: 6,  label: 'June'      },
  { value: 7,  label: 'July'      },
  { value: 8,  label: 'August'    },
  { value: 9,  label: 'September' },
  { value: 10, label: 'October'   },
  { value: 11, label: 'November'  },
  { value: 12, label: 'December'  },
];

export const TRANSACTION_TYPES = [
  { value: 'income',  label: 'Income'  },
  { value: 'expense', label: 'Expense' },
];

export const PERIODS = [
  { value: 'weekly',  label: 'Weekly'  },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly',  label: 'Yearly'  },
];

export const CHART_COLORS = [
  '#6366f1','#22c55e','#ef4444','#f97316',
  '#f59e0b','#06b6d4','#ec4899','#8b5cf6',
  '#10b981','#3b82f6','#a855f7','#64748b',
];