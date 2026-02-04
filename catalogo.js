const grid = document.getElementById("grid");
const searchEl = document.getElementById("search");
const soloStockEl = document.getElementById("soloStock");

const carritoItemsEl = document.getElementById("carritoItems");
const totalEl = document.getElementById("total");
const btnVaciar = document.getElementById("btnVaciar");
const btnWhatsApp = document.getElementById("btnWhatsApp");

const CART_KEY = "carrito_pesca_v1";

let productos = [];
let carrito = loadCart(); // { id: {cantidad, nombre, precio} }

init();

async function init() {
  productos = await fetchProductos();
  renderGrid();
  wire();
  renderCarrito();
}

function wire() {
  searchEl.addEventListener("input", renderGrid);
  soloStockEl.addEventListener("change", renderGrid);

  btnVaciar.addEventListener("click", () => {
    carrito = {};
    saveCart(carrito);
    renderGrid();
    renderCarrito();
  });

  btnWhatsApp.addEventListener("click", () => {
    const msg = buildWhatsAppMessage();
    if (!msg) {
      alert("Tu carrito está vacío.");
      return;
    }
    const url = `https://wa.me/${window.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

async function fetchProductos() {
  const res = await fetch("products.json", { cache: "no-store" });
  if (!res.ok) throw new Error("No pude cargar products.json");
  return await res.json();
}

function renderGrid() {
  const q = (searchEl.value || "").toLowerCase().trim();
  const soloStock = soloStockEl.checked;

  const list = productos.filter(p => {
    const match = !q || p.nombre.toLowerCase().includes(q);
    const stockOk = !soloStock || (p.stock > 0);
    return match && stockOk;
  });

  grid.innerHTML = list.map(p => cardHTML(p)).join("");

  list.forEach(p => {
    const chk = document.getElementById(`chk_${p.id}`);
    const qty = document.getElementById(`qty_${p.id}`);

    const inCart = carrito[p.id]?.cantidad || 0;

    chk.checked = inCart > 0;
    qty.disabled = !chk.checked;
    qty.value = inCart > 0 ? inCart : 1;
    qty.max = p.stock;

    chk.addEventListener("change", () => {
      if (chk.checked) addToCart(p, parseInt(qty.value, 10) || 1);
      else removeFromCart(p.id);

      qty.disabled = !chk.checked;
      renderCarrito();
    });

    qty.addEventListener("change", () => {
      let v = parseInt(qty.value, 10) || 1;
      v = Math.max(1, Math.min(v, p.stock));
      qty.value = v;

      if (chk.checked) {
        addToCart(p, v);
        renderCarrito();
      }
    });
  });
}

function cardHTML(p) {
  const price = money(p.precio);
  const stockTxt = p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock";

  return `
  <article class="producto-card">
    <img src="${p.foto}" alt="${escapeHtml(p.nombre)}" loading="lazy" />
    <div class="producto-info">
      <h3>${escapeHtml(p.nombre)}</h3>

      <div class="producto-meta">
        <span class="precio">${price}</span>
        <span style="opacity:.85;">${stockTxt}</span>
      </div>

      <div class="producto-acciones">
        <label style="display:flex;align-items:center;gap:8px;">
          <input id="chk_${p.id}" type="checkbox" ${p.stock <= 0 ? "disabled" : ""} />
          Agregar
        </label>

        <label style="display:flex;align-items:center;gap:8px;">
          Cant:
          <input class="qty" id="qty_${p.id}" type="number" min="1" value="1" ${p.stock <= 0 ? "disabled" : ""} />
        </label>
      </div>
    </div>
  </article>
  `;
}

// Carrito
function addToCart(p, cantidad) {
  if (p.stock <= 0) return;
  cantidad = Math.max(1, Math.min(cantidad, p.stock));

  carrito[p.id] = { nombre: p.nombre, precio: p.precio, cantidad };
  saveCart(carrito);
}

function removeFromCart(id) {
  delete carrito[id];
  saveCart(carrito);
}

function renderCarrito() {
  const ids = Object.keys(carrito);

  if (ids.length === 0) {
    carritoItemsEl.innerHTML = `<p>No hay productos seleccionados todavía.</p>`;
    totalEl.textContent = money(0);
    return;
  }

  let total = 0;

  carritoItemsEl.innerHTML = ids.map(id => {
    const it = carrito[id];
    const sub = it.precio * it.cantidad;
    total += sub;

    return `
      <div class="carrito-row">
        <div>
          <div><strong>${escapeHtml(it.nombre)}</strong></div>
          <div style="opacity:.85;">${it.cantidad} × ${money(it.precio)}</div>
        </div>
        <div style="text-align:right;">
          <div><strong>${money(sub)}</strong></div>
          <button type="button" data-remove="${id}" style="margin-top:6px;">Quitar</button>
        </div>
      </div>
    `;
  }).join("");

  totalEl.textContent = money(total);

  carritoItemsEl.querySelectorAll("button[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.remove);
      renderGrid();
      renderCarrito();
    });
  });
}

function buildWhatsAppMessage() {
  const ids = Object.keys(carrito);
  if (ids.length === 0) return "";

  let total = 0;
  const lines = ids.map(id => {
    const it = carrito[id];
    const sub = it.precio * it.cantidad;
    total += sub;
    return `• ${it.nombre} | Cant: ${it.cantidad} | ${money(sub)}`;
  });

  return [
    "Hola Emiliano! Quiero hacer este pedido de artículos de pesca:",
    "",
    ...lines,
    "",
    `Total estimado: ${money(total)}`,
    "",
    "¿Coordinamos entrega?"
  ].join("\n");
}

// Utils
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "{}"); }
  catch { return {}; }
}
function saveCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
}
function money(n) {
  return "$" + (Number(n) || 0).toLocaleString("es-AR");
}
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
