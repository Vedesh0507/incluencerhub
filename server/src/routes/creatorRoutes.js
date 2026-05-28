const express = require('express');
const router = express.Router();
const {
  createProfile,
  updateProfile,
  getAllCreators,
  getCreatorById,
} = require('../controllers/creatorController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllCreators);
router.get('/:id', getCreatorById);

// Protected routes
router.post('/', protect, createProfile);
router.put('/:id', protect, updateProfile);

module.exports = router;
