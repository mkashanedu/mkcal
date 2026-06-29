---
name: Picu Drug Dose App Setup
description: Expo mobile app (picu-drug-dose); workflow quirks and drawer navigation pattern
---

# Workflow Setup

The artifact exists at `artifacts/picu-drug-dose/` with port 22385 in `.replit-artifact/artifact.toml`.

**Why:** The workflow runner does not pass `$PORT` from the artifact env block, so the dev script fails with "option requires argument: --port".

**Fix:** Inline the port in the workflow command:
```
PORT=22385 pnpm --filter @workspace/picu-drug-dose run dev
```

# Drawer Navigation Pattern

The Clinical Suite drawer is implemented as:
- `context/DrawerContext.tsx` — isOpen/openDrawer/closeDrawer state
- `components/AppDrawer.tsx` — Animated.View inside a Modal (covers full screen, half-width drawer slides from left)
- Wrapped in `DrawerProvider` in `app/_layout.tsx` — `<AppDrawer />` rendered inside GestureHandlerRootView
- Each screen imports `useDrawer` and adds a hamburger `<TouchableOpacity onPress={openDrawer}>` in its header

**How to apply:** Any new screen must import `useDrawer` and add the hamburger button as the first element in its header row for consistency.
