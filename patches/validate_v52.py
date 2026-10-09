from pathlib import Path
import sys
h=Path(sys.argv[1] if len(sys.argv)>1 else 'public/index.html').read_text(encoding='utf-8')
required=[
 'Version 52: pet SELL tab','data-tab="sell"','section.id=\'sell\'','function renderSell()','v52SellSelected','v52SellValue',
 "indexTab.insertAdjacentElement('afterend',tab)",'Huge / Titanic','state.pets=state.pets.filter','state.coins+=total','persist();renderAll();renderSell()'
]
missing=[x for x in required if x not in h]
if missing: raise SystemExit('missing Version 52 sell features: '+', '.join(missing))
for forbidden in ['serialNo','petSerial','mintNumber','HUGE #','TITANIC #']:
    if forbidden in h: raise SystemExit('serial numbering must stay removed: '+forbidden)
js=Path('patches/v52.js').read_text(encoding='utf-8')
for forbidden in ['weightedPet=function','TITANIC_CHANCE','effectiveHugeChance=']:
    if forbidden in js: raise SystemExit('Version 52 must not alter hatch odds: '+forbidden)
print('Version 52 pet selling validation: PASS')
