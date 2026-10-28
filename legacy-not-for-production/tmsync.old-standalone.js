/**
 * TRADEMIND ACADEMY — CLIENT SYNC ENGINE (Browser UMD / standalone)
 * Guarantees Control 20: In DEMO mode, sync is suspended and zero demo trades are transmitted.
 */
(function() {
  'use strict';
  if (window.tmSync) return;

  var demoMode = false;
  try {
    demoMode = localStorage.getItem('tm_demo_active') === 'true';
  } catch(e) {}

  var isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  var isSyncing = false;
  var lastSyncTime = null;
  try {
    var raw = localStorage.getItem('tm_last_sync_time');
    if (raw) lastSyncTime = Number(raw);
  } catch(e) {}

  var listeners = [];
  function emit() {
    var s = getStatus();
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](s); } catch(err) {}
    }
  }

  function getStatus() {
    return {
      isOnline: isOnline,
      isSyncing: isSyncing,
      isDemoMode: demoMode,
      lastSyncTime: lastSyncTime,
      pendingCount: getQueue().length,
      lastError: window.__tmSyncLastError || null
    };
  }

  function getQueue() {
    try {
      var q = localStorage.getItem('tm_sync_queue');
      return q ? JSON.parse(q) : [];
    } catch(e) {
      return [];
    }
  }

  function setQueue(q) {
    try {
      localStorage.setItem('tm_sync_queue', JSON.stringify(q));
    } catch(e) {}
  }

  function clearPendingDemoTrades() {
    var q = getQueue();
    var clean = [];
    for (var i = 0; i < q.length; i++) {
      var item = q[i];
      if (item.type === 'save' && item.item) {
        if (!item.item.demo && item.item.mode !== 'DEMO' && !String(item.item.id).startsWith('demo-')) {
          clean.push(item);
        }
      } else if (item.type === 'delete') {
        if (!String(item.item).startsWith('demo-')) {
          clean.push(item);
        }
      }
    }
    setQueue(clean);
  }

  function setDemoMode(active) {
    demoMode = Boolean(active);
    try {
      localStorage.setItem('tm_demo_active', active ? 'true' : 'false');
    } catch(e) {}
    if (active) {
      clearPendingDemoTrades();
    }
    emit();
  }

  function queueTrade(trade) {
    if (demoMode || trade.demo === true || trade.mode === 'DEMO' || String(trade.id).startsWith('demo-')) {
      return;
    }
    var q = getQueue();
    var idx = -1;
    for (var i = 0; i < q.length; i++) {
      if (q[i].type === 'save' && q[i].item && q[i].item.id === trade.id) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) {
      q[idx] = { type: 'save', item: trade };
    } else {
      q.push({ type: 'save', item: trade });
    }
    setQueue(q);
    emit();
    if (isOnline && !demoMode) {
      sync();
    }
  }

  function queueDelete(tradeId) {
    if (demoMode || String(tradeId).startsWith('demo-')) return;
    var q = getQueue();
    var clean = [];
    for (var i = 0; i < q.length; i++) {
      if (!(q[i].type === 'save' && q[i].item && q[i].item.id === tradeId)) {
        clean.push(q[i]);
      }
    }
    clean.push({ type: 'delete', item: tradeId });
    setQueue(clean);
    emit();
    if (isOnline && !demoMode) {
      sync();
    }
  }

  var syncPromise = null;
  function sync() {
    // RULE 2 & CONTROL 20: In DEMO mode, zero network calls with demo data!
    if (demoMode) {
      return Promise.resolve({ success: true, pushedCount: 0, pulledCount: 0 });
    }
    if (!isOnline) {
      return Promise.resolve({ success: false, error: 'OFFLINE' });
    }
    if (isSyncing && syncPromise) {
      return syncPromise;
    }

    isSyncing = true;
    emit();

    syncPromise = (async function() {
      try {
        var queue = getQueue();
        var tradesToPush = [];
        var deletedIds = [];
        for (var i = 0; i < queue.length; i++) {
          var entry = queue[i];
          if (entry.type === 'save') {
            var t = entry.item;
            if (!t.demo && t.mode !== 'DEMO' && !String(t.id).startsWith('demo-')) {
              tradesToPush.push(t);
            }
          } else if (entry.type === 'delete') {
            deletedIds.push(entry.item);
          }
        }

        var settings = null;
        try {
          var s = localStorage.getItem('dtj_settings');
          if (s) settings = JSON.parse(s);
        } catch(e) {}

        var pushResult = { persistedRealCount: 0 };
        if (tradesToPush.length > 0 || deletedIds.length > 0 || settings) {
          var pushRes = await fetch('/api/sync/push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trades: tradesToPush,
              deletedTradeIds: deletedIds,
              settings: settings,
              clientMode: 'REAL'
            })
          });

          if (!pushRes.ok) {
            if (pushRes.status === 401) {
              window.__tmSyncLastError = 'SESSION_REVOKED';
              throw new Error('SESSION_REVOKED');
            }
            throw new Error('Push failed status ' + pushRes.status);
          }
          pushResult = await pushRes.json();
          setQueue([]);
        }

        var pullRes = await fetch('/api/sync/pull?since=' + encodeURIComponent(lastSyncTime || 0));
        if (!pullRes.ok) {
          if (pullRes.status === 401) {
            window.__tmSyncLastError = 'SESSION_REVOKED';
            throw new Error('SESSION_REVOKED');
          }
          throw new Error('Pull failed status ' + pullRes.status);
        }

        var pullData = await pullRes.json();
        if (pullData.trades && pullData.trades.length > 0) {
          try {
            var rawT = localStorage.getItem('dtj_trades') || '[]';
            var localTrades = JSON.parse(rawT);
            var map = {};
            for (var j = 0; j < localTrades.length; j++) map[localTrades[j].id] = localTrades[j];
            for (var k = 0; k < pullData.trades.length; k++) map[pullData.trades[k].id] = pullData.trades[k];
            if (pullData.deletedTradeIds) {
              for (var d = 0; d < pullData.deletedTradeIds.length; d++) delete map[pullData.deletedTradeIds[d]];
            }
            var list = [];
            for (var key in map) list.push(map[key]);
            localStorage.setItem('dtj_trades', JSON.stringify(list));
          } catch(e) {}
        }

        if (pullData.settings) {
          try {
            localStorage.setItem('dtj_settings', JSON.stringify(pullData.settings));
          } catch(e) {}
        }

        lastSyncTime = Date.now();
        localStorage.setItem('tm_last_sync_time', String(lastSyncTime));
        window.__tmSyncLastError = null;

        return {
          success: true,
          pushedCount: pushResult.persistedRealCount || 0,
          pulledCount: pullData.trades ? pullData.trades.length : 0
        };
      } catch(err) {
        window.__tmSyncLastError = err && err.message ? err.message : 'Sync failed';
        return { success: false, error: window.__tmSyncLastError };
      } finally {
        isSyncing = false;
        syncPromise = null;
        emit();
      }
    })();

    return syncPromise;
  }

  window.addEventListener('online', function() {
    isOnline = true;
    emit();
    if (!demoMode) sync();
  });

  window.addEventListener('offline', function() {
    isOnline = false;
    emit();
  });

  window.tmSync = {
    getStatus: getStatus,
    setDemoMode: setDemoMode,
    isDemo: function() { return demoMode; },
    queueTrade: queueTrade,
    queueDelete: queueDelete,
    sync: sync,
    subscribe: function(cb) {
      listeners.push(cb);
      cb(getStatus());
      return function() {
        var idx = listeners.indexOf(cb);
        if (idx >= 0) listeners.splice(idx, 1);
      };
    }
  };
})();
