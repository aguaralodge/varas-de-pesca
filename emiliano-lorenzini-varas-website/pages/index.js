
import Head from 'next/head';
import Link from 'next/link';
import { galleryData } from '../galleryData';

function GalleryItem({ item, index }){
  return (
    <div>
      <img src={item.src} alt={item.title} onClick={() => window.dispatchEvent(new CustomEvent('openLightbox', {detail: index}))} />
      <div style={{fontSize:13, color:'var(--gray-700)', marginTop:6}}>{item.title}</div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Emiliano Lorenzini - Varas de Pesca</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Reparación, restauración y armado artesanal de cañas de pesca. Personalizá tu caña y envíala por WhatsApp." />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <header className="header">
        <a className="brand" href="/">
          <img src="/logo.svg" alt="Logo" width="44" height="44" />
          <div>
            <h1>Emiliano Lorenzini - Varas de Pesca</h1>
            <div className="tagline">Reparación · Restauración · Armado artesanal</div>
          </div>
        </a>
        <Link href="/configurar" className="btn">Configurar mi caña</Link>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-card">
            <h2>Personalizá tu caña de pesca</h2>
            <p>Elegí color de la caña, color de hilado, tipo de pasahilos, portareel y mango. Calculamos el precio al instante y me mandás tu pedido por WhatsApp.</p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              <Link href="/configurar" className="btn">Configurar mi caña</Link>
              <a className="btn secondary" href="#galeria">Ver galería</a>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <h3>Reparación y restauración</h3>
              <p>Guías, punteras, atados, barnizado y ajuste de componentes.</p>
            </div>
            <div className="card">
              <h3>Armado artesanal</h3>
              <p>Varas nuevas a medida, con elección de colores y componentes.</p>
            </div>
          </div>
        </section>

        <section id="galeria" style={{marginTop:20}}>
          <h3 style={{marginBottom:12}}>Galería de trabajos</h3>
          <div className="gallery">
            {galleryData.map((g, i) => (
              <GalleryItem key={i} item={g} index={i} />
            ))}
          </div>
        </section>

      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Emiliano Lorenzini - Varas de Pesca
      </footer>
    </>
  );
}
