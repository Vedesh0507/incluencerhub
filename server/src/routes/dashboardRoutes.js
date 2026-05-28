const express = require('express');
const router = express.Router();
const { getCreatorStats, getBusinessStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/creator/stats', protect, getCreatorStats);
router.get('/business/stats', protect, getBusinessStats);

module.exports = router;
