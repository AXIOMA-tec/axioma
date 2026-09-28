import mongoose from 'mongoose'

// Coordinadores de un director (1 a 4 normalmente). Van dentro de la ficha del
// director: no son miembros aparte. Datos: nombre, puesto (rol), correo,
// LinkedIn y GitHub (+ foto), todos opcionales salvo `nombre`.
const coordinadorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    rol: { type: String, default: '' },
    email: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    foto: { type: String, default: null },
  },
  { _id: false },
)

const miembroSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  rol: { type: String, required: true },
  foto: { type: String, default: null },
  email: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  orden: { type: Number, default: 0 },
  coordinadores: { type: [coordinadorSchema], default: [] },
})

export default mongoose.model('Miembro', miembroSchema)
