import { motion } from 'framer-motion'
import { fadeUp, popIn, revealProps, staggerContainer } from '../motion/variants'
import FloatingSymbol from '../motion/FloatingSymbol'

// Sección chiquita entre Equipo y Eventos (sin id propio: no es un destino
// de navegación, solo un respiro). Dos razones para existir:
//   1. Todo el sitio hasta aquí es bastante formal — esto le baja el tono
//      un rato y juega con el nombre del club.
//   2. Equipo y Eventos son dos secciones con fondo blanco y mucho padding
//      cada una (py-24 + py-24): puestas una tras otra dejaban un tramo en
//      blanco larguísimo sin nada que lo rompa. Este bloque, con su propio
//      fondo y color, ocupa justo ese tramo.
//
// Color: el resto del sitio entre Hero y Contacto es deliberadamente neutro
// (brand-*) — el rojo/naranja/dorado de marca solo aparece en esos dos
// "libros" que abren y cierran la página. Aquí se usa ese mismo trío, pero
// dosificado (chips e iconos, no un fondo a todo color) para que la sección
// se sienta viva sin romper ese ritmo.
const ROJO = '#B70B0D'
const NARANJA = '#E57505'
const DORADO = '#FFB401'

// Tres axiomas de verdad (no inventados), traducidos a algo que se lea
// fácil y le saque una sonrisa a quien no es de matemáticas.
const AXIOMAS = [
  {
    id: 1,
    simbolo: '=',
    color: DORADO,
    nombre: 'Axioma de identidad',
    formula: 'a = a',
    texto: 'Todo es igual a sí mismo. Hasta un axioma tiene su ego.',
  },
  {
    id: 2,
    simbolo: '∥',
    color: NARANJA,
    nombre: 'Postulado de las paralelas',
    formula: 'Euclides, 300 a.C.',
    texto: 'Por un punto fuera de una recta pasa una única paralela a ella. Ni una más, ni una menos.',
  },
  {
    id: 3,
    simbolo: '∈',
    color: ROJO,
    nombre: 'Axioma de elección',
    formula: 'Zermelo, 1904',
    texto: 'Si tienes infinitas cajas con al menos un calcetín cada una, puedes elegir un calcetín de cada caja.',
  },
]

function TarjetaAxioma({ axioma, rotate }) {
  return (
    <motion.li
      variants={popIn(rotate)}
      whileHover={{ y: -6, rotate: 0 }}
      style={{ borderTopColor: axioma.color }}
      className="flex w-72 shrink-0 snap-center flex-col gap-3 rounded-2xl border border-t-4 border-brand-200 bg-white p-5 text-left shadow-sm transition-shadow duration-300 hover:shadow-lg sm:w-auto"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          style={{ backgroundColor: axioma.color }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-xl italic text-white shadow-sm"
        >
          {axioma.simbolo}
        </span>
        <p
          style={{ color: axioma.color }}
          className="text-[11px] font-bold uppercase tracking-[0.15em]"
        >
          {axioma.formula}
        </p>
      </div>
      <h3 className="font-display text-lg leading-tight text-brand-900">{axioma.nombre}</h3>
      <p className="text-sm leading-relaxed text-brand-900/70">{axioma.texto}</p>
    </motion.li>
  )
}

export default function AxiomaCurioso() {
  return (
    // El fondo empieza y termina en blanco puro, igual que Equipo y Eventos
    // (las secciones vecinas): así no hay un borde duro donde "de repente"
    // aparece el color, solo un tinte que sube y baja como un foco suave.
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50 to-white py-16">
      {/* Un par de manchas de color muy difuminadas, de fondo: le dan
          profundidad al panel sin competir con las tarjetas ni con el
          texto (mismo trío rojo/naranja/dorado que Hero y Contacto). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-8 h-64 w-64 rounded-full opacity-[0.13] blur-3xl"
        style={{ backgroundColor: DORADO }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 right-[10%] h-64 w-64 rounded-full opacity-[0.12] blur-3xl"
        style={{ backgroundColor: NARANJA }}
      />

      <FloatingSymbol symbol="∀" className="pointer-events-none absolute left-[6%] top-[12%] text-3xl text-[#FFB401]/50 sm:text-4xl" delay={0} duration={7} rotate={-6} />
      <FloatingSymbol symbol="∴" className="pointer-events-none absolute right-[8%] top-[58%] text-3xl text-[#B70B0D]/40 sm:text-4xl" delay={0.6} duration={8} rotate={8} />
      <FloatingSymbol symbol="∃" className="pointer-events-none absolute right-[20%] top-[8%] text-2xl text-[#E57505]/45 sm:text-3xl" delay={1} duration={6.5} rotate={-4} />

      <motion.div
        className="relative mx-auto max-w-5xl px-4 sm:px-6"
        variants={staggerContainer(0.12)}
        {...revealProps}
      >
        <motion.p
          variants={fadeUp}
          style={{ color: NARANJA }}
          className="text-center text-xs font-bold uppercase tracking-[0.2em]"
        >
          Por si te preguntabas de dónde viene el nombre
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-display mt-2 text-center text-2xl text-brand-900 sm:text-3xl">
          Un axioma es una <span style={{ color: ROJO }}>verdad</span> que no necesita demostrarse
        </motion.h2>

        <motion.ul
          variants={staggerContainer(0.1)}
          className="mt-10 flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0"
        >
          <TarjetaAxioma axioma={AXIOMAS[0]} rotate={-2} />
          <TarjetaAxioma axioma={AXIOMAS[1]} rotate={1.5} />
          <TarjetaAxioma axioma={AXIOMAS[2]} rotate={-1} />
        </motion.ul>
      </motion.div>
    </section>
  )
}
