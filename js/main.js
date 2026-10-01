/* ========== VELOZ Sport · JavaScript ========== */

/* Camiseta SVG reutilizable: jersey(colorPrincipal, colorFranja) */
function jersey(c1, c2) {
  return `<svg viewBox="0 0 200 200" role="img" aria-label="Camiseta deportiva">
    <path d="M70 20 L40 35 L8 78 L40 98 L55 82 L55 182 L145 182 L145 82 L160 98 L192 78 L160 35 L130 20 C124 38 76 38 70 20Z" fill="${c1}"/>
    <rect x="55" y="104" width="90" height="22" fill="${c2}"/>
    <path d="M8 78 L40 98 L47 90 L18 66Z M192 78 L160 98 L153 90 L182 66Z" fill="${c2}"/>
    <path d="M70 20 C76 38 124 38 130 20" fill="none" stroke="${c2}" stroke-width="6"/>
  </svg>`;
}
document.querySelectorAll(".jersey[data-c1]").forEach(el => {
  el.innerHTML = jersey(el.dataset.c1, el.dataset.c2);
});

/* ---------- 1. Modo oscuro (se recuerda la elección) ---------- */
const themeBtn = document.getElementById("themeBtn");
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  if (themeBtn) {
    themeBtn.textContent = t === "dark" ? "Modo claro" : "Modo oscuro";
    themeBtn.setAttribute("aria-pressed", t === "dark");
  }
}
let saved = "light";
try { saved = localStorage.getItem("veloz-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch (e) {}
applyTheme(saved);
if (themeBtn) themeBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("veloz-theme", next); } catch (e) {}
});

/* ---------- 2. Menú móvil ---------- */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
if (menuBtn && nav) menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

/* ---------- 3. Carrusel del portafolio ---------- */
const track = document.getElementById("track");
if (track) {
  const items = [
    { bg: "#E6ECFF", c1: "#2236E0", c2: "#D8F43D", tag: "Running", t: "Colección Pista 26", d: "Camisetas ligeras con tejido que expulsa el sudor y costuras planas para carreras largas." },
    { bg: "#F1FBC8", c1: "#0F1B3D", c2: "#D8F43D", tag: "Fútbol", t: "Kit Club Atlético Norte", d: "Uniformes sublimados para 3 categorías: camiseta, short y medias, con nombre y número." },
    { bg: "#FFE5E6", c1: "#E5484D", c2: "#FFFFFF", tag: "Baloncesto", t: "Liga Urbana 3x3", d: "Camisetas sin mangas con ventilación en la espalda, hechas para jugar a ritmo alto." },
    { bg: "#E4F6EC", c1: "#1F8A55", c2: "#F5F7FB", tag: "Gimnasio", t: "Línea Fuerza", d: "Ropa de entrenamiento elástica para levantar, saltar y recuperarse sin que estorbe." },
    { bg: "#EEE7FF", c1: "#5B3FD0", c2: "#D8F43D", tag: "Ciclismo", t: "Equipo Ruta 100", d: "Maillots con bolsillos traseros y ajuste aerodinámico para salidas de fin de semana." }
  ];
  track.innerHTML = items.map(i => `
    <article class="slide">
      <div class="art" style="background:${i.bg}"><div class="jersey">${jersey(i.c1, i.c2)}</div></div>
      <div class="info"><span class="tag">${i.tag}</span><h3>${i.t}</h3><p>${i.d}</p></div>
    </article>`).join("");
  const dotsBox = document.getElementById("dots");
  let idx = 0;
  dotsBox.innerHTML = items.map((_, n) => `<button aria-label="Ir a la diapositiva ${n + 1}" data-i="${n}"></button>`).join("");
  function go(n) {
    idx = (n + items.length) % items.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dotsBox.querySelectorAll("button").forEach((b, k) => b.setAttribute("aria-current", k === idx));
  }
  document.getElementById("prev").addEventListener("click", () => go(idx - 1));
  document.getElementById("next").addEventListener("click", () => go(idx + 1));
  dotsBox.addEventListener("click", e => { if (e.target.dataset.i) go(+e.target.dataset.i); });
  document.getElementById("carousel").addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") go(idx - 1);
    if (e.key === "ArrowRight") go(idx + 1);
  });
  go(0);
}

