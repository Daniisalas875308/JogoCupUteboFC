"use client";

import { useState, useEffect, useRef } from "react";
import { connectSocket } from "../../socket";
import { getPartidosPorFase } from "../../components/api";
import styles from './marcador.module.css';

const LOGOS = [
  {src: "/logosPatros/acnb_logo_letras.png"},
  {src: "/logosPatros/activaSalud_logo.png"},
  {src: "/logosPatros/aislamientos_logo.png"},
  {src: "/logosPatros/alagodent_logo.png"},
  {src: "/logosPatros/anyla_logo_rojo.png"},
  {src: "/logosPatros/bolas_logo.png"},
  {src: "/logosPatros/boxeo_logo.png"},
  {src: "/logosPatros/casa_ariza_logo.png"},
  {src: "/logosPatros/cintasa_logo.png"},
  {src: "/logosPatros/comarca_logo.png"},
  {src: "/logosPatros/david_logo_fondo.png"},
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
  {src: "/logosPatros/pulimasa_logo_negro.png"},
  {src: "/logosPatros/rodeni_logo.webp"},
  {src: "/logosPatros/sc_logo.png"},
  {src: "/logosPatros/soriano_logo.png"},
  {src: "/logosPatros/zadisa_logo.png"},
  {src: "/logosPatros/posada_logo.png"}
];
// Reutilizamos la interfaz
interface Match {
  id: number;
  goles_local: number;
  goles_visitante: number;
  estado: string;
  fase_id: { id: number; nombre: string };
  equipo_local: { nombre: string; logo_url: string } | null;
  equipo_visitante: { nombre: string; logo_url: string } | null;
}

export default function Marcador() {
  const [matches, setMatches] = useState<Match[]>([]);
  //const faseId = 1; // Ajusta según la fase que quieras mostrar por defecto
// --- LÓGICA DEL CRONÓMETRO ---
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [faseId, setFaseId] = useState<number | null>(1); // Ajusta según la fase que quieras mostrar por defecto
  const faseActualRef = useRef<number | null>(null);

  useEffect(() => {
    let intervalo: NodeJS.Timeout | null = null;

    if (corriendo) {
      intervalo = setInterval(() => {
        setSegundos((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalo) clearInterval(intervalo);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [corriendo]);

  useEffect(() => {
    const socket = connectSocket();
    socket.emit("join_marcador");

    const actualizarMarcadorDesdeBD = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marcador`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Match[] = await res.json();
        console.log("Partidos cargados:", data); // 👈 para debug
        setMatches(data);
        setSegundos(0); // Reiniciar el cronómetro al cargar nuevos partidos
        if (data.length > 0) {
          const nuevaFaseId = data[0].fase_id.id;
          if (faseActualRef.current !== nuevaFaseId) {
            if (faseActualRef.current) socket.emit("desuscribirse_fase", faseActualRef.current);
            console.log("Suscribiéndose a fase:", nuevaFaseId); // 👈 para debug
            socket.emit("suscribirse_fase", nuevaFaseId);
            faseActualRef.current = nuevaFaseId;
            setFaseId(nuevaFaseId);
          }
        }
      } catch (err) {
        console.error("Error cargando marcador desde BD:", err);
      }
    };

    // Cargar inicialmente
    actualizarMarcadorDesdeBD();

    // Escuchar actualizaciones de goles (tu lógica actual)
    socket.on("partido_actualizado", (data: Match) => {
      console.log("Partido actualizado recibido por socket:", data); // 👈 para debug
      setMatches((prev) =>
        prev.map((m) => (m.id === data.id ? { ...m, ...data } : m))
      );
    });

    // Escuchar actualizaciones por socket
    socket.on("cambiar_partidos_marcador", () => {
      actualizarMarcadorDesdeBD();
    });

    // Escuchar cambios globales del cronómetro
    socket.on("cronometro_cambiar_estado_global", ({ corriendo: estado }) => {
      setCorriendo(estado);
    });

    return () => {
      if (faseActualRef.current) socket.emit("desuscribirse_fase", faseActualRef.current);
      socket.off("cambiar_partidos_marcador");
    };
  }, []);



  // Función para formatear segundos a 00:00
  const formatearTiempo = (totalSegundos: number) => {
    const minutos = Math.floor(totalSegundos / 60);
    const segundosRestantes = totalSegundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segundosRestantes
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleCronometro = () => {
    setCorriendo(!corriendo);
  };

  return (
    <div className={styles['scoreboard-container']}>

      <main className={styles['sb-main']}>
        <div className={styles.matchesWrapper}>
          
          {/* PARTIDO 1 (Siempre se intenta mostrar arriba) */}
          {matches[0] && (
            <section className={styles.matchSection}>
              <MatchDisplay match={matches[0]} />
            </section>
          )}

          {/* RELOJ CENTRAL (Se mantiene en la misma posición) */}
          <div 
            className={styles.timeDivider} 
            onClick={toggleCronometro}
          >
            <div className={styles.clockBox}>
              {formatearTiempo(segundos)}
            </div>
          </div>

          <div 
            className={styles.logoDivider} 
          >
            <img src="/logo-final-fondo.png" alt="Logo Utebo FC" />
          </div>

          {/* PARTIDO 2 (Solo aparece si existe, debajo del reloj) */}
          {matches[1] && (
            <section className={styles.matchSection}>
              <MatchDisplay match={matches[1]} />
            </section>
          )}

        </div>
      </main>

      <footer className={styles['sb-footer']}>
        <div className={styles['carousel-container']}>
          <div className={styles['carousel-track']}>
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((src, index) => (
              <div className={styles['carousel-slide']} key={index}>
                <img
                  src={src.src}
                  alt={`Sponsor ${index}`}
                  className={`carousel-logo logoMar-${index % LOGOS.length}`}
                />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function MatchDisplay({ match, isBig }: { match: Match | undefined; isBig?: boolean }) {
  if (!match) return <div className={styles.noMatch}>Esperando partido...</div>;

  return (
    <div className={`${styles.matchRow} ${isBig ? styles.bigRow : ''}`}>
      <div className={`${styles.teamContainer} ${styles.local}`}>
        <img src={match.equipo_local?.logo_url} className={isBig ? styles.logoHuge : styles.sbLogoBig} alt="logo local" />
        <span className={isBig ? styles.teamNameHuge : styles.sbTeamName}>{match.equipo_local?.nombre}</span>
      </div>

      <div className={styles.sbScoreWrapper}>
        <div className={`${styles.sbScoreBox} ${isBig ? styles.scoreBoxBig : ''}`}>
          <span className={isBig ? styles.scoreHuge : styles.sbScore}>{match.goles_local}</span>
          <span className={isBig ? styles.dashHuge : styles.sbDash}>-</span>
          <span className={isBig ? styles.scoreHuge : styles.sbScore}>{match.goles_visitante}</span>
        </div>
      </div>

      <div className={`${styles.teamContainer} ${styles.visitante}`}>
        <img src={match.equipo_visitante?.logo_url} className={isBig ? styles.logoHuge : styles.sbLogoBig} alt="logo visitante" />
        <span className={isBig ? styles.teamNameHuge : styles.sbTeamName}>{match.equipo_visitante?.nombre}</span>
      </div>
    </div>
  );
}