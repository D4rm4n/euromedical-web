# oct18b.py: fechas reales (fundada 2009, fabrica desde 2021), sin maquila en el inicio, orden de productos.
# Idempotente; lo ejecuta noml.py al final.
import glob as _g, re as _re, datetime as _dt
_R='/workspace/euromedical-web/'
_Y=_dt.date.today().year-2021  # años fabricando
_REP=[
 ('Fabricantes colombianos desde 2009 · 100% sin azúcar','Fundada en 2009 · Fabricamos desde 2021 · 100% sin azúcar'),
 ('Fabricantes colombianos desde 2009: historia, misión y valores.','Empresa colombiana fundada en 2009, fabricantes desde 2021: historia, misión y valores.'),
 ('Fabricantes colombianos desde 2009','Fundada en 2009 · Fabricamos desde 2021'),
 ('Fabricantes desde 2009','Fabricamos desde 2021'),
 ('Fabricamos nuestros productos en Colombia desde hace más de 17 años.','Empresa colombiana fundada en 2009; desde 2021 fabricamos nuestros propios productos.'),
 ('Fabricado en Bogotá desde 2009','Fabricado por nosotros en Bogotá'),
 ('fabricantes colombianos desde 2009:','empresa colombiana fundada en 2009 y fabricante desde 2021:'),
 ('fabricantes colombianos de complementos nutricionales en polvo desde 2009.','empresa colombiana fundada en 2009 que fabrica complementos nutricionales en polvo desde 2021.'),
 ('que fabrica complementos nutricionales en polvo en Bogotá desde 2009.','que fabrica complementos nutricionales en polvo en Bogotá desde 2021 (empresa fundada en 2009).'),
 ('laboratorio colombiano con sede en Bogotá desde 2009','empresa colombiana con sede en Bogotá, fundada en 2009 y fabricante desde 2021'),
 ('Somos fabricantes colombianos desde 2009.','Somos una empresa colombiana fundada en 2009 y fabricamos nuestros propios complementos desde 2021.'),
 ('Nace la empresa en Bogotá, el 6 de febrero, para fabricar productos nutricionales.','Nace la empresa en Bogotá, el 6 de febrero, para desarrollar y comercializar productos nutricionales.'),
 ('Iniciamos actividades el 6 de febrero de 2009. Desde entonces','Iniciamos actividades el 6 de febrero de 2009 y desde 2021 fabricamos nuestros propios productos. Desde entonces'),
 ('<strong>Desde <span data-count="2009" data-from="1995">2009</span></strong><span>fabricando en Bogotá</span>','<strong>Desde <span data-count="2021" data-from="2009">2021</span></strong><span>fabricando en Bogotá</span>'),
 ('<span data-wcount="2009" data-from="1990">2009</span></strong><span>fabricando en Bogotá desde</span>','<span data-wcount="2021" data-from="2009">2021</span></strong><span>fabricando en Bogotá desde</span>'),
 ('+<span data-count="17">17</span> años</strong> fabricando',f'+<span data-count="{_Y}">{_Y}</span> años</strong> fabricando'),
]
_TL='<li><span class="tl-year">2021</span><div><h3>Fabricación propia</h3><p>Empezamos a fabricar nuestros propios productos en Bogotá.</p></div></li>'
def _cut_div(s,start):
    # devuelve índice final del <div ...> balanceado que empieza en start
    d=0
    for m in _re.finditer(r'<(/?)div\b',s[start:]):
        d+= -1 if m.group(1) else 1
        if d==0: return start+s[start:].index('>',m.start())+1
    return -1
_used={a:0 for a,_ in _REP}
for _f in _g.glob(_R+'**/*.html',recursive=True):
    if '/preview' in _f: continue
    s=open(_f).read(); o=s
    for a,b in _REP:
        if a in s: _used[a]+=s.count(a); s=s.replace(a,b)
    if _f.endswith('/nosotros.html') and 'tl-year">2021' not in s:
        k=s.find('<li><span class="tl-year">Hoy'); 
        if k>0: s=s[:k]+_TL+s[k:]
    if _f==_R+'index.html':
        k=s.find('aria-label="3 de 3: Maquila"')
        if k>0:
            a=s.rfind('<div',0,k); e=_cut_div(s,a); s=s[:a]+s[e:]
            s=_re.sub(r'\s*<button type="button" class="sl-dot" aria-label="Ir a la diapositiva 3">.*?</button>','',s,count=1,flags=_re.S)
            s=s.replace(' de 3: ',' de 2: ')
        s=_re.sub(r'\s*<a class="why why-link" href="maquila.html">.*?</a>','',s,count=1,flags=_re.S)
        s=s.replace('<li>Maquila con tu marca desde 500 unidades</li>','')
    if _f.endswith('/productos.html'):
        def sec(i):
            k=s.find(i); a=s.rfind('<section',0,k); b=s.find('</section>',k)+10; return a,b
        pk=sec('id="packs"');pr=sec('id="promociones"');ct=sec('id="catalogo"')
        if pk[0]<pr[0]:
            P,PR,C=s[pk[0]:pk[1]],s[pr[0]:pr[1]],s[ct[0]:ct[1]]
            a=min(pk[0],pr[0],ct[0]);b=max(pk[1],pr[1],ct[1])
            s=s[:a]+PR+'\n\n'+C+'\n\n'+P+s[b:]
    if s!=o: open(_f,'w').write(s)
print('oct18b ok', {a[:40]:n for a,n in _used.items()})
