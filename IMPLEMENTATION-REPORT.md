# TradeMind Academy — Product Architecture Implementation

## Scope completed

This update was implemented on top of the existing merged application. The existing journal, analytics, Plan Builder, Guardian, Psychology, i18n, responsive layout, and authentication foundations were preserved.

### Product architecture

- Centralized `FEATURE_MATRIX` and `tmPermissionEngine` for plan capabilities.
- Four distinct product identities:
  - **FOUNDATION** — Essential Discipline
  - **ASCEND** — Growth & Intelligence
  - **APEX** — Advanced Analysis
  - **SOVEREIGN** — Private Trading Intelligence
- Plan limits: 10, 30, 50, and unlimited trades per month.
- DAN permissions: Coach for ASCEND, locked for APEX, Sovereign for SOVEREIGN.
- Advanced analytics, matrix, historical analysis, reviews, and merit depth are represented centrally.

### Account and subscription lifecycle

- Added `USER` and `OWNER` roles.
- OWNER is configured with the `OWNER_EMAIL` environment variable and can test plan changes through the same permission engine.
- Normal users cannot mutate membership plans before payment activation.
- Added `subscription_start`, `subscription_end`, and `subscription_status`.
- Paid memberships expire server-side and resolve to FOUNDATION permissions without deleting data.
- Expiration metadata is returned by `/api/auth/me` and `/api/account/membership`.
- First name is stored for personalized DAN greetings.

### REAL / DEMO separation

- Demo plan state is stored only in `sessionStorage` as `tm_demo_plan`.
- Demo mode never calls the real plan mutation API.
- Demo mode displays explicitly synthetic metrics and blocks trade creation with a clear execution message.
- The real application view is visually isolated while demo mode is active.
- Exiting demo mode removes only the demo session state.

### DAN integration

- Added a floating vector DAN control.
- Added a contextual mini-chat panel that stays over the current page.
- Locked plans show DAN availability and membership guidance.
- Demo DAN is labeled and uses synthetic demo wording.
- Active DAN messaging is constrained to journal, performance, discipline, psychology, risk, plan adherence, and analytics context.

### UX and design

- Added plan transition overlay using the existing TradeMind logo.
- Added subscription expiration notifications for expiry and the five-day warning window.
- Added OWNER test controls to the Membership view.
- Added a first-name field to registration and account identity display.

## Validation performed

- `npm run build` passed.
- `node --check public/architecture.js` passed.
- Static application serving passed.
- Unauthenticated `/api/auth/me` returns `401`.
- OWNER registration returns `role: OWNER` when `OWNER_EMAIL` matches.
- OWNER can switch plans and receive subscription metadata.
- Expired paid plan resolves to `plan: FREE` with `subscription_status: expired`.
- USER plan mutation returns `403`.
- Test accounts and temporary session data were removed after validation.

## Not included

Payment integration was intentionally not started. The membership and subscription engine is prepared to receive payment-provider state in a later step.
