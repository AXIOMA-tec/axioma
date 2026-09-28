// GET /api/galeria — lista de fotos de la sección Galería. Público.
//
// POST/PATCH/DELETE — subir, editar (incluye reordenar) y borrar una foto.
// Solo para administradores. El panel /admin/galeria del sitio hace esto
// desde el navegador: sube el archivo a Cloudinary y manda aquí la URL que
// resulta, junto con la proporción calculada del lado del navegador.

import { Router } from 'express'
import Foto from '../models/Foto.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

const CAMPOS_EDITABLES = ['src', 'alt', 'ratio', 'orden']

function limpiarBody(body) {
  const limpio = {}
  for (const campo of CAMPOS_EDITABLES) {
    if (body[campo] !== undefined) limpio[campo] = body[campo]
  }
  return limpio
}

router.get('/', async (req, res) => {
  const fotos = await Foto.find().sort({ orden: 1, id: 1 })
  res.json(fotos)
})

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const datos = limpiarBody(req.body)
  if (!datos.src || !datos.alt || !datos.ratio) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: foto, descripción y proporción.' })
  }

  const ultima = await Foto.findOne().sort('-id')
  const siguienteId = (ultima?.id ?? 0) + 1
  const foto = await Foto.create({
    ...datos,
    id: siguienteId,
    // Nueva al final por default, para que aparezca después de las que
    // ya había (ver "orden" en el GET de arriba).
    orden: datos.orden ?? siguienteId,
  })
  res.status(201).json(foto)
})

router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  const foto = await Foto.findByIdAndUpdate(req.params.id, limpiarBody(req.body), {
    new: true,
    runValidators: true,
  })
  if (!foto) return res.status(404).json({ error: 'No se encontró esa foto.' })
  res.json(foto)
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const foto = await Foto.findByIdAndDelete(req.params.id)
  if (!foto) return res.status(404).json({ error: 'No se encontró esa foto.' })
  res.status(204).end()
})

export default router
