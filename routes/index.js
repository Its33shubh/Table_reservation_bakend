const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const restaurantRoutes = require('./restaurants');
const tableRoutes = require('./tables');
const reservationRoutes = require('./reservations');

// Route definitions
router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/tables', tableRoutes);
router.use('/reservations', reservationRoutes);

module.exports = router;