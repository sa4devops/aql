// ─── Shared Enums ─────────────────────────────────────────────────────────────

export type StatusValue = 'draft' | 'under_review' | 'approved' | 'rejected' | 'archived';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ClassificationLevel = 'public' | 'internal' | 'confidential' | 'top_secret';
export type UserRole = 'employee' | 'supervisor' | 'manager' | 'system_admin';

export type FieldType =
  | 'text' |'longtext' |'number' |'date' |'select' |'reference' |'user' |'attachment' |'classification' |'status';

// ─── Bilingual Label ──────────────────────────────────────────────────────────
export interface BilingualLabel {
  ar: string;
  en: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface MockUser {
  id: string;
  name: BilingualLabel;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  email: string;
}

// ─── Department ───────────────────────────────────────────────────────────────
export interface Department {
  id: string;
  name: BilingualLabel;
}

// ─── Record Field ─────────────────────────────────────────────────────────────
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
  value?: string | number;
  message: BilingualLabel;
}

export interface RecordField {
  id: string;
  type: FieldType;
  label: BilingualLabel;
  required: boolean;
  validationRules: ValidationRule[];
  helpText?: BilingualLabel;
  visibilityRoles: UserRole[];
  options?: string[];
  referenceTypeId?: string;
  order: number;
}

// ─── Record Section ───────────────────────────────────────────────────────────
export interface RecordSection {
  id: string;
  label: BilingualLabel;
  description?: BilingualLabel;
  fields: RecordField[];
  order: number;
  collapsed?: boolean;
}

// ─── Record Type ──────────────────────────────────────────────────────────────
export interface RecordType {
  id: string;
  name: BilingualLabel;
  description: BilingualLabel;
  sections: RecordSection[];
  status: StatusValue;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  icon?: string;
  color?: string;
}

// ─── Record Instance ──────────────────────────────────────────────────────────
export interface RecordInstance {
  id: string;
  typeId: string;
  typeName: BilingualLabel;
  title: BilingualLabel;
  status: StatusValue;
  classification: ClassificationLevel;
  riskLevel: RiskLevel;
  createdBy: MockUser;
  assignedTo?: MockUser;
  department: Department;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  referenceNumber: string;
  fieldValues: Record<string, unknown>;
  relatedActionId?: string;
}

// ─── Workflow Node ────────────────────────────────────────────────────────────
export type WorkflowNodeType = 'start' | 'task' | 'condition' | 'action' | 'notification' | 'end';

export type WorkflowActionType =
  | 'manual_task' |'automated_task' |'external_integration' |'llm_prompt';

/**
 * AGENT NOTE — Linked Record Model (2026-07-15)
 *
 * AR: السجل المرتبط يُعرَّف بالرقم المرجعي الظاهر (recordReferenceNumber)،
 *     لكن النظام يحفظ المعرّف الداخلي الثابت (resolvedRecordId) بعد التحقق.
 *     هذا يضمن عدم انكسار الربط إذا تغير تنسيق الرقم الظاهر.
 *     التنفيذ الحقيقي سيستخدم Backend Lookup API ولن يحمل السجلات في المتصفح.
 *
 * EN: The linked record is identified by the user-visible reference number
 *     (recordReferenceNumber), but the system stores the stable internal ID
 *     (resolvedRecordId) after verification. This prevents broken links if the
 *     display number format changes. Production will use a Backend Lookup API —
 *     records must NOT be loaded into the browser for large datasets.
 *
 * Fields:
 *   recordReferenceNumber — what the user types (e.g. "REF-2024-00451")
 *   resolvedRecordId      — stable internal DB id (e.g. "rec_7f3a9b2c")
 *   recordDisplayName     — human-readable label shown after lookup
 *   recordTypeId          — the Record Type this instance belongs to (e.g. "rt-leave-request")
 */
export interface LinkedRecord {
  recordReferenceNumber: string;
  resolvedRecordId: string;
  recordDisplayName: string;
  recordTypeId: string;
}

/**
 * Mock Async Lookup states for the trial phase.
 * Production will replace this with a real Backend Lookup API call.
 *
 *   idle               — field is empty, no lookup triggered
 *   searching          — debounce fired (300ms), awaiting mock response
 *   found              — exactly one matching record returned
 *   not_found          — no records matched the reference number
 *   ambiguous          — more than one record matched (duplicate reference)
 *   service_unavailable — simulated API failure / network error
 */
export type LinkedRecordLookupState =
  | 'idle' |'searching' |'found' |'not_found' |'ambiguous' |'service_unavailable';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: BilingualLabel;
  assignedRole?: UserRole;
  deadline?: number;
  actionId?: string;
  conditions?: string[];
  position: { x: number; y: number };
  data?: Record<string, unknown>;
  // Action / record association
  actionType?: WorkflowActionType;
  /**
   * @deprecated Use linkedRecord instead.
   * Kept for backward-compatibility with existing mock data.
   */
  linkedRecordType?: string;
  /** Approved linked-record shape (trial phase). See LinkedRecord interface. */
  linkedRecord?: LinkedRecord;
  llmPrompt?: string;
  integrationTarget?: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: BilingualLabel;
  condition?: string;
  type?: string;
}

export interface WorkflowVersion {
  version: string;
  status: 'draft' | 'published';
  createdAt: string;
  createdBy: string;
}

export interface Workflow {
  id: string;
  name: BilingualLabel;
  description: BilingualLabel;
  status: 'draft' | 'published';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  usedActions: string[];
  relatedRecordTypes: string[];
  createdAt: string;
  updatedAt: string;
  versions: WorkflowVersion[];
}

// ─── Action ───────────────────────────────────────────────────────────────────
export interface ActionInput {
  name: string;
  type: string;
  required: boolean;
  description: BilingualLabel;
}

export interface ActionOutput {
  name: string;
  type: string;
  description: BilingualLabel;
}

export interface ActionError {
  code: string;
  description: BilingualLabel;
}

export interface ActionPermission {
  role: UserRole;
  canView: boolean;
  canExecute: boolean;
}

export interface ActionVersion {
  version: string;
  status: StatusValue;
  createdAt: string;
  changedBy: string;
  changelog: BilingualLabel;
}

export interface AuditEntry {
  id: string;
  userId: string;
  userName: BilingualLabel;
  action: string;
  timestamp: string;
  details: BilingualLabel;
  ipAddress?: string;
}

export interface UsedInRef {
  type: 'workflow' | 'screen';
  id: string;
  name: BilingualLabel;
  path?: string;
}

export interface Action {
  id: string;
  technicalId: string;
  name: BilingualLabel;
  description: BilingualLabel;
  category: string;
  riskLevel: RiskLevel;
  status: StatusValue;
  version: string;
  inputs: ActionInput[];
  outputs: ActionOutput[];
  expectedErrors: ActionError[];
  permissions: ActionPermission[];
  usedIn: UsedInRef[];
  versions: ActionVersion[];
  auditLog: AuditEntry[];
  riskProbability: 1 | 2 | 3 | 4 | 5;
  riskImpact: 1 | 2 | 3 | 4 | 5;
  deprecated?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Simulation State ─────────────────────────────────────────────────────────
export type SimulationMode = 'normal' | 'loading' | 'error' | 'empty';

export interface SimulationState {
  mode: SimulationMode;
  role: UserRole;
}