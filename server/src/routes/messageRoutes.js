const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getConversationList,
  getConversation,
  sendMessage,
  markSeen,
} = require('../controllers/messageController');

// All routes are protected
router.use(protect);

// GET conversation list (must be before /:userId to avoid conflicts)
router.get('/conversations/list', getConversationList);

// GET conversation with a specific user
router.get('/:userId', getConversation);

// POST send a message
router.post('/', sendMessage);

// PUT mark messages from a user as seen
router.put('/seen/:userId', markSeen);

module.exports = router;
