# TradeMind Academy — Refonte product / UX / architecture

Date: 2026-09-29

## Implemented

- Official logo integrated unchanged from `public/assets/trademind-official-logo.jpg` in splash, navigation and authentication.
- Permanent left sidebar removed.
- Floating responsive command navigation implemented for desktop and mobile.
- Legacy custom cursor/touch circle removed; normal keyboard focus styles remain intact.
- Centralized membership identity and permission engine:
  - FREE / FOUNDATION: 10 trades per month, DAN locked.
  - PRO / ASCEND: 30 trades per month, DAN Coach enabled.
  - PRO MAX / APEX: 50 trades per month, DAN locked.
  - ELITE / SOVEREIGN: unlimited numeric cap, DAN Sovereign enabled.
- Centralized plan tokens: `--plan-accent`, `--plan-glow`, `--plan-border`, `--plan-surface`, `--plan-text`.
- Dashboard command surfaces for membership identity, capacity, DAN status, weekly review, monthly review and merit badges.
- Plan Builder with editable confirmations, weights, exact 100% validation, versioning and activation state.
- Active Plan Builder confirmations appear automatically in Add Trade with their weights and a live Plan Score.
- Trade snapshot enrichment records plan ID, name, version, confirmations, weights and score for new trades without mutating older snapshots.
- Trade creation guard checks monthly capacity before allowing a new trade.
- DAN panels use recorded journal data only and do not generate fake signals, predictions or guarantees.
- Existing engine, journal, analytics and authentication architecture preserved.

## Verified

| Area | Result |
|---|---|
| `npm run build` | Passed |
| `node --check public/refactor.js` | Passed |
| Public Preview HTTP response | 200 |
| Signup form with Gmail-format address | Passed in live browser |
| Official logo visible in auth and app shell | Passed |
| Membership / capacity surfaces with empty journal | Passed |
| Plan Builder editable name field | Passed after runtime fix |
| Plan Builder exact 100% activation | Passed: 40% + 30% + 30%, `SYSTEM READY` |
| Active confirmations in Add Trade | Passed: HTF Bias, Liquidity Sweep, FVG with 40/30/30 weights |
| Legacy cursor source | Removed and verified absent |
| Temporary test account cleanup | Completed |

## Preview

https://4173-iq13tg3kr6241nsiq2ndv-f14d277d.us4.manus.computer

## Important product note

The membership matrix and restrictions are implemented centrally and currently resolve the authenticated account's persisted `plan` field. The current server creates accounts as FREE / FOUNDATION; no payment or subscription-upgrade workflow was invented. Connecting real billing or changing a user's server-side membership remains a separate protected product operation.
