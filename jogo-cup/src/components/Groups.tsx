import { useEffect, useState } from "react";
import {getEquiposPorGrupo} from './api.js';

interface Group {
  name: string;
  teams: Equipo[];
}

interface Equipo {
  nombre: string;
  puntos: number;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🚀 traer dos grupos (faseId=1 y faseId=2)
        const grupo1 = await getEquiposPorGrupo(1);
        const grupo2 = await getEquiposPorGrupo(2);
        const grupo3 = await getEquiposPorGrupo(3);
        const grupo4 = await getEquiposPorGrupo(4);
        const grupo5 = await getEquiposPorGrupo(5);
        const grupo6 = await getEquiposPorGrupo(6);

        setGroups([
          {
            name: "Grupo 1",
            teams: grupo1.map((item: any) => item.equipos),
          },
          {
            name: "Grupo 2",
            teams: grupo2.map((item: any) => item.equipos),
          },
          {
            name: "Grupo 3",
            teams: grupo3.map((item: any) => item.equipos),
          },
          {
            name: "Grupo 4",
            teams: grupo4.map((item: any) => item.equipos),
          },
          {
            name: "Grupo 5",
            teams: grupo5.map((item: any) => item.equipos),
          },
          {
            name: "Grupo 6",
            teams: grupo6.map((item: any) => item.equipos),
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
                <p className="group-note">Clasifican: 2 primeros + 4 mejores terceros</p>
              </div>
            </div>
          </div>          
        ))}
      </div>
    </div>
  );
}
