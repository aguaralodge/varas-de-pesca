(() => {
  const PASSWORD = "AGUARA25";

  // Ruta del logo que va en el PDF
  const LOGO_PATH = "logo-presu.png";

  // Tu WhatsApp (formato internacional sin +)
  const WPP_PHONE = "5493482632269";

  const $ = (id) => document.getElementById(id);

  // ---- Lock ----
  const lock = $("lock");
  const pwd = $("pwd");
  const btnUnlock = $("btnUnlock");
  const lockErr = $("lockErr");

  const unlock = () => {
    const v = (pwd.value || "").trim();
    if (v === PASSWORD) {
      lock.classList.add("hide");
      try { sessionStorage.setItem("presu_unlocked", "1"); } catch {}
    } else {
      lockErr.classList.remove("hide");
      pwd.focus();
      pwd.select();
    }
  };

  btnUnlock.addEventListener("click", unlock);
  pwd.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlock();
  });

  try {
    if (sessionStorage.getItem("presu_unlocked") === "1") {
      lock.classList.add("hide");
    }
  } catch {}

  // ---- UI refs ----
  const servicio = $("servicio");
  const cliente = $("cliente");

  const secReeles = $("secReeles");
  const secCanas = $("secCanas");

  const cantReeles = $("cantReeles");
  const dolarInfo = $("dolarInfo");
  const repuestosReel = $("repuestosReel");

  const q_1p_rot = $("q_1p_rot");
  const q_3p_rot = $("q_3p_rot");
  const q_3p_fro = $("q_3p_fro");
  const q_puente_fro = $("q_puente_fro");

  const alargue = $("alargue");
  const mango = $("mango");
  const porta = $("porta");
  const calco = $("calco");

  // NUEVOS
  const puntero = $("puntero");
  const portareel = $("portareel");
  const pintado = $("pintado");

  const totalEl = $("total");
  const btnPdf = $("btnPdf");
  const btnWpp = $("btnWpp");

  let lastPdfBlob = null;
  let lastResumen = "";

  const DOLAR_FALLBACK = 1200; // Valor de emergencia si la API no responde.
  let dolarBlueVenta = DOLAR_FALLBACK;
  let dolarBlueFecha = "";
  let dolarBlueFuente = "valor de emergencia";

  const REPUESTOS_REEL = [
    { id: "antireverse_caster_power", nombre: "Antireverse Caster Power", usd: 18.33 },
    { id: "antireverse_titan_pro", nombre: "Antireverse Titan Pro", usd: 21.45 },
    { id: "una_caster_power", nombre: "Uña Caster Power", usd: 13.56 },
    { id: "una_fierro_titan", nombre: "Uña Fierro Titan", usd: 14.43 },
    { id: "engranaje_sin_fin_fierro_magna", nombre: "Engranaje Sin Fin Fierro Magna", usd: 12.42 },
    { id: "engranaje_sin_fin_caster_power", nombre: "Engranaje Sin Fin Caster Power", usd: 12.42 },
    { id: "engranaje_chicharra_titan_300", nombre: "Engranaje chicharra Titan 300", usd: 11.88 },
    { id: "sin_fin_caster_power", nombre: "Sin Fin Caster Power", usd: 15.57 },
    { id: "sin_fin_caster_power_plus", nombre: "Sin fin Caster Power Plus", usd: 17.70 },
    { id: "levanta_pinon_abu_garcia", nombre: "Levanta Piñon Abu Garcia", usd: 23.10 },
    { id: "sin_fin_6500_abu_garcia", nombre: "Sin fin 6500 Abu Garcia", usd: 62.10 },
    { id: "sin_fin_5500_abu_garcia", nombre: "Sin fin 5500 Abu Garcia", usd: 44.73 },
    { id: "una_abu_garcia", nombre: "Uña Abu Garcia", usd: 15.30 },
    { id: "corona_bronce_abu_garcia", nombre: "Corona Bronce Abu Garcia", usd: 75.00 },
    { id: "pinon_bronce_abu_garcia", nombre: "Piñon Bronce Abu Garcia", usd: 65.00 },
    { id: "engranaje_sin_fin_abu_garcia", nombre: "Engranaje Sin Fin Abu Garcia", usd: 20.00 },
  ];

  const money = (n) => {
    const v = Math.round(Number(n || 0));
    return v.toLocaleString("es-AR");
  };

  const parseIntSafe = (el) => Math.max(0, parseInt(el?.value || "0", 10) || 0);
  const parseMoneySafe = (el) => Math.max(0, parseInt(el?.value || "0", 10) || 0);
  const usdMoney = (n) => Number(n || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const usdToArs = (usd) => Math.round(Number(usd || 0) * Number(dolarBlueVenta || DOLAR_FALLBACK));

  const PRICES = {
    reel: 20000,
    pasahilos_1p_rot: 5000,
    pasahilos_3p_rot: 5000,
    pasahilos_3p_fro: 7000,
    pasahilos_puente_fro: 3000,
    alargue: 45000,
    mango_corcho: 40000,
    mango_termo: 20000,
    porta: 5000,
    calco: 8000,
    portareel_generico: 15000,
    portareel_fuji_sin_gatillo: 35000,
    portareel_tubular_con_gatillo: 25000,
    puntero_carbono: 35000,
    puntero_fibra: 30000,
    pintado: 25000,
  };

  const renderRepuestos = () => {
    if (!repuestosReel) return;

    repuestosReel.innerHTML = REPUESTOS_REEL.map((r) => {
      const ars = usdToArs(r.usd);
      return [
        '<label class="repuesto-item" for="rep_' + r.id + '">',
        '  <input id="rep_' + r.id + '" data-repuesto-id="' + r.id + '" type="checkbox" />',
        '  <span class="repuesto-info">',
        '    <strong>' + r.nombre + '</strong>',
        '    <small>US$ ' + usdMoney(r.usd) + ' · $' + money(ars) + '</small>',
        '  </span>',
        '  <input class="repuesto-cantidad" id="qty_' + r.id + '" data-repuesto-qty="' + r.id + '" type="number" min="1" step="1" value="1" disabled />',
        '</label>'
      ].join('');
    }).join("");

    repuestosReel.querySelectorAll("input").forEach((el) => {
      el.addEventListener("input", () => {
        if (el.matches("[data-repuesto-id]")) {
          const qty = $("qty_" + el.dataset.repuestoId);
          if (qty) qty.disabled = !el.checked;
        }
        updateUI();
      });
      el.addEventListener("change", () => {
        if (el.matches("[data-repuesto-id]")) {
          const qty = $("qty_" + el.dataset.repuestoId);
          if (qty) qty.disabled = !el.checked;
        }
        updateUI();
      });
    });
  };

  const updateDolarInfo = () => {
    if (!dolarInfo) return;
    const fecha = dolarBlueFecha ? " · actualizado: " + dolarBlueFecha : "";
    dolarInfo.innerHTML = "<strong>Dólar blue venta usado:</strong> $" + money(dolarBlueVenta) + fecha + ". Los repuestos se cargan en USD y se convierten automáticamente a pesos.";
    if (dolarBlueFuente !== "DolarApi") {
      dolarInfo.innerHTML += '<br><span style="color:#ffd3d3">No se pudo consultar la cotización online. Se usa valor de emergencia: $' + money(DOLAR_FALLBACK) + '.</span>';
    }
  };

  const fetchDolarBlue = async () => {
    try {
      const res = await fetch("https://dolarapi.com/v1/dolares/blue", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo consultar DolarApi");
      const data = await res.json();
      const venta = Number(data?.venta || 0);
      if (!venta) throw new Error("Cotización inválida");

      dolarBlueVenta = venta;
      dolarBlueFecha = data?.fechaActualizacion
        ? new Date(data.fechaActualizacion).toLocaleString("es-AR")
        : "";
      dolarBlueFuente = "DolarApi";
    } catch (err) {
      console.warn("No se pudo obtener dólar blue, se usa fallback", err);
      dolarBlueVenta = DOLAR_FALLBACK;
      dolarBlueFuente = "valor de emergencia";
    } finally {
      updateDolarInfo();
      renderRepuestos();
      updateUI();
    }
  };

  const getRepuestosSeleccionados = () => {
    if (!repuestosReel) return [];
    return REPUESTOS_REEL.filter((r) => {
      const chk = $("rep_" + r.id);
      return chk?.checked;
    }).map((r) => {
      const qty = Math.max(1, parseIntSafe($("qty_" + r.id)) || 1);
      const unit = usdToArs(r.usd);
      return {
        label: "Repuesto: " + r.nombre,
        qty,
        unit,
        subtotal: qty * unit,
        usd: r.usd,
        dolarRate: dolarBlueVenta
      };
    });
  };

  const getItems = () => {
    const items = [];
    const tipo = servicio.value;

    if (tipo === "reeles") {
      const q = Math.max(1, parseIntSafe(cantReeles));
      items.push({
        label: `Mantenimiento de reeles x${q}`,
        qty: q,
        unit: PRICES.reel,
        subtotal: q * PRICES.reel
      });
      getRepuestosSeleccionados().forEach(item => items.push(item));
      items.push({
        label: "Incluye: desarme íntegro, ultrasonido + agentes de limpieza, ensamble y lubricación",
        note: true
      });
      items.push({
        label: "Repuestos cotizados con dólar blue venta: $" + money(dolarBlueVenta) + (dolarBlueFuente === "DolarApi" ? "" : " (valor de emergencia)"),
        note: true
      });
      return items;
    }

    // ---- Cañas ----
    const q1 = parseIntSafe(q_1p_rot);
    const q2 = parseIntSafe(q_3p_rot);
    const q3 = parseIntSafe(q_3p_fro);
    const q4 = parseIntSafe(q_puente_fro);

    if (q1) items.push({ label: "Pasahilos 1 pata para rotativo", qty: q1, unit: PRICES.pasahilos_1p_rot, subtotal: q1 * PRICES.pasahilos_1p_rot });
    if (q2) items.push({ label: "Pasahilos 3 patas para rotativo", qty: q2, unit: PRICES.pasahilos_3p_rot, subtotal: q2 * PRICES.pasahilos_3p_rot });
    if (q3) items.push({ label: "Pasahilos 3 patas para frontal", qty: q3, unit: PRICES.pasahilos_3p_fro, subtotal: q3 * PRICES.pasahilos_3p_fro });
    if (q4) items.push({ label: "Pasahilo tipo puente para frontal", qty: q4, unit: PRICES.pasahilos_puente_fro, subtotal: q4 * PRICES.pasahilos_puente_fro });

    const a = parseMoneySafe(alargue);
    if (a) items.push({ label: "Alargue de caña", qty: 1, unit: a, subtotal: a });

    const m = parseMoneySafe(mango);
    if (m) {
      const name = (m === PRICES.mango_corcho) ? "Mango de corcho" : "Mango termocontraible";
      items.push({ label: name, qty: 1, unit: m, subtotal: m });
    }

    const p = parseMoneySafe(porta);
    if (p) items.push({ label: "Porta anzuelo", qty: 1, unit: p, subtotal: p });

    const c = parseMoneySafe(calco);
    if (c) items.push({ label: "Calco con nombre", qty: 1, unit: c, subtotal: c });

    // Puntero/Pelo
    const pu = parseMoneySafe(puntero);
    if (pu) {
      const name =
        (pu === PRICES.puntero_carbono) ? "Puntero/Pelo (Carbono macizo)" :
        (pu === PRICES.puntero_fibra) ? "Puntero/Pelo (Fibra maciza)" :
        "Puntero/Pelo";
      items.push({ label: name, qty: 1, unit: pu, subtotal: pu });
    }

    // Pintado de caña
    const pi = parseMoneySafe(pintado);
    if (pi) items.push({ label: "Pintado de caña", qty: 1, unit: pi, subtotal: pi });

    // Porta Reel
    const pr = parseMoneySafe(portareel);
    if (pr) {
      const txt = portareel?.options?.[portareel.selectedIndex]?.textContent || "Porta Reel";
      const name = txt.replace(/\s*\(\+\$[\d.]+\)\s*$/i, "").trim();
      items.push({ label: name, qty: 1, unit: pr, subtotal: pr });
    }

    return items;
  };

  const calcTotal = (items) => items.reduce((acc, it) => acc + (it.subtotal || 0), 0);

  const updateUI = () => {
    const tipo = servicio.value;

    secReeles.classList.toggle("hide", tipo !== "reeles");
    secCanas.classList.toggle("hide", tipo !== "canas");

    if (tipo === "reeles") {
      if (!cantReeles.value || Number(cantReeles.value) < 1) cantReeles.value = "1";
    }

    const items = getItems().filter(x => !x.note);
    const tot = calcTotal(items);
    totalEl.textContent = `$${money(tot)}`;

    const hasSomething = tot > 0;
    const hasName = (cliente.value || "").trim().length > 2;
    btnWpp.disabled = !(hasSomething && hasName);
  };

  [
    servicio, cliente,
    cantReeles,
    q_1p_rot, q_3p_rot, q_3p_fro, q_puente_fro,
    alargue, mango, porta, calco,
    puntero, portareel, pintado
  ].forEach(el => el?.addEventListener("input", updateUI));

  servicio.addEventListener("change", updateUI);

  // ---- Logo -> DataURL ----
  const fetchLogoDataURL = async () => {
    try {
      const res = await fetch(LOGO_PATH, { cache: "no-store" });
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = () => resolve(null);
        fr.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  // ---- Texto resumen (para WhatsApp) ----
  const buildResumenText = (nombreCliente, items, total, tipo) => {
    const date = new Date().toLocaleString("es-AR");
    let lines = [];
    lines.push(`Presupuesto ${tipo === "reeles" ? "Mantenimiento de reeles" : "Reparación de cañas"}`);
    lines.push(`Cliente: ${nombreCliente}`);
    lines.push(`Fecha: ${date}`);
    lines.push("");
    items.filter(i => !i.note).forEach(i => {
      const qty = i.qty ? `x${i.qty}` : "";
      const unit = i.unit ? `$${money(i.unit)}` : "";
      const sub = i.subtotal ? `$${money(i.subtotal)}` : "";
      const usdInfo = i.usd ? `(US$ ${usdMoney(i.usd)} c/u)` : "";
      lines.push(`- ${i.label} ${qty} ${unit} ${usdInfo} => ${sub}`.replace(/\s+/g, " ").trim());
    });
    const note = items.find(i => i.note);
    if (note) {
      lines.push("");
      lines.push(note.label);
    }
    lines.push("");
    lines.push(`TOTAL: $${money(total)}`);
    return lines.join("\n");
  };

  // ---- Generar PDF ----
  const generatePdf = async () => {
    const nombreCliente = (cliente.value || "").trim();
    const tipo = servicio.value;
    const rawItems = getItems();
    const items = rawItems.filter(i => !i.note);
    const total = calcTotal(items);

    if (!nombreCliente || nombreCliente.length < 3) {
      alert("Ingresá nombre y apellido del cliente.");
      return;
    }
    if (total <= 0) {
      alert("Seleccioná al menos una opción para presupuestar.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const pageW = doc.internal.pageSize.getWidth();
    const margin = 40;

    // ---- LOGO ARRIBA A LA DERECHA ----
    const logoWidth = 200;
    const logoHeight = 110;
    const logoX = pageW - margin - logoWidth;
    const logoY = 25;

    const logo = await fetchLogoDataURL();
    if (logo) {
      try {
        doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight, undefined, "FAST");
      } catch (e) {
        console.error("Error cargando logo:", e);
      }
    }

    // ---- TEXTO A LA IZQUIERDA ----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Presupuesto", margin, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Cliente: ${nombreCliente}`, margin, 60 + 18);
    doc.text(
      `Servicio: ${tipo === "reeles" ? "Mantenimiento de reeles" : "Reparación de cañas"}`,
      margin,
      60 + 18 + 14
    );
    doc.text(
      `Fecha: ${new Date().toLocaleString("es-AR")}`,
      margin,
      60 + 18 + 14 + 14
    );

    // Línea separadora y arranque de detalle
    let y = 140;
    doc.setDrawColor(180);
    doc.line(margin, y, pageW - margin, y);
    y += 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Detalle", margin, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const addLine = (txt) => {
      const maxW = pageW - margin * 2;
      const split = doc.splitTextToSize(txt, maxW);
      split.forEach(line => {
        if (y > 770) { doc.addPage(); y = 60; }
        doc.text(line, margin, y);
        y += 14;
      });
    };

    rawItems.forEach(it => {
      if (it.note) {
        y += 8;
        doc.setFont("helvetica", "bold");
        addLine(it.label);
        doc.setFont("helvetica", "normal");
        y += 6;
        return;
      }
      const usdInfo = it.usd ? ` · US$ ${usdMoney(it.usd)} c/u · dólar $${money(it.dolarRate)}` : "";
      const row = `• ${it.label}  x${it.qty}  ($${money(it.unit)} c/u${usdInfo})  =  $${money(it.subtotal)}`;
      addLine(row);
    });

    y += 10;
    doc.setDrawColor(180);
    doc.line(margin, y, pageW - margin, y);
    y += 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`TOTAL: $${money(total)}`, margin, y);

    y += 24;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    addLine("Este presupuesto es estimativo y corresponde a lo seleccionado. Para coordinar el trabajo, respondé por WhatsApp adjuntando este PDF.");

    const safeName = nombreCliente
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "_");

    const fileName = `presupuesto_${safeName || "cliente"}_${tipo}.pdf`;

    const pdfBlob = doc.output("blob");
    lastPdfBlob = pdfBlob;

    doc.save(fileName);

    lastResumen = buildResumenText(nombreCliente, rawItems, total, tipo);

    btnWpp.disabled = false;
  };

  btnPdf.addEventListener("click", generatePdf);

  // ---- WhatsApp ----
  const openWhatsapp = async () => {
    const nombreCliente = (cliente.value || "").trim();
    const tipo = servicio.value;

    const items = getItems();
    const total = calcTotal(items.filter(i => !i.note));
    if (!nombreCliente || total <= 0) return;

    const text = lastResumen || buildResumenText(nombreCliente, items, total, tipo);

    if (lastPdfBlob && navigator.canShare) {
      try {
        const fileName = `presupuesto_${nombreCliente.replace(/\s+/g, "_")}.pdf`;
        const file = new File([lastPdfBlob], fileName, { type: "application/pdf" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Presupuesto",
            text: "Te comparto el presupuesto en PDF.",
            files: [file]
          });
          return;
        }
      } catch {}
    }

    const url = `https://wa.me/${WPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  };

  btnWpp.addEventListener("click", openWhatsapp);

  // init
  updateDolarInfo();
  renderRepuestos();
  updateUI();
  fetchDolarBlue();
})();
