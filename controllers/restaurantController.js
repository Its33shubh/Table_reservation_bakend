const Restaurant = require('../models/Restaurant');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public

const getRestaurants = async (req, res) => {
  try {

    const restaurants = await Restaurant.find({
      isActive: true
    })
    .select('_id name address details')
    .sort({ name: 1 });

    return res.json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single restaurant by name
// @route   GET /api/restaurants/name/:name
// @access  Public

const getRestaurantID = async (req, res) => {
  try {

    const restaurant = await Restaurant.findOne({
      name: req.params.name,
      isActive: true
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    return res.json({
      success: true,
      data: {
        id: restaurant._id,
        name: restaurant.name,
        address: restaurant.address,
        details: restaurant.details
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
  try {
    const { name, address, details } = req.body;

    if (!name || !address || !details) {
      return res.status(400).json({
        success: false,
        message: 'Name, address and details are required'
      });
    }

    const existingRestaurant = await Restaurant.findOne({
      name: name.trim(),
      isActive: true
    });

    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant already exists'
      });
    }

    const restaurant = await Restaurant.create({
      name: name.trim(),
      address,
      details
    });

    return res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
const updateRestaurant = async (req, res) => {
  try {

    const allowedFields = [
      'name',
      'address',
      'details'
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

    if (req.body.name) {
      const existingRestaurant = await Restaurant.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id },
        isActive: true
      });

      if (existingRestaurant) {
        return res.status(400).json({
          success: false,
          message: 'Restaurant name already exists'
        });
      }
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    return res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: restaurant
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
const deleteRestaurant = async (req, res) => {
  try {

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        updatedAt: Date.now()
      },
      {
        new: true
      }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    return res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantID,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};