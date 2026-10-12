import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { cloudinaryConfigurado, subirArchivo } from '../lib/cloudinary'

// Panel /admin/recursos: subir, editar y borrar los documentos descargables
// (PDFs de exámenes, material de asesores) que se ven en /problemas. Mismo
// patrón que /admin/galeria — ver ese archivo para más comentarios sobre el
// porqué de cada pieza. La diferencia con Galería: aquí el archivo puede
// ser cualquier tipo (PDF sobre todo), no solo imágenes, y no hace falta
// medir proporción ni mostrar preview visual, solo el nombre del archivo.

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900'
const inputClass =
  'w-full rounded-lg border border-brand-300 bg-white px-3 py-2.5 text-sm text-brand-900 outline-none placeholder:text-brand-400 focus:border-brand-900'
const labelClass = 'text-xs font-medium uppercase tracking-wide text-brand-500'
const primaryButtonClass = `inline-flex items-center justify-center gap-2 border border-brand-900 bg-[#FFB401] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-900 transition-colors hover:bg-white disabled:opacity-50 ${focusRing}`
const secondaryButtonClass = `inline-flex items-center justify-center gap-2 border border-brand-900 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-900 transition-colors hover:bg-brand-900 hover:text-white disabled:opacity-40 ${focusRing}`

const RECURSO_VACIO = { titulo: '', descripcion: '', archivo: null }

// Tope de tamaño para lo que se sube aquí — son PDFs de texto (exámenes),
// no debería ni acercarse a esto. Filtra por error algo enorme (un video,
// un escaneo a resolución absurda) antes de gastar tiempo subiéndolo.
// OJO: esto es solo una ayuda del lado del navegador, alguien podría
// saltárselo editando el código — el límite de verdad, que no se puede
// evadir, se pone en Cloudinary (dashboard → Settings → Upload → tu
// preset → "Max file size").
const TAMAÑO_MAXIMO_MB = 20
const TAMAÑO_MAXIMO_BYTES = TAMAÑO_MAXIMO_MB * 1024 * 1024

// "https://res.cloudinary.com/.../axioma/recursos/examen.pdf" -> "examen.pdf"
function nombreDeArchivo(url) {
  try {
    return decodeURIComponent(url.split('/').pop())
  } catch {
    return url
  }
}

