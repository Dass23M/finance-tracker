const Transaction = require('../models/Transaction');
const Budget      = require('../models/Budget');
const Category    = require('../models/Category');
const mongoose    = require('mongoose');

// ─────────────────────────────────────────────
// @desc   Get full dashboard stats
// @route  GET /api/stats/dashboard
// @access Private
// ─────────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now    = new Date();

    // Default to current month
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year  = parseInt(req.query.year)  || now.getFullYear();

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth   = new Date(year, month, 0, 23, 59, 59, 999);

    // Run all aggregations in parallel — maximum performance
    const [
      financialSummary,
      categoryBreakdown,
      monthlyTrend,
      recentTransactions,
      budgetOverview,
    ] = await Promise.all([
      getFinancialSummary(userId, startOfMonth, endOfMonth),
      getCategoryBreakdown(userId, startOfMonth, endOfMonth),
      getMonthlyTrend(userId, year),
      getRecentTransactions(userId),
      getBudgetOverview(userId, month, year),
    ]);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        financialSummary,
        categoryBreakdown,
        monthlyTrend,
        recentTransactions,
        budgetOverview,
        meta: { month, year },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc   Get financial summary for a period
// @route  GET /api/stats/summary
// @access Private
// ─────────────────────────────────────────────
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now    = new Date();

    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year  = parseInt(req.query.year)  || now.getFullYear();

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth   = new Date(year, month, 0, 23, 59, 59, 999);

    const summary = await getFinancialSummary(userId, startOfMonth, endOfMonth);

    res.status(200).json({
      success: true,
      message: 'Summary fetched successfully',
      data: { summary, meta: { month, year } },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc   Get monthly trend (last 12 months)
// @route  GET /api/stats/monthly-trend
// @access Private
// ─────────────────────────────────────────────
const getMonthlyTrendStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const year   = parseInt(req.query.year) || new Date().getFullYear();

    const trend = await getMonthlyTrend(userId, year);

    res.status(200).json({
      success: true,
      message: 'Monthly trend fetched successfully',
      data: { trend },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc   Get expense breakdown by category
// @route  GET /api/stats/category-breakdown
// @access Private
// ─────────────────────────────────────────────
const getCategoryBreakdownStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now    = new Date();

    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year  = parseInt(req.query.year)  || now.getFullYear();

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth   = new Date(year, month, 0, 23, 59, 59, 999);

    const breakdown = await getCategoryBreakdown(userId, startOfMonth, endOfMonth);

    res.status(200).json({
      success: true,
      message: 'Category breakdown fetched successfully',
      data: { breakdown, meta: { month, year } },
    });
  } catch (error) {
    next(error);
  }
};

// ═════════════════════════════════════════════
//  AGGREGATION HELPER FUNCTIONS
// ═════════════════════════════════════════════

// 1. Total income, expenses, balance for a date range
const getFinancialSummary = async (userId, startDate, endDate) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id:   '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = {
    income:       0,
    expense:      0,
    balance:      0,
    incomeCount:  0,
    expenseCount: 0,
  };

  result.forEach((item) => {
    if (item._id === 'income') {
      summary.income      = item.total;
      summary.incomeCount = item.count;
    }
    if (item._id === 'expense') {
      summary.expense      = item.total;
      summary.expenseCount = item.count;
    }
  });

  summary.balance = summary.income - summary.expense;
  return summary;
};

// 2. Expense distribution by category (for pie/donut chart)
const getCategoryBreakdown = async (userId, startDate, endDate) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: 'expense',
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id:   '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      // Join with categories collection to get name, color, icon
      $lookup: {
        from:         'categories',
        localField:   '_id',
        foreignField: '_id',
        as:           'category',
      },
    },
    { $unwind: '$category' },
    { $sort: { total: -1 } }, // highest spending first
    {
      $project: {
        _id:          0,
        categoryId:   '$_id',
        categoryName: '$category.name',
        color:        '$category.color',
        icon:         '$category.icon',
        total:        1,
        count:        1,
      },
    },
  ]);

  // Add percentage to each category
  const grandTotal = result.reduce((sum, item) => sum + item.total, 0);
  return result.map((item) => ({
    ...item,
    percentage: grandTotal > 0
      ? Math.round((item.total / grandTotal) * 100)
      : 0,
  }));
};

// 3. Monthly income vs expense trend for the full year (for bar/line chart)
const getMonthlyTrend = async (userId, year) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear   = new Date(year, 11, 31, 23, 59, 59, 999);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startOfYear, $lte: endOfYear },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          type:  '$type',
        },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  // Build a full 12-month array with zeroes for missing months
  const monthNames = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec',
  ];

  const trend = monthNames.map((name, index) => ({
    month:   name,
    monthNum: index + 1,
    income:  0,
    expense: 0,
    balance: 0,
  }));

  result.forEach((item) => {
    const idx = item._id.month - 1;
    if (item._id.type === 'income')  trend[idx].income  = item.total;
    if (item._id.type === 'expense') trend[idx].expense = item.total;
  });

  // Calculate balance for each month
  trend.forEach((item) => {
    item.balance = item.income - item.expense;
  });

  return trend;
};

// 4. Last 5 transactions (for recent activity widget)
const getRecentTransactions = async (userId) => {
  return await Transaction.find({ user: userId })
    .populate('category', 'name type color icon')
    .sort({ date: -1 })
    .limit(5)
    .lean();
};

// 5. Budget vs actual spending overview (for budget progress chart)
const getBudgetOverview = async (userId, month, year) => {
  const budgets = await Budget.find({
    user:     userId,
    month,
    year,
    isActive: true,
  }).populate('category', 'name type color icon');

  if (budgets.length === 0) return [];

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth   = new Date(year, month, 0, 23, 59, 59, 999);

  // Get spending for all budget categories in one aggregation
  const categoryIds = budgets.map((b) => b.category._id);

  const spendingData = await Transaction.aggregate([
    {
      $match: {
        user:     new mongoose.Types.ObjectId(userId),
        type:     'expense',
        category: { $in: categoryIds },
        date:     { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id:   '$category',
        spent: { $sum: '$amount' },
      },
    },
  ]);

  // Map spending to each budget
  const spendingMap = {};
  spendingData.forEach((s) => {
    spendingMap[s._id.toString()] = s.spent;
  });

  return budgets.map((budget) => {
    const spent      = spendingMap[budget.category._id.toString()] || 0;
    const limit      = budget.amount;
    const remaining  = Math.max(0, limit - spent);
    const percentage = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
    const isExceeded = spent > limit;

    return {
      budgetId:     budget._id,
      category:     budget.category,
      limit,
      spent,
      remaining,
      percentage,
      isExceeded,
      period:       budget.period,
    };
  });
};

module.exports = {
  getDashboardStats,
  getSummary,
  getMonthlyTrendStats,
  getCategoryBreakdownStats,
};