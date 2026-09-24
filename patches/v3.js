/* Version 3: Huge rarity + stronger biome-specific pet roster */
(function(){
  const rename=(poolIndex,itemIndex,name)=>{ if(petPools?.[poolIndex]?.[itemIndex]) petPools[poolIndex][itemIndex].name=name; };
  rename(1,1,'オアシスキャット');
  rename(1,2,'デューンバニー');
  rename(2,1,'フロストキャット');
  rename(2,2,'ブリザードバニー');
  rename(2,3,'アイスフォックス');
  rename(2,5,'グレイシャードラゴン');
  rename(3,1,'マグマリンクス');
  rename(3,5,'ボルケーノドラゴン');

  petTheme=function(p){
    const n=(p?.baseName||p?.name||'');
    if(/草原|クローバー|フォレスト|フラワー/.test(n))return 'forest';
    if(/サンド|スフィンクス|オアシス|デューン|フェネック|サン/.test(n))return 'desert';
    if(/スノー|アイス|フロスト|ブリザード|クリスタル|グレイシャー/.test(n))return 'ice';
    if(/ヘル|マグマ|エンバー|フレイム|インフェルノ|ボルケーノ/.test(n))return 'volcano';
    return 'forest';
  };
  petVariant=function(p){
    const n=(p?.baseName||p?.name||'');
    if(/フェネック/.test(n))return 'fennec';
    if(/スフィンクス|オアシスキャット/.test(n))return 'sphinx';
    if(/スノーウルフ/.test(n))return 'wolf';
    if(/ヘルハウンド/.test(n))return 'hellhound';
    if(/クリスタル/.test(n))return 'crystal';
    return '';
  };
  petSkin=function(p){
    const n=(p?.baseName||p?.name||'').replace(/^(Rainbow|Diamond|Gold) /,'').replace(/^Huge /,'');
    const map={
      '草原いぬ':'grassdog','草原ねこ':'grasscat','クローバーうさぎ':'cloverrabbit','フォレストきつね':'forestfox','フラワーユニコーン':'flowerunicorn','フォレストドラゴン':'forestdragon',
      'サンドジャッカル':'sandjackal','スフィンクスキャット':'sphinxcat','オアシスキャット':'sphinxcat','サンドバニー':'sandbunny','デューンバニー':'sandbunny','フェネック':'fennec','サンユニコーン':'sununicorn','サンドストームドラゴン':'sandstormdragon',
      'スノーウルフ':'snowwolf','アイスキャット':'icecat','フロストキャット':'icecat','スノーバニー':'snowbunny','ブリザードバニー':'snowbunny','フロストフォックス':'frostfox','アイスフォックス':'frostfox','クリスタルユニコーン':'crystalunicorn','フロストドラゴン':'frostdragon','グレイシャードラゴン':'frostdragon',
      'ヘルハウンド':'hellhound','マグマキャット':'magmacat','マグマリンクス':'magmacat','エンバーバニー':'emberbunny','フレイムフォックス':'flamefox','インフェルノユニコーン':'infernounicorn','マグマドラゴン':'magmadragon','ボルケーノドラゴン':'magmadragon'
    };
    return map[n]||'';
  };
  petEmblem=function(p){
    const skin=petSkin(p);
    const map={grassdog:'🐾',grasscat:'🌿',cloverrabbit:'🍀',forestfox:'🍃',flowerunicorn:'🌸',forestdragon:'🌲',sandjackal:'🦂',sphinxcat:'🏺',sandbunny:'🏜',fennec:'✧',sununicorn:'☀',sandstormdragon:'🌪',snowwolf:'❄',icecat:'🧊',snowbunny:'☃',frostfox:'✨',crystalunicorn:'💠',frostdragon:'❅',hellhound:'💀',magmacat:'🌋',emberbunny:'🔥',flamefox:'🜂',infernounicorn:'⭐',magmadragon:'☄️'};
    return map[skin]||'✦';
  };

  window.displayRarity=p=>p?.isHuge?'Huge':(p?.rarity||'Common');
  window.displayRarityText=p=>displayRarity(p).toUpperCase();

  petModelHTML=function(p,extra=''){
    const kind=petKind(p),theme=petTheme(p),variant=petVariant(p),skin=petSkin(p),emblem=petEmblem(p),rarity=displayRarity(p),huge=p?.isHuge?'huge':'',mutation=p?.mutation&&p.mutation!=='Normal'?('mutation-'+p.mutation):'';
    return '<div class="pet-model kind-'+kind+' theme-'+theme+' '+(variant?'variant-'+variant:'')+' '+(skin?'skin-'+skin:'')+' rarity-'+rarity+' '+huge+' '+mutation+' '+extra+'" aria-label="'+(p?.name||'ペット')+'"><i class="pet-aura"></i><i class="pet-shadow"></i><i class="pet-wing l"></i><i class="pet-wing r"></i><i class="huge-crown">👑</i><div class="pet-body"><i class="pet-ear l"></i><i class="pet-ear r"></i><i class="pet-horn"></i><i class="pet-eye l"></i><i class="pet-eye r"></i><i class="pet-muzzle"><i class="pet-nose"></i><i class="pet-mouth"></i></i><i class="pet-gem"></i><i class="pet-crest">'+emblem+'</i></div><i class="pet-spark s1"></i><i class="pet-spark s2"></i></div>';
  };

  renderEggs=function(){
    let box=$('#eggs'),amount=Math.max(1,Math.min(5,state.hatchAmount||1)),lm=luckMultiplier(),mr=mutationRates();
    box.innerHTML='<div class="small" style="margin-bottom:10px">現在は1回で <b style="color:#fff">'+amount+'個</b> 開封。🍀 Luck Lv.'+(state.luckLevel||0)+'（×'+lm.toFixed(1)+'） / 👑 Huge Luck Lv.'+(state.hugeLuckLevel||0)+'（×'+hugeLuckMultiplier().toFixed(2)+'）<br>砂漠・氷・火山は、それぞれのエリア専用モチーフのペットが出ます。</div>'+
    eggs.map((e,i)=>{
      const r=effectiveRates(e),pool=petPools[e.pool]||petPools[0],names=pool.map(p=>'<span class="rarity-'+p.rarity+'">'+p.name+'</span>').join(' / ');
      return '<div class="egg-card" style="opacity:'+(e.zone<=state.zone?1:.45)+'"><div class="egg-top"><div><div style="font-weight:1000">'+e.icon+' '+e.name+'</div><div class="price">🪙 '+fmt(e.cost*amount)+' <span class="small">('+fmt(e.cost)+' × '+amount+')</span></div></div><div class="egg-icon">'+e.icon+'</div></div><div class="small" style="margin-top:8px;line-height:1.55">排出: '+names+'</div><div class="rates">Common '+r.Common.toFixed(1)+'% / Uncommon '+r.Uncommon.toFixed(1)+'% / Rare '+r.Rare.toFixed(1)+'% / Epic '+r.Epic.toFixed(1)+'% / Legendary '+r.Legendary.toFixed(1)+'%<br><span class="rarity-Huge">Hugeレア '+effectiveHugeChance(e).toFixed(2)+'% / 1個ごと</span><br><span class="mutation-text-Gold">Gold '+mr.Gold.toFixed(1)+'%</span> / <span class="mutation-text-Diamond">Diamond '+mr.Diamond.toFixed(1)+'%</span> / <span class="mutation-text-Rainbow">Rainbow '+mr.Rainbow.toFixed(2)+'%</span></div><button class="btn primary hatch-button" style="width:100%" onclick="hatch('+i+')" '+(e.zone>state.zone?'disabled':'')+'>'+(e.zone>state.zone?'🔒 エリア未解放':'✨ ×'+amount+' かえす')+'</button></div>';
    }).join('');
  };

  renderPets=function(){
    let box=$('#pets'),all=state.pets.slice().sort((a,b)=>b.power-a.power),list=all.slice(0,36),hidden=Math.max(0,all.length-list.length);
    box.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b>所持 '+state.pets.length+'匹</b><button class="btn green" onclick="autoEquip();renderPetsField();renderTop();renderPets()">最強を装備</button></div><div class="small" style="margin-bottom:10px">装備 '+state.equipped.length+'/'+state.maxEquip+(hidden?' / 軽量表示: 強い順36匹（ほか'+hidden+'匹）':'')+'</div><div class="grid">'+
      list.map(p=>'<div class="pet-card '+(p.isHuge?'huge-card ':'')+'rarity-card-'+displayRarity(p)+' '+(state.equipped.includes(p.id)?'equipped':'')+'" onclick="togglePet(\''+p.id+'\')"><span class="tag rarity-'+displayRarity(p)+' '+(p.isHuge?'huge-tag tag-left':'')+'">'+displayRarityText(p)+'</span><div class="pet-visual-wrap">'+petModelHTML(p)+'</div>'+(p.mutation&&p.mutation!=='Normal'?'<div class="mutation-chip '+p.mutation+'">'+mutationLabel(p.mutation)+' · ×'+mutationMultiplier(p.mutation)+'</div>':'')+'<div class="pet-name">'+p.name+'</div><div class="pet-power">⚔️ '+fmt(p.power)+'/秒</div><div class="small">'+(state.equipped.includes(p.id)?'✓ 装備中':'タップで装備')+'</div></div>').join('')+'</div>';
  };

  showHatch=function(pets,e,newFlags){
    const h=$('#hatch'),best=pets.slice().sort((a,b)=>hatchRank(b)-hatchRank(a))[0],hasHuge=pets.some(p=>p.isHuge),hasRainbow=pets.some(p=>p.mutation==='Rainbow'),count=pets.length;
    hatchSeq++;hatchSession={id:hatchSeq,pets,e,newFlags,best,revealed:false,timers:[]};
    h.className='hatch show '+(count>1?'multi-mode ':'')+(hasHuge?'rarity-Huge':'rarity-'+best.rarity);
    $('#hatchEgg').textContent=e.icon;$('#hatchKicker').textContent=count>1?'READY ×'+count+'...':'READY...';$('#hatchHint').textContent='タップでスキップ';
    $('#hatchResult').innerHTML='<div class="hatch-rarity" id="hatchRarity"></div><div class="hatch-pet" id="hatchPet"></div><div class="hatch-name" id="hatchName"></div><div class="hatch-power" id="hatchPower"></div><div class="new-badge" id="newBadge">NEW!</div>';$('#rarityBanner').textContent='';
    audio('hatchStart');
    const rareDelay=hasHuge?2200:{Common:760,Uncommon:850,Rare:1080,Epic:1320,Legendary:1700}[best.rarity];
    later(()=>{$('#hatchKicker').textContent=count>1?'HATCHING ×'+count:'HATCHING';h.classList.add('crack1');audio('crack')},Math.min(430,rareDelay*.42));
    later(()=>{h.classList.add('crack2');audio('crack')},Math.min(720,rareDelay*.65));
    if(hasHuge||hasRainbow||['Rare','Epic','Legendary'].includes(best.rarity))later(()=>{$('#hatchKicker').textContent=hasHuge?'HUGE CHANCE...!':hasRainbow?'RAINBOW...!?':best.rarity==='Legendary'?'...!?':'SOMETHING RARE...';h.classList.add('shake')},Math.min(1100,rareDelay*.72));
    later(()=>revealHatch(false),rareDelay);
  };

  revealHatch=function(){
    if(!hatchSession||hatchSession.revealed)return;
    clearHatchTimers();hatchSession.revealed=true;
    const {pets,newFlags,best}=hatchSession,h=$('#hatch'),hasHuge=pets.some(p=>p.isHuge),hasRainbow=pets.some(p=>p.mutation==='Rainbow'),c=mutationColor(best),count=pets.length;
    h.className='hatch show revealed '+(count>1?'multi-mode ':'')+(hasHuge?'rarity-Huge':hasRainbow?'rarity-Legendary':'rarity-'+best.rarity)+' flash shake';
    if(best.rarity==='Legendary'||hasHuge||hasRainbow)h.classList.add('legendary-blast');
    $('#hatchKicker').textContent=hasHuge?'MEGA JACKPOT!':hasRainbow?'RAINBOW MUTATION!':count>1?count+' PETS!':best.rarity==='Legendary'?'JACKPOT!':'YOU GOT';
    $('#hatchHint').textContent='タップで閉じる';
    $('#rarityBanner').textContent=hasHuge?'HUGE!':hasRainbow?'RAINBOW!':best.rarity==='Legendary'?'LEGENDARY!':best.rarity==='Epic'?'EPIC!':'';
    if(count===1){
      const p=pets[0],isNew=newFlags[0],mut=mutationLabel(p.mutation);
      $('#hatchResult').innerHTML='<div class="hatch-rarity" id="hatchRarity">'+displayRarityText(p)+(mut?' · '+mut:'')+'</div><div class="hatch-pet" id="hatchPet">'+petModelHTML(p)+'</div><div class="hatch-name '+(p.mutation&&p.mutation!=='Normal'?'mutation-text-'+p.mutation:(p.isHuge?'rarity-Huge':'rarity-'+p.rarity))+'" id="hatchName">'+p.name+'</div><div class="hatch-power" id="hatchPower">⚔️ '+fmt(p.power)+' /秒 '+(p.mutation&&p.mutation!=='Normal'?'(×'+mutationMultiplier(p.mutation)+')':'')+'</div><div class="new-badge '+(isNew?'show':'')+'" id="newBadge">NEW!</div>';
    }else{
      $('#hatchResult').innerHTML='<div class="multi-hatch-summary">🥚 ×'+count+' 開封結果</div><div class="multi-hatch-grid">'+pets.map((p,i)=>'<div class="multi-hatch-item '+(p.isHuge?'huge-result':'')+'" style="--itemColor:'+mutationColor(p)+'"><div class="mini-rarity">'+(p.mutation&&p.mutation!=='Normal'?mutationLabel(p.mutation)+' · ':'')+displayRarityText(p)+(newFlags[i]?' · NEW!':'')+'</div><div class="mini-pet">'+petModelHTML(p)+'</div><div class="mini-name">'+p.name+'</div><div class="mini-power">⚔️ '+fmt(p.power)+'/秒</div></div>').join('')+'</div>';
    }
    audio(hasHuge?'Huge':best.rarity);
    burst(hasHuge?150:hasRainbow?130:best.rarity==='Legendary'?110:best.rarity==='Epic'?72:best.rarity==='Rare'?48:28,c,best.rarity==='Legendary'||hasHuge||hasRainbow);
    if(best.rarity==='Legendary'||hasHuge||hasRainbow)later(()=>burst(hasHuge?100:hasRainbow?90:70,c,true),170);
    later(()=>h.classList.remove('flash','shake'),650);
  };

  const sel=$('#adminRarity');
  if(sel&&!Array.from(sel.options).some(o=>o.value==='Huge')){
    const o=document.createElement('option');o.value='Huge';o.textContent='Huge';sel.appendChild(o);
  }
  const hugeCheck=$('#adminHuge');
  if(hugeCheck?.parentElement) hugeCheck.parentElement.style.display='none';
  adminAddPet=function(){
    const z=Number($('#adminPetZone')?.value||0),r=$('#adminRarity')?.value||'Legendary',m=$('#adminMutation')?.value||'Normal',isHuge=r==='Huge';
    const p=adminBuildPet(z,isHuge?'Legendary':r,m,isHuge);state.pets.push(p);autoEquip();adminRender();toast('🛠 '+p.name+' を追加');
  };

  renderAll();
})();