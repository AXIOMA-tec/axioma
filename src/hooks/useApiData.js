import { useEffect, useState } from 'react'

// Pide datos a la API y, si falla (backend dormido, sin internet, etc.),
// se queda con `fallback` en vez de romper la sección — así la página
// nunca se ve vacía o rota aunque el backend no esté disponible.
export function useApiData(fetcher, fallback) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    fetcher()
      .then((result) => {
        if (active && Array.isArray(result) && result.length > 0) {
          setData(result)
        }
      })
      .catch((error) => {
        console.warn('useApiData: usando datos de respaldo —', error.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading }
}
