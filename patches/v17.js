/* Version 17: attack team dock */
(function(){
  renderPetsField=function(){
    const field=document.querySelector('#petsField');
    if(!field)return;
    field.innerHTML='';
    const equipped=state.pets.filter(p=>state.equipped.includes(p.id)).slice(0,6);
    equipped.forEach(p=>{
      const orb=document.createElement('div');
      orb.className='pet-orb';
      orb.style.setProperty('--orbGlow',mutationColor(p));
      orb.innerHTML=petModelHTML(p);
      orb.title=p.name+' '+p.power+'/秒';
      field.appendChild(orb);
    });
  };
  renderPetsField();
})();