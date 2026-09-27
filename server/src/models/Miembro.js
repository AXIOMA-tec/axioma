import mongoose from 'mongoose'

// Coordinadores de un director (1 a 4 normalmente). Van dentro de la ficha del
// director: no son miembros aparte. Solo `nombre` es obligatorio.
const coordinadorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    rol: { type: String, default: '' },
    foto: { type: String, default: null },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
  },
  { _id: false },
)

const miembroSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  rol: { type: String, required: true },
  foto: { type: String, default: null },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  orden: { type: Number, default: 0 },
  coordinadores: { type: [coordinadorSchema], default: [] },
})

export default mongoose.model('Miembro', miembroSchema)
