import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { cloudinaryConfigurado, subirImagen } from '../lib/cloudinary'

// Panel /admin/eventos: agregar, editar y borrar los eventos que se ven en
// la portada (sección Eventos), sin tocar código ni la base de datos a
// mano. Solo para cuentas con isAdmin (ver useIsAdmin y
// server/src/middleware/auth.js).
//
// Estilo: mismo lenguaje que /perfil (tarjetas suaves, brand-*) — es una
// página "de club", no de visitante — con botones planos (borde + texto en
// mayúsculas), como el resto de los botones de acción del sitio.

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900'
const inputClass =
  'w-full rounded-lg border border-brand-300 bg-white px-3 py-2.5 text-sm text-brand-900 outline-none placeholder:text-brand-400 focus:border-brand-900'
const labelClass = 'text-xs font-medium uppercase tracking-wide text-brand-500'
const primaryButtonClass = `inline-flex items-center justify-center gap-2 border border-brand-900 bg-[#FFB401] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-900 transition-colors hover:bg-white disabled:opacity-50 ${focusRing}`
const secondaryButtonClass = `inline-flex items-center justify-center gap-2 border border-brand-900 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-900 transition-colors hover:bg-brand-900 hover:text-white ${focusRing}`

const EVENTO_VACIO = { tipo: 'proximo', titulo: '', fecha: '', lugar: '', link: '', src: null }

// Arma la descripción de accesibilidad (`alt`) sola, para no pedírsela a
// quien llena el formulario: "Entrenamiento — A3-109 (29 de agosto)".
function armarAlt({ titulo, lugar, fecha }) {
  return `${titulo}${lugar ? ` — ${lugar}` : ''}${fecha ? ` (${fecha})` : ''}`
}

