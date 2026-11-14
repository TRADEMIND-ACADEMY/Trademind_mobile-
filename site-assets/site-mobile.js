/* TRADEMIND : orientation Web / Mobile. Aucune redirection automatique : tout passe par un clic.
   Un bouton de téléchargement n'apparaît que si un lien est réellement configuré (site-config.js). */
(() => {
  'use strict';
  const d = document, L = window.TM_MOBILE_LINKS || {};
  const ua = navigator.userAgent || '';
  const platform = /android/i.test(ua) ? 'android' : /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'ios' : null;
  const isHttps = u => { try { return /^https:\/\//i.test(u) && !!new URL(u); } catch (e) { return false; } };
  const isOpen = u => { try { return /^[a-z][a-z0-9+.-]*:\/\//i.test(u) && !/^(javascript|data|file|blob):/i.test(u); } catch (e) { return false; } };
  const lang = () => (d.documentElement.lang || 'fr').startsWith('en') ? 'en' : 'fr';
  const T = { fr: { dl: { android: 'Télécharger pour Android', ios: 'Télécharger pour iOS' }, open: "Ouvrir l'application", install: 'Installer sur cet appareil', title: 'Profitez de TradeMind sur votre mobile.', cont: 'Continuer sur le navigateur', close: 'Fermer', hint: "Pour l'installer : menu du navigateur, puis « Ajouter à l'écran d'accueil »." },
              en: { dl: { android: 'Download for Android', ios: 'Download for iOS' }, open: 'Open the app', install: 'Install on this device', title: 'Enjoy TradeMind on your mobile.', cont: 'Continue in the browser', close: 'Close', hint: 'To install: browser menu, then "Add to Home Screen".' } };
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  let deferred = null;
  const links = () => {
    const out = [], t = T[lang()];
    const plats = platform ? [platform] : ['android', 'ios'];
    plats.forEach(p => { if (isHttps(L[p])) out.push({ href: L[p], label: t.dl[p], primary: true, ext: true }); });
    plats.forEach(p => { const k = p === 'android' ? 'openAndroid' : 'openIos'; if (isOpen(L[k])) out.push({ href: L[k], label: t.open }); });
    return out;
  };
  const a = (o, cls) => { const e = d.createElement('a'); e.href = o.href; e.className = cls; e.textContent = o.label; if (o.ext) { e.rel = 'noopener'; e.target = '_blank'; } return e; };
  const installBtn = (cls) => { const b = d.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = T[lang()].install; b.addEventListener('click', async () => { if (!deferred) return; deferred.prompt(); try { await deferred.userChoice; } catch (e) {} deferred = null; render(); closeBanner(true); }); return b; };

  /* --- Carte « TRADEMIND MOBILE » --- */
  const render = () => {
    const box = d.getElementById('mobileActions'), note = d.getElementById('mobileNote'); if (!box) return;
    box.querySelectorAll('[data-dyn]').forEach(n => n.remove());
    const ls = links();
    ls.forEach(o => { const e = a(o, 'button ' + (o.primary ? 'primary' : 'outline')); e.dataset.dyn = '1'; box.prepend(e); });
    if (deferred && !standalone) { const b = installBtn('button outline'); b.dataset.dyn = '1'; box.prepend(b); }
    if (note) note.hidden = ls.length > 0 || !!deferred;
  };

  /* --- Bandeau discret sur navigateur mobile --- */
  const KEY = 'tm_mobile_prompt';
  const dismissed = () => { try { const v = +localStorage.getItem(KEY); return v && Date.now() - v < 14 * 864e5; } catch (e) { return false; } };
  const remember = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} };
  let banner = null;
  const closeBanner = (save) => { if (banner) { const b = banner; banner = null; b.classList.remove('show'); setTimeout(() => b.remove(), 300); } if (save) remember(); };
  const showBanner = () => {
    if (banner || !platform || standalone || dismissed()) return;
    const ls = links();
    const t = T[lang()];
    banner = d.createElement('aside'); banner.className = 'mobile-prompt'; banner.setAttribute('role', 'dialog'); banner.setAttribute('aria-label', t.title);
    banner.innerHTML = '<p class="mp-title"></p><div class="mp-actions"></div><button type="button" class="mp-close" aria-label=""></button>';
    banner.querySelector('.mp-title').textContent = t.title; banner.querySelector('.mp-close').setAttribute('aria-label', t.close); banner.querySelector('.mp-close').textContent = '✕';
    const act = banner.querySelector('.mp-actions'); if (!ls.length && !deferred) { const h = d.createElement('p'); h.className = 'mp-hint'; h.textContent = t.hint; act.appendChild(h); }
    ls.forEach(o => act.appendChild(a(o, 'button ' + (o.primary ? 'primary' : 'outline'))));
    if (deferred) act.appendChild(installBtn('button primary'));
    const c = d.createElement('button'); c.type = 'button'; c.className = 'mp-continue'; c.textContent = t.cont; c.addEventListener('click', () => closeBanner(true)); act.appendChild(c);
    banner.querySelector('.mp-close').addEventListener('click', () => closeBanner(true));
    d.body.appendChild(banner); requestAnimationFrame(() => banner.classList.add('show'));
  };

  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; render(); showBanner(); });
  window.addEventListener('appinstalled', () => { deferred = null; render(); });
  render();
  setTimeout(showBanner, 1800);
})();
