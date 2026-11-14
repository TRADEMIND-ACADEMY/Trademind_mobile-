/* Site public : jamais de redirection automatique vers /app ; la connexion se fait par les boutons. */
(() => {
  const root = document.documentElement;
  const copy = (node, lang) => {
    const value = node.dataset?.[lang];
    if (value !== undefined) node.innerHTML = value;
  };
  const setLang = (lang) => {
    root.lang = lang;
    localStorage.setItem('tm_public_lang', lang);
    document.querySelectorAll('[data-fr][data-en]').forEach(node => copy(node, lang));
    if(lang==='fr'){const map={'ONE PROCESS · MANY LENSES':'UN PROCESSUS · PLUSIEURS LECTURES','RISK CONTROL':'MAÎTRISE DU RISQUE','IMPULSIVE ENTRIES':'ENTRÉES IMPULSIVES','PLAN ADHERENCE':'RESPECT DU PLAN','DATA QUALITY':'QUALITÉ DES DONNÉES','improving':'en amélioration','watch':'à surveiller','stable':'stable','PRIVATE BY DESIGN':'PRIVÉ PAR CONCEPTION','ABOUT TRADEMIND ACADEMY':'À PROPOS DE TRADEMIND ACADEMY','THE NEXT SESSION STARTS WITH ONE DECISION':'LA PROCHAINE SESSION COMMENCE PAR UNE DÉCISION','Master your trading. Master yourself.':'Maîtrisez votre trading. Maîtrisez-vous.','Essential Discipline':'Discipline essentielle','Growth & Intelligence':'Croissance & intelligence','Advanced Analysis':'Analyse avancée','Private Trading Intelligence':'Intelligence de trading privée','Dashboard de base':'Tableau de bord de base','Journal & Add Trade':'Journal et ajout de trade','Guardian basique':'Guardian basique','Statistiques fondamentales':'Statistiques fondamentales','Analytics & Evolution':'Analytics et évolution','Matrix & reviews':'Matrices et revues','Discipline & Plan adherence':'Discipline et respect du plan','Analyses historiques':'Analyses historiques','Matrix avancée':'Matrice avancée','Calendar & Data Quality':'Calendrier et qualité des données','Reporting avancé':'Reporting avancé','Tout APEX':'Tout APEX','DAN Sovereign':'DAN Sovereign','Synthesis of the process':'Synthèse du processus','Global trader journey':'Parcours global du trader','RISK CONTROL':'MAÎTRISE DU RISQUE','Platform':'Plateforme','Features':'Fonctionnalités','Membership':'Abonnement','About':'À propos','Login':'Connexion','Get Started':'Commencer','THE PRIVATE WORKSPACE':'L’ESPACE PRIVÉ','A product preview, not an abstract promise.':'Un aperçu du produit, pas une promesse abstraite.','Journal':'Journal','Guardian':'Guardian','Psychology':'Psychologie','Analytics':'Analyses','Evolution':'Évolution','Matrix':'Matrice','Reports':'Rapports','TradeMind Intelligence':'TradeMind Intelligence'};document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0){let v=el.textContent;Object.keys(map).forEach(k=>v=v.split(k).join(map[k]));el.textContent=v;}});}
    const lt = document.getElementById('langToggle'); if (lt) { lt.textContent = lang === 'fr' ? '🇫🇷' : '🇬🇧'; const nl = lang === 'fr' ? 'Switch to English' : 'Passer en français'; lt.setAttribute('aria-label', nl); lt.title = nl; }
    const mm = document.getElementById('mobileMenu'); if (mm) { const ml = lang === 'fr' ? 'Menu' : 'Menu'; mm.setAttribute('aria-label', ml); mm.title = ml; }
  };
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem('tm_public_theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = theme === 'night' ? '🌙' : '☀️';
      const tl = theme === 'night' ? (root.lang === 'fr' ? 'Activer le mode jour' : 'Switch to light mode') : (root.lang === 'fr' ? 'Activer le mode nuit' : 'Switch to dark mode'); btn.setAttribute('aria-label', tl); btn.title = tl;
    }
  };
  document.getElementById('langToggle')?.addEventListener('click', () => setLang(root.lang === 'fr' ? 'en' : 'fr'));
  document.getElementById('themeToggle')?.addEventListener('click', () => setTheme(root.dataset.theme === 'night' ? 'day' : 'night'));
  const mobileMenu = document.getElementById('mobileMenu'); const siteNav = document.querySelector('.site-nav'); mobileMenu?.addEventListener('click', () => { const open = siteNav?.classList.toggle('open'); mobileMenu.setAttribute('aria-expanded', String(Boolean(open))); }); siteNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { siteNav.classList.remove('open'); mobileMenu?.setAttribute('aria-expanded','false'); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && siteNav?.classList.contains('open')) { siteNav.classList.remove('open'); mobileMenu?.setAttribute('aria-expanded','false'); mobileMenu?.focus(); } });
  setLang(localStorage.getItem('tm_public_lang') || 'fr');
  setTheme(localStorage.getItem('tm_public_theme') || 'night');
})();

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
