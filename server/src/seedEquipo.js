// ---------------------------------------------------------------------------
// seedEquipo.js — `npm run seed:equipo`
//
// Actualiza SOLO Equipo (Miembro) en la base de datos a partir de
// server/src/data/equipoEventos.js. A diferencia de `npm run seed`, NO toca
// problemas, categorías ni comentarios (ese otro comando borra todos los
// comentarios de la gente). Se puede correr las veces que haga falta: borra
// los miembros anteriores y los vuelve a crear, sin duplicar.
//
// YA NO TOCA EVENTOS. Antes también borraba y recreaba la colección Evento
// a partir de un arreglo `eventos` en equipoEventos.js — pero los eventos
// reales se manejan por completo desde /admin/eventos (crear/editar/borrar
// vía la API), no desde este archivo. Ese arreglo se quedó con datos de
// prueba viejos sin que nadie lo notara, y un `npm run seed:equipo`
// "inocente" (solo para agregar gente al equipo) terminó borrando los
// eventos reales de la base de datos. No vuelvas a agregar Evento aquí.
// ---------------------------------------------------------------------------

import 'dotenv/config'
import mongoose from 'mongoose'
import Miembro from './models/Miembro.js'
import { miembros } from './data/equipoEventos.js'

async function seedEquipo() {
  await mongoose.connect(process.env.MONGO_URI)

  await Miembro.deleteMany({})
  await Miembro.insertMany(miembros)
  console.log(`Listo: ${miembros.length} miembros actualizados.`)

  await mongoose.disconnect()
  process.exit(0)
}

seedEquipo().catch((err) => {
  console.error('Error al actualizar equipo y eventos:', err)
  process.exit(1)
})
