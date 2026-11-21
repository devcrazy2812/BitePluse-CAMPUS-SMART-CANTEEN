import React from 'react';

export function Badge({ children, variant = 'default', size = 'normal' }) {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {children}
    </span>
  );
}
