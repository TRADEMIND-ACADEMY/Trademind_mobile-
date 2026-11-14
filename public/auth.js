(() => {
  const USER_KEY = "tm_current_user";
  const rawStorage = window.localStorage;
  const keyForUser = key => { const uid = rawStorage.getItem(USER_KEY); return uid && key.startsWith("dtj_") ? `${uid}:${key}` : key; };
  const storage = new Proxy(rawStorage, { get(target, prop) { if (prop === "getItem") return key => target.getItem(keyForUser(key)); if (prop === "setItem") return (key, value) => target.setItem(keyForUser(key), value); if (prop === "removeItem") return key => target.removeItem(keyForUser(key)); return Reflect.get(target, prop); } });
  try { Object.defineProperty(window, "localStorage", { configurable: true, value: storage }); } catch {}
  const style = document.createElement("style"); style.textContent = `#tm-auth-backdrop{position:fixed;inset:0;z-index:10000;display:flex;overflow-y:auto;overscroll-behavior:contain;padding:18px;background:rgba(12,10,17,.78);backdrop-filter:blur(18px)}#tm-auth-card{width:min(440px,100%);margin:auto;padding:34px;border:1px solid color-mix(in srgb,var(--acc) 32%,var(--bd));border-radius:22px;background:linear-gradient(145deg,color-mix(in srgb,var(--surf2) 92%,transparent),color-mix(in srgb,var(--surf) 94%,transparent));box-shadow:0 30px 100px rgba(0,0,0,.48)}#tm-auth-card .tm-auth-logo{display:block;width:82px;height:82px;object-fit:cover;border-radius:16px;border:1px solid var(--bd);box-shadow:0 12px 30px var(--glow)}#tm-auth-card h1{font-family:var(--fd);font-size:22px;letter-spacing:1px;margin:10px 0 5px}#tm-auth-card p{color:var(--txm);font-size:12px;line-height:1.6;margin-bottom:18px}#tm-auth-card label{display:block;color:var(--txm);font:600 10px var(--fm);letter-spacing:1px;text-transform:uppercase;margin:12px 0 6px}#tm-auth-card input{margin:0}#tm-auth-card button{width:100%;margin-top:16px}.tm-auth-switch{margin-top:16px;text-align:center;color:var(--txm);font-size:11px}.tm-owner-entry{display:block;margin-top:12px;color:var(--txm);font-size:9px;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;opacity:.7}.tm-owner-entry:hover{color:var(--acc);opacity:1}.tm-auth-switch button{width:auto;margin:0 0 0 5px;padding:0;border:0;background:none;color:var(--acc);font:inherit;cursor:pointer}.tm-auth-error{min-height:17px;margin-top:10px;color:var(--bad);font-size:11px}.tm-auth-account{position:fixed;right:18px;bottom:18px;z-index:80;display:flex;gap:8px;align-items:center;padding:8px 10px;border:1px solid var(--bd);border-radius:12px;background:color-mix(in srgb,var(--surf) 90%,transparent);backdrop-filter:blur(12px);font-size:10px;color:var(--txm)}.tm-auth-account button{border:0;background:none;color:var(--acc);cursor:pointer;font:inherit}`; document.head.appendChild(style);

  const style2 = document.createElement("style"); style2.textContent = `
#tm-auth-backdrop{background:radial-gradient(ellipse 70% 50% at 50% -10%,color-mix(in srgb,var(--acc) 22%,transparent),transparent 70%),rgba(8,8,14,.86)}
#tm-auth-backdrop::before,#tm-auth-backdrop::after{content:"";position:fixed;width:46vmax;height:46vmax;border-radius:50%;filter:blur(70px);opacity:.28;pointer-events:none;animation:tmOrb 16s ease-in-out infinite alternate}
#tm-auth-backdrop::before{left:-14vmax;top:-12vmax;background:var(--acc)}
#tm-auth-backdrop::after{right:-16vmax;bottom:-16vmax;background:var(--acc2,#a76cf5);animation-duration:21s;animation-direction:alternate-reverse}
@keyframes tmOrb{to{transform:translate(8vmax,6vmax) scale(1.15)}}
#tm-auth-card{position:relative;z-index:1;animation:tmCardIn .8s cubic-bezier(.2,.8,.2,1) both;overflow:hidden}
#tm-auth-card::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;background:conic-gradient(from var(--tm-a,0deg),transparent 0 70%,var(--acc) 85%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:tmSpinBorder 6s linear infinite;pointer-events:none}
@property --tm-a{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes tmSpinBorder{to{--tm-a:360deg}}
@keyframes tmCardIn{from{opacity:0;transform:translateY(26px) scale(.96);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
#tm-auth-card .tm-auth-head{display:flex;align-items:center;gap:14px}
#tm-auth-card .tm-auth-logo{width:64px;height:64px;flex:none;animation:tmLogoPop 1s .15s cubic-bezier(.2,1.3,.3,1) both}
@keyframes tmLogoPop{from{opacity:0;transform:rotateY(-180deg) scale(.4)}to{opacity:1;transform:none}}
#tm-auth-card .tm-auth-head h1{margin:2px 0 0}
#tm-auth-card .tm-auth-lead{margin:14px 0 4px}
.tm-steps{display:flex;gap:6px;margin:6px 0 4px}
.tm-steps i{flex:1;height:4px;border-radius:4px;background:var(--bd);overflow:hidden;position:relative}
.tm-steps i::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--acc),var(--acc2,#a76cf5));transform:scaleX(0);transform-origin:left;transition:transform .55s cubic-bezier(.2,.8,.2,1)}
.tm-steps i.on::after{transform:scaleX(1)}
.tm-steplabel{display:flex;justify-content:space-between;color:var(--txm);font:600 10.5px var(--fm);letter-spacing:1px;text-transform:uppercase;margin-bottom:2px}
.tm-steplabel b{color:var(--acc)}
.tm-step{display:none}
.tm-step.on{display:block;animation:tmSlide .45s cubic-bezier(.2,.8,.2,1) both}
.tm-step.back.on{animation-name:tmSlideBack}
@keyframes tmSlide{from{opacity:0;transform:translateX(26px)}to{opacity:1;transform:none}}
@keyframes tmSlideBack{from{opacity:0;transform:translateX(-26px)}to{opacity:1;transform:none}}
#tm-auth-card .tm-field{position:relative}
#tm-auth-card input:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--acc) 24%,transparent);border-color:var(--acc);transition:box-shadow .2s,border-color .2s}
#tm-auth-card .tm-auth-switch button{width:auto;margin:0 0 0 6px;min-height:0}#tm-auth-card .tm-row{display:flex;gap:10px}#tm-auth-card .tm-row>div{flex:1;min-width:0}
#tm-auth-card .tm-actions{display:flex;gap:10px;margin-top:18px}
#tm-auth-card .tm-actions button{margin-top:0}
#tm-auth-card .tm-actions .tm-ghost{width:auto;flex:0 0 38%;background:transparent;border:1px solid var(--bd);color:var(--tx)}
#tm-auth-card .tm-pw-eye{width:40px!important;height:40px!important;margin:0!important;padding:0!important;min-height:0!important;position:absolute;right:3px;top:50%;transform:translateY(-50%);background:transparent!important;border:0!important;box-shadow:none!important}
#tm-auth-card .tm-pw-wrap>input{padding-right:48px!important}
.tm-meter{height:5px;border-radius:5px;background:var(--bd);margin:10px 0 6px;overflow:hidden}
.tm-meter b{display:block;height:100%;width:0;border-radius:5px;transition:width .35s,background .35s}
.tm-rules{display:grid;grid-template-columns:1fr 1fr;gap:3px 10px;margin:0;padding:0;list-style:none;font-size:10.5px;color:var(--txm)}
.tm-rules li::before{content:"○ ";opacity:.7}.tm-rules li.ok{color:var(--ok)}.tm-rules li.ok::before{content:"✓ ";opacity:1}
.tm-shake{animation:tmShake .45s}
@keyframes tmShake{20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
.tm-spin{display:inline-block;width:14px;height:14px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:tmRot .7s linear infinite;vertical-align:-2px;margin-right:8px}
@keyframes tmRot{to{transform:rotate(360deg)}}
.tm-success{text-align:center;padding:26px 0 8px;animation:tmSlide .5s both}
.tm-success svg{width:84px;height:84px}.tm-success circle{stroke:var(--ok);stroke-width:3;fill:none;stroke-dasharray:166;stroke-dashoffset:166;animation:tmDraw .7s .1s forwards}
.tm-success path{stroke:var(--ok);stroke-width:4;fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:48;stroke-dashoffset:48;animation:tmDraw .5s .6s forwards}
@keyframes tmDraw{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){#tm-auth-card,#tm-auth-card *,#tm-auth-backdrop::before,#tm-auth-backdrop::after{animation:none!important;transition:none!important}}
@media (max-width:420px){#tm-auth-card{padding:24px 20px}}`; document.head.appendChild(style2);
  const backdrop = document.createElement("div"); backdrop.id = "tm-auth-backdrop";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const isFr = () => String((typeof window.tmLang === "function" ? window.tmLang() : window.tmLang) || document.documentElement.lang || navigator.language || "en").slice(0, 2) === "fr";
  const T = (fr, en) => (isFr() ? fr : en);
  const resetToken = () => { const m = /(?:^|[#&])reset=([A-Za-z0-9_-]{40,64})/.exec(location.hash || ""); return m ? m[1] : ""; };
  const setHint = value => { try { if (!value) document.cookie = "tm_auth=; Max-Age=0; Path=/; SameSite=Lax"; } catch {} };
  const goHome = user => { window.location.href = user && user.role === "OWNER" ? "/owner" : "/app"; };
  const render = (mode = "login", error = "", info = "", keep = {}, step = 1) => {
    const register = mode === "register", forgot = mode === "forgot", reset = mode === "reset", login = mode === "login";
    const title = register ? T("Créer votre compte", "Create your account") : forgot ? T("Mot de passe oublié", "Forgot your password") : reset ? T("Nouveau mot de passe", "New password") : T("Bon retour", "Welcome back");
    const lead = register ? T("Votre journal, votre plan et vos analyses restent privés.", "Your journal, plan and analytics stay private to your account.") : forgot ? T("Saisissez l’adresse de votre compte. Vous recevrez un lien de réinitialisation à usage unique.", "Enter your account email. You will get a single-use reset link.") : reset ? T("Choisissez un nouveau mot de passe (8 caractères minimum).", "Choose a new password (8 characters minimum).") : T("Connectez-vous à votre espace de trading privé.", "Sign in to access your private trading intelligence workspace.");
    const fld = (id, name, label, type, extra = "") => `<div class="tm-field"><label for="${id}">${label}</label><input id="${id}" name="${name}" type="${type}" ${extra}></div>`;
    const identity = register ? `<div class="tm-step on" data-step="1"><div class="tm-row">${fld("tm-first-name", "firstName", T("Prénom", "First name"), "text", `autocomplete="given-name" maxlength="60" placeholder="${T("Votre prénom", "Your first name")}"`)}${fld("tm-last-name", "lastName", T("Nom", "Last name"), "text", `autocomplete="family-name" maxlength="60" placeholder="${T("Votre nom", "Your last name")}"`)}</div>${fld("tm-country", "country", T("Pays", "Country"), "text", `autocomplete="country-name" maxlength="80" placeholder="${T("Facultatif", "Optional")}"`)}${fld("tm-phone", "phone", T("Téléphone", "Phone"), "tel", `autocomplete="tel" maxlength="40" placeholder="${T("Facultatif", "Optional")}"`)}</div>` : "";
    const emailField = reset ? "" : fld("tm-email", "email", "Email", "email", `autocomplete="email" required placeholder="you@example.com"`);
    const pwField = forgot ? "" : fld("tm-password", "password", reset ? T("Nouveau mot de passe", "New password") : T("Mot de passe", "Password"), "password", `autocomplete="${login ? "current-password" : "new-password"}" minlength="8" maxlength="256" required placeholder="${T("8 caractères minimum", "At least 8 characters")}"`);
    const confirmField = register || reset ? fld("tm-confirm", "confirm", T("Confirmer le mot de passe", "Confirm password"), "password", `autocomplete="new-password" minlength="8" maxlength="256" required placeholder="${T("Répétez le mot de passe", "Repeat your password")}"`) : "";
    const strength = register || reset ? `<div class="tm-meter" aria-hidden="true"><b></b></div><ul class="tm-rules" aria-live="polite"><li data-r="len">${T("8 caractères", "8 characters")}</li><li data-r="case">${T("Majuscule + minuscule", "Upper + lower case")}</li><li data-r="num">${T("Un chiffre", "A digit")}</li><li data-r="same">${T("Mots de passe identiques", "Passwords match")}</li></ul>` : "";
    const account = register ? `<div class="tm-step" data-step="2">${emailField}${pwField}${confirmField}${strength}</div>` : `${emailField}${pwField}${confirmField}${strength}`;
    const submit = register ? T("Créer mon compte", "Create account") : forgot ? T("Envoyer la demande", "Send request") : reset ? T("Enregistrer", "Save") : T("Se connecter", "Sign in");
    const stepHead = register ? `<div class="tm-steplabel"><span id="tm-steptxt"></span><b id="tm-stepname"></b></div><div class="tm-steps" aria-hidden="true"><i></i><i></i></div>` : "";
    const actions = register ? `<div class="tm-actions"><button type="button" class="btn tm-ghost" id="tm-prev" hidden>${T("Retour", "Back")}</button><button class="btn primary" type="submit" id="tm-next">${T("Continuer", "Continue")}</button></div>` : `<button class="btn primary" type="submit">${esc(submit)}</button>`;
    const links = login ? `<div class="tm-auth-switch"><button type="button" id="tm-forgot">${esc(T("Mot de passe oublié ?", "Forgot password?"))}</button></div>` : "";
    const switchText = forgot || reset ? `<button type="button" id="tm-toggle">${esc(T("Retour à la connexion", "Back to sign in"))}</button>` : `${register ? T("Déjà un compte ?", "Already have an account?") : T("Nouveau sur TradeMind ?", "New to TradeMind?")}<button type="button" id="tm-toggle">${register ? T("Se connecter", "Sign in") : T("Créer un compte", "Create account")}</button>${login ? '<a class="tm-owner-entry" href="/owner">Owner access</a>' : ""}`;
    backdrop.innerHTML = `<section id="tm-auth-card" aria-labelledby="tm-auth-title"><div class="tm-auth-head"><img class="tm-auth-logo" src="/assets/trademind-official-logo.jpg" alt="TRADEMIND ACADEMY"><div><div class="eyebrow">TRADEMIND ACADEMY</div><h1 id="tm-auth-title">${esc(title)}</h1></div></div><p class="tm-auth-lead">${esc(lead)}</p>${stepHead}<form id="tm-auth-form" novalidate>${identity}${account}<div class="tm-auth-error" role="alert"></div>${info ? '<div class="tm-auth-info" role="status"></div>' : ""}${actions}</form>${links}<div class="tm-auth-switch">${switchText}</div></section>`;
    const card = backdrop.querySelector("#tm-auth-card"), formEl = backdrop.querySelector("form"), errBox = backdrop.querySelector(".tm-auth-error");
    errBox.textContent = error; if (error) card.classList.add("tm-shake");
    const infoBox = backdrop.querySelector(".tm-auth-info"); if (infoBox) { infoBox.textContent = info; infoBox.style.cssText = "margin-top:12px;font-size:12px;line-height:1.5;color:var(--acc)"; }
    Object.keys(keep).forEach(k => { const f = formEl.elements[k]; if (f) f.value = keep[k]; });
    backdrop.querySelector("#tm-toggle").onclick = () => { if (reset) history.replaceState(null, "", location.pathname); render(forgot || reset ? "login" : register ? "login" : "register"); };
    const forgotBtn = backdrop.querySelector("#tm-forgot"); if (forgotBtn) forgotBtn.onclick = () => render("forgot");
    const pw = formEl.elements.password, cf = formEl.elements.confirm;
    const rules = () => { if (!pw || !(register || reset)) return; const v = pw.value; const ok = { len: v.length >= 8, case: /[a-z]/.test(v) && /[A-Z]/.test(v), num: /\d/.test(v), same: !!v && v === (cf ? cf.value : "") }; let score = 0; Object.keys(ok).forEach(k => { const li = backdrop.querySelector(`[data-r=${k}]`); if (li) li.classList.toggle("ok", ok[k]); if (ok[k] && k !== "same") score++; }); if (v.length >= 12) score++; const bar = backdrop.querySelector(".tm-meter b"); if (bar) { bar.style.width = Math.min(100, score * 25) + "%"; bar.style.background = score <= 1 ? "var(--bad)" : score <= 2 ? "var(--warn)" : "var(--ok)"; } };
    if (pw) pw.addEventListener("input", rules); if (cf) cf.addEventListener("input", rules); rules();
    let cur = step;
    const showStep = (n, back) => { cur = n; backdrop.querySelectorAll(".tm-step").forEach(s => { const on = Number(s.dataset.step) === n; s.classList.toggle("on", on); s.classList.toggle("back", !!back); }); backdrop.querySelectorAll(".tm-steps i").forEach((i, k) => i.classList.toggle("on", k < n)); const t = backdrop.querySelector("#tm-steptxt"); if (t) { t.textContent = T(`Étape ${n} sur 2`, `Step ${n} of 2`); backdrop.querySelector("#tm-stepname").textContent = n === 1 ? T("Identité", "Identity") : T("Sécurité", "Security"); } const prev = backdrop.querySelector("#tm-prev"), next = backdrop.querySelector("#tm-next"); if (prev) prev.hidden = n === 1; if (next) next.textContent = n === 1 ? T("Continuer", "Continue") : submit; errBox.textContent = ""; const first = backdrop.querySelector(`.tm-step[data-step="${n}"] input`); if (first && !back && n > 1) setTimeout(() => first.focus(), 60); };
    if (register) { showStep(cur); const prev = backdrop.querySelector("#tm-prev"); prev.onclick = () => showStep(1, true); }
    const fail = (msg, el) => { errBox.textContent = msg; card.classList.remove("tm-shake"); void card.offsetWidth; card.classList.add("tm-shake"); if (el) el.focus(); return false; };
    const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const check = form => {
      if (register && cur === 1) { if (!String(form.get("firstName") || "").trim()) return fail(T("Indiquez votre prénom.", "Please enter your first name."), formEl.elements.firstName); return true; }
      if (!reset && !validEmail(String(form.get("email") || "").trim())) return fail(T("Adresse e-mail invalide.", "Invalid email address."), formEl.elements.email);
      if (forgot) return true;
      const v = String(form.get("password") || ""); if (v.length < 8) return fail(T("Le mot de passe doit contenir au moins 8 caractères.", "Password must be at least 8 characters."), pw);
      if ((register || reset) && v !== form.get("confirm")) return fail(T("Les mots de passe ne correspondent pas.", "Passwords do not match."), cf);
      return true;
    };
    formEl.onsubmit = async event => {
      event.preventDefault(); const form = new FormData(formEl); const submitBtn = formEl.querySelector("button[type=submit]");
      if (!check(form)) return;
      if (register && cur === 1) return showStep(2);
      const label = submitBtn.textContent; submitBtn.disabled = true; submitBtn.innerHTML = `<span class="tm-spin"></span>${esc(label)}`;
      const snapshot = {}; for (const [k, v] of form.entries()) if (k !== "password" && k !== "confirm") snapshot[k] = v;
      try {
        const language = isFr() ? "fr" : "en"; let path, payload;
        if (reset) { path = "/api/auth/reset"; payload = { token: resetToken(), newPassword: form.get("password"), confirmPassword: form.get("confirm"), language }; }
        else if (forgot) { path = "/api/auth/forgot"; payload = { email: form.get("email"), language }; }
        else { path = register ? "/api/auth/register" : "/api/auth/login"; payload = { firstName: form.get("firstName"), lastName: form.get("lastName"), country: form.get("country"), phone: form.get("phone"), email: form.get("email"), password: form.get("password"), confirmPassword: form.get("confirm"), language }; }
        const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
        const data = await response.json().catch(() => ({}));
        if (reset && response.ok) { history.replaceState(null, "", location.pathname); return render("login", "", T("Mot de passe modifié. Connectez-vous avec le nouveau mot de passe.", "Password changed. Sign in with your new password.")); }
        if (forgot && response.ok) return render("forgot", "", data.message || T("Demande enregistrée.", "Request recorded."), snapshot);
        if (!response.ok) return render(mode, response.status === 429 ? T("Trop de tentatives. Réessayez plus tard.", "Too many attempts. Try again later.") : (data.error || T("Authentification impossible.", "Unable to authenticate.")), "", snapshot, register ? 2 : 1);
        rawStorage.setItem(USER_KEY, data.user.id); rawStorage.setItem("tm_current_plan", data.user.plan || "FREE"); window.tmAccount = data.user;
        try { if (register) sessionStorage.setItem("tm_just_registered", "1"); } catch {}
        card.innerHTML = `<div class="tm-success"><svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="26.5"/><path d="M18 31l8 8 16-17"/></svg><h1 style="margin-top:12px">${esc(register ? T("Compte créé", "Account created") : T("Connexion réussie", "Signed in"))}</h1><p>${esc(T("Ouverture de votre espace…", "Opening your workspace…"))}</p></div>`;
        setTimeout(() => goHome(data.user), 900);
      } catch (networkError) { render(mode, T("Connexion impossible. Vérifiez votre réseau.", "Unable to connect. Check your network."), "", snapshot, register ? 2 : 1); }
    };
  };
  const account = user => {
    window.tmAccount = user;
    const planName = ({ FREE: "FOUNDATION", PRO: "ASCEND", "PRO MAX": "APEX", ELITE: "SOVEREIGN" })[user.plan] || user.identity || user.plan;
    const css = document.createElement("style"); css.textContent = `
.tm-acc-btn{position:relative;width:34px;height:34px;border-radius:50%;border:1px solid color-mix(in srgb,var(--acc) 55%,var(--bd));background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 35%,transparent),color-mix(in srgb,var(--acc2,#a76cf5) 35%,transparent));color:var(--tx);font:700 13px var(--fd);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0;flex:none}
.tm-acc-btn::after{content:"";position:absolute;right:-1px;bottom:-1px;width:9px;height:9px;border-radius:50%;background:var(--ok);border:2px solid var(--bg)}
.tm-acc-btn.tm-fixed{position:fixed;top:calc(env(safe-area-inset-top,0px) + 12px);right:14px;z-index:81}
.tm-acc-pop{position:fixed;top:calc(env(safe-area-inset-top,0px) + 66px);right:14px;z-index:9000;width:min(270px,calc(100vw - 28px));padding:14px;border:1px solid color-mix(in srgb,var(--acc) 30%,var(--bd));border-radius:16px;background:color-mix(in srgb,var(--surf2) 96%,transparent);backdrop-filter:blur(18px);box-shadow:0 24px 70px rgba(0,0,0,.4);display:none;animation:tmCardIn .25s both}
.tm-acc-pop.open{display:block}
.tm-acc-pop b{display:block;font:700 14px var(--fd);color:var(--tx)}
.tm-acc-pop small{display:block;color:var(--txm);font:500 10.5px var(--fm);margin-top:3px;word-break:break-all}
.tm-acc-pop .tm-acc-plan{display:inline-block;margin:10px 0 4px;padding:3px 9px;border-radius:99px;border:1px solid color-mix(in srgb,var(--acc) 45%,transparent);color:var(--acc);font:700 10px var(--fm);letter-spacing:.1em}
.tm-acc-pop a,.tm-acc-pop button{display:block;width:100%;margin-top:8px;padding:10px;border-radius:10px;border:1px solid var(--bd);background:transparent;color:var(--tx);font:600 12px var(--fh,inherit);text-align:center;text-decoration:none;cursor:pointer;min-height:40px;box-sizing:border-box}
.tm-acc-pop .tm-out{border-color:color-mix(in srgb,var(--bad) 45%,transparent);color:var(--bad)}`; document.head.appendChild(css);
    const initial = String(user.firstName || user.email || "T").trim().charAt(0).toUpperCase();
    const btn = document.createElement("button"); btn.type = "button"; btn.className = "tm-acc-btn"; btn.id = "tm-acc-btn"; btn.textContent = initial; btn.setAttribute("aria-haspopup", "true"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", T("Mon compte", "My account"));
    const pop = document.createElement("div"); pop.className = "tm-acc-pop"; pop.id = "tm-acc-pop"; pop.setAttribute("role", "menu");
    pop.innerHTML = `<b>${esc(user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : T("Mon compte", "My account"))}</b><small>${esc(user.tradeMindId || "")}</small><small>${esc(user.email)}</small><span class="tm-acc-plan">${esc(planName)}${user.role === "OWNER" ? " · OWNER" : ""}</span>${user.role === "OWNER" ? `<a href="/owner">${esc(T("Espace Owner", "Owner space"))}</a>` : ""}<button type="button" class="tm-out">${esc(T("Se déconnecter", "Log out"))}</button>`;
    const out = pop.querySelector(".tm-out");
    out.onclick = async () => { try { await fetch("/api/auth/logout", { method: "POST" }); } catch {} rawStorage.removeItem(USER_KEY); rawStorage.removeItem("tm_current_plan"); sessionStorage.removeItem("tm_demo_plan"); setHint(false); window.location.replace("/login"); };
    const toggle = open => { pop.classList.toggle("open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); };
    btn.onclick = e => { e.stopPropagation(); toggle(!pop.classList.contains("open")); };
    document.addEventListener("click", e => { if (!pop.contains(e.target) && e.target !== btn) toggle(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") toggle(false); });
    const place = () => { const bar = document.querySelector(".topbar .topactions"); if (bar) { bar.appendChild(btn); btn.classList.remove("tm-fixed"); return true; } return false; };
    document.body.appendChild(pop); if (!place()) { btn.classList.add("tm-fixed"); document.body.appendChild(btn); let n = 0; const t = setInterval(() => { if (place() || ++n > 20) clearInterval(t); }, 250); }
  };
  window.addEventListener("hashchange", () => { if (resetToken() && backdrop.isConnected) render("reset"); });
  window.addEventListener("DOMContentLoaded", async () => { const finishSessionBootstrap = () => document.documentElement.classList.remove("tm-session-pending"); let response; try { response = await fetch("/api/auth/me"); } catch (networkError) { finishSessionBootstrap(); const fr = (navigator.language || "").startsWith("fr"); const box = document.createElement("div"); box.id = "tm-offline-gate"; box.style.cssText = "position:fixed;inset:0;z-index:10001;display:grid;place-items:center;padding:20px;background:#0a0910;color:#f4f0f6;text-align:center;font:16px/1.5 system-ui,sans-serif"; box.innerHTML = `<div style="max-width:420px"><h1 style="font-size:22px">${fr ? "Vous êtes hors ligne" : "You are offline"}</h1><p style="color:#b6aebf">${fr ? "La connexion à votre compte nécessite Internet. Reconnectez-vous puis réessayez." : "Signing in to your account needs the internet. Reconnect and try again."}</p><button id="tm-offline-retry" style="min-height:46px;padding:0 22px;border-radius:12px;border:0;background:#7047b8;color:#fff;font:inherit;font-weight:700;cursor:pointer">${fr ? "Réessayer" : "Retry"}</button></div>`; document.body.appendChild(box); document.getElementById("tm-offline-retry").onclick = () => location.reload(); window.addEventListener("online", () => location.reload()); return; } if (!response.ok) { setHint(false); if (location.pathname !== "/login") { try { history.replaceState(null, "", "/login" + location.hash); } catch {} } document.body.appendChild(backdrop); render(resetToken() ? "reset" : "login"); finishSessionBootstrap(); return; } const data = await response.json(); if (location.pathname === "/login") { goHome(data.user); return; } rawStorage.setItem(USER_KEY, data.user.id); rawStorage.setItem("tm_current_plan", data.user.plan || "FREE"); account(data.user); { const sync = () => { try { window.tmApplyServerPlan?.(data.user, { silent: true }); } catch (error) {} }; sync(); if (document.readyState !== "complete") window.addEventListener("load", () => setTimeout(sync, 0), { once: true }); } finishSessionBootstrap(); });
})();
