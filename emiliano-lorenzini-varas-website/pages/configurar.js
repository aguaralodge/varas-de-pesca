
import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function Configurar(){
  const [config, setConfig] = useState({
    colorCana: 'Negro',
    colorHilado: 'Rojo',
    pasahilos: 'Cerámica',
    portareel: 'Plástico',
    mango: 'Corcho',
  });

  const precios = {
    base: 10000,
    pasahilos: { 'Cerámica': 0, 'Acero': 1500, 'Titanio': 2500 },
    portareel: { 'Plástico': 0, 'Metálico': 2000, 'Grafito': 1500 },
    mango: { 'Corcho': 3000, 'EVA': 2000, 'Mixto': 3500 },
  };

  const total = useMemo(() => (
    precios.base +
    precios.pasahilos[config.pasahilos] +
    precios.portareel[config.portareel] +
    precios.mango[config.mango]
  ), [config]);

  const handleChange = (campo, valor) => setConfig(c => ({ ...c, [campo]: valor }));

  const handleSendWhatsApp = () => {
    const numero = '5493482632269'; // tu numero
    const mensaje = `Hola! Quiero pedir una caña personalizada.%0A- Color de caña: ${config.colorCana}%0A- Color del hilado: ${config.colorHilado}%0A- Pasahilos: ${config.pasahilos}%0A- Portareel: ${config.portareel}%0A- Mango: ${config.mango}%0ATOTAL: $${total}`;
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Head>
        <title>Configurar mi caña · Emiliano Lorenzini</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <header className="header">
        <a className="brand" href="/">
          <img src="/logo.svg" alt="Logo" width="44" height="44" />
          <div>
            <h1>Emiliano Lorenzini - Varas de Pesca</h1>
            <div className="tagline">Configurador</div>
          </div>
        </a>
        <Link href="/" className="btn" style={{background:'var(--blue)'}}>Volver</Link>
      </header>

      <main className="container">
        <div className="grid-2">
          <section className="card">
            <h3>Elegí tus opciones</h3>
            <div className="form">
              <div>
                <label>Color de la caña</label>
                <select className="select" value={config.colorCana} onChange={(e)=>handleChange('colorCana', e.target.value)}>
                  <option>Negro</option>
                  <option>Azul</option>
                  <option>Verde</option>
                  <option>Dorado</option>
                </select>
              </div>
              <div>
                <label>Color del hilado</label>
                <select className="select" value={config.colorHilado} onChange={(e)=>handleChange('colorHilado', e.target.value)}>
                  <option>Rojo</option>
                  <option>Negro</option>
                  <option>Dorado</option>
                  <option>Azul</option>
                </select>
              </div>
              <div>
                <label>Tipo de pasahilos</label>
                <select className="select" value={config.pasahilos} onChange={(e)=>handleChange('pasahilos', e.target.value)}>
                  <option>Cerámica</option>
                  <option>Acero</option>
                  <option>Titanio</option>
                </select>
              </div>
              <div>
                <label>Tipo de portareel</label>
                <select className="select" value={config.portareel} onChange={(e)=>handleChange('portareel', e.target.value)}>
                  <option>Plástico</option>
                  <option>Metálico</option>
                  <option>Grafito</option>
                </select>
              </div>
              <div>
                <label>Tipo de mango</label>
                <select className="select" value={config.mango} onChange={(e)=>handleChange('mango', e.target.value)}>
                  <option>Corcho</option>
                  <option>EVA</option>
                  <option>Mixto</option>
                </select>
              </div>
            </div>
          </section>

          <section className="card">
            <h3>Resumen</h3>
            <div className="summary">
              <p>Color de caña: <b>{config.colorCana}</b></p>
              <p>Color del hilado: <b>{config.colorHilado}</b></p>
              <p>Pasahilos: <b>{config.pasahilos}</b></p>
              <p>Portareel: <b>{config.portareel}</b></p>
              <p>Mango: <b>{config.mango}</b></p>
              <p className="total">Total: ${total}</p>
              <button className="btn whatsapp" onClick={handleSendWhatsApp}>Enviar pedido por WhatsApp</button>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Emiliano Lorenzini - Varas de Pesca
      </footer>
    </>
  );
}
