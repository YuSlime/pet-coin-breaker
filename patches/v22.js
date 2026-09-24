/* Version 22: boss balance migration */
(function(){
  const KEY='petCoinBreakerV15Meta';
  try{
    const meta=JSON.parse(localStorage.getItem(KEY)||'{}');
    if(meta?.boss?.active && !meta.boss.v22Scaled){
      meta.boss.hp=Math.round(Number(meta.boss.hp||0)*3);
      meta.boss.maxHp=Math.round(Number(meta.boss.maxHp||0)*3);
      meta.boss.v22Scaled=true;
      localStorage.setItem(KEY,JSON.stringify(meta));
      try{renderAll();renderHub()}catch(e){}
      try{toast('👑 Boss Chest強化: HP ×3 / 強攻撃弱体化')}catch(e){}
    }
  }catch(e){}
})();