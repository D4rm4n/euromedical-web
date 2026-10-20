# noml.py: quita enlaces a MercadoLibre -> carrito propio / WhatsApp. Idempotente. Lo ejecuta cart.py al final.
import glob as _g, json as _j, re as _re
_R='/workspace/euromedical-web/'
_PR=_j.load(open(_R+'assets/precios.json'))['productos']
_mco=lambda u:(_re.search(r'MCO-?(\d+)',u) or [None,None])[1]
_BY={_mco(p['ml']):p['id'] for p in _PR if p.get('ml') and not p.get('pack')}
_CART='<svg aria-hidden="true" width="18" height="18"><use href="#i-cart"/></svg>'
_ML=r'<a [^>]*href="https?://[a-z.]*mercadolibre[^"]*"[^>]*>.*?</a>'
_BAND='''<section class="ml-band" aria-labelledby="ml-t">
  <div class="container ml-grid">
    <div>
      <p class="kicker kicker-light">Compra directo al fabricante</p>
      <h2 id="ml-t">Compra aquí, sin intermediarios</h2>
      <p>Agrega tus productos al carrito y paga seguro con Mercado Pago: tarjeta, PSE, transferencia Bancolombia o Efecty.</p>
      <p class="ml-full"><strong>Envíos a todo Colombia:</strong> desde $10.000 en Bogotá y <strong>gratis en compras de más de $100.000</strong> (zonas remotas con 50% de descuento).</p>
    </div>
    <div class="ml-stat">
      <p class="ml-num">★ 4,6 <small>/ 5</small></p>
      <p>VitaZinc-F Fósforo: <strong>+500 vendidos</strong> y 165 calificaciones en MercadoLibre.</p>
      <div class="cta-row">
        <button class="btn btn-cart" type="button" data-add="vzf-fosforo-400">'''+_CART+'''<span>Agregar Fósforo al carrito</span></button>
        <a class="btn btn-ghost-light" href="{pre}productos.html">Ver todos los productos</a>
      </div>
    </div>
  </div>
</section>'''
_n=0
for _f in _g.glob(_R+'**/*.html',recursive=True):
    if '/preview' in _f: continue
    s=open(_f).read(); o=s; pre='../' if '/blog/' in _f else ''
    def card(m):
        global _n; _n+=_len(_re.findall(_ML,m.group(0),_re.S)); return _re.sub(r'\s*'+_ML,'',m.group(0),flags=_re.S)
    _len=len
    s=_re.sub(r'<article class="(?:pcard|promo-card|pack-card)[^"]*".*?</article>',card,s,flags=_re.S)
    def band(m):
        global _n; _n+=len(_re.findall(_ML,m.group(0),_re.S)); return _BAND.replace('{pre}',pre)
    s=_re.sub(r'<section class="ml-band".*?</section>',band,s,flags=_re.S)
    def other(m):
        global _n; a=m.group(0); _n+=1
        if 'Tienda en MercadoLibre' in a: return f'<a href="{pre}productos.html">Comprar en línea</a>'
        pid=_BY.get(_mco(re_href(a)))
        cls=_re.search(r'class="([^"]*)"',a); cls=(cls.group(1) if cls else 'btn').replace('btn-ml','btn-cart')
        txt=_re.sub('<[^>]+>','',a).strip()
        lab='Comprar Fósforo' if 'Comprar Fósforo' in txt else 'Agregar al carrito'
        if pid: return f'<button class="{cls}" type="button" data-add="{pid}">{_CART}<span>{lab}</span></button>'
        return f'<a class="{cls}" href="{pre}productos.html">{_CART}<span>Ver productos</span></a>'
    re_href=lambda a:_re.search(r'href="([^"]*)"',a).group(1)
    s=_re.sub(_ML,other,s,flags=_re.S)
    s=s.replace('Compra en MercadoLibre o pide por WhatsApp.','Compra aquí en la página con envío a todo Colombia o pide por WhatsApp.')
    if s!=o: open(_f,'w').write(s)
print('noml ok, enlaces cambiados:',_n)
# ---- Home: sección pequeña "Encuéntranos en MercadoLibre" (única salida a ML permitida)
# Opiniones REALES copiadas de la publicación pública MCO459959394 (capturadas el 8 oct 2026). ML no muestra nombre del comprador.
_REV=[(5,'Es un producto efectivo, estaba con fatiga crónica, lo tomé en la noche, al día siguiente subí a monserrate y he cambiado mi vida. Claramente tiene múltiples vitaminas y minerales qué nos ayudan en procesos físicos y mentales.'),
(4,'El sabor es muy agradable me encanta q no tenga tanta azúcar es fácil de disolver, apenas lo empiezo a tomar, creo q sus efectos son diferentes en cada persona y todo depende de los motivos por los cuales esta tomando el producto, personalmente me esta haciendo bien me siento mucho mejor más concentrada, mi estado de ánimo a mejorado e incluso estoy durmiendo mejor.'),
(5,'Me agrado bastante lo pedire de nuevo.'),
(5,'Excelente producto. Muy recomendado.')]
import html as _h
_stars=lambda n:'<span class="mlr-stars" aria-label="'+str(n)+' de 5 estrellas">'+'★'*n+'<span class="mlr-off">'+'★'*(5-n)+'</span></span>'
_MLSEC='''<section class="section mlr" id="mercadolibre" aria-labelledby="mlr-t"><div class="container">
<div class="mlr-head"><div><p class="kicker">Encuéntranos en MercadoLibre</p><h2 id="mlr-t">Somos parte del programa MercadoLibre Full</h2>
<p>VitaZinc-F Fósforo tiene <strong>★ 4,6 / 5</strong> con 165 calificaciones y +500 vendidos. Esto opinan algunos compradores:</p></div>
<a class="mlr-link" data-ml-ok href="https://listado.mercadolibre.com.co/_CustId_264996991" target="_blank" rel="noopener">Ver nuestra tienda en MercadoLibre ↗</a></div>
<div class="mlr-grid">'''+''.join(f'<figure class="mlr-card">{_stars(n)}<blockquote>“{_h.escape(t)}”</blockquote><figcaption>Comprador en MercadoLibre · VitaZinc-F Fósforo</figcaption></figure>' for n,t in _REV)+'''</div>
<p class="note mlr-note">Opiniones reales y sin editar de la publicación de VitaZinc-F Fósforo en MercadoLibre. MercadoLibre no muestra el nombre de quien opina.</p>
</div></section>'''
_ix=_R+'index.html'; _s=open(_ix).read()
if 'id="mercadolibre"' not in _s:
    _k=_s.find('<section class="section follow" id="siguenos"')
    if _k>0: _s=_s[:_k]+_MLSEC+'\n\n'+_s[_k:]; open(_ix,'w').write(_s)
print('mlr ok')
exec(open('/workspace/euromedical-web/build/oct18b.py').read())
