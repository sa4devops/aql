'use client';
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import AppShell, { useApp } from '@/components/AppShell';
import { WORKFLOWS, RECORD_TYPES } from '@/mocks/data';
import type { Workflow, WorkflowNode, WorkflowEdge, WorkflowNodeType, WorkflowActionType } from '@/mocks/types';
import { ROUTES } from '@/app-routes/routes';
import { useRouter } from 'next/navigation';

// Dynamic import for React Flow (browser-only)
const ReactFlowCanvas = dynamic(() => import('./ReactFlowCanvas'), { ssr: false });

// ─── Node Type Config ─────────────────────────────────────────────────────────
export const NODE_TYPE_CONFIG: Record<WorkflowNodeType, { ar: string; en: string; color: string; icon: string }> = {
  start: { ar: 'بدء', en: 'Start', color: 'var(--success)', icon: '▶' },
  task: { ar: 'مهمة/اعتماد', en: 'Task/Approval', color: 'var(--accent)', icon: '✓' },
  condition: { ar: 'شرط/تفريع', en: 'Condition', color: 'var(--warning)', icon: '◇' },
  action: { ar: 'إجراء', en: 'Action', color: 'var(--info)', icon: '⚡' },
  notification: { ar: 'إشعار', en: 'Notification', color: 'var(--gray-500)', icon: '🔔' },
  end: { ar: 'انتهاء', en: 'End', color: 'var(--error)', icon: '■' },
};

// ─── Action Type Config ───────────────────────────────────────────────────────
const ACTION_TYPE_CONFIG: Record<WorkflowActionType, { ar: string; en: string; icon: string; description: { ar: string; en: string } }> = {
  manual_task: {
    ar: 'مهمة يدوية',
    en: 'Manual Task',
    icon: '👤',
    description: { ar: 'مهمة تتطلب تدخلاً بشرياً مباشراً', en: 'Task requiring direct human intervention' },
  },
  automated_task: {
    ar: 'مهمة آلية',
    en: 'Automated Task',
    icon: '⚙️',
    description: { ar: 'مهمة تُنفَّذ تلقائياً بواسطة النظام', en: 'Task executed automatically by the system' },
  },
  external_integration: {
    ar: 'تكامل خارجي',
    en: 'External Integration',
    icon: '🔗',
    description: { ar: 'استدعاء خدمة أو جهة خارجية عبر API', en: 'Call an external service or third-party via API' },
  },
  llm_prompt: {
    ar: 'مهمة ذكاء اصطناعي (LLM)',
    en: 'AI / LLM Task',
    icon: '🤖',
    description: { ar: 'إرسال برومت إلى نموذج لغوي لتنفيذ مهمة', en: 'Send a prompt to an LLM to perform a task' },
  },
};

