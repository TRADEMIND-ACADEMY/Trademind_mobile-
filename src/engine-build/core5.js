/* Capital Evolution repair: only owns the capital curve and its summary stats. */
(function(){
  'use strict';
  const repair={ready:false};
  if(!document.getElementById('capitalEvolutionVisibilityFix')){const style=document.createElement('style');style.id='capitalEvolutionVisibilityFix';style.textContent='#view-evolution.view.active{opacity:1!important;filter:none!important;transform:none!important;animation:none!important;}';document.head.appendChild(style);}
  const num=(v)=>{const n=Number(v);return Number.isFinite(n)?n:0;};
  const pnlOf=(t)=>{for(const k of ['pnl','profit','PnL','resultPnl']){if(t&&t[k]!==undefined&&t[k]!==null&&t[k]!=='')return num(t[k]);}return 0;};
  const dateOf=(t)=>{const raw=t&& (t.date||t.createdAt||t.timestamp);const d=new Date(String(raw||'')+(t&&t.time?'T'+t.time:''));return Number.isNaN(d.getTime())?null:d;};
  const startOf=(t)=>{const d=dateOf(t);return d?d.getTime():0;};
  const fmtCap=(v)=>typeof fmt==='function'?fmt(v):num(v).toFixed(2);
  const signed=(v,d=2)=>(v>=0?'+':'')+num(v).toFixed(d);
  function periodCutoff(key){const now=new Date();if(key==='7')return new Date(now-7*86400000);if(key==='30')return new Date(now-30*86400000);if(key==='90')return new Date(now-90*86400000);if(key==='180')return new Date(now-180*86400000);if(key==='365')return new Date(now-365*86400000);if(key==='ytd')return new Date(now.getFullYear(),0,1);return null;}
  function capitalData(key){
    const all=(Array.isArray(ST.trades)?ST.trades:[]).slice().sort((a,b)=>startOf(a)-startOf(b));
    const start=num(ST.settings&&ST.settings.startingBalance);
    const cutoff=periodCutoff(key);
    const before=cutoff?all.filter(t=>{const d=dateOf(t);return d&&d<cutoff;}):[];
    const selected=cutoff?all.filter(t=>{const d=dateOf(t);return d&&d>=cutoff;}):all;
    let base=start+before.reduce((s,t)=>s+pnlOf(t),0),capital=base,peak=base,maxDD=0;
    const points=[{label:'Start',capital,dd:0,pnl:0,cumPnl:0}];
    selected.forEach((t,i)=>{const pnl=pnlOf(t);capital+=pnl;peak=Math.max(peak,capital);const dd=capital-peak;maxDD=Math.max(maxDD,Math.abs(dd));points.push({label:(t.date||dateOf(t)?.toISOString().slice(0,10)||String(i+1)),capital,pnl,dd,cumPnl:capital-base,symbol:t.symbol,direction:t.direction,id:t.id});});
    return {all,selected,points,start:base,initial:start,capital,peak,currentDD:capital-peak,maxDD,change:capital-base,changePct:base?((capital-base)/base*100):0};
  }
  function empty(){const body=document.getElementById('evoBody'),emptyEl=document.getElementById('evoEmpty');if(body)body.classList.add('hidden');if(emptyEl){emptyEl.classList.remove('hidden');const h=emptyEl.querySelector('h3'),p=emptyEl.querySelector('p');if(h)h.textContent=((ST.settings.lang||'en')==='fr'?'Aucun trade dans cette période':'No trades in this period');if(p)p.textContent=((ST.settings.lang||'en')==='fr'?'Ajoutez un trade réel pour construire votre courbe de capital.':'Add a real trade to build your capital curve.');}}
  function render(){
    if(!repair.ready)return;const data=capitalData(typeof evoRange==='undefined'?'all':evoRange);if(!data.selected.length){empty();return;}
    const body=document.getElementById('evoBody'),emptyEl=document.getElementById('evoEmpty');if(body)body.classList.remove('hidden');if(emptyEl)emptyEl.classList.add('hidden');
    const stats=document.getElementById('evoStats');if(stats)stats.innerHTML=[
      statHtml(((ST.settings.lang||'en')==='fr'?'Capital initial':'Starting Capital'),fmtCap(data.initial)),statHtml(((ST.settings.lang||'en')==='fr'?'Capital période':'Period Capital'),fmtCap(data.start)),statHtml(((ST.settings.lang||'en')==='fr'?'Capital actuel':'Current Capital'),fmtCap(data.capital),data.change>=0?'up':'down'),
      statHtml(((ST.settings.lang||'en')==='fr'?'Variation $':'Change $'),signed(data.change)+' '+ST.settings.currency,data.change>=0?'up':'down'),statHtml(((ST.settings.lang||'en')==='fr'?'Variation %':'Change %'),signed(data.changePct)+'%',data.change>=0?'up':'down'),
      statHtml(((ST.settings.lang||'en')==='fr'?'Capital record':'Peak Capital'),fmtCap(data.peak)),statHtml(((ST.settings.lang||'en')==='fr'?'Drawdown actuel':'Current Drawdown'),fmtCap(data.currentDD),'down'),statHtml(((ST.settings.lang||'en')==='fr'?'Drawdown maximum':'Max Drawdown'),fmtCap(-data.maxDD),'down'),statHtml(tr('common.trades'),data.selected.length)
    ].join('');
    const canvas=document.getElementById('evoChart');if(!canvas||typeof Chart==='undefined')return;if(charts.evo)try{charts.evo.destroy();}catch(e){}
    const css=getComputedStyle(document.documentElement),labels=data.points.map(p=>p.label),capital=data.points.map(p=>p.capital),dd=data.points.map(p=>p.dd);
    charts.evo=new Chart(canvas,{type:'line',data:{labels,datasets:[{label:'Capital',data:capital,borderColor:css.getPropertyValue('--acc'),backgroundColor:css.getPropertyValue('--acc')+'20',fill:true,tension:.25,pointRadius:data.points.length<8?3:1.5,pointHoverRadius:6},{label:'Drawdown',data:dd,borderColor:css.getPropertyValue('--bad'),borderDash:[4,3],tension:.2,pointRadius:0}]},options:{responsive:true,maintainAspectRatio:true,animation:{duration:350},interaction:{mode:'index',intersect:false},plugins:{legend:{display:true,position:'bottom',labels:{color:css.getPropertyValue('--txm'),font:{size:10},boxWidth:9}},tooltip:{backgroundColor:css.getPropertyValue('--surf2'),titleColor:css.getPropertyValue('--tx'),bodyColor:css.getPropertyValue('--txm'),borderColor:css.getPropertyValue('--bd'),borderWidth:1,padding:10,callbacks:{title:(items)=>{const p=data.points[items[0].dataIndex];return p.symbol?p.symbol+' · '+p.label:((ST.settings.lang||'en')==='fr'?'Capital initial':'Starting Capital');},label:(ctx)=>{const p=data.points[ctx.dataIndex];if(ctx.datasetIndex===0)return ['Capital: '+fmtCap(p.capital),p.pnl?'Trade P&L: '+fmtCap(p.pnl):'Variation: —'];return 'Drawdown: '+fmtCap(p.dd);}}}},scales:{x:{grid:{display:false},ticks:{color:css.getPropertyValue('--txm'),maxTicksLimit:7,font:{size:10}}},y:{grid:{color:css.getPropertyValue('--line')},ticks:{color:css.getPropertyValue('--txm'),font:{size:10}}}}}});
  }
  const oldEvo=window.renderEvolution;window.renderEvolution=function(){try{if(oldEvo)oldEvo();}catch(e){console.warn('Legacy evolution skipped',e);}repair.ready=true;render();};
  const oldSave=window.save;window.save=function(){const r=oldSave.apply(this,arguments);if(repair.ready&&document.getElementById('view-evolution')?.classList.contains('active'))setTimeout(render,0);return r;};
  const oldRenderAll=window.renderAll;window.renderAll=function(){const r=oldRenderAll.apply(this,arguments);if(repair.ready&&document.getElementById('view-evolution')?.classList.contains('active'))setTimeout(render,0);return r;};
  window.danCapitalEvolution={getData:()=>capitalData(typeof evoRange==='undefined'?'all':evoRange),render};
  setTimeout(()=>{repair.ready=true;if(document.getElementById('view-evolution')?.classList.contains('active'))render();},0);
})();
