// GET /api/equipo — lista del equipo (lo que Equipo.jsx leía del arreglo
// MIEMBROS hardcodeado). Público, igual que /api/problems: para
// agregar/editar un integrante no hay endpoint de escritura por API —
// se hace directo en MongoDB Atlas o volviendo a correr `npm run seed`
// después de editar la lista en seed.js (ver ese archivo).

import { Router } from 'express'
import Miembro from '../models/Miembro.js'

const router = Router()

router.get('/', async (req, res) => {
  const miembros = await Miembro.find().sort({ orden: 1, id: 1 })
  res.json(miembros)
})

export default router
