/**
 * TRADEMIND ACADEMY — SERVER SYNC ENGINE (TypeScript)
 */

import { db, TradeRecord, UserSettings, User } from './db.js';
import type { Request } from 'express';

export class ServerSyncEngine {
  static authenticateRequest(req: Request):
    | { ok: true; user: User; session: User['sessions'][0] }
    | { ok: false; status: number; error: string; code: 'UNAUTHORIZED' } {
    const authHeader = req.headers.authorization || '';
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else if (req.headers['x-session-token']) {
      token = String(req.headers['x-session-token']).trim();
    } else if ((req as any).cookies && (req as any).cookies.tm_session) {
      token = (req as any).cookies.tm_session;
    }

    if (!token) {
      return { ok: false, status: 401, error: 'MISSING_SESSION_TOKEN', code: 'UNAUTHORIZED' as const };
    }

    const sessionData = db.getUserBySessionToken(token);
    if (!sessionData) {
      // Session does not exist or has been revoked (Control 27)
      return { ok: false, status: 401, error: 'SESSION_REVOKED', code: 'UNAUTHORIZED' as const };
    }

    const { user, session } = sessionData;
    if (session.revoked) {
      return { ok: false, status: 401, error: 'SESSION_REVOKED', code: 'UNAUTHORIZED' as const };
    }

    return { ok: true, user, session };
  }

  static handlePull(userId: string, lastSyncTimestamp: number = 0) {
    const allTrades = db.getUserTrades(userId);
    const tombstones = db.getTombstones(userId);
    const settings = db.getUserSettings(userId);

    const sinceDate = lastSyncTimestamp ? new Date(lastSyncTimestamp) : new Date(0);

    const updatedTrades = allTrades.filter(t => {
      // Rule 2 & Control 20: NEVER include demo trades on server pull
      if (t.demo === true || t.mode === 'DEMO') return false;
      const tDate = new Date(t.updatedAt || t.createdAt);
      return tDate > sinceDate;
    });

    const deletedIds = tombstones
      .filter(t => new Date(t.deletedAt) > sinceDate)
      .map(t => t.id);

    const settingsUpdated = new Date(settings.updatedAt) > sinceDate ? settings : null;

    return {
      success: true,
      serverTimestamp: new Date().toISOString(),
      trades: updatedTrades,
      deletedTradeIds: deletedIds,
      settings: settingsUpdated
    };
  }

  static handlePush(userId: string, payload: {
    trades?: Partial<TradeRecord>[];
    deletedTradeIds?: string[];
    settings?: Partial<UserSettings> | null;
    clientMode?: 'REAL' | 'DEMO';
  }) {
    const { trades = [], deletedTradeIds = [], settings = null, clientMode = 'REAL' } = payload;

    // RULE 1 & 2 & CONTROL 20:
    // If client is in DEMO mode or trade is demo, zero demo trades are accepted or persisted!
    let rejectedDemoCount = 0;
    const realTradesToSave: TradeRecord[] = [];

    for (const trade of trades) {
      if (!trade || typeof trade !== 'object') continue;

      const isDemo =
        clientMode === 'DEMO' ||
        trade.demo === true ||
        trade.mode === 'DEMO' ||
        String(trade.id || '').startsWith('demo-');

      if (isDemo) {
        rejectedDemoCount++;
        // CRITICAL CONTROL 20: Drop demo trade, DO NOT STORE ON SERVER!
        continue;
      }

      if (!trade.id || !trade.symbol) {
        continue;
      }

      realTradesToSave.push({
        id: trade.id,
        userId,
        date: trade.date || new Date().toISOString().split('T')[0],
        time: trade.time,
        symbol: trade.symbol,
        direction: trade.direction || 'buy',
        entryPrice: trade.entryPrice,
        stopLoss: trade.stopLoss,
        takeProfit: trade.takeProfit,
        size: trade.size,
        risk: trade.risk,
        pnl: trade.pnl,
        result: trade.result,
        rMultiple: trade.rMultiple,
        session: trade.session,
        setup: trade.setup,
        planId: trade.planId,
        planName: trade.planName,
        planSnapshot: trade.planSnapshot,
        score: trade.score,
        psychology: trade.psychology,
        notes: trade.notes,
        guardianStatus: trade.guardianStatus,
        violations: trade.violations,
        mode: 'REAL',
        demo: false,
        createdAt: trade.createdAt || new Date().toISOString(),
        updatedAt: trade.updatedAt || new Date().toISOString()
      });
    }

    const existingTrades = db.getUserTrades(userId);
    const tradeMap = new Map<string, TradeRecord>();
    for (const t of existingTrades) {
      tradeMap.set(t.id, t);
    }

    for (const id of deletedTradeIds) {
      if (tradeMap.has(id)) {
        tradeMap.delete(id);
        db.addTombstone(userId, id);
      }
    }

    for (const t of realTradesToSave) {
      tradeMap.set(t.id, t);
    }

    const finalTradeList = Array.from(tradeMap.values());
    db.setUserTrades(userId, finalTradeList);

    let savedSettings: UserSettings | null = null;
    if (settings && typeof settings === 'object') {
      savedSettings = db.saveUserSettings(userId, settings);
    }

    return {
      success: true,
      serverTimestamp: new Date().toISOString(),
      persistedRealCount: realTradesToSave.length,
      rejectedDemoTrades: rejectedDemoCount,
      totalServerTradesCount: finalTradeList.length,
      settingsSynchronized: Boolean(savedSettings)
    };
  }
}
