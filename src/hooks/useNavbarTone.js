import { useEffect, useState } from 'react'

// Atributo con el que una sección le indica al Navbar qué tono usar
// cuando queda detrás de él. Ej: <section data-navbar-tone="light">
// en una sección de fondo oscuro -> texto del Navbar en blanco.
// Las secciones sin el atributo usan el tono por defecto.
export const NAVBAR_TONE_ATTR = 'data-navbar-tone'

// Devuelve el tono ('light' | 'dark') de la sección que está detrás del
// Navbar. En lugar de escuchar el scroll, un IntersectionObserver vigila
// una franja de 1px a la altura del centro de la barra: la sección que
// cruza esa franja es la que realmente está detrás, sin importar su
// altura ni el tamaño del viewport. Solo se recalcula la franja cuando
// cambia el tamaño de la ventana o de la barra.
export function useNavbarTone(barRef, defaultTone = 'dark') {
  const [tone, setTone] = useState(defaultTone)

  useEffect(() => {
    const bar = barRef.current
    const targets = [...document.querySelectorAll(`[${NAVBAR_TONE_ATTR}]`)]
    if (!bar || targets.length === 0) return

    const intersecting = new Set()
    let observer

    const observe = () => {
      observer?.disconnect()
      intersecting.clear()

      const { top, height } = bar.getBoundingClientRect()
      const line = Math.round(top + height / 2)
      const viewportHeight = document.documentElement.clientHeight

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) intersecting.add(entry.target)
            else intersecting.delete(entry.target)
          })
          // Si hay secciones anidadas, gana la más interna (la última en
          // orden de documento).
          const current = targets.findLast((target) => intersecting.has(target))
          setTone(current?.getAttribute(NAVBAR_TONE_ATTR) ?? defaultTone)
        },
        { rootMargin: `-${line}px 0px -${viewportHeight - line - 1}px 0px` },
      )
      targets.forEach((target) => observer.observe(target))
    }

    observe()
    const resizeObserver = new ResizeObserver(observe)
    resizeObserver.observe(bar)
    window.addEventListener('resize', observe)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('resize', observe)
    }
  }, [barRef, defaultTone])

  return tone
}
