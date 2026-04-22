import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Country from '#models/country'
import countries from '../../database/data/countries.js'

export default class extends BaseSeeder {
  async run() {
    await Country.createMany(countries)
  }
}
