# Pagos con Mercado Pago (Checkout Pro) – Euromedical Pharma

El sitio (GitHub Pages) es estático. Este Worker de Cloudflare es el único "backend":
recibe el carrito, recalcula los precios desde `assets/precios.json` y el envío desde `assets/envios.json` (misma tabla que el carrito), crea la preferencia
de Checkout Pro con el token secreto y devuelve el enlace de pago (tarjetas, PSE, Nequi, Efecty).

## Despliegue
1. Mercado Pago: cuenta de vendedor (Colombia) → https://www.mercadopago.com.co/developers/panel/app → Crear aplicación ("Pagos online", Checkout Pro). Copiar el **Access Token de producción** (empieza por `APP_USR-`). Para pruebas, usar el de prueba (`TEST-`).
2. `npm i -g wrangler && wrangler login` (cuenta Cloudflare donde está el dominio).
3. En esta carpeta: `wrangler deploy` y luego `wrangler secret put MP_ACCESS_TOKEN` (pegar el token; nunca en el código ni en git).
4. (Recomendado) Dominio propio: descomentar `routes` en `wrangler.toml` y volver a `wrangler deploy` → `https://pagos.euromedicalpharma.com.co`.
5. En `assets/cart.js`, poner `checkoutUrl:'https://pagos.euromedicalpharma.com.co/checkout'` (o la URL `*.workers.dev`), reconstruir y publicar.
6. En el panel de Mercado Pago → Webhooks: URL `https://pagos.euromedicalpharma.com.co/webhook`, evento "Pagos". Ver pagos: `wrangler tail`.
7. Crear `gracias.html` (página de retorno) antes de activar.

## Plan B: links de pago
Sin Worker: en Mercado Pago → "Link de pago" crear un link por producto y ponerlo en `precios.json`
(campo `link`). Funciona por producto, no como carrito con varios artículos.

Si `checkoutUrl` está vacío, el carrito envía el pedido por WhatsApp (573186995645).
