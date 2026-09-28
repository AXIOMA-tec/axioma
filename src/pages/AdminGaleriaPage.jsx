import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { cloudinaryConfigurado, subirImagen } from '../lib/cloudinary'

// Panel /admin/galeria: subir, editar y borrar las fotos de la sección
// Galería, sin tocar código. Mismo patrón que /admin/eventos (ver ese
// archivo para más comentarios sobre el porqué de cada pieza).

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900'
const inputClass =
  'w-full rounded-lg border border-brand-300 bg-white px-3 py-2.5 text-sm text-brand-900 outline-none placeholder:text-brand-400 focus:border-brand-900'
const labelClass = 'text-xs font-medium uppercase tracking-wide text-brand-500'
const primaryButtonClass = `inline-flex items-center justify-center gap-2 border border-brand-900 bg-[#FFB401] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-900 transition-colors hover:bg-white disabled:opacity-50 ${focusRing}`
const secondaryButtonClass = `inline-flex items-center justify-center gap-2 border border-brand-900 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-900 transition-colors hover:bg-brand-900 hover:text-white disabled:opacity-40 ${focusRing}`

const FOTO_VACIA = { alt: '', src: null, ratio: null }

// Lee el ancho y alto reales de una imagen, para no tener que pedirle a
// quien sube la foto que calcule una proporción a mano.
function medirImagen(archivo) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(archivo)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img.naturalWidth / img.naturalHeight)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer esa imagen.'))
    }
    img.src = url
  })
}

