import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function Navbar({ activeView, onViewChange, onOpenCart }) {
  const { user, logout, isStaff, isAdmin } = useAuth();
  const { totalItems, bounceCounter } = useCart();
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    if (bounceCounter > 0) {
      setBouncing(true);
      const timer = setTimeout(() => setBouncing(false), 400);
      return () => clearTimeout(timer);
    }
  }, [bounceCounter]);

  return (
    <header className="navbar">
      <div className="navbar-brand" onClick={() => onViewChange('menu')}>
        <div className="brand-logo-icon">⚡</div>
        <div className="brand-text">
          <span className="brand-name">BitePulse</span>
          <span className="brand-tag">CAMPUS PRE-ORDER</span>
        </div>
      </div>

      <nav className="navbar-nav">
        <button
          className={`nav-link ${activeView === 'menu' ? 'active' : ''}`}
          onClick={() => onViewChange('menu')}
        >
          <span>🍽️ Menu</span>
        </button>

        <button
          className={`nav-link ${activeView === 'orders' ? 'active' : ''}`}
          onClick={() => onViewChange('orders')}
        >
          <span>📦 My Orders</span>
        </button>

        {isStaff && (
          <button
            className={`nav-link ${activeView === 'kitchen' ? 'active' : ''}`}
            onClick={() => onViewChange('kitchen')}
          >
            <span>🍳 Kitchen Queue</span>
          </button>
        )}

        {isAdmin && (
          <button
            className={`nav-link ${activeView === 'admin' ? 'active' : ''}`}
            onClick={() => onViewChange('admin')}
          >
            <span>📊 Admin Hub</span>
          </button>
        )}
      </nav>

      <div className="navbar-actions">
        {user && (
          <div className="user-profile-pill">
            <span className="user-avatar">{user.name ? user.name[0].toUpperCase() : 'U'}</span>
            <div className="user-info">
              <span className="user-name">{user.name || 'Student'}</span>
              <span className={`user-role role-${user.role ? user.role.toLowerCase() : 'student'}`}>{user.role || 'STUDENT'}</span>
            </div>
          </div>
        )}

        <button
          className={`tray-button ${bouncing ? 'animate-bounce' : ''}`}
          onClick={onOpenCart}
          aria-label="View food tray"
        >
          <span className="tray-icon">🛒</span>
          <span className="tray-label">Tray</span>
          <span className="tray-badge">{totalItems}</span>
        </button>

        <button
          className="logout-button"
          onClick={logout}
          title="Sign out of account"
        >
          <span>Log out ↗</span>
        </button>
      </div>
    </header>
  );
}
