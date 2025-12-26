import Link from 'next/link';
import { FaTv, FaCogs } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { connectSocket } from '../socket'; // Ajusta la ruta según tu proyecto
import { io, Socket } from "socket.io-client";


export default function GestionMarcador() {
  const [corriendo, setCorriendo] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);


  // Conectamos al socket al montar
  useEffect(() => {
    const s = connectSocket();
    setSocket(s);

    // Escuchamos cambios globales del cronómetro
    s.on("cronometro_cambiar_estado_global", ({ corriendo: estado }) => {
      setCorriendo(estado);
    });

    return () => {
      s.off("cronometro_cambiar_estado_global");
    };
  }, []);

  // Función para cambiar el estado global del cronómetro
  const toggleCronometroGlobal = () => {
    console.log("Toggle cronómetro global y corriendo estado:", corriendo);
    if (!corriendo) {
      setCorriendo(true);
    } else {
      setCorriendo(false);
    }
    if (!socket) return;
    socket.emit("cronometro_cambiar_estado_global");
  };

  return (
    <div className="jc-hub-wrapper">
      {/* BOTÓN 1: AL MARCADOR PÚBLICO */}
      <Link href="/marcador" target="_blank" className="jc-hub-button">
        <div className="jc-hub-icon-box">
          <FaTv />
        </div>
        <div className="jc-hub-text-content">
          <span className="jc-hub-title">Ver Marcador</span>
          <span className="jc-hub-description">Vista para el público (Nueva pestaña)</span>
        </div>
      </Link>

      {/* BOTÓN 2: AL PANEL DE CONTROL */}
      <Link href="/admin/control-marcador" className="jc-hub-button">
        <div className="jc-hub-icon-box">
          <FaCogs />
        </div>
        <div className="jc-hub-text-content">
          <span className="jc-hub-title">Panel de Control</span>
          <span className="jc-hub-description">Cambiar partidos y resultados</span>
        </div>
      </Link>

      {/* BOTÓN PARA CRONÓMETRO GLOBAL */}
      <button
        className="jc-hub-button"
        style={{ marginTop: "1rem", backgroundColor: corriendo ? "#e74c3c" : "#2ecc71" }}
        onClick={toggleCronometroGlobal}
      >
        <div className="jc-hub-icon-box">
          {corriendo ? "⏸️" : "▶️"}
        </div>
        <div className="jc-hub-text-content">
          <span className="jc-hub-title">{corriendo ? "Pausar Cronómetro" : "Iniciar Cronómetro"}</span>
          <span className="jc-hub-description">Control global del tiempo del marcador</span>
        </div>
      </button>
    </div>
  );
}
