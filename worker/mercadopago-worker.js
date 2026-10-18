/**
 * Euromedical Pharma – Cloudflare Worker para Mercado Pago Checkout Pro.
 * Secret requerido (NUNCA en el código):  wrangler secret put MP_ACCESS_TOKEN
 * Variables (wrangler.toml [vars]): SITE_ORIGIN, PRICES_URL, ENVIOS_URL
 *
 * POST /checkout  {items:[{id,cantidad}], comprador:{nombre,telefono,email,direccion,ciudad}}
 *   -> {init_point, id}   (el navegador redirige a init_point)
 * POST /webhook   notificaciones de Mercado Pago (consulta el pago con la API y lo registra en logs)
 * Los precios se leen de PRICES_URL (assets/precios.json del sitio); el precio que envía el navegador se ignora.
 */
const MP_API = 'https://api.mercadopago.com';

// ---- Envío: misma lógica que assets/envio-zonas.js, misma tabla (assets/envios.json) ----
const nz = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function zona(E, dep, mun, rural) {
  if (rural) return 'remoto';
  const d = nz(dep), m = nz(mun);
  if (!d || !m) return null;
  if (E.bogota.some(c => nz(c) === m) && (d.startsWith('bogota') || d === 'cundinamarca')) return 'bogota';
  if (E.remoto_departamentos.some(x => nz(x) === d)) return 'remoto';
  const has = t => Object.entries(t).some(([k, v]) => nz(k) === d && v.some(c => nz(c) === m));
  if (has(E.cercano)) return 'cercano';
  if (has(E.principal)) return 'principal';
  return 'remoto';
}
export function envio(E, subtotal, dep, mun, rural) {
  const z = zona(E, dep, mun, rural); if (!z) return null;
  let costo = E.tarifas[z]; const sobre = subtotal > E.gratis_desde;
  if (sobre) costo = z === 'remoto' ? Math.round(costo * (1 - E.descuento_remoto_sobre_umbral)) : 0;
  return { zona: z, costo, gratis: costo === 0, descuento: sobre && z === 'remoto' };
}

function cors(env, origin) {
  const allowed = [env.SITE_ORIGIN, 'https://www.euromedicalpharma.com.co'];
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : env.SITE_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}
const json = (data, status, headers) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } });
const clean = (v, max = 120) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);

async function checkout(request, env, h) {
  if (!env.MP_ACCESS_TOKEN) return json({ error: 'Pagos no configurados' }, 503, h);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'JSON inválido' }, 400, h); }
  const c = body.comprador || {};
  const comprador = {
    nombre: clean(c.nombre), telefono: clean(c.telefono, 20).replace(/[^0-9+]/g, ''),
    email: clean(c.email), direccion: clean(c.direccion, 200), ciudad: clean(c.ciudad, 80),
    departamento: clean(c.departamento, 80), rural: c.rural === true,
  };
  if (!comprador.nombre || !comprador.telefono || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(comprador.email) || !comprador.direccion || !comprador.ciudad || !comprador.departamento)
    return json({ error: 'Datos del comprador incompletos' }, 400, h);

  const [pr, er] = await Promise.all([fetch(env.PRICES_URL, { cf: { cacheTtl: 60 } }), fetch(env.ENVIOS_URL, { cf: { cacheTtl: 60 } })]);
  if (!pr.ok || !er.ok) return json({ error: 'No se pudo leer la lista de precios o envíos' }, 502, h);
  const tablaEnvios = await er.json();
  const catalogo = Object.fromEntries((await pr.json()).productos.map(p => [p.id, p]));

  const items = [];
  for (const it of Array.isArray(body.items) ? body.items.slice(0, 30) : []) {
    const p = catalogo[it.id];
    const q = Math.floor(Number(it.cantidad));
    if (!p || !(q >= 1 && q <= 99)) return json({ error: 'Producto o cantidad inválidos' }, 400, h);
    items.push({
      id: p.id, title: `${p.nombre} (${p.detalle})`, quantity: q, unit_price: Number(p.precio),
      currency_id: 'COP', picture_url: `${env.SITE_ORIGIN}/assets/img/products/${p.img}.webp`,
    });
  }
  if (!items.length) return json({ error: 'Carrito vacío' }, 400, h);
  const subtotal = items.reduce((a, i) => a + i.unit_price * i.quantity, 0);
  const env_ = envio(tablaEnvios, subtotal, comprador.departamento, comprador.ciudad, comprador.rural);
  if (!env_) return json({ error: 'Municipio inválido' }, 400, h);
  if (env_.costo > 0) items.push({ id: 'envio', title: `Envío a ${comprador.ciudad}${comprador.rural ? ' (zona rural)' : ''}`, quantity: 1, unit_price: env_.costo, currency_id: 'COP' });

  const ref = 'EM-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomUUID().slice(0, 4).toUpperCase();
  const [first, ...rest] = comprador.nombre.split(' ');
  const pref = {
    items,
    payer: {
      name: first, surname: rest.join(' '), email: comprador.email,
      phone: { number: comprador.telefono },
      address: { street_name: comprador.direccion },
    },
    shipments: { receiver_address: { street_name: comprador.direccion, city_name: comprador.ciudad, state_name: comprador.departamento } },
    back_urls: {
      success: `${env.SITE_ORIGIN}/gracias.html?estado=aprobado`,
      pending: `${env.SITE_ORIGIN}/gracias.html?estado=pendiente`,
      failure: `${env.SITE_ORIGIN}/gracias.html?estado=rechazado`,
    },
    auto_return: 'approved',
    external_reference: ref,
    statement_descriptor: 'EUROMEDICAL',
    notification_url: new URL('/webhook', request.url).toString(),
    metadata: { ciudad: comprador.ciudad, departamento: comprador.departamento, rural: comprador.rural, telefono: comprador.telefono, direccion: comprador.direccion, subtotal, envio: env_.costo, zona_envio: env_.zona },
  };
  const r = await fetch(`${MP_API}/checkout/preferences`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`, 'Content-Type': 'application/json', 'X-Idempotency-Key': ref },
    body: JSON.stringify(pref),
  });
  const j = await r.json();
  if (!r.ok) { console.log('MP error', r.status, JSON.stringify(j)); return json({ error: 'Mercado Pago rechazó la solicitud' }, 502, h); }
  return json({ id: j.id, init_point: j.init_point, referencia: ref, subtotal, envio: env_.costo, total: subtotal + env_.costo }, 200, h);
}

async function webhook(request, env) {
  const url = new URL(request.url);
  let id = url.searchParams.get('data.id') || url.searchParams.get('id');
  let type = url.searchParams.get('type') || url.searchParams.get('topic');
  try { const b = await request.json(); id = b?.data?.id || id; type = b?.type || type; } catch {}
  if (type === 'payment' && id && env.MP_ACCESS_TOKEN) {
    const r = await fetch(`${MP_API}/v1/payments/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}` } });
    if (r.ok) {
      const p = await r.json();
      console.log('PAGO', JSON.stringify({ id: p.id, estado: p.status, ref: p.external_reference, total: p.transaction_amount, metodo: p.payment_method_id, email: p.payer?.email }));
      // Opcional: guardar en KV / enviar aviso por correo aquí.
    }
  }
  return new Response('ok');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const h = cors(env, request.headers.get('Origin'));
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    if (request.method === 'POST' && url.pathname === '/checkout') return checkout(request, env, h);
    if (request.method === 'POST' && url.pathname === '/webhook') return webhook(request, env);
    return json({ ok: true, servicio: 'pagos Euromedical' }, 200, h);
  },
};
