import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedule_roles'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('user_type_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('user_types')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_type_id')
    })
  }
}
