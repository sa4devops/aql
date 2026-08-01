# DESIGN_SYSTEM_REFERENCE.md

## Status

```
VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
OFFLINE DESIGN TARGET — VERIFICATION PENDING
```

This document is an internal technical reference within the `aql` project.
It is NOT a governing specification. It does NOT constitute approval of a Visual Baseline.
It does NOT authorize production rollout or main-branch merge.

---

## Purpose

To extract the visual system and reusable components from the three best existing screens
in the project, and consolidate them into a single organized reference called:

**Enterprise UI Reference Showcase** — accessible at `/ui-reference`

---

## Source Screens and Routes

| # | Screen Name | Route | Rationale |
|---|---|---|---|
| 1 | Enterprise Data Table / Record List | `/enterprise-data-table-record-list` | Best example of table patterns, bulk actions, filters, drawer, skeleton, pagination, status badges |
| 2 | Action Registry | `/action-registry` | Best example of governance table, search, sort, risk badges, empty/error states |
| 3 | UI Showcase Design Playground | `/ui-showcase-design-playground` | Best example of component catalog, button variants, form fields, dialog/drawer/toast patterns |

---

## Source Commit SHA

> Branch: `rocket-update`
> Commit SHA: To be recorded after final push to `sa4devops/aql`

---

## Adopt / Correct / Reject / Feature-only Inventory

### ✅ ADOPT — Extracted to src/design-system/

| Element | Source | Location |
|---|---|---|
| CSS Custom Property tokens (all) | tailwind.css | `src/design-system/tokens/index.ts` |
| Color tokens: accent, gray, surface, text, semantic, risk, classification | tailwind.css | `src/design-system/tokens/index.ts` |
| Spacing scale | tailwind.css | `src/design-system/tokens/index.ts` |
| Radius tokens (sm/md/lg/xl/full) | tailwind.css | `src/design-system/tokens/index.ts` |
| Shadow tokens (elevation-1, elevation-2) | tailwind.css | `src/design-system/tokens/index.ts` |
| Typography tokens (Cairo, Inter, JetBrains Mono — all local) | tailwind.css | `src/design-system/tokens/index.ts` |
| Layout tokens (sidebar-width, topbar-height) | tailwind.css | `src/design-system/tokens/index.ts` |
| Motion tokens (150ms/200ms/300ms) | tailwind.css | `src/design-system/tokens/index.ts` |
| Breakpoints | tailwind.config.js | `src/design-system/tokens/index.ts` |
| Typography scale primitives | ShowcasePage | `src/design-system/primitives/Typography.tsx` |
| Button component (all variants/sizes/states) | ShowcasePage, RecordsPage | `src/design-system/components/Button.tsx` |
| Form fields (Input, Textarea, Select, Switch, Checkbox, SearchInput) | ShowcasePage, BuilderPage | `src/design-system/components/FormFields.tsx` |
| Card, StatCard, Badge, Avatar, Skeleton, KVRow, EmptyState, ErrorState, MaskedValue, Chip | RecordsPage, ActionRegistryPage | `src/design-system/components/DataDisplay.tsx` |
| Dialog, Drawer, Toast, Tooltip, Confirmation | ShowcasePage, RecordsPage | `src/design-system/components/Overlays.tsx` |
| Breadcrumb, Tabs, BulkActionBar, FilterBar, Pagination, PageHeader, Disclosure | RecordsPage, ActionRegistryPage | `src/design-system/patterns/index.tsx` |
| App Shell (Sidebar, Topbar, Nav) | AppShell.tsx | `src/design-system/shell/index.ts` (re-export) |
| StatusBadge, RiskBadge, ClassificationBadge | StatusBadge.tsx | `src/components/StatusBadge.tsx` (canonical) |
| Light/Dark theme definitions | AppShell.tsx, tailwind.css | `src/design-system/themes/index.ts` |

### ⚠️ CORRECT — Adopted with documented corrections

| Element | Issue | Correction Applied |
|---|---|---|
| Edge/connection colors in ReactFlowCanvas | Hardcoded `#94a3b8` | Replaced with `getComputedStyle` + `MutationObserver` on `--border-strong` token |
| LinkedRecord model | Mixed Record Type and Record Instance | Separated into `recordReferenceNumber`, `resolvedRecordId`, `recordDisplayName`, `recordTypeId` |
| Mock lookup | Non-deterministic random states | Replaced with 4 deterministic test scenarios with fixed 350ms latency |

