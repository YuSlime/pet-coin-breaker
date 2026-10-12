from pathlib import Path
import sys
h=Path(sys.argv[1] if len(sys.argv)>1 else 'public/index.html').read_text(encoding='utf-8')
required=[
 'Version 53: move sell button to top actions',
 'v53PlaceSellControls',
 'v52SellSelected()',
 'v52ClearSellSelection()',
 'v52-sell-actions',
 'v52-sell-footer-row'
]
missing=[x for x in required if x not in h]
if missing:
 raise SystemExit('Version 53 RED/validation failed: '+', '.join(missing))
print('Version 53 sell control placement validation: PASS')
