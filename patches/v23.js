/* Version 27: Boss Chest challenge button removed */
(function(){
  const btn=document.querySelector('#v23BossChallenge');
  if(btn)btn.remove();
  window.v23SyncBossChallenge=function(){};
})();