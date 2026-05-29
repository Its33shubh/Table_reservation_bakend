const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  cuisine: { 
    type: String,
    trim: true
  },
  image: { 
    type: String,
    default: ''
  },
  rating: { 
    type: Number,
    min: 0,
    max: 5
  },
  address: { 
    type: String,
    trim: true
  },
  contact: { 
    type: String,
    trim: true
  },
  category: {
    type: String,
    default: 'Fine Dining',
    trim: true
  },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
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