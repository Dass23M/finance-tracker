const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');

const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');
const validate    = require('../middleware/validate');

// Validation rules
const createBudgetRules = [
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  body('amount')
    .notEmpty().withMessage('Budget amount is required')
    .isFloat({ min: 1 }).withMessage('Budget amount must be greater than 0'),
  body('period')
    .optional()
    .isIn(['monthly', 'weekly', 'yearly']).withMessage('Period must be monthly, weekly, or yearly'),
  body('month')
    .optional()
    .isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('year')
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage('Please provide a valid year'),
];

const updateBudgetRules = [
  body('amount')
    .optional()
    .isFloat({ min: 1 }).withMessage('Budget amount must be greater than 0'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

// All routes protected
router.use(protect);

router.get('/',      getBudgets);
router.get('/:id',   getBudget);
router.post('/',     createBudgetRules, validate, createBudget);
router.put('/:id',   updateBudgetRules, validate, updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;