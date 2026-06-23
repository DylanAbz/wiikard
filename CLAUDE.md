# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Expo version

**Always read the exact versioned docs at https://docs.expo.dev/versions/v55.0.0/ before writing any Expo-related code.** The Expo API surface changes significantly between SDK versions.

The project targets **Expo SDK ~54.0.0** (see `package.json`). When installing new Expo packages, npm requires `--strict-ssl=false` due to a corporate proxy certificate issue:

```bash
npm install <package> --legacy-peer-deps --strict-ssl=false
```

`npx expo install` will fail with a fetch error on this machine — use `npm install` directly with pinned versions instead.

## Commands

```bash
npm start          # Start Expo dev server (opens QR for Expo Go)
npm run android    # Launch on Android emulator
npm run ios        # Launch on iOS simulator
npm run web        # Launch in browser
expo lint          # Lint (no test suite configured)
```

## Architecture

This is a **POC mobile app** (no backend, no auth, no real database). All data lives in `src/data/mockDb.ts`.

### Routing — Expo Router (file-based)

```
src/app/
  index.tsx           → Landing: choose Client or Partner mode
  (client)/
    _layout.tsx       → Tab navigator (Explorer | Ma Carte | Profil)
    index.tsx         → "Ma Carte" — QR code display (default tab)
    explorer.tsx      → Map + geofencing
    profile.tsx       → Settings (geofencing toggle)
  (partner)/
    _layout.tsx       → Stack navigator
    index.tsx         → QR code scanner
```

### Two user flows

- **Client `(client)`** — bottom tab navigation; lands on "Ma Carte" by default.
- **Partner `(partner)`** — single screen accessed from the landing page; no tabs.

### Dynamic QR code

The QR value is `userId|timeWindow` where `timeWindow = Math.floor(Date.now() / 600_000)` (rotates every 10 minutes). The partner scanner validates against the current window and the previous one (±10 min tolerance). An old-format QR without `|` is accepted as-is for backward compatibility.

### Geofencing

`explorer.tsx` requests foreground location permission via `expo-location` on mount, then watches position with `watchPositionAsync`. When within 100 m of a partner **and** `isGeofencingEnabledGlobal` is `true`, it fires a local push notification via `expo-notifications`. A partner is removed from the triggered set once the user moves >300 m away, allowing re-notification. A "Simuler Géoloc." button clears the entire triggered set and teleports the marker to Cryotera for demo purposes.

### Global state

There is no Context or Redux. `profile.tsx` exports a mutable `let isGeofencingEnabledGlobal` which `explorer.tsx` imports directly. This is intentional for this POC.

### Brand tokens

- Primary orange: `#FF4F30`
- Background: `#F9F8F6`
- Text: `#0D0D0D`
- Muted: `#A0998F`
