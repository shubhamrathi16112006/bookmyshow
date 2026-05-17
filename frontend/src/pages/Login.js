import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Login.css';

const Login = () => {
  const { setRole } = useApp();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select a role — Director or Viewer');
      return;
    }

    if (isRegister) {
      if (!form.name.trim()) { setError('Name is required'); return; }
      if (!form.email.trim()) { setError('Email is required'); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
      if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    } else {
      if (!form.email.trim()) { setError('Email is required'); return; }
      if (!form.password) { setError('Password is required'); return; }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRole(selectedRole);
      navigate('/');
    }, 900);
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-grid" />
      </div>

      <div className="login-container">
        <div className="login-brand">
          <div className="login-logo"><span>▶</span></div>
          <h1 className="login-wordmark">SHOWTIME</h1>
          <p className="login-tagline">India's finest entertainment booking experience</p>
        </div>

        <div className="login-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${!isRegister ? 'active' : ''}`}
              onClick={() => { setIsRegister(false); setError(''); }}
            >Sign In</button>
            <button
              className={`auth-tab ${isRegister ? 'active' : ''}`}
              onClick={() => { setIsRegister(true); setError(''); }}
            >Create Account</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Role selector */}
            <div className="role-section">
              <p className="role-section-label">I am a</p>
              <div className="role-toggle-group">
                <button
                  type="button"
                  className={`role-toggle ${selectedRole === 'director' ? 'active' : ''}`}
                  onClick={() => setSelectedRole('director')}
                >
                  <span className="role-toggle-icon">🎬</span>
                  <span className="role-toggle-name">Director</span>
                  <span className="role-toggle-desc">Add & manage movies</span>
                  {selectedRole === 'director' && <span className="role-check">✓</span>}
                </button>
                <button
                  type="button"
                  className={`role-toggle ${selectedRole === 'viewer' ? 'active' : ''}`}
                  onClick={() => setSelectedRole('viewer')}
                >
                  <span className="role-toggle-icon">🍿</span>
                  <span className="role-toggle-name">Viewer</span>
                  <span className="role-toggle-desc">Browse & book tickets</span>
                  {selectedRole === 'viewer' && <span className="role-check">✓</span>}
                </button>
              </div>
            </div>

            <div className="form-divider"><span>Account details</span></div>

            {isRegister && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name" name="name" className="form-control"
                  placeholder="Your full name"
                  value={form.name} onChange={handleChange}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email" className="form-control"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password" className="form-control"
                placeholder={isRegister ? 'Min. 6 characters' : 'Your password'}
                value={form.password} onChange={handleChange}
              />
            </div>

            {isRegister && (
              <div className="form-group">
                <label className="form-label" htmlFor="confirm">Confirm Password</label>
                <input
                  id="confirm" name="confirm" type="password" className="form-control"
                  placeholder="Repeat your password"
                  value={form.confirm} onChange={handleChange}
                />
              </div>
            )}

            {error && <div className="auth-error">⚠ {error}</div>}

            {!isRegister && (
              <div className="forgot-row">
                <button type="button" className="forgot-link">Forgot password?</button>
              </div>
            )}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading
                ? <><span className="spinner" />{isRegister ? 'Creating account...' : 'Signing in...'}</>
                : isRegister ? 'Create Account' : 'Sign In'
              }
            </button>

            <p className="auth-switch">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button" className="auth-switch-btn" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
                {isRegister ? 'Sign in' : 'Register'}
              </button>
            </p>
          </form>
        </div>

        <div className="login-footer">
          <span>Movies</span><span className="dot">·</span>
          <span>Events</span><span className="dot">·</span>
          <span>Plays</span><span className="dot">·</span>
          <span>Sports</span><span className="dot">·</span>
          <span>Comedy</span>
        </div>
      </div>
    </div>
  );
};

export default Login;