// ─── Workflow Node Inspector ──────────────────────────────────────────────────
const NodeInspector = ({
  node,
  onUpdate,
  onClose,
  t,
  lang,
}: {
  node: WorkflowNode;
  onUpdate: (n: WorkflowNode) => void;
  onClose: () => void;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => {
  const cfg = NODE_TYPE_CONFIG[node.type];
  const roleLabels: Record<string, { ar: string; en: string }> = {
    employee: { ar: 'موظف', en: 'Employee' },
    supervisor: { ar: 'مشرف', en: 'Supervisor' },
    manager: { ar: 'مدير', en: 'Manager' },
    system_admin: { ar: 'مسؤول نظام', en: 'System Admin' },
  };

  const showActionType = node.type !== 'start' && node.type !== 'end';
  const selectedActionTypeCfg = node.actionType ? ACTION_TYPE_CONFIG[node.actionType] : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex items-center justify-center text-xs font-bold rounded"
            style={{ width: 24, height: 24, background: `color-mix(in srgb, ${cfg.color} 15%, transparent)`, color: cfg.color }}
          >
            {cfg.icon}
          </span>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {t('خصائص العنصر', 'Element Properties')}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {lang === 'ar' ? cfg.ar : cfg.en} · {node.id}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label={t('إغلاق', 'Close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {/* Name AR */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {t('الاسم (عربي)', 'Name (Arabic)')} <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            type="text"
            className="input-base"
            value={node.label.ar}
            onChange={e => onUpdate({ ...node, label: { ...node.label, ar: e.target.value } })}
          />
        </div>

        {/* Name EN */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {t('الاسم (إنجليزي)', 'Name (English)')}
          </label>
          <input
            type="text"
            className="input-base"
            value={node.label.en}
            onChange={e => onUpdate({ ...node, label: { ...node.label, en: e.target.value } })}
            dir="ltr"
          />
        </div>

        {/* Node Type (read-only display) */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {t('نوع العنصر', 'Element Type')}
          </label>
          <div
            className="input-base flex items-center gap-2"
            style={{ background: 'var(--background)', cursor: 'default' }}
          >
            <span style={{ color: cfg.color }}>{cfg.icon}</span>
            <span>{lang === 'ar' ? cfg.ar : cfg.en}</span>
          </div>
        </div>

        {/* ── Action Type ── */}
        {showActionType && (
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('نوع الإجراء', 'Action Type')}
            </label>
            <div className="space-y-1">
              {(Object.entries(ACTION_TYPE_CONFIG) as [WorkflowActionType, typeof ACTION_TYPE_CONFIG[WorkflowActionType]][]).map(([type, atCfg]) => (
                <button
                  key={`at-${type}`}
                  type="button"
                  onClick={() => onUpdate({ ...node, actionType: type, llmPrompt: type !== 'llm_prompt' ? undefined : node.llmPrompt, integrationTarget: type !== 'external_integration' ? undefined : node.integrationTarget })}
                  className="w-full flex items-start gap-2 px-3 py-2 rounded-md text-start transition-colors"
                  style={{
                    border: `1px solid ${node.actionType === type ? 'var(--accent)' : 'var(--border)'}`,
                    background: node.actionType === type ? 'var(--accent-subtle)' : 'var(--background)',
                    cursor: 'pointer',
                  }}
                >
                  <span className="text-sm mt-0.5">{atCfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: node.actionType === type ? 'var(--accent)' : 'var(--text-primary)' }}>
                      {lang === 'ar' ? atCfg.ar : atCfg.en}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {lang === 'ar' ? atCfg.description.ar : atCfg.description.en}
                    </div>
                  </div>
                  {node.actionType === type && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </button>
              ))}
            </div>

            {/* LLM Prompt field */}
            {node.actionType === 'llm_prompt' && (
              <div className="mt-3">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {t('البرومت (Prompt)', 'Prompt')} <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <textarea
                  className="input-base"
                  rows={4}
                  value={node.llmPrompt || ''}
                  onChange={e => onUpdate({ ...node, llmPrompt: e.target.value })}
                  placeholder={t('اكتب التعليمات التي سيُرسلها النظام إلى النموذج اللغوي...', 'Write the instructions to be sent to the LLM...')}
                  dir="auto"
                  style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {t('سيُرسل هذا البرومت إلى نموذج الذكاء الاصطناعي عند تنفيذ هذه الخطوة', 'This prompt will be sent to the AI model when this step executes')}
                </div>
              </div>
            )}

            {/* External Integration target */}
            {node.actionType === 'external_integration' && (
              <div className="mt-3">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {t('الجهة / الخدمة الخارجية', 'External Service / Target')}
                </label>
                <input
                  type="text"
                  className="input-base"
                  value={node.integrationTarget || ''}
                  onChange={e => onUpdate({ ...node, integrationTarget: e.target.value })}
                  placeholder={t('مثال: SAP، Salesforce، REST API...', 'e.g. SAP, Salesforce, REST API...')}
                  dir="auto"
                />
              </div>
            )}
          </div>
        )}

        {/* ── Linked Record Type ── */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {t('نوع السجل المرتبط', 'Linked Record Type')}
          </label>
          {/*
           * AGENT NOTE (2026-07-15):
           * السجل المرتبط يُعرَّف بالرقم المرجعي (rt.id) وليس بالاسم فقط.
           * القيمة المحفوظة في node.linkedRecordType هي rt.id (الرقم المرجعي).
           * يجب دائماً عرض الرقم المرجعي بجانب الاسم في واجهة الاختيار
           * حتى يتمكن المستخدم من التعرف على السجل بدقة.
           *
           * AGENT NOTE (EN):
           * The linked record is identified by its reference number (rt.id), not just its name.
           * The value stored in node.linkedRecordType is rt.id (the reference number).
           * Always display the reference ID alongside the name in the select UI
           * so the user can accurately identify the record type.
           */}
          <input
            type="text"
            className="input-base"
            value={node.linkedRecordType || ''}
            onChange={e => onUpdate({ ...node, linkedRecordType: e.target.value || undefined })}
            placeholder={t('أدخل رقم السجل (مثال: rt-001)', 'Enter record ID (e.g. rt-001)')}
            dir="ltr"
          />
          {(() => {
            const matched = node.linkedRecordType
              ? RECORD_TYPES.find(rt => rt.id === node.linkedRecordType)
              : null;
            if (node.linkedRecordType && matched) {
              return (
                <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--color-success, #16a34a)' }}>
                  <span>✓</span>
                  <span>{lang === 'ar' ? matched.name.ar : matched.name.en}</span>
                </div>
              );
            }
            if (node.linkedRecordType && !matched) {
              return (
                <div className="text-xs mt-1" style={{ color: 'var(--color-danger, #dc2626)' }}>
                  {t('رقم السجل غير موجود', 'Record ID not found')}
                </div>
              );
            }
            return (
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {t('أدخل رقم السجل للربط التلقائي', 'Enter a record ID to auto-link')}
              </div>
            );
          })()}
          {node.linkedRecordType && (
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {t('سيعمل هذا الإجراء على سجلات من هذا النوع', 'This action will operate on records of this type')}
            </div>
          )}
        </div>

        {/* Assigned Role (for task nodes) */}
        {(node.type === 'task' || node.type === 'action') && (
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('الدور المسؤول', 'Responsible Role')}
            </label>
            <select
              className="input-base"
              value={node.assignedRole || ''}
              onChange={e => onUpdate({ ...node, assignedRole: e.target.value as WorkflowNode['assignedRole'] })}
            >
              <option value="">{t('— اختر دوراً —', '— Select Role —')}</option>
              {Object.entries(roleLabels).map(([role, labels]) => (
                <option key={`role-opt-${role}`} value={role}>
                  {labels[lang]}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Deadline / SLA (for task nodes) */}
        {node.type === 'task' && (
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('المهلة الزمنية (ساعات)', 'Deadline (hours)')}
            </label>
            <input
              type="number"
              className="input-base"
              value={node.deadline || ''}
              min={0}
              onChange={e => onUpdate({ ...node, deadline: e.target.value ? Number(e.target.value) : undefined })}
              placeholder={t('مثال: 48', 'e.g. 48')}
            />
          </div>
        )}

        {/* Conditions (for condition nodes) */}
        {node.type === 'condition' && (
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              {t('شروط التفرع', 'Branch Conditions')}
            </label>
            <div className="space-y-1">
              {(node.conditions || []).map((cond, ci) => (
                <div key={`cond-${node.id}-${ci}`} className="flex gap-1">
                  <input
                    type="text"
                    className="input-base flex-1"
                    value={cond}
                    onChange={e => {
                      const conds = [...(node.conditions || [])];
                      conds[ci] = e.target.value;
                      onUpdate({ ...node, conditions: conds });
                    }}
                    placeholder={t('شرط...', 'Condition...')}
                  />
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onUpdate({ ...node, conditions: (node.conditions || []).filter((_, i) => i !== ci) })}
                    aria-label={t('حذف الشرط', 'Remove Condition')}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
              <button
                className="btn btn-ghost btn-sm text-xs w-full"
                onClick={() => onUpdate({ ...node, conditions: [...(node.conditions || []), ''] })}
              >
                + {t('إضافة شرط', 'Add Condition')}
              </button>
            </div>
          </div>
        )}

        {/* Position info */}
        <div
          className="rounded-md p-3 text-xs"
          style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
        >
          <div className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {t('الموضع على اللوحة', 'Canvas Position')}
          </div>
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            X: {Math.round(node.position.x)}, Y: {Math.round(node.position.y)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Edge Inspector ───────────────────────────────────────────────────────────
const EdgeInspector = ({
  edge,
  onUpdate,
  onClose,
  t,
  lang,
}: {
  edge: WorkflowEdge;
  onUpdate: (e: WorkflowEdge) => void;
  onClose: () => void;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => (
  <div className="flex flex-col h-full">
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center text-xs font-bold rounded"
          style={{ width: 24, height: 24, background: 'var(--info-bg)', color: 'var(--info)' }}
        >
          →
        </span>
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('خصائص الرابط', 'Connection Properties')}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {edge.source} → {edge.target}
          </div>
        </div>
      </div>
      <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label={t('إغلاق', 'Close')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
      {/* Label AR */}
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {t('اسم الانتقال (عربي)', 'Transition Name (Arabic)')}
        </label>
        <input
          type="text"
          className="input-base"
          value={edge.label?.ar || ''}
          onChange={e => onUpdate({ ...edge, label: { ar: e.target.value, en: edge.label?.en || '' } })}
          placeholder={t('مثال: موافق', 'e.g. Approved')}
        />
      </div>

      {/* Label EN */}
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {t('اسم الانتقال (إنجليزي)', 'Transition Name (English)')}
        </label>
        <input
          type="text"
          className="input-base"
          value={edge.label?.en || ''}
          onChange={e => onUpdate({ ...edge, label: { ar: edge.label?.ar || '', en: e.target.value } })}
          dir="ltr"
          placeholder="e.g. Approved"
        />
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {t('شرط الانتقال', 'Transition Condition')}
        </label>
        <input
          type="text"
          className="input-base"
          value={edge.condition || ''}
          onChange={e => onUpdate({ ...edge, condition: e.target.value })}
          placeholder={t('مثال: status === "approved"', 'e.g. status === "approved"')}
          dir="ltr"
        />
      </div>

      {/* Connection info */}
      <div
        className="rounded-md p-3 text-xs"
        style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
      >
        <div className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          {t('معلومات الرابط', 'Connection Info')}
        </div>
        <div className="space-y-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <div>{t('من:', 'From:')} {edge.source}</div>
          <div>{t('إلى:', 'To:')} {edge.target}</div>
          <div>ID: {edge.id}</div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Empty Inspector ──────────────────────────────────────────────────────────
const EmptyInspector = ({ t }: { t: (ar: string, en: string) => string }) => (
  <div
    className="flex flex-col items-center justify-center h-full text-center p-6"
    style={{ color: 'var(--text-muted)' }}
  >
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
    <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
      {t('لم يتم تحديد عنصر', 'No Element Selected')}
    </div>
    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
      {t('انقر على عقدة أو رابط لعرض خصائصه وتعديلها', 'Click a node or edge to view and edit its properties')}
    </div>
  </div>
);

// ─── Workflow Selector ────────────────────────────────────────────────────────
const WorkflowSelector = ({
  workflows,
  selectedId,
  onSelect,
  onNew,
  t,
  lang,
}: {
  workflows: Workflow[];
  selectedId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => (
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
        {t('مسارات العمل', 'Workflows')}
      </span>
      <button
        className="btn btn-ghost btn-sm"
        onClick={onNew}
        aria-label={t('مسار جديد', 'New Workflow')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
    <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
      {workflows.map(wf => (
        <button
          key={`wf-sel-${wf.id}`}
          className="w-full text-start px-3 py-2 rounded-md mb-1 text-sm transition-colors"
          style={{
            background: wf.id === selectedId ? 'var(--accent-subtle)' : 'transparent',
            color: wf.id === selectedId ? 'var(--accent)' : 'var(--text-primary)',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => onSelect(wf.id)}
          aria-pressed={wf.id === selectedId}
        >
          <div className="font-medium truncate">{lang === 'ar' ? wf.name.ar : wf.name.en}</div>
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className="badge text-xs"
              style={{
                background: wf.status === 'published' ? 'var(--success-bg)' : 'var(--gray-100)',
                color: wf.status === 'published' ? 'var(--success-text)' : 'var(--gray-600)',
              }}
            >
              {wf.status === 'published' ? t('منشور', 'Published') : t('مسودة', 'Draft')}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {wf.nodes.length} {t('عقدة', 'nodes')}
            </span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

// ─── Node Palette ─────────────────────────────────────────────────────────────
export const NodePalette = ({
  t,
  lang,
  onDragStart,
}: {
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
  onDragStart: (type: WorkflowNodeType) => void;
}) => (
  <div
    className="flex flex-col"
    style={{
      width: 180,
      flexShrink: 0,
      borderInlineEnd: '1px solid var(--border)',
      background: 'var(--surface)',
      overflow: 'hidden',
    }}
  >
    <div
      className="px-3 py-3"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
        {t('أنواع العقد', 'Node Types')}
      </span>
    </div>
    <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
      {(Object.entries(NODE_TYPE_CONFIG) as [WorkflowNodeType, typeof NODE_TYPE_CONFIG[WorkflowNodeType]][]).map(([type, cfg]) => (
        <div
          key={`palette-${type}`}
          draggable
          onDragStart={() => onDragStart(type)}
          className="flex items-center gap-2 px-3 py-2 rounded-md cursor-grab text-sm transition-colors"
          style={{
            border: `1px solid var(--border)`,
            background: 'var(--background)',
            color: 'var(--text-primary)',
          }}
          role="button"
          tabIndex={0}
          aria-label={`${t('سحب عقدة', 'Drag node')}: ${cfg[lang]}`}
        >
          <span
            className="flex-shrink-0 flex items-center justify-center rounded text-xs font-bold"
            style={{ width: 22, height: 22, background: `color-mix(in srgb, ${cfg.color} 15%, transparent)`, color: cfg.color }}
          >
            {cfg.icon}
          </span>
          <span className="text-xs font-medium">{lang === 'ar' ? cfg.ar : cfg.en}</span>
        </div>
      ))}
    </div>
    <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {t('اسحب العقد إلى اللوحة', 'Drag nodes to canvas')}
      </div>
    </div>
  </div>
);

// ─── Workflow Management Toolbar ──────────────────────────────────────────────
type WorkflowRunState = 'idle' | 'running' | 'paused' | 'archived';

const WorkflowManagementBar = ({
  workflow,
  runState,
  onRun,
  onPause,
  onStop,
  onArchive,
  t,
  lang,
}: {
  workflow: Workflow;
  runState: WorkflowRunState;
  onRun: () => void;
  onPause: () => void;
  onStop: () => void;
  onArchive: () => void;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}) => {
  const statusConfig: Record<WorkflowRunState, { label: { ar: string; en: string }; color: string; bg: string; dot: string }> = {
    idle: { label: { ar: 'جاهز', en: 'Ready' }, color: '#64748b', bg: '#f1f5f9', dot: '#94a3b8' },
    running: { label: { ar: 'قيد التشغيل', en: 'Running' }, color: '#16a34a', bg: '#dcfce7', dot: '#22c55e' },
    paused: { label: { ar: 'متوقف مؤقتاً', en: 'Paused' }, color: '#d97706', bg: '#fef3c7', dot: '#f59e0b' },
    archived: { label: { ar: 'مؤرشف', en: 'Archived' }, color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af' },
  };

  const sc = statusConfig[runState];

  return (
    <div
      className="flex items-center gap-2 px-4 py-2"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        flexShrink: 0,
      }}
    >
      {/* Status indicator */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
        style={{ background: sc.bg, color: sc.color }}
      >
        <span
          className="rounded-full"
          style={{
            width: 7,
            height: 7,
            background: sc.dot,
            display: 'inline-block',
            boxShadow: runState === 'running' ? `0 0 0 3px ${sc.dot}40` : undefined,
          }}
        />
        {lang === 'ar' ? sc.label.ar : sc.label.en}
      </div>

      <div className="w-px h-4" style={{ background: 'var(--border)' }} />

      {/* Run */}
      <button
        className="btn btn-sm flex items-center gap-1.5"
        onClick={onRun}
        disabled={runState === 'running' || runState === 'archived'}
        title={t('تشغيل المسار', 'Run Workflow')}
        style={{
          background: runState === 'running' ? 'var(--success-bg)' : undefined,
          color: runState === 'running' ? 'var(--success-text)' : undefined,
          borderColor: runState === 'running' ? 'var(--success-border)' : undefined,
          opacity: runState === 'archived' ? 0.4 : 1,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span className="text-xs">{t('تشغيل', 'Run')}</span>
      </button>

      {/* Pause */}
      <button
        className="btn btn-sm flex items-center gap-1.5"
        onClick={onPause}
        disabled={runState !== 'running'}
        title={t('إيقاف مؤقت', 'Pause')}
        style={{ opacity: runState !== 'running' ? 0.4 : 1 }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        <span className="text-xs">{t('إيقاف مؤقت', 'Pause')}</span>
      </button>

      {/* Stop */}
      <button
        className="btn btn-sm flex items-center gap-1.5"
        onClick={onStop}
        disabled={runState === 'idle' || runState === 'archived'}
        title={t('إيقاف', 'Stop')}
        style={{ opacity: (runState === 'idle' || runState === 'archived') ? 0.4 : 1 }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
        <span className="text-xs">{t('إيقاف', 'Stop')}</span>
      </button>

      <div className="w-px h-4" style={{ background: 'var(--border)' }} />

      {/* Archive */}
      <button
        className="btn btn-sm flex items-center gap-1.5"
        onClick={onArchive}
        disabled={runState === 'archived' || runState === 'running'}
        title={t('أرشفة المسار', 'Archive Workflow')}
        style={{
          opacity: (runState === 'archived' || runState === 'running') ? 0.4 : 1,
          color: runState === 'archived' ? 'var(--text-muted)' : undefined,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
        <span className="text-xs">{t('أرشفة', 'Archive')}</span>
      </button>

      {/* Workflow name + status badge */}
      <div className="ms-auto flex items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {lang === 'ar' ? workflow.name.ar : workflow.name.en}
        </span>
        <span
          className="badge text-xs"
          style={{
            background: workflow.status === 'published' ? 'var(--success-bg)' : 'var(--gray-100)',
            color: workflow.status === 'published' ? 'var(--success-text)' : 'var(--gray-600)',
          }}
        >
          {workflow.status === 'published' ? t('منشور', 'Published') : t('مسودة', 'Draft')}
        </span>
      </div>
    </div>
  );
};

// ─── Main Workflow Page ───────────────────────────────────────────────────────
function WorkflowContent() {
  const { lang, t, simRole } = useApp();
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>(WORKFLOWS);
  const [selectedId, setSelectedId] = useState(WORKFLOWS[0].id);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [dragNodeType, setDragNodeType] = useState<WorkflowNodeType | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<WorkflowEdge | null>(null);
  const [runState, setRunState] = useState<WorkflowRunState>('idle');
  const isReadOnly = simRole === 'employee' || simRole === 'supervisor';

  const selectedWorkflow = workflows.find(w => w.id === selectedId) || workflows[0];

  // Reset run state when switching workflows
  useEffect(() => {
    setRunState('idle');
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [selectedId]);

  const updateNode = useCallback((updatedNode: WorkflowNode) => {
    setWorkflows(ws => ws.map(w => {
      if (w.id !== selectedId) return w;
      return { ...w, nodes: w.nodes.map(n => n.id === updatedNode.id ? updatedNode : n) };
    }));
    setSelectedNode(updatedNode);
  }, [selectedId]);

  const updateEdge = useCallback((updatedEdge: WorkflowEdge) => {
    setWorkflows(ws => ws.map(w => {
      if (w.id !== selectedId) return w;
      return { ...w, edges: w.edges.map(e => e.id === updatedEdge.id ? updatedEdge : e) };
    }));
    setSelectedEdge(updatedEdge);
  }, [selectedId]);

  const handleSave = async () => {
    const wf = selectedWorkflow;
    const errors: string[] = [];
    const hasStart = wf.nodes.some(n => n.type === 'start');
    const hasEnd = wf.nodes.some(n => n.type === 'end');
    if (!hasStart) errors.push(t('المسار يجب أن يحتوي على عقدة بداية', 'Workflow must have a Start node'));
    if (!hasEnd) errors.push(t('المسار يجب أن يحتوي على عقدة نهاية', 'Workflow must have an End node'));

    const connectedNodes = new Set<string>();
    wf.edges.forEach(e => { connectedNodes.add(e.source); connectedNodes.add(e.target); });
    const orphans = wf.nodes.filter(n => n.type !== 'start' && n.type !== 'end' && !connectedNodes.has(n.id));
    if (orphans.length > 0) {
      errors.push(t(`${orphans.length} عقدة غير متصلة`, `${orphans.length} orphan node(s) detected`));
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePublish = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setWorkflows(ws => ws.map(w => w.id === selectedId ? { ...w, status: 'published' } : w));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Workflow management handlers
  const handleRun = () => setRunState('running');
  const handlePause = () => setRunState('paused');
  const handleStop = () => setRunState('idle');
  const handleArchive = () => {
    setRunState('archived');
    setWorkflows(ws => ws.map(w => w.id === selectedId ? { ...w, status: 'draft' } : w));
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Workflow Selector */}
      <WorkflowSelector
        workflows={workflows}
        selectedId={selectedId}
        onSelect={(id) => { setSelectedId(id); setSelectedNode(null); setSelectedEdge(null); }}
        onNew={() => {
          const newWf: Workflow = {
            id: `wf-new-${Date.now()}`,
            name: { ar: 'مسار جديد', en: 'New Workflow' },
            description: { ar: '', en: '' },
            status: 'draft',
            nodes: [],
            edges: [],
            usedActions: [],
            relatedRecordTypes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            versions: [],
          };
          setWorkflows(ws => [...ws, newWf]);
          setSelectedId(newWf.id);
        }}
        t={t}
        lang={lang}
      />

      {/* Node Palette */}
      <NodePalette
        t={t}
        lang={lang}
        onDragStart={type => setDragNodeType(type)}
      />

      {/* Canvas Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Workflow Management Bar ── */}
        <WorkflowManagementBar
          workflow={selectedWorkflow}
          runState={runState}
          onRun={handleRun}
          onPause={handlePause}
          onStop={handleStop}
          onArchive={handleArchive}
          t={t}
          lang={lang}
        />

        {/* Canvas Toolbar */}
        <div
          className="flex items-center gap-2 px-4 py-2"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}
        >
          <div className="flex-1">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {lang === 'ar' ? selectedWorkflow.name.ar : selectedWorkflow.name.en}
            </span>
          </div>

          {/* Simulation */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setSimulating(s => !s); setSimStep(0); }}
            style={{
              background: simulating ? 'var(--success-bg)' : undefined,
              color: simulating ? 'var(--success-text)' : undefined,
              borderColor: simulating ? 'var(--success-border)' : undefined,
            }}
          >
            {simulating ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
                {t('إيقاف المحاكاة', 'Stop Simulation')}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                {t('محاكاة المسار', 'Simulate Path')}
              </>
            )}
          </button>

          {simulating && (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSimStep(s => Math.max(0, s - 1))}
                disabled={simStep === 0}
                aria-label={t('الخطوة السابقة', 'Previous Step')}
              >‹</button>
              <span className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                {t(`خطوة ${simStep + 1}`, `Step ${simStep + 1}`)}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSimStep(s => Math.min(selectedWorkflow.nodes.length - 1, s + 1))}
                disabled={simStep >= selectedWorkflow.nodes.length - 1}
                aria-label={t('الخطوة التالية', 'Next Step')}
              >›</button>
            </>
          )}

          <div className="ms-auto flex items-center gap-2">
            {validationErrors.length > 0 && (
              <span className="text-xs" style={{ color: 'var(--error-text)' }}>
                {validationErrors.length} {t('أخطاء', 'errors')}
              </span>
            )}
            {!isReadOnly && (
              <>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? t('جارٍ الحفظ...', 'Saving...') : saveSuccess ? `✓ ${t('تم الحفظ', 'Saved')}` : t('حفظ', 'Save')}
                </button>
                {selectedWorkflow.status === 'draft' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handlePublish}
                    disabled={saving}
                  >
                    {t('نشر', 'Publish')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div
            className="flex items-center gap-3 px-4 py-2 text-sm"
            style={{ background: 'var(--error-bg)', color: 'var(--error-text)', borderBottom: '1px solid var(--error-border)', flexShrink: 0 }}
            role="alert"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {validationErrors.join(' · ')}
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
            {t('وضع القراءة — يمكنك عرض وتشغيل المحاكاة فقط.', 'Read-only mode — you can view and simulate only.')}
          </div>
        )}

        {/* Mobile warning */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 text-sm"
          style={{ background: 'var(--info-bg)', color: 'var(--info-text)', borderBottom: '1px solid var(--info-border)', flexShrink: 0 }}
          role="note"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          {t('التأليف يتطلب شاشة أكبر (≥1024px). يمكنك عرض وتشغيل المحاكاة.', 'Authoring requires a larger screen (≥1024px). You can view and simulate.')}
        </div>

        {/* Canvas + Inspector */}
        <div className="flex flex-1 overflow-hidden">
          {/* React Flow Canvas */}
          <div className="flex-1 overflow-hidden">
            <ReactFlowCanvas
              workflow={selectedWorkflow}
              simulating={simulating}
              simStep={simStep}
              isReadOnly={isReadOnly}
              dragNodeType={dragNodeType}
              onWorkflowChange={(wf) => setWorkflows(ws => ws.map(w => w.id === wf.id ? wf : w))}
              onActionClick={(actionId) => router.push(ROUTES.governanceActionDetail(actionId))}
              onNodeSelect={setSelectedNode}
              onEdgeSelect={setSelectedEdge}
              t={t}
              lang={lang}
            />
          </div>

          {/* Contextual Inspector Panel */}
          <div
            className="flex flex-col"
            style={{
              width: 300,
              flexShrink: 0,
              borderInlineStart: '1px solid var(--border)',
              background: 'var(--surface)',
              overflow: 'hidden',
            }}
          >
            {selectedNode ? (
              <NodeInspector
                node={selectedNode}
                onUpdate={isReadOnly ? () => {} : updateNode}
                onClose={() => setSelectedNode(null)}
                t={t}
                lang={lang}
              />
            ) : selectedEdge ? (
              <EdgeInspector
                edge={selectedEdge}
                onUpdate={isReadOnly ? () => {} : updateEdge}
                onClose={() => setSelectedEdge(null)}
                t={t}
                lang={lang}
              />
            ) : (
              <EmptyInspector t={t} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <AppShell breadcrumbs={[
      { label: 'عقل', href: '/' },
      { label: 'سير العمل' },
      { label: 'منشئ المسارات' },
    ]}>
      <WorkflowContent />
    </AppShell>
  );
}