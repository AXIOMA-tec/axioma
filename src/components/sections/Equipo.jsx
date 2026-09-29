import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, fadeUp, revealProps, staggerContainer } from '../motion/variants'
import { useApiData } from '../../hooks/useApiData'
import { api } from '../../lib/api'
import SectionHeader from '../SectionHeader'
import { useBloquearScroll } from '../../hooks/useBloquearScroll'

// Sección Equipo (id="equipo")
// Los datos vienen de la API (server/ + MongoDB) para poder actualizarlos
// sin tocar código — ver README para cómo agregar/editar miembros.
// MIEMBROS_RESPALDO se usa solo si la API no responde (backend dormido,
// sin conexión, etc.), para que la sección nunca se vea vacía.

// Orden: los directores sin coordinadores (Gil, Raúl, Alejandro) van juntos
// a propósito, en vez de en el lugar que les tocaría por id. Sus tarjetas no
// llevan el botón "Ver coordinación", así que puestos junto a los que sí lo
// tienen, la fila los estiraba parejo y les dejaba un hueco en blanco abajo
// (ver PanelCoordinacion/MemberCard). El `orden` es solo para que coincida
// con equipoEventos.js — aquí no se usa para ordenar, el arreglo ya va en
// el orden en que se debe mostrar.
const MIEMBROS_RESPALDO = [
  {
    id: 1,
    orden: 1,
    nombre: 'Hugo André Meza Fierros',
    rol: 'Presidente',
    foto: '/equipo/hugo-meza.webp',
    email: 'A00841695@tec.mx',
    linkedin: 'https://www.linkedin.com/in/hugo-a-meza',
    github: 'https://github.com/hugo-meza',
  },
  {
    id: 2,
    orden: 2,
    nombre: 'Lucero Díaz Ortega',
    rol: 'Vicepresidente',
    foto: '/equipo/lucero-diaz.webp',
    email: 'A01199346@tec.mx',
    linkedin: 'https://www.linkedin.com/in/lucero-d%C3%ADaz-ortega-98979b354/',
    github: 'https://github.com/Luzdks',
  },
  {
    id: 3,
    orden: 3,
    nombre: 'Gil Brandon Garcia Contreras',
    rol: 'Dirección de Proyectos',
    foto: '/equipo/gil-garcia.webp',
    email: 'A01254164@tec.mx',
    linkedin: 'https://www.linkedin.com/in/gil-brandon-garc%C3%ADa-contreras',
    github: 'https://github.com/gil-brandon',
  },
  {
    id: 4,
    orden: 4,
    nombre: 'Raúl Correa Ocañas',
    rol: 'Dirección de Vinculación',
    foto: '/equipo/raul-correa.webp',
    email: 'A01722401@tec.mx',
    linkedin: 'https://www.linkedin.com/in/rcorreao/',
    github: 'https://github.com/Racoo203',
  },
  {
    id: 7,
    orden: 5,
    nombre: 'Alejandro José Alfaro García',
    rol: 'Dirección de Finanzas',
    foto: '/equipo/alejandro-alfaro.webp',
    email: 'A00842460@tec.mx',
    linkedin: 'https://www.linkedin.com/in/alejandro-j-alfaro-g/',
    // Sin GitHub: el botón simplemente no aparece.
    github: '',
  },
  {
    id: 5,
    orden: 6,
    nombre: 'Emilio Alejandro González Huerta',
    rol: 'Dirección de Comunicación',
    foto: '/equipo/emilio-gonzalez.webp',
    email: 'A01286440@tec.mx',
    linkedin: 'https://www.linkedin.com/in/emiliogzzh/',
    github: 'https://github.com/emigzzh',
    coordinadores: [
      { nombre: 'Luis Daniel González Alcocer', rol: 'Coordinador de Marketing',
        email: '', linkedin: 'https://www.linkedin.com/in/ludago4499',
        foto: '/equipo/luis-gonzalez.webp' },
      { nombre: 'Diana Marlene Tovar Martínez', rol: 'Coordinadora de Marketing',
        email: '', linkedin: 'https://mx.linkedin.com/in/diana-marlene-tovar-mart%C3%ADnez-01a8233b3',
        foto: '/equipo/diana-tovar.webp' },
      { nombre: 'Victoria Beltrán Aguilar', rol: 'Coordinadora de Marketing',
        email: '', linkedin: 'https://www.linkedin.com/in/victoria-beltran-aguilar/',
        foto: '/equipo/victoria-beltran.webp' },
      { nombre: 'Paola Mireles Ochoa', rol: 'Coordinadora de Marketing',
        email: '', linkedin: 'https://www.linkedin.com/in/paola-mireles-ochoa-6161a7338/',
        foto: '/equipo/paola-mireles.webp' },
    ],
  },
  {
    id: 6,
    orden: 7,
    nombre: 'Catherine González Díaz',
    rol: 'Dirección de Investigación',
    foto: '/equipo/catherine-gonzalez.webp',
    email: 'A00845539@tec.mx',
    linkedin: 'https://www.linkedin.com/in/catherine-gonz%C3%A1lez-d%C3%ADaz-9a93a7281',
    github: 'https://github.com/catherinegd7',
    coordinadores: [
      { nombre: 'Ethiel Favila Alvarado', rol: 'Coordinadora de Investigación',
        email: '', linkedin: 'https://www.linkedin.com/in/ethiel-favila-alvarado-459ba2358/',
        github: 'https://github.com/efavilaa', foto: '/equipo/ethiel-favila.webp' },
      { nombre: 'Elías Perianza Robles', rol: 'Coordinador de Investigación',
        email: '', linkedin: 'https://www.linkedin.com/in/elias-perianza-robles/',
        github: 'https://github.com/Perianza18', foto: '/equipo/elias-perianza.webp' },
    ],
  },
  {
    id: 8,
    orden: 8,
    nombre: 'Orlando Gael Cardozo Beltrán',
    rol: 'Dirección de Responsabilidad Social',
    foto: '/equipo/orlando-cardozo.webp',
    email: 'A00841016@tec.mx',
    linkedin: 'https://www.linkedin.com/in/orlando-gael-cardozo-beltr%C3%A1n-884b913b5/',
    // Sin GitHub: el botón simplemente no aparece.
    github: '',
    coordinadores: [
      { nombre: 'Edgar Axel Pérez Flores', rol: 'Coordinador de Responsabilidad Social',
        email: '', linkedin: 'https://www.linkedin.com/in/edgar-axel-flores',
        foto: '/equipo/edgar-perez.webp' },
      { nombre: 'Angel Everardo Rodríguez Guevara', rol: 'Coordinador de Responsabilidad Social',
        email: '', linkedin: 'https://www.linkedin.com/in/angelrdzg' },
      { nombre: 'Andres Saul Perez Martinez', rol: 'Coordinador de Responsabilidad Social',
        email: '', linkedin: '', github: 'https://github.com/Andres210212' },
    ],
  },
  // Asesores: van al final a propósito, con `esAsesor: true` — el
  // componente de abajo les pone su propio encabezado ("Asesores")
  // separado de los directores, porque guían al club pero no son parte de
  // su jerarquía estudiantil.
  {
    id: 9,
    orden: 9,
    nombre: 'Manuel Alejandro Ucan Puc',
    rol: 'Asesor',
    foto: '/equipo/manuel-ucan.webp',
    email: '',
    linkedin: 'https://www.linkedin.com/in/alejandro-ucan-puc/',
    esAsesor: true,
  },
  {
    id: 10,
    orden: 10,
    nombre: 'Lilia Alanís López',
    rol: 'Asesora',
    foto: '/equipo/lilia-alanis.webp',
    email: '',
    linkedin: 'https://www.linkedin.com/in/liliaalanislopez/',
    esAsesor: true,
  },
]

