# wow.py: modern dark/neon layer (idempotent), exec'd at end of multi.py
import glob as _g, re as _re
_R='/workspace/euromedical-web/'
_WA='https://wa.me/573186995645?text=Hola%20Euromedical%2C%20vi%20su%20p%C3%A1gina%20y%20quiero%20informaci%C3%B3n.'
_HERO=f'''<section class="wow-hero" id="impacto" aria-labelledby="wow-t">
  <video class="wow-bg" autoplay muted loop playsinline preload="metadata" poster="assets/video/fosforo-poster.webp" aria-hidden="true"><source src="assets/video/fosforo.mp4" type="video/mp4"></video>
  <canvas class="wow-particles" aria-hidden="true"></canvas>
  <div class="wow-shade" aria-hidden="true"></div>
  <div class="container wow-hero-in">
    <p class="wow-kicker">Fabricantes colombianos desde 2009 · 100% sin azúcar</p>
    <h1 id="wow-t" class="wow-words">Dale un Boost a tus neuronas y un descanso a tu mente!</h1>
    <p class="wow-lead">VitaZinc-F Fósforo, nuestro producto más vendido, y toda la línea de complementos en polvo hechos en Bogotá.</p>
    <div class="wow-cta"><a class="btn btn-ml mag" href="https://articulo.mercadolibre.com.co/MCO-459959394" target="_blank" rel="noopener"><svg aria-hidden="true" width="18" height="18"><use href="#i-cart"/></svg><span>Comprar Fósforo</span></a><a class="btn btn-wa mag" href="{_WA}" target="_blank" rel="noopener"><svg aria-hidden="true" width="20" height="20"><use href="#i-wa"/></svg><span>WhatsApp 318 699 5645</span></a><a class="btn wow-ghost mag" href="productos.html">Ver productos</a></div>
  </div>
  <a class="wow-scroll" href="#video-fosforo" aria-label="Bajar"><span></span></a>
</section>
<section class="wow-sugar" aria-label="Sin azúcar"><div class="container wow-sugar-in"><div><strong><span data-wcount="100">100</span>%</strong><span>sin azúcar</span></div><div><strong><span data-wcount="47">47</span></strong><span>presentaciones</span></div><div><strong><span data-wcount="4">4</span></strong><span>líneas de producto</span></div><div><strong><span data-wcount="2009" data-from="1990">2009</span></strong><span>fabricando en Bogotá desde</span></div></div></section>
'''
for _f in _g.glob(_R+'**/*.html',recursive=True):
    if '/preview' in _f: continue
    s=open(_f).read()
    if 'assets/wow.css' in s: continue
    pre='../' if '/blog/' in _f else ''
    s=s.replace('</head>',f'<link rel="stylesheet" href="{pre}assets/wow.css">\n<meta name="theme-color" content="#050B18">\n</head>',1)
    s=s.replace('<body>','<body class="wow">',1)
    if _f.endswith('/index.html') and '/blog/' not in _f:
        s=s.replace('<section class="hero hero-slider"',_HERO+'\n<section class="hero hero-slider"',1)
        # hero slider's h1 -> h2 (only one h1)
        s=_re.sub(r'(<section class="hero hero-slider".*?)<h1([ >])(.*?)</h1>',lambda m:m.group(1)+'<h2 class="h1"'+m.group(2)+m.group(3)+'</h2>',s,count=1,flags=_re.S)
    s=s.replace('<article class="story"','<article class="story wow-gray"').replace('<article class="story story-rev"','<article class="story story-rev wow-gray"')
    s=s.replace('class="wa-float"','class="wa-float wow-pulse"')
    i=s.rfind('</body>'); s=s[:i]+f'<script src="{pre}assets/wow.js" defer></script>\n<script src="{pre}assets/p3d.js" defer></script>\n'+s[i:]
    open(_f,'w').write(s)
print('wow ok')
import os as _os
if _os.path.exists('/workspace/euromedical-web/build/cart.py'): exec(open('/workspace/euromedical-web/build/cart.py').read())
