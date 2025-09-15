const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUsuarios = async () => {
  const res = await fetch(`${API_URL}/usuarios`);
  return res.json();
};

export const getEquipos = async () => {
  const res = await fetch(`${API_URL}/equipos`);
  return res.json();
};

export const getEquiposPorGrupo = async (faseId) => {
  const res = await fetch(`${API_URL}/equipos-fase/grupo/${faseId}`);
  return res.json();
};

export const getPartidosPorDia = async (fecha /* 'YYYY-MM-DD' */) => {
  const res = await fetch(`${API_URL}/partidos/por-dia/${fecha}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getPartidosPorFase = async (faseId) => {
  const res = await fetch(`${API_URL}/partidos/por-fase/${faseId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export async function getEconomia(tipo) {
  const res = await fetch(`${API_URL}/economia/por-tipo/${tipo}`);
  if (!res.ok) throw new Error("Error al obtener datos de economía");
  return res.json();
}

export async function createEconomia(payload) {
  const res = await fetch(`${API_URL}/economia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

