/**
 * Design System Components — Form Fields
 * Status: VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
 *
 * Extracted from: ShowcasePage, BuilderPage
 * Uses CSS classes from tailwind.css (.input-base)
 */

'use client';
import React from 'react';

// ─── Field Wrapper ────────────────────────────────────────────────────────────
export interface FieldProps {
  label?: string;
  helpText?: string;
  errorMessage?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  id?: string;
}

export const Field = ({ label, helpText, errorMessage, required, optional, children, id }: FieldProps) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
        {label}
        {required && <span style={{ color: 'var(--error)', marginInlineStart: 2 }} aria-hidden="true">*</span>}
        {optional && <span className="text-xs ms-1" style={{ color: 'var(--text-muted)' }}>(اختياري / Optional)</span>}
      </label>
    )}
    {children}
    {helpText && !errorMessage && (
      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{helpText}</p>
    )}
    {errorMessage && (
      <p className="text-xs mt-1" role="alert" style={{ color: 'var(--error-text)' }}>{errorMessage}</p>
    )}
  </div>
);

// ─── Text Input ───────────────────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: 'default' | 'error' | 'valid' | 'warning';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ state = 'default', className = '', ...props }, ref) => {
    const stateClass = state === 'error' ? 'error' : '';
    return (
      <input
        ref={ref}
        className={`input-base ${stateClass} ${className}`}
        aria-invalid={state === 'error' ? 'true' : undefined}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// ─── Textarea ─────────────────────────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  state?: 'default' | 'error';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ state = 'default', className = '', style, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`input-base ${state === 'error' ? 'error' : ''} ${className}`}
      style={{ height: 80, resize: 'vertical', ...style }}
      aria-invalid={state === 'error' ? 'true' : undefined}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

// ─── Select ───────────────────────────────────────────────────────────────────
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  state?: 'default' | 'error';
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ state = 'default', className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={`input-base ${state === 'error' ? 'error' : ''} ${className}`}
      aria-invalid={state === 'error' ? 'true' : undefined}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

// ─── Switch ───────────────────────────────────────────────────────────────────
export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export const Switch = ({ checked, onChange, label, disabled = false, id }: SwitchProps) => (
  <div className="flex items-center gap-3">
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className="rounded-full transition-colors flex-shrink-0"
      style={{
        width: 40, height: 22,
        background: checked ? 'var(--accent)' : 'var(--gray-300)',
        position: 'relative', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
      aria-label={label}
    >
      <span
        className="absolute rounded-full transition-all"
        style={{ width: 16, height: 16, background: '#fff', top: 3, insetInlineStart: checked ? 21 : 3 }}
        aria-hidden="true"
      />
    </button>
    {label && (
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
    )}
  </div>
);

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = ({ label, id, ...props }: CheckboxProps) => (
  <label htmlFor={id} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text-primary)' }}>
    <input
      type="checkbox"
      id={id}
      style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
      {...props}
    />
    {label}
  </label>
);

// ─── Search Input ─────────────────────────────────────────────────────────────
export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = '', style, ...props }, ref) => (
    <div className="relative" style={style}>
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="absolute"
        style={{ top: '50%', transform: 'translateY(-50%)', insetInlineStart: 10, color: 'var(--text-muted)', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        ref={ref}
        type="search"
        className={`input-base ${className}`}
        style={{ paddingInlineStart: 32 }}
        {...props}
      />
    </div>
  )
);
SearchInput.displayName = 'SearchInput';
