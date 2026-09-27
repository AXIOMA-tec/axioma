import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiFetch } from '../lib/api'
import { useAuth } from '../lib/auth'

const AXIOMA_GRADIENT = 'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)'

// Página /perfil: username y correo de quien tiene la sesión iniciada.
// Los datos se piden a GET /api/auth/me (la fuente de verdad es la base, no
// lo que quedó guardado en el navegador); mientras llegan, se muestra lo
// que ya teníamos guardado de la sesión.
function PerfilPage() {
  const { auth, logout } = useAuth()
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const token = auth?.token
  useEffect(() => {
    if (!token) return
    let activo = true
    apiFetch('/api/auth/me', { token })
      .then((data) => {
        if (activo) setUser(data.user)
      })
      .catch((err) => {
        if (!activo) return
        // Token expirado o cuenta borrada: la sesión guardada ya no sirve.
        if (err.status === 401) logout()
        else setError(err.message)
      })
    return () => {
      activo = false
    }
  }, [token, logout])

  if (!auth) return <Navigate to="/cuenta" replace />

  const mostrado = user || auth.user

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-brand-200 bg-white shadow-sm">
          <div className="h-1.5 w-full" style={{ backgroundImage: AXIOMA_GRADIENT }} />
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundImage: 'linear-gradient(135deg, #E57505, #FFB401)' }}
              >
                {mostrado.username?.charAt(0).toUpperCase()}
              </div>
              <h1 className="min-w-0 break-words text-2xl text-brand-900">Perfil</h1>
            </div>

            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-brand-500">Usuario</dt>
                <dd className="break-words font-semibold text-brand-900">{mostrado.username}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-brand-500">Correo</dt>
                <dd className="break-words text-brand-900">{mostrado.email || '—'}</dd>
              </div>
              {mostrado.conGoogle && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-brand-500">Acceso</dt>
                  <dd className="text-brand-900">Con Google</dd>
                </div>
              )}
            </dl>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button
              type="button"
              onClick={logout}
              className="self-start text-sm text-brand-600 underline hover:text-[#E57505]"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default PerfilPage
