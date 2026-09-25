from pathlib import Path
import sys

target=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html")
html=target.read_text(encoding="utf-8")
required={
    "premium small coin":"gicon-coin::before",
    "inline economy coin":"v47-inline-coin",
    "large royal coin":"v47-lux-coin",
    "coin face":"v47-coin-face",
    "coin crown":"v47-coin-crown",
    "coin gem":"v47-coin-gem",
    "coin rain":"v47-mini-coin",
    "boss chest protection":"v20-boss-chest > .v47-coin-face",
    "coin installer":"installCoinTarget",
    "version marker":"Version 47: luxury coin icon system",
}
missing=[name for name,marker in required.items() if marker not in html]
if missing:
    raise SystemExit("missing Version 47 coin features: "+", ".join(missing))

js=Path("patches/v47.js").read_text(encoding="utf-8")
for forbidden in ("state.coins=","state.coins+=","state.coins-=","weightedPet(","effectiveHugeChance=","TITANIC_CHANCE"):
    if forbidden in js:
        raise SystemExit("Version 47 must not alter economy/odds logic: "+forbidden)

if "v20-boss-chest > .v47-coin-face" not in html:
    raise SystemExit("boss chest protection missing")

print("Version 47 luxury coin icon validation: PASS")
