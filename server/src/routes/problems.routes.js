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

const router = Router()

router.get('/', async (req, res) => {
  const problems = await Problem.find().sort({ createdAt: -1 })
  res.json(problems)
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
