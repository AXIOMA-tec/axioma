// ---------------------------------------------------------------------------
// Pruebas de server/src/routes/resuelto.routes.js y misResueltos.routes.js --
// las casillas "En progreso" / "Resuelto" de /problemas y la sección "Tu
// progreso" de /perfil. Mismo patrón que comments.test.js.
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Problem from '../models/Problem.js'
import Resuelto from '../models/Resuelto.js'

async function crearProblemaDePrueba(codigo = 'TEST-1') {
  const categoria = await Category.create({ name: 'Categoría de prueba' })
  return Problem.create({
    codigo,
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

async function crearUsuarioYObtenerToken(email = 'resolvedor@test.com', username = 'resolvedor') {
  const res = await request(app).post('/api/auth/signup').send({
    username,
    email,
    password: 'clave12345',
  })
  return res.body.token
}

describe('POST /api/problems/:id/resuelto', () => {
  it('rechaza marcarlo sin sesión iniciada', async () => {
    const problema = await crearProblemaDePrueba()
    const res = await request(app).post(`/api/problems/${problema._id}/resuelto`)
    expect(res.status).toBe(401)
  })

  it('regresa 404 si el problema no existe', async () => {
    const token = await crearUsuarioYObtenerToken()
    const res = await request(app)
      .post('/api/problems/000000000000000000000000/resuelto')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })

  it('regresa 400 si el id del problema no tiene forma de ObjectId', async () => {
    const token = await crearUsuarioYObtenerToken()
    const res = await request(app)
      .post('/api/problems/no-es-un-id/resuelto')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(400)
  })

  it('sin mandar estado, lo marca como resuelto (compatibilidad con un toggle simple)', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(201)
    expect(res.body.estado).toBe('resuelto')
    expect(await Resuelto.countDocuments()).toBe(1)
  })

  it('marca el problema como "en progreso" cuando se manda ese estado', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'en_progreso' })

    expect(res.status).toBe(201)
    expect(res.body.estado).toBe('en_progreso')
  })

  it('rechaza un estado que no es ni "en_progreso" ni "resuelto"', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'terminado' })

    expect(res.status).toBe(400)
    expect(await Resuelto.countDocuments()).toBe(0)
  })

  it('marcarlo dos veces seguidas con el mismo estado no truena ni duplica (idempotente)', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const primera = await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)
    const segunda = await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)

    expect(primera.status).toBe(201)
    expect(segunda.status).toBe(201)
    expect(await Resuelto.countDocuments()).toBe(1)
  })

  it('pasar de "en progreso" a "resuelto" actualiza el mismo documento, no crea uno nuevo', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'en_progreso' })
    const res = await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'resuelto' })

    expect(res.body.estado).toBe('resuelto')
    expect(await Resuelto.countDocuments()).toBe(1)
  })

  it('dos personas distintas pueden marcar el mismo problema, cada una por su cuenta', async () => {
    const problema = await crearProblemaDePrueba()
    const tokenA = await crearUsuarioYObtenerToken('a@test.com', 'persona_a')
    const tokenB = await crearUsuarioYObtenerToken('b@test.com', 'persona_b')

    await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${tokenA}`)
    await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${tokenB}`)

    expect(await Resuelto.countDocuments({ problem: problema._id })).toBe(2)
  })
})

describe('DELETE /api/problems/:id/resuelto', () => {
  it('rechaza desmarcarlo sin sesión iniciada', async () => {
    const problema = await crearProblemaDePrueba()
    const res = await request(app).delete(`/api/problems/${problema._id}/resuelto`)
    expect(res.status).toBe(401)
  })

  it('desmarca el problema que ya estaba marcado', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)

    const res = await request(app)
      .delete(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)
    expect(await Resuelto.countDocuments()).toBe(0)
  })

  it('desmarcar algo que nunca se marcó tampoco truena (idempotente)', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .delete(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)
  })

  it('no afecta lo que otra persona marcó en el mismo problema', async () => {
    const problema = await crearProblemaDePrueba()
    const tokenA = await crearUsuarioYObtenerToken('a@test.com', 'persona_a')
    const tokenB = await crearUsuarioYObtenerToken('b@test.com', 'persona_b')
    await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${tokenA}`)
    await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${tokenB}`)

    await request(app)
      .delete(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${tokenA}`)

    expect(await Resuelto.countDocuments({ problem: problema._id })).toBe(1)
  })
})

describe('GET /api/resueltos/mine', () => {
  it('rechaza sin sesión iniciada', async () => {
    const res = await request(app).get('/api/resueltos/mine')
    expect(res.status).toBe(401)
  })

  it('regresa una lista vacía si no has marcado ningún problema', async () => {
    const token = await crearUsuarioYObtenerToken()
    const res = await request(app).get('/api/resueltos/mine').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('regresa los problemas que marcaste, con el problema poblado y su estado', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'en_progreso' })

    const res = await request(app).get('/api/resueltos/mine').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].problem.codigo).toBe('TEST-1')
    expect(res.body[0].estado).toBe('en_progreso')
  })

  it('no regresa lo que marcó otra persona', async () => {
    const problema = await crearProblemaDePrueba()
    const tokenA = await crearUsuarioYObtenerToken('a@test.com', 'persona_a')
    const tokenB = await crearUsuarioYObtenerToken('b@test.com', 'persona_b')
    await request(app)
      .post(`/api/problems/${problema._id}/resuelto`)
      .set('Authorization', `Bearer ${tokenA}`)

    const res = await request(app).get('/api/resueltos/mine').set('Authorization', `Bearer ${tokenB}`)
    expect(res.body).toEqual([])
  })
})

describe('GET /api/problems incluye estadoPorMi', () => {
  it('sin sesión, estadoPorMi siempre es null', async () => {
    await crearProblemaDePrueba()
    const res = await request(app).get('/api/problems')
    expect(res.status).toBe(200)
    expect(res.body[0].estadoPorMi).toBe(null)
  })

  it('con sesión, marca el estado correcto solo en el problema marcado', async () => {
    const resuelto = await crearProblemaDePrueba('TEST-1')
    const enProgreso = await crearProblemaDePrueba('TEST-2')
    await crearProblemaDePrueba('TEST-3')
    const token = await crearUsuarioYObtenerToken()
    await request(app)
      .post(`/api/problems/${resuelto._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'resuelto' })
    await request(app)
      .post(`/api/problems/${enProgreso._id}/resuelto`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'en_progreso' })

    const res = await request(app).get('/api/problems').set('Authorization', `Bearer ${token}`)
    const porCodigo = Object.fromEntries(res.body.map((p) => [p.codigo, p.estadoPorMi]))
    expect(porCodigo['TEST-1']).toBe('resuelto')
    expect(porCodigo['TEST-2']).toBe('en_progreso')
    expect(porCodigo['TEST-3']).toBe(null)
  })

  it('un token inválido no truena la lista, solo se ignora (como sin sesión)', async () => {
    await crearProblemaDePrueba()
    const res = await request(app)
      .get('/api/problems')
      .set('Authorization', 'Bearer esto-no-es-un-token-real')
    expect(res.status).toBe(200)
    expect(res.body[0].estadoPorMi).toBe(null)
  })
})
