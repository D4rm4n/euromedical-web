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
