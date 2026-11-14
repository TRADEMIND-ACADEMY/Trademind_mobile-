if(typeof window!=='undefined'&&typeof window.Chart==='undefined'){window.Chart=function(){return{destroy:function(){},update:function(){},resize:function(){},data:{datasets:[]},options:{}};};}
const ICONS={
home:'<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9h5v-5h2v5h5v-9"/>',
journal:'<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
add:'<path d="M12 5v14M5 12h14"/>',
analytics:'<path d="M4 20V10M10 20V4M16 20v-7M4 20h16"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
evolution:'<path d="M4 16l5-6 4 3 7-9"/><path d="M15 4h5v5"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>',
moon:'<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>'
};
function svg(name,sw){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw||1.6}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;}
function applyNavLabels(){document.querySelectorAll('[data-i]').forEach(el=>{el.innerHTML=(el.tagName==='A'||el.className.includes('navlink'))?svg(el.dataset.i)+'<span>'+({home:tr('nav.dashboard'),journal:tr('nav.journal'),evolution:tr('nav.evolution'),add:tr('nav.add'),analytics:tr('nav.analytics'),settings:tr('nav.settings')}[el.dataset.i])+'</span>':svg(el.dataset.i,1.5)+'<span>'+({home:tr('nav.dashboard'),journal:tr('nav.journal'),evolution:tr('nav.evolution'),add:tr('nav.add'),analytics:tr('nav.analytics'),settings:tr('nav.more')}[el.dataset.i])+'</span>';});}


