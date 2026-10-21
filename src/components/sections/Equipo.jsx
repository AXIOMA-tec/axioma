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
        email: '', linkedin: 'https://www.linkedin.com/in/angelrdzg',
        foto: '/equipo/angel-everardo.jpg' },
      { nombre: 'Andres Saul Perez Martinez', rol: 'Coordinador de Responsabilidad Social',
        email: '', linkedin: '', github: 'https://github.com/Andres210212',
        foto: '/equipo/andres-saul.jpg' },
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

// Diseño: cuadrícula plana y editorial. Los dos primeros miembros
// (presidencia) van destacados, en una fila propia con la foto a un lado; el
// resto en filas de 3 en escritorio y de 2 en móvil (así la sección no se
// hace interminable en el celular).

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

// Estilo de esta sección: plano, igual que los botones y /problemas. Sin
// círculos, sin esquinas redondeadas, sin sombras. Antes eran tarjetas con
// foto circular y aro (la plantilla genérica de "equipo"), y una segunda
// versión con las fotos teñidas de sepia, que se sentía como periódico
// antiguo. Ahora las fotos van a todo color y lo que las une es un bloque
// sólido de la paleta de marca desplazado detrás de cada una, el mismo
// recurso de "sello" de Quiénes Somos y de los axiomas.

// Dorado, naranja y rojo de marca, en ese orden, repetidos por cada persona.
const ACENTOS = ['#FFB401', '#E57505', '#B70B0D']

const CARGO_CLASS = 'text-[11px] font-medium uppercase tracking-[0.18em] text-brand-900/65'

const botonPlanoClass =
  'inline-flex items-center gap-2 border border-brand-900 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-900 transition-colors hover:bg-[#FFB401] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900'

// Retrato rectangular a todo color, con un bloque de color sólido
// desplazado detrás. Al pasar el mouse (o al enfocar con teclado) la foto se
// corre un poco hacia arriba a la izquierda y deja ver más del bloque. El
// padre debe llevar la clase `group`. El tamaño y la proporción los pone
// quien lo usa en `className` (ej. "aspect-square w-full").
function Retrato({ src, nombre, acento, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3"
        style={{ backgroundColor: acento }}
      />
      <div className="relative h-full w-full overflow-hidden bg-brand-100 transition-transform duration-300 group-focus-within:-translate-x-1 group-focus-within:-translate-y-1 group-hover:-translate-x-1 group-hover:-translate-y-1">
        {src ? (
          <img
            src={src}
            alt={nombre}
            loading="lazy"
            className="h-full w-full object-cover object-[50%_20%]"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-4xl text-brand-400">
            {iniciales(nombre)}
          </span>
        )}
      </div>
    </div>
  )
}

// Cargo con un cuadrito del color de esa persona delante.
function Cargo({ rol, acento }) {
  return (
    <p className={`${CARGO_CLASS} flex items-center gap-2`}>
      <span aria-hidden="true" className="h-2 w-2 shrink-0" style={{ backgroundColor: acento }} />
      {rol}
    </p>
  )
}

