/* TRADEMIND : accueil v2 : carrousel des plans (présentation seulement ; catalogue et prix restent ceux du backend). */
(() => {
  'use strict';
  const d = document, grid = d.querySelector('#plans .plan-grid'); if (!grid) return;
  let cur = 1, nav = null, x0 = null, moved = false, busy = false;
  const cards = () => [...grid.querySelectorAll('.plan-card')];
  const place = () => {
    const cs = cards(), st = Math.min(250, grid.clientWidth * .5);
    cs.forEach((c, i) => { const k = i - cur, a = Math.abs(k);
      c.style.transform = `translateX(${k * st}px) translateZ(${k ? -150 * a : 0}px) rotateY(${-k * 22}deg) scale(${k ? .86 : 1})`;
      c.style.filter = k ? `blur(${Math.min(4, a * 2.2)}px) brightness(.7)` : 'none';
      c.style.opacity = a > 2 ? 0 : (k ? .75 : 1); c.style.zIndex = 10 - a; c.style.pointerEvents = a > 2 ? 'none' : 'auto';
      c.classList.toggle('cf-side', !!k); c.tabIndex = k ? -1 : 0; });
    nav && [...nav.querySelectorAll('.cf-dot')].forEach((x, i) => x.classList.toggle('on', i === cur));
  };
  const go = i => { cur = Math.max(0, Math.min(cards().length - 1, i)); place(); };
  const init = () => {
    if (busy) return; busy = true;
    const cs = cards();
    if (cs.length < 3) { grid.classList.remove('cf-on'); busy = false; return; }
    grid.classList.add('cf-on');
    const h = Math.max(...cs.map(c => c.offsetHeight)); grid.style.height = (h + 24) + 'px';
    const rec = cs.findIndex(c => c.classList.contains('recommended')); if (rec >= 0 && !grid.dataset.cf) cur = rec;
    grid.dataset.cf = '1';
    if (!nav) { nav = d.createElement('div'); nav.className = 'cf-nav'; nav.innerHTML = '<button type="button" aria-label="Précédent">‹</button><span></span><button type="button" aria-label="Suivant">›</button>'; grid.after(nav);
      nav.children[0].onclick = () => go(cur - 1); nav.children[2].onclick = () => go(cur + 1); }
    nav.children[1].innerHTML = cs.map(() => '<i class="cf-dot"></i>').join('');
    cs.forEach((c, i) => c.onclick = e => { if (i !== cur) { e.preventDefault(); if (!moved) go(i); } });
    place(); busy = false;
  };
  grid.addEventListener('pointerdown', e => { x0 = e.clientX; moved = false; });
  addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 40) { moved = true; go(cur + (dx < 0 ? 1 : -1)); setTimeout(() => moved = false, 60); } x0 = null; });
  grid.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(cur + 1); if (e.key === 'ArrowLeft') go(cur - 1); });
  let t; new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { grid.style.height = ''; grid.classList.remove('cf-on'); init(); }, 60); }).observe(grid, { childList: true });
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { grid.style.height = ''; grid.classList.remove('cf-on'); requestAnimationFrame(init); }, 120); });
  addEventListener('load', () => setTimeout(init, 300)); init();
})();

/* aperçu : image selon la langue active (le contenu reste une vraie capture de démonstration) */
(() => {
  const img = document.getElementById('shotImg'), src = document.getElementById('shotSrc'); if (!img) return;
  const lang = () => { try { return (localStorage.getItem('tm_public_lang') || document.documentElement.lang || 'fr').slice(0, 2) === 'en' ? 'en' : 'fr'; } catch (e) { return 'fr'; } };
  const set = () => { const l = lang(); img.src = `/site-assets/scenes/app-demo-${l}-d.webp`; src.srcset = `/site-assets/scenes/app-demo-${l}-m.webp`; };
  set(); addEventListener('storage', set); document.addEventListener('click', e => { if (e.target.closest && e.target.closest('#langToggle')) setTimeout(set, 120); });
})();
