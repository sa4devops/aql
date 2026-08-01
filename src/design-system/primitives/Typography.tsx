/**
 * Design System Primitives — Typography
 * Status: VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
 *
 * Extracted from: RecordsPage, ActionRegistryPage, ShowcasePage
 * All fonts are local (Cairo, Inter, JetBrains Mono) — no external requests.
 */

'use client';
import React from 'react';

// ─── Type Scale ───────────────────────────────────────────────────────────────
export interface TextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
  id?: string;
}

export const DisplayLg = ({ children, className = '', style, as: Tag = 'h1' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-3xl font-bold ${className}`} style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-arabic)', ...style }}>
    {children}
  </Tag>
);

export const DisplayMd = ({ children, className = '', style, as: Tag = 'h2' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-2xl font-bold ${className}`} style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-arabic)', ...style }}>
    {children}
  </Tag>
);

export const HeadingLg = ({ children, className = '', style, as: Tag = 'h2' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-xl font-semibold ${className}`} style={{ color: 'var(--text-primary)', ...style }}>
    {children}
  </Tag>
);

export const HeadingMd = ({ children, className = '', style, as: Tag = 'h3' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-lg font-semibold ${className}`} style={{ color: 'var(--text-primary)', ...style }}>
    {children}
  </Tag>
);

export const HeadingSm = ({ children, className = '', style, as: Tag = 'h4' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-base font-semibold ${className}`} style={{ color: 'var(--text-primary)', ...style }}>
    {children}
  </Tag>
);

export const BodyLg = ({ children, className = '', style, as: Tag = 'p' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-base ${className}`} style={{ color: 'var(--text-primary)', ...style }}>
    {children}
  </Tag>
);

export const BodyMd = ({ children, className = '', style, as: Tag = 'p' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-sm ${className}`} style={{ color: 'var(--text-primary)', ...style }}>
    {children}
  </Tag>
);

export const BodySm = ({ children, className = '', style, as: Tag = 'p' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-xs ${className}`} style={{ color: 'var(--text-secondary)', ...style }}>
    {children}
  </Tag>
);

export const Caption = ({ children, className = '', style, as: Tag = 'span' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-xs ${className}`} style={{ color: 'var(--text-muted)', ...style }}>
    {children}
  </Tag>
);

export const Label = ({ children, className = '', style, as: Tag = 'span' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-xs font-semibold uppercase tracking-wider ${className}`} style={{ color: 'var(--text-muted)', letterSpacing: '0.08em', ...style }}>
    {children}
  </Tag>
);

export const Mono = ({ children, className = '', style, as: Tag = 'code' as React.ElementType, id }: TextProps) => (
  <Tag id={id} className={`text-xs font-mono tabular-nums ${className}`} style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', ...style }}>
    {children}
  </Tag>
);
