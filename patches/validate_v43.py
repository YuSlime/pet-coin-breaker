from pathlib import Path
import sys

target=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html")
html=target.read_text(encoding="utf-8")
required={
    "magic circle":"v43-magic-circle",
    "pull particles":"v43-pull-particle",
    "pre-reveal rarity charge":"v43-pre-",
    "slow motion beat":"v43-slowmo",
    "silhouette reveal":"v43-silhouette",
    "landing shock ring":"v43-land-ring",
    "cinematic vignette":"v43-cinematic",
    "best result showcase":"v43-best-showcase",
    "mobile vibration":"navigator.vibrate",
    "multi hatch stagger":"v43-stagger-card",
    "version marker":"Version 43",
}
missing=[name for name,marker in required.items() if marker not in html]
if missing:
    raise SystemExit("missing Version 43 features: "+", ".join(missing))

js=Path("patches/v43.js").read_text(encoding="utf-8")
for forbidden in ("weightedPet","effectiveHugeChance","TITANIC_CHANCE","Math.random","state.coins-="):
    if forbidden in js:
        raise SystemExit("Version 43 must not alter odds/economy logic: "+forbidden)

print("Version 43 validation: PASS")
