import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../lib/auth'
import { useIsAdmin } from '../hooks/useIsAdmin'

// /admin: índice del panel de administración. Solo enlaza a las secciones
// que ya se pueden editar sin tocar código; si agregan otra (ej. Equipo),
// se agrega aquí una tarjeta más igual a estas dos.
const SECCIONES = [
  {
    to: '/admin/eventos',
    titulo: 'Eventos',
    descripcion: 'Agregar, editar y borrar los eventos que se ven en la portada.',
  },
  {
    to: '/admin/galeria',
    titulo: 'Galería',
    descripcion: 'Subir, editar y borrar las fotos de la sección Galería.',
  },
]

function AdminPage() {
  const { auth } = useAuth()
  const { isAdmin, cargando } = useIsAdmin()

  if (!auth) return <Navigate to="/cuenta" replace />
  if (!cargando && !isAdmin) return <Navigate to="/" replace />

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-50 px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Panel de administración</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl text-brand-900 sm:text-4xl">¿Qué quieres editar?</h1>
            <Link to="/perfil" className="text-sm text-brand-600 underline underline-offset-4 hover:text-brand-900">
              ← Volver a tu cuenta
            </Link>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {SECCIONES.map((seccion) => (
              <Link
                key={seccion.to}
                to={seccion.to}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <h2 className="text-xl font-semibold text-brand-900">{seccion.titulo}</h2>
                  <p className="mt-1 text-sm text-brand-900/60">{seccion.descripcion}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="text-2xl text-brand-400 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default AdminPage
