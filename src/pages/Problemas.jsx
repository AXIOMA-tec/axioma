import { useEffect, useMemo, useRef, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useBloquearScroll } from '../hooks/useBloquearScroll'
import Counter from '../components/motion/Counter'
import { EASE, staggerContainer } from '../components/motion/variants'

// ---------------------------------------------------------------------------
// ESQUELETO DE ESTE ARCHIVO
//
//   1. Datos y lógica (sin cambios de comportamiento): apiFetch, KaTeX,
//      árbol de carpetas, títulos.
//   2. Sistema visual: plano y tipográfico. Blanco/negro, líneas de 1px,
//      esquinas rectas, cero sombras y cero degradados. Un único acento
//      (dorado del logo) que solo aparece en hover. Referencias: Uber
//      (filas de índice), Apple (tipografía grande, filtros limpios) y
//      Google (panel lateral para el detalle).
//   3. Piezas: CheckRow / FilterGroup / CategoryFilter (sidebar),
//      AuthInlineForm, ComentarioItem, ProblemaPanel (detalle),
//      ProblemaRow, FolderRow, Breadcrumb, GridSpotlight, Encabezado.
//   4. Problemas: el componente principal (estado, filtros, vistas).
//
// Nota: el cursor personalizado del sitio es oscuro, por eso los hover
// usan fondos CLAROS (dorado / gris claro) y no negros: sobre negro el
// cursor desaparecería.
// ---------------------------------------------------------------------------

// Dirección del backend. En desarrollo, Vite expone las variables que
// empiezan con VITE_ dentro de import.meta.env — viene de tu archivo .env.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Aquí guardamos la sesión en el navegador para que no se pierda al
// recargar la página (localStorage sobrevive a un refresh).
const AUTH_STORAGE_KEY = 'axioma_auth'

// apiFetch centraliza lo que se repetiría en cada llamada: body como JSON,
// token de sesión si existe, y convertir una respuesta de error en un Error
// normal de JavaScript que se pueda atrapar con try/catch.
async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
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

// Un enunciado es texto normal que PUEDE traer fórmulas entre signos de
// pesos, como en LaTeX: "Sea $a>0$, demuestra que...".
//   $formula$    -> en línea, dentro del párrafo
//   $$formula$$  -> en pantalla (display), centrada en su propia línea
// Primero separamos los bloques $$...$$ (si buscáramos $...$ primero, cada
// "$$" se leería como dos fórmulas vacías pegadas).
//
// katex.renderToString regresa HTML (no JSX), por eso dangerouslySetInnerHTML.
// Es seguro SOLO porque el enunciado viene de datos que nosotros sembramos
// (server/src/data/problemasReales.js), no de texto de visitantes; los
// comentarios (que sí lo son) nunca pasan por aquí.
function renderFormulasEnLinea(texto, prefijoKey) {
  const partes = texto.split(/(\$[^$]+\$)/g)
  return partes.map((parte, i) => {
    const esFormula = parte.startsWith('$') && parte.endsWith('$') && parte.length > 1
    if (!esFormula) return <span key={`${prefijoKey}-${i}`}>{parte}</span>

    const latex = parte.slice(1, -1)
    const html = katex.renderToString(latex, { throwOnError: false })
    return <span key={`${prefijoKey}-${i}`} dangerouslySetInnerHTML={{ __html: html }} />
  })
}

function renderEnunciado(texto) {
  const bloques = texto.split(/(\$\$[\s\S]+?\$\$)/g)
  return bloques.map((bloque, i) => {
    const esDisplay = bloque.startsWith('$$') && bloque.endsWith('$$') && bloque.length > 4
    if (!esDisplay) return renderFormulasEnLinea(bloque, i)

    const latex = bloque.slice(2, -2)
    const html = katex.renderToString(latex, { throwOnError: false, displayMode: true })
    return <div key={i} className="my-3 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
  })
}

// Fórmula decorativa del encabezado (problema de Basilea). Es una constante
// escrita aquí, no viene de ningún usuario.
const FORMULA_BASILEA = katex.renderToString(
  '\\sum_{n=1}^{\\infty} \\frac{1}{n^{2}} = \\frac{\\pi^{2}}{6}',
  { displayMode: true, throwOnError: false },
)

const AÑOS = ['2021', '2022', '2023', '2024', '2025', '2026']
const TEMAS = [
  'Álgebra',
  'Álgebra Lineal',
  'Análisis',
  'Combinatoria',
  'Geometría',
  'Probabilidad',
  'Teoría de Números',
]
const TIPOS = ['Putnam', 'OMMU Primera Ronda', 'OMMU Nacional']

// ---------------------------------------------------------------------------
// Carpetas (Category): la API regresa una lista PLANA, cada una con un campo
// `parent` (el _id de su padre, o null si es de nivel superior). Para
// dibujar un árbol hay que reconstruirlo.
// ---------------------------------------------------------------------------
function buildCategoryTree(categorias) {
  const byId = new Map(categorias.map((c) => [c._id, { ...c, children: [] }]))
  const raices = []
  byId.forEach((nodo) => {
    const papa = nodo.parent ? byId.get(nodo.parent) : null
    if (papa) papa.children.push(nodo)
    else raices.push(nodo)
  })
  return { raices, byId }
}

// Si seleccionas "Putnam", también quieres ver los problemas de sus años.
// Regresa el _id de una carpeta MÁS los de todas sus subcarpetas.
function collectDescendantIds(nodo) {
  return nodo.children.reduce(
    (ids, hijo) => [...ids, ...collectDescendantIds(hijo)],
    [nodo._id],
  )
}

// Cuántos problemas viven dentro de una carpeta (contando subcarpetas).
function contarProblemas(nodo, problemas) {
  const ids = new Set(collectDescendantIds(nodo))
  return problemas.filter((p) => ids.has(p.category)).length
}

// "Putnam 2025 — Problema B6": `codigo` ya termina en el número después del
// último guion, sin importar cuántos guiones tenga el prefijo.
function numeroProblema(problema) {
  return problema.codigo.split('-').pop()
}

function formatearTitulo(problema) {
  return `${problema.tipo} ${problema.año} — Problema ${numeroProblema(problema)}`
}

// Para el buscador: minúsculas y sin acentos, así "algebra" encuentra "Álgebra".
function normalizarTexto(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// ---------------------------------------------------------------------------
// Sistema visual compartido
// ---------------------------------------------------------------------------
const labelClass = 'text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500'
const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950'

// Aparición de filas: un desplazamiento mínimo, sin escalas ni rotaciones.
const rowIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
}

