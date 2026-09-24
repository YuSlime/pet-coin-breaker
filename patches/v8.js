/* Version 8: Volcano Legendary nerf */
(function(){
  const OLD_BASE=1540;
  const NEW_BASE=1200;
  const volcanoPool=petPools?.[3];
  if(volcanoPool){
    const legendary=volcanoPool.find(p=>p.rarity==='Legendary');
    if(legendary) legendary.power=NEW_BASE;
  }

  if(!state.balanceV8VolcanoLegendaryNerf){
    const factor=NEW_BASE/OLD_BASE;
    state.pets.forEach(p=>{
      const n=(p?.baseName||p?.name||'');
      if(/マグマドラゴン|ボルケーノドラゴン/.test(n)){
        p.power=Math.max(1,Math.round(Number(p.power||1)*factor));
      }
    });
    state.balanceV8VolcanoLegendaryNerf=true;
    persist();
  }

  renderAll();
})();