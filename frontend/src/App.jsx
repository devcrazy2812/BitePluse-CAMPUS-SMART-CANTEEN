import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { HeroBanner } from './components/menu/HeroBanner';
import { MenuGrid } from './components/menu/MenuGrid';
import { OrderTracker } from './components/orders/OrderTracker';
import { KitchenBoard } from './components/kitchen/KitchenBoard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthPage } from './components/auth/AuthPage';
import { ToastContainer } from './components/common/ToastContainer';

export function App() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('menu');
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (!user) {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="app-layout">
      <Navbar
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="main-content">
        {activeView === 'menu' && (
          <>
            <HeroBanner />
            <MenuGrid />
          </>
        )}

        {activeView === 'orders' && <OrderTracker />}

        {activeView === 'kitchen' && <KitchenBoard />}

        {activeView === 'admin' && <AdminDashboard />}
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <strong>BitePulse⚡</strong> Campus Dining & Kitchen Orchestration
          </div>
          <div className="footer-meta">
            <span>Stateless Spring Boot 3 & React 18</span>
            <span>•</span>
            <span>Zero Queue Experience</span>
          </div>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onViewOrders={() => setActiveView('orders')}
      />

      <ToastContainer />
    </div>
  );
}
