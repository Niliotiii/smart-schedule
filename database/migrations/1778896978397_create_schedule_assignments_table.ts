import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedule_assignments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('schedule_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('schedules')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('ministry_role_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('ministry_roles')
        .onDelete('CASCADE')
      table.unique(['schedule_id', 'user_id', 'ministry_role_id'])
      table.index(['schedule_id'], 'idx_schedule_assignments_schedule')
      table.index(['user_id'], 'idx_schedule_assignments_user')
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
