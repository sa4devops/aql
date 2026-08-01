/**
 * Design System Components — Overlays (Dialog, Drawer, Toast, Tooltip)
 * Status: VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
 *
 * Extracted from: ShowcasePage, RecordsPage
 * All animations use local CSS transitions — no external libraries.
 */

'use client';
import React, { useEffect, useRef } from 'react';

// ─── Dialog ───────────────────────────────────────────────────────────────────
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  destructive?: boolean;
}

export const Dialog = ({ open, onClose, title, description, children, footer, size = 'md', destructive = false }: DialogProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  if (!open) return null;

  const maxWidths = { sm: 400, md: 520, lg: 680 };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="card w-full flex flex-col"
        style={{ maxWidth: maxWidths[size], maxHeight: '90vh', outline: 'none' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 id="dialog-title" className="font-semibold text-base" style={{ color: destructive ? 'var(--error-text)' : 'var(--text-primary)' }}>
              {title}
            </h2>
            {description && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{description}</p>}
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm flex-shrink-0" aria-label="إغلاق / Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        {/* Body */}
        {children && (
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">{children}</div>
        )}
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 p-4" style={{ borderTop: '1px solid var(--border)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Drawer ───────────────────────────────────────────────────────────────────
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'start' | 'end';
  width?: number;
}

export const Drawer = ({ open, onClose, title, children, footer, side = 'end', width = 480 }: DrawerProps) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: 'rgba(0,0,0,0.3)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`${side === 'end' ? 'ms-auto' : 'me-auto'} flex flex-col`}
        style={{ width: '100%', maxWidth: width, height: '100%', background: 'var(--surface)', borderInlineStart: side === 'end' ? '1px solid var(--border)' : 'none', borderInlineEnd: side === 'start' ? '1px solid var(--border)' : 'none', overflow: 'hidden' }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <h2 id="drawer-title" className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="إغلاق / Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">{children}</div>
        {footer && (
          <div className="flex gap-2 p-4" style={{ borderTop: '1px solid var(--border)', flexShrink: 0 }}>{footer}</div>
        )}
      </div>
    </div>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────
export interface ToastProps {
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export const Toast = ({ message, variant = 'info', onClose }: ToastProps) => {
  const styles: Record<string, React.CSSProperties> = {
    success: { background: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid var(--success-border)' },
    error: { background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' },
    warning: { background: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)' },
    info: { background: 'var(--info-bg)', color: 'var(--info-text)', border: '1px solid var(--info-border)' },
  };
  const icons: Record<string, React.ReactNode> = {
    success: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    error: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    warning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    info: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  };
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm shadow-elevation-2"
      style={{ ...styles[variant], minWidth: 280, maxWidth: 400 }}
      role="alert"
      aria-live="polite"
    >
      {icons[variant]}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7 }} aria-label="إغلاق / Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  );
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────
export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => (
  <div className="relative inline-flex group">
    {children}
    <div
      className="absolute z-50 px-2 py-1 text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
      style={{
        background: 'var(--gray-900)',
        color: 'var(--gray-50)',
        [position === 'top' ? 'bottom' : 'top']: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: position === 'top' ? 4 : 0,
        marginTop: position === 'bottom' ? 4 : 0,
      }}
      role="tooltip"
    >
      {content}
    </div>
  </div>
);

// ─── Confirmation Surface ─────────────────────────────────────────────────────
export interface ConfirmationProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export const Confirmation = ({ open, onConfirm, onCancel, title, description, confirmLabel = 'تأكيد / Confirm', cancelLabel = 'إلغاء / Cancel', destructive = false }: ConfirmationProps) => (
  <Dialog
    open={open}
    onClose={onCancel}
    title={title}
    description={description}
    size="sm"
    destructive={destructive}
    footer={
      <>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>{cancelLabel}</button>
        <button className={`btn ${destructive ? 'btn-destructive' : 'btn-primary'} btn-sm`} onClick={onConfirm}>{confirmLabel}</button>
      </>
    }
  />
);
