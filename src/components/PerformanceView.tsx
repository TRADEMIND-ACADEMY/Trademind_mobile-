import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext.js';
import { TrendingUp, BarChart3, PieChart, Layers } from 'lucide-react';

export const PerformanceView: React.FC = () => {
  const { trades, settings, stats } = useTrading();
  const isFr = settings.lang === 'fr';

  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all');
  const [breakdownBy, setBreakdownBy] = useState<'symbol' | 'session' | 'setup' | 'direction' | 'planName'>('symbol');

  const fmtCurrency = (n: number) => {
    const cur = settings.currency;
    const sign = n < 0 ? '-' : n > 0 ? '+' : '';
    return `${sign}${cur}${Math.abs(n).toLocaleString(isFr ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Filter trades by period
  const filteredTrades = useMemo(() => {
    if (period === 'all') return trades;
    const now = new Date();
    return trades.filter(t => {
      const d = new Date(t.date);
      if (period === 'month') {
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      } else if (period === 'week') {
        return (now.getTime() - d.getTime()) <= 7 * 86400000;
      }
      return true;
    });
  }, [trades, period]);

  // Aggregate stats by selected dimension
  const dimensionStats = useMemo(() => {
    const groups: Record<string, { count: number; wins: number; losses: number; pnl: number; r: number; grossProfit: number; grossLoss: number }> = {};

    filteredTrades.forEach(t => {
      const key = (t as any)[breakdownBy] || (isFr ? 'Non défini' : 'Undefined');
      if (!groups[key]) {
        groups[key] = { count: 0, wins: 0, losses: 0, pnl: 0, r: 0, grossProfit: 0, grossLoss: 0 };
      }
      groups[key].count++;
      const p = Number(t.pnl || 0);
      groups[key].pnl += p;
      if (p > 0) {
        groups[key].wins++;
        groups[key].grossProfit += p;
      } else if (p < 0) {
        groups[key].losses++;
        groups[key].grossLoss += Math.abs(p);
      }
      groups[key].r += Number(t.rMultiple || 0);
    });

    return Object.entries(groups).map(([name, data]) => {
      const winRate = data.count > 0 ? Math.round((data.wins / data.count) * 100) : 0;
      const pf = data.grossLoss > 0 ? Number((data.grossProfit / data.grossLoss).toFixed(2)) : (data.grossProfit > 0 ? 99.9 : 0);
      const avgR = data.count > 0 ? Number((data.r / data.count).toFixed(2)) : 0;
      return {
        name,
        count: data.count,
        winRate,
        pnl: data.pnl,
        pf,
        avgR
      };
    }).sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades, breakdownBy, isFr]);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">
            {isFr ? 'Centre de Performance & Analyses' : 'Performance Center & Analytics'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            {isFr ? 'Statistiques objectives calculées à partir de vos vraies données enregistrées.' : 'Objective metrics computed from your real recorded decisions.'}
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
          <button
            onClick={() => setPeriod('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-colors ${
              period === 'all' ? 'bg-[var(--accent)] text-[#04110f]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isFr ? 'Tout' : 'All'}
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-colors ${
              period === 'month' ? 'bg-[var(--accent)] text-[#04110f]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isFr ? 'Ce Mois' : 'This Month'}
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-colors ${
              period === 'week' ? 'bg-[var(--accent)] text-[#04110f]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isFr ? 'Cette Semaine' : 'This Week'}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)]">
          <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">{isFr ? 'P&L Total' : 'Total P&L'}</span>
          <div className={`text-xl sm:text-2xl font-mono font-bold mt-1 ${stats.netPnl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {fmtCurrency(stats.netPnl)}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)]">
          <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">{isFr ? 'Taux de Réussite' : 'Win Rate'}</span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">
            {stats.winRate}%
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)]">
          <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">{isFr ? 'Total R' : 'Total R'}</span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">
            {stats.totalR >= 0 ? '+' : ''}{stats.totalR}R
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)]">
          <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">{isFr ? 'Drawdown Max' : 'Max Drawdown'}</span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-rose-400 mt-1">
            {stats.maxDrawdown}%
          </div>
        </div>
      </div>

      {/* Breakdown Dimension Switcher */}
      <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
              {isFr ? 'Analyse par Dimension' : 'Dimension Breakdown'}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'symbol' as const, label: isFr ? 'Actif' : 'Asset' },
              { id: 'session' as const, label: 'Session' },
              { id: 'setup' as const, label: 'Setup' },
              { id: 'direction' as const, label: 'Direction' },
              { id: 'planName' as const, label: isFr ? 'Plan' : 'Plan' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setBreakdownBy(btn.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  breakdownBy === btn.id
                    ? 'bg-[var(--accent)] text-[#04110f] border-transparent font-bold'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {dimensionStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-secondary)] font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">{isFr ? 'Catégorie' : 'Category'}</th>
                  <th className="py-2.5 px-3">{isFr ? 'Trades' : 'Trades'}</th>
                  <th className="py-2.5 px-3">{isFr ? 'Win Rate' : 'Win Rate'}</th>
                  <th className="py-2.5 px-3">Profit Factor</th>
                  <th className="py-2.5 px-3">R Moyen</th>
                  <th className="py-2.5 px-3 text-right">P&L Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] font-mono">
                {dimensionStats.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-bold text-[var(--text-primary)]">{row.name}</td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">{row.count}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8">{row.winRate}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-[var(--accent)]" style={{ width: `${row.winRate}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">{row.pf}</td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">{row.avgR >= 0 ? '+' : ''}{row.avgR}R</td>
                    <td className={`py-3 px-3 text-right font-bold ${row.pnl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {fmtCurrency(row.pnl)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
            {isFr ? 'Aucune donnée enregistrée pour cette période.' : 'No trades recorded for this period.'}
          </div>
        )}
      </div>
    </div>
  );
};
