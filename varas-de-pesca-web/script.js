// Populate gallery and lightbox
const galleryItems = [
  {src:'assets/images/foto_01.svg', caption:'Personalización de varas: acción y potencia a tu medida.'},
  {src:'assets/images/foto_02.svg', caption:'Reparación de punteras y pasahilos con terminaciones prolijas.'},
  {src:'assets/images/foto_03.svg', caption:'Armado completo con componentes de calidad.'},
  {src:'assets/images/foto_04.svg', caption:'Alineación precisa para un mejor lance.'},
  {src:'assets/images/foto_05.svg', caption:'Acabados resistentes al agua salada.'},
  {src:'assets/images/foto_06.svg', caption:'Grip confortable para jornadas largas.'},
  {src:'assets/images/foto_07.svg', caption:'Balanceo y ajuste fino del blank.'},
  {src:'assets/images/foto_08.svg', caption:'Restauración de cañas antiguas.'},
  {src:'assets/images/foto_09.svg', caption:'Pasahilos SIC y micro guías a elección.'},
  {src:'assets/images/foto_10.svg', caption:'Detalles prolijos en atados y terminaciones.'},
  {src:'assets/images/foto_11.svg', caption:'Varas pensadas para tu estilo de pesca.'},
  {src:'assets/images/foto_12.svg', caption:'Asesoramiento honesto y post-venta.'},
];

const grid = document.getElementById('galleryGrid');
if(grid){
  galleryItems.forEach((item, idx)=>{
    const fig = document.createElement('figure');
    fig.innerHTML = `<img src="${item.src}" alt="Trabajo ${idx+1}" loading="lazy"><figcaption>${item.caption}</figcaption>`;
    fig.dataset.index = idx;
    grid.appendChild(fig);
  });
}

// Simple lightbox
const lb = document.getElementById('lightbox');
const lbImg = lb?.querySelector('.lightbox-img');
const lbCap = lb?.querySelector('.lightbox-caption');
const btnClose = lb?.querySelector('.lightbox-close');
const btnPrev = lb?.querySelector('.lightbox-prev');
const btnNext = lb?.querySelector('.lightbox-next');
let current = 0;

function openLB(i){
  current = i;
  const item = galleryItems[i];
  lbImg.src = item.src;
  lbCap.textContent = item.caption;
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

// Form -> WhatsApp
const form = document.getElementById('configForm');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const tipo = document.getElementById('tipo').value;
  const largo = document.getElementById('largo').value;
  const accion = document.getElementById('accion').value;
  const comp = document.getElementById('componentes').value;
  const presup = document.getElementById('presupuesto').value;
  const nota = document.getElementById('nota').value;

  const msg = `Hola Emiliano, quiero una cotización:%0A` +
              `• Tipo: ${tipo}%0A` +
              `• Largo: ${largo} m%0A` +
              `• Acción: ${accion}%0A` +
              `• Componentes: ${comp}%0A` +
              (presup ? `• Presupuesto estimado: $${presup}%0A` : '') +
              (nota ? `• Notas: ${encodeURIComponent(nota)}%0A` : '');

  const url = `https://wa.me/5493482632269?text=${msg}`;
  window.open(url, '_blank');
});

// Smooth anchor scroll for nicer UX
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
