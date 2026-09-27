import { createContext, useContext } from 'react'

// Sesión compartida por TODO el sitio (Navbar, Problemas, Perfil). Antes
// vivía solo dentro de Problemas.jsx; se movió aquí para que el Navbar
// también sepa si hay alguien conectado. La clave de localStorage es la
// misma de antes, así que quien ya tenía sesión la conserva.
export const AUTH_STORAGE_KEY = 'axioma_auth'

// Valor: { auth, login, logout }
//   auth   -> null, o { token, user: { id, username, email } }
//   login  -> recibe la respuesta de /api/auth/login o /signup y la guarda
//   logout -> borra la sesión
export const AuthContext = createContext(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  return value
}
