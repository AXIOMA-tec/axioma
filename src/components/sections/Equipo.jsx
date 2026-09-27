import { motion } from 'framer-motion'
import { EASE, fadeUp, revealProps, staggerContainer } from '../motion/variants'
import { useApiData } from '../../hooks/useApiData'
import { api } from '../../lib/api'

// Sección Equipo (id="equipo")
// Los datos vienen de la API (server/ + MongoDB) para poder actualizarlos
// sin tocar código — ver README para cómo agregar/editar miembros.
// MIEMBROS_RESPALDO se usa solo si la API no responde (backend dormido,
// sin conexión, etc.), para que la sección nunca se vea vacía.

const MIEMBROS_RESPALDO = [
  {
    id: 1,
    nombre: 'Hugo André Meza Fierros',
    rol: 'Presidente',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 2,
    nombre: 'Lucero Díaz Ortega',
    rol: 'Vicepresidente',
    foto: null,
    linkedin: 'https://www.linkedin.com/in/lucero-d%C3%ADaz-ortega-98979b354/',
    github: 'https://github.com/Luzdks',
  },
  {
    id: 3,
    nombre: 'Nombre Apellido',
    rol: 'Coordinación de Problemas',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 4,
    nombre: 'Nombre Apellido',
    rol: 'Coordinación de Eventos',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 5,
    nombre: 'Nombre Apellido',
    rol: 'Difusión',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
  {
    id: 6,
    nombre: 'Nombre Apellido',
    rol: 'Tesorería',
    foto: null,
    linkedin: 'https://linkedin.com/in/placeholder',
    github: 'https://github.com/placeholder',
  },
]

// Diseño: tarjetas suaves y rectas (mismo lenguaje que Quiénes Somos y
// Eventos), todas del mismo tamaño y alineadas. La última fila siempre queda
// centrada, sin importar cuántos miembros devuelva la API.

const iniciales = (nombre) =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join('')
    .toUpperCase()

const ICONOS = {
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
  const etiqueta = red === 'linkedin' ? 'LinkedIn' : 'GitHub'
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${etiqueta} de ${nombre}`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-900/70 transition-colors hover:border-brand-900 hover:bg-brand-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
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

function MemberCard({ miembro }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group flex w-full flex-col items-center gap-4 rounded-2xl border border-brand-200 bg-white p-7 text-center shadow-md transition-shadow duration-300 hover:shadow-xl sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
    >
      {/* Marco tipo "doble aro" alrededor de la foto. */}
      <div className="rounded-full border border-brand-200 p-1.5 transition-colors duration-300 group-hover:border-brand-900">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-display text-3xl text-brand-400">
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
        <h3 className="text-lg font-semibold text-brand-900">{miembro.nombre}</h3>
        <p className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-900/70">
          {miembro.rol}
        </p>
      </div>

      <div className="mt-1 flex gap-2">
        <EnlaceSocial href={miembro.linkedin} red="linkedin" nombre={miembro.nombre} />
        <EnlaceSocial href={miembro.github} red="github" nombre={miembro.nombre} />
      </div>
    </motion.div>
  )
}

export default function Equipo() {
  const { data: miembros } = useApiData(api.getEquipo, MIEMBROS_RESPALDO)

  return (
    <section
      id="equipo"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6"
    >
      <motion.h2
        variants={fadeUp}
        {...revealProps}
        className="font-display mb-4 text-center text-3xl text-brand-900 sm:text-4xl"
      >
        Conoce al Equipo
      </motion.h2>
      <motion.p
        variants={fadeUp}
        {...revealProps}
        className="mx-auto mb-12 max-w-xl text-center text-brand-900/70"
      >
        Las personas que organizan entrenamientos, concursos y todo lo demás en Axioma.
      </motion.p>

      <motion.div
        className="flex flex-wrap justify-center gap-6"
        variants={staggerContainer(0.08)}
        {...revealProps}
      >
        {miembros.map((miembro) => (
          <MemberCard key={miembro.id} miembro={miembro} />
        ))}
      </motion.div>
    </section>
  )
}
