import { MeshGradient } from '@paper-design/shaders-react'
import { motion } from 'framer-motion'
import { fadeUp, revealProps, staggerContainer } from '../motion/variants'
import { CORREO, INSTAGRAM_URL, UNETE_URL, WHATSAPP_URL } from '../../lib/contacto'

// Sección Contacto (id="contacto") — cierre de la página.
// Fondo animado con shaders (@paper-design/shaders-react), mismo tipo de
// mesh gradient que el Hero, en la paleta Axioma: rojo #B70B0D,
// naranja #E57505 y amarillo dorado #FFB401.
// El correo y el link de WhatsApp se cambian en src/lib/contacto.js.

// WhatsApp va como SVG en línea (no hay archivo PNG de ese ícono en /public).
const WHATSAPP_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'

// Los íconos se piden desde la raíz ("/icons8-...png"): los archivos de
// /public se sirven ahí. Con "/public/..." funciona en desarrollo pero se
// rompe en producción.
const REDES = [
  {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    icon: '/icons8-instagram-logo-48.png',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/axioma-mty/posts/?feedView=allr',
    icon: '/icons8-linkedin-50.png',
  },
  {
    label: 'WhatsApp',
    href: WHATSAPP_URL,
    svg: WHATSAPP_PATH,
  },
]

export default function Contacto() {
  return (
    <section
      id="contacto"
      data-navbar-tone="light"
      className="relative w-full overflow-hidden bg-[#120303] px-6 pt-24 text-center sm:px-10 sm:pt-32"
    >
      {/* Fondo shader: mismo mesh gradient animado del Hero, paleta Axioma */}
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
        {/* Overlay oscuro para mantener contraste y legibilidad del contenido */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#120303]/75 via-[#120303]/35 to-[#120303]/85" />
      </div>

      <motion.div
        variants={staggerContainer(0.12)}
        {...revealProps}
        className="relative mx-auto flex max-w-2xl flex-col items-center gap-6"
      >
        <motion.h2
          variants={fadeUp}
          className="text-5xl text-white drop-shadow-[0_0_25px_rgba(229,117,5,0.45)] sm:text-6xl"
        >
          Únete a Axioma
        </motion.h2>

        <motion.p variants={fadeUp} className="max-w-lg text-lg text-white/85">
          Escríbenos y te contamos cómo participar en los entrenamientos, los
          cursos de los sábados y los concursos.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col items-center gap-5">
          <a
            href={UNETE_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 border border-[#FFB401] bg-[#FFB401] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[#120303] transition-colors duration-300 hover:border-white hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Únete aquí
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>

          {/* El correo completo a la vista: se puede leer y copiar. */}
          <a
            href={`mailto:${CORREO}`}
            className="break-all text-base font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white sm:text-lg"
          >
            {CORREO}
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-2 flex justify-center gap-8">
          {REDES.map((red) => (
            <a
              key={red.label}
              href={red.href}
              target="_blank"
              rel="noreferrer"
              aria-label={red.label}
              className="rounded-full transition-transform hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(183,11,13,0.6)]"
            >
              {red.svg ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  role="img"
                  aria-label={red.label}
                  className="h-12 w-12 p-1.5 text-white drop-shadow-[0_0_10px_rgba(255,180,1,0.35)]"
                >
                  <path d={red.svg} />
                </svg>
              ) : (
                <img
                  src={red.icon}
                  alt={red.label}
                  className="h-12 w-12 object-contain drop-shadow-[0_0_10px_rgba(255,180,1,0.35)]"
                />
              )}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Pie de página */}
      <footer className="relative mx-auto mt-20 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-white/15 py-6 text-xs text-white/60 sm:flex-row">
        <p>© {new Date().getFullYear()} Axioma · Tecnológico de Monterrey</p>
        <p>Capítulo Estudiantil de la Sociedad Matemática Mexicana</p>
      </footer>
    </section>
  )
}
