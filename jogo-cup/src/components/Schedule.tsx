"use client";
import { FaClock , FaTrophy, FaAward, FaMapMarkerAlt  } from "react-icons/fa";
import { FaBolt } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { CgMediaLive } from "react-icons/cg";
import { FaCalendarDay } from "react-icons/fa";
import { useState, useEffect } from "react";
import { scheduleData } from "../data/scheduleData"; // Ajusta la ruta según tu estructura
import { getPartidosPorDia } from "./api"; 

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "terminado":
      return "badge-red";
    case "en vivo":
      return "badge-green";
    case "pendiente":
      return "badge-blue";
    case "actividad":
      return "badge-yellow";
    case "ceremonia":
      return "badge-gold";
    default:
      return "badge-gray";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "terminado":
      return <ImCross />;
    case "en vivo":
      return <CgMediaLive />;
    case "pendiente":
      return <FaClock />;
    case "actividad":
      return <FaBolt />;
    case "ceremonia":
      return <FaTrophy />;
    default:
      return <FaAward />;
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "terminado":
      return "Terminado";
    case "en vivo":
      return "En Vivo";
    case "programado":
      return "Programado";
    case "actividad":
      return "Actividad";
    case "ceremonia":
      return "Ceremonia";
    default:
      return status;
  }
}

function useIsMobile(maxWidth: number = 730) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= maxWidth);
    checkScreen(); // al cargar
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, [maxWidth]);

  return isMobile;
}

export default function Schedule() {
  interface Match {
    id: number;
    goles_local: number;
    goles_visitante: number;
    fecha: string;
    estado: string;
    fase_id: { nombre: string } | null;
    campo: string;
    equipo_local: { nombre: string } | null;
    equipo_visitante: { nombre: string } | null;
  }
  
  const [selectedDay, setSelectedDay] = useState<"friday" | "saturday" | "sunday">("friday");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const dates: Record<typeof selectedDay, { title: string; titleEscrito: string; dateEscrito:string; date: string }> = {
    friday: { title: "Viernes", titleEscrito: "Viernes - Fase de grupos", dateEscrito: "26 de Diciembre, 2025", date: "2025-12-26" },
    saturday: { title: "Sábado", titleEscrito: "Sábado - Fase de grupos", dateEscrito: "27 de Diciembre, 2025", date: "2025-12-27" },
    sunday: { title: "Domingo", titleEscrito: "Domingo - Fase Final", dateEscrito: "28 de Diciembre, 2025", date: "2025-12-28" },
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPartidosPorDia(dates[selectedDay].date);
        setMatches(data);
      } catch (err) {
        console.error("Error cargando partidos:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedDay]);

  const formatTime = (isoTs: string) =>
    new Date(isoTs).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Madrid",
    });
    
  return (
    <div className="tab-content animate-fade-in" id="schedule">
      <div className="schedule-controls">
        <button
          className={`btn ${selectedDay === "friday" ? "btn-primary active" : "btn-outline"}`}
          onClick={() => setSelectedDay("friday")}
        >
          <i className=""><FaCalendarDay  /> </i>
          Viernes
        </button>
        <button
          className={`btn ${selectedDay === "saturday" ? "btn-primary active" : "btn-outline"}`}
          onClick={() => setSelectedDay("saturday")}
        >
          <i className="fas fa-calendar"><FaCalendarDay  /> </i>
          Sábado
        </button>
        <button
          className={`btn ${selectedDay === "sunday" ? "btn-primary active" : "btn-outline"}`}
          onClick={() => setSelectedDay("sunday")}
        >
          <i className="fas fa-calendar"><FaCalendarDay  /> </i>
          Domingo
        </button>
      </div>

      <div className="jogo-card schedule-card">
        <div className="card-header">
          <h3 className="card-title jogo-primary" id="scheduleTitle">
            <FaCalendarDay /> {dates[selectedDay].titleEscrito}
          </h3>
          <p className="schedule-day" id="scheduleDate">{dates[selectedDay].dateEscrito}</p>
        </div>
        <div className="card-content match-group">
          <div className="matches-container" id="matchesContainer">
            {!loading && matches.length === 0 && <p>No hay partidos este día.</p>}
              {matches.map((match) => (
                <div className="match-item" key={match.id}>
                  <div className="match-info">
                    <div className="match-time">
                      <div className="match-time-value jogo-primary">{formatTime(match.fecha)}</div>
                    </div>
                    {isMobile ? (
                      <>
                        <div className="match-teams">
                          <div className="match-title">{match.equipo_visitante?.nombre} vs {match.equipo_local?.nombre}</div>
                          <div className="match-desc">{match.fase_id?.nombre ?? "Sin fase"}</div>
                        </div>
                        <div className="match-field">
                          <FaMapMarkerAlt className="icono-ubi" />
                          <span>Campo {match.campo}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="match-field">
                          <FaMapMarkerAlt /> <span>Campo {match.campo}</span>
                        </div>
                        <div className="match-teams">
                          <div className="match-title">{match.equipo_visitante?.nombre} vs {match.equipo_local?.nombre}</div>
                          <div className="match-desc">{match.fase_id?.nombre ?? "Sin fase"}</div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="match-status">
                    <span className={`badge ${getStatusBadgeClass(match.estado)}`}>
                      {getStatusIcon(match.estado)} {getStatusText(match.estado)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
