import React from 'react';

export const Input = React.forwardRef(function Input({ className = '', type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={`flex w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});
