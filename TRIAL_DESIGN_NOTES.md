# TRIAL_DESIGN_NOTES.md
# عقل / AQL — Trial UI Design Notes

> **Scope**: This document records design decisions made during the trial UI generation. It is NOT a final Design System specification.

---

## 1. Visual Identity

### Wordmark «عقل»
- **Color rule**: `var(--text-primary)` in both Light and Dark themes
- **Rationale**: Product name is monochrome — Accent color is reserved for interactive states, active items, buttons, focus, and selection
- **Locations**: Sidebar brand area, any screen header referencing the product name
- **Accent usage allowed on**: Active nav items, primary buttons, focus rings, selected elements, toggles

### Accent Color
- **Working candidate**: Indigo (`#6366F1` light / `#818CF8` dark)
- **Alternative**: Navy (`#1B365D`)
- **Status**: Trial candidate — not finalized as brand color
- **Switcher**: Available in Sidebar bottom controls (Indigo / Navy toggle)

---

## 2. Light / Dark Theme

### Implementation
- CSS custom properties (`--background`, `--surface`, `--text-primary`, etc.) defined in `src/styles/tailwind.css`
- Dark theme overrides under `.dark` class on `<html>`
- Theme persisted in `localStorage` key `aql-theme`
- Flash prevention: inline `<script>` in `layout.tsx` runs before React hydration

### Light Theme Key Tokens
```
--background: #F8FAFC
--surface: #FFFFFF
--text-primary: #0F172A
--border: #E2E8F0
--border-strong: #CBD5E1   ← used for React Flow edge color
```

### Dark Theme Key Tokens
```
--background: #0F172A
--surface: #1E293B
--text-primary: #F1F5F9
--border: #334155
--border-strong: #475569   ← used for React Flow edge color
```

> **Confirmed (R1.2 audit)**: `--border-strong` is explicitly defined in both `:root` (Light) and `.dark` (Dark) blocks in `src/styles/tailwind.css`. No missing token.

---

## 3. RTL / LTR Layout

- Default language: Arabic (RTL)
- Direction set on `<html dir="rtl|ltr">` via `AppShell`
- Persisted in `localStorage` key `aql-lang`
- Tailwind logical properties used throughout (`ms-`, `me-`, `ps-`, `pe-`, `insetInlineStart`, `insetInlineEnd`)
- Language toggle in Sidebar bottom controls

---

## 4. Typography

### Fonts (all local — no CDN)
| Font | Usage | Files |
|------|-------|-------|
| Cairo | Arabic UI text | `/public/assets/fonts/Cairo-*.woff2` |
| Inter | Latin/English UI text | `/public/assets/fonts/Inter-*.woff2` |
| JetBrains Mono | Code / Schema view | `/public/assets/fonts/JetBrainsMono-Regular.woff2` |

> **Note**: Font files referenced in CSS but may not be physically present in `/public/assets/fonts/`. If fonts fail to load, the browser falls back to system sans-serif. This is acceptable for the trial.

---

## 5. Component Architecture

### Shell
- `AppShell` wraps all pages — provides `AppContext` (lang, theme, simMode, simRole)
- Sidebar (collapsible) + Topbar (breadcrumbs + search + notifications)
- Simulation Switcher (bottom-left overlay) for role/mode testing

### Design Tokens
- All colors, spacing, shadows via CSS custom properties
- No hardcoded hex values in component files
- Tailwind used for layout/spacing, CSS vars for semantic colors

---

## 6. Responsive Strategy

- Desktop-first (min 1024px for builder screens)
- Mobile warning shown on builder screens < 1024px
- Sidebar collapses to icon-only mode on smaller viewports
- Tables use TanStack Virtual for large datasets

---

## 7. React Flow Edge Color Strategy (R1.2 Decision)

### Problem
SVG `stroke` attributes cannot reference CSS custom properties directly. A hardcoded hex value (`#94a3b8`) was used initially, which broke Light/Dark theme consistency.

### Solution: `getComputedStyle` + `MutationObserver`
- On mount, `getComputedStyle(document.documentElement).getPropertyValue('--border-strong')` reads the resolved token value from the active theme.
- A `MutationObserver` watches `<html>` for `class` and `data-theme` attribute changes. When the theme switches, the observer fires and re-reads the token, updating `edgeColor` state in `ReactFlowCanvas`.
- React Flow re-renders edges with the new color via `defaultEdgeOptions` and `toRFEdges`.
- SSR fallback: `#94a3b8` (the Light theme value of `--border-strong`) is used only when `window` is unavailable.

