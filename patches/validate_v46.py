from pathlib import Path
import sys

target=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html")
html=target.read_text(encoding="utf-8")
required={
    "luxury egg base":"lux-egg-shell",
    "grass egg":"lux-egg-zone-0",
    "desert egg":"lux-egg-zone-1",
    "ice egg":"lux-egg-zone-2",
    "volcano egg":"lux-egg-zone-3",
    "sky egg":"lux-egg-zone-4",
    "space egg":"lux-egg-zone-5",
    "abyss egg":"lux-egg-zone-6",
    "egg builder":"luxuryEggHTML",
    "egg list decorator":"v46EggRefresh",
    "hatch egg model":"hatch-egg-lux",
    "version marker":"Version 46: replace legacy emoji eggs",
}
missing=[name for name,marker in required.items() if marker not in html]
if missing:
    raise SystemExit("missing Version 46 egg icon features: "+", ".join(missing))

js=Path("patches/v46.js").read_text(encoding="utf-8")
for forbidden in ("weightedPet(","Math.random","state.coins","effectiveHugeChance=","TITANIC_CHANCE"):
    if forbidden in js:
        raise SystemExit("Version 46 must not alter odds/economy logic: "+forbidden)

if "icon.innerHTML=luxuryEggHTML" not in js:
    raise SystemExit("egg list does not replace legacy emoji icon")
if "egg.innerHTML=luxuryEggHTML" not in js:
    raise SystemExit("hatch screen does not replace legacy emoji icon")

print("Version 46 luxury egg icon validation: PASS")
