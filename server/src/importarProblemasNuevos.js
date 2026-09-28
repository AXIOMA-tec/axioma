// ---------------------------------------------------------------------------
// importarProblemasNuevos.js — versión aditiva de seed.js para el lote de
// problemas Putnam históricos: a diferencia de seed.js, NUNCA borra nada.
// Solo crea las categorías/problemas que todavía no existen (buscando por
// nombre+padre y por `codigo` respectivamente) y, si un problema ya existe
// pero le falta `solucion`, se la agrega sin tocar el resto de sus campos.
// Es seguro correrlo varias veces: la segunda vez no crea duplicados.
//
// Se usa en vez de seed.js porque la base de datos real ya tiene comentarios
// de usuarios reales, y seed.js borra la colección de comentarios entera
// antes de resembrar.
// ---------------------------------------------------------------------------

import 'dotenv/config'
import mongoose from 'mongoose'
import Category from './models/Category.js'
import Problem from './models/Problem.js'
import { categorias, problemas } from './data/problemasReales.js'

async function run() {
  await mongoose.connect(process.env.MONGO_URI)

  const idPorKey = new Map()
  for (const c of categorias) {
    const parentId = c.parent ? idPorKey.get(c.parent) : null
    let doc = await Category.findOne({ name: c.name, parent: parentId })
    if (!doc) {
      doc = await Category.create({ name: c.name, parent: parentId })
      console.log(`Categoría creada: ${c.name} (${c.key})`)
    }
    idPorKey.set(c.key, doc._id)
  }

  let creados = 0
  let solucionesAgregadas = 0
  for (const { categoriaKey, ...resto } of problemas) {
    const existente = await Problem.findOne({ codigo: resto.codigo })
    if (existente) {
      if (resto.solucion && !existente.solucion) {
        existente.solucion = resto.solucion
        await existente.save()
        solucionesAgregadas++
      }
      continue
    }
    await Problem.create({ ...resto, category: idPorKey.get(categoriaKey) })
    creados++
  }

  console.log(`Listo: ${creados} problemas nuevos creados, ${solucionesAgregadas} soluciones agregadas a problemas existentes.`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Error al importar problemas nuevos:', err)
  process.exit(1)
})
