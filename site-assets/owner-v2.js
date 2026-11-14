/* Owner : pilule qui glisse sur le menu + tableaux étiquetés pour l'affichage en cartes. */
(() => {
  const nav = document.querySelector('.owner-sidebar nav'); if (!nav) return;
  const g = document.createElement('i'); g.className = 'nav-glide'; nav.prepend(g);
  const move = () => { const a = nav.querySelector('.nav-item.active'); if (!a) return; g.style.height = a.offsetHeight + 'px'; g.style.transform = `translateY(${a.offsetTop}px)`; };
  new MutationObserver(move).observe(nav, { attributes: true, subtree: true, attributeFilter: ['class'] });
  addEventListener('resize', move); addEventListener('load', move); setTimeout(move, 200);
  const label = () => document.querySelectorAll('.data-table table:not(.tm-stack)').forEach(t => {
    const hs = [...t.querySelectorAll('thead th')].map(h => h.textContent.trim()); if (hs.length < 3) return;
    t.querySelectorAll('tbody tr').forEach(tr => [...tr.children].forEach((td, i) => hs[i] && td.setAttribute('data-label', hs[i]))); t.classList.add('tm-stack'); });
  let id; new MutationObserver(() => { clearTimeout(id); id = setTimeout(() => { label(); move(); }, 150); }).observe(document.body, { childList: true, subtree: true }); label();
})();
