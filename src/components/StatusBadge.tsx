'use client';
import React from 'react';
import type { StatusValue, RiskLevel, ClassificationLevel } from '@/mocks/types';
import { useApp } from './AppShell';

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusValue, { ar: string; en: string; bg: string; text: string; dot: string }> = {
  draft: { ar: 'مسودة', en: 'Draft', bg: 'var(--gray-100)', text: 'var(--gray-600)', dot: 'var(--gray-400)' },
  under_review: { ar: 'قيد المراجعة', en: 'Under Review', bg: 'var(--info-bg)', text: 'var(--info-text)', dot: 'var(--info)' },
  approved: { ar: 'معتمد', en: 'Approved', bg: 'var(--success-bg)', text: 'var(--success-text)', dot: 'var(--success)' },
  rejected: { ar: 'مرفوض', en: 'Rejected', bg: 'var(--error-bg)', text: 'var(--error-text)', dot: 'var(--error)' },
  archived: { ar: 'مؤرشف', en: 'Archived', bg: 'var(--warning-bg)', text: 'var(--warning-text)', dot: 'var(--warning)' },
};

const RISK_CONFIG: Record<RiskLevel, { ar: string; en: string; bg: string; text: string; border: string }> = {
  low: { ar: 'منخفض', en: 'Low', bg: 'var(--risk-low-bg)', text: 'var(--risk-low-text)', border: 'var(--risk-low)' },
  medium: { ar: 'متوسط', en: 'Medium', bg: 'var(--risk-medium-bg)', text: 'var(--risk-medium-text)', border: 'var(--risk-medium)' },
  high: { ar: 'مرتفع', en: 'High', bg: 'var(--risk-high-bg)', text: 'var(--risk-high-text)', border: 'var(--risk-high)' },
  critical: { ar: 'حرج', en: 'Critical', bg: 'var(--risk-critical-bg)', text: 'var(--risk-critical-text)', border: 'var(--risk-critical)' },
};

const CLASS_CONFIG: Record<ClassificationLevel, { ar: string; en: string; bg: string; text: string }> = {
  public: { ar: 'عام', en: 'Public', bg: 'var(--class-public-bg)', text: 'var(--class-public-text)' },
  internal: { ar: 'داخلي', en: 'Internal', bg: 'var(--class-internal-bg)', text: 'var(--class-internal-text)' },
  confidential: { ar: 'سري', en: 'Confidential', bg: 'var(--class-confidential-bg)', text: 'var(--class-confidential-text)' },
  top_secret: { ar: 'سري للغاية', en: 'Top Secret', bg: 'var(--class-topsecret-bg)', text: 'var(--class-topsecret-text)' },
};

export const StatusBadge = ({ status }: { status: StatusValue }) => {
  const { lang } = useApp();
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="badge"
      style={{ background: cfg.bg, color: cfg.text }}
      aria-label={cfg[lang]}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{ width: 6, height: 6, background: cfg.dot }}
        aria-hidden="true"
      />
      {cfg[lang]}
    </span>
  );
};

export const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const { lang } = useApp();
  const cfg = RISK_CONFIG[level];
  return (
    <span
      className="badge"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, borderRadius: 4 }}
      aria-label={cfg[lang]}
    >
      {cfg[lang]}
    </span>
  );
};

export const ClassificationBadge = ({ level }: { level: ClassificationLevel }) => {
  const { lang } = useApp();
  const cfg = CLASS_CONFIG[level];
  return (
    <span
      className="badge"
      style={{ background: cfg.bg, color: cfg.text, fontWeight: 600 }}
      aria-label={cfg[lang]}
    >
      {level === 'top_secret' ? '🔒 ' : level === 'confidential' ? '🔐 ' : ''}{cfg[lang]}
    </span>
  );
};

export { STATUS_CONFIG, RISK_CONFIG, CLASS_CONFIG };