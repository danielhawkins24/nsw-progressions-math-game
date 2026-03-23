import React from 'react';

export function Progress({ value = 0, className = '' }) {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div className="h-full bg-white transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