function EnlaceSocial({ href, red, nombre }) {
  if (!href) return null
  const etiqueta = { linkedin: 'LinkedIn', github: 'GitHub', mail: 'Correo' }[red]
  const esCorreo = red === 'mail'
  return (
    <a
      href={href}
      {...(esCorreo ? {} : { target: '_blank', rel: 'noreferrer' })}
      aria-label={`${etiqueta} de ${nombre}`}
      title={esCorreo ? href.replace('mailto:', '') : undefined}
      className="flex h-9 w-9 items-center justify-center border border-brand-900/25 text-brand-900/70 transition-colors hover:border-brand-900 hover:bg-brand-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
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

function Enlaces({ miembro }) {
  return (
    <div className="flex flex-wrap gap-2">
      <EnlaceSocial href={miembro.email ? `mailto:${miembro.email}` : ''} red="mail" nombre={miembro.nombre} />
      <EnlaceSocial href={miembro.linkedin} red="linkedin" nombre={miembro.nombre} />
      <EnlaceSocial href={miembro.github} red="github" nombre={miembro.nombre} />
    </div>
  )
}

// Panel con la coordinación de un director (se abre desde su tarjeta).
function PanelCoordinacion({ director, onClose }) {
  const cerrarRef = useRef(null)
  useBloquearScroll()

  // Al abrir, el foco pasa al botón de cerrar (accesibilidad: un diálogo no
  // debe dejar el foco detrás de él).
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

  // "Dirección de Finanzas" -> "Coordinación de Finanzas"; si el cargo no
  // empieza así, "Equipo de <cargo>".
  const titulo = director.rol.startsWith('Dirección de')
    ? director.rol.replace('Dirección de', 'Coordinación de')
    : `Equipo de ${director.rol}`

  const solo = director.coordinadores.length === 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] flex cursor-pointer items-center justify-center bg-brand-900/60 p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.35, ease: EASE }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-coordinacion"
        className={`cursor-boundary flex max-h-[88vh] w-full flex-col overflow-hidden border-2 border-brand-900 bg-white ${
          solo ? 'max-w-2xl' : 'max-w-5xl'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b-2 border-brand-900 p-5 sm:p-6">
          <div>
            <p className={CARGO_CLASS}>Dirige {director.nombre}</p>
            <h3 id="titulo-coordinacion" className="mt-2 font-display text-2xl leading-tight text-brand-900">
              {titulo}
            </h3>
          </div>
          <button
            ref={cerrarRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-900 text-brand-900 transition-colors hover:bg-[#FFB401] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
          >
            ✕
          </button>
        </header>

        {/* El tamaño de la foto se adapta a la altura de la ventana (hasta 224
            px): en una pantalla baja se achica un poco en vez de obligar a
            hacer scroll para llegar a los enlaces. */}
        {/* Tarjetas compactas: foto cuadrada a un lado y nombre, cargo y
            redes al otro. Así los enlaces se ven sin tener que bajar (con la
            foto arriba y los enlaces hasta abajo, había que hacer scroll
            para llegar a ellos). */}
        <motion.ul
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="show"
          className={`grid gap-x-6 gap-y-7 overflow-y-auto overscroll-contain p-5 pb-7 sm:p-6 sm:pb-8 ${
            solo ? '' : 'sm:grid-cols-2'
          }`}
        >
          {director.coordinadores.map((c, i) => {
            const acento = ACENTOS[i % ACENTOS.length]
            return (
              <motion.li key={`${c.nombre}-${i}`} variants={fadeUp} className="group flex items-center gap-5">
                <Retrato
                  src={c.foto}
                  nombre={c.nombre}
                  acento={acento}
                  className={`mr-2 mb-2 aspect-square shrink-0 sm:mr-3 sm:mb-3 ${solo ? 'w-40 sm:w-[min(16rem,32vh)]' : 'w-32 sm:w-[min(14rem,26vh)]'}`}
                />
                <div className="flex min-w-0 flex-col gap-2">
                  <div>
                    <p className="font-display text-base leading-tight text-brand-900 sm:text-xl">{c.nombre}</p>
                    <div className="mt-1.5">
                      <Cargo rol={c.rol || 'Coordinación'} acento={acento} />
                    </div>
                  </div>
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="break-all text-sm text-brand-900/70 underline decoration-brand-300 underline-offset-4 transition-colors hover:text-brand-900 hover:decoration-brand-900"
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
            )
          })}
        </motion.ul>
      </motion.div>
    </motion.div>
  )
}

function BotonCoordinacion({ miembro, onAbrir }) {
  const total = miembro.coordinadores?.length ?? 0
  if (total === 0) return null
  // Solo los directores con coordinadores llevan este botón: abre el panel
  // con su coordinación.
  return (
    <button type="button" onClick={() => onAbrir(miembro)} className={botonPlanoClass}>
      <span>
        <span className="max-sm:hidden">Ver </span>
        <span className="sm:hidden">C</span>
        <span className="max-sm:hidden">c</span>oordinación · {total}
      </span>
      <span aria-hidden="true">→</span>
    </button>
  )
}

// Presidencia y vicepresidencia: tarjeta más grande, con la foto ancha
// (horizontal) y el nombre grande debajo. La foto es claramente mayor que la
// de las direcciones (cuadradas y más chicas), así la jerarquía se ve sin
// necesitar etiquetas.
function MiembroDestacado({ miembro, acento, onAbrir }) {
  return (
    <motion.article variants={fadeUp} className="group col-span-2 flex flex-col lg:col-span-3">
      <Retrato src={miembro.foto} nombre={miembro.nombre} acento={acento} className="mr-2 mb-2 aspect-[4/3] sm:mr-3 sm:mb-3" />
      <div className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Cargo rol={miembro.rol} acento={acento} />
          <h3 className="font-display text-2xl leading-[1.05] text-brand-900 sm:text-3xl">{miembro.nombre}</h3>
        </div>
        <Enlaces miembro={miembro} />
        <div>
          <BotonCoordinacion miembro={miembro} onAbrir={onAbrir} />
        </div>
      </div>
    </motion.article>
  )
}

function MiembroCard({ miembro, acento, onAbrir }) {
  return (
    <motion.article variants={fadeUp} className="group flex flex-col lg:col-span-2">
      <Retrato src={miembro.foto} nombre={miembro.nombre} acento={acento} className="mr-2 mb-2 aspect-square sm:mr-3 sm:mb-3" />
      <div className="flex flex-1 flex-col gap-3 pt-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-base leading-tight text-brand-900 sm:text-lg">{miembro.nombre}</h3>
          <Cargo rol={miembro.rol} acento={acento} />
        </div>
        {/* Enlaces y botón pegados al fondo: quedan alineados entre tarjetas
            de la misma fila aunque el nombre ocupe más o menos líneas. */}
        <div className="mt-auto flex flex-col items-start gap-3 pt-1">
          <Enlaces miembro={miembro} />
          <BotonCoordinacion miembro={miembro} onAbrir={onAbrir} />
        </div>
      </div>
    </motion.article>
  )
}

// Asesores: horizontales y más compactos. Guían al club pero no son parte de
// la jerarquía estudiantil.
function AsesorCard({ miembro, acento }) {
  return (
    <motion.article variants={fadeUp} className="group flex items-center gap-6">
      <Retrato
        src={miembro.foto}
        nombre={miembro.nombre}
        acento={acento}
        className="mr-2 mb-2 aspect-square w-32 shrink-0 sm:mr-3 sm:mb-3 sm:w-40"
      />
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Cargo rol={miembro.rol} acento={acento} />
          <h3 className="font-display text-xl leading-tight text-brand-900 sm:text-2xl">{miembro.nombre}</h3>
        </div>
        <Enlaces miembro={miembro} />
      </div>
    </motion.article>
  )
}

export default function Equipo() {
  const { data: miembros } = useApiData(api.getEquipo, MIEMBROS_RESPALDO)
  const [directorAbierto, setDirectorAbierto] = useState(null)
  const cerrarPanel = useCallback(() => setDirectorAbierto(null), [])

  // Los asesores (esAsesor: true) van aparte, con su propio encabezado al
  // final: guían al club pero no son parte de la jerarquía estudiantil
  // (presidencia, direcciones, coordinaciones), así que mezclarlos en la
  // misma cuadrícula mandaría el mensaje equivocado sobre dónde "quedan" en
  // el organigrama.
  const directores = miembros.filter((m) => !m.esAsesor)
  const asesores = miembros.filter((m) => m.esAsesor)

  return (
    <section id="equipo" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <SectionHeader
        titulo="Conoce al Equipo"
        descripcion="Las personas que organizan entrenamientos, concursos y todo lo demás en Axioma."
      />

      {/* Cuadrícula de 6 columnas en escritorio: los dos primeros ocupan 3
          cada uno (los destacados) y los demás 2 (tres por fila). */}
      <motion.div
        className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-6 lg:gap-x-8"
        variants={staggerContainer(0.08)}
        {...revealProps}
        // La cuadrícula es muy alta (sobre todo en celular): con el umbral
        // normal (25% visible) nunca alcanzaba a "aparecer" hasta hacer más
        // scroll y la sección se veía en blanco.
        viewport={{ once: true, amount: 0.03 }}
      >
        {directores.map((miembro, indice) =>
          indice < 2 ? (
            <MiembroDestacado
              key={miembro.id}
              miembro={miembro}
              acento={ACENTOS[indice % ACENTOS.length]}
              onAbrir={setDirectorAbierto}
            />
          ) : (
            <MiembroCard
              key={miembro.id}
              miembro={miembro}
              acento={ACENTOS[indice % ACENTOS.length]}
              onAbrir={setDirectorAbierto}
            />
          ),
        )}
      </motion.div>

      {asesores.length > 0 && (
        <motion.div
          variants={staggerContainer(0.08)}
          {...revealProps}
          viewport={{ once: true, amount: 0.1 }}
          className="mt-20"
        >
          <div className="mb-8 flex items-center gap-4">
            <p className={`${CARGO_CLASS} shrink-0`}>Asesores</p>
            <span aria-hidden="true" className="h-px flex-1 bg-brand-900/25" />
          </div>
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-8">
            {asesores.map((miembro, indice) => (
              <AsesorCard key={miembro.id} miembro={miembro} acento={ACENTOS[indice % ACENTOS.length]} />
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
