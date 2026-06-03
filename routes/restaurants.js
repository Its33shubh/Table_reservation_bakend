const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { 
  getRestaurants, 
  getRestaurant, 
  createRestaurant, 
  updateRestaurant, 
  deleteRestaurant 
} = require('../controllers/restaurantController');
const { auth, adminAuth } = require('../middleware/auth');
const  handleValidationErrors  = require('../middleware/validation');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
router.get('/', getRestaurants);

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
router.get('/:name', getRestaurant);

// @desc    Create restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
router.post(
  '/',
  adminAuth,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Restaurant name must be between 2 and 100 characters'),
    body('cuisine')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Cuisine description too long'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Address too long'),
    body('contact')
      .optional()
      .trim()
      .isMobilePhone(['en-IN'])
      .withMessage('Please enter a valid contact number')
  ],
  handleValidationErrors,
  createRestaurant
);

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
router.put(
  '/:id',
  adminAuth,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Restaurant name must be between 2 and 100 characters'),
    body('cuisine')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Cuisine description too long'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Address too long'),
    body('contact')
      .optional()
      .trim()
      .isMobilePhone(['en-IN'])
      .withMessage('Please enter a valid contact number')
  ],
  handleValidationErrors,
  updateRestaurant
);

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
router.delete('/:id', adminAuth, deleteRestaurant);

module.exports = router;