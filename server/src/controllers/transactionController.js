const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// @desc    Get all transactions with filters, sorting, pagination
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const {
      type,        // 'income' | 'expense'
      category,    // category ObjectId
      startDate,   // 'YYYY-MM-DD'
      endDate,     // 'YYYY-MM-DD'
      search,      // search by title
      sortBy,      // 'date' | 'amount'
      order,       // 'asc' | 'desc'
      page,
      limit,
    } = req.query;

    // Build filter object
    const filter = { user: req.user._id };

    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        // Include the entire end date day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    // Search by title
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Sorting
    const sortField = sortBy === 'amount' ? 'amount' : 'date';
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    // Pagination
    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const pageSize = Math.min(100, parseInt(limit) || 10);
    const skip     = (pageNum - 1) * pageSize;

    // Run query + count in parallel for performance
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('category', 'name type color icon')
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Transactions fetched successfully',
      data: {
        transactions,
        pagination: {
          total,
          page:       pageNum,
          limit:      pageSize,
          totalPages: Math.ceil(total / pageSize),
          hasNext:    pageNum < Math.ceil(total / pageSize),
          hasPrev:    pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('category', 'name type color icon');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction fetched successfully',
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, note } = req.body;

    // Verify category belongs to this user and type matches
    const categoryDoc = await Category.findOne({
      _id: category,
      user: req.user._id,
    });

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (categoryDoc.type !== type) {
      return res.status(400).json({
        success: false,
        message: `Category type mismatch — "${categoryDoc.name}" is a ${categoryDoc.type} category`,
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date: date ? new Date(date) : new Date(),
      note: note || '',
    });

    // Populate category before returning
    await transaction.populate('category', 'name type color icon');

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, note } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // If category is being changed, validate it
    if (category && category !== transaction.category.toString()) {
      const categoryDoc = await Category.findOne({
        _id: category,
        user: req.user._id,
      });

      if (!categoryDoc) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      const resolvedType = type || transaction.type;
      if (categoryDoc.type !== resolvedType) {
        return res.status(400).json({
          success: false,
          message: `Category type mismatch — "${categoryDoc.name}" is a ${categoryDoc.type} category`,
        });
      }
    }

    // Apply updates
    if (title)    transaction.title    = title;
    if (amount)   transaction.amount   = amount;
    if (type)     transaction.type     = type;
    if (category) transaction.category = category;
    if (date)     transaction.date     = new Date(date);
    if (note !== undefined) transaction.note = note;

    await transaction.save();
    await transaction.populate('category', 'name type color icon');

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction summary totals
// @route   GET /api/transactions/summary
// @access  Private
const getTransactionSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { user: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const summary = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Shape into a clean object
    const result = { income: 0, expense: 0, balance: 0, incomeCount: 0, expenseCount: 0 };
    summary.forEach((item) => {
      if (item._id === 'income') {
        result.income = item.total;
        result.incomeCount = item.count;
      }
      if (item._id === 'expense') {
        result.expense = item.total;
        result.expenseCount = item.count;
      }
    });
    result.balance = result.income - result.expense;

    res.status(200).json({
      success: true,
      message: 'Summary fetched successfully',
      data: { summary: result },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};