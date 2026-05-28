const express = require('express');
const router = express.Router();
const {
  sendCollaborationRequest,
  getCreatorInbox,
  getBusinessRequests,
  getCollaborationById,
  updateCollaborationStatus,
} = require('../controllers/collaborationController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected — requires valid JWT
// NOTE: named routes (/creator, /business) MUST be before /:id to avoid param conflict
router.post('/', protect, sendCollaborationRequest);
router.get('/creator', protect, getCreatorInbox);
router.get('/business', protect, getBusinessRequests);
router.get('/:id', protect, getCollaborationById);
router.put('/:id/status', protect, updateCollaborationStatus);

module.exports = router;