// Diseño: tarjetas suaves y rectas (mismo lenguaje que Quiénes Somos y
// Eventos), alineadas. Los dos primeros miembros (presidencia) van más
// grandes, en una fila propia; el resto en filas de 3 en escritorio y de 2
// en móvil (así la sección no se hace interminable en el celular). Una fila
// incompleta siempre queda centrada, sin importar cuántos miembros haya.

const iniciales = (nombre) =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join('')
    .toUpperCase()

const ICONOS = {
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
}

function EnlaceSocial({ href, red, nombre }) {
  if (!href) return null
  const etiqueta = { linkedin: 'LinkedIn', github: 'GitHub', mail: 'Correo' }[red]
  const esCorreo = red === 'mail'
  return (
    <a
      href={href}
      // El correo se abre en la app de correo; las redes, en pestaña nueva.
      {...(esCorreo ? {} : { target: '_blank', rel: 'noreferrer' })}
      aria-label={`${etiqueta} de ${nombre}`}
      title={esCorreo ? href.replace('mailto:', '') : undefined}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-900/70 sm:h-10 sm:w-10 transition-colors hover:border-brand-900 hover:bg-brand-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
        aria-hidden="true"
      >
        {ICONOS[red]}
      </svg>
    </a>
  )
}

// Panel lateral con la coordinación de un director (mismo patrón que el panel
// de Problemas: entra desde la derecha, Esc o click fuera lo cierran, y la
// página de atrás no se desplaza mientras está abierto).
function PanelCoordinacion({ director, onClose }) {
  const cerrarRef = useRef(null)
  useBloquearScroll()

  useEffect(() => {
    cerrarRef.current?.focus()
  }, [])

  useEffect(() => {
    const alPresionar = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [onClose])

  const titulo = director.rol.startsWith('Dirección de')
    ? director.rol.replace('Dirección de', 'Coordinación de')
    : `Equipo de ${director.rol}`

  // Con 1 persona, una sola columna ancha. Con 2 o 4, grid parejo de 2
  // columnas (2x2 con 4: así no queda una fila "coja" con una sola tarjeta
  // huérfana a la izquierda y espacio vacío a su derecha, que es lo que
  // pasaba antes al forzar 3 columnas con 4 personas). Con 3, 5, 6+, hasta
  // 3 columnas en pantallas grandes.
  const numCoordinadores = director.coordinadores.length
  const columnas =
    numCoordinadores === 1
      ? ''
      : numCoordinadores === 2 || numCoordinadores === 4
        ? 'sm:grid-cols-2'
        : 'sm:grid-cols-2 lg:grid-cols-3'

  // Con 3 columnas los nombres largos ("Angel Everardo Rodríguez Guevara")
  // se sentían amontonados en max-w-3xl: la ventana crece un poco más para
  // darle a cada tarjeta el ancho que necesita.
  const anchoMaximo = numCoordinadores === 3 || numCoordinadores >= 5 ? 'max-w-4xl' : 'max-w-3xl'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] flex cursor-pointer items-center justify-center bg-brand-900/50 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.35, ease: EASE }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-coordinacion"
        className={`cursor-boundary flex max-h-[85vh] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ${anchoMaximo}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-brand-200 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-900/50">
              Dirige {director.nombre}
            </p>
            <h3 id="titulo-coordinacion" className="mt-2 font-display text-2xl leading-tight text-brand-900">
              {titulo}
            </h3>
          </div>
          <button
            ref={cerrarRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-200 text-brand-900/70 transition-colors hover:border-brand-900 hover:bg-brand-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
          >
            ✕
          </button>
        </header>

        {/* Una tarjeta por coordinador, con la foto como protagonista.
            Entran con un ligero escalonado, para que el reflector se sienta
            vivo aunque solo haya 1 o 2 personas. */}
        <motion.ul
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="show"
          className={`grid gap-4 overflow-y-auto overscroll-contain p-6 ${columnas}`}
        >
          {director.coordinadores.map((c, i) => (
            <motion.li
              key={`${c.nombre}-${i}`}
              variants={fadeUp}
              className="flex flex-col items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5 text-center sm:p-6"
            >
              <div className="rounded-full border border-brand-200 bg-white p-1.5">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-display text-3xl text-brand-400 sm:h-32 sm:w-32">
                  {c.foto ? (
                    <img src={c.foto} alt={c.nombre} className="h-full w-full object-cover" />
                  ) : (
                    iniciales(c.nombre)
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <p className="font-display text-base leading-tight tracking-wide text-brand-900 sm:text-lg">{c.nombre}</p>
                <p className="rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-900/70 ring-1 ring-brand-200">
                  {c.rol || 'Coordinación'}
                </p>
              </div>

              {/* Contacto: correo (se puede leer y copiar), LinkedIn y GitHub. */}
              <div className="mt-1 flex flex-col items-center gap-2 text-sm">
                {c.email && (
                  <a
                    href={`mailto:${c.email}`}
                    className="break-all text-brand-900/70 underline decoration-brand-300 underline-offset-4 transition-colors hover:text-brand-900 hover:decoration-brand-900"
                  >
                    {c.email}
                  </a>
                )}
                <div className="flex gap-2">
                  <EnlaceSocial href={c.linkedin} red="linkedin" nombre={c.nombre} />
                  <EnlaceSocial href={c.github} red="github" nombre={c.nombre} />
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </motion.div>
  )
}

function MemberCard({ miembro, destacado, onAbrir }) {
  const coordinadores = miembro.coordinadores ?? []
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={`group flex w-[calc(50%-8px)] flex-col items-center gap-3 rounded-2xl border border-brand-200 bg-white p-4 text-center shadow-md transition-shadow duration-300 hover:shadow-xl sm:w-[calc(50%-12px)] sm:gap-4 sm:p-7 ${
        destacado ? 'lg:w-[calc(50%-12px)]' : 'lg:w-[calc(33.333%-16px)]'
      }`}
    >
      {/* Marco tipo "doble aro" alrededor de la foto. */}
      <div className="rounded-full border border-brand-200 p-1.5 transition-colors duration-300 group-hover:border-brand-900">
        <div
          className={`flex items-center justify-center overflow-hidden rounded-full bg-brand-100 font-display text-brand-400 ${
            destacado ? 'h-24 w-24 text-2xl sm:h-32 sm:w-32 sm:text-3xl lg:h-40 lg:w-40 lg:text-4xl' : 'h-24 w-24 text-2xl sm:h-32 sm:w-32 sm:text-3xl'
          }`}
        >
          {miembro.foto ? (
            <img
              src={miembro.foto}
              alt={miembro.nombre}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            iniciales(miembro.nombre)
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3
          className={`font-display leading-tight tracking-wide text-brand-900 ${
            destacado ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg'
          }`}
        >
          {miembro.nombre}
        </h3>
        <p className="rounded-full bg-brand-100 px-3 py-1 text-[11px] font-medium text-brand-900/70 sm:text-xs">
          {miembro.rol}
        </p>
      </div>

      {/* Enlaces y botón siempre pegados al fondo de la tarjeta: así quedan
          alineados entre tarjetas de la misma fila aunque el nombre ocupe
          más o menos líneas. */}
      <div className="mt-auto flex flex-col items-center gap-3 pt-1">
        <div className="flex gap-2">
          <EnlaceSocial href={miembro.email ? `mailto:${miembro.email}` : ''} red="mail" nombre={miembro.nombre} />
          <EnlaceSocial href={miembro.linkedin} red="linkedin" nombre={miembro.nombre} />
          <EnlaceSocial href={miembro.github} red="github" nombre={miembro.nombre} />
        </div>

        {/* Solo los directores con coordinadores llevan este botón: abre el
            panel lateral con su coordinación. */}
        {coordinadores.length > 0 && (
          <button
            type="button"
            onClick={() => onAbrir(miembro)}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-900/80 transition-colors hover:border-brand-900 hover:bg-brand-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
          >
            <span className="flex -space-x-1.5" aria-hidden="true">
              {coordinadores.slice(0, 3).map((c, i) => (
                <span
                  key={`${c.nombre}-${i}`}
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-brand-200 font-display text-[8px] text-brand-900"
                >
                  {iniciales(c.nombre)}
                </span>
              ))}
            </span>
            Ver coordinación · {coordinadores.length}
          </button>
        )}
      </div>
    </motion.div>
  )
}

// Tarjeta horizontal para Asesores: foto del mismo tamaño que un director
// normal (no se agranda), pero el layout es foto-a-la-izquierda /
// texto-a-la-derecha en vez de apilado y centrado — así una tarjeta tan
// ancha como la de Hugo/Lucero no deja espacio vacío alrededor de un
// contenido chico, sin necesidad de agrandar nada.
function AsesorCard({ miembro }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group flex w-full items-center gap-5 rounded-2xl border border-brand-200 bg-white p-5 text-left shadow-md transition-shadow duration-300 hover:shadow-xl sm:w-[calc(50%-12px)] sm:gap-6 sm:p-7"
    >
      <div className="shrink-0 rounded-full border border-brand-200 p-1.5 transition-colors duration-300 group-hover:border-brand-900">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-display text-2xl text-brand-400 sm:h-28 sm:w-28 sm:text-3xl">
          {miembro.foto ? (
            <img
              src={miembro.foto}
              alt={miembro.nombre}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            iniciales(miembro.nombre)
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-start gap-2">
        <h3 className="font-display text-lg leading-tight tracking-wide text-brand-900 sm:text-xl">
          {miembro.nombre}
        </h3>
        <p className="rounded-full bg-brand-100 px-3 py-1 text-[11px] font-medium text-brand-900/70 sm:text-xs">
          {miembro.rol}
        </p>
        <div className="mt-1 flex gap-2">
          <EnlaceSocial href={miembro.email ? `mailto:${miembro.email}` : ''} red="mail" nombre={miembro.nombre} />
          <EnlaceSocial href={miembro.linkedin} red="linkedin" nombre={miembro.nombre} />
          <EnlaceSocial href={miembro.github} red="github" nombre={miembro.nombre} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Equipo() {
  const { data: miembros } = useApiData(api.getEquipo, MIEMBROS_RESPALDO)
  const [directorAbierto, setDirectorAbierto] = useState(null)
  const cerrarPanel = useCallback(() => setDirectorAbierto(null), [])

  // Los asesores (esAsesor: true) van aparte, con su propio encabezado al
  // final — guían al club pero no son parte de la jerarquía estudiantil
  // (presidencia → direcciones → coordinaciones), así que mezclarlos en la
  // misma fila mandaría el mensaje equivocado sobre dónde "quedan" en el
  // organigrama.
  const directores = miembros.filter((m) => !m.esAsesor)
  const asesores = miembros.filter((m) => m.esAsesor)

  return (
    <section
      id="equipo"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <SectionHeader
        titulo="Conoce al Equipo"
        descripcion="Las personas que organizan entrenamientos, concursos y todo lo demás en Axioma."
      />

      <motion.div
        className="flex flex-wrap justify-center gap-4 sm:gap-6"
        variants={staggerContainer(0.08)}
        {...revealProps}
      >
        {directores.map((miembro, indice) => (
          <MemberCard
            key={miembro.id}
            miembro={miembro}
            destacado={indice < 2}
            onAbrir={setDirectorAbierto}
          />
        ))}
      </motion.div>

      {asesores.length > 0 && (
        <motion.div variants={staggerContainer(0.08)} {...revealProps} className="mt-16">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-brand-500">
            Asesores
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {asesores.map((miembro) => (
              <AsesorCard key={miembro.id} miembro={miembro} />
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {directorAbierto && (
          <PanelCoordinacion key="coordinacion" director={directorAbierto} onClose={cerrarPanel} />
        )}
      </AnimatePresence>
    </section>
  )
}
