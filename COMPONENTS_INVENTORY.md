# COMPONENTS_INVENTORY.md
# عقل / AQL — Components Inventory

> Generated for R1.1 delivery. All components are local — no external component libraries.

---

## Shell Components

### AppShell
- **Path**: `src/components/AppShell.tsx`
- **Purpose**: Root layout wrapper — provides AppContext, Sidebar, Topbar
- **Screens**: All screens
- **Variants**: Collapsed sidebar / expanded sidebar
- **States**: Loading (useEffect hydration guard), normal
- **Responsive**: Sidebar collapses to icon-only
- **Reusable**: Yes — used by every page
- **Dependencies**: `next/link`, `next/navigation`, `@/app-routes/routes`, `@/mocks/types`, `@/mocks/data`
- **Exports**: `AppShell` (default), `AppContext`, `useApp`

### StatusBadge
- **Path**: `src/components/StatusBadge.tsx`
- **Purpose**: Displays record/workflow status with color-coded badge
- **Screens**: Record List, Record Type Builder, Action Registry
- **Variants**: draft, under_review, approved, rejected, archived
- **States**: All status values
- **Responsive**: Inline element
- **Reusable**: Yes
- **Dependencies**: `@/mocks/types`

### AppImage
- **Path**: `src/components/ui/AppImage.tsx`
- **Purpose**: Image wrapper with fallback
- **Screens**: Any screen with images
- **Reusable**: Yes
- **Dependencies**: `next/image`

### AppIcon
- **Path**: `src/components/ui/AppIcon.tsx`
- **Purpose**: Icon wrapper utility
- **Screens**: Any
- **Reusable**: Yes

### AppLogo
- **Path**: `src/components/ui/AppLogo.tsx`
- **Purpose**: AQL logo component
- **Screens**: Sidebar brand area
- **Reusable**: Yes

---

## Feature Components

### BuilderPage
- **Path**: `src/features/builder/BuilderPage.tsx`
- **Purpose**: Record Type Builder — full authoring interface
- **Screens**: `/record-type-builder`
- **Variants**: Structured / Visual (Canvas) / Schema modes
- **States**: Normal, Read-only (employee/supervisor role), Saving, Validation error, Empty sections
- **Responsive**: Desktop-first (≥1024px for full functionality)
- **Reusable**: No — feature-specific
- **Dependencies**: `AppShell`, `StatusBadge`, `@/mocks/types`, `@/mocks/data`
- **Sub-components**:
  - `Inspector` — Field properties panel (Label AR/EN, Field Type, Required, Help Text, Visibility Roles, Options)
  - `FieldCard` — Clickable field row with move up/down/delete
  - `SectionBlock` — Collapsible section with field list and add-field menu
  - `SchemaView` — Read-only JSON schema display
  - `PreviewModal` — Form preview overlay

### WorkflowPage
- **Path**: `src/features/workflow/WorkflowPage.tsx`
- **Purpose**: Workflow Builder — canvas-based workflow authoring
- **Screens**: `/workflow-canvas-builder`
- **Variants**: Edit / Read-only / Simulation mode
- **States**: Normal, Read-only, Simulating (step-by-step), Saving, Validation error
- **Responsive**: Desktop-first
- **Reusable**: No — feature-specific
- **Dependencies**: `AppShell`, `ReactFlowCanvas`, `@/mocks/types`, `@/mocks/data`, `next/navigation`
- **Sub-components**:
  - `WorkflowSelector` — Left panel listing all workflows
  - `NodePalette` — Draggable node type palette
  - `NodeInspector` — Contextual inspector for selected node (Name AR/EN, Type, Role, Deadline, Conditions)
  - `EdgeInspector` — Contextual inspector for selected edge (Label AR/EN, Condition)
  - `EmptyInspector` — Placeholder when nothing selected

### ReactFlowCanvas
- **Path**: `src/features/workflow/ReactFlowCanvas.tsx`
- **Purpose**: React Flow canvas for workflow visualization and editing
- **Screens**: `/workflow-canvas-builder`
- **Variants**: Edit / Read-only / Simulation
- **States**: Normal, Simulating (active node highlight), Read-only (no drag/connect)
- **Responsive**: Fills available container
- **Reusable**: No — tightly coupled to WorkflowPage
- **Dependencies**: `reactflow`, `@/mocks/types`, `WorkflowPage` (NODE_TYPE_CONFIG)
- **Interactions**: Node click → select + open Inspector, Edge click → select + open Inspector, Pane click → deselect, Drag from palette → add node, Connect handles → add edge

### RecordsPage
- **Path**: `src/features/records/RecordsPage.tsx`
- **Purpose**: Enterprise data table for record instances
- **Screens**: `/enterprise-data-table-record-list`
- **Dependencies**: `AppShell`, `@tanstack/react-table`, `@/mocks/data`

### ActionRegistryPage
- **Path**: `src/features/governance/ActionRegistryPage.tsx`
- **Purpose**: List of governance actions
- **Screens**: `/action-registry`
- **Dependencies**: `AppShell`, `StatusBadge`, `@/mocks/data`

### ActionDetailPage
- **Path**: `src/features/governance/ActionDetailPage.tsx`
- **Purpose**: Detail view for a single action
- **Screens**: `/action-registry/[id]`
- **Dependencies**: `AppShell`, `StatusBadge`, `@/mocks/data`

### ShowcasePage
- **Path**: `src/features/showcase/ShowcasePage.tsx`
- **Purpose**: Living design system showcase
- **Screens**: `/ui-showcase-design-playground`
- **Dependencies**: `AppShell`, `recharts`

---

## Mock Data

### types.ts
- **Path**: `src/mocks/types.ts`
- **Purpose**: All TypeScript interfaces and types
- **Exports**: `RecordType`, `RecordField`, `RecordSection`, `Workflow`, `WorkflowNode`, `WorkflowEdge`, `Action`, `MockUser`, etc.

### data.ts
- **Path**: `src/mocks/data.ts`
- **Purpose**: Static mock data arrays
- **Exports**: `RECORD_TYPES`, `WORKFLOWS`, `ACTIONS`, `USERS`, `DEPARTMENTS`, `RECORD_INSTANCES`

### index.ts
- **Path**: `src/mocks/index.ts`
- **Purpose**: Re-exports from data.ts and types.ts

---

## Routing

- **Path**: `src/app-routes/routes.ts`
- **Purpose**: Centralized route constants
- **Exports**: `ROUTES` object with all page paths
