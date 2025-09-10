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
'/assets/images/R1.jpeg',
'/assets/images/R10.jpeg',
'/assets/images/R11.jpeg',
'/assets/images/R12.jpeg',
'/assets/images/R13.jpeg',
'/assets/images/R14.jpeg',
'/assets/images/R15.jpeg',
'/assets/images/R16.jpeg',
'/assets/images/R17.jpeg',
'/assets/images/R18.jpeg',
'/assets/images/R19.jpeg',
'/assets/images/R2.jpeg',
'/assets/images/R20.jpeg',
'/assets/images/R21.jpeg',
'/assets/images/R22.jpeg',
'/assets/images/R23.jpeg',
'/assets/images/R24.jpeg',
'/assets/images/R25.jpeg',
'/assets/images/R26.jpeg',
'/assets/images/R27.jpeg',
'/assets/images/R28.jpeg',
'/assets/images/R29.jpeg',
'/assets/images/R3.jpeg',
'/assets/images/R30.jpeg',
'/assets/images/R4.jpeg',
'/assets/images/R5.jpeg',
'/assets/images/R6.jpeg',
'/assets/images/R7.jpeg',
'/assets/images/R8.jpeg',
'/assets/images/R9.jpeg',
  // Ejemplo: 'assets/images/REEL01.png','assets/images/REEL02.png',...
];
if (!IMGS_REELES.length) { IMGS_REELES = repeat(fallbackIMG, 8); }
