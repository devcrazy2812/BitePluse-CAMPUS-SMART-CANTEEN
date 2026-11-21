import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { showToast } = useToast();
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('bp_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [bounceCounter, setBounceCounter] = useState(0);

  useEffect(() => {
    localStorage.setItem('bp_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems(prev => {
      const existing = prev.find(x => x.id === item.id);
      if (existing) {
        return prev.map(x => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x);
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    setBounceCounter(c => c + 1);
    showToast(`✨ Added "${item.name}" to your tray!`, 'success');
  };

  const changeQuantity = (id, delta) => {
    setItems(prev => {
      return prev
        .map(x => x.id === id ? { ...x, quantity: x.quantity + delta } : x)
        .filter(x => x.quantity > 0);
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(x => x.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('bp_cart');
  };

  const getItemQuantity = (id) => {
    const found = items.find(x => x.id === id);
    return found ? found.quantity : 0;
  };

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      changeQuantity,
      removeItem,
      clearCart,
      getItemQuantity,
      totalItems,
      totalPrice,
      bounceCounter
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
