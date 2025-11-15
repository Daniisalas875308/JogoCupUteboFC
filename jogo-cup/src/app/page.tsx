"use client"

import { FaSquareXTwitter, FaInstagram, FaTiktok  } from "react-icons/fa6";

import Head from "next/head";
import { useEffect, useState } from "react";
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
        <title>JOGO CUP - Dashboard del Torneo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
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
        {/* Submenú de Sub-16 */}
        {activeTab.startsWith("under16") && (
          <Under16 section={activeTab.replace("under16-", "")} />
        )}
      </main>

      <footer className="footer">
      <div className="container-footer">
        <p><strong>&copy; 2025 JogoCup. Todos los derechos reservados.</strong></p>
        <nav>
          <ul className="links">
            <li><FaTiktok className="iconoTiktok"/></li>
            <li><FaInstagram className="iconoInsta"/></li>
            <li><FaSquareXTwitter className="iconoX"/></li>
          </ul>
        </nav>
      </div>
    </footer>
    </>
  );
}
