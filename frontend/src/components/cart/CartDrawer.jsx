import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const PICKUP_SLOTS = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
];

export function CartDrawer({ isOpen, onClose, onViewOrders }) {
  const { items, changeQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const { showToast } = useToast();

  const [selectedSlot, setSelectedSlot] = useState('1:00 PM');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (!items.length || submitting) return;

    setSubmitting(true);
    try {
      const orderPayload = items.map(item => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const created = await api.createOrder(selectedSlot, orderPayload);
      setConfirmedOrder(created);
      clearCart();
      showToast('🎉 Pre-order successfully placed!', 'success');
    } catch (err) {
      showToast(err.message || 'Could not place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackOrder = () => {
    setConfirmedOrder(null);
    onClose();
    if (onViewOrders) {
      onViewOrders();
    }
  };

  const handleStartNewOrder = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="drawer-overlay animate-fade-in" onClick={onClose}>
      <aside
        className="cart-drawer animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Your Food Tray"
      >
        <div className="cart-drawer-header">
          <div>
            <span className="eyebrow">YOUR TRAY</span>
            <h2 className="cart-title">
              {confirmedOrder ? 'Order Confirmed!' : `Items (${totalItems})`}
            </h2>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            &times;
          </button>
        </div>

        {confirmedOrder ? (
          <div className="order-success-view animate-scale-up">
            <div className="success-icon-bubble">✓</div>
            <h3>Order {confirmedOrder.orderNumber || 'BP-1044'} is Placed!</h3>
            <p className="success-subtitle">
              The kitchen has received your order and will start cooking.
            </p>

            <div className="pickup-reminder-card">
              <span className="reminder-slot-icon">⏰</span>
              <div>
                <strong>Scheduled Pickup Slot</strong>
                <p>{confirmedOrder.pickupSlot || selectedSlot}</p>
              </div>
            </div>

            <div className="success-action-buttons">
              <button className="btn-primary full-width" onClick={handleTrackOrder}>
                Track in My Orders →
              </button>
              <button className="btn-secondary full-width" onClick={handleStartNewOrder}>
                Start New Order
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {items.length === 0 ? (
                <div className="cart-empty-state">
                  <span className="empty-tray-emoji">🛒</span>
                  <h4>Your tray is empty</h4>
                  <p>Browse today's menu to add hot meals and refreshing drinks.</p>
                </div>
              ) : (
                items.map(item => (
                  <div className="cart-item-row" key={item.id}>
                    <div className="cart-item-info">
                      <span className="cart-item-emoji">{item.emoji || '🍽️'}</span>
                      <div>
                        <h4 className="cart-item-name">{item.name}</h4>
                        <span className="cart-item-unit-price">₹{item.price} each</span>
                      </div>
                    </div>

                    <div className="cart-item-controls">
                      <div className="drawer-stepper">
                        <button
                          className="stepper-btn"
                          onClick={() => changeQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="stepper-value">{item.quantity}</span>
                        <button
                          className="stepper-btn"
                          onClick={() => changeQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <strong className="cart-item-subtotal">
                        ₹{item.price * item.quantity}
                      </strong>

                      <button
                        className="btn-remove-item"
                        onClick={() => removeItem(item.id)}
                        title="Remove from tray"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="slot-picker-group">
                  <label htmlFor="pickup-slot-select">
                    <span>SELECT PICKUP TIME</span>
                    <small>Collect at counter with no wait</small>
                  </label>
                  <select
                    id="pickup-slot-select"
                    className="slot-dropdown"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                  >
                    {PICKUP_SLOTS.map(slot => (
                      <option key={slot} value={slot}>
                        {slot} (Est. Ready)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bill-summary">
                  <div className="bill-row">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="bill-row green-text">
                    <span>Campus Discount</span>
                    <span>Free Pickup</span>
                  </div>
                  <div className="bill-divider"></div>
                  <div className="bill-row total-row">
                    <strong>Total Payable</strong>
                    <strong>₹{totalPrice}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-checkout"
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                >
                  {submitting ? 'Placing Pre-Order...' : `Place Pre-Order (₹${totalPrice}) →`}
                </button>
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
