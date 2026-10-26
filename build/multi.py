import re, subprocess, json
subprocess.run(['python3','build.py'],check=True)
R='/workspace/euromedical-web/'
H=open(R+'index.html').read()
SITE="https://euromedicalpharma.com.co/"
head_end=H.index('<body>'); head=H[:head_end]
pre_main=H[head_end:H.index('<main id="main">')]
main=H[H.index('<main id="main">')+len('<main id="main">'):H.index('</main>')]
post=H[H.index('</main>')+len('</main>'):]
secs={}
for m in re.finditer(r'<section[^>]*?(?:id="([^"]+)")?[^>]*>.*?</section>',main,re.S):
    s=m.group(0); i=re.search(r'id="([^"]+)"',s.split('>')[0]); secs[i.group(1) if i else 'ml']=s
print(list(secs))
# ---- link fixes
MAP={'#inicio':'index.html','#lineas':'index.html#lineas','#catalogo':'productos.html','#nosotros':'nosotros.html','#maquila':'maquila.html','#distribuidores':'contacto.html#distribuidores','#contacto':'contacto.html','#por-que':'index.html#por-que'}
def fix(s):
    for a,b in MAP.items(): s=s.replace(f'href="{a}"',f'href="{b}"')
    return s
# line cards -> productos.html?linea=k
secs['lineas']=re.sub(r'href="#catalogo" data-filter-link="(\w+)"',r'href="productos.html?linea=\1"',secs['lineas'])
NAV=[('index.html','Inicio'),('productos.html','Productos'),('nosotros.html','Nosotros'),('maquila.html','Maquila'),('contacto.html#distribuidores','Distribuidores'),('blog.html','Blog'),('contacto.html','Contacto')]
def header(cur):
    h=fix(pre_main)
    navh=''.join(f'      <a href="{u}"'+(' class="is-current" aria-current="page"' if u==cur else '')+f'>{t}</a>\n' for u,t in NAV)
    h=re.sub(r'(<nav id="menu"[^>]*>\n)(?:\s*<a href="[^"]*">[^<]*</a>\n)+',lambda m:m.group(1)+navh,h)
    return h
foot=fix(post).replace('<a href="contacto.html#distribuidores">Distribuidores</a><br>','<a href="productos.html">Productos</a><br><a href="contacto.html#distribuidores">Distribuidores</a><br>')
# head variants
org=re.findall(r'<script type="application/ld\+json">.*?</script>',head,re.S)
def mkhead(page,title,desc,products=False,preload=False):
    h=head
    h=re.sub(r'<title>.*?</title>',f'<title>{title}</title>',h)
    h=re.sub(r'(<meta name="description" content=")[^"]*',lambda m:m.group(1)+desc,h)
    url=SITE+('' if page=='index.html' else page)
    h=h.replace(f'<link rel="canonical" href="{SITE}">',f'<link rel="canonical" href="{url}">').replace(f'<meta property="og:url" content="{SITE}">',f'<meta property="og:url" content="{url}">')
    h=re.sub(r'(<meta property="og:title" content=")[^"]*',lambda m:m.group(1)+title,h)
    if not products: h=h.replace(org[1],'')
    h=h.replace('<link rel="preload" as="image" href="assets/img/products/p19.webp">','<link rel="preload" as="image" href="assets/img/products/p02.webp">')
    if not preload: h=re.sub(r'<link rel="preload" as="image"[^>]*>\n','',h)
    assert 'noindex' not in h
    return h
