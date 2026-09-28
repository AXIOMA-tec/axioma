// ---------------------------------------------------------------------------
// Pruebas de server/src/routes/comments.routes.js -- estas son las que
// realmente demuestran que "necesitas iniciar sesión para comentar" no es
// solo un botón escondido en el frontend, sino algo que el backend exige.
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Problem from '../models/Problem.js'
import Comment from '../models/Comment.js'
import User from '../models/User.js'

// Pequeño helper: crea un problema real en la base de prueba, para tener
// algo válido sobre lo cual comentar en cada prueba.
async function crearProblemaDePrueba() {
  const categoria = await Category.create({ name: 'Categoría de prueba' })
  return Problem.create({
    codigo: 'TEST-1',
    titulo: 'Problema de prueba',
    enunciado: 'Enunciado de prueba.',
    category: categoria._id,
    año: '2024',
    tema: 'Álgebra',
    tipo: 'Interno Axioma',
    dificultad: 'Media',
    exito: 50,
  })
}

// Otro helper: registra un usuario nuevo y regresa su token, listo para
// usarse en el encabezado Authorization de una prueba. Se le puede pedir un
// email distinto para simular a una SEGUNDA persona (ver las pruebas de
// borrado más abajo, donde importa que dos usuarios sean gente distinta).
async function crearUsuarioYObtenerToken(email = 'comentarista@test.com', username = 'comentarista') {
  const res = await request(app).post('/api/auth/signup').send({
    username,
    email,
    password: 'clave12345',
  })
  return res.body.token
}

