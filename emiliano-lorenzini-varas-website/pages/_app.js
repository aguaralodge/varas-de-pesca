
import '../styles/globals.css';
import Head from 'next/head';
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script src="/lightbox.js" defer></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
