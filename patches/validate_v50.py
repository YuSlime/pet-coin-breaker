from pathlib import Path
import sys
target=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html")
html=target.read_text(encoding="utf-8")
required=[
 "Version 50: normal pet card alignment fix",
 "pet-card:not(.huge-card):not(.titanic-card)",
 "translate(-50%,-50%) scale(.98)",
 "overflow:hidden!important"
]
missing=[x for x in required if x not in html]
if missing:
    raise SystemExit("missing Version 50 alignment fix: "+", ".join(missing))
css=Path("patches/v50.css").read_text(encoding="utf-8")
if ".huge-card" not in css or ".titanic-card" not in css:
    raise SystemExit("Version 50 must explicitly exclude Huge/Titanic")
print("Version 50 normal pet alignment validation: PASS")
