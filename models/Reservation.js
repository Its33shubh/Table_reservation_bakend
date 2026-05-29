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

  //  single datetime
  bookingDateTime: { 
    type: Date, 
    required: true 
  },

  // duration in hours
  duration: {
    type: Number,
    default: 1
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

//  prevent exact same booking
reservationSchema.index(
  { tableId: 1, bookingDateTime: 1 },
);

// generate booking reference
reservationSchema.pre('save', async function() {
  if (!this.bookingReference) {
    this.bookingReference = `RES-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Reservation', reservationSchema);