/* Carrito Euromedical: localStorage + Mercado Pago (Worker) o WhatsApp */
(()=>{
const CFG={checkoutUrl:'https://pagos.euromedicalpharma.com.co/checkout',wa:'573186995645'}; // checkoutUrl: URL del Worker, p. ej. https://pagos.euromedicalpharma.com.co/checkout (vacío = WhatsApp)
const base=document.querySelector('script[src*="cart.js"]').src.replace(/cart\.js.*$/,'');
const KEY='em-cart-v1',cop=n=>'$'+Math.round(n).toLocaleString('es-CO');
let ready=false,P={},E=null,MUN=[],cart=JSON.parse(localStorage.getItem(KEY)||'{}');
const save=()=>{localStorage.setItem(KEY,JSON.stringify(cart));render()};
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
// UI
const ui=document.createElement('div');ui.innerHTML=`
<button class="cart-fab" type="button" aria-label="Abrir carrito" aria-haspopup="dialog"><svg width="24" height="24" aria-hidden="true"><use href="#i-cart"/></svg><span class="cart-count" aria-live="polite">0</span></button>
<div class="cart-overlay" hidden></div>
<aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-t" aria-hidden="true" inert>
 <header class="cart-head"><h2 id="cart-t">Tu carrito</h2><button class="cart-x" type="button" aria-label="Cerrar carrito">✕</button></header>
 <div class="cart-view-items"><ul class="cart-list"></ul><p class="cart-empty">Tu carrito está vacío. Agrega productos para empezar.</p>
  <div class="cart-foot"><p class="cart-sub"><span>Subtotal</span><strong class="cart-total">$0</strong></p><p class="cart-note">El envío se calcula en el siguiente paso, según tu ciudad.</p><button class="btn btn-primary btn-block cart-next" type="button">Continuar con el pedido</button></div></div>
 <form class="cart-form" hidden novalidate>
  <button class="cart-back" type="button">← Volver al carrito</button>
  <label>Nombre completo<input name="nombre" required autocomplete="name"></label>
  <label>Teléfono / celular<input name="telefono" required inputmode="tel" autocomplete="tel" pattern="[0-9 +]{7,15}"></label>
  <label>Correo electrónico<input name="email" type="email" required autocomplete="email"></label>
  <label>Dirección de entrega<input name="direccion" required autocomplete="street-address"></label>
  <label>Departamento<select name="departamento" required><option value="">Selecciona…</option></select></label>
  <label>Municipio / ciudad<select name="ciudad" required disabled><option value="">Primero elige el departamento</option></select></label>
  <label class="cart-check"><input type="checkbox" name="rural"> Es zona rural / vereda</label>
  <div class="cart-sum"><p class="cart-line"><span>Subtotal</span><span class="cart-total">$0</span></p>
  <p class="cart-line cart-ship" hidden></p>
  <p class="cart-sub cart-grand" hidden><span>Total</span><strong class="cart-gt">$0</strong></p>
  <p class="cart-note cart-ship-note">Elige tu municipio para calcular el envío. Envío gratis en compras de más de $100.000 (zonas remotas: 50% de descuento).</p></div>
  <p class="cart-err" role="alert" hidden></p>
  <button class="btn btn-primary btn-block cart-pay" type="submit"></button>
  <p class="cart-note cart-pay-note"></p>
 </form>
</aside>`;document.body.append(...ui.children);
const $=s=>document.querySelector(s),dr=$('.cart-drawer'),ov=$('.cart-overlay'),form=$('.cart-form'),list=$('.cart-list');
const MP=!!CFG.checkoutUrl;
$('.cart-pay').textContent=MP?'Pagar con Mercado Pago':'Enviar pedido por WhatsApp';
$('.cart-pay-note').textContent=MP?'Tarjetas, PSE, Nequi y Efecty a través de Mercado Pago. Pago 100% seguro.':'Pronto podrás pagar en línea con Mercado Pago. Por ahora te enviamos el pedido por WhatsApp y te confirmamos el pago y el envío.';
let last;
function open(){last=document.activeElement;dr.classList.add('open');dr.setAttribute('aria-hidden','false');dr.inert=false;ov.hidden=false;requestAnimationFrame(()=>ov.classList.add('on'));document.body.style.overflow='hidden';$('.cart-x').focus()}
function close(){dr.classList.remove('open');dr.setAttribute('aria-hidden','true');dr.inert=true;ov.classList.remove('on');setTimeout(()=>ov.hidden=true,300);document.body.style.overflow='';showForm(false);last&&last.focus()}
function showForm(v){form.hidden=!v;$('.cart-view-items').hidden=v}
$('.cart-fab').onclick=open;$('.cart-x').onclick=close;ov.onclick=close;addEventListener('keydown',e=>{if(e.key==='Escape'&&dr.classList.contains('open'))close()});
$('.cart-next').onclick=()=>{showForm(true);loadGeo().then(renderShip);form.querySelector('input').focus()};
form.elements.departamento.addEventListener('change',e=>{const c=form.elements.ciudad,d=MUN.find(x=>x.departamento===e.target.value);c.innerHTML='<option value="">Selecciona tu municipio…</option>'+(d?d.ciudades.map(x=>`<option>${x}</option>`).join(''):'');c.disabled=!d;if(d&&d.ciudades.length===1)c.value=d.ciudades[0];renderShip()});
form.elements.ciudad.addEventListener('change',renderShip);form.elements.rural.addEventListener('change',renderShip);$('.cart-back').onclick=()=>showForm(false);
function ship(){if(!E||!window.EMEnvio)return null;const f=form.elements;return EMEnvio.envio(E,total(),f.departamento.value,f.ciudad.value,f.rural.checked)}
function renderShip(){const sh=ship(),l=$('.cart-ship'),g=$('.cart-grand');if(!sh){l.hidden=g.hidden=true;$('.cart-ship-note').hidden=false;return}
 const c=form.elements.ciudad.value;l.hidden=g.hidden=false;$('.cart-ship-note').hidden=true;
 l.innerHTML=sh.gratis?`<span>Envío a ${c}</span><strong class="ship-free">¡Envío GRATIS!</strong>`:`<span>Envío a ${c}${form.elements.rural.checked?' (zona rural)':''}</span><span>${cop(sh.costo)}${sh.descuento?' <em class="ship-off">50% dcto.</em>':''}</span>`;
 $('.cart-gt').textContent=cop(total()+sh.costo)}
function loadGeo(){if(E)return Promise.resolve();return Promise.all([fetch(base+'envios.json',{cache:'no-cache'}).then(r=>r.json()),fetch(base+'municipios.json').then(r=>r.json()),new Promise(ok=>{if(window.EMEnvio)return ok();const sc=document.createElement('script');sc.src=base+'envio-zonas.js';sc.onload=ok;document.head.append(sc)})]).then(([e,m])=>{E=e;MUN=m;const sel=form.elements.departamento;sel.insertAdjacentHTML('beforeend',m.map(d=>`<option>${d.departamento}</option>`).join(''))})}
function total(){return Object.entries(cart).reduce((s,[id,q])=>s+(P[id]?P[id].precio*q:0),0)}
function render(){if(ready)for(const id in cart)if(!P[id]||cart[id]<1)delete cart[id];
 const n=Object.entries(cart).filter(([i])=>!ready||P[i]).reduce((a,[,b])=>a+b,0),_=0;const __=Object.values(cart).reduce((a,b)=>a+b,0);$('.cart-count').textContent=n;$('.cart-fab').classList.toggle('has',n>0);
 list.innerHTML=Object.entries(cart).filter(([i])=>P[i]).map(([id,q])=>{const p=P[id];return `<li class="cart-item" data-id="${id}"><img src="${base}img/products/${p.img}.webp" alt="" width="64" height="64"><div><p class="ci-n">${p.nombre}</p><p class="ci-d">${p.detalle}</p><p class="ci-p">${cop(p.precio)}</p></div><div class="ci-q"><button type="button" data-d="-1" aria-label="Quitar uno de ${p.nombre}">−</button><input type="number" min="1" max="99" value="${q}" aria-label="Cantidad de ${p.nombre}"><button type="button" data-d="1" aria-label="Agregar uno de ${p.nombre}">+</button></div><button class="ci-del" type="button" aria-label="Eliminar ${p.nombre}">Eliminar</button></li>`}).join('');
 document.querySelectorAll('.cart-total').forEach(e=>e.textContent=cop(total()));
 $('.cart-empty').hidden=n>0;$('.cart-foot').hidden=n===0;if(!form.hidden)renderShip();}
list.addEventListener('click',e=>{const li=e.target.closest('.cart-item');if(!li)return;const id=li.dataset.id;if(e.target.dataset.d){cart[id]=Math.min(99,cart[id]+ +e.target.dataset.d);if(cart[id]<1)delete cart[id];save()}if(e.target.classList.contains('ci-del')){delete cart[id];save()}});
list.addEventListener('change',e=>{const li=e.target.closest('.cart-item');if(!li)return;const v=Math.max(0,Math.min(99,parseInt(e.target.value)||0));if(v)cart[li.dataset.id]=v;else delete cart[li.dataset.id];save()});
function add(id,btn){cart[id]=Math.min(99,(cart[id]||0)+1);save();const f=$('.cart-fab');f.classList.remove('bump');void f.offsetWidth;f.classList.add('bump');if(btn){const t=btn.querySelector('span');const o=t.textContent;t.textContent='¡Agregado!';setTimeout(()=>t.textContent=o,1300)}}
form.addEventListener('input',()=>{$('.cart-err').hidden=true});form.addEventListener('change',()=>{$('.cart-err').hidden=true});
if(!MP)$('.cart-pay').className='btn btn-wa btn-block cart-pay';
form.addEventListener('submit',async e=>{e.preventDefault();const err=$('.cart-err');err.hidden=true;
 if(!form.checkValidity()){err.textContent='Revisa los datos: todos los campos son obligatorios y el correo debe ser válido.';err.hidden=false;form.reportValidity();return}
 const d=Object.fromEntries(new FormData(form));d.rural=form.elements.rural.checked;const sh=ship();if(!sh){err.textContent='Elige tu departamento y municipio para calcular el envío.';err.hidden=false;return}d.envio=sh;const items=Object.entries(cart).map(([id,q])=>({id,cantidad:q}));if(!items.length)return;
 if(MP){const b=$('.cart-pay');b.disabled=true;b.textContent='Conectando con Mercado Pago…';
  try{const r=await fetch(CFG.checkoutUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items,comprador:{nombre:d.nombre,telefono:d.telefono,email:d.email,direccion:d.direccion,ciudad:d.ciudad,departamento:d.departamento,rural:d.rural}})});const j=await r.json();if(!r.ok||!j.init_point)throw new Error(j.error||'Error');location.href=j.init_point;return}
  catch(x){err.textContent='No pudimos conectar con Mercado Pago. Puedes enviar tu pedido por WhatsApp.';err.hidden=false;b.disabled=false;b.textContent='Pagar con Mercado Pago';waBtn(d);return}}
 sendWA(d)});
