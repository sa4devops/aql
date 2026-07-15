import type {
  RecordType,
  RecordInstance,
  Workflow,
  Action,
  MockUser,
  Department,
} from './types';

// ─── Departments ──────────────────────────────────────────────────────────────
export const DEPARTMENTS: Department[] = [
  { id: 'dept-001', name: { ar: 'الموارد البشرية', en: 'Human Resources' } },
  { id: 'dept-002', name: { ar: 'الشؤون القانونية', en: 'Legal Affairs' } },
  { id: 'dept-003', name: { ar: 'تقنية المعلومات', en: 'Information Technology' } },
  { id: 'dept-004', name: { ar: 'الشؤون المالية', en: 'Finance' } },
  { id: 'dept-005', name: { ar: 'العمليات والإجراءات', en: 'Operations' } },
  { id: 'dept-006', name: { ar: 'الشؤون الإدارية', en: 'Administrative Affairs' } },
  { id: 'dept-007', name: { ar: 'التخطيط والتطوير', en: 'Planning & Development' } },
  { id: 'dept-008', name: { ar: 'الأمن والسلامة', en: 'Security & Safety' } },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const USERS: MockUser[] = [
  { id: 'user-001', name: { ar: 'محمد عبدالله الحربي', en: 'Mohammed Al-Harbi' }, role: 'system_admin', department: 'dept-003', email: 'mharbi@aql.gov' },
  { id: 'user-002', name: { ar: 'سارة أحمد المطيري', en: 'Sara Al-Mutairi' }, role: 'manager', department: 'dept-001', email: 'smutairi@aql.gov' },
  { id: 'user-003', name: { ar: 'خالد سعد العتيبي', en: 'Khalid Al-Otaibi' }, role: 'supervisor', department: 'dept-002', email: 'kotaibi@aql.gov' },
  { id: 'user-004', name: { ar: 'نورة فهد الدوسري', en: 'Noura Al-Dosari' }, role: 'employee', department: 'dept-004', email: 'ndosari@aql.gov' },
  { id: 'user-005', name: { ar: 'عبدالرحمن يوسف الغامدي', en: 'Abdulrahman Al-Ghamdi' }, role: 'supervisor', department: 'dept-005', email: 'aghamdi@aql.gov' },
  { id: 'user-006', name: { ar: 'فاطمة علي الشهري', en: 'Fatima Al-Shahri' }, role: 'employee', department: 'dept-006', email: 'fshahri@aql.gov' },
  { id: 'user-007', name: { ar: 'عمر محمد الزهراني', en: 'Omar Al-Zahrani' }, role: 'manager', department: 'dept-007', email: 'ozahrani@aql.gov' },
  { id: 'user-008', name: { ar: 'هند سلطان القحطاني', en: 'Hind Al-Qahtani' }, role: 'employee', department: 'dept-001', email: 'hqahtani@aql.gov' },
];

// ─── Record Types ─────────────────────────────────────────────────────────────
export const RECORD_TYPES: RecordType[] = [
  {
    id: 'rt-001',
    name: { ar: 'المراسلات الواردة', en: 'Incoming Correspondence' },
    description: { ar: 'نوع سجل للمراسلات والخطابات الواردة من الجهات الخارجية', en: 'Record type for incoming correspondence from external entities' },
    status: 'approved',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-06-20T14:30:00Z',
    createdBy: 'user-001',
    sections: [
      {
        id: 'sec-001',
        label: { ar: 'معلومات المراسلة', en: 'Correspondence Information' },
        order: 0,
        fields: [
          { id: 'f-001', type: 'text', label: { ar: 'موضوع المراسلة', en: 'Subject' }, required: true, validationRules: [], visibilityRoles: ['employee', 'supervisor', 'manager', 'system_admin'], order: 0 },
          { id: 'f-002', type: 'date', label: { ar: 'تاريخ الاستلام', en: 'Receipt Date' }, required: true, validationRules: [], visibilityRoles: ['employee', 'supervisor', 'manager', 'system_admin'], order: 1 },
          { id: 'f-003', type: 'select', label: { ar: 'الجهة المرسلة', en: 'Sending Entity' }, required: true, validationRules: [], options: ['وزارة المالية', 'وزارة الداخلية', 'ديوان المظالم', 'هيئة الرقابة'], visibilityRoles: ['employee', 'supervisor', 'manager', 'system_admin'], order: 2 },
          { id: 'f-004', type: 'classification', label: { ar: 'درجة السرية', en: 'Classification' }, required: true, validationRules: [], visibilityRoles: ['supervisor', 'manager', 'system_admin'], order: 3 },
        ],
      },
      {
        id: 'sec-002',
        label: { ar: 'التفاصيل والمرفقات', en: 'Details & Attachments' },
        order: 1,
        fields: [
          { id: 'f-005', type: 'longtext', label: { ar: 'ملخص المراسلة', en: 'Summary' }, required: false, validationRules: [], visibilityRoles: ['employee', 'supervisor', 'manager', 'system_admin'], order: 0 },
          { id: 'f-006', type: 'attachment', label: { ar: 'المرفقات', en: 'Attachments' }, required: false, validationRules: [], visibilityRoles: ['employee', 'supervisor', 'manager', 'system_admin'], order: 1 },
          { id: 'f-007', type: 'user', label: { ar: 'الموظف المسؤول', en: 'Responsible Officer' }, required: true, validationRules: [], visibilityRoles: ['supervisor', 'manager', 'system_admin'], order: 2 },
        ],
      },
      {
        id: 'sec-003',
        label: { ar: 'الإجراء والمتابعة', en: 'Action & Follow-up' },
        order: 2,
        fields: [
          { id: 'f-008', type: 'status', label: { ar: 'حالة المعالجة', en: 'Processing Status' }, required: true, validationRules: [], visibilityRoles: ['supervisor', 'manager', 'system_admin'], order: 0 },
          { id: 'f-009', type: 'reference', label: { ar: 'مراسلة مرتبطة', en: 'Related Correspondence' }, required: false, validationRules: [], referenceTypeId: 'rt-001', visibilityRoles: ['supervisor', 'manager', 'system_admin'], order: 1 },
          { id: 'f-010', type: 'number', label: { ar: 'رقم المراسلة', en: 'Reference Number' }, required: true, validationRules: [], visibilityRoles: ['employee', 'supervisor', 'manager', 'system_admin'], order: 2 },
        ],
      },
    ],
  },
  {
    id: 'rt-002',
    name: { ar: 'طلبات الموارد البشرية', en: 'HR Requests' },
    description: { ar: 'نوع سجل لطلبات الموارد البشرية الداخلية', en: 'Record type for internal HR requests' },
    status: 'approved',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-07-01T11:00:00Z',
    createdBy: 'user-002',
    sections: [
      {
        id: 'sec-004',
        label: { ar: 'بيانات الطلب', en: 'Request Data' },
        order: 0,
        fields: [
          { id: 'f-011', type: 'text', label: { ar: 'عنوان الطلب', en: 'Request Title' }, required: true, validationRules: [], visibilityRoles: ['employee', 'supervisor', 'manager', 'system_admin'], order: 0 },
          { id: 'f-012', type: 'select', label: { ar: 'نوع الطلب', en: 'Request Type' }, required: true, options: ['إجازة', 'نقل', 'ترقية', 'تدريب', 'بدل'], validationRules: [], visibilityRoles: ['employee', 'supervisor', 'manager', 'system_admin'], order: 1 },
          { id: 'f-013', type: 'user', label: { ar: 'مقدم الطلب', en: 'Requester' }, required: true, validationRules: [], visibilityRoles: ['supervisor', 'manager', 'system_admin'], order: 2 },
          { id: 'f-014', type: 'date', label: { ar: 'تاريخ الطلب', en: 'Request Date' }, required: true, validationRules: [], visibilityRoles: ['employee', 'supervisor', 'manager', 'system_admin'], order: 3 },
        ],
      },
    ],
  },
  {
    id: 'rt-003',
    name: { ar: 'العقود والاتفاقيات', en: 'Contracts & Agreements' },
    description: { ar: 'نوع سجل للعقود والاتفاقيات المبرمة مع الجهات الخارجية', en: 'Record type for contracts and agreements with external parties' },
    status: 'under_review',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-07-10T16:00:00Z',
    createdBy: 'user-001',
    sections: [],
  },
  {
    id: 'rt-004',
    name: { ar: 'الشكاوى والتظلمات', en: 'Complaints & Grievances' },
    description: { ar: 'نوع سجل لاستقبال ومتابعة الشكاوى', en: 'Record type for receiving and tracking complaints' },
    status: 'draft',
    createdAt: '2026-07-01T08:00:00Z',
    updatedAt: '2026-07-12T09:00:00Z',
    createdBy: 'user-003',
    sections: [],
  },
];

// ─── Records ──────────────────────────────────────────────────────────────────
const generateRecords = (): RecordInstance[] => {
  const statuses = ['draft', 'under_review', 'approved', 'rejected', 'archived'] as const;
  const classifications = ['public', 'internal', 'confidential', 'top_secret'] as const;
  const risks = ['low', 'medium', 'high', 'critical'] as const;
  const priorities = ['low', 'normal', 'high', 'urgent'] as const;

  const titles = [
    { ar: 'طلب إجازة سنوية — الربع الثالث', en: 'Annual Leave Request — Q3' },
    { ar: 'مراسلة وزارة المالية بشأن الميزانية', en: 'Finance Ministry Correspondence — Budget' },
    { ar: 'عقد توريد معدات تقنية', en: 'Technology Equipment Supply Contract' },
    { ar: 'تقرير المراجعة الداخلية السنوي', en: 'Annual Internal Audit Report' },
    { ar: 'طلب ترقية وظيفية — الدرجة السابعة', en: 'Job Promotion Request — Grade 7' },
    { ar: 'بلاغ أمني — منطقة الخوادم', en: 'Security Report — Server Room' },
    { ar: 'خطاب تأهيل مورد جديد', en: 'New Vendor Qualification Letter' },
    { ar: 'اتفاقية مستوى الخدمة — الأنظمة الحرجة', en: 'SLA Agreement — Critical Systems' },
    { ar: 'محضر اجتماع لجنة الحوكمة', en: 'Governance Committee Meeting Minutes' },
    { ar: 'طلب صرف ميزانية طارئة', en: 'Emergency Budget Disbursement Request' },
    { ar: 'تقرير الأداء الوظيفي — النصف الأول', en: 'Performance Report — H1' },
    { ar: 'شكوى موظف — بيئة العمل', en: 'Employee Complaint — Work Environment' },
    { ar: 'طلب تدريب خارجي — أمن المعلومات', en: 'External Training Request — InfoSec' },
    { ar: 'مراسلة هيئة الاتصالات وتقنية المعلومات', en: 'CITC Correspondence' },
    { ar: 'تحديث سياسة الخصوصية والبيانات', en: 'Privacy & Data Policy Update' },
    { ar: 'طلب استئجار مركبة رسمية', en: 'Official Vehicle Rental Request' },
    { ar: 'تقرير حوادث أمن المعلومات — يوليو', en: 'InfoSec Incident Report — July' },
    { ar: 'عقد تطوير نظام إلكتروني', en: 'Electronic System Development Contract' },
    { ar: 'مراسلة ديوان المظالم', en: 'Board of Grievances Correspondence' },
    { ar: 'طلب إنشاء بريد إلكتروني مؤسسي', en: 'Institutional Email Creation Request' },
    { ar: 'تقرير استهلاك الطاقة الكهربائية', en: 'Electricity Consumption Report' },
    { ar: 'إخطار انتهاء صلاحية عقد الصيانة', en: 'Maintenance Contract Expiry Notice' },
    { ar: 'طلب تجديد رخصة البرنامج', en: 'Software License Renewal Request' },
    { ar: 'مراسلة بخصوص التوظيف الجديد', en: 'New Recruitment Correspondence' },
    { ar: 'تقرير نتائج تدقيق الأنظمة', en: 'Systems Audit Results Report' },
    { ar: 'طلب استرداد مصاريف إدارية', en: 'Administrative Expense Reimbursement' },
    { ar: 'إشعار تغيير هيكل تنظيمي', en: 'Organizational Structure Change Notice' },
    { ar: 'طلب اعتماد مشروع تحول رقمي', en: 'Digital Transformation Project Approval' },
    { ar: 'مراسلة وزارة الموارد البشرية', en: 'HRSD Ministry Correspondence' },
    { ar: 'تقرير متابعة خطة التشغيل السنوية', en: 'Annual Operations Plan Follow-up' },
  ];

  const actionIds = ['action-001', 'action-002', 'action-003', 'action-004', 'action-005'];

  return Array.from({ length: 30 }, (_, i) => {
    const idx = i % titles.length;
    const userIdx = i % USERS.length;
    const deptIdx = i % DEPARTMENTS.length;
    const typeIdx = i % RECORD_TYPES.length;
    return {
      id: `rec-${String(i + 1).padStart(3, '0')}`,
      typeId: RECORD_TYPES[typeIdx].id,
      typeName: RECORD_TYPES[typeIdx].name,
      title: titles[idx],
      status: statuses[i % statuses.length],
      classification: classifications[i % classifications.length],
      riskLevel: risks[i % risks.length],
      createdBy: USERS[userIdx],
      assignedTo: USERS[(userIdx + 1) % USERS.length],
      department: DEPARTMENTS[deptIdx],
      createdAt: new Date(2026, 0, i + 1).toISOString(),
      updatedAt: new Date(2026, 5, i + 1).toISOString(),
      tags: i % 3 === 0 ? ['عاجل', 'مهم'] : i % 3 === 1 ? ['روتيني'] : ['للمتابعة'],
      priority: priorities[i % priorities.length],
      referenceNumber: `AQL-2026-${String(1000 + i).padStart(5, '0')}`,
      fieldValues: {},
      relatedActionId: actionIds[i % actionIds.length],
    };
  });
};

export const RECORDS: RecordInstance[] = generateRecords();

// ─── Workflows ────────────────────────────────────────────────────────────────
export const WORKFLOWS: Workflow[] = [
  {
    id: 'wf-001',
    name: { ar: 'مسار اعتماد المراسلات الواردة', en: 'Incoming Correspondence Approval Path' },
    description: { ar: 'مسار العمل لمراجعة واعتماد المراسلات الواردة من الجهات الخارجية', en: 'Workflow for reviewing and approving incoming correspondence' },
    status: 'published',
    usedActions: ['action-001', 'action-002'],
    relatedRecordTypes: ['rt-001'],
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-06-15T10:00:00Z',
    versions: [
      { version: '1.0', status: 'published', createdAt: '2026-02-01T08:00:00Z', createdBy: 'user-001' },
      { version: '1.1', status: 'draft', createdAt: '2026-07-01T09:00:00Z', createdBy: 'user-001' },
    ],
    nodes: [
      { id: 'node-start', type: 'start', label: { ar: 'بدء', en: 'Start' }, position: { x: 80, y: 200 } },
      { id: 'node-review', type: 'task', label: { ar: 'مراجعة المشرف', en: 'Supervisor Review' }, assignedRole: 'supervisor', deadline: 2, position: { x: 280, y: 200 } },
      { id: 'node-classify', type: 'action', label: { ar: 'تصنيف المراسلة', en: 'Classify Correspondence' }, actionId: 'action-001', position: { x: 480, y: 200 } },
      { id: 'node-condition', type: 'condition', label: { ar: 'هل تحتاج اعتماد مدير؟', en: 'Needs Manager Approval?' }, conditions: ['classification === confidential', 'classification === top_secret'], position: { x: 680, y: 200 } },
      { id: 'node-manager', type: 'task', label: { ar: 'اعتماد المدير', en: 'Manager Approval' }, assignedRole: 'manager', deadline: 3, position: { x: 880, y: 100 } },
      { id: 'node-notify', type: 'notification', label: { ar: 'إشعار مقدم الطلب', en: 'Notify Requester' }, position: { x: 880, y: 300 } },
      { id: 'node-archive', type: 'action', label: { ar: 'أرشفة تلقائية', en: 'Auto Archive' }, actionId: 'action-002', position: { x: 1080, y: 200 } },
      { id: 'node-end', type: 'end', label: { ar: 'انتهاء', en: 'End' }, position: { x: 1280, y: 200 } },
    ],
    edges: [
      { id: 'e-1', source: 'node-start', target: 'node-review' },
      { id: 'e-2', source: 'node-review', target: 'node-classify' },
      { id: 'e-3', source: 'node-classify', target: 'node-condition' },
      { id: 'e-4', source: 'node-condition', target: 'node-manager', label: { ar: 'نعم', en: 'Yes' }, condition: 'سري أو سري للغاية' },
      { id: 'e-5', source: 'node-condition', target: 'node-notify', label: { ar: 'لا', en: 'No' }, condition: 'عام أو داخلي' },
      { id: 'e-6', source: 'node-manager', target: 'node-archive' },
      { id: 'e-7', source: 'node-notify', target: 'node-archive' },
      { id: 'e-8', source: 'node-archive', target: 'node-end' },
    ],
  },
  {
    id: 'wf-002',
    name: { ar: 'مسار طلبات الموارد البشرية', en: 'HR Requests Workflow' },
    description: { ar: 'مسار معالجة طلبات الموارد البشرية الداخلية', en: 'Internal HR requests processing workflow' },
    status: 'draft',
    usedActions: ['action-003', 'action-004'],
    relatedRecordTypes: ['rt-002'],
    createdAt: '2026-04-10T08:00:00Z',
    updatedAt: '2026-07-05T14:00:00Z',
    versions: [
      { version: '1.0', status: 'draft', createdAt: '2026-04-10T08:00:00Z', createdBy: 'user-002' },
    ],
    nodes: [
      { id: 'wf2-start', type: 'start', label: { ar: 'بدء', en: 'Start' }, position: { x: 80, y: 200 } },
      { id: 'wf2-task1', type: 'task', label: { ar: 'مراجعة الطلب', en: 'Review Request' }, assignedRole: 'supervisor', deadline: 1, position: { x: 280, y: 200 } },
      { id: 'wf2-action1', type: 'action', label: { ar: 'التحقق من الأهلية', en: 'Eligibility Check' }, actionId: 'action-003', position: { x: 480, y: 200 } },
      { id: 'wf2-end', type: 'end', label: { ar: 'انتهاء', en: 'End' }, position: { x: 680, y: 200 } },
    ],
    edges: [
      { id: 'wf2-e1', source: 'wf2-start', target: 'wf2-task1' },
      { id: 'wf2-e2', source: 'wf2-task1', target: 'wf2-action1' },
      { id: 'wf2-e3', source: 'wf2-action1', target: 'wf2-end' },
    ],
  },
];

// ─── Actions ──────────────────────────────────────────────────────────────────
export const ACTIONS: Action[] = [
  {
    id: 'action-001',
    technicalId: 'classify_correspondence',
    name: { ar: 'تصنيف المراسلة', en: 'Classify Correspondence' },
    description: { ar: 'تحديد درجة سرية المراسلة الواردة بناءً على محتواها ومصدرها', en: 'Determine the classification level of incoming correspondence based on content and source' },
    category: 'التصنيف والأرشفة',
    riskLevel: 'medium',
    status: 'approved',
    version: '2.1',
    riskProbability: 2,
    riskImpact: 4,
    deprecated: false,
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2026-06-15T10:00:00Z',
    inputs: [
      { name: 'correspondence_id', type: 'string', required: true, description: { ar: 'معرف المراسلة', en: 'Correspondence ID' } },
      { name: 'content_summary', type: 'text', required: true, description: { ar: 'ملخص المحتوى', en: 'Content Summary' } },
      { name: 'source_entity', type: 'string', required: false, description: { ar: 'الجهة المرسلة', en: 'Source Entity' } },
    ],
    outputs: [
      { name: 'classification_level', type: 'enum', description: { ar: 'درجة السرية المحددة', en: 'Determined classification level' } },
      { name: 'classification_reason', type: 'text', description: { ar: 'مبرر التصنيف', en: 'Classification reason' } },
    ],
    expectedErrors: [
      { code: 'MISSING_CONTENT', description: { ar: 'محتوى المراسلة غير متاح', en: 'Correspondence content not available' } },
      { code: 'PERMISSION_DENIED', description: { ar: 'المستخدم لا يملك صلاحية التصنيف', en: 'User lacks classification permission' } },
    ],
    permissions: [
      { role: 'employee', canView: true, canExecute: false },
      { role: 'supervisor', canView: true, canExecute: true },
      { role: 'manager', canView: true, canExecute: true },
      { role: 'system_admin', canView: true, canExecute: true },
    ],
    usedIn: [
      { type: 'workflow', id: 'wf-001', name: { ar: 'مسار اعتماد المراسلات الواردة', en: 'Incoming Correspondence Approval' }, path: '/workflow-canvas-builder' },
    ],
    versions: [
      { version: '1.0', status: 'archived', createdAt: '2025-11-01T08:00:00Z', changedBy: 'user-001', changelog: { ar: 'الإصدار الأولي', en: 'Initial release' } },
      { version: '2.0', status: 'archived', createdAt: '2026-02-15T09:00:00Z', changedBy: 'user-001', changelog: { ar: 'إضافة دعم التصنيف التلقائي', en: 'Added auto-classification support' } },
      { version: '2.1', status: 'approved', createdAt: '2026-06-15T10:00:00Z', changedBy: 'user-001', changelog: { ar: 'تحسين دقة التصنيف لـ 15%', en: 'Improved classification accuracy by 15%' } },
    ],
    auditLog: [
      { id: 'audit-001', userId: 'user-001', userName: { ar: 'محمد الحربي', en: 'Mohammed Al-Harbi' }, action: 'created', timestamp: '2025-11-01T08:00:00Z', details: { ar: 'إنشاء الإجراء', en: 'Action created' } },
      { id: 'audit-002', userId: 'user-002', userName: { ar: 'سارة المطيري', en: 'Sara Al-Mutairi' }, action: 'approved', timestamp: '2026-06-16T10:30:00Z', details: { ar: 'اعتماد الإصدار 2.1', en: 'Approved version 2.1' } },
      { id: 'audit-003', userId: 'user-003', userName: { ar: 'خالد العتيبي', en: 'Khalid Al-Otaibi' }, action: 'executed', timestamp: '2026-07-10T14:15:00Z', details: { ar: 'تنفيذ على مراسلة AQL-2026-01023', en: 'Executed on record AQL-2026-01023' } },
      { id: 'audit-004', userId: 'user-001', userName: { ar: 'محمد الحربي', en: 'Mohammed Al-Harbi' }, action: 'updated', timestamp: '2026-07-12T09:00:00Z', details: { ar: 'تحديث قواعد التصنيف', en: 'Updated classification rules' } },
    ],
  },
  {
    id: 'action-002',
    technicalId: 'auto_archive_record',
    name: { ar: 'أرشفة تلقائية', en: 'Auto Archive Record' },
    description: { ar: 'أرشفة السجل تلقائياً بعد اكتمال دورة الاعتماد وفق السياسة المعتمدة', en: 'Automatically archive a record after completion of the approval cycle per policy' },
    category: 'الأرشفة والتوثيق',
    riskLevel: 'low',
    status: 'approved',
    version: '1.3',
    riskProbability: 1,
    riskImpact: 2,
    deprecated: false,
    createdAt: '2025-12-01T08:00:00Z',
    updatedAt: '2026-05-20T11:00:00Z',
    inputs: [
      { name: 'record_id', type: 'string', required: true, description: { ar: 'معرف السجل', en: 'Record ID' } },
      { name: 'archive_reason', type: 'text', required: false, description: { ar: 'سبب الأرشفة', en: 'Archive reason' } },
    ],
    outputs: [
      { name: 'archive_reference', type: 'string', description: { ar: 'رقم مرجع الأرشيف', en: 'Archive reference number' } },
      { name: 'archive_timestamp', type: 'datetime', description: { ar: 'تاريخ ووقت الأرشفة', en: 'Archive timestamp' } },
    ],
    expectedErrors: [
      { code: 'RECORD_NOT_FOUND', description: { ar: 'السجل غير موجود', en: 'Record not found' } },
      { code: 'ALREADY_ARCHIVED', description: { ar: 'السجل مؤرشف مسبقاً', en: 'Record already archived' } },
    ],
    permissions: [
      { role: 'employee', canView: true, canExecute: false },
      { role: 'supervisor', canView: true, canExecute: true },
      { role: 'manager', canView: true, canExecute: true },
      { role: 'system_admin', canView: true, canExecute: true },
    ],
    usedIn: [
      { type: 'workflow', id: 'wf-001', name: { ar: 'مسار اعتماد المراسلات الواردة', en: 'Incoming Correspondence Approval' }, path: '/workflow-canvas-builder' },
    ],
    versions: [
      { version: '1.0', status: 'archived', createdAt: '2025-12-01T08:00:00Z', changedBy: 'user-001', changelog: { ar: 'الإصدار الأولي', en: 'Initial release' } },
      { version: '1.3', status: 'approved', createdAt: '2026-05-20T11:00:00Z', changedBy: 'user-001', changelog: { ar: 'دعم الأرشفة الجماعية', en: 'Bulk archiving support' } },
    ],
    auditLog: [
      { id: 'audit-005', userId: 'user-001', userName: { ar: 'محمد الحربي', en: 'Mohammed Al-Harbi' }, action: 'created', timestamp: '2025-12-01T08:00:00Z', details: { ar: 'إنشاء الإجراء', en: 'Action created' } },
      { id: 'audit-006', userId: 'user-002', userName: { ar: 'سارة المطيري', en: 'Sara Al-Mutairi' }, action: 'approved', timestamp: '2026-05-21T10:00:00Z', details: { ar: 'اعتماد الإصدار 1.3', en: 'Approved version 1.3' } },
    ],
  },
  {
    id: 'action-003',
    technicalId: 'check_hr_eligibility',
    name: { ar: 'التحقق من الأهلية الوظيفية', en: 'Check HR Eligibility' },
    description: { ar: 'التحقق من استيفاء الموظف لشروط الأهلية لطلب الموارد البشرية المقدم', en: 'Verify employee eligibility criteria for submitted HR request' },
    category: 'الموارد البشرية',
    riskLevel: 'high',
    status: 'under_review',
    version: '1.0',
    riskProbability: 3,
    riskImpact: 4,
    deprecated: false,
    createdAt: '2026-03-15T08:00:00Z',
    updatedAt: '2026-07-08T15:00:00Z',
    inputs: [
      { name: 'employee_id', type: 'string', required: true, description: { ar: 'معرف الموظف', en: 'Employee ID' } },
      { name: 'request_type', type: 'enum', required: true, description: { ar: 'نوع الطلب', en: 'Request type' } },
      { name: 'request_date', type: 'date', required: true, description: { ar: 'تاريخ الطلب', en: 'Request date' } },
    ],
    outputs: [
      { name: 'is_eligible', type: 'boolean', description: { ar: 'نتيجة التحقق', en: 'Eligibility result' } },
      { name: 'ineligibility_reason', type: 'text', description: { ar: 'سبب عدم الأهلية إن وجد', en: 'Ineligibility reason if any' } },
    ],
    expectedErrors: [
      { code: 'EMPLOYEE_NOT_FOUND', description: { ar: 'الموظف غير موجود في النظام', en: 'Employee not found in system' } },
      { code: 'DATA_INCOMPLETE', description: { ar: 'بيانات الموظف غير مكتملة', en: 'Employee data incomplete' } },
    ],
    permissions: [
      { role: 'employee', canView: false, canExecute: false },
      { role: 'supervisor', canView: true, canExecute: true },
      { role: 'manager', canView: true, canExecute: true },
      { role: 'system_admin', canView: true, canExecute: true },
    ],
    usedIn: [
      { type: 'workflow', id: 'wf-002', name: { ar: 'مسار طلبات الموارد البشرية', en: 'HR Requests Workflow' }, path: '/workflow-canvas-builder' },
    ],
    versions: [
      { version: '1.0', status: 'under_review', createdAt: '2026-03-15T08:00:00Z', changedBy: 'user-002', changelog: { ar: 'الإصدار الأولي', en: 'Initial release' } },
    ],
    auditLog: [
      { id: 'audit-007', userId: 'user-002', userName: { ar: 'سارة المطيري', en: 'Sara Al-Mutairi' }, action: 'created', timestamp: '2026-03-15T08:00:00Z', details: { ar: 'إنشاء الإجراء', en: 'Action created' } },
      { id: 'audit-008', userId: 'user-003', userName: { ar: 'خالد العتيبي', en: 'Khalid Al-Otaibi' }, action: 'submitted_for_review', timestamp: '2026-07-08T15:00:00Z', details: { ar: 'تقديم للمراجعة', en: 'Submitted for review' } },
    ],
  },
  {
    id: 'action-004',
    technicalId: 'send_approval_notification',
    name: { ar: 'إرسال إشعار الاعتماد', en: 'Send Approval Notification' },
    description: { ar: 'إرسال إشعار تلقائي لأصحاب المصلحة عند اعتماد أو رفض الطلب', en: 'Send automated notification to stakeholders upon approval or rejection' },
    category: 'الإشعارات والتواصل',
    riskLevel: 'low',
    status: 'approved',
    version: '3.0',
    riskProbability: 1,
    riskImpact: 1,
    deprecated: false,
    createdAt: '2025-09-01T08:00:00Z',
    updatedAt: '2026-04-10T12:00:00Z',
    inputs: [
      { name: 'recipient_ids', type: 'array', required: true, description: { ar: 'قائمة معرفات المستلمين', en: 'Recipient IDs list' } },
      { name: 'notification_type', type: 'enum', required: true, description: { ar: 'نوع الإشعار', en: 'Notification type' } },
      { name: 'record_reference', type: 'string', required: true, description: { ar: 'مرجع السجل', en: 'Record reference' } },
    ],
    outputs: [
      { name: 'sent_count', type: 'number', description: { ar: 'عدد الإشعارات المرسلة', en: 'Number of notifications sent' } },
      { name: 'delivery_status', type: 'object', description: { ar: 'حالة التسليم لكل مستلم', en: 'Delivery status per recipient' } },
    ],
    expectedErrors: [
      { code: 'INVALID_RECIPIENT', description: { ar: 'معرف مستلم غير صحيح', en: 'Invalid recipient ID' } },
    ],
    permissions: [
      { role: 'employee', canView: true, canExecute: false },
      { role: 'supervisor', canView: true, canExecute: true },
      { role: 'manager', canView: true, canExecute: true },
      { role: 'system_admin', canView: true, canExecute: true },
    ],
    usedIn: [
      { type: 'workflow', id: 'wf-002', name: { ar: 'مسار طلبات الموارد البشرية', en: 'HR Requests Workflow' }, path: '/workflow-canvas-builder' },
    ],
    versions: [
      { version: '1.0', status: 'archived', createdAt: '2025-09-01T08:00:00Z', changedBy: 'user-001', changelog: { ar: 'الإصدار الأولي', en: 'Initial release' } },
      { version: '3.0', status: 'approved', createdAt: '2026-04-10T12:00:00Z', changedBy: 'user-001', changelog: { ar: 'دعم قنوات إشعار متعددة', en: 'Multi-channel notification support' } },
    ],
    auditLog: [],
  },
  {
    id: 'action-005',
    technicalId: 'bulk_status_update',
    name: { ar: 'تحديث الحالة الجماعي', en: 'Bulk Status Update' },
    description: { ar: 'تحديث حالة مجموعة من السجلات دفعة واحدة وفق صلاحيات المستخدم', en: 'Update status of multiple records in bulk according to user permissions' },
    category: 'إدارة السجلات',
    riskLevel: 'critical',
    status: 'under_review',
    version: '1.0',
    riskProbability: 4,
    riskImpact: 5,
    deprecated: false,
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-07-12T16:00:00Z',
    inputs: [
      { name: 'record_ids', type: 'array', required: true, description: { ar: 'قائمة معرفات السجلات', en: 'Record IDs list' } },
      { name: 'target_status', type: 'enum', required: true, description: { ar: 'الحالة المستهدفة', en: 'Target status' } },
      { name: 'reason', type: 'text', required: true, description: { ar: 'سبب التغيير', en: 'Change reason' } },
    ],
    outputs: [
      { name: 'updated_count', type: 'number', description: { ar: 'عدد السجلات المحدثة', en: 'Updated records count' } },
      { name: 'failed_ids', type: 'array', description: { ar: 'السجلات التي فشل تحديثها', en: 'Records that failed to update' } },
    ],
    expectedErrors: [
      { code: 'PARTIAL_FAILURE', description: { ar: 'فشل تحديث بعض السجلات', en: 'Partial update failure' } },
      { code: 'PERMISSION_DENIED', description: { ar: 'صلاحية غير كافية لتحديث جماعي', en: 'Insufficient permission for bulk update' } },
    ],
    permissions: [
      { role: 'employee', canView: false, canExecute: false },
      { role: 'supervisor', canView: true, canExecute: false },
      { role: 'manager', canView: true, canExecute: true },
      { role: 'system_admin', canView: true, canExecute: true },
    ],
    usedIn: [],
    versions: [
      { version: '1.0', status: 'under_review', createdAt: '2026-06-01T08:00:00Z', changedBy: 'user-001', changelog: { ar: 'الإصدار الأولي — قيد المراجعة', en: 'Initial release — under review' } },
    ],
    auditLog: [
      { id: 'audit-009', userId: 'user-001', userName: { ar: 'محمد الحربي', en: 'Mohammed Al-Harbi' }, action: 'created', timestamp: '2026-06-01T08:00:00Z', details: { ar: 'إنشاء الإجراء الحرج', en: 'Critical action created' } },
    ],
  },
];