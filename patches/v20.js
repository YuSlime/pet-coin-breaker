/* Version 20: Boss Chest replaces coin + 0.5% Huge Boss Dragon */
(function(){
  const META_KEY='petCoinBreakerV15Meta';
  const BOSS_DROP_RATE=0.005;
  window.__bossArenaRouting=true;

  function bossMeta(){
    try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')}catch(e){return {}}
  }
  function bossActive(){
    return !!bossMeta()?.boss?.active;
  }
  function syncBossVisual(){
    const m=bossMeta(),b=m?.boss||{},coin=document.querySelector('#coinTarget'),arena=document.querySelector('#arena');
    if(!coin)return;
    const active=!!b.active;
    coin.classList.toggle('v20-boss-chest',active);
    arena?.classList.toggle('v20-boss-active',active);
    coin.setAttribute('aria-label',active?'巨大ボスチェストを攻撃':'コインを攻撃');
    if(active){
      const max=Math.max(1,Number(b.maxHp||1)),hp=Math.max(0,Number(b.hp||0));
      const name=document.querySelector('#targetName'),nowEl=document.querySelector('#hpNow'),maxEl=document.querySelector('#hpMax'),bar=document.querySelector('#hpBar');
      if(name)name.textContent='👑 巨大ボスチェスト';
      if(nowEl)nowEl.textContent=fmt(hp);
      if(maxEl)maxEl.textContent=fmt(max);
      if(bar)bar.style.width=Math.max(0,Math.min(100,hp/max*100))+'%';
    }
  }

  const prevRenderHp=renderHp;
  renderHp=function(){
    if(bossActive()){syncBossVisual();return}
    prevRenderHp();
    syncBossVisual();
  };

  const prevRenderCoinVisual=renderCoinVisual;
  renderCoinVisual=function(){
    prevRenderCoinVisual();
    syncBossVisual();
  };

  const prevAttack=attack;
  attack=function(amount=teamPower()*.18+state.clickPower,showFx=true){
    if(!bossActive())return prevAttack(amount,showFx);
    if(amount<=0||document.querySelector('#hatch')?.classList.contains('show'))return;
    const coin=document.querySelector('#coinTarget');
    if(showFx&&coin){
      const rect=coin.getBoundingClientRect(),ar=document.querySelector('#arena').getBoundingClientRect();
      const x=rect.left-ar.left+rect.width/2,y=rect.top-ar.top+rect.height/2;
      const strong=amount>=Math.max(12,teamPower()*.55);
      floatText('-'+fmt(amount),x+(Math.random()*60-30),y,strong?'power':'normal');
      impactBurst(x,y,strong?1.4:.72,'#ffc857');
      if(strong){arenaShake();pulseCoin()}
      coin.classList.remove('hit');void coin.offsetWidth;coin.classList.add('hit');
      audio('hit');
    }
    if(typeof window.v15BossDamage==='function')window.v15BossDamage(Math.max(1,amount));
    renderHp();
  };

  const prevPetTheme=petTheme;
  petTheme=function(p){
    if(p?.bossExclusive||/Boss Dragon|ボスドラゴン/i.test(p?.baseName||p?.name||''))return 'boss';
    return prevPetTheme(p);
  };

  const prevPetEmblem=petEmblem;
  petEmblem=function(p){
    if(p?.bossExclusive||/Boss Dragon|ボスドラゴン/i.test(p?.baseName||p?.name||''))return '👑';
    return prevPetEmblem(p);
  };

  function createBossDragon(){
    const pool=petPools[state.zone]||petPools[petPools.length-1]||petPools[0]||[];
    const legendary=Math.max(1,...pool.filter(p=>p.rarity==='Legendary').map(p=>Number(p.power||1)));
    return {
      id:uid(),
      name:'Huge Boss Dragon',
      baseName:'Boss Dragon',
      icon:'🐲',
      kind:'dragon',
      rarity:'Legendary',
      power:Math.round(legendary*10),
      isHuge:true,
      isTitanic:false,
      mutation:'Normal',
      mutationMultiplier:1,
      bossExclusive:true,
      sourceEgg:'Boss Chest 0.5%',
      displayRarity:'Huge'
    };
  }

  window.v20BossDrop=function(force=false){
    if(!force&&Math.random()>=BOSS_DROP_RATE){
      setTimeout(()=>toast('🐲 Huge Boss Dragon: 今回はドロップなし（0.5%）'),450);
      return false;
    }
    const p=createBossDragon();
    state.pets.push(p);
    autoEquip();
    persist();
    renderAll();
    try{
      showHatch([p],{icon:'👑',name:'Boss Chest'},[true]);
    }catch(e){
      toast('🐲 HUGE BOSS DRAGON GET!');
    }
    return true;
  };

  const prevRenderIndex=renderIndex;
  renderIndex=function(){
    prevRenderIndex();
    const box=document.querySelector('#index');
    if(!box||box.querySelector('#v20ExclusiveIndex'))return;
    const owned=state.pets.find(p=>p.bossExclusive||/Boss Dragon/i.test(p.name||''));
    const fake=owned||{name:'Boss Dragon',baseName:'Boss Dragon',kind:'dragon',rarity:'Legendary',power:1,isHuge:true,bossExclusive:true,mutation:'Normal'};
    box.insertAdjacentHTML('beforeend',
      '<div id="v20ExclusiveIndex"><div class="v20-exclusive-title">👑 BOSS EXCLUSIVE</div>'+
      '<div class="index-grid"><div class="index-card '+(owned?'':'locked')+'">'+
      '<div class="index-model">'+petModelHTML(fake)+'</div>'+
      '<div class="index-name">'+(owned?'Huge Boss Dragon':'???')+'</div>'+
      '<div class="index-badges"><span class="index-badge huge '+(owned?'on':'')+'">HUGE</span></div>'+
      '<div class="v20-drop-note">Boss Chest Drop: 0.5%</div></div></div></div>'
    );
  };

  const panel=document.querySelector('#adminPanel');
  if(panel&&!document.querySelector('#v20AdminBoss')){
    const group=document.createElement('div');
    group.className='admin-group';
    group.id='v20AdminBoss';
    group.innerHTML='<div class="admin-label">👑 ボスチェスト検証</div><div class="admin-row">'+
      '<button class="admin-btn gold" onclick="v15ForceBoss()">Boss Chest出現</button>'+
      '<button class="admin-btn green" onclick="v20BossDrop(true)">Huge Boss Dragon追加</button>'+
      '</div>';
    const saveGroup=[...panel.querySelectorAll('.admin-group')].find(g=>g.textContent.includes('セーブ'));
    panel.insertBefore(group,saveGroup||null);
  }

  setTimeout(()=>{
    const m=bossMeta();
    if(m?.boss?.ready&&!m?.boss?.active&&typeof window.v15BossStart==='function')window.v15BossStart();
    syncBossVisual();
  },0);

  setInterval(syncBossVisual,120);
  renderAll();
})();