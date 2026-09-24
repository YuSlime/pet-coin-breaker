from pathlib import Path
p=Path("public/index.html")
h=p.read_text(encoding="utf-8")
h=h.replace("</body>", "<script>"+Path("patches/v40.js").read_text(encoding="utf-8")+"</script>\n</body>", 1)
p.write_text(h, encoding="utf-8")
Path("public/pages-version.json").write_text('{"version":40,"patch":"poko-break-sound"}', encoding="utf-8")
