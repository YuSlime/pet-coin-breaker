/* Version 51: Huge-only royal cinematic; no changes to rewards or odds */
(function(){
  const root=()=>document.querySelector('#hatch');
  function clear(){const r=root();if(!r)return;r.classList.remove('v51-huge-active');r.querySelector('.v51-huge-stage')?.remove();}
  function play(best){
    const r=root();if(!r||!best)return;clear();
    const stage=document.createElement('div');stage.className='v51-huge-stage';
    stage.innerHTML='<div class="v51-huge-veil"></div><div class="v51-huge-crown">♛</div><div class="v51-huge-title">HUGE!!</div>';
    for(let i=0;i<6;i++){const el=document.createElement('i');el.className='v51-huge-ring';el.style.setProperty('--angle',(i*30)+'deg');el.style.setProperty('--delay',(i*.13)+'s');stage.appendChild(el);}
    for(let i=0;i<48;i++){const el=document.createElement('i');el.className='v51-huge-star';const a=i*Math.PI*2/48,rad=120+(i%6)*45;el.textContent=i%3?'✦':'✧';el.style.setProperty('--angle',i*17+'deg');el.style.setProperty('--sz',(10+i%4*6)+'px');el.style.setProperty('--dx',Math.cos(a)*rad+'px');el.style.setProperty('--dy',Math.sin(a)*rad+'px');el.style.setProperty('--delay',(.85+i%8*.07)+'s');stage.appendChild(el);}
    for(let i=0;i<3;i++){const el=document.createElement('i');el.className='v51-huge-wave';el.style.setProperty('--delay',(1.45+i*.2)+'s');stage.appendChild(el);}
    const showcase=document.createElement('div');showcase.className='v51-huge-showcase';
    const model=document.createElement('div');model.innerHTML=petModelHTML(best);
    const name=document.createElement('div');name.className='v51-huge-name';name.textContent=best.name||'HUGE PET';
    showcase.append(model,name);stage.appendChild(showcase);r.appendChild(stage);r.classList.add('v51-huge-active');
    if(state.sound){try{tone(110,.38,'sine',.065,0,48);[330,440,554,659,880,1175].forEach((f,i)=>tone(f,.38,'triangle',.025,.18+i*.1,f*1.08));}catch(e){}}
    if(navigator.vibrate)try{navigator.vibrate([45,30,90,45,130])}catch(e){}
    const session=hatchSession;
    setTimeout(()=>{if(hatchSession===session)clear();else stage.remove()},5200);
  }
  const previousReveal=revealHatch;
  revealHatch=function(){
    const s=hatchSession;
    const pets=s&&!s.revealed?Array.isArray(s.pets)?s.pets.slice():[]:[];
    const huge=pets.filter(p=>p.isHuge&&!p.isTitanic).sort((a,b)=>hatchRank(b)-hatchRank(a))[0];
    const out=previousReveal.apply(this,arguments);
    if(huge&&hatchSession===s)play(huge);
    return out;
  };
  const previousShow=showHatch;
  showHatch=function(){clear();return previousShow.apply(this,arguments);};
  const previousClose=closeHatch;
  closeHatch=function(){clear();return previousClose.apply(this,arguments);};
})();