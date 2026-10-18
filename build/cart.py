# cart.py: inyecta carrito (cart.css + cart.js) y la sección de packs. Idempotente. Lo ejecuta wow.py al final.
import glob as _g, json as _j, urllib.parse as _u
_R='/workspace/euromedical-web/'
_PR=_j.load(open(_R+'assets/precios.json'))['productos']
_cop=lambda n:'$'+f'{n:,}'.replace(',','.')
def _card(p):
    imgs=''.join(f'<img src="assets/img/products/{p["img"]}.webp" alt="" width="96" height="96" loading="lazy">' for _ in range(min(p['pack'],3)))
    wa='https://wa.me/573186995645?text='+_u.quote(f'Hola Euromedical, me interesa el {p["nombre"]} ({_cop(p["precio"])}).')
    return f'''<article class="pack-card"><div class="pack-media" role="img" aria-label="{p['nombre']}"><span class="pack-badge">x{p['pack']}</span>{imgs}</div>
<h3>{p['nombre']}</h3><p class="pack-unit">{p['detalle']} · {_cop(round(p['precio']/p['pack']))} c/u</p><p class="pack-price">{_cop(p['precio'])}</p>
<div class="pcard-actions"><a class="btn btn-ml btn-sm" href="{p['ml']}" target="_blank" rel="noopener"><svg aria-hidden="true" width="18" height="18"><use href="#i-cart"/></svg><span>Comprar en MercadoLibre</span></a><a class="wa-link" href="{wa}" target="_blank" rel="noopener"><svg aria-hidden="true" width="20" height="20"><use href="#i-wa"/></svg> Consultar por WhatsApp</a></div></article>'''
_packs=[p for p in _PR if p.get('pack')]
_SEC=f'''<section class="section" id="packs" aria-labelledby="packs-t"><div class="container">
<div class="section-head"><p class="kicker">Packs para ahorrar</p><h2 id="packs-t">Lleva más y paga menos por tarro</h2><p>VitaZinc-F Silver y VitaZinc-F Fósforo en packs de 2 a 6 tarros, al mismo precio que en nuestra tienda de MercadoLibre.</p></div>
<div class="packs-grid">
{chr(10).join(_card(p) for p in _packs)}
</div></div></section>
'''
for _f in _g.glob(_R+'**/*.html',recursive=True):
    if '/preview' in _f: continue
    s=open(_f).read(); o=s
    pre='../' if '/blog/' in _f else ''
    if 'assets/cart.js' not in s:
        s=s.replace('</head>',f'<link rel="stylesheet" href="{pre}assets/cart.css">\n</head>',1)
        i=s.rfind('</body>'); s=s[:i]+f'<script src="{pre}assets/cart.js" defer></script>\n'+s[i:]
    if _f.endswith('/productos.html') and 'id="packs"' not in s:
        k=s.find('<section class="section section-alt" id="catalogo"');k=k if k>=0 else s.find('id="catalogo"')
        k=s.rfind('<section',0,k+1) if k>=0 else -1
        if k>=0: s=s[:k]+_SEC+'\n'+s[k:]
    if s!=o: open(_f,'w').write(s)
print('cart ok', len(_packs),'packs')
