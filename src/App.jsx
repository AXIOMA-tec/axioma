import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProblemasPage from './pages/ProblemasPage'
import CuentaPage from './pages/CuentaPage'
import PerfilPage from './pages/PerfilPage'
import CustomCursor from './components/CustomCursor'
import AuthProvider from './components/AuthProvider'

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
          <Route path="/problemas" element={<ProblemasPage />} />
          <Route path="/cuenta" element={<CuentaPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
