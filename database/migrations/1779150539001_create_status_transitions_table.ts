import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'status_transitions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('opened_month_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('opened_months')
        .onDelete('CASCADE')
      table.string('from_status', 20).notNullable()
      table.string('to_status', 20).notNullable()
      table
        .integer('changed_by_user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('changed_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
