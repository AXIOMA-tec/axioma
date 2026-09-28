import Lenis from 'lenis'

// Instancia única de Lenis (smooth scroll) para toda la app: es un
// one-pager, así que basta con un solo scroller para el ciclo de vida
// completo de la SPA (autoRaf se encarga del loop de animación).
let lenisInstance = null

function getLenis() {
  if (typeof window === 'undefined') return null

  if (!lenisInstance) {
    lenisInstance = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    })
  }

  return lenisInstance
}

// Hook de acceso: cualquier componente puede llamar
// useLenis()?.scrollTo(target, { offset }) para un scroll suave.
export function useLenis() {
  return getLenis()
}
