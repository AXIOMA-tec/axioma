// GET    /api/problems/:problemId/comments             — list comments.
// POST   /api/problems/:problemId/comments             — add one (needs login).
// DELETE /api/problems/:problemId/comments/:commentId  — delete your own.
//
// This file doesn't know its own full URL — `:problemId` is filled in by
// wherever server.js decides to mount this router (see server.js). Router({
// mergeParams: true }) is what lets this file read req.params.problemId even
// though the ":problemId" part of the URL is defined one level up.

import { Router } from 'express'
import mongoose from 'mongoose'
import Comment from '../models/Comment.js'
import Problem from '../models/Problem.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router({ mergeParams: true })

const MAX_LENGTH = 2000

// Corre antes de TODAS las rutas de este archivo: confirma que el
// :problemId de la URL tenga forma de ObjectId y que ese problema exista de
// verdad en `problems`. Sin esto, se podrían guardar comentarios colgados
// de un problema inexistente (el ObjectId "se ve" válido pero no apunta a
// nada), y un id mal formado tronaría como error 500.
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

// Público: cualquiera puede LEER los comentarios, con o sin sesión iniciada.
router.get('/', async (req, res) => {
  const comments = await Comment.find({ problem: req.params.problemId })
    .populate('author', 'username') // reemplaza el ObjectId del autor por { _id, username }
    .sort({ createdAt: 1 }) // los más viejos primero, como en un hilo de foro

  res.json(comments)
})

// Protegido: requireAuth corre ANTES que esta función. Si no hay sesión
// válida, requireAuth ya respondió 401 y esta línea nunca se ejecuta.
router.post('/', requireAuth, async (req, res) => {
  // Solo leemos `body` del cuerpo de la petición. Si el frontend manda
  // además un `author`, `userId` o `problem`, se ignoran: el autor sale del
  // token (requireAuth) y el problema de la URL ya validada arriba.
  const raw = req.body?.body
  if (typeof raw !== 'string' || !raw.trim()) {
    return res.status(400).json({ error: 'El comentario no puede estar vacío.' })
  }
  const body = raw.trim()
  if (body.length > MAX_LENGTH) {
    return res.status(400).json({ error: `El comentario no puede pasar de ${MAX_LENGTH} caracteres.` })
  }

  try {
    const comment = await Comment.create({
      problem: req.params.problemId,
      author: req.user._id, // puesto por requireAuth después de verificar el token
      body,
    })

    // Antes de responder, llenamos el campo author con { _id, username } en
    // vez de dejarlo como un ObjectId — así el frontend puede mostrar el
    // nombre del autor de inmediato, sin pedirlo aparte.
    await comment.populate('author', 'username')

    res.status(201).json(comment)
  } catch (err) {
    // Mongoose lanza un ValidationError si, por ejemplo, el comentario
    // pasa del límite de 2000 caracteres del modelo. Sin este catch, ese
    // error se iría como un 500 genérico en vez de un 400 explicando qué
    // salió mal.
    if (err.name === 'ValidationError') {
      const mensaje = Object.values(err.errors)
        .map((e) => e.message)
        .join(' ')
      return res.status(400).json({ error: mensaje })
    }
    res.status(500).json({ error: 'No se pudo guardar el comentario.' })
  }
})

// Protegido, y además solo el AUTOR del comentario puede borrarlo -- no
// basta con estar loggeado, requireAuth solo confirma quién eres, esta
// ruta además confirma que eres tú quien lo escribió.
router.delete('/:commentId', requireAuth, async (req, res) => {
  const comment = mongoose.isValidObjectId(req.params.commentId)
    ? await Comment.findById(req.params.commentId)
    : null

  // Si no existe, o existe pero es de OTRO problema, tratamos ambos casos
  // igual (404) -- no hay razón para distinguirlos desde afuera.
  if (!comment || comment.problem.toString() !== req.params.problemId) {
    return res.status(404).json({ error: 'Ese comentario no existe.' })
  }

  // Puede borrarlo quien lo escribió, o un administrador (para moderar
  // comentarios con groserías u otro contenido que no debería quedarse).
  const esAutor = comment.author.toString() === req.userId
  if (!esAutor && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Solo puedes borrar tus propios comentarios.' })
  }

  await comment.deleteOne()
  res.status(204).send() // 204 = "hecho, y no hay nada que regresar"
})

export default router
