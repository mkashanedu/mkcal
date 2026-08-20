---
name: Platform Guards
description: Critical web vs native guards that prevent build/runtime crashes
---

## Rules

1. **Biometrics** — `setBiometricEnabled()` is a no-op on web (guarded by `Platform.OS !== 'web'` inside the context). AppDrawer renders a grayed "NATIVE" badge instead of a Switch on web. Never statically import `expo-local-authentication` at module level — it crashes web builds.

2. **Service Worker** — registered via `<script dangerouslySetInnerHTML>` in `app/+html.tsx`. The SW file lives at `public/sw.js` and uses vanilla Cache-First (no Workbox package needed). SW registration is inherently web-only because `+html.tsx` is only used in the web build.

3. **Apple SSO button** — rendered only on `Platform.OS === 'ios' || Platform.OS === 'web'` (App Store policy: Android must not show Apple sign-in as a primary option).

4. **Web icon fonts** — when deployed web icons render as missing-glyph boxes despite `useFonts`, explicitly import the package TTF files and inject `@font-face` rules into `document.head` from a web-only component. Guard with `Platform.OS === 'web'` and `typeof document !== 'undefined'`.

**Why:** The Expo project compiles for both web and native. Static imports of native-only modules break Metro's web bundler, and some Netlify builds do not reliably preserve the runtime icon font-face rules.

**How to apply:** Any feature using native APIs (LocalAuthentication, NFC, Bluetooth) must use `Platform.select` or a dynamic `if (Platform.OS !== 'web') require(...)` pattern.
