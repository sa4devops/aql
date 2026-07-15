# FEATURE_HANDOFF.md
# عقل / AQL — Feature Handoff Document

> **Trial Round**: R1.1 | **Status**: Frontend Mock Only | **Date**: 2026-07-15

---

## 1. Implemented Screens

| Screen | Route | Status |
|--------|-------|--------|
| Dashboard / Home | `/` | ✅ Implemented |
| Record List | `/enterprise-data-table-record-list` | ✅ Implemented |
| Record Type Builder | `/record-type-builder` | ✅ Implemented |
| Workflow Builder | `/workflow-canvas-builder` | ✅ Implemented |
| Action Registry | `/action-registry` | ✅ Implemented |
| Action Detail | `/action-registry/[id]` | ✅ Implemented |
| UI Showcase | `/ui-showcase-design-playground` | ✅ Implemented |

---

## 2. Navigation

- Shell: `AppShell` with collapsible Sidebar
- Nav groups: Main, Records, Workflows, Governance, System
- Active state: `pathname.startsWith(href)` matching
- Breadcrumbs: Per-page via `AppShell` prop

---

## 3. Mock Data

All data is in `src/mocks/data.ts`:

| Export | Count | Description |
|--------|-------|-------------|
| `RECORD_TYPES` | 5+ | Record type definitions with sections and fields |
| `WORKFLOWS` | 3+ | Workflow definitions with nodes and edges |
| `ACTIONS` | 10+ | Governance action definitions |
| `USERS` | 8 | Mock users with roles |
| `DEPARTMENTS` | 8 | Department list |
| `RECORD_INSTANCES` | 20+ | Sample record instances |

---

## 4. Types

All TypeScript interfaces in `src/mocks/types.ts`:

- `RecordType`, `RecordSection`, `RecordField`, `ValidationRule`
- `Workflow`, `WorkflowNode`, `WorkflowEdge`, `WorkflowVersion`
- `Action`, `ActionInput`, `ActionOutput`, `ActionPermission`
- `MockUser`, `Department`, `RecordInstance`
- `StatusValue`, `RiskLevel`, `ClassificationLevel`, `UserRole`, `FieldType`

---

## 5. UI States Implemented

| State | Screens |
|-------|---------|
| Normal | All |
| Read-only (role-based) | Builder, Workflow, Action Registry |
| Saving (async mock) | Builder, Workflow |
| Validation error | Builder, Workflow |
| Empty (no sections/fields) | Builder |
| Simulation (step-by-step) | Workflow |
| Loading guard (hydration) | Builder, Workflow |

---

## 6. Proposed API Needs (Backend Integration Points)

These are marked as comments in the code (`// Backend integration point:`):

| Operation | Method | Path |
|-----------|--------|------|
| Save Record Type | PUT | `/api/record-types/:id` |
| Create Record Type | POST | `/api/record-types` |
| Save Workflow | PUT | `/api/workflows/:id` |
| Publish Workflow | PATCH | `/api/workflows/:id/publish` |
| List Actions | GET | `/api/actions` |
| Get Action | GET | `/api/actions/:id` |
| List Records | GET | `/api/records` |
| Create Record | POST | `/api/records` |

---

## 7. Permission Expectations

| Role | Record Builder | Workflow Builder | Action Registry |
|------|---------------|-----------------|-----------------|
| `employee` | Read-only | Read-only + Simulate | View only |
| `supervisor` | Read-only | Read-only + Simulate | View only |
| `manager` | Full edit | Full edit | View + Execute |
| `system_admin` | Full edit | Full edit | Full access |

---

## 8. Dependencies

| Package | Version | Used For | Decision |
|---------|---------|----------|----------|
| next | 15.5.18 | Framework | Keep |
| react | 19.0.3 | UI | Keep |
| react-dom | 19.0.3 | DOM | Keep |
| typescript | ^5 | Types | Keep |
| tailwindcss | 3.4.6 | Styling | Keep |
| @tailwindcss/typography | ^0.5.16 | Prose styles | Keep |
| @tailwindcss/forms | ^0.5.10 | Form resets | Keep |
| lucide-react | ^1.7.0 | Icons (only icon library) | Keep |
| reactflow | ^11.11.4 | Workflow canvas | Keep — used in WorkflowPage |
| @tanstack/react-table | ^8.21.3 | Record list table | Keep — used in RecordsPage |
| @tanstack/react-virtual | ^3.13.6 | Virtual scrolling | Keep — used in RecordsPage |
| zustand | ^5.0.4 | State management | Keep — used in builder state |
| zod | ^3.24.4 | Validation schemas | Keep — used in form validation |
| recharts | ^2.15.2 | Charts on dashboard | Keep — used in ShowcasePage/Dashboard |
| sonner | ^2.0.3 | Toast notifications | Keep — used for save feedback |
| @dhiwise/component-tagger | ^1.0.15 | Platform tooling | Keep — required by platform |
| @heroicons/react | ^2.2.0 | Icons | **REMOVED** — Lucide is the only icon library |
| @netlify/plugin-nextjs | ^5.11.1 | Netlify deploy | **REMOVED** — not needed |

---

## 9. Known Gaps

- Real drag-and-drop field reordering (currently up/down buttons)
- Field conditions builder (placeholder UI only)
- Permissions matrix editor (visibility roles only, no full RBAC)
- Workflow history / version diff UI
- Real-time collaboration
- Full keyboard navigation on React Flow canvas
- Mobile layout for builder screens (desktop-first)
- Offline font files (referenced but may not be physically present — falls back to system fonts)

---

## 10. What Backend Needs Later

- Authentication service (JWT / session)
- Record Type CRUD API
- Workflow CRUD + publish/version API
- Action Registry API with audit log
- Record Instance CRUD + search/filter API
- File upload service (for attachment fields)
- Notification service
- Permission/RBAC service

---

## 11. Out of Scope (This Trial)

- Real workflow execution engine
- AI/LLM integration
- Document generation
- External system integrations
- Production deployment configuration
- Multi-tenant support

---

## 12. Build Quality Results

See `R1_1_CORRECTION_REPORT.md` for actual type-check, lint, and build results.
