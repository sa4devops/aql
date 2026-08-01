/**
 * Design System Components — Data Display
 * Status: VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
 *
 * Extracted from: RecordsPage, ActionRegistryPage, ShowcasePage
 */

'use client';
import React from 'react';

// ─── Card ─────────────────────────────────────────────────────────────────────
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: boolean;
}

export const Card = ({ children, className = '', style, padding = true }: CardProps) => (
  <div className={`card ${padding ? 'p-5' : ''} ${className}`} style={style}>
    {children}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
export interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
}

export const StatCard = ({ label, value, description, trend, trendValue, icon }: StatCardProps) => (
  <div className="card p-4">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{value}</p>
        {description && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{description}</p>}
        {trendValue && (
          <p className="text-xs mt-1 font-medium" style={{
            color: trend === 'up' ? 'var(--success-text)' : trend === 'down' ? 'var(--error-text)' : 'var(--text-muted)'
          }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </p>
        )}
      </div>
      {icon && (
        <div className="flex-shrink-0 rounded-lg p-2" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
          {icon}
        </div>
      )}
    </div>
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  dot?: boolean;
  className?: string;
}

export const Badge = ({ children, variant = 'default', dot = false, className = '' }: BadgeProps) => {
  const styles: Record<string, React.CSSProperties> = {
    default: { background: 'var(--gray-100)', color: 'var(--gray-600)' },
    success: { background: 'var(--success-bg)', color: 'var(--success-text)' },
    warning: { background: 'var(--warning-bg)', color: 'var(--warning-text)' },
    error: { background: 'var(--error-bg)', color: 'var(--error-text)' },
    info: { background: 'var(--info-bg)', color: 'var(--info-text)' },
    accent: { background: 'var(--accent-subtle)', color: 'var(--accent)' },
  };
  const dotColors: Record<string, string> = {
    default: 'var(--gray-400)', success: 'var(--success)', warning: 'var(--warning)',
    error: 'var(--error)', info: 'var(--info)', accent: 'var(--accent)',
  };
  return (
    <span className={`badge ${className}`} style={styles[variant]}>
      {dot && (
        <span className="rounded-full flex-shrink-0" style={{ width: 6, height: 6, background: dotColors[variant] }} aria-hidden="true" />
      )}
      {children}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
export interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Avatar = ({ initials, size = 'md', label }: AvatarProps) => {
  const sizes = { sm: 24, md: 32, lg: 40 };
  const fontSizes = { sm: 10, md: 12, lg: 14 };
  const s = sizes[size];
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{ width: s, height: s, background: 'var(--accent-subtle)', color: 'var(--accent)', fontSize: fontSizes[size] }}
      aria-label={label || initials}
      role="img"
    >
      {initials}
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export interface SkeletonProps {
  width?: string | number;
  height?: number;
  className?: string;
}

export const Skeleton = ({ width = '100%', height = 16, className = '' }: SkeletonProps) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height }}
    aria-hidden="true"
    role="presentation"
  />
);

// ─── Key-Value Row ────────────────────────────────────────────────────────────
export interface KVRowProps {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}

export const KVRow = ({ label, value, mono = false }: KVRowProps) => (
  <div className="flex gap-3 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
    <span className="text-xs w-32 flex-shrink-0 pt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</span>
    <span className={`text-sm font-medium ${mono ? 'font-mono' : ''}`} style={{ color: 'var(--text-primary)' }}>{value}</span>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    {icon && <div style={{ color: 'var(--text-muted)' }}>{icon}</div>}
    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</div>
    {description && <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────
export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState = ({ message, onRetry, retryLabel = 'إعادة المحاولة / Retry' }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
      style={{ background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {message}
    </div>
    {onRetry && (
      <button className="btn btn-secondary btn-sm" onClick={onRetry}>{retryLabel}</button>
    )}
  </div>
);

// ─── Masked Value ─────────────────────────────────────────────────────────────
export const MaskedValue = ({ value, visible = false }: { value: string; visible?: boolean }) => (
  <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)', letterSpacing: visible ? 'normal' : '0.15em' }}>
    {visible ? value : '••••••••'}
  </span>
);

// ─── Chip ─────────────────────────────────────────────────────────────────────
export interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'accent';
}

export const Chip = ({ label, onRemove, variant = 'default' }: ChipProps) => (
  <span
    className="badge"
    style={{
      background: variant === 'accent' ? 'var(--accent-subtle)' : 'var(--gray-100)',
      color: variant === 'accent' ? 'var(--accent)' : 'var(--text-secondary)',
    }}
  >
    {label}
    {onRemove && (
      <button
        onClick={onRemove}
        className="ms-1 rounded-full flex items-center justify-center"
        style={{ width: 14, height: 14, background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
        aria-label={`إزالة ${label} / Remove ${label}`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    )}
  </span>
);
