import mongoose from 'mongoose'

const miembroSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  rol: { type: String, required: true },
  foto: { type: String, default: null },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  orden: { type: Number, default: 0 },
})

export default mongoose.model('Miembro', miembroSchema)
