const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },

  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },

  // Snapshot data
  customerName: {
    type: String,
    required: true,
    trim: true
  },

  customerPhone: {
    type: String,
    required: true,
    trim: true
  },

  bookingDateTime: {
    type: Date,
    required: true
  },

  duration: {
    type: Number,
    enum: [30, 40, 50],
    default: 30
  },

  guests: {
    type: Number,
    required: true,
    min: 1
  },

  specialRequests: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  },

  bookingReference: {
    type: String,
    unique: true
  },

  totalAmount: {
    type: Number,
    default: 0
  },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
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

reservationSchema.index({
  tableId: 1,
  bookingDateTime: 1
});

reservationSchema.pre('save', async function () {
  if (!this.bookingReference) {
    this.bookingReference =
      `RES-${Date.now().toString().slice(-6)}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;
  }

  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Reservation', reservationSchema);