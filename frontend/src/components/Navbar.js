import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

const Navbar = () => {
  const { role, logout, searchQuery, setSearchQuery, selectedCity, setSelectedCity } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/?search=${searchQuery.trim()}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">▶</span>
          <span className="logo-text">SHOWTIME</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search movies, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
          />
          {searchQuery && (
            <button type="button" className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </form>

        <div className="navbar-right">
          <select
            className="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            aria-label="Select city"
          >
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          <div className="nav-links hide-mobile">
            <Link to="/movies" className="nav-link">Movies</Link>
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/plays" className="nav-link">Plays</Link>
          </div>

          {role === 'director' && (
            <span className="role-badge director">Director</span>
          )}
          {role === 'viewer' && (
            <span className="role-badge viewer">Viewer</span>
          )}

          <button
            className="btn btn-ghost hide-mobile"
            onClick={() => { logout(); navigate('/login'); }}
          >
            Sign out
          </button>

          <button
            className="burger hide-desktop"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/movies" onClick={() => setMenuOpen(false)}>Movies</Link>
          <Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link>
          <Link to="/plays" onClick={() => setMenuOpen(false)}>Plays</Link>
          <button onClick={() => { logout(); navigate('/login'); setMenuOpen(false); }}>Sign out</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
