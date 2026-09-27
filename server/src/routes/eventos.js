// GET /api/eventos — lista de eventos (lo que Eventos.jsx leía del
// arreglo EVENTOS hardcodeado). Público, mismo patrón que /api/equipo
// y /api/problems: sin endpoint de escritura por API, se edita en
// MongoDB Atlas o en seed.js + `npm run seed`.

import { Router } from 'express'
import Evento from '../models/Evento.js'

const router = Router()

router.get('/', async (req, res) => {
  const eventos = await Evento.find().sort({ orden: 1, id: 1 })
  res.json(eventos)
})

export default router
