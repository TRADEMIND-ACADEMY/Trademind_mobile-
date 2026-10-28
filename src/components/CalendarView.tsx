import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext.js';
import { Trade } from '../types/index.js';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const CalendarView: React.FC<{ onEditTrade?: (trade: Trade) => void }> = ({ onEditTrade }) => {
  const { trades, settings } = useTrading();
  const isFr = settings.lang === 'fr';

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayTrades, setSelectedDayTrades] = useState<{ date: string; trades: Trade[] } | null>(null);

  const fmtCurrency = (n: number) => {
    const cur = settings.currency;
    const sign = n < 0 ? '-' : n > 0 ? '+' : '';
    return `${sign}${cur}${Math.abs(n).toLocaleString(isFr ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days in month
  const { daysInMonth, startDayIndex } = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // 0 = Sunday, 1 = Monday, etc. Adjust for Monday start (1-indexed Monday)
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;

    return {
      daysInMonth: lastDay.getDate(),
      startDayIndex: startDay
    };
  }, [year, month]);

  // Aggregate trades by YYYY-MM-DD
  const dailyMap = useMemo(() => {
    const map: Record<string, { pnl: number; count: number; trades: Trade[] }> = {};
    trades.forEach(t => {
      const d = t.date;
      if (!map[d]) map[d] = { pnl: 0, count: 0, trades: [] };
      map[d].pnl += Number(t.pnl || 0);
      map[d].count += 1;
      map[d].trades.push(t);
    });
    return map;
  }, [trades]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNamesFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthTitle = `${(isFr ? monthNamesFr : monthNamesEn)[month]} ${year}`;

  const weekHeadersFr = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const weekHeadersEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">
            {isFr ? 'Calendrier de Trading' : 'Trading Calendar'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            {isFr ? 'Vue journalière des résultats et de la consistance.' : 'Daily overview of results and consistency.'}
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-display font-bold text-sm sm:text-base px-3 text-[var(--text-primary)] min-w-[140px] text-center">
            {monthTitle}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-lg">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-[11px] font-mono font-bold text-[var(--text-secondary)] uppercase">
          {(isFr ? weekHeadersFr : weekHeadersEn).map(day => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty spacer cells before startDayIndex */}
          {Array.from({ length: startDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 sm:h-24 rounded-xl bg-white/[0.01] border border-transparent opacity-20" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const data = dailyMap[dateStr];
            const isSelected = selectedDayTrades?.date === dateStr;

            let cellBg = 'bg-[var(--surface)] hover:border-white/20';
            if (data) {
              if (data.pnl > 0) cellBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
              else if (data.pnl < 0) cellBg = 'bg-rose-500/10 border-rose-500/30 text-rose-300';
              else cellBg = 'bg-white/5 border-white/10 text-[var(--text-secondary)]';
            }

            return (
              <div
                key={dateStr}
                onClick={() => {
                  if (data && data.trades.length > 0) {
                    setSelectedDayTrades({ date: dateStr, trades: data.trades });
                  } else {
                    setSelectedDayTrades(null);
                  }
                }}
                className={`h-16 sm:h-24 p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-[var(--accent)] border-transparent' : ''
                } ${cellBg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-[var(--text-secondary)]">
                    {dayNum}
                  </span>
                  {data && (
                    <span className="text-[9px] font-mono px-1 rounded bg-black/20">
                      {data.count}t
                    </span>
                  )}
                </div>

                {data ? (
                  <div className="text-right">
                    <span className="font-mono font-bold text-[10px] sm:text-xs block leading-tight">
                      {data.pnl >= 0 ? '+' : ''}{settings.currency}{Math.abs(data.pnl).toFixed(0)}
                    </span>
                  </div>
                ) : (
                  <div className="h-3" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Trades Inspector */}
      {selectedDayTrades && (
        <div className="p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[var(--accent)]" />
              <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                {isFr ? `Trades du ${selectedDayTrades.date}` : `Trades for ${selectedDayTrades.date}`}
              </h3>
            </div>
            <button
              onClick={() => setSelectedDayTrades(null)}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              ✕
            </button>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {selectedDayTrades.trades.map(trade => (
              <div key={trade.id} className="py-2.5 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                    trade.direction === 'buy' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {trade.direction === 'buy' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  </span>
                  <div>
                    <span className="font-bold text-[var(--text-primary)]">{trade.symbol}</span>
                    <span className="text-[10px] text-[var(--text-secondary)] ml-2">{trade.session} · {trade.setup}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-secondary)]">{trade.rMultiple ? `${trade.rMultiple}R` : ''}</span>
                  <span className={`font-bold ${Number(trade.pnl || 0) >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {fmtCurrency(Number(trade.pnl || 0))}
                  </span>
                  {onEditTrade && (
                    <button
                      onClick={() => onEditTrade(trade)}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-[var(--text-secondary)]"
                    >
                      Éditer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
