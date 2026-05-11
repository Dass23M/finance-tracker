const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const validate  = require('../middleware/validate');

// Validation rules
const createTransactionRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO date'),
  body('note')
    .optional()
    .isLength({ max: 300 }).withMessage('Note cannot exceed 300 characters'),
];

const updateTransactionRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type')
    .optional()
    .isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO date'),
  body('note')
    .optional()
    .isLength({ max: 300 }).withMessage('Note cannot exceed 300 characters'),
];

// All routes protected
router.use(protect);

// Summary must come before /:id — otherwise Express matches 'summary' as an id
router.get('/summary',  getTransactionSummary);
router.get('/',         getTransactions);
router.get('/:id',      getTransaction);
router.post('/',        createTransactionRules, validate, createTransaction);
router.put('/:id',      updateTransactionRules, validate, updateTransaction);
router.delete('/:id',   deleteTransaction);

module.exports = router;