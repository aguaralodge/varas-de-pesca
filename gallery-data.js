// Datos compartidos de galerías
// Si aún no tenés todas las fotos, dejamos un fallback que repite una imagen existente.
var fallbackIMG = 'assets/images/FOTO1.jpeg';
function repeat(src, n){ return Array.from({length:n}, function(){ return src; }); }

// Reemplazá por tus rutas reales cuando subas tus imágenes
var IMGS_ARMADO = [ 
 'assets/images/FOTO1.jpeg',
 'assets/images/FOTO2.jpeg',
 'assets/images/FOTO3.jpeg',
 'assets/images/FOTO4.jpeg',
 'assets/images/FOTO5.jpeg',
 'assets/images/FOTO6.jpeg',
 'assets/images/FOTO7.jpeg',
 'assets/images/FOTO8.jpeg',
 'assets/images/FOTO9.jpeg',
 'assets/images/FOTO10.jpeg',
 'assets/images/FOTO11.jpeg',
 'assets/images/FOTO12.jpeg',
 'assets/images/FOTO13.jpeg',
 'assets/images/FOTO14.jpeg',
 'assets/images/FOTO15.jpeg',
 'assets/images/FOTO16.jpeg',
 'assets/images/FOTO17.jpeg',
 'assets/images/FOTO18.jpeg',
 'assets/images/FOTO19.jpeg',
 'assets/images/FOTO20.jpeg',
 'assets/images/FOTO21.jpeg',
 'assets/images/FOTO22.jpeg',
 'assets/images/FOTO23.jpeg',
 'assets/images/FOTO24.jpeg',
 'assets/images/FOTO25.jpeg',
 'assets/images/FOTO26.jpeg',
 'assets/images/FOTO27.jpeg',
 'assets/images/FOTO28.jpeg',
 'assets/images/FOTO29.jpeg',
 'assets/images/FOTO30.jpeg',
 'assets/images/FOTO31.jpeg',
 'assets/images/FOTO32.jpeg',
 'assets/images/FOTO33.jpeg',
 'assets/images/FOTO34.jpeg',
 // Ejemplo: 'assets/images/FOTO01.png','assets/images/FOTO02.png',...
];
if (!IMGS_ARMADO.length) { IMGS_ARMADO = repeat(fallbackIMG, 12); }

var IMGS_REELES = [
  // Ejemplo: 'assets/images/REEL01.png','assets/images/REEL02.png',...
];
if (!IMGS_REELES.length) { IMGS_REELES = repeat(fallbackIMG, 8); }
