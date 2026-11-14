/* ============================================================
   OV4 · NARRATIVE ORCHESTRATION LAYER  (presentation only)
   Reads the canonical pipeline — computed / runAnalytics /
   disciplineScore / coachInsights / checkCompliance /
   evaluateConfluences — and turns it into a visual story.
   Trade math is never recomputed. Every surface is wrapped so
   the journal engine can never be taken down by the visuals.
   ============================================================ */
(function(){
'use strict';
const FRMAP={
 'Discipline':'Discipline','Plan Echo':'Écho du Plan','Confluence Engine':'Moteur de Confluence',
 'Behavior Timeline':'Chronologie du Comportement','Live':'Direct','Equity Stream':'Flux de Capital',
 'Risk Lattice':'Grille de Risque','Behavior Signals':'Signaux du Comportement','rule pass cascade':'cascade de conformité',
 'Armed':'Armé','Fully aligned':'Aligné','Watch':'À surveiller','Breaking':'En rupture',
 'Holding':'Respectée','Validated':'Validé','Not met':'Non respecté','Neutral':'Neutre',
 'Strongest month':'Meilleur mois','Weakest month':'Pire mois','First logged trade':'Premier trade enregistré',
 'Loss cluster':'Série de pertes','Risk creep detected':'Dérive de risque détectée','Trajectory':'Trajectoire',
 'Revenge pattern':'Schéma de revanche','Recent':'Récent','Recurring':'Récurrent',
 'the beginning of the record.':'le début de l\u2019historique.','plan-driven':'piloté par le plan',
 'Configure Plan':'Configurer le plan',
 'No confluence rule is enabled in Plan Guardian. Configure them in Settings to arm this engine.':'Aucune règle de confluence n\u2019est activée. Configurez-les dans les Réglages pour armer ce moteur.',
 'The plan is not set. Define your risk ceiling, RR floor and allowed sessions in Settings — every logged trade will then be scored against it here.':'Le plan n\u2019est pas défini. Définissez votre plafond de risque, RR minimum et sessions autorisées dans les Réglages — chaque trade sera évalué ici.',
 'Peak Trade':'Meilleur trade','Worst Trade':'Pire trade','Average R':'R moyen','Max Drawdown':'Drawdown max',
 'of trades respect this rule':'des trades respectent cette règle','in a row':'d\u2019affilée',
 'Plan alignment across':'Conformité du plan sur','trades':'trades','Weighted cascade':'Cascade pondérée',
 'confirmations validated':'confirmations validées'
};
const tx=en=>(((ST.settings.lang||'en')==='fr')?(FRMAP[en]||en):en);
const safeEsc=v=>{try{return esc(v);}catch(e){return String(v==null?'':v);}};
const sgn=(n,d)=>{d=d==null?2:d;n=Number(n)||0;return (n>=0?'+':'')+n.toFixed(d);};
const reduceMotion=()=>!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const cssv=k=>getComputedStyle(document.documentElement).getPropertyValue(k).trim();

/* canvas cannot parse color-mix() — resolve to rgba */
function toRGBA(c,a){
  a=a==null?1:a;
  if(!c)return 'rgba(120,130,150,'+a+')';
  c=String(c).trim();let m;
  if(m=c.match(/^#([0-9a-f]{3})$/i)){const h=m[1];return 'rgba('+parseInt(h[0]+h[0],16)+','+parseInt(h[1]+h[1],16)+','+parseInt(h[2]+h[2],16)+','+a+')';}
  if(m=c.match(/^#([0-9a-f]{6})$/i)){const h=m[1];return 'rgba('+parseInt(h.slice(0,2),16)+','+parseInt(h.slice(2,4),16)+','+parseInt(h.slice(4,6),16)+','+a+')';}
  if(m=c.match(/^rgba?\(([^)]+)\)$/i)){const p=m[1].split(',').map(s=>s.trim());return 'rgba('+p[0]+','+p[1]+','+p[2]+','+a+')';}
  return c;
}

/* ---------------- 1 · SCROLL REVEAL --------------------- */
let _io=null;
function getIO(){
  if(_io)return _io;
  if(reduceMotion()||!('IntersectionObserver' in window))return null;
  _io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');_io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.05});
  return _io;
}
function observeReveals(){
  try{
    const root=document.querySelector('.view.active');if(!root)return;
    const sel='.sechead,.chartcard,.card,.panel,.statrow,.grid,.coachlist,.sigcard,.engine,.stream-card,.tcard,.empty,.cmpgrid,.pc-panel,.pc-section,.journey,.confluence-panel,.evtl';
    root.querySelectorAll(sel).forEach(el=>{
      if(el.closest('.hidden'))return;
      el.classList.add('tm-reveal');
      if(el.classList.contains('in'))return;
      if(reduceMotion()){el.classList.add('in');return;}
      const o=getIO();if(o)o.observe(el);else el.classList.add('in');
    });
    root.querySelectorAll('.stat').forEach((el,i)=>el.style.setProperty('--sweep',(34+i*11)%94+'%'));
  }catch(e){}
}
function stagger(root){
  try{if(!root)return;[].slice.call(root.children).forEach((el,i)=>el.style.setProperty('--i',i));root.classList.add('stagger');}catch(e){}
}

/* ---------------- 2 · GROUP SIGNALS --------------------- */
function perGroup(trades,keyFn){
  const g={};
  trades.forEach(t=>{const k=keyFn(t);if(!k)return;if(!g[k])g[k]={n:0,pnl:0,r:0,wins:0};const e=g[k];e.n++;e.pnl+=Number(t.pnl)||0;e.r+=Number(t._r)||0;if(t.result==='win')e.wins++;});
  return Object.entries(g).sort((a,b)=>b[1].pnl-a[1].pnl);
}

/* ---------------- 3 · DECK STATEMENT -------------------- */
function deckStatement(c){
  const n=c.total;if(!n)return '';
  const pct=p=>'<span class="'+(p>=0?'hlok':'hlbad')+'">'+sgn(p,2)+'%</span>';
  const parts=[];
  if(n<8){parts.push('You have <b>'+n+'</b> trades on the record. The sample is still thin — every logged trade sharpens the picture.');}
  else{parts.push('Across <b>'+n+'</b> closed trades you run a <span class="hl">'+c.winRate+'%</span> hit rate at <span class="hl">'+(isFinite(c.profitFactor)?c.profitFactor.toFixed(2):'∞')+'</span> profit factor — net return '+pct(c.ret)+'.');}
  const byPair=perGroup(c.trades,t=>t.symbol||'Other');
  if(byPair.length>=2){const b=byPair[0],w=byPair[byPair.length-1];
    if(b[1].pnl>0&&w[1].pnl<0)parts.push('Capital concentrates in <span class="hl">'+safeEsc(b[0])+'</span> (<b>'+fmt(b[1].pnl)+'</b>) while <span class="hlbad">'+safeEsc(w[0])+'</span> leaks <b>'+fmt(w[1].pnl)+'</b>.');
    else if(b[1].pnl>0)parts.push('Your strongest instrument is <span class="hl">'+safeEsc(b[0])+'</span> at <b>'+fmt(b[1].pnl)+'</b>.');}
  const bySess=perGroup(c.trades,t=>t.session||'Other');
  if(bySess.length>=2)parts.push('<span class="hl">'+safeEsc(bySess[0][0])+'</span> is your highest-yield session at <b>'+fmt(bySess[0][1].pnl)+'</b>.');
  const d=disciplineScore(c);
  parts.push('Discipline index <span class="hl">'+d.score+'</span> / 100 — grade <b>'+gradeOf(d.score)+'</b>.');
  return parts.join(' ');
}

/* ---------------- 4 · ORBITAL DISCIPLINE GAUGE ---------- */
function renderOrb(c){
  const d=disciplineScore(c);
  const R=52,C=2*Math.PI*R,r2=44,C2=2*Math.PI*r2;
  const off2=C2*(1-Math.min(100,Math.max(0,d.score))/100);
  const factors=Object.entries(d.factors||{});
  const labelOf=k=>{try{return tr('x.f_'+k.toLowerCase().replace(/[^a-z]/g,''));}catch(e){return k;}};
  const legend=factors.map(([k,v])=>'<div><i><b style="width:'+Math.max(0,Math.min(100,v))+'%"></b></i><span>'+safeEsc(labelOf(k))+'</span></div>').join('');
  return '<div class="orb"><svg viewBox="0 0 120 120" aria-hidden="true">'
    +'<defs><linearGradient id="tmOrbGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="var(--acc2)"/><stop offset="100%" stop-color="var(--acc)"/></linearGradient></defs>'
    +'<circle class="track" cx="60" cy="60" r="'+R+'"></circle>'
    +'<circle class="arc2" cx="60" cy="60" r="'+r2+'" stroke-dasharray="'+C2.toFixed(2)+'" stroke-dashoffset="'+off2.toFixed(2)+'"></circle>'
    +'<circle class="arc" cx="60" cy="60" r="'+R+'" stroke-dasharray="'+C.toFixed(2)+'" stroke-dashoffset="'+C.toFixed(2)+'"></circle>'
    +'</svg><div class="orb-core"><b class="num">'+d.score+'</b><small>'+tx('Discipline')+'</small><span class="grade">'+gradeOf(d.score)+'</span></div></div>'
    +'<div class="orb-legend">'+legend+'</div>';
}
window.renderDiscCard=function(c){
  try{
    const el=document.getElementById('discCard');if(!el)return;
    el.innerHTML=renderOrb(c);
    const arc=el.querySelector('.arc');
    if(arc){requestAnimationFrame(()=>{arc.style.strokeDashoffset=String(2*Math.PI*52*(1-Math.min(100,Math.max(0,disciplineScore(c).score))/100));});}
  }catch(e){console.warn('discCard',e);}
};

/* ---------------- 5 · CAPITAL STREAM (custom canvas) ---- */
function drawStream(curve){
  const canvas=document.getElementById('equityChart');if(!canvas||!canvas.getContext)return;
  const ctx=canvas.getContext('2d');
  const parent=canvas.parentElement;if(!parent)return;
  const dpr=Math.min(2,window.devicePixelRatio||1);
  const mobile=window.innerWidth<640;
  const cssH=mobile?210:292;
  const cssW=Math.max(240,parent.clientWidth);
  const prev=(canvas._tm&&canvas._tm.hover!=null)?canvas._tm.hover:-1;
  if(!canvas._tm||canvas._tm.cssW!==cssW||canvas._tm.cssH!==cssH||canvas._tm.dpr!==dpr){
    canvas.width=Math.round(cssW*dpr);canvas.height=Math.round(cssH*dpr);
    canvas.style.width='100%';canvas.style.height=cssH+'px';
  }
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,cssW,cssH);
  const pts=(curve||[]).slice(),n=pts.length;
  const mode=(typeof curveMode!=='undefined')?curveMode:'equity';
  if(!n){canvas._tm={xs:[],ys:[],pts:[],curve:curve,mode,hover:-1,cssW,cssH,dpr};return;}
  const acc=cssv('--acc')||'#4fe3d0',bad=cssv('--bad')||'#ff6b73',line=cssv('--line')||'rgba(255,255,255,.06)',txm=cssv('--txm')||'#7f889e';
  const val=p=>mode==='drawdown'?-(p.dd||0):(p.bal||0);
  let min=Infinity,max=-Infinity;pts.forEach(p=>{const v=val(p);if(v<min)min=v;if(v>max)max=v;});
  if(!isFinite(min)||!isFinite(max)){min=0;max=1;}
  if(max-min<1e-6){max+=1;min-=1;}
  const padT=18,padB=26,padL=6,padR=6,plotW=cssW-padL-padR,plotH=cssH-padT-padB;
  const X=i=>padL+plotW*(n===1?0.5:i/(n-1));
  const Y=v=>padT+plotH*(1-(v-min)/(max-min));
  ctx.strokeStyle=line;ctx.lineWidth=1;
  for(let g=0;g<4;g++){const y=padT+plotH*g/3;ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(cssW-padR,y);ctx.stroke();}
  if(mode==='equity'){
    let peak=-Infinity;ctx.beginPath();let started=false;
    pts.forEach((p,i)=>{const v=p.bal||0;peak=Math.max(peak,v);const x=X(i),yp=Y(peak);if(!started){ctx.moveTo(x,yp);started=true;}else ctx.lineTo(x,yp);});
    for(let i=n-1;i>=0;i--){let pk=-Infinity;for(let j=0;j<=i;j++)pk=Math.max(pk,pts[j].bal||0);ctx.lineTo(X(i),Y(pk));}
    ctx.closePath();ctx.fillStyle=toRGBA(bad,.09);ctx.fill();
  }
  const grad=ctx.createLinearGradient(0,padT,0,cssH-padB);
  grad.addColorStop(0,toRGBA(mode==='drawdown'?bad:acc,.22));grad.addColorStop(1,'rgba(0,0,0,0)');
  ctx.beginPath();ctx.moveTo(X(0),Y(val(pts[0])));
  for(let i=1;i<n;i++)ctx.lineTo(X(i),Y(val(pts[i])));
  ctx.lineTo(X(n-1),cssH-padB);ctx.lineTo(X(0),cssH-padB);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
  const stroke=mode==='drawdown'?bad:acc;
  ctx.beginPath();ctx.moveTo(X(0),Y(val(pts[0])));
  for(let i=1;i<n;i++)ctx.lineTo(X(i),Y(val(pts[i])));
  ctx.strokeStyle=stroke;ctx.lineWidth=1.9;ctx.lineJoin='round';ctx.lineCap='round';
  ctx.shadowColor=toRGBA(stroke,.55);ctx.shadowBlur=12;ctx.stroke();ctx.shadowBlur=0;
  const xs=[],ys=[];pts.forEach((p,i)=>{xs.push(X(i));ys.push(Y(val(p)));});
  const lx=xs[n-1],ly=ys[n-1];
  ctx.beginPath();ctx.arc(lx,ly,7,0,Math.PI*2);ctx.fillStyle=toRGBA(stroke,.18);ctx.fill();
  ctx.beginPath();ctx.arc(lx,ly,3.2,0,Math.PI*2);ctx.fillStyle=stroke;ctx.fill();
  ctx.fillStyle=txm;ctx.font='500 9px "JetBrains Mono",monospace';ctx.textBaseline='bottom';
  const idxs=n>3?[0,Math.floor((n-1)/2),n-1]:Array.from({length:n},(_,i)=>i);
  idxs.forEach(i=>{const lbl=(pts[i].symbol?pts[i].symbol+' · ':'')+String(pts[i].label||'');ctx.save();ctx.textAlign=i===0?'left':(i===n-1?'right':'center');ctx.fillText(lbl.slice(0,24),X(i),cssH-8);ctx.restore();});
  if(prev>=0&&prev<n){
    ctx.beginPath();ctx.moveTo(xs[prev],padT);ctx.lineTo(xs[prev],cssH-padB);ctx.strokeStyle=toRGBA(acc,.45);ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.arc(xs[prev],ys[prev],4.6,0,Math.PI*2);ctx.fillStyle=stroke;ctx.fill();
    ctx.beginPath();ctx.arc(xs[prev],ys[prev],9,0,Math.PI*2);ctx.strokeStyle=toRGBA(stroke,.4);ctx.lineWidth=1.4;ctx.stroke();
  }
  canvas._tm={xs,ys,pts:pts.map(p=>p),curve:curve,mode,hover:prev,cssW,cssH,dpr};
  attachStreamHandlers(canvas);
}
function attachStreamHandlers(canvas){
  if(canvas._tmBound)return;canvas._tmBound=true;
  const tip=document.getElementById('streamTip');
  function nearest(clientX){
    const st=canvas._tm;if(!st||!st.xs.length)return -1;
    const rect=canvas.getBoundingClientRect();const x=clientX-rect.left;
    let bi=0,bd=1e9;st.xs.forEach((px,i)=>{const dd=Math.abs(px-x);if(dd<bd){bd=dd;bi=i;}});return bi;
  }
  function show(clientX){
    const st=canvas._tm;if(!st||!tip)return;
    const i=nearest(clientX);if(i<0)return;
    if(st.hover===i&&tip.classList.contains('on'))return;
    const p=st.pts[i],lines=[];
    if(st.mode==='drawdown'){lines.push('Drawdown <b>'+fmt(-Math.abs(p.dd||0))+'</b>');}
    else{lines.push(p.symbol?safeEsc(p.symbol)+' · '+(p.direction==='buy'?'LONG':'SHORT'):'Account Start');
      lines.push('Capital <b>'+fmt(p.bal)+'</b>');
      if(p.pnl!==undefined&&p.idx)lines.push('Trade P&L <b>'+fmt(p.pnl)+'</b>');
      if(p.r!==undefined&&p.idx)lines.push('R <b>'+sgn(p.r)+'</b> · Cum <b>'+sgn(p.cumR,1)+'R</b>');}
    tip.innerHTML=lines.join('<br>');tip.classList.add('on');
    const cw=canvas.clientWidth,nxc=Math.max(8,Math.min(cw-8,st.xs[i]));
    tip.style.left=nxc+'px';tip.style.top='12px';
    tip.style.transform=(nxc>cw*0.62?'translateX(-105%)':'translateX(6%)');
    st.hover=i;drawStream(st.curve);
  }
  function hide(){if(tip)tip.classList.remove('on');const st=canvas._tm;if(st){st.hover=-1;drawStream(st.curve);}}
  canvas.addEventListener('pointermove',e=>show(e.clientX),{passive:true});
  canvas.addEventListener('pointerdown',e=>show(e.clientX),{passive:true});
  canvas.addEventListener('pointerleave',hide,{passive:true});
  canvas.addEventListener('pointercancel',hide,{passive:true});
}
window.drawEquity=function(curve){try{drawStream(curve);}catch(e){console.warn('stream',e);}};

/* ---------------- 6 · STREAM STATS ---------------------- */
function streamStats(c){
  const ts=c.trades||[];let best=null,worst=null,rs=0;
  ts.forEach(t=>{const v=Number(t.pnl)||0;if(best==null||v>best)best=v;if(worst==null||v<worst)worst=v;rs+=Number(t._r)||0;});
  const avgR=ts.length?rs/ts.length:0;
  return [['Peak Trade',best==null?'—':fmt(best),best>=0?'up':'down'],['Worst Trade',worst==null?'—':fmt(worst),'down'],['Average R',sgn(avgR,2)+'R',avgR>=0?'up':'down'],['Max Drawdown',fmt(c.maxDD),'down']]
    .map(x=>'<div class="stream-stat"><span>'+tx(x[0])+'</span><b class="num '+x[2]+'">'+x[1]+'</b></div>').join('');
}

/* ---------------- 7 · PLAN ECHO ------------------------- */
function planRules(plan,trades){
  const out=[];const set=v=>v!==undefined&&v!==null&&v!=='';
  const list=v=>v?String(v).split(',').map(s=>s.trim().toLowerCase()).filter(Boolean):[];
  const rrOf=t=>{const s=Math.abs((t.entry||0)-(t.sl||0));const w=t.tp?Math.abs(t.tp-(t.entry||0)):0;return s>0?w/s:0;};
  const dayMap={};trades.forEach(t=>{(dayMap[t.date]=dayMap[t.date]||[]).push(t);});
  if(set(plan.maxRisk)){const ok=trades.filter(t=>(Number(t.risk)||0)<=(Number(plan.maxRisk)||0)).length;out.push({l:'Risk Ceiling',pass:trades.length?ok/trades.length:0,d:(Number(plan.maxRisk))+'% max'});}
  if(set(plan.minRR)){const el=trades.filter(t=>t.tp);const ok=el.filter(t=>rrOf(t)>=(Number(plan.minRR)||0)).length;out.push({l:'Minimum RR',pass:el.length?ok/el.length:0,d:'1:'+(Number(plan.minRR)||0)+' min'});}
  const sess=list(plan.sessions);if(sess.length){const ok=trades.filter(t=>sess.includes(String(t.session||'').toLowerCase())).length;out.push({l:'Allowed Sessions',pass:trades.length?ok/trades.length:0,d:sess.length+' session(s)'});}
  const setups=list(plan.setups);if(setups.length){const el=trades.filter(t=>t.setup);const ok=el.filter(t=>setups.includes(String(t.setup).toLowerCase())).length;out.push({l:'Allowed Setups',pass:el.length?ok/el.length:0,d:setups.length+' setup(s)'});}
  if(set(plan.maxTrades)){const days=Object.keys(dayMap);const ok=days.filter(d=>dayMap[d].length<=(Number(plan.maxTrades)||0)).length;out.push({l:'Trades / Day',pass:days.length?ok/days.length:0,d:plan.maxTrades+' max/day'});}
  if(set(plan.maxDailyLoss)){const days=Object.keys(dayMap);const lim=Number(plan.maxDailyLoss)||0;const ok=days.filter(d=>{const net=dayMap[d].reduce((s,x)=>s+(Number(x.pnl)||0),0);return !(net<0&&Math.abs(net)>lim);}).length;out.push({l:'Daily Loss Cap',pass:days.length?ok/days.length:0,d:fmt(-lim)+' cap'});}
  if(set(plan.maxConsec)){let ms=0,s=0;trades.slice().sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach(t=>{if(t.result==='loss'){s++;ms=Math.max(ms,s);}else s=0;});const lim=Number(plan.maxConsec)||1;out.push({l:'Loss Streak Guard',pass:Math.max(0,Math.min(1,1-(ms/(lim||1)))),d:ms+' / '+lim+' seen'});}
  return out;
}
window.renderPlanEcho=function(){
  const host=document.getElementById('planEcho');if(!host)return;
  const plan=getPlan();const c=computed();const trades=c.trades||[];
  const rules=planRules(plan,trades);
  if(!rules.length){
    host.innerHTML='<div class="engine"><div class="engine-master"><div class="em-meta"><div class="em-title">'+tx('Plan Echo')+'</div><div class="em-calc">'+tx('The plan is not set. Define your risk ceiling, RR floor and allowed sessions in Settings — every logged trade will then be scored against it here.')+'</div></div><button class="btn sm primary" onclick="go(\'settings\')">'+tx('Configure Plan')+'</button></div></div>';
    return;
  }
  const score=Math.round((rules.reduce((s,r)=>s+r.pass,0)/rules.length)*100);
  const quality=score>=85?'A+ ALIGNED':score>=70?'B · DISCIPLINED':score>=50?'C · DRIFTING':'D · OFF-PLAN';
  let aligned=0;trades.forEach(t=>{try{if(checkCompliance(t,c,plan).status==='aligned')aligned++;}catch(e){}});
  const calc=rules.map(r=>Math.round(r.pass*100)+'%').join(' · ');
  host.innerHTML='<div class="engine"><div class="engine-master">'
    +'<div class="em-score num">'+score+'<small>/100</small></div>'
    +'<div class="em-meta"><div class="em-title">'+tx('Confluence Engine')+' · '+quality+'</div>'
    +'<div class="em-calc">'+tx('Plan alignment across')+' <b>'+trades.length+'</b> '+tx('trades')+' — '+tx('rule pass cascade')+' <b>'+calc+'</b></div></div>'
    +'<div class="engine-valid"><b class="num">'+aligned+'/'+trades.length+'</b><br>'+tx('Fully aligned')+'</div></div>'
    +'<div class="engine-list">'+rules.map((r,i)=>{
        const st=r.pass>=0.85?'valid':r.pass>=0.55?'neutral':'invalid';
        const stTitle=st==='valid'?tx('Holding'):st==='neutral'?tx('Watch'):tx('Breaking');
        return '<div class="erule '+st+'"><span class="enode">'+String(i+1).padStart(2,'0')+'</span><div><div class="ename">'+safeEsc(r.l)+'</div><div class="eproof"><b>'+Math.round(r.pass*100)+'%</b> '+tx('of trades respect this rule')+'<span class="eweight"> · '+safeEsc(r.d)+'</span></div></div><div class="emeta"><div class="estatus">'+stTitle+'</div><div class="conf-points num" style="font-family:var(--fd)">'+Math.round(r.pass*100)+'</div></div></div>';
      }).join('')+'</div></div>';
};
function ensurePlanEcho(){
  try{
    const capGrid=document.getElementById('capGrid');if(!capGrid||document.getElementById('planEcho'))return;
    const anchor=capGrid.nextElementSibling;
    const head=document.createElement('div');head.className='sechead';head.innerHTML='<span class="idx">04</span><h2>'+tx('Plan Echo')+'</h2><span class="rule"></span>';
    const box=document.createElement('div');box.id='planEcho';
    if(anchor){anchor.parentNode.insertBefore(head,anchor);anchor.parentNode.insertBefore(box,anchor);}
    else{capGrid.parentNode.appendChild(head);capGrid.parentNode.appendChild(box);}
  }catch(e){}
}

/* ---------------- 8 · CONFLUENCE ENGINE (form) ---------- */
window.renderConfluencePanel=function(t){
  try{
    const el=document.getElementById('confluencePanel');if(!el)return;
    const r=evaluateConfluences(t,getPlan());
    if(!r.items.length){el.innerHTML='<div class="engine"><div class="engine-master"><div class="em-meta"><div class="em-title">'+tx('Confluence Engine')+'</div><div class="em-calc">'+tx('No confluence rule is enabled in Plan Guardian. Configure them in Settings to arm this engine.')+'</div></div></div></div>';return;}
    const calc=r.items.map(x=>x.score+'×'+x.weight+'%').join(' + ');
    el.innerHTML='<div class="engine"><div class="engine-master">'
      +'<div class="em-score num">'+r.score+'<small>/100</small></div>'
      +'<div class="em-meta"><div class="em-title">'+safeEsc(r.quality)+'</div><div class="em-calc">'+tx('Weighted cascade')+' <b>'+calc+'</b> · '+r.valid+' / '+r.total+' '+tx('confirmations validated')+'</div></div>'
      +'<div class="engine-valid"><b>'+tx('Armed')+'</b><br>'+tx('plan-driven')+'</div></div>'
      +'<div class="engine-list">'+r.items.map((x,i)=>{
        const st=x.status;const stTitle=st==='valid'?tx('Validated'):st==='invalid'?tx('Not met'):tx('Neutral');
        return '<div class="erule '+st+'"><span class="enode">'+String(i+1).padStart(2,'0')+'</span><div><div class="ename">'+safeEsc(x.label)+'</div><div class="eproof">'+safeEsc(x.why)+'<br><b>Evidence · </b>'+safeEsc(x.proof)+'</div></div><div class="emeta"><div class="estatus">'+stTitle+'</div><div class="conf-points num" style="font-family:var(--fd)">'+x.score+'</div><div class="eweight">w '+x.weight+'%</div></div></div>';
      }).join('')+'</div></div>';
  }catch(e){console.warn('confluence',e);}
};

/* ---------------- 9 · BEHAVIOR TIMELINE ----------------- */
function behaviorTimeline(c){
  const trades=(c.trades||[]).slice(),items=[];
  if(!trades.length)return items;
  const first=trades[0];
  items.push({date:String(first.date||'').slice(0,7),title:tx('First logged trade'),body:safeEsc(first.symbol||'—')+' ('+(first.direction==='buy'?'Long':'Short')+') — '+tx('the beginning of the record.'),cls:'ok'});
  const byMonth={};trades.forEach(t=>{const m=String(t.date||'').slice(0,7);byMonth[m]=(byMonth[m]||0)+(Number(t.pnl)||0);});
  const months=Object.entries(byMonth).sort((a,b)=>b[1]-a[1]);
  if(months.length>=2){items.push({date:months[0][0],title:tx('Strongest month'),body:'Net '+fmt(months[0][1])+' in '+months[0][0]+'.',cls:'ok'});items.push({date:months[months.length-1][0],title:tx('Weakest month'),body:'Net '+fmt(months[months.length-1][1])+' in '+months[months.length-1][0]+'.',cls:'bad'});}
  let ms=0,s=0,end=null;trades.forEach(t=>{if(t.result==='loss'){s++;if(s>ms){ms=s;end=t.date;}}else s=0;});
  if(ms>=3)items.push({date:String(end||'').slice(0,7),title:tx('Loss cluster')+' · '+ms+' '+tx('in a row'),body:'A consecutive-loss streak peaked here. Plan Guardian caps this at '+(getPlan().maxConsec||'—')+'.',cls:'bad'});
  if(trades.length>=8){const l5=trades.slice(-5),rest=trades.slice(0,-5);const aL=l5.reduce((a,t)=>a+(Number(t.risk)||0),0)/5;const aR=rest.reduce((a,t)=>a+(Number(t.risk)||0),0)/rest.length;if(aL>aR*1.25)items.push({date:tx('Recent'),title:tx('Risk creep detected'),body:'Last 5 trades average '+aL.toFixed(2)+'% risk vs '+aR.toFixed(2)+'% historically.',cls:'warn'});}
  if(trades.length>=10){const half=Math.floor(trades.length/2);const d1=disciplineScore({trades:trades.slice(0,half)}).score,d2=disciplineScore({trades:trades.slice(half)}).score;
    items.push({date:tx('Trajectory'),title:'Discipline '+(d2>=d1?'improving':'under pressure'),body:'Discipline index moved '+d1+' → '+d2+' across your history.',cls:d2>=d1?'ok':'bad'});}
  const byIns={};trades.forEach((t,i)=>{if(t.result==='loss'&&t.flags&&(t.flags.includes('fomo')||t.flags.includes('revenge'))&&i>0&&trades[i-1].result==='loss'&&trades[i-1].date===t.date)byIns[t.date]=1;});
  const rev=Object.keys(byIns).length;
  if(rev>=2)items.push({date:tx('Recurring'),title:tx('Revenge pattern')+' · '+rev,body:'Entries taken same-day right after a loss — flagged FOMO/Revenge.',cls:'bad'});
  return items;
}
function renderBehaviorTimeline(){
  try{
    const host=document.getElementById('behaviorTimeline');if(!host)return;
    const c=computed();const items=behaviorTimeline(c);
    if(!items.length){host.innerHTML='';return;}
    const yrs=new Set((c.trades||[]).map(t=>String(t.date||'').slice(0,4)));
    host.innerHTML='<div class="sechead" style="margin-top:30px"><span class="idx">00</span><h2>'+tx('Behavior Timeline')+'</h2><span class="rule"></span><span class="tm-live">'+yrs.size+'y</span></div>'
      +'<div class="card panel evtl"><span class="evtl-line"></span>'+items.map(it=>'<div class="evtl-item '+(it.cls||'')+'"><span class="evtl-node"></span><div class="evtl-date">'+safeEsc(it.date)+'</div><div class="evtl-title">'+it.title+'</div><div class="evtl-body">'+it.body+'</div></div>').join('')+'</div>';
  }catch(e){console.warn('timeline',e);}
}
function ensureBehaviorTimeline(){
  const evo=document.getElementById('evoBody');if(!evo||document.getElementById('behaviorTimeline'))return;
  const box=document.createElement('div');box.id='behaviorTimeline';
  const tab=document.getElementById('evoTabBody');
  if(tab&&tab.parentNode)tab.parentNode.insertBefore(box,tab);else evo.appendChild(box);
}

/* ---------------- 10 · DASHBOARD ORCHESTRATION ---------- */
window.renderDashboard=function(){
  try{
    const c=computed();
    document.getElementById('dashEmpty').classList.toggle('hidden',c.total>0);
    document.getElementById('dashBody').classList.toggle('hidden',c.total===0);
    if(c.total===0)return;
    ensurePlanEcho();
    try{countUp(document.getElementById('heroEq'),c.bal,ST.settings.currency);}catch(e){document.getElementById('heroEq').textContent=fmt(c.bal);}
    const dEl=document.getElementById('heroDelta');
    dEl.textContent=(c.ret>=0?'+':'')+c.ret.toFixed(2)+'% · '+(c.netPnl>=0?'+':'')+fmt(c.netPnl);
    dEl.className='delta num '+(c.ret>=0?'up':'down');
    document.getElementById('perfRow').innerHTML=[
      '<div class="stat"><div class="stat-label">'+tr('dash.netPerf')+'</div><div class="stat-val num '+(c.ret>=0?'up':'down')+'">'+(c.ret>=0?'+':'')+c.ret.toFixed(2)+'%</div></div>',
      '<div class="stat"><div class="stat-label">'+tr('common.profitFactor')+'</div><div class="stat-val num">'+(isFinite(c.profitFactor)?c.profitFactor.toFixed(2):'∞')+'</div></div>',
      '<div class="stat"><div class="stat-label">'+tr('common.winRate')+'</div><div class="stat-val num">'+c.winRate+'%</div></div>',
      '<div class="stat"><div class="stat-label">'+tr('common.avgR')+'</div><div class="stat-val num '+(c.avgR>=0?'up':'down')+'">'+sgn(c.avgR,2)+'R</div></div>'
    ].join('');
    document.getElementById('capGrid').innerHTML=[
      [tr('common.startingBalance'),fmt(ST.settings.startingBalance)],[tr('common.equityHigh'),fmt(c.high)],[tr('common.maxDrawdown'),fmt(c.maxDD)],[tr('common.totalTrades'),c.total]
    ].map(x=>'<div class="lcell"><span>'+x[0]+'</span><b class="num">'+x[1]+'</b></div>').join('');
    const st=document.getElementById('deckStatement');if(st)st.innerHTML=deckStatement(c);
    drawStream(c.curve);
    const ss=document.getElementById('streamStats');if(ss)ss.innerHTML=streamStats(c);
    renderDiscCard(c);renderCoach(c);renderTraderCard(c);renderPlanEcho();
    observeReveals();
  }catch(e){console.warn('dashboard',e);}
};

/* ---------------- 11 · EVOLUTION ORCHESTRATION ---------- */
const _coreRenderEvolution=window.renderEvolution;
window.renderEvolution=function(){
  try{if(_coreRenderEvolution)_coreRenderEvolution();}catch(e){console.warn('evo core',e);}
  try{ensureBehaviorTimeline();renderBehaviorTimeline();observeReveals();}catch(e){console.warn('evo tl',e);}
};

/* ---------------- 12 · VIEW SWITCH / REVEAL ------------ */
const _coreGo=window.go;
window.go=function(v){
  try{if(_coreGo)_coreGo(v);}catch(e){console.warn('go',e);}
  try{
    const sec=document.getElementById('view-'+v);
    if(sec)stagger(sec.querySelector('.tm-flow')||sec);
    if(v==='dashboard')renderDashboard();
    if(v==='evolution')window.renderEvolution();
    if(v==='settings')setTimeout(ensurePlanEcho,0);
    observeReveals();
  }catch(e){}
};

/* ---------------- 13 · COMMAND PALETTE ------------------ */
function paletteCommands(){
  return [
    {label:tr('nav.dashboard'),hint:'G D',icon:'home',run:function(){go('dashboard');}},
    {label:tr('nav.evolution'),hint:'G E',icon:'evolution',run:function(){go('evolution');}},
    {label:tr('nav.journal'),hint:'G J',icon:'journal',run:function(){go('journal');}},
    {label:tr('nav.add'),hint:'G N',icon:'add',run:function(){go('newtrade');}},
    {label:tr('nav.analytics'),hint:'G P',icon:'analytics',run:function(){go('analytics');}},
    {label:tr('nav.settings'),hint:'G S',icon:'settings',run:function(){go('settings');}},
    {label:'Toggle theme',hint:'T',icon:'moon',run:function(){toggleThemeQuick();}},
    {label:'Load demo data',hint:'D',icon:'analytics',run:function(){loadDemo();}}
  ];
}
let _cmdItems=[],_cmdSel=0;
function renderCmdList(q){
  const list=document.getElementById('cmdkList');if(!list)return;
  const all=paletteCommands();q=(q||'').toLowerCase();
  _cmdItems=all.filter(c=>!q||c.label.toLowerCase().includes(q));if(!_cmdItems.length)_cmdItems=all;
  _cmdSel=Math.min(_cmdSel,Math.max(0,_cmdItems.length-1));
  list.innerHTML=_cmdItems.map((c,i)=>'<div class="cmdk-item '+(i===_cmdSel?'on':'')+'" data-i="'+i+'">'+svg(c.icon,1.6)+'<span>'+safeEsc(c.label)+'</span><span class="ci-hint">'+c.hint+'</span></div>').join('');
  list.querySelectorAll('.cmdk-item').forEach(el=>{el.onclick=function(){const c=_cmdItems[+el.dataset.i];closeCmd();if(c)c.run();};});
}
function openCmd(){const m=document.getElementById('cmdk');if(!m)return;m.classList.remove('hidden');_cmdSel=0;const inp=document.getElementById('cmdkInput');inp.value='';renderCmdList('');setTimeout(function(){inp.focus();},20);}
function closeCmd(){const m=document.getElementById('cmdk');if(m)m.classList.add('hidden');}
function bindCmd(){
  const m=document.getElementById('cmdk');if(!m||m._tmBound)return;m._tmBound=true;
  const inp=document.getElementById('cmdkInput');
  inp.addEventListener('input',function(){_cmdSel=0;renderCmdList(inp.value);});
  inp.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'){e.preventDefault();_cmdSel=Math.min(_cmdSel+1,_cmdItems.length-1);renderCmdList(inp.value);}
    else if(e.key==='ArrowUp'){e.preventDefault();_cmdSel=Math.max(0,_cmdSel-1);renderCmdList(inp.value);}
    else if(e.key==='Enter'){e.preventDefault();const c=_cmdItems[_cmdSel];closeCmd();if(c)c.run();}
    else if(e.key==='Escape'){closeCmd();}
  });
  m.addEventListener('click',function(e){if(e.target===m)closeCmd();});
  document.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCmd();}
    else if(e.key==='Escape'&&!m.classList.contains('hidden'))closeCmd();
  });
  const btn=document.getElementById('cmdBtn');if(btn)btn.onclick=openCmd;
}