### ❌ REJECT — Not extracted

| Element | Reason |
|---|---|
| Business-specific screen titles | Feature-specific, not reusable |
| Mock data records (names, departments, specific values) | Feature-specific |
| API operation names and technical IDs | Feature-specific |
| Permission matrices per feature | Feature-specific |
| Business route names | Feature-specific |

### 🔒 FEATURE-ONLY — Not moved to design-system/

| Element | Location | Reason |
|---|---|---|
| `LinkedRecordLookup` component | `WorkflowPage.tsx` | Used only in workflow feature |
| `NodeInspector` component | `WorkflowPage.tsx` | Used only in workflow feature |
| `ReactFlowCanvas` | `src/features/workflow/` | Workflow-specific |
| `BuilderPage` field drag-drop | `src/features/builder/` | Builder-specific |
| `ActionDetailPage` audit trail | `src/features/governance/` | Governance-specific |
| `ColumnVisibilityPanel` | `RecordsPage.tsx` | Records-specific |
| `RowDetailDrawer` | `RecordsPage.tsx` | Records-specific (business fields) |

---

## Token Locations

| Token Family | File |
|---|---|
| All design tokens | `src/design-system/tokens/index.ts` |
| CSS custom properties (source of truth) | `src/styles/tailwind.css` |
| Tailwind config mappings | `tailwind.config.js` |

---

## Component Locations

| Component | File |
|---|---|
| Button | `src/design-system/components/Button.tsx` |
| FormFields (Input, Textarea, Select, Switch, Checkbox, SearchInput) | `src/design-system/components/FormFields.tsx` |
| DataDisplay (Card, StatCard, Badge, Avatar, Skeleton, KVRow, EmptyState, ErrorState, MaskedValue, Chip) | `src/design-system/components/DataDisplay.tsx` |
| Overlays (Dialog, Drawer, Toast, Tooltip, Confirmation) | `src/design-system/components/Overlays.tsx` |
| Typography primitives | `src/design-system/primitives/Typography.tsx` |
| StatusBadge, RiskBadge, ClassificationBadge | `src/components/StatusBadge.tsx` |
| AppShell (canonical) | `src/components/AppShell.tsx` |

---

## Pattern Locations

| Pattern | File |
|---|---|
| Breadcrumb, Tabs, BulkActionBar, FilterBar, Pagination, PageHeader, Disclosure | `src/design-system/patterns/index.tsx` |

---

## Theme Locations

| Theme | File |
|---|---|
| Theme definitions (light/dark, indigo/navy) | `src/design-system/themes/index.ts` |
| CSS variables (source of truth) | `src/styles/tailwind.css` |

---

## Application Shell Location

| Element | Canonical Location |
|---|---|
| AppShell component | `src/components/AppShell.tsx` |
| AppContext, useApp hook | `src/components/AppShell.tsx` |
| Sidebar | Inside `AppShell.tsx` |
| Topbar | Inside `AppShell.tsx` |
| Navigation groups | Inside `AppShell.tsx` (getNavItems function) |
| Simulation Switcher | Inside `AppShell.tsx` |

---

## UI Reference Route

```
/ui-reference
src/app/ui-reference/page.tsx
```

---

## RTL/LTR Behavior

- Direction is controlled by `dir` attribute on `<html>` element
- Set by `AppShell` via `document.documentElement.setAttribute('dir', ...)`
- Persisted in `localStorage` as `aql-lang`
- CSS uses `insetInlineStart`, `insetInlineEnd`, `borderInlineStart`, `borderInlineEnd`, `paddingInlineStart`, `ms-auto` (logical properties)
- Font family switches: `var(--font-arabic)` for RTL, `var(--font-latin)` for LTR
- Sidebar collapse arrow direction is mirrored via CSS transform

---

## Light/Dark Behavior

- Theme is controlled by `dark` class on `<html>` element
- Set by `AppShell` via `document.documentElement.classList.toggle('dark', ...)`
- Persisted in `localStorage` as `aql-theme`
- Respects `prefers-color-scheme` on first visit
- All tokens have both `:root` (light) and `.dark` (dark) definitions in `tailwind.css`
- Dark mode is NOT a simple color inversion — it maintains visual hierarchy, contrast, and state clarity

---

## Responsive Behavior

- Mobile: Sidebar collapses, content stacks vertically
- Tablet: Sidebar can be toggled
- Desktop: Sidebar expanded by default
- All grids use responsive Tailwind classes (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)
- Tables are horizontally scrollable on small screens

