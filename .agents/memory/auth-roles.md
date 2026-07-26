---
name: Auth & Roles
description: AuthContext v2 architecture — session key, ClinicalRole enum, social login scaffold pattern
---

## Rules

- Session stored under `@peadscal_session_v2` (migrates v1 key automatically on first load)
- `AuthUser` interface: `{ id, name, email, role: ClinicalRole, provider: AuthProvider }`
- `ClinicalRole` values: `physician | rn | respiratory_therapist | paramedic | other`
- `AuthProvider` values: `local | google | apple`
- `loginSocial()` creates a local AsyncStorage account with empty password hash — no real OAuth yet
- `updateRole()` updates both the live session and the stored accounts list atomically

**Why:** AsyncStorage-only auth means the app works fully offline; social buttons are UI scaffolding only for future OAuth wiring.

**How to apply:** Any new auth feature should check `user.provider` to gate password-change flows. Social users (`google`/`apple`) should not be offered "change password".
