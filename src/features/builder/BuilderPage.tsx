'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppShell, { useApp } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadge';

import type { RecordType, RecordField, RecordSection, FieldType } from '@/mocks/types';
import { RECORD_TYPES } from '@/mocks/data';

// ─── Field Type Config ────────────────────────────────────────────────────────
const FIELD_TYPES: { type: FieldType; ar: string; en: string; icon: string }[] = [
  { type: 'text', ar: 'نص قصير', en: 'Short Text', icon: 'T' },
  { type: 'longtext', ar: 'نص طويل', en: 'Long Text', icon: '¶' },
  { type: 'number', ar: 'رقم', en: 'Number', icon: '#' },
  { type: 'date', ar: 'تاريخ', en: 'Date', icon: '📅' },
  { type: 'select', ar: 'قائمة منسدلة', en: 'Dropdown', icon: '▾' },
  { type: 'reference', ar: 'مرجع', en: 'Reference', icon: '🔗' },
  { type: 'user', ar: 'مستخدم', en: 'User', icon: '👤' },
  { type: 'attachment', ar: 'مرفق', en: 'Attachment', icon: '📎' },
  { type: 'classification', ar: 'تصنيف', en: 'Classification', icon: '🔒' },
  { type: 'status', ar: 'حالة', en: 'Status', icon: '◉' },
];

// ─── Authoring Mode ───────────────────────────────────────────────────────────
type AuthoringMode = 'structured' | 'canvas' | 'schema';

