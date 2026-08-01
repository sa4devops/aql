/**
 * Design System — Patterns
 * Status: VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
 *
 * Extracted interaction and layout patterns from the 3 reference screens.
 */

'use client';
import React, { useState } from 'react';

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav aria-label="مسار التنقل / Breadcrumb" className="flex items-center gap-1 text-sm flex-1 min-w-0">
    {items.map((item, i) => (
      <React.Fragment key={`bc-${i}`}>
        {i > 0 && <span style={{ color: 'var(--text-muted)' }} aria-hidden="true">/</span>}
        {item.href ? (
          <a href={item.href} className="truncate hover:underline" style={{ color: i === items.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {item.label}
          </a>
        ) : (
          <span className="truncate font-medium" style={{ color: 'var(--text-primary)' }} aria-current="page">
            {item.label}
          </span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => (
  <div className="flex gap-0" style={{ borderBottom: '1px solid var(--border)' }} role="tablist">
    {tabs.map(tab => (
      <button
        key={`tab-${tab.id}`}
        role="tab"
        aria-selected={activeTab === tab.id}
        onClick={() => onTabChange(tab.id)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
        style={{
          color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          borderBottomWidth: 2,
          borderBottomStyle: 'solid',
          borderBottomColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
          cursor: 'pointer',
          marginBottom: -1,
        }}
      >
        {tab.label}
        {tab.count !== undefined && (
          <span className="badge text-xs" style={{ background: activeTab === tab.id ? 'var(--accent-subtle)' : 'var(--gray-100)', color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)' }}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────
export interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions: { label: string; onClick: () => void; destructive?: boolean }[];
}

export const BulkActionBar = ({ selectedCount, onClear, actions }: BulkActionBarProps) => {
  if (selectedCount === 0) return null;
  return (
    <div
      className="flex items-center gap-3 px-4 py-2 rounded-lg"
      style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-muted)' }}
      role="toolbar"
      aria-label="إجراءات جماعية / Bulk Actions"
    >
      <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
        {selectedCount} محدد / selected
      </span>
      <div className="flex gap-2 ms-auto">
        {actions.map((action, i) => (
          <button
            key={`bulk-action-${i}`}
            className={`btn btn-sm ${action.destructive ? 'btn-destructive' : 'btn-secondary'}`}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={onClear}>
          إلغاء / Clear
        </button>
      </div>
    </div>
  );
};

// ─── Filter Bar ───────────────────────────────────────────────────────────────
export interface FilterBarProps {
  children: React.ReactNode;
  onClear?: () => void;
  hasFilters?: boolean;
}

export const FilterBar = ({ children, onClear, hasFilters = false }: FilterBarProps) => (
  <div className="flex flex-wrap items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
    {children}
    {hasFilters && onClear && (
      <button className="btn btn-ghost btn-sm text-xs" onClick={onClear}>
        مسح الفلاتر / Clear Filters
      </button>
    )}
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalCount?: number;
  labelAr?: string;
  labelEn?: string;
}

export const Pagination = ({ page, pageCount, onPageChange, pageSize, totalCount }: PaginationProps) => (
  <div className="flex items-center justify-between gap-4 px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
      {totalCount !== undefined && pageSize !== undefined
        ? `${Math.min((page - 1) * pageSize + 1, totalCount)}–${Math.min(page * pageSize, totalCount)} من ${totalCount} / of ${totalCount}`
        : `صفحة ${page} من ${pageCount} / Page ${page} of ${pageCount}`}
    </span>
    <div className="flex items-center gap-1">
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="الصفحة السابقة / Previous page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
        const p = i + 1;
        return (
          <button
            key={`page-${p}`}
            className="btn btn-sm"
            style={{
              background: p === page ? 'var(--accent)' : 'transparent',
              color: p === page ? 'var(--accent-foreground)' : 'var(--text-secondary)',
              border: 'none',
              minWidth: 32,
            }}
            onClick={() => onPageChange(p)}
            aria-label={`صفحة ${p} / Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="الصفحة التالية / Next page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </div>
);

// ─── Page Header ──────────────────────────────────────────────────────────────
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <div
    className="flex items-center justify-between px-6 py-4"
    style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}
  >
    <div>
      <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
      {subtitle && <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

// ─── Progressive Disclosure ───────────────────────────────────────────────────
export interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Disclosure = ({ title, children, defaultOpen = false }: DisclosureProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium"
        style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: open ? '1px solid var(--border)' : 'none' }}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {title}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease', flexShrink: 0 }}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
};
