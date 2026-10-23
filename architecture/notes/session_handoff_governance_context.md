---
title: "Agent Session Handoff & Governance Context"
tags: ["governance", "architecture", "git-workflow", "presentation", "handoff"]
created_at: "2026-10-23"
last_updated_at: "2026-10-23"
---

# Agent Session Handoff & Governance Context

This reference document serves as the primary operational context for any new Antigravity (AGY) / Gemini CLI session operating in this repository. Pointing to this file in a new session ensures immediate alignment on git workflows, architectural patterns, styling boundaries, and current presentation project state.

---

## 1. Strict Git & Pull Request (PR) Workflow

All code and documentation authored by an agent must follow this exact lifecycle without skipping gates:

1. **Dedicated Topic Branch:** Never commit directly to `main`. Always branch off the latest `main`:
   ```bash
   git checkout main && git pull origin main
   git checkout -b <type>/<short-description>
   ```
2. **Quality Gates Before Commit:** Every change must pass type-checking, production build, unit tests, and Gherkin linter:
   ```bash
   docker run --rm -v $(pwd):/app -w /app node:20-alpine sh -c "corepack enable && pnpm build && pnpm test && pnpm run lint:gherkin"
   ```
3. **Changelog Record:** Every PR must append an entry to `CHANGELOG.md` under `## [Unreleased] -> ### Added / Fixed` and include the active conversation UUID:
   `Verified and executed on conversation UUID: <uuid>`.
4. **Push & PR Creation:** Push branch and open a GitHub PR via `gh`:
   ```bash
   git push -u origin <branch-name>
   gh pr create --base main --head <branch-name> --title "..." --body "..."
   ```
5. **Operator Review Gate (CRITICAL):**
   * **Never execute `refresh_stack.sh` while a PR is open.**
   * The agent must halt, output the PR link, and wait for the operator to merge the PR and delete the remote branch.
6. **Post-Merge Sync & Stack Restart:** Once the operator confirms the merge, return to `main`, prune the branch, and restart the stack:
   ```bash
   git checkout main && git pull origin main
   git branch -d <branch-name> && git remote prune origin
   /home/michael/src/github.com/mnaatjes/smb-ops-stack/scripts/refresh_stack.sh
   ```

---

## 2. Architectural Design Patterns & Governance Rules

### Feature-Sliced Design (FSD) Rules
- Layers: `app/` $\rightarrow$ `pages/` $\rightarrow$ `features/` $\rightarrow$ `entities/` $\rightarrow$ `shared/`.
- **Direction of Dependencies:** Higher layers import from lower layers. Lower layers **never** import from higher layers.
- **Cross-Feature Boundary Violation (Rule):** Features cannot import from other sibling features. Modals and drawers belonging to separate features must be hoisted to `pages/HomeView.vue`, with triggers passed via events (`emit`).

### Dual-Root Documentation Boundary (Rule 5.1)
- **User Plane (`docs/`):** Governed strictly by the 4-quadrant **Diataxis framework** (`tutorials/`, `how-to/`, `reference/`, `explanation/`). Reserved for user-facing operator runbooks and manuals.
- **Engineering Plane (`architecture/`):** All internal engineering ledgers, designs, and decisions reside strictly here:
  - `architecture/adr/`: Architecture Decision Records (MADR 3.0 format).
  - `architecture/designs/`: Software Design Documents (SDD / Google Design Doc format).
  - `architecture/notes/`: Living reference notes (e.g. `ui_component_specification_artifacts.md`).
  - `architecture/uat/`: Release UAT verification checklists (e.g. `0001_release_uat_checklist.md`).

