/* Version 49: unique silhouettes inspired by each pet/egg motif */
(function(){
  const oldPetModelHTML=petModelHTML;
  petModelHTML=function(p,extra=''){
    let html=oldPetModelHTML(p,extra);
    if(!html.includes('v49-shape-pack')){
      html=html.replace('class="pet-model ','class="pet-model v49-shape-pack ');
      html=html.replace(
        '<i class="pet-shadow"></i>',
        '<i class="pet-shadow"></i><i class="v49-tail"></i><i class="v49-tail-tip"></i><i class="v49-halo"></i><i class="v49-orbit o1"></i><i class="v49-orbit o2"></i>'
      );
      html=html.replace(
        '<i class="pet-horn"></i>',
        '<i class="pet-sidehorn l"></i><i class="pet-sidehorn r"></i><i class="pet-horn"></i>'
      );
      html=html.replace(
        '<i class="pet-gem"></i>',
        '<i class="v49-motif"></i><i class="pet-gem"></i>'
      );
    }
    return html;
  };
  window.v49ShapeMotif=true;
  if(typeof renderAll==='function')renderAll();
})();