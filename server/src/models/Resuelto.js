// ---------------------------------------------------------------------------
// Resuelto model — un documento por cada marca de avance en un problema, uno
// por persona por problema. Mismo patrón que Comment.js: guarda los dos IDs
// (quién, qué problema) más un `estado` con dos valores posibles; borrar el
// documento entero significa "desmarcado" (ni en progreso ni resuelto).
//
// Por qué una colección aparte y no un arreglo dentro de User: esto puede
// crecer mucho (una persona puede marcar cientos de problemas) y nunca
// necesitamos "dame el usuario completo con su arreglo enorme" — siempre
// preguntamos "¿qué marcó esta persona?" o "¿marcó este problema?", que es
// justo para lo que sirve el índice de abajo.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

const resueltoSchema = new mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // default 'resuelto' a propósito: los documentos creados antes de que
    // existiera este campo (cuando "existe" ya significaba "resuelto") lo
    // leen como 'resuelto' sin necesitar una migración — Mongoose aplica el
    // default también al leer documentos viejos que no lo tienen guardado.
    estado: {
      type: String,
      enum: ['en_progreso', 'resuelto'],
      default: 'resuelto',
    },
  },
  { timestamps: true },
)

// Único por (problem, author): evita duplicados si alguien marca dos veces
// seguidas (ej. doble clic), y es también el índice que usa la consulta más
// común ("¿esta persona ya marcó este problema?").
resueltoSchema.index({ problem: 1, author: 1 }, { unique: true })

export default mongoose.model('Resuelto', resueltoSchema)
