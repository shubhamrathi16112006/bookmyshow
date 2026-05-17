import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovie, createBooking } from '../api';
import { useApp } from '../context/AppContext';
import './MovieDetail.css';

const FALLBACK = 'https://via.placeholder.com/400x600/18181F/E31E24?text=No+Poster';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, addToast } = useApp();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booking, setBooking] = useState({ userName: '', userEmail: '', seats: 1, showTime: '', venue: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [booked, setBooked] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMovie(id);
        setMovie(res.data.data);
        if (res.data.data.shows?.length > 0) {
          const s = res.data.data.shows[0];
          setBooking(p => ({ ...p, showTime: s.time, venue: s.venue }));
        }
      } catch {
        addToast('Movie not found', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate, addToast]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!booking.userName || !booking.userEmail || !booking.seats) {
      addToast('Please fill all fields', 'error');
      return;
    }
    setBookingLoading(true);
    try {
      const res = await createBooking({ ...booking, movieId: id });
      setBooked(res.data.data);
      addToast('Booking confirmed! 🎉');
    } catch (err) {
      addToast(err.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const poster = movie?.poster ? `http://localhost:5000${movie.poster}` : FALLBACK;

  if (loading) return (
    <div className="detail-loading">
      <div className="detail-skeleton-hero skeleton" />
      <div className="detail-skeleton-info">
        <div className="skeleton" style={{ height: 40, width: '60%', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 16, width: '90%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '70%' }} />
      </div>
    </div>
  );

  if (!movie) return null;

  const durationHrs = Math.floor(movie.duration / 60);
  const durationMins = movie.duration % 60;

  return (
    <div className="movie-detail">
      {/* Hero backdrop */}
      <div className="detail-backdrop">
        <img src={poster} alt="" aria-hidden className="backdrop-img" />
        <div className="backdrop-overlay" />
      </div>

      <div className="detail-layout">
        {/* Poster */}
        <div className="detail-poster-col">
          <img src={poster} alt={movie.title} className="detail-poster"
            onError={(e) => { e.target.src = FALLBACK; }} />
          {role === 'viewer' && (
            <button
              className="btn btn-primary book-cta"
              onClick={() => setBookingOpen(true)}
              disabled={movie.availableSeats === 0}
            >
              {movie.availableSeats === 0 ? 'Sold Out' : 'Book Tickets'}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="detail-info-col">
          <div className="detail-badges">
            <span className="badge badge-red">{movie.rating}</span>
            {movie.genre?.map((g) => <span key={g} className="badge badge-gray">{g}</span>)}
            <span className="badge badge-gray">{movie.language}</span>
          </div>

          <h1 className="detail-title">{movie.title}</h1>

          <div className="detail-meta">
            <span>🕐 {durationHrs}h {durationMins}m</span>
            <span className="meta-dot">·</span>
            <span>📅 {new Date(movie.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="meta-dot">·</span>
            <span className="seats-count">🎟 {movie.availableSeats} seats left</span>
          </div>

          <div className="detail-price-tag">₹{movie.price} <span>per ticket</span></div>

          <p className="detail-desc">{movie.description}</p>

          <div className="detail-crew">
            <div className="crew-item">
              <span className="crew-label">Director</span>
              <span className="crew-value">{movie.director}</span>
            </div>
            {movie.cast && (
              <div className="crew-item">
                <span className="crew-label">Cast</span>
                <span className="crew-value">{movie.cast}</span>
              </div>
            )}
          </div>

          {/* Shows */}
          {movie.shows?.length > 0 && (
            <div className="shows-section">
              <h3 className="shows-heading">Available Shows</h3>
              <div className="shows-grid">
                {movie.shows.map((s, i) => (
                  <div
                    key={i}
                    className={`show-slot ${booking.showTime === s.time && booking.venue === s.venue ? 'selected' : ''}`}
                    onClick={() => setBooking(p => ({ ...p, showTime: s.time, venue: s.venue }))}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setBooking(p => ({ ...p, showTime: s.time, venue: s.venue }))}
                  >
                    <div className="show-time">{s.time}</div>
                    <div className="show-venue">{s.venue}</div>
                    <div className="show-city">{s.city}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {movie.trailer && (
            <a href={movie.trailer} target="_blank" rel="noopener noreferrer" className="trailer-link">
              ▶ Watch Trailer
            </a>
          )}
        </div>
      </div>

      {/* Booking modal */}
      {bookingOpen && (
        <div className="modal-backdrop" onClick={() => !booked && setBookingOpen(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            {booked ? (
              <div className="booking-success">
                <div className="success-icon">🎉</div>
                <h2>Booking Confirmed!</h2>
                <p className="booking-id">Booking ID: <strong>{booked.bookingId}</strong></p>
                <div className="booking-summary">
                  <div className="summary-row"><span>Movie</span><span>{movie.title}</span></div>
                  <div className="summary-row"><span>Show</span><span>{booked.showTime}</span></div>
                  <div className="summary-row"><span>Venue</span><span>{booked.venue}</span></div>
                  <div className="summary-row"><span>Seats</span><span>{booked.seats}</span></div>
                  <div className="summary-row total"><span>Total Paid</span><span>₹{booked.totalAmount}</span></div>
                </div>
                <button className="btn btn-primary" onClick={() => { setBookingOpen(false); setBooked(null); }}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">Book Tickets</h2>
                  <button className="modal-close" onClick={() => setBookingOpen(false)}>✕</button>
                </div>
                <div className="modal-movie-info">
                  <img src={poster} alt="" className="modal-poster" onError={(e) => { e.target.src = FALLBACK; }} />
                  <div>
                    <div className="modal-movie-title">{movie.title}</div>
                    <div className="modal-movie-meta">{movie.language} · {movie.rating}</div>
                    <div className="modal-movie-price">₹{movie.price} per seat</div>
                  </div>
                </div>
                <form onSubmit={handleBook} className="booking-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bname">Your Name</label>
                    <input id="bname" className="form-control" placeholder="Full name" value={booking.userName}
                      onChange={(e) => setBooking(p => ({ ...p, userName: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="bemail">Email</label>
                    <input id="bemail" type="email" className="form-control" placeholder="you@email.com" value={booking.userEmail}
                      onChange={(e) => setBooking(p => ({ ...p, userEmail: e.target.value }))} required />
                  </div>
                  <div className="form-row-modal">
                    <div className="form-group">
                      <label className="form-label" htmlFor="bseats">Seats</label>
                      <select id="bseats" className="form-control" value={booking.seats}
                        onChange={(e) => setBooking(p => ({ ...p, seats: Number(e.target.value) }))}>
                        {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Show</label>
                      <select className="form-control" value={booking.showTime}
                        onChange={(e) => {
                          const s = movie.shows.find(s => s.time === e.target.value);
                          setBooking(p => ({ ...p, showTime: e.target.value, venue: s?.venue || p.venue }));
                        }}>
                        {movie.shows?.map((s, i) => <option key={i} value={s.time}>{s.time} — {s.venue}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="booking-total-bar">
                    <span>Total</span>
                    <span className="booking-total-amt">₹{booking.seats * movie.price}</span>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }} disabled={bookingLoading}>
                    {bookingLoading ? <><span className="spinner" />Processing...</> : 'Confirm Booking'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
