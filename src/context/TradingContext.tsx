import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext.js';
import { api } from '../lib/api.js';
import { Trade, Settings, ComputedStats } from '../types/index.js';
import { TradingPlan } from '../types/plans.js';
import { STRATEGY_TEMPLATES, createPlanFromTemplate } from '../lib/plans.js';
import { tmSync, SyncStatus } from '../sync/tmsync.js';

interface TradingContextType {
  trades: Trade[];
  isDemoMode: boolean;
  setDemoMode: (isDemo: boolean) => void;
  addTrade: (trade: Omit<Trade, 'id' | 'mode'>) => Promise<{ success: boolean; error?: string }>;
  updateTrade: (id: string, trade: Partial<Trade>) => Promise<{ success: boolean; error?: string }>;
  deleteTrade: (id: string) => Promise<{ success: boolean; error?: string }>;
  plans: TradingPlan[];
  activePlan: TradingPlan | null;
  setActivePlanId: (id: string) => void;
  savePlan: (plan: TradingPlan) => void;
  deletePlan: (id: string) => void;
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  stats: ComputedStats;
  syncStatus: SyncStatus;
  triggerManualSync: () => Promise<void>;
  resetDemoData: () => void;
  exportCsv: () => void;
  importCsv: (file: File) => Promise<{ success: boolean; importedCount: number; error?: string }>;
}

const DEFAULT_SETTINGS: Settings = {
  startingBalance: 10000,
  currency: '$',
  theme: 'night',
  lang: 'fr',
  guardian: {
    maxRiskPerTrade: 1.0,
    maxDailyLoss: 3.0,
    maxTradesPerDay: 5,
    minRR: 1.5,
    maxConsecutiveLosses: 3
  }
};