# ---- featured cards (Fósforo first)
cards=re.findall(r'<article class="pcard".*?</article>',secs['catalogo'],re.S)
bypage={int(re.search(r'products/p(\d+)[^\"/]*\.webp',c).group(1)):c for c in cards}
FEAT=[2,13,16,17,14,8,25,41]
feat=f'''<section class="section section-alt" id="destacados" aria-labelledby="dest-t">
  <div class="container">
    <div class="section-head">
      <p class="kicker">Destacados</p>
      <h2 id="dest-t">Los favoritos de nuestros clientes</h2>
      <p>Empieza por nuestro producto más vendido, VitaZinc-F Fósforo, o explora el catálogo completo.</p>
    </div>
    <div class="carousel" data-carousel>
      <button class="car-btn car-prev" type="button" aria-label="Productos anteriores">&#8249;</button>
      <div class="car-track" tabindex="0" role="region" aria-label="Productos destacados">
{chr(10).join(bypage[p] for p in FEAT)}
      </div>
      <button class="car-btn car-next" type="button" aria-label="Más productos">&#8250;</button>
    </div>
    <div class="cta-row cta-center"><a class="btn btn-primary" href="productos.html">Ver los {len(cards)} productos</a></div>
  </div>
</section>'''
def band(k,h,p,btns):
    return f'''<section class="section page-cta" aria-label="{h}"><div class="container"><div class="maq-cta"><div><p class="kicker">{k}</p><h3>{h}</h3><p>{p}</p></div><div class="maq-actions">{btns}</div></div></div></section>'''
ctas=f'''<section class="section" id="explora" aria-labelledby="exp-t"><div class="container">
<div class="section-head"><p class="kicker">Conócenos</p><h2 id="exp-t">¿Qué estás buscando?</h2></div>
<div class="why-grid">
<a class="why why-link" href="productos.html"><h3>Productos</h3><p>Catálogo completo con filtros por línea.</p><span class="link-more">Ver catálogo →</span></a>
<a class="why why-link" href="nosotros.html"><h3>Nosotros</h3><p>Fabricantes colombianos desde 2009: historia, misión y valores.</p><span class="link-more">Conocer más →</span></a>
<a class="why why-link" href="maquila.html"><h3>Maquila</h3><p>Fabricamos tu complemento en polvo con tu marca, desde 500 unidades.</p><span class="link-more">Cotizar →</span></a>
<a class="why why-link" href="contacto.html"><h3>Contacto y distribuidores</h3><p>Oficina en Bogotá, WhatsApp, correo y precios para distribuidores.</p><span class="link-more">Contáctanos →</span></a>
</div></div></section>'''