### Component Specification vs. Gherkin Boundaries
- **No Component-Level Gherkin:** Never author `.feature` files for individual components or primitives. Refer to [`architecture/notes/ui_component_specification_artifacts.md`](file:///home/michael/src/github.com/mnaatjes/smb-ops-frontend/architecture/notes/ui_component_specification_artifacts.md) for the 4 industry-standard artifacts (Living Workbench, AST boundary contracts, headless assertion matrices, Diataxis reference ledgers).
- **Gherkin Scope:** `tests/e2e/specs/` is strictly reserved for high-level multi-step business journeys:
  - `01_client_onboarding_wizard.feature`
  - `02_client_workspace_and_contracts.feature`
  - `03_timecard_and_maintenance.feature`

---

## 3. Styling & Presentation Layer Standards

1. **NO TAILWIND CSS:**
   * Tailwind CSS is **not installed** in this project.
   * Never author Tailwind utility classes (`p-8`, `md:p-10`, `space-y-20`, `gap-6`, `flex`, `border-2`). They will fail silently and render unstyled raw HTML.
2. **Scoped Vanilla CSS Only:**
   * All component layout, spacing, and styling must be authored in explicit `<style scoped>` blocks with concrete vanilla CSS rules (`padding: 2.5rem; margin-bottom: 2.5rem; border: 2px solid #cbd5e1; border-radius: 16px;`).
3. **Single Source of Truth Typography Tokens:**
   * All fonts must derive from `:root` CSS custom properties in `src/shared/styles/theme.css`:
     - `--font-sans`: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
     - `--font-mono`: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
   * Never hardcode font families inside discrete component files.
   * Teleported components (such as `BaseModal.vue`) must explicitly declare `font-family: var(--font-sans, inherit);` to prevent falling back to browser serif defaults.

---

## 4. Current State: Bottom-Up Presentation Reconstruction (ADR-0027, ADR-0028)

The presentation layer has completed a scaffold-retained bottom-up reconstruction (Phases 0–5). All components are verified, tested, and actively reviewable on `/dev/components`:

### The 4 Reconstruction Waves:
1. **Wave 1: Atomic Primitives (`src/shared/ui/`)**
   - `BaseButton.vue`: Explicit variants (primary, secondary, danger), loading spinner state, `disabled` state, native `buttonType` submit contracts.
   - `BaseBadge.vue`: Semantic color tokens (emerald, amber, rose, indigo, slate) with `sm` and `md` pill sizing.
   - `BaseInput.vue`: Form text, email, and password fields with focus rings and reactive error state captions.
2. **Wave 2: Structural Shell (`src/shared/ui/`)**
   - `BaseModal.vue`: Headless teleport shell (`<Teleport to="body">`), Escape key listener, backdrop dismiss handler, centered `max-w-xl` (640px) geometry, and automatic body scroll locking on mount/unmount.
3. **Wave 3: Telemetry & Selection Controls**
   - `MaintenanceGauge.vue` (`src/shared/ui/`): Care plan retainer gauge with dynamic threshold color shifts ($\le 75\%$ Emerald, $76-100\%$ Amber, $>100\%$ Rose) and neutral 0-cap baseline handling.
   - `ServiceFilterDropdown.vue` (`src/features/service-catalog/`): Multi-select offerings filter with dismissible active tags and selection counter.
4. **Wave 4: Domain Feature Modals**
   - `ContractAgreementModal.vue` (`src/features/client-contracts/`): Dual-mode (onboarding staging vs. client direct mutation), single agreed rate input, agreement type toggle, deliverables preview checklist.
   - `LogWorkModal.vue` (`src/features/client-maintenance/`): Minutes worked, 3-way work category (`retainer`, `billable_extra`, `internal`), care plan scope guardrails.
   - `VaultSecretModal.vue` (`src/features/client-vault/`): Secret label, secret type selector (`SERVER_SSH`, `WP_ADMIN`, etc.), username, and password fields.
   - `ClientOnboardingModal.vue` (`src/features/client-onboarding/`): Streamlined 3-step wizard (Contact Details $\rightarrow$ Service Offerings $\rightarrow$ Vault & Dispatch).

### Living Workbench (`/dev/components`)
- Implemented in `src/pages/DevComponentsView.vue`.
- Visualized as a single-column, spacious, ADHD-friendly continuous staging stream with sticky top navigation anchors (`#wave-1`, `#wave-2`, `#wave-3`, `#wave-4`).
- Each component is framed in an inset exhibition surface (`bg: #f8fafc; border: 2px dashed #cbd5e1`) inside high-contrast white cards (`padding: 2.5rem; margin-bottom: 2.5rem; border: 2px solid #cbd5e1`).

### Production Integration & Sunsetting
- Verified modals are integrated into `src/pages/HomeView.vue` and `src/features/client-dossier/ClientDossierDrawer.vue`.
- All deprecated `.legacy.vue` files have been permanently deleted from git.
- Full Vitest suite passes 100% (18 test files, 77 tests).
- Formal release UAT checklist is maintained at [`architecture/uat/0001_release_uat_checklist.md`](file:///home/michael/src/github.com/mnaatjes/smb-ops-frontend/architecture/uat/0001_release_uat_checklist.md).
