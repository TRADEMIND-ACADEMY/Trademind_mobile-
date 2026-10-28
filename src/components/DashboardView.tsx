import React from 'react';
import { useTrading } from '../context/TradingContext.js';
import { ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, Plus, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface DashboardViewProps {
  onOpenNewTrade: () => void;
  onGoToJournal: () => void;
  onOpenPlans: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewTrade,
  onGoToJournal,
  onOpenPlans
}) => {
  const { stats, trades, settings, activePlan, isDemoMode } = useTrading();
  const isFr = settings.lang === 'fr';

  // Guardian status computation
  const breachedTrades = trades.filter(t => t.guardianStatus === 'breach');
  const warningTrades = trades.filter(t => t.guardianStatus === 'warning');

  let overallGuardian: 'aligned' | 'warning' | 'breach' = 'aligned';
  if (breachedTrades.length > 0) overallGuardian = 'breach';
  else if (warningTrades.length > 0) overallGuardian = 'warning';

  const fmtCurrency = (n: number) => {
    const cur = settings.currency;
    const sign = n < 0 ? '-' : n > 0 ? '+' : '';
    return `${sign}${cur}${Math.abs(n).toLocaleString(isFr ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Recent 4 trades
  const recentTrades = trades.slice(0, 4);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Banner: Mode Indicator & Active Plan */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              {isDemoMode ? (isFr ? 'ESPACE VIRTUEL DE DÉMONSTRATION' : 'SYNTHETIC DEMO WORKSPACE') : (isFr ? 'ESPACE PRIVÉ RÉEL' : 'PRIVATE REAL WORKSPACE')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">
            {isFr ? 'Maîtrisez votre processus.' : 'Master your process.'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {isFr ? 'Plan actif :' : 'Active Plan :'} <span className="font-semibold text-[var(--text-primary)]">{activePlan ? activePlan.name : (isFr ? 'Aucun plan' : 'No plan')}</span>
            {activePlan && ` · ${activePlan.criteria.length} ${isFr ? 'règles configurées' : 'rules configured'}`}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenPlans}
            type="button"
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
          >
            {isFr ? 'Gérer les plans' : 'Manage plans'}
          </button>
          <button
            onClick={onOpenNewTrade}
            type="button"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold shadow-lg shadow-[var(--accent)]/15 hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isFr ? 'Nouveau Trade' : 'New Trade'}</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Net P&L */}
        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            {isFr ? 'P&L Net' : 'Net P&L'}
          </span>
          <div className="my-2">
            <span className={`text-xl sm:text-2xl font-mono font-bold ${stats.netPnl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
              {fmtCurrency(stats.netPnl)}
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {stats.returnPct >= 0 ? '+' : ''}{stats.returnPct}% {isFr ? 'du capital' : 'return'}
          </span>
        </div>

        {/* Win Rate */}
        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            {isFr ? 'Taux de réussite' : 'Win Rate'}
          </span>
          <div className="my-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-[var(--text-primary)]">
              {stats.winRate}%
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {stats.wins}W · {stats.losses}L · {stats.breakevens}BE
          </span>
        </div>

        {/* Profit Factor */}
        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            {isFr ? 'Profit Factor' : 'Profit Factor'}
          </span>
          <div className="my-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-[var(--text-primary)]">
              {stats.profitFactor}
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {isFr ? 'Gains:' : 'Gross:'} {fmtCurrency(stats.grossProfit)}
          </span>
        </div>

        {/* Guardian Status */}
        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            GUARDIAN
          </span>
          <div className="my-2 flex items-center gap-1.5">
            {overallGuardian === 'aligned' ? (
              <>
                <ShieldCheck className="w-5 h-5 text-[var(--success)]" />
                <span className="text-base sm:text-lg font-bold font-display text-[var(--success)]">ALIGNED</span>
              </>
            ) : overallGuardian === 'warning' ? (
              <>
                <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
                <span className="text-base sm:text-lg font-bold font-display text-[var(--warning)]">WARNING</span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-5 h-5 text-[var(--danger)]" />
                <span className="text-base sm:text-lg font-bold font-display text-[var(--danger)]">BREACH</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {breachedTrades.length} {isFr ? 'violations signalées' : 'violations detected'}
          </span>
        </div>
      </div>

      {/* Equity Curve Visualizer */}
      <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
              {isFr ? 'Courbe d Équité' : 'Equity Curve'}
            </h3>
          </div>
          <div className="text-xs font-mono text-[var(--text-secondary)]">
            {isFr ? 'Solde actuel :' : 'Current balance :'} <span className="text-[var(--text-primary)] font-bold">{fmtCurrency(stats.balance)}</span>
          </div>
        </div>

        {stats.equityCurve.length > 1 ? (
          <div className="h-44 sm:h-52 w-full pt-4">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Render dynamic path */}
              {(() => {
                const points = stats.equityCurve;
                const min = Math.min(...points.map(p => p.balance)) * 0.98;
                const max = Math.max(...points.map(p => p.balance)) * 1.02;
                const range = max - min || 1;

                const coords = points.map((p, idx) => {
                  const x = (idx / (points.length - 1)) * 500;
                  const y = 150 - ((p.balance - min) / range) * 140;
                  return { x, y, p };
                });

                const lineD = coords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`, '');
                const areaD = `${lineD} L 500 160 L 0 160 Z`;

                return (
                  <>
                    <defs>
                      <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4fe3d0" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#4fe3d0" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={areaD} fill="url(#equityGrad)" />
                    <path d={lineD} fill="none" stroke="#4fe3d0" strokeWidth="2.5" strokeLinecap="round" />
                    {coords.map((c, i) => (
                      <circle
                        key={i}
                        cx={c.x}
                        cy={c.y}
                        r="3.5"
                        fill="#05060a"
                        stroke="#4fe3d0"
                        strokeWidth="2"
                        className="transition-transform hover:scale-150 cursor-pointer"
                      />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-secondary)] font-mono">
            {isFr ? 'Aucun historique suffisant pour tracer la courbe d équité. Enregistrez vos premiers trades.' : 'No trades recorded yet to plot equity curve. Record your first trade.'}
          </div>
        )}
      </div>

      {/* Recent Trades Section */}
      <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
              {isFr ? 'Dernières Décisions Enregistrées' : 'Recent Recorded Decisions'}
            </h3>
          </div>
          <button
            onClick={onGoToJournal}
            type="button"
            className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            <span>{isFr ? 'Voir le Journal' : 'View Journal'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTrades.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {recentTrades.map(trade => (
              <div key={trade.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      trade.direction === 'buy' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {trade.direction === 'buy' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[var(--text-primary)]">{trade.symbol}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[var(--text-secondary)] font-mono">
                        {trade.session || 'Session'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      {trade.date} · {trade.planName || trade.setup || 'Standard Setup'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-bold text-sm ${Number(trade.pnl || 0) >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {fmtCurrency(Number(trade.pnl || 0))}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                    {trade.rMultiple ? `${trade.rMultiple > 0 ? '+' : ''}${trade.rMultiple}R` : '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[var(--text-secondary)]">
            {isFr ? 'Aucun trade dans le journal.' : 'No trades in your journal yet.'}
          </div>
        )}
      </div>
    </div>
  );
};
