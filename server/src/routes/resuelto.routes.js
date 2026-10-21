// POST   /api/problems/:problemId/resuelto — marcarlo "en progreso" o
//        "resuelto" (login). El estado va en el body: { estado: 'resuelto' }
//        o { estado: 'en_progreso' }; si no se manda, 'resuelto' (para quien
//        siga llamando esto como un toggle simple de sí/no).
// DELETE /api/problems/:problemId/resuelto — quitarle cualquier marca (login).
//
// Mismo patrón que comments.routes.js (mergeParams: true para leer
// req.params.problemId, y el mismo chequeo de que el problema exista antes
// de cualquier otra cosa). Ambas rutas son idempotentes a propósito: marcar
// dos veces seguidas (incluso con un estado distinto) no truena ni duplica,
// y desmarcar algo que ya no estaba marcado tampoco — así el frontend puede
// simplemente mandar "a qué estado quiero pasar" sin preocuparse de en cuál
// cree que está ahorita.

import { Router } from 'express'
import mongoose from 'mongoose'
import Resuelto from '../models/Resuelto.js'
import Problem from '../models/Problem.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router({ mergeParams: true })

const ESTADOS_VALIDOS = ['en_progreso', 'resuelto']

router.use(async (req, res, next) => {
  const { problemId } = req.params
  if (!mongoose.isValidObjectId(problemId)) {
    return res.status(400).json({ error: 'El id del problema no es válido.' })
  }
  if (!(await Problem.exists({ _id: problemId }))) {
    return res.status(404).json({ error: 'Ese problema no existe.' })
  }
  next()
})

router.post('/', requireAuth, async (req, res) => {
  const estado = req.body?.estado ?? 'resuelto'
  if (!ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido.' })
  }

  // findOneAndUpdate con upsert en vez de create(): si ya existía (alguien
  // le dio clic dos veces, o cambió de "en progreso" a "resuelto"), no
  // truena por el índice único de arriba — solo actualiza el estado.
  const resuelto = await Resuelto.findOneAndUpdate(
    { problem: req.params.problemId, author: req.user._id },
    { problem: req.params.problemId, author: req.user._id, estado },
    { upsert: true, returnDocument: 'after' },
  )
  res.status(201).json(resuelto)
})

router.delete('/', requireAuth, async (req, res) => {
  await Resuelto.deleteOne({ problem: req.params.problemId, author: req.user._id })
  res.status(204).send()
})

export default router
