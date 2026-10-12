from pathlib import Path
import sys

h=Path(sys.argv[1] if len(sys.argv)>1 else 'public/index.html').read_text(encoding='utf-8')

required=[
    'Version 56: destructive redeem code clears every owned pet',
    "const V56_DELETE_CODE='brainrot114514mazide'",
    'state.pets=[]',
    'state.equipped=[]',
    "confirm('所持ペットをすべて削除します。Huge / Titanic / 装備中も含めて元に戻せません。実行しますか？')",
    'persist();',
    'renderAll();',
    "const CODE='6677'",
    '100Mコイン獲得！'
]
missing=[x for x in required if x not in h]
if missing:
    raise SystemExit('Version 56 pet-clear code validation failed; missing: '+', '.join(missing))

if h.count("brainrot114514mazide") != 1:
    raise SystemExit('Version 56 validation failed; destructive code must have exactly one implementation')

print('Version 56 destructive pet-clear redeem code validation: PASS')
