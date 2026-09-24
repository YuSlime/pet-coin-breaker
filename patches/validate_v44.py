from pathlib import Path
import re, sys
target=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html")
html=target.read_text(encoding="utf-8")
rule=re.search(r'\.hatch\.revealed\.multi-mode \.multi-hatch-item\.v43-stagger-card\{([^}]*)\}', html)
if not rule:
    raise SystemExit("missing v43 stagger-card rule")
body=rule.group(1).replace(" ","")
if "opacity:0!important" in body:
    raise SystemExit("five-hatch regression: opacity is forced transparent with !important")
if "transform:translateY(52px)scale(.7)rotate(-3deg)!important" in body:
    raise SystemExit("five-hatch regression: transform is locked with !important")
if "opacity:0" not in body or "transform:translateY(52px)scale(.7)rotate(-3deg)" not in body:
    raise SystemExit("five-hatch initial stagger state missing")
if "v43-stagger-show" not in html or "@keyframes v43StaggerCard" not in html:
    raise SystemExit("five-hatch reveal animation missing")
print("Version 44 five-hatch visibility validation: PASS")
