/* TRADEMIND : application, étape 3 : menu latéral, cascade d'entrée, compteurs.
   Ne modifie ni données, ni API, ni règles. Le menu ne fait que déclencher les boutons d'origine. */
(() => {
  'use strict';
  const d = document, root = d.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) root.classList.add('tm-reduced');

  /* ---------- 1. Menu latéral regroupé : Piloter / Agir / Comprendre ---------- */
  const GROUPS = [
    ['Piloter', 'Pilot', ['Dashboard', 'Tableau de bord', 'Journal', 'Evolution', 'Évolution', 'Calendar', 'Calendrier']],
    ['Agir', 'Act', ['Plan / Add Trade', 'Plan / Ajouter un trade', 'Add Trade', 'Ajouter un trade', 'Plan Builder', 'Guardian', 'DAN']],
    ['Comprendre', 'Understand', ['Analytics', 'Analyses', 'Psychology', 'Psychologie', 'Reports', 'Rapports', 'Matrix', 'Matrice', 'Data Quality', 'Qualité des données', 'Sessions & Merit', 'Sessions & mérite', 'Weekly Review', 'Revue hebdomadaire', 'Monthly Review', 'Revue mensuelle']],
    ['Compte', 'Account', ['User Center', 'User Center / TradeMind ID', 'Centre utilisateur / TradeMind ID', 'Account', 'Compte', 'Membership', 'MEMBERSHIP', 'Abonnement', 'ABONNEMENT', 'Settings', 'Réglages']]
  ];
  let lastLabel = null;
  const build = () => {
    const menu = d.getElementById('tm-command-menu');
    if (!menu || d.getElementById('tm-rail')) return !!d.getElementById('tm-rail');
    const src = [...menu.querySelectorAll('[data-command-view]')];
    if (!src.length) return false;
    const en = (d.documentElement.lang || 'en').startsWith('en') || true;
    const byLabel = new Map(); const used = new Set();
    src.forEach(b => byLabel.set(b.textContent.trim().split('\n')[0].trim(), b));
    const rail = d.createElement('aside'); rail.id = 'tm-rail'; rail.setAttribute('aria-label', 'Navigation');
    const logo = d.querySelector('.sidebar .brand-logo, .topbar .brand-logo');
    rail.innerHTML = `<div class="rail-brand">${logo ? `<img src="${logo.getAttribute('src')}" alt="" onerror="this.style.display='none'">` : ''}<div><b>TRADEMIND ACADEMY</b><small>Trader Intelligence</small></div></div>`;
    const mk = (label, btn) => {
      const it = d.createElement('button'); it.type = 'button'; it.className = 'rail-item'; it.dataset.view = btn.dataset.commandView; it.dataset.label = label;
      const ic = btn.querySelector('svg'); it.innerHTML = (ic ? ic.outerHTML : '') + `<span>${label}</span>`;
      it.addEventListener('click', () => {
        lastLabel = label;
        // Le menu d'origine peut être reconstruit : on retrouve le bouton vivant au moment du clic.
        const live = [...d.querySelectorAll('#tm-command-menu [data-command-view]')].find(b => b.textContent.trim().split('\n')[0].trim() === label) || btn;
        live.click();
        setTimeout(syncRail, 80);
      });
      return it;
    };
    GROUPS.forEach(([fr, , labels], gi) => {
      const items = labels.filter(l => byLabel.has(l));
      if (!items.length) return;
      const g = d.createElement('div'); g.className = 'rail-group'; g.dataset.g = fr;
      const head = d.createElement('button'); head.type = 'button'; head.className = 'rail-head'; head.setAttribute('aria-expanded', 'true');
      head.innerHTML = `<span>${fr}</span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
      const body = d.createElement('div'); body.className = 'rail-body';
      let closed = false; try { closed = localStorage.getItem('tm_rail_' + fr) === '0'; } catch (e) {}
      if (closed) { g.classList.add('shut'); head.setAttribute('aria-expanded', 'false'); }
      head.addEventListener('click', () => { const sh = g.classList.toggle('shut'); head.setAttribute('aria-expanded', String(!sh)); try { localStorage.setItem('tm_rail_' + fr, sh ? '0' : '1'); } catch (e) {} });
      items.forEach(l => { body.appendChild(mk(l, byLabel.get(l))); used.add(l); });
      g.append(head, body); rail.appendChild(g);
    });
    // Rien ne disparaît : toute entrée du menu d'origine qui n'est pas classée est ajoutée à « Compte ».
    const rest = [...byLabel.keys()].filter(l => !used.has(l));
    if (rest.length) {
      let g = [...rail.querySelectorAll('.rail-group')].pop();
      if (!g) { g = d.createElement('div'); g.className = 'rail-group'; g.innerHTML = '<div class="rail-body"></div>'; rail.appendChild(g); }
      const rb = g.querySelector('.rail-body') || g; rest.forEach(l => rb.appendChild(mk(l, byLabel.get(l))));
    }
    rail.insertAdjacentHTML('beforeend', '<div class="rail-foot"><button type="button" class="rail-me"><span class="av"></span><span class="who"><b></b><small>Compte et réglages</small></span></button></div>');
    rail.querySelector('.rail-me').addEventListener('click', () => { const it = [...rail.querySelectorAll('.rail-item')].find(i => /User Center|Account/.test(i.dataset.label)); if (it) it.click(); });
    // Recherche : filtre les entrées du menu ; Entrée ouvre la première correspondance.
    const sBox = d.createElement('label'); sBox.className = 'rail-search';
    sBox.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" placeholder="Rechercher…" aria-label="Rechercher dans le menu" autocomplete="off">';
    const inp = sBox.querySelector('input');
    inp.addEventListener('input', () => { const q = inp.value.trim().toLowerCase(); rail.querySelectorAll('.rail-item').forEach(i => { i.hidden = !!q && !i.dataset.label.toLowerCase().includes(q); }); rail.querySelectorAll('.rail-group').forEach(g => { const any = [...g.querySelectorAll('.rail-item')].some(i => !i.hidden); g.hidden = !any; if (q && any) g.classList.remove('shut'); }); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { const f = [...rail.querySelectorAll('.rail-item')].find(i => !i.hidden); if (f) f.click(); } });
    rail.querySelector('.rail-brand').after(sBox);
    d.body.appendChild(rail);
    return true;
  };
  const currentView = () => { const v = d.querySelector('.view.active'); return v ? v.id.replace(/^view-/, '') : ''; };
  const syncRail = () => {
    const rail = d.getElementById('tm-rail'); if (!rail) return;
    const v = currentView(); const items = [...rail.querySelectorAll('.rail-item')];
    let pick = items.find(i => i.dataset.label === lastLabel && i.dataset.view === v) || items.find(i => i.dataset.view === v);
    items.forEach(i => { i.classList.toggle('on', i === pick); if (i === pick) i.setAttribute('aria-current', 'page'); else i.removeAttribute('aria-current'); });
  };

  /* ---------- 2. Cascade d'entrée à chaque changement de vue ---------- */
  let prev = '';
  const enter = () => {
    const v = d.querySelector('.view.active'); if (!v) return;
    if (v.id === prev) return; prev = v.id;
    syncRail();
    if (reduced) return;
    const kids = [...v.querySelectorAll(':scope > *, :scope .tm-flow > *, :scope .deck > *, :scope .grid > *, :scope .coachlist > *')];
    kids.forEach((k, i) => k.style.setProperty('--k', Math.min(i, 7)));
    v.classList.remove('tm-enter'); void v.offsetWidth; v.classList.add('tm-enter');
    setTimeout(() => v.classList.remove('tm-enter'), 1800);
  };

  /* ---------- 3. Compteurs : le chiffre affiché finit EXACTEMENT sur la valeur réelle ---------- */
  const fmtLike = (txt, val) => {
    const m = txt.match(/-?\d[\d,.\s]*/); if (!m) return null;
    const tok = m[0]; const dec = (tok.match(/[.](\d+)\s*$/) || [, ''])[1].length; const grp = /\d,\d{3}/.test(tok);
    const s = Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: grp });
    return txt.replace(tok, (val < 0 && /^-/.test(tok) ? '-' : '') + s);
  };
  const running = new WeakMap();
  const countUp = (el) => {
    if (reduced) return;
    const target = el.textContent; const m = target.match(/-?\d[\d,]*\.?\d*/); if (!m) return;
    const end = parseFloat(m[0].replace(/,/g, '')); if (!isFinite(end) || end === 0) return;
    const t0 = performance.now(), dur = 800;
    const id = Symbol(); running.set(el, id);
    const step = (now) => {
      if (running.get(el) !== id) return;
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      obs.disconnect();
      el.textContent = p < 1 ? (fmtLike(target, end * e) || target) : target;
      watch();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const targets = () => [].map(s => d.querySelector(s)).filter(Boolean);
  const obs = new MutationObserver(ms => { ms.forEach(m => { const el = m.target.nodeType === 3 ? m.target.parentElement : m.target; if (el && targets().includes(el)) countUp(el); }); });
  const watch = () => targets().forEach(el => obs.observe(el, { childList: true, characterData: true, subtree: true }));

  /* ---------- 4. Couleur selon le plan (lecture seule du plan déjà connu côté serveur) ---------- */
  const planOf = () => { const raw = (window.tmAccount && window.tmAccount.plan) || (() => { try { return localStorage.getItem('tm_current_plan'); } catch (e) { return null; } })() || 'FREE'; const p = String(raw).toUpperCase(); return p === 'ELITE' || p === 'SOVEREIGN' ? 'ELITE' : /^PRO[ _-]?MAX$|^APEX$/.test(p) ? 'PROMAX' : p === 'PRO' || p === 'ASCEND' ? 'PRO' : 'FREE'; };
  const NAMES = { FREE: 'Foundation', PRO: 'Ascend', PROMAX: 'Apex', ELITE: 'Sovereign' };
  const syncPlan = () => {
    const p = planOf(); if (root.dataset.plan !== p) root.dataset.plan = p;
    const rail = d.getElementById('tm-rail'); if (!rail) return;
    let b = rail.querySelector('.rail-plan'); if (!b) { b = d.createElement('div'); b.className = 'rail-plan'; const f = rail.querySelector('.rail-foot'); rail.insertBefore(b, f); }
    if (b.textContent !== NAMES[p]) b.textContent = NAMES[p];
    const a = window.tmAccount || {}; const nm = [a.firstName, a.lastName].filter(Boolean).join(' ') || (a.email || '').split('@')[0] || 'Trader';
    const me = rail.querySelector('.rail-me'); if (me) { const bb = me.querySelector('b'); if (bb.textContent !== nm) { bb.textContent = nm; me.querySelector('.av').textContent = nm.charAt(0).toUpperCase(); } }
  };
  setInterval(syncPlan, 1500); syncPlan();

  /* ---------- Démarrage ---------- */
  const main = d.querySelector('main.content') || d.body;
  new MutationObserver(enter).observe(main, { attributes: true, subtree: true, attributeFilter: ['class'] });
  const boot = (n = 0) => { if (build()) { syncRail(); syncPlan(); enter(); } else if (n < 40) setTimeout(() => boot(n + 1), 250); };
  watch(); boot();
})();
