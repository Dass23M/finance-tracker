const Transaction = require('../models/Transaction');

// Get the date range for a budget period
const getBudgetDateRange = (period, month, year) => {
  const now = new Date();
  const y = year  || now.getFullYear();
  const m = month || now.getMonth() + 1; // getMonth() is 0-indexed

  if (period === 'monthly') {
    const start = new Date(y, m - 1, 1);           // first day of month
    const end   = new Date(y, m, 0, 23, 59, 59, 999); // last day of month
    return { start, end };
  }

  if (period === 'yearly') {
    const start = new Date(y, 0, 1);
    const end   = new Date(y, 11, 31, 23, 59, 59, 999);
    return { start, end };
  }

  if (period === 'weekly') {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay()); // Sunday
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Saturday
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  return null;
};

// Calculate actual spending for a budget
const calculateSpending = async (userId, categoryId, period, month, year) => {
  const dateRange = getBudgetDateRange(period, month, year);
  if (!dateRange) return 0;

  const result = await Transaction.aggregate([
    {
      $match: {
        user:     userId,
        category: categoryId,
        type:     'expense',
        date:     { $gte: dateRange.start, $lte: dateRange.end },
      },
    },
    {
      $group: {
        _id:   null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// Attach spending data to a budget object
const enrichBudgetWithSpending = async (budget) => {
  const spent = await calculateSpending(
    budget.user,
    budget.category._id || budget.category,
    budget.period,
    budget.month,
    budget.year
  );

  const limit      = budget.amount;
  const remaining  = Math.max(0, limit - spent);
  const percentage = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  const isExceeded = spent > limit;

  return {
    ...budget.toObject(),
    spending: {
      spent,
      remaining,
      percentage,
      isExceeded,
    },
  };
};

module.exports = { getBudgetDateRange, calculateSpending, enrichBudgetWithSpending };