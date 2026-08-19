'use client';

import React, { useState } from 'react';

/**
 * EditorialButton: Versatile button component supporting various editorial styles.
 * variants: 'primary' | 'secondary' | 'accent' | 'brutalist' | 'outline' | 'ghost' | 'danger' | 'gradient'
 * sizes: 'xs' | 'sm' | 'md' | 'lg'
 */
export default function EditorialButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  tooltipText,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  active = false,
  ...props
}) {
  const [hovered, setHovered] = useState(false);

  // Variant Styles with high-contrast, crisp dark & light theme definitions
  const variantStyles = {
    primary: 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 border border-neutral-900 dark:border-neutral-200 shadow-sm font-bold',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-md shadow-blue-500/20 active:scale-[0.99] font-bold',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-600 shadow-sm font-semibold',
    accent: 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-600 dark:border-purple-500 shadow-sm font-semibold',
    brutalist: 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
    outline: 'bg-white/80 hover:bg-neutral-100 dark:bg-neutral-900/80 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 shadow-sm',
    ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-transparent',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/60 dark:hover:bg-red-900/80 dark:text-red-200 border border-red-200 dark:border-red-800 font-semibold',
    success: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-semibold',
  };

  // Size Styles
  const sizeStyles = {
    xs: 'text-[11px] px-2.5 py-1.5 rounded-lg font-mono gap-1.5',
    sm: 'text-xs px-3 py-1.5 rounded-lg font-mono gap-2',
    md: 'text-xs px-4 py-2.5 rounded-xl font-mono uppercase tracking-wider gap-2',
    lg: 'text-sm px-5 py-3 rounded-xl font-mono uppercase tracking-wider gap-2.5',
  };

  return (
    <div className={`relative inline-block ${fullWidth ? 'w-full' : ''}`}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          inline-flex items-center justify-center transition-all duration-150 select-none
          ${variantStyles[variant] || variantStyles.primary}
          ${sizeStyles[size] || sizeStyles.md}
          ${fullWidth ? 'w-full' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
          ${active ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
          ${className}
        `}
        {...props}
      >
        {icon && <span className="flex-shrink-0 flex items-center">{icon}</span>}
        {children && <span className="flex items-center">{children}</span>}
        {iconRight && <span className="flex-shrink-0 flex items-center">{iconRight}</span>}
      </button>

      {/* Floating Tooltip */}
      {hovered && tooltipText && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-[11px] font-mono font-semibold rounded-md shadow-xl pointer-events-none whitespace-nowrap z-50 animate-fadeIn">
          {tooltipText}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100" />
        </div>
      )}
    </div>
  );
}
