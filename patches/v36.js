/* Version 36: replace emoji UI icons with custom CSS game icons */
(function(){
  const tokenMap=[
    ['🪙','coin'],['⚔️','sword'],['⚔','sword'],['🔊','sound'],['🔇','sound'],['💾','save'],
    ['💥','smash'],['🔒','zone'],['🥚','egg'],['🐾','paw'],['📊','upgrade'],['📖','index'],
    ['⚡','boost'],['♻️','rebirth'],['♻','rebirth'],['👑','boss'],['📜','quest'],['🏆','achievement'],
    ['🎁','gift'],['🍀','luck'],['🌌','titanic'],['🛠️','admin'],['🛠','admin'],['⚙️','admin'],['⚙','admin'],
    ['🌍','zone'],['✕','close']
  ];

  function makeIcon(type){
    const s=document.createElement('span');
    s.className='gicon gicon-'+type;
    s.setAttribute('aria-hidden','true');
    return s;
  }

  function replaceTokenInTextNode(node){
    const text=node.nodeValue;
    if(!text)return;
    let hit=null;
    for(const pair of tokenMap){
      const idx=text.indexOf(pair[0]);
      if(idx>=0 && (!hit || idx<hit.idx)){ hit={token:pair[0],type:pair[1],idx}; }
    }
    if(!hit)return;
    const frag=document.createDocumentFragment();
    const before=text.slice(0,hit.idx),after=text.slice(hit.idx+hit.token.length);
    if(before)frag.appendChild(document.createTextNode(before));
    frag.appendChild(makeIcon(hit.type));
    if(after)frag.appendChild(document.createTextNode(after));
    node.parentNode.replaceChild(frag,node);
  }

  function iconifyTree(root){
    if(!root||root.nodeType!==1)return;
    const selectors=[
      '.logo','.pill','.btn','.tab','.v15-hub-btn','.v15-head b','.v15-tab','.v15-card h3',
      '.v15-btn','.admin-title','.admin-label','.admin-btn','.hatch-power','.v20-exclusive-title',
      '.redeem-code-title','.redeem-code-btn'
    ];
    const targets=[];
    if(root.matches?.(selectors.join(',')))targets.push(root);
    root.querySelectorAll?.(selectors.join(',')).forEach(el=>targets.push(el));

    for(const el of targets){
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
      const nodes=[];
      while(walker.nextNode())nodes.push(walker.currentNode);
      for(const n of nodes){
        let guard=0;
        while(guard++<8){
          const before=n.parentNode;
          if(!before)break;
          const has=[...tokenMap].some(([t])=>n.nodeValue?.includes(t));
          if(!has)break;
          replaceTokenInTextNode(n);
          break;
        }
      }
    }

    // Explicit icons for UI controls that may have had their text rebuilt without emoji.
    const ensure=(selector,type)=>{
      document.querySelectorAll(selector).forEach(el=>{
        if(!el.querySelector(':scope > .gicon'))el.prepend(makeIcon(type));
      });
    };
    ensure('.logo','paw');
    ensure('.wallet .pill:first-child','coin');
    ensure('.wallet .pill:nth-child(2)','sword');
    ensure('#soundBtn','sound');
    ensure('#saveBtn','save');
    ensure('#smashBtn','smash');
    ensure('#nextZoneBtn','zone');
    ensure('.tab[data-tab="eggs"]','egg');
    ensure('.tab[data-tab="pets"]','pet');
    ensure('.tab[data-tab="stats"]','upgrade');
    ensure('.tab[data-tab="index"]','index');
    ensure('#v15HubBtn','hub');
    ensure('.v15-head b','hub');
    ensure('.v15-tab[data-v15="progress"]','rebirth');
    ensure('.v15-tab[data-v15="boss"]','boss');
    ensure('.v15-tab[data-v15="quests"]','quest');
    ensure('.v15-tab[data-v15="hatch"]','egg');
    ensure('.v15-tab[data-v15="boosts"]','boost');
    ensure('.v15-tab[data-v15="ach"]','achievement');
  }

  function semanticPass(){
    const titleRules=[
      [/Rebirth|転生/i,'rebirth'],
      [/Daily Reward|デイリー/i,'gift'],
      [/巨大宝箱|Boss Chest|ボス/i,'boss'],
      [/Auto Hatch|自動孵化/i,'auto'],
      [/Coin ×2|Coin/i,'coin'],
      [/Damage ×2|Damage/i,'sword'],
      [/Luck ×2|Luck/i,'luck'],
      [/Huge Luck|HUGE/i,'huge'],
      [/Titanic Luck|TITANIC/i,'titanic'],
      [/Achievements|実績/i,'achievement']
    ];
    document.querySelectorAll('.v15-card h3').forEach(el=>{
      if(el.querySelector(':scope > .gicon'))return;
      const txt=el.textContent.trim();
      const rule=titleRules.find(([re])=>re.test(txt));
      if(rule)el.prepend(makeIcon(rule[1]));
    });

    document.querySelectorAll('.v15-btn,.btn').forEach(el=>{
      if(el.querySelector(':scope > .gicon'))return;
      const t=el.textContent.trim();
      let type=null;
      if(/ボスチェスト開始|Boss Chest/i.test(t))type='boss';
      else if(/AUTO START|STOP|Auto Hatch/i.test(t))type='auto';
      else if(/受け取|受取|報酬/i.test(t))type='gift';
      else if(/転生/i.test(t))type='rebirth';
      else if(/次のエリア|エリア/i.test(t))type='zone';
      else if(/保存/i.test(t))type='save';
      if(type)el.prepend(makeIcon(type));
    });
  }

  function run(root=document.body){
    iconifyTree(root);
    semanticPass();
  }

  const obs=new MutationObserver(records=>{
    for(const r of records){
      r.addedNodes.forEach(n=>{if(n.nodeType===1)run(n)});
    }
    semanticPass();
  });
  if(document.body)obs.observe(document.body,{childList:true,subtree:true});
  run();

  // Re-run after renderers that rebuild innerHTML.
  const oldRenderAll=window.renderAll;
  if(typeof oldRenderAll==='function'){
    window.renderAll=function(){
      const out=oldRenderAll.apply(this,arguments);
      queueMicrotask(()=>run());
      return out;
    };
  }
  const oldRenderHub=window.renderHub;
  if(typeof oldRenderHub==='function'){
    window.renderHub=function(){
      const out=oldRenderHub.apply(this,arguments);
      queueMicrotask(()=>run());
      return out;
    };
  }
})();