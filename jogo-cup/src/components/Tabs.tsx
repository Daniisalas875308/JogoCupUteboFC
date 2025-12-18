'use client'

import { useState, useEffect } from "react";
import { FaCalendar, FaTrophy, FaAward, FaUserCheck, FaVideo, FaEuroSign } from "react-icons/fa";
import { FaUsers, FaBolt } from "react-icons/fa6";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
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
    /*{ id: "documents", label: "Documentos", icon: <FaNewspaper /> },*/
  ];

  const restrictedTabs = ['budget', 'documents'];
  const visibleTabs = tabs.filter(tab => !restrictedTabs.includes(tab.id) || isLoggedIn);

  const under16Submenu = [
    { id: "under16-overview", label: "Resumen", icon: <FaTrophy /> },
    { id: "under16-groups", label: "Grupos", icon: <FaUsers />  },
    { id: "under16-schedule", label: "Calendario", icon: <FaCalendar /> },
    { id: "under16-results", label: "Resultados", icon: <FaAward /> },
  ];

  return (
    <div className="relative tabs-container">
      <div className="tabs-list">
        {visibleTabs.map(tab => (
          <div key={tab.id} className="tab-item-wrapper">
            <button
              className={`tab-trigger ${ (tab.id === 'under16' ? activeTab.startsWith('under16') : activeTab === tab.id) ? "active" : "" }`}
              onClick={() => {
                if (tab.id === "under16") {
                  setOpenSubmenu(prev => !prev);
                } else {
                  setActiveTab(tab.id);
                  setOpenSubmenu(false);
                }
              }}
            >
              <span className="iconos_tab">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          </div>
        ))}
      </div>

      {openSubmenu && (
        <div className="submenu">
          {under16Submenu.map(sub => {
            const isActive = activeTab === sub.id;
            return (
              <button
                key={sub.id}
                className={`submenu-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(sub.id);
                  setOpenSubmenu(true);
                }}
              >
                <span className="iconos_tab_submenu">{sub.icon}</span>
                <span className="tab-label_submenu">{sub.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
