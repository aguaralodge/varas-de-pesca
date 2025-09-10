// v7: Galería con fotos finales y calculadora con acceso por código
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
  'assets/images/FOTO1.png','assets/images/FOTO2.png','assets/images/FOTO3.png',
  'assets/images/FOTO4.png','assets/images/FOTO5.png','assets/images/FOTO6.png',
  'assets/images/FOTO7.png','assets/images/FOTO8.png','assets/images/FOTO9.png',
  'assets/images/FOTO10.png','assets/images/FOTO11.png','assets/images/FOTO12.png',
  'assets/images/FOTO13.png','assets/images/FOTO14.png','assets/images/FOTO15.png',
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
