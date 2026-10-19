---
title: "0008: Pursued Opportunity Dossier Action Table"
tags: ["architecture", "action-tables", "pipeline", "dossier", "opportunities"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# 0008: Pursued Opportunity Dossier Action Table

## 1. Flow Scope
This action table governs operator interactions when selecting, inspecting, and acting upon claimed opportunity records in the **Pursued Pipeline** workspace via the sliding dossier drawer.

## 2. Deterministic Action Table

| Source View | Control / Trigger | Event / Intent | State Mutation | Success Outcome | Error Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Pursued Pipeline Card | Click card body / header | `OPEN_OPPORTUNITY_DOSSIER` | `showOpportunityDrawer = true`, `activeOpportunityLead = lead` | Slide-over drawer opens from right with full opportunity rubric and services | None |
| Opportunity Drawer | Click "✕" or backdrop | `CLOSE_OPPORTUNITY_DOSSIER` | `showOpportunityDrawer = false`, `activeOpportunityLead = null` | Drawer slides closed; returns focus to Pipeline Grid | None |
| Opportunity Drawer | Click "Convert to Client" | `CONVERT_FROM_DRAWER` | Closes drawer; sets `showOnboardingModal = true` | Onboarding Pipeline modal opens pre-filled with prospect data | None |
| Opportunity Drawer | Click "Disqualify Lead" | `DISQUALIFY_FROM_DRAWER` | Closes drawer; sets `showDisqualifyModal = true` | Disqualify modal opens with confirmation | None |
| Opportunity Drawer | Click Website link | `OPEN_WEBSITE_EXT` | None (native link) | Opens website URL in new tab | Link inactive if URL null |