/*I18N-CORE:START*/
const I18N={};
function tr(key){const lang=(typeof ST!=='undefined'&&ST.settings&&ST.settings.lang)||'en';return (I18N[lang]&&I18N[lang][key])||I18N.en[key]||key;}
function LOC(){return (typeof ST!=='undefined'&&ST.settings&&ST.settings.lang==='fr')?'fr-FR':'en-US';}
/*I18N-CORE:END*/
/*EN:START*/
I18N.en={
"nav.dashboard": "Dashboard",
"nav.journal": "Journal",
"nav.evolution": "Evolution",
"nav.add": "Add",
"nav.analytics": "Performance",
"nav.settings": "Settings",
"nav.more": "More",
"common.trades": "Trades",
"common.tradesLower": "trades",
"common.winRate": "Win Rate",
"common.netPnl": "Net P&L",
"common.totalR": "Total R",
"common.avgR": "Average R",
"common.profitFactor": "Profit Factor",
"common.grossProfit": "Gross Profit",
"common.grossLoss": "Gross Loss",
"common.avgWin": "Average Win",
"common.avgLoss": "Average Loss",
"common.return": "Return %",
"common.drawdown": "Drawdown",
"common.maxDrawdown": "Max Drawdown",
"common.startingBalance": "Starting Balance",
"common.currentBalance": "Current Balance",
"common.balance": "Balance",
"common.equity": "Equity",
"common.equityHigh": "Equity High",
"common.totalTrades": "Total Trades",
"common.wins": "Wins",
"common.losses": "Losses",
"common.breakeven": "Breakeven",
"common.win": "Win",
"common.loss": "Loss",
"common.limitedSample": "Limited sample",
"common.noData": "No data yet",
"common.noDataCap": "No Data",
"common.viewTrades": "View Trades",
"common.save": "Save",
"common.cancel": "Cancel",
"common.skip": "Skip",
"common.insufficientData": "Not enough data yet",
"common.allCaps": "ALL",
"common.expectancy": "Expectancy",
"common.complete": "Complete",
"common.viewAffected": "View affected trades",
"common.noDim": "No data for this dimension yet.",
"common.highest": "Highest observed Net P&L",
"common.descriptive": "based on recorded trades, descriptive only.",
"status.local": "LOCAL MODE",
"dash.begin": "Begin Your Journey",
"dash.startsHere": "Your trading journey starts here.",
"dash.startsSub": "Every great track record begins with a single, disciplined trade.",
"dash.addFirst": "Add First Trade",
"dash.exploreDemo": "Explore Demo",
"dash.equity": "Current Equity",
"dash.capitalJourney": "Capital Journey",
"dash.openEvo": "Open Evolution →",
"dash.capital": "Capital",
"dash.discipline": "Discipline",
"dash.dan": "TradeMind Intelligence",
"dash.traderCard": "Trader Card",
"dash.netPerf": "Net Performance",
"dash.gm": "Good morning, ",
"dash.ga": "Good afternoon, ",
"dash.ge": "Good evening, ",
"dash.tradesLogged": "trades logged",
"evo.title": "Account Evolution",
"evo.subtitle": "Understand how your trading actually evolves.",
"evo.nothing": "Nothing to evolve yet.",
"evo.logTrades": "Log trades to see your account evolution over time.",
"evo.capitalEvolution": "Capital Evolution",
"evo.drivers": "Performance Drivers",
"evo.overview": "Overview",
"evo.pair": "Pair",
"evo.session": "Session",
"evo.hour": "Hour",
"evo.confluence": "Confluence",
"evo.setup": "Setup",
"evo.direction": "Direction",
"evo.outcome": "Outcome",
"evo.contribution": "Contribution",
"evo.day": "Day",
"evo.periods": "Periods",
"evo.matrix": "Matrix",
"evo.calendar": "Calendar",
"evo.quality": "Data Quality",
"evo.periodCmp": "Period Comparison",
"evo.accountJourney": "Account Journey",
"evo.perfCalendar": "Performance Calendar",
"evo.outcomeDist": "Trade Outcome Distribution",
"evo.perfContribution": "Performance Contribution",
"evo.weekly": "Weekly",
"evo.monthly": "Monthly",
"evo.yearly": "Yearly",
"dq.missingResult": "Missing Result",
"dq.missingRisk": "Missing Risk %",
"dq.missingSmc": "Missing SMC Score",
"dq.missingSession": "Missing Session",
"dq.missingSetup": "Missing Setup",
"dq.missingPsy": "Missing Psychology",
"dq.atLeastOne": "${tr('dq.atLeastOne')}",
"journal.history": "Trade History",
"journal.newTrade": "+ New Trade",
"journal.all": "All",
"journal.long": "Long",
"journal.short": "Short",
"form.newEntry": "New Entry",
"form.editing": "Editing",
"form.logTrade": "Log a Trade",
"form.editTrade": "Edit Trade",
"form.tagline": "Precision in, clarity out.",
"form.market": "Market",
"form.date": "Date",
"form.time": "Time",
"form.symbol": "Symbol",
"form.longU": "LONG",
"form.shortU": "SHORT",
"form.execRisk": "Execution & Risk",
"form.entry": "Entry",
"form.sl": "Stop Loss",
"form.tp": "Take Profit",
"form.lot": "Lot / Size",
"form.riskPct": "Risk % of Balance",
"form.result": "Result",
"form.pnlCur": "P&L (account currency)",
"form.riskAmt": "Risk Amount",
"form.smcConf": "SMC Confluence",
"form.smcScore": "SMC Score",
"form.psy": "Psychology",
"form.beforeTrade": "Before Trade",
"form.afterTrade": "After Trade",
"form.review": "Review",
"form.saveTrade": "Save Trade",
"form.searchPh": "Search symbol, setup, notes...",
"form.notesPh": "What did you see? What did you learn?",
"an.perfIntel": "Performance Intelligence",
"an.sub": "Read the story your trades are telling you.",
"an.nothing": "Nothing to analyze yet.",
"an.addTrades": "Add trades to unlock performance intelligence.",
"an.pnlSymbol": "P&L by Symbol",
"an.pnlSession": "P&L by Session",
"an.heatmap": "Heatmap",
"journey.title": "My Journey",
"journey.locked": "LOCKED",
"journey.unlocked": "UNLOCKED",
"journey.notYet": "Not yet",
"journey.achieved": "Achieved",
"journey.pending": "Pending",
"journey.weeks": "active week(s)",
"journey.m0": "First Trade",
"journey.m1": "10 Trades",
"journey.m2": "50 Trades",
"journey.m3": "100 Trades",
"journey.m4": "250 Trades",
"journey.m5": "500 Trades",
"journey.m6": "First Profitable Month",
"journey.m7": "+10R Cumulative",
"journey.m8": "New Equity High",
"journey.m9": "30-Day Consistency",
"settings.prefs": "Preferences",
"settings.account": "Account",
"settings.currency": "Currency",
"settings.appearance": "Appearance",
"settings.theme": "Theme",
"settings.day": "Day",
"settings.night": "Night",
"settings.auto": "Auto",
"settings.language": "Language",
"settings.plan": "Plan Guardian",
"settings.data": "Data",
"plan.maxRisk": "Max Risk / Trade (%)",
"plan.maxTrades": "Max Trades / Day",
"plan.maxDaily": "Max Daily Loss",
"plan.maxConsec": "Max Consecutive Losses",
"plan.minRR": "Minimum RR",
"plan.sessions": "Allowed Sessions (comma-separated)",
"plan.setups": "Allowed Setups (comma-separated)",
"plan.save": "Save Plan",
"data.loadDemo": "Load Demo Data",
"data.clearDemo": "Clear Demo Data Only",
"data.fresh": "Start Fresh (clear trades)",
"data.deleteAll": "Delete All Data",
"guardian.aligned": "PLAN ALIGNED",
"guardian.warning": "PLAN WARNING",
"guardian.breach": "PLAN BREACH",
"guardian.noPlan": "NO PLAN SET",
"cat.marketbehavior": "Market Behavior",
"cat.performance": "Performance",
"cat.discipline": "Discipline",
"cat.psychology": "Psychology",
"cat.patterns": "Patterns",
"tag.fact": "FACT",
"tag.observation": "OBSERVATION",
"tag.planreminder": "PLAN REMINDER",
"tag.review": "REVIEW",
"smc.htf": "HTF Bias aligned",
"smc.bos": "BOS",
"smc.choch": "CHOCH",
"smc.sweep": "Liquidity Sweep",
"smc.fvg": "FVG",
"smc.ote": "OTE",
"smc.session": "Session aligned",
"smc.news": "News checked",
"smc.clear": "Clear setup",
"smcg.marketstructure": "Market Structure",
"smcg.liquidity": "Liquidity",
"smcg.imbalance": "Imbalance",
"smcg.entry": "Entry",
"smcg.context": "Context",
"psy.calm": "Calm",
"psy.confident": "Confident",
"psy.fomo": "FOMO",
"psy.revenge": "Revenge",
"psy.impatient": "Impatient",
"psy.hesitant": "Hesitant",
"psy.overconfident": "Overconfident",
"psy.distracted": "Distracted",
"psy.followedplan": "Followed plan",
"psy.brokeplan": "Broke plan",
"psy.wouldtakeagain": "Would take again",
"psy.shouldhaveskipped": "Should have skipped",
"export.title": "Export Center",
"export.period": "Period",
"export.allTime": "All Time",
"export.thisWeek": "This Week",
"export.thisMonth": "This Month",
"export.thisYear": "This Year",
"export.custom": "Custom Period",
"export.excel": "Export Excel",
"export.word": "Export Word",
"export.from": "From",
"export.to": "To",
"export.generating": "Generating…",
"export.note": "Files are generated in the app language and contain only recorded trades from the selected period.",
"export.libMissing": "Export library could not be loaded (offline?). Reconnect once and retry.",
"export.done": "Export ready",
"export.failed": "Export failed",
"x.sTrades": "Trades",
"x.sOverview": "Performance Overview",
"x.sPairs": "Pairs",
"x.sSessions": "Sessions",
"x.sHours": "Hours",
"x.sScores": "SMC Scores",
"x.sSetups": "Setups",
"x.sPsy": "Psychology",
"x.sDaily": "Daily Performance",
"x.sWeekly": "Weekly Performance",
"x.sMonthly": "Monthly Performance",
"x.sRisk": "Risk & Drawdown",
"x.date": "Date",
"x.time": "Time",
"x.symbol": "Symbol",
"x.direction": "Direction",
"x.session": "Session",
"x.setup": "Setup",
"x.entry": "Entry",
"x.sl": "Stop Loss",
"x.tp": "Take Profit",
"x.lot": "Lot",
"x.riskPct": "Risk %",
"x.riskAmt": "Risk Amount",
"x.reward": "Planned Reward (risk × RR)",
"x.rr": "RR",
"x.pnl": "P&L",
"x.rMult": "R Multiple",
"x.smcScore": "SMC Score",
"x.smcCat": "SMC Category",
"x.psyBefore": "Psychology Before",
"x.psyAfter": "Psychology After",
"x.result": "Result",
"x.notes": "Notes",
"x.long": "Long",
"x.short": "Short",
"x.metric": "Metric",
"x.value": "Value",
"x.pnlPct": "P&L %",
"x.period": "Period",
"x.sample": "Sample",
"x.observed": "Observed journal data — not a psychological diagnosis.",
"x.demo": "DEMO DATA",
"x.noData": "No trading data available for this period.",
"x.balAfter": "Balance after trade",
"x.ddAt": "Drawdown at this point",
"x.guardian": "Guardian status",
"x.maxStreak": "Max consecutive losses",
"x.worstDay": "Worst daily net result",
"x.plan": "Plan Guardian settings",
"x.notSet": "not set",
"x.generated": "Generated",
"x.periodAnalysed": "Period analysed",
"x.trader": "Trader",
"x.report": "TRADING PERFORMANCE REPORT",
"x.wExec": "Executive Summary",
"x.wEvo": "Account Evolution",
"x.wOverview": "Performance Overview",
"x.wPair": "Pair Performance",
"x.wSession": "Session Performance",
"x.wHour": "Hour Performance",
"x.wScore": "SMC Score Performance",
"x.wSetup": "Setup Performance",
"x.wDirection": "Direction Performance",
"x.wPsy": "Psychology Observations",
"x.wRisk": "Risk & Drawdown",
"x.wDisc": "Discipline",
"x.wGuard": "Plan Guardian",
"x.wDan": "TradeMind Intelligence",
"x.wJourney": "Trading Journey",
"x.wTrades": "Trade Summary",
"x.discScore": "Discipline score",
"x.f_riskmanagement": "Risk Management",
"x.f_planadherence": "Plan Adherence",
"x.f_frequency": "Frequency",
"x.f_psychology": "Psychology",
"x.f_consistency": "Consistency",
"x.startBal": "Start balance",
"x.endBal": "End balance",
"x.limitedNote": "Limited sample: fewer than 5 trades — no strong conclusion should be drawn.",
"x.evoNote": "Balance and equity coincide: only closed trades are tracked.",
"x.cumR": "Cumulative R",
"x.noInsights": "No insight available for this period.",
"x.insightsNote": "Insight sentences are generated by local rules from the recorded trades (no external AI).",
"x.planNone": "No Plan Guardian rules are configured.",
"x.noGuardian": "n/a",
"x.no": "No."
};
/*EN:END*/
/*FR:START*/
I18N.fr={
"nav.dashboard": "Tableau de bord",
"nav.journal": "Journal",
"nav.evolution": "Évolution",
"nav.add": "Ajouter",
"nav.analytics": "Performance",
"nav.settings": "Réglages",
"nav.more": "Plus",
"common.trades": "Trades",
"common.tradesLower": "trades",
"common.winRate": "Taux de réussite",
"common.netPnl": "P&L net",
"common.totalR": "R total",
"common.avgR": "R moyen",
"common.profitFactor": "Facteur de profit",
"common.grossProfit": "Profit brut",
"common.grossLoss": "Perte brute",
"common.avgWin": "Gain moyen",
"common.avgLoss": "Perte moyenne",
"common.return": "Rendement %",
"common.drawdown": "Drawdown",
"common.maxDrawdown": "Drawdown max",
"common.startingBalance": "Solde initial",
"common.currentBalance": "Solde actuel",
"common.balance": "Solde",
"common.equity": "Équité",
"common.equityHigh": "Plus haut d’équité",
"common.totalTrades": "Total trades",
"common.wins": "Gains",
"common.losses": "Pertes",
"common.breakeven": "Équilibre",
"common.win": "Gain",
"common.loss": "Perte",
"common.limitedSample": "Échantillon limité",
"common.noData": "Aucune donnée pour l’instant",
"common.noDataCap": "Aucune donnée",
"common.viewTrades": "Voir les trades",
"common.save": "Enregistrer",
"common.cancel": "Annuler",
"common.skip": "Passer",
"common.insufficientData": "Pas assez de données",
"common.allCaps": "TOUT",
"common.expectancy": "Espérance",
"common.complete": "Complet",
"common.viewAffected": "Voir les trades concernés",
"common.noDim": "Aucune donnée pour cette dimension.",
"common.highest": "Net P&L observé le plus élevé",
"common.descriptive": "d’après les trades enregistrés, à titre descriptif uniquement.",
"status.local": "MODE LOCAL",
"dash.begin": "Commencez votre parcours",
"dash.startsHere": "Votre parcours de trading commence ici.",
"dash.startsSub": "Tout grand historique commence par un seul trade discipliné.",
"dash.addFirst": "Ajouter un premier trade",
"dash.exploreDemo": "Explorer la démo",
"dash.equity": "Équité actuelle",
"dash.capitalJourney": "Parcours du capital",
"dash.openEvo": "Ouvrir l’évolution →",
"dash.capital": "Capital",
"dash.discipline": "Discipline",
"dash.dan": "TradeMind Intelligence",
"dash.traderCard": "Carte de trader",
"dash.netPerf": "Performance nette",
"dash.gm": "Bonjour, ",
"dash.ga": "Bon après-midi, ",
"dash.ge": "Bonsoir, ",
"dash.tradesLogged": "trades enregistrés",
"evo.title": "Évolution du compte",
"evo.subtitle": "Comprenez comment votre trading évolue réellement.",
"evo.nothing": "Rien à afficher pour l’instant.",
"evo.logTrades": "Enregistrez des trades pour voir l’évolution de votre compte.",
"evo.capitalEvolution": "Évolution du capital",
"evo.drivers": "Moteurs de performance",
"evo.overview": "Vue d’ensemble",
"evo.pair": "Paire",
"evo.session": "Session",
"evo.hour": "Heure",
"evo.confluence": "Confluence",
"evo.setup": "Setup",
"evo.direction": "Direction",
"evo.outcome": "Résultat",
"evo.contribution": "Contribution",
"evo.day": "Jour",
"evo.periods": "Périodes",
"evo.matrix": "Matrice",
"evo.calendar": "Calendrier",
"evo.quality": "Qualité des données",
"evo.periodCmp": "Comparaison des périodes",
"evo.accountJourney": "Parcours du compte",
"evo.perfCalendar": "Calendrier de performance",
"evo.outcomeDist": "Répartition des résultats",
"evo.perfContribution": "Contribution à la performance",
"evo.weekly": "Hebdomadaire",
"evo.monthly": "Mensuel",
"evo.yearly": "Annuel",
"dq.missingResult": "Résultat manquant",
"dq.missingRisk": "Risque % manquant",
"dq.missingSmc": "Score SMC manquant",
"dq.missingSession": "Session manquante",
"dq.missingSetup": "Setup manquant",
"dq.missingPsy": "Psychologie manquante",
"dq.atLeastOne": "trade(s) ont au moins un champ manquant.",
"journal.history": "Historique des trades",
"journal.newTrade": "+ Nouveau trade",
"journal.all": "Tous",
"journal.long": "Long",
"journal.short": "Short",
"form.newEntry": "Nouvelle saisie",
"form.editing": "Modification",
"form.logTrade": "Enregistrer un trade",
"form.editTrade": "Modifier le trade",
"form.tagline": "Précision en entrée, clarté en sortie.",
"form.market": "Marché",
"form.date": "Date",
"form.time": "Heure",
"form.symbol": "Symbole",
"form.longU": "LONG",
"form.shortU": "SHORT",
"form.execRisk": "Exécution & risque",
"form.entry": "Entrée",
"form.sl": "Stop Loss",
"form.tp": "Take Profit",
"form.lot": "Lot / Taille",
"form.riskPct": "Risque % du solde",
"form.result": "Résultat",
"form.pnlCur": "P&L (devise du compte)",
"form.riskAmt": "Montant risqué",
"form.smcConf": "Confluence SMC",
"form.smcScore": "Score SMC",
"form.psy": "Psychologie",
"form.beforeTrade": "Avant le trade",
"form.afterTrade": "Après le trade",
"form.review": "Bilan",
"form.saveTrade": "Enregistrer le trade",
"form.searchPh": "Rechercher symbole, setup, notes...",
"form.notesPh": "Qu’avez-vous vu ? Qu’avez-vous appris ?",
"an.perfIntel": "Intelligence de performance",
"an.sub": "Lisez l’histoire que racontent vos trades.",
"an.nothing": "Rien à analyser pour l’instant.",
"an.addTrades": "Ajoutez des trades pour débloquer l’analyse.",
"an.pnlSymbol": "P&L par symbole",
"an.pnlSession": "P&L par session",
"an.heatmap": "Carte thermique",
"journey.title": "Mon parcours",
"journey.locked": "VERROUILLÉ",
"journey.unlocked": "DÉBLOQUÉ",
"journey.notYet": "Pas encore",
"journey.achieved": "Atteint",
"journey.pending": "En attente",
"journey.weeks": "semaine(s) active(s)",
"journey.m0": "Premier trade",
"journey.m1": "10 trades",
"journey.m2": "50 trades",
"journey.m3": "100 trades",
"journey.m4": "250 trades",
"journey.m5": "500 trades",
"journey.m6": "Premier mois profitable",
"journey.m7": "+10R cumulés",
"journey.m8": "Nouveau plus haut d’équité",
"journey.m9": "Régularité sur 30 jours",
"settings.prefs": "Préférences",
"settings.account": "Compte",
"settings.currency": "Devise",
"settings.appearance": "Apparence",
"settings.theme": "Thème",
"settings.day": "Jour",
"settings.night": "Nuit",
"settings.auto": "Auto",
"settings.language": "Langue",
"settings.plan": "Plan Guardian",
"settings.data": "Données",
"plan.maxRisk": "Risque max / trade (%)",
"plan.maxTrades": "Trades max / jour",
"plan.maxDaily": "Perte quotidienne max",
"plan.maxConsec": "Pertes consécutives max",
"plan.minRR": "RR minimum",
"plan.sessions": "Sessions autorisées (séparées par des virgules)",
"plan.setups": "Setups autorisés (séparés par des virgules)",
"plan.save": "Enregistrer le plan",
"data.loadDemo": "Charger les données de démo",
"data.clearDemo": "Effacer uniquement la démo",
"data.fresh": "Repartir de zéro (effacer les trades)",
"data.deleteAll": "Supprimer toutes les données",
"guardian.aligned": "PLAN CONFORME",
"guardian.warning": "PLAN ALERTE",
"guardian.breach": "PLAN VIOLÉ",
"guardian.noPlan": "AUCUN PLAN",
"cat.marketbehavior": "Comportement de marché",
"cat.performance": "Performance",
"cat.discipline": "Discipline",
"cat.psychology": "Psychologie",
"cat.patterns": "Schémas",
"tag.fact": "FAIT",
"tag.observation": "OBSERVATION",
"tag.planreminder": "RAPPEL DU PLAN",
"tag.review": "REVUE",
"smc.htf": "HTF Bias aligné",
"smc.bos": "BOS",
"smc.choch": "CHOCH",
"smc.sweep": "Balayage de liquidité",
"smc.fvg": "FVG",
"smc.ote": "OTE",
"smc.session": "Session alignée",
"smc.news": "News vérifiées",
"smc.clear": "Setup clair",
"smcg.marketstructure": "Structure de marché",
"smcg.liquidity": "Liquidité",
"smcg.imbalance": "Déséquilibre",
"smcg.entry": "Entrée",
"smcg.context": "Contexte",
"psy.calm": "Calme",
"psy.confident": "Confiant",
"psy.fomo": "FOMO",
"psy.revenge": "Revanche",
"psy.impatient": "Impatient",
"psy.hesitant": "Hésitant",
"psy.overconfident": "Trop confiant",
"psy.distracted": "Distrait",
"psy.followedplan": "A suivi le plan",
"psy.brokeplan": "A brisé le plan",
"psy.wouldtakeagain": "Le referait",
"psy.shouldhaveskipped": "Aurait dû s’abstenir",
"export.title": "Centre d’export",
"export.period": "Période",
"export.allTime": "Tout",
"export.thisWeek": "Cette semaine",
"export.thisMonth": "Ce mois",
"export.thisYear": "Cette année",
"export.custom": "Période personnalisée",
"export.excel": "Exporter en Excel",
"export.word": "Exporter en Word",
"export.from": "Du",
"export.to": "Au",
"export.generating": "Génération…",
"export.note": "Les fichiers sont générés dans la langue de l’application et ne contiennent que les trades enregistrés de la période choisie.",
"export.libMissing": "Impossible de charger la bibliothèque d’export (hors ligne ?). Reconnectez-vous une fois puis réessayez.",
"export.done": "Export prêt",
"export.failed": "Échec de l’export",
"x.sTrades": "Trades",
"x.sOverview": "Vue d’ensemble",
"x.sPairs": "Paires",
"x.sSessions": "Sessions",
"x.sHours": "Heures",
"x.sScores": "Scores SMC",
"x.sSetups": "Setups",
"x.sPsy": "Psychologie",
"x.sDaily": "Perf. journalière",
"x.sWeekly": "Perf. hebdomadaire",
"x.sMonthly": "Perf. mensuelle",
"x.sRisk": "Risque & Drawdown",
"x.date": "Date",
"x.time": "Heure",
"x.symbol": "Symbole",
"x.direction": "Direction",
"x.session": "Session",
"x.setup": "Setup",
"x.entry": "Entrée",
"x.sl": "Stop Loss",
"x.tp": "Take Profit",
"x.lot": "Lot",
"x.riskPct": "Risque %",
"x.riskAmt": "Montant risqué",
"x.reward": "Gain prévu (risque × RR)",
"x.rr": "RR",
"x.pnl": "P&L",
"x.rMult": "Multiple R",
"x.smcScore": "Score SMC",
"x.smcCat": "Catégorie SMC",
"x.psyBefore": "Psychologie avant",
"x.psyAfter": "Psychologie après",
"x.result": "Résultat",
"x.notes": "Notes",
"x.long": "Long",
"x.short": "Short",
"x.metric": "Indicateur",
"x.value": "Valeur",
"x.pnlPct": "P&L %",
"x.period": "Période",
"x.sample": "Échantillon",
"x.observed": "Données observées du journal — pas un diagnostic psychologique.",
"x.demo": "DONNÉES DE DÉMO",
"x.noData": "Aucune donnée de trading disponible pour cette période.",
"x.balAfter": "Solde après trade",
"x.ddAt": "Drawdown à ce stade",
"x.guardian": "Statut Guardian",
"x.maxStreak": "Pertes consécutives max",
"x.worstDay": "Pire résultat net journalier",
"x.plan": "Réglages Plan Guardian",
"x.notSet": "non défini",
"x.generated": "Généré le",
"x.periodAnalysed": "Période analysée",
"x.trader": "Trader",
"x.report": "RAPPORT DE PERFORMANCE DE TRADING",
"x.wExec": "Résumé exécutif",
"x.wEvo": "Évolution du compte",
"x.wOverview": "Vue d’ensemble de la performance",
"x.wPair": "Performance par paire",
"x.wSession": "Performance par session",
"x.wHour": "Performance par heure",
"x.wScore": "Performance par score SMC",
"x.wSetup": "Performance par setup",
"x.wDirection": "Performance par direction",
"x.wPsy": "Observations psychologiques",
"x.wRisk": "Risque & Drawdown",
"x.wDisc": "Discipline",
"x.wGuard": "Plan Guardian",
"x.wDan": "TradeMind Intelligence",
"x.wJourney": "Parcours de trading",
"x.wTrades": "Récapitulatif des trades",
"x.discScore": "Score de discipline",
"x.f_riskmanagement": "Gestion du risque",
"x.f_planadherence": "Respect du plan",
"x.f_frequency": "Fréquence",
"x.f_psychology": "Psychologie",
"x.f_consistency": "Régularité",
"x.startBal": "Solde début",
"x.endBal": "Solde fin",
"x.limitedNote": "Échantillon limité : moins de 5 trades — aucune conclusion forte ne doit être tirée.",
"x.evoNote": "Solde et équité coïncident : seuls les trades clôturés sont suivis.",
"x.cumR": "R cumulé",
"x.noInsights": "Aucune observation disponible pour cette période.",
"x.insightsNote": "Les observations sont générées par des règles locales à partir des trades enregistrés (aucune IA externe).",
"x.planNone": "Aucune règle Plan Guardian n’est configurée.",
"x.noGuardian": "n/d",
"x.no": "N°"
};
/*FR:END*/
let ST={settings:{startingBalance:10000,currency:'$',theme:'auto'},trades:[]};
let dir='buy';let charts={};let curveMode='equity';let editingFlow=false;
function load(){try{ST.settings=Object.assign(ST.settings,JSON.parse(localStorage.getItem('dtj_settings')||'{}'));ST.trades=JSON.parse(localStorage.getItem('dtj_trades')||'[]');}catch(e){}
if(!ST.settings.lang){const nav=(navigator.language||'en').toLowerCase();ST.settings.lang=nav.startsWith('fr')?'fr':'en';}}
function save(){localStorage.setItem('dtj_settings',JSON.stringify(ST.settings));localStorage.setItem('dtj_trades',JSON.stringify(ST.trades));_computedCache=null;}
function localYMD(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function fmt(n){let s=ST.settings.currency;let v=(n||0);return (v<0?'-':'')+s+Math.abs(v).toLocaleString(LOC(),{minimumFractionDigits:2,maximumFractionDigits:2});}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const SMC_ITEMS=[
{id:'htf',label:'HTF Bias aligned',w:10,g:'Market Structure'},{id:'bos',label:'BOS',w:10,g:'Market Structure'},{id:'choch',label:'CHOCH',w:10,g:'Market Structure'},
{id:'sweep',label:'Liquidity Sweep',w:15,g:'Liquidity'},{id:'fvg',label:'FVG',w:15,g:'Imbalance'},{id:'ote',label:'OTE',w:10,g:'Entry'},
{id:'session',label:'Session aligned',w:10,g:'Context'},{id:'news',label:'News checked',w:5,g:'Context'},{id:'clear',label:'Clear setup',w:15,g:'Context'}];
const PSY_BEFORE=['Calm','Confident','FOMO','Revenge','Impatient','Hesitant','Overconfident','Distracted'];
const PSY_AFTER=['Followed plan','Broke plan','Would take again','Should have skipped'];
function slug(s){return s.toLowerCase().replace(/[^a-z]/g,'');}
function buildChecklists(){
let groups={};SMC_ITEMS.forEach(i=>{(groups[i.g]=groups[i.g]||[]).push(i);});
document.getElementById('smcChecklist').innerHTML=Object.entries(groups).map(([g,items])=>`<div class="smcgroup"><div class="glabel">${tr('smcg.'+slug(g))}</div>${items.map(i=>`<div class="smcrow"><input type="checkbox" id="smc_${i.id}" onchange="calcPreview()"><label for="smc_${i.id}">${tr('smc.'+i.id)}</label><span class="w">+${i.w}</span></div>`).join('')}</div>`).join('');
document.getElementById('psyBefore').innerHTML=`<div class="glabel">${tr('form.beforeTrade')}</div><div class="flagrow">${PSY_BEFORE.map(l=>`<label><input type="checkbox" id="pb_${slug(l)}" onchange="calcPreview()"> ${tr('psy.'+slug(l))}</label>`).join('')}</div>`;
document.getElementById('psyAfter').innerHTML=`<div class="flagrow">${PSY_AFTER.map(l=>`<label><input type="checkbox" id="pa_${slug(l)}" onchange="calcPreview()"> ${tr('psy.'+slug(l))}</label>`).join('')}</div>`;
}
function readSMC(){const checks={};SMC_ITEMS.forEach(i=>checks[i.id]=!!document.getElementById('smc_'+i.id).checked);return checks;}
function calculateSMCScore(checks){return SMC_ITEMS.reduce((s,i)=>s+(checks[i.id]?i.w:0),0);}
function smcLabel(s){return s>=90?'A+ SETUP':s>=80?'1:3 SETUP':s>=70?'1:2 SETUP':s>=60?'1:1 SETUP':'NO TRADE';}
function readPsy(list,prefix){return list.filter(l=>{const el=document.getElementById(prefix+'_'+slug(l));return el&&el.checked;});}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.remove('hidden');requestAnimationFrame(()=>t.classList.add('show'));setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.classList.add('hidden'),300);},2200);}
function setThemeMode(m){ST.settings.theme=m;save();applyTheme();}
function applyTheme(){let t=ST.settings.theme;if(t==='auto'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'day';}
document.documentElement.setAttribute('data-theme',t);const ic=t==='night'?'sun':'moon';const html=svg(ic,1.5);
const b1=document.getElementById('themeBtnMob'),b2=document.getElementById('themeBtnDesk');if(b1)b1.innerHTML=html;if(b2)b2.innerHTML=html;try{document.dispatchEvent(new CustomEvent('tm:theme'));}catch(e){}}
function toggleThemeQuick(){const cur=document.documentElement.getAttribute('data-theme');ST.settings.theme=cur==='night'?'day':'night';save();applyTheme();}
document.getElementById('themeBtnMob').onclick=toggleThemeQuick;
document.getElementById('themeBtnDesk').onclick=toggleThemeQuick;
function applyGreeting(){const hr=new Date().getHours();document.getElementById('greetTxt').textContent=tr(hr<12?'dash.gm':hr<18?'dash.ga':'dash.ge');}
function applyStaticI18n(){document.documentElement.lang=(ST.settings&&ST.settings.lang)||'en';document.querySelectorAll('[data-tr]').forEach(el=>{el.textContent=tr(el.dataset.tr);});document.querySelectorAll('[data-trph]').forEach(el=>{el.placeholder=tr(el.dataset.trph);});applyGreeting();}
function relabelChecklists(){const smc=readSMC(),pb=readPsy(PSY_BEFORE,'pb'),pa=readPsy(PSY_AFTER,'pa');buildChecklists();SMC_ITEMS.forEach(i=>{document.getElementById('smc_'+i.id).checked=!!smc[i.id];});pb.forEach(l=>{document.getElementById('pb_'+slug(l)).checked=true;});pa.forEach(l=>{document.getElementById('pa_'+slug(l)).checked=true;});}

