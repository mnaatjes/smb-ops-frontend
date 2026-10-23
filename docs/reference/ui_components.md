---
title: "UI Component Catalog & Visual Truth Reference"
tags: ["diataxis", "reference", "components", "design-system", "cheat-sheet"]
created_at: "2026-10-20"
last_updated_at: "2026-10-23"
---

# UI Component Catalog & Visual Truth Reference

A quick-scan visual cheat sheet of core UI components in `smb-ops-frontend`, specifying visual appearance, scoped CSS design tokens, interactive behaviors, and state matrices as verified in the living workbench (`/dev/components`).

---

## 1. Wave 1: Core Primitives (`src/shared/ui/`)

### BaseButton (`BaseButton.vue`)
- **Role:** Interactive trigger for actions, submissions, and modal controls.
- **Visuals & Tokens:**
  - `primary`: Background `var(--accent-primary, #10b981)`, hover `var(--accent-primary-hover, #059669)`, text `#ffffff`.
  - `secondary`: Background `var(--bg-surface-subtle, #334155)`, hover `var(--border-strong, #475569)`, text `var(--text-secondary, #cbd5e1)`.
  - `danger`: Background `var(--accent-danger, #ef4444)`, hover `var(--accent-danger-hover, #dc2626)`, text `#ffffff`.
  - Typography: `font-family: inherit`, font-weight `500`, border-radius `6px`.
- **State Matrix:**
  | State | Visual Treatment | Interaction |
  |---|---|---|
  | Nominal / Default | Solid color, standard contrast | Emits `click` (native `type="button" \| "submit" \| "reset"`) |
  | Hover | Background shift to token hover variant | Pointer cursor |
  | Active / Focus | Outline `2px solid var(--focus-ring, rgba(16, 185, 129, 0.4))` | Emits `click` |
  | Disabled | `opacity: 0.5`, background `var(--bg-surface-subtle)`, cursor `not-allowed` | Clicks and submissions prevented |
  | Loading | Spinner SVG visible, label muted | Double clicks suppressed |

---

### BaseBadge (`BaseBadge.vue`)
- **Role:** Compact visual pill for statuses, scores, work categories, and contract tiers.
- **Visuals & Tokens:**
  - `emerald`: Background `rgba(16, 185, 129, 0.15)`, text `var(--accent-primary, #10b981)`, border `rgba(16, 185, 129, 0.3)`.
  - `amber`: Background `rgba(245, 158, 11, 0.15)`, text `var(--accent-warning, #f59e0b)`, border `rgba(245, 158, 11, 0.3)`.
  - `rose`: Background `rgba(239, 68, 68, 0.15)`, text `var(--accent-danger, #ef4444)`, border `rgba(239, 68, 68, 0.3)`.
  - `indigo`: Background `rgba(99, 102, 241, 0.15)`, text `#818cf8`, border `rgba(99, 102, 241, 0.3)`.
  - `slate`: Background `var(--bg-surface-subtle, #334155)`, text `var(--text-secondary, #94a3b8)`, border `var(--border-color, #475569)`.
- **Typography:** `font-family: inherit`, font-weight `600`, font-size `0.75rem`, border-radius `9999px` (pill).

---

### BaseInput (`BaseInput.vue`)
- **Role:** Controlled text and numeric data ingress field with label and error slots.
- **Visuals & Tokens:**
  - Background `var(--bg-surface)`, border `1px solid var(--border-color)`, text `var(--text-primary)`, border-radius `6px`.
  - Focus Ring: `border-color: var(--accent-primary)`, `box-shadow: 0 0 0 2px var(--focus-ring)`.
  - Error State: Border `#ef4444`, `box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25)`, error label text `#ef4444` (`0.75rem`).
  - Disabled State: Background `var(--bg-surface-subtle)`, text `var(--text-muted)`, cursor `not-allowed`.
  - Number Incrementor: Styled `::-webkit-inner-spin-button` with clean opacity and pointer cursor.
