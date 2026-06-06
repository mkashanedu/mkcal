---
name: PICU App Design System
description: Color palette, dark mode tokens, and UI conventions for the picu-drug-dose app
---

## Primary Color
- **Medical Teal**: `#0891B2` (primary), `#0E7490` (dark), `#22D3EE` (light)
- **Why:** Shifted from blue to teal per user request for a more clinical/professional look (MDCalc / Apple Health aesthetic).

## Emergency / High-Alert Color
- **Red**: `#DC2626` — reserved STRICTLY for emergency states, High Alert badges, and the Emergency tab.
- **Why:** User explicitly asked to reserve red for emergency states only. Inotrope category must NOT use red.

## Inotrope Category Color
- `#7C3AED` (Violet) — replaced the previous `#B5171A` red.

## Dark Mode Tokens (infusion.tsx)
- `BG = "#060B12"` — deep OLED black
- `CARD = "#0D1521"` — elevated surface
- `BORDER = "#182232"` — subtle divider
- `TEXT = "#E8F1FA"` — high-contrast white
- `MUTED = "#4D6680"` — muted secondary
- `SEC = "#8AAEC8"` — secondary text

## UI Conventions
- **Cards**: borderless, soft shadows only (no `borderWidth` on section cards, recipe cards, result box)
- **Pill controls**: `borderRadius: 100`, container has matching pill background (e.g. `isDark ? "#0A1220" : "#EBF5FB"`)
- **Syringe selector**: pill-shaped toggle row, selected = drug color filled, unselected = transparent on pill container
- **Mode tabs**: same pill pattern as syringe selector
- **Category pills**: `borderRadius: 100, borderWidth: 0`
- **Result box shadow**: uses teal shadow color `#0891B2` to glow the card

## How to Apply
- When adding new controls, use pill shape (`borderRadius: 100`) for toggles/filters
- Never use red for any category that isn't emergency
- Dark mode backgrounds should be deep OLED (`#060B12`) not navy blue
