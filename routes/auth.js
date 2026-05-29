const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');



// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 50 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  handleValidationErrors,
  register
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  handleValidationErrors,
  login
);

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', auth, getProfile);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put(
  '/profile',
  auth,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('phone')
      .optional()
      .isMobilePhone(['en-IN'])
      .withMessage('Please enter a valid phone number')
  ],
  handleValidationErrors,
  updateProfile
);

module.exports = router;