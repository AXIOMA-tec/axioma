// ---------------------------------------------------------------------------
// requireAuth — an Express "middleware": a function that runs BEFORE a route
// handler, and can either let the request continue (by calling next()) or
// stop it short (by sending a response itself, like the 401s below).
//
// SKELETON of what any Express middleware looks like:
//
//   function algunMiddleware(req, res, next) {
//     if (condicionOk) {
//       next()              // <- sigue hacia la ruta real
//     } else {
//       res.status(400).json({ error: '...' })   // <- corta aquí, la ruta real nunca corre
//     }
//   }
//
// We attach this to any route that should be blocked for logged-out
// visitors — in this project, that's only "post a comment".
// ---------------------------------------------------------------------------

import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'

export async function requireAuth(req, res, next) {
  // El navegador manda el token en un encabezado HTTP así:
  //   Authorization: Bearer eyJhbGciOiJI...
  // Lo separamos de la palabra "Bearer " para quedarnos solo con el token.
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Necesitas iniciar sesión para hacer esto.' })
  }

  let payload
  try {
    // jwt.verify hace dos cosas a la vez: confirma que el token fue firmado
    // con nuestro JWT_SECRET (o sea, que lo emitimos nosotros y nadie lo
    // inventó) y que no ha expirado. Si algo falla, lanza un error.
    // `algorithms` fija el único algoritmo que aceptamos (el mismo con el
    // que firma auth.routes.js), para que nadie pueda colar un token con
    // otro algoritmo.
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
  } catch {
    return res.status(401).json({ error: 'Tu sesión no es válida o ya expiró.' })
  }

  // Un token válido solo prueba que ALGUNA VEZ emitimos una sesión para ese
  // id. Confirmamos que la cuenta siga existiendo, para no aceptar (ni
  // guardar comentarios de) cuentas que ya fueron borradas.
  if (!mongoose.isValidObjectId(payload.sub)) {
    return res.status(401).json({ error: 'Tu sesión no es válida o ya expiró.' })
  }
  const user = await User.findById(payload.sub)
  if (!user) {
    return res.status(401).json({ error: 'Tu sesión no es válida o ya expiró.' })
  }

  // Guardamos al usuario en `req` para que la ruta que sigue (ej. crear un
  // comentario) sepa quién está haciendo la petición. Este id sale del
  // token firmado, NUNCA del body — así nadie puede hacerse pasar por otro.
  req.user = user // sin passwordHash (select: false en el modelo)
  req.userId = user._id.toString()
  next()
}
