// ---------------------------------------------------------------------------
// renombrarCodigosOmum.js — corrección puntual, de una sola vez: el campo
// `codigo` de los problemas OMUM se sembró originalmente como "OMMU-..."
// (categorías y `tipo` ya se habían corregido a mano en la base de datos,
// pero `codigo` no). Este script solo renombra ese campo, en el mismo
// documento (mismo _id), para que quede en sincronía con
// problemasReales.js. No borra ni recrea nada.
// ---------------------------------------------------------------------------

import 'dotenv/config'
import mongoose from 'mongoose'
import Problem from './models/Problem.js'

async function run() {
  await mongoose.connect(process.env.MONGO_URI)

  const afectados = await Problem.find({ codigo: /^OMMU/ })
  let actualizados = 0
  for (const p of afectados) {
    p.codigo = p.codigo.replace(/^OMMU/, 'OMUM')
    await p.save()
    actualizados++
  }

  console.log(`Listo: ${actualizados} códigos renombrados de OMMU- a OMUM-.`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Error al renombrar códigos:', err)
  process.exit(1)
})
