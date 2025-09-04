
# Emiliano Lorenzini - Varas de Pesca (sitio)
Proyecto listo para desplegar en Vercel. Incluye galería con lightbox y configurador que envía pedidos por WhatsApp.

## Estructura importante
- `pages/` - rutas Next.js (index.js, configurar.js)
- `public/gallery/` - imágenes de la galería
- `galleryData.js` - lista de imágenes y descripciones (editable)
- `styles/globals.css` - estilos globales y lightbox styles

## Cómo usar localmente
1. Descomprimir la carpeta.
2. Abrir terminal en la carpeta.
3. Ejecutar:
   ```bash
   npm install
   npm run dev
   ```
4. Abrir: http://localhost:3000

## Cómo desplegar en Vercel
1. Crear cuenta en vercel.com
2. Hacer "New Project" -> "Import" -> subir esta carpeta o importarla desde GitHub.
3. Deploy y en pocos segundos estará online.

## Editar galerías y descripciones
Editar `galleryData.js` (cada objeto tiene `src` y `title`).

## Número de WhatsApp
El número configurado es: 5493482632269. Cambiar en `pages/configurar.js` si necesitás.

