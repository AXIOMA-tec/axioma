import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiFetch } from '../lib/api'

// /recursos — todos los documentos descargables (PDFs de exámenes
// semanales, material de asesores), agrupados por año. Aparte de Problemas
// para que la sección "Recursos" de ahí no se llene de decenas de tarjetas
// con el tiempo (ver RECURSOS_VISIBLES en Problemas.jsx): ahí solo se ven
// los últimos, y "Ver todos" trae aquí. Mismo lenguaje visual plano que
// Problemas (bordes rectos, mayúsculas), sin todo el peso de KaTeX/filtros
// que esa página sí necesita.

const labelClass = 'text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500'
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950'

// Agrupa por el año de creación, más reciente primero; dentro de cada año,
// más reciente primero también.
function agruparPorAño(recursos) {
  const porAño = new Map()
  for (const recurso of [...recursos].reverse()) {
    const año = new Date(recurso.createdAt).getFullYear()
    if (!porAño.has(año)) porAño.set(año, [])
    porAño.get(año).push(recurso)
  }
  return [...porAño.entries()].sort(([a], [b]) => b - a)
}

function TarjetaRecurso({ recurso }) {
  return (
    <li>
      <a
        href={recurso.archivo}
        target="_blank"
        rel="noreferrer"
        className={`group flex items-center gap-4 border border-neutral-950 px-5 py-4 transition-colors hover:bg-[#FFB401] ${focusRing}`}
      >
        <span aria-hidden="true" className="text-2xl">↓</span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-neutral-950">{recurso.titulo}</span>
          {recurso.descripcion && (
            <span className="block truncate text-xs text-neutral-500 group-hover:text-neutral-800">
              {recurso.descripcion}
            </span>
          )}
        </span>
      </a>
    </li>
  )
}

function RecursosPage() {
  const [recursos, setRecursos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiFetch('/api/recursos')
      .then(setRecursos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const grupos = agruparPorAño(recursos)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pb-32 pt-36 sm:pt-44">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <Link
            to="/problemas"
            className={`text-xs uppercase tracking-[0.2em] text-neutral-600 underline underline-offset-4 hover:text-neutral-950 ${focusRing}`}
          >
            ← Archivo de problemas
          </Link>
          <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-tight text-neutral-950">
            Recursos
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-600">
            PDFs y otros documentos descargables — exámenes semanales, material de asesores.
          </p>

          <div className="mt-16 flex flex-col gap-14">
            {cargando && <p className="text-sm text-neutral-500">Cargando…</p>}
            {error && <p className="text-sm text-red-700">No se pudo conectar con el servidor: {error}</p>}
            {!cargando && !error && recursos.length === 0 && (
              <p className="border border-neutral-300 px-6 py-16 text-center text-sm text-neutral-500">
                Todavía no hay ningún recurso.
              </p>
            )}

            {grupos.map(([año, recursosDelAño]) => (
              <div key={año}>
                <p className={`${labelClass} mb-6 border-b border-neutral-950 pb-3`}>{año}</p>
                <ul className="flex flex-wrap gap-4">
                  {recursosDelAño.map((recurso) => (
                    <TarjetaRecurso key={recurso._id} recurso={recurso} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default RecursosPage
