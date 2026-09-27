import { useState } from 'react'
import { apiFetch } from '../lib/api'
import GoogleButton from './GoogleButton'

// Formulario de inicio de sesión / registro. Se usa en dos lugares: dentro
// del modal de un problema (justo antes de comentar) y en la página
// /cuenta a la que lleva el Navbar. Solo habla con la API; quien lo usa
// decide qué hacer con la sesión en onAuthSuccess (normalmente login() de
// useAuth).
//
// Estilo: plano y sin color de fondo (blanco/negro, sin esquinas
// redondeadas ni sombras) — el mismo lenguaje que ya usan los demás
// botones del sitio (Hero, Contacto, Problemas), para que este formulario
// no se vea como un componente aparte.
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950'

const inputClass =
  'w-full border border-neutral-950 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:outline-2 focus:outline-neutral-950'

const primaryButtonClass = `border border-neutral-950 bg-[#FFB401] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-950 transition-colors hover:bg-white disabled:opacity-50 ${focusRing}`

export default function AuthForm({ onAuthSuccess, motivo = 'para comentar' }) {
  const [modo, setModo] = useState('login') // 'login' | 'signup'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const path = modo === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const body =
        modo === 'login' ? { email, password } : { username, email, password }
      const data = await apiFetch(path, { method: 'POST', body })
      onAuthSuccess(data) // { token, user } — el componente padre lo guarda
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  // Con Google no hay diferencia entre "registrarse" e "iniciar sesión": el
  // backend crea la cuenta si no existe (ver POST /api/auth/google).
  const handleGoogle = async (credential) => {
    setError(null)
    setEnviando(true)
    try {
      const data = await apiFetch('/api/auth/google', { method: 'POST', body: { credential } })
      onAuthSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-neutral-950 bg-white p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
        {modo === 'login' ? `Inicia sesión ${motivo}` : `Crea una cuenta ${motivo}`}
      </p>

      {modo === 'signup' && (
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          minLength={3}
          maxLength={30}
          pattern="[A-Za-z0-9_.]+"
          title='3-30 caracteres: letras, números, "_" o "."'
          className={inputClass}
        />
      )}
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        className={inputClass}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
        className={inputClass}
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <button type="submit" disabled={enviando} className={primaryButtonClass}>
          {enviando ? 'Un momento…' : modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}
        </button>
        <button
          type="button"
          onClick={() => setModo(modo === 'login' ? 'signup' : 'login')}
          className={`text-sm text-neutral-600 underline underline-offset-4 hover:text-neutral-950 ${focusRing}`}
        >
          {modo === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}
        </button>
      </div>

      {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <>
          <div className="flex items-center gap-3 text-xs text-neutral-400" aria-hidden="true">
            <span className="h-px flex-1 bg-neutral-300" />o<span className="h-px flex-1 bg-neutral-300" />
          </div>
          <GoogleButton onCredential={handleGoogle} modo={modo} />
        </>
      )}
    </form>
  )
}
