from pathlib import Path
import sys

target=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html")
html=target.read_text(encoding="utf-8")
required={
    "grand fx":"v45-grandfx",
    "triple rings":"v45-ring3",
    "aurora":"v45-aurora",
    "spotlights":"v45-spot2",
    "pull particles":"v45-p",
    "silhouette":"v45-sil",
    "best result":"v45-best",
    "five hatch glow":"v45-glow-pop",
    "luxury audio":"v45Titanic",
    "version marker":"Version 45: ultra luxury hatch overhaul",
}
missing=[name for name,marker in required.items() if marker not in html]
if missing:
    raise SystemExit("missing Version 45 features: "+", ".join(missing))

compact=html.replace(" ","")
if "multi-hatch-item.v43-stagger-card{opacity:0!important" in compact:
    raise SystemExit("five-hatch regression: opacity locked by !important")

js=Path("patches/v45.js").read_text(encoding="utf-8")
for forbidden in ("weightedPet(","Math.random","state.coins","TITANIC_CHANCE","effectiveHugeChance"):
    if forbidden in js:
        raise SystemExit("Version 45 must not alter odds/economy logic: "+forbidden)

print("Version 45 ultra luxury hatch validation: PASS")
