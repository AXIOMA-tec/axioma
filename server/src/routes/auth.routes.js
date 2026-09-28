// ---------------------------------------------------------------------------
// Auth routes: /api/auth/signup, /api/auth/login, /api/auth/google and /api/auth/me.
//
// SKELETON of what any Express route file in this project looks like:
//
//   import { Router } from 'express'
//   const router = Router()
//
//   router.post('/algo', async (req, res) => {
//     // req.body     -> lo que el frontend mandó (ya convertido de JSON)
//     // res.json(x)  -> responde con x, convertido de vuelta a JSON
//     // res.status(n).json(x) -> lo mismo, pero con un código HTTP distinto a 200
//   })
//
//   export default router
//
// server.js importa este router y lo "monta" en una dirección base
// (/api/auth), así que estas rutas terminan siendo:
//   POST /api/auth/signup
//   POST /api/auth/login
//   POST /api/auth/google  (registro / inicio de sesión con Google)
//   GET  /api/auth/me      (requiere sesión: regresa tu propia cuenta)
// ---------------------------------------------------------------------------

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User, { USERNAME_REGEX, EMAIL_REGEX } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { googleConfigured, verifyGoogleCredential } from '../lib/google.js'

const router = Router()

const BCRYPT_COST = 10

// Un hash "de relleno" contra el cual comparar cuando el correo no existe
// (ver /login). Se calcula una sola vez al arrancar.
const DUMMY_HASH = bcrypt.hashSync('contraseña-de-relleno-que-nadie-usa', BCRYPT_COST)

// Crea el token que el navegador va a guardar y reenviar en cada petición
// futura. `sub` (subject) es el nombre estándar de JWT para "de quién es
// este token". expiresIn: '7d' significa que después de una semana hay que
// iniciar sesión de nuevo.
function issueToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d',
  })
}

// req.body viene del frontend y puede traer CUALQUIER cosa, no solo texto:
// por ejemplo { "email": { "$ne": null } }, que Mongo interpretaría como
// "cualquier correo que no sea null" si lo pasáramos directo a una
// consulta. Por eso todo lo que no sea string se trata como vacío.
const asString = (value) => (typeof value === 'string' ? value : '')

const normalizeEmail = (value) => asString(value).trim().toLowerCase()

// bcrypt solo toma en cuenta los primeros 72 BYTES de la contraseña (lo
// demás lo ignora en silencio), así que ponemos ese límite explícito.
function passwordError(password) {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (Buffer.byteLength(password, 'utf8') > 72) return 'La contraseña es demasiado larga (máx. 72 bytes).'
  return null
}

function duplicateResponse(res, field) {
  const error =
    field === 'email'
      ? 'Ya existe una cuenta con ese correo.'
      : 'Ese username ya está en uso.'
  return res.status(409).json({ error, field })
}

// POST /api/auth/signup — crear una cuenta nueva.
router.post('/signup', async (req, res) => {
  const username = asString(req.body?.username).trim()
  const email = normalizeEmail(req.body?.email)
  const password = asString(req.body?.password)

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos: username, email o password.' })
  }
  if (!USERNAME_REGEX.test(username)) {
    return res.status(400).json({
      error: 'El username debe tener 3-30 caracteres: letras, números, "_" o ".".',
      field: 'username',
    })
  }
  if (email.length > 254 || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'El correo no tiene un formato válido.', field: 'email' })
  }
  const pwError = passwordError(password)
  if (pwError) {
    return res.status(400).json({ error: pwError, field: 'password' })
  }

  try {
    // Revisamos cada campo por separado para poder decirle a la persona
    // CUÁL de los dos ya está ocupado.
    if (await User.exists({ email })) return duplicateResponse(res, 'email')
    if (await User.exists({ username })) return duplicateResponse(res, 'username')

    // bcrypt.hash "revuelve" la contraseña de forma que no se puede
    // deshacer. El "10" es el costo del cálculo — más alto es más seguro
    // pero más lento; 10 es el estándar razonable hoy en día.
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST)

    const user = await User.create({ username, email, passwordHash })

    // 201 = "Created". Regresamos el token de una vez para que la persona
    // quede logueada inmediatamente después de registrarse, sin tener que
    // iniciar sesión por separado.
    res.status(201).json({ token: issueToken(user), user: user.toPublic() })
  } catch (err) {
    // Por si dos peticiones llegan al mismo tiempo y ambas pasan el chequeo
    // de arriba antes de que la primera termine de guardarse — Mongo mismo
    // rechaza el segundo username/email duplicado con el código 11000, y
    // err.keyPattern dice cuál de los dos índices únicos chocó.
    if (err.code === 11000) {
      return duplicateResponse(res, err.keyPattern?.email ? 'email' : 'username')
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message).join(' ') })
    }
    res.status(500).json({ error: 'No se pudo crear la cuenta.' })
  }
})

