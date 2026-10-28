import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext.js';
import { Trade } from '../types/index.js';
import { Plus, Download, Upload, Search, Trash2, Edit3, Copy, AlertOctagon, ArrowUpRight, ArrowDownRight, List, Calendar as CalendarIcon, Grid3X3 } from 'lucide-react';
import { CalendarView } from './CalendarView.js';
import { MatrixView } from './MatrixView.js';

interface JournalViewProps {
  onOpenNewTrade: () => void;
  onEditTrade: (trade: Trade) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ onOpenNewTrade, onEditTrade }) => {
  const { trades, deleteTrade, addTrade, settings, exportCsv, importCsv, isDemoMode } = useTrading();
  const isFr = settings.lang === 'fr';

  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'matrix'>('list');
  const [search, setSearch] = useState('');
  const [filterResult, setFilterResult] = useState<string>('all');
  const [filterDirection, setFilterDirection] = useState<string>('all');
  const [filterSession, setFilterSession] = useState<string>('all');
  const [selectedTradeForDetail, setSelectedTradeForDetail] = useState<Trade | null>(null);

  const fmtCurrency = (n: number) => {
    const cur = settings.currency;
    const sign = n < 0 ? '-' : n > 0 ? '+' : '';
    return `${sign}${cur}${Math.abs(n).toLocaleString(isFr ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      if (search && !t.symbol.toLowerCase().includes(search.toLowerCase()) && !(t.notes || '').toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filterResult !== 'all' && t.result !== filterResult) return false;
      if (filterDirection !== 'all' && t.direction !== filterDirection) return false;
      if (filterSession !== 'all' && t.session !== filterSession) return false;
      return true;
    });
  }, [trades, search, filterResult, filterDirection, filterSession]);

  const handleDelete = async (trade: Trade) => {
    if (window.confirm(isFr ? `Supprimer définitivement le trade sur ${trade.symbol} (${trade.date}) ?` : `Permanently delete trade on ${trade.symbol} (${trade.date})?`)) {
      await deleteTrade(trade.id);
      if (selectedTradeForDetail?.id === trade.id) {
        setSelectedTradeForDetail(null);
      }
    }
  };

  const handleDuplicate = async (trade: Trade) => {
    const { id, ...rest } = trade;
    await addTrade({
      ...rest,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: `${trade.notes ? trade.notes + ' ' : ''}(Copie)`
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await importCsv(file);
      if (res.success) {
        alert(isFr ? `${res.importedCount} trades importés avec succès.` : `${res.importedCount} trades imported successfully.`);
      } else {
        alert(res.error || 'Erreur lors de l import');
      }
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-5 pb-24 md:pb-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">
            {isFr ? 'Journal de Trading' : 'Trading Journal'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            {filteredTrades.length} / {trades.length} {isFr ? 'décisions enregistrées' : 'decisions recorded'}
            {isDemoMode && ` · (${isFr ? 'Données fictives en mémoire' : 'Synthetic memory data'})`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Sub-view switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-[var(--accent)] text-[#04110f] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{isFr ? 'Liste' : 'List'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-[var(--accent)] text-[#04110f] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{isFr ? 'Calendrier' : 'Calendar'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-[var(--accent)] text-[#04110f] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Matrice' : 'Matrix'}</span>
            </button>
          </div>

          {/* CSV Import */}
          <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* CSV Export */}
          <button
            onClick={exportCsv}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add Trade */}
          <button
            onClick={onOpenNewTrade}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold shadow-lg shadow-[var(--accent)]/15 hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isFr ? 'Ajouter un Trade' : 'Add Trade'}</span>
          </button>
        </div>
      </div>

      {/* Conditional View Rendering */}
      {viewMode === 'calendar' && (
        <CalendarView onEditTrade={onEditTrade} />
      )}

      {viewMode === 'matrix' && (
        <MatrixView />
      )}

      {viewMode === 'list' && (
        <>

      {/* Filters Bar */}
      <div className="p-3.5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isFr ? 'Rechercher par actif, setup, notes...' : 'Search asset, setup, notes...'}
            className="w-full pl-9 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={filterResult}
            onChange={e => setFilterResult(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="all">{isFr ? 'Tous résultats' : 'All results'}</option>
            <option value="win">Win (+)</option>
            <option value="loss">Loss (-)</option>
            <option value="be">BE (0)</option>
          </select>

          <select
            value={filterDirection}
            onChange={e => setFilterDirection(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="all">{isFr ? 'Toutes directions' : 'All directions'}</option>
            <option value="buy">BUY (Long)</option>
            <option value="sell">SELL (Short)</option>
          </select>

          <select
            value={filterSession}
            onChange={e => setFilterSession(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="all">{isFr ? 'Toutes sessions' : 'All sessions'}</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Asia">Asia</option>
          </select>
        </div>
      </div>

      {/* Trades List / Table */}
      {filteredTrades.length > 0 ? (
        <div className="space-y-3">
          {filteredTrades.map(trade => {
            const hasBreach = trade.guardianStatus === 'breach' || (trade.violations && trade.violations.length > 0);
            return (
              <div
                key={trade.id}
                className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-white/20 transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Direction, Symbol, Meta */}
                <div className="flex items-start gap-3 w-full sm:w-auto">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      trade.direction === 'buy' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {trade.direction === 'buy' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-base text-[var(--text-primary)]">{trade.symbol}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-white/5 text-[var(--text-secondary)]">
                        {trade.session || 'London'}
                      </span>
                      {hasBreach && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <AlertOctagon className="w-3 h-3" />
                          <span>BREACH</span>
                        </span>
                      )}
                      {trade.score != null && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                          {trade.score}% SCORE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)] flex-wrap">
                      <span>{trade.date}</span>
                      {trade.time && <span>· {trade.time}</span>}
                      <span>· {trade.planName || trade.setup || 'Standard Plan'}</span>
                      {trade.rMultiple != null && (
                        <span className="font-mono font-semibold text-[var(--text-primary)]">
                          · {trade.rMultiple >= 0 ? '+' : ''}{trade.rMultiple}R
                        </span>
                      )}
                    </div>

                    {/* Psychology tags */}
                    {trade.psychology && trade.psychology.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        {trade.psychology.map((tag, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-[var(--text-secondary)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: P&L + Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[var(--border)]">
                  <div className="text-left sm:text-right">
                    <div className={`font-mono font-bold text-base sm:text-lg ${Number(trade.pnl || 0) >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {fmtCurrency(Number(trade.pnl || 0))}
                    </div>
                    <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                      {trade.risk ? `${trade.risk}% ${isFr ? 'risque' : 'risk'}` : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(trade)}
                      type="button"
                      className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                      title={isFr ? 'Dupliquer' : 'Duplicate'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditTrade(trade)}
                      type="button"
                      className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                      title={isFr ? 'Modifier' : 'Edit'}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trade)}
                      type="button"
                      className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title={isFr ? 'Supprimer' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-3">
          <p className="text-sm text-[var(--text-secondary)]">
            {isFr ? 'Aucun trade ne correspond à vos filtres.' : 'No trades found matching your filters.'}
          </p>
          <button
            onClick={onOpenNewTrade}
            type="button"
            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[#04110f] text-xs font-bold shadow-md hover:opacity-95"
          >
            {isFr ? 'Enregistrer un nouveau trade' : 'Record a new trade'}
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
};
