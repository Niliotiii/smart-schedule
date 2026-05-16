import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('opened_month_id').unsigned().notNullable().references('id').inTable('opened_months').onDelete('CASCADE')
      table.integer('day').notNullable().checkBetween([1, 31])
      table.string('name', 255).notNullable()
      table.text('description').nullable()
      table.integer('community_id').unsigned().notNullable().references('id').inTable('churches')
      table.integer('priest_id').unsigned().notNullable().references('id').inTable('priests')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
