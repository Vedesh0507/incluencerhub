const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  registerUser,
  loginUser,
  getMe,
  googleOAuthCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/auth/login?error=OAuthFailed' }),
  googleOAuthCallback
);

module.exports = router;
