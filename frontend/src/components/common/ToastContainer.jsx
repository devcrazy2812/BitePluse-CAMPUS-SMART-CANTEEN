import React from 'react';
import { useToast } from '../../context/ToastContext';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} animate-slide-in-right`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="toast-icon">
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
