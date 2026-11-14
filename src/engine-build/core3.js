/* V3 reliability layer: IndexedDB mirror + deterministic UI refresh.
   The original synchronous localStorage path remains as an offline fallback. */
(function(){
 const DB_NAME='dan-trading-journal-pro-'+(localStorage.getItem('tm_current_user')||'anonymous');
 const DB_VERSION=1;
 const STORE='state';
 const STATE_KEY='main';
 let dbPromise=null;let writeQueue=Promise.resolve();let lastSnapshot=null;let lastWritePromise=Promise.resolve();
 function openDB(){
  if(!('indexedDB' in window))return Promise.resolve(null);
  if(dbPromise)return dbPromise;
  dbPromise=new Promise(resolve=>{let req;try{req=indexedDB.open(DB_NAME,DB_VERSION);}catch(e){resolve(null);return;}
   req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);};
   req.onsuccess=()=>resolve(req.result);req.onerror=()=>resolve(null);req.onblocked=()=>resolve(null);
  });return dbPromise;
 }
 function idbPut(payload){writeQueue=writeQueue.then(()=>openDB().then(db=>new Promise(resolve=>{if(!db){resolve(false);return;}let done=false;const finish=v=>{if(done)return;done=true;clearTimeout(timer);resolve(v);};const timer=setTimeout(()=>finish(false),1500);let tx;try{tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(payload,STATE_KEY);tx.oncomplete=()=>finish(true);tx.onerror=()=>finish(false);tx.onabort=()=>finish(false);}catch(e){finish(false);}})));return writeQueue;}
 function idbGet(){if(lastSnapshot)return Promise.resolve(lastSnapshot);return writeQueue.then(()=>openDB().then(db=>new Promise(resolve=>{if(!db){resolve(null);return;}let done=false;const finish=v=>{if(done)return;done=true;clearTimeout(timer);resolve(v);};const timer=setTimeout(()=>finish(null),1500);let tx;try{tx=db.transaction(STORE,'readonly');const req=tx.objectStore(STORE).get(STATE_KEY);req.onsuccess=()=>finish(req.result||null);req.onerror=()=>finish(null);tx.onerror=()=>finish(null);tx.onabort=()=>finish(null);}catch(e){finish(null);}})));}
 function idbClear(){lastSnapshot=null;writeQueue=writeQueue.then(()=>openDB().then(db=>new Promise(resolve=>{if(!db){resolve(false);return;}let done=false;const finish=v=>{if(done)return;done=true;clearTimeout(timer);resolve(v);};const timer=setTimeout(()=>finish(false),1500);try{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(STATE_KEY);tx.oncomplete=()=>finish(true);tx.onerror=()=>finish(false);tx.onabort=()=>finish(false);}catch(e){finish(false);}})));return writeQueue;}
 function snapshot(){return{version:1,updatedAt:Date.now(),settings:JSON.parse(JSON.stringify(ST.settings)),trades:JSON.parse(JSON.stringify(ST.trades))};}
 function mirror(){const snap=snapshot();lastSnapshot=snap;try{localStorage.setItem('dtj_updated_at',String(snap.updatedAt));}catch(e){}lastWritePromise=idbPut(snap);return snap;}
 function hydrate(){return idbGet().then(data=>{if(!data||!Array.isArray(data.trades)||!data.settings)return false;let localUpdated=0;try{localUpdated=parseInt(localStorage.getItem('dtj_updated_at')||'0',10)||0;}catch(e){}
   const localTrades=Array.isArray(ST.trades)?ST.trades:[];
   if((!localTrades.length&&data.trades.length)||data.updatedAt>localUpdated){ST.settings=Object.assign(ST.settings,data.settings);ST.trades=data.trades;try{localStorage.setItem('dtj_settings',JSON.stringify(ST.settings));localStorage.setItem('dtj_trades',JSON.stringify(ST.trades));localStorage.setItem('dtj_updated_at',String(data.updatedAt||Date.now()));}catch(e){}_computedCache=null;renderAll();if(document.getElementById('view-evolution')?.classList.contains('active'))renderEvolution();return true;}
   return false;});}
 const baseSave=save;
 save=function(){baseSave();mirror();};
 const baseDel=deleteAll;
 deleteAll=function(){baseDel();idbClear();};
 const baseDelTrade=delTrade;
 delTrade=function(id){baseDelTrade(id);renderAll();if(document.getElementById('view-evolution')?.classList.contains('active'))renderEvolution();};
 const baseDupTrade=dupTrade;
 dupTrade=function(id){baseDupTrade(id);renderAll();if(document.getElementById('view-evolution')?.classList.contains('active'))renderEvolution();};
 const baseSubmit=submitTrade;
 submitTrade=function(e){const beforeId=document.getElementById('editId').value;const result=baseSubmit(e);/* baseSubmit navigates to Journal and resets the form */setTimeout(()=>{renderAll();if(document.getElementById('view-journal')?.classList.contains('active'))renderJournal();if(document.getElementById('view-evolution')?.classList.contains('active'))renderEvolution();mirror();},0);return result;};
 const baseRenderAll=renderAll;
 renderAll=function(){baseRenderAll();try{if(document.getElementById('view-evolution'))renderEvolution();}catch(e){console.warn('Evolution refresh skipped',e);}};
 window.danJournalPersistence={openDB,mirror,hydrate,idbGet,flush:()=>lastWritePromise};
 /* On refresh, recover from IndexedDB only when it is newer or local data is absent. */
 setTimeout(()=>{hydrate().catch(()=>{});},0);
})();