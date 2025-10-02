import { useState, useEffect  } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { resultsData } from "../data/resultsData"; // Ajusta la ruta según tu estructura
import { FiChevronDown } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { IoIosFootball } from "react-icons/io";
import { IoFootball } from "react-icons/io5";
import { getPartidosPorFase } from "./api";


function getStatusText(status: string) {
  switch (status) {
    case "fin":
      return "Final";
    case "live":
      return "En Vivo";
    case "pendiente":
      return "Por jugar";
    default:
      return status;
  }
}

export default function Results() {
  interface Match {
    id: number;
    goles_local: number;
    goles_visitante: number;
    fecha: string;
    estado: string;
    equipo_local: { nombre: string } | null;
    equipo_visitante: { nombre: string } | null;
  }

  const [lastUpdate, setLastUpdate] = useState("--:--");
  const [selectedFase, setSelectedFase] = useState<keyof typeof resultsData>("grupoA");
  const currentFase = resultsData[selectedFase];
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const fases = [
    { value: "grupoA", label: "Grupo A" },
    { value: "grupoB", label: "Grupo B" },
    { value: "grupoC", label: "Grupo C" },
    { value: "grupoD", label: "Grupo D" },
    { value: "grupoE", label: "Grupo E" },
    { value: "grupoF", label: "Grupo F" },
    { value: "octavos", label: "Octavos" },
    { value: "cuartos", label: "Cuartos" },
    { value: "semis", label: "Semifinal" },
    { value: "final", label: "Final" },
  ];

  const faseMap: Record<string, number> = {
    grupoA: 1,
    grupoB: 2,
    grupoC: 3,
    grupoD: 4,
    grupoE: 5,
    grupoF: 6,
    octavos: 7,
    cuartos: 8,
    semis: 9,
    final: 10,
  };
  
  const [open, setOpen] = useState(false);

  const refreshResults = () => {
    setLastUpdate(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const data = await getPartidosPorFase(faseMap[selectedFase]);
        setMatches(data);
      } catch (err) {
        console.error("Error cargando partidos por fase:", err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [selectedFase]);
  
  return (
    <div className="tab-content animate-fade-in">
      <div className="results-header">
        <button className="btn btn-act" onClick={refreshResults}>
          <FiRefreshCw className="iconoPequeño" /> 
          <strong>Actualizar</strong>
        </button>
        {/* Dropdown para seleccionar fase */}
        <div className="dropdown-container">
          <button className="dropdown-toggle" onClick={() => setOpen(!open)}>
            {fases.find((f) => f.value === selectedFase)?.label || "Selecciona fase"}
            <FiChevronDown className={`chevron ${open ? "open" : ""}`} />
          </button>

          {open && (
            <ul className="dropdown-menu">
              {fases.map((fase) => (
                <li
                  key={fase.value}
                  className={`dropdown-item ${fase.value === selectedFase ? "active" : ""}`}
                  onClick={() => {
                    setSelectedFase(fase.value as typeof selectedFase); // <-- esto dispara el useEffect
                    setOpen(false);
                  }}
                >
                  {fase.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="results-subtitle">
          Última actualización: <span>{lastUpdate}</span>
        </p>
      </div>

      <div className="jogo-card schedule-card">
        <div className="card-header">
          <h3 className="results-card-title jogo-primary">
            <IoFootball /> Partidos {currentFase.title}
          </h3>
        </div>
        <div className="card-content">
          {loading && <p>Cargando partidos...</p>}
          {!loading && matches.length === 0 && <p>No hay resultados en esta fase todavía.</p>}

          {!loading && matches.map((match, idx) => (
            <div className={`${match.estado}-match`} key={idx}>
              <div className="match-info-results">
                <div className="match-status-results">
                  <span className={`badge ${match.estado}-badge`}>
                    {getStatusText(match.estado)}
                  </span>
                </div>
                <div className="match-centrado">
                  <div className="match-teams-live">
                    <div className="team-name">{(match.equipo_local?.nombre ?? "Equipo 1")}</div>
                    <div className="match-score">
                      <div className="score-value jogo-primary">
                        {match.goles_local} - {match.goles_visitante}
                      </div>
                    </div>
                    <div className="team-name">{(match.equipo_visitante?.nombre ?? "Equipo 2")}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-grid-results">
        <div className="jogo-card stats-card-results">
          <div className="card-content">
            <div className="stat-item-results">
              <div className="stat-icon-results bg-blue">
                <FaTrophy className="iconoNuevo"/>
              </div>
              <div className="stat-info-results">
                <p className="stat-label-results"><strong>Partidos Jugados</strong></p>
                <p className="stat-value-results jogo-primary">8</p>
              </div>
            </div>
          </div>
        </div>

        <div className="jogo-card stats-card-results">
          <div className="card-content">
            <div className="stat-item-results">
              <div className="stat-icon-results bg-green">
                <IoIosFootball className="iconoNuevo"/>
              </div>
              <div className="stat-info-results">
                <p className="stat-label-results"><strong>Goles Marcados</strong></p>
                <p className="stat-value-results text-green">24</p>
              </div>
            </div>
          </div>
        </div>

        <div className="jogo-card stats-card-results">
          <div className="card-content">
            <div className="stat-item-results">
              <div className="stat-icon-results bg-yellow">
                <FaUsers className="iconoNuevo"/>
              </div>
              <div className="stat-info-results">
                <p className="stat-label-results"><strong>Actividades</strong></p>
                <p className="stat-value-results jogo-accent">2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