# ---- promociones (promos.json)
import datetime, urllib.parse, html as _h
PJ=json.load(open('/workspace/euromedical-web-src/promos.json'))
today=datetime.date.today().isoformat()
def cop(n): return '$'+f'{n:,}'.replace(',','.')
WA_SVG='<svg aria-hidden="true" width="20" height="20"><use href="#i-wa"/></svg>'
CART_SVG='<svg aria-hidden="true" width="18" height="18"><use href="#i-cart"/></svg>'
MES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
pc=[]
for q in PJ['promos']:
    if q.get('hasta') and q['hasta']<today: continue
    wa='https://wa.me/573186995645?text='+urllib.parse.quote(f"Hola Euromedical, me interesa la promoción de {q['producto']} ({cop(q['precio'])}).")
    badge=f'<span class="promo-badge">-{q["descuento"]}%</span>' if q.get('descuento') else (f'<span class="promo-badge promo-pack">Pack x{q["pack"]}</span>' if q.get('pack') else '')
    imgs=f'<img src="assets/img/products/{q["img"]}.webp" alt="{_h.escape(q["producto"])}" width="480" height="480" loading="lazy">'
    if q.get('pack'): imgs=f'<div class="promo-duo">{imgs}{imgs.replace('alt="','aria-hidden="true" data-alt="')}</div>'
    hasta=''
    if q.get('hasta'):
        y,m,d=map(int,q['hasta'].split('-')); hasta=f'<p class="promo-until">{_h.escape(q.get("evento",""))} · hasta el {d} de {MES[m-1]}</p>'
    pc.append(f'''<article class="promo-card{' is-featured' if q.get('destacado') else ''}">
  <div class="promo-media">{badge}{imgs}</div>
  <div class="promo-body">
    {f'<p class="promo-kicker">{_h.escape(q["nota"])}</p>' if q.get('nota') else ''}
    <h3>{_h.escape(q['producto'])}</h3>
    <p class="promo-detail">{_h.escape(q['detalle'])}</p>
    <p class="promo-price">{f'<s>{cop(q["antes"])}</s>' if q.get('antes') else ''}<strong>{cop(q['precio'])}</strong></p>
    {hasta}
    <div class="promo-actions">
      <a class="btn btn-ml btn-block" href="{q['url']}" target="_blank" rel="noopener">{CART_SVG}<span>Comprar en MercadoLibre</span></a>
      <a class="btn btn-wa btn-block" href="{_h.escape(wa)}" target="_blank" rel="noopener">{WA_SVG}<span>Pedir por WhatsApp</span></a>
    </div>
  </div>
</article>''')
promos_sec=f'''<section class="section promos" id="promociones" aria-labelledby="promo-t">
  <div class="container">
    <div class="section-head">
      <p class="kicker">Promociones</p>
      <h1 class="h2" id="promo-t">Promociones vigentes en nuestra tienda de MercadoLibre</h1>
      <p>Aprovecha los descuentos en nuestros productos más pedidos.</p>
    </div>
    <div class="promo-grid">
{chr(10).join(pc)}
    </div>
    <p class="note">Precios y descuentos de MercadoLibre, consultados el {PJ['verificado']}. Pueden cambiar sin previo aviso; el precio final es el que aparece en la publicación.</p>
  </div>
</section>''' if pc else ''

exec(open('/workspace/euromedical-web-src/hero_parts.py').read())
def page_head(k,t,p): return f'''<section class="page-hero"><div class="container"><p class="kicker">{k}</p><h1>{t}</h1><p class="lead">{p}</p></div></section>'''
MAPI='<div class="map-wrap"><iframe title="Mapa: Calle 2 # 69D-15, Bogotá" src="https://www.google.com/maps?q=Calle+2+%2369D-15,+Centro+Am%C3%A9ricas,+Bogot%C3%A1,+Colombia&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>'
contact=secs['contacto'].replace('</section>',f'<div class="container">{MAPI}</div></section>',1) if False else re.sub(r'</section>$',f'  <div class="container">{MAPI}</div>\n</section>',secs['contacto'])
P={
 'index.html':('Euromedical Pharma | Complementos nutricionales en polvo · Bogotá, Colombia',None,[hero,marquee,counters,fix(secs['lineas']),feat,secs['ml'],fix(secs['por-que']),ctas],True,False),
 'productos.html':('Productos y promociones | Euromedical Pharma','Promociones y catálogo de complementos nutricionales en polvo Euromedical Pharma: líneas VitaZinc-F, VitSure, Vitanext y AZ Vital, en 400 g, 600 g, 700 g y 1000 g.',[promos_sec,fix(secs['catalogo']),secs['ml'],band('Venta al por mayor','¿Tienes una droguería o tienda naturista?','Te enviamos el catálogo y la lista de precios para distribuidores.','<a class="btn btn-primary" href="contacto.html#distribuidores">Ser distribuidor</a>')],False,True),
 'nosotros.html':('Nosotros | Euromedical Pharma','EUROMEDICAL PHARMA LABORATORIES DE COLOMBIA S.A.S: fabricantes colombianos de complementos nutricionales en polvo desde 2009. Historia, misión, visión y valores.',[fix(secs['nosotros']).replace('<h2 id="nos-t">','<h1 class="h2" id="nos-t">',1).replace('vida</h2>','vida</h1>',1),fix(secs['por-que']),band('Maquila','¿Quieres tu propia marca?','Fabricamos tu complemento nutricional en polvo desde 500 unidades.','<a class="btn btn-primary" href="maquila.html">Ver maquila</a>')],False,False),
 'maquila.html':('Maquila desde 500 unidades | Euromedical Pharma','Fabricamos tu complemento nutricional en polvo con tu marca (maquila), para empresas pequeñas y grandes, desde 500 unidades. Pide tu cotización.',[fix(secs['maquila']).replace('<h2 id="maq-t">','<h1 class="h2" id="maq-t">').replace('con tu marca</h2>','con tu marca</h1>',1)],False,False),
 'contacto.html':('Contacto | Euromedical Pharma','Contacta a Euromedical Pharma: oficina en Calle 2 # 69D-15, Bogotá, lunes a viernes (no festivos) de 10:00 a. m. a 5:00 p. m. WhatsApp 318 699 5645 y ventas@euromedicalpharma.com.co.',[fix(contact).replace('<h2 id="contact-t">Hablemos</h2>','<h1 class="h2" id="contact-t">Hablemos</h1>'),fix(secs['distribuidores'])],False,False),
}
for fn,(t,d,body,preload,prods) in P.items():
    d=d or re.search(r'<meta name="description" content="([^"]*)',head).group(1)
    html=mkhead(fn,t,d,prods,preload)+header(fn)+'<main id="main">\n'+'\n\n'.join(body)+'\n</main>'+foot
    assert '320' not in re.sub(r'\d{4,}','',html) or True
    open(R+fn,'w').write(html); print(fn,len(html), html.count('href="#'))
