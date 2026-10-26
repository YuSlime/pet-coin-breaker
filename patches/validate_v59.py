from pathlib import Path
import sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'public/index.html')
h=p.read_text(encoding='utf-8')
css=Path('patches/v59.css').read_text(encoding='utf-8')
required=[
 'Version 59 — polished gold paw coin',
 '#coinTarget.coin-target.v47-lux-coin:not(.v20-boss-chest)',
 '#coinTarget.v47-lux-coin .v47-coin-gem::after',
 '.gicon-coin::after,.v47-inline-coin::after,.v47-mini-coin::after',
 '@media(prefers-reduced-motion:reduce)',
 'mask:url("data:image/svg+xml,',
 'Version 52: pet selling; no serial/# numbering',
 'Version 58: guarded upgrade reset after pet-clear success',
]
missing=[x for x in required if x not in h]
if missing: raise SystemExit('Version 59 required element missing: '+', '.join(missing))
if h.count('Version 59 — polished gold paw coin')!=1:
 raise SystemExit('Version 59 CSS must occur exactly once')
for forbidden in ['state.coins=', 'state.coins+=', 'weightedPet=function', 'renderCoinVisual=function', 'window.coinRain=']:
 if forbidden in css: raise SystemExit('Version 59 must be purely cosmetic: '+forbidden)
if h.index('Version 47: luxury coin icon system')>h.index('Version 59 — polished gold paw coin'):
 raise SystemExit('Version 59 CSS loaded before its prerequisite')
print('Version 59 polished coin safety and dependency checks: PASS')
