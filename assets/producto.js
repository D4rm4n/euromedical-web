(()=>{const z=document.querySelector('[data-zoom]');if(!z)return;
const pos=e=>{const r=z.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;z.style.setProperty('--zx',x*100+'%');z.style.setProperty('--zy',y*100+'%');return[x-.5,y-.5]};
if(matchMedia('(pointer:fine)').matches){z.addEventListener('pointermove',e=>{const[x,y]=pos(e);if(!z.classList.contains('is-z')){z.style.setProperty('--ry',x*14+'deg');z.style.setProperty('--rx',-y*10+'deg')}});
z.addEventListener('pointerleave',()=>{z.classList.remove('is-z');z.style.setProperty('--rx','0deg');z.style.setProperty('--ry','0deg')});
z.addEventListener('click',e=>{z.classList.toggle('is-z');pos(e)})}
else z.addEventListener('click',e=>{z.classList.toggle('is-z');pos(e)});})();
