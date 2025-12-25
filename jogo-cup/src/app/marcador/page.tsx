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
  {src: "/logosPatros/anyla_logo.png"},
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
    // ESCUCHAR EL CAMBIO DE PARTIDOS
    socket.on("cambiar_partidos_marcador", (nuevosPartidos: Match[]) => {
      console.log("Recibidos nuevos partidos para el marcador:", nuevosPartidos);
      if (nuevosPartidos.length > 0) {
        const nuevaFaseId = nuevosPartidos[0].fase_id.id;
        if (nuevaFaseId !== faseId) {
          setFaseId(nuevaFaseId);
        }
        // Si ya estábamos suscritos a una fase diferente, nos desuscribimos
        if (faseActualRef.current && faseActualRef.current !== nuevaFaseId) {
          socket.emit("desuscribirse_fase", faseActualRef.current);
        }

        // Nos suscribimos a la nueva fase para recibir los goles en vivo
        if (nuevaFaseId) {
          socket.emit("suscribirse_fase", nuevaFaseId);
          faseActualRef.current = nuevaFaseId;
        }
      }

      setMatches(nuevosPartidos);
      
      // OPCIONAL: Reiniciar el tiempo al cambiar de partidos
      setSegundos(0);
      setCorriendo(false);
    });

    // Escuchar actualizaciones de goles (tu lógica actual)
    socket.on("partido_actualizado", (data: Match) => {
      setMatches((prev) =>
        prev.map((m) => (m.id === data.id ? { ...m, ...data } : m))
      );
    });

    return () => {
      if (faseActualRef.current) {
        socket.emit("desuscribirse_fase", faseActualRef.current);
      }
      socket.off("cambiar_partidos_marcador");
      socket.off("partido_actualizado");
    };
  }, []);

  useEffect(() => {
    const socket = connectSocket();
    console.log("Suscribiéndose a la fase actual del marcador:", faseId);
    socket.emit("suscribirse_fase", faseId);

    socket.on("partido_actualizado", (data: Match) => {
      setMatches((prev) =>
        prev.map((m) => (m.id === data.id ? { ...m, ...data } : m))
      );
    });

    return () => {
      socket.emit("desuscribirse_fase", faseId);
      socket.off("partido_actualizado");
    };
  }, [matches]);

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
     { /* <header className={styles['sb-header']}>
        <div className="carousel-container">
          <div className="carousel-track">
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((src, index) => (
              <div className="carousel-slide" key={index}>
                <img
                  src={src.src}
                  alt={`Sponsor ${index}`}
                  className={`carousel-logo logoMar-${index % LOGOS.length}`}
                />
              </div>
            ))}
          </div>
        </div>
      </header>*/}

      <main className={styles['sb-main']}>
        {/* Partido 1 */}
        <section className={styles['match-half']}>
          <MatchDisplay match={matches[0]} />
        </section>

        {/* Separador de Tiempo Central */}
        <div 
          className={styles.timeDivider} 
          onClick={toggleCronometro}
          style={{ cursor: 'pointer' }}
          title={corriendo ? "Pausar" : "Iniciar"}
        >
          <div className={styles.clock}>
            {formatearTiempo(segundos)}
          </div>
        </div>

        {/* Partido 2 */}
        <section className={styles['match-half']}>
          <MatchDisplay match={matches[1]} />
        </section>
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

function MatchDisplay({ match }: { match: Match | undefined }) {
  if (!match) return <div className={styles.noMatch}>Esperando partido...</div>;

  return (
    <div className={styles.matchRow}>
      {/* Columna Izquierda: Local */}
      <div className={`${styles.teamContainer} ${styles.local}`}>
        <img src={match.equipo_local?.logo_url} className={styles.sbLogoBig} alt="logo local" />
        <span className={styles.sbTeamName}>{match.equipo_local?.nombre}</span>
      </div>

      {/* Columna Central: Resultado */}
      <div className={styles.sbScoreWrapper}>
        <div className={styles.sbScoreBox}>
          <span className={styles.sbScore}>{match.goles_local}</span>
          <span className={styles.sbDash}>-</span>
          <span className={styles.sbScore}>{match.goles_visitante}</span>
        </div>
      </div>

      {/* Columna Derecha: Visitante */}
      <div className={`${styles.teamContainer} ${styles.visitante}`}>
        <img src={match.equipo_visitante?.logo_url} className={styles.sbLogoBig} alt="logo visitante" />
        <span className={styles.sbTeamName}>{match.equipo_visitante?.nombre}</span>
      </div>
    </div>
  );
}