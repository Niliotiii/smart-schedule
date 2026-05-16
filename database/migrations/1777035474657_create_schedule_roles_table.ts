import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedule_roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('schedule_id').unsigned().notNullable().references('id').inTable('schedules').onDelete('CASCADE')
      table.integer('ministry_role_id').unsigned().notNullable().references('id').inTable('ministry_roles').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
