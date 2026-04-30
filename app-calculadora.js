/* =======================================================
   Calculadora Varas de Pesca — v4
   - Envío a WhatsApp con cálculo parcial
   - Botón "Descargar presupuesto"
   - PDF con el mismo estilo de presupuesto.html / presupuesto.js
   ======================================================= */
(function(){
  "use strict";

  /* ----- CONFIG ----- */
  const PASSWORD = "AGUARA25";          // Cambiá acá si querés otra clave
  const WHATSAPP = "5493482632269";     // Número para el envío (con código de país sin '+')
  const WHATSAPP_DISPLAY = "3482632269";
  const LOGO_PATH = "logo-presu.png";

  // Mapa de precios
  const PRECIOS = {
    tipoVara: { "Tournament": 41200, "ya tengo Vara": 0 },
    color: { "blanco": 20000, "negro": 0, "rojo": 25000, "azul": 25000, "verde": 25000 },
    largo: { "2,40": 0, "2,30": 0, "2,20": 0, "2,10": 0 },
    pasahilos: { "8 + puntera": 45000, "9 + puntera": 50000, "10 + puntera": 55000, "11 + puntera": 60000 },
    portaReel: { "portareel generico": 15000, "portareel Fuji sin gatillo": 35000, "portareel tubular con gatillo": 25000 },
    portaAnzuelo: { "con porta anzuelo": 5000, "sin porta anzuelo": 0 },
    nombreLogo: { "nombre + logo": 8000, "nombre o logo solo": 5000, "sin nombre o logo": 0 },
    tipoMango: { "soga": 8000, "termocontraible sin relleno": 15000, "termocontraible con relleno": 20000, "corcho aglomerado": 35000 },
    tacon: { "con taco de goma": 3000, "sin taco de goma": 0 }
  };

  const ORDEN = [
    "tipoVara",
    "color",
    "largo",
    "pasahilos",
    "portaReel",
    "portaAnzuelo",
    "nombreLogo",
    "tipoMango",
    "tacon"
  ];

  const ETIQUETAS = {
    tipoVara: "Tipo de vara",
    color: "Color",
    largo: "Largo",
    pasahilos: "Cantidad de pasahilos",
    portaReel: "Tipo de porta reel",
    portaAnzuelo: "Porta anzuelo",
    nombreLogo: "Nombre / logo",
    tipoMango: "Tipo de mango",
    tacon: "Talón de la caña"
  };

  /* ----- HELPERS ----- */
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const money = n => Number(n || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });

  const plainMoney = n => Math.round(Number(n || 0)).toLocaleString("es-AR");

  const labelText = id => {
    if (ETIQUETAS[id]) return ETIQUETAS[id];
    const lab = $$(`label[for="${id}"]`)[0];
    return lab ? lab.textContent.trim() : id;
  };

  const valueOf = id => {
    const el = $("#" + id);
    return el ? (el.value || "").trim() : "";
  };

  const getPrecio = (id, value) => {
    const mapa = PRECIOS[id] || {};
    return Object.prototype.hasOwnProperty.call(mapa, value) ? Number(mapa[value] || 0) : 0;
  };

  const getItems = () => {
    const items = [];

    ORDEN.forEach(id => {
      const value = valueOf(id);
      if (!value) return;

      const unit = getPrecio(id, value);
      items.push({
        label: labelText(id),
        value,
        qty: 1,
        unit,
        subtotal: unit
      });
    });

    const nota = ($("#nota")?.value || "").trim();
    if (nota) {
      items.push({
        label: "Notas del cliente",
        value: nota,
        note: true
      });
    }

    return items;
  };

  const calcTotal = (items) => items.reduce((acc, item) => acc + Number(item.subtotal || 0), 0);

  const countSelections = () => ORDEN.reduce((acc, id) => acc + (valueOf(id) ? 1 : 0), 0);

  function relaxRequired(form){
    form?.querySelectorAll("[required]").forEach(el => el.removeAttribute("required"));
  }

  /* ----- GATE / CLAVE ----- */
  function initGate(){
    const form    = $("#configForm");
    const gate    = $("#gateCard");
    const gateBtn = $("#gateBtn");
    const gateInp = $("#gateCode");
    const gateMsg = $("#gateMsg");

    if(!form || !gate || !gateBtn || !gateInp) return;

    form.classList.add("locked");

    gateBtn.addEventListener("click", function(){
      const code = (gateInp.value || "").trim();
      if(code === PASSWORD){
        form.classList.remove("locked");
        gate.style.display = "none";
        gateMsg.textContent = "";
        relaxRequired(form);
        try{ calcular(); }catch(e){}
      }else{
        const href = `https://wa.me/${WHATSAPP}`;
        gateMsg.innerHTML = ` clave incorrecta, comunicate al whatsapp para recibir la clave si no te la acordas <a href="${href}" target="_blank" rel="noopener">${WHATSAPP_DISPLAY}</a>`;
        gateMsg.style.color = "salmon";
        gateInp.focus();
        gateInp.select();
      }
    });
  }

  /* ----- CÁLCULO PARCIAL ----- */
  function calcular(){
    const items = getItems();
    const itemsConPrecio = items.filter(item => !item.note);
    const total = calcTotal(itemsConPrecio);

    const detalles = itemsConPrecio.map(item => {
      return item.unit > 0
        ? `${item.label}: ${item.value} (${money(item.unit)})`
        : `${item.label}: ${item.value}`;
    });

    const quoteTotal = $("#quoteTotal");
    const quoteDetail = $("#quoteDetail");
    const btnPdf = $("#btnPdfConfig");

    if(quoteTotal) quoteTotal.textContent = money(total);
    if(quoteDetail) quoteDetail.textContent = detalles.join(" · ");
    if(btnPdf) btnPdf.disabled = countSelections() < 1;

    return { total, detalles, items };
  }

  /* ----- LOGO -> DATA URL ----- */
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

  /* ----- PDF estilo presupuesto.html ----- */
  async function descargarPresupuesto(){
    const form = $("#configForm");
    if(form?.classList.contains("locked")){
      alert("Ingresá la clave para usar la calculadora.");
      return;
    }

    const { total, items } = calcular();
    const itemsConDetalle = items.filter(item => !item.note);

    if(itemsConDetalle.length < 1){
      alert("Elegí al menos un ítem para generar el presupuesto.");
      return;
    }

    if(!window.jspdf || !window.jspdf.jsPDF){
      alert("No se pudo cargar el generador de PDF. Revisá tu conexión e intentá nuevamente.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 40;

    // Logo arriba a la derecha, igual que presupuesto.js
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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Presupuesto", margin, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Cliente: A confirmar", margin, 78);
    doc.text("Servicio: Configuración de caña nueva", margin, 92);
    doc.text(`Fecha: ${new Date().toLocaleString("es-AR")}`, margin, 106);

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

    const addLine = (txt, fontStyle = "normal") => {
      const maxW = pageW - margin * 2;
      doc.setFont("helvetica", fontStyle);
      const split = doc.splitTextToSize(txt, maxW);
      split.forEach(line => {
        if (y > 770) {
          doc.addPage();
          y = 60;
        }
        doc.text(line, margin, y);
        y += 14;
      });
    };

    itemsConDetalle.forEach(item => {
      const precioTexto = item.unit > 0 ? `$${plainMoney(item.unit)} c/u` : "Sin cargo";
      const subtotalTexto = item.subtotal > 0 ? `$${plainMoney(item.subtotal)}` : "$0";
      const row = `• ${item.label}: ${item.value}  x${item.qty}  (${precioTexto})  =  ${subtotalTexto}`;
      addLine(row);
    });

    const nota = items.find(item => item.note);
    if(nota){
      y += 8;
      addLine(`${nota.label}: ${nota.value}`, "bold");
      y += 6;
    }

    y += 10;
    doc.setDrawColor(180);
    doc.line(margin, y, pageW - margin, y);
    y += 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`TOTAL: $${plainMoney(total)}`, margin, y);

    y += 24;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    addLine("Este presupuesto es estimativo y corresponde a lo seleccionado. Para coordinar el trabajo, respondé por WhatsApp adjuntando este PDF.");

    doc.save("presupuesto_configuracion_cana.pdf");
  }

  /* ----- SUBMIT A WHATSAPP ----- */
  function bindSubmit(){
    const form = $("#configForm");
    if(!form) return;

    form.addEventListener("submit", function(e){
      relaxRequired(form);

      if(form.classList.contains("locked")){
        e.preventDefault();
        alert("Ingresá la clave para usar la calculadora.");
        return;
      }

      const { total } = calcular();
      const nota = ($("#nota")?.value || "").trim();
      const selections = countSelections();

      if(selections < 1 && !nota){
        e.preventDefault();
        alert("Escribí una nota o elegí al menos un ítem para enviar por WhatsApp.");
        return;
      }

      e.preventDefault();
      const partes = [];
      ORDEN.forEach(id => {
        const v = valueOf(id);
        if(v) partes.push(`${labelText(id)}: ${v}`);
      });
      if(nota) partes.push(`Notas: ${nota}`);

      const msg = `Hola, quiero pedir una cotización:%0A` +
                  (partes.length ? partes.map(p=>`- ${p}`).join("%0A") : "- (sin selecciones)") +
                  `%0A%0ATotal estimado: ${money(total)}`;

      const url = `https://wa.me/${WHATSAPP}?text=${msg}`;
      window.open(url, "_blank");
    });
  }

  function bindRecalc(){
    const form = $("#configForm");
    if(!form) return;
    form.addEventListener("change", function(e){
      if(e.target.matches("select, input, textarea")) calcular();
    });
    form.addEventListener("input", function(e){
      if(e.target.matches("input, textarea")) calcular();
    });
  }

  function bindPdf(){
    const btnPdf = $("#btnPdfConfig");
    if(!btnPdf) return;
    btnPdf.addEventListener("click", descargarPresupuesto);
  }

  /* ----- INIT ----- */
  document.addEventListener("DOMContentLoaded", function(){
    initGate();
    bindRecalc();
    bindSubmit();
    bindPdf();
    try{ calcular(); }catch(e){}
  });

})();
