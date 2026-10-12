// GET /api/recursos — lista de documentos descargables (PDFs de exámenes,
// material de asesores, etc.). Público.
//
// POST/PATCH/DELETE — subir, editar y borrar uno. Solo para administradores
// (incluye a los asesores, a quienes se les da isAdmin manualmente — ver
// server/src/models/User.js). El panel /admin/recursos del sitio hace esto
// desde el navegador: sube el archivo a Cloudinary y manda aquí la URL que
// resulta. Mismo patrón que galeria.js.

import { Router } from 'express'
import Recurso from '../models/Recurso.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

const CAMPOS_EDITABLES = ['titulo', 'descripcion', 'archivo', 'orden']

function limpiarBody(body) {
  const limpio = {}
  for (const campo of CAMPOS_EDITABLES) {
    if (body[campo] !== undefined) limpio[campo] = body[campo]
  }
  return limpio
}

router.get('/', async (req, res) => {
  const recursos = await Recurso.find().sort({ orden: 1, id: 1 })
  res.json(recursos)
})

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const datos = limpiarBody(req.body)
  if (!datos.titulo || !datos.archivo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: título y archivo.' })
  }

  const ultimo = await Recurso.findOne().sort('-id')
  const siguienteId = (ultimo?.id ?? 0) + 1
  const recurso = await Recurso.create({
    ...datos,
    id: siguienteId,
    orden: datos.orden ?? siguienteId,
  })
  res.status(201).json(recurso)
})

router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  const recurso = await Recurso.findByIdAndUpdate(req.params.id, limpiarBody(req.body), {
    new: true,
    runValidators: true,
  })
  if (!recurso) return res.status(404).json({ error: 'No se encontró ese recurso.' })
  res.json(recurso)
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const recurso = await Recurso.findByIdAndDelete(req.params.id)
  if (!recurso) return res.status(404).json({ error: 'No se encontró ese recurso.' })
  res.status(204).end()
})

export default router