function go(v){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));document.getElementById('view-'+v).classList.add('active');
document.querySelectorAll('.bottomnav button,.sidebar .navlink').forEach(x=>x.classList.toggle('active',x.dataset.v===v));
if(v==='newtrade'&&!editingFlow){resetForm();}
if(v==='dashboard')renderDashboard();if(v==='journal')renderJournal();if(v==='analytics')renderAnalytics();if(v==='settings')fillSettings();if(v==='evolution')renderEvolution();
window.scrollTo(0,0);}
document.querySelectorAll('[data-v]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.v)));
document.querySelectorAll('#curveTabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#curveTabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');curveMode=b.dataset.c;renderDashboard();}));

let _computedCache=null;
function runAnalytics(trades,startBal){
let bal=startBal,high=bal,maxDD=0,cumR=0,curve=[{label:'Start',bal:bal,dd:0}];
let wins=0,losses=0,be=0,sumWin=0,sumLoss=0,sumR=0,rCount=0;
trades.forEach((t,i)=>{
let riskAmt=bal*((t.risk||0)/100);
let stopDist=Math.abs(t.entry-t.sl);let rewardDist=t.tp?Math.abs(t.tp-t.entry):0;
t._rr=stopDist>0?(rewardDist/stopDist):0;t._riskAmt=riskAmt;
t._r=riskAmt>0?(t.pnl/riskAmt):0;
bal+=(t.pnl||0);if(bal>high)high=bal;let dd=high-bal;if(dd>maxDD)maxDD=dd;
t._balAfter=bal;cumR+=(t._r||0);curve.push({label:t.date,bal:bal,pnl:t.pnl,dd:-dd,idx:i+1,symbol:t.symbol,direction:t.direction,r:t._r||0,cumR:cumR});
if(t.result==='win'){wins++;sumWin+=t.pnl;}else if(t.result==='loss'){losses++;sumLoss+=t.pnl;}else{be++;}
if(riskAmt>0){sumR+=t._r;rCount++;}
});
let total=trades.length;let winRate=total?Math.round(wins/total*1000)/10:0;
let profitFactor=sumLoss!==0?Math.abs(sumWin/sumLoss):(sumWin>0?Infinity:0);
let avgWin=wins?sumWin/wins:0,avgLoss=losses?sumLoss/losses:0;
let expectancy=total?((bal-startBal)/total):0;
let avgR=rCount?sumR/rCount:0;
let netPnl=bal-startBal;let ret=startBal?(netPnl/startBal*100):0;
let totalR=trades.reduce((s,t)=>s+(t._r||0),0);
return{trades,bal,high,maxDD,curve,wins,losses,be,total,winRate,profitFactor,avgWin,avgLoss,expectancy,avgR,netPnl,ret,totalR,startBal};
}
function computed(){
if(_computedCache)return _computedCache;
let trades=[...ST.trades].sort((a,b)=>new Date(a.date+'T'+(a.time||'00:00'))-new Date(b.date+'T'+(b.time||'00:00')));
_computedCache=runAnalytics(trades,ST.settings.startingBalance);
return _computedCache;
}
function rangeCutoff(rangeKey){
const now=new Date();
if(rangeKey==='7')return new Date(now-7*86400000);
if(rangeKey==='30')return new Date(now-30*86400000);
if(rangeKey==='90')return new Date(now-90*86400000);
if(rangeKey==='180')return new Date(now-180*86400000);
if(rangeKey==='365')return new Date(now-365*86400000);
if(rangeKey==='ytd')return new Date(now.getFullYear(),0,1);
return null;
}
function computeRange(rangeKey){
const all=[...ST.trades].sort((a,b)=>new Date(a.date+'T'+(a.time||'00:00'))-new Date(b.date+'T'+(b.time||'00:00')));
const cutoff=rangeCutoff(rangeKey);
if(!cutoff)return runAnalytics(all,ST.settings.startingBalance);
let baseBal=ST.settings.startingBalance;
const before=all.filter(t=>new Date(t.date+'T'+(t.time||'00:00'))<cutoff);
before.forEach(t=>baseBal+=(t.pnl||0));
const inRange=all.filter(t=>new Date(t.date+'T'+(t.time||'00:00'))>=cutoff);
return runAnalytics(inRange,baseBal);
}
function statHtml(label,val,cls){return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-val num ${cls||''}">${val}</div></div>`;}

function countUp(el,to,prefix){let from=0;const dur=700,start=performance.now();
function step(now){let p=Math.min(1,(now-start)/dur);let v=from+(to-from)*(1-Math.pow(1-p,3));el.textContent=prefix+v.toLocaleString(LOC(),{minimumFractionDigits:2,maximumFractionDigits:2});if(p<1)requestAnimationFrame(step);}
requestAnimationFrame(step);}

let evoRange='all';let evoCurves={balance:true,equity:true,drawdown:false};let evoTab='overview';
document.querySelectorAll('#evoTabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#evoTabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');evoTab=b.dataset.t;renderEvoTab(evoTab);}));
document.querySelectorAll('#evoRange button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#evoRange button').forEach(x=>x.classList.remove('on'));b.classList.add('on');evoRange=b.dataset.r;renderEvolution();}));
document.querySelectorAll('#evoCurveToggle button').forEach(b=>b.addEventListener('click',()=>{b.classList.toggle('on');evoCurves[b.dataset.c]=b.classList.contains('on');renderEvolution();}));
function renderEvolution(){
const full=computed();
document.getElementById('evoEmpty').classList.toggle('hidden',full.total>0);
document.getElementById('evoBody').classList.toggle('hidden',full.total===0);
if(full.total===0)return;
const c=computeRange(evoRange);
document.getElementById('evoStats').innerHTML=[
statHtml(tr('common.startingBalance'),fmt(c.startBal)),statHtml(tr('common.balance'),fmt(c.bal)),statHtml(tr('common.netPnl'),fmt(c.netPnl),c.netPnl>=0?'up':'down'),
statHtml(tr('common.return'),(c.ret>=0?'+':'')+c.ret.toFixed(2)+'%',c.ret>=0?'up':'down'),statHtml(tr('common.totalR'),(c.totalR>=0?'+':'')+c.totalR.toFixed(1)+'R',c.totalR>=0?'up':'down'),
statHtml(tr('common.winRate'),c.winRate+'%'),statHtml(tr('common.profitFactor'),isFinite(c.profitFactor)?c.profitFactor.toFixed(2):'∞'),statHtml(tr('common.avgR'),(c.avgR>=0?'+':'')+c.avgR.toFixed(2)+'R',c.avgR>=0?'up':'down'),
statHtml(tr('common.maxDrawdown'),fmt(c.maxDD),'down'),statHtml(tr('common.trades'),c.total)].join('');
const css=getComputedStyle(document.documentElement);
if(charts.evo)charts.evo.destroy();
const ds=[];
if(evoCurves.balance)ds.push({label:tr('common.balance'),data:c.curve.map(p=>p.bal),borderColor:css.getPropertyValue('--acc'),borderWidth:1.75,pointRadius:2,pointHoverRadius:5,pointBackgroundColor:css.getPropertyValue('--acc'),tension:.3});
if(evoCurves.equity)ds.push({label:tr('common.equity'),data:c.curve.map(p=>p.bal),borderColor:css.getPropertyValue('--ok'),borderWidth:1.25,borderDash:[3,3],pointRadius:0,tension:.3});
if(evoCurves.drawdown)ds.push({label:tr('common.drawdown'),data:c.curve.map(p=>p.dd),borderColor:css.getPropertyValue('--bad'),borderWidth:1.5,pointRadius:1.5,pointHoverRadius:4,pointBackgroundColor:css.getPropertyValue('--bad'),tension:.3});
charts.evo=new Chart(document.getElementById('evoChart'),{type:'line',data:{labels:c.curve.map(p=>p.label),datasets:ds},
options:{animation:{duration:700},plugins:{legend:{display:ds.length>1,position:'bottom',labels:{color:css.getPropertyValue('--txm'),font:{size:10},boxWidth:8}},
tooltip:{backgroundColor:css.getPropertyValue('--surf2'),titleColor:css.getPropertyValue('--tx'),bodyColor:css.getPropertyValue('--txm'),borderColor:css.getPropertyValue('--bd'),borderWidth:1,padding:10,
callbacks:{title:(items)=>{const p=c.curve[items[0].dataIndex];return p.symbol?p.symbol+' · '+(p.direction==='buy'?'Long':'Short'):'Account Start';},
label:(ctx)=>{const p=c.curve[ctx.dataIndex];const lines=[ctx.dataset.label+': '+(ctx.dataset.label===tr('common.drawdown')?fmt(-p.dd):fmt(p.bal))];
if(p.pnl!==undefined&&ctx.datasetIndex===0){lines.push('Trade P&L: '+fmt(p.pnl));lines.push('R: '+((p.r>=0?'+':'')+(p.r||0).toFixed(2))+'  ·  Cumulative R: '+((p.cumR>=0?'+':'')+(p.cumR||0).toFixed(1)));}
return lines;}}}},
scales:{x:{grid:{display:false},ticks:{color:css.getPropertyValue('--txm'),maxTicksLimit:6,font:{size:10}}},y:{grid:{color:css.getPropertyValue('--line')},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}}}}});
renderEvoTab(evoTab);
}
function periodTrades(trades,start,end){return trades.filter(t=>{const d=new Date(t.date+'T00:00');return d>=start&&d<end;});}
function periodSummary(trades){const n=trades.length;const wins=trades.filter(t=>t.result==='win').length;const pnl=trades.reduce((s,t)=>s+t.pnl,0);const r=trades.reduce((s,t)=>s+(t._r||0),0);return{n,wins,pnl,r,wr:n?Math.round(wins/n*100):0};}
function cmpBlock(title,curLabel,curTrades,prevLabel,prevTrades){
if(curTrades.length<1&&prevTrades.length<1)return '';
const cur=periodSummary(curTrades),prev=periodSummary(prevTrades);
if(prevTrades.length===0)return `<div class="cmpcard"><div class="cmptitle">${title}</div><div class="cmprow"><span>${curLabel}</span><span>${cur.n} ${tr('common.tradesLower')} · ${fmt(cur.pnl)} · ${(cur.r>=0?'+':'')+cur.r.toFixed(1)}R</span></div><div class="cmprow"><span>${prevLabel}</span><span>Not enough data</span></div></div>`;
const pnlDelta=cur.pnl-prev.pnl;
return `<div class="cmpcard"><div class="cmptitle">${title}</div>
<div class="cmprow"><span>${curLabel}</span><span>${cur.n} ${tr('common.tradesLower')} · ${fmt(cur.pnl)} · ${cur.wr}% WR · ${(cur.r>=0?'+':'')+cur.r.toFixed(1)}R</span></div>
<div class="cmprow"><span>${prevLabel}</span><span>${prev.n} ${tr('common.tradesLower')} · ${fmt(prev.pnl)} · ${prev.wr}% WR · ${(prev.r>=0?'+':'')+prev.r.toFixed(1)}R</span></div>
<div class="cmprow" style="border-bottom:none"><span>Change</span><span class="delta ${pnlDelta>=0?'up':'down'}">${(pnlDelta>=0?'+':'')+fmt(pnlDelta)}</span></div></div>`;
}
function renderEvoCompare(){
const trades=computed().trades;const now=new Date();
const startOfWeek=(d)=>{const x=new Date(d);const day=x.getDay();x.setDate(x.getDate()-day);x.setHours(0,0,0,0);return x;};
const thisWeekStart=startOfWeek(now);const lastWeekStart=new Date(thisWeekStart);lastWeekStart.setDate(lastWeekStart.getDate()-7);
const thisMonthStart=new Date(now.getFullYear(),now.getMonth(),1);const lastMonthStart=new Date(now.getFullYear(),now.getMonth()-1,1);
const thisYearStart=new Date(now.getFullYear(),0,1);const lastYearStart=new Date(now.getFullYear()-1,0,1);
let html='';
html+=cmpBlock('This Week vs Last Week','This Week',periodTrades(trades,thisWeekStart,new Date()),'Last Week',periodTrades(trades,lastWeekStart,thisWeekStart));
html+=cmpBlock('This Month vs Last Month','This Month',periodTrades(trades,thisMonthStart,new Date()),'Last Month',periodTrades(trades,lastMonthStart,thisMonthStart));
html+=cmpBlock('This Year vs Last Year','This Year',periodTrades(trades,thisYearStart,new Date()),'Last Year',periodTrades(trades,lastYearStart,thisYearStart));
document.getElementById('evoTabBody').innerHTML=`<div class="sechead" style="margin-top:0"><span class="idx">A</span><h2>${tr('evo.periodCmp')}</h2><span class="rule"></span></div><div class="cmpgrid">${html||'<div class="cmpcard"><p class="sub">Not enough data yet for a period comparison.</p></div>'}</div>`;
}
function renderEvoTab(tab){
if(tab==='overview')return renderEvoCompare();
if(['pair','session','score','setup','direction','day'].includes(tab))return renderDimTab(tab);
if(tab==='hour')return renderHourHeatmap();
if(tab==='periods')return renderPeriodsTab();
if(tab==='calendar')return renderCalendarTab();
if(tab==='quality')return renderDataQuality();
if(tab==='outcome')return renderOutcomeTab();
if(tab==='contribution')return renderContributionTab();
if(tab==='matrix')return renderMatrixTab();
}
function dimKeys(t,dim){
if(dim==='psychology'){const labels={fomo:'FOMO',revenge:'Revenge',calm:'Calm',confident:'Confident',impatient:'Impatient',hesitant:'Hesitant',overconfident:'Overconfident',distracted:'Distracted'};return(t.flags&&t.flags.length)?t.flags.map(f=>labels[f]||f):[];}
if(dim==='result')return[t.result==='win'?'Win':t.result==='loss'?'Loss':'Breakeven'];
const k=groupKey(t,dim);return k==null?[]:[k];
}
function crossStats(trades,dimA,dimB){
const g={};
trades.forEach(t=>{
const aKeys=dimKeys(t,dimA),bKeys=dimKeys(t,dimB);
aKeys.forEach(a=>bKeys.forEach(b=>{
const k=a+'|||'+b;if(!g[k])g[k]={n:0,wins:0,losses:0,pnl:0,r:0,grossProfit:0,grossLoss:0,a,b};
const e=g[k];e.n++;if(t.result==='win'){e.wins++;e.grossProfit+=t.pnl;}else if(t.result==='loss'){e.losses++;e.grossLoss+=t.pnl;}e.pnl+=t.pnl;e.r+=(t._r||0);
}));
});
return g;
}
function matchesFilter(t,filter){
if(!filter)return true;
return Object.entries(filter).every(([dim,val])=>dimKeys(t,dim).includes(val));
}
let journalFilter=null;
function setJournalFilterAndGo(dimA,valA,dimB,valB){closeModal();journalFilter={};journalFilter[dimA]=valA;if(dimB)journalFilter[dimB]=valB;go('journal');}
function clearJournalFilter(){journalFilter=null;renderJournal();}
function DIM_LABEL_(){return{pair:tr('evo.pair'),session:tr('evo.session'),hour:tr('evo.hour'),score:tr('evo.confluence'),setup:tr('evo.setup'),direction:tr('evo.direction'),day:tr('evo.day'),psychology:'Psychology',result:'Result'};}
const DIM_LABEL=new Proxy({},{get:(_,k)=>DIM_LABEL_()[k]});
function renderDimTab(dim){
const c=computed();const g=groupStats(c.trades,dim);
const entries=Object.entries(g).sort((a,b)=>b[1].pnl-a[1].pnl);
const startBal=ST.settings.startingBalance||1;
const rows=entries.length?entries.map(([label,e])=>{
const wr=e.n?Math.round(e.wins/e.n*100):0;const pf=pfOf(e);const pnlPct=(e.pnl/startBal*100);
return `<div class="statrow2"><div class="sr-label">${esc(label)}${e.n<5?'<span class="sr-flag">'+tr('common.limitedSample')+'</span>':''}</div>
<div class="sr-metrics"><span>${e.n} ${tr('common.tradesLower')}</span><span>${wr}% WR</span><span class="${e.pnl>=0?'up':'down'}">${fmt(e.pnl)} (${(pnlPct>=0?'+':'')+pnlPct.toFixed(1)}%)</span><span class="${e.r>=0?'up':'down'}">${(e.r>=0?'+':'')+e.r.toFixed(1)}R</span><span>PF ${isFinite(pf)?pf.toFixed(2):'∞'}</span></div></div>`;
}).join(''):'<p class="sub">'+tr('common.noDim')+'</p>';
const css=getComputedStyle(document.documentElement);
const labels=entries.map(e=>e[0]);
const showCharts=entries.length>=1;
document.getElementById('evoTabBody').innerHTML=`
<div class="sechead" style="margin-top:0"><span class="idx">B</span><h2>${DIM_LABEL[dim]} Performance</h2><span class="rule"></span></div>
${showCharts?`<div class="chartcard"><canvas id="dimChart1" height="140"></canvas></div>
<div class="chartcard" style="margin-top:12px"><canvas id="dimChart2" height="120"></canvas></div>`:''}
<div class="chartcard" style="margin-top:12px">${rows}</div>
${entries.length?`<p class="sub" style="margin-top:10px">${tr('common.highest')}: ${esc(entries[0][0])} (${fmt(entries[0][1].pnl)}) — ${tr('common.descriptive')}</p>`:''}`;
if(charts.dim1)charts.dim1.destroy();if(charts.dim2)charts.dim2.destroy();
if(!showCharts)return;
charts.dim1=new Chart(document.getElementById('dimChart1'),{type:'bar',data:{labels,datasets:[{label:'Net P&L',data:entries.map(e=>e[1].pnl),backgroundColor:entries.map(e=>e[1].pnl>=0?css.getPropertyValue('--ok'):css.getPropertyValue('--bad')),borderRadius:5,maxBarThickness:28}]},options:{animation:{duration:700},plugins:{legend:{display:false},title:{display:true,text:tr('common.netPnl'),color:css.getPropertyValue('--txm'),font:{size:10}}},scales:{x:{grid:{display:false},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}},y:{grid:{color:css.getPropertyValue('--line')},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}}}}});
charts.dim2=new Chart(document.getElementById('dimChart2'),{type:'bar',data:{labels,datasets:[{label:'Total R',data:entries.map(e=>e[1].r),backgroundColor:css.getPropertyValue('--acc'),borderRadius:5,maxBarThickness:28}]},options:{animation:{duration:700},plugins:{legend:{display:false},title:{display:true,text:tr('common.totalR'),color:css.getPropertyValue('--txm'),font:{size:10}}},scales:{x:{grid:{display:false},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}},y:{grid:{color:css.getPropertyValue('--line')},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}}}}});
}
function renderOutcomeTab(){
const c=computed();const grossProfit=c.avgWin*c.wins,grossLoss=c.avgLoss*c.losses;
const pct=(n)=>c.total?Math.round(n/c.total*100):0;
document.getElementById('evoTabBody').innerHTML=`<div class="sechead" style="margin-top:0"><span class="idx">F</span><h2>${tr('evo.outcomeDist')}</h2><span class="rule"></span></div>
<div class="statrow" style="margin-top:0">
${statHtml(tr('common.wins'),c.wins+' ('+pct(c.wins)+'%)','up')}${statHtml(tr('common.losses'),c.losses+' ('+pct(c.losses)+'%)','down')}${statHtml(tr('common.breakeven'),c.be+' ('+pct(c.be)+'%)')}${statHtml(tr('common.profitFactor'),isFinite(c.profitFactor)?c.profitFactor.toFixed(2):'∞')}
</div>
<div class="chartcard" style="margin-top:14px">
<div class="statrow2"><div class="sr-label">${tr('common.grossProfit')}</div><div class="sr-metrics"><span class="up">${fmt(grossProfit)}</span></div></div>
<div class="statrow2"><div class="sr-label">${tr('common.grossLoss')}</div><div class="sr-metrics"><span class="down">${fmt(grossLoss)}</span></div></div>
<div class="statrow2"><div class="sr-label">${tr('common.avgWin')}</div><div class="sr-metrics"><span class="up">${fmt(c.avgWin)}</span></div></div>
<div class="statrow2"><div class="sr-label">${tr('common.avgLoss')}</div><div class="sr-metrics"><span class="down">${fmt(c.avgLoss)}</span></div></div>
<div class="statrow2" style="border-bottom:none"><div class="sr-label">${tr('common.netPnl')}</div><div class="sr-metrics"><span class="${c.netPnl>=0?'up':'down'}">${fmt(c.netPnl)}</span></div></div>
</div>`;
}
function renderContributionTab(){
const c=computed();
if(c.total===0){document.getElementById('evoTabBody').innerHTML='<p class="sub">No data yet.</p>';return;}
const dims=['pair','session','hour','score','setup','direction'];
const canPct=c.netPnl!==0;
const blocks=dims.map(dim=>{
const g=groupStats(c.trades,dim);const entries=Object.entries(g).sort((a,b)=>Math.abs(b[1].pnl)-Math.abs(a[1].pnl)).slice(0,3);
if(!entries.length)return '';
const rows=entries.map(([label,e])=>{
const pctOfNet=canPct?(e.pnl/c.netPnl*100):null;
return `<div class="statrow2"><div class="sr-label">${esc(label)}${e.n<5?'<span class="sr-flag">'+tr('common.limitedSample')+'</span>':''}</div>
<div class="sr-metrics"><span>${e.n} ${tr('common.tradesLower')}</span><span class="${e.pnl>=0?'up':'down'}">${fmt(e.pnl)}</span><span class="${e.r>=0?'up':'down'}">${(e.r>=0?'+':'')+e.r.toFixed(1)}R</span>${pctOfNet!==null?`<span>${(pctOfNet>=0?'+':'')+pctOfNet.toFixed(0)}% of net P&L</span>`:''}</div></div>`;
}).join('');
return `<div class="chartcard" style="margin-top:12px"><div class="stat-label" style="margin-bottom:6px">${DIM_LABEL[dim]}</div>${rows}</div>`;
}).join('');
document.getElementById('evoTabBody').innerHTML=`<div class="sechead" style="margin-top:0"><span class="idx">G</span><h2>${tr('evo.perfContribution')}</h2><span class="rule"></span></div>
<p class="sub">Where net P&L actually came from — top contributors per dimension, based on recorded trades.${canPct?' Percentages can exceed 100% when some categories gain and others lose, offsetting each other.':' Net P&L is currently at or near zero, so contribution percentages are not shown.'}</p>
${blocks}`;
}
function sampleTag(n){return n===0?'—':n<5?'Limited sample':'';}
function cellColor(css,val,maxAbs){if(!val&&val!==0)return 'var(--surf2)';const alpha=Math.min(1,Math.abs(val)/(maxAbs||1));const base=val>=0?'--ok':'--bad';return `color-mix(in srgb, var(${base}) ${Math.round(alpha*65+8)}%, var(--surf2))`;}
function cellDetailHtml(dimA,dimB,e){
if(!e)return '<p class="sub">No trades in this cell.</p>';
const wr=e.n?Math.round(e.wins/e.n*100):0;const pf=pfOf(e);const startBal=ST.settings.startingBalance||1;const pnlPct=(e.pnl/startBal*100);
return `<div class="detrow"><span>Trades</span><span>${e.n}${e.n<5?' · Limited sample':''}</span></div>
<div class="detrow"><span>Win Rate</span><span>${wr}%</span></div>
<div class="detrow"><span>Net P&L</span><span>${fmt(e.pnl)} (${(pnlPct>=0?'+':'')+pnlPct.toFixed(1)}%)</span></div>
<div class="detrow"><span>Total R</span><span>${(e.r>=0?'+':'')+e.r.toFixed(1)}R</span></div>
<div class="detrow"><span>Average R</span><span>${(e.r/e.n>=0?'+':'')+(e.r/e.n).toFixed(2)}R</span></div>
<div class="detrow" style="border-bottom:none"><span>Profit Factor</span><span>${isFinite(pf)?pf.toFixed(2):'∞'}</span></div>
<div class="modalbtns"><button class="btn primary" onclick="setJournalFilterAndGo('${dimA}','${esc(e.a)}','${dimB}','${esc(e.b)}')">View Trades</button></div>`;
}
function openCellDetail(dimA,dimB,aVal,bVal){
const c=computed();const g=crossStats(c.trades,dimA,dimB);const e=g[aVal+'|||'+bVal];
document.getElementById('modalBody').innerHTML=`<h3>${esc(aVal)} × ${esc(bVal)}</h3>${cellDetailHtml(dimA,dimB,e)}`;
document.getElementById('modalOverlay').classList.remove('hidden');
}
function renderCrossGrid(dimA,dimB,rows,cols,note){
const c=computed();
if(c.total===0){return '<p class="sub">No data yet.</p>';}
const g=crossStats(c.trades,dimA,dimB);
const css=getComputedStyle(document.documentElement);
const maxAbs=Math.max(1,...Object.values(g).map(e=>Math.abs(e.pnl)));
let head='<tr><th></th>'+cols.map(cCol=>`<th>${esc(cCol)}</th>`).join('')+'</tr>';
let body=rows.map(r=>'<tr><th>'+esc(r)+'</th>'+cols.map(cCol=>{
const e=g[r+'|||'+cCol];
if(!e)return '<td class="mcell empty">—</td>';
return `<td class="mcell" style="background:${cellColor(css,e.pnl,maxAbs)}" onclick="openCellDetail('${dimA}','${dimB}','${esc(r)}','${esc(cCol)}')"><b>${fmt(e.pnl)}</b><span>${e.n}${e.n<5?'*':''}</span></td>`;
}).join('')+'</tr>').join('');
return `<div class="matrixwrap"><table class="matrixtable">${head}${body}</table></div>${note?`<p class="sub" style="margin-top:8px">${note}</p>`:''}<p class="sub">* Limited sample (under 5 trades). Tap a cell for detail and to view its trades.</p>`;
}
function renderHourHeatmap(){
const c=computed();
if(c.total===0){document.getElementById('evoTabBody').innerHTML='<p class="sub">No data yet.</p>';return;}
const SESSIONS=['London','New York','Asia','London/NY Overlap'];
const hoursPresent=[...new Set(c.trades.map(t=>groupKey(t,'hour')))].sort();
document.getElementById('evoTabBody').innerHTML=`<div class="sechead" style="margin-top:0"><span class="idx">H</span><h2>Hour × Session Heatmap</h2><span class="rule"></span></div>
${renderCrossGrid('session','hour',SESSIONS,hoursPresent,'Intensity reflects observed Net P&L. Tap a cell for Win Rate, Total R and Profit Factor.')}`;
}
const SCORE_BUCKETS=['0–59','60–69','70–79','80–89','90–100'];
function renderMatrixTab(){
const active=window._matrixSub||'sh';
document.getElementById('evoTabBody').innerHTML=`<div class="sechead" style="margin-top:0"><span class="idx">I</span><h2>Matrix Intelligence</h2><span class="rule"></span></div>
<div class="tabs" id="matrixSubTabs" style="overflow-x:auto;flex-wrap:nowrap;max-width:100%">
<button data-m="sh" class="${active==='sh'?'on':''}">Session×Hour</button><button data-m="ps" class="${active==='ps'?'on':''}">Pair×Session</button>
<button data-m="pc" class="${active==='pc'?'on':''}">Pair×Score</button><button data-m="stc" class="${active==='stc'?'on':''}">Setup×Score</button>
<button data-m="pr" class="${active==='pr'?'on':''}">Psychology×Result</button></div>
<div id="matrixGrid" style="margin-top:12px"></div>`;
document.querySelectorAll('#matrixSubTabs button').forEach(b=>b.addEventListener('click',()=>{window._matrixSub=b.dataset.m;renderMatrixTab();}));
const c=computed();
const pairs=[...new Set(c.trades.map(t=>t.symbol))];const setups=[...new Set(c.trades.map(t=>t.setup).filter(Boolean))];
const PSY=['Calm','Confident','FOMO','Revenge','Impatient','Hesitant','Overconfident','Distracted'].filter(l=>c.trades.some(t=>t.flags&&t.flags.includes(l.toLowerCase())));
let html='';
if(active==='sh')html=renderCrossGrid('session','hour',['London','New York','Asia','London/NY Overlap'],[...new Set(c.trades.map(t=>groupKey(t,'hour')))].sort());
if(active==='ps')html=renderCrossGrid('pair','session',pairs,['London','New York','Asia','London/NY Overlap']);
if(active==='pc')html=renderCrossGrid('pair','score',pairs,SCORE_BUCKETS);
if(active==='stc')html=renderCrossGrid('setup','score',setups,SCORE_BUCKETS);
if(active==='pr')html=renderCrossGrid('psychology','result',PSY,['Win','Loss','Breakeven'],'Observed journal data — not a psychological diagnosis.');
document.getElementById('matrixGrid').innerHTML=html;
}
function bucketPeriods(trades,unit){
const keyOf=(d)=>{if(unit==='day')return localYMD(d);if(unit==='year')return String(d.getFullYear());if(unit==='month')return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
const x=new Date(d);const day=x.getDay();x.setDate(x.getDate()-day);return localYMD(x);};
const groups={};trades.forEach(t=>{const k=keyOf(new Date(t.date+'T00:00'));(groups[k]=groups[k]||[]).push(t);});
const keys=Object.keys(groups).sort();let runningBal=ST.settings.startingBalance;const out=[];
keys.forEach(k=>{const bucketTrades=groups[k];const a=runAnalytics(bucketTrades,runningBal);out.push({key:k,...a,startBal:runningBal});runningBal=a.bal;});
return out;
}
function renderPeriodsTab(){
const c=computed();const unit=evoPeriodUnit||'month';
const buckets=bucketPeriods(c.trades,unit);
const css=getComputedStyle(document.documentElement);
const rows=buckets.length?buckets.slice().reverse().map(b=>`<div class="statrow2"><div class="sr-label">${b.key}${b.total<5?'<span class="sr-flag">'+tr('common.limitedSample')+'</span>':''}</div>
<div class="sr-metrics"><span>${b.total} ${tr('common.tradesLower')}</span><span>${b.winRate}% WR</span><span class="${b.netPnl>=0?'up':'down'}">${fmt(b.netPnl)}</span><span class="${b.totalR>=0?'up':'down'}">${(b.totalR>=0?'+':'')+b.totalR.toFixed(1)}R</span><span class="down">DD ${fmt(b.maxDD)}</span></div></div>`).join(''):'<p class="sub">No periods yet.</p>';
document.getElementById('evoTabBody').innerHTML=`<div class="sechead" style="margin-top:0"><span class="idx">C</span><h2>${tr('evo.accountJourney')}</h2><span class="rule"></span>
<div class="tabs" id="evoPeriodUnitTabs"><button data-u="week" class="${unit==='week'?'on':''}">${tr('evo.weekly')}</button><button data-u="month" class="${unit==='month'?'on':''}">${tr('evo.monthly')}</button><button data-u="year" class="${unit==='year'?'on':''}">${tr('evo.yearly')}</button></div></div>
<div class="chartcard"><canvas id="periodChart" height="140"></canvas></div>
<div class="chartcard" style="margin-top:12px">${rows}</div>`;
document.querySelectorAll('#evoPeriodUnitTabs button').forEach(b=>b.addEventListener('click',()=>{evoPeriodUnit=b.dataset.u;renderPeriodsTab();}));
if(charts.period)charts.period.destroy();
charts.period=new Chart(document.getElementById('periodChart'),{type:'bar',data:{labels:buckets.map(b=>b.key),datasets:[{label:'Net P&L',data:buckets.map(b=>b.netPnl),backgroundColor:buckets.map(b=>b.netPnl>=0?css.getPropertyValue('--ok'):css.getPropertyValue('--bad')),borderRadius:5,maxBarThickness:28}]},options:{animation:{duration:700},plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}},y:{grid:{color:css.getPropertyValue('--line')},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}}}}});
}
let evoPeriodUnit='month';let evoCalMonth=new Date();
function renderCalendarTab(){
const c=computed();const css=getComputedStyle(document.documentElement);
const byDay={};c.trades.forEach(t=>{if(!byDay[t.date])byDay[t.date]={pnl:0,r:0,n:0};byDay[t.date].pnl+=t.pnl;byDay[t.date].r+=(t._r||0);byDay[t.date].n++;});
const maxAbs=Math.max(1,...Object.values(byDay).map(v=>Math.abs(v.pnl)));
const y=evoCalMonth.getFullYear(),m=evoCalMonth.getMonth();
const first=new Date(y,m,1);const daysInMonth=new Date(y,m+1,0).getDate();const startDow=first.getDay();
let cells='';for(let i=0;i<startDow;i++)cells+='<div></div>';
for(let d=1;d<=daysInMonth;d++){const dateStr=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');const v=byDay[dateStr];
let bg='var(--surf2)';if(v){const alpha=Math.min(1,Math.abs(v.pnl)/maxAbs);bg=`color-mix(in srgb, var(${v.pnl>=0?'--ok':'--bad'}) ${Math.round(alpha*70+10)}%, var(--surf2))`;}
cells+=`<div class="calcell" style="background:${bg}" title="${dateStr} — ${v?v.n+' trade(s), '+fmt(v.pnl)+', '+(v.r>=0?'+':'')+v.r.toFixed(1)+'R':'No trades'}">${d}</div>`;}
document.getElementById('evoTabBody').innerHTML=`<div class="sechead" style="margin-top:0"><span class="idx">D</span><h2>${tr('evo.perfCalendar')}</h2><span class="rule"></span>
<div style="display:flex;gap:8px"><button class="iconbtn" id="calPrev">‹</button><button class="iconbtn" id="calNext">›</button></div></div>
<p class="sub" style="margin-top:-4px">${first.toLocaleString(LOC(),{month:'long',year:'numeric'})}</p>
<div class="chartcard"><div class="calgrid">${cells}</div></div>`;
document.getElementById('calPrev').onclick=()=>{evoCalMonth=new Date(y,m-1,1);renderCalendarTab();};
document.getElementById('calNext').onclick=()=>{evoCalMonth=new Date(y,m+1,1);renderCalendarTab();};
}
function renderDataQuality(){
const trades=ST.trades;const total=trades.length;
if(!total){document.getElementById('evoTabBody').innerHTML='<p class="sub">No trades yet.</p>';return;}
const missing={result:0,risk:0,smc:0,session:0,setup:0,psychology:0};
const incomplete=[];
trades.forEach(t=>{let bad=false;
if(!t.result){missing.result++;bad=true;} if(!t.risk){missing.risk++;bad=true;}
if(!t.smc||typeof t.smc.score!=='number'){missing.smc++;bad=true;} if(!t.session){missing.session++;bad=true;}
if(!t.setup){missing.setup++;bad=true;} if(!t.flags||!t.flags.length){missing.psychology++;bad=true;}
if(bad)incomplete.push(t);});
const pct=(((total*6-Object.values(missing).reduce((a,b)=>a+b,0))/(total*6))*100).toFixed(1);
document.getElementById('evoTabBody').innerHTML=`<div class="sechead" style="margin-top:0"><span class="idx">E</span><h2>${tr('evo.quality')}</h2><span class="rule"></span></div>
<div class="card" style="padding:18px"><div style="font-family:var(--fh);font-size:26px;font-weight:600">${pct}% <span style="font-size:11px;color:var(--txm);font-weight:600;text-transform:uppercase;letter-spacing:1px">${tr('common.complete')}</span></div>
<p class="sub" style="margin:6px 0 12px">${incomplete.length} ${tr('dq.atLeastOne')}</p>
<div class="statrow2"><div class="sr-label">${tr('dq.missingResult')}</div><div class="sr-metrics"><span>${missing.result}</span></div></div>
<div class="statrow2"><div class="sr-label">${tr('dq.missingRisk')}</div><div class="sr-metrics"><span>${missing.risk}</span></div></div>
<div class="statrow2"><div class="sr-label">${tr('dq.missingSmc')}</div><div class="sr-metrics"><span>${missing.smc}</span></div></div>
<div class="statrow2"><div class="sr-label">${tr('dq.missingSession')}</div><div class="sr-metrics"><span>${missing.session}</span></div></div>
<div class="statrow2"><div class="sr-label">${tr('dq.missingSetup')}</div><div class="sr-metrics"><span>${missing.setup}</span></div></div>
<div class="statrow2" style="border-bottom:none"><div class="sr-label">${tr('dq.missingPsy')}</div><div class="sr-metrics"><span>${missing.psychology}</span></div></div>
${incomplete.length?'<button class="btn sm" style="margin-top:14px" onclick="showIncomplete()">'+tr('common.viewAffected')+'</button>':''}</div>`;
window._incompleteTrades=incomplete;
}
function showIncomplete(){
const list=window._incompleteTrades||[];
document.getElementById('modalBody').innerHTML=`<h3>Incomplete Trades (${list.length})</h3>${list.map(t=>`<div class="detrow" style="cursor:pointer" onclick="closeModal();openDetail('${t.id}')"><span>${esc(t.symbol)} · ${t.date}</span><span>View →</span></div>`).join('')}`;
document.getElementById('modalOverlay').classList.remove('hidden');
}
function renderDashboard(){
const c=computed();
document.getElementById('dashEmpty').classList.toggle('hidden',c.total>0);
document.getElementById('dashBody').classList.toggle('hidden',c.total===0);
if(c.total===0)return;
countUp(document.getElementById('heroEq'),c.bal,ST.settings.currency);
const dEl=document.getElementById('heroDelta');dEl.textContent=(c.ret>=0?'+':'')+c.ret.toFixed(2)+'% · '+(c.netPnl>=0?'+':'')+fmt(c.netPnl).replace(ST.settings.currency,ST.settings.currency);
dEl.className='delta num '+(c.ret>=0?'up':'down');
document.getElementById('perfRow').innerHTML=[
statHtml(tr('dash.netPerf'),(c.ret>=0?'+':'')+c.ret.toFixed(2)+'%',c.ret>=0?'up':'down'),
statHtml(tr('common.profitFactor'),isFinite(c.profitFactor)?c.profitFactor.toFixed(2):'∞'),
statHtml(tr('common.winRate'),c.winRate+'%'),
statHtml(tr('common.avgR'),(c.avgR>=0?'+':'')+c.avgR.toFixed(2)+'R',c.avgR>=0?'up':'down')].join('');
document.getElementById('capGrid').innerHTML=[
statHtml(tr('common.startingBalance'),fmt(ST.settings.startingBalance)),
statHtml(tr('common.equityHigh'),fmt(c.high)),
statHtml(tr('common.maxDrawdown'),fmt(c.maxDD),'down'),
statHtml(tr('common.totalTrades'),c.total)].join('');
drawEquity(c.curve);
renderDiscCard(c);renderCoach(c);renderTraderCard(c);
}

