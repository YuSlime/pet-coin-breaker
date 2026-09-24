/* Version 39: decorate multi-hatch cards by their actual rarity */
(function(){
  function classify(){
    document.querySelectorAll('.multi-hatch-item').forEach(card=>{
      card.classList.remove('v39-rarity-Common','v39-rarity-Uncommon','v39-rarity-Rare','v39-rarity-Epic','v39-rarity-Legendary');
      const text=(card.querySelector('.mini-rarity')?.textContent||'').toUpperCase();
      if(card.classList.contains('titanic-result')||card.classList.contains('huge-result'))return;
      const rarity=['Legendary','Epic','Rare','Uncommon','Common'].find(r=>text.includes(r.toUpperCase()));
      if(rarity)card.classList.add('v39-rarity-'+rarity);
    });
  }

  const target=document.querySelector('#hatchResult')||document.body;
  const observer=new MutationObserver(()=>classify());
  observer.observe(target,{childList:true,subtree:true,characterData:true});
  classify();
})();