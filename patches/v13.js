/* Version 13: mobile secret admin — tap title 5 times quickly */
(function(){
  const logo=document.querySelector('.logo');
  if(!logo)return;

  let taps=[];
  const TAP_COUNT=5;
  const WINDOW_MS=2200;

  function secretTap(e){
    const now=Date.now();
    taps=taps.filter(t=>now-t<WINDOW_MS);
    taps.push(now);

    if(taps.length>=TAP_COUNT){
      taps=[];
      try{
        toggleAdmin();
        if(navigator.vibrate) navigator.vibrate([40,30,40]);
      }catch(err){}
      e.preventDefault();
      e.stopPropagation();
    }
  }

  logo.addEventListener('click',secretTap,true);
})();