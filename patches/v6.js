/* Version 6: Rainbow balance nerf */
(function(){
  mutationMultiplier=function(m){
    return {Normal:1,Gold:2,Diamond:5,Rainbow:7}[m]||1;
  };

  if(!state.balanceV6RainbowNerf){
    state.pets.forEach(p=>{
      if(p?.mutation==='Rainbow'){
        p.power=Math.max(1,Math.round(Number(p.power||1)*0.7));
        p.mutationMultiplier=7;
      }
    });
    state.balanceV6RainbowNerf=true;
    persist();
  }

  renderAll();
})();