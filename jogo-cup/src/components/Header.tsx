'use client'

import { useState, useEffect } from "react";
import Link from 'next/link';
import { IoIosLogOut } from "react-icons/io";

function useIsMobile(maxWidth: number = 600) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= maxWidth);
    checkScreen(); // al cargar
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, [maxWidth]);

  return isMobile;
}

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    setIsAdmin(localStorage.getItem('admin') === 'true');
  }, []);

  return (
    <header className="jogo-header">
      <div className="background-particles"></div>
      <div className="container-header">
        {isMobile ? (
          <div className="header-content">
            <div className="title-section">
              <h1 className="text-blue">JOGO CUP</h1>
              <p className="subtitle"><strong>1ª Edición</strong></p>
            </div>
            <div className="logo-section">
              <div className="logo-container">
                <img src="/logo-final-fondo.png" alt="JOGO CUP Logo" className="logo logo-glow" />
              </div>
            </div>
            <div className="login-section">
              {isAdmin ? ( 
                <div className="login-link">
                  <button
                    onClick={() => {
                      localStorage.removeItem('admin'); // borramos la variable admin
                      window.location.href = "/"; // redirigimos a login (o "/")
                    }}
                    className="logout-button"
                  >
                    <IoIosLogOut className="logout-icon"/>
                  </button>
                </div>
              ) : (
                <div className="login-link">
                  <Link href="/login">
                    <svg viewBox="0 0 496 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg" className="login-icon-svg">
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1b36bb" />
                          <stop offset="60%" stopColor="#50acd6ff" />
                          <stop offset="100%" stopColor="#f7cb47" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#grad)" d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"></path>
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-container">
                <img src="/logo-final-fondo.png" alt="JOGO CUP Logo" className="logo logo-glow" />
              </div>
              <div className="title-section">
                <h1 className="gradient-text">JOGO CUP</h1>
                <p className="subtitle"><strong>1ª Edición</strong></p>
              </div>
            </div>
            <div className="login-section">
              {isAdmin ? ( 
                <div className="login-link">
                  <button
                    onClick={() => {
                      localStorage.removeItem('admin'); // borramos la variable admin
                      window.location.href = "/"; // redirigimos a login (o "/")
                    }}
                    className="logout-button"
                  >
                    <p><strong>Cerrar Sesión</strong></p>
                    <IoIosLogOut className="logout-icon"/>
                  </button>
                </div>
              ) : (
                <div className="login-link">
                  <Link href="/login">
                    <svg viewBox="0 0 496 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg" className="login-icon-svg">
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1b36bb" />
                          <stop offset="60%" stopColor="#50acd6ff" />
                          <stop offset="100%" stopColor="#f7cb47" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#grad)" d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"></path>
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
