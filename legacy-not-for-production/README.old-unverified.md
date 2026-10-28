# TRADEMIND ACADEMY — Trader Intelligence System
> **"Master your trading. Master yourself."**

Système d'intelligence de processus de trading privé, mobile-first, sécurisé avec synchronisation multi-appareils, barre de navigation basse Android avec safe-areas, plans de trading personnalisables avec score en temps réel, moniteur de risque Guardian, et assistant DAN AI.

---

## 1. Audit Technique & Finalisation UI / Navigation / Abonnements

- **Emplacement du Menu Mobile (Priorité Absolue)** :
  - Barre inférieure fixe compacte (`BottomNav.tsx`) à `fixed bottom-0` avec respect de `env(safe-area-inset-bottom)`.
  - 5 destinations directes : **Accueil**, **Journal**, **Plans de trading**, **Performance**, **Plus**.
  - Menu « Plus » (`PlusMenuModal.tsx`) donnant accès à : Plans de trading, Matrice d'évolution, Calendrier, Profil, Sécurité, Abonnement, et Calculateur de risque.
  - Espace inférieur calibré (`pb-28 sm:pb-32`) sur toutes les pages pour empêcher tout masquage de formulaire, bouton ou tableau.
  - Sur ordinateur : navigation de bureau fluide et harmonieuse adaptée à la largeur d'écran, sans forcer la barre mobile.
- **DAN AI (Emplacement & Interaction)** :
  - Bouton flottant discret (`DanFloatingButton.tsx`) placé à `bottom-20 right-4` sur mobile, confortablement **au-dessus** de la barre de menu pour ne jamais masquer les boutons.
  - Panneau compact avec bouton de fermeture `X`, évitant d'enfermer l'écran sur téléphone.
  - État explicite si le service IA n'est pas configuré (`DAN_NOT_CONFIGURED`), sans fausse réponse simulée.
- **Abonnements & Tarification Vérifiée** :
  - **Plan par défaut d'un nouvel utilisateur** : strictement `FREE / FOUNDATION` (0 $, 10 trades / mois).
  - **Grille tarifaire exacte du site** :
    - `FREE / FOUNDATION` : 0 $ / mois (10 trades/mois)
    - `PRO / ASCEND` : 2,50 $ / mois (30 trades/mois)
    - `PRO MAX / APEX` : 5,00 $ / mois (50 trades/mois)
    - `ELITE / SOVEREIGN` : 10,00 $ / mois (trades illimités)
  - Cartes interactives et cliquables ouvrant la modale de commande (`SubscriptionModal.tsx`).
  - Parcours de paiement réel : NOWPayments automatique (avec gestion de clé secrète et webhook IPN) et méthodes manuelles transparentes (Airtel Money +243 970 000 000, USDT BEP-20/ERC-20, Bitcoin SegWit).
- **Score du Plan Structuré & Lisible** :
  - Section dédiée (`PlanScoreSection.tsx`) articulée en 5 volets :
    A. En-tête (Nom, marchés, dates, actions rapides).
    B. Score global (sur 100, jauge circulaire, grand chiffre, grade de qualité et explications).
    C. Détail des critères (tableau/liste structurée, poids, statut, recalcul dynamique interactif).
    D. Règles et gestion du risque (cartes séparées pour Risque max, R/R minimal, Perte max journalière, Trades max).
    E. Actions fonctionnelles (Modifier, Enregistrer, Annuler, Dupliquer, Activer/Désactiver).

---

## 2. Rapport d'Exécution des 28 Contrôles de Synchronisation

La suite de test automatisée `tests/sync-28-controls.test.mjs` a été exécutée directement dans l'environnement avec **100% de réussite** :

