const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation rules
const createCategoryRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 30 }).withMessage('Category name cannot exceed 30 characters'),
  body('type')
    .notEmpty().withMessage('Category type is required')
    .isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6})$/).withMessage('Please provide a valid hex color'),
];

const updateCategoryRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Category name cannot exceed 30 characters'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6})$/).withMessage('Please provide a valid hex color'),
];

// All routes are protected
router.use(protect);

router.get('/',     getCategories);
router.get('/:id',  getCategory);
router.post('/',    createCategoryRules, validate, createCategory);
router.put('/:id',  updateCategoryRules, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;