'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  createColumnHelper,
} from '@tanstack/react-table';
import AppShell, { useApp } from '@/components/AppShell';
import { StatusBadge, RiskBadge, ClassificationBadge } from '@/components/StatusBadge';
import { mockApi } from '@/mocks';
import type { RecordInstance, StatusValue } from '@/mocks/types';
import { ROUTES } from '@/app-routes/routes';
import { useRouter } from 'next/navigation';

const columnHelper = createColumnHelper<RecordInstance>();

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
const SkeletonRow = ({ cols }: { cols: number }) => (
  <tr>
    {Array.from({ length: cols }, (_, i) => (
      <td key={`skel-col-${i}`} style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="skeleton" style={{ height: 16, width: i === 0 ? 24 : i === 1 ? '80%' : '60%' }} />
      </td>
    ))}
  </tr>
);

// ─── Column Visibility Panel ──────────────────────────────────────────────────
const ColumnVisibilityPanel = ({
  table,
  onClose,
  t,
}: {
  table: ReturnType<typeof useReactTable<RecordInstance>>;
  onClose: () => void;
  t: (ar: string, en: string) => string;
}) => (
  <div
    className="absolute z-50 rounded-lg p-3"
    style={{
      top: '100%',
      insetInlineEnd: 0,
      marginTop: 4,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-2)',
      minWidth: 200,
    }}
    role="dialog"
    aria-label={t('إدارة الأعمدة', 'Column Management')}
  >
    <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
      {t('إظهار/إخفاء الأعمدة', 'Show/Hide Columns')}
    </div>
    {table.getAllLeafColumns().filter(col => col.id !== 'select').map(col => (
      <label
        key={`col-vis-${col.id}`}
        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
        style={{ color: 'var(--text-primary)' }}
      >
        <input
          type="checkbox"
          checked={col.getIsVisible()}
          onChange={col.getToggleVisibilityHandler()}
          className="rounded"
          style={{ accentColor: 'var(--accent)' }}
        />
        {typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id}
      </label>
    ))}
    <button
      onClick={onClose}
      className="btn btn-ghost btn-sm w-full mt-2 text-xs"
    >
      {t('إغلاق', 'Close')}
    </button>
  </div>
);