import { EXACT_40_DEMO_TRADES } from '../data/demoTrades.js';

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tm_demo_active') === 'true';
    } catch {
      return false;
    }
  });

  const [realTrades, setRealTrades] = useState<Trade[]>(() => {
    try {
      const raw = localStorage.getItem('dtj_trades');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [demoTrades, setDemoTrades] = useState<Trade[]>(() => {
    try {
      const raw = localStorage.getItem('tm_demo_trades');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length >= 40) {
          return parsed;
        }
      }
      localStorage.setItem('tm_demo_trades', JSON.stringify(EXACT_40_DEMO_TRADES));
      return EXACT_40_DEMO_TRADES;
    } catch {
      return EXACT_40_DEMO_TRADES;
    }
  });

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem('dtj_settings');
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [plans, setPlans] = useState<TradingPlan[]>(() => {
    try {
      const raw = localStorage.getItem('tm_user_plans');
      if (raw) return JSON.parse(raw);
    } catch {}
    // Seed initial plans from templates
    const p1 = createPlanFromTemplate('sr', 'Support & Résistance');
    const p2 = createPlanFromTemplate('smc', 'Smart Money Concepts (SMC)');
    const p3 = createPlanFromTemplate('trend', 'Suivi de Tendance & MAs');
    p1.isActive = true;
    p2.isActive = false;
    p3.isActive = false;
    // Modèles créés automatiquement : non synchronisés tant que l'utilisateur ne les modifie pas (évite les doublons entre appareils).
    p1.seeded = true; p2.seeded = true; p3.seeded = true;
    return [p1, p2, p3];
  });

  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(tmSync.getStatus());

  // Références vers l'état courant : le moteur de synchro lit toujours les données à jour (jamais une copie périmée).
  const realTradesRef = useRef<Trade[]>(realTrades);
  const plansRef = useRef<TradingPlan[]>(plans);
  const settingsRef = useRef<Settings>(settings);
  realTradesRef.current = realTrades;
  plansRef.current = plans;
  settingsRef.current = settings;

  // Branche le moteur de synchro sur l'état React (lecture à jour + application des données distantes).
  useEffect(() => {
    tmSync.attach({
      getRealTrades: () => realTradesRef.current,
      getPlans: () => plansRef.current,
      getSettings: () => settingsRef.current,
      applyRemote: ({ trades, tradeDeletes, plans: remotePlans, planDeletes, settings: remoteSettings }) => {
        if (trades.length || tradeDeletes.length) {
          setRealTrades(prev => {
            const map = new Map(prev.map(t => [t.id, t]));
            for (const id of tradeDeletes) map.delete(id);
            for (const t of trades) map.set(t.id, t);
            return (Array.from(map.values()) as Trade[]).sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || '')));
          });
        }
        if (remotePlans.length || planDeletes.length) {
          setPlans(prev => {
            let next = prev.filter(p => !planDeletes.includes(p.id));
            // Des plans existent sur le compte : les modèles automatiques jamais modifiés de cet appareil sont retirés.
            if (remotePlans.length) next = next.filter(p => !p.seeded);
            const map = new Map(next.map(p => [p.id, p]));
            for (const p of remotePlans) map.set(p.id, p);
            next = Array.from(map.values());
            if (next.length && !next.some(p => p.isActive)) next[0] = { ...next[0], isActive: true };
            try { localStorage.setItem('tm_user_plans', JSON.stringify(next)); } catch { /* ignore */ }
            return next;
          });
        }
        if (remoteSettings) {
          const { activePlanId, ...rest } = remoteSettings as Settings & { activePlanId?: string };
          setSettings(rest as Settings);
          try { localStorage.setItem('dtj_settings', JSON.stringify(rest)); } catch { /* ignore */ }
          if (activePlanId) {
            setPlans(prev => {
              if (!prev.some(p => p.id === activePlanId)) return prev;
              const next = prev.map(p => ({ ...p, isActive: p.id === activePlanId }));
              try { localStorage.setItem('tm_user_plans', JSON.stringify(next)); } catch { /* ignore */ }
              return next;
            });
          }
        }
      },
      backupAndClear: (reason: string) => {
        // Un autre compte se connecte sur cet appareil : les données locales de l'ancien compte sont sauvegardées, jamais envoyées au nouveau.
        try {
          localStorage.setItem(`tm_backup_${Date.now()}`, JSON.stringify({
            reason,
            trades: realTradesRef.current,
            plans: plansRef.current,
            settings: settingsRef.current
          }));
        } catch { /* quota de stockage : on continue sans copie */ }
        setRealTrades([]);
        setSettings(DEFAULT_SETTINGS);
        const p1 = createPlanFromTemplate('sr', 'Support & Résistance');
        const p2 = createPlanFromTemplate('smc', 'Smart Money Concepts (SMC)');
        const p3 = createPlanFromTemplate('trend', 'Suivi de Tendance & MAs');
        p1.isActive = true; p2.isActive = false; p3.isActive = false;
        p1.seeded = true; p2.seeded = true; p3.seeded = true;
        setPlans([p1, p2, p3]);
        try {
          localStorage.setItem('dtj_trades', '[]');
          localStorage.removeItem('dtj_settings');
          localStorage.removeItem('tmsync.mobile.settingsExt');
        } catch { /* ignore */ }
      }
    });
  }, []);

  // Contexte de synchro : compte connecté + mode DÉMO (en DÉMO, rien n'est lu, envoyé ni appliqué).
  useEffect(() => {
    tmSync.setContext({ userId: user?.id || null, demo: isDemoMode });
  }, [user?.id, isDemoMode]);

  // Toute modification locale déclenche une synchro différée (le moteur détecte lui-même ce qui a changé).
  useEffect(() => {
    if (!isDemoMode && user) tmSync.schedule(1500);
  }, [realTrades, plans, settings, isDemoMode, user?.id]);

  // Listen to sync engine
  useEffect(() => {
    const unsubscribe = tmSync.subscribe(status => {
      setSyncStatus(status);
    });
    return unsubscribe;
  }, []);

  // Sync mode changes with tmsync
  const setDemoMode = (active: boolean) => {
    setIsDemoState(active);
    tmSync.setDemoMode(active);
    try {
      localStorage.setItem('tm_demo_active', active ? 'true' : 'false');
    } catch {}
  };

  // Active plan
  const activePlan = useMemo(() => {
    return plans.find(p => p.isActive) || plans[0] || null;
  }, [plans]);

  const setActivePlanId = (id: string) => {
    setPlans(prev => {
      const updated = prev.map(p => ({ ...p, isActive: p.id === id }));
      try {
        localStorage.setItem('tm_user_plans', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const savePlan = (plan: TradingPlan) => {
    setPlans(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      let updated: TradingPlan[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = { ...plan, seeded: undefined, version: plan.version + 1, updatedAt: new Date().toISOString() };
      } else {
        updated = [...prev, { ...plan, seeded: undefined, version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
      }
      try {
        localStorage.setItem('tm_user_plans', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deletePlan = (id: string) => {
    tmSync.noteDelete('plan', id);
    setPlans(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (updated.length > 0 && !updated.some(p => p.isActive)) {
        updated[0].isActive = true;
      }
      try {
        localStorage.setItem('tm_user_plans', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Update theme & language DOM attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme === 'auto' ? 'night' : settings.theme);
    document.documentElement.lang = settings.lang;
  }, [settings.theme, settings.lang]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('dtj_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Save trades to storage
  useEffect(() => {
    try {
      localStorage.setItem('dtj_trades', JSON.stringify(realTrades));
    } catch {}
  }, [realTrades]);

  useEffect(() => {
    try {
      localStorage.setItem('tm_demo_trades', JSON.stringify(demoTrades));
    } catch {}
  }, [demoTrades]);

  // Active trades based on DEMO vs REAL mode
  const currentTrades = isDemoMode ? demoTrades : realTrades;

  // Add trade
  const addTrade = async (tradeData: Omit<Trade, 'id' | 'mode'>): Promise<{ success: boolean; error?: string }> => {
    const tradeId = (isDemoMode ? 'demo-' : 'tr_') + Math.random().toString(36).slice(2, 10);
    const newTrade: Trade = {
      ...tradeData,
      id: tradeId,
      mode: isDemoMode ? 'DEMO' : 'REAL',
      demo: isDemoMode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isDemoMode) {
      // RULE 2 & CONTROL 20: Add ONLY to memory/demo storage, NEVER queue or send to server!
      setDemoTrades(prev => [newTrade, ...prev]);
      return { success: true };
    }

    // REAL MODE: Check monthly quota server-side
    try {
      const res = await api('POST', '/api/trades/record', { tradeId });
      if (res.status === 403 && res.json?.code === 'TRADE_LIMIT_REACHED') {
        return { success: false, error: 'Quota mensuel atteint. Veuillez passer à un plan supérieur.' };
      }
    } catch {
      // Hors ligne : le trade est gardé localement ; le serveur applique le quota à la synchronisation.
    }

    setRealTrades(prev => [newTrade, ...prev]);
    return { success: true };
  };

  // Update trade
  const updateTrade = async (id: string, updates: Partial<Trade>): Promise<{ success: boolean; error?: string }> => {
    if (isDemoMode) {
      setDemoTrades(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
      return { success: true };
    }

    setRealTrades(prev => prev.map(t => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)));
    return { success: true };
  };

  // Delete trade
  const deleteTrade = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (isDemoMode) {
      setDemoTrades(prev => prev.filter(t => t.id !== id));
      return { success: true };
    }

    setRealTrades(prev => prev.filter(t => t.id !== id));
    tmSync.noteDelete('trade', id);
    return { success: true };
  };

  const resetDemoData = () => {
    setDemoTrades(EXACT_40_DEMO_TRADES);
    try {
      localStorage.setItem('tm_demo_trades', JSON.stringify(EXACT_40_DEMO_TRADES));
    } catch {}
  };

  const triggerManualSync = async () => {
    if (isDemoMode) return;
    await tmSync.sync();
  };

  // CSV Export
  const exportCsv = () => {
    const list = currentTrades;
    if (list.length === 0) return;

    const headers = ['ID', 'Date', 'Time', 'Symbol', 'Direction', 'EntryPrice', 'StopLoss', 'TakeProfit', 'Size', 'Risk%', 'PnL', 'Result', 'RMultiple', 'Session', 'Setup', 'Plan', 'Score', 'GuardianStatus', 'Notes'];
    const rows = list.map(t => [
      t.id,
      t.date,
      t.time || '',
      t.symbol,
      t.direction,
      t.entryPrice || '',
      t.stopLoss || '',
      t.takeProfit || '',
      t.size || '',
      t.risk || '',
      t.pnl || '',
      t.result || '',
      t.rMultiple || '',
      t.session || '',
      t.setup || '',
      t.planName || '',
      t.score || '',
      t.guardianStatus || '',
      (t.notes || '').replace(/"/g, '""')
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trademind_${isDemoMode ? 'demo' : 'real'}_trades_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const importCsv = async (file: File): Promise<{ success: boolean; importedCount: number; error?: string }> => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length < 2) return { success: false, importedCount: 0, error: 'Fichier CSV vide' };

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      const imported: Trade[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
        const row: any = {};
        headers.forEach((h, idx) => {
          row[h] = cols[idx];
        });

        const symbol = row.symbol || row.actif || row.pair;
        if (!symbol) continue;

        const trade: Trade = {
          id: (isDemoMode ? 'demo-imp-' : 'tr_imp_') + Math.random().toString(36).slice(2, 10),
          symbol: symbol.toUpperCase(),
          date: row.date || new Date().toISOString().split('T')[0],
          direction: (row.direction || 'buy').toLowerCase() === 'sell' ? 'sell' : 'buy',
          entryPrice: Number(row.entryprice || row.entry) || undefined,
          stopLoss: Number(row.stoploss || row.sl) || undefined,
          takeProfit: Number(row.takeprofit || row.tp) || undefined,
          pnl: Number(row.pnl || row.profit) || 0,
          risk: Number(row.risk) || 1,
          result: row.result ? (row.result.toLowerCase() as any) : ((Number(row.pnl) > 0) ? 'win' : (Number(row.pnl) < 0) ? 'loss' : 'be'),
          rMultiple: Number(row.rmultiple || row.r) || 0,
          session: row.session || 'London',
          setup: row.setup || 'Breakout',
          planName: row.plan || 'Custom Plan',
          mode: isDemoMode ? 'DEMO' : 'REAL',
          demo: isDemoMode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        imported.push(trade);
      }

      if (isDemoMode) {
        setDemoTrades(prev => [...imported, ...prev]);
      } else {
        setRealTrades(prev => [...imported, ...prev]);
      }

      return { success: true, importedCount: imported.length };
    } catch (e: any) {
      return { success: false, importedCount: 0, error: e.message };
    }
  };

  // Compute stats on active trades
  const stats = useMemo<ComputedStats>(() => {
    const list = currentTrades;
    let balance = settings.startingBalance;
    let netPnl = 0;
    let wins = 0;
    let losses = 0;
    let breakevens = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let totalR = 0;

    const equityCurve: { date: string; balance: number; tradeIndex: number }[] = [
      { date: 'Initial', balance, tradeIndex: 0 }
    ];

    let peakBalance = balance;
    let maxDrawdown = 0;

    // Chronological order for equity curve
    const sorted = [...list].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach((t, i) => {
      const pnl = Number(t.pnl || 0);
      netPnl += pnl;
      balance += pnl;

      if (pnl > 0) {
        wins++;
        grossProfit += pnl;
      } else if (pnl < 0) {
        losses++;
        grossLoss += Math.abs(pnl);
      } else {
        breakevens++;
      }

      totalR += Number(t.rMultiple || 0);

      if (balance > peakBalance) peakBalance = balance;
      const dd = peakBalance > 0 ? ((peakBalance - balance) / peakBalance) * 100 : 0;
      if (dd > maxDrawdown) maxDrawdown = dd;

      equityCurve.push({
        date: t.date,
        balance,
        tradeIndex: i + 1
      });
    });

    const totalTrades = list.length;
    const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
    const profitFactor = grossLoss > 0 ? Number((grossProfit / grossLoss).toFixed(2)) : grossProfit > 0 ? 99.9 : 0;
    const avgWin = wins > 0 ? Number((grossProfit / wins).toFixed(2)) : 0;
    const avgLoss = losses > 0 ? Number((grossLoss / losses).toFixed(2)) : 0;
    const avgR = totalTrades > 0 ? Number((totalR / totalTrades).toFixed(2)) : 0;
    const returnPct = settings.startingBalance > 0 ? Number(((netPnl / settings.startingBalance) * 100).toFixed(2)) : 0;

    return {
      balance,
      netPnl,
      totalTrades,
      wins,
      losses,
      breakevens,
      winRate,
      profitFactor,
      grossProfit,
      grossLoss,
      avgWin,
      avgLoss,
      totalR: Number(totalR.toFixed(2)),
      avgR,
      maxDrawdown: Number(maxDrawdown.toFixed(2)),
      returnPct,
      equityCurve
    };
  }, [currentTrades, settings.startingBalance]);

  return (
    <TradingContext.Provider
      value={{
        trades: currentTrades,
        isDemoMode,
        setDemoMode,
        addTrade,
        updateTrade,
        deleteTrade,
        plans,
        activePlan,
        setActivePlanId,
        savePlan,
        deletePlan,
        settings,
        updateSettings,
        stats,
        syncStatus,
        triggerManualSync,
        resetDemoData,
        exportCsv,
        importCsv
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) throw new Error('useTrading must be used within a TradingProvider');
  return context;
};
