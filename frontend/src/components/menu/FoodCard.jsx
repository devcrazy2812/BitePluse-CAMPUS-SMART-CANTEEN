import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export function FoodCard({ item }) {
  const { addItem, changeQuantity, getItemQuantity } = useCart();
  const [clicked, setClicked] = useState(false);

  const quantity = getItemQuantity(item.id);
  const isAvailable = item.available !== false;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;

    setClicked(true);
    addItem(item);
    setTimeout(() => setClicked(false), 300);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;
    changeQuantity(item.id, 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    changeQuantity(item.id, -1);
  };

  return (
    <article className={`food-card ${!isAvailable ? 'sold-out' : ''}`}>
      <div className="food-card-media">
        <span className="food-emoji">{item.emoji || '🍽️'}</span>

        <div className="card-top-badges">
          <span className={`dietary-badge ${item.dietaryTag?.toLowerCase() || 'veg'}`}>
            {item.dietaryTag === 'NON_VEG' ? '🔴 Non-Veg' : item.dietaryTag === 'VEGAN' ? '🌱 Vegan' : '🟢 Pure Veg'}
          </span>

          {item.prepTimeMinutes && (
            <span className="prep-time-badge">
              ⏱️ {item.prepTimeMinutes}m
            </span>
          )}
        </div>

        {!isAvailable && (
          <div className="sold-out-overlay">
            <span>Sold Out</span>
          </div>
        )}
      </div>

      <div className="food-card-content">
        <div className="food-category-tag">{item.category}</div>
        <h3 className="food-title">{item.name}</h3>
        <p className="food-desc">{item.description}</p>

        <div className="food-footer">
          <div className="food-price-block">
            <span className="currency-symbol">₹</span>
            <span className="price-number">{item.price}</span>
          </div>

          <div className="food-actions">
            {!isAvailable ? (
              <button className="btn-unavailable" disabled>
                Unavailable
              </button>
            ) : quantity === 0 ? (
              <button
                type="button"
                className={`btn-add-item ${clicked ? 'btn-pop' : ''}`}
                onClick={handleAdd}
                aria-label={`Add ${item.name} to tray`}
              >
                <span className="add-icon">+</span>
                <span className="add-text">Add</span>
              </button>
            ) : (
              <div className="item-quantity-stepper">
                <button
                  type="button"
                  className="stepper-btn minus"
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="stepper-count">{quantity}</span>
                <button
                  type="button"
                  className="stepper-btn plus"
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
