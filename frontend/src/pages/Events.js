import React from 'react';
import './Events.css';

const EVENTS = [
  { id: 1, title: 'Arijit Singh Live', category: 'Music', date: 'Jun 15, 2025', venue: 'DY Patil Stadium', city: 'Mumbai', price: 1499, emoji: '🎵' },
  { id: 2, title: 'Zakir Khan Stand-Up', category: 'Comedy', date: 'Jun 20, 2025', venue: 'NCPA', city: 'Mumbai', price: 799, emoji: '😂' },
  { id: 3, title: 'IPL — MI vs CSK', category: 'Sports', date: 'Jun 22, 2025', venue: 'Wankhede', city: 'Mumbai', price: 1999, emoji: '🏏' },
  { id: 4, title: 'Comic Con India', category: 'Exhibition', date: 'Jun 28, 2025', venue: 'NESCO', city: 'Mumbai', price: 599, emoji: '🦸' },
  { id: 5, title: 'Sunburn Festival', category: 'Music', date: 'Jul 4, 2025', venue: 'Vagator Beach', city: 'Goa', price: 2499, emoji: '🎶' },
  { id: 6, title: 'NH7 Weekender', category: 'Music', date: 'Jul 12, 2025', venue: 'Mahalaxmi Grounds', city: 'Mumbai', price: 3499, emoji: '🎸' },
];

const Events = () => {
  return (
    <div className="events-page">
      <div className="events-hero">
        <h1 className="section-title">Events & Experiences</h1>
        <p className="events-subtitle">Concerts, comedy shows, sports, exhibitions and more</p>
      </div>

      <div className="events-grid">
        {EVENTS.map((e) => (
          <article key={e.id} className="event-card card">
            <div className="event-emoji-bg">{e.emoji}</div>
            <div className="event-body">
              <span className="badge badge-teal">{e.category}</span>
              <h3 className="event-title">{e.title}</h3>
              <div className="event-meta">
                <span>📅 {e.date}</span>
                <span>📍 {e.venue}, {e.city}</span>
              </div>
              <div className="event-footer">
                <span className="event-price">from ₹{e.price.toLocaleString()}</span>
                <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
                  Book Now
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Events;
