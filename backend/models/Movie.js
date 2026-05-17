const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    genre: { type: [String], required: true },
    language: { type: String, required: true },
    duration: { type: Number, required: true },
    rating: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    cast: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: String, default: '' },
    trailer: { type: String, default: '' },
    price: { type: Number, required: true, default: 250 },
    totalSeats: { type: Number, default: 100 },
    availableSeats: { type: Number, default: 100 },
    shows: [
      {
        time: String,
        date: Date,
        venue: String,
        city: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
