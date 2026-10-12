from pathlib import Path
import runpy
import sys

h=Path(sys.argv[1] if len(sys.argv)>1 else 'public/index.html').read_text(encoding='utf-8')

forbidden=[
    'onclick="buyEquip()"',
    '装備枠 +1　🪙 ${ec}',
    'function buyEquip(){let cost=4000*Math.pow(3,state.maxEquip-3)'
]
found=[x for x in forbidden if x in h]
if found:
    raise SystemExit('Version 55 remove equip-slot upgrade validation failed; still present: '+', '.join(found))

required=[
    'Version 55: equip-slot upgrade removed; saved maxEquip preserved',
    '<span>🐾 装備上限</span><b>${state.maxEquip}匹</b>',
    'maxEquip:3',
    'state.equipped.length>=state.maxEquip'
]
missing=[x for x in required if x not in h]
if missing:
    raise SystemExit('Version 55 compatibility validation failed; missing: '+', '.join(missing))

print('Version 55 equip-slot upgrade removal validation: PASS')
runpy.run_path('patches/validate_v56.py',run_name='__main__')