- **State Matrix:**
  | State | Visual Treatment | Interaction |
  |---|---|---|
  | Default | Border `var(--border-color)`, placeholder `var(--text-muted)` | Emits `update:modelValue` on `@input` |
  | Focused | Accent ring highlight | Active text cursor |
  | Error | Red border and helper message text | Retains input focus |
  | Disabled | Dimmed surface, muted text | Typing prevented |

---

### BaseSelect (`BaseSelect.vue`)
- **Role:** Standardized dropdown selection primitive with custom SVG chevron and theme token support.
- **Visuals & Tokens:**
  - Background `var(--bg-surface)`, border `1px solid var(--border-color)`, text `var(--text-primary)`, border-radius `6px`.
  - Custom Chevron: Absolute-positioned SVG chevron; OS default arrow suppressed via `appearance: none`.
  - Focus Ring: `border-color: var(--accent-primary)`, `box-shadow: 0 0 0 2px var(--focus-ring)`.
  - Error State: Border `#ef4444`, error label caption `#ef4444`.
- **State Matrix:**
  | State | Visual Treatment | Interaction |
  |---|---|---|
  | Default | Solid surface, subtle border, custom chevron | Emits `update:modelValue` and `change` |
  | Focused | Accent border and focus ring glow | Native options list opens |
  | Error | Red border and helper message text | Retains selection focus |
  | Disabled | Dimmed surface, muted text | Selection prevented |

---

### BaseTextarea (`BaseTextarea.vue`)
- **Role:** Controlled multi-line text input with strict non-resizable geometry and uniform focus rings.
- **Visuals & Tokens:**
  - Background `var(--bg-surface)`, border `1px solid var(--border-color)`, text `var(--text-primary)`, border-radius `6px`.
  - Resizing Policy: Strictly non-resizable (`resize: none`) to prevent modal and workspace layout distortions.
  - Focus Ring: `border-color: var(--accent-primary)`, `box-shadow: 0 0 0 2px var(--focus-ring)`.
  - Error State: Border `#ef4444`, error label caption `#ef4444`.
- **State Matrix:**
  | State | Visual Treatment | Interaction |
  |---|---|---|
  | Default | Solid surface, subtle border, placeholder muted | Emits `update:modelValue` on `@input` |
  | Focused | Accent border and focus ring glow | Active cursor |
  | Error | Red border and helper message text | Retains input focus |
  | Disabled | Dimmed surface, muted text | Editing prevented |

---

### BaseList (`BaseList.vue`)
- **Role:** Baseline structured list primitive standardizing deliverables, audits, and instructional progressions.
- **Visuals & Tokens:**
  - `bullet`: Rounded bullet token `•` colored with `var(--accent-primary)`.
  - `checkmark`: High-contrast green checkmark `✓` (`#10b981`) for verification and deliverables scopes.
  - `numbered`: Monospace numbered index badge using tabular numerals (`font-feature-settings: 'tnum'`).
  - Density: Standard (`gap: 0.6rem`) or dense (`gap: 0.35rem`, font-size `0.8125rem`).
- **State Matrix:**
  | Variant | Tag | Icon / Badge | Usage Context |
  |---|---|---|---|
  | `bullet` (Default) | `<ul>` | `•` in `var(--accent-primary)` | General feature highlights and notes |
  | `checkmark` | `<ul>` | `✓` in `#10b981` | Signed deliverables, task completions |
  | `numbered` | `<ol>` | `N.` in `var(--text-secondary)` | Sequential setup guides, audit stages |

---

