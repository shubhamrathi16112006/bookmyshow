const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

router.post('/', async (req, res) => {
  try {
    const { movieId, userName, userEmail, seats, showTime, venue } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    if (movie.availableSeats < seats) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }
    const totalAmount = seats * movie.price;
    const booking = new Booking({
      movie: movieId,
      userName,
      userEmail,
      seats,
      showTime,
      venue,
      totalAmount,
    });
    await booking.save();
    movie.availableSeats -= seats;
    await movie.save();
    res.status(201).json({ success: true, data: booking, message: 'Booking confirmed!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('movie', 'title poster').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('movie');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