const inputClass =
  'w-full border border-neutral-950 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:outline-2 focus:outline-neutral-950'

// Botón principal: dorado plano con borde negro; en hover se vuelve blanco.
const primaryButtonClass = `border border-neutral-950 bg-[#FFB401] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-950 transition-colors hover:bg-white disabled:opacity-50 ${focusRing}`

// ---------------------------------------------------------------------------
// Sidebar de filtros. Por dentro siguen siendo <input type="checkbox"> reales
// (ocultos con sr-only) para que teclado y lectores de pantalla funcionen;
// la casilla cuadrada de al lado es solo el dibujo.
// ---------------------------------------------------------------------------
function CheckRow({ checked, onChange, label, count }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 border border-neutral-950 transition-colors peer-checked:bg-neutral-950 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-neutral-950"
      />
      <span className="flex-1 text-neutral-600 transition-colors group-hover:text-neutral-950 peer-checked:font-medium peer-checked:text-neutral-950">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs tabular-nums text-neutral-400">{count}</span>
      )}
    </label>
  )
}

function FilterGroup({ title, options, selected, onToggle, counts }) {
  return (
    <div className="border-t border-neutral-950 pb-5 pt-3">
      <h3 className={`${labelClass} mb-2`}>{title}</h3>
      <div className="flex flex-col">
        {options.map((option) => (
          <CheckRow
            key={option}
            label={option}
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            count={counts?.[option]}
          />
        ))}
      </div>
    </div>
  )
}

// ¿Alguna carpeta de este nodo (o de sus descendientes) está marcada?
function tieneSeleccionadaDentro(nodo, seleccionadas) {
  return nodo.children.some(
    (hijo) => seleccionadas.includes(hijo._id) || tieneSeleccionadaDentro(hijo, seleccionadas),
  )
}

