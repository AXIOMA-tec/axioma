import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Counter from '../motion/Counter'
import FloatingSymbol from '../motion/FloatingSymbol'
import { EASE, fadeUp, popIn, revealProps, staggerContainer } from '../motion/variants'

// Sección Quiénes Somos (id="quienes-somos")
// TODO equipo: reemplazar el texto de misión/visión, la imagen grupal
// y las cifras de STATS por el contenido real del club.
//
// Diseño: suave y redondeado, en el mismo lenguaje que Eventos (tarjetas
// claras, sombras leves), pero con todo derecho y alineado: nada inclinado.
// Detalles: la imagen se mueve un poco hacia el cursor, los símbolos
// matemáticos flotan y las tarjetas de cifras se levantan al pasar el mouse.

const STATS = [
  {
    id: 1,
    value: 2019,
    prefix: '',
    suffix: '',
    label: 'Fundado en',
    // Calendario
    icono: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />,
  },
  {
    id: 2,
    value: 50,
    prefix: '+',
    suffix: '',
    label: 'Miembros activos',
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
    value: 12,
    prefix: '',
    suffix: '',
    label: 'Competencias por año',
    // Trofeo
    icono: (
      <>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </>
    ),
  },
]

// Imagen con un leve efecto "magnético" en 2D: se desplaza unos píxeles
// hacia el cursor. Sin transforms 3D, que cuestan en equipos sin GPU buena.
function ImagenMagnetica() {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const translateX = useTransform(x, [-0.5, 0.5], [-8, 8])
  const translateY = useTransform(y, [-0.5, 0.5], [-8, 8])

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
      {/* Fondo suave desplazado, como una "hoja" detrás de la imagen. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-brand-200/70 sm:translate-x-4 sm:translate-y-4"
      />

      <motion.div
        ref={ref}
        onMouseMove={alMoverMouse}
        onMouseLeave={reiniciar}
        style={{ x: translateX, y: translateY }}
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-dashed border-brand-300 bg-brand-100 text-sm text-brand-400 shadow-lg"
      >
        Espacio para imagen grupal
      </motion.div>

      <FloatingSymbol
        symbol="π"
        className="absolute right-2 -top-9 text-5xl text-brand-300 sm:text-6xl"
        duration={7}
      />
      <FloatingSymbol
        symbol="∑"
        className="absolute -bottom-9 left-2 text-5xl text-brand-300/80 sm:text-6xl"
        delay={1}
        duration={8}
      />
    </motion.div>
  )
}

function TarjetaCifra({ stat }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="flex items-center gap-4 rounded-2xl border border-brand-200 bg-white p-5 shadow-md sm:flex-col sm:gap-3 sm:p-7 sm:text-center"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-900">
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
      <div>
        <p className="font-display text-4xl leading-none text-brand-900 sm:text-5xl">
          <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
        </p>
        <p className="mt-2 text-sm font-medium text-brand-900/60">{stat.label}</p>
      </div>
    </motion.div>
  )
}

export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <motion.div variants={staggerContainer(0.15)} {...revealProps}>
        <div className="grid items-center gap-16 md:grid-cols-2">
          <motion.div variants={staggerContainer(0.12)} className="flex flex-col items-start gap-5">
            <motion.span
              variants={fadeUp}
              className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-medium text-brand-900/70"
            >
              Club de matemáticas · Tec de Monterrey
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl text-brand-900 sm:text-5xl"
            >
              ¿Qué es Axioma?
            </motion.h2>

            {/* Subrayado que se dibuja solo al entrar en pantalla. */}
            <motion.svg
              viewBox="0 0 220 12"
              className="-mt-3 h-3 w-44 text-brand-900 sm:w-56"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M2 8 C 40 2, 70 12, 110 6 S 180 3, 218 7"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0 },
                  show: { pathLength: 1, transition: { duration: 1, delay: 0.4, ease: EASE } },
                }}
              />
            </motion.svg>

            <motion.p variants={fadeUp} className="text-brand-900/70">
              Axioma es el club de matemáticas del Tec de Monterrey. Reunimos a
              estudiantes apasionados por resolver problemas, prepararnos para
              competencias y compartir el gusto por las matemáticas fuera del
              salón de clases. (Texto placeholder — reemplazar con misión y
              visión reales.)
            </motion.p>
            <motion.p variants={fadeUp} className="text-brand-900/70">
              Nuestra visión es construir una comunidad donde cualquier persona,
              sin importar su nivel, encuentre un espacio para aprender,
              practicar y crecer junto a otros entusiastas de las matemáticas.
            </motion.p>
          </motion.div>

          <ImagenMagnetica />
        </div>

        {/* Tres tarjetas del mismo tamaño, alineadas en fila. */}
        <motion.div
          variants={staggerContainer(0.12)}
          className="mt-24 grid gap-4 sm:grid-cols-3 sm:gap-6"
        >
          {STATS.map((stat) => (
            <TarjetaCifra key={stat.id} stat={stat} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
