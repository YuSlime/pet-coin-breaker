from pathlib import Path

p=Path('public/index.html')
h=p.read_text(encoding='utf-8')
marker='Version 59 — polished gold paw coin'
if marker in h:
    raise SystemExit('Version 59 already applied; refusing duplicate CSS')
if 'Version 47: luxury coin icon system' not in h:
    raise SystemExit('Version 47 CSS dependency missing')
if 'Version 58: guarded upgrade reset after pet-clear success' not in h:
    raise SystemExit('Version 58 prerequisite missing')
if '</style>' not in h:
    raise SystemExit('Missing style insertion point')
h=h.replace('</style>',Path('patches/v59.css').read_text(encoding='utf-8')+'\n</style>',1)
p.write_text(h,encoding='utf-8')
Path('public/pages-version.json').write_text('{"version":59,"patch":"polished-paw-coin-ui"}',encoding='utf-8')
print('Version 59 coin cosmetics applied:',p.stat().st_size,'bytes')
