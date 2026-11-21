import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export function OrderTracker() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await api.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.warn('Failed to refresh orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const getStepClass = (orderStatus, step) => {
    const sequence = ['NEW', 'ON_STOVE', 'READY', 'PICKED_UP'];
    const currentIndex = sequence.indexOf(orderStatus);
    const stepIndex = sequence.indexOf(step);

    if (orderStatus === 'CANCELLED') return 'cancelled';
    if (currentIndex > stepIndex) return 'step-done';
    if (currentIndex === stepIndex) return 'step-active';
    return 'step-pending';
  };

  return (
    <section className="orders-section">
      <div className="section-header-row">
        <div>
          <span className="eyebrow">YOUR ORDERS</span>
          <h2 className="section-heading">Live Order Status</h2>
        </div>
        <div className="live-pill-group">
          <span className="live-pulse"></span>
          <span className="live-label">AUTO-SYNCING</span>
          <button className="btn-refresh" onClick={loadOrders} title="Refresh orders">
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-catalog-state">
          <span className="empty-icon">📦</span>
          <h3>No orders yet</h3>
          <p>Your previous and active pre-orders will appear here with live cooking progress.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const isReady = order.status === 'READY';
            const isOnStove = order.status === 'ON_STOVE';

            return (
              <article
                key={order.id}
                className={`order-card ${isReady ? 'order-card-ready' : ''}`}
              >
                <div className="order-card-header">
                  <div className="order-number-group">
                    <span className="order-id-badge">{order.orderNumber || `BP-${order.id}`}</span>
                    <span className="order-pickup-time">
                      🕒 Scheduled: <strong>{order.pickupSlot}</strong>
                    </span>
                  </div>
                  <strong className="order-total-price">₹{order.total}</strong>
                </div>

                <div className="order-items-summary">
                  <span className="summary-icon">🍽️</span>
                  <span>{order.itemSummary}</span>
                </div>

                {/* Progress Stepper */}
                <div className="order-stepper">
                  <div className={`step-item ${getStepClass(order.status, 'NEW')}`}>
                    <div className="step-circle">1</div>
                    <span className="step-text">Placed</span>
                  </div>

                  <div className={`step-bar ${order.status !== 'NEW' ? 'bar-filled' : ''}`}></div>

                  <div className={`step-item ${getStepClass(order.status, 'ON_STOVE')}`}>
                    <div className="step-circle">2</div>
                    <span className="step-text">Cooking</span>
                  </div>

                  <div className={`step-bar ${order.status === 'READY' || order.status === 'PICKED_UP' ? 'bar-filled' : ''}`}></div>

                  <div className={`step-item ${getStepClass(order.status, 'READY')}`}>
                    <div className="step-circle">3</div>
                    <span className="step-text">Ready for Pickup</span>
                  </div>
                </div>

                {isReady && (
                  <div className="ready-alert-box animate-pulse">
                    <span>🔔 Your order is hot and ready at the pickup counter! Show #{order.orderNumber || order.id} to collect.</span>
                  </div>
                )}
                {isOnStove && (
                  <div className="cooking-info-box">
                    <span>🍳 Chef is currently preparing your meal fresh on the stove.</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
