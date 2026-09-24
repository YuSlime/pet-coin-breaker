/* Version 43: cinematic hatch director — visuals/SFX/haptics only, odds untouched */
(function(){
  const h=()=>document.querySelector('#hatch');

  function tierInfo(pets,best){
    if(pets.some(p=>p.isTitanic)) return {key:'Titanic',label:'TITANIC!',color:'#82efff'};
    if(pets.some(p=>p.isHuge)) return {key:'Huge',label:'HUGE!',color:'#ffe36f'};
    if(pets.some(p=>p.mutation==='Rainbow')) return {key:'Rainbow',label:'RAINBOW!',color:'#ff76d8'};
    const k=best?.rarity||'Common';
    return {key:k,label:k.toUpperCase()+'!',color:mutationColor(best)};
  }

  function ensureV43Fx(){
    const root=h();
    if(!root)return null;
    let fx=root.querySelector('.v43-cinematic');
    if(fx)return fx;

    fx=document.createElement('div');
    fx.className='v43-cinematic';
    fx.innerHTML='<div class="v43-vignette"></div><div class="v43-letterbox"></div><div class="v43-magic-circle"><i class="v43-runes"></i></div><div class="v43-core-flare"></div><div class="v43-pull-field"></div><div class="v43-color-flash"></div><div class="v43-impact-lines"></div><div class="v43-land-ring"></div><div class="v43-silhouette"><div class="v43-silhouette-pet"></div></div><div class="v43-best-showcase"></div>';
    root.appendChild(fx);

    const field=fx.querySelector('.v43-pull-field');
    for(let i=0;i<26;i++){
      const a=(Math.PI*2*i/26)+((i%4)*.055);
      const radius=210+(i%6)*42;
      const p=document.createElement('i');
      p.className='v43-pull-particle';
      p.style.setProperty('--sx',(Math.cos(a)*radius)+'px');
      p.style.setProperty('--sy',(Math.sin(a)*radius)+'px');
      p.style.setProperty('--ss',(.45+(i%5)*.13).toFixed(2));
      p.style.setProperty('--dur',(.74+(i%7)*.085).toFixed(2)+'s');
      p.style.setProperty('--delay',(-((i%9)*.11)).toFixed(2)+'s');
      field.appendChild(p);
    }

    const lines=fx.querySelector('.v43-impact-lines');
    for(let i=0;i<24;i++){
      const line=document.createElement('i');
      line.className='v43-impact-line';
      line.style.setProperty('--r',(i*15)+'deg');
      line.style.animationDelay=(i%4*.018)+'s';
      lines.appendChild(line);
    }
    return fx;
  }

  function resetV43Classes(root){
    [...root.classList].filter(c=>c.startsWith('v43-pre-')).forEach(c=>root.classList.remove(c));
    root.classList.remove('v43-slowmo','v43-reveal-impact','v43-silhouette-phase','v43-materialized');
    const fx=ensureV43Fx();
    fx?.querySelector('.v43-best-showcase')?.classList.remove('v43-best-show');
    if(fx){
      const s=fx.querySelector('.v43-silhouette-pet');
      if(s)s.innerHTML='';
      const b=fx.querySelector('.v43-best-showcase');
      if(b)b.innerHTML='';
    }
  }

  function setTier(root,info){
    [...root.classList].filter(c=>c.startsWith('v43-pre-')).forEach(c=>root.classList.remove(c));
    root.classList.add('v43-pre-'+info.key);
    root.style.setProperty('--v43c',info.color);
  }

  function haptic(info){
    if(!navigator.vibrate)return;
    const patterns={
      Common:[10],Uncommon:[12,18,16],Rare:[18,18,35],Epic:[20,20,45],Legendary:[24,18,58,18,24],Rainbow:[24,18,62,18,30],Huge:[32,22,72,24,40],Titanic:[42,24,92,28,62]
    };
    try{navigator.vibrate(patterns[info.key]||[14]);}catch(e){}
  }

  function rarityDelay(pets,best){
    if(pets.some(p=>p.isTitanic))return 2600;
    if(pets.some(p=>p.isHuge))return 2200;
    return {Common:760,Uncommon:850,Rare:1080,Epic:1320,Legendary:1700}[best?.rarity]||900;
  }

  function silhouette(best){
    const fx=ensureV43Fx();
    const slot=fx?.querySelector('.v43-silhouette-pet');
    if(slot)slot.innerHTML=petModelHTML(best);
  }

  function bestShowcase(best,info){
    const fx=ensureV43Fx();
    const box=fx?.querySelector('.v43-best-showcase');
    if(!box||!best)return;
    const label=best.isTitanic?'TITANIC':best.isHuge?'HUGE':best.mutation==='Rainbow'?'RAINBOW':best.rarity.toUpperCase();
    box.innerHTML='<div class="v43-best-card"><div class="v43-best-label">BEST RESULT</div><div class="v43-best-rarity">'+label+'</div><div class="v43-best-pet">'+petModelHTML(best)+'</div><div class="v43-best-name">'+best.name+'</div></div>';
    box.classList.remove('v43-best-show');
    void box.offsetWidth;
    box.classList.add('v43-best-show');
    later(()=>box.classList.remove('v43-best-show'),1500);
  }

  const previousAudio=audio;
  audio=function(type='hit'){
    if(!state.sound)return;
    if(type==='v43Charge'){
      tone(118,.28,'sine',.028,0,165);
      tone(236,.24,'sine',.018,.08,330);
      return;
    }
    if(type==='v43Tension'){
      tone(160,.18,'sine',.04,0,520);
      tone(320,.16,'triangle',.026,.04,930);
      return;
    }
    if(type==='v43Impact'){
      noise(.09,.018,0);
      tone(58,.22,'sine',.075,0,34);
      tone(880,.08,'sine',.027,.018,1320);
      return;
    }
    if(type==='v43HugeJingle'){
      [392,523,659,784,1047,1319].forEach((f,i)=>tone(f,.34,'sine',.035,.08+i*.07,f*1.08));
      tone(2093,.6,'sine',.025,.48,2637);
      return;
    }
    if(type==='v43TitanicJingle'){
      [262,392,523,659,988,1319,1976].forEach((f,i)=>tone(f,.42,i<2?'triangle':'sine',.038,.08+i*.075,f*1.12));
      tone(2637,.72,'sine',.03,.63,3520);
      return;
    }
    return previousAudio(type);
  };
  audio.ctx=previousAudio.ctx;

  const previousShow=showHatch;
  showHatch=function(pets,e,newFlags){
    const out=previousShow.apply(this,arguments);
    const root=h();
    if(!root||!pets?.length)return out;
    ensureV43Fx();
    resetV43Classes(root);
    const best=pets.slice().sort((a,b)=>hatchRank(b)-hatchRank(a))[0];
    const info=tierInfo(pets,best);
    setTier(root,info);
    silhouette(best);
    audio('v43Charge');

    const delay=rarityDelay(pets,best);
    const slowAt=Math.max(420,delay-185);
    later(()=>{
      if(!hatchSession||hatchSession.revealed)return;
      root.classList.add('v43-slowmo');
      audio('v43Tension');
    },slowAt);
    return out;
  };

  const previousReveal=revealHatch;
  revealHatch=function(){
    if(!hatchSession||hatchSession.revealed)return previousReveal.apply(this,arguments);
    const pets=(hatchSession.pets||[]).slice();
    const best=hatchSession.best||pets[0];
    const info=tierInfo(pets,best);

    const out=previousReveal.apply(this,arguments);
    const root=h();
    if(!root)return out;
    setTier(root,info);
    root.classList.remove('v43-slowmo');
    root.classList.add('v43-reveal-impact','v43-silhouette-phase');
    silhouette(best);
    haptic(info);
    audio('v43Impact');
    if(info.key==='Huge')later(()=>audio('v43HugeJingle'),120);
    if(info.key==='Titanic')later(()=>audio('v43TitanicJingle'),120);

    const fx=ensureV43Fx();
    fx?.querySelectorAll('.v43-color-flash,.v43-impact-line,.v43-land-ring,.v43-silhouette').forEach(el=>{
      el.style.animation='none';void el.offsetWidth;el.style.animation='';
    });

    later(()=>{
      root.classList.remove('v43-silhouette-phase');
      root.classList.add('v43-materialized');
      const pet=root.querySelector('.hatch-pet');
      if(pet){pet.classList.remove('v43-materialize');void pet.offsetWidth;pet.classList.add('v43-materialize');}
    },260);

    const cards=[...root.querySelectorAll('.multi-hatch-item')];
    if(cards.length){
      cards.forEach(card=>card.classList.add('v43-stagger-card'));
      cards.forEach((card,i)=>later(()=>card.classList.add('v43-stagger-show'),160+i*115));
      later(()=>bestShowcase(best,info),Math.min(1450,420+cards.length*115));
    }

    later(()=>root.classList.remove('v43-reveal-impact'),900);
    later(()=>root.classList.remove('v43-materialized'),1450);
    return out;
  };

  ensureV43Fx();
})();