| N° | Contrôle | Statut | Preuve Technique |
|:---|:---|:---:|:---|
| 01 | Identification & session utilisateur | **PASS** | Session active vérifiée pour `trader.alpha@trademind.test` |
| 02 | Initialisation stockage et moteur synchro | **PASS** | Stockage local initialisé avec réglages par défaut |
| 03 | Connexion serveur (Health check) | **PASS** | Accusé de réception horodaté reçu du serveur |
| 04 | Authentification de la requête | **PASS** | Token valide accepté (200), token erroné rejeté (401) |
| 05 | Pull initial des données distantes | **PASS** | Pull initial retournant 0 trade, structure conforme |
| 06 | Enregistrement nouveau trade réel client | **PASS** | Trade réel créé avec `mode: REAL`, `demo: false` |
| 07 | Mise en file locale pour synchro | **PASS** | File locale contient 1 élément prêt à être poussé |
| 08 | Push du trade réel vers le serveur | **PASS** | Serveur persiste 1 trade réel (`persistedRealCount: 1`) |
| 09 | Accusé de réception serveur | **PASS** | Accusé horodaté confirmant 1 trade total en base |
| 10 | Persistance en base de données | **PASS** | Trade `tr_alpha_001` vérifié dans la base distante |
| 11 | Mise à jour de trade existant | **PASS** | PnL mis à jour à +220 et R à 3.6 |
| 12 | Suppression & génération de tombstone | **PASS** | Trade retiré et tombstone enregistré pour `tr_alpha_001` |
| 13 | Propagation du tombstone au pull | **PASS** | `deletedTradeIds` contient le tombstone lors du pull |
| 14 | Résolution de conflit par horodatage | **PASS** | Version la plus récente (Last-Write-Wins) retenue |
| 15 | Isolation multi-utilisateurs (RBAC) | **PASS** | L'utilisateur B a 0 trade de l'utilisateur A |
| 16 | Respect des quotas mensuels | **PASS** | Blocage serveur à 10 trades pour le compte FREE |
| 17 | Gestion de la perte de réseau | **PASS** | Requêtes suspendues automatiquement en mode hors ligne |
| 18 | File d'attente persistante hors ligne | **PASS** | Trade conservé dans la file locale hors ligne |
| 19 | Reprise automatique à la reconnexion | **PASS** | Trade en attente synchronisé dès le retour en ligne |
| 20 | **[CRITIQUE] Mode DÉMO actif** | **PASS** | **3 trades démo rejetés côté serveur (rejectedDemoTrades: 3), persistedRealCount: 0, trades démo en base: 0. Preuve mathématique obtenue.** |
| 21 | Neutralisation file d'attente en DÉMO | **PASS** | `clearPendingDemoTrades()` purge les trades démo de la file |
| 22 | Étanchéité mémoire DÉMO / serveur RÉEL | **PASS** | 0 trade démo renvoyé ou accepté par le serveur |
| 23 | Changement de mode DÉMO -> RÉEL | **PASS** | Le mode REAL n'enregistre que des trades réels sans résidu démo |
| 24 | Rejet serveur de marqueurs démo | **PASS** | 2 trades suspects rejetés par le filtre multicritère serveur |
| 25 | Pushes concurrents sans course (Race) | **PASS** | Deux pushes simultanés sérialisés sans perte de données |
| 26 | Synchronisation des réglages utilisateur | **PASS** | Capital (25 000 €), devise, risque et Guardian synchronisés |
| 27 | Gestion de session révoquée | **PASS** | Requête rejetée avec HTTP 401 `SESSION_REVOKED` |
| 28 | Robustesse aux erreurs JavaScript | **PASS** | Payloads malformés ou `null` gérés gracieusement sans crash |

**Total : 28 / 28 PASS — 0 FAIL — 0 NOT RUN.**

---

## 3. Plans de Trading Personnalisables (Règle Fondamentale)

SMC n'est pas imposé : chaque utilisateur dispose d'une liberté totale.
- **10 Modèles Prêts à l'Emploi ou Plan Vierge** :
  1. *Plan Vierge* (configuration 100% libre)
  2. *Support & Résistance* (Niveaux clés HTF, Retest, Rejet de chandelier, RR >= 2.0)
  3. *Stratégie Indicateurs* (Croisement EMA 20/50, RSI Momentum, MACD Trigger)
  4. *Smart Money Concepts (SMC)* (Biais HTF, Liquidity Sweep, BOS/CHOCH, FVG, OTE)
  5. *Price Action & Chandelier* (Pin bar, Avalement, Dynamique de flux)
  6. *Suivi de Tendance & MAs* (Filtre 200 EMA, Pullback 20/50 EMA)
  7. *Breakout & Retest* (Cassure de range, Volume, Retest de borne)
  8. *Fondamentaux & Macro* (Catalyseur économique, Sécurité news)
  9. *Scalping Dynamique* (M1/M5, Risque borné <= 0.5%, Exécution immédiate)
  10. *Swing Trading* (Structure Daily/H4, Objectif RR >= 3.0, Frais de nuit)
- **Critères Riches** :
  - Statut : *Obligatoire*, *Facultatif*, *Informatif*.
  - Nature : *Qualitatif* (validé manuellement par le trader) ou *Quantitatif* (seuil automatique sur RR ou Risque).
  - Poids personnalisable dans le score (0 à 100%).
  - Score activable ou désactivable selon la préférence.
