const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant');


// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {

    const {
      restaurantId,
      tableId,
      date,
      time,
      duration,
      guests,
      specialRequests
    } = req.body;

    // Required fields validation
    if (
      !restaurantId ||
      !tableId ||
      !date ||
      !time ||
      !guests ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Duration validation
    if (![30, 40, 50].includes(Number(duration))) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be 30, 40 or 50 minutes'
      });
    }

    // Booking start time
    const bookingStart = new Date(`${date}T${time}:00`);

    // Booking end time based on selected duration
    const bookingEnd = new Date(
      bookingStart.getTime() +
      (Number(duration) * 60 * 1000)
    );

    // Restaurant validation
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Table validation
    const table = await Table.findById(tableId);

    if (
      !table ||
      !table.isActive ||
      table.restaurantId.toString() !== restaurantId
    ) {
      return res.status(404).json({
        success: false,
        message: 'Table not found for this restaurant'
      });
    }

    // Seat validation
    if (Number(guests) > table.seats) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${table.seats} guests allowed`
      });
    }

    // Existing reservations
    const reservations = await Reservation.find({
      tableId,
      status: { $ne: 'Cancelled' }
    });

    // Time overlap validation
    const isBooked = reservations.some((reservation) => {

      const existingStart = new Date(
        reservation.bookingDateTime
      );

      const existingEnd = new Date(
        existingStart.getTime() +
        ((reservation.duration || 30) * 60 * 1000)
      );

      return (
        bookingStart < existingEnd &&
        bookingEnd > existingStart
      );
    });

    if (isBooked) {
      return res.status(400).json({
        success: false,
        message: 'Table already booked for this time slot'
      });
    }

    // Create reservation
    const reservation = await Reservation.create({
      userId: req.user._id,
      restaurantId,
      tableId,
    
      customerName: req.user.name,
      customerPhone: req.user.phone,
    
      bookingDateTime: bookingStart,
      duration,
      guests,
      specialRequests,
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation
    });

  } catch (error) {

    console.error(' FULL ERROR:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get user's reservations
// @route   GET /api/reservations
// @access  Private
const getUserReservations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = { userId: req.user._id };

    if (status) query.status = status;

    const reservations = await Reservation.find(query)
      .populate('restaurantId', 'name')
      .populate('tableId', 'tableName seats section')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reservation.countDocuments(query);

    return res.json({
      success: true,
      count: reservations.length,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: reservations
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('restaurantId', 'name')
      .populate('tableId', 'tableName seats');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // ownership check
    if (
      reservation.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    return res.json({
      success: true,
      data: reservation
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Update reservation status (Admin only)
// @route   PUT /api/reservations/:id
// @access  Private/Admin
const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const valid = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];

    if (!valid.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    return res.json({
      success: true,
      message: 'Status updated',
      data: reservation
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Cancel reservation
// @route   DELETE /api/reservations/:id
// @access  Private
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    if (
      reservation.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (reservation.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    reservation.status = 'Cancelled';
    reservation.updatedAt = Date.now();

    await reservation.save();

    return res.json({
      success: true,
      message: 'Reservation cancelled',
      data: reservation
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//admin@gmail.com admin@333
// @desc    Get reservations for a restaurant (Admin only)
// @route   GET /api/restaurants/:restaurantId
// @access  Private/Admin
const getRestaurantReservations = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10, status, date } = req.query;

    // Validate restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Build query
    let query = { restaurantId };
    if (status) query.status = status;

    // ✅ Filter by bookingDateTime range instead of old date field
    if (date) {
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59`);
      query.bookingDateTime = { $gte: start, $lte: end };
    }

    const reservations = await Reservation.find(query)
      .populate('userId', 'name email')
      .populate('tableId', 'tableName seats section')
      .sort({ bookingDateTime: 1, createdAt: -1 }) // ✅ sort by bookingDateTime
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reservation.countDocuments(query);

    return res.json({
      success: true,
      count: reservations.length,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: reservations
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check table availability
// @route   GET /api/reservations/check-availability
// @access  Public
const availableTables = async (req, res) => {
  try {

    const {
      restaurantId,
      guests,
      date,
      time,
      duration
    } = req.query;

    if (
      !restaurantId ||
      !guests ||
      !date ||
      !time ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (![30, 40, 50].includes(Number(duration))) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be 30, 40 or 50 minutes'
      });
    }

    const bookingStart = new Date(`${date}T${time}:00`);

    const bookingEnd = new Date(
      bookingStart.getTime() +
      (Number(duration) * 60 * 1000)
    );

    // All active tables with enough seats
    const tables = await Table.find({
      restaurantId,
      isActive: true,
      seats: { $gte: Number(guests) }
    });

    const availableTables = [];

    for (const table of tables) {

      const reservations = await Reservation.find({
        tableId: table._id,
        status: {
          $in: ['Pending', 'Confirmed']
        }
      });

      const isBooked = reservations.some((reservation) => {

        const existingStart = new Date(
          reservation.bookingDateTime
        );

        const existingEnd = new Date(
          existingStart.getTime() +
          ((reservation.duration || 30) * 60 * 1000)
        );

        return (
          bookingStart < existingEnd &&
          bookingEnd > existingStart
        );
      });

      if (!isBooked) {
        availableTables.push({
          _id: table._id,
          tableName: table.tableName,
          seats: table.seats,
          section: table.section,
          type: table.type,
          status: table.status
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: availableTables.length,
      data: availableTables
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getReservation,
  updateReservationStatus,
  cancelReservation,
  getRestaurantReservations,
  availableTables
};