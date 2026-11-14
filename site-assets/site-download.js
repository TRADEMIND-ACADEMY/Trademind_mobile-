/* TRADEMIND — section « Application mobile » : n'affiche un bouton que s'il existe un vrai lien. */
(() => {
  'use strict';
  const d = document, links = window.TM_MOBILE_LINKS || {};
  const a = d.getElementById('dlAndroid'), i = d.getElementById('dlIos'), soon = d.getElementById('dlSoon'); if (!a) return;
  const show = (el, href) => { if (href) el.href = href; el.hidden = false; if (soon) soon.hidden = true; };
  if (links.ios) show(i, links.ios);
  if (links.android) { show(a, links.android); return; }
  /* Pas de lien configuré : on vérifie que l'APK déposé dans /downloads existe vraiment. */
  fetch(a.getAttribute('href'), { method: 'HEAD' }).then(r => {
    const t = r.headers.get('content-type') || '';
    if (r.ok && !/text\/html/i.test(t)) show(a);
  }).catch(() => {});
})();
