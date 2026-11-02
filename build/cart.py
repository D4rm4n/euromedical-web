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
# ---- gracias.html (retorno de Mercado Pago), generado desde contacto.html
import re as _re
_c=open(_R+'contacto.html').read()
_main='''<main id="main">
<section class="section gracias" aria-labelledby="gr-t"><div class="container" style="max-width:720px;text-align:center;padding:60px 20px">
<p class="kicker" id="gr-k">Tu pedido</p>
<h1 id="gr-t" class="h2">Procesando tu pago…</h1>
<p class="lead" id="gr-p">Estamos confirmando el resultado con Mercado Pago.</p>
<p id="gr-ref" class="note"></p>
<div class="cta-row cta-center" style="justify-content:center;gap:12px;display:flex;flex-wrap:wrap">
<a class="btn btn-primary" href="productos.html">Seguir comprando</a>
<a class="btn btn-wa" href="https://wa.me/573186995645?text=Hola%20Euromedical%2C%20acabo%20de%20hacer%20un%20pedido%20en%20la%20p%C3%A1gina%20web." target="_blank" rel="noopener"><svg aria-hidden="true" width="20" height="20"><use href="#i-wa"/></svg><span>Escríbenos por WhatsApp</span></a>
</div></div></section>
<script>
(()=>{const q=new URLSearchParams(location.search),e=q.get('estado')||q.get('status')||q.get('collection_status'),ref=q.get('external_reference'),pid=q.get('payment_id');
const T={aprobado:['¡Pago aprobado!','¡Gracias por tu compra! Te escribiremos por WhatsApp o correo para coordinar el envío.'],approved:0,
pendiente:['Pago pendiente','Tu pago está en proceso (por ejemplo Efecty o PSE). Te avisaremos apenas se confirme.'],pending:0,in_process:0,
rechazado:['El pago no se completó','No se realizó ningún cobro. Puedes intentarlo de nuevo o enviarnos tu pedido por WhatsApp.'],rejected:0,failure:0,null:0};
const k={approved:'aprobado',pending:'pendiente',in_process:'pendiente',rejected:'rechazado',failure:'rechazado'}[e]||e;const t=T[k];
if(t){document.getElementById('gr-t').textContent=t[0];document.getElementById('gr-p').textContent=t[1];document.title=t[0]+' | Euromedical Pharma'}
if(ref||pid)document.getElementById('gr-ref').textContent='Referencia: '+[ref,pid&&('pago '+pid)].filter(Boolean).join(' · ');
if(k==='aprobado')try{localStorage.removeItem('em-cart-v1')}catch(_){}})();
</script>
</main>'''
_g2=_c[:_c.index('<main id="main">')]+_main+_c[_c.index('</main>')+7:]
_g2=_re.sub(r'<title>.*?</title>','<title>Tu pedido | Euromedical Pharma</title>',_g2,count=1)
_g2=_g2.replace('<head>','<head>\n<meta name="robots" content="noindex">',1)
_g2=_re.sub(r'<link rel="canonical"[^>]*>','',_g2)
open(_R+'gracias.html','w').write(_g2)
print('gracias ok')
exec(open('/workspace/euromedical-web/build/noml.py').read())