// Una fila del árbol de carpetas: se dibuja a sí misma y luego otra vez por
// cada hijo, dentro de un bloque con una línea guía a la izquierda.
// Las carpetas con subcarpetas (Putnam → 2021, 2022…) vienen CERRADAS: con
// muchos concursos, mostrar todos los años a la vez llenaría el sidebar. La
// flecha las abre/cierra; marcar la casilla filtra sin necesidad de abrirla.
// Arrancan abiertas solo si ya hay algo marcado adentro (ej. un enlace
// compartido con ?carpetas=Putnam/2021), para que se vea qué está activo.
function CategoryTreeNode({ nodo, problemas, seleccionadas, onToggle }) {
  const tieneHijos = nodo.children.length > 0
  const [abierto, setAbierto] = useState(() => tieneSeleccionadaDentro(nodo, seleccionadas))

  return (
    <div>
      <div className="flex items-center gap-1">
        {tieneHijos ? (
          <button
            type="button"
            onClick={() => setAbierto((valor) => !valor)}
            aria-expanded={abierto}
            aria-label={`${abierto ? 'Ocultar' : 'Mostrar'} subcarpetas de ${nodo.name}`}
            className={`flex h-6 w-6 shrink-0 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-950 ${focusRing}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-3.5 w-3.5 transition-transform duration-200 ${abierto ? 'rotate-90' : ''}`}
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ) : (
          <span className="w-6 shrink-0" aria-hidden="true" />
        )}
        <div className="min-w-0 flex-1">
          <CheckRow
            label={nodo.name}
            checked={seleccionadas.includes(nodo._id)}
            onChange={() => onToggle(nodo._id)}
            count={contarProblemas(nodo, problemas)}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {tieneHijos && abierto && (
          <motion.div
            key="hijos"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="ml-3 border-l border-neutral-300 pl-3">
              {nodo.children.map((hijo) => (
                <CategoryTreeNode
                  key={hijo._id}
                  nodo={hijo}
                  problemas={problemas}
                  seleccionadas={seleccionadas}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryFilter({ raices, problemas, seleccionadas, onToggle }) {
  if (raices.length === 0) return null
  return (
    <div className="border-t border-neutral-950 pb-5 pt-3">
      <h3 className={`${labelClass} mb-2`}>Carpetas</h3>
      <div className="flex flex-col">
        {raices.map((nodo) => (
          <CategoryTreeNode
            key={nodo._id}
            nodo={nodo}
            problemas={problemas}
            seleccionadas={seleccionadas}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Login / registro. Vive DENTRO del panel del problema (justo donde hace
// falta, antes de comentar) para no tener que agregar una ruta nueva en
// App.jsx, que es un archivo compartido con el resto del equipo.
// ---------------------------------------------------------------------------
function AuthInlineForm({ onAuthSuccess }) {
  const [modo, setModo] = useState('login') // 'login' | 'signup'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const path = modo === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const body = modo === 'login' ? { email, password } : { username, email, password }
      const data = await apiFetch(path, { method: 'POST', body })
      onAuthSuccess(data) // { token, user } — el componente padre lo guarda
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className={labelClass}>
        {modo === 'login' ? 'Inicia sesión para comentar' : 'Crea una cuenta para comentar'}
      </p>

      {modo === 'signup' && (
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={inputClass}
        />
      )}
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className={inputClass}
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <button type="submit" disabled={enviando} className={primaryButtonClass}>
          {enviando ? 'Un momento…' : modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}
        </button>
        <button
          type="button"
          onClick={() => setModo(modo === 'login' ? 'signup' : 'login')}
          className={`text-sm text-neutral-600 underline underline-offset-4 hover:text-neutral-950 ${focusRing}`}
        >
          {modo === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}
        </button>
      </div>
    </form>
  )
}

function ComentarioItem({ comentario, esPropio, onEliminar }) {
  const fecha = new Date(comentario.createdAt).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
  const username = comentario.author?.username || 'Usuario'
  return (
    <div className="flex gap-4 border-b border-neutral-200 py-4">
      {/* Avatar cuadrado con la inicial — solo decorativo. */}
      <div
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center bg-neutral-950 text-sm font-medium text-white"
      >
        {username.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-3">
          <p className="text-xs text-neutral-500">
            <span className="font-medium text-neutral-950">{username}</span> · {fecha}
          </p>
          {/* Solo el autor ve este botón — el backend también lo exige por su
              cuenta (ver comments.routes.js). */}
          {esPropio && (
            <button
              type="button"
              onClick={onEliminar}
              className={`shrink-0 text-xs text-red-700 underline underline-offset-4 ${focusRing}`}
            >
              Eliminar
            </button>
          )}
        </div>
        <p className="whitespace-pre-line break-words text-sm leading-relaxed text-neutral-800">
          {comentario.body}
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Detalle del problema: panel lateral (entra desde la derecha).
//
// Está partido en dos a propósito:
//  - ProblemaPanel: la "carcasa" (fondo, panel, cabecera con flechas). Se
//    queda montada al pasar de un problema a otro, así el panel NO se vuelve
//    a animar cada vez que se presiona "siguiente".
//  - ProblemaDetalle: enunciado + comentarios + formulario. Se monta de nuevo
//    con cada problema (key={problema._id}), así que su estado arranca limpio.
// ---------------------------------------------------------------------------
function ProblemaDetalle({ problema, expandido, auth, onAuthSuccess, onAuthExpired }) {
  // Arranca en `true` a propósito: "recién montado" siempre significa "aún no
  // llegan los comentarios de este problema".
  const [comentarios, setComentarios] = useState([])
  const [cargandoComentarios, setCargandoComentarios] = useState(true)
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [enviandoComentario, setEnviandoComentario] = useState(false)
  const [errorComentario, setErrorComentario] = useState(null)

  useEffect(() => {
    let cancelado = false
    apiFetch(`/api/problems/${problema._id}/comments`)
      .then((data) => {
        if (!cancelado) setComentarios(data)
      })
      .finally(() => {
        if (!cancelado) setCargandoComentarios(false)
      })
    return () => {
      cancelado = true
    }
  }, [problema._id])

  const handleEliminarComentario = async (commentId) => {
    try {
      await apiFetch(`/api/problems/${problema._id}/comments/${commentId}`, {
        method: 'DELETE',
        token: auth.token,
      })
      setComentarios((prev) => prev.filter((c) => c._id !== commentId))
    } catch (err) {
      if (err.status === 401) onAuthExpired()
      // Un 403/404 aquí sería raro (alguien lo borró en otra pestaña) — no
      // vale la pena una UI especial para ese caso.
    }
  }

  const handleEnviarComentario = async (event) => {
    event.preventDefault()
    const body = nuevoComentario.trim()
    if (!body) return

    setEnviandoComentario(true)
    setErrorComentario(null)
    try {
      const comentario = await apiFetch(`/api/problems/${problema._id}/comments`, {
        method: 'POST',
        token: auth.token,
        body: { body },
      })
      setComentarios((prev) => [...prev, comentario])
      setNuevoComentario('')
    } catch (err) {
      if (err.status === 401) {
        // El token guardado ya no sirve: cerramos la sesión localmente para
        // que vuelva a aparecer el login en vez de un botón que siempre falla.
        onAuthExpired()
      } else {
        setErrorComentario(err.message)
      }
    } finally {
      setEnviandoComentario(false)
    }
  }

  return (
    <>
      <div
        className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-8 sm:py-10 ${
          expandido ? 'sm:px-14 lg:px-20' : 'sm:px-8'
        }`}
      >
        {/* Al expandir, el panel ocupa toda la pantalla pero el texto solo
            crece un poco (con tope) y queda en una columna de lectura
            centrada: si se estira sin límite se vuelve incómodo de leer. */}
        <div className={expandido ? 'mx-auto max-w-5xl' : ''}>
          <h3
            id="titulo-panel-problema"
            className={`font-display uppercase leading-[1.05] text-neutral-950 ${
              expandido ? 'text-4xl sm:text-[clamp(3rem,4vw,4rem)]' : 'text-3xl sm:text-5xl'
            }`}
          >
            {formatearTitulo(problema)}
          </h3>

          <p className="mt-5 text-[11px] uppercase tracking-[0.15em] text-neutral-500">
            {problema.tipo} · {problema.año}
          </p>

          {/* div, no <p>: una fórmula en "display mode" se renderiza como un
              <div>, y un <div> no puede vivir dentro de un <p> en HTML. */}
          <div
            className={`mt-8 whitespace-pre-line leading-relaxed text-neutral-800 ${
              expandido ? 'text-lg sm:text-[clamp(1.125rem,1.4vw,1.375rem)]' : 'text-lg'
            }`}
          >
            {renderEnunciado(problema.enunciado)}
          </div>

          <div className="mt-12 border-t border-neutral-950 pt-4">
            <h4 className={labelClass}>Comentarios · {comentarios.length}</h4>

            {cargandoComentarios && (
              <p className="mt-4 text-sm text-neutral-400">Cargando comentarios…</p>
            )}

            {!cargandoComentarios && comentarios.length === 0 && (
              <p className="mt-4 text-sm text-neutral-500">Sé el primero en comentar.</p>
            )}

            <div className="mt-2 flex flex-col">
              {comentarios.map((c) => (
                <ComentarioItem
                  key={c._id}
                  comentario={c}
                  esPropio={Boolean(auth && c.author?._id === auth.user.id)}
                  onEliminar={() => handleEliminarComentario(c._id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`max-h-[55%] shrink-0 overflow-y-auto overscroll-contain border-t border-neutral-950 bg-white px-5 py-5 ${
          expandido ? 'sm:px-14 lg:px-20' : 'sm:px-8'
        }`}
      >
        <div className={expandido ? 'mx-auto max-w-5xl' : ''}>
          {auth ? (
            <form onSubmit={handleEnviarComentario} className="flex flex-col gap-3">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe un comentario…"
                rows={3}
                maxLength={2000}
                className={`${inputClass} resize-none`}
              />
              {errorComentario && <p className="text-sm text-red-700">{errorComentario}</p>}
              <div className="flex items-center justify-between">
                <span className="text-xs tabular-nums text-neutral-400">
                  {nuevoComentario.length}/2000
                </span>
                <button type="submit" disabled={enviandoComentario} className={primaryButtonClass}>
                  {enviandoComentario ? 'Enviando…' : 'Comentar'}
                </button>
              </div>
            </form>
          ) : (
            <AuthInlineForm onAuthSuccess={onAuthSuccess} />
          )}
        </div>
      </div>
    </>
  )
}

// Botón cuadrado de la cabecera (← / →).
function NavButton({ onClick, disabled, label, pressed, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`flex h-8 w-8 items-center justify-center border border-neutral-950 text-sm transition-colors hover:bg-[#FFB401] disabled:cursor-default disabled:border-neutral-300 disabled:text-neutral-300 disabled:hover:bg-transparent ${focusRing}`}
    >
      {children}
    </button>
  )
}

// `contexto` = { posicion, total, anterior, siguiente } — dónde está este
// problema dentro de la lista que se estaba viendo (resultados filtrados, la
// carpeta abierta, etc.), para poder ir al de antes / al de después.
function ProblemaPanel({ problema, contexto, onIr, onClose, auth, onAuthSuccess, onAuthExpired }) {
  const [enlaceCopiado, setEnlaceCopiado] = useState(false)
  // Opcional: agranda el panel a toda la pantalla y el texto crece con él.
  // Se mantiene al pasar de un
  // problema a otro y se reinicia al cerrar el panel.
  const [expandido, setExpandido] = useState(false)
  useBloquearScroll()

  // Teclado: Escape cierra (estándar de accesibilidad para cualquier diálogo);
  // ← / → van al problema anterior / siguiente, salvo que se esté escribiendo
  // en un campo (ahí las flechas mueven el cursor del texto).
  useEffect(() => {
    function alPresionarTecla(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      const escribiendo = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      if (escribiendo) return
      if (event.key === 'ArrowLeft' && contexto.anterior) onIr(contexto.anterior)
      if (event.key === 'ArrowRight' && contexto.siguiente) onIr(contexto.siguiente)
    }
    window.addEventListener('keydown', alPresionarTecla)
    return () => window.removeEventListener('keydown', alPresionarTecla)
  }, [onClose, onIr, contexto.anterior, contexto.siguiente])

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setEnlaceCopiado(true)
      setTimeout(() => setEnlaceCopiado(false), 1800)
    } catch {
      // Sin permiso de portapapeles (ej. página sin https): no hay nada útil
      // que mostrar, el enlace sigue estando en la barra de direcciones.
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-black/50"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.4, ease: EASE }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-panel-problema"
        className={`absolute right-0 top-0 flex h-full w-full flex-col border-l border-neutral-950 bg-white transition-[max-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          expandido ? 'max-w-full' : 'max-w-2xl'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-950 px-4 py-3 sm:gap-4 sm:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <NavButton
              label="Problema anterior (←)"
              disabled={!contexto.anterior}
              onClick={() => onIr(contexto.anterior)}
            >
              ←
            </NavButton>
            <NavButton
              label="Problema siguiente (→)"
              disabled={!contexto.siguiente}
              onClick={() => onIr(contexto.siguiente)}
            >
              →
            </NavButton>
            <p className={`${labelClass} whitespace-nowrap tabular-nums`}>
              <span className="text-neutral-950">{contexto.posicion}</span> / {contexto.total}
              <span className="max-sm:hidden"> · {problema.tema}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* En móvil el panel ya ocupa toda la pantalla: no hace falta. */}
            <span className="max-md:hidden">
              <NavButton
                label={expandido ? 'Contraer panel' : 'Expandir panel'}
                pressed={expandido}
                onClick={() => setExpandido((valor) => !valor)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  {expandido ? (
                    <>
                      <polyline points="4 14 10 14 10 20" />
                      <polyline points="20 10 14 10 14 4" />
                      <line x1="14" x2="21" y1="10" y2="3" />
                      <line x1="3" x2="10" y1="21" y2="14" />
                    </>
                  ) : (
                    <>
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" x2="14" y1="3" y2="10" />
                      <line x1="3" x2="10" y1="21" y2="14" />
                    </>
                  )}
                </svg>
              </NavButton>
            </span>
            <button
              type="button"
              onClick={copiarEnlace}
              className={`text-xs uppercase tracking-[0.2em] text-neutral-600 transition-colors hover:text-neutral-950 ${focusRing}`}
            >
              <span aria-live="polite" className="whitespace-nowrap">
                {enlaceCopiado ? 'Copiado ✓' : (<><span className="sm:hidden">Enlace</span><span className="max-sm:hidden">Copiar enlace</span></>)}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className={`text-xs uppercase tracking-[0.2em] text-neutral-600 transition-colors hover:text-neutral-950 ${focusRing}`}
            >
              <span className="max-sm:hidden">Cerrar </span>✕
            </button>
          </div>
        </header>

        <ProblemaDetalle
          key={problema._id}
          problema={problema}
          expandido={expandido}
          auth={auth}
          onAuthSuccess={onAuthSuccess}
          onAuthExpired={onAuthExpired}
        />
      </motion.aside>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Filas de índice (estilo Uber): número · nombre · dato · flecha. Al pasar el
// mouse, un color plano "barre" la fila de izquierda a derecha (un span con
// scaleX animado por CSS) y la flecha se desliza. Cero sombras, cero curvas.
// ---------------------------------------------------------------------------
function ProblemaRow({ problema, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(problema)}
      variants={rowIn}
      className={`group relative grid w-full grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 overflow-hidden border-b border-neutral-300 px-2 py-5 text-left sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:py-6 ${focusRing}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-neutral-100 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
      <span className="relative font-display text-xl tabular-nums text-neutral-400 transition-colors group-hover:text-neutral-950 sm:text-2xl">
        {numeroProblema(problema)}
      </span>
      <span className="relative min-w-0">
        <span className="block text-base text-neutral-950 sm:text-lg">
          {formatearTitulo(problema)}
        </span>
        <span className="mt-0.5 block text-xs text-neutral-500">{problema.tema}</span>
      </span>
      <span
        aria-hidden="true"
        className="relative text-lg transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </motion.button>
  )
}

function FolderRow({ nodo, count, index, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(nodo._id)}
      variants={rowIn}
      className={`group relative grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 overflow-hidden border-b border-neutral-300 px-2 py-7 text-left sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:py-10 ${focusRing}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-[#FFB401] transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
      <span className="relative text-sm tabular-nums text-neutral-400 transition-colors group-hover:text-neutral-950">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="relative font-display text-3xl uppercase leading-none text-neutral-950 transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl lg:text-5xl">
        {nodo.name}
      </span>
      <span className="relative flex items-center gap-4 sm:gap-8">
        <span className="hidden text-sm text-neutral-500 transition-colors group-hover:text-neutral-950 sm:inline">
          {count} {count === 1 ? 'problema' : 'problemas'}
        </span>
        <span
          aria-hidden="true"
          className="text-2xl transition-transform duration-300 group-hover:translate-x-2"
        >
          →
        </span>
      </span>
    </motion.button>
  )
}

// Migas de pan ("Inicio / Putnam / 2021"). El último tramo (dónde estás) no
// es un botón, los anteriores sí.
function Breadcrumb({ ruta, onNavigate }) {
  return (
    <nav
      aria-label="Ruta de carpetas"
      className="mb-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em]"
    >
      {ruta.map((item, i) => {
        const esUltimo = i === ruta.length - 1
        return (
          <span key={item._id ?? 'inicio'} className="flex items-center gap-2">
            {i > 0 && <span className="text-neutral-300">/</span>}
            {esUltimo ? (
              <span className="text-neutral-950">{item.name}</span>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate(item._id)}
                className={`text-neutral-500 underline decoration-transparent underline-offset-4 transition-colors hover:text-neutral-950 hover:decoration-neutral-950 ${focusRing}`}
              >
                {item.name}
              </button>
            )}
          </span>
        )
      })}
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Encabezado: cuadrícula matemática de fondo que se "enciende" alrededor del
// cursor. Es una capa de líneas tenues siempre visible + otra capa de líneas
// oscuras que solo se ve dentro de un círculo que sigue al mouse (máscara
// radial controlada por variables CSS --mx / --my; no re-renderiza React).
// ---------------------------------------------------------------------------
const GRID_SIZE = '56px 56px'
const gridLines = (color) =>
  `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`
const SPOTLIGHT_MASK = 'radial-gradient(240px circle at var(--mx) var(--my), #000, transparent)'

function GridSpotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const capa = ref.current
    const seccion = capa?.parentElement
    if (!capa || !seccion) return

    const alMover = (event) => {
      const caja = seccion.getBoundingClientRect()
      capa.style.setProperty('--mx', `${event.clientX - caja.left}px`)
      capa.style.setProperty('--my', `${event.clientY - caja.top}px`)
    }
    seccion.addEventListener('pointermove', alMover)
    return () => seccion.removeEventListener('pointermove', alMover)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ '--mx': '-999px', '--my': '-999px' }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: gridLines('#ececec'), backgroundSize: GRID_SIZE }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: gridLines('#0a0a0a'),
          backgroundSize: GRID_SIZE,
          WebkitMaskImage: SPOTLIGHT_MASK,
          maskImage: SPOTLIGHT_MASK,
        }}
      />
    </div>
  )
}

function Encabezado({ auth, onLogout, listo, totalProblemas, totalTemas, totalConcursos }) {
  const stats = [
    { label: 'Problemas', value: totalProblemas },
    { label: 'Temas', value: totalTemas },
    { label: 'Concursos', value: totalConcursos },
  ]

  return (
    <section className="relative overflow-hidden border-b border-neutral-950 bg-white pb-14 pt-36 sm:pb-20 sm:pt-44">
      <GridSpotlight />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-36 hidden text-4xl text-neutral-300 lg:block xl:right-16"
        dangerouslySetInnerHTML={{ __html: FORMULA_BASILEA }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.08)}
        className="relative mx-auto max-w-7xl px-4 sm:px-8"
      >
        <motion.p variants={rowIn} className={`${labelClass} mb-6`}>
          Axioma · Colección de competencias
        </motion.p>

        <motion.h1
          variants={rowIn}
          className="text-[clamp(3rem,10.5vw,9.5rem)] leading-[0.88] tracking-tight text-neutral-950"
        >
          Archivo de
          <br />
          problemas
        </motion.h1>

        <motion.div
          variants={rowIn}
          className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="max-w-md text-base leading-relaxed text-neutral-600">
            Explora, filtra y comenta problemas de competencias — cada uno es un hilo abierto para
            discutir.
          </p>

          <dl className="flex gap-10 sm:gap-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className={labelClass}>{stat.label}</dt>
                <dd className="mt-2 font-display text-5xl leading-none text-neutral-950 sm:text-6xl">
                  {listo ? <Counter value={stat.value} /> : '—'}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {auth && (
          <motion.p variants={rowIn} className="mt-8 text-xs text-neutral-500">
            Sesión iniciada como{' '}
            <strong className="font-medium text-neutral-950">{auth.user.username}</strong> ·{' '}
            <button
              type="button"
              onClick={onLogout}
              className={`underline underline-offset-4 hover:text-neutral-950 ${focusRing}`}
            >
              cerrar sesión
            </button>
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}

// Un mensaje de estado (cargando, vacío, error) con el mismo lenguaje plano.
function Estado({ children, tono = 'neutro' }) {
  return (
    <div
      className={`border px-6 py-16 text-center text-sm ${
        tono === 'error'
          ? 'border-red-700 text-red-700'
          : 'border-neutral-300 text-neutral-500'
      }`}
    >
      {children}
    </div>
  )
}

function Cargando() {
  return (
    <div className="border-t border-neutral-950" aria-busy="true" aria-live="polite">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-6 border-b border-neutral-200 px-2 py-6">
          <div className="h-5 w-12 bg-neutral-200" />
          <div className="h-5 flex-1 bg-neutral-100" />
          <div className="h-3 w-16 bg-neutral-200" />
        </div>
      ))}
      <span className="sr-only">Cargando problemas…</span>
    </div>
  )
}

export default function Problemas() {
  const [problemas, setProblemas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)

  const [categorias, setCategorias] = useState([])
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false) // solo en móvil
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const buscadorRef = useRef(null)

  // auth arranca leyendo localStorage, para seguir logueado tras recargar.
  const [auth, setAuth] = useState(() => {
    try {
      const guardado = localStorage.getItem(AUTH_STORAGE_KEY)
      return guardado ? JSON.parse(guardado) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    apiFetch('/api/problems')
      .then(setProblemas)
      .catch((err) => setErrorCarga(err.message))
      .finally(() => setCargando(false))

    // Las carpetas se piden aparte: si esta llamada falla, preferimos que la
    // lista de problemas siga funcionando (solo sin carpetas).
    apiFetch('/api/categories')
      .then(setCategorias)
      .catch(() => setCategorias([]))
  }, [])

  const { raices: arbolCategorias, byId: categoriasPorId } = useMemo(
    () => buildCategoryTree(categorias),
    [categorias],
  )

  // -------------------------------------------------------------------
  // Estado en la URL. Filtros, búsqueda, carpeta abierta y problema abierto
  // viven en la barra de direcciones (?tema=Álgebra&dir=Putnam/2021&p=...),
  // así el botón "atrás" funciona y cualquier vista se puede compartir.
  // Las carpetas se escriben por NOMBRE (Putnam/2021) y los problemas por su
  // código (PUTNAM-2025-B6), no por _id: los _id cambian cada vez que se
  // vuelve a correr `npm run seed` y los enlaces dejarían de servir.
  // -------------------------------------------------------------------
  const { rutaPorId, nodoPorRuta } = useMemo(() => {
    const rutaPorId = new Map()
    const nodoPorRuta = new Map()
    const recorrer = (nodo, prefijo) => {
      const ruta = prefijo ? `${prefijo}/${nodo.name}` : nodo.name
      rutaPorId.set(nodo._id, ruta)
      nodoPorRuta.set(ruta, nodo)
      nodo.children.forEach((hijo) => recorrer(hijo, ruta))
    }
    arbolCategorias.forEach((nodo) => recorrer(nodo, ''))
    return { rutaPorId, nodoPorRuta }
  }, [arbolCategorias])

  const años = useMemo(() => searchParams.getAll('anio'), [searchParams])
  const temas = useMemo(() => searchParams.getAll('tema'), [searchParams])
  const tipos = useMemo(() => searchParams.getAll('tipo'), [searchParams])
  const busqueda = searchParams.get('q') ?? ''

  // Carpetas marcadas como FILTRO (casillas, varias a la vez).
  const categoriasSeleccionadas = useMemo(
    () =>
      searchParams
        .getAll('carpetas')
        .map((ruta) => nodoPorRuta.get(ruta)?._id)
        .filter(Boolean),
    [searchParams, nodoPorRuta],
  )

  // Carpeta que se está NAVEGANDO ahora (una sola; null = raíz). Es
  // independiente de las carpetas-filtro de arriba.
  const dirParam = searchParams.get('dir')
  const carpetaActual = (dirParam && nodoPorRuta.get(dirParam)?._id) || null

  const codigoAbierto = searchParams.get('p')
  const problemaSeleccionado = useMemo(
    () => (codigoAbierto ? (problemas.find((p) => p.codigo === codigoAbierto) ?? null) : null),
    [codigoAbierto, problemas],
  )

  // Cambia varios parámetros de la URL de una vez. Un valor vacío/null quita
  // el parámetro; un arreglo lo repite (?tema=A&tema=B).
  // replace:true = no agrega una entrada al historial (para filtros y
  // escritura en el buscador: si no, "atrás" tendría que deshacer cada
  // casilla una por una).
  const actualizarParams = (cambios, opciones = {}) =>
    setSearchParams((prev) => {
      const siguiente = new URLSearchParams(prev)
      Object.entries(cambios).forEach(([clave, valor]) => {
        siguiente.delete(clave)
        const valores = Array.isArray(valor) ? valor : valor ? [valor] : []
        valores.forEach((v) => siguiente.append(clave, v))
      })
      return siguiente
    }, opciones)

  const alternarParam = (clave) => (valor) => {
    const actuales = searchParams.getAll(clave)
    actualizarParams(
      { [clave]: actuales.includes(valor) ? actuales.filter((v) => v !== valor) : [...actuales, valor] },
      { replace: true },
    )
  }
  const alternarCarpetaFiltro = (id) => {
    const ruta = rutaPorId.get(id)
    if (ruta) alternarParam('carpetas')(ruta)
  }

  // Entrar a una carpeta SÍ agrega historial: "atrás" sube un nivel.
  const setCarpetaActual = (id) => actualizarParams({ dir: id ? rutaPorId.get(id) : null })
  const setBusqueda = (texto) => actualizarParams({ q: texto }, { replace: true })

  // Abrir un problema agrega historial (y deja una marca en `state`): así
  // "atrás" cierra el panel. Ir al anterior/siguiente reemplaza en vez de
  // agregar, para no llenar el historial. Cerrar usa "atrás" si el panel se
  // abrió desde la lista; si alguien llegó por un enlace directo, "atrás" lo
  // sacaría de la página, así que solo se quita el parámetro.
  const abrirProblema = (problema) =>
    actualizarParams({ p: problema.codigo }, { state: { desdeLista: true } })
  const irAProblema = (problema) =>
    actualizarParams({ p: problema.codigo }, { replace: true, state: location.state })
  const cerrarProblema = () => {
    if (location.state?.desdeLista) navigate(-1)
    else actualizarParams({ p: null }, { replace: true })
  }

  // Atajo "/" para ir directo al buscador (como en GitHub o Google).
  useEffect(() => {
    const alPresionar = (event) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || codigoAbierto) return
      event.preventDefault()
      buscadorRef.current?.focus()
    }
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [codigoAbierto])

  // "Efectivas" = las carpetas marcadas, YA expandidas con sus subcarpetas.
  // Es lo que realmente se compara contra problema.category al filtrar.
  const categoriasEfectivas = useMemo(() => {
    const ids = new Set()
    categoriasSeleccionadas.forEach((id) => {
      const nodo = categoriasPorId.get(id)
      if (nodo) collectDescendantIds(nodo).forEach((d) => ids.add(d))
    })
    return ids
  }, [categoriasSeleccionadas, categoriasPorId])

  const handleAuthSuccess = (data) => {
    setAuth(data)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
  }

  const handleLogout = () => {
    setAuth(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  // Buscador: se arma un texto normalizado por problema (título, tema, tipo,
  // año y enunciado) y se exige que aparezcan TODAS las palabras escritas.
  const indiceBusqueda = useMemo(
    () =>
      problemas.map((p) => ({
        id: p._id,
        texto: normalizarTexto(`${formatearTitulo(p)} ${p.tema} ${p.tipo} ${p.año} ${p.enunciado}`),
      })),
    [problemas],
  )
  const idsBusqueda = useMemo(() => {
    const palabras = normalizarTexto(busqueda).split(/\s+/).filter(Boolean)
    if (palabras.length === 0) return null
    return new Set(
      indiceBusqueda.filter((e) => palabras.every((w) => e.texto.includes(w))).map((e) => e.id),
    )
  }, [busqueda, indiceBusqueda])

  const problemasFiltrados = useMemo(() => {
    return problemas.filter((p) => {
      if (idsBusqueda && !idsBusqueda.has(p._id)) return false
      if (años.length && !años.includes(p.año)) return false
      if (temas.length && !temas.includes(p.tema)) return false
      if (tipos.length && !tipos.includes(p.tipo)) return false
      // Si se marcó alguna carpeta, el problema debe caer dentro de ella o
      // de alguna de sus subcarpetas.
      if (categoriasSeleccionadas.length && !categoriasEfectivas.has(p.category)) {
        return false
      }
      return true
    })
  }, [problemas, idsBusqueda, años, temas, tipos, categoriasSeleccionadas, categoriasEfectivas])

  // Estadísticas del encabezado y conteos del sidebar: se calculan solas a
  // partir de los problemas ya cargados, no son datos nuevos.
  const temasCubiertos = useMemo(() => new Set(problemas.map((p) => p.tema)).size, [problemas])
  const concursosCubiertos = useMemo(() => new Set(problemas.map((p) => p.tipo)).size, [problemas])

  const conteos = useMemo(() => {
    const contar = (campo) =>
      problemas.reduce((acc, p) => ({ ...acc, [p[campo]]: (acc[p[campo]] ?? 0) + 1 }), {})
    return { años: contar('año'), temas: contar('tema'), tipos: contar('tipo') }
  }, [problemas])

  // Llave que cambia con cada filtro: al dársela a la lista, React la vuelve a
  // montar y la animación de entrada se repite en cada filtrado.
  const filtrosKey = useMemo(
    () => JSON.stringify({ años, temas, tipos, categoriasSeleccionadas }),
    [años, temas, tipos, categoriasSeleccionadas],
  )

  // -------------------------------------------------------------------
  // Navegación por carpetas (estilo AoPS)
  // -------------------------------------------------------------------

  // Si hay CUALQUIER filtro marcado, ese filtro manda: se ve la lista plana
  // filtrada sin importar en qué carpeta estén. Las carpetas son solo la
  // pantalla de bienvenida para cuando todavía no se pidió ningún filtro.
  const hayBusqueda = busqueda.trim().length > 0
  const hayFiltrosActivos =
    hayBusqueda ||
    años.length > 0 ||
    temas.length > 0 ||
    tipos.length > 0 ||
    categoriasSeleccionadas.length > 0
  const totalFiltros =
    (hayBusqueda ? 1 : 0) +
    años.length +
    temas.length +
    tipos.length +
    categoriasSeleccionadas.length

  const limpiarFiltros = () =>
    actualizarParams({ anio: [], tema: [], tipo: [], carpetas: [], q: null }, { replace: true })

  // Etiquetas quitables de los filtros activos (van arriba de los resultados).
  const etiquetasActivas = [
    ...(hayBusqueda
      ? [{ key: 'busqueda', label: `“${busqueda.trim()}”`, quitar: () => setBusqueda(null) }]
      : []),
    ...años.map((v) => ({ key: `año-${v}`, label: v, quitar: () => alternarParam('anio')(v) })),
    ...temas.map((v) => ({ key: `tema-${v}`, label: v, quitar: () => alternarParam('tema')(v) })),
    ...tipos.map((v) => ({ key: `tipo-${v}`, label: v, quitar: () => alternarParam('tipo')(v) })),
    ...categoriasSeleccionadas.map((id) => ({
      key: `cat-${id}`,
      label: categoriasPorId.get(id)?.name ?? 'Carpeta',
      quitar: () => alternarCarpetaFiltro(id),
    })),
  ]

  const carpetaAbierta = carpetaActual ? categoriasPorId.get(carpetaActual) : null

  // Si la carpeta abierta tiene hijos, esas son las subcarpetas a mostrar. Si
  // NO tiene hijos (una hoja, ej. "2021"), ahí es donde viven los problemas.
  const subcarpetas = carpetaAbierta ? carpetaAbierta.children : arbolCategorias
  const esCarpetaHoja = Boolean(carpetaAbierta) && carpetaAbierta.children.length === 0

  const problemasDeCarpeta = useMemo(() => {
    if (!esCarpetaHoja) return []
    return problemas.filter((p) => p.category === carpetaActual)
  }, [problemas, carpetaActual, esCarpetaHoja])

  // Migas de pan: sube por los `.parent` de la carpeta actual hasta la raíz.
  const rutaCarpeta = useMemo(() => {
    const cadena = []
    let nodo = carpetaAbierta
    while (nodo) {
      cadena.unshift(nodo)
      nodo = nodo.parent ? categoriasPorId.get(nodo.parent) : null
    }
    return [{ _id: null, name: 'Inicio' }, ...cadena]
  }, [carpetaAbierta, categoriasPorId])

  // Qué se dibuja en el área principal:
  //  - 'filtros'   -> hay un filtro activo (o no hay carpetas todavía).
  //  - 'carpetas'  -> sin filtros, viendo una lista de carpetas.
  //  - 'problemas' -> sin filtros, adentro de una carpeta hoja.
  const vista =
    hayFiltrosActivos || arbolCategorias.length === 0
      ? 'filtros'
      : esCarpetaHoja
        ? 'problemas'
        : 'carpetas'

  const tituloVista =
    vista === 'filtros' ? 'Resultados' : carpetaAbierta ? carpetaAbierta.name : 'Concursos'
  const cantidadVista =
    vista === 'filtros'
      ? problemasFiltrados.length
      : vista === 'problemas'
        ? problemasDeCarpeta.length
        : carpetaAbierta
          ? contarProblemas(carpetaAbierta, problemas)
          : problemas.length

  const listo = !cargando && !errorCarga

  // Dónde está el problema abierto dentro de la lista que se estaba viendo
  // (resultados filtrados o la carpeta abierta), para las flechas
  // anterior/siguiente del panel. Si se llegó por un enlace directo y no hay
  // esa lista, se usan los problemas de su misma carpeta.
  const contextoProblema = useMemo(() => {
    if (!problemaSeleccionado) return null
    const listaVista =
      vista === 'filtros' ? problemasFiltrados : vista === 'problemas' ? problemasDeCarpeta : []
    const lista = listaVista.some((p) => p._id === problemaSeleccionado._id)
      ? listaVista
      : problemas.filter((p) => p.category === problemaSeleccionado.category)
    const i = lista.findIndex((p) => p._id === problemaSeleccionado._id)
    return {
      posicion: i + 1,
      total: lista.length,
      anterior: lista[i - 1] ?? null,
      siguiente: lista[i + 1] ?? null,
    }
  }, [problemaSeleccionado, vista, problemasFiltrados, problemasDeCarpeta, problemas])

  return (
    <div className="bg-white">
      <Encabezado
        auth={auth}
        onLogout={handleLogout}
        listo={listo && problemas.length > 0}
        totalProblemas={problemas.length}
        totalTemas={temasCubiertos}
        totalConcursos={concursosCubiertos}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 pb-32 sm:px-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
        {/* Columna de filtros: en escritorio se queda fija (sticky) con su
            propio scroll interno, para poder ver sus últimas opciones sin
            depender de qué tan abajo estés en la lista. En móvil se
            despliega con un botón. */}
        <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-3">
          <button
            type="button"
            onClick={() => setFiltrosAbiertos((abierto) => !abierto)}
            aria-expanded={filtrosAbiertos}
            className={`flex w-full items-center justify-between border border-neutral-950 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors hover:bg-[#FFB401] lg:hidden ${focusRing}`}
          >
            <span>Filtros{totalFiltros > 0 ? ` (${totalFiltros})` : ''}</span>
            <span aria-hidden="true">{filtrosAbiertos ? '−' : '+'}</span>
          </button>

          <aside className={`${filtrosAbiertos ? 'mt-6 block' : 'hidden'} lg:mt-0 lg:block`}>
            <div className="mb-4 hidden items-baseline justify-between lg:flex">
              <p className={labelClass}>Filtros</p>
              {hayFiltrosActivos && (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className={`text-xs text-neutral-600 underline underline-offset-4 hover:text-neutral-950 ${focusRing}`}
                >
                  Limpiar ({totalFiltros})
                </button>
              )}
            </div>
            <FilterGroup
              title="Año"
              options={AÑOS}
              selected={años}
              onToggle={alternarParam('anio')}
              counts={conteos.años}
            />
            <FilterGroup
              title="Tema"
              options={TEMAS}
              selected={temas}
              onToggle={alternarParam('tema')}
              counts={conteos.temas}
            />
            <FilterGroup
              title="Tipo de concurso"
              options={TIPOS}
              selected={tipos}
              onToggle={alternarParam('tipo')}
              counts={conteos.tipos}
            />
            <CategoryFilter
              raices={arbolCategorias}
              problemas={problemas}
              seleccionadas={categoriasSeleccionadas}
              onToggle={alternarCarpetaFiltro}
            />
          </aside>
        </div>

        {/* Área principal */}
        <div className="min-w-0">
          {cargando && <Cargando />}

          {!cargando && errorCarga && (
            <Estado tono="error">No se pudo conectar con el servidor: {errorCarga}</Estado>
          )}

          {listo && (
            <>
              {/* Buscador: título, tema, tipo, año y enunciado. Escribir en él
                  cambia la vista a "resultados"; "/" lo enfoca desde
                  cualquier parte de la página. */}
              <div className="relative mb-8">
                <label htmlFor="buscador-problemas" className="sr-only">
                  Buscar problemas
                </label>
                <input
                  id="buscador-problemas"
                  ref={buscadorRef}
                  type="search"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      if (busqueda) setBusqueda(null)
                      event.currentTarget.blur()
                    }
                  }}
                  placeholder="Buscar por tema, año, concurso o palabra del enunciado…"
                  autoComplete="off"
                  className={`${inputClass} py-3.5 pr-12 text-base`}
                />
                {!busqueda && (
                  <kbd
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 border border-neutral-300 px-1.5 py-0.5 text-[11px] text-neutral-500 sm:block"
                  >
                    /
                  </kbd>
                )}
              </div>

              {/* Migas de pan: solo tienen sentido navegando carpetas y una
                  vez que ya se entró a alguna (en la raíz, la ruta es solo
                  [Inicio]). */}
              {vista !== 'filtros' && rutaCarpeta.length > 1 && (
                <Breadcrumb ruta={rutaCarpeta} onNavigate={setCarpetaActual} />
              )}

              <div className="flex items-end justify-between gap-6 border-b border-neutral-950 pb-3">
                <h2 className="text-3xl leading-none text-neutral-950 sm:text-4xl">{tituloVista}</h2>
                <p className="shrink-0 text-sm tabular-nums text-neutral-500">
                  {cantidadVista} {cantidadVista === 1 ? 'problema' : 'problemas'}
                </p>
              </div>

              {/* Filtros activos como etiquetas que se pueden quitar. */}
              {hayFiltrosActivos && (
                <div className="flex flex-wrap items-center gap-2 pt-4">
                  {etiquetasActivas.map((etiqueta) => (
                    <button
                      key={etiqueta.key}
                      type="button"
                      onClick={etiqueta.quitar}
                      aria-label={`Quitar filtro ${etiqueta.label}`}
                      className={`inline-flex items-center gap-2 border border-neutral-950 px-3 py-1 text-xs transition-colors hover:bg-[#FFB401] ${focusRing}`}
                    >
                      {etiqueta.label}
                      <span aria-hidden="true">×</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className={`ml-2 text-xs text-neutral-600 underline underline-offset-4 hover:text-neutral-950 ${focusRing}`}
                  >
                    Limpiar todo
                  </button>
                </div>
              )}

              <div className="mt-6">
                {vista === 'filtros' && problemasFiltrados.length === 0 && (
                  <Estado>No hay problemas que coincidan con los filtros.</Estado>
                )}

                {vista === 'filtros' && problemasFiltrados.length > 0 && (
                  <motion.div
                    key={filtrosKey}
                    variants={staggerContainer(0.03)}
                    initial="hidden"
                    animate="show"
                    className="border-t border-neutral-950"
                  >
                    {problemasFiltrados.map((problema) => (
                      <ProblemaRow
                        key={problema._id}
                        problema={problema}
                        onOpen={abrirProblema}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Lista de carpetas: Putnam / OMMU Primera Ronda / OMMU
                    Nacional en la raíz, o las subcarpetas (años) de la que
                    se abrió. */}
                {vista === 'carpetas' && (
                  <motion.div
                    key={carpetaActual ?? 'raiz'}
                    variants={staggerContainer(0.06)}
                    initial="hidden"
                    animate="show"
                    className="border-t border-neutral-950"
                  >
                    {subcarpetas.map((nodo, i) => (
                      <FolderRow
                        key={nodo._id}
                        nodo={nodo}
                        index={i}
                        count={contarProblemas(nodo, problemas)}
                        onOpen={setCarpetaActual}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Adentro de una carpeta hoja (ej. "2021"): ya no hay más
                    carpetas, aquí por fin se ven los problemas. */}
                {vista === 'problemas' && problemasDeCarpeta.length === 0 && (
                  <Estado>Esta carpeta todavía no tiene problemas.</Estado>
                )}

                {vista === 'problemas' && problemasDeCarpeta.length > 0 && (
                  <motion.div
                    key={carpetaActual}
                    variants={staggerContainer(0.03)}
                    initial="hidden"
                    animate="show"
                    className="border-t border-neutral-950"
                  >
                    {problemasDeCarpeta.map((problema) => (
                      <ProblemaRow
                        key={problema._id}
                        problema={problema}
                        onOpen={abrirProblema}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {problemaSeleccionado && contextoProblema && (
          <ProblemaPanel
            key="panel-problema"
            problema={problemaSeleccionado}
            contexto={contextoProblema}
            onIr={irAProblema}
            onClose={cerrarProblema}
            auth={auth}
            onAuthSuccess={handleAuthSuccess}
            onAuthExpired={handleLogout}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
