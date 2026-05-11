const express = require('express');
const router  = express.Router();

const {
  getDashboardStats,
  getSummary,
  getMonthlyTrendStats,
  getCategoryBreakdownStats,
} = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

// All routes protected
router.use(protect);

// One endpoint to load entire dashboard at once
router.get('/dashboard',          getDashboardStats);

// Individual endpoints for granular fetching
router.get('/summary',            getSummary);
router.get('/monthly-trend',      getMonthlyTrendStats);
router.get('/category-breakdown', getCategoryBreakdownStats);

module.exports = router;