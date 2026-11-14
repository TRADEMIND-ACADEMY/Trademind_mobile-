/* TRADEMIND : site public, étape 2 : menu, défilement, révélations, scène 3D en direct.
   Aucune route, aucun appel d'API : uniquement de la présentation. Tout est coupé si l'utilisateur
   demande de réduire les animations, et la scène 3D n'est lancée que sur un appareil capable. */
(() => {
  'use strict';
  const d = document, root = d.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const header = d.querySelector('.site-header');
  const nav = d.getElementById('siteNav');
  const burger = d.getElementById('mobileMenu');

  /* ---------- 1. En-tête compact au défilement ---------- */
  const syncHeader = () => header && header.classList.toggle('is-scrolled', window.scrollY > 40);

  /* ---------- 2. Menu mobile : icône, cascade, blocage du défilement ---------- */
  if (nav) {
    const syncMenu = () => {
      const open = nav.classList.contains('open');
      if (burger) burger.textContent = open ? '✕' : '☰';
      root.classList.toggle('nav-locked', open);
      nav.querySelectorAll('a').forEach((a, i) => a.style.setProperty('--i', i));
    };
    new MutationObserver(syncMenu).observe(nav, { attributes: true, attributeFilter: ['class'] });
    syncMenu();
    matchMedia('(min-width:1001px)').addEventListener?.('change', e => { if (e.matches) nav.classList.remove('open'); });
  }

  /* ---------- 3. Indicateur actif : le bord avant part, le bord arrière suit ---------- */
  let pill = null, activeLink = null, pillL = null, pillR = null;
  const tracked = nav ? [...nav.querySelectorAll('a[href^="#"]')].filter(a => !a.classList.contains('nav-get-started') && d.querySelector(a.getAttribute('href'))) : [];
  const movePill = (link) => {
    if (!pill || !nav) return;
    if (!link) { pill.classList.remove('show'); return; }
    const l = link.offsetLeft, r = nav.clientWidth - (link.offsetLeft + link.offsetWidth);
    const first = pillL === null;
    const toRight = pillL !== null && l > pillL;
    // Le côté « avant » (dans le sens du mouvement) est rapide, le côté « arrière » suit plus lentement.
    const lead = '.36s cubic-bezier(.22,.8,.24,1)', trail = '.55s cubic-bezier(.65,.05,.25,1)';
    pill.style.transition = first ? 'none' : (toRight ? `right ${lead}, left ${trail}, opacity .25s` : `left ${lead}, right ${trail}, opacity .25s`);
    pill.style.setProperty('--l', l + 'px'); pill.style.setProperty('--r', r + 'px');
    pill.classList.add('show'); pillL = l; pillR = r;
  };
  if (tracked.length && !reduced) {
    pill = d.createElement('span'); pill.className = 'nav-pill'; pill.setAttribute('aria-hidden', 'true'); nav.prepend(pill);
    tracked.forEach(a => {
      a.addEventListener('mouseenter', () => movePill(a));
      a.addEventListener('focus', () => movePill(a));
      a.addEventListener('mouseleave', () => movePill(activeLink));
      a.addEventListener('blur', () => movePill(activeLink));
    });
  }
  const spy = () => {
    if (!tracked.length) return;
    const probe = window.innerHeight * .38;
    let cur = null;
    for (const a of tracked) { const t = d.querySelector(a.getAttribute('href')); if (t && t.getBoundingClientRect().top <= probe) cur = a; }
    // La fin de page (À propos) reste active jusqu'au bas.
    if (cur !== activeLink) {
      tracked.forEach(a => { a.classList.toggle('on', a === cur); if (a === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      activeLink = cur; movePill(cur);
    }
  };
  window.addEventListener('resize', () => { pillL = null; movePill(activeLink); });

  /* ---------- 4. Révélations : mouvements distincts, décalées ---------- */
  const mark = (sel, kind, step) => d.querySelectorAll(sel).forEach((el, i) => { el.setAttribute('data-reveal', kind); el.style.setProperty('--d', (i % 6) * (step || 80)); });
  if (!reduced && 'IntersectionObserver' in window) {
    root.classList.add('js-reveal');
    mark('.statement h2, .section-heading h2, .scene-copy h2, .final-cta h2, .intelligence-copy h2, .dan-section h2', 'clip', 0);
    mark('.eyebrow:not(.hero2 .eyebrow), .tm-rule', 'up', 0);
    mark('.problem-grid > div', 'up', 110);
    mark('.large-copy, .section-heading > p, .scene-copy > p, .intelligence-copy > p', 'up', 60);
    mark('.scene-list li, .security-list span', 'left', 90);
    mark('.capability', 'up', 70);
    mark('.plan-card', 'up', 100);
    mark('.faq-list details', 'up', 60);
    mark('.scene-capital .scene-media, .philo-media', 'wipe', 0);
    mark('.scene-lattice .scene-media', 'wipe-r', 0);
    mark('.scene-psy .scene-media', 'wipe', 0);
    mark('.preview-window', 'up', 120);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    d.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
    // Sécurité : ne laisse jamais un contenu masqué si l'observateur tarde.
    setTimeout(() => d.querySelectorAll('[data-reveal]:not(.in)').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in'); }), 2500);
  }

  /* ---------- 5. Profondeur et parallaxe au défilement ---------- */
  const hero = d.getElementById('hero');
  const parallax = [...d.querySelectorAll('[data-parallax]')];
  const grid = d.querySelector('.product-preview-grid');
  const cta = d.querySelector('.final-cta');
  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = window.innerHeight;
    if (hero) hero.style.setProperty('--hp', clamp(window.scrollY / (vh * .9), 0, 1).toFixed(3));
    if (reduced) return;
    const small = window.innerWidth <= 700;
    parallax.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const off = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty('--py', (-off * parseFloat(el.dataset.parallax || '.08') * (small ? 120 : 260)).toFixed(1) + 'px');
    });
    if (grid) { const r = grid.getBoundingClientRect(); grid.style.setProperty('--p', clamp((vh - r.top) / (vh * .75), 0, 1).toFixed(3)); }
    if (cta) { const r = cta.getBoundingClientRect(); cta.style.setProperty('--cp', clamp((vh - r.top) / (vh + r.height), 0, 1).toFixed(3)); }
  };
  const onScroll = () => { syncHeader(); spy(); if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- 6. Scène 3D en direct (premier écran) ----------
     Sur un appareil capable uniquement ; sinon l'image pré-calculée reste affichée. */
  const canvas = d.querySelector('.hero2-live');
  const live = async () => {
    if (!canvas || !hero) return;
    const force = /[?&]live=1/.test(location.search);
    const conn = navigator.connection || {};
    const capable = matchMedia('(min-width:901px)').matches && !reduced && !conn.saveData &&
      (navigator.hardwareConcurrency || 4) >= 6 && (navigator.deviceMemory || 8) >= 4;
    if (!force && !capable) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return;
    let src;
    try { const r = await fetch('/site-assets/tm-scene.glsl?v=1'); if (!r.ok) return; src = await r.text(); } catch (e) { return; }
    const sh = (type, code) => { const s = gl.createShader(type); gl.shaderSource(s, code); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}');
    const fs = sh(gl.FRAGMENT_SHADER, '#define LIVE\n#define SCENE 1\n' + src);
    if (!vs || !fs) return;
    const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(pr, n);
    const uFull = U('uFull'), uOff = U('uOff'), uTime = U('uTime'), uCam = U('uCam'), uTarget = U('uTarget'), uMouse = U('uMouse');
    // Même cadrage que l'image pré-calculée (16:9) : le fondu enchaîné reste invisible.
    const W0 = 16, H0 = 9; let scale = .5;
    const size = () => { const w = Math.round(960 * scale / .5), h = Math.round(w * H0 / W0); canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); };
    size();
    let mx = 0, my = 0, tx = 0, ty = 0;
    if (!force) window.addEventListener('pointermove', e => { tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
    let visible = true, running = true, last = 0, frames = 0, slow = 0, t0 = performance.now(), shown = false;
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(hero);
    const stop = () => { running = false; canvas.classList.remove('on'); setTimeout(() => canvas.remove(), 900); };
    const draw = (now) => {
      if (!running) return;
      requestAnimationFrame(draw);
      if (!visible || d.hidden) { last = 0; return; }
      if (now - last < 30) return;          // ~30 images/s
      const dt = last ? now - last : 33; last = now;
      mx += (tx - mx) * .06; my += (ty - my) * .06;
      const p = clamp(window.scrollY / (innerHeight * .9), 0, 1);
      gl.uniform2f(uFull, canvas.width, canvas.height); gl.uniform2f(uOff, 0, 0);
      gl.uniform1f(uTime, 6 + (now - t0) / 1000);
      gl.uniform4f(uCam, .42 + p * .5, .10 + p * .04, 8.2 - p * 2.6, -.24);
      gl.uniform3f(uTarget, 0, .15, 0); gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) { shown = true; canvas.classList.add('on'); }
      // Garde-fou de performance : trop lent => on retombe sur l'image pré-calculée.
      frames++;
      if (frames > 8) { if (dt > 52) slow++; else slow = Math.max(0, slow - 1); }
      if (slow > 14 && scale > .36) { scale = .36; size(); slow = 0; }
      else if (slow > 24) { stop(); }
    };
    requestAnimationFrame(draw);
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); stop(); });
  };
  const idle = window.requestIdleCallback || (f => setTimeout(f, 600));
  window.addEventListener('load', () => idle(() => { live().catch(() => {}); }));
})();
