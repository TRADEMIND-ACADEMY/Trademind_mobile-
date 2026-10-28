/**
 * TRADEMIND ACADEMY — synchronisation mobile ↔ compte (API commune du site).
 * Le noyau (tmsync-core.js) est identique à celui du site. Ce fichier ne fait que :
 *  - convertir les trades / réglages / plans mobiles vers le format commun du serveur, et inversement ;
 *  - fournir l'état local au noyau et appliquer ce que le serveur renvoie.
 * Le mode DÉMO n'est jamais envoyé : le noyau ne lit ni n'écrit rien tant que isDemo() est vrai.
 */
import './tmsync-core.js';
import { api, getToken } from '../lib/api.js';
import type { Trade, Settings } from '../types/index.js';
import type { TradingPlan } from '../types/plans.js';

const Core = (globalThis as any).TMSyncCore;

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  isDemoMode: boolean;
  lastSyncTime: number | null;
  pendingCount: number;
  lastError: string | null;
  state: string;
  conflictCount: number;
  rejectedCount: number;
}

type WireRecord = { kind: 'trade' | 'plan' | 'settings'; id: string; data: any };

export interface SyncHandlers {
  getRealTrades(): Trade[];
  getPlans(): TradingPlan[];
  getSettings(): Settings;
  applyRemote(patch: { trades: Trade[]; tradeDeletes: string[]; plans: TradingPlan[]; planDeletes: string[]; settings: Settings | null }): void;
  backupAndClear(reason: string): void;
}

const EXT_LIMIT = 7000;
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const jsonLen = (v: unknown) => JSON.stringify(v ?? null).length;

/** Ext borné : on retire d'abord les gros champs de CETTE interface, jamais les données de l'autre interface. */
function fitExt(wireExt: Record<string, any> | undefined, mobile: Record<string, any>) {
  const ext: Record<string, any> = { ...(wireExt || {}) };
  const m = { ...mobile };
  for (const k of Object.keys(m)) if (m[k] === undefined || m[k] === null || (Array.isArray(m[k]) && !m[k].length)) delete m[k];
  ext.mobile = m;
  if (jsonLen(ext) > EXT_LIMIT) { delete m.planSnapshot; }
  if (jsonLen(ext) > EXT_LIMIT) { delete m.violations; delete m.psychology; }
  if (jsonLen(ext) > EXT_LIMIT) return undefined;
  if (!Object.keys(m).length) delete ext.mobile;
  return Object.keys(ext).length ? ext : undefined;
}

export function tradeToWire(t: Trade): WireRecord {
  const data: any = {
    id: t.id,
    date: t.date,
    time: t.time || '',
    symbol: String(t.symbol || '').normalize('NFKC').trim().toUpperCase().slice(0, 24),
    direction: t.direction,
    session: t.session || '',
    setup: t.setup || '',
    result: t.result || '',
    notes: t.notes || ''
  };
  const pairs: [string, unknown][] = [['entry', t.entryPrice], ['sl', t.stopLoss], ['tp', t.takeProfit], ['size', t.size], ['risk', t.risk], ['pnl', t.pnl], ['rMultiple', t.rMultiple]];
  for (const [k, v] of pairs) { const n = num(v); if (n !== undefined) data[k] = n; }
  const ext = fitExt((t as any).wireExt, {
    planId: t.planId, planName: t.planName, planSnapshot: t.planSnapshot, score: t.score ?? undefined,
    psychology: t.psychology, guardianStatus: t.guardianStatus, violations: t.violations, createdAt: t.createdAt
  });
  if (ext) data.ext = ext;
  return { kind: 'trade', id: t.id, data };
}

export function wireToTrade(id: string, data: any, prev?: Trade): Trade {
  const m = (data.ext && data.ext.mobile) || {};
  const now = new Date().toISOString();
  return {
    id,
    date: data.date,
    time: data.time || undefined,
    symbol: data.symbol,
    direction: data.direction,
    entryPrice: num(data.entry),
    stopLoss: num(data.sl),
    takeProfit: num(data.tp),
    size: num(data.size),
    risk: num(data.risk),
    pnl: num(data.pnl),
    result: data.result || undefined,
    rMultiple: num(data.rMultiple),
    session: (data.session || undefined) as any,
    setup: data.setup || undefined,
    notes: data.notes || undefined,
    planId: m.planId ?? prev?.planId,
    planName: m.planName ?? prev?.planName,
    planSnapshot: m.planSnapshot ?? prev?.planSnapshot,
    score: m.score ?? prev?.score,
    psychology: m.psychology ?? prev?.psychology,
    guardianStatus: m.guardianStatus ?? prev?.guardianStatus,
    violations: m.violations ?? prev?.violations,
    mode: 'REAL',
    demo: false,
    createdAt: prev?.createdAt || m.createdAt || now,
    updatedAt: now,
    wireExt: data.ext
  } as Trade;
}

