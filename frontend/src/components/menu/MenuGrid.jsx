import React, { useState, useMemo, useEffect } from 'react';
import { CategoryFilters } from './CategoryFilters';
import { FoodCard } from './FoodCard';
import { api } from '../../services/api';

export function MenuGrid() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    let mounted = true;
    api.getMenu().then(data => {
      if (mounted) {
        setMenu(data);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { ALL: menu.length };
    menu.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [menu]);

  const filteredItems = useMemo(() => {
    let list = menu.filter(item => {
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesVeg = !vegOnly || item.dietaryTag === 'VEG' || item.dietaryTag === 'VEGAN';
      return matchesCategory && matchesSearch && matchesVeg;
    });

    if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [menu, selectedCategory, searchQuery, vegOnly, sortBy]);

  return (
    <section className="menu-section">
      <div className="menu-header-bar">
        <div>
          <span className="eyebrow">FRESH TODAY</span>
          <h2 className="section-heading">Explore the Canteen Catalog</h2>
        </div>
      </div>

      <div className="filter-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search burgers, rolls, chai, bowls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="toolbar-controls">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
            />
            <span className="toggle-text">🌱 Veg Only</span>
          </label>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      <CategoryFilters
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        counts={categoryCounts}
      />

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cooking up today's menu...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-catalog-state">
          <span className="empty-icon">🍽️</span>
          <h3>No matching dishes found</h3>
          <p>Try clearing your filters or searching for something else.</p>
          <button
            className="btn-outline-small"
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setVegOnly(false); }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="food-grid">
          {filteredItems.map(item => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
