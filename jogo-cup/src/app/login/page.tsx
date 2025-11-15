'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook de navegación
import { FaRegUserCircle } from 'react-icons/fa';
import styles from './login.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // para mostrar error
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: email, password }),
    });

    const data = await res.json();
    console.log("Recibo esto del login:", data);

    if (!res.ok) {
      setError('Usuario o clave incorrectos');
    } else {
      localStorage.setItem('token', data.token);
      localStorage.setItem('nombre', data.nombre);
      localStorage.setItem('id_user', data.id);
      router.push('/'); // Redirige al dashboard
    }
  } catch (err) {
    console.error(err);
    setError('Error de conexión con el servidor');
  }
};

  return (
    <div className={styles['login-page']}>
      <div className={styles['login-panel']}>
        <h1 className={styles['gradient-text']}>Acceder como administrador</h1>
        <form onSubmit={handleSubmit} className={styles['login-form']}>
          <input
            type="text"
            placeholder="Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Clave administrador"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </div>
    </div>
  );
}
