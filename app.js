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
  // (GANANCIA SOBRE COSTO + COMISIÓN)
  // =========================
  const calcBtn = $("calcBtn");
  if (!calcBtn) return;

  calcBtn.addEventListener("click", () => {
    const costo = parseFloat($("costo")?.value);

    // Ahora el usuario escribe porcentajes enteros:
    // ej: 100 = 100% ganancia, 10 = 10% comisión
    const gananciaPct = parseFloat($("margen")?.value);
    const comisionPct = parseFloat($("comision")?.value);

    if ([costo, gananciaPct, comisionPct].some((v) => Number.isNaN(v))) {
      alert("Completá costo, ganancia y comisión.");
      return;
    }

    // Convertir % -> decimal
    const ganancia = gananciaPct / 100;
    const comision = comisionPct / 100;

    // 1) Ganancia sobre costo (markup)
    const precioBase = costo * (1 + ganancia);

    // 2) Cubrir comisión (MercadoPago, etc.)
    const denom = 1 - comision;
    if (denom <= 0) {
      alert("La comisión es demasiado alta. Ajustá el valor.");
      return;
    }

    const precioReal = precioBase / denom;

    // 3) Redondeos
    const precioRedondeado = Math.ceil(precioReal / 100) * 100; // centenas
    const precioPsico = Math.max(0, precioRedondeado - 100); // termina en 900

    $("precioReal").textContent = Math.round(precioReal);
    $("precioRedondeado").textContent = precioRedondeado;
    $("precioPsico").textContent = precioPsico;
  });
})();
