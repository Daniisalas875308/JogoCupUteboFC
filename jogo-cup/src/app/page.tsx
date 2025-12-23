"use client"

import { FaSquareXTwitter, FaInstagram, FaTiktok } from "react-icons/fa6";
import Head from "next/head";
import { useEffect, useState } from "react";
// ... tus otros imports se mantienen igual
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import Overview from "../components/Overview";
import Groups from "../components/Groups";
import Schedule from "../components/Schedule";
import Activities from "../components/Activities";
import Results from "../components/Results";
import Under16 from "../components/Under16";
import Streaming from "../components/Streaming";
import Budget from "../components/Budget";
import Documents from "../components/Documents";

const LOGOS = [
  {src: "/logosPatros/acnb_logo.png"},
  {src: "/logosPatros/activaSalud_logo.png"},
  {src: "/logosPatros/aislamientos_logo.png"},
  {src: "/logosPatros/alagodent_logo.png"},
  {src: "/logosPatros/anyla_logo.png"},
  {src: "/logosPatros/bolas_logo.png"},
  {src: "/logosPatros/boxeo_logo.png"},
  {src: "/logosPatros/casa_ariza_logo.png"},
  {src: "/logosPatros/cintasa_logo.png"},
  {src: "/logosPatros/comarca_logo.png"},
  {src: "/logosPatros/davidFisio_logo.png"},
  {src: "/logosPatros/fabrisem_logo.png"},
  {src: "/logosPatros/fuentes_logo.png"},
  {src: "/logosPatros/guallar_logo.png"},
  {src: "/logosPatros/ina_logo.png"},
  {src: "/logosPatros/inmunolife_logo.png"},
  {src: "/logosPatros/jvc_logo.png"},
  {src: "/logosPatros/laPalmera_logo.png"},
  {src: "/logosPatros/montajes_logo.png"},
  {src: "/logosPatros/pasos_logo.png"},
  {src: "/logosPatros/pavimentos_logo_sinfondo.png"},
  {src: "/logosPatros/pulimasa_logo_mini.png"},
  {src: "/logosPatros/rodeni_logo.webp"},
  {src: "/logosPatros/sc_logo.png"},
  {src: "/logosPatros/soriano_logo.png"},
  {src: "/logosPatros/zadisa_logo.png"},
  {src: "/logosPatros/posada_logo.png"}
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('admin');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return (
    <>
      <Head>
        <title>JogoCup - Torneo fútbol 7 - Utbeo, Zaragoza</title>
        <meta name="description" content="JogoCup organiza torneos de fútbol 7 en Utbeo, Zaragoza. No es solo fútbol, también es diversión, comida y fiestas. Vamos a hacer Utebo más grande" />
        <meta name="keywords" content="JogoCup, fútbol 7, torneos fútbol, Utbeo, Zaragoza" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <Header />

      <main className="container main-content">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "overview" && <Overview />}
        {activeTab === "groups" && <Groups />}
        {activeTab === "schedule" && <Schedule />}
        {activeTab === "activities" && <Activities />}
        {activeTab === "results" && <Results />}
        {activeTab === "under16" && <Under16 />}
        {activeTab === "streaming" && <Streaming />}
        {activeTab === "budget" && <Budget />}
        {activeTab === "documents" && <Documents />}
        {activeTab.startsWith("under16") && (
          <Under16 section={activeTab.replace("under16-", "")} />
        )}
      </main>


      <footer className="footer">
        {/* --- SECCIÓN CARRUSEL INFINITO --- */}
        <div className="carousel-container">
          <div className="carousel-track">
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((src, index) => (
              <div className="carousel-slide" key={index}>
               { /*<img src={src.src} alt={`Sponsor ${index}`} style={{ height: src.height}} />*/}
                <img
                  src={src.src}
                  alt={`Sponsor ${index}`}
                  className={`carousel-logo logo-${index % LOGOS.length}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="footer-separator"></div>
        <div className="container-footer">
          <p><strong>&copy; 2025 JogoCup. Todos los derechos reservados.</strong></p>
          <nav>
            <ul className="links">
              <li><FaTiktok className="iconoTiktok" /></li>
              <li><FaInstagram className="iconoInsta" /></li>
              <li><FaSquareXTwitter className="iconoX" /></li>
            </ul>
          </nav>
        </div>
      </footer>
    </>
  );
}