/* Version 9: Titanic rarity, hidden 0.1% chance */
(function(){
  const TITANIC_CHANCE=0.1;
  const TITANIC_MULT=12;

  window.displayRarity=function(p){
    if(p?.isTitanic)return 'Titanic';
    if(p?.isHuge)return 'Huge';
    return p?.rarity||'Common';
  };
  window.displayRarityText=p=>displayRarity(p).toUpperCase();

  const oldPetModelHTML=petModelHTML;
  petModelHTML=function(p,extra=''){
    const html=oldPetModelHTML(p,extra);
    if(!p?.isTitanic)return html;
    return html
      .replace(/rarity-[A-Za-z]+/, 'rarity-Titanic')
      .replace(' pet-model ', ' pet-model titanic ');
  };

  weightedPet=function(e){
    const pool=petPools[e.pool]||petPools[0];
    const rates=effectiveRates(e);
    const rarity=pickRarity(rates);
    const choices=pool.filter(p=>p.rarity===rarity);
    const base=choices[Math.floor(Math.random()*choices.length)]||pool[0];
    const isTitanic=Math.random()*100<TITANIC_CHANCE;
    const isHuge=!isTitanic && Math.random()*100<effectiveHugeChance(e);
    const mutation=rollMutation();
    const mutMul=mutationMultiplier(mutation);
    const rareMul=isTitanic?TITANIC_MULT:(isHuge?8:1);
    const power=Math.round(base.power*rareMul*mutMul);
    const prefixes=[mutation!=='Normal'?mutation:'',isTitanic?'Titanic':(isHuge?'Huge':'')].filter(Boolean).join(' ');
    return {...base,id:uid(),baseName:base.name,name:`${prefixes?prefixes+' ':''}${base.name}`,power,isHuge,isTitanic,mutation,mutationMultiplier:mutMul,sourceEgg:e.name,displayRarity:isTitanic?'Titanic':(isHuge?'Huge':base.rarity)};
  };

  renderEggs=function(){
    let box=$('#eggs'),amount=Math.max(1,Math.min(5,state.hatchAmount||1)),lm=luckMultiplier(),mr=mutationRates();
    box.innerHTML='<div class="small" style="margin-bottom:10px">現在は1回で <b style="color:#fff">'+amount+'個</b> 開封。🍀 Luck Lv.'+(state.luckLevel||0)+'（×'+lm.toFixed(1)+'） / 👑 Huge Luck Lv.'+(state.hugeLuckLevel||0)+'（×'+hugeLuckMultiplier().toFixed(2)+'）<br>砂漠・氷・火山は、それぞれのエリア専用モチーフのペットが出ます。</div>'+
    eggs.map((e,i)=>{
      const r=effectiveRates(e),pool=petPools[e.pool]||petPools[0],names=pool.map(p=>'<span class="rarity-'+p.rarity+'">'+p.name+'</span>').join(' / ');
      return '<div class="egg-card" style="opacity:'+(e.zone<=state.zone?1:.45)+'"><div class="egg-top"><div><div style="font-weight:1000">'+e.icon+' '+e.name+'</div><div class="price">🪙 '+fmt(e.cost*amount)+' <span class="small">('+fmt(e.cost)+' × '+amount+')</span></div></div><div class="egg-icon">'+e.icon+'</div></div><div class="small" style="margin-top:8px;line-height:1.55">排出: '+names+'</div><div class="rates">Common '+r.Common.toFixed(1)+'% / Uncommon '+r.Uncommon.toFixed(1)+'% / Rare '+r.Rare.toFixed(1)+'% / Epic '+r.Epic.toFixed(1)+'% / Legendary '+r.Legendary.toFixed(1)+'%<br><span class="rarity-Huge">Hugeレア '+effectiveHugeChance(e).toFixed(2)+'% / 1個ごと</span><br><span class="rarity-Titanic">Titanicレア ???</span><br><span class="mutation-text-Gold">Gold '+mr.Gold.toFixed(1)+'%</span> / <span class="mutation-text-Diamond">Diamond '+mr.Diamond.toFixed(1)+'%</span> / <span class="mutation-text-Rainbow">Rainbow '+mr.Rainbow.toFixed(2)+'%</span></div><button class="btn primary hatch-button" style="width:100%" onclick="hatch('+i+')" '+(e.zone>state.zone?'disabled':'')+'>'+(e.zone>state.zone?'🔒 エリア未解放':'✨ ×'+amount+' かえす')+'</button></div>';
    }).join('');
  };

  const baseRenderPets=renderPets;
  renderPets=function(){
    baseRenderPets();
    document.querySelectorAll('.pet-card').forEach(card=>{
      const name=card.querySelector('.pet-name')?.textContent||'';
      if(name.includes('Titanic '))card.classList.add('titanic-card');
    });
  };

  showHatch=function(pets,e,newFlags){
    const h=$('#hatch'),best=pets.slice().sort((a,b)=>hatchRank(b)-hatchRank(a))[0],hasTitanic=pets.some(p=>p.isTitanic),hasHuge=pets.some(p=>p.isHuge),hasRainbow=pets.some(p=>p.mutation==='Rainbow'),count=pets.length;
    hatchSeq++;hatchSession={id:hatchSeq,pets,e,newFlags,best,revealed:false,timers:[]};
    h.className='hatch show '+(count>1?'multi-mode ':'')+(hasTitanic?'rarity-Titanic':hasHuge?'rarity-Huge':'rarity-'+best.rarity);
    $('#hatchEgg').textContent=e.icon;$('#hatchKicker').textContent=count>1?'READY ×'+count+'...':'READY...';$('#hatchHint').textContent='タップでスキップ';
    $('#hatchResult').innerHTML='<div class="hatch-rarity" id="hatchRarity"></div><div class="hatch-pet" id="hatchPet"></div><div class="hatch-name" id="hatchName"></div><div class="hatch-power" id="hatchPower"></div><div class="new-badge" id="newBadge">NEW!</div>';$('#rarityBanner').textContent='';
    audio('hatchStart');
    const rareDelay=hasTitanic?2600:hasHuge?2200:{Common:760,Uncommon:850,Rare:1080,Epic:1320,Legendary:1700}[best.rarity];
    later(()=>{$('#hatchKicker').textContent=count>1?'HATCHING ×'+count:'HATCHING';h.classList.add('crack1');audio('crack')},Math.min(430,rareDelay*.42));
    later(()=>{h.classList.add('crack2');audio('crack')},Math.min(720,rareDelay*.65));
    if(hasTitanic||hasHuge||hasRainbow||['Rare','Epic','Legendary'].includes(best.rarity))later(()=>{$('#hatchKicker').textContent=hasTitanic?'...WHAT!?':hasHuge?'HUGE CHANCE...!':hasRainbow?'RAINBOW...!?':best.rarity==='Legendary'?'...!?':'SOMETHING RARE...';h.classList.add('shake')},Math.min(1200,rareDelay*.72));
    later(()=>revealHatch(false),rareDelay);
  };

  revealHatch=function(){
    if(!hatchSession||hatchSession.revealed)return;
    clearHatchTimers();hatchSession.revealed=true;
    const {pets,newFlags,best}=hatchSession,h=$('#hatch'),hasTitanic=pets.some(p=>p.isTitanic),hasHuge=pets.some(p=>p.isHuge),hasRainbow=pets.some(p=>p.mutation==='Rainbow'),c=hasTitanic?'#ff72e8':mutationColor(best),count=pets.length;
    h.className='hatch show revealed '+(count>1?'multi-mode ':'')+(hasTitanic?'rarity-Titanic':hasHuge?'rarity-Huge':hasRainbow?'rarity-Legendary':'rarity-'+best.rarity)+' flash shake';
    if(best.rarity==='Legendary'||hasTitanic||hasHuge||hasRainbow)h.classList.add('legendary-blast');
    $('#hatchKicker').textContent=hasTitanic?'IMPOSSIBLE!?':hasHuge?'MEGA JACKPOT!':hasRainbow?'RAINBOW MUTATION!':count>1?count+' PETS!':best.rarity==='Legendary'?'JACKPOT!':'YOU GOT';
    $('#hatchHint').textContent='タップで閉じる';
    $('#rarityBanner').textContent=hasTitanic?'TITANIC!':hasHuge?'HUGE!':hasRainbow?'RAINBOW!':best.rarity==='Legendary'?'LEGENDARY!':best.rarity==='Epic'?'EPIC!':'';
    if(count===1){
      const p=pets[0],isNew=newFlags[0],mut=mutationLabel(p.mutation);
      $('#hatchResult').innerHTML='<div class="hatch-rarity" id="hatchRarity">'+displayRarityText(p)+(mut?' · '+mut:'')+'</div><div class="hatch-pet" id="hatchPet">'+petModelHTML(p)+'</div><div class="hatch-name '+(p.mutation&&p.mutation!=='Normal'?'mutation-text-'+p.mutation:'rarity-'+displayRarity(p))+'" id="hatchName">'+p.name+'</div><div class="hatch-power" id="hatchPower">⚔️ '+fmt(p.power)+' /秒 '+(p.mutation&&p.mutation!=='Normal'?'(×'+mutationMultiplier(p.mutation)+')':'')+'</div><div class="new-badge '+(isNew?'show':'')+'" id="newBadge">NEW!</div>';
    }else{
      $('#hatchResult').innerHTML='<div class="multi-hatch-summary">🥚 ×'+count+' 開封結果</div><div class="multi-hatch-grid">'+pets.map((p,i)=>'<div class="multi-hatch-item '+(p.isTitanic?'titanic-result':p.isHuge?'huge-result':'')+'" style="--itemColor:'+(p.isTitanic?'#ff72e8':mutationColor(p))+'"><div class="mini-rarity">'+(p.mutation&&p.mutation!=='Normal'?mutationLabel(p.mutation)+' · ':'')+displayRarityText(p)+(newFlags[i]?' · NEW!':'')+'</div><div class="mini-pet">'+petModelHTML(p)+'</div><div class="mini-name">'+p.name+'</div><div class="mini-power">⚔️ '+fmt(p.power)+'/秒</div></div>').join('')+'</div>';
    }
    audio(hasTitanic?'Huge':hasHuge?'Huge':best.rarity);
    burst(hasTitanic?190:hasHuge?150:hasRainbow?130:best.rarity==='Legendary'?110:best.rarity==='Epic'?72:best.rarity==='Rare'?48:28,c,best.rarity==='Legendary'||hasTitanic||hasHuge||hasRainbow);
    if(best.rarity==='Legendary'||hasTitanic||hasHuge||hasRainbow)later(()=>burst(hasTitanic?150:hasHuge?100:hasRainbow?90:70,c,true),170);
    later(()=>h.classList.remove('flash','shake'),700);
  };

  const sel=$('#adminRarity');
  if(sel&&!Array.from(sel.options).some(o=>o.value==='Titanic')){
    const o=document.createElement('option');o.value='Titanic';o.textContent='Titanic';sel.appendChild(o);
  }

  adminAddPet=function(){
    const z=Number($('#adminPetZone')?.value||0),r=$('#adminRarity')?.value||'Legendary',m=$('#adminMutation')?.value||'Normal';
    const egg=eggs[Math.max(0,Math.min(eggs.length-1,z))],pool=petPools[egg.pool]||petPools[0];
    const isTitanic=r==='Titanic',isHuge=r==='Huge';
    const baseRarity=(isTitanic||isHuge)?'Legendary':r;
    const choices=pool.filter(p=>p.rarity===baseRarity),base=choices[choices.length-1]||pool[pool.length-1];
    const mul=mutationMultiplier(m),rareMul=isTitanic?TITANIC_MULT:(isHuge?8:1);
    const power=Math.round(base.power*rareMul*mul);
    const prefixes=[m!=='Normal'?m:'',isTitanic?'Titanic':isHuge?'Huge':''].filter(Boolean).join(' ');
    const p={...base,id:uid(),baseName:base.name,name:(prefixes?prefixes+' ':'')+base.name,power,isHuge,isTitanic,mutation:m,mutationMultiplier:mul,sourceEgg:'ADMIN: '+egg.name,displayRarity:isTitanic?'Titanic':(isHuge?'Huge':base.rarity)};
    state.pets.push(p);autoEquip();adminRender();toast('🛠 '+p.name+' を追加');
  };

  const quickHugeBtn=[...document.querySelectorAll('.admin-btn')].find(b=>b.textContent.includes('Rainbow Huge'));
  if(quickHugeBtn&&!document.querySelector('#adminTitanicBtn')){
    const b=document.createElement('button');b.id='adminTitanicBtn';b.className='admin-btn';b.style.background='#4a1649';b.style.color='#ffd6ff';b.style.borderColor='#9b3a94';b.textContent='🌌 Titanic追加';
    b.onclick=()=>{const oldR=$('#adminRarity').value,oldM=$('#adminMutation').value;$('#adminRarity').value='Titanic';adminAddPet();$('#adminRarity').value=oldR;$('#adminMutation').value=oldM;};
    quickHugeBtn.parentElement.appendChild(b);
  }

  renderAll();
})();