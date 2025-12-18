import { FaCalendar, FaTrophy  } from "react-icons/fa";

export default function Overview() {
  return (
    <div className="tab-content active animate-fade-in">
      <div className="stats-grid">
        {/* Total Equipos */}
        <div className="jogo-card stats-card">
            <div className="stat-item">
              <div className="stat-info">
                <p className="stat-icon">🛡️</p>
                <p className="stat-label">Total Equipos</p>
                <p className="stat-value text-orange">24</p>
                <p className="stat-detail">6 grupos de 4</p>
              </div>
            </div>
        </div>

        {/* Total Partidos */}
        <div className="jogo-card stats-card">
            <div className="stat-item">
              <div className="stat-info">
                <p className="stat-icon">⚽</p>
                <p className="stat-label">Total Partidos</p>
                <p className="stat-value text-blue">51</p>
                <p className="stat-detail">Grupos + 15 eliminatorias</p>
              </div>
            </div>
        </div>

        {/* Duración */}
        <div className="jogo-card stats-card">
            <div className="stat-item">
              <div className="stat-info">
                <p className="stat-icon">🗓️</p>
                <p className="stat-label">Fechas</p>
                <p className="stat-value text-red">26-27-28 </p>
                <p className="stat-detail">de Diciembre</p>
              </div>
            </div>
        </div>

        {/* Premio Mayor */}
        <div className="jogo-card stats-card">
            <div className="stat-item">
              <div className="stat-info">
                <p className="stat-icon">💸</p>
                <p className="stat-label">Primer premio</p>
                <p className="stat-value text-green">2.500€</p>
                <p className="stat-detail">para el campeón</p>
              </div>
            </div>
        </div>
      </div>

      {/* Cronograma y Premios */}
      <div className="overview-grid">
        {/* Cronograma */}
        <div className="jogo-card">
          <div className="card-header">
            <h3 className="card-title jogo-primary">
              <FaCalendar className="iconoNuevo iconosResumen"/>
              Cronograma del Torneo
            </h3>
          </div>
          <div className="card-content">
            <div className="prize-item prize-blue">
              <div className="prize-info">
                <div>
                  <h4 className="prize-title text-blue">Viernes 26</h4>
                  <p className="prize-desc">Fase de Grupos (12 partidos)</p>
                </div>
              </div>
              <div className="time-bold">17:00 - 23:00</div>
            </div>

            <div className="prize-item prize-blue">
              <div className="prize-info">
                <div>
                  <h4 className="prize-title text-blue">Sábado 27</h4>
                  <p className="prize-desc">Fase de Grupos (24 partidos)</p>
                </div>
              </div>
              <div className="time-bold">09:00 - 23:00</div>
            </div>

            <div className="prize-item prize-blue">
              <div className="prize-info">
                <div>
                  <h4 className="prize-title text-blue">Domingo 28</h4>
                  <p className="prize-desc">Fase Final (15 partidos)</p>
                </div>
              </div>
              <div className="time-bold">09:00 - 21:00</div>
            </div>
          </div>
        </div>

        {/* Premios */}
        <div className="jogo-card">
          <div className="card-header">
            <h3 className="card-title jogo-primary">
              <FaTrophy className="iconoNuevo iconosResumen"/>
              Premios y Reconocimientos
            </h3>
          </div>
          <div className="card-content">
            <div className="prize-item prize-gold">
              <div className="prize-info">
                <div>
                  <h4 className="prize-title text-gold">Campeón</h4>
                  <p className="prize-desc">Primer lugar</p>
                </div>
              </div>
              <div className="prize-amount">2.500€</div>
            </div>

            <div className="prize-item prize-silver">
              <div className="prize-info">
                <div>
                  <h4 className="prize-title text-silver">Subcampeón</h4>
                  <p className="prize-desc">Segundo lugar</p>
                </div>
              </div>
              <div className="prize-amount">1000€</div>
            </div>

            <div className="prize-item prize-bronze">
              <div className="prize-info">
                <div>
                  <h4 className="prize-title text-bronze">Semifinalistas</h4>
                  <p className="prize-desc">Tercer y cuarto lugar</p>
                </div>
              </div>
              <div className="time-bold-bby">Inscripción gratuita 2ª edición</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