const SETTINGS_EXT_KEY = 'tmsync.mobile.settingsExt';
const readSettingsExt = (): Record<string, any> => { try { return JSON.parse(localStorage.getItem(SETTINGS_EXT_KEY) || '{}') || {}; } catch { return {}; } };
const writeSettingsExt = (v: Record<string, any>) => { try { localStorage.setItem(SETTINGS_EXT_KEY, JSON.stringify(v)); } catch { /* ignore */ } };

export function settingsToWire(s: Settings, activePlanId: string | undefined): WireRecord {
  const g = s.guardian || ({} as Settings['guardian']);
  const data: any = { currency: String(s.currency ?? '$').slice(0, 8), theme: s.theme, lang: s.lang };
  const bal = num(s.startingBalance); if (bal !== undefined && bal >= 0) data.startingBalance = bal;
  const guardian: Record<string, number> = {};
  const map: [string, unknown][] = [['maxRisk', g.maxRiskPerTrade], ['maxTrades', g.maxTradesPerDay], ['maxDailyLoss', g.maxDailyLoss], ['maxConsec', g.maxConsecutiveLosses], ['minRR', g.minRR]];
  for (const [k, v] of map) { const n = num(v); if (n !== undefined) guardian[k] = n; }
  data.guardian = guardian;
  const ext = { ...readSettingsExt() };
  if (activePlanId) ext.mobile = { ...(ext.mobile || {}), activePlanId };
  if (Object.keys(ext).length) data.ext = ext;
  return { kind: 'settings', id: 'main', data };
}

export function wireToSettings(data: any, cur: Settings): { settings: Settings; activePlanId?: string } {
  const g = data.guardian || {};
  const settings: Settings = {
    ...cur,
    currency: typeof data.currency === 'string' && data.currency ? data.currency : cur.currency,
    theme: data.theme || cur.theme,
    lang: data.lang || cur.lang,
    startingBalance: num(data.startingBalance) ?? cur.startingBalance,
    guardian: {
      maxRiskPerTrade: num(g.maxRisk) ?? cur.guardian.maxRiskPerTrade,
      maxTradesPerDay: num(g.maxTrades) ?? cur.guardian.maxTradesPerDay,
      maxDailyLoss: num(g.maxDailyLoss) ?? cur.guardian.maxDailyLoss,
      maxConsecutiveLosses: num(g.maxConsec) ?? cur.guardian.maxConsecutiveLosses,
      minRR: num(g.minRR) ?? cur.guardian.minRR
    }
  };
  if (data.ext) writeSettingsExt(data.ext);
  return { settings, activePlanId: data.ext?.mobile?.activePlanId };
}

export function planToWire(p: TradingPlan): WireRecord {
  const { isActive, updatedAt, ...rest } = p as any;
  delete rest.seeded;
  return { kind: 'plan', id: p.id, data: { schema: 'mobile-plan-v1', name: String(p.name || '').slice(0, 80), active: false, body: JSON.parse(JSON.stringify(rest)) } };
}

type Ctx = { userId: string | null; demo: boolean };

