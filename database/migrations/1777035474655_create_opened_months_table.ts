import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'opened_months'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('year').notNullable()
      table.integer('month').notNullable().checkBetween([1, 12])
      table.timestamp('opened_at').notNullable()
      table.integer('signaling_period_days').notNullable().checkPositive()
      table.timestamp('signaling_deadline').notNullable()
      table.integer('created_by_user_id').unsigned().notNullable().references('id').inTable('users')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
