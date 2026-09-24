/* Version 41: orchestrate satisfying hatch FX + custom hatch SFX */
(function(){
  let titanAudioPending=false;

  function ensureFx(){
    const h=document.querySelector('#hatch');
    if(!h)return null;
    let layer=h.querySelector('.v41-hatch-fx');
    if(layer)return layer;

    layer=document.createElement('div');
    layer.className='v41-hatch-fx';

    const white=document.createElement('i');
    white.className='v41-whiteout';
    layer.appendChild(white);

    const wave=document.createElement('i');
    wave.className='v41-impact-wave';
    layer.appendChild(wave);

    const shards=document.createElement('div');
    shards.className='v41-shell-shards';
    const shardVectors=[
      [-210,-155,-210],[-145,-230,-150],[-62,-250,-105],[70,-248,112],
      [155,-215,165],[220,-120,225],[215,70,295],[135,160,350],
      [-130,165,-340],[-220,70,-285]
    ];
    shardVectors.forEach(([x,y,r],i)=>{
      const s=document.createElement('i');
      s.className='v41-shard';
      s.style.setProperty('--sx',x+'px');
      s.style.setProperty('--sy',y+'px');
      s.style.setProperty('--sr',r+'deg');
      s.style.animationDelay=(i*0.018)+'s';
      shards.appendChild(s);
    });
    layer.appendChild(shards);

    const stars=document.createElement('div');
    stars.className='v41-starfield';
    for(let i=0;i<22;i++){
      const a=(Math.PI*2*i/22)+(i%3)*.08;
      const radius=150+(i%5)*34;
      const s=document.createElement('i');
      s.className='v41-star';
      s.style.setProperty('--sx',(Math.cos(a)*radius)+'px');
      s.style.setProperty('--sy',(Math.sin(a)*radius)+'px');
      s.style.animationDelay=(i*.012)+'s';
      stars.appendChild(s);
    }
    layer.appendChild(stars);

    h.appendChild(layer);
    return layer;
  }

  function effectColor(pets,best){
    if(pets.some(p=>p.isTitanic))return '#82efff';
    if(pets.some(p=>p.isHuge))return '#ffe36f';
    if(pets.some(p=>p.mutation==='Rainbow'))return '#ff79dc';
    return mutationColor(best);
  }

  function tintFx(color){
    const layer=ensureFx();
    if(!layer)return;
    layer.querySelectorAll('.v41-star').forEach((s,i)=>{
      s.style.color=i%4===0?'#ffffff':color;
    });
    const wave=layer.querySelector('.v41-impact-wave');
    if(wave){
      wave.style.borderColor=color;
      wave.style.boxShadow='0 0 30px '+color+', inset 0 0 25px rgba(255,255,255,.3)';
    }
  }

  // Hatch-specific synthesized SFX. Other game sounds fall through to the previous audio system.
  const previousAudio=audio;
  audio=function(type='hit'){
    if(!state.sound)return;

    if(type==='hatchStart'){
      tone(210,.12,'sine',.038,0,300);
      tone(315,.15,'sine',.034,.08,460);
      tone(480,.18,'sine',.028,.17,720);
      return;
    }
    if(type==='crack'){
      noise(.038,.025,0);
      tone(145,.055,'triangle',.046,0,92);
      tone(760,.04,'sine',.018,.008,510);
      return;
    }
    if(type==='Common'){
      tone(480,.08,'sine',.052,0,620);
      tone(720,.12,'sine',.042,.055,820);
      return;
    }
    if(type==='Uncommon'){
      tone(440,.09,'sine',.052);
      tone(660,.11,'sine',.048,.06);
      tone(920,.15,'sine',.04,.13);
      return;
    }
    if(type==='Rare'){
      tone(360,.11,'triangle',.06);
      tone(540,.12,'sine',.056,.055);
      tone(780,.15,'sine',.052,.12);
      tone(1160,.22,'sine',.04,.21,1320);
      return;
    }
    if(type==='Epic'){
      tone(190,.16,'sine',.052,0,145);
      [392,523,659,880].forEach((f,i)=>tone(f,.22,'sine',.058,.045+i*.075,f*1.08));
      tone(1320,.32,'sine',.038,.34,1560);
      return;
    }
    if(type==='Legendary'){
      noise(.12,.025,0);
      tone(96,.20,'sine',.075,0,58);
      [392,523,659,784,1047].forEach((f,i)=>tone(f,.29,'triangle',.068,.04+i*.065,f*1.11));
      tone(1568,.62,'sine',.045,.43,2093);
      return;
    }
    if(type==='Huge'){
      if(titanAudioPending){
        noise(.18,.03,0);
        tone(54,.42,'sine',.105,0,34);
        tone(82,.34,'sine',.075,.08,48);
        [330,440,660,880,1320].forEach((f,i)=>tone(f,.42,'triangle',.068,.12+i*.085,f*1.16));
        tone(1760,.75,'sine',.052,.58,2637);
        tone(2637,.82,'sine',.032,.72,3136);
      }else{
        noise(.15,.028,0);
        tone(72,.32,'sine',.09,0,44);
        [392,523,659,784,1047,1319].forEach((f,i)=>tone(f,.37,'triangle',.074,.06+i*.075,f*1.12));
        tone(1760,.72,'sine',.05,.52,2349);
      }
      return;
    }

    return previousAudio(type);
  };
  audio.ctx=previousAudio.ctx;

  const oldShow=showHatch;
  showHatch=function(pets,e,newFlags){
    const out=oldShow.apply(this,arguments);
    const h=document.querySelector('#hatch');
    if(!h)return out;
    ensureFx();
    const best=pets.slice().sort((a,b)=>hatchRank(b)-hatchRank(a))[0];
    tintFx(effectColor(pets,best));
    h.classList.add('v41-charge');
    return out;
  };

  const oldReveal=revealHatch;
  revealHatch=function(){
    if(!hatchSession||hatchSession.revealed)return oldReveal.apply(this,arguments);

    const pets=hatchSession.pets||[];
    const best=hatchSession.best||pets[0];
    const hasTitanic=pets.some(p=>p.isTitanic);
    titanAudioPending=hasTitanic;
    let out;
    try{
      out=oldReveal.apply(this,arguments);
    }finally{
      titanAudioPending=false;
    }

    const h=document.querySelector('#hatch');
    if(!h)return out;
    tintFx(effectColor(pets,best));
    h.classList.remove('v41-charge');
    h.classList.add('v41-reveal','v41-impact');

    // Restart shell/star animations even when skipping quickly.
    const layer=ensureFx();
    if(layer){
      layer.querySelectorAll('.v41-shard,.v41-star,.v41-whiteout,.v41-impact-wave').forEach(el=>{
        el.style.animation='none';
        void el.offsetWidth;
        el.style.animation='';
      });
    }

    const summary=h.querySelector('.multi-hatch-summary');
    if(summary)summary.classList.add('v41-summary-enter');

    const cards=[...h.querySelectorAll('.multi-hatch-item')];
    cards.forEach((card,i)=>{
      card.classList.remove('v41-card-enter');
      setTimeout(()=>card.classList.add('v41-card-enter'),110+i*95);
    });

    setTimeout(()=>h.classList.remove('v41-impact'),480);
    setTimeout(()=>h.classList.remove('v41-reveal'),1100);
    return out;
  };

  ensureFx();
})();