# og-image (movido desde icons.py)
from PIL import Image, ImageDraw, ImageFont
import os
os.chdir('/workspace/euromedical-web')
MARK=Image.open('/workspace/euromedical-web-src/logo/euromedical-mark-1440.png').convert('RGBA')
og=Image.new('RGB',(1200,630)); d=ImageDraw.Draw(og)
for i in range(630):
    t=i/630; d.line([(0,i),(1200,i)],fill=tuple(int(a+(b-a)*t) for a,b in zip((21,101,192),(11,46,89))))
d.rounded_rectangle((60,50,280,200),radius=28,fill='white'); m=MARK.resize((180,105),Image.LANCZOS); og.paste(m,(80,72),m)
F=lambda s,b=True: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
d.text((70,250),'EUROMEDICAL',font=F(64),fill='white'); d.text((70,325),'PHARMA',font=F(64),fill='#F5B21B')
d.text((70,430),'Fabricantes de complementos nutricionales',font=F(28,False),fill='white')
d.text((70,470),'Bogotá · Fundada en 2009 · Fabricamos desde 2021',font=F(28,False),fill='#CFE4FA')
for (p,x,y) in [(19,690,70),(33,900,140),(28,770,320)]:
    t=Image.open(f'assets/img/products/p{p:02d}.webp').convert('RGB').resize((250,250),Image.LANCZOS)
    msk=Image.new('L',(250,250),0); ImageDraw.Draw(msk).rounded_rectangle((0,0,249,249),radius=26,fill=255)
    og.paste(t,(x,y),msk)
og.save('assets/img/og-image.jpg',quality=85)

exec(open('/workspace/euromedical-web/build/producto.py').read())
