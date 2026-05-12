import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieForm from './MovieForm';
import MovieCard from './MovieCard';

function Dashboard({ role, setRole }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar for Directors only */}
      {role === 'director' && (
        <div className="sidebar">
          <h2>Director Panel</h2>
          <p style={{ color: 'var(--text-muted)' }}>Publish a new release</p>
          <MovieForm onMovieAdded={fetchMovies} />
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="navbar">
          <h2>Now Showing</h2>
          <button className="btn btn-logout" onClick={() => setRole(null)}>
            Disconnect
          </button>
        </div>

        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;