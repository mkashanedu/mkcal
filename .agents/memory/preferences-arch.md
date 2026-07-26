---
name: Preferences Architecture
description: Two separate contexts manage global prefs — PreferencesContext (textSize, biometric) and WeightContext (weightUnit)
---

## Rules

- `PreferencesContext` (`context/PreferencesContext.tsx`) — stores `textSize: "small"|"medium"|"large"` and `biometricEnabled: boolean`; persisted to `@peadscal_prefs_v1`
- `WeightContext` (`context/WeightContext.tsx`) — stores `weightUnit: "kg"|"lbs"`; already existed before this session
- Both contexts are exposed in the AppDrawer settings panel via segmented controls and Switch
- `textScale` derived value (`TEXT_SCALE` map: small=0.88, medium=1.00, large=1.14) is exported for calculators to apply to fontSize

**Why:** Kept weight separate from other prefs to avoid breaking existing WeightContext consumers.

**How to apply:** Calculators that want to respect text size should `const { textScale } = usePreferences()` and multiply their base fontSize by textScale.