### BaseCard (`BaseCard.vue`)
- **Role:** Unified content card surface with token-aware background, borders, elevation, and optional whole-card click delegation.
- **Visuals & Tokens:**
  - Background `var(--bg-surface)`, border `1px solid var(--border-color)`, border-radius `12px`.
  - Elevation: Optional drop-shadow (`is-elevated`).
  - Interactive Clickable Variant: When `clickable: true`, adds `cursor: pointer`, hover translation `translateY(-2px)`, active depression `scale(0.99)`, focus ring, and keyboard trigger (Enter/Space) dispatching `@click`.
  - Padding Variants: `none`, `sm` (`0.75rem`), `md` (`1.25rem`), `lg` (`2rem`).
- **Slots:** `#header` (titles & badges), `#default` (body content), `#footer` (actions).

---

### VaultSecretForm (`VaultSecretForm.vue`)
- **Role:** Form sub-tree primitive managing credential category schemas, reactive validation, and payload binding.
- **Visuals & Behavior:** Composable inside standalone pages, `VaultSecretModal`, and `ClientOnboardingModal`. Emits `update:modelValue`, `valid-change`, and `submit`.

---

### ContractAgreementForm (`ContractAgreementForm.vue`)
- **Role:** Form sub-tree primitive managing service catalog selection, contract type options, deliverables scope, and agreed billing rate.
- **Visuals & Behavior:** Composable inside standalone pages and `ContractAgreementModal`. Emits `update:modelValue`, `valid-change`, and `submit`.

---

### LogWorkForm (`LogWorkForm.vue`)
- **Role:** Form sub-tree primitive managing maintenance work timecard entries, category allocations, care-plan capacity notice, and work descriptions.
- **Visuals & Behavior:** Composable inside standalone pages and `LogWorkModal`. Emits `update:modelValue`, `valid-change`, and `submit`.

---

### BaseTable (`BaseTable.vue`)
- **Role:** Standardized data table shell with column formatting, loading spinners, and row-click delegation.
- **Visuals & Tokens:**
  - Header: Background `var(--bg-surface-subtle)`, border-bottom `2px solid var(--border-color)`, uppercase font size `0.75rem`.
  - Rows: Alternating hover background `var(--bg-surface-hover)`, cursor `pointer`.
  - States: Loading row with animated spinner; empty row slot (`emptyText`).
- **Contracts:** Accepts typed columns (`key`, `label`, `width`, `align`, `formatter`) and emits `@row-click`.

---

## 2. Wave 2: Structural Shells (`src/shared/ui/`)

### BaseModal (`BaseModal.vue`)
- **Role:** Accessible modal dialog backdrop and card container.
- **Visuals & Layout:**
  - Backdrop: `position: fixed; inset: 0`, background `rgba(0, 0, 0, 0.65)`, `backdrop-filter: blur(4px)`.
  - Modal Shell: Centered flexbox, background `var(--bg-surface)`, border `1px solid var(--border-color)`, border-radius `12px`, max-width `640px`.
  - Typography: Enforces `font-family: var(--font-sans, inherit)` on `.modal-card` to guarantee global typography inheritance across teleported DOM roots.
- **Ergonomic Invariants:**
  - Teleports to `<body>` when `show: true`; completely removed from DOM when `show: false`.
  - Keyboard: `Escape` key trigger dispatches `@close`.
  - Event Propagation: Clicking the outer backdrop dispatches `@close`; clicks inside the modal card are isolated (`@click.stop`).
  - Scroll Lock: Locks `document.body.style.overflow = 'hidden'` while mounted.

---

### BaseWizard (`BaseWizard.vue`)
- **Role:** Headless sequential workflow engine managing validation gates and multi-step state transitions.
- **Visuals & Layout:**
  - Header: Embeds `ProgressionIndicator` with active, completed, and upcoming visual tokens.
  - Step Body: Dynamic template slot injection for discrete step screens (`#step-1`, `#step-2`).
  - Navigation Footer: Standardized back/continue/submit cluster with step-gated validation (`canAdvance`).
- **State & Invariants:**
  - `Back` button hidden on step 1; appears on step > 1.
  - Replaces `Continue` with `Submit` on the final step.
  - Emits typed `step-change` and `submit` events.

