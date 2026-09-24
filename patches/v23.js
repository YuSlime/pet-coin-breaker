/* Version 23: show "Next Challenge" only after Boss Chest condition is met */
(function(){
  const KEY='petCoinBreakerV15Meta';
  const row=document.querySelector('#smashBtn')?.parentElement;
  if(!row)return;

  let btn=document.querySelector('#v23BossChallenge');
  if(!btn){
    btn=document.createElement('button');
    btn.id='v23BossChallenge';
    btn.className='btn';
    btn.type='button';
    btn.textContent='👑 ボスチェストに挑む';
    btn.onclick=()=>{
      if(typeof window.v15BossStart==='function')window.v15BossStart();
      sync();
    };
    const nextZone=document.querySelector('#nextZoneBtn');
    if(nextZone)row.insertBefore(btn,nextZone);
    else row.appendChild(btn);
  }

  function readMeta(){
    try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}
  }

  let lastReady=null;
  function sync(){
    const m=readMeta(),boss=m?.boss||{};
    const ready=!!boss.ready&&!boss.active;
    if(ready===lastReady)return;
    lastReady=ready;

    btn.classList.toggle('ready',ready);
    btn.disabled=!ready;
    btn.hidden=!ready;
    btn.style.display=ready?'inline-flex':'none';
    btn.setAttribute('aria-hidden',ready?'false':'true');
  }

  window.v23SyncBossChallenge=sync;
  window.addEventListener('storage',sync);
  setInterval(sync,500);
  sync();
})();