from pathlib import Path
import sys

h=Path(sys.argv[1] if len(sys.argv)>1 else 'public/index.html').read_text(encoding='utf-8')

required=[
    'Version 56: destructive redeem code clears every owned pet',
    "const V56_DELETE_CODE='brainrot114514mazide'",
    "confirm('所持ペットをすべて削除します。Huge / Titanic / 装備中も含めて元に戻せません。実行しますか？')",
    'Version 58: guarded upgrade reset after pet-clear success',
    "if(!text.includes('すべて削除しました'))return;",
    "if(text.includes('アップグレード初期化完了'))return;",
    'state.maxEquip=3;',
    'state.clickPower=1;',
    'state.coinBonus=1;',
    'state.hatchAmount=1;',
    'state.luckLevel=0;',
    'state.hugeLuckLevel=0;',
    'new MutationObserver(resetUpgrades).observe(status,{childList:true,characterData:true,subtree:true});',
    'persist();',
    'renderAll();',
    "const CODE='6677'",
    '100Mコイン獲得！'
]
missing=[x for x in required if x not in h]
if missing:
    raise SystemExit('Version 58 pet-clear + upgrade-reset validation failed; missing: '+', '.join(missing))

if h.count("brainrot114514mazide") != 1:
    raise SystemExit('Version 58 validation failed; destructive code must have exactly one implementation')

print('Version 58 pet-clear + guarded upgrade-reset validation: PASS')
