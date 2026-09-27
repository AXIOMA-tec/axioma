import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../lib/auth'

// Si alguien acaba de volverse admin (se marcó `isAdmin: true` directo en
// Atlas), lo que quedó guardado en localStorage al iniciar sesión todavía
// dice que no lo es. Por eso este hook no confía en `auth.user`: pide la
// cuenta fresca a GET /api/auth/me cada vez que se usa, igual que ya hace
// PerfilPage.jsx.
//
// Devuelve { isAdmin, cargando }. Mientras `cargando` es true, no se sabe
// todavía — no tratar eso como "no es admin" (evita un parpadeo que le
// niegue el panel a alguien que sí tiene permiso).
export function useIsAdmin() {
  const { auth, logout } = useAuth()
  // null = todavía no se sabe (o no hay sesión). true/false = ya se
  // confirmó con el servidor. Nunca se pone en `true`/`false` de forma
  // síncrona dentro del efecto de abajo — solo dentro de sus callbacks
  // asíncronos (then/catch), que no cuentan como "estado que se ajusta
  // durante el efecto".
  const [confirmado, setConfirmado] = useState(null)

  const token = auth?.token
  useEffect(() => {
    if (!token) return
    let activo = true
    apiFetch('/api/auth/me', { token })
      .then((data) => {
        if (activo) setConfirmado(Boolean(data.user.isAdmin))
      })
      .catch((err) => {
        if (!activo) return
        if (err.status === 401) logout()
        setConfirmado(false)
      })
    return () => {
      activo = false
    }
  }, [token, logout])

  return {
    isAdmin: Boolean(token) && confirmado === true,
    cargando: Boolean(token) && confirmado === null,
  }
}
