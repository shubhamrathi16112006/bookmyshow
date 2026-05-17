const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Movie = require('../models/Movie');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

router.get('/', async (req, res) => {
  try {
    const { genre, language, search } = req.query;
    let query = {};
    if (genre) query.genre = { $in: [genre] };
    if (language) query.language = language;
    if (search) query.title = { $regex: search, $options: 'i' };
    const movies = await Movie.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, data: movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', upload.single('poster'), async (req, res) => {
  try {
    const {
      title, genre, language, duration, rating,
      releaseDate, director, cast, description, price, trailer,
    } = req.body;

    const shows = [
      { time: '10:00 AM', date: new Date(releaseDate), venue: 'PVR Cinemas', city: 'Mumbai' },
      { time: '1:30 PM', date: new Date(releaseDate), venue: 'INOX', city: 'Delhi' },
      { time: '4:00 PM', date: new Date(releaseDate), venue: 'Cinepolis', city: 'Bangalore' },
      { time: '7:30 PM', date: new Date(releaseDate), venue: 'PVR IMAX', city: 'Mumbai' },
      { time: '10:00 PM', date: new Date(releaseDate), venue: 'Miraj Cinemas', city: 'Pune' },
    ];

    const movie = new Movie({
      title,
      genre: Array.isArray(genre) ? genre : genre.split(',').map((g) => g.trim()),
      language,
      duration: Number(duration),
      rating,
      releaseDate,
      director,
      cast,
      description,
      price: Number(price) || 250,
      trailer,
      poster: req.file ? `/uploads/${req.file.filename}` : '',
      shows,
    });

    await movie.save();
    res.status(201).json({ success: true, data: movie, message: 'Movie added successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', upload.single('poster'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.poster = `/uploads/${req.file.filename}`;
    if (updates.genre && typeof updates.genre === 'string') {
      updates.genre = updates.genre.split(',').map((g) => g.trim());
    }
    const movie = await Movie.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, data: movie });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
