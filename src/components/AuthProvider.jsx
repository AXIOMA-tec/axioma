import { useCallback, useMemo, useState } from 'react'
import { AuthContext, AUTH_STORAGE_KEY } from '../lib/auth'

function leerSesionGuardada() {
  try {
    const guardado = localStorage.getItem(AUTH_STORAGE_KEY)
    return guardado ? JSON.parse(guardado) : null
  } catch {
    return null
  }
}

// Envuelve toda la app (ver App.jsx). Arranca leyendo localStorage para que
// la sesión sobreviva a un refresh. Solo guarda el token y los datos
// públicos que regresa la API — nunca la contraseña.
export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(leerSesionGuardada)

  const login = useCallback((data) => {
    setAuth(data)
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Sin localStorage (modo privado, etc.) la sesión dura hasta recargar.
    }
  }, [])

  const logout = useCallback(() => {
    setAuth(null)
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {
      // nada que limpiar
    }
  }, [])

  const value = useMemo(() => ({ auth, login, logout }), [auth, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
