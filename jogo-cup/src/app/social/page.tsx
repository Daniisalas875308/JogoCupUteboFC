'use client'

import React from 'react';
import styles from './social.module.css';
import { FaInstagram, FaTiktok, FaGlobe } from 'react-icons/fa';
import { SiGmail } from "react-icons/si";
import { FaFileCircleCheck } from "react-icons/fa6";


export default function SocialPage() {
  const links = [ 
    { icon: <FaInstagram />, label: '@jogo_cup', url: 'https://www.instagram.com/jogo_cup?igsh=ZGZhaXZnbTJ4MW50', clase: styles['boton-insta'] },
    { icon: <FaTiktok />, label: '@jogo.cup.utebo', url: 'https://www.tiktok.com/@jogo.cup.utebo?_t=ZN-8zGNH8dASNq&_r=1', clase: styles['boton-tiktok'] },
    { icon: <SiGmail />, label: 'jogocup@acnb.es', url: 'mailto:jogocup@acnb.es', clase: styles['boton-gmail'] },
    { icon: <FaGlobe />, label: 'Web', url: 'https://jogo-cup-utebo-fc.vercel.app/', clase: styles['boton-web'] },
    { icon: <FaFileCircleCheck />, label: 'Preinscripciones', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfAp9r-NpFJW_HImHRMzppNzUAfSJo64Rn5UUeeGd2OWAzYQQ/viewform?usp=dialog', clase: styles['boton-web'] },
  ];
 
  return (
    <div className={styles['login-page']}>
      <div className={styles['login-panel']}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles['link-button']} ${link.clase}`}
          >
            {React.cloneElement(link.icon, { className: styles['icono-redes'] })}
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

