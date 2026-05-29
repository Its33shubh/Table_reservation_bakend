const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },

  tableName: { 
    type: String, 
    required: true,
    trim: true
  },

  section: { 
    type: String,
    trim: true
  },

  seats: { 
    type: Number, 
    required: true,
    min: 1
  },

  // Only physical status (NOT booking)
  status: { 
    type: String, 
    enum: ['Available', 'Maintenance'], 
    default: 'Available' 
  },

  // UI support
  type: {
    type: String,
    enum: ['Regular', 'VIP', 'Outdoor'],
    default: 'Regular'
  },

  features: {
    type: [String],
    default: []
  },

  pricePerHour: {
    type: Number,
    default: 0
  },

  image: {
    type: String,
    default: ''
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

//  prevent duplicate table per restaurant
tableSchema.index(
  { restaurantId: 1, tableName: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true }
  }
);

// auto update timestamp
tableSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Table', tableSchema);