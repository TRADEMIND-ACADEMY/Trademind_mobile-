/* TRADEMIND — démo du produit (site public). Données fictives, tout reste dans la page. */
(() => {
  'use strict';
  const d = document, $ = id => d.getElementById(id); if (!$('dkList')) return;
  const fr = () => !(d.documentElement.lang || 'fr').startsWith('en');
  const fmt = n => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(1).replace('.', fr() ? ',' : '.');
  const trades = [
    { p: 'EURUSD', s: 0, r: 1.2, ok: true }, { p: 'XAUUSD', s: 1, r: -1.0, ok: true }, { p: 'US30', s: 0, r: 0.6, ok: false },
    { p: 'GBPUSD', s: 0, r: 1.8, ok: true }, { p: 'BTCUSD', s: 1, r: -0.5, ok: false }, { p: 'EURUSD', s: 1, r: 0.9, ok: true }
  ];
  const side = s => fr() ? (s ? 'Vente' : 'Achat') : (s ? 'Sell' : 'Buy');
  let pathLen = 0;
  const render = (fresh) => {
    const n = trades.length, ok = trades.filter(t => t.ok).length, net = trades.reduce((a, t) => a + t.r, 0);
    $('dkTrades').textContent = n; $('dkPlan').textContent = Math.round(100 * ok / n) + '%'; $('dkNet').textContent = fmt(net) + ' R';
    $('dkList').innerHTML = trades.slice().reverse().slice(0, 5).map((t, i) => `<div class="demo-row${fresh && i === 0 ? ' new' : ''}"><b>${t.p}</b><span>${side(t.s)}</span><span class="tag">${t.ok ? (fr() ? 'Plan respecté' : 'Plan followed') : (fr() ? 'Hors plan' : 'Off plan')}</span><span class="r ${t.r >= 0 ? 'up' : 'down'}">${fmt(t.r)} R</span></div>`).join('');
    let c = 0; const pts = [0].concat(trades.map(t => (c += t.r)));
    const lo = Math.min(...pts, -1), hi = Math.max(...pts, 1), y = v => 150 - ((v - lo) / (hi - lo)) * 130;
    $('dkPath').setAttribute('d', pts.map((v, i) => (i ? 'L' : 'M') + (i / (pts.length - 1) * 600).toFixed(1) + ' ' + y(v).toFixed(1)).join(' '));
    $('dkPath').classList.add('go');
    const used = Math.min(5, n), risk = 1.0;
    $('dgGuard').innerHTML = [
      [fr() ? 'Risque par trade' : 'Risk per trade', risk.toFixed(1).replace('.', fr() ? ',' : '.') + '% / 1,5%'.replace(',', fr() ? ',' : '.'), 66, false],
      [fr() ? 'Trades du jour' : 'Trades today', used + ' / 5', used * 20, used >= 5],
      [fr() ? 'Perte du jour' : 'Daily loss', fr() ? '0,5 R / 3 R' : '0.5 R / 3 R', 17, false]
    ].map(g => `<div class="demo-g${g[3] ? ' warn' : ''}"><header><span>${g[0]}</span><b>${g[1]}</b></header><i><u style="width:${g[2]}%"></u></i></div>`).join('');
  };
  render(false);
  d.querySelectorAll('.demo-tabs button').forEach(b => b.addEventListener('click', () => {
    d.querySelectorAll('.demo-tabs button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    d.querySelectorAll('.demo-panel').forEach(p => { p.hidden = p.dataset.panel !== b.dataset.tab; });
  }));
  $('demoAdd').addEventListener('click', () => {
    trades.push({ p: 'NAS100', s: 0, r: 0.8, ok: true }); render(true);
    window.tmToast && window.tmToast(fr() ? 'Trade NAS100 ajouté au journal de démonstration.' : 'NAS100 trade added to the demo journal.', { undo: () => { trades.pop(); render(false); } });
  });
  new MutationObserver(() => render(false)).observe(d.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