function FormularioEvento({ valorInicial, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(valorInicial)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [error, setError] = useState(null)

  // No hace falta sincronizar `form` con `valorInicial` en un efecto: el
  // padre ya le pone un `key` distinto a este componente cuando cambia de
  // "nuevo evento" a "editar X" (o viceversa), así que React lo vuelve a
  // montar de cero y useState(valorInicial) arranca correcto solo.

  const cambiar = (campo) => (event) => setForm((f) => ({ ...f, [campo]: event.target.value }))

  const alSeleccionarArchivo = async (event) => {
    const archivo = event.target.files?.[0]
    if (!archivo) return
    setError(null)
    setSubiendoImagen(true)
    try {
      const url = await subirImagen(archivo)
      setForm((f) => ({ ...f, src: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSubiendoImagen(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError(null)
    onGuardar({ ...form, alt: armarAlt(form) }).catch((err) => setError(err.message))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Título</span>
          <input
            type="text"
            required
            value={form.titulo}
            onChange={cambiar('titulo')}
            placeholder="Entrenamiento"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Tipo</span>
          <select value={form.tipo} onChange={cambiar('tipo')} className={inputClass}>
            <option value="proximo">Próximo</option>
            <option value="pasado">Pasado</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Fecha</span>
          <input
            type="text"
            required
            value={form.fecha}
            onChange={cambiar('fecha')}
            placeholder="29 de agosto"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Lugar (opcional)</span>
          <input
            type="text"
            value={form.lugar}
            onChange={cambiar('lugar')}
            placeholder="A3-109 · 11:00–15:00"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={labelClass}>Enlace "Más info" (opcional)</span>
          <input
            type="url"
            value={form.link || ''}
            onChange={cambiar('link')}
            placeholder="https://..."
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Póster (opcional)</span>
        {cloudinaryConfigurado ? (
          <div className="flex items-center gap-4">
            {form.src && (
              <img src={form.src} alt="" className="h-16 w-12 rounded-md border border-brand-200 object-cover" />
            )}
            <input type="file" accept="image/*" onChange={alSeleccionarArchivo} className="text-sm text-brand-700" />
            {subiendoImagen && <span className="text-xs text-brand-500">Subiendo…</span>}
          </div>
        ) : (
          <p className="text-xs text-brand-500">
            Falta configurar Cloudinary para subir pósters (ver src/lib/cloudinary.js). Por ahora el evento se
            muestra con su fecha en grande, sin imagen.
          </p>
        )}
      </div>

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

function FilaEvento({ evento, esPrimera, esUltima, onEditar, onBorrar, onMover }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-white p-4">
      <div className="flex min-w-0 items-center gap-4">
        {evento.src ? (
          <img src={evento.src} alt="" className="h-14 w-11 shrink-0 rounded-md border border-brand-200 object-cover" />
        ) : (
          <span className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md border border-dashed border-brand-300 text-[10px] text-brand-400">
            Sin foto
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-brand-900">{evento.titulo}</p>
          <p className="truncate text-sm text-brand-900/60">
            {evento.fecha}
            {evento.lugar ? ` · ${evento.lugar}` : ''}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onMover(evento, -1)}
          disabled={esPrimera}
          aria-label="Mover antes"
          title="Mover antes"
          className={secondaryButtonClass}
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMover(evento, 1)}
          disabled={esUltima}
          aria-label="Mover después"
          title="Mover después"
          className={secondaryButtonClass}
        >
          ↓
        </button>
        <button type="button" onClick={() => onEditar(evento)} className={secondaryButtonClass}>
          Editar
        </button>
        <button
          type="button"
          onClick={() => onBorrar(evento)}
          className={`${secondaryButtonClass} hover:border-red-700 hover:bg-red-700`}
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}

// Una lista de eventos del mismo tipo (Próximos o Pasados), con sus propios
// botones de subir/bajar: mover un evento solo cambia su posición dentro de
// su grupo, igual que se ven separados en la portada (ver Eventos.jsx) —
// así "subir" siempre hace lo que se espera, sin saltar de un grupo a otro.
function GrupoEventos({ titulo, eventos, onEditar, onBorrar, onMover }) {
  if (eventos.length === 0) return null
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-500">{titulo}</h3>
      <ul className="flex flex-col gap-3">
        {eventos.map((evento, indice) => (
          <FilaEvento
            key={evento._id}
            evento={evento}
            esPrimera={indice === 0}
            esUltima={indice === eventos.length - 1}
            onEditar={onEditar}
            onBorrar={onBorrar}
            onMover={onMover}
          />
        ))}
      </ul>
    </div>
  )
}

function AdminEventosPage() {
  const { auth } = useAuth()
  const { isAdmin, cargando: cargandoAdmin } = useIsAdmin()

  // Arranca en `true` a propósito (mismo truco que ProblemaDetalle en
  // Problemas.jsx): así no hace falta ponerlo en `true` de nuevo dentro del
  // efecto de abajo, solo apagarlo cuando la respuesta llega.
  const [eventos, setEventos] = useState([])
  const [cargandoEventos, setCargandoEventos] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)
  const [editando, setEditando] = useState(null) // evento completo, o null = creando uno nuevo
  const [guardando, setGuardando] = useState(false)
  // Sube cada vez que se guarda algo, para forzar que el formulario se
  // vuelva a montar (y por lo tanto se limpie) aunque se siga creando uno
  // nuevo tras otro: solo cambiar `editando` a null no alcanza, porque ya
  // estaba en null antes de guardar.
  const [formularioVersion, setFormularioVersion] = useState(0)

  const cargarEventos = () => {
    api
      .getEventos()
      .then(setEventos)
      .catch((err) => setErrorCarga(err.message))
      .finally(() => setCargandoEventos(false))
  }

  useEffect(() => {
    if (isAdmin) cargarEventos()
  }, [isAdmin])

  if (!auth) return <Navigate to="/cuenta" replace />
  if (!cargandoAdmin && !isAdmin) return <Navigate to="/" replace />

  const guardar = async (datos) => {
    setGuardando(true)
    try {
      if (editando) {
        await api.actualizarEvento(editando._id, datos, auth.token)
      } else {
        await api.crearEvento(datos, auth.token)
      }
      setEditando(null)
      setFormularioVersion((v) => v + 1)
      cargarEventos()
    } finally {
      setGuardando(false)
    }
  }

  const borrar = async (evento) => {
    if (!window.confirm(`¿Borrar "${evento.titulo}"? No se puede deshacer.`)) return
    await api.borrarEvento(evento._id, auth.token)
    cargarEventos()
  }

  // Intercambia el "orden" de un evento con su vecino DENTRO DEL MISMO
  // GRUPO (próximo o pasado), para subirlo o bajarlo una posición — mismo
  // patrón que "mover" en AdminGaleriaPage.jsx.
  const mover = async (evento, direccion) => {
    const delGrupo = eventos.filter((e) => e.tipo === evento.tipo)
    const indice = delGrupo.findIndex((e) => e._id === evento._id)
    const vecino = delGrupo[indice + direccion]
    if (!vecino) return
    await Promise.all([
      api.actualizarEvento(evento._id, { orden: vecino.orden }, auth.token),
      api.actualizarEvento(vecino._id, { orden: evento.orden }, auth.token),
    ])
    cargarEventos()
  }

  const proximos = eventos.filter((e) => e.tipo === 'proximo')
  const pasados = eventos.filter((e) => e.tipo !== 'proximo')

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-50 px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Panel de administración</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl text-brand-900 sm:text-4xl">Eventos</h1>
            <Link to="/perfil" className="text-sm text-brand-600 underline underline-offset-4 hover:text-brand-900">
              ← Volver a tu cuenta
            </Link>
          </div>
          <p className="mt-2 max-w-md text-brand-900/60">
            Lo que agregues, edites o borres aquí se ve en la portada al momento.
          </p>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-900">
              {editando ? `Editando "${editando.titulo}"` : 'Nuevo evento'}
            </h2>
            <FormularioEvento
              key={editando?._id ?? `nuevo-${formularioVersion}`}
              valorInicial={editando ?? EVENTO_VACIO}
              onGuardar={guardar}
              onCancelar={editando ? () => setEditando(null) : null}
              guardando={guardando}
            />
          </div>

          <div className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-900">
              Eventos actuales · {eventos.length}
            </h2>

            {cargandoEventos && <p className="text-sm text-brand-500">Cargando…</p>}
            {errorCarga && <p className="text-sm text-red-700">No se pudo conectar con el servidor: {errorCarga}</p>}
            {!cargandoEventos && eventos.length === 0 && (
              <p className="text-sm text-brand-500">Todavía no hay eventos.</p>
            )}

            <div className="flex flex-col gap-8">
              <GrupoEventos titulo="Próximos" eventos={proximos} onEditar={setEditando} onBorrar={borrar} onMover={mover} />
              <GrupoEventos titulo="Pasados" eventos={pasados} onEditar={setEditando} onBorrar={borrar} onMover={mover} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default AdminEventosPage
