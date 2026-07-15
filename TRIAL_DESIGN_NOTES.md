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
```

### Dark Theme Key Tokens
```
--background: #0F172A
--surface: #1E293B
--text-primary: #F1F5F9
--border: #334155
```

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

## 7. Experimental / Trial Decisions

The following are trial decisions that should NOT be treated as final:

- Accent color (Indigo vs Navy — not finalized)
- Font selection (Cairo — pending brand approval)
- Sidebar width (240px — may change)
- Inspector panel width (280-300px — may change)
- Mock Data structure (will be replaced by real API)
- Simulation Switcher (dev tool — not for production)

---

## 8. Known Gaps (not implemented in this trial)

- Real drag-and-drop reordering (currently uses up/down buttons)
- Field-to-field conditions builder (UI placeholder only)
- Permissions matrix editor (visibility roles only)
- Workflow history / versioning UI
- Real-time collaboration indicators
- Accessibility: full keyboard navigation on canvas not implemented
- Mobile layout for builder screens
