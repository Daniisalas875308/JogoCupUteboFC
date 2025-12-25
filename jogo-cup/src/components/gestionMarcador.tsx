import Link from 'next/link';
import { FaTv, FaCogs } from 'react-icons/fa';

export default function GestionMarcador() {
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
    </div>
  );
}