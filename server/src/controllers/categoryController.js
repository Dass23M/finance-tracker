const Category = require('../models/Category');

// @desc    Get all categories for logged-in user
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query; // optional filter: ?type=income or ?type=expense

    const filter = { user: req.user._id };
    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ type: 1, name: 1 });

    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, type, color, icon } = req.body;

    // Check duplicate for this user
    const existing = await Category.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      type,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A ${type} category named "${name}" already exists`,
      });
    }

    const category = await Category.create({
      user: req.user._id,
      name,
      type,
      color: color || '#6366f1',
      icon: icon || 'tag',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;
    // Note: type is not updatable — changing type would break existing transactions

    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check duplicate name (excluding current category)
    if (name && name !== category.name) {
      const duplicate = await Category.findOne({
        user: req.user._id,
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        type: category.type,
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `A ${category.type} category named "${name}" already exists`,
        });
      }
    }

    if (name) category.name = name;
    if (color) category.color = color;
    if (icon) category.icon = icon;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Prevent deleting default categories
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Default categories cannot be deleted',
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};