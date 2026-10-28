import { TradingPlan, PlanCriterion, PlanExecutionSnapshot, CriterionEvaluation } from '../types/plans.js';

export const STRATEGY_TEMPLATES: { id: string; name: { fr: string; en: string }; description: { fr: string; en: string }; criteria: Omit<PlanCriterion, 'id'>[] }[] = [
  {
    id: 'blank',
    name: { fr: 'Plan Vierge', en: 'Blank Plan' },
    description: { fr: 'Créez votre propre stratégie de zéro avec vos règles et critères sur mesure.', en: 'Build your custom strategy from scratch with your unique rules and criteria.' },
    criteria: []
  },
  {
    id: 'sr',
    name: { fr: 'Support & Résistance', en: 'Support & Resistance' },
    description: { fr: 'Niveaux clés horizontaux, retest de zone, confirmation de volume et rejet propre.', en: 'Horizontal key levels, zone retest, volume confirmation and clean price rejection.' },
    criteria: [
      {
        name: 'Zone clé HTF identifiée',
        category: 'Structure',
        description: 'Support ou résistance tracé sur timeframe supérieur (H4 / Daily).',
        status: 'mandatory',
        type: 'qualitative',
        weight: 25,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Retest / Réaction confirmée',
        category: 'Trigger',
        description: 'Rejet visible (mèche, pin bar ou bougie de rejet) sur le niveau.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 30,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Ratio Risque / Récompense >= 2.0',
        category: 'Risque',
        description: 'Le trade offre au minimum 2x le risque initial.',
        status: 'mandatory',
        type: 'quantitative',
        numericField: 'rr',
        numericThreshold: 2.0,
        numericOperator: '>=',
        weight: 25,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Volume de confirmation',
        category: 'Volume',
        description: 'Augmentation de volume sur l impulsion.',
        status: 'optional',
        type: 'qualitative',
        weight: 20,
        includeInScore: true,
        violationBehavior: 'warning'
      }
    ]
  },
  {
    id: 'indicators',
    name: { fr: 'Stratégie Indicateurs', en: 'Indicator Strategy' },
    description: { fr: 'Confluence de moyennes mobiles, RSI en zone extrême ou divergence, et signal MACD.', en: 'Moving average crossovers, RSI extreme or divergence, and MACD signal confirmation.' },
    criteria: [
      {
        name: 'Tendance EMA 20/50 alignée',
        category: 'Tendance',
        description: 'Le croisement et la pente des EMA confirment la direction.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 30,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'RSI non sur-acheté / non sur-vendu à contre-sens',
        category: 'Momentum',
        description: 'RSI en accord ou divergence identifiée.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 30,
        includeInScore: true,
        violationBehavior: 'warning'
      },
      {
        name: 'Signal de déclenchement MACD',
        category: 'Trigger',
        description: 'Croisement de la ligne de signal ou histogramme haussier/baissier.',
        status: 'optional',
        type: 'qualitative',
        weight: 20,
        includeInScore: true,
        violationBehavior: 'warning'
      },
      {
        name: 'Risque respecté <= 1.0%',
        category: 'Risque',
        description: 'Le risque engagé ne dépasse pas 1% du capital.',
        status: 'mandatory',
        type: 'quantitative',
        numericField: 'risk',
        numericThreshold: 1.0,
        numericOperator: '<=',
        weight: 20,
        includeInScore: true,
        violationBehavior: 'breach'
      }
    ]
  },
  {
    id: 'smc',
    name: { fr: 'Smart Money Concepts (SMC)', en: 'Smart Money Concepts (SMC)' },
    description: { fr: 'Biais HTF, prise de liquidité, cassure de structure BOS/CHOCH et Fair Value Gap.', en: 'HTF bias, liquidity sweep, market structure break (BOS/CHOCH) and Fair Value Gap imbalance.' },
    criteria: [
      {
        name: 'Biais HTF aligné',
        category: 'Structure',
        description: 'Direction alignée avec la structure du timeframe supérieur.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 20,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Prise de liquidité (Sweep)',
        category: 'Liquidité',
        description: 'Balayage préalable des plus hauts ou plus bas récents (liquidity pool).',
        status: 'mandatory',
        type: 'qualitative',
        weight: 25,
        includeInScore: true,
        violationBehavior: 'warning'
      },
      {
        name: 'BOS / CHOCH confirmé',
        category: 'Structure',
        description: 'Cassure de structure avec clôture franche de corps de bougie.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 25,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Zone FVG / Inbalance tapée',
        category: 'Entrée',
        description: 'Entrée dans un Fair Value Gap non comblé.',
        status: 'optional',
        type: 'qualitative',
        weight: 15,
        includeInScore: true,
        violationBehavior: 'warning'
      },
      {
        name: 'Entrée OTE (Optimal Trade Entry 61.8 - 79%)',
        category: 'Entrée',
        description: 'Repli dans la zone de retracement optimal de Fibonacci.',
        status: 'optional',
        type: 'qualitative',
        weight: 15,
        includeInScore: true,
        violationBehavior: 'info'
      }
    ]
  },
  {
    id: 'price_action',
    name: { fr: 'Price Action & Chandelier', en: 'Price Action & Candlesticks' },
    description: { fr: 'Comportement brut du prix, rejets de chandeliers japonais et dynamique de marché.', en: 'Pure raw price action, pin bar / engulfing rejections and natural market flow.' },
    criteria: [
      {
        name: 'Configuration de chandelier clé',
        category: 'Pattern',
        description: 'Pin bar, avalement ou étoile du matin/soir avec rejet net.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 35,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Contexte de tendance favorable',
        category: 'Contexte',
        description: 'Plus hauts de plus en plus hauts ou plus bas de plus en plus bas.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 35,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Ratio Risque / Récompense >= 1.5',
        category: 'Risque',
        description: 'RR minimum de 1.5 validé.',
        status: 'mandatory',
        type: 'quantitative',
        numericField: 'rr',
        numericThreshold: 1.5,
        numericOperator: '>=',
        weight: 30,
        includeInScore: true,
        violationBehavior: 'warning'
      }
    ]
  },
  {
    id: 'trend',
    name: { fr: 'Suivi de Tendance & MAs', en: 'Trend Following & MAs' },
    description: { fr: 'Navigation dans le sens de la tendance dominante avec repli sur support dynamique.', en: 'Riding the dominant major trend with pullbacks to moving average bands.' },
    criteria: [
      {
        name: 'Position au-dessus / en-dessous de la 200 EMA',
        category: 'Filtre Majeur',
        description: 'Achat uniquement au-dessus de 200 EMA, Vente uniquement en-dessous.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 40,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Pullback sur zone 20 / 50 EMA',
        category: 'Entrée',
        description: 'Le prix revient tester la bande des moyennes rapides.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 35,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Session active (Londres / New York)',
        category: 'Session',
        description: 'Prise de position pendant les heures de forte liquidité.',
        status: 'optional',
        type: 'qualitative',
        weight: 25,
        includeInScore: true,
        violationBehavior: 'warning'
      }
    ]
  },
  {
    id: 'breakout',
    name: { fr: 'Breakout & Retest', en: 'Breakout & Retest' },
    description: { fr: 'Cassure franche de range horizontal ou compression, suivie d un retest ordonné.', en: 'Decisive breakout of horizontal range or consolidation followed by orderly retest.' },
    criteria: [
      {
        name: 'Cassure franche du range avec clôture externe',
        category: 'Breakout',
        description: 'Bougie pleine clôturant nettement en dehors des limites du range.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 40,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Retest réussi de l ancienne borne',
        category: 'Retest',
        description: 'L ancien support devient résistance ou ancienne résistance devient support.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 35,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Invalidation nette et stop-loss défini',
        category: 'Risque',
        description: 'Stop-loss placé de l autre côté du niveau cassé.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 25,
        includeInScore: true,
        violationBehavior: 'breach'
      }
    ]
  },
  {
    id: 'fundamentals',
    name: { fr: 'Fondamentaux & Macro', en: 'Fundamentals & Macro' },
    description: { fr: 'Catalyseurs macroéconomiques, banques centrales et alignement fondamental.', en: 'Macro catalysts, central bank sentiment and fundamental policy alignment.' },
    criteria: [
      {
        name: 'Catalyseur macro aligné (taux, inflation, PIB)',
        category: 'Macro',
        description: 'Biais fondamental haussier/baissier soutenu par les publications récentes.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 40,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Aucune annonce critique imminente (< 30 min)',
        category: 'Sécurité News',
        description: 'Pas d entrée juste avant NFP, CPI ou décision FOMC non digérée.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 35,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Alignement technique H4 / Daily',
        category: 'Technique',
        description: 'Le graphique valide le biais fondamental.',
        status: 'optional',
        type: 'qualitative',
        weight: 25,
        includeInScore: true,
        violationBehavior: 'warning'
      }
    ]
  },
  {
    id: 'scalping',
    name: { fr: 'Scalping Dynamique', en: 'Dynamic Scalping' },
    description: { fr: 'Entrées rapides en M1 / M5 sur impulsion de liquidité avec risque strictement borné.', en: 'Fast M1/M5 entries on liquidity impulse with strictly bounded risk.' },
    criteria: [
      {
        name: 'Session de haute volatilité (Open Londres / NY)',
        category: 'Timing',
        description: 'Trade pris durant les 2 premières heures d ouverture de session.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 30,
        includeInScore: true,
        violationBehavior: 'warning'
      },
      {
        name: 'Risque par trade <= 0.5%',
        category: 'Risque',
        description: 'Risque scalping strictement limité à 0.5% max.',
        status: 'mandatory',
        type: 'quantitative',
        numericField: 'risk',
        numericThreshold: 0.5,
        numericOperator: '<=',
        weight: 35,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Réaction immédiate attendue sans hésitation',
        category: 'Exécution',
        description: 'Prise de profit rapide ou coupure sans espoir.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 35,
        includeInScore: true,
        violationBehavior: 'breach'
      }
    ]
  },
  {
    id: 'swing',
    name: { fr: 'Swing Trading', en: 'Swing Trading' },
    description: { fr: 'Positionnement sur plusieurs jours basé sur structure Daily et flux institutionnel.', en: 'Multi-day horizon based on Daily market structure and institutional flow.' },
    criteria: [
      {
        name: 'Structure Daily haussière / baissière claire',
        category: 'Structure',
        description: 'Tendance nette sur le graphique journalier.',
        status: 'mandatory',
        type: 'qualitative',
        weight: 35,
        includeInScore: true,
        violationBehavior: 'breach'
      },
      {
        name: 'Objectif de gain (RR) >= 3.0',
        category: 'Risque',
        description: 'Le setup vise au moins 3 fois le risque initial.',
        status: 'mandatory',
        type: 'quantitative',
        numericField: 'rr',
        numericThreshold: 3.0,
        numericOperator: '>=',
        weight: 35,
        includeInScore: true,
        violationBehavior: 'warning'
      },
      {
        name: 'Swap & frais de nuit acceptables',
        category: 'Coûts',
        description: 'Prise en compte des frais de financement nocturne.',
        status: 'optional',
        type: 'qualitative',
        weight: 30,
        includeInScore: true,
        violationBehavior: 'info'
      }
    ]
  }
];

