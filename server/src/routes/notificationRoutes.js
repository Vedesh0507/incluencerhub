const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getNotifications,
  markRead,
  markAllRead,
} = require('../controllers/notificationController');

// All routes are protected
router.use(protect);

// GET all notifications for the logged-in user
router.get('/', getNotifications);

// PUT mark all notifications as read (must be before /:id)
router.put('/read-all', markAllRead);

// PUT mark a single notification as read
router.put('/:id/read', markRead);

module.exports = router;
