from pathlib import Path

page = Path("public/index.html")
html = page.read_text(encoding="utf-8")
css = Path("patches/v20.css").read_text(encoding="utf-8")
js = Path("patches/v20.js").read_text(encoding="utf-8")

html = html.replace("</style>", css + "\n</style>", 1)
html = html.replace("</body>", "<script>\n" + js + "\n</script>\n</body>", 1)

page.write_text(html, encoding="utf-8")
Path("public/pages-version.json").write_text(
    '{"version":20,"patch":"arena-boss-chest-huge-boss-dragon"}',
    encoding="utf-8",
)
print("Version 20 applied", page.stat().st_size)
