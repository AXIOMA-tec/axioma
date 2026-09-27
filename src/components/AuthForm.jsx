import { useState } from 'react'
import { apiFetch } from '../lib/api'
import GoogleButton from './GoogleButton'

const AXIOMA_GRADIENT = 'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)'

// Formulario de inicio de sesión / registro. Se usa en dos lugares: dentro
// del modal de un problema (justo antes de comentar) y en la página
// /cuenta a la que lleva el Navbar. Solo habla con la API; quien lo usa
// decide qué hacer con la sesión en onAuthSuccess (normalmente login() de
// useAuth).
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

  const inputClass =
    'rounded-lg border border-brand-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#E57505] focus:ring-2 focus:ring-[#E57505]/30'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-brand-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-brand-700">
        {modo === 'login' ? `Inicia sesión ${motivo}.` : `Crea una cuenta ${motivo}.`}
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

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
          style={{ backgroundImage: AXIOMA_GRADIENT }}
        >
          {enviando ? 'Un momento...' : modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}
        </button>
        <button
          type="button"
          onClick={() => setModo(modo === 'login' ? 'signup' : 'login')}
          className="text-sm text-brand-600 underline hover:text-[#E57505]"
        >
          {modo === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}
        </button>
      </div>

      {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <>
          <div className="flex items-center gap-3 text-xs text-brand-400" aria-hidden="true">
            <span className="h-px flex-1 bg-brand-200" />o<span className="h-px flex-1 bg-brand-200" />
          </div>
          <GoogleButton onCredential={handleGoogle} modo={modo} />
        </>
      )}
    </form>
  )
}
