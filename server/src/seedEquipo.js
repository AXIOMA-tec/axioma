// ---------------------------------------------------------------------------
// seedEquipo.js — `npm run seed:equipo`
//
// Actualiza SOLO Equipo y Eventos en la base de datos a partir de
// server/src/data/equipoEventos.js. A diferencia de `npm run seed`, NO toca
// problemas, categorías ni comentarios (ese otro comando borra todos los
// comentarios de la gente). Se puede correr las veces que haga falta: borra
// los miembros/eventos anteriores y los vuelve a crear, sin duplicar.
// ---------------------------------------------------------------------------

import 'dotenv/config'
import mongoose from 'mongoose'
import Miembro from './models/Miembro.js'
import Evento from './models/Evento.js'
import { miembros, eventos } from './data/equipoEventos.js'

async function seedEquipo() {
  await mongoose.connect(process.env.MONGO_URI)

  await Promise.all([Miembro.deleteMany({}), Evento.deleteMany({})])
  await Miembro.insertMany(miembros)
  await Evento.insertMany(eventos)
  console.log(`Listo: ${miembros.length} miembros y ${eventos.length} eventos actualizados.`)

  await mongoose.disconnect()
  process.exit(0)
}

seedEquipo().catch((err) => {
  console.error('Error al actualizar equipo y eventos:', err)
  process.exit(1)
})
