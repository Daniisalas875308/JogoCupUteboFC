import { useState, useEffect  } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { resultsData } from "../../data/resultsData"; // Ajusta la ruta según tu estructura
import { FiChevronDown } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { IoIosFootball } from "react-icons/io";
import { IoFootball } from "react-icons/io5";
import { getPartidosPorFase, updateResultadoPartido } from "../api";
import { Pencil } from "lucide-react";
import EditMatchModal from "../../components/EditMatchModal";
import { connectSocket, disconnectSocket } from "../../socket";




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


export default function ResultsJr() {
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombre');

    if (token && nombre) {
      setUser(nombre); // usuario logueado
    } else {
      setUser(null); // no logueado
    }
  }, []);


  interface Match {
    id: number;
    goles_local: number;
    goles_visitante: number;
    fecha: string;
    estado: string;
    equipo_local: { nombre: string } | null;
    equipo_visitante: { nombre: string } | null;
  }

  const handleEdit = (match: Match) => setEditingMatch(match);


const handleSave = async (
    id: number,
    golesLocal: number,
    golesVisitante: number,
    estado: string
  ): Promise<void> => {
    console.log("Guardando resultados:", golesLocal, golesVisitante, "del partido ID:", id, "con estado:", estado);
    try {
      // Llamamos a la función del servicio que ya usa API_URL
      await updateResultadoPartido(id, golesLocal, golesVisitante, estado);
      // No hace falta refreshResults(), el WebSocket actualizará la UI automáticamente
    } catch (err) {
      console.error("Error al actualizar partido:", err);
    }
  };

  interface PartidoActualizado {
  id: number;
  goles_local: number;
  goles_visitante: number;
  estado: string;
  fecha: string;
  equipo_local: { nombre: string } | null;
  equipo_visitante: { nombre: string } | null;
}

interface PartidoCreado {
  tipo: "creado";
  partido: PartidoActualizado; // obligatorio
}

interface PartidoEliminado {
  tipo: "eliminado";
  partidoId: number; // obligatorio
}

type PartidoCambio = PartidoCreado | PartidoEliminado;


  const [lastUpdate, setLastUpdate] = useState("--:--");
  const [selectedFase, setSelectedFase] = useState<keyof typeof resultsData>("grupoA");
  const currentFase = resultsData[selectedFase];
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const fases = [
    { value: "grupoA", label: "Grupo A" },
    { value: "grupoB", label: "Grupo B" },
    { value: "semisA", label: "Semis Oro" },
    { value: "semisB", label: "Semis Plata" },
    { value: "finalB", label: "Final Plata" },
    { value: "finalA", label: "Final Oro" },
  ];

  const faseMap: Record<string, number> = {
    grupoA: 15,
    grupoB: 16,
    grupoC: 17,
    semisA: 20,
    semisB: 21,
    finalB: 22,
    finalA: 23,
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
        console.error(err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, [selectedFase]);


  useEffect(() => {
    const socket = connectSocket();

    const faseId = faseMap[selectedFase];
    socket.emit("suscribirse_fase", faseId);

    socket.on("partido_actualizado", (data: PartidoActualizado) => {
      console.log("⚽Partido actualizado:", data);
      setMatches((prev) =>
        prev.map((m) => (m.id === data.id ? { ...m, ...data } : m))
      );
      setLastUpdate(new Date().toLocaleTimeString());
    });

    socket.on("partidos_cambio", (event: PartidoCambio) => {
    if (event.tipo === "creado") {
      // TypeScript sabe que 'partido' existe
      setMatches((prev) => [...prev, event.partido]);
    } else {
      // TypeScript sabe que 'partidoId' existe
      setMatches((prev) => prev.filter((m) => m.id !== event.partidoId));
    }
  });


    return () => {
      socket.emit("desuscribirse_fase", faseId);
      socket.off("partido_actualizado");
      socket.off("partidos_cambio");
    };
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
                  {user  ? ( 
                    <span className={`badge-editar badge-transparent`} title="Editar" onClick={() => handleEdit(match)}>
                      <Pencil className="icono-editar" />
                    </span>
                  ) : (
                    null
                  )}
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

      {editingMatch && (
        <EditMatchModal
          match={editingMatch}
          onClose={() => setEditingMatch(null)}
          onSave={handleSave}
        />
      )}

      <div className="stats-grid-results">
        <div className="jogo-card stats-card-results">
          <div className="card-content">
            <div className="stat-item-results">
              <div className="stat-icon-results bg-blue">
                <FaTrophy className="iconoNuevo"/>
              </div>
              <div className="stat-info-results">
                <p className="stat-label-results"><strong>Partidos Jugados</strong></p>
                <p className="stat-value-results jogo-primary">0</p>
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
                <p className="stat-value-results text-green">0</p>
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
                <p className="stat-value-results jogo-accent">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
