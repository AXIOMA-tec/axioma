import { motion } from 'framer-motion'
import { fadeUp, revealProps, staggerContainer } from '../motion/variants'
import FloatingSymbol from '../motion/FloatingSymbol'

// Sección chiquita entre Equipo y Eventos (sin id propio: no es un destino
// de navegación, solo un respiro). Dos razones para existir:
//   1. Todo el sitio hasta aquí es bastante formal — esto le baja el tono
//      un rato y juega con el nombre del club.
//   2. Equipo y Eventos son dos secciones con fondo blanco y mucho padding
//      cada una (py-24 + py-24): puestas una tras otra dejaban un tramo en
//      blanco larguísimo sin nada que lo rompa.
//
// Diseño: la primera versión de esto usaba tarjetas redondeadas con un
// ícono en un círculo de color y sombra — la plantilla "feature card" que
// se ve en cualquier landing genérica. Esta versión copia en cambio el
// patrón que el sitio YA tiene y que es suyo: la franja de cifras de
// Quiénes Somos (columnas planas separadas por una línea delgada, un
// elemento grande arriba, texto chico abajo). El símbolo de cada axioma va
// en un "sello" plano de color sólido (sin esquinas redondeadas, como los
// botones del Hero/Contacto, no un círculo suave) para darle el mismo
// contraste/color que ya funcionó en los íconos de esa franja, pero con
// forma y sombra propias en vez de copiarlos igual.
const ROJO = '#B70B0D'
const NARANJA = '#E57505'
const DORADO = '#FFB401'
// El dorado de marca (#FFB401) tal cual es casi ilegible como TEXTO sobre
// blanco (contraste ~1.8:1); esta versión más oscura da ~5.9:1. El sello de
// abajo sigue usando el dorado real de fondo — ahí el texto es oscuro
// encima, así que el contraste no es problema.
const DORADO_TEXTO = '#8A5A00'

// Tres axiomas de verdad (no inventados), traducidos a algo que se lea
// fácil y le saque una sonrisa a quien no es de matemáticas. Cada uno lleva
// un "sello" de color sólido con el símbolo — plano, sin esquinas
// redondeadas ni sombra difusa (mismo lenguaje que el botón "Únete" del
// Hero), derecho (sin inclinación: se veía chueco).
const AXIOMAS = [
  {
    id: 1,
    simbolo: '=',
    fondo: DORADO,
    textoSello: 'text-brand-900',
    color: DORADO_TEXTO,
    nombre: 'Axioma de identidad',
    formula: 'a = a',
    texto: 'Todo es igual a sí mismo. Hasta un axioma tiene su ego.',
  },
  {
    id: 2,
    simbolo: '∥',
    fondo: NARANJA,
    textoSello: 'text-white',
    color: NARANJA,
    nombre: 'Postulado de las paralelas',
    formula: 'Euclides, 300 a.C.',
    texto: 'Por un punto fuera de una recta pasa una única paralela a ella. Ni una más, ni una menos.',
  },
  {
    id: 3,
    simbolo: '∈',
    fondo: ROJO,
    textoSello: 'text-white',
    color: ROJO,
    nombre: 'Axioma de elección',
    texto: 'Si tienes infinitas cajas con al menos un calcetín cada una, puedes elegir un calcetín de cada caja.',
    formula: 'Zermelo, 1904',
  },
]

function ColumnaAxioma({ axioma }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col items-center gap-3 border-brand-200 px-4 py-5 text-center sm:border-l sm:py-0 sm:first:border-l-0"
    >
      {/* El sello: plano y sólido, no un ícono suave en un círculo — mismo
          lenguaje que los botones del Hero/Contacto (sin esquinas
          redondeadas). */}
      <span
        aria-hidden="true"
        style={{ backgroundColor: axioma.fondo, boxShadow: '6px 6px 0 0 rgba(15, 23, 42, 0.15)' }}
        className={`flex h-16 w-16 shrink-0 items-center justify-center font-serif text-3xl italic ${axioma.textoSello}`}
      >
        {axioma.simbolo}
      </span>
      <p style={{ color: axioma.color }} className="text-xs font-bold uppercase tracking-[0.15em]">
        {axioma.formula}
      </p>
      <h3 className="font-display text-lg leading-tight text-brand-900">{axioma.nombre}</h3>
      <p className="max-w-xs text-sm leading-relaxed text-brand-900/70">{axioma.texto}</p>
    </motion.div>
  )
}

export default function AxiomaCurioso() {
  return (
    <section className="relative overflow-hidden bg-brand-50 py-12">
      <FloatingSymbol symbol="∀" className="pointer-events-none absolute left-[6%] top-[10%] text-3xl text-brand-900/10 sm:text-4xl" delay={0} duration={7} rotate={-6} />
      <FloatingSymbol symbol="∴" className="pointer-events-none absolute right-[8%] bottom-[10%] text-3xl text-brand-900/10 sm:text-4xl" delay={0.6} duration={8} rotate={8} />
      <FloatingSymbol symbol="∃" className="pointer-events-none absolute right-[20%] top-[8%] text-2xl text-brand-900/10 sm:text-3xl" delay={1} duration={6.5} rotate={-4} />

      <motion.div
        className="relative mx-auto max-w-5xl px-4 sm:px-6"
        variants={staggerContainer(0.12)}
        {...revealProps}
      >
        <motion.p variants={fadeUp} className="text-center text-xs font-medium uppercase tracking-[0.2em] text-brand-500">
          Por si te preguntabas de dónde viene el nombre
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-display mt-2 mb-8 text-center text-3xl text-brand-900 sm:text-4xl">
          Un axioma es una verdad que no necesita demostrarse
        </motion.h2>

        <motion.div variants={staggerContainer(0.1)} className="mx-auto grid max-w-3xl gap-2 sm:grid-cols-3 sm:gap-0">
          {AXIOMAS.map((axioma) => (
            <ColumnaAxioma key={axioma.id} axioma={axioma} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
