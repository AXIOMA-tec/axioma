// ---------------------------------------------------------------------------
// Comment model — one document per comment/reply on a Problem.
//
// This is deliberately FLAT: a comment belongs to a Problem and has an
// author, full stop — no "reply to a reply" nesting. That matches what the
// AoPS pattern actually is (a statement post, then a flat list of replies
// underneath it), and keeps this first version simpler to build and reason
// about. Nesting could be added later by adding a self-referencing `parent`
// field here, the same trick Category uses to nest folders.
//
// Relaciones (colección `comments`):
//   comments.author  -> users._id     (quién lo escribió)
//   comments.problem -> problems._id  (en qué problema)
// Los IDs son la fuente de verdad: NO copiamos el username ni el título del
// problema aquí; se obtienen con populate() al leer.
//
// A propósito, `problems` NO guarda una lista de IDs de sus comentarios:
// esa lista crecería sin límite, habría que mantenerla sincronizada en dos
// lugares, y nunca la necesitamos — siempre pedimos "los comentarios del
// problema X", y el índice de abajo hace esa consulta rápida.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    // Qué problema está comentando.
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },

    // Quién lo escribió. Es un ObjectId, no un nombre de texto — así, si
    // alguien cambia su username después, sus comentarios viejos siguen
    // apuntando a la cuenta correcta en vez de quedar con un nombre viejo.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'El comentario no puede pasar de 2000 caracteres.'],
    },
  },
  { timestamps: true }, // createdAt es lo que se usa para ordenar los comentarios
)

// Sirve exactamente a la consulta de GET /api/problems/:id/comments
// (filtrar por problema, ordenar por fecha) sin recorrer toda la colección.
commentSchema.index({ problem: 1, createdAt: 1 })

export default mongoose.model('Comment', commentSchema)
