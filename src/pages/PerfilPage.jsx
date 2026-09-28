import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api, apiFetch } from '../lib/api'
import { useAuth } from '../lib/auth'

const AXIOMA_GRADIENT = 'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)'

// "OMUM-PR-2024-3" -> "3": mismo truco que numeroProblema en Problemas.jsx
// (el número siempre es lo que sigue al último guion del código).
function numeroProblema(codigo) {
  return codigo.split('-').pop()
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Botones planos, mismo lenguaje que ya usan Hero/Contacto/Problemas: sin
// esquinas redondeadas ni sombras, un único acento dorado.
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900'
const primaryButtonClass = `inline-flex items-center gap-2 border border-brand-900 bg-[#FFB401] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-900 transition-colors hover:bg-white ${focusRing}`
const secondaryButtonClass = `inline-flex items-center gap-2 border border-brand-900 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-900 transition-colors hover:bg-brand-900 hover:text-white ${focusRing}`

// Página /perfil: username y correo de quien tiene la sesión iniciada.
// Los datos se piden a GET /api/auth/me (la fuente de verdad es la base, no
// lo que quedó guardado en el navegador); mientras llegan, se muestra lo
// que ya teníamos guardado de la sesión.
function PerfilPage() {
  const { auth, logout } = useAuth()
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [comentarios, setComentarios] = useState(null) // null = todavía cargando
  const [errorComentarios, setErrorComentarios] = useState(null)

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

  useEffect(() => {
    if (!token) return
    let activo = true
    api
      .getMisComentarios(token)
      .then((data) => {
        if (activo) setComentarios(data)
      })
      .catch((err) => {
        if (activo) setErrorComentarios(err.message)
      })
    return () => {
      activo = false
    }
  }, [token])

  if (!auth) return <Navigate to="/cuenta" replace />

  const mostrado = user || auth.user

  const miembroDesde = mostrado.createdAt
    ? new Date(mostrado.createdAt).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-50 px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Tu cuenta</p>
          <h1 className="mt-2 text-3xl text-brand-900 sm:text-4xl">
            Hola, {mostrado.username}
          </h1>
          <p className="mt-2 max-w-md text-brand-900/60">
            Aquí está la información de tu cuenta en Axioma.
          </p>

          {/* Tarjeta de identidad */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm">
            <div className="h-1.5 w-full" style={{ backgroundImage: AXIOMA_GRADIENT }} />

            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-5">
              <div
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ backgroundImage: 'linear-gradient(135deg, #E57505, #FFB401)' }}
              >
                {mostrado.username?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="break-words text-xl font-semibold text-brand-900">{mostrado.username}</p>
                <p className="break-words text-brand-900/60">{mostrado.email || '—'}</p>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-6 border-t border-brand-100 p-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-500">Acceso</dt>
                <dd className="mt-1 text-brand-900">
                  {mostrado.conGoogle ? 'Con Google' : 'Correo y contraseña'}
                </dd>
              </div>
              {miembroDesde && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-brand-500">Miembro desde</dt>
                  <dd className="mt-1 text-brand-900">{miembroDesde}</dd>
                </div>
              )}
            </dl>
          </div>

          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

          {/* Tus comentarios: le da a la cuenta un historial de verdad, no
              solo datos de identidad — invita a volver y ver qué has
              aportado. `comentarios === null` es "todavía no responde la
              API" (loading); un arreglo vacío es "ya respondió, no hay
              nada". */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-100 p-6">
              <h2 className="text-lg font-semibold text-brand-900">Tus comentarios</h2>
              {comentarios && comentarios.length > 0 && (
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-900/70">
                  {comentarios.length}
                </span>
              )}
            </div>

            {comentarios === null && !errorComentarios && (
              <p className="p-6 text-sm text-brand-500">Cargando…</p>
            )}
            {errorComentarios && (
              <p className="p-6 text-sm text-red-700">No se pudieron cargar: {errorComentarios}</p>
            )}
            {comentarios?.length === 0 && (
              <p className="p-6 text-sm text-brand-900/60">
                Todavía no has comentado ningún problema.{' '}
                <Link to="/problemas" className="underline decoration-brand-300 underline-offset-4 hover:text-brand-900">
                  Ve al archivo
                </Link>{' '}
                y opina en el primero que te llame la atención.
              </p>
            )}
            {comentarios && comentarios.length > 0 && (
              <ul className="divide-y divide-brand-100">
                {comentarios.map((c) => (
                  <li key={c._id} className="p-6">
                    <Link
                      to={c.problem ? `/problemas?p=${c.problem.codigo}` : '/problemas'}
                      className="text-sm font-medium text-brand-900 underline decoration-brand-300 underline-offset-4 hover:text-brand-600"
                    >
                      {c.problem
                        ? `${c.problem.tipo} ${c.problem.año} — Problema ${numeroProblema(c.problem.codigo)}`
                        : 'Problema eliminado'}
                    </Link>
                    <p className="mt-2 line-clamp-2 text-sm text-brand-900/70">{c.body}</p>
                    <p className="mt-2 text-xs text-brand-400">{formatearFecha(c.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accesos directos: la razón de estar aquí no es solo ver la
              tarjeta, es seguir usando el sitio con la sesión ya iniciada. */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/problemas" className={primaryButtonClass}>
              Ver problemas
            </Link>
            <Link to="/" className={secondaryButtonClass}>
              Volver al inicio
            </Link>
            {mostrado.isAdmin && (
              <Link to="/admin" className={secondaryButtonClass}>
                Panel de administración
              </Link>
            )}
            <button
              type="button"
              onClick={logout}
              className={`ml-0 text-sm text-brand-600 underline underline-offset-4 hover:text-brand-900 sm:ml-auto ${focusRing}`}
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
