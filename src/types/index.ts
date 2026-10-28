import { TradingPlan, PlanExecutionSnapshot } from './plans.js';

export interface UserAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  city?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  tradeMindId: string;
  role: 'USER' | 'OWNER';
  plan: 'FREE' | 'PRO' | 'PRO MAX' | 'ELITE';
  emailVerified: boolean;
  phoneVerified: boolean;
  activeSessions?: number;
  monthlyTradesCount?: number;
}

export interface Trade {
  id: string;
  date: string;
  time?: string;
  symbol: string;
  direction: 'buy' | 'sell';
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  size?: number;
  risk?: number; // in %
  pnl?: number; // in currency
  result?: 'win' | 'loss' | 'be';
  rMultiple?: number;
  session?: 'London' | 'New York' | 'Asia' | 'Overlap' | 'Other';
  setup?: string;
  planId?: string;
  planName?: string;
  planSnapshot?: PlanExecutionSnapshot;
  score?: number | null;
  psychology?: string[];
  notes?: string;
  screenshot?: string;
  guardianStatus?: 'aligned' | 'warning' | 'breach';
  violations?: string[];
  mode: 'REAL' | 'DEMO';
  demo?: boolean;
  createdAt?: string;
  updatedAt?: string;
  /** Données de l'autre interface (site) conservées telles quelles pour la synchronisation ; jamais affichées. */
  wireExt?: Record<string, any>;
}

export interface Settings {
  startingBalance: number;
  currency: string;
  theme: 'night' | 'day' | 'auto';
  lang: 'fr' | 'en';
  activePlanId?: string;
  guardian: {
    maxRiskPerTrade: number;
    maxDailyLoss: number;
    maxTradesPerDay: number;
    minRR: number;
    maxConsecutiveLosses: number;
  };
}

export interface ComputedStats {
  balance: number;
  netPnl: number;
  totalTrades: number;
  wins: number;
  losses: number;
  breakevens: number;
  winRate: number;
  profitFactor: number;
  grossProfit: number;
  grossLoss: number;
  avgWin: number;
  avgLoss: number;
  totalR: number;
  avgR: number;
  maxDrawdown: number;
  returnPct: number;
  equityCurve: { date: string; balance: number; tradeIndex: number }[];
}
