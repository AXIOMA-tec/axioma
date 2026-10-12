// GET /api/problems         — list every problem (what the table on
//                              Problemas.jsx used to read from the hardcoded
//                              PROBLEMAS array).
// GET /api/problems/count   — just the total, as { count }. Para la cifra
//                              "Problemas en el archivo" de Quiénes Somos:
//                              antes era un número fijo en el código que se
//                              desactualizaba cada vez que alguien agregaba
//                              problemas (93 -> 156 -> 197...); ahora se lee
//                              de aquí, siempre correcto. countDocuments()
//                              en vez de find() para no traer el LaTeX
//                              completo de cada problema solo para contar.
// GET /api/problems/:id     — one problem by its Mongo _id (what the modal
//                              needs when someone clicks a row).
// Ninguna necesita auth — ver problemas es público, solo comentar no lo es.
// La ruta /count va ANTES de /:id a propósito: si no, Express trataría
// "count" como si fuera un :id y nunca llegaría a este handler.

import { Router } from 'express'
import Problem from '../models/Problem.js'
import Comment from '../models/Comment.js'

const router = Router()

// Con cientos de problemas, nadie los resuelve todos — para que la gente
// encuentre dónde ya hay conversación (en vez de abrir uno por uno a
// adivinar), cada problema de la lista trae cuántos comentarios tiene. Un
// solo aggregate() para contarlos todos de un jalón, en vez de una consulta
// de Comment por cada problema (que con 400+ problemas sería 400+
// consultas).
router.get('/', async (req, res) => {
  const [problems, conteos] = await Promise.all([
    Problem.find().sort({ createdAt: -1 }),
    Comment.aggregate([{ $group: { _id: '$problem', total: { $sum: 1 } } }]),
  ])
  const totalPorProblema = new Map(conteos.map((c) => [c._id.toString(), c.total]))
  const problemsConComentarios = problems.map((p) => ({
    ...p.toObject(),
    totalComentarios: totalPorProblema.get(p._id.toString()) ?? 0,
  }))
  res.json(problemsConComentarios)
})

router.get('/count', async (req, res) => {
  const count = await Problem.countDocuments()
  res.json({ count })
})

router.get('/:id', async (req, res) => {
  const problem = await Problem.findById(req.params.id)
  if (!problem) {
    return res.status(404).json({ error: 'Ese problema no existe.' })
  }
  res.json(problem)
})

export default router
