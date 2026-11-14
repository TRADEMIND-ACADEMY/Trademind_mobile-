/* Enregistre le service worker et signale proprement la perte de connexion (aucun faux mode hors-ligne). */
(() => {
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
  const fr = () => (window.tmLang ? window.tmLang() : (navigator.language || "").startsWith("fr") ? "fr" : "en") === "fr";
  let bar = null;
  const show = () => { if (bar) return; bar = document.createElement("div"); bar.setAttribute("role", "status"); bar.style.cssText = "position:fixed;left:12px;right:12px;bottom:70px;z-index:9800;padding:10px 14px;border-radius:12px;background:#2b2233;color:#fff;font:600 13px/1.4 system-ui,sans-serif;text-align:center;border:1px solid rgba(255,255,255,.2)"; bar.textContent = fr() ? "Hors ligne : connexion, paiements et synchronisation nécessitent Internet." : "Offline : sign-in, payments and sync need the internet."; document.body.appendChild(bar); };
  const hide = () => { bar?.remove(); bar = null; };
  addEventListener("offline", show); addEventListener("online", hide); if (!navigator.onLine) addEventListener("DOMContentLoaded", show);
})();

/* Installation sur l'écran d'accueil (PWA réelle, via l'invite du navigateur) et ouverture directe de l'app. */
(() => {
  const KEY = "tm_install_dismissed";
  const standalone = () => { try { return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch { return false; } };
  const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const ss = { get: k => { try { return sessionStorage.getItem(k); } catch { return null; } }, del: k => { try { sessionStorage.removeItem(k); } catch {} } };
  const fr = () => (window.tmUI ? window.tmUI.t("fr", "en") : "en") === "fr";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  let deferred = null, offered = false;

  // Application déjà installée : l'ouverture depuis l'icône va directement dans l'app.
  if (standalone() && location.pathname === "/") location.replace("/app");

  window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); deferred = event; schedule(); });
  window.addEventListener("appinstalled", () => { deferred = null; ls.set(KEY, String(Date.now() + 3650 * 864e5)); window.tmUI?.toast(fr() ? "TradeMind est installée sur votre téléphone." : "TradeMind is installed on your phone.", { type: "success" }); });

  const canOffer = () => !standalone() && window.tmAccount && window.tmUI && (deferred || ios);
  const dismissedRecently = () => Number(ls.get(KEY) || 0) > Date.now();

  async function offer(force) {
    if (offered || !canOffer() || (!force && dismissedRecently())) return;
    offered = true;
    if (deferred) {
      const yes = await window.tmUI.confirm(fr()
        ? "Ajoutez TradeMind à l’écran d’accueil de votre téléphone : l’application s’ouvre directement, sans passer par le navigateur ni par le site."
        : "Add TradeMind to your phone’s home screen: the app opens directly, without the browser or the website.",
        { title: fr() ? "Installer l’application" : "Install the app", okText: fr() ? "Installer" : "Install", cancelText: fr() ? "Plus tard" : "Later" });
      if (!yes) { ls.set(KEY, String(Date.now() + 7 * 864e5)); return; }
      try { const ev = deferred; deferred = null; await ev.prompt(); await ev.userChoice; } catch {}
    } else if (ios) {
      await window.tmUI.alert(fr()
        ? "Dans Safari, touchez le bouton Partager, puis « Sur l’écran d’accueil ». L’application s’ouvrira ensuite directement depuis son icône."
        : "In Safari, tap the Share button, then “Add to Home Screen”. The app will then open directly from its icon.",
        { title: fr() ? "Installer l’application" : "Install the app", okText: "OK" });
      ls.set(KEY, String(Date.now() + 14 * 864e5));
    }
  }

  let scheduled = false;
  function schedule() {
    if (offered || scheduled) return; scheduled = true;
    const justRegistered = ss.get("tm_just_registered") === "1";
    const wait = justRegistered ? 1500 : 6000; const start = Date.now(); let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (offered || tries > 45) return clearInterval(timer);
      if (Date.now() - start < wait || !canOffer()) return;
      clearInterval(timer); if (justRegistered) ss.del("tm_just_registered"); offer(justRegistered);
    }, 1000);
  }
  window.addEventListener("load", () => setTimeout(() => { if (ios || deferred) schedule(); }, 800));
  window.tmInstall = { available: () => Boolean(canOffer()), prompt: () => offer(true) };
})();
