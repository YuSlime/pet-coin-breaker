/* Version 45: ultra luxury hatch director */
(function(){
  const root=()=>document.querySelector('#hatch');
  const palette={Common:['#9fd0ff','#d9efff'],Uncommon:['#89efb4','#d7ffe4'],Rare:['#65bbff','#dff3ff'],Epic:['#c18bff','#f0ddff'],Legendary:['#ffd45f','#fff3ad'],Rainbow:['#ff76d8','#8ff7ff'],Huge:['#ffe36f','#ff91d8'],Titanic:['#82efff','#ff76e5']};
  function bestOf(pets){return pets.slice().sort((a,b)=>hatchRank(b)-hatchRank(a))[0]}
  function tier(pets,best){
    if(pets.some(p=>p.isTitanic))return {key:'Titanic',label:'TITANIC',colors:palette.Titanic};
    if(pets.some(p=>p.isHuge))return {key:'Huge',label:'HUGE',colors:palette.Huge};
    if(pets.some(p=>p.mutation==='Rainbow'))return {key:'Rainbow',label:'RAINBOW',colors:palette.Rainbow};
    const key=best?.rarity||'Common';return {key,label:key.toUpperCase(),colors:palette[key]||palette.Common};
  }
  function ensure(){
    const r=root();if(!r)return null;
    let bg=r.querySelector('.v45-grandfx'),front=r.querySelector('.v45-frontfx');
    if(bg&&front)return {bg,front};
    bg=document.createElement('div');bg.className='v45-grandfx';
    bg.innerHTML='<div class="v45-nebula"></div><div class="v45-aurora"></div><div class="v45-spot"></div><div class="v45-spot2"></div><div class="v45-ring"><i class="v45-runes"></i></div><div class="v45-ring2"></div><div class="v45-ring3"></div><div class="v45-particles"></div><div class="v45-core"></div><div class="v45-wash"></div><div class="v45-shock"></div><div class="v45-rays"></div><div class="v45-prisms"></div>';
    front=document.createElement('div');front.className='v45-frontfx';
    front.innerHTML='<div class="v45-title"></div><div class="v45-sil"></div><div class="v45-best"></div>';
    r.appendChild(bg);r.appendChild(front);
    const ps=bg.querySelector('.v45-particles');
    for(let i=0;i<34;i++){
      const a=Math.PI*2*i/34+(i%4)*.06,rad=190+(i%7)*35,p=document.createElement('i');p.className='v45-p';
      p.style.setProperty('--sx',Math.cos(a)*rad+'px');p.style.setProperty('--sy',Math.sin(a)*rad+'px');p.style.setProperty('--ss',(.45+(i%6)*.11).toFixed(2));p.style.setProperty('--dur',(.7+(i%8)*.08).toFixed(2)+'s');p.style.setProperty('--delay',(-((i%11)*.1)).toFixed(2)+'s');ps.appendChild(p);
    }
    const rays=bg.querySelector('.v45-rays');for(let i=0;i<28;i++){const el=document.createElement('i');el.className='v45-ray';el.style.setProperty('--r',i*(360/28)+'deg');rays.appendChild(el)}
    const prisms=bg.querySelector('.v45-prisms');for(let i=0;i<18;i++){const el=document.createElement('i');el.className='v45-prism';el.style.setProperty('--r',i*20+10+'deg');prisms.appendChild(el)}
    return {bg,front};
  }
  function reset(r){
    [...r.classList].filter(c=>c.startsWith('v45-tier-')).forEach(c=>r.classList.remove(c));
    r.classList.remove('v45-prep','v45-climax','v45-burst','v45-title-show','v45-sil-phase','v45-materialized');
    const fx=ensure();if(!fx)return;
    fx.front.querySelector('.v45-title').textContent='';fx.front.querySelector('.v45-sil').innerHTML='';
    const best=fx.front.querySelector('.v45-best');best.classList.remove('show');best.innerHTML='';
  }
  function styleTier(r,info){
    r.classList.add('v45-tier-'+info.key);r.style.setProperty('--v45c',info.colors[0]);r.style.setProperty('--v45c2',info.colors[1]);
    const fx=ensure();if(fx)fx.front.querySelector('.v45-title').textContent=info.label+' HATCH';
  }
  function vibe(info){
    if(!navigator.vibrate)return;const map={Common:[10],Uncommon:[14,12,16],Rare:[18,18,28],Epic:[20,20,40],Legendary:[26,18,64,18,24],Rainbow:[22,14,44,14,58],Huge:[30,18,72,22,48],Titanic:[36,18,96,26,66]};
    try{navigator.vibrate(map[info.key]||[12])}catch(e){}
  }
  function showBest(best,info){
    const fx=ensure();if(!fx||!best)return;const box=fx.front.querySelector('.v45-best');
    const rarity=best.isTitanic?'TITANIC':best.isHuge?'HUGE':best.mutation==='Rainbow'?'RAINBOW':best.rarity.toUpperCase();
    box.innerHTML='<div class="v45-best-card"><div class="v45-best-top">BEST RESULT</div><div class="v45-best-rarity">'+rarity+'</div><div class="v45-best-pet">'+petModelHTML(best)+'</div><div class="v45-best-name">'+best.name+'</div></div>';
    box.classList.remove('show');void box.offsetWidth;box.classList.add('show');later(()=>box.classList.remove('show'),1650);
  }
  const oldAudio=audio;
  audio=function(type='hit'){
    if(!state.sound)return;
    if(type==='v45Charge'){tone(100,.34,'sine',.03,0,140);tone(200,.28,'sine',.024,.06,280);tone(360,.22,'triangle',.018,.15,520);return}
    if(type==='v45Climax'){tone(160,.2,'sine',.05,0,560);tone(420,.18,'triangle',.03,.03,1100);tone(880,.14,'sine',.018,.11,1500);return}
    if(type==='v45Burst'){noise(.1,.02,0);tone(52,.26,'sine',.08,0,32);tone(740,.09,'sine',.03,.02,1280);tone(1480,.14,'triangle',.022,.07,1880);return}
    if(type==='v45Legend'){[392,523,659,880,1175].forEach((f,i)=>tone(f,.28,'triangle',.044,.05+i*.06,f*1.08));tone(1568,.44,'sine',.03,.34,1975);return}
    if(type==='v45Huge'){[330,440,554,740,988,1319].forEach((f,i)=>tone(f,.34,'triangle',.046,.05+i*.07,f*1.12));tone(1760,.58,'sine',.03,.48,2350);return}
    if(type==='v45Titanic'){[262,392,523,659,784,1047,1568].forEach((f,i)=>tone(f,.42,i<2?'triangle':'sine',.045,.05+i*.075,f*1.12));tone(2637,.72,'sine',.03,.62,3520);return}
    return oldAudio(type);
  };audio.ctx=oldAudio.ctx;
  const oldShow=showHatch;
  showHatch=function(pets,e,newFlags){
    const out=oldShow.apply(this,arguments),r=root();if(!r||!pets?.length)return out;
    ensure();reset(r);const best=bestOf(pets),info=tier(pets,best);styleTier(r,info);r.classList.add('v45-prep');
    ensure().front.querySelector('.v45-sil').innerHTML=petModelHTML(best);audio('v45Charge');
    const delay=pets.some(p=>p.isTitanic)?2700:pets.some(p=>p.isHuge)?2300:({Common:820,Uncommon:920,Rare:1180,Epic:1420,Legendary:1800}[best?.rarity]||960);
    later(()=>{if(!hatchSession||hatchSession.revealed)return;r.classList.add('v45-climax');audio('v45Climax')},Math.max(430,delay-220));
    return out;
  };
  const oldReveal=revealHatch;
  revealHatch=function(){
    if(!hatchSession||hatchSession.revealed)return oldReveal.apply(this,arguments);
    const pets=(hatchSession.pets||[]).slice(),best=hatchSession.best||pets[0],info=tier(pets,best),out=oldReveal.apply(this,arguments),r=root();if(!r)return out;
    reset(r);styleTier(r,info);r.classList.add('v45-burst','v45-title-show','v45-sil-phase');ensure().front.querySelector('.v45-sil').innerHTML=petModelHTML(best);vibe(info);audio('v45Burst');
    if(info.key==='Legendary'||info.key==='Rainbow')later(()=>audio('v45Legend'),90);if(info.key==='Huge')later(()=>audio('v45Huge'),100);if(info.key==='Titanic')later(()=>audio('v45Titanic'),110);
    later(()=>{r.classList.remove('v45-sil-phase');r.classList.add('v45-materialized')},280);
    const cards=[...r.querySelectorAll('.multi-hatch-item')];
    if(cards.length){cards.forEach(c=>c.classList.add('v45-glow-pop'));cards.forEach((c,i)=>later(()=>{c.classList.remove('v45-pop-now');void c.offsetWidth;c.classList.add('v45-pop-now')},180+i*110));later(()=>showBest(best,info),Math.min(1550,520+cards.length*110))}
    later(()=>r.classList.remove('v45-burst'),980);later(()=>r.classList.remove('v45-materialized','v45-title-show','v45-climax','v45-prep'),1700);return out;
  };
  ensure();
})();