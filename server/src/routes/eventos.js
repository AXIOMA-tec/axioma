// GET /api/eventos — lista de eventos. Público, mismo patrón que
// /api/equipo y /api/problems.
//
// POST/PATCH/DELETE — crear, editar y borrar un evento. Solo para
// administradores (ver server/src/middleware/auth.js). Antes esto solo se
// hacía editando server/src/data/equipoEventos.js y corriendo
// `npm run seed:equipo`; ahora el panel /admin/eventos del sitio hace lo
// mismo desde el navegador, sin tocar código.

import { Router } from 'express'
import Evento from '../models/Evento.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// Campos que un admin puede mandar desde el formulario. Whitelist a
// propósito: así nadie puede colar `id` o `_id` en el body y pisar otro
// documento.
const CAMPOS_EDITABLES = ['tipo', 'titulo', 'fecha', 'lugar', 'alt', 'src', 'link', 'orden']

function limpiarBody(body) {
  const limpio = {}
  for (const campo of CAMPOS_EDITABLES) {
    if (body[campo] !== undefined) limpio[campo] = body[campo]
  }
  return limpio
}

router.get('/', async (req, res) => {
  const eventos = await Evento.find().sort({ orden: 1, id: 1 })
  res.json(eventos)
})

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const datos = limpiarBody(req.body)
  if (!datos.titulo || !datos.fecha || !datos.tipo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: título, fecha y tipo.' })
  }

  // El `id` numérico es solo para que el orden por defecto (ver GET) sea
  // estable; nadie lo captura a mano. Un evento nuevo se lleva el
  // siguiente número disponible, y por default también ese mismo número
  // como `orden` (mismo patrón que Foto.js en galeria.js): así nace al
  // final de la fila y el botón subir/bajar del panel puede moverlo, en vez
  // de quedar empatado en 0 con todos los eventos viejos.
  const ultimo = await Evento.findOne().sort('-id')
  const siguienteId = (ultimo?.id ?? 0) + 1
  const evento = await Evento.create({ ...datos, id: siguienteId, orden: datos.orden ?? siguienteId })
  res.status(201).json(evento)
})

router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  const evento = await Evento.findByIdAndUpdate(req.params.id, limpiarBody(req.body), {
    new: true,
    runValidators: true,
  })
  if (!evento) return res.status(404).json({ error: 'No se encontró ese evento.' })
  res.json(evento)
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const evento = await Evento.findByIdAndDelete(req.params.id)
  if (!evento) return res.status(404).json({ error: 'No se encontró ese evento.' })
  res.status(204).end()
})

export default router
