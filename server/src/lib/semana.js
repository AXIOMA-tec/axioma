// ---------------------------------------------------------------------------
// Problema de la semana: se escoge solo, sin que nadie lo ponga a mano.
//
// Por qué un sorteo "fijo" y no uno al azar de verdad: todos tienen que ver
// el MISMO problema toda la semana, y no queremos guardar nada en la base ni
// depender de que alguien lo cambie. Así que a cada problema se le calcula
// un número (un hash) a partir de la semana y su código, y gana el de número
// más bajo. Para una semana dada el resultado siempre es el mismo; cambia
// solo cuando cambia la semana, y a la gente le parece al azar.
//
// Por qué ese método y no "problema número semana % total": si el equipo
// agrega 40 problemas nuevos a mitad de semana, con el módulo cambiaría el
// problema de la semana de golpe. Con el hash, solo cambia si uno de los
// nuevos saca justo el número más bajo.
// ---------------------------------------------------------------------------

import crypto from 'node:crypto'

const MS_SEMANA = 7 * 24 * 60 * 60 * 1000
const LUNES_BASE = Date.UTC(1970, 0, 5) // un lunes, a las 00:00 UTC
const UTC_MENOS_6 = 6 * 60 * 60 * 1000 // hora de México (sin horario de verano)

// Cuántas semanas completas han pasado desde esa fecha base, contadas con la
// semana empezando el lunes a las 00:00 hora de México.
export function indiceDeSemana(fecha = new Date()) {
  return Math.floor((fecha.getTime() - UTC_MENOS_6 - LUNES_BASE) / MS_SEMANA)
}

const puntaje = (semana, codigo) =>
  crypto.createHash('sha256').update(`${semana}:${codigo}`).digest('hex')

function ganador(candidatos, semana) {
  return candidatos.reduce((mejor, p) =>
    puntaje(semana, p.codigo) < puntaje(semana, mejor.codigo) ? p : mejor,
  )
}

// Cuántas semanas hacia atrás se arranca la cadena para saber cuál fue el de
// la semana anterior (ver abajo). Con 6, que el arranque llegara a importar
// requeriría 6 empates seguidos entre cientos de problemas.
const VENTANA = 6

// Solo problemas Fácil o Media: la mayoría del archivo es Difícil (Putnam B6,
// por ejemplo), y un problema de la semana debe poder intentarlo cualquiera.
// Regresa null si no hay candidatos.
//
// No repite el de la semana anterior: cada semana se sortea entre todos
// MENOS el que salió la semana pasada. Pero el de la semana pasada también
// dependió del anterior a ese, así que se recorre la cadena desde VENTANA
// semanas atrás hasta la actual. (No basta con excluir al que habría ganado
// la semana pasada sin restricciones: ese puede no ser el que realmente se
// mostró, y entonces podría repetirse.)
export function problemaDeLaSemana(problemas, fecha = new Date()) {
  const candidatos = problemas.filter((p) => p.codigo && p.dificultad !== 'Difícil')
  if (candidatos.length === 0) return null
  if (candidatos.length === 1) return candidatos[0]

  const semana = indiceDeSemana(fecha)
  let actual = ganador(candidatos, semana - VENTANA)
  for (let s = semana - VENTANA + 1; s <= semana; s++) {
    actual = ganador(
      candidatos.filter((p) => p.codigo !== actual.codigo),
      s,
    )
  }
  return actual
}
