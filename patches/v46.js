/* Version 46: replace legacy emoji eggs with luxury in-game egg models */
(function(){
  function zoneIndex(e,i=0){
    const z=Number(e?.zone ?? i);
    return Math.max(0,Math.min(6,Number.isFinite(z)?z:i));
  }

  function luxuryEggHTML(e,i=0,mode='card'){
    const z=zoneIndex(e,i);
    return '<span class="lux-egg lux-egg-zone-'+z+' lux-egg-'+mode+'" data-egg-zone="'+z+'" aria-hidden="true">'+
      '<span class="lux-egg-shell"></span>'+
      '<span class="lux-egg-crown"></span>'+
      '<span class="lux-egg-wing left"></span>'+
      '<span class="lux-egg-wing right"></span>'+
      '<span class="lux-egg-gem"></span>'+
      '<i class="lux-egg-star s1"></i><i class="lux-egg-star s2"></i><i class="lux-egg-star s3"></i>'+
    '</span>';
  }
  window.luxuryEggHTML=luxuryEggHTML;

  function decorateEggCards(){
    const cards=[...document.querySelectorAll('#eggs .egg-card')];
    cards.forEach((card,i)=>{
      const e=eggs[i];
      if(!e)return;

      const icon=card.querySelector('.egg-icon');
      if(icon){
        icon.classList.add('v46-egg-icon');
        icon.innerHTML=luxuryEggHTML(e,i,'card');
      }

      const title=card.querySelector('.egg-top > div:first-child > div:first-child');
      if(title){
        title.classList.add('v46-egg-title');
        title.innerHTML=luxuryEggHTML(e,i,'mini')+'<span>'+e.name+'</span>';
      }
    });
  }

  window.v46EggRefresh=decorateEggCards;

  const oldRenderEggs=renderEggs;
  renderEggs=function(){
    const out=oldRenderEggs.apply(this,arguments);
    decorateEggCards();
    return out;
  };

  const oldShowHatch=showHatch;
  showHatch=function(pets,e,newFlags){
    const out=oldShowHatch.apply(this,arguments);
    const egg=document.querySelector('#hatchEgg');
    if(egg){
      const i=Math.max(0,eggs.indexOf(e));
      egg.classList.add('hatch-egg-lux');
      egg.innerHTML=luxuryEggHTML(e,i,'hatch');
    }
    return out;
  };

  // Native <option> elements cannot contain the CSS model, so keep them clean and text-only.
  function cleanAutoHatchLabels(){
    const select=document.querySelector('#v15AutoEgg');
    if(!select)return;
    [...select.options].forEach((opt,i)=>{
      if(eggs[i])opt.textContent=eggs[i].name;
    });
  }

  const oldRenderHub=window.renderHub;
  if(typeof oldRenderHub==='function'){
    window.renderHub=function(){
      const out=oldRenderHub.apply(this,arguments);
      cleanAutoHatchLabels();
      return out;
    };
  }

  decorateEggCards();
  cleanAutoHatchLabels();
})();