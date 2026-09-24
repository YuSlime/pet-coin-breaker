/* Version 12: hidden admin access */
(function(){
  const panel=document.querySelector('#adminPanel');
  const toggle=document.querySelector('#adminToggle');
  if(toggle) toggle.style.display='none';
  if(panel){
    panel.style.display='none';
    panel.classList.remove('open','show');
  }

  window.toggleAdmin=function(force){
    if(!panel)return;
    const shouldOpen=typeof force==='boolean'?force:!panel.classList.contains('admin-secret-open');
    panel.classList.toggle('admin-secret-open',shouldOpen);
    panel.style.display=shouldOpen?'block':'none';
    try{adminRefresh()}catch(e){}
  };

  document.addEventListener('keydown',function(e){
    if(e.key==='F2'){
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  },true);

  let seq=[];
  const secret=['a','d','m','i','n'];
  document.addEventListener('keydown',function(e){
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    const k=(e.key||'').toLowerCase();
    if(k.length!==1)return;
    seq.push(k);
    if(seq.length>secret.length)seq.shift();
    if(seq.join('')===secret.join('')){
      toggleAdmin();
      seq=[];
    }
  });
})();