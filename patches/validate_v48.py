from pathlib import Path
import sys,re
target=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html")
html=target.read_text(encoding="utf-8")
required=[
 "Version 48: unique pet faces",
 "face-happy","face-cheeky","face-cute","face-mischief","face-gentle","face-proud",
 "face-stern","face-ancient","face-shy","face-royal","face-beast","face-sleepy","face-mystic","face-fierce",
 "pet-brow","pet-blush","pet-mark","pet-fang","v48FaceMap"
]
missing=[x for x in required if x not in html]
if missing: raise SystemExit("missing Version 48 features: "+", ".join(missing))
js=Path("patches/v48.js").read_text(encoding="utf-8")
m=re.search(r"FACE_BY_SKIN=\{(.*?)\};",js,re.S)
if not m: raise SystemExit("face map missing")
pairs=re.findall(r"([a-z0-9]+):'([a-z]+)'",m.group(1))
if len(pairs)<43: raise SystemExit(f"expected >=43 named pet face assignments, got {len(pairs)}")
for forbidden in ("state.coins","weightedPet(","Math.random","effectiveHugeChance=","TITANIC_CHANCE"):
    if forbidden in js: raise SystemExit("Version 48 must not alter game balance: "+forbidden)
print("Version 48 unique pet faces validation: PASS",len(pairs),"skins")
