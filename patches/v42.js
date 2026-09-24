/* Version 42: sync admin area selectors with all live zones/eggs */
(function(){
  function cleanZoneName(name,index){
    const n=String(name||('エリア '+(index+1)));
    return n.replace(/エリア$/,'') || n;
  }

  function syncAdminAreas(){
    const zoneSelect=document.querySelector('#adminZone');
    if(zoneSelect && Array.isArray(zones)){
      const current=Math.max(0,Math.min(zones.length-1,Number(state?.zone||0)));
      zoneSelect.innerHTML=zones.map((z,i)=>
        '<option value="'+i+'">'+cleanZoneName(z?.name,i)+'</option>'
      ).join('');
      zoneSelect.value=String(current);
    }

    const petZoneSelect=document.querySelector('#adminPetZone');
    if(petZoneSelect && Array.isArray(eggs)){
      const previous=Math.max(0,Number(petZoneSelect.value||state?.zone||0));
      petZoneSelect.innerHTML=eggs.map((e,i)=>
        '<option value="'+i+'">'+String(e?.name||('エリア '+(i+1)+' の卵'))+'</option>'
      ).join('');
      petZoneSelect.value=String(Math.min(eggs.length-1,previous));
    }
  }

  const oldRefresh=window.adminRefresh;
  if(typeof oldRefresh==='function'){
    window.adminRefresh=function(){
      syncAdminAreas();
      return oldRefresh.apply(this,arguments);
    };
  }

  const oldToggle=window.toggleAdmin;
  if(typeof oldToggle==='function'){
    window.toggleAdmin=function(){
      syncAdminAreas();
      const out=oldToggle.apply(this,arguments);
      syncAdminAreas();
      return out;
    };
  }

  window.v42SyncAdminAreas=syncAdminAreas;
  syncAdminAreas();
})();