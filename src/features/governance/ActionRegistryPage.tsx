'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import AppShell, { useApp } from '@/components/AppShell';
import { StatusBadge, RiskBadge } from '@/components/StatusBadge';
import { mockApi } from '@/mocks';
import type { Action } from '@/mocks/types';
import { ROUTES } from '@/app-routes/routes';
import { useRouter } from 'next/navigation';

const columnHelper = createColumnHelper<Action>();

function ActionListContent() {
  const { lang, t, simMode } = useApp();
  const router = useRouter();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  const loadActions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend integration point: GET /api/governance/actions
      let data = await mockApi.getActions(simMode);
      setActions(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'خطأ');
    } finally {
      setLoading(false);
    }
  }, [simMode]);

  useEffect(() => { loadActions(); }, [loadActions]);

  const filtered = useMemo(() => {
    let data = actions;
    if (riskFilter) data = data.filter(a => a.riskLevel === riskFilter);
    if (globalFilter) {
      const q = globalFilter.toLowerCase();
      data = data.filter(a =>
        a.name.ar.toLowerCase().includes(q) ||
        a.name.en.toLowerCase().includes(q) ||
        a.technicalId.toLowerCase().includes(q)
      );
    }
    return data;
  }, [actions, riskFilter, globalFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor(row => lang === 'ar' ? row.name.ar : row.name.en, {
      id: 'name',
      header: t('الإجراء', 'Action'),
      cell: info => (
        <div>
          <button
            className="text-sm font-medium hover:underline text-start"
            style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => router.push(ROUTES.governanceActionDetail(info.row.original.id))}
          >
            {info.getValue()}
          </button>
          <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {info.row.original.technicalId}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: t('الفئة', 'Category'),
      cell: info => <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{info.getValue()}</span>,
    }),
    columnHelper.accessor('riskLevel', {
      header: t('مستوى المخاطرة', 'Risk Level'),
      cell: info => <RiskBadge level={info.getValue()} />,
    }),
    columnHelper.accessor('status', {
      header: t('الحالة', 'Status'),
      cell: info => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('version', {
      header: t('الإصدار', 'Version'),
      cell: info => (
        <span className="text-xs font-mono tabular-nums" style={{ color: 'var(--text-secondary)' }}>
          v{info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: t('آخر تعديل', 'Last Modified'),
      cell: info => (
        <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {new Date(info.getValue()).toLocaleDateString('en-GB')}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          className="btn btn-ghost btn-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => router.push(ROUTES.governanceActionDetail(row.original.id))}
          aria-label={t('عرض التفاصيل', 'View Details')}
        >
          {t('عرض', 'View')} →
        </button>
      ),
    }),
  ], [lang, t, router]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}
      >
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('سجل الإجراءات', 'Action Registry')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t('الإجراءات المؤسسية المحكومة بالصلاحيات والمخاطر', 'Governed institutional actions with permissions and risk')}
          </p>
        </div>
        <button className="btn btn-primary btn-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          {t('إجراء جديد', 'New Action')}
        </button>
      </div>

      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-3 px-6 py-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}
      >
        <div className="relative flex-1 min-w-48 max-w-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute" style={{ top: '50%', transform: 'translateY(-50%)', insetInlineStart: 10, color: 'var(--text-muted)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            className="input-base"
            style={{ paddingInlineStart: 32 }}
            placeholder={t('بحث في الإجراءات...', 'Search actions...')}
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
          />
        </div>
        <select
          className="input-base"
          style={{ width: 'auto', minWidth: 140 }}
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value)}
        >
          <option value="">{t('كل مستويات المخاطرة', 'All Risk Levels')}</option>
          <option value="low">{t('منخفض', 'Low')}</option>
          <option value="medium">{t('متوسط', 'Medium')}</option>
          <option value="high">{t('مرتفع', 'High')}</option>
          <option value="critical">{t('حرج', 'Critical')}</option>
        </select>
        {(globalFilter || riskFilter) && (
          <button className="btn btn-ghost btn-sm text-xs" onClick={() => { setGlobalFilter(''); setRiskFilter(''); }}>
            {t('مسح', 'Clear')}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {loading ? (
          <table className="data-table">
            <tbody>
              {Array.from({ length: 6 }, (_, i) => (
                <tr key={`skel-action-${i}`}>
                  {Array.from({ length: 7 }, (_, j) => (
                    <td key={`skel-action-cell-${i}-${j}`} style={{ padding: '12px' }}>
                      <div className="skeleton" style={{ height: 16, width: j === 0 ? '70%' : '50%' }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
              style={{ background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}>
              {error}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={loadActions}>{t('إعادة المحاولة', 'Retry')}</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('لا توجد إجراءات', 'No Actions Found')}</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={`action-hg-${hg.id}`}>
                  {hg.headers.map(header => (
                    <th
                      key={`action-th-${header.id}`}
                      style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default', position: 'sticky', top: 0, zIndex: 1, background: 'var(--background)' }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && (
                          <span style={{ color: 'var(--accent)' }}>
                            {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={`action-row-${row.original.id}`} className="group">
                  {row.getVisibleCells().map(cell => (
                    <td key={`action-cell-${row.original.id}-${cell.column.id}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && filtered.length > 0 && (
        <div
          className="flex items-center justify-between px-6 py-3 text-sm"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            {t(`${filtered.length} إجراء`, `${filtered.length} actions`)}
          </span>
          <div className="flex items-center gap-1">
            <button className="btn btn-ghost btn-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>‹</button>
            <span className="text-xs px-2" style={{ color: 'var(--text-secondary)' }}>
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActionRegistryPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <AppShell breadcrumbs={[{ label: 'عقل', href: '/' }, { label: 'الحوكمة' }, { label: 'سجل الإجراءات' }]}>
      <ActionListContent />
    </AppShell>
  );
}