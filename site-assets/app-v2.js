/* Tableaux : étiquette chaque cellule avec son en-tête pour l'affichage en cartes (CSS, téléphone). */
(() => {
  const run = () => document.querySelectorAll('table:not(.tm-stack):not(.no-stack)').forEach(t => {
    const hs = [...t.querySelectorAll('thead th')].map(h => h.textContent.trim()); if (hs.length < 3) return;
    t.querySelectorAll('tbody tr').forEach(tr => [...tr.children].forEach((td, i) => { if (hs[i]) td.setAttribute('data-label', hs[i]); }));
    t.classList.add('tm-stack');
  });
  let id = 0; const mo = new MutationObserver(() => { if (id) return; id = setTimeout(() => { id = 0; run(); }, 200); });
  const start = () => { run(); mo.observe(document.body, { childList: true, subtree: true }); };
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', start) : start();
})();

/* ---- Démo stable : mêmes trades, même capital à chaque chargement ---- */
(() => {
  const wrap = () => {
    const o = window.loadDemoRun; if (typeof o !== 'function' || o.__tmSeeded) return false;
    const w = function () {
      const r = Math.random; let a = 20261111;
      Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
      try { return o.apply(this, arguments); } finally { Math.random = r; }
    };
    w.__tmSeeded = true; window.loadDemoRun = w; return true;
  };
  if (!wrap()) addEventListener('load', wrap); setTimeout(wrap, 500);
})();

/* ---- Menu : une vraie icône par entrée + rail compact à gauche ---- */
(() => {
  const S = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const dots = [6, 12, 18].flatMap(y => [6, 12, 18].map(x => `<circle cx="${x}" cy="${y}" r="1.6"/>`)).join('');
  const ICONS = [
    [/tableau|dashboard/i, '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'],
    [/journal/i, '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M9 8h6M9 12h6"/>'],
    [/plan|ajouter|add/i, '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'],
    [/analyses|analytics/i, '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'],
    [/volution/i, '<path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/>'],
    [/psycho/i, '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>'],
    [/guardian/i, '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'],
    [/^dan\b|\bdan\b/i, '<path d="M4 5h16v11H9l-5 4z"/><path d="M9 10h6"/>'],
    [/rapport|report/i, '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 12h6M10 16h6"/>'],
    [/matri/i, dots],
    [/calend/i, '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'],
    [/qualit|data quality/i, '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>'],
    [/session|m.rite|merit/i, '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 21l5-3 5 3-1.5-7"/>'],
    [/utilisateur|user|account|compte/i, '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>'],
    [/revue|review/i, '<path d="M9 4h6l1 2h3v15H5V6h3z"/><path d="M9 13l2 2 4-4"/>'],
    [/abonnement|member/i, '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>'],
    [/r.glages|settings/i, '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>']
  ];
  const idx = t => ICONS.findIndex(i => i[0].test(t));
  const iconFor = t => { const k = idx(t); return k >= 0 ? S(ICONS[k][1]) : S('<circle cx="12" cy="12" r="4"/>'); };
  const fix = () => {
    document.querySelectorAll('#tm-rail .rail-item').forEach(it => {
      if (it.dataset.v2) return; const ic = iconFor(it.dataset.label || it.textContent); if (!ic) return;
      const old = it.querySelector('svg'); if (old) old.outerHTML = ic; else it.insertAdjacentHTML('afterbegin', ic); it.dataset.v2 = '1'; });
    document.querySelectorAll('#tm-rail .rail-item').forEach(it => { const k = idx(it.dataset.label || it.textContent); it.style.order = k >= 0 ? k : 99; });
    document.querySelectorAll('#tm-command-menu [data-command-view]').forEach(b => {
      const sp = b.querySelector('.tm-menu-icon'); if (!sp || sp.dataset.v2) return; const ic = iconFor(b.textContent); if (ic) { sp.innerHTML = ic; sp.dataset.v2 = '1'; } });
    const rail = document.getElementById('tm-rail'); if (!rail) return;
    document.body.classList.add('tm-has-rail');
    if (!rail.querySelector('.rail-glide')) { const g = document.createElement('i'); g.className = 'rail-glide'; rail.prepend(g); }
    if (!rail.querySelector('.rail-toggle')) { const t = document.createElement('button'); t.type = 'button'; t.className = 'rail-toggle'; t.setAttribute('aria-label', 'Menu'); t.innerHTML = S('<path d="M4 7h16M4 12h16M4 17h16"/>'); t.onclick = e => { e.stopPropagation(); rail.classList.toggle('open'); }; rail.prepend(t);
      document.addEventListener('click', e => { if (rail.classList.contains('open') && !rail.contains(e.target)) rail.classList.remove('open'); }); }
    glide();
  };
  const pickOn = rail => { const v = (document.querySelector('.view.active') || {id: ''}).id.replace(/^view-/, ''); const its = [...rail.querySelectorAll('.rail-item')].filter(i => i.dataset.view === v); if (!its.length) return;
    const best = its.find(i => i.dataset.label === rail.__last) || its.find(i => new RegExp(v.replace(/newtrade/, 'ajouter|add|plan'), 'i').test(i.dataset.label)) || its.sort((a, b) => (+a.style.order) - (+b.style.order))[0];
    rail.querySelectorAll('.rail-item').forEach(i => { i.classList.toggle('on', i === best); }); };
  document.addEventListener('click', e => { const it = e.target.closest && e.target.closest('#tm-rail .rail-item'); if (it) document.getElementById('tm-rail').__last = it.dataset.label; }, true);
  const glide = () => { const rail = document.getElementById('tm-rail'); if (rail) pickOn(rail); const g = rail && rail.querySelector('.rail-glide'), on = rail && rail.querySelector('.rail-item.on'); if (!g || !on) return;
    g.style.height = on.offsetHeight + 'px'; g.style.width = on.offsetWidth + 'px'; g.style.transform = `translate(${on.offsetLeft}px,${on.offsetTop}px)`; };
  let id = 0; const mo = new MutationObserver(() => { if (id) return; id = setTimeout(() => { id = 0; fix(); glide(); }, 100); });
  const start = () => { fix(); mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }); };
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', start) : start();
  addEventListener('resize', glide);
})();