### MutationObserver Cleanup (R1.2 Audit — Confirmed Clean)
```typescript
useEffect(() => {
  const resolve = () => setEdgeColor(getThemeToken('--border-strong', EDGE_COLOR_FALLBACK));
  resolve();
  const observer = new MutationObserver(resolve);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  return () => observer.disconnect();  // ← cleanup prevents memory leaks and duplicate observers
}, []);
```
- The `return () => observer.disconnect()` cleanup is present and correct.
- The empty dependency array `[]` ensures the observer is created once and disconnected on unmount.
- No duplicate observer risk.

### Token Definitions (Confirmed in `src/styles/tailwind.css`)
| Theme | Token | Value |
|-------|-------|-------|
| Light (`:root`) | `--border-strong` | `#CBD5E1` |
| Dark (`.dark`) | `--border-strong` | `#475569` |

---

## 8. Linked Record Model (R1.2 Decision)

### Terminology
| Term | Definition | Example |
|------|-----------|---------|
| **Record Type** | Schema / blueprint for a category of records | `rt-leave-request` — طلب إجازة |
| **Record Reference Number** | User-visible reference number for an actual record instance | `REF-2024-00100` |
| **Internal Record ID** | Stable internal DB identifier — never changes | `rec_a1b2c3d4` |

### Approved Data Model
```typescript
interface LinkedRecord {
  recordReferenceNumber: string;  // what the user types (e.g. "REF-2024-00100")
  resolvedRecordId: string;       // stable internal DB id (e.g. "rec_a1b2c3d4")
  recordDisplayName: string;      // human-readable label shown after lookup
  recordTypeId: string;           // Record Type this instance belongs to (e.g. "rt-leave-request")
}
```

### Why `resolvedRecordId` is stored separately
- The display reference number (`recordReferenceNumber`) may change format over time.
- Storing the stable internal ID (`resolvedRecordId`) ensures linked records never break if the reference format is updated.

### Production Architecture (NOT implemented in trial)
```
User types reference number
  → 300ms debounce
  → GET /api/records/lookup?ref={referenceNumber}
  → Response: { record: LinkedRecord } or error code
  → Store resolvedRecordId internally
  → Display recordDisplayName to user
```
Records must NOT be loaded into the browser. No dropdown, no local array search.

---

## 9. Linked Record Lookup — 6 States (R1.2 Decision)

| State | Trigger | UI |
|-------|---------|-----|
| `idle` | Field is empty | Hint text |
| `searching` | 300ms debounce fired, awaiting response | Spinner + "Searching..." |
| `found` | Exactly one record matched | Green card with record name and IDs |
| `not_found` | No record matched | Red inline message |
| `ambiguous` | More than one record matched | Yellow warning + picker list |
| `service_unavailable` | Simulated API/network failure | Red card with retry hint |

### Mock Test Scenarios (Deterministic — R1.2)
| Input | State | Notes |
|-------|-------|-------|
| `REF-2024-00100` | `found` | Returns one record: `rec_a1b2c3d4` |
| `REF-9999` | `not_found` | No matching record |
| `REF-AMB` | `ambiguous` | Returns two records with same reference |
| `REF-ERR` | `service_unavailable` | Simulates API failure |
| (anything else) | `not_found` | Default fallback |

---

## 10. Experimental / Trial Decisions

The following are trial decisions that should NOT be treated as final:

- Accent color (Indigo vs Navy — not finalized)
- Font selection (Cairo — pending brand approval)
- Sidebar width (240px — may change)
- Inspector panel width (280-300px — may change)
- Mock Data structure (will be replaced by real API)
- Simulation Switcher (dev tool — not for production)
- Mock Lookup scenarios (will be replaced by Backend Lookup API)

---

## 11. Known Gaps (not implemented in this trial)

- Real drag-and-drop reordering (currently uses up/down buttons)
- Field-to-field conditions builder (UI placeholder only)
- Permissions matrix editor (visibility roles only)
- Workflow history / versioning UI
- Real-time collaboration indicators
- Accessibility: full keyboard navigation on canvas not implemented
- Mobile layout for builder screens
- Backend Lookup API (replaced by deterministic mock scenarios in trial)