// POST /api/auth/login — iniciar sesión con una cuenta existente.
router.post('/login', async (req, res) => {
  const email = normalizeEmail(req.body?.email)
  const password = asString(req.body?.password)

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos: email o password.' })
  }

  // passwordHash tiene select:false en el modelo; esta es la ÚNICA consulta
  // del proyecto que lo pide.
  const user = await User.findOne({ email }).select('+passwordHash')

  // OJO: si el usuario no existe, igual corremos bcrypt.compare (contra un
  // hash de relleno) en vez de responder de inmediato. Esto es deliberado:
  // si "no existe" respondiera más rápido que "contraseña incorrecta",
  // alguien podría medir esa diferencia para adivinar qué correos están
  // registrados. Ambos casos tardan lo mismo y responden lo mismo.
  // Las cuentas creadas con Google no tienen passwordHash: para ellas, igual
  // que para un correo inexistente, comparamos contra el relleno (y falla).
  const passwordOk = await bcrypt.compare(password, user?.passwordHash || DUMMY_HASH)

  if (!user || !user.passwordHash || !passwordOk) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
  }

  res.json({ token: issueToken(user), user: user.toPublic() })
})

// Quien entra con Google no escoge username: lo sacamos de su correo
// ("Ana.Lopez+x@gmail.com" -> "ana.lopezx") y, si ya está ocupado, le
// agregamos números al final. Siempre cumple USERNAME_REGEX.
async function usernameDisponible(email) {
  let base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '').slice(0, 24)
  if (base.length < 3) base = `${base}usuario`.slice(0, 24)

  if (!(await User.exists({ username: base }))) return base
  for (let intento = 0; intento < 10; intento++) {
    const candidato = `${base}${Math.floor(1000 + Math.random() * 9000)}`
    if (!(await User.exists({ username: candidato }))) return candidato
  }
  throw new Error('No se encontró un username libre.')
}

// POST /api/auth/google — registrarse O iniciar sesión con Google (es la
// misma acción: si la cuenta de Google ya tiene cuenta en Axioma, entra; si
// no, se crea). Recibe { credential }: el ID token que el botón de Google le
// dio al frontend. Responde igual que /signup y /login: { token, user }, con
// NUESTRO token — de aquí en adelante la sesión es idéntica a la de alguien
// que entró con contraseña.
router.post('/google', async (req, res) => {
  if (!googleConfigured()) {
    return res.status(503).json({ error: 'El inicio de sesión con Google no está configurado.' })
  }
  const credential = asString(req.body?.credential)
  if (!credential) {
    return res.status(400).json({ error: 'Falta el credential de Google.' })
  }

  let google
  try {
    google = await verifyGoogleCredential(credential)
  } catch {
    return res.status(401).json({ error: 'No se pudo verificar tu cuenta de Google.' })
  }

  // Solo aceptamos correos que Google confirma que le pertenecen a esa
  // persona; si no, alguien podría "apropiarse" de un correo ajeno.
  const email = normalizeEmail(google.email)
  if (!google.googleId || !email || !google.emailVerified) {
    return res.status(401).json({ error: 'Tu cuenta de Google no tiene un correo verificado.' })
  }

  try {
    // 1) Ya entró con Google antes: la reconocemos por su googleId.
    const existente = await User.findOne({ googleId: google.googleId })
    if (existente) {
      return res.json({ token: issueToken(existente), user: existente.toPublic() })
    }

    // 2) Ya hay una cuenta con ese correo, pero creada con contraseña. NO
    //    la ligamos automáticamente: como el registro con contraseña no
    //    verifica el correo, alguien pudo haber registrado ESE correo antes
    //    que su dueño real, y ligarla le daría acceso a la cuenta del dueño
    //    con la contraseña que el intruso ya conoce.
    if (await User.exists({ email })) {
      return res.status(409).json({
        error: 'Ya existe una cuenta con ese correo. Inicia sesión con tu contraseña.',
        field: 'email',
      })
    }

    // 3) Cuenta nueva.
    const user = await User.create({
      username: await usernameDisponible(email),
      email,
      googleId: google.googleId,
    })
    res.status(201).json({ token: issueToken(user), user: user.toPublic() })
  } catch (err) {
    // Dos clics casi al mismo tiempo: el segundo choca con el índice único.
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Esa cuenta ya existe. Intenta de nuevo.' })
    }
    res.status(500).json({ error: 'No se pudo iniciar sesión con Google.' })
  }
})

// GET /api/auth/me — la cuenta de quien tiene la sesión iniciada (lo que
// muestra la página de Perfil). requireAuth ya cargó al usuario desde la
// base, sin su passwordHash.
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user.toPublic() })
})

export default router
