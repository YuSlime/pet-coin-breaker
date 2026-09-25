/* Version 47: wire luxury coin icons into target, currency labels and coin rain */
(function(){
  function coinFaceHTML(){
    return '<span class="v47-coin-face" aria-hidden="true">'+
      '<i class="v47-coin-crown"></i>'+
      '<i class="v47-coin-gem"></i>'+
      '<i class="v47-coin-rivet r1"></i>'+
      '<i class="v47-coin-rivet r2"></i>'+
      '<i class="v47-coin-rivet r3"></i>'+
    '</span>';
  }

  function installCoinTarget(){
    const coin=document.querySelector('#coinTarget');
    if(!coin)return;
    coin.classList.add('v47-lux-coin');
    if(!coin.querySelector(':scope > .v47-coin-face')){
      coin.insertAdjacentHTML('afterbegin',coinFaceHTML());
    }
  }

  function inlineCoin(){
    const s=document.createElement('span');
    s.className='v47-inline-coin';
    s.setAttribute('aria-hidden','true');
    return s;
  }

  function replaceCoinEmoji(root=document.body){
    if(!root)return;
    const selectors='.price,.v15-small,.admin-label,.admin-btn,.btn,.toast';
    const els=[];
    if(root.matches?.(selectors))els.push(root);
    root.querySelectorAll?.(selectors).forEach(el=>els.push(el));
    for(const el of els){
      if(el.querySelector?.('.gicon-coin,.v47-inline-coin'))continue;
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
      const nodes=[];
      while(walker.nextNode())nodes.push(walker.currentNode);
      for(const node of nodes){
        const text=node.nodeValue||'';
        const idx=text.indexOf('🪙');
        if(idx<0)continue;
        const frag=document.createDocumentFragment();
        if(idx)frag.appendChild(document.createTextNode(text.slice(0,idx)));
        frag.appendChild(inlineCoin());
        const after=text.slice(idx+'🪙'.length);
        if(after)frag.appendChild(document.createTextNode(after));
        node.parentNode?.replaceChild(frag,node);
        break;
      }
    }
  }

  const previousRenderCoinVisual=window.renderCoinVisual;
  if(typeof previousRenderCoinVisual==='function'){
    window.renderCoinVisual=function(){
      const out=previousRenderCoinVisual.apply(this,arguments);
      installCoinTarget();
      return out;
    };
  }

  const previousRenderAll=window.renderAll;
  if(typeof previousRenderAll==='function'){
    window.renderAll=function(){
      const out=previousRenderAll.apply(this,arguments);
      queueMicrotask(()=>{installCoinTarget();replaceCoinEmoji();});
      return out;
    };
  }

  const previousCoinRain=window.coinRain;
  if(typeof previousCoinRain==='function'){
    window.coinRain=function(x,y,count=8){
      const layer=document.querySelector('#impactLayer');
      if(!layer)return previousCoinRain.apply(this,arguments);
      for(let i=0;i<count;i++){
        const c=document.createElement('i');
        const isCoin=Math.random()<.78;
        c.className='impact-coin'+(isCoin?' v47-coin-pop':'');
        if(isCoin)c.innerHTML='<span class="v47-mini-coin"></span>';
        else c.textContent='✨';
        c.style.left=x+'px';
        c.style.top=y+'px';
        c.style.setProperty('--dx',(Math.random()*160-80)+'px');
        c.style.setProperty('--dy',(-40-Math.random()*110)+'px');
        c.style.setProperty('--rot',(Math.random()*480-240)+'deg');
        layer.appendChild(c);
        setTimeout(()=>c.remove(),900);
      }
    };
  }

  const obs=new MutationObserver(records=>{
    for(const rec of records){
      rec.addedNodes.forEach(n=>{
        if(n.nodeType===1)replaceCoinEmoji(n);
      });
    }
  });
  if(document.body)obs.observe(document.body,{childList:true,subtree:true});

  installCoinTarget();
  replaceCoinEmoji();
})();