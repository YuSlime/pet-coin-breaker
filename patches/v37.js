/* Version 37: use actual pet models as every pet icon */
(function(){
  function miniPetHTML(p){
    return '<span class="pet-mini-avatar">'+petModelHTML(p)+'</span>';
  }
  window.petMiniIconHTML=miniPetHTML;

  function dropChip(p){
    return '<div class="pet-drop-chip">'+
      miniPetHTML({...p,baseName:p.name,name:p.name,mutation:'Normal',isHuge:false,isTitanic:false})+
      '<div style="min-width:0"><div class="pet-drop-name rarity-'+p.rarity+'">'+p.name+'</div>'+
      '<div class="pet-drop-rarity rarity-'+p.rarity+'">'+p.rarity.toUpperCase()+'</div></div></div>';
  }

  // Animal emoji fields are legacy only; visual pet icons now come from petModelHTML.
  try{
    petPools.flat().forEach(p=>{p.icon='';});
    state.pets.forEach(p=>{if(p&&'icon' in p)p.icon='';});
  }catch(e){}

  renderEggs=function(){
    const box=$('#eggs');
    if(!box)return;
    const amount=Math.max(1,Math.min(5,state.hatchAmount||1));
    const lm=luckMultiplier(),mr=mutationRates();

    box.innerHTML=
      '<div class="small" style="margin-bottom:10px">現在は1回で <b style="color:#fff">'+amount+
      '個</b> 開封。Luck Lv.'+(state.luckLevel||0)+'（×'+lm.toFixed(1)+'） / Huge Luck Lv.'+
      (state.hugeLuckLevel||0)+'（×'+hugeLuckMultiplier().toFixed(2)+'）<br>'+
      '各ペットの専用ミニモデルがそのまま排出アイコンになっています。</div>'+
      eggs.map((e,i)=>{
        const r=effectiveRates(e),pool=petPools[e.pool]||petPools[0];
        return '<div class="egg-card" style="opacity:'+(e.zone<=state.zone?1:.45)+'">'+
          '<div class="egg-top"><div><div style="font-weight:1000">'+e.icon+' '+e.name+'</div>'+
          '<div class="price">🪙 '+fmt(e.cost*amount)+' <span class="small">('+fmt(e.cost)+' × '+amount+')</span></div></div>'+
          '<div class="egg-icon">'+e.icon+'</div></div>'+
          '<div class="pet-drop-list">'+pool.map(dropChip).join('')+'</div>'+
          '<div class="rates">Common '+r.Common.toFixed(1)+'% / Uncommon '+r.Uncommon.toFixed(1)+'% / Rare '+r.Rare.toFixed(1)+'% / Epic '+r.Epic.toFixed(1)+'% / Legendary '+r.Legendary.toFixed(1)+'%'+
          '<br><span class="rarity-Huge">Hugeレア '+effectiveHugeChance(e).toFixed(2)+'% / 1個ごと</span>'+
          '<br><span class="rarity-Titanic">Titanicレア ???</span>'+
          '<br><span class="mutation-text-Gold">Gold '+mr.Gold.toFixed(1)+'%</span> / '+
          '<span class="mutation-text-Diamond">Diamond '+mr.Diamond.toFixed(1)+'%</span> / '+
          '<span class="mutation-text-Rainbow">Rainbow '+mr.Rainbow.toFixed(2)+'%</span></div>'+
          '<button class="btn primary hatch-button" style="width:100%" onclick="hatch('+i+')" '+(e.zone>state.zone?'disabled':'')+'>'+
          (e.zone>state.zone?'🔒 エリア未解放':'✨ ×'+amount+' かえす')+'</button></div>';
      }).join('');
    if(window.renderHub && document.querySelector('#v15Hub')?.classList.contains('open')){}
    queueMicrotask(()=>window.__v36IconRefresh?.());
  };

  function refreshPetTabIcon(){
    const tab=document.querySelector('.tab[data-tab="pets"]');
    if(!tab)return;
    tab.querySelector('.pet-tab-avatar')?.remove();
    const source=state.pets[0] || petPools?.[0]?.[1] || petPools?.[0]?.[0];
    if(!source)return;
    const wrap=document.createElement('span');
    wrap.className='pet-tab-avatar';
    const p={...source,baseName:source.baseName||source.name,name:source.baseName||source.name,mutation:'Normal',isHuge:false,isTitanic:false};
    wrap.innerHTML=petModelHTML(p);
    tab.prepend(wrap);
  }

  refreshPetTabIcon();

  const prevRenderAll=renderAll;
  renderAll=function(){
    const out=prevRenderAll.apply(this,arguments);
    refreshPetTabIcon();
    return out;
  };

  if(document.querySelector('.tab.active')?.dataset.tab==='eggs')renderEggs();
})();