---
title: "ADR-0003: Design Token System and Dark Mode Architecture"
tags: ["frontend", "vue3", "fsd", "adr", "theming", "dark-mode", "css-variables"]
created_at: "2026-10-17"
last_updated_at: "2026-10-17"
---

# ADR-0003: Design Token System and Dark Mode Architecture

## Status
Accepted

## Context and Problem Statement
The Lead Operations & Triage Dashboard in `smb-ops-frontend` currently utilizes hardcoded light-theme color literals (e.g. `#ffffff`, `#f9fafb`, `#111827`, `#e5e7eb`) within scoped component CSS blocks. Operators monitoring pipelines in low-light environments require dark mode styling. 

We require an architectural approach for theming that:
1. Supports persistent theme selection (`light`, `dark`, `system`).
2. Adheres to Feature-Sliced Design (FSD) unidirectional dependency flow.
3. Minimizes runtime overhead and bundle size without introducing large CSS utility frameworks.
4. Prevents Flash of Unstyled Theme (FOUT) on application boot.

## Decision Drivers
* **FSD Layer Compliance:** Theming tokens and primitives must reside in `shared/` without circular dependencies to entities, features, or pages.
* **Zero Runtime Overhead:** Leverage native CSS custom properties (design tokens) over JS runtime styling computations.
* **Persistent Preference:** Retain operator selection across browser reloads via `localStorage` while defaulting cleanly to system `prefers-color-scheme`.
* **High-Density Triage Readability:** Maintain WCAG AA contrast ratios for opportunity badges, tabular data, and input controls across both themes.

## Considered Options
1. **Utility-First Framework Injection (Tailwind CSS / UnoCSS):** Introduce Tailwind with `.dark:` modifier classes.
   * *Cons:* Requires re-configuring Vite toolchain, mutating project dependencies, and refactoring every authored component template.
2. **Component-Level Scoped State:** Bind `isDark` boolean to each component and use Vue `:style` or dynamic class attributes.
   * *Cons:* Tight coupling, fragmented style logic, and difficult maintenance.
3. **CSS Custom Properties Design Token System with Shared Composable (Chosen):**
   * Define global semantic design tokens in `shared/styles/theme.css` scoped under `:root` and `:root.dark`.
   * Implement `useTheme` reactive composable in `shared/composables/useTheme.ts` managing `localStorage` and media queries.
   * Provide a decoupled `ThemeToggle.vue` component in `shared/ui/`.
   * Refactor scoped CSS rules across features and entities to consume semantic CSS tokens (`var(--bg-primary)`, `var(--text-primary)`, `var(--border-color)`).

## Decision Outcome
Chosen Option: **CSS Custom Properties Design Token System with Shared Composable** (Option 3).

### Positive Consequences
* **Clean Decoupling:** Components remain strictly declarative, referencing standard semantic tokens without knowing theme state logic.
* **Instant Switching:** Modifying a single class on `document.documentElement` (`.dark`) transitions the entire DOM tree in $O(1)$ CSS paint.
* **FSD Compliant:** Design tokens and the `useTheme` composable reside cleanly in `src/shared/`.

### Negative Consequences
* Scoped component stylesheets must be audited and migrated from hex literals to semantic CSS variables.

## Compliance and Verification
* Linter and FSD architecture boundary checks (`pnpm lint`) must verify `shared/` encapsulation.
* Unit test `tests/unit/useTheme.spec.ts` must assert state toggling, `localStorage` synchronization, and root DOM mutation.