function msg(d){return `Hola Euromedical, quiero hacer este pedido:\n\n${Object.entries(cart).map(([id,q])=>`• ${q} x ${P[id].nombre} (${P[id].detalle}) — ${cop(P[id].precio*q)}`).join('\n')}\n\nSubtotal: ${cop(total())}\nEnvío a ${d.ciudad}${d.rural?' (zona rural)':''}: ${d.envio.gratis?'¡GRATIS!':cop(d.envio.costo)}\nTotal: ${cop(total()+d.envio.costo)}\n\nNombre: ${d.nombre}\nTeléfono: ${d.telefono}\nCorreo: ${d.email}\nDirección: ${d.direccion}\nMunicipio: ${d.ciudad}, ${d.departamento}${d.rural?' (zona rural / vereda)':''}`}
function sendWA(d){window.open(`https://wa.me/${CFG.wa}?text=${encodeURIComponent(msg(d))}`,'_blank','noopener')}
function waBtn(d){if(form.querySelector('.cart-wa-alt'))return;const a=document.createElement('button');a.type='button';a.className='btn btn-wa btn-block cart-wa-alt';a.textContent='Enviar pedido por WhatsApp';a.onclick=()=>sendWA(d);form.append(a)}
// botones en tarjetas
fetch(base+'precios.json',{cache:'no-cache'}).then(r=>r.json()).then(j=>{j.productos.forEach(p=>P[p.id]=p);ready=true;
 const by={};j.productos.forEach(p=>by[norm(p.nombre)]=p);
 document.querySelectorAll('.pcard, .promo-card, .pack-card').forEach(c=>{const h=c.querySelector('h3');if(!h)return;
  const size=(c.querySelector('.specs')||c.querySelector('.promo-detail')||{}).textContent||'';
  const ps=j.productos.filter(x=>norm(x.nombre)===norm(h.textContent)&&(x.pack||size.includes(x.presentacion)));const p=ps.find(x=>x.sabor&&size.includes(x.sabor))||ps.find(x=>!x.sabor);if(!p)return;
  const act=c.querySelector('.pcard-actions, .promo-actions');if(!act||act.querySelector('.btn-cart'))return;
  const b=document.createElement('button');b.type='button';b.className='btn btn-cart btn-sm btn-block';b.innerHTML=`<svg aria-hidden="true" width="18" height="18"><use href="#i-cart"/></svg><span>Agregar al carrito · ${cop(p.precio)}</span>`;b.onclick=()=>add(p.id,b);act.prepend(b)});
 render()}).catch(render);
render();
})();
