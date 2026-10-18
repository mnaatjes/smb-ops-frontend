---
title: "ADR-0012: Business Doctrine Markdown and Mermaid Diagram Rendering"
tags: ["adr", "fsd", "ui", "doctrine", "markdown", "mermaid", "visualization"]
created_at: "2026-10-18"
last_updated_at: "2026-10-18"
---

# ADR-0012: Business Doctrine Markdown and Mermaid Diagram Rendering

## Context
Business Doctrine documents contain rich formatted Markdown (headings, lists, blockquotes, code fences, and tables) as well as embedded Mermaid flowchart diagrams (such as the qualification gatekeeper and service recommendation workflows in `decision_matrix_flow.md`). Displaying raw plain-text `<pre>` blocks degrades readability and obscures architectural workflows.

## Decision
1. **Markdown Compilation Engine:**
   - Integrate `marked` as a client-side Markdown compiler in `src/features/business-doctrine/DoctrineWorkspace.vue`.
   - Configure a custom renderer to intercept `mermaid` language code blocks (` ```mermaid `) and render them into dedicated container elements `<div class="mermaid-diagram" data-mermaid="..."></div>`.
2. **Dynamic Mermaid SVG Rendering:**
   - Integrate `mermaid` client library initialized in loose security mode (`startOnLoad: false`, `securityLevel: 'loose'`).
   - Use Vue `watch` on `doctrineStore.activeDocument` and `nextTick` to asynchronously render diagrams via `mermaid.render()` and inject generated SVGs into the target DOM elements.
3. **Typography and Theme Token Compliance:**
   - Style the rendered markdown container (`.markdown-body`) using governed CSS design tokens (`--text-primary`, `--bg-surface`, `--border-color`, `--accent-primary`).
   - Isolate Mermaid containers with smooth horizontal overflow handling and border styling for high-contrast visibility across light and dark modes.

## Consequences
* **Positive:** Visual flowcharts and rich documentation render dynamically in the dashboard directly from runtime doctrine files without server-side image preprocessing.
* **Negative:** Introduces `marked` and `mermaid` client-side dependencies (~few hundred KB in bundle), loaded and executed safely on the client.
