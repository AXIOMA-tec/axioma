import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, [role="button"], .cursor-pointer'
// El fondo oscuro de un modal se marca `.cursor-pointer` porque cierra al
// dar clic — pero ese fondo envuelve todo el contenido de adentro (texto,
// fotos, botones normales) que NO debería heredar el efecto solo por estar
// dentro. `.cursor-boundary` marca dónde termina "el fondo clicable" y
// empieza "contenido normal": los mismos elementos que ya hacen
// `stopPropagation()` en el clic llevan esta clase, así el cursor se detiene
// ahí en vez de seguir subiendo hasta encontrar el `.cursor-pointer` del
// fondo.
const BOUNDARY_SELECTOR = '.cursor-boundary'

// Cursor personalizado (punto + anillo con retraso) que crece sobre
// elementos interactivos. Es blanco con mix-blend-mode: difference, así
// el navegador lo invierte solo: se ve oscuro sobre fondos claros y claro
// sobre fondos oscuros (Hero, Contacto), sin depender de cada sección. Solo se activa en dispositivos con mouse
// (pointer: fine); en touch no se monta nada.
//
// Como el cursor nativo del navegador está apagado (`cursor: none` en
// index.css, para que solo se vea este), cualquier elemento clicable que no
// sea a/button/input/[role=button] se queda sin NINGÚN indicio visual de
// que se puede dar clic — por eso también reacciona a `.cursor-pointer`
// (ver BOUNDARY_SELECTOR arriba para el caso de fondos de modal).
export default function CustomCursor() {
  // Se calcula una sola vez, al montar, en vez de con setState dentro de un
  // useEffect -- así el valor ya es correcto desde el primer render, sin
  // necesitar un efecto solo para guardarlo.
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { stiffness: 300, damping: 30 })
  const ringY = useSpring(dotY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    if (!enabled) return

    const handleMove = (event) => {
      dotX.set(event.clientX)
      dotY.set(event.clientY)
      setIsVisible(true)
    }
    const handleOver = (event) => {
      // Sube por los ancestros hasta encontrar, lo que llegue primero: algo
      // interactivo (sí muestra el efecto) o un límite de "contenido normal"
      // (no lo muestra, aunque más arriba haya un fondo clicable).
      const encontrado = event.target.closest(`${INTERACTIVE_SELECTOR}, ${BOUNDARY_SELECTOR}`)
      setIsHovering(Boolean(encontrado) && encontrado.matches(INTERACTIVE_SELECTOR))
    }
    const handleLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleOver)
    document.documentElement.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
    }
  }, [dotX, dotY, enabled])

  if (!enabled) return null

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[100] mix-blend-difference ${isVisible ? '' : 'opacity-0'}`}
    >
      <motion.div
        className="absolute rounded-full bg-white"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: isHovering ? 6 : 6, height: isHovering ? 6 : 6 }}
      />
      <motion.div
        className="absolute rounded-full border border-white"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: isHovering ? 52 : 32, height: isHovering ? 52 : 32, opacity: isHovering ? 0.9 : 0.6 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  )
}
