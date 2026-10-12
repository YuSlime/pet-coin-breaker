from pathlib import Path
import runpy
import sys

h=Path(sys.argv[1] if len(sys.argv)>1 else 'public/index.html').read_text(encoding='utf-8')
required=[
 'Version 52: pet selling; no serial/# numbering',
 'Version 54: sell action is rendered beside the top selection controls',
 'function renderSell()',
 "tab.dataset.tab='sell'",
 "section.id='sell'",
 'v54-sell-action',
 '<button class="btn primary v54-sell-action" onclick="v52SellSelected()"',
 '<button class="btn" onclick="v52ClearSellSelection()">選択解除</button></div></div>',
 'Version 53: move selected-pet sell action beside clear selection',
 'v53PlaceSellControls'
]
missing=[x for x in required if x not in h]
if missing:
    raise SystemExit('Version 54 sell placement validation failed: '+', '.join(missing))
if h.index('Version 52: pet selling; no serial/# numbering') > h.index('Version 53: move selected-pet sell action beside clear selection'):
    raise SystemExit('Version 54 validation failed: Version 52 SELL must load before Version 53 placement code')
for forbidden in ['serialNo','petSerial','mintNumber','HUGE #','TITANIC #']:
    if forbidden in h:
        raise SystemExit('serial numbering must stay removed: '+forbidden)
print('Version 54 direct sell-button placement validation: PASS')

runpy.run_path('patches/validate_v55.py',run_name='__main__')
