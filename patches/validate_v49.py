from pathlib import Path
import sys
target=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html")
html=target.read_text(encoding="utf-8")
required=[
 "Version 49: pet shapes + egg-name motifs",
 "v49-shape-pack","v49-tail","v49-halo","v49-orbit","v49-motif",
 "skin-grassdog","skin-cloverrabbit","skin-sandstormdragon","skin-crystalunicorn",
 "skin-magmadragon","skin-angelbunny","skin-cosmicdragon","skin-eclipseunicorn","skin-abyssdragon",
 "Version 49: unique silhouettes inspired by each pet/egg motif"
]
missing=[x for x in required if x not in html]
if missing: raise SystemExit("missing Version 49 features: "+", ".join(missing))
css=Path("patches/v49.css").read_text(encoding="utf-8")
skins=[
"grassdog","grasscat","cloverrabbit","forestfox","flowerunicorn","forestdragon",
"sandjackal","sphinxcat","sandbunny","fennec","sununicorn","sandstormdragon",
"snowwolf","icecat","snowbunny","frostfox","crystalunicorn","frostdragon",
"hellhound","magmacat","emberbunny","flamefox","infernounicorn","magmadragon",
"cloudpuppy","skycat","angelbunny","windfox","celestialunicorn","heavendragon",
"starwolf","cosmocat","nebulabunny","galaxyfox","novaunicorn","cosmicdragon",
"voidcat","shadowbunny","nightmarefox","eclipseunicorn","abysshound","abyssdragon","bossdragon"]
missing_skins=[s for s in skins if f".skin-{s}" not in css]
if missing_skins: raise SystemExit("missing per-pet shape rules: "+", ".join(missing_skins))
js=Path("patches/v49.js").read_text(encoding="utf-8")
for forbidden in ("state.coins","weightedPet(","Math.random","effectiveHugeChance=","TITANIC_CHANCE"):
    if forbidden in js: raise SystemExit("Version 49 must not alter game balance: "+forbidden)
print("Version 49 unique pet shape validation: PASS",len(skins),"skins")
