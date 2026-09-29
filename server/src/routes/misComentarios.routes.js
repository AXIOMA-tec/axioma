// GET /api/comments/mine — todos los comentarios que ha escrito quien tiene
// la sesión iniciada, sin importar en qué problema, más recientes primero.
// Para la sección "Tus comentarios" de /perfil. Requiere sesión: no tendría
// sentido pedir "mis comentarios" sin saber quién es "mí".

import { Router } from 'express'
import Comment from '../models/Comment.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/mine', requireAuth, async (req, res) => {
  const comentarios = await Comment.find({ author: req.user._id })
    // Solo los campos que la tarjeta necesita para armar el link y el
    // título (ver formatearTitulo en Problemas.jsx) — no el enunciado
    // completo en LaTeX, que aquí no se usa.
    .populate('problem', 'titulo codigo tipo año')
    .sort({ createdAt: -1 })

  res.json(comentarios)
})

export default router
