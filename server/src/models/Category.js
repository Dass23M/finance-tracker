const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [30, 'Category name cannot exceed 30 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either income or expense',
      },
      required: [true, 'Category type is required'],
    },
    color: {
      type: String,
      default: '#6366f1', // default indigo color
      match: [/^#([A-Fa-f0-9]{6})$/, 'Please provide a valid hex color'],
    },
    icon: {
      type: String,
      default: 'tag',
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false, // default categories seeded on register, user-created = false
    },
  },
  {
    timestamps: true,
  }
);

// A user cannot have two categories with the same name and type
categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);