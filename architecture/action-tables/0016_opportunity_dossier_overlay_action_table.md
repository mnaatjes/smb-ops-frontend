---
title: "0016: Opportunity Dossier Overlay Action Table"
status: "accepted"
date: "2026-11-05"
tags: ["architecture", "action-table", "interactions", "dossier", "overlay", "contacts", "activities"]
author: "Frontend Architect"
reviewers: ["Engineering Lead"]
---

# 0016: Opportunity Dossier Overlay Action Table

## 1. Overview & Action Contracts

This action table specifies every user interaction within the Opportunity Dossier Overlay (`OpportunityDossierDrawer.vue`), detailing triggers, preconditions, mutations, and API dispatches.

---

## 2. Exhaustive Interaction Table

| Action ID | Trigger / Element | UI Component | Precondition | State Mutation / Store Call | Expected Visual Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ACT-DOSSIER-01` | Receive `:show="true"` prop | Overlay watcher | `lead != null` | `loadLedgerData()`, `loadPlaybookData()` | Drawer slides open; spinner displays while loading |
| `ACT-DOSSIER-02` | Click Close button / `Escape` | `button.close-btn` | Drawer open | `emit('close')` | Drawer slides closed; parent resets selection |
| `ACT-DOSSIER-03` | Click stage step pill | `button.stage-pill-step` | Target stage $\ne$ current | `store.setOpportunityStage(id, stage)` | Active stage pill updates; passed steps marked green |
| `ACT-DOSSIER-04` | Click "+ Add Contact" | `BaseButton` in header | Drawer open | `showAddContactModal = true` | `BaseModal` opens with contact entry form |
| `ACT-DOSSIER-05` | Save new contact | Submit contact modal form | `name && role_title` | `store.addContact(leadId, payload)` | Contact appended to cards; modal closes |
| `ACT-DOSSIER-06` | Click contact target card | `.contact-card` | Contacts exist | `actContactId = c.id` | Target card highlights; sets target in activity logger |
| `ACT-DOSSIER-07` | Delete contact | `button.delete-contact-btn` | Contact exists | `store.removeContact(leadId, contactId)` | Contact removed from grid |
| `ACT-DOSSIER-08` | Select outreach channel | Channel selector pills | Activity form | `actChannel = selected` | Active channel pill highlights |
| `ACT-DOSSIER-09` | Submit outreach touchpoint | Submit in activity form | `summary.trim() != ''` | `store.addActivity(leadId, payload)` | New activity prepended to timeline feed; input clears |
| `ACT-DOSSIER-10` | Copy pitch script | `button.copy-script-btn` | Playbook loaded | `navigator.clipboard.writeText(script)` | Button text toggles to "✓ Copied!" for 2 seconds |
| `ACT-DOSSIER-11` | Click "Convert to Client" | `BaseButton` in header | Lead loaded | `emit('convert', lead)` | Parent opens `ClientOnboardingModal` |
| `ACT-DOSSIER-12` | Click "Drop Opportunity" | `BaseButton` in header | Lead loaded | `emit('disqualify', lead)` | Parent opens `DisqualifyModal` |
| `ACT-DOSSIER-13` | Click "Discover Contacts" | `BaseButton` in header | Lead loaded | `store.discoverContacts(leadId)` | Spinner spins; newly discovered contacts appended |
| `ACT-DOSSIER-14` | Toggle theme (Light/Dark) | Theme toggle in header | User toggles theme | Theme class switches on `document.documentElement` | All surfaces, text, cards, and borders re-skin seamlessly |
