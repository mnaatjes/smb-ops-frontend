---
title: "Component Reference Standards: Visual & Behavioral Cheat Sheets"
tags: ["diataxis", "reference", "components", "design-system", "cheat-sheet"]
created_at: "2026-10-20"
last_updated_at: "2026-10-20"
---

# Component Reference Standards: Visual & Behavioral Cheat Sheets

## 1. Scope & Objective
Under the **Diataxis Reference quadrant**, `docs/reference/` provides authoritative, bite-sized truth regarding UI building blocks. It is a quick-scan cheat sheet for developers and testers to immediately know:
1. What each component must look like (colors, borders, badges).
2. How each component must behave (click reactions, disabled states, hover states).
3. Plain-language expectations with minimal cognitive friction.

## 2. Cheat Sheet Entry Rules
Every entry in a component reference document must adhere to the 4-point rule:
- **Zero Jargon:** Name colors and states directly (e.g. `bg-emerald-500` or `emerald pill badge`, not abstract taxonomy).
- **State Matrix:** Document all supported states: Default, Hover, Focused, Disabled, Loading, and Error.
- **Micro-Copy Invariants:** Document casing rules (e.g. Title Case for buttons, Sentence case for descriptions).
- **Interactive Invariant:** What happens when clicked, focused, or blurred.

## 3. Standard Component Cheat Sheet Template

```markdown
### [Component Name] (`[ComponentFile.vue]`)

- **Role:** 1-sentence plain-language summary of what the component does.
- **Visual Appearance:**
  - **Color / Background:** [Token or Tailwind class]
  - **Borders / Radius:** [Border style and roundedness]
  - **Typography:** [Font weight, size, color]
- **State Cheat Sheet:**
  | State | Visual Treatment | Interaction / Behavior |
  |---|---|---|
  | Default | Solid dark surface, subtle border | Interactive cursor pointer |
  | Hover | 10% brightness increase, highlight ring | None |
  | Active / Pressed | Inset shadow, slight scale-down | Emits click event |
  | Disabled | 50% opacity, cursor not-allowed | Ignores clicks, form submit prevented |
  | Loading | Spinner replacement, label faded | Clicks debounced/blocked |
- **Do's & Don'ts:**
  - **Do:** Use for primary modal actions.
  - **Don't:** Place multiple primary buttons in a single footer.
```
