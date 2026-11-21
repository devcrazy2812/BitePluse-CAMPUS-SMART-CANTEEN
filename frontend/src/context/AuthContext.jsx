import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('bp_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const userData = await api.login(email, password);
    setUser(userData);
    localStorage.setItem('bp_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password) => {
    const userData = await api.register(name, email, password);
    setUser(userData);
    localStorage.setItem('bp_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bp_user');
    localStorage.removeItem('bp_token');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isStaff = user?.role === 'STAFF' || isAdmin;
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isStaff, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
