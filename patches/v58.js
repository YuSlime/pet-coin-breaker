/* Version 58: reset upgrade values after the pet-clear redeem succeeds */
(function(){
  const status=document.querySelector('#redeemCodeStatus');
  if(!status)return;

  const resetUpgrades=()=>{
    const text=(status.textContent||'').trim();
    if(!text.includes('すべて削除しました'))return;

    state.maxEquip=3;
    state.clickPower=1;
    state.coinBonus=1;
    state.hatchAmount=1;
    state.luckLevel=0;
    state.hugeLuckLevel=0;
    persist();
    renderAll();
    status.textContent=text+' / アップグレード初期化完了';
  };

  new MutationObserver(resetUpgrades).observe(status,{childList:true,characterData:true,subtree:true});
})();