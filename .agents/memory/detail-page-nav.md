---
name: Detail-page navigation refactor
description: Accordion removal — all three list screens now route to full-screen detail pages
---

## What was done
- `app/(tabs)/calculator.tsx` — dose rows (`drug.doses.map(...)`) removed; each drug card is a pure nav button to `/drug/[id]`. Also removed `calculateDose` import and `isIntranasalRoute` function.
- `app/(tabs)/infusion.tsx` — stripped to a drug selection list; each pill navigates to `/infusion/[id]`.
- `app/(tabs)/tools.tsx` — replaced 10-accordion layout with a clean nav-card grid; each card routes to `/tool/[id]`.
- `app/infusion/[id].tsx` — new full-screen infusion calculator (Steps 2–4 + result + notes), drug pre-loaded by ID.
- `app/tool/[id].tsx` — new full-screen tool calculator, switches on `id` param to render the right section body. All data constants, helper functions, and sub-components are self-contained in this file (WHO tables, BP tables, care-bundle arrays, GCS/FOUR/OSI/SIPA/WAT-1, PEWS, APGAR, etc.).
- `app/_layout.tsx` — added `Stack.Screen` for `infusion/[id]` and `tool/[id]` (both `headerShown: false`).

## Key constraint
`calculateDose` and `isIntranasalRoute` must NOT appear in `calculator.tsx` — they were removed along with the dose rows. The drug detail page (`drug/[id]`) still has the dose display.

**Why:** Accordions/inline dose rows conflicted with the desired UX of clean navigation to full-screen calculators.
