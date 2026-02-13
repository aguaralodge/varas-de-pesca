(() => {
  const PASSWORD = "AGUARA25";

  // Ajustá esto al nombre real de tu logo dentro del sitio:
  const LOGO_PATH = "logo.png";

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

  const money = (n) => {
    const v = Math.round(Number(n || 0));
    return v.toLocaleString("es-AR");
  };

  const parseIntSafe = (el) => Math.max(0, parseInt(el?.value || "0", 10) || 0);
  const parseMoneySafe = (el) => Math.max(0, parseInt(el?.value || "0", 10) || 0);

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
    portareel: 15000,
    puntero_carbono: 35000,
    puntero_fibra: 30000,
    pintado: 25000,
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
      items.push({
        label: "Incluye: desarme íntegro, ultrasonido + agentes de limpieza, ensamble y lubricación",
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

    // ✅ NUEVO: Puntero/Pelo
    const pu = parseMoneySafe(puntero);
    if (pu) {
      const name =
        (pu === PRICES.puntero_carbono) ? "Puntero/Pelo (Carbono macizo)" :
        (pu === PRICES.puntero_fibra) ? "Puntero/Pelo (Fibra maciza)" :
        "Puntero/Pelo";
      items.push({ label: name, qty: 1, unit: pu, subtotal: pu });
    }

    // ✅ Pintado de caña
const pi = parseMoneySafe(pintado);
if (pi) items.push({ label: "Pintado de caña", qty: 1, unit: pi, subtotal: pi });


    // ✅ NUEVO: Porta Reel
    const pr = parseMoneySafe(portareel);
    if (pr) items.push({ label: "Porta Reel", qty: 1, unit: pr, subtotal: pr });

    return items;
   }
  

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

  // ✅ IMPORTANTÍSIMO: agregar puntero y portareel a los listeners
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

  // ---- PDF ----
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
      lines.push(`- ${i.label} ${qty} ${unit} => ${sub}`.replace(/\s+/g, " ").trim());
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
    let y = 52;

    // Logo
    const logo = await fetchLogoDataURL();
    if (logo) {
      try {
        doc.addImage(logo, "PNG", margin, 34, 90, 90, undefined, "FAST");
      } catch {}
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Presupuesto", margin + (logo ? 110 : 0), y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y += 18;
    doc.text(`Cliente: ${nombreCliente}`, margin + (logo ? 110 : 0), y);
    y += 14;
    doc.text(`Servicio: ${tipo === "reeles" ? "Mantenimiento de reeles" : "Reparación de cañas"}`, margin + (logo ? 110 : 0), y);
    y += 14;
    doc.text(`Fecha: ${new Date().toLocaleString("es-AR")}`, margin + (logo ? 110 : 0), y);

    y = Math.max(y, 140);
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
      const row = `• ${it.label}  x${it.qty}  ($${money(it.unit)} c/u)  =  $${money(it.subtotal)}`;
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
  updateUI();
})();

