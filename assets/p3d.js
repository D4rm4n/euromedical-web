(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const cards=[...document.querySelectorAll('.pcard')];if(!cards.length)return;
const set=(c,x,y)=>{c.style.setProperty('--ry',(x*22)+'deg');c.style.setProperty('--rx',(-y*16)+'deg');c.style.setProperty('--gx',(50+x*60)+'%');c.style.setProperty('--gy',(40+y*60)+'%')};
if(matchMedia('(pointer:fine)').matches){cards.forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.classList.add('p3d-on');set(c,(e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5)});c.addEventListener('pointerleave',()=>{c.classList.remove('p3d-on');set(c,0,0)})});return}
// touch: scroll-driven tilt + device orientation when available
let ox=0,oy=0,tk=false;
addEventListener('deviceorientation',e=>{if(e.gamma==null)return;ox=Math.max(-1,Math.min(1,e.gamma/30))*.5;oy=Math.max(-1,Math.min(1,(e.beta-45)/30))*.5;req()},{passive:true});
function upd(){tk=false;const vh=innerHeight,vw=innerWidth;for(const c of cards){const r=c.getBoundingClientRect();if(r.bottom<0||r.top>vh||r.right<0||r.left>vw)continue;const py=(r.top+r.height/2-vh/2)/vh,px=(r.left+r.width/2-vw/2)/vw;set(c,ox+px*.6,oy+py*.5)}}
function req(){if(!tk){tk=true;requestAnimationFrame(upd)}}
addEventListener('scroll',req,{passive:true});document.querySelectorAll('.car-track').forEach(t=>t.addEventListener('scroll',req,{passive:true}));upd();
})();
