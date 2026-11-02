# SEO post-process (Oct 26 2026). Idempotent; run at end of multi.py or standalone.
import re, glob, os, datetime
R='/workspace/euromedical-web/'
TODAY=datetime.date.today().isoformat()
META={
 'index.html':('VitaZinc-F, VitSure y Vitanext | Euromedical Pharma',
  'Euromedical Pharma (Euromed): VitaZinc-F (Vita Zinc F), VitSure Advance y Vitanext en polvo sin azúcar. Mira precios y compra con envío a todo Colombia.'),
 'vitazinc-f.html':('VitaZinc-F (Vita Zinc F): precio y fórmulas | Euromedical',
  'VitaZinc-F (Vita Zinc F): Fósforo, Silver, Junior y más fórmulas en polvo con zinc, sin azúcar, en 400 g. Mira el precio y pide con envío a todo Colombia.'),
 'vitsure.html':('VitSure y VitSure Advance con HMB: precio | Euromedical',
  'VitSure Advance con HMB, VitSure Niños, Colágeno y Calcio en polvo, sin azúcar, en 400 g y 1000 g. Consulta el precio y compra con envío a todo Colombia.'),
 'vitanext.html':('Vitanext: complementos en polvo y precio | Euromedical',
  'Vitanext de Euromedical Pharma: Fósforo, Junior, Silver, Proteína y más fórmulas en polvo sin azúcar, en 400 g y 700 g. Envío a todo Colombia.'),
 'productos.html':('Precios VitaZinc-F, VitSure y Vitanext | Euromedical',
  'Catálogo y precios de VitaZinc-F (Vita Zinc F), VitSure Advance, Vitanext y AZ Vital: complementos en polvo sin azúcar con envío a todo Colombia.'),
}
for t,d in META.values(): assert len(t)<=60 and len(d)<=155,(t,len(t),len(d))
def setattr_(h,sel,val):
    return re.sub(r'(<meta (?:name|property)="%s" content=")[^"]*'%re.escape(sel),lambda m:m.group(1)+val,h)
for fn,(t,d) in META.items():
    h=open(R+fn).read()
    h=re.sub(r'<title>.*?</title>',f'<title>{t}</title>',h,count=1,flags=re.S)
    h=setattr_(h,'description',d); h=setattr_(h,'og:title',t); h=setattr_(h,'og:description',d)
    h=setattr_(h,'twitter:title',t); h=setattr_(h,'twitter:description',d)
    if 'og:description' not in h: h=h.replace('<meta property="og:url"',f'<meta property="og:description" content="{d}">\n<meta property="og:url"',1)
    if fn=='vitazinc-f.html':
        h=h.replace('id="linea-t">VitaZinc-F</h1>','id="linea-t">VitaZinc-F (Vita Zinc F)</h1>')
        h=h.replace('<p>VitaZinc-F es la línea más amplia','<p>VitaZinc-F, que muchos clientes buscan como Vita Zinc F o Vitazinc, es la línea más amplia')
    if fn=='vitsure.html':
        h=h.replace('id="linea-t">VitSure</h1>','id="linea-t">VitSure y VitSure Advance</h1>')
    if fn=='index.html':
        for p,a in [('p02','Tarro de VitaZinc-F Fósforo 400 g'),('p13','Tarro de VitSure Advance con HMB 400 g'),('p28-v2','Tarro de Vitanext Fósforo 700 g')]:
            h=re.sub(r'(<img class="hv[^"]*" src="assets/img/products/%s\.webp" alt=")(")'%p,r'\g<1>%s\2'%a,h)
    for bad in ['INVIMA','440 g',' cura ',' trata ',' previene ']: assert bad not in t+d
    assert 'noindex' not in h
    open(R+fn,'w').write(h)
# sitemap: every public page with lastmod
pages=sorted(p[len(R):] for p in glob.glob(R+'*.html')+glob.glob(R+'blog/*.html'))
pages=[p for p in pages if p not in ('gracias.html',) and 'noindex' not in open(R+p).read()]
sm=open(R+'sitemap.xml').read()
old=dict(re.findall(r'<loc>([^<]+)</loc>(?:<lastmod>([^<]+)</lastmod>)?',sm))
S='https://euromedicalpharma.com.co/'
out=[]
for p in ['index.html']+[x for x in pages if x!='index.html']:
    u=S+('' if p=='index.html' else p)
    lm=TODAY if p in META or not old.get(u) else old[u]
    out.append(f'  <url><loc>{u}</loc><lastmod>{lm}</lastmod></url>')
open(R+'sitemap.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+'\n'.join(out)+'\n</urlset>\n')
assert 'Disallow: /falabella-img/' in open(R+'robots.txt').read()
print('seo ok',len(out))
