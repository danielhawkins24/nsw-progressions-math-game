import React from 'react';

const variantClasses = {
  default: 'bg-slate-800 text-white hover:bg-slate-700',
  outline: 'border border-white/20 bg-white/5 text-white hover:bg-white/10',
  ghost: 'bg-transparent text-white hover:bg-white/10',
};

const sizeClasses = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  icon: 'h-10 w-10 p-0',
};

export const Button = React.forwardRef(function Button(
  { className = '', variant = 'default', size = 'default', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant] || ''} ${sizeClasses[size] || ''} ${className}`}
      {...props}
    />
  );
});
