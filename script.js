/* ========= 1) PASSCODE (no cambia tu CSS) ========= */
(function initPasscode() {
  // Busca un botón/link que diga "Ingresar" dentro de la sección Configurar
  const ingresarBtn = Array.from(document.querySelectorAll('button, a'))
    .find(el => /ingresar/i.test(el.textContent.trim()));
  if (!ingresarBtn) return;

  const PASSWORD = 'EL2025'; // Cambiá la clave acá si querés
  // El contenedor real de la calculadora (donde están los selects)
  // Si tenés un div propio, poné id="calc-content" y esto será más directo
  // Si no, el script igual la detecta por los labels que están ahí adentro.
  let calcContainer = null;

  function findCalcContainer() {
    const labels = Array.from(document.querySelectorAll('label'));
    const got = labels.filter(l =>
      /tipo de vara|color|largo|cantidad de pasahilos|tipo de porta reel|porta anzuelo|nombre\s*\/\s*logo|tipo de mango|talón de la caña/i
        .test(l.textContent)
    );
    if (got.length) {
      // usamos el ancestro común más cercano como "contenedor"
      let node = got[0];
      while (node && node.parentElement) {
        if (got.every(l => node.contains(l))) return node;
        node = node.parentElement;
      }
    }
    return null;
  }

  calcContainer = document.getElementById('calc-content') || findCalcContainer();

  // Oculta la calculadora hasta ingresar clave (sin tocar estilos)
  if (calcContainer) {
    calcContainer.setAttribute('aria-hidden', 'true');
    calcContainer.style.display = 'none';
  }

  ingresarBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const code = prompt('Ingresá la clave para usar la calculadora:');
    if (code === PASSWORD) {
      if (calcContainer) {
        calcContainer.removeAttribute('aria-hidden');
        calcContainer.style.display = '';
      }
      // Opcional: ocultar el bloque de “Acceso restringido” si es un contenedor separado
      const accessNote = Array.from(document.querySelectorAll('*'))
        .find(el => /Acceso restringido|Ingresá el código/i.test(el.textContent));
      if (accessNote && !calcContainer?.contains(accessNote)) {
        accessNote.style.display = 'none';
      }
      // Calcula apenas se habilita
      try { calcTotal(); } catch {}
    } else {
      alert('Clave incorrecta');
    }
  });
})();

/* ========= 2) CÁLCULO PARCIAL ========= */
/* Definí acá tus precios según el TEXTO EXACTO de cada opción */
const PRECIOS = {
  // Tipo de vara
  'Tipo de vara': {
    'Tournament': 0,
    'ya tengo Vara': 0
  },
  // Color (si no querés que sume, dejalos en 0)
  'Color': {
    'blanco': 0, 'negro': 0, 'rojo': 0, 'azul': 0, 'verde': 0
  },
  // Largo
  'Largo': {
    '2,40': 60000, '2,30': 55000, '2,20': 50000, '2,10': 45000
  },
  // Cantidad de pasahilos
  'Cantidad de pasahilos': {
    '8 + puntera': 0, '9 + puntera': 4000, '10 + puntera': 8000, '11 + puntera': 12000
  },
  // Tipo de porta reel
  'Tipo de porta reel': {
    'fuji': 45000, 'Masterguil': 30000
  },
  // Porta anzuelo
  'Porta anzuelo': {
    'con porta anzuelo': 5000, 'sin porta anzuelo': 0
  },
  // Nombre / logo
  'Nombre / logo': {
    'nombre + logo': 15000, 'nombre o logo solo': 8000
  },
  // Tipo de mango
  'Tipo de mango': {
    'soga': 0, // si "soga" es opción base
    'termocontraible sin relleno': 12000,
    'termocontraible con relleno': 18000,
    'corcho aglomerado': 28000
  },
  // Talón de la caña (parte inferior)
  'Talón de la caña (parte inferior)': {
    'con taco de goma': 7000,
    'sin taco de goma': 0
  }
};

// Si querés extras numéricos, podés agregarlos acá (ej.: contado de anillas extra, etc.)
const EXTRAS = {
  // ejemplo: 'Anillas extra': { id: 'anillas-extra', precioUnidad: 4000 }
};

/* Helpers */
function normalizarTexto(s) {
  return (s || '').toString().trim().replace(/\s+/g, ' ').toLowerCase();
}
function precioDe(opcion, mapa) {
  // Busca por coincidencia parcial en keys del mapa
  const key = Object.keys(mapa).find(k => normalizarTexto(opcion).includes(normalizarTexto(k)));
  return key ? (mapa[key] || 0) : 0;
}
function findLabelByText(txt) {
  const t = normalizarTexto(txt);
  return Array.from(document.querySelectorAll('label')).find(l =>
    normalizarTexto(l.textContent).includes(t)
  );
}
function selectInLabel(label) {
  if (!label) return null;
  return label.querySelector('select') || label.querySelector('input, textarea');
}

function getTotal() {
  let total = 0;

  // Recorre cada “categoría” definida en PRECIOS
  Object.entries(PRECIOS).forEach(([categoria, mapa]) => {
    const label = findLabelByText(categoria);
    const sel = selectInLabel(label);
    if (!sel) return; // si no existe, suma 0 (cálculo parcial)
    const val = (sel.value || '').toString();
    if (!val) return; // vacío = 0
    total += precioDe(val, mapa);
  });

  // EXTRAS numéricos (si los hubiera)
  Object.values(EXTRAS).forEach(ex => {
    const el = document.getElementById(ex.id);
    if (!el) return;
    const n = parseInt(el.value, 10);
    if (!isNaN(n) && n > 0) total += n * ex.precioUnidad;
  });

  return total;
}

function setTotal(ars) {
  // 1) si existe #total, úsalo
  const elById = document.getElementById('total');
  if (elById) {
    elById.textContent = ars.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
    return;
  }
  // 2) sino, buscá el elemento que muestra el $0 bajo "Presupuesto estimado"
  const header = Array.from(document.querySelectorAll('*')).find(n =>
    /presupuesto estimado/i.test(n.textContent)
  );
  if (!header) return;
  // busca el primer elemento que tenga un texto que empiece con $
  let candidate = null;
  const walker = document.createTreeWalker(header.parentNode, NodeFilter.SHOW_ELEMENT, null);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (/^\s*\$/.test(node.textContent.trim())) { candidate = node; break; }
  }
  if (candidate) {
    candidate.textContent = ars.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  }
}

function calcTotal() {
  const total = getTotal();
  setTotal(total);
}

/* Eventos: recalcular en cada cambio */
document.addEventListener('change', (e) => {
  if (e.target.matches('select, input, textarea')) calcTotal();
});
document.addEventListener('input', (e) => {
  if (e.target.matches('input[type=number], input[type=text], textarea')) calcTotal();
});

/* Primer cálculo (por si hay valores por defecto) */
document.addEventListener('DOMContentLoaded', () => {
  try { calcTotal(); } catch {}
});
