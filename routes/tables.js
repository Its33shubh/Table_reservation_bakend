const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { 
  getTablesByRestaurant, 
  getTable, 
  createTable, 
  updateTable, 
  deleteTable 
} = require('../controllers/tableController');
const { auth, adminAuth } = require('../middleware/auth');
const handleValidationErrors  = require('../middleware/validation');

// @desc    Get tables for a restaurant
// @route   GET /api/restaurants/:restaurantId/tables
// @access  Public
router.get('/restaurant/:restaurantId', getTablesByRestaurant);

// @desc    Get single table
// @route   GET /api/tables/:id
// @access  Public
router.get('/:id', getTable);

// @desc    Create table
// @route   POST /api/tables
// @access  Private/Admin
router.post(
  '/',
  adminAuth,
  [
    body('restaurantId')
      .isMongoId()
      .withMessage('Please provide a valid restaurant ID'),
    body('tableName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Table name must be between 2 and 50 characters'),
    body('seats')
      .isInt({ min: 1, max: 20 })
      .withMessage('Seats must be between 1 and 20'),
    body('section')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Section name too long'),
    body('pricePerHour')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price per hour must be a positive number')
  ],
  handleValidationErrors,
  createTable
);

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private/Admin
router.put(
  '/:id',
  adminAuth,
  [
    body('tableName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Table name must be between 2 and 50 characters'),
    body('seats')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Seats must be between 1 and 20'),
    body('section')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Section name too long'),
    body('pricePerHour')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price per hour must be a positive number'),
    body('status')
      .optional()
      .isIn(['Available', 'Booked', 'Maintenance', 'Reserved'])
      .withMessage('Status must be one of: Available, Booked, Maintenance, Reserved')
  ],
  handleValidationErrors,
  updateTable
);

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
router.delete('/:id', adminAuth, deleteTable);

module.exports = router;