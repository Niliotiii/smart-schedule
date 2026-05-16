import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedules'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('time', 5).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('time')
    })
  }
}
