// Funciones utilitarias para renderizar galerías
function renderGallery(containerId, arr) {
  var el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = (arr || []).map(function(src, i){
    return '<figure><img src="' + src + '" alt="Trabajo ' + (i+1) + '" loading="lazy" decoding="async" /></figure>';
  }).join('');
}
