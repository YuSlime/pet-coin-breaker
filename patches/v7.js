/* Version 7: Huge power nerf from x12 to x8 */
(function(){
  const HUGE_MULT=8;

  weightedPet=function(e){
    const pool=petPools[e.pool]||petPools[0];
    const rates=effectiveRates(e);
    const rarity=pickRarity(rates);
    const choices=pool.filter(p=>p.rarity===rarity);
    const base=choices[Math.floor(Math.random()*choices.length)]||pool[0];
    const isHuge=Math.random()*100<effectiveHugeChance(e);
    const mutation=rollMutation();
    const mutMul=mutationMultiplier(mutation);
    const power=Math.round(base.power*(isHuge?HUGE_MULT:1)*mutMul);
    const prefixes=[mutation!=='Normal'?mutation:'',isHuge?'Huge':''].filter(Boolean).join(' ');
    return {...base,id:uid(),baseName:base.name,name:`${prefixes?prefixes+' ':''}${base.name}`,power,isHuge,mutation,mutationMultiplier:mutMul,sourceEgg:e.name,displayRarity:isHuge?'Huge':base.rarity};
  };

  adminBuildPet=function(zone,rarity,mutation,isHuge){
    const egg=eggs[Math.max(0,Math.min(eggs.length-1,Number(zone||0)))];
    const pool=petPools[egg.pool]||petPools[0];
    const choices=pool.filter(p=>p.rarity===rarity);
    const base=choices[choices.length-1]||pool[pool.length-1];
    const mut=mutation||'Normal';
    const mul=mutationMultiplier(mut);
    const power=Math.round(base.power*(isHuge?HUGE_MULT:1)*mul);
    const prefixes=[mut!=='Normal'?mut:'',isHuge?'Huge':''].filter(Boolean).join(' ');
    return {...base,id:uid(),baseName:base.name,name:`${prefixes?prefixes+' ':''}${base.name}`,power,isHuge:!!isHuge,mutation:mut,mutationMultiplier:mul,sourceEgg:`ADMIN: ${egg.name}`,displayRarity:isHuge?'Huge':base.rarity};
  };

  if(!state.balanceV7HugeNerf){
    state.pets.forEach(p=>{
      if(p?.isHuge){
        p.power=Math.max(1,Math.round(Number(p.power||1)*(HUGE_MULT/12)));
      }
    });
    state.balanceV7HugeNerf=true;
    persist();
  }

  renderAll();
})();