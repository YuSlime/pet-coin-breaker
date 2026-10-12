from pathlib import Path
import sys

p=Path(sys.argv[1] if len(sys.argv)>1 else 'public/index.html')
h=p.read_text(encoding='utf-8')
marker='Version 55: equip-slot upgrade removed; saved maxEquip preserved'

if marker not in h:
    old_buy="function buyEquip(){let cost=4000*Math.pow(3,state.maxEquip-3);if(state.coins<cost)return toast('コインが足りません');if(state.maxEquip>=6)return toast('装備枠は最大です');state.coins-=cost;state.maxEquip++;autoEquip();renderAll()}"
    old_stats_prefix="function renderStats(){let ec=state.maxEquip>=6?'MAX':fmt(4000*Math.pow(3,state.maxEquip-3)),cc="
    new_stats_prefix="function renderStats(){let cc="
    old_button='<button class="btn purple" style="width:100%;margin-bottom:9px" onclick="buyEquip()" ${state.maxEquip>=6?\'disabled\':\'\'}>装備枠 +1　🪙 ${ec}</button>'

    expected={
        'buyEquip implementation': old_buy,
        'renderStats equip cost': old_stats_prefix,
        'equip upgrade button': old_button,
    }
    missing=[name for name,text in expected.items() if text not in h]
    if missing:
        raise SystemExit('Version 55 patch prerequisites missing: '+', '.join(missing))

    h=h.replace(old_buy,'',1)
    h=h.replace(old_stats_prefix,new_stats_prefix,1)
    h=h.replace(old_button,'',1)
    h=h.replace('</body>',f'<!-- {marker} -->\n</body>',1)

p.write_text(h,encoding='utf-8')
Path('public/pages-version.json').write_text('{"version":55,"patch":"remove-equip-slot-upgrade"}',encoding='utf-8')
print('Version 55 equip-slot upgrade removal applied:',p.stat().st_size,'bytes')
