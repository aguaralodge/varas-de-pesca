// Datos compartidos de galerías
// Si aún no tenés todas las fotos, dejamos un fallback que repite una imagen existente.
var fallbackIMG = 'assets/images/FOTO11.png';
function repeat(src, n){ return Array.from({length:n}, function(){ return src; }); }

// Reemplazá por tus rutas reales cuando subas tus imágenes
var IMGS_ARMADO = [
  'assets/images/FOTO1.JPEG','assets/images/FOTO2.JPEG','assets/images/FOTO3.JPEG','assets/images/FOTO4.JPEG'
  'assets/images/FOTO5.JPEG','assets/images/FOTO6.JPEG','assets/images/FOTO7.JPEG','assets/images/FOTO8.JPEG'
  'assets/images/FOTO9.JPEG','assets/images/FOTO10.JPEG','assets/images/FOTO11.JPEG','assets/images/FOTO12.JPEG'
  'assets/images/FOTO13.JPEG','assets/images/FOTO14.JPEG','assets/images/FOTO15.JPEG','assets/images/FOTO16.JPEG'
  'assets/images/FOTO17.JPEG','assets/images/FOTO18.JPEG','assets/images/FOTO19.JPEG','assets/images/FOTO20.JPEG'
  'assets/images/FOTO21.JPEG','assets/images/FOTO22.JPEG','assets/images/FOTO23.JPEG','assets/images/FOTO24.JPEG'
  'assets/images/FOTO25.JPEG','assets/images/FOTO26.JPEG','assets/images/FOTO27.JPEG','assets/images/FOTO28.JPEG'
  'assets/images/FOTO29.JPEG','assets/images/FOTO30.JPEG','assets/images/FOTO31.JPEG','assets/images/FOTO32.JPEG'
  'assets/images/FOTO33.JPEG','assets/images/FOTO34.JPEG'
  // Ejemplo: 'assets/images/FOTO01.png','assets/images/FOTO02.png',...
];
if (!IMGS_ARMADO.length) { IMGS_ARMADO = repeat(fallbackIMG, 12); }

var IMGS_REELES = [
  // Ejemplo: 'assets/images/REEL01.png','assets/images/REEL02.png',...
];
if (!IMGS_REELES.length) { IMGS_REELES = repeat(fallbackIMG, 8); }
