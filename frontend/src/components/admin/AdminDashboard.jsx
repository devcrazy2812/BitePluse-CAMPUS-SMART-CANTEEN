import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';
import { AddItemModal } from './AddItemModal';
import { useToast } from '../../context/ToastContext';

const STATUS_COLORS = {
  READY: '#1e9a69',
  ON_STOVE: '#ff6b35',
  NEW: '#004e89',
  PICKED_UP: '#8e9aaf',
  CANCELLED: '#d90429'
};

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const [analyticsData, menuData] = await Promise.all([
        api.getAnalytics(),
        api.getMenu()
      ]);
      setAnalytics(analyticsData);
      setMenu(menuData);
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (payload, existingId) => {
    try {
      if (existingId) {
        await api.updateMenuItem(existingId, payload);
        showToast(`Updated "${payload.name}" successfully!`, 'success');
      } else {
        await api.createMenuItem(payload);
        showToast(`Added "${payload.name}" to menu catalog!`, 'success');
      }
      // Refresh list
      const updatedMenu = await api.getMenu();
      setMenu(updatedMenu);
    } catch (err) {
      showToast(err.message || 'Failed to save menu item', 'error');
    }
  };

  const handleToggleStock = async (id) => {
    try {
      await api.toggleMenuItem(id);
      setMenu(prev => prev.map(item => item.id === id ? { ...item, available: !item.available } : item));
      showToast('Toggled dish availability', 'info');
    } catch (err) {
      showToast('Could not change availability', 'error');
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      return;
    }
    try {
      await api.deleteMenuItem(id);
      setMenu(prev => prev.filter(item => item.id !== id));
      showToast(`Removed "${name}" from menu`, 'info');
    } catch (err) {
      showToast('Failed to delete item', 'error');
    }
  };

  const pieData = analytics?.statuses?.map(s => ({
    name: s.name,
    value: s.value,
    color: STATUS_COLORS[s.status] || '#ff6b35'
  })) || [
    { name: 'Ready', value: 42, color: '#1e9a69' },
    { name: 'Cooking', value: 28, color: '#ff6b35' },
    { name: 'New Orders', value: 30, color: '#004e89' }
  ];

  const barData = analytics?.peakHours || [
    { hour: '11 AM', orders: 19 },
    { hour: '12 PM', orders: 38 },
    { hour: '1 PM', orders: 45 },
    { hour: '2 PM', orders: 22 },
    { hour: '5 PM', orders: 31 }
  ];

  return (
    <section className="admin-section">
      <div className="section-header-row">
        <div>
          <span className="eyebrow">ADMIN MANAGEMENT CONSOLE</span>
          <h2 className="section-heading">Cafeteria Analytics & Menu Control</h2>
        </div>
        <button className="btn-add-dish-primary" onClick={handleOpenAdd}>
          <span className="add-plus-icon">+</span>
          <span>Add New Dish</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-bubble">📦</div>
          <div className="kpi-details">
            <small>ORDERS TODAY</small>
            <strong className="kpi-value">{analytics?.ordersToday || 84}</strong>
            <span className="kpi-trend positive">↑ 18% vs last week</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-bubble">💰</div>
          <div className="kpi-details">
            <small>TODAY'S REVENUE</small>
            <strong className="kpi-value">₹{analytics?.totalRevenue || 8420}</strong>
            <span className="kpi-trend positive">↑ 12% vs last week</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-bubble">⏱️</div>
          <div className="kpi-details">
            <small>AVG. PREPARATION TIME</small>
            <strong className="kpi-value">{analytics?.avgPrepTimeMinutes || 12}m</strong>
            <span className="kpi-trend positive">↓ 3m faster today</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-bubble">🍽️</div>
          <div className="kpi-details">
            <small>TOTAL MENU ITEMS</small>
            <strong className="kpi-value">{menu.length}</strong>
            <span className="kpi-trend neutral">Active in catalog</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="admin-charts-grid">
        <div className="chart-container-card">
          <h3 className="chart-heading">Peak Order Rush Hours</h3>
          <p className="chart-subtitle">Hourly order distribution across the campus day</p>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <XAxis dataKey="hour" stroke="#8795a1" />
                <YAxis stroke="#8795a1" />
                <Tooltip />
                <Bar dataKey="orders" fill="#ff5e36" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container-card">
          <h3 className="chart-heading">Order Stage Breakdown</h3>
          <p className="chart-subtitle">Real-time status proportions in kitchen</p>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Menu Manager CRUD Section */}
      <div className="admin-menu-manager-card">
        <div className="table-header-row">
          <div>
            <h3 className="table-title">Menu Catalog Manager</h3>
            <p className="table-subtitle">Manage items, pricing, availability, and descriptions</p>
          </div>
          <button className="btn-add-dish-secondary" onClick={handleOpenAdd}>
            + Add New Dish
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading catalog items...</p>
          </div>
        ) : menu.length === 0 ? (
          <div className="empty-catalog-state">
            <p>No dishes found. Click "+ Add New Dish" above to create your first item.</p>
          </div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Dietary</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menu.map(item => (
                  <tr key={item.id} className={!item.available ? 'row-unavailable' : ''}>
                    <td className="cell-dish-name">
                      <span className="table-emoji">{item.emoji || '🍽️'}</span>
                      <div>
                        <strong>{item.name}</strong>
                        <small className="table-desc">{item.description}</small>
                      </div>
                    </td>
                    <td>
                      <span className="category-pill-sm">{item.category}</span>
                    </td>
                    <td>
                      <span className={`dietary-tag-sm ${item.dietaryTag?.toLowerCase() || 'veg'}`}>
                        {item.dietaryTag || 'VEG'}
                      </span>
                    </td>
                    <td className="cell-price">
                      <strong>₹{item.price}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`stock-toggle-btn ${item.available ? 'in-stock' : 'out-stock'}`}
                        onClick={() => handleToggleStock(item.id)}
                        title="Click to toggle stock availability"
                      >
                        {item.available ? '● In Stock' : '○ Sold Out'}
                      </button>
                    </td>
                    <td className="cell-actions">
                      <button
                        className="btn-action edit"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit dish"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        title="Delete dish"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Item Modal */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
      />
    </section>
  );
}
