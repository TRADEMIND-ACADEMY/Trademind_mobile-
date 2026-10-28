import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext.js';
import { Trade } from '../types/index.js';
import { Grid3X3, ArrowUpDown, Filter, AlertCircle, Award, Target, Flame, TrendingUp } from 'lucide-react';

export const MatrixView: React.FC = () => {
  const { trades, settings, stats, isDemoMode } = useTrading();
  const isFr = settings.lang === 'fr';

  // Filters
  const [periodFilter, setPeriodFilter] = useState<'all' | 'year' | 'quarter' | 'month' | 'week'>('all');
  const [assetFilter, setAssetFilter] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [matrixRowDimension, setMatrixRowDimension] = useState<'symbol' | 'setup' | 'session' | 'direction'>('symbol');
  const [matrixColDimension, setMatrixColDimension] = useState<'session' | 'direction' | 'result'>('session');

  const fmtCurrency = (n: number) => {
    const cur = settings.currency;
    const sign = n < 0 ? '-' : n > 0 ? '+' : '';
    return `${sign}${cur}${Math.abs(n).toLocaleString(isFr ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Filtered trades
  const filteredTrades = useMemo(() => {
    const now = new Date();
    return trades.filter(t => {
      // Period filter
      if (periodFilter !== 'all') {
        const d = new Date(t.date);
        const diffMs = now.getTime() - d.getTime();
        if (periodFilter === 'week' && diffMs > 7 * 86400000) return false;
        if (periodFilter === 'month' && diffMs > 30 * 86400000) return false;
        if (periodFilter === 'quarter' && diffMs > 90 * 86400000) return false;
        if (periodFilter === 'year' && diffMs > 365 * 86400000) return false;
      }
      // Asset filter
      if (assetFilter !== 'all' && t.symbol !== assetFilter) return false;
      // Direction filter
      if (directionFilter !== 'all' && t.direction !== directionFilter) return false;
      return true;
    });
  }, [trades, periodFilter, assetFilter, directionFilter]);

  // Unique list of symbols for filter
  const uniqueSymbols = useMemo(() => {
    return Array.from(new Set(trades.map(t => t.symbol))).filter(Boolean);
  }, [trades]);

  // Dynamic row and column keys
  const { rowKeys, colKeys, matrixData } = useMemo(() => {
    const rSet = new Set<string>();
    const cSet = new Set<string>();

    filteredTrades.forEach(t => {
      const rVal = (t as any)[matrixRowDimension] || (isFr ? 'Non défini' : 'Undefined');
      const cVal = (t as any)[matrixColDimension] || (isFr ? 'Non défini' : 'Undefined');
      rSet.add(rVal);
      cSet.add(cVal);
    });

    const rows = Array.from(rSet).sort();
    const cols = Array.from(cSet).sort();

    // Map: rowKey -> colKey -> aggregate data
    const map: Record<string, Record<string, { count: number; wins: number; losses: number; pnl: number; r: number; grossProfit: number; grossLoss: number }>> = {};

    rows.forEach(r => {
      map[r] = {};
      cols.forEach(c => {
        map[r][c] = { count: 0, wins: 0, losses: 0, pnl: 0, r: 0, grossProfit: 0, grossLoss: 0 };
      });
    });

    filteredTrades.forEach(t => {
      const r = (t as any)[matrixRowDimension] || (isFr ? 'Non défini' : 'Undefined');
      const c = (t as any)[matrixColDimension] || (isFr ? 'Non défini' : 'Undefined');
      if (map[r] && map[r][c]) {
        const cell = map[r][c];
        cell.count += 1;
        const p = Number(t.pnl || 0);
        cell.pnl += p;
        if (p > 0) {
          cell.wins += 1;
          cell.grossProfit += p;
        } else if (p < 0) {
          cell.losses += 1;
          cell.grossLoss += Math.abs(p);
        }
        cell.r += Number(t.rMultiple || 0);
      }
    });

    return { rowKeys: rows, colKeys: cols, matrixData: map };
  }, [filteredTrades, matrixRowDimension, matrixColDimension, isFr]);

  // Recurrent errors & plan infractions
  const infractionAnalysis = useMemo(() => {
    const breaches = filteredTrades.filter(t => t.guardianStatus === 'breach' || (t.violations && t.violations.length > 0));
    const violationMap: Record<string, number> = {};

    breaches.forEach(t => {
      (t.violations || ['Écart au plan']).forEach(v => {
        violationMap[v] = (violationMap[v] || 0) + 1;
      });
    });

    const sortedViolations = Object.entries(violationMap).sort((a, b) => b[1] - a[1]);
    const adherenceRate = filteredTrades.length > 0
      ? Math.round(((filteredTrades.length - breaches.length) / filteredTrades.length) * 100)
      : 100;

    return { breachesCount: breaches.length, adherenceRate, sortedViolations };
  }, [filteredTrades]);

  // Psychological state correlations
  const psychologyMatrix = useMemo(() => {
    const tagMap: Record<string, { count: number; wins: number; pnl: number }> = {};
    filteredTrades.forEach(t => {
      (t.psychology || []).forEach(tag => {
        if (!tagMap[tag]) tagMap[tag] = { count: 0, wins: 0, pnl: 0 };
        tagMap[tag].count++;
        const p = Number(t.pnl || 0);
        tagMap[tag].pnl += p;
        if (p > 0) tagMap[tag].wins++;
      });
    });

    return Object.entries(tagMap).map(([tag, d]) => ({
      tag,
      count: d.count,
      winRate: d.count > 0 ? Math.round((d.wins / d.count) * 100) : 0,
      pnl: d.pnl
    })).sort((a, b) => b.count - a.count);
  }, [filteredTrades]);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              {isDemoMode ? (isFr ? 'MATRICE VIRTUELLE DÉMO (40 TRADES)' : 'DEMO PROGRESSION MATRIX (40 TRADES)') : (isFr ? 'MATRICE DE PROGRESSION RÉELLE' : 'REAL PROGRESSION MATRIX')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">
            {isFr ? 'Matrice de Progression du Trader' : 'Trader Progression Matrix'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            {filteredTrades.length} {isFr ? 'trades analysés selon vos critères' : 'trades analyzed against your criteria'}
          </p>
        </div>

        {/* Global Matrix Filters Bar */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Period filter */}
          <select
            value={periodFilter}
            onChange={e => setPeriodFilter(e.target.value as any)}
            className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-semibold"
          >
            <option value="all">{isFr ? 'Période : Tout' : 'Period: All'}</option>
            <option value="year">{isFr ? 'Cette Année' : 'This Year'}</option>
            <option value="quarter">{isFr ? 'Ce Trimestre' : 'This Quarter'}</option>
            <option value="month">{isFr ? 'Ce Mois' : 'This Month'}</option>
            <option value="week">{isFr ? 'Cette Semaine' : 'This Week'}</option>
          </select>

          {/* Asset filter */}
          <select
            value={assetFilter}
            onChange={e => setAssetFilter(e.target.value)}
            className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-semibold"
          >
            <option value="all">{isFr ? 'Actif : Tous' : 'Asset: All'}</option>
            {uniqueSymbols.map(sym => (
              <option key={sym} value={sym}>{sym}</option>
            ))}
          </select>

          {/* Direction filter */}
          <select
            value={directionFilter}
            onChange={e => setDirectionFilter(e.target.value)}
            className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-semibold"
          >
            <option value="all">{isFr ? 'Direction : Toutes' : 'Direction: All'}</option>
            <option value="buy">LONG (Buy)</option>
            <option value="sell">SHORT (Sell)</option>
          </select>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md">
          <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)]">{isFr ? 'Adhésion au Plan' : 'Plan Adherence'}</span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--accent)] mt-1">
            {infractionAnalysis.adherenceRate}%
          </div>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {filteredTrades.length - infractionAnalysis.breachesCount} / {filteredTrades.length} {isFr ? 'trades conformes' : 'disciplined trades'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md">
          <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)]">{isFr ? 'R Moyen Exécuté' : 'Average R'}</span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">
            {stats.avgR >= 0 ? '+' : ''}{stats.avgR}R
          </div>
          <span className="text-[10px] text-[var(--text-secondary)]">
            Total {stats.totalR >= 0 ? '+' : ''}{stats.totalR}R
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md">
          <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)]">{isFr ? 'Facteur de Profit' : 'Profit Factor'}</span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">
            {stats.profitFactor}
          </div>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {stats.winRate}% {isFr ? 'réussite' : 'win rate'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md">
          <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)]">{isFr ? 'P&L Période Sélectionnée' : 'Filtered Net P&L'}</span>
          <div className={`text-xl sm:text-2xl font-mono font-bold mt-1 ${stats.netPnl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {fmtCurrency(stats.netPnl)}
          </div>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {isFr ? 'Calculé à partir de' : 'From'} {filteredTrades.length} {isFr ? 'décisions' : 'trades'}
          </span>
        </div>
      </div>

      {/* Main Interactive Matrix Heatmap */}
      <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
              {isFr ? 'Matrice Croisée de Performance' : 'Cross-Performance Heatmap'}
            </h3>
          </div>

          {/* Dimension Axes Selector */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-[var(--text-secondary)]">{isFr ? 'Lignes :' : 'Rows:'}</span>
            <select
              value={matrixRowDimension}
              onChange={e => setMatrixRowDimension(e.target.value as any)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2.5 py-1 text-xs text-[var(--text-primary)]"
            >
              <option value="symbol">{isFr ? 'Actifs / Paires' : 'Assets / Pairs'}</option>
              <option value="setup">{isFr ? 'Stratégies / Setups' : 'Strategies / Setups'}</option>
              <option value="session">Sessions</option>
              <option value="direction">Directions (Long/Short)</option>
            </select>

            <span className="text-[var(--text-secondary)] ml-1">{isFr ? 'Colonnes :' : 'Cols:'}</span>
            <select
              value={matrixColDimension}
              onChange={e => setMatrixColDimension(e.target.value as any)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2.5 py-1 text-xs text-[var(--text-primary)]"
            >
              <option value="session">Sessions</option>
              <option value="direction">Directions</option>
              <option value="result">{isFr ? 'Résultats (Win/Loss/BE)' : 'Results'}</option>
            </select>
          </div>
        </div>

        {rowKeys.length > 0 && colKeys.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-secondary)] font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3 bg-white/[0.02]">
                    {matrixRowDimension.toUpperCase()} \ {matrixColDimension.toUpperCase()}
                  </th>
                  {colKeys.map(col => (
                    <th key={col} className="py-2.5 px-3 text-center">{col}</th>
                  ))}
                  <th className="py-2.5 px-3 text-right bg-white/[0.02]">{isFr ? 'Total Ligne' : 'Row Total'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] font-mono">
                {rowKeys.map(row => {
                  let rowTotalPnl = 0;
                  let rowTotalTrades = 0;
                  let rowTotalWins = 0;

                  return (
                    <tr key={row} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-3 font-bold text-[var(--text-primary)] bg-white/[0.02]">
                        {row}
                      </td>

                      {colKeys.map(col => {
                        const cell = matrixData[row]?.[col] || { count: 0, wins: 0, losses: 0, pnl: 0, r: 0 };
                        rowTotalPnl += cell.pnl;
                        rowTotalTrades += cell.count;
                        rowTotalWins += cell.wins;

                        const winRate = cell.count > 0 ? Math.round((cell.wins / cell.count) * 100) : 0;
                        const isThinSample = cell.count > 0 && cell.count < 3;

                        // Heatmap cell background
                        let bgStyle = 'bg-white/[0.02]';
                        if (cell.count > 0) {
                          if (cell.pnl > 0) bgStyle = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
                          else if (cell.pnl < 0) bgStyle = 'bg-rose-500/10 border-rose-500/20 text-rose-300';
                          else bgStyle = 'bg-white/5 text-[var(--text-secondary)]';
                        }

                        return (
                          <td key={col} className="py-2.5 px-3 text-center">
                            {cell.count > 0 ? (
                              <div className={`p-2 rounded-xl border ${bgStyle} flex flex-col items-center justify-center space-y-0.5`}>
                                <span className="font-bold text-xs">{fmtCurrency(cell.pnl)}</span>
                                <span className="text-[10px] opacity-80">{cell.count} trades · {winRate}% W</span>
                                {isThinSample && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono" title={isFr ? 'Échantillon restreint (< 3 trades)' : 'Thin sample (< 3 trades)'}>
                                    {isFr ? 'Échantillon court' : 'Thin sample'}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[var(--text-secondary)] opacity-30">—</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Row Total */}
                      <td className="py-3 px-3 text-right bg-white/[0.02]">
                        <div className={`font-bold ${rowTotalPnl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                          {fmtCurrency(rowTotalPnl)}
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)]">
                          {rowTotalTrades} {isFr ? 'trades' : 'trades'} · {rowTotalTrades > 0 ? Math.round((rowTotalWins / rowTotalTrades) * 100) : 0}% W
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
            {isFr ? 'Aucun trade ne correspond à la matrice actuelle.' : 'No trades match the current matrix filter.'}
          </div>
        )}
      </div>

      {/* Recurrent Errors & Plan Compliance Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recurrent Errors */}
        <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
              {isFr ? 'Diagnostic des Écarts & Erreurs Récurrentes' : 'Plan Violations & Error Diagnostics'}
            </h3>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            {infractionAnalysis.breachesCount} {isFr ? 'trades ont enfreint une règle du plan ou du Guardian.' : 'trades had plan or risk violations.'}
          </p>

          {infractionAnalysis.sortedViolations.length > 0 ? (
            <div className="space-y-2 pt-1">
              {infractionAnalysis.sortedViolations.map(([violation, count], idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs">
                  <span className="text-rose-200 font-medium">{violation}</span>
                  <span className="font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/20">
                    {count} {isFr ? 'fois' : 'times'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <Award className="w-4 h-4 flex-shrink-0" />
              <span>{isFr ? 'Discipline remarquable : aucun écart majeur recensé sur cette sélection.' : 'Remarkable discipline: zero major breaches recorded in this selection.'}</span>
            </div>
          )}
        </div>

        {/* Psychological Impact Matrix */}
        <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
              {isFr ? 'Impact de la Psychologie sur le Résultat' : 'Psychological State vs Outcome'}
            </h3>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            {isFr ? 'Corrélations entre votre état mental et la rentabilité constatée :' : 'Correlation between emotional state and realized profitability :'}
          </p>

          {psychologyMatrix.length > 0 ? (
            <div className="space-y-2 pt-1">
              {psychologyMatrix.slice(0, 5).map((row, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text-primary)]">{row.tag}</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">({row.count} trades)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-secondary)]">{row.winRate}% W</span>
                    <span className={`font-bold ${row.pnl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {fmtCurrency(row.pnl)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-secondary)] italic">
              {isFr ? 'Aucun tag émotionnel renseigné sur les trades sélectionnés.' : 'No psychology tags recorded on selected trades.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
