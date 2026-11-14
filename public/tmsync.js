/* TRADEMIND ACADEMY : synchronisation du journal du site avec le compte (API commune site + mobile).
   Utilise tmsync-core.js (même noyau que l'application mobile). Le serveur est la source de vérité ; localStorage reste un cache.
   Mode DÉMO : aucune requête, aucun envoi (jeu de données de démonstration jamais synchronisé). */
(function () {
  "use strict";
  if (window.__tmSync || !window.TMSyncCore) return;
  var ID_RE = /^[A-Za-z0-9_-]{6,64}$/;
  var CANON = { id: 1, date: 1, time: 1, symbol: 1, direction: 1, session: 1, setup: 1, entry: 1, sl: 1, tp: 1, lot: 1, risk: 1, result: 1, pnl: 1, notes: 1, isDemo: 1 };
  var EXT_LIMIT = 7000;
  var state = function () { try { return ST; } catch (e) { return null; } };
  var lang = function () { var s = state(); var l = (s && s.settings && s.settings.lang) || (navigator.language || "en"); return String(l).slice(0, 2) === "fr" ? "fr" : "en"; };
  var tr = function (fr, en) { return lang() === "fr" ? fr : en; };
  var num = function (v) { return typeof v === "number" && isFinite(v) ? v : undefined; };
  var isDemo = function () { var s = state(); try { if (sessionStorage.getItem("tm_demo_plan")) return true; } catch (e) {} return !!(s && s.trades && s.trades.some(function (t) { return t && (t.isDemo || window.TMSyncCore.looksDemo(t)); })); };
  var accountId = function () { return (window.tmAccount && window.tmAccount.id) || null; };
  var extKey = "tmsync.web.settingsExt";
  var readExt = function () { try { return JSON.parse(localStorage.getItem(extKey) || "{}") || {}; } catch (e) { return {}; } };

  function tradeWire(t) {
    var d = { id: t.id, date: String(t.date || ""), time: t.time ? String(t.time) : "", symbol: String(t.symbol || "").toUpperCase().slice(0, 24), direction: t.direction === "sell" ? "sell" : "buy", session: t.session ? String(t.session) : "", setup: t.setup ? String(t.setup) : "", result: t.result === "win" || t.result === "loss" || t.result === "be" ? t.result : "", notes: t.notes ? String(t.notes) : "" };
    [["entry", t.entry], ["sl", t.sl], ["tp", t.tp], ["size", t.lot], ["risk", t.risk], ["pnl", t.pnl]].forEach(function (p) { var n = num(p[1]); if (n !== undefined) d[p[0]] = n; });
    var rest = {}; Object.keys(t).forEach(function (k) { if (!CANON[k] && t[k] !== undefined && typeof t[k] !== "function") rest[k] = t[k]; });
    // Valeurs par défaut ajoutées pour l'affichage (trade venu du mobile) : pas renvoyées, sinon une version parasite serait créée.
    if (Array.isArray(rest.flags) && !rest.flags.length) delete rest.flags; if (Array.isArray(rest.psyAfter) && !rest.psyAfter.length) delete rest.psyAfter;
    if (rest.smc && rest.smc.score === null && rest.smc.checks && !Object.keys(rest.smc.checks).length) delete rest.smc;
    var ext = Object.assign({}, t.__ext || {}); delete ext.web; if (Object.keys(rest).length) ext.web = rest;
    if (JSON.stringify(ext).length > EXT_LIMIT) { delete ext.web; }
    if (Object.keys(ext).length) d.ext = ext;
    return d;
  }
  function wireTrade(id, d) {
    var ext = d.ext || {}, web = ext.web || {}, t = {};
    Object.keys(web).forEach(function (k) { t[k] = web[k]; });
    Object.assign(t, { id: id, date: d.date, time: d.time || "", symbol: d.symbol, direction: d.direction, session: d.session || "", setup: d.setup || "", result: d.result || "", notes: d.notes || "", entry: d.entry, sl: d.sl, tp: d.tp === undefined ? null : d.tp, lot: d.size === undefined ? null : d.size, risk: d.risk === undefined ? 0 : d.risk, pnl: d.pnl === undefined ? 0 : d.pnl });
    if (!Array.isArray(t.flags)) t.flags = []; if (!Array.isArray(t.psyAfter)) t.psyAfter = [];
    if (!t.smc || typeof t.smc !== "object") t.smc = { checks: {}, score: null };
    var other = Object.assign({}, ext); delete other.web; if (Object.keys(other).length) Object.defineProperty(t, "__ext", { value: other, enumerable: false, writable: true, configurable: true });
    return t;
  }
  function settingsWire() {
    var s = state(); if (!s || !s.settings) return null; var st = s.settings, d = {};
    if (typeof st.currency === "string") d.currency = st.currency.slice(0, 8);
    if (["auto", "day", "night"].indexOf(st.theme) >= 0) d.theme = st.theme;
    if (st.lang === "fr" || st.lang === "en") d.lang = st.lang;
    var bal = num(st.startingBalance); if (bal !== undefined && bal >= 0) d.startingBalance = bal;
    var p = st.plan || {}, g = {}; [["maxRisk", p.maxRisk], ["maxTrades", p.maxTrades], ["maxDailyLoss", p.maxDailyLoss], ["maxConsec", p.maxConsec], ["minRR", p.minRR]].forEach(function (x) { var n = num(x[1]); if (n !== undefined) g[x[0]] = n; });
    d.guardian = g;
    var ext = readExt(), web = {}; ["sessions", "setups", "confluences"].forEach(function (k) { if (typeof p[k] === "string" && p[k]) web[k] = p[k].slice(0, 500); });
    if (Object.keys(web).length) ext.web = { plan: web }; else delete ext.web;
    if (Object.keys(ext).length) d.ext = ext;
    return { kind: "settings", id: "main", data: d };
  }
  function readLocal() {
    var s = state(); if (!s) return { trades: [], plans: [], settings: null };
    var trades = (s.trades || []).filter(function (t) { return t && !t.isDemo && ID_RE.test(String(t.id || "")); }).map(function (t) { return { kind: "trade", id: t.id, data: tradeWire(t) }; });
    var plans = [], pb = s.settings && s.settings.planBuilder;
    if (pb && Array.isArray(pb.confirmations) && ID_RE.test(String(pb.id || ""))) plans.push({ kind: "plan", id: pb.id, data: { schema: "web-planbuilder-v1", name: String(pb.name || "").slice(0, 80), active: !!pb.active, body: JSON.parse(JSON.stringify(pb)) } });
    return { trades: trades, plans: plans, settings: settingsWire() };
  }
  var lastIds = null, wasDemo = false;
  var realIds = function () { var s = state(); var o = {}; if (s) (s.trades || []).forEach(function (t) { if (t && !t.isDemo) o[t.id] = 1; }); return o; };

  function applyRemote(patch) {
    var s = state(); if (!s || isDemo()) return;
    var map = {}; (s.trades || []).forEach(function (t) { map[t.id] = t; });
    patch.deletes.forEach(function (d) { if (d.kind === "trade") delete map[d.id]; });
    patch.upserts.forEach(function (u) {
      if (u.kind === "trade") map[u.id] = wireTrade(u.id, u.data);
      else if (u.kind === "plan" && u.data && u.data.schema === "web-planbuilder-v1" && u.data.body && Array.isArray(u.data.body.confirmations)) s.settings.planBuilder = u.data.body;
      else if (u.kind === "settings") {
        var d = u.data, st = s.settings;
        if (typeof d.currency === "string" && d.currency) st.currency = d.currency;
        if (typeof d.startingBalance === "number") st.startingBalance = d.startingBalance;
        if (d.theme) st.theme = d.theme; if (d.lang) st.lang = d.lang;
        var g = d.guardian || {}, p = Object.assign({}, st.plan || {});
        ["maxRisk", "maxTrades", "maxDailyLoss", "maxConsec", "minRR"].forEach(function (k) { if (typeof g[k] === "number") p[k] = g[k]; });
        var w = d.ext && d.ext.web && d.ext.web.plan || {}; ["sessions", "setups", "confluences"].forEach(function (k) { if (typeof w[k] === "string") p[k] = w[k]; });
        st.plan = p;
        var ext = Object.assign({}, d.ext || {}); delete ext.web; try { localStorage.setItem(extKey, JSON.stringify(ext)); } catch (e) {}
      }
    });
    patch.deletes.forEach(function (d) { if (d.kind === "plan" && s.settings.planBuilder && s.settings.planBuilder.id === d.id) delete s.settings.planBuilder; });
    s.trades = Object.keys(map).map(function (k) { return map[k]; });
    lastIds = realIds();
    muted = true; try { if (typeof save === "function") save(); if (typeof renderAll === "function") renderAll(); } finally { muted = false; }
  }
  function backupAndClear(reason) {
    var s = state(); if (!s) return;
    try { localStorage.setItem("tm_backup_" + Date.now(), JSON.stringify({ reason: reason, trades: s.trades, settings: s.settings })); } catch (e) {}
    s.trades = []; var keep = { membership: s.settings && s.settings.membership }; s.settings = Object.assign({ startingBalance: 10000, currency: "$", theme: "auto" }, keep.membership ? { membership: keep.membership } : {});
    lastIds = {}; muted = true; try { if (typeof save === "function") save(); if (typeof renderAll === "function") renderAll(); } finally { muted = false; }
  }

  var chip = null;
  function render(s) {
    if (!chip) return; var key = s.state, label, tone = "#9aa3b2";
    var map = { ok: [tr("Synchronisé", "Synced"), "#3ccf91"], syncing: [tr("Synchronisation…", "Syncing…"), "#9aa3b2"], offline: [tr("Hors ligne : données gardées", "Offline : data kept"), "#e0b341"], error: [tr("Erreur de synchro", "Sync error"), "#e5484d"], conflict: [tr("Conflit : version du compte appliquée", "Conflict: account version applied"), "#e0b341"], attention: [tr("Certaines données restent locales", "Some data stays local"), "#e0b341"], demo: [tr("Démo : non synchronisée", "Demo : not synced"), "#9aa3b2"], signedout: [tr("Non connecté", "Signed out"), "#9aa3b2"], idle: [tr("Synchro…", "Sync…"), "#9aa3b2"] };
    var m = map[key] || map.idle; label = m[0]; tone = m[1];
    chip.textContent = ""; var dot = document.createElement("i"); dot.style.cssText = "display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:7px;background:" + tone; chip.appendChild(dot); chip.appendChild(document.createTextNode(label));
    chip.title = key === "conflict" ? tr("Une modification faite ailleurs a remplacé une version locale (conservée). Touchez pour acquitter.", "An edit made elsewhere replaced a local version (kept). Tap to acknowledge.") : tr("Touchez pour synchroniser maintenant", "Tap to sync now");
    chip.style.display = key === "signedout" || (key === "idle" && !accountId()) ? "none" : "inline-flex";
  }
  function mountChip() {
    if (chip || !document.body) return; chip = document.createElement("button"); chip.id = "tm-sync-chip"; chip.type = "button";
    chip.setAttribute("aria-live", "polite"); chip.style.cssText = "position:fixed;left:12px;bottom:58px;z-index:60;display:none;align-items:center;font:600 11px/1 system-ui,sans-serif;padding:8px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(12,14,20,.92);color:#e8ebf2;cursor:pointer;max-width:70vw";
    chip.addEventListener("click", function () { if (core.getStatus().state === "conflict") core.clearConflicts(); core.sync(); });
    document.body.appendChild(chip); render(core.getStatus());
  }

  var muted = false;
  var core = window.TMSyncCore.create({
    api: function (method, path, body, signal, extra) {
      var headers = Object.assign({ "content-type": "application/json" }, extra || {});
      return fetch(path, { method: method, headers: headers, body: body === undefined ? undefined : JSON.stringify(body), signal: signal, credentials: "same-origin" }).then(function (r) { return r.json().catch(function () { return null; }).then(function (j) { return { status: r.status, ok: r.ok, json: j }; }); });
    },
    storage: { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }, remove: function (k) { try { localStorage.removeItem(k); } catch (e) {} } },
    userId: accountId, isDemo: isDemo,
    adapter: { readLocal: readLocal, accepts: function (rec) { return rec.kind !== "plan" || (rec.data && rec.data.schema === "web-planbuilder-v1"); }, applyRemote: applyRemote, backupAndClear: backupAndClear, onStatus: render }
  });

  // Détection des suppressions : une suppression isolée est propagée ; un retrait massif (≥ 3 trades, ex. « Tout supprimer ») demande confirmation.
  function afterSave() {
    if (muted) return;
    var s = state(); if (!s) return;
    if (isDemo()) { wasDemo = true; core.setDemoChanged(); return; } // jeu de démonstration en place : les trades réels sont mis de côté, rien n'est supprimé ni envoyé
    var now = realIds();
    // Sortie du mode démo : la différence avec l'état d'avant la démo n'est PAS une suppression ; les trades du compte sont relus.
    if (wasDemo) { wasDemo = false; lastIds = now; core.setDemoChanged(); core.schedule(300); return; }
    if (lastIds === null) { lastIds = now; core.setDemoChanged(); core.schedule(1200); return; }
    var removed = Object.keys(lastIds).filter(function (id) { return !now[id]; }); lastIds = now;
    if (removed.length && removed.length <= 2) removed.forEach(function (id) { core.noteDelete("trade", id); });
    else if (removed.length > 2) {
      var ask = window.tmUI && window.tmUI.confirm ? window.tmUI.confirm(tr("Supprimer aussi " + removed.length + " trades de votre compte (autres appareils) ? Sinon ils seront restaurés ici à la prochaine synchronisation.", "Also delete " + removed.length + " trades from your account (other devices)? Otherwise they will be restored here at the next sync."), { title: tr("Suppression multiple", "Bulk deletion"), okText: tr("Supprimer partout", "Delete everywhere"), danger: true }) : Promise.resolve(false);
      ask.then(function (ok) { if (ok) removed.forEach(function (id) { core.noteDelete("trade", id); }); core.schedule(400); });
      return;
    }
    core.schedule(1500);
  }
  function hookSave() { if (typeof window.save !== "function" || window.save.__tmsync) return; var old = window.save; var w = function () { var r = old.apply(this, arguments); try { afterSave(); } catch (e) {} return r; }; w.__tmsync = true; window.save = w; }

  function boot() {
    hookSave(); mountChip();
    var tries = 0, t = setInterval(function () { tries++; if (accountId() || tries > 40) { clearInterval(t); if (accountId()) { lastIds = realIds(); core.schedule(300); } } }, 750);
    window.addEventListener("online", function () { core.schedule(300); });
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") core.schedule(500); });
    setInterval(function () { if (document.visibilityState === "visible" && navigator.onLine !== false && accountId() && !isDemo()) core.sync(); }, 90000);
    setInterval(function () { var d = isDemo(); if (d !== boot.d) { boot.d = d; core.setDemoChanged(); } }, 1500);
  }
  window.__tmSync = { sync: function () { return core.sync(); }, status: function () { return core.getStatus(); }, conflicts: function () { return core.getConflicts(); }, _internals: { tradeWire: tradeWire, wireTrade: wireTrade, readLocal: readLocal, isDemo: isDemo } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
