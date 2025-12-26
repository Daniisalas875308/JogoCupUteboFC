"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Para la redirección
import { getPartidosPorDia } from "../../../components/api"; // Tu función actual
import { connectSocket } from "../../../socket";
import styles from "./control-marcador.module.css";

interface Match {
  id: number;
  goles_local: number;
  goles_visitante: number;
  estado: string;
  fase_id: { id: number; nombre: string };
  equipo_local: { nombre: string; logo_url: string } | null;
  equipo_visitante: { nombre: string; logo_url: string } | null;
}

export default function AdminMarcador() {
  const [authorized, setAuthorized] = useState(false); // Estado de seguridad
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Hoy por defecto
  const [partidos, setPartidos] = useState<Match[]>([]);
  const [seleccionados, setSeleccionados] = useState<Match[]>([]);
  const [mensaje, setMensaje] = useState("");

  const router = useRouter();

  // --- PROTECCIÓN DE RUTA ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Si no hay token, lo mandamos al login
      router.push('/login');
    } else {
      // Si hay token, permitimos ver la página
      setAuthorized(true);
    }
  }, [router]);
  // Cargar partidos cuando cambie la fecha
  useEffect(() => {
    if (!authorized) return;

    const cargar = async () => {
      try {
        const data = await getPartidosPorDia(fecha);
        setPartidos(data);
      } catch (err) {
        console.error("Error cargando partidos:", err);
      }
    };
    cargar();
  }, [fecha, authorized]);

  if (!authorized) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Verificando acceso...</div>;
  }

  const toggleSeleccion = (partido: Match) => {
    if (seleccionados.find(p => p.id === partido.id)) {
      // Si ya está, lo quitamos
      setSeleccionados(seleccionados.filter(p => p.id !== partido.id));
    } else {
      // Si no está, lo añadimos solo si hay menos de 2
      if (seleccionados.length < 2) {
        setSeleccionados([...seleccionados, partido]);
      } else {
        alert("Solo puedes seleccionar 2 partidos para el marcador.");
      }
    }
  };

  const enviarAlMarcador = async () => {
    if (seleccionados.length === 0) return;

    try {
      // 1️⃣ Guardar en BD
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marcador`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partidos: seleccionados.map(p => p.id)
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error guardando marcador");
      }

      // 2️⃣ Emitir por socket
      const socket = connectSocket();
      socket.emit("cambiar_partidos_marcador", seleccionados);

      setMensaje("¡Marcador actualizado!");
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error("Error enviando al marcador:", err);
      setMensaje("Error al actualizar el marcador");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1>Gestión del Marcador en Vivo</h1>
      
      <div className={styles.controles}>
        <input 
          type="date" 
          value={fecha} 
          onChange={(e) => setFecha(e.target.value)} 
          className={styles.inputFecha}
        />
        <button 
          onClick={enviarAlMarcador} 
          className={styles.btnEnviar}
          disabled={seleccionados.length === 0}
        >
          Enviar {seleccionados.length} partido(s) al Marcador
        </button>
      </div>

      {mensaje && <p className={styles.success}>{mensaje}</p>}

      <div className={styles.gridPartidos}>
        {partidos.map((p: Match) => (
          <div 
            key={p.id} 
            className={`${styles.card} ${seleccionados.find(sel => sel.id === p.id) ? styles.selected : ""}`}
            onClick={() => toggleSeleccion(p)}
          >
            <div className={styles.matchInfo}>
              <span>{p.equipo_local?.nombre}</span>
              <span className={styles.vs}>VS</span>
              <span>{p.equipo_visitante?.nombre}</span>
            </div>
            <div className={styles.badgeFase}>{p.fase_id?.nombre || "Partido"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}