/* TradeMind : notifications intégrées (toast / confirmation / information).
   Remplace les fenêtres natives du navigateur (alert / confirm). Aucune dépendance. */
(function () {
  "use strict";
  if (window.tmUI) return;
  var lang = function () { var l = typeof window.tmLang === "function" ? window.tmLang() : window.tmLang; return String(l || document.documentElement.lang || "en").slice(0, 2) === "fr" ? "fr" : "en"; };
  var t = function (fr, en) { return lang() === "fr" ? fr : en; };

  var css = [
    ".tmui-toasts{position:fixed;z-index:2147483000;left:0;right:0;top:calc(10px + env(safe-area-inset-top,0px));display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;padding:0 12px}",
    ".tmui-toast{pointer-events:auto;display:flex;align-items:flex-start;gap:10px;max-width:min(420px,100%);width:max-content;padding:11px 14px;border-radius:14px;border:1px solid var(--border,var(--bd,rgba(255,255,255,.14)));background:var(--surface-elevated,var(--surface2,#1c1917));color:var(--text-primary,var(--text,var(--tx,#f4f0f6)));font:500 13px/1.4 var(--fb,Manrope,system-ui,sans-serif);box-shadow:0 14px 40px rgba(0,0,0,.35);opacity:0;transform:translateY(-8px);transition:opacity .22s ease,transform .22s ease}",
    ".tmui-toast.show{opacity:1;transform:none}",
    ".tmui-toast i{flex:none;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;font:700 11px/1 var(--fb,system-ui,sans-serif);font-style:normal;margin-top:1px;color:#0c0a09;background:var(--accent,#9FB0C4)}",
    ".tmui-toast.success i{background:var(--success,var(--ok,var(--good,#4ade80)))}",
    ".tmui-toast.error i{background:var(--danger,var(--bad,#f87171))}",
    ".tmui-toast.warn i{background:var(--warning,var(--warn,#f59e0b))}",
    ".tmui-toast span{min-width:0;overflow-wrap:anywhere}",
    ".tmui-overlay{position:fixed;inset:0;z-index:2147483100;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(5,4,8,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;transition:opacity .18s ease}",
    ".tmui-overlay.show{opacity:1}",
    ".tmui-dialog{width:min(380px,100%);max-height:calc(100dvh - 32px);overflow:auto;border-radius:18px;border:1px solid var(--border,var(--bd,rgba(255,255,255,.14)));background:var(--surface-elevated,var(--surface2,#1c1917));color:var(--text-primary,var(--text,var(--tx,#f4f0f6)));padding:18px 18px 14px;box-shadow:0 24px 70px rgba(0,0,0,.5);font:400 13.5px/1.5 var(--fb,Manrope,system-ui,sans-serif);transform:translateY(8px) scale(.98);transition:transform .18s ease}",
    ".tmui-overlay.show .tmui-dialog{transform:none}",
    ".tmui-dialog h3{margin:0 0 6px;font:700 15px/1.3 var(--fb,Manrope,system-ui,sans-serif);letter-spacing:0}",
    ".tmui-dialog p{margin:0;color:var(--text-secondary,var(--muted,var(--txm,#a1a1aa)));white-space:pre-line;overflow-wrap:anywhere}",
    ".tmui-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}",
    ".tmui-btn{appearance:none;border:1px solid var(--border,var(--bd,rgba(255,255,255,.18)));background:transparent;color:inherit;border-radius:10px;padding:9px 16px;font:600 13px/1 var(--fb,Manrope,system-ui,sans-serif);cursor:pointer;min-height:38px}",
    ".tmui-btn.primary{background:var(--accent,#9FB0C4);border-color:transparent;color:#0c0a09}",
    ".tmui-btn.danger{background:var(--danger,var(--bad,#f87171));border-color:transparent;color:#0c0a09}",
    ".tmui-btn:focus-visible{outline:2px solid var(--accent,#9FB0C4);outline-offset:2px}",
    "@media(prefers-reduced-motion:reduce){.tmui-toast,.tmui-overlay,.tmui-dialog{transition:none}}"
  ].join("");
  var style = document.createElement("style"); style.id = "tmui-style"; style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  var host = null;
  var toastHost = function () { if (!host) { host = document.createElement("div"); host.className = "tmui-toasts"; host.setAttribute("role", "status"); host.setAttribute("aria-live", "polite"); document.body.appendChild(host); } return host; };
  var ICON = { success: "✓", error: "!", warn: "!", info: "i" };

  function toast(message, opts) {
    opts = opts || {}; var type = opts.type || "info";
    var el = document.createElement("div"); el.className = "tmui-toast " + type;
    var icon = document.createElement("i"); icon.textContent = ICON[type] || "i"; icon.setAttribute("aria-hidden", "true");
    var text = document.createElement("span"); text.textContent = String(message == null ? "" : message);
    el.appendChild(icon); el.appendChild(text); toastHost().appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    var close = function () { el.classList.remove("show"); setTimeout(function () { el.remove(); }, 260); };
    var timer = setTimeout(close, opts.duration || (type === "error" ? 5200 : 3200));
    el.addEventListener("click", function () { clearTimeout(timer); close(); });
    return close;
  }

  function dialog(kind, message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var previous = document.activeElement;
      var overlay = document.createElement("div"); overlay.className = "tmui-overlay";
      var box = document.createElement("div"); box.className = "tmui-dialog"; box.setAttribute("role", kind === "confirm" ? "alertdialog" : "dialog"); box.setAttribute("aria-modal", "true");
      var title = document.createElement("h3"); title.textContent = opts.title || (kind === "confirm" ? t("Confirmation", "Confirmation") : t("Information", "Information")); title.id = "tmui-t" + Date.now();
      var body = document.createElement("p"); body.textContent = String(message == null ? "" : message);
      box.setAttribute("aria-labelledby", title.id);
      var actions = document.createElement("div"); actions.className = "tmui-actions";
      var done = function (value) { document.removeEventListener("keydown", onKey, true); overlay.classList.remove("show"); setTimeout(function () { overlay.remove(); if (previous && previous.focus) { try { previous.focus(); } catch (e) {} } }, 190); resolve(value); };
      var onKey = function (event) { if (event.key === "Escape") { event.stopPropagation(); done(kind === "confirm" ? false : true); } else if (event.key === "Tab") { var f = box.querySelectorAll("button"); if (!f.length) return; var first = f[0], last = f[f.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } };
      var ok = document.createElement("button"); ok.type = "button"; ok.className = "tmui-btn " + (opts.danger ? "danger" : "primary"); ok.textContent = opts.okText || "OK"; ok.onclick = function () { done(true); };
      if (kind === "confirm") { var cancel = document.createElement("button"); cancel.type = "button"; cancel.className = "tmui-btn"; cancel.textContent = opts.cancelText || t("Annuler", "Cancel"); cancel.onclick = function () { done(false); }; actions.appendChild(cancel); }
      actions.appendChild(ok); box.appendChild(title); box.appendChild(body); box.appendChild(actions); overlay.appendChild(box);
      overlay.addEventListener("click", function (event) { if (event.target === overlay) done(kind === "confirm" ? false : true); });
      document.addEventListener("keydown", onKey, true); document.body.appendChild(overlay);
      requestAnimationFrame(function () { overlay.classList.add("show"); ok.focus(); });
    });
  }

  window.tmUI = {
    t: t,
    toast: toast,
    confirm: function (message, opts) { return dialog("confirm", message, opts); },
    alert: function (message, opts) { return dialog("alert", message, opts); }
  };
})();
