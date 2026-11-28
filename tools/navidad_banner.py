# Inserta/quita el banner de descuentos de fin de año. Uso: python3 tools/navidad_banner.py [add|remove]
# No menciona precios ni porcentajes. El enlace es el mismo de la tienda en MercadoLibre.
# Arte: assets/img/banner-navidad.svg (original, no es un asset de stock).
import sys, re, pathlib

START, END = "<!-- NAVIDAD2026:START -->", "<!-- NAVIDAD2026:END -->"
BF_START, BF_END = "<!-- BF2026:START -->", "<!-- BF2026:END -->"
ML = "https://listado.mercadolibre.com.co/_CustId_264996991"
ASSET = "assets/img/banner-navidad.svg"

def banner(prefix: str) -> str:
    src = f"{prefix}{ASSET}?v=20261127c"
    return (
        START
        + f"""
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Playfair+Display:ital,wght@0,600;0,700;1,600&amp;display=swap">
<style>
.nv26{{position:relative;overflow:hidden;color:#FFF8E7;border-bottom:4px solid #D6B26E;isolation:isolate;background:#C8101E}}
.nv26-bg{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;pointer-events:none;z-index:0;display:block}}
.nv26-in{{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:22px 24px 26px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:210px;gap:2px}}
.nv26-title{{display:block;margin:0;font-family:"Great Vibes",cursive;font-weight:400;font-size:clamp(3.1rem,6.8vw,5.4rem);line-height:1.05;letter-spacing:.02em;background:linear-gradient(180deg,#FFFFFF 0%,#FFF6C8 28%,#F3D58F 62%,#FFE9A0 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:#FFF6C8;filter:drop-shadow(0 2px 0 #7A5A10) drop-shadow(0 6px 14px rgba(80,0,0,.5)) drop-shadow(0 0 24px rgba(255,220,120,.75))}}
.nv26-flourish{{width:min(220px,50vw);height:14px;margin:0 0 4px;display:block}}
.nv26-sub{{margin:0;font-family:"Playfair Display",Georgia,serif;font-weight:600;font-size:clamp(1.05rem,2.3vw,1.5rem);line-height:1.3;color:#FFF8E7;text-shadow:0 2px 8px rgba(80,0,0,.55),0 0 18px rgba(255,200,120,.4)}}
.nv26-love{{margin:4px 0 8px;font-family:"Playfair Display",Georgia,serif;font-style:italic;font-weight:600;font-size:clamp(.92rem,1.7vw,1.12rem);color:#FFE4A0;text-shadow:0 1px 6px rgba(80,0,0,.5)}}
.nv26-love span{{color:#FFD1DC}}
.nv26-btn{{background:linear-gradient(180deg,#FFF0B8,#E0B65A 55%,#D6B26E);color:#7A1212 !important;font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:.98rem;padding:11px 22px;border-radius:999px;text-decoration:none;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.3),0 0 0 2px rgba(255,232,160,.4);margin-top:4px}}
.nv26-btn:hover{{filter:brightness(1.07)}}
@media (max-width:600px){{
  .nv26-in{{padding:20px 16px 22px;min-height:198px;gap:2px}}
  .nv26-title{{font-size:clamp(2.6rem,13vw,3.4rem)}}
  .nv26-sub{{font-size:1.02rem}}
  .nv26-btn{{padding:10px 18px;font-size:.92rem;white-space:normal}}
}}
</style>
<div class="nv26" role="region" aria-label="Descuentos de fin de año Euromedical">
<img class="nv26-bg" src="{src}" alt="" width="1600" height="280" aria-hidden="true">
<div class="nv26-in">
<p class="nv26-title">Felices Fiestas</p>
<svg class="nv26-flourish" viewBox="0 0 220 14" aria-hidden="true" focusable="false"><path d="M6,9 C40,3 70,12 110,7 C150,2 180,11 214,8" fill="none" stroke="#F3D58F" stroke-width="1.7" stroke-linecap="round"/><circle cx="110" cy="7" r="2.4" fill="#FF6B8A" stroke="#F3D58F" stroke-width=".7"/></svg>
<p class="nv26-sub">Disfruta los descuentos de fin de año</p>
<p class="nv26-love">Con cariño, para ti y para los tuyos <span>♥</span></p>
<a class="nv26-btn" href="{ML}" target="_blank" rel="noopener">Ver la tienda en MercadoLibre ↗</a>
</div></div>
"""
        + END
        + "\n"
    )

SKIP = {"preview", "preview-shots", "tools", "worker"}
BF_RE = re.escape(BF_START) + r".*?" + re.escape(BF_END) + r"\n?"
NV_RE = re.escape(START) + r".*?" + re.escape(END) + r"\n?"

mode = sys.argv[1] if len(sys.argv) > 1 else "add"
n = 0
for p in pathlib.Path(".").rglob("*.html"):
    if p.parts[0] in SKIP:
        continue
    s = p.read_text(encoding="utf-8")
    s2 = re.sub(NV_RE, "", s, flags=re.S)
    if mode == "add":
        s2 = re.sub(BF_RE, "", s2, flags=re.S)
        prefix = "../" if len(p.parts) > 1 else ""
        s2 = s2.replace(
            '<header class="site-header">',
            banner(prefix) + '<header class="site-header">',
            1,
        )
    if s2 != s:
        p.write_text(s2, encoding="utf-8")
        n += 1
print(mode, n)