class MobileSync {
  private handlers: SyncHandlers | null = null;
  private ctx: Ctx = { userId: null, demo: false };
  private core: any = null;
  private status: SyncStatus = { isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true, isSyncing: false, isDemoMode: false, lastSyncTime: null, pendingCount: 0, lastError: null, state: 'idle', conflictCount: 0, rejectedCount: 0 };
  private listeners: ((s: SyncStatus) => void)[] = [];
  private interval: any = null;

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', () => { this.status.isOnline = true; this.emit(); this.schedule(300); });
    window.addEventListener('offline', () => { this.status.isOnline = false; this.emit(); });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') this.schedule(500); });
  }

  private emit() { const s = this.getStatus(); this.listeners.forEach(l => { try { l(s); } catch { /* ignore */ } }); }

  attach(handlers: SyncHandlers) {
    this.handlers = handlers;
    if (this.core) return;
    this.core = Core.create({
      api: (m: string, p: string, b: unknown, signal?: AbortSignal, h?: Record<string, string>) => api(m, p, b, signal, h),
      storage: { get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } }, remove: (k: string) => { try { localStorage.removeItem(k); } catch { /* ignore */ } } },
      userId: () => (getToken() ? this.ctx.userId : null),
      isDemo: () => this.ctx.demo,
      adapter: {
        readLocal: () => {
          const h = this.handlers!;
          const plans = h.getPlans().filter((p: any) => !p.seeded && /^[A-Za-z0-9_-]{6,64}$/.test(p.id)).map(planToWire);
          const trades = h.getRealTrades().filter(t => !t.demo && t.mode !== 'DEMO' && /^[A-Za-z0-9_-]{6,64}$/.test(t.id)).map(tradeToWire);
          const active = h.getPlans().find(p => p.isActive);
          return { trades, plans, settings: settingsToWire(h.getSettings(), active?.id) };
        },
        accepts: (rec: any) => rec.kind !== 'plan' || (rec.data && rec.data.schema === 'mobile-plan-v1'),
        applyRemote: ({ upserts, deletes }: { upserts: WireRecord[]; deletes: { kind: string; id: string }[] }) => this.applyRemote(upserts, deletes),
        backupAndClear: (reason: string) => this.handlers?.backupAndClear(reason),
        onStatus: (s: any) => {
          this.status = { ...this.status, isSyncing: s.state === 'syncing', isDemoMode: s.state === 'demo' || this.ctx.demo, lastSyncTime: s.lastSyncAt || this.status.lastSyncTime, pendingCount: s.pending || 0, lastError: s.error || null, state: s.state, conflictCount: s.conflicts || 0, rejectedCount: s.rejected || 0 };
          this.emit();
        }
      }
    });
  }

  private applyRemote(upserts: WireRecord[], deletes: { kind: string; id: string }[]) {
    const h = this.handlers; if (!h) return;
    const curTrades = new Map(h.getRealTrades().map(t => [t.id, t]));
    const curPlans = new Map(h.getPlans().map(p => [p.id, p]));
    const trades: Trade[] = []; const plans: TradingPlan[] = []; let settings: Settings | null = null;
    for (const u of upserts) {
      if (u.kind === 'trade') trades.push(wireToTrade(u.id, u.data, curTrades.get(u.id)));
      else if (u.kind === 'plan' && u.data?.schema === 'mobile-plan-v1') {
        const prev = curPlans.get(u.id); const now = new Date().toISOString();
        plans.push({ ...(u.data.body as TradingPlan), id: u.id, isActive: prev?.isActive ?? false, updatedAt: now } as TradingPlan);
      } else if (u.kind === 'settings') {
        const res = wireToSettings(u.data, h.getSettings()); settings = res.settings;
        if (res.activePlanId) (settings as any).activePlanId = res.activePlanId;
      }
    }
    h.applyRemote({
      trades, tradeDeletes: deletes.filter(d => d.kind === 'trade').map(d => d.id),
      plans, planDeletes: deletes.filter(d => d.kind === 'plan').map(d => d.id), settings
    });
  }

  /** Appelé par le fournisseur quand l'utilisateur ou le mode DÉMO change. */
  setContext(ctx: Ctx) {
    const demoChanged = ctx.demo !== this.ctx.demo;
    const userChanged = ctx.userId !== this.ctx.userId;
    this.ctx = ctx; this.status.isDemoMode = ctx.demo;
    if (this.interval) { clearInterval(this.interval); this.interval = null; }
    if (!this.core) { this.emit(); return; }
    if (demoChanged) this.core.setDemoChanged();
    if (ctx.userId && !ctx.demo) {
      this.interval = setInterval(() => { if (document.visibilityState === 'visible' && this.status.isOnline) this.core.sync(); }, 90000);
      if (userChanged || demoChanged) this.core.schedule(200);
    } else if (!ctx.userId) { this.core.stop(); this.status.state = 'signedout'; }
    this.emit();
  }

  setDemoMode(active: boolean) { this.setContext({ ...this.ctx, demo: active }); }
  isDemo() { return this.ctx.demo; }
  schedule(ms?: number) { if (this.core && this.ctx.userId && !this.ctx.demo) this.core.schedule(ms); }
  async sync() { if (!this.core) return { success: false, error: 'NOT_READY' }; const r = await this.core.sync(); return { success: !!r.ok, error: r.error }; }
  noteDelete(kind: 'trade' | 'plan', id: string) { if (this.core) this.core.noteDelete(kind, id); }
  getConflicts(): any[] { return this.core ? this.core.getConflicts() : []; }
  clearConflicts() { if (this.core) this.core.clearConflicts(); }
  stop() { if (this.core) this.core.stop(); if (this.interval) { clearInterval(this.interval); this.interval = null; } }
  getStatus(): SyncStatus { return { ...this.status }; }
  subscribe(cb: (s: SyncStatus) => void) { this.listeners.push(cb); cb(this.getStatus()); return () => { this.listeners = this.listeners.filter(l => l !== cb); }; }
}

export const tmSync = new MobileSync();