---

### ModalWizard (`ModalWizard.vue`)
- **Role:** Dialog composition shell embedding `BaseWizard` inside `BaseModal` with guarded dismissal.
- **Visuals & Behavior:**
  - Combines `BaseModal` backdrop blur and teleporting with full `BaseWizard` stepper machinery.
  - Guarded Exit: Prompts confirmation on Escape or backdrop click when `currentStep > 1` to prevent accidental data loss.

---

### BaseAside (`BaseAside.vue`)
- **Role:** Primary left-hand vertical navigation rail governing route selection and app-level actions.
- **Visuals & Layout:**
  - Expanded Mode (`width: 240px`): Full brand title, subtitle, and full label navigation links.
  - Collapsed Mode (`width: 64px`): Icon-only compact rail with non-overlapping dedicated expand strip and floating popover tooltips on icon hover.
  - Background `var(--bg-surface)`, border-right `1px solid var(--border-color)`.
- **Contracts:** Accepts `collapsed: boolean` prop, emits `@toggle-collapse` on toggle click.

---

### BasePageContainer (`BasePageContainer.vue`)
- **Role:** Standardized Stage / Main Content Canvas wrapper establishing layout max-widths, title hierarchies, and scroll bounds.
- **Visuals & Layout:**
  - Bounds: Default `max-width: 1280px` centered, or `fluid: true` for 100% full-bleed displays.
  - Header: Structured `#header` slot with `.stage-title` and `.stage-subtitle`.
  - Toolbar: Dedicated `#toolbar` slot for search bars, filters, and bulk actions.
  - Scroll Invariant: Vertically scrollable within its stage (`overflow-y: auto`), with zero horizontal translation.

---

### BaseDrawer (`BaseDrawer.vue`)
- **Role:** Contextual flyout workspace overlay translating from the right browser edge.
- **Visuals & Boundaries:**
  - Anchored Margin: Occupies `calc(100vw - [aside_width])`, stopping flush against `BaseAside` to preserve navigational context.
  - Size Variants: `sm` (`max-width: 420px` for quick inspect/dossier previews), `md` (`max-width: 680px` for forms), `lg` (`max-width: 960px` for deep multi-column forms), `full` (`100%` of Stage width for immersive canvas workspaces).
  - Animation: Slide-in cubic-bezier from right screen edge.
  - Invariants: Escape listener dispatches `@close`; backdrop dimmer over dashboard stage dispatches `@close`.

---

### ThemeToggle (`ThemeToggle.vue`)
- **Role:** Switch between dark and light themes across dashboard workspaces.
- **Visuals:** SVG icon toggle button with token-aware surface. Persists preference in `localStorage`.

---

## 3. Wave 3: Telemetry & Selection Controls

### MaintenanceGauge (`src/shared/ui/MaintenanceGauge.vue`)
- **Role:** Visual progress meter and numeric indicator for monthly retainer time consumption.
- **Visuals & Layout:**
  - Track: Background `var(--bg-surface-subtle)`, border `1px solid var(--border-color)`, height `10px`, border-radius `5px`.
  - Dynamic Fill:
    - `<= 75%`: Emerald bar (`var(--accent-primary, #10b981)`).
    - `76% - 100%`: Amber bar (`var(--accent-warning, #f59e0b)`).
    - `> 100%`: Rose bar (`var(--accent-danger, #ef4444)`) with overage indicator.
    - `0m cap (No Care Plan)`: Neutral slate indicator displaying `No Active Retainer Plan`.

---

### ServiceFilterDropdown (`src/features/service-catalog/ServiceFilterDropdown.vue`)
- **Role:** Multi-select popover filter for lead triage boards and service catalog filtering.
- **Visuals & Behavior:**
  - Trigger Button: Fixed width (`260px`), dynamic label displaying "All Services", selected service name, or "N Services Selected" with ellipsis truncation.
  - Menu Popover: Absolute positioned surface (`background: var(--bg-surface)`, `border: 1px solid var(--border-color)`, `box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)`).
