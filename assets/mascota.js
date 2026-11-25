/* Doctor Albert — ayudante de preguntas frecuentes (sin IA, sin servidor).
   Oso polar con gorra VitaZinc y bata Euromedical.
   El include ya está en todas las páginas (assets/mascota.css|js?v=20261124;
   en /blog/, ../assets/...).
*/
(function () {
  "use strict";

  /* Un solo lugar para cambiar el nombre */
  const MASCOTA_NOMBRE = "Doctor Albert";

  const WA_URL = "https://wa.me/573186995645";
  const ML_URL = "https://listado.mercadolibre.com.co/_CustId_264996991";
  const GREETING = "Hola, soy el " + MASCOTA_NOMBRE + " 🐻‍❄️ ¿En qué te puedo ayudar?";

  function siteRoot() {
    const el = document.querySelector('script[src*="mascota.js"]');
    if (el) {
      return (el.getAttribute("src") || "").replace(/assets\/mascota\.js(\?.*)?$/, "");
    }
    return /\/blog\//.test(location.pathname) ? "../" : "";
  }

  function mascotaAvatar(mode) {
    const src = siteRoot() + "assets/mascota-albert.webp?v=20261125a";
    return (
      '<img class="mascota-avatar mascota-avatar-' + mode + '" src="' + src +
      '" alt="" width="544" height="800" decoding="async" draggable="false">'
    );
  }

  function waIcon() {
    return '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.24 8.24 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z"/></svg>';
  }

  function faqs(base) {
    const p = function (href) { return base + href; };
    return [
      {
        q: "¿Son sin azúcar?",
        a:
          "<p>Sí 😊 Todos nuestros complementos nutricionales son sin azúcar.</p>"
      },
      {
        q: "¿Cómo compro?",
        a:
          "<p>Puedes comprar aquí en la página, en nuestra tienda de MercadoLibre o por WhatsApp. También estamos en Falabella.</p>" +
          "<ul>" +
            "<li><a href=\"" + p("productos.html") + "\">Ver productos</a></li>" +
            "<li><a href=\"" + p("donde-comprar.html") + "\">Dónde comprar</a></li>" +
            "<li><a href=\"" + ML_URL + "\" target=\"_blank\" rel=\"noopener\">Tienda en MercadoLibre ↗</a></li>" +
          "</ul>" +
          "<p>Si quieres, te oriento por WhatsApp.</p>"
      },
      {
        q: "¿Hacen envíos?",
        a:
          "<p>Sí, enviamos a toda Colombia. En la tienda web el envío es gratis en compras desde $100.000. Si compras por MercadoLibre, el envío se hace con MercadoLibre.</p>" +
          "<p>Puedes ver los detalles en <a href=\"" + p("politica-de-devoluciones.html") + "\">envíos y devoluciones</a>.</p>"
      },
      {
        q: "¿Qué producto es para mí?",
        a:
          "<p>Te dejo una guía rápida (son complementos nutricionales, no medicamentos):</p>" +
          "<ul>" +
            "<li><strong>Niños</strong> (1 a 12 años): <a href=\"" + p("vitazinc-f-junior-400-g.html") + "\">VitaZinc-F Junior</a></li>" +
            "<li><strong>Adultos:</strong> <a href=\"" + p("vitazinc-f-adultos-400-g.html") + "\">VitaZinc-F Adultos</a></li>" +
            "<li><strong>Adultos mayores (50+):</strong> <a href=\"" + p("vitazinc-f-silver-400-g.html") + "\">VitaZinc-F Silver</a></li>" +
            "<li><strong>Deportistas:</strong> <a href=\"" + p("vitazinc-f-proteina-400-g.html") + "\">VitaZinc-F Proteína</a> y <a href=\"" + p("creatina-monohidratada.html") + "\">creatina (materia prima)</a></li>" +
            "<li><strong>Memoria y concentración:</strong> <a href=\"" + p("vitazinc-f-fosforo.html") + "\">VitaZinc-F Fósforo</a>, un complemento que apoya tu día a día.</li>" +
          "</ul>" +
          "<p>Si no estás seguro, escríbenos por WhatsApp y te ayudamos a elegir.</p>"
      },
      {
        q: "¿Tienen registro sanitario?",
        a:
          "<p>Sí, nuestros productos cuentan con registro sanitario. Son complementos nutricionales: no son medicamentos y no reemplazan una alimentación balanceada.</p>"
      },
      {
        q: "¿Dónde encuentro más información?",
        a:
          "<p>En nuestro <a href=\"" + p("blog.html") + "\">blog</a> te contamos más sobre nutrición y nuestros complementos. Si tienes una pregunta puntual, también puedes escribirnos por WhatsApp.</p>"
      }
    ];
  }

  function init() {
    if (document.getElementById("mascota-root")) return;
    const base = siteRoot();
    const items = faqs(base);
    const root = document.createElement("div");
    root.id = "mascota-root";
    root.className = "mascota-root";

    const panelId = "mascota-panel";
    const hint = document.createElement("div");
    hint.className = "mascota-hint";
    hint.hidden = true;
    hint.textContent = "¿Te ayudo?";

    const panel = document.createElement("div");
    panel.id = panelId;
    panel.className = "mascota-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-labelledby", "mascota-title");
    panel.innerHTML =
      '<div class="mascota-head">' +
        mascotaAvatar("full") +
        '<div class="mascota-head-txt">' +
          '<strong id="mascota-title">' + MASCOTA_NOMBRE + "</strong>" +
          "<span>Ayudante Euromedical</span>" +
        "</div>" +
        '<button type="button" class="mascota-close" aria-label="Cerrar">&times;</button>' +
      "</div>" +
      '<div class="mascota-body">' +
        '<div class="mascota-msg" id="mascota-greeting">' + GREETING + "</div>" +
        '<div class="mascota-faqs" id="mascota-faqs"></div>' +
        '<div class="mascota-answer" id="mascota-answer" hidden>' +
          '<button type="button" class="mascota-volver" id="mascota-volver">← Volver</button>' +
          '<div class="mascota-msg" id="mascota-answer-text"></div>' +
        "</div>" +
      "</div>" +
      '<div class="mascota-foot">' +
        '<a class="mascota-wa" href="' + WA_URL + '" target="_blank" rel="noopener"> ' +
          waIcon() + "<span>Hablar por WhatsApp</span></a>" +
      "</div>";

    const faqsWrap = panel.querySelector("#mascota-faqs");
    items.forEach(function (item, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mascota-faq";
      btn.textContent = item.q;
      btn.setAttribute("data-faq", String(i));
      faqsWrap.appendChild(btn);
    });

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mascota-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", panelId);
    toggle.setAttribute("aria-label", "Abrir ayudante " + MASCOTA_NOMBRE);
    toggle.innerHTML = mascotaAvatar("btn");

    root.appendChild(hint);
    root.appendChild(panel);
    root.appendChild(toggle);
    document.body.appendChild(root);

    const answerBox = panel.querySelector("#mascota-answer");
    const answerText = panel.querySelector("#mascota-answer-text");
    const greeting = panel.querySelector("#mascota-greeting");
    const volver = panel.querySelector("#mascota-volver");
    const closeBtn = panel.querySelector(".mascota-close");
    let lastFocus = null;

    function showMenu() {
      faqsWrap.hidden = false;
      answerBox.hidden = true;
      greeting.hidden = false;
    }

    function open() {
      lastFocus = document.activeElement;
      root.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      hint.hidden = true;
      showMenu();
      closeBtn.focus();
    }

    function close() {
      root.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      showMenu();
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      else toggle.focus();
    }

    function showAnswer(i) {
      const item = items[i];
      if (!item) return;
      greeting.hidden = true;
      faqsWrap.hidden = true;
      answerBox.hidden = false;
      answerText.innerHTML = item.a;
      volver.focus();
    }

    toggle.addEventListener("click", function () {
      if (root.classList.contains("is-open")) close();
      else open();
    });
    closeBtn.addEventListener("click", close);
    volver.addEventListener("click", function () {
      showMenu();
      faqsWrap.querySelector(".mascota-faq").focus();
    });
    faqsWrap.addEventListener("click", function (ev) {
      const btn = ev.target.closest(".mascota-faq");
      if (!btn) return;
      showAnswer(Number(btn.getAttribute("data-faq")));
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && root.classList.contains("is-open")) {
        ev.preventDefault();
        close();
      }
    });
    document.addEventListener("pointerdown", function (ev) {
      if (!root.classList.contains("is-open")) return;
      if (!root.contains(ev.target) && ev.target !== toggle) close();
    });

    /* Hint de bienvenida (no se muestra en la vista previa ?mascota-preview=1) */
    const skipHint = /(?:\?|&)mascota-preview=1(?:&|$)/.test(location.search) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      if (!skipHint && !sessionStorage.getItem("mascota-hint-seen")) {
        window.setTimeout(function () {
          if (!root.classList.contains("is-open")) {
            hint.hidden = false;
            sessionStorage.setItem("mascota-hint-seen", "1");
            window.setTimeout(function () { hint.hidden = true; }, 6000);
          }
        }, 4000);
      }
    } catch (e) { /* sessionStorage puede fallar en privado */ }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
