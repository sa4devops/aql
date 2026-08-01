/**
 * Design System Components — Button
 * Status: VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
 *
 * Extracted from: ShowcasePage, RecordsPage, ActionRegistryPage
 * Uses CSS classes from tailwind.css (.btn, .btn-primary, etc.)
 */

'use client';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  iconOnly?: boolean;
}

const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, iconStart, iconEnd, iconOnly = false, children, disabled, className = '', ...props }, ref) => {
    const cls = `btn btn-${variant} btn-${size} ${className}`;
    return (
      <button ref={ref} className={cls} disabled={disabled || loading} {...props}>
        {loading ? <SpinnerIcon /> : iconStart}
        {!iconOnly && children}
        {!loading && iconEnd}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
