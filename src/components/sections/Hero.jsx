import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MeshGradient } from '@paper-design/shaders-react'
import FloatingSymbol from '../motion/FloatingSymbol'
import { EASE, staggerContainer } from '../motion/variants'
import { UNETE_URL } from '../../lib/contacto'

// Sección Hero (id="inicio")
// Fondo animado con shaders (@paper-design/shaders-react) usando la
// paleta de marca Axioma: rojo profundo #B70B0D, naranja #E57505 y
// amarillo dorado #FFB401.
// Encima del fondo: dos símbolos matemáticos flotantes y entrada del texto
// en stagger. El protagonista es el logo; debajo, un mensaje corto y discreto
// y dos acciones (una principal, "Únete", y una secundaria).
// TODO equipo: ajustar copy si cambia el mensaje.

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const word = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export default function Hero() {
  const navigate = useNavigate()

  const scrollToQuienesSomos = () => {
    document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="inicio"
      data-navbar-tone="light"
      className="relative flex min-h-svh scroll-mt-16 flex-col items-center justify-center gap-[clamp(1rem,3svh,2rem)] overflow-hidden bg-[#120303] px-4 pb-24 pt-28 text-center sm:px-6"
    >
      {/* Fondo shader: mesh gradient animado en la paleta Axioma */}
      <div className="pointer-events-none absolute inset-0">
        <MeshGradient
          className="absolute inset-0 h-full w-full"
          colors={['#B70B0D', '#E57505', '#FFB401', '#120303']}
          speed={0.3}
          distortion={0.85}
          swirl={0.3}
          grainMixer={0.05}
          grainOverlay={0.05}
        />
        {/* Overlay oscuro para mantener contraste y legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#120303]/75 via-[#120303]/35 to-[#120303]/85" />
      </div>

      {/* Solo dos símbolos: con seis el fondo se llenaba de ruido y le
          quitaba protagonismo al mensaje. */}
      <FloatingSymbol symbol="π" className="pointer-events-none absolute left-[8%] top-[10%] text-3xl text-[#FFB401]/40 sm:left-[10%] sm:top-[22%] sm:text-5xl" delay={0} duration={7} rotate={-8} />
      <FloatingSymbol symbol="∑" className="pointer-events-none absolute right-[16%] top-[10%] text-3xl text-[#E57505]/40 sm:right-[12%] sm:top-[18%] sm:text-6xl" delay={0.4} duration={6} rotate={6} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative flex flex-col items-center gap-4"
      >
        {/* Dorado sólido: antes era un degradado que terminaba en rojo, y esa
            parte se perdía sobre el fondo rojo oscuro. */}
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB401] sm:text-sm">
          Asociación X Interés Olímpico Matemático · Tec de Monterrey
        </span>

        <motion.div
          className="flex flex-col items-center gap-4"
          variants={staggerContainer(0.15)}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={word}>
            <img
              src="/axioma-logo-hero.webp"
              alt="Axioma"
              className="h-auto max-h-[34svh] w-[min(88vw,860px)] object-contain drop-shadow-[0_0_45px_rgba(255,180,1,0.35)]"
            />
          </motion.div>

          {/* El mensaje, corto y con la voz del propio cartel de los
              entrenamientos. Va discreto (letra normal, tamaño medio) para
              que el protagonista siga siendo el logo y no el titular. */}
          <motion.h1
            variants={word}
            className="max-w-3xl text-xl font-normal leading-snug tracking-wide text-white/90 sm:text-2xl lg:text-3xl"
          >
            Ven a mejorar y entrenar tus mates
          </motion.h1>

          <motion.p variants={word} className="max-w-2xl text-base text-white/65 sm:text-lg">
            Entrenamientos, concursos y un archivo de problemas de nivel olímpico. Abierto a cualquier carrera y sin necesidad de experiencia previa.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Una acción principal ("Únete") y una secundaria ("Ver problemas"). */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        className="relative flex flex-wrap items-center justify-center gap-3"
      >
        {/* Botones planos: rectangulares, color sólido, sin sombras ni
            degradados (mismo lenguaje que /problemas). Al pasar el mouse
            invierten el color; la flecha se desliza. */}
        <a
          href={UNETE_URL}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-3 border border-[#FFB401] bg-[#FFB401] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[#120303] transition-colors duration-300 hover:border-white hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Únete
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
        <button
          type="button"
          onClick={() => navigate('/problemas')}
          className="inline-flex items-center border border-white/60 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#120303] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Ver problemas
        </button>
      </motion.div>

      {/* Ícono de flecha animada indicando scroll hacia abajo (clickeable) */}
      <motion.button
        type="button"
        onClick={scrollToQuienesSomos}
        aria-label="Ir a la siguiente sección"
        className="absolute bottom-8 text-[#FFB401] hover:text-[#E57505]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </motion.button>
    </section>
  )
}