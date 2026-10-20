---
title: "UI Component Catalog & Visual Truth Reference"
tags: ["diataxis", "reference", "components", "design-system", "cheat-sheet"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
---

# UI Component Catalog & Visual Truth Reference

A quick-scan visual cheat sheet of core UI components in `smb-ops-frontend`, specifying visual appearance, design tokens, interactive behaviors, and state matrices.

---

## 1. Base Components (`src/shared/ui/`)

### BaseButton (`BaseButton.vue`)
- **Role:** Primary and secondary interactive trigger for actions, submissions, and modal controls.
- **Visuals:**
  - `primary`: Solid emerald surface (`bg-emerald-600`), hover `bg-emerald-500`, white text, rounded corners (`rounded-lg`).
  - `secondary`: Dark slate surface (`bg-slate-700`), hover `bg-slate-600`, slate text (`text-slate-200`).
  - `danger`: Red surface (`bg-rose-600`), hover `bg-rose-500`, white text.
- **State Matrix:**
  | State | Visual Treatment | Interaction |
  |---|---|---|
  | Default | Solid color, standard contrast | Emits `click` |
  | Hover | 10% brightness increase, slight shadow | Pointer cursor |
  | Active / Focus | Inset ring / focus border | Emits `click` |
  | Disabled | `opacity-50`, cursor `not-allowed` | Clicks prevented |
  | Loading | Spinner icon visible, label muted | Double clicks debounced |

---

### BaseBadge (`BaseBadge.vue`)
- **Role:** Compact visual pill for statuses, scores, work categories, and tiers.
- **Visuals:**
  - `emerald`: `bg-emerald-500/15 text-emerald-400 border-emerald-500/30` (Contract active, healthy status).
  - `amber`: `bg-amber-500/15 text-amber-400 border-amber-500/30` (Retainer cap approaching, warning).
  - `rose`: `bg-rose-500/15 text-rose-400 border-rose-500/30` (Disqualified, secret mask, SLA breached).
  - `indigo`: `bg-indigo-500/15 text-indigo-400 border-indigo-500/30` (Billable extra project badge).
  - `slate`: `bg-slate-700 text-slate-300 border-slate-600` (Internal / non-billable, neutral).

---

### MaintenanceGauge (`MaintenanceGauge.vue`)
- **Role:** Visual progress meter and numeric indicator for monthly retainer time consumption.
- **Visuals:**
  - Horizontal progress track (`bg-slate-800 border border-slate-700`).
  - Fill bar dynamic color:
    - `<= 75%`: Emerald bar (`bg-emerald-500`).
    - `76% - 100%`: Amber bar (`bg-amber-500`).
    - `> 100%`: Rose bar (`bg-rose-500`) with overage indicator.
    - `0m cap (No Care Plan)`: Neutral slate indicator displaying `No Active Retainer Plan`.

---

### BaseModal (`BaseModal.vue`)
- **Role:** Accessible modal dialog backdrop and card container.
- **Visuals:** Dark semi-transparent overlay (`bg-slate-950/70 backdrop-blur-sm`), centered card (`bg-slate-900 border border-slate-800 rounded-xl shadow-2xl`).
- **Behavior:** Escape key and backdrop click close modal; focus locked inside dialog.

---

### ThemeToggle (`ThemeToggle.vue`)
- **Role:** Switch between dark and light themes.
- **Visuals:** Sun/Moon SVG toggle button. Persists choice in `localStorage`.

---

## 2. Feature Workspaces & Specialized Panels

### ClientDossierDrawer (`src/features/client-dossier/ClientDossierDrawer.vue`)
- **Role:** Full-canvas dual-column workspace (`calc(100vw - 260px)`) displaying accounts, continuity telemetry, contracts, timecard logs, and secret vaults.
- **Visuals & Layout:**
  - Top Strip: Breadcrumbs, Client Title, Account Status Badge, `+ Log Work`, `✕ Close`.
  - Column 1 (44%): Account profile metadata, SLA health probes, Active Service Contracts accordion list.
  - Column 2 (56%): Monthly Retainer Gauge, Categorized Maintenance History, Credentials & Secret Vault.
- **Accordion Behaviors:** Clicking contract card expands/collapses discrete deliverables checklist and Git commit UUID tagger.

### OpportunityDossierDrawer (`src/features/opportunity-dossier/OpportunityDossierDrawer.vue`)
- **Role:** Full-canvas workspace displaying sales playbook, interactive OpenStreetMap container, decision-maker contacts roster, and chronological activity ledger.
- **Behavior:** Smooth slide-in from right edge; fully responsive down to mobile viewports (`w-full` overlay).
