'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import AppShell, { useApp } from '@/components/AppShell';
import { StatusBadge, RiskBadge } from '@/components/StatusBadge';
import { mockApi } from '@/mocks';
import type { Action, UserRole } from '@/mocks/types';
import { ROUTES } from '@/app-routes/routes';
import { useRouter } from 'next/navigation';

// ─── Risk Matrix ──────────────────────────────────────────────────────────────
const RiskMatrix = ({
  probability,
  impact,
  t,
}: {
  probability: number;
  impact: number;
  t: (ar: string, en: string) => string;
}) => {
  const getRiskColor = (p: number, i: number) => {
    const score = p * i;
    if (score >= 16) return 'var(--risk-critical)';
    if (score >= 9) return 'var(--risk-high)';
    if (score >= 4) return 'var(--risk-medium)';
    return 'var(--risk-low)';
  };

  const getRiskBg = (p: number, i: number) => {
    const score = p * i;
    if (score >= 16) return 'var(--risk-critical-bg)';
    if (score >= 9) return 'var(--risk-high-bg)';
    if (score >= 4) return 'var(--risk-medium-bg)';
    return 'var(--risk-low-bg)';
  };

  return (
    <div>
      <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
        {t('مصفوفة المخاطر (الاحتمالية × التأثير)', 'Risk Matrix (Probability × Impact)')}
      </div>
      <div className="flex gap-3 items-start">
        {/* Matrix Grid */}
        <div>
          <div className="flex mb-1">
            <div style={{ width: 40 }} />
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={`matrix-col-${i}`}
                className="text-xs text-center font-medium"
                style={{ width: 36, color: i === impact ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                {i}
              </div>
            ))}
          </div>
          {[5, 4, 3, 2, 1].map(p => (
            <div key={`matrix-row-${p}`} className="flex items-center mb-0.5">
              <div
                className="text-xs text-center font-medium"
                style={{ width: 40, color: p === probability ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                {p}
              </div>
              {[1, 2, 3, 4, 5].map(i => {
                const isActive = p === probability && i === impact;
                return (
                  <div
                    key={`matrix-cell-${p}-${i}`}
                    className="rounded-sm flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 28,
                      marginInlineEnd: 4,
                      background: isActive ? getRiskColor(p, i) : getRiskBg(p, i),
                      border: isActive ? `2px solid ${getRiskColor(p, i)}` : '1px solid transparent',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 150ms',
                      boxShadow: isActive ? `0 0 0 3px color-mix(in srgb, ${getRiskColor(p, i)} 25%, transparent)` : 'none',
                    }}
                    aria-label={`P${p} × I${i}`}
                  >
                    {isActive && (
                      <span className="text-xs font-bold" style={{ color: '#fff' }}>✦</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="flex mt-1">
            <div style={{ width: 40 }} />
            <div className="text-xs" style={{ color: 'var(--text-muted)', fontSize: 10 }}>
              ← {t('التأثير', 'Impact')} →
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 pt-4">
          {[
            { label: t('منخفض', 'Low'), color: 'var(--risk-low)', bg: 'var(--risk-low-bg)' },
            { label: t('متوسط', 'Medium'), color: 'var(--risk-medium)', bg: 'var(--risk-medium-bg)' },
            { label: t('مرتفع', 'High'), color: 'var(--risk-high)', bg: 'var(--risk-high-bg)' },
            { label: t('حرج', 'Critical'), color: 'var(--risk-critical)', bg: 'var(--risk-critical-bg)' },
          ].map(item => (
            <div key={`risk-legend-${item.label}`} className="flex items-center gap-2">
              <div className="rounded-sm" style={{ width: 14, height: 14, background: item.color }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            </div>
          ))}
          <div className="pt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            P={probability} × I={impact} = {probability * impact}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Permission Simulation Panel ──────────────────────────────────────────────
const PermissionSimPanel = ({
  action,
  t,
  lang,
}: {
  action: Action;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const roleLabels: Record<UserRole, { ar: string; en: string }> = {
    employee: { ar: 'موظف', en: 'Employee' },
    supervisor: { ar: 'مشرف', en: 'Supervisor' },
    manager: { ar: 'مدير', en: 'Manager' },
    system_admin: { ar: 'مسؤول نظام', en: 'System Admin' },
  };

  const perm = action.permissions.find(p => p.role === selectedRole);

  return (
    <div>
      <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
        {t('محاكاة الصلاحيات حسب الدور', 'Permission Simulation by Role')}
      </div>

      {/* Role Selector */}
      <div className="flex gap-2 flex-wrap mb-4">
        {(['employee', 'supervisor', 'manager', 'system_admin'] as UserRole[]).map(role => (
          <button
            key={`perm-role-${role}`}
            onClick={() => setSelectedRole(role)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              background: selectedRole === role ? 'var(--accent)' : 'var(--background)',
              color: selectedRole === role ? 'var(--accent-foreground)' : 'var(--text-secondary)',
              border: `1px solid ${selectedRole === role ? 'var(--accent)' : 'var(--border)'}`,
              cursor: 'pointer',
            }}
            aria-pressed={selectedRole === role}
          >
            {roleLabels[role][lang]}
          </button>
        ))}
      </div>

      {/* Simulation Result */}
      {perm ? (
        <div
          className="rounded-lg p-4"
          style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
          role="status"
          aria-live="polite"
        >
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            {t(`دور: ${roleLabels[selectedRole].ar}`, `Role: ${roleLabels[selectedRole].en}`)}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  width: 22, height: 22,
                  background: perm.canView ? 'var(--success-bg)' : 'var(--error-bg)',
                  color: perm.canView ? 'var(--success-text)' : 'var(--error-text)',
                }}
              >
                {perm.canView ? '✓' : '✗'}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('عرض تفاصيل الإجراء', 'View action details')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  width: 22, height: 22,
                  background: perm.canExecute ? 'var(--success-bg)' : 'var(--error-bg)',
                  color: perm.canExecute ? 'var(--success-text)' : 'var(--error-text)',
                }}
              >
                {perm.canExecute ? '✓' : '✗'}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('تنفيذ الإجراء', 'Execute action')}
              </span>
            </div>
          </div>

          {!perm.canView && (
            <div
              className="mt-3 px-3 py-2 rounded text-xs"
              style={{ background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}
            >
              {t('هذا الدور لا يملك صلاحية عرض هذا الإجراء.', 'This role does not have permission to view this action.')}
            </div>
          )}
          {perm.canView && !perm.canExecute && (
            <div
              className="mt-3 px-3 py-2 rounded text-xs"
              style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)' }}
            >
              {t('يمكن العرض فقط — التنفيذ يتطلب صلاحية أعلى.', 'View only — execution requires higher permission.')}
            </div>
          )}
          {perm.canView && perm.canExecute && (
            <div
              className="mt-3 px-3 py-2 rounded text-xs"
              style={{ background: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid var(--success-border)' }}
            >
              {t('صلاحية كاملة — العرض والتنفيذ متاحان.', 'Full access — view and execute available.')}
            </div>
          )}
        </div>
      ) : (
        <div
          className="px-3 py-2 rounded text-xs"
          style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)' }}
        >
          {t('لم يتم تعيين صلاحيات لهذا الدور — تحذير حوكمة.', 'No permissions assigned to this role — governance warning.')}
        </div>
      )}
    </div>
  );
};

// ─── Version Comparison ───────────────────────────────────────────────────────
const VersionPanel = ({
  action,
  t,
  lang,
}: {
  action: Action;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => {
  const [compareIdx, setCompareIdx] = useState(0);

  return (
    <div>
      <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
        {t('الإصدارات', 'Versions')}
      </div>
      <div className="space-y-2">
        {action.versions.map((ver, vi) => (
          <div
            key={`ver-${ver.version}`}
            className="rounded-lg p-3 flex items-start gap-3"
            style={{
              background: ver.version === action.version ? 'var(--accent-subtle)' : 'var(--background)',
              border: `1px solid ${ver.version === action.version ? 'var(--accent-muted)' : 'var(--border)'}`,
            }}
          >
            <div
              className="flex-shrink-0 rounded text-xs font-bold font-mono flex items-center justify-center"
              style={{ width: 36, height: 24, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              v{ver.version}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <StatusBadge status={ver.status} />
                {ver.version === action.version && (
                  <span className="badge text-xs" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                    {t('الحالي', 'Current')}
                  </span>
                )}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? ver.changelog.ar : ver.changelog.en}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {new Date(ver.createdAt).toLocaleDateString('en-GB')} · {ver.changedBy}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Audit Log ────────────────────────────────────────────────────────────────
const AuditLogPanel = ({
  action,
  t,
  lang,
}: {
  action: Action;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => {
  if (action.auditLog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center" style={{ color: 'var(--text-muted)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
        <div className="text-sm">{t('لا توجد سجلات تدقيق', 'No audit log entries')}</div>
      </div>
    );
  }

  const actionLabels: Record<string, { ar: string; en: string }> = {
    created: { ar: 'إنشاء', en: 'Created' },
    approved: { ar: 'اعتماد', en: 'Approved' },
    rejected: { ar: 'رفض', en: 'Rejected' },
    updated: { ar: 'تحديث', en: 'Updated' },
    executed: { ar: 'تنفيذ', en: 'Executed' },
    submitted_for_review: { ar: 'تقديم للمراجعة', en: 'Submitted for Review' },
  };

  return (
    <div className="space-y-2">
      {action.auditLog.map(entry => (
        <div
          key={`audit-${entry.id}`}
          className="flex items-start gap-3 py-2"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div
            className="flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ width: 28, height: 28, background: 'var(--accent-subtle)', color: 'var(--accent)', marginTop: 2 }}
          >
            {entry.userName.ar.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ar' ? entry.userName.ar : entry.userName.en}
              </span>
              <span
                className="badge text-xs"
                style={{ background: 'var(--info-bg)', color: 'var(--info-text)' }}
              >
                {actionLabels[entry.action]?.[lang] || entry.action}
              </span>
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? entry.details.ar : entry.details.en}
            </div>
            <div className="text-xs mt-0.5 tabular-nums font-mono" style={{ color: 'var(--text-muted)' }}>
              {new Date(entry.timestamp).toLocaleString('en-GB')}
              {entry.ipAddress && ` · ${entry.ipAddress}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Where Used ───────────────────────────────────────────────────────────────
const WhereUsedPanel = ({
  action,
  t,
  lang,
  onNavigate,
}: {
  action: Action;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
  onNavigate: (path: string) => void;
}) => {
  if (action.usedIn.length === 0) {
    return (
      <div className="py-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        {t('هذا الإجراء غير مستخدم في أي مسار أو شاشة حتى الآن.', 'This action is not used in any workflow or screen yet.')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {action.usedIn.map(ref => (
        <div
          key={`used-in-${ref.id}`}
          className="flex items-center gap-3 p-3 rounded-lg transition-colors"
          style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
        >
          <div
            className="flex-shrink-0 flex items-center justify-center rounded"
            style={{ width: 32, height: 32, background: 'var(--accent-subtle)', color: 'var(--accent)' }}
          >
            {ref.type === 'workflow' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v3m-4.5 5.5L12 10l4.5 5.5"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {lang === 'ar' ? ref.name.ar : ref.name.en}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {ref.type === 'workflow' ? t('مسار عمل', 'Workflow') : t('شاشة', 'Screen')}
            </div>
          </div>
          {ref.path && (
            <button
              className="btn btn-ghost btn-sm text-xs flex-shrink-0"
              onClick={() => onNavigate(ref.path!)}
              aria-label={t('فتح', 'Open')}
            >
              {t('فتح', 'Open')} →
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Action Detail Content ────────────────────────────────────────────────────
type DetailTab = 'overview' | 'permissions' | 'versions' | 'audit' | 'where_used';

function ActionDetailContent() {
  const { lang, t, simMode, simRole } = useApp();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [action, setAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const isReadOnly = simRole === 'employee';

  const loadAction = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend integration point: GET /api/governance/actions/:id
      const data = await mockApi.getActionById(id || 'action-001', simMode);
      setAction(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'خطأ');
    } finally {
      setLoading(false);
    }
  }, [id, simMode]);

  useEffect(() => { loadAction(); }, [loadAction]);

  const tabs: { id: DetailTab; ar: string; en: string }[] = [
    { id: 'overview', ar: 'نظرة عامة', en: 'Overview' },
    { id: 'permissions', ar: 'الصلاحيات', en: 'Permissions' },
    { id: 'versions', ar: 'الإصدارات', en: 'Versions' },
    { id: 'audit', ar: 'سجل التدقيق', en: 'Audit Log' },
    { id: 'where_used', ar: 'أين يُستخدم', en: 'Where Used' },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="skeleton" style={{ height: 32, width: '40%' }} />
        <div className="skeleton" style={{ height: 20, width: '60%' }} />
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={`tab-skel-${i}`} className="skeleton" style={{ height: 32, width: 80 }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 200, width: '100%', marginTop: 16 }} />
      </div>
    );
  }

  if (error || !action) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
          style={{ background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}
          role="alert"
        >
          {error || t('الإجراء غير موجود', 'Action not found')}
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={loadAction}>{t('إعادة المحاولة', 'Retry')}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push(ROUTES.governanceActions)}>
            {t('العودة للقائمة', 'Back to List')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Detail Header */}
      <div
        className="px-6 py-4"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <button
                className="btn btn-ghost btn-sm text-xs"
                onClick={() => router.push(ROUTES.governanceActions)}
                aria-label={t('العودة', 'Back')}
              >
                ← {t('الإجراءات', 'Actions')}
              </button>
            </div>
            <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {lang === 'ar' ? action.name.ar : action.name.en}
            </h1>
            <div className="font-mono text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              {action.technicalId}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={action.status} />
              <RiskBadge level={action.riskLevel} />
              {action.deprecated && (
                <span
                  className="badge"
                  style={{ background: 'var(--gray-200)', color: 'var(--gray-600)', textDecoration: 'line-through' }}
                >
                  {t('مهمل', 'Deprecated')}
                </span>
              )}
              <span className="badge text-xs font-mono" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                v{action.version}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {action.category}
              </span>
            </div>
          </div>
          {!isReadOnly && (
            <div className="flex gap-2 flex-shrink-0">
              <button className="btn btn-secondary btn-sm">
                {t('تعديل', 'Edit')}
              </button>
              {action.status === 'under_review' && (
                <button className="btn btn-primary btn-sm">
                  {t('اعتماد', 'Approve')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 mt-4 -mb-4 overflow-x-auto scrollbar-thin"
          role="tablist"
          aria-label={t('تبويبات التفاصيل', 'Detail Tabs')}
        >
          {tabs.map(tab => (
            <button
              key={`detail-tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
                paddingBottom: 14,
              }}
            >
              {lang === 'ar' ? tab.ar : tab.en}
              {tab.id === 'where_used' && action.usedIn.length > 0 && (
                <span
                  className="ms-1 badge"
                  style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', fontSize: 10 }}
                >
                  {action.usedIn.length}
                </span>
              )}
              {tab.id === 'audit' && action.auditLog.length > 0 && (
                <span
                  className="ms-1 badge"
                  style={{ background: 'var(--gray-100)', color: 'var(--text-secondary)', fontSize: 10 }}
                >
                  {action.auditLog.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Description */}
            <div className="lg:col-span-2">
              <div className="card p-4">
                <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {t('الوصف', 'Description')}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-primary)', lineHeight: 1.7 }}>
                  {lang === 'ar' ? action.description.ar : action.description.en}
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div className="card p-4">
              <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                {t('المدخلات', 'Inputs')} ({action.inputs.length})
              </div>
              <div className="space-y-2">
                {action.inputs.map(input => (
                  <div
                    key={`input-${input.name}`}
                    className="flex items-start gap-3 py-2"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <code
                      className="text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: 'var(--background)', color: 'var(--accent)', border: '1px solid var(--border)' }}
                    >
                      {input.name}
                    </code>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono" style={{ color: 'var(--info-text)' }}>{input.type}</span>
                        {input.required && (
                          <span className="text-xs" style={{ color: 'var(--error)' }}>*</span>
                        )}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {lang === 'ar' ? input.description.ar : input.description.en}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outputs */}
            <div className="card p-4">
              <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                {t('المخرجات', 'Outputs')} ({action.outputs.length})
              </div>
              <div className="space-y-2">
                {action.outputs.map(output => (
                  <div
                    key={`output-${output.name}`}
                    className="flex items-start gap-3 py-2"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <code
                      className="text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: 'var(--background)', color: 'var(--success-text)', border: '1px solid var(--border)' }}
                    >
                      {output.name}
                    </code>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-mono" style={{ color: 'var(--info-text)' }}>{output.type}</span>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {lang === 'ar' ? output.description.ar : output.description.en}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Errors */}
            <div className="card p-4">
              <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                {t('الأخطاء المتوقعة', 'Expected Errors')}
              </div>
              <div className="space-y-2">
                {action.expectedErrors.map(err => (
                  <div
                    key={`err-${err.code}`}
                    className="flex items-start gap-3 py-2"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <code
                      className="text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}
                    >
                      {err.code}
                    </code>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? err.description.ar : err.description.en}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Matrix */}
            <div className="card p-4">
              <RiskMatrix
                probability={action.riskProbability}
                impact={action.riskImpact}
                t={t}
              />
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="card p-5 max-w-xl">
            <PermissionSimPanel action={action} t={t} lang={lang} />
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="card p-5 max-w-xl">
            <VersionPanel action={action} t={t} lang={lang} />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="card p-5 max-w-2xl">
            <div className="text-xs font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
              {t('سجل التدقيق', 'Audit Log')} · {action.auditLog.length} {t('إدخال', 'entries')}
            </div>
            <AuditLogPanel action={action} t={t} lang={lang} />
          </div>
        )}

        {activeTab === 'where_used' && (
          <div className="card p-5 max-w-xl">
            <div className="text-xs font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
              {t('يُستخدم في', 'Used In')} · {action.usedIn.length} {t('مرجع', 'references')}
            </div>
            <WhereUsedPanel
              action={action}
              t={t}
              lang={lang}
              onNavigate={path => router.push(path)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActionDetailPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <AppShell breadcrumbs={[
      { label: 'عقل', href: '/' },
      { label: 'الحوكمة' },
      { label: 'سجل الإجراءات', href: ROUTES.governanceActions },
      { label: 'تفاصيل الإجراء' },
    ]}>
      <ActionDetailContent />
    </AppShell>
  );
}