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

  var BULB_COLORS = ["r", "y", "g", "b", "w", "r", "y", "g"];

  function baubleSvg(color, cap) {
    return (
      '<svg viewBox="0 0 22 44" aria-hidden="true" focusable="false">' +
      '<path d="M11 0 v12" stroke="#C9A45A" stroke-width="1.2" fill="none"/>' +
      '<rect x="8" y="11" width="6" height="4" rx="1" fill="#D6B26E"/>' +
      '<defs><radialGradient id="' + cap + '" cx="35%" cy="30%"><stop offset="0%" stop-color="#fff"/><stop offset="55%" stop-color="' + color + '"/><stop offset="100%" stop-color="' + color + '"/></radialGradient></defs>' +
      '<circle cx="11" cy="28" r="11" fill="url(#' + cap + ')"/>' +
      '<path d="M11 18.5 a9.5 9.5 0 0 1 0 19" fill="none" stroke="#fff" stroke-width=".6" opacity=".35"/>' +
      '<circle cx="8" cy="24" r="2.1" fill="#fff" opacity=".4"/>' +
      "</svg>"
    );
  }

  var TREE_SVG =
    '<svg viewBox="0 0 160 240" role="img" aria-label="Árbol de Navidad">' +
    '<defs>' +
    '<radialGradient id="xmasStarGlow" cx="50%" cy="50%"><stop offset="0%" stop-color="#FFF8E7" stop-opacity=".95"/><stop offset="100%" stop-color="#F3D58F" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="xmasNeed1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B7A55"/><stop offset="100%" stop-color="#1A3F2C"/></linearGradient>' +
    '<linearGradient id="xmasNeed2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4A9466"/><stop offset="100%" stop-color="#1E4A34"/></linearGradient>' +
    '<linearGradient id="xmasNeed3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#57A572"/><stop offset="100%" stop-color="#24583C"/></linearGradient>' +
    '<linearGradient id="xmasNeed4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#64B57F"/><stop offset="100%" stop-color="#2A6344"/></linearGradient>' +
    '<radialGradient id="xmasOrnR" cx="35%" cy="30%"><stop offset="0%" stop-color="#FFD0D0"/><stop offset="100%" stop-color="#B83232"/></radialGradient>' +
    '<radialGradient id="xmasOrnG" cx="35%" cy="30%"><stop offset="0%" stop-color="#FFF0B0"/><stop offset="100%" stop-color="#C9A227"/></radialGradient>' +
    '<radialGradient id="xmasOrnB" cx="35%" cy="30%"><stop offset="0%" stop-color="#D6ECFF"/><stop offset="100%" stop-color="#2F6FB3"/></radialGradient>' +
    '<radialGradient id="xmasOrnE" cx="35%" cy="30%"><stop offset="0%" stop-color="#FFE8F0"/><stop offset="100%" stop-color="#9B3A6B"/></radialGradient>' +
    "</defs>" +
    '<ellipse cx="80" cy="226" rx="36" ry="7" fill="rgba(0,0,0,.28)"/>' +
    '<path d="M80 40 L114 86 L100 80 L80 88 L60 80 L46 86 Z" fill="url(#xmasNeed1)"/>' +
    '<path d="M80 62 L128 124 L108 116 L80 126 L52 116 L32 124 Z" fill="url(#xmasNeed2)"/>' +
    '<path d="M80 96 L138 164 L114 154 L80 166 L46 154 L22 164 Z" fill="url(#xmasNeed3)"/>' +
    '<path d="M80 132 L148 206 L120 194 L80 208 L40 194 L12 206 Z" fill="url(#xmasNeed4)"/>' +
    '<rect x="73" y="206" width="14" height="22" rx="2" fill="#6B3E1F"/>' +
    '<rect x="71" y="204" width="18" height="5" rx="1.5" fill="#8A5428"/>' +
    /* baubles */
    '<circle cx="66" cy="96" r="5.5" fill="url(#xmasOrnR)"/>' +
    '<circle cx="98" cy="112" r="5" fill="url(#xmasOrnG)"/>' +
    '<circle cx="54" cy="148" r="6" fill="url(#xmasOrnB)"/>' +
    '<circle cx="108" cy="154" r="5.5" fill="url(#xmasOrnR)"/>' +
    '<circle cx="78" cy="168" r="5" fill="url(#xmasOrnE)"/>' +
    '<circle cx="44" cy="186" r="6" fill="url(#xmasOrnG)"/>' +
    '<circle cx="116" cy="190" r="5.5" fill="url(#xmasOrnB)"/>' +
    '<circle cx="86" cy="128" r="4.5" fill="url(#xmasOrnG)"/>' +
    /* twinkling lights */
    '<circle class="xmas-tlight" cx="80" cy="78" r="2.2" fill="#FFF4C2"/>' +
    '<circle class="xmas-tlight" cx="58" cy="118" r="2.2" fill="#FF8A8A"/>' +
    '<circle class="xmas-tlight" cx="104" cy="130" r="2.2" fill="#B6F0C8"/>' +
    '<circle class="xmas-tlight" cx="70" cy="150" r="2.2" fill="#C5E1FF"/>' +
    '<circle class="xmas-tlight" cx="96" cy="176" r="2.2" fill="#FFF4C2"/>' +
    '<circle class="xmas-tlight" cx="60" cy="188" r="2.2" fill="#FF8A8A"/>' +
    '<circle class="xmas-tlight" cx="92" cy="96" r="2.2" fill="#B6F0C8"/>' +
    '<circle class="xmas-tlight" cx="48" cy="168" r="2.2" fill="#FFF4C2"/>' +
    '<circle class="xmas-tlight" cx="122" cy="200" r="2.2" fill="#C5E1FF"/>' +
    /* shining star */
    '<circle class="xmas-star-halo" cx="80" cy="20" r="22" fill="url(#xmasStarGlow)"/>' +
    '<polygon class="xmas-tree-star" fill="#F8E7A0" stroke="#E8C85A" stroke-width=".8" points="80,4 84.2,14.8 95.8,15.2 86.6,22.2 90.4,33.5 80,27 69.6,33.5 73.4,22.2 64.2,15.2 75.8,14.8"/>' +
    "</svg>";

  var MINI_TREE =
    '<svg viewBox="0 0 40 52" aria-hidden="true" focusable="false">' +
    '<circle class="xmas-star-halo" cx="20" cy="7" r="8" fill="#F8E7A0" opacity=".55"/>' +
    '<polygon class="xmas-tree-star" fill="#FFE9A0" stroke="#F3D58F" stroke-width=".5" points="20,1 21.6,5.1 26.2,5.2 22.5,7.8 23.9,12.2 20,9.6 16.1,12.2 17.5,7.8 13.8,5.2 18.4,5.1"/>' +
    '<path d="M20 12 L31 28 H9 Z" fill="#5CB077"/>' +
    '<path d="M20 20 L33 41 H7 Z" fill="#3E9A62"/>' +
    '<rect x="18" y="40" width="4" height="8" fill="#8A5428"/>' +
    '<circle cx="16" cy="26" r="1.8" fill="#FF6B6B"/>' +
    '<circle cx="24" cy="30" r="1.8" fill="#FFE08A"/>' +
    '<circle cx="18" cy="35" r="1.8" fill="#7EC2FF"/>' +
    "</svg>";

  function injectLights(header) {
    if (!header || header.querySelector(".xmas-lights")) return;
    var bar = document.createElement("div");
    bar.className = "xmas-lights";
    bar.setAttribute("aria-hidden", "true");
    var cord = document.createElement("span");
    cord.className = "xmas-lights-cord";
    bar.appendChild(cord);
    var n = mobile ? 18 : 40;
    for (var i = 0; i < n; i++) {
      var b = document.createElement("span");
      b.className = "xmas-bulb xmas-bulb-" + BULB_COLORS[i % BULB_COLORS.length];
      b.style.left = ((i + 0.5) / n * 100).toFixed(2) + "%";
      bar.appendChild(b);
    }
    header.appendChild(bar);
  }

  function injectHangs(header) {
    if (!header || header.querySelector(".xmas-hangs")) return;
    var wrap = document.createElement("div");
    wrap.className = "xmas-hangs";
    wrap.setAttribute("aria-hidden", "true");
    var desktop = [
      { x: "4%", color: "#C43C3C", id: "xh1", h: 38 },
      { x: "10%", color: "#D6B26E", id: "xh2", h: 46 },
      { x: "15.5%", color: "#2E8A54", id: "xh3", h: 34, wide: true },
      { x: "84.5%", color: "#4A90D9", id: "xh4", h: 36, wide: true },
      { x: "90%", color: "#C43C3C", id: "xh5", h: 44 },
      { x: "96%", color: "#D6B26E", id: "xh6", h: 32 }
    ];
    var mobilePos = [
      { x: "5%", color: "#C43C3C", id: "xh1", h: 30 },
      { x: "95%", color: "#D6B26E", id: "xh2", h: 34 }
    ];
    var items = mobile ? mobilePos : desktop;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var el = document.createElement("span");
      el.className = "xmas-hang" + (it.wide ? " xmas-hang-wide" : "");
      el.style.left = it.x;
      el.style.height = it.h + "px";
      el.innerHTML = baubleSvg(it.color, it.id);
      wrap.appendChild(el);
    }
    header.appendChild(wrap);
  }

  function injectBanner() {
    if (document.querySelector(".xmas-banner")) return;
    var header = document.querySelector(".site-header");
    var banner = document.createElement("div");
    banner.className = "xmas-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Saludo de Navidad");
    banner.innerHTML =
      '<div class="xmas-banner-in">' +
      '<span class="xmas-banner-tree">' + MINI_TREE + "</span>" +
      "<p>En esta Navidad, regala salud a los tuyos y comparte en familia 🎄</p>" +
      "</div>";
    if (header && header.parentNode) {
      header.insertAdjacentElement("afterend", banner);
    } else {
      var skip = document.querySelector("a.skip");
      if (skip && skip.parentNode) skip.insertAdjacentElement("afterend", banner);
      else document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  function injectTree() {
    var hero = document.querySelector(".wow-hero");
    if (!hero || hero.querySelector(".xmas-tree-wrap")) return;
    var wrap = document.createElement("div");
    wrap.className = "xmas-tree-wrap";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = TREE_SVG + '<p class="xmas-tree-msg">de parte de Euromedical</p>';
    hero.appendChild(wrap);
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
      var flakes = layer.children;
      var state = document.hidden ? "paused" : "running";
      for (var j = 0; j < flakes.length; j++) flakes[j].style.animationPlayState = state;
    });
  }

  onReady(function () {
    var header = document.querySelector(".site-header");
    injectLights(header);
    injectHangs(header);
    injectBanner();
    injectTree();
    injectSnow();
  });
})();
