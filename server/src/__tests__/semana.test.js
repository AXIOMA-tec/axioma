// ---------------------------------------------------------------------------
// Pruebas del problema de la semana (server/src/lib/semana.js). No necesitan
// base de datos: el sorteo es una función pura de (problemas, fecha).
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Problem from '../models/Problem.js'
import { indiceDeSemana, problemaDeLaSemana } from '../lib/semana.js'

// 40 problemas: la mitad Fácil/Media, la mitad Difícil.
const problemas = Array.from({ length: 40 }, (_, i) => ({
  codigo: `TEST-${i + 1}`,
  dificultad: ['Fácil', 'Media', 'Difícil', 'Difícil'][i % 4],
}))

// Hora de México = UTC-6, así que el lunes 00:00 allá es el lunes 06:00 UTC.
const lunesMX = (dia) => new Date(`2026-10-${dia}T06:00:00Z`)

describe('indiceDeSemana', () => {
  it('cambia justo el lunes a las 00:00 de México, no antes', () => {
    const domingoNoche = new Date('2026-10-12T05:59:59Z') // dom 23:59:59 en México
    const lunesInicio = new Date('2026-10-12T06:00:00Z') // lun 00:00:00 en México
    expect(indiceDeSemana(lunesInicio)).toBe(indiceDeSemana(domingoNoche) + 1)
  })

  it('es el mismo toda la semana, de lunes a domingo', () => {
    const lunes = indiceDeSemana(new Date('2026-10-12T06:00:00Z'))
    expect(indiceDeSemana(new Date('2026-10-14T18:00:00Z'))).toBe(lunes)
    expect(indiceDeSemana(new Date('2026-10-19T05:59:00Z'))).toBe(lunes)
  })
})

describe('problemaDeLaSemana', () => {
  it('toda la semana regresa el mismo problema', () => {
    const lunes = problemaDeLaSemana(problemas, lunesMX('12'))
    const jueves = problemaDeLaSemana(problemas, new Date('2026-10-15T20:00:00Z'))
    const domingo = problemaDeLaSemana(problemas, new Date('2026-10-19T05:00:00Z'))
    expect(jueves.codigo).toBe(lunes.codigo)
    expect(domingo.codigo).toBe(lunes.codigo)
  })

  it('nunca escoge un problema Difícil', () => {
    for (let semana = 0; semana < 200; semana++) {
      const fecha = new Date(lunesMX('12').getTime() + semana * 7 * 24 * 3600 * 1000)
      expect(problemaDeLaSemana(problemas, fecha).dificultad).not.toBe('Difícil')
    }
  })

  it('no repite el de la semana anterior', () => {
    for (let semana = 1; semana < 200; semana++) {
      const base = lunesMX('12').getTime() + semana * 7 * 24 * 3600 * 1000
      const esta = problemaDeLaSemana(problemas, new Date(base))
      const anterior = problemaDeLaSemana(problemas, new Date(base - 7 * 24 * 3600 * 1000))
      expect(esta.codigo).not.toBe(anterior.codigo)
    }
  })

  it('va variando de semana en semana (no se queda en uno)', () => {
    const distintos = new Set()
    for (let semana = 0; semana < 30; semana++) {
      const fecha = new Date(lunesMX('12').getTime() + semana * 7 * 24 * 3600 * 1000)
      distintos.add(problemaDeLaSemana(problemas, fecha).codigo)
    }
    expect(distintos.size).toBeGreaterThan(10)
  })

  it('no depende del orden en que vengan los problemas', () => {
    const fecha = lunesMX('12')
    const alReves = [...problemas].reverse()
    expect(problemaDeLaSemana(alReves, fecha).codigo).toBe(problemaDeLaSemana(problemas, fecha).codigo)
  })

  it('regresa null si no hay problemas accesibles, y no truena con uno solo', () => {
    expect(problemaDeLaSemana([], lunesMX('12'))).toBeNull()
    expect(problemaDeLaSemana([{ codigo: 'X', dificultad: 'Difícil' }], lunesMX('12'))).toBeNull()
    expect(problemaDeLaSemana([{ codigo: 'X', dificultad: 'Media' }], lunesMX('12')).codigo).toBe('X')
  })
})

describe('GET /api/problems marca el problema de la semana', () => {
  it('exactamente uno trae deLaSemana: true, y es Fácil o Media', async () => {
    const categoria = await Category.create({ name: 'Categoría de prueba' })
    const base = { enunciado: 'x', category: categoria._id, año: '2024', tema: 'Álgebra', tipo: 'Interno Axioma' }
    await Problem.create([
      { ...base, codigo: 'A-1', titulo: 'a', dificultad: 'Fácil' },
      { ...base, codigo: 'A-2', titulo: 'b', dificultad: 'Media' },
      { ...base, codigo: 'A-3', titulo: 'c', dificultad: 'Difícil' },
    ])

    const res = await request(app).get('/api/problems')
    const marcados = res.body.filter((p) => p.deLaSemana)
    expect(marcados).toHaveLength(1)
    expect(marcados[0].dificultad).not.toBe('Difícil')
  })

  it('si solo hay problemas Difíciles, ninguno se marca', async () => {
    const categoria = await Category.create({ name: 'Categoría de prueba' })
    await Problem.create({
      codigo: 'D-1', titulo: 'd', enunciado: 'x', category: categoria._id,
      año: '2024', tema: 'Álgebra', tipo: 'Interno Axioma', dificultad: 'Difícil',
    })
    const res = await request(app).get('/api/problems')
    expect(res.body.some((p) => p.deLaSemana)).toBe(false)
  })
})
