// ---------------------------------------------------------------------------
// User model — one document per person who has created an account.
//
// SKELETON (the shape every Mongoose model in this project follows):
//
//   import mongoose from 'mongoose'
//
//   const algoSchema = new mongoose.Schema({
//     campo1: { type: String, required: true },   // <- blueprint for one field
//     campo2: { type: Number, default: 0 },
//   }, { timestamps: true })                        // <- adds createdAt/updatedAt automatically
//
//   export default mongoose.model('NombreDelModelo', algoSchema)
//
// Every model file in this folder (User, Category, Problem, Comment) is just
// this same pattern with different fields.
//
// Why accounts live HERE (colección `users`) and not in `miembros`:
// `miembros` es la lista del EQUIPO que se muestra en la sección Equipo
// (GET /api/equipo la regresa completa y pública, y `npm run seed` la borra
// y la vuelve a crear). Las cuentas de la gente no pueden vivir ahí.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

// Exportadas para que auth.routes.js valide con EXACTAMENTE las mismas
// reglas antes de tocar la base (y pueda dar mensajes de error claros).
export const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,30}$/
// Deliberadamente simple: "algo@algo.algo" sin espacios. La única forma
// real de saber si un correo existe es mandarle algo.
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const userSchema = new mongoose.Schema(
  {
    // El nombre que se muestra junto a sus comentarios (ej. "elias23").
    username: {
      type: String,
      required: true,
      unique: true, // Mongo rechaza crear un segundo usuario con el mismo username.
      trim: true,
      match: [USERNAME_REGEX, 'El username debe tener 3-30 caracteres: letras, números, "_" o ".".'],
    },

    // Se usa para iniciar sesión. También debe ser único: no puede haber dos
    // cuentas con el mismo correo.
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // normaliza "Ana@Correo.com" -> "ana@correo.com" antes de guardar
      maxlength: 254,
      match: [EMAIL_REGEX, 'El correo no tiene un formato válido.'],
    },

    // IMPORTANTE: nunca guardamos la contraseña real, solo su "hash" — el
    // resultado de pasarla por bcrypt, que no se puede revertir para
    // recuperar la contraseña original. Ver server/src/routes/auth.routes.js
    // para dónde se genera este valor.
    //
    // Solo es obligatorio para cuentas SIN Google: quien se registró con
    // Google no tiene contraseña en Axioma (inicia sesión con Google).
    passwordHash: {
      type: String,
      required: function requiredSinGoogle() {
        return !this.googleId
      },
      // select: false = NINGUNA consulta lo trae a menos que lo pida
      // explícitamente con .select('+passwordHash') (solo el login lo hace).
      // Así, olvidarse de quitarlo en una ruta nueva no lo filtra al frontend.
      select: false,
    },

    // El identificador PERMANENTE de la cuenta de Google (el "sub" del ID
    // token). Se usa este y no el correo para reconocer a alguien, porque
    // el correo de una cuenta de Google puede cambiar; el sub no.
    // sparse: el índice único ignora a quienes no tienen googleId (todas
    // las cuentas con contraseña), así que no chocan entre sí.
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true, // agrega automáticamente createdAt y updatedAt
    // Segunda red de seguridad: aunque algún día se cargue el hash, nunca
    // sale en una respuesta JSON (res.json llama a toJSON por dentro).
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.passwordHash
        delete ret.googleId
        delete ret.__v
        return ret
      },
    },
  },
)

// La forma "pública" de una cuenta: lo único que el frontend necesita saber
// de ella. La usan /signup, /login y /me.
userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    createdAt: this.createdAt,
    conGoogle: Boolean(this.googleId),
  }
}

export default mongoose.model('User', userSchema)
