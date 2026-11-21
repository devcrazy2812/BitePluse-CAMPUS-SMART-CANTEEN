import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function KitchenBoard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchKitchenQueue = async () => {
    try {
      const data = await api.getKitchenQueue();
      setOrders(data);
    } catch (err) {
      console.warn('Failed to load kitchen queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenQueue();
    const interval = setInterval(fetchKitchenQueue, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvanceStatus = async (order, nextStatus) => {
    // Optimistic UI update
    setOrders(prev => {
      if (nextStatus === 'PICKED_UP') {
        return prev.filter(o => o.id !== order.id);
      }
      return prev.map(o => o.id === order.id ? { ...o, status: nextStatus } : o);
    });

    try {
      await api.updateOrderStatus(order.id, nextStatus);
      showToast(`Updated ${order.orderNumber || order.id} to ${nextStatus}`, 'info');
    } catch (err) {
      showToast('Could not update order status on server', 'error');
      fetchKitchenQueue();
    }
  };

  const columns = [
    {
      id: 'NEW',
      title: 'New Orders',
      icon: '📥',
      badgeColor: 'blue',
      nextAction: 'Start Cooking 🍳',
      nextStatus: 'ON_STOVE'
    },
    {
      id: 'ON_STOVE',
      title: 'On the Stove',
      icon: '🔥',
      badgeColor: 'orange',
      nextAction: 'Mark Ready 🔔',
      nextStatus: 'READY'
    },
    {
      id: 'READY',
      title: 'Ready for Pickup',
      icon: '✅',
      badgeColor: 'green',
      nextAction: 'Complete & Hand Over ✓',
      nextStatus: 'PICKED_UP'
    }
  ];

  return (
    <section className="kitchen-section">
      <div className="section-header-row">
        <div>
          <span className="eyebrow">KITCHEN DISPLAY SYSTEM (KDS)</span>
          <h2 className="section-heading">Live Kitchen Production Line</h2>
        </div>
        <div className="live-pill-group">
          <span className="live-pulse"></span>
          <span className="live-label">LIVE QUEUE</span>
          <button className="btn-refresh" onClick={fetchKitchenQueue}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Connecting to kitchen queue...</p>
        </div>
      ) : (
        <div className="kanban-board">
          {columns.map(col => {
            const colOrders = orders.filter(o => o.status === col.id);
            return (
              <div className="kanban-column" key={col.id}>
                <div className="kanban-column-header">
                  <div className="col-title-group">
                    <span className="col-icon">{col.icon}</span>
                    <h3 className="col-title">{col.title}</h3>
                  </div>
                  <span className={`col-count-pill pill-${col.badgeColor}`}>
                    {colOrders.length}
                  </span>
                </div>

                <div className="kanban-cards-container">
                  {colOrders.length === 0 ? (
                    <div className="kanban-empty-column">
                      <p>No orders in this stage</p>
                    </div>
                  ) : (
                    colOrders.map(order => (
                      <article className="kanban-ticket animate-fade-in" key={order.id}>
                        <div className="ticket-top">
                          <strong className="ticket-number">
                            {order.orderNumber || `BP-${order.id}`}
                          </strong>
                          <span className="ticket-slot-time">
                            🕒 {order.pickupSlot}
                          </span>
                        </div>

                        <div className="ticket-items">
                          <p>{order.itemSummary}</p>
                        </div>

                        <div className="ticket-meta">
                          <small className="ticket-customer">
                            👤 {order.customerEmail || 'Campus Student'}
                          </small>
                          <strong className="ticket-amount">₹{order.total}</strong>
                        </div>

                        <button
                          type="button"
                          className={`btn-advance-ticket btn-${col.badgeColor}`}
                          onClick={() => handleAdvanceStatus(order, col.nextStatus)}
                        >
                          {col.nextAction}
                        </button>
                      </article>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
