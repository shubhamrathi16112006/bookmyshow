import React from 'react';

const PLAYS = [
  { id: 1, title: 'Hamlet — Shakespeare Wallah', lang: 'English', duration: '2h 30m', venue: 'NCPA', price: 999, emoji: '🎭' },
  { id: 2, title: 'Toba Tek Singh', lang: 'Urdu/Hindi', duration: '1h 45m', venue: 'Prithvi Theatre', price: 600, emoji: '🎭' },
  { id: 3, title: 'Tumhari Amrita', lang: 'Hindi', duration: '1h 30m', venue: 'Nehru Centre', price: 499, emoji: '🎭' },
  { id: 4, title: 'Sorry Maa', lang: 'Marathi', duration: '2h', venue: 'Bal Gandharva', price: 350, emoji: '🎭' },
];

const Plays = () => (
  <div style={{ padding: 40, maxWidth: 1200, margin: '0 auto' }}>
    <h1 className="section-title" style={{ marginBottom: 8 }}>Plays & Theatre</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: 15 }}>Live drama, musicals and theatrical experiences</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
      {PLAYS.map((p) => (
        <article key={p.id} className="card" style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: 52, background: 'var(--surface2)', padding: '28px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
            {p.emoji}
          </div>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="badge badge-teal">Theatre</span>
            <h3 style={{ fontSize: 17, fontWeight: 500, color: 'var(--text)' }}>{p.title}</h3>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>🌐 {p.lang}</span>
              <span>🕐 {p.duration}</span>
              <span>📍 {p.venue}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gold)' }}>₹{p.price}</span>
              <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Book</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
);

export default Plays;