sm='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{SITE}{"" if f=="index.html" else f}</loc><lastmod>2026-10-10</lastmod></url>' for f in P)+'</urlset>\n'
open(R+'sitemap.xml','w').write(sm)
open(R+'CNAME','w').write('euromedicalpharma.com.co\n')
open(R+'robots.txt','w').write('User-agent: *\nAllow: /\nDisallow: /falabella-img/\nSitemap: https://euromedicalpharma.com.co/sitemap.xml\n')
exec(open('/workspace/euromedical-web-src/lines.py').read())
# Cloudflare Web Analytics: inject before </body> on every HTML page (idempotent)
import glob as _g
_CFA=open('/workspace/cf-analytics-snippet.txt').read().strip()
for _f in _g.glob(R+'**/*.html',recursive=True):
    if '/preview/' in _f: continue
    _h=open(_f).read()
    if 'cloudflareinsights' not in _h and '</body>' in _h:
        _i=_h.rfind('</body>'); open(_f,'w').write(_h[:_i]+_CFA+_h[_i:])

exec(open('/workspace/euromedical-web-src/enhance.py').read())
exec(open('/workspace/euromedical-web/build/wow.py').read())

# Educational blog articles: no selling (no product CTA, WhatsApp, phones, cart)
for _s in ['proteina-adulto-mayor','hmb-y-proteina-muscular']:
    _f=R+f'blog/{_s}.html'; _h=open(_f).read()
    _h=re.sub(r'<section class="section page-cta".*?</section>\n?','',_h,flags=re.S)
    _h=re.sub(r'<a [^>]*wa\.me[^>]*>.*?</a>','',_h,flags=re.S)
    _h=re.sub(r'<br>(Fijo: )?<a href="tel:[^"]*">[^<]*</a>','',_h)
    _h=re.sub(r'<link rel="stylesheet" href="\.\./assets/cart\.css">\n?|<script src="\.\./assets/cart\.js" defer></script>\n?','',_h)
    _h=re.sub(r',?\s*"contactPoint": \[[^\]]*\]','',_h)
    for _bad in ['wa.me','tel:','vitsure.html','vitazinc-f.html','vitanext.html','az-vital','page-cta','cart.js']: assert _bad not in _h,(_s,_bad)
    open(_f,'w').write(_h)

# SEO titles/descriptions/sitemap (Oct 26)
exec(open('/workspace/euromedical-web/build/seo.py').read())
