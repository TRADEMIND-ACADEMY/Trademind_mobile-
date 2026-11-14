# TradeMind Academy — merged application

This final project combines the preserved functional engine from **TRADEMIND-ACADEMY-PROJECT.zip** with the **Obsidian / Ivory / Champagne Gold / Violet** visual system, Cormorant Garamond / Manrope typography, glass surfaces, motion preferences, and responsive treatment from **trademind-academy-normalise.zip**.

## Run

```bash
npm run build
npm start
```

Open `http://localhost:4173`.

## Authentication

The Node server provides real registration, login, persistent HttpOnly sessions, logout, password hashing with `scrypt`, and account-level browser data namespaces. The current functional engine remains offline-first with localStorage + IndexedDB; each authenticated account receives an isolated namespace and cannot access another account's client data through the UI.

## Source of truth

- `public/index.html`: assembled functional application.
- `public/auth.js`: auth gate and per-user storage isolation.
- `server.mjs`: account/session service.
- `src/engine-build/`: preserved functional build modules.
- `src/lovable-*`: copied design-system components, styles, and translations retained as integration reference.