function FormularioFoto({ valorInicial, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(valorInicial)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [error, setError] = useState(null)

  // No hace falta sincronizar `form` con `valorInicial` en un efecto: el
  // padre le pone un `key` distinto a este componente cuando cambia de
  // "nueva foto" a "editar X" (ver AdminEventosPage.jsx para el mismo truco).

  const alSeleccionarArchivo = async (event) => {
    const archivo = event.target.files?.[0]
    if (!archivo) return
    setError(null)
    setSubiendoImagen(true)
    try {
      const [ratio, url] = await Promise.all([medirImagen(archivo), subirImagen(archivo)])
      setForm((f) => ({ ...f, src: url, ratio }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSubiendoImagen(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError(null)
    if (!form.src) {
      setError('Falta subir la foto.')
      return
    }
    onGuardar(form).catch((err) => setError(err.message))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Foto</span>
        {cloudinaryConfigurado ? (
          <div className="flex items-center gap-4">
            {form.src && (
              <img
                src={form.src}
                alt=""
                style={{ aspectRatio: form.ratio || 1 }}
                className="h-20 rounded-md border border-brand-200 object-cover"
              />
            )}
            <input type="file" accept="image/*" onChange={alSeleccionarArchivo} className="text-sm text-brand-700" />
            {subiendoImagen && <span className="text-xs text-brand-500">Subiendo…</span>}
          </div>
        ) : (
          <p className="text-xs text-brand-500">
            Falta configurar Cloudinary para subir fotos (ver src/lib/cloudinary.js).
          </p>
        )}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Descripción</span>
        <input
          type="text"
          required
          value={form.alt}
          onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
          placeholder="Sesión semanal de resolución de problemas"
          className={inputClass}
        />
        <span className="text-xs text-brand-400">
          Aparece al pasar el mouse sobre la foto, y como texto si no carga.
        </span>
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={guardando || subiendoImagen} className={primaryButtonClass}>
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

function FilaFoto({ foto, esPrimera, esUltima, onEditar, onBorrar, onMover }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-white p-4">
      <div className="flex min-w-0 items-center gap-4">
        <img
          src={foto.src}
          alt=""
          style={{ aspectRatio: foto.ratio }}
          className="h-14 w-14 shrink-0 rounded-md border border-brand-200 object-cover"
        />
        <p className="min-w-0 truncate text-sm text-brand-900">{foto.alt}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onMover(foto, -1)}
          disabled={esPrimera}
          aria-label="Mover antes"
          title="Mover antes"
          className={secondaryButtonClass}
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMover(foto, 1)}
          disabled={esUltima}
          aria-label="Mover después"
          title="Mover después"
          className={secondaryButtonClass}
        >
          ↓
        </button>
        <button type="button" onClick={() => onEditar(foto)} className={secondaryButtonClass}>
          Editar
        </button>
        <button
          type="button"
          onClick={() => onBorrar(foto)}
          className={`${secondaryButtonClass} hover:border-red-700 hover:bg-red-700`}
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}

function AdminGaleriaPage() {
  const { auth } = useAuth()
  const { isAdmin, cargando: cargandoAdmin } = useIsAdmin()

  const [fotos, setFotos] = useState([])
  const [cargandoFotos, setCargandoFotos] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)
  const [editando, setEditando] = useState(null) // foto completa, o null = subiendo una nueva
  const [guardando, setGuardando] = useState(false)
  const [formularioVersion, setFormularioVersion] = useState(0)

  const cargarFotos = () => {
    api
      .getGaleria()
      .then(setFotos)
      .catch((err) => setErrorCarga(err.message))
      .finally(() => setCargandoFotos(false))
  }

  useEffect(() => {
    if (isAdmin) cargarFotos()
  }, [isAdmin])

  if (!auth) return <Navigate to="/cuenta" replace />
  if (!cargandoAdmin && !isAdmin) return <Navigate to="/" replace />

  const guardar = async (datos) => {
    setGuardando(true)
    try {
      if (editando) {
        await api.actualizarFoto(editando._id, datos, auth.token)
      } else {
        await api.crearFoto(datos, auth.token)
      }
      setEditando(null)
      setFormularioVersion((v) => v + 1)
      cargarFotos()
    } finally {
      setGuardando(false)
    }
  }

  const borrar = async (foto) => {
    if (!window.confirm('¿Borrar esta foto? No se puede deshacer.')) return
    await api.borrarFoto(foto._id, auth.token)
    cargarFotos()
  }

  // Intercambia el "orden" de una foto con la de su vecina, para subirla o
  // bajarla una posición en la fila.
  const mover = async (foto, direccion) => {
    const indice = fotos.findIndex((f) => f._id === foto._id)
    const vecina = fotos[indice + direccion]
    if (!vecina) return
    await Promise.all([
      api.actualizarFoto(foto._id, { orden: vecina.orden }, auth.token),
      api.actualizarFoto(vecina._id, { orden: foto.orden }, auth.token),
    ])
    cargarFotos()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-50 px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Panel de administración</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl text-brand-900 sm:text-4xl">Galería</h1>
            <Link to="/admin" className="text-sm text-brand-600 underline underline-offset-4 hover:text-brand-900">
              ← Volver al panel
            </Link>
          </div>
          <p className="mt-2 max-w-md text-brand-900/60">
            Lo que agregues, edites o borres aquí se ve en la portada al momento.
          </p>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-900">
              {editando ? 'Editando foto' : 'Nueva foto'}
            </h2>
            <FormularioFoto
              key={editando?._id ?? `nueva-${formularioVersion}`}
              valorInicial={editando ?? FOTO_VACIA}
              onGuardar={guardar}
              onCancelar={editando ? () => setEditando(null) : null}
              guardando={guardando}
            />
          </div>

          <div className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-900">
              Fotos actuales · {fotos.length}
            </h2>

            {cargandoFotos && <p className="text-sm text-brand-500">Cargando…</p>}
            {errorCarga && <p className="text-sm text-red-700">No se pudo conectar con el servidor: {errorCarga}</p>}
            {!cargandoFotos && fotos.length === 0 && (
              <p className="text-sm text-brand-500">Todavía no hay fotos.</p>
            )}

            <ul className="flex flex-col gap-3">
              {fotos.map((foto, indice) => (
                <FilaFoto
                  key={foto._id}
                  foto={foto}
                  esPrimera={indice === 0}
                  esUltima={indice === fotos.length - 1}
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

export default AdminGaleriaPage
