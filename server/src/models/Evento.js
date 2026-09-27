import mongoose from 'mongoose'

const eventoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  tipo: { type: String, enum: ['proximo', 'pasado'], required: true },
  titulo: { type: String, required: true },
  fecha: { type: String, required: true },
  lugar: { type: String, default: '' },
  alt: { type: String, default: '' },
  src: { type: String, default: null },
  link: { type: String, default: null },
  orden: { type: Number, default: 0 },
})

export default mongoose.model('Evento', eventoSchema)
