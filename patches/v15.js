/* Version 15: Mega progression systems */
(function(){
  const META_KEY='petCoinBreakerV15Meta';
  const now=()=>Date.now();
  const dayKey=(d=new Date())=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  const defaults={
    rebirths:0,breaks:0,hatches:0,bosses:0,breaksSinceBoss:0,
    daily:{last:'',streak:0},
    quests:{break:{base:0,level:1},hatch:{base:0,level:1},boss:{base:0,level:1}},
    boosts:{coinUntil:0,damageUntil:0,luckUntil:0,hugeUntil:0,titanicUntil:0},
    auto:{on:false,egg:0},
    boss:{active:false,ready:false,hp:0,maxHp:0},
    locked:{},
    achievements:{}
  };
  function loadMeta(){
    try{
      const s=JSON.parse(localStorage.getItem(META_KEY)||'null');
      return {...defaults,...s,daily:{...defaults.daily,...(s?.daily||{})},quests:{
        break:{...defaults.quests.break,...(s?.quests?.break||{})},
        hatch:{...defaults.quests.hatch,...(s?.quests?.hatch||{})},
        boss:{...defaults.quests.boss,...(s?.quests?.boss||{})}
      },boosts:{...defaults.boosts,...(s?.boosts||{})},auto:{...defaults.auto,...(s?.auto||{})},boss:{...defaults.boss,...(s?.boss||{})},locked:{...(s?.locked||{})},achievements:{...(s?.achievements||{})}};
    }catch(e){return JSON.parse(JSON.stringify(defaults))}
  }
  let meta=loadMeta();
  const saveMeta=()=>localStorage.setItem(META_KEY,JSON.stringify(meta));
  const active=k=>Number(meta.boosts[k+'Until']||0)>now();
  const remain=k=>Math.max(0,Math.ceil((Number(meta.boosts[k+'Until']||0)-now())/1000));
  function formatTime(s){if(s<=0)return 'OFF';const m=Math.floor(s/60),r=s%60;return m+':'+String(r).padStart(2,'0')}
  function zoneFactor(){return Math.max(1,1+(state.zone||0)*2+(meta.rebirths||0)*4)}
  function rebirthCost(){return Math.round(1e9*Math.pow(4,meta.rebirths||0))}
  function rebirthDamage(){return 1+(meta.rebirths||0)*.35}
  function rebirthCoin(){return 1+(meta.rebirths||0)*.25}

  if(zones.length<7){
    zones.push(
      {name:'天空エリア',target:'天空コア',hp:25000,reward:22000,unlock:1500000},
      {name:'宇宙エリア',target:'銀河金庫',hp:180000,reward:170000,unlock:20000000},
      {name:'深淵エリア',target:'アビスコア',hp:1200000,reward:1300000,unlock:250000000}
    );
  }
  if(petPools.length<7){
    petPools.push(
      [
        {name:'クラウドパピー',icon:'🐶',kind:'dog',rarity:'Common',power:180,w:48},
        {name:'スカイキャット',icon:'🐱',kind:'cat',rarity:'Common',power:220,w:34},
        {name:'エンジェルバニー',icon:'🐰',kind:'rabbit',rarity:'Uncommon',power:390,w:12},
        {name:'ウィンドフォックス',icon:'🦊',kind:'fox',rarity:'Rare',power:780,w:4.5},
        {name:'セレスティアルユニコーン',icon:'🦄',kind:'unicorn',rarity:'Epic',power:1800,w:1.3},
        {name:'ヘブンドラゴン',icon:'🐲',kind:'dragon',rarity:'Legendary',power:4600,w:.2}
      ],
      [
        {name:'スターウルフ',icon:'🐺',kind:'dog',rarity:'Common',power:720,w:48},
        {name:'コスモキャット',icon:'🐱',kind:'cat',rarity:'Common',power:880,w:34},
        {name:'ネビュラバニー',icon:'🐰',kind:'rabbit',rarity:'Uncommon',power:1550,w:12},
        {name:'ギャラクシーフォックス',icon:'🦊',kind:'fox',rarity:'Rare',power:3100,w:4.5},
        {name:'ノヴァユニコーン',icon:'🦄',kind:'unicorn',rarity:'Epic',power:7200,w:1.3},
        {name:'コズミックドラゴン',icon:'🐲',kind:'dragon',rarity:'Legendary',power:18500,w:.2}
      ],
      [
        {name:'アビスハウンド',icon:'🐕',kind:'dog',rarity:'Common',power:2900,w:48},
        {name:'ヴォイドキャット',icon:'🐱',kind:'cat',rarity:'Common',power:3500,w:34},
        {name:'シャドウバニー',icon:'🐰',kind:'rabbit',rarity:'Uncommon',power:6200,w:12},
        {name:'ナイトメアフォックス',icon:'🦊',kind:'fox',rarity:'Rare',power:12400,w:4.5},
        {name:'エクリプスユニコーン',icon:'🦄',kind:'unicorn',rarity:'Epic',power:29000,w:1.3},
        {name:'アビスドラゴン',icon:'🐲',kind:'dragon',rarity:'Legendary',power:76000,w:.2}
      ]
    );
  }
  if(eggs.length<7){
    eggs.push(
      {name:'天空の卵',icon:'☁️',cost:220000,zone:4,pool:4,bonus:1,hugeChance:.75,rates:{Common:38,Uncommon:25,Rare:18,Epic:11,Legendary:8}},
      {name:'宇宙の卵',icon:'🪐',cost:2800000,zone:5,pool:5,bonus:1,hugeChance:.9,rates:{Common:34,Uncommon:25,Rare:19,Epic:12,Legendary:10}},
      {name:'深淵の卵',icon:'🌑',cost:35000000,zone:6,pool:6,bonus:1,hugeChance:1.1,rates:{Common:30,Uncommon:25,Rare:20,Epic:14,Legendary:11}}
    );
  }

  const oldPetTheme=petTheme;
  petTheme=function(p){
    const n=(p?.baseName||p?.name||'');
    if(/クラウド|スカイ|エンジェル|ウィンド|セレスティアル|ヘブン/.test(n))return 'sky';
    if(/スター|コスモ|ネビュラ|ギャラクシー|ノヴァ|コズミック/.test(n))return 'space';
    if(/アビス|ヴォイド|シャドウ|ナイトメア|エクリプス/.test(n))return 'abyss';
    return oldPetTheme(p);
  };
  const oldEmblem=petEmblem;
  petEmblem=function(p){
    const n=(p?.baseName||p?.name||'');
    if(/天空|クラウド|スカイ|エンジェル|ウィンド|セレスティアル|ヘブン/.test(n))return '☁';
    if(/スター|コスモ|ネビュラ|ギャラクシー|ノヴァ|コズミック/.test(n))return '✦';
    if(/アビス|ヴォイド|シャドウ|ナイトメア|エクリプス/.test(n))return '◉';
    return oldEmblem(p);
  };

  const baseTeamPower=teamPower;
  teamPower=function(){
    return Math.round(baseTeamPower()*rebirthDamage()*(active('damage')?2:1));
  };

  const baseLuckMultiplier=luckMultiplier;
  luckMultiplier=function(){return baseLuckMultiplier()*(active('luck')?2:1)};
  const baseHugeLuckMultiplier=hugeLuckMultiplier;
  hugeLuckMultiplier=function(){return baseHugeLuckMultiplier()*(active('huge')?2:1)};

  weightedPet=function(e){
    const pool=petPools[e.pool]||petPools[0],rates=effectiveRates(e),rarity=pickRarity(rates),choices=pool.filter(p=>p.rarity===rarity),base=choices[Math.floor(Math.random()*choices.length)]||pool[0];
    const titanicChance=.1*(active('titanic')?2:1),isTitanic=Math.random()*100<titanicChance,isHuge=!isTitanic&&Math.random()*100<effectiveHugeChance(e),mutation=rollMutation(),mutMul=mutationMultiplier(mutation);
    const scale=.92+Math.random()*.17,rareMul=isTitanic?12:(isHuge?8:1),power=Math.round(base.power*scale*rareMul*mutMul);
    const prefixes=[mutation!=='Normal'?mutation:'',isTitanic?'Titanic':isHuge?'Huge':''].filter(Boolean).join(' ');
    return {...base,id:uid(),baseName:base.name,name:(prefixes?prefixes+' ':'')+base.name,power,isHuge,isTitanic,mutation,mutationMultiplier:mutMul,sourceEgg:e.name,displayRarity:isTitanic?'Titanic':isHuge?'Huge':base.rarity};
  };

  const baseBreakCoin=breakCoin;
  breakCoin=function(showFx=true){
    const before=state.coins;
    baseBreakCoin(showFx);
    const baseGain=Math.max(0,state.coins-before);
    const mult=rebirthCoin()*(active('coin')?2:1);
    const extra=Math.floor(baseGain*(mult-1));
    if(extra>0){state.coins+=extra;renderTop()}
    meta.breaks++;meta.breaksSinceBoss++;
    if(meta.breaksSinceBoss>=20&&!meta.boss.active){
      meta.boss.ready=true;
      bossStart();
    }
    saveMeta();renderHub();
  };

  const baseHatch=hatch;
  hatch=function(i){
    const before=state.pets.length;
    const r=baseHatch(i);
    const diff=Math.max(0,state.pets.length-before);
    if(diff){meta.hatches+=diff;saveMeta();renderHub()}
    return r;
  };

  function autoHatchTick(){
    if(!meta.auto.on||hatchSession)return;
    const i=Math.max(0,Math.min(eggs.length-1,Number(meta.auto.egg||0))),e=eggs[i],amount=Math.max(1,Math.min(5,state.hatchAmount||1)),cost=e.cost*amount;
    if(e.zone>state.zone){meta.auto.on=false;saveMeta();return toast('🔒 Auto Hatch: エリア未解放')}
    if(state.coins<cost){meta.auto.on=false;saveMeta();return toast('🪙 Auto Hatch停止: コイン不足')}
    state.coins-=cost;
    let rare=null;
    for(let n=0;n<amount;n++){const p=weightedPet(e);state.pets.push(p);if(p.isTitanic||p.isHuge)rare=p}
    meta.hatches+=amount;autoEquip();persist();saveMeta();renderAll();renderHub();
    if(rare)toast((rare.isTitanic?'🌌 TITANIC! ':'👑 HUGE! ')+rare.name);
  }
  setInterval(autoHatchTick,2400);

  function bossStart(){
    if(meta.boss.active)return;
    if(!meta.boss.ready)return toast('👑 ボス出現までコインをあと '+Math.max(0,20-meta.breaksSinceBoss)+'個破壊');
    const hp=Math.round(currentZone().hp*30*(1+(meta.rebirths||0)*.5));
    meta.boss={active:true,ready:true,hp,maxHp:hp};saveMeta();renderAll();renderHub();toast('👑 巨大宝箱ボス出現！');
  }
  function bossDamage(amount){
    if(!meta.boss.active)return;
    meta.boss.hp=Math.max(0,meta.boss.hp-amount);
    if(meta.boss.hp<=0){
      const base=Math.round(currentZone().reward*120);
      const reward=Math.round(base*rebirthCoin()*(active('coin')?2:1));
      state.coins+=reward;meta.bosses++;meta.breaksSinceBoss=0;meta.boss={active:false,ready:false,hp:0,maxHp:0};
      const keys=['coin','damage','luck','huge','titanic'],k=keys[Math.floor(Math.random()*keys.length)];
      meta.boosts[k+'Until']=Math.max(now(),meta.boosts[k+'Until']||0)+5*60*1000;
      if(window.v20BossDrop)window.v20BossDrop();
      persist();saveMeta();renderAll();renderHub();toast('🏆 ボス撃破 +'+fmt(reward)+' / '+k+' Boost 5分');
    }else{saveMeta();renderHub()}
  }
  window.v15BossDamage=bossDamage;
  window.v15BossAttack=()=>bossDamage(teamPower()*3+state.clickPower*12);
  window.v15ForceBoss=()=>{if(meta.boss.active)return;meta.boss.ready=true;bossStart()};
  setInterval(()=>{if(meta.boss.active&&!window.__bossArenaRouting)bossDamage(Math.max(1,teamPower()/2))},500);

  function qInfo(type){
    const q=meta.quests[type],level=q.level||1,cur=type==='break'?meta.breaks:type==='hatch'?meta.hatches:meta.bosses,target=(type==='break'?100:type==='hatch'?25:1)*level,prog=Math.max(0,cur-(q.base||0)),reward=Math.round((type==='break'?50000:type==='hatch'?100000:500000)*level*zoneFactor());
    return {q,cur,target,prog,reward};
  }
  window.v15ClaimQuest=function(type){
    const x=qInfo(type);if(x.prog<x.target)return toast('📜 まだ未達成');
    state.coins+=x.reward;x.q.base=x.cur;x.q.level=(x.q.level||1)+1;persist();saveMeta();renderAll();renderHub();toast('📜 クエスト報酬 +'+fmt(x.reward));
  };

  function dailyReward(){const seq=[25000,50000,100000,250000,500000,1000000,5000000],i=Math.max(0,Math.min(6,(meta.daily.streak||0)));return Math.round(seq[i]*zoneFactor())}
  window.v15Daily=function(){
    const today=dayKey();if(meta.daily.last===today)return toast('🎁 今日のデイリーは受取済み');
    const y=new Date();y.setDate(y.getDate()-1);
    meta.daily.streak=meta.daily.last===dayKey(y)?Math.min(6,(meta.daily.streak||0)+1):0;
    const reward=dailyReward();state.coins+=reward;meta.daily.last=today;
    if(meta.daily.streak===6){['coin','damage','luck'].forEach(k=>meta.boosts[k+'Until']=Math.max(now(),meta.boosts[k+'Until']||0)+10*60*1000)}
    persist();saveMeta();renderAll();renderHub();toast('🎁 Daily +'+fmt(reward));
  };

  window.v15Rebirth=function(){
    const cost=rebirthCost();if(state.coins<cost)return toast('♻️ '+fmt(cost)+' コイン必要');
    if(!confirm('転生します。コイン・エリア・通常強化はリセットされますが、ペット・Index・実績は残ります。'))return;
    meta.rebirths++;state.coins=0;state.zone=0;state.targetHp=zones[0].hp;state.clickPower=1;state.coinBonus=1;state.hatchAmount=1;state.luckLevel=0;state.hugeLuckLevel=0;state.maxEquip=3;autoEquip();
    persist();saveMeta();renderAll();renderHub();toast('♻️ Rebirth '+meta.rebirths+'！ 永続強化UP');
  };

  function nextMutation(m){return m==='Normal'?'Gold':m==='Gold'?'Diamond':m==='Diamond'?'Rainbow':null}
  window.v15Fuse=function(){
    const groups={};
    state.pets.forEach(p=>{if(meta.locked[p.id])return;const m=p.mutation||'Normal',next=nextMutation(m);if(!next)return;const key=[p.baseName||p.name,m,!!p.isHuge,!!p.isTitanic].join('|');(groups[key]||(groups[key]=[])).push(p)});
    const g=Object.values(groups).find(a=>a.length>=5);
    if(!g)return toast('🧬 合成できる同一ペットが5匹いません');
    const src=g.sort((a,b)=>b.power-a.power).slice(0,5),keep=src[0],old=keep.mutation||'Normal',next=nextMutation(old),oldMul=mutationMultiplier(old),newMul=mutationMultiplier(next),ids=new Set(src.map(p=>p.id));
    state.pets=state.pets.filter(p=>!ids.has(p.id));state.equipped=state.equipped.filter(id=>!ids.has(id));
    const baseName=keep.baseName||keep.name.replace(/^(Rainbow|Diamond|Gold) /,'').replace(/^(Titanic|Huge) /,'');
    const rare=keep.isTitanic?'Titanic':keep.isHuge?'Huge':'';
    const np={...keep,id:uid(),baseName,mutation:next,mutationMultiplier:newMul,power:Math.max(1,Math.round(keep.power*(newMul/oldMul))),name:[next,rare,baseName].filter(Boolean).join(' ')};
    state.pets.push(np);autoEquip();persist();renderAll();renderHub();toast('🧬 '+next+' に合成！');
  };

  window.v15ToggleLock=function(id){
    meta.locked[id]=!meta.locked[id];if(!meta.locked[id])delete meta.locked[id];saveMeta();renderPets();
  };
  const baseRenderPets=renderPets;
  renderPets=function(){
    baseRenderPets();
    const list=state.pets.slice().sort((a,b)=>b.power-a.power).slice(0,36),cards=[...document.querySelectorAll('#pets .pet-card')];
    cards.forEach((card,i)=>{const p=list[i];if(!p)return;card.classList.toggle('v15-pet-locked',!!meta.locked[p.id]);const b=document.createElement('button');b.className='v15-lock-btn';b.textContent=meta.locked[p.id]?'🔒':'🔓';b.title='合成ロック';b.onclick=e=>{e.stopPropagation();v15ToggleLock(p.id)};card.appendChild(b)});
  };

  window.v15ToggleAuto=function(){
    meta.auto.on=!meta.auto.on;meta.auto.egg=Number(document.querySelector('#v15AutoEgg')?.value||meta.auto.egg||0);saveMeta();renderHub();toast(meta.auto.on?'🥚 Auto Hatch ON':'⏹ Auto Hatch OFF');
  };
  window.v15SetAutoEgg=function(v){meta.auto.egg=Number(v||0);saveMeta()};

  window.v15BuyBoost=function(k){
    const costs={coin:2500000,damage:2500000,luck:5000000,huge:12000000,titanic:50000000},cost=costs[k]||1e9;
    if(state.coins<cost)return toast('🪙 '+fmt(cost)+' コイン必要');
    state.coins-=cost;meta.boosts[k+'Until']=Math.max(now(),meta.boosts[k+'Until']||0)+10*60*1000;persist();saveMeta();renderAll();renderHub();toast('⚡ '+k+' Boost 10分');
  };

  const achDefs=[
    ['break100','破壊の始まり','コインを100個破壊',()=>meta.breaks>=100,250000],
    ['hatch100','ブリーダー','卵を100個孵化',()=>meta.hatches>=100,500000],
    ['boss1','ボスハンター','巨大宝箱を1体撃破',()=>meta.bosses>=1,1000000],
    ['zone4','天空到達','天空エリアを解放',()=>state.zone>=4,2500000],
    ['rebirth1','転生者','1回転生',()=>meta.rebirths>=1,5000000],
    ['huge1','HUGE発見','Hugeを1匹獲得',()=>state.pets.some(p=>p.isHuge),5000000],
    ['titanic1','TITANIC発見','Titanicを1匹獲得',()=>state.pets.some(p=>p.isTitanic),25000000]
  ];
  window.v15ClaimAch=function(id){
    const a=achDefs.find(x=>x[0]===id);if(!a||!a[3]()||meta.achievements[id])return;
    meta.achievements[id]=true;state.coins+=a[4];persist();saveMeta();renderAll();renderHub();toast('🏆 実績報酬 +'+fmt(a[4]));
  };

  const baseRenderCoinVisual=renderCoinVisual;
  renderCoinVisual=function(){
    baseRenderCoinVisual();
    const coin=document.querySelector('#coinTarget');if(!coin)return;
    for(let i=0;i<7;i++)coin.classList.remove('zone-'+i);coin.classList.add('zone-'+state.zone);
    const accents=['#72e6ab','#ffbd62','#8adfff','#ff8c59','#9feaff','#9b82ff','#ff63cf'];
    document.documentElement.style.setProperty('--accent',accents[state.zone]||'#6fc4ff');
  };

  function renderProgress(){
    const cost=rebirthCost(),claimed=meta.daily.last===dayKey();
    document.querySelector('#v15-progress').innerHTML='<div class="v15-grid"><div class="v15-card"><h3>♻️ Rebirth</h3><div class="v15-big">'+meta.rebirths+'</div><div class="v15-small">永続ダメージ ×'+rebirthDamage().toFixed(2)+' / 永続コイン ×'+rebirthCoin().toFixed(2)+'</div><button class="v15-btn purple" onclick="v15Rebirth()" '+(state.coins<cost?'disabled':'')+'>転生する 🪙 '+fmt(cost)+'</button></div><div class="v15-card"><h3>🎁 Daily Reward</h3><div class="v15-big">'+(meta.daily.streak+1)+'/7</div><div class="v15-small">本日の報酬: '+fmt(dailyReward())+' coins'+(meta.daily.streak===6?' + 3種Boost 10分':'')+'</div><button class="v15-btn gold" onclick="v15Daily()" '+(claimed?'disabled':'')+'>'+(claimed?'受取済み':'受け取る')+'</button></div></div><div class="v15-card" style="margin-top:12px"><h3>🌍 新エリア追加</h3><div class="v15-small">☁️ 天空 → 🪐 宇宙 → 🌑 深淵。既存の「次のエリア」ボタンから順番に解放できます。各エリアに専用卵・専用ペットあり。</div></div>';
  }
  function renderBoss(){
    const b=meta.boss,pct=b.active?Math.max(0,b.hp/b.maxHp*100):0;
    document.querySelector('#v15-boss').innerHTML='<div class="v15-card"><h3>👑 巨大宝箱ボス</h3><div class="v15-small">通常ターゲットを20個壊すごとに出現。撃破で大量コイン + ランダムBoost 5分。</div>'+(b.active?'<div class="v15-big">'+fmt(b.hp)+' / '+fmt(b.maxHp)+'</div><div class="v15-bar"><i style="width:'+pct+'%"></i></div><button class="v15-btn red" onclick="v15BossAttack()">💥 強攻撃</button>':'<div class="v15-big">'+(b.ready?'READY!':meta.breaksSinceBoss+'/20')+'</div><button class="v15-btn gold" onclick="v15BossStart()" '+(!b.ready?'disabled':'')+'>👑 ボス戦開始</button>')+'</div>';
  }
  window.v15BossStart=bossStart;
  function renderQuests(){
    const labels={break:['💥 破壊','コインを壊す'],hatch:['🥚 孵化','卵を孵化する'],boss:['👑 討伐','ボスを倒す']};
    document.querySelector('#v15-quests').innerHTML='<div class="v15-card"><h3>📜 Repeat Quests</h3>'+['break','hatch','boss'].map(t=>{const x=qInfo(t),pct=Math.min(100,x.prog/x.target*100);return '<div class="v15-quest"><div><b>'+labels[t][0]+' Lv.'+x.q.level+'</b><div class="v15-small">'+labels[t][1]+' '+Math.min(x.prog,x.target)+' / '+x.target+'　報酬 '+fmt(x.reward)+'</div><div class="v15-bar"><i style="width:'+pct+'%"></i></div></div><button class="v15-btn green" style="width:110px;margin:0" onclick="v15ClaimQuest(\''+t+'\')" '+(x.prog<x.target?'disabled':'')+'>受取</button></div>'}).join('')+'</div>';
  }
  function renderHatch(){
    const opts=eggs.map((e,i)=>'<option value="'+i+'" '+(Number(meta.auto.egg)===i?'selected':'')+'>'+e.icon+' '+e.name+'</option>').join('');
    const fuseGroups={};state.pets.forEach(p=>{if(meta.locked[p.id])return;const m=p.mutation||'Normal';if(!nextMutation(m))return;const k=[p.baseName||p.name,m,!!p.isHuge,!!p.isTitanic].join('|');fuseGroups[k]=(fuseGroups[k]||0)+1});const canFuse=Object.values(fuseGroups).some(n=>n>=5);
    document.querySelector('#v15-hatch').innerHTML='<div class="v15-grid"><div class="v15-card"><h3>🥚 Auto Hatch</h3><select class="v15-select" id="v15AutoEgg" onchange="v15SetAutoEgg(this.value)">'+opts+'</select><div class="v15-small">現在の同時開封数で約2.4秒ごとに自動孵化。Huge/Titanicは通知します。</div><button class="v15-btn '+(meta.auto.on?'red':'green')+'" onclick="v15ToggleAuto()">'+(meta.auto.on?'⏹ STOP':'▶ AUTO START')+'</button></div><div class="v15-card"><h3>🧬 Pet Fusion</h3><div class="v15-small">同じペット5匹を自動合成: Normal → Gold → Diamond → Rainbow。🔒したペットは素材に使いません。</div><button class="v15-btn purple" onclick="v15Fuse()" '+(!canFuse?'disabled':'')+'>5匹を合成</button></div></div>';
  }
  function renderBoosts(){
    const data=[['coin','🪙 Coin ×2',2500000],['damage','⚔️ Damage ×2',2500000],['luck','🍀 Luck ×2',5000000],['huge','👑 Huge Luck ×2',12000000],['titanic','🌌 Titanic Luck ×2',50000000]];
    document.querySelector('#v15-boosts').innerHTML='<div class="v15-grid">'+data.map(x=>'<div class="v15-card"><h3>'+x[1]+'</h3><div class="v15-big">'+formatTime(remain(x[0]))+'</div><div class="v15-small">10分追加 / 🪙 '+fmt(x[2])+'</div><button class="v15-btn" onclick="v15BuyBoost(\''+x[0]+'\')">10分追加</button></div>').join('')+'</div>';
  }
  function renderAch(){
    document.querySelector('#v15-ach').innerHTML='<div class="v15-card"><h3>🏆 Achievements</h3>'+achDefs.map(a=>{const done=a[3](),claimed=!!meta.achievements[a[0]];return '<div class="v15-ach '+(!done?'v15-locked':'')+'"><div class="v15-row"><div><b>'+a[1]+'</b><div class="v15-small">'+a[2]+' / 報酬 '+fmt(a[4])+'</div></div><button class="v15-btn gold" style="max-width:110px;margin:0" onclick="v15ClaimAch(\''+a[0]+'\')" '+(!done||claimed?'disabled':'')+'>'+(claimed?'完了':'受取')+'</button></div></div>'}).join('')+'</div>';
  }
  function renderHub(){
    if(!document.querySelector('#v15Hub'))return;
    renderProgress();renderBoss();renderQuests();renderHatch();renderBoosts();renderAch();
  }
  window.renderHub=renderHub;

  const hub=document.querySelector('#v15Hub');
  document.querySelector('#v15HubBtn')?.addEventListener('click',()=>{hub.classList.add('open');renderHub()});
  document.querySelector('#v15Close')?.addEventListener('click',()=>hub.classList.remove('open'));
  hub?.addEventListener('click',e=>{if(e.target===hub)hub.classList.remove('open')});
  document.querySelectorAll('.v15-tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.v15-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.v15-section').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelector('#v15-'+b.dataset.v15)?.classList.add('active');renderHub()}));

  const baseRenderAll=renderAll;
  renderAll=function(){baseRenderAll();if(document.querySelector('#v15Hub')?.classList.contains('open'))renderHub()};
  setInterval(()=>{if(document.querySelector('#v15Hub')?.classList.contains('open'))renderHub()},1000);

  saveMeta();renderAll();renderHub();
})();