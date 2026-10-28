/**
 * TRADEMIND ACADEMY — SERVER SYNC ENGINE
 * Authoritative Synchronization Engine with strict DEMO Mode Isolation.
 * Enforces Control 20 (zero demo trades stored or received),
 * Control 26 (settings sync), Control 27 (revoked sessions), and Control 28 (clean error handling).
 */

import { db } from './db.js';

export class ServerSyncEngine {
  /**
   * Validate session and user access. Enforces Control 27 (revocation check).
   */
  static authenticateRequest(req) {
    const authHeader = req.headers.authorization || '';
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else if (req.headers['x-session-token']) {
      token = String(req.headers['x-session-token']).trim();
    } else if (req.cookies && req.cookies.tm_session) {
      token = req.cookies.tm_session;
    }

    if (!token) {
      return { ok: false, status: 401, error: 'MISSING_SESSION_TOKEN', code: 'UNAUTHORIZED' };
    }

    const sessionData = db.getUserBySessionToken(token);
    if (!sessionData) {
      // Session does not exist or has been revoked (Control 27)
      return { ok: false, status: 401, error: 'SESSION_REVOKED', code: 'UNAUTHORIZED' };
    }

    const { user, session } = sessionData;
    if (session.revoked) {
      return { ok: false, status: 401, error: 'SESSION_REVOKED', code: 'UNAUTHORIZED' };
    }

    return { ok: true, user, session };
  }

  /**
   * Handle sync pull: returns changes since client's lastSyncTimestamp.
   */
  static handlePull(userId, lastSyncTimestamp = 0) {
    const allTrades = db.getUserTrades(userId);
    const tombstones = db.getTombstones(userId);
    const settings = db.getUserSettings(userId);

    const sinceDate = lastSyncTimestamp ? new Date(lastSyncTimestamp) : new Date(0);

    // Filter trades updated since lastSync
    const updatedTrades = allTrades.filter(t => {
      // NEVER include demo trades on server pull
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

  /**
   * Handle sync push: receives trades, deletions, and settings from client.
   * STRICT ENFORCEMENT OF RULE 2 & CONTROL 20: Zero demo trades are persisted.
   */
  static handlePush(userId, payload) {
    const { trades = [], deletedTradeIds = [], settings = null, clientMode = 'REAL' } = payload;

    // RULE 1 & 2 & CONTROL 20:
    // If client is in DEMO mode, reject trades outright or neutralize them.
    // Additionally, filter out ANY trade that carries demo indicators!
    let rejectedDemoCount = 0;
    const realTradesToSave = [];

    for (const trade of trades) {
      if (!trade || typeof trade !== 'object') continue;

      const isDemo =
        clientMode === 'DEMO' ||
        trade.demo === true ||
        trade.mode === 'DEMO' ||
        String(trade.id || '').startsWith('demo-') ||
        trade.synthetic === true;

      if (isDemo) {
        rejectedDemoCount++;
        // CRITICAL CONTROL 20: Skip trade, DO NOT STORE IT IN DATABASE!
        continue;
      }

      // Real trade validation
      if (!trade.id) {
        continue;
      }

      realTradesToSave.push({
        ...trade,
        userId,
        demo: false,
        mode: 'REAL',
        updatedAt: trade.updatedAt || new Date().toISOString()
      });
    }

    // Merge real trades into database
    const existingTrades = db.getUserTrades(userId);
    const tradeMap = new Map();
    for (const t of existingTrades) {
      tradeMap.set(t.id, t);
    }

    // Apply deletions
    for (const id of deletedTradeIds) {
      if (tradeMap.has(id)) {
        tradeMap.delete(id);
        db.addTombstone(userId, id);
      }
    }

    // Apply real trade updates
    for (const t of realTradesToSave) {
      tradeMap.set(t.id, t);
    }

    const finalTradeList = Array.from(tradeMap.values());
    db.setUserTrades(userId, finalTradeList);

    // Synchronize settings if provided (Control 26)
    let savedSettings = null;
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
