# ETAPE 4 — Accueil, menus, plans, application compacte, espace Owner

Présentation uniquement. Aucun changement dans server/, billing, paiements, abonnements, droits ou routes.

- Palette : bleu nuit + vert menthe (trademind-core.css, partagé par site, application et Owner). L'or reste réservé aux plans et au « T » du logo.
- Accueil : nouveau premier écran (logo en fond qui fait un tour complet en 3D toutes les 16 s, une seule lueur), titre sans astuce « pas X, c'est Y », boutons Web et Application mobile, plus de petit graphique.
- Menu du site : pilule pleine qui glisse d'un onglet à l'autre (assets/home-v2.css).
- Plans : carrousel en perspective (glisser, flèches, clavier), alimenté par le catalogue du backend (assets/home-v2.js). Aucun prix ni droit n'est écrit dans le code.
- Installation mobile : le bandeau « Installer / Continuer sur le navigateur » s'affiche toujours sur navigateur mobile ; sans lien officiel, il explique « Ajouter à l'écran d'accueil ». Les liens se renseignent dans assets/site-config.js.
- Application : titres et chiffres plus petits sur téléphone, tableaux en cartes (assets/app-v2.css, app-v2.js).
- Owner : menu à pilule glissante, cartes et tableaux denses, tableaux en cartes sur téléphone, apparition progressive (assets/owner-v2.css, owner-v2.js).
- Polices : Chakra Petch (titres), Orbitron (nom TRADEMIND), texte courant inchangé.

À faire par le propriétaire : pages Conditions et Confidentialité (les liens du pied de page pointent vers #terms et #privacy qui n'existent pas), liens de téléchargement de l'application.
Tests : tests existants lancés ; core-clients est instable aussi sur l'archive d'origine (1 cas sur 3 environ).

## Correctifs menu et démo (suite)
- Menu : rail flottant à gauche (téléphone, tablette), une icône distincte par entrée, pilule qui glisse sur l'entrée active, bouton pour déplier avec les libellés. Ordinateur : menu latéral existant, avec les mêmes icônes. Barre du bas et ancien tiroir « Command Center » masqués (assets/app-v2.css, app-v2.js).
- Capital démo qui changeait : (1) une animation du capital se relançait à chaque changement du texte et dérivait, surtout en français (app-immersive.js) ; (2) la démo utilisait des valeurs aléatoires. Désormais : mêmes 40 trades à chaque chargement, capital 13 460,35 $ (+34,60 %), identique en FR et EN.

## Passage de la liste « 30 signes de site vibe-codé »
- Tirets longs : 82 remplacés par « : » dans le site, l'application et l'Owner.
- Emojis comme icônes : soleil, lune et drapeaux remplacés par de vraies icônes et des pastilles FR / EN (assets/tm-clean.js).
- Violet : supprimé (remplacé par un gris acier). Orbe lumineux de l'accueil et lueurs : supprimés. Liseré coloré à gauche : supprimé (menu Owner et notes).
- « Pas X, c'est Y » : deux formules du site réécrites en phrases directes.
- Aucune démo produit : ajout d'un aperçu réel de l'application (capture avec trades de démonstration, FR et EN, ordinateur et téléphone), clairement marqué fictif.
- CGU et confidentialité : nouvelle page /legal.html (FR et EN), liens du pied de page corrigés. Texte basé sur ce que fait le produit ; à relire et compléter (identité légale, contact, durées de conservation).
- Menu de l'application : classement des entrées corrigé en français, pied du menu qui chevauchait la liste, « 63 % % » corrigé.
- Tests existants : 5 suites, 130 cas, tous réussis lors de cette dernière exécution.
- Menu de l'application : doublon « Guardian » corrigé.
