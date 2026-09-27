// ---------------------------------------------------------------------------
// Verificación del "credential" que manda el botón de Google del frontend.
//
// Ese credential es un ID token: un JWT firmado por Google que dice "esta
// persona es la cuenta X de Google, con el correo Y". NO confiamos en lo
// que diga hasta que google-auth-library confirme:
//   - que la firma es de Google (descarga y cachea sus llaves públicas),
//   - que no ha expirado,
//   - que fue emitido PARA NUESTRA app (audience = GOOGLE_CLIENT_ID); sin
//     esto, un token que alguien obtuvo en OTRA app serviría aquí también.
//
// Vive en su propio archivo para que las pruebas puedan reemplazarlo
// (vi.mock) sin hablar con Google de verdad.
// ---------------------------------------------------------------------------

import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client()

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID)
}

// Regresa { googleId, email, emailVerified, name } o lanza un error si el
// token no es válido.
export async function verifyGoogleCredential(credential) {
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const payload = ticket.getPayload()
  return {
    googleId: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified === true,
    name: payload.name,
  }
}
