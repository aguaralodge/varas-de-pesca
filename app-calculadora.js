
/* =======================================================
   Calculadora Varas de Pesca — JS standalone
   - No modifica tu HTML ni tu CSS
   - Bloqueo por clave ANTES de la calculadora
   - Cálculo PARCIAL (suma lo que haya seleccionado)
   - Breakdown y envío por WhatsApp
   ======================================================= */

(function(){
  "use strict";

  /* ---------- CONFIGURACIÓN ---------- */
  // Cambiá la clave acá. Si querés, podés moverla a un atributo data- del HTML.
  const PASSWORD = "EL2025";

  // Mapa de precios por ID de select y por texto de opción EXACTO
  const PRECIOS = {
    tipoVara: {
      "Tournament": 0,
      "ya tengo Vara": 0
    },
    color: {
      "blanco": 0, "negro": 0, "rojo": 0, "azul": 0, "verde": 0
    },
    largo: {
      "2,40": 60000, "2,30": 55000, "2,20": 50000, "2,10": 45000
    },
    pasahilos: {
      "8 + puntera": 0, "9 + puntera": 4000, "10 + puntera": 8000, "11 + puntera": 12000
    },
    portaReel: {
      "fuji": 45000, "Masterguil": 30000
    },
    portaAnzuelo: {
      "con porta anzuelo": 5000, "sin porta anzuelo": 0
    },
    nombreLogo: {
      "nombre + logo": 15000, "nombre o logo solo": 8000
    },
    tipoMango: {
      "soga": 0,
      "termocontraible sin relleno": 12000,
      "termocontraible con relleno": 18000,
      "corcho aglomerado": 28000
    },
    tacon: {
      "con taco de goma": 7000, "sin taco de goma": 0
    }
  };

  // Teléfono de WhatsApp (con código país, sin +)
  const WHATSAPP = "5493482632269";

  /* ---------- HELPERS ---------- */
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  function money(n){
    return n.toLocaleString("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits: 0 });
  }

  function valorSelect(id){
    const el = $("#"+id);
    if(!el) return "";
    return (el.value || "").trim();
  }

  function textoLabel(id){
    const lab = $$(`label[for="${id}"]`)[0];
    return lab ? lab.textContent.trim() : id;
  }

  /* ---------- BLOQUEO POR CLAVE ---------- */
  function initGate(){
    const gateCard  = $("#gateCard");
    const gateCode  = $("#gateCode");
    const gateBtn   = $("#gateBtn");
    const gateMsg   = $("#gateMsg");
    const form      = $("#configForm");

    if(!gateCard || !gateCode || !gateBtn || !form) return;

    // Aseguramos que arranca bloqueado
    form.classList.add("locked");

    gateBtn.addEventListener("click", () => {
      const code = (gateCode.value || "").trim();
      if(code === PASSWORD){
        form.classList.remove("locked");
        gateCard.style.display = "none";
        gateMsg.textContent = "";
        // Calcula apenas se desbloquea
        try{ calcular(); }catch(e){}
      }else{
        gateMsg.textContent = "Clave incorrecta";
        gateMsg.style.color = "salmon";
        gateCode.focus();
        gateCode.select();
      }
    });
  }

  /* ---------- CÁLCULO PARCIAL ---------- */
  function calcular(){
    const campos = Object.keys(PRECIOS);
    let total = 0;
    const detalles = [];

    campos.forEach(id => {
      const val = valorSelect(id);
      if(!val){ return; } // vacío suma 0
      const mapa = PRECIOS[id] || {};
      const precio = (val in mapa) ? (mapa[val] || 0) : 0;
      total += precio;
      if(precio>0){
        detalles.push(`${textoLabel(id)}: ${val} (${money(precio)})`);
      }else{
        detalles.push(`${textoLabel(id)}: ${val}`);
      }
    });

    const quoteTotal = $("#quoteTotal");
    const quoteDetail = $("#quoteDetail");

    if(quoteTotal) quoteTotal.textContent = money(total);
    if(quoteDetail) quoteDetail.textContent = detalles.join(" · ");
    return total;
  }

  function bindEvents(){
    // Recalcular ante cualquier cambio en selects o inputs del form
    $("#configForm")?.addEventListener("change", e => {
      if(e.target.matches("select, input, textarea")) calcular();
    });
    $("#configForm")?.addEventListener("input", e => {
      if(e.target.matches("input, textarea")) calcular();
    });

    // Envío a WhatsApp con resumen
    $("#configForm")?.addEventListener("submit", e => {
      e.preventDefault();
      const total = calcular();
      const partes = [];

      Object.keys(PRECIOS).forEach(id => {
        const val = valorSelect(id);
        if(val) partes.push(`${textoLabel(id)}: ${val}`);
      });
      const nota = ($("#nota")?.value || "").trim();
      if(nota) partes.push(`Notas: ${nota}`);

      const msg = `Hola, quiero pedir una cotización:%0A` +
                  partes.map(p=>`- ${p}`).join("%0A") +
                  `%0A%0ATotal estimado: ${money(total)}`;

      const url = `https://wa.me/${WHATSAPP}?text=${msg}`;
      window.open(url, "_blank");
    });
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initGate();
    bindEvents();
    // Primer cálculo (por si hay valores precargados)
    try{ calcular(); }catch(e){}
  });

})();
