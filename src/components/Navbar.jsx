import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useActiveSection } from '../hooks/useActiveSection'
import { useNavbarTone } from '../hooks/useNavbarTone'

// Links que hacen scroll a una sección del one-pager ("/").
// Si agregan una sección nueva al one-pager, agréguenla aquí también.
const SCROLL_LINKS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'quienes-somos', label: 'Quiénes Somos' },
  { id: 'equipo', label: 'Equipo' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'galeria', label: 'Galería' },
]

// Link de navegación real de React Router (página independiente).
const ROUTE_LINK = { path: '/problemas', label: 'Problemas' }

const CONTACTO_LINK = { id: 'contacto', label: 'Contacto' }

const SECTION_IDS = [...SCROLL_LINKS.map((link) => link.id), CONTACTO_LINK.id]

// El color de todo el Navbar sale del tono de la sección que tiene detrás
// (ver useNavbarTone): los links heredan ese color con currentColor, así
// que hover/active/focus funcionan igual en blanco que en negro.
const TONE_CLASS = {
  light: 'text-white',
  dark: 'text-black',
}

const FOCUS_RING = 'rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current'

const desktopLinkClass = (isActive) =>
  `relative text-sm font-medium transition-opacity ${FOCUS_RING} ${
    isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100 focus-visible:opacity-100'
  }`

const mobileLinkClass = (isActive) =>
  `block px-3 py-2 text-sm font-medium transition-colors hover:bg-current/10 ${FOCUS_RING} ${
    isActive ? 'bg-current/10' : ''
  }`

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const seccionVisible = useActiveSection(SECTION_IDS)
  // Las secciones solo existen en la portada ("/"). En otra ruta (ej.
  // /problemas) ninguna sección está activa; lo que se marca es la página.
  const enPortada = location.pathname === '/'
  const activeId = enPortada ? seccionVisible : null
  const enProblemas = location.pathname === ROUTE_LINK.path
  const barRef = useRef(null)
  const tone = useNavbarTone(barRef)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Si ya estamos en "/", hace scroll directo. Si estamos en otra ruta
  // (ej. /problemas), navega a "/" y le pasa el id por state para que
  // HomePage haga el scroll una vez montada.
  const goToSection = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
    setIsOpen(false)
  }

  const handleScrollClick = (event, id) => {
    event.preventDefault()
    goToSection(id)
  }
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur transition-[padding,color,background-color,box-shadow] duration-300 ${TONE_CLASS[tone]} ${
        isScrolled ? 'py-0' : 'py-1.5'
      } ${
        // Sobre secciones claras, al hacer scroll, la barra se rellena: así el
        // texto de la página que pasa por debajo no se mezcla con los links.
        // Sobre secciones oscuras (Hero, Contacto) se queda transparente.
        tone === 'dark' && isScrolled ? 'bg-white/85 shadow-[0_1px_0_0_rgba(15,23,42,0.08)]' : ''
      }`}
    >
      <nav ref={barRef} className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
       <a
          href="#inicio"
          onClick={(event) => handleScrollClick(event, 'inicio')}
          className={`flex items-center ${FOCUS_RING}`}
        >
          <img
            src="/AXIOMA LOGOS (3).png"
            alt="Axioma"
            className="h-12 w-auto"
          />
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {SCROLL_LINKS.map((link) => (
            <li key={link.id} className="relative">
              <a
                href={`#${link.id}`}
                onClick={(event) => handleScrollClick(event, link.id)}
                className={desktopLinkClass(activeId === link.id)}
              >
                {link.label}
                {activeId === link.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-current"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            </li>
          ))}
          <li>
            <Link
              to={ROUTE_LINK.path}
              onClick={() => setIsOpen(false)}
              aria-current={enProblemas ? 'page' : undefined}
              className={desktopLinkClass(enProblemas)}
            >
              {ROUTE_LINK.label}
              {enProblemas && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-current"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </li>
          <li className="relative">
            <a
              href={`#${CONTACTO_LINK.id}`}
              onClick={(event) => handleScrollClick(event, CONTACTO_LINK.id)}
              className={desktopLinkClass(activeId === CONTACTO_LINK.id)}
            >
              {CONTACTO_LINK.label}
              {activeId === CONTACTO_LINK.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-current"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`inline-flex items-center justify-center p-2 md:hidden ${FOCUS_RING}`}
          aria-label="Abrir menú de navegación"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Menú</span>
          <div className="flex h-5 w-6 flex-col justify-between">
            <span className="h-0.5 w-full bg-current" />
            <span className="h-0.5 w-full bg-current" />
            <span className="h-0.5 w-full bg-current" />
          </div>
        </button>
      </nav>

      {/* El menú mobile vive dentro del <header>, así que el backdrop-blur
          del header ya desenfoca lo que queda detrás de él también. No se
          repite aquí: un backdrop-filter anidado solo vería el header, no
          la página. */}
      {isOpen && (
        <ul className="flex flex-col gap-1 px-4 pb-4 md:hidden">
          {SCROLL_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(event) => handleScrollClick(event, link.id)}
                aria-current={activeId === link.id ? 'true' : undefined}
                className={mobileLinkClass(activeId === link.id)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to={ROUTE_LINK.path}
              onClick={() => setIsOpen(false)}
              aria-current={enProblemas ? 'page' : undefined}
              className={mobileLinkClass(enProblemas)}
            >
              {ROUTE_LINK.label}
            </Link>
          </li>
          <li>
            <a
              href={`#${CONTACTO_LINK.id}`}
              onClick={(event) => handleScrollClick(event, CONTACTO_LINK.id)}
              aria-current={activeId === CONTACTO_LINK.id ? 'true' : undefined}
              className={mobileLinkClass(activeId === CONTACTO_LINK.id)}
            >
              {CONTACTO_LINK.label}
            </a>
          </li>
        </ul>
      )}
    </header>
  )
}
