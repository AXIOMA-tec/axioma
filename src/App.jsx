import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CuentaPage from './pages/CuentaPage'
import PerfilPage from './pages/PerfilPage'
import AdminPage from './pages/AdminPage'
import AdminEventosPage from './pages/AdminEventosPage'
import AdminGaleriaPage from './pages/AdminGaleriaPage'
import AdminRecursosPage from './pages/AdminRecursosPage'
import CustomCursor from './components/CustomCursor'
import AuthProvider from './components/AuthProvider'

// Problemas trae KaTeX (pesado): se descarga solo cuando alguien entra a
// /problemas, así la portada abre más rápido.
const ProblemasPage = lazy(() => import('./pages/ProblemasPage'))
const RecursosPage = lazy(() => import('./pages/RecursosPage'))

// Este archivo solo define las rutas (+ chrome global como el cursor).
// No agreguen contenido de página aquí: el one-pager vive en
// /src/pages/HomePage.jsx y cada página independiente vive en su
// propio archivo dentro de /src/pages.
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/problemas"
            element={
              <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <ProblemasPage />
              </Suspense>
            }
          />
          <Route
            path="/recursos"
            element={
              <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <RecursosPage />
              </Suspense>
            }
          />
          <Route path="/cuenta" element={<CuentaPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/eventos" element={<AdminEventosPage />} />
          <Route path="/admin/galeria" element={<AdminGaleriaPage />} />
          <Route path="/admin/recursos" element={<AdminRecursosPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
