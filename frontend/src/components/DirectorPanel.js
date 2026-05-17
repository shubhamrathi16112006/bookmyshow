import React, { useState } from 'react';
import { createMovie } from '../api';
import { useApp } from '../context/AppContext';
import './DirectorPanel.css';

const GENRES = ['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Animation', 'Documentary', 'Fantasy', 'Crime'];
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Bengali'];
const RATINGS = ['U', 'UA', 'A', 'S'];

const DirectorPanel = ({ onMovieAdded }) => {
  const { addToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [form, setForm] = useState({
    title: '', genre: [], language: 'Hindi', duration: '',
    rating: 'UA', releaseDate: '', director: '', cast: '',
    description: '', price: '250', trailer: '', poster: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'poster') {
      const file = files[0];
      setForm((p) => ({ ...p, poster: file }));
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const toggleGenre = (g) => {
    setForm((p) => ({
      ...p,
      genre: p.genre.includes(g) ? p.genre.filter((x) => x !== g) : [...p.genre, g],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.genre.length || !form.duration || !form.releaseDate || !form.director || !form.description) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'genre') fd.append(k, v.join(','));
        else if (k === 'poster' && v) fd.append(k, v);
        else if (k !== 'poster') fd.append(k, v);
      });
      const res = await createMovie(fd);
      addToast(`"${res.data.data.title}" added successfully!`);
      onMovieAdded && onMovieAdded(res.data.data);
      setForm({
        title: '', genre: [], language: 'Hindi', duration: '',
        rating: 'UA', releaseDate: '', director: '', cast: '',
        description: '', price: '250', trailer: '', poster: null,
      });
      setPreviewUrl(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add movie', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className={`director-panel ${collapsed ? 'collapsed' : ''}`}>
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon">🎬</span>
          {!collapsed && <h2 className="panel-title">Add Movie</h2>}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {!collapsed && (
        <form className="panel-form" onSubmit={handleSubmit}>
          {/* Poster upload */}
          <div className="poster-upload-zone">
            <input type="file" name="poster" id="poster" accept="image/*" onChange={handleChange} hidden />
            <label htmlFor="poster" className="poster-upload-label">
              {previewUrl ? (
                <img src={previewUrl} alt="Poster preview" className="poster-preview" />
              ) : (
                <div className="poster-placeholder">
                  <span className="upload-icon">🖼</span>
                  <span>Click to upload poster</span>
                  <span className="upload-hint">JPG, PNG, WEBP · Max 10MB</span>
                </div>
              )}
            </label>
            {previewUrl && (
              <button type="button" className="remove-poster" onClick={() => { setPreviewUrl(null); setForm(p => ({ ...p, poster: null })); }}>
                Remove poster
              </button>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="title">Title *</label>
            <input id="title" name="title" className="form-control" placeholder="Movie title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Genres *</label>
            <div className="genre-chips">
              {GENRES.map((g) => (
                <button key={g} type="button"
                  className={`genre-chip ${form.genre.includes(g) ? 'active' : ''}`}
                  onClick={() => toggleGenre(g)}
                >{g}</button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="language">Language *</label>
              <select id="language" name="language" className="form-control" value={form.language} onChange={handleChange}>
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="rating">Rating *</label>
              <select id="rating" name="rating" className="form-control" value={form.rating} onChange={handleChange}>
                {RATINGS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="duration">Duration (min) *</label>
              <input id="duration" name="duration" type="number" className="form-control" placeholder="148" value={form.duration} onChange={handleChange} min="1" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="price">Ticket Price (₹) *</label>
              <input id="price" name="price" type="number" className="form-control" placeholder="250" value={form.price} onChange={handleChange} min="1" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="releaseDate">Release Date *</label>
            <input id="releaseDate" name="releaseDate" type="date" className="form-control" value={form.releaseDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="director">Director *</label>
            <input id="director" name="director" className="form-control" placeholder="Director name" value={form.director} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cast">Cast</label>
            <input id="cast" name="cast" className="form-control" placeholder="Actor 1, Actor 2..." value={form.cast} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Synopsis *</label>
            <textarea id="description" name="description" className="form-control" placeholder="Movie synopsis..." value={form.description} onChange={handleChange} rows={4} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="trailer">Trailer URL</label>
            <input id="trailer" name="trailer" className="form-control" placeholder="YouTube URL" value={form.trailer} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
            {loading ? <><span className="spinner" />Adding...</> : '+ Add to Showtime'}
          </button>
        </form>
      )}
    </aside>
  );
};

export default DirectorPanel;
