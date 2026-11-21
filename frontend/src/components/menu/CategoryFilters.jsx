import React from 'react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Items', icon: '🍽️' },
  { id: 'MEALS', label: 'Meals & Bowls', icon: '🍛' },
  { id: 'SNACKS', label: 'Snacks & Rolls', icon: '🌯' },
  { id: 'BEVERAGES', label: 'Cold & Hot Drinks', icon: '☕' },
  { id: 'DESSERTS', label: 'Sweets & Desserts', icon: '🍰' },
];

export function CategoryFilters({ activeCategory, onSelectCategory, counts = {} }) {
  return (
    <div className="category-scroll-wrapper">
      <div className="category-chips">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id];
          return (
            <button
              key={cat.id}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="chip-icon">{cat.icon}</span>
              <span className="chip-label">{cat.label}</span>
              {count !== undefined && (
                <span className="chip-count">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
