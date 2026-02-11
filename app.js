// =========================
// PANEL PROTEGIDO (FRONTEND)
// =========================

// 1) Cambiá esta clave por la tuya (ej: "AGUARA2026!")
const ADMIN_PASSWORD = "AGUARA25";

// 2) Key para recordar sesión (localStorage)
const SESSION_KEY = "admin_prices_unlocked";

const lock = document.getElementById("lock");
const adminPanel = document.getElementById("adminPanel");
const pwd = document.getElementById("pwd");
const btnUnlock = document.getElementById("btnUnlock");
const lockErr = document.getElementById("lockErr");
const btnLogout = document.getElementById("btnLogout");

// Mostrar/Ocultar panel
function setUnlocked(isUnlocked){
  if (isUnlocked){
    lock?.classList.add("hide");
    adminPanel?.classList.remove("hide");
    localStorage.setItem(SESSION_KEY, "1");
  } else {
    lock?.classList.remove("hide");
    adminPanel?.classList.add("hide");
    localStorage.removeItem(SESSION_KEY);
  }
}

// Auto login si ya desbloqueaste antes
if (localStorage.getItem(SESSION_KEY) === "1") setUnlocked(true);

// Entrar
btnUnlock?.addEventListener("click", () => {
  const value = (pwd?.value || "").trim();
  const ok = value === ADMIN_PASSWORD;

  if (!ok){
    lockErr?.classList.remove("hide");
    pwd?.focus();
    return;
  }
  lockErr?.classList.add("hide");
  setUnlocked(true);
});

// Enter para enviar
pwd?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnUnlock?.click();
});

// Salir
btnLogout?.addEventListener("click", () => {
  setUnlocked(false);
  if (pwd) pwd.value = "";
});


// =========================
// CALCULADORA DE PRECIOS
// =========================
document.getElementById('calcBtn')?.addEventListener('click', () => {
  const costo = parseFloat(document.getElementById('costo')?.value);
  const margen = parseFloat(document.getElementById('margen')?.value);
  const comision = parseFloat(document.getElementById('comision')?.value);

  if ([costo, margen, comision].some(v => Number.isNaN(v))) {
    alert("Completá costo, margen y comisión.");
    return;
  }

  const denom = 1 - margen - comision;
  if (denom <= 0) {
    alert("Margen + comisión es demasiado alto. Ajustá los valores.");
    return;
  }

  const precioReal = costo / denom;
  const precioRedondeado = Math.ceil(precioReal / 100) * 100; // a centenas
  const precioPsico = Math.max(0, precioRedondeado - 100); // terminado en 900

  document.getElementById('precioReal').textContent = Math.round(precioReal);
  document.getElementById('precioRedondeado').textContent = precioRedondeado;
  document.getElementById('precioPsico').textContent = precioPsico;
}
// =========================
// SOLO EN admin-precios.html
// =========================
if (location.pathname.endsWith("/admin-precios.html")) {

  const ADMIN_PASSWORD = "cambia-esta-clave";
  const SESSION_KEY = "admin_prices_unlocked";

  const lock = document.getElementById("lock");
  const adminPanel = document.getElementById("adminPanel");
  const pwd = document.getElementById("pwd");
  const btnUnlock = document.getElementById("btnUnlock");
  const lockErr = document.getElementById("lockErr");
  const btnLogout = document.getElementById("btnLogout");

  function setUnlocked(isUnlocked){
    if (isUnlocked){
      lock?.classList.add("hide");
      adminPanel?.classList.remove("hide");
      localStorage.setItem(SESSION_KEY, "1");
    } else {
      lock?.classList.remove("hide");
      adminPanel?.classList.add("hide");
      localStorage.removeItem(SESSION_KEY);
    }
  }

  if (localStorage.getItem(SESSION_KEY) === "1") setUnlocked(true);

  btnUnlock?.addEventListener("click", () => {
    const value = (pwd?.value || "").trim();
    const ok = value === ADMIN_PASSWORD;

    if (!ok){
      lockErr?.classList.remove("hide");
      pwd?.focus();
      return;
    }
    lockErr?.classList.add("hide");
    setUnlocked(true);
  });

  pwd?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnUnlock?.click();
  });

  btnLogout?.addEventListener("click", () => {
    setUnlocked(false);
    if (pwd) pwd.value = "";
  });

  document.getElementById('calcBtn')?.addEventListener('click', () => {
    const costo = parseFloat(document.getElementById('costo')?.value);
    const margen = parseFloat(document.getElementById('margen')?.value);
    const comision = parseFloat(document.getElementById('comision')?.value);

    if ([costo, margen, comision].some(v => Number.isNaN(v))) {
      alert("Completá costo, margen y comisión.");
      return;
    }

    const denom = 1 - margen - comision;
    if (denom <= 0) {
      alert("Margen + comisión es demasiado alto. Ajustá los valores.");
      return;
    }

    const precioReal = costo / denom;
    const precioRedondeado = Math.ceil(precioReal / 100) * 100;
    const precioPsico = Math.max(0, precioRedondeado - 100);

    document.getElementById('precioReal').textContent = Math.round(precioReal);
    document.getElementById('precioRedondeado').textContent = precioRedondeado;
    document.getElementById('precioPsico').textContent = precioPsico;
  });

}
