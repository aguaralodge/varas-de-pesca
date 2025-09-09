// Datos compartidos de galerías
// Si aún no tenés todas las fotos, dejamos un fallback que repite una imagen existente.
var fallbackIMG = 'assets/images/FOTO11.png';
function repeat(src, n){ return Array.from({length:n}, function(){ return src; }); }

// Reemplazá por tus rutas reales cuando subas tus imágenes
var IMGS_ARMADO = [
  // Ejemplo: 'assets/images/FOTO01.png','assets/images/FOTO02.png',...
];
if (!IMGS_ARMADO.length) { IMGS_ARMADO = repeat(fallbackIMG, 12); }

var IMGS_REELES = [
  // Ejemplo: 'assets/images/REEL01.png','assets/images/REEL02.png',...
];
if (!IMGS_REELES.length) { IMGS_REELES = repeat(fallbackIMG, 8); }
