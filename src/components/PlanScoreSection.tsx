import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext.js';
import { TradingPlan, PlanCriterion } from '../types/plans.js';
import {
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Sliders,
  Copy,
  Edit3,
  Plus,
  Save,
  RotateCcw,
  Info,
  Check
} from 'lucide-react';

interface PlanScoreSectionProps {
  onOpenPlanBuilder?: () => void;
  onOpenNewPlan?: () => void;
}

export const PlanScoreSection: React.FC<PlanScoreSectionProps> = ({
  onOpenPlanBuilder,
  onOpenNewPlan
}) => {
  const { plans, activePlan, savePlan, setActivePlanId, settings } = useTrading();
  const isFr = settings.lang === 'fr';

  const plan: TradingPlan | null = activePlan || plans[0] || null;

  // Local interactive criteria test state (for simulation and live recalculation)
  const [checkedCriteriaIds, setCheckedCriteriaIds] = useState<Record<string, boolean>>({});
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [tempPlanName, setTempPlanName] = useState(plan?.name || '');
  const [tempMaxRisk, setTempMaxRisk] = useState(plan?.guardian?.maxRiskPerTrade ?? 1);
  const [tempMinRR, setTempMinRR] = useState(plan?.guardian?.minRR ?? 2);
  const [tempDailyLoss, setTempDailyLoss] = useState(plan?.guardian?.maxDailyLoss ?? 3);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Initialize or reset checked criteria with all criteria checked by default
  const criteriaList = useMemo(() => plan?.criteria || [], [plan]);

  // Sync default checked state
  useMemo(() => {
    if (plan && Object.keys(checkedCriteriaIds).length === 0 && plan.criteria.length > 0) {
      const initial: Record<string, boolean> = {};
      plan.criteria.forEach((c, idx) => {
        // default 80% to realistic compliance
        initial[c.id] = idx !== 1;
      });
      setCheckedCriteriaIds(initial);
    }
  }, [plan]);

  // Compute live score from actual plan criteria
  const { score, totalPossibleWeight, earnedWeight, qualityGrade, gradeColor } = useMemo(() => {
    if (!plan || criteriaList.length === 0) {
      return { score: 0, totalPossibleWeight: 0, earnedWeight: 0, qualityGrade: 'N/A', gradeColor: 'text-zinc-500' };
    }

    const scoredCriteria = criteriaList.filter(c => c.includeInScore);
    if (scoredCriteria.length === 0) {
      return {
        score: 100,
        totalPossibleWeight: 100,
        earnedWeight: 100,
        qualityGrade: isFr ? 'Informatif (Sans poids)' : 'Informational (No weight)',
        gradeColor: 'text-cyan-400'
      };
    }

    const totalWeight = scoredCriteria.reduce((sum, c) => sum + (c.weight || 0), 0) || 100;
    let earned = 0;

    scoredCriteria.forEach(c => {
      const isChecked = checkedCriteriaIds[c.id] ?? false;
      if (isChecked) {
        earned += (c.weight || 0);
      }
    });

    const calculatedScore = Math.min(100, Math.round((earned / totalWeight) * 100));

    let grade = 'Grade B (Acceptable)';
    let color = 'text-amber-400';

    if (calculatedScore >= 90) {
      grade = isFr ? 'Grade A+ (Discipline Optimale)' : 'Grade A+ (Optimal Discipline)';
      color = 'text-emerald-400';
    } else if (calculatedScore >= 75) {
      grade = isFr ? 'Grade A (Solide)' : 'Grade A (Solid)';
      color = 'text-teal-400';
    } else if (calculatedScore >= 50) {
      grade = isFr ? 'Grade B (Attention requise)' : 'Grade B (Attention needed)';
      color = 'text-amber-400';
    } else {
      grade = isFr ? 'Non Qualifié (Violations)' : 'Unqualified (Plan breaches)';
      color = 'text-rose-400';
    }

    return {
      score: calculatedScore,
      totalPossibleWeight: totalWeight,
      earnedWeight: earned,
      qualityGrade: grade,
      gradeColor: color
    };
  }, [plan, criteriaList, checkedCriteriaIds, isFr]);

  const toggleCriterion = (critId: string) => {
    setCheckedCriteriaIds(prev => ({
      ...prev,
      [critId]: !prev[critId]
    }));
  };

  const handleDuplicate = () => {
    if (!plan) return;
    const duplicated: TradingPlan = {
      ...plan,
      id: 'plan_' + Math.random().toString(36).slice(2, 9),
      name: `${plan.name} (${isFr ? 'Copie' : 'Copy'})`,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    savePlan(duplicated);
    setActivePlanId(duplicated.id);
  };

  const handleSaveEdits = () => {
    if (!plan) return;
    const updated: TradingPlan = {
      ...plan,
      name: tempPlanName.trim() || plan.name,
      guardian: {
        ...plan.guardian,
        maxRiskPerTrade: Number(tempMaxRisk),
        minRR: Number(tempMinRR),
        maxDailyLoss: Number(tempDailyLoss)
      },
      updatedAt: new Date().toISOString()
    };
    savePlan(updated);
    setIsEditingRules(false);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  if (!plan) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] text-center space-y-4">
        <Sliders className="w-10 h-10 mx-auto text-[var(--accent)] opacity-60" />
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          {isFr ? 'Aucun plan de trading configuré' : 'No trading plan configured'}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
          {isFr
            ? 'Pour obtenir un score précis de discipline et de gestion du risque, créez votre première stratégie personnalisée.'
            : 'To get a precise discipline and risk management score, create your first customized strategy.'}
        </p>
        {onOpenNewPlan && (
          <button
            onClick={onOpenNewPlan}
            type="button"
            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold"
          >
            {isFr ? 'Créer un Plan' : 'Create Plan'}
          </button>
        )}
      </div>
    );
  }

  // Circular gauge calculations
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* SECTION A: EN-TÊTE DU PLAN */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                {plan.isActive ? (isFr ? 'PLAN ACTIF' : 'ACTIVE PLAN') : (isFr ? 'STRATÉGIE' : 'STRATEGY')}
              </span>
              <span className="text-xs font-mono text-[var(--text-secondary)]">
                {isFr ? 'Marchés :' : 'Markets:'} <strong className="text-[var(--text-primary)]">{isFr ? 'Forex / Indices / Crypto / Matières 1ères' : 'Forex / Indices / Crypto / Commodities'}</strong>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">
              {plan.name}
            </h3>

            <p className="text-xs text-[var(--text-secondary)]">
              {plan.description || (isFr ? 'Stratégie de trading disciplinée avec gestion rigide du risque.' : 'Disciplined trading strategy with strict risk controls.')}
            </p>

            <div className="text-[11px] font-mono text-[var(--text-secondary)] pt-1 flex items-center gap-3">
              <span>{isFr ? 'Créé :' : 'Created:'} {new Date(plan.createdAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US')}</span>
              <span>·</span>
              <span>{isFr ? 'Mis à jour :' : 'Updated:'} {new Date(plan.updatedAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US')}</span>
            </div>
          </div>

          {/* Action Buttons in Header */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenPlanBuilder && (
              <button
                onClick={onOpenPlanBuilder}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isFr ? 'Modifier le Plan' : 'Edit Plan'}</span>
              </button>
            )}

            <button
              onClick={handleDuplicate}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isFr ? 'Dupliquer' : 'Duplicate'}</span>
            </button>

            {onOpenNewPlan && (
              <button
                onClick={onOpenNewPlan}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isFr ? 'Nouveau Plan' : 'New Plan'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION B: SCORE GLOBAL DU PLAN */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Circular Gauge */}
          <div className="relative flex-shrink-0 w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
              {/* Background track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-white/10"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress arc */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={`${score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'} transition-all duration-700 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-mono font-bold text-[var(--text-primary)]">
                {score}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                / 100 PTS
              </span>
            </div>
          </div>

          {/* Explanation and Grade */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Award className={`w-5 h-5 ${gradeColor}`} />
              <span className={`text-base font-bold font-display ${gradeColor}`}>
                {qualityGrade}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              {isFr ? 'Indice de Rigueur et Robustesse du Processus' : 'Discipline & Robustness Process Index'}
            </h4>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {isFr
                ? 'Ce score est calculé directement à partir des critères actifs de votre plan. Il mesure l exhaustivité de vos confirmations préalables, la complétude de votre check-list et votre fidélité au processus établi avant chaque entrée en position.'
                : 'This score is dynamically computed from your active plan criteria. It measures pre-execution checklist adherence, validation completeness, and consistency before any position entry.'}
            </p>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-4 text-xs font-mono">
              <span className="text-[var(--text-secondary)]">
                {isFr ? 'Poids validé :' : 'Earned weight:'} <strong className="text-[var(--text-primary)]">{earnedWeight} / {totalPossibleWeight}%</strong>
              </span>
              <span>·</span>
              <span className="text-[var(--text-secondary)]">
                {isFr ? 'Critères validés :' : 'Criteria met:'} <strong className="text-emerald-400">{Object.values(checkedCriteriaIds).filter(Boolean).length} / {criteriaList.length}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION C: DÉTAIL DES CRITÈRES DU PLAN */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
          <div>
            <h4 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)] flex items-center gap-2">
              <span>{isFr ? 'Détail des Critères de la Stratégie' : 'Strategy Criteria Breakdown'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[var(--text-secondary)]">
                {criteriaList.length} {isFr ? 'critères' : 'criteria'}
              </span>
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              {isFr
                ? 'Cochez ou décochez les critères pour tester l impact direct sur le score en temps réel.'
                : 'Toggle criteria checkboxes to simulate live impact on your score.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const allChecked: Record<string, boolean> = {};
                criteriaList.forEach(c => { allChecked[c.id] = true; });
                setCheckedCriteriaIds(allChecked);
              }}
              type="button"
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {isFr ? 'Tout valider' : 'Select all'}
            </button>
            <button
              onClick={() => setCheckedCriteriaIds({})}
              type="button"
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {isFr ? 'Réinitialiser' : 'Reset'}
            </button>
          </div>
        </div>

        {criteriaList.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-secondary)] space-y-2">
            <Info className="w-6 h-6 mx-auto text-amber-400/80" />
            <p>{isFr ? 'Ce plan ne comporte aucun critère. Ajoutez des critères pour activer le score.' : 'This plan has no criteria. Add criteria to enable scoring.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full space-y-2.5">
              {criteriaList.map(c => {
                const isChecked = checkedCriteriaIds[c.id] ?? false;
                const earnedForThis = isChecked && c.includeInScore ? c.weight : 0;

                return (
                  <div
                    key={c.id}
                    onClick={() => toggleCriterion(c.id)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-[var(--surface)] border-emerald-500/30'
                        : 'bg-[var(--surface)]/60 border-[var(--border)] opacity-85'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : 'border-white/30 bg-black/20'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-[var(--text-primary)]">
                            {c.name}
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                            c.status === 'mandatory'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : c.status === 'optional'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-white/5 text-[var(--text-secondary)]'
                          }`}>
                            {c.status}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[var(--text-secondary)]">
                            {c.category}
                          </span>
                        </div>

                        {c.description && (
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            {c.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Weight and Contribution */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono pt-2 sm:pt-0 border-t sm:border-0 border-[var(--border)]">
                      <span className="text-[var(--text-secondary)]">
                        {isFr ? 'Poids :' : 'Weight:'} <strong>{c.weight}%</strong>
                      </span>
                      <span className={`font-bold ${isChecked ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isChecked ? `+${earnedForThis} pts` : `0 pt`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SECTION D: RÈGLES ET GESTION DU RISQUE */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
            <h4 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
              {isFr ? 'Règles du Plan & Protection du Capital' : 'Plan Rules & Capital Protection'}
            </h4>
          </div>

          <button
            onClick={() => setIsEditingRules(!isEditingRules)}
            type="button"
            className="text-xs font-mono font-semibold text-[var(--accent)] hover:underline"
          >
            {isEditingRules ? (isFr ? 'Fermer' : 'Close') : (isFr ? 'Modifier les règles' : 'Edit rules')}
          </button>
        </div>

        {saveFeedback && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs">
            {isFr ? 'Règles du plan enregistrées avec succès.' : 'Plan rules saved successfully.'}
          </div>
        )}

        {isEditingRules ? (
          /* Inline rules editor */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div>
              <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase block mb-1">
                {isFr ? 'Risque max / trade (%)' : 'Max risk / trade (%)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={tempMaxRisk}
                onChange={e => setTempMaxRisk(Number(e.target.value))}
                className="w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase block mb-1">
                {isFr ? 'Ratio R/R Minimal' : 'Minimum R/R Ratio'}
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="20"
                value={tempMinRR}
                onChange={e => setTempMinRR(Number(e.target.value))}
                className="w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase block mb-1">
                {isFr ? 'Perte max journalière (%)' : 'Daily max loss (%)'}
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="20"
                value={tempDailyLoss}
                onChange={e => setTempDailyLoss(Number(e.target.value))}
                className="w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-primary)]"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingRules(false)}
                className="px-3.5 py-1.5 rounded-xl border border-[var(--border)] text-xs text-[var(--text-secondary)]"
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveEdits}
                className="px-4 py-1.5 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold"
              >
                {isFr ? 'Enregistrer les règles' : 'Save rules'}
              </button>
            </div>
          </div>
        ) : (
          /* Rules Grid Display */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block">
                {isFr ? 'RISQUE MAX / TRADE' : 'MAX RISK / TRADE'}
              </span>
              <strong className="text-base font-mono font-bold text-[var(--text-primary)]">
                {plan.guardian?.maxRiskPerTrade ?? 1}%
              </strong>
              <small className="text-[10px] text-[var(--text-secondary)] block">
                {isFr ? 'Seuil d alerte Guardian' : 'Guardian threshold'}
              </small>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block">
                {isFr ? 'RATIO R/R MINIMAL' : 'MINIMUM R/R'}
              </span>
              <strong className="text-base font-mono font-bold text-emerald-400">
                1:{plan.guardian?.minRR ?? 2}
              </strong>
              <small className="text-[10px] text-[var(--text-secondary)] block">
                {isFr ? 'Espérance mathématique' : 'Mathematical expectancy'}
              </small>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block">
                {isFr ? 'PERTE MAX / JOUR' : 'MAX DAILY LOSS'}
              </span>
              <strong className="text-base font-mono font-bold text-rose-400">
                {plan.guardian?.maxDailyLoss ?? 3}%
              </strong>
              <small className="text-[10px] text-[var(--text-secondary)] block">
                {isFr ? 'Arrêt obligatoire de session' : 'Hard circuit breaker'}
              </small>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block">
                {isFr ? 'TRADES MAX / JOUR' : 'MAX TRADES / DAY'}
              </span>
              <strong className="text-sm font-mono font-bold text-[var(--text-primary)] truncate block">
                {plan.guardian?.maxTradesPerDay ?? 5} trades
              </strong>
              <small className="text-[10px] text-[var(--text-secondary)] block">
                {isFr ? 'Protection anti-overtrading' : 'Anti-overtrading lock'}
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
