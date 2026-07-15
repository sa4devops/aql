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