import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

const EMOJI_OPTIONS = ['🍛', '🌯', '🍕', '🍔', '🍟', '🥪', '🍜', '🧋', '☕', '🍰', '🍫', '🍋', '🥗', '🍦'];

export function AddItemModal({ isOpen, onClose, onSave, initialItem = null }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('MEALS');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🍛');
  const [dietaryTag, setDietaryTag] = useState('VEG');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name || '');
      setCategory(initialItem.category || 'MEALS');
      setPrice(initialItem.price || '');
      setDescription(initialItem.description || '');
      setEmoji(initialItem.emoji || '🍛');
      setDietaryTag(initialItem.dietaryTag || 'VEG');
      setPrepTimeMinutes(initialItem.prepTimeMinutes || 10);
    } else {
      setName('');
      setCategory('MEALS');
      setPrice('');
      setDescription('');
      setEmoji('🍛');
      setDietaryTag('VEG');
      setPrepTimeMinutes(10);
    }
    setError('');
  }, [initialItem, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a dish name');
      return;
    }
    const numPrice = parseInt(price, 10);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Please enter a valid price in ₹');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: name.trim(),
        category,
        price: numPrice,
        description: description.trim(),
        emoji,
        dietaryTag,
        prepTimeMinutes: parseInt(prepTimeMinutes, 10) || 10,
        available: initialItem ? initialItem.available : true
      };

      await onSave(payload, initialItem?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? 'Edit Menu Item' : 'Add New Dish to Catalog'}
      subtitle="CANTEEN MENU MANAGER"
      maxWidth="580px"
    >
      <form onSubmit={handleSubmit} className="add-item-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-row two-cols">
          <div className="form-group">
            <label>Dish / Item Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Smoky Paneer Wrap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Price in INR (₹) *</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 85"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row three-cols">
          <div className="form-group">
            <label>Category *</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="MEALS">MEALS</option>
              <option value="SNACKS">SNACKS</option>
              <option value="BEVERAGES">BEVERAGES</option>
              <option value="DESSERTS">DESSERTS</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dietary Tag</label>
            <select
              className="form-control"
              value={dietaryTag}
              onChange={(e) => setDietaryTag(e.target.value)}
            >
              <option value="VEG">🟢 Veg</option>
              <option value="NON_VEG">🔴 Non-Veg</option>
              <option value="VEGAN">🌱 Vegan</option>
            </select>
          </div>

          <div className="form-group">
            <label>Prep Time (min)</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max="60"
              value={prepTimeMinutes}
              onChange={(e) => setPrepTimeMinutes(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Food Icon / Emoji</label>
          <div className="emoji-picker-row">
            {EMOJI_OPTIONS.map(em => (
              <button
                type="button"
                key={em}
                className={`emoji-choice-btn ${emoji === em ? 'selected' : ''}`}
                onClick={() => setEmoji(em)}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Description & Ingredients</label>
          <textarea
            className="form-control textarea"
            rows="3"
            placeholder="Describe the flavors, ingredients, sauces, or spice level..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Live Preview Box */}
        <div className="item-live-preview">
          <small className="preview-label">LIVE CARD PREVIEW</small>
          <div className="preview-card-inline">
            <span className="preview-emoji">{emoji}</span>
            <div className="preview-details">
              <strong>{name || 'Sample Dish Name'}</strong>
              <small>{category} · ₹{price || '0'} · {dietaryTag}</small>
            </div>
          </div>
        </div>

        <div className="form-actions-row">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-submit-primary" disabled={submitting}>
            {submitting ? 'Saving Item...' : initialItem ? 'Save Changes' : '+ Add Item to Menu'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
