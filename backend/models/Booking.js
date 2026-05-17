const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    seats: { type: Number, required: true },
    showTime: { type: String, required: true },
    venue: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    bookingId: { type: String, unique: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  },
  { timestamps: true }
);

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BMS' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
