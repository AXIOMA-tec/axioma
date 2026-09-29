// ---------------------------------------------------------------------------
// Recurso model — un documento descargable (PDF, casi siempre) que un
// admin/asesor sube desde /admin/recursos, para compartir exámenes o
// material sin tener que transcribir cada problema como entrada del
// archivo buscable (eso sigue siendo Problem, ver ese modelo). Un Recurso
// es solo "aquí hay un archivo, descárgalo" — no se puede buscar por tema,
// filtrar, ni comentar problema por problema.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

const recursoSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, default: '', trim: true },
    // URL de Cloudinary (subirArchivo en src/lib/cloudinary.js).
    archivo: { type: String, required: true },
    orden: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.model('Recurso', recursoSchema)
