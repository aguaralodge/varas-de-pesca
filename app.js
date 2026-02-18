calcBtn.addEventListener("click", () => {
  const costo = parseFloat($("costo")?.value);
  const gananciaPct = parseFloat($("margen")?.value); 
  const comisionPct = parseFloat($("comision")?.value);

  if ([costo, gananciaPct, comisionPct].some((v) => Number.isNaN(v))) {
    alert("Completá costo, ganancia y comisión.");
    return;
  }

  // convertir porcentaje a decimal
  const ganancia = gananciaPct / 100;
  const comision = comisionPct / 100;

  // primero aplicamos ganancia sobre costo
  const precioBase = costo * (1 + ganancia);

  // luego cubrimos comisión (ej: MercadoPago)
  const precioReal = precioBase / (1 - comision);

  const precioRedondeado = Math.ceil(precioReal / 100) * 100;
  const precioPsico = Math.max(0, precioRedondeado - 100);

  $("precioReal").textContent = Math.round(precioReal);
  $("precioRedondeado").textContent = precioRedondeado;
  $("precioPsico").textContent = precioPsico;
});


