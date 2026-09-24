/* Version 35: unique name-inspired pet skins */
(function(){
  const previousSkin=petSkin;
  const previousEmblem=petEmblem;
  const uniqueSkins={
    'クラウドパピー':'cloudpuppy',
    'スカイキャット':'skycat',
    'エンジェルバニー':'angelbunny',
    'ウィンドフォックス':'windfox',
    'セレスティアルユニコーン':'celestialunicorn',
    'ヘブンドラゴン':'heavendragon',
    'スターウルフ':'starwolf',
    'コスモキャット':'cosmocat',
    'ネビュラバニー':'nebulabunny',
    'ギャラクシーフォックス':'galaxyfox',
    'ノヴァユニコーン':'novaunicorn',
    'コズミックドラゴン':'cosmicdragon',
    'アビスハウンド':'abysshound',
    'ヴォイドキャット':'voidcat',
    'シャドウバニー':'shadowbunny',
    'ナイトメアフォックス':'nightmarefox',
    'エクリプスユニコーン':'eclipseunicorn',
    'アビスドラゴン':'abyssdragon',
    'Boss Dragon':'bossdragon',
    'Huge Boss Dragon':'bossdragon'
  };
  const uniqueEmblems={
    cloudpuppy:'☁',
    skycat:'✈',
    angelbunny:'♢',
    windfox:'≋',
    celestialunicorn:'✧',
    heavendragon:'♛',
    starwolf:'★',
    cosmocat:'☄',
    nebulabunny:'✺',
    galaxyfox:'✦',
    novaunicorn:'✹',
    cosmicdragon:'✷',
    abysshound:'⛓',
    voidcat:'◌',
    shadowbunny:'◐',
    nightmarefox:'☾',
    eclipseunicorn:'◒',
    abyssdragon:'◆',
    bossdragon:'👑'
  };
  function cleanName(p){
    return String(p?.baseName||p?.name||'')
      .replace(/^(Rainbow|Diamond|Gold)\s+/,'')
      .replace(/^(Titanic|Huge)\s+/,'');
  }
  petSkin=function(p){
    const n=cleanName(p);
    return uniqueSkins[n]||previousSkin(p);
  };
  petEmblem=function(p){
    const skin=petSkin(p);
    return uniqueEmblems[skin]||previousEmblem(p);
  };
  renderAll();
})();