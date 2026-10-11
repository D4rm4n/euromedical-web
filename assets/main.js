(function(){
  var t=document.querySelector('.nav-toggle'),m=document.getElementById('menu');
  if(t&&m){
    t.addEventListener('click',function(){var o=m.classList.toggle('is-open');t.setAttribute('aria-expanded',o);t.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú');});
    m.addEventListener('click',function(e){if(e.target.closest('a')){m.classList.remove('is-open');t.setAttribute('aria-expanded','false');}});
  }
  var chips=[].slice.call(document.querySelectorAll('.chip')),cards=[].slice.call(document.querySelectorAll('.pcard')),st=document.getElementById('filter-status');
  function filter(k){
    var n=0;
    cards.forEach(function(c){var show=k==='all'||c.dataset.line===k;c.hidden=!show;if(show)n++;});
    chips.forEach(function(c){var a=c.dataset.filter===k;c.classList.toggle('is-active',a);c.setAttribute('aria-pressed',a);});
    if(st)st.textContent=n+' productos';
  }
  chips.forEach(function(c){c.addEventListener('click',function(){filter(c.dataset.filter);});});
  document.querySelectorAll('[data-filter-link]').forEach(function(a){a.addEventListener('click',function(){filter(a.dataset.filterLink);});});
  var q=(location.search.match(/[?&]linea=(\w+)/)||[])[1];if(q&&chips.some(function(c){return c.dataset.filter===q;}))filter(q);
  var f=document.getElementById('contact-form');
  if(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    var g=function(n){return (f.elements[n].value||'').trim();},err=document.getElementById('form-error');
    if(!g('nombre')||!g('mensaje')){err.hidden=false;return;}
    err.hidden=true;
    var body='Nombre: '+g('nombre')+'\nTeléfono: '+g('telefono')+'\nCiudad: '+g('ciudad')+'\nSoy: '+g('tipo')+'\n\n'+g('mensaje');
    window.location.href='mailto:euromedicalpharma@gmail.com?subject='+encodeURIComponent('Mensaje desde la web - '+g('nombre'))+'&body='+encodeURIComponent(body);
  });}
  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();
(function(){
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  /* hero slider */
  var hs=document.querySelector('.hero-slider');
  if(hs){
    var S=[].slice.call(hs.querySelectorAll('.slide')),D=[].slice.call(hs.querySelectorAll('.sl-dot')),i=0,tm=null,DUR=7000,paused=RM,userPaused=false;
    var pb=hs.querySelector('.sl-pause');
    hs.style.setProperty('--sl-dur',DUR+'ms');
    function go(n){
      i=(n+S.length)%S.length;
      S.forEach(function(s,k){var a=k===i;s.classList.toggle('is-active',a);if(a){s.removeAttribute('aria-hidden');s.removeAttribute('inert');}else{s.setAttribute('aria-hidden','true');s.setAttribute('inert','');}});
      D.forEach(function(d,k){var a=k===i;d.classList.remove('is-active');if(a){void d.offsetWidth;d.classList.add('is-active');d.setAttribute('aria-current','true');}else d.removeAttribute('aria-current');});
      sched();
    }
    function sched(){clearTimeout(tm);if(!paused&&!userPaused)tm=setTimeout(function(){go(i+1);},DUR);}
    function setPause(p){paused=p;hs.classList.toggle('is-paused',p||userPaused);if(p||userPaused)clearTimeout(tm);else sched();}
    hs.querySelector('.sl-next').addEventListener('click',function(){go(i+1);});
    hs.querySelector('.sl-prev').addEventListener('click',function(){go(i-1);});
    D.forEach(function(d,k){d.addEventListener('click',function(){go(k);});});
    if(pb){if(RM){userPaused=true;pb.setAttribute('aria-pressed','true');pb.innerHTML='&#9654;';pb.setAttribute('aria-label','Reproducir carrusel');}
      pb.addEventListener('click',function(){userPaused=!userPaused;RM=false;paused=false;pb.setAttribute('aria-pressed',userPaused);pb.innerHTML=userPaused?'&#9654;':'&#10073;&#10073;';pb.setAttribute('aria-label',userPaused?'Reproducir carrusel':'Pausar carrusel');setPause(false);});}
    hs.addEventListener('mouseenter',function(){setPause(true);});
    hs.addEventListener('mouseleave',function(){setPause(RM);});
    hs.addEventListener('focusin',function(){setPause(true);});
    hs.addEventListener('focusout',function(){setPause(RM);});
    document.addEventListener('visibilitychange',function(){setPause(document.hidden||RM);});
    var x0=null,y0=0;
    hs.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY;},{passive:true});
    hs.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))go(i+(dx<0?1:-1));x0=null;},{passive:true});
    if(RM)hs.classList.add('is-paused');
    sched();
  }
  /* featured carousel */
  [].forEach.call(document.querySelectorAll('[data-carousel]'),function(c){
    var t=c.querySelector('.car-track'),p=c.querySelector('.car-prev'),n=c.querySelector('.car-next');
    function step(){var f=t.querySelector('.pcard');return f?f.getBoundingClientRect().width+18:300;}
    function upd(){p.disabled=t.scrollLeft<8;n.disabled=t.scrollLeft+t.clientWidth>=t.scrollWidth-8;}
    p.addEventListener('click',function(){t.scrollBy({left:-step(),behavior:RM?'auto':'smooth'});});
    n.addEventListener('click',function(){t.scrollBy({left:step(),behavior:RM?'auto':'smooth'});});
    t.addEventListener('scroll',function(){window.requestAnimationFrame(upd);},{passive:true});
    window.addEventListener('resize',upd);upd();
  });
  /* scroll reveals */
  var sel='.section-head,.lines-grid>*,.catalog-grid>.pcard:nth-child(-n+8),.car-track>.pcard,.promo-card,.why,.mv,.values li,.steps li,.timeline li,.maq-cta,.dist-card,.contact-form,.cnt,.about-copy,.ml-grid>*';
  var els=[].slice.call(document.querySelectorAll(sel)).filter(function(el){return !el.closest('.hero-slider');});
  if(!RM&&'IntersectionObserver' in window){
    var groups=new Map();
    els.forEach(function(el){var p=el.parentElement,k=groups.get(p)||0;el.style.setProperty('--rd',Math.min(k,5)*0.07+'s');groups.set(p,k+1);el.classList.add('reveal');});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(el){io.observe(el);});
  }
  /* counters */
  var cs=[].slice.call(document.querySelectorAll('[data-count]'));
  function run(el){var to=+el.dataset.count,fr=el.dataset.from?+el.dataset.from:0,t0=null,d=1400;
    function f(ts){if(!t0)t0=ts;var k=Math.min((ts-t0)/d,1),e=1-Math.pow(1-k,3);el.textContent=Math.round(fr+(to-fr)*e);if(k<1)requestAnimationFrame(f);}
    requestAnimationFrame(f);}
  if(!RM&&'IntersectionObserver' in window){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);co.unobserve(e.target);}});},{threshold:.6});
    cs.forEach(function(el){if(!el.closest('.slide:not(.is-active)'))co.observe(el);});
  }
})();
