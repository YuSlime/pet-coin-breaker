from pathlib import Path
import sys
h=Path(sys.argv[1] if len(sys.argv)>1 else 'public/index.html').read_text(encoding='utf-8')
required=[
 'Version 52: pet selling; no serial/# numbering',
 'function renderSell()',
 "tab.dataset.tab='sell'",
 "section.id='sell'",
 'Version 53: move selected-pet sell action beside clear selection',
 'v53PlaceSellControls',
 'button[onclick="v52SellSelected()"]',
 'button[onclick="v52ClearSellSelection()"]',
 'v52-sell-actions',
 'v52-sell-footer-row'
]
missing=[x for x in required if x not in h]
if missing:
    raise SystemExit('Version 54 sell placement validation failed: '+', '.join(missing))
if h.index('Version 52: pet selling; no serial/# numbering') > h.index('Version 53: move selected-pet sell action beside clear selection'):
    raise SystemExit('Version 54 validation failed: Version 52 SELL must load before Version 53 placement code')
for forbidden in ['serialNo','petSerial','mintNumber','HUGE #','TITANIC #']:
    if forbidden in h:
        raise SystemExit('serial numbering must stay removed: '+forbidden)
print('Version 54 sell screen + button placement validation: PASS')
