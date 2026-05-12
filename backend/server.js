const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory mock database with premium demo data
let movies = [
  { 
    id: 1, 
    title: "Vincenzo", 
    genre: "Crime/Dark Comedy",
    poster: "https://image.tmdb.org/t/p/w500/dvXJgEDQXhL9Ouot2WkBHpQiHGd.jpg" 
  },
  { 
    id: 2, 
    title: "Signal", 
    genre: "Crime/Sci-Fi",
    poster: "https://image.tmdb.org/t/p/w500/2yBqA9Lz1tTqH6I4rGfBqJ7A7y3.jpg" 
  },
  { 
    id: 3, 
    title: "Bloodhounds", 
    genre: "Action/Thriller",
    poster: "https://image.tmdb.org/t/p/w500/n1yQvD2m6iI0O1XQ4R0R9tX1y2.jpg" 
  },
  { 
    id: 4, 
    title: "Oppenheimer", 
    genre: "Biography/Drama",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" 
  }
];

// Get all movies
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

// Add a new movie (Director only route)
app.post('/api/movies', (req, res) => {
  const newMovie = {
    id: Date.now(),
    title: req.body.title,
    genre: req.body.genre,
    poster: req.body.poster
  };
  movies.unshift(newMovie); // Add to the beginning of the list
  res.status(201).json(newMovie);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));