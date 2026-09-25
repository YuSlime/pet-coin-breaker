from pathlib import Path
p=Path("public/index.html")
h=p.read_text(encoding="utf-8")
h=h.replace("</style>", Path("patches/v46.css").read_text(encoding="utf-8")+"\n</style>", 1)
h=h.replace("</body>", "<script>"+Path("patches/v46.js").read_text(encoding="utf-8")+"</script>\n</body>", 1)
p.write_text(h, encoding="utf-8")
Path("public/pages-version.json").write_text('{"version":46,"patch":"luxury-egg-icons"}', encoding="utf-8")
