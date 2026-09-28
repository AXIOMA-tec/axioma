import mongoose from 'mongoose'

// Una foto de la Galería (src/components/sections/Galeria.jsx). `id` es
// numérico y lo usa la página pública para las filas que se repiten y el
// visor; `ratio` (ancho / entre alto) decide qué tan ancha se ve la foto
// en su fila de altura fija — se calcula solo al subir la imagen desde
// /admin/galeria, no hay que escribirlo a mano.
const fotoSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    src: { type: String, required: true },
    alt: { type: String, required: true },
    ratio: { type: Number, required: true },
    orden: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.model('Foto', fotoSchema)