function drawEquity(curve){
const ctx=document.getElementById('equityChart');
if(charts.eq)charts.eq.destroy();
const css=getComputedStyle(document.documentElement);
const data=curve.map(p=>curveMode==='drawdown'?p.dd:p.bal);
const color=curveMode==='drawdown'?css.getPropertyValue('--bad'):css.getPropertyValue('--acc');
charts.eq=new Chart(ctx,{type:'line',data:{labels:curve.map(p=>p.label),datasets:[{data,borderColor:color,borderWidth:1.75,backgroundColor:'transparent',fill:false,tension:.3,pointRadius:0,pointHoverRadius:4,pointHoverBackgroundColor:color}]},
options:{animation:{duration:900,easing:'easeOutQuart'},plugins:{legend:{display:false},tooltip:{backgroundColor:css.getPropertyValue('--surf2'),titleColor:css.getPropertyValue('--tx'),bodyColor:css.getPropertyValue('--txm'),borderColor:css.getPropertyValue('--bd'),borderWidth:1,padding:10,callbacks:{label:(ctx)=>{let p=curve[ctx.dataIndex];return curveMode==='drawdown'?'Drawdown: '+fmt(-p.dd):'Balance: '+fmt(p.bal)+(p.pnl!==undefined?' · P&L '+fmt(p.pnl):'');}}}},
scales:{x:{grid:{display:false},ticks:{color:css.getPropertyValue('--txm'),maxTicksLimit:5,font:{size:10}}},y:{grid:{color:css.getPropertyValue('--line')},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}}}}});
}

