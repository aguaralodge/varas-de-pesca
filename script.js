// === Acceso con código ===
const ACCESS_CODE = 'EMI2025'; // <-- Cambiá este valor por el código que le darás a tus clientes
const gateCard = document.getElementById('gateCard');
const gateCode = document.getElementById('gateCode');
const gateBtn = document.getElementById('gateBtn');
const gateMsg = document.getElementById('gateMsg');
const formEl = document.getElementById('configForm');

function unlock(){
  formEl.classList.remove('locked');
  gateCard.style.display = 'none';
  localStorage.setItem('calcAccessOk','1');
}

if(localStorage.getItem('calcAccessOk') === '1'){
  unlock();
}

gateBtn?.addEventListener('click', ()=>{
  if((gateCode.value || '').trim() === ACCESS_CODE){
    unlock();
  } else {
    gateMsg.textContent = 'Código incorrecto. Volvé a intentar.';
  }
});

// === GALERÍA SIN DESCRIPCIONES ===
const galleryItems = [
  
  'assets/images/FOTO1.JPEG',
  'assets/images/FOTO2.JPEG',
  'assets/images/FOTO3.JPEG',
  'assets/images/FOTO4.JPEG',
  'assets/images/FOTO5.JPEG',
  'assets/images/FOTO6.JPEG',
  'assets/images/FOTO7.JPEG',
  'assets/images/FOTO8.JPEG',
  'assets/images/FOTO9.JPEG',
  'assets/images/FOTO10.JPEG',
  'assets/images/FOTO11.JPEG',
  'assets/images/FOTO12.JPEG',
  'assets/images/FOTO13.JPEG',
  'assets/images/FOTO14.JPEG',
  'assets/images/FOTO15.JPEG',
  'assets/images/FOTO16.JPEG',
  'assets/images/FOTO17.JPEG',
  'assets/images/FOTO18.JPEG',
];

const grid = document.getElementById('galleryGrid');
if(grid){
  galleryItems.forEach((src, idx)=>{
    const fig = document.createElement('figure');
    fig.innerHTML = `<img src="${src}" alt="Foto ${idx+1}" loading="lazy">`;
    fig.dataset.index = idx;
    grid.appendChild(fig);
  });
}

// Lightbox básico
const lb = document.getElementById('lightbox');
const lbImg = lb?.querySelector('.lightbox-img');
const btnClose = lb?.querySelector('.lightbox-close');
const btnPrev = lb?.querySelector('.lightbox-prev');
const btnNext = lb?.querySelector('.lightbox-next');
let current = 0;

function openLB(i){
  current = i;
  lbImg.src = galleryItems[i];
  lb.classList.add('open');
  lb.setAttribute('aria-hidden','false');
}
function closeLB(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden','true');
}
function prev(){ openLB((current-1+galleryItems.length)%galleryItems.length); }
function next(){ openLB((current+1)%galleryItems.length); }

grid?.addEventListener('click', e=>{
  const fig = e.target.closest('figure');
  if(!fig) return;
  openLB(parseInt(fig.dataset.index,10));
});
btnClose?.addEventListener('click', closeLB);
btnPrev?.addEventListener('click', prev);
btnNext?.addEventListener('click', next);
lb?.addEventListener('click', e=>{ if(e.target === lb) closeLB(); });
document.addEventListener('keydown', e=>{
  if(!lb.classList.contains('open')) return;
  if(e.key === 'Escape') closeLB();
  if(e.key === 'ArrowLeft') prev();
  if(e.key === 'ArrowRight') next();
});

// === CALCULADORA DE PRESUPUESTO (lista ampliada) ===
const tipoVaraEl = document.getElementById('tipoVara');
const colorEl = document.getElementById('color');
const largoEl = document.getElementById('largo');
const pasahilosEl = document.getElementById('pasahilos');
const portaReelEl = document.getElementById('portaReel');
const portaAnzueloEl = document.getElementById('portaAnzuelo');
const nombreLogoEl = document.getElementById('nombreLogo');
const tipoMangoEl = document.getElementById('tipoMango');
const taconEl = document.getElementById('tacon');
const quoteTotal = document.getElementById('quoteTotal');
const quoteDetail = document.getElementById('quoteDetail');
const notaEl = document.getElementById('nota');

