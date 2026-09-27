import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { EASE } from '../motion/variants'
import { useBloquearScroll } from '../../hooks/useBloquearScroll'
import { useApiData } from '../../hooks/useApiData'
import { api } from '../../lib/api'
import SectionHeader from '../SectionHeader'

// Sección Galería (id="galeria")
// Las fotos vienen de la API (server/ + MongoDB), igual que Equipo y
// Eventos — se agregan y editan desde /admin/galeria, sin tocar código.
// IMAGENES_RESPALDO se usa solo si la API no responde.
// `ratio` es la proporción (ancho / alto) de cada foto: mezclar verticales
// y horizontales es lo que le da ritmo a las filas; se calcula solo al
// subir la imagen en el panel de administración.
//
// Diseño: dos filas de fotos de borde a borde de la pantalla que se
// deslizan en sentidos opuestos según se hace scroll (sin espacios
// vacíos a los lados, sin nada inclinado). Click en una foto = visor.
// Mismo lenguaje suave que Equipo y Quiénes Somos: esquinas redondeadas,
// bordes claros y sombra leve.

const IMAGENES_RESPALDO = [
  { id: 1, src: null, ratio: 4 / 5, alt: 'Sesión semanal de resolución de problemas de Axioma' },
  { id: 2, src: null, ratio: 3 / 2, alt: 'Equipo de Axioma en una competencia interuniversitaria' },
  { id: 3, src: null, ratio: 1, alt: 'Taller de introducción a la combinatoria' },
  { id: 4, src: null, ratio: 3 / 4, alt: 'Integrantes del club en la premiación de una olimpiada' },
  { id: 5, src: null, ratio: 3 / 2, alt: 'Pizarra con la solución de un problema de geometría' },
  { id: 6, src: null, ratio: 5 / 4, alt: 'Reunión general del club Axioma' },
]

const numero = (indice) => String(indice + 1).padStart(2, '0')

function Contenido({ imagen, className = '' }) {
  return imagen.src ? (
    <img src={imagen.src} alt={imagen.alt} className={`h-full w-full object-cover ${className}`} />
  ) : (
    <span className="px-4 text-center text-xs text-brand-400">{imagen.alt}</span>
  )
}

// Una foto de la fila. La altura la fija la fila; el ancho sale de `ratio`.
function Foto({ imagen, indice, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(indice)}
      aria-label={`Ver foto ${numero(indice)}: ${imagen.alt}`}
      style={{ aspectRatio: imagen.ratio }}
      className="group relative h-56 shrink-0 overflow-hidden rounded-2xl border border-brand-200 bg-brand-100 text-left shadow-md transition-shadow duration-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900 sm:h-72 lg:h-80"
    >
      <div className="flex h-full w-full items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
        <Contenido imagen={imagen} />
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium tabular-nums tracking-[0.1em] text-brand-900 shadow-sm">
        {numero(indice)}
      </span>

      {/* Pie que sube desde abajo al pasar el mouse. */}
      <span className="absolute inset-x-3 bottom-3 translate-y-[calc(100%+12px)] rounded-xl bg-brand-900/90 px-3 py-2 text-xs leading-snug text-white transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
        {imagen.alt}
      </span>
    </button>
  )
}

// Fila que se desplaza en horizontal según el progreso del scroll.
// Las fotos se repiten para que la fila siempre sea más ancha que la
// pantalla, por grande que sea el monitor.
function Fila({ imagenes, progreso, desde, hasta, onOpen }) {
  const reducirMovimiento = useReducedMotion()
  const x = useTransform(progreso, [0, 1], reducirMovimiento ? [desde, desde] : [desde, hasta])
  const lista = [...imagenes, ...imagenes]

  return (
    <motion.div style={{ x }} className="flex w-max gap-4 will-change-transform sm:gap-6">
      {lista.map((imagen, i) => (
        <Foto key={`${imagen.id}-${i}`} imagen={imagen} indice={imagenes.indexOf(imagen)} onOpen={onOpen} />
      ))}
    </motion.div>
  )
}

function BotonVisor({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-white transition-colors hover:bg-white hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:border-white/25 disabled:text-white/25 disabled:hover:bg-transparent disabled:hover:text-white/25"
    >
      {children}
    </button>
  )
}

// Visor a pantalla completa con flechas y teclado.
function Visor({ imagenes, indice, onIr, onClose }) {
  useBloquearScroll()
  const imagen = imagenes[indice]
  const anterior = indice > 0 ? indice - 1 : null
  const siguiente = indice < imagenes.length - 1 ? indice + 1 : null

  useEffect(() => {
    const alPresionar = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && anterior !== null) onIr(anterior)
      if (event.key === 'ArrowRight' && siguiente !== null) onIr(siguiente)
    }
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [anterior, siguiente, onIr, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de fotos"
      className="fixed inset-0 z-[60] flex flex-col bg-brand-900/90 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div className="flex items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] tabular-nums">
          {numero(indice)} / {numero(imagenes.length - 1)}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Cerrar ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center py-6">
        <motion.div
          key={imagen.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ aspectRatio: imagen.ratio }}
          className="flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-2xl bg-brand-100 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Contenido imagen={imagen} />
        </motion.div>
      </div>

      <div
        className="flex items-center justify-between gap-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="max-w-xl text-sm text-white/80">{imagen.alt}</p>
        <div className="flex shrink-0 gap-2">
          <BotonVisor label="Foto anterior (←)" disabled={anterior === null} onClick={() => onIr(anterior)}>
            ←
          </BotonVisor>
          <BotonVisor label="Foto siguiente (→)" disabled={siguiente === null} onClick={() => onIr(siguiente)}>
            →
          </BotonVisor>
        </div>
      </div>
    </motion.div>
  )
}

export default function Galeria() {
  const { data: imagenes } = useApiData(api.getGaleria, IMAGENES_RESPALDO)
  const [abierta, setAbierta] = useState(null)
  const seccionRef = useRef(null)

  // 0 cuando la sección empieza a entrar por abajo, 1 cuando su borde
  // inferior llega al fondo de la pantalla (ya se ve completa): las filas
  // terminan su recorrido justo cuando se ve toda la galería.
  const { scrollYProgress } = useScroll({
    target: seccionRef,
    offset: ['start end', 'end end'],
  })

  // Segunda fila con otro orden, para que no se vean pares idénticos.
  const mitad = Math.ceil(imagenes.length / 2)
  const invertidas = [...imagenes.slice(mitad), ...imagenes.slice(0, mitad)]

  return (
    <section id="galeria" ref={seccionRef} className="scroll-mt-16 overflow-x-clip py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          titulo="Galería"
          descripcion="Sesiones, concursos y momentos del club. Haz scroll para recorrerla y toca una foto para verla completa."
        />
      </div>

      {/* Filas de borde a borde: fuera del contenedor con max-width. */}
      <div className="flex flex-col gap-4 pl-4 sm:gap-6 sm:pl-8">
        <Fila imagenes={imagenes} progreso={scrollYProgress} desde="0%" hasta="-30%" onOpen={setAbierta} />
        <Fila imagenes={invertidas} progreso={scrollYProgress} desde="-30%" hasta="0%" onOpen={setAbierta} />
      </div>

      <AnimatePresence>
        {abierta !== null && (
          <Visor key="visor" imagenes={imagenes} indice={abierta} onIr={setAbierta} onClose={() => setAbierta(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
