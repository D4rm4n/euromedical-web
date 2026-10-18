# cart.py: inyecta carrito (cart.css + cart.js) en todas las páginas. Idempotente. Lo ejecuta wow.py al final.
import glob as _g
for _f in _g.glob('/workspace/euromedical-web/**/*.html',recursive=True):
    if '/preview' in _f: continue
    s=open(_f).read()
    if 'assets/cart.js' in s: continue
    pre='../' if '/blog/' in _f else ''
    s=s.replace('</head>',f'<link rel="stylesheet" href="{pre}assets/cart.css">\n</head>',1)
    i=s.rfind('</body>'); s=s[:i]+f'<script src="{pre}assets/cart.js" defer></script>\n'+s[i:]
    open(_f,'w').write(s)
print('cart ok')
