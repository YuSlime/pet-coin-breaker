/* Version 5: tougher coin targets */
(function(){
  const oldHp=[70,260,950,3600];
  const newHp=[110,400,1450,5400];
  zones.forEach((z,i)=>{ if(newHp[i]) z.hp=newHp[i]; });

  const zi=Math.max(0,Math.min(zones.length-1,state.zone||0));
  const oldMax=oldHp[zi]||zones[zi].hp;
  const newMax=zones[zi].hp;
  const current=Math.max(0,Number(state.targetHp||oldMax));
  const ratio=oldMax>0?Math.min(1,current/oldMax):1;
  state.targetHp=Math.max(1,Math.round(newMax*ratio));

  persist();
  renderAll();
})();