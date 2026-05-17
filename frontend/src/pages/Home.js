import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies, deleteMovie } from '../api';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import DirectorPanel from '../components/DirectorPanel';
import './Home.css';

const GENRES = ['All', 'Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Animation', 'Documentary', 'Fantasy', 'Crime'];

const Home = () => {
  const { role, addToast, searchQuery } = useApp();
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeLang, setActiveLang] = useState('All');

  const urlSearch = searchParams.get('search') || '';

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeGenre !== 'All') params.genre = activeGenre;
      if (activeLang !== 'All') params.language = activeLang;
      if (urlSearch || searchQuery) params.search = urlSearch || searchQuery;
      const res = await getMovies(params);
      setMovies(res.data.data);
    } catch {
      addToast('Failed to load movies', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeGenre, activeLang, urlSearch, searchQuery, addToast]);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await deleteMovie(id);
      setMovies((p) => p.filter((m) => m._id !== id));
      addToast('Movie deleted');
    } catch {
      addToast('Failed to delete movie', 'error');
    }
  };

  const handleMovieAdded = (newMovie) => {
    setMovies((prev) => [newMovie, ...prev]);
  };

  const isDirector = role === 'director';

  return (
    <div className="home-layout">
      {isDirector && <DirectorPanel onMovieAdded={handleMovieAdded} />}

      <main className="home-main">
        {/* Hero Banner */}
        {!urlSearch && !searchQuery && (
          <section className="hero-banner">
            <div className="hero-bg">
              <div className="hero-overlay" />
              <div className="hero-pattern" />
            </div>
            <div className="hero-content">
              <div className="hero-eyebrow">Now Showing</div>
              <h1 className="hero-title">Book Your<br />Next Experience</h1>
              <p className="hero-subtitle">Movies · Events · Plays · Sports · Comedy shows</p>
              <div className="hero-stats">
                <div className="hero-stat"><span className="stat-num">5000+</span><span className="stat-label">Screens</span></div>
                <div className="hero-divider" />
                <div className="hero-stat"><span className="stat-num">650+</span><span className="stat-label">Cities</span></div>
                <div className="hero-divider" />
                <div className="hero-stat"><span className="stat-num">10M+</span><span className="stat-label">Tickets/month</span></div>
              </div>
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="filters-bar">
          <div className="filters-section">
            <span className="filter-label">Genre</span>
            <div className="filter-chips">
              {GENRES.map((g) => (
                <button key={g}
                  className={`filter-chip ${activeGenre === g ? 'active' : ''}`}
                  onClick={() => setActiveGenre(g)}
                >{g}</button>
              ))}
            </div>
          </div>
          <div className="filters-section">
            <span className="filter-label">Language</span>
            <div className="filter-chips">
              {['All', 'Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam'].map((l) => (
                <button key={l}
                  className={`filter-chip ${activeLang === l ? 'active' : ''}`}
                  onClick={() => setActiveLang(l)}
                >{l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Section heading */}
        <div className="section-heading">
          <h2 className="section-title">
            {urlSearch || searchQuery
              ? `Results for "${urlSearch || searchQuery}"`
              : activeGenre === 'All' ? 'Recommended Movies' : activeGenre}
          </h2>
          <span className="movie-count">{movies.length} movies</span>
        </div>

        {/* Movie grid */}
        {loading ? (
          <div className="movie-grid">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="movie-card-skeleton">
                <div className="skeleton" style={{ aspectRatio: '2/3', marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: '60%' }} />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>No movies found</h3>
            <p>
              {isDirector
                ? 'Add your first movie using the form on the left'
                : 'Check back later for new releases'
              }
            </p>
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map((m, i) => (
              <div key={m._id} style={{ animationDelay: `${i * 0.04}s` }}>
                <MovieCard movie={m} isDirector={isDirector} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
