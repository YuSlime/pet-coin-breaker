/* Version 11: ensure Titanic class is present on every pet render */
(function(){
  const prevPetModelHTML=petModelHTML;
  petModelHTML=function(p,extra=''){
    let html=prevPetModelHTML(p,extra);
    if(p?.isTitanic){
      html=html.replace('class="pet-model ', 'class="pet-model titanic ');
      html=html.replace(/rarity-[A-Za-z]+/, 'rarity-Titanic');
    }
    return html;
  };

  const prevRenderPets=renderPets;
  renderPets=function(){
    prevRenderPets();
    document.querySelectorAll('.pet-card').forEach(card=>{
      const name=card.querySelector('.pet-name')?.textContent||'';
      if(name.includes('Titanic ')){
        card.classList.add('titanic-card');
      }
    });
  };

  renderAll();
})();