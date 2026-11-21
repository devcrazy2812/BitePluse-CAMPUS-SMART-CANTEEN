import React from 'react';

export function HeroBanner() {
  return (
    <section className="hero-banner animate-fade-in">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="live-pulse"></span>
          <span>CAMPUS CAFETERIA ONLINE</span>
        </div>
        <h1 className="hero-title">
          Skip the line.<br />
          <em>Eat on your time.</em>
        </h1>
        <p className="hero-description">
          Pre-order fresh hot meals, crisp rolls, and artisan beverages from the campus canteen.
          Pick up in seconds when you hear your name called.
        </p>

        <div className="hero-perks">
          <div className="perk-pill">
            <span className="perk-icon">⚡</span>
            <span>Zero Queue</span>
          </div>
          <div className="perk-pill">
            <span className="perk-icon">🔥</span>
            <span>Freshly Cooked</span>
          </div>
          <div className="perk-pill">
            <span className="perk-icon">⏱️</span>
            <span>Scheduled Pickup</span>
          </div>
        </div>
      </div>

      <div className="hero-graphic">
        <div className="floating-badge badge-top animate-float">
          <span>🥗 Healthy Bowls</span>
        </div>
        <div className="hero-main-emoji">
          🍛
        </div>
        <div className="floating-badge badge-bottom animate-float-delay">
          <span>☕ 3-Min Pickups</span>
        </div>
      </div>
    </section>
  );
}
