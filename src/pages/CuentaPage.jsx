import { Navigate, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../lib/auth'

const AXIOMA_GRADIENT = 'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)'

// Página /cuenta: a donde lleva "Iniciar sesión" en el Navbar. Reutiliza el
// mismo AuthForm que aparece dentro del modal de Problemas. Si ya hay
// sesión, no tiene caso mostrar el formulario: manda directo a /perfil.
function CuentaPage() {
  const { auth, login } = useAuth()
  const navigate = useNavigate()

  if (auth) return <Navigate to="/perfil" replace />

  const handleAuthSuccess = (data) => {
    login(data)
    navigate('/perfil', { replace: true })
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-sm">
          <div className="mb-4 h-1.5 w-full rounded-full" style={{ backgroundImage: AXIOMA_GRADIENT }} />
          <h1 className="mb-4 text-2xl text-brand-900">Tu cuenta</h1>
          <AuthForm onAuthSuccess={handleAuthSuccess} motivo="en Axioma" />
        </div>
      </main>
    </>
  )
}

export default CuentaPage