/* ---------------- 14 · SWIPE NAVIGATION ---------------- */
function bindSwipe(){
  const flow=['dashboard','evolution','journal','newtrade','analytics','settings'];
  const content=document.querySelector('.content');if(!content||content._tmSwipe)return;content._tmSwipe=true;
  let x0=0,y0=0,active=false;
  content.addEventListener('pointerdown',function(e){if(e.target.closest('canvas'))return;x0=e.clientX;y0=e.clientY;active=true;},{passive:true});
  content.addEventListener('pointerup',function(e){
    if(!active)return;active=false;
    if(e.target.closest('canvas'))return;
    const dx=e.clientX-x0,dy=e.clientY-y0;
    if(Math.abs(dx)<72||Math.abs(dy)>64)return;
    const cur=flow.findIndex(function(v){const s=document.getElementById('view-'+v);return s&&s.classList.contains('active');});
    if(cur<0)return;const next=dx<0?cur+1:cur-1;
    if(next>=0&&next<flow.length)go(flow[next]);
  },{passive:true});
}

/* ---------------- 15 · THEME / RESIZE / BOOT ----------- */
document.addEventListener('tm:theme',function(){
  try{if(document.getElementById('view-dashboard').classList.contains('active'))drawStream(computed().curve);}catch(e){}
  try{if(document.getElementById('view-analytics').classList.contains('active')&&typeof renderAnalytics==='function')renderAnalytics();}catch(e){}
  observeReveals();
});
let _rt=null;
window.addEventListener('resize',function(){clearTimeout(_rt);_rt=setTimeout(function(){try{if(document.getElementById('view-dashboard').classList.contains('active'))drawStream(computed().curve);}catch(e){}},140);});
document.addEventListener('visibilitychange',function(){try{if(!document.hidden&&document.getElementById('view-dashboard').classList.contains('active'))drawStream(computed().curve);}catch(e){}});

function bootOV4(){
  try{bindCmd();}catch(e){}
  try{bindSwipe();}catch(e){}
  try{
    const dashActive=document.getElementById('view-dashboard').classList.contains('active');
    const evoActive=document.getElementById('view-evolution').classList.contains('active');
    /* Re-render through the OV4 surfaces: on reload the core boot runs before this
       layer exists, so the first paint would otherwise be the core layout. */
    if(dashActive){stagger(document.querySelector('#view-dashboard .tm-flow'));renderDashboard();}
    if(evoActive)window.renderEvolution();
    observeReveals();
  }catch(e){console.warn('boot',e);}
}
setTimeout(bootOV4,0);
setTimeout(bootOV4,240);

window.tmOV4={drawStream:drawStream,deckStatement:deckStatement,behaviorTimeline:behaviorTimeline,planRules:planRules,observeReveals:observeReveals,toRGBA:toRGBA};
})();