function renderJournal(){
const c=computed();const list=document.getElementById('journalList');
let q=(document.getElementById('jSearch').value||'').toLowerCase();let dirF=document.getElementById('jDir').value;
let items=[...c.trades].reverse().filter(t=>{
if(dirF!=='all'&&t.direction!==dirF)return false;
if(q&&!(t.symbol.toLowerCase().includes(q)||(t.setup||'').toLowerCase().includes(q)||(t.notes||'').toLowerCase().includes(q)))return false;
if(!matchesFilter(t,journalFilter))return false;
return true;});
const banner=journalFilter?`<div class="banner"><span>Filtered: ${Object.entries(journalFilter).map(([k,v])=>DIM_LABEL[k]+' = '+esc(v)).join(' × ')}</span><button class="iconbtn" onclick="clearJournalFilter()">✕</button></div>`:'';
if(c.total===0){list.innerHTML='<div class="empty"><div class="idx">01</div><div class="lbl">Empty Journal</div><h3>No trades yet.</h3><p>Your history will appear here.</p><div class="btns"><button class="btn primary" onclick="go(\'newtrade\')">Add First Trade</button></div></div>';return;}
if(items.length===0){list.innerHTML=banner+'<p class="sub">No trades match your filters.</p>';return;}
list.innerHTML=banner+items.map(t=>`<div class="jrow" onclick="openDetail('${t.id}')">
<span class="dot ${t.direction}"></span>
<div class="tinfo"><div class="tsym">${esc(t.symbol)} <span style="color:var(--txm);font-weight:600;font-size:10px">${t.direction==='buy'?'LONG':'SHORT'}</span></div><div class="tmeta">${t.date} · ${esc(t.session||'')}</div></div>
<div class="tright"><div class="tpnl ${t.pnl>=0?'up':'down'} num">${fmt(t.pnl)}</div><div class="tr num">${(t._r>=0?'+':'')+t._r.toFixed(2)}R</div></div></div>`).join('');
}

