// v8 - Galería y calculadora (sin cambios de lógica), fotos finales
const ACCESS_CODE = 'EMI2025';
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
if(localStorage.getItem('calcAccessOk') === '1'){ unlock(); }
gateBtn?.addEventListener('click', ()=>{
  if((gateCode.value || '').trim() === ACCESS_CODE){ unlock(); }
  else { gateMsg.textContent = 'Código incorrecto. Volvé a intentar.'; }
});

const galleryItems = [
  'assets/images/FOTO1.jpeg','assets/images/FOTO2.jpeg','assets/images/FOTO3.jpeg',
  'assets/images/FOTO4.jpeg','assets/images/FOTO5.jpeg','assets/images/FOTO6.jpeg',
  'assets/images/FOTO7.jpeg','assets/images/FOTO8.jpeg','assets/images/FOTO9.jpeg',
  'assets/images/FOTO10.jpeg','assets/images/FOTO11.jpeg','assets/images/FOTO12.jpeg',
  'assets/images/FOTO13.jpeg','assets/images/FOTO14.jpeg','assets/images/FOTO15.jpeg',
  'assets/images/FOTO16.jpeg','assets/images/FOTO17.jpeg','assets/images/FOTO18.jpeg',
  'assets/images/FOTO19.jpeg','assets/images/FOTO20.jpeg','assets/images/FOTO21.jpeg',
  'assets/images/FOTO22.jpeg','assets/images/FOTO23.jpeg','assets/images/FOTO24.jpeg',
  'assets/images/FOTO25.jpeg','assets/images/FOTO26.jpeg','assets/images/FOTO27.jpeg',
  'assets/images/FOTO28.jpeg','assets/images/FOTO29.jpeg','assets/images/FOTO30.jpeg',
  'assets/images/FOTO31.jpeg','assets/images/FOTO32.jpeg','assets/images/FOTO33.jpeg',
  'assets/images/FOTO34.jpeg',
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

const lb = document.getElementById('lightbox');
const lbImg = lb?.querySelector('.lightbox-img');
const btnClose = lb?.querySelector('.lightbox-close');
const btnPrev = lb?.querySelector('.lightbox-prev');
const btnNext = lb?.querySelector('.lightbox-next');
let current = 0;
function openLB(i){ current = i; lbImg.src = galleryItems[i]; lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); }
function closeLB(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); }
function prev(){ openLB((current-1+galleryItems.length)%galleryItems.length); }
function next(){ openLB((current+1)%galleryItems.length); }
grid?.addEventListener('click', e=>{ const fig = e.target.closest('figure'); if(!fig) return; openLB(parseInt(fig.dataset.index,10)); });
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

const precios = {
  tipoVara: { 'Tournament': 30000, 'ya tengo Vara': 0 },
  color: { 'blanco': 20000, 'negro': 0, 'rojo': 25000, 'azul': 25000, 'verde': 25000 },
  largo: { '2,40': 0, '2,30': 0, '2,20': 0, '2,10': 0 },
  pasahilos: { '8 + puntera': 45000, '9 + puntera': 50000, '10 + puntera': 55000, '11 + puntera': 60000 },
  portaReel: { 'fuji': 25000, 'Masterguil': 10000 },
  portaAnzuelo: { 'con porta anzuelo': 5000, 'sin porta anzuelo': 0 },
  nombreLogo: { 'nombre + logo': 8000, 'nombre o logo solo': 5000 },
  tipoMango: { 'soga': 5000, 'termocontraible sin relleno': 10000, 'termocontraible con relleno': 15000, 'corcho aglomerado': 25000 },
  tacon: { 'con taco de goma': 3000, 'sin taco de goma': 0 }
};

function formatMoney(n){ return n.toLocaleString('es-AR', {style:'currency', currency:'ARS', maximumFractionDigits:0}); }
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

document.getElementById('configForm')?.addEventListener('submit', (e)=>{
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
