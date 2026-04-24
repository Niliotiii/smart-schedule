import { BaseSeeder } from '@adonisjs/lucid/seeders'
import SacramentType from '#models/sacrament_type'

export default class SacramentTypeSeeder extends BaseSeeder {
  async run() {
    await SacramentType.createMany([
      { name: 'Batismo', description: null },
      { name: 'Primeira Eucaristia', description: null },
      { name: 'Crisma', description: null },
    ])
  }
}