function openDetail(id){
const t=ST.trades.find(x=>x.id===id);if(!t)return;
document.getElementById('modalBody').innerHTML=`<h3>${esc(t.symbol)} · ${t.direction==='buy'?'LONG':'SHORT'}</h3>
<div class="detrow"><span>Date</span><span>${t.date} ${t.time||''}</span></div>
<div class="detrow"><span>Session</span><span>${esc(t.session||'-')}</span></div>
<div class="detrow"><span>Setup</span><span>${esc(t.setup||'-')}</span></div>
<div class="detrow"><span>Entry / SL / TP</span><span>${t.entry} / ${t.sl} / ${t.tp||'-'}</span></div>
<div class="detrow"><span>Lot</span><span>${t.lot||'-'}</span></div>
<div class="detrow"><span>Risk %</span><span>${t.risk}%</span></div>
<div class="detrow"><span>RR</span><span>${t._rr.toFixed(2)}</span></div>
<div class="detrow"><span>Result</span><span>${t.result}</span></div>
<div class="detrow"><span>P&L</span><span>${fmt(t.pnl)}</span></div>
<div class="detrow"><span>R Multiple</span><span>${t._r.toFixed(2)}R</span></div>
<div class="detrow"><span>Notes</span><span style="text-align:right;max-width:60%">${esc(t.notes||'-')}</span></div>
<div class="modalbtns"><button class="btn primary" onclick="editTrade('${t.id}')">Edit</button><button class="btn" onclick="dupTrade('${t.id}')">Duplicate</button><button class="btn danger" onclick="delTrade('${t.id}')">Delete</button></div>`;
document.getElementById('modalOverlay').classList.remove('hidden');
}
function closeModal(){document.getElementById('modalOverlay').classList.add('hidden');}
function delTrade(id){if(!confirm('Delete this trade? This cannot be undone.'))return;ST.trades=ST.trades.filter(t=>t.id!==id);save();closeModal();renderJournal();renderDashboard();toast('Trade deleted');}
function dupTrade(id){const t=ST.trades.find(x=>x.id===id);const n=Object.assign({},t,{id:uid(),date:localYMD(new Date())});ST.trades.push(n);save();closeModal();renderJournal();toast('Trade duplicated');}
function editTrade(id){const t=ST.trades.find(x=>x.id===id);closeModal();editingFlow=true;go('newtrade');editingFlow=false;document.getElementById('editId').value=id;document.getElementById('ntTitle').textContent=tr('form.editTrade');document.getElementById('ntEyebrow').textContent=tr('form.editing');
f_date.value=t.date;f_time.value=t.time||'';f_symbol.value=t.symbol;setDir(t.direction);f_session.value=t.session||'London';f_setup.value=t.setup||'';
f_entry.value=t.entry;f_sl.value=t.sl;f_tp.value=t.tp||'';f_lot.value=t.lot||'';f_risk.value=t.risk;f_result.value=t.result;f_pnl.value=t.pnl;f_notes.value=t.notes||'';
SMC_ITEMS.forEach(i=>{const el=document.getElementById('smc_'+i.id);if(el)el.checked=!!(t.smc&&t.smc.checks&&t.smc.checks[i.id]);});
PSY_BEFORE.forEach(l=>{const el=document.getElementById('pb_'+slug(l));if(el)el.checked=!!(t.flags&&t.flags.includes(slug(l)));});
PSY_AFTER.forEach(l=>{const el=document.getElementById('pa_'+slug(l));if(el)el.checked=!!(t.psyAfter&&t.psyAfter.includes(l));});
calcPreview();}

function setDir(d){dir=d;document.getElementById('dirBuy').classList.toggle('on',d==='buy');document.getElementById('dirSell').classList.toggle('on',d==='sell');}
function resetForm(){document.getElementById('tradeForm').reset();document.getElementById('editId').value='';document.getElementById('ntTitle').textContent=tr('form.logTrade');document.getElementById('ntEyebrow').textContent=tr('form.newEntry');setDir('buy');f_date.value=localYMD(new Date());f_risk.value=1;
document.getElementById('calcPreview').innerHTML='<div>'+tr('form.riskAmt')+'<span class="cv">—</span></div><div>RR<span class="cv">—</span></div><div>R-Multiple<span class="cv">—</span></div>';document.getElementById('guardStatus').innerHTML='';
document.getElementById('smcScoreVal').textContent='0 / 100';document.getElementById('smcScoreCat').textContent='NO TRADE';}
function calcPreview(){
const bal=computed().bal||ST.settings.startingBalance;
const entry=parseFloat(f_entry.value),sl=parseFloat(f_sl.value),tp=parseFloat(f_tp.value),risk=parseFloat(f_risk.value)||0,pnl=parseFloat(f_pnl.value);
if(isNaN(entry)||isNaN(sl)){return;}
const riskAmt=bal*(risk/100);const stopDist=Math.abs(entry-sl);const rewardDist=isNaN(tp)?0:Math.abs(tp-entry);
const rr=stopDist>0?(rewardDist/stopDist):0;const r=(riskAmt>0&&!isNaN(pnl))?(pnl/riskAmt):0;
document.getElementById('calcPreview').innerHTML=`<div>${tr('form.riskAmt')}<span class="cv">${fmt(riskAmt)}</span></div><div>RR<span class="cv">1:${rr.toFixed(2)}</span></div><div>R-Multiple<span class="cv">${r.toFixed(2)}R</span></div>`;
const smcChecks=readSMC();const smcScore=calculateSMCScore(smcChecks);
document.getElementById('smcScoreVal').textContent=smcScore+' / 100';
document.getElementById('smcScoreCat').textContent=smcLabel(smcScore);
renderGuardian();
}
function submitTrade(e){e.preventDefault();
const editId=document.getElementById('editId').value;
const t={id:editId||uid(),date:f_date.value,time:f_time.value,symbol:f_symbol.value.toUpperCase(),direction:dir,session:f_session.value,setup:f_setup.value,
entry:parseFloat(f_entry.value),sl:parseFloat(f_sl.value),tp:f_tp.value?parseFloat(f_tp.value):null,lot:f_lot.value?parseFloat(f_lot.value):null,
risk:parseFloat(f_risk.value)||0,result:f_result.value,pnl:parseFloat(f_pnl.value),notes:f_notes.value,
flags:readPsy(PSY_BEFORE,'pb').map(slug),psyAfter:readPsy(PSY_AFTER,'pa'),
smc:{checks:readSMC(),score:calculateSMCScore(readSMC())}};
if(editId){const i=ST.trades.findIndex(x=>x.id===editId);ST.trades[i]=t;}else{ST.trades.push(t);}
save();toast('Trade saved ✓');resetForm();go('journal');return false;}

function renderAnalytics(){
const c=computed();
document.getElementById('anEmpty').classList.toggle('hidden',c.total>0);
document.getElementById('anBody').classList.toggle('hidden',c.total===0);
if(c.total===0)return;
const css=getComputedStyle(document.documentElement);
if(charts.wl)charts.wl.destroy();
charts.wl=new Chart(document.getElementById('wlChart'),{type:'doughnut',data:{labels:['Wins','Losses','Breakeven'],datasets:[{data:[c.wins,c.losses,c.be],backgroundColor:[css.getPropertyValue('--ok'),css.getPropertyValue('--bad'),css.getPropertyValue('--warn')],borderWidth:0}]},options:{cutout:'72%',animation:{duration:800},plugins:{legend:{position:'bottom',labels:{color:css.getPropertyValue('--txm'),font:{size:11},boxWidth:8,padding:16}}}}});
const bySym={};c.trades.forEach(t=>{bySym[t.symbol]=(bySym[t.symbol]||0)+t.pnl;});
const symLabels=Object.keys(bySym);
if(charts.sym)charts.sym.destroy();
charts.sym=new Chart(document.getElementById('symChart'),{type:'bar',data:{labels:symLabels,datasets:[{data:symLabels.map(s=>bySym[s]),backgroundColor:symLabels.map(s=>bySym[s]>=0?css.getPropertyValue('--ok'):css.getPropertyValue('--bad')),borderRadius:5,maxBarThickness:28}]},options:{animation:{duration:800},plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}},y:{grid:{color:css.getPropertyValue('--line')},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}}}}});
const bySess={};c.trades.forEach(t=>{const s=t.session||'Other';bySess[s]=(bySess[s]||0)+t.pnl;});
const sessLabels=Object.keys(bySess);
if(charts.sess)charts.sess.destroy();
charts.sess=new Chart(document.getElementById('sessChart'),{type:'bar',data:{labels:sessLabels,datasets:[{data:sessLabels.map(s=>bySess[s]),backgroundColor:sessLabels.map(s=>bySess[s]>=0?css.getPropertyValue('--ok'):css.getPropertyValue('--bad')),borderRadius:5,maxBarThickness:28}]},options:{animation:{duration:800},plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}},y:{grid:{color:css.getPropertyValue('--line')},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}}}}});
renderHeatmap(c);renderJourney(c);
renderStatsHub(c);
}