export function createPlanFromTemplate(templateId: string, customName?: string): TradingPlan {
  const template = STRATEGY_TEMPLATES.find(t => t.id === templateId) || STRATEGY_TEMPLATES[0];
  const now = new Date().toISOString();
  
  return {
    id: 'plan_' + Math.random().toString(36).slice(2, 10),
    name: customName || template.name.fr,
    strategyTemplate: templateId,
    description: template.description.fr,
    version: 1,
    isActive: true,
    scoringEnabled: true,
    minScoreToExecute: 70,
    criteria: template.criteria.map((c, i) => ({
      ...c,
      id: 'crit_' + i + '_' + Math.random().toString(36).slice(2, 8)
    })),
    guardian: {
      maxRiskPerTrade: 1.0,
      maxDailyLoss: 3.0,
      maxTradesPerDay: 4,
      minRR: 1.5,
      maxConsecutiveLosses: 3
    },
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Evaluate plan criteria and Guardian rules against trade inputs and user confirmations.
 * Subjective criteria are validated ONLY by the user.
 * Quantitative criteria are computed objectively.
 */
export function evaluatePlanExecution(
  plan: TradingPlan,
  userResponses: Record<string, boolean>,
  tradeContext: { rr?: number; risk?: number; pnl?: number; dailyLossPct?: number; todayTradesCount?: number; consecutiveLosses?: number }
): PlanExecutionSnapshot {
  const violations: string[] = [];
  const evalCriteria: CriterionEvaluation[] = [];

  let totalWeightInScore = 0;
  let earnedScoreWeight = 0;

  for (const criterion of plan.criteria) {
    let isValid = false;
    let isViolated = false;
    let reason = '';

    if (criterion.type === 'qualitative') {
      // Manual subjective user validation
      isValid = Boolean(userResponses[criterion.id]);
      if (!isValid && criterion.status === 'mandatory') {
        isViolated = true;
        reason = `Critère obligatoire non validé : ${criterion.name}`;
      }
    } else if (criterion.type === 'quantitative') {
      // Quantitative objective check
      const field = criterion.numericField;
      const threshold = criterion.numericThreshold ?? 0;
      const op = criterion.numericOperator || '>=';
      let value = 0;

      if (field === 'rr') value = tradeContext.rr || 0;
      else if (field === 'risk') value = tradeContext.risk || 0;
      else if (field === 'pnl') value = tradeContext.pnl || 0;

      if (op === '>=') isValid = value >= threshold;
      else if (op === '<=') isValid = value <= threshold;
      else if (op === '>') isValid = value > threshold;

      if (!isValid) {
        isViolated = true;
        reason = `${criterion.name} (${String(field || '').toUpperCase()} actuel : ${value}, requis ${op} ${threshold})`;
      }
    }

    if (isViolated) {
      violations.push(reason);
    }

    if (criterion.includeInScore && plan.scoringEnabled) {
      totalWeightInScore += criterion.weight;
      if (isValid) {
        earnedScoreWeight += criterion.weight;
      }
    }

    evalCriteria.push({
      criterionId: criterion.id,
      name: criterion.name,
      category: criterion.category,
      weight: criterion.weight,
      includeInScore: criterion.includeInScore,
      status: criterion.status,
      type: criterion.type,
      validated: isValid,
      violated: isViolated,
      violationReason: reason || undefined,
      violationBehavior: criterion.violationBehavior
    });
  }

  // Guardian checks
  const g = plan.guardian;
  if (tradeContext.risk && tradeContext.risk > g.maxRiskPerTrade) {
    violations.push(`Guardian : Risque par trade (${tradeContext.risk}%) dépasse la limite (${g.maxRiskPerTrade}%)`);
  }
  if (tradeContext.dailyLossPct && tradeContext.dailyLossPct >= g.maxDailyLoss) {
    violations.push(`Guardian : Perte journalière (${tradeContext.dailyLossPct.toFixed(1)}%) a atteint le seuil maximal (${g.maxDailyLoss}%)`);
  }
  if (tradeContext.todayTradesCount && tradeContext.todayTradesCount >= g.maxTradesPerDay) {
    violations.push(`Guardian : Nombre maximal de trades par jour atteint (${tradeContext.todayTradesCount}/${g.maxTradesPerDay})`);
  }
  if (tradeContext.rr && tradeContext.rr < g.minRR) {
    violations.push(`Guardian : Ratio Risque/Récompense (${tradeContext.rr}) inférieur au minimum requis (${g.minRR})`);
  }
  if (tradeContext.consecutiveLosses && tradeContext.consecutiveLosses >= g.maxConsecutiveLosses) {
    violations.push(`Guardian : Série de pertes consécutives atteinte (${tradeContext.consecutiveLosses}/${g.maxConsecutiveLosses})`);
  }

  const score = plan.scoringEnabled && totalWeightInScore > 0
    ? Math.round((earnedScoreWeight / totalWeightInScore) * 100)
    : null;

  // Guardian status
  let guardianStatus: 'aligned' | 'warning' | 'breach' = 'aligned';
  const hasBreach = violations.some(v => v.includes('Guardian : Risque') || v.includes('Perte journalière') || v.includes('obligatoire'));
  if (hasBreach) {
    guardianStatus = 'breach';
  } else if (violations.length > 0) {
    guardianStatus = 'warning';
  }

  return {
    planId: plan.id,
    planName: plan.name,
    planVersion: plan.version,
    scoringEnabled: plan.scoringEnabled,
    score,
    maxPossibleScore: 100,
    criteria: evalCriteria,
    violations,
    guardianStatus,
    guardianRules: { ...plan.guardian }
  };
}
