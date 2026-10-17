---
title: "Architecture & Product Glossary"
tags: ["architecture", "glossary", "terminology", "mental-model"]
created_at: "2026-10-17"
last_updated_at: "2026-10-17"
---

# Architecture & Product Glossary

This document establishes the authoritative definitions for business, user experience, and architectural terms used across the `smb-ops-frontend` repository. It provides a common mental model for developers and LLM agents to ensure technical artifacts align with business objectives.

---

## 1. Business & Product Strategy Terms

### Business Purpose (Mission)
The foundational objective of the consulting enterprise: to identify prospective SMB clients with observable operational or digital deficits that directly align with the practice's service catalog, converting those technical gaps into high-margin consulting contracts.

### Value Proposition
The specific economic and technical benefit delivered to prospective clients (e.g., eliminating unsearchable PDF menus to improve mobile ordering conversions, modernizing legacy web infrastructure to reduce page bounce rates, securing domains with TLS/SSL).

### Service Catalog Alignment
The qualification criterion where an audited business's detected technical issues directly match services offered by the consulting firm (e.g., Web Modernization, SEO Remediation, POS Integration, Cloud Migration).

### Service Catalog Item
A structured business service entry with a unique identifier (`SVC-SEO`, `SVC-WEB`, `SVC-POS`), declared audit parameter probes, and qualification thresholds.

### Job-To-Be-Done (JTBD)
A human-centered framework defining what an operator is attempting to accomplish, independent of technology.
* *Example:* "When new regional leads are discovered, I want to evaluate their technical vulnerabilities quickly so I only invest outreach effort in high-probability sales prospects."

---

## 2. User Experience & Design Architecture Terms

### User Journey (Macro)
The end-to-end lifecycle of an operator or stakeholder across time, systems, and channels. It spans touchpoints beyond any single screen or application session.
* *Scope:* Lead Discovery $\rightarrow$ Technical Audit $\rightarrow$ Triage & Qualification $\rightarrow$ Cold Outreach $\rightarrow$ Sales Discovery Call $\rightarrow$ Proposal $\rightarrow$ Closed Contract.

### Two-Stage Enrichment
An architectural design pattern separating lightweight preliminary scanning (HTTP/TLS checks in the discovery pool) from heavy, high-cost contact harvesting (crawling websites/LinkedIn for owners, managers, emails, and phone numbers). Stage 2 is triggered exclusively when an operator claims a lead into the Pursued Pipeline.

### Task Flow (Micro / Operational Flow)
The bounded, step-by-step path an operator takes within the dashboard application to complete a specific operational goal.
* *Scope:* Log into Dashboard $\rightarrow$ Trigger regional discovery $\rightarrow$ Run batch technical audit $\rightarrow$ Filter opportunity score $\ge 70$ $\rightarrow$ Mark lead as Qualified.

### User Flow
A formal interaction diagram or sequence depicting branches, decision nodes, and alternate error paths that an operator can navigate through while executing a task flow.

### View Information Architecture (Read Model)
The structural specification defining what contextual data elements must be visible on a given screen for the operator to make an informed decision without cognitive overload.

---

## 3. State & System Mechanics Terms

### Deterministic Action
A user interaction (click, submit, toggle) where the consequence is strictly predictable, unambiguous, and governed by a specification table mapping the trigger to an exact HTTP mutation, client loading state, UI feedback alert, and route navigation.

### State Transition / Lifecycle
The formal movement of a domain entity from one discrete lifecycle status to another (e.g., `NEW` $\rightarrow$ `AUDITED` $\rightarrow$ `QUALIFIED`), governed by predefined preconditions and invariants.

### Invariant
A non-negotiable business rule or state condition that must hold true at all times (e.g., "A lead cannot be qualified until a technical audit has been performed" or "Disqualification requires selecting a valid reason code").

### Command (Mutation)
An intentional write operation dispatched from the user interface to alter the state of a domain entity (e.g., `POST /api/v1/leads/{id}/qualify`).

---

## 4. Domain & Triage Vocabulary

### Prospect / Lead
A registered small-to-medium business entity discovered via public registries, external scraping, or manual operator entry that has not yet completed the full qualification cycle.

### Technical Audit
An automated, non-invasive probe of a prospect's public digital footprint (HTTP status, TLS certificates, mobile viewports, PDF menu structures, detected CMS, third-party POS scripts).

### Opportunity Score
A calculated metric (0–100) reflecting the density of solvable technical deficits and business viability. Higher scores indicate greater alignment with the consulting firm's service offerings.

### Triage
The operational sorting and evaluation process where unvetted audited prospects are reviewed by a human operator and assigned a conclusive disposition (`QUALIFIED` or `DISQUALIFIED`).

### Qualification
The explicit operational decision confirming that a prospect satisfies both technical criteria (sufficient opportunity score) and business criteria (active business, correct target market), advancing it to the outreach queue.

### Disqualification
The terminal operational decision rejecting a prospect from the active sales funnel accompanied by a mandatory reason code (`Out of Business`, `No Website Needed`, `Enterprise / Non-SMB`, `Invalid Phone / Address`, `Other`).
