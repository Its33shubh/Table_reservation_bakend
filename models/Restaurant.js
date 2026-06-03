const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  address: {
    type: String,
    required: true,
    trim: true
  },

  details: {
    type: String,
    default: '',
    trim: true
  },

  image: {
    type: String,
    default: ''
  },

  contact: {
    type: String,
    default: '',
    trim: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Restaurant', restaurantSchema);

// openingHours: {
//   monday: { open: String, close: String },
//   tuesday: { open: String, close: String },
//   wednesday: { open: String, close: String },
//   thursday: { open: String, close: String },
//   friday: { open: String, close: String },
//   saturday: { open: String, close: String },
//   sunday: { open: String, close: String }
// },