import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AuthPage() {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('student@campus.test');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('👋 Welcome back to BitePulse!', 'success');
      } else {
        if (!name.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        await register(name, email, password);
        showToast('🎉 Account created! Welcome to BitePulse!', 'success');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="auth-fullscreen animate-fade-in">
      <div className="auth-card-wrapper animate-scale-up">
        <div className="auth-header">
          <div className="auth-brand-badge">
            <span className="auth-logo">⚡</span>
            <span>BITEPULSE CAMPUS</span>
          </div>
          <h1 className="auth-heading">
            Good food.<br />
            <em>Zero wait.</em>
          </h1>
          <p className="auth-subtext">
            Skip the lunchtime rush. Pre-order freshly made food and pick it up on your schedule.
          </p>
        </div>

        {error && <div className="auth-error-box">{error}</div>}

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            New Student Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Campus Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="student@campus.test"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Entering...' : mode === 'login' ? 'Enter Canteen →' : 'Create Account & Enter →'}
          </button>
        </form>

        <div className="demo-accounts-section">
          <span className="demo-accounts-title">1-CLICK DEMO PROFILES</span>
          <div className="demo-account-pills">
            <button
              type="button"
              className="demo-pill"
              onClick={() => handleQuickDemo('student@campus.test', 'password')}
            >
              🎓 Student
            </button>
            <button
              type="button"
              className="demo-pill"
              onClick={() => handleQuickDemo('staff@campus.test', 'password')}
            >
              🍳 Kitchen Staff
            </button>
            <button
              type="button"
              className="demo-pill"
              onClick={() => handleQuickDemo('admin@campus.test', 'password')}
            >
              🛡️ Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
