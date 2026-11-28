# Inserta/quita el banner de descuentos de fin de año. Uso: python3 tools/navidad_banner.py [add|remove]
# No menciona precios ni porcentajes. El enlace es el mismo de la tienda en MercadoLibre.
import sys, re, pathlib

START, END = "<!-- NAVIDAD2026:START -->", "<!-- NAVIDAD2026:END -->"
BF_START, BF_END = "<!-- BF2026:START -->", "<!-- BF2026:END -->"
ML = "https://listado.mercadolibre.com.co/_CustId_264996991"

BANNER = (
    START
    + f"""
<style>
.nv26{{position:relative;overflow:hidden;color:#FFF8E7;border-bottom:3px solid #D6B26E;font-family:inherit;background:
  radial-gradient(circle at 6% 35%,rgba(255,255,255,.4) 0 1.2px,transparent 2px),
  radial-gradient(circle at 18% 75%,rgba(255,248,231,.35) 0 1px,transparent 2px),
  radial-gradient(circle at 34% 25%,rgba(255,255,255,.28) 0 1.4px,transparent 2.2px),
  radial-gradient(circle at 52% 80%,rgba(255,248,231,.3) 0 1px,transparent 2px),
  radial-gradient(circle at 68% 30%,rgba(255,255,255,.38) 0 1.3px,transparent 2.1px),
  radial-gradient(circle at 82% 70%,rgba(255,248,231,.28) 0 1px,transparent 2px),
  radial-gradient(circle at 94% 40%,rgba(255,255,255,.32) 0 1.2px,transparent 2px),
  linear-gradient(90deg,#7A1F1F 0%,#1B3D30 38%,#24533F 62%,#7A1F1F 100%)}}
.nv26-in{{max-width:1200px;margin:0 auto;padding:12px 16px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 18px;text-align:center;position:relative;z-index:1}}
.nv26-tag{{background:#D6B26E;color:#1B3D30;font-weight:800;letter-spacing:.06em;padding:4px 10px;border-radius:4px;font-size:.85rem;text-transform:uppercase;white-space:nowrap}}
.nv26-txt{{font-size:1rem;line-height:1.4}}.nv26-txt strong{{color:#F3D58F}}
.nv26-btn{{background:#D6B26E;color:#1B3D30 !important;font-weight:700;padding:8px 16px;border-radius:999px;text-decoration:none;white-space:nowrap}}
.nv26-btn:hover{{filter:brightness(1.06)}}
.nv26-orn{{flex:none;width:18px;height:22px;opacity:.9}}
@media (max-width:600px){{
  .nv26-in{{padding:10px 12px;gap:8px 12px}}
  .nv26-txt{{font-size:.9rem}}
  .nv26-tag{{font-size:.75rem;padding:3px 8px}}
  .nv26-btn{{padding:8px 14px}}
  .nv26-orn{{display:none}}
}}
</style>
<div class="nv26" role="region" aria-label="Descuentos de fin de año Euromedical"><div class="nv26-in">
<span class="nv26-tag">Fin de año</span>
<svg class="nv26-orn" viewBox="0 0 18 22" aria-hidden="true" focusable="false"><path d="M9 0 v5" stroke="#D6B26E" stroke-width="1.2" fill="none"/><rect x="6.5" y="4.2" width="5" height="3" rx=".8" fill="#D6B26E"/><circle cx="9" cy="14" r="7" fill="#C43C3C"/><circle cx="7" cy="11.5" r="1.4" fill="#fff" opacity=".45"/></svg>
<span class="nv26-txt"><strong>🎄 Disfruta los descuentos de fin de año</strong> en nuestra tienda de MercadoLibre. Ahorra más llevando más unidades. Todos sin azúcar.</span>
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
        # Evita que queden los dos banners a la vez.
        s2 = re.sub(BF_RE, "", s2, flags=re.S)
        s2 = s2.replace('<header class="site-header">', BANNER + '<header class="site-header">', 1)
    if s2 != s:
        p.write_text(s2, encoding="utf-8")
        n += 1
print(mode, n)
