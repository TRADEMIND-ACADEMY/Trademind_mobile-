/* Remplace les emojis des boutons (soleil, lune, drapeaux) par de vraies icônes / pastilles texte. */
(() => {
  const sun = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>';
  const ICON = { '🌙': moon, '☀️': sun, '☀': sun }, FLAG = { '🇫🇷': 'FR', '🇬🇧': 'EN' };
  const SEL = '#themeToggle,#langToggle,#themeBtn,#themeBtnMob,.tm-theme-icon,.tm-flag,.theme,.lang';
  const st = document.createElement('style'); st.textContent = '.tm-ico{display:inline-flex;align-items:center;justify-content:center;line-height:1}.tm-chip{font:700 11px/1 ui-monospace,monospace;letter-spacing:.06em}'; document.head.appendChild(st);
  const run = () => document.querySelectorAll(SEL).forEach(el => {
    if (el.querySelector('svg') && !el.children.length === false) {}
    const t = el.textContent.trim();
    if (ICON[t] && !el.querySelector('svg')) { el.innerHTML = ICON[t]; el.classList.add('tm-ico'); }
    else if (FLAG[t] && !el.children.length) { el.textContent = FLAG[t]; el.classList.add('tm-chip'); }
  });
  let id = 0; const go = () => { if (id) return; id = setTimeout(() => { id = 0; run(); }, 120); };
  const start = () => { run(); new MutationObserver(go).observe(document.body, { childList: true, characterData: true, subtree: true }); };
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', start) : start();
})();