const precios = {
  tipoVara: {
    'Tournament': 30000,
    'ya tengo Vara': 0,
  },
  color: {
    'blanco': 20000,
    'negro': 0,
    'rojo': 25000,
    'azul': 25000,
    'verde': 25000,
  },
  largo: {
    '2,40': 0,
    '2,30': 0,
    '2,20': 0,
    '2,10': 0,
  },
  pasahilos: {
    '8 + puntera': 45000,
    '9 + puntera': 50000,
    '10 + puntera': 55000,
    '11 + puntera': 60000,
  },
  portaReel: {
    'fuji': 25000,
    'Masterguil': 10000,
  },
  portaAnzuelo: {
    'con porta anzuelo': 5000,
    'sin porta anzuelo': 0,
  },
  nombreLogo: {
    'nombre + logo': 8000,
    'nombre o logo solo': 5000,
  },
  tipoMango: {
    'soga': 5000,
    'termocontraible sin relleno': 10000,
    'termocontraible con relleno': 15000,
    'corcho aglomerado': 25000,
  },
  tacon: {
    'con taco de goma': 3000,
    'sin taco de goma': 0,
  }
};

function formatMoney(n){
  return n.toLocaleString('es-AR', {style:'currency', currency:'ARS', maximumFractionDigits:0});
}

function calcular(){
  const tv = precios.tipoVara[tipoVaraEl.value] ?? 0;
  const col = precios.color[colorEl.value] ?? 0;
  const lar = precios.largo[largoEl.value] ?? 0;
  const pas = precios.pasahilos[pasahilosEl.value] ?? 0;
  const pr  = precios.portaReel[portaReelEl.value] ?? 0;
  const paz = precios.portaAnzuelo[portaAnzueloEl.value] ?? 0;
  const nl  = precios.nombreLogo[nombreLogoEl.value] ?? 0;
  const man = precios.tipoMango[tipoMangoEl.value] ?? 0;
  const tac = precios.tacon[taconEl.value] ?? 0;

  if([tipoVaraEl, colorEl, largoEl, pasahilosEl, portaReelEl, portaAnzueloEl, nombreLogoEl, tipoMangoEl, taconEl].some(el=>!el.value)){
    quoteTotal.textContent = '$0';
    quoteDetail.textContent = 'Completá todas las opciones para ver el presupuesto.';
    return 0;
  }

  const total = tv + col + lar + pas + pr + paz + nl + man + tac;
  quoteTotal.textContent = formatMoney(total);

  quoteDetail.textContent = [
    `Tipo de vara: ${formatMoney(tv)}`,
    `Color: ${formatMoney(col)}`,
    `Largo: ${formatMoney(lar)}`,
    `Pasahilos: ${formatMoney(pas)}`,
    `Porta reel: ${formatMoney(pr)}`,
    `Porta anzuelo: ${formatMoney(paz)}`,
    `Nombre/Logo: ${formatMoney(nl)}`,
    `Tipo de mango: ${formatMoney(man)}`,
    `Talón (taco): ${formatMoney(tac)}`
  ].join(' + ');

  return total;
}

[tipoVaraEl, colorEl, largoEl, pasahilosEl, portaReelEl, portaAnzueloEl, nombreLogoEl, tipoMangoEl, taconEl].forEach(el=>{
  el?.addEventListener('change', calcular);
  el?.addEventListener('input', calcular);
});
calcular();

formEl?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const total = calcular();
  const msgLines = [
    'Hola Emiliano, quiero una cotización:',
    `• Tipo de vara: ${tipoVaraEl.value}`,
    `• Color: ${colorEl.value}`,
    `• Largo: ${largoEl.value}`,
    `• Cantidad de pasahilos: ${pasahilosEl.value}`,
    `• Porta reel: ${portaReelEl.value}`,
    `• Porta anzuelo: ${portaAnzueloEl.value}`,
    `• Nombre/Logo: ${nombreLogoEl.value}`,
    `• Tipo de mango: ${tipoMangoEl.value}`,
    `• Talón: ${taconEl.value}`,
    `• Presupuesto estimado: ${formatMoney(total)}`,
  ];
  const nota = document.getElementById('nota').value;
  if(nota) msgLines.push(`• Notas: ${nota}`);
  const msg = encodeURIComponent(msgLines.join('\n'));
  const url = `https://wa.me/5493482632269?text=${msg}`;
  window.open(url, '_blank');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth'});
    }
  });
});
