// ---------------------------------------------------------------------------
// Pruebas de server/src/routes/auth.routes.js
//
// SKELETON de cómo se ve cualquier prueba con vitest + supertest:
//
//   describe('grupo de pruebas', () => {
//     it('hace algo específico', async () => {
//       const res = await request(app).post('/una/ruta').send({ ... })
//       expect(res.status).toBe(200)          // "espero que pase esto"
//     })
//   })
//
// request(app) le manda una petición HTTP falsa directo al app de Express
// (sin necesitar un puerto real ni un navegador) — así se puede probar la
// API exactamente como la usaría el frontend.
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'

const ANA = { username: 'ana', email: 'ana@test.com', password: 'clave12345' }
const signup = (datos = ANA) => request(app).post('/api/auth/signup').send(datos)

// Revisa TODA la respuesta (no solo un campo) buscando cualquier rastro del
// hash o de la contraseña: si algún día alguien agrega un campo nuevo a la
// respuesta, esta prueba lo atrapa igual.
function expectNoSecrets(body, password = ANA.password) {
  const texto = JSON.stringify(body)
  expect(texto).not.toContain('passwordHash')
  expect(texto).not.toContain('$2a$') // prefijo de todo hash de bcryptjs
  expect(texto).not.toContain(password)
}

describe('POST /api/auth/signup', () => {
  it('crea una cuenta nueva y regresa un token', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    expect(res.status).toBe(201)
    expect(res.body.token).toBeTypeOf('string')
    expect(res.body.user.username).toBe('ana')
  })

  it('rechaza una contraseña demasiado corta', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'corta',
    })
    expect(res.status).toBe(400)
  })

  it('rechaza un correo que ya está registrado', async () => {
    await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    const res = await request(app).post('/api/auth/signup').send({
      username: 'otra_persona',
      email: 'ana@test.com', // mismo correo, username distinto
      password: 'clave12345',
    })

    expect(res.status).toBe(409)
  })
})

describe('POST /api/auth/login', () => {
  it('inicia sesión con la contraseña correcta', async () => {
    await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'ana@test.com',
      password: 'clave12345',
    })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeTypeOf('string')
  })

  it('rechaza una contraseña incorrecta', async () => {
    await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'ana@test.com',
      password: 'esta-no-es',
    })

    expect(res.status).toBe(401)
  })

  it('el límite de intentos no bloquea las pruebas (NODE_ENV=test lo desactiva)', async () => {
    // app.js apaga el rate limiter cuando NODE_ENV==='test' -- 20 sería el
    // límite real en producción, así que 25 intentos seguidos aquí prueban
    // justamente que ese apagado funciona. Si esto alguna vez regresara un
    // 429, sería una señal de que el rate limiter se está aplicando también
    // en pruebas por error.
    for (let i = 0; i < 25; i++) {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nadie@test.com', password: 'lo-que-sea' })
      expect(res.status).not.toBe(429)
    }
  })

  it('rechaza un correo que no existe, sin decir que "no existe"', async () => {
    // No revisamos el mensaje exacto, solo que se rechace igual que una
    // contraseña incorrecta (401) -- ver el comentario en auth.routes.js
    // sobre por qué ambos casos responden lo mismo.
    const res = await request(app).post('/api/auth/login').send({
      email: 'nadie@test.com',
      password: 'lo-que-sea',
    })
    expect(res.status).toBe(401)
  })
})

describe('registro: validación y duplicados', () => {
  it('guarda la cuenta en `users` con la contraseña hasheada, nunca en texto plano', async () => {
    const res = await signup()
    expect(res.status).toBe(201)
    expect(res.body.user).toMatchObject({ username: 'ana', email: 'ana@test.com' })
    expect(res.body.user.id).toBeTypeOf('string')
    expectNoSecrets(res.body)

    const guardado = await User.findById(res.body.user.id).select('+passwordHash').lean()
    expect(guardado.passwordHash).not.toBe(ANA.password)
    expect(guardado.passwordHash).toMatch(/^\$2[aby]\$10\$/)
    expect(guardado.createdAt).toBeInstanceOf(Date)
    expect(guardado.updatedAt).toBeInstanceOf(Date)
  })

  it('rechaza un correo duplicado aunque venga con otras mayúsculas, y dice cuál campo', async () => {
    await signup()
    const res = await signup({ username: 'otra', email: 'ANA@Test.com', password: 'clave12345' })
    expect(res.status).toBe(409)
    expect(res.body.field).toBe('email')
    expect(await User.countDocuments()).toBe(1)
  })

  it('rechaza un username duplicado, y dice cuál campo', async () => {
    await signup()
    const res = await signup({ username: 'ana', email: 'otra@test.com', password: 'clave12345' })
    expect(res.status).toBe(409)
    expect(res.body.field).toBe('username')
    expect(await User.countDocuments()).toBe(1)
  })

  it.each([
    ['correo sin @', { ...ANA, email: 'ana.test.com' }, 'email'],
    ['username muy corto', { ...ANA, username: 'ab' }, 'username'],
    ['username con espacios', { ...ANA, username: 'ana maria' }, 'username'],
    ['contraseña de más de 72 bytes', { ...ANA, password: 'x'.repeat(73) }, 'password'],
  ])('rechaza %s', async (_nombre, datos, campo) => {
    const res = await signup(datos)
    expect(res.status).toBe(400)
    expect(res.body.field).toBe(campo)
    expect(await User.countDocuments()).toBe(0)
  })

  it('rechaza campos que no son texto (ej. un objeto de consulta de Mongo)', async () => {
    const res = await signup({ username: 'ana', email: { $ne: null }, password: 'clave12345' })
    expect(res.status).toBe(400)
  })
})

describe('login: respuestas', () => {
  it('no regresa el hash, y acepta el correo con otras mayúsculas', async () => {
    await signup()
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '  Ana@TEST.com ', password: ANA.password })
    expect(res.status).toBe(200)
    expect(res.body.user).toMatchObject({ username: 'ana', email: 'ana@test.com' })
    expectNoSecrets(res.body)
  })

  it('no deja iniciar sesión con un objeto de consulta en vez de un correo', async () => {
    await signup()
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: { $ne: null }, password: ANA.password })
    expect(res.status).toBe(400)
    expect(res.body.token).toBeUndefined()
  })
})

describe('GET /api/auth/me (perfil)', () => {
  it('regresa el username y correo de quien tiene la sesión, sin el hash', async () => {
    const { body } = await signup()
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${body.token}`)
    expect(res.status).toBe(200)
    expect(res.body.user).toMatchObject({ id: body.user.id, username: 'ana', email: 'ana@test.com' })
    expectNoSecrets(res.body)
  })

  it('rechaza sin sesión', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('rechaza un token de una cuenta que ya no existe', async () => {
    const { body } = await signup()
    await User.deleteOne({ _id: body.user.id })
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${body.token}`)
    expect(res.status).toBe(401)
  })
})
