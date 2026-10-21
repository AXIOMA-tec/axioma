import { motion } from 'framer-motion'
import SectionHeader from '../SectionHeader'
import { fadeUp, revealProps } from '../motion/variants'
import { INSTAGRAM_URL, UNETE_URL, WHATSAPP_URL } from '../../lib/contacto'

// Sección "Cómo unirte" (id="unete"): las dudas de quien llega por primera
// vez. Cada respuesta es un <details> nativo (se abre y se cierra sin
// JavaScript, con teclado y con lectores de pantalla), con el mismo estilo
// plano del resto del sitio: sin esquinas redondeadas ni sombras.
//
// OJO con los datos: horario, costo y requisitos son los que dio el club. Si
// algo cambia (otro horario, un costo), se edita aquí, en PREGUNTAS.

const linkClass =
  'underline decoration-brand-900/40 underline-offset-4 transition-colors hover:decoration-brand-900'

const PREGUNTAS = [
  {
    pregunta: '¿Cuándo son los entrenamientos?',
    respuesta: (
      <>
        Los entrenamientos son los sábados de 11:00 a 15:00, pero no todos los sábados hay. Las
        fechas de cada uno las avisamos en{' '}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={linkClass}>
          Instagram
        </a>
        , en el{' '}
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={linkClass}>
          grupo de WhatsApp
        </a>{' '}
        y en la sección de Eventos de esta página. Lo mejor es estar al pendiente de alguno de los
        tres.
      </>
    ),
  },
  {
    pregunta: '¿Tiene costo?',
    respuesta: 'No, no tiene costo.',
  },
  {
    pregunta: '¿Necesito saber matemáticas antes de llegar?',
    respuesta:
      'No. Puede entrar cualquier persona con interés. No hace falta saber nada antes.',
  },
  {
    pregunta: '¿Puedo ir si estudio otra carrera o no soy del Tec?',
    respuesta:
      'Sí. Los entrenamientos están abiertos a estudiantes de cualquier carrera y también a personas externas al Tec.',
  },
  {
    pregunta: '¿Tengo que registrarme?',
    respuesta: (
      <>
        Sí. Cada entrenamiento se anuncia con un cartel en{' '}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={linkClass}>
          Instagram
        </a>{' '}
        que trae un código QR para registrarte. Si eres externo al Tec, regístrate con anticipación.
      </>
    ),
  },
  {
    pregunta: '¿Cómo me uno?',
    respuesta:
      'Con el botón de abajo llegas a todos nuestros enlaces, incluido el grupo de WhatsApp donde avisamos todo.',
  },
]

export default function Unete() {
  return (
    <section id="unete" className="scroll-mt-16 bg-brand-50">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <SectionHeader
          titulo="Cómo unirte"
          descripcion="Las dudas más comunes de quien llega por primera vez."
        />

        <motion.div variants={fadeUp} {...revealProps} className="border-t border-brand-900">
          {PREGUNTAS.map(({ pregunta, respuesta }) => (
            <details key={pregunta} className="group border-b border-brand-900/30">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg text-brand-900 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900 [&::-webkit-details-marker]:hidden">
                <span>{pregunta}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl leading-none text-brand-900 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-brand-900/75">{respuesta}</p>
            </details>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} {...revealProps} className="mt-10 flex justify-center">
          <a
            href={UNETE_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 border border-brand-900 bg-[#FFB401] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-900 transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
          >
            Únete aquí
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
