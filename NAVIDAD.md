# Ambiente navideño

Decoración temporal (guirnalda de luces, saludo, adornos y nieve suave) para el sitio de Euromedical.

No cambia precios, fichas de producto ni textos de salud. No usa imágenes con copyright ni librerías externas.

## Cómo apagarlo

1. **Rápido:** en `assets/christmas.js`, cambie `EUROMEDICAL_XMAS` a `false`.
2. **Completo (recomendado al terminar la temporada):** quite de todas las páginas el `<link>` a `assets/christmas.css` y el `<script>` a `assets/christmas.js`, y (opcional) borre esos dos archivos y este `NAVIDAD.md`.

El JS añade la clase `xmas` en `<html>`. Todo el CSS navideño está bajo `html.xmas`, así que sin la clase o sin el CSS no queda rastro visual.

## Qué incluye

- `assets/christmas.css` — luces en el header, franja de saludo, acentos suaves en botones y hero.
- `assets/christmas.js` — inserta el banner «Feliz Navidad de parte de Euromedical», dos adornos SVG y una nieve ligera (`pointer-events: none`). Menos copos en móvil; sin nieve si el usuario pide `prefers-reduced-motion`.
