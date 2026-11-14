export type Locale = "en" | "fr";

export const locales: Locale[] = ["en", "fr"];
export const defaultLocale: Locale = "en";

export const en = {
  meta: {
    localeLabel: "English",
    switchTo: "Switch language",
  },
  nav: {
    home: "Home",
    about: "About",
    features: "Features",
    pricing: "Pricing",
    contact: "Contact",
    login: "Login",
    getStarted: "Get Started",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  intro: {
    tagline: "Master your trading. Master yourself.",
  },
  hero: {
    eyebrow: "Trading education & performance",
    titleLine1: "Master your trading.",
    titleLine2: "Master yourself.",
    description:
      "TRADEMIND ACADEMY is built to help traders develop discipline, understand their performance and build better trading habits.",
    primaryCta: "Start Your Journey",
    secondaryCta: "Explore Premium",
    disclaimer: "An educational platform. No performance claims, no signals, no guarantees.",
  },
  about: {
    eyebrow: "About",
    title: "More than a trading journal.",
    description:
      "TRADEMIND ACADEMY is a framework for the part of trading that rarely gets attention: the trader. It exists to make your process visible, repeatable and honest.",
    quote: "Master your trading. Master yourself.",
    pageDescription:
      "A platform built around the trader, not the market — designed to make your process visible, repeatable and honest.",
    pillars: [
      {
        title: "Discipline",
        body: "Structure your routine so every decision follows a plan instead of an impulse.",
      },
      {
        title: "Analysis",
        body: "Review your own decisions with clarity and turn observations into refinements.",
      },
      {
        title: "Performance",
        body: "Understand how your process behaves over time — the habits behind the outcome.",
      },
      {
        title: "Risk management",
        body: "Define exposure rules first, then hold yourself accountable to them.",
      },
      {
        title: "Trader development",
        body: "Grow deliberately, in stages, with reflection built into the workflow.",
      },
    ],
  },
  features: {
    eyebrow: "Features",
    title: "The tools of a deliberate trader.",
    description:
      "A preview of the product experience. Each module is designed for clarity first.",
    badge: "Preview",
    pageTitle: "Built for clarity and consistency.",
    pageDescription:
      "A preview of the TRADEMIND ACADEMY product experience. Modules shown here are visual previews.",
    items: [
      {
        title: "Trading Journal",
        body: "A structured place to record decisions, context and reasoning behind every trade.",
      },
      {
        title: "Performance",
        body: "Review your process over time with clean, readable visual summaries.",
      },
      {
        title: "Risk Management",
        body: "Set your exposure rules and keep them present in every session.",
      },
      {
        title: "Trader Mindset",
        body: "Track emotional state and behaviour patterns alongside execution.",
      },
      {
        title: "Goals",
        body: "Define process-based objectives and follow your progression deliberately.",
      },
      {
        title: "Trading Calendar",
        body: "See your activity, discipline and routine mapped across the month.",
      },
    ],
  },
  premium: {
    eyebrow: "Premium",
    title: "Go beyond journaling.",
    description:
      "A look at the capabilities planned for TRADEMIND ACADEMY Premium. These are not available yet.",
    plannedLabel: "Planned capabilities",
    comingSoon: "Coming soon",
    items: [
      {
        title: "Advanced analytics",
        body: "Deeper views of your process, built for reflection rather than vanity metrics.",
      },
      {
        title: "Trader psychology",
        body: "Structured prompts and reviews around emotion, focus and decision quality.",
      },
      {
        title: "Advanced reports",
        body: "Exportable reviews to close each week and month properly.",
      },
      {
        title: "Smart reminders",
        body: "Gentle nudges that protect your routine and your rules.",
      },
      {
        title: "Advanced statistics",
        body: "Richer breakdowns of your own recorded data, always your own numbers.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Simple, honest pricing.",
    description: "Start free. Premium arrives later — no payment is collected today.",
    pageDescription:
      "No payment is collected at this stage. Premium will be announced when it is ready.",
    freeLabel: "Free",
    freePrice: "$0",
    freeNote: "Forever, for the essentials.",
    freeCta: "Coming Soon",
    premiumLabel: "Premium",
    premiumPrice: "$5",
    perMonth: "/ month",
    premiumNote: "For traders committed to the process.",
    premiumCta: "Premium Coming Soon",
    comingSoon: "Coming soon",
    freeItems: [
      "Trading journal",
      "Core performance views",
      "Risk rules & checklists",
      "Goals and calendar",
    ],
    premiumItems: [
      "Everything in Free",
      "Advanced analytics",
      "Trader psychology reviews",
      "Advanced reports & statistics",
      "Smart reminders",
    ],
  },
  cta: {
    titleStart: "Your edge is built through",
    titleAccent: "discipline.",
    button: "Start Your Journey",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk process.",
    description:
      "Accounts, login and messaging are not connected yet. This page is part of the visual foundation.",
    items: [
      {
        title: "Email",
        body: "Reach out for questions about the platform or early access.",
      },
      {
        title: "Feedback",
        body: "Tell us which modules matter most to your trading routine.",
      },
      {
        title: "Response",
        body: "We answer as the academy is being built, step by step.",
      },
    ],
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      message: "Message",
      messagePlaceholder: "How can we help?",
      submit: "Send message",
      required: "This field is required.",
      invalidEmail: "Please enter a valid email address.",
      unavailable: "Messaging is not connected yet.",
    },
  },
  footer: {
    tagline: "Master your trading. Master yourself.",
    academy: "Academy",
    support: "Support",
    about: "About",
    features: "Features",
    pricing: "Pricing",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    disclaimerLabel: "Risk disclaimer:",
    disclaimer:
      "Trading financial instruments involves substantial risk of loss and is not suitable for every investor. TRADEMIND ACADEMY provides educational tools and journaling software only. Nothing on this website is financial, investment or tax advice, a recommendation, or a solicitation to buy or sell any instrument. Past performance is never indicative of future results. You are solely responsible for your own trading decisions.",
  },
  legal: {
    eyebrow: "Legal",
    privacyTitle: "Privacy",
    termsTitle: "Terms of use",
    privacySections: [
      {
        heading: "Current status",
        body: "This website is a public presentation of TRADEMIND ACADEMY. There are no accounts, no databases and no analytics connected, so no personal data is collected or stored today.",
      },
      {
        heading: "Future data handling",
        body: "When journaling and accounts are introduced, your trading notes and records will belong to you. They will be used to power your own reviews inside the platform and nothing else.",
      },
      {
        heading: "No selling of data",
        body: "TRADEMIND ACADEMY will never sell personal or trading data to third parties.",
      },
      {
        heading: "Changes",
        body: "This policy will be expanded before any feature that processes personal data is released.",
      },
    ],
    termsSections: [
      {
        heading: "Educational purpose",
        body: "TRADEMIND ACADEMY provides educational content and journaling software. Nothing offered here constitutes financial, investment, legal or tax advice.",
      },
      {
        heading: "No performance claims",
        body: "We do not publish or promise trading results, win rates or returns. Any figures you record inside the platform in future are your own data.",
      },
      {
        heading: "Risk",
        body: "Trading involves substantial risk of loss and is not suitable for every investor. You are solely responsible for your decisions and for complying with the regulations of your jurisdiction.",
      },
      {
        heading: "Availability",
        body: "Features described on this website may be previews or planned capabilities. They may change, be delayed or be withdrawn.",
      },
    ],
  },
  errors: {
    notFoundTitle: "Page not found",
    notFoundBody: "The page you're looking for doesn't exist or has been moved.",
    goHome: "Go home",
    errorTitle: "This page didn't load",
    errorBody: "Something went wrong on our end. You can try refreshing or head back home.",
    tryAgain: "Try again",
    empty: "Nothing here yet.",
    emptyHint: "Content will appear once the platform is connected.",
  },
};

export type Dictionary = typeof en;

export const fr: Dictionary = {
  meta: {
    localeLabel: "Français",
    switchTo: "Changer de langue",
  },
  nav: {
    home: "Accueil",
    about: "À propos",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    contact: "Contact",
    login: "Connexion",
    getStarted: "Commencer",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
  intro: {
    tagline: "Maîtrisez votre trading. Maîtrisez-vous.",
  },
  hero: {
    eyebrow: "Formation & performance en trading",
    titleLine1: "Maîtrisez votre trading.",
    titleLine2: "Maîtrisez-vous.",
    description:
      "TRADEMIND ACADEMY aide les traders à développer leur discipline, à comprendre leur performance et à construire de meilleures habitudes de trading.",
    primaryCta: "Commencer votre parcours",
    secondaryCta: "Découvrir Premium",
    disclaimer:
      "Une plateforme éducative. Aucune promesse de performance, aucun signal, aucune garantie.",
  },
  about: {
    eyebrow: "À propos",
    title: "Bien plus qu'un journal de trading.",
    description:
      "TRADEMIND ACADEMY est un cadre de travail dédié à la dimension du trading la plus négligée : le trader. Son but est de rendre votre processus visible, reproductible et honnête.",
    quote: "Maîtrisez votre trading. Maîtrisez-vous.",
    pageDescription:
      "Une plateforme construite autour du trader, et non du marché — pensée pour rendre votre processus visible, reproductible et honnête.",
    pillars: [
      {
        title: "Discipline",
        body: "Structurez votre routine pour que chaque décision suive un plan plutôt qu'une impulsion.",
      },
      {
        title: "Analyse",
        body: "Relisez vos propres décisions avec clarté et transformez vos observations en améliorations.",
      },
      {
        title: "Performance",
        body: "Comprenez l'évolution de votre processus dans le temps — les habitudes derrière le résultat.",
      },
      {
        title: "Gestion du risque",
        body: "Définissez d'abord vos règles d'exposition, puis tenez-vous-y avec rigueur.",
      },
      {
        title: "Développement du trader",
        body: "Progressez délibérément, par étapes, avec la réflexion intégrée au processus.",
      },
    ],
  },
  features: {
    eyebrow: "Fonctionnalités",
    title: "Les outils d'un trader délibéré.",
    description:
      "Un aperçu de l'expérience produit. Chaque module est conçu avant tout pour la clarté.",
    badge: "Aperçu",
    pageTitle: "Conçu pour la clarté et la constance.",
    pageDescription:
      "Un aperçu de l'expérience produit TRADEMIND ACADEMY. Les modules présentés ici sont des aperçus visuels.",
    items: [
      {
        title: "Journal de trading",
        body: "Un espace structuré pour consigner vos décisions, le contexte et le raisonnement de chaque trade.",
      },
      {
        title: "Performance",
        body: "Analysez votre processus dans le temps grâce à des synthèses visuelles claires et lisibles.",
      },
      {
        title: "Gestion du risque",
        body: "Définissez vos règles d'exposition et gardez-les présentes à chaque séance.",
      },
      {
        title: "Mental du trader",
        body: "Suivez votre état émotionnel et vos schémas de comportement en parallèle de l'exécution.",
      },
      {
        title: "Objectifs",
        body: "Définissez des objectifs de processus et suivez votre progression avec méthode.",
      },
      {
        title: "Calendrier de trading",
        body: "Visualisez votre activité, votre discipline et votre routine sur tout le mois.",
      },
    ],
  },
  premium: {
    eyebrow: "Premium",
    title: "Allez au-delà du journal.",
    description:
      "Un aperçu des capacités prévues pour TRADEMIND ACADEMY Premium. Elles ne sont pas encore disponibles.",
    plannedLabel: "Capacités prévues",
    comingSoon: "Bientôt disponible",
    items: [
      {
        title: "Analyses avancées",
        body: "Des vues plus profondes de votre processus, pensées pour la réflexion plutôt que pour les chiffres flatteurs.",
      },
      {
        title: "Psychologie du trader",
        body: "Des questions et bilans structurés autour de l'émotion, de la concentration et de la qualité des décisions.",
      },
      {
        title: "Rapports avancés",
        body: "Des bilans exportables pour clôturer proprement chaque semaine et chaque mois.",
      },
      {
        title: "Rappels intelligents",
        body: "Des rappels discrets qui protègent votre routine et vos règles.",
      },
      {
        title: "Statistiques avancées",
        body: "Des analyses plus riches de vos propres données enregistrées, toujours vos chiffres.",
      },
    ],
  },
  pricing: {
    eyebrow: "Tarifs",
    title: "Des tarifs simples et honnêtes.",
    description: "Commencez gratuitement. Premium arrivera plus tard — aucun paiement aujourd'hui.",
    pageDescription:
      "Aucun paiement n'est collecté à ce stade. Premium sera annoncé lorsqu'il sera prêt.",
    freeLabel: "Gratuit",
    freePrice: "0 $",
    freeNote: "Pour toujours, pour l'essentiel.",
    freeCta: "Bientôt disponible",
    premiumLabel: "Premium",
    premiumPrice: "5 $",
    perMonth: "/ mois",
    premiumNote: "Pour les traders engagés dans le processus.",
    premiumCta: "Premium bientôt disponible",
    comingSoon: "Bientôt disponible",
    freeItems: [
      "Journal de trading",
      "Vues de performance essentielles",
      "Règles de risque & checklists",
      "Objectifs et calendrier",
    ],
    premiumItems: [
      "Tout ce qui est inclus dans Gratuit",
      "Analyses avancées",
      "Bilans de psychologie du trader",
      "Rapports & statistiques avancés",
      "Rappels intelligents",
    ],
  },
  cta: {
    titleStart: "Votre avantage se construit par la",
    titleAccent: "discipline.",
    button: "Commencer votre parcours",
  },
  contact: {
    eyebrow: "Contact",
    title: "Parlons processus.",
    description:
      "Les comptes, la connexion et la messagerie ne sont pas encore connectés. Cette page fait partie de la fondation visuelle.",
    items: [
      {
        title: "E-mail",
        body: "Écrivez-nous pour toute question sur la plateforme ou l'accès anticipé.",
      },
      {
        title: "Retours",
        body: "Dites-nous quels modules comptent le plus pour votre routine de trading.",
      },
      {
        title: "Réponse",
        body: "Nous répondons au fil de la construction de l'académie, étape par étape.",
      },
    ],
    form: {
      name: "Nom",
      namePlaceholder: "Votre nom",
      email: "E-mail",
      emailPlaceholder: "vous@exemple.com",
      message: "Message",
      messagePlaceholder: "Comment pouvons-nous vous aider ?",
      submit: "Envoyer le message",
      required: "Ce champ est obligatoire.",
      invalidEmail: "Veuillez saisir une adresse e-mail valide.",
      unavailable: "La messagerie n'est pas encore connectée.",
    },
  },
  footer: {
    tagline: "Maîtrisez votre trading. Maîtrisez-vous.",
    academy: "Académie",
    support: "Assistance",
    about: "À propos",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    contact: "Contact",
    privacy: "Confidentialité",
    terms: "Conditions",
    disclaimerLabel: "Avertissement sur les risques :",
    disclaimer:
      "Le trading d'instruments financiers comporte un risque de perte substantiel et ne convient pas à tous les investisseurs. TRADEMIND ACADEMY fournit uniquement des outils éducatifs et un logiciel de journal de trading. Rien sur ce site ne constitue un conseil financier, en investissement ou fiscal, une recommandation, ni une sollicitation d'achat ou de vente d'un instrument. Les performances passées ne préjugent jamais des résultats futurs. Vous êtes seul responsable de vos décisions de trading.",
  },
  legal: {
    eyebrow: "Mentions légales",
    privacyTitle: "Confidentialité",
    termsTitle: "Conditions d'utilisation",
    privacySections: [
      {
        heading: "État actuel",
        body: "Ce site est une présentation publique de TRADEMIND ACADEMY. Aucun compte, aucune base de données et aucun outil d'analyse ne sont connectés : aucune donnée personnelle n'est donc collectée ou stockée aujourd'hui.",
      },
      {
        heading: "Traitement futur des données",
        body: "Lorsque le journal et les comptes seront introduits, vos notes et enregistrements de trading vous appartiendront. Ils serviront uniquement à alimenter vos propres bilans dans la plateforme.",
      },
      {
        heading: "Aucune revente de données",
        body: "TRADEMIND ACADEMY ne vendra jamais de données personnelles ou de trading à des tiers.",
      },
      {
        heading: "Modifications",
        body: "Cette politique sera enrichie avant la sortie de toute fonctionnalité traitant des données personnelles.",
      },
    ],
    termsSections: [
      {
        heading: "Finalité éducative",
        body: "TRADEMIND ACADEMY fournit du contenu éducatif et un logiciel de journal de trading. Rien de ce qui est proposé ici ne constitue un conseil financier, en investissement, juridique ou fiscal.",
      },
      {
        heading: "Aucune promesse de performance",
        body: "Nous ne publions ni ne promettons de résultats de trading, de taux de réussite ou de rendements. Les chiffres que vous enregistrerez dans la plateforme seront vos propres données.",
      },
      {
        heading: "Risque",
        body: "Le trading comporte un risque de perte substantiel et ne convient pas à tous les investisseurs. Vous êtes seul responsable de vos décisions et du respect de la réglementation de votre juridiction.",
      },
      {
        heading: "Disponibilité",
        body: "Les fonctionnalités décrites sur ce site peuvent être des aperçus ou des capacités prévues. Elles peuvent évoluer, être retardées ou être retirées.",
      },
    ],
  },
  errors: {
    notFoundTitle: "Page introuvable",
    notFoundBody: "La page que vous cherchez n'existe pas ou a été déplacée.",
    goHome: "Retour à l'accueil",
    errorTitle: "Cette page n'a pas pu être chargée",
    errorBody: "Une erreur est survenue de notre côté. Essayez de rafraîchir ou revenez à l'accueil.",
    tryAgain: "Réessayer",
    empty: "Rien à afficher pour le moment.",
    emptyHint: "Le contenu apparaîtra dès que la plateforme sera connectée.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, fr };
