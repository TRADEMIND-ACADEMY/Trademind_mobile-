/* TRADEMIND — tm-extra.js : chiffres qui comptent, courbes qui se dessinent, notifications avec « Annuler »,
   barre de progression. Aucune donnée n'est modifiée : le texte final est toujours le texte d'origine. */
(() => {
  'use strict';
  const d = document, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Chiffres qui comptent (entiers simples uniquement ; le texte d'origine est restauré à la fin) ---- */
  const SIMPLE = /^([^\d-]{0,2})(-?\d{1,7})([^\d]{0,3})$/;
  const count = el => {
    if (reduced || el.dataset.counted) return; const txt = el.textContent.trim(); const m = SIMPLE.exec(txt); if (!m) return;
    el.dataset.counted = '1'; const to = parseInt(m[2], 10); if (!isFinite(to) || Math.abs(to) < 2) return;
    const t0 = performance.now(), dur = 900;
    const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = m[1] + Math.round(to * e) + m[3]; if (k < 1) requestAnimationFrame(step); else el.textContent = txt; };
    requestAnimationFrame(step);
  };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const el = e.target; io.unobserve(el); el.matches('.tm-draw') ? el.classList.add('go') : count(el); } }), { threshold: .4 }) : null;
  const scan = root => {
    root.querySelectorAll('[data-count], .kpi strong').forEach(el => { if (!el.dataset.watch) { el.dataset.watch = '1'; io ? io.observe(el) : 0; } });
    root.querySelectorAll('.tm-draw').forEach(el => { if (!el.dataset.watch) { el.dataset.watch = '1'; el.setAttribute('pathLength', '1'); io ? io.observe(el) : el.classList.add('go'); } });
  };
  scan(d);
  /* Vues rendues dynamiquement (Owner) : on observe les nouveaux indicateurs */
  const host = d.querySelector('.owner-main'); if (host) new MutationObserver(() => scan(host)).observe(host, { childList: true, subtree: true });

  /* ---- 2. Notifications : window.tmToast(message, { undo: fn }) ---- */
  let box = null;
  window.tmToast = (msg, opt = {}) => {
    if (!box) { box = d.createElement('div'); box.className = 'tm-toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); d.body.appendChild(box); }
    const t = d.createElement('div'); t.className = 'tm-toast'; const s = d.createElement('span'); s.textContent = msg; t.appendChild(s);
    const kill = () => { t.classList.add('out'); setTimeout(() => t.remove(), 260); };
    if (typeof opt.undo === 'function') { const b = d.createElement('button'); b.type = 'button'; b.textContent = opt.undoLabel || ((d.documentElement.lang || 'fr').startsWith('en') ? 'Undo' : 'Annuler'); b.addEventListener('click', () => { opt.undo(); kill(); }); t.appendChild(b); }
    box.appendChild(t); setTimeout(kill, opt.ms || 5200);
  };


  /* ---- 3. Barre de progression du défilement ---- */
  const bar = d.createElement('div'); bar.className = 'tm-progress'; bar.setAttribute('aria-hidden', 'true'); d.body.appendChild(bar);
  let timeline = false; try { timeline = CSS.supports('animation-timeline: scroll()'); } catch (e) {}
  if (!timeline) {
    let tick = 0; const root = d.documentElement;
    const paint = () => { tick = 0; const h = root.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; };
    addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(paint); }, { passive: true }); paint();
  }
})();
