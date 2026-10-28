/* TRADEMIND ACADEMY — noyau de synchronisation (identique côté site et côté application mobile).
 * Le serveur est la source de vérité ; le stockage local n'est qu'un cache.
 * - Les modifications locales sont détectées par comparaison avec la dernière version synchronisée (empreinte) : pas de file fragile.
 * - Les suppressions sont explicites (noteDelete) : un état local vide ne supprime JAMAIS les données du compte (elles sont relues).
 * - Conflit : la version du serveur est appliquée, la version locale perdante est conservée dans meta.conflicts (jamais perdue en silence).
 * - Mode DÉMO : aucune requête, aucune lecture appliquée, aucune écriture (garde avant chaque étape asynchrone).
 * - Changement de compte sur l'appareil : les données locales de l'ancien compte sont sauvegardées puis retirées (jamais envoyées au nouveau compte).
 * Fichier sans dépendance : script classique (site) ou import à effet de bord (mobile) ; expose globalThis.TMSyncCore.
 */
(function (root) {
  "use strict";
  var DEMO_ID = /^demo[-_]/i, DEMO_NOTE = /^demo trade\b/i;
  function looksDemo(d) {
    if (!d || typeof d !== "object") return false;
    var flag = function (o) { return !!o && typeof o === "object" && (o.demo === true || o.isDemo === true || o.isdemo === true || String(o.mode || "").toUpperCase() === "DEMO"); };
    var note = function (o) { return !!o && typeof o === "object" && DEMO_NOTE.test(String(o.notes || "")); };
    return flag(d) || note(d) || DEMO_ID.test(String(d.id || "")) || flag(d.ext) || note(d.ext);
  }
  // Empreinte stable (JSON à clés triées) : FNV-1a 32 bits ×2 (suffisant pour détecter un changement ; pas un usage de sécurité).
  function canon(v) { if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]"; if (v && typeof v === "object") return "{" + Object.keys(v).sort().map(function (k) { return JSON.stringify(k) + ":" + canon(v[k]); }).join(",") + "}"; return JSON.stringify(v === undefined ? null : v); }
  function hash(v) { var s = canon(v), a = 0x811c9dc5, b = 0x9747b28c; for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); a = Math.imul(a ^ c, 16777619) >>> 0; b = Math.imul(b ^ c, 2246822519) >>> 0; } return a.toString(16) + b.toString(16) + s.length.toString(16); }
  var key = function (kind, id) { return kind + "|" + id; };
  var BATCH = 50, MAX_PAGES = 40, REJECT_RETRY_MS = 6 * 3600 * 1000;

  function createSyncCore(opts) {
    var api = opts.api, storage = opts.storage, adapter = opts.adapter, getUserId = opts.userId, isDemo = opts.isDemo;
    var listeners = [], status = { state: "idle", pending: 0, conflicts: 0, rejected: 0, lastSyncAt: null, error: null };
    var gen = 0, running = null, rerun = false, timer = null, controller = null;

    var emit = function () { var s = Object.assign({}, status); listeners.forEach(function (l) { try { l(s); } catch (e) {} }); try { adapter.onStatus && adapter.onStatus(s); } catch (e) {} };
    var setStatus = function (patch) { Object.assign(status, patch); emit(); };
    var metaKey = function (uid) { return "tmsync.meta." + uid; };
    var loadMeta = function (uid) { try { var m = JSON.parse(storage.get(metaKey(uid)) || "null"); if (m && typeof m === "object" && m.userId === uid) return m; } catch (e) {} return null; };
    var saveMeta = function (m) { try { storage.set(metaKey(m.userId), JSON.stringify(m)); } catch (e) {} };
    var freshMeta = function (uid) { return { userId: uid, cursor: 0, v: {}, shadow: {}, deletes: {}, conflicts: [], rejected: {}, lastSyncAt: null }; };
    var aborted = function (g) { return g !== gen || isDemo(); };

    function localWire() {
      var raw = adapter.readLocal() || {}, out = {}, skippedDemo = 0;
      ["trades", "plans"].forEach(function (name) {
        (raw[name] || []).forEach(function (r) { if (!r || !r.id) return; if (looksDemo(r.data) || looksDemo({ id: r.id })) { skippedDemo++; return; } out[key(r.kind, r.id)] = r; });
      });
      if (raw.settings && raw.settings.data) out[key("settings", "main")] = raw.settings;
      out.__skippedDemo = skippedDemo;
      return out;
    }
    function countPending(meta, local) {
      var n = 0; Object.keys(local).forEach(function (k) { if (k === "__skippedDemo") return; if (meta.shadow[k] !== hash(local[k].data)) n++; });
      Object.keys(meta.deletes).forEach(function (k) { if (meta.v[k]) n++; });
      return n;
    }
    function remember(meta, list) { meta.conflicts = (meta.conflicts || []).concat(list).slice(-50); }

    async function call(method, path, body, g) {
      controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      var res = await api(method, path, body, controller ? controller.signal : undefined, isDemo() ? { "x-tm-mode": "demo" } : undefined);
      if (aborted(g)) throw Object.assign(new Error("ABORTED"), { aborted: true });
      return res;
    }

    async function run(g) {
      var uid = getUserId();
      if (!uid) { setStatus({ state: "signedout", error: null }); return; }
      var meta = loadMeta(uid);
      if (!meta) {
        // Compte différent de celui qui a produit les données locales : sauvegarde puis nettoyage, JAMAIS d'envoi au nouveau compte.
        var previous = storage.get("tmsync.owner");
        if (previous && previous !== uid && adapter.backupAndClear) { adapter.backupAndClear("account-switch:" + previous); }
        meta = freshMeta(uid);
      }
      storage.set("tmsync.owner", uid);
      setStatus({ state: "syncing", error: null });

      // 1) LIRE le serveur (jusqu'à N pages), puis appliquer.
      var pulled = [], cursor = meta.cursor, more = true, pages = 0;
      var since = meta.cursor;
      // Un enregistrement connu mais absent localement SANS suppression explicite (état local vidé, démo, réinstallation) n'est jamais
      // interprété comme une suppression : il est relu depuis le serveur (lecture complète).
      var local0 = localWire(), restore = false;
      Object.keys(meta.shadow).forEach(function (k) { if (meta.shadow[k] !== "deleted" && !local0[k] && !meta.deletes[k] && k.indexOf("settings|") !== 0) { delete meta.shadow[k]; delete meta.v[k]; restore = true; } });
      if (restore) since = 0;
      while (more && pages < MAX_PAGES) {
        var r = await call("GET", "/api/sync/state?since=" + encodeURIComponent(since), undefined, g);
        if (r.status === 401) { setStatus({ state: "signedout", error: "SESSION_EXPIRED" }); return; }
        if (r.status !== 200 || !r.json || !Array.isArray(r.json.records)) throw new Error("PULL_" + r.status);
        pulled = pulled.concat(r.json.records); cursor = r.json.cursor; since = r.json.cursor; more = !!r.json.more; pages++;
      }
      if (aborted(g)) return;
      var local = localWire(), upserts = [], deletes = [];
      pulled.forEach(function (rec) {
        var k = key(rec.kind, rec.id), known = meta.v[k] || 0;
        if (rec.v <= known) return;
        // Enregistrements d'un autre schéma (ex. plan de l'autre interface) : conservés tels quels sur le serveur, jamais touchés ici.
        if (!rec.deleted && adapter.accepts && !adapter.accepts(rec)) return;
        var mine = local[k], dirty = !!mine && meta.shadow[k] !== hash(mine.data) && !!meta.shadow[k];
        var neverSynced = !!mine && !meta.shadow[k];
        if (rec.deleted) {
          if (dirty) { remember(meta, [{ kind: rec.kind, id: rec.id, at: Date.now(), reason: "deleted-on-server", local: mine.data }]); }
          if (mine) deletes.push({ kind: rec.kind, id: rec.id });
          meta.v[k] = rec.v; meta.shadow[k] = "deleted"; delete meta.deletes[k]; return;
        }
        if (mine && hash(mine.data) === hash(rec.data)) { meta.v[k] = rec.v; meta.shadow[k] = hash(rec.data); return; }
        if (mine && (dirty || (neverSynced && rec.kind !== "settings"))) remember(meta, [{ kind: rec.kind, id: rec.id, at: Date.now(), reason: "concurrent-edit", local: mine.data }]);
        upserts.push({ kind: rec.kind, id: rec.id, data: rec.data });
        meta.v[k] = rec.v; meta.shadow[k] = hash(rec.data);
      });
      if (upserts.length || deletes.length) { adapter.applyRemote({ upserts: upserts, deletes: deletes }); }
      meta.cursor = cursor;

      // 2) ENVOYER ce qui a changé localement (état relu après l'application des données distantes).
      local = localWire();
      var changes = [];
      Object.keys(local).forEach(function (k) {
        if (k === "__skippedDemo") return; var rec = local[k], h = hash(rec.data);
        if (meta.shadow[k] === h) return;
        var rej = meta.rejected[k]; if (rej && rej.h === h && Date.now() - rej.at < REJECT_RETRY_MS) return;
        changes.push({ kind: rec.kind, id: rec.id, baseVersion: meta.v[k] || 0, data: rec.data, _k: k, _h: h });
      });
      Object.keys(meta.deletes).forEach(function (k) {
        var parts = k.split("|"); if (!meta.v[k] || meta.shadow[k] === "deleted") { delete meta.deletes[k]; return; }
        if (local[k]) { delete meta.deletes[k]; return; } // recréé depuis : plus une suppression
        changes.push({ kind: parts[0], id: parts.slice(1).join("|"), baseVersion: meta.v[k], deleted: true, _k: k, _h: "deleted" });
      });
      var conflictsNow = 0;
      for (var i = 0; i < changes.length; i += BATCH) {
        if (aborted(g)) return;
        var batch = changes.slice(i, i + BATCH);
        var pr = await call("POST", "/api/sync/push", { changes: batch.map(function (c) { var o = { kind: c.kind, id: c.id, baseVersion: c.baseVersion }; if (c.deleted) o.deleted = true; else o.data = c.data; return o; }) }, g);
        if (pr.status === 401) { setStatus({ state: "signedout", error: "SESSION_EXPIRED" }); return; }
        if (pr.status === 409 && pr.json && pr.json.code === "DEMO_MODE") { setStatus({ state: "demo" }); return; }
        if (pr.status !== 200 || !pr.json || !Array.isArray(pr.json.results)) throw new Error("PUSH_" + pr.status);
        var upsertLater = [], deleteLater = [];
        pr.json.results.forEach(function (res, idx) {
          var c = batch[idx]; if (!c) return; var k = c._k;
          if (res.status === "ok") { meta.v[k] = res.v; meta.shadow[k] = c._h; delete meta.deletes[k]; delete meta.rejected[k]; return; }
          if (res.status === "conflict") {
            conflictsNow++;
            remember(meta, [{ kind: c.kind, id: c.id, at: Date.now(), reason: "version-conflict", local: c.deleted ? null : c.data }]);
            var s = res.server;
            if (s && !s.deleted) { upsertLater.push({ kind: s.kind, id: s.id, data: s.data }); meta.v[k] = s.v; meta.shadow[k] = hash(s.data); delete meta.deletes[k]; }
            else if (s && s.deleted) { if (!c.deleted) deleteLater.push({ kind: c.kind, id: c.id }); meta.v[k] = s.v; meta.shadow[k] = "deleted"; delete meta.deletes[k]; }
            else { meta.v[k] = 0; delete meta.shadow[k]; } // le serveur n'a plus d'enregistrement : il sera recréé à la prochaine synchro
            return;
          }
          // invalid / limit : la donnée reste locale, signalée, nouvel essai seulement si elle change (ou après quelques heures).
          meta.rejected[k] = { code: res.code || res.status, h: c._h, at: Date.now() };
        });
        if (upsertLater.length || deleteLater.length) adapter.applyRemote({ upserts: upsertLater, deletes: deleteLater });
      }
      meta.lastSyncAt = Date.now(); saveMeta(meta);
      local = localWire();
      var rejected = Object.keys(meta.rejected).filter(function (k) { return local[k]; });
      setStatus({ state: (meta.conflicts.length || conflictsNow) ? "conflict" : (rejected.length ? "attention" : "ok"), pending: countPending(meta, local), conflicts: meta.conflicts.length, rejected: rejected.length, lastSyncAt: meta.lastSyncAt, error: null, rejectedCodes: rejected.map(function (k) { return meta.rejected[k].code; }) });
    }

    function sync() {
      if (isDemo()) { setStatus({ state: "demo", error: null }); return Promise.resolve({ ok: true, skipped: "demo" }); }
      if (running) { rerun = true; return running; }
      var g = gen;
      running = (async function () {
        try { await run(g); return { ok: true }; }
        catch (e) {
          if (e && e.aborted) return { ok: false, aborted: true };
          var offline = (typeof navigator !== "undefined" && navigator.onLine === false) || (e && /fetch|network|Failed|load/i.test(String(e.message || "")));
          setStatus({ state: offline ? "offline" : "error", error: String((e && e.message) || e).slice(0, 80) });
          return { ok: false, error: String((e && e.message) || e) };
        } finally {
          running = null;
          if (rerun) { rerun = false; schedule(300); }
        }
      })();
      return running;
    }
    function schedule(ms) { if (timer) clearTimeout(timer); timer = setTimeout(function () { timer = null; sync(); }, ms == null ? 1500 : ms); }
    function setDemoChanged() { gen++; if (controller) { try { controller.abort(); } catch (e) {} } if (isDemo()) setStatus({ state: "demo" }); else schedule(200); }
    function noteDelete(kind, id) {
      var uid = getUserId(); if (!uid || isDemo()) return;
      var meta = loadMeta(uid) || freshMeta(uid); meta.deletes[key(kind, id)] = true; saveMeta(meta); schedule(800);
    }
    function stop() { gen++; if (timer) clearTimeout(timer); timer = null; if (controller) { try { controller.abort(); } catch (e) {} } }
    function clearConflicts() { var uid = getUserId(); if (!uid) return; var m = loadMeta(uid); if (m) { m.conflicts = []; saveMeta(m); } setStatus({ conflicts: 0, state: status.state === "conflict" ? "ok" : status.state }); }
    function getConflicts() { var uid = getUserId(); var m = uid && loadMeta(uid); return (m && m.conflicts) || []; }
    return { sync: sync, schedule: schedule, noteDelete: noteDelete, stop: stop, setDemoChanged: setDemoChanged, clearConflicts: clearConflicts, getConflicts: getConflicts,
      getStatus: function () { return Object.assign({}, status); }, subscribe: function (fn) { listeners.push(fn); try { fn(Object.assign({}, status)); } catch (e) {} return function () { listeners = listeners.filter(function (x) { return x !== fn; }); }; } };
  }
  root.TMSyncCore = { create: createSyncCore, looksDemo: looksDemo, hash: hash };
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