/* ---------- 4. Cotizador de uniformes (servicios) ---------- */
const calc = document.getElementById("calc");
if (calc) {
  const precios = { camiseta: 18, short: 15, conjunto: 30, chaqueta: 45 };
  const extra = { ninguna: 0, numero: 3, sublimada: 6 };
  const out = document.getElementById("total");
  const det = document.getElementById("detalle");
  function cotizar() {
    const prenda = document.getElementById("prenda").value;
    const pers = document.getElementById("pers").value;
    const cant = Math.max(10, parseInt(document.getElementById("cant").value, 10) || 10);
    const desc = cant >= 50 ? 0.15 : cant >= 25 ? 0.08 : 0;
    const unit = (precios[prenda] + extra[pers]) * (1 - desc);
    const total = unit * cant;
    out.textContent = "$" + total.toLocaleString("es", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    det.textContent = `${cant} unidades a $${unit.toFixed(2)} c/u` + (desc ? ` (descuento del ${desc * 100}% incluido)` : "") + ". Mínimo 10 unidades.";
  }
  calc.addEventListener("input", cotizar);
  cotizar();
}

/* ---------- 5. Validación del formulario de contacto ---------- */
const form = document.getElementById("contactForm");
if (form) {
  const reglas = {
    nombre: v => v.trim().length >= 3 || "Escribe tu nombre (mínimo 3 letras).",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Escribe un correo válido, por ejemplo nombre@correo.com.",
    telefono: v => v === "" || /^[0-9+\s-]{7,15}$/.test(v) || "Usa solo números, de 7 a 15 dígitos.",
    asunto: v => v !== "" || "Elige un asunto.",
    mensaje: v => v.trim().length >= 15 || "Cuéntanos un poco más (mínimo 15 caracteres)."
  };
  function validar(campo) {
    const res = reglas[campo.name](campo.value);
    const box = campo.closest(".field");
    const msg = box.querySelector(".err");
    const ok = res === true;
    box.classList.toggle("invalid", !ok);
    box.classList.toggle("valid", ok && campo.value !== "");
    msg.textContent = ok ? "" : res;
    campo.setAttribute("aria-invalid", !ok);
    return ok;
  }
  const campos = [...form.querySelectorAll("[name]")];
  campos.forEach(c => {
    c.addEventListener("blur", () => validar(c));
    c.addEventListener("input", () => { if (c.closest(".field").classList.contains("invalid")) validar(c); });
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const todoOk = campos.map(validar).every(Boolean);
    const ok = document.getElementById("ok");
    if (todoOk) {
      ok.textContent = `¡Gracias, ${form.nombre.value.trim().split(" ")[0]}! Recibimos tu mensaje y te respondemos en menos de 24 horas.`;
      ok.classList.add("show");
      form.reset();
      campos.forEach(c => c.closest(".field").classList.remove("valid"));
    } else {
      ok.classList.remove("show");
      form.querySelector(".invalid input, .invalid select, .invalid textarea").focus();
    }
  });
}

/* ---------- 6. Efecto parallax (solo en el Inicio) ---------- */
/* Los elementos con data-speed se desplazan a distinta velocidad que el scroll.
   Valor positivo = se mueve más rápido; negativo = se queda atrás. */
const pxItems = document.querySelectorAll("[data-speed]");
if (pxItems.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;
  function parallax() {
    const vh = window.innerHeight;
    const factor = window.innerWidth < 820 ? 0.6 : 1; // menos movimiento en móvil
    pxItems.forEach(el => {
      const ref = el.closest("section, .band").getBoundingClientRect(); // referencia que no se mueve
      if (ref.bottom < -200 || ref.top > vh + 200) return;              // fuera de pantalla
      const offset = ref.top + ref.height / 2 - vh / 2;
      el.style.translate = "0 " + (offset * parseFloat(el.dataset.speed) * factor).toFixed(1) + "px";
    });
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", parallax);
  parallax();
}
