/* =========================
   ADMIN PRECIOS (PROTEGIDO)
   ========================= */

(() => {
  // Corre solo en admin-precios.html (tolerante a slash/query)
  const path = location.pathname.toLowerCase();
  if (!path.includes("admin-precios.html")) return;

  // >>> TU CLAVE <<<
  const ADMIN_PASSWORD = "AGUARA25";
  const SESSION_KEY = "admin_prices_unlocked";

  const $ = (id) => document.getElementById(id);

  const lock = $("lock");
  const adminPanel = $("adminPanel");
  const pwd = $("pwd");
  const btnUnlock = $("btnUnlock");
  const lockErr = $("lockErr");
  const btnLogout = $("btnLogout");

  // Si falta algo del DOM, no rompas el resto del sitio
  if (!lock || !adminPanel || !pwd || !btnUnlock || !lockErr) {
    console.warn("[admin-precios] faltan elementos en el DOM");
    return;
  }

  function setUnlocked(isUnlocked) {
    if (isUnlocked) {
      lock.classList.add("hide");
      adminPanel.classList.remove("hide");
      localStorage.setItem(SESSION_KEY, "1");
    } else {
      lock.classList.remove("hide");
      adminPanel.classList.add("hide");
      localStorage.removeItem(SESSION_KEY);
    }
  }

  // Auto-login si ya estaba desbloqueado
  if (localStorage.getItem(SESSION_KEY) === "1") setUnlocked(true);

  // Entrar
  btnUnlock.addEventListener("click", () => {
    const value = (pwd.value || "").trim();
    const ok = value === ADMIN_PASSWORD;

    if (!ok) {
      lockErr.classList.remove("hide");
      pwd.focus();
      return;
    }

    lockErr.classList.add("hide");
    setUnlocked(true);
  });

  // Enter para enviar
  pwd.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnUnlock.click();
  });

  // Salir
  btnLogout?.addEventListener("click", () => {
    setUnlocked(false);
    pwd.value = "";
  });

  // =========================
  // CALCULADORA DE PRECIOS
  // =========================
  const calcBtn = $("calcBtn");
  if (!calcBtn) return;

  calcBtn.addEventListener("click", () => {
    const costo = parseFloat($("costo")?.value);
    const margen = parseFloat($("margen")?.value);
    const comision = parseFloat($("comision")?.value);

    if ([costo, margen, comision].some((v) => Number.isNaN(v))) {
      alert("Completá costo, margen y comisión.");
      return;
    }

    const denom = 1 - margen - comision;
    if (denom <= 0) {
      alert("Margen + comisión es demasiado alto. Ajustá los valores.");
      return;
    }

    const precioReal = costo / denom;
    const precioRedondeado = Math.ceil(precioReal / 100) * 100; // centenas
    const precioPsico = Math.max(0, precioRedondeado - 100); // termina en 900

    $("precioReal").textContent = Math.round(precioReal);
    $("precioRedondeado").textContent = precioRedondeado;
    $("precioPsico").textContent = precioPsico;
  });
})();

