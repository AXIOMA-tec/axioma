// Cliente sencillo para la API de Axioma (server/). En desarrollo
// apunta a localhost:4000 por default; en producción se configura con
// la variable de entorno VITE_API_URL (ver README / .env.example).
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function fetchJSON(path) {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) {
    throw new Error(`La API respondió ${res.status} en ${path}`)
  }
  return res.json()
}

// apiFetch centraliza las 3 cosas que se repetirían en cada llamada a la
// API: mandar el body como JSON, agregar el token de sesión si existe, y
// convertir una respuesta de error en un Error de JavaScript normal que se
// pueda atrapar con try/catch (con err.status = el código HTTP).
export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Intentamos leer JSON incluso en errores, porque el backend manda
  // { error: '...' } en sus respuestas de error (ver server/src/routes/*).
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(data?.error || 'Error de red inesperado.')
    error.status = res.status
    throw error
  }
  return data
}

export const api = {
  getEquipo: () => fetchJSON('/api/equipo'),
  getProblemas: () => fetchJSON('/api/problemas'),
  getEventos: () => fetchJSON('/api/eventos'),
  // Solo para administradores (ver /admin/eventos): requieren el token de
  // sesión, y el servidor rechaza a quien no tenga isAdmin.
  crearEvento: (datos, token) => apiFetch('/api/eventos', { method: 'POST', body: datos, token }),
  actualizarEvento: (id, datos, token) =>
    apiFetch(`/api/eventos/${id}`, { method: 'PATCH', body: datos, token }),
  borrarEvento: (id, token) => apiFetch(`/api/eventos/${id}`, { method: 'DELETE', token }),
}
