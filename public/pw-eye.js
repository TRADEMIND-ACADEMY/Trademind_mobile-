/* TRADEMIND : bouton « afficher / masquer » sur tous les champs mot de passe (site, application, Owner), y compris les champs créés dynamiquement.
   Accessible : vrai <button>, aria-label FR/EN, aria-pressed, cible tactile 40 px, clavier (Tab / Espace / Entrée), focus et curseur conservés.
   Le mot de passe est de nouveau masqué à l'envoi du formulaire et quand l'onglet passe en arrière-plan. Aucune journalisation de la valeur. */
(function () {
  "use strict";
  if (window.__tmPwEye) return; window.__tmPwEye = true;
  var SHOW = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var HIDE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6A17.7 17.7 0 0 0 2 12s3.6 7 10 7a10.5 10.5 0 0 0 4.4-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  var css = ".tm-pw-wrap{position:relative;display:block;width:100%}.tm-pw-wrap>input{width:100%;padding-right:46px!important;box-sizing:border-box}.tm-pw-eye{position:absolute;right:3px;top:50%;transform:translateY(-50%);width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:10px;background:transparent;color:inherit;opacity:.72;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}.tm-pw-eye:hover,.tm-pw-eye:focus-visible{opacity:1}.tm-pw-eye:focus-visible{outline:2px solid currentColor;outline-offset:-2px}";
  var st = document.createElement("style"); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  var fr = function () { var l = ""; try { if (typeof ST !== "undefined" && ST.settings && ST.settings.lang) l = ST.settings.lang; } catch (e) {} l = l || document.documentElement.lang || localStorage.getItem("tm_lang") || navigator.language || "en"; return String(l).slice(0, 2) === "fr"; };
  var label = function (visible) { return fr() ? (visible ? "Masquer le mot de passe" : "Afficher le mot de passe") : (visible ? "Hide password" : "Show password"); };
  function enhance(input) {
    if (!input || input.__tmEye || input.type !== "password" || input.closest(".tm-pw-wrap")) return; input.__tmEye = true;
    var wrap = document.createElement("span"); wrap.className = "tm-pw-wrap"; input.parentNode.insertBefore(wrap, input); wrap.appendChild(input);
    var b = document.createElement("button"); b.type = "button"; b.className = "tm-pw-eye"; b.setAttribute("aria-pressed", "false"); b.innerHTML = SHOW; b.setAttribute("aria-label", label(false)); b.title = label(false);
    wrap.appendChild(b);
    var visible = false;
    var set = function (v) { visible = v; var s = input.selectionStart, e = input.selectionEnd; var focused = document.activeElement === input; input.type = v ? "text" : "password"; if (focused) { try { input.setSelectionRange(s, e); } catch (x) {} } b.innerHTML = v ? HIDE : SHOW; b.setAttribute("aria-pressed", v ? "true" : "false"); b.setAttribute("aria-label", label(v)); b.title = label(v); input.autocapitalize = "off"; input.spellcheck = false; };
    b.addEventListener("mousedown", function (ev) { ev.preventDefault(); }); b.addEventListener("pointerdown", function (ev) { if (document.activeElement === input) ev.preventDefault(); });
    b.addEventListener("click", function (ev) { ev.preventDefault(); set(!visible); });
    if (input.form) input.form.addEventListener("submit", function () { if (visible) set(false); });
    input.__tmEyeHide = function () { if (visible) set(false); };
  }
  function scan(root) { (root || document).querySelectorAll("input[type=password]").forEach(enhance); }
  document.addEventListener("visibilitychange", function () { if (document.hidden) document.querySelectorAll("input").forEach(function (i) { if (i.__tmEyeHide) i.__tmEyeHide(); }); });
  var mo = new MutationObserver(function (list) { for (var i = 0; i < list.length; i++) for (var j = 0; j < list[i].addedNodes.length; j++) { var n = list[i].addedNodes[j]; if (n.nodeType === 1) { if (n.matches && n.matches("input[type=password]")) enhance(n); else if (n.querySelectorAll) scan(n); } } });
  function boot() { scan(document); mo.observe(document.documentElement, { childList: true, subtree: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
