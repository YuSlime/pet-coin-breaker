/* Version 39: safe boss balance migration — never multiply current boss HP on reload */
(function(){
  const KEY='petCoinBreakerV15Meta';
  try{
    const meta=JSON.parse(localStorage.getItem(KEY)||'{}');
    if(meta?.boss?.active){
      meta.boss.v22Scaled=true;
      meta.boss.balanceVersion=Math.max(Number(meta.boss.balanceVersion||0),39);
      localStorage.setItem(KEY,JSON.stringify(meta));
    }
  }catch(e){}
})();