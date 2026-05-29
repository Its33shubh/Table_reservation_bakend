const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { matchedData } = require('express-validator');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      restaurantId
    } = req.body;

    // Required fields validation
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        error: true,
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRgx =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRgx.test(email)) {
      return res.status(400).json({
        error: true,
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        error: true,
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Role validation
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        error: true,
        success: false,
        message: 'Role must be customer or admin'
      });
    }

    // Admin restaurant validation
    if (role === 'admin' && !restaurantId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: 'Restaurant is required for admin'
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      phone,
      role,
      restaurantId: role === 'admin' ? restaurantId : null
    });

    await user.save();

    const token = generateToken(user._id);

    return res.status(201).json({
      error: false,
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        restaurantId: user.restaurantId
      }
    });

  } catch (error) {
    console.error(' REGISTER ERROR:', error);

    return res.status(500).json({
      error: true,
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    return res.json({
      error:false,
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        restaurantId: user.restaurantId
      }
    });

  } catch (error) {
    return res.status(500).json({
      error:true,
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        restaurantId: req.user.restaurantId
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Block role update
    if (req.body.role) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update role'
      });
    }

    // Block restaurant change
    if (req.body.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update restaurant'
      });
    }

    // Check duplicate email
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Update password if provided
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }

      user.password = password;
    }

    user.updatedAt = Date.now();

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        restaurantId: user.restaurantId
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};