function FormularioRecurso({ valorInicial, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(valorInicial)
  const [subiendoArchivo, setSubiendoArchivo] = useState(false)
  const [error, setError] = useState(null)

  // No hace falta sincronizar `form` con `valorInicial` en un efecto: el
  // padre le pone un `key` distinto a este componente cuando cambia de
  // "nuevo recurso" a "editar X" (ver AdminEventosPage.jsx para el mismo truco).

  const alSeleccionarArchivo = async (event) => {
    const archivo = event.target.files?.[0]
    if (!archivo) return
    setError(null)

    if (archivo.size > TAMAÑO_MAXIMO_BYTES) {
      setError(
        `Ese archivo pesa ${(archivo.size / (1024 * 1024)).toFixed(1)} MB — el máximo es ${TAMAÑO_MAXIMO_MB} MB.`,
      )
      event.target.value = '' // para poder volver a elegir el mismo input
      return
    }

    setSubiendoArchivo(true)
    try {
      const url = await subirArchivo(archivo)
      setForm((f) => ({ ...f, archivo: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSubiendoArchivo(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError(null)
    if (!form.archivo) {
      setError('Falta subir el archivo.')
      return
    }
    onGuardar(form).catch((err) => setError(err.message))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Archivo (PDF u otro)</span>
        {cloudinaryConfigurado ? (
          <div className="flex flex-wrap items-center gap-3">
            {form.archivo && (
              <span className="max-w-xs truncate rounded-md border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-900">
                {nombreDeArchivo(form.archivo)}
              </span>
            )}
            <input type="file" onChange={alSeleccionarArchivo} className="text-sm text-brand-700" />
            {subiendoArchivo && <span className="text-xs text-brand-500">Subiendo…</span>}
            <span className="w-full text-xs text-brand-400">Máximo {TAMAÑO_MAXIMO_MB} MB.</span>
          </div>
        ) : (
          <p className="text-xs text-brand-500">
            Falta configurar Cloudinary para subir archivos (ver src/lib/cloudinary.js).
          </p>
        )}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Título</span>
        <input
          type="text"
          required
          value={form.titulo}
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
          placeholder="Examen semanal — 4 de octubre"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Descripción (opcional)</span>
        <input
          type="text"
          value={form.descripcion}
          onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
          placeholder="Problemas de práctica de la sesión de este sábado"
          className={inputClass}
        />
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={guardando || subiendoArchivo} className={primaryButtonClass}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
        {onCancelar && (
          <button type="button" onClick={onCancelar} className={secondaryButtonClass}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

function FilaRecurso({ recurso, esPrimera, esUltima, onEditar, onBorrar, onMover }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-white p-4">
      <div className="min-w-0">
        <p className="min-w-0 truncate text-sm font-medium text-brand-900">{recurso.titulo}</p>
        {recurso.descripcion && (
          <p className="min-w-0 truncate text-xs text-brand-900/60">{recurso.descripcion}</p>
        )}
        <a
          href={recurso.archivo}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-brand-600 underline underline-offset-4 hover:text-brand-900"
        >
          {nombreDeArchivo(recurso.archivo)}
        </a>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onMover(recurso, -1)}
          disabled={esPrimera}
          aria-label="Mover antes"
          title="Mover antes"
          className={secondaryButtonClass}
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMover(recurso, 1)}
          disabled={esUltima}
          aria-label="Mover después"
          title="Mover después"
          className={secondaryButtonClass}
        >
          ↓
        </button>
        <button type="button" onClick={() => onEditar(recurso)} className={secondaryButtonClass}>
          Editar
        </button>
        <button
          type="button"
          onClick={() => onBorrar(recurso)}
          className={`${secondaryButtonClass} hover:border-red-700 hover:bg-red-700`}
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}

function AdminRecursosPage() {
  const { auth } = useAuth()
  const { isAdmin, cargando: cargandoAdmin } = useIsAdmin()

  const [recursos, setRecursos] = useState([])
  const [cargandoRecursos, setCargandoRecursos] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)
  const [editando, setEditando] = useState(null) // recurso completo, o null = subiendo uno nuevo
  const [guardando, setGuardando] = useState(false)
  const [formularioVersion, setFormularioVersion] = useState(0)

  const cargarRecursos = () => {
    api
      .getRecursos()
      .then(setRecursos)
      .catch((err) => setErrorCarga(err.message))
      .finally(() => setCargandoRecursos(false))
  }

  useEffect(() => {
    if (isAdmin) cargarRecursos()
  }, [isAdmin])

  if (!auth) return <Navigate to="/cuenta" replace />
  if (!cargandoAdmin && !isAdmin) return <Navigate to="/" replace />

  const guardar = async (datos) => {
    setGuardando(true)
    try {
      if (editando) {
        await api.actualizarRecurso(editando._id, datos, auth.token)
      } else {
        await api.crearRecurso(datos, auth.token)
      }
      setEditando(null)
      setFormularioVersion((v) => v + 1)
      cargarRecursos()
    } finally {
      setGuardando(false)
    }
  }

  const borrar = async (recurso) => {
    if (!window.confirm(`¿Borrar "${recurso.titulo}"? No se puede deshacer.`)) return
    await api.borrarRecurso(recurso._id, auth.token)
    cargarRecursos()
  }

  // Intercambia el "orden" de un recurso con el de su vecino, para subirlo
  // o bajarlo una posición en la lista.
  const mover = async (recurso, direccion) => {
    const indice = recursos.findIndex((r) => r._id === recurso._id)
    const vecino = recursos[indice + direccion]
    if (!vecino) return
    await Promise.all([
      api.actualizarRecurso(recurso._id, { orden: vecino.orden }, auth.token),
      api.actualizarRecurso(vecino._id, { orden: recurso.orden }, auth.token),
    ])
    cargarRecursos()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-50 px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Panel de administración</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl text-brand-900 sm:text-4xl">Recursos</h1>
            <Link to="/admin" className="text-sm text-brand-600 underline underline-offset-4 hover:text-brand-900">
              ← Volver al panel
            </Link>
          </div>
          <p className="mt-2 max-w-md text-brand-900/60">
            PDFs y otros documentos descargables — aparecen en Problemas, aparte del archivo buscable de problemas.
          </p>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-900">
              {editando ? `Editando "${editando.titulo}"` : 'Nuevo recurso'}
            </h2>
            <FormularioRecurso
              key={editando?._id ?? `nuevo-${formularioVersion}`}
              valorInicial={editando ?? RECURSO_VACIO}
              onGuardar={guardar}
              onCancelar={editando ? () => setEditando(null) : null}
              guardando={guardando}
            />
          </div>

          <div className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-900">
              Recursos actuales · {recursos.length}
            </h2>

            {cargandoRecursos && <p className="text-sm text-brand-500">Cargando…</p>}
            {errorCarga && <p className="text-sm text-red-700">No se pudo conectar con el servidor: {errorCarga}</p>}
            {!cargandoRecursos && recursos.length === 0 && (
              <p className="text-sm text-brand-500">Todavía no hay recursos.</p>
            )}

            <ul className="flex flex-col gap-3">
              {recursos.map((recurso, indice) => (
                <FilaRecurso
                  key={recurso._id}
                  recurso={recurso}
                  esPrimera={indice === 0}
                  esUltima={indice === recursos.length - 1}
                  onEditar={setEditando}
                  onBorrar={borrar}
                  onMover={mover}
                />
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  )
}

export default AdminRecursosPage
