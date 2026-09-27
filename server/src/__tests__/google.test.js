// ---------------------------------------------------------------------------
// Pruebas de POST /api/auth/google.
//
// No hablamos con Google de verdad: vi.mock reemplaza server/src/lib/google.js
// por una versión falsa, y cada prueba decide qué "dice Google" sobre el
// credential (quién es, si el correo está verificado, o si el token es
// inválido). Lo que SÍ es real es todo lo demás: la ruta, la base de datos y
// nuestro propio token de sesión.
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'
import { verifyGoogleCredential } from '../lib/google.js'

vi.mock('../lib/google.js', () => ({
  googleConfigured: () => Boolean(process.env.GOOGLE_CLIENT_ID),
  verifyGoogleCredential: vi.fn(),
}))

const ANA_GOOGLE = {
  googleId: 'google-sub-123',
  email: 'Ana.Lopez@gmail.com',
  emailVerified: true,
  name: 'Ana López',
}

const entrarConGoogle = (credential = 'credential-de-prueba') =>
  request(app).post('/api/auth/google').send({ credential })

beforeEach(() => {
  process.env.GOOGLE_CLIENT_ID = 'client-id-de-prueba.apps.googleusercontent.com'
  verifyGoogleCredential.mockReset()
})

afterEach(() => {
  delete process.env.GOOGLE_CLIENT_ID
})

describe('POST /api/auth/google', () => {
  it('crea una cuenta nueva sin contraseña, con username sacado del correo', async () => {
    verifyGoogleCredential.mockResolvedValue(ANA_GOOGLE)

    const res = await entrarConGoogle('el-credential')

    expect(res.status).toBe(201)
    expect(verifyGoogleCredential).toHaveBeenCalledWith('el-credential')
    expect(res.body.token).toBeTypeOf('string')
    expect(res.body.user).toMatchObject({
      username: 'ana.lopez',
      email: 'ana.lopez@gmail.com',
      conGoogle: true,
    })
    // Ni el hash ni el googleId salen hacia el frontend.
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|googleId|google-sub-123/)

    const guardado = await User.findById(res.body.user.id).select('+passwordHash').lean()
    expect(guardado.googleId).toBe('google-sub-123')
    expect(guardado.passwordHash).toBeUndefined()
  })

  it('la segunda vez inicia sesión en la MISMA cuenta en vez de crear otra', async () => {
    verifyGoogleCredential.mockResolvedValue(ANA_GOOGLE)
    const primera = await entrarConGoogle()

    const segunda = await entrarConGoogle()

    expect(segunda.status).toBe(200)
    expect(segunda.body.user.id).toBe(primera.body.user.id)
    expect(await User.countDocuments()).toBe(1)
  })

  it('la reconoce por googleId aunque el correo de Google haya cambiado', async () => {
    verifyGoogleCredential.mockResolvedValue(ANA_GOOGLE)
    const primera = await entrarConGoogle()

    verifyGoogleCredential.mockResolvedValue({ ...ANA_GOOGLE, email: 'ana.nueva@gmail.com' })
    const segunda = await entrarConGoogle()

    expect(segunda.status).toBe(200)
    expect(segunda.body.user.id).toBe(primera.body.user.id)
  })

  it('si el username ya está ocupado, le agrega números', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ username: 'ana.lopez', email: 'otra@test.com', password: 'clave12345' })
    verifyGoogleCredential.mockResolvedValue(ANA_GOOGLE)

    const res = await entrarConGoogle()

    expect(res.status).toBe(201)
    expect(res.body.user.username).toMatch(/^ana\.lopez\d{4}$/)
  })

  it('el token que regresa sirve para /me y para comentar, igual que uno de contraseña', async () => {
    verifyGoogleCredential.mockResolvedValue(ANA_GOOGLE)
    const { body } = await entrarConGoogle()

    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${body.token}`)

    expect(me.status).toBe(200)
    expect(me.body.user.username).toBe('ana.lopez')
  })

  it('NO liga automáticamente una cuenta existente con contraseña y el mismo correo', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ username: 'ana', email: 'ana.lopez@gmail.com', password: 'clave12345' })
    verifyGoogleCredential.mockResolvedValue(ANA_GOOGLE)

    const res = await entrarConGoogle()

    expect(res.status).toBe(409)
    expect(res.body.token).toBeUndefined()
    const existente = await User.findOne({ email: 'ana.lopez@gmail.com' }).lean()
    expect(existente.googleId).toBeUndefined()
    expect(await User.countDocuments()).toBe(1)
  })

  it('rechaza un credential que Google no valida, sin crear nada', async () => {
    verifyGoogleCredential.mockRejectedValue(new Error('Wrong recipient, payload audience != requiredAudience'))

    const res = await entrarConGoogle()

    expect(res.status).toBe(401)
    expect(await User.countDocuments()).toBe(0)
  })

  it('rechaza una cuenta de Google con el correo sin verificar', async () => {
    verifyGoogleCredential.mockResolvedValue({ ...ANA_GOOGLE, emailVerified: false })

    const res = await entrarConGoogle()

    expect(res.status).toBe(401)
    expect(await User.countDocuments()).toBe(0)
  })

  it('rechaza si no mandan credential (o no es texto)', async () => {
    const res = await request(app).post('/api/auth/google').send({ credential: { $ne: null } })
    expect(res.status).toBe(400)
    expect(verifyGoogleCredential).not.toHaveBeenCalled()
  })

  it('responde 503 si el servidor no tiene GOOGLE_CLIENT_ID', async () => {
    delete process.env.GOOGLE_CLIENT_ID
    const res = await entrarConGoogle()
    expect(res.status).toBe(503)
    expect(verifyGoogleCredential).not.toHaveBeenCalled()
  })
})

describe('cuentas de Google y el login con contraseña', () => {
  it('una cuenta creada con Google no puede entrar por /login con ninguna contraseña', async () => {
    verifyGoogleCredential.mockResolvedValue(ANA_GOOGLE)
    await entrarConGoogle()

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana.lopez@gmail.com', password: 'lo-que-sea-123' })

    expect(res.status).toBe(401)
  })
})
