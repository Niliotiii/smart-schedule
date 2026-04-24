import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sacraments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table
        .integer('sacrament_type_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('sacrament_types')
      table.date('received_date').notNullable()
      table.string('received_church', 255).notNullable()
      table
        .integer('received_country_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('countries')
      table.integer('received_state_id').unsigned().notNullable().references('id').inTable('states')
      table.integer('received_city_id').unsigned().notNullable().references('id').inTable('cities')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
