import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const FALLBACK = 'https://via.placeholder.com/300x450/18181F/E31E24?text=No+Poster';

const MovieCard = ({ movie, onDelete, isDirector }) => {
  const navigate = useNavigate();
  const poster = movie.poster ? `http://localhost:5000${movie.poster}` : FALLBACK;
  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '';

  return (
    <article className="movie-card" onClick={() => navigate(`/movie/${movie._id}`)}>
      <div className="movie-card-poster">
        <img src={poster} alt={movie.title} loading="lazy"
          onError={(e) => { e.target.src = FALLBACK; }} />
        <div className="movie-card-overlay">
          <button className="btn-book" onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie._id}`); }}>
            Book Now
          </button>
          {isDirector && (
            <button
              className="btn-delete"
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(movie._id); }}
              title="Delete movie"
            >
              ✕
            </button>
          )}
        </div>
        <div className="movie-rating-badge">{movie.rating || 'U/A'}</div>
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <p className="movie-card-meta">
          {movie.genre?.slice(0, 2).join(' • ')}
          {releaseYear && <span className="movie-year"> · {releaseYear}</span>}
        </p>
        <div className="movie-card-lang">
          <span className="badge badge-gray">{movie.language}</span>
          {movie.availableSeats > 0
            ? <span className="seats-avail">⬤ {movie.availableSeats} seats</span>
            : <span className="seats-sold">Sold Out</span>
          }
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
