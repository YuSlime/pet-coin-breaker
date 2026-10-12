/* Version 53: move selected-pet sell action beside clear selection */
(function(){
  function place(){
    const root=document.querySelector('#sell');
    if(!root)return;
    const actions=root.querySelector('.v52-sell-actions');
    const footer=root.querySelector('.v52-sell-footer-row');
    const sell=root.querySelector('button[onclick="v52SellSelected()"]');
    const clear=root.querySelector('button[onclick="v52ClearSellSelection()"]');
    if(!actions||!footer||!sell||!clear)return;
    actions.appendChild(sell);
    footer.appendChild(clear);
    sell.classList.add('v53-sell-top-button');
    clear.classList.add('v53-clear-bottom-button');
  }
  window.v53PlaceSellControls=place;
  const previous=window.renderSell;
  if(typeof previous==='function'){
    window.renderSell=function(){const result=previous.apply(this,arguments);place();return result};
  }
  const previousActive=window.renderActiveSection;
  if(typeof previousActive==='function'){
    window.renderActiveSection=function(){const result=previousActive.apply(this,arguments);place();return result};
  }
  place();
})();