---

## Known Gaps

1. **Offline font verification**: Font files referenced in `@font-face` declarations must exist at `/assets/fonts/Cairo-*.woff2`, `/assets/fonts/Inter-*.woff2`, `/assets/fonts/JetBrainsMono-Regular.woff2`. These paths are declared but file presence in `public/assets/fonts/` has not been verified in this task.
2. **Popover component**: Not present in reference screens — not extracted.
3. **Date picker**: Not present in reference screens — not extracted.
4. **File input**: Not present in reference screens — not extracted.
5. **Command palette**: Not present in reference screens — not extracted.
6. **Notification panel**: Visual placeholder only in Topbar — not a full component.

---

## Accessibility Gaps Not Yet Remediated

1. Focus trap in Dialog/Drawer is not fully implemented (focus moves to container but does not cycle within)
2. Keyboard navigation for custom Select is not implemented (uses native `<select>`)
3. Screen reader announcements for Toast are present (`role="alert"`) but auto-dismiss is not implemented
4. Skip-to-main-content link is not present in AppShell

---

## External Dependency Statement

### Rocket Platform Scripts (Blocking External Dependencies)

The following external scripts are injected by the Rocket platform in `src/app/layout.tsx`:

```html
<script type="module" async src="https://static.rocket.new/rocket-web.js?..." />
<script type="module" defer src="https://static.rocket.new/rocket-shot.js?..." />
```

**These scripts are outside the scope of `/ui-reference` and this task.**

- They are injected at the root layout level and affect ALL pages, not just `/ui-reference`
- Removing them would require modifying `layout.tsx` and could break the Rocket platform integration
- They are recorded here as **Blocking External Dependencies** for the offline compliance target
- `/ui-reference` itself contains ZERO external requests beyond what the root layout injects
- The `/ui-reference` page and all `src/design-system/` files contain no external URLs, CDN links, remote fonts, remote images, or external scripts

**Offline Compliance Status**: OFFLINE DESIGN TARGET — VERIFICATION PENDING
The page design is offline-compliant. The root layout scripts are a platform constraint, not a design-system decision.

---

## Instructions for Future Rocket Tasks

1. **Read this file first** before making any changes to the visual system
2. **Use `src/design-system/`** for all reusable component work
3. **Preserve the current App Shell** — do NOT rebuild Sidebar or Navigation from scratch
4. **Add new screens** to the current route and navigation structure in `AppShell.tsx`
5. **Do NOT change the Visual Baseline** without explicit owner approval
6. **Do NOT merge to main** — work on `rocket-update` branch only
7. **Do NOT create a new Design System** alongside the existing one — extend `src/design-system/`
8. **Do NOT move Feature-only components** to `src/design-system/` without justification
9. **Use semantic tokens** (CSS custom properties) — never hardcode hex values in components
10. **Test in both Light and Dark** before declaring a component complete
11. **Test in both RTL and LTR** before declaring a component complete

---

## Delivery Summary

### Files Created

| File | Purpose |
|---|---|
| `src/design-system/tokens/index.ts` | All design tokens extracted from tailwind.css |
| `src/design-system/primitives/Typography.tsx` | Typography scale primitives |
| `src/design-system/components/Button.tsx` | Button component |
| `src/design-system/components/FormFields.tsx` | Form field components |
| `src/design-system/components/DataDisplay.tsx` | Data display components |
| `src/design-system/components/Overlays.tsx` | Overlay components |
| `src/design-system/patterns/index.tsx` | Interaction patterns |
| `src/design-system/shell/index.ts` | Shell re-export |
| `src/design-system/themes/index.ts` | Theme definitions |
| `src/design-system/index.ts` | Main design system index |
| `src/app/ui-reference/page.tsx` | /ui-reference page (11 sections) |
| `DESIGN_SYSTEM_REFERENCE.md` | This document |

### Files Modified

| File | Change |
|---|---|
| `src/components/AppShell.tsx` | Added 'reference' icon + UI Reference nav link under System group |
| `src/app-routes/routes.ts` | Added `uiReference: '/ui-reference'` route |

---

## Governance Statement

```
STOP — The Enterprise UI Reference Showcase has been created as a visual-baseline candidate only.
No governing approval, visual-baseline approval, production rollout, business-feature implementation,
main-branch merge, tag, or release has occurred.
```
