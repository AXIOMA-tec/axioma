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
import jwt from 'jsonwebtoken'
import Problem from '../models/Problem.js'
import Comment from '../models/Comment.js'
import Resuelto from '../models/Resuelto.js'

const router = Router()

// A diferencia de requireAuth (middleware/auth.js), esto NUNCA rechaza la
// petición: ver problemas es público, con o sin sesión. Solo intenta leer
// quién eres, para poder marcar "esto ya lo resolviste" en la lista — si no
// hay token, o es inválido/viejo, simplemente no se personaliza nada, sin
// error.
function idDeSesionOpcional(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }).sub
  } catch {
    return null
  }
}

// Con cientos de problemas, nadie los resuelve todos — para que la gente
// encuentre dónde ya hay conversación (en vez de abrir uno por uno a
// adivinar), cada problema de la lista trae cuántos comentarios tiene. Un
// solo aggregate() para contarlos todos de un jalón, en vez de una consulta
// de Comment por cada problema (que con 400+ problemas sería 400+
// consultas). Si hay sesión, también se manda en qué estado dejó esa
// persona cada problema (estadoPorMi: 'resuelto', 'en_progreso', o null si
// nunca lo marcó), con el mismo truco de un solo find() en vez de una
// consulta por problema.
router.get('/', async (req, res) => {
  const userId = idDeSesionOpcional(req)

  const [problems, conteos, resueltos] = await Promise.all([
    Problem.find().sort({ createdAt: -1 }),
    Comment.aggregate([{ $group: { _id: '$problem', total: { $sum: 1 } } }]),
    userId ? Resuelto.find({ author: userId }, 'problem estado') : [],
  ])
  const totalPorProblema = new Map(conteos.map((c) => [c._id.toString(), c.total]))
  const estadoPorProblema = new Map(resueltos.map((r) => [r.problem.toString(), r.estado]))
  const problemsConExtras = problems.map((p) => ({
    ...p.toObject(),
    totalComentarios: totalPorProblema.get(p._id.toString()) ?? 0,
    estadoPorMi: estadoPorProblema.get(p._id.toString()) ?? null,
  }))
  res.json(problemsConExtras)
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
