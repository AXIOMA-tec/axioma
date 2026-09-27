// Cliente sencillo para la API de Axioma (server/). En desarrollo
// apunta a localhost:4000 por default; en producción se configura con
// la variable de entorno VITE_API_URL (ver README / .env.example).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function fetchJSON(path) {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) {
    throw new Error(`La API respondió ${res.status} en ${path}`)
  }
  return res.json()
}

export const api = {
  getEquipo: () => fetchJSON('/api/equipo'),
  getProblemas: () => fetchJSON('/api/problemas'),
  getEventos: () => fetchJSON('/api/eventos'),
}
