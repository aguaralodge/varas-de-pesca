const grid = document.getElementById("grid");
const searchEl = document.getElementById("search");
const soloStockEl = document.getElementById("soloStock");

const carritoItemsEl = document.getElementById("carritoItems");
const totalEl = document.getElementById("total");
const btnVaciar = document.getElementById("btnVaciar");
const btnWhatsApp = document.getElementById("btnWhatsApp");

const CART_KEY = "carrito_pesca_v1";

let productos = [];
let carrito = loadCart(); // { id: { cantidad, nombre, precio } }

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
    wire();
    renderGrid();
    renderCarrito();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="grid-column:1/-1; color:white;">No se pudieron cargar los productos.</p>`;
  }
}

function wire() {
  searchEl?.addEventListener("input", renderGrid);
  soloStockEl?.addEventListener("change", renderGrid);

  btnVaciar?.addEventListener("click", () => {
    carrito = {};
    saveCart(carrito);
    renderGrid();
    renderCarrito();
  });

  btnWhatsApp?.addEventListener("click", () => {
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
  const data = Array.isArray(rows) ? rows : (rows.data || rows.products || []);

  return data.map((r) => ({
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
  const q = (searchEl?.value || "").toLowerCase().trim();
  const soloStock = !!soloStockEl?.checked;

  const list = productos.filter((p) => {
    const match =
      !q ||
      p.nombre.toLowerCase().includes(q) ||
      (p.categoria || "").toLowerCase().includes(q) ||
      (p.descripcion || "").toLowerCase().includes(q);

    const stockOk = !soloStock || p.stock > 0;
    return match && stockOk;
  });

  if (!list.length) {
    grid.innerHTML = `<p style="grid-column:1/-1; color:white;">No encontré productos con ese filtro.</p>`;
    return;
  }

  grid.innerHTML = list.map((p) => cardHTML(p)).join("");

  list.forEach((p) => {
    const chk = document.getElementById(`chk_${p.id}`);
    const qty = document.getElementById(`qty_${p.id}`);
    const btnDet = document.getElementById(`det_${p.id}`);
    const thumb = document.getElementById(`img_${p.id}`);
    const card = document.getElementById(`card_${p.id}`);

    const inCart = carrito[p.id]?.cantidad || 0;

    if (chk && qty) {
      chk.checked = inCart > 0;
      qty.disabled = !chk.checked;
      qty.value = inCart > 0 ? inCart : 1;
      qty.max = Math.max(1, p.stock);

      chk.addEventListener("change", () => {
        if (chk.checked) addToCart(p, parseInt(qty.value, 10) || 1);
        else removeFromCart(p.id);

        qty.disabled = !chk.checked;
        renderCarrito();
      });

      qty.addEventListener("change", () => {
        let v = parseInt(qty.value, 10) || 1;
        v = Math.max(1, Math.min(v, Math.max(1, p.stock)));
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

    card?.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-6px)";
      card.style.boxShadow = "0 18px 42px rgba(0,0,0,.28)";
      card.style.borderColor = "rgba(255,255,255,.18)";
    });

    card?.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 14px 36px rgba(0,0,0,.22)";
      card.style.borderColor = "rgba(255,255,255,.10)";
    });
  });
}

function cardHTML(p) {
  const price = money(p.precio);
  const stockTxt = p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock";
  const stockColor = p.stock > 0 ? "#c8f7d1" : "#ffc4c4";

  return `
    <article
      id="card_${escapeAttr(String(p.id))}"
      class="producto-card"
      style="
        background: linear-gradient(180deg, rgba(12,28,56,.78) 0%, rgba(8,20,42,.88) 100%);
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 22px;
        overflow: hidden;
        box-shadow: 0 14px 36px rgba(0,0,0,.22);
        transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        backdrop-filter: blur(8px);
      "
    >
      <div
        id="img_${escapeAttr(String(p.id))}"
        class="producto-thumb"
        style="
          width: 100%;
          height: 250px;
          background: linear-gradient(180deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,.02) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        "
        title="Click para ampliar"
      >
        <img
          src="${escapeAttr(p.foto)}"
          alt="${escapeAttr(p.nombre)}"
          loading="lazy"
          style="
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            transition: transform .28s ease;
            filter: drop-shadow(0 10px 18px rgba(0,0,0,.22));
          "
          onmouseenter="this.style.transform='scale(1.04)'"
          onmouseleave="this.style.transform='scale(1)'"
        />

        <div
          style="
            position: absolute;
            right: 12px;
            bottom: 12px;
            background: rgba(6,14,28,.72);
            color: #eef4ff;
            font-size: .78rem;
            font-weight: 600;
            letter-spacing: .02em;
            padding: 6px 10px;
            border-radius: 999px;
            border: 1px solid rgba(255,255,255,.10);
            pointer-events: none;
            backdrop-filter: blur(6px);
          "
        >
          Ver imagen
        </div>
      </div>

      <div class="producto-info" style="padding: 18px;">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 10px;
        ">
          <h3 style="
            margin: 0;
            font-size: 1.10rem;
            line-height: 1.3;
            color: #ffffff;
            font-weight: 800;
            letter-spacing: .01em;
            text-shadow: 0 1px 0 rgba(0,0,0,.18);
          ">
            ${escapeHtml(p.nombre)}
          </h3>

          ${
            p.categoria
              ? `<span style="
                  flex-shrink: 0;
                  font-size: .76rem;
                  font-weight: 700;
                  letter-spacing: .03em;
                  padding: 6px 10px;
                  border-radius: 999px;
                  background: rgba(255,255,255,.08);
                  color: #e7f0ff;
                  border: 1px solid rgba(255,255,255,.10);
                  white-space: nowrap;
                ">${escapeHtml(p.categoria)}</span>`
              : ""
          }
        </div>

        <div class="producto-meta" style="
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
        ">
          <span class="precio" style="
            font-weight: 900;
            font-size: 1.16rem;
            color: #ffffff;
            letter-spacing: .01em;
            text-shadow: 0 1px 0 rgba(0,0,0,.18);
          ">
            ${price}
          </span>

          <span style="
            opacity: .98;
            font-size: .93rem;
            color: ${stockColor};
            font-weight: 800;
            letter-spacing: .02em;
          ">
            ${stockTxt}
          </span>
        </div>

        ${
          p.descripcion
            ? `<p style="
                margin: 0 0 15px 0;
                font-size: .95rem;
                line-height: 1.55;
                color: #e3ecfb;
                font-weight: 500;
                letter-spacing: .005em;
              ">
                ${escapeHtml(truncateText(p.descripcion, 110))}
              </p>`
            : ""
        }

        <div class="producto-acciones" style="
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        ">
          <button
            id="det_${escapeAttr(String(p.id))}"
            type="button"
            class="btn-primary subtle"
            style="
              border-radius: 12px;
              background: rgba(255,255,255,.10);
              border: 1px solid rgba(255,255,255,.12);
              color: #ffffff;
              font-weight: 700;
              letter-spacing: .02em;
              box-shadow: 0 6px 16px rgba(0,0,0,.12);
            "
          >
            Detalles
          </button>

          <label style="
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,.06);
            color: #ffffff;
            font-weight: 600;
            letter-spacing: .01em;
            padding: 9px 12px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,.08);
          ">
            <input id="chk_${escapeAttr(String(p.id))}" type="checkbox" ${p.stock <= 0 ? "disabled" : ""} />
            Agregar
          </label>

          <label style="
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,.06);
            color: #ffffff;
            font-weight: 600;
            letter-spacing: .01em;
            padding: 9px 12px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,.08);
          ">
            Cant:
            <input
              class="qty"
              id="qty_${escapeAttr(String(p.id))}"
              type="number"
              min="1"
              value="1"
              ${p.stock <= 0 ? "disabled" : ""}
              style="
                width: 72px;
                border-radius: 9px;
                border: 1px solid rgba(255,255,255,.12);
                background: rgba(7,15,30,.55);
                color: #ffffff;
                font-weight: 700;
                padding: 6px 8px;
              "
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

  carritoItemsEl.innerHTML = ids.map((id) => {
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

  carritoItemsEl.querySelectorAll("button[data-remove]").forEach((btn) => {
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
  const lines = ids.map((id) => {
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

function truncateText(str, max) {
  const s = String(str || "");
  if (s.length <= max) return s;
  return s.slice(0, max).trim() + "…";
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
