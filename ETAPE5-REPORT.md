# ETAPE 5 : fusion de la version ETAPE4 (menu, accueil, démo stable) avec les ajouts de la session précédente

## Gardé tel quel de ton ETAPE4
Menu du site et de l'application (rail flottant, pastille qui glisse), accueil avec le logo en 3D, plans en carrousel, installation mobile, capital démo stable, page /legal.html, tm-clean.js, polices Chakra Petch / Orbitron.
Capital démo vérifié : 13 460,35 $ identique à chaque chargement, en FR comme en EN, à trois instants différents.

## Ajouté
- **DAN à partir de APEX (5 $/mois)** : APEX reçoit DAN Coach, SOVEREIGN reçoit DAN Sovereign, FOUNDATION et ASCEND n'y ont plus accès. Appliqué dans le serveur (server/dan.mjs, server/app.mjs), le catalogue (server/payment-config.mjs), les droits de l'application (architecture.js), la carte statique du site et les messages de verrouillage. Le plan recommandé passe sur APEX (une ligne : `REC` dans site-plans.js).
- **DAN compatible avec n'importe quelle API d'IA** :
  - Format détecté tout seul : compatible OpenAI, Claude (Messages) ou Gemini, d'après l'adresse.
  - Une simple adresse de base suffit (https://api.exemple.com ou https://api.exemple.com/v1).
  - Modèle choisi automatiquement via /models si tu n'en donnes pas.
  - Variables universelles `DAN_API_URL`, `DAN_API_KEY`, `DAN_API_MODEL` (en plus de `CUSTOM_AI_*`).
  - Cinq fournisseurs prêts à l'emploi en plus : Together, Cerebras, Perplexity, Fireworks, Cohere.
  - Un modèle réglable pour chaque fournisseur depuis l'Owner (Santé du système > DAN AI).
  - Machine locale (Ollama, LM Studio) acceptée seulement avec `DAN_ALLOW_PRIVATE_URL=1`, sinon refusée par sécurité.
  - Les clés restent chiffrées côté serveur et ne sont jamais renvoyées au navigateur.
  - Tests : tests/dan-generic.test.mjs (17 cas, avec faux serveurs, vérifient le format réellement envoyé).
- **DAN un peu plus grand** : bouton 54 px (avant 42), panneau 430 px de large (avant 360), texte 13 px (avant 11), zone de messages plus haute, réponses un peu plus longues (900 jetons). Périmètre élargi d'un cran : en plus du journal, de la discipline et des fonctionnalités, DAN explique les notions de trading (vocabulaire, taille de position, ratio risque/rendement, drawdown, méthode de revue). Toujours aucun signal, prévision, garantie ni conseil d'investissement.
- **Section « Application mobile »** sur le site : le bouton Android apparaît seulement s'il existe un vrai APK (lien dans site-config.js ou fichier products/public-site/downloads/TradeMind-Academy.apk). Route /downloads/ ajoutée au serveur.
- **Démo interactive** (journal, Guardian, DAN) : données fictives, ajout d'un trade avec bouton « Annuler ».
- **Notifications avec « Annuler »**, chiffres qui comptent, courbes qui se dessinent, barre de progression du défilement (tm-extra.js / tm-extra.css).
- Violet restant retiré des plans de l'application (ASCEND : gris acier).

- **Listes de plans incrémentales** : chaque plan affiche « Tout [plan précédent], plus : » puis seulement ses nouveautés. Le tableau comparatif du site ne coche une fonction que dans le plan où elle apparaît, avec la mention « Chaque plan inclut tout le plan précédent ». Les fiches de plans de l'application suivent la même règle. Les droits de Dan de ces fiches (ASCEND sans Dan, APEX avec Dan Coach) sont alignés sur le serveur.

## Volontairement non repris
Mon dock vert, mon menu à pastille, mon accueil menthe et mes pages /terms et /privacy : ton ETAPE4 a déjà le menu que tu veux et la page /legal.html.

## À savoir
- Tests : dan-ai 10/10, dan-access 4/4, dan-generic 17/17, dan-providers 6/6, sync-api 84/84, netlify-function 8/8. `core-clients` échoue sur 1 cas, déjà instable dans ton archive d'origine.
- La page /legal.html garde des champs à compléter (éditeur, contact, durées) et doit être relue par un juriste.
- Le projet mobile Capacitor (APK) n'est pas dans ces deux zips : le zip MOBILE-UNIFIED-ETAPE6 précédent reste celui à compiler.
