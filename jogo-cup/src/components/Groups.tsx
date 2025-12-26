import { useEffect, useState } from "react";
import {getEquiposPorGrupo} from './api.js';

interface Group {
  name: string;
  teams: Equipo[];
}

interface Equipo {
  nombre: string;
  puntos: number;
  logo_url?: string;
}

export default function Groups() {
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
        const grupo1: EquiposFase[] = await getEquiposPorGrupo(1);
        const grupo2: EquiposFase[] = await getEquiposPorGrupo(2);
        const grupo3: EquiposFase[] = await getEquiposPorGrupo(3);
        const grupo4: EquiposFase[] = await getEquiposPorGrupo(4);
        const grupo5: EquiposFase[] = await getEquiposPorGrupo(5);
        const grupo6: EquiposFase[] = await getEquiposPorGrupo(6);

        setGroups([
        { 
          name: "Grupo 1", 
          teams: grupo1.flatMap(g => g.equipos).sort((a, b) => b.puntos - a.puntos) 
        },
        { 
          name: "Grupo 2", 
          teams: grupo2.flatMap(g => g.equipos).sort((a, b) => b.puntos - a.puntos) 
        },
        { 
          name: "Grupo 3", 
          teams: grupo3.flatMap(g => g.equipos).sort((a, b) => b.puntos - a.puntos) 
        },
        { 
          name: "Grupo 4", 
          teams: grupo4.flatMap(g => g.equipos).sort((a, b) => b.puntos - a.puntos) 
        },
        { 
          name: "Grupo 5", 
          teams: grupo5.flatMap(g => g.equipos).sort((a, b) => b.puntos - a.puntos) 
        },
        { 
          name: "Grupo 6", 
          teams: grupo6.flatMap(g => g.equipos).sort((a, b) => b.puntos - a.puntos) 
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

                    {/* IZQUIERDA: escudo + nombre */}
                    <div className="team-left">
                      {team.logo_url && (
                        <img
                          src={team.logo_url}
                          alt={team.nombre}
                          className="team-logo-grupos"
                        />
                      )}
                      <span className="team-name-groups">{team.nombre}</span>
                    </div>

                    {/* DERECHA: puntos */}
                    <div className="team-right">
                      <span className="team-points-grups">{team.puntos} pts</span>
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