import { useEffect, useState } from "react";
import {getEquiposPorGrupo} from '../api.js';

interface Group {
  name: string;
  teams: Equipo[];
}

interface Equipo {
  nombre: string;
  puntos: number;
}

export default function GroupsJr() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchData = async () => {

      interface Equipo {
        id: number;
        nombre: string;
        logo_url?: string;
        puntos: number;
      }

      interface EquiposFase {
        id: number;
        fase_id: number;
        equipos: Equipo[];
      }

      interface Group {
        name: string;
        teams: Equipo[];
      }

      try {
        // 🚀 traer dos grupos (faseId=1 y faseId=2)
        const grupo1: EquiposFase[] = await getEquiposPorGrupo(15);
        const grupo2: EquiposFase[] = await getEquiposPorGrupo(16);
        const grupo3: EquiposFase[] = await getEquiposPorGrupo(17);
        const grupo4: EquiposFase[] = await getEquiposPorGrupo(18);
        const grupo5: EquiposFase[] = await getEquiposPorGrupo(19);

        setGroups([
          { name: "Grupo 1", teams: grupo1.flatMap(g => g.equipos) },
          {
            name: "Grupo 2",
            teams: grupo2.flatMap(g => g.equipos),
          },
          {
            name: "Grupo 3",
            teams: grupo3.flatMap(g => g.equipos),
          },
          {
            name: "Grupo 4",
            teams: grupo4.flatMap(g => g.equipos),
          },
          {
            name: "Grupo 5",
            teams: grupo5.flatMap(g => g.equipos),
          },
        ]);
      } catch (err) {
        console.error("Error cargando grupos:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="tab-content animate-fade-in" id="overview">
      <div className="groups-grid">
        {groups.map((group) => (
          <div className="jogo-card group-card" key={group.name}>
            <div className="card-header">
              <div className="group-header">
                <h3 className="group-title jogo-primary">{group.name}</h3>
                <span className="badge badge-green"><strong>En juego</strong></span>
              </div>
            </div>
            <div className="card-content card-group">
              <div className="teams-list">
                {group.teams.map((team, idx) => (
                  <div className="team-item" key={idx}>
                    <span className="team-name-groups">{team.nombre}</span>
                    <div className="team-stats-grups">
                    <span className="team-points-grups">{team.puntos} pts</span>
                    <div className="team-indicator-grups"></div>
                  </div>
                </div>
              ))}
              </div>
              <div className="group-footer">
                <p className="group-note">Clasifican: primero + 3 mejores segundos</p>
              </div>
            </div>
          </div>          
        ))}
      </div>
    </div>
  );
}