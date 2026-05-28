const express = require('express');
const router = express.Router();
const {
  sendCollaborationRequest,
  getCreatorInbox,
  getBusinessRequests,
  updateCollaborationStatus,
} = require('../controllers/collaborationController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected — requires valid JWT
router.post('/', protect, sendCollaborationRequest);
router.get('/creator', protect, getCreatorInbox);
router.get('/business', protect, getBusinessRequests);
router.put('/:id/status', protect, updateCollaborationStatus);

module.exports = router;
