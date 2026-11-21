import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { App } from './App';
import './styles/index.css';
import './styles/animations.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
