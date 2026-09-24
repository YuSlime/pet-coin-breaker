/* Version 40: soft round "poko" break sound */
(function(){
  const previousAudio=audio;

  function pokoBreak(){
    if(!state.sound)return;
    // Rounded wooden / bubble-like "poko": short downward sine body + tiny soft transient.
    tone(360,.075,'sine',.085,0,155);
    tone(175,.095,'sine',.052,.008,105);
    tone(520,.035,'sine',.022,0,330);
    noise(.022,.006,0);
  }

  audio=function(type='hit'){
    if(type==='break'){
      pokoBreak();
      return;
    }
    return previousAudio(type);
  };
})();