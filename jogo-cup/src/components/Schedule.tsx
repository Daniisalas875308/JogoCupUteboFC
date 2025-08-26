"use client";
import { FaClock , FaTrophy, FaAward, FaMapMarkerAlt  } from "react-icons/fa";
import { FaBolt } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { CgMediaLive } from "react-icons/cg";
import { FaCalendarDay } from "react-icons/fa";
import { useState, useEffect } from "react";
import { scheduleData } from "../data/scheduleData"; // Ajusta la ruta según tu estructura

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "terminado":
      return "badge-red";
    case "en vivo":
      return "badge-green";
    case "programado":
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
    case "programado":
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
  const [selectedDay, setSelectedDay] = useState<keyof typeof scheduleData>("friday");
  const currentDay = scheduleData[selectedDay];
  const isMobile = useIsMobile(); // 👈 así ya tienes la variable booleana

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
            <i className="fas fa-calendar"><FaCalendarDay  /> </i>
            {currentDay.title}
          </h3>
          <p className="schedule-day" id="scheduleDate">{currentDay.date}</p>
        </div>
        <div className="card-content match-group">
          <div className="matches-container" id="matchesContainer">
            {currentDay.matches.map((match, idx) => (
              <div className={`match-item ${match.isActivity ? 'activity' : ''}`} key={idx}>
                <div className="match-info">
                  <div className="match-time">
                    <div className="match-time-value jogo-primary">{match.time}</div>
                  </div>
                    {isMobile ? (
                      <>
                        <div className="match-teams">
                          <div className="match-title">{match.teams[1]}</div>
                          <div className="match-desc">{match.teams[0]}</div>
                        </div>
                        <div className="match-field">
                          <FaMapMarkerAlt className="icono-ubi"/>
                          <span>{match.field}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="match-field">
                          <i className="fas fa-map-marker-alt"><FaMapMarkerAlt /></i>
                          <span>{match.field}</span>
                        </div>
                        <div className="match-teams">
                          <div className="match-title">{match.teams[1]}</div>
                          <div className="match-desc">{match.teams[0]}</div>
                        </div>
                      </>
                    )}
                </div>
                <div className={`match-status`}>
                  <span className={`badge ${getStatusBadgeClass(match.status)}`}>
                    {getStatusIcon(match.status)}
                    {getStatusText(match.status)}
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
