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

// Modal Detalles
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDesc = document.getElementById("modalDesc");
const modalClose = document.getElementById("modalClose");

if (modal && modalClose) {
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openDetails(p) {
  if (!modal) return;
  modalTitle.textContent = p.nombre;
  modalPrice.textContent = `${money(p.precio)} | Stock: ${p.stock}`;
  modalDesc.textContent = p.descripcion || "Sin descripción.";
  modal.classList.add("open");
}

function closeModal() {
  modal?.classList.remove("open");
}

init();

async function init() {
  try {
    productos = await fetchProductos();
    renderGrid();
    wire();
    renderCarrito();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="grid-column:1/-1;">No se pudieron cargar los productos.</p>`;
  }
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
  const res = await fetch("/api/products/list", { cache: "no-store" });
  if (!res.ok) throw new Error("No pude cargar /api/products/list");

  const rows = await res.json();

  return (rows || []).map(r => ({
    id: r.id,
    nombre: r.name,
    precio: Number(r.price || 0),
    stock: Number(r.stock || 0),
    foto: r.image_url || "img/placeholder.jpg",
    descripcion: r.description || "",
    categoria: r.category || ""
  }));
}

function renderGrid() {
  const q = (searchEl.value || "").toLowerCase().trim();
  const soloStock = soloStockEl.checked;

  const list = productos.filter(p => {
    const match =
      !q ||
      p.nombre.toLowerCase().includes(q) ||
      (p.categoria || "").toLowerCase().includes(q);

    const stockOk = !soloStock || p.stock > 0;
    return match && stockOk;
  });

  if (!list.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;">No encontré productos con ese filtro.</p>`;
    return;
  }

  grid.innerHTML = list.map(p => cardHTML(p)).join("");

  list.forEach(p => {
    const chk = document.getElementById(`chk_${p.id}`);
    const qty = document.getElementById(`qty_${p.id}`);
    const btnDet = document.getElementById(`det_${p.id}`);
    const thumb = document.getElementById(`img_${p.id}`);

    const inCart = carrito[p.id]?.cantidad || 0;

    if (chk && qty) {
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
        v = Math.max(1, Math.min(v, p.stock || 1));
        qty.value = v;

        if (chk.checked) {
          addToCart(p, v);
          renderCarrito();
        }
      });
    }

    btnDet?.addEventListener("click", () => openDetails(p));

    thumb?.addEventListener("click", () => {
      if (p.foto && typeof window.openImageModal === "function") {
        window.openImageModal(p.foto);
      }
    });
  });
}

function cardHTML(p) {
  const price = money(p.precio);
  const stockTxt = p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock";

  return `
  <article class="producto-card" style="
    background:#fff;
    border:1px solid rgba(0,0,0,.08);
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 8px 24px rgba(0,0,0,.06);
    transition:transform .18s ease, box-shadow .18s ease;
  ">
    <div
      id="img_${p.id}"
      class="producto-thumb"
      style="
        width:100%;
        height:240px;
        background:
          radial-gradient(circle at top, rgba(255,255,255,.9), rgba(245,245,245,1));
        display:flex;
        align-items:center;
        justify-content:center;
        overflow:hidden;
        cursor:pointer;
        padding:14px;
      "
      title="Click para ampliar"
    >
      <img
        src="${escapeAttr(p.foto)}"
        alt="${escapeAttr(p.nombre)}"
        loading="lazy"
        style="
          width:100%;
          height:100%;
          object-fit:cover;
          border-radius:14px;
          transition:transform .25s ease;
          display:block;
          background:#fff;
        "
      />
    </div>

    <div class="producto-info" style="padding:16px;">
      <h3 style="
        margin:0 0 10px 0;
        font-size:1.06rem;
        line-height:1.3;
      ">${escapeHtml(p.nombre)}</h3>

      <div class="producto-meta" style="
        display:flex;
        justify-content:space-between;
        gap:10px;
        align-items:center;
        margin-bottom:14px;
        flex-wrap:wrap;
      ">
        <span class="precio" style="
          font-weight:800;
          font-size:1.08rem;
        ">${price}</span>

        <span style="
          opacity:.8;
          font-size:.95rem;
        ">${stockTxt}</span>
      </div>

      <div class="producto-acciones" style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        align-items:center;
      ">
        <button id="det_${p.id}" type="button" class="btn-primary subtle">
          Detalles de producto
        </button>

        <label style="display:flex;align-items:center;gap:8px;">
          <input id="chk_${p.id}" type="checkbox" ${p.stock <= 0 ? "disabled" : ""} />
          Agregar
        </label>

        <label style="display:flex;align-items:center;gap:8px;">
          Cant:
          <input
            class="qty"
            id="qty_${p.id}"
            type="number"
            min="1"
            value="1"
            ${p.stock <= 0 ? "disabled" : ""}
            style="width:72px;"
          />
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

  carrito[p.id] = {
    nombre: p.nombre,
    precio: p.precio,
    cantidad
  };
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
          <button type="button" data-remove="${escapeAttr(id)}" style="margin-top:6px;">Quitar</button>
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
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "{}");
  } catch {
    return {};
  }
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

function escapeAttr(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&#039;");
}

// HEADER QUE SE OCULTA AL BAJAR Y APARECE AL SUBIR
(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const show = () => {
    header.classList.remove("is-hidden");
    header.classList.add("is-shown");
  };

  const hide = () => {
    header.classList.add("is-hidden");
    header.classList.remove("is-shown");
  };

  const onScroll = () => {
    const y = window.scrollY;

    if (y < 80) {
      show();
      lastY = y;
      return;
    }

    if (y > lastY + 6) hide();
    else if (y < lastY - 6) show();

    lastY = y;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
})();
