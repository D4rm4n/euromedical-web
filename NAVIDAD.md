# Ambiente navideño

Decoración temporal (guirnalda de luces de colores, saludo, adornos, nieve suave y, en el inicio, un árbol con estrella) para el sitio de Euromedical.

No cambia precios, fichas de producto ni textos de salud. No usa imágenes con copyright ni librerías externas.

## Cómo apagarlo

1. **Rápido:** en `assets/christmas.js`, cambie `EUROMEDICAL_XMAS` a `false`.
2. **Completo (recomendado al terminar la temporada):** quite de todas las páginas el `<link>` a `assets/christmas.css` y el `<script>` a `assets/christmas.js`, y (opcional) borre esos dos archivos y este `NAVIDAD.md`.

El JS añade la clase `xmas` en `<html>`. Todo el CSS navideño está bajo `html.xmas`, así que sin la clase o sin el CSS no queda rastro visual.

## Qué incluye

- `assets/christmas.css` — luces de colores en el header, franja de saludo, árbol y estrella, acentos suaves en botones y hero.
- `assets/christmas.js` — inserta el banner «En esta Navidad, regala salud a los tuyos y comparte en familia», adornos SVG, luces, nieve ligera (`pointer-events: none`) y, solo en la portada (escritorio), un árbol a un lado del hero con el lema «de parte de Euromedical». Menos copos y adornos en móvil; sin nieve ni destellos si el usuario pide `prefers-reduced-motion`.

## Banner de descuentos de fin de año

Franja promocional (roja, verde y dorada) que reemplaza al banner de Black Friday. No menciona precios ni porcentajes. El botón abre la tienda de MercadoLibre.

- Poner: `python3 tools/navidad_banner.py add` (también quita el banner de Black Friday si aún está)
- Quitar: `python3 tools/navidad_banner.py remove`

Esto es independiente del ambiente navideño (`assets/christmas.css` / `assets/christmas.js`). Al terminar la temporada, quite ambos.
