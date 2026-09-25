from pathlib import Path
p=Path("public/index.html")
h=p.read_text(encoding="utf-8")
h=h.replace("</style>", Path("patches/v50.css").read_text(encoding="utf-8")+"\n</style>", 1)
p.write_text(h, encoding="utf-8")
Path("public/pages-version.json").write_text('{"version":50,"patch":"normal-pet-alignment-fix"}', encoding="utf-8")
