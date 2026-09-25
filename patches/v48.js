/* Version 48: unique face assignment for every named pet */
(function(){
  const FACE_BY_SKIN={
    grassdog:'happy',grasscat:'cheeky',cloverrabbit:'cute',forestfox:'mischief',flowerunicorn:'gentle',forestdragon:'proud',
    sandjackal:'stern',sphinxcat:'ancient',sandbunny:'shy',fennec:'mischief',sununicorn:'royal',sandstormdragon:'beast',
    snowwolf:'stern',icecat:'sleepy',snowbunny:'cute',frostfox:'gentle',crystalunicorn:'mystic',frostdragon:'proud',
    hellhound:'fierce',magmacat:'cheeky',emberbunny:'happy',flamefox:'mischief',infernounicorn:'royal',magmadragon:'beast',
    cloudpuppy:'happy',skycat:'proud',angelbunny:'gentle',windfox:'cheeky',celestialunicorn:'mystic',heavendragon:'royal',
    starwolf:'mystic',cosmocat:'sleepy',nebulabunny:'shy',galaxyfox:'cheeky',novaunicorn:'royal',cosmicdragon:'ancient',
    voidcat:'sleepy',shadowbunny:'shy',nightmarefox:'fierce',eclipseunicorn:'mystic',abysshound:'beast',abyssdragon:'ancient',
    bossdragon:'fierce'
  };

  function extras(){
    return '<i class="pet-brow l"></i><i class="pet-brow r"></i>'+
      '<i class="pet-blush l"></i><i class="pet-blush r"></i>'+
      '<i class="pet-mark"></i>';
  }

  const oldPetModelHTML=petModelHTML;
  petModelHTML=function(p,extra=''){
    let html=oldPetModelHTML(p,extra);
    const skin=(typeof petSkin==='function'?petSkin(p):'')||'';
    const face=FACE_BY_SKIN[skin]||'cute';
    html=html.replace('class="pet-body"','class="pet-body face-'+face+'"');
    html=html.replace(
      '<i class="pet-eye l"></i><i class="pet-eye r"></i>',
      '<i class="pet-eye l"></i><i class="pet-eye r"></i>'+extras()
    );
    html=html.replace(
      '<i class="pet-mouth"></i>',
      '<i class="pet-mouth"></i><i class="pet-fang l"></i><i class="pet-fang r"></i>'
    );
    return html;
  };

  window.v48FaceMap=FACE_BY_SKIN;
  if(typeof renderAll==='function')renderAll();
})();
/* Version 48 final deployment marker */
