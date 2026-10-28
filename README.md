# TRADEMIND ACADEMY — Application mobile (Vite + React + TypeScript + Capacitor)

Interface mobile **indépendante** du site, mais **mêmes comptes, même API, même base distante** : le serveur du site (Netlify Function + Netlify Blobs) est la **seule source de vérité**. Cette application n'a plus de backend propre.

## Ce que fait l'application (état vérifié)
- Connexion / inscription via l'API du site (`/api/auth/*`) avec un **jeton Bearer** (identique à la session serveur, émis uniquement pour `x-tm-client: mobile` + origine autorisée). Pas de cookie, pas de compte OWNER sur mobile.
- Synchronisation trades / plans / réglages avec le serveur (`src/sync/tmsync.ts` + noyau partagé `src/sync/tmsync-core.js`, identique à celui du site) : versions, conflits, suppressions, hors-ligne, quotas du plan.
- Mode DÉMO isolé : aucune donnée démo n'est jamais envoyée au serveur.
- Abonnements FOUNDATION(FREE, 10/mois) · ASCEND(PRO, 2,5 $, 30) · APEX(PRO MAX, 5 $, 50) · SOVEREIGN(ELITE, 10 $, illimité). Les informations de paiement viennent du serveur ; aucun paiement n'est simulé.

## Configuration
Copiez `.env.example` en `.env` et mettez l'URL du site :
```
VITE_API_BASE_URL=https://VOTRE-SITE.netlify.app
```
Aucun secret dans ce projet. Côté Netlify, l'origine `https://localhost` (Capacitor) est autorisée par défaut ; ajoutez d'autres origines via `MOBILE_ALLOWED_ORIGINS`.

## Commandes
```
npm install
npm run lint     # contrôle TypeScript
npm run build    # compile vers dist/
npx cap add android && npx cap sync android
```

## Construire l'APK depuis GitHub (téléphone Android)
1. Dépôt GitHub > Settings > Secrets and variables > Actions > **Variables** > New : `API_BASE_URL` = `https://VOTRE-SITE.netlify.app`.
2. Onglet Actions > « Build Android APK » > Run workflow.
3. Téléchargez l'artefact `TradeMind-Academy-Debug-APK`.

## État de vérification (honnête)
| Élément | Statut |
|---|---|
| Typage TypeScript (tsc, avec stubs de dépendances) | PASS partiel |
| Mapping trade/plan/réglages mobile ↔ format commun + serveur réel (tests dans le projet web : `tests/core-clients.test.mjs`) | PASS |
| `npm install` / `vite build` réels | NON TESTÉ (registre npm inaccessible dans l'environnement de travail) |
| Capacitor / Gradle / APK / installation sur téléphone | NON TESTÉ |
| Workflow GitHub Actions | NON TESTÉ (jamais exécuté) |

## Limites connues
- Pas d'écran « mot de passe oublié » sur mobile : utiliser la procédure du site.
- Le jeton est stocké dans le stockage de la WebView (pas dans le Keystore Android).
- Les plans du site et du mobile ont des schémas différents : chaque application conserve ses plans, sans conversion croisée.
- `legacy-not-for-production/` contient l'ancien backend autonome et l'ancien README, **conservés mais inutilisés** ; ne pas déployer.
