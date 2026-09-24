function adminRefresh(){const el=$('#adminState');if(!el)return;const huge=state.pets.filter(p=>p.isHuge).length;el.textContent='Coins '+fmt(state.coins)+' / Zone '+(state.zone+1)+'/'+zones.length+' / Pets '+state.pets.length+' / Huge '+huge+' / Luck '+(state.luckLevel||0)+' / Huge Luck '+(state.hugeLuckLevel||0);const z=$('#adminZone');if(z)z.value=String(state.zone)}
function adminRender(){persist();renderAll();adminRefresh()}
function adminCoins(n){state.coins=Math.max(0,Number(state.coins||0)+Number(n||0));adminRender();toast('🛠 +'+fmt(n)+' coins')}
function adminSetCoins(n){state.coins=Math.max(0,Number(n||0));adminRender();toast('🛠 Coins changed')}
function adminSetZone(){const z=Math.max(0,Math.min(zones.length-1,Number($('#adminZone')?.value||0)));state.zone=z;state.targetHp=currentZone().hp;adminRender();toast('🛠 '+currentZone().name+'へ移動')}
function adminFullHp(){state.targetHp=currentZone().hp;adminRender();toast('🛠 HP全回復')}
function adminBreakTarget(){state.targetHp=1;attack(1,false);persist();renderAll();adminRefresh();toast('🛠 ターゲット破壊')}
function adminLuck(l,h){state.luckLevel=Math.max(0,Math.min(10,Number(l||0)));state.hugeLuckLevel=Math.max(0,Math.min(10,Number(h||0)));adminRender();toast('🛠 Luck '+state.luckLevel+' / Huge '+state.hugeLuckLevel)}
function adminHatchAmount(n){state.hatchAmount=Math.max(1,Math.min(5,Number(n||1)));adminRender();toast('🛠 '+state.hatchAmount+'連開封')}
function adminBuildPet(zone,rarity,mutation,isHuge){const egg=eggs[Math.max(0,Math.min(eggs.length-1,Number(zone||0)))],pool=petPools[egg.pool]||petPools[0],choices=pool.filter(p=>p.rarity===rarity),base=choices[choices.length-1]||pool[pool.length-1],mut=mutation||'Normal',mul=mutationMultiplier(mut),power=Math.round(base.power*(isHuge?12:1)*mul),prefixes=[mut!=='Normal'?mut:'',isHuge?'Huge':''].filter(Boolean).join(' ');return {...base,id:uid(),baseName:base.name,name:(prefixes?prefixes+' ':'')+base.name,power,isHuge:!!isHuge,mutation:mut,mutationMultiplier:mul,sourceEgg:'ADMIN: '+egg.name}}
function adminAddPet(){const z=Number($('#adminPetZone')?.value||0),r=$('#adminRarity')?.value||'Legendary',m=$('#adminMutation')?.value||'Normal',h=!!$('#adminHuge')?.checked,p=adminBuildPet(z,r,m,h);state.pets.push(p);autoEquip();adminRender();toast('🛠 '+p.name+' を追加')}
function adminQuickHuge(){const p=adminBuildPet(state.zone,'Legendary','Rainbow',true);state.pets.push(p);autoEquip();adminRender();toast('👑 '+p.name+' を追加')}
function adminEquipBest(){autoEquip();adminRender();toast('🛠 最強ペットを装備')}
function adminEquipSlots(n){state.maxEquip=Math.max(1,Math.min(6,Number(n||3)));autoEquip();adminRender();toast('🛠 装備枠 '+state.maxEquip)}
function adminClickPower(n){state.clickPower=Math.max(1,Number(n||1));adminRender();toast('🛠 Tap '+fmt(state.clickPower))}
function adminCoinBonus(n){state.coinBonus=Math.max(1,Number(n||1));adminRender();toast('🛠 Coin ×'+state.coinBonus)}
function adminSave(){persist();adminRefresh();toast('🛠 セーブ完了')}
function adminReload(){load();renderAll();adminRefresh();toast('🛠 セーブを再読込')}
function adminResetGame(){if(!confirm('ゲームのセーブデータを完全に初期化します。よろしいですか？'))return;localStorage.removeItem('petCoinBreakerSave');location.reload()}
function toggleAdmin(force){const p=$('#adminPanel');if(!p)return;const open=typeof force==='boolean'?force:!p.classList.contains('open');p.classList.toggle('open',open);if(open)adminRefresh()}
const __renderAllV2=renderAll;renderAll=function(){__renderAllV2();if($('#adminPanel')?.classList.contains('open'))adminRefresh()}
$('#adminToggle')?.addEventListener('click',()=>toggleAdmin());$('#adminClose')?.addEventListener('click',()=>toggleAdmin(false));window.addEventListener('keydown',e=>{if(e.key==='F2'){e.preventDefault();toggleAdmin()}});