import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import State from '#models/state'
import cities from '../../database/data/cities.js'

export default class extends BaseSeeder {
  async run() {
    const states = await State.all()
    const stateMap = new Map(states.map((s) => [s.uf, s.id]))

    const chunks = []
    for (let i = 0; i < cities.length; i += 500) {
      chunks.push(cities.slice(i, i + 500))
    }

    for (const chunk of chunks) {
      const rows = chunk
        .map((c) => {
          const stateId = stateMap.get(c.stateUf)
          if (!stateId) return null
          return {
            state_id: stateId,
            ibge_code: c.ibgeCode,
            name: c.name,
            created_at: new Date(),
            updated_at: new Date(),
          }
        })
        .filter((r): r is NonNullable<typeof r> => r !== null)

      if (rows.length > 0) {
        await db.insertQuery().table('cities').multiInsert(rows)
      }
    }
  }
}
