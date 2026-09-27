import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Counter from '../motion/Counter'
import { fadeUp, popIn, revealProps, staggerContainer } from '../motion/variants'

// Sección Quiénes Somos (id="quienes-somos")
// TODO equipo: reemplazar el texto de misión/visión, la imagen grupal
// y las cifras de STATS por el contenido real del club.
//
// Diseño: dos columnas. Texto a la izquierda en tamaño de lectura (18 px,
// ambos párrafos igual) y la imagen grupal a la derecha; para cerrar, las
// cifras en una banda oscura de borde a borde.

const STATS = [
  {
    id: 1,
    value: 2025,
    prefix: '',
    suffix: '',
    label: 'Fundado en',
    // Calendario
    icono: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />,
  },
  {
    id: 2,
    value: 100,
    prefix: '+',
    suffix: '',
    label: 'Miembros de la comunidad',
    // Personas
    icono: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    id: 3,
    // Real, no una meta ni un número inventado: es justo lo que hay hoy en
    // server/src/data/problemasReales.js (Putnam, OMMU Primera Ronda y OMMU
    // Nacional). Si agregan más problemas ahí, actualicen este número —
    // ver TODO al inicio del archivo.
    value: 93,
    prefix: '',
    suffix: '',
    label: 'Problemas en el archivo',
    href: '/problemas',
    // Documento
    icono: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M9 13h6M9 17h6" />
      </>
    ),
  },
]

// Imagen grupal. Tiene una "hoja" suave desplazada detrás y un leve efecto
// "magnético" en 2D: se desplaza unos píxeles hacia el cursor. Sin
// transforms 3D, que cuestan en equipos sin GPU buena.
function ImagenMagnetica() {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const translateX = useTransform(x, [-0.5, 0.5], [-6, 6])
  const translateY = useTransform(y, [-0.5, 0.5], [-6, 6])

  const alMoverMouse = (event) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const reiniciar = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div variants={popIn()} className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-brand-200/70 sm:translate-x-4 sm:translate-y-4"
      />
      <motion.div
        ref={ref}
        onMouseMove={alMoverMouse}
        onMouseLeave={reiniciar}
        style={{ x: translateX, y: translateY }}
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-brand-200 bg-brand-100 shadow-lg"
      >
        {/* Foto real: presentación "Nuestro Axioma" ante el club. La imagen
            es más ancha que este recuadro (4:3), así que object-cover
            recorta un poco los lados y centra la pantalla y los ponentes. */}
        <img
          src="/quienes-somos-grupal.png"
          alt="Presentación de Axioma ante el club, con la pantalla del logo al fondo"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  )
}

// Cuando la cifra tiene `href` (hoy solo "Problemas en el archivo"), la
// tarjeta entera es un link — invita a ir a ver esos 93 problemas, no solo
// a leer el número.
const MotionLink = motion(Link)

function CifraBanda({ stat }) {
  const Envoltura = stat.href ? MotionLink : motion.div
  return (
    <Envoltura
      to={stat.href}
      variants={fadeUp}
      className={`group flex flex-col items-center gap-4 text-center sm:border-l sm:border-white/15 sm:first:border-l-0 ${
        stat.href ? 'transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white' : ''
      }`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          {stat.icono}
        </svg>
      </span>
      <p className="font-display text-6xl leading-none text-white sm:text-7xl">
        <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
      </p>
      <p className="text-sm font-medium text-white/70">
        {stat.label}
        {stat.href && (
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            →
          </span>
        )}
      </p>
    </Envoltura>
  )
}

export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="scroll-mt-16 bg-white">
      <motion.div
        className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28"
        variants={staggerContainer(0.15)}
        {...revealProps}
      >
        <div className="grid items-center gap-14 md:grid-cols-2 md:gap-16 lg:gap-20">
          {/* Texto en tamaño de lectura (18 px), alineado a la izquierda y con
              un ancho cómodo: ni titular gigante ni bloque centrado. */}
          <motion.div variants={staggerContainer(0.12)} className="flex flex-col items-start gap-5">
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl leading-[1.05] text-brand-900 sm:text-5xl"
            >
              ¿Qué es Axioma?
            </motion.h2>
            {/* Propósito y visión oficiales, tal como quedaron registrados en
                el Anexo 3 de LiFE (Grupos Estudiantiles) — no son texto de
                relleno. */}
            <motion.p variants={fadeUp} className="text-lg leading-relaxed text-brand-900/80">
              Axioma es el club de matemáticas del Tec de Monterrey. Nuestro
              propósito es crear un ecosistema formal y sostenible para el
              desarrollo del talento matemático en la institución: ser el
              punto de unión para estudiantes apasionados por la resolución de
              problemas, la docencia y las competencias, canalizando su
              potencial para elevar el prestigio académico del Tec y generar
              un impacto social positivo a través de la educación.
            </motion.p>
            <motion.p variants={fadeUp} className="text-lg leading-relaxed text-brand-900/80">
              Nuestra visión es ser la principal cuna de talento matemático
              del Tecnológico de Monterrey, reconocida por liderar en
              competencias nacionales y por nuestro compromiso activo de
              formar a los próximos talentos de la región.
            </motion.p>
          </motion.div>

          <ImagenMagnetica />
        </div>
      </motion.div>

      {/* Banda oscura de borde a borde con las cifras. */}
      <motion.div
        variants={staggerContainer(0.12)}
        {...revealProps}
        className="bg-brand-900 px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-3 sm:gap-0">
          {STATS.map((stat) => (
            <CifraBanda key={stat.id} stat={stat} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