// ─── Inspector Panel ──────────────────────────────────────────────────────────
const Inspector = ({
  field,
  onChange,
  onClose,
  t,
  lang,
}: {
  field: RecordField | null;
  onChange: (f: RecordField) => void;
  onClose: () => void;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => {
  if (!field) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full text-center p-6"
        style={{ color: 'var(--text-muted)' }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3">
          <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
        <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {t('لم يتم تحديد حقل', 'No Field Selected')}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {t('انقر على حقل لعرض خصائصه وتعديلها', 'Click a field to view and edit its properties')}
        </div>
      </div>
    );
  }

  const fieldTypeCfg = FIELD_TYPES.find(ft => ft.type === field.type);

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex items-center justify-center text-xs font-bold rounded"
            style={{ width: 24, height: 24, background: 'var(--accent-subtle)', color: 'var(--accent)' }}
          >
            {fieldTypeCfg?.icon}
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('خصائص الحقل', 'Field Properties')}
          </span>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label={t('إغلاق', 'Close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {/* Label AR */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {t('التسمية (عربي)', 'Label (Arabic)')} <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            type="text"
            className="input-base"
            value={field.label.ar}
            onChange={e => onChange({ ...field, label: { ...field.label, ar: e.target.value } })}
            placeholder="مثال: اسم الموظف"
          />
        </div>

        {/* Label EN */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {t('التسمية (إنجليزي)', 'Label (English)')}
          </label>
          <input
            type="text"
            className="input-base"
            value={field.label.en}
            onChange={e => onChange({ ...field, label: { ...field.label, en: e.target.value } })}
            placeholder="e.g. Employee Name"
            dir="ltr"
          />
        </div>

        {/* Field Type */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {t('نوع الحقل', 'Field Type')}
          </label>
          <select
            className="input-base"
            value={field.type}
            onChange={e => onChange({ ...field, type: e.target.value as FieldType })}
          >
            {FIELD_TYPES.map(ft => (
              <option key={`ft-opt-${ft.type}`} value={ft.type}>
                {lang === 'ar' ? ft.ar : ft.en}
              </option>
            ))}
          </select>
        </div>

        {/* Required */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {t('حقل إلزامي', 'Required Field')}
          </label>
          <button
            role="switch"
            aria-checked={field.required}
            onClick={() => onChange({ ...field, required: !field.required })}
            className="rounded-full transition-colors"
            style={{
              width: 36,
              height: 20,
              background: field.required ? 'var(--accent)' : 'var(--gray-300)',
              position: 'relative',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span
              className="absolute rounded-full transition-all"
              style={{
                width: 14,
                height: 14,
                background: '#fff',
                top: 3,
                insetInlineStart: field.required ? 19 : 3,
              }}
            />
          </button>
        </div>

        {/* Help Text */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {t('نص المساعدة', 'Help Text')}
          </label>
          <textarea
            className="input-base"
            style={{ height: 64, resize: 'vertical' }}
            value={field.helpText?.ar || ''}
            onChange={e => onChange({ ...field, helpText: { ar: e.target.value, en: field.helpText?.en || '' } })}
            placeholder={t('وصف مختصر لمساعدة المستخدم...', 'Brief description to help the user...')}
          />
        </div>

        {/* Visibility Roles */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            {t('الظهور حسب الدور', 'Visibility by Role')}
          </label>
          {(['employee', 'supervisor', 'manager', 'system_admin'] as const).map(role => {
            const labels: Record<string, { ar: string; en: string }> = {
              employee: { ar: 'موظف', en: 'Employee' },
              supervisor: { ar: 'مشرف', en: 'Supervisor' },
              manager: { ar: 'مدير', en: 'Manager' },
              system_admin: { ar: 'مسؤول نظام', en: 'System Admin' },
            };
            const checked = field.visibilityRoles.includes(role);
            return (
              <label
                key={`vis-role-${role}`}
                className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange({
                    ...field,
                    visibilityRoles: checked
                      ? field.visibilityRoles.filter(r => r !== role)
                      : [...field.visibilityRoles, role],
                  })}
                  style={{ accentColor: 'var(--accent)' }}
                />
                {labels[role][lang]}
              </label>
            );
          })}
        </div>

        {/* Options (for select type) */}
        {field.type === 'select' && (
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('خيارات القائمة', 'Dropdown Options')}
            </label>
            <div className="space-y-1">
              {(field.options || []).map((opt, oi) => (
                <div key={`opt-${field.id}-${oi}`} className="flex gap-1">
                  <input
                    type="text"
                    className="input-base flex-1"
                    value={opt}
                    onChange={e => {
                      const opts = [...(field.options || [])];
                      opts[oi] = e.target.value;
                      onChange({ ...field, options: opts });
                    }}
                  />
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onChange({ ...field, options: (field.options || []).filter((_, i) => i !== oi) })}
                    aria-label={t('حذف الخيار', 'Remove Option')}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
              <button
                className="btn btn-ghost btn-sm text-xs w-full"
                onClick={() => onChange({ ...field, options: [...(field.options || []), ''] })}
              >
                + {t('إضافة خيار', 'Add Option')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Field Card ───────────────────────────────────────────────────────────────
const FieldCard = ({
  field,
  selected,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  t,
  lang,
}: {
  field: RecordField;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => {
  const ftCfg = FIELD_TYPES.find(f => f.type === field.type);
  return (
    <div
      className={`field-card ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect()}
      aria-pressed={selected}
      aria-label={`${t('حقل', 'Field')}: ${field.label.ar}`}
    >
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <span
          className="cursor-grab"
          style={{ color: 'var(--text-muted)' }}
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/>
            <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
            <circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
          </svg>
        </span>

        {/* Type Icon */}
        <span
          className="flex items-center justify-center text-xs font-bold rounded flex-shrink-0"
          style={{ width: 22, height: 22, background: 'var(--accent-subtle)', color: 'var(--accent)' }}
        >
          {ftCfg?.icon}
        </span>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {lang === 'ar' ? field.label.ar : field.label.en}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {lang === 'ar' ? ftCfg?.ar : ftCfg?.en}
            {field.required && (
              <span className="ms-1" style={{ color: 'var(--error)' }}>*</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="btn btn-ghost btn-sm"
            onClick={e => { e.stopPropagation(); onMoveUp(); }}
            aria-label={t('تحريك لأعلى', 'Move Up')}
          >↑</button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={e => { e.stopPropagation(); onMoveDown(); }}
            aria-label={t('تحريك لأسفل', 'Move Down')}
          >↓</button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={e => { e.stopPropagation(); onDelete(); }}
            aria-label={t('حذف الحقل', 'Delete Field')}
            style={{ color: 'var(--error-text)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Section Block ────────────────────────────────────────────────────────────
const SectionBlock = ({
  section,
  selectedFieldId,
  onSelectField,
  onAddField,
  onDeleteField,
  onMoveField,
  onUpdateField,
  t,
  lang,
}: {
  section: RecordSection;
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onAddField: (sectionId: string, type: FieldType) => void;
  onDeleteField: (sectionId: string, fieldId: string) => void;
  onMoveField: (sectionId: string, fieldId: string, dir: 'up' | 'down') => void;
  onUpdateField: (sectionId: string, field: RecordField) => void;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div
      className="rounded-lg mb-3"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      {/* Section Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer"
        style={{ borderBottom: collapsed ? 'none' : '1px solid var(--border)', borderRadius: collapsed ? 8 : '8px 8px 0 0', background: 'var(--background)' }}
        onClick={() => setCollapsed(c => !c)}
        role="button"
        aria-expanded={!collapsed}
        aria-label={`${t('قسم', 'Section')}: ${section.label.ar}`}
      >
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{collapsed ? '▶' : '▼'}</span>
        <div className="flex-1">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {lang === 'ar' ? section.label.ar : section.label.en}
          </span>
          <span className="text-xs ms-2" style={{ color: 'var(--text-muted)' }}>
            {section.fields.length} {t('حقل', 'fields')}
          </span>
        </div>
      </div>

      {/* Fields */}
      {!collapsed && (
        <div className="p-3 space-y-2">
          {section.fields.length === 0 && (
            <div
              className="text-center py-6 text-sm rounded-md"
              style={{ color: 'var(--text-muted)', border: '2px dashed var(--border)', background: 'var(--background)' }}
            >
              {t('لا توجد حقول في هذا القسم. أضف حقلاً من القائمة.', 'No fields in this section. Add a field from the palette.')}
            </div>
          )}
          {section.fields.map(field => (
            <div key={`field-card-${field.id}`} className="group">
              <FieldCard
                field={field}
                selected={selectedFieldId === field.id}
                onSelect={() => onSelectField(field.id)}
                onDelete={() => onDeleteField(section.id, field.id)}
                onMoveUp={() => onMoveField(section.id, field.id, 'up')}
                onMoveDown={() => onMoveField(section.id, field.id, 'down')}
                t={t}
                lang={lang}
              />
            </div>
          ))}

          {/* Add Field */}
          <div className="relative">
            <button
              className="btn btn-ghost btn-sm text-xs w-full"
              onClick={() => setShowAddMenu(v => !v)}
              aria-label={t('إضافة حقل', 'Add Field')}
            >
              + {t('إضافة حقل', 'Add Field')}
            </button>
            {showAddMenu && (
              <div
                className="absolute z-10 rounded-lg p-2"
                style={{
                  top: '100%',
                  insetInlineStart: 0,
                  insetInlineEnd: 0,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-2)',
                  marginTop: 4,
                }}
                role="menu"
              >
                <div className="grid grid-cols-2 gap-1">
                  {FIELD_TYPES.map(ft => (
                    <button
                      key={`add-ft-${section.id}-${ft.type}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-start hover:bg-gray-100"
                      style={{ color: 'var(--text-primary)', transition: 'background 150ms' }}
                      onClick={() => { onAddField(section.id, ft.type); setShowAddMenu(false); }}
                      role="menuitem"
                    >
                      <span style={{ color: 'var(--accent)' }}>{ft.icon}</span>
                      {lang === 'ar' ? ft.ar : ft.en}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Schema View ──────────────────────────────────────────────────────────────
const SchemaView = ({ recordType, t }: { recordType: RecordType | null; t: (ar: string, en: string) => string }) => {
  if (!recordType) return null;
  const schema = {
    id: recordType.id,
    name: recordType.name,
    status: recordType.status,
    sections: recordType.sections.map(s => ({
      id: s.id,
      label: s.label,
      fields: s.fields.map(f => ({
        id: f.id,
        type: f.type,
        label: f.label,
        required: f.required,
        visibilityRoles: f.visibilityRoles,
      })),
    })),
  };

  return (
    <div className="p-4 h-full overflow-auto scrollbar-thin">
      <div
        className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md text-xs"
        style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)' }}
        role="note"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        {t('عرض القراءة فقط — لا يمكن التعديل من هنا', 'Read-only view — editing not available here')}
      </div>
      <pre
        className="text-xs rounded-lg p-4 overflow-auto scrollbar-thin"
        style={{
          background: 'var(--gray-950)',
          color: '#a5f3fc',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.6,
        }}
        dir="ltr"
      >
        {JSON.stringify(schema, null, 2)}
      </pre>
    </div>
  );
};

// ─── Preview Modal ────────────────────────────────────────────────────────────
const PreviewModal = ({
  recordType,
  onClose,
  t,
  lang,
}: {
  recordType: RecordType;
  onClose: () => void;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: 'rgba(0,0,0,0.4)' }}
    role="dialog"
    aria-modal="true"
    aria-label={t('معاينة نموذج السجل', 'Record Form Preview')}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div
      className="rounded-xl flex flex-col"
      style={{
        width: '100%',
        maxWidth: 600,
        maxHeight: '85vh',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-2)',
        overflow: 'hidden',
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {lang === 'ar' ? recordType.name.ar : recordType.name.en}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t('معاينة النموذج', 'Form Preview')}
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label={t('إغلاق', 'Close')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
        {recordType.sections.map(section => (
          <div key={`prev-sec-${section.id}`}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? section.label.ar : section.label.en}
            </h3>
            <div className="space-y-3">
              {section.fields.map(field => {
                const ftCfg = FIELD_TYPES.find(f => f.type === field.type);
                return (
                  <div key={`prev-field-${field.id}`}>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? field.label.ar : field.label.en}
                      {field.required && <span className="ms-1" style={{ color: 'var(--error)' }}>*</span>}
                    </label>
                    {field.helpText && (
                      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                        {lang === 'ar' ? field.helpText.ar : field.helpText.en}
                      </p>
                    )}
                    {field.type === 'longtext' ? (
                      <textarea
                        className="input-base"
                        style={{ height: 72, resize: 'none' }}
                        placeholder={lang === 'ar' ? ftCfg?.ar : ftCfg?.en}
                        disabled
                      />
                    ) : field.type === 'select' ? (
                      <select className="input-base" disabled>
                        <option>{t('اختر...', 'Select...')}</option>
                      </select>
                    ) : field.type === 'attachment' ? (
                      <div
                        className="flex items-center justify-center rounded-md text-sm"
                        style={{ height: 48, border: '2px dashed var(--border)', color: 'var(--text-muted)', background: 'var(--background)' }}
                      >
                        {t('رفع ملف...', 'Upload file...')}
                      </div>
                    ) : (
                      <input
                        type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                        className="input-base"
                        placeholder={lang === 'ar' ? ftCfg?.ar : ftCfg?.en}
                        disabled
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-primary btn-md flex-1" disabled>
          {t('حفظ (معاينة)', 'Save (Preview)')}
        </button>
        <button className="btn btn-secondary btn-md" onClick={onClose}>
          {t('إغلاق', 'Close')}
        </button>
      </div>
    </div>
  </div>
);

// ─── Builder Content ──────────────────────────────────────────────────────────
function BuilderContent() {
  const { lang, t, simMode, simRole } = useApp();
  const [recordTypes, setRecordTypes] = useState<RecordType[]>(RECORD_TYPES);
  const [selectedTypeId, setSelectedTypeId] = useState<string>(RECORD_TYPES[0].id);
  const [activeMode, setActiveMode] = useState<AuthoringMode>('structured');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [history, setHistory] = useState<RecordType[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isReadOnly = simRole === 'employee' || simRole === 'supervisor';

  const selectedType = recordTypes.find(rt => rt.id === selectedTypeId) || recordTypes[0];

  const pushHistory = useCallback((types: RecordType[]) => {
    setHistory(h => [...h.slice(0, historyIndex + 1), types].slice(-10));
    setHistoryIndex(i => Math.min(i + 1, 9));
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setRecordTypes(history[historyIndex - 1]);
      setHistoryIndex(i => i - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setRecordTypes(history[historyIndex + 1]);
      setHistoryIndex(i => i + 1);
    }
  };

  const updateSelectedType = (updater: (rt: RecordType) => RecordType) => {
    const updated = recordTypes.map(rt => rt.id === selectedTypeId ? updater(rt) : rt);
    pushHistory(updated);
    setRecordTypes(updated);
  };

  const addSection = () => {
    updateSelectedType(rt => ({
      ...rt,
      sections: [...rt.sections, {
        id: `sec-new-${Date.now()}`,
        label: { ar: `قسم جديد ${rt.sections.length + 1}`, en: `New Section ${rt.sections.length + 1}` },
        fields: [],
        order: rt.sections.length,
      }],
    }));
  };

  const addField = (sectionId: string, type: FieldType) => {
    const ftCfg = FIELD_TYPES.find(f => f.type === type)!;
    const newField: RecordField = {
      id: `f-new-${Date.now()}`,
      type,
      label: { ar: lang === 'ar' ? ftCfg.ar : ftCfg.ar, en: ftCfg.en },
      required: false,
      validationRules: [],
      visibilityRoles: ['employee', 'supervisor', 'manager', 'system_admin'],
      order: 0,
    };
    updateSelectedType(rt => ({
      ...rt,
      sections: rt.sections.map(s =>
        s.id === sectionId ? { ...s, fields: [...s.fields, newField] } : s
      ),
    }));
    setSelectedFieldId(newField.id);
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    updateSelectedType(rt => ({
      ...rt,
      sections: rt.sections.map(s =>
        s.id === sectionId ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) } : s
      ),
    }));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  };

  const moveField = (sectionId: string, fieldId: string, dir: 'up' | 'down') => {
    updateSelectedType(rt => ({
      ...rt,
      sections: rt.sections.map(s => {
        if (s.id !== sectionId) return s;
        const idx = s.fields.findIndex(f => f.id === fieldId);
        if (idx < 0) return s;
        const newFields = [...s.fields];
        const target = dir === 'up' ? idx - 1 : idx + 1;
        if (target < 0 || target >= newFields.length) return s;
        [newFields[idx], newFields[target]] = [newFields[target], newFields[idx]];
        return { ...s, fields: newFields };
      }),
    }));
  };

  const updateField = (sectionId: string, field: RecordField) => {
    updateSelectedType(rt => ({
      ...rt,
      sections: rt.sections.map(s =>
        s.id === sectionId ? { ...s, fields: s.fields.map(f => f.id === field.id ? field : f) } : s
      ),
    }));
  };

  const getSelectedField = (): RecordField | null => {
    if (!selectedFieldId || !selectedType) return null;
    for (const s of selectedType.sections) {
      const f = s.fields.find(f => f.id === selectedFieldId);
      if (f) return f;
    }
    return null;
  };

  const getSelectedFieldSection = (): string | null => {
    if (!selectedFieldId || !selectedType) return null;
    for (const s of selectedType.sections) {
      if (s.fields.find(f => f.id === selectedFieldId)) return s.id;
    }
    return null;
  };

  const validate = (): string[] => {
    const errors: string[] = [];
    const totalFields = selectedType.sections.reduce((acc, s) => acc + s.fields.length, 0);
    if (totalFields === 0) errors.push(t('لا يمكن حفظ نوع سجل بدون حقول', 'Cannot save a record type with no fields'));
    if (!selectedType.name.ar.trim()) errors.push(t('اسم نوع السجل مطلوب', 'Record type name is required'));

    // Check for duplicate field names
    const allLabels: string[] = [];
    selectedType.sections.forEach(s => {
      s.fields.forEach(f => {
        if (allLabels.includes(f.label.ar)) {
          errors.push(t(`حقل مكرر: ${f.label.ar}`, `Duplicate field: ${f.label.ar}`));
        }
        allLabels.push(f.label.ar);
      });
    });
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setSaving(true);
    // Backend integration point: PUT /api/record-types/:id
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Type List Panel */}
      <div
        className="flex flex-col"
        style={{
          width: 220,
          flexShrink: 0,
          borderInlineEnd: '1px solid var(--border)',
          background: 'var(--surface)',
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {t('أنواع السجلات', 'Record Types')}
          </span>
          {!isReadOnly && (
            <button
              className="btn btn-ghost btn-sm"
              aria-label={t('نوع جديد', 'New Type')}
              onClick={() => {
                const newType: RecordType = {
                  id: `rt-new-${Date.now()}`,
                  name: { ar: 'نوع جديد', en: 'New Type' },
                  description: { ar: '', en: '' },
                  sections: [],
                  status: 'draft',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  createdBy: 'user-001',
                };
                setRecordTypes(ts => [...ts, newType]);
                setSelectedTypeId(newType.id);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {recordTypes.map(rt => (
            <button
              key={`rt-list-${rt.id}`}
              className="w-full text-start px-3 py-2 rounded-md mb-1 text-sm transition-colors"
              style={{
                background: rt.id === selectedTypeId ? 'var(--accent-subtle)' : 'transparent',
                color: rt.id === selectedTypeId ? 'var(--accent)' : 'var(--text-primary)',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedTypeId(rt.id)}
              aria-pressed={rt.id === selectedTypeId}
            >
              <div className="font-medium truncate">{lang === 'ar' ? rt.name.ar : rt.name.en}</div>
              <div className="mt-0.5">
                <StatusBadge status={rt.status} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Builder Toolbar */}
        <div
          className="flex items-center gap-2 px-4 py-2"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}
        >
          {/* Type name */}
          <input
            type="text"
            className="input-base font-semibold"
            style={{ width: 220, height: 32 }}
            value={lang === 'ar' ? selectedType.name.ar : selectedType.name.en}
            onChange={e => updateSelectedType(rt => ({
              ...rt,
              name: lang === 'ar' ? { ...rt.name, ar: e.target.value } : { ...rt.name, en: e.target.value },
            }))}
            disabled={isReadOnly}
            aria-label={t('اسم نوع السجل', 'Record Type Name')}
          />

          {/* Mode Tabs */}
          <div
            className="flex rounded-md overflow-hidden ms-2"
            style={{ border: '1px solid var(--border)' }}
            role="tablist"
            aria-label={t('وضع التأليف', 'Authoring Mode')}
          >
            {([
              { id: 'structured', ar: 'منظم', en: 'Structured', icon: '≡' },
              { id: 'canvas', ar: 'مرئي', en: 'Visual', icon: '⬡' },
              { id: 'schema', ar: 'مخطط', en: 'Schema', icon: '{}' },
            ] as { id: AuthoringMode; ar: string; en: string; icon: string }[]).map(mode => (
              <button
                key={`mode-tab-${mode.id}`}
                role="tab"
                aria-selected={activeMode === mode.id}
                onClick={() => setActiveMode(mode.id)}
                className="px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  background: activeMode === mode.id ? 'var(--accent)' : 'var(--surface)',
                  color: activeMode === mode.id ? 'var(--accent-foreground)' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {mode.icon} {lang === 'ar' ? mode.ar : mode.en}
              </button>
            ))}
          </div>

          <div className="ms-auto flex items-center gap-2">
            {/* Undo/Redo */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={undo}
              disabled={historyIndex <= 0}
              aria-label={t('تراجع', 'Undo')}
              title={t('تراجع (Ctrl+Z)', 'Undo (Ctrl+Z)')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              aria-label={t('إعادة', 'Redo')}
              title={t('إعادة (Ctrl+Y)', 'Redo (Ctrl+Y)')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
            </button>

            {/* Preview */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowPreview(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {t('معاينة', 'Preview')}
            </button>

            {/* Save */}
            {!isReadOnly && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    {t('جارٍ الحفظ...', 'Saving...')}
                  </>
                ) : saveSuccess ? (
                  <>✓ {t('تم الحفظ', 'Saved')}</>
                ) : (
                  t('حفظ', 'Save')
                )}
              </button>
            )}
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div
            className="flex items-start gap-3 px-4 py-3 text-sm"
            style={{ background: 'var(--error-bg)', color: 'var(--error-text)', borderBottom: '1px solid var(--error-border)', flexShrink: 0 }}
            role="alert"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              {validationErrors.map((err, ei) => (
                <div key={`val-err-${ei}`}>{err}</div>
              ))}
            </div>
            <button onClick={() => setValidationErrors([])} className="ms-auto btn btn-ghost btn-sm">×</button>
          </div>
        )}

        {/* Permission Banner */}
        {isReadOnly && (
          <div
            className="flex items-center gap-2 px-4 py-2 text-xs"
            style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', borderBottom: '1px solid var(--warning-border)', flexShrink: 0 }}
            role="note"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            {t('وضع القراءة — دورك لا يتيح التعديل على أنواع السجلات.', 'Read-only mode — your role does not allow editing record types.')}
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main editing area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            {activeMode === 'structured' && (
              <div>
                {selectedType.sections.length === 0 && (
                  <div
                    className="text-center py-12 rounded-lg text-sm mb-4"
                    style={{ border: '2px dashed var(--border)', color: 'var(--text-muted)', background: 'var(--background)' }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }}>
                      <rect width="18" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/>
                    </svg>
                    <div className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                      {t('لا توجد أقسام', 'No Sections')}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {t('أضف قسماً لبدء بناء نوع السجل', 'Add a section to start building the record type')}
                    </div>
                  </div>
                )}
                {selectedType.sections.map(section => (
                  <SectionBlock
                    key={`section-block-${section.id}`}
                    section={section}
                    selectedFieldId={selectedFieldId}
                    onSelectField={setSelectedFieldId}
                    onAddField={addField}
                    onDeleteField={deleteField}
                    onMoveField={moveField}
                    onUpdateField={updateField}
                    t={t}
                    lang={lang}
                  />
                ))}
                {!isReadOnly && (
                  <button
                    className="btn btn-secondary btn-sm w-full"
                    onClick={addSection}
                  >
                    + {t('إضافة قسم', 'Add Section')}
                  </button>
                )}
              </div>
            )}

            {activeMode === 'canvas' && (
              <div>
                <div
                  className="mb-3 px-3 py-2 rounded-md text-xs flex items-center gap-2"
                  style={{ background: 'var(--info-bg)', color: 'var(--info-text)', border: '1px solid var(--info-border)' }}
                  role="note"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  {t('العرض المرئي — انقر على حقل لتحريره في لوحة الخصائص', 'Visual canvas — click a field to edit in the inspector panel')}
                </div>
                {selectedType.sections.map(section => (
                  <div
                    key={`canvas-sec-${section.id}`}
                    className="mb-4 rounded-lg"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
                  >
                    <div
                      className="px-4 py-2 text-sm font-semibold"
                      style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)', borderRadius: '8px 8px 0 0', color: 'var(--text-secondary)' }}
                    >
                      {lang === 'ar' ? section.label.ar : section.label.en}
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-2">
                      {section.fields.map(field => {
                        const ftCfg = FIELD_TYPES.find(f => f.type === field.type);
                        return (
                          <div
                            key={`canvas-field-${field.id}`}
                            className="rounded-md px-3 py-2 cursor-pointer transition-all"
                            style={{
                              background: selectedFieldId === field.id ? 'var(--accent-subtle)' : 'var(--background)',
                              border: `1px solid ${selectedFieldId === field.id ? 'var(--accent)' : 'var(--border)'}`,
                            }}
                            onClick={() => setSelectedFieldId(field.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && setSelectedFieldId(field.id)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs" style={{ color: 'var(--accent)' }}>{ftCfg?.icon}</span>
                              <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                {lang === 'ar' ? field.label.ar : field.label.en}
                              </span>
                              {field.required && <span className="ms-auto text-xs" style={{ color: 'var(--error)' }}>*</span>}
                            </div>
                            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {lang === 'ar' ? ftCfg?.ar : ftCfg?.en}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeMode === 'schema' && (
              <SchemaView recordType={selectedType} t={t} />
            )}
          </div>

          {/* Inspector Panel */}
          {activeMode !== 'schema' && (
            <div
              className="flex flex-col"
              style={{
                width: 280,
                flexShrink: 0,
                borderInlineStart: '1px solid var(--border)',
                background: 'var(--surface)',
                overflow: 'hidden',
              }}
            >
              <Inspector
                field={getSelectedField()}
                onChange={field => {
                  const sectionId = getSelectedFieldSection();
                  if (sectionId) updateField(sectionId, field);
                }}
                onClose={() => setSelectedFieldId(null)}
                t={t}
                lang={lang}
              />
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          recordType={selectedType}
          onClose={() => setShowPreview(false)}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

export default function BuilderPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <AppShell breadcrumbs={[
      { label: 'عقل', href: '/' },
      { label: 'السجلات', href: '/enterprise-data-table-record-list' },
      { label: 'منشئ أنواع السجلات' },
    ]}>
      <BuilderContent />
    </AppShell>
  );
}