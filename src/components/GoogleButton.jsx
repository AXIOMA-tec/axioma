import { useEffect, useRef, useState } from 'react'

// Client ID público de la app en Google Cloud (no es secreto: Google lo
// muestra en el navegador de todos modos). Si no está en .env, el botón
// simplemente no aparece y el resto del formulario sigue funcionando.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// El script de Google Identity Services se carga una sola vez para toda la
// página, aunque haya varios botones (ej. modal + /cuenta).
let scriptPromise
function cargarGoogle() {
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.onload = () => resolve(window.google)
      script.onerror = () => {
        scriptPromise = null // permite reintentar en el próximo montaje
        reject(new Error('No se pudo cargar Google.'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

// Botón oficial "Continuar con Google". Google dibuja el botón y maneja el
// popup; al terminar nos entrega un `credential` (ID token firmado por
// Google) que pasamos tal cual a onCredential -> el backend lo verifica en
// POST /api/auth/google. Nunca confiamos en ese token del lado del navegador.
export default function GoogleButton({ onCredential, modo = 'login' }) {
  const contenedorRef = useRef(null)
  const callbackRef = useRef(onCredential)
  const [falloCarga, setFalloCarga] = useState(false)

  // Guardamos siempre la versión más reciente del callback sin tener que
  // volver a dibujar el botón de Google cada vez que cambia.
  useEffect(() => {
    callbackRef.current = onCredential
  })

  useEffect(() => {
    if (!CLIENT_ID) return
    let activo = true
    cargarGoogle()
      .then((google) => {
        const el = contenedorRef.current
        if (!activo || !el) return
        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (respuesta) => callbackRef.current(respuesta.credential),
        })
        el.replaceChildren()
        google.accounts.id.renderButton(el, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: modo === 'signup' ? 'signup_with' : 'continue_with',
          locale: 'es',
          width: Math.min(400, Math.max(200, el.offsetWidth)),
        })
      })
      .catch(() => {
        if (activo) setFalloCarga(true)
      })
    return () => {
      activo = false
    }
  }, [modo])

  if (!CLIENT_ID) return null
  if (falloCarga) {
    return <p className="text-center text-xs text-brand-500">No se pudo cargar el botón de Google.</p>
  }
  return <div ref={contenedorRef} className="flex min-h-10 w-full justify-center" />
}
