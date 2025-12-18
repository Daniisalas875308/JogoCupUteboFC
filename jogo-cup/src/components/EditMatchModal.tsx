import { useState } from "react";
import { FiChevronDown } from "react-icons/fi"; // Asegúrate de importar este icono
// Primero define el tipo Match (o impórtalo si ya existe en otro archivo)
interface Match {
  id: number;
  goles_local: number;
  goles_visitante: number;
  fecha: string;
  estado: string;
  equipo_local: { nombre: string } | null;
  equipo_visitante: { nombre: string } | null;
}

const matchStates = [
 { value: 'pendiente', label: 'Por jugar' },
 { value: 'live', label: 'En juego' },
 { value: 'fin', label: 'Finalizado' },
];

// Define los tipos de props
interface EditMatchModalProps {
  match: Match;
  onClose: () => void;
  onSave: (id: number, golesLocal: number, golesVisitante: number, estado: string) => void;
}

// Declara el componente tipado
export default function EditMatchModal({ match, onClose, onSave }: EditMatchModalProps) {
  const [localGoals, setLocalGoals] = useState<number>(match.goles_local);
  const [awayGoals, setAwayGoals] = useState<number>(match.goles_visitante);
  const [matchState, setMatchState] = useState<string>(match.estado);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const handleSave = () => {
    onSave(match.id, localGoals, awayGoals, matchState);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-edit">
        <h1 className="gradient-text">Editar resultado del partido</h1>
        <h3>{match.equipo_local?.nombre} vs {match.equipo_visitante?.nombre}</h3>

        <div className="modal-form-edit">
          <div className="goal-input">
            <p>Goles {match.equipo_local?.nombre}:</p>
            <div className="input-with-buttons">
              <button type="button" className="boton-restar-1" onClick={() => setLocalGoals(prev => Math.max(0, prev - 1))}>-</button>
              <input
                type="number"
                min="0"
                value={localGoals}
                onChange={(e) => setLocalGoals(Number(e.target.value))}
              />
              <button type="button" className="boton-sumar-1" onClick={() => setLocalGoals(localGoals + 1)}>+</button>
            </div>
          </div>

          <div className="goal-input">
            <p>Goles {match.equipo_visitante?.nombre}:</p>
            <div className="input-with-buttons">
              <button className="boton-restar-2" type="button" onClick={() => setAwayGoals(prev => Math.max(0, prev - 1))}>-</button>
              <input
                type="number"
                min="0"
                value={awayGoals}
                onChange={(e) => setAwayGoals(Number(e.target.value))}
              />
              <button className="boton-sumar-2" type="button" onClick={() => setAwayGoals(awayGoals + 1)}>+</button>
            </div>
          </div>
          <div className="estado-select">
            <p className="estado-select-label">Estado del partido:</p>
              <div className="dropdown-container">
                <button 
                  className="dropdown-toggle estado-toggle" 
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  >
                    {matchStates.find((s) => s.value === matchState)?.label || "Selecciona Estado"}
                    <FiChevronDown className={`chevron ${isStateDropdownOpen ? "open" : ""}`} />
                  </button>
                  {isStateDropdownOpen && (
                    <ul className="dropdown-menu estado-menu">
                      {matchStates.map((state) => (
                        <li
                          key={state.value}
                          className={`dropdown-item ${state.value === matchState ? "active" : ""}`}
                          onClick={() => {
                          setMatchState(state.value); 
                          setIsStateDropdownOpen(false);
                          }}
                          >
                          {state.label}
                        </li>
                      ))}
                  </ul>
                  )}
            </div>
          </div>

          <div className="modal-buttons">
              <button onClick={onClose}>Cancelar</button>
              <button onClick={handleSave}>Guardar</button>
          </div>
          </div>
      </div>
    </div>
  );
}