- **Instantané Immuable (`planSnapshot`)** :
  Chaque trade enregistre un instantané scellé du plan et des critères utilisés au moment de sa prise de position. Modifier un plan ne réécrit jamais le passé.
- **Enregistrement Non-Bloquant en cas d'écart** :
  L'application affiche clairement les violations au plan au lieu d'interdire la saisie, car un journal doit refléter la réalité des décisions prises.

---

## 4. Œil des Mots de Passe Accessible

Le composant `PasswordInput` (React) et la fonction utilitaire dans `public/ui.js` reconstituent le bouton afficher/masquer le mot de passe :
- Accessible au clavier (Tab, Espace, Entrée) et adapté aux écrans tactiles mobiles.
- Annonce son état aux lecteurs d'écran via `aria-label="Afficher le mot de passe"` / `"Masquer le mot de passe"` et `aria-pressed="false|true"`.
- Préserve la valeur saisie, la sélection et la position du curseur (`setSelectionRange`).
- Sécurité renforcée : aucune journalisation ou conservation en clair du mot de passe.

---

## 5. Préparation Android & Workflow APK

- **Configuration Capacitor** : `capacitor.config.json` avec identifiant `com.trademind.academy`.
- **Manifest Android Minimaliste** : `android/app/src/main/AndroidManifest.xml` n'embarquant que les permissions strictement nécessaires (`INTERNET`, `ACCESS_NETWORK_STATE`) et la gestion des safe areas.
- **Workflow GitHub Actions** : `.github/workflows/build-apk.yml` automatisant :
  1. Setup Node.js 20 & Java JDK 17 (Temurin).
  2. `npm run build` (génération de l'application web optimisée).
  3. `npx @capacitor/cli sync android`.
  4. `./gradlew assembleDebug`.
  5. Publication de l'artefact `app-debug.apk` téléchargeable directement sur GitHub.

### Commandes pour compiler l'APK en local :
```bash
# 1. Compiler le client web
npm run build

# 2. Synchroniser le projet Android
npx cap add android
npx cap sync android

# 3. Compiler l'APK debug
cd android
./gradlew assembleDebug

# L'APK est généré dans :
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 6. Commandes d'Exécution & Test

```bash
# Lancer les 28 contrôles de synchronisation
npm test

# Lancer le serveur Full-Stack en développement
npm run dev

# Compiler pour la production
npm run build

# Lancer le serveur en production
npm start
```

---

## 7. Téléchargement de l'Archive Complète

L'archive ZIP complète et à jour est disponible immédiatement :
- À la racine : `/TRADEMIND-ACADEMY-UPDATED.zip`
- Via le serveur web : `/public/TRADEMIND-ACADEMY-UPDATED.zip`
- Téléchargeable directement depuis votre navigateur à l'adresse de l'application : `https://ais-dev-6eqzuncwufeywuyxbkn2lc-94740088857.europe-west1.run.app/TRADEMIND-ACADEMY-UPDATED.zip`


## Notes de sécurité et de déploiement (corrections de finalisation)

- Le build Netlify exécute désormais `npm run build:server` avant Vite afin de générer `server.js`, attendu par `netlify/functions/api.ts`.
- L'inscription publique crée toujours un compte `USER` avec le plan `FREE`. Le rôle `OWNER` ne doit être attribué que par un processus administratif privé côté serveur; ne le déduisez jamais d'une adresse e-mail ni du fait d'être le premier inscrit.
- Les nouveaux mots de passe sont hachés avec `scrypt` et un sel aléatoire par compte. Les anciens hachages SHA-256 sont migrés lors d'une connexion réussie.
- La récupération/réinitialisation du mot de passe renvoie volontairement `PASSWORD_RESET_NOT_CONFIGURED` (HTTP 503) tant qu'un fournisseur d'e-mail et un workflow de jetons temporaires, à usage unique et expirables ne sont pas configurés. Aucun faux succès n'est annoncé.
- **Important :** le stockage JSON dans `/tmp` sur Netlify Functions n'est pas une base persistante. Avant une production publique, configurez une base de données durable et adaptez `server/db.ts` à cette base. Les tests locaux ne prouvent pas la persistance en production.
- Les secrets API doivent être configurés dans les variables d'environnement serveur Netlify. Ne placez jamais une clé privée dans le code client ou dans une variable `VITE_*`.
