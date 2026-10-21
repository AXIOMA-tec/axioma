// GET /api/resueltos/mine — todos los problemas que ha marcado como
// resueltos quien tiene la sesión iniciada, más recientes primero. Mismo
// patrón que misComentarios.routes.js, para la sección "Tus problemas
// resueltos" de /perfil.

import { Router } from 'express'
import Resuelto from '../models/Resuelto.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/mine', requireAuth, async (req, res) => {
  const resueltos = await Resuelto.find({ author: req.user._id })
    .populate('problem', 'titulo codigo tipo año')
    .sort({ createdAt: -1 })

  res.json(resueltos)
})

export default router
