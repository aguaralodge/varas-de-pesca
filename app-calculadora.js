
/* =======================================================
   Calculadora Varas de Pesca — v3
   Cambio: mensaje de clave incorrecta con LINK a WhatsApp.
   Además mantiene:
   - Envío con texto libre (sin selecciones)
   - Cálculo parcial
   - Clave antes de usar
   ======================================================= */
(function(){
  "use strict";

  /* ----- CONFIG ----- */
  const PASSWORD = "AGUARA25";         // Cambiá acá si querés otra clave
  const WHATSAPP = "5493482632269";  // Número para el envío (con código de país sin '+')
  const WHATSAPP_DISPLAY = "3482632269"; // Texto que se ve en el mensaje de error

  // Mapa de precios (ajustá montos si querés)
  const PRECIOS = {
    tipoVara: { "Tournament": 41200, "ya tengo Vara": 0 },
    color: { "blanco": 20000, "negro": 0, "rojo": 25000, "azul": 25000, "verde": 25000 },
    largo: { "2,40": 0, "2,30": 0, "2,20": 0, "2,10": 0 },
    pasahilos: { "8 + puntera": 45000 , "9 + puntera": 50000, "10 + puntera": 55000, "11 + puntera": 60000 },
    portaReel: { "fuji (Japon)": 30000, "Masterguil": 10000, "Con Gatillo(Generico)": 15000 },
    portaAnzuelo: { "con porta anzuelo": 5000, "sin porta anzuelo": 0 },
    nombreLogo: { "nombre + logo": 8000, "nombre o logo solo": 5000 , "sin nombre o logo" : 0 },
    tipoMango: { "soga": 8000, "termocontraible sin relleno": 15000, "termocontraible con relleno": 20000, "corcho aglomerado": 35000 },
    tacon: { "con taco de goma": 3000, "sin taco de goma": 0 }
  };

  /* ----- HELPERS ----- */
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const money = n => n.toLocaleString("es-AR", {style:"currency", currency:"ARS", maximumFractionDigits:0});
  const labelText = id => {
    const lab = $$(`label[for="${id}"]`)[0];
    return lab ? lab.textContent.trim() : id;
  };
  const valueOf = id => {
    const el = $("#"+id);
    return el ? (el.value||"").trim() : "";
  };

  /* ----- GATE / CLAVE ----- */
  function relaxRequired(form){
    // Permitir envío parcial o solo texto: quitamos validaciones HTML5
    form?.querySelectorAll("[required]").forEach(el => el.removeAttribute("required"));
  }

  function initGate(){
    const form    = $("#configForm");
    const gate    = $("#gateCard");
    const gateBtn = $("#gateBtn");
    const gateInp = $("#gateCode");
    const gateMsg = $("#gateMsg");

    if(!form || !gate || !gateBtn || !gateInp) return;

    form.classList.add("locked");

    gateBtn.addEventListener("click", function(){
      const code = (gateInp.value||"").trim();
      if(code === PASSWORD){
        form.classList.remove("locked");
        gate.style.display = "none";
        gateMsg.textContent = "";
        relaxRequired(form);
        try{ calcular(); }catch(e){}
      }else{
        // Mensaje personalizado con LINK a WhatsApp
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
    let total = 0;
    const detalles = [];

    Object.keys(PRECIOS).forEach(function(id){
      const val = valueOf(id);
      if(!val) return; // vacío no suma
      const mapa = PRECIOS[id] || {};
      const precio = (val in mapa) ? (mapa[val]||0) : 0;
      total += precio;
      detalles.push(precio>0 ? `${labelText(id)}: ${val} (${money(precio)})` : `${labelText(id)}: ${val}`);
    });

    const quoteTotal = $("#quoteTotal");
    const quoteDetail = $("#quoteDetail");
    if(quoteTotal) quoteTotal.textContent = money(total);
    if(quoteDetail) quoteDetail.textContent = detalles.join(" · ");

    return { total, detalles };
  }

  function countSelections(){
    return Object.keys(PRECIOS).reduce((acc,id)=> acc + (valueOf(id)?1:0), 0);
  }

  /* ----- SUBMIT A WHATSAPP ----- */
  function bindSubmit(){
    const form = $("#configForm");
    if(!form) return;

    form.addEventListener("submit", function(e){
      relaxRequired(form); // por si acaso

      if(form.classList.contains("locked")){
        e.preventDefault();
        alert("Ingresá la clave para usar la calculadora.");
        return;
      }

      const { total } = calcular();
      const nota = ($("#nota")?.value || "").trim();
      const selections = countSelections();

      // Ahora permitimos enviar con 0 selecciones y SIN nota, si querés eso cambiá este bloque:
      // En esta versión, exigimos ALGO: o selecciones o nota.
      if(selections < 1 && !nota){
        e.preventDefault();
        alert("Escribí una nota o elegí al menos un ítem para enviar por WhatsApp.");
        return;
      }

      e.preventDefault();
      const partes = [];
      Object.keys(PRECIOS).forEach(id => {
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

  /* ----- INIT ----- */
  document.addEventListener("DOMContentLoaded", function(){
    initGate();
    bindRecalc();
    bindSubmit();
    try{ calcular(); }catch(e){}
  });

})();
