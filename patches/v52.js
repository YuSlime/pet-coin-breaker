/* Version 52: pet selling; no serial/# numbering */
(function(){
  const selected=new Set();
  const DISPLAY_LIMIT=120;

  function sourceEggFor(p){
    const bySource=eggs.find(e=>e.name===p?.sourceEgg);
    if(bySource)return bySource;
    const base=String(p?.baseName||p?.name||'').replace(/^(Rainbow|Diamond|Gold)\s+/,'').replace(/^(Titanic|Huge)\s+/,'');
    const poolIndex=petPools.findIndex(pool=>pool.some(x=>x.name===base));
    if(poolIndex>=0&&eggs[poolIndex])return eggs[poolIndex];
    return eggs[Math.max(0,Math.min(eggs.length-1,Number(state.zone||0)))]||eggs[0];
  }

  function sellValue(p){
    const egg=sourceEggFor(p),cost=Math.max(1,Number(egg?.cost||100));
    const rarityFactor={Common:.12,Uncommon:.15,Rare:.20,Epic:.28,Legendary:.40}[p?.rarity]||.12;
    const mutationFactor={Normal:1,Gold:1.35,Diamond:1.7,Rainbow:2.25}[p?.mutation||'Normal']||1;
    let value=Math.max(1,Math.floor(cost*rarityFactor*mutationFactor));
    if(p?.isTitanic)value=Math.max(value,Math.floor(cost*20));
    else if(p?.isHuge)value=Math.max(value,Math.floor(cost*6));
    if(p?.bossExclusive)value=Math.max(value,Math.floor(cost*10));
    return value;
  }
  window.v52SellValue=sellValue;

  function isBlocked(p){return state.equipped.includes(p.id)}
  function tier(p){return p?.isTitanic?'TITANIC':p?.isHuge?'HUGE':String(p?.rarity||'PET').toUpperCase()}
  function prune(){for(const id of [...selected])if(!state.pets.some(p=>p.id===id)||state.equipped.includes(id))selected.delete(id)}
  function chosen(){prune();return state.pets.filter(p=>selected.has(p.id)&&!isBlocked(p))}

  function ensureUi(){
    const tabs=document.querySelector('.tabs');if(!tabs)return;
    tabs.classList.add('v52-five-tabs');
    let tab=tabs.querySelector('.tab[data-tab="sell"]');
    if(!tab){
      tab=document.createElement('button');tab.className='tab';tab.dataset.tab='sell';tab.textContent='💰 売る';
      const indexTab=tabs.querySelector('.tab[data-tab="index"]');
      if(indexTab)indexTab.insertAdjacentElement('afterend',tab);else tabs.appendChild(tab);
    }
    const panel=tabs.parentElement;
    let section=panel?.querySelector('#sell');
    if(!section&&panel){section=document.createElement('div');section.className='section';section.id='sell';panel.appendChild(section)}
    tab.onclick=()=>{
      document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.section').forEach(x=>x.classList.remove('active'));
      tab.classList.add('active');section?.classList.add('active');renderSell();
    };
  }

  function renderSell(){
    ensureUi();prune();const box=document.querySelector('#sell');if(!box)return;
    const list=state.pets.slice().sort((a,b)=>Number(a.power||0)-Number(b.power||0)).slice(0,DISPLAY_LIMIT);
    const picked=chosen(),total=picked.reduce((n,p)=>n+sellValue(p),0),hidden=Math.max(0,state.pets.length-list.length);
    box.innerHTML='<div class="v52-sell-head"><div class="v52-sell-summary"><b>ペットを売る</b><div class="small">弱い順に最大 '+DISPLAY_LIMIT+'匹を表示'+(hidden?' / 残り '+hidden+'匹':'')+'</div></div><div class="v52-sell-actions"><button class="btn" onclick="v52SelectSellable()">通常ペットを選択</button><button class="btn" onclick="v52ClearSellSelection()">選択解除</button></div></div>'+
      '<div class="v52-sell-note">装備中のペットは売却できません。Huge / Titanic は売却時に追加確認が入ります。売却後は元に戻せません。</div>'+
      '<div class="v52-sell-grid">'+list.map(p=>{const blocked=isBlocked(p),sel=selected.has(p.id),special=!!(p.isHuge||p.isTitanic),value=sellValue(p);return '<div class="v52-sell-card '+(sel?'selected ':'')+(blocked?'blocked ':'')+(special?'special':'')+'" onclick="v52ToggleSellPet(\''+p.id+'\')"><span class="v52-sell-check">'+(blocked?'🔒':sel?'✓':'')+'</span><span class="v52-sell-tier">'+tier(p)+'</span><div class="v52-sell-visual">'+petModelHTML(p)+'</div><div class="v52-sell-name">'+p.name+'</div><div class="v52-sell-meta"><span>⚔️ '+fmt(p.power)+'</span><span class="v52-sell-price">🪙 '+fmt(value)+'</span></div><div class="v52-sell-status">'+(blocked?'装備中：売却不可':sel?'売却対象に選択中':'タップで選択')+'</div></div>'}).join('')+'</div>'+
      '<div class="v52-sell-footer"><div class="v52-sell-footer-row"><div class="v52-sell-total">選択 <b>'+picked.length+'匹</b>　合計 <b>🪙 '+fmt(total)+'</b></div><button class="btn primary" onclick="v52SellSelected()" '+(!picked.length?'disabled':'')+'>選択したペットを売る</button></div></div>';
  }
  window.renderSell=renderSell;

  window.v52ToggleSellPet=function(id){
    const p=state.pets.find(x=>x.id===id);if(!p)return;if(isBlocked(p))return toast('🔒 装備中のペットは売れません');
    if(selected.has(id))selected.delete(id);else selected.add(id);renderSell();
  };
  window.v52ClearSellSelection=function(){selected.clear();renderSell()};
  window.v52SelectSellable=function(){
    selected.clear();state.pets.slice().sort((a,b)=>Number(a.power||0)-Number(b.power||0)).slice(0,DISPLAY_LIMIT).forEach(p=>{if(!isBlocked(p)&&!p.isHuge&&!p.isTitanic)selected.add(p.id)});renderSell();
  };
  window.v52SellSelected=function(){
    const pets=chosen();if(!pets.length)return toast('売るペットを選んでください');
    const total=pets.reduce((n,p)=>n+sellValue(p),0),special=pets.filter(p=>p.isHuge||p.isTitanic);
    let msg=pets.length+'匹を 🪙 '+fmt(total)+' で売ります。\n売却後は元に戻せません。';
    if(special.length)msg='⚠️ Huge / Titanic が '+special.length+'匹含まれています。\n\n'+msg;
    if(!confirm(msg))return;
    const ids=new Set(pets.map(p=>p.id));
    state.pets=state.pets.filter(p=>!ids.has(p.id));
    state.equipped=state.equipped.filter(id=>!ids.has(id));
    state.coins+=total;selected.clear();persist();renderAll();renderSell();toast('💰 '+pets.length+'匹を売却 +'+fmt(total));
  };

  ensureUi();
  const oldActive=renderActiveSection;
  renderActiveSection=function(){const tab=document.querySelector('.tab.active')?.dataset.tab;if(tab==='sell')return renderSell();return oldActive.apply(this,arguments)};
  const oldAll=renderAll;
  renderAll=function(){ensureUi();return oldAll.apply(this,arguments)};
})();
