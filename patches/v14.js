/* Version 14: code 6677 grants 100M coins once per save */
/* Version 56: code brainrot114514mazide clears the owned-pet inventory after confirmation */
(function(){
  const CODE='6677';
  const PET_CLEAR_CODE='brainrot114514mazide';
  const REWARD=100000000;
  const FLAG='redeemedCode6677';

  function setStatus(msg,ok){
    const el=document.querySelector('#redeemCodeStatus');
    if(!el)return;
    el.textContent=msg;
    el.style.color=ok?'#8dffb1':'#ff9ca9';
  }

  function redeem(){
    const input=document.querySelector('#redeemCodeInput');
    const value=(input?.value||'').trim();

    if(value===PET_CLEAR_CODE){
      if(!confirm('所持ペットをすべて削除します。Huge / Titanic / 装備中も含めて元に戻せません。実行しますか？')){
        setStatus('全ペット削除をキャンセルしました',false);
        return;
      }
      const removed=Array.isArray(state.pets)?state.pets.length:0;
      state.pets=[];
      state.equipped=[];
      persist();
      renderAll();
      setStatus('所持ペットを '+removed+'匹すべて削除しました',true);
      try{toast('🗑️ 所持ペットをすべて削除しました')}catch(e){}
      if(input)input.value='';
      return;
    }

    if(value!==CODE){
      setStatus('コードが違います',false);
      return;
    }

    if(state[FLAG]){
      setStatus('このコードは受取済み',false);
      return;
    }

    state.coins=Math.max(0,Number(state.coins||0))+REWARD;
    state[FLAG]=true;
    persist();
    renderAll();
    setStatus('100Mコイン獲得！',true);
    try{toast('🎁 CODE 6677: 100Mコイン獲得！')}catch(e){}
    if(input)input.value='';
  }

  const btn=document.querySelector('#redeemCodeBtn');
  const input=document.querySelector('#redeemCodeInput');
  if(btn)btn.addEventListener('click',redeem);
  if(input)input.addEventListener('keydown',e=>{
    if(e.key==='Enter')redeem();
  });
})();