let statsDim='pair';
function groupKey(t,dim){
switch(dim){
case 'pair':return t.symbol;
case 'hour':{const h=parseInt((t.time||'0:00').split(':')[0])||0;return String(h).padStart(2,'0')+':00–'+String((h+1)%24).padStart(2,'0')+':00';}
case 'session':return t.session||'Other';
case 'setup':return t.setup||'Other';
case 'score':{const s=t.smc?t.smc.score:null;if(s==null)return null;return s>=90?'90–100 · A+':s>=80?'80–89 · 1:3':s>=70?'70–79 · 1:2':s>=60?'60–69 · 1:1':'0–59 · No Trade';}
case 'direction':return t.direction==='buy'?'Long':'Short';
case 'day':return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date(t.date+'T00:00').getDay()];
}}
function groupStats(trades,dim){const g={};trades.forEach(t=>{dimKeys(t,dim).forEach(k=>{if(!g[k])g[k]={n:0,wins:0,losses:0,pnl:0,r:0,grossProfit:0,grossLoss:0};const e=g[k];e.n++;if(t.result==='win'){e.wins++;e.grossProfit+=t.pnl;}else if(t.result==='loss'){e.losses++;e.grossLoss+=t.pnl;}e.pnl+=t.pnl;e.r+=(t._r||0);});});return g;}
function pfOf(e){return e.grossLoss!==0?Math.abs(e.grossProfit/e.grossLoss):(e.grossProfit>0?Infinity:0);}
function renderStatsHub(c){
const g=groupStats(c.trades,statsDim);const entries=Object.entries(g).sort((a,b)=>b[1].pnl-a[1].pnl);
document.getElementById('statsHubBody').innerHTML=entries.length?entries.map(([label,v])=>{
const wr=(v.wins/v.n*100).toFixed(1);
return `<div class="statrow2"><div class="sr-label">${esc(label)}${v.n<5?'<span class="sr-flag">'+tr('common.limitedSample')+'</span>':''}</div>
<div class="sr-metrics"><span>${v.n} ${tr('common.tradesLower')}</span><span>${wr}% WR</span><span class="${v.pnl>=0?'up':'down'}">${fmt(v.pnl)}</span><span class="${v.r>=0?'up':'down'}">${(v.r>=0?'+':'')+v.r.toFixed(1)}R</span></div></div>`;
}).join(''):'<p class="sub">'+tr('common.noDim')+'</p>';
}
document.querySelectorAll('#statsTabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#statsTabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');statsDim=b.dataset.dim;renderStatsHub(computed());}));

function getPlan(){return ST.settings.plan||{};}
function listFrom(str){return str?str.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean):[];}
function fillPlanSettings(){const p=getPlan();p_maxrisk.value=p.maxRisk??'';p_maxtrades.value=p.maxTrades??'';p_maxdailyloss.value=p.maxDailyLoss??'';p_maxconsec.value=p.maxConsec??'';p_minrr.value=p.minRR??'';p_sessions.value=p.sessions||'';p_setups.value=p.setups||'';}
function savePlan(){ST.settings.plan={maxRisk:parseFloat(p_maxrisk.value)||null,maxTrades:parseInt(p_maxtrades.value)||null,maxDailyLoss:parseFloat(p_maxdailyloss.value)||null,maxConsec:parseInt(p_maxconsec.value)||null,minRR:parseFloat(p_minrr.value)||null,sessions:p_sessions.value.trim(),setups:p_setups.value.trim()};save();}

function checkCompliance(t,c,plan){
plan=plan||getPlan();let reasons=[];let status='aligned';
function flag(lvl,msg){reasons.push(msg);if(lvl==='breach')status='breach';else if(lvl==='warning'&&status!=='breach')status='warning';}
if(plan.maxRisk&&t.risk>plan.maxRisk)flag('breach',`Risk ${t.risk}% exceeds your planned maximum of ${plan.maxRisk}%.`);
const stopDist=Math.abs(t.entry-t.sl),rewardDist=t.tp?Math.abs(t.tp-t.entry):0,rr=stopDist>0?rewardDist/stopDist:0;
if(plan.minRR&&t.tp&&rr<plan.minRR)flag('warning',`RR 1:${rr.toFixed(2)} is below your minimum of 1:${plan.minRR}.`);
const sess=listFrom(plan.sessions);if(sess.length&&!sess.includes((t.session||'').toLowerCase()))flag('breach',`Session "${t.session}" is outside your allowed sessions.`);
const set=listFrom(plan.setups);if(set.length&&t.setup&&!set.includes(t.setup.toLowerCase()))flag('warning',`Setup "${t.setup}" is outside your defined setups.`);
const sameDay=(c.trades||[]).filter(x=>x.date===t.date&&x.id!==t.id);
if(plan.maxTrades&&sameDay.length+1>plan.maxTrades)flag('breach',`This would be trade #${sameDay.length+1} today — your plan allows ${plan.maxTrades}.`);
if(plan.maxDailyLoss){const netDay=sameDay.reduce((s,x)=>s+x.pnl,0)+t.pnl;if(netDay<0&&Math.abs(netDay)>plan.maxDailyLoss)flag('breach',`Daily loss ${fmt(netDay)} exceeds your limit of ${fmt(-plan.maxDailyLoss)}.`);}
if(plan.maxConsec){const past=[...(c.trades||[])].filter(x=>x.id!==t.id&&new Date(x.date)<=new Date(t.date)).sort((a,b)=>new Date(a.date)-new Date(b.date));let streak=0;for(let i=past.length-1;i>=0;i--){if(past[i].result==='loss')streak++;else break;}if(t.result==='loss'&&streak+1>=plan.maxConsec)flag('warning',`This would be your ${streak+1}th consecutive loss — your limit is ${plan.maxConsec}.`);}
return{status,reasons};
}
function renderGuardian(){
const box=document.getElementById('guardStatus');if(!box)return;
const plan=getPlan();
const entry=parseFloat(f_entry.value),sl=parseFloat(f_sl.value);
if(isNaN(entry)||isNaN(sl)){box.innerHTML='';return;}
const tp=parseFloat(f_tp.value),risk=parseFloat(f_risk.value)||0,pnl=parseFloat(f_pnl.value);
const t={entry,sl,tp:isNaN(tp)?null:tp,risk,pnl:isNaN(pnl)?0:pnl,result:f_result.value,session:f_session.value,setup:f_setup.value,date:f_date.value||localYMD(new Date()),id:document.getElementById('editId').value||'__new__'};
const c=computed();const smc=calculateSMCScore(readSMC());
const hasPlan=!!(plan.maxRisk||plan.maxTrades||plan.maxDailyLoss||plan.maxConsec||plan.minRR||plan.sessions||plan.setups);
let badge=`<span class="guardbadge" style="color:var(--txm)">${tr('guardian.noPlan')}</span>`;let reasonsHtml='';
if(hasPlan){const r=checkCompliance(t,c,plan);const key=r.status==='aligned'?'guardian.aligned':r.status==='warning'?'guardian.warning':'guardian.breach';badge=`<span class="guardbadge ${r.status}">${tr(key)}</span>`;reasonsHtml=r.reasons.length?'<div class="guardreasons">'+r.reasons.map(x=>'— '+x+'<br>').join('')+'</div>':'';}
box.innerHTML=`<div style="font-size:9.5px;letter-spacing:1px;color:var(--txm);text-transform:uppercase;margin-bottom:6px">Setup Quality — SMC ${smc}/100</div>${badge}${reasonsHtml}`;
}

function disciplineScore(c){
const plan=getPlan();const trades=c.trades||[];const total=trades.length;
if(!total)return{score:0,factors:{'Risk Management':0,'Plan Adherence':0,'Frequency':0,'Psychology':0,'Consistency':0}};
let riskScore;
if(plan.maxRisk){riskScore=Math.round(trades.filter(t=>t.risk<=plan.maxRisk).length/total*100);}
else{const avgRisk=trades.reduce((s,t)=>s+t.risk,0)/total;riskScore=Math.max(0,Math.round(100-Math.max(0,avgRisk-2)*20));}
let adherenceScore=100;
if(plan.maxRisk||plan.maxTrades||plan.maxDailyLoss||plan.maxConsec||plan.minRR||plan.sessions||plan.setups){let clean=0;trades.forEach(t=>{if(checkCompliance(t,c,plan).status!=='breach')clean++;});adherenceScore=Math.round(clean/total*100);}
let freqScore=100;
if(plan.maxTrades){const byDay={};trades.forEach(t=>byDay[t.date]=(byDay[t.date]||0)+1);const days=Object.values(byDay);freqScore=days.length?Math.round(days.filter(n=>n<=plan.maxTrades).length/days.length*100):100;}
const CONCERNING_FLAGS=['fomo','revenge','impatient','hesitant','overconfident','distracted'];
const flagged=trades.filter(t=>t.flags&&t.flags.some(f=>CONCERNING_FLAGS.includes(f))).length;const psyScore=Math.max(0,Math.round(100-(flagged/total*100)));
let maxStreak=0,streak=0;trades.forEach(t=>{if(t.result==='loss'){streak++;maxStreak=Math.max(maxStreak,streak);}else streak=0;});
const consistScore=Math.min(100,Math.max(0,Math.round(100-(maxStreak/(plan.maxConsec||5))*100)));
const score=Math.round((riskScore+adherenceScore+freqScore+psyScore+consistScore)/5);
return{score,factors:{'Risk Management':riskScore,'Plan Adherence':adherenceScore,'Frequency':freqScore,'Psychology':psyScore,'Consistency':consistScore}};
}
function gradeOf(s){return s>=90?'A+':s>=80?'A':s>=70?'B':s>=60?'C':'D';}
function renderDiscCard(c){
const d=disciplineScore(c);
document.getElementById('discCard').innerHTML=`<div class="discipline"><div class="ringwrap" style="--pct:${d.score}"><div class="inner"><b class="num">${d.score}</b><span>${gradeOf(d.score)}</span></div></div>
<div class="breakdown">${Object.entries(d.factors).map(([k,v])=>`<div class="brow"><span class="lbl">${tr('x.f_'+slug(k))}</span><div class="bar"><i style="width:${v}%"></i></div><span class="v num">${v}</span></div>`).join('')}</div></div>`;
}

function coachInsights(c){
const trades=c.trades||[];const plan=getPlan();let out=[];
if(trades.length<5)return[{tag:'OBSERVATION',cat:'Market Behavior',level:'ok',text:'Not enough data yet to surface meaningful patterns. Keep logging trades — insights unlock as your history grows.'}];
if(plan.maxTrades){const byDay={};trades.forEach(t=>byDay[t.date]=(byDay[t.date]||0)+1);const viol=Object.values(byDay).filter(n=>n>plan.maxTrades).length;if(viol>0)out.push({tag:'PLAN REMINDER',cat:'Discipline',level:'bad',text:`Overtrading: ${viol} day(s) exceeded your limit of ${plan.maxTrades} ${tr('common.tradesLower')}.`});}
if(trades.length>=8){const last5=trades.slice(-5),rest=trades.slice(0,-5);const avgLast=last5.reduce((s,t)=>s+t.risk,0)/5;const avgRest=rest.reduce((s,t)=>s+t.risk,0)/rest.length;if(avgLast>avgRest*1.25)out.push({tag:'OBSERVATION',cat:'Discipline',level:'warn',text:`Risk Creep: your last 5 trades average ${avgLast.toFixed(2)}% risk vs ${avgRest.toFixed(2)}% historically.`});}
let revengeCount=0;trades.forEach((t,i)=>{if(t.flags&&(t.flags.includes('fomo')||t.flags.includes('revenge'))&&i>0&&trades[i-1].result==='loss'&&t.date===trades[i-1].date)revengeCount++;});
if(revengeCount>=2)out.push({tag:'REVIEW',cat:'Patterns',level:'bad',text:`Revenge Pattern: ${revengeCount} flagged trades taken same-day right after a loss.`});
let maxStreak=0,streak=0,streakEnd=null;trades.forEach(t=>{if(t.result==='loss'){streak++;if(streak>maxStreak){maxStreak=streak;streakEnd=t.date;}}else streak=0;});
if(maxStreak>=3)out.push({tag:'FACT',cat:'Patterns',level:'warn',text:`Loss Clustering: a streak of ${maxStreak} consecutive losses ending ${streakEnd}.`});
const bySetup={};trades.forEach(t=>{if(t.setup)bySetup[t.setup]=(bySetup[t.setup]||0)+t.pnl;});
const setups=Object.entries(bySetup);if(setups.length>=2){setups.sort((a,b)=>b[1]-a[1]);out.push({tag:'FACT',cat:'Market Behavior',level:'ok',text:`Setup Performance: "${setups[0][0]}" leads at ${fmt(setups[0][1])}; "${setups[setups.length-1][0]}" trails at ${fmt(setups[setups.length-1][1])}.`});}
const bySess={};trades.forEach(t=>{const s=t.session||'Other';bySess[s]=(bySess[s]||0)+t.pnl;});
const sess=Object.entries(bySess);if(sess.length>=2){sess.sort((a,b)=>b[1]-a[1]);out.push({tag:'FACT',cat:'Market Behavior',level:'ok',text:`Session Performance: ${sess[0][0]} is your strongest session at ${fmt(sess[0][1])}.`});}
if(trades.length>=10){const half=Math.floor(trades.length/2);const d1=disciplineScore({trades:trades.slice(0,half)}).score,d2=disciplineScore({trades:trades.slice(half)}).score;if(d2>d1+5)out.push({tag:'OBSERVATION',cat:'Discipline',level:'ok',text:`Discipline Trend: improving — ${d1} → ${d2} across your history.`});else if(d2<d1-5)out.push({tag:'OBSERVATION',cat:'Discipline',level:'bad',text:`Discipline Trend: declining — ${d1} → ${d2} across your history.`});}
function flagStats(f){const s=trades.filter(t=>t.flags&&t.flags.includes(f));if(s.length<3)return null;const w=s.filter(t=>t.result==='win').length;const r=s.reduce((a,t)=>a+(t._r||0),0)/s.length;return{n:s.length,wr:Math.round(w/s.length*100),avgR:r};}
const fomo=flagStats('fomo'),calm=flagStats('calm');
if(fomo&&calm)out.push({tag:'FACT',cat:'Psychology',level:fomo.avgR<calm.avgR?'warn':'ok',text:`Psychology: FOMO trades (${fomo.n}) show ${fomo.wr}% win rate / ${fomo.avgR.toFixed(2)}R avg, vs Calm trades (${calm.n}) at ${calm.wr}% / ${calm.avgR.toFixed(2)}R avg.`});
else if(fomo)out.push({tag:'FACT',cat:'Psychology',level:fomo.avgR<0?'bad':'ok',text:`FOMO trades: ${fomo.n} taken, ${fomo.wr}% win rate, ${fomo.avgR.toFixed(2)}R average.`});
if(!out.length)out.push({tag:'OBSERVATION',cat:'Market Behavior',level:'ok',text:'No significant risk or discipline patterns detected in your recent trades.'});
return out;
}
function renderCoach(c){document.getElementById('coachList').innerHTML=coachInsights(c).map(i=>`<div class="coachitem"><span class="tag ${i.level}">${tr('cat.'+slug(i.cat||'')).toUpperCase()} · ${tr('tag.'+slug(i.tag))}</span><p>${esc(i.text)}</p></div>`).join('');}

