from pathlib import Path

p=Path('public/index.html')
h=p.read_text(encoding='utf-8')
marker='Version 58: reset upgrade values after the pet-clear redeem succeeds'

if marker not in h:
    js=Path('patches/v58.js').read_text(encoding='utf-8')
    h=h.replace('</body>','<script>'+js+'</script>\n</body>',1)

p.write_text(h,encoding='utf-8')
Path('public/pages-version.json').write_text('{"version":58,"patch":"pet-clear-resets-upgrades"}',encoding='utf-8')
print('Version 58 upgrade reset patch applied:',p.stat().st_size,'bytes')
