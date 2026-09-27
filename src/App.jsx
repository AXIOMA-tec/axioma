import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CustomCursor from './components/CustomCursor'

// Problemas trae KaTeX (pesado): se descarga solo cuando alguien entra a
// /problemas, así la portada abre más rápido.
const ProblemasPage = lazy(() => import('./pages/ProblemasPage'))

// Este archivo solo define las rutas (+ chrome global como el cursor).
// No agreguen contenido de página aquí: el one-pager vive en
// /src/pages/HomePage.jsx y cada página independiente vive en su
// propio archivo dentro de /src/pages.
function App() {
  return (
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
