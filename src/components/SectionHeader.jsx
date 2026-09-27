import { motion } from 'framer-motion'
import { fadeUp, revealProps } from './motion/variants'

// Encabezado común de las secciones de la portada: título centrado + una
// línea de descripción. Es exactamente el patrón que ya usa Eventos, para
// que todas las secciones se vean del mismo sistema (mismo tamaño, misma
// alineación, mismo espacio debajo). Si lo cambian aquí, cambia en todas.
export default function SectionHeader({ titulo, descripcion }) {
  return (
    <>
      <motion.h2
        variants={fadeUp}
        {...revealProps}
        className="font-display mb-4 text-center text-4xl text-brand-900 sm:text-5xl"
      >
        {titulo}
      </motion.h2>
      {descripcion && (
        <motion.p
          variants={fadeUp}
          {...revealProps}
          className="mx-auto mb-12 max-w-xl text-center text-brand-900/70"
        >
          {descripcion}
        </motion.p>
      )}
    </>
  )
}
