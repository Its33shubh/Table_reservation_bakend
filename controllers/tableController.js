const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant');

// @desc    Get tables for a restaurant
// @route   GET /api/tables/restaurant/:restaurantId
// @access  Public
const getTablesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status, section } = req.query;

    // Validate restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    let query = { restaurantId, isActive: true };

    //  only valid status allowed
    if (status && ['Available', 'Maintenance'].includes(status)) {
      query.status = status;
    }

    if (section) {
      query.section = section;
    }

    const tables = await Table.find(query).sort({ seats: 1, tableName: 1 });

    return res.json({
      success: true,
      count: tables.length,
      data: tables
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get all tables
// @route   GET /api/tables
// @access  Private/Admin

const getTables = async (req, res) => {
  try {

    const tables = await Table.find({
      isActive: true
    })
    .populate('restaurantId', 'name')
    .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: tables.length,
      data: tables
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get single table
// @route   GET /api/tables/:id
// @access  Public
const getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id)
      .populate('restaurantId', 'name');

    if (!table || !table.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    return res.json({
      success: true,
      data: table
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// @desc    Create table
// @route   POST /api/tables
// @access  Private/Admin
const createTable = async (req, res) => {
  try {
    const {
      restaurantId,
      tableName,
      section,
      seats,
      type,
      features,
      pricePerHour,
      image
    } = req.body;

    // check restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    //  check existing (including soft deleted)
    const existing = await Table.findOne({
      restaurantId,
      tableName
    });

    //  CASE 1: already active
    if (existing && existing.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Table already exists'
      });
    }

    //  CASE 2: exists but deleted → REUSE IT
    if (existing && !existing.isActive) {
      existing.isActive = true;
      existing.section = section;
      existing.seats = seats;
      existing.type = type;
      existing.features = features;
      existing.pricePerHour = pricePerHour;
      existing.image = image;
      existing.updatedAt = Date.now();

      await existing.save();

      return res.status(200).json({
        success: true,
        message: 'Table restored successfully',
        data: existing
      });
    }

    //  CASE 3: new table
    const table = await Table.create({
      restaurantId,
      tableName,
      section,
      seats,
      type,
      features,
      pricePerHour,
      image
    });

    return res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: table
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// @desc    Update table
// @route   PUT  /api/tables/:id
// @access  Private/Admin
const updateTable = async (req, res) => {
  try {

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required'
      });
    }

    const allowedFields = [
      'tableName',
      'section',
      'seats',
      'type',
      'features',
      'pricePerHour',
      'image',
      'status'
    ];

    const updates = Object.keys(req.body);

    const isValid = updates.every(field =>
      allowedFields.includes(field)
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fields in request'
      });
    }

    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('restaurantId', 'name');

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    return res.json({
      success: true,
      message: 'Table updated successfully',
      data: table
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    return res.json({
      success: true,
      message: 'Table deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getTablesByRestaurant,
  getTable,
  getTables,
  createTable,
  updateTable,
  deleteTable
};