describe('GET /api/problems/:id/comments', () => {
  it('deja leer los comentarios sin haber iniciado sesión', async () => {
    const problema = await crearProblemaDePrueba()
    const res = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('POST /api/problems/:id/comments', () => {
  it('rechaza publicar un comentario sin sesión iniciada', async () => {
    const problema = await crearProblemaDePrueba()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .send({ body: 'Intento de comentario sin sesión.' })

    expect(res.status).toBe(401)
  })

  it('rechaza un token inventado (no firmado por nosotros)', async () => {
    const problema = await crearProblemaDePrueba()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', 'Bearer esto-no-es-un-token-real')
      .send({ body: 'Intento con token falso.' })

    expect(res.status).toBe(401)
  })

  it('permite comentar con sesión iniciada, y el comentario aparece después al leer', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const publicar = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Este problema tiene una solución elegante con AM-GM.' })

    expect(publicar.status).toBe(201)
    // El autor debe venir "poblado" (username visible), no solo un ID crudo.
    expect(publicar.body.author.username).toBe('comentarista')

    const leer = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(leer.status).toBe(200)
    expect(leer.body).toHaveLength(1)
    expect(leer.body[0].body).toBe('Este problema tiene una solución elegante con AM-GM.')
  })

  it('rechaza un comentario vacío, incluso con sesión iniciada', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: '   ' }) // solo espacios

    expect(res.status).toBe(400)
  })

  it('rechaza un comentario más largo que el límite del modelo (2000 caracteres)', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'x'.repeat(2001) })

    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/problems/:id/comments/:commentId', () => {
  it('rechaza borrar sin sesión iniciada', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    const comentario = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Un comentario.' })

    const res = await request(app).delete(
      `/api/problems/${problema._id}/comments/${comentario.body._id}`,
    )
    expect(res.status).toBe(401)
  })

  it('rechaza borrar el comentario de OTRA persona', async () => {
    const problema = await crearProblemaDePrueba()
    const tokenAutor = await crearUsuarioYObtenerToken('autor@test.com', 'autor')
    const tokenOtraPersona = await crearUsuarioYObtenerToken('otra@test.com', 'otra_persona')

    const comentario = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${tokenAutor}`)
      .send({ body: 'Comentario del autor original.' })

    const res = await request(app)
      .delete(`/api/problems/${problema._id}/comments/${comentario.body._id}`)
      .set('Authorization', `Bearer ${tokenOtraPersona}`)

    expect(res.status).toBe(403)
  })

  it('deja al autor borrar su propio comentario, y desaparece de la lista', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const comentario = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Lo voy a borrar yo mismo.' })

    const borrar = await request(app)
      .delete(`/api/problems/${problema._id}/comments/${comentario.body._id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(borrar.status).toBe(204)

    const leer = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(leer.body).toHaveLength(0)
  })

  it('regresa 404 si el comentario no existe', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    const idQueNoExiste = '000000000000000000000000' // un ObjectId con forma válida, pero inventado

    const res = await request(app)
      .delete(`/api/problems/${problema._id}/comments/${idQueNoExiste}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})

describe('relaciones: comments -> users y comments -> problems', () => {
  it('guarda el comentario con author = _id del usuario del token y problem = _id del problema', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    const usuario = await User.findOne({ username: 'comentarista' })

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Relación correcta.' })
    expect(res.status).toBe(201)

    // Revisamos el documento tal como quedó en la base, no solo la respuesta.
    const guardado = await Comment.findById(res.body._id).lean()
    expect(guardado.author.toString()).toBe(usuario._id.toString())
    expect(guardado.problem.toString()).toBe(problema._id.toString())
    expect(guardado.createdAt).toBeInstanceOf(Date)
    // Solo IDs: el username NO se copia dentro del comentario.
    expect(guardado).not.toHaveProperty('username')
  })

  it('ignora un author/userId/problem mandado en el body (no se puede suplantar a otra persona)', async () => {
    const problema = await crearProblemaDePrueba()
    const otroProblema = await Problem.create({
      codigo: 'TEST-2', titulo: 'Otro', enunciado: 'Otro.', category: problema.category,
      año: '2024', tema: 'Álgebra', tipo: 'Interno Axioma', dificultad: 'Fácil',
    })
    const tokenVictima = await crearUsuarioYObtenerToken('victima@test.com', 'victima')
    const tokenAtacante = await crearUsuarioYObtenerToken('atacante@test.com', 'atacante')
    const victima = await User.findOne({ username: 'victima' })
    expect(tokenVictima).toBeTypeOf('string')

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${tokenAtacante}`)
      .send({
        body: 'Me hago pasar por otra persona.',
        author: victima._id.toString(),
        userId: victima._id.toString(),
        problem: otroProblema._id.toString(),
      })

    expect(res.status).toBe(201)
    expect(res.body.author.username).toBe('atacante')
    const guardado = await Comment.findById(res.body._id).lean()
    expect(guardado.author.toString()).not.toBe(victima._id.toString())
    expect(guardado.problem.toString()).toBe(problema._id.toString())
  })

  it('al leer, identifica al autor con su username y nunca expone correo ni hash', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Primero.' })
    await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Segundo.' })

    const res = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(res.status).toBe(200)
    expect(res.body.map((c) => c.body)).toEqual(['Primero.', 'Segundo.'])
    expect(Object.keys(res.body[0].author).sort()).toEqual(['_id', 'username'])
    const texto = JSON.stringify(res.body)
    expect(texto).not.toContain('passwordHash')
    expect(texto).not.toContain('comentarista@test.com')
  })

  it('solo regresa los comentarios del problema pedido', async () => {
    const problema = await crearProblemaDePrueba()
    const otroProblema = await Problem.create({
      codigo: 'TEST-2', titulo: 'Otro', enunciado: 'Otro.', category: problema.category,
      año: '2024', tema: 'Álgebra', tipo: 'Interno Axioma', dificultad: 'Fácil',
    })
    const token = await crearUsuarioYObtenerToken()
    await request(app)
      .post(`/api/problems/${otroProblema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Es del otro problema.' })

    const res = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(res.body).toEqual([])
  })
})

describe('validación del problema y del contenido', () => {
  it('regresa 404 al comentar en un problema que no existe, y no guarda nada', async () => {
    const token = await crearUsuarioYObtenerToken()
    const res = await request(app)
      .post('/api/problems/000000000000000000000000/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Hola.' })
    expect(res.status).toBe(404)
    expect(await Comment.countDocuments()).toBe(0)
  })

  it('regresa 400 si el id del problema no tiene forma de ObjectId', async () => {
    const res = await request(app).get('/api/problems/no-es-un-id/comments')
    expect(res.status).toBe(400)
  })

  it('rechaza un body que no es texto', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: { $gt: '' } })
    expect(res.status).toBe(400)
  })

  it('rechaza comentar con el token de una cuenta que ya fue borrada', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    await User.deleteMany({})
    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Fantasma.' })
    expect(res.status).toBe(401)
    expect(await Comment.countDocuments()).toBe(0)
  })
})
