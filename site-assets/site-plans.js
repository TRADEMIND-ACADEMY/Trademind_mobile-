/* TRADEMIND : abonnements : lit le catalogue du backend (GET /api/billing/catalog, lecture seule).
   Si la lecture échoue, les cartes statiques d'origine restent affichées. Aucun prix ni droit n'est écrit ici. */
(() => {
  'use strict';
  const d = document, grid = d.querySelector('#plans .plan-grid'); if (!grid) return;
  const fr = () => !(d.documentElement.lang || 'fr').startsWith('en');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const slug = p => ({ FOUNDATION: 'foundation', ASCEND: 'ascend', APEX: 'apex', SOVEREIGN: 'sovereign' }[p.identity] || String(p.code).toLowerCase().replace(/\s+/g, ''));
  const price = p => p.priceUsdMonthly === 0 ? `$0 <small>${fr() ? 'pour toujours' : 'forever'}</small>` : `$${esc(Number.isInteger(p.priceUsdMonthly) ? p.priceUsdMonthly : p.priceUsdMonthly.toFixed(2))} <small>${fr() ? '/ mois' : '/ month'}</small>`;
  const quota = p => p.tradeLimit == null ? (fr() ? 'Trades illimités' : 'Unlimited trades') : (fr() ? `${p.tradeLimit} trades / mois` : `${p.tradeLimit} trades / month`);
  const REC = 'APEX';
  const cta = p => p.priceUsdMonthly === 0 ? (fr() ? 'Commencer gratuitement' : 'Start for free') : (fr() ? `Découvrir ${p.identity.charAt(0) + p.identity.slice(1).toLowerCase()}` : `Explore ${p.identity.charAt(0) + p.identity.slice(1).toLowerCase()}`);
  const render = (plans) => {
    grid.innerHTML = plans.map(p => `<article class="plan-card ${slug(p)}${p.identity === REC ? ' recommended' : ''}">
      ${p.identity === REC ? `<span class="plan-flag">${fr() ? 'RECOMMANDÉ' : 'RECOMMENDED'}</span>` : ''}
      <p class="plan-code">${esc(p.identity)}<small>${esc(p.code)}</small></p><h3>${esc(p.description)}</h3>
      <div class="price">${price(p)}</div><p class="limit">${esc(quota(p))}</p>
      <ul>${(p.features || []).map(f => { const m = /^Tout (\w+)/i.exec(f); return m ? `<li class="plan-inherit">${fr() ? 'Tout ' + esc(m[1]) + ', plus :' : 'Everything in ' + esc(m[1]) + ', plus:'}</li>` : `<li>${esc(f)}</li>`; }).join('')}</ul>
      <a class="button ${p.identity === REC ? 'primary' : 'outline'}" href="/app">${esc(cta(p))}</a></article>`).join('');
    // Comparaison : uniquement ce que le catalogue déclare. « Tout X » reprend les fonctions de X.
    const byId = Object.fromEntries(plans.map(p => [p.identity, p]));
    const has = (p, f) => (p.features || []).some(x => x === f) || (p.features || []).some(x => { const m = /^Tout (\w+)/i.exec(x); return m && byId[m[1].toUpperCase()] && has(byId[m[1].toUpperCase()], f); });
    const feats = [...new Set(plans.flatMap(p => (p.features || []).filter(f => !/^Tout /i.test(f))))];
    let host = d.querySelector('#plans .plan-compare'); if (!host) { host = d.createElement('div'); host.className = 'plan-compare'; grid.after(host); }
    host.innerHTML = `<h3>${fr() ? 'Nouveautés de chaque plan' : 'What each plan adds'}</h3><div class="pc-scroll"><table><thead><tr><th></th>${plans.map(p => `<th>${esc(p.identity)}</th>`).join('')}</tr></thead><tbody>
      <tr><th>${fr() ? 'Trades par mois' : 'Trades per month'}</th>${plans.map(p => `<td class="num">${p.tradeLimit == null ? '∞' : esc(p.tradeLimit)}</td>`).join('')}</tr>
      ${feats.map(f => `<tr><th>${esc(f)}</th>${plans.map(p => { const own = (p.features || []).includes(f); return `<td class="${own ? 'yes' : 'no'}" aria-label="${own ? (fr() ? 'nouveau dans ce plan' : 'new in this plan') : (fr() ? 'déjà inclus ou non listé' : 'already included or not listed')}">${own ? '✓' : ''}</td>`; }).join('')}</tr>`).join('')}
      </tbody></table></div><p class="pc-note">${fr() ? 'Chaque plan inclut tout le plan précédent : seules les nouveautés sont cochées. Source : catalogue des abonnements. Le paiement est confirmé par l’Owner avant toute activation.' : 'Each plan includes everything in the previous one: only what is new is ticked. Source: subscription catalog. Payment is confirmed by the Owner before any activation.'}</p>`;
  };
  fetch('/api/billing/catalog', { headers: { accept: 'application/json' } }).then(r => r.ok ? r.json() : Promise.reject()).then(j => { if (Array.isArray(j.plans) && j.plans.length) render(j.plans); }).catch(() => {});
})();
