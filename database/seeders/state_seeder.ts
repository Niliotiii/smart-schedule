import { BaseSeeder } from '@adonisjs/lucid/seeders'
import State from '#models/state'
import states from '../../database/data/states.js'

export default class extends BaseSeeder {
  async run() {
    await State.createMany(
      states.map((s) => ({
        countryId: 1, // Brazil
        ibgeCode: s.ibgeCode,
        uf: s.uf,
        name: s.name,
      }))
    )
  }
}