function renderTraderCard(c){
const isDemo=c.trades.some(t=>t.isDemo);
const symbols=[...new Set(c.trades.map(t=>t.symbol))];
const bySetup={};c.trades.forEach(t=>{if(t.setup)bySetup[t.setup]=(bySetup[t.setup]||0)+1;});
const topSetup=Object.entries(bySetup).sort((a,b)=>b[1]-a[1])[0];
const d=disciplineScore(c);
const scored=c.trades.filter(t=>t.smc&&typeof t.smc.score==='number');
const avgSmc=scored.length?Math.round(scored.reduce((s,t)=>s+t.smc.score,0)/scored.length):null;
document.getElementById('traderCard').innerHTML=`<div class="tcard">${isDemo?'<span class="demotag">DEMO PROFILE</span>':''}
<div class="tcmono">T</div><h4>TRADEMIND</h4><div class="tcrole">${esc(topSetup?topSetup[0]:'Discretionary')} · ${esc(symbols.slice(0,3).join(', ')||'—')}</div>
<div class="tcgrid">
<div><span>${tr('common.totalTrades')}</span><b class="num">${c.total}</b></div>
<div><span>${tr('common.winRate')}</span><b class="num">${c.winRate}%</b></div>
<div><span>${tr('common.avgR')}</span><b class="num">${(c.avgR>=0?'+':'')+c.avgR.toFixed(2)}R</b></div>
<div><span>${tr('common.netPnl')}</span><b class="num">${fmt(c.netPnl)}</b></div>
<div><span>${tr('dash.discipline')}</span><b class="num">${d.score}</b></div>
<div><span>Avg SMC Score</span><b class="num">${avgSmc==null?'—':avgSmc}</b></div>
</div></div>
<div style="margin-top:12px"><button class="btn sm" onclick="shareCard()">Share / Copy Summary</button></div>`;
}
function shareCard(){const c=computed();const d=disciplineScore(c);const txt='TRADEMIND ACADEMY — Trader Card\\n'+'Trades: '+c.total+' · Win Rate: '+c.winRate+'% · Avg R: '+c.avgR.toFixed(2)+'R\\nNet P&L: '+fmt(c.netPnl)+' · Discipline: '+d.score+'/100';
if(navigator.clipboard){navigator.clipboard.writeText(txt).then(()=>toast('Copied to clipboard')).catch(()=>toast('Could not copy'));}else{toast('Clipboard unavailable');}}

let heatMetric='pnl';
function calcHeatmap(trades){const g={};trades.forEach(t=>{const day=new Date(t.date+'T00:00').getDay();const hour=parseInt((t.time||'0:00').split(':')[0])||0;const k=day+'_'+hour;if(!g[k])g[k]={pnl:0,r:0,n:0,wins:0};g[k].pnl+=t.pnl;g[k].r+=t._r||0;g[k].n++;if(t.result==='win')g[k].wins++;});return g;}
function renderHeatmap(c){
const g=calcHeatmap(c.trades);const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const vals=Object.values(g).map(v=>heatMetric==='pnl'?v.pnl:heatMetric==='r'?v.r:heatMetric==='wr'?(v.wins/v.n*100-50):v.n);
const max=Math.max(1,...vals.map(Math.abs));
let html='';for(let d=0;d<7;d++){html+=`<div class="hlabel">${days[d]}</div>`;for(let h=0;h<24;h++){const cell=g[d+'_'+h];let color='var(--surf2)';
if(cell){let val=heatMetric==='pnl'?cell.pnl:heatMetric==='r'?cell.r:heatMetric==='wr'?(cell.wins/cell.n*100-50):cell.n;
const alpha=Math.min(1,Math.abs(val)/max);const base=val>=0?'--ok':'--bad';
color=`color-mix(in srgb, var(${base}) ${Math.round(alpha*75+12)}%, var(--surf2))`;}
html+=`<div class="hcell" style="background:${color}" title="${days[d]} ${h}:00 — ${cell?cell.n+' trade(s), '+fmt(cell.pnl):'no trades'}"></div>`;}}
document.getElementById('heatGrid').innerHTML=html;}

function calcMilestones(c){
const trades=c.trades||[];const n=trades.length;
const byMonth={};trades.forEach(t=>{const m=t.date.slice(0,7);byMonth[m]=(byMonth[m]||0)+t.pnl;});
const profitableMonth=Object.values(byMonth).some(v=>v>0);
const totalR=trades.reduce((s,t)=>s+(t._r||0),0);
const weeks=new Set(trades.map(t=>{const d=new Date(t.date+'T00:00');const onejan=new Date(d.getFullYear(),0,1);return d.getFullYear()+'-'+Math.ceil((((d-onejan)/86400000)+onejan.getDay()+1)/7);}));
return[
{t:'First Trade',u:n>=1,s:n>=1?trades[0].date:tr('journey.notYet')},
{t:'10 Trades',u:n>=10,s:`${Math.min(n,10)}/10`},
{t:'50 Trades',u:n>=50,s:`${Math.min(n,50)}/50`},
{t:'100 Trades',u:n>=100,s:`${Math.min(n,100)}/100`},
{t:'250 Trades',u:n>=250,s:`${Math.min(n,250)}/250`},
{t:'500 Trades',u:n>=500,s:`${Math.min(n,500)}/500`},
{t:'First Profitable Month',u:profitableMonth,s:profitableMonth?tr('journey.achieved'):tr('journey.notYet')},
{t:'+10R Cumulative',u:totalR>=10,s:`${totalR.toFixed(1)}R / 10R`},
{t:'New Equity High',u:c.high>ST.settings.startingBalance,s:c.high>ST.settings.startingBalance?fmt(c.high):tr('journey.pending')},
{t:'30-Day Consistency',u:weeks.size>=4,s:`${weeks.size} ${tr('journey.weeks')}`}];
}
function renderJourney(c){document.getElementById('journeyList').innerHTML=calcMilestones(c).map((m,i)=>`<div class="mstone ${m.u?'unlocked':''}"><div class="mdot">${m.u?'✓':(i+1)}</div><div><div class="mtitle">${tr('journey.m'+i)}</div><div class="mstat">${tr(m.u?'journey.unlocked':'journey.locked')} · ${m.s}</div></div></div>`).join('');}

function fillSettings(){s_bal.value=ST.settings.startingBalance;s_cur.value=ST.settings.currency;s_theme.value=ST.settings.theme;s_lang.value=ST.settings.lang||'en';fillPlanSettings();}
function setLang(l){ST.settings.lang=l;save();applyStaticI18n();applyNavLabels();relabelChecklists();renderAll();renderEvolution();toast(tr('common.save'));}
function saveSettings(){ST.settings.startingBalance=parseFloat(s_bal.value)||0;ST.settings.currency=s_cur.value;save();toast('Settings saved ✓');renderAll();}
function startFresh(){if(!confirm('Clear all trades? Settings will be kept.'))return;ST.trades=[];save();renderAll();toast('Journal cleared');}
function deleteAll(){if(!confirm('Delete ALL data — trades and settings? This cannot be undone.'))return;localStorage.removeItem('dtj_trades');localStorage.removeItem('dtj_settings');ST={settings:{startingBalance:10000,currency:'$',theme:'auto'},trades:[]};save();renderAll();toast('All data deleted');}

function loadDemo(){
if(ST.trades.some(t=>!t.isDemo)&&!confirm('Loading demo data will replace your current trades — including any real trades you\'ve logged. This cannot be undone. Continue?'))return;
const symbols=['EURUSD','GBPUSD','XAUUSD','BTCUSD','US30'],sessions=['London','New York','Asia','London/NY Overlap'],setups=['Liquidity Sweep + FVG','BOS Retest','OTE Reversal','CHOCH Continuation'];
const PSY_POOL=['Impatient','Hesitant','Overconfident','Distracted'];
let d=new Date();ST.trades=[];
for(let i=39;i>=0;i--){
let dt=new Date(d);dt.setDate(dt.getDate()-i*0.85);
let dr=Math.random()>0.5?'buy':'sell';let entry=+(1+Math.random()*1.2).toFixed(4);let sl=+(entry-(dr==='buy'?1:-1)*0.004).toFixed(4);let tp=+(entry+(dr==='buy'?1:-1)*0.010).toFixed(4);
const quality=Math.random();const checks={};SMC_ITEMS.forEach(it=>checks[it.id]=Math.random()<quality);const smcScore=calculateSMCScore(checks);
let win=Math.random()<(0.25+quality*0.5);let risk=+(0.6+Math.random()*(quality<0.3?1.2:0.6)).toFixed(2);let riskAmt=10000*(risk/100);
let pnl=win?+(riskAmt*(1+Math.random()*2)).toFixed(2):-+(riskAmt*(0.6+Math.random()*0.5)).toFixed(2);
let before=[];if(quality<0.35&&!win&&Math.random()<0.4){before.push(Math.random()<0.5?'FOMO':'Revenge');}else{before.push(Math.random()<0.6?'Calm':'Confident');}
if(Math.random()<0.15)before.push(PSY_POOL[Math.floor(Math.random()*PSY_POOL.length)]);
let after=[quality>0.4?'Followed plan':(Math.random()<0.5?'Broke plan':'Followed plan')];
const hour=String((i*7+3)%24).padStart(2,'0'),min=String((i*17)%60).padStart(2,'0');
const sym=(i%13===0)?'US100':symbols[i%symbols.length];
ST.trades.push({id:uid(),date:localYMD(dt),time:hour+':'+min,symbol:sym,direction:dr,session:sessions[i%sessions.length],setup:setups[i%setups.length],
entry,sl,tp,lot:1,risk,result:win?'win':'loss',pnl,notes:'Demo trade — for exploring the app.',isDemo:true,flags:before.map(slug),psyAfter:after,smc:{checks,score:smcScore}});
}
ST.settings.startingBalance=10000;save();toast('Demo data loaded — clearly marked, use Clear Demo Data or Start Fresh to reset');renderAll();go('dashboard');
}
function clearDemoData(){const before=ST.trades.length;ST.trades=ST.trades.filter(t=>!t.isDemo);save();renderAll();toast(ST.trades.length<before?'Demo data cleared — your real trades were kept':'No demo data found');}

function renderAll(){renderDashboard();renderJournal();renderAnalytics();}

const cur=document.getElementById('cursor');
window.addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';cur.classList.add('on');});
document.addEventListener('mouseover',e=>{cur.classList.toggle('big',!!e.target.closest('button,a,input,select,.jrow,canvas'));});

load();applyStaticI18n();applyNavLabels();applyTheme();buildChecklists();resetForm();renderAll();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(ST.settings.theme==='auto')applyTheme();});
(function(){
const splash=document.getElementById('splash'),skip=document.getElementById('skipIntro');
function closeSplash(){splash.style.transition='opacity .4s';splash.style.opacity='0';setTimeout(()=>splash.remove(),400);}
skip.onclick=closeSplash;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const last=parseInt(localStorage.getItem('dtj_last_open')||'0',10);const now=Date.now();
localStorage.setItem('dtj_last_open',String(now));
if(reduced||(now-last<4*3600*1000)){setTimeout(closeSplash,reduced?150:350);return;}
const cv=document.getElementById('introCanvas'),ctx=cv.getContext('2d');
const W=cv.width,H=cv.height,n=16;let price=50;const candles=[];
for(let i=0;i<n;i++){const open=price;const close=open+(Math.random()-0.45)*10;const high=Math.max(open,close)+Math.random()*4;const low=Math.min(open,close)-Math.random()*4;candles.push({open,close,high,low});price=close;}
const minP=Math.min(...candles.map(c=>c.low)),maxP=Math.max(...candles.map(c=>c.high));
function y(v){return H-((v-minP)/(maxP-minP))*(H-10)-5;}
let i=0;
function drawNext(){
if(i>=candles.length){setTimeout(closeSplash,450);return;}
const cw=W/n,x=i*cw+cw*0.22,cwid=cw*0.56,c=candles[i],up=c.close>=c.open;
ctx.strokeStyle=up?'#3ddc94':'#f2665e';ctx.fillStyle=up?'#3ddc94':'#f2665e';
ctx.beginPath();ctx.moveTo(x+cwid/2,y(c.high));ctx.lineTo(x+cwid/2,y(c.low));ctx.stroke();
ctx.fillRect(x,Math.min(y(c.open),y(c.close)),cwid,Math.max(2,Math.abs(y(c.open)-y(c.close))));
i++;setTimeout(drawNext,50);
}
drawNext();
})();