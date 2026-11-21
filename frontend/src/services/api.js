import { initialMenu, initialOrders, initialAnalytics } from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Local storage fallback cache so user actions persist in demo/offline mode
function getLocal(key, defaultVal) {
  try {
    const raw = localStorage.getItem(`bp_${key}`);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(`bp_${key}`, JSON.stringify(val));
  } catch {}
}

async function request(path, options = {}) {
  const token = localStorage.getItem('bp_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMsg = 'Request failed';
    try {
      const errJson = await response.json();
      errMsg = errJson.message || errJson.error || JSON.stringify(errJson);
    } catch {
      errMsg = await response.text();
    }
    throw new Error(errMsg || `HTTP error ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // Auth
  async login(email, password) {
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('bp_token', data.token);
      return data.user;
    } catch (err) {
      console.warn('Backend unavailable, using demo authentication mode:', err.message);
      // Demo fallback based on email role
      const cleanEmail = email.toLowerCase();
      let role = 'STUDENT';
      let name = 'Student';
      if (cleanEmail.includes('admin')) {
        role = 'ADMIN';
        name = 'Canteen Admin';
      } else if (cleanEmail.includes('staff')) {
        role = 'STAFF';
        name = 'Kitchen Master';
      }
      const demoUser = { id: Date.now(), name, email: cleanEmail, role };
      localStorage.setItem('bp_token', 'demo-jwt-token-active');
      return demoUser;
    }
  },

  async register(name, email, password) {
    try {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      localStorage.setItem('bp_token', data.token);
      return data.user;
    } catch (err) {
      const demoUser = { id: Date.now(), name, email, role: 'STUDENT' };
      localStorage.setItem('bp_token', 'demo-jwt-token-active');
      return demoUser;
    }
  },

  // Menu Catalog
  async getMenu() {
    try {
      return await request('/menu');
    } catch (err) {
      return getLocal('menu', initialMenu);
    }
  },

  async createMenuItem(item) {
    try {
      return await request('/menu', {
        method: 'POST',
        body: JSON.stringify(item),
      });
    } catch (err) {
      const menu = getLocal('menu', initialMenu);
      const newItem = { ...item, id: Date.now() };
      const updated = [newItem, ...menu];
      setLocal('menu', updated);
      return newItem;
    }
  },

  async updateMenuItem(id, item) {
    try {
      return await request(`/menu/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item),
      });
    } catch (err) {
      const menu = getLocal('menu', initialMenu);
      const updated = menu.map(x => x.id === id ? { ...x, ...item } : x);
      setLocal('menu', updated);
      return { ...item, id };
    }
  },

  async toggleMenuItem(id) {
    try {
      return await request(`/menu/${id}/toggle`, { method: 'PATCH' });
    } catch (err) {
      const menu = getLocal('menu', initialMenu);
      const updated = menu.map(x => x.id === id ? { ...x, available: !x.available } : x);
      setLocal('menu', updated);
      return updated.find(x => x.id === id);
    }
  },

  async deleteMenuItem(id) {
    try {
      await request(`/menu/${id}`, { method: 'DELETE' });
    } catch (err) {
      const menu = getLocal('menu', initialMenu);
      const updated = menu.filter(x => x.id !== id);
      setLocal('menu', updated);
    }
  },

  // Orders
  async createOrder(pickupSlot, items) {
    try {
      return await request('/orders', {
        method: 'POST',
        body: JSON.stringify({ pickupSlot, items }),
      });
    } catch (err) {
      const orders = getLocal('orders', initialOrders);
      const orderNumber = `BP-${Math.floor(1000 + Math.random() * 9000)}`;
      const summary = items.map(i => `${i.name || 'Dish'} x${i.quantity}`).join(', ');
      const total = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
      const newOrder = {
        id: Date.now(),
        orderNumber,
        pickupSlot,
        status: 'NEW',
        total,
        itemSummary: summary,
        createdAt: new Date().toISOString()
      };
      setLocal('orders', [newOrder, ...orders]);
      return newOrder;
    }
  },

  async getMyOrders() {
    try {
      return await request('/orders/my');
    } catch (err) {
      return getLocal('orders', initialOrders);
    }
  },

  async getKitchenQueue() {
    try {
      return await request('/orders/kitchen');
    } catch (err) {
      const orders = getLocal('orders', initialOrders);
      return orders.filter(o => ['NEW', 'ON_STOVE', 'READY'].includes(o.status));
    }
  },

  async updateOrderStatus(id, status) {
    try {
      return await request(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      const orders = getLocal('orders', initialOrders);
      const updated = orders.map(o => o.id === id ? { ...o, status } : o);
      setLocal('orders', updated);
      return updated.find(o => o.id === id);
    }
  },

  // Analytics
  async getAnalytics() {
    try {
      return await request('/admin/analytics');
    } catch (err) {
      return initialAnalytics;
    }
  }
};
