---
title: "0009: Opportunity Contacts and Activity Action Table"
tags: ["architecture", "action-tables", "pipeline", "contacts", "activities"]
created_at: "2026-10-19"
last_updated_at: "2026-10-19"
---

# 0009: Opportunity Contacts and Activity Action Table

## 1. Flow Scope
This action table governs all operator actions when creating and managing contacts, logging outreach touchpoints, scheduling appointments, and advancing milestone stages in the Opportunity Dossier.

## 2. Deterministic Action Table

| Source View | Control / Trigger | Event / Intent | Backend Mutation | Success Outcome | Error Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Opportunity Drawer | Click "+ Add Contact" | `OPEN_ADD_CONTACT_MODAL` | None | Opens `<AddContactModal>` dialog | None |
| `<AddContactModal>` | Submit Contact Form | `CREATE_CONTACT` | `POST /api/leads/:id/contacts` | Appends contact to directory; modal closes; toast notification | Form validation alert (name and role required) |
| Opportunity Drawer | Click "Trash" on Contact | `DELETE_CONTACT` | `DELETE /api/leads/:id/contacts/:cid` | Contact removed from list; resets active selection | Toast: "Failed to remove contact" |
| Opportunity Drawer | Submit Log Activity Form | `LOG_ACTIVITY` | `POST /api/leads/:id/activities` | Activity prepended to timeline; form reset; stage updated if appointment set | Form validation alert (channel and summary required) |
| Opportunity Drawer | Click Stage Pill in Stepper | `UPDATE_STAGE` | `PATCH /api/leads/:id/stage` | Prospect opportunity_stage updated; stepper updates state | Toast: "Failed to update pipeline stage" |
