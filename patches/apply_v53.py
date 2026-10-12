from pathlib import Path
import runpy

p=Path('public/index.html')
h=p.read_text(encoding='utf-8')

# Version 53 depends on the Version 52 SELL screen. The deploy workflow can
# rebuild from an older base, so make the prerequisite self-contained here.
if 'Version 52: pet selling; no serial/# numbering' not in h:
    h=h.replace('</style>',Path('patches/v52.css').read_text(encoding='utf-8')+'\n</style>',1)
    h=h.replace('</body>','<script>'+Path('patches/v52.js').read_text(encoding='utf-8')+'</script>\n</body>',1)

if 'Version 53: move selected-pet sell action beside clear selection' not in h:
    h=h.replace('</style>',Path('patches/v53.css').read_text(encoding='utf-8')+'\n</style>',1)
    h=h.replace('</body>','<script>'+Path('patches/v53.js').read_text(encoding='utf-8')+'</script>\n</body>',1)

p.write_text(h,encoding='utf-8')
Path('public/pages-version.json').write_text('{"version":54,"patch":"sell-screen-prerequisite-and-button-placement-fix"}',encoding='utf-8')

# Version 55 removes only the normal equip-slot purchase upgrade while
# preserving saved maxEquip values and the rest of the pet equip system.
runpy.run_path('patches/apply_v55.py',run_name='__main__')
