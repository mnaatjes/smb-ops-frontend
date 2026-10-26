---
title: "Action Table: Base Site Shell Interaction and Navigation Contracts"
status: "accepted"
date: "2026-10-26"
tags: ["action-table", "architecture", "navigation", "contracts", "base-site-shell"]
---

# Action Table: Base Site Shell Interaction and Navigation Contracts

## 1. Overview & Scope

This Action Table defines the deterministic interaction contract for all user triggers across the universal application shell (`BaseSiteLayout.vue`), navigation rail (`BaseAside.vue`), mobile overlay sheet, and global orientation primitives.

---

## 2. Shell & Navigation Action Matrix

| UI Element | Trigger Event | Component Prop / Emit | Store Action / Handler Target | Optimistic UI Behavior | Error Remediation / Guard |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Collapse Toggle (`◀`)** | `@click` | `emit('toggle-collapse')` | Mutates `isCollapsed = true`; writes `localStorage.setItem('smb_ops_rail_collapsed', 'true')` | Rail width animates from 240px to 64px (0.2s cubic-bezier); popover tooltips activate. | Rendered only when `!collapsed` on desktop (&ge; 768px). Hidden on mobile. |
| **Expand Rail Button (`▶`)** | `@click` | `emit('toggle-collapse')` | Mutates `isCollapsed = false`; writes `localStorage.setItem('smb_ops_rail_collapsed', 'false')` | Rail width animates from 64px to 240px; labels and count badges fade in. | Rendered only when `collapsed` on desktop (&ge; 768px) inside separate strip. |
| **Mobile Hamburger (`☰`)** | `@click` | Handler in layout | Sets `isMobileOpen = true` | Darkened backdrop mounts; `BaseAside` slides into view (280px width); body scroll locks. | Only rendered on mobile (&lt; 768px). Focus moves to first navigation link. |
| **Mobile Backdrop** | `@click` | Layout dismiss handler | Sets `isMobileOpen = false` | Backdrop unmounts; `BaseAside` translates off-canvas (`translateX(-100%)`); scroll unlocks. | Traps clicks outside the drawer sheet. |
| **Keyboard `Escape`** | `@keydown.window.esc` | Layout listener | Sets `isMobileOpen = false` | Closes mobile sheet immediately if currently open. | Ignored if `!isMobileOpen`. |
| **Navigation Link Button** | `@click` | `emit('select-item', item: NavItemDef)` | Calls `router.push(item.to)`; if on mobile, sets `isMobileOpen = false` | Active background highlight shifts immediately to clicked item. | If `item.id === activeId`, event terminates without redundant route dispatch. |
| **Theme Toggle (`ThemeToggle.vue`)** | `@click` | Composable `useTheme().toggleTheme()` | Toggles theme between `'light'` and `'dark'`; updates `<html data-theme="...">`; writes `localStorage` | Palette shifts instantaneously across all CSS variables; icon flips ☀️ / 🌙. | Validates theme string against `'light' \| 'dark'` union. |
| **Breadcrumb Node (`BaseBreadcrumb.vue`)** | `@click` | `emit('navigate', item: BreadcrumbItem)` | Navigates to route `item.to` | Navigates immediately to parent view. | Inactive and pointer-events disabled if `item.current === true`. |

---

## 3. Emitted Event Schemas & Typing

```typescript
export interface NavItemDef {
  id: string
  label: string
  icon: string
  to?: string
  badge?: number | string
  badgeVariant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'emerald'
}

export interface NavSectionDef {
  id: string
  tier: 'primary' | 'secondary' | 'tertiary'
  title?: string
  items: NavItemDef[]
}

// Emitted by BaseAside.vue
type BaseAsideEmits = {
  (e: 'update:collapsed', val: boolean): void
  (e: 'toggle-collapse'): void
  (e: 'select-item', item: NavItemDef): void
}

// Emitted by BaseBreadcrumb.vue
type BaseBreadcrumbEmits = {
  (e: 'navigate', item: BreadcrumbItem): void
}
```

---

## 4. Accessibility & Focus Invariants

1. **Aria Current State:** The currently active route link strictly carries `aria-current="page"`.
2. **Keyboard Navigation:**
   * Rail buttons are standard HTML `<button>` elements, fully navigable via `Tab` and activatable via `Enter` / `Space`.
   * When collapsed, hover and focus triggers floating popover hints via `[data-tooltip]`.
3. **Scroll Containment:** In mobile drawer mode, stage viewport scroll is locked via `overflow: hidden` on document body until dismissed.
