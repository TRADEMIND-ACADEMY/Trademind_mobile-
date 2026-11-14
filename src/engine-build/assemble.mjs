import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const b = f => fs.readFileSync(path.join(root, 'build', f), 'utf8');

const head = b('new-head.html');
const body = b('new-body.html');
const core1 = b('core1.js');
const core2 = b('core2.js');
const core3 = b('core3.js');
const core4 = b('core4.js');
const core5 = b('core5.js');
const ov4 = b('ov4.js');

const CHART = '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>';

const out = [
  head,
  body,
  CHART,
  '<script>', core1, '</script>',
  '<script>', core2, '</script>',
  '<script>', core3, '</script>',
  '<script>', core4, '</script>',
  '<script>', core5, '</script>',
  '<script>', ov4, '</script>',
  '</body>',
  '</html>',
  '',
].join('\n');

const target = path.join(root, 'TRADEMIND-ACADEMY-FINAL.html');

// --- validation: JS parse every script block ---
const blocks = [...out.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let bad = 0;
blocks.forEach((code, i) => {
  try { new Function(code); }
  catch (e) { bad++; console.error(`\n❌ JS parse error in inline script #${i + 1}: ${e.message}`); }
});
console.log(`inline scripts: ${blocks.length} · parse errors: ${bad}`);

// --- validation: required DOM ids present ---
const ids = `splash introCanvas skipIntro cursor themeBtnDesk themeBtnMob cmdBtn
dashEmpty dashBody heroEq heroDelta greetTxt deckStatement perfRow curveTabs equityChart streamTip streamStats capGrid coachList discCard traderCard
evoEmpty evoBody evoRange evoStats evoCurveToggle evoTabs evoTabBody
jSearch jDir journalList
tradeForm editId ntEyebrow ntTitle f_date f_time f_symbol dirBuy dirSell f_session f_setup f_entry f_sl f_tp f_lot f_risk f_result f_pnl f_notes calcPreview guardStatus smcChecklist smcScoreVal smcScoreCat psyBefore psyAfter
anEmpty anBody wlChart symChart sessChart statsTabs statsHubBody heatTabs heatGrid journeyList
s_bal s_cur s_theme s_lang p_maxrisk p_maxtrades p_maxdailyloss p_maxconsec p_minrr p_sessions p_setups
cmdk cmdkInput cmdkList modalOverlay modalBody toast orbitalDock`.split(/\s+/).filter(Boolean);
const missing = ids.filter(id => !new RegExp(`id=["']${id}["']`).test(body));
if (missing.length) { console.error('❌ missing ids:', missing.join(', ')); }
else console.log(`dom ids: ${ids.length} present`);

if (bad === 0 && missing.length === 0) {
  fs.writeFileSync(target, out);
  console.log(`✅ wrote ${path.basename(target)} (${out.length} bytes)`);
} else {
  console.error('✋ not written — fix errors above');
  process.exit(1);
}
