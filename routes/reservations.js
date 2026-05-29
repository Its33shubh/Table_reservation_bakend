const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { 
  createReservation,
  getUserReservations,
  getReservation,
  updateReservationStatus,
  cancelReservation,
  getRestaurantReservations,
  checkAvailability
} = require('../controllers/reservationController');
const { auth, adminAuth } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');

// @desc    Check table availability
// @route   GET /api/reservations/check-availability
// @access  Public
router.get('/check-availability', checkAvailability);

// @desc    Get user's reservations
// @route   GET /api/reservations
// @access  Private
router.get('/', auth, getUserReservations);

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
router.get('/:id', auth, getReservation);

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Private
router.post(
  '/',
  auth,

  // ✅ ALL VALIDATORS IN ONE ARRAY
  [
    body('restaurantId').isMongoId(),
    body('tableId').isMongoId(),
    body('date').isISO8601(),
    body('time').notEmpty(),
    body('guests').isInt({ min: 1, max: 20 }),
    body('specialRequests').optional().trim().isLength({ max: 500 })
  ],

  handleValidationErrors,
  createReservation
);



// @desc    Update reservation status
// @route   PUT /api/reservations/:id
// @access  Private/Admin
router.put(
  '/:id',
  adminAuth,         // ← spread it out
  [
    body('status')
      .isIn(['Pending', 'Confirmed', 'Cancelled', 'Completed'])
      .withMessage('Status must be one of: Pending, Confirmed, Cancelled, Completed')
    ],
  handleValidationErrors,
  updateReservationStatus
);
// @desc    Cancel reservation
// @route   DELETE /api/reservations/:id
// @access  Private
router.delete('/:id', auth, cancelReservation);

// @desc    Get reservations for a restaurant
// @route   GET /api/restaurants/:restaurantId/reservations
// @access  Private/Admin
router.get('/restaurants/:restaurantId/', adminAuth, getRestaurantReservations);



module.exports = router;