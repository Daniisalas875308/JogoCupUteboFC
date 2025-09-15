'use client'

import { useState, useEffect } from "react";
import { FaCalendar, FaTrophy, FaAward, FaUserCheck, FaVideo, FaEuroSign } from "react-icons/fa";
import { FaUsers, FaBolt, FaNewspaper } from "react-icons/fa6";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // comprobamos si hay JWT
    setIsLoggedIn(!!token); // true si existe, false si no
  }, []);

  const tabs = [
    { id: "overview", label: "Resumen", icon: <FaTrophy /> },
    { id: "groups", label: "Grupos", icon: <FaUsers /> },
    { id: "schedule", label: "Calendario", icon: <FaCalendar /> },
    { id: "activities", label: "Actividades", icon: <FaBolt /> },
    { id: "results", label: "Resultados", icon: <FaAward /> },
    { id: "under16", label: "Sub-16", icon: <FaUserCheck /> },
    { id: "streaming", label: "En Vivo", icon: <FaVideo /> },
    { id: "budget", label: "Economía", icon: <FaEuroSign /> },
    { id: "documents", label: "Documentos", icon: <FaNewspaper /> },
  ];

  const restrictedTabs = ['budget', 'documents'];
  const visibleTabs = tabs.filter(tab => !restrictedTabs.includes(tab.id) || isLoggedIn);

  return (
    <div className="tabs-container">
      <div className="tabs-list">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-trigger ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="iconos_tab">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
