/* Version 16: Huge rarity chance nerf */
(function(){
  const hugeChances=[0.03,0.05,0.08,0.12,0.16,0.22,0.30];

  eggs.forEach((e,i)=>{
    if(i<hugeChances.length)e.hugeChance=hugeChances[i];
  });

  const prevEffectiveHugeChance=effectiveHugeChance;
  effectiveHugeChance=function(e){
    const raw=Math.max(0,Number(prevEffectiveHugeChance(e)||0));
    let legendary=Number(e?.rates?.Legendary||0);
    try{
      const rates=effectiveRates(e);
      if(rates&&Number.isFinite(Number(rates.Legendary)))legendary=Number(rates.Legendary);
    }catch(err){}
    const cap=Math.max(0,legendary*0.5);
    return Math.min(raw,cap);
  };

  renderAll();
  try{renderHub()}catch(e){}
})();