### ProgressionIndicator (`src/shared/ui/ProgressionIndicator.vue`)
- **Role:** Reusable multi-step wizard and onboarding progress tracker.
- **Visuals & Behavior:**
  - Active Step: Accent circle (`var(--accent-primary)`) with glowing focus ring and prominent label.
  - Completed Step: Accent fill with checkmark `✓` icon and connected progress track.
  - Upcoming Step: Subtle background (`var(--bg-surface-subtle)`) with muted border and number.
  - Connector Track: Horizontal progress lines transitioning from `--border-color` to `--accent-primary`.

---

## 4. Wave 4: Domain Feature Modals

### ContractAgreementModal (`src/features/client-contracts/ContractAgreementModal.vue`)
- **Role:** Transactional dialog for provisioning new client service contracts and retainers.
- **Visuals & Form Inputs:**
  - Client context header displaying target client name and ID.
  - Service Catalog selection dropdown.
  - Monthly Retainer Time Cap input (in minutes) with out-of-scope billing checkbox.
  - Effective Date and Scope of Work description fields.
- **Behavior & Events:** Emits `@save` with `AttachContractPayload` or `@close`.

---

### LogWorkModal (`src/features/client-maintenance/LogWorkModal.vue`)
- **Role:** Modal dialog for recording billable or retainer time against client contracts.
- **Visuals & Form Inputs:**
  - Associated active contract selector.
  - Minutes spent input, activity category selector (Emergency, Routine, Deployment, Maintenance).
  - Work log summary, resolution notes, and optional Git commit hash field.
- **Behavior & Events:** Emits `@save` with timecard payload or `@close`.

---

### VaultSecretModal (`src/features/client-vault/VaultSecretModal.vue`)
- **Role:** Secure entry dialog for storing client environment secrets, SSH keys, or API tokens.
- **Visuals & Form Inputs:**
  - Secret Key name input, Environment tag selector (`Production`, `Staging`, `Development`).
  - Secret Value masked textarea with visibility toggle.
  - Security warning banner regarding immutable auditing.
- **Behavior & Events:** Emits `@save` with vault item payload or `@close`.

---

### ClientOnboardingModal (`src/features/client-onboarding/ClientOnboardingModal.vue`)
- **Role:** Wizard modal for converting qualified prospects into active retainer clients.
- **Visuals & Form Inputs:**
  - Company Legal Name, Primary Contact Email, Phone, and Physical Address.
  - Initial Service Package tier and billing cadence.
- **Behavior & Events:** Emits `@save` with onboarding payload or `@close`.

---

## 5. Feature Workspaces & Specialized Panels

### ClientDossierDrawer (`src/features/client-dossier/ClientDossierDrawer.vue`)
- **Role:** Full-canvas dual-column workspace (`calc(100vw - 260px)`) displaying accounts, continuity telemetry, contracts, timecard logs, and secret vaults.
- **Visuals & Layout:**
  - Top Strip: Breadcrumbs, Client Title, Account Status Badge, `+ Log Work`, `✕ Close`.
  - Column 1 (44%): Account profile metadata, SLA health probes, Active Service Contracts accordion list.
  - Column 2 (56%): Monthly Retainer Gauge, Categorized Maintenance History, Credentials & Secret Vault.
- **Accordion Behaviors:** Clicking contract card expands/collapses discrete deliverables checklist and Git commit UUID tagger.

---

### OpportunityDossierDrawer (`src/features/opportunity-dossier/OpportunityDossierDrawer.vue`)
- **Role:** Full-canvas workspace displaying sales playbook, interactive OpenStreetMap container, decision-maker contacts roster, and chronological activity ledger.
- **Behavior:** Smooth slide-in from right edge; fully responsive down to mobile viewports (`w-full` overlay).
