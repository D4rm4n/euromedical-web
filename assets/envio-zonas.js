/* Cálculo de envío compartido (navegador y Worker). E = envios.json */
(function(root){
const n=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
function zona(E,dep,mun,rural){
  if(rural)return 'remoto';
  const d=n(dep),m=n(mun);
  if(!d||!m)return null;
  if(E.bogota.some(c=>n(c)===m)&&(d.startsWith('bogota')||d==='cundinamarca'))return 'bogota';
  if(E.remoto_departamentos.some(x=>n(x)===d))return 'remoto';
  const has=t=>Object.entries(t).some(([k,v])=>n(k)===d&&v.some(c=>n(c)===m));
  if(has(E.cercano))return 'cercano';
  if(has(E.principal))return 'principal';
  return 'remoto';
}
function envio(E,subtotal,dep,mun,rural){
  const z=zona(E,dep,mun,rural);if(!z)return null;
  let costo=E.tarifas[z];const sobre=subtotal>E.gratis_desde;
  if(sobre)costo=z==='remoto'?Math.round(costo*(1-E.descuento_remoto_sobre_umbral)):0;
  return {zona:z,costo,gratis:costo===0,descuento:sobre&&z==='remoto'};
}
const api={zona,envio};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EMEnvio=api;
})(typeof self!=='undefined'?self:this);
