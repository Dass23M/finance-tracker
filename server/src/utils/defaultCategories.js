const defaultCategories = [
  // Income
  { name: 'Salary',      type: 'income',  color: '#22c55e', icon: 'briefcase' },
  { name: 'Freelance',   type: 'income',  color: '#10b981', icon: 'laptop' },
  { name: 'Investments', type: 'income',  color: '#06b6d4', icon: 'trending-up' },
  { name: 'Other Income',type: 'income',  color: '#84cc16', icon: 'plus-circle' },

  // Expense
  { name: 'Food',        type: 'expense', color: '#f97316', icon: 'coffee' },
  { name: 'Transport',   type: 'expense', color: '#f59e0b', icon: 'car' },
  { name: 'Rent',        type: 'expense', color: '#ef4444', icon: 'home' },
  { name: 'Shopping',    type: 'expense', color: '#ec4899', icon: 'shopping-bag' },
  { name: 'Healthcare',  type: 'expense', color: '#8b5cf6', icon: 'heart' },
  { name: 'Education',   type: 'expense', color: '#3b82f6', icon: 'book' },
  { name: 'Entertainment',type:'expense', color: '#a855f7', icon: 'film' },
  { name: 'Utilities',   type: 'expense', color: '#64748b', icon: 'zap' },
  { name: 'Other Expense',type: 'expense',color: '#6b7280', icon: 'more-horizontal' },
];

const seedDefaultCategories = async (userId) => {
  const Category = require('../models/Category');
  const categories = defaultCategories.map((cat) => ({
    ...cat,
    user: userId,
    isDefault: true,
  }));
  await Category.insertMany(categories);
};

module.exports = { seedDefaultCategories };