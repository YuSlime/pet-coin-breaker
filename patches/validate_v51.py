from pathlib import Path
import subprocess
h=Path("public/index.html").read_text(encoding="utf-8")
for marker in ["Version 51: Huge-only","v51-huge-ring","v51-huge-wave","v51-huge-showcase","v51-huge-title","v51-huge-star"]:
 assert marker in h,marker
j=Path("patches/v51.js").read_text(encoding="utf-8")
for forbidden in ["state.coins","Math.random","weightedPet","TITANIC_CHANCE","effectiveHugeChance"]:
 assert forbidden not in j,forbidden
subprocess.run(["python3","patches/validate_v52.py","public/index.html"],check=True)
subprocess.run(["node","--check","patches/v52.js"],check=True)
print("Version 51 + Version 52 static checks PASS")
