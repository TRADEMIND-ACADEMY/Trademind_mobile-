import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext.js';
import { Trade } from '../types/index.js';
import { evaluatePlanExecution } from '../lib/plans.js';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, Camera } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeToEdit?: Trade | null;
}

const PSY_BEFORE = ['Calm', 'Confident', 'FOMO', 'Revenge', 'Impatient', 'Hesitant', 'Overconfident', 'Distracted'];
const PSY_AFTER = ['Followed plan', 'Broke plan', 'Would take again', 'Should have skipped'];

export const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, tradeToEdit }) => {
  const { plans, activePlan, addTrade, updateTrade, settings, stats, isDemoMode } = useTrading();
  const isFr = settings.lang === 'fr';

  const [symbol, setSymbol] = useState('EURUSD');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [size, setSize] = useState<string>('1.0');
  const [risk, setRisk] = useState<string>('1.0');
  const [pnl, setPnl] = useState<string>('');
  const [result, setResult] = useState<'win' | 'loss' | 'be'>('win');
  const [rMultiple, setRMultiple] = useState<string>('2.0');
  const [session, setSession] = useState<'London' | 'New York' | 'Asia' | 'Overlap' | 'Other'>('London');
  const [setup, setSetup] = useState('Breakout & Retest');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(activePlan?.id || '');
  const [criteriaResponses, setCriteriaResponses] = useState<Record<string, boolean>>({});
  const [psychology, setPsychology] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [screenshot, setScreenshot] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Populate when editing
  useEffect(() => {
    if (tradeToEdit) {
      setSymbol(tradeToEdit.symbol);
      setDirection(tradeToEdit.direction);
      setDate(tradeToEdit.date);
      setTime(tradeToEdit.time || '09:00');
      setEntryPrice(tradeToEdit.entryPrice != null ? String(tradeToEdit.entryPrice) : '');
      setStopLoss(tradeToEdit.stopLoss != null ? String(tradeToEdit.stopLoss) : '');
      setTakeProfit(tradeToEdit.takeProfit != null ? String(tradeToEdit.takeProfit) : '');
      setSize(tradeToEdit.size != null ? String(tradeToEdit.size) : '1.0');
      setRisk(tradeToEdit.risk != null ? String(tradeToEdit.risk) : '1.0');
      setPnl(tradeToEdit.pnl != null ? String(tradeToEdit.pnl) : '');
      setResult(tradeToEdit.result || 'win');
      setRMultiple(tradeToEdit.rMultiple != null ? String(tradeToEdit.rMultiple) : '2.0');
      setSession(tradeToEdit.session || 'London');
      setSetup(tradeToEdit.setup || 'Breakout & Retest');
      setSelectedPlanId(tradeToEdit.planId || activePlan?.id || '');
      setPsychology(tradeToEdit.psychology || []);
      setNotes(tradeToEdit.notes || '');
      setScreenshot(tradeToEdit.screenshot);

      // Pre-fill criteria responses from snapshot if available
      if (tradeToEdit.planSnapshot?.criteria) {
        const map: Record<string, boolean> = {};
        tradeToEdit.planSnapshot.criteria.forEach((c: any) => {
          map[c.criterionId] = c.validated;
        });
        setCriteriaResponses(map);
      }
    } else {
      // New trade defaults
      setSymbol('EURUSD');
      setDirection('buy');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toTimeString().slice(0, 5));
      setEntryPrice('');
      setStopLoss('');
      setTakeProfit('');
      setSize('1.0');
      setRisk('1.0');
      setPnl('');
      setResult('win');
      setRMultiple('2.0');
      setSession('London');
      setSetup('Breakout & Retest');
      setSelectedPlanId(activePlan?.id || '');
      setCriteriaResponses({});
      setPsychology([]);
      setNotes('');
      setScreenshot(undefined);
      setErrorMsg(null);
    }
  }, [tradeToEdit, activePlan, isOpen]);

  // Selected plan object
  const currentPlan = plans.find(p => p.id === selectedPlanId) || activePlan || null;

  // Auto-calculate RR if entry, SL, TP are provided
  useEffect(() => {
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);

    if (entry && sl && tp) {
      const riskDistance = Math.abs(entry - sl);
      const rewardDistance = Math.abs(tp - entry);
      if (riskDistance > 0) {
        const calculatedRR = (rewardDistance / riskDistance).toFixed(2);
        setRMultiple(calculatedRR);
      }
    }
  }, [entryPrice, stopLoss, takeProfit]);

  // Evaluate plan execution real-time
  const planEvaluation = React.useMemo(() => {
    if (!currentPlan) return null;
    const numRR = parseFloat(rMultiple) || 0;
    const numRisk = parseFloat(risk) || 0;
    const numPnl = parseFloat(pnl) || 0;

    return evaluatePlanExecution(currentPlan, criteriaResponses, {
      rr: numRR,
      risk: numRisk,
      pnl: numPnl,
      dailyLossPct: stats.maxDrawdown,
      todayTradesCount: 1,
      consecutiveLosses: stats.losses
    });
  }, [currentPlan, criteriaResponses, rMultiple, risk, pnl, stats]);

  const togglePsychology = (tag: string) => {
    setPsychology(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) {
      setErrorMsg(isFr ? 'Veuillez saisir un symbole (ex: EURUSD).' : 'Please enter an asset symbol.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const numPnl = pnl !== '' ? parseFloat(pnl) : (result === 'win' ? 100 : result === 'loss' ? -100 : 0);
    const numRisk = parseFloat(risk) || 1.0;
    const numRR = parseFloat(rMultiple) || 0;

    const tradePayload: Omit<Trade, 'id' | 'mode'> = {
      symbol: symbol.toUpperCase().trim(),
      direction,
      date,
      time,
      entryPrice: entryPrice ? parseFloat(entryPrice) : undefined,
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
      size: size ? parseFloat(size) : undefined,
      risk: numRisk,
      pnl: numPnl,
      result,
      rMultiple: numRR,
      session,
      setup,
      planId: currentPlan?.id,
      planName: currentPlan?.name,
      planSnapshot: planEvaluation || undefined,
      score: planEvaluation?.score,
      psychology,
      notes,
      screenshot,
      guardianStatus: planEvaluation?.guardianStatus || 'aligned',
      violations: planEvaluation?.violations || []
    };

    let res: { success: boolean; error?: string };
    if (tradeToEdit) {
      res = await updateTrade(tradeToEdit.id, tradePayload);
    } else {
      res = await addTrade(tradePayload);
    }

    setSaving(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Erreur lors de l enregistrement');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              {isDemoMode ? 'DEMO JOURNAL' : 'REAL JOURNAL'}
            </span>
            <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">
              {tradeToEdit ? (isFr ? 'Modifier le Trade' : 'Edit Trade') : (isFr ? 'Enregistrer une Décision' : 'Record New Decision')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Asset & Direction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                {isFr ? 'Actif / Symbole' : 'Asset / Symbol'} *
              </label>
              <input
                type="text"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                placeholder="EURUSD, XAUUSD, BTCUSD..."
                required
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                {isFr ? 'Direction' : 'Direction'}
              </label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('buy')}
                  className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                    direction === 'buy'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  BUY (LONG)
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('sell')}
                  className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                    direction === 'sell'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  SELL (SHORT)
                </button>
              </div>
            </div>
          </div>

          {/* Date, Time, Session */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{isFr ? 'Heure' : 'Time'}</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Session</label>
              <select
                value={session}
                onChange={e => setSession(e.target.value as any)}
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="London">London</option>
                <option value="New York">New York</option>
                <option value="Asia">Asia</option>
                <option value="Overlap">Overlap</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Price levels: Entry, SL, TP, Size */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{isFr ? 'Entrée' : 'Entry'}</label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={e => setEntryPrice(e.target.value)}
                placeholder="1.0850"
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Stop Loss</label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={e => setStopLoss(e.target.value)}
                placeholder="1.0820"
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Take Profit</label>
              <input
                type="number"
                step="any"
                value={takeProfit}
                onChange={e => setTakeProfit(e.target.value)}
                placeholder="1.0910"
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{isFr ? 'Lots / Taille' : 'Size'}</label>
              <input
                type="number"
                step="any"
                value={size}
                onChange={e => setSize(e.target.value)}
                placeholder="1.0"
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>
          </div>

          {/* Outcome: P&L, Result, RR, Risk% */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{isFr ? 'Résultat' : 'Result'}</label>
              <select
                value={result}
                onChange={e => setResult(e.target.value as any)}
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-bold"
              >
                <option value="win">WIN (+)</option>
                <option value="loss">LOSS (-)</option>
                <option value="be">BREAKEVEN (0)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">P&L ({settings.currency})</label>
              <input
                type="number"
                step="any"
                value={pnl}
                onChange={e => setPnl(e.target.value)}
                placeholder="+250 or -100"
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Multiple R</label>
              <input
                type="number"
                step="any"
                value={rMultiple}
                onChange={e => setRMultiple(e.target.value)}
                placeholder="2.5"
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{isFr ? 'Risque %' : 'Risk %'}</label>
              <input
                type="number"
                step="any"
                value={risk}
                onChange={e => setRisk(e.target.value)}
                placeholder="1.0"
                className="mt-1 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>
          </div>

          {/* Strategy Plan Selection & Criteria Checklist */}
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)]">
                  {isFr ? 'PLAN DE TRADING & CRITÈRES' : 'TRADING PLAN & CRITERIA'}
                </span>
                <h4 className="text-sm font-display font-bold text-[var(--text-primary)]">
                  {currentPlan ? currentPlan.name : (isFr ? 'Aucun plan actif' : 'No active plan')}
                </h4>
              </div>
              <select
                value={selectedPlanId}
                onChange={e => setSelectedPlanId(e.target.value)}
                className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {currentPlan && currentPlan.criteria.length > 0 ? (
              <div className="space-y-2 pt-2">
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {isFr
                    ? 'Validez manuellement vos confirmations subjectives. Les critères quantitatifs sont évalués automatiquement.'
                    : 'Check your subjective confirmations manually. Quantitative criteria are evaluated automatically.'}
                </p>

                <div className="divide-y divide-[var(--border)] border-y border-[var(--border)] my-2">
                  {currentPlan.criteria.map(crit => {
                    const isChecked = Boolean(criteriaResponses[crit.id]);
                    const isQuantitative = crit.type === 'quantitative';

                    return (
                      <div key={crit.id} className="py-2.5 flex items-start justify-between gap-3">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isQuantitative}
                            onChange={e => {
                              setCriteriaResponses(prev => ({
                                ...prev,
                                [crit.id]: e.target.checked
                              }));
                            }}
                            className="mt-0.5 rounded border-white/20 text-[var(--accent)] focus:ring-[var(--accent)]"
                          />
                          <div>
                            <span className="text-xs font-medium text-[var(--text-primary)] block">
                              {crit.name}
                            </span>
                            {crit.description && (
                              <span className="text-[10px] text-[var(--text-secondary)] block">
                                {crit.description}
                              </span>
                            )}
                          </div>
                        </label>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            crit.status === 'mandatory'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-white/5 text-[var(--text-secondary)]'
                          }`}>
                            {crit.status === 'mandatory' ? (isFr ? 'Obligatoire' : 'Mandatory') : (isFr ? 'Facultatif' : 'Optional')}
                          </span>
                          {crit.includeInScore && (
                            <span className="text-[10px] font-mono text-[var(--accent)]">
                              +{crit.weight}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Score & Guardian Status summary */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs font-mono text-[var(--text-secondary)]">
                    {isFr ? 'SCORE DU PLAN :' : 'PLAN SCORE :'}
                    <strong className="ml-1 text-[var(--accent)] font-bold">
                      {planEvaluation?.score != null ? `${planEvaluation.score} / 100` : (isFr ? 'Désactivé' : 'Disabled')}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono">
                    {planEvaluation?.guardianStatus === 'aligned' ? (
                      <span className="text-[var(--success)] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ALIGNED
                      </span>
                    ) : planEvaluation?.guardianStatus === 'warning' ? (
                      <span className="text-[var(--warning)] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> WARNING
                      </span>
                    ) : (
                      <span className="text-[var(--danger)] flex items-center gap-1 font-bold">
                        <ShieldAlert className="w-3.5 h-3.5" /> BREACH
                      </span>
                    )}
                  </div>
                </div>

                {/* Violations notice (Non-blocking as required!) */}
                {planEvaluation && planEvaluation.violations.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{isFr ? 'Écarts au plan constatés (enregistrement autorisé) :' : 'Plan deviations detected (saving allowed) :'}</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] space-y-0.5 opacity-90 pl-1">
                      {planEvaluation.violations.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-secondary)] italic">
                {isFr ? 'Aucun critère dans ce plan.' : 'No criteria configured in this plan.'}
              </p>
            )}
          </div>

          {/* Psychology Checkboxes */}
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase block mb-2">
              {isFr ? 'Psychologie & Discipline' : 'Psychology & Discipline'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[...PSY_BEFORE, ...PSY_AFTER].map(tag => {
                const active = psychology.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => togglePsychology(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${
                      active
                        ? 'bg-[var(--accent)] text-[#04110f] border-transparent font-bold'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes & Screenshot */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
              {isFr ? 'Notes & Analyse' : 'Notes & Analysis'}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder={isFr ? 'Observations, contexte, leçons apprises...' : 'Context, key lessons, chart behavior...'}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <Camera className="w-3.5 h-3.5" />
                <span>{screenshot ? (isFr ? 'Changer capture' : 'Change screenshot') : (isFr ? 'Ajouter capture' : 'Add screenshot')}</span>
                <input type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
              </label>
              {screenshot && (
                <span className="text-[11px] text-[var(--success)]">✓ {isFr ? 'Capture chargée' : 'Screenshot loaded'}</span>
              )}
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {isFr ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold shadow-lg shadow-[var(--accent)]/15 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {saving ? (isFr ? 'Enregistrement...' : 'Saving...') : tradeToEdit ? (isFr ? 'Mettre à jour' : 'Update Trade') : (isFr ? 'Enregistrer le Trade' : 'Save Trade')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
