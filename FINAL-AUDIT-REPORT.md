# TRADEMIND ACADEMY : audit final (phases 1 à 4)

Livraison : le serveur, le site et l'espace Owner sont dans le ZIP WEB. Le ZIP APPLICATION ne contient que l'application (aucun fichier Owner).

## Défauts trouvés et corrigés

| Gravité | Défaut | Correction | Preuve |
|---|---|---|---|
| CRITIQUE | Les trades d'un compte pouvaient être envoyés vers un autre compte lors d'un changement de compte pendant une synchronisation (test d'isolation en échec 5 fois sur 6 sur la version ETAPE5) | `tmsync-core.js` : la synchronisation est annulée si le compte change, aucune requête n'est émise pour un compte inactif, relance propre pour le nouveau compte | `core-clients` 22/22 sur 8 exécutions de suite, `sync-account-race` 6/6 (échoue sur l'ancien noyau) |
| CRITIQUE | Une seule requête non authentifiée avec `..%2f` dans l'URL faisait planter le serveur Node | `fileResponse` et `safeJoin` corrigés, gestion globale des erreurs, 400 pour une URL mal formée | `auth-security` 44/44 (l'ancienne version plante) |
| CRITIQUE (règle de livraison) | Un paiement NOWPayments « finished » ou un webhook signé activait le plan automatiquement, sans validation du propriétaire | Nouvel état `PAYMENT_RECEIVED` : le propriétaire est notifié, aucun accès n'est accordé, il doit valider le montant reçu (`confirmAmount`) | `billing-flow` 32/32 (sur l'ancienne version : plan activé immédiatement) |
| MAJEUR | Adresse e-mail personnelle codée en dur comme destinataire par défaut des alertes | Variable `OWNER_NOTIFY_EMAIL` obligatoire, sinon alertes dans l'application seulement | lecture du code, `billing-flow` |
| MAJEUR | Un trade pouvait être enregistré avec des nombres invalides, un Stop Loss égal à l'entrée, un risque hors 0 à 100 %, ou un résultat contraire au P&L | Validations avec messages FR/EN dans le formulaire | `analytics` 28/28 |
| MAJEUR | Débordements : boutons de courbes coupés (Évolution jusqu'à 411 px), titres débordants (320 à 375 px), boutons langue et thème hors écran sur le site à 1024 px, barre de l'Owner qui déborde à 768 px | CSS corrigé | `ui_responsive_audit` 135/135 contrôles à 9 largeurs |
| MINEUR | `safeJoin` acceptait un dossier frère de même préfixe ; serveur autonome de l'application sans styles partagés ni décodage d'URL | Corrigés | smoke test du serveur autonome |
| MINEUR | Test de taille de Dan périmé (44 px), alors que Dan est maintenant à 54 px | Test mis à jour | `ui_account_dan` 24/24 |

## Résultats des tests (exécutés sur l'archive FINAL extraite)
Toutes réussies, sur l'archive extraite dans un dossier neuf (`npm test`, code de sortie 0) :
dan-ai 10, dan-access 4, dan-generic 17, dan-providers 6, sync-api 84, core-clients 22, sync-account-race 6, billing-flow 32, auth-security 44, analytics 28, subscription-lifecycle 28, hardening 28, netlify-function 8.
Interface (navigateur réel) : ui_responsive_audit 135/135 contrôles (9 largeurs, site, application en démo, Owner), ui_auth_flow 24, ui_sync_web 15, ui_pw_eye 16, ui_account_dan 24, ui_typography 38. Build et vérification Netlify : OK.

## Observations non modifiées (décisions à prendre)
- Changement vers un autre plan : l'échéance repart de la date du jour, les jours restants de l'ancien plan sont perdus (renouvellement du même plan : aucun jour perdu).
- L'inscription révèle qu'un e-mail existe déjà (409). La connexion et le mot de passe oublié ne le révèlent pas.
- L'ancien test `core-clients` était instable : ce n'était pas un problème de test mais le défaut CRITIQUE ci-dessus.

## Fonctionnalités demandées absentes du code
Captures d'écran des trades, Académie (formations, vidéos, progression), photo de profil, suivi d'objectifs dédié. Je n'ai trouvé aucun code correspondant dans l'application (recherche dans `index.html`, `refactor.js`, `ui.js`). Elles ne sont ni testées ni simulées.

## Non vérifiables sans services ou données réels
Paiement NOWPayments réel (la logique est testée avec un faux fournisseur local), envoi d'e-mails, réponses de Dan avec une vraie clé d'IA, persistance durable sur Netlify (Blobs), audit des dépendances (`npm audit` impossible sans réseau ; une seule dépendance : `@netlify/blobs`), projet mobile Capacitor (non inclus dans ces archives ; il contient une copie de `tmsync-core.js` à mettre à jour avec le correctif).

## À configurer
`OWNER_SETUP_TOKEN`, `OWNER_NOTIFY_EMAIL`, clés d'IA (au moins une), `NOWPAYMENTS_API_KEY` et `NOWPAYMENTS_IPN_SECRET`, `PAYMENT_WEBHOOK_SECRET`, fournisseur d'e-mail, base de données durable en production, champs surlignés de `legal.html`, lien de l'APK Android.
