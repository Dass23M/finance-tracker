const Budget   = require('../models/Budget');
const Category = require('../models/Category');
const { enrichBudgetWithSpending } = require('../utils/budgetHelpers');

// @desc    Get all budgets for logged-in user (with live spending data)
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const { month, year, isActive } = req.query;
    const now = new Date();

    const filter = { user: req.user._id };

    // Default to current month/year if not provided
    filter.month = month ? parseInt(month) : now.getMonth() + 1;
    filter.year  = year  ? parseInt(year)  : now.getFullYear();

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const budgets = await Budget.find(filter)
      .populate('category', 'name type color icon')
      .sort({ createdAt: -1 });

    // Enrich every budget with live spending data
    const enrichedBudgets = await Promise.all(
      budgets.map((budget) => enrichBudgetWithSpending(budget))
    );

    // Calculate overall summary
    const summary = enrichedBudgets.reduce(
      (acc, b) => {
        acc.totalBudgeted += b.amount;
        acc.totalSpent    += b.spending.spent;
        acc.exceededCount += b.spending.isExceeded ? 1 : 0;
        return acc;
      },
      { totalBudgeted: 0, totalSpent: 0, exceededCount: 0 }
    );
    summary.totalRemaining = Math.max(0, summary.totalBudgeted - summary.totalSpent);

    res.status(200).json({
      success: true,
      message: 'Budgets fetched successfully',
      data: { budgets: enrichedBudgets, summary },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single budget with spending data
// @route   GET /api/budgets/:id
// @access  Private
const getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      _id:  req.params.id,
      user: req.user._id,
    }).populate('category', 'name type color icon');

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    const enrichedBudget = await enrichBudgetWithSpending(budget);

    res.status(200).json({
      success: true,
      message: 'Budget fetched successfully',
      data: { budget: enrichedBudget },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res, next) => {
  try {
    const { category, amount, period, month, year } = req.body;
    const now = new Date();

    // Verify category belongs to user and is expense type
    const categoryDoc = await Category.findOne({
      _id:  category,
      user: req.user._id,
    });

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (categoryDoc.type !== 'expense') {
      return res.status(400).json({
        success: false,
        message: 'Budgets can only be created for expense categories',
      });
    }

    const budgetMonth  = month  ? parseInt(month)  : now.getMonth() + 1;
    const budgetYear   = year   ? parseInt(year)   : now.getFullYear();
    const budgetPeriod = period || 'monthly';

    // Check for duplicate budget (same category + month + year)
    const existing = await Budget.findOne({
      user:     req.user._id,
      category,
      month:    budgetMonth,
      year:     budgetYear,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A budget for "${categoryDoc.name}" already exists for this period`,
      });
    }

    const budget = await Budget.create({
      user:     req.user._id,
      category,
      amount,
      period:   budgetPeriod,
      month:    budgetMonth,
      year:     budgetYear,
    });

    await budget.populate('category', 'name type color icon');

    const enrichedBudget = await enrichBudgetWithSpending(budget);

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: { budget: enrichedBudget },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res, next) => {
  try {
    const { amount, isActive } = req.body;
    // Note: category, month, year are not updatable
    // to change those, delete and create a new budget

    const budget = await Budget.findOne({
      _id:  req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    if (amount   !== undefined) budget.amount   = amount;
    if (isActive !== undefined) budget.isActive = isActive;

    await budget.save();
    await budget.populate('category', 'name type color icon');

    const enrichedBudget = await enrichBudgetWithSpending(budget);

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: { budget: enrichedBudget },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      _id:  req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
};