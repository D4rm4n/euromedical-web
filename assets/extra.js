(function(){
  var d=document,RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.documentElement.classList.add('js');
  var IO='IntersectionObserver' in window;
  /* reveals */
  var rv=[].slice.call(d.querySelectorAll('.rv'));
  var groups=new Map();
  rv.forEach(function(el){var p=el.parentElement,k=groups.get(p)||0;el.style.setProperty('--rd',Math.min(k,5)*0.08+'s');groups.set(p,k+1);});
  if(RM||!IO){rv.forEach(function(e){e.classList.add('is-in')});d.querySelectorAll('[data-story]').forEach(function(s){s.classList.add('is-solved')});}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -10% 0px',threshold:.12});
    rv.forEach(function(e){io.observe(e)});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-solved');so.unobserve(e.target);}})},{threshold:.45});
    d.querySelectorAll('[data-story]').forEach(function(s){so.observe(s)});
  }
  /* progress bar */
  if(!RM){var b=d.createElement('div');b.className='scroll-prog';b.setAttribute('aria-hidden','true');d.body.appendChild(b);var t=0;
    function up(){t=0;var h=d.documentElement,m=h.scrollHeight-h.clientHeight;b.style.transform='scaleX('+(m>0?h.scrollTop/m:0)+')';}
    addEventListener('scroll',function(){if(!t){t=1;requestAnimationFrame(up)}},{passive:true});up();}
  /* videos */
  function load(v){var s=v.querySelector('source[data-src]');if(s){s.src=s.dataset.src;s.removeAttribute('data-src');v.load();}}
  var all=[].slice.call(d.querySelectorAll('[data-vplayer]'));
  function pauseOthers(me){all.forEach(function(w){var v=w.querySelector('video');if(w!==me&&!v.paused){v.pause();}})}
  all.forEach(function(w){
    var v=w.querySelector('video'),pb=w.querySelector('.vf-play'),sb=w.querySelector('.vf-sound');
    v.addEventListener('play',function(){w.classList.add('is-playing')});
    v.addEventListener('pause',function(){w.classList.remove('is-playing')});
    function playSound(){load(v);v.muted=false;if(sb)sb.setAttribute('aria-pressed','true');pauseOthers(w);v.controls=!sb;v.play();}
    pb&&pb.addEventListener('click',playSound);
    sb&&sb.addEventListener('click',function(){var on=sb.getAttribute('aria-pressed')!=='true';load(v);v.muted=!on;sb.setAttribute('aria-pressed',on);sb.setAttribute('aria-label',on?'Silenciar':'Activar sonido');if(on){pauseOthers(w);v.play();}});
    v.addEventListener('click',function(){if(!v.paused&&sb){v.pause()}else if(v.paused&&sb){v.play()}});
    if(v.hasAttribute('data-autoplay')){
      var save=navigator.connection&&navigator.connection.saveData;
      if(RM||save||!IO){w.closest('.vfeat').classList.add('no-auto');return;}
      new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){load(v);var p=v.play();p&&p.catch(function(){w.closest('.vfeat').classList.add('no-auto')});}else if(!v.paused)v.pause();})},{threshold:.4}).observe(v);
    }
  });
  /* youtube lite */
  d.querySelectorAll('[data-yt]').forEach(function(y){y.addEventListener('click',function(){if(y.querySelector('iframe'))return;var f=d.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+y.dataset.yt+'?autoplay=1&rel=0';f.allow='autoplay; encrypted-media; picture-in-picture';f.allowFullscreen=true;f.title='Video de YouTube';y.appendChild(f);});});
})();
