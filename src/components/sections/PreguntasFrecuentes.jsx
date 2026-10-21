import { INSTAGRAM_URL, WHATSAPP_URL } from '../../lib/contacto'

// Preguntas frecuentes de quien llega por primera vez. Vive dentro de
// Contacto ("Únete a Axioma"), sobre su fondo oscuro, así que los colores son
// claros. Cada respuesta es un <details> nativo (se abre y se cierra sin
// JavaScript, con teclado y con lectores de pantalla), con el mismo estilo
// plano del resto del sitio.
//
// OJO con los datos: horario, costo y requisitos son los que dio el club. Si
// algo cambia (otro horario, un costo), se edita aquí, en PREGUNTAS.

const linkClass =
  'underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white'

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
]

export default function PreguntasFrecuentes() {
  return (
    <div className="w-full text-left">
      <h3 className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
        Preguntas frecuentes
      </h3>
      <div className="border-t border-white/30">
        {PREGUNTAS.map(({ pregunta, respuesta }) => (
          <details key={pregunta} className="group border-b border-white/20">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-base text-white marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-lg [&::-webkit-details-marker]:hidden">
              <span>{pregunta}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-2xl leading-none text-white transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-xl pb-5 leading-relaxed text-white/80">{respuesta}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