// ─── Row Detail Drawer ────────────────────────────────────────────────────────
const RowDetailDrawer = ({
  record,
  onClose,
  t,
  lang,
}: {
  record: RecordInstance;
  onClose: () => void;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => {
  const router = useRouter();
  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: 'rgba(0,0,0,0.3)' }}
      role="dialog"
      aria-modal="true"
      aria-label={t('تفاصيل السجل', 'Record Details')}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="ms-auto flex flex-col"
        style={{
          width: '100%',
          maxWidth: 480,
          height: '100%',
          background: 'var(--surface)',
          borderInlineStart: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {lang === 'ar' ? record.title.ar : record.title.en}
            </div>
            <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>
              {record.referenceNumber}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label={t('إغلاق', 'Close')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            <StatusBadge status={record.status} />
            <RiskBadge level={record.riskLevel} />
            <ClassificationBadge level={record.classification} />
          </div>

          <div className="space-y-3">
            {[
              [t('نوع السجل', 'Record Type'), lang === 'ar' ? record.typeName.ar : record.typeName.en],
              [t('القسم', 'Department'), lang === 'ar' ? record.department.name.ar : record.department.name.en],
              [t('أُنشئ بواسطة', 'Created By'), lang === 'ar' ? record.createdBy.name.ar : record.createdBy.name.en],
              [t('تاريخ الإنشاء', 'Created At'), new Date(record.createdAt).toLocaleDateString('en-GB')],
              [t('آخر تحديث', 'Last Updated'), new Date(record.updatedAt).toLocaleDateString('en-GB')],
              [t('الأولوية', 'Priority'), record.priority],
            ].map(([label, value]) => (
              <div key={`detail-${label}`} className="flex gap-3">
                <span className="text-xs w-28 flex-shrink-0 pt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
            {record.tags.length > 0 && (
              <div className="flex gap-3">
                <span className="text-xs w-28 flex-shrink-0 pt-0.5" style={{ color: 'var(--text-muted)' }}>{t('الوسوم', 'Tags')}</span>
                <div className="flex flex-wrap gap-1">
                  {record.tags.map(tag => (
                    <span
                      key={`tag-${record.id}-${tag}`}
                      className="badge text-xs"
                      style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="flex gap-2 p-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            className="btn btn-primary btn-sm flex-1"
            onClick={() => {
              if (record.relatedActionId) {
                router.push(ROUTES.governanceActionDetail(record.relatedActionId));
              }
            }}
          >
            {t('عرض الإجراء المرتبط', 'View Related Action')}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => router.push(ROUTES.recordTypeBuilder)}
          >
            {t('نوع السجل', 'Record Type')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Records Page ────────────────────────────────────────────────────────
function RecordsContent() {
  const { lang, t, simMode, simRole } = useApp();
  const router = useRouter();

  const [records, setRecords] = useState<RecordInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'updatedAt', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [showColPanel, setShowColPanel] = useState(false);
  const [detailRecord, setDetailRecord] = useState<RecordInstance | null>(null);
  const [density, setDensity] = useState<'comfortable' | 'dense'>('comfortable');
  const [statusFilter, setStatusFilter] = useState<StatusValue | ''>('');
  const [deptFilter, setDeptFilter] = useState('');
  const [bulkAction, setBulkAction] = useState('');

  const isReadOnly = simRole === 'employee';
  const canBulkEdit = simRole === 'manager' || simRole === 'system_admin';

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend integration point: GET /api/records
      let data = await mockApi.getRecords(simMode);
      setRecords(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  }, [simMode]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    let data = records;
    if (statusFilter) data = data.filter(r => r.status === statusFilter);
    if (deptFilter) data = data.filter(r => r.department.id === deptFilter);
    if (globalFilter) {
      const q = globalFilter.toLowerCase();
      data = data.filter(r =>
        r.title.ar.toLowerCase().includes(q) ||
        r.title.en.toLowerCase().includes(q) ||
        r.referenceNumber.toLowerCase().includes(q) ||
        r.createdBy.name.ar.toLowerCase().includes(q)
      );
    }
    return data;
  }, [records, statusFilter, deptFilter, globalFilter]);

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label={t('تحديد الكل', 'Select All')}
          style={{ accentColor: 'var(--accent)' }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label={t('تحديد الصف', 'Select Row')}
          style={{ accentColor: 'var(--accent)' }}
        />
      ),
      size: 40,
    }),
    columnHelper.accessor('referenceNumber', {
      header: t('الرقم المرجعي', 'Reference'),
      cell: info => (
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          {info.getValue()}
        </span>
      ),
      size: 140,
    }),
    columnHelper.accessor(row => lang === 'ar' ? row.title.ar : row.title.en, {
      id: 'title',
      header: t('العنوان', 'Title'),
      cell: info => (
        <button
          className="text-start hover:underline font-medium text-sm"
          style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', maxWidth: 280 }}
          onClick={() => setDetailRecord(filteredRecords.find(r => r.referenceNumber === info.row.original.referenceNumber) || null)}
        >
          <span className="line-clamp-1">{info.getValue()}</span>
        </button>
      ),
      size: 280,
    }),
    columnHelper.accessor('status', {
      header: t('الحالة', 'Status'),
      cell: info => <StatusBadge status={info.getValue()} />,
      size: 130,
    }),
    columnHelper.accessor('classification', {
      header: t('التصنيف', 'Classification'),
      cell: info => <ClassificationBadge level={info.getValue()} />,
      size: 130,
    }),
    columnHelper.accessor('riskLevel', {
      header: t('مستوى المخاطرة', 'Risk'),
      cell: info => <RiskBadge level={info.getValue()} />,
      size: 110,
    }),
    columnHelper.accessor(row => lang === 'ar' ? row.typeName.ar : row.typeName.en, {
      id: 'typeName',
      header: t('نوع السجل', 'Record Type'),
      cell: info => (
        <button
          className="text-xs hover:underline"
          style={{ color: 'var(--info-text)', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => router.push(ROUTES.recordTypeBuilder)}
        >
          {info.getValue()}
        </button>
      ),
      size: 160,
    }),
    columnHelper.accessor(row => lang === 'ar' ? row.department.name.ar : row.department.name.en, {
      id: 'department',
      header: t('القسم', 'Department'),
      cell: info => (
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{info.getValue()}</span>
      ),
      size: 160,
    }),
    columnHelper.accessor('createdBy', {
      header: t('أُنشئ بواسطة', 'Created By'),
      cell: info => {
        const user = info.getValue();
        return (
          <div className="flex items-center gap-2">
            <div
              className="rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ width: 24, height: 24, background: 'var(--accent-subtle)', color: 'var(--accent)' }}
              aria-hidden="true"
            >
              {user.name.ar.charAt(0)}
            </div>
            <span className="text-sm truncate" style={{ color: 'var(--text-secondary)', maxWidth: 100 }}>
              {lang === 'ar' ? user.name.ar : user.name.en}
            </span>
          </div>
        );
      },
      size: 160,
    }),
    columnHelper.accessor('priority', {
      header: t('الأولوية', 'Priority'),
      cell: info => {
        const p = info.getValue();
        const colors: Record<string, string> = { urgent: 'var(--error-text)', high: 'var(--warning-text)', normal: 'var(--text-secondary)', low: 'var(--text-muted)' };
        const labels: Record<string, { ar: string; en: string }> = {
          urgent: { ar: 'عاجل', en: 'Urgent' },
          high: { ar: 'مرتفع', en: 'High' },
          normal: { ar: 'عادي', en: 'Normal' },
          low: { ar: 'منخفض', en: 'Low' },
        };
        return <span className="text-xs font-medium" style={{ color: colors[p] }}>{labels[p]?.[lang] || p}</span>;
      },
      size: 90,
    }),
    columnHelper.accessor('tags', {
      header: t('الوسوم', 'Tags'),
      cell: info => (
        <div className="flex gap-1 flex-wrap">
          {info.getValue().slice(0, 2).map(tag => (
            <span
              key={`tag-cell-${info.row.original.id}-${tag}`}
              className="badge text-xs"
              style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', fontSize: 11 }}
            >
              {tag}
            </span>
          ))}
        </div>
      ),
      size: 120,
      enableSorting: false,
    }),
    columnHelper.accessor('createdAt', {
      header: t('تاريخ الإنشاء', 'Created'),
      cell: info => (
        <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {new Date(info.getValue()).toLocaleDateString('en-GB')}
        </span>
      ),
      size: 100,
    }),
    columnHelper.accessor('updatedAt', {
      header: t('آخر تحديث', 'Updated'),
      cell: info => (
        <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {new Date(info.getValue()).toLocaleDateString('en-GB')}
        </span>
      ),
      size: 100,
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="btn btn-ghost btn-sm"
            title={t('عرض التفاصيل', 'View Details')}
            onClick={() => setDetailRecord(row.original)}
            aria-label={t('عرض التفاصيل', 'View Details')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button
            className="btn btn-ghost btn-sm"
            title={t('الإجراء المرتبط', 'Related Action')}
            onClick={() => row.original.relatedActionId && router.push(ROUTES.governanceActionDetail(row.original.relatedActionId))}
            aria-label={t('الإجراء المرتبط', 'Related Action')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </button>
          {!isReadOnly && (
            <button
              className="btn btn-ghost btn-sm"
              title={t('تعديل', 'Edit')}
              aria-label={t('تعديل', 'Edit')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          )}
        </div>
      ),
      size: 100,
    }),
  ], [lang, t, filteredRecords, isReadOnly, router]);

  const table = useReactTable({
    data: filteredRecords,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const selectedCount = Object.keys(rowSelection).length;

  const depts = useMemo(() => {
    const seen = new Set<string>();
    const out: { id: string; name: { ar: string; en: string } }[] = [];
    records.forEach(r => {
      if (!seen.has(r.department.id)) {
        seen.add(r.department.id);
        out.push(r.department);
      }
    });
    return out;
  }, [records]);

  const rowPadding = density === 'comfortable' ? '10px 12px' : '5px 12px';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}
      >
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('قائمة السجلات', 'Record List')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t(`${filteredRecords.length} سجل`, `${filteredRecords.length} records`)}
          </p>
        </div>
        {!isReadOnly && (
          <button className="btn btn-primary btn-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            {t('سجل جديد', 'New Record')}
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-3 px-6 py-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-xs">
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute"
            style={{ top: '50%', transform: 'translateY(-50%)', insetInlineStart: 10, color: 'var(--text-muted)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            className="input-base"
            style={{ paddingInlineStart: 32 }}
            placeholder={t('بحث في السجلات...', 'Search records...')}
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            aria-label={t('بحث', 'Search')}
          />
        </div>

        {/* Status filter */}
        <select
          className="input-base"
          style={{ width: 'auto', minWidth: 140 }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusValue | '')}
          aria-label={t('تصفية بالحالة', 'Filter by Status')}
        >
          <option value="">{t('كل الحالات', 'All Statuses')}</option>
          <option value="draft">{t('مسودة', 'Draft')}</option>
          <option value="under_review">{t('قيد المراجعة', 'Under Review')}</option>
          <option value="approved">{t('معتمد', 'Approved')}</option>
          <option value="rejected">{t('مرفوض', 'Rejected')}</option>
          <option value="archived">{t('مؤرشف', 'Archived')}</option>
        </select>

        {/* Dept filter */}
        <select
          className="input-base"
          style={{ width: 'auto', minWidth: 140 }}
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          aria-label={t('تصفية بالقسم', 'Filter by Department')}
        >
          <option value="">{t('كل الأقسام', 'All Departments')}</option>
          {depts.map(d => (
            <option key={`dept-opt-${d.id}`} value={d.id}>
              {lang === 'ar' ? d.name.ar : d.name.en}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {(statusFilter || deptFilter || globalFilter) && (
          <button
            className="btn btn-ghost btn-sm text-xs"
            onClick={() => { setStatusFilter(''); setDeptFilter(''); setGlobalFilter(''); }}
          >
            {t('مسح التصفية', 'Clear Filters')}
          </button>
        )}

        <div className="ms-auto flex items-center gap-2">
          {/* Density toggle */}
          <button
            className="btn btn-ghost btn-sm text-xs"
            onClick={() => setDensity(d => d === 'comfortable' ? 'dense' : 'comfortable')}
            title={t('تبديل الكثافة', 'Toggle Density')}
            aria-label={t('تبديل الكثافة', 'Toggle Density')}
          >
            {density === 'comfortable' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"/></svg>
            )}
          </button>

          {/* Column visibility */}
          <div className="relative">
            <button
              className="btn btn-ghost btn-sm text-xs"
              onClick={() => setShowColPanel(v => !v)}
              aria-label={t('إدارة الأعمدة', 'Column Management')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
              {t('الأعمدة', 'Columns')}
            </button>
            {showColPanel && (
              <ColumnVisibilityPanel table={table} onClose={() => setShowColPanel(false)} t={t} />
            )}
          </div>

          {/* Export */}
          <button className="btn btn-secondary btn-sm text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {t('تصدير', 'Export')}
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedCount > 0 && (
        <div
          className="flex items-center gap-3 px-6 py-2"
          style={{ background: 'var(--accent-subtle)', borderBottom: '1px solid var(--accent-muted)', flexShrink: 0 }}
          role="toolbar"
          aria-label={t('إجراءات جماعية', 'Bulk Actions')}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            {t(`تم تحديد ${selectedCount} سجل`, `${selectedCount} records selected`)}
          </span>
          <div className="flex gap-2 ms-auto">
            <button
              className="btn btn-secondary btn-sm text-xs"
              disabled={!canBulkEdit}
              title={!canBulkEdit ? t('صلاحية غير كافية لهذا الإجراء', 'Insufficient permission for this action') : undefined}
            >
              {t('تغيير الحالة', 'Change Status')}
            </button>
            <button className="btn btn-secondary btn-sm text-xs">
              {t('تصدير المحدد', 'Export Selected')}
            </button>
            <button
              className="btn btn-destructive btn-sm text-xs"
              disabled={!canBulkEdit}
              title={!canBulkEdit ? t('صلاحية غير كافية', 'Insufficient permission') : undefined}
            >
              {t('حذف المحدد', 'Delete Selected')}
            </button>
            <button
              className="btn btn-ghost btn-sm text-xs"
              onClick={() => setRowSelection({})}
            >
              {t('إلغاء التحديد', 'Deselect All')}
            </button>
          </div>
        </div>
      )}

      {/* Permission Denied Banner */}
      {isReadOnly && (
        <div
          className="flex items-center gap-3 px-6 py-2 text-sm"
          style={{ background: 'var(--warning-bg)', borderBottom: '1px solid var(--warning-border)', color: 'var(--warning-text)', flexShrink: 0 }}
          role="alert"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          {t('وضع القراءة — دورك الحالي (موظف) لا يتيح التعديل على السجلات.', 'Read-only mode — your current role (Employee) does not allow editing records.')}
        </div>
      )}

      {/* Table Area */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {loading ? (
          <table className="data-table" style={{ minWidth: 1200 }}>
            <tbody>
              {Array.from({ length: 10 }, (_, i) => (
                <SkeletonRow key={`skel-row-${i}`} cols={14} />
              ))}
            </tbody>
          </table>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div
              className="flex items-center gap-3 px-5 py-4 rounded-lg text-sm"
              style={{ background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}
              role="alert"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={loadRecords}>
              {t('إعادة المحاولة', 'Retry')}
            </button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)' }}>
              <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
            </svg>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {t('لا توجد سجلات', 'No Records Found')}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {globalFilter || statusFilter || deptFilter
                ? t('لا توجد نتائج مطابقة لمعايير التصفية الحالية.', 'No results match the current filter criteria.')
                : t('لم يتم إنشاء أي سجلات بعد. ابدأ بإنشاء سجل جديد.', 'No records have been created yet. Start by creating a new record.')}
            </div>
            {(globalFilter || statusFilter || deptFilter) && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setStatusFilter(''); setDeptFilter(''); setGlobalFilter(''); }}
              >
                {t('مسح التصفية', 'Clear Filters')}
              </button>
            )}
          </div>
        ) : (
          <table className="data-table" style={{ minWidth: 1400 }}>
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={`hg-${hg.id}`}>
                  {hg.headers.map(header => (
                    <th
                      key={`th-${header.id}`}
                      style={{
                        width: header.getSize(),
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        userSelect: 'none',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        background: 'var(--background)',
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                      aria-sort={
                        header.column.getIsSorted() === 'asc' ? 'ascending'
                        : header.column.getIsSorted() === 'desc' ? 'descending'
                        : undefined
                      }
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span style={{ color: header.column.getIsSorted() ? 'var(--accent)' : 'var(--text-disabled)' }}>
                            {header.column.getIsSorted() === 'asc' ? '↑' : header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
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
                <tr
                  key={`row-${row.original.id}`}
                  className={`group ${row.getIsSelected() ? 'selected' : ''}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={`cell-${row.original.id}-${cell.column.id}`}
                      style={{ padding: rowPadding, borderBottom: '1px solid var(--border-subtle)' }}
                    >
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
      {!loading && !error && filteredRecords.length > 0 && (
        <div
          className="flex items-center justify-between px-6 py-3 text-sm"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}
          role="navigation"
          aria-label={t('التنقل بين الصفحات', 'Pagination')}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span>{t('عرض', 'Show')}</span>
            <select
              className="input-base"
              style={{ width: 64, height: 28, padding: '0 6px', fontSize: 12 }}
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              aria-label={t('عدد الصفوف', 'Rows per page')}
            >
              {[10, 15, 25, 50].map(s => (
                <option key={`page-size-${s}`} value={s}>{s}</option>
              ))}
            </select>
            <span>
              {t(
                `من أصل ${filteredRecords.length} سجل`,
                `of ${filteredRecords.length} records`
              )}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label={t('الصفحة الأولى', 'First Page')}
            >«</button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label={t('الصفحة السابقة', 'Previous Page')}
            >‹</button>
            {Array.from({ length: Math.min(table.getPageCount(), 7) }, (_, i) => {
              const page = i + Math.max(0, table.getState().pagination.pageIndex - 3);
              if (page >= table.getPageCount()) return null;
              return (
                <button
                  key={`page-btn-${page}`}
                  className="btn btn-ghost btn-sm tabular-nums"
                  style={{
                    minWidth: 32,
                    background: table.getState().pagination.pageIndex === page ? 'var(--accent-subtle)' : undefined,
                    color: table.getState().pagination.pageIndex === page ? 'var(--accent)' : undefined,
                    fontWeight: table.getState().pagination.pageIndex === page ? 600 : undefined,
                  }}
                  onClick={() => table.setPageIndex(page)}
                  aria-label={t(`صفحة ${page + 1}`, `Page ${page + 1}`)}
                  aria-current={table.getState().pagination.pageIndex === page ? 'page' : undefined}
                >
                  {page + 1}
                </button>
              );
            })}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label={t('الصفحة التالية', 'Next Page')}
            >›</button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label={t('الصفحة الأخيرة', 'Last Page')}
            >»</button>
          </div>
        </div>
      )}

      {/* Row Detail Drawer */}
      {detailRecord && (
        <RowDetailDrawer
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

export default function RecordsPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <AppShell breadcrumbs={[{ label: 'عقل', href: '/' }, { label: 'السجلات' }]}>
      <RecordsContent />
    </AppShell>
  );
}