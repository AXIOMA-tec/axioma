import { useEffect } from 'react'

// Bloquea el scroll de la página mientras hay un panel o visor abierto
// (Problemas, visor de la Galería). Sin esto, la página de atrás sigue
// desplazándose y se ven dos barras de scroll a la vez.
//
// Al quitar la barra de la página, el contenido se ensancharía y "saltaría";
// por eso se compensa con un padding del mismo ancho que la barra.
export function useBloquearScroll() {
  useEffect(() => {
    const { body, documentElement } = document
    const anterior = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    const anchoBarra = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (anchoBarra > 0) body.style.paddingRight = `${anchoBarra}px`

    return () => {
      body.style.overflow = anterior.overflow
      body.style.paddingRight = anterior.paddingRight
    }
  }, [])
}
