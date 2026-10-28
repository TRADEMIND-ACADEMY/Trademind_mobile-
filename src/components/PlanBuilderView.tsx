import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext.js';
import { TradingPlan, PlanCriterion } from '../types/plans.js';
import { STRATEGY_TEMPLATES, createPlanFromTemplate } from '../lib/plans.js';
import { Plus, Sliders, CheckCircle, Trash2, Copy, Shield, ChevronUp, ChevronDown, Check, Award, LayoutList } from 'lucide-react';
import { PlanScoreSection } from './PlanScoreSection.js';

export const PlanBuilderView: React.FC = () => {
  const { plans, activePlan, setActivePlanId, savePlan, deletePlan, settings } = useTrading();
  const isFr = settings.lang === 'fr';

  const [subView, setSubView] = useState<'score' | 'editor'>('score');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(activePlan?.id || (plans[0]?.id || ''));
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<PlanCriterion | null>(null);

  const plan = plans.find(p => p.id === selectedPlanId) || plans[0] || null;

  const handleCreateFromTemplate = (templateId: string) => {
    const newPlan = createPlanFromTemplate(templateId);
    savePlan(newPlan);
    setSelectedPlanId(newPlan.id);
    setShowTemplateModal(false);
  };

  const handleDuplicatePlan = (p: TradingPlan) => {
    const duplicated: TradingPlan = {
      ...p,
      id: 'plan_' + Math.random().toString(36).slice(2, 10),
      name: `${p.name} (Copie)`,
      isActive: false,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    savePlan(duplicated);
    setSelectedPlanId(duplicated.id);
  };

  const handleDeletePlan = (id: string) => {
    if (plans.length <= 1) {
      alert(isFr ? 'Vous devez conserver au moins un plan de trading.' : 'You must keep at least one trading plan.');
      return;
    }
    if (window.confirm(isFr ? 'Supprimer ce plan ? Les trades passés conserveront leur instantané intact.' : 'Delete this plan? Past trades will keep their snapshot intact.')) {
      deletePlan(id);
      const remaining = plans.filter(p => p.id !== id);
      if (remaining.length > 0) setSelectedPlanId(remaining[0].id);
    }
  };

  const handleAddCriterion = () => {
    if (!plan) return;
    const newCrit: PlanCriterion = {
      id: 'crit_' + Math.random().toString(36).slice(2, 8),
      name: isFr ? 'Nouveau Critère' : 'New Criterion',
      category: 'Setup',
      description: '',
      status: 'mandatory',
      type: 'qualitative',
      weight: 20,
      includeInScore: true,
      violationBehavior: 'warning'
    };
    const updated: TradingPlan = {
      ...plan,
      criteria: [...plan.criteria, newCrit]
    };
    savePlan(updated);
  };

  const handleUpdateCriterion = (critId: string, updates: Partial<PlanCriterion>) => {
    if (!plan) return;
    const updatedCriteria = plan.criteria.map(c => c.id === critId ? { ...c, ...updates } : c);
    savePlan({ ...plan, criteria: updatedCriteria });
  };

  const handleDeleteCriterion = (critId: string) => {
    if (!plan) return;
    const updatedCriteria = plan.criteria.filter(c => c.id !== critId);
    savePlan({ ...plan, criteria: updatedCriteria });
  };

  const handleMoveCriterion = (index: number, direction: 'up' | 'down') => {
    if (!plan) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= plan.criteria.length) return;

    const list = [...plan.criteria];
    const [moved] = list.splice(index, 1);
    list.splice(newIndex, 0, moved);
    savePlan({ ...plan, criteria: list });
  };

  const totalScoreWeight = plan ? plan.criteria.filter(c => c.includeInScore).reduce((sum, c) => sum + c.weight, 0) : 0;

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">
            {isFr ? 'Générateur de Plans de Trading' : 'Trading Plan Builder'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            {isFr
              ? 'Créez vos stratégies sur mesure. SMC n est qu une stratégie parmi d autres.'
              : 'Design custom trading strategies. SMC is just one option among many.'}
          </p>
        </div>

        <button
          onClick={() => setShowTemplateModal(true)}
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold shadow-lg shadow-[var(--accent)]/15 hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{isFr ? 'Créer un Plan / Modèle' : 'New Plan / Template'}</span>
        </button>
      </div>

      {/* View Switcher: Score du Plan vs Éditeur Avancé */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] w-fit">
        <button
          type="button"
          onClick={() => setSubView('score')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            subView === 'score'
              ? 'bg-[var(--accent)] text-[#04110f] shadow-sm font-bold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isFr ? 'Score & Rigueur du Plan' : 'Plan Score & Discipline'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSubView('editor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            subView === 'editor'
              ? 'bg-[var(--accent)] text-[#04110f] shadow-sm font-bold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          <span>{isFr ? 'Éditeur Avancé des Critères' : 'Advanced Criteria Editor'}</span>
        </button>
      </div>

      {subView === 'score' ? (
        <PlanScoreSection
          onOpenPlanBuilder={() => setSubView('editor')}
          onOpenNewPlan={() => setShowTemplateModal(true)}
        />
      ) : (
        <>
          {/* Plan Selector Carousel / Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border)]">
            {plans.map(p => {
              const isCurrentSelected = p.id === (plan?.id || '');
              const isAct = p.isActive;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                    isCurrentSelected
                      ? 'bg-[var(--surface-elevated)] border-[var(--accent)] text-[var(--text-primary)] shadow-md'
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{p.name}</span>
                  {isAct ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                      {isFr ? 'ACTIF' : 'ACTIVE'}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

      {plan ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Plan Settings & Guardian rules */}
          <div className="space-y-5">
            {/* Plan Info Card */}
            <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
                  {isFr ? 'PARAMÈTRES DU PLAN' : 'PLAN SETTINGS'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicatePlan(plan)}
                    type="button"
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
                    title={isFr ? 'Dupliquer ce plan' : 'Duplicate plan'}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    type="button"
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-rose-400 hover:bg-rose-500/10"
                    title={isFr ? 'Supprimer ce plan' : 'Delete plan'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                  {isFr ? 'Nom de la stratégie' : 'Strategy Name'}
                </label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={e => savePlan({ ...plan, name: e.target.value })}
                  className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                  Description
                </label>
                <textarea
                  value={plan.description || ''}
                  onChange={e => savePlan({ ...plan, description: e.target.value })}
                  rows={2}
                  className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Set Active Button */}
              {!plan.isActive ? (
                <button
                  onClick={() => setActivePlanId(plan.id)}
                  type="button"
                  className="w-full py-2.5 rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold hover:bg-[var(--accent)]/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isFr ? 'Définir comme Plan Actif' : 'Set as Active Plan'}</span>
                </button>
              ) : (
                <div className="py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5 font-mono">
                  <CheckCircle className="w-4 h-4" />
                  <span>{isFr ? 'PLAN ACTIF ACTUEL' : 'CURRENT ACTIVE PLAN'}</span>
                </div>
              )}

              {/* Scoring Toggle */}
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[var(--text-primary)] block">
                    {isFr ? 'Calcul du Score' : 'Score Calculation'}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {isFr ? 'Total des poids :' : 'Total weight :'} {totalScoreWeight}%
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={plan.scoringEnabled}
                  onChange={e => savePlan({ ...plan, scoringEnabled: e.target.checked })}
                  className="rounded border-white/20 text-[var(--accent)] focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            {/* Plan Guardian Limits */}
            <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                  {isFr ? 'Limites Guardian pour ce Plan' : 'Plan Guardian Limits'}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)]">{isFr ? 'Risque Max/Trade (%)' : 'Max Risk/Trade (%)'}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={plan.guardian.maxRiskPerTrade}
                    onChange={e => savePlan({ ...plan, guardian: { ...plan.guardian, maxRiskPerTrade: parseFloat(e.target.value) || 1 } })}
                    className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-1.5 font-mono text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)]">{isFr ? 'Perte Max/Jour (%)' : 'Max Daily Loss (%)'}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={plan.guardian.maxDailyLoss}
                    onChange={e => savePlan({ ...plan, guardian: { ...plan.guardian, maxDailyLoss: parseFloat(e.target.value) || 3 } })}
                    className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-1.5 font-mono text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)]">{isFr ? 'Trades Max/Jour' : 'Max Trades/Day'}</label>
                  <input
                    type="number"
                    value={plan.guardian.maxTradesPerDay}
                    onChange={e => savePlan({ ...plan, guardian: { ...plan.guardian, maxTradesPerDay: parseInt(e.target.value) || 4 } })}
                    className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-1.5 font-mono text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)]">{isFr ? 'RR Minimum' : 'Minimum RR'}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={plan.guardian.minRR}
                    onChange={e => savePlan({ ...plan, guardian: { ...plan.guardian, minRR: parseFloat(e.target.value) || 1.5 } })}
                    className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-1.5 font-mono text-[var(--text-primary)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Columns: Criteria Management */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                  {isFr ? 'Critères & Confluences de la Stratégie' : 'Strategy Criteria & Confluences'}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {plan.criteria.length} {isFr ? 'critères définis' : 'criteria defined'}
                </p>
              </div>

              <button
                onClick={handleAddCriterion}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFr ? 'Ajouter un critère' : 'Add criterion'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {plan.criteria.map((crit, idx) => (
                <div
                  key={crit.id}
                  className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">#{idx + 1}</span>
                        <input
                          type="text"
                          value={crit.name}
                          onChange={e => handleUpdateCriterion(crit.id, { name: e.target.value })}
                          className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-[var(--accent)] text-sm font-bold text-[var(--text-primary)] focus:outline-none px-1"
                        />
                      </div>
                      <input
                        type="text"
                        value={crit.description || ''}
                        placeholder={isFr ? 'Description ou instruction spécifique...' : 'Description or specific guidance...'}
                        onChange={e => handleUpdateCriterion(crit.id, { description: e.target.value })}
                        className="w-full bg-transparent border-b border-transparent hover:border-white/10 focus:border-[var(--accent)] text-xs text-[var(--text-secondary)] focus:outline-none px-1"
                      />
                    </div>

                    {/* Reorder and Delete controls */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleMoveCriterion(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-20"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveCriterion(idx, 'down')}
                        disabled={idx === plan.criteria.length - 1}
                        className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-20"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCriterion(crit.id)}
                        className="p-1 rounded text-[var(--text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 ml-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Criterion details: status, type, weight, violation */}
                  <div className="pt-2 border-t border-[var(--border)] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-[var(--text-secondary)] uppercase block mb-1">Statut</label>
                      <select
                        value={crit.status}
                        onChange={e => handleUpdateCriterion(crit.id, { status: e.target.value as any })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)]"
                      >
                        <option value="mandatory">{isFr ? 'Obligatoire' : 'Mandatory'}</option>
                        <option value="optional">{isFr ? 'Facultatif' : 'Optional'}</option>
                        <option value="informative">{isFr ? 'Informatif' : 'Informative'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-[var(--text-secondary)] uppercase block mb-1">Type</label>
                      <select
                        value={crit.type}
                        onChange={e => handleUpdateCriterion(crit.id, { type: e.target.value as any })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)]"
                      >
                        <option value="qualitative">{isFr ? 'Qualitatif (manuel)' : 'Qualitative (manual)'}</option>
                        <option value="quantitative">{isFr ? 'Quantitatif (seuil)' : 'Quantitative (numeric)'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-[var(--text-secondary)] uppercase block mb-1">Poids (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={crit.weight}
                        onChange={e => handleUpdateCriterion(crit.id, { weight: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs font-mono text-[var(--text-primary)]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[var(--text-secondary)] uppercase block mb-1">Comportement écart</label>
                      <select
                        value={crit.violationBehavior}
                        onChange={e => handleUpdateCriterion(crit.id, { violationBehavior: e.target.value as any })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)]"
                      >
                        <option value="breach">{isFr ? 'Alerte Breach' : 'Breach'}</option>
                        <option value="warning">{isFr ? 'Avertissement' : 'Warning'}</option>
                        <option value="info">Info</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
        </>
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  {isFr ? 'Choisir un Modèle de Stratégie' : 'Choose a Strategy Template'}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {isFr ? 'Tous les modèles sont 100% personnalisables. Vous pouvez aussi démarrer avec un plan vierge.' : 'All templates are 100% customizable. You can also start from scratch.'}
                </p>
              </div>
              <button onClick={() => setShowTemplateModal(false)} className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {STRATEGY_TEMPLATES.map(tmpl => (
                <div
                  key={tmpl.id}
                  onClick={() => handleCreateFromTemplate(tmpl.id)}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)] cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[var(--text-primary)]">{tmpl.name[isFr ? 'fr' : 'en']}</span>
                    <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                      {tmpl.criteria.length} {isFr ? 'critères' : 'rules'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                    {tmpl.description[isFr ? 'fr' : 'en']}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
