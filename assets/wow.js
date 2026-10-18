(()=>{const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
const bar=document.createElement('div');bar.className='wow-bar';document.body.appendChild(bar);
// word reveal
const h=document.querySelector('.wow-words');if(h){const ws=h.textContent.trim().split(/\s+/);h.setAttribute('aria-label',h.textContent.trim());h.innerHTML=ws.map(w=>`<span class="w" aria-hidden="true">${w}</span>`).join('');
 const sp=[...h.children];sp.forEach((s,i)=>setTimeout(()=>s.classList.add('in'),RM?0:200+i*140));const hero=h.closest('.wow-hero');setTimeout(()=>hero.classList.add('ready'),RM?0:200);}
// particles
const cv=document.querySelector('.wow-particles');if(cv&&!RM){const c=cv.getContext('2d');let W,H,P=[];const fit=()=>{const d=Math.min(devicePixelRatio,2);W=cv.width=cv.offsetWidth*d;H=cv.height=cv.offsetHeight*d;const n=innerWidth<700?35:80;P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,r:(Math.random()*2+.6)*d,v:(Math.random()*.4+.15)*d,h:Math.random()<.7?'46,230,255':'255,197,49',a:Math.random()*.6+.2}))};fit();addEventListener('resize',fit);
 let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
 (function f(t){if(vis){c.clearRect(0,0,W,H);for(const p of P){p.y-=p.v;p.x+=Math.sin(t/1500+p.r)*.3;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}c.beginPath();c.arc(p.x,p.y,p.r,0,7);c.fillStyle=`rgba(${p.h},${p.a})`;c.shadowBlur=12;c.shadowColor=`rgba(${p.h},1)`;c.fill()}}requestAnimationFrame(f)})(0);}
// counters
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target,to=+el.dataset.wcount,fr=+(el.dataset.from||0);if(RM){el.textContent=to;return}const t0=performance.now();(function s(t){const k=Math.min((t-t0)/1600,1),q=1-Math.pow(1-k,3);el.textContent=Math.round(fr+(to-fr)*q);if(k<1)requestAnimationFrame(s)})(t0)}),{threshold:.5});
document.querySelectorAll('[data-wcount]').forEach(e=>io.observe(e));
// cinematic sections + stories lit
const cine=document.querySelectorAll('main>section:not(.wow-hero):not(.hero) .section-head, .vfeat-grid, .why-grid, .promo-grid, .wow-sugar-in');
const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io2.unobserve(e.target)}}),{threshold:.15});
if(!RM)cine.forEach(e=>{e.classList.add('wow-cine');io2.observe(e)});
const io3=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('lit'),RM?0:700)}),{threshold:.55});
document.querySelectorAll('.story.wow-gray').forEach(e=>io3.observe(e));
// 3D products on scroll
const tilts=[...document.querySelectorAll('.story-tin, .pcard img, .hero-visual img, .promo-media img')];tilts.forEach(e=>e.classList.add('wow-tilt'));
const bg=document.querySelector('.wow-bg');let tk=false;
function sc(){tk=false;const y=scrollY,vh=innerHeight;bar.style.transform=`scaleX(${y/(document.documentElement.scrollHeight-vh)})`;if(RM)return;
 if(bg&&y<vh*1.2)bg.style.transform=`scale(${1.08+y/vh*.25}) translateY(${y*.25}px)`;
 for(const e of tilts){const r=e.getBoundingClientRect();if(r.bottom<0||r.top>vh)continue;const p=(r.top+r.height/2-vh/2)/vh;e.style.transform=`perspective(800px) rotateY(${p*-28}deg) rotateX(${p*10}deg) translateY(${p*-18}px)`}}
addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(sc)}},{passive:true});sc();
// magnetic buttons
if(fine&&!RM)document.querySelectorAll('.btn, .wa-float').forEach(b=>{b.classList.add('mag');b.addEventListener('mousemove',ev=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(ev.clientX-r.left-r.width/2)*.25}px,${(ev.clientY-r.top-r.height/2)*.35}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')});
})();
