/* Ambiente navideño Euromedical (noviembre–enero).
   Para apagarlo por completo: ponga EUROMEDICAL_XMAS = false, o quite
   assets/christmas.css y este archivo de todas las páginas.
   Ver /NAVIDAD.md
*/
(function () {
  var EUROMEDICAL_XMAS = true;
  if (!EUROMEDICAL_XMAS) return;

  var root = document.documentElement;
  root.classList.add("xmas");

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobile = window.matchMedia && window.matchMedia("(max-width: 700px)").matches;

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  var BAUBLE_L =
    '<svg viewBox="0 0 22 42" aria-hidden="true" focusable="false">' +
    "<defs><radialGradient id=\"xmasBl\" cx=\"35%\" cy=\"30%\"><stop offset=\"0%\" stop-color=\"#fff\"/><stop offset=\"100%\" stop-color=\"#8E2A2A\"/></radialGradient></defs>" +
    '<path d="M11 0 v10" stroke="#C9A45A" stroke-width="1.2" fill="none"/>' +
    '<rect x="8" y="9" width="6" height="4" rx="1" fill="#D6B26E"/>' +
    '<circle cx="11" cy="26" r="11" fill="#8E2A2A"/>' +
    '<circle cx="11" cy="26" r="11" fill="url(#xmasBl)" fill-opacity=".45"/>' +
    '<path d="M11 16.5 a9.5 9.5 0 0 1 0 19" fill="none" stroke="#F3D58F" stroke-width=".7" opacity=".55"/>' +
    '<circle cx="8" cy="22" r="2.2" fill="#fff" opacity=".35"/>' +
    "</svg>";

  var BAUBLE_R =
    '<svg viewBox="0 0 22 42" aria-hidden="true" focusable="false">' +
    "<defs><radialGradient id=\"xmasGl\" cx=\"35%\" cy=\"30%\"><stop offset=\"0%\" stop-color=\"#c8f0d4\"/><stop offset=\"100%\" stop-color=\"#1B3D30\"/></radialGradient></defs>" +
    '<path d="M11 0 v10" stroke="#C9A45A" stroke-width="1.2" fill="none"/>' +
    '<rect x="8" y="9" width="6" height="4" rx="1" fill="#D6B26E"/>' +
    '<circle cx="11" cy="26" r="11" fill="#1B3D30"/>' +
    '<circle cx="11" cy="26" r="11" fill="url(#xmasGl)" fill-opacity=".55"/>' +
    '<path d="M11 16.5 a9.5 9.5 0 0 1 0 19" fill="none" stroke="#8BE0A8" stroke-width=".7" opacity=".5"/>' +
    '<circle cx="8" cy="22" r="2.2" fill="#fff" opacity=".35"/>' +
    '<polygon points="11,18 12.1,21 15.4,21 12.7,23 13.8,26 11,24.2 8.2,26 9.3,23 6.6,21 9.9,21" fill="#F3D58F"/>' +
    "</svg>";


  function injectBanner() {
    if (document.querySelector(".xmas-banner")) return;
    var header = document.querySelector(".site-header");
    var banner = document.createElement("div");
    banner.className = "xmas-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Saludo de Navidad");
    banner.innerHTML =
      '<div class="xmas-banner-in">' +
      '<p><span class="xmas-star" aria-hidden="true">✦</span> Feliz Navidad de parte de Euromedical <span class="xmas-star" aria-hidden="true">✦</span></p>' +
      "</div>" +
      '<span class="xmas-hang xmas-hang-l">' + BAUBLE_L + "</span>" +
      '<span class="xmas-hang xmas-hang-r">' + BAUBLE_R + "</span>";
    if (header && header.parentNode) {
      header.insertAdjacentElement("afterend", banner);
    } else {
      var skip = document.querySelector("a.skip");
      if (skip && skip.parentNode) skip.insertAdjacentElement("afterend", banner);
      else document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  function injectSnow() {
    if (reduce) return;
    if (document.querySelector(".xmas-snow")) return;
    var layer = document.createElement("div");
    layer.className = "xmas-snow";
    layer.setAttribute("aria-hidden", "true");
    var count = mobile ? 10 : 22;
    var html = "";
    for (var i = 0; i < count; i++) {
      var size = (mobile ? 2.5 : 3) + Math.random() * (mobile ? 2.5 : 4);
      var dur = (mobile ? 11 : 12) + Math.random() * 10;
      var delay = -(Math.random() * dur);
      var x = Math.random() * 100;
      var drift = Math.round((Math.random() * 50 - 25) * 10) / 10;
      html +=
        '<span class="xmas-flake" style="--s:' +
        size.toFixed(1) +
        "px;--d:" +
        dur.toFixed(1) +
        "s;--delay:" +
        delay.toFixed(1) +
        "s;--x:" +
        x.toFixed(2) +
        "%;--drift:" +
        drift +
        'px"></span>';
    }
    layer.innerHTML = html;
    document.body.appendChild(layer);

    document.addEventListener("visibilitychange", function () {
      layer.style.animationPlayState = document.hidden ? "paused" : "running";
      var flakes = layer.children;
      for (var j = 0; j < flakes.length; j++) {
        flakes[j].style.animationPlayState = document.hidden ? "paused" : "running";
      }
    });
  }

  onReady(function () {
    injectBanner();
    injectSnow();
